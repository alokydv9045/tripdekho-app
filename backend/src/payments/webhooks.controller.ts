import {
  Controller,
  Post,
  Req,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ProcessRazorpayWebhookCommand } from './commands/process-webhook.command';
import { Public } from '../common/decorators/public.decorator';

import { RazorpayWebhookDto } from './dto/webhooks.dto';

@Controller('webhooks/razorpay')
export class WebhooksController {
  constructor(private readonly commandBus: CommandBus) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req() req: any,
    @Headers('x-razorpay-signature') signature: string,
    @Body() body: RazorpayWebhookDto,
  ) {
    const rawBody = req.rawBody || JSON.stringify(body);
    const event = body.event;
    const payload = body.payload;

    return this.commandBus.execute(
      new ProcessRazorpayWebhookCommand(signature, rawBody, event, payload),
    );
  }
}
