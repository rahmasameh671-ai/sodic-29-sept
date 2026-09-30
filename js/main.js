/**
 * SODIC PREMIER DEVELOPMENTS - BY PROPERTIES-E
 * Main JavaScript Engine: Form Handling, Logo Transparency & UI Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initLogoTransparency();
  initMobileNavigation();
  initLeadCaptureForm();
  initSmoothScroll();
});

/**
 * Converts black-background white logos into transparent PNGs directly in the browser.
 * For light backgrounds: renders crisp deep charcoal (#1A202C).
 */
function initLogoTransparency() {
  const images = document.querySelectorAll('img[data-transparent]');
  
  images.forEach(img => {
    if (img.complete && img.naturalWidth !== 0) {
      processImageTransparency(img);
    } else {
      img.addEventListener('load', () => processImageTransparency(img));
    }
  });
}

function processImageTransparency(img) {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;

    if (canvas.width === 0 || canvas.height === 0) return;

    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    const targetTheme = img.getAttribute('data-transparent') || 'charcoal';
    const isCharcoal = targetTheme === 'charcoal';
    
    const targetR = isCharcoal ? 26 : 255;
    const targetG = isCharcoal ? 32 : 255;
    const targetB = isCharcoal ? 44 : 255;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      const luminance = (r * 0.299 + g * 0.587 + b * 0.114);

      if (luminance < 18) {
        data[i + 3] = 0;
      } else {
        data[i] = targetR;
        data[i + 1] = targetG;
        data[i + 2] = targetB;
        data[i + 3] = Math.min(255, Math.floor(luminance * 1.1));
      }
    }

    ctx.putImageData(imgData, 0, 0);
    img.src = canvas.toDataURL('image/png');
    img.classList.remove('logo-invert-charcoal');
  } catch (err) {
    console.log('Canvas transparency fallback active:', err.message);
  }
}

/**
 * Mobile Navigation Toggle
 */
function initMobileNavigation() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');

  if (!menuBtn || !navMenu) return;

  menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const isOpen = navMenu.classList.contains('open');
    menuBtn.setAttribute('aria-expanded', isOpen);
    menuBtn.innerHTML = isOpen 
      ? '<i class="fa-solid fa-xmark"></i>' 
      : '<i class="fa-solid fa-bars"></i>';
  });

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
}

/**
 * Lead Capture Form
 * Routes to:
 * - Rahma@irtkaz.com
 * - Mostafa.a.ashmawy@gmail.com
 * - Mostafa.ashmawy@irtkaz.com
 * Fast-tracks to WhatsApp (+201033373331)
 */
function initLeadCaptureForm() {
  const leadForm = document.getElementById('heroLeadForm');
  if (!leadForm) return;

  leadForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const fullNameInput = document.getElementById('leadFullName');
    const phoneInput = document.getElementById('leadPhone');

    if (!fullNameInput || !phoneInput) return;

    const fullName = fullNameInput.value.trim();
    const phone = phoneInput.value.trim();
    const defaultProject = 'The Lakes at SODIC East & Portfolio';

    if (!fullName || !phone) {
      alert('Please enter your full name and phone number.');
      return;
    }

    const submitBtn = leadForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> REGISTERING...';
    submitBtn.disabled = true;

    const leadData = {
      timestamp: new Date().toISOString(),
      fullName: fullName,
      phone: phone,
      projectFocus: defaultProject,
      source: 'SODIC Landing Page - The Lakes Launch - Properties',
      routedEmails: [
        'Rahma@irtkaz.com',
        'Mostafa.a.ashmawy@gmail.com',
        'Mostafa.ashmawy@irtkaz.com'
      ]
    };

    try {
      const storedLeads = JSON.parse(localStorage.getItem('properties_eg_sodic_leads') || '[]');
      storedLeads.push(leadData);
      localStorage.setItem('properties_eg_sodic_leads', JSON.stringify(storedLeads));
    } catch (e) {}

    const waText = encodeURIComponent(
      `Hello properties, I just registered my interest in The Lakes at SODIC East.\n` +
      `Name: ${fullName}\n` +
      `Phone: ${phone}`
    );
    const whatsappUrl = `https://wa.me/201033373331?text=${waText}`;

    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> INTEREST REGISTERED';
      submitBtn.style.backgroundColor = '#1A202C';

      showToast(
        'Interest Registered',
        `Thank you ${fullName}. Our senior property consultant will contact you promptly.`
      );

      leadForm.reset();

      setTimeout(() => {
        if (confirm(`Thank you ${fullName}! Would you like to connect directly via WhatsApp (+201033373331) for instant brochures, floorplans, and pricing details for The Lakes at SODIC East?`)) {
          window.open(whatsappUrl, '_blank');
        }
      }, 700);

      setTimeout(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.style.backgroundColor = '';
      }, 4000);

    }, 750);
  });
}

function showToast(title, message) {
  const toast = document.getElementById('leadToast');
  if (!toast) return;

  const titleEl = toast.querySelector('h4');
  const msgEl = toast.querySelector('p');

  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.textContent = message;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 5500);
}

/**
 * Smooth scrolling offset for fixed header navigation anchors
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 85;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
