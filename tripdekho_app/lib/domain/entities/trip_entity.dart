class TripEntity {
  final String id;
  final String title;
  final String location;
  final String imageUrl;
  final double price;
  final double rating;
  final int reviews;

  const TripEntity({
    required this.id,
    required this.title,
    required this.location,
    required this.imageUrl,
    required this.price,
    required this.rating,
    required this.reviews,
  });

  factory TripEntity.fromJson(Map<String, dynamic> json) {
    // Note: The backend schema might differ slightly, map it properly.
    // For nested fields like location.city, we need safety checks.
    final locationName = json['location'] != null && json['location'] is Map
        ? json['location']['city'] ?? json['location']['country'] ?? 'Unknown Location'
        : 'Unknown Location';

    final thumbnailUrl = json['thumbnail'] != null && json['thumbnail'] is Map
        ? json['thumbnail']['url']
        : 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80';

    final priceData = json['price'] != null && json['price'] is Map
        ? json['price']['basePrice']?.toDouble() ?? 0.0
        : 0.0;

    return TripEntity(
      id: json['id']?.toString() ?? '',
      title: json['title'] ?? 'Unnamed Trip',
      location: locationName,
      imageUrl: thumbnailUrl,
      price: priceData,
      rating: 4.5, // Mock rating for now unless backend provides it
      reviews: 100, // Mock reviews for now
    );
  }
}
