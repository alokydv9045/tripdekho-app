import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareersController } from './careers.controller';
import { CareersService } from './careers.service';
import { CareerPositionEntity } from '../entities/career-position.entity';
import { CareerApplicationEntity } from '../entities/career-application.entity';
import { CareerGalleryEntity } from '../entities/career-gallery.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CareerPositionEntity,
      CareerApplicationEntity,
      CareerGalleryEntity,
    ]),
  ],
  controllers: [CareersController],
  providers: [CareersService],
  exports: [CareersService],
})
export class CareersModule {}
