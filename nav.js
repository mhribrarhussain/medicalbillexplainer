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
const menuBtn = document.querySelector('.mobile-menu-btn');
const drawer = document.querySelector('.mobile-nav-drawer');
const backdrop = document.querySelector('.mobile-nav-backdrop');
const closeBtn = document.querySelector('.mobile-drawer-close');
function openMobileDrawer() {
if (!drawer || !backdrop) return;
drawer.classList.add('open');
backdrop.classList.add('open');
document.body.style.overflow = 'hidden';
if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
window.trackGA4Event('mobile_nav_open', { event_category: 'navigation' });
}
function closeMobileDrawer() {
if (!drawer || !backdrop) return;
drawer.classList.remove('open');
backdrop.classList.remove('open');
document.body.style.overflow = '';
if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
}
if (menuBtn) {
menuBtn.addEventListener('click', (e) => {
e.stopPropagation();
if (drawer && drawer.classList.contains('open')) {
closeMobileDrawer();
} else {
openMobileDrawer();
}
});
}
if (closeBtn) {
closeBtn.addEventListener('click', closeMobileDrawer);
}
if (backdrop) {
backdrop.addEventListener('click', closeMobileDrawer);
}
document.addEventListener('keydown', (e) => {
if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
closeMobileDrawer();
}
});
if (drawer) {
drawer.querySelectorAll('a').forEach(link => {
link.addEventListener('click', closeMobileDrawer);
});
}
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