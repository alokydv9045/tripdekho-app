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
  
  // Skip if already uses PremiumLoader correctly
  if (content.includes('if (loading) return <PremiumLoader />;')) {
    continue;
  }

  let original = content;

  // Replace block: if (loading) { return ( ... ); }
  content = content.replace(/if\s*\(\s*loading\s*\)\s*\{\s*return\s*\([\s\S]*?\);\s*\}/g, 'if (loading) return <PremiumLoader />;');
  
  // Replace block: if (loading) return ( ... );
  content = content.replace(/if\s*\(\s*loading\s*\)\s*return\s*\([\s\S]*?\);/g, 'if (loading) return <PremiumLoader />;');

  // If replaced, ensure import exists
  if (original !== content) {
    if (!content.includes('PremiumLoader')) {
      // add import after the last import
      const importStatement = "import PremiumLoader from '@/components/shared/PremiumLoader';\n";
      const lines = content.split('\n');
      let lastImportIdx = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ')) {
          lastImportIdx = i;
        }
      }
      if (lastImportIdx !== -1) {
        lines.splice(lastImportIdx + 1, 0, importStatement);
        content = lines.join('\n');
      } else {
        content = importStatement + content;
      }
    }
    fs.writeFileSync(file, content);
    console.log('Patched', file);
  } else {
    console.log('Failed to patch', file);
  }
}
