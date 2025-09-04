/**
 * Gráfico de Popularidad Mensual - Línea/Área
 * 
 * Patrón de diseño: Simple Data Visualization
 * - Muestra evolución temporal de popularidad
 * - Incluye promedio móvil y cambios porcentuales
 * - Diseño responsive y accesible
 */

'use client';

import { useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MonthlyData } from '@/lib/types';

interface MonthlyPopularityChartProps {
  /** Datos mensuales transformados */
  data: MonthlyData[];
  /** Si está cargando */
  isLoading?: boolean;
  /** Altura del gráfico */
  height?: number;
}

/**
 * Componente de gráfico de popularidad mensual
 */
export function MonthlyPopularityChart({ 
  data, 
  isLoading = false, 
  height = 300 
}: MonthlyPopularityChartProps) {
  // Transformar datos para Recharts
  const chartData = useMemo(() => {
    return data.map(item => ({
      month: new Date(item.month + '-01').toLocaleDateString('es-ES', { 
        month: 'short', 
        year: '2-digit' 
      }),
      popularidad: Math.round(item.avg_popularity),
      promedio_movil: item.popularity_moving_avg ? Math.round(item.popularity_moving_avg) : undefined,
      peliculas: item.movies_count,
      cambio: item.popularity_change_percent,
      fecha_completa: item.month,
    }));
  }, [data]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    if (data.length === 0) return null;
    
    const popularities = data.map(d => d.avg_popularity);
    const max = Math.max(...popularities);
    const min = Math.min(...popularities);
    const avg = popularities.reduce((sum, val) => sum + val, 0) / popularities.length;
    
    return {
      max: Math.round(max),
      min: Math.round(min),
      avg: Math.round(avg),
      trend: data.length > 1 ? (popularities[popularities.length - 1] > popularities[0] ? 'up' : 'down') : 'stable'
    };
  }, [data]);

  if (isLoading) {
    return (
      <Card className="cinema-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent animate-pulse" />
            <CardTitle className="text-lg font-semibold">Popularidad Mensual</CardTitle>
            <Badge variant="outline" className="animate-pulse">Cargando...</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-80 bg-muted/20 rounded-lg animate-pulse">
            <TrendingUp className="h-12 w-12 text-muted-foreground/50" />
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
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg font-semibold">Popularidad Mensual</CardTitle>
            <Badge variant="outline">Sin datos</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-80 text-muted-foreground">
            <div className="text-center space-y-2">
              <Calendar className="h-12 w-12 mx-auto opacity-50" />
              <p>No hay datos mensuales disponibles</p>
              <p className="text-sm">Ajusta los filtros para ver la evolución temporal</p>
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
            <TrendingUp className="h-5 w-5 text-accent" />
            <CardTitle className="text-lg font-semibold">Popularidad Mensual</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {chartData.length} períodos
            </Badge>
          </div>
          
          {/* Estadísticas rápidas */}
          {stats && (
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="outline">
                Máx: {stats.max}
              </Badge>
              <Badge variant="outline">
                Prom: {stats.avg}
              </Badge>
              <Badge 
                variant={stats.trend === 'up' ? 'default' : 'secondary'}
                className={stats.trend === 'up' ? 'cinema-glow' : ''}
              >
                {stats.trend === 'up' ? '↗️ Creciente' : '↘️ Decreciente'}
              </Badge>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Evolución de la popularidad promedio por mes con tendencia móvil
        </p>
      </CardHeader>

      <CardContent>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="popularityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              
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
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={(value) => `${value}`}
              />
              
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                formatter={(value: any, name: string) => {
                  if (name === 'popularidad') return [`${value}`, 'Popularidad'];
                  if (name === 'promedio_movil') return [`${value}`, 'Promedio Móvil'];
                  return [value, name];
                }}
                labelFormatter={(label) => `Período: ${label}`}
              />
              
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              
              {/* Área principal de popularidad */}
              <Area
                type="monotone"
                dataKey="popularidad"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                fill="url(#popularityGradient)"
                name="Popularidad"
              />
              
              {/* Línea de promedio móvil */}
              <Area
                type="monotone"
                dataKey="promedio_movil"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="url(#trendGradient)"
                name="Tendencia"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Información adicional */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>📊 {chartData.length} períodos analizados</span>
              <span>🎬 {chartData.reduce((sum, d) => sum + d.peliculas, 0)} películas total</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-accent rounded-full" />
              <span>Datos actualizados</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
