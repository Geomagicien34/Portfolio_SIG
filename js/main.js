document.addEventListener('DOMContentLoaded', () => {

    // === MENU BURGER ===
    const burger = document.getElementById('burger');
    const menu = document.getElementById('menu');

    if (burger && menu) {
        burger.addEventListener('click', () => {
            menu.classList.toggle('active');
            burger.classList.toggle('open');
        });

        document.querySelectorAll('.menu-link').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                burger.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // === SCROLL FLUIDE ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // === COULEUR DE FOND AU SCROLL ===
    const sections = document.querySelectorAll('[data-color]');
    const colorObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.body.style.backgroundColor = entry.target.dataset.color;
            }
        });
    }, { threshold: 0.5 });
    sections.forEach(section => colorObserver.observe(section));

});