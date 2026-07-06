"use client";

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import VendorSidebar from '@/components/vendor/VendorSidebar';
import RoleGuard from '@/components/Auth/RoleGuard';
import ForcePasswordChangeModal from '@/components/vendor/ForcePasswordChangeModal';
import KycPendingBanner from '@/components/vendor/KycPendingBanner';
import { RootState } from '@/store/store';
import { setCredentials } from '@/store/slices/authSlice';
import { vendorService } from '@/services/vendorService';

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [razorpayStatus, setRazorpayStatus] = useState<string | undefined>(undefined);
  const [showKycBanner, setShowKycBanner] = useState(true);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const pathname = usePathname();
  const isAuthRoute = pathname === '/vendor/register';

  useEffect(() => {
    // Check mustChangePassword from user state or localStorage
    const storedUser = typeof window !== 'undefined'
      ? (() => { try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; } })()
      : {};

    const shouldChange = (user as any)?.mustChangePassword || storedUser?.mustChangePassword;
    setMustChangePassword(!!shouldChange);
  }, [user]);

  useEffect(() => {
    // Fetch vendor KYC status for the banner
    const fetchVendorStatus = async () => {
      try {
        const res = await vendorService.getCurrentVendor();
        if (res?.data?.kycStatus) {
          setKycStatus(res.data.kycStatus);
          setRazorpayStatus(res.data.razorpayLinkedAccountStatus);
        }
      } catch {
        // Non-critical — ignore
      }
    };
    fetchVendorStatus();
  }, []);

  const handlePasswordChangeSuccess = () => {
    setMustChangePassword(false);
    // Update Redux store
    if (user) {
      dispatch(setCredentials({ user: { ...user, mustChangePassword: false } as any }));
    }
    // Update localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      stored.mustChangePassword = false;
      localStorage.setItem('user', JSON.stringify(stored));
    } catch {}
  };

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <RoleGuard allowedRoles={['vendor']}>
      {/* Force password change — renders over everything, uncancellable */}
      {mustChangePassword && (
        <ForcePasswordChangeModal onSuccess={handlePasswordChangeSuccess} />
      )}

      <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900">
        <Header />

        {/* KYC Banner — sits below header, above content */}
        {kycStatus && showKycBanner && (
          <KycPendingBanner
            kycStatus={kycStatus}
            razorpayStatus={razorpayStatus}
            onDismiss={kycStatus === 'submitted' ? () => setShowKycBanner(false) : undefined}
          />
        )}

        <div className="flex flex-1 max-w-[1600px] w-full mx-auto">
          <VendorSidebar />
          <main className="flex-grow w-full overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
