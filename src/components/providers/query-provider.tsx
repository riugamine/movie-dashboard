/**
 * Provider de TanStack Query para el dashboard
 * 
 * Configura el cliente de React Query con configuraciones optimizadas
 * para la aplicación de dashboard de películas
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * Crear cliente de Query con configuraciones optimizadas
 */
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Tiempo que los datos se consideran frescos (no refetch automático)
        staleTime: 5 * 60 * 1000, // 5 minutos
        
        // Tiempo que los datos se mantienen en caché
        gcTime: 15 * 60 * 1000, // 15 minutos
        
        // Reintentos en caso de error
        retry: (failureCount, error) => {
          // No reintentar para errores 404 o de cliente
          if (error instanceof Error && error.message.includes('404')) {
            return false;
          }
          // Máximo 3 reintentos para otros errores
          return failureCount < 3;
        },
        
        // Intervalo de reintentos (exponencial backoff)
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        
        // Refetch cuando la ventana regains focus
        refetchOnWindowFocus: false,
        
        // Refetch cuando se reconecta la red
        refetchOnReconnect: true,
        
        // Refetch cuando el componente se monta
        refetchOnMount: true,
      },
      mutations: {
        // Reintentos para mutaciones
        retry: 1,
        
        // Intervalo de reintentos para mutaciones
        retryDelay: 1000,
      },
    },
  });
}

/**
 * Provider principal de TanStack Query
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // Crear el cliente de Query una sola vez
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools solo en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
        />
      )}
    </QueryClientProvider>
  );
}
