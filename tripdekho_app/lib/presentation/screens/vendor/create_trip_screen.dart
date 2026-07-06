import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';
import '../../widgets/auth_form_field.dart';

class CreateTripScreen extends StatefulWidget {
  const CreateTripScreen({super.key});

  @override
  State<CreateTripScreen> createState() => _CreateTripScreenState();
}

class _CreateTripScreenState extends State<CreateTripScreen> {
  int _currentStep = 0;
  
  final _titleCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _priceCtrl = TextEditingController();
  final _durationCtrl = TextEditingController();

  List<Step> get _steps => [
        Step(
          isActive: _currentStep >= 0,
          title: Text('Basic Info', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 14)),
          content: Column(
            children: [
              AuthFormField(label: 'Trip Title', hint: 'e.g. Goa Beach Tour', controller: _titleCtrl),
              const SizedBox(height: 16),
              AuthFormField(label: 'Description', hint: 'Detailed description of the trip...', controller: _descCtrl, maxLines: 5),
              const SizedBox(height: 16),
              AuthFormField(label: 'Duration', hint: 'e.g. 4n 5d', controller: _durationCtrl),
            ],
          ),
        ),
        Step(
          isActive: _currentStep >= 1,
          title: Text('Pricing', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 14)),
          content: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              AuthFormField(label: 'Base Price (₹)', hint: 'e.g. 15000', controller: _priceCtrl, keyboardType: TextInputType.number),
              const SizedBox(height: 24),
              Text('Departure Dates', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 14, color: AppColors.darkText)),
              const SizedBox(height: 12),
              OutlinedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.add_rounded, size: 18),
                label: Text('Add Date', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700)),
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.darkText,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  side: BorderSide(color: Colors.grey.shade300),
                ),
              )
            ],
          ),
        ),
        Step(
          isActive: _currentStep >= 2,
          title: Text('Itinerary', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 14)),
          content: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Add day-by-day plan', style: GoogleFonts.plusJakartaSans(color: AppColors.textMuted, fontWeight: FontWeight.w600)),
              const SizedBox(height: 16),
              OutlinedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.add_rounded, size: 18),
                label: Text('Add Day', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700)),
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.darkText,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  side: BorderSide(color: Colors.grey.shade300),
                ),
              )
            ],
          ),
        ),
        Step(
          isActive: _currentStep >= 3,
          title: Text('Media', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 14)),
          content: Column(
            children: [
              Container(
                height: 180,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.white,
                  border: Border.all(color: Colors.grey.shade300, style: BorderStyle.solid),
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(color: Colors.grey.shade50, shape: BoxShape.circle),
                      child: Icon(Icons.cloud_upload_rounded, size: 32, color: AppColors.grey500),
                    ),
                    const SizedBox(height: 12),
                    Text('Upload Thumbnail Image', style: GoogleFonts.plusJakartaSans(color: AppColors.textMuted, fontWeight: FontWeight.w700, fontSize: 12)),
                  ],
                ),
              )
            ],
          ),
        ),
      ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text('Create Trip', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, color: AppColors.darkText, letterSpacing: -0.5)),
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        iconTheme: const IconThemeData(color: AppColors.darkText),
      ),
      body: Theme(
        data: Theme.of(context).copyWith(
          colorScheme: const ColorScheme.light(primary: AppColors.amber500),
        ),
        child: Stepper(
          type: StepperType.vertical,
          currentStep: _currentStep,
          elevation: 0,
          margin: const EdgeInsets.all(24),
          onStepContinue: () {
            if (_currentStep < _steps.length - 1) {
              setState(() => _currentStep += 1);
            } else {
              // Submit form
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Trip submitted for review!', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800)),
                  backgroundColor: Colors.green.shade600,
                  behavior: SnackBarBehavior.floating,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              );
              Navigator.pop(context);
            }
          },
          onStepCancel: () {
            if (_currentStep > 0) {
              setState(() => _currentStep -= 1);
            } else {
              Navigator.pop(context);
            }
          },
          controlsBuilder: (context, details) {
            final isLastStep = _currentStep == _steps.length - 1;
            return Padding(
              padding: const EdgeInsets.only(top: 32.0),
              child: Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: details.onStepContinue,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.darkText, 
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        elevation: 10,
                        shadowColor: AppColors.darkText.withAlpha(100),
                      ),
                      child: Text(isLastStep ? 'SUBMIT TRIP' : 'CONTINUE', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, letterSpacing: 1.0, fontSize: 12)),
                    ),
                  ),
                  const SizedBox(width: 16),
                  if (_currentStep > 0)
                    Expanded(
                      child: OutlinedButton(
                        onPressed: details.onStepCancel,
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppColors.darkText,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          side: BorderSide(color: Colors.grey.shade300),
                        ),
                        child: Text('BACK', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, letterSpacing: 1.0, fontSize: 12)),
                      ),
                    )
                ],
              ),
            );
          },
          steps: _steps,
        ),
      ),
    );
  }
}
