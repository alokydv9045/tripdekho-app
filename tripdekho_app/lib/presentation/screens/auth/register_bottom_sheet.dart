import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/auth_form_field.dart';
import 'login_bottom_sheet.dart';

class RegisterBottomSheet extends ConsumerStatefulWidget {
  const RegisterBottomSheet({super.key});

  static Future<void> show(BuildContext context) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const RegisterBottomSheet(),
    );
  }

  @override
  ConsumerState<RegisterBottomSheet> createState() => _RegisterBottomSheetState();
}

class _RegisterBottomSheetState extends ConsumerState<RegisterBottomSheet> {
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  final _referralCtrl = TextEditingController();

  bool _isLoading = false;
  String? _error;
  bool _agreedToTerms = false;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    _passCtrl.dispose();
    _referralCtrl.dispose();
    super.dispose();
  }

  void _handleRegister() async {
    if (!_agreedToTerms) {
      setState(() => _error = "Please agree to Terms & Conditions");
      return;
    }

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final repo = ref.read(authRepositoryProvider);
      await repo.register({
        'name': _nameCtrl.text.trim(),
        'email': _emailCtrl.text.trim(),
        'phone': _phoneCtrl.text.trim(),
        'password': _passCtrl.text.trim(),
        'referralCode': _referralCtrl.text.trim(),
        'role': 'customer',
      });

      // Auto login after register
      final success = await ref.read(authProvider.notifier).login(
        _emailCtrl.text.trim(),
        _passCtrl.text.trim(),
      );

      if (success && mounted) {
        context.pop();
      }
    } catch (e) {
      setState(() {
        _error = e.toString();
      });
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFF4F5F7),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(40)),
        boxShadow: [
          BoxShadow(color: Colors.black.withAlpha(50), blurRadius: 40, offset: const Offset(0, -10))
        ],
      ),
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom + 40,
        top: 32,
        left: 32,
        right: 32,
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Drag handle
            Center(
              child: Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(bottom: 24),
                decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2)),
              ),
            ),
            
            Text(
              'TripDekho',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 32,
                fontWeight: FontWeight.w900,
                color: AppColors.darkText,
                letterSpacing: -1.0,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 4),
            Text(
              'Create a new account',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: AppColors.textMuted,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),
            
            AuthFormField(
              label: 'Full Name',
              hint: 'John Doe',
              controller: _nameCtrl,
            ),
            const SizedBox(height: 16),
            AuthFormField(
              label: 'Email Address',
              hint: 'john@example.com',
              controller: _emailCtrl,
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 16),
            AuthFormField(
              label: 'Phone Number',
              hint: '9876543210',
              controller: _phoneCtrl,
              keyboardType: TextInputType.phone,
            ),
            const SizedBox(height: 16),
            AuthFormField(
              label: 'Password',
              hint: '••••••••',
              controller: _passCtrl,
              isPassword: true,
            ),
            const SizedBox(height: 16),
            AuthFormField(
              label: 'Referral Code (Optional)',
              hint: 'TRIP123',
              controller: _referralCtrl,
            ),
            const SizedBox(height: 24),
            
            Row(
              children: [
                SizedBox(
                  width: 24, height: 24,
                  child: Checkbox(
                    value: _agreedToTerms,
                    onChanged: (val) => setState(() => _agreedToTerms = val ?? false),
                    activeColor: AppColors.darkText,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'I agree to the Terms & Conditions and Privacy Policy.',
                    style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted),
                  ),
                )
              ],
            ),
            const SizedBox(height: 24),

            if (_error != null)
              Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: Text(
                  _error!,
                  style: GoogleFonts.plusJakartaSans(color: AppColors.redBadge, fontSize: 12, fontWeight: FontWeight.w700),
                  textAlign: TextAlign.center,
                ),
              ),
              
            ElevatedButton(
              onPressed: _isLoading ? null : _handleRegister,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryYellow,
                foregroundColor: AppColors.darkText,
                padding: const EdgeInsets.symmetric(vertical: 20),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                elevation: 10,
                shadowColor: AppColors.primaryYellow.withAlpha(100),
              ),
              child: _isLoading
                  ? const SizedBox(height: 24, width: 24, child: CircularProgressIndicator(strokeWidth: 3, color: AppColors.darkText))
                  : Text('CREATE ACCOUNT', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, letterSpacing: 1.5, fontSize: 14)),
            ),
            const SizedBox(height: 24),
            
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('Already have an account? ', style: GoogleFonts.plusJakartaSans(color: AppColors.textMuted, fontWeight: FontWeight.w600, fontSize: 14)),
                GestureDetector(
                  onTap: () {
                    context.pop();
                    LoginBottomSheet.show(context);
                  },
                  child: Text('Sign in', style: GoogleFonts.plusJakartaSans(color: AppColors.darkText, fontWeight: FontWeight.w900, fontSize: 14, decoration: TextDecoration.underline)),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
