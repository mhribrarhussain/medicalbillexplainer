document.addEventListener('DOMContentLoaded', () => {
    const activeNavLink = document.querySelector('.nav-links a.active');
    if (activeNavLink) {
        activeNavLink.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    const billInput = document.getElementById('billInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultsArea = document.getElementById('resultsArea');
    const sampleButtons = document.querySelectorAll('.sample-btn');

    // Sample Bill Pre-fill Data
    const sampleBills = {
        er: `Memorial General Hospital - Emergency Department
Date of Service: 08/12/2025
Account #: 984210

Itemized Charges:
Code: 99284 - Emergency Dept Visit, Level 4 (High Severity)
Code: 71046 - Chest X-Ray (Two Views)
Code: J1885 - Ketorolac Tromethamine Injection (Toradol 15mg)
Code: 96372 - Therapeutic / Diagnostic Injection

Financial Summary:
Total Billed Charges: $4,850.00
Insurance Allowed Amount: $1,420.00
Plan Deductible Applied: $750.00
Coinsurance (20%): $134.00
Total Patient Responsibility: $884.00`,

        mammogram: `Women's Comprehensive Imaging Center
Date of Service: 05/20/2025
Exam: Annual Preventive Breast Cancer Screening

Itemized Procedure Codes:
CPT 77067 - Screening Mammography (Bilateral 2D)
CPT 77063 - Screening 3D Breast Tomosynthesis Add-on

Statement Notice:
Preventive Care Coverage: Subject to ACA Mandate
Billed Amount: $580.00
Allowed Amount: $265.00
Copay: $0.00
Patient Balance Due: $0.00`,

        physical: `Family Practice Healthcare Associates
Date of Service: 04/10/2025
Encounter: Annual Health Checkup & Bloodwork

Service Line Items:
Code: 99213 - Office Visit, Established Patient (Level 3)
Code: 80053 - Comprehensive Metabolic Panel (CMP)
Code: 85025 - Complete Blood Count (CBC) with Differential
Code: 80061 - Lipid Panel (Cholesterol, HDL, LDL)
Code: 36415 - Routine Venipuncture (Blood Draw Fee)

Financial Summary:
Billed Amount: $745.00
Allowed Amount: $210.00
Patient Copay: $25.00`
    };

    // Pre-fill sample buttons
    sampleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const sampleType = btn.getAttribute('data-sample');
            if (window.trackGA4Event) {
                window.trackGA4Event('sample_bill_click', {
                    event_category: 'engagement',
                    sample_type: sampleType
                });
            }
            if (sampleBills[sampleType] && billInput) {
                billInput.value = sampleBills[sampleType];
                analyzeBill(billInput.value, 'sample_' + sampleType);
            }
        });
    });

    if (analyzeBtn && billInput && resultsArea) {
        analyzeBtn.addEventListener('click', () => {
            const text = billInput.value;
            if (!text.trim()) {
                resultsArea.innerHTML = `
                    <div style="text-align: center; padding: 2rem 1rem;">
                        <p style="color: #b91c1c; font-weight: 600; font-size: 1.05rem;">⚠️ Please paste your bill text or click one of the sample buttons above first.</p>
                    </div>`;
                return;
            }

            analyzeBill(text, 'manual_paste');
        });
    }

    function analyzeBill(text, triggerSource = 'manual_paste') {
        // CPT & HCPCS Regex (matches 5 digits, 4 digits + letter, or J-codes)
        const cptRegex = /\b([0-9]{5}|[0-9]{4}[A-Z]|J[0-9]{4})\b/gi;
        const allMatches = text.match(cptRegex) || [];
        const uniqueCodes = [...new Set(allMatches.map(c => c.toUpperCase()))];

        // Frequency counter to check duplicates
        const codeCounts = {};
        allMatches.forEach(c => {
            const code = c.toUpperCase();
            codeCounts[code] = (codeCounts[code] || 0) + 1;
        });

        // Filter out obvious years like 2024, 2025, 2026, 2023 if not in our database
        const db = window.CPT_DATABASE || {};
        const validCodes = uniqueCodes.filter(c => {
            if (['2023', '2024', '2025', '2026', '2027'].includes(c)) return false;
            return true;
        });

        let totalLow = 0;
        let totalHigh = 0;
        let knownCount = 0;

        validCodes.forEach(code => {
            if (db[code]) {
                totalLow += db[code].price_low;
                totalHigh += db[code].price_high;
                knownCount++;
            }
        });

        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 2px solid var(--border-color); padding-bottom: 1rem;">
                <h3 style="margin: 0; font-size: 1.5rem; color: var(--secondary-color);">Analysis Results</h3>
                <span class="badge" style="background: #dbeafe; color: #1e40af; font-size: 0.85rem;">${validCodes.length} Potential Code${validCodes.length === 1 ? '' : 's'} Identified</span>
            </div>`;

        if (validCodes.length === 0) {
            html += `
                <div style="background: #fffbeb; border: 1px solid #fde68a; padding: 1.5rem; border-radius: 8px; text-align: center;">
                    <p style="font-weight: 600; color: #92400e;">No obvious CPT codes found in your text.</p>
                    <p style="font-size: 0.9rem; color: #78350f; margin-top: 0.5rem;">Look for 5-digit codes like <strong>99213</strong>, <strong>80053</strong>, or <strong>77067</strong> on your itemized statement. If you are unsure, browse our <a href="codes.html" style="font-weight: 700; text-decoration: underline;">Complete Code Directory</a>.</p>
                </div>`;
        } else {
            // Price benchmark summary banner if known codes exist
            if (knownCount > 0) {
                html += `
                    <div style="background: linear-gradient(135deg, #ecfdf5 0%, #f8fafc 100%); border: 1px solid #a7f3d0; border-radius: 10px; padding: 1.25rem 1.5rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                        <div>
                            <span style="font-size: 0.85rem; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.05em;">Fair Cash Benchmark Range</span>
                            <h4 style="margin: 0.25rem 0 0 0; color: var(--secondary-color); font-size: 1.25rem;">Estimated Fair Total: <span style="color: #059669; font-weight: 800;">$${totalLow} – $${totalHigh}</span></h4>
                            <p style="font-size: 0.8rem; color: #64748b; margin-top: 2px;">Estimated national cash price before insurance adjustments for ${knownCount} detected service${knownCount === 1 ? '' : 's'}.</p>
                        </div>
                        <a href="insurance-eob-explained.html" class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.5rem 0.9rem;">Check EOB Responsibility &rarr;</a>
                    </div>`;
            }

            // Duplicate warnings
            const duplicates = Object.keys(codeCounts).filter(c => codeCounts[c] > 1 && validCodes.includes(c));
            if (duplicates.length > 0) {
                html += `
                    <div style="background: #fef2f2; border-left: 5px solid #ef4444; padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem;">
                        <strong style="color: #b91c1c;">⚠️ Potential Duplicate Charges Detected:</strong>
                        <p style="font-size: 0.88rem; color: #7f1d1d; margin-top: 0.25rem;">The following code(s) appear multiple times on your statement: <strong>${duplicates.map(d => `${d} (${codeCounts[d]}x)`).join(', ')}</strong>. Check your itemized bill to ensure you weren't billed twice for the same service or test.</p>
                    </div>`;
            }

            // Code Cards Grid
            html += `<div class="grid-2" style="margin-bottom: 2rem;">`;

            validCodes.forEach(code => {
                const info = db[code];
                if (info) {
                    html += `
                        <div class="related-card">
                            <div>
                                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.4rem;">
                                    <span style="font-weight: 800; color: var(--primary-color); font-size: 1.15rem; font-family: var(--font-heading);">CPT ${info.code}</span>
                                    <span style="font-size: 0.85rem; color: #059669; font-weight: 700; background: #ecfdf5; padding: 2px 8px; border-radius: 9999px;">$${info.price_low} – $${info.price_high}</span>
                                </div>
                                <h4 style="font-size: 1.05rem; margin-bottom: 0.35rem; color: var(--secondary-color);">${info.title}</h4>
                                <span class="badge" style="background: #e2e8f0; color: #475569; font-size: 0.75rem; margin-bottom: 0.75rem;">${info.category}</span>
                                ${info.misunderstood ? '<p style="font-size: 0.8rem; color: #b45309; background: #fffbeb; padding: 4px 8px; border-radius: 4px; margin-bottom: 0.75rem;">⚠️ Frequently misunderstood code or surprise facility charge.</p>' : ''}
                            </div>
                            <a href="cpt/${info.code}.html" class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.5rem 1rem; text-align: center; border-color: var(--primary-color); color: var(--primary-color); background: #f0f7ff; margin-top: 0.75rem;">View Full CPT ${info.code} Guide &rarr;</a>
                        </div>`;
                } else {
                    html += `
                        <div class="related-card">
                            <div>
                                <span style="font-weight: 800; color: var(--primary-color); font-size: 1.15rem; font-family: var(--font-heading);">Code ${code}</span>
                                <h4 style="font-size: 1rem; margin: 0.35rem 0; color: var(--secondary-color);">Detected Billing Code</h4>
                                <p style="font-size: 0.85rem; color: #64748b;">This 5-digit code was found in your bill text. Verify with billing whether this is a hospital procedure, lab test, or HCPCS modifier.</p>
                            </div>
                            <a href="codes.html" class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.5rem 1rem; text-align: center; margin-top: 0.75rem;">Browse Code Directory &rarr;</a>
                        </div>`;
                }
            });

            html += `</div>`;
        }

        // Educational Terms Check
        const terms = [
            { term: 'allowed amount', desc: 'The maximum contracted rate your health insurer agreed to pay for this procedure. In-network doctors cannot legally bill you above this figure.' },
            { term: 'deductible', desc: 'The annual amount you must pay 100% out of your own pocket before your insurance starts sharing costs.' },
            { term: 'coinsurance', desc: 'The percentage split (e.g. you pay 20%, insurance pays 80%) you owe after meeting your deductible.' },
            { term: 'copay', desc: 'A fixed flat fee (e.g. $25 for a specialist, $150 for the ER) due at the time of service.' },
            { term: 'out-of-pocket maximum', desc: 'The absolute cap on what you have to pay for covered services in a plan year. Once reached, insurance pays 100%.' },
            { term: 'facility fee', desc: 'A separate overhead charge billed by hospitals for simply walking through their doors, often distinct from the doctor’s bill.' },
            { term: 'prior authorization', desc: 'Pre-approval required from insurance before certain scans, surgeries, or medications are covered.' }
        ];

        let foundTerms = [];
        terms.forEach(item => {
            if (text.toLowerCase().includes(item.term)) {
                foundTerms.push(item);
            }
        });

        if (foundTerms.length > 0) {
            html += `
                <div style="background: #fff; border: 1px solid var(--border-color); border-radius: 10px; padding: 1.5rem; margin-top: 2rem;">
                    <h4 style="font-size: 1.15rem; color: var(--secondary-color); margin-bottom: 1rem;">Insurance Terms Found in Your Statement:</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                        ${foundTerms.map(item => `
                            <div style="background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                                <strong style="color: var(--primary-color); font-size: 0.95rem;">${capitalize(item.term)}</strong>
                                <p style="font-size: 0.85rem; color: #475569; margin-top: 0.35rem; line-height: 1.45;">${item.desc}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>`;
        }

        // Action Steps Box
        html += `
            <div style="background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%); border-left: 6px solid var(--primary-color); padding: 1.5rem; border-radius: 8px; margin-top: 2rem;">
                <h4 style="color: var(--secondary-color); margin-bottom: 0.5rem; font-size: 1.1rem;">Next Steps to Protect Your Wallet</h4>
                <p style="font-size: 0.9rem; color: #334155; margin-bottom: 1rem;">Always ask for an <strong>Itemized Bill with CPT codes</strong> and compare it with your insurance <strong>Explanation of Benefits (EOB)</strong> before paying any balance.</p>
                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                    <a href="insurance-eob-explained.html" class="btn btn-primary" style="font-size: 0.85rem;">Open EOB Discrepancy Calculator</a>
                    <a href="bill-dispute-guide.html" class="btn btn-secondary" style="font-size: 0.85rem;">Read Bill Dispute Guide</a>
                </div>
            </div>`;

        resultsArea.innerHTML = html;
        resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Dispatch GA4 custom event for bill analysis
        if (window.trackGA4Event) {
            window.trackGA4Event('analyze_bill', {
                event_category: 'tool_usage',
                trigger_source: triggerSource,
                codes_count: validCodes.length,
                known_codes_count: knownCount,
                has_duplicates: duplicates.length > 0,
                estimated_total_low: totalLow,
                estimated_total_high: totalHigh,
                input_character_count: text.length
            });
        }
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});

// GA4 Event Tracking for CTA clicks
document.addEventListener("DOMContentLoaded", function () {
    const explainBtn = document.getElementById("explain-bill-btn");

    if (explainBtn) {
        explainBtn.addEventListener("click", function () {
            if (window.trackGA4Event) {
                window.trackGA4Event('explain_bill_click', {
                    event_category: 'conversion',
                    event_label: 'Explain Medical Bill Hero CTA'
                });
            }
        });
    }
});
