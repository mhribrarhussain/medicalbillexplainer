const fs = require('fs');
const path = require('path');

// 1. Minify CSS
function minifyCss(css) {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    // Remove space before and after syntax characters
    .replace(/\s*([{}:;,>+~])\s*/g, '$1')
    // Remove trailing semicolons in blocks
    .replace(/;}/g, '}')
    .trim();
}

// 2. Simple JS Minifier (safe whitespace & comment removal)
function minifyJs(js) {
  // Preserve strings while stripping comments
  let inString = null;
  let inLineComment = false;
  let inBlockComment = false;
  let out = '';
  
  for (let i = 0; i < js.length; i++) {
    const char = js[i];
    const next = js[i + 1];

    if (inLineComment) {
      if (char === '\n' || char === '\r') {
        inLineComment = false;
        out += '\n';
      }
      continue;
    }

    if (inBlockComment) {
      if (char === '*' && next === '/') {
        inBlockComment = false;
        i++; // skip /
      }
      continue;
    }

    if (inString) {
      out += char;
      if (char === '\\') {
        out += next;
        i++;
      } else if (char === inString) {
        inString = null;
      }
      continue;
    }

    // Check for comment starts
    if (char === '/' && next === '/') {
      inLineComment = true;
      i++;
      continue;
    }
    if (char === '/' && next === '*') {
      inBlockComment = true;
      i++;
      continue;
    }

    // Check for string starts
    if (char === '"' || char === "'" || char === '`') {
      inString = char;
      out += char;
      continue;
    }

    out += char;
  }

  // Collapse consecutive blank lines and trim line ends
  return out
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .join('\n');
}

// Backup sources
if (!fs.existsSync('style.src.css')) {
  fs.copyFileSync('style.css', 'style.src.css');
  console.log('Saved backup style.src.css');
}
if (!fs.existsSync('script.src.js')) {
  fs.copyFileSync('script.js', 'script.src.js');
  console.log('Saved backup script.src.js');
}
if (!fs.existsSync('nav.src.js')) {
  fs.copyFileSync('nav.js', 'nav.src.js');
  console.log('Saved backup nav.src.js');
}

// Minify style.css
const rawCss = fs.readFileSync('style.src.css', 'utf8');
const minCss = minifyCss(rawCss);
fs.writeFileSync('style.css', minCss);
console.log(`Minified style.css: ${rawCss.length} -> ${minCss.length} bytes (-${Math.round((1 - minCss.length/rawCss.length)*100)}%)`);

// Minify script.js
const rawJs = fs.readFileSync('script.src.js', 'utf8');
const minJs = minifyJs(rawJs);
fs.writeFileSync('script.js', minJs);
console.log(`Minified script.js: ${rawJs.length} -> ${minJs.length} bytes (-${Math.round((1 - minJs.length/rawJs.length)*100)}%)`);

// Minify nav.js
const rawNav = fs.readFileSync('nav.src.js', 'utf8');
const minNav = minifyJs(rawNav);
fs.writeFileSync('nav.js', minNav);
console.log(`Minified nav.js: ${rawNav.length} -> ${minNav.length} bytes (-${Math.round((1 - minNav.length/rawNav.length)*100)}%)`);
