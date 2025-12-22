/**
 * Script para crear un usuario administrador
 * Ejecutar con: npx tsx scripts/create-admin.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import bcrypt from 'bcryptjs';

// Cargar variables de entorno desde .env ANTES de importar db
try {
  const envPath = join(process.cwd(), '.env');
  const envFile = readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
        process.env[key.trim()] = value;
      }
    }
  });
  console.log('✅ Variables de entorno cargadas desde .env');
} catch (error) {
  console.warn('⚠️  No se pudo cargar .env, usando variables de entorno del sistema');
  const err = error as NodeJS.ErrnoException;
  if (err.code === 'ENOENT') {
    console.error('❌ Archivo .env no encontrado. Asegúrate de que existe en la raíz del proyecto.');
  }
}

// Verificar que SUPABASE_URL esté configurada
if (!process.env.SUPABASE_URL) {
  console.error('❌ Error: SUPABASE_URL no está configurada');
  console.error('   Asegúrate de que tu archivo .env contiene: SUPABASE_URL="tu_connection_string"');
  process.exit(1);
}

// Importar después de cargar las variables de entorno (usando import dinámico)
async function createAdmin() {
  const { default: sql, generateId } = await import('../lib/db');
  const email = process.argv[2] || 'admin@coworking.com';
  const password = process.argv[3] || 'admin123';
  const name = process.argv[4] || 'Administrador';

  try {
    console.log('🔐 Creando usuario administrador...');
    console.log(`Email: ${email}`);
    console.log(`Nombre: ${name}`);

    // Verificar si el usuario ya existe
    const [existingUser] = await sql`
      SELECT id, email, role FROM "User" WHERE email = ${email}
    `;

    if (existingUser) {
      // Actualizar a admin si ya existe
      await sql`
        UPDATE "User"
        SET role = 'admin', "updatedAt" = NOW()
        WHERE email = ${email}
      `;
      console.log('✅ Usuario existente actualizado a administrador');
      return;
    }

    // Crear nuevo usuario admin
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = generateId();

    await sql`
      INSERT INTO "User" (id, email, password, name, role, "emailVerified", "createdAt", "updatedAt")
      VALUES (${userId}, ${email}, ${hashedPassword}, ${name}, 'admin', NOW(), NOW(), NOW())
    `;

    console.log('✅ Usuario administrador creado exitosamente!');
    console.log('\n📋 Credenciales de acceso:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\n⚠️  IMPORTANTE: Cambia la contraseña después del primer login');
  } catch (error) {
    console.error('❌ Error creando usuario administrador:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Ejecutar la función
createAdmin().catch((error) => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});

