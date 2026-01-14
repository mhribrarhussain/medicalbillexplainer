const fs = require('fs');
const path = require('path');
const cptCodes = require('./data/cpt_codes');

const outputDir = path.join(__dirname, 'cpt');
const sitemapPath = path.join(__dirname, 'sitemap.xml');
const templatePath = path.join(__dirname, 'cpt-template.html'); // Virtual, we'll construct it in string

const domain = "https://medicalbillexplainer.netlify.app"; // Placeholder domain

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

let sitemapUrls = [
    `${domain}/`,
    `${domain}/medical-bill-explainer.html`,
    `${domain}/insurance-eob-explained.html`,
    `${domain}/bill-dispute-guide.html`,
    `${domain}/privacy-policy.html`,
    `${domain}/terms-of-use.html`,
    `${domain}/affiliate-disclosure.html`
];

cptCodes.forEach(cpt => {
  const fileName = `${cpt.code}.html`;
  const filePath = path.join(outputDir, fileName);
  const pageUrl = `${domain}/cpt/${fileName}`;
  
  sitemapUrls.push(pageUrl);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": `What Does CPT Code ${cpt.code} Mean?`,
        "description": `Understand CPT Code ${cpt.code} (${cpt.title}). Plain English explanation and pricing.`,
        "author": {
          "@type": "Organization",
          "name": "Medical Bill Explainer"
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
        "@type": "FAQPage",
        "mainEntity": [
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
        ]
      }
    ]
  };

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-PR86PQXG37"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-PR86PQXG37');
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>What Does CPT Code ${cpt.code} Mean? - Medical Bill Explainer</title>
    <meta name="description" content="Understand CPT Code ${cpt.code} (${cpt.title}). Plain English explanation, typical costs ($${cpt.price_low}-$${cpt.price_high}), and advice for patients.">
    <link rel="stylesheet" href="../style.css">
    <link rel="canonical" href="${pageUrl}">
    <script type="application/ld+json">
    ${JSON.stringify(schema, null, 2)}
    </script>
</head>
<body>

    <header>
        <div class="nav-container">
            <a href="../index.html" class="logo">Medical Bill Explainer</a>
            <nav class="nav-links">
                <a href="../medical-bill-explainer.html">Explainer Tool</a>
                <a href="../insurance-eob-explained.html">EOB Guide</a>
            </nav>
        </div>
    </header>

    <main class="container">
        <!-- Breadcrumb -->
        <p style="margin-bottom: 1rem; font-size: 0.9rem;">
            <a href="../index.html">Home</a> &gt; <a href="../index.html#search">CPT Codes</a> &gt; ${cpt.code}
        </p>

        <article class="cpt-page">
            <div class="cpt-header">
                <h1>CPT Code ${cpt.code}</h1>
                <p class="subtitle" style="font-size: 1.25rem; font-weight: 500;">${cpt.title}</p>
                <div style="margin-top: 0.5rem;">
                    <span style="background: #fff; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; border: 1px solid #ddd;">${cpt.category}</span>
                </div>
            </div>

            <section class="section">
                <h2>Simple English Explanation</h2>
                <p>${cpt.description}</p>
                <p style="margin-top: 1rem;"><strong>Why doctors use this:</strong> ${cpt.why_used}</p>
            </section>

            <section class="section">
                <div class="cpt-price-box">
                    <h3>Typical US Price Range</h3>
                    <span class="price-range">$${cpt.price_low} – $${cpt.price_high}</span>
                    <p style="font-size: 0.9rem; margin-top: 0.5rem; color: #666;">*Estimated cash price before insurance adjustments.</p>
                </div>
                <p><strong>Why prices vary:</strong> The cost can change drastically depending on whether you are at a hospital ER (most expensive), a hospital outpatient department, or a private doctor's office. Your location and specific insurance plan also play a huge role.</p>
            </section>

            ${cpt.misunderstood ? `
            <section class="section">
                <div style="background-color: #fff3cd; color: #856404; padding: 1rem; border-left: 5px solid #ffeeba; border-radius: 4px;">
                    <h3>⚠️ Often Misunderstood</h3>
                    <p>This code is frequently confusing for patients. Sometimes it appears as a separate line item from the main procedure, or it might be a "facility fee" component. Always ask for an itemized bill to see exactly what this charge covers.</p>
                </div>
            </section>` : ''}

            <section class="section questions-to-ask">
                <h2>Questions to Ask Billing</h2>
                <ul style="list-style-type: disc; margin-left: 1.5rem; margin-top: 1rem;">
                    <li>"Can you confirm if CPT ${cpt.code} was billed as a screening or diagnostic test?"</li>
                    <li>"Is there a discount for paying this code in cash immediately?"</li>
                    <li>"Does this charge include the doctor's fee, or will I get a separate bill for that?"</li>
                </ul>
            </section>

            <section class="section faq-section">
                <h2>Frequently Asked Questions</h2>
                <details>
                    <summary>Is CPT ${cpt.code} covered by insurance?</summary>
                    <p>Most standard insurance plans cover ${cpt.title} when deemed medically necessary. However, you may still owe a copay or coinsurance depending on your specific plan's deductible status.</p>
                </details>
                <details>
                    <summary>What if I was charged more than $${cpt.price_high}?</summary>
                    <p>If your bill is significantly higher than the typical range, you can call the billing department and ask for an explanation. You can also compare the price to the "Medicare Allowable" rate for your area to see if the charge is excessive.</p>
                </details>
            </section>
            
            <section class="section">
                <p style="text-align: center;">
                    <a href="../medical-bill-explainer.html" class="btn btn-primary">Analyze Another Bill</a>
                </p>
            </section>

            <div class="disclaimer">
                <p>Disclaimer: This website provides educational information only and does not provide medical, legal, or insurance advice. CPT® is a registered trademark of the American Medical Association. Prices are estimates based on national averages.</p>
            </div>
        </article>
    </main>

    <footer>
        <div class="footer-content">
            <p>&copy; 2024 Medical Bill Explainer. All rights reserved.</p>
            <div class="footer-links">
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
  console.log(`Generated: ${fileName}`);
});

// Generate Sitemap
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${url.includes('/cpt/') ? '0.8' : '1.0'}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(sitemapPath, sitemapContent);
console.log('Sitemap generated!');
