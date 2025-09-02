import { createContext, useContext, useState, ReactNode } from 'react';

export type AppMode = 'volunteer' | 'internship' | 'jobs';

interface ModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  isInternshipMode: boolean;
  isJobsMode: boolean;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<AppMode>('volunteer');

  return (
    <ModeContext.Provider value={{
      mode,
      setMode,
      isInternshipMode: mode === 'internship',
      isJobsMode: mode === 'jobs'
    }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};