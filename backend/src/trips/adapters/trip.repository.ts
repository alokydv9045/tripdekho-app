import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { TripEntity } from '../../entities/trip.entity';
import {
  ITripRepository,
  TripSearchParams,
} from '../ports/trip.repository.interface';

@Injectable()
export class TripRepository implements ITripRepository {
  constructor(
    @InjectRepository(TripEntity)
    private readonly tripRepo: Repository<TripEntity>,
  ) {}

  async create(data: Partial<TripEntity>): Promise<TripEntity> {
    const trip = this.tripRepo.create(data);
    return this.tripRepo.save(trip);
  }

  async findById(id: string): Promise<TripEntity | null> {
    return this.tripRepo.findOne({
      where: { id },
      relations: {
        vendor: { user: true },
        location: true,
        price: true,
        dates: true,
        itinerary: true,
        media: true,
      },
    });
  }

  async findBySlug(slug: string): Promise<TripEntity | null> {
    return this.tripRepo.findOne({
      where: { slug },
      relations: {
        vendor: { user: true },
        location: true,
        price: true,
        dates: true,
        itinerary: true,
        media: true,
      },
    });
  }

  async search(params: TripSearchParams): Promise<[TripEntity[], number]> {
    const query = this.tripRepo
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.vendor', 'vendor')
      .leftJoinAndSelect('vendor.user', 'vendorUser')
      .leftJoinAndSelect('trip.location', 'location')
      .leftJoinAndSelect('trip.price', 'price')
      .leftJoinAndSelect('trip.dates', 'dates')
      .leftJoinAndSelect('trip.media', 'media')
      .where('trip.isActive = :isActive', { isActive: true })
      .andWhere('trip.status = :status', { status: 'published' });

    if (params.q) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('trip.title ILIKE :q', { q: `%${params.q}%` })
            .orWhere('trip.description ILIKE :q', { q: `%${params.q}%` })
            .orWhere('trip.shortDescription ILIKE :q', { q: `%${params.q}%` })
            .orWhere('location.city ILIKE :q', { q: `%${params.q}%` })
            .orWhere('location.state ILIKE :q', { q: `%${params.q}%` })
            .orWhere('trip.tags ILIKE :q', { q: `%${params.q}%` })
            .orWhere('trip.category ILIKE :q', { q: `%${params.q}%` });
        }),
      );
    }

    if (params.category) {
      query.andWhere('trip.category ILIKE :category', {
        category: `%${params.category}%`,
      });
    }

    if (params.city) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('location.city ILIKE :city', { city: `%${params.city}%` })
            .orWhere('location.state ILIKE :city', { city: `%${params.city}%` });
        }),
      );
    }

    if (params.minPrice !== undefined && params.minPrice !== null) {
      query.andWhere('price.amount >= :minPrice', {
        minPrice: params.minPrice,
      });
    }

    if (params.maxPrice !== undefined && params.maxPrice !== null) {
      query.andWhere('price.amount <= :maxPrice', {
        maxPrice: params.maxPrice,
      });
    }

    if (params.tags && params.tags.length > 0) {
      const tags = params.tags;
      query.andWhere(
        new Brackets((qb) => {
          tags.forEach((tag, index) => {
            qb.orWhere(`trip.tags ILIKE :tag${index}`, {
              [`tag${index}`]: `%${tag}%`,
            });
          });
        }),
      );
    }

    if (params.featured) {
      query.andWhere('trip.isFeatured = :isFeatured', { isFeatured: true });
    }

    if (params.startDate) {
      query.andWhere('dates.startDate >= :startDate', { startDate: params.startDate });
    }

    if (params.endDate) {
      query.andWhere('dates.startDate <= :endDate', { endDate: params.endDate });
    }

    // Custom sorting (applied BEFORE pagination for correct ordering)
    if (params.sortBy === 'price-asc') {
      query.orderBy('price.amount', 'ASC', 'NULLS LAST');
    } else if (params.sortBy === 'price-desc') {
      query.orderBy('price.amount', 'DESC', 'NULLS LAST');
    } else if (params.userLat && params.userLng) {
      query.addSelect(
        `(cos(radians(:userLat)) * cos(radians(location.lat)) * cos(radians(location.lng) - radians(:userLng)) + sin(radians(:userLat)) * sin(radians(location.lat)))`,
        'proximity',
      );
      query.setParameter('userLat', params.userLat);
      query.setParameter('userLng', params.userLng);
      query.orderBy('proximity', 'DESC');
    } else {
      query.orderBy('trip.createdAt', 'DESC');
    }

    // Use getManyAndCount for correct total (getCount after skip/take returns wrong value)
    query.skip(params.skip).take(params.limit);
    return query.getManyAndCount();
  }

  async save(trip: TripEntity): Promise<TripEntity> {
    return this.tripRepo.save(trip);
  }

  async getVendorStats(vendorIds: string[]): Promise<Record<string, { rating: number, count: number }>> {
    if (!vendorIds.length) return {};
    
    // We run a raw query or queryBuilder on reviews to aggregate by vendorId
    // Since reviews table joins on trip_id, we join trips to get vendorId
    const rawResults = await this.tripRepo.manager
      .createQueryBuilder('reviews', 'r')
      .select('t."vendorId"', 'vendorId')
      .addSelect('AVG(r.rating)', 'avgRating')
      .addSelect('COUNT(r.id)', 'reviewCount')
      .innerJoin('trips', 't', 't.id = r.trip_id')
      .where('r.status = :status', { status: 'approved' })
      .andWhere('t."vendorId" IN (:...vendorIds)', { vendorIds })
      .groupBy('t."vendorId"')
      .getRawMany();

    const stats: Record<string, { rating: number, count: number }> = {};
    for (const row of rawResults) {
      stats[row.vendorId] = {
        rating: parseFloat(row.avgRating) || 0,
        count: parseInt(row.reviewCount, 10) || 0,
      };
    }
    return stats;
  }
}
