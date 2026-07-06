import React from 'react';
import Header from '@/components/Header';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import RoleGuard from '@/components/Auth/RoleGuard';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={['customer', 'vendor', 'admin', 'super_admin']}>
      <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900">
        <Header />
        <div className="flex flex-1 max-w-7xl w-full mx-auto">
          <ProfileSidebar />
          <main className="flex-grow w-full overflow-hidden pb-20 md:pb-0">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
