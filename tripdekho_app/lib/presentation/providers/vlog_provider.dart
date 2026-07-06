import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../data/models/vlog_model.dart';
import '../../data/repositories/vlog_repository.dart';
import 'auth_provider.dart';

part 'vlog_provider.g.dart';

@riverpod
VlogRepository vlogRepository(VlogRepositoryRef ref) {
  final dio = ref.watch(apiClientProvider).publicDio;
  return VlogRepository(dio);
}

@riverpod
Future<List<VlogModel>> fetchVlogs(FetchVlogsRef ref, {int limit = 10}) async {
  final repository = ref.watch(vlogRepositoryProvider);
  return repository.getVlogs(limit: limit);
}
