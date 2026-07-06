import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../data/models/review_model.dart';
import '../../data/repositories/review_repository.dart';
import 'auth_provider.dart';

part 'review_provider.g.dart';

@riverpod
ReviewRepository reviewRepository(ReviewRepositoryRef ref) {
  final dio = ref.watch(apiClientProvider).publicDio;
  return ReviewRepository(dio);
}

@riverpod
Future<List<ReviewModel>> fetchTopReviews(FetchTopReviewsRef ref, {int limit = 10}) async {
  final repository = ref.watch(reviewRepositoryProvider);
  return repository.getTopReviews(limit: limit);
}
