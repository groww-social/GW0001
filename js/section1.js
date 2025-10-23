(function() {
  function startCounters() {
    const allCounters = document.querySelectorAll('.stat-number');
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

    function animateCounter(counterData, timestamp) {
      if (counterData.startTime === null) {
        counterData.startTime = timestamp;
      }

      const elapsed = timestamp - counterData.startTime;
      const progress = Math.min(1, elapsed / counterData.duration);
      const currentValue = progress * counterData.target;

      counterData.element.textContent = formatNumber(currentValue, counterData.format);

      if (progress < 1) {
        const newRequestId = requestAnimationFrame((ts) => animateCounter(counterData, ts));
        runningAnimations.set(counterData.element, newRequestId);
      } else {
        counterData.element.textContent = formatNumber(counterData.target, counterData.format);
        runningAnimations.delete(counterData.element);
      }
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const listItem = entry.target;
          const counterElement = listItem.querySelector('.stat-number');

          if (!runningAnimations.has(counterElement)) {
            const counterData = {
              element: counterElement,
              target: parseFloat(counterElement.getAttribute('data-target')),
              format: counterElement.getAttribute('data-format'),
              duration: parseInt(listItem.getAttribute('data-duration') || '2000', 10),
              startTime: null,
            };

            animateCounter(counterData, performance.now());
            observer.unobserve(listItem);
          }
        }
      });
    }, observerOptions);

    document.querySelectorAll('#_boxes ul li').forEach(item => {
      counterObserver.observe(item);
    });

    console.log("✅ Counters initialized");
  }

  // Run immediately if DOM is already ready, else wait for DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startCounters);
  } else {
    startCounters();
  }
})();
