import { MouseEvent, ReactNode, useEffect, useState } from 'react';

type NavItem = {
  label: string;
  to: string;
};

const navItems: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Resume', to: '/resume' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Contact', to: '/contact' }
];

const roles = ['UI/UX Designer', 'Web Developer', 'Digital Artist', 'Brand Strategist'];

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

function Header({ pathname }: { pathname: string }) {
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

function HomePage() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRoleIndex((current) => (current + 1) % roles.length);
    }, 2200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="hero section">
      <div className="container">
        <div className="row gy-4 align-items-center">
          <div className="col-lg-6 order-2 order-lg-1">
            <div className="hero-content">
              <h1>
                Hello, I&apos;m <span className="highlight">Elvis Hernandez</span>
              </h1>
              <h2>
                Creative <span className="typed-role">{roles[roleIndex]}</span>
              </h2>
              <p>
                Full Stack Developer enfocado en construir productos web y mobile con experiencia sólida en UX/UI,
                arquitectura limpia y resultados de negocio.
              </p>
              <div className="hero-actions">
                <Link to="/portfolio" className="btn btn-primary">
                  View My Work
                </Link>
                <Link to="/contact" className="btn btn-outline">
                  Get In Touch
                </Link>
              </div>
              <div className="social-links">
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
            <div className="hero-image">
              <div className="image-wrapper">
                <img src="/img/profile/EH-IMG.webp" alt="Elvis Hernandez" className="img-fluid" />
                <div className="floating-elements">
                  <div className="floating-card design">
                    <i className="bi bi-palette" />
                    <span>Design</span>
                  </div>
                  <div className="floating-card code">
                    <i className="bi bi-code-slash" />
                    <span>Code</span>
                  </div>
                  <div className="floating-card creativity">
                    <i className="bi bi-lightbulb" />
                    <span>Ideas</span>
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
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="footer" className="footer">
      <div className="container">
        <div className="copyright text-center ">
          <p>
            © <span>Copyright</span> <strong className="px-1 sitename">Elvis Portfolio</strong>
            <span> All Rights Reserved</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function renderPage(pathname: string) {
  switch (pathname) {
    case '/':
      return <HomePage />;
    case '/about':
      return <InnerPage title="About" text="Perfil profesional, enfoque de trabajo y propuesta de valor." />;
    case '/resume':
      return <InnerPage title="Resume" text="Experiencia, educación, stack técnico y logros relevantes." />;
    case '/services':
      return <InnerPage title="Services" text="Servicios de desarrollo Full Stack, UX/UI y optimización de producto." />;
    case '/portfolio':
      return <InnerPage title="Portfolio" text="Proyectos web, mobile y APIs entregados con impacto real." />;
    case '/contact':
      return <InnerPage title="Contact" text="Canales de contacto para colaborar en nuevos proyectos." />;
    default:
      return <HomePage />;
  }
}

export function App() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return (
    <>
      <Header pathname={pathname} />
      <main className="main">{renderPage(pathname)}</main>
      <Footer />
    </>
  );
}
