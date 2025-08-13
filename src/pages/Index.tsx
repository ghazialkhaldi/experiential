import { Search, MapPin, Clock, Users, BookOpen, Briefcase, TrendingUp, Heart, Award, Zap, Globe, Star } from "lucide-react";
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
import OpportunityDetailDialog from "@/components/OpportunityDetailDialog";
import { useOpportunities } from "@/hooks/useOpportunities";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "@/hooks/useLocation";
import { useMode } from "@/contexts/ModeContext";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import LocationSelector from "@/components/LocationSelector";
import GoogleUserNotification from "@/components/GoogleUserNotification";
import { isNewOpportunity, formatTimeAgo } from "@/utils/dateUtils";
import { useIsMobile } from "@/hooks/use-mobile";

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
  
  const { 
    location: userLocation, 
    loading: locationLoading, 
    error: locationError,
    userDenied,
    getCurrentLocation,
    setManualLocation 
  } = useLocation();
  
  const { opportunities, loading, error } = useOpportunities('', 'all', userLocation);
  const { profile, organization, loading: profileLoading } = useProfile();
  const { user } = useAuth();

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
    const randomIndex = Math.floor(Math.random() * heroTexts.length);
    return heroTexts[randomIndex];
  }, [heroTexts]);

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

  const sortedOpportunities = [...opportunities].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime();
      case 'closest':
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

  const stats = [
    { icon: Users, label: "Active Volunteers", value: "12,847", trend: "+23%" },
    { icon: BookOpen, label: "Opportunities", value: "3,264", trend: "+18%" },
    { icon: Heart, label: "Hours Volunteered", value: "87,341", trend: "+34%" },
    { icon: Award, label: "Organizations", value: "1,586", trend: "+12%" }
  ];

  const categories = [
    { name: "Education", icon: BookOpen, count: 324, color: "blue" },
    { name: "Environment", icon: Globe, count: 189, color: "green" },
    { name: "Healthcare", icon: Heart, count: 267, color: "red" },
    { name: "Community", icon: Users, count: 445, color: "purple" },
    { name: "Animal Care", icon: Star, count: 156, color: "orange" },
    { name: "Technology", icon: Zap, count: 98, color: "cyan" }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar />
      
      {/* Navigation */}
      <nav className="backdrop-blur-md bg-white/90 border-b border-neutral-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className={`flex items-center space-x-2 ${isMobile ? 'absolute left-1/2 transform -translate-x-1/2' : ''}`}>
              {isInternshipMode ? (
                <img src="/Experiential.jpeg" alt="Experiential Logo" className="h-20 w-auto brightness-0 invert" />
              ) : (
                <img src="/Experiential.jpeg" alt="Experiential Logo" className="h-16 w-auto" />
              )}
            </div>
            <div className="flex items-center space-x-6">
              {!isMobile && (
                <>
                  <Link to="/" className="font-medium text-neutral-700 hover:text-blue-600 transition-colors">
                    {isInternshipMode ? 'Internships' : 'Opportunities'}
                  </Link>
                  <Link to={isInternshipMode ? "/career-resources" : "/resources"} className="font-medium text-neutral-700 hover:text-blue-600 transition-colors">
                    {isInternshipMode ? 'Career Resources' : 'University Resources'}
                  </Link>
                  {user && (
                    <Link to="/manage-opportunities" className="font-medium text-neutral-700 hover:text-blue-600 transition-colors">
                      Manage
                    </Link>
                  )}
                  <AuthButton />
                  {isOrganization && (
                    <Link to="/post-opportunity">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg">
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
          <GoogleUserNotification onDismiss={() => setShowGoogleNotification(false)} />
        </div>
      )}

      {/* Hero Section - Stripe Inspired */}
      <section className="hero-section py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl floating-element"></div>
        <div className="absolute top-32 right-20 w-48 h-48 bg-purple-400/15 rounded-full blur-2xl floating-element" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-32 h-32 bg-cyan-400/25 rounded-full blur-xl floating-element" style={{animationDelay: '1s'}}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-7xl font-bold mb-6 leading-tight">
              {currentHeroText.firstPart}
              <span className="block text-gradient-hero">{currentHeroText.secondPart}</span>
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-12">
              {isInternshipMode 
                ? 'Launch your professional journey with internships and temporary positions that provide real-world experience and industry connections.'
                : 'Connect with local organizations and make a difference in your community while building experience for college applications.'
              }
            </p>
            
            {/* Search Bar - Stripe Style */}
            <div className="max-w-4xl mx-auto">
              <div className="stripe-card p-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <LocationSelector
                    location={userLocation}
                    loading={locationLoading}
                    onLocationChange={setManualLocation}
                    onDetectLocation={getCurrentLocation}
                    userDenied={userDenied}
                  />
                  <div className="md:col-span-2 relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                    <Input 
                      placeholder={isInternshipMode ? "Search internship opportunities..." : "Search volunteer opportunities..."} 
                      className="pl-10 h-12 border-neutral-200 focus:border-blue-500 bg-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-12 border-neutral-200 focus:border-blue-500 bg-white">
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
                  <Button 
                    className="h-12 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg" 
                    onClick={handleSearch}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Stripe Style */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-neutral-900 mb-1">{stat.value}</div>
                <div className="text-sm text-neutral-600 mb-2">{stat.label}</div>
                <div className="text-xs text-green-600 font-medium">{stat.trend}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Popular Categories</h2>
            <p className="text-xl text-neutral-600">Find opportunities that match your interests</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="stripe-card p-6 text-center group cursor-pointer">
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-${category.color}-100 rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className={`h-6 w-6 text-${category.color}-600`} />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">{category.name}</h3>
                <p className="text-sm text-neutral-600">{category.count} opportunities</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-neutral-900 mb-2">Featured Opportunities</h2>
              <p className="text-xl text-neutral-600">Discover meaningful ways to make a difference</p>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="closest">Closest to Me</SelectItem>
                <SelectItem value="time">Time Commitment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="stripe-card p-6 animate-pulse">
                  <div className="h-4 bg-neutral-200 rounded mb-4"></div>
                  <div className="h-6 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedOpportunities.slice(0, 6).map((opportunity) => (
                <div 
                  key={opportunity.id} 
                  className="stripe-card p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
                  onClick={() => {
                    setSelectedOpportunity(opportunity);
                    setDialogOpen(true);
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                      {opportunity.category}
                    </Badge>
                    {isNewOpportunity(opportunity.posted_at) && (
                      <Badge className="bg-green-100 text-green-700 border-green-200">New</Badge>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2 line-clamp-2">
                    {opportunity.title}
                  </h3>
                  
                  <p className="text-neutral-600 mb-4 line-clamp-3">{opportunity.description}</p>
                  
                  <div className="space-y-2 text-sm text-neutral-500">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{opportunity.location}</span>
                      {opportunity.distance && (
                        <span className="ml-2 text-blue-600">({opportunity.distance.toFixed(1)} mi away)</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{opportunity.time_commitment}</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      <span>Posted {formatTimeAgo(opportunity.posted_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button 
              onClick={() => navigate('/search')} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              View All Opportunities
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero-section py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-5xl font-bold text-neutral-900 mb-6">
            Ready to Make a <span className="text-gradient-hero">Difference?</span>
          </h2>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            Join thousands of volunteers making an impact in their communities. 
            Start your journey today and discover meaningful opportunities near you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={handleCreateProfile} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/search')}
              className="border-neutral-300 text-neutral-700 hover:bg-neutral-50 px-8 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105"
            >
              Browse Opportunities
            </Button>
          </div>
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

export default Index;