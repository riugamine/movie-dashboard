/**
 * Filtro de Votación Mínima - Componente elegante para filtrar por número de votos
 * 
 * Patrón de diseño: Controlled Slider + Visual Feedback
 * - Slider interactivo con valores predefinidos
 * - Feedback visual del impacto del filtro
 * - Indicadores de calidad de películas
 */

'use client';

import { useState, useEffect } from 'react';
import { Users, TrendingUp, Award, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface VoteFilterProps {
  /** Número mínimo de votos inicial */
  initialMinVoteCount?: number;
  /** Callback cuando cambia el mínimo de votos */
  onVoteCountChange: (minVoteCount: number) => void;
  /** Callback cuando se limpia el filtro */
  onClear?: () => void;
  /** Título del filtro */
  title?: string;
  /** Descripción del filtro */
  description?: string;
  /** Si está deshabilitado */
  disabled?: boolean;
}

/**
 * Configuración de niveles de votación predefinidos
 */
const VOTE_LEVELS = [
  {
    value: 0,
    label: 'Todas',
    description: 'Incluir todas las películas',
    icon: Filter,
    color: 'text-muted-foreground',
    badge: 'Todas',
  },
  {
    value: 100,
    label: 'Básico',
    description: 'Al menos 100 votos (filtro básico)',
    icon: Users,
    color: 'text-primary',
    badge: 'Básico',
  },
  {
    value: 500,
    label: 'Popular',
    description: 'Al menos 500 votos (películas populares)',
    icon: TrendingUp,
    color: 'text-accent',
    badge: 'Popular',
  },
  {
    value: 1000,
    label: 'Muy Popular',
    description: 'Al menos 1,000 votos (muy populares)',
    icon: Award,
    color: 'text-secondary',
    badge: 'Muy Popular',
  },
  {
    value: 2500,
    label: 'Blockbuster',
    description: 'Al menos 2,500 votos (blockbusters)',
    icon: Award,
    color: 'text-accent',
    badge: 'Blockbuster',
  },
] as const;

/**
 * Componente de filtro de votación mínima con diseño cinematográfico
 */
export function VoteFilter({
  initialMinVoteCount = 100,
  onVoteCountChange,
  onClear,
  title = 'Calidad de Películas',
  description = 'Filtra por número mínimo de votos para asegurar calidad',
  disabled = false,
}: VoteFilterProps) {
  // Estado interno del componente
  const [minVoteCount, setMinVoteCount] = useState(initialMinVoteCount);

  /**
   * Encuentra el nivel actual basado en el número de votos
   */
  const getCurrentLevel = (voteCount: number) => {
    // Encontrar el nivel más alto que no supere el voteCount
    return [...VOTE_LEVELS]
      .reverse()
      .find(level => voteCount >= level.value) || VOTE_LEVELS[0];
  };

  /**
   * Maneja el cambio de nivel de votación
   */
  const handleLevelChange = (newVoteCount: number) => {
    setMinVoteCount(newVoteCount);
    onVoteCountChange(newVoteCount);
  };

  /**
   * Limpia el filtro (vuelve al mínimo)
   */
  const handleClear = () => {
    const defaultValue = 0;
    setMinVoteCount(defaultValue);
    onVoteCountChange(defaultValue);
    onClear?.();
  };

  // Efecto para sincronizar con props iniciales
  useEffect(() => {
    if (initialMinVoteCount !== minVoteCount) {
      setMinVoteCount(initialMinVoteCount);
    }
  }, [initialMinVoteCount]);

  const currentLevel = getCurrentLevel(minVoteCount);
  const IconComponent = currentLevel.icon;
  const hasActiveFilter = minVoteCount > 0;

  return (
    <Card className="cinema-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconComponent className={`h-5 w-5 ${currentLevel.color}`} />
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <Badge 
              variant={hasActiveFilter ? "default" : "outline"} 
              className={hasActiveFilter ? "cinema-glow" : ""}
            >
              {currentLevel.badge}
            </Badge>
          </div>
          {hasActiveFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={disabled}
              className="h-8 px-2 text-xs hover:bg-destructive/10 hover:text-destructive"
            >
              Reset
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Información del nivel actual */}
        <div className={`bg-gradient-to-r from-${currentLevel.color.split('-')[1]}/10 to-transparent p-3 rounded-md border border-${currentLevel.color.split('-')[1]}/20`}>
          <div className="flex items-center gap-2 mb-1">
            <IconComponent className={`h-4 w-4 ${currentLevel.color}`} />
            <span className="font-medium text-sm">{currentLevel.label}</span>
            {minVoteCount > 0 && (
              <Badge variant="outline" className="text-xs">
                ≥ {minVoteCount.toLocaleString()} votos
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {currentLevel.description}
          </p>
        </div>

        {/* Selector de niveles */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Seleccionar Nivel de Calidad:</Label>
          <div className="grid grid-cols-1 gap-2">
            {VOTE_LEVELS.map((level) => {
              const LevelIcon = level.icon;
              const isSelected = minVoteCount === level.value;
              const isCurrentRange = minVoteCount >= level.value && 
                (VOTE_LEVELS.find(l => l.value > level.value && minVoteCount < l.value) ? true : 
                 level === VOTE_LEVELS[VOTE_LEVELS.length - 1]);

              return (
                <Button
                  key={level.value}
                  variant={isSelected ? "default" : "outline"}
                  className={`w-full justify-start h-auto p-3 transition-all ${
                    isSelected 
                      ? "cinema-glow" 
                      : isCurrentRange 
                        ? "border-primary/50 bg-primary/5" 
                        : ""
                  }`}
                  onClick={() => handleLevelChange(level.value)}
                  disabled={disabled}
                >
                  <div className="flex items-center gap-3 w-full">
                    <LevelIcon className={`h-4 w-4 ${isSelected ? 'text-primary-foreground' : level.color}`} />
                    <div className="flex flex-col items-start flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{level.label}</span>
                        {level.value > 0 && (
                          <span className="text-xs opacity-75">
                            {level.value.toLocaleString()}+ votos
                          </span>
                        )}
                      </div>
                      <span className="text-xs opacity-75 text-left">
                        {level.description}
                      </span>
                    </div>
                    {isSelected && (
                      <Badge variant="secondary" className="text-xs">
                        Activo
                      </Badge>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-muted/30 p-3 rounded-md">
          <div className="flex items-start gap-2">
            <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">¿Por qué filtrar por votos?</p>
              <p>
                Las películas con más votos tienden a ser más conocidas y confiables. 
                Un número mayor de votos indica mayor exposición y, generalmente, mejor calidad.
              </p>
            </div>
          </div>
        </div>

        {/* Valor personalizado */}
        {minVoteCount > 0 && !VOTE_LEVELS.some(level => level.value === minVoteCount) && (
          <div className="bg-accent/10 p-3 rounded-md border border-accent/20">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Valor Personalizado</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Filtrando películas con al menos {minVoteCount.toLocaleString()} votos
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
