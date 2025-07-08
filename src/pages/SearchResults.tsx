import { Search, MapPin, Clock, Users, Filter, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import AuthButton from "@/components/AuthButton";
import OpportunityDetailDialog from "@/components/OpportunityDetailDialog";
import { useOpportunities } from "@/hooks/useOpportunities";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "@/hooks/useLocation";
import { useState, useEffect } from "react";
import LocationSelector from "@/components/LocationSelector";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Location hook and URL location params
  const { 
    location: userLocation, 
    loading: locationLoading, 
    error: locationError,
    userDenied,
    getCurrentLocation,
    setManualLocation 
  } = useLocation();
  
  // Check for location params in URL
  const urlLat = searchParams.get('lat');
  const urlLng = searchParams.get('lng');
  const locationFromUrl = urlLat && urlLng ? 
    { latitude: parseFloat(urlLat), longitude: parseFloat(urlLng) } : null;
  
  const activeLocation = locationFromUrl || userLocation;
  
  const { opportunities, loading, error } = useOpportunities(searchQuery, categoryFilter, activeLocation);

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
    setCategoryFilter(searchParams.get('category') || 'all');
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (categoryFilter && categoryFilter !== 'all') params.set('category', categoryFilter);
    if (activeLocation) {
      params.set('lat', activeLocation.latitude.toString());
      params.set('lng', activeLocation.longitude.toString());
    }
    navigate(`/search?${params.toString()}`);
  };

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

  // Sort opportunities based on selected option
  const sortedOpportunities = [...opportunities].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime();
      case 'closest':
        // Sort by distance if available, otherwise alphabetically
        if (a.distance !== undefined && b.distance !== undefined) {
          return a.distance - b.distance;
        }
        if (a.distance !== undefined) return -1;
        if (b.distance !== undefined) return 1;
        return a.location.localeCompare(b.location);
      case 'time':
        return a.time_commitment.localeCompare(b.time_commitment);
      default:
        return 0;
    }
  });

  const resultsCount = sortedOpportunities.length;
  const searchTerm = searchParams.get('q');
  const categoryTerm = searchParams.get('category');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">VolunteerHub</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Opportunities
              </Link>
              <Link to="/resources" className="text-gray-700 hover:text-blue-600 font-medium text-sm">
                University Resources
              </Link>
              {user && (
                <Link to="/manage-opportunities" className="text-gray-700 hover:text-blue-600 font-medium">
                  Manage
                </Link>
              )}
              <AuthButton />
              <Link to="/post-opportunity">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Post Opportunity
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Header */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <Link to="/" className="flex items-center text-gray-600 hover:text-blue-600 mr-4">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <LocationSelector
                location={activeLocation}
                loading={locationLoading}
                onLocationChange={setManualLocation}
                onDetectLocation={getCurrentLocation}
                userDenied={userDenied}
              />
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="Search volunteer opportunities..." 
                  className="pl-10 h-12 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-12 bg-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="animal_care">Animal Care</SelectItem>
                  <SelectItem value="community_service">Community Service</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                </SelectContent>
              </Select>
              <Button className="h-12 bg-blue-600 hover:bg-blue-700" onClick={handleSearch}>
                Search
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Search Results</h1>
              <p className="text-gray-600">
                {resultsCount} {resultsCount === 1 ? 'opportunity' : 'opportunities'} found
                {searchTerm && (
                  <span> for "<span className="font-semibold">{searchTerm}</span>"</span>
                )}
                {categoryTerm && categoryTerm !== 'all' && (
                  <span> in <span className="font-semibold">{categoryTerm.replace('_', ' ')}</span></span>
                )}
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="closest">Closest Location</SelectItem>
                  <SelectItem value="time">Time Commitment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Searching opportunities...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : sortedOpportunities.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No opportunities found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or browse all opportunities.
              </p>
              <Link to="/">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Browse All Opportunities
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="hover:shadow-lg transition-shadow cursor-pointer bg-white">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {opportunity.category.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm text-gray-500">{formatTimeAgo(opportunity.posted_at)}</span>
                    </div>
                    <CardTitle className="text-xl mb-2">{opportunity.title}</CardTitle>
                    <CardDescription className="text-green-600 font-medium">
                      {opportunity.organization.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <div className="flex-1">
                          <span className="text-sm">{opportunity.location}</span>
                          {opportunity.distance && (
                            <span className="text-xs text-blue-600 block">
                              {opportunity.distance.toFixed(1)} km away
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">{opportunity.time_commitment}</span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                        {opportunity.description}
                      </p>
                      {opportunity.max_volunteers && (
                        <div className="flex items-center text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          <span className="text-sm">
                            {opportunity.current_volunteers}/{opportunity.max_volunteers} volunteers
                          </span>
                        </div>
                      )}
                      <Button 
                        className="w-full mt-4 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          setSelectedOpportunity(opportunity);
                          setDialogOpen(true);
                        }}
                      >
                        View Details & Apply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Opportunity Detail Dialog */}
      <OpportunityDetailDialog
        opportunity={selectedOpportunity}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default SearchResults;