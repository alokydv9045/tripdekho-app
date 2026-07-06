// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'trip_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$tripRepositoryHash() => r'12d4005004e602166fcc49c210f2e98c0d777766';

/// See also [tripRepository].
@ProviderFor(tripRepository)
final tripRepositoryProvider = AutoDisposeProvider<TripRepository>.internal(
  tripRepository,
  name: r'tripRepositoryProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$tripRepositoryHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef TripRepositoryRef = AutoDisposeProviderRef<TripRepository>;
String _$fetchTripsHash() => r'709e052584b699b29f662fdb51e8ed800d217ab6';

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

/// See also [fetchTrips].
@ProviderFor(fetchTrips)
const fetchTripsProvider = FetchTripsFamily();

/// See also [fetchTrips].
class FetchTripsFamily extends Family<AsyncValue<List<TripModel>>> {
  /// See also [fetchTrips].
  const FetchTripsFamily();

  /// See also [fetchTrips].
  FetchTripsProvider call({
    String? category,
    String? search,
    String? tags,
    int limit = 10,
  }) {
    return FetchTripsProvider(
      category: category,
      search: search,
      tags: tags,
      limit: limit,
    );
  }

  @override
  FetchTripsProvider getProviderOverride(
    covariant FetchTripsProvider provider,
  ) {
    return call(
      category: provider.category,
      search: provider.search,
      tags: provider.tags,
      limit: provider.limit,
    );
  }

  static const Iterable<ProviderOrFamily>? _dependencies = null;

  @override
  Iterable<ProviderOrFamily>? get dependencies => _dependencies;

  static const Iterable<ProviderOrFamily>? _allTransitiveDependencies = null;

  @override
  Iterable<ProviderOrFamily>? get allTransitiveDependencies =>
      _allTransitiveDependencies;

  @override
  String? get name => r'fetchTripsProvider';
}

/// See also [fetchTrips].
class FetchTripsProvider extends AutoDisposeFutureProvider<List<TripModel>> {
  /// See also [fetchTrips].
  FetchTripsProvider({
    String? category,
    String? search,
    String? tags,
    int limit = 10,
  }) : this._internal(
         (ref) => fetchTrips(
           ref as FetchTripsRef,
           category: category,
           search: search,
           tags: tags,
           limit: limit,
         ),
         from: fetchTripsProvider,
         name: r'fetchTripsProvider',
         debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
             ? null
             : _$fetchTripsHash,
         dependencies: FetchTripsFamily._dependencies,
         allTransitiveDependencies: FetchTripsFamily._allTransitiveDependencies,
         category: category,
         search: search,
         tags: tags,
         limit: limit,
       );

  FetchTripsProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.category,
    required this.search,
    required this.tags,
    required this.limit,
  }) : super.internal();

  final String? category;
  final String? search;
  final String? tags;
  final int limit;

  @override
  Override overrideWith(
    FutureOr<List<TripModel>> Function(FetchTripsRef provider) create,
  ) {
    return ProviderOverride(
      origin: this,
      override: FetchTripsProvider._internal(
        (ref) => create(ref as FetchTripsRef),
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        category: category,
        search: search,
        tags: tags,
        limit: limit,
      ),
    );
  }

  @override
  AutoDisposeFutureProviderElement<List<TripModel>> createElement() {
    return _FetchTripsProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is FetchTripsProvider &&
        other.category == category &&
        other.search == search &&
        other.tags == tags &&
        other.limit == limit;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, category.hashCode);
    hash = _SystemHash.combine(hash, search.hashCode);
    hash = _SystemHash.combine(hash, tags.hashCode);
    hash = _SystemHash.combine(hash, limit.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin FetchTripsRef on AutoDisposeFutureProviderRef<List<TripModel>> {
  /// The parameter `category` of this provider.
  String? get category;

  /// The parameter `search` of this provider.
  String? get search;

  /// The parameter `tags` of this provider.
  String? get tags;

  /// The parameter `limit` of this provider.
  int get limit;
}

class _FetchTripsProviderElement
    extends AutoDisposeFutureProviderElement<List<TripModel>>
    with FetchTripsRef {
  _FetchTripsProviderElement(super.provider);

  @override
  String? get category => (origin as FetchTripsProvider).category;
  @override
  String? get search => (origin as FetchTripsProvider).search;
  @override
  String? get tags => (origin as FetchTripsProvider).tags;
  @override
  int get limit => (origin as FetchTripsProvider).limit;
}

String _$fetchTripDetailHash() => r'ff5e0b5cfc7b65beb55405755f68e69d30d7ddbd';

/// See also [fetchTripDetail].
@ProviderFor(fetchTripDetail)
const fetchTripDetailProvider = FetchTripDetailFamily();

/// See also [fetchTripDetail].
class FetchTripDetailFamily extends Family<AsyncValue<TripModel?>> {
  /// See also [fetchTripDetail].
  const FetchTripDetailFamily();

  /// See also [fetchTripDetail].
  FetchTripDetailProvider call(String id) {
    return FetchTripDetailProvider(id);
  }

  @override
  FetchTripDetailProvider getProviderOverride(
    covariant FetchTripDetailProvider provider,
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
  String? get name => r'fetchTripDetailProvider';
}

/// See also [fetchTripDetail].
class FetchTripDetailProvider extends AutoDisposeFutureProvider<TripModel?> {
  /// See also [fetchTripDetail].
  FetchTripDetailProvider(String id)
    : this._internal(
        (ref) => fetchTripDetail(ref as FetchTripDetailRef, id),
        from: fetchTripDetailProvider,
        name: r'fetchTripDetailProvider',
        debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
            ? null
            : _$fetchTripDetailHash,
        dependencies: FetchTripDetailFamily._dependencies,
        allTransitiveDependencies:
            FetchTripDetailFamily._allTransitiveDependencies,
        id: id,
      );

  FetchTripDetailProvider._internal(
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
    FutureOr<TripModel?> Function(FetchTripDetailRef provider) create,
  ) {
    return ProviderOverride(
      origin: this,
      override: FetchTripDetailProvider._internal(
        (ref) => create(ref as FetchTripDetailRef),
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
  AutoDisposeFutureProviderElement<TripModel?> createElement() {
    return _FetchTripDetailProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is FetchTripDetailProvider && other.id == id;
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
mixin FetchTripDetailRef on AutoDisposeFutureProviderRef<TripModel?> {
  /// The parameter `id` of this provider.
  String get id;
}

class _FetchTripDetailProviderElement
    extends AutoDisposeFutureProviderElement<TripModel?>
    with FetchTripDetailRef {
  _FetchTripDetailProviderElement(super.provider);

  @override
  String get id => (origin as FetchTripDetailProvider).id;
}

// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
