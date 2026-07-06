import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationEntity } from '../entities/conversation.entity';
import { MessageEntity } from '../entities/message.entity';
import { VendorEntity } from '../entities/vendor.entity';
import { TripEntity } from '../entities/trip.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ConversationEntity)
    private conversationRepo: Repository<ConversationEntity>,
    @InjectRepository(MessageEntity)
    private messageRepo: Repository<MessageEntity>,
    @InjectRepository(VendorEntity)
    private vendorRepo: Repository<VendorEntity>,
    @InjectRepository(TripEntity)
    private tripRepo: Repository<TripEntity>,
  ) {}

  async getConversations(userId: string, role: string) {
    const query = this.conversationRepo.createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.customer', 'customer')
      .leftJoinAndSelect('conversation.vendor', 'vendor')
      .leftJoinAndSelect('vendor.user', 'vendorUser')
      .leftJoinAndSelect('conversation.trip', 'trip')
      .leftJoinAndSelect('conversation.messages', 'messages')
      .leftJoinAndSelect('messages.sender', 'sender')
      .orderBy('conversation.updatedAt', 'DESC')
      .addOrderBy('messages.createdAt', 'DESC');

    if (role === 'vendor') {
      const vendor = await this.vendorRepo.findOne({ where: { user: { id: userId } } });
      if (!vendor) return [];
      query.where('conversation.vendorId = :vendorId', { vendorId: vendor.id });
    } else {
      query.where('conversation.customerId = :userId', { userId });
    }

    const conversations = await query.getMany();
    // Sort conversations by latest message or creation date
    conversations.sort((a, b) => {
      const dateA = a.messages?.length > 0 ? a.messages[0].createdAt.getTime() : a.createdAt.getTime();
      const dateB = b.messages?.length > 0 ? b.messages[0].createdAt.getTime() : b.createdAt.getTime();
      return dateB - dateA;
    });

    return conversations;
  }

  async createConversation(customerId: string, vendorIdentifier: string, tripId?: string) {
    // vendorIdentifier could be a vendor.id or a vendor.user.id
    let vendor = await this.vendorRepo.findOne({ where: { id: vendorIdentifier } });
    if (!vendor) {
      vendor = await this.vendorRepo.findOne({ where: { user: { id: vendorIdentifier } } });
    }
    if (!vendor) throw new Error('Vendor not found');

    // Check if conversation already exists
    const query: Record<string, any> = {
      customer: { id: customerId },
      vendor: { id: vendor.id },
    };
    
    if (tripId) {
      query['trip'] = { id: tripId };
    }

    let conversation = await this.conversationRepo.findOne({
      where: query,
      relations: { customer: true, vendor: { user: true }, trip: true, messages: { sender: true } },
    });

    if (!conversation) {
      conversation = this.conversationRepo.create({
        customer: { id: customerId },
        vendor: { id: vendor.id },
        trip: tripId ? { id: tripId } : undefined,
      });
      await this.conversationRepo.save(conversation);
      conversation = await this.conversationRepo.findOne({
        where: { id: conversation.id },
        relations: { customer: true, vendor: { user: true }, trip: true, messages: { sender: true } },
      });
    }

    return conversation;
  }

  async getConversationById(id: string, userId: string) {
    const conversation = await this.conversationRepo.findOne({
      where: { id },
      relations: { customer: true, vendor: { user: true }, trip: true, messages: { sender: true } },
      order: {
        messages: {
          createdAt: 'ASC'
        }
      }
    });

    if (!conversation) throw new NotFoundException('Conversation not found');

    // Verify user is part of conversation
    const isCustomer = conversation.customer?.id === userId;
    const isVendor = conversation.vendor?.user?.id === userId;

    if (!isCustomer && !isVendor) {
      throw new UnauthorizedException('Not part of this conversation');
    }

    return conversation;
  }

  async sendMessage(conversationId: string, senderId: string, content: string) {
    const conversation = await this.getConversationById(conversationId, senderId);

    const message = this.messageRepo.create({
      conversation: { id: conversationId },
      sender: { id: senderId },
      content,
    });

    await this.messageRepo.save(message);

    return this.messageRepo.findOne({
      where: { id: message.id },
      relations: { sender: true },
    });
  }

  async markAsRead(conversationId: string, userId: string) {
    const conversation = await this.getConversationById(conversationId, userId);
    
    await this.messageRepo.createQueryBuilder()
      .update(MessageEntity)
      .set({ isRead: true })
      .where("conversationId = :conversationId", { conversationId })
      .andWhere("senderId != :userId", { userId })
      .execute();
      
    return { success: true };
  }
}
