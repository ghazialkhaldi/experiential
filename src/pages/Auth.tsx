
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users, ArrowLeft, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { useMode } from "@/contexts/ModeContext";
import type { Database } from "@/integrations/supabase/types";

type VolunteerCategory = Database['public']['Enums']['volunteer_category'];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const { isInternshipMode } = useMode();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    birthday: '',
    role: '',
    age: '',
    preferences: [] as string[],
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

  const categories = [
    { value: 'education', label: 'Education' },
    { value: 'environment', label: 'Environment' },
    { value: 'animal_care', label: 'Animal Care' },
    { value: 'community_service', label: 'Community Service' },
    { value: 'healthcare', label: 'Healthcare' }
  ];

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validate password for signup form
    if (field === 'password' && !isLogin) {
      validatePassword(value);
    }
  };

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one capital letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    setPasswordErrors(errors);
  };

  const validatePasswordSync = (password: string) => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one capital letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return errors;
  };

  const handlePreferenceChange = (category: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences: checked 
        ? [...prev.preferences, category]
        : prev.preferences.filter(p => p !== category)
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.message,
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Check password validation for signup
    const errors = validatePasswordSync(formData.password);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      toast({
        variant: "destructive",
        title: "Password Requirements Not Met",
        description: "Please fix the password requirements before signing up.",
      });
      setLoading(false);
      return;
    }

    try {
      const redirectUrl = `${window.location.origin}/auth-callback`;
      
      console.log('Signup data being stored:', {
        preferences: formData.preferences,
        organizationData: formData.role === 'volunteer_searcher' ? {
          name: formData.organizationName,
          category: formData.organizationCategory,
          description: formData.organizationDescription || null,
          address_line1: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode
        } : null
      });
      
      // Store additional signup data in localStorage for post-confirmation processing
      const additionalData = {
        preferences: formData.preferences,
        organizationData: formData.role === 'volunteer_searcher' ? {
          name: formData.organizationName,
          category: formData.organizationCategory,
          description: formData.organizationDescription || null,
          address_line1: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode
        } : null
      };
      
      localStorage.setItem('pendingSignupData', JSON.stringify(additionalData));

      const metadata: any = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        birthday: formData.birthday,
        role: formData.role,
      };

      if (formData.role === 'volunteer' && formData.age) {
        metadata.age = parseInt(formData.age);
      }

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata
        }
      });

      if (error) {
        localStorage.removeItem('pendingSignupData');
        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: error.message,
        });
        return;
      }

      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account. After verification, you'll be redirected to complete your profile setup.",
      });

      // Reset form
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        birthday: '',
        role: '',
        age: '',
        preferences: [],
        organizationName: '',
        organizationCategory: '',
        organizationDescription: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
      });

    } catch (error) {
      localStorage.removeItem('pendingSignupData');
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isInternshipMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 to-green-50'
    }`}>
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Link to="/" className={`flex items-center mb-4 transition-colors ${
            isInternshipMode 
              ? 'text-gray-300 hover:text-blue-400' 
              : 'text-gray-600 hover:text-blue-600'
          }`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
        
        <div className="flex items-center justify-center mb-8">
          {isInternshipMode ? (
            <Briefcase className="h-8 w-8 text-blue-400 mr-2" />
          ) : (
            <Users className="h-8 w-8 text-blue-600 mr-2" />
          )}
          <span className={`text-2xl font-bold ${
            isInternshipMode ? 'text-white' : 'text-gray-900'
          }`}>
            {isInternshipMode ? 'InternshipHub' : 'VolunteerHub'}
          </span>
        </div>

        <Card className={isInternshipMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className={isInternshipMode ? 'text-white' : ''}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className={isInternshipMode ? 'text-gray-300' : ''}>
              {isLogin 
                ? `Sign in to your ${isInternshipMode ? 'career' : 'volunteer'} account` 
                : `Join our community of ${isInternshipMode ? 'professionals' : 'volunteers'}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
                {!isLogin && passwordErrors.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {passwordErrors.map((error, index) => (
                      <p key={index} className="text-sm text-red-600">
                        • {error}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthday">Birthday</Label>
                    <Input
                      id="birthday"
                      type="date"
                      value={formData.birthday}
                      onChange={(e) => handleInputChange('birthday', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">I am a...</Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent className={isInternshipMode ? 'bg-gray-700 border-gray-600' : ''}>
                        <SelectItem value="volunteer">
                          {isInternshipMode ? 'Job Seeker' : 'Volunteer'}
                        </SelectItem>
                        <SelectItem value="volunteer_searcher">
                          {isInternshipMode ? 'Looking for Talent' : 'Looking for Volunteers'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.role === 'volunteer_searcher' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="organizationName">Organization Name *</Label>
                        <Input
                          id="organizationName"
                          value={formData.organizationName}
                          onChange={(e) => handleInputChange('organizationName', e.target.value)}
                          placeholder="Enter organization name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="organizationCategory">Organization Category *</Label>
                        <Select value={formData.organizationCategory} onValueChange={(value) => handleInputChange('organizationCategory', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select organization category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="environment">Environment</SelectItem>
                            <SelectItem value="animal_care">Animal Care</SelectItem>
                            <SelectItem value="community_service">Community Service</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="organizationDescription">Organization Description (optional)</Label>
                        <Input
                          id="organizationDescription"
                          value={formData.organizationDescription}
                          onChange={(e) => handleInputChange('organizationDescription', e.target.value)}
                          placeholder="Brief description of your organization"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address *</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          placeholder="Street address"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            placeholder="City"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State *</Label>
                          <Input
                            id="state"
                            value={formData.state}
                            onChange={(e) => handleInputChange('state', e.target.value)}
                            placeholder="State"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          placeholder="ZIP Code"
                          required
                        />
                      </div>
                    </>
                  )}

                  {formData.role === 'volunteer' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="age">Age (optional)</Label>
                        <Input
                          id="age"
                          type="number"
                          value={formData.age}
                          onChange={(e) => handleInputChange('age', e.target.value)}
                          placeholder="Enter your age"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className={isInternshipMode ? 'text-gray-300' : ''}>
                          {isInternshipMode ? 'Career Interests (optional)' : 'Volunteer Interests (optional)'}
                        </Label>
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <div key={category.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={category.value}
                                checked={formData.preferences.includes(category.value)}
                                onCheckedChange={(checked) => 
                                  handlePreferenceChange(category.value, checked as boolean)
                                }
                              />
                              <Label htmlFor={category.value} className="text-sm font-normal">
                                {category.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:underline text-sm"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
