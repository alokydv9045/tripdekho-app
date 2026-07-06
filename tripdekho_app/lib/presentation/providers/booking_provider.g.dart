// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'booking_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$bookingRepositoryHash() => r'8afe5e61db7c002fef42049a96c638fd27fd919d';

/// See also [bookingRepository].
@ProviderFor(bookingRepository)
final bookingRepositoryProvider =
    AutoDisposeProvider<BookingRepository>.internal(
      bookingRepository,
      name: r'bookingRepositoryProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$bookingRepositoryHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef BookingRepositoryRef = AutoDisposeProviderRef<BookingRepository>;
String _$fetchMyBookingsHash() => r'8f531b079b9fc6abbae4e409c4c77e55f1d9bcc1';

/// See also [fetchMyBookings].
@ProviderFor(fetchMyBookings)
final fetchMyBookingsProvider =
    AutoDisposeFutureProvider<List<BookingModel>>.internal(
      fetchMyBookings,
      name: r'fetchMyBookingsProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$fetchMyBookingsHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef FetchMyBookingsRef = AutoDisposeFutureProviderRef<List<BookingModel>>;
String _$fetchBookingDetailHash() =>
    r'0ec7cfbb5874f364450c1bd7d7cd2b3223b8cf4b';

/// Copied from Dart SDK
class _SystemHash {
  _SystemHash._();

  static int combine(int hash, int value) {
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + value);
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + ((0x0007ffff & hash) << 10));
    return hash ^ (hash >> 6);
  }

  static int finish(int hash) {
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + ((0x03ffffff & hash) << 3));
    // ignore: parameter_assignments
    hash = hash ^ (hash >> 11);
    return 0x1fffffff & (hash + ((0x00003fff & hash) << 15));
  }
}

/// See also [fetchBookingDetail].
@ProviderFor(fetchBookingDetail)
const fetchBookingDetailProvider = FetchBookingDetailFamily();

/// See also [fetchBookingDetail].
class FetchBookingDetailFamily extends Family<AsyncValue<BookingModel?>> {
  /// See also [fetchBookingDetail].
  const FetchBookingDetailFamily();

  /// See also [fetchBookingDetail].
  FetchBookingDetailProvider call(String id) {
    return FetchBookingDetailProvider(id);
  }

  @override
  FetchBookingDetailProvider getProviderOverride(
    covariant FetchBookingDetailProvider provider,
  ) {
    return call(provider.id);
  }

  static const Iterable<ProviderOrFamily>? _dependencies = null;

  @override
  Iterable<ProviderOrFamily>? get dependencies => _dependencies;

  static const Iterable<ProviderOrFamily>? _allTransitiveDependencies = null;

  @override
  Iterable<ProviderOrFamily>? get allTransitiveDependencies =>
      _allTransitiveDependencies;

  @override
  String? get name => r'fetchBookingDetailProvider';
}

/// See also [fetchBookingDetail].
class FetchBookingDetailProvider
    extends AutoDisposeFutureProvider<BookingModel?> {
  /// See also [fetchBookingDetail].
  FetchBookingDetailProvider(String id)
    : this._internal(
        (ref) => fetchBookingDetail(ref as FetchBookingDetailRef, id),
        from: fetchBookingDetailProvider,
        name: r'fetchBookingDetailProvider',
        debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
            ? null
            : _$fetchBookingDetailHash,
        dependencies: FetchBookingDetailFamily._dependencies,
        allTransitiveDependencies:
            FetchBookingDetailFamily._allTransitiveDependencies,
        id: id,
      );

  FetchBookingDetailProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.id,
  }) : super.internal();

  final String id;

  @override
  Override overrideWith(
    FutureOr<BookingModel?> Function(FetchBookingDetailRef provider) create,
  ) {
    return ProviderOverride(
      origin: this,
      override: FetchBookingDetailProvider._internal(
        (ref) => create(ref as FetchBookingDetailRef),
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        id: id,
      ),
    );
  }

  @override
  AutoDisposeFutureProviderElement<BookingModel?> createElement() {
    return _FetchBookingDetailProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is FetchBookingDetailProvider && other.id == id;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, id.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin FetchBookingDetailRef on AutoDisposeFutureProviderRef<BookingModel?> {
  /// The parameter `id` of this provider.
  String get id;
}

class _FetchBookingDetailProviderElement
    extends AutoDisposeFutureProviderElement<BookingModel?>
    with FetchBookingDetailRef {
  _FetchBookingDetailProviderElement(super.provider);

  @override
  String get id => (origin as FetchBookingDetailProvider).id;
}

// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
