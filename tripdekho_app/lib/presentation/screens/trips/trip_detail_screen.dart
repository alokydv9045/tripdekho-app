import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../core/theme/app_colors.dart';
import 'package:go_router/go_router.dart';

class TripDetailScreen extends StatefulWidget {
  final String slug;
  const TripDetailScreen({super.key, required this.slug});

  @override
  State<TripDetailScreen> createState() => _TripDetailScreenState();
}

class _TripDetailScreenState extends State<TripDetailScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final String _sampleImage = 'https://res.cloudinary.com/dphw0c5r5/image/upload/v1719665671/india-hero_xkf3c8.jpg';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _openBookingSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom + 24,
          top: 24,
          left: 24,
          right: 24,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('Book Your Trip', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            const Text('Select Departure Date', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.grey500)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: [
                ChoiceChip(label: const Text('Oct 15'), selected: true, selectedColor: AppColors.primaryYellow, onSelected: (v){}),
                ChoiceChip(label: const Text('Nov 02'), selected: false, onSelected: (v){}),
                ChoiceChip(label: const Text('Nov 20'), selected: false, onSelected: (v){}),
              ],
            ),
            const SizedBox(height: 16),
            const Text('Number of Guests', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.grey500)),
            Row(
              children: [
                IconButton(icon: const Icon(Icons.remove_circle_outline), onPressed: (){}),
                const Text('2', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                IconButton(icon: const Icon(Icons.add_circle_outline), onPressed: (){}),
              ],
            ),
            const Divider(height: 32),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: const [
                Text('Total Amount', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                Text('₹30,000', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.darkText)),
              ],
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                context.pop();
                // trigger Razorpay payment
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryYellow,
                foregroundColor: AppColors.darkText,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: const Text('PROCEED TO PAYMENT', style: TextStyle(fontWeight: FontWeight.bold)),
            )
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgCream,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              title: const Text('Himalayan Adventure', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, textBaseline: TextBaseline.alphabetic)),
              titlePadding: const EdgeInsets.only(left: 48, bottom: 16),
              background: Stack(
                fit: StackFit.expand,
                children: [
                  CachedNetworkImage(
                    imageUrl: _sampleImage,
                    fit: BoxFit.cover,
                  ),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Colors.transparent, Colors.black.withValues(alpha: 0.7)],
                      )
                    ),
                  )
                ],
              ),
            ),
            actions: [
              IconButton(icon: const Icon(Icons.favorite_border), onPressed: (){}),
              IconButton(icon: const Icon(Icons.share), onPressed: (){}),
            ],
          ),
          SliverPersistentHeader(
            pinned: true,
            delegate: _SliverAppBarDelegate(
              TabBar(
                controller: _tabController,
                isScrollable: true,
                labelColor: AppColors.primaryYellow,
                unselectedLabelColor: AppColors.grey500,
                indicatorColor: AppColors.primaryYellow,
                tabs: const [
                  Tab(text: 'Overview'),
                  Tab(text: 'Itinerary'),
                  Tab(text: 'Info'),
                  Tab(text: 'Reviews'),
                ],
                // Wrap with Material to provide background color
              ),
            ),
          ),
          SliverFillRemaining(
            child: TabBarView(
              controller: _tabController,
              children: [
                // Overview
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: const [
                              Icon(Icons.location_on, color: AppColors.amber500),
                              Text(' Manali, HP', style: TextStyle(fontWeight: FontWeight.bold)),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(color: AppColors.amber500, borderRadius: BorderRadius.circular(20)),
                            child: const Text('4n 5d', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                          )
                        ],
                      ),
                      const SizedBox(height: 16),
                      const Text('Description', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      const Text('Experience the breathtaking beauty of the Himalayas in this 5-day adventure...'),
                    ],
                  ),
                ),
                // Itinerary
                ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: 5,
                  itemBuilder: (context, i) => ExpansionTile(
                    title: Text('Day ${i+1}: Adventure Begins'),
                    children: const [
                      Padding(
                        padding: EdgeInsets.all(16.0),
                        child: Text('Morning: Breakfast\nAfternoon: Trekking\nEvening: Bonfire'),
                      )
                    ],
                  ),
                ),
                // Info
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text('Inclusions', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      ListTile(leading: Icon(Icons.check, color: Colors.green), title: Text('Accommodation')),
                      ListTile(leading: Icon(Icons.check, color: Colors.green), title: Text('Meals (B, D)')),
                      SizedBox(height: 16),
                      Text('Exclusions', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      ListTile(leading: Icon(Icons.close, color: Colors.red), title: Text('Flights')),
                    ],
                  ),
                ),
                // Reviews
                ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: 3,
                  itemBuilder: (context, i) => const Card(
                    child: ListTile(
                      leading: CircleAvatar(child: Icon(Icons.person)),
                      title: Text('John Doe'),
                      subtitle: Text('Amazing experience! Highly recommended.'),
                      trailing: Row(mainAxisSize: MainAxisSize.min, children: [Icon(Icons.star, color: Colors.amber, size: 16), Text('5.0')]),
                    ),
                  ),
                ),
              ],
            ),
          )
        ],
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, -4))],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text('Price per person', style: TextStyle(color: AppColors.grey500, fontSize: 12)),
                Text('₹15,000', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.darkText)),
              ],
            ),
            ElevatedButton(
              onPressed: _openBookingSheet,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryYellow,
                foregroundColor: AppColors.darkText,
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: const Text('BOOK NOW', style: TextStyle(fontWeight: FontWeight.bold)),
            )
          ],
        ),
      ),
    );
  }
}

class _SliverAppBarDelegate extends SliverPersistentHeaderDelegate {
  final TabBar _tabBar;
  _SliverAppBarDelegate(this._tabBar);

  @override
  double get minExtent => _tabBar.preferredSize.height;
  @override
  double get maxExtent => _tabBar.preferredSize.height;

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    return Container(
      color: Colors.white,
      child: _tabBar,
    );
  }

  @override
  bool shouldRebuild(_SliverAppBarDelegate oldDelegate) {
    return false;
  }
}
