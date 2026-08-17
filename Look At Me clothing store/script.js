document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const menuOverlay = document.querySelector('[data-menu-overlay]');
  const menuLinks = document.querySelectorAll('[data-menu-link]');
  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImage = document.querySelector('[data-lightbox-image]');
  const lightboxCaption = document.querySelector('[data-lightbox-caption]');
  const galleryItems = Array.from(document.querySelectorAll('[data-gallery-item]'));
  const closeLightbox = document.querySelector('[data-lightbox-close]');
  const previousButton = document.querySelector('[data-lightbox-prev]');
  const nextButton = document.querySelector('[data-lightbox-next]');
  const reviewTrack = document.querySelector('[data-review-track]');
  const reviewCards = document.querySelectorAll('[data-review-card]');
  const previousReview = document.querySelector('[data-review-prev]');
  const nextReview = document.querySelector('[data-review-next]');
  let galleryIndex = 0;
  let reviewIndex = 0;

  const setMenu = function(open) {
    if (!menuButton || !mobileMenu || !menuOverlay) return;
    menuButton.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('is-open', open);
    menuOverlay.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  };

  if (menuButton) menuButton.addEventListener('click', function() {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });
  if (menuOverlay) menuOverlay.addEventListener('click', function() {
    setMenu(false);
  });
  menuLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      setMenu(false);
    });
  });
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      setMenu(false);
      if (lightbox && lightbox.classList.contains('is-open')) closeGallery();
    }
  });

  const onScroll = function() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 35);
  };
  window.addEventListener('scroll', onScroll, {
    passive: true
  });
  onScroll();

  const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });
  document.querySelectorAll('.reveal').forEach(function(element) {
    revealObserver.observe(element);
  });

  const counters = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.getAttribute('data-counter'));
      let current = 0;
      const step = function() {
        current += target / 35;
        if (current >= target) element.textContent = target === 4.9 ? '4.9' : target + '+';
        else {
          element.textContent = target < 10 ? current.toFixed(1) : Math.floor(current) + '+';
          requestAnimationFrame(step);
        }
      };
      step();
      counterObserver.unobserve(element);
    });
  }, {
    threshold: .7
  });
  counters.forEach(function(counter) {
    counterObserver.observe(counter);
  });

  const showGallery = function(index) {
    if (!lightbox || !lightboxImage || !galleryItems.length) return;
    galleryIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[galleryIndex];
    lightboxImage.src = item.getAttribute('data-full') || item.querySelector('img').src;
    lightboxImage.alt = item.querySelector('img').alt;
    if (lightboxCaption) lightboxCaption.textContent = item.getAttribute('data-caption') || 'Fashion inspiration';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    if (closeLightbox) closeLightbox.focus();
  };
  const closeGallery = function() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
  };
  galleryItems.forEach(function(item, index) {
    item.addEventListener('click', function() {
      showGallery(index);
    });
  });
  if (closeLightbox) closeLightbox.addEventListener('click', closeGallery);
  if (previousButton) previousButton.addEventListener('click', function() {
    showGallery(galleryIndex - 1);
  });
  if (nextButton) nextButton.addEventListener('click', function() {
    showGallery(galleryIndex + 1);
  });
  if (lightbox) lightbox.addEventListener('click', function(event) {
    if (event.target === lightbox) closeGallery();
  });

  const renderReviews = function() {
    if (!reviewTrack || !reviewCards.length) return;
    reviewTrack.style.transform = 'translateX(-' + (reviewIndex * 100) + '%)';
  };
  const moveReview = function(direction) {
    reviewIndex = (reviewIndex + direction + reviewCards.length) % reviewCards.length;
    renderReviews();
  };
  if (previousReview) previousReview.addEventListener('click', function() {
    moveReview(-1);
  });
  if (nextReview) nextReview.addEventListener('click', function() {
    moveReview(1);
  });
});
