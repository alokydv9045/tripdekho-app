import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { UserEntity } from '../entities/user.entity';
import { ReviewEntity } from '../reviews/entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ReviewEntity])],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
