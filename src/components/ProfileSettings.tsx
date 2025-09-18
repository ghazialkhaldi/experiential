import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useMode } from "@/contexts/ModeContext";
import { User, Building } from "lucide-react";

const ProfileSettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    organizationName: '',
    organizationCategory: '',
    organizationDescription: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { isInternshipMode } = useMode();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get user data from user_metadata (Supabase stores Google data here)
      const userData = user?.user_metadata || {};
      
      console.log('ProfileSettings - User metadata:', userData);
      
      // Extract name from Google data - could be in 'name', 'full_name', or separate fields
      let firstName = userData.first_name || userData.given_name || '';
      let lastName = userData.last_name || userData.family_name || '';
      
      // If we have full_name but not separate fields, try to split it
      if (!firstName && !lastName && userData.full_name) {
        const nameParts = userData.full_name.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }
      
      // If still no name, use the name field
      if (!firstName && userData.name) {
        const nameParts = userData.name.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }

      // First, ensure the user's profile record exists and update it with role
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          email: user.email,
          first_name: firstName || 'User',
          last_name: lastName || '',
          birthday: userData.birthday || '1990-01-01', // Default birthday
          role: formData.role as 'volunteer' | 'volunteer_searcher',
          age: null // Will be calculated if birthday exists
        }, { 
          onConflict: 'id' 
        });

      if (profileError) {
        throw profileError;
      }


      toast({
        title: "Profile Updated!",
        description: "Your profile has been updated successfully.",
      });

      // Reset form
      setFormData({
        role: '',
        organizationName: '',
        organizationCategory: '',
        organizationDescription: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
      });

      // Refresh the page to update the UI
      window.location.reload();
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        variant: "destructive",
        title: "Update Error",
        description: "There was an error updating your profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Don't show if user already has a role in profiles table
  // Show for users without profiles (like Google users) or users with incomplete profiles
  if (profile?.role) {
    return null;
  }

  console.log('ProfileSettings - User:', user);
  console.log('ProfileSettings - Profile:', profile);
  console.log('ProfileSettings - User raw_user_meta_data:', user?.user_metadata);

  return (
    <Card className={`mt-4 ${isInternshipMode ? 'bg-gray-800/90 border-purple-500/30' : ''}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 text-lg ${isInternshipMode ? 'text-purple-200' : ''}`}>
          <User className="h-5 w-5" />
          Complete Your Profile
        </CardTitle>
        <CardDescription className={isInternshipMode ? 'text-purple-300' : ''}>
          Please complete your profile to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role" className={isInternshipMode ? 'text-purple-200' : ''}>I am a...</Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
              <SelectTrigger className={isInternshipMode ? 'bg-gray-700/50 border-purple-500/30 text-purple-100' : ''}>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent className={isInternshipMode ? 'bg-gray-700 border-gray-600' : ''}>
                <SelectItem value="volunteer" className={isInternshipMode ? 'text-purple-100 hover:bg-gray-600' : ''}>
                  {isInternshipMode ? 'Job Seeker' : 'Volunteer'}
                </SelectItem>
                <SelectItem value="volunteer_searcher" className={isInternshipMode ? 'text-purple-100 hover:bg-gray-600' : ''}>
                  {isInternshipMode ? 'Looking for Talent' : 'Looking for Volunteers'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>


          <Button 
            type="submit" 
            className={`w-full ${
              isInternshipMode 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={loading || !formData.role}
          >
            {loading ? 'Updating...' : 'Save Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;