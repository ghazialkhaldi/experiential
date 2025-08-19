import { useState } from 'react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/app/dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">
            Explore {isInternshipMode ? 'Internships' : 'Opportunities'}
          </h1>
        </div>
      </header>

      {/* Search Section */}
      <div className="p-4">
        <Card className="mb-6">
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
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder={`Search ${isInternshipMode ? 'internships' : 'opportunities'}...`}
                  className="pl-10 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opportunities List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading opportunities...</p>
            </div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No opportunities found</p>
            </div>
          ) : (
            opportunities.map((opportunity) => (
              <Card 
                key={opportunity.id}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => setSelectedOpportunity(opportunity)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-2">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {opportunity.location}
                        </span>
                        <span>{formatTimeAgo(opportunity.posted_at)}</span>
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {opportunity.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {opportunity.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {opportunity.organization?.name || 'Organization'}
                    </span>
                    <Button size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;