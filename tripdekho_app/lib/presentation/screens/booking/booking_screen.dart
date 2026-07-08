import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import '../../providers/trip_provider.dart';
import '../../providers/booking_provider.dart';

final adultsProvider = StateProvider<int>((ref) => 2);
final childrenProvider = StateProvider<int>((ref) => 0);
final dateRangeProvider = StateProvider.autoDispose<DateTimeRange?>((ref) => null);

class BookingScreen extends ConsumerStatefulWidget {
  final String tripId;

  const BookingScreen({super.key, required this.tripId});

  @override
  ConsumerState<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends ConsumerState<BookingScreen> {
  late Razorpay _razorpay;

  @override
  void initState() {
    super.initState();
    _razorpay = Razorpay();
    _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
    _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);
    _razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, _handleExternalWallet);
  }

  @override
  void dispose() {
    _razorpay.clear();
    super.dispose();
  }

  void _handlePaymentSuccess(PaymentSuccessResponse response) {
    // Payment succeeded! Now create the booking on backend
    final dates = ref.read(dateRangeProvider);
    final adults = ref.read(adultsProvider);
    final children = ref.read(childrenProvider);
    
    if (dates != null) {
      ref.read(bookingNotifierProvider.notifier).createBooking(
        widget.tripId,
        adults + children,
        dates.start,
      );
    }
  }

  void _handlePaymentError(PaymentFailureResponse response) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Payment Failed: ${response.message}')));
  }

  void _handleExternalWallet(ExternalWalletResponse response) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('External Wallet: ${response.walletName}')));
  }

  void _openCheckout(double amount) {
    var options = {
      'key': 'rzp_test_your_key_here', // Replace with real key
      'amount': (amount * 100).toInt(), // amount in paise
      'name': 'TripDekho',
      'description': 'Booking Payment',
      'prefill': {
        'contact': '8888888888',
        'email': 'test@razorpay.com'
      }
    };

    try {
      _razorpay.open(options);
    } catch (e) {
      debugPrint('Error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    // We should probably fetch the specific trip from the API, but for now we look in featured or all trips
    // Wait, let's use the tripDetailsProvider we just created!
    final asyncTrip = ref.watch(tripDetailsProvider(widget.tripId));
    final theme = Theme.of(context);
    
    ref.listen<AsyncValue>(bookingNotifierProvider, (previous, next) {
      if (next.hasError) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed to book: ${next.error}')));
      } else if (next.hasValue && next.value != null) {
        // Success
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Booking Successful!')));
        context.push('/my-bookings');
      }
    });

    return Scaffold(
      backgroundColor: theme.colorScheme.surface,
      appBar: AppBar(
        title: const Text('Book Your Trip'),
        backgroundColor: Colors.transparent,
      ),
      body: asyncTrip.when(
        data: (trip) {
          return Column(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Trip Summary Card
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.primaryContainer.withOpacity(0.4),
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(color: theme.colorScheme.primary.withOpacity(0.2)),
                        ),
                        child: Row(
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(16),
                              child: Image.network(
                                trip.imageUrl,
                                width: 80,
                                height: 80,
                                fit: BoxFit.cover,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    trip.title,
                                    style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    '\$${trip.price.toInt()} / person / day',
                                    style: TextStyle(
                                      color: theme.colorScheme.primary,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ).animate().fade().slideY(begin: 0.1),
                      const SizedBox(height: 32),
                      
                      // Dates Section
                      Text(
                        'Select Dates',
                        style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                      ).animate().fade(delay: 100.ms).slideX(begin: 0.1),
                      const SizedBox(height: 16),
                      _buildDateSelector(context, ref).animate().fade(delay: 200.ms).slideX(begin: 0.1),
                      
                      const SizedBox(height: 32),
                      
                      // Guests Section
                      Text(
                        'Guests',
                        style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                      ).animate().fade(delay: 300.ms).slideX(begin: 0.1),
                      const SizedBox(height: 16),
                      _buildGuestCounter(
                        context,
                        ref,
                        title: 'Adults',
                        subtitle: 'Ages 13 or above',
                        provider: adultsProvider,
                        min: 1,
                      ).animate().fade(delay: 400.ms).slideX(begin: 0.1),
                      const SizedBox(height: 16),
                      _buildGuestCounter(
                        context,
                        ref,
                        title: 'Children',
                        subtitle: 'Ages 2-12',
                        provider: childrenProvider,
                        min: 0,
                      ).animate().fade(delay: 500.ms).slideX(begin: 0.1),
                    ],
                  ),
                ),
              ),
              // Bottom Pricing Bar
              _buildBottomBar(context, ref, trip.price).animate().slideY(begin: 1.0, duration: 600.ms, curve: Curves.easeOut),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, s) => Center(child: Text('Error: $e')),
      ),
    );
  }

  Widget _buildDateSelector(BuildContext context, WidgetRef ref) {
    final dateRange = ref.watch(dateRangeProvider);
    final theme = Theme.of(context);

    return InkWell(
      onTap: () async {
        final DateTimeRange? picked = await showDateRangePicker(
          context: context,
          firstDate: DateTime.now(),
          lastDate: DateTime.now().add(const Duration(days: 365)),
          builder: (context, child) {
            return Theme(
              data: Theme.of(context).copyWith(
                colorScheme: theme.colorScheme,
              ),
              child: child!,
            );
          },
        );
        if (picked != null) {
          ref.read(dateRangeProvider.notifier).state = picked;
        }
      },
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: theme.colorScheme.surfaceContainerHighest.withOpacity(0.5),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: theme.dividerColor.withOpacity(0.1)),
        ),
        child: Row(
          children: [
            Icon(Icons.calendar_month, color: theme.colorScheme.primary),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Dates',
                    style: TextStyle(
                      color: theme.colorScheme.onSurface.withOpacity(0.6),
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    dateRange == null
                        ? 'Select travel dates'
                        : '${DateFormat('MMM d').format(dateRange.start)} - ${DateFormat('MMM d').format(dateRange.end)}',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                ],
              ),
            ),
            Icon(Icons.chevron_right, color: theme.colorScheme.onSurface.withOpacity(0.5)),
          ],
        ),
      ),
    );
  }

  Widget _buildGuestCounter(BuildContext context, WidgetRef ref, {required String title, required String subtitle, required StateProvider<int> provider, required int min}) {
    final count = ref.watch(provider);
    final theme = Theme.of(context);

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            Text(subtitle, style: TextStyle(color: theme.colorScheme.onSurface.withOpacity(0.6), fontSize: 14)),
          ],
        ),
        Row(
          children: [
            IconButton(
              icon: const Icon(Icons.remove_circle_outline),
              color: count > min ? theme.colorScheme.primary : theme.dividerColor,
              onPressed: count > min ? () => ref.read(provider.notifier).state-- : null,
            ),
            SizedBox(
              width: 32,
              child: Text(
                count.toString(),
                textAlign: TextAlign.center,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
              ),
            ),
            IconButton(
              icon: const Icon(Icons.add_circle_outline),
              color: theme.colorScheme.primary,
              onPressed: () => ref.read(provider.notifier).state++,
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildBottomBar(BuildContext context, WidgetRef ref, double basePrice) {
    final theme = Theme.of(context);
    final adults = ref.watch(adultsProvider);
    final children = ref.watch(childrenProvider);
    final dates = ref.watch(dateRangeProvider);

    int days = 1;
    if (dates != null) {
      days = dates.end.difference(dates.start).inDays;
      if (days == 0) days = 1; // Minimum 1 day
    }

    final totalGuests = adults + children;
    // Simple mock calculation: basePrice * guests * days
    final totalPrice = basePrice * totalGuests * days;

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 20,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: SafeArea(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Total',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: theme.colorScheme.onSurface.withOpacity(0.6),
                  ),
                ),
                // Animated Price Transition
                TweenAnimationBuilder<double>(
                  tween: Tween<double>(begin: totalPrice, end: totalPrice),
                  duration: const Duration(milliseconds: 300),
                  builder: (context, value, child) {
                    return Text(
                      '\$${value.toInt()}',
                      style: theme.textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.w900,
                        color: theme.colorScheme.primary,
                      ),
                    );
                  },
                ),
              ],
            ),
            ElevatedButton(
              onPressed: dates == null || ref.watch(bookingNotifierProvider).isLoading
                  ? null
                  : () {
                      // Trigger Razorpay Checkout instead of direct booking creation
                      _openCheckout(totalPrice);
                    },
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 48, vertical: 16),
                backgroundColor: theme.colorScheme.primary,
                foregroundColor: theme.colorScheme.onPrimary,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                disabledBackgroundColor: theme.colorScheme.primary.withOpacity(0.3),
              ),
              child: ref.watch(bookingNotifierProvider).isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                    )
                  : const Text('Confirm', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }
}
