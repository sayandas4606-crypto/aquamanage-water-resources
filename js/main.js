/**
 * Water Resources and Management - Main Application Script
 * Theme: Ocean Aqua / Navy
 * Features: Dark/Light Mode, Canvas Water Bubbles, Scrollspy, Counters, 3D Card Hover
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initNavbar();
    initAnimatedCounters();
    initScrollReveal();
    initCanvasBubbles();
    init3DCardTilt();
    initRippleEffect();
    initBackToTop();
});

/* --------------------------------------------------------------------------
   1. DARK / LIGHT THEME TOGGLE
   -------------------------------------------------------------------------- */
function initThemeToggle() {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (!themeBtn) return;

    const savedTheme = localStorage.getItem('water_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('water_theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = themeBtn.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

/* --------------------------------------------------------------------------
   2. NAVBAR & MOBILE MENU & SCROLLSPY
   -------------------------------------------------------------------------- */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');

    // Sticky shadow on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        highlightActiveSection();
    });

    // Mobile menu toggle
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.className = navLinks.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
            }
        });

        // Close mobile menu when clicking outside or clicking any link
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileToggle.querySelector('i').className = 'fas fa-bars';
            }
        });

        const allClickableLinks = document.querySelectorAll('.nav-link:not(.nav-dropdown-toggle), .dropdown-item');
        allClickableLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileToggle.querySelector('i').className = 'fas fa-bars';
                }
            });
        });

        // Mobile dropdown toggle
        const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 1240) {
                    e.preventDefault();
                    const parent = toggle.closest('.nav-dropdown');
                    if (parent) {
                        parent.classList.toggle('open');
                    }
                }
            });
        });
    }

    // Scrollspy
    const sections = document.querySelectorAll('section[id]');
    function highlightActiveSection() {
        const scrollY = window.pageYOffset + 120;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop;
            const sectionId = current.getAttribute('id');
            const matchingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

            if (matchingLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    links.forEach(l => l.classList.remove('active'));
                    matchingLink.classList.add('active');
                }
            }
        });
    }
}

/* --------------------------------------------------------------------------
   3. ANIMATED NUMBER COUNTERS (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                counters.forEach(counter => {
                    const target = parseFloat(counter.getAttribute('data-target'));
                    const isPercentage = counter.getAttribute('data-suffix') || '';
                    const duration = 2000;
                    const stepTime = 20;
                    const steps = duration / stepTime;
                    const increment = target / steps;
                    let current = 0;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        
                        // Format for decimal places if needed
                        if (target % 1 !== 0) {
                            counter.textContent = current.toFixed(1) + isPercentage;
                        } else {
                            counter.textContent = Math.floor(current).toLocaleString() + isPercentage;
                        }
                    }, stepTime);
                });
            }
        });
    }, { threshold: 0.3 });

    const statsGrid = document.querySelector('.hero-stats-grid');
    if (statsGrid) observer.observe(statsGrid);
}

/* --------------------------------------------------------------------------
   4. SCROLL REVEAL ANIMATIONS
   -------------------------------------------------------------------------- */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.glass-card, .section-header, .stat-card, .about-project-card');
    
    revealElements.forEach(el => {
        el.classList.add('reveal-init');
    });

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   5. CANVAS DYNAMIC WATER BUBBLES
   -------------------------------------------------------------------------- */
function initCanvasBubbles() {
    const canvas = document.getElementById('waterCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let bubbles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Bubble {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 80;
            this.radius = Math.random() * 6 + 2;
            this.speedY = Math.random() * 1.2 + 0.4;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.03 + 0.01;
            this.opacity = Math.random() * 0.4 + 0.2;
        }

        update() {
            this.y -= this.speedY;
            this.wobble += this.wobbleSpeed;
            this.x += Math.sin(this.wobble) * 0.5;

            if (this.y < -20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
            ctx.fill();

            // Inner shine dot
            ctx.beginPath();
            ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.25, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity + 0.3})`;
            ctx.fill();
            ctx.restore();
        }
    }

    const bubbleCount = Math.min(65, Math.floor(width / 25));
    for (let i = 0; i < bubbleCount; i++) {
        const b = new Bubble();
        b.y = Math.random() * height; // initial spread
        bubbles.push(b);
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        bubbles.forEach(b => {
            b.update();
            b.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
}

/* --------------------------------------------------------------------------
   6. 3D CARD TILT EFFECT & RIPPLE
   -------------------------------------------------------------------------- */
function init3DCardTilt() {
    const cards = document.querySelectorAll('.glass-card, .stat-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}

/* --------------------------------------------------------------------------
   7. BUTTON RIPPLE EFFECT
   -------------------------------------------------------------------------- */
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .btn-pledge-nav, .tab-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const circle = document.createElement('span');
            circle.classList.add('ripple');
            
            const rect = this.getBoundingClientRect();
            const diameter = Math.max(rect.width, rect.height);
            const radius = diameter / 2;

            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - rect.left - radius}px`;
            circle.style.top = `${e.clientY - rect.top - radius}px`;

            const ripple = this.getElementsByClassName('ripple')[0];
            if (ripple) {
                ripple.remove();
            }

            this.appendChild(circle);
        });
    });
}

/* --------------------------------------------------------------------------
   8. BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initBackToTop() {
    const btt = document.getElementById('backToTopBtn');
    if (!btt) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btt.classList.add('visible');
        } else {
            btt.classList.remove('visible');
        }
    });

    btt.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
