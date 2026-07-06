import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';

class AiPlannerScreen extends StatefulWidget {
  const AiPlannerScreen({super.key});

  @override
  State<AiPlannerScreen> createState() => _AiPlannerScreenState();
}

class _AiPlannerScreenState extends State<AiPlannerScreen> {
  final _destinationCtrl = TextEditingController();
  final _durationCtrl = TextEditingController(text: '3');
  String _budget = 'moderate';
  final _interestsCtrl = TextEditingController();

  bool _isGenerating = false;
  List<Map<String, dynamic>>? _itinerary;

  void _generate() async {
    setState(() => _isGenerating = true);
    // Simulate AI API call
    await Future.delayed(const Duration(seconds: 3));
    setState(() {
      _isGenerating = false;
      _itinerary = [
        {
          'day': 1,
          'title': 'Arrival & City Tour',
          'activities': [
            'Arrive at airport and check-in to hotel',
            'Lunch at a local cafe',
            'Evening stroll and dinner',
          ]
        },
        {
          'day': 2,
          'title': 'Adventure & Exploration',
          'activities': [
            'Morning hiking expedition',
            'Visit local historical sites',
            'Sunset viewing point',
          ]
        }
      ];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Dark slate background matching web's gray-900
      appBar: AppBar(
        title: Text(
          'TripDekho AI', 
          style: GoogleFonts.plusJakartaSans(
            fontWeight: FontWeight.w800, 
            color: Colors.white,
            letterSpacing: -0.5
          )
        ),
        backgroundColor: const Color(0xFF0F172A),
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header
            Text(
              'AI Trip Planner',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 36,
                fontWeight: FontWeight.w900,
                color: Colors.white,
                letterSpacing: -1.0,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Describe your dream trip and let our AI generate a personalized itinerary.',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 14,
                color: Colors.grey.shade400,
              ),
            ),
            const SizedBox(height: 32),

            // Form Container
            Container(
              decoration: BoxDecoration(
                color: Colors.white.withAlpha(10), // bg-white/5 equivalent
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.white.withAlpha(20)),
              ),
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildLabel('Destination'),
                  _buildTextField(_destinationCtrl, 'e.g. Paris, Tokyo, Bali'),
                  const SizedBox(height: 20),

                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            _buildLabel('Duration (Days)'),
                            _buildTextField(_durationCtrl, '3', isNumber: true),
                          ],
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            _buildLabel('Budget'),
                            Container(
                              height: 52,
                              padding: const EdgeInsets.symmetric(horizontal: 16),
                              decoration: BoxDecoration(
                                color: Colors.white.withAlpha(10),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: Colors.white.withAlpha(20)),
                              ),
                              child: DropdownButtonHideUnderline(
                                child: DropdownButton<String>(
                                  value: _budget,
                                  dropdownColor: const Color(0xFF1E293B),
                                  isExpanded: true,
                                  icon: const Icon(Icons.keyboard_arrow_down_rounded, color: Colors.white),
                                  style: GoogleFonts.plusJakartaSans(color: Colors.white, fontWeight: FontWeight.w600),
                                  items: const [
                                    DropdownMenuItem(value: 'budget', child: Text('Budget')),
                                    DropdownMenuItem(value: 'moderate', child: Text('Moderate')),
                                    DropdownMenuItem(value: 'luxury', child: Text('Luxury')),
                                  ],
                                  onChanged: (val) {
                                    if (val != null) setState(() => _budget = val);
                                  },
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  _buildLabel('Interests (comma separated)'),
                  _buildTextField(_interestsCtrl, 'e.g. History, Food, Nightlife'),
                  const SizedBox(height: 32),

                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: _isGenerating ? null : _generate,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue.shade600, // web uses blue-600
                        foregroundColor: Colors.white,
                        elevation: 10,
                        shadowColor: Colors.blue.shade500.withAlpha(80),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: _isGenerating
                          ? const SizedBox(height: 24, width: 24, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                          : Text('Generate Itinerary', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 16)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Results
            if (_itinerary != null)
              Container(
                decoration: BoxDecoration(
                  color: Colors.white.withAlpha(10),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.white.withAlpha(20)),
                ),
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Your Custom Plan', style: GoogleFonts.plusJakartaSans(fontSize: 24, fontWeight: FontWeight.w900, color: Colors.blue.shade400, letterSpacing: -0.5)),
                    const SizedBox(height: 24),
                    ..._itinerary!.map((day) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 24),
                        child: Container(
                          decoration: BoxDecoration(
                            border: Border(left: BorderSide(color: Colors.blue.shade500, width: 2)),
                          ),
                          padding: const EdgeInsets.only(left: 16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Day ${day['day']}: ${day['title']}', style: GoogleFonts.plusJakartaSans(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white)),
                              const SizedBox(height: 12),
                              ...List<Widget>.from(day['activities'].map((act) => Padding(
                                padding: const EdgeInsets.only(bottom: 8),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Padding(
                                      padding: EdgeInsets.only(top: 6, right: 8),
                                      child: Icon(Icons.circle, size: 6, color: Colors.grey),
                                    ),
                                    Expanded(child: Text(act, style: GoogleFonts.plusJakartaSans(color: Colors.grey.shade400, height: 1.5))),
                                  ],
                                ),
                              ))),
                            ],
                          ),
                        ),
                      );
                    }),
                  ],
                ),
              ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        text,
        style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700, color: Colors.white, fontSize: 14),
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String hint, {bool isNumber = false}) {
    return Container(
      height: 52,
      decoration: BoxDecoration(
        color: Colors.white.withAlpha(10),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withAlpha(20)),
      ),
      child: TextField(
        controller: controller,
        keyboardType: isNumber ? TextInputType.number : TextInputType.text,
        style: GoogleFonts.plusJakartaSans(color: Colors.white, fontWeight: FontWeight.w500),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: GoogleFonts.plusJakartaSans(color: Colors.white.withAlpha(100)),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          border: InputBorder.none,
        ),
      ),
    );
  }
}
