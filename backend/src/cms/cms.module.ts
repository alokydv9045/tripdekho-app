import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalSettingEntity } from '../entities/global-setting.entity';
import { VlogEntity } from './entities/vlog.entity';
import { BlogEntity } from './entities/blog.entity';
import { CmsController } from './controllers/cms.controller';
import { AdminCmsController } from './controllers/admin-cms.controller';
import { LocationController } from './controllers/location.controller';
import { CmsService } from './services/cms.service';

@Module({
  imports: [TypeOrmModule.forFeature([GlobalSettingEntity, VlogEntity, BlogEntity])],
  controllers: [CmsController, AdminCmsController, LocationController],
  providers: [CmsService],
  exports: [CmsService],
})
export class CmsModule {}
