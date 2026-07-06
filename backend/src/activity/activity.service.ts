import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserActivityEntity, ActivityAction } from '../entities/user-activity.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(UserActivityEntity)
    private readonly activityRepo: Repository<UserActivityEntity>,
  ) {}

  async logActivity(userId: string, action: ActivityAction, details: any = {}) {
    try {
      const activity = this.activityRepo.create({
        user: userId ? { id: userId } : undefined,
        userId: userId || undefined,
        action,
        details,
      } as any);
      await this.activityRepo.save(activity);
    } catch (e) {
      console.error('Failed to log activity', e);
    }
  }

  async getActivities(page = 1, limit = 50, action?: string) {
    const query = this.activityRepo.createQueryBuilder('activity')
      .leftJoinAndSelect('activity.user', 'user')
      .orderBy('activity.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (action) {
      query.andWhere('activity.action = :action', { action });
    }

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }
}
