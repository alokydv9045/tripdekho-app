import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  path: '/socket.io',
  cors: {
    origin: [
      'https://tripdekho.in',
      'https://www.tripdekho.in',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
  },
})
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Track connected users: userId -> socketId
  private connectedUsers = new Map<string, string>();

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      const userId = decoded.id;

      this.connectedUsers.set(userId, client.id);
      
      // Join a user-specific room to easily send messages to them
      client.join(userId);

    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Remove from connected users map
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('join_conversation')
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    // Join the room for this specific conversation
    client.join(data.conversationId);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; content: string },
  ) {
    try {
      // Decode user from token again to ensure security
      const token = client.handshake.auth?.token;
      if (!token) return;
      const decoded = this.jwtService.verify(token, { secret: this.configService.get('JWT_SECRET') });
      const senderId = decoded.id;

      // Save message in database
      const message = await this.chatService.sendMessage(data.conversationId, senderId, data.content);

      // Broadcast to everyone in the conversation room
      this.server.to(data.conversationId).emit('new_message', message);
      
      // Also broadcast to the other user to trigger notifications if they are not in the room
      const conversation = await this.chatService.getConversationById(data.conversationId, senderId);
      const isVendorSender = conversation.vendor?.user?.id === senderId;
      const receiverId = isVendorSender ? conversation.customer?.id : conversation.vendor?.user?.id;
      
      if (receiverId) {
        this.server.to(receiverId).emit('new_message', message);
        this.server.to(receiverId).emit('conversation_update', conversation);
      }

    } catch (error) {
      console.error('Socket send_message error:', error);
    }
  }
}
