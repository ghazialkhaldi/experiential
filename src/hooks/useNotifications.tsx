import { useState, useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export const useNotifications = () => {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      checkPermissions();
    }
  }, []);

  const checkPermissions = async () => {
    try {
      const { display } = await LocalNotifications.checkPermissions();
      setHasPermission(display === 'granted');
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  const requestPermissions = async () => {
    try {
      const { display } = await LocalNotifications.requestPermissions();
      setHasPermission(display === 'granted');
      return display === 'granted';
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  };

  const scheduleDailyNotification = async () => {
    if (!hasPermission) {
      const granted = await requestPermissions();
      if (!granted) return false;
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Experiential',
            body: 'Check out new volunteer opportunities today!',
            id: 1,
            schedule: {
              on: {
                hour: 9,
                minute: 0
              },
              repeats: true
            }
          }
        ]
      });
      return true;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return false;
    }
  };

  const cancelNotifications = async () => {
    try {
      await LocalNotifications.cancel({
        notifications: [{ id: 1 }]
      });
      return true;
    } catch (error) {
      console.error('Error canceling notifications:', error);
      return false;
    }
  };

  return {
    hasPermission,
    requestPermissions,
    scheduleDailyNotification,
    cancelNotifications
  };
};