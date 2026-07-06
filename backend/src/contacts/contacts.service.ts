import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsletterSubscriberEntity } from '../entities/newsletter-subscriber.entity';
import { InquiryEntity } from '../entities/inquiry.entity';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(NewsletterSubscriberEntity)
    private readonly newsletterRepo: Repository<NewsletterSubscriberEntity>,
    @InjectRepository(InquiryEntity)
    private readonly inquiryRepo: Repository<InquiryEntity>,
  ) {}

  async subscribeNewsletter(email: string) {
    let subscriber = await this.newsletterRepo.findOne({ where: { email } });
    if (!subscriber) {
      subscriber = this.newsletterRepo.create({ email });
      await this.newsletterRepo.save(subscriber);
    }
    return { success: true, message: 'Subscribed successfully' };
  }

  async unsubscribeNewsletter(email: string) {
    await this.newsletterRepo.delete({ email });
    return { success: true, message: 'Unsubscribed successfully' };
  }

  async submitContact(data: any) {
    const inquiry = this.inquiryRepo.create({
      name: data.name,
      email: data.email,
      subject: data.subject || '',
      message: data.message,
    });
    await this.inquiryRepo.save(inquiry);
    return { success: true, message: 'Message received' };
  }

  async getMessages() {
    return this.inquiryRepo.find({ order: { createdAt: 'DESC' } });
  }

  async getNewsletters() {
    const subscribers = await this.newsletterRepo.find({
      order: { createdAt: 'DESC' },
    });
    return subscribers.map((s) => s.email);
  }

  async updateMessageStatus(id: string, status: string) {
    const inquiry = await this.inquiryRepo.findOne({ where: { id } });
    if (inquiry) {
      inquiry.status = status;
      await this.inquiryRepo.save(inquiry);
      return inquiry;
    }
    return null;
  }
}
