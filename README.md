# 🎬 CineDash - Movie Analytics Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.12-8884d8?logo=react)](https://recharts.org/)

> **Dashboard premium de análisis cinematográfico** construido con Next.js, TypeScript y la API de TMDB. Explora tendencias de películas, visualiza datos con gráficos interactivos y descubre insights del mundo del cine.

## 🌟 Características Principales

### 📊 **Visualizaciones Avanzadas**
- **4 tipos de gráficos interactivos** con Recharts
- **Tooltips mejorados** con fondo sólido para máxima legibilidad
- **Animaciones cinematográficas** y efectos de glow
- **Responsive design** adaptativo para todos los dispositivos

### 🔍 **Sistema de Filtros Inteligente**
- **Filtro de rango de fechas** con rangos predefinidos
- **Filtro de géneros** con selección múltiple y búsqueda
- **Filtro de popularidad** con criterios de votación
- **Filtros populares** con un clic

### 🎨 **Experiencia de Usuario Premium**
- **Tema cinematográfico** con colores extravagantes (púrpura, dorado, rojo carmesí)
- **Estados de loading** con skeletons animados
- **Estados de error** inteligentes con sugerencias contextuales
- **Estados vacíos** elegantes con acciones sugeridas
- **Mobile-first design** completamente responsive

### ⚡ **Performance y Arquitectura**
- **Server-side caching** con TTL configurables
- **TanStack Query** para manejo eficiente de estado
- **API routes optimizadas** con logging completo
- **5 transformaciones de datos** obligatorias implementadas

## 🛠️ Stack Tecnológico

### **Core Framework**
- **Next.js 15** - React framework con App Router
- **TypeScript** - Tipado estático para mejor DX
- **React 19** - Biblioteca de UI con Server Components

### **Styling & UI**
- **TailwindCSS v4** - Utility-first CSS framework
- **shadcn/ui** - Componentes de UI accesibles
- **FontAwesome** - Iconografía profesional consistente
- **Custom CSS** - Tema cinematográfico con variables Oklch

### **Data & State Management**
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **React Hook Form** - Formularios performantes
- **Zod** - Validación de esquemas TypeScript-first

### **Visualizations & Charts**
- **Recharts** - Gráficos interactivos y responsivos
- **Custom animations** - Transiciones y efectos cinematográficos

### **Development & Quality**
- **ESLint** - Linting de código
- **TypeScript strict mode** - Máxima seguridad de tipos
- **Git hooks** - Pre-commit quality checks

## 📊 Visualizaciones Implementadas

### 1. 📈 **Gráfico de Popularidad Mensual** (Área)
- Evolución temporal de popularidad promedio
- Línea de tendencia con promedio móvil
- Gradientes cinematográficos y animaciones
- Estadísticas rápidas integradas

### 2. ⭐ **Gráfico de Calificación Mensual** (Línea)
- Calificaciones promedio por período
- Líneas de referencia (5.0 y 7.0)
- Puntos conectados para continuidad visual
- Indicadores de mejora/declive

### 3. 🏆 **Top 10 Películas** (Barras Verticales)
- Ranking de películas más populares
- Tooltips ricos con información completa
- Colores alternados cinematográficos
- Layout vertical para mejor legibilidad

### 4. 🎭 **Distribución de Géneros** (Dona)
- Porcentajes de películas por género
- Centro informativo con total de películas
- Paleta de colores cinematográfica única
- Leyenda personalizada con porcentajes

## 🔄 Transformaciones de Datos

### **1. Agregación Temporal Mensual**
```typescript
// Agrupa películas por mes y calcula promedios
const monthlyData = aggregateByMonth(movies, genres);
// Resultado: { month: "2024-01", avg_popularity: 85.2, movies_count: 15, ... }
```

### **2. Cálculo de Cambio Porcentual**
```typescript
// Calcula variaciones entre períodos consecutivos
const withChanges = calculatePercentageChange(monthlyData);
// Resultado: { popularity_change_percent: 12.5, vote_change_percent: -2.1, ... }
```

### **3. Análisis de Ventana Móvil**
```typescript
// Promedio móvil de 3 períodos para suavizar tendencias
const smoothedData = calculateRollingAverage(monthlyData, 3);
// Resultado: { popularity_moving_avg: 87.3, vote_moving_avg: 7.2, ... }
```

### **4. Filtrado Top-N de Películas**
```typescript
// Obtiene las N películas más populares con enriquecimiento
const topMovies = getTopMovies(movies, genres, 'popularity', 10);
// Resultado: [{ title: "Movie", popularity: 95.2, genre_names: ["Action", "Sci-Fi"], ... }]
```

### **5. Unión de Nombres de Géneros**
```typescript
// Mapea IDs de géneros a nombres y calcula distribución
const genreDistribution = analyzeGenreDistribution(movies, genres);
// Resultado: [{ genre_name: "Action", count: 25, percentage: 15.2, ... }]
```

## 🚀 Inicio Rápido

### **Prerrequisitos**
- Node.js 18+ 
- pnpm (recomendado) o npm
- Cuenta en [The Movie Database (TMDB)](https://www.themoviedb.org/settings/api)

### **1. Clonación e Instalación**
```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/movie-dashboard.git
cd movie-dashboard

# Instalar dependencias
pnpm install
```

### **2. Configuración de Variables de Entorno**
```bash
# Copiar archivo de ejemplo
cp env.example .env.local

# Editar .env.local con tus credenciales
TMDB_API_KEY=tu_api_key_de_tmdb_aqui
TMDB_BASE_URL=https://api.themoviedb.org/3
WEBHOOK_URL=https://webhook.site/tu-webhook-url  # Opcional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **3. Desarrollo**
```bash
# Iniciar servidor de desarrollo
pnpm dev

# Abrir en navegador
# http://localhost:3000
```

### **4. Build de Producción**
```bash
# Generar build optimizado
pnpm build

# Iniciar servidor de producción
pnpm start
```

## 🌐 Deployment en Vercel

### **Deployment Automático**
1. **Fork** este repositorio
2. Conecta tu cuenta de **Vercel** con GitHub
3. Importa el proyecto en Vercel
4. Configura las variables de entorno:
   - `TMDB_API_KEY`
   - `TMDB_BASE_URL`
   - `WEBHOOK_URL` (opcional)
   - `NEXT_PUBLIC_APP_URL` (se configurará automáticamente)

### **Deployment Manual**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy desde terminal
vercel --prod

# Configurar variables de entorno
vercel env add TMDB_API_KEY
vercel env add TMDB_BASE_URL
```

## 📁 Estructura del Proyecto

```
movie-dashboard/
├── 📂 src/
│   ├── 📂 app/                    # App Router de Next.js
│   │   ├── 📂 api/               # API Routes
│   │   │   ├── 📂 genres/        # Endpoint de géneros
│   │   │   ├── 📂 movies/        # Endpoints de películas
│   │   │   └── 📂 webhook/       # Webhook para logging
│   │   ├── globals.css           # Estilos globales + tema
│   │   ├── layout.tsx           # Layout principal
│   │   └── page.tsx             # Página del dashboard
│   ├── 📂 components/            # Componentes React
│   │   ├── 📂 charts/           # Visualizaciones
│   │   ├── 📂 dashboard/        # Componentes del dashboard
│   │   ├── 📂 filters/          # Componentes de filtros
│   │   ├── 📂 layout/           # Layouts responsive
│   │   └── 📂 ui/               # Componentes base (shadcn)
│   ├── 📂 lib/                   # Lógica de negocio
│   │   ├── 📂 data/             # Clientes API
│   │   ├── 📂 hooks/            # Custom hooks
│   │   ├── 📂 transformations/  # Transformaciones de datos
│   │   ├── 📂 types/            # Definiciones TypeScript
│   │   └── 📂 utils/            # Utilidades (cache, logger)
│   └── 📂 server/                # Configuración del servidor
├── 📄 env.example               # Variables de entorno ejemplo
├── 📄 next.config.ts           # Configuración Next.js
├── 📄 package.json             # Dependencias y scripts
├── 📄 tailwind.config.ts       # Configuración Tailwind
└── 📄 tsconfig.json           # Configuración TypeScript
```

## 🎯 Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Servidor de desarrollo
pnpm build        # Build de producción
pnpm start        # Servidor de producción
pnpm lint         # Linting de código

# shadcn/ui
pnpm dlx shadcn@latest add [component]  # Agregar componentes
```

## 🔧 Configuración Avanzada

### **Personalización del Tema**
El tema cinematográfico se puede personalizar en `src/app/globals.css`:

```css
:root {
  /* Colores principales (Oklch) */
  --primary: oklch(0.70 0.25 290);    /* Púrpura cinematográfico */
  --secondary: oklch(0.85 0.15 85);   /* Dorado alfombra roja */
  --accent: oklch(0.65 0.20 25);      /* Rojo carmesí */
  
  /* Personaliza según tu marca */
}
```

### **Configuración de Cache**
Ajusta los tiempos de cache en `src/lib/utils/cache.ts`:

```typescript
export const CACHE_CONFIGS = {
  GENRES: { ttl: 600 },        // 10 minutos
  MOVIES_DISCOVER: { ttl: 300 }, // 5 minutos
  MOVIE_DETAILS: { ttl: 1800 },  // 30 minutos
};
```

### **Logging y Monitoreo**
El sistema de logging está configurado en `src/lib/utils/logger.ts`:
- Logs en formato JSONL
- Webhook integration opcional
- Métricas de performance automáticas

## 📚 Documentación Técnica

### **Patrones de Diseño Utilizados**
- **Compound Components**: Filtros modulares
- **Render Props**: Componentes flexibles
- **Container/Presentational**: Separación de lógica
- **Custom Hooks**: Lógica reutilizable

### **Principios Seguidos**
- **SOLID**: Principios de diseño orientado a objetos
- **DRY**: Don't Repeat Yourself
- **KISS**: Keep It Simple, Stupid
- **Functional Programming**: Funciones puras y inmutabilidad

### **Performance Optimizations**
- Server-side caching con TTL
- Component memoization con useMemo
- Lazy loading de componentes
- Image optimization automática

## 🤝 Contribución

1. **Fork** el proyecto
2. Crea una **feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la branch (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### **Estándares de Código**
- Usa **TypeScript** para todo el código
- Sigue las convenciones de **ESLint**
- Escribe **comentarios descriptivos** en funciones
- Mantén **componentes pequeños** y enfocados
- Usa **naming conventions** descriptivas


## 🙏 Reconocimientos

- **[The Movie Database (TMDB)](https://www.themoviedb.org/)** - API de datos de películas
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes de UI elegantes
- **[Recharts](https://recharts.org/)** - Biblioteca de gráficos React
- **[Next.js](https://nextjs.org/)** - Framework React de producción
- **[Vercel](https://vercel.com/)** - Plataforma de deployment


---

<div align="center">

**🎬 Construido con ❤️ para los amantes del cine**

[Demo en Vivo](https://tu-movie-dashboard.vercel.app) • [Documentación](https://github.com/tu-usuario/movie-dashboard/wiki) • [Changelog](CHANGELOG.md)

</div>