import { MouseEvent, ReactNode, useEffect, useMemo, useState } from 'react';

type Lang = 'en' | 'es';
type SkillCategory = 'all' | 'frontend' | 'backend' | 'architectures' | 'patterns' | 'methodologies' | 'practices';

type NavItem = {
  label: string;
  to: string;
};

type AboutContent = {
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

type SkillCard = {
  title: string;
  description: string;
  percent: number;
  category: SkillCategory;
};

type Dictionary = {
  nav: string[];
  heroGreeting: string;
  heroPrefix: string;
  heroDescription: string;
  ctaWork: string;
  ctaContact: string;
  floating: { design: string; code: string; ideas: string };
  pages: Record<'resume' | 'services' | 'portfolio' | 'contact', { title: string; text: string }>;
  about: AboutContent;
  skillsSection: {
    title: string;
    subtitle: string;
    filters: Record<SkillCategory, string>;
  };
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
      resume: { title: 'Resume', text: 'Experience, education, technical stack, and key achievements.' },
      services: { title: 'Services', text: 'Full Stack development, UX/UI, and product optimization services.' },
      portfolio: { title: 'Portfolio', text: 'Web, mobile, and API projects delivered with real impact.' },
      contact: { title: 'Contact', text: 'Contact channels to collaborate on new projects.' }
    },
    about: {
      title: 'About',
      subtitle:
        'Software Developer with +2 years building mobile, web and API solutions with clean architecture, UX focus and measurable business outcomes.',
      eyebrow: 'Hello there',
      headline:
        "Hi, I’m Elvis — a Full Stack developer blending clean engineering and thoughtful UX to build reliable digital products.",
      lead:
        'I started in mobile development with Xamarin and later built apps and APIs with .NET MAUI and ASP.NET. I focus on high-quality software using SOLID principles, design patterns, and security best practices.',
      paragraph:
        'Today I work as a Full Stack Developer improving frontend and backend with Angular, TypeScript/JavaScript, ASP.NET and SQL Server. I also participated in key migrations from Java to .NET MAUI and legacy ERP modernization toward modular Clean Architecture.',
      ctaWork: 'View My Work',
      ctaResume: 'Download Resume',
      skills: [
        { title: 'UI/UX', description: 'Interfaces focused on clarity, usability and conversion.', icon: 'bi-layout-text-window' },
        { title: '.NET / ASP.NET', description: 'Robust backend APIs with clean architecture.', icon: 'bi-code-slash' },
        { title: 'Mobile-first', description: 'Responsive experiences and mobile app workflows.', icon: 'bi-phone' },
        { title: 'SQL / Data', description: 'SQL Server, SQLite and structured data modeling.', icon: 'bi-database' }
      ],
      timeline: [
        { year: '2022', title: 'Started as Mobile Developer', text: 'Implemented features and fixes in Xamarin projects.' },
        { year: '2023', title: '.NET MAUI + ASP.NET APIs', text: 'Delivered mobile and backend solutions for client operations.' },
        { year: '2024', title: 'Full Stack at IB Systems', text: 'Improved frontend/backend flows using agile delivery.' },
        { year: '2025', title: 'Lead migrations', text: 'Java to MAUI and legacy ERP modernization initiatives.' }
      ],
      quote: '“Building clean and meaningful experiences through thoughtful code and practical product decisions.”',
      facts: [
        { icon: 'bi-bricks', label: 'SOLID' },
        { icon: 'bi-diagram-3', label: 'Clean Architecture' },
        { icon: 'bi-kanban', label: 'Agile/Scrum' },
        { icon: 'bi-lightbulb', label: 'Problem Solving' }
      ]
    },
    skillsSection: {
      title: 'Skills',
      subtitle: 'Backend-focused profile with strong architecture, pattern-driven design, and solid frontend execution.',
      filters: {
        all: 'All',
        frontend: 'Front-end',
        backend: 'Back-end',
        architectures: 'Architectures',
        patterns: 'Design Patterns',
        methodologies: 'Work Methodologies',
        practices: 'Best Practices'
      }
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
      resume: { title: 'Resumen', text: 'Experiencia, educación, stack técnico y logros relevantes.' },
      services: { title: 'Servicios', text: 'Servicios de desarrollo Full Stack, UX/UI y optimización de producto.' },
      portfolio: { title: 'Portafolio', text: 'Proyectos web, mobile y APIs entregados con impacto real.' },
      contact: { title: 'Contacto', text: 'Canales de contacto para colaborar en nuevos proyectos.' }
    },
    about: {
      title: 'Sobre mí',
      subtitle:
        'Desarrollador de Software con más de 2 años creando soluciones mobile, web y APIs con arquitectura limpia, enfoque UX y resultados medibles.',
      eyebrow: 'Hola',
      headline:
        'Soy Elvis — desarrollador Full Stack que combina ingeniería limpia y UX bien pensada para construir productos digitales confiables.',
      lead:
        'Inicié en desarrollo móvil con Xamarin y luego construí aplicaciones y APIs con .NET MAUI y ASP.NET. Me enfoco en software de alta calidad aplicando SOLID, patrones de diseño y buenas prácticas de seguridad.',
      paragraph:
        'Actualmente trabajo como Full Stack Developer mejorando frontend y backend con Angular, TypeScript/JavaScript, ASP.NET y SQL Server. También participé en migraciones clave desde Java a .NET MAUI y modernización de ERP legacy hacia Clean Architecture modular.',
      ctaWork: 'Ver mi trabajo',
      ctaResume: 'Descargar CV',
      skills: [
        { title: 'UI/UX', description: 'Interfaces enfocadas en claridad, usabilidad y conversión.', icon: 'bi-layout-text-window' },
        { title: '.NET / ASP.NET', description: 'APIs backend robustas con arquitectura limpia.', icon: 'bi-code-slash' },
        { title: 'Mobile-first', description: 'Experiencias responsivas y flujos móviles.', icon: 'bi-phone' },
        { title: 'SQL / Datos', description: 'SQL Server, SQLite y modelado de datos estructurados.', icon: 'bi-database' }
      ],
      timeline: [
        { year: '2022', title: 'Inicio como Mobile Developer', text: 'Implementación de funcionalidades y fixes en proyectos Xamarin.' },
        { year: '2023', title: '.NET MAUI + APIs ASP.NET', text: 'Entrega de soluciones móviles y backend para operaciones de negocio.' },
        { year: '2024', title: 'Full Stack en IB Systems', text: 'Mejora de flujos frontend/backend bajo metodología ágil.' },
        { year: '2025', title: 'Liderazgo en migraciones', text: 'Migraciones de Java a MAUI y modernización de ERP legacy.' }
      ],
      quote: '“Construyo experiencias limpias y con sentido, a través de código bien pensado y decisiones prácticas de producto.”',
      facts: [
        { icon: 'bi-bricks', label: 'SOLID' },
        { icon: 'bi-diagram-3', label: 'Clean Architecture' },
        { icon: 'bi-kanban', label: 'Agile/Scrum' },
        { icon: 'bi-lightbulb', label: 'Resolución de problemas' }
      ]
    },
    skillsSection: {
      title: 'Skills',
      subtitle: 'Perfil orientado más a Back-end, con dominio en arquitectura, patrones y ejecución sólida en Front-end.',
      filters: {
        all: 'Todos',
        frontend: 'Front-end',
        backend: 'Back-end',
        architectures: 'Arquitecturas',
        patterns: 'Patrones de diseños',
        methodologies: 'Metodologías de trabajo',
        practices: 'Buenas prácticas'
      }
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

const skillsCatalog: Record<Lang, SkillCard[]> = {
  es: [
    { title: 'ASP.NET Core / .NET APIs', description: 'Diseño de APIs robustas con seguridad, validaciones y buenas prácticas.', percent: 95, category: 'backend' },
    { title: 'SQL Server / SQLite', description: 'Stored procedures, vistas, estructuras de datos y optimización.', percent: 92, category: 'backend' },
    { title: 'C# y .NET', description: 'Desarrollo empresarial y mobile con enfoque escalable.', percent: 93, category: 'backend' },
    { title: 'Angular', description: 'Construcción de interfaces modernas y mantenibles.', percent: 82, category: 'frontend' },
    { title: 'React + TypeScript', description: 'UI modular con componentes reutilizables y tipado fuerte.', percent: 80, category: 'frontend' },
    { title: 'JavaScript / TypeScript', description: 'Base del stack frontend moderno y tooling.', percent: 84, category: 'frontend' },
    { title: 'Clean Architecture', description: 'Separación de capas para escalabilidad y testabilidad.', percent: 94, category: 'architectures' },
    { title: 'Onion Architecture', description: 'Dominio en el centro y desacople de infraestructura.', percent: 90, category: 'architectures' },
    { title: 'Arquitectura Modular', description: 'Sistemas desacoplados por módulos y vertical slices.', percent: 88, category: 'architectures' },
    { title: 'Repository + Unit of Work', description: 'Consistencia transaccional y abstracción de persistencia.', percent: 92, category: 'patterns' },
    { title: 'Factory / Strategy / Mediator', description: 'Patrones para flexibilidad, desacople y evolución.', percent: 86, category: 'patterns' },
    { title: 'Result Pattern + CQRS', description: 'Manejo claro de flujos y separación comando/consulta.', percent: 87, category: 'patterns' },
    { title: 'Agile / Scrum / Kanban', description: 'Entrega iterativa, visibilidad y mejora continua.', percent: 90, category: 'methodologies' },
    { title: 'SOLID / KISS / DRY / YAGNI', description: 'Código limpio, mantenible y sin sobreingeniería.', percent: 94, category: 'practices' }
  ],
  en: [
    { title: 'ASP.NET Core / .NET APIs', description: 'Robust API design with security, validation and best practices.', percent: 95, category: 'backend' },
    { title: 'SQL Server / SQLite', description: 'Stored procedures, views, structured data and optimization.', percent: 92, category: 'backend' },
    { title: 'C# and .NET', description: 'Enterprise and mobile development with scalable approach.', percent: 93, category: 'backend' },
    { title: 'Angular', description: 'Modern and maintainable interface delivery.', percent: 82, category: 'frontend' },
    { title: 'React + TypeScript', description: 'Modular UI with reusable components and strong typing.', percent: 80, category: 'frontend' },
    { title: 'JavaScript / TypeScript', description: 'Core foundation for modern frontend stack and tooling.', percent: 84, category: 'frontend' },
    { title: 'Clean Architecture', description: 'Layered separation for scalable, testable systems.', percent: 94, category: 'architectures' },
    { title: 'Onion Architecture', description: 'Domain-centered design with infrastructure decoupling.', percent: 90, category: 'architectures' },
    { title: 'Modular Architecture', description: 'Decoupled systems organized by modules and vertical slices.', percent: 88, category: 'architectures' },
    { title: 'Repository + Unit of Work', description: 'Transactional consistency and data-access abstraction.', percent: 92, category: 'patterns' },
    { title: 'Factory / Strategy / Mediator', description: 'Patterns for flexibility, decoupling and evolution.', percent: 86, category: 'patterns' },
    { title: 'Result Pattern + CQRS', description: 'Clear flow handling and command/query separation.', percent: 87, category: 'patterns' },
    { title: 'Agile / Scrum / Kanban', description: 'Iterative delivery, visibility and continuous improvement.', percent: 90, category: 'methodologies' },
    { title: 'SOLID / KISS / DRY / YAGNI', description: 'Clean, maintainable code and less overengineering.', percent: 94, category: 'practices' }
  ]
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

function SkillsSection({ lang }: { lang: Lang }) {
  const [activeFilter, setActiveFilter] = useState<SkillCategory>('all');
  const sectionText = copy[lang].skillsSection;
  const skills = skillsCatalog[lang];

  useEffect(() => {
    const skillElements = Array.from(document.querySelectorAll<HTMLElement>('#skills [data-aos]'));
    const timers: number[] = [];

    skillElements.forEach((element) => {
      element.classList.remove('aos-animate');
      const delay = Number(element.dataset.aosDelay ?? '0');
      const timer = window.setTimeout(() => element.classList.add('aos-animate'), delay);
      timers.push(timer);
    });

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [activeFilter, lang]);

  useEffect(() => {
    setActiveFilter('all');
  }, [lang]);

  const filteredSkills = skills.filter((skill) => activeFilter === 'all' || skill.category === activeFilter);

  const filterOrder: SkillCategory[] = ['all', 'frontend', 'backend', 'architectures', 'patterns', 'methodologies', 'practices'];

  return (
    <section id="skills" className="skills section">
      <div className="container section-title" data-aos="fade-up">
        <h2>{sectionText.title}</h2>
        <p>{sectionText.subtitle}</p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <ul className="skills-filters" data-aos="fade-up" data-aos-delay="120">
          {filterOrder.map((filter) => (
            <li
              key={filter}
              className={activeFilter === filter ? 'filter-active' : ''}
              onClick={() => setActiveFilter(filter)}
            >
              {sectionText.filters[filter]}
            </li>
          ))}
        </ul>

        <div className="row g-4 skills-animation">
          {filteredSkills.map((skill, index) => (
            <div key={skill.title} className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay={100 + (index % 4) * 100}>
              <div className="skill-box">
                <h3>{skill.title}</h3>
                <p>{skill.description}</p>
                <span className="text-end d-block">{skill.percent}%</span>
                <div className="progress">
                  <div className="progress-bar" role="progressbar" aria-valuenow={skill.percent} aria-valuemin={0} aria-valuemax={100} style={{ width: `${skill.percent}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutPage({ lang }: { lang: Lang }) {
  const about = copy[lang].about;

  return (
    <>
      <section id="about" className="about section">
        <div className="container section-title" data-aos="fade-up">
          <h2>{about.title}</h2>
          <p>{about.subtitle}</p>
        </div>

        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row align-items-center justify-content-between gy-5 mb-5">
            <div className="col-lg-7" data-aos="fade-right" data-aos-delay="150">
              <div className="intro-content">
                <span className="eyebrow">{about.eyebrow}</span>
                <h2 className="headline">{about.headline}</h2>
                <p className="lead">{about.lead}</p>
                <p>{about.paragraph}</p>

                <div className="cta-group">
                  <Link to="/portfolio" className="btn-ghost">
                    {about.ctaWork} <i className="bi bi-arrow-up-right" />
                  </Link>
                  <a href="#" className="link-underline">
                    {about.ctaResume} <i className="bi bi-download" />
                  </a>
                </div>
              </div>
            </div>

            <div className="col-lg-5" data-aos="zoom-in" data-aos-delay="250">
              <figure className="profile-figure text-center text-lg-end">
                <img src="/img/profile/EH-IMG.webp" alt="Elvis Hernandez" className="img-fluid profile-photo" />
              </figure>
            </div>
          </div>

          <div className="mb-5">
            <div className="row g-4">
              {about.skills.map((skill, index) => (
                <div key={skill.title} className="col-6 col-md-4 col-lg-3" data-aos="fade-up" data-aos-delay={120 + index * 60}>
                  <div className="skill-item">
                    <i className={`bi ${skill.icon}`} />
                    <h3>{skill.title}</h3>
                    <p>{skill.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <div className="row g-4">
              {about.timeline.map((item, index) => (
                <div key={item.year + item.title} className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay={120 + index * 60}>
                  <article className="timeline-item">
                    <span className="dot" />
                    <time>{item.year}</time>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </article>
                </div>
              ))}
            </div>
          </div>

          <blockquote className="personal-quote text-center mb-5" data-aos="fade-down" data-aos-delay="200">
            <p>{about.quote}</p>
          </blockquote>

          <div className="row g-3 justify-content-center">
            {about.facts.map((fact, index) => (
              <div key={fact.label} className="col-6 col-md-3 col-lg-2" data-aos="zoom-in" data-aos-delay={120 + index * 40}>
                <div className="fact-pill">
                  <i className={`bi ${fact.icon}`} />
                  <span>{fact.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SkillsSection lang={lang} />
    </>
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
      return <AboutPage lang={lang} />;
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
    const timer = window.setTimeout(() => setIsBootLoading(false), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-aos]'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          const delay = Number(element.dataset.aosDelay ?? '0');
          window.setTimeout(() => {
            element.classList.add('aos-animate');
          }, delay);
          observer.unobserve(element);
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
    );

    elements.forEach((element) => {
      element.classList.remove('aos-animate');
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [pathname, lang]);

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
