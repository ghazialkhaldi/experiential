import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMode } from '@/contexts/ModeContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const EditProfile = () => {
  const navigate = useNavigate();
  const { isInternshipMode } = useMode();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    email: '',
    firstName: '',
    lastName: '',
    age: ''
  });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, age')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        setProfile({
          email: user.email || '',
          firstName: profileData?.first_name || '',
          lastName: profileData?.last_name || '',
          age: profileData?.age?.toString() || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const updates = {
        first_name: profile.firstName,
        last_name: profile.lastName,
        age: profile.age ? parseInt(profile.age) : null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackNavigation = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    navigate('/settings');
  };

  const changePassword = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    navigate('/change-password');
  };

  return (
    <div className={`min-h-screen ${
      isInternshipMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900' 
        : 'bg-gradient-to-br from-white via-blue-200 to-blue-400'
    }`}>
      {/* Content - Added top padding for iPhone notch */}
      <div className="p-4 pt-16">
        {/* Back Button and Title */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleBackNavigation}
            className={`mr-4 rounded-full ${
              isInternshipMode 
                ? 'text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-600/50' 
                : 'text-gray-700 hover:text-gray-900 bg-white hover:bg-white border border-gray-200'
            }`}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className={`text-xl font-semibold ${
            isInternshipMode ? 'text-white' : 'text-gray-900'
          }`}>
            Edit Profile
          </h1>
        </div>

        <div className="space-y-6">
          {/* Profile Information Card */}
          <Card className={
            isInternshipMode 
              ? 'bg-gray-800/50 border-purple-500/30' 
              : 'bg-white'
          }>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  isInternshipMode ? 'bg-purple-600' : 'bg-blue-500'
                } text-white`}>
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className={`text-lg ${
                    isInternshipMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Profile Information
                  </CardTitle>
                  <CardDescription className={
                    isInternshipMode ? 'text-gray-300' : 'text-gray-600'
                  }>
                    Update your personal information
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className={
                  isInternshipMode ? 'text-gray-300' : 'text-gray-700'
                }>
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className={
                    isInternshipMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-300' 
                      : 'bg-gray-100'
                  }
                />
                <p className={`text-xs ${
                  isInternshipMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Email cannot be changed from this page
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName" className={
                  isInternshipMode ? 'text-gray-300' : 'text-gray-700'
                }>
                  <User className="h-4 w-4 inline mr-2" />
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  className={
                    isInternshipMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white'
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className={
                  isInternshipMode ? 'text-gray-300' : 'text-gray-700'
                }>
                  <User className="h-4 w-4 inline mr-2" />
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  className={
                    isInternshipMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white'
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className={
                  isInternshipMode ? 'text-gray-300' : 'text-gray-700'
                }>
                  <User className="h-4 w-4 inline mr-2" />
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  className={
                    isInternshipMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white'
                  }
                />
              </div>

              <Button 
                onClick={updateProfile}
                disabled={loading}
                className={`w-full ${
                  isInternshipMode 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </CardContent>
          </Card>

          {/* Password Management */}
          <Card className={
            isInternshipMode 
              ? 'bg-gray-800/50 border-purple-500/30' 
              : 'bg-white'
          }>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  isInternshipMode ? 'bg-purple-600' : 'bg-blue-500'
                } text-white`}>
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className={`text-lg ${
                    isInternshipMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Security
                  </CardTitle>
                  <CardDescription className={
                    isInternshipMode ? 'text-gray-300' : 'text-gray-600'
                  }>
                    Manage your password and security settings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={changePassword}
                variant="outline"
                className={`w-full ${
                  isInternshipMode 
                    ? 'border-purple-500 text-purple-400 hover:bg-purple-500/10' 
                    : 'border-blue-500 text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
