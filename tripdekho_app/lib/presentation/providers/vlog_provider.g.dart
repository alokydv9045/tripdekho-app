// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'vlog_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$vlogRepositoryHash() => r'b084b943160810831864588663da3dd84b1d4d45';

/// See also [vlogRepository].
@ProviderFor(vlogRepository)
final vlogRepositoryProvider = AutoDisposeProvider<VlogRepository>.internal(
  vlogRepository,
  name: r'vlogRepositoryProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$vlogRepositoryHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef VlogRepositoryRef = AutoDisposeProviderRef<VlogRepository>;
String _$fetchVlogsHash() => r'54e96f515a47d8120e29681f715813ab465c0dde';

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

/// See also [fetchVlogs].
@ProviderFor(fetchVlogs)
const fetchVlogsProvider = FetchVlogsFamily();

/// See also [fetchVlogs].
class FetchVlogsFamily extends Family<AsyncValue<List<VlogModel>>> {
  /// See also [fetchVlogs].
  const FetchVlogsFamily();

  /// See also [fetchVlogs].
  FetchVlogsProvider call({int limit = 10}) {
    return FetchVlogsProvider(limit: limit);
  }

  @override
  FetchVlogsProvider getProviderOverride(
    covariant FetchVlogsProvider provider,
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
  String? get name => r'fetchVlogsProvider';
}

/// See also [fetchVlogs].
class FetchVlogsProvider extends AutoDisposeFutureProvider<List<VlogModel>> {
  /// See also [fetchVlogs].
  FetchVlogsProvider({int limit = 10})
    : this._internal(
        (ref) => fetchVlogs(ref as FetchVlogsRef, limit: limit),
        from: fetchVlogsProvider,
        name: r'fetchVlogsProvider',
        debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
            ? null
            : _$fetchVlogsHash,
        dependencies: FetchVlogsFamily._dependencies,
        allTransitiveDependencies: FetchVlogsFamily._allTransitiveDependencies,
        limit: limit,
      );

  FetchVlogsProvider._internal(
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
    FutureOr<List<VlogModel>> Function(FetchVlogsRef provider) create,
  ) {
    return ProviderOverride(
      origin: this,
      override: FetchVlogsProvider._internal(
        (ref) => create(ref as FetchVlogsRef),
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
  AutoDisposeFutureProviderElement<List<VlogModel>> createElement() {
    return _FetchVlogsProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is FetchVlogsProvider && other.limit == limit;
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
mixin FetchVlogsRef on AutoDisposeFutureProviderRef<List<VlogModel>> {
  /// The parameter `limit` of this provider.
  int get limit;
}

class _FetchVlogsProviderElement
    extends AutoDisposeFutureProviderElement<List<VlogModel>>
    with FetchVlogsRef {
  _FetchVlogsProviderElement(super.provider);

  @override
  int get limit => (origin as FetchVlogsProvider).limit;
}

// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
