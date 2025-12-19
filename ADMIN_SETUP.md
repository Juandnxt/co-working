# Configuración del Sistema de Administración

Este documento explica cómo configurar y usar el sistema de administración del coworking.

## 🚀 Pasos de Configuración

### 1. Actualizar la Base de Datos

Primero, necesitas agregar el campo `role` a la tabla `User` y crear las nuevas tablas:

```sql
-- Agregar campo role a la tabla User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Crear tabla de Suscripciones
CREATE TABLE IF NOT EXISTS "Subscription" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    plan TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    "startDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP,
    amount DOUBLE PRECISION,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- Crear tabla de Espacios
CREATE TABLE IF NOT EXISTS "Space" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    capacity INTEGER,
    price DOUBLE PRECISION,
    available BOOLEAN DEFAULT true,
    description TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de Horarios
CREATE TABLE IF NOT EXISTS "Schedule" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "spaceId" TEXT,
    "dayOfWeek" INTEGER,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "isOpen" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear triggers para updatedAt
CREATE TRIGGER update_subscription_updated_at BEFORE UPDATE ON "Subscription"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_space_updated_at BEFORE UPDATE ON "Space"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedule_updated_at BEFORE UPDATE ON "Schedule"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

Ejecuta este SQL en el editor SQL de Supabase.

### 2. Crear un Usuario Administrador

Tienes dos opciones:

#### Opción A: Usar el Script (Recomendado)

```bash
npx tsx scripts/create-admin.ts admin@coworking.com tu_password "Nombre Admin"
```

O simplemente:
```bash
npx tsx scripts/create-admin.ts
```

Esto creará un usuario con:
- Email: `admin@coworking.com`
- Password: `admin123`
- Nombre: `Administrador`

#### Opción B: SQL Directo

```sql
-- Primero, hashea la contraseña (usa bcrypt)
-- Luego inserta el usuario:

INSERT INTO "User" (id, email, password, name, role, "emailVerified", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'admin@coworking.com',
  '$2a$10$TuHashAqui', -- Reemplaza con el hash bcrypt de tu contraseña
  'Administrador',
  'admin',
  NOW(),
  NOW(),
  NOW()
);
```

### 3. Iniciar Sesión como Administrador

1. Ve a `/login` o `/[locale]/login`
2. Ingresa las credenciales del administrador
3. Serás redirigido automáticamente a `/admin/dashboard` o `/[locale]/admin/dashboard`

## 📋 Funcionalidades del Dashboard

El dashboard de administración incluye:

### Dashboard Principal
- Estadísticas generales
- Total de reservas
- Suscripciones activas
- Espacios disponibles
- Ingresos totales

### Gestión de Reservas
- Ver todas las reservas
- Ver detalles de cada reserva (usuario, fecha, hora, estado, pago)
- Filtrar por estado

### Gestión de Suscripciones
- Ver todas las suscripciones
- Ver detalles (usuario, plan, estado, fechas, monto)
- **Eliminar suscripciones**

### Gestión de Espacios
- Ver todos los espacios disponibles
- Ver espacios ocupados
- Marcar espacios como disponibles/ocupados
- Ver información de cada espacio (tipo, capacidad, precio)

### Gestión de Horarios
- Ver horarios configurados
- Ver horarios por día de la semana
- Ver horarios por espacio

### Configuración
- Panel de configuración general del sistema

## 🔒 Seguridad

- Solo usuarios con `role = 'admin'` pueden acceder al dashboard
- Las APIs de administración verifican el rol antes de procesar solicitudes
- Si un usuario no admin intenta acceder, será redirigido a la página principal

## 🛠️ APIs Disponibles

- `GET /api/admin/stats` - Obtener estadísticas
- `GET /api/admin/bookings` - Obtener todas las reservas
- `GET /api/admin/subscriptions` - Obtener todas las suscripciones
- `DELETE /api/admin/subscriptions?id=xxx` - Eliminar suscripción
- `GET /api/admin/spaces` - Obtener todos los espacios
- `PUT /api/admin/spaces` - Actualizar espacio
- `GET /api/admin/schedule` - Obtener horarios
- `POST /api/admin/schedule` - Crear horario
- `PUT /api/admin/schedule` - Actualizar horario

## 📝 Notas

- Asegúrate de cambiar la contraseña del administrador después del primer login
- Los usuarios regulares no pueden acceder al dashboard de administración
- Todas las operaciones están protegidas por verificación de rol

