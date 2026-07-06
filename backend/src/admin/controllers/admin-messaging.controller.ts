import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { ContactsService } from '../../contacts/contacts.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { UpdateMessageTemplateDto } from '../dto/admin-messaging.dto';

@Roles(UserRole.SUPER_ADMIN, UserRole.SUPPORT_ADMIN)
@Controller('admin/messaging')
export class AdminMessagingController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get('inquiries')
  async getInquiries(@Query() _query: Record<string, unknown>) {
    const inquiries = await this.contactsService.getMessages();
    return {
      success: true,
      data: { inquiries, total: inquiries.length, totalPages: 1 },
    };
  }

  @Patch('inquiries/:id')
  async updateInquiry(
    @Param('id') id: string,
    @Body() updates: UpdateMessageTemplateDto,
  ) {
    const inquiry = await this.contactsService.updateMessageStatus(
      id,
      updates.status,
    );
    if (!inquiry) throw new NotFoundException('Inquiry not found');
    return { success: true, data: inquiry };
  }

  @Get('newsletter')
  async getNewsletterSubscribers(@Query() _query: Record<string, unknown>) {
    const emails = await this.contactsService.getNewsletters();
    const subscribers = emails.map((email, index) => ({
      id: (index + 1).toString(),
      email,
      createdAt: new Date('2026-05-24T10:00:00Z'),
    }));
    return {
      success: true,
      data: { subscribers, total: subscribers.length, totalPages: 1 },
    };
  }
}
