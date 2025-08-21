import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.75132a79160548ad89e678237d9547f6',
  appName: 'Experiential',
  webDir: 'dist',
  server: {
    url: 'https://75132a79-1605-48ad-89e6-78237d9547f6.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#488AFF',
      sound: 'beep.wav',
    },
    Haptics: {
      selectionStart: true,
      selectionChanged: true,
      selectionEnd: true,
    },
  },
};

export default config;