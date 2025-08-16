import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Smartphone, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { notificationService } from "@/services/notificationService";
import Sidebar from "@/components/Sidebar";

const NotificationsPage = () => {
  const { toast } = useToast();
  const [permissionStatus, setPermissionStatus] = useState<string>("default");
  const [settings, setSettings] = useState({
    volunteerReminders: true,
    applicationUpdates: true,
    newOpportunities: false,
    weeklyDigest: true,
    dailyReminders: true,
  });

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    try {
      await notificationService.initialize();
      setPermissionStatus("granted");
    } catch (error) {
      console.error('Error checking permission:', error);
      setPermissionStatus("default");
    }
  };

  const requestPermissions = async () => {
    try {
      await notificationService.initialize();
      setPermissionStatus("granted");
      toast({
        title: "Notifications Enabled!",
        description: "You'll now receive notifications from the Experiential app.",
      });
    } catch (error) {
      setPermissionStatus("denied");
      toast({
        title: "Permission Denied",
        description: "Please enable notifications in your device settings.",
        variant: "destructive",
      });
    }
  };

  const getPermissionStatusIcon = () => {
    switch (permissionStatus) {
      case "granted":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "denied":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getPermissionStatusText = () => {
    switch (permissionStatus) {
      case "granted":
        return "Notifications Enabled";
      case "denied":
        return "Notifications Disabled";
      default:
        return "Permission Not Requested";
    }
  };

  return (
    <div className="min-h-screen safe-area-all bg-background" className="safe-area-all">
      {/* Sidebar */}
      <Sidebar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <Bell className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        </div>

        {/* Permission Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Notification Permission Status
            </CardTitle>
            <CardDescription>
              Manage your device notification permissions for the Experiential app.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getPermissionStatusIcon()}
                <span className="font-medium">{getPermissionStatusText()}</span>
              </div>
              {permissionStatus !== "granted" && (
                <Button onClick={requestPermissions} variant="outline">
                  Enable Notifications
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Choose what types of notifications you'd like to receive.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="volunteer-reminders" className="text-base font-medium">
                  Volunteer Reminders
                </Label>
                <p className="text-sm text-gray-500">
                  Get reminded about upcoming volunteer opportunities you've signed up for
                </p>
              </div>
              <Switch
                id="volunteer-reminders"
                checked={settings.volunteerReminders}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, volunteerReminders: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="application-updates" className="text-base font-medium">
                  Application Updates
                </Label>
                <p className="text-sm text-gray-500">
                  Notifications about your volunteer application status
                </p>
              </div>
              <Switch
                id="application-updates"
                checked={settings.applicationUpdates}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, applicationUpdates: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="new-opportunities" className="text-base font-medium">
                  New Opportunities
                </Label>
                <p className="text-sm text-gray-500">
                  Get notified when new volunteer opportunities match your interests
                </p>
              </div>
              <Switch
                id="new-opportunities"
                checked={settings.newOpportunities}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, newOpportunities: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-digest" className="text-base font-medium">
                  Weekly Digest
                </Label>
                <p className="text-sm text-gray-500">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="daily-reminders" className="text-base font-medium">
                  Daily Reminders
                </Label>
                <p className="text-sm text-gray-500">
                  Get daily reminders to check new volunteer opportunities
                </p>
              </div>
              <Switch
                id="daily-reminders"
                checked={settings.dailyReminders}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, dailyReminders: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-digest" className="text-base font-medium">
                  Weekly Digest
                </Label>
                <p className="text-sm text-gray-500">
                  A weekly summary of new opportunities and platform updates
                </p>
              </div>
              <Switch
                id="weekly-digest"
                checked={settings.weeklyDigest}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, weeklyDigest: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Having trouble with notifications? Here are some tips.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <p>• Make sure notifications are enabled in your device settings</p>
              <p>• Check that you have an internet connection</p>
              <p>• Ensure the app is up to date</p>
              <p>• You can change notification permissions in your device's Settings app</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsPage;
