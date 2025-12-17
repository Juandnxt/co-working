import postgres from 'postgres';

// Get connection string from environment variable
const connectionString = process.env.SUPABASE_URL;

if (!connectionString) {
  throw new Error('SUPABASE_URL environment variable is not set');
}

// Create a single connection pool
// Using connection pooling for better performance
const sql = postgres(connectionString, {
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout
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

