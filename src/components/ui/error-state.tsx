/**
 * Componente de Estado de Error
 * 
 * Proporciona una interfaz elegante para mostrar errores con acciones de recuperación
 */

'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExclamationTriangle, 
  faRefresh, 
  faWifi,
  faServer,
  faDatabase,
  faQuestion
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ErrorStateProps {
  /** Mensaje de error */
  error: string | Error;
  /** Título personalizado */
  title?: string;
  /** Descripción adicional */
  description?: string;
  /** Función de reintento */
  onRetry?: () => void;
  /** Función de reset completo */
  onReset?: () => void;
  /** Si mostrar detalles técnicos */
  showDetails?: boolean;
  /** Tipo de error para iconografía */
  errorType?: 'network' | 'server' | 'database' | 'unknown';
  /** Tamaño del componente */
  size?: 'sm' | 'md' | 'lg';
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Obtiene el icono apropiado según el tipo de error
 */
function getErrorIcon(errorType: ErrorStateProps['errorType']) {
  switch (errorType) {
    case 'network':
      return faWifi;
    case 'server':
      return faServer;
    case 'database':
      return faDatabase;
    default:
      return faExclamationTriangle;
  }
}

/**
 * Obtiene el mensaje de error legible
 */
function getErrorMessage(error: string | Error): string {
  if (typeof error === 'string') return error;
  return error.message || 'Error desconocido';
}

/**
 * Detecta el tipo de error basado en el mensaje
 */
function detectErrorType(error: string | Error): ErrorStateProps['errorType'] {
  const message = getErrorMessage(error).toLowerCase();
  
  if (message.includes('fetch') || message.includes('network') || message.includes('timeout')) {
    return 'network';
  }
  if (message.includes('server') || message.includes('api') || message.includes('500')) {
    return 'server';
  }
  if (message.includes('database') || message.includes('db') || message.includes('connection')) {
    return 'database';
  }
  return 'unknown';
}

/**
 * Componente principal de estado de error
 */
export function ErrorState({
  error,
  title,
  description,
  onRetry,
  onReset,
  showDetails = false,
  errorType,
  size = 'md',
  className = '',
}: ErrorStateProps) {
  const errorMessage = getErrorMessage(error);
  const detectedType = errorType || detectErrorType(error);
  const icon = getErrorIcon(detectedType);
  
  const sizeClasses = {
    sm: 'p-4 text-sm',
    md: 'p-6 text-base',
    lg: 'p-8 text-lg',
  };

  const iconSizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <Card className={`cinema-card border-destructive/20 ${className}`}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-destructive/10 animate-pulse-glow">
            <FontAwesomeIcon 
              icon={icon} 
              className={`${iconSizes[size]} text-destructive`}
            />
          </div>
        </div>
        
        <CardTitle className="text-destructive">
          {title || 'Error en la Aplicación'}
        </CardTitle>
        
        <div className="flex justify-center">
          <Badge variant="destructive" className="text-xs">
            {detectedType === 'network' && 'Error de Conexión'}
            {detectedType === 'server' && 'Error del Servidor'}
            {detectedType === 'database' && 'Error de Base de Datos'}
            {detectedType === 'unknown' && 'Error Desconocido'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className={`space-y-4 text-center ${sizeClasses[size]}`}>
        {/* Mensaje principal */}
        <div className="space-y-2">
          <p className="text-muted-foreground">
            {description || 'Ha ocurrido un problema inesperado. Por favor, inténtalo de nuevo.'}
          </p>
          
          {/* Mensaje de error técnico */}
          {showDetails && (
            <details className="text-left">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
                Ver detalles técnicos
              </summary>
              <div className="mt-2 p-3 bg-muted/30 rounded-md text-xs font-mono text-destructive break-all">
                {errorMessage}
              </div>
            </details>
          )}
        </div>

        {/* Sugerencias de solución */}
        <div className="space-y-2 text-sm text-muted-foreground">
          {detectedType === 'network' && (
            <div className="space-y-1">
              <p>💡 <strong>Sugerencias:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-left max-w-md mx-auto">
                <li>Verifica tu conexión a internet</li>
                <li>Recarga la página</li>
                <li>Intenta más tarde</li>
              </ul>
            </div>
          )}
          
          {detectedType === 'server' && (
            <div className="space-y-1">
              <p>💡 <strong>Sugerencias:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-left max-w-md mx-auto">
                <li>El servidor puede estar temporalmente ocupado</li>
                <li>Intenta recargar en unos momentos</li>
                <li>Si persiste, contacta soporte</li>
              </ul>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          {onRetry && (
            <Button 
              onClick={onRetry}
              variant="default"
              className="cinema-button"
            >
              <FontAwesomeIcon icon={faRefresh} className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          )}
          
          {onReset && (
            <Button 
              onClick={onReset}
              variant="outline"
              className="border-primary/20 hover:bg-primary/5"
            >
              <FontAwesomeIcon icon={faQuestion} className="h-4 w-4 mr-2" />
              Resetear Todo
            </Button>
          )}
        </div>

        {/* Información adicional */}
        <div className="text-xs text-muted-foreground pt-4 border-t border-border/50">
          <p>Si el problema persiste, por favor reporta este error.</p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Componente ligero de error para espacios pequeños
 */
export function ErrorStateMini({
  error,
  onRetry,
  className = '',
}: Pick<ErrorStateProps, 'error' | 'onRetry' | 'className'>) {
  return (
    <div className={`flex items-center gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-lg ${className}`}>
      <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-destructive flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-destructive truncate">
          {getErrorMessage(error)}
        </p>
      </div>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="flex-shrink-0 h-8 w-8 p-0"
        >
          <FontAwesomeIcon icon={faRefresh} className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
