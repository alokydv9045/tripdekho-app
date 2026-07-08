import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../providers/theme_provider.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authNotifierProvider);
    final theme = Theme.of(context);
    final user = authState.user;
    final themeMode = ref.watch(themeProvider);

    if (user == null) {
      return const Scaffold(body: Center(child: Text('Not logged in')));
    }

    return Scaffold(
      backgroundColor: theme.colorScheme.surface,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 250.0,
            floating: false,
            pinned: true,
            backgroundColor: theme.colorScheme.surface,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      theme.colorScheme.primaryContainer,
                      theme.colorScheme.surface,
                    ],
                  ),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(height: 40),
                    CircleAvatar(
                      radius: 50,
                      backgroundColor: theme.colorScheme.primary,
                      child: Text(
                        user.name[0].toUpperCase(),
                        style: TextStyle(
                          fontSize: 40,
                          fontWeight: FontWeight.bold,
                          color: theme.colorScheme.onPrimary,
                        ),
                      ),
                    ).animate().scale(duration: 500.ms, curve: Curves.easeOutBack),
                    const SizedBox(height: 16),
                    Text(
                      user.name,
                      style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
                    ).animate().fade(delay: 200.ms).slideY(begin: 0.2),
                    Text(
                      user.email,
                      style: TextStyle(color: theme.colorScheme.onSurface.withOpacity(0.6)),
                    ).animate().fade(delay: 300.ms).slideY(begin: 0.2),
                  ],
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildStatsRow(theme).animate().fade(delay: 400.ms).slideY(begin: 0.1),
                  const SizedBox(height: 32),
                  Text(
                    'Settings',
                    style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                  ).animate().fade(delay: 500.ms).slideX(begin: 0.1),
                  _buildSettingsCard(
                    context,
                    title: 'Messages',
                    icon: Icons.chat_bubble_outline,
                    delay: 550,
                    onTap: () => context.push('/chats'),
                  ),
                  _buildSettingsCard(
                    context,
                    title: 'My Bookings',
                    icon: Icons.luggage_outlined,
                    delay: 600,
                    onTap: () => context.push('/my-bookings'),
                  ),
                  _buildSettingsCard(
                    context,
                    title: 'Account Settings',
                    icon: Icons.person_outline,
                    delay: 650,
                  ),
                  _buildSettingsCard(
                    context,
                    title: 'Payment Methods',
                    icon: Icons.payment_outlined,
                    delay: 700,
                  ),
                  _buildSettingsCard(
                    context,
                    title: 'Notifications',
                    icon: Icons.notifications_outlined,
                    delay: 800,
                  ),
                  _buildThemeToggleCard(
                    context,
                    ref,
                    themeMode,
                    delay: 900,
                  ),
                  const SizedBox(height: 32),
                  Center(
                    child: TextButton.icon(
                      onPressed: () {
                        ref.read(authNotifierProvider.notifier).logout();
                      },
                      icon: const Icon(Icons.logout, color: Colors.redAccent),
                      label: const Text(
                        'Log Out',
                        style: TextStyle(color: Colors.redAccent, fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                    ).animate().fade(delay: 1000.ms),
                  ),
                  const SizedBox(height: 100), // Padding for bottom nav bar
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsRow(ThemeData theme) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        _buildStatItem('3', 'Upcoming', theme),
        Container(width: 1, height: 40, color: theme.dividerColor.withOpacity(0.2)),
        _buildStatItem('12', 'Past Trips', theme),
        Container(width: 1, height: 40, color: theme.dividerColor.withOpacity(0.2)),
        _buildStatItem('8', 'Reviews', theme),
      ],
    );
  }

  Widget _buildStatItem(String value, String label, ThemeData theme) {
    return Column(
      children: [
        Text(
          value,
          style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w900, color: theme.colorScheme.primary),
        ),
        Text(
          label,
          style: TextStyle(color: theme.colorScheme.onSurface.withOpacity(0.6), fontSize: 12),
        ),
      ],
    );
  }

  Widget _buildSettingsCard(BuildContext context, {required String title, required IconData icon, required int delay, VoidCallback? onTap}) {
    final theme = Theme.of(context);
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainerHighest.withOpacity(0.3),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: theme.dividerColor.withOpacity(0.1)),
      ),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: theme.colorScheme.primary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: theme.colorScheme.primary),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
        trailing: Icon(Icons.chevron_right, color: theme.colorScheme.onSurface.withOpacity(0.3)),
        onTap: onTap ?? () {},
      ),
    ).animate().fade(delay: delay.ms).slideX(begin: 0.1);
  }

  Widget _buildThemeToggleCard(BuildContext context, WidgetRef ref, ThemeMode currentTheme, {required int delay}) {
    final theme = Theme.of(context);
    final isDark = currentTheme == ThemeMode.dark || (currentTheme == ThemeMode.system && MediaQuery.of(context).platformBrightness == Brightness.dark);
    
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainerHighest.withOpacity(0.3),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: theme.dividerColor.withOpacity(0.1)),
      ),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: theme.colorScheme.primary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(isDark ? Icons.dark_mode : Icons.light_mode, color: theme.colorScheme.primary),
        ),
        title: const Text('Dark Mode', style: TextStyle(fontWeight: FontWeight.w600)),
        trailing: Switch(
          value: isDark,
          activeColor: theme.colorScheme.primary,
          onChanged: (value) {
            ref.read(themeProvider.notifier).setTheme(value ? ThemeMode.dark : ThemeMode.light);
          },
        ),
      ),
    ).animate().fade(delay: delay.ms).slideX(begin: 0.1);
  }
}
