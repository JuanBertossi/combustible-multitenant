import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea una fecha en el formato especificado
 */
export const formatDate = (date, formatStr = 'dd/MM/yyyy HH:mm') => {
  if (!date) return '-';
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, formatStr, { locale: es });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

/**
 * Formatea un monto como moneda argentina
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Formatea un número con separadores de miles
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined) return '-';
  return new Intl.NumberFormat('es-AR').format(number);
};

/**
 * Formatea litros
 */
export const formatLiters = (liters) => {
  if (liters === null || liters === undefined) return '-';
  return `${formatNumber(liters)} L`;
};

/**
 * Formatea kilómetros
 */
export const formatKilometers = (km) => {
  if (km === null || km === undefined) return '-';
  return `${formatNumber(km)} km`;
};

/**
 * Formatea un número de teléfono
 */
export const formatPhone = (phone) => {
  if (!phone) return '-';
  // Formato: +54 9 351 234 5678
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 13) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  return phone;
};

/**
 * Formatea un CUIT
 */
export const formatCUIT = (cuit) => {
  if (!cuit) return '-';
  const cleaned = cuit.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 10)}-${cleaned.slice(10)}`;
  }
  return cuit;
};

/**
 * Trunca un texto largo
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '-';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Calcula el porcentaje
 */
export const formatPercentage = (value, total) => {
  if (!total || total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(1)}%`;
};

/**
 * Formatea consumo por km
 */
export const formatConsumption = (liters, km) => {
  if (!km || km === 0) return '-';
  const consumption = (liters / km) * 100;
  return `${consumption.toFixed(2)} L/100km`;
};
