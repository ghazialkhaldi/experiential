import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Clock, Calendar, Target } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";

const NotificationTestPage = () => {
  const { 
    isSupported, 
    isInitialized, 
    sendTestNotification,
    scheduleLocalNotification,
    scheduleVolunteerReminder,
    scheduleHourTrackingReminder
  } = useNotifications();
  const { toast } = useToast();

  const runTest = async (testType: string, testFunction: () => Promise<void>, description: string) => {
    if (!isSupported) {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Notifications only work in the mobile app",
      });
      return;
    }

    try {
      await testFunction();
      toast({
        title: `${testType} Test Sent!`,
        description,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Test Failed",
        description: `Failed to send ${testType.toLowerCase()} test`,
      });
    }
  };

  return (
    <div className="min-h-screen safe-area-all safe-area-all bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      <div className="min-h-screen safe-area-all bg-gradient-to-br from-blue-50 via-white to-green-50 p-8">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Testing
            </CardTitle>
            <p className="text-gray-600">
              Test different types of notifications for the Experiential app
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isSupported && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  ⚠️ Notifications only work in the mobile app, not in browser
                </p>
              </div>
            )}

            {isSupported && !isInitialized && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  🔄 Initializing notifications... Please allow permissions when prompted
                </p>
              </div>
            )}

            <div className="grid gap-4">
              {/* Immediate Test */}
              <Button 
                onClick={() => runTest(
                  "Immediate", 
                  sendTestNotification,
                  "Notification will appear in 2 seconds"
                )}
                className="w-full h-16 text-left"
                disabled={!isInitialized}
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">Immediate Test</div>
                    <div className="text-sm opacity-80">Shows in 2 seconds</div>
                  </div>
                </div>
              </Button>

              {/* Custom Test */}
              <Button 
                variant="outline"
                onClick={() => runTest(
                  "Custom",
                  () => scheduleLocalNotification(
                    "Custom Test", 
                    "This is a custom notification test!"
                  ),
                  "Custom notification sent"
                )}
                className="w-full h-16 text-left"
                disabled={!isInitialized}
              >
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">Custom Notification</div>
                    <div className="text-sm opacity-80">Test custom message</div>
                  </div>
                </div>
              </Button>

              {/* Hour Tracking Test */}
              <Button 
                variant="outline"
                onClick={() => runTest(
                  "Hour Tracking",
                  scheduleHourTrackingReminder,
                  "Hour tracking reminder scheduled"
                )}
                className="w-full h-16 text-left"
                disabled={!isInitialized}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">Hour Tracking Reminder</div>
                    <div className="text-sm opacity-80">Scheduled for 8 PM today</div>
                  </div>
                </div>
              </Button>

              {/* Volunteer Reminder Test */}
              <Button 
                variant="outline"
                onClick={() => runTest(
                  "Volunteer Reminder",
                  () => scheduleVolunteerReminder(
                    "Beach Cleanup",
                    new Date(Date.now() + 25 * 60 * 60 * 1000), // 25 hours from now
                    "test123"
                  ),
                  "Volunteer reminder scheduled for tomorrow"
                )}
                className="w-full h-16 text-left"
                disabled={!isInitialized}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">Volunteer Reminder</div>
                    <div className="text-sm opacity-80">24h before activity</div>
                  </div>
                </div>
              </Button>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">📋 Testing Instructions:</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>1. Build and install app on iOS device</li>
                <li>2. Allow notification permissions when prompted</li>
                <li>3. Tap any test button above</li>
                <li>4. Check notification appears on device</li>
                <li>5. Tap notification to test navigation</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default NotificationTestPage;
