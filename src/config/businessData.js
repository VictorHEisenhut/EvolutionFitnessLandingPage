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

  rating: {
    score: "4.7",
    maxScore: "5.0",
    count: 191,
    source: "Google Meu Negócio",
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
      badge: "Local Guide • Avaliação 5 Estrelas",
      rating: 5,
      quote:
        "Academia com ótima estrutura, limpa, climatizada, espaçosa e bem decorada. Dispõe de instrutores interessados a ensinar. Possui estacionamento próprio e acessível para os clientes.",
      highlights: ["Ótima estrutura", "100% Climatizada", "Instrutores presentes", "Estacionamento próprio"],
    },
    {
      id: "marlene-mattei-moreira",
      author: "Marlene Mattei Moreira",
      badge: "Aluna Verificada • Avaliação 5 Estrelas",
      rating: 5,
      quote:
        "Excelente academia, ambiente familiar, equipe de funcionários prontos para nos atender...",
      highlights: ["Ambiente familiar", "Atendimento humano", "Equipe atenciosa"],
    },
    {
      id: "sopros-wollinger",
      author: "Sopros Wollinger",
      badge: "Local Guide • Avaliação 5 Estrelas",
      rating: 5,
      quote:
        "Avaliação 5 estrelas destacando a excelência na estrutura, limpeza impecável, tradição e atendimento acolhedor da Academia Evolution Fitness no Centro de Timbó.",
      highlights: ["Excelência em Timbó", "Centro da cidade", "5 Estrelas"],
    },
  ],
};
