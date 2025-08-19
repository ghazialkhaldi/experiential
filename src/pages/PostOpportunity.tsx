import React, { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Users, Clock, FileText, Briefcase, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";
import { useMode } from '@/contexts/ModeContext';
import AuthButton from "@/components/AuthButton";
<<<<<<< HEAD
import ExperientialLogo from "@/components/ExperientialLogo";
=======
>>>>>>> origin/main
import { format } from "date-fns";
import { cn } from "@/lib/utils";


const PostOpportunity = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { isInternshipMode } = useMode();
  const { organization, loading, hasIncompleteOrganization, hasIncompleteOrgData, profile } = useProfile();
  const [submitting, setSubmitting] = useState(false);


  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    time_commitment: '',
    requirements: '',
    max_volunteers: '',
    expires_at: '',
    resume_required: false
  });

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!organization) {
      toast({
        title: "Error",
        description: "You must be an organization to post opportunities.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      const location = `${organization.address_line1}, ${organization.city}, ${organization.state} ${organization.zip_code}`;
      
      const { error } = await supabase
        .from('opportunities')
        .insert({
          organization_id: organization.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          time_commitment: formData.time_commitment,
          requirements: formData.requirements,
          location: location,
          max_volunteers: formData.max_volunteers ? parseInt(formData.max_volunteers) : null,
          expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
          start_date: startDate ? format(startDate, 'yyyy-MM-dd') : null,
          end_date: endDate ? format(endDate, 'yyyy-MM-dd') : null,
          opportunity_type: isInternshipMode ? 'internship' : 'volunteer',
          resume_required: formData.resume_required
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success!",
        description: "Your opportunity has been posted successfully."
      });

      navigate('/');
    } catch (error) {
      console.error('Error posting opportunity:', error);
      toast({
        title: "Error",
        description: "Failed to post opportunity. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Please sign in to post opportunities.</p>
            <AuthButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }


  if (!organization && profile?.role === 'volunteer_searcher') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Only organizations can post opportunities. Please contact support if you need to register your organization.</p>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Only volunteers with organization accounts can post opportunities.</p>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      isInternshipMode 
        ? 'bg-gray-900' 
        : 'bg-gradient-to-br from-blue-50 to-green-50'
    }`}>
      {/* Navigation */}
      <nav className={`shadow-sm border-b ${
        isInternshipMode 
          ? 'bg-gray-800/80 backdrop-blur-md border-gray-700' 
          : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              {isInternshipMode ? (
                <Briefcase className="h-8 w-8 text-blue-400" />
              ) : null}
<<<<<<< HEAD
              <Link to="/" className="flex items-center">
                <ExperientialLogo className="h-12 w-auto" />
              </Link>
=======
              <span className={`text-2xl font-bold ${
                isInternshipMode ? 'text-white' : 'text-gray-900'
              }`}>
                {isInternshipMode ? (
                  <img src="/Experiential.jpeg" alt="Experiential Logo" className="h-16 w-auto brightness-0 invert" />
                ) : (
                  <img src="/Experiential.jpeg" alt="Experiential Logo" className="h-16 w-auto" />
                )}
              </span>
>>>>>>> origin/main
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/" className={`font-medium ${
                isInternshipMode 
                  ? 'text-gray-300 hover:text-blue-400' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}>
                {isInternshipMode ? 'Internships' : 'Opportunities'}
              </Link>
              <Link to="/resources" className={`font-medium ${
                isInternshipMode 
                  ? 'text-gray-300 hover:text-blue-400' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}>
                {isInternshipMode ? 'Career Resources' : 'University Resources'}
              </Link>
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link to="/">
          <Button variant="ghost" className={`mb-4 ${
            isInternshipMode 
              ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
              : ''
          }`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {isInternshipMode ? 'Internships' : 'Opportunities'}
          </Button>
        </Link>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Card className={isInternshipMode ? 'bg-gray-800/80 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className={`text-2xl flex items-center ${
              isInternshipMode ? 'text-white' : ''
            }`}>
              {isInternshipMode ? (
                <Briefcase className="h-6 w-6 mr-2 text-blue-400" />
              ) : (
                <FileText className="h-6 w-6 mr-2 text-blue-600" />
              )}
              {isInternshipMode ? 'Post New Internship' : 'Post New Opportunity'}
            </CardTitle>
            <CardDescription className={isInternshipMode ? 'text-gray-300' : ''}>
              Create {isInternshipMode ? 'an internship opportunity' : 'a volunteer opportunity'} for {organization.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className={isInternshipMode ? 'text-gray-300' : ''}>Opportunity Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Animal Shelter Assistant"
                  className={isInternshipMode ? 'bg-gray-700/50 border-gray-600 text-gray-200' : ''}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className={isInternshipMode ? 'text-gray-300' : ''}>Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className={isInternshipMode ? 'bg-gray-700/50 border-gray-600 text-gray-200' : ''}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className={isInternshipMode ? 'bg-gray-700 border-gray-600' : ''}>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="environment">Environment</SelectItem>
                    <SelectItem value="animal_care">Animal Care</SelectItem>
                    <SelectItem value="community_service">Community Service</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className={isInternshipMode ? 'text-gray-300' : ''}>Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the volunteer opportunity in detail..."
                  className={isInternshipMode ? 'bg-gray-700/50 border-gray-600 text-gray-200' : ''}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time_commitment" className={isInternshipMode ? 'text-gray-300' : ''}>Time Commitment *</Label>
                  <Input
                    id="time_commitment"
                    value={formData.time_commitment}
                    onChange={(e) => setFormData({...formData, time_commitment: e.target.value})}
                    placeholder="e.g., 4-6 hours/week"
                    className={isInternshipMode ? 'bg-gray-700/50 border-gray-600 text-gray-200' : ''}
                    required
                  />
                </div>

                  <div className="space-y-2">
                    <Label htmlFor="max_volunteers" className={isInternshipMode ? 'text-gray-300' : ''}>{isInternshipMode ? 'Open Positions' : 'Max Volunteers'}</Label>
                    <Input
                      id="max_volunteers"
                      type="number"
                      min="1"
                      value={formData.max_volunteers}
                      onChange={(e) => setFormData({...formData, max_volunteers: e.target.value})}
                      placeholder="Optional"
                      className={isInternshipMode ? 'bg-gray-700/50 border-gray-600 text-gray-200' : ''}
                    />
                  </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements" className={isInternshipMode ? 'text-gray-300' : ''}>Qualifications/Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  placeholder="e.g., Ages 16+, weekend availability preferred"
                  className={isInternshipMode ? 'bg-gray-700/50 border-gray-600 text-gray-200' : ''}
                  rows={2}
                />
              </div>

              {/* Start and End Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={isInternshipMode ? 'text-gray-300' : ''}>
                    Start Date *
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground",
                          isInternshipMode ? 'bg-gray-700/50 border-gray-600 text-gray-200 hover:bg-gray-600' : ''
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick start date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className={isInternshipMode ? 'text-gray-300' : ''}>
                    End Date *
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground",
                          isInternshipMode ? 'bg-gray-700/50 border-gray-600 text-gray-200 hover:bg-gray-600' : ''
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Pick end date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => !startDate || date < startDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expires_at" className={isInternshipMode ? 'text-gray-300' : ''}>Application Deadline (Optional)</Label>
                <Input
                  id="expires_at"
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                  className={isInternshipMode ? 'bg-gray-700/50 border-gray-600 text-gray-200' : ''}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="resume_required"
                  checked={formData.resume_required}
                  onCheckedChange={(checked) => setFormData({...formData, resume_required: checked as boolean})}
                  className={isInternshipMode ? 'border-gray-600 data-[state=checked]:bg-blue-600' : ''}
                />
                <Label 
                  htmlFor="resume_required" 
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                    isInternshipMode ? 'text-gray-300' : ''
                  }`}
                >
                  Require resume for applications
                </Label>
              </div>

              <div className={`p-4 rounded-lg ${
                isInternshipMode ? 'bg-gray-700/50' : 'bg-blue-50'
              }`}>
                <div className="flex items-start space-x-2">
                  <MapPin className={`h-5 w-5 mt-0.5 ${
                    isInternshipMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  <div>
                    <p className={`font-medium ${
                      isInternshipMode ? 'text-blue-300' : 'text-blue-900'
                    }`}>Location</p>
                    <p className={`${
                      isInternshipMode ? 'text-blue-200' : 'text-blue-700'
                    }`}>
                      {organization.address_line1}
                      {organization.address_line2 && `, ${organization.address_line2}`}
                      <br />
                      {organization.city}, {organization.state} {organization.zip_code}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Link to="/">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Posting...' : 'Post Opportunity'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostOpportunity;