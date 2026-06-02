# E-Commerce Platform — Especificación Técnica de Producción

> **Stack:** React 18 (frontend) · Java 21 + Spring Boot 3 (backend) · PostgreSQL · Redis · Docker  
> **Versión del documento:** 1.0  
> **Alcance:** Plataforma completa B2C con gestión de catálogo, carrito, pagos, órdenes y panel de administración

---

## Tabla de contenidos

1. [Visión general](#1-visión-general)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema)
3. [Modelo de datos](#3-modelo-de-datos)
4. [API REST — Contratos](#4-api-rest--contratos)
5. [Módulos del backend](#5-módulos-del-backend)
6. [Módulos del frontend](#6-módulos-del-frontend)
7. [Autenticación y autorización](#7-autenticación-y-autorización)
8. [Pagos](#8-pagos)
9. [Gestión de archivos e imágenes](#9-gestión-de-archivos-e-imágenes)
10. [Notificaciones](#10-notificaciones)
11. [Búsqueda y filtros](#11-búsqueda-y-filtros)
12. [Caché y rendimiento](#12-caché-y-rendimiento)
13. [Seguridad](#13-seguridad)
14. [Infraestructura y despliegue](#14-infraestructura-y-despliegue)
15. [Observabilidad](#15-observabilidad)
16. [Testing](#16-testing)
17. [Estructura de carpetas](#17-estructura-de-carpetas)
18. [Roadmap de implementación](#18-roadmap-de-implementación)

---

## 1. Visión general

### 1.1 Descripción del producto

Plataforma de comercio electrónico B2C que permite a usuarios finales explorar un catálogo de productos, gestionar un carrito de compras, realizar pagos y hacer seguimiento de sus órdenes. Incluye un panel de administración completo para gestionar inventario, órdenes, usuarios y analíticas.

### 1.2 Roles de usuario

| Rol | Descripción |
|-----|-------------|
| `GUEST` | Usuario no autenticado. Puede navegar catálogo y agregar al carrito (carrito en sesión). |
| `CUSTOMER` | Usuario registrado. Puede comprar, ver historial, guardar direcciones y lista de deseos. |
| `ADMIN` | Gestión completa de catálogo, órdenes, usuarios y configuración de la tienda. |
| `SUPER_ADMIN` | Acceso total incluyendo configuración del sistema y gestión de otros admins. |

### 1.3 Requerimientos funcionales clave

- Catálogo de productos con categorías, variantes (talla, color, etc.), imágenes múltiples e inventario por variante
- Carrito persistente (fusión entre sesión de guest y cuenta al autenticarse)
- Checkout con múltiples direcciones de envío y métodos de pago
- Procesamiento de pagos (Stripe como primario, PayPal como secundario)
- Sistema de órdenes con estados y tracking
- Reseñas y calificaciones de productos
- Lista de deseos
- Cupones y descuentos
- Notificaciones por email (transaccionales) y push (opcionales)
- Panel de administración: CRUD de productos, gestión de órdenes, dashboard de métricas
- Búsqueda full-text con filtros y facetas

### 1.4 Requerimientos no funcionales

| Atributo | Objetivo |
|----------|----------|
| Disponibilidad | 99.9% uptime mensual |
| Latencia API | P95 < 300ms para endpoints de catálogo |
| Escalabilidad | Soportar hasta 10,000 usuarios concurrentes |
| Seguridad | OWASP Top 10 mitigado, PCI DSS básico para pagos |
| SEO | SSR/SSG para páginas de producto y catálogo |

---

## 2. Arquitectura del sistema

### 2.1 Diagrama de alto nivel

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTES                             │
│         Browser (React SPA / Next.js)  ·  Mobile App        │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS
┌────────────────────▼────────────────────────────────────────┐
│                    CDN (CloudFront / Cloudflare)             │
│              Assets estáticos · Imágenes · Cache            │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                 API Gateway / Load Balancer                  │
│              (Nginx / AWS ALB · Rate limiting · SSL)         │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│              Spring Boot Application (Java 21)               │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ Catálogo │ │ Órdenes  │ │ Usuarios │ │   Pagos      │  │
│  │ Module   │ │ Module   │ │ Module   │ │   Module     │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │  Carrito │ │  Search  │ │  Media   │ │ Notificación │  │
│  │  Module  │ │  Module  │ │  Module  │ │   Module     │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
└──────┬──────────────┬──────────────┬───────────────────────┘
       │              │              │
┌──────▼───┐  ┌───────▼────┐  ┌─────▼──────┐
│PostgreSQL│  │   Redis     │  │ S3/MinIO   │
│(Primary  │  │(Cache/      │  │(Imágenes/  │
│+ Replica)│  │ Sessions/   │  │ Archivos)  │
└──────────┘  │ Carrito)    │  └────────────┘
              └─────────────┘
                                    ┌──────────────┐
                            ┌───────► Stripe API    │
                            │       └──────────────┘
                            │       ┌──────────────┐
                            └───────► Email (SES/   │
                                    │ Resend)       │
                                    └──────────────┘
```

### 2.2 Stack tecnológico detallado

#### Backend

| Componente | Tecnología | Versión |
|------------|-----------|---------|
| Lenguaje | Java | 21 (LTS) |
| Framework | Spring Boot | 3.3.x |
| ORM | Spring Data JPA + Hibernate | 6.x |
| Seguridad | Spring Security | 6.x |
| Base de datos | PostgreSQL | 16 |
| Caché / Sesiones | Redis | 7.x |
| Migraciones DB | Flyway | 10.x |
| Build tool | Maven o Gradle | Maven 3.9 |
| Documentación API | SpringDoc OpenAPI (Swagger 3) | 2.x |
| Tests | JUnit 5 + Mockito + Testcontainers | - |
| Contenedor | Docker | - |

#### Frontend

| Componente | Tecnología | Versión |
|------------|-----------|---------|
| Framework | React | 18.x |
| Meta-framework | Next.js (App Router) | 14.x |
| Lenguaje | TypeScript | 5.x |
| Estilos | Tailwind CSS | 3.x |
| UI Components | shadcn/ui | - |
| Estado global | Zustand | 4.x |
| Server state | TanStack Query | 5.x |
| Formularios | React Hook Form + Zod | - |
| HTTP client | Axios | - |
| Tests | Vitest + Testing Library + Playwright | - |
| Build | Turbopack (Next.js built-in) | - |

#### Infraestructura

| Componente | Tecnología |
|------------|-----------|
| Contenedores | Docker + Docker Compose |
| Orquestación | Kubernetes (EKS / GKE) o Docker Swarm |
| CI/CD | GitHub Actions |
| Registry | AWS ECR o Docker Hub |
| CDN | AWS CloudFront o Cloudflare |
| Almacenamiento | AWS S3 (o MinIO para self-hosted) |
| Email | AWS SES o Resend |
| Monitoring | Prometheus + Grafana |
| Logs | ELK Stack (Elasticsearch + Logstash + Kibana) o Loki |
| APM | Micrometer + Grafana Tempo |

---

## 3. Modelo de datos

### 3.1 Entidades principales

#### users

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255),                    -- null si OAuth
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    phone           VARCHAR(20),
    role            VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER',
    status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE | SUSPENDED | DELETED
    email_verified  BOOLEAN NOT NULL DEFAULT false,
    avatar_url      TEXT,
    provider        VARCHAR(20),                     -- LOCAL | GOOGLE | FACEBOOK
    provider_id     VARCHAR(255),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_login_at   TIMESTAMPTZ
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
```

#### addresses

```sql
CREATE TABLE addresses (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    alias        VARCHAR(100),                        -- "Casa", "Trabajo"
    full_name    VARCHAR(200) NOT NULL,
    phone        VARCHAR(20),
    street       TEXT NOT NULL,
    city         VARCHAR(100) NOT NULL,
    state        VARCHAR(100),
    postal_code  VARCHAR(20) NOT NULL,
    country      CHAR(2) NOT NULL,                   -- ISO 3166-1 alpha-2
    is_default   BOOLEAN NOT NULL DEFAULT false,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### categories

```sql
CREATE TABLE categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id   UUID REFERENCES categories(id),
    name        VARCHAR(255) NOT NULL,
    slug        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url   TEXT,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    is_active   BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);
```

#### products

```sql
CREATE TABLE products (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id      UUID REFERENCES categories(id),
    name             VARCHAR(500) NOT NULL,
    slug             VARCHAR(500) NOT NULL UNIQUE,
    description      TEXT,
    short_description VARCHAR(500),
    sku              VARCHAR(100) UNIQUE,
    brand            VARCHAR(200),
    status           VARCHAR(20) NOT NULL DEFAULT 'DRAFT', -- DRAFT | ACTIVE | ARCHIVED
    is_featured      BOOLEAN NOT NULL DEFAULT false,
    meta_title       VARCHAR(300),
    meta_description VARCHAR(500),
    tags             TEXT[],
    weight_grams     INTEGER,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by       UUID REFERENCES users(id)
);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_tags ON products USING gin(tags);
-- Full text search
ALTER TABLE products ADD COLUMN search_vector tsvector
    GENERATED ALWAYS AS (
        setweight(to_tsvector('spanish', coalesce(name, '')), 'A') ||
        setweight(to_tsvector('spanish', coalesce(description, '')), 'B') ||
        setweight(to_tsvector('spanish', coalesce(brand, '')), 'C')
    ) STORED;
CREATE INDEX idx_products_search ON products USING gin(search_vector);
```

#### product_variants

```sql
CREATE TABLE product_variants (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku           VARCHAR(100) NOT NULL UNIQUE,
    name          VARCHAR(255),                       -- "Rojo / XL"
    price         NUMERIC(12,2) NOT NULL,
    compare_price NUMERIC(12,2),                     -- precio tachado
    cost_price    NUMERIC(12,2),                     -- costo interno
    stock         INTEGER NOT NULL DEFAULT 0,
    stock_reserved INTEGER NOT NULL DEFAULT 0,       -- reservado en carritos
    low_stock_threshold INTEGER DEFAULT 5,
    weight_grams  INTEGER,
    is_active     BOOLEAN NOT NULL DEFAULT true,
    sort_order    INTEGER NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_variants_product ON product_variants(product_id);
```

#### variant_options

```sql
-- Tipos de opción: Color, Talla, Material, etc.
CREATE TABLE variant_option_types (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name       VARCHAR(100) NOT NULL,  -- "Color"
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE variant_option_values (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type_id    UUID NOT NULL REFERENCES variant_option_types(id) ON DELETE CASCADE,
    value      VARCHAR(100) NOT NULL,  -- "Rojo"
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- Relación muchos-a-muchos entre variante y sus valores de opción
CREATE TABLE variant_option_assignments (
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    value_id   UUID NOT NULL REFERENCES variant_option_values(id) ON DELETE CASCADE,
    PRIMARY KEY (variant_id, value_id)
);
```

#### product_images

```sql
CREATE TABLE product_images (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    url        TEXT NOT NULL,
    alt_text   VARCHAR(255),
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false
);
```

#### carts

```sql
CREATE TABLE carts (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id   VARCHAR(255),                        -- para guests
    status       VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE | MERGED | CONVERTED
    expires_at   TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_carts_user ON carts(user_id) WHERE status = 'ACTIVE';
CREATE INDEX idx_carts_session ON carts(session_id) WHERE status = 'ACTIVE';
```

#### cart_items

```sql
CREATE TABLE cart_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id     UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    variant_id  UUID NOT NULL REFERENCES product_variants(id),
    quantity    INTEGER NOT NULL CHECK (quantity > 0),
    unit_price  NUMERIC(12,2) NOT NULL,              -- precio al momento de agregar
    added_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (cart_id, variant_id)
);
```

#### orders

```sql
CREATE TABLE orders (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number     VARCHAR(20) NOT NULL UNIQUE,    -- ej: ORD-2024-000001
    user_id          UUID REFERENCES users(id) ON DELETE SET NULL,
    status           VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    -- Estados: PENDING | CONFIRMED | PROCESSING | SHIPPED | DELIVERED | CANCELLED | REFUNDED
    subtotal         NUMERIC(12,2) NOT NULL,
    discount_amount  NUMERIC(12,2) NOT NULL DEFAULT 0,
    shipping_cost    NUMERIC(12,2) NOT NULL DEFAULT 0,
    tax_amount       NUMERIC(12,2) NOT NULL DEFAULT 0,
    total            NUMERIC(12,2) NOT NULL,
    currency         CHAR(3) NOT NULL DEFAULT 'MXN',
    coupon_id        UUID REFERENCES coupons(id),
    shipping_address JSONB NOT NULL,                 -- snapshot de dirección
    billing_address  JSONB,
    notes            TEXT,
    shipped_at       TIMESTAMPTZ,
    delivered_at     TIMESTAMPTZ,
    cancelled_at     TIMESTAMPTZ,
    cancel_reason    TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
```

#### order_items

```sql
CREATE TABLE order_items (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    variant_id    UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    product_name  VARCHAR(500) NOT NULL,             -- snapshot del nombre
    variant_name  VARCHAR(255),                      -- snapshot de variante
    sku           VARCHAR(100) NOT NULL,
    quantity      INTEGER NOT NULL,
    unit_price    NUMERIC(12,2) NOT NULL,
    total_price   NUMERIC(12,2) NOT NULL,
    image_url     TEXT
);
```

#### payments

```sql
CREATE TABLE payments (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id          UUID NOT NULL REFERENCES orders(id),
    provider          VARCHAR(30) NOT NULL,           -- STRIPE | PAYPAL | TRANSFER
    provider_tx_id    VARCHAR(255),                   -- ID de la transacción en el proveedor
    provider_charge_id VARCHAR(255),
    amount            NUMERIC(12,2) NOT NULL,
    currency          CHAR(3) NOT NULL,
    status            VARCHAR(30) NOT NULL,           -- PENDING | SUCCEEDED | FAILED | REFUNDED
    payment_method    VARCHAR(50),                    -- card | paypal | oxxo
    card_last4        CHAR(4),
    card_brand        VARCHAR(20),
    metadata          JSONB,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_provider_tx ON payments(provider_tx_id);
```

#### coupons

```sql
CREATE TABLE coupons (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code              VARCHAR(50) NOT NULL UNIQUE,
    description       TEXT,
    type              VARCHAR(20) NOT NULL,           -- PERCENTAGE | FIXED_AMOUNT | FREE_SHIPPING
    value             NUMERIC(12,2) NOT NULL,
    min_order_amount  NUMERIC(12,2),
    max_discount      NUMERIC(12,2),                 -- tope para porcentajes
    usage_limit       INTEGER,                        -- null = ilimitado
    usage_count       INTEGER NOT NULL DEFAULT 0,
    user_limit        INTEGER DEFAULT 1,              -- usos por usuario
    is_active         BOOLEAN NOT NULL DEFAULT true,
    starts_at         TIMESTAMPTZ,
    expires_at        TIMESTAMPTZ,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### reviews

```sql
CREATE TABLE reviews (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id    UUID REFERENCES orders(id),          -- verifica compra real
    rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title       VARCHAR(255),
    body        TEXT,
    status      VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING | APPROVED | REJECTED
    helpful_count INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (product_id, user_id)                    -- una reseña por producto por usuario
);
CREATE INDEX idx_reviews_product ON reviews(product_id) WHERE status = 'APPROVED';
```

#### wishlists

```sql
CREATE TABLE wishlists (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    added_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, product_id)
);
```

#### order_status_history

```sql
CREATE TABLE order_status_history (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id   UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status     VARCHAR(30) NOT NULL,
    comment    TEXT,
    changed_by UUID REFERENCES users(id),
    changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### refresh_tokens

```sql
CREATE TABLE refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  VARCHAR(255) NOT NULL UNIQUE,
    expires_at  TIMESTAMPTZ NOT NULL,
    revoked     BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    device_info TEXT
);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
```

---

## 4. API REST — Contratos

### 4.1 Convenciones generales

- Base URL: `https://api.dominio.com/v1`
- Autenticación: `Authorization: Bearer <access_token>`
- Content-Type: `application/json`
- Paginación: cursor-based para feeds, offset para admin
- Fechas: ISO 8601 con timezone (`2024-01-15T10:30:00Z`)
- Errores: RFC 7807 (Problem Details)

```json
// Estructura de respuesta exitosa
{
  "data": { ... },
  "meta": { "page": 1, "total": 150, "limit": 20 }
}

// Estructura de error
{
  "type": "https://api.dominio.com/errors/not-found",
  "title": "Recurso no encontrado",
  "status": 404,
  "detail": "El producto con id 'abc' no existe",
  "instance": "/v1/products/abc"
}
```

### 4.2 Endpoints por módulo

#### Auth

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Registro de nuevo usuario | No |
| `POST` | `/auth/login` | Login con email/password | No |
| `POST` | `/auth/refresh` | Renovar access token | No (refresh token) |
| `POST` | `/auth/logout` | Revocar refresh token | Sí |
| `POST` | `/auth/forgot-password` | Solicitar reset de contraseña | No |
| `POST` | `/auth/reset-password` | Resetear contraseña con token | No |
| `POST` | `/auth/verify-email` | Verificar email con token | No |
| `GET` | `/auth/oauth/{provider}` | Iniciar OAuth (Google, Facebook) | No |

#### Usuarios

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/users/me` | Perfil del usuario actual | CUSTOMER |
| `PATCH` | `/users/me` | Actualizar perfil | CUSTOMER |
| `PUT` | `/users/me/password` | Cambiar contraseña | CUSTOMER |
| `GET` | `/users/me/addresses` | Listar direcciones | CUSTOMER |
| `POST` | `/users/me/addresses` | Crear dirección | CUSTOMER |
| `PUT` | `/users/me/addresses/{id}` | Actualizar dirección | CUSTOMER |
| `DELETE` | `/users/me/addresses/{id}` | Eliminar dirección | CUSTOMER |
| `GET` | `/users/me/orders` | Historial de órdenes | CUSTOMER |
| `GET` | `/users/me/wishlist` | Lista de deseos | CUSTOMER |
| `POST` | `/users/me/wishlist/{productId}` | Agregar a wishlist | CUSTOMER |
| `DELETE` | `/users/me/wishlist/{productId}` | Quitar de wishlist | CUSTOMER |

#### Catálogo (público)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/products` | Listar productos (con filtros) | No |
| `GET` | `/products/{slug}` | Detalle de producto | No |
| `GET` | `/products/{slug}/reviews` | Reseñas del producto | No |
| `POST` | `/products/{slug}/reviews` | Crear reseña | CUSTOMER |
| `GET` | `/categories` | Árbol de categorías | No |
| `GET` | `/categories/{slug}/products` | Productos de categoría | No |
| `GET` | `/search` | Búsqueda full-text | No |

**Query params para `GET /products`:**

```
?q=zapatillas            búsqueda de texto
&category=calzado        slug de categoría
&brand=nike,adidas       marcas (separadas por coma)
&min_price=500
&max_price=2000
&in_stock=true
&sort=price_asc|price_desc|newest|bestseller|rating
&page=1
&limit=24
&tags=nuevo,oferta
```

#### Carrito

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/cart` | Obtener carrito actual | No (sesión o token) |
| `POST` | `/cart/items` | Agregar ítem | No |
| `PATCH` | `/cart/items/{variantId}` | Actualizar cantidad | No |
| `DELETE` | `/cart/items/{variantId}` | Eliminar ítem | No |
| `DELETE` | `/cart` | Vaciar carrito | No |
| `POST` | `/cart/coupon` | Aplicar cupón | No |
| `DELETE` | `/cart/coupon` | Quitar cupón | No |

#### Checkout y Órdenes

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/checkout/validate` | Validar disponibilidad antes de pagar | No |
| `POST` | `/checkout/shipping-rates` | Obtener opciones de envío | No |
| `POST` | `/orders` | Crear orden | CUSTOMER |
| `GET` | `/orders/{orderNumber}` | Detalle de orden | CUSTOMER |
| `POST` | `/orders/{orderNumber}/cancel` | Cancelar orden | CUSTOMER |

#### Pagos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/payments/intent` | Crear PaymentIntent (Stripe) | CUSTOMER |
| `POST` | `/payments/confirm` | Confirmar pago | CUSTOMER |
| `POST` | `/webhooks/stripe` | Webhook de Stripe | No (firmado) |
| `POST` | `/webhooks/paypal` | Webhook de PayPal | No (firmado) |

#### Admin — Productos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/admin/products` | Listar con filtros avanzados | ADMIN |
| `POST` | `/admin/products` | Crear producto | ADMIN |
| `GET` | `/admin/products/{id}` | Detalle completo | ADMIN |
| `PUT` | `/admin/products/{id}` | Actualizar producto | ADMIN |
| `DELETE` | `/admin/products/{id}` | Archivar producto | ADMIN |
| `POST` | `/admin/products/{id}/images` | Subir imágenes | ADMIN |
| `DELETE` | `/admin/products/{id}/images/{imgId}` | Eliminar imagen | ADMIN |
| `PATCH` | `/admin/products/{id}/variants/{varId}/stock` | Ajustar stock | ADMIN |

#### Admin — Órdenes

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/admin/orders` | Listar órdenes | ADMIN |
| `GET` | `/admin/orders/{id}` | Detalle | ADMIN |
| `PATCH` | `/admin/orders/{id}/status` | Cambiar estado | ADMIN |
| `POST` | `/admin/orders/{id}/refund` | Procesar reembolso | ADMIN |

#### Admin — Usuarios

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/admin/users` | Listar usuarios | ADMIN |
| `GET` | `/admin/users/{id}` | Detalle de usuario | ADMIN |
| `PATCH` | `/admin/users/{id}/status` | Suspender/activar | ADMIN |

#### Admin — Dashboard

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/admin/dashboard/summary` | KPIs del periodo | ADMIN |
| `GET` | `/admin/dashboard/revenue` | Gráfica de ingresos | ADMIN |
| `GET` | `/admin/dashboard/top-products` | Productos más vendidos | ADMIN |

---

## 5. Módulos del backend

### 5.1 Estructura de paquetes

```
com.ecommerce
├── config/
│   ├── SecurityConfig.java
│   ├── RedisConfig.java
│   ├── OpenApiConfig.java
│   └── AwsConfig.java
├── common/
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java
│   │   ├── ResourceNotFoundException.java
│   │   ├── BusinessException.java
│   │   └── ValidationException.java
│   ├── dto/
│   │   ├── PageResponse.java
│   │   └── ApiResponse.java
│   └── util/
│       ├── SlugUtil.java
│       └── OrderNumberGenerator.java
├── auth/
│   ├── controller/AuthController.java
│   ├── service/AuthService.java
│   ├── service/JwtService.java
│   ├── dto/ ...
│   └── entity/ ...
├── user/
│   ├── controller/ ...
│   ├── service/ ...
│   ├── repository/ ...
│   └── entity/ ...
├── catalog/
│   ├── controller/ ...
│   ├── service/ ...
│   ├── repository/ ...
│   └── entity/ ...
├── cart/
│   ├── controller/ ...
│   ├── service/CartService.java        -- lógica en Redis + DB
│   └── ...
├── order/
│   ├── controller/ ...
│   ├── service/OrderService.java
│   ├── service/OrderNumberService.java
│   └── ...
├── payment/
│   ├── controller/ ...
│   ├── service/PaymentService.java
│   ├── service/StripeService.java
│   ├── service/PayPalService.java
│   └── webhook/ ...
├── search/
│   ├── controller/SearchController.java
│   └── service/SearchService.java
├── media/
│   ├── controller/MediaController.java
│   └── service/S3Service.java
├── notification/
│   ├── service/EmailService.java
│   └── template/ ...
└── admin/
    ├── controller/ ...
    └── service/ ...
```

### 5.2 Servicio de carrito

El carrito se mantiene en Redis para lecturas rápidas y se sincroniza a PostgreSQL para persistencia.

```java
// CartService — lógica clave
public CartDto getCart(String sessionId, UUID userId) {
    String key = userId != null ? "cart:user:" + userId : "cart:session:" + sessionId;
    // 1. Buscar en Redis
    // 2. Si no existe, cargar de DB
    // 3. Validar que variantes siguen activas y con stock
    // 4. Recalcular precios actuales
}

public void mergeGuestCart(String sessionId, UUID userId) {
    // Al hacer login: tomar items del carrito de sesión y fusionarlos
    // con el carrito del usuario (priorizando el usuario en conflictos)
}

public CartDto addItem(String key, UUID variantId, int quantity) {
    // 1. Verificar que variante existe y está activa
    // 2. Verificar stock disponible (stock - stock_reserved >= quantity)
    // 3. Agregar/incrementar en Redis
    // 4. Persistir en DB de forma async
}
```

### 5.3 Servicio de órdenes

```java
// OrderService — flujo de creación
@Transactional
public Order createOrder(CreateOrderRequest request, UUID userId) {
    // 1. Validar carrito no vacío
    // 2. Verificar stock de cada variante (select for update)
    // 3. Calcular totales (subtotal + envío + impuesto - descuento)
    // 4. Reservar stock (stock_reserved += quantity)
    // 5. Crear registro de orden con status PENDING
    // 6. Crear order_items con snapshots de precios
    // 7. Registrar en order_status_history
    // 8. Publicar evento OrderCreated (para email, etc.)
    // 9. Limpiar carrito
    // 10. Retornar orden con datos de pago
}

@Transactional
public void confirmPayment(String providerTxId, PaymentStatus status) {
    // Llamado desde el webhook
    // 1. Buscar payment por provider_tx_id
    // 2. Actualizar status del payment
    // 3. Si SUCCEEDED: actualizar orden a CONFIRMED, descontar stock real
    // 4. Si FAILED: liberar stock_reserved, marcar orden como FAILED
    // 5. Enviar email de confirmación o fallo
}
```

### 5.4 Generación de número de orden

```java
// Formato: ORD-YYYY-XXXXXX (cero-padded, autoincremental por año)
// Usar sequence de PostgreSQL por año para garantizar unicidad sin locks
CREATE SEQUENCE IF NOT EXISTS order_seq_2024 START 1;
```

### 5.5 Manejo de excepciones

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleNotFound(ResourceNotFoundException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        pd.setType(URI.create("https://api.dominio.com/errors/not-found"));
        return pd;
    }
    // ... ConstraintViolationException, AccessDeniedException, etc.
}
```

---

## 6. Módulos del frontend

### 6.1 Estructura de carpetas (Next.js App Router)

```
src/
├── app/
│   ├── (store)/                         -- Layout de tienda
│   │   ├── layout.tsx
│   │   ├── page.tsx                     -- Home
│   │   ├── products/
│   │   │   ├── page.tsx                 -- Catálogo
│   │   │   └── [slug]/
│   │   │       └── page.tsx             -- Detalle de producto
│   │   ├── categories/
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── search/
│   │   │   └── page.tsx
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   ├── page.tsx                 -- Datos de envío
│   │   │   ├── payment/page.tsx
│   │   │   └── confirmation/page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [orderNumber]/page.tsx
│   │   └── wishlist/page.tsx
│   ├── (auth)/                          -- Layout sin navbar
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   └── admin/                           -- Panel de administración
│       ├── layout.tsx
│       ├── page.tsx                     -- Dashboard
│       ├── products/
│       │   ├── page.tsx
│       │   ├── new/page.tsx
│       │   └── [id]/page.tsx
│       ├── orders/
│       │   ├── page.tsx
│       │   └── [id]/page.tsx
│       └── users/page.tsx
├── components/
│   ├── ui/                              -- shadcn/ui base components
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── CartDrawer.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── VariantSelector.tsx
│   │   ├── ImageGallery.tsx
│   │   ├── ReviewList.tsx
│   │   └── ReviewForm.tsx
│   ├── cart/
│   │   ├── CartItem.tsx
│   │   └── CartSummary.tsx
│   ├── checkout/
│   │   ├── AddressForm.tsx
│   │   ├── ShippingSelector.tsx
│   │   └── PaymentForm.tsx             -- Stripe Elements
│   └── admin/
│       ├── ProductForm.tsx
│       ├── OrderTable.tsx
│       └── DashboardStats.tsx
├── hooks/
│   ├── useCart.ts
│   ├── useAuth.ts
│   ├── useWishlist.ts
│   └── useCheckout.ts
├── stores/
│   ├── cartStore.ts                     -- Zustand
│   ├── authStore.ts
│   └── uiStore.ts
├── lib/
│   ├── api/
│   │   ├── client.ts                    -- Axios instance con interceptors
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── cart.ts
│   │   ├── orders.ts
│   │   └── admin.ts
│   ├── validations/
│   │   ├── auth.ts                      -- Zod schemas
│   │   ├── checkout.ts
│   │   └── product.ts
│   └── utils/
│       ├── formatPrice.ts
│       ├── formatDate.ts
│       └── cn.ts
└── types/
    ├── product.ts
    ├── cart.ts
    ├── order.ts
    └── user.ts
```

### 6.2 Gestión de estado

**Zustand — cartStore.ts**

```typescript
interface CartStore {
  items: CartItem[];
  coupon: Coupon | null;
  isOpen: boolean;
  // Acciones
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  clearCart: () => void;
  // Computed
  totalItems: () => number;
  subtotal: () => number;
  total: () => number;
}
```

**TanStack Query — sincronización con el servidor**

```typescript
// Invalidar carrito tras mutación
const { mutate: addToCart } = useMutation({
  mutationFn: cartApi.addItem,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
});
```

### 6.3 Renderizado (Next.js)

| Página | Estrategia | Razón |
|--------|-----------|-------|
| Home | ISR (revalidar cada 60s) | Contenido dinámico pero no crítico |
| Catálogo | SSR | Filtros en URL, SEO |
| Detalle producto | ISR (revalidar cada 30s) | SEO crítico, precio puede cambiar |
| Carrito | CSR | Datos del usuario, no indexable |
| Checkout | CSR | Datos sensibles |
| Admin | CSR | No indexable, detrás de auth |

### 6.4 Interceptor de Axios

```typescript
// lib/api/client.ts
const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      await useAuthStore.getState().refreshToken();
      return api(error.config);
    }
    return Promise.reject(error);
  }
);
```

---

## 7. Autenticación y autorización

### 7.1 Flujo JWT

```
Login:
  POST /auth/login → { access_token (15min), refresh_token (30 días) }

Refresh:
  POST /auth/refresh con refresh_token en HttpOnly cookie
  → nuevo access_token

Logout:
  POST /auth/logout → revoca refresh_token en DB, limpia cookie
```

### 7.2 Configuración de tokens

| Token | Expiración | Almacenamiento |
|-------|-----------|---------------|
| Access token | 15 minutos | Memoria (Zustand) — NO localStorage |
| Refresh token | 30 días | HttpOnly, Secure, SameSite=Strict cookie |

### 7.3 Filtros de Spring Security

```java
SecurityFilterChain:
  .csrf().disable()  // API REST, CSRF no aplica
  .sessionManagement().stateless()
  .addFilterBefore(JwtAuthFilter, UsernamePasswordAuthenticationFilter)
  .authorizeHttpRequests(auth -> auth
    .requestMatchers("/v1/auth/**", "/v1/products/**", "/v1/categories/**",
                     "/v1/search", "/v1/cart/**", "/v1/webhooks/**").permitAll()
    .requestMatchers("/v1/admin/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
    .anyRequest().authenticated()
  )
```

### 7.4 OAuth2 (Google)

```java
// Flujo: frontend redirige a /auth/oauth/google
// Spring Security maneja el callback
// Al obtener el perfil de Google:
//   1. Buscar usuario por email en DB
//   2. Si no existe: crear con provider=GOOGLE, email ya verificado
//   3. Si existe con LOCAL: vincular cuenta o retornar error con mensaje
//   4. Generar JWT y redirigir a frontend con token en query param (uso único, 1 min exp)
```

---

## 8. Pagos

### 8.1 Flujo con Stripe

```
1. Frontend hace POST /payments/intent con { orderId }
2. Backend crea PaymentIntent en Stripe, guarda payment en DB con status=PENDING
3. Backend retorna { clientSecret } al frontend
4. Frontend usa Stripe.js para mostrar formulario de tarjeta
5. Usuario confirma pago en frontend (Stripe procesa)
6. Stripe envía webhook payment_intent.succeeded a /webhooks/stripe
7. Backend verifica firma del webhook (Stripe-Signature header)
8. Backend actualiza order a CONFIRMED y payment a SUCCEEDED
9. Backend envía email de confirmación
10. Frontend recibe confirmación (polling o Stripe webhook JS)
```

### 8.2 Verificación de webhooks

```java
// NUNCA confiar solo en el estado que llega en el body
// SIEMPRE verificar la firma del webhook
String payload = request.body();
String sigHeader = request.header("Stripe-Signature");
Event event = Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);
// Si lanza excepción: retornar 400 Bad Request
```

### 8.3 Idempotencia de webhooks

```java
// Stripe puede enviar el mismo evento más de una vez
// Usar event.id como idempotency key
if (processedWebhooks.contains(event.getId())) return;
// Guardar event.getId() en Redis con TTL de 24h tras procesarlo
```

---

## 9. Gestión de archivos e imágenes

### 9.1 Flujo de subida

```
1. Admin solicita URL prefirmada: POST /admin/products/{id}/images/upload-url
   Backend genera presigned URL de S3 (válida 10 min)
2. Frontend sube directamente a S3 usando la presigned URL (no pasa por el backend)
3. Frontend notifica al backend: POST /admin/products/{id}/images con { s3Key, altText, sortOrder }
4. Backend guarda referencia en DB y retorna image_url pública via CDN
```

### 9.2 Procesamiento de imágenes

```java
// Al registrar una imagen, disparar procesamiento async:
// - Validar formato (JPEG, PNG, WebP, máx 10MB)
// - Generar variantes: thumbnail (150x150), medium (600x600), large (1200x1200)
// - Convertir a WebP para optimización
// - Guardar todas las variantes en S3
// Usar: AWS Lambda o un job en Spring @Async + Thread Pool
```

### 9.3 Nombres de keys en S3

```
products/{productId}/original/{uuid}.webp
products/{productId}/thumbnail/{uuid}.webp
products/{productId}/medium/{uuid}.webp
products/{productId}/large/{uuid}.webp
```

---

## 10. Notificaciones

### 10.1 Emails transaccionales

| Evento | Template | Variables |
|--------|---------|----------|
| Bienvenida | `welcome` | name, verificationUrl |
| Verificación de email | `verify-email` | name, verificationUrl |
| Reset de contraseña | `reset-password` | name, resetUrl, expiresIn |
| Orden confirmada | `order-confirmed` | orderNumber, items, total, shippingAddress |
| Orden enviada | `order-shipped` | orderNumber, trackingNumber, trackingUrl |
| Orden entregada | `order-delivered` | orderNumber |
| Orden cancelada | `order-cancelled` | orderNumber, reason, refundInfo |
| Reseña aprobada | `review-approved` | productName |
| Stock bajo (admin) | `low-stock-alert` | productName, sku, currentStock |

### 10.2 Implementación

```java
// EmailService usa plantillas Thymeleaf + AWS SES o Resend
// Envíos asíncronos con @Async para no bloquear el hilo principal
// Cola de reintentos: si el envío falla, reintento con backoff exponencial (1, 5, 15 min)
// Logging de emails enviados en tabla email_log
```

---

## 11. Búsqueda y filtros

### 11.1 Búsqueda full-text en PostgreSQL

```sql
-- Búsqueda con ranking
SELECT p.*, ts_rank(p.search_vector, query) AS rank
FROM products p, to_tsquery('spanish', 'zapatill:* & corriendo:*') query
WHERE p.status = 'ACTIVE'
  AND p.search_vector @@ query
ORDER BY rank DESC, p.is_featured DESC
LIMIT 24;
```

### 11.2 Filtros y facetas

```java
// SearchService construye dinámicamente la consulta JPQL/SQL
// Filtros disponibles:
// - Texto (full-text search)
// - Categoría (con sub-categorías via recursive CTE)
// - Rango de precio
// - Marcas
// - Tags
// - En stock
// - Rating mínimo

// Facetas (para la UI de filtros laterales):
// - Contar productos por marca
// - Contar productos por rango de precio
// - Contar por categoría
// Estas se calculan con COUNT(*) en la misma consulta base filtrada
```

---

## 12. Caché y rendimiento

### 12.1 Estrategia de caché con Redis

| Recurso | TTL | Invalidación |
|---------|-----|-------------|
| Catálogo de categorías | 1 hora | Al modificar categoría |
| Producto por slug | 30 min | Al actualizar producto |
| Lista de productos (por página) | 5 min | Al actualizar cualquier producto |
| Carrito de usuario | 7 días | Al modificar carrito |
| Sesión de carrito (guest) | 30 días | Al convertirse en orden |
| Tasa de cambio de divisas | 1 hora | Cron automático |

```java
// Usar Spring Cache abstraction con Redis backend
@Cacheable(value = "products", key = "#slug")
public ProductDto getProductBySlug(String slug) { ... }

@CacheEvict(value = "products", key = "#result.slug")
public ProductDto updateProduct(UUID id, UpdateProductRequest req) { ... }
```

### 12.2 Optimizaciones de base de datos

- Todas las relaciones tienen índices definidos
- Queries N+1 prevenidas con `JOIN FETCH` o `@EntityGraph`
- Paginación via `Pageable` con límites máximos (máx 100 por página)
- Read replicas para queries de admin y reportes pesados
- `select for update skip locked` para reservas de stock concurrentes

### 12.3 Optimizaciones de frontend

- Imágenes con `next/image` (lazy loading, srcset automático, WebP)
- Código splitting automático por ruta (Next.js)
- Prefetch de rutas probables (`router.prefetch`)
- Skeleton screens para estados de carga
- Optimistic updates en carrito (respuesta inmediata)

---

## 13. Seguridad

### 13.1 Lista de controles

| Control | Implementación |
|---------|--------------|
| Autenticación | JWT + Refresh Token en HttpOnly Cookie |
| Autorización | RBAC con Spring Security |
| HTTPS | TLS 1.3 obligatorio, HSTS |
| Rate limiting | Spring Rate Limiter + Redis (por IP y por usuario) |
| SQL Injection | JPA Parameterized Queries, nunca concatenación |
| XSS | Sanitización de input en backend, CSP headers |
| CSRF | Tokens para formularios con sesión (no aplica a API REST) |
| Password hashing | BCrypt (strength 12) |
| Datos sensibles | Nunca loguear tokens, contraseñas ni datos de tarjeta |
| Webhook security | Verificación de firma HMAC (Stripe-Signature) |
| CORS | Allowlist explícita de dominios |
| PCI DSS | Nunca almacenar datos de tarjeta (Stripe tokeniza) |
| File uploads | Validar tipo MIME y tamaño, upload directo a S3 |
| Secretos | Variables de entorno, nunca en código o git |

### 13.2 Rate limiting

```java
// Por endpoint en Spring:
// - POST /auth/login: 5 req/min por IP
// - POST /auth/register: 3 req/min por IP
// - POST /auth/forgot-password: 3 req/min por IP
// - GET /products: 200 req/min por IP
// - POST /cart/items: 30 req/min por usuario
```

### 13.3 Headers de seguridad

```nginx
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "DENY";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Content-Security-Policy "default-src 'self'; img-src 'self' https://cdn.dominio.com; ...";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
```

---

## 14. Infraestructura y despliegue

### 14.1 Docker

**Dockerfile — Backend**

```dockerfile
FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app
RUN addgroup -S spring && adduser -S spring -G spring
COPY --chown=spring:spring target/*.jar app.jar
USER spring
EXPOSE 8080
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
```

**Dockerfile — Frontend**

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### 14.2 Docker Compose (desarrollo)

```yaml
version: '3.9'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ecommerce
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/ecommerce
      SPRING_REDIS_HOST: redis
      JWT_SECRET: ${JWT_SECRET}
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
    ports:
      - "8080:8080"
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    environment:
      NEXT_PUBLIC_API_URL: http://backend:8080/v1
      NEXT_PUBLIC_STRIPE_KEY: ${STRIPE_PUBLIC_KEY}
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 14.3 Variables de entorno

**Backend — application.properties (no commitear valores reales)**

```properties
# DB
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}

# Redis
spring.data.redis.host=${REDIS_HOST}
spring.data.redis.password=${REDIS_PASSWORD}

# JWT
jwt.secret=${JWT_SECRET}               # 512-bit random string
jwt.access-expiration=900000           # 15 min en ms
jwt.refresh-expiration=2592000000      # 30 días en ms

# Stripe
stripe.secret-key=${STRIPE_SECRET_KEY}
stripe.webhook-secret=${STRIPE_WEBHOOK_SECRET}

# AWS S3
aws.s3.bucket=${S3_BUCKET}
aws.s3.region=${AWS_REGION}
aws.cloudfront.domain=${CDN_DOMAIN}

# Email
email.from=noreply@dominio.com
resend.api-key=${RESEND_API_KEY}

# App
app.frontend-url=${FRONTEND_URL}
```

### 14.4 CI/CD con GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env: { POSTGRES_PASSWORD: test }
      redis:
        image: redis:7
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { java-version: '21', distribution: 'temurin' }
      - run: mvn verify

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci && npm test

  build-and-push:
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build & push Docker images
        # Login a ECR, docker build, docker push
      - name: Deploy to ECS / K8s
        # Actualizar task definition o rollout de deployment
```

### 14.5 Migraciones con Flyway

```
src/main/resources/db/migration/
  V1__create_users_table.sql
  V2__create_categories_products.sql
  V3__create_cart_orders.sql
  V4__create_payments_coupons.sql
  V5__create_reviews_wishlists.sql
  V6__add_search_vector_index.sql
```

---

## 15. Observabilidad

### 15.1 Logging

```java
// Usar SLF4J + Logback
// Formato JSON en producción para ingesta en ELK/Loki:
// { "timestamp": "...", "level": "INFO", "logger": "...", "message": "...",
//   "traceId": "...", "spanId": "...", "userId": "...", "orderId": "..." }

// NUNCA loguear:
// - Passwords, tokens JWT
// - Números de tarjeta, CVV
// - Datos personales sensibles (usar máscaras)
```

### 15.2 Métricas con Micrometer

```java
// Métricas clave a instrumentar:
// - http.server.requests (latencia, errores por endpoint)
// - orders.created.total (counter)
// - orders.total.amount (distribution summary)
// - cart.items.added (counter)
// - payment.succeeded / payment.failed (counters)
// - stock.low.alert (gauge: productos con stock < threshold)
// - cache.hit.rate / cache.miss.rate
```

### 15.3 Alertas (Grafana)

| Alerta | Condición | Severidad |
|--------|----------|----------|
| Error rate alto | > 1% de requests en 5 min | Critical |
| Latencia alta | P95 > 1s en 5 min | Warning |
| Stock agotado | stock = 0 en producto activo | Warning |
| Payment failures | > 5 fallos en 10 min | Critical |
| DB connections | > 80% del pool | Warning |
| Redis down | No responde | Critical |

### 15.4 Health checks

```java
// Spring Actuator endpoints:
// GET /actuator/health → UP / DOWN (para load balancer)
// GET /actuator/health/db → estado PostgreSQL
// GET /actuator/health/redis → estado Redis
// GET /actuator/metrics → métricas para Prometheus
// GET /actuator/info → versión de la app
```

---

## 16. Testing

### 16.1 Backend

| Tipo | Herramienta | Cobertura objetivo |
|------|------------|-------------------|
| Unit tests | JUnit 5 + Mockito | Servicios, utilidades |
| Integration tests | @SpringBootTest + Testcontainers | Repositorios, flujos completos |
| API tests | MockMvc / REST Assured | Todos los endpoints |
| Contract tests | Spring Cloud Contract | Contratos de API |

**Ejemplo de integration test con Testcontainers:**

```java
@SpringBootTest
@Testcontainers
class OrderServiceIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Container
    static GenericContainer<?> redis = new GenericContainer<>("redis:7-alpine").withExposedPorts(6379);

    @Test
    void createOrder_shouldReserveStock_andReturnOrder() {
        // Arrange: crear usuario, producto con stock 5, carrito con 2 unidades
        // Act: llamar a orderService.createOrder()
        // Assert: orden creada con status PENDING, stock_reserved = 2, stock = 5 (sin cambio aún)
    }
}
```

### 16.2 Frontend

| Tipo | Herramienta | Alcance |
|------|------------|---------|
| Unit tests | Vitest + Testing Library | Componentes, hooks, utilidades |
| E2E tests | Playwright | Flujos críticos: login, compra, checkout |
| Visual regression | Playwright screenshots | Páginas principales |

**Flujos E2E obligatorios:**

1. Registro y verificación de email
2. Login y logout
3. Agregar al carrito y checkout completo (con tarjeta de prueba de Stripe)
4. Ver historial de órdenes
5. Admin: crear producto y verificar en tienda

---

## 17. Estructura de carpetas del repositorio

```
ecommerce/
├── backend/                             -- Proyecto Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/ecommerce/
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       ├── application-dev.properties
│   │   │       ├── application-prod.properties
│   │   │       ├── db/migration/        -- Flyway
│   │   │       └── templates/email/     -- Thymeleaf
│   │   └── test/
│   ├── pom.xml
│   └── Dockerfile
├── frontend/                            -- Proyecto Next.js
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── Dockerfile
├── infrastructure/
│   ├── docker-compose.yml               -- Desarrollo local
│   ├── docker-compose.prod.yml          -- Producción
│   ├── nginx/
│   │   └── nginx.conf
│   └── k8s/                             -- Manifests de Kubernetes
│       ├── backend-deployment.yaml
│       ├── frontend-deployment.yaml
│       ├── ingress.yaml
│       └── configmap.yaml
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── docs/
│   ├── SPEC.md                          -- Este archivo
│   ├── API.md                           -- OpenAPI exportado
│   └── ADR/                             -- Architecture Decision Records
│       ├── 001-jwt-strategy.md
│       └── 002-cart-redis.md
└── README.md
```

---

## 18. Roadmap de implementación

### Fase 1 — Fundamentos (semanas 1–3)

- [x] Setup del repositorio monorepo, Docker Compose de desarrollo
- [x] Schema de base de datos + migraciones Flyway iniciales
- [ ] Auth: registro, login, JWT, refresh token, OAuth Google
- [x] CRUD de usuarios y direcciones
- [x] CRUD de categorías y productos (sin variantes aún)
- [x] Subida de imágenes a S3
- [x] Setup de Next.js con Tailwind, shadcn/ui, Zustand, TanStack Query

### Fase 2 — Catálogo y carrito (semanas 4–5)

- [ ] Variantes de producto con opciones
- [ ] Inventario por variante
- [ ] Catálogo público con filtros y paginación
- [ ] Búsqueda full-text
- [ ] Carrito en Redis con fusión guest→user
- [ ] Páginas de catálogo, detalle de producto y carrito en frontend
- [ ] Wishlist

### Fase 3 — Checkout y pagos (semanas 6–7)

- [ ] Flujo de checkout (dirección → envío → pago)
- [ ] Integración con Stripe (PaymentIntent + webhook)
- [ ] Creación de órdenes con reserva de stock
- [ ] Sistema de cupones
- [ ] Emails transaccionales (confirmación de orden, etc.)
- [ ] Página de confirmación y seguimiento de orden

### Fase 4 — Panel de administración (semanas 8–9)

- [ ] Dashboard con métricas clave
- [ ] Gestión de productos y variantes
- [ ] Gestión de órdenes y cambio de estados
- [ ] Gestión de usuarios
- [ ] Gestión de cupones
- [ ] Moderación de reseñas

### Fase 5 — Producción (semanas 10–11)

- [ ] Setup de infraestructura en cloud (ECS o K8s)
- [ ] CDN para assets y imágenes
- [ ] CI/CD completo con GitHub Actions
- [ ] Observabilidad: Prometheus, Grafana, logs centralizados
- [ ] Tests E2E con Playwright
- [ ] Auditoría de seguridad (OWASP ZAP scan)
- [ ] Load testing (k6 o JMeter)
- [ ] Documentación de API con Swagger UI

### Fase 6 — Mejoras post-lanzamiento

- [ ] Notificaciones push (Firebase Cloud Messaging)
- [ ] Integración de PayPal como método de pago secundario
- [ ] Programa de reseñas con emails post-entrega
- [ ] Recomendaciones de productos relacionados
- [ ] Soporte multimoneda
- [ ] App móvil (React Native consumiendo la misma API)

---

*Documento mantenido por el equipo de desarrollo. Actualizar ante cualquier cambio de arquitectura significativo y registrar la decisión en `/docs/ADR/`.*
