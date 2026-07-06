import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { NewsletterSubscriberEntity } from '../entities/newsletter-subscriber.entity';
import { InquiryEntity } from '../entities/inquiry.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NewsletterSubscriberEntity, InquiryEntity]),
  ],
  controllers: [ContactsController],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}
