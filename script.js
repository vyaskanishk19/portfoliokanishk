/**
 * ==========================================================================
 * KV / DIGITAL HQ — CLIENT ENGINE & INTERACTION ARCHITECTURE
 * Portfolio for Kanishk Vyas — First Year B.Tech CSE Student
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     01. System Telemetry Clock (Jaipur / IST) & Dynamic Year
     -------------------------------------------------------------------------- */
  const telemetryClock = document.getElementById('telemetry-clock');
  const currentYearSpan = document.getElementById('current-year');

  // Update dynamic copyright year
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Live Telemetry Clock for Jaipur (Asia/Kolkata / UTC+5:30)
  function updateTelemetryClock() {
    if (!telemetryClock) return;
    try {
      const now = new Date();
      const istTime = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      telemetryClock.textContent = istTime;
    } catch {
      // Fallback if Intl timezone not supported
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      telemetryClock.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    }
  }

  updateTelemetryClock();
  setInterval(updateTelemetryClock, 1000);

  /* --------------------------------------------------------------------------
     02. Scroll Progress Bar
     -------------------------------------------------------------------------- */
  const progressBar = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* --------------------------------------------------------------------------
     03. Navigation & Section Spy (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const navLinks = document.querySelectorAll('.nav-link, .term-toggle-btn');
  const sections = document.querySelectorAll('section[id]');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -55% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const linkNav = link.getAttribute('data-nav');
            if (linkNav === currentId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* --------------------------------------------------------------------------
     04. Mobile Navigation Drawer & Focus Management
     -------------------------------------------------------------------------- */
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavLinks = document.querySelectorAll('[data-mobile-nav]');

  function toggleMobileMenu(forceState) {
    if (!menuToggleBtn || !mobileNavDrawer) return;
    const isExpanded = menuToggleBtn.getAttribute('aria-expanded') === 'true';
    const shouldOpen = typeof forceState === 'boolean' ? forceState : !isExpanded;

    menuToggleBtn.setAttribute('aria-expanded', String(shouldOpen));
    mobileNavDrawer.setAttribute('aria-hidden', String(!shouldOpen));

    if (shouldOpen) {
      mobileNavDrawer.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    } else {
      mobileNavDrawer.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', () => toggleMobileMenu());
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  // Close mobile drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavDrawer && mobileNavDrawer.classList.contains('is-open')) {
      toggleMobileMenu(false);
      menuToggleBtn?.focus();
    }
  });

  /* --------------------------------------------------------------------------
     05. Back to Top Interaction
     -------------------------------------------------------------------------- */
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const hero = document.getElementById('hero');
      hero?.focus();
    });
  }

  /* --------------------------------------------------------------------------
     06. Desktop Custom Cursor Accent
     -------------------------------------------------------------------------- */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (cursorDot && cursorRing && !isTouchDevice && !prefersReducedMotion) {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
        isVisible = true;
      }

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
      isVisible = false;
    });

    // Ring smooth interpolation
    function renderCursor() {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Expand ring on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, .parking-bay, .toolkit-card, [tabindex="0"]');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-hovering'));
    });
  }

  /* --------------------------------------------------------------------------
     07. Project 001: ParkEase Interactive Radar Simulator
     -------------------------------------------------------------------------- */
  const parkeaseSimToggle = document.getElementById('parkease-sim-toggle');
  const parkingBays = document.querySelectorAll('.parking-bay');
  const parkeaseStat = document.getElementById('parkease-stat');

  function updateParkingStatus() {
    if (!parkeaseStat) return;
    const vacantCount = document.querySelectorAll('.parking-bay.bay-vacant').length;
    const totalCount = parkingBays.length;
    parkeaseStat.textContent = `SYSTEM STATUS: ${vacantCount} / ${totalCount} SPOTS AVAILABLE`;
  }

  if (parkeaseSimToggle) {
    parkeaseSimToggle.addEventListener('click', () => {
      parkingBays.forEach((bay) => {
        // Randomly flip vacancy state for simulation
        const shouldBeVacant = Math.random() > 0.45;
        if (shouldBeVacant) {
          bay.classList.remove('bay-occupied');
          bay.classList.add('bay-vacant');
          const statusText = bay.querySelector('.bay-status');
          if (statusText) statusText.textContent = 'VACANT';
        } else {
          bay.classList.remove('bay-vacant');
          bay.classList.add('bay-occupied');
          const statusText = bay.querySelector('.bay-status');
          if (statusText) statusText.textContent = 'OCCUPIED';
        }
      });
      updateParkingStatus();
    });
  }

  // Allow clicking individual spots directly
  parkingBays.forEach((bay) => {
    bay.addEventListener('click', () => {
      const isOccupied = bay.classList.contains('bay-occupied');
      const statusText = bay.querySelector('.bay-status');

      if (isOccupied) {
        bay.classList.remove('bay-occupied');
        bay.classList.add('bay-vacant');
        if (statusText) statusText.textContent = 'VACANT';
      } else {
        bay.classList.remove('bay-vacant');
        bay.classList.add('bay-occupied');
        if (statusText) statusText.textContent = 'OCCUPIED';
      }
      updateParkingStatus();
    });
  });

  /* --------------------------------------------------------------------------
     08. Project 002: Typography Physics Lab Slider
     -------------------------------------------------------------------------- */
  const fontStretchSlider = document.getElementById('font-stretch-slider');
  const labDynamicText = document.getElementById('lab-dynamic-text');
  const labMetric = document.getElementById('lab-metric');

  if (fontStretchSlider && labDynamicText && labMetric) {
    fontStretchSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      labDynamicText.style.letterSpacing = `${val}px`;
      labMetric.textContent = `ACTIVE TRACKING: ${val}px`;
    });
  }

  /* --------------------------------------------------------------------------
     09. Toolkit Category Filter
     -------------------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const toolkitCards = document.querySelectorAll('.toolkit-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filterValue = btn.getAttribute('data-filter');

      toolkitCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     10. Signature Interaction — Digital Terminal Workstation
     -------------------------------------------------------------------------- */
  const terminalForm = document.getElementById('terminal-form');
  const terminalInput = document.getElementById('terminal-input');
  const terminalScreen = document.getElementById('terminal-screen');
  const quickPills = document.querySelectorAll('.tq-pill');

  // Command History Navigation
  const commandHistory = [];
  let historyIndex = -1;

  // Safe element creation helpers
  function createLine(className, contentText) {
    const div = document.createElement('div');
    div.className = className;
    div.textContent = contentText;
    return div;
  }

  function printToTerminal(nodeOrText, isError = false) {
    if (!terminalScreen) return;
    if (typeof nodeOrText === 'string') {
      const line = createLine(`term-line ${isError ? 'term-error' : 'term-output-entry'}`, nodeOrText);
      terminalScreen.appendChild(line);
    } else if (nodeOrText instanceof HTMLElement) {
      terminalScreen.appendChild(nodeOrText);
    }
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
  }

  // Safe command executor
  function executeCommand(rawCommand) {
    const trimmed = rawCommand.trim();
    if (!trimmed) return;

    // Append user input echo line
    const echoLine = document.createElement('div');
    echoLine.className = 'term-line term-input-echo';
    echoLine.textContent = `$ ${trimmed}`;
    printToTerminal(echoLine);

    // Save to history
    commandHistory.push(trimmed);
    historyIndex = commandHistory.length;

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    switch (cmd) {
      case 'help': {
        const table = document.createElement('div');
        table.className = 'term-output-table';
        const commands = [
          { name: 'help', desc: 'Display available workstation commands' },
          { name: 'about', desc: 'Display profile & academic background' },
          { name: 'projects', desc: 'Inspect student experiments and jump to showcase' },
          { name: 'toolkit', desc: 'View categorized technical skills & tools' },
          { name: 'contact', desc: 'Open connection channels' },
          { name: 'github', desc: 'Open GitHub profile in a new browser tab' },
          { name: 'whoami', desc: 'Identity verification' },
          { name: 'date', desc: 'Print current Indian Standard Time' },
          { name: 'clear', desc: 'Clear the terminal output screen' },
          { name: 'echo [text]', desc: 'Echo specified message' }
        ];

        commands.forEach((c) => {
          const colName = document.createElement('div');
          colName.className = 'term-cmd-name';
          colName.textContent = c.name;

          const colDesc = document.createElement('div');
          colDesc.className = 'term-cmd-desc';
          colDesc.textContent = c.desc;

          table.appendChild(colName);
          table.appendChild(colDesc);
        });

        printToTerminal(table);
        break;
      }

      case 'about': {
        const aboutContainer = document.createElement('div');
        aboutContainer.className = 'term-output-entry';
        aboutContainer.textContent =
          "KANISHK VYAS — First-Year B.Tech Computer Science Engineering Student.\n" +
          "Focus: Systems foundations (C/C++), modern web engineering, problem-solving, and cybersecurity exploration.\n" +
          "Location: Jaipur, Rajasthan, India.\n" +
          "Philosophy: 'Curiosity, compiled into code.'";
        aboutContainer.style.whiteSpace = 'pre-line';
        printToTerminal(aboutContainer);
        break;
      }

      case 'projects':
      case 'experiments': {
        const projMsg = document.createElement('div');
        projMsg.className = 'term-success';
        projMsg.textContent = "Navigating to experiments: [001 PARKEASE] | [002 WEB EXPERIMENTS] | [003 NEXT EXPERIMENT]";
        printToTerminal(projMsg);
        document.getElementById('experiments')?.scrollIntoView({ behavior: 'smooth' });
        break;
      }

      case 'toolkit':
      case 'skills': {
        const tkMsg = document.createElement('div');
        tkMsg.className = 'term-success';
        tkMsg.textContent = "Active Toolkit: C, C++, HTML, CSS, JavaScript, Git, GitHub, Cybersecurity Fundamentals.";
        printToTerminal(tkMsg);
        document.getElementById('toolkit')?.scrollIntoView({ behavior: 'smooth' });
        break;
      }

      case 'contact': {
        const contactMsg = document.createElement('div');
        contactMsg.className = 'term-output-entry';
        contactMsg.textContent = "Primary Contact Destination: GitHub (@vyaskanishk19)\nAcademic Base: Jaipur, India.";
        contactMsg.style.whiteSpace = 'pre-line';
        printToTerminal(contactMsg);
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        break;
      }

      case 'github':
      case 'repo': {
        const ghMsg = document.createElement('div');
        ghMsg.className = 'term-success';
        ghMsg.textContent = "Opening https://github.com/vyaskanishk19 in new tab...";
        printToTerminal(ghMsg);
        window.open('https://github.com/vyaskanishk19', '_blank', 'noopener,noreferrer');
        break;
      }

      case 'whoami': {
        printToTerminal("kanishk vyas (uid=1001) // First-Year B.Tech CSE Student // Jaipur, IN");
        break;
      }

      case 'date': {
        const now = new Date();
        printToTerminal(`CURRENT TIME (IST): ${now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}`);
        break;
      }

      case 'clear': {
        if (terminalScreen) {
          terminalScreen.replaceChildren();
          const resetBanner = document.createElement('div');
          resetBanner.className = 'term-line term-system-banner';
          resetBanner.textContent = "KV / TERMINAL WORKSTATION [CLEARED]. TYPE 'help' FOR COMMANDS.";
          terminalScreen.appendChild(resetBanner);
        }
        break;
      }

      case 'echo': {
        printToTerminal(args || '');
        break;
      }

      default: {
        printToTerminal(`command not found: '${cmd}'. Type 'help' to view available system commands.`, true);
        break;
      }
    }
  }

  // Handle Form Submission
  if (terminalForm && terminalInput) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = terminalInput.value;
      terminalInput.value = '';
      executeCommand(val);
    });

    // History Navigation via Arrow Keys
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length > 0 && historyIndex > 0) {
          historyIndex--;
          terminalInput.value = commandHistory[historyIndex];
        } else if (commandHistory.length > 0 && historyIndex === -1) {
          historyIndex = commandHistory.length - 1;
          terminalInput.value = commandHistory[historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex >= 0 && historyIndex < commandHistory.length - 1) {
          historyIndex++;
          terminalInput.value = commandHistory[historyIndex];
        } else {
          historyIndex = commandHistory.length;
          terminalInput.value = '';
        }
      }
    });
  }

  // Handle Quick Action Pills
  quickPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const command = pill.getAttribute('data-command');
      if (command) {
        executeCommand(command);
        terminalInput?.focus();
      }
    });
  });

});
