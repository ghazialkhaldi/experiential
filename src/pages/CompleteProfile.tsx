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
import ExperientialLogo from "@/components/ExperientialLogo";

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
          <ExperientialLogo className="h-16 w-auto" />
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