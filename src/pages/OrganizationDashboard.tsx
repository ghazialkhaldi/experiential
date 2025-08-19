import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Eye, CheckCircle, XCircle, Building2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApplications } from '@/hooks/useApplications';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import OpportunityDetailDialog from '@/components/OpportunityDetailDialog';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  opportunity_type: string;
  is_active: boolean;
  posted_at: string;
  max_volunteers?: number;
  current_volunteers?: number;
}

const OrganizationDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { organization, isOrganization } = useProfile();
  const { applications, updateApplicationStatus, loading: applicationsLoading } = useApplications();
  const { toast } = useToast();
  
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!isOrganization || !organization?.id) {
      navigate('/app/portfolio');
      return;
    }
    
    fetchOpportunities();
  }, [isOrganization, organization, navigate]);

  const fetchOpportunities = async () => {
    if (!organization?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('organization_id', organization.id)
        .order('posted_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load opportunities",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, status: string) => {
    try {
      await updateApplicationStatus(applicationId, status);
      toast({
        title: "Status Updated",
        description: `Application status updated to ${status}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update application status",
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays}d ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours}h ago`;
    } else {
      return "Just now";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOpportunityClick = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setDialogOpen(true);
  };

  if (loading || applicationsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <header className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/app/portfolio')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">
              Organization Dashboard
            </h1>
          </div>
        </header>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/app/portfolio')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Organization Dashboard
              </h1>
              <p className="text-sm text-gray-600">{organization?.name}</p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/post-opportunity')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post Opportunity
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="p-4">
        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="applications">
              Applications ({applications.length})
            </TabsTrigger>
            <TabsTrigger value="opportunities">
              Opportunities ({opportunities.length})
            </TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            {applications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Applications for your opportunities will appear here.
                  </p>
                  <Button onClick={() => navigate('/post-opportunity')}>
                    Post Your First Opportunity
                  </Button>
                </CardContent>
              </Card>
            ) : (
              applications.map((application) => (
                <Card key={application.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{application.applicant_name}</CardTitle>
                        <CardDescription>{application.applicant_email}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Applied for:</p>
                        <p className="text-sm text-gray-600">{application.opportunity?.title}</p>
                      </div>
                      
                      {application.message && (
                        <div>
                          <p className="text-sm font-medium text-gray-900">Message:</p>
                          <p className="text-sm text-gray-600">{application.message}</p>
                        </div>
                      )}
                      
                      {application.resume_url && (
                        <div>
                          <p className="text-sm font-medium text-gray-900">Resume:</p>
                          <a 
                            href={application.resume_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View Resume
                          </a>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          Applied {formatTimeAgo(application.applied_at)}
                        </p>
                        
                        {application.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(application.id, 'accepted')}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(application.id, 'rejected')}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-4">
            {opportunities.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Opportunities Posted</h3>
                  <p className="text-gray-600 mb-4">
                    Start by posting your first opportunity to attract volunteers or interns.
                  </p>
                  <Button onClick={() => navigate('/post-opportunity')}>
                    Post Opportunity
                  </Button>
                </CardContent>
              </Card>
            ) : (
              opportunities.map((opportunity) => (
                <Card key={opportunity.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                        <CardDescription>
                          {opportunity.category} • {opportunity.location}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={opportunity.is_active ? "default" : "secondary"}>
                          {opportunity.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">
                          {opportunity.opportunity_type}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {opportunity.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          Posted {formatTimeAgo(opportunity.posted_at)}
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpportunityClick(opportunity)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <OpportunityDetailDialog
        opportunity={selectedOpportunity}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default OrganizationDashboard;