  // --- 1. Mobile Menu Functionality ---
        const menuToggle = document.getElementById('menuToggle');
        const mobileNav = document.getElementById('mobileNav');
        const mobileCloseBtn = document.getElementById('mobileCloseBtn');
        const mobileNavLinks = mobileNav.querySelectorAll('a[href^="#"]');

        const toggleMenu = () => {
            mobileNav.classList.toggle('open');
            document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : 'auto';
        };

        menuToggle.addEventListener('click', toggleMenu);
        mobileCloseBtn.addEventListener('click', toggleMenu);
        
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(toggleMenu, 300); 
            });
        });


        // --- 2. Cursor Glow Effect ---
        const glow = document.getElementById('cursor-glow');
        const updateGlow = (e) => {
            glow.style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`;
            glow.style.opacity = '0.15';
        };

        const hideGlow = () => {
             glow.style.opacity = '0';
        };

        let rafId = null;
        document.addEventListener('mousemove', (e) => {
            if (rafId) {
                window.cancelAnimationFrame(rafId);
            }
            rafId = window.requestAnimationFrame(() => {
                updateGlow(e);
            });
        });

        document.addEventListener('mouseleave', hideGlow);

        // --- 3. Smooth Scroll for Nav Links ---
        document.querySelectorAll('.nav a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
