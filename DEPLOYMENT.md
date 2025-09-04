# 🚀 Guía de Deployment

Esta guía te ayudará a deployar el Movie Dashboard en diferentes plataformas.

## 🌐 Deployment en Vercel (Recomendado)

### Método 1: Deployment Automático desde GitHub

1. **Fork o clona este repositorio** en tu cuenta de GitHub

2. **Ve a [Vercel](https://vercel.com)** y crea una cuenta si no tienes una

3. **Conecta tu repositorio**:
   - Click en "New Project"
   - Importa tu repositorio de GitHub
   - Selecciona el framework "Next.js"

4. **Configura las variables de entorno**:
   ```bash
   TMDB_API_KEY=tu_api_key_de_tmdb
   TMDB_BASE_URL=https://api.themoviedb.org/3
   WEBHOOK_URL=https://webhook.site/tu-url  # Opcional
   ```

5. **Deploy**: Vercel automáticamente detectará la configuración y deployará

### Método 2: Deployment desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Iniciar sesión
vercel login

# Deploy desde el directorio del proyecto
vercel

# Para production
vercel --prod
```

### Configuración de Variables de Entorno en Vercel

```bash
# Via CLI
vercel env add TMDB_API_KEY
vercel env add TMDB_BASE_URL
vercel env add WEBHOOK_URL

# Via Dashboard
# 1. Ve a tu proyecto en dashboard.vercel.com
# 2. Settings > Environment Variables
# 3. Agrega cada variable con su valor
```

## 🐳 Deployment con Docker

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Instalar pnpm
RUN npm install -g pnpm

# Instalar dependencias únicamente cuando sea necesario
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Rebuild el código fuente únicamente cuando sea necesario
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Configurar variables de entorno para build
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm build

# Imagen de producción
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  movie-dashboard:
    build: .
    ports:
      - "3000:3000"
    environment:
      - TMDB_API_KEY=${TMDB_API_KEY}
      - TMDB_BASE_URL=https://api.themoviedb.org/3
      - WEBHOOK_URL=${WEBHOOK_URL}
      - NEXT_PUBLIC_APP_URL=http://localhost:3000
    restart: unless-stopped

  # Opcional: Nginx para proxy reverso
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - movie-dashboard
    restart: unless-stopped
```

### Comandos Docker

```bash
# Build de la imagen
docker build -t movie-dashboard .

# Ejecutar contenedor
docker run -p 3000:3000 \
  -e TMDB_API_KEY=tu_api_key \
  -e TMDB_BASE_URL=https://api.themoviedb.org/3 \
  movie-dashboard

# Con Docker Compose
docker-compose up -d
```

## ☁️ Deployment en Netlify

1. **Conecta tu repositorio** en Netlify

2. **Configuración de build**:
   ```bash
   Build command: pnpm build
   Publish directory: .next
   ```

3. **Variables de entorno**:
   - Ve a Site Settings > Environment Variables
   - Agrega las mismas variables que en Vercel

4. **Netlify Functions** (para APIs):
   - Las API routes de Next.js se convertirán automáticamente

## 🌊 Deployment en Railway

1. **Conecta tu repositorio** en Railway

2. **Variables de entorno**:
   ```bash
   TMDB_API_KEY=tu_api_key
   TMDB_BASE_URL=https://api.themoviedb.org/3
   PORT=3000
   ```

3. **Railway detectará automáticamente** Next.js y configurará el deployment

## 🔧 Configuración Post-Deployment

### 1. Verificar Variables de Entorno

```bash
# Verifica que las variables estén configuradas
curl https://tu-app.vercel.app/api/health

# Respuesta esperada:
{
  "status": "ok",
  "environment": "production",
  "tmdb_configured": true
}
```

### 2. Configurar Dominio Personalizado

#### En Vercel:
1. Ve a Settings > Domains
2. Agrega tu dominio personalizado
3. Configura los DNS records según las instrucciones

#### DNS Configuration:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61
```

### 3. Configurar HTTPS

- **Vercel**: HTTPS automático con certificados SSL
- **Netlify**: HTTPS automático
- **Docker**: Configura nginx con Let's Encrypt

### 4. Monitoreo y Analytics

#### Vercel Analytics:
```bash
# Instalar
pnpm add @vercel/analytics

# En layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

#### Google Analytics:
```javascript
// En layout.tsx
import Script from 'next/script'

<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"
  strategy="afterInteractive"
/>
```

## 🔍 Troubleshooting

### Errores Comunes

#### 1. "TMDB API Key not configured"
```bash
# Verifica que la variable esté configurada
echo $TMDB_API_KEY

# En Vercel, verifica en dashboard
vercel env ls
```

#### 2. "Build failed: out of memory"
```bash
# En vercel.json
{
  "functions": {
    "src/app/**/*": {
      "memory": 1024
    }
  }
}
```

#### 3. "API Routes not working"
- Verifica que las rutas estén en `src/app/api/`
- Confirma que exportes `GET`, `POST`, etc.
- Revisa los logs de deployment

### Logs de Debugging

```bash
# Vercel CLI
vercel logs

# Docker
docker logs movie-dashboard

# Netlify
# Ve a Site Overview > Functions logs
```

## 📊 Performance Optimization

### 1. Configurar Headers de Cache

```javascript
// En next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=300, stale-while-revalidate=600'
          }
        ]
      }
    ]
  }
}
```

### 2. Optimización de Imágenes

```javascript
// next.config.ts
const nextConfig = {
  images: {
    domains: ['image.tmdb.org'],
    formats: ['image/webp', 'image/avif']
  }
}
```

### 3. Bundle Analysis

```bash
# Analizar bundle
pnpm build && pnpm analyze

# Ver reporte en browser
open .next/analyze/client.html
```

## 🔒 Seguridad

### Variables de Entorno Seguras

```bash
# ✅ Correcto - Variables del servidor
TMDB_API_KEY=secret_key

# ✅ Correcto - Variables públicas
NEXT_PUBLIC_APP_URL=https://tu-app.com

# ❌ Incorrecto - No expongas secrets
NEXT_PUBLIC_TMDB_API_KEY=secret_key
```

### Headers de Seguridad

```javascript
// En next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ]
  }
}
```

---

## 🎉 ¡Deployment Exitoso!

Una vez deployado, tu dashboard estará disponible en:
- **Vercel**: `https://tu-proyecto.vercel.app`
- **Netlify**: `https://tu-proyecto.netlify.app`
- **Railway**: `https://tu-proyecto.up.railway.app`

¿Problemas? Revisa los logs y la [documentación de troubleshooting](#-troubleshooting).
