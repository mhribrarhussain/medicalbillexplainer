document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.nav-links');
    const activeLink = nav?.querySelector('.active');

    if (nav && activeLink && nav.scrollWidth > nav.clientWidth) {
        activeLink.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }
});
