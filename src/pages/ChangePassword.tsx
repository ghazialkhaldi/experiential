import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMode } from '@/contexts/ModeContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { isInternshipMode } = useMode();
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleBackNavigation = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    navigate('/edit-profile');
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePasswords = () => {
    if (!passwords.current) {
      toast({
        title: "Error",
        description: "Current password is required.",
        variant: "destructive",
      });
      return false;
    }

    if (!passwords.new) {
      toast({
        title: "Error",
        description: "New password is required.",
        variant: "destructive",
      });
      return false;
    }

    if (passwords.new.length < 6) {
      toast({
        title: "Error",
        description: "New password must be at least 6 characters long.",
        variant: "destructive",
      });
      return false;
    }

    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const changePassword = async () => {
    if (!validatePasswords()) return;

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      });

      if (error) throw error;

      toast({
        title: "Password changed",
        description: "Your password has been updated successfully.",
      });

      // Clear form
      setPasswords({
        current: '',
        new: '',
        confirm: ''
      });

      // Navigate back after a delay
      setTimeout(() => {
        navigate('/edit-profile');
      }, 1500);

    } catch (error: any) {
      console.error('Error changing password:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${
      isInternshipMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900' 
        : 'bg-gradient-to-br from-white via-blue-200 to-blue-400'
    }`}>
      {/* Content - Added top padding for iPhone notch */}
      <div className="p-4 pt-16">
        {/* Back Button and Title */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleBackNavigation}
            className={`mr-4 rounded-full ${
              isInternshipMode 
                ? 'text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-600/50' 
                : 'text-gray-700 hover:text-gray-900 bg-white hover:bg-white border border-gray-200'
            }`}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className={`text-xl font-semibold ${
            isInternshipMode ? 'text-white' : 'text-gray-900'
          }`}>
            Change Password
          </h1>
        </div>

        <Card className={
          isInternshipMode 
            ? 'bg-gray-800/50 border-purple-500/30' 
            : 'bg-white'
        }>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                isInternshipMode ? 'bg-purple-600' : 'bg-blue-500'
              } text-white`}>
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className={`text-lg ${
                  isInternshipMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Update Password
                </CardTitle>
                <CardDescription className={
                  isInternshipMode ? 'text-gray-300' : 'text-gray-600'
                }>
                  Choose a strong password to protect your account
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current" className={
                isInternshipMode ? 'text-gray-300' : 'text-gray-700'
              }>
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="current"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  className={
                    isInternshipMode 
                      ? 'bg-gray-700 border-gray-600 text-white pr-10' 
                      : 'bg-white pr-10'
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new" className={
                isInternshipMode ? 'text-gray-300' : 'text-gray-700'
              }>
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="new"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  className={
                    isInternshipMode 
                      ? 'bg-gray-700 border-gray-600 text-white pr-10' 
                      : 'bg-white pr-10'
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm" className={
                isInternshipMode ? 'text-gray-300' : 'text-gray-700'
              }>
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className={
                    isInternshipMode 
                      ? 'bg-gray-700 border-gray-600 text-white pr-10' 
                      : 'bg-white pr-10'
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className={`text-sm ${
              isInternshipMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <p>Password requirements:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>At least 6 characters long</li>
                <li>Include both letters and numbers</li>
                <li>Avoid common passwords</li>
              </ul>
            </div>

            <Button 
              onClick={changePassword}
              disabled={loading}
              className={`w-full ${
                isInternshipMode 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChangePassword;
