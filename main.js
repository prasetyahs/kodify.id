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

  // 7. Testimonials True Seamless Infinite Carousel Slider
  const testiTrack = document.getElementById('testi-slider-track');
  const testiWrapper = document.getElementById('testi-wrapper');
  const testiPrev = document.getElementById('testi-prev');
  const testiNext = document.getElementById('testi-next');

  if (testiTrack && testiWrapper) {
    const originalTestiItems = Array.from(testiTrack.children);
    const totalOriginalTesti = originalTestiItems.length;

    if (totalOriginalTesti > 0) {
      // 1. Clone items to both ends to achieve seamless bidirectional infinite looping
      originalTestiItems.forEach(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('testi-clone');
        testiTrack.appendChild(clone);
      });

      [...originalTestiItems].reverse().forEach(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('testi-clone');
        testiTrack.insertBefore(clone, testiTrack.firstChild);
      });

      // Start at the first original item (index = totalOriginalTesti)
      let currentTestiIndex = totalOriginalTesti;
      let isTestiTransitioning = false;
      let testiAutoplayTimer = null;

      function getTestiItemWidth() {
        const firstItem = testiTrack.children[0];
        return firstItem ? firstItem.getBoundingClientRect().width : (testiWrapper.clientWidth / 3);
      }

      function setTestiPosition(animate = true) {
        const itemWidth = getTestiItemWidth();
        if (animate) {
          testiTrack.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
        } else {
          testiTrack.style.transition = 'none';
        }
        testiTrack.style.transform = `translateX(-${currentTestiIndex * itemWidth}px)`;
      }

      function moveTestiNext() {
        if (isTestiTransitioning) return;
        isTestiTransitioning = true;
        currentTestiIndex++;
        setTestiPosition(true);
      }

      function moveTestiPrev() {
        if (isTestiTransitioning) return;
        isTestiTransitioning = true;
        currentTestiIndex--;
        setTestiPosition(true);
      }

      // Seamless snap on transition end (zero visual jump)
      testiTrack.addEventListener('transitionend', () => {
        isTestiTransitioning = false;
        // If moved past the original set into end clones
        if (currentTestiIndex >= totalOriginalTesti * 2) {
          currentTestiIndex = totalOriginalTesti + (currentTestiIndex % totalOriginalTesti);
          setTestiPosition(false);
          void testiTrack.offsetHeight; // force reflow
        }
        // If moved backward into start clones
        else if (currentTestiIndex < totalOriginalTesti) {
          currentTestiIndex = totalOriginalTesti * 2 - (totalOriginalTesti - currentTestiIndex);
          setTestiPosition(false);
          void testiTrack.offsetHeight;
        }
      });

      function startTestiAutoplay() {
        stopTestiAutoplay();
        testiAutoplayTimer = setInterval(() => {
          moveTestiNext();
        }, 3200);
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
          moveTestiNext();
          resetTestiAutoplay();
        });
      }

      if (testiPrev) {
        testiPrev.addEventListener('click', () => {
          moveTestiPrev();
          resetTestiAutoplay();
        });
      }

      // Pause on hover
      testiWrapper.addEventListener('mouseenter', stopTestiAutoplay);
      testiWrapper.addEventListener('mouseleave', startTestiAutoplay);

      // Touch swipe support for mobile/tablet
      let touchStartX = 0;
      let touchEndX = 0;

      testiTrack.addEventListener('touchstart', (e) => {
        stopTestiAutoplay();
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      testiTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (diff > 40) {
          moveTestiNext();
        } else if (diff < -40) {
          moveTestiPrev();
        }
        startTestiAutoplay();
      }, { passive: true });

      // Handle resize without animation glitch
      window.addEventListener('resize', () => {
        setTestiPosition(false);
      }, { passive: true });

      // Initialize position and start autoplay
      setTestiPosition(false);
      startTestiAutoplay();
    }
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
      category: 'Aplikasi Mobile',
      title: 'Buku Catatan Arisan',
      image: 'assets/buku-arisan.png',
      client: 'Komunitas & UMKM Nusantara',
      timeline: '6 Minggu',
      deliverable: 'Aplikasi Mobile & Sistem Manajemen',
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
      category: 'Game Mobile 2D',
      title: 'Candy Blast Game',
      image: 'assets/candy-blast.jpg',
      client: 'GameStudio Entertainment',
      timeline: '10 Minggu',
      deliverable: 'Game Mobile Kasual 2D',
      bannerGradient: 'from-pink-100 via-rose-50 to-amber-100',
      overview: 'Candy Blast adalah game puzzle blok kasual bertema buah dan permen manis dengan grafis memukau, efek kilau menarik, kontrol responsif, dan gameplay yang menyenangkan untuk melatih ketangkasan berpikir.',
      challenge: 'Memastikan game berukuran ringan dengan loading instan tanpa mengorbankan kualitas animasi partikel, kelancaran 60 FPS di berbagai perangkat, serta retensi harian pemain.',
      solution: 'Mengoptimalkan rendering sprite 2D, logika game state modular, dynamic particle emitter yang hemat daya, serta sistem pencapaian skor dan leaderboard yang kompetitif.',
      metrics: [
        { label: 'Kelancaran', value: '60 FPS' },
        { label: 'Retensi Pemain', value: '+65%' },
        { label: 'Rating Pemain', value: '4.8 ★' }
      ],
      tags: ['Game Development', 'Casual Game', 'Animation', 'UI/UX Game', 'Mobile']
    },
    3: {
      category: 'Aplikasi Islami & EdTech',
      title: 'Mutqin - Hafalan Quran',
      image: 'assets/mutqin.jpg',
      client: 'Yayasan Tahfidz Digital',
      timeline: '8 Minggu',
      deliverable: 'Aplikasi Tracker Tahfidz & Quran Companion',
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
      category: 'Logistik & Rantai Pasok',
      title: 'Warehouse Management System (WMS)',
      image: 'assets/warehouse.png',
      client: 'RAY Cargo Logistics',
      timeline: '12 Minggu',
      deliverable: 'Sistem Pergudangan Web & Mobile (WMS)',
      bannerGradient: 'from-blue-100 via-indigo-50 to-slate-200',
      overview: 'Sistem manajemen pergudangan (Warehouse Management System) cerdas untuk mengelola seluruh siklus operasional logistik, mulai dari penerimaan barang (Inbound), alokasi palet & rak penyimpanan, hingga proses pengiriman kargo (Outbound) dengan pelacakan real-time.',
      challenge: 'Tantangan operasional gudang bertrafik tinggi mencakup pelacakan alur barang masuk/keluar yang kompleks, pemindahan palet antar invoice, serta risiko selisih stok (discrepancy) dalam pencatatan manual.',
      solution: 'Membangun aplikasi web & mobile WMS terintegrasi dengan pemindaian barcode/QR palet instan, alur verifikasi digital Inbound & Outbound, transfer palet antar invoice dinamis, serta laporan mutasi stok otomatis.',
      metrics: [
        { label: 'Akurasi Stok', value: '99.8%' },
        { label: 'Efisiensi Inbound', value: '3x' },
        { label: 'Human Error', value: '-85%' }
      ],
      tags: ['Warehouse System', 'Inbound & Outbound', 'Logistik', 'Pallet Management', 'QR Scan', 'Inventory']
    },
    5: {
      category: 'HR Tech & Payroll',
      title: 'KlikSalary - HRIS & Payroll',
      image: 'assets/kliksalary.jpg',
      client: 'KlikSalary Enterprise',
      timeline: '12 Minggu',
      deliverable: 'Aplikasi HRIS Mobile & Web Dashboard Payroll',
      bannerGradient: 'from-rose-100 via-red-50 to-amber-100',
      overview: 'KlikSalary adalah solusi HRIS (Human Resource Information System) terintegrasi untuk mengelola SDM perusahaan secara lebih efisien. Mengotomatiskan absensi clock-in/out berbasis GPS & shift kerja, pengajuan cuti, hingga kalkulasi payroll dan penggajian karyawan yang akurat.',
      challenge: 'Pencatatan kehadiran manual dan fingerprint fisik rawan kecurangan lokasi, lambatnya rekap bulanan oleh tim HR, serta kompleksitas perhitungan komponen gaji, lembur, tunjangan, dan pajak PPh 21.',
      solution: 'Membangun aplikasi mobile absensi interaktif dengan validasi geofencing GPS dan foto selfie, pengajuan izin/cuti online berjenjang, serta dashboard HR untuk perhitungan otomatis payroll dan penerbitan e-slip gaji.',
      metrics: [
        { label: 'Efisiensi Payroll', value: '5x Lebih Cepat' },
        { label: 'Akurasi Absensi', value: '99.9%' },
        { label: 'Waktu Rekap HR', value: '-80%' }
      ],
      tags: ['HRIS', 'Payroll System', 'Mobile App', 'Web Dashboard', 'GPS Geofencing', 'Digital Slip Gaji']
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

  // =========================================================================
  // Contact & Consultation Form Handling
  // =========================================================================
  const contactForm = document.getElementById('contact-form');
  const contactStatus = document.getElementById('contact-form-status');
  const contactSubmitBtn = document.getElementById('contact-submit-btn');
  const contactBtnText = document.getElementById('contact-btn-text');
  const contactBtnIcon = document.getElementById('contact-btn-icon');
  const contactBtnSpinner = document.getElementById('contact-btn-spinner');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (document.getElementById('contact-name')?.value || '').trim();
      const phone = (document.getElementById('contact-phone')?.value || '').trim();
      const email = (document.getElementById('contact-email')?.value || '').trim();
      const service = (document.getElementById('contact-service')?.value || '').trim();
      const budget = (document.getElementById('contact-budget')?.value || '').trim();
      const message = (document.getElementById('contact-message')?.value || '').trim();

      if (!name || !phone || !email || !message) {
        if (contactStatus) {
          contactStatus.className = 'mb-6 p-4 rounded-2xl text-sm border border-amber-200 bg-amber-50 text-amber-900 block';
          contactStatus.innerHTML = '⚠️ Mohon lengkapi seluruh field bertanda bintang (*) sebelum mengirim.';
        }
        return;
      }

      // Button loading state
      if (contactSubmitBtn) contactSubmitBtn.disabled = true;
      if (contactBtnText) contactBtnText.textContent = 'Mengirim Permintaan...';
      if (contactBtnIcon) contactBtnIcon.classList.add('hidden');
      if (contactBtnSpinner) contactBtnSpinner.classList.remove('hidden');

      setTimeout(() => {
        // WhatsApp template link
        const waText = encodeURIComponent(
          `Halo Kodify! Saya ${name} ingin konsultasi proyek:\n` +
          `• Layanan: ${service}\n` +
          `• Budget: ${budget}\n` +
          `• Email: ${email}\n` +
          `• No. WA: ${phone}\n` +
          `• Pesan: ${message}`
        );
        const waUrl = `https://wa.me/6289506277284?text=${waText}`;

        if (contactStatus) {
          contactStatus.className = 'mb-6 p-5 rounded-2xl text-sm border border-emerald-200 bg-emerald-50 text-emerald-900 block';
          contactStatus.innerHTML = `
            <div class="flex items-start gap-3.5">
              <div class="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-emerald-900 text-base mb-1">Permintaan Konsultasi Terkirim!</h4>
                <p class="text-emerald-800 text-xs sm:text-sm leading-relaxed mb-3">
                  Terima kasih <strong>${name}</strong>. Tim lead consultant Kodify telah menerima rincian proyek Anda dan akan segera menghubungi Anda.
                </p>
                <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-3.5 rounded-xl shadow-sm transition-colors">
                  <span>Hubungkan via WhatsApp Sekarang</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </a>
              </div>
            </div>
          `;
        }

        // Reset button state
        if (contactSubmitBtn) contactSubmitBtn.disabled = false;
        if (contactBtnText) contactBtnText.textContent = 'Kirim Pesan Konsultasi';
        if (contactBtnIcon) contactBtnIcon.classList.remove('hidden');
        if (contactBtnSpinner) contactBtnSpinner.classList.add('hidden');

        // Reset form inputs
        contactForm.reset();
      }, 700);
    });
  }
});

