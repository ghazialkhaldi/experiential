
import { ArrowLeft, BookOpen, GraduationCap, FileText, Award, Users, Calendar, Target, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import AuthButton from "@/components/AuthButton";

const Resources = () => {
  const collegeGuides = [
    {
      title: "How Community Service Impacts College Admissions",
      description: "Research from NACAC (National Association for College Admission Counseling) shows 89% of colleges consider community service in admissions.",
      category: "Research",
      readTime: "8 min read",
      featured: true,
      url: "https://www.nacacnet.org/news--publications/Research/"
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
      url: "https://americorps.gov/about/our-impact/research-reports"
    },
    {
      title: "Do Good Institute - University of Maryland Research",
      description: "Academic research on civic engagement and service-learning effectiveness in higher education.",
      category: "Academic Research",
      readTime: "7 min read",
      url: "https://dogood.umd.edu/research"
    }
  ];

  const scholarshipOpportunities = [
    {
      name: "Prudential Spirit of Community Awards",
      amount: "$5,000 - $1,000",
      deadline: "November 5, 2024",
      description: "Recognizes students for outstanding volunteer service in their communities.",
      requirements: "Grades 5-12, significant volunteer service"
    },
    {
      name: "Coca-Cola Scholars Program",
      amount: "$20,000",
      deadline: "October 31, 2024",
      description: "Awards based on leadership, service, and academic excellence.",
      requirements: "High school seniors, leadership in community service"
    },
    {
      name: "Jefferson Award for Public Service",
      amount: "$1,000",
      deadline: "Rolling",
      description: "Celebrates students who demonstrate commitment to public service.",
      requirements: "Ages 14-25, documented community service"
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
              <Link to="/resources" className="text-blue-600 font-medium">
                University Resources
              </Link>
              <AuthButton />
              <Button className="bg-blue-600 hover:bg-blue-700">
                Post Opportunity
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link to="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Opportunities
          </Button>
        </Link>
      </div>

      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <GraduationCap className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            University Resources for
            <span className="text-green-600"> Volunteer Students</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to leverage your volunteer experience for college applications, scholarships, and future success.
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">89%</div>
              <div className="text-gray-600 text-sm">of colleges value community service</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-green-600 mb-2">$2.4B</div>
              <div className="text-gray-600 text-sm">in service-based scholarships annually</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-purple-600 mb-2">25%</div>
              <div className="text-gray-600 text-sm">admission boost with volunteer work</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-orange-600 mb-2">200+</div>
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
              <Card key={index} className={`hover:shadow-lg transition-shadow cursor-pointer ${guide.featured ? 'border-blue-200 bg-blue-50' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={guide.featured ? "default" : "secondary"} className={guide.featured ? "bg-blue-600" : ""}>
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
                  <Button variant={guide.featured ? "default" : "outline"} className="w-full" asChild>
                    <a href={guide.url} target="_blank" rel="noopener noreferrer">
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Award className="h-8 w-8 text-green-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Service-Based Scholarships</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scholarshipOpportunities.map((scholarship, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-green-600">{scholarship.name}</CardTitle>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-green-700 border-green-200">
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
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Learn More
                    <ExternalLink className="h-4 w-4 ml-2" />
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
              <Card key={index} className="hover:shadow-lg transition-shadow">
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

      {/* Action Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <BookOpen className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Start Building Your Story Today</h2>
          <p className="text-xl mb-8 opacity-90">
            Don't wait until senior year. Start volunteering now to build the experience that will set you apart.
          </p>
          <Link to="/">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Find Volunteer Opportunities
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
                <li><a href="#" className="hover:text-white">Find Opportunities</a></li>
                <li><a href="#" className="hover:text-white">Create Profile</a></li>
                <li><a href="#" className="hover:text-white">Track Hours</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Organizations</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Post Opportunities</a></li>
                <li><a href="#" className="hover:text-white">Manage Applications</a></li>
                <li><a href="#" className="hover:text-white">Organization Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/resources" className="hover:text-white">University Guide</Link></li>
                <li><a href="#" className="hover:text-white">Volunteer Tips</a></li>
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

export default Resources;
