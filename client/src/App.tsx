import { MouseEvent, ReactNode, useEffect, useMemo, useState } from 'react';

type Lang = 'en' | 'es';

type NavItem = {
  label: string;
  to: string;
};

type Dictionary = {
  nav: string[];
  heroGreeting: string;
  heroPrefix: string;
  heroDescription: string;
  ctaWork: string;
  ctaContact: string;
  floating: { design: string; code: string; ideas: string };
  pages: Record<'about' | 'resume' | 'services' | 'portfolio' | 'contact', { title: string; text: string }>;
  copyright: string;
  allRights: string;
  langToggle: string;
};

const copy: Record<Lang, Dictionary> = {
  en: {
    nav: ['Home', 'About', 'Resume', 'Services', 'Portfolio', 'Contact'],
    heroGreeting: "Hello, I'm",
    heroPrefix: 'Creative',
    heroDescription:
      'Full Stack Developer focused on building web and mobile products with strong UX/UI, clean architecture, and business impact.',
    ctaWork: 'View My Work',
    ctaContact: 'Get In Touch',
    floating: { design: 'Design', code: 'Code', ideas: 'Ideas' },
    pages: {
      about: { title: 'About', text: 'Professional profile, working approach, and value proposition.' },
      resume: { title: 'Resume', text: 'Experience, education, technical stack, and key achievements.' },
      services: { title: 'Services', text: 'Full Stack development, UX/UI, and product optimization services.' },
      portfolio: { title: 'Portfolio', text: 'Web, mobile, and API projects delivered with real impact.' },
      contact: { title: 'Contact', text: 'Contact channels to collaborate on new projects.' }
    },
    copyright: 'Copyright',
    allRights: 'All Rights Reserved',
    langToggle: 'ES'
  },
  es: {
    nav: ['Inicio', 'Sobre mí', 'Resumen', 'Servicios', 'Portafolio', 'Contacto'],
    heroGreeting: 'Hola, soy',
    heroPrefix: 'Creativo',
    heroDescription:
      'Desarrollador Full Stack enfocado en construir productos web y móviles con fuerte UX/UI, arquitectura limpia e impacto de negocio.',
    ctaWork: 'Ver mi trabajo',
    ctaContact: 'Contáctame',
    floating: { design: 'Diseño', code: 'Código', ideas: 'Ideas' },
    pages: {
      about: { title: 'Sobre mí', text: 'Perfil profesional, enfoque de trabajo y propuesta de valor.' },
      resume: { title: 'Resumen', text: 'Experiencia, educación, stack técnico y logros relevantes.' },
      services: { title: 'Servicios', text: 'Servicios de desarrollo Full Stack, UX/UI y optimización de producto.' },
      portfolio: { title: 'Portafolio', text: 'Proyectos web, mobile y APIs entregados con impacto real.' },
      contact: { title: 'Contacto', text: 'Canales de contacto para colaborar en nuevos proyectos.' }
    },
    copyright: 'Copyright',
    allRights: 'Todos los derechos reservados',
    langToggle: 'EN'
  }
};

const rolesByLang: Record<Lang, string[]> = {
  en: ['UI/UX Designer', 'Web Developer', 'Digital Artist', 'Brand Strategist'],
  es: ['Diseñador UI/UX', 'Desarrollador Web', 'Artista Digital', 'Estratega de Marca']
};

function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function Link({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigateTo(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

function Header({ pathname, navItems, langToggle, onToggleLang }: { pathname: string; navItems: NavItem[]; langToggle: string; onToggleLang: () => void }) {
  return (
    <header id="header" className="header d-flex align-items-center light-background sticky-top">
      <div className="container position-relative d-flex align-items-center justify-content-between">
        <nav id="navmenu" className="navmenu">
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={pathname === item.to ? 'active' : ''}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <i className="mobile-nav-toggle d-xl-none bi bi-list" />
        </nav>

        <div className="header-social-links">
          <button type="button" className="lang-toggle" onClick={onToggleLang} aria-label="Change language">
            {langToggle}
          </button>
          <a href="https://x.com" target="_blank" rel="noreferrer" className="twitter" aria-label="X">
            <i className="bi bi-twitter-x" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="linkedin" aria-label="LinkedIn">
            <i className="bi bi-linkedin" />
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="github" aria-label="GitHub">
            <i className="bi bi-github" />
          </a>
        </div>
      </div>
    </header>
  );
}

function HomePage({ lang }: { lang: Lang }) {
  const roles = rolesByLang[lang];
  const text = copy[lang];
  const [roleIndex, setRoleIndex] = useState(0);
  const [typedRole, setTypedRole] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setRoleIndex(0);
    setTypedRole('');
    setIsDeleting(false);
  }, [lang]);

  useEffect(() => {
    const animatedElements = Array.from(document.querySelectorAll<HTMLElement>('[data-aos]'));
    const timers: number[] = [];

    animatedElements.forEach((element) => {
      const delay = Number(element.dataset.aosDelay ?? '0');
      const timer = window.setTimeout(() => {
        element.classList.add('aos-animate');
      }, delay);
      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      animatedElements.forEach((element) => element.classList.remove('aos-animate'));
    };
  }, [lang]);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    const isWordComplete = typedRole === currentRole;
    const isWordDeleted = typedRole.length === 0;

    const nextTick = () => {
      if (!isDeleting && !isWordComplete) {
        setTypedRole(currentRole.slice(0, typedRole.length + 1));
        return;
      }

      if (!isDeleting && isWordComplete) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && !isWordDeleted) {
        setTypedRole(currentRole.slice(0, typedRole.length - 1));
        return;
      }

      setIsDeleting(false);
      setRoleIndex((current) => (current + 1) % roles.length);
    };

    const typingDelay = isDeleting ? 45 : 95;
    const holdDelay = !isDeleting && isWordComplete ? 1100 : 0;
    const timer = window.setTimeout(nextTick, holdDelay || typingDelay);

    return () => window.clearTimeout(timer);
  }, [isDeleting, roleIndex, roles, typedRole]);

  return (
    <section id="hero" className="hero section">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row gy-4 align-items-center">
          <div className="col-lg-6 order-2 order-lg-1">
            <div className="hero-content">
              <h1 data-aos="fade-up" data-aos-delay="200">
                {text.heroGreeting} <span className="highlight">Elvis Hernandez</span>
              </h1>
              <h2 data-aos="fade-up" data-aos-delay="300">
                {text.heroPrefix}{' '}
                <span className="typed-role">
                  {typedRole}
                  <span className="typed-cursor" aria-hidden="true">
                    |
                  </span>
                </span>
              </h2>
              <p data-aos="fade-up" data-aos-delay="400">{text.heroDescription}</p>
              <div className="hero-actions" data-aos="fade-up" data-aos-delay="500">
                <Link to="/portfolio" className="btn btn-primary">
                  {text.ctaWork}
                </Link>
                <Link to="/contact" className="btn btn-outline">
                  {text.ctaContact}
                </Link>
              </div>
              <div className="social-links" data-aos="fade-up" data-aos-delay="600">
                <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X">
                  <i className="bi bi-twitter" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <i className="bi bi-linkedin" />
                </a>
                <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
                  <i className="bi bi-github" />
                </a>
                <a href="https://dribbble.com" target="_blank" rel="noreferrer" aria-label="Dribbble">
                  <i className="bi bi-dribbble" />
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-6 order-1 order-lg-2">
            <div className="hero-image" data-aos="zoom-in" data-aos-delay="300">
              <div className="image-wrapper">
                <img src="/img/profile/EH-IMG.webp" alt="Elvis Hernandez" className="img-fluid" />
                <div className="floating-elements">
                  <div className="floating-card design" data-aos="fade-left" data-aos-delay="700">
                    <i className="bi bi-palette" />
                    <span>{text.floating.design}</span>
                  </div>
                  <div className="floating-card code" data-aos="fade-right" data-aos-delay="800">
                    <i className="bi bi-code-slash" />
                    <span>{text.floating.code}</span>
                  </div>
                  <div className="floating-card creativity" data-aos="fade-up" data-aos-delay="900">
                    <i className="bi bi-lightbulb" />
                    <span>{text.floating.ideas}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InnerPage({ title, text }: { title: string; text: string }) {
  return (
    <section className="section">
      <div className="container section-title text-center">
        <h2 data-aos="fade-up" data-aos-delay="300">{title}</h2>
        <p>{text}</p>
      </div>
    </section>
  );
}

function Footer({ lang }: { lang: Lang }) {
  const text = copy[lang];
  return (
    <footer id="footer" className="footer">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="copyright text-center ">
          <p>
            © <span>{text.copyright}</span> <strong className="px-1 sitename">Elvis Portfolio</strong>
            <span> {text.allRights}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function renderPage(pathname: string, lang: Lang) {
  const pages = copy[lang].pages;
  switch (pathname) {
    case '/':
      return <HomePage lang={lang} />;
    case '/about':
      return <InnerPage title={pages.about.title} text={pages.about.text} />;
    case '/resume':
      return <InnerPage title={pages.resume.title} text={pages.resume.text} />;
    case '/services':
      return <InnerPage title={pages.services.title} text={pages.services.text} />;
    case '/portfolio':
      return <InnerPage title={pages.portfolio.title} text={pages.portfolio.text} />;
    case '/contact':
      return <InnerPage title={pages.contact.title} text={pages.contact.text} />;
    default:
      return <HomePage lang={lang} />;
  }
}

export function App() {
  const [pathname, setPathname] = useState(window.location.pathname);
  const [isBootLoading, setIsBootLoading] = useState(true);
  const [lang, setLang] = useState<Lang>('en');

  const navItems = useMemo<NavItem[]>(() => {
    const labels = copy[lang].nav;
    return [
      { label: labels[0], to: '/' },
      { label: labels[1], to: '/about' },
      { label: labels[2], to: '/resume' },
      { label: labels[3], to: '/services' },
      { label: labels[4], to: '/portfolio' },
      { label: labels[5], to: '/contact' }
    ];
  }, [lang]);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsBootLoading(false), 420);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <div id="preloader" className={isBootLoading ? 'preloader-visible' : 'preloader-hidden'} aria-hidden="true" />
      <Header
        pathname={pathname}
        navItems={navItems}
        langToggle={copy[lang].langToggle}
        onToggleLang={() => setLang((current) => (current === 'en' ? 'es' : 'en'))}
      />
      <main className="main">{renderPage(pathname, lang)}</main>
      <Footer lang={lang} />
    </>
  );
}
