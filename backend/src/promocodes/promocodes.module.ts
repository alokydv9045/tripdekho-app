import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromoCodeEntity } from '../entities/promo-code.entity';
import { PromocodesController } from './controllers/promocodes.controller';
import { PromocodesService } from './services/promocodes.service';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [TypeOrmModule.forFeature([PromoCodeEntity]), CqrsModule],
  controllers: [PromocodesController],
  providers: [PromocodesService],
  exports: [PromocodesService],
})
export class PromocodesModule {}
