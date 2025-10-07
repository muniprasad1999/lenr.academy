import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Database } from 'sql.js';
import { initDatabase } from '../services/database';

interface DatabaseContextType {
  db: Database | null;
  isLoading: boolean;
  error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextType>({
  db: null,
  isLoading: true,
  error: null,
});

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<Database | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadDatabase() {
      try {
        console.log('🔄 Initializing database...');
        const database = await initDatabase();
        setDb(database);
        setIsLoading(false);
        console.log('✅ Database ready!');
      } catch (err) {
        console.error('❌ Database initialization failed:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize database'));
        setIsLoading(false);
      }
    }

    loadDatabase();
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, isLoading, error }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}
