import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Clock, Users, Calendar, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLikes } from '@/hooks/useLikes';
import { formatTimeAgo } from '@/utils/dateUtils';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  time_commitment: string;
  requirements: string | null;
  organization?: {
    name: string;
  };
  posted_at: string;
  start_date: string | null;
  end_date: string | null;
  max_volunteers: number | null;
  current_volunteers: number;
  resume_required: boolean;
}

const OpportunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  
  const { isLiked, likeCount, toggleLike, loading: likeLoading } = useLikes(id || '');

  useEffect(() => {
    if (id) {
      fetchOpportunity(id);
    }
  }, [id]);

  const fetchOpportunity = async (opportunityId: string) => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          organization:organizations(name)
        `)
        .eq('id', opportunityId)
        .single();

      if (error) throw error;
      setOpportunity(data);
    } catch (error) {
      console.error('Error fetching opportunity:', error);
      toast({
        title: "Error",
        description: "Failed to load opportunity details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to apply for opportunities",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    setApplying(true);
    try {
      // Check if already applied
      const { data: existingApplication } = await supabase
        .from('applications')
        .select('id')
        .eq('user_id', user.id)
        .eq('opportunity_id', id)
        .single();

      if (existingApplication) {
        toast({
          title: "Already applied",
          description: "You have already applied for this opportunity",
          variant: "destructive",
        });
        return;
      }

      // Create application
      const { error } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          opportunity_id: id,
          applicant_email: user.email!,
          applicant_name: user.user_metadata?.full_name || user.email!,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Application submitted!",
        description: "Your application has been sent to the organization",
      });
    } catch (error) {
      console.error('Error applying:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <p className="text-gray-600">Loading opportunity details...</p>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Opportunity not found</h2>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b p-4">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Opportunity Details</h1>
        </div>
      </header>

      {/* Content */}
      <div className="p-4">
        <Card className="mb-6 bg-card border-border">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2 text-card-foreground">{opportunity.title}</CardTitle>
                <CardDescription className="flex items-center space-x-4 text-base text-muted-foreground">
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {opportunity.location}
                  </span>
                  <span>{formatTimeAgo(opportunity.posted_at)}</span>
                </CardDescription>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <Badge variant="secondary" className="text-sm">
                  {opportunity.category}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLike}
                  disabled={likeLoading}
                  className="flex items-center space-x-1 hover:bg-accent"
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
                  <span className="text-sm text-muted-foreground">{likeCount}</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-card-foreground mb-2">Description</h3>
                <p className="text-muted-foreground">{opportunity.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{opportunity.time_commitment}</span>
                </div>
                {opportunity.max_volunteers && (
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {opportunity.current_volunteers}/{opportunity.max_volunteers} volunteers
                    </span>
                  </div>
                )}
              </div>

              {(opportunity.start_date || opportunity.end_date) && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {opportunity.start_date && `Starts: ${new Date(opportunity.start_date).toLocaleDateString()}`}
                    {opportunity.start_date && opportunity.end_date && ' • '}
                    {opportunity.end_date && `Ends: ${new Date(opportunity.end_date).toLocaleDateString()}`}
                  </span>
                </div>
              )}

              {opportunity.requirements && (
                <div>
                  <h3 className="font-semibold text-card-foreground mb-2">Requirements</h3>
                  <p className="text-muted-foreground">{opportunity.requirements}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">
                  {opportunity.organization?.name || 'Organization'}
                </span>
                <Button 
                  onClick={handleApply}
                  disabled={applying}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {applying ? 'Applying...' : 'Apply Now'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OpportunityDetail;