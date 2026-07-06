import { Controller, Post, Body } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { Public } from '../common/decorators/public.decorator';
import { SubmitContactDto, NewsletterDto } from './dto/contacts.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Public()
  @Post('newsletter')
  async subscribeNewsletter(@Body() body: NewsletterDto) {
    return this.contactsService.subscribeNewsletter(body.email);
  }

  @Public()
  @Post('newsletter/unsubscribe')
  async unsubscribeNewsletter(@Body() body: NewsletterDto) {
    return this.contactsService.unsubscribeNewsletter(body.email);
  }

  @Public()
  @Post()
  async submitContact(@Body() data: SubmitContactDto) {
    return this.contactsService.submitContact(data);
  }
}
