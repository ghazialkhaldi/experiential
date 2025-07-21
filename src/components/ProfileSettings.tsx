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
      // First, ensure the user's profile record exists and update it with role
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          birthday: user.user_metadata?.birthday || null,
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

  // Don't show if user already has a role in profiles table OR in user_metadata
  const hasRole = profile?.role || user?.user_metadata?.role;
  
  if (hasRole) {
    return null;
  }

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