// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'blog_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$blogRepositoryHash() => r'1230015e8865a6ef449bdb7b1c9b4528cf2e849f';

/// See also [blogRepository].
@ProviderFor(blogRepository)
final blogRepositoryProvider = AutoDisposeProvider<BlogRepository>.internal(
  blogRepository,
  name: r'blogRepositoryProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$blogRepositoryHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef BlogRepositoryRef = AutoDisposeProviderRef<BlogRepository>;
String _$fetchBlogsHash() => r'dbf794584b0395aca3fbeda4ac7640ec2f1fcba5';

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

/// See also [fetchBlogs].
@ProviderFor(fetchBlogs)
const fetchBlogsProvider = FetchBlogsFamily();

/// See also [fetchBlogs].
class FetchBlogsFamily extends Family<AsyncValue<List<BlogModel>>> {
  /// See also [fetchBlogs].
  const FetchBlogsFamily();

  /// See also [fetchBlogs].
  FetchBlogsProvider call({int limit = 10}) {
    return FetchBlogsProvider(limit: limit);
  }

  @override
  FetchBlogsProvider getProviderOverride(
    covariant FetchBlogsProvider provider,
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
  String? get name => r'fetchBlogsProvider';
}

/// See also [fetchBlogs].
class FetchBlogsProvider extends AutoDisposeFutureProvider<List<BlogModel>> {
  /// See also [fetchBlogs].
  FetchBlogsProvider({int limit = 10})
    : this._internal(
        (ref) => fetchBlogs(ref as FetchBlogsRef, limit: limit),
        from: fetchBlogsProvider,
        name: r'fetchBlogsProvider',
        debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
            ? null
            : _$fetchBlogsHash,
        dependencies: FetchBlogsFamily._dependencies,
        allTransitiveDependencies: FetchBlogsFamily._allTransitiveDependencies,
        limit: limit,
      );

  FetchBlogsProvider._internal(
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
    FutureOr<List<BlogModel>> Function(FetchBlogsRef provider) create,
  ) {
    return ProviderOverride(
      origin: this,
      override: FetchBlogsProvider._internal(
        (ref) => create(ref as FetchBlogsRef),
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
  AutoDisposeFutureProviderElement<List<BlogModel>> createElement() {
    return _FetchBlogsProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is FetchBlogsProvider && other.limit == limit;
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
mixin FetchBlogsRef on AutoDisposeFutureProviderRef<List<BlogModel>> {
  /// The parameter `limit` of this provider.
  int get limit;
}

class _FetchBlogsProviderElement
    extends AutoDisposeFutureProviderElement<List<BlogModel>>
    with FetchBlogsRef {
  _FetchBlogsProviderElement(super.provider);

  @override
  int get limit => (origin as FetchBlogsProvider).limit;
}

// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
