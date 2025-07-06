import { useState, useEffect } from 'react';
import { Users, Plus, Eye, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useApplications';
import ApplicationCard from '@/components/ApplicationCard';
import AuthButton from '@/components/AuthButton';

interface OrganizationOpportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  posted_at: string;
  max_volunteers: number | null;
  current_volunteers: number;
  is_active: boolean;
  applications?: any[];
}

const ManageOpportunities = () => {
  const [opportunities, setOpportunities] = useState<OrganizationOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { applications } = useApplications();

  useEffect(() => {
    if (user) {
      fetchOrganizationOpportunities();
    }
  }, [user]);

  const fetchOrganizationOpportunities = async () => {
    try {
      setLoading(true);
      
      // First get the user's organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (orgError || !orgData) {
        setOpportunities([]);
        setError(null);
        setLoading(false);
        return;
      }

      // Then get opportunities for that organization
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          applications (
            id,
            applicant_name,
            applicant_email,
            status,
            applied_at
          )
        `)
        .eq('organization_id', orgData.id)
        .order('posted_at', { ascending: false });

      if (error) {
        throw error;
      }

      setOpportunities(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching organization opportunities:', err);
      setError('Failed to load opportunities');
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const acceptedApplications = applications.filter(app => app.status === 'accepted');
  const rejectedApplications = applications.filter(app => app.status === 'rejected');

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
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

        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                Please sign in to manage your organization's opportunities and applications.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <AuthButton />
            </CardContent>
          </Card>
        </div>
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
              <Link to="/manage-opportunities" className="text-blue-600 font-medium">
                Manage
              </Link>
              <AuthButton />
              <Link to="/post-opportunity">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Opportunity
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Opportunities</h1>
          <p className="text-gray-600">View and manage your organization's volunteer opportunities and applications.</p>
        </div>

        <Tabs defaultValue="opportunities" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="opportunities">My Opportunities</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities" className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading opportunities...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
              </div>
            ) : opportunities.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities yet</h3>
                <p className="text-gray-600 mb-4">Start by posting your first volunteer opportunity.</p>
                <Link to="/post-opportunity">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Post Opportunity
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {opportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {opportunity.category.replace('_', ' ')}
                        </Badge>
                        <Badge variant={opportunity.is_active ? "default" : "secondary"}>
                          {opportunity.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{opportunity.title}</CardTitle>
                      <CardDescription>{opportunity.location}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-gray-700 text-sm line-clamp-3">
                          {opportunity.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Posted {formatTimeAgo(opportunity.posted_at)}</span>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {opportunity.applications?.length || 0} applications
                          </div>
                        </div>
                        {opportunity.max_volunteers && (
                          <div className="flex items-center text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            <span className="text-sm">
                              {opportunity.current_volunteers}/{opportunity.max_volunteers} volunteers
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Tabs defaultValue="pending" className="w-full">
              <TabsList>
                <TabsTrigger value="pending">
                  Pending ({pendingApplications.length})
                </TabsTrigger>
                <TabsTrigger value="accepted">
                  Accepted ({acceptedApplications.length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({rejectedApplications.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                {pendingApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No pending applications.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingApplications.map((application) => (
                      <ApplicationCard 
                        key={application.id} 
                        application={application} 
                        showOpportunityTitle={true}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="accepted">
                {acceptedApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No accepted applications yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {acceptedApplications.map((application) => (
                      <ApplicationCard 
                        key={application.id} 
                        application={application} 
                        showOpportunityTitle={true}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="rejected">
                {rejectedApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No rejected applications.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rejectedApplications.map((application) => (
                      <ApplicationCard 
                        key={application.id} 
                        application={application} 
                        showOpportunityTitle={true}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManageOpportunities;