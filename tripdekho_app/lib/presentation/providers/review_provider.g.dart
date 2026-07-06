// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'review_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$reviewRepositoryHash() => r'72473b7a02afc5a155fb86d5c2c912ed895a7eeb';

/// See also [reviewRepository].
@ProviderFor(reviewRepository)
final reviewRepositoryProvider = AutoDisposeProvider<ReviewRepository>.internal(
  reviewRepository,
  name: r'reviewRepositoryProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$reviewRepositoryHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef ReviewRepositoryRef = AutoDisposeProviderRef<ReviewRepository>;
String _$fetchTopReviewsHash() => r'92022c0d70726fb9723d92ca3e26cbfcdfaf5a19';

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

/// See also [fetchTopReviews].
@ProviderFor(fetchTopReviews)
const fetchTopReviewsProvider = FetchTopReviewsFamily();

/// See also [fetchTopReviews].
class FetchTopReviewsFamily extends Family<AsyncValue<List<ReviewModel>>> {
  /// See also [fetchTopReviews].
  const FetchTopReviewsFamily();

  /// See also [fetchTopReviews].
  FetchTopReviewsProvider call({int limit = 10}) {
    return FetchTopReviewsProvider(limit: limit);
  }

  @override
  FetchTopReviewsProvider getProviderOverride(
    covariant FetchTopReviewsProvider provider,
  ) {
    return call(limit: provider.limit);
  }

  static const Iterable<ProviderOrFamily>? _dependencies = null;

  @override
  Iterable<ProviderOrFamily>? get dependencies => _dependencies;

  static const Iterable<ProviderOrFamily>? _allTransitiveDependencies = null;

  @override
  Iterable<ProviderOrFamily>? get allTransitiveDependencies =>
      _allTransitiveDependencies;

  @override
  String? get name => r'fetchTopReviewsProvider';
}

/// See also [fetchTopReviews].
class FetchTopReviewsProvider
    extends AutoDisposeFutureProvider<List<ReviewModel>> {
  /// See also [fetchTopReviews].
  FetchTopReviewsProvider({int limit = 10})
    : this._internal(
        (ref) => fetchTopReviews(ref as FetchTopReviewsRef, limit: limit),
        from: fetchTopReviewsProvider,
        name: r'fetchTopReviewsProvider',
        debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
            ? null
            : _$fetchTopReviewsHash,
        dependencies: FetchTopReviewsFamily._dependencies,
        allTransitiveDependencies:
            FetchTopReviewsFamily._allTransitiveDependencies,
        limit: limit,
      );

  FetchTopReviewsProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.limit,
  }) : super.internal();

  final int limit;

  @override
  Override overrideWith(
    FutureOr<List<ReviewModel>> Function(FetchTopReviewsRef provider) create,
  ) {
    return ProviderOverride(
      origin: this,
      override: FetchTopReviewsProvider._internal(
        (ref) => create(ref as FetchTopReviewsRef),
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        limit: limit,
      ),
    );
  }

  @override
  AutoDisposeFutureProviderElement<List<ReviewModel>> createElement() {
    return _FetchTopReviewsProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is FetchTopReviewsProvider && other.limit == limit;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, limit.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin FetchTopReviewsRef on AutoDisposeFutureProviderRef<List<ReviewModel>> {
  /// The parameter `limit` of this provider.
  int get limit;
}

class _FetchTopReviewsProviderElement
    extends AutoDisposeFutureProviderElement<List<ReviewModel>>
    with FetchTopReviewsRef {
  _FetchTopReviewsProviderElement(super.provider);

  @override
  int get limit => (origin as FetchTopReviewsProvider).limit;
}

// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
