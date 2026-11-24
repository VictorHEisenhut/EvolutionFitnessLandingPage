/**
 * Módulo: Seletor Inteligente de WhatsApp e Rastreamento de Conversão (GA4 + Meta Pixel)
 * Academia Evolution Fitness (Timbó - SC)
 * WhatsApp Principal: (47) 99171-7074 -> https://wa.me/5547991717074
 */

import { BUSINESS_DATA } from "../config/businessData.js";

export const WHATSAPP_NUMBER = BUSINESS_DATA.contact.whatsappRaw;

export const WHATSAPP_INTENTS = {
  experimental: {
    key: "experimental",
    label: "Agendar Aula Experimental Gratuita",
    subtitle: "Conhecer estrutura + 1º treino acompanhado",
    message:
      "Olá! Vim pelo site da Academia Evolution Fitness e gostaria de agendar uma Aula Experimental Gratuita. Podem me informar como funciona?",
  },
  planos: {
    key: "planos",
    label: "Consultar Planos e Matrícula",
    subtitle: "Valores Mensal, Trimestral e Anual/Recorrente",
    message:
      "Olá! Vim pelo site da Academia Evolution Fitness e gostaria de conhecer os planos e valores (Mensal, Trimestral, Anual e Convênios).",
  },
  modalidades: {
    key: "modalidades",
    label: "Modalidades & Funcional",
    subtitle: "Musculação, Cárdio e Treino Funcional",
    message:
      "Olá! Vim pelo site da Evolution Fitness e gostaria de saber mais sobre as modalidades de Musculação, Cárdio e Treinamento Funcional.",
  },
  aluno: {
    key: "aluno",
    label: "Atendimento ao Aluno / Recepção",
    subtitle: "Já sou aluno(a) da Evolution Fitness",
    message:
      "Olá, equipe Evolution Fitness! Já sou aluno(a) e gostaria de falar com a recepção.",
  },
  // Intenções contextuais adicionais de cards específicos
  musculacao: {
    key: "musculacao",
    label: "Musculação Completa com Acompanhamento",
    subtitle: "Treino individualizado + Professores no salão",
    message:
      "Olá! Vim pelo site da Evolution Fitness e quero saber mais sobre a Musculação Completa com acompanhamento dos instrutores.",
  },
  cardio: {
    key: "cardio",
    label: "Ergometria & Cárdio",
    subtitle: "Esteiras, bikes e queima calórica",
    message:
      "Olá! Vim pelo site da Evolution Fitness e gostaria de saber mais sobre a área de Ergometria e Cárdio no salão 100% climatizado.",
  },
  funcional: {
    key: "funcional",
    label: "Treinamento Funcional & Pesos Livres",
    subtitle: "Mobilidade, equilíbrio e dinamismo",
    message:
      "Olá! Vim pelo site da Evolution Fitness e gostaria de saber mais sobre o Treinamento Funcional e área de Pesos Livres.",
  },
  plano_mensal: {
    key: "plano_mensal",
    label: "Plano Mensal (Flexibilidade)",
    subtitle: "A partir de R$ 139,90/mês",
    message:
      "Olá! Vim pelo site da Evolution Fitness e gostaria de consultar as condições do Plano Mensal (a partir de R$ 139,90/mês).",
  },
  plano_trimestral: {
    key: "plano_trimestral",
    label: "Plano Trimestral (Evolução Consistente)",
    subtitle: "A partir de R$ 119,90/mês",
    message:
      "Olá! Vim pelo site da Evolution Fitness e gostaria de consultar as condições do Plano Trimestral (a partir de R$ 119,90/mês).",
  },
  plano_anual: {
    key: "plano_anual",
    label: "Plano Anual / Recorrente (Melhor Custo-Benefício)",
    subtitle: "A partir de R$ 99,90/mês • Economia Máxima",
    message:
      "Olá! Vim pelo site da Evolution Fitness e quero garantir a condição especial do Plano Anual / Recorrente (a partir de R$ 99,90/mês).",
  },
  convenios: {
    key: "convenios",
    label: "Convênios (TotalPass / Rede Boa Vida / Empresas)",
    subtitle: "TotalPass, Rede Boa Vida e parcerias corporativas",
    message:
      "Olá! Vim pelo site da Evolution Fitness e gostaria de verificar as condições para convênios (TotalPass, Rede Boa Vida e empresas parceiras) ou plano familiar.",
  },
  instrutores: {
    key: "instrutores",
    label: "Conhecer a Equipe & Agendar 1º Treino",
    subtitle: "Aula experimental gratuita acompanhada por professor",
    message:
      "Olá! Vim pelo site da Evolution Fitness, conheci a equipe de instrutores e gostaria de agendar minha Aula Experimental Gratuita com acompanhamento.",
  },
};

/**
 * Gera a URL completa e codificada do WhatsApp (wa.me)
 * @param {string} [intentKey="experimental"]
 * @returns {string}
 */
export function buildEvolutionWhatsAppUrl(intentKey = "experimental") {
  const selectedIntent = WHATSAPP_INTENTS[intentKey] || WHATSAPP_INTENTS.experimental;
  const encodedText = encodeURIComponent(selectedIntent.message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
}

/**
 * Registra eventos de conversão no dataLayer (GA4) e Meta Pixel (fbq)
 * @param {string} eventName
 * @param {Record<string, any>} payload
 */
export function trackConversionEvent(eventName, payload = {}) {
  const targetWindow = typeof globalThis !== "undefined" ? globalThis.window || globalThis : null;
  if (!targetWindow) return;

  targetWindow.dataLayer = targetWindow.dataLayer || [];
  targetWindow.dataLayer.push({
    event: eventName,
    business_unit: "Academia Evolution Fitness Timbo",
    timestamp: new Date().toISOString(),
    ...payload,
  });

  if (typeof targetWindow.fbq === "function") {
    if (eventName === "generate_lead_whatsapp" || eventName === "click_phone_call") {
      targetWindow.fbq("track", "Contact", payload);
    } else if (eventName === "click_get_directions") {
      targetWindow.fbq("track", "FindLocation", payload);
    } else if (eventName === "click_instagram_profile") {
      targetWindow.fbq("track", "ViewContent", payload);
    } else {
      targetWindow.fbq("trackCustom", eventName, payload);
    }
  }
}

/**
 * Dispara o rastreamento e abre o link do WhatsApp com a intenção selecionada
 * @param {string} [intentKey="experimental"]
 * @param {string} [ctaLocation="floating_widget"]
 * @returns {string} URL gerada
 */
export function openEvolutionWhatsApp(intentKey = "experimental", ctaLocation = "floating_widget") {
  const selectedIntent = WHATSAPP_INTENTS[intentKey] || WHATSAPP_INTENTS.experimental;
  const whatsappUrl = buildEvolutionWhatsAppUrl(selectedIntent.key);

  trackConversionEvent("generate_lead_whatsapp", {
    lead_intent: selectedIntent.key,
    intent_label: selectedIntent.label,
    cta_location: ctaLocation,
  });

  if (typeof window !== "undefined" && typeof window.open === "function") {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return whatsappUrl;
}
