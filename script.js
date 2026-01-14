document.addEventListener('DOMContentLoaded', () => {
    const billInput = document.getElementById('billInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultsArea = document.getElementById('resultsArea');

    if (!analyzeBtn || !billInput || !resultsArea) return;

    analyzeBtn.addEventListener('click', () => {
        const text = billInput.value;
        if (!text.trim()) {
            resultsArea.innerHTML = '<p style="color: red;">Please paste your bill text first.</p>';
            return;
        }

        analyzeBill(text);
    });

    function analyzeBill(text) {
        let findings = [];
        
        // CPT Code Regex (5 digits, or 4 digits + 1 letter/digit)
        // Adjusting regex to avoid capturing zip codes if possible, though hard without context.
        // We will match 5 digit numbers and check against our known database of descriptions (simulated here for client-side).
        // Since we can't load the full huge JSON client side easily without a build step mostly, 
        // we'll use a fetch or just look for the specific patterns we know are CPTs.
        // For this static site, we'll try to match standard CPT patterns.
        
        const cptRegex = /\b([0-9]{4}[0-9A-Z])\b/g;
        const potentialCodes = text.match(cptRegex) || [];
        const uniqueCodes = [...new Set(potentialCodes)];

        let html = '<h3>Analysis Results</h3>';

        if (uniqueCodes.length === 0) {
            html += '<p>No obvious CPT codes found. Look for 5-digit codes like "99213" or "80053".</p>';
        } else {
            html += '<p><strong>Found potential CPT Codes:</strong></p>';
            html += '<ul style="list-style: none; padding: 0;">';
            
            uniqueCodes.forEach(code => {
                // Link to our generated pages
                html += `<li style="margin-bottom: 10px; background: #f0f8ff; padding: 10px; border-radius: 4px;">
                    <strong>${code}</strong>: 
                    <a href="cpt/${code}.html" target="_blank" style="font-weight: bold;">Click to understand this code</a>
                </li>`;
            });
            html += '</ul>';
        }

        // Educational Terms Check
        const terms = [
            { term: 'deductible', desc: 'The amount you pay before insurance starts paying.' },
            { term: 'coinsurance', desc: 'The percentage (e.g., 20%) you pay after meeting your deductible.' },
            { term: 'copay', desc: 'A fixed fee (e.g., $20) you pay for a specific service.' },
            { term: 'allowed amount', desc: 'The maximum amount insurance will pay for a service.' },
            { term: 'out-of-pocket maximum', desc: 'The most you have to pay for covered services in a plan year.' }
        ];

        let foundTerms = [];
        terms.forEach(item => {
            if (text.toLowerCase().includes(item.term)) {
                foundTerms.push(item);
            }
        });

        if (foundTerms.length > 0) {
            html += '<h4 style="margin-top: 20px;">Common Terms Detected:</h4><dl>';
            foundTerms.forEach(item => {
                html += `<dt style="font-weight: bold; margin-top: 5px;">${capitalize(item.term)}</dt>`;
                html += `<dd style="margin-left: 20px;">${item.desc}</dd>`;
            });
            html += '</dl>';
        }

        resultsArea.innerHTML = html;
        resultsArea.scrollIntoView({ behavior: 'smooth' });
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
