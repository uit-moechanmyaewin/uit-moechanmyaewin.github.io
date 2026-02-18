/* ============================================
   PHYOE DHANA - Animations JavaScript
   Custom Cursor, Parallax & Advanced FX
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // CUSTOM CURSOR
    // ============================================
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');

    if (cursor && follower && window.innerWidth > 768) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX - 4 + 'px';
            cursor.style.top = mouseY - 4 + 'px';
        });

        function animateFollower() {
            followerX += (mouseX - followerX - 18) * 0.12;
            followerY += (mouseY - followerY - 18) * 0.12;
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .gallery-item, .work-card, .nav-link, .social-link, .btn, .stat-item, .donation-amounts span');
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                follower.classList.add('hovering');
                cursor.style.transform = 'scale(0.5)';
            });
            target.addEventListener('mouseleave', () => {
                follower.classList.remove('hovering');
                cursor.style.transform = 'scale(1)';
            });
        });
    }

    // ============================================
    // PARALLAX EFFECTS
    // ============================================
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (parallaxElements.length > 0 && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.3;
                const yPos = -(scrollY * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        }, { passive: true });
    }

    // Parallax on hero bg
    const heroBg = document.querySelector('.hero-image-bg');
    if (heroBg && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            const heroHeight = document.querySelector('.hero')?.offsetHeight || 800;
            if (scrollY < heroHeight) {
                heroBg.style.transform = `scale(${1 + scrollY * 0.0001}) translateY(${scrollY * 0.3}px)`;
            }
        }, { passive: true });
    }

    // ============================================
    // MAGNETIC BUTTONS
    // ============================================
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-ghost, .btn-support, .back-to-top');

    if (window.innerWidth > 768) {
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ============================================
    // TILT EFFECT ON CARDS
    // ============================================
    const tiltCards = document.querySelectorAll('.work-card, .mv-embed-card, .cta-card');

    if (window.innerWidth > 768) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const tiltX = (y - 0.5) * 6;
                const tiltY = (x - 0.5) * -6;
                card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ============================================
    // SMOOTH SCROLLING ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // ============================================
    // MOUSE TRAIL PARTICLES (hero section)
    // ============================================
    const hero = document.querySelector('.hero');

    if (hero && window.innerWidth > 768) {
        let trailTimeout;
        hero.addEventListener('mousemove', (e) => {
            clearTimeout(trailTimeout);
            trailTimeout = setTimeout(() => {
                createTrailParticle(e.clientX, e.clientY);
            }, 50);
        });

        function createTrailParticle(x, y) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 4px;
                height: 4px;
                background: var(--color-accent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 5;
                opacity: 0.6;
                transition: all 1.5s ease-out;
            `;
            document.body.appendChild(particle);

            requestAnimationFrame(() => {
                particle.style.opacity = '0';
                particle.style.transform = `translate(${(Math.random() - 0.5) * 60}px, ${-Math.random() * 80 - 20}px) scale(0)`;
            });

            setTimeout(() => particle.remove(), 1500);
        }
    }

    // Nav highlighting handled in main.js (single scroll handler)

    // ============================================
    // GALLERY HOVER SOUND EFFECT (visual)
    // ============================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.zIndex = '5';
        });
        item.addEventListener('mouseleave', () => {
            item.style.zIndex = '';
        });
    });

    // ============================================
    // SCROLL-LINKED RECORDING TIME
    // ============================================
    const recTimeEl = document.querySelector('.rec-time');
    if (recTimeEl && window.innerWidth > 768) {
        let startTime = Date.now();
        setInterval(() => {
            const elapsed = Date.now() - startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            const frames = Math.floor((elapsed % 1000) / 41.67);
            recTimeEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
        }, 200);
    }

    // ============================================
    // DONATION AMOUNT INTERACTIVITY
    // ============================================
    const donationAmounts = document.querySelectorAll('.donation-amounts span');
    donationAmounts.forEach(amount => {
        amount.addEventListener('click', () => {
            donationAmounts.forEach(a => a.style.borderColor = '');
            amount.style.borderColor = 'var(--color-accent)';
        });
    });

    // Scroll performance handled by unified handler in main.js

});
