/* ============================================
   PHYOE DHANA - Main JavaScript
   Core Functionality & Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // PRELOADER - Film Leader Countdown (5 to 1)
    // ============================================
    const preloader = document.querySelector('.preloader');
    const countdownNum = document.getElementById('countdownNum');
    let count = 5;

    function updateCountdown() {
        if (countdownNum) countdownNum.textContent = count;
        if (count > 1) {
            count--;
            setTimeout(updateCountdown, 900);
        } else {
            setTimeout(() => {
                if (preloader) {
                    preloader.classList.add('hidden');
                    document.body.style.overflow = '';
                    initPostLoad();
                }
            }, 500);
        }
    }

    document.body.style.overflow = 'hidden';
    setTimeout(updateCountdown, 300);

    function initPostLoad() {
        triggerCameraFlash();
        initScrollReveal();
        initSectionVisibility();
    }

    // ============================================
    // NAVIGATION
    // ============================================
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link:not(.support-link)');

    // Single unified scroll handler (perf: only one listener)
    let scrollTicking = false;
    const sections = document.querySelectorAll('section[id]');

    function onScroll() {
        if (scrollTicking) return;
        scrollTicking = true;
        requestAnimationFrame(() => {
            const currentScroll = window.pageYOffset;

            // Navbar scroll effect
            if (navbar) {
                navbar.classList.toggle('scrolled', currentScroll > 80);
            }

            // Scroll progress
            updateScrollProgress();

            // Back to top
            updateBackToTop();

            // Active nav tracking
            const scrollY = currentScroll + 200;
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (navLink) {
                    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                        navLinks.forEach(l => l.classList.remove('active'));
                        navLink.classList.add('active');
                    }
                }
            });

            scrollTicking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                if (navMenu) navMenu.classList.remove('active');
                if (navToggle) navToggle.classList.remove('active');
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // ============================================
    // SCROLL PROGRESS BAR
    // ============================================
    const scrollProgress = document.querySelector('.scroll-progress');
    function updateScrollProgress() {
        if (!scrollProgress) return;
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = progress + '%';
    }

    // ============================================
    // BACK TO TOP
    // ============================================
    const backToTop = document.querySelector('.back-to-top');
    function updateBackToTop() {
        if (!backToTop) return;
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================================
    // LIGHTBOX
    // ============================================
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    let currentGalleryIndex = -1;

    function updateLightbox(index) {
        const item = galleryItems[index];
        if (!item || !lightboxImage) return;

        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption');
        if (!img) return;

        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        if (lightboxCaption) {
            lightboxCaption.textContent = caption ? caption.textContent : (item.dataset.caption || img.alt || '');
        }
        currentGalleryIndex = index;
    }

    function openLightbox(index) {
        if (!lightbox) return;
        updateLightbox(index);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function navigateLightbox(step) {
        if (!galleryItems.length) return;
        const total = galleryItems.length;
        const nextIndex = (currentGalleryIndex + step + total) % total;
        updateLightbox(nextIndex);
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            currentGalleryIndex = -1;
        }
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox(-1);
        });
    }
    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox(1);
        });
    }
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            return;
        }
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // ============================================
    // TIMECODE & FRAME COUNTER
    // ============================================
    const timecodeEl = document.querySelector('.vf-timecode');
    const frameCounterEl = document.querySelector('.frame-counter');
    let frameCount = 0;

    function updateTimecode() {
        if (!timecodeEl) return;
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const frames = String(Math.floor(now.getMilliseconds() / 41.67)).padStart(2, '0');
        timecodeEl.textContent = `${hours}:${minutes}:${seconds}:${frames}`;
    }

    function updateFrameCounter() {
        if (!frameCounterEl) return;
        frameCount = (frameCount + 1) % 100000;
        frameCounterEl.textContent = `FRM ${String(frameCount).padStart(5, '0')}`;
    }

    // Only run timers on desktop (hidden on mobile anyway)
    if (window.innerWidth > 768) {
        setInterval(updateTimecode, 200);
        setInterval(updateFrameCounter, 200);
    }

    // ============================================
    // CAMERA FLASH
    // ============================================
    const cameraFlash = document.querySelector('.camera-flash');

    function triggerCameraFlash() {
        if (!cameraFlash) return;
        cameraFlash.classList.add('active');
        setTimeout(() => cameraFlash.classList.remove('active'), 500);
    }

    // ============================================
    // SECTION VISIBILITY (for animations)
    // ============================================
    function initSectionVisibility() {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('section:not(.hero)').forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // ============================================
    // SCROLL REVEAL
    // ============================================
    function initScrollReveal() {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

        // Reveal elements
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate').forEach(el => {
            revealObserver.observe(el);
        });

        // Work cards
        document.querySelectorAll('.work-card').forEach((card, i) => {
            card.style.transitionDelay = `${i * 0.15}s`;
            revealObserver.observe(card);
        });

        // Gallery items
        document.querySelectorAll('.gallery-item').forEach((item, i) => {
            item.style.transitionDelay = `${i * 0.1}s`;
            revealObserver.observe(item);
        });

        // MV cards
        document.querySelectorAll('.mv-embed-card').forEach((card, i) => {
            card.style.transitionDelay = `${i * 0.12}s`;
            revealObserver.observe(card);
        });

        // Section headers
        document.querySelectorAll('.section-header').forEach(header => {
            revealObserver.observe(header);
        });

        // Timeline
        document.querySelectorAll('.about-timeline').forEach(tl => {
            revealObserver.observe(tl);
        });

        // Stagger enter
        document.querySelectorAll('.stagger-enter').forEach(el => {
            revealObserver.observe(el);
        });

        // Quote
        const quoteEl = document.querySelector('.quote');
        if (quoteEl) {
            const quoteObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('quote-visible');
                    }
                });
            }, { threshold: 0.3 });
            quoteObserver.observe(quoteEl);
        }

        // Image reveal
        const aboutImage = document.querySelector('.about-image');
        if (aboutImage) {
            const imgObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('image-revealed');
                    }
                });
            }, { threshold: 0.3 });
            imgObserver.observe(aboutImage);
        }
    }

    // ============================================
    // HERO PARTICLES (CSS-only, created via JS)
    // ============================================
    // Only create particles on desktop
    if (window.innerWidth > 768) {
        const heroParticles = document.querySelector('.hero-particles');
        if (heroParticles) {
            for (let i = 0; i < 8; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                heroParticles.appendChild(particle);
            }
        }
    }

    // ============================================
    // COUNTER ANIMATION
    // ============================================
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            if (isNaN(target)) return;
            const suffix = counter.textContent.replace(/[0-9]/g, '');
            let current = 0;
            const increment = target / 60;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current) + suffix;
            }, 25);
        });
    }

    // Trigger counters when stats section is visible
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }

    // ============================================
    // FILMMAKER EFFECTS - Letterbox on scroll
    // ============================================
    const letterboxTop = document.querySelector('.letterbox-top');
    const letterboxBottom = document.querySelector('.letterbox-bottom');

    if (letterboxTop && letterboxBottom) {
        let letterboxTimeout;
        window.addEventListener('scroll', () => {
            letterboxTop.classList.add('active');
            letterboxBottom.classList.add('active');
            clearTimeout(letterboxTimeout);
            letterboxTimeout = setTimeout(() => {
                letterboxTop.classList.remove('active');
                letterboxBottom.classList.remove('active');
            }, 200);
        }, { passive: true });
    }

    // ============================================
    // SELF-HOSTED VIDEO CARDS & LIGHTBOX
    // ============================================
    const mvCards = Array.from(document.querySelectorAll('[data-mv-card]'));
    
    // 1. Scroll-to-play previews
    if (mvCards.length > 0 && 'IntersectionObserver' in window) {
        const MAX_PLAYING = 3;
        const playing = new Set();
        const ratios = new Map();
        
        const applyPreviews = () => {
            const keep = new Set(
                [...ratios.entries()]
                    .filter(([, r]) => r > 0)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, MAX_PLAYING)
                    .map(([c]) => c)
            );
            
            for (const card of mvCards) {
                const video = card.querySelector('.mv-preview');
                if (!video) continue;
                
                if (keep.has(card)) {
                    if (!playing.has(card)) {
                        if (!video.src) video.src = video.dataset.previewSrc;
                        video.play().then(() => card.classList.add('is-previewing')).catch(() => {});
                        playing.add(card);
                    }
                } else {
                    if (playing.has(card)) {
                        card.classList.remove('is-previewing');
                        video.pause();
                        playing.delete(card);
                    }
                }
            }
        };

        const previewObserver = new IntersectionObserver((entries) => {
            for (const e of entries) {
                ratios.set(e.target, e.isIntersecting ? e.intersectionRatio : 0);
            }
            applyPreviews();
        }, { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] });

        mvCards.forEach(card => previewObserver.observe(card));
    }

    // 2. Video Lightbox Logic
    const vlb = document.getElementById('videoLightbox');
    if (vlb) {
        const vlbStage = vlb.querySelector('[data-vlb-stage]');
        const vlbTitle = vlb.querySelector('[data-vlb-title]');
        const vlbYtLink = vlb.querySelector('[data-vlb-ytlink]');
        const vlbCounter = vlb.querySelector('[data-vlb-counter]');
        const btnPrev = vlb.querySelector('[data-vlb-prev]');
        const btnNext = vlb.querySelector('[data-vlb-next]');
        
        let currentIdx = 0;
        
        const loadVideo = (idx) => {
            currentIdx = idx;
            const card = mvCards[idx];
            const dataset = card.dataset;
            
            vlbStage.innerHTML = '';
            
            const video = document.createElement('video');
            video.src = dataset.video;
            video.poster = dataset.poster;
            video.controls = true;
            video.autoplay = true;
            video.playsInline = true;
            video.muted = false; // Start with sound since user clicked to open
            
            vlbStage.appendChild(video);
            
            vlbTitle.textContent = dataset.title;
            vlbYtLink.href = dataset.youtube;
            vlbCounter.textContent = `${idx + 1} / ${mvCards.length}`;
            vlbCounter.hidden = mvCards.length <= 1;
            
            btnPrev.hidden = mvCards.length <= 1;
            btnNext.hidden = mvCards.length <= 1;
        };
        
        const openLightbox = (idx) => {
            loadVideo(idx);
            vlb.hidden = false;
            document.body.style.overflow = 'hidden'; // prevent scroll
            setTimeout(() => vlb.classList.add('is-open'), 10);
        };
        
        const closeLightbox = () => {
            vlb.classList.remove('is-open');
            document.body.style.overflow = '';
            setTimeout(() => {
                vlb.hidden = true;
                vlbStage.innerHTML = ''; // Stop video
            }, 300);
        };
        
        const navNext = () => loadVideo((currentIdx + 1) % mvCards.length);
        const navPrev = () => loadVideo((currentIdx - 1 + mvCards.length) % mvCards.length);
        
        mvCards.forEach((card, idx) => {
            const clickArea = card.querySelector('.mv-embed-wrapper') || card.querySelector('.work-thumbnail');
            if(clickArea) {
                clickArea.addEventListener('click', () => openLightbox(idx));
            }
        });
        
        vlb.querySelectorAll('[data-vlb-close]').forEach(btn => btn.addEventListener('click', closeLightbox));
        btnNext.addEventListener('click', navNext);
        btnPrev.addEventListener('click', navPrev);
        
        document.addEventListener('keydown', (e) => {
            if (vlb.hidden) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') navNext();
            if (e.key === 'ArrowLeft') navPrev();
        });
    }

    // ============================================
    // KEYBOARD ACCESSIBILITY
    // ============================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });

});
