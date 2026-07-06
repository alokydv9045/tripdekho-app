import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { UserActivityEntity } from '../entities/user-activity.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserActivityEntity])],
  controllers: [ActivityController],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
