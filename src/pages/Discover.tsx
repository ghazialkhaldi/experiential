import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/Sidebar";
import { useOpportunities } from "@/hooks/useOpportunities";
import { useLocation } from "@/hooks/useLocation";
import OpportunityDetailDialog from "@/components/OpportunityDetailDialog";
import { useSavedOpportunities } from "@/hooks/useSavedOpportunities";
import { useMode } from "@/contexts/ModeContext";
import OpportunityCard from "@/components/OpportunityCard";

const Discover = () => {
  const navigate = useNavigate();
  const { isInternshipMode } = useMode();
  const { location } = useLocation();
  
  // Filter opportunities by type based on mode
  const opportunityType = isInternshipMode ? "internship" : "volunteer";
  const { opportunities, loading } = useOpportunities("", "", location);
  
  // Filter and sort opportunities based on type and location proximity
  const sortedOpportunities = useMemo(() => {
    return [...opportunities]
      .filter(opp => opp.opportunity_type === opportunityType)
      .sort((a, b) => {
        // If user has location and both opportunities have distance calculated, sort by distance first
        if (location && location.latitude !== 0 && location.longitude !== 0) {
          if (a.distance !== undefined && b.distance !== undefined) {
            return a.distance - b.distance;
          }
          // If only one has distance, prioritize the one with distance
          if (a.distance !== undefined) return -1;
          if (b.distance !== undefined) return 1;
        }
        
        // Fallback to newest first
        return new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime();
      });
  }, [opportunities, location, opportunityType]);
  
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { savedOpportunities, isSaved, toggleSave } = useSavedOpportunities();

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

  const handleSave = (opportunityId: string, e: React.MouseEvent) => {
    toggleSave(opportunityId);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Education': 'bg-blue-100 text-blue-800',
      'Environment': 'bg-green-100 text-green-800',
      'Health': 'bg-red-100 text-red-800',
      'Community': 'bg-purple-100 text-purple-800',
      'Animals': 'bg-orange-100 text-orange-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleOpportunityClick = (opportunity: any) => {
    setSelectedOpportunity(opportunity);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <div className="max-w-2xl mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 pb-4">
              <h1 className="text-2xl font-bold text-foreground">Discover</h1>
              <p className="text-muted-foreground">
                Find amazing {isInternshipMode ? 'internship' : 'volunteer'} opportunities
              </p>
            </div>

            {/* Tabs for switching between feed and saved */}
            <Tabs defaultValue="feed" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="feed">
                  {isInternshipMode ? 'Internship' : 'Volunteer'} Feed
                </TabsTrigger>
                <TabsTrigger value="saved">
                  Saved ({savedOpportunities.length})
                </TabsTrigger>
              </TabsList>

              {/* Main Feed */}
              <TabsContent value="feed" className="space-y-6">
                {sortedOpportunities.map((opportunity) => (
                  <OpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                    onSave={handleSave}
                    isSaved={isSaved(opportunity.id)}
                    onClick={() => handleOpportunityClick(opportunity)}
                    formatTimeAgo={formatTimeAgo}
                    getCategoryColor={getCategoryColor}
                  />
                ))}

                {sortedOpportunities.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No {isInternshipMode ? 'internships' : 'opportunities'} found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Be the first to discover amazing {isInternshipMode ? 'internship' : 'volunteer'} opportunities in your area.
                    </p>
                    <Button onClick={() => navigate("/search")}>
                      Search {isInternshipMode ? 'Internships' : 'Opportunities'}
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Saved Opportunities */}
              <TabsContent value="saved" className="space-y-6">
                {savedOpportunities.map((saved) => (
                  <OpportunityCard
                    key={saved.id}
                    opportunity={saved.opportunity}
                    onSave={handleSave}
                    isSaved={true}
                    onClick={() => handleOpportunityClick(saved.opportunity)}
                    formatTimeAgo={formatTimeAgo}
                    getCategoryColor={getCategoryColor}
                  />
                ))}

                {savedOpportunities.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No saved opportunities
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start saving opportunities to see them here.
                    </p>
                    <Button onClick={() => navigate("/search")}>
                      Browse Opportunities
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <OpportunityDetailDialog
        opportunity={selectedOpportunity}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Discover;