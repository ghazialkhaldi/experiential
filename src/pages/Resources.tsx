
import { ArrowLeft, BookOpen, GraduationCap, FileText, Award, Users, Calendar, Target, ExternalLink, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useMode } from '@/contexts/ModeContext';
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { toast } from '@/hooks/use-toast';

const Resources = () => {
  const { isInternshipMode } = useMode();
  const navigate = useNavigate();

  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleBackNavigation = () => {
    triggerHaptic();
    toast({
      title: "Returning to Portfolio",
      description: "Going back to portfolio...",
      duration: 1500,
    });
    navigate('/dashboard');
  };
  const collegeGuides = [
    {
      title: "How Community Service Impacts College Admissions",
      description: "How communtiy service can have an impact on your college admissions by IvyWise.",
      category: "Research",
      readTime: "4 min read",
      featured: true,
      url: "https://www.ivywise.com/blog/does-community-service-matter-in-the-college-admissions-process"
    },
    {
      title: "The Economic Value of Volunteering (Independent Sector Study)",
      description: "2022 study showing volunteer time valued at $31.80 per hour, demonstrating significant impact of service work.",
      category: "Economic Impact",
      readTime: "5 min read",
      url: "https://independentsector.org/value-of-volunteer-time/"
    },
    {
      title: "Corporation for National and Community Service Research",
      description: "Comprehensive data on volunteering trends, demographics, and impact on communities across America.",
      category: "Government Data",
      readTime: "10 min read",
      url: "https://www.americorps.gov/newsroom/press-release/more-757-million-people-volunteered-america-americorps-reports"
    },
    {
      title: "Benefits of Community Engagement in Higher Education",
      description: "Academic research on community engagement and service-learning effectiveness in higher education.",
      category: "Community Service",
      readTime: "7 min read",
      url: "https://www.wcsu.edu/community-engagement/benefits-of-volunteering/"
    }
  ];

  const scholarshipOpportunities = [
    {
      name: "Prudential Spirit of Community Awards",
      amount: "$5,000 - $1,000",
      deadline: "November 5, 2024",
      description: "Recognizes students for outstanding volunteer service in their communities.",
      requirements: "Grades 5-12, significant volunteer service",
      url: "https://www.prudential.com/links/about/community-spirit-awards"
    },
    {
      name: "Coca-Cola Scholars Program",
      amount: "$20,000",
      deadline: "October 31, 2024",
      description: "Awards based on leadership, service, and academic excellence.",
      requirements: "High school seniors, leadership in community service",
      url: "https://www.coca-colascholarsfoundation.org/apply/"
    },
    {
      name: "The Diana Award",
      amount: "$1,000 - $5,000",
      deadline: "Rolling",
      description: "Recognizes young people making positive change in their communities.",
      requirements: "Ages 9-25, community service leadership",
      url: "https://diana-award.org.uk/award/"
    }
  ];

  const universitySpotlight = [
    {
      name: "Stanford University",
      program: "Haas Center for Public Service",
      highlight: "Students can earn academic credit for community service through the Cardinal Service program.",
      serviceHours: "Average student: 100+ hours/year"
    },
    {
      name: "Duke University",
      program: "DukeEngage",
      highlight: "Fully-funded summer service opportunities around the world for all students.",
      serviceHours: "Required: 8 weeks full-time service"
    },
    {
      name: "Tulane University",
      program: "Center for Public Service",
      highlight: "Only university with a public service graduation requirement (40 hours).",
      serviceHours: "Required: 40 hours minimum"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-blue-100/50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/20 to-blue-100/30"></div>
      <div className="absolute top-10 left-10 w-48 h-48 bg-blue-400/15 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
      <div className="absolute bottom-10 left-1/4 w-40 h-40 bg-purple-400/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>

      {/* Back Button - Updated for iPhone notch */}
      <div className="absolute top-16 left-4 z-20">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleBackNavigation}
          className="text-gray-600 hover:text-gray-900 bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Content - Added top padding for notch */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">{/* Updated padding */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="fade-in">
            <GraduationCap className="h-16 w-16 mx-auto mb-6 text-blue-600" />
            <h1 className="text-6xl font-bold text-gray-900 mb-4 leading-tight">
              University Resources for
              <span className="text-gradient-rainbow block">Volunteer Students</span>
            </h1>
          </div>
          <div className="fade-in-delayed">
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Everything you need to leverage your volunteer experience for college applications, scholarships, and future success.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 bg-transparent backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 stat-card">
              <div className="text-3xl font-bold text-blue-600 mb-2">89%</div>
              <div className="text-gray-600 text-sm">of colleges value community service</div>
            </div>
            <div className="p-4 stat-card">
              <div className="text-3xl font-bold text-cyan-600 mb-2">$2.4B</div>
              <div className="text-gray-600 text-sm">in service-based scholarships annually</div>
            </div>
            <div className="p-4 stat-card">
              <div className="text-3xl font-bold text-purple-600 mb-2">25%</div>
              <div className="text-gray-600 text-sm">admission boost with volunteer work</div>
            </div>
            <div className="p-4 stat-card">
              <div className="text-3xl font-bold text-indigo-600 mb-2">200+</div>
              <div className="text-gray-600 text-sm">universities with service requirements</div>
            </div>
          </div>
        </div>
      </section>

      {/* College Application Guides */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">College Application Guides</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collegeGuides.map((guide, index) => (
              <Card key={index} className={`card-hover cursor-pointer bg-white/90 backdrop-blur-sm border-0 shadow-lg ${guide.featured ? 'border-blue-200' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={guide.featured ? "default" : "secondary"} className={guide.featured ? "btn-rainbow text-white border-0" : ""}>
                      {guide.category}
                    </Badge>
                    <span className="text-sm text-gray-500">{guide.readTime}</span>
                  </div>
                  <CardTitle className="text-xl">{guide.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4">
                    {guide.description}
                  </CardDescription>
                  <Button 
                    className="btn-rainbow w-full text-gray-900" 
                    asChild
                  >
                    <a href={guide.url} target="_blank" rel="noopener noreferrer" className="text-gray-900">
                      Read Study
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Scholarship Opportunities */}
      <section className="py-16 bg-transparent backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Award className="h-8 w-8 text-cyan-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Service-Based Scholarships</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scholarshipOpportunities.map((scholarship, index) => (
              <Card key={index} className="card-hover bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-cyan-600">{scholarship.name}</CardTitle>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-cyan-700 border-cyan-200 bg-cyan-50">
                      {scholarship.amount}
                    </Badge>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {scholarship.deadline}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{scholarship.description}</p>
                  <div className="bg-gray-50 p-3 rounded mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>Requirements:</strong> {scholarship.requirements}
                    </p>
                  </div>
                  <Button className="btn-rainbow w-full text-gray-900" asChild>
                    <a href={scholarship.url} target="_blank" rel="noopener noreferrer" className="text-gray-900">
                      Learn More
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* University Spotlight */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <Target className="h-8 w-8 text-purple-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Universities That Value Service</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {universitySpotlight.map((university, index) => (
              <Card key={index} className="card-hover bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-purple-600">{university.name}</CardTitle>
                  <CardDescription className="font-medium text-gray-700">
                    {university.program}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{university.highlight}</p>
                  <div className="bg-purple-50 p-3 rounded">
                    <p className="text-sm text-purple-700">
                      <strong>Service Commitment:</strong> {university.serviceHours}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* University Checklist Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-600/20"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: "1s"}}></div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <CheckSquare className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Stay Organized with Our University Checklist</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Track your progress with customizable checklists designed specifically for university applications and volunteer requirements.
          </p>
          <Link to="/university-checklist">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 transform transition-all duration-200 hover:scale-105">
              Access University Checklist
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                {isInternshipMode ? (
                  <img src="/Experiential.jpeg" alt="Experiential Logo" className="h-6 w-auto brightness-0 invert" />
                ) : (
                  <img src="/Experiential.jpeg" alt="Experiential Logo" className="h-6 w-auto" />
                )}
              </div>
              <p className="text-gray-300">
                Connecting high school students with meaningful volunteer opportunities.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">For Students</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Find Opportunities</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Create Profile</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Track Hours</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">For Organizations</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Post Opportunities</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Manage Applications</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Organization Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/resources" className="hover:text-white transition-colors">University Guide</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Volunteer Tips</a></li>
                <li>
                  <FeedbackDialog>
                    <button className="hover:text-white transition-colors text-left">
                      Give Feedback
                    </button>
                  </FeedbackDialog>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2025 Experiential. Made for students, by students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Resources;
