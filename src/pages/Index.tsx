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

const Index = () => {
  const opportunities = [
    {
      id: 1,
      title: "Animal Shelter Assistant",
      organization: "City Animal Rescue",
      location: "Downtown Community Center",
      type: "Animal Care",
      timeCommitment: "4-6 hours/week",
      description: "Help care for rescued animals, assist with feeding, cleaning, and socialization activities.",
      requirements: "Ages 16+, weekend availability preferred",
      posted: "2 days ago"
    },
    {
      id: 2,
      title: "Tutoring Assistant",
      organization: "Boys & Girls Club",
      location: "Westside Community Center",
      type: "Education",
      timeCommitment: "3-5 hours/week",
      description: "Support elementary students with homework and reading activities after school.",
      requirements: "Ages 15+, strong academic performance",
      posted: "1 week ago"
    },
    {
      id: 3,
      title: "Community Garden Helper",
      organization: "Green City Initiative",
      location: "Central Park Garden",
      type: "Environment",
      timeCommitment: "2-4 hours/week",
      description: "Assist with planting, weeding, and harvesting in our community garden program.",
      requirements: "Ages 14+, outdoor work comfort",
      posted: "3 days ago"
    },
    {
      id: 4,
      title: "Senior Center Companion",
      organization: "Golden Years Center",
      location: "Maple Street Senior Center",
      type: "Community Service",
      timeCommitment: "2-3 hours/week",
      description: "Spend time with elderly residents, play games, assist with activities, and provide companionship.",
      requirements: "Ages 16+, patient and friendly personality",
      posted: "5 days ago"
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
              <Link to="/resources" className="text-gray-700 hover:text-blue-600 font-medium">
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

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find Your Perfect
            <span className="text-blue-600"> Volunteer Opportunity</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with local organizations and make a difference in your community while building experience for college applications.
          </p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="Search volunteer opportunities..." 
                  className="pl-10 h-12"
                />
              </div>
              <Select>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="animal-care">Animal Care</SelectItem>
                  <SelectItem value="community">Community Service</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                </SelectContent>
              </Select>
              <Button className="h-12 bg-blue-600 hover:bg-blue-700">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">2,500+</div>
              <div className="text-gray-600">Active Opportunities</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">15,000+</div>
              <div className="text-gray-600">Student Volunteers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">800+</div>
              <div className="text-gray-600">Partner Organizations</div>
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
              <Select>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opportunity) => (
              <Card key={opportunity.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {opportunity.type}
                    </Badge>
                    <span className="text-sm text-gray-500">{opportunity.posted}</span>
                  </div>
                  <CardTitle className="text-xl mb-2">{opportunity.title}</CardTitle>
                  <CardDescription className="text-green-600 font-medium">
                    {opportunity.organization}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{opportunity.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">{opportunity.timeCommitment}</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {opportunity.description}
                    </p>
                    <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                      <strong>Requirements:</strong> {opportunity.requirements}
                    </p>
                    <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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

export default Index;
