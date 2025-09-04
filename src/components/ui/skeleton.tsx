/**
 * Componente Skeleton para estados de loading
 * 
 * Proporciona una animación de carga elegante y cinematográfica
 */

import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-muted/50 via-muted to-muted/50 bg-[length:200%_100%] animate-shimmer",
        className
      )}
      {...props}
    />
  )
}

/**
 * Skeleton específico para gráficos
 */
function ChartSkeleton({ 
  height = "300px",
  className 
}: { 
  height?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
      
      {/* Description skeleton */}
      <Skeleton className="h-4 w-3/4" />
      
      {/* Chart area skeleton */}
      <div className="space-y-3" style={{ height }}>
        <div className="flex justify-between items-end h-full">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton 
              key={i} 
              className="w-8 rounded-t-md"
              style={{ 
                height: `${Math.random() * 60 + 40}%`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Footer skeleton */}
      <div className="flex justify-between text-xs pt-4 border-t">
        <div className="flex gap-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

/**
 * Skeleton para tarjetas de estadísticas
 */
function StatCardSkeleton() {
  return (
    <div className="cinema-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

/**
 * Skeleton para filtros
 */
function FilterSkeleton() {
  return (
    <div className="cinema-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export { Skeleton, ChartSkeleton, StatCardSkeleton, FilterSkeleton }