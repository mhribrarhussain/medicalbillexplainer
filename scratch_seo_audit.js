const fs = require('fs');
const path = require('path');

// --- Comprehensive SEO Audit Script for eobexplanation.com ---

const rootDir = '.';
const cptDir = './cpt';

function readFile(f) { return fs.readFileSync(f, 'utf8'); }

const rootHtml = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
const cptHtml = fs.readdirSync(cptDir).filter(f => f.endsWith('.html'));
const allHtml = rootHtml.map(f => ({ name: f, path: f }))
  .concat(cptHtml.map(f => ({ name: 'cpt/' + f, path: path.join(cptDir, f) })));

const issues = [];
const stats = { totalPages: allHtml.length, passed: 0, warnings: 0, errors: 0 };

// 1. Check each HTML page
allHtml.forEach(file => {
  const content = readFile(file.path);
  const fname = file.name;

  if (fname.includes('google6eaecc84aa022308')) {
    return; // Google search console site verification token, not an indexable HTML page
  }

  // Title tag
  const titleMatch = content.match(/<title>([^<]*)<\/title>/);
  if (!titleMatch) {
    issues.push({ file: fname, severity: 'ERROR', category: 'Title Tag', detail: 'MISSING title tag' });
  } else {
    const title = titleMatch[1];
    if (title.length > 58) {
      issues.push({ file: fname, severity: 'WARNING', category: 'Title Tag', detail: `Title too long: ${title.length} chars ("${title.slice(0, 50)}...")` });
    }
    if (title.length < 20) {
      issues.push({ file: fname, severity: 'WARNING', category: 'Title Tag', detail: `Title too short: ${title.length} chars ("${title}")` });
    }
  }

  // Meta description
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*?)["']/i);
  if (!descMatch) {
    issues.push({ file: fname, severity: 'ERROR', category: 'Meta Description', detail: 'MISSING meta description' });
  } else {
    const desc = descMatch[1];
    if (desc.length > 158) {
      issues.push({ file: fname, severity: 'WARNING', category: 'Meta Description', detail: `Description too long: ${desc.length} chars` });
    }
    if (desc.length < 50) {
      issues.push({ file: fname, severity: 'WARNING', category: 'Meta Description', detail: `Description too short: ${desc.length} chars` });
    }
  }

  // Canonical tag
  const canonMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*?)["']/i);
  if (!canonMatch && !fname.includes('404')) {
    issues.push({ file: fname, severity: 'WARNING', category: 'Canonical', detail: 'Missing canonical tag' });
  }

  // H1 tag
  const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
  if (!h1Matches) {
    issues.push({ file: fname, severity: 'ERROR', category: 'H1 Tag', detail: 'MISSING H1 tag' });
  } else if (h1Matches.length > 1) {
    issues.push({ file: fname, severity: 'WARNING', category: 'H1 Tag', detail: `Multiple H1 tags: ${h1Matches.length} found` });
  }

  // Open Graph tags
  const ogTitle = content.includes('og:title');
  const ogDesc = content.includes('og:description');
  const ogImage = content.includes('og:image');
  if ((!ogTitle || !ogImage) && !fname.includes('404')) {
    issues.push({ file: fname, severity: 'WARNING', category: 'Open Graph', detail: 'Missing og:title or og:image meta tag' });
  }

  // viewport
  if (!content.includes('viewport')) {
    issues.push({ file: fname, severity: 'ERROR', category: 'Mobile', detail: 'Missing viewport meta tag' });
  }

  // lang attribute
  if (!content.includes('lang="en"')) {
    issues.push({ file: fname, severity: 'WARNING', category: 'Accessibility', detail: 'Missing lang="en" attribute' });
  }

  // Image alt attributes
  const imgs = content.matchAll(/<img\b[^>]*>/gi);
  for (const img of imgs) {
    if (!img[0].includes('alt=')) {
      issues.push({ file: fname, severity: 'WARNING', category: 'Accessibility', detail: `Image missing alt attribute: ${img[0].slice(0, 80)}` });
    }
  }

  // Word count
  const text = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = text.split(/\s+/).length;
  if (wordCount < 300 && !fname.includes('404') && !fname.includes('index.html')) {
    issues.push({ file: fname, severity: 'WARNING', category: 'Content', detail: `Low word count: ${wordCount} words (recommended: 300+)` });
  }

  // Structured data
  const hasJsonLd = content.includes('application/ld+json');
  if (!hasJsonLd && !fname.includes('404') && !fname.includes('privacy') && !fname.includes('terms') && !fname.includes('affiliate')) {
    issues.push({ file: fname, severity: 'WARNING', category: 'Structured Data', detail: 'No JSON-LD structured data found' });
  }
});

// 2. Check sitemap.xml
const sitemap = readFile('sitemap.xml');
const sitemapUrls = [];
const locMatches = sitemap.matchAll(/<loc>([^<]+)<\/loc>/g);
for (const m of locMatches) sitemapUrls.push(m[1]);

// Check all root HTML pages are in sitemap
rootHtml.forEach(f => {
  if (f === '404.html' || f === 'google6eaecc84aa022308.html') return;
  const expectedUrl = `https://eobexplanation.com/${f === 'index.html' ? '' : f}`;
  const found = sitemapUrls.some(u => u.includes(f) || (f === 'index.html' && u === 'https://eobexplanation.com/'));
  if (!found) {
    issues.push({ file: 'sitemap.xml', severity: 'ERROR', category: 'Sitemap', detail: `Page ${f} not found in sitemap` });
  }
});

// 3. Check for orphan pages (pages not linked from anywhere)
const allInternalLinks = new Set();
allHtml.forEach(file => {
  const content = readFile(file.path);
  const hrefs = content.matchAll(/href=["']([^"'#?]+)/g);
  for (const m of hrefs) {
    let href = m[1];
    if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel:')) continue;
    if (href.startsWith('/')) href = href.slice(1);
    if (href.startsWith('../')) href = href.slice(3);
    allInternalLinks.add(href);
  }
});

// 4. Check _redirects for issues
const redirects = readFile('_redirects');
if (!redirects.includes('404.html')) {
  issues.push({ file: '_redirects', severity: 'WARNING', category: 'Redirects', detail: 'No 404 fallback found in _redirects' });
}

// 5. Check robots.txt
const robots = readFile('robots.txt');
if (!robots.includes('Sitemap:')) {
  issues.push({ file: 'robots.txt', severity: 'ERROR', category: 'Robots', detail: 'Missing Sitemap directive in robots.txt' });
}

// 6. Check external links across all pages
const extLinks = new Map();
allHtml.forEach(file => {
  const content = readFile(file.path);
  const hrefs = content.matchAll(/href=["'](https?:\/\/[^"']+)["']/g);
  for (const m of hrefs) {
    const url = m[1];
    if (url.includes('eobexplanation.com') || url.includes('fonts.google') || url.includes('googletagmanager') || url.includes('fonts.gstatic')) continue;
    if (!extLinks.has(url)) extLinks.set(url, []);
    extLinks.get(url).push(file.name);
  }
});

// Check for target="_blank" rel="noopener"
allHtml.forEach(file => {
  const content = readFile(file.path);
  const extAnchors = content.matchAll(/<a\s+[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>/gi);
  for (const a of extAnchors) {
    const url = a[1];
    if (url.includes('eobexplanation.com') || url.includes('fonts.google') || url.includes('googletagmanager') || url.includes('fonts.gstatic')) continue;
    if (!a[0].includes('rel=')) {
      issues.push({ file: file.name, severity: 'WARNING', category: 'Security', detail: `External link missing rel="noopener noreferrer": ${url.slice(0, 60)}` });
    }
  }
});

// 7. Check for duplicate title tags
const titles = new Map();
allHtml.forEach(file => {
  const content = readFile(file.path);
  const m = content.match(/<title>([^<]*)<\/title>/);
  if (m) {
    const t = m[1];
    if (!titles.has(t)) titles.set(t, []);
    titles.get(t).push(file.name);
  }
});
titles.forEach((files, title) => {
  if (files.length > 1) {
    issues.push({ file: files.join(', '), severity: 'WARNING', category: 'Duplicate Title', detail: `Duplicate title "${title.slice(0, 50)}..." used on ${files.length} pages` });
  }
});

// 8. Check for duplicate meta descriptions
const descs = new Map();
allHtml.forEach(file => {
  const content = readFile(file.path);
  const m = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*?)["']/i);
  if (m) {
    const d = m[1];
    if (!descs.has(d)) descs.set(d, []);
    descs.get(d).push(file.name);
  }
});
descs.forEach((files, desc) => {
  if (files.length > 1) {
    issues.push({ file: files.join(', '), severity: 'WARNING', category: 'Duplicate Description', detail: `Duplicate meta description on ${files.length} pages: "${desc.slice(0, 50)}..."` });
  }
});

// 9. Check hreflang (not needed for single-language English site but check)
// 10. Check for noindex where it shouldn't be
allHtml.forEach(file => {
  const content = readFile(file.path);
  if (content.includes('noindex') && !file.name.includes('404')) {
    issues.push({ file: file.name, severity: 'WARNING', category: 'Indexing', detail: 'Page has noindex directive - ensure this is intentional' });
  }
});

// --- Summary ---
let errorCount = 0, warningCount = 0;
issues.forEach(i => {
  if (i.severity === 'ERROR') errorCount++;
  else warningCount++;
});

console.log('=== COMPLETE SEO AUDIT RESULTS ===');
console.log(`Total pages scanned: ${allHtml.length}`);
console.log(`Total issues found: ${issues.length} (${errorCount} errors, ${warningCount} warnings)`);
console.log(`External links found: ${extLinks.size}`);
console.log(`Sitemap URLs: ${sitemapUrls.length}`);
console.log('');

// Group by category
const byCategory = {};
issues.forEach(i => {
  if (!byCategory[i.category]) byCategory[i.category] = [];
  byCategory[i.category].push(i);
});

Object.keys(byCategory).sort().forEach(cat => {
  console.log(`\n--- ${cat} (${byCategory[cat].length} issues) ---`);
  byCategory[cat].forEach(i => {
    console.log(`  [${i.severity}] ${i.file}: ${i.detail}`);
  });
});

// Write JSON for artifact
fs.writeFileSync('seo_audit_results.json', JSON.stringify({ stats: { totalPages: allHtml.length, errors: errorCount, warnings: warningCount, externalLinks: extLinks.size, sitemapUrls: sitemapUrls.length }, issues, externalLinks: Object.fromEntries(extLinks) }, null, 2));
console.log('\nFull results written to seo_audit_results.json');
