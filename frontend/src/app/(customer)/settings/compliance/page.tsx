'use client';

import React, { useState } from 'react';
import { axiosPrivate } from '@/lib/axios';

export default function CompliancePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get('/compliance/export-data');
      setMessage(`Export successful: Found ${res.data.bookings?.length || 0} bookings.`);
      
      // Trigger download
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tripdekho_data_export.json';
      a.click();
    } catch (err) {
      setMessage('Failed to export data.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymize = async () => {
    if (!confirm('WARNING: This will permanently anonymize your account data and delete PII. Proceed?')) return;
    
    setLoading(true);
    try {
      const res = await axiosPrivate.delete('/compliance/anonymize');
      setMessage(res.data.message || 'Account anonymized successfully.');
    } catch (err) {
      setMessage('Failed to anonymize account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto flex flex-col gap-8">
      <div className="animate-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">Data Privacy & GDPR</h1>
        <p className="text-gray-400 mt-2">
          Manage your data footprint securely. We believe in complete transparency.
        </p>
      </div>

      {message && (
        <div className="bg-emerald-500/10 text-emerald-500 p-4 rounded-lg border border-emerald-500/20">
          {message}
        </div>
      )}

      <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl shadow-xl p-8 animate-in slide-in-from-bottom-4 duration-500 delay-100 flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-semibold text-white">Data Export (DSAR)</h2>
          <p className="text-gray-400 my-2">
            Download a machine-readable copy of all your personal data, including bookings and reviews.
          </p>
          <button onClick={handleExport} disabled={loading} className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg border border-gray-700 transition-all mt-2">
            Request Data Export
          </button>
        </div>

        <div className="h-px bg-gray-800 w-full"></div>

        <div>
          <h2 className="text-2xl font-semibold text-red-500">Right to be Forgotten</h2>
          <p className="text-gray-400 my-2">
            Permanently scrub your Personally Identifiable Information (PII) from our systems. Your past booking history will be anonymized to preserve system integrity.
          </p>
          <button onClick={handleAnonymize} disabled={loading} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 font-semibold py-2 px-4 rounded-lg border border-red-500/20 transition-all mt-2">
            Anonymize My Account
          </button>
        </div>
      </div>
    </div>
  );
}
