import 'package:flutter/material.dart';

class AiPlannerScreen extends StatelessWidget {
  const AiPlannerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: const Text('AI Trip Planner')),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                _buildChatBubble('Hi! I am your AI travel assistant. Where would you like to go?', isBot: true, theme: theme),
                _buildChatBubble('I want to go somewhere with beaches for 5 days.', isBot: false, theme: theme),
                _buildChatBubble('Great choice! Based on your preference, I recommend Goa, Maldives, or Bali. Would you like to see featured trips for these destinations?', isBot: true, theme: theme),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.all(16),
            color: theme.colorScheme.surface,
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: 'Type your preferences...',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(24)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 20),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                CircleAvatar(
                  backgroundColor: theme.colorScheme.primary,
                  child: IconButton(icon: const Icon(Icons.send, color: Colors.white), onPressed: () {}),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChatBubble(String text, {required bool isBot, required ThemeData theme}) {
    return Align(
      alignment: isBot ? Alignment.centerLeft : Alignment.centerRight,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12, right: 32, left: 32),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isBot ? theme.colorScheme.surfaceContainerHighest : theme.colorScheme.primary,
          borderRadius: BorderRadius.circular(16).copyWith(
            bottomLeft: isBot ? const Radius.circular(0) : const Radius.circular(16),
            bottomRight: !isBot ? const Radius.circular(0) : const Radius.circular(16),
          ),
        ),
        child: Text(
          text,
          style: TextStyle(color: isBot ? theme.colorScheme.onSurface : theme.colorScheme.onPrimary),
        ),
      ),
    );
  }
}
