// Test database connection
// Run this to verify your database connection is working
// Usage: node -r ts-node/register lib/test-db.ts

import sql from './db';

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('Connection string:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Not set');
    
    // Test basic query
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`;
    console.log('\n✅ Database connection successful!');
    console.log('Current time:', result[0].current_time);
    console.log('PostgreSQL version:', result[0].pg_version?.substring(0, 50));
    
    // Check if tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('User', 'Session', 'VerificationCode', 'Booking')
      ORDER BY table_name
    `;
    
    const typedTables = tables as unknown as Array<{ table_name: string }>;

    console.log('\n📊 Tables found:');
    if (typedTables.length === 0) {
      console.log('❌ No tables found! You need to run database/schema.sql in Supabase SQL Editor');
      console.log('   Go to: Supabase Dashboard > SQL Editor > New Query');
      console.log('   Copy and paste the contents of database/schema.sql');
    } else {
      for (const table of typedTables) {
        console.log(`  ✅ ${table.table_name}`);
      }
    }
    
    // Test User table structure
    if (typedTables.some((t) => t.table_name === 'User')) {
      const userColumns = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'User' 
        AND table_schema = 'public'
        ORDER BY ordinal_position
      `;
      console.log('\n📋 User table columns:');
      const typedUserColumns = userColumns as unknown as Array<{ column_name: string; data_type: string }>;
      for (const col of typedUserColumns) {
        console.log(`  - ${col.column_name} (${col.data_type})`);
      }
      
      // Try to count users
      const userCount = await sql`SELECT COUNT(*) as count FROM "User"`;
      console.log(`\n👥 Users in database: ${userCount[0].count}`);
    }
    
    await sql.end();
    process.exit(0);
  } catch (error) {
    const err = error as Partial<Record<"message" | "code" | "detail" | "hint" | "stack", unknown>>;
    console.error('\n❌ Database connection failed!');
    console.error('Error:', err.message ?? error);
    console.error('Details:', {
      code: err.code,
      detail: err.detail,
      hint: err.hint,
    });
    if (err.stack) {
      console.error('\nStack trace:', err.stack);
    }
    await sql.end();
    process.exit(1);
  }
}

testConnection();

