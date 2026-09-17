const fs = require('fs');
const { renderSiteHeader } = require('./header_component');

const pages = [
  { file: 'index.html', active: 'home' },
  { file: 'medical-bill-explainer.html', active: 'explainer' },
  { file: 'how-to-read-an-eob.html', active: 'eob-guide' },
  { file: 'insurance-eob-explained.html', active: 'calculator' },
  { file: 'co-45-denial-code.html', active: 'co-45' },
  { file: 'bill-dispute-guide.html', active: 'dispute' },
  { file: 'about.html', active: 'about' },
  { file: 'privacy-policy.html', active: '' },
  { file: 'terms-of-use.html', active: '' },
  { file: 'affiliate-disclosure.html', active: '' },
  { file: '404.html', active: '' }
];

pages.forEach(({ file, active }) => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace the <header class="site-header"> ... </header> block
  // (and any existing mobile drawer markup if present)
  const regex = /<header class="site-header">[\s\S]*?<\/header>/;
  if (!regex.test(content)) {
    console.warn(`Could not find header in ${file}`);
    return;
  }
  
  const newHeader = renderSiteHeader(active, '');
  content = content.replace(regex, newHeader);
  fs.writeFileSync(file, content);
  console.log(`Updated navbar and mobile drawer in ${file}`);
});
