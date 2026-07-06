import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../widgets/auth_form_field.dart';

class VendorOnboardingScreen extends StatefulWidget {
  const VendorOnboardingScreen({super.key});

  @override
  State<VendorOnboardingScreen> createState() => _VendorOnboardingScreenState();
}

class _VendorOnboardingScreenState extends State<VendorOnboardingScreen> {
  final _businessNameCtrl = TextEditingController();
  final _gstCtrl = TextEditingController();
  final _panCtrl = TextEditingController();
  final _addressCtrl = TextEditingController();

  bool _isSubmitting = false;

  void _submit() async {
    setState(() => _isSubmitting = true);
    await Future.delayed(const Duration(seconds: 2));
    setState(() => _isSubmitting = false);
    
    if (mounted) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: const Row(
            children: [
              Icon(Icons.check_circle, color: Colors.green),
              SizedBox(width: 8),
              Text('Application Submitted'),
            ],
          ),
          content: const Text('Your vendor application has been submitted for manual review. You will receive an email once approved.'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                Navigator.pop(context); // Go back
              },
              child: const Text('OK', style: TextStyle(color: AppColors.primaryYellow, fontWeight: FontWeight.bold)),
            )
          ],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgCream,
      appBar: AppBar(
        title: const Text('Partner With Us', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Icon(Icons.handshake, size: 64, color: AppColors.primaryYellow),
            const SizedBox(height: 16),
            const Text(
              'Become a TripDekho Vendor',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.darkText),
            ),
            const SizedBox(height: 8),
            const Text(
              'Join thousands of travel agents and tour operators scaling their business with us.',
              textAlign: TextAlign.center,
              style: TextStyle(color: AppColors.grey500),
            ),
            const SizedBox(height: 32),
            
            const Text('Business Details', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            AuthFormField(label: 'Registered Business Name', hint: 'e.g., Himalayan Treks Pvt Ltd', controller: _businessNameCtrl),
            const SizedBox(height: 16),
            AuthFormField(label: 'GST Number (Optional)', hint: 'e.g., 22AAAAA0000A1Z5', controller: _gstCtrl),
            const SizedBox(height: 16),
            AuthFormField(label: 'PAN Number', hint: 'e.g., ABCDE1234F', controller: _panCtrl),
            const SizedBox(height: 16),
            AuthFormField(label: 'Business Address', hint: 'Full office address...', controller: _addressCtrl, maxLines: 3),
            
            const SizedBox(height: 32),
            const Text('Verification Documents', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _buildUploadBox('Upload Company Registration / GST Certificate'),
            const SizedBox(height: 16),
            _buildUploadBox('Upload Owner PAN Card'),
            
            const SizedBox(height: 48),
            ElevatedButton(
              onPressed: _isSubmitting ? null : _submit,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryYellow,
                foregroundColor: AppColors.darkText,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: _isSubmitting
                  ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.darkText))
                  : const Text('SUBMIT APPLICATION', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.5)),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildUploadBox(String label) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: AppColors.grey100, style: BorderStyle.solid),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          const Icon(Icons.cloud_upload_outlined, size: 32, color: AppColors.grey500),
          const SizedBox(height: 8),
          Text(label, textAlign: TextAlign.center, style: const TextStyle(color: AppColors.grey500, fontSize: 12)),
        ],
      ),
    );
  }
}
