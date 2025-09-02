import { Search, MapPin, Clock, Users, BookOpen, Briefcase } from "lucide-react";
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
import { Link } from "react-router-dom";
import AuthButton from "@/components/AuthButton";
import ExperientialLogo from "@/components/ExperientialLogo";

import OpportunityDetailDialog from "@/components/OpportunityDetailDialog";
import { useOpportunities } from "@/hooks/useOpportunities";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "@/hooks/useLocation";
import { useMode } from "@/contexts/ModeContext";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import LocationSelector from "@/components/LocationSelector";
import GoogleUserNotification from "@/components/GoogleUserNotification";
import { NotificationBell } from "@/components/NotificationBell";
import { isNewOpportunity, formatTimeAgo } from "@/utils/dateUtils";
import { useIsMobile } from "@/hooks/use-mobile";
import Footer from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();
  const { isInternshipMode } = useMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showGoogleNotification, setShowGoogleNotification] = useState(true);
  const isMobile = useIsMobile();
  
  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  // Location hook
  const { 
    location: userLocation, 
    loading: locationLoading, 
    error: locationError,
    userDenied,
    getCurrentLocation,
    setManualLocation 
  } = useLocation();
  
  // Update sorting to closest when location becomes available
  useEffect(() => {
    if (userLocation && userLocation.latitude !== 0 && userLocation.longitude !== 0 && sortBy === 'newest') {
      setSortBy('closest');
    }
  }, [userLocation, sortBy]);
  
  // Show latest opportunities on home page with location-based sorting
  const { opportunities, loading, error } = useOpportunities('', 'all', userLocation);
  const { profile, organization, loading: profileLoading } = useProfile();
  const { user } = useAuth();

  // Hero text rotation - moved before conditional return
  const heroTexts = useMemo(() => {
    if (isInternshipMode) {
      return [
        { firstPart: "Launch Your", secondPart: "Career Journey" },
        { firstPart: "Discover Amazing", secondPart: "Internship Opportunities" },
        { firstPart: "Find Your Next", secondPart: "Professional Experience" },
        { firstPart: "Explore Exciting", secondPart: "Career Opportunities" }
      ];
    }
    return [
      { firstPart: "Find Your Perfect", secondPart: "Volunteer Opportunity" },
      { firstPart: "Discover Amazing", secondPart: "Volunteer Experiences" },
      { firstPart: "Connect with Meaningful", secondPart: "Service Projects" },
      { firstPart: "Explore Impactful", secondPart: "Community Opportunities" }
    ];
  }, [isInternshipMode]);

  const currentHeroText = useMemo(() => {
    // Random selection that changes on each page visit/refresh
    const randomIndex = Math.floor(Math.random() * heroTexts.length);
    return heroTexts[randomIndex];
  }, [heroTexts]);

  // Check if user is an organization (should see post opportunity button)
  const isOrganization = profile?.role === 'volunteer_searcher' || !!organization;

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (categoryFilter && categoryFilter !== 'all') params.set('category', categoryFilter);
    if (userLocation) {
      params.set('lat', userLocation.latitude.toString());
      params.set('lng', userLocation.longitude.toString());
    }
    navigate(`/search?${params.toString()}`);
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

  const handleCreateProfile = () => {
    if (user) {
      alert("You are already signed in!");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className={`min-h-screen ${
      isInternshipMode 
        ? 'bg-gray-900' 
        : 'hero-bg'
    }`}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Navigation */}
      <nav className={`backdrop-blur-md shadow-sm border-b ${
        isInternshipMode 
          ? 'bg-gray-800/80 border-gray-700' 
          : 'bg-white/80 border-blue-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile: Center the logo, Desktop: Left align */}
            <div className={`flex items-center space-x-2 fade-in ${
              isMobile ? 'absolute left-1/2 transform -translate-x-1/2' : 'ml-16'
            }`}>
              <span className={`text-2xl font-bold ${
                isInternshipMode 
                  ? 'text-white' 
                  : 'text-gray-900'
              }`}>
              <ExperientialLogo />
              </span>
            </div>
            <div className="flex items-center space-x-6 fade-in-delayed">
              {/* Desktop navigation - hide some items on mobile */}
              {!isMobile && (
                <>
                  {user && <NotificationBell />}
                  <AuthButton />
                  {isOrganization && (
                    <Link to="/post-opportunity">
                      <Button className="transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl bg-blue-600 hover:bg-blue-700">
                        {isInternshipMode ? 'Post Internship' : 'Post Opportunity'}
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Google User Notification */}
      {showGoogleNotification && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <GoogleUserNotification onDismiss={() => {
            console.log('Dismissing Google notification');
            setShowGoogleNotification(false);
          }} />
        </div>
      )}

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {!isInternshipMode ? (
          <>
            {/* Light Mode Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/15 via-blue-400/8 to-white"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-green-500/5 to-transparent"></div>
            
            {/* Circles with varying opacity that fade towards bottom */}
            <div className="absolute top-10 left-10 w-48 h-48 bg-blue-400/25 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
            <div className="absolute bottom-10 left-1/4 w-40 h-40 bg-green-400/15 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 right-10 w-32 h-32 bg-blue-300/30 rounded-full blur-lg animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-20 right-1/3 w-36 h-36 bg-purple-400/12 rounded-full blur-xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-1/3 left-1/2 w-28 h-28 bg-indigo-400/20 rounded-full blur-lg animate-pulse" style={{animationDelay: '3s'}}></div>
            <div className="absolute bottom-1/4 left-1/6 w-24 h-24 bg-cyan-400/18 rounded-full blur-md animate-pulse" style={{animationDelay: '2.5s'}}></div>
            
            {/* Decorative Grid Pattern that fades out */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/80"></div>
            <div className="absolute top-0 left-0 right-0 h-3/4 opacity-[0.08]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59 130 246) 1px, transparent 0)`,
              backgroundSize: '30px 30px'
            }}></div>
          </>
        ) : (
          <>
            {/* Dark Mode Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 via-purple-600/10 to-gray-900"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 via-indigo-500/8 to-transparent"></div>
            
            {/* Dark mode circles */}
            <div className="absolute top-10 left-10 w-48 h-48 bg-blue-500/30 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500/25 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
            <div className="absolute bottom-10 left-1/4 w-40 h-40 bg-indigo-400/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 right-10 w-32 h-32 bg-blue-400/35 rounded-full blur-lg animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-20 right-1/3 w-36 h-36 bg-cyan-400/18 rounded-full blur-xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-1/3 left-1/2 w-28 h-28 bg-purple-400/25 rounded-full blur-lg animate-pulse" style={{animationDelay: '3s'}}></div>
            <div className="absolute bottom-1/4 left-1/6 w-24 h-24 bg-blue-300/25 rounded-full blur-md animate-pulse" style={{animationDelay: '2.5s'}}></div>
            
            {/* Dark decorative grid */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/80"></div>
            <div className="absolute top-0 left-0 right-0 h-3/4 opacity-[0.1]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(96 165 250) 1px, transparent 0)`,
              backgroundSize: '30px 30px'
            }}></div>
          </>
        )}
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="fade-in">
            <h1 className={`text-6xl font-bold mb-6 leading-tight drop-shadow-sm ${
              isInternshipMode 
                ? 'text-white' 
                : 'text-gray-900'
            }`}>
              {currentHeroText.firstPart}
              <span className={`block ${
                isInternshipMode 
                  ? 'text-blue-400' 
                  : 'text-gradient-blue'
              }`}> {currentHeroText.secondPart}</span>
            </h1>
          </div>
          <div className="fade-in-delayed">
            <p className={`text-xl mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-sm ${
              isInternshipMode 
                ? 'text-gray-300' 
                : 'text-gray-700'
            }`}>
              {isInternshipMode 
                ? 'Launch your professional journey with internships and temporary positions that provide real-world experience and industry connections.'
                : 'Connect with local organizations and make a difference in your community while building experience for college applications.'
              }
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="fade-in-delayed-2">
            <div className={`backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto border relative ${
              isInternshipMode 
                ? 'bg-gray-800/95 border-gray-600/50' 
                : 'bg-white/95 border-blue-200/50'
            }`}>
              {/* Search bar glow effect */}
              <div className={`absolute inset-0 rounded-2xl ${
                isInternshipMode 
                  ? 'bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-indigo-500/10' 
                  : 'bg-gradient-to-r from-blue-500/5 via-white/10 to-green-500/5'
              }`}></div>
              <div className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <LocationSelector
                    location={userLocation}
                    loading={locationLoading}
                    onLocationChange={setManualLocation}
                    onDetectLocation={getCurrentLocation}
                    userDenied={userDenied}
                  />
                  <div className="md:col-span-2 relative group">
                    <Search className={`absolute left-3 top-3 h-5 w-5 transition-colors duration-200 ${
                      isInternshipMode 
                        ? 'text-gray-400 group-focus-within:text-purple-400' 
                        : 'text-gray-400 group-focus-within:text-blue-500'
                    }`} />
                    <Input 
                      placeholder={isInternshipMode ? "Search internship opportunities..." : "Search volunteer opportunities..."} 
                      className={`pl-10 h-12 transition-all duration-200 ${
                        isInternshipMode 
                          ? 'border-gray-600 focus:border-purple-400 bg-gray-700/90 text-white placeholder:text-gray-400 rainbow-ring-purple' 
                          : 'border-gray-200 focus:border-blue-500 bg-white/90 rainbow-ring-blue'
                      }`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className={`h-12 transition-all duration-200 ${
                      isInternshipMode 
                        ? 'border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 bg-gray-700/90 text-white' 
                        : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/90'
                    }`}>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className={`backdrop-blur-md ${
                      isInternshipMode 
                        ? 'bg-gray-800/95 border-gray-600/50' 
                        : 'bg-white/95 border-blue-200/50'
                    }`}>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="environment">Environment</SelectItem>
                      <SelectItem value="animal_care">Animal Care</SelectItem>
                      <SelectItem value="community_service">Community Service</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl" onClick={handleSearch}>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 ${
        isInternshipMode 
          ? 'bg-gradient-to-r from-gray-900 via-gray-800/50 to-gray-900' 
          : 'bg-gradient-to-r from-white via-blue-50/30 to-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className={`stat-card rounded-xl p-8 shadow-lg border ${
              isInternshipMode 
                ? 'bg-gray-800 border-blue-500/20' 
                : 'bg-white border-blue-100'
            }`}>
              <div className={`text-5xl font-bold mb-3 fade-in ${
                isInternshipMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {isInternshipMode ? '82%' : '71%'}
              </div>
              <div className={`font-medium ${
                isInternshipMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {isInternshipMode ? 'Career Success Rate' : 'University Acceptance Boost'}
              </div>
              <div className={`w-12 h-1 mx-auto mt-4 rounded ${
                isInternshipMode ? 'bg-blue-400' : 'bg-blue-600'
              }`}></div>
            </div>
            <div className={`stat-card rounded-xl p-8 shadow-lg border fade-in-delayed ${
              isInternshipMode 
                ? 'bg-gray-800 border-green-400/20' 
                : 'bg-white border-green-100'
            }`}>
              <div className={`text-5xl font-bold mb-3 ${
                isInternshipMode ? 'text-green-400' : 'text-green-600'
              }`}>
                {isInternshipMode ? '3.2M' : '2.8B'}
              </div>
              <div className={`font-medium ${
                isInternshipMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {isInternshipMode ? 'Global Internships Yearly' : 'Hours of Community Service'}
              </div>
              <div className={`w-12 h-1 mx-auto mt-4 rounded ${
                isInternshipMode ? 'bg-green-400' : 'bg-green-600'
              }`}></div>
            </div>
            <div className={`stat-card rounded-xl p-8 shadow-lg border fade-in-delayed-2 ${
              isInternshipMode 
                ? 'bg-gray-800 border-purple-400/20' 
                : 'bg-white border-purple-100'
            }`}>
              <div className={`text-5xl font-bold mb-3 ${
                isInternshipMode ? 'text-purple-400' : 'text-purple-600'
              }`}>
                {isInternshipMode ? '45%' : '89%'}
              </div>
              <div className={`font-medium ${
                isInternshipMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {isInternshipMode ? 'Salary Increase Post-Internship' : 'Report Personal Growth'}
              </div>
              <div className={`w-12 h-1 mx-auto mt-4 rounded ${
                isInternshipMode ? 'bg-purple-400' : 'bg-purple-600'
              }`}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className={`text-3xl font-bold ${
              isInternshipMode ? 'text-white' : 'text-gray-900'
            }`}>
              {isInternshipMode ? 'Latest Internships' : 'Latest Opportunities'}
            </h2>
            <div className="flex items-center space-x-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className={`w-48 ${
                  isInternshipMode 
                    ? 'bg-gray-800 border-gray-600 text-white' 
                    : ''
                }`}>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className={isInternshipMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="closest">Closest Location</SelectItem>
                  <SelectItem value="time">Time Commitment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className={isInternshipMode ? 'text-gray-300' : 'text-gray-600'}>
                Loading {isInternshipMode ? 'internships' : 'opportunities'}...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : sortedOpportunities.length === 0 ? (
            <div className="text-center py-12">
              <p className={isInternshipMode ? 'text-gray-300' : 'text-gray-600'}>
                No {isInternshipMode ? 'internships' : 'opportunities'} found. Try adjusting your search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedOpportunities.map((opportunity, index) => (
                <Card key={opportunity.id} className={`card-hover border-0 backdrop-blur-sm relative ${
                  index % 3 === 0 ? 'fade-in' : index % 3 === 1 ? 'fade-in-delayed' : 'fade-in-delayed-2'
                } ${
                  isInternshipMode ? 'bg-gray-800/80' : 'bg-white/80'
                }`}>
                  {/* New Label */}
                  {isNewOpportunity(opportunity.posted_at) && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <Badge className="bg-green-500 text-white border-0 text-xs px-2 py-1 animate-pulse">
                        NEW
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 px-3 py-1">
                        {opportunity.category.replace('_', ' ')}
                      </Badge>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isInternshipMode 
                          ? 'text-gray-400 bg-gray-700/50' 
                          : 'text-gray-500 bg-gray-100'
                      }`}>
                        {formatTimeAgo(opportunity.posted_at)}
                      </span>
                    </div>
                    <CardTitle className={`text-xl mb-2 leading-tight ${
                      isInternshipMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {opportunity.title}
                    </CardTitle>
                    <CardDescription className={`font-semibold ${
                      isInternshipMode ? 'text-green-400' : 'text-green-600'
                    }`}>
                      {opportunity.organization.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className={`flex items-center p-2 rounded-lg ${
                        isInternshipMode 
                          ? 'text-gray-300 bg-gray-700/50' 
                          : 'text-gray-600 bg-gray-50'
                      }`}>
                        <MapPin className={`h-4 w-4 mr-2 ${
                          isInternshipMode ? 'text-blue-400' : 'text-blue-500'
                        }`} />
                        <div className="flex-1">
                          <span className="text-sm font-medium">{opportunity.location}</span>
                          {opportunity.distance && (
                            <span className={`text-xs block ${
                              isInternshipMode ? 'text-blue-400' : 'text-blue-600'
                            }`}>
                              {opportunity.distance.toFixed(1)} km away
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={`flex items-center p-2 rounded-lg ${
                        isInternshipMode 
                          ? 'text-gray-300 bg-gray-700/50' 
                          : 'text-gray-600 bg-gray-50'
                      }`}>
                        <Clock className={`h-4 w-4 mr-2 ${
                          isInternshipMode ? 'text-green-400' : 'text-green-500'
                        }`} />
                        <span className="text-sm font-medium">{opportunity.time_commitment}</span>
                      </div>
                      <p className={`text-sm leading-relaxed line-clamp-3 p-3 rounded-lg border-l-4 ${
                        isInternshipMode 
                          ? 'text-gray-300 bg-gray-700/30 border-blue-400' 
                          : 'text-gray-700 bg-blue-50/50 border-blue-400'
                      }`}>
                        {opportunity.description}
                      </p>
                      {opportunity.max_volunteers && (
                        <div className={`flex items-center p-2 rounded-lg ${
                          isInternshipMode 
                            ? 'text-gray-300 bg-purple-900/30' 
                            : 'text-gray-600 bg-purple-50'
                        }`}>
                          <Users className={`h-4 w-4 mr-2 ${
                            isInternshipMode ? 'text-purple-400' : 'text-purple-500'
                          }`} />
                          <span className="text-sm font-medium">
                            {opportunity.current_volunteers}/{opportunity.max_volunteers} {isInternshipMode ? 'positions' : 'volunteers'}
                          </span>
                          <div className="ml-auto w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-400 to-purple-600"
                              style={{ width: `${(opportunity.current_volunteers / opportunity.max_volunteers) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <Button 
                        className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl text-white font-semibold"
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

      {/* CTA Section */}
      <section className={`py-16 text-white ${
        isInternshipMode 
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600' 
          : 'bg-gradient-to-r from-blue-600 to-green-600'
      }`}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          {isInternshipMode ? (
            <Briefcase className="h-16 w-16 mx-auto mb-6" />
          ) : (
            <BookOpen className="h-16 w-16 mx-auto mb-6" />
          )}
          <h2 className="text-3xl font-bold mb-4">
            {isInternshipMode ? 'Ready to Build Your Professional Network?' : 'Ready for College Applications?'}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {isInternshipMode 
              ? 'Access our comprehensive career resources to maximize your internship search and professional development.'
              : 'Access our comprehensive university resources guide to make the most of your volunteer experience.'
            }
          </p>
          <Link to={isInternshipMode ? "/career-resources" : "/resources"}>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              {isInternshipMode ? 'Explore Career Resources' : 'Explore University Resources'}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
