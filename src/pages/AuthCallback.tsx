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

        const user = data.session.user;
        console.log('AuthCallback - User:', user);
        console.log('AuthCallback - App metadata:', user.app_metadata);

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
            
            // Validate required organization fields
            const orgData = pendingData.organizationData;
            const requiredFields = ['name', 'address_line1', 'city', 'state', 'zip_code'];
            const missingFields = requiredFields.filter(field => !orgData[field]);
            
            if (missingFields.length > 0) {
              console.error('Missing required organization fields:', missingFields);
              toast({
                variant: "destructive",
                title: "Organization Setup Incomplete",
                description: `Missing required fields: ${missingFields.join(', ')}. Please complete your organization profile in settings.`,
              });
            } else {
              // Attempt to save organization with retry logic
              let orgSaved = false;
              let retryCount = 0;
              const maxRetries = 3;
              
              while (!orgSaved && retryCount < maxRetries) {
                try {
                  const orgPayload = {
                    user_id: data.session.user.id,
                    ...orgData
                  };
                  console.log(`Organization save attempt ${retryCount + 1}:`, orgPayload);
                  
                  const { error: orgError } = await supabase
                    .from('organizations')
                    .insert(orgPayload);

                  if (orgError) {
                    console.error(`Organization save attempt ${retryCount + 1} failed:`, orgError);
                    
                    if (retryCount === maxRetries - 1) {
                      // Final attempt failed - offer fallback
                      toast({
                        variant: "destructive",
                        title: "Organization Setup Failed",
                        description: "We couldn't save your organization data automatically. You can complete your organization profile after logging in.",
                      });
                      
                      // Store organization data for later completion
                      localStorage.setItem('incompleteOrgData', JSON.stringify(orgData));
                    } else {
                      // Wait before retry
                      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
                    }
                  } else {
                    console.log('Organization saved successfully on attempt', retryCount + 1);
                    orgSaved = true;
                    toast({
                      title: "Organization Profile Created",
                      description: "Your organization profile has been set up successfully.",
                    });
                  }
                } catch (error) {
                  console.error(`Organization save attempt ${retryCount + 1} threw error:`, error);
                  if (retryCount === maxRetries - 1) {
                    toast({
                      variant: "destructive",
                      title: "Organization Setup Error",
                      description: "An unexpected error occurred. Please complete your organization profile in settings.",
                    });
                    localStorage.setItem('incompleteOrgData', JSON.stringify(orgData));
                  }
                }
                retryCount++;
              }
            }
          } else {
            console.log('No organization data found in pending data');
          }

          // Clean up pending data
          localStorage.removeItem('pendingSignupData');
        }

        setStatus('Account setup complete!');
        
        // Check if user needs to complete profile (especially for Google users)
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        const needsProfileCompletion = !profileData?.role;
                const isGoogleUser = user.app_metadata?.provider === 'google';
        
        if (needsProfileCompletion) {
          if (isGoogleUser) {
            // For Google users, redirect to home page where they can use the sidebar notification
            toast({
              title: "Welcome to Experiential!",
              description: "Please complete your profile using the sidebar to get started.",
            });

            setTimeout(() => {
              navigate('/');
            }, 1500);
          } else {
            // For non-Google users, use the existing flow
            toast({
              title: "Welcome to Experiential!",
              description: "Please complete your profile to get started.",
            });

            setTimeout(() => {
              navigate('/complete-profile');
            }, 1500);
          }
        } else {
          toast({
            title: "Welcome back to Experiential!",
            description: "Your account has been verified and set up successfully.",
          });
        // Check if user needs to complete profile (especially for Google users)
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        const needsProfileCompletion = !profileData?.role;
        const isGoogleUser = user.app_metadata?.provider === 'google';
        
        if (needsProfileCompletion) {
          if (isGoogleUser) {
            // For Google users, redirect to home page where they can use the sidebar notification
            toast({
              title: "Welcome to Experiential!",
              description: "Please complete your profile using the sidebar to get started.",
            });

            setTimeout(() => {
              navigate('/');
            }, 1500);
          } else {
            // For non-Google users, use the existing flow
            toast({
              title: "Welcome to Experiential!",
              description: "Please complete your profile to get started.",
            });

            setTimeout(() => {
              navigate('/complete-profile');
            }, 1500);
          }
        } else {
          toast({
            title: "Welcome back to Experiential!",
            description: "Your account has been verified and set up successfully.",
          });

          // Small delay to show success message
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
          // Small delay to show success message
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }

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
          <span className="text-2xl font-bold text-gray-900">E<span className="text-blue-500">x</span>per<span className="relative">ı<span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 text-blue-500 text-sm">•</span></span>ent<span className="relative">ı<span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 text-blue-500 text-sm">•</span></span>al<span className="text-blue-500">.</span></span>
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