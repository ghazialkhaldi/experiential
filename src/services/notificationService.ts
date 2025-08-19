import { PushNotifications, Token, ActionPerformed, PushNotificationSchema } from '@capacitor/push-notifications';
import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
  id?: number;
}

class NotificationService {
  private isInitialized = false;
  private pushToken: string | null = null;

  async initialize() {
    if (this.isInitialized || !Capacitor.isNativePlatform()) {
      return;
    }

    try {
      // Request permissions
      await this.requestPermissions();
      
      // Initialize push notifications
      await this.initializePushNotifications();
      
      // Initialize local notifications
      await this.initializeLocalNotifications();
      
      this.isInitialized = true;
      console.log('Notification service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }

  private async requestPermissions() {
    // Request push notification permissions
    const pushResult = await PushNotifications.requestPermissions();
    console.log('Push notification permission status:', pushResult.receive);

    // Request local notification permissions
    const localResult = await LocalNotifications.requestPermissions();
    console.log('Local notification permission status:', localResult.display);

    if (pushResult.receive !== 'granted' && localResult.display !== 'granted') {
      throw new Error('Notification permissions not granted');
    }
  }

  private async initializePushNotifications() {
    // Register for push notifications
    await PushNotifications.register();

    // Listen for registration token
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token:', token.value);
      this.pushToken = token.value;
      // Send token to your backend server here
      this.sendTokenToServer(token.value);
    });

    // Listen for registration errors
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Error on registration:', error);
    });

    // Listen for push notifications received
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push notification received:', notification);
      // Handle foreground notifications
      this.handleForegroundNotification(notification);
    });

    // Listen for push notification actions
    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      console.log('Push notification action performed:', notification);
      // Handle notification tap/action
      this.handleNotificationAction(notification);
    });
  }

  private async initializeLocalNotifications() {
    // Listen for local notification actions
    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      console.log('Local notification action performed:', notification);
      this.handleNotificationAction(notification);
    });
  }

  private async sendTokenToServer(token: string) {
    // TODO: Implement API call to save token to your backend
    // This would typically be a call to your Supabase functions or API
    console.log('Sending token to server:', token);
    
    try {
      // Example API call structure:
      // await supabase.from('user_push_tokens').upsert({
      //   user_id: getCurrentUserId(),
      //   push_token: token,
      //   platform: Capacitor.getPlatform(),
      //   updated_at: new Date()
      // });
    } catch (error) {
      console.error('Failed to save push token:', error);
    }
  }

  private handleForegroundNotification(notification: PushNotificationSchema) {
    // Show local notification when app is in foreground
    this.scheduleLocalNotification({
      title: notification.title || 'New Notification',
      body: notification.body || 'You have a new message',
      data: notification.data
    });
  }

  private handleNotificationAction(notification: any) {
    // Handle what happens when user taps on notification
    const data = notification.notification?.data || notification.data;
    
    if (data?.route) {
      // Navigate to specific route
      window.location.href = data.route;
    } else if (data?.opportunityId) {
      // Navigate to specific opportunity
      window.location.href = `/opportunity/${data.opportunityId}`;
    } else {
      // Default action - go to main app
      window.location.href = '/';
    }
  }

  // Schedule a local notification
  async scheduleLocalNotification(notification: NotificationData) {
    if (!Capacitor.isNativePlatform()) {
      console.log('Local notifications not available on web');
      return;
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: notification.title,
            body: notification.body,
            id: notification.id || Date.now(),
            schedule: { at: new Date(Date.now() + 1000) }, // Show immediately
            actionTypeId: 'tap_action',
            extra: notification.data
          }
        ]
      });
    } catch (error) {
      console.error('Failed to schedule local notification:', error);
    }
  }

  // Schedule reminder notifications for volunteer opportunities
  async scheduleVolunteerReminder(opportunityTitle: string, scheduledDate: Date, opportunityId: string) {
    const reminderTime = new Date(scheduledDate.getTime() - 24 * 60 * 60 * 1000); // 24 hours before
    
    if (reminderTime <= new Date()) {
      return; // Don't schedule past reminders
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Volunteer Reminder',
          body: `Don't forget about your volunteer opportunity: ${opportunityTitle} tomorrow!`,
          id: parseInt(`${opportunityId}${Date.now()}`),
          schedule: { at: reminderTime },
          actionTypeId: 'volunteer_reminder',
          extra: {
            opportunityId,
            route: `/opportunity/${opportunityId}`
          }
        }
      ]
    });
  }

  // Schedule hour tracking reminders
  async scheduleHourTrackingReminder() {
    const reminderTime = new Date();
    reminderTime.setHours(20, 0, 0, 0); // 8 PM today
    
    if (reminderTime <= new Date()) {
      reminderTime.setDate(reminderTime.getDate() + 1); // Tomorrow if it's already past 8 PM
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Track Your Hours',
          body: 'Remember to log your volunteer hours for today!',
          id: Math.floor(Math.random() * 1000000),
          schedule: { at: reminderTime },
          actionTypeId: 'track_hours',
          extra: {
            route: '/track-hours'
          }
        }
      ]
    });
  }

  // Send push notification about new opportunities
  async notifyNewOpportunities(opportunities: any[]) {
    for (const opportunity of opportunities) {
      await this.scheduleLocalNotification({
        title: 'New Volunteer Opportunity',
        body: `Check out: ${opportunity.title} in ${opportunity.location}`,
        data: {
          opportunityId: opportunity.id,
          route: `/opportunity/${opportunity.id}`
        }
      });
    }
  }

  // Get the current push token
  getPushToken(): string | null {
    return this.pushToken;
  }

  // Check if notifications are supported
  isSupported(): boolean {
    return Capacitor.isNativePlatform();
  }

  // Test notification - shows immediately
  async sendTestNotification() {
    if (!Capacitor.isNativePlatform()) {
      console.log('Test notifications not available on web');
      return;
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: '🎉 Test Notification',
            body: 'Notification system is working perfectly!',
            id: 999999,
            schedule: { at: new Date(Date.now() + 2000) }, // Show in 2 seconds
            actionTypeId: 'test_notification',
            extra: {
              type: 'test',
              route: '/'
            }
          }
        ]
      });
      console.log('Test notification scheduled for 2 seconds');
    } catch (error) {
      console.error('Failed to schedule test notification:', error);
    }
  }
}

export const notificationService = new NotificationService();

  // Schedule daily notifications for engagement
  async scheduleDailyNotifications() {
    if (!Capacitor.isNativePlatform()) {
      console.log('Daily notifications not available on web');
      return;
    }

    try {
      // Clear any existing daily notifications first
      await this.clearDailyNotifications();

      // Schedule notifications for the next 30 days
      const now = new Date();
      const notifications = [];

      for (let i = 1; i <= 30; i++) {
        const notificationTime = new Date(now);
        notificationTime.setDate(now.getDate() + i);
        notificationTime.setHours(9, 0, 0, 0); // 9 AM daily

        const messages = [
          'New volunteer opportunities are waiting for you! 🌟',
          'Make a difference today - check out volunteer opportunities! 💪',
          'Your community needs you! See what\'s available today 🤝',
          'Build your experience with volunteer work! 📈',
          'Help others and grow your skills - volunteer today! 🚀',
          'Make an impact in your community! 🌍',
          'Volunteer opportunities are calling your name! 📢'
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        notifications.push({
          title: 'Experiential - Daily Reminder',
          body: randomMessage,
          id: parseInt(`daily${i}${Date.now().toString().slice(-6)}`),
          schedule: { at: notificationTime },
          actionTypeId: 'daily_engagement',
          extra: {
            type: 'daily_reminder',
            route: '/'
          }
        });
      }

      await LocalNotifications.schedule({ notifications });
      console.log(`Scheduled ${notifications.length} daily notifications`);
      
      // Store last setup date to avoid duplicates
      localStorage.setItem('dailyNotificationsSetup', now.toISOString());
      
    } catch (error) {
      console.error('Failed to schedule daily notifications:', error);
    }
  }

  // Clear existing daily notifications
  async clearDailyNotifications() {
    try {
      const pendingNotifications = await LocalNotifications.getPending();
      const dailyNotificationIds = pendingNotifications.notifications
        .filter(n => n.extra?.type === 'daily_reminder')
        .map(n => n.id);
      
      if (dailyNotificationIds.length > 0) {
        await LocalNotifications.cancel({ notifications: dailyNotificationIds.map(id => ({ id })) });
        console.log(`Cleared ${dailyNotificationIds.length} existing daily notifications`);
      }
    } catch (error) {
      console.error('Failed to clear daily notifications:', error);
    }
  }

  // Check if daily notifications need to be set up (call this on app launch)
  async ensureDailyNotificationsSetup() {
    if (!Capacitor.isNativePlatform()) return;

    try {
      const lastSetup = localStorage.getItem('dailyNotificationsSetup');
      const now = new Date();
      
      if (!lastSetup) {
        // First time setup
        await this.scheduleDailyNotifications();
        return;
      }

      const lastSetupDate = new Date(lastSetup);
      const daysSinceSetup = Math.floor((now.getTime() - lastSetupDate.getTime()) / (1000 * 60 * 60 * 24));

      // Refresh notifications every 25 days to ensure continuity
      if (daysSinceSetup >= 25) {
        await this.scheduleDailyNotifications();
      }
    } catch (error) {
      console.error('Failed to ensure daily notifications setup:', error);
    }
  }
