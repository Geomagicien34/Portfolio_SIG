/**
 * ============================================
 * MAIN.JS - Portfolio Géomaticien
 * ============================================
 */

// Attend que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // GESTION DE LA LANGUE (FR / EN)
    // ============================================

    /** Bouton de changement de langue */
    const langBtn = document.querySelector('.lang-btn');

    /** Récupère le chemin de la page actuelle */
    const currentPage = window.location.pathname;

    /** Vérifie si on est sur la page anglaise */
    const isEnglishPage = currentPage.includes('/en/');

    // Si page anglaise, mémorise la langue et corrige les liens Home
    if (isEnglishPage) {
        localStorage.setItem('lang', 'en');

        // Corrige les liens "Accueil" pour pointer vers la version anglaise
        document.querySelectorAll('.menu-link[href*="index"]').forEach(link => {
            const href = link.getAttribute('href');
            if (href === '../index.html' || href === '../../index.html') {
                link.setAttribute('href', '../../index.html');
            }
        });
    }

    // Au clic sur le bouton de langue
    langBtn?.addEventListener('click', () => {
        // Bascule entre FR et EN dans le localStorage
        if (currentPage.includes('/en/')) {
            localStorage.setItem('lang', 'fr');
        } else {
            localStorage.setItem('lang', 'en');
        }
    });


    // ============================================
    // MENU BURGER (Mobile)
    // ============================================

    const burger = document.getElementById('burger');   // Bouton hamburger
    const menu = document.getElementById('menu');       // Overlay du menu
    const menuClose = document.getElementById('menu-close'); // Bouton fermer

    // Ouvre/ferme le menu au clic sur le burger
    burger?.addEventListener('click', () => {
        menu.classList.toggle('active');
        burger.classList.toggle('open');
    });

    // Ferme le menu au clic sur le bouton fermer
    menuClose?.addEventListener('click', () => {
        menu.classList.remove('active');
        burger?.classList.remove('open');
    });

    // Ferme le menu au clic sur un lien
    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            burger?.classList.remove('open');
            document.body.style.overflow = '';
        });
    });


    // ============================================
    // THÈME CLAIR / SOMBRE
    // ============================================

    const themeBtn = document.getElementById('theme-toggle');         // Bouton thème
    const themeIcon = themeBtn?.querySelector('.theme-icon');         // Icône du bouton

    // Récupère le thème sauvegardé ou utilise "dark" par défaut
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Met à jour l'icône selon le thème actuel
    if (themeIcon) {
        themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }

    // Bascule entre thème clair et sombre
    themeBtn?.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';

        // Applique le nouveau thème
        document.documentElement.setAttribute('data-theme', next);

        // Sauvegarde dans localStorage
        localStorage.setItem('theme', next);

        // Met à jour l'icône
        if (themeIcon) {
            themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
        }
    });


    // ============================================
    // SCROLL RAPIDE (Ancres)
    // ============================================

    /** Scroll rapide vers les ancres (#section) avec offset pour le header fixe */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80; // Marge pour le header fixe
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'auto' // Instant scroll, plus rapide que smooth
                });
            }
        });
    });

    // ============================================
    // GESTION DU HEADER AU SCROLL
    // ============================================

    // Cache/montre le header selon la direction du scroll
    let lastScroll = 0;
    const header = document.querySelector('.nav');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header?.style.removeProperty('transform');
            return;
        }

        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scroll vers le bas = cache le header
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scroll vers le haut = montre le header
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

});
