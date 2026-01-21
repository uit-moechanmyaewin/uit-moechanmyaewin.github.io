/* ============================================
   PHYOE DHANA - Animations JavaScript
   ============================================ */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCustomCursor();
    initScrollReveal();
    initParallax();
    initSplitText();
});

/* ============================================
   PRELOADER
   ============================================ */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'auto';
            
            // Trigger hero animations after preloader
            animateHero();
        }, 1500);
    });
}

/* ============================================
   CUSTOM CURSOR
   ============================================ */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;
    
    // Check if it's a touch device
    if ('ontouchstart' in window) {
        cursor.style.display = 'none';
        follower.style.display = 'none';
        return;
    }
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function animateCursor() {
        // Cursor follows mouse directly
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        
        // Follower has more lag
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursor.style.left = `${cursorX - 6}px`;
        cursor.style.top = `${cursorY - 6}px`;
        
        follower.style.left = `${followerX - 20}px`;
        follower.style.top = `${followerY - 20}px`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .work-card, .btn');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.classList.add('hovering');
            cursor.style.transform = 'scale(1.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            follower.classList.remove('hovering');
            cursor.style.transform = 'scale(1)';
        });
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
    });
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.section-header, .about-image-wrapper, .about-text, .work-card, ' +
        '.ongoing-content > *, .support-text, .cta-card, .stat-item'
    );
    
    // Add reveal class to elements
    revealElements.forEach(el => {
        el.classList.add('reveal');
    });
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => observer.observe(el));
}

/* ============================================
   PARALLAX EFFECTS
   ============================================ */
function initParallax() {
    const parallaxElements = document.querySelectorAll('.about-bg-text, .works-bg-element');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(el => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    });
}

/* ============================================
   HERO ANIMATIONS
   ============================================ */
function animateHero() {
    // The CSS handles the initial animations
    // This function can be extended for more complex animations
    
    // Add subtle floating animation to film strips
    const filmStrips = document.querySelectorAll('.film-strip');
    filmStrips.forEach((strip, index) => {
        strip.style.animation = `float ${6 + index}s ease-in-out infinite`;
    });
}

/* ============================================
   SPLIT TEXT ANIMATION
   ============================================ */
function initSplitText() {
    const splitElements = document.querySelectorAll('.split-text-animate');
    
    splitElements.forEach(el => {
        const text = el.textContent;
        el.innerHTML = '';
        
        [...text].forEach((char, index) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.style.animationDelay = `${index * 0.05}s`;
            span.textContent = char === ' ' ? '\u00A0' : char;
            el.appendChild(span);
        });
    });
}

/* ============================================
   MAGNETIC BUTTON EFFECT
   ============================================ */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-magnetic');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

/* ============================================
   TILT EFFECT FOR CARDS
   ============================================ */
function initTiltEffect() {
    const tiltCards = document.querySelectorAll('.work-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

/* ============================================
   INITIALIZE ON SCROLL (for performance)
   ============================================ */
let tiltInitialized = false;
let magneticInitialized = false;

window.addEventListener('scroll', () => {
    if (!tiltInitialized && window.pageYOffset > 500) {
        initTiltEffect();
        tiltInitialized = true;
    }
    
    if (!magneticInitialized && window.pageYOffset > 300) {
        initMagneticButtons();
        magneticInitialized = true;
    }
}, { passive: true });

/* ============================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ============================================
   EXPORT FUNCTIONS FOR USE IN OTHER FILES
   ============================================ */
window.PhyoeAnimations = {
    initPreloader,
    initCustomCursor,
    initScrollReveal,
    initParallax,
    initSplitText,
    initMagneticButtons,
    initTiltEffect,
    animateCounter
};
