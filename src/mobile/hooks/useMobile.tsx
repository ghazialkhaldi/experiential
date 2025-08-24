import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';

interface MobileFeatures {
  isNative: boolean;
  triggerHaptic: (style: 'light' | 'medium' | 'heavy') => Promise<void>;
  scheduleNotification: (title: string, body: string, delay?: number) => Promise<void>;
}

export const useMobile = (): MobileFeatures => {
  const isNative = Capacitor.isNativePlatform();

  const triggerHaptic = async (style: 'light' | 'medium' | 'heavy') => {
    if (!isNative) return;

    try {
      const impactStyle = {
        light: ImpactStyle.Light,
        medium: ImpactStyle.Medium,
        heavy: ImpactStyle.Heavy,
      }[style];

      await Haptics.impact({ style: impactStyle });
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  };

  const scheduleNotification = async (title: string, body: string, delay = 5000) => {
    if (!isNative) return;

    try {
      // Request permissions
      const permission = await LocalNotifications.requestPermissions();
      if (permission.display !== 'granted') {
        console.warn('Notification permission not granted');
        return;
      }

      // Schedule notification
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: Date.now(),
            schedule: { at: new Date(Date.now() + delay) },
            sound: undefined,
            attachments: undefined,
            actionTypeId: '',
            extra: null,
          },
        ],
      });
    } catch (error) {
      console.warn('Failed to schedule notification:', error);
    }
  };

  return {
    isNative,
    triggerHaptic,
    scheduleNotification,
  };
};