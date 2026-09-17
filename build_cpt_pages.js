const fs = require('fs');
const path = require('path');
const cptCodes = require('./data/cpt_codes');
const { renderSiteHeader } = require('./header_component');

const outputDir = path.join(__dirname, 'cpt');
const sitemapPath = path.join(__dirname, 'sitemap.xml');
const codesFilePath = path.join(__dirname, 'codes.html');

const domain = "https://eobexplanation.com"; // Target domain

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

let sitemapUrls = [
    `${domain}/`,
    `${domain}/about.html`,
    `${domain}/codes.html`,
    `${domain}/medical-bill-explainer.html`,
    `${domain}/how-to-read-an-eob.html`,
    `${domain}/insurance-eob-explained.html`,
    `${domain}/bill-dispute-guide.html`,
    `${domain}/privacy-policy.html`,
    `${domain}/terms-of-use.html`,
    `${domain}/affiliate-disclosure.html`
];

// Helper: Calculate 3-4 related codes with balanced cyclic mesh to eliminate single-link pages
function getRelatedCodes(currentCpt, allCodes) {
  const sameCat = allCodes.filter(c => c.category === currentCpt.category);
  const myIdx = sameCat.findIndex(c => c.code === currentCpt.code);
  
  let selected = [];
  if (currentCpt.companion_code) {
    const comp = allCodes.find(c => c.code === currentCpt.companion_code);
    if (comp) selected.push(comp);
  }
  
  // Pick next items in same category cyclically for balanced incoming internal links
  for (let step = 1; step < sameCat.length && selected.length < 4; step++) {
    const candidate = sameCat[(myIdx + step) % sameCat.length];
    if (candidate.code !== currentCpt.code && !selected.some(c => c.code === candidate.code)) {
      selected.push(candidate);
    }
  }

  // Fallback to high-traffic cross-category anchors if category has < 4 items
  if (selected.length < 4) {
    const anchors = ['99213', '80053', '71046', '36415', '99284'];
    for (const a of anchors) {
      if (selected.length >= 4) break;
      if (a !== currentCpt.code && !selected.some(c => c.code === a)) {
        const found = allCodes.find(c => c.code === a);
        if (found) selected.push(found);
      }
    }
  }
  return selected;
}

// Helper: Format SEO Title <= 58 characters to eliminate truncation and Semrush warnings
function formatTitle(cpt) {
  const prefix = `CPT ${cpt.code}: `;
  let short = cpt.title
    .replace(/\s*\(Complete,\s*3\+\s*Views\)/i, ' Complete')
    .replace(/\s*\(Complete\)/i, '')
    .replace(/\s*\(Bilateral\)/i, '')
    .replace(/\s*\(Blood Draw\)/i, '')
    .replace(/\s*\(Single View\)/i, '')
    .replace(/\s*\(Two Views\)/i, '')
    .replace(/\s*\(3 or 4 Views\)/i, '')
    .replace(/\s*\(1 or 2 Views\)/i, '')
    .replace(/\s*\(3 Views\)/i, '')
    .replace(/\s*\(4 or 5 Views\)/i, '')
    .replace(/\s*\(24-48 hr\)/i, '')
    .replace(/\s*\(SubQ\/IM\)/i, '')
    .replace(/\s*\(Addl\)/i, ' (Additional)')
    .replace(/Established Patient Office Visit/i, 'Established Patient')
    .replace(/New Patient Office Visit/i, 'New Patient')
    .replace(/Emergency Dept Visit/i, 'Emergency Visit')
    .replace(/Complete Blood Count \(CBC\) with Differential/i, 'CBC with Differential')
    .replace(/Complete Blood Count \(CBC\) without Differential/i, 'CBC Blood Test')
    .replace(/Comprehensive Metabolic Panel \(CMP\)/i, 'CMP Blood Panel')
    .replace(/Basic Metabolic Panel \(BMP\)/i, 'BMP Blood Panel')
    .replace(/Electrocardiogram \(ECG\/EKG\) Complete/i, 'EKG / ECG Complete')
    .replace(/Electrocardiogram \(ECG\/EKG\) Tracing Only/i, 'EKG / ECG Tracing')
    .replace(/Electrocardiogram \(ECG\/EKG\) Report Only/i, 'EKG / ECG Report')
    .replace(/Screening 3D Breast Tomosynthesis/i, '3D Mammogram Tomosynthesis')
    .replace(/Screening Mammography \(2D, Bilateral\)/i, 'Screening Mammogram 2D')
    .replace(/Repair of Superficial Wound \(([^)]+)\)/i, 'Wound Repair ($1)')
    .replace(/Injection, Ceftriaxone Sodium \(Rocephin\), 250mg/i, 'Rocephin Injection 250mg')
    .replace(/Injection, Dexamethasone Sodium Phosphate, 1mg/i, 'Dexamethasone Injection 1mg')
    .replace(/Injection, Ketorolac Tromethamine \(Toradol\), 15mg/i, 'Toradol Injection 15mg')
    .replace(/Injection, Vitamin B-12 Cyanocobalamin, up to 1000mcg/i, 'Vitamin B12 Injection')
    .replace(/Each Additional Therapeutic Injection/i, 'Additional Injection')
    .replace(/Each Additional Injection \(Same Drug\)/i, 'Additional Same Injection')
    .replace(/Therapeutic Injection/i, 'Therapeutic Injection')
    .replace(/TSH \(Thyroid Stimulating Hormone\)/i, 'TSH Thyroid Test')
    .replace(/Urinalysis with Microscopy/i, 'Urinalysis w/ Microscopy')
    .replace(/Urinalysis without Microscopy/i, 'Urinalysis Test')
    .replace(/MRI Lumbar Spine \(No Contrast\)/i, 'Lumbar Spine MRI (No Contrast)')
    .replace(/MRI Lumbar Spine \(With Contrast\)/i, 'Lumbar Spine MRI (Contrast)')
    .replace(/MRI Lumbar Spine \(With & Without Contrast\)/i, 'Lumbar MRI Spine (Contrast)')
    .trim();

  let candidate = `${prefix}${short} - Cost & Guide`;
  if (candidate.length > 58) {
    candidate = `${prefix}${short} Cost & Guide`;
  }
  if (candidate.length > 58) {
    candidate = `${prefix}${short} - Guide`;
  }
  if (candidate.length > 58) {
    candidate = `${prefix}${short.slice(0, 58 - prefix.length - 1)}…`;
  }
  return candidate;
}

// Export client-side lookup database for the Explainer Tool
const cptDict = {};
cptCodes.forEach(c => {
  cptDict[c.code] = {
    code: c.code,
    title: c.title,
    category: c.category,
    price_low: c.price_low,
    price_high: c.price_high,
    misunderstood: c.misunderstood || false
  };
});
fs.writeFileSync(path.join(__dirname, 'cpt_data.js'), `window.CPT_DATABASE = ${JSON.stringify(cptDict)};\n`);
console.log('Generated: cpt_data.js (Client-side CPT database)');

// Generate Individual CPT Pages
cptCodes.forEach(cpt => {
  const codeLower = cpt.code.toLowerCase();
  const fileName = `${codeLower}.html`;
  const filePath = path.join(outputDir, fileName);
  const pageUrl = `${domain}/cpt/${fileName}`;
  
  sitemapUrls.push(pageUrl);

  const relatedCodes = getRelatedCodes(cpt, cptCodes);
  const relatedCodesHtml = relatedCodes.length > 0 ? `
            <section class="section related-codes">
                <h2>Related Medical Billing Codes</h2>
                <p style="color: #666; margin-bottom: 1.25rem;">Other common codes in <strong>${cpt.category}</strong> you may see on your statement or EOB:</p>
                <div class="grid-2">
                    ${relatedCodes.map(rel => `
                    <div class="related-card">
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.35rem;">
                                <span style="font-weight: 700; color: var(--primary-color); font-size: 1.1rem;">CPT ${rel.code}</span>
                                <span style="font-size: 0.85rem; color: #28a745; font-weight: 600;">$${rel.price_low} – $${rel.price_high}</span>
                            </div>
                            <h4 style="font-size: 1rem; margin-bottom: 0.5rem; color: var(--text-dark);">${rel.title}</h4>
                            <p style="font-size: 0.875rem; color: #555; margin-bottom: 1rem; line-height: 1.4;">${rel.description}</p>
                        </div>
                        <a href="${rel.code.toLowerCase()}.html" class="btn btn-primary" style="font-size: 0.85rem; padding: 0.5rem 1rem; text-align: center; border: 1px solid var(--primary-color); background: #f0f7ff; color: var(--primary-color);">View CPT ${rel.code} Guide &rarr;</a>
                    </div>`).join('')}
                </div>
            </section>` : '';

  // Companion Callout
  let companionHtml = '';
  if (cpt.companion_code && cpt.companion_name) {
    const compLower = cpt.companion_code.toLowerCase();
    companionHtml = `
            <section class="section">
                <div style="background-color: #eef6ff; border-left: 5px solid var(--primary-color); padding: 1.25rem; border-radius: 6px;">
                    <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">🔗 Frequently Billed With CPT ${cpt.companion_code}</h3>
                    <p style="margin-bottom: 0.75rem;">Patients routinely see <strong>CPT ${cpt.code}</strong> and <strong><a href="${compLower}.html" style="font-weight: 700; color: var(--primary-color); text-decoration: underline;">CPT ${cpt.companion_code} (${cpt.companion_name})</a></strong> listed together on the same bill or EOB.</p>
                    <p style="font-size: 0.95rem; color: #444; line-height: 1.5;">${cpt.code === '77063' ? 'CPT 77063 is an add-on procedure that cannot legally be billed alone. It must be paired with primary screening code CPT 77067.' : 'CPT 77067 is the standard 2D mammogram base code, which is routinely billed alongside CPT 77063 for 3D tomosynthesis.'}</p>
                    <div style="margin-top: 0.75rem;">
                        <a href="${compLower}.html" style="font-weight: 600; font-size: 0.9rem; color: var(--primary-color);">Read our complete guide to CPT ${cpt.companion_code} &rarr;</a>
                    </div>
                </div>
            </section>`;
  }

  // Insurance Rules Section
  let insuranceRulesHtml = '';
  if (cpt.insurance_rules) {
    insuranceRulesHtml = `
            <section class="section">
                <div class="card" style="border-left: 4px solid #10b981;">
                    <h2>Insurance Coverage & Mandates</h2>
                    <p style="line-height: 1.6; color: #333;">${cpt.insurance_rules}</p>
                </div>
            </section>`;
  }

  // Detailed clinical overview
  let detailedExpHtml = '';
  if (cpt.detailed_explanation) {
    detailedExpHtml = `
            <section class="section">
                <h2>Clinical & Billing Details</h2>
                <p style="line-height: 1.6; font-size: 1.05rem; color: #333;">${cpt.detailed_explanation}</p>
            </section>`;
  }

  // Questions to ask
  let questionsHtml = '';
  if (cpt.questions_to_ask && cpt.questions_to_ask.length > 0) {
    questionsHtml = cpt.questions_to_ask.map(q => `<li>"${q}"</li>`).join('\n                    ');
  } else {
    questionsHtml = `<li>"Can you confirm if CPT ${cpt.code} was billed as a screening or diagnostic test?"</li>
                    <li>"Is there a discount for paying this code in cash immediately?"</li>
                    <li>"Does this charge include the doctor's fee, or will I get a separate bill for that?"</li>`;
  }

  // FAQ HTML & Schema Entities
  let faqEntities = [];
  let faqHtml = '';
  if (cpt.custom_faqs && cpt.custom_faqs.length > 0) {
    faqEntities = cpt.custom_faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }));
    faqHtml = cpt.custom_faqs.map(faq => `
                <details>
                    <summary>${faq.question}</summary>
                    <p>${faq.answer}</p>
                </details>`).join('');
  } else {
    faqEntities = [
      {
        "@type": "Question",
        "name": `What is CPT Code ${cpt.code}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `CPT Code ${cpt.code} represents ${cpt.title}. ${cpt.description}`
        }
      },
      {
        "@type": "Question",
        "name": `How much does CPT Code ${cpt.code} cost?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The typical price range for CPT ${cpt.code} is between $${cpt.price_low} and $${cpt.price_high} without insurance. Prices vary by location and facility.`
        }
      }
    ];
    faqHtml = `
                <details>
                    <summary>Is CPT ${cpt.code} covered by insurance?</summary>
                    <p>Most standard insurance plans cover ${cpt.title} when deemed medically necessary. However, you may still owe a copay or coinsurance depending on your specific plan's deductible status.</p>
                </details>
                <details>
                    <summary>What if I was charged more than $${cpt.price_high}?</summary>
                    <p>If your bill is significantly higher than the typical range, you can call the billing department and ask for an explanation. You can also compare the price to the "Medicare Allowable" rate for your area to see if the charge is excessive.</p>
                </details>`;
  }

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": `CPT Code ${cpt.code}: ${cpt.title} - Meaning, Costs & Billing Guide`,
        "description": `Understand CPT Code ${cpt.code} (${cpt.title}). Plain English explanation, typical price range ($${cpt.price_low}-$${cpt.price_high}), and advice for patients.`,
        "image": `${domain}/logo.png`,
        "author": {
          "@type": "Person",
          "@id": `${domain}/about.html#author`,
          "name": "M. Ibrar Hussain",
          "url": `${domain}/about.html#author`,
          "jobTitle": "Founder, Lead Researcher & Technologist"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Medical Bill Explainer",
          "logo": {
            "@type": "ImageObject",
            "url": `${domain}/logo.png`
          }
        },
        "datePublished": "2024-01-14",
        "dateModified": new Date().toISOString().split('T')[0]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": `${domain}/`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "CPT Directory",
            "item": `${domain}/codes.html`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": `CPT ${cpt.code}`,
            "item": pageUrl
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqEntities
      }
    ]
  };

  // Helper: Format Meta Description <= 155 chars to prevent truncation
  let metaDesc = `CPT ${cpt.code}: ${cpt.title}. Costs ($${cpt.price_low}-$${cpt.price_high}), coverage rules, why doctors bill this, and questions to ask.`;
  if (metaDesc.length > 155) {
    metaDesc = `CPT ${cpt.code}: ${cpt.title.slice(0, 155 - `CPT ${cpt.code}: . Cash: $${cpt.price_low}-$${cpt.price_high}. Billing guide.`.length)}... Cash: $${cpt.price_low}-$${cpt.price_high}. Billing guide.`;
  }
  if (metaDesc.length > 155) {
    metaDesc = metaDesc.slice(0, 152) + '...';
  }

  const pageTitle = formatTitle(cpt);

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google tag (gtag.js) with Admin Opt-Out Toggle -->
    <script>
      (function() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('block_me') === '1') {
          localStorage.setItem('block_analytics', 'true');
          alert('Analytics tracking is now DISABLED on this device.');
          window.history.replaceState({}, document.title, window.location.pathname);
        } else if (urlParams.get('block_me') === '0') {
          localStorage.removeItem('block_analytics');
          alert('Analytics tracking is now ENABLED on this device.');
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        if (localStorage.getItem('block_analytics') === 'true') {
          window['ga-disable-G-PR86PQXG37'] = true;
          return;
        }
        const s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=G-PR86PQXG37';
        document.head.appendChild(s);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', 'G-PR86PQXG37');
      })();
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" media="print" onload="this.media='all'">
    <noscript>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap">
    </noscript>
    <link rel="stylesheet" href="../style.css">
    <script defer src="../nav.js"></script>
    <script defer src="../script.js"></script>
    <link rel="canonical" href="${pageUrl}">
    <!-- Favicon & Brand Icons -->
    <link rel="icon" type="image/svg+xml" href="../favicon.svg">
    <link rel="icon" type="image/png" sizes="96x96" href="../favicon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="../favicon-32x32.png">
    <link rel="shortcut icon" href="../favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="../apple-touch-icon.png">
    <link rel="manifest" href="../site.webmanifest">
    <meta name="theme-color" content="#1d4ed8">

    <!-- Open Graph & Social Cards -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:site_name" content="Medical Bill Explainer">
    <meta property="og:image" content="${domain}/logo.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="${domain}/logo.png">

    <script type="application/ld+json">
    ${JSON.stringify(schema, null, 2)}
    </script>
</head>
<body>
${renderSiteHeader('codes', '../')}

    <main class="container">
        <!-- Breadcrumb -->
        <p style="margin-bottom: 1.5rem; font-size: 0.9rem; color: #64748b;">
            <a href="../index.html">Home</a> &gt; <a href="../codes.html">CPT Directory</a> &gt; ${cpt.code}
        </p>

        <article class="cpt-page">
            <div class="cpt-header">
                <h1>CPT Code ${cpt.code}</h1>
                <p class="subtitle" style="font-size: 1.25rem; font-weight: 500; color: #334155;">${cpt.title}</p>
                <div style="margin-top: 0.5rem;">
                    <span class="badge" style="background: #e2e8f0; color: #334155;">${cpt.category}</span>
                </div>
            </div>

            <section class="section">
                <h2>Simple English Explanation</h2>
                <p style="font-size: 1.05rem; line-height: 1.6; color: #1e293b;">${cpt.description}</p>
                <p style="margin-top: 1rem; color: #475569;"><strong>Why doctors use this:</strong> ${cpt.why_used}</p>
            </section>

            ${companionHtml}

            ${detailedExpHtml}

            <section class="section">
                <div class="cpt-price-box">
                    <h3>Typical US Price Range</h3>
                    <span class="price-range">$${cpt.price_low} – $${cpt.price_high}</span>
                    <p style="font-size: 0.9rem; margin-top: 0.5rem; color: #64748b;">*Estimated cash price before insurance adjustments.</p>
                </div>
                <p style="color: #475569; font-size: 0.95rem;"><strong>Why prices vary:</strong> The cost can change drastically depending on whether you are at a hospital ER (most expensive), a hospital outpatient department, or a private doctor's office. Your location and specific insurance plan also play a huge role.</p>
            </section>

            ${insuranceRulesHtml}

            ${cpt.misunderstood ? `
            <section class="section">
                <div style="background-color: #fffbeb; color: #92400e; padding: 1.25rem; border-left: 5px solid #f59e0b; border-radius: 6px;">
                    <h3 style="margin-bottom: 0.35rem;">⚠️ Often Misunderstood</h3>
                    <p style="line-height: 1.5; font-size: 0.95rem;">This code is frequently confusing for patients. Sometimes it appears as a separate line item from the main procedure, or it might be a "facility fee" component. Always ask for an itemized bill to see exactly what this charge covers.</p>
                </div>
            </section>` : ''}

            <section class="section questions-to-ask">
                <h2>Questions to Ask Billing</h2>
                <ul style="list-style-type: disc; margin-left: 1.5rem; margin-top: 1rem; line-height: 1.7; color: #334155;">
                    ${questionsHtml}
                </ul>
            </section>

            <section class="section faq-section">
                <h2>Frequently Asked Questions</h2>
                ${faqHtml}
            </section>

            ${relatedCodesHtml}
            
            <section class="section" style="margin-top: 3rem;">
                <div class="card" style="text-align: center; background: #f8fafc;">
                    <h3 style="margin-bottom: 0.5rem;">Have More Charges on Your Medical Bill?</h3>
                    <p style="color: #64748b; margin-bottom: 1.25rem;">Paste your complete statement into our free analyzer or explore all 57 billing codes in our directory.</p>
                    <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                        <a href="../medical-bill-explainer.html" class="btn btn-primary">Analyze Another Bill</a>
                        <a href="../codes.html" class="btn btn-secondary">Browse All 57 Codes</a>
                    </div>
                </div>
            </section>

            <div class="disclaimer">
                <p>Disclaimer: This website provides educational information only and does not provide medical, legal, or insurance advice. CPT® is a registered trademark of the American Medical Association. Prices are estimates based on national averages.</p>
            </div>
        </article>
    </main>

    <footer>
        <div class="footer-content">
            <p>&copy; 2026 Medical Bill Explainer. All rights reserved.</p>
            <div class="footer-links">
                <a href="../about.html">About Us</a>
                <a href="../privacy-policy.html">Privacy Policy</a>
                <a href="../terms-of-use.html">Terms of Use</a>
                <a href="../affiliate-disclosure.html">Affiliate Disclosure</a>
            </div>
        </div>
    </footer>

</body>
</html>
`;
  
  fs.writeFileSync(filePath, htmlContent);
  if (cpt.code !== codeLower) {
    fs.writeFileSync(path.join(outputDir, `${cpt.code}.html`), htmlContent);
  }
});
console.log(`Generated ${cptCodes.length} individual CPT pages in /cpt/`);

// -------------------------------------------------------------
// Generate codes.html (Master CPT Directory)
// -------------------------------------------------------------
const categories = [...new Set(cptCodes.map(c => c.category))];

const categoryDescriptions = {
  "Office & Evaluation": "Doctor appointments, new patient evaluations, and established patient follow-up visits.",
  "ER Visit": "Emergency department severity levels 1 through 5 and physician emergency evaluations.",
  "Lab & Blood Tests": "Routine blood draws, metabolic panels, lipid profiles, urinalysis, and CBC tests.",
  "Imaging": "Diagnostic X-rays, 2D and 3D screening mammograms, spinal MRIs, and radiological scans.",
  "Cardiology": "Electrocardiograms (ECGs/EKGs), echocardiograms, and continuous Holter heart monitoring.",
  "Mental Health": "Diagnostic psychiatric evaluations, family therapy, and 45-60 minute psychotherapy sessions.",
  "Procedures": "Simple wound repairs, superficial laceration suturing, and minor outpatient procedures.",
  "Injections": "Therapeutic, prophylactic, and diagnostic subcutaneous or intramuscular injections and immunizations.",
  "Medications": "HCPCS 'J' codes for injectable emergency room medications, antibiotics, and vitamins."
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Complete CPT Code Directory",
  "description": "Directory of 57 common medical billing CPT codes with plain English descriptions and fair cash price ranges.",
  "url": `${domain}/codes.html`,
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": cptCodes.map((cpt, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": `CPT ${cpt.code} - ${cpt.title}`,
      "url": `${domain}/cpt/${cpt.code.toLowerCase()}.html`
    }))
  }
};

const codesHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google tag (gtag.js) with Admin Opt-Out Toggle -->
    <script>
      (function() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('block_me') === '1') {
          localStorage.setItem('block_analytics', 'true');
          alert('Analytics tracking is now DISABLED on this device.');
          window.history.replaceState({}, document.title, window.location.pathname);
        } else if (urlParams.get('block_me') === '0') {
          localStorage.removeItem('block_analytics');
          alert('Analytics tracking is now ENABLED on this device.');
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        if (localStorage.getItem('block_analytics') === 'true') {
          window['ga-disable-G-PR86PQXG37'] = true;
          return;
        }
        const s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=G-PR86PQXG37';
        document.head.appendChild(s);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', 'G-PR86PQXG37');
      })();
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CPT Code Directory: Plain-English Medical Codes</title>
    <meta name="description" content="Browse 57 common medical CPT codes. Find plain English explanations, cash cost ranges ($), and billing advice for hospital and office visits.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" media="print" onload="this.media='all'">
    <noscript>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap">
    </noscript>
    <link rel="stylesheet" href="style.css">
    <script defer src="nav.js"></script>
    <link rel="canonical" href="${domain}/codes.html">
    <!-- Favicon & Brand Icons -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="shortcut icon" href="/favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="theme-color" content="#1d4ed8">

    <!-- Open Graph & Social Cards -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="CPT Code Directory: Plain-English Medical Codes">
    <meta property="og:description" content="Browse 57 common medical CPT codes. Find plain English explanations, cash cost ranges ($), and billing advice for hospital and office visits.">
    <meta property="og:url" content="${domain}/codes.html">
    <meta property="og:site_name" content="Medical Bill Explainer">
    <meta property="og:image" content="${domain}/logo.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="CPT Code Directory: Plain-English Medical Codes">
    <meta name="twitter:description" content="Browse 57 common medical CPT codes. Find plain English explanations, cash cost ranges ($), and billing advice for hospital and office visits.">
    <meta name="twitter:image" content="${domain}/logo.png">

    <script type="application/ld+json">
    ${JSON.stringify(itemListSchema, null, 2)}
    </script>
    <style>
      .filter-bar {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin: 1.5rem 0 2.5rem 0;
        justify-content: center;
      }
      .filter-pill {
        background: var(--white);
        border: 1px solid var(--border-color);
        padding: 0.45rem 0.95rem;
        border-radius: 9999px;
        font-size: 0.85rem;
        font-weight: 600;
        color: #475569;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: var(--font-family);
      }
      .filter-pill:hover, .filter-pill.active {
        background: var(--primary-color);
        color: var(--white);
        border-color: var(--primary-color);
      }
      .search-box-wrap {
        max-width: 600px;
        margin: 1.5rem auto 0 auto;
        position: relative;
      }
      .search-box-wrap input {
        width: 100%;
        padding: 0.95rem 1.25rem 0.95rem 2.85rem;
        border-radius: 10px;
        border: 1px solid var(--border-color);
        font-size: 1.05rem;
        box-shadow: var(--shadow-sm);
        transition: all 0.2s;
        font-family: var(--font-family);
      }
      .search-box-wrap input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.15);
      }
      .search-icon {
        position: absolute;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 1.2rem;
        color: #94a3b8;
      }
    </style>
</head>
<body>
${renderSiteHeader('codes', '')}

    <section class="hero" style="padding: 4.5rem 1.5rem 4rem 1.5rem;">
        <span class="badge" style="background: rgba(255,255,255,0.2); color: #fff; margin-bottom: 0.75rem;">57 Common US Billing Codes</span>
        <h1>Medical CPT & HCPCS Code Directory</h1>
        <p>Search any 5-digit code from your hospital bill or doctor's statement to see fair prices, plain English definitions, and questions to ask billing.</p>
        
        <div class="search-box-wrap">
            <span class="search-icon">🔍</span>
            <input type="text" id="dirSearchInput" placeholder="Search by code (e.g. 77067, 99213) or keyword (mammogram, MRI, blood test)...">
        </div>
    </section>

    <main class="container">

        <!-- Category Pills -->
        <div class="filter-bar" id="filterBar">
            <button class="filter-pill active" data-cat="all">All Categories (${cptCodes.length})</button>
            ${categories.map(cat => {
              const count = cptCodes.filter(c => c.category === cat).length;
              return `<button class="filter-pill" data-cat="${cat}">${cat} (${count})</button>`;
            }).join('\n            ')}
        </div>

        <div id="noResults" style="display: none; text-align: center; padding: 4rem 1rem;">
            <h3 style="color: var(--secondary-color);">No matching codes found</h3>
            <p style="color: #64748b; margin-top: 0.5rem;">Try searching for a 5-digit code or medical term, or paste your entire bill into our <a href="medical-bill-explainer.html" style="font-weight: 600;">Bill Explainer Tool</a>.</p>
        </div>

        <div id="directoryContent">
            ${categories.map(cat => {
              const catCodes = cptCodes.filter(c => c.category === cat);
              const catDesc = categoryDescriptions[cat] || "Common medical procedures and tests.";
              return `
            <section class="section category-group" data-category="${cat}">
                <div style="display: flex; align-items: baseline; gap: 0.75rem; margin-bottom: 0.5rem; border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem;">
                    <h2 style="font-size: 1.65rem; color: var(--secondary-color); margin: 0;">${cat}</h2>
                    <span class="badge" style="background: #e2e8f0; color: #475569;">${catCodes.length} codes</span>
                </div>
                <p style="color: #64748b; margin-bottom: 1.5rem; font-size: 0.95rem;">${catDesc}</p>
                <div class="grid-2">
                    ${catCodes.map(cpt => `
                    <div class="related-card code-item" data-code="${cpt.code}" data-title="${cpt.title.toLowerCase()}" data-desc="${cpt.description.toLowerCase()}">
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.4rem;">
                                <span style="font-weight: 800; color: var(--primary-color); font-size: 1.15rem; font-family: var(--font-heading);">CPT ${cpt.code}</span>
                                <span style="font-size: 0.85rem; color: #059669; font-weight: 700; background: #ecfdf5; padding: 2px 8px; border-radius: 9999px;">$${cpt.price_low} – $${cpt.price_high}</span>
                            </div>
                            <h3 style="font-size: 1.05rem; margin-bottom: 0.45rem; color: var(--secondary-color);">${cpt.title}</h3>
                            <p style="font-size: 0.88rem; color: #475569; margin-bottom: 1rem; line-height: 1.45;">${cpt.description}</p>
                        </div>
                        <a href="cpt/${cpt.code.toLowerCase()}.html" class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.55rem 1rem; text-align: center; border-color: var(--primary-color); color: var(--primary-color); background: #f0f7ff;">View CPT ${cpt.code} Breakdown &rarr;</a>
                    </div>`).join('\n                    ')}
                </div>
            </section>`;
            }).join('\n')}
        </div>

        <!-- Help Banner -->
        <section class="section" style="margin-top: 4rem;">
            <div class="card" style="background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%); border-left: 6px solid var(--primary-color); text-align: center; padding: 2.75rem 1.5rem;">
                <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--secondary-color);">Can't Find Your Code or Have a Complex Hospital Bill?</h3>
                <p style="color: #475569; max-width: 650px; margin: 0 auto 1.5rem auto;">Use our free, private Explainer Tool to paste your raw digital statement or EOB text. We automatically detect all CPT codes and translate insurance jargon in seconds.</p>
                <a href="medical-bill-explainer.html" class="btn btn-primary" style="font-size: 1rem; padding: 0.85rem 1.75rem;">Analyze My Bill Now</a>
            </div>
        </section>

    </main>

    <footer>
        <div class="footer-content">
            <p>&copy; 2026 Medical Bill Explainer. All rights reserved.</p>
            <div class="footer-links">
                <a href="about.html">About Us</a>
                <a href="privacy-policy.html">Privacy Policy</a>
                <a href="terms-of-use.html">Terms of Use</a>
                <a href="affiliate-disclosure.html">Affiliate Disclosure</a>
            </div>
             <div class="disclaimer">
                <p>Disclaimer: This website provides educational information only and does not provide medical, legal, or insurance advice. CPT® is a registered trademark of the American Medical Association.</p>
            </div>
        </div>
    </footer>

    <script>
    document.addEventListener('DOMContentLoaded', () => {
        const searchInput = document.getElementById('dirSearchInput');
        const filterPills = document.querySelectorAll('.filter-pill');
        const categoryGroups = document.querySelectorAll('.category-group');
        const noResults = document.getElementById('noResults');

        let activeCat = 'all';

        function filterDirectory() {
            const query = searchInput.value.toLowerCase().trim();
            let visibleCount = 0;

            categoryGroups.forEach(group => {
                const groupCat = group.getAttribute('data-category');
                const catMatches = (activeCat === 'all' || activeCat === groupCat);
                let groupVisibleItems = 0;

                const items = group.querySelectorAll('.code-item');
                items.forEach(item => {
                    const code = item.getAttribute('data-code').toLowerCase();
                    const title = item.getAttribute('data-title');
                    const desc = item.getAttribute('data-desc');

                    const textMatches = !query || code.includes(query) || title.includes(query) || desc.includes(query);

                    if (catMatches && textMatches) {
                        item.style.display = 'flex';
                        groupVisibleItems++;
                        visibleCount++;
                    } else {
                        item.style.display = 'none';
                    }
                });

                // Show or hide category heading based on visible items
                group.style.display = groupVisibleItems > 0 ? 'block' : 'none';
            });

            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }

        let dirSearchTimer = null;
        searchInput.addEventListener('input', () => {
            filterDirectory();
            clearTimeout(dirSearchTimer);
            const q = searchInput.value.trim();
            if (q.length >= 2) {
                dirSearchTimer = setTimeout(() => {
                    if (window.trackGA4Event) {
                        window.trackGA4Event('cpt_search', {
                            event_category: 'search',
                            search_term: q,
                            search_location: 'directory_page'
                        });
                    }
                }, 1200);
            }
        });

        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                activeCat = pill.getAttribute('data-cat');
                filterDirectory();

                if (window.trackGA4Event) {
                    window.trackGA4Event('filter_cpt_category', {
                        event_category: 'engagement',
                        category_name: activeCat
                    });
                }
            });
        });
    });
    </script>

</body>
</html>
`;

fs.writeFileSync(codesFilePath, codesHtml);
console.log('Generated: codes.html (Master CPT Directory)');

// Helper: Determine appropriate priority weighting for sitemap
function getSitemapPriority(url) {
  if (url === `${domain}/`) return '1.0';
  if (url.includes('privacy-policy') || url.includes('terms-of-use') || url.includes('affiliate-disclosure')) return '0.3';
  if (url.includes('about.html')) return '0.6';
  if (url.includes('/cpt/')) return '0.7';
  // Core guides and interactive tools
  return '0.9';
}

// Generate Sitemap
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${getSitemapPriority(url)}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(sitemapPath, sitemapContent);
console.log('Sitemap generated!');
