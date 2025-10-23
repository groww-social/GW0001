document.addEventListener('DOMContentLoaded', () => {
      const allCounters = document.querySelectorAll('.stat-number');
      
      // Map to hold animation state (prevents multiple starts)
      const runningAnimations = new Map();

      function formatNumber(value, format) {
        switch (format) {
          case 'orders':
          case 'services':
            return Math.floor(value).toLocaleString(); 
          case 'percent':
            return Math.floor(value) + '%'; 
          case 'price':
            return '$' + value.toFixed(3);
          default:
            return value;
        }
      }

      // The core animation loop function
      function animateCounter(counterData, timestamp) {
        // Initialize start time on the first call for this counter
        if (counterData.startTime === null) {
          counterData.startTime = timestamp;
        }

        const elapsed = timestamp - counterData.startTime;
        const progress = Math.min(1, elapsed / counterData.duration);
        
        let currentValue = progress * counterData.target;
        
        counterData.element.textContent = formatNumber(currentValue, counterData.format);

        if (progress < 1) {
          // Continue animation, store the request ID
          const newRequestId = requestAnimationFrame((ts) => animateCounter(counterData, ts));
          runningAnimations.set(counterData.element, newRequestId);
        } else {
          // Animation complete, set final value and remove from map
          counterData.element.textContent = formatNumber(counterData.target, counterData.format);
          runningAnimations.delete(counterData.element);
        }
      }

      // Setup Intersection Observer
      const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.5 // Start when 50% of the card is visible
      };

      const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const listItem = entry.target;
            const counterElement = listItem.querySelector('.stat-number');

            // Prevent animation if it has already started or is complete
            if (!runningAnimations.has(counterElement)) {
              
              const counterData = {
                element: counterElement,
                target: parseFloat(counterElement.getAttribute('data-target')),
                format: counterElement.getAttribute('data-format'),
                duration: parseInt(listItem.getAttribute('data-duration') || '2000', 10),
                startTime: null,
              };

              // Start the count animation
              animateCounter(counterData, performance.now());
              
              // Stop observing this element once the animation has been triggered
              observer.unobserve(listItem);
            }
          }
        });
      }, observerOptions);

      // Attach the observer to each list item (the card wrapper)
      document.querySelectorAll('#_boxes ul li').forEach(item => {
        counterObserver.observe(item);
      });
    });
