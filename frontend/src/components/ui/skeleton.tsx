import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
      {...props}
    />
  );
}

export function SkeletonItem({ className = "", ...props }: SkeletonProps) {
  return <Skeleton className={`h-4 w-full ${className}`} {...props} />;
}
