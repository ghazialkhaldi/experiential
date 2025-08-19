import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    birthday: '',
    role: 'volunteer',
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
  
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
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

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Google Login Failed",
          description: error.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Google Login Failed",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!acceptedTerms) {
      toast({
        variant: "destructive",
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue.",
      });
      setLoading(false);
      return;
    }

    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      
      // Store additional signup data for post-confirmation processing
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

      const { error } = await supabase.auth.signUp({
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
        description: "Please check your email to verify your account.",
      });

      // Reset form
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        birthday: '',
        role: 'volunteer',
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Back button - only show when on signup page */}
      {!isLogin && (
        <div className="pt-16 px-4 pb-4">
          <Button 
            variant="ghost" 
            onClick={() => setIsLogin(true)}
            className="flex items-center text-gray-600 hover:text-gray-900 p-2"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Sign In
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            
            <p className="text-gray-600">
              {isLogin 
                ? 'Sign in to your volunteer account' 
                : 'Join our volunteer community'
              }
            </p>
          </div>

        {/* Auth Form */}
        <div className="space-y-6">
          <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                className="h-12 border-gray-300 focus:border-blue-500"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                className="h-12 border-gray-300 focus:border-blue-500"
                required
              />
            </div>

            {/* Signup Fields */}
            {!isLogin && (
              <>
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="First name"
                      className="h-12 border-gray-300 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Last name"
                      className="h-12 border-gray-300 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Birthday */}
                <div className="space-y-2">
                  <Label htmlFor="birthday" className="text-gray-700">
                    Birthday
                  </Label>
                  <Input
                    id="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => handleInputChange('birthday', e.target.value)}
                    className="h-12 border-gray-300 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Role Selection */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-gray-700">
                    I am a...
                  </Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="volunteer">Student/Volunteer</SelectItem>
                      <SelectItem value="volunteer_searcher">Organization Looking for Volunteers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Organization Fields */}
                {formData.role === 'volunteer_searcher' && (
                  <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700">
                      Organization Information
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="organizationName" className="text-gray-700">
                        Organization Name *
                      </Label>
                      <Input
                        id="organizationName"
                        value={formData.organizationName}
                        onChange={(e) => handleInputChange('organizationName', e.target.value)}
                        placeholder="Enter organization name"
                        className="h-12 border-gray-300 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organizationCategory" className="text-gray-700">
                        Organization Category *
                      </Label>
                      <Select value={formData.organizationCategory} onValueChange={(value) => handleInputChange('organizationCategory', value)}>
                        <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500">
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
                      <Label htmlFor="organizationDescription" className="text-gray-700">
                        Organization Description (Optional)
                      </Label>
                      <Input
                        id="organizationDescription"
                        value={formData.organizationDescription}
                        onChange={(e) => handleInputChange('organizationDescription', e.target.value)}
                        placeholder="Brief description of your organization"
                        className="h-12 border-gray-300 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-gray-700">
                        Address *
                      </Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Street address"
                        className="h-12 border-gray-300 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-gray-700">
                          City *
                        </Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="City"
                          className="h-12 border-gray-300 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-gray-700">
                          State *
                        </Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          placeholder="State"
                          className="h-12 border-gray-300 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode" className="text-gray-700">
                        ZIP Code *
                      </Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        placeholder="ZIP Code"
                        className="h-12 border-gray-300 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Volunteer Preferences */}
                {formData.role === 'volunteer' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-gray-700">
                        Age
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        min="13"
                        max="100"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        placeholder="Your age"
                        className="h-12 border-gray-300 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="text-gray-700">
                        Volunteer Interests (Optional)
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {categories.map((category) => (
                          <div key={category.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={category.value}
                              checked={formData.preferences.includes(category.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    preferences: [...prev.preferences, category.value]
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    preferences: prev.preferences.filter(p => p !== category.value)
                                  }));
                                }
                              }}
                              className="border-gray-300"
                            />
                            <Label htmlFor={category.value} className="text-gray-700">
                              {category.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Terms and Conditions */}
                <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                      className="mt-1 border-gray-300"
                    />
                    <div className="text-sm leading-relaxed">
                      <Label htmlFor="terms" className="font-semibold cursor-pointer block mb-2 text-gray-700">
                        I agree to the following terms: *
                      </Label>
                      <div className="space-y-2 text-gray-600">
                        <p className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>
                            I have read and agree to the{' '}
                            <a 
                              href="https://experiential.care/legal"
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 underline font-semibold"
                            >
                              Terms and Conditions
                            </a>
                          </span>
                        </p>
                        <p className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>
                            I have read and agree to the{' '}
                            <a 
                              href="https://experiential.care/legal"
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 underline font-semibold"
                            >
                              Privacy Policy
                            </a>
                          </span>
                        </p>
                        <p className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>I consent to receive important account and service updates via email</span>
                        </p>
                        <p className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>I understand that I must be at least 13 years old to use this service</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              disabled={loading || (!isLogin && !acceptedTerms)}
            >
              {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          {/* Google Auth for Login */}
          {isLogin && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    OR CONTINUE WITH
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-gray-300 hover:bg-gray-50"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
            </>
          )}

          {/* Toggle Login/Signup */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
