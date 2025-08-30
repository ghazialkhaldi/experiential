import { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, Check, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMode } from '@/contexts/ModeContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SharedNavigation from '@/components/SharedNavigation';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

interface NotificationPreferences {
  new_opportunities: boolean;
  application_updates: boolean;
  messages: boolean;
  achievements: boolean;
  reminders: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
}

const NotificationSettings = () => {
  const { isInternshipMode } = useMode();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    new_opportunities: true,
    application_updates: true,
    messages: true,
    achievements: true,
    reminders: true,
    email_notifications: true,
    push_notifications: false,
  });

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('notification_preferences')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (data?.notification_preferences) {
        setPreferences({ ...preferences, ...data.notification_preferences });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({ notification_preferences: preferences })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save notification preferences.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const notificationTypes = [
    {
      key: 'new_opportunities' as keyof NotificationPreferences,
      title: isInternshipMode ? 'New Internships' : 'New Opportunities',
      description: isInternshipMode 
        ? 'Get notified when new internships are posted that match your interests'
        : 'Get notified when new volunteer opportunities are posted',
      icon: <Bell className="h-5 w-5" />,
    },
    {
      key: 'application_updates' as keyof NotificationPreferences,
      title: 'Application Updates',
      description: 'Receive updates on your application status',
      icon: <Check className="h-5 w-5" />,
    },
    {
      key: 'messages' as keyof NotificationPreferences,
      title: 'Messages',
      description: 'Get notified about new messages from organizations',
      icon: <Mail className="h-5 w-5" />,
    },
    {
      key: 'achievements' as keyof NotificationPreferences,
      title: 'Achievements',
      description: 'Celebrate your milestones and completed goals',
      icon: <Check className="h-5 w-5" />,
    },
    {
      key: 'reminders' as keyof NotificationPreferences,
      title: 'Reminders',
      description: 'Helpful reminders about deadlines and upcoming events',
      icon: <Bell className="h-5 w-5" />,
    },
  ];

  return (
    <div className={`min-h-screen ${isInternshipMode ? 'bg-gray-900' : 'hero-bg'}`}>
      <Sidebar />
      <SharedNavigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
            Notification Settings
          </h1>
          <p className={`text-xl ${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Customize how and when you receive notifications
          </p>
        </div>

        <div className="space-y-6">
          {/* Notification Types */}
          <Card className={isInternshipMode ? 'bg-gray-800 border-gray-700' : ''}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isInternshipMode ? 'text-white' : ''}`}>
                <Bell className="h-5 w-5" />
                Notification Types
              </CardTitle>
              <CardDescription className={isInternshipMode ? 'text-gray-400' : ''}>
                Choose which types of notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {notificationTypes.map((type) => (
                <div key={type.key} className="flex items-center justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      isInternshipMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {type.icon}
                    </div>
                    <div>
                      <h3 className={`font-medium ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                        {type.title}
                      </h3>
                      <p className={`text-sm ${isInternshipMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {type.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences[type.key]}
                    onCheckedChange={(checked) => handlePreferenceChange(type.key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Delivery Methods */}
          <Card className={isInternshipMode ? 'bg-gray-800 border-gray-700' : ''}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isInternshipMode ? 'text-white' : ''}`}>
                <Smartphone className="h-5 w-5" />
                Delivery Methods
              </CardTitle>
              <CardDescription className={isInternshipMode ? 'text-gray-400' : ''}>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isInternshipMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className={`font-medium ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                      In-App Notifications
                    </h3>
                    <p className={`text-sm ${isInternshipMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Receive notifications while browsing the app
                    </p>
                    <Badge variant="secondary" className="mt-1">Always On</Badge>
                  </div>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isInternshipMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className={`font-medium ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                      Email Notifications
                    </h3>
                    <p className={`text-sm ${isInternshipMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Receive important updates via email
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.email_notifications}
                  onCheckedChange={(checked) => handlePreferenceChange('email_notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isInternshipMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className={`font-medium ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                      Push Notifications
                    </h3>
                    <p className={`text-sm ${isInternshipMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Receive push notifications on your device
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.push_notifications}
                  onCheckedChange={(checked) => handlePreferenceChange('push_notifications', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={savePreferences}
              disabled={loading}
              className={`${
                isInternshipMode 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotificationSettings;