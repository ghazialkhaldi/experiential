import React from 'react';
import { Button } from '@/components/ui/button';
import { useMobile } from '../hooks/useMobile';

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
  const { triggerHaptic } = useMobile();

  const handleToggle = async () => {
    if (isNative) {
      await triggerHaptic('medium');
    }
    onToggle();
  };

  return (
    <div className="sticky top-14 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center justify-center py-3 px-4">
        <div className="flex items-center bg-muted rounded-lg p-1">
          <Button
            variant={!isInternshipMode ? "default" : "ghost"}
            size="sm"
            onClick={handleToggle}
            className={`px-4 py-2 text-sm font-medium transition-all ${
              !isInternshipMode 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Volunteer
          </Button>
          <Button
            variant={isInternshipMode ? "default" : "ghost"}
            size="sm"
            onClick={handleToggle}
            className={`px-4 py-2 text-sm font-medium transition-all ${
              isInternshipMode 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Internship
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileModeToggle;