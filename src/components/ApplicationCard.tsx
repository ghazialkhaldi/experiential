import { Clock, Mail, User, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useApplications } from '@/hooks/useApplications';

interface Application {
  id: string;
  opportunity_id: string;
  user_id: string;
  applicant_email: string;
  applicant_name: string;
  message: string | null;
  status: string;
  applied_at: string;
  updated_at: string;
  opportunity?: {
    title: string;
    organization: {
      name: string;
    };
  };
}

interface ApplicationCardProps {
  application: Application;
  showOpportunityTitle?: boolean;
}

const ApplicationCard = ({ application, showOpportunityTitle = false }: ApplicationCardProps) => {
  const { updateApplicationStatus } = useApplications();
  const { toast } = useToast();

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateApplicationStatus(application.id, newStatus);
      toast({
        title: "Status Updated",
        description: `Application has been ${newStatus.toLowerCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            {showOpportunityTitle && application.opportunity && (
              <CardTitle className="text-lg mb-1">
                {application.opportunity.title}
              </CardTitle>
            )}
            <CardDescription className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {application.applicant_name}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge className={getStatusColor(application.status)}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Badge>
            <span className="text-sm text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatTimeAgo(application.applied_at)}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <Mail className="h-4 w-4 mr-2" />
            <a href={`mailto:${application.applicant_email}`} className="text-blue-600 hover:underline">
              {application.applicant_email}
            </a>
          </div>
          
          {application.message && (
            <div>
              <div className="flex items-center text-gray-600 mb-2">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="font-medium">Message:</span>
              </div>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">
                {application.message}
              </p>
            </div>
          )}
          
          {application.status === 'pending' && (
            <div className="flex space-x-2 pt-2">
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleStatusUpdate('accepted')}
              >
                Accept
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleStatusUpdate('rejected')}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Reject
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;