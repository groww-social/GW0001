const cards = document.querySelectorAll('input[name="card"]');
let current = 0;
const total = cards.length;
let autoTimer;

function showNext() {
  current = (current + 1) % total;
  cards[current].checked = true;
}

function startAutoSlide() {
  if (autoTimer) return; // avoid multiple intervals
  autoTimer = setInterval(showNext, 3000); // 3 seconds
}

function stopAutoSlide() {
  clearInterval(autoTimer);
  autoTimer = null;
}

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
    stopAutoSlide();
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

// Intersection Observer to start/stop auto-slide
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Section is visible → start sliding
      startAutoSlide();
    } else {
      // Section not visible → stop sliding
      stopAutoSlide();
    }
  });
}, { threshold: 0.3 }); // Trigger when 30% of the section is visible

observer.observe(container);
