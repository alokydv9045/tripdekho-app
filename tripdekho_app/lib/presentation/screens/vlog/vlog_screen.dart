import 'package:flutter/material.dart';

class VlogScreen extends StatelessWidget {
  const VlogScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Travel Vlogs')),
      body: ListView.builder(
        itemCount: 3,
        itemBuilder: (context, index) {
          return Card(
            margin: const EdgeInsets.all(16),
            clipBehavior: Clip.antiAlias,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Stack(
                  alignment: Alignment.center,
                  children: [
                    Image.network(
                      'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=800&q=80',
                      height: 200,
                      width: double.infinity,
                      fit: BoxFit.cover,
                    ),
                    const CircleAvatar(
                      radius: 30,
                      backgroundColor: Colors.white54,
                      child: Icon(Icons.play_arrow, size: 40, color: Colors.black87),
                    ),
                  ],
                ),
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Top 10 Hidden Beaches in Bali', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Text('By TravelWithUs • 12K views', style: TextStyle(color: theme.colorScheme.onSurface.withOpacity(0.6))),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
