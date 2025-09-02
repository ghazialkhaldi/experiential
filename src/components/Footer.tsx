import { Link } from 'react-router-dom';
import { FeedbackDialog } from './FeedbackDialog';
import ExperientialLogo from './ExperientialLogo';
import { useMode } from '@/contexts/ModeContext';

const Footer = () => {
  const { isInternshipMode, isJobsMode } = useMode();
  
  const handleCreateProfile = () => {
    window.location.href = '/auth';
  };

  return (
    <footer className={`py-12 ${
      isJobsMode 
        ? 'bg-gradient-to-br from-slate-800 to-slate-900' 
        : isInternshipMode 
          ? 'bg-gray-900' 
          : 'bg-gray-900'
    } text-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-start-2">
            <div className="mb-4 flex justify-start">
              <ExperientialLogo className="h-20 w-auto" />
            </div>
            <p className="text-gray-400">
              {isJobsMode
                ? 'Connecting talented professionals with career-defining opportunities.'
                : isInternshipMode 
                  ? 'Connecting ambitious professionals with career-launching opportunities.'
                  : 'Connecting passionate students with meaningful volunteer opportunities.'
              }
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">
              {isJobsMode ? 'For Professionals' : isInternshipMode ? 'For Job Seekers' : 'For Students'}
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  {isJobsMode ? 'Find Jobs' : isInternshipMode ? 'Find Internships' : 'Find Opportunities'}
                </Link>
              </li>
              <li>
                <button onClick={handleCreateProfile} className="hover:text-white transition-colors">
                  Create Profile
                </button>
              </li>
              <li>
                <Link to={isJobsMode ? "/track-experience" : isInternshipMode ? "/track-experience" : "/track-hours"} className="hover:text-white transition-colors">
                  {isJobsMode ? 'Track Experience' : isInternshipMode ? 'Track Experience' : 'Track Hours'}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">
              {isJobsMode ? 'For Companies' : isInternshipMode ? 'For Companies' : 'For Organizations'}
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/post-opportunity" className="hover:text-white transition-colors">
                  {isJobsMode ? 'Post Jobs' : isInternshipMode ? 'Post Internships' : 'Post Opportunities'}
                </Link>
              </li>
              <li>
                <Link to="/manage-opportunities" className="hover:text-white transition-colors">
                  Manage Applications
                </Link>
              </li>
              <li>
                <Link to="/manage-opportunities" className="hover:text-white transition-colors">
                  {isJobsMode ? 'Company Dashboard' : isInternshipMode ? 'Company Dashboard' : 'Organization Dashboard'}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link 
                  to={isJobsMode ? "/career-resources" : isInternshipMode ? "/career-resources" : "/resources"} 
                  className="hover:text-white transition-colors"
                >
                  {isJobsMode ? 'Career Guide' : isInternshipMode ? 'Career Guide' : 'University Guide'}
                </Link>
              </li>
              <li>
                <Link 
                  to={isJobsMode ? "/career-resources" : isInternshipMode ? "/career-resources" : "/resources"} 
                  className="hover:text-white transition-colors"
                >
                  {isJobsMode ? 'Interview Tips' : isInternshipMode ? 'Interview Tips' : 'Volunteer Tips'}
                </Link>
              </li>
              <li>
                <FeedbackDialog>
                  <button className="hover:text-white transition-colors text-left">
                    Give Feedback
                  </button>
                </FeedbackDialog>
              </li>
              <li>
                <Link 
                  to="/notification-settings" 
                  className="hover:text-white transition-colors"
                >
                  Notification Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Experiential. {isJobsMode ? 'Empowering careers.' : isInternshipMode ? 'Empowering careers.' : 'Empowering communities.'}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;