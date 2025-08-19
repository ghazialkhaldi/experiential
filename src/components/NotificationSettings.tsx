import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Clock, MapPin, Calendar } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";

const NotificationSettings = () => {
  const { isSupported, isInitialized, sendTestNotification } = useNotifications();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    newOpportunities: true,
    volunteerReminders: true,
    hourTracking: true,
    applicationUpdates: true,
    weeklyDigest: false
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));

    // Save to localStorage or backend
    localStorage.setItem(`notification_${key}`, value.toString());

    toast({
      title: "Settings Updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} notifications ${value ? 'enabled' : 'disabled'}`,
    });
  };

  const testNotification = async () => {
    if (!isSupported) {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Notifications are only available in the mobile app",
      });
      return;
    }

    try {
      await sendTestNotification();
      toast({
        title: "Test Notification Sent!",
        description: "You should see a notification in 2 seconds",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send test notification",
      });
    }
  };

  useEffect(() => {
    // Load saved settings
    Object.keys(settings).forEach(key => {
      const saved = localStorage.getItem(`notification_${key}`);
      if (saved !== null) {
        setSettings(prev => ({
          ...prev,
          [key]: saved === 'true'
        }));
      }
    });
  }, []);

  if (!isSupported) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="w-5 h-5" />
            Notifications Not Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Push notifications are only available in the mobile app. 
            Download the Experiential app from the App Store to receive notifications about new opportunities and reminders.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </CardTitle>
          <p className="text-sm text-gray-600">
            Manage your notification preferences to stay updated on volunteer opportunities and important reminders.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isInitialized && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                Notifications are being initialized... Please allow permissions when prompted.
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-blue-500" />
                <div>
                  <Label htmlFor="new-opportunities" className="text-sm font-medium">
                    New Opportunities
                  </Label>
                  <p className="text-xs text-gray-500">
                    Get notified when new volunteer opportunities match your interests
                  </p>
                </div>
              </div>
              <Switch
                id="new-opportunities"
                checked={settings.newOpportunities}
                onCheckedChange={(checked) => handleSettingChange('newOpportunities', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-green-500" />
                <div>
                  <Label htmlFor="volunteer-reminders" className="text-sm font-medium">
                    Volunteer Reminders
                  </Label>
                  <p className="text-xs text-gray-500">
                    Receive reminders 24 hours before your scheduled volunteer activities
                  </p>
                </div>
              </div>
              <Switch
                id="volunteer-reminders"
                checked={settings.volunteerReminders}
                onCheckedChange={(checked) => handleSettingChange('volunteerReminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-purple-500" />
                <div>
                  <Label htmlFor="hour-tracking" className="text-sm font-medium">
                    Hour Tracking Reminders
                  </Label>
                  <p className="text-xs text-gray-500">
                    Daily reminders to log your volunteer hours
                  </p>
                </div>
              </div>
              <Switch
                id="hour-tracking"
                checked={settings.hourTracking}
                onCheckedChange={(checked) => handleSettingChange('hourTracking', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-4 h-4 text-orange-500" />
                <div>
                  <Label htmlFor="application-updates" className="text-sm font-medium">
                    Application Updates
                  </Label>
                  <p className="text-xs text-gray-500">
                    Get notified about the status of your volunteer applications
                  </p>
                </div>
              </div>
              <Switch
                id="application-updates"
                checked={settings.applicationUpdates}
                onCheckedChange={(checked) => handleSettingChange('applicationUpdates', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-4 h-4 text-indigo-500" />
                <div>
                  <Label htmlFor="weekly-digest" className="text-sm font-medium">
                    Weekly Digest
                  </Label>
                  <p className="text-xs text-gray-500">
                    Weekly summary of your volunteer activities and new opportunities
                  </p>
                </div>
              </div>
              <Switch
                id="weekly-digest"
                checked={settings.weeklyDigest}
                onCheckedChange={(checked) => handleSettingChange('weeklyDigest', checked)}
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button 
              onClick={testNotification}
              variant="outline" 
              className="w-full"
              disabled={!isInitialized}
            >
              <Bell className="w-4 h-4 mr-2" />
              Send Test Notification
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">App-Only Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Real-time push notifications</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Offline volunteer hour tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Location-based opportunity alerts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Quick access to saved opportunities</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
