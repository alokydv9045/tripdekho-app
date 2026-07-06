import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ChatService } from './chat.service';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  async getConversations(@CurrentUser() user: any) {
    const conversations = await this.chatService.getConversations(
      user.id,
      user.role,
    );
    return { success: true, data: conversations };
  }

  @Post('conversations')
  async createConversation(
    @CurrentUser() user: any,
    @Body() body: { vendorId?: string; customerId?: string; tripId?: string },
  ) {
    let customerId = user.id;
    let vendorIdentifier = body.vendorId;

    if (user.role === 'vendor' && body.customerId) {
      customerId = body.customerId;
      vendorIdentifier = user.vendorId || user.id;
    }

    if (!vendorIdentifier) {
      throw new Error('vendorId is required');
    }

    const conversation = await this.chatService.createConversation(
      customerId,
      vendorIdentifier,
      body.tripId,
    );
    return { success: true, data: conversation };
  }

  @Get('conversations/:id')
  async getConversationById(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    const conversation = await this.chatService.getConversationById(id, userId);
    return { success: true, data: conversation };
  }

  @Post('conversations/:id/messages')
  async sendMessage(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
    @Body() body: { content: string },
  ) {
    const message = await this.chatService.sendMessage(
      conversationId,
      userId,
      body.content,
    );
    return { success: true, data: message };
  }

  @Put('conversations/:id/read')
  async markAsRead(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
  ) {
    const result = await this.chatService.markAsRead(conversationId, userId);
    return { success: true, data: result };
  }
}
