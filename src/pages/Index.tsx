import { Search, MapPin, Clock, Users, BookOpen, Briefcase, Star, ArrowRight, TrendingUp, Heart } from "lucide-react";
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
import LocationSelector from "@/components/LocationSelector";
import GoogleUserNotification from "@/components/GoogleUserNotification";
import { isNewOpportunity, formatTimeAgo } from "@/utils/dateUtils";
import { useIsMobile } from "@/hooks/use-mobile";

const ModernIndex = () => {
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
      { firstPart: "Make a Real", secondPart: "Impact Today" },
      { firstPart: "Discover Life-Changing", secondPart: "Volunteer Experiences" },
      { firstPart: "Connect with Meaningful", secondPart: "Service Projects" },
      { firstPart: "Transform Communities", secondPart: "Through Service" }
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
        // For now, just sort by newest since latitude/longitude might not be available
        return new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime();
      default:
        return 0;
    }
  });

  const topOpportunities = sortedOpportunities.slice(0, 6);

  const handleOpportunityClick = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setDialogOpen(true);
  };

  // Stats data
  const stats = [
    { number: "10K+", label: "Active Volunteers", icon: Users },
    { number: "500+", label: "Organizations", icon: Heart },
    { number: "2.5M", label: "Hours Volunteered", icon: Clock },
    { number: "98%", label: "Satisfaction Rate", icon: Star }
  ];

  const categories = [
    { name: "Education", icon: BookOpen, count: "250+" },
    { name: "Environment", icon: TrendingUp, count: "180+" },
    { name: "Healthcare", icon: Heart, count: "320+" },
    { name: "Community", icon: Users, count: "420+" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/Experiential.jpeg" alt="Experiential Logo" className="h-8 w-auto" />
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/discover" className="font-medium text-gray-700 hover:text-primary transition-colors">
              Discover
            </Link>
            <Link to="/resources" className="font-medium text-gray-700 hover:text-primary transition-colors">
              Resources
            </Link>
            {isOrganization && (
              <Link to="/post-opportunity" className="font-medium text-gray-700 hover:text-primary transition-colors">
                Post Opportunity
              </Link>
            )}
          </div>
          <AuthButton />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-container">
        <div className="hero-bg-pattern"></div>
        <div className="hero-content">
          <div className="max-w-6xl mx-auto text-center">
            <div className="fade-in mb-8">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6">
                <span className="text-gradient-hero">
                  {currentHeroText.firstPart}
                </span>
                <br />
                <span className="text-white">
                  {currentHeroText.secondPart}
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-medium">
                Join thousands of volunteers making a difference in their communities. 
                Find meaningful opportunities that match your passion and skills.
              </p>
            </div>

            {/* Search Container */}
            <div className="fade-in-delayed search-container mb-16">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-5">
                  <Input
                    placeholder="Search opportunities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-14 text-lg rounded-2xl border-0 bg-white/90 backdrop-blur-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="md:col-span-3">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-14 rounded-2xl border-0 bg-white/90 backdrop-blur-sm">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="environment">Environment</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <div className="h-14 rounded-2xl border-0 bg-white/90 backdrop-blur-sm flex items-center px-4">
                    <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-700">
                      {userLocation ? `${userLocation.latitude.toFixed(2)}, ${userLocation.longitude.toFixed(2)}` : 'Location'}
                    </span>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Button 
                    onClick={handleSearch}
                    className="btn-modern w-full h-14 text-lg"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="fade-in-delayed-2 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="stat-container">
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-gradient-hero">
              Explore Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find opportunities that align with your interests and make a meaningful impact
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="glass-card p-8 text-center group cursor-pointer hover:scale-105 transition-all duration-300">
                <category.icon className="h-12 w-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.count} opportunities</p>
                <Button variant="ghost" className="group-hover:bg-primary group-hover:text-white transition-all">
                  Explore <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Opportunities */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-gradient-hero">
              Latest Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fresh opportunities posted by organizations in your area
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topOpportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className="opportunity-card cursor-pointer"
                onClick={() => handleOpportunityClick(opportunity)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{opportunity.title}</h3>
                    <p className="text-gray-600 font-medium">{typeof opportunity.organization === 'string' ? opportunity.organization : opportunity.organization?.name || 'Organization'}</p>
                  </div>
                  {isNewOpportunity(opportunity.posted_at) && (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      New
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-3">{opportunity.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatTimeAgo(opportunity.posted_at)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {opportunity.category}
                  </Badge>
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary hover:text-white">
                    Learn More <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild className="btn-modern">
              <Link to="/discover">
                View All Opportunities <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-gradient-hero">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our community of changemakers and start your volunteer journey today. 
              Every hour counts, every action matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-modern">
                <Link to="/discover">Start Volunteering</Link>
              </Button>
              <Button asChild className="btn-modern-secondary">
                <Link to="/resources">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunity Detail Dialog */}
      <OpportunityDetailDialog
        opportunity={selectedOpportunity}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      {/* Google User Notification */}
      {user && showGoogleNotification && (
        <GoogleUserNotification onDismiss={() => setShowGoogleNotification(false)} />
      )}
    </div>
  );
};

export default ModernIndex;