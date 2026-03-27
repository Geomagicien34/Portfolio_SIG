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

    // === THEME CLAIR/SOMBRE ===
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = themeBtn?.querySelector('.theme-icon');

// Mode sombre par défaut, sauvegarde le choix de l'utilisateur
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
if (themeIcon) themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeBtn?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next); // mémorise le choix
    if (themeIcon) themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
});

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
/*
    const sections = document.querySelectorAll('[data-color]');
    const colorObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.body.style.backgroundColor = entry.target.dataset.color;
            }
        });
    }, { threshold: 0.5 });
    sections.forEach(section => colorObserver.observe(section));
*/


});