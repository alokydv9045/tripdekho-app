import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportController } from './support.controller';
import { SupportTicketEntity } from './entities/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupportTicketEntity])],
  controllers: [SupportController],
})
export class SupportModule {}
