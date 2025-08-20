import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Mail, MessageSquare, FileText, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useApplications } from '@/hooks/useApplications';
import { useToast } from '@/hooks/use-toast';

interface Application {
  id: string;
  opportunity_id: string;
  user_id: string;
  applicant_email: string;
  applicant_name: string;
  message: string | null;
  resume_url: string | null;
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

interface ApplicationDetailDialogProps {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApplicationDetailDialog = ({ application, open, onOpenChange }: ApplicationDetailDialogProps) => {
  const { updateApplicationStatus } = useApplications();
  const { toast } = useToast();

  if (!application) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateApplicationStatus(application.id, newStatus);
      toast({
        title: "Status Updated",
        description: `Application has been ${newStatus.toLowerCase()}.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Application Details</span>
            <Badge className={getStatusColor(application.status)}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Full application details for {application.opportunity?.title}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Applicant Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-semibold text-lg">{application.applicant_name}</h3>
                  <p className="text-sm text-muted-foreground">Applicant</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <a 
                    href={`mailto:${application.applicant_email}`}
                    className="text-primary hover:underline"
                  >
                    {application.applicant_email}
                  </a>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p>{formatDate(application.applied_at)}</p>
                  <p className="text-sm text-muted-foreground">Application Date</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Application Message */}
            {application.message && (
              <>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <h4 className="font-semibold">Cover Letter / Message</h4>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm leading-relaxed">{application.message}</p>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Resume */}
            {application.resume_url && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <h4 className="font-semibold">Resume</h4>
                </div>
                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Resume Document</p>
                      <p className="text-sm text-muted-foreground">Click to view in new tab</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => window.open(application.resume_url!, '_blank')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Resume
                    </Button>
                  </div>
                  
                  {/* Resume Preview Frame */}
                  <div className="mt-4">
                    <div className="border rounded-lg overflow-hidden bg-white">
                      <iframe
                        src={application.resume_url}
                        className="w-full h-96"
                        title="Resume Preview"
                        onError={() => {
                          // Fallback if iframe fails to load
                          console.log('Resume preview failed to load');
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        {application.status === 'pending' && (
          <>
            <Separator />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => handleStatusUpdate('rejected')}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => handleStatusUpdate('accepted')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Accept
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailDialog;