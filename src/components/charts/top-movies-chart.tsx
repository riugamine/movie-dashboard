/**
 * Gráfico de Top Películas - Barras Horizontales
 * 
 * Patrón de diseño: Simple Bar Chart
 * - Muestra las 10 películas más populares
 * - Barras horizontales para mejor legibilidad de títulos
 * - Información adicional en tooltips
 */

'use client';

import { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Award, Film } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TopMovie } from '@/lib/types';

interface TopMoviesChartProps {
  /** Top películas */
  data: TopMovie[];
  /** Si está cargando */
  isLoading?: boolean;
  /** Altura del gráfico */
  height?: number;
  /** Número máximo de películas a mostrar */
  maxMovies?: number;
}

/**
 * Colores para las barras (paleta cinematográfica)
 */
const BAR_COLORS = [
  'hsl(var(--accent))',     // Rojo carmesí para #1
  'hsl(var(--secondary))',  // Dorado para #2
  'hsl(var(--primary))',    // Púrpura para #3
  'hsl(var(--accent))',     // Repetir patrón
  'hsl(var(--secondary))',
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--secondary))',
  'hsl(var(--primary))',
  'hsl(var(--accent))',
];

/**
 * Componente de gráfico de top películas
 */
export function TopMoviesChart({ 
  data, 
  isLoading = false, 
  height = 400,
  maxMovies = 10
}: TopMoviesChartProps) {
  // Transformar y limitar datos para Recharts
  const chartData = useMemo(() => {
    return data
      .slice(0, maxMovies)
      .map((movie, index) => ({
        titulo: movie.title.length > 25 ? movie.title.substring(0, 25) + '...' : movie.title,
        titulo_completo: movie.title,
        popularidad: Math.round(movie.popularity),
        calificacion: movie.vote_average,
        generos: movie.genre_names.join(', '),
        fecha: movie.release_date,
        posicion: index + 1,
      }))
      .reverse(); // Invertir para mostrar #1 arriba
  }, [data, maxMovies]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    if (data.length === 0) return null;
    
    const popularities = data.map(d => d.popularity);
    const ratings = data.map(d => d.vote_average);
    
    return {
      totalMovies: data.length,
      avgPopularity: Math.round(popularities.reduce((sum, val) => sum + val, 0) / popularities.length),
      avgRating: Number((ratings.reduce((sum, val) => sum + val, 0) / ratings.length).toFixed(1)),
      topMovie: data[0],
    };
  }, [data]);

  if (isLoading) {
    return (
      <Card className="cinema-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-secondary animate-pulse" />
            <CardTitle className="text-lg font-semibold">Top 10 Películas</CardTitle>
            <Badge variant="outline" className="animate-pulse">Cargando...</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96 bg-muted/20 rounded-lg animate-pulse">
            <Award className="h-12 w-12 text-muted-foreground/50" />
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
            <Award className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg font-semibold">Top 10 Películas</CardTitle>
            <Badge variant="outline">Sin datos</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96 text-muted-foreground">
            <div className="text-center space-y-2">
              <Film className="h-12 w-12 mx-auto opacity-50" />
              <p>No hay películas para mostrar</p>
              <p className="text-sm">Ajusta los filtros para ver el ranking</p>
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
            <Award className="h-5 w-5 text-secondary" />
            <CardTitle className="text-lg font-semibold">Top {maxMovies} Películas</CardTitle>
            <Badge variant="secondary" className="text-xs">
              Por popularidad
            </Badge>
          </div>
          
          {/* Estadísticas rápidas */}
          {stats && (
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="outline">
                🏆 {stats.topMovie.title.substring(0, 15)}...
              </Badge>
              <Badge variant="outline">
                ⭐ {stats.avgRating}/10
              </Badge>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Ranking de películas más populares según filtros aplicados
        </p>
      </CardHeader>

      <CardContent>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              layout="horizontal"
              margin={{ top: 10, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={0.3}
              />
              
              <XAxis 
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={(value) => `${value}`}
              />
              
              <YAxis 
                type="category"
                dataKey="titulo"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                width={75}
              />
              
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                labelStyle={{ color: 'hsl(var(--popover-foreground))', fontWeight: 'bold' }}
                formatter={(value: any, name: string, props: any) => {
                  const data = props.payload;
                  return [
                    <div key="tooltip" className="space-y-1">
                      <div className="font-semibold">{data.titulo_completo}</div>
                      <div className="text-sm space-y-0.5">
                        <div>🔥 Popularidad: {value}</div>
                        <div>⭐ Calificación: {data.calificacion}/10</div>
                        <div>🎭 Géneros: {data.generos}</div>
                        <div>📅 Estreno: {new Date(data.fecha).toLocaleDateString('es-ES')}</div>
                        <div className="font-medium text-accent">#{data.posicion} en ranking</div>
                      </div>
                    </div>,
                    ''
                  ];
                }}
                labelFormatter={() => ''}
              />
              
              <Bar 
                dataKey="popularidad" 
                radius={[0, 4, 4, 0]}
                name="Popularidad"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                    opacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Información adicional */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>🏆 Top {chartData.length} de {stats?.totalMovies} películas</span>
              <span>📊 Popularidad promedio: {stats?.avgPopularity}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 bg-accent rounded-full" />
                <span>Más popular</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 bg-secondary rounded-full" />
                <span>Medianamente popular</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 bg-primary rounded-full" />
                <span>Popular</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
