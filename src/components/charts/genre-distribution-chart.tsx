/**
 * Gráfico de Distribución de Géneros - Dona
 * 
 * Patrón de diseño: Simple Donut Chart
 * - Muestra porcentaje de películas por género
 * - Diseño de dona con información central
 * - Colores cinematográficos para cada segmento
 */

'use client';

import { useMemo } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { GenreDistribution } from '@/lib/types';

interface GenreDistributionChartProps {
  /** Distribución de géneros */
  data: GenreDistribution[];
  /** Si está cargando */
  isLoading?: boolean;
  /** Altura del gráfico */
  height?: number;
  /** Número máximo de géneros a mostrar */
  maxGenres?: number;
}

/**
 * Paleta de colores cinematográfica para géneros
 */
const GENRE_COLORS = [
  'hsl(var(--accent))',      // Rojo carmesí
  'hsl(var(--secondary))',   // Dorado
  'hsl(var(--primary))',     // Púrpura
  '#FF6B6B',                 // Coral
  '#4ECDC4',                 // Turquesa
  '#45B7D1',                 // Azul cielo
  '#96CEB4',                 // Verde menta
  '#FFEAA7',                 // Amarillo suave
  '#DDA0DD',                 // Ciruela
  '#F0A500',                 // Naranja
  '#FF7675',                 // Rosa salmón
  '#74B9FF',                 // Azul claro
];

/**
 * Componente de gráfico de distribución de géneros
 */
export function GenreDistributionChart({ 
  data, 
  isLoading = false, 
  height = 350,
  maxGenres = 8
}: GenreDistributionChartProps) {
  // Transformar datos para Recharts
  const chartData = useMemo(() => {
    // Tomar los top géneros y agrupar el resto en "Otros"
    const topGenres = data.slice(0, maxGenres);
    const otherGenres = data.slice(maxGenres);
    
    let processedData = topGenres.map((genre, index) => ({
      name: genre.genre_name,
      value: genre.count,
      percentage: genre.percentage,
      color: GENRE_COLORS[index % GENRE_COLORS.length],
      popularidad: Math.round(genre.avg_popularity),
      calificacion: Number(genre.avg_vote_average.toFixed(1)),
    }));
    
    // Agregar "Otros" si hay más géneros
    if (otherGenres.length > 0) {
      const otherCount = otherGenres.reduce((sum, genre) => sum + genre.count, 0);
      const otherPercentage = otherGenres.reduce((sum, genre) => sum + genre.percentage, 0);
      const otherAvgPop = Math.round(
        otherGenres.reduce((sum, genre) => sum + genre.avg_popularity, 0) / otherGenres.length
      );
      const otherAvgRating = Number(
        (otherGenres.reduce((sum, genre) => sum + genre.avg_vote_average, 0) / otherGenres.length).toFixed(1)
      );
      
      processedData.push({
        name: `Otros (${otherGenres.length})`,
        value: otherCount,
        percentage: Number(otherPercentage.toFixed(1)),
        color: '#95A5A6',
        popularidad: otherAvgPop,
        calificacion: otherAvgRating,
      });
    }
    
    return processedData;
  }, [data, maxGenres]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    if (data.length === 0) return null;
    
    const totalMovies = data.reduce((sum, genre) => sum + genre.count, 0);
    const topGenre = data[0];
    
    return {
      totalGenres: data.length,
      totalMovies,
      topGenre: topGenre ? {
        name: topGenre.genre_name,
        percentage: topGenre.percentage,
        count: topGenre.count
      } : null,
    };
  }, [data]);

  if (isLoading) {
    return (
      <Card className="cinema-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faChartPie} className="h-5 w-5 text-primary animate-pulse" />
            <CardTitle className="text-lg font-semibold">Distribución por Género</CardTitle>
            <Badge variant="outline" className="animate-pulse">Cargando...</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-80 bg-muted/20 rounded-lg animate-pulse">
            <FontAwesomeIcon icon={faChartPie} className="h-12 w-12 text-muted-foreground/50" />
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
            <FontAwesomeIcon icon={faChartPie} className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg font-semibold">Distribución por Género</CardTitle>
            <Badge variant="outline">Sin datos</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-80 text-muted-foreground">
            <div className="text-center space-y-2">
              <FontAwesomeIcon icon={faUsers} className="h-12 w-12 mx-auto opacity-50" />
              <p>No hay distribución de géneros disponible</p>
              <p className="text-sm">Selecciona algunos géneros para ver la distribución</p>
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
            <FontAwesomeIcon icon={faChartPie} className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">Distribución por Género</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {data.length} géneros
            </Badge>
          </div>
          
          {/* Estadísticas rápidas */}
          {stats?.topGenre && (
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="outline">
                👑 {stats.topGenre.name}
              </Badge>
              <Badge variant="outline">
                {stats.topGenre.percentage}%
              </Badge>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Porcentaje de películas por género en la selección actual
        </p>
      </CardHeader>

      <CardContent>
        <div className="relative">
          <div style={{ width: '100%', height }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '2px solid hsl(var(--primary))',
                    borderRadius: '12px',
                    boxShadow: '0 8px 25px -5px rgb(0 0 0 / 0.3)',
                    padding: '16px',
                  }}
                  formatter={(value: any, name: string, props: any) => {
                    const data = props.payload;
                    return [
                      <div key="tooltip" className="space-y-2" style={{ color: '#1f2937' }}>
                        <div className="font-bold text-lg" style={{ color: 'hsl(var(--primary))' }}>
                          {data.name}
                        </div>
                        <div className="text-sm space-y-1" style={{ color: '#374151' }}>
                          <div className="flex items-center gap-2">
                            <span>🎬</span>
                            <span className="font-medium">Películas: {value}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>📊</span>
                            <span className="font-medium">Porcentaje: {data.percentage}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>🔥</span>
                            <span className="font-medium">Popularidad: {data.popularidad}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>⭐</span>
                            <span className="font-medium">Calificación: {data.calificacion}/10</span>
                          </div>
                        </div>
                      </div>,
                      ''
                    ];
                  }}
                  labelFormatter={() => ''}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Información central */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {stats?.totalMovies}
              </div>
              <div className="text-xs text-muted-foreground">
                películas
              </div>
            </div>
          </div>
        </div>

        {/* Leyenda personalizada */}
        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {chartData.slice(0, 6).map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div 
                  className="h-3 w-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate">
                  {item.name} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
          
          {chartData.length > 6 && (
            <div className="text-center">
              <Badge variant="outline" className="text-xs">
                +{chartData.length - 6} géneros más
              </Badge>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>🎭 {stats?.totalGenres} géneros únicos</span>
              <span>🎬 {stats?.totalMovies} películas total</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-primary rounded-full" />
              <span>Datos actualizados</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
