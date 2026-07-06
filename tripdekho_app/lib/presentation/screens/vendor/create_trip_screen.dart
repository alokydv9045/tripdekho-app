import 'package:flutter/material.dart';
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
          title: const Text('Basic Info'),
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
          title: const Text('Pricing'),
          content: Column(
            children: [
              AuthFormField(label: 'Base Price (₹)', hint: 'e.g. 15000', controller: _priceCtrl, keyboardType: TextInputType.number),
              const SizedBox(height: 16),
              // Placeholder for departures/dates
              const Text('Departure Dates', style: TextStyle(fontWeight: FontWeight.bold)),
              OutlinedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.add),
                label: const Text('Add Date'),
              )
            ],
          ),
        ),
        Step(
          isActive: _currentStep >= 2,
          title: const Text('Itinerary'),
          content: Column(
            children: [
              const Text('Add day-by-day plan'),
              OutlinedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.add),
                label: const Text('Add Day'),
              )
            ],
          ),
        ),
        Step(
          isActive: _currentStep >= 3,
          title: const Text('Media'),
          content: Column(
            children: [
              Container(
                height: 150,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: AppColors.grey50,
                  border: Border.all(color: AppColors.grey500, style: BorderStyle.solid),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.cloud_upload, size: 48, color: AppColors.grey500),
                    SizedBox(height: 8),
                    Text('Upload Thumbnail Image', style: TextStyle(color: AppColors.grey500)),
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
      backgroundColor: AppColors.bgCream,
      appBar: AppBar(
        title: const Text('Create Trip', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: Stepper(
        type: StepperType.vertical,
        currentStep: _currentStep,
        onStepContinue: () {
          if (_currentStep < _steps.length - 1) {
            setState(() => _currentStep += 1);
          } else {
            // Submit form
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Trip submitted for review!'), backgroundColor: Colors.green),
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
            padding: const EdgeInsets.only(top: 24.0),
            child: Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: details.onStepContinue,
                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.primaryYellow, foregroundColor: AppColors.darkText),
                    child: Text(isLastStep ? 'SUBMIT' : 'CONTINUE'),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: OutlinedButton(
                    onPressed: details.onStepCancel,
                    child: const Text('BACK'),
                  ),
                )
              ],
            ),
          );
        },
        steps: _steps,
      ),
    );
  }
}
