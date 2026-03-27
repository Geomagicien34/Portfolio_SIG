/**
 * ============================================
 * ANIMATIONS.JS - Portfolio Géomaticien
 * ============================================
 */

// Attend que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
    animateHeroTitle();  // Lance l'animation du titre
});

/**
 * Anime le titre du hero en décomposant chaque lettre
 * avec un délai progressif pour un effet de révélation
 */
function animateHeroTitle() {
    // Sélectionne toutes les lignes du titre
    const titleLines = document.querySelectorAll('.hero-title .title-line');

    titleLines.forEach((line, lineIndex) => {
        // Sauvegarde le texte original
        const text = line.textContent;

        // Vide la ligne pour y insérer les spans
        line.textContent = '';
        line.classList.add('split-text');

        // Crée un span pour chaque caractère
        text.split('').forEach((char, charIndex) => {
            const span = document.createElement('span');
            span.classList.add('char');

            // Remplace les espaces par des espaces insécables
            span.textContent = char === ' ' ? '\u00A0' : char;

            // Ajoute un délai progressif pour chaque caractère
            span.style.transitionDelay = `${(lineIndex * 0.5) + (charIndex * 0.03)}s`;
            line.appendChild(span);
        });
    });

    // Active l'animation après un petit délai
    setTimeout(() => {
        document.querySelectorAll('.split-text').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);
}


// ============================================
// CURSEUR PERSONNALISÉ (Desktop uniquement)
// ============================================

// Vérifie si l'écran est un desktop (pointeur fin)
if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.querySelector('.cursor');        // Point central
    const follower = document.querySelector('.cursor-follower'); // Cercle suiveur

    if (cursor && follower) {
        // Suit la position de la souris
        document.addEventListener('mousemove', (e) => {
            // Positionne le curseur principal instantanément
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';

            // Le cercle suit avec un léger retard
            setTimeout(() => {
                follower.style.left = e.clientX + 'px';
                follower.style.top = e.clientY + 'px';
            }, 80);
        });
    }
}
