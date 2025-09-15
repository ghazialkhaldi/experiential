import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMode } from '@/contexts/ModeContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Eye, Calendar, MapPin, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import SharedNavigation from '@/components/SharedNavigation';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

interface Application {
  id: string;
  applied_at: string;
  status: 'pending' | 'accepted' | 'rejected';
  applicant_name: string;
  applicant_email: string;
  message: string | null;
  opportunity: {
    id: string;
    title: string;
    description: string;
    location: string;
    opportunity_type: string;
    start_date: string | null;
    end_date: string | null;
    organization: {
      name: string;
    };
  };
}

const MyApplications = () => {
  const { user } = useAuth();
  const { isInternshipMode } = useMode();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          applied_at,
          status,
          applicant_name,
          applicant_email,
          message,
          opportunity:opportunities (
            id,
            title,
            description,
            location,
            opportunity_type,
            start_date,
            end_date,
            organization:organizations (
              name
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('applied_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        toast({
          title: "Error",
          description: "Failed to load your applications. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setApplications((data || []) as Application[]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "capitalize";
    switch (status) {
      case 'accepted':
        return <Badge variant="default" className={`${baseClasses} bg-green-100 text-green-800 hover:bg-green-100`}>Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className={baseClasses}>Rejected</Badge>;
      default:
        return <Badge variant="secondary" className={`${baseClasses} bg-yellow-100 text-yellow-800 hover:bg-yellow-100`}>Pending</Badge>;
    }
  };

  if (!user) {
    return (
      <div className={`min-h-screen ${isInternshipMode ? 'bg-gray-900' : 'hero-bg'}`}>
        <Sidebar />
        <SharedNavigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className={`text-center py-8 ${isInternshipMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardContent>
              <AlertCircle className={`mx-auto h-12 w-12 mb-4 ${isInternshipMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <h2 className={`text-xl font-semibold mb-2 ${isInternshipMode ? 'text-white' : ''}`}>
                Sign In Required
              </h2>
              <p className={`mb-4 ${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Please sign in to view your applications.
              </p>
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isInternshipMode ? 'bg-gray-900' : 'hero-bg'}`}>
      <Sidebar />
      <SharedNavigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
            My Applications
          </h1>
          <p className={`${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Track the status of your {isInternshipMode ? 'internship' : 'volunteer'} applications
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className={isInternshipMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <Card className={`text-center py-12 ${isInternshipMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardContent>
              <AlertCircle className={`mx-auto h-16 w-16 mb-4 ${isInternshipMode ? 'text-gray-400' : 'text-gray-400'}`} />
              <h3 className={`text-xl font-semibold mb-2 ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                No Applications Yet
              </h3>
              <p className={`mb-6 ${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>
                You haven't applied to any {isInternshipMode ? 'internships' : 'opportunities'} yet.
              </p>
              <Link to="/explore">
                <Button className={isInternshipMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'}>
                  Find {isInternshipMode ? 'Internships' : 'Opportunities'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <Card key={application.id} className={`transition-shadow hover:shadow-lg ${isInternshipMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className={`text-xl mb-2 ${isInternshipMode ? 'text-white' : ''}`}>
                        {application.opportunity.title}
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`font-medium ${isInternshipMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {application.opportunity.organization.name}
                        </span>
                        <div className="flex items-center">
                          <MapPin className={`h-4 w-4 mr-1 ${isInternshipMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={isInternshipMode ? 'text-gray-400' : 'text-gray-500'}>
                            {application.opportunity.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(application.status)}
                      {getStatusBadge(application.status)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Application Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center text-sm">
                          <Calendar className={`h-4 w-4 mr-2 ${isInternshipMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={`font-medium mr-2 ${isInternshipMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Applied:
                          </span>
                          <span className={isInternshipMode ? 'text-gray-400' : 'text-gray-600'}>
                            {formatDistanceToNow(new Date(application.applied_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      
                      {application.opportunity.start_date && (
                        <div>
                          <div className="flex items-center text-sm">
                            <Clock className={`h-4 w-4 mr-2 ${isInternshipMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className={`font-medium mr-2 ${isInternshipMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Duration:
                            </span>
                            <span className={isInternshipMode ? 'text-gray-400' : 'text-gray-600'}>
                              {new Date(application.opportunity.start_date).toLocaleDateString()} - {' '}
                              {application.opportunity.end_date 
                                ? new Date(application.opportunity.end_date).toLocaleDateString()
                                : 'Ongoing'
                              }
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Application Message */}
                    {application.message && (
                      <div>
                        <h4 className={`font-medium mb-2 ${isInternshipMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Your Message:
                        </h4>
                        <p className={`text-sm p-3 rounded-lg ${
                          isInternshipMode 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-50 text-gray-600'
                        }`}>
                          {application.message}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <Link to={`/opportunity/${application.opportunity.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Opportunity
                          </Button>
                        </Link>
                      </div>
                      
                      {application.status === 'accepted' && (
                        <div className={`text-sm ${isInternshipMode ? 'text-green-400' : 'text-green-600'}`}>
                          🎉 Congratulations! You've been accepted!
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyApplications;