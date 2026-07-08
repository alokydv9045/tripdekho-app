import '../../core/network/api_client.dart';
import '../../domain/entities/chat_entity.dart';
import '../../domain/repositories/chat_repository.dart';

class ChatRepositoryImpl implements ChatRepository {
  final ApiClient apiClient;

  ChatRepositoryImpl(this.apiClient);

  @override
  Future<List<ChatEntity>> getChats() async {
    final response = await apiClient.get('/chats');
    final List<dynamic> data = response is Map ? response['data'] ?? response['items'] ?? response : response;
    return data.map((json) => ChatEntity.fromJson(json as Map<String, dynamic>)).toList();
  }

  @override
  Future<List<MessageEntity>> getMessages(String chatId) async {
    final response = await apiClient.get('/chats/$chatId/messages');
    final List<dynamic> data = response is Map ? response['data'] ?? response['items'] ?? response : response;
    return data.map((json) => MessageEntity.fromJson(json as Map<String, dynamic>)).toList();
  }

  @override
  Future<ChatEntity> createOrGetChat(String vendorId) async {
    final response = await apiClient.post('/chats', data: {'vendorId': vendorId});
    final data = response is Map && response.containsKey('data') ? response['data'] : response;
    return ChatEntity.fromJson(data as Map<String, dynamic>);
  }
}
