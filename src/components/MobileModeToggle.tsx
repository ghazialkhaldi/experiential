import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Heart, Briefcase, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileModeToggleProps {
  isInternshipMode: boolean;
  onToggle: () => void;
  isNative: boolean;
}

export const MobileModeToggle: React.FC<MobileModeToggleProps> = ({ 
  isInternshipMode, 
  onToggle, 
  isNative 
}) => {
  return (
    <Card className="p-2 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
      <div className="flex rounded-lg bg-muted/50 p-1">
        <Button
          variant={!isInternshipMode ? "default" : "ghost"}
          size="sm"
          className={cn(
            "flex-1 rounded-md transition-all duration-300",
            !isInternshipMode 
              ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md scale-105" 
              : "hover:bg-muted text-muted-foreground"
          )}
          onClick={onToggle}
        >
          <Heart className="h-4 w-4 mr-2" />
          <span className="font-medium">Volunteer</span>
          {!isInternshipMode && (
            <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
              Active
            </Badge>
          )}
        </Button>

        <Button
          variant={isInternshipMode ? "default" : "ghost"}
          size="sm"
          className={cn(
            "flex-1 rounded-md transition-all duration-300",
            isInternshipMode 
              ? "bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground shadow-md scale-105" 
              : "hover:bg-muted text-muted-foreground"
          )}
          onClick={onToggle}
        >
          <Briefcase className="h-4 w-4 mr-2" />
          <span className="font-medium">Internship</span>
          {isInternshipMode && (
            <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
              Active
            </Badge>
          )}
        </Button>
      </div>
      
      {/* Mode Description */}
      <div className="mt-2 px-2">
        <p className="text-xs text-muted-foreground text-center">
          {isInternshipMode 
            ? "🚀 Discover professional internship opportunities"
            : "❤️ Find meaningful volunteer experiences"
          }
        </p>
      </div>
    </Card>
  );
};