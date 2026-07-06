import { Module, Global } from '@nestjs/common';
import { NotificationListener } from './listeners/notification.listener';
import { NotificationsModule } from '../notifications/notifications.module';

@Global()
@Module({
  imports: [NotificationsModule],
  providers: [NotificationListener],
})
export class EventsModule {}
