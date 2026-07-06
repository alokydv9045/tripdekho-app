'use client';

import React from 'react';
import { useAppSelector } from '@/store/hooks';

// Import all role-based dashboards
import { SuperAdminDashboard } from '@/components/admin/dashboards/SuperAdminDashboard';
import { TechAdminDashboard } from '@/components/admin/dashboards/TechAdminDashboard';
import { FinanceAdminDashboard } from '@/components/admin/dashboards/FinanceAdminDashboard';
import { OnboardingAdminDashboard } from '@/components/admin/dashboards/OnboardingAdminDashboard';
import { ContentAdminDashboard } from '@/components/admin/dashboards/ContentAdminDashboard';
import { PlatformAdminDashboard } from '@/components/admin/dashboards/PlatformAdminDashboard';
import { GrowthAdminDashboard } from '@/components/admin/dashboards/GrowthAdminDashboard';
import { SupportAdminDashboard } from '@/components/admin/dashboards/SupportAdminDashboard';
import { OperationsAdminDashboard } from '@/components/admin/dashboards/OperationsAdminDashboard';
import { GeneralAdminDashboard } from '@/components/admin/dashboards/GeneralAdminDashboard';

const AdminDashboardController = () => {
  const { user } = useAppSelector(state => state.auth);

  if (!user) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
           <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
           <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Authorizing Access...</p>
        </div>
     );
  }

  // Dashboard Switcher based on exact user role
  switch (user.role) {
    case 'super_admin':
      return <SuperAdminDashboard />;
    case 'tech_admin':
      return <TechAdminDashboard />;
    case 'finance_admin':
      return <FinanceAdminDashboard />;
    case 'onboarding_admin':
      return <OnboardingAdminDashboard />;
    case 'content_admin':
      return <ContentAdminDashboard />;
    case 'platform_admin':
      return <PlatformAdminDashboard />;
    case 'growth_admin':
      return <GrowthAdminDashboard />;
    case 'support_admin':
      return <SupportAdminDashboard />;
    case 'operations_admin':
      return <OperationsAdminDashboard />;
    case 'admin':
    default:
      return <GeneralAdminDashboard />;
  }
};

export default AdminDashboardController;
