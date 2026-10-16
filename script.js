/* ==========================================================================
   DINÂMICAS FUNCIONAL KIDS - INTERACTIVE SCRIPTS & CONVERSION BOOSTERS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
   * 1. Dynamic Urgency Countdown Timer (14:59)
   * ------------------------------------------------------------------------ */
  const minutesEl = document.getElementById('timer-minutes');
  const secondsEl = document.getElementById('timer-seconds');

  const STORAGE_KEY = 'fk_urgency_timer_deadline';
  const DEFAULT_DURATION_SEC = 14 * 60 + 59; // 14 mins 59 secs

  function getOrSetDeadline() {
    let stored = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();
    if (!stored || parseInt(stored, 10) <= now) {
      const newDeadline = now + (DEFAULT_DURATION_SEC * 1000);
      localStorage.setItem(STORAGE_KEY, newDeadline.toString());
      return newDeadline;
    }
    return parseInt(stored, 10);
  }

  let deadline = getOrSetDeadline();

  function updateTimer() {
    const now = Date.now();
    let diff = Math.max(0, Math.floor((deadline - now) / 1000));

    if (diff <= 0) {
      // Reset to 5 mins loop so the urgency remains fresh
      deadline = now + (5 * 60 * 1000);
      localStorage.setItem(STORAGE_KEY, deadline.toString());
      diff = 5 * 60;
    }

    const mins = Math.floor(diff / 60);
    const secs = diff % 60;

    if (minutesEl) minutesEl.textContent = String(mins).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(secs).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);


  /* ------------------------------------------------------------------------
   * 2. Interactive FAQ Accordion
   * ------------------------------------------------------------------------ */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const toggleIcon = item.querySelector('.faq-toggle-icon');

    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherBtn = otherItem.querySelector('.faq-question');
            const otherIcon = otherItem.querySelector('.faq-toggle-icon');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherIcon) otherIcon.textContent = '+';
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          questionBtn.setAttribute('aria-expanded', 'false');
          if (toggleIcon) toggleIcon.textContent = '+';
        } else {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
          if (toggleIcon) toggleIcon.textContent = '−';
        }
      });
    }
  });


  /* ------------------------------------------------------------------------
   * 3. Sticky Bottom CTA Bar on Scroll
   * ------------------------------------------------------------------------ */
  const stickyBar = document.getElementById('sticky-bar');
  const heroSection = document.getElementById('hero');
  const pricingSection = document.getElementById('oferta');

  function handleScroll() {
    if (!stickyBar || !heroSection) return;

    const heroBottom = heroSection.getBoundingClientRect().bottom;
    let pricingInView = false;

    if (pricingSection) {
      const rect = pricingSection.getBoundingClientRect();
      // Hide sticky bar when user is looking directly at the pricing section
      if (rect.top <= window.innerHeight * 0.7 && rect.bottom >= window.innerHeight * 0.3) {
        pricingInView = true;
      }
    }

    if (heroBottom < 0 && !pricingInView) {
      stickyBar.classList.add('visible');
      stickyBar.setAttribute('aria-hidden', 'false');
    } else {
      stickyBar.classList.remove('visible');
      stickyBar.setAttribute('aria-hidden', 'true');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  /* ------------------------------------------------------------------------
   * 4. Live Purchase Notification Toast (Social Proof)
   * ------------------------------------------------------------------------ */
  const liveToast = document.getElementById('live-toast');
  const toastName = document.getElementById('toast-name');
  const toastTime = document.getElementById('toast-time');
  const toastAvatar = document.getElementById('toast-avatar');

  const buyers = [
    { name: 'Prof. Renata Lima', role: 'adquiriu o Plano Premium', location: 'São Paulo, SP', time: 'há 2 minutos', icon: '👩‍🏫' },
    { name: 'Juliana Castro', role: 'adquiriu o Plano Premium', location: 'Belo Horizonte, MG (Psicopedagoga)', time: 'há 4 minutos', icon: '🌟' },
    { name: 'Prof. Marcos Vinícius', role: 'adquiriu o Plano Premium', location: 'Curitiba, PR (Ed. Física)', time: 'há 1 minuto', icon: '👨‍🏫' },
    { name: 'Camila Fernandes', role: 'adquiriu o Plano Básico', location: 'Porto Alegre, RS', time: 'há 6 minutos', icon: '📚' },
    { name: 'Tatiane Andrade', role: 'adquiriu o Plano Premium', location: 'Campinas, SP (Terapeuta Ocupacional)', time: 'há 3 minutos', icon: '⭐' },
    { name: 'Prof. Lucas Mendonça', role: 'adquiriu o Plano Premium', location: 'Salvador, BA', time: 'há 5 minutos', icon: '🏃‍♂️' }
  ];

  let buyerIndex = 0;
  let toastTimer = null;

  function hideToast() {
    if (liveToast) liveToast.classList.remove('active');
  }

  function showNextToast() {
    if (!liveToast) return;

    const currentBuyer = buyers[buyerIndex];
    if (toastName) toastName.innerHTML = `<strong>${currentBuyer.name}</strong> ${currentBuyer.role}`;
    if (toastTime) toastTime.textContent = `${currentBuyer.time} • ${currentBuyer.location}`;
    if (toastAvatar) toastAvatar.textContent = currentBuyer.icon;

    liveToast.classList.add('active');

    // Fica visível por 4 segundos
    setTimeout(() => {
      hideToast();
    }, 4000);

    buyerIndex = (buyerIndex + 1) % buyers.length;
  }

  function scheduleNextToast(delayMs) {
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      showNextToast();
      // Frequência reduzida: intervalo orgânico entre 45 e 70 segundos
      const nextDelay = Math.floor(Math.random() * (70000 - 45000 + 1)) + 45000;
      scheduleNextToast(nextDelay);
    }, delayMs);
  }

  // Primeiro disparo após 20 segundos (dá tempo do visitante ver a headline e o vídeo)
  scheduleNextToast(20000);

  // Permitir fechar o toast imediatamente ao tocar/clicar nele ou no botão de fechar
  const toastCloseBtn = document.getElementById('toast-close');
  if (toastCloseBtn) {
    toastCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hideToast();
      scheduleNextToast(90000);
    });
  }

  if (liveToast) {
    liveToast.style.cursor = 'pointer';
    liveToast.setAttribute('title', 'Clique para fechar');
    liveToast.addEventListener('click', () => {
      hideToast();
      // Se o usuário fechar, aguarda 90 segundos antes da próxima notificação
      scheduleNextToast(90000);
    });
  }


  /* ------------------------------------------------------------------------
   * 5. High-Performance Dual-Mode VSL Player (Local MP4 & YouTube Facade)
   * ------------------------------------------------------------------------ */
  const vslWrapper = document.getElementById('vsl-wrapper');
  const vslPosterLayer = document.getElementById('vsl-poster-layer');
  const vslLocalPlayer = document.getElementById('vsl-local-player');
  const vslExternalSlot = document.getElementById('vsl-external-slot');

  function initVslPlayer() {
    if (!vslWrapper || !vslPosterLayer) return;

    function playVideo() {
      const mode = vslWrapper.getAttribute('data-mode') || 'local';
      const youtubeId = (vslWrapper.getAttribute('data-youtube-id') || '').trim();

      // Esconde a capa/poster com transição suave
      vslPosterLayer.classList.add('is-hidden');

      if (mode === 'youtube' && youtubeId) {
        // OPÇÃO B: Injeta o iframe do YouTube somente agora (Zero Lag antes do clique!)
        if (vslLocalPlayer) {
          vslLocalPlayer.style.display = 'none';
          vslLocalPlayer.pause();
        }
        if (vslExternalSlot) {
          vslExternalSlot.style.display = 'block';
          vslExternalSlot.innerHTML = `
            <iframe 
              src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1&playsinline=1&rel=0&modestbranding=1" 
              title="Vídeo de Apresentação Funcional Kids" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowfullscreen>
            </iframe>
          `;
        }
      } else {
        // OPÇÃO A: Reproduz o vídeo local (vsl.mp4.mp4 / vsl.mp4 na pasta principal)
        if (vslLocalPlayer) {
          vslLocalPlayer.style.display = 'block';
          vslLocalPlayer.controls = true;
          if (vslLocalPlayer.readyState === 0) {
            vslLocalPlayer.load();
          }
          const playPromise = vslLocalPlayer.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              console.warn('Autoplay com som prevenido pelo navegador, controles habilitados:', err);
              vslLocalPlayer.controls = true;
            });
          }
        }
      }
    }

    // Clique e toque no poster ou no botão de Play
    vslPosterLayer.addEventListener('click', playVideo);

    // Suporte a teclado (Acessibilidade)
    vslPosterLayer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playVideo();
      }
    });

    if (vslLocalPlayer) {
      // Se o vídeo local terminar, reexibe a capa para incentivar novo play
      vslLocalPlayer.addEventListener('ended', () => {
        vslPosterLayer.classList.remove('is-hidden');
      });
    }
  }

  initVslPlayer();

  /* ------------------------------------------------------------------------
   * 5.1. Interactive Demo / Feature Modal (Disponível se chamado)
   * ------------------------------------------------------------------------ */
  const demoModal = document.getElementById('demo-modal');
  const modalClose = document.getElementById('modal-close');
  const modalCta = document.getElementById('modal-cta-btn');

  function openDemoModal() {
    if (!demoModal) return;
    demoModal.classList.add('open');
    demoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDemoModal() {
    if (!demoModal) return;
    demoModal.classList.remove('open');
    demoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeDemoModal);
  if (modalCta) modalCta.addEventListener('click', closeDemoModal);

  if (demoModal) {
    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) closeDemoModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && demoModal.classList.contains('open')) {
        closeDemoModal();
      }
    });
  }


  /* ------------------------------------------------------------------------
   * 6. Upsell Intercept Modal (Triggered on Basic Plan Click)
   * ------------------------------------------------------------------------ */
  const buyBasicBtn = document.getElementById('buy-basic-btn');
  const upsellModal = document.getElementById('upsell-modal');
  const upsellClose = document.getElementById('upsell-close');
  const upsellAcceptBtn = document.getElementById('upsell-accept-btn');
  const upsellRejectBtn = document.getElementById('upsell-reject-btn');

  function openUpsellModal(e) {
    if (e) e.preventDefault();
    if (!upsellModal) return;
    upsellModal.classList.add('open');
    upsellModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeUpsellModal() {
    if (!upsellModal) return;
    upsellModal.classList.remove('open');
    upsellModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (buyBasicBtn) {
    buyBasicBtn.addEventListener('click', openUpsellModal);
  }

  if (upsellClose) {
    upsellClose.addEventListener('click', closeUpsellModal);
  }

  if (upsellAcceptBtn) {
    upsellAcceptBtn.addEventListener('click', () => {
      closeUpsellModal();
    });
  }

  if (upsellRejectBtn) {
    upsellRejectBtn.addEventListener('click', () => {
      closeUpsellModal();
    });
  }

  if (upsellModal) {
    upsellModal.addEventListener('click', (e) => {
      if (e.target === upsellModal) {
        closeUpsellModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && upsellModal.classList.contains('open')) {
        closeUpsellModal();
      }
    });
  }

  /* ------------------------------------------------------------------------
   * 7. Meta Pixel Tracking (InitiateCheckout em cliques de compra)
   * ------------------------------------------------------------------------ */
  const checkoutTriggers = document.querySelectorAll('#buy-premium-btn, #upsell-accept-btn, #upsell-reject-btn');
  checkoutTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof fbq === 'function') {
        fbq('track', 'InitiateCheckout');
      }
    });
  });

});

