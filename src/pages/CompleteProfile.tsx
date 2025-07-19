import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useMode } from "@/contexts/ModeContext";
import { Users, Briefcase, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CompleteProfile = () => {
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
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { isInternshipMode } = useMode();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

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
      // First, update the user's profile with role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: formData.role as 'volunteer' | 'volunteer_searcher' })
        .eq('id', user.id);

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
        title: "Profile Complete!",
        description: "Your profile has been set up successfully.",
      });

      navigate('/');
    } catch (error) {
      console.error('Profile completion error:', error);
      toast({
        variant: "destructive",
        title: "Setup Error",
        description: "There was an error completing your profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isInternshipMode 
        ? 'bg-gradient-to-br from-purple-900 via-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 to-green-50'
    }`}>
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <Link to="/" className={`flex items-center transition-colors ${
            isInternshipMode 
              ? 'text-purple-300 hover:text-purple-400' 
              : 'text-gray-600 hover:text-blue-600'
          }`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
        
        <div className="flex items-center justify-center mb-8">
          <span className={`text-3xl font-bold ${
            isInternshipMode ? 'text-purple-200' : 'text-gray-900'
          }`}>
            E<span className="text-blue-500">x</span>per<span className="relative">ı<span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 text-blue-500 text-sm">•</span></span>ent<span className="relative">ı<span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 text-blue-500 text-sm">•</span></span>al<span className="text-blue-500">.</span>
          </span>
        </div>

        <Card className={isInternshipMode ? 'bg-gray-800/90 border-purple-500/30 backdrop-blur-sm' : ''}>
          <CardHeader className="text-center">
            <CardTitle className={`flex items-center justify-center gap-2 ${isInternshipMode ? 'text-purple-200' : ''}`}>
              {isInternshipMode ? <Briefcase className="h-5 w-5" /> : <Users className="h-5 w-5" />}
              Complete Your Profile
            </CardTitle>
            <CardDescription className={isInternshipMode ? 'text-purple-300' : ''}>
              Just one more step to get started
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
                    <Label htmlFor="organizationCategory" className={isInternshipMode ? 'text-purple-200' : ''}>Organization Category</Label>
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
                      placeholder="Brief description of your organization (optional)"
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

                  <div className="grid grid-cols-2 gap-4">
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
                {loading ? 'Setting up...' : 'Complete Setup'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompleteProfile;