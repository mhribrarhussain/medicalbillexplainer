// Helper returning standard responsive site header with mobile drawer
// relPrefix is "" for root pages, "../" for /cpt/ pages
function renderSiteHeader(activePage = '', relPrefix = '') {
  return `
    <header class="site-header">
        <div class="nav-container">
            <a href="${relPrefix}index.html" class="logo">
                <img src="${relPrefix}favicon.svg" alt="Medical Bill Explainer Logo" class="logo-mark" width="34" height="34">
                <span class="logo-text">Medical Bill <span class="logo-accent">Explainer</span></span>
            </a>
            <nav class="nav-links">
                <a href="${relPrefix}codes.html"${activePage === 'codes' ? ' class="active"' : ''}>CPT Directory</a>
                <a href="${relPrefix}medical-bill-explainer.html"${activePage === 'explainer' ? ' class="active"' : ''}>Bill Explainer</a>
                <a href="${relPrefix}how-to-read-an-eob.html"${activePage === 'eob-guide' ? ' class="active"' : ''}>EOB Guide</a>
                <a href="${relPrefix}insurance-eob-explained.html"${activePage === 'calculator' ? ' class="active"' : ''}>EOB Calculator</a>
                <a href="${relPrefix}bill-dispute-guide.html"${activePage === 'dispute' ? ' class="active"' : ''}>Dispute Guide</a>
                <a href="${relPrefix}about.html"${activePage === 'about' ? ' class="active"' : ''}>About</a>
            </nav>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <a href="${relPrefix}medical-bill-explainer.html" class="nav-cta-btn">
                    <span>⚡ Explain My Bill</span>
                </a>
                <button class="mobile-menu-btn" aria-label="Open Navigation Menu" aria-expanded="false">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
            </div>
        </div>
    </header>

    <!-- Mobile Slide Drawer Backdrop -->
    <div class="mobile-nav-backdrop" aria-hidden="true"></div>

    <!-- Mobile Slide Drawer -->
    <aside class="mobile-nav-drawer" aria-label="Mobile Navigation">
        <div class="mobile-drawer-header">
            <a href="${relPrefix}index.html" class="logo" style="font-size: 1.15rem;">
                <img src="${relPrefix}favicon.svg" alt="Logo" class="logo-mark" width="30" height="30">
                <span class="logo-text">Medical Bill <span class="logo-accent">Explainer</span></span>
            </a>
            <button class="mobile-drawer-close" aria-label="Close Navigation Menu">&times;</button>
        </div>
        <div class="mobile-drawer-body">
            <div class="mobile-drawer-section-title">Core Interactive Tools</div>
            <a href="${relPrefix}medical-bill-explainer.html" class="drawer-link${activePage === 'explainer' ? ' active' : ''}">
                <span class="drawer-icon">🔍</span>
                <span>Bill Explainer &amp; Scanner</span>
            </a>
            <a href="${relPrefix}insurance-eob-explained.html" class="drawer-link${activePage === 'calculator' ? ' active' : ''}">
                <span class="drawer-icon">⚖️</span>
                <span>EOB vs. Bill Calculator</span>
            </a>
            <a href="${relPrefix}codes.html" class="drawer-link${activePage === 'codes' ? ' active' : ''}">
                <span class="drawer-icon">📋</span>
                <span>Browse 57 CPT Codes</span>
            </a>

            <div class="mobile-drawer-section-title">Patient Billing Guides</div>
            <a href="${relPrefix}how-to-read-an-eob.html" class="drawer-link${activePage === 'eob-guide' ? ' active' : ''}">
                <span class="drawer-icon">📖</span>
                <span>How to Read an EOB</span>
            </a>
            <a href="${relPrefix}bill-dispute-guide.html" class="drawer-link${activePage === 'dispute' ? ' active' : ''}">
                <span class="drawer-icon">🛡️</span>
                <span>Dispute Guide &amp; Letters</span>
            </a>

            <div class="mobile-drawer-section-title">About &amp; Trust</div>
            <a href="${relPrefix}about.html" class="drawer-link${activePage === 'about' ? ' active' : ''}">
                <span class="drawer-icon">ℹ️</span>
                <span>About &amp; Editorial Standards</span>
            </a>
        </div>
        <div class="mobile-drawer-footer">
            <a href="${relPrefix}medical-bill-explainer.html" class="btn btn-primary drawer-cta">
                ⚡ Explain My Medical Bill
            </a>
        </div>
    </aside>`;
}

module.exports = { renderSiteHeader };
