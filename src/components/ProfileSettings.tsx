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

      // If volunteer_searcher, create organization
      if (formData.role === 'volunteer_searcher') {
        if (!formData.organizationName || !formData.address || !formData.city || !formData.state || !formData.zipCode) {
          toast({
            variant: "destructive",
            title: "Missing Required Fields",
            description: "Please fill in all required organization fields.",
          });
          setLoading(false);
          return;
        }

        const orgData = {
          user_id: user.id,
          name: formData.organizationName,
          category: formData.organizationCategory || null,
          description: formData.organizationDescription || null,
          address_line1: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode
        };

        const { error: orgError } = await supabase
          .from('organizations')
          .insert(orgData);

        if (orgError) {
          throw orgError;
        }
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
  console.log('ProfileSettings - User:', user);
  console.log('ProfileSettings - Profile:', profile);
  console.log('ProfileSettings - Profile role:', profile?.role);
  console.log('ProfileSettings - User metadata role:', user?.user_metadata?.role);
  
  // Check both profile.role and user_metadata.role
  const hasRole = profile?.role || user?.user_metadata?.role;
  
  if (hasRole) {
    console.log('ProfileSettings - Not showing, user has role:', hasRole);
    return null;
  }

  console.log('ProfileSettings - Showing profile settings');

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

          {formData.role === 'volunteer_searcher' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="organizationName" className={isInternshipMode ? 'text-purple-200' : ''}>Organization Name *</Label>
                <Input
                  id="organizationName"
                  value={formData.organizationName}
                  onChange={(e) => handleInputChange('organizationName', e.target.value)}
                  placeholder="Enter organization name"
                  className={isInternshipMode ? 'bg-gray-700/50 border-purple-500/30 text-purple-100 placeholder:text-purple-300' : ''}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizationCategory" className={isInternshipMode ? 'text-purple-200' : ''}>Category</Label>
                <Select value={formData.organizationCategory} onValueChange={(value) => handleInputChange('organizationCategory', value)}>
                  <SelectTrigger className={isInternshipMode ? 'bg-gray-700/50 border-purple-500/30 text-purple-100' : ''}>
                    <SelectValue placeholder="Select category (optional)" />
                  </SelectTrigger>
                  <SelectContent className={isInternshipMode ? 'bg-gray-700 border-gray-600' : ''}>
                    <SelectItem value="education" className={isInternshipMode ? 'text-purple-100 hover:bg-gray-600' : ''}>Education</SelectItem>
                    <SelectItem value="environment" className={isInternshipMode ? 'text-purple-100 hover:bg-gray-600' : ''}>Environment</SelectItem>
                    <SelectItem value="animal_care" className={isInternshipMode ? 'text-purple-100 hover:bg-gray-600' : ''}>Animal Care</SelectItem>
                    <SelectItem value="community_service" className={isInternshipMode ? 'text-purple-100 hover:bg-gray-600' : ''}>Community Service</SelectItem>
                    <SelectItem value="healthcare" className={isInternshipMode ? 'text-purple-100 hover:bg-gray-600' : ''}>Healthcare</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizationDescription" className={isInternshipMode ? 'text-purple-200' : ''}>Description</Label>
                <Textarea
                  id="organizationDescription"
                  value={formData.organizationDescription}
                  onChange={(e) => handleInputChange('organizationDescription', e.target.value)}
                  placeholder="Brief description (optional)"
                  className={isInternshipMode ? 'bg-gray-700/50 border-purple-500/30 text-purple-100 placeholder:text-purple-300' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className={isInternshipMode ? 'text-purple-200' : ''}>Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Street address"
                  className={isInternshipMode ? 'bg-gray-700/50 border-purple-500/30 text-purple-100 placeholder:text-purple-300' : ''}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="city" className={isInternshipMode ? 'text-purple-200' : ''}>City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={isInternshipMode ? 'bg-gray-700/50 border-purple-500/30 text-purple-100 placeholder:text-purple-300' : ''}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className={isInternshipMode ? 'text-purple-200' : ''}>State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className={isInternshipMode ? 'bg-gray-700/50 border-purple-500/30 text-purple-100 placeholder:text-purple-300' : ''}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode" className={isInternshipMode ? 'text-purple-200' : ''}>ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className={isInternshipMode ? 'bg-gray-700/50 border-purple-500/30 text-purple-100 placeholder:text-purple-300' : ''}
                  required
                />
              </div>
            </>
          )}

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