import { axiosPrivate } from '@/lib/axios';
import { socketService } from './socketService';

export interface Message {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    name?: string;
    avatar?: string | any;
  };
}

export interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    profilePicture?: string;
  }>;
  trip?: any;
  lastMessage?: Message;
  lastMessageAt: string;
}

// Helper to map backend conversation entity to frontend interface
const mapConversation = (conv: any, currentUserId: string): Conversation => {
  const customer = conv.customer;
  const vendorUser = conv.vendor?.user;

  const participants = [];
  if (customer) {
    participants.push({ id: customer.id, name: customer.name, profilePicture: customer.profilePicture });
  }
  if (vendorUser) {
    participants.push({ id: vendorUser.id, name: vendorUser.name || conv.vendor.businessName, profilePicture: vendorUser.profilePicture });
  }

  const messages = conv.messages || [];
  // Backend sorts messages DESC, so the first element is the newest message
  const lastMessage = messages.length > 0 ? messages[0] : undefined;

  return {
    id: conv.id,
    participants,
    trip: conv.trip,
    lastMessage,
    lastMessageAt: lastMessage ? lastMessage.createdAt : conv.createdAt,
  };
};

class ChatService {
  private listeners: Record<string, Function[]> = {};
  private currentUserId?: string;
  private pollingTimer: ReturnType<typeof setInterval> | null = null;
  private activeConversationId: string | null = null;
  private lastMessageCount = 0;

  init(token: string) {
    if (typeof window !== 'undefined') {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          this.currentUserId = user.id;
        }
      } catch (e) {}

      // Try to connect WebSocket (best-effort, failures are silent)
      socketService.connect(token);

      socketService.on('new_message', (message: Message) => {
        const convId = (message as any).conversation?.id || (message as any).conversationId;
        this.emitLocal('chat:message', { message, conversationId: convId });
      });

      socketService.on('conversation_update', (conv: any) => {
        if (!this.currentUserId) return;
        const conversation = mapConversation(conv, this.currentUserId);
        this.emitLocal('chat:conversationCreated', { conversation });
        this.fetchConversations();
      });
    }
  }

  disconnect() {
    this.stopPolling();
    socketService.disconnect();
  }

  private emitLocal(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  joinConversation(conversationId: string) {
    this.activeConversationId = conversationId;
    this.lastMessageCount = 0;
    socketService.emit('join_conversation', { conversationId });
    // Start polling for real-time updates (fallback when WebSocket not available)
    this.startPolling();
  }

  leaveConversation() {
    this.activeConversationId = null;
    this.stopPolling();
  }

  private startPolling() {
    this.stopPolling();
    // Poll every 3 seconds for new messages in the active conversation
    this.pollingTimer = setInterval(async () => {
      if (!this.activeConversationId) return;
      try {
        const res = await axiosPrivate.get(`/chat/conversations/${this.activeConversationId}`);
        const conversation = res.data?.data;
        if (conversation?.messages) {
          const newCount = conversation.messages.length;
          if (newCount > this.lastMessageCount) {
            this.lastMessageCount = newCount;
            this.emitLocal('chat:messages', { messages: conversation.messages });
          }
        }
      } catch (_) {}
    }, 3000);
  }

  private stopPolling() {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }
  }

  async sendMessage(conversationId: string, content: string) {
    try {
      const res = await axiosPrivate.post(`/chat/conversations/${conversationId}/messages`, { content });
      const message = res.data?.data;
      // Also try to emit via socket for real-time delivery to the other party
      socketService.emit('send_message', { conversationId, content });
      return message;
    } catch (e) {
      console.error('Failed to send message:', e);
      throw e;
    }
  }

  async markAsRead(conversationId: string, messageIds: string[]) {
    try {
      await axiosPrivate.put(`/chat/conversations/${conversationId}/read`);
    } catch (e) {
      console.error('Failed to mark read', e);
    }
  }

  sendTypingStatus(conversationId: string, isTyping: boolean) {
    // noop — not implemented
  }

  async fetchConversations(page = 1, limit = 20) {
    try {
      const res = await axiosPrivate.get('/chat/conversations');
      const rawConversations = res.data?.data || [];
      const conversations = rawConversations.map((c: any) => mapConversation(c, this.currentUserId || ''));
      this.emitLocal('chat:conversations', { conversations });
      return conversations;
    } catch (e) {
      console.error('Failed to fetch conversations:', e);
      return [];
    }
  }

  async fetchMessages(conversationId: string) {
    try {
      const res = await axiosPrivate.get(`/chat/conversations/${conversationId}`);
      const conversation = res.data?.data;
      if (conversation?.messages) {
        this.lastMessageCount = conversation.messages.length;
        this.emitLocal('chat:messages', { messages: conversation.messages });
      }
    } catch (e) {
      console.error('Failed to fetch messages:', e);
    }
  }

  async createOrGetConversation(vendorId: string) {
    try {
      const res = await axiosPrivate.post('/chat/conversations', { vendorId });
      const conv = res.data?.data;
      if (conv) {
        const conversation = mapConversation(conv, this.currentUserId || '');
        this.emitLocal('chat:conversationCreated', { conversation });
        this.fetchConversations();
        return conversation;
      }
    } catch (e) {
      console.error('Failed to create/get conversation', e);
      throw e;
    }
  }

  async createOrGetConversationForCustomer(customerId: string) {
    try {
      const res = await axiosPrivate.post('/chat/conversations', { customerId });
      const conv = res.data?.data;
      if (conv) {
        const conversation = mapConversation(conv, this.currentUserId || '');
        this.emitLocal('chat:conversationCreated', { conversation });
        this.fetchConversations();
        return conversation;
      }
    } catch (e) {
      console.error('Failed to create/get conversation for customer', e);
      throw e;
    }
  }

  // Event listeners
  onConversationsLoaded(callback: (data: { conversations: Conversation[] }) => void) {
    if (!this.listeners['chat:conversations']) this.listeners['chat:conversations'] = [];
    this.listeners['chat:conversations'].push(callback);
    return () => {
      this.listeners['chat:conversations'] = this.listeners['chat:conversations'].filter(cb => cb !== callback);
    };
  }

  onMessagesLoaded(callback: (data: { messages: Message[] }) => void) {
    if (!this.listeners['chat:messages']) this.listeners['chat:messages'] = [];
    this.listeners['chat:messages'].push(callback);
    return () => {
      this.listeners['chat:messages'] = this.listeners['chat:messages'].filter(cb => cb !== callback);
    };
  }

  onNewMessage(callback: (data: { message: Message; conversationId: string }) => void) {
    if (!this.listeners['chat:message']) this.listeners['chat:message'] = [];
    this.listeners['chat:message'].push(callback);
    return () => {
      this.listeners['chat:message'] = this.listeners['chat:message'].filter(cb => cb !== callback);
    };
  }

  onConversationCreated(callback: (data: { conversation: Conversation }) => void) {
    if (!this.listeners['chat:conversationCreated']) this.listeners['chat:conversationCreated'] = [];
    this.listeners['chat:conversationCreated'].push(callback);
    return () => {
      this.listeners['chat:conversationCreated'] = this.listeners['chat:conversationCreated'].filter(cb => cb !== callback);
    };
  }

  onTypingStatus(callback: (data: { userId: string; isTyping: boolean }) => void) {
    return () => {};
  }

  onError(callback: (data: { message: string }) => void) {
    return () => {};
  }
}

export const chatService = new ChatService();
