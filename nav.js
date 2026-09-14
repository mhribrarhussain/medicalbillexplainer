// Safe Global GA4 Custom Event Dispatcher
window.trackGA4Event = function(eventName, params = {}) {
    if (typeof window.gtag === 'function') {
        try {
            window.gtag('event', eventName, params);
            if (window.location.search.includes('ga_debug=1')) {
                console.log(`[GA4 Event] ${eventName}:`, params);
            }
        } catch (e) {
            console.error('[GA4 Track Error]', e);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Active Navigation Pill Auto-Scroll
    const nav = document.querySelector('.nav-links');
    const activeLink = nav?.querySelector('.active');

    if (nav && activeLink && nav.scrollWidth > nav.clientWidth) {
        activeLink.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }

    // 2. Outbound Link Tracking (CMS, CFPB, No Surprises Act, AMA, etc.)
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link || !link.href) return;

        try {
            const url = new URL(link.href, window.location.origin);
            const isInternal = (url.origin === window.location.origin);
            if (!isInternal && !url.protocol.startsWith('mailto') && !url.protocol.startsWith('tel')) {
                window.trackGA4Event('outbound_resource_click', {
                    event_category: 'outbound_link',
                    link_url: url.href,
                    link_domain: url.hostname,
                    link_text: (link.textContent || '').trim().substring(0, 100)
                });
            }
        } catch (err) {}
    });

    // 3. FAQ Accordion Expand Tracking (<details> tags)
    document.querySelectorAll('details').forEach(detail => {
        detail.addEventListener('toggle', () => {
            if (detail.open) {
                const summary = detail.querySelector('summary');
                const questionText = summary ? summary.textContent.trim() : 'Unknown FAQ';
                window.trackGA4Event('faq_expand', {
                    event_category: 'engagement',
                    question: questionText.substring(0, 100)
                });
            }
        });
    });
});

