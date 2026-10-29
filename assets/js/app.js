/**
 * SWARG - Himalayan Cloud Retreat
 * Interactive Experience Engine: Currency Switcher, Booking Modal, Suite Inspector, Live Weather
 */

// --- 1. Currency Exchange System ---
const CURRENCY_CONFIG = {
  USD: { symbol: '$', rate: 1.0, decimals: 0, prefix: true },
  EUR: { symbol: '€', rate: 0.92, decimals: 0, prefix: true },
  MVR: { symbol: 'Rf ', rate: 15.42, decimals: 0, prefix: true },
  INR: { symbol: '₹', rate: 83.30, decimals: 0, prefix: true }
};

let currentCurrency = 'USD';

// Suite data definitions for details drawer and booking
const SUITES_DATA = {
  chalet: {
    id: 'chalet',
    name: 'The Cloudline Chalet',
    basePriceUSD: 850,
    tagline: 'Private cantilevered timber chalet perched above the mist.',
    size: '1,250 sq.ft / 116 sq.m',
    capacity: 'Up to 2 Adults',
    view: 'Unobstructed Annapurna Peak & Valley Vista',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Heated cedarwood soaking tub with floor-to-ceiling glass',
      'Double-sided stone hearth fireplace with complimentary alpine firewood',
      'Private 400 sq.ft cantilevered stargazing deck',
      'Dedicated personal Sherpa mountain butler',
      'Complimentary morning artisan tea service brewed with alpine herbs'
    ],
    inclusions: 'Includes gourmet breakfast, evening aperitifs, and guided sunrise mountain walk.'
  },
  villa: {
    id: 'villa',
    name: 'The Celestial Glass Villa',
    basePriceUSD: 1450,
    tagline: 'Dual-level luxury estate with an infinity heated thermal pool.',
    size: '2,600 sq.ft / 241 sq.m',
    capacity: 'Up to 4 Guests',
    view: 'Panoramic 270° Glacial Mountain Range',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Private temperature-controlled (38°C) infinity thermal plunge pool',
      'Private Finnish dry sauna and cold plunge facing the snow line',
      'Master bedroom with glass retractable roof for night sky viewing',
      'Private chef dining table and Sommelier wine cellar',
      'Round-trip private helicopter transfer from regional helipad'
    ],
    inclusions: 'All-inclusive dining, private cellar tasting, and daily bespoke mountain wellness sessions.'
  },
  penthouse: {
    id: 'penthouse',
    name: 'The Sanctuary Summit Penthouse',
    basePriceUSD: 2200,
    tagline: 'The pinnacle of Himalayan hospitality reserved for discerning dignitaries.',
    size: '4,100 sq.ft / 380 sq.m',
    capacity: 'Up to 6 Guests',
    view: 'Highest vantage over the entire valley & 8,000m peaks',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Full floor crowning the highest ridge of the estate',
      'Private helipad access with discreet diplomatic escort protocol',
      'Private Himalayan crystal sound healing studio & personal spa suite',
      'Dedicated executive chef, sommelier, and 24-hour estate security',
      'Handcrafted artisan furnishings in aged cedar and hammered mist brass'
    ],
    inclusions: 'Full buyout exclusivity, unlimited bespoke alpine expeditions, and customized gourmet menus.'
  }
};

// Format currency amount
function formatCurrency(amountUSD, currencyCode) {
  const config = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.USD;
  const converted = Math.round(amountUSD * config.rate);
  const formattedNumber = converted.toLocaleString();
  return `${config.symbol}${formattedNumber}`;
}

// Update all prices on page
function updatePrices(currencyCode) {
  currentCurrency = currencyCode;
  
  // Update currency selector active state
  document.querySelectorAll('.currency-option').forEach(btn => {
    if (btn.dataset.currency === currencyCode) {
      btn.classList.add('bg-white', 'text-slate-900', 'font-semibold');
      btn.classList.remove('text-slate-300', 'hover:text-white');
    } else {
      btn.classList.remove('bg-white', 'text-slate-900', 'font-semibold');
      btn.classList.add('text-slate-300', 'hover:text-white');
    }
  });

  // Update suite cards
  document.querySelectorAll('[data-suite-price]').forEach(el => {
    const suiteKey = el.dataset.suitePrice;
    if (SUITES_DATA[suiteKey]) {
      const priceText = formatCurrency(SUITES_DATA[suiteKey].basePriceUSD, currencyCode);
      el.textContent = priceText;
    }
  });

  // Update currency code labels
  document.querySelectorAll('.currency-label').forEach(el => {
    el.textContent = currencyCode;
  });

  // Refresh dynamic modal price if open
  updateBookingSummary();
}

// --- 2. Live Himalayan Elevation & Weather Simulation ---
function initWeatherTicker() {
  const timeEl = document.getElementById('ticker-himalayan-time');
  const tempEl = document.getElementById('ticker-temp');
  
  function updateTime() {
    if (!timeEl) return;
    const now = new Date();
    // UTC + 5:45 (Nepal/Himalayan Standard Time)
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const himalayanTime = new Date(utc + (3600000 * 5.75));
    
    let hours = himalayanTime.getHours();
    const minutes = String(himalayanTime.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    timeEl.textContent = `${hours}:${minutes} ${ampm} NPT`;
  }

  updateTime();
  setInterval(updateTime, 30000);
}

// --- 3. Suite Detail Drawer / Modal ---
function openSuiteModal(suiteKey) {
  const suite = SUITES_DATA[suiteKey];
  if (!suite) return;

  const modal = document.getElementById('suite-modal');
  const title = document.getElementById('modal-suite-title');
  const tagline = document.getElementById('modal-suite-tagline');
  const size = document.getElementById('modal-suite-size');
  const capacity = document.getElementById('modal-suite-capacity');
  const view = document.getElementById('modal-suite-view');
  const price = document.getElementById('modal-suite-price');
  const image = document.getElementById('modal-suite-image');
  const featuresList = document.getElementById('modal-suite-features');
  const inclusions = document.getElementById('modal-suite-inclusions');
  const bookBtn = document.getElementById('modal-suite-book-trigger');

  if (title) title.textContent = suite.name;
  if (tagline) tagline.textContent = suite.tagline;
  if (size) size.textContent = suite.size;
  if (capacity) capacity.textContent = suite.capacity;
  if (view) view.textContent = suite.view;
  if (image) image.src = suite.image;
  if (inclusions) inclusions.textContent = suite.inclusions;
  
  if (price) {
    price.textContent = `${formatCurrency(suite.basePriceUSD, currentCurrency)} / night`;
  }

  if (featuresList) {
    featuresList.innerHTML = suite.features
      .map(feat => `
        <li class="flex items-start space-x-3 text-slate-300">
          <svg class="w-5 h-5 text-slate-100 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="text-sm font-light leading-relaxed">${feat}</span>
        </li>
      `)
      .join('');
  }

  if (bookBtn) {
    bookBtn.onclick = () => {
      closeSuiteModal();
      openBookingModal(suite.id);
    };
  }

  if (modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }
}

function closeSuiteModal() {
  const modal = document.getElementById('suite-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

// --- 4. Interactive Booking Modal & Calculation ---
function openBookingModal(preselectedSuite = 'chalet') {
  const modal = document.getElementById('booking-modal');
  const suiteSelect = document.getElementById('booking-suite-select');
  
  if (suiteSelect && preselectedSuite) {
    suiteSelect.value = preselectedSuite;
  }

  // Pre-fill default dates (tomorrow and +3 days)
  const checkinInput = document.getElementById('booking-checkin');
  const checkoutInput = document.getElementById('booking-checkout');
  
  if (checkinInput && !checkinInput.value) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 7);
    checkinInput.value = tomorrow.toISOString().split('T')[0];
  }
  
  if (checkoutInput && !checkoutInput.value) {
    const depart = new Date();
    depart.setDate(depart.getDate() + 11);
    checkoutInput.value = depart.toISOString().split('T')[0];
  }

  updateBookingSummary();

  if (modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }
}

function closeBookingModal() {
  const modal = document.getElementById('booking-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

function updateBookingSummary() {
  const suiteSelect = document.getElementById('booking-suite-select');
  const checkinInput = document.getElementById('booking-checkin');
  const checkoutInput = document.getElementById('booking-checkout');
  const summaryNights = document.getElementById('booking-summary-nights');
  const summaryRate = document.getElementById('booking-summary-rate');
  const summaryTotal = document.getElementById('booking-summary-total');

  if (!suiteSelect) return;

  const suiteKey = suiteSelect.value || 'chalet';
  const suite = SUITES_DATA[suiteKey];
  if (!suite) return;

  let nights = 4;
  if (checkinInput && checkoutInput && checkinInput.value && checkoutInput.value) {
    const d1 = new Date(checkinInput.value);
    const d2 = new Date(checkoutInput.value);
    const diffTime = d2.getTime() - d1.getTime();
    const calculatedNights = Math.round(diffTime / (1000 * 3600 * 24));
    if (calculatedNights > 0) nights = calculatedNights;
  }

  const rateFormatted = formatCurrency(suite.basePriceUSD, currentCurrency);
  const totalUSD = suite.basePriceUSD * nights;
  const totalFormatted = formatCurrency(totalUSD, currentCurrency);

  if (summaryNights) summaryNights.textContent = `${nights} Night${nights > 1 ? 's' : ''}`;
  if (summaryRate) summaryRate.textContent = `${rateFormatted} / night`;
  if (summaryTotal) summaryTotal.textContent = totalFormatted;
}

// Handle Reservation Form Submit
function handleReservationSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const guestName = document.getElementById('booking-name')?.value || 'Honored Guest';
  const suiteKey = document.getElementById('booking-suite-select')?.value || 'chalet';
  const suite = SUITES_DATA[suiteKey];
  const totalStr = document.getElementById('booking-summary-total')?.textContent || '$3,400';

  closeBookingModal();

  // Generate reference number
  const refCode = 'SWG-' + Math.floor(100000 + Math.random() * 900000);

  // Show Confirmation Toast Modal
  showConfirmationToast(guestName, suite.name, refCode, totalStr);
  form.reset();
}

function showConfirmationToast(name, suiteName, refCode, totalStr) {
  const toast = document.getElementById('confirmation-toast');
  const guestEl = document.getElementById('toast-guest-name');
  const suiteEl = document.getElementById('toast-suite-name');
  const refEl = document.getElementById('toast-ref-code');
  const totalEl = document.getElementById('toast-total-amount');

  if (guestEl) guestEl.textContent = name;
  if (suiteEl) suiteEl.textContent = suiteName;
  if (refEl) refEl.textContent = refCode;
  if (totalEl) totalEl.textContent = totalStr;

  if (toast) {
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('opacity-100', 'translate-y-0');
      toast.classList.remove('opacity-0', 'translate-y-8');
    }, 10);
  }
}

function closeConfirmationToast() {
  const toast = document.getElementById('confirmation-toast');
  if (toast) {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-8');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 300);
  }
}

// --- 5. Navigation & Scroll Effects ---
function initNavigation() {
  const navbar = document.getElementById('main-nav');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('bg-slate-950/85', 'backdrop-blur-md', 'shadow-2xl', 'py-3');
      navbar?.classList.remove('py-5');
    } else {
      navbar?.classList.remove('bg-slate-950/85', 'backdrop-blur-md', 'shadow-2xl', 'py-3');
      navbar?.classList.add('py-5');
    }
  });

  mobileMenuBtn?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('hidden');
  });

  // Close mobile menu on anchor click
  document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu?.classList.add('hidden');
    });
  });
}

// --- Initialization on DOM Load ---
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Weather & Himalayan Clock
  initWeatherTicker();

  // Initialize Navigation Scroll Handlers
  initNavigation();

  // Currency Selector Clicks
  document.querySelectorAll('.currency-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const code = e.currentTarget.dataset.currency;
      if (code) updatePrices(code);
    });
  });

  // Suite Modal Triggers
  document.querySelectorAll('[data-open-suite]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const suiteId = e.currentTarget.dataset.openSuite;
      openSuiteModal(suiteId);
    });
  });

  // Quick Book Triggers
  document.querySelectorAll('[data-quick-book]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const suiteId = e.currentTarget.dataset.quickBook;
      openBookingModal(suiteId);
    });
  });

  // Booking Form Inputs change listener for real-time recalculation
  ['booking-suite-select', 'booking-checkin', 'booking-checkout', 'booking-guests'].forEach(id => {
    const el = document.getElementById(id);
    el?.addEventListener('change', updateBookingSummary);
  });

  // Floating Hero Reservation Bar Search
  const heroSearchBtn = document.getElementById('hero-check-availability');
  heroSearchBtn?.addEventListener('click', () => {
    const heroSuite = document.getElementById('hero-suite-select')?.value || 'chalet';
    openBookingModal(heroSuite);
  });

  // Initialize default prices
  updatePrices('USD');
});
