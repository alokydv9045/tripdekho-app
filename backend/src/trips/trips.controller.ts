import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Patch,
  Query,
  Param,
  Req,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CacheInterceptor, CacheTTL, CacheKey } from '@nestjs/cache-manager';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { CreateTripCommand } from './commands/create-trip.command';
import { SearchTripsQuery } from './queries/search-trips.query';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { TripEntity } from '../entities/trip.entity';
import { TripMediaEntity, MediaType } from '../entities/trip-media.entity';
import { Repository, Like } from 'typeorm';
import { VendorEntity } from '../entities/vendor.entity';
import { StorageService } from '../storage/storage.service';

import { ITripRepository } from './ports/trip.repository.interface';
import { Inject } from '@nestjs/common';
import { ActivityService } from '../activity/activity.service';
import { ActivityAction } from '../entities/user-activity.entity';

@Controller('trips')
export class TripsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @InjectRepository(TripEntity)
    private readonly tripRepo: Repository<TripEntity>,
    @InjectRepository(TripMediaEntity)
    private readonly tripMediaRepo: Repository<TripMediaEntity>,
    @InjectRepository(VendorEntity)
    private readonly vendorRepo: Repository<VendorEntity>,
    private readonly storageService: StorageService,
    @Inject(ITripRepository)
    private readonly tripRepository: ITripRepository,
    private readonly activityService: ActivityService,
  ) {}

  @Post()
  async createTrip(
    @CurrentUser('id') userId: string,
    @Body() createTripDto: CreateTripDto,
  ) {
    // Enforce KYC check — vendor must be verified before creating trips
    const vendor = await this.vendorRepo.findOne({
      where: { user: { id: userId } },
    });
    if (
      vendor &&
      vendor.kycStatus !== 'approved' &&
      vendor.kycStatus !== 'verified'
    ) {
      throw new ForbiddenException(
        'KYC verification required. Please complete your KYC before creating trips.',
      );
    }
    return this.commandBus.execute(
      new CreateTripCommand(userId, createTripDto),
    );
  }

  @Public()
  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60000) // Cache API responses in memory for 60 seconds
  async searchTrips(
    @Query('q') q?: string,
    @Query('category') category?: string,
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('tags') tags?: string,
    @Query('featured') featured?: string,
    @Query('sortBy') sortBy?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('userLat') userLat?: number,
    @Query('userLng') userLng?: number,
    @CurrentUser('id') userId?: string,
  ) {
    const skip = (page - 1) * limit;
    const tagArray = tags ? tags.split(',') : undefined;

    const result = await this.queryBus.execute(
      new SearchTripsQuery({
        q,
        category,
        city,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        tags: tagArray,
        featured: featured === 'true' ? true : undefined,
        sortBy,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        userLat: userLat ? Number(userLat) : undefined,
        userLng: userLng ? Number(userLng) : undefined,
        limit: Number(limit),
        skip,
      }),
    );

    // Log search activity unconditionally (guest or logged-in)
    this.activityService.logActivity(userId || '', ActivityAction.SEARCH, {
      q,
      category,
      city,
      tags: tagArray,
    });

    return result;
  }

  @Get('my-trips')
  async getMyTrips(@CurrentUser('id') userId: string, @Query() query: any) {
    const trips = await this.tripRepo.find({
      where: { vendor: { user: { id: userId } } },
      relations: {
        location: true,
        price: true,
        dates: true,
        media: true,
        vendor: true,
      },
      order: { createdAt: 'DESC' },
    });

    // Lazy Evaluation: Automatically mark published trips as completed if all dates have passed
    let needsSave = false;
    const now = new Date();
    for (const trip of trips) {
      if (
        trip.status === ('published' as any) &&
        trip.dates &&
        trip.dates.length > 0
      ) {
        const allDatesPast = trip.dates.every((d) => new Date(d.endDate) < now);
        if (allDatesPast) {
          trip.status = 'completed' as any;
          needsSave = true;
        }
      }
    }

    if (needsSave) {
      await this.tripRepo.save(
        trips.filter((t) => t.status === ('completed' as any)),
      );
    }

    // Attach vendor stats
    const vendorIds = [
      ...new Set(trips.map((t) => t.vendor?.id).filter(Boolean)),
    ];
    if (vendorIds.length > 0) {
      const stats = await this.tripRepository.getVendorStats(vendorIds);
      for (const trip of trips) {
        if (trip.vendor) {
          const vStats = stats[trip.vendor.id] || { rating: 0, count: 0 };
          (trip as any).stats = {
            rating: vStats.rating,
            reviews: vStats.count,
          };
        }
      }
    }

    return { success: true, data: trips };
  }

  @Public()
  @Get(':idOrSlug')
  async getTripById(
    @Param('idOrSlug') idOrSlug: string,
    @CurrentUser('id') userId?: string,
  ) {
    const isUuid =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        idOrSlug,
      );
    let trip;
    if (isUuid) {
      trip = await this.tripRepo.findOne({
        where: { id: idOrSlug },
        relations: {
          location: true,
          price: true,
          dates: true,
          itinerary: true,
          media: true,
          vendor: true,
        },
      });
    } else {
      trip = await this.tripRepo.findOne({
        where: { slug: idOrSlug },
        relations: {
          location: true,
          price: true,
          dates: true,
          itinerary: true,
          media: true,
          vendor: true,
        },
      });
    }
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    // Attach vendor stats
    if (trip.vendor) {
      const stats = await this.tripRepository.getVendorStats([trip.vendor.id]);
      const vStats = stats[trip.vendor.id] || { rating: 0, count: 0 };
      (trip as any).stats = {
        rating: vStats.rating,
        reviews: vStats.count,
      };
    }

    // Log trip view unconditionally (guest or logged-in)
    this.activityService.logActivity(userId || '', ActivityAction.VIEW_TRIP, {
      tripId: trip.id,
      tripSlug: trip.slug,
      tripTitle: trip.title,
    });

    return { success: true, data: trip };
  }

  @Put(':id')
  async updateTrip(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateData: UpdateTripDto,
  ) {
    const trip = await this.tripRepo.findOne({
      where: { id },
      relations: {
        location: true,
        price: true,
        dates: true,
        itinerary: true,
        media: true,
        vendor: { user: true },
      },
    });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    if (trip.vendor?.user?.id !== userId) {
      throw new ForbiddenException('You do not own this trip');
    }
    // Merge price relation deeply to avoid orphaned columns like occupancyOptions
    if (updateData.price) {
      if (!trip.price)
        trip.price = this.tripRepo.manager.create('TripPriceEntity');
      Object.assign(trip.price, updateData.price);
      delete updateData.price;
    }

    Object.assign(trip, updateData);
    const updated = await this.tripRepo.save(trip);
    return { success: true, data: updated };
  }

  @Delete(':id')
  async deleteTrip(@CurrentUser('id') userId: string, @Param('id') id: string) {
    const trip = await this.tripRepo.findOne({
      where: { id },
      relations: { vendor: { user: true } },
    });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    if (trip.vendor?.user?.id !== userId) {
      throw new ForbiddenException('You do not own this trip');
    }
    await this.tripRepo.softDelete(id);
    return { success: true, message: 'Trip deleted successfully' };
  }

  @Patch(':id/publish')
  async publishTrip(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    await this.tripRepo.update(id, {
      status: 'published' as any,
      publishedAt: new Date(),
    });
    return { success: true, message: 'Trip published successfully' };
  }

  @Patch(':id/unpublish')
  async unpublishTrip(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    await this.tripRepo.update(id, { status: 'paused' as any });
    return { success: true, message: 'Trip unpublished successfully' };
  }

  @Public()
  @Get(':id/reviews')
  async getTripReviews(@Param('id') id: string, @Query() query: any) {
    // Will be handled by ReviewsModule when fully implemented
    return { success: true, data: [], meta: { total: 0, page: 1 } };
  }

  @Post(':id/images')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB for trip images
      fileFilter: (_req, file, cb) => {
        if (
          !file.mimetype.startsWith('image/') &&
          !file.mimetype.startsWith('video/')
        ) {
          return cb(
            new BadRequestException('Only image and video files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadImages(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        'No file uploaded. Send a file with field name "file".',
      );
    }

    const trip = await this.tripRepo.findOne({ where: { id } });
    if (!trip) throw new NotFoundException('Trip not found');

    // Upload to Cloudinary
    const isVideo = file.mimetype.startsWith('video/');
    const result = await this.storageService.uploadImage(file, {
      folder: `tripdekho/trips/${id}`,
      maxFileSize: 10 * 1024 * 1024,
      allowedMimeTypes: [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'video/mp4',
        'video/webm',
      ],
    });

    // Save to trip_media table
    const media = this.tripMediaRepo.create({
      trip,
      url: result.secureUrl,
      publicId: result.publicId,
      type: isVideo ? MediaType.VIDEO : MediaType.IMAGE,
      isPrimary: false,
    });
    await this.tripMediaRepo.save(media);

    return {
      success: true,
      data: {
        id: media.id,
        url: result.secureUrl,
        publicId: result.publicId,
        isPrimary: false,
      },
      message: 'Image uploaded successfully',
    };
  }

  @Delete(':id/images/:imageId')
  async deleteImage(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Param('imageId') imageId: string,
  ) {
    const media = await this.tripMediaRepo.findOne({
      where: { id: imageId, trip: { id } },
    });
    if (!media) throw new NotFoundException('Image not found');

    // Delete from Cloudinary
    if (media.publicId) {
      await this.storageService.deleteImage(media.publicId);
    }

    // Delete from database
    await this.tripMediaRepo.remove(media);

    return {
      success: true,
      message: 'Image deleted from Cloudinary and database',
    };
  }

  @Public()
  @Get(':id/availability')
  async checkAvailability(
    @Param('id') id: string,
    @Query('departureId') departureId: string,
    @Query('guests') guests: number,
  ) {
    const trip = await this.tripRepo.findOne({
      where: { id },
      relations: { dates: true },
    });
    if (!trip) return { success: false, message: 'Trip not found' };
    const departure = trip.dates?.find((d) => d.id === departureId);
    return {
      success: true,
      data: { available: !!departure, maxGroupSize: trip.maxGroupSize, guests },
    };
  }

  @Public()
  @Get(':id/similar')
  async getSimilarTrips(
    @Param('id') id: string,
    @Query('limit') limit: number = 4,
  ) {
    const trip = await this.tripRepo.findOne({ where: { id } });
    if (!trip) return { success: true, data: [] };
    const similar = await this.tripRepo.find({
      where: {
        category:
          trip.category?.length > 0 ? Like(`%${trip.category[0]}%`) : undefined,
        isActive: true,
      },
      take: limit,
      relations: { location: true, price: true, media: true },
    });
    return { success: true, data: similar.filter((t) => t.id !== id) };
  }
}
