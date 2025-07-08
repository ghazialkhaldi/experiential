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
  Phone 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

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
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">VolunteerHub</span>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Logo Placeholder */}
          <div className="mb-8 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <div className="text-gray-500 text-sm">Logo Placeholder</div>
            <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mt-2"></div>
          </div>

          {/* Navigation Sections */}
          <div className="space-y-8">
            {/* For Students */}
            <div>
              <h3 className="font-semibold mb-4 text-gray-900">For Students</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Search className="h-4 w-4" />
                    <span>Find Opportunities</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleCreateProfile}
                    className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors w-full text-left"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Create Profile</span>
                  </button>
                </li>
                <li>
                  <Link
                    to="/track-hours"
                    className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Clock className="h-4 w-4" />
                    <span>Track Hours</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Organizations */}
            <div>
              <h3 className="font-semibold mb-4 text-gray-900">For Organizations</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/post-opportunity"
                    className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Post Opportunities</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/manage-opportunities"
                    className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Manage Applications</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/manage-opportunities"
                    className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Organization Dashboard</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold mb-4 text-gray-900">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/resources"
                    className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>University Guide</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources"
                    className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Lightbulb className="h-4 w-4" />
                    <span>Volunteer Tips</span>
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Phone className="h-4 w-4" />
                    <span>Contact Support</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;