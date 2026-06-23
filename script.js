/* FOUHUI — Neural Commerce Nexus — Interactive Engine */

(function () {
  'use strict';

  // ---- Neural Network Canvas Background ----
  const canvas = document.getElementById('neuralCanvas');
  const ctx = canvas.getContext('2d');
  let nodes = [];
  let mouse = { x: 0, y: 0 };
  const NODE_COUNT = 80;
  const CONNECTION_DIST = 150;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initNodes();
  }

  function initNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  function drawNeural() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    nodes.forEach((node, i) => {
      node.x += node.vx;
      node.y += node.vy;
      node.pulse += 0.02;

      if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

      const dx = mouse.x - node.x;
      const dy = mouse.y - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        node.x -= dx * 0.002;
        node.y -= dy * 0.002;
      }

      for (let j = i + 1; j < nodes.length; j++) {
        const other = nodes[j];
        const cdx = node.x - other.x;
        const cdy = node.y - other.y;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

        if (cdist < CONNECTION_DIST) {
          const alpha = (1 - cdist / CONNECTION_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      const glow = Math.sin(node.pulse) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius + glow, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 255, ${0.3 + glow * 0.4})`;
      ctx.fill();
    });

    requestAnimationFrame(drawNeural);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  drawNeural();

  // ---- Custom Cursor ----
  const cursorGlow = document.getElementById('cursorGlow');
  const cursorRing = document.getElementById('cursorRing');

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
    cursorRing.style.left = e.clientX + 'px';
    cursorRing.style.top = e.clientY + 'px';
  });

  // ---- Orbital Navigation ----
  const navToggle = document.getElementById('navToggle');
  const orbitalRing = document.getElementById('orbitalRing');
  const orbitLinks = document.querySelectorAll('.orbit-link');
  let navOpen = false;

  const orbitRadius = 120;
  const orbitAngles = [0, 72, 144, 216, 288].map((deg) => (deg * Math.PI) / 180);

  orbitLinks.forEach((link, i) => {
    const angle = orbitAngles[i];
    link.style.left = `${Math.cos(angle) * orbitRadius}px`;
    link.style.top = `${Math.sin(angle) * orbitRadius}px`;
  });

  navToggle.addEventListener('click', () => {
    navOpen = !navOpen;
    navToggle.setAttribute('aria-expanded', navOpen);
    orbitalRing.classList.toggle('open', navOpen);

    orbitLinks.forEach((link, i) => {
      if (navOpen) {
        link.style.transitionDelay = `${i * 0.05}s`;
      } else {
        link.style.transitionDelay = '0s';
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (navOpen && !e.target.closest('.orbital-nav')) {
      navOpen = false;
      navToggle.setAttribute('aria-expanded', 'false');
      orbitalRing.classList.remove('open');
    }
  });

  // ---- Scroll Progress Helix ----
  const helixFill = document.getElementById('helixFill');
  const sections = document.querySelectorAll('[data-section]');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    helixFill.style.height = `${progress * 100}%`;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.3;
      if (inView) {
        section.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // ---- Counter Animation ----
  const statNums = document.querySelectorAll('.stat-num');

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }

    requestAnimationFrame(tick);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNums.forEach((el) => statsObserver.observe(el));

  // ---- Cascade Card Tilt & Glow ----
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateX = (e.clientY - centerY) / 20;
      const rotateY = (centerX - e.clientX) / 20;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(-5deg)';
    });
  });

  // ---- Hex Grid Animation ----
  const hexGrid = document.getElementById('hexGrid');
  if (hexGrid) {
    for (let i = 0; i < 64; i++) {
      const cell = document.createElement('div');
      cell.className = 'hex-cell';
      hexGrid.appendChild(cell);
    }

    const hexCells = hexGrid.querySelectorAll('.hex-cell');

    function pulseHex() {
      hexCells.forEach((cell) => cell.classList.remove('active'));
      const count = Math.floor(Math.random() * 8) + 3;
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * hexCells.length);
        hexCells[idx].classList.add('active');
      }
    }

    setInterval(pulseHex, 800);
    pulseHex();
  }

  // ---- Terminal Typing Effect ----
  const terminalOutput = document.getElementById('terminalOutput');
  const terminalLines = [
  ];

  const signalObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          typeTerminalLines();
          signalObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  if (terminalOutput) {
    signalObserver.observe(terminalOutput.closest('.signal-section'));
  }

  let typed = false;
  function typeTerminalLines() {
    if (typed) return;
    typed = true;

    const extraLines = [
      '> Scanning partner network... COMPLETE',
      '> Encryption: AES-256-GCM ACTIVE',
      '> Ready for inbound transmission.',
      '> <span style="color:#00f0ff">_</span>'
    ];

    let delay = 500;
    extraLines.forEach((line) => {
      setTimeout(() => {
        const p = document.createElement('p');
        p.className = 'term-line';
        p.innerHTML = line;
        terminalOutput.appendChild(p);
        p.style.opacity = '0';
        requestAnimationFrame(() => {
          p.style.transition = 'opacity 0.3s';
          p.style.opacity = '1';
        });
      }, delay);
      delay += 600;
    });
  }

  // ---- Scroll Reveal ----
  const revealElements = document.querySelectorAll(
    '.skew-header, .cascade-card, .nexus-content, .nexus-visual, .signal-terminal'
  );

  revealElements.forEach((el) => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ---- Smooth orbital nav close on link click ----
  orbitLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navOpen = false;
      navToggle.setAttribute('aria-expanded', 'false');
      orbitalRing.classList.remove('open');
    });
  });

  // ---- Cascade auto-scroll hint ----
  const cascadeTrack = document.getElementById('cascadeTrack');
  if (cascadeTrack) {
    let autoScrollDir = 1;
    let autoScrollPaused = false;

    cascadeTrack.addEventListener('mouseenter', () => { autoScrollPaused = true; });
    cascadeTrack.addEventListener('mouseleave', () => { autoScrollPaused = false; });
    cascadeTrack.addEventListener('touchstart', () => { autoScrollPaused = true; }, { passive: true });

    function autoScrollCascade() {
      if (!autoScrollPaused && cascadeTrack.scrollWidth > cascadeTrack.clientWidth) {
        cascadeTrack.scrollLeft += autoScrollDir * 0.5;
        if (cascadeTrack.scrollLeft >= cascadeTrack.scrollWidth - cascadeTrack.clientWidth - 2) {
          autoScrollDir = -1;
        } else if (cascadeTrack.scrollLeft <= 0) {
          autoScrollDir = 1;
        }
      }
      requestAnimationFrame(autoScrollCascade);
    }

    const cascadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) autoScrollCascade();
        });
      },
      { threshold: 0.2 }
    );
    cascadeObserver.observe(cascadeTrack);
  }
})();
