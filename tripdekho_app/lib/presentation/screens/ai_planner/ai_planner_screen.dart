import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

class AiPlannerScreen extends StatefulWidget {
  const AiPlannerScreen({super.key});

  @override
  State<AiPlannerScreen> createState() => _AiPlannerScreenState();
}

class _AiPlannerScreenState extends State<AiPlannerScreen> {
  final _destinationCtrl = TextEditingController();
  double _duration = 3;
  double _budget = 50000;
  
  final List<String> _interests = ['Adventure', 'Nature', 'Culture', 'Food', 'Relaxation', 'Wildlife'];
  final Set<String> _selectedInterests = {};
  
  String _travelStyle = 'Family';
  final List<String> _styles = ['Solo', 'Couple', 'Family', 'Group'];

  bool _isGenerating = false;

  void _generate() async {
    setState(() => _isGenerating = true);
    // Simulate AI API call
    await Future.delayed(const Duration(seconds: 3));
    setState(() => _isGenerating = false);
    
    // In a real app, this would show the generated itinerary, probably via a bottom sheet or new screen
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Itinerary generated successfully!'), backgroundColor: Colors.green),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgCream,
      appBar: AppBar(
        title: const Text('AI Trip Planner', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('Where do you want to go?', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            TextField(
              controller: _destinationCtrl,
              decoration: InputDecoration(
                hintText: 'e.g., Bali, Switzerland, Kerala...',
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                prefixIcon: const Icon(Icons.location_on, color: AppColors.grey500),
              ),
            ),
            const SizedBox(height: 24),
            
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Duration', style: TextStyle(fontWeight: FontWeight.bold)),
                Text('${_duration.toInt()} Days', style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primaryYellow)),
              ],
            ),
            Slider(
              value: _duration,
              min: 1,
              max: 14,
              divisions: 13,
              activeColor: AppColors.primaryYellow,
              onChanged: (val) => setState(() => _duration = val),
            ),
            const SizedBox(height: 16),

            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Budget', style: TextStyle(fontWeight: FontWeight.bold)),
                Text('₹${_budget.toInt().toString().replaceAll(RegExp(r'\B(?=(\d{3})+(?!\d))'), ',')}', style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primaryYellow)),
              ],
            ),
            Slider(
              value: _budget,
              min: 5000,
              max: 200000,
              divisions: 39, // steps of 5000
              activeColor: AppColors.primaryYellow,
              onChanged: (val) => setState(() => _budget = val),
            ),
            const SizedBox(height: 24),

            const Text('Interests', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _interests.map((interest) {
                final isSelected = _selectedInterests.contains(interest);
                return FilterChip(
                  label: Text(interest),
                  selected: isSelected,
                  selectedColor: AppColors.primaryYellow,
                  checkmarkColor: AppColors.darkText,
                  onSelected: (val) {
                    setState(() {
                      if (val) {
                        _selectedInterests.add(interest);
                      } else {
                        _selectedInterests.remove(interest);
                      }
                    });
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 24),

            const Text('Travel Style', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: _styles.map((style) {
                final isSelected = _travelStyle == style;
                return ChoiceChip(
                  label: Text(style),
                  selected: isSelected,
                  selectedColor: AppColors.primaryYellow,
                  onSelected: (val) {
                    if (val) setState(() => _travelStyle = style);
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 32),

            ElevatedButton(
              onPressed: _isGenerating ? null : _generate,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryYellow,
                foregroundColor: AppColors.darkText,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: _isGenerating
                  ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.darkText))
                  : const Text('GENERATE ITINERARY', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.5)),
            ),
          ],
        ),
      ),
    );
  }
}
