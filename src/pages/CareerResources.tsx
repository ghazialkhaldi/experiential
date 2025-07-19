import { ArrowLeft, BookOpen, Lightbulb, TrendingUp, Briefcase, Users, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import AuthButton from "@/components/AuthButton";
import { useMode } from "@/contexts/ModeContext";

const CareerResources = () => {
  const { isInternshipMode } = useMode();

  const resources = [
    {
      title: "Resume Building Guide",
      description: "Learn how to create a compelling resume that stands out to employers",
      category: "Career Prep",
      icon: FileText,
      link: "https://www.indeed.com/career-advice/resumes-cover-letters/how-to-make-a-resume"
    },
    {
      title: "Interview Preparation",
      description: "Master the art of interviewing with our comprehensive preparation guide",
      category: "Interview Skills",
      icon: Lightbulb,
      link: "https://www.glassdoor.com/blog/common-interview-questions/"
    },
    {
      title: "Industry Insights",
      description: "Explore different career paths and industry trends",
      category: "Career Exploration",
      icon: TrendingUp,
      link: "https://www.bls.gov/ooh/"
    },
    {
      title: "Networking Strategies",
      description: "Build professional relationships that advance your career",
      category: "Professional Growth",
      icon: Users,
      link: "https://www.linkedin.com/advice/0/how-do-you-network-effectively-your-industry"
    },
    {
      title: "Salary Negotiation",
      description: "Learn how to negotiate fair compensation packages",
      category: "Career Advancement",
      icon: TrendingUp,
      link: "https://www.harvard.edu/sites/default/files/content/salary_negotiation.pdf"
    },
    {
      title: "Professional Portfolio",
      description: "Showcase your work and accomplishments effectively",
      category: "Career Prep",
      icon: Briefcase,
      link: "https://www.portfolio.dev/guides/how-to-create-a-professional-portfolio"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800/80 backdrop-blur-md shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 fade-in transition-colors hover:opacity-80">
              <div className="relative">
                <Briefcase className="h-8 w-8 text-blue-400 floating" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold text-white">E<span className="text-blue-500">x</span>per<span className="relative">ı<span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 text-blue-500 text-sm">•</span></span>ent<span className="relative">ı<span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 text-blue-500 text-sm">•</span></span>al<span className="text-blue-500">.</span></span>
            </Link>
            <div className="flex items-center space-x-6 fade-in-delayed">
              <Link to="/" className="text-gray-300 hover:text-blue-400 font-medium transition-colors duration-200 relative group">
                Internships
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link to="/career-resources" className="text-gray-300 hover:text-blue-400 font-medium text-sm transition-colors duration-200 relative group">
                Career Resources
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <AuthButton />
              <Link to="/post-opportunity">
                <Button className="bg-blue-600 hover:bg-blue-700 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
                  Post Internship
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link to="/">
          <Button variant="ghost" className="mb-4 text-gray-300 hover:text-white hover:bg-gray-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Internships
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Dark mode background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 via-purple-600/10 to-gray-900"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 via-indigo-500/8 to-transparent"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="fade-in">
            <h1 className="text-6xl font-bold text-white mb-6 leading-tight drop-shadow-sm">
              Career Resources
              <span className="text-blue-400 block">Launch Your Future</span>
            </h1>
          </div>
          <div className="fade-in-delayed">
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Access expert guidance, industry insights, and professional development tools to accelerate your career journey.
            </p>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Professional Development Tools</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to build a successful career, from landing your first internship to advancing in your chosen field.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource, index) => {
              const IconComponent = resource.icon;
              return (
                <Card key={index} className={`bg-gray-800/80 border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                  index % 3 === 0 ? 'fade-in' : index % 3 === 1 ? 'fade-in-delayed' : 'fade-in-delayed-2'
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-600/20 rounded-lg">
                          <IconComponent className="h-6 w-6 text-blue-400" />
                        </div>
                        <Badge variant="secondary" className="bg-gray-700 text-gray-300 border-gray-600">
                          {resource.category}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-xl text-white">{resource.title}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                      asChild
                    >
                      <a href={resource.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Learn More
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-indigo-600/20"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="fade-in">
            <h2 className="text-4xl font-bold mb-6">Ready to Take the Next Step?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Start applying these career strategies today and find your next internship opportunity.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-delayed">
            <Link to="/">
              <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl px-8 py-4">
                Find Internships
              </Button>
            </Link>
               <Link to="/post-opportunity">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 transform transition-all duration-200 hover:scale-105 px-8 py-4">
                  Post an Internship
                </Button>
              </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareerResources;