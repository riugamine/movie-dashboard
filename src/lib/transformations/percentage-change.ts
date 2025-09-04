/**
 * TRANSFORMACIÓN 2: CÁLCULO DE CAMBIO PORCENTUAL
 * 
 * Esta función calcula el cambio porcentual entre períodos consecutivos
 * para métricas como popularidad y votación promedio.
 */

import type { MonthlyData } from '../types';

/**
 * Calcula el cambio porcentual entre períodos consecutivos
 * 
 * @param monthlyData - Datos mensuales ordenados cronológicamente
 * @returns Datos con cambios porcentuales calculados
 * 
 * @example
 * ```typescript
 * const dataWithChanges = calculatePercentageChange(monthlyData);
 * console.log(dataWithChanges[1]); 
 * // { ..., popularity_change_percent: 15.2, vote_change_percent: -2.1 }
 * ```
 */
export function calculatePercentageChange(monthlyData: MonthlyData[]): MonthlyData[] {
  // Validar que tenemos datos suficientes
  if (monthlyData.length < 2) {
    return monthlyData;
  }

  // Crear copia para no mutar el array original
  const dataWithChanges = [...monthlyData];

  // Calcular cambios porcentuales para cada período
  for (let i = 1; i < dataWithChanges.length; i++) {
    const current = dataWithChanges[i];
    const previous = dataWithChanges[i - 1];

    // Calcular cambio porcentual de popularidad
    current.popularity_change_percent = calculatePercentChange(
      previous.avg_popularity,
      current.avg_popularity
    );

    // Calcular cambio porcentual de votación
    current.vote_change_percent = calculatePercentChange(
      previous.avg_vote_average,
      current.avg_vote_average
    );
  }

  return dataWithChanges;
}

/**
 * Función helper para calcular el cambio porcentual entre dos valores
 * 
 * @param previousValue - Valor anterior
 * @param currentValue - Valor actual
 * @returns Cambio porcentual redondeado a 2 decimales
 * 
 * @example
 * ```typescript
 * const change = calculatePercentChange(80, 92); // 15.00
 * const decrease = calculatePercentChange(100, 85); // -15.00
 * ```
 */
export function calculatePercentChange(previousValue: number, currentValue: number): number {
  // Evitar división por cero
  if (previousValue === 0) {
    return currentValue === 0 ? 0 : 100;
  }

  // Calcular cambio porcentual: ((nuevo - anterior) / anterior) * 100
  const percentChange = ((currentValue - previousValue) / previousValue) * 100;
  
  // Redondear a 2 decimales
  return Math.round(percentChange * 100) / 100;
}

/**
 * Obtiene el cambio promedio de popularidad en un período
 * 
 * @param monthlyData - Datos mensuales con cambios calculados
 * @returns Cambio promedio de popularidad
 */
export function getAveragePopularityChange(monthlyData: MonthlyData[]): number {
  const validChanges = monthlyData
    .filter(data => data.popularity_change_percent !== undefined)
    .map(data => data.popularity_change_percent!);

  if (validChanges.length === 0) return 0;

  const sum = validChanges.reduce((total, change) => total + change, 0);
  return Math.round((sum / validChanges.length) * 100) / 100;
}

/**
 * Obtiene el cambio promedio de votación en un período
 * 
 * @param monthlyData - Datos mensuales con cambios calculados
 * @returns Cambio promedio de votación
 */
export function getAverageVoteChange(monthlyData: MonthlyData[]): number {
  const validChanges = monthlyData
    .filter(data => data.vote_change_percent !== undefined)
    .map(data => data.vote_change_percent!);

  if (validChanges.length === 0) return 0;

  const sum = validChanges.reduce((total, change) => total + change, 0);
  return Math.round((sum / validChanges.length) * 100) / 100;
}

/**
 * Identifica los períodos con mayor crecimiento
 * 
 * @param monthlyData - Datos mensuales con cambios calculados
 * @param metric - Métrica a analizar ('popularity' | 'vote')
 * @param topN - Número de períodos a retornar (default: 3)
 * @returns Períodos con mayor crecimiento
 */
export function getTopGrowthPeriods(
  monthlyData: MonthlyData[], 
  metric: 'popularity' | 'vote' = 'popularity',
  topN: number = 3
): MonthlyData[] {
  const changeField = metric === 'popularity' ? 'popularity_change_percent' : 'vote_change_percent';
  
  return monthlyData
    .filter(data => data[changeField] !== undefined)
    .sort((a, b) => (b[changeField] || 0) - (a[changeField] || 0))
    .slice(0, topN);
}
