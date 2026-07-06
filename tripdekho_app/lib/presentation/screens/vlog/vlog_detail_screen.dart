import 'package:flutter/material.dart';
import 'package:youtube_player_flutter/youtube_player_flutter.dart';
import '../../../core/theme/app_colors.dart';

class VlogDetailScreen extends StatefulWidget {
  final String vlogId;
  const VlogDetailScreen({super.key, required this.vlogId});

  @override
  State<VlogDetailScreen> createState() => _VlogDetailScreenState();
}

class _VlogDetailScreenState extends State<VlogDetailScreen> {
  late YoutubePlayerController _controller;
  
  @override
  void initState() {
    super.initState();
    // Use a placeholder video ID
    _controller = YoutubePlayerController(
      initialVideoId: 'dQw4w9WgXcQ', 
      flags: const YoutubePlayerFlags(
        autoPlay: true,
        mute: false,
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgCream,
      appBar: AppBar(
        title: const Text('Vlog Details', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(icon: const Icon(Icons.share), onPressed: () {}),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            YoutubePlayer(
              controller: _controller,
              showVideoProgressIndicator: true,
              progressIndicatorColor: AppColors.primaryYellow,
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Wrap(
                    spacing: 8,
                    children: [
                      Chip(label: const Text('Kerala', style: TextStyle(fontSize: 10)), padding: EdgeInsets.zero, backgroundColor: AppColors.amber500.withValues(alpha: 0.2), side: BorderSide.none),
                      Chip(label: const Text('Nature', style: TextStyle(fontSize: 10)), padding: EdgeInsets.zero, backgroundColor: Colors.green.withValues(alpha: 0.2), side: BorderSide.none),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    '5 Hidden Gems in Kerala You Must Visit',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.darkText),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('10K views • 2 days ago', style: TextStyle(color: AppColors.grey500)),
                      Row(
                        children: [
                          IconButton(icon: const Icon(Icons.thumb_up_alt_outlined), onPressed: (){}),
                          const Text('1.2K'),
                        ],
                      )
                    ],
                  ),
                  const Divider(height: 32),
                  const Text('Description', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  const Text(
                    'Join us as we explore the beautiful backwaters, lush green tea gardens, and hidden waterfalls in Kerala. This trip covers Munnar, Alleppey, and Wayanad...',
                    style: TextStyle(height: 1.5),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
