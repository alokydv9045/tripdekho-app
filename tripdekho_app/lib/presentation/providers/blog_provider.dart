import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../data/models/blog_model.dart';
import '../../data/repositories/blog_repository.dart';
import 'auth_provider.dart';

part 'blog_provider.g.dart';

@riverpod
BlogRepository blogRepository(BlogRepositoryRef ref) {
  final dio = ref.watch(apiClientProvider).publicDio;
  return BlogRepository(dio);
}

@riverpod
Future<List<BlogModel>> fetchBlogs(FetchBlogsRef ref, {int limit = 10}) async {
  final repository = ref.watch(blogRepositoryProvider);
  return repository.getBlogs(limit: limit);
}
