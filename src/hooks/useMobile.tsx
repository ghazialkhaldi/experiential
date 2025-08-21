import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';

interface MobileFeatures {
  isNative: boolean;
  triggerHaptic: (style?: ImpactStyle) => void;
  scheduleNotification: (title: string, body: string, delay?: number) => void;
  requestNotificationPermissions: () => Promise<boolean>;
}

export const useMobile = (): MobileFeatures => {
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
    
    // Request notification permissions on app start
    if (Capacitor.isNativePlatform()) {
      requestNotificationPermissions();
    }
  }, []);

  const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Medium) => {
    if (isNative) {
      try {
        await Haptics.impact({ style });
      } catch (error) {
        console.log('Haptic feedback not available:', error);
      }
    }
  };

  const requestNotificationPermissions = async (): Promise<boolean> => {
    if (!isNative) return false;
    
    try {
      const result = await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  };

  const scheduleNotification = async (title: string, body: string, delay: number = 0) => {
    if (!isNative) return;

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: Math.floor(Math.random() * 10000),
            schedule: delay > 0 ? { at: new Date(Date.now() + delay) } : undefined,
            sound: 'beep.wav',
            attachments: undefined,
            actionTypeId: '',
            extra: null
          }
        ]
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  return {
    isNative,
    triggerHaptic,
    scheduleNotification,
    requestNotificationPermissions
  };
};