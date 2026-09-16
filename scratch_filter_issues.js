const fs = require('fs');

// Check all non-OG / non-Performance issues grouped uniquely
const data = JSON.parse(fs.readFileSync('seo_audit_results.json', 'utf8'));
const issues = data.issues.filter(i => i.category !== 'Open Graph' && i.category !== 'Performance');

// Group
const byCategory = {};
issues.forEach(i => {
  if (!byCategory[i.category]) byCategory[i.category] = [];
  byCategory[i.category].push(i);
});

Object.keys(byCategory).sort().forEach(cat => {
  console.log(`\n=== ${cat} (${byCategory[cat].length} issues) ===`);
  byCategory[cat].forEach(i => {
    console.log(`  [${i.severity}] ${i.file}: ${i.detail}`);
  });
});

console.log('\n=== Summary (excluding OG/Performance) ===');
console.log(`Total unique issues: ${issues.length}`);
console.log(`  Errors: ${issues.filter(i => i.severity === 'ERROR').length}`);
console.log(`  Warnings: ${issues.filter(i => i.severity === 'WARNING').length}`);
