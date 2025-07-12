import { useState } from "react";
import { 
  Users, 
  Menu, 
  X, 
  Search, 
  UserPlus, 
  Clock, 
  Plus, 
  Settings, 
  BarChart3, 
  BookOpen, 
  Lightbulb, 
  Phone,
  Briefcase
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useMode } from "@/contexts/ModeContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { mode, setMode, isInternshipMode } = useMode();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleCreateProfile = () => {
    if (user) {
      alert("You are already signed in!");
    } else {
      window.location.href = "/auth";
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 bg-white shadow-md hover:bg-gray-50"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isInternshipMode ? 'bg-gray-900 shadow-2xl' : 'bg-white shadow-lg'}`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              {isInternshipMode ? (
                <Briefcase className="h-8 w-8 text-blue-400" />
              ) : (
                <Users className="h-8 w-8 text-blue-600" />
              )}
              <span className={`text-xl font-bold ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                {isInternshipMode ? 'InternshipHub' : 'VolunteerHub'}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X className={`h-6 w-6 ${isInternshipMode ? 'text-gray-300' : ''}`} />
            </Button>
          </div>


          {/* Navigation Sections */}
          <div className="space-y-8">
            {/* For Students */}
            <div>
              <h3 className={`font-semibold mb-4 ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                {isInternshipMode ? 'For Job Seekers' : 'For Students'}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    className={`flex items-center space-x-3 transition-colors ${
                      isInternshipMode 
                        ? 'text-gray-300 hover:text-blue-400' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Search className="h-4 w-4" />
                    <span>{isInternshipMode ? 'Find Internships' : 'Find Opportunities'}</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleCreateProfile}
                    className={`flex items-center space-x-3 transition-colors w-full text-left ${
                      isInternshipMode 
                        ? 'text-gray-300 hover:text-blue-400' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Create Profile</span>
                  </button>
                </li>
                <li>
                  <Link
                    to="/track-hours"
                    className={`flex items-center space-x-3 transition-colors ${
                      isInternshipMode 
                        ? 'text-gray-300 hover:text-blue-400' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Clock className="h-4 w-4" />
                    <span>{isInternshipMode ? 'Track Experience' : 'Track Hours'}</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Organizations */}
            <div>
              <h3 className={`font-semibold mb-4 ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                {isInternshipMode ? 'For Companies' : 'For Organizations'}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/post-opportunity"
                    className={`flex items-center space-x-3 transition-colors ${
                      isInternshipMode 
                        ? 'text-gray-300 hover:text-blue-400' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Plus className="h-4 w-4" />
                    <span>{isInternshipMode ? 'Post Internships' : 'Post Opportunities'}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/manage-opportunities"
                    className={`flex items-center space-x-3 transition-colors ${
                      isInternshipMode 
                        ? 'text-gray-300 hover:text-blue-400' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Manage Applications</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/manage-opportunities"
                    className={`flex items-center space-x-3 transition-colors ${
                      isInternshipMode 
                        ? 'text-gray-300 hover:text-blue-400' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>{isInternshipMode ? 'Company Dashboard' : 'Organization Dashboard'}</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className={`font-semibold mb-4 ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to={isInternshipMode ? "/career-resources" : "/resources"}
                    className={`flex items-center space-x-3 transition-colors ${
                      isInternshipMode 
                        ? 'text-gray-300 hover:text-blue-400' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>{isInternshipMode ? 'Career Guide' : 'University Guide'}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={isInternshipMode ? "/career-resources" : "/resources"}
                    className={`flex items-center space-x-3 transition-colors ${
                      isInternshipMode 
                        ? 'text-gray-300 hover:text-blue-400' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Lightbulb className="h-4 w-4" />
                    <span>{isInternshipMode ? 'Interview Tips' : 'Volunteer Tips'}</span>
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className={`flex items-center space-x-3 transition-colors ${
                      isInternshipMode 
                        ? 'text-gray-300 hover:text-blue-400' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Phone className="h-4 w-4" />
                    <span>Contact Support</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Mode Switch - Made more prominent */}
            <div className={`pt-6 mt-6 border-t ${isInternshipMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`p-4 rounded-lg ${isInternshipMode ? 'bg-gray-800/50' : 'bg-blue-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-col">
                    <span className={`text-sm font-semibold ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                      {isInternshipMode ? 'Internship Mode' : 'Volunteer Mode'}
                    </span>
                    <span className={`text-xs ${isInternshipMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {isInternshipMode ? 'Find internships & jobs' : 'Find volunteer opportunities'}
                    </span>
                  </div>
                  <Switch
                    checked={isInternshipMode}
                    onCheckedChange={(checked) => setMode(checked ? 'internship' : 'volunteer')}
                    className="data-[state=checked]:bg-blue-600 scale-110"
                  />
                </div>
                <div className={`text-xs text-center ${isInternshipMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Toggle to switch between modes
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;