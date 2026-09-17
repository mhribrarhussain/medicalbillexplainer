const fs = require('fs');
const path = require('path');

// 1. Update all root HTML files to use <header class="site-header">
const rootHtmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

rootHtmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Only replace the top navbar header (<header>\n        <div class="nav-container">)
  const updated = content.replace(/<header>([\s\r\n]*<div class="nav-container">)/g, '<header class="site-header">$1');
  if (updated !== content) {
    fs.writeFileSync(file, updated);
    console.log(`Updated top navbar header in ${file}`);
  }
});

// 2. Also update build_cpt_pages.js template
let buildScript = fs.readFileSync('build_cpt_pages.js', 'utf8');
buildScript = buildScript.replace(/<header>([\s\r\n]*<div class="nav-container">)/g, '<header class="site-header">$1');
fs.writeFileSync('build_cpt_pages.js', buildScript);
console.log('Updated header tag in build_cpt_pages.js');
