import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  UpdateCustomerProfileDto,
  DeleteAccountDto,
} from './dto/customers.dto';

@Controller('customers')
@UseGuards(AuthGuard('jwt'))
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('profile')
  async getProfile(@Request() req: any) {
    return this.customersService.getProfile(req.user.id);
  }

  @Put('profile')
  async updateProfile(
    @Request() req: any,
    @Body() body: UpdateCustomerProfileDto,
  ) {
    return this.customersService.updateProfile(req.user.id, body);
  }

  /**
   * Upload a profile picture via multipart form-data.
   * The file is uploaded to Cloudinary (signed upload) and the URL is saved.
   */
  @Post('profile/picture')
  @UseInterceptors(
    FileInterceptor('picture', {
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
  async uploadProfilePicture(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        'No image file provided. Send a file with field name "picture".',
      );
    }

    const user = await this.customersService.updateAvatar(req.user.id, file);

    return {
      success: true,
      message: 'Profile picture uploaded successfully',
      data: { avatar: user.avatar },
    };
  }

  /**
   * Delete the user's profile picture.
   */
  @Delete('profile/picture')
  async deleteProfilePicture(@Request() req: any) {
    const user = await this.customersService.deleteAvatar(req.user.id);
    return {
      success: true,
      message: 'Profile picture removed',
      data: { avatar: user.avatar },
    };
  }

  @Get('reviews')
  async getReviews(@Request() req: any, @Query() query: any) {
    return this.customersService.getReviews(req.user.id, query);
  }

  @Get('stats')
  async getStats(@Request() req: any) {
    return this.customersService.getStats(req.user.id);
  }

  @Delete('account')
  async deleteAccount(@Request() req: any, @Body() body: DeleteAccountDto) {
    return this.customersService.deleteAccount(req.user.id, body.password);
  }
}
