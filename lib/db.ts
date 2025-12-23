import postgres from 'postgres';

// Lazy initialization to avoid build-time errors
let sqlInstance: ReturnType<typeof postgres> | null = null;

function getSql() {
  if (sqlInstance) {
    return sqlInstance;
  }

  // Get connection string from environment variable
  const connectionString = process.env.SUPABASE_URL;

  if (!connectionString) {
    // Only throw error at runtime, not during build
    // Check if we're in a build phase
    const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' || 
                        process.env.NEXT_PHASE === 'phase-development-build';
    
    if (isBuildPhase) {
      // Return a mock instance during build that will throw when used
      return null as any;
    }
    
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
      
      // Check if username format is correct
      if (url.username === 'postgres' && !url.username.includes('.')) {
        console.warn('⚠️ WARNING: Username should be "postgres.bmnhvvnsdfpkgaumhmtp", not just "postgres"');
        console.warn('   Get the correct connection string from Supabase Dashboard > Settings > Database > Connection pooling');
      }
    } catch {
      console.warn('⚠️ Could not parse connection string');
    }
  }

  // Create a single connection pool
  // Using connection pooling for better performance
  sqlInstance = postgres(connectionString, {
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

  return sqlInstance;
}

// Export as a getter function that initializes on first use
const sql = new Proxy({} as ReturnType<typeof postgres>, {
  get(target, prop) {
    const instance = getSql();
    if (!instance) {
      throw new Error('SUPABASE_URL environment variable is not set. Database connection cannot be established.');
    }
    return (instance as any)[prop];
  }
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

