/* =============================================
   DOM EVANS — PORTFOLIO
   script.js

   1. Particle canvas animation (hero background)
   2. Typing text animation (hero headline)
   3. Navbar scroll behaviour
   4. Mobile nav toggle
   5. Scroll fade-in animations
   ============================================= */


/* =============================================
   1. PARTICLE CANVAS ANIMATION
   Draws floating particles + connecting lines
   on the hero canvas element.
   ============================================= */
(function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    /* ---- Configuration ----
       Tweak these values to change the look of
       the particle effect.
       ----------------------- */
    const CFG = {
        count:             65,    // total number of particles
        minSize:           0.8,   // smallest particle radius (px)
        maxSize:           2.2,   // largest particle radius (px)
        maxSpeed:          0.35,  // maximum velocity in any direction
        baseOpacity:       0.15,  // minimum opacity per particle
        opacityRange:      0.30,  // additional random opacity added on top
        lineDistance:      130,   // max distance before a connecting line is drawn
        lineOpacityScale:  0.10,  // max opacity of the connecting lines
    };

    function resize() {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    function makeParticle() {
        const speed = CFG.maxSpeed;
        return {
            x:   Math.random() * canvas.width,
            y:   Math.random() * canvas.height,
            r:   CFG.minSize + Math.random() * (CFG.maxSize - CFG.minSize),
            vx:  (Math.random() - 0.5) * speed * 2,
            vy:  (Math.random() - 0.5) * speed * 2,
            op:  CFG.baseOpacity + Math.random() * CFG.opacityRange,
        };
    }

    function buildParticles() {
        particles = Array.from({ length: CFG.count }, makeParticle);
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx   = particles[i].x - particles[j].x;
                const dy   = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CFG.lineDistance) {
                    const alpha = CFG.lineOpacityScale * (1 - dist / CFG.lineDistance);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
                    ctx.lineWidth   = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    function drawParticles() {
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${p.op})`;
            ctx.fill();
        });
    }

    function updateParticles() {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Wrap particles around the edges
            if (p.x < 0)             p.x = canvas.width;
            if (p.x > canvas.width)  p.x = 0;
            if (p.y < 0)             p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
        });
    }

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateParticles();
        drawConnections();
        drawParticles();
        animationId = requestAnimationFrame(loop);
    }

    // Pause when the tab is hidden — saves CPU/battery
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            loop();
        }
    });

    // Re-initialise on window resize
    window.addEventListener('resize', () => {
        resize();
        buildParticles();
    });

    resize();
    buildParticles();
    loop();
}());


/* =============================================
   2. TYPING TEXT ANIMATION
   Cycles through headline strings with a
   typewriter effect in the hero section.

   To change the rotating phrases, edit the
   `strings` array below.
   ============================================= */
(function initTyping() {
    const el = document.getElementById('typed-text');
    if (!el) return;

    /* ---- Strings to cycle through ---- */
    const strings = [
        'Civil servant. Aspiring developer.',
        'Building AI tools that work.',
        'Policy \u00d7 Technology \u00d7 Automation.',
        'Based in UK government. Building things anyway.',
    ];

    /* ---- Timing (milliseconds) ---- */
    const TYPING_SPEED = 55;   // delay between typed characters
    const DELETE_SPEED = 28;   // delay between deleted characters
    const PAUSE_AFTER  = 2500; // how long to hold the complete string
    const PAUSE_BEFORE = 450;  // delay before typing the next string

    let stringIndex = 0;
    let charIndex   = 0;
    let isDeleting  = false;

    function tick() {
        const current = strings[stringIndex];

        if (isDeleting) {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === current.length) {
            // Finished typing — pause, then start deleting
            setTimeout(() => {
                isDeleting = true;
                setTimeout(tick, DELETE_SPEED);
            }, PAUSE_AFTER);
            return;
        }

        if (isDeleting && charIndex === 0) {
            // Finished deleting — advance to the next string
            isDeleting    = false;
            stringIndex   = (stringIndex + 1) % strings.length;
            setTimeout(tick, PAUSE_BEFORE);
            return;
        }

        setTimeout(tick, isDeleting ? DELETE_SPEED : TYPING_SPEED);
    }

    // Short delay before the animation starts
    setTimeout(tick, 900);
}());


/* =============================================
   3. NAVBAR SCROLL BEHAVIOUR
   Adds a dark background to the nav once the
   user scrolls past the top of the page.
   ============================================= */
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    function onScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Apply correct state on initial load
}());


/* =============================================
   4. MOBILE NAV TOGGLE
   Opens and closes the full-screen nav overlay
   on small screens.
   ============================================= */
(function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const links  = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close the menu whenever a nav link is clicked
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}());


/* =============================================
   5. SCROLL FADE-IN ANIMATIONS
   Elements listed in `selectors` start invisible
   and fade up into view as they enter the viewport.

   To add fade-in to a new element type, add its
   CSS selector to the `selectors` array.
   ============================================= */
(function initScrollFade() {
    const selectors = [
        '.about-text',
        '.skill-pill',
        '.project-card',
        '.cert-item',
        '.edu-item',
        '.contact-link',
    ];

    const targets = document.querySelectorAll(selectors.join(', '));

    // Bail out if IntersectionObserver isn't supported
    if (!('IntersectionObserver' in window)) {
        targets.forEach(el => el.style.opacity = '1');
        return;
    }

    targets.forEach(el => el.classList.add('fade-in'));

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    targets.forEach(el => observer.observe(el));
}());
