'use client';

import { Film, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MovieFilters } from '@/components/filters';
import { StatsOverview } from '@/components/dashboard/stats-overview';
import { ChartsPlaceholder } from '@/components/charts/charts-placeholder';
import { useDashboardData } from '@/lib/hooks/use-dashboard-data';

/**
 * Página principal del dashboard de películas
 */
export default function DashboardPage() {
  const {
    // Datos
    genres,
    movies,
    dashboardData,
    stats,

    // Estados
    filters,
    isLoading,
    isLoadingGenres,
    isLoadingMovies,
    hasError,
    errorMessage,

    // Acciones
    updateFilters,
    resetFilters,
    applyPopularFilters,
    refetchMovies,
  } = useDashboardData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header del Dashboard */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Logo y título */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg cinema-gradient">
                <Film className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold cinema-text-gradient">
                  CineDash
                </h1>
                <p className="text-sm text-muted-foreground">
                  Dashboard Premium de Películas
                </p>
              </div>
            </div>

            {/* Acciones del header */}
            <div className="flex items-center gap-3">
              {/* Indicador de estado */}
              {isLoading ? (
                <Badge variant="outline" className="animate-pulse">
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Cargando...
                </Badge>
              ) : hasError ? (
                <Badge variant="destructive">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Error
                </Badge>
              ) : (
                <Badge variant="default" className="cinema-glow">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Activo
                </Badge>
              )}

              {/* Botones de acción */}
              <Button
                variant="outline"
                size="sm"
                onClick={applyPopularFilters}
                disabled={isLoading}
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Filtros Populares
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Mensaje de error */}
        {hasError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Error al cargar datos: {errorMessage}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchMovies()}
                className="ml-2"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Mensaje de bienvenida para primeros usuarios */}
        {!isLoading && !hasError && movies.length === 0 && (
          <Alert>
            <Film className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">¡Bienvenido a CineDash! 🎬</p>
                <p>
                  Usa los filtros de abajo para comenzar a explorar películas. 
                  Puedes seleccionar géneros, rangos de fechas y criterios de ordenamiento.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={applyPopularFilters}
                  className="mt-2"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Comenzar con Filtros Populares
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Panel de filtros */}
        <MovieFilters
          genres={genres}
          initialFilters={filters}
          onFiltersChange={updateFilters}
          isLoadingGenres={isLoadingGenres}
          isApplying={isLoadingMovies}
        />

        {/* Estadísticas generales */}
        <StatsOverview
          stats={stats}
          isLoading={isLoading}
          title="Resumen del Dashboard"
        />

        {/* Visualizaciones (placeholders por ahora) */}
        <ChartsPlaceholder
          dashboardData={dashboardData}
          isLoading={isLoading}
        />

        {/* Debug info (solo en desarrollo) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="bg-muted/30 p-4 rounded-lg text-xs">
            <summary className="cursor-pointer font-medium mb-2">
              🔧 Debug Info (Solo Desarrollo)
            </summary>
            <div className="space-y-2 text-muted-foreground">
              <div>Géneros cargados: {genres.length}</div>
              <div>Películas cargadas: {movies.length}</div>
              <div>Filtros activos: {JSON.stringify(filters, null, 2)}</div>
              {dashboardData && (
                <div>
                  Datos transformados: 
                  {dashboardData.monthly_data.length} meses, 
                  {dashboardData.top_movies.length} top películas, 
                  {dashboardData.genre_distribution.length} géneros
                </div>
              )}
            </div>
          </details>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Film className="h-4 w-4" />
              <span>CineDash - Powered by TMDB API</span>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">
                Next.js 15
              </Badge>
              <Badge variant="outline" className="text-xs">
                TypeScript
              </Badge>
              <Badge variant="outline" className="text-xs">
                TailwindCSS v4
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
