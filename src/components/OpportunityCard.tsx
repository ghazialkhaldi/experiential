import { Heart, MapPin, Clock, Users, Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLikes } from "@/hooks/useLikes";

interface OpportunityCardProps {
  opportunity: any;
  onSave: (opportunityId: string, e: React.MouseEvent) => void;
  isSaved: boolean;
  onClick: () => void;
  formatTimeAgo: (dateString: string) => string;
  getCategoryColor: (category: string) => string;
}

const OpportunityCard = ({ 
  opportunity, 
  onSave, 
  isSaved, 
  onClick, 
  formatTimeAgo,
  getCategoryColor 
}: OpportunityCardProps) => {
  const { isLiked, likeCount, toggleLike, canLike } = useLikes(opportunity.id);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike();
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave(opportunity.id, e);
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 border-border"
      onClick={onClick}
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
              onClick={handleLike}
              disabled={!canLike}
              className={isLiked ? "text-red-500" : ""}
              title={!canLike ? "Sign in to like opportunities" : ""}
            >
              <Heart 
                className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} 
              />
              <span className="flex items-center gap-1">
                {isLiked ? "Liked" : "Like"}
                {likeCount > 0 && <span className="text-xs">({likeCount})</span>}
              </span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className={isSaved ? "text-blue-500" : ""}
            >
              <Bookmark 
                className={`h-4 w-4 mr-1 ${isSaved ? "fill-current" : ""}`} 
              />
              {isSaved ? "Saved" : "Save"}
            </Button>
          </div>
          
          <Button 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpportunityCard;