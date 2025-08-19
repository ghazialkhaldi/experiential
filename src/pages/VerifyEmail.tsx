import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Mail, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useMode } from "@/contexts/ModeContext";

const VerifyEmail = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isInternshipMode } = useMode();

  useEffect(() => {
    // Get email from URL params or localStorage
    const emailParam = searchParams.get('email');
    const storedEmail = localStorage.getItem('pendingVerificationEmail');
    
    if (emailParam) {
      setEmail(emailParam);
      localStorage.setItem('pendingVerificationEmail', emailParam);
    } else if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // No email found, redirect to auth
      navigate('/auth');
    }
  }, [searchParams, navigate]);

  const handleVerification = async () => {
    if (verificationCode.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code.",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting to verify OTP for email:', email, 'with code:', verificationCode);
      
      // Verify the OTP code
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: verificationCode,
        type: 'signup'
      });

      console.log('OTP verification result:', { data, error });

      if (error) {
        console.error('OTP verification error:', error);
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: error.message,
        });
        return;
      }

      if (data.user) {
        toast({
          title: "Email Verified!",
          description: "Your account has been verified successfully.",
        });

        // Clean up stored email
        localStorage.removeItem('pendingVerificationEmail');

        // Process any pending signup data
        const pendingDataStr = localStorage.getItem('pendingSignupData');
        if (pendingDataStr) {
          // Redirect to auth callback to process pending data
          navigate('/auth/callback');
        } else {
          // Check if profile needs completion
          const { data: profileData } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .maybeSingle();

          if (!profileData?.role) {
            navigate('/complete-profile');
          } else {
            navigate('/');
          }
        }
      }
    } catch (error) {
      console.error('Verification catch error:', error);
      toast({
        variant: "destructive",
        title: "Verification Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "No Email Found",
        description: "Please return to the signup page and try again.",
      });
      return;
    }

    setResendLoading(true);

    try {
      console.log('Attempting to resend OTP for email:', email);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      console.log('Resend OTP result:', { error });

      if (error) {
        console.error('Resend error:', error);
        toast({
          variant: "destructive",
          title: "Resend Failed",
          description: error.message,
        });
      } else {
        toast({
          title: "Code Sent!",
          description: "A new verification code has been sent to your email.",
        });
      }
    } catch (error) {
      console.error('Resend catch error:', error);
      toast({
        variant: "destructive",
        title: "Resend Error",
        description: "Failed to resend verification code. Please try again.",
      });
    } finally {
      setResendLoading(false);
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
          <Link to="/auth" className={`flex items-center transition-colors ${
            isInternshipMode 
              ? 'text-purple-300 hover:text-purple-400' 
              : 'text-gray-600 hover:text-blue-600'
          }`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign In
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
          <CardHeader className="text-center">
            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
              isInternshipMode ? 'bg-purple-500/20' : 'bg-blue-100'
            }`}>
              <Mail className={`h-6 w-6 ${isInternshipMode ? 'text-purple-300' : 'text-blue-600'}`} />
            </div>
            <CardTitle className={isInternshipMode ? 'text-purple-200' : ''}>
              Verify Your Email
            </CardTitle>
            <CardDescription className={isInternshipMode ? 'text-purple-300' : ''}>
              We've sent a 6-digit verification code to<br />
              <span className="font-medium">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <InputOTP
                maxLength={6}
                value={verificationCode}
                onChange={(value) => setVerificationCode(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              <Button
                onClick={handleVerification}
                disabled={loading || verificationCode.length !== 6}
                className={`w-full ${
                  isInternshipMode 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {loading ? "Verifying..." : "Verify Email"}
              </Button>
            </div>

            <div className="text-center space-y-2">
              <p className={`text-sm ${isInternshipMode ? 'text-purple-300' : 'text-gray-600'}`}>
                Didn't receive the code?
              </p>
              <Button
                variant="ghost"
                onClick={handleResendCode}
                disabled={resendLoading}
                className={`text-sm ${
                  isInternshipMode 
                    ? 'text-purple-300 hover:text-purple-200 hover:bg-purple-500/20' 
                    : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                }`}
              >
                {resendLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Resend code"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;