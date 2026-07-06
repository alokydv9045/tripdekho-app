import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  UseInterceptors,
  NotFoundException,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { CreateVendorCommand } from './commands/create-vendor.command';
import { GetVendorQuery } from './queries/get-vendor.query';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { VendorEntity } from '../entities/vendor.entity';
import { UserEntity } from '../entities/user.entity';
import { TripEntity } from '../entities/trip.entity';
import { ReviewEntity } from '../reviews/entities/review.entity';
import { BookingEntity } from '../entities/booking.entity';
import { Repository } from 'typeorm';
import { Public } from '../common/decorators/public.decorator';
import { StorageService } from '../storage/storage.service';
import { ConfigService } from '@nestjs/config';

@Controller('vendors')
export class VendorsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @InjectRepository(VendorEntity)
    private readonly vendorRepo: Repository<VendorEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Get(':id/public-profile')
  async getPublicVendorProfile(@Param('id') id: string) {
    const vendor = await this.vendorRepo.findOne({
      where: { id, isDeleted: false },
      relations: { user: true },
    });
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    // Get published trips with relations
    const trips = await this.vendorRepo.manager.find(TripEntity, {
      where: { vendor: { id }, status: 'published' as any, isDeleted: false },
      relations: { location: true, price: true, dates: true },
      order: { createdAt: 'DESC' },
    });

    // Get total bookings count
    const totalBookings = await this.vendorRepo.manager.count(BookingEntity, {
      where: { vendor: { id } },
    });

    // Get reviews for all vendor trips
    const tripIds = trips.map((t) => t.id);
    let reviews: any[] = [];
    let avgRating = 0;
    let totalReviews = 0;

    if (tripIds.length > 0) {
      const reviewQuery = this.vendorRepo.manager
        .createQueryBuilder(ReviewEntity, 'review')
        .leftJoinAndSelect('review.user', 'user')
        .leftJoinAndSelect('review.trip', 'trip')
        .where('review.trip_id IN (:...tripIds)', { tripIds })
        .andWhere('review.status = :status', { status: 'approved' })
        .orderBy('review.created_at', 'DESC');

      reviews = await reviewQuery.take(10).getMany();

      const ratingResult = await this.vendorRepo.manager
        .createQueryBuilder(ReviewEntity, 'review')
        .where('review.trip_id IN (:...tripIds)', { tripIds })
        .andWhere('review.status = :status', { status: 'approved' })
        .select('AVG(review.rating)', 'avg')
        .addSelect('COUNT(review.id)', 'count')
        .getRawOne();

      avgRating = parseFloat(ratingResult?.avg) || 0;
      totalReviews = parseInt(ratingResult?.count) || 0;
    }

    // Build safe public profile
    return {
      success: true,
      data: {
        vendor: {
          id: vendor.id,
          // user.name is the single source of truth; businessName is kept in sync
          businessName: vendor.user?.name || vendor.businessName,
          description: vendor.description,
          logo: vendor.logo?.url || vendor.logo || null,
          bannerUrl: vendor.banner?.url || null,
          contactEmail: vendor.contactEmail,
          contactPhone: vendor.contactPhone,
          verificationStatus: vendor.verificationStatus,
          createdAt: vendor.createdAt,
        },
        stats: {
          totalTrips: trips.length,
          totalBookings,
          avgRating: Math.round(avgRating * 10) / 10,
          totalReviews,
        },
        trips: trips.map((t) => ({
          id: t.id,
          slug: t.slug,
          title: t.title,
          shortDescription: t.shortDescription,
          category: t.category,
          difficulty: t.difficulty,
          durationDays: t.durationDays,
          durationNights: t.durationNights,
          thumbnail: t.thumbnail,
          location: t.location,
          price: t.price,
          highlights: t.highlights,
          isFeatured: t.isFeatured,
          dates: t.dates,
        })),
        reviews: reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          response: r.response,
          createdAt: r.createdAt,
          user: {
            name: r.user?.name,
          },
          trip: {
            title: r.trip?.title,
            slug: r.trip?.slug,
          },
        })),
      },
    };
  }

  @Post()
  async createVendor(
    @CurrentUser('id') userId: string,
    @Body() createVendorDto: CreateVendorDto,
  ) {
    return this.commandBus.execute(
      new CreateVendorCommand(userId, createVendorDto),
    );
  }

  @Get('me')
  async getCurrentVendor(@CurrentUser('id') userId: string) {
    const vendor = await this.vendorRepo.findOne({
      where: { user: { id: userId } },
      relations: { user: true },
    });
    if (!vendor) {
      return { success: false, message: 'Vendor profile not found' };
    }
    return { success: true, data: vendor };
  }

  @Get(':id')
  async getVendor(@Param('id') id: string) {
    return this.queryBus.execute(new GetVendorQuery(id));
  }

  @Get(':id/dashboard')
  async getVendorDashboard(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    const totalTrips = await this.vendorRepo.manager.count(TripEntity, {
      where: { vendor: { id } },
    });
    const totalBookings = await this.vendorRepo.manager.count(BookingEntity, {
      where: { vendor: { id } },
    });
    const { sum: totalEarnings } = await this.vendorRepo.manager
      .createQueryBuilder(BookingEntity, 'booking')
      .where('booking.vendorId = :id', { id })
      .andWhere('booking.paymentStatus = :status', { status: 'paid' })
      .select('SUM(booking.vendorAmount)', 'sum')
      .getRawOne();

    return {
      success: true,
      data: {
        totalTrips,
        totalBookings,
        totalEarnings: Number(totalEarnings) || 0,
        pendingPayouts: 0,
      },
    };
  }

  @Get(':id/earnings')
  async getVendorEarnings(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    const bookings = await this.vendorRepo.manager.find('BookingEntity', {
      where: { vendor: { id }, paymentStatus: 'paid' },
      order: { id: 'DESC' } as any,
      take: 50,
    });
    const earnings = bookings.map((b: any) => ({
      id: b.id,
      amount: b.vendorAmount,
      month: new Date(b.createdAt).toLocaleString('default', {
        month: 'short',
      }),
      count: 1,
    }));
    return { success: true, data: earnings };
  }

  @Get(':id/trips')
  async getVendorTrips(@Param('id') id: string) {
    const trips = await this.vendorRepo.manager.find(TripEntity, {
      where: { vendor: { id } },
    });
    return { success: true, data: trips };
  }

  @Get(':id/bookings')
  async getVendorBookings(@Param('id') id: string) {
    const bookings = await this.vendorRepo.manager.find(BookingEntity, {
      where: { vendor: { id } },
      relations: { trip: true, user: true, departure: true },
      order: { createdAt: 'DESC' },
    });
    return { success: true, data: bookings };
  }

  @Put(':id')
  async updateVendor(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateData: UpdateVendorDto & { name?: string },
  ) {
    // Extract name from the body — it goes to users table, not vendors table
    const { name, ...vendorUpdateData } = updateData;

    // Update vendor fields
    if (Object.keys(vendorUpdateData).length > 0) {
      await this.vendorRepo.update(id, vendorUpdateData);
    }

    // Sync user.name AND businessName if name is provided (keeps all queries consistent)
    if (name) {
      await this.userRepo.update(userId, { name });
      await this.vendorRepo.update(id, { businessName: name });
    }

    const updated = await this.vendorRepo.findOne({
      where: { id },
      relations: { user: true },
    });
    return { success: true, data: updated };
  }

  /**
   * Upload or replace vendor logo via Cloudinary.
   */
  @Post(':id/logo')
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadLogo(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        'No logo file provided. Send a file with field name "logo".',
      );
    }

    const vendor = await this.vendorRepo.findOne({ where: { id } });
    if (!vendor) {
      throw new BadRequestException('Vendor not found');
    }

    // Delete old logo from Cloudinary
    if (vendor.logo?.publicId) {
      await this.storageService.deleteImage(vendor.logo.publicId);
    }

    // Upload new logo
    const result = await this.storageService.uploadImage(file, {
      folder: `tripdekho/vendors`,
      maxFileSize: 5 * 1024 * 1024,
      transformation: {
        width: 400,
        height: 400,
        crop: 'fill',
      },
    });

    vendor.logo = { url: result.secureUrl, publicId: result.publicId };
    await this.vendorRepo.save(vendor);

    return {
      success: true,
      message: 'Vendor logo uploaded successfully',
      data: { logo: vendor.logo },
    };
  }

  /**
   * Upload or replace vendor banner/hero image via Cloudinary.
   */
  @Post(':id/banner')
  @UseInterceptors(
    FileInterceptor('banner', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadBanner(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        'No banner file provided. Send a file with field name "banner".',
      );
    }

    const vendor = await this.vendorRepo.findOne({ where: { id } });
    if (!vendor) {
      throw new BadRequestException('Vendor not found');
    }

    // Delete old banner from Cloudinary
    if (vendor.banner?.publicId) {
      await this.storageService.deleteImage(vendor.banner.publicId);
    }

    // Upload new banner (wide format for hero section)
    const result = await this.storageService.uploadImage(file, {
      folder: `tripdekho/vendors/banners`,
      maxFileSize: 10 * 1024 * 1024,
      transformation: {
        width: 1920,
        height: 600,
        crop: 'fill',
        gravity: 'auto',
      },
    });

    vendor.banner = { url: result.secureUrl, publicId: result.publicId };
    await this.vendorRepo.save(vendor);

    return {
      success: true,
      message: 'Vendor banner uploaded successfully',
      data: { banner: vendor.banner },
    };
  }

  @Post(':id/razorpay-account')
  async createRazorpayAccount(@Param('id') id: string) {
    const rzpId = this.configService.get<string>('RAZORPAY_KEY_ID');
    const rzpSecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

    if (!rzpId || !rzpSecret) {
      return {
        success: true,
        message:
          'Razorpay keys not configured. Simulating linked account creation.',
      };
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Razorpay = require('razorpay');
      const instance = new Razorpay({ key_id: rzpId, key_secret: rzpSecret });

      const vendor = await this.vendorRepo.findOne({ where: { id } });
      if (!vendor) return { success: false, message: 'Vendor not found' };

      // In a real scenario, you'd pass vendor details here
      const account = await instance.accounts.create({
        type: 'route',
        email:
          vendor.contactEmail || vendor.user?.email || 'vendor@example.com',
        business_name: vendor.businessName || 'TripDekho Vendor',
        reference_id: id,
        legal_business_name: vendor.businessName || 'TripDekho Vendor',
        contact_name: vendor.user?.name || 'Vendor Owner',
      });

      vendor.razorpayAccountId = account.id;
      vendor.razorpayLinkedAccountStatus = 'pending_onboarding';
      await this.vendorRepo.save(vendor);

      return {
        success: true,
        data: account,
        message: 'Razorpay linked account created',
      };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  @Get(':id/razorpay-onboarding-link')
  async getRazorpayOnboardingLink(@Param('id') id: string) {
    const rzpId = this.configService.get<string>('RAZORPAY_KEY_ID');
    const rzpSecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

    if (!rzpId || !rzpSecret) {
      return {
        success: true,
        data: { url: 'https://razorpay.com/docs/onboarding/mock' },
        message: 'Razorpay keys not configured. Simulating onboarding link.',
      };
    }

    // In production, generate actual link using Razorpay API
    // e.g., instance.onboarding.createAccountLink({ account_id: vendor.razorpayAccountId })
    const vendor = await this.vendorRepo.findOne({ where: { id } });
    if (vendor && vendor.razorpayAccountId) {
      // Simulate successful onboarding completion when they click link
      vendor.razorpayLinkedAccountStatus = 'active';
      await this.vendorRepo.save(vendor);
    }

    return {
      success: true,
      data: { url: 'https://dashboard.razorpay.com/onboarding' },
      message: 'Razorpay onboarding link generated',
    };
  }

  @Get(':id/kyc-documents')
  async getKycDocuments(@Param('id') id: string) {
    const vendor = await this.vendorRepo.findOne({ where: { id } });
    if (!vendor) throw new NotFoundException('Vendor not found');
    return {
      success: true,
      data: {
        kycDocuments: vendor.kycDocuments || {},
        kycStatus: vendor.kycStatus,
      },
    };
  }

  @Post(':id/kyc-documents/:docType')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (
          !file.mimetype.startsWith('image/') &&
          file.mimetype !== 'application/pdf'
        ) {
          return cb(
            new BadRequestException('Only image and PDF files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadKycDocument(
    @Param('id') id: string,
    @Param('docType') docType: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const validDocTypes = [
      'panCard',
      'aadharFront',
      'aadharBack',
      'gstCertificate',
      'businessRegistration',
    ];
    if (!validDocTypes.includes(docType)) {
      throw new BadRequestException(
        'Invalid document type. Must be one of: ' + validDocTypes.join(', '),
      );
    }
    if (!file)
      throw new BadRequestException(
        'No file provided. Send file with field name "file".',
      );

    const vendor = await this.vendorRepo.findOne({ where: { id } });
    if (!vendor) throw new NotFoundException('Vendor not found');

    const existingDocs = vendor.kycDocuments || {};
    const existingDoc = (existingDocs as any)[docType];
    if (existingDoc?.publicId) {
      await this.storageService
        .deleteImage(existingDoc.publicId)
        .catch(() => null);
    }

    const result = await this.storageService.uploadImage(file, {
      folder: 'tripdekho/vendors/kyc/' + id,
      maxFileSize: 10 * 1024 * 1024,
    });

    const updatedDocs = {
      ...existingDocs,
      [docType]: { url: result.secureUrl, publicId: result.publicId },
    };
    await this.vendorRepo.update(id, {
      kycDocuments: updatedDocs,
      kycStatus: 'submitted',
    });

    return {
      success: true,
      message: docType + ' uploaded successfully',
      data: { url: result.secureUrl, docType, kycStatus: 'submitted' },
    };
  }
}
