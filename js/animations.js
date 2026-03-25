document.addEventListener('DOMContentLoaded', () => {
    animateHeroTitle();
});

function animateHeroTitle() {
    const titleLines = document.querySelectorAll('.hero-title .title-line');
    titleLines.forEach((line, lineIndex) => {
        const text = line.textContent;
        line.textContent = '';
        line.classList.add('split-text');
        text.split('').forEach((char, charIndex) => {
            const span = document.createElement('span');
            span.classList.add('char');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.transitionDelay = `${(lineIndex * 0.5) + (charIndex * 0.03)}s`;
            line.appendChild(span);
        });
    });
    setTimeout(() => {
        document.querySelectorAll('.split-text').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);
}

// Curseur - desktop uniquement
if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if (cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            setTimeout(() => {
                follower.style.left = e.clientX + 'px';
                follower.style.top = e.clientY + 'px';
            }, 80);
        });
    }
}