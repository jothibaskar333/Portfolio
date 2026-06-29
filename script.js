/* ============================================================
   PORTFOLIO JAVASCRIPT
   Features: smooth scroll, active nav, scroll animations,
             mobile menu, footer year.
   Written in plain vanilla JS — no libraries needed!
   ============================================================ */


/* ============================================================
   1. FOOTER: Auto-update the current year
   ============================================================ */

// Grab the <span id="footer-year"> element from the HTML
const yearEl = document.getElementById('footer-year');

// Set its text to the current year (e.g. "2025")
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}


/* ============================================================
   2. MOBILE NAVIGATION: Hamburger menu toggle
   ============================================================ */

const hamburger = document.getElementById('hamburger');  // the ☰ button
const navLinks  = document.getElementById('nav-links');  // the <ul> of links

// When the hamburger is clicked, toggle the menu open/closed
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');   // animates the ☰ → ✕
  navLinks.classList.toggle('open');    // shows/hides the nav list
});

// Close the mobile menu whenever any nav link is clicked
// (so the user doesn't have to manually close it after navigating)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});


/* ============================================================
   3. NAVBAR: Add a shadow when the user scrolls down
   ============================================================ */

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  // If page is scrolled more than 20px, add the "scrolled" class
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


/* ============================================================
   4. ACTIVE NAV LINK: Highlight the current section in the nav
   ============================================================ */

// All the nav links
const allNavLinks = document.querySelectorAll('.nav-link');

// All the sections we want to track
const sections = document.querySelectorAll('section[id]');

function setActiveLink() {
  // How far from the top we consider a section "active"
  // (the navbar is ~68px tall, so we add a little extra buffer)
  const scrollPosition = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop    = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId     = section.getAttribute('id');

    // Check if the current scroll position is inside this section
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      // Remove "active" from all links
      allNavLinks.forEach(link => link.classList.remove('active'));

      // Add "active" to the link that matches this section
      const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}

// Run on every scroll
window.addEventListener('scroll', setActiveLink);

// Also run once on page load, in case the user refreshes mid-page
setActiveLink();


/* ============================================================
   5. SCROLL ANIMATIONS: Fade in sections as they scroll into view
   ============================================================ */

// We use IntersectionObserver — it's the modern, performant way
// to know when an element enters the viewport.

// The "options" control when the animation triggers:
const observerOptions = {
  root: null,          // "null" means the browser viewport is the root
  rootMargin: '0px',   // no extra margin around the viewport
  threshold: 0.12      // trigger when 12% of the element is visible
};

// This function runs whenever a section enters or leaves the viewport
function onSectionIntersect(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Section has entered the viewport → make it visible
      entry.target.classList.add('visible');

      // Stop watching this section (no need to animate it again)
      observer.unobserve(entry.target);
    }
  });
}

// Create the observer with our options and callback function
const sectionObserver = new IntersectionObserver(onSectionIntersect, observerOptions);

// Attach the observer to every <section> on the page
document.querySelectorAll('.section').forEach(section => {
  sectionObserver.observe(section);
});


/* ============================================================
   6. PROJECT CARDS: Staggered fade-in animation
   ============================================================ */

// We also observe project cards individually for a nice
// "cards popping in one by one" effect.

const cardObserverOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

function onCardIntersect(entries, observer) {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Each card gets a tiny extra delay based on its position
      // so they stagger rather than all appearing at once.
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.style.opacity  = '1';
        entry.target.style.transform = 'translateY(0)';
      }, delay);

      observer.unobserve(entry.target);
    }
  });
}

const cardObserver = new IntersectionObserver(onCardIntersect, cardObserverOptions);

// Find all project cards and skill category cards
document.querySelectorAll('.project-card, .skill-category-card, .about-card').forEach((card, index) => {
  // Set the initial hidden state via inline styles
  // (CSS handles sections; JS handles individual cards for stagger)
  card.style.opacity   = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

  // Give each card a staggered delay (150ms apart)
  card.dataset.delay = index * 120;

  cardObserver.observe(card);
});


/* ============================================================
   7. SMOOTH SCROLLING (fallback for older browsers)
   ============================================================ */

// Modern browsers handle smooth scrolling with CSS (scroll-behavior: smooth)
// already set in our stylesheet. This JavaScript fallback handles any
// older browsers that might not support it natively.

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');   // e.g. "#about"
    const target   = document.querySelector(targetId);

    if (target) {
      e.preventDefault();   // prevent the default "jump" behaviour

      // Offset for the fixed navbar height (68px)
      const navbarHeight = 68;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});


/* ============================================================
   That's it! Here's a quick summary of all the features:

   ✦ Footer year    → set automatically via JS Date object
   ✦ Mobile menu    → hamburger button toggles the nav list
   ✦ Navbar shadow  → appears after scrolling 20px
   ✦ Active nav     → highlighted link follows your scroll position
   ✦ Section fade   → sections slide up and fade in on scroll
   ✦ Card stagger   → cards animate in one by one
   ✦ Smooth scroll  → anchor links glide to their sections

   To customise:
   – Change the stagger delay (currently 120ms) on line with card.dataset.delay
   – Change the IntersectionObserver threshold to adjust when animations trigger
   – The navbar height offset (68) should match the CSS var in style.css
   ============================================================ */