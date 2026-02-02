
/* ===================================
   🔧 FUNZIONALITÀ JAVASCRIPT
=================================== */

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');

    // Prevent body scroll when menu is open
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

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
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
    if (window.scrollY > 50) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.9)';
        header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
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
        const headerHeight = document.querySelector('.header').offsetHeight;

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

    // Supporto sia per ID img diretto che per ID evento
    let eventImg = document.getElementById(eventId + '-img');
    if (!eventImg) eventImg = document.getElementById(eventId);

    if (eventImg) {
        lightboxImg.src = eventImg.src;
        lightboxImg.alt = eventImg.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeLightbox = function () {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
};

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Performance optimization: Debounced scroll handler
let scrollTimeout;
const handleScroll = () => {
    if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = requestAnimationFrame(() => {
        // Scroll-dependent operations here
    });
};

window.addEventListener('scroll', handleScroll, { passive: true });

// Preload critical images (when implemented)
const preloadImage = (src) => {
    const img = new Image();
    img.src = src;
};

// Add loading state management
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Enhanced touch handling for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', e => {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', e => {
    touchEndY = e.changedTouches[0].screenY;
}, { passive: true });


// =================================== 
// 🎪 LOGICA NUOVA: EVENTI & FILTRI
// ===================================

document.addEventListener('DOMContentLoaded', () => {

    /* --- FILTRI SENTIERI --- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const trailCards = document.querySelectorAll('.trail-card');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Rimuovi classe active da tutti i bottoni
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Aggiungi active al bottone cliccato
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                trailCards.forEach(card => {
                    const difficolta = card.getAttribute('data-difficolta');

                    if (filterValue === 'all' || filterValue === difficolta) {
                        card.style.display = 'block';
                        // Piccola animazione fade in
                        card.animate([
                            { opacity: 0, transform: 'translateY(10px)' },
                            { opacity: 1, transform: 'translateY(0)' }
                        ], {
                            duration: 300,
                            easing: 'ease-out'
                        });
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    /* --- PARSING EVENTI MARKDOWN --- */
    const eventsContainer = document.querySelector('.events-grid');

    if (eventsContainer) {
        // Mostra loader iniziale
        eventsContainer.innerHTML = '<div class="events-loading">Caricamento eventi...</div>';

        fetch('eventi.md')
            .then(response => {
                if (!response.ok) throw new Error('File eventi non trovato');
                return response.text();
            })
            .then(text => {
                const lines = text.split('\n').filter(line => line.trim() !== '');
                let eventCardsHtml = '';

                // Cerca righe tabella
                const tableLines = lines.filter(line => line.trim().startsWith('|'));

                // Salta header e separatore
                if (tableLines.length > 2) {
                    const contentLines = tableLines.slice(2);

                    contentLines.forEach((line, index) => {
                        const columns = line.split('|').map(col => col.trim()).filter(col => col !== '');

                        if (columns.length >= 4) {
                            const titolo = columns[0];
                            const data = columns[1];
                            const imgUrl = columns[2];
                            const descrizione = columns[3];
                            const eventId = `evento-md-${index}`;

                            // Crea card HTML
                            eventCardsHtml += `
                                <div class="event-card" onclick="openLightbox('${eventId}')">
                                    <div class="event-image">
                                        <img src="${imgUrl}" alt="${titolo}" id="${eventId}-img" class="img-placeholder" loading="lazy" onerror="this.onerror=null; this.parentElement.classList.add('img-placeholder'); this.parentElement.setAttribute('data-alt', '${titolo}');">
                                        <div class="event-date"><i class="fa-regular fa-calendar"></i> ${data}</div>
                                    </div>
                                    <div class="event-content">
                                        <h3>${titolo}</h3>
                                        <p>${descrizione}</p>
                                    </div>
                                </div>
                            `;
                        }
                    });

                    if (eventCardsHtml) {
                        eventsContainer.innerHTML = eventCardsHtml;
                    } else {
                        eventsContainer.innerHTML = '<p class="text-center">Nessun evento in programma al momento.</p>';
                    }
                }
            })
            .catch(error => {
                console.error('Errore caricamento eventi:', error);
                eventsContainer.innerHTML = '<div class="events-error"><i class="fa-solid fa-circle-exclamation"></i> Impossibile caricare il calendario eventi.</div>';
            });
    }

});
// Add CSS for duration filter buttons
const durationFilterCSS = `
.filter-btn-duration {
    padding: 0.5rem 1.25rem;
    background: white;
    border: 1px solid var(--border);
    border-radius: 50px;
    cursor: pointer;
    font-size: 0.95rem;
    color: var(--text-secondary);
    transition: all var(--transition);
    font-weight: 500;
}

.filter-btn-duration:hover {
    border-color: var(--primary);
    color: var(--primary);
}

.filter-btn-duration.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
}
`;

// Add CSS to page
const styleEl = document.createElement('style');
styleEl.textContent = durationFilterCSS;
document.head.appendChild(styleEl);

// Duration filter logic
document.addEventListener('DOMContentLoaded', () => {
    const durationButtons = document.querySelectorAll('.filter-btn-duration');
    const trailCards = document.querySelectorAll('.trail-card');

    if (durationButtons.length > 0) {
        durationButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active from all duration buttons
                durationButtons.forEach(btn => btn.classList.remove('active'));
                // Add active to clicked button
                button.classList.add('active');

                const durationFilter = button.getAttribute('data-duration');

                trailCards.forEach(card => {
                    const duration = parseInt(card.getAttribute('data-duration'));
                    let show = false;

                    if (durationFilter === 'all') {
                        show = true;
                    } else if (durationFilter === 'short' && duration < 60) {
                        show = true;
                    } else if (durationFilter === 'medium' && duration >= 60 && duration <= 120) {
                        show = true;
                    } else if (durationFilter === 'long' && duration > 120) {
                        show = true;
                    }

                    // Check if also difficulty filter is applied
                    const currentDisplay = card.style.display;
                    if (show && currentDisplay !== 'none') {
                        card.style.display = 'block';
                        card.animate([
                            { opacity: 0, transform: 'translateY(10px)' },
                            { opacity: 1, transform: 'translateY(0)' }
                        ], {
                            duration: 300,
                            easing: 'ease-out'
                        });
                    } else if (!show) {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
});
