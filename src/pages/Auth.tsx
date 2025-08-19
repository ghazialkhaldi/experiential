
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

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const redirectUrl = `https://www.experiential.care`;
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
      const redirectUrl = `https://www.experiential.care`;
      
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

      // Store email for verification page
      localStorage.setItem('pendingVerificationEmail', formData.email);
      
      toast({
        title: "Account Created!",
        description: "Please check your email for a 6-digit verification code.",
      });

      // Always redirect to verification page - let it handle whether verification is needed
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);

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
        
        <div className="flex items-center justify-center mb-12">
          <span className={`text-3xl font-bold ${
            isInternshipMode ? 'text-purple-200' : 'text-gray-900'
          }`}>
            E<span className="text-blue-500">x</span>per<span className="relative">ı<span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 text-blue-500 text-sm">•</span></span>ent<span className="relative">ı<span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 text-blue-500 text-sm">•</span></span>al<span className="text-blue-500">.</span>
          </span>
        </div>

        <Card className={isInternshipMode ? 'bg-gray-800/90 border-purple-500/30 backdrop-blur-sm' : ''}>
          <CardHeader>
            <CardTitle className={isInternshipMode ? 'text-purple-200' : ''}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className={isInternshipMode ? 'text-purple-300' : ''}>
              {isLogin 
                ? `Sign in to your ${isInternshipMode ? 'career' : 'volunteer'} account` 
                : `Join our community of ${isInternshipMode ? 'professionals' : 'volunteers'}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className={isInternshipMode ? 'text-purple-200' : ''}>Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={isInternshipMode ? 'bg-gray-700/50 border-purple-500/30 text-purple-100 placeholder:text-purple-300' : ''}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className={isInternshipMode ? 'text-purple-200' : ''}>Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={isInternshipMode ? 'bg-gray-700/50 border-purple-500/30 text-purple-100 placeholder:text-purple-300' : ''}
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
                      <Label htmlFor="firstName" className={isInternshipMode ? 'text-purple-200' : ''}>First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={isInternshipMode ? 'bg-gray-700/50 border-purple-500/30 text-purple-100 placeholder:text-purple-300' : ''}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className={isInternshipMode ? 'text-purple-200' : ''}>Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={isInternshipMode ? 'bg-gray-700/50 border-purple-500/30 text-purple-100 placeholder:text-purple-300' : ''}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthday" className={isInternshipMode ? 'text-purple-200' : ''}>Birthday</Label>
                    <Input
                      id="birthday"
                      type="date"
                      value={formData.birthday}
                      onChange={(e) => handleInputChange('birthday', e.target.value)}
                      className={isInternshipMode ? 'bg-gray-700/50 border-purple-500/30 text-purple-100 placeholder:text-purple-300' : ''}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className={isInternshipMode ? 'text-purple-200' : ''}>I am a...</Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                      <SelectTrigger className={isInternshipMode ? 'bg-gray-700/50 border-purple-500/30 text-purple-100' : ''}>
                        <SelectValue placeholder="Select your role" className={isInternshipMode ? 'text-purple-300' : ''} />
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
                         <Label htmlFor="organizationCategory" className={isInternshipMode ? 'text-purple-200' : ''}>Organization Category *</Label>
                         <Select value={formData.organizationCategory} onValueChange={(value) => handleInputChange('organizationCategory', value)}>
                           <SelectTrigger className={isInternshipMode ? 'bg-gray-700/50 border-purple-500/30 text-purple-100' : ''}>
                             <SelectValue placeholder="Select organization category" className={isInternshipMode ? 'text-purple-300' : ''} />
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
                         <Label htmlFor="organizationDescription" className={isInternshipMode ? 'text-purple-200' : ''}>Organization Description (optional)</Label>
                         <Input
                           id="organizationDescription"
                           value={formData.organizationDescription}
                           onChange={(e) => handleInputChange('organizationDescription', e.target.value)}
                           placeholder="Brief description of your organization"
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
                             placeholder="City"
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
                             placeholder="State"
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
                           placeholder="ZIP Code"
                           className={isInternshipMode ? 'bg-gray-700/50 border-purple-500/30 text-purple-100 placeholder:text-purple-300' : ''}
                           required
                         />
                       </div>
                    </>
                  )}

                  {formData.role === 'volunteer' && (
                    <>
                       <div className="space-y-2">
                         <Label htmlFor="age" className={isInternshipMode ? 'text-purple-200' : ''}>Age (optional)</Label>
                         <Input
                           id="age"
                           type="number"
                           value={formData.age}
                           onChange={(e) => handleInputChange('age', e.target.value)}
                           placeholder="Enter your age"
                           className={isInternshipMode ? 'bg-gray-700/50 border-purple-500/30 text-purple-100 placeholder:text-purple-300' : ''}
                         />
                       </div>

                       <div className="space-y-3">
                         <Label className={isInternshipMode ? 'text-purple-200' : ''}>
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
                                 className={isInternshipMode ? 'border-purple-500/30 data-[state=checked]:bg-purple-600' : ''}
                               />
                               <Label htmlFor={category.value} className={`text-sm font-normal ${isInternshipMode ? 'text-purple-200' : ''}`}>
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

               {!isLogin && (
                 <div className="flex items-start space-x-2 mt-4">
                   <Checkbox
                     id="terms"
                     checked={acceptedTerms}
                     onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                     className={isInternshipMode ? 'border-purple-500/30 data-[state=checked]:bg-purple-600 mt-1' : 'mt-1'}
                   />
                   <Label htmlFor="terms" className={`text-sm leading-relaxed ${isInternshipMode ? 'text-purple-200' : 'text-gray-600'}`}>
                     I agree to the{' '}
                     <a 
                       href={`${window.location.origin}/legal`}
                       target="_blank" 
                       rel="noopener noreferrer"
                       className={`underline ${isInternshipMode ? 'text-purple-300 hover:text-purple-400' : 'text-blue-600 hover:text-blue-700'}`}
                     >
                       Terms and Conditions and Privacy Policy
                     </a>
                   </Label>
                 </div>
               )}

              <Button type="submit" className="w-full" disabled={loading || (!isLogin && !acceptedTerms)}>
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            {isLogin && (
              <>
                <div className="mt-6 relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className={`px-2 ${isInternshipMode ? 'bg-gray-800 text-purple-300' : 'bg-white text-gray-500'}`}>
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className={`w-full mt-4 transition-all duration-200 hover:scale-105 ${
                    isInternshipMode 
                      ? 'bg-gray-700/50 border-purple-500/30 text-purple-100 hover:bg-gray-600/50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {loading ? 'Please wait...' : 'Continue with Google'}
                </Button>
              </>
            )}

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className={`text-sm transition-colors hover:underline ${
                  isInternshipMode ? 'text-purple-300 hover:text-purple-400' : 'text-blue-600 hover:text-blue-700'
                }`}
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
