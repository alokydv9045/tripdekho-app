"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { user, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user && user.role) {
      // Check if user's role is in the allowed roles
      // Handle cases where role might be an array or string
      const userRoles = Array.isArray(user.role) ? user.role : [user.role];
      const hasAccess = userRoles.some((role: string) => allowedRoles.includes(role));

      if (hasAccess) {
        setIsAuthorized(true);
      } else {
        // Redirect to homepage or unauthorized page
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, user, router, allowedRoles, pathname]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50/50">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
