/**
 * Gráfico de Votación Mensual - Línea
 * 
 * Patrón de diseño: Simple Line Chart
 * - Muestra evolución de calificaciones promedio
 * - Incluye promedio móvil y cambios porcentuales
 * - Diseño limpio y fácil de leer
 */

'use client';

import { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MonthlyData } from '@/lib/types';

interface MonthlyVotesChartProps {
  /** Datos mensuales transformados */
  data: MonthlyData[];
  /** Si está cargando */
  isLoading?: boolean;
  /** Altura del gráfico */
  height?: number;
}

/**
 * Componente de gráfico de votación mensual
 */
export function MonthlyVotesChart({ 
  data, 
  isLoading = false, 
  height = 300 
}: MonthlyVotesChartProps) {
  // Transformar datos para Recharts
  const chartData = useMemo(() => {
    return data.map(item => ({
      month: new Date(item.month + '-01').toLocaleDateString('es-ES', { 
        month: 'short', 
        year: '2-digit' 
      }),
      calificacion: Number(item.avg_vote_average.toFixed(1)),
      promedio_movil: item.vote_moving_avg ? Number(item.vote_moving_avg.toFixed(1)) : undefined,
      votos_total: item.total_vote_count,
      cambio: item.vote_change_percent,
      peliculas: item.movies_count,
      fecha_completa: item.month,
    }));
  }, [data]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    if (data.length === 0) return null;
    
    const votes = data.map(d => d.avg_vote_average);
    const max = Math.max(...votes);
    const min = Math.min(...votes);
    const avg = votes.reduce((sum, val) => sum + val, 0) / votes.length;
    
    return {
      max: Number(max.toFixed(1)),
      min: Number(min.toFixed(1)),
      avg: Number(avg.toFixed(1)),
      trend: data.length > 1 ? (votes[votes.length - 1] > votes[0] ? 'up' : 'down') : 'stable'
    };
  }, [data]);

  if (isLoading) {
    return (
      <Card className="cinema-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faStar} className="h-5 w-5 text-secondary animate-pulse" />
            <CardTitle className="text-lg font-semibold">Calificación Mensual</CardTitle>
            <Badge variant="outline" className="animate-pulse">Cargando...</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-80 bg-muted/20 rounded-lg animate-pulse">
            <FontAwesomeIcon icon={faStar} className="h-12 w-12 text-muted-foreground/50" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="cinema-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faStar} className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg font-semibold">Calificación Mensual</CardTitle>
            <Badge variant="outline">Sin datos</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-80 text-muted-foreground">
            <div className="text-center space-y-2">
              <FontAwesomeIcon icon={faStar} className="h-12 w-12 mx-auto opacity-50" />
              <p>No hay datos de calificación disponibles</p>
              <p className="text-sm">Ajusta los filtros para ver la evolución de votaciones</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="cinema-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faStar} className="h-5 w-5 text-secondary" />
            <CardTitle className="text-lg font-semibold">Calificación Mensual</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {chartData.length} períodos
            </Badge>
          </div>
          
          {/* Estadísticas rápidas */}
          {stats && (
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="outline">
                Máx: {stats.max}/10
              </Badge>
              <Badge variant="outline">
                Prom: {stats.avg}/10
              </Badge>
              <Badge 
                variant={stats.trend === 'up' ? 'default' : 'secondary'}
                className={stats.trend === 'up' ? 'cinema-glow' : ''}
              >
                {stats.trend === 'up' ? '⭐ Mejorando' : '📉 Declinando'}
              </Badge>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Evolución de la calificación promedio por mes (escala 1-10)
        </p>
      </CardHeader>

      <CardContent>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={0.3}
              />
              
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              
              <YAxis 
                domain={[0, 10]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={(value) => `${value}`}
              />
              
              {/* Línea de referencia para calificación media (5.0) */}
              <ReferenceLine 
                y={5} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="2 2" 
                opacity={0.5}
              />
              
              {/* Línea de referencia para buena calificación (7.0) */}
              <ReferenceLine 
                y={7} 
                stroke="hsl(var(--secondary))" 
                strokeDasharray="2 2" 
                opacity={0.3}
              />
              
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '2px solid hsl(var(--secondary))',
                  borderRadius: '12px',
                  boxShadow: '0 8px 25px -5px rgb(0 0 0 / 0.3)',
                  padding: '12px',
                }}
                labelStyle={{ 
                  color: 'hsl(var(--secondary))', 
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
                formatter={(value: any, name: string) => {
                  if (name === 'calificacion') return [`${value}/10 ⭐`, 'Calificación'];
                  if (name === 'promedio_movil') return [`${value}/10`, 'Tendencia'];
                  return [value, name];
                }}
                labelFormatter={(label) => `Período: ${label}`}
              />
              
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              
              {/* Línea principal de calificación - conectada */}
              <Line
                type="monotone"
                dataKey="calificacion"
                stroke="hsl(var(--secondary))"
                strokeWidth={3}
                dot={{ 
                  fill: 'hsl(var(--secondary))', 
                  strokeWidth: 2, 
                  r: 5,
                  stroke: 'hsl(var(--background))'
                }}
                activeDot={{ 
                  r: 8, 
                  stroke: 'hsl(var(--secondary))', 
                  strokeWidth: 3,
                  fill: 'hsl(var(--background))'
                }}
                connectNulls={true}
                name="Calificación"
              />
              
              {/* Línea de promedio móvil */}
              <Line
                type="monotone"
                dataKey="promedio_movil"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                strokeDasharray="8 4"
                dot={{ 
                  fill: 'hsl(var(--primary))', 
                  strokeWidth: 1, 
                  r: 3,
                  stroke: 'hsl(var(--background))'
                }}
                connectNulls={true}
                name="Tendencia"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Información adicional */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>⭐ Calificación promedio: {stats?.avg}/10</span>
              <span>📊 {chartData.reduce((sum, d) => sum + d.votos_total, 0).toLocaleString()} votos total</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 bg-secondary rounded-full" />
                <span>Calificación</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-1 w-4 bg-primary rounded" />
                <span>Tendencia</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
