import { Link } from 'react-router-dom';
import { FeedbackDialog } from './FeedbackDialog';
import { useMode } from '@/contexts/ModeContext';
import ExperientialLogo from './ExperientialLogo';

const Footer = () => {
  const { isInternshipMode } = useMode();

  const handleCreateProfile = () => {
    window.location.href = '/auth';
  };

  return (
    <footer className="py-12 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <ExperientialLogo className="h-20 w-auto" />
            </div>
            <p className="text-gray-400">
              Connecting ambitious professionals with career-launching opportunities.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">
              For Job Seekers
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Find Internships
                </Link>
              </li>
              <li>
                <button onClick={handleCreateProfile} className="hover:text-white transition-colors">
                  Create Profile
                </button>
              </li>
              <li>
                <Link to="/track-hours" className="hover:text-white transition-colors">
                  Track Experience
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">
              For Companies
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/post-opportunity" className="hover:text-white transition-colors">
                  Post Internships
                </Link>
              </li>
              <li>
                <Link to="/manage-opportunities" className="hover:text-white transition-colors">
                  Manage Applications
                </Link>
              </li>
              <li>
                <Link to="/manage-opportunities" className="hover:text-white transition-colors">
                  Company Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link 
                  to="/career-resources" 
                  className="hover:text-white transition-colors"
                >
                  Career Guide
                </Link>
              </li>
              <li>
                <Link 
                  to="/career-resources" 
                  className="hover:text-white transition-colors"
                >
                  Interview Tips
                </Link>
              </li>
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
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Experiential. Empowering careers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;