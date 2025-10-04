document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('closeBtn');
    const links = mobileNav ? mobileNav.querySelectorAll('a') : [];

    function toggleMenu() {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('show');
        overlay.classList.toggle('show');
    }

    if (hamburger && mobileNav && overlay && closeBtn) {
        hamburger.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);
        closeBtn.addEventListener('click', toggleMenu);
        links.forEach(link => link.addEventListener('click', toggleMenu));
    }
});
