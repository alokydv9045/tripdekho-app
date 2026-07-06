import {
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  Body,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEntity } from '../../reviews/entities/review.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { UpdateReviewStatusDto } from '../dto/admin-reviews.dto';

@Roles(UserRole.SUPER_ADMIN, UserRole.OPERATIONS_ADMIN)
@Controller('admin/reviews')
export class AdminReviewsController {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepo: Repository<ReviewEntity>,
  ) {}

  @Get()
  async getReviews(@Query() query: Record<string, unknown>) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    let qb = this.reviewRepo
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.trip', 'trip')
      .orderBy('review.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (query.status && typeof query.status === 'string') {
      qb = qb.andWhere('review.status = :status', { status: query.status });
    }

    if (query.search && typeof query.search === 'string') {
      qb = qb.andWhere(
        '(review.comment ILIKE :search OR user.name ILIKE :search OR trip.title ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    const [reviews, total] = await qb.getManyAndCount();

    // Map user → customer for frontend compatibility
    const mappedReviews = reviews.map((r) => ({
      ...r,
      customer: r.user,
    }));

    return {
      success: true,
      data: {
        reviews: mappedReviews,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  @Patch(':id/status')
  async updateReviewStatus(
    @Param('id') id: string,
    @Body() body: UpdateReviewStatusDto,
  ) {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    if ('status' in review) {
      (review as ReviewEntity & { status: string }).status = body.status;
      await this.reviewRepo.save(review);
    }

    return { success: true, data: { success: true } };
  }

  @Patch(':id')
  async updateReview(
    @Param('id') id: string,
    @Body() body: { comment?: string; rating?: number; status?: string },
  ) {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    if (body.comment !== undefined) review.comment = body.comment;
    if (body.rating !== undefined) review.rating = body.rating;
    if (body.status !== undefined && 'status' in review) {
      (review as any).status = body.status;
    }

    await this.reviewRepo.save(review);
    return { success: true, data: { review } };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteReview(@Param('id') id: string) {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    await this.reviewRepo.remove(review);
    return { success: true, data: { success: true } };
  }
}
