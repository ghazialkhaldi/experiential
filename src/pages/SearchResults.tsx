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
import ExperientialLogo from "@/components/ExperientialLogo";
import OpportunityDetailDialog from "@/components/OpportunityDetailDialog";
import { useOpportunities } from "@/hooks/useOpportunities";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "@/hooks/useLocation";
import { useMode } from "@/contexts/ModeContext";
import { useState, useEffect } from "react";
import LocationSelector from "@/components/LocationSelector";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isInternshipMode } = useMode();
  
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

  const handleLocationChange = (locationInput: string) => {
    setManualLocation(locationInput);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (categoryFilter && categoryFilter !== 'all') params.set('category', categoryFilter);
    // Always persist the current location in URL if available
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
    <div className={`min-h-screen ${isInternshipMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-green-50'}`}>
      {/* Navigation */}
      <nav className={`shadow-sm border-b ${isInternshipMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <ExperientialLogo className="h-16 w-auto" />
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/" className={`font-medium ${isInternshipMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}>
                {isInternshipMode ? 'Internships' : 'Opportunities'}
              </Link>
              <Link to={isInternshipMode ? "/career-resources" : "/resources"} className={`font-medium text-sm ${isInternshipMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}>
                {isInternshipMode ? 'Career Resources' : 'University Resources'}
              </Link>
              {user && (
                <Link to="/manage-opportunities" className={`font-medium ${isInternshipMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}>
                  Manage
                </Link>
              )}
              <AuthButton />
              <Link to="/post-opportunity">
                <Button className={`${
                  isInternshipMode 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}>
                  {isInternshipMode ? 'Post Internship' : 'Post Opportunity'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Header */}
      <section className={`py-8 px-4 sm:px-6 lg:px-8 border-b ${isInternshipMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <Link to="/" className={`flex items-center hover:text-blue-600 mr-4 ${isInternshipMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'}`}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className={`rounded-lg p-6 mb-6 ${isInternshipMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <LocationSelector
                location={activeLocation}
                loading={locationLoading}
                onLocationChange={handleLocationChange}
                onDetectLocation={getCurrentLocation}
                userDenied={userDenied}
              />
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder={isInternshipMode ? "Search internship opportunities..." : "Search volunteer opportunities..."} 
                  className={`pl-10 h-12 ${isInternshipMode ? 'bg-gray-600 border-gray-500 text-white placeholder:text-gray-400' : 'bg-white'}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className={`h-12 ${isInternshipMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white'}`}>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className={isInternshipMode ? 'bg-gray-700 border-gray-600' : ''}>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="animal_care">Animal Care</SelectItem>
                  <SelectItem value="community_service">Community Service</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                </SelectContent>
              </Select>
              <Button className={`h-12 ${
                isInternshipMode 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`} onClick={handleSearch}>
                Search
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className={`text-2xl font-bold mb-2 ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>Search Results</h1>
              <p className={isInternshipMode ? 'text-gray-300' : 'text-gray-600'}>
                {resultsCount} {resultsCount === 1 ? (isInternshipMode ? 'internship' : 'opportunity') : (isInternshipMode ? 'internships' : 'opportunities')} found
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
                <SelectTrigger className={`w-48 ${isInternshipMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className={isInternshipMode ? 'bg-gray-700 border-gray-600' : ''}>
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
              <h3 className={`text-xl font-semibold mb-2 ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>No {isInternshipMode ? 'internships' : 'opportunities'} found</h3>
              <p className={`mb-6 ${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Try adjusting your search criteria or browse all {isInternshipMode ? 'internships' : 'opportunities'}.
              </p>
              <Link to="/">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Browse All {isInternshipMode ? 'Internships' : 'Opportunities'}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className={`hover:shadow-lg transition-shadow cursor-pointer ${isInternshipMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {opportunity.category.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm text-gray-500">{formatTimeAgo(opportunity.posted_at)}</span>
                    </div>
                    <CardTitle className={`text-xl mb-2 ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>{opportunity.title}</CardTitle>
                    <CardDescription className={`font-medium ${isInternshipMode ? 'text-green-400' : 'text-green-600'}`}>
                      {opportunity.organization.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-3">
                      <div className={`flex items-center ${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <MapPin className="h-4 w-4 mr-2" />
                        <div className="flex-1">
                          <span className="text-sm">{opportunity.location}</span>
                          {opportunity.distance && (
                            <span className="text-xs text-blue-400 block">
                              {opportunity.distance.toFixed(1)} km away
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={`flex items-center ${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">{opportunity.time_commitment}</span>
                      </div>
                      <p className={`text-sm leading-relaxed line-clamp-3 ${isInternshipMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {opportunity.description}
                      </p>
                      {opportunity.max_volunteers && (
                        <div className={`flex items-center ${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <Users className="h-4 w-4 mr-2" />
                          <span className="text-sm">
                            {opportunity.current_volunteers}/{opportunity.max_volunteers} {isInternshipMode ? 'participants' : 'volunteers'}
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