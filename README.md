# E-Commerce Platform

Plataforma de comercio electrónico B2C con React, Next.js, Spring Boot y PostgreSQL.

## Stack

- **Frontend:** React 18, Next.js 14, TypeScript, Tailwind CSS, Zustand, TanStack Query
- **Backend:** Java 21, Spring Boot 3, PostgreSQL, Redis
- **Infraestructura:** Docker, Kubernetes, GitHub Actions

## Estructura

```
backend/       -- Spring Boot API
frontend/      -- Next.js aplicación
infrastructure/-- Docker Compose, Nginx, K8s
docs/          -- Documentación y ADRs
```

## Desarrollo local

```bash
docker-compose -f infrastructure/docker-compose.yml up
```

## Documentación

Ver [SPEC E-COMMERCE.md](./SPEC%20E-COMMERCE.md) para la especificación técnica completa.
