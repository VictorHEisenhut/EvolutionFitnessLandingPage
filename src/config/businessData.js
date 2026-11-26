/**
 * Single Source of Truth (SSOT) — Dados Oficiais da Academia Evolution Fitness (Timbó - SC)
 * Razão Social: Evolution Academia Ltda. | CNPJ: 16.951.960/0001-77
 */

export const BUSINESS_DATA = {
  name: "Academia Evolution Fitness",
  legalName: "Evolution Academia Ltda.",
  cnpj: "16.951.960/0001-77",
  foundedYear: 2012,
  traditionYearsText: "+14 anos de tradição em Timbó",
  timezone: "America/Sao_Paulo",

  address: {
    street: "Av. Nereu Ramos, 300",
    neighborhood: "Centro",
    city: "Timbó",
    state: "SC",
    postalCode: "89120-000",
    country: "BR",
    fullAddress: "Av. Nereu Ramos, 300 - Centro, Timbó - SC, 89120-000",
    coordinates: {
      latitude: -26.8247,
      longitude: -49.2718,
    },
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Academia+Evolution+Fitness+Av.+Nereu+Ramos+300+Centro+Timbo+SC+89120-000",
  },

  contact: {
    whatsappRaw: "5547991717074",
    whatsappFormatted: "(47) 99171-7074",
    whatsappDirectUrl: "https://wa.me/5547991717074",
    landlineRaw: "+554733827985",
    landlineFormatted: "(47) 3382-7985",
    instagramHandle: "@academiaevolutionfitness_",
    instagramUrl: "https://www.instagram.com/academiaevolutionfitness_/",
  },

  // Valores placeholder (substituir pelos valores vigentes da academia)
  plans: {
    mensal: {
      id: "mensal",
      name: "Plano Mensal",
      kicker: "Flexibilidade Total",
      priceReference: "XXX",
      periodLabel: "/mês",
      commitment: "Sem fidelidade",
      description: "Ideal para quem quer experimentar a rotina da academia com liberdade absoluta, sem fidelidade.",
      isPlaceholder: true,
    },
    trimestral: {
      id: "trimestral",
      name: "Plano Trimestral",
      kicker: "Evolução Consistente",
      priceReference: "XXX",
      periodLabel: "/mês",
      commitment: "Plano de 90 dias",
      description: "O equilíbrio perfeito para consolidar o hábito do treino e conquistar resultados em 90 dias.",
      isPlaceholder: true,
    },
    anual: {
      id: "anual",
      name: "Plano Anual / Recorrente",
      kicker: "Melhor Custo-Benefício",
      priceReference: "XXX",
      priceOld: "XXX",
      savingsText: "Economize R$ XXX no ano",
      periodLabel: "/mês",
      commitment: "12 meses recorrente",
      popularBadge: "Mais Escolhido • Economia Máxima",
      description: "Para quem decidiu fazer da saúde, força e longevidade um estilo de vida definitivo.",
      isPlaceholder: true,
    },
  },

  tracking: {
    gtmId: "GTM-EVOLUTION",
    ga4Id: "G-EVOLUTION",
    metaPixelId: "PIXEL-EVOLUTION",
  },

  rating: {
    score: "4.7",
    maxScore: "5.0",
    count: 191,
    source: "Google",
  },

  partnerships: [
    {
      name: "TotalPass",
      tier: "A partir do plano TP 2",
      description: "Benefício corporativo para colaboradores de empresas parceiras em Timbó e região.",
    },
    {
      name: "Rede Boa Vida",
      tier: "Convênio Local",
      description: "Descontos e condições especiais para associados da Rede Boa Vida em Timbó.",
    },
    {
      name: "Convênios Empresariais & Familiares",
      tier: "Parcerias Diretas",
      description: "Planos especiais para grupos de colaboradores e combos familiares.",
    },
  ],

  schedule: {
    0: [{ open: "17:00", close: "19:00", label: "17h00 às 19h00" }], // Domingo
    1: [{ open: "05:30", close: "23:00", label: "05h30 às 23h00" }], // Segunda-feira
    2: [{ open: "05:30", close: "23:00", label: "05h30 às 23h00" }], // Terça-feira
    3: [{ open: "05:30", close: "23:00", label: "05h30 às 23h00" }], // Quarta-feira
    4: [{ open: "05:30", close: "23:00", label: "05h30 às 23h00" }], // Quinta-feira
    5: [{ open: "05:30", close: "22:00", label: "05h30 às 22h00" }], // Sexta-feira
    6: [{ open: "09:00", close: "12:00", label: "09h00 às 12h00" }], // Sábado
  },

  scheduleTable: [
    { dayIndex: 1, dayName: "Segunda-feira", hours: "05h30 às 23h00" },
    { dayIndex: 2, dayName: "Terça-feira", hours: "05h30 às 23h00" },
    { dayIndex: 3, dayName: "Quarta-feira", hours: "05h30 às 23h00" },
    { dayIndex: 4, dayName: "Quinta-feira", hours: "05h30 às 23h00" },
    { dayIndex: 5, dayName: "Sexta-feira", hours: "05h30 às 22h00" },
    { dayIndex: 6, dayName: "Sábado", hours: "09h00 às 12h00" },
    { dayIndex: 0, dayName: "Domingo", hours: "17h00 às 19h00" },
  ],

  reviews: [
    {
      id: "gabriel-santos",
      author: "Gabriel Santos",
      badge: "Avaliação Verificada no Google",
      rating: 5,
      quote:
        "Academia com ótima estrutura, limpa, climatizada, espaçosa e bem decorada. Dispõe de instrutores interessados a ensinar. Possui estacionamento próprio e acessível para os clientes.",
      highlights: ["Ótima estrutura", "100% Climatizada", "Instrutores presentes", "Estacionamento próprio"],
    },
    {
      id: "marlene-mattei-moreira",
      author: "Marlene Mattei Moreira",
      badge: "Avaliação Verificada no Google",
      rating: 5,
      quote:
        "Excelente academia, ambiente familiar, equipe de funcionários prontos para nos atender.",
      highlights: ["Ambiente familiar", "Atendimento humano", "Equipe atenciosa"],
    },
    {
      id: "sopros-wollinger",
      author: "Sopros Wollinger",
      badge: "Avaliação Verificada no Google",
      rating: 5,
      quote:
        "Academia excelente no Centro de Timbó! Estrutura de primeira, ambiente limpo, climatizado e atendimento nota 10 de toda a equipe.",
      highlights: ["Excelência em Timbó", "Centro da cidade", "5 Estrelas"],
    },
  ],

  // Perfis de exemplo (substituir pelos nomes, CREFs e fotos reais da equipe)
  instructors: [
    {
      id: "rafael-mendes",
      name: "Rafael Mendes",
      role: "Coordenador Técnico & Biomecânica",
      cref: "CREF 024810-G/SC",
      shift: "Manhã • 05h30 às 12h00",
      specialties: ["Hipertrofia", "Biomecânica", "Iniciantes"],
      bio: "Especialista em montagem de treinos individualizados e correção postural para quem busca resultados consistentes com total segurança.",
      photo: "./public/assets/images/instrutor-rafael.jpg",
      photoAlt: "Instrutor Rafael Mendes no salão da Academia Evolution Fitness",
      isPlaceholder: true,
    },
    {
      id: "fernanda-klemz",
      name: "Fernanda Klemz",
      role: "Emagrecimento, Saúde & Reabilitação",
      cref: "CREF 027642-G/SC",
      shift: "Tarde • 12h00 às 18h00",
      specialties: ["Emagrecimento", "Terceira Idade", "Postura & Lesões"],
      bio: "Acompanhamento acolhedor e adaptado para fortalecimento articular, definição muscular, prevenção de dores e qualidade de vida em todas as idades.",
      photo: "./public/assets/images/instrutora-fernanda.jpg",
      photoAlt: "Instrutora Fernanda Klemz no salão climatizado da Academia Evolution Fitness",
      isPlaceholder: true,
    },
    {
      id: "lucas-ferreira",
      name: "Lucas Ferreira",
      role: "Força & Treinamento Funcional",
      cref: "CREF 031208-G/SC",
      shift: "Noite • 17h00 às 23h00",
      specialties: ["Treino Funcional", "Pesos Livres", "Mobilidade"],
      bio: "Foco em progressão segura de cargas, mobilidade articular e condicionamento completo com supervisão ativa no salão do básico ao avançado.",
      photo: "./public/assets/images/instrutor-lucas.jpg",
      photoAlt: "Instrutor Lucas Ferreira na área de pesos livres e funcional da Academia Evolution Fitness",
      isPlaceholder: true,
    },
  ],
};
