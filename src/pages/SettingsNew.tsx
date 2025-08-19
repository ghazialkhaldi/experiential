import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, User, Shield, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { useMode } from '@/contexts/ModeContext';

const Settings = () => {
  const navigate = useNavigate();
  const { isInternshipMode } = useMode();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

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
            <Switch checked={notifications} onCheckedChange={setNotifications} />
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
          <Button variant="outline" className="w-full justify-start">
            Change Password
          </Button>
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
    <div className={`min-h-screen ${
      isInternshipMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Header */}
      <header className={`shadow-sm border-b p-4 ${
        isInternshipMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
      }`}>
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/app/dashboard')}
            className={isInternshipMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className={`text-xl font-semibold ${
            isInternshipMode ? 'text-white' : 'text-gray-900'
          }`}>
            Settings
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="p-4">
        <div className="space-y-4">
          {settingsSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Card key={section.title} className={
                isInternshipMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
              }>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      isInternshipMode ? 'bg-purple-600' : 'bg-blue-500'
                    } text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className={`text-lg ${
                        isInternshipMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {section.title}
                      </CardTitle>
                      <CardDescription className={
                        isInternshipMode ? 'text-gray-300' : 'text-gray-600'
                      }>
                        {section.description}
                      </CardDescription>
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
    </div>
  );
};

export default Settings;
