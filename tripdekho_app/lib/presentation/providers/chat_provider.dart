import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/network/api_client.dart';
import '../../core/network/socket_client.dart';
import '../../domain/entities/chat_entity.dart';
import '../../data/repositories/chat_repository_impl.dart';

final socketClientProvider = Provider((ref) {
  final client = SocketClient();
  ref.onDispose(() => client.dispose());
  return client;
});

final chatRepositoryProvider = Provider((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return ChatRepositoryImpl(apiClient);
});

final chatsProvider = FutureProvider<List<ChatEntity>>((ref) async {
  final repository = ref.watch(chatRepositoryProvider);
  return await repository.getChats();
});

class ChatMessagesNotifier extends StateNotifier<AsyncValue<List<MessageEntity>>> {
  final ChatRepositoryImpl _repository;
  final SocketClient _socketClient;
  final String _chatId;

  ChatMessagesNotifier(this._repository, this._socketClient, this._chatId) : super(const AsyncValue.loading()) {
    _init();
  }

  Future<void> _init() async {
    try {
      final messages = await _repository.getMessages(_chatId);
      state = AsyncValue.data(messages);
      
      await _socketClient.connect();
      
      _socketClient.onMessageReceived.listen((data) {
        if (data['chatId'] == _chatId) {
          final newMessage = MessageEntity.fromJson(data);
          if (state.hasValue) {
            state = AsyncValue.data([...state.value!, newMessage]);
          }
        }
      });
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  void sendMessage(String content) {
    _socketClient.sendMessage(_chatId, content);
    // Optimistically update the UI, or wait for backend echo
    // Wait for backend echo is safer
  }
}

final chatMessagesProvider = StateNotifierProvider.family<ChatMessagesNotifier, AsyncValue<List<MessageEntity>>, String>((ref, chatId) {
  final repository = ref.watch(chatRepositoryProvider);
  final socketClient = ref.watch(socketClientProvider);
  return ChatMessagesNotifier(repository as ChatRepositoryImpl, socketClient, chatId);
});
