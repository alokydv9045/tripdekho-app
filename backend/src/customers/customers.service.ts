import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { ReviewEntity } from '../reviews/entities/review.entity';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    @InjectRepository(ReviewEntity)
    private reviewRepo: Repository<ReviewEntity>,
    private readonly storageService: StorageService,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, data: any) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    delete data.id; // Prevent updating PK

    // Remove undefined properties from data so we don't accidentally overwrite with undefined
    const updateData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined) acc[key] = value;
      return acc;
    }, {} as any);

    await this.userRepo.update(userId, updateData);
    return await this.userRepo.findOne({ where: { id: userId } });
  }

  /**
   * Upload a profile picture to Cloudinary and save the URL to the user entity.
   * If the user already has an avatar, the old one is deleted from Cloudinary.
   */
  async updateAvatar(userId: string, file: Express.Multer.File) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Delete old avatar from Cloudinary if it exists
    if (user.avatar?.publicId) {
      this.logger.log(`Deleting old avatar: ${user.avatar.publicId}`);
      await this.storageService.deleteImage(user.avatar.publicId);
    }

    // Upload new avatar to Cloudinary
    const result = await this.storageService.uploadImage(file, {
      folder: `tripdekho/avatars`,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      transformation: {
        width: 500,
        height: 500,
        crop: 'fill',
        gravity: 'face',
      },
    });

    // Save to database
    user.avatar = {
      url: result.secureUrl,
      publicId: result.publicId,
    };
    await this.userRepo.save(user);

    this.logger.log(`Avatar updated for user ${userId}: ${result.publicId}`);
    return user;
  }

  /**
   * Delete the user's profile picture from Cloudinary and clear the DB field.
   */
  async deleteAvatar(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (user.avatar?.publicId) {
      await this.storageService.deleteImage(user.avatar.publicId);
    }

    user.avatar = null;
    await this.userRepo.save(user);
    return user;
  }

  async getReviews(userId: string, params: any) {
    const reviews = await this.reviewRepo.find({
      where: { user: { id: userId } },
      relations: { trip: true },
      order: { createdAt: 'DESC' },
    });
    return { success: true, reviews };
  }

  async getStats(userId: string) {
    return {
      totalTrips: 0,
      loyaltyPoints: 0,
    };
  }

  async deleteAccount(userId: string, password?: string) {
    await this.userRepo.update(userId, { isActive: false, isDeleted: true });
    return { success: true };
  }
}
