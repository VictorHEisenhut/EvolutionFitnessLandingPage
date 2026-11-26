/**
 * Controlador Principal de UI e Interatividade — Academia Evolution Fitness (Timbó - SC)
 */

import { getEvolutionGymStatus } from "./liveGymStatus.js";
import { openEvolutionWhatsApp, trackConversionEvent } from "./smartWhatsApp.js";

/**
 * Atualiza todos os elementos visuais de horário e fluxo na página em tempo real
 * @param {{ dayOfWeek: number, hour: number, minute: number } | null} [override]
 */
export function renderGymStatusUI(override = null) {
  const status = getEvolutionGymStatus(override || undefined);

  // 1. Atualiza Badge no Header Sticky
  const headerBadge = document.getElementById("header-live-badge");
  const headerText = document.getElementById("header-live-text");
  if (headerBadge && headerText) {
    headerBadge.setAttribute("data-state", status.stateCode);
    headerText.textContent = status.shortBadgeText;
  }

  // 2. Atualiza Painel Principal na Seção 09 (Horários Inteligentes)
  const mainStatusCard = document.getElementById("schedule-live-card");
  const mainBadgeText = document.getElementById("schedule-live-badge-text");
  const mainDetailText = document.getElementById("schedule-live-detail");

  if (mainStatusCard) {
    mainStatusCard.setAttribute("data-state", status.stateCode);
  }
  if (mainBadgeText) {
    mainBadgeText.textContent = status.badgeText;
  }
  if (mainDetailText) {
    mainDetailText.textContent = status.detailText;
  }

  // 3. Destaca a linha correspondente ao dia atual na tabela de horários
  const scheduleRows = document.querySelectorAll("[data-day-row]");
  scheduleRows.forEach((row) => {
    const rowDay = Number(row.getAttribute("data-day-row"));
    if (rowDay === status.dayOfWeek) {
      row.classList.add("is-today");
      const todayTag = row.querySelector(".today-pill");
      if (todayTag) todayTag.hidden = false;
    } else {
      row.classList.remove("is-today");
      const todayTag = row.querySelector(".today-pill");
      if (todayTag) todayTag.hidden = true;
    }
  });

  return status;
}

/**
 * Configura os botões de ação do WhatsApp e o Widget Flutuante Inteligente
 */
function initWhatsAppInteractions() {
  const widgetContainer = document.getElementById("smart-whatsapp-widget");
  const toggleBtn = document.getElementById("whatsapp-widget-toggle");
  const closeBtn = document.getElementById("whatsapp-popover-close");
  const popover = document.getElementById("whatsapp-popover");

  function setPopoverOpen(isOpen, shouldFocusToggle = true) {
    if (!popover || !toggleBtn || !widgetContainer) return;
    const isCurrentlyOpen = !popover.hidden;
    if (isCurrentlyOpen === isOpen) return;

    popover.hidden = !isOpen;
    widgetContainer.classList.toggle("is-open", isOpen);
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
    popover.setAttribute("aria-modal", String(isOpen));

    if (isOpen) {
      // Fecha o drawer mobile caso esteja aberto para evitar sobreposição
      const mobileDrawer = document.getElementById("mobile-nav-drawer");
      const menuToggle = document.getElementById("mobile-menu-toggle");
      if (mobileDrawer && !mobileDrawer.hidden) {
        mobileDrawer.hidden = true;
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      }

      const firstOption = popover.querySelector(".wa-intent-option, button, a");
      if (firstOption) firstOption.focus();
      const currentStatus = getEvolutionGymStatus();
      trackConversionEvent("open_whatsapp_selector", {
        gym_status: currentStatus.isOpen ? "OPEN" : "CLOSED",
        state_code: currentStatus.stateCode,
      });
    } else if (shouldFocusToggle) {
      toggleBtn.focus();
    }
  }

  if (toggleBtn && popover) {
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isCurrentlyOpen = !popover.hidden;
      setPopoverOpen(!isCurrentlyOpen, true);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => setPopoverOpen(false, true));
  }

  document.addEventListener("click", (e) => {
    if (widgetContainer && !widgetContainer.contains(e.target)) {
      setPopoverOpen(false, false);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !popover.hidden) {
      setPopoverOpen(false, true);
    }
  });

  // Delegação para todos os botões e links com atributo [data-wa-intent]
  document.querySelectorAll("[data-wa-intent]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const intentKey = el.getAttribute("data-wa-intent") || "experimental";
      const locationKey = el.getAttribute("data-wa-location") || "page_cta";

      if (el.tagName === "A" && el.getAttribute("href")) {
        // Link nativo: apenas registra o evento no dataLayer/Meta Pixel sem impedir a navegação
        trackConversionEvent("generate_lead_whatsapp", {
          lead_intent: intentKey,
          cta_location: locationKey,
        });
        setPopoverOpen(false);
      } else {
        // Botão sem link nativo (ex: opções do popover): abre via JS
        e.preventDefault();
        openEvolutionWhatsApp(intentKey, locationKey);
        setPopoverOpen(false);
      }
    });
  });
}

/**
 * Configura rastreamento de Micro-Conversões (Instagram, Google Maps e Telefone Fixo)
 */
function initMicroConversionTracking() {
  document.querySelectorAll("[data-track-instagram]").forEach((el) => {
    el.addEventListener("click", () => {
      trackConversionEvent("click_instagram_profile", {
        destination: "https://www.instagram.com/academiaevolutionfitness_/",
        cta_location: el.getAttribute("data-track-instagram") || "page",
      });
    });
  });

  document.querySelectorAll("[data-track-directions]").forEach((el) => {
    el.addEventListener("click", () => {
      trackConversionEvent("click_get_directions", {
        address: "Av. Nereu Ramos, 300 - Centro, Timbó - SC, 89120-000",
        cta_location: el.getAttribute("data-track-directions") || "location_section",
      });
    });
  });

  document.querySelectorAll("[data-track-phone]").forEach((el) => {
    el.addEventListener("click", () => {
      trackConversionEvent("click_phone_call", {
        phone_type: "landline",
        phone_number: "+55-47-3382-7985",
      });
    });
  });
}

/**
 * Configura o Menu Mobile no Header Sticky
 */
function initMobileNavigation() {
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const mobileDrawer = document.getElementById("mobile-nav-drawer");

  if (!menuToggle || !mobileDrawer) return;

  function setMobileNavOpen(isOpen, shouldFocusToggle = true) {
    const isCurrentlyOpen = !mobileDrawer.hidden;
    if (isCurrentlyOpen === isOpen) return;

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    mobileDrawer.hidden = !isOpen;
    document.body.classList.toggle("nav-open", isOpen);

    if (isOpen) {
      // Garante que o popover do WhatsApp feche ao abrir o menu mobile
      const waPopover = document.getElementById("whatsapp-popover");
      const waWidget = document.getElementById("smart-whatsapp-widget");
      const waToggle = document.getElementById("whatsapp-widget-toggle");
      if (waPopover && !waPopover.hidden) {
        waPopover.hidden = true;
        waPopover.setAttribute("aria-modal", "false");
        if (waWidget) waWidget.classList.remove("is-open");
        if (waToggle) waToggle.setAttribute("aria-expanded", "false");
      }

      const firstLink = mobileDrawer.querySelector("a, button");
      if (firstLink) firstLink.focus();
    } else if (shouldFocusToggle) {
      menuToggle.focus();
    }
  }

  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    setMobileNavOpen(!isExpanded, true);
  });

  mobileDrawer.querySelectorAll("a, button").forEach((link) => {
    link.addEventListener("click", () => {
      setMobileNavOpen(false, false);
    });
  });

  document.addEventListener("click", (e) => {
    if (
      !mobileDrawer.hidden &&
      !mobileDrawer.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      setMobileNavOpen(false, false);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !mobileDrawer.hidden) {
      setMobileNavOpen(false, true);
    }
  });
}

/**
 * Garante rolagem precisa para todas as âncoras internas (incluindo a logo #topo)
 * compensando a altura da Floating Pill Navbar
 */
function initAnchorNavigation() {
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const mobileDrawer = document.getElementById("mobile-nav-drawer");

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      if (href === "#topo") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (history.pushState) {
          history.pushState(null, "", "#topo");
        }
      } else {
        const targetId = href.slice(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          const headerOffset = 88;
          const elementTop = targetEl.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: Math.max(0, elementTop - headerOffset),
            behavior: "smooth",
          });
          if (history.pushState) {
            history.pushState(null, "", href);
          }
        }
      }

      if (menuToggle && mobileDrawer && !mobileDrawer.hidden) {
        menuToggle.setAttribute("aria-expanded", "false");
        mobileDrawer.hidden = true;
        document.body.classList.remove("nav-open");
      }
    });
  });
}

/**
 * Configura animações suaves de entrada (.reveal) e desenho da Curva Evolution (.evo-underline)
 * respeitando prefers-reduced-motion
 */
function initScrollReveal() {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealElements = document.querySelectorAll(".reveal");
  const curveMarks = document.querySelectorAll(".evo-mark, .evo-underline");

  if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
    revealElements.forEach((el) => el.classList.add("is-visible"));
    curveMarks.forEach((el) => el.classList.add("is-drawn"));
    return;
  }

  document.documentElement.classList.add("motion-ok");

  // Ativa imediatamente marcas fora de contêineres .reveal (ex: no Hero)
  curveMarks.forEach((mark) => {
    if (!mark.closest(".reveal")) {
      requestAnimationFrame(() => {
        mark.classList.add("is-drawn");
      });
    }
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          entry.target.querySelectorAll(".evo-mark, .evo-underline").forEach((c) => {
            c.classList.add("is-drawn");
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -48px 0px" }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
}

/**
 * Suporte a testes A/B dinâmicos na Headline do Hero (?hero=b|c ou ?headline=2|3)
 */
export function initHeroABTesting() {
  if (typeof window === "undefined" || !window.location) return;
  const heroHeading = document.getElementById("hero-heading");
  if (!heroHeading) return;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const variantParam = (urlParams.get("hero") || urlParams.get("headline") || "").toLowerCase();

    const variants = {
      b: 'Professores no salão corrigindo cada treino — <span class="evo-mark">sem pagar personal.<svg class="evo-underline" viewBox="0 0 240 48" aria-hidden="true"><path class="evo-curve" d="M6 38C54 44 118 42 168 30C194 24 214 14 226 6C232 2 236 4 234 10" /></svg></span>',
      "2": 'Professores no salão corrigindo cada treino — <span class="evo-mark">sem pagar personal.<svg class="evo-underline" viewBox="0 0 240 48" aria-hidden="true"><path class="evo-curve" d="M6 38C54 44 118 42 168 30C194 24 214 14 226 6C232 2 236 4 234 10" /></svg></span>',
      c: 'Climatizada, aberta às 05h30 no Centro e com <span class="evo-mark">treino acompanhado.<svg class="evo-underline" viewBox="0 0 240 48" aria-hidden="true"><path class="evo-curve" d="M6 38C54 44 118 42 168 30C194 24 214 14 226 6C232 2 236 4 234 10" /></svg></span>',
      "3": 'Climatizada, aberta às 05h30 no Centro e com <span class="evo-mark">treino acompanhado.<svg class="evo-underline" viewBox="0 0 240 48" aria-hidden="true"><path class="evo-curve" d="M6 38C54 44 118 42 168 30C194 24 214 14 226 6C232 2 236 4 234 10" /></svg></span>',
    };

    if (variants[variantParam]) {
      heroHeading.innerHTML = variants[variantParam];
      trackConversionEvent("ab_test_view", {
        experiment_id: "hero_headline",
        variant: variantParam,
      });
      // Garante desenho da curva após renderizar a variante
      const mark = heroHeading.querySelector(".evo-mark, .evo-underline");
      if (mark) {
        requestAnimationFrame(() => mark.classList.add("is-drawn"));
      }
    }
  } catch (err) {
    // Silently continue if URL parsing fails
  }
}

/**
 * Configura o comportamento de acordeão exclusivo no FAQ com animação suave de abertura e fechamento
 * (Apenas uma pergunta aberta por vez; fechamento e abertura fluidos)
 */
export function initFaqAccordion() {
  const faqList = document.querySelector(".faq-list");
  if (!faqList) return;

  const faqItems = faqList.querySelectorAll("details");
  if (!faqItems.length) return;

  const DURATION = 280;
  const EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

  function isReducedMotion() {
    return (
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function closeDetail(detail) {
    if (!detail.open || detail.classList.contains("is-closing")) return;

    if (isReducedMotion() || typeof detail.animate !== "function") {
      detail.removeAttribute("open");
      return;
    }

    const answer = detail.querySelector(".faq-answer");
    if (!answer) {
      detail.removeAttribute("open");
      return;
    }

    detail.classList.remove("is-opening");
    detail.classList.add("is-closing");
    const currentHeight = answer.offsetHeight;

    if (typeof answer.getAnimations === "function") {
      answer.getAnimations().forEach((a) => a.cancel());
    }

    const anim = answer.animate(
      [
        { height: `${currentHeight}px`, opacity: 1, paddingTop: "0px", paddingBottom: "1.4rem" },
        { height: "0px", opacity: 0, paddingTop: "0px", paddingBottom: "0px" },
      ],
      {
        duration: DURATION,
        easing: EASING,
      }
    );

    const finishClosing = () => {
      detail.removeAttribute("open");
      detail.classList.remove("is-closing");
    };

    anim.onfinish = finishClosing;
    anim.oncancel = finishClosing;
  }

  function openDetail(detail) {
    detail.setAttribute("open", "");

    if (isReducedMotion() || typeof detail.animate !== "function") return;

    const answer = detail.querySelector(".faq-answer");
    if (!answer) return;

    if (typeof answer.getAnimations === "function") {
      answer.getAnimations().forEach((a) => a.cancel());
    }

    detail.classList.add("is-opening");
    const targetHeight = answer.offsetHeight;
    const anim = answer.animate(
      [
        { height: "0px", opacity: 0, paddingTop: "0px", paddingBottom: "0px" },
        { height: `${targetHeight}px`, opacity: 1, paddingTop: "0px", paddingBottom: "1.4rem" },
      ],
      {
        duration: DURATION,
        easing: EASING,
      }
    );

    const finishOpening = () => {
      detail.classList.remove("is-opening");
    };

    anim.onfinish = finishOpening;
    anim.oncancel = finishOpening;
  }

  faqItems.forEach((targetDetail) => {
    // Remove name no JS para evitar fechamento nativo abrupto em conflito com a animação
    targetDetail.removeAttribute("name");
    const summary = targetDetail.querySelector("summary");
    if (!summary) return;

    summary.addEventListener("click", (e) => {
      e.preventDefault();

      // Se já está aberto (e não está em processo de fechar), fecha suavemente
      if (targetDetail.open && !targetDetail.classList.contains("is-closing")) {
        closeDetail(targetDetail);
        return;
      }

      // Se está fechado: fecha qualquer outro item aberto com animação suave
      faqItems.forEach((otherDetail) => {
        if (otherDetail !== targetDetail && otherDetail.open) {
          closeDetail(otherDetail);
        }
      });

      // Abre o item clicado suavemente
      openDetail(targetDetail);
    });
  });
}

/**
 * Inicialização no carregamento do DOM
 */
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    renderGymStatusUI();
    setInterval(() => {
      renderGymStatusUI();
    }, 30000);

    initWhatsAppInteractions();
    initMicroConversionTracking();
    initMobileNavigation();
    initAnchorNavigation();
    initHeroABTesting();
    initScrollReveal();
    initFaqAccordion();
  });
}
