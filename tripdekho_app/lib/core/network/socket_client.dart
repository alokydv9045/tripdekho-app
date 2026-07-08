import 'dart:async';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'api_endpoints.dart';

class SocketClient {
  IO.Socket? _socket;
  final _storage = const FlutterSecureStorage();
  
  // Stream controllers for different events
  final _messageController = StreamController<Map<String, dynamic>>.broadcast();
  
  Stream<Map<String, dynamic>> get onMessageReceived => _messageController.stream;

  Future<void> connect() async {
    if (_socket != null && _socket!.connected) return;

    final token = await _storage.read(key: 'jwt_token');
    
    // Parse base URL for socket connection (remove /api/v2)
    final uri = Uri.parse(ApiEndpoints.baseUrl);
    final socketUrl = '${uri.scheme}://${uri.host}:${uri.port}';

    _socket = IO.io(
      socketUrl,
      IO.OptionBuilder()
          .setTransports(['websocket'])
          .disableAutoConnect()
          .setAuth({'token': token})
          .build(),
    );

    _socket!.connect();

    _socket!.onConnect((_) {
      print('Socket connected: ${_socket!.id}');
    });

    _socket!.onDisconnect((_) {
      print('Socket disconnected');
    });

    _socket!.on('receive_message', (data) {
      if (data != null) {
        _messageController.add(Map<String, dynamic>.from(data));
      }
    });
  }

  void sendMessage(String chatId, String content) {
    if (_socket != null && _socket!.connected) {
      _socket!.emit('send_message', {
        'chatId': chatId,
        'content': content,
      });
    }
  }

  void disconnect() {
    _socket?.disconnect();
    _socket = null;
  }

  void dispose() {
    disconnect();
    _messageController.close();
  }
}
