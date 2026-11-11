/**
 * Suíte Completa de Testes Automatizados (Critérios de Aceite da Especificação Técnica)
 * Academia Evolution Fitness (Timbó - SC)
 */

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { BUSINESS_DATA } from "../src/config/businessData.js";
import { getEvolutionGymStatus, timeToMinutes } from "../src/js/liveGymStatus.js";
import {
  WHATSAPP_NUMBER,
  WHATSAPP_INTENTS,
  buildEvolutionWhatsAppUrl,
  openEvolutionWhatsApp,
} from "../src/js/smartWhatsApp.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

test("1. Dados Oficiais do Negócio (SSOT): Razão Social, CNPJ, Endereço e Contatos", () => {
  assert.equal(BUSINESS_DATA.name, "Academia Evolution Fitness");
  assert.equal(BUSINESS_DATA.legalName, "Evolution Academia Ltda.");
  assert.equal(BUSINESS_DATA.cnpj, "16.951.960/0001-77");
  assert.equal(BUSINESS_DATA.foundedYear, 2012);
  assert.equal(BUSINESS_DATA.address.fullAddress, "Av. Nereu Ramos, 300 - Centro, Timbó - SC, 89120-000");
  assert.equal(BUSINESS_DATA.contact.whatsappRaw, "5547991717074");
  assert.equal(BUSINESS_DATA.contact.landlineFormatted, "(47) 3382-7985");
  assert.equal(BUSINESS_DATA.contact.instagramHandle, "@academiaevolutionfitness_");
  assert.equal(BUSINESS_DATA.rating.score, "4.7");
  assert.equal(BUSINESS_DATA.rating.count, 191);
});

test("2. Motor de Horário (America/Sao_Paulo): Segunda a Quinta (05:30 às 23:00) e Fechando em Breve", () => {
  // Segunda-feira às 05:30 (Exatamente na abertura)
  const monOpen = getEvolutionGymStatus({ dayOfWeek: 1, hour: 5, minute: 30 });
  assert.equal(monOpen.isOpen, true);
  assert.equal(monOpen.stateCode, "OPEN");
  assert.match(monOpen.badgeText, /ABERTA AGORA • Até às 23:00/);

  // Quarta-feira às 21:00 (Aberto)
  const wedOpen = getEvolutionGymStatus({ dayOfWeek: 3, hour: 21, minute: 0 });
  assert.equal(wedOpen.isOpen, true);

  // Quinta-feira às 22:45 (Faltando 15 min para fechar -> CLOSING_SOON)
  const thuClosing = getEvolutionGymStatus({ dayOfWeek: 4, hour: 22, minute: 45 });
  assert.equal(thuClosing.isOpen, true);
  assert.equal(thuClosing.closingSoon, true);
  assert.equal(thuClosing.stateCode, "CLOSING_SOON");
  assert.match(thuClosing.badgeText, /FECHANDO EM BREVE • Fecha às 23:00/);
});

test("3. Motor de Horário: Sexta-feira (05:30 às 22:00) e fechamento após 22:00", () => {
  const friOpen = getEvolutionGymStatus({ dayOfWeek: 5, hour: 19, minute: 0 });
  assert.equal(friOpen.isOpen, true);
  assert.match(friOpen.badgeText, /Até às 22:00/);

  const friClosed = getEvolutionGymStatus({ dayOfWeek: 5, hour: 22, minute: 1 });
  assert.equal(friClosed.isOpen, false);
  assert.equal(friClosed.stateCode, "CLOSED");
  assert.match(friClosed.badgeText, /FECHADA AGORA • Abre amanhã às 09:00/);
});

test("4. Motor de Horário: Sábado (09:00 às 12:00) e fechamento após 12:00", () => {
  // Sábado 10:30 (aberto)
  const satMorning = getEvolutionGymStatus({ dayOfWeek: 6, hour: 10, minute: 30 });
  assert.equal(satMorning.isOpen, true);
  assert.equal(satMorning.stateCode, "OPEN");
  assert.match(satMorning.badgeText, /ABERTA AGORA • Até às 12:00/);

  // Sábado 13:30 (Encerrado -> Abre amanhã (domingo) às 17:00)
  const satAfternoon = getEvolutionGymStatus({ dayOfWeek: 6, hour: 13, minute: 30 });
  assert.equal(satAfternoon.isOpen, false);
  assert.equal(satAfternoon.stateCode, "CLOSED");
  assert.match(satAfternoon.badgeText, /FECHADA AGORA • Abre amanhã às 17:00/);
});

test("5. Motor de Horário: Domingo (17:00 às 19:00) -> Manhã, Tarde aberta e Noite fechada", () => {
  // Domingo 14:00 (Antes de abrir hoje às 17:00)
  const sunBefore = getEvolutionGymStatus({ dayOfWeek: 0, hour: 14, minute: 0 });
  assert.equal(sunBefore.isOpen, false);
  assert.equal(sunBefore.stateCode, "CLOSED_OPENS_TODAY");
  assert.match(sunBefore.badgeText, /FECHADA AGORA • Abre hoje às 17:00/);

  // Domingo 18:00 (Aberto das 17:00 às 19:00)
  const sunOpen = getEvolutionGymStatus({ dayOfWeek: 0, hour: 18, minute: 0 });
  assert.equal(sunOpen.isOpen, true);
  assert.equal(sunOpen.stateCode, "OPEN");
  assert.match(sunOpen.badgeText, /ABERTA AGORA • Até às 19:00/);

  // Domingo 19:30 (Encerrado -> Abre amanhã (segunda) às 05:30)
  const sunNight = getEvolutionGymStatus({ dayOfWeek: 0, hour: 19, minute: 30 });
  assert.equal(sunNight.isOpen, false);
  assert.equal(sunNight.stateCode, "CLOSED");
  assert.match(sunNight.badgeText, /FECHADA AGORA • Abre amanhã às 05:30/);
});

test("6. Seletor Inteligente de WhatsApp e Disparo de Analytics (GA4 dataLayer)", () => {
  assert.equal(WHATSAPP_NUMBER, "5547991717074");

  const requiredKeys = ["experimental", "planos", "modalidades", "aluno"];
  for (const key of requiredKeys) {
    assert.ok(WHATSAPP_INTENTS[key], `Intenção ${key} deve existir`);
    const url = buildEvolutionWhatsAppUrl(key);
    assert.ok(url.startsWith("https://wa.me/5547991717074?text="));
    assert.ok(url.length > 45);
  }

  // Verifica registro no dataLayer
  globalThis.dataLayer = [];
  const generatedUrl = openEvolutionWhatsApp("modalidades", "test_suite");
  assert.ok(generatedUrl.includes("Modalidades") || generatedUrl.includes("modalidades"));
  assert.equal(globalThis.dataLayer.length, 1);
  assert.equal(globalThis.dataLayer[0].event, "generate_lead_whatsapp");
  assert.equal(globalThis.dataLayer[0].lead_intent, "modalidades");
  assert.equal(globalThis.dataLayer[0].cta_location, "test_suite");
});

test("7. Validação de SEO Local (JSON-LD ExerciseGym), Depoimentos Reais e Estrutura HTML", () => {
  const htmlPath = path.join(ROOT_DIR, "index.html");
  const htmlContent = fs.readFileSync(htmlPath, "utf-8");

  // Verifica presença de dados obrigatórios no HTML
  assert.ok(htmlContent.includes("16.951.960/0001-77"), "CNPJ deve constar no HTML");
  assert.ok(htmlContent.includes("Evolution Academia Ltda."), "Razão Social deve constar no HTML");
  assert.ok(htmlContent.includes("Av. Nereu Ramos, 300"), "Endereço deve constar no HTML");
  assert.ok(htmlContent.includes("89120-000"), "CEP deve constar no HTML");
  assert.ok(htmlContent.includes("(47) 99171-7074"), "WhatsApp deve constar no HTML");
  assert.ok(htmlContent.includes("(47) 3382-7985"), "Fixo deve constar no HTML");
  assert.ok(htmlContent.includes("@academiaevolutionfitness_"), "Instagram deve constar no HTML");
  assert.ok(htmlContent.includes("Rede Boa Vida"), "Convênio Rede Boa Vida deve constar no HTML");

  // Verifica os 3 depoimentos reais obrigatórios
  assert.ok(htmlContent.includes("Gabriel Santos"));
  assert.ok(htmlContent.includes("Marlene Mattei Moreira"));
  assert.ok(htmlContent.includes("Sopros Wollinger"));

  // Extrai e faz parse do JSON-LD Schema.org
  const jsonLdMatch = htmlContent.match(
    /<script type="application\/ld\+json" id="schema-local-business">\s*([\s\S]*?)\s*<\/script>/
  );
  assert.ok(jsonLdMatch, "Bloco JSON-LD #schema-local-business deve existir");

  const schemaData = JSON.parse(jsonLdMatch[1]);
  assert.ok(schemaData["@type"].includes("ExerciseGym"));
  assert.equal(schemaData.legalName, "Evolution Academia Ltda.");
  assert.equal(schemaData.taxID, "16.951.960/0001-77");
  assert.equal(schemaData.address.postalCode, "89120-000");
  assert.equal(schemaData.aggregateRating.ratingValue, "4.7");
  assert.equal(schemaData.aggregateRating.ratingCount, "191");
  assert.equal(schemaData.openingHoursSpecification.length, 4);
  assert.equal(schemaData.review.length, 3);
});

test("8. Integridade de Ativos Visuais, Brand Redesign (#00B245 / #000000), Zero Vermelho e IDs preservados", () => {
  const requiredFiles = [
    "index.html",
    "src/styles/tokens.css",
    "src/styles/main.css",
    "src/config/businessData.js",
    "src/js/liveGymStatus.js",
    "src/js/smartWhatsApp.js",
    "src/js/main.js",
    "public/favicon.svg",
    "public/robots.txt",
    "public/sitemap.xml",
    "public/assets/brand/logo-evolution.svg",
    "public/assets/brand/evolution-curve.svg",
    "public/assets/images/hero-salao-climatizado.jpg",
    "public/assets/images/instrutor-acompanhamento.jpg",
    "public/assets/images/cardio-esteiras.jpg",
    "public/assets/images/funcional-pesos-livres.jpg",
    "public/assets/images/salao-musculacao-real.jpg",
    "public/assets/images/cardio-esteiras-real.jpg",
  ];

  for (const relPath of requiredFiles) {
    const absPath = path.join(ROOT_DIR, relPath);
    assert.ok(fs.existsSync(absPath), `Arquivo obrigatório deve existir: ${relPath}`);
    const stats = fs.statSync(absPath);
    assert.ok(stats.size > 0, `Arquivo não pode estar vazio: ${relPath}`);
  }

  // Verifica ausência total de cores vermelhas antigas e estilos inline no HTML/CSS
  const forbiddenRedPattern = /e63946|ff4d5a|ff858f|ff6b76|ff7580|c81e2b|9e1924|230,\s*57,\s*70|#25d366/i;
  for (const fileToCheck of ["index.html", "src/styles/tokens.css", "src/styles/main.css", "public/favicon.svg"]) {
    const content = fs.readFileSync(path.join(ROOT_DIR, fileToCheck), "utf-8");
    assert.equal(
      forbiddenRedPattern.test(content),
      false,
      `Nenhuma cor vermelha antiga ou #25d366 deve existir em ${fileToCheck}`
    );
  }

  const htmlContent = fs.readFileSync(path.join(ROOT_DIR, "index.html"), "utf-8");
  assert.equal(/\sstyle="/i.test(htmlContent), false, "index.html não deve conter atributos style inline");
  assert.ok(htmlContent.includes("./public/assets/brand/logo-evolution.svg"), "Logo SVG oficial deve estar no HTML");

  // Verifica arquitetura do Floating Pill Navbar e Full-Bleed Hero com Transit (sem card e sem duplicação)
  assert.ok(htmlContent.includes('class="header-pill"'), "Navbar deve usar .header-pill flutuante");
  assert.ok(htmlContent.includes('class="hero-bg-media"'), "Hero deve ter background full-bleed .hero-bg-media");
  assert.ok(htmlContent.includes('class="hero-bg-transit"'), "Hero deve ter máscara de transição .hero-bg-transit");
  assert.ok(htmlContent.includes('class="hero-highlights-strip'), "Hero deve ter barra HUD integrada .hero-highlights-strip");
  assert.equal(htmlContent.includes("hero-main-card"), false, "A imagem do Hero não deve ficar presa em um card .hero-main-card");
  assert.equal(htmlContent.includes('class="trust-bar"'), false, "Não deve haver seção .trust-bar duplicando os 4 destaques do Hero");
  assert.equal(htmlContent.includes("sim-presets-bar"), false, "Não deve haver barra de simulação de horário para consulta");
  assert.equal(htmlContent.includes('class="map-pin"'), false, "Não deve haver pino HTML fixo sobreposto ao iframe do mapa");
  assert.equal(htmlContent.includes("crowd-widget"), false, "Não deve haver widget de estimativa de movimento (.crowd-widget)");

  // Verifica ausência total de 'biofílica', 'biofilia', 'plantas naturais' ou 'arborizado'
  assert.equal(
    /biof[ií]lic|biofilia|plantas naturais|arborizado/i.test(htmlContent),
    false,
    "HTML não deve conter termos 'biofílica', 'biofilia', 'plantas naturais' ou 'arborizado'"
  );

  // Verifica ausência total de 'karatê', 'karate' ou 'artes marciais' até confirmação oficial
  assert.equal(
    /karat[eê]|artes marciais/i.test(htmlContent),
    false,
    "HTML não deve conter referências a Karatê ou Artes Marciais até haver confirmação oficial"
  );

  // Verifica ausência de text-transform: lowercase forçado no CSS e capitalização correta na Navbar
  const mainCssContent = fs.readFileSync(path.join(ROOT_DIR, "src/styles/main.css"), "utf-8");
  assert.equal(
    /text-transform:\s*lowercase/i.test(mainCssContent),
    false,
    "main.css não deve forçar text-transform: lowercase nos textos de interface"
  );
  assert.equal(
    mainCssContent.includes("grid-template-columns: auto 1fr auto"),
    false,
    "header-pill deve usar Flexbox (sem grid auto 1fr auto que permite sobreposição em telas intermediárias)"
  );
  const logoSvgContent = fs.readFileSync(path.join(ROOT_DIR, "public/assets/brand/logo-evolution.svg"), "utf-8");
  assert.ok(
    logoSvgContent.includes('width="953"') && logoSvgContent.includes('height="209"'),
    "logo-evolution.svg deve possuir width e height intrínsecos para evitar colapso de largura no flex/grid"
  );
  assert.ok(htmlContent.includes('<a href="#estrutura">Estrutura</a>'), "Link Estrutura na navbar com inicial maiúscula");
  assert.ok(htmlContent.includes('<a href="#modalidades">Modalidades</a>'), "Link Modalidades na navbar com inicial maiúscula");
  assert.ok(htmlContent.includes('<a href="#metodo">Método</a>'), "Link Método na navbar com inicial maiúscula");
  assert.ok(htmlContent.includes('<a href="#planos">Planos</a>'), "Link Planos na navbar com inicial maiúscula");
  assert.ok(htmlContent.includes('<a href="#avaliacoes">Avaliações</a>'), "Link Avaliações na navbar com inicial maiúscula");
  assert.ok(htmlContent.includes('<a href="#horarios">Horários &amp; Local</a>'), "Link Horários & Local na navbar com inicial maiúscula");
  assert.ok(htmlContent.includes("TotalPass"), "TotalPass deve estar presente no HTML");
  assert.ok(htmlContent.includes('id="metodo"'), "Seção Método (#metodo) deve existir no HTML");

  // Verifica se todas as âncoras href="#..." apontam para um id="..." existente no HTML e se #topo está no <body> (não no header fixo)
  assert.ok(htmlContent.includes('<body id="topo">'), "id='topo' deve estar no <body> para rolar ao topo corretamente");
  const anchorMatches = [...htmlContent.matchAll(/href="#([a-zA-Z0-9_-]+)"/g)];
  assert.ok(anchorMatches.length >= 15, "Deve haver links de navegação por âncora na página");
  for (const match of anchorMatches) {
    const targetId = match[1];
    assert.ok(
      htmlContent.includes(`id="${targetId}"`),
      `Toda âncora href="#${targetId}" deve apontar para um elemento com id="${targetId}" existente no HTML`
    );
  }

  // Verifica preservação de todos os IDs exigidos pelo JS
  const requiredIds = [
    "header-live-badge",
    "header-live-text",
    "mobile-menu-toggle",
    "mobile-nav-drawer",
    "schedule-live-card",
    "schedule-live-badge-text",
    "schedule-live-detail",
    "smart-whatsapp-widget",
    "whatsapp-widget-toggle",
    "whatsapp-popover",
    "whatsapp-popover-close",
    "schema-local-business",
  ];
  for (const id of requiredIds) {
    assert.ok(htmlContent.includes(`id="${id}"`), `ID obrigatório preservado: #${id}`);
  }

  // Verifica comportamento de acordeão exclusivo no FAQ (apenas uma pergunta aberta por vez)
  const faqDetailsMatches = [...htmlContent.matchAll(/<details\s+class="faq-item reveal"([^>]*)>/g)];
  assert.equal(faqDetailsMatches.length, 7, "Devem existir 7 itens de FAQ");
  for (const match of faqDetailsMatches) {
    assert.ok(match[1].includes('name="faq"'), "Cada item de FAQ deve possuir name='faq' para acordeão exclusivo");
  }
  const mainJsContent = fs.readFileSync(path.join(ROOT_DIR, "src/js/main.js"), "utf-8");
  assert.ok(mainJsContent.includes("initFaqAccordion"), "main.js deve conter a função initFaqAccordion");
});

