import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Database } from 'sql.js';
import { initDatabase, downloadUpdate, getCurrentVersion, type DownloadProgress } from '../services/database';

export interface DatabaseContextType {
  db: Database | null;
  isLoading: boolean;
  error: Error | null;
  // Progress tracking
  downloadProgress: DownloadProgress | null;
  // Update management
  currentVersion: string | null;
  availableVersion: string | null;
  isUpdateAvailable: boolean;
  isDownloadingUpdate: boolean;
  updateReady: boolean;
  // Actions
  startBackgroundUpdate: () => void;
  reloadWithNewVersion: () => void;
}

const DatabaseContext = createContext<DatabaseContextType>({
  db: null,
  isLoading: true,
  error: null,
  downloadProgress: null,
  currentVersion: null,
  availableVersion: null,
  isUpdateAvailable: false,
  isDownloadingUpdate: false,
  updateReady: false,
  startBackgroundUpdate: () => {},
  reloadWithNewVersion: () => {},
});

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<Database | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [availableVersion, setAvailableVersion] = useState<string | null>(null);
  const [isDownloadingUpdate, setIsDownloadingUpdate] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    async function loadDatabase() {
      try {
        console.log('🔄 Initializing database...');

        const database = await initDatabase(
          // Progress callback
          (progress) => {
            setDownloadProgress(progress);
          },
          // Update available callback
          (version) => {
            setAvailableVersion(version);
          }
        );

        setDb(database);
        setCurrentVersion(getCurrentVersion());
        setIsLoading(false);
        setDownloadProgress(null);
        console.log('✅ Database ready!');
      } catch (err) {
        console.error('❌ Database initialization failed:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize database'));
        setIsLoading(false);
      }
    }

    loadDatabase();
  }, []);

  const startBackgroundUpdate = async () => {
    if (!availableVersion || isDownloadingUpdate) return;

    try {
      setIsDownloadingUpdate(true);
      setDownloadProgress(null);

      await downloadUpdate(availableVersion, (progress) => {
        setDownloadProgress(progress);
      });

      setUpdateReady(true);
      setIsDownloadingUpdate(false);
      setDownloadProgress(null);
      console.log('✅ Update downloaded and cached');
    } catch (err) {
      console.error('Failed to download update:', err);
      setIsDownloadingUpdate(false);
      setDownloadProgress(null);
    }
  };

  const reloadWithNewVersion = () => {
    window.location.reload();
  };

  const isUpdateAvailable = !!(availableVersion && availableVersion !== currentVersion);

  return (
    <DatabaseContext.Provider
      value={{
        db,
        isLoading,
        error,
        downloadProgress,
        currentVersion,
        availableVersion,
        isUpdateAvailable,
        isDownloadingUpdate,
        updateReady,
        startBackgroundUpdate,
        reloadWithNewVersion,
      }}
    >
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
