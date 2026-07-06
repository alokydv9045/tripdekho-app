const fs = require('fs');

const files = [
  'src/app/vendor/payouts/page.tsx',
  'src/app/vendor/trips/page.tsx',
  'src/app/vendor/analytics/page.tsx',
  'src/app/trips/[slug]/page.tsx',
  'src/app/vendor/bookings/page.tsx',
  'src/app/vendor/profile/page.tsx',
  'src/app/vendor/trips/[id]/edit/page.tsx',
  'src/app/vendor/dashboard/page.tsx',
  'src/app/admin/reports/page.tsx',
  'src/app/admin/support/[id]/page.tsx',
  'src/app/admin/users/[id]/page.tsx',
  'src/app/admin/system/pulse/page.tsx',
  'src/app/admin/settings/page.tsx',
  'src/app/admin/vendors/[id]/page.tsx',
  'src/app/bookings/[id]/payment/page.tsx',
  'src/app/bookings/[id]/success/page.tsx',
  'src/app/bookings/[id]/page.tsx',
  'src/app/vendors/[id]/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove all instances of the import statement
  const importStatement = "import PremiumLoader from '@/components/shared/PremiumLoader';\n";
  const importStatement2 = "import PremiumLoader from '@/components/shared/PremiumLoader';";
  
  content = content.split(importStatement).join('');
  content = content.split(importStatement2).join('');
  
  // Now add it correctly after "use client" or at top
  let lines = content.split('\n');
  let insertIdx = 0;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('use client')) {
      insertIdx = i + 1;
      break;
    }
  }
  
  lines.splice(insertIdx, 0, importStatement.trim());
  
  fs.writeFileSync(file, lines.join('\n'));
  console.log('Fixed', file);
}
