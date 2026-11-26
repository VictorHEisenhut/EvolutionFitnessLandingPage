/**
 * Módulo: Verificador Inteligente de Horário de Funcionamento e Fluxo
 * Academia Evolution Fitness (Timbó - SC)
 * Fuso Horário Forçado: America/Sao_Paulo
 */

import { BUSINESS_DATA } from "../config/businessData.js";

export const EVOLUTION_SCHEDULE = BUSINESS_DATA.schedule;

export const DAY_NAMES_PT = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

/**
 * Converte string "HH:MM" para minutos totais desde 00:00
 * @param {string} timeStr
 * @returns {number}
 */
export function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Obtém data/hora exata no fuso America/Sao_Paulo (ou a partir de um objeto override para testes)
 * @param {Date | { dayOfWeek: number, hour: number, minute: number }} [customInput]
 */
export function getTimboCurrentTime(customInput) {
  if (
    customInput &&
    typeof customInput === "object" &&
    !(customInput instanceof Date) &&
    typeof customInput.dayOfWeek === "number"
  ) {
    const { dayOfWeek, hour, minute } = customInput;
    return {
      dayOfWeek,
      dayName: DAY_NAMES_PT[dayOfWeek],
      currentMinutes: hour * 60 + minute,
      formattedTime: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    };
  }

  const now = customInput instanceof Date ? customInput : new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const partMap = {};
  parts.forEach(({ type, value }) => {
    partMap[type] = value;
  });

  const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const dayOfWeek = weekdayMap[partMap.weekday];
  const hour = parseInt(partMap.hour, 10) % 24;
  const minute = parseInt(partMap.minute, 10);

  return {
    dayOfWeek,
    dayName: DAY_NAMES_PT[dayOfWeek],
    currentMinutes: hour * 60 + minute,
    formattedTime: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
  };
}

/**
 * Formata "HH:MM" para padrão brasileiro "HHhMM" (ex.: "23:00" -> "23h00")
 * @param {string} timeStr
 * @returns {string}
 */
export function formatHourPT(timeStr) {
  return timeStr.replace(":", "h");
}

/**
 * Formata "HH:MM" de forma compacta para caber em badges mobile (ex.: "23:00" -> "23h", "05:30" -> "05h30")
 * @param {string} timeStr
 * @returns {string}
 */
export function formatHourCompactPT(timeStr) {
  return timeStr.endsWith(":00") ? `${timeStr.slice(0, 2)}h` : timeStr.replace(":", "h");
}

/**
 * Retorna o status completo de funcionamento da Academia Evolution Fitness
 * @param {Date | { dayOfWeek: number, hour: number, minute: number }} [customInput]
 */
export function getEvolutionGymStatus(customInput) {
  const { dayOfWeek, dayName, currentMinutes, formattedTime } = getTimboCurrentTime(customInput);
  const todayShifts = EVOLUTION_SCHEDULE[dayOfWeek] || [];

  // 1. Verifica se está dentro de algum turno aberto hoje
  for (const shift of todayShifts) {
    const openMin = timeToMinutes(shift.open);
    const closeMin = timeToMinutes(shift.close);

    if (currentMinutes >= openMin && currentMinutes < closeMin) {
      const minutesToClose = closeMin - currentMinutes;
      const isClosingSoon = minutesToClose <= 30;

      return {
        isOpen: true,
        closingSoon: isClosingSoon,
        dayOfWeek,
        dayName,
        formattedTime,
        stateCode: isClosingSoon ? "CLOSING_SOON" : "OPEN",
        badgeText: isClosingSoon
          ? `FECHANDO EM BREVE • Fecha às ${formatHourPT(shift.close)}`
          : `ABERTA AGORA • Até ${formatHourPT(shift.close)}`,
        shortBadgeText: isClosingSoon
          ? `Fecha em ${minutesToClose} min`
          : `Aberta • até ${formatHourCompactPT(shift.close)}`,
        detailText: `Horário local em Timbó: ${formatHourPT(formattedTime)} (${dayName})`,
        holidayWarning: "O horário pode mudar em feriados.",
      };
    }
  }

  // 2. Se está fechada agora, verifica se ainda abre hoje (ex.: antes das 05:30 na semana, antes das 09:00 no sábado ou antes das 17:00 no domingo)
  for (const shift of todayShifts) {
    const openMin = timeToMinutes(shift.open);
    if (currentMinutes < openMin) {
      return {
        isOpen: false,
        closingSoon: false,
        dayOfWeek,
        dayName,
        formattedTime,
        stateCode: "CLOSED_OPENS_TODAY",
        badgeText: `FECHADA AGORA • Abre hoje às ${formatHourPT(shift.open)}`,
        shortBadgeText: `Abre hoje ${formatHourCompactPT(shift.open)}`,
        detailText: `Prepare seu treino! Abrimos hoje das ${formatHourPT(shift.open)} às ${formatHourPT(shift.close)} (Horário local: ${formatHourPT(formattedTime)}).`,
        holidayWarning: "O horário pode mudar em feriados.",
      };
    }
  }

  // 3. Caso já tenha encerrado o expediente de hoje, busca o próximo dia de abertura
  for (let offset = 1; offset <= 7; offset++) {
    const nextDayIndex = (dayOfWeek + offset) % 7;
    const nextDayShifts = EVOLUTION_SCHEDULE[nextDayIndex];
    if (nextDayShifts && nextDayShifts.length > 0) {
      const firstShift = nextDayShifts[0];
      const dayLabel = offset === 1 ? "amanhã" : `${DAY_NAMES_PT[nextDayIndex]}`;
      const shortDayLabel = offset === 1 ? "amanhã" : `${DAY_NAMES_PT[nextDayIndex].slice(0, 3)}.`;
      return {
        isOpen: false,
        closingSoon: false,
        dayOfWeek,
        dayName,
        formattedTime,
        stateCode: "CLOSED",
        badgeText: `FECHADA AGORA • Abre ${dayLabel} às ${formatHourPT(firstShift.open)}`,
        shortBadgeText: `Abre ${shortDayLabel} ${formatHourCompactPT(firstShift.open)}`,
        detailText: `Horário local em Timbó: ${formatHourPT(formattedTime)} (${dayName}). Deixe sua mensagem no WhatsApp!`,
        holidayWarning: "O horário pode mudar em feriados.",
      };
    }
  }
}
