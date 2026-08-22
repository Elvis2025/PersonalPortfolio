export type Lang = 'en' | 'es';
export type SkillCategory =
  | 'all'
  | 'frontend'
  | 'backend'
  | 'architectures'
  | 'patterns'
  | 'methodologies'
  | 'practices'
  | 'mobile'
  | 'tools'
  | 'desktop'
  | 'windows';

export type NavItem = {
  label: string;
  to: string;
};

export type AboutContent = {
  title: string;
  subtitle: string;
  eyebrow: string;
  headline: string;
  lead: string;
  paragraph: string;
  ctaWork: string;
  ctaResume: string;
  skills: Array<{ title: string; description: string; icon: string }>;
  timeline: Array<{ year: string; title: string; text: string }>;
  quote: string;
  facts: Array<{ icon: string; label: string }>;
};

export type SkillCard = {
  title: string;
  description: string;
  percent: number;
  category: SkillCategory;
  icon: string;
};

export type Dictionary = {
  nav: string[];
  heroGreeting: string;
  heroPrefix: string;
  heroDescription: string;
  ctaWork: string;
  ctaContact: string;
  ctaDownloadCv: string;
  floating: { design: string; code: string; ideas: string };
  about: AboutContent;
  skillsSection: {
    title: string;
    subtitle: string;
    filters: Record<SkillCategory, string>;
    summaryTitle: string;
    summary: { frontend: string; backend: string; mobile: string };
  };
  copyright: string;
  allRights: string;
  langToggle: string;
  contact: {
    title: string;
    subtitle: string;
    infoTitle: string;
    infoText: string;
    locationLabel: string;
    locationValue: string;
    phoneLabel: string;
    phoneValue: string;
    emailLabel: string;
    emailValue: string;
    formTitle: string;
    formText: string;
    placeholders: {
      name: string;
      email: string;
      subject: string;
      message: string;
    };
    button: string;
    loading: string;
    success: string;
    errors: {
      generic: string;
      tooManyRequests: string;
      missingFields: string;
      invalidEmail: string;
      serviceUnavailable: string;
      deliveryFailed: string;
    };
  };
};

export type ResumeContent = {
  title: string;
  subtitle: string;
  profileTitle: string;
  profileSummary: string;
  location: string;
  linkedin: { label: string; url: string; displayUrl: string };
  github: { label: string; url: string; displayUrl: string };
  email: { label: string; address: string };
  phone: string;
  experienceTitle: string;
  educationTitle: string;
  skillsTitle: string;
  contactCta: string;
  downloadCta: string;
  experience: Array<{
    company: string;
    role: string;
    period: string;
    bullets: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    period: string;
  }>;
  highlightedSkills: Array<{ name: string; level: number }>;
};

export type ServiceItem = {
  id: string;
  icon: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  description: string;
  benefits: string[];
};

export type ServicesContent = {
  title: string;
  subtitle: string;
  learnMore: string;
  modalCta: string;
  items: ServiceItem[];
};

export type PortfolioCategory = 'all' | 'web' | 'mobile' | 'desktop' | 'api' | 'legacy';

export type PortfolioProject = {
  id: string;
  title: string;
  type: string;
  category: Exclude<PortfolioCategory, 'all'>;
  summary: string;
  month: string;
  client: string;
  stack: string[];
  challenge: string;
  solution: string;
  impact: string[];
  tags: string[];
  url?: string;
};

export type PortfolioContent = {
  title: string;
  subtitle: string;
  viewAll: string;
  viewProject: string;
  nextProject: string;
  overview: string;
  challengeTitle: string;
  solutionTitle: string;
  featuresTitle: string;
  categories: Record<PortfolioCategory, string>;
  projects: PortfolioProject[];
};

export type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  company: string;
};
