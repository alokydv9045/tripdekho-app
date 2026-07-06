import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _searchCtrl = TextEditingController();
  final List<String> _recentSearches = ['Manali', 'Goa', 'Kerala'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgCream,
      appBar: AppBar(
        backgroundColor: Colors.white,
        iconTheme: const IconThemeData(color: AppColors.darkText),
        title: TextField(
          controller: _searchCtrl,
          autofocus: true,
          decoration: const InputDecoration(
            hintText: 'Search destinations...',
            border: InputBorder.none,
          ),
          onSubmitted: (val) {
            // execute search
          },
        ),
        actions: [
          if (_searchCtrl.text.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.clear),
              onPressed: () {
                setState(() {
                  _searchCtrl.clear();
                });
              },
            )
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Recent Searches', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.grey500)),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              children: _recentSearches.map((s) => ActionChip(
                label: Text(s),
                onPressed: () {
                  _searchCtrl.text = s;
                  // execute search
                },
                backgroundColor: AppColors.cardBg,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: const BorderSide(color: AppColors.grey100)),
              )).toList(),
            ),
            const SizedBox(height: 32),
            const Text('Popular Destinations', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.grey500)),
            const SizedBox(height: 12),
            Expanded(
              child: ListView.separated(
                itemCount: 5,
                separatorBuilder: (_, _) => const Divider(height: 1),
                itemBuilder: (context, index) {
                  return ListTile(
                    leading: const Icon(Icons.trending_up, color: AppColors.amber500),
                    title: Text('Popular Destination $index'),
                    onTap: () {},
                  );
                },
              ),
            )
          ],
        ),
      ),
    );
  }
}
