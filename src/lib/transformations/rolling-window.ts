/**
 * TRANSFORMACIÓN 3: ANÁLISIS DE VENTANA MÓVIL (PROMEDIO DE 3 PERÍODOS)
 * 
 * Esta función calcula promedios móviles para suavizar las tendencias
 * y reducir el ruido en los datos temporales.
 */

import type { MonthlyData } from '../types';

/**
 * Calcula promedios móviles de 3 períodos para popularidad y votación
 * 
 * @param monthlyData - Datos mensuales ordenados cronológicamente
 * @param windowSize - Tamaño de la ventana móvil (default: 3)
 * @returns Datos con promedios móviles calculados
 * 
 * @example
 * ```typescript
 * const smoothedData = calculateRollingAverage(monthlyData, 3);
 * console.log(smoothedData[2]); 
 * // { ..., popularity_moving_avg: 85.67, vote_moving_avg: 7.23 }
 * ```
 */
export function calculateRollingAverage(
  monthlyData: MonthlyData[], 
  windowSize: number = 3
): MonthlyData[] {
  // Validar parámetros
  if (windowSize < 1 || monthlyData.length < windowSize) {
    return monthlyData;
  }

  // Crear copia para no mutar el array original
  const dataWithMovingAvg = [...monthlyData];

  // Calcular promedio móvil para cada posición válida
  for (let i = windowSize - 1; i < dataWithMovingAvg.length; i++) {
    // Obtener ventana de datos (windowSize elementos anteriores incluido el actual)
    const window = dataWithMovingAvg.slice(i - windowSize + 1, i + 1);

    // Calcular promedio móvil de popularidad
    const popularitySum = window.reduce((sum, data) => sum + data.avg_popularity, 0);
    dataWithMovingAvg[i].popularity_moving_avg = 
      Math.round((popularitySum / windowSize) * 100) / 100;

    // Calcular promedio móvil de votación
    const voteSum = window.reduce((sum, data) => sum + data.avg_vote_average, 0);
    dataWithMovingAvg[i].vote_moving_avg = 
      Math.round((voteSum / windowSize) * 100) / 100;
  }

  return dataWithMovingAvg;
}

/**
 * Calcula promedio móvil exponencial (EMA) para mayor sensibilidad a datos recientes
 * 
 * @param monthlyData - Datos mensuales ordenados cronológicamente
 * @param alpha - Factor de suavizado (0 < alpha <= 1, default: 0.3)
 * @returns Datos con EMA calculado
 * 
 * @example
 * ```typescript
 * const emaData = calculateExponentialMovingAverage(monthlyData, 0.3);
 * ```
 */
export function calculateExponentialMovingAverage(
  monthlyData: MonthlyData[], 
  alpha: number = 0.3
): MonthlyData[] {
  // Validar parámetros
  if (alpha <= 0 || alpha > 1 || monthlyData.length === 0) {
    return monthlyData;
  }

  const dataWithEMA = [...monthlyData];

  // Inicializar EMA con el primer valor
  if (dataWithEMA.length > 0) {
    dataWithEMA[0].popularity_moving_avg = dataWithEMA[0].avg_popularity;
    dataWithEMA[0].vote_moving_avg = dataWithEMA[0].avg_vote_average;
  }

  // Calcular EMA para el resto de valores
  for (let i = 1; i < dataWithEMA.length; i++) {
    const current = dataWithEMA[i];
    const previous = dataWithEMA[i - 1];

    // EMA = alpha * valor_actual + (1 - alpha) * EMA_anterior
    current.popularity_moving_avg = Math.round((
      alpha * current.avg_popularity + 
      (1 - alpha) * (previous.popularity_moving_avg || previous.avg_popularity)
    ) * 100) / 100;

    current.vote_moving_avg = Math.round((
      alpha * current.avg_vote_average + 
      (1 - alpha) * (previous.vote_moving_avg || previous.avg_vote_average)
    ) * 100) / 100;
  }

  return dataWithEMA;
}

/**
 * Identifica tendencias basadas en el promedio móvil
 * 
 * @param monthlyData - Datos con promedio móvil calculado
 * @param minPeriods - Mínimo de períodos para identificar tendencia (default: 3)
 * @returns Análisis de tendencias
 */
export function identifyTrends(
  monthlyData: MonthlyData[], 
  minPeriods: number = 3
): {
  popularityTrend: 'ascending' | 'descending' | 'stable';
  voteTrend: 'ascending' | 'descending' | 'stable';
  trendStrength: number;
} {
  // Filtrar datos con promedio móvil válido
  const validData = monthlyData.filter(data => 
    data.popularity_moving_avg !== undefined && 
    data.vote_moving_avg !== undefined
  );

  if (validData.length < minPeriods) {
    return {
      popularityTrend: 'stable',
      voteTrend: 'stable',
      trendStrength: 0
    };
  }

  // Analizar tendencia de popularidad
  const popularityTrend = analyzeTrendDirection(
    validData.map(d => d.popularity_moving_avg!)
  );

  // Analizar tendencia de votación
  const voteTrend = analyzeTrendDirection(
    validData.map(d => d.vote_moving_avg!)
  );

  // Calcular fuerza de la tendencia (correlación con el tiempo)
  const trendStrength = calculateTrendStrength(validData);

  return {
    popularityTrend,
    voteTrend,
    trendStrength: Math.round(trendStrength * 100) / 100
  };
}

/**
 * Función helper para analizar la dirección de una tendencia
 */
function analyzeTrendDirection(values: number[]): 'ascending' | 'descending' | 'stable' {
  if (values.length < 2) return 'stable';

  const first = values[0];
  const last = values[values.length - 1];
  const percentChange = Math.abs((last - first) / first * 100);

  // Si el cambio es menor al 5%, consideramos estable
  if (percentChange < 5) return 'stable';

  return last > first ? 'ascending' : 'descending';
}

/**
 * Función helper para calcular la fuerza de la tendencia
 */
function calculateTrendStrength(data: MonthlyData[]): number {
  if (data.length < 3) return 0;

  // Calcular correlación simple entre tiempo y valores
  const n = data.length;
  const timePoints = Array.from({ length: n }, (_, i) => i);
  const popularityValues = data.map(d => d.popularity_moving_avg!);

  // Correlación de Pearson simplificada
  const sumTime = timePoints.reduce((a, b) => a + b, 0);
  const sumPop = popularityValues.reduce((a, b) => a + b, 0);
  const meanTime = sumTime / n;
  const meanPop = sumPop / n;

  let numerator = 0;
  let denomTime = 0;
  let denomPop = 0;

  for (let i = 0; i < n; i++) {
    const timeDeviation = timePoints[i] - meanTime;
    const popDeviation = popularityValues[i] - meanPop;
    
    numerator += timeDeviation * popDeviation;
    denomTime += timeDeviation * timeDeviation;
    denomPop += popDeviation * popDeviation;
  }

  const denominator = Math.sqrt(denomTime * denomPop);
  return denominator === 0 ? 0 : Math.abs(numerator / denominator);
}
