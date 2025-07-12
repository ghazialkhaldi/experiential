import { useState } from "react";
import { MapPin, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMode } from "@/contexts/ModeContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
}

interface LocationSelectorProps {
  location: Location | null;
  loading: boolean;
  onLocationChange: (location: string) => void;
  onDetectLocation: () => void;
  userDenied: boolean;
}

const LocationSelector = ({ 
  location, 
  loading, 
  onLocationChange, 
  onDetectLocation,
  userDenied 
}: LocationSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { isInternshipMode } = useMode();

  const getDisplayText = () => {
    if (loading) return "Detecting...";
    if (location?.city && location?.state) {
      return `${location.city}, ${location.state}`;
    }
    if (location?.city) {
      return location.city;
    }
    if (userDenied) return "Location access denied";
    return "Select location";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onLocationChange(inputValue.trim());
      setInputValue("");
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`h-12 px-4 justify-between min-w-[180px] ${
            isInternshipMode 
              ? 'bg-gray-700/90 border-gray-600 hover:bg-gray-600 text-white' 
              : 'bg-white/90 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-2">
            {loading ? (
              <Loader2 className={`h-4 w-4 animate-spin ${
                isInternshipMode ? 'text-blue-400' : 'text-blue-500'
              }`} />
            ) : (
              <MapPin className={`h-4 w-4 ${
                isInternshipMode ? 'text-blue-400' : 'text-blue-500'
              }`} />
            )}
            <span className="text-sm font-medium truncate max-w-[120px]">
              {getDisplayText()}
            </span>
          </div>
          <ChevronDown className={`h-4 w-4 ${
            isInternshipMode ? 'text-gray-400' : 'text-gray-400'
          }`} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-80 p-4 ${
        isInternshipMode ? 'bg-gray-800 border-gray-600' : ''
      }`} align="start">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Current Location</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={onDetectLocation}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Detecting...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Detect my location
                </>
              )}
            </Button>
            {userDenied && (
              <p className="text-xs text-red-600 mt-1">
                Location access was denied. Please enable location services in your browser.
              </p>
            )}
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium text-sm mb-2">Enter Location</h4>
            <form onSubmit={handleSubmit} className="space-y-2">
              <Input
                placeholder="Enter city, state, or address"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="text-sm"
              />
              <Button
                type="submit"
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!inputValue.trim()}
              >
                Set Location
              </Button>
            </form>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LocationSelector;