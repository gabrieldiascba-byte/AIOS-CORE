// Reveal on Scroll Animation
const reveal = () => {
    const reveals = document.querySelectorAll('.reveal');

    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const revealTop = reveals[i].getBoundingClientRect().top;
        const revealPoint = 150;

        if (revealTop < windowHeight - revealPoint) {
            reveals[i].classList.add('active');
        } else {
            reveals[i].classList.remove('active');
        }
    }
}

window.addEventListener('scroll', reveal);

// Initial Call to activate top elements
reveal();

// Smooth Navigation Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust offset for fixed header
                behavior: 'smooth'
            });
        }
    });
});

// Parallax Effect for Hero Glow (Optional)
window.addEventListener('mousemove', (e) => {
    const glow = document.querySelector('.hero-glow');
    if (glow) {
        let x = e.clientX * 0.05;
        let y = e.clientY * 0.05;
        glow.style.transform = `translate(${x}px, ${y}px)`;
    }
});
