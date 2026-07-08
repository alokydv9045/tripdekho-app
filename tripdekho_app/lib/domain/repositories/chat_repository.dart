import '../entities/chat_entity.dart';

abstract class ChatRepository {
  Future<List<ChatEntity>> getChats();
  Future<List<MessageEntity>> getMessages(String chatId);
  Future<ChatEntity> createOrGetChat(String vendorId);
}
