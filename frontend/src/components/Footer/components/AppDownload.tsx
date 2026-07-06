import React from "react";
import { toast } from "react-toastify";

export default function AppDownload() {
  const handleDownload = () => toast.info("App coming soon!");

  return (
    <div className="flex flex-col gap-5 bg-[#1A1A1A] p-6 rounded-2xl border border-gray-800 h-full justify-center">
      <div>
        <h4 className="text-white font-bold text-lg leading-tight">Get the TripDekho App</h4>
        <p className="text-gray-400 text-xs mt-1">Book trips seamlessly on the go.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Apple App Store */}
        <button onClick={handleDownload} type="button" suppressHydrationWarning={true} className="w-full bg-white hover:bg-gray-200 text-black rounded-lg h-10 flex items-center justify-center transition-colors shadow-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="black" className="mr-1">
            <path d="M15.4 12.3 c 0 -2.4 2 -3.3 2 -3.3 c -1.1 -1.6 -2.8 -1.8 -3.4 -1.9 c -1.5 -0.1 -2.9 0.9 -3.7 0.9 c -0.7 0 -1.9 -0.9 -3.1 -0.9 c -1.6 0 -3.1 0.9 -3.9 2.3 c -1.7 3 -0.4 7.4 1.2 9.8 c 0.8 1.2 1.7 2.5 3 2.5 c 1.2 -0.1 1.7 -0.8 3.1 -0.8 c 1.4 0 1.9 0.8 3.2 0.8 c 1.3 0 2.2 -1.4 2.9 -2.5 c 0.9 -1.3 1.2 -2.5 1.2 -2.5 c -0.1 0 -2.3 -0.9 -2.3 -3.4"/>
            <path d="M12.6 7.6 c 0.1 -0.1 0.1 -0.1 0.1 -0.2 c 0.7 -0.9 1 -2 0.8 -3.2 c -1 0.1 -2.3 0.7 -3 1.6 c -0.6 0.7 -1.2 1.9 -1 2.9 c 1 0.1 2.3 -0.4 3.1 -1.1"/>
          </svg>
          <span className="font-semibold text-xs sm:text-sm">App Store</span>
        </button>

        {/* Google Play */}
        <button onClick={handleDownload} type="button" suppressHydrationWarning={true} className="w-full bg-white hover:bg-gray-200 text-black rounded-lg h-10 flex items-center justify-center transition-colors shadow-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mr-1 -ml-1">
            <path d="M3 4l10 10L3 24V4z" fill="#4CAF50"/>
            <path d="M3 4l12 7-2 3L3 4z" fill="#FFC107"/>
            <path d="M13 11l4 2.5-4 2.5v-5z" fill="#F44336"/>
            <path d="M3 24l12-7-2-3L3 24z" fill="#2196F3"/>
          </svg>
          <span className="font-semibold text-xs sm:text-sm">Play Store</span>
        </button>
      </div>
    </div>
  );
}
