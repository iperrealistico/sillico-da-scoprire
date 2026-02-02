
/* ===================================
   🔧 FUNZIONALITÀ JAVASCRIPT
 =================================== */

const initApp = () => {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');

            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking on the menu overlay itself
        navMenu.addEventListener('click', (e) => {
            if (e.target === navMenu) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Close mobile menu when clicking outside toggle while menu is active
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active') && !navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href.startsWith('#')) return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced header background on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.9)';
                header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }
        }
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Active nav link highlighting
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 0;

            if (window.scrollY >= (sectionTop - headerHeight - 100)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Lightbox functionality for events (Global Scope)
    window.openLightbox = function (eventId) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');

        let eventImg = document.getElementById(eventId + '-img');
        if (!eventImg) eventImg = document.getElementById(eventId);

        if (eventImg && lightbox && lightboxImg) {
            lightboxImg.src = eventImg.src;
            lightboxImg.alt = eventImg.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Touch friendly: ensure the lightbox is centered and manageable
            lightbox.scrollTo(0, 0);
        }
    };

    window.closeLightbox = function () {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // Close lightbox handlers
    const lb = document.getElementById('lightbox');
    if (lb) {
        lb.addEventListener('click', (e) => {
            // Close if clicked on the overlay or the close span (X)
            if (e.target.id === 'lightbox' || e.target.classList.contains('lightbox-close')) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });

    /* --- FILTRI SENTIERI (UNIFIED) --- */
    const trailFilterButtons = document.querySelectorAll('.filter-btn, .filter-btn-duration');
    const trailCards = document.querySelectorAll('.trail-card');

    const updateTrailFilters = () => {
        const activeDifficultyBtn = document.querySelector('.filter-btn.active');
        const activeDurationBtn = document.querySelector('.filter-btn-duration.active');

        if (!activeDifficultyBtn || !activeDurationBtn) return;

        const activeDifficulty = activeDifficultyBtn.getAttribute('data-filter');
        const activeDuration = activeDurationBtn.getAttribute('data-duration');

        trailCards.forEach(card => {
            const difficolta = card.getAttribute('data-difficolta');
            const durationAttr = card.getAttribute('data-duration');
            const duration = durationAttr ? parseInt(durationAttr) : 0;

            let matchDifficulty = (activeDifficulty === 'all' || activeDifficulty === difficolta);
            let matchDuration = false;

            if (activeDuration === 'all') {
                matchDuration = true;
            } else if (activeDuration === 'short' && duration < 60) {
                matchDuration = true;
            } else if (activeDuration === 'medium' && duration >= 60 && duration <= 120) {
                matchDuration = true;
            } else if (activeDuration === 'long' && duration > 120) {
                matchDuration = true;
            }

            if (matchDifficulty && matchDuration) {
                card.style.display = 'block';
                if (card.style.opacity === '0' || !card.classList.contains('animated')) {
                    card.animate([
                        { opacity: 0, transform: 'translateY(10px)' },
                        { opacity: 1, transform: 'translateY(0)' }
                    ], {
                        duration: 300,
                        easing: 'ease-out'
                    });
                    card.classList.add('animated');
                }
            } else {
                card.style.display = 'none';
                card.classList.remove('animated');
            }
        });
    };

    if (trailFilterButtons.length > 0) {
        trailFilterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const siblingGroup = button.classList.contains('filter-btn') ? '.filter-btn' : '.filter-btn-duration';
                document.querySelectorAll(siblingGroup).forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                updateTrailFilters();
            });
        });
    }

    /* --- FILTRI OSPITALITÀ (BADGE STYLE) --- */
    const hospitalityButtons = document.querySelectorAll('.hospitality-filter-btn');
    const hospitalityItems = document.querySelectorAll('.stay-item');

    if (hospitalityButtons.length > 0) {
        hospitalityButtons.forEach(button => {
            button.addEventListener('click', () => {
                hospitalityButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterType = button.getAttribute('data-type');

                hospitalityItems.forEach(item => {
                    const type = item.getAttribute('data-type');

                    if (filterType === 'all' || filterType === type) {
                        item.style.display = 'flex';
                        item.animate([
                            { opacity: 0, scale: 0.95 },
                            { opacity: 1, scale: 1 }
                        ], {
                            duration: 300,
                            easing: 'ease-out'
                        });
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
};

// Start execution
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Add loading state management
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
