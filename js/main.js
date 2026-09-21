(function () {
  "use strict";

  /* ---- Messe-Banner dismiss ---- */
  var banner = document.getElementById('messeBanner');
  var bannerClose = document.getElementById('messeClose');
  if (banner && bannerClose) {
    if (localStorage.getItem('messeBannerDismissed') === '1') {
      banner.classList.add('hidden');
    }
    bannerClose.addEventListener('click', function () {
      banner.classList.add('hidden');
      localStorage.setItem('messeBannerDismissed', '1');
    });
  }

  /* ---- Mobile nav toggle ---- */
  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileMenuClose = document.getElementById('mobileMenuClose');
  function closeMobileMenu() {
    if (mobileMenu) mobileMenu.classList.remove('open');
  }
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () { mobileMenu.classList.add('open'); });
  }
  if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
  document.querySelectorAll('.mobile-menu-links a').forEach(function (a) {
    a.addEventListener('click', closeMobileMenu);
  });

  /* ---- Reveal system: IntersectionObserver + setInterval safety sweep.
     Matches the original build so nothing can stay stuck invisible on
     fast, programmatic, or interrupted scrolling. ---- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  var itemEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal-item]'));
  var allReveal = revealEls.concat(itemEls);
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealNow(el) { el.classList.add('in-view'); }

  if (prefersReduced || !('IntersectionObserver' in window)) {
    allReveal.forEach(revealNow);
  } else {
    var seen = new WeakSet();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
          revealNow(entry.target);
          seen.add(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    allReveal.forEach(function (el) { io.observe(el); });

    function sweep() {
      var h = window.innerHeight || 800;
      allReveal.forEach(function (el) {
        if (seen.has(el)) return;
        if (el.getBoundingClientRect().top < h * 0.92) {
          revealNow(el);
          seen.add(el);
          io.unobserve(el);
        }
      });
    }
    window.addEventListener('scroll', sweep, { passive: true });
    window.addEventListener('resize', sweep);
    setInterval(sweep, 700);
    setTimeout(sweep, 200);
  }

  /* ---- Hero / photo-hero parallax ---- */
  if (!prefersReduced) {
    var onScrollParallax = function () {
      var y = window.scrollY || 0;
      document.querySelectorAll('[data-parallax]').forEach(function (el) {
        var k = parseFloat(el.getAttribute('data-parallax')) || 0.2;
        el.style.transform = 'translate3d(0,' + (y * k).toFixed(1) + 'px,0)';
      });
    };
    window.addEventListener('scroll', onScrollParallax, { passive: true });
  }

  /* ---- Accordion (Events: Meine Formate) ---- */
  document.querySelectorAll('.accordion-item').forEach(function (item) {
    var toggle = item.querySelector('.accordion-toggle');
    var sign = item.querySelector('.sign');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      var isOpen = item.classList.toggle('open');
      if (sign) sign.textContent = isOpen ? '−' : '+';
    });
  });

  /* ---- Testimonial slider (Events page) ---- */
  var slider = document.getElementById('testimonialSlider');
  if (slider) {
    var data = JSON.parse(slider.getAttribute('data-testimonials'));
    var idx = 0;
    var quoteEl = slider.querySelector('.slider-quote');
    var nameEl = slider.querySelector('.slider-name');
    var roleEl = slider.querySelector('.slider-role');
    var posEl = slider.querySelector('.slider-pos');
    function render() {
      var t = data[idx];
      quoteEl.textContent = '„' + t.quote + '“';
      nameEl.textContent = t.name;
      roleEl.textContent = t.role;
      posEl.textContent = (idx + 1) + ' / ' + data.length;
    }
    var prevBtn = slider.querySelector('.slider-prev');
    var nextBtn = slider.querySelector('.slider-next');
    if (prevBtn) prevBtn.addEventListener('click', function () { idx = (idx - 1 + data.length) % data.length; render(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { idx = (idx + 1) % data.length; render(); });
    render();
  }

})();
