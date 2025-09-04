/**
 * Componente de Estado Vacío
 * 
 * Proporciona una interfaz elegante para mostrar cuando no hay datos
 */

'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFilm,
  faSearch,
  faFilter,
  faCalendarDays,
  faStar,
  faChartColumn,
  faFolderOpen,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EmptyStateProps {
  /** Título del estado vacío */
  title?: string;
  /** Descripción del estado vacío */
  description?: string;
  /** Tipo de contenido vacío para iconografía */
  type?: 'movies' | 'search' | 'filters' | 'charts' | 'data' | 'generic';
  /** Función de acción principal */
  onAction?: () => void;
  /** Texto del botón de acción */
  actionText?: string;
  /** Función de acción secundaria */
  onSecondaryAction?: () => void;
  /** Texto del botón secundario */
  secondaryActionText?: string;
  /** Sugerencias para el usuario */
  suggestions?: string[];
  /** Tamaño del componente */
  size?: 'sm' | 'md' | 'lg';
  /** Si mostrar ilustración animada */
  animated?: boolean;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Obtiene el icono apropiado según el tipo
 */
function getEmptyIcon(type: EmptyStateProps['type']) {
  switch (type) {
    case 'movies':
      return faFilm;
    case 'search':
      return faSearch;
    case 'filters':
      return faFilter;
    case 'charts':
      return faChartColumn;
    case 'data':
      return faFolderOpen;
    default:
      return faExclamationCircle;
  }
}

/**
 * Obtiene el contenido por defecto según el tipo
 */
function getDefaultContent(type: EmptyStateProps['type']) {
  switch (type) {
    case 'movies':
      return {
        title: 'No se encontraron películas',
        description: 'No hay películas que coincidan con los criterios de búsqueda actuales.',
        suggestions: [
          'Ajusta los filtros de fecha',
          'Selecciona diferentes géneros',
          'Reduce el mínimo de votos',
          'Prueba con criterios más amplios'
        ]
      };
    case 'search':
      return {
        title: 'Búsqueda sin resultados',
        description: 'Tu búsqueda no arrojó ningún resultado.',
        suggestions: [
          'Verifica la ortografía',
          'Usa términos más generales',
          'Prueba con sinónimos',
          'Reduce los filtros aplicados'
        ]
      };
    case 'filters':
      return {
        title: 'Filtros muy restrictivos',
        description: 'Los filtros actuales no coinciden con ninguna película.',
        suggestions: [
          'Amplía el rango de fechas',
          'Selecciona más géneros',
          'Reduce criterios de calificación',
          'Resetea todos los filtros'
        ]
      };
    case 'charts':
      return {
        title: 'Sin datos para visualizar',
        description: 'No hay suficientes datos para generar gráficos.',
        suggestions: [
          'Selecciona un período más amplio',
          'Ajusta los filtros',
          'Verifica la conexión',
          'Recarga la página'
        ]
      };
    case 'data':
      return {
        title: 'No hay datos disponibles',
        description: 'Actualmente no hay información para mostrar.',
        suggestions: [
          'Verifica tu conexión',
          'Recarga la página',
          'Intenta más tarde',
          'Contacta soporte si persiste'
        ]
      };
    default:
      return {
        title: 'Sin contenido',
        description: 'No hay información disponible en este momento.',
        suggestions: ['Recarga la página', 'Intenta más tarde']
      };
  }
}

/**
 * Componente principal de estado vacío
 */
export function EmptyState({
  title,
  description,
  type = 'generic',
  onAction,
  actionText,
  onSecondaryAction,
  secondaryActionText,
  suggestions,
  size = 'md',
  animated = true,
  className = '',
}: EmptyStateProps) {
  const defaultContent = getDefaultContent(type);
  const icon = getEmptyIcon(type);
  
  const finalTitle = title || defaultContent.title;
  const finalDescription = description || defaultContent.description;
  const finalSuggestions = suggestions || defaultContent.suggestions;

  const sizeClasses = {
    sm: 'p-4 text-sm',
    md: 'p-6 text-base',
    lg: 'p-8 text-lg',
  };

  const iconSizes = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-20 w-20',
  };

  return (
    <Card className={`cinema-card border-muted/20 ${className}`}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className={`p-4 rounded-full bg-muted/20 ${animated ? 'animate-pulse' : ''}`}>
            <FontAwesomeIcon 
              icon={icon} 
              className={`${iconSizes[size]} text-muted-foreground/60`}
            />
          </div>
        </div>
        
        <CardTitle className="text-muted-foreground">
          {finalTitle}
        </CardTitle>
        
        <div className="flex justify-center">
          <Badge variant="outline" className="text-xs text-muted-foreground">
            {type === 'movies' && '🎬 Películas'}
            {type === 'search' && '🔍 Búsqueda'}
            {type === 'filters' && '🔧 Filtros'}
            {type === 'charts' && '📊 Gráficos'}
            {type === 'data' && '📂 Datos'}
            {type === 'generic' && '📋 Contenido'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className={`space-y-6 text-center ${sizeClasses[size]}`}>
        {/* Descripción */}
        <p className="text-muted-foreground max-w-md mx-auto">
          {finalDescription}
        </p>

        {/* Sugerencias */}
        {finalSuggestions.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              💡 Sugerencias:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground max-w-md mx-auto">
              {finalSuggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-left">
                  <span className="text-primary mt-1">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Botones de acción */}
        {(onAction || onSecondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            {onAction && (
              <Button 
                onClick={onAction}
                variant="default"
                className="cinema-button"
              >
                <FontAwesomeIcon 
                  icon={type === 'filters' ? faFilter : faSearch} 
                  className="h-4 w-4 mr-2" 
                />
                {actionText || 'Ajustar Filtros'}
              </Button>
            )}
            
            {onSecondaryAction && (
              <Button 
                onClick={onSecondaryAction}
                variant="outline"
                className="border-primary/20 hover:bg-primary/5"
              >
                {secondaryActionText || 'Resetear Todo'}
              </Button>
            )}
          </div>
        )}

        {/* Información adicional */}
        <div className="text-xs text-muted-foreground pt-4 border-t border-border/50">
          <p>¿Necesitas ayuda? Consulta la documentación o contacta soporte.</p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Componente ligero de estado vacío para espacios pequeños
 */
export function EmptyStateMini({
  title,
  onAction,
  actionText = 'Ajustar',
  type = 'generic',
  className = '',
}: Pick<EmptyStateProps, 'title' | 'onAction' | 'actionText' | 'type' | 'className'>) {
  const defaultContent = getDefaultContent(type);
  const icon = getEmptyIcon(type);
  const finalTitle = title || defaultContent.title;

  return (
    <div className={`flex items-center gap-3 p-4 bg-muted/5 border border-muted/20 rounded-lg ${className}`}>
      <FontAwesomeIcon icon={icon} className="h-5 w-5 text-muted-foreground/60 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground truncate">
          {finalTitle}
        </p>
      </div>
      {onAction && (
        <Button
          onClick={onAction}
          variant="outline"
          size="sm"
          className="flex-shrink-0"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
}
