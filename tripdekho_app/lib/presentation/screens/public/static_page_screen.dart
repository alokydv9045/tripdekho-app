import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

class StaticPageScreen extends StatelessWidget {
  final String title;
  const StaticPageScreen({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgCream,
      appBar: AppBar(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Text(
          'This is the $title page. In a full implementation, this would fetch HTML content from the CMS or load a static markdown file and render it using flutter_html or flutter_markdown.',
          style: const TextStyle(height: 1.5),
        ),
      ),
    );
  }
}
