import { LIFE_PATH_ARCHETYPES } from '../data/numerology.js';

// Tabla pitagórica de reducción alfanumérica
const PYTHAGOREAN_MAP = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

const VOWELS = ['A', 'E', 'I', 'O', 'U'];

/**
 * Reduce un número sumando sus dígitos hasta obtener 1-9 o un número maestro (11, 22, 33)
 */
export function reduceToCoreNumber(num, preserveMasters = true) {
  while (num > 9) {
    if (preserveMasters && (num === 11 || num === 22 || num === 33)) {
      return num;
    }
    num = String(num)
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return num;
}

/**
 * Calcula el Camino de Vida a partir de una fecha YYYY-MM-DD
 */
export function calculateLifePath(dateStr) {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return null;

  // Reducir día, mes y año de forma separada según el método pitagórico clásico
  const reducedDay = reduceToCoreNumber(day, true);
  const reducedMonth = reduceToCoreNumber(month, true);
  const reducedYear = reduceToCoreNumber(year, true);

  const total = reducedDay + reducedMonth + reducedYear;
  return reduceToCoreNumber(total, true);
}

/**
 * Calcula el Año Personal actual
 */
export function calculatePersonalYear(dateStr, currentYear = new Date().getFullYear()) {
  if (!dateStr) return null;
  const [, month, day] = dateStr.split('-').map(Number);
  if (!month || !day) return null;

  const reducedDay = reduceToCoreNumber(day, false);
  const reducedMonth = reduceToCoreNumber(month, false);
  const reducedCurrentYear = reduceToCoreNumber(currentYear, false);

  return reduceToCoreNumber(reducedDay + reducedMonth + reducedCurrentYear, false);
}

/**
 * Calcula el Número del Alma (vocales)
 */
export function calculateSoulNumber(fullName) {
  if (!fullName) return null;
  const clean = fullName.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  let sum = 0;

  for (const char of clean) {
    if (VOWELS.includes(char) && PYTHAGOREAN_MAP[char]) {
      sum += PYTHAGOREAN_MAP[char];
    }
  }

  return sum > 0 ? reduceToCoreNumber(sum, true) : null;
}

/**
 * Calcula el Número de Expresión (todas las letras)
 */
export function calculateExpressionNumber(fullName) {
  if (!fullName) return null;
  const clean = fullName.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  let sum = 0;

  for (const char of clean) {
    if (PYTHAGOREAN_MAP[char]) {
      sum += PYTHAGOREAN_MAP[char];
    }
  }

  return sum > 0 ? reduceToCoreNumber(sum, true) : null;
}

/**
 * Genera la lectura completa con el arquetipo de NÜMA
 */
export function getFullNumerologyReading(dateStr, fullName = '') {
  const lifePathNumber = calculateLifePath(dateStr);
  if (!lifePathNumber) return null;

  const personalYear = calculatePersonalYear(dateStr);
  const soulNumber = fullName ? calculateSoulNumber(fullName) : null;
  const expressionNumber = fullName ? calculateExpressionNumber(fullName) : null;

  const archetype = LIFE_PATH_ARCHETYPES[lifePathNumber] || LIFE_PATH_ARCHETYPES[reduceToCoreNumber(lifePathNumber, false)];

  return {
    lifePathNumber,
    personalYear,
    soulNumber,
    expressionNumber,
    archetype
  };
}
