import { Search, MapPin, Clock, Users, BookOpen } from "lucide-react";
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
import OrganizationSetup from "@/components/OrganizationSetup";
import OpportunityDetailDialog from "@/components/OpportunityDetailDialog";
import { useOpportunities } from "@/hooks/useOpportunities";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "@/hooks/useLocation";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import LocationSelector from "@/components/LocationSelector";

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Location hook
  const { 
    location: userLocation, 
    loading: locationLoading, 
    error: locationError,
    userDenied,
    getCurrentLocation,
    setManualLocation 
  } = useLocation();
  
  // Show latest opportunities on home page with location-based sorting
  const { opportunities, loading, error } = useOpportunities('', 'all', userLocation);
  const { hasIncompleteOrganization, hasIncompleteOrgData, loading: profileLoading } = useProfile();
  const { user } = useAuth();

  // Check if we need to show organization setup
  const needsOrganizationSetup = hasIncompleteOrganization || hasIncompleteOrgData;

  // Show organization setup if needed
  if (needsOrganizationSetup && !profileLoading) {
    return (
      <OrganizationSetup 
        onComplete={() => {
          // Refresh the page to show the normal interface
          window.location.reload();
        }}
      />
    );
  }

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

  const handleCreateProfile = () => {
    if (user) {
      alert("You are already signed in!");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen hero-bg">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 fade-in">
              <div className="relative">
                <Users className="h-8 w-8 text-blue-600 floating" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold text-gray-900">VolunteerHub</span>
            </div>
            <div className="flex items-center space-x-6 fade-in-delayed">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group">
                Opportunities
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link to="/resources" className="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors duration-200 relative group">
                University Resources
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              {user && (
                <Link to="/manage-opportunities" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group">
                  Manage
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                </Link>
              )}
              <AuthButton />
              <Link to="/post-opportunity">
                <Button className="bg-blue-600 hover:bg-blue-700 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
                  Post Opportunity
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated Background Elements with smooth transition to white */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/15 via-blue-400/8 to-white animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-green-500/5 to-transparent" 
             style={{
               animation: 'gradient-shift 8s ease-in-out infinite alternate',
               background: 'linear-gradient(45deg, rgba(37, 99, 235, 0.1), rgba(34, 197, 94, 0.05), transparent)'
             }}></div>
        
        {/* Moving gradient overlay */}
        <div className="absolute inset-0 opacity-30" 
             style={{
               background: 'linear-gradient(120deg, transparent 0%, rgba(59, 130, 246, 0.1) 25%, rgba(34, 197, 94, 0.08) 50%, rgba(168, 85, 247, 0.06) 75%, transparent 100%)',
               animation: 'wave-motion 12s linear infinite',
               backgroundSize: '300% 300%'
             }}></div>
        
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
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="fade-in">
            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight drop-shadow-sm">
              Find Your Perfect
              <span className="text-gradient-blue block"> Volunteer Opportunity</span>
            </h1>
          </div>
          <div className="fade-in-delayed">
            <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              Connect with local organizations and make a difference in your community while building experience for college applications.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="fade-in-delayed-2">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto border border-blue-200/50 relative">
              {/* Search bar glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-white/10 to-green-500/5 rounded-2xl"></div>
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
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                    <Input 
                      placeholder="Search volunteer opportunities..." 
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/90"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/90">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-md border-blue-200/50">
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
      <section className="py-16 bg-gradient-to-r from-white via-blue-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="stat-card bg-white rounded-xl p-8 shadow-lg border border-blue-100">
              <div className="text-5xl font-bold text-blue-600 mb-3 fade-in">2,500+</div>
              <div className="text-gray-600 font-medium">Active Opportunities</div>
              <div className="w-12 h-1 bg-blue-600 mx-auto mt-4 rounded"></div>
            </div>
            <div className="stat-card bg-white rounded-xl p-8 shadow-lg border border-green-100 fade-in-delayed">
              <div className="text-5xl font-bold text-green-600 mb-3">15,000+</div>
              <div className="text-gray-600 font-medium">Student Volunteers</div>
              <div className="w-12 h-1 bg-green-600 mx-auto mt-4 rounded"></div>
            </div>
            <div className="stat-card bg-white rounded-xl p-8 shadow-lg border border-purple-100 fade-in-delayed-2">
              <div className="text-5xl font-bold text-purple-600 mb-3">800+</div>
              <div className="text-gray-600 font-medium">Partner Organizations</div>
              <div className="w-12 h-1 bg-purple-600 mx-auto mt-4 rounded"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest Opportunities</h2>
            <div className="flex items-center space-x-4">
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

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading opportunities...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : sortedOpportunities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No opportunities found. Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedOpportunities.map((opportunity, index) => (
                <Card key={opportunity.id} className={`card-hover border-0 bg-white/80 backdrop-blur-sm ${index % 3 === 0 ? 'fade-in' : index % 3 === 1 ? 'fade-in-delayed' : 'fade-in-delayed-2'}`}>
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 px-3 py-1">
                        {opportunity.category.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{formatTimeAgo(opportunity.posted_at)}</span>
                    </div>
                    <CardTitle className="text-xl mb-2 text-gray-900 leading-tight">{opportunity.title}</CardTitle>
                    <CardDescription className="text-green-600 font-semibold">
                      {opportunity.organization.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        <div className="flex-1">
                          <span className="text-sm font-medium">{opportunity.location}</span>
                          {opportunity.distance && (
                            <span className="text-xs text-blue-600 block">
                              {opportunity.distance.toFixed(1)} km away
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <Clock className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-sm font-medium">{opportunity.time_commitment}</span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 bg-blue-50/50 p-3 rounded-lg border-l-4 border-blue-400">
                        {opportunity.description}
                      </p>
                      {opportunity.max_volunteers && (
                        <div className="flex items-center text-gray-600 bg-purple-50 p-2 rounded-lg">
                          <Users className="h-4 w-4 mr-2 text-purple-500" />
                          <span className="text-sm font-medium">
                            {opportunity.current_volunteers}/{opportunity.max_volunteers} volunteers
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
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <BookOpen className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready for College Applications?</h2>
          <p className="text-xl mb-8 opacity-90">
            Access our comprehensive university resources guide to make the most of your volunteer experience.
          </p>
          <Link to="/resources">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Explore University Resources
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-6 w-6" />
                <span className="text-xl font-bold">VolunteerHub</span>
              </div>
              <p className="text-gray-400">
                Connecting high school students with meaningful volunteer opportunities.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Students</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white">Find Opportunities</Link></li>
                <li><button onClick={handleCreateProfile} className="hover:text-white">Create Profile</button></li>
                <li><Link to="/track-hours" className="hover:text-white">Track Hours</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Organizations</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/post-opportunity" className="hover:text-white">Post Opportunities</Link></li>
                <li><Link to="/manage-opportunities" className="hover:text-white">Manage Applications</Link></li>
                <li><Link to="/manage-opportunities" className="hover:text-white">Organization Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/resources" className="hover:text-white">University Guide</Link></li>
                <li><Link to="/resources" className="hover:text-white">Volunteer Tips</Link></li>
                <li><a href="#" className="hover:text-white">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 VolunteerHub. Made for students, by students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
