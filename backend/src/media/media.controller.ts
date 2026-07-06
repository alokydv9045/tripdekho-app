import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { StorageService } from '../storage/storage.service';

/**
 * General-purpose media upload controller.
 * Used by vendor trip forms for thumbnail / route-map uploads
 * before a trip is created (so no trip ID is available yet).
 */
@Controller('vendor/media')
export class MediaController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('media', {
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
  async uploadMedia(
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type?: string,
  ) {
    if (!file) {
      throw new BadRequestException(
        'No file provided. Send a file with field name "media".',
      );
    }

    const folder = type === 'routeMap'
      ? 'tripdekho/trips/route-maps'
      : 'tripdekho/trips/thumbnails';

    const result = await this.storageService.uploadImage(file, {
      folder,
      maxFileSize: 10 * 1024 * 1024,
      transformation: type === 'routeMap'
        ? { width: 1200, height: 800, crop: 'limit' }
        : { width: 800, height: 600, crop: 'limit' },
    });

    return {
      success: true,
      data: {
        url: result.secureUrl,
        publicId: result.publicId,
      },
      message: 'Image uploaded successfully',
    };
  }
}
