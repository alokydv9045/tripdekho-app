import 'package:flutter_test/flutter_test.dart';
import 'package:tripdekho_app/main.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  testWidgets('App loads smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: TripDekhoApp()));
    expect(find.text('TripDekho'), findsOneWidget);
  });
}
