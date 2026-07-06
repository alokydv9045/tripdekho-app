import React from 'react';

interface ContactInfoCardProps {
  companyName: string;
  contactPerson: {
    name: string;
    role: string;
  };
  phone: string;
  email: string;
  address: string;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ 
  companyName, 
  contactPerson, 
  phone, 
  email, 
  address 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col h-full min-h-[500px]">
      <div className="p-8 flex-1">
        <h3 className="text-gray-400 font-medium text-sm mb-1 uppercase tracking-wider">Company Details</h3>
        <div className="w-12 h-0.5 bg-amber-400 mb-6" />

        <div className="space-y-6">
          <h2 className="text-gray-900 font-bold text-xl leading-tight">{companyName}</h2>

          <div className="space-y-1">
            <p className="text-gray-700 font-bold">{contactPerson.name}</p>
            <p className="text-gray-400 text-sm font-medium italic">{contactPerson.role}</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-50">
            {/* Phone */}
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 group-hover:bg-amber-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <p className="text-gray-700 font-bold">{phone}</p>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 group-hover:bg-amber-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-amber-500 font-bold hover:underline cursor-pointer">{email}</p>
            </div>

            {/* Address */}
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 group-hover:bg-amber-100 transition-colors text-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium text-sm leading-relaxed">{address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Building Illustration at bottom */}
      <div className="mt-auto px-12 pb-8 flex justify-center">
        <svg viewBox="0 0 180 150" className="w-48 h-auto">
          {/* Main Building */}
          <rect x="60" y="20" width="60" height="110" fill="#FFD100" />
          <rect x="120" y="50" width="40" height="80" fill="#2D3748" />
          {/* Windows */}
          <g fill="#2D3748" fillOpacity="0.2">
            {[20, 40, 60, 80, 100].map(y => (
              <rect key={y} x="68" y={y + 10} width="6" height="6" />
            ))}
            {[20, 40, 60, 80, 100].map(y => (
              <rect key={y} x="82" y={y + 10} width="6" height="6" />
            ))}
            {[20, 40, 60, 80, 100].map(y => (
              <rect key={y} x="96" y={y + 10} width="6" height="6" />
            ))}
            {[40, 60, 80, 100].map(y => (
              <rect key={y} x="128" y={y + 20} width="6" height="6" fill="#fff" fillOpacity="0.1" />
            ))}
            {[40, 60, 80, 100].map(y => (
              <rect key={y} x="142" y={y + 20} width="6" height="6" fill="#fff" fillOpacity="0.1" />
            ))}
          </g>
          {/* Detailed accents */}
          <rect x="60" y="20" width="60" height="6" fill="#000" fillOpacity="0.1" />
          <rect x="110" y="50" width="10" height="80" fill="#000" fillOpacity="0.2" />
          {/* Base */}
          <rect x="30" y="130" width="140" height="4" fill="#E2E8F0" rx="2" />
          {/* Decorative Greenery */}
          <circle cx="45" cy="130" r="10" fill="#48BB78" />
          <circle cx="155" cy="130" r="12" fill="#48BB78" />
          <circle cx="60" cy="130" r="8" fill="#38A169" />
          <circle cx="140" cy="130" r="10" fill="#38A169" />
        </svg>
      </div>
    </div>
  );
};

export default ContactInfoCard;
