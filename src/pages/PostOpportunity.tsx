import React, { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Users, Clock, FileText, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";
import { useMode } from '@/contexts/ModeContext';
import AuthButton from "@/components/AuthButton";
import OrganizationSetup from "@/components/OrganizationSetup";

const PostOpportunity = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { isInternshipMode } = useMode();
  const { organization, loading, hasIncompleteOrganization, hasIncompleteOrgData, profile } = useProfile();
  const [submitting, setSubmitting] = useState(false);

  // Check for incomplete organization setup
  const needsOrganizationSetup = (hasIncompleteOrganization || hasIncompleteOrgData) && profile?.role === 'volunteer_searcher';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    time_commitment: '',
    requirements: '',
    max_volunteers: '',
    expires_at: ''
  });

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
          opportunity_type: isInternshipMode ? 'internship' : 'volunteer'
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

  // Show organization setup if needed
  if (needsOrganizationSetup && !loading) {
    return (
      <OrganizationSetup 
        onComplete={() => {
          // Navigate back to the post opportunity page
          window.location.reload();
        }}
      />
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">VolunteerHub</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Opportunities
              </Link>
              <Link to="/resources" className="text-gray-700 hover:text-blue-600 font-medium">
                University Resources
              </Link>
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link to="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Opportunities
          </Button>
        </Link>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              {isInternshipMode ? (
                <Briefcase className="h-6 w-6 mr-2 text-blue-600" />
              ) : (
                <FileText className="h-6 w-6 mr-2 text-blue-600" />
              )}
              {isInternshipMode ? 'Post New Internship' : 'Post New Opportunity'}
            </CardTitle>
            <CardDescription>
              Create {isInternshipMode ? 'an internship opportunity' : 'a volunteer opportunity'} for {organization.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Opportunity Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Animal Shelter Assistant"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="environment">Environment</SelectItem>
                    <SelectItem value="animal_care">Animal Care</SelectItem>
                    <SelectItem value="community_service">Community Service</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the volunteer opportunity in detail..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time_commitment">Time Commitment *</Label>
                  <Input
                    id="time_commitment"
                    value={formData.time_commitment}
                    onChange={(e) => setFormData({...formData, time_commitment: e.target.value})}
                    placeholder="e.g., 4-6 hours/week"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_volunteers">Max Volunteers</Label>
                  <Input
                    id="max_volunteers"
                    type="number"
                    min="1"
                    value={formData.max_volunteers}
                    onChange={(e) => setFormData({...formData, max_volunteers: e.target.value})}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  placeholder="e.g., Ages 16+, weekend availability preferred"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expires_at">Expiration Date</Label>
                <Input
                  id="expires_at"
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Location</p>
                    <p className="text-blue-700">
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