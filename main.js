/**
 * Company Profile - Interactive JavaScript (Tailwind CSS v4 Compatible)
 * Features:
 * - Sticky Header dynamic backdrop blur & shadow on scroll
 * - IntersectionObserver scroll reveal motion
 * - Number counter animation for statistics banner
 * - Interactive FAQ accordion with smooth open/close
 * - Pricing switch (Monthly / Yearly) with price updates
 * - Filter pills active state toggle
 * - Testimonial card slider/switcher
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        siteHeader.classList.add('shadow-md', 'shadow-slate-200/50', 'bg-white/95');
        siteHeader.classList.remove('bg-white/80');
      } else {
        siteHeader.classList.remove('shadow-md', 'shadow-slate-200/50', 'bg-white/95');
        siteHeader.classList.add('bg-white/80');
      }
    });
  }

  // 1b. Dynamic Navigation Active State (ScrollSpy & Click)
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const navIds = ['home', 'about', 'services', 'projects', 'testimonials', 'contact'];
  const navItems = navIds
    .map(id => ({ id, el: document.getElementById(id) }))
    .filter(item => item.el !== null);

  function setActiveNavLink(activeId) {
    // Desktop navigation links
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Mobile navigation links
    mobileNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.classList.add('active', 'text-[#6576ff]', 'font-semibold', 'bg-[#6576ff]/10');
        link.classList.remove('text-slate-700');
      } else {
        link.classList.remove('active', 'text-[#6576ff]', 'font-semibold', 'bg-[#6576ff]/10');
        link.classList.add('text-slate-700');
      }
    });
  }

  let isManualNavClick = false;
  let manualClickTimer = null;

  function onScrollSpy() {
    if (isManualNavClick) return;

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 1. If at or near bottom (within 120px), activate 'contact'
    if (windowHeight + scrollY >= documentHeight - 120) {
      setActiveNavLink('contact');
      return;
    }

    // 2. If at the very top of the page (< 150px), activate 'home'
    if (scrollY < 150) {
      setActiveNavLink('home');
      return;
    }

    // 3. Find current active section based on true viewport position
    // Trigger point is 160px from the top of the viewport (below sticky navbar)
    const triggerY = scrollY + 160;

    // Check sections from bottom to top
    const reversed = [...navItems].reverse();
    for (const item of reversed) {
      const top = item.el.getBoundingClientRect().top + window.scrollY;
      if (triggerY >= top) {
        setActiveNavLink(item.id);
        return;
      }
    }

    setActiveNavLink('home');
  }

  window.addEventListener('scroll', onScrollSpy, { passive: true });
  window.addEventListener('resize', onScrollSpy, { passive: true });
  onScrollSpy(); // Initial check

  // Click handler for smooth scrolling with sticky header offset
  const allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href')?.replace('#', '');
      const targetEl = targetId ? document.getElementById(targetId) : null;

      if (targetEl) {
        e.preventDefault();
        setActiveNavLink(targetId);
        isManualNavClick = true;

        const headerHeight = siteHeader ? siteHeader.offsetHeight : 70;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight + 5;

        window.scrollTo({
          top: targetPos < 0 ? 0 : targetPos,
          behavior: 'smooth'
        });

        clearTimeout(manualClickTimer);
        manualClickTimer = setTimeout(() => {
          isManualNavClick = false;
          onScrollSpy();
        }, 900);
      }
    });
  });

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Auto-close mobile drawer when any link is clicked
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 2. Scroll Reveal Motion (IntersectionObserver)
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // 3. Animated Number Counter for Stats Banner
  const statsBanner = document.querySelector('.stats-banner');
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsTriggered = false;

  if (statsBanner && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !statsTriggered) {
            statsTriggered = true;
            statNumbers.forEach(counter => {
              const target = parseInt(counter.getAttribute('data-target'), 10);
              const suffix = counter.getAttribute('data-suffix') || '';
              const prefix = counter.getAttribute('data-prefix') || '';
              const duration = 1800; // ms
              const frameRate = 1000 / 60;
              const totalFrames = Math.round(duration / frameRate);
              let frame = 0;

              const timer = setInterval(() => {
                frame++;
                const progress = frame / totalFrames;
                // Ease out cubic
                const currentVal = Math.round(target * (1 - Math.pow(1 - progress, 3)));
                counter.textContent = `${prefix}${currentVal.toLocaleString()}${suffix}`;

                if (frame >= totalFrames) {
                  counter.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
                  clearInterval(timer);
                }
              }, frameRate);
            });
          }
        });
      },
      { threshold: 0.25 }
    );

    statsObserver.observe(statsBanner);
  }

  // 4. Interactive FAQ Accordion (Smooth CSS Grid Transition)
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');

    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other items smoothly
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
        } else {
          item.classList.add('active');
        }
      });
    }
  });

  // 5. Pricing Toggle (Monthly / Yearly)
  const toggleButtons = document.querySelectorAll('.toggle-option-btn');
  const priceValues = document.querySelectorAll('.pricing-price-val');
  const pricePeriods = document.querySelectorAll('.pricing-period');

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleButtons.forEach(b => {
        b.classList.remove('active', 'bg-white', 'text-[#6576ff]', 'shadow-sm');
        b.classList.add('text-white');
      });

      btn.classList.add('active', 'bg-white', 'text-[#6576ff]', 'shadow-sm');
      btn.classList.remove('text-white');

      const isYearly = btn.dataset.period === 'yearly';
      priceValues.forEach(priceEl => {
        const monthly = priceEl.dataset.monthly;
        const yearly = priceEl.dataset.yearly;
        priceEl.textContent = isYearly ? yearly : monthly;
      });

      pricePeriods.forEach(periodEl => {
        periodEl.textContent = isYearly ? '/yr' : '/mo';
      });
    });
  });

  // 6. Category / Service Filter Pills
  const filterPills = document.querySelectorAll('.filter-pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('active', 'bg-[#6576ff]', 'text-white', 'border-[#6576ff]', 'shadow-md', 'shadow-[#6576ff]/35');
        p.classList.add('bg-white', 'text-slate-700', 'border-slate-200', 'shadow-sm');
      });

      pill.classList.add('active', 'bg-[#6576ff]', 'text-white', 'border-[#6576ff]', 'shadow-md', 'shadow-[#6576ff]/35');
      pill.classList.remove('bg-white', 'text-slate-700', 'border-slate-200', 'shadow-sm');
    });
  });

  // 7. Testimonials Responsive Autoplay Carousel Slider (Auto-slides every 3.5s)
  const testiTrack = document.getElementById('testi-slider-track');
  const testiWrapper = document.getElementById('testi-wrapper');
  const testiPrev = document.getElementById('testi-prev');
  const testiNext = document.getElementById('testi-next');
  const testiDotsContainer = document.getElementById('testi-dots');

  if (testiTrack && testiWrapper) {
    let currentTestiSlide = 0;
    let testiAutoplayTimer = null;
    const totalTestiItems = 6;

    function getTestiCardsPerSlide() {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }

    function getTotalTestiSlides() {
      const perSlide = getTestiCardsPerSlide();
      return Math.ceil(totalTestiItems / perSlide);
    }

    function renderTestiDots() {
      if (!testiDotsContainer) return;
      const totalSlides = getTotalTestiSlides();
      testiDotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = `h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
          i === currentTestiSlide ? 'bg-white w-7' : 'bg-white/40 hover:bg-white/70 w-2.5'
        }`;
        dot.setAttribute('data-slide', i);
        dot.setAttribute('aria-label', `Go to Testimonial Slide ${i + 1}`);
        dot.addEventListener('click', () => {
          updateTestiSlide(i);
          resetTestiAutoplay();
        });
        testiDotsContainer.appendChild(dot);
      }
    }

    function updateTestiSlide(index) {
      const totalSlides = getTotalTestiSlides();
      currentTestiSlide = (index + totalSlides) % totalSlides;
      const shiftX = currentTestiSlide * testiWrapper.clientWidth;
      testiTrack.style.transform = `translateX(-${shiftX}px)`;

      if (testiDotsContainer) {
        const dots = testiDotsContainer.children;
        for (let i = 0; i < dots.length; i++) {
          if (i === currentTestiSlide) {
            dots[i].className = 'h-2.5 rounded-full transition-all duration-300 cursor-pointer bg-white w-7';
          } else {
            dots[i].className = 'h-2.5 rounded-full transition-all duration-300 cursor-pointer bg-white/40 hover:bg-white/70 w-2.5';
          }
        }
      }
    }

    function startTestiAutoplay() {
      stopTestiAutoplay();
      testiAutoplayTimer = setInterval(() => {
        updateTestiSlide(currentTestiSlide + 1);
      }, 3500);
    }

    function stopTestiAutoplay() {
      if (testiAutoplayTimer) {
        clearInterval(testiAutoplayTimer);
        testiAutoplayTimer = null;
      }
    }

    function resetTestiAutoplay() {
      stopTestiAutoplay();
      startTestiAutoplay();
    }

    if (testiNext) {
      testiNext.addEventListener('click', () => {
        updateTestiSlide(currentTestiSlide + 1);
        resetTestiAutoplay();
      });
    }

    if (testiPrev) {
      testiPrev.addEventListener('click', () => {
        updateTestiSlide(currentTestiSlide - 1);
        resetTestiAutoplay();
      });
    }

    // Pause on hover for easy reading
    testiWrapper.addEventListener('mouseenter', stopTestiAutoplay);
    testiWrapper.addEventListener('mouseleave', startTestiAutoplay);

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    testiTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopTestiAutoplay();
    }, { passive: true });

    testiTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 40) {
        updateTestiSlide(currentTestiSlide + 1);
      } else if (touchEndX - touchStartX > 40) {
        updateTestiSlide(currentTestiSlide - 1);
      }
      startTestiAutoplay();
    }, { passive: true });

    window.addEventListener('resize', () => {
      const totalSlides = getTotalTestiSlides();
      if (currentTestiSlide >= totalSlides) {
        currentTestiSlide = totalSlides - 1;
      }
      renderTestiDots();
      updateTestiSlide(currentTestiSlide);
    });

    // Initial setup
    renderTestiDots();
    updateTestiSlide(0);
    startTestiAutoplay();
  }

  // 8. Projects True Seamless Infinite Carousel Slider
  const projectsTrack = document.getElementById('projects-slider-track');
  const projectsWrapper = projectsTrack ? projectsTrack.parentElement : null;
  const projectsPrev = document.getElementById('projects-prev');
  const projectsNext = document.getElementById('projects-next');

  if (projectsTrack && projectsWrapper) {
    const originalItems = Array.from(projectsTrack.children);
    const totalOriginal = originalItems.length;

    if (totalOriginal > 0) {
      // 1. Clone items to both ends to achieve seamless bidirectional infinite looping
      originalItems.forEach(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('project-clone');
        projectsTrack.appendChild(clone);
      });

      [...originalItems].reverse().forEach(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('project-clone');
        projectsTrack.insertBefore(clone, projectsTrack.firstChild);
      });

      // Start at the first original item (index = totalOriginal)
      let currentIndex = totalOriginal;
      let isTransitioning = false;
      let projectsAutoplayTimer = null;

      function getItemWidth() {
        const firstItem = projectsTrack.children[0];
        return firstItem ? firstItem.getBoundingClientRect().width : (projectsWrapper.clientWidth / 3);
      }

      function setPosition(animate = true) {
        const itemWidth = getItemWidth();
        if (animate) {
          projectsTrack.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
        } else {
          projectsTrack.style.transition = 'none';
        }
        projectsTrack.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
      }

      function moveToNext() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        setPosition(true);
      }

      function moveToPrev() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex--;
        setPosition(true);
      }

      // Seamless snap on transition end (zero visual jump)
      projectsTrack.addEventListener('transitionend', () => {
        isTransitioning = false;
        // If moved past the original set into end clones
        if (currentIndex >= totalOriginal * 2) {
          currentIndex = totalOriginal + (currentIndex % totalOriginal);
          setPosition(false);
          void projectsTrack.offsetHeight; // force reflow
        }
        // If moved backward into start clones
        else if (currentIndex < totalOriginal) {
          currentIndex = totalOriginal * 2 - (totalOriginal - currentIndex);
          setPosition(false);
          void projectsTrack.offsetHeight;
        }
      });

      function startProjectsAutoplay() {
        stopProjectsAutoplay();
        projectsAutoplayTimer = setInterval(() => {
          moveToNext();
        }, 3200);
      }

      function stopProjectsAutoplay() {
        if (projectsAutoplayTimer) {
          clearInterval(projectsAutoplayTimer);
          projectsAutoplayTimer = null;
        }
      }

      function resetProjectsAutoplay() {
        stopProjectsAutoplay();
        startProjectsAutoplay();
      }

      if (projectsNext) {
        projectsNext.addEventListener('click', () => {
          moveToNext();
          resetProjectsAutoplay();
        });
      }

      if (projectsPrev) {
        projectsPrev.addEventListener('click', () => {
          moveToPrev();
          resetProjectsAutoplay();
        });
      }

      // Pause on hover
      projectsWrapper.addEventListener('mouseenter', stopProjectsAutoplay);
      projectsWrapper.addEventListener('mouseleave', startProjectsAutoplay);

      // Touch swipe support for mobile/tablet
      let touchStartX = 0;
      let touchEndX = 0;

      projectsTrack.addEventListener('touchstart', (e) => {
        stopProjectsAutoplay();
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      projectsTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (diff > 40) {
          moveToNext();
        } else if (diff < -40) {
          moveToPrev();
        }
        startProjectsAutoplay();
      }, { passive: true });

      // Handle resize without animation glitch
      window.addEventListener('resize', () => {
        setPosition(false);
      }, { passive: true });

      // Initialize position and start autoplay
      setPosition(false);
      startProjectsAutoplay();
    }
  }

  // 9. Case Study Detail Modal Logic & Data
  const caseStudies = {
    1: {
      category: 'Mobile Application',
      title: 'Buku Catatan Arisan',
      image: 'assets/buku-arisan.png',
      client: 'Komunitas & UMKM Nusantara',
      timeline: '6 Weeks',
      deliverable: 'Mobile App & Management System',
      bannerGradient: 'from-blue-100 via-indigo-50 to-blue-200',
      overview: 'Aplikasi Buku Catatan Arisan dirancang untuk memudahkan pengurus dan anggota arisan mencatat pembayaran, mengundi pemenang secara transparan, menjadwalkan putaran, hingga membuat laporan keuangan otomatis.',
      challenge: 'Pengelolaan arisan tradisional rawan kesalahan pencatatan manual di buku fisik, keraguan transparansi undian giliran, serta kesulitan pemantauan status pembayaran antar anggota.',
      solution: 'Membangun aplikasi mobile interaktif dengan sistem sinkronisasi cloud real-time, pengundian acak terverifikasi, pelacakan pembayaran visual, dan laporan berkala yang transparan.',
      metrics: [
        { label: 'Efisiensi Catat', value: '10x' },
        { label: 'Transparansi', value: '100%' },
        { label: 'Kepuasan Anggota', value: '4.9 ★' }
      ],
      tags: ['Mobile App', 'FinTech', 'Cloud Sync', 'UI/UX Design', 'Payment Tracker']
    },
    2: {
      category: 'Mobile Game',
      title: 'Candy Blast Game',
      image: 'assets/candy-blast.jpg',
      client: 'GameStudio Entertainment',
      timeline: '10 Weeks',
      deliverable: '2D Casual Puzzle Mobile Game',
      bannerGradient: 'from-pink-100 via-rose-50 to-amber-100',
      overview: 'Candy Blast adalah game puzzle blok kasual bertema buah dan permen manis dengan grafis memukau, efek kilau menarik, kontrol responsif, dan gameplay yang menyenangkan untuk melatih ketangkasan berpikir.',
      challenge: 'Memastikan game berukuran ringan dengan loading instan tanpa mengorbankan kualitas animasi partikel, kelancaran 60 FPS di berbagai perangkat, serta retensi harian pemain.',
      solution: 'Mengoptimalkan rendering sprite 2D, logika game state modular, dynamic particle emitter yang hemat daya, serta sistem pencapaian skor dan leaderboard yang kompetitif.',
      metrics: [
        { label: 'Smoothness', value: '60 FPS' },
        { label: 'Retensi Pemain', value: '+65%' },
        { label: 'Rating Pemain', value: '4.8 ★' }
      ],
      tags: ['Game Development', 'Casual Game', 'Animation', 'UI/UX Game', 'Mobile']
    },
    3: {
      category: 'Islamic & EdTech App',
      title: 'Mutqin - Hafalan Quran',
      image: 'assets/mutqin.jpg',
      client: 'Yayasan Tahfidz Digital',
      timeline: '8 Weeks',
      deliverable: 'Tahfidz Tracker & Quran Companion',
      bannerGradient: 'from-emerald-100 via-teal-50 to-emerald-200',
      overview: 'Mutqin adalah aplikasi pendamping santri dan muslim untuk membantu menghafal, membaca, menyetorkan hafalan ke pembimbing, serta menjaga kualitas hafalan Al-Qur\'an secara istiqomah dan teratur.',
      challenge: 'Banyak penghafal kesulitan menjaga ritme istiqomah muraja\'ah harian dan pembimbing kesulitan memantau riwayat setoran serta detail perkembangan hafalan santri.',
      solution: 'Mengembangkan sistem tracking target hafalan per juz/halaman, pencatatan evaluasi setoran terstruktur, indikator streak motivasional harian, dan ringkasan pencapaian yang rapi.',
      metrics: [
        { label: 'Kepatuhan Muraja\'ah', value: '+85%' },
        { label: 'Efisiensi Evaluasi', value: '4x' },
        { label: 'Review Pengguna', value: '4.9 ★' }
      ],
      tags: ['EdTech', 'Islamic App', 'Progress Tracker', 'Mobile UI', 'Cloud Data']
    },
    4: {
      category: 'Mobile Application',
      title: 'FinTech Banking Mobile App',
      client: 'NovaPay Capital',
      timeline: '16 Weeks',
      deliverable: 'iOS & Android App',
      bannerGradient: 'from-cyan-100 via-blue-50 to-indigo-100',
      overview: 'High-performance cross-platform financial application delivering biometric authentication, real-time FX conversions, instant remittances, and crypto wallet management in one unified app.',
      challenge: 'Balancing stringent financial compliance (PCI-DSS, 2FA, biometric signing) with an effortless, consumer-grade user onboarding experience taking under 2 minutes.',
      solution: 'Engineered a Flutter mobile application featuring real-time WebSocket ledger streams, encrypted local biometrics, and a simplified 3-step KYC verification flow.',
      metrics: [
        { label: 'App Store Rating', value: '4.9 ★' },
        { label: 'Transaction Uptime', value: '99.99%' },
        { label: 'Active App Users', value: '1.2M+' }
      ],
      tags: ['Flutter / Dart', 'Biometrics', 'REST API', 'AWS KMS', 'Firebase']
    },
    5: {
      category: 'E-Commerce & Shopify',
      title: 'Global E-Commerce Platform',
      client: 'Veloce Luxury Apparel',
      timeline: '10 Weeks',
      deliverable: 'Headless E-Commerce Store',
      bannerGradient: 'from-emerald-100 via-teal-50 to-blue-100',
      overview: 'Scalable headless store built for 10M+ annual visitors with ultra-fast checkout, localized multicurrency support, and custom warehouse inventory sync.',
      challenge: 'The client lost substantial revenue during peak flash drops due to server timeouts and checkout cart abandonment on mobile devices (74% cart abandonment).',
      solution: 'Re-architected the store using headless Shopify Plus with edge-cached product catalogs, a 1-click Apple Pay & Google Pay checkout flow, and automated tax computation.',
      metrics: [
        { label: 'Checkout Conversion', value: '+68%' },
        { label: 'Page Load Speed', value: '1.1s' },
        { label: 'Black Friday GMV', value: '$14.2M' }
      ],
      tags: ['Shopify Plus API', 'Hydrogen', 'React', 'Tailwind CSS', 'Stripe Payments']
    },
    6: {
      category: 'Product Design & AI',
      title: 'AI Analytics Dashboard Portal',
      client: 'Synthetix AI Systems',
      timeline: '14 Weeks',
      deliverable: 'Enterprise SaaS Intelligence Platform',
      bannerGradient: 'from-violet-100 via-indigo-50 to-blue-100',
      overview: 'Intuitive enterprise SaaS intelligence platform featuring real-time data streaming, automated anomaly detection, and interactive AI-driven predictive insights.',
      challenge: 'Enterprise decision-makers were overwhelmed by complex tabular reports containing millions of data points, causing low user adoption and lengthy analysis cycles.',
      solution: 'Designed an interactive card-based widget workspace with drag-and-drop customization, natural-language query filters, and instant automated anomaly highlight cards.',
      metrics: [
        { label: 'Time-to-Insight', value: '-85%' },
        { label: 'Executive Adoption', value: '94%' },
        { label: 'Query Latency', value: '<50ms' }
      ],
      tags: ['React', 'Python FastApi', 'Chart.js', 'WebSockets', 'Tailwind CSS']
    },
    7: {
      category: 'Logistics & Supply Chain',
      title: 'Warehouse Management System (WMS)',
      image: 'assets/warehouse.png',
      client: 'RAY Cargo Logistics',
      timeline: '12 Weeks',
      deliverable: 'Web & Mobile Warehouse Management System',
      bannerGradient: 'from-blue-100 via-indigo-50 to-slate-200',
      overview: 'Sistem manajemen pergudangan (Warehouse Management System) cerdas untuk mengelola seluruh siklus operasional logistik, mulai dari penerimaan barang (Inbound), alokasi palet & rak penyimpanan, hingga proses pengiriman kargo (Outbound) dengan pelacakan real-time.',
      challenge: 'Tantangan operasional gudang bertrafik tinggi mencakup pelacakan alur barang masuk/keluar yang kompleks, pemindahan palet antar invoice, serta risiko selisih stok (discrepancy) dalam pencatatan manual.',
      solution: 'Membangun aplikasi web & mobile WMS terintegrasi dengan pemindaian barcode/QR palet instan, alur verifikasi digital Inbound & Outbound, transfer palet antar invoice dinamis, serta laporan mutasi stok otomatis.',
      metrics: [
        { label: 'Akurasi Stok', value: '99.8%' },
        { label: 'Efisiensi Inbound', value: '3x' },
        { label: 'Human Error', value: '-85%' }
      ],
      tags: ['Warehouse System', 'Inbound & Outbound', 'Logistics', 'Pallet Management', 'QR Scan', 'Inventory']
    }
  };

  const caseModal = document.getElementById('case-study-modal');
  const caseDialog = document.getElementById('case-study-dialog');
  const caseBackdrop = document.getElementById('case-study-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalSecondaryClose = document.getElementById('modal-secondary-close');
  const modalCtaBtn = document.getElementById('modal-cta-btn');

  function openCaseStudyModal(projectId) {
    const data = caseStudies[projectId];
    if (!data || !caseModal) return;

    // Populate header & metadata
    const categoryEl = document.getElementById('modal-category');
    const titleEl = document.getElementById('modal-title');
    const clientEl = document.getElementById('modal-client');
    const timelineEl = document.getElementById('modal-timeline');
    const deliverableEl = document.getElementById('modal-deliverable');
    const overviewEl = document.getElementById('modal-overview');
    const challengeEl = document.getElementById('modal-challenge');
    const solutionEl = document.getElementById('modal-solution');
    const bannerEl = document.getElementById('modal-banner');
    const bannerImgEl = document.getElementById('modal-banner-img');
    const bannerOverlayEl = document.getElementById('modal-banner-overlay');
    const glow1 = document.getElementById('modal-glow-1');
    const glow2 = document.getElementById('modal-glow-2');
    const metricsEl = document.getElementById('modal-metrics');
    const tagsEl = document.getElementById('modal-tags');

    if (categoryEl) categoryEl.textContent = data.category;
    if (titleEl) titleEl.textContent = data.title;
    if (clientEl) clientEl.textContent = data.client;
    if (timelineEl) timelineEl.textContent = data.timeline;
    if (deliverableEl) deliverableEl.textContent = data.deliverable;
    if (overviewEl) overviewEl.textContent = data.overview;
    if (challengeEl) challengeEl.textContent = data.challenge;
    if (solutionEl) solutionEl.textContent = data.solution;

    // Header image display: full fit when image exists, or stylish gradient fallback
    if (bannerEl) {
      if (data.image) {
        if (bannerImgEl) {
          bannerImgEl.src = data.image;
          bannerImgEl.alt = data.title;
          bannerImgEl.classList.remove('hidden');
        }
        if (bannerOverlayEl) bannerOverlayEl.classList.remove('hidden');
        if (glow1) glow1.classList.add('hidden');
        if (glow2) glow2.classList.add('hidden');
        bannerEl.className = 'relative w-full h-64 sm:h-72 md:h-80 bg-slate-950 p-6 sm:p-8 flex flex-col justify-end overflow-hidden';
        if (titleEl) {
          titleEl.className = 'text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight';
        }
      } else {
        if (bannerImgEl) {
          bannerImgEl.src = '';
          bannerImgEl.classList.add('hidden');
        }
        if (bannerOverlayEl) bannerOverlayEl.classList.add('hidden');
        if (glow1) glow1.classList.remove('hidden');
        if (glow2) glow2.classList.remove('hidden');
        bannerEl.className = `relative w-full h-56 sm:h-64 bg-gradient-to-br ${data.bannerGradient} p-6 sm:p-8 flex flex-col justify-end overflow-hidden`;
        if (titleEl) {
          titleEl.className = 'text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight';
        }
      }
    }

    if (metricsEl) {
      metricsEl.innerHTML = data.metrics.map(m => `
        <div class="bg-white rounded-2xl p-4 text-center border border-slate-100 shadow-sm">
          <span class="block text-xl sm:text-2xl font-extrabold text-[#6576ff] mb-1">${m.value}</span>
          <span class="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">${m.label}</span>
        </div>
      `).join('');
    }

    if (tagsEl) {
      tagsEl.innerHTML = data.tags.map(tag => `
        <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60">
          ${tag}
        </span>
      `).join('');
    }

    // Entrance animation
    caseModal.classList.remove('opacity-0', 'pointer-events-none');
    caseModal.classList.add('opacity-100');
    if (caseDialog) {
      caseDialog.classList.remove('scale-95');
      caseDialog.classList.add('scale-100');
    }
    document.body.classList.add('overflow-hidden');
  }

  function closeCaseStudyModal() {
    if (!caseModal) return;
    caseModal.classList.remove('opacity-100');
    caseModal.classList.add('opacity-0', 'pointer-events-none');
    if (caseDialog) {
      caseDialog.classList.remove('scale-100');
      caseDialog.classList.add('scale-95');
    }
    document.body.classList.remove('overflow-hidden');
  }

  // Trigger modal on card click or button click (supports original and cloned infinite slider cards)
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.project-card, .open-case-study-btn');
    if (trigger) {
      e.preventDefault();
      const id = trigger.getAttribute('data-project-id') || trigger.closest('[data-project-id]')?.getAttribute('data-project-id');
      if (id) {
        openCaseStudyModal(id);
      }
    }
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCaseStudyModal);
  if (modalSecondaryClose) modalSecondaryClose.addEventListener('click', closeCaseStudyModal);
  if (caseBackdrop) caseBackdrop.addEventListener('click', closeCaseStudyModal);

  if (modalCtaBtn) {
    modalCtaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeCaseStudyModal();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        const headerHeight = header ? header.offsetHeight : 80;
        const targetY = contactSection.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && caseModal && !caseModal.classList.contains('pointer-events-none')) {
      closeCaseStudyModal();
    }
  });
});
