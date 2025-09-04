/**
 * Filtro de Rango de Fechas - Componente elegante para selección de períodos
 * 
 * Patrón de diseño: Compound Component Pattern
 * - Componente principal que maneja el estado
 * - Subcomponentes especializados para cada input
 * - Validación automática y feedback visual
 */

'use client';

import { useState, useEffect } from 'react';
import { Calendar, CalendarDays, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DateRangeFilterProps {
  /** Fecha de inicio inicial */
  initialStartDate?: string;
  /** Fecha de fin inicial */
  initialEndDate?: string;
  /** Callback cuando cambia el rango de fechas */
  onDateRangeChange: (startDate: string, endDate: string) => void;
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
 * Componente de filtro de rango de fechas con diseño cinematográfico
 */
export function DateRangeFilter({
  initialStartDate = '',
  initialEndDate = '',
  onDateRangeChange,
  onClear,
  title = 'Rango de Fechas',
  description = 'Selecciona el período de lanzamiento de películas',
  disabled = false,
}: DateRangeFilterProps) {
  // Estado interno del componente
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Valida el rango de fechas seleccionado
   */
  const validateDateRange = (start: string, end: string): boolean => {
    // Limpiar errores previos
    setErrorMessage('');
    setIsValid(true);

    // Si ambas fechas están vacías, es válido (sin filtro)
    if (!start && !end) {
      return true;
    }

    // Si solo una fecha está presente, es inválido
    if ((start && !end) || (!start && end)) {
      setErrorMessage('Debes seleccionar ambas fechas o ninguna');
      setIsValid(false);
      return false;
    }

    // Validar formato de fechas
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      setErrorMessage('Formato de fecha inválido');
      setIsValid(false);
      return false;
    }

    // Validar que la fecha de inicio sea anterior a la de fin
    if (startDateObj > endDateObj) {
      setErrorMessage('La fecha de inicio debe ser anterior a la fecha de fin');
      setIsValid(false);
      return false;
    }

    // Validar que las fechas no sean futuras
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Final del día actual

    if (startDateObj > today || endDateObj > today) {
      setErrorMessage('Las fechas no pueden ser futuras');
      setIsValid(false);
      return false;
    }

    return true;
  };

  /**
   * Maneja el cambio en la fecha de inicio
   */
  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    
    if (validateDateRange(value, endDate)) {
      onDateRangeChange(value, endDate);
    }
  };

  /**
   * Maneja el cambio en la fecha de fin
   */
  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    
    if (validateDateRange(startDate, value)) {
      onDateRangeChange(startDate, value);
    }
  };

  /**
   * Limpia el filtro de fechas
   */
  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setIsValid(true);
    setErrorMessage('');
    onDateRangeChange('', '');
    onClear?.();
  };

  /**
   * Establece rangos de fechas predefinidos
   */
  const setPresetRange = (months: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - months);

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    setStartDate(startStr);
    setEndDate(endStr);
    onDateRangeChange(startStr, endStr);
  };

  // Efecto para validar cuando cambian las props iniciales
  useEffect(() => {
    if (initialStartDate !== startDate || initialEndDate !== endDate) {
      setStartDate(initialStartDate);
      setEndDate(initialEndDate);
      validateDateRange(initialStartDate, initialEndDate);
    }
  }, [initialStartDate, initialEndDate]);

  const hasActiveFilter = startDate || endDate;

  return (
    <Card className={`cinema-card transition-all duration-300 ${!isValid ? 'border-destructive/50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {hasActiveFilter && (
              <Badge variant="secondary" className="ml-2">
                Activo
              </Badge>
            )}
          </div>
          {hasActiveFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={disabled}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Botones de rangos predefinidos */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPresetRange(3)}
            disabled={disabled}
            className="text-xs"
          >
            Últimos 3 meses
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPresetRange(6)}
            disabled={disabled}
            className="text-xs"
          >
            Últimos 6 meses
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPresetRange(12)}
            disabled={disabled}
            className="text-xs"
          >
            Último año
          </Button>
        </div>

        {/* Inputs de fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date" className="text-sm font-medium">
              Fecha de Inicio
            </Label>
            <div className="relative">
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                disabled={disabled}
                className={`pl-10 ${!isValid && startDate ? 'border-destructive focus:border-destructive' : ''}`}
              />
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date" className="text-sm font-medium">
              Fecha de Fin
            </Label>
            <div className="relative">
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                disabled={disabled}
                className={`pl-10 ${!isValid && endDate ? 'border-destructive focus:border-destructive' : ''}`}
              />
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Mensaje de error */}
        {!isValid && errorMessage && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            <X className="h-4 w-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Información del rango seleccionado */}
        {isValid && startDate && endDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-primary/5 p-3 rounded-md">
            <CalendarDays className="h-4 w-4 flex-shrink-0" />
            <span>
              Período seleccionado: {new Date(startDate).toLocaleDateString('es-ES')} - {new Date(endDate).toLocaleDateString('es-ES')}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
