import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, User, Shield, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect } from 'react';
import { ChangePasswordDialog } from '@/components/ChangePasswordDialog';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const { scheduleDailyNotification, cancelNotifications, hasPermission } = useNotifications();
  const { toast } = useToast();

  const handleNotificationToggle = async (enabled: boolean) => {
    setNotifications(enabled);
    
    if (enabled) {
      const success = await scheduleDailyNotification();
      if (success) {
        toast({
          title: "Notifications Enabled",
          description: "You'll receive daily notifications at 9 AM"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to enable notifications",
          variant: "destructive"
        });
        setNotifications(false);
      }
    } else {
      const success = await cancelNotifications();
      if (success) {
        toast({
          title: "Notifications Disabled",
          description: "Daily notifications have been turned off"
        });
      }
    }
  };

  const settingsSections = [
    {
      title: 'Notifications',
      description: 'Manage your notification preferences',
      icon: Bell,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-gray-600">Receive notifications for new opportunities</p>
            </div>
            <Switch checked={notifications} onCheckedChange={handleNotificationToggle} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Updates</p>
              <p className="text-sm text-gray-600">Get weekly email summaries</p>
            </div>
            <Switch checked={emailUpdates} onCheckedChange={setEmailUpdates} />
          </div>
        </div>
      )
    },
    {
      title: 'Profile Settings',
      description: 'Manage your account information',
      icon: User,
      content: (
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            Edit Profile
          </Button>
          <ChangePasswordDialog>
            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
          </ChangePasswordDialog>
        </div>
      )
    },
    {
      title: 'Privacy & Security',
      description: 'Control your privacy settings',
      icon: Shield,
      content: (
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            Privacy Policy
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Terms of Service
          </Button>
        </div>
      )
    },
    {
      title: 'Help & Support',
      description: 'Get help and contact support',
      icon: HelpCircle,
      content: (
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            FAQ
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Contact Support
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/app/dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">
            Settings
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-4">
        {settingsSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <Card key={section.title}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <IconComponent className="h-5 w-5 text-gray-600" />
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {section.content}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Settings;