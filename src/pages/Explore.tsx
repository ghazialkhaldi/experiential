import { useState } from 'react';
import OpportunityDetailDialog from '@/components/OpportunityDetailDialog';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useLocation } from '@/hooks/useLocation';
import { useMode } from '@/contexts/ModeContext';
import LocationSelector from '@/components/LocationSelector';
import { formatTimeAgo } from '@/utils/dateUtils';

const Explore = () => {
  const navigate = useNavigate();
  const { isInternshipMode } = useMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { 
    location: userLocation, 
    loading: locationLoading, 
    userDenied,
    getCurrentLocation,
    setManualLocation 
  } = useLocation();

  const { opportunities, loading } = useOpportunities(searchQuery, 'all', userLocation);

  const handleSearch = () => {
    // Search is already reactive through the searchQuery state
  };

  return (
    <div className={`min-h-screen ${
      isInternshipMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900' 
        : 'bg-gradient-to-br from-white via-blue-200 to-blue-400'
    }`}>
      {/* Back Button - Fixed positioning */}
      <div className="absolute top-16 left-4 z-10">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/dashboard')}
          className={`shadow-lg backdrop-blur-sm ${
            isInternshipMode 
              ? 'text-gray-100 hover:text-white bg-gray-800/90 hover:bg-gray-700/90' 
              : 'text-gray-700 hover:text-gray-900 bg-white/90 hover:bg-white'
          }`}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      {/* Content - Added top padding and title */}
      <div className="p-4 pt-20">
        <h1 className={`text-xl font-semibold mb-6 text-center ${
          isInternshipMode ? 'text-white' : 'text-gray-900'
        }`}>
          Explore {isInternshipMode ? 'Internships' : 'Opportunities'}
        </h1>
        
        {/* Search Section with Colored Hue */}
        <div className="relative mb-6">
          {/* Colored Hue Background for Entire Card */}
          <div className={`absolute inset-0 rounded-lg ${
            isInternshipMode 
              ? 'bg-gradient-to-br from-purple-500/30 via-purple-600/25 to-purple-700/30 blur-md' 
              : 'bg-gradient-to-br from-blue-400/35 via-blue-500/30 to-blue-600/35 blur-md'
          } -z-10`}></div>
          
          <Card className={`relative z-10 ${
            isInternshipMode 
              ? 'bg-gray-800/90 border-purple-500/40 backdrop-blur-sm shadow-xl shadow-purple-500/20' 
              : 'bg-white/90 border-blue-400/40 backdrop-blur-sm shadow-xl shadow-blue-400/20'
          }`}>
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Location Selector */}
                <LocationSelector
                  location={userLocation}
                  loading={locationLoading}
                  onLocationChange={setManualLocation}
                  onDetectLocation={getCurrentLocation}
                  userDenied={userDenied}
                />
                
                {/* Search Bar */}
                <div className="relative">
                  <Search className={`absolute left-3 top-3 h-5 w-5 z-10 ${
                    isInternshipMode ? 'text-purple-300' : 'text-blue-600'
                  }`} />
                  <Input 
                    placeholder={`Search ${isInternshipMode ? 'internships' : 'opportunities'}...`}
                    className={`pl-10 h-12 ${
                      isInternshipMode 
                        ? 'bg-gray-700/90 border-purple-400/60 text-white placeholder-gray-300' 
                        : 'bg-white/95 border-blue-400/60 placeholder-gray-500'
                    }`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Opportunities List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <p className={`${
                isInternshipMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Loading opportunities...</p>
            </div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-8">
              <p className={`${
                isInternshipMode ? 'text-gray-300' : 'text-gray-600'
              }`}>No opportunities found</p>
            </div>
          ) : (
            opportunities.map((opportunity) => (
              <Card 
                key={opportunity.id}
                className={`cursor-pointer hover:shadow-lg transition-shadow duration-200 ${
                  isInternshipMode 
                    ? 'bg-gray-800/90 border-gray-700 hover:bg-gray-700/90' 
                    : 'bg-white/90 hover:bg-white'
                }`}
                onClick={() => setSelectedOpportunity(opportunity)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className={`text-lg ${
                        isInternshipMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {opportunity.title}
                      </CardTitle>
                      <CardDescription className={`flex items-center space-x-4 mt-2 ${
                        isInternshipMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {opportunity.location}
                        </span>
                        <span>{formatTimeAgo(opportunity.posted_at)}</span>
                      </CardDescription>
                    </div>
                    <Badge variant={isInternshipMode ? "outline" : "secondary"} className={
                      isInternshipMode ? 'border-purple-400 text-purple-300' : ''
                    }>
                      {opportunity.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={`line-clamp-2 mb-4 ${
                    isInternshipMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {opportunity.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${
                      isInternshipMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {opportunity.organization?.name || 'Organization'}
                    </span>
                    <Button 
                      size="sm"
                      className={
                        isInternshipMode 
                          ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedOpportunity(opportunity);
                        setDialogOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      <OpportunityDetailDialog
        opportunity={selectedOpportunity}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Explore;