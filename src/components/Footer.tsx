import { Link } from 'react-router-dom';
import { FeedbackDialog } from './FeedbackDialog';
import ExperientialLogo from './ExperientialLogo';

const columns = [
  {
    title: 'Students',
    links: [
      { to: '/search', label: 'Browse opportunities' },
      { to: '/track-hours', label: 'Track hours' },
      { to: '/resume-builder', label: 'Resume builder' },
      { to: '/my-applications', label: 'My applications' },
    ],
  },
  {
    title: 'Organizations',
    links: [
      { to: '/post-opportunity', label: 'Post an opportunity' },
      { to: '/manage-opportunities', label: 'Manage postings' },
    ],
  },
  {
    title: 'Guides',
    links: [
      { to: '/resources', label: 'Volunteering for college' },
      { to: '/university-checklist', label: 'Application checklist' },
      { to: '/pro', label: 'Experiential Pro' },
    ],
  },
];

const Footer = () => (
  <footer className="mt-auto bg-ink text-ink-foreground">
    <div className="container grid gap-10 py-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
      <div className="max-w-xs">
        <Link to="/" aria-label="Experiential home" className="inline-block rounded-sm">
          <ExperientialLogo inverse height={26} />
        </Link>
        <p className="mt-4 text-sm leading-6 text-ink-muted">
          Local volunteer opportunities for students, and the tools to show the work you did.
        </p>
      </div>

      {columns.map((col) => (
        <div key={col.title}>
          <h2 className="font-sans text-sm font-semibold tracking-normal text-white">{col.title}</h2>
          <ul className="mt-3 space-y-2.5 text-sm">
            {col.links.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-ink-muted transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div className="border-t border-white/10">
      <div className="container flex flex-col gap-3 py-5 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Experiential</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link to="/terms" className="hover:text-white">Terms</Link>
          <Link to="/privacy" className="hover:text-white">Privacy</Link>
          <FeedbackDialog>
            <button className="hover:text-white">Send feedback</button>
          </FeedbackDialog>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
