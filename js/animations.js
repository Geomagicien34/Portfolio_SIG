const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll(
        '.project-content, .project-visual, .stack-item, .contact-container'
    );
    
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });
    
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

let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    document.querySelectorAll('.project-image').forEach((img, index) => {
        const speed = 0.3;
        const yPos = scrollY * speed;
        img.style.transform = `translateY(${yPos * (index % 2 === 0 ? 1 : -1)}px) scale(1.1)`;
    });
    
    lastScrollY = scrollY;
});