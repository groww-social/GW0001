const cards = document.querySelectorAll('input[name="card"]');
        let current = 0;
        const total = cards.length;
        let autoTimer;

        function showNext() {
            current = (current + 1) % total;
            cards[current].checked = true;
        }

        function startAutoSlide() {
            clearInterval(autoTimer);
            autoTimer = setInterval(showNext, 3000); // 3 seconds
        }

        // Start auto-slide initially
        startAutoSlide();

        // Swipe gesture support
        let startX = 0;
        let endX = 0;
        const container = document.querySelector('.cards');

        container.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
        });

        container.addEventListener('touchend', e => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) { // Minimum swipe distance
                clearInterval(autoTimer);
                if (diff > 0) {
                    // Swipe left → next
                    current = (current + 1) % total;
                } else {
                    // Swipe right → previous
                    current = (current - 1 + total) % total;
                }
                cards[current].checked = true;
                startAutoSlide(); // restart timer after manual swipe
            }
        });
