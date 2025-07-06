import { useState } from 'react';
import { MapPin, Clock, Users, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useApplications';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  time_commitment: string;
  requirements: string | null;
  location: string;
  posted_at: string;
  max_volunteers: number | null;
  current_volunteers: number;
  organization: {
    name: string;
    id: string;
  };
}

interface OpportunityDetailDialogProps {
  opportunity: Opportunity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OpportunityDetailDialog = ({ opportunity, open, onOpenChange }: OpportunityDetailDialogProps) => {
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const { applyToOpportunity, hasApplied } = useApplications();
  const { toast } = useToast();

  if (!opportunity) return null;

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

    try {
      setIsSubmitting(true);
      await applyToOpportunity(opportunity.id, applicantName, applicantEmail, message);
      
      toast({
        title: "Application Submitted!",
        description: "Your application has been sent to the organization.",
      });
      
      setApplicantName('');
      setApplicantEmail('');
      setMessage('');
      onOpenChange(false);
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

  const alreadyApplied = hasApplied(opportunity.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start mb-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {opportunity.category.replace('_', ' ')}
            </Badge>
            <span className="text-sm text-gray-500">{formatTimeAgo(opportunity.posted_at)}</span>
          </div>
          <DialogTitle className="text-2xl">{opportunity.title}</DialogTitle>
          <DialogDescription className="text-green-600 font-medium flex items-center">
            <Building className="h-4 w-4 mr-2" />
            {opportunity.organization.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Opportunity Details */}
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-3" />
              <span>{opportunity.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-3" />
              <span>{opportunity.time_commitment}</span>
            </div>
            {opportunity.max_volunteers && (
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-3" />
                <span>
                  {opportunity.current_volunteers}/{opportunity.max_volunteers} volunteers
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {opportunity.description}
            </p>
          </div>

          {/* Requirements */}
          {opportunity.requirements && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Requirements</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                {opportunity.requirements}
              </p>
            </div>
          )}

          {/* Application Form */}
          {user && !alreadyApplied && (
            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-4">Apply for this Opportunity</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="applicant-name">Full Name *</Label>
                  <Input
                    id="applicant-name"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="applicant-email">Email Address *</Label>
                  <Input
                    id="applicant-email"
                    type="email"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell the organization why you're interested in this opportunity..."
                    rows={4}
                  />
                </div>
                <Button 
                  onClick={handleApply}
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </div>
          )}

          {/* Already Applied */}
          {user && alreadyApplied && (
            <div className="border-t pt-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-700 font-medium">
                  ✓ You have already applied to this opportunity
                </p>
                <p className="text-green-600 text-sm mt-1">
                  The organization will contact you if you're selected.
                </p>
              </div>
            </div>
          )}

          {/* Not Logged In */}
          {!user && (
            <div className="border-t pt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-blue-700 font-medium mb-2">
                  Sign in to apply for this opportunity
                </p>
                <Button onClick={() => onOpenChange(false)} variant="outline">
                  Sign In
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OpportunityDetailDialog;