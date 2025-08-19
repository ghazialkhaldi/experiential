import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, Building, Calendar, Badge as BadgeIcon, Upload, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useApplications';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ResumeUpload from '@/components/ResumeUpload';
import Sidebar from '@/components/Sidebar';
import ExperientialLogo from '@/components/ExperientialLogo';
import { useMode } from '@/contexts/ModeContext';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  time_commitment: string;
  requirements: string | null;
  location: string;
  posted_at: string;
  expires_at: string | null;
  max_volunteers: number | null;
  current_volunteers: number;
  resume_required?: boolean;
  organization: {
    name: string;
    id: string;
  };
}

const OpportunityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { applyToOpportunity, hasApplied } = useApplications();
  const { toast } = useToast();
  const { isInternshipMode } = useMode();

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Application form state
  const [isApplying, setIsApplying] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user has already applied
  const alreadyApplied = user ? hasApplied(opportunity?.id || '') : false;

  useEffect(() => {
    if (id) {
      fetchOpportunity(id);
    }
  }, [id]);

  const fetchOpportunity = async (opportunityId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          organization:organizations (
            name,
            id
          )
        `)
        .eq('id', opportunityId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setOpportunity(data);
    } catch (err) {
      console.error('Error fetching opportunity:', err);
      setError('Opportunity not found');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    return `${diffInDays} days ago`;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'education': 'bg-blue-100 text-blue-800',
      'environment': 'bg-green-100 text-green-800',
      'animal_care': 'bg-orange-100 text-orange-800',
      'community_service': 'bg-purple-100 text-purple-800',
      'healthcare': 'bg-red-100 text-red-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleApply = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to apply for opportunities.",
        variant: "destructive",
      });
      return;
    }

    if (!applicantName.trim() || !applicantEmail.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email address.",
        variant: "destructive",
      });
      return;
    }

    if (opportunity?.resume_required && !resumeUrl) {
      toast({
        title: "Resume Required",
        description: "Please upload your resume to apply for this opportunity.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await applyToOpportunity(opportunity!.id, applicantName, applicantEmail, message, resumeUrl);
      
      toast({
        title: "Application Submitted!",
        description: "Your application has been sent to the organization.",
      });
      
      setApplicantName('');
      setApplicantEmail('');
      setMessage('');
      setResumeUrl(null);
      setIsApplying(false);
    } catch (error: any) {
      toast({
        title: "Application Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isInternshipMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-green-50'}`}>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className={`min-h-screen ${isInternshipMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-green-50'}`}>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6 text-center">
                <p className="text-red-600 mb-4">{error || 'Opportunity not found'}</p>
                <Button onClick={() => navigate('/')}>
                  Back to Opportunities
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isInternshipMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-green-50'}`}>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {/* Header Navigation */}
          <nav className={`${isInternshipMode ? 'bg-gray-800/80 backdrop-blur-md border-gray-700' : 'bg-white/80 backdrop-blur-md'} border-b sticky top-0 z-40`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/')}
                    className={`${isInternshipMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Opportunities
                  </Button>
                  <div className="h-6 w-px bg-gray-300"></div>
                  <ExperientialLogo className="h-8 w-auto" />
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Opportunity Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <Badge className={getCategoryColor(opportunity.category)}>
                      {opportunity.category.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Posted {formatTimeAgo(opportunity.posted_at)}
                    </span>
                  </div>
                  
                  <h1 className={`text-4xl font-bold mb-3 ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                    {opportunity.title}
                  </h1>
                  
                  <div className={`flex items-center mb-4 ${isInternshipMode ? 'text-green-400' : 'text-green-600'}`}>
                    <Building className="h-5 w-5 mr-2" />
                    <span className="text-lg font-semibold">{opportunity.organization.name}</span>
                  </div>
                </div>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className={`${isInternshipMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <MapPin className={`h-5 w-5 mr-3 ${isInternshipMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <div>
                        <p className={`font-medium ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>Location</p>
                        <p className={`text-sm ${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>{opportunity.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${isInternshipMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <Clock className={`h-5 w-5 mr-3 ${isInternshipMode ? 'text-green-400' : 'text-green-600'}`} />
                      <div>
                        <p className={`font-medium ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>Time Commitment</p>
                        <p className={`text-sm ${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>{opportunity.time_commitment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {opportunity.max_volunteers && (
                  <Card className={`${isInternshipMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <Users className={`h-5 w-5 mr-3 ${isInternshipMode ? 'text-purple-400' : 'text-purple-600'}`} />
                        <div>
                          <p className={`font-medium ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>Volunteers</p>
                          <p className={`text-sm ${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {opportunity.current_volunteers}/{opportunity.max_volunteers} spots filled
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Description */}
                <Card className={`${isInternshipMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/90'}`}>
                  <CardHeader>
                    <CardTitle className={`${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                      About This Opportunity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`leading-relaxed whitespace-pre-wrap ${isInternshipMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {opportunity.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Requirements */}
                {opportunity.requirements && (
                  <Card className={`${isInternshipMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/90'}`}>
                    <CardHeader>
                      <CardTitle className={`${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                        Requirements & Qualifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`p-4 rounded-lg ${isInternshipMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                        <p className={`${isInternshipMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {opportunity.requirements}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Application Deadline */}
                {opportunity.expires_at && (
                  <Card className={`${isInternshipMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/90'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <Calendar className={`h-5 w-5 mr-3 ${isInternshipMode ? 'text-red-400' : 'text-red-600'}`} />
                        <div>
                          <p className={`font-medium ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>Application Deadline</p>
                          <p className={`text-sm ${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {new Date(opportunity.expires_at).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar - Application Form */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <Card className={`${isInternshipMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/90'}`}>
                    <CardHeader>
                      <CardTitle className={`${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                        Apply for This Opportunity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {!user ? (
                        <div className={`text-center p-6 rounded-lg ${isInternshipMode ? 'bg-gray-700/50' : 'bg-blue-50'}`}>
                          <p className={`mb-4 ${isInternshipMode ? 'text-gray-300' : 'text-blue-700'}`}>
                            Please sign in to apply for this opportunity.
                          </p>
                          <Button className="w-full">
                            Sign In to Apply
                          </Button>
                        </div>
                      ) : alreadyApplied ? (
                        <div className={`text-center p-6 rounded-lg ${isInternshipMode ? 'bg-gray-700/50' : 'bg-green-50'}`}>
                          <p className={`font-medium mb-2 ${isInternshipMode ? 'text-green-400' : 'text-green-700'}`}>
                            ✓ Application Submitted
                          </p>
                          <p className={`text-sm ${isInternshipMode ? 'text-gray-300' : 'text-green-600'}`}>
                            The organization will contact you if you're selected.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {!isApplying ? (
                            <Button 
                              onClick={() => setIsApplying(true)}
                              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3"
                              size="lg"
                            >
                              Apply Now
                            </Button>
                          ) : (
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="applicant-name" className={isInternshipMode ? 'text-gray-300' : ''}>
                                  Full Name *
                                </Label>
                                <Input
                                  id="applicant-name"
                                  value={applicantName}
                                  onChange={(e) => setApplicantName(e.target.value)}
                                  placeholder="Enter your full name"
                                  className={isInternshipMode ? 'bg-gray-700/50 border-gray-600 text-gray-200' : ''}
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="applicant-email" className={isInternshipMode ? 'text-gray-300' : ''}>
                                  Email Address *
                                </Label>
                                <Input
                                  id="applicant-email"
                                  type="email"
                                  value={applicantEmail}
                                  onChange={(e) => setApplicantEmail(e.target.value)}
                                  placeholder="Enter your email address"
                                  className={isInternshipMode ? 'bg-gray-700/50 border-gray-600 text-gray-200' : ''}
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="message" className={isInternshipMode ? 'text-gray-300' : ''}>
                                  Message (Optional)
                                </Label>
                                <Textarea
                                  id="message"
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                                  placeholder="Tell the organization why you're interested..."
                                  rows={4}
                                  className={isInternshipMode ? 'bg-gray-700/50 border-gray-600 text-gray-200' : ''}
                                />
                              </div>
                              
                              <ResumeUpload
                                onResumeSelect={setResumeUrl}
                                selectedResumeUrl={resumeUrl}
                                required={opportunity.resume_required}
                              />
                              
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setIsApplying(false)}
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  onClick={handleApply}
                                  disabled={isSubmitting}
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {/* Additional Info */}
                          <div className={`text-xs p-3 rounded ${isInternshipMode ? 'bg-gray-700/30 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                            <p className="flex items-center mb-1">
                              <Upload className="h-3 w-3 mr-1" />
                              {opportunity.resume_required ? 'Resume required' : 'Resume optional'}
                            </p>
                            <p className="flex items-center">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Your application will be sent directly to {opportunity.organization.name}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OpportunityDetail;