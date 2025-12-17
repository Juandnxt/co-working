import postgres from 'postgres';

// Get connection string from environment variable
const connectionString = process.env.SUPABASE_URL;

if (!connectionString) {
  throw new Error('SUPABASE_URL environment variable is not set');
}

// Log connection info in development (without password)
if (process.env.NODE_ENV === 'development') {
  try {
    const url = new URL(connectionString);
    console.log('🔌 Database connection:', {
      host: url.hostname,
      port: url.port,
      database: url.pathname.replace('/', ''),
      user: url.username,
    });
  } catch (e) {
    console.warn('⚠️ Could not parse connection string');
  }
}

// Create a single connection pool
// Using connection pooling for better performance
const sql = postgres(connectionString, {
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout
  onnotice: () => {}, // Suppress notices
  debug: (connection, query, parameters) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 DB Query:', query);
      if (parameters && parameters.length > 0) {
        console.log('   Parameters:', parameters);
      }
    }
  },
});

export default sql;

// Helper function to generate UUID (similar to Prisma's cuid)
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

