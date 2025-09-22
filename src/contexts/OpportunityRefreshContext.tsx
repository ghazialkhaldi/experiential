import React, { createContext, useContext, useCallback, useState } from 'react';

interface OpportunityRefreshContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const OpportunityRefreshContext = createContext<OpportunityRefreshContextType | undefined>(undefined);

export const OpportunityRefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <OpportunityRefreshContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </OpportunityRefreshContext.Provider>
  );
};

export const useOpportunityRefresh = () => {
  const context = useContext(OpportunityRefreshContext);
  if (context === undefined) {
    throw new Error('useOpportunityRefresh must be used within an OpportunityRefreshProvider');
  }
  return context;
};