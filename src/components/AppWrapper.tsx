import React, { useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import SafetyBar from './SafetyBar';

interface AppWrapperProps {
  children: React.ReactNode;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const { isSupported, isInitialized } = useNotifications();

  useEffect(() => {
    // Notifications are automatically initialized by the useNotifications hook
    if (isSupported && isInitialized) {
      console.log('Notifications ready for mobile app');
    }
  }, [isSupported, isInitialized]);

  return (
    <SafetyBar>
      {children}
    </SafetyBar>
  );
};

export default AppWrapper;
