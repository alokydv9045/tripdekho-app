import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

class MessagesScreen extends StatelessWidget {
  const MessagesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgCream,
      appBar: AppBar(
        title: const Text('Messages', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(icon: const Icon(Icons.search), onPressed: () {}),
        ],
      ),
      body: ListView.separated(
        itemCount: 5,
        separatorBuilder: (context, index) => const Divider(height: 1),
        itemBuilder: (context, index) {
          final isUnread = index < 2;
          return Container(
            color: isUnread ? Colors.amber.shade50 : Colors.white,
            child: ListTile(
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              leading: const CircleAvatar(
                radius: 24,
                backgroundImage: NetworkImage('https://res.cloudinary.com/dphw0c5r5/image/upload/v1719665671/india-hero_xkf3c8.jpg'), // placeholder
              ),
              title: const Text('Himalayan Treks & Tours', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text(
                'Yes, we can arrange a pickup from the airport.',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  color: isUnread ? AppColors.darkText : AppColors.grey500,
                  fontWeight: isUnread ? FontWeight.bold : FontWeight.normal,
                ),
              ),
              trailing: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text('10:3$index AM', style: TextStyle(color: isUnread ? AppColors.primaryYellow : AppColors.grey500, fontSize: 12)),
                  if (isUnread)
                    Container(
                      margin: const EdgeInsets.only(top: 4),
                      padding: const EdgeInsets.all(6),
                      decoration: const BoxDecoration(
                        color: AppColors.redBadge,
                        shape: BoxShape.circle,
                      ),
                      child: const Text('2', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                    )
                ],
              ),
              onTap: () {
                context.push('/messages/chat-$index');
              },
            ),
          );
        },
      ),
    );
  }
}
