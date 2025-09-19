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
import { User, Building, Building2, AlertCircle } from "lucide-react";

const ProfileSettings = () => {
  const [loading, setLoading] = useState(false);
  const [showOrgSetup, setShowOrgSetup] = useState(false);
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

  const handleRoleSubmit = async (e: React.FormEvent) => {
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

      // If user selected volunteer_searcher, show organization setup
      if (formData.role === 'volunteer_searcher') {
        setShowOrgSetup(true);
      } else {
        // For volunteers, just refresh the page
        window.location.reload();
      }
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

  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      const requiredFields = [
        { field: 'organizationName', label: 'Organization Name' },
        { field: 'address', label: 'Address' },
        { field: 'city', label: 'City' },
        { field: 'state', label: 'State' },
        { field: 'zipCode', label: 'ZIP Code' }
      ];
      
      const missingFields = requiredFields.filter(
        ({ field }) => !formData[field as keyof typeof formData]?.trim()
      );

      if (missingFields.length > 0) {
        toast({
          variant: "destructive",
          title: "Missing Required Fields",
          description: `Please fill in: ${missingFields.map(f => f.label).join(', ')}`,
        });
        return;
      }

      const orgPayload = {
        user_id: user.id,
        name: formData.organizationName,
        category: formData.organizationCategory || null,
        description: formData.organizationDescription || null,
        address_line1: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode
      };

      const { error } = await supabase
        .from('organizations')
        .insert(orgPayload);

      if (error) {
        throw error;
      }

      toast({
        title: "Organization Setup Complete!",
        description: "Your organization has been set up successfully.",
      });

      // Reset form and refresh page
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
      setShowOrgSetup(false);
      window.location.reload();
    } catch (error) {
      console.error('Organization setup error:', error);
      toast({
        variant: "destructive",
        title: "Setup Error",
        description: "There was an error setting up your organization. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Only show for authenticated users without a profile role
  // And only for Google users (check for Google metadata)
  if (!user || profile?.role) {
    return null;
  }

  // Check if this is a Google user by looking for Google-specific metadata
  const isGoogleUser = user?.app_metadata?.provider === 'google' || 
                       user?.user_metadata?.iss === 'https://accounts.google.com' ||
                       user?.user_metadata?.provider === 'google' ||
                       user?.user_metadata?.sub?.startsWith('google-oauth2|');

  // Only show for Google users
  if (!isGoogleUser) {
    return null;
  }

  console.log('ProfileSettings - User:', user);
  console.log('ProfileSettings - Profile:', profile);
  console.log('ProfileSettings - User raw_user_meta_data:', user?.user_metadata);

  // Show organization setup if user selected volunteer_searcher
  if (showOrgSetup) {
    return (
      <Card className={`mt-4 ${isInternshipMode ? 'bg-gray-800/90 border-purple-500/30' : ''}`}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-orange-500" />
            <CardTitle className={isInternshipMode ? 'text-purple-200' : ''}>Organization Information Required</CardTitle>
          </div>
          <CardDescription className={isInternshipMode ? 'text-purple-300' : ''}>
            Please complete your organization profile to post opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleOrgSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="organizationName" className={isInternshipMode ? 'text-purple-200' : ''}>Organization Name *</Label>
              <Input
                id="organizationName"
                value={formData.organizationName}
                onChange={(e) => handleInputChange('organizationName', e.target.value)}
                placeholder="Enter organization name"
                className={isInternshipMode ? 'bg-gray-700/50 border-purple-500/30 text-purple-100' : ''}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizationCategory" className={isInternshipMode ? 'text-purple-200' : ''}>Organization Category</Label>
              <Select 
                value={formData.organizationCategory} 
                onValueChange={(value) => handleInputChange('organizationCategory', value)}
              >
                <SelectTrigger className={isInternshipMode ? 'bg-gray-700/50 border-purple-500/30 text-purple-100' : ''}>
                  <SelectValue placeholder="Select organization category" />
                </SelectTrigger>
                <SelectContent className={isInternshipMode ? 'bg-gray-700 border-gray-600' : ''}>
                  <SelectItem value="education" className={isInternshipMode ? 'text-purple-100 hover:bg-gray-600' : ''}>Education</SelectItem>
                  <SelectItem value="environment" className={isInternshipMode ? 'text-purple-100 hover:bg-gray-600' : ''}>Environment</SelectItem>
                  <SelectItem value="animal_care" className={isInternshipMode ? 'text-purple-100 hover:bg-gray-600' : ''}>Animal Care</SelectItem>
                  <SelectItem value="community_service" className={isInternshipMode ? 'text-purple-100 hover:bg-gray-600' : ''}>Community Service</SelectItem>
                  <SelectItem value="healthcare" className={isInternshipMode ? 'text-purple-100 hover:bg-gray-600' : ''}>Healthcare</SelectItem>
                  <SelectItem value="other" className={isInternshipMode ? 'text-purple-100 hover:bg-gray-600' : ''}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizationDescription" className={isInternshipMode ? 'text-purple-200' : ''}>Organization Description</Label>
              <Input
                id="organizationDescription"
                value={formData.organizationDescription}
                onChange={(e) => handleInputChange('organizationDescription', e.target.value)}
                placeholder="Brief description of your organization"
                className={isInternshipMode ? 'bg-gray-700/50 border-purple-500/30 text-purple-100' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className={isInternshipMode ? 'text-purple-200' : ''}>Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Street address"
                className={isInternshipMode ? 'bg-gray-700/50 border-purple-500/30 text-purple-100' : ''}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className={isInternshipMode ? 'text-purple-200' : ''}>City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="City"
                  className={isInternshipMode ? 'bg-gray-700/50 border-purple-500/30 text-purple-100' : ''}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className={isInternshipMode ? 'text-purple-200' : ''}>State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="State"
                  className={isInternshipMode ? 'bg-gray-700/50 border-purple-500/30 text-purple-100' : ''}
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
                placeholder="ZIP Code"
                className={isInternshipMode ? 'bg-gray-700/50 border-purple-500/30 text-purple-100' : ''}
                required
              />
            </div>

            <Button 
              type="submit" 
              className={`w-full ${
                isInternshipMode 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Complete Setup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
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
        <form onSubmit={handleRoleSubmit} className="space-y-4">
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