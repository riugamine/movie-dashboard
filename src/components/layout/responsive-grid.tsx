/**
 * Componente de Grid Responsive
 * 
 * Proporciona layouts adaptativos para diferentes tamaños de pantalla
 */

'use client';

import { cn } from '@/lib/utils';

interface ResponsiveGridProps {
  /** Elementos hijos */
  children: React.ReactNode;
  /** Número de columnas por breakpoint */
  cols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  /** Gap entre elementos */
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  /** Clase CSS adicional */
  className?: string;
  /** Si usar auto-fit en lugar de columnas fijas */
  autoFit?: boolean;
  /** Tamaño mínimo de elementos cuando se usa autoFit */
  minItemWidth?: string;
}

/**
 * Grid responsive principal
 */
export function ResponsiveGrid({
  children,
  cols = { sm: 1, md: 2, lg: 3, xl: 4, '2xl': 5 },
  gap = 'md',
  className = '',
  autoFit = false,
  minItemWidth = '300px',
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const colClasses = autoFit 
    ? '' 
    : cn(
        'grid',
        cols.sm && `grid-cols-${cols.sm}`,
        cols.md && `md:grid-cols-${cols.md}`,
        cols.lg && `lg:grid-cols-${cols.lg}`,
        cols.xl && `xl:grid-cols-${cols.xl}`,
        cols['2xl'] && `2xl:grid-cols-${cols['2xl']}`
      );

  const autoFitStyles = autoFit 
    ? {
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`,
      }
    : {};

  return (
    <div 
      className={cn(
        colClasses,
        gapClasses[gap],
        className
      )}
      style={autoFitStyles}
    >
      {children}
    </div>
  );
}

/**
 * Grid específico para gráficos del dashboard
 */
export function ChartsGrid({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <ResponsiveGrid
      cols={{ sm: 1, md: 1, lg: 2, xl: 2, '2xl': 2 }}
      gap="lg"
      className={className}
    >
      {children}
    </ResponsiveGrid>
  );
}

/**
 * Grid específico para tarjetas de estadísticas
 */
export function StatsGrid({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <ResponsiveGrid
      cols={{ sm: 1, md: 2, lg: 3, xl: 6, '2xl': 6 }}
      gap="md"
      className={className}
    >
      {children}
    </ResponsiveGrid>
  );
}

/**
 * Grid específico para filtros
 */
export function FiltersGrid({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <ResponsiveGrid
      cols={{ sm: 1, md: 2, lg: 2, xl: 4, '2xl': 4 }}
      gap="md"
      className={className}
    >
      {children}
    </ResponsiveGrid>
  );
}

/**
 * Container responsivo principal
 */
export function ResponsiveContainer({ 
  children, 
  maxWidth = '7xl',
  padding = 'md',
  className = '' 
}: { 
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-6',
    xl: 'px-12 py-8',
  };

  return (
    <div className={cn(
      'mx-auto w-full',
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
}

/**
 * Stack vertical con espaciado responsive
 */
export function ResponsiveStack({ 
  children, 
  spacing = 'md',
  className = '' 
}: { 
  children: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const spacingClasses = {
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8',
    xl: 'space-y-12',
  };

  return (
    <div className={cn(
      'flex flex-col',
      spacingClasses[spacing],
      className
    )}>
      {children}
    </div>
  );
}

/**
 * Flex responsive que se adapta a diferentes pantallas
 */
export function ResponsiveFlex({ 
  children, 
  direction = 'col-md-row',
  gap = 'md',
  align = 'start',
  justify = 'start',
  className = '' 
}: { 
  children: React.ReactNode;
  direction?: 'row' | 'col' | 'col-md-row' | 'row-md-col';
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  className?: string;
}) {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'col-md-row': 'flex-col md:flex-row',
    'row-md-col': 'flex-row md:flex-col',
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  return (
    <div className={cn(
      'flex',
      directionClasses[direction],
      gapClasses[gap],
      alignClasses[align],
      justifyClasses[justify],
      className
    )}>
      {children}
    </div>
  );
}
