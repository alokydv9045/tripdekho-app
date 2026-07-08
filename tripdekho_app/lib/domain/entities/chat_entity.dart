class ChatEntity {
  final String id;
  final String customerId;
  final String vendorId;
  final String? lastMessage;
  final DateTime updatedAt;
  final Map<String, dynamic>? otherUser; // customer or vendor details

  ChatEntity({
    required this.id,
    required this.customerId,
    required this.vendorId,
    this.lastMessage,
    required this.updatedAt,
    this.otherUser,
  });

  factory ChatEntity.fromJson(Map<String, dynamic> json) {
    return ChatEntity(
      id: json['id']?.toString() ?? '',
      customerId: json['customerId']?.toString() ?? '',
      vendorId: json['vendorId']?.toString() ?? '',
      lastMessage: json['lastMessage'],
      updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : DateTime.now(),
      otherUser: json['otherUser'], // Expected to be populated by backend aggregation
    );
  }
}

class MessageEntity {
  final String id;
  final String chatId;
  final String senderId;
  final String content;
  final DateTime createdAt;

  MessageEntity({
    required this.id,
    required this.chatId,
    required this.senderId,
    required this.content,
    required this.createdAt,
  });

  factory MessageEntity.fromJson(Map<String, dynamic> json) {
    return MessageEntity(
      id: json['id']?.toString() ?? '',
      chatId: json['chatId']?.toString() ?? '',
      senderId: json['senderId']?.toString() ?? '',
      content: json['content'] ?? '',
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : DateTime.now(),
    );
  }
}
