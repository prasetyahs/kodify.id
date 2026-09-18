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
  const navIds = ['home', 'about', 'services', 'projects', 'contact'];
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

  // 8. Projects Responsive Carousel Slider (Desktop: 3 per slide, Tablet: 2, Mobile: 1)
  const projectsTrack = document.getElementById('projects-slider-track');
  const projectsWrapper = projectsTrack ? projectsTrack.parentElement : null;
  const projectsPrev = document.getElementById('projects-prev');
  const projectsNext = document.getElementById('projects-next');
  const projectsDotsContainer = document.getElementById('projects-dots');

  if (projectsTrack && projectsWrapper) {
    let currentSlide = 0;

    function getCardsPerSlide() {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }

    function getTotalSlides() {
      const perSlide = getCardsPerSlide();
      return Math.ceil(6 / perSlide);
    }

    function renderProjectDots() {
      if (!projectsDotsContainer) return;
      const totalSlides = getTotalSlides();
      projectsDotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = `project-dot h-3 rounded-full transition-all duration-300 cursor-pointer ${
          i === currentSlide ? 'bg-[#6576ff] w-7' : 'bg-slate-200 hover:bg-slate-300 w-3'
        }`;
        dot.setAttribute('data-slide', i);
        dot.setAttribute('aria-label', `Go to Slide ${i + 1}`);
        dot.addEventListener('click', () => {
          updateProjectSlide(i);
        });
        projectsDotsContainer.appendChild(dot);
      }
    }

    function updateProjectSlide(index) {
      const totalSlides = getTotalSlides();
      currentSlide = (index + totalSlides) % totalSlides;

      // Translate track smoothly by full viewport width of the slider
      const shiftX = currentSlide * projectsWrapper.clientWidth;
      projectsTrack.style.transform = `translateX(-${shiftX}px)`;

      // Update dot styles with smooth capsule expand animation
      if (projectsDotsContainer) {
        const dots = projectsDotsContainer.querySelectorAll('.project-dot');
        dots.forEach((dot, idx) => {
          if (idx === currentSlide) {
            dot.classList.add('bg-[#6576ff]', 'w-7');
            dot.classList.remove('bg-slate-200', 'w-3');
          } else {
            dot.classList.remove('bg-[#6576ff]', 'w-7');
            dot.classList.add('bg-slate-200', 'w-3');
          }
        });
      }
    }

    if (projectsNext) {
      projectsNext.addEventListener('click', () => {
        updateProjectSlide(currentSlide + 1);
      });
    }

    if (projectsPrev) {
      projectsPrev.addEventListener('click', () => {
        updateProjectSlide(currentSlide - 1);
      });
    }

    // Touch swipe support for mobile/tablet
    let touchStartX = 0;
    let touchEndX = 0;

    projectsTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    projectsTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 40) {
        // swipe left -> next slide
        updateProjectSlide(currentSlide + 1);
      } else if (touchEndX - touchStartX > 40) {
        // swipe right -> prev slide
        updateProjectSlide(currentSlide - 1);
      }
    }, { passive: true });

    // Recalculate on screen resize
    window.addEventListener('resize', () => {
      const totalSlides = getTotalSlides();
      if (currentSlide >= totalSlides) {
        currentSlide = totalSlides - 1;
      }
      renderProjectDots();
      updateProjectSlide(currentSlide);
    });

    // Initial dot rendering & slider state
    renderProjectDots();
    updateProjectSlide(0);
  }

  // 9. Case Study Detail Modal Logic & Data
  const caseStudies = {
    1: {
      category: 'Branding & Identity',
      title: 'Modern Company Branding Project',
      client: 'Apex Global Tech',
      timeline: '8 Weeks',
      deliverable: 'Brand Identity & Guidelines',
      bannerGradient: 'from-indigo-100 via-blue-50 to-purple-100',
      overview: 'Re-envisioning the core identity and digital brand guidelines for a corporate tech leader operating across North America and Europe. We established an authoritative yet approachable persona designed to dominate an enterprise SaaS market.',
      challenge: 'Fragmented brand assets across 4 international subsidiaries created inconsistent customer touchpoints, lowered trust among institutional buyers, and confused product positioning.',
      solution: 'Crafted a centralized digital design language featuring our signature periwinkle aesthetic, bespoke geometric iconography, and an interactive token-based component system for all digital and print collateral.',
      metrics: [
        { label: 'Brand Recall', value: '+145%' },
        { label: 'Inbound Quality', value: '+42%' },
        { label: 'Consistency', value: '100%' }
      ],
      tags: ['Brand Strategy', 'Figma', 'Visual System', 'Adobe Illustrator', 'Design Tokens']
    },
    2: {
      category: 'Web Platform',
      title: 'Website Design and Development',
      client: 'Lumina Cloud Services',
      timeline: '12 Weeks',
      deliverable: 'Web Platform & Design System',
      bannerGradient: 'from-purple-100 via-indigo-50 to-blue-100',
      overview: 'End-to-end design and modular web platform development delivering seamless user interaction for an enterprise cloud orchestration provider with over 50,000 active server nodes.',
      challenge: 'Their legacy website suffered from a 68% bounce rate due to slow initial load times (3.4s) and overly technical, non-interactive explanations of complex cloud infrastructure products.',
      solution: 'Engineered an ultra-fast static web platform featuring interactive architecture diagrams, live ROI calculators, micro-animated product tours, and sub-second page transitions.',
      metrics: [
        { label: 'Lighthouse Score', value: '98/100' },
        { label: 'Bounce Rate', value: '-54%' },
        { label: 'Session Duration', value: '+210%' }
      ],
      tags: ['Next.js', 'Tailwind CSS', 'TypeScript', 'Framer Motion', 'Vercel Edge']
    },
    3: {
      category: 'Digital Marketing',
      title: 'Media Marketing Services',
      client: 'Pulse Health & Fitness',
      timeline: '6 Months Campaign',
      deliverable: 'Omnichannel Growth Campaign',
      bannerGradient: 'from-pink-100 via-purple-50 to-indigo-100',
      overview: 'Scalable multimedia advertising and omnichannel growth strategy that accelerated paid user acquisition and brand loyalty across mobile and web platforms.',
      challenge: 'Customer acquisition costs (CAC) were climbing above $120 per user due to saturated paid social channels and generic creative that failed to resonate with target demographics.',
      solution: 'Produced a bespoke series of high-converting short-form creative assets, optimized lookalike audience funnels, and deployed dynamic personalized landing pages.',
      metrics: [
        { label: 'User Growth', value: '+240%' },
        { label: 'Customer CAC', value: '-46%' },
        { label: 'Attributed Pipeline', value: '$3.8M' }
      ],
      tags: ['Meta Ads', 'Google Ads', 'Klaviyo CRM', 'Creative Direction', 'Looker Studio']
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

    if (bannerEl) {
      bannerEl.className = `relative w-full h-52 sm:h-60 bg-gradient-to-br ${data.bannerGradient} p-6 sm:p-8 flex flex-col justify-end overflow-hidden`;
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

  // Trigger modal on card click or button click
  document.querySelectorAll('.project-card, .open-case-study-btn').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = el.getAttribute('data-project-id') || el.closest('[data-project-id]')?.getAttribute('data-project-id');
      if (id) {
        openCaseStudyModal(id);
      }
    });
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
