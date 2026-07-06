
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventConstants } from '../constants/events.constant';
import { UserRegisteredEvent } from '../dtos/user-registered.event';
import { NotificationService } from '../../notifications/notification.service';

@Injectable()
export class NotificationListener {
  private readonly logger = new Logger(NotificationListener.name);

  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent(EventConstants.USER_REGISTERED)
  async handleUserRegisteredEvent(event: UserRegisteredEvent) {
    this.logger.log(`Handling user.registered for ${event.email}, phone: ${event.phone}, hasPassword: ${!!event.generatedPassword}`);

    // Send welcome email (no password included)
    if (event.email) {
      await this.notificationService.sendVendorWelcomeEmail({
        name: event.name,
        email: event.email,
        // password intentionally omitted
      });
    }

    // Send WhatsApp with the generated password
    if (event.phone && event.generatedPassword) {
      await this.notificationService.sendMetaWhatsApp(
        event.phone,
        `Welcome to TripDekho Vendor Network! Your temporary login password is: *${event.generatedPassword}*. Please login and change it.`
      );
    }
  }
}
