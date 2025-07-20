import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, Clock, Users, Bookmark, Share2, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/Sidebar";
import { useOpportunities } from "@/hooks/useOpportunities";
import { useLocation } from "@/hooks/useLocation";
import OpportunityDetailDialog from "@/components/OpportunityDetailDialog";
import { useToast } from "@/hooks/use-toast";

const Discover = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { location } = useLocation();
  const { opportunities, loading } = useOpportunities("", "", location);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [likedOpportunities, setLikedOpportunities] = useState<Set<string>>(new Set());
  const [savedOpportunities, setSavedOpportunities] = useState<Set<string>>(new Set());

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

  const handleLike = (opportunityId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newLiked = new Set(likedOpportunities);
    if (newLiked.has(opportunityId)) {
      newLiked.delete(opportunityId);
      toast({ title: "Removed from liked opportunities" });
    } else {
      newLiked.add(opportunityId);
      toast({ title: "Added to liked opportunities" });
    }
    setLikedOpportunities(newLiked);
  };

  const handleSave = (opportunityId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSaved = new Set(savedOpportunities);
    if (newSaved.has(opportunityId)) {
      newSaved.delete(opportunityId);
      toast({ title: "Removed from saved opportunities" });
    } else {
      newSaved.add(opportunityId);
      toast({ title: "Saved opportunity" });
    }
    setSavedOpportunities(newSaved);
  };

  const handleShare = (opportunity: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: opportunity.title,
        text: opportunity.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied to clipboard" });
    }
  };

  const handleOpportunityClick = (opportunity: any) => {
    setSelectedOpportunity(opportunity);
    setDialogOpen(true);
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
              <p className="text-muted-foreground">Find amazing volunteer opportunities</p>
            </div>

            {/* Feed */}
            <div className="space-y-6">
              {opportunities.map((opportunity) => (
                <Card 
                  key={opportunity.id} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-border"
                  onClick={() => handleOpportunityClick(opportunity)}
                >
                  <CardContent className="p-6">
                    {/* Header with organization info */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {opportunity.organization?.name?.charAt(0) || 'O'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {opportunity.organization?.name || 'Unknown Organization'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {formatTimeAgo(opportunity.posted_at)}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={getCategoryColor(opportunity.category)}
                      >
                        {opportunity.category}
                      </Badge>
                    </div>

                    {/* Opportunity content */}
                    <div className="space-y-3">
                      <h2 className="text-xl font-bold text-foreground hover:text-primary transition-colors">
                        {opportunity.title}
                      </h2>
                      
                      <p className="text-foreground line-clamp-3">
                        {opportunity.description}
                      </p>

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {opportunity.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {opportunity.time_commitment}
                        </div>
                        {opportunity.max_volunteers && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {opportunity.current_volunteers || 0}/{opportunity.max_volunteers} spots
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleLike(opportunity.id, e)}
                          className={likedOpportunities.has(opportunity.id) ? "text-red-500" : ""}
                        >
                          <Heart 
                            className={`h-4 w-4 mr-1 ${
                              likedOpportunities.has(opportunity.id) ? "fill-current" : ""
                            }`} 
                          />
                          {likedOpportunities.has(opportunity.id) ? "Liked" : "Like"}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleSave(opportunity.id, e)}
                          className={savedOpportunities.has(opportunity.id) ? "text-blue-500" : ""}
                        >
                          <Bookmark 
                            className={`h-4 w-4 mr-1 ${
                              savedOpportunities.has(opportunity.id) ? "fill-current" : ""
                            }`} 
                          />
                          {savedOpportunities.has(opportunity.id) ? "Saved" : "Save"}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleShare(opportunity, e)}
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                      
                      <Button 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpportunityClick(opportunity);
                        }}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {opportunities.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No opportunities found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to discover amazing volunteer opportunities in your area.
                </p>
                <Button onClick={() => navigate("/search")}>
                  Search Opportunities
                </Button>
              </div>
            )}
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