import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckCircle, Loader2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type VolunteerCategory = Database['public']['Enums']['volunteer_category'];

const AuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Processing your account...');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the auth code from URL and exchange for session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: error.message,
          });
          navigate('/auth');
          return;
        }

        if (!data.session?.user) {
          toast({
            variant: "destructive",
            title: "No Session Found",
            description: "Please try signing in again.",
          });
          navigate('/auth');
          return;
        }

        setStatus('Setting up your profile...');

        // Get pending signup data from localStorage
        const pendingDataStr = localStorage.getItem('pendingSignupData');
        console.log('Retrieved pending data from localStorage:', pendingDataStr);
        if (pendingDataStr) {
          const pendingData = JSON.parse(pendingDataStr);
          console.log('Parsed pending data:', pendingData);
          
          // Process volunteer preferences
          if (pendingData.preferences && pendingData.preferences.length > 0) {
            const preferenceData = pendingData.preferences.map((category: string) => ({
              user_id: data.session.user.id,
              category: category as VolunteerCategory
            }));

            const { error: preferencesError } = await supabase
              .from('volunteer_preferences')
              .insert(preferenceData);

            if (preferencesError) {
              console.error('Error saving preferences:', preferencesError);
              toast({
                variant: "destructive",
                title: "Preferences Error",
                description: "Could not save volunteer preferences. You can update them later in your profile.",
              });
            }
          }

          // Process organization data
          if (pendingData.organizationData) {
            console.log('Processing organization data:', pendingData.organizationData);
            console.log('User ID:', data.session.user.id);
            
            const orgPayload = {
              user_id: data.session.user.id,
              ...pendingData.organizationData
            };
            console.log('Organization payload:', orgPayload);
            
            const { error: orgError } = await supabase
              .from('organizations')
              .insert(orgPayload);

            if (orgError) {
              console.error('Error saving organization:', orgError);
              toast({
                variant: "destructive",
                title: "Organization Setup Error",
                description: "Could not save organization data. Please complete your organization profile in settings.",
              });
            } else {
              console.log('Organization saved successfully');
            }
          } else {
            console.log('No organization data found in pending data');
          }

          // Clean up pending data
          localStorage.removeItem('pendingSignupData');
        }

        setStatus('Account setup complete!');
        
        toast({
          title: "Welcome to VolunteerHub!",
          description: "Your account has been verified and set up successfully.",
        });

        // Small delay to show success message
        setTimeout(() => {
          navigate('/');
        }, 2000);

      } catch (error) {
        console.error('Callback processing error:', error);
        toast({
          variant: "destructive",
          title: "Setup Error",
          description: "There was an error setting up your account. Please try again.",
        });
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Users className="h-8 w-8 text-blue-600 mr-2" />
          <span className="text-2xl font-bold text-gray-900">VolunteerHub</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              Account Verification
            </CardTitle>
            <CardDescription>
              {loading ? 'Please wait while we set up your account...' : 'Your account is ready!'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-sm text-gray-600">{status}</p>
              {!loading && (
                <p className="text-xs text-gray-500 mt-2">
                  Redirecting you to the dashboard...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthCallback;