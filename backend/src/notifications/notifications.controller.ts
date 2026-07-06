import {
  Controller,
  Logger,
  Get,
  Patch,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Body,
} from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: Repository<NotificationEntity>,
    private readonly notificationService: NotificationService,
  ) {}

  @Public()
  @Post('test-whatsapp')
  async testWhatsApp(@Body() body: { phone: string; message: string }) {
    this.logger.log(`Testing Meta WhatsApp to ${body.phone}`);
    await this.notificationService.sendMetaWhatsApp(body.phone, body.message);
    return { success: true, message: 'Test message triggered. Check server logs for details.' };
  }

  @Get()
  async getNotifications(@CurrentUser('id') userId: string) {
    this.logger.log('Fetching all notifications');
    const notifications = await this.notificationRepo.find({
      where: [
        { userId },
        { userId: IsNull() },
      ],
      order: { createdAt: 'DESC' },
      take: 20,
    });
    return { success: true, data: notifications };
  }

  @Get('unread-count')
  async getUnreadCount(@CurrentUser('id') userId: string) {
    const count = await this.notificationRepo.count({
      where: [
        { userId, read: false },
        { userId: IsNull(), read: false },
      ],
    });
    return { count };
  }

  @Patch('read-all')
  async markAllAsRead(@CurrentUser('id') userId: string) {
    this.logger.log('Marking all notifications as read');
    await this.notificationRepo.update(
      { userId: userId, read: false },
      { read: true },
    );
    return { success: true };
  }

  @Patch(':id/read')
  async markAsRead(@CurrentUser('id') userId: string, @Param('id') id: string) {
    this.logger.log(`Marking notification ${id} as read`);
    const notification = await this.notificationRepo.findOne({
      where: { id, userId },
    });
    if (notification) {
      notification.read = true;
      await this.notificationRepo.save(notification);
      return notification;
    }
    throw new NotFoundException('Notification not found');
  }

  @Delete(':id')
  async deleteNotification(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    this.logger.log(`Deleting notification ${id}`);
    const result = await this.notificationRepo.delete({ id, userId });
    return { success: (result.affected ?? 0) > 0 };
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteAllNotifications(@CurrentUser('id') userId: string) {
    this.logger.log('Deleting all notifications');
    await this.notificationRepo.delete({ userId });
    return { success: true };
  }

  @EventPattern('send_welcome_email')
  async handleWelcomeEmail(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.log(
      `Received send_welcome_email event for user: ${data.name} (${data.email})`,
    );

    const isPasswordSent = !!data.generatedPassword;
    
    // Attempt to actually send the Email and WhatsApp using our integrated services
    if (data.email) {
      await this.notificationService.sendVendorWelcomeEmail({
        name: data.name,
        email: data.email,
        password: data.generatedPassword,
      });
    }

    if (data.phone) {
      await this.notificationService.sendVendorWelcomeWhatsApp(data.phone, data.name);
      if (data.generatedPassword) {
        await this.notificationService.sendWhatsApp(
          data.phone, 
          `Your TripDekho temporary password code is *${data.generatedPassword}*`
        );
      }
    }

    const messageContent = isPasswordSent
      ? `A welcome email and WhatsApp message with your secure temporary password have been sent to ${data.email}.`
      : `A welcome email has been sent to ${data.email}.`;

    // Auto-create an in-app notification when email event is triggered
    const notification = this.notificationRepo.create({
      title: 'Welcome to TripDekho',
      message: messageContent,
      type: 'info',
      read: false,
    });
    await this.notificationRepo.save(notification);

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    // Acknowledge the message
    channel.ack(originalMsg);

    this.logger.log(`Successfully sent welcome email and ACKed message.`);
  }
}
