import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';

const GUIDES = [
  {
    title: 'Does community service matter in college admissions?',
    source: 'IvyWise',
    description: 'How admissions officers read service on an application, and what makes it stand out.',
    url: 'https://www.ivywise.com/blog/does-community-service-matter-in-the-college-admissions-process',
  },
  {
    title: 'The value of volunteer time',
    source: 'Independent Sector',
    description: 'The annual estimate of what an hour of volunteer work is worth to the community.',
    url: 'https://independentsector.org/value-of-volunteer-time/',
  },
  {
    title: 'Volunteering in America',
    source: 'AmeriCorps',
    description: 'National data on who volunteers, how much, and where.',
    url: 'https://www.americorps.gov/newsroom/press-release/more-757-million-people-volunteered-america-americorps-reports',
  },
  {
    title: 'Benefits of volunteering',
    source: 'Western Connecticut State University',
    description: 'What students gain from community engagement, from skills to connections.',
    url: 'https://www.wcsu.edu/community-engagement/benefits-of-volunteering/',
  },
];

const SCHOLARSHIPS = [
  {
    name: 'Coca-Cola Scholars Program',
    award: '$20,000',
    who: 'High school seniors with leadership and service records',
    url: 'https://www.coca-colascholarsfoundation.org/apply/',
  },
  {
    name: 'Prudential Emerging Visionaries',
    award: 'Cash awards',
    who: 'Ages 14–18 with projects that help their communities',
    url: 'https://www.prudential.com/links/about/community-spirit-awards',
  },
  {
    name: 'The Diana Award',
    award: 'Recognition award',
    who: 'Ages 9–25 making a positive difference',
    url: 'https://diana-award.org.uk/award/',
  },
];

const UNIVERSITIES = [
  { name: 'Stanford University', program: 'Haas Center for Public Service', note: 'Cardinal Service connects public service with coursework and fellowships.' },
  { name: 'Duke University', program: 'DukeEngage', note: 'Funded summer service programs, typically around eight weeks, in the U.S. and abroad.' },
  { name: 'Tulane University', program: 'Center for Public Service', note: 'Public service is part of the undergraduate graduation requirements.' },
];

const ExternalLinkRow = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-start justify-between gap-6 py-5"
  >
    <div className="min-w-0">{children}</div>
    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
  </a>
);

const Resources = () => (
  <PageShell width="narrow">
    <header className="max-w-2xl">
      <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
        Volunteering for college
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        What admissions offices look for in service, scholarships that reward it, and schools that build it into campus life.
      </p>
    </header>

    <section className="mt-14" aria-labelledby="guides">
      <h2 id="guides" className="text-2xl font-semibold">Reading</h2>
      <ul className="mt-4 divide-y divide-border border-y border-border">
        {GUIDES.map((g) => (
          <li key={g.url}>
            <ExternalLinkRow href={g.url}>
              <p className="font-semibold group-hover:text-primary">{g.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {g.description} <span className="whitespace-nowrap text-foreground/70">· {g.source}</span>
              </p>
            </ExternalLinkRow>
          </li>
        ))}
      </ul>
    </section>

    <section className="mt-14" aria-labelledby="scholarships">
      <h2 id="scholarships" className="text-2xl font-semibold">Scholarships for service</h2>
      <p className="mt-2 text-sm text-muted-foreground">Deadlines change every year. Check each program’s site for current dates.</p>
      <ul className="mt-4 divide-y divide-border border-y border-border">
        {SCHOLARSHIPS.map((s) => (
          <li key={s.name}>
            <ExternalLinkRow href={s.url}>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <p className="font-semibold group-hover:text-primary">{s.name}</p>
                <p className="text-sm font-medium text-accent-foreground">{s.award}</p>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{s.who}</p>
            </ExternalLinkRow>
          </li>
        ))}
      </ul>
    </section>

    <section className="mt-14" aria-labelledby="schools">
      <h2 id="schools" className="text-2xl font-semibold">Schools that value service</h2>
      <dl className="mt-4 divide-y divide-border border-y border-border">
        {UNIVERSITIES.map((u) => (
          <div key={u.name} className="grid gap-1 py-5 sm:grid-cols-[13rem_1fr] sm:gap-6">
            <dt>
              <p className="font-semibold">{u.name}</p>
              <p className="text-sm text-muted-foreground">{u.program}</p>
            </dt>
            <dd className="text-sm leading-6 text-foreground/85">{u.note}</dd>
          </div>
        ))}
      </dl>
    </section>

    <Link
      to="/university-checklist"
      className="group mt-14 flex items-center justify-between gap-6 border-t border-border pt-8"
    >
      <span>
        <span className="block text-xl font-semibold group-hover:text-primary">Application checklist</span>
        <span className="mt-1 block text-muted-foreground">From building your school list to hitting submit. Progress saves as you go.</span>
      </span>
      <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  </PageShell>
);

export default Resources;
