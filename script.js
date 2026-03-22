document.addEventListener('DOMContentLoaded', () => {
    
    // --- Preloader & Starting Animation ---
    const preloader = document.querySelector('.preloader');
    const progress = document.querySelector('.preloader-progress');
    const heroSection = document.getElementById('hero');
    
    if (preloader && progress && heroSection) {
        let width = 0;
        const interval = setInterval(() => {
            width += Math.random() * 15;
            if (width >= 100) width = 100;
            progress.style.width = width + '%';
            
            if (width === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    preloader.classList.add('hidden');
                    window.scrollTo(0, 0); // Ensure page is at top when loaded
                    setTimeout(() => {
                        heroSection.classList.add('loaded');
                    }, 100);
                }, 400); // slight delay after reaching 100%
            }
        }, 120);
    }

    // --- Custom Cursor Logic ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    // Laggy ring animation loop
    function animateRing() {
        let distX = mouseX - ringX;
        let distY = mouseY - ringY;
        
        // Easing multiplier makes it follow smoothly but lag behind
        ringX += distX * 0.15;
        ringY += distY * 0.15;
        
        if (cursorRing) {
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
        }
        
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Cursor hover states for interactive elements
    const interactiveElements = document.querySelectorAll('a, button');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorRing) {
                cursorRing.style.width = '60px';
                cursorRing.style.height = '60px';
                cursorRing.style.backgroundColor = 'rgba(184, 149, 106, 0.15)'; // Gold tint
                cursorRing.style.borderColor = 'rgba(184, 149, 106, 0.8)'; // Stronger gold border
            }
        });
        el.addEventListener('mouseleave', () => {
            if (cursorRing) {
                cursorRing.style.width = '30px';
                cursorRing.style.height = '30px';
                cursorRing.style.backgroundColor = 'transparent';
                cursorRing.style.borderColor = 'rgba(184, 149, 106, 0.4)'; // Reset to faint gold
            }
        });
    });

    // --- Active Navbar & Glassmorphism Scroll ---
    const nav = document.querySelector('nav');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Toggle nav blur backdrop
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
        
        // --- Timeline Scroll Draw Logic ---
        const eduSection = document.getElementById('education');
        const timelineProgress = document.querySelector('.timeline-progress');
        const eduItems = document.querySelectorAll('.edu-item');
        
        if (eduSection && timelineProgress) {
            const sectionTop = eduSection.offsetTop;
            const sectionHeight = eduSection.clientHeight;
            
            // Calculate how far we've scrolled into the education section
            let scrollDistance = window.scrollY + window.innerHeight / 2 - sectionTop;
            
            if (scrollDistance > 0 && scrollDistance < sectionHeight) {
                let percentage = (scrollDistance / sectionHeight) * 100;
                // Cap at 100%
                timelineProgress.style.height = `${Math.min(percentage, 100)}%`;
            } else if (scrollDistance <= 0) {
                timelineProgress.style.height = '0%';
            } else {
                timelineProgress.style.height = '100%';
            }
            
            // Activate nodes
            eduItems.forEach(item => {
                const itemTop = item.getBoundingClientRect().top;
                if(itemTop < window.innerHeight * 0.7) {
                    item.classList.add('active');
                }
            });
        }
    });

    // --- Intersection Observer for Scroll Reveals & Counters ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If the revealed element contains stat counters, trigger them
                if (entry.target.id === 'hero' || entry.target.querySelector('.stat-number')) {
                    animateCounters();
                }
                
                // Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // --- Animated Number Counters ---
    let firedCounters = false;
    
    function animateCounters() {
        // Prevent re-triggering
        if(firedCounters) return;
        firedCounters = true;
        
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200; // lower is slower

        counters.forEach(counter => {
            const updateCount = () => {
                // Get the target number from data attribute
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;

                // Calculate increment increment step
                const inc = target / speed;

                if (count < target) {
                    // Update the counter and schedule the next frame
                    // Check if it's a float (like 7.39)
                    if(target % 1 !== 0) {
                        counter.innerText = (count + inc).toFixed(2);
                    } else {
                         counter.innerText = Math.ceil(count + inc);
                    }
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }
});
