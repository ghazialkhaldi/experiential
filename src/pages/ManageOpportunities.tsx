import { useState, useEffect } from 'react';
import { Users, Plus, Eye, FileText, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useApplications';
import ApplicationCard from '@/components/ApplicationCard';
import AuthButton from '@/components/AuthButton';
import { useToast } from '@/hooks/use-toast';
import { useMode } from '@/contexts/ModeContext';
import { Briefcase } from 'lucide-react';

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
  requirements: string | null;
  applications?: any[];
}

const ManageOpportunities = () => {
  const [opportunities, setOpportunities] = useState<OrganizationOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingOpportunity, setEditingOpportunity] = useState<OrganizationOpportunity | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    requirements: '',
    max_volunteers: ''
  });
  const { user } = useAuth();
  const { applications } = useApplications();
  const { toast } = useToast();
  const { isInternshipMode } = useMode();

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

  const handleEditOpportunity = (opportunity: OrganizationOpportunity) => {
    setEditingOpportunity(opportunity);
    setEditForm({
      title: opportunity.title,
      description: opportunity.description,
      category: opportunity.category,
      location: opportunity.location,
      requirements: opportunity.requirements || '',
      max_volunteers: opportunity.max_volunteers?.toString() || ''
    });
  };

  const handleUpdateOpportunity = async () => {
    if (!editingOpportunity) return;

    try {
      const { error } = await supabase
        .from('opportunities')
        .update({
          title: editForm.title,
          description: editForm.description,
          category: editForm.category,
          location: editForm.location,
          requirements: editForm.requirements || null,
          max_volunteers: editForm.max_volunteers ? parseInt(editForm.max_volunteers) : null
        })
        .eq('id', editingOpportunity.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Opportunity updated successfully.",
      });

      setEditingOpportunity(null);
      fetchOrganizationOpportunities();
    } catch (err) {
      console.error('Error updating opportunity:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update opportunity.",
      });
    }
  };

  const handleDeleteOpportunity = async (opportunityId: string) => {
    try {
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', opportunityId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Opportunity deleted successfully.",
      });

      fetchOrganizationOpportunities();
    } catch (err) {
      console.error('Error deleting opportunity:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete opportunity.",
      });
    }
  };

  const handleToggleActive = async (opportunityId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('opportunities')
        .update({ is_active: !currentStatus })
        .eq('id', opportunityId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Opportunity ${!currentStatus ? 'activated' : 'closed'} successfully.`,
      });

      fetchOrganizationOpportunities();
    } catch (err) {
      console.error('Error updating opportunity status:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update opportunity status.",
      });
    }
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const acceptedApplications = applications.filter(app => app.status === 'accepted');
  const rejectedApplications = applications.filter(app => app.status === 'rejected');

  if (!user) {
    return (
      <div className={`min-h-screen ${isInternshipMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-green-50'}`}>
        <nav className={`shadow-sm border-b ${isInternshipMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                {isInternshipMode ? (
                  <Briefcase className="h-8 w-8 text-blue-400" />
                ) : null}
                <span className={`text-2xl font-bold ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                  <img src="/Experiential 4.png" alt="Experiential Logo" className="h-8 w-auto" />
                </span>
              </Link>
              <div className="flex items-center space-x-6">
                <Link to="/" className={`font-medium ${isInternshipMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}>
                  {isInternshipMode ? 'Internships' : 'Opportunities'}
                </Link>
                <Link to={isInternshipMode ? "/career-resources" : "/resources"} className={`font-medium ${isInternshipMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}>
                  {isInternshipMode ? 'Career Resources' : 'University Resources'}
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
                Please sign in to manage your {isInternshipMode ? "company's internships" : "organization's opportunities"} and applications.
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
    <div className={`min-h-screen ${isInternshipMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-green-50'}`}>
      {/* Navigation */}
      <nav className={`shadow-sm border-b ${isInternshipMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              {isInternshipMode ? (
                <Briefcase className="h-8 w-8 text-blue-400" />
              ) : null}
              <span className={`text-2xl font-bold ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                <img src="/Experiential 4.png" alt="Experiential Logo" className="h-16 w-auto" />
              </span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/" className={`font-medium ${isInternshipMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}>
                {isInternshipMode ? 'Internships' : 'Opportunities'}
              </Link>
              <Link to={isInternshipMode ? "/career-resources" : "/resources"} className={`font-medium ${isInternshipMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}>
                {isInternshipMode ? 'Career Resources' : 'University Resources'}
              </Link>
              <Link to="/manage-opportunities" className={`font-medium ${isInternshipMode ? 'text-blue-400' : 'text-blue-600'}`}>
                Manage
              </Link>
              <AuthButton />
              <Link to="/post-opportunity">
                <Button className={`${isInternshipMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  {isInternshipMode ? 'Post Internship' : 'Post Opportunity'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
            {isInternshipMode ? 'Company Dashboard' : 'Manage Opportunities'}
          </h1>
          <p className={isInternshipMode ? 'text-gray-300' : 'text-gray-600'}>
            View and manage your {isInternshipMode ? "company's internship postings" : "organization's volunteer opportunities"} and applications.
          </p>
        </div>

        <Tabs defaultValue="opportunities" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="opportunities">
              {isInternshipMode ? 'My Internships' : 'My Opportunities'}
            </TabsTrigger>
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
                <FileText className={`h-16 w-16 mx-auto mb-4 ${isInternshipMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <h3 className={`text-lg font-medium mb-2 ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                  {isInternshipMode ? 'No internships yet' : 'No opportunities yet'}
                </h3>
                <p className={`mb-4 ${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Start by posting your first {isInternshipMode ? 'internship posting' : 'volunteer opportunity'}.
                </p>
                <Link to="/post-opportunity">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    {isInternshipMode ? 'Post Internship' : 'Post Opportunity'}
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
                         <div className="flex items-center justify-between pt-3 border-t">
                           <div className="flex items-center space-x-2">
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => handleEditOpportunity(opportunity)}
                             >
                               <Edit className="h-4 w-4" />
                             </Button>
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => handleToggleActive(opportunity.id, opportunity.is_active)}
                             >
                               {opportunity.is_active ? (
                                 <XCircle className="h-4 w-4 text-orange-600" />
                               ) : (
                                 <CheckCircle className="h-4 w-4 text-green-600" />
                               )}
                             </Button>
                           </div>
                           <AlertDialog>
                             <AlertDialogTrigger asChild>
                               <Button variant="outline" size="sm">
                                 <Trash2 className="h-4 w-4 text-red-600" />
                               </Button>
                             </AlertDialogTrigger>
                             <AlertDialogContent>
                               <AlertDialogHeader>
                                 <AlertDialogTitle>Delete Opportunity</AlertDialogTitle>
                                 <AlertDialogDescription>
                                   Are you sure you want to delete "{opportunity.title}"? This action cannot be undone and will also delete all applications.
                                 </AlertDialogDescription>
                               </AlertDialogHeader>
                               <AlertDialogFooter>
                                 <AlertDialogCancel>Cancel</AlertDialogCancel>
                                 <AlertDialogAction
                                   onClick={() => handleDeleteOpportunity(opportunity.id)}
                                   className="bg-red-600 hover:bg-red-700"
                                 >
                                   Delete
                                 </AlertDialogAction>
                               </AlertDialogFooter>
                             </AlertDialogContent>
                           </AlertDialog>
                         </div>
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

      {/* Edit Opportunity Dialog */}
      <Dialog open={!!editingOpportunity} onOpenChange={() => setEditingOpportunity(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Opportunity</DialogTitle>
            <DialogDescription>
              Update the details of your volunteer opportunity.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter opportunity title"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the volunteer opportunity"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select value={editForm.category} onValueChange={(value) => setEditForm(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
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
              <div>
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={editForm.location}
                  onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter location"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-requirements">Requirements (Optional)</Label>
              <Textarea
                id="edit-requirements"
                value={editForm.requirements}
                onChange={(e) => setEditForm(prev => ({ ...prev, requirements: e.target.value }))}
                placeholder="Any specific requirements or skills needed"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-max-volunteers">Maximum Volunteers (Optional)</Label>
              <Input
                id="edit-max-volunteers"
                type="number"
                value={editForm.max_volunteers}
                onChange={(e) => setEditForm(prev => ({ ...prev, max_volunteers: e.target.value }))}
                placeholder="Enter maximum number of volunteers"
                min={1}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setEditingOpportunity(null)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateOpportunity}>
              Update Opportunity
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageOpportunities;