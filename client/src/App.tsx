import { FormEvent, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Lang = 'es' | 'en';
type ProjectCategory = 'all' | 'mobile' | 'web' | 'api';

type Translation = {
  nav: readonly string[];
  heroTitle: string;
  role: string;
  summaryTitle: string;
  summary: string;
  status: string;
  experience: string;
  education: string;
  contact: string;
  location: string;
  send: string;
  loading: string;
  success: string;
  error: string;
  portfolioTitle: string;
  portfolioSubtitle: string;
  filters: Record<ProjectCategory, string>;
  placeholders: { name: string; email: string; subject: string; message: string };
  mdsoft: readonly string[];
  ib: readonly string[];
  educationText: string;
};

const content: Record<Lang, Translation> = {
  es: {
    nav: ['Inicio', 'Resumen', 'Experiencia', 'Skills', 'Proyectos', 'Contacto'],
    heroTitle: 'Hola, soy',
    role: 'Desarrollador Full Stack',
    summaryTitle: 'Resumen Profesional',
    summary:
      'Desarrollador de Software con más de 2 años de experiencia. Inicié como desarrollador móvil, implementando nuevas funcionalidades y corrigiendo errores en aplicaciones con Xamarin, y creando nuevas aplicaciones móviles y APIs con .NET MAUI y ASP.NET 9. Me enfoco en excelente UX aplicando Clean Architecture, código limpio, patrones de diseño y buenas prácticas de seguridad. He trabajado con SQL Server (vistas, stored procedures, estructuras de datos), y SQLite para almacenamiento local. Actualmente soy Full Stack Developer, mejorando frontend y backend con Angular, Bootstrap, JavaScript/TypeScript, ASP.NET, SQL Server y Boilerplate, destacando por análisis crítico y enfoque en software de alta calidad.',
    status: 'Actualmente laborando en IB Systems como Full Stack Developer',
    experience: 'Experiencia Profesional',
    education: 'Educación',
    contact: 'Contacto',
    location: 'Santo Domingo, República Dominicana',
    send: 'Enviar Mensaje',
    loading: 'Enviando...',
    success: 'Tu mensaje ha sido enviado. ¡Gracias!',
    error: 'No se pudo enviar el mensaje. Intenta nuevamente.',
    portfolioTitle: 'Aplicaciones en las que he trabajado',
    portfolioSubtitle: 'Mobile, Web y APIs desarrolladas, modernizadas e integradas bajo arquitectura limpia y enfoque en UX.',
    filters: { all: 'Todo', mobile: 'Mobile', web: 'Web', api: 'APIs' },
    placeholders: { name: 'Nombre', email: 'Email', subject: 'Asunto', message: 'Mensaje' },
    mdsoft: [
      'Desarrollé funcionalidades móviles y de base de datos a medida del cliente, entregando tres proyectos en tiempo récord.',
      'Implementé principios SOLID y buenas prácticas.',
      'Desarrollé una app B2B con .NET MAUI (.NET 9) consumiendo API ASP.NET 9 con Onion Architecture y seguridad.',
      'Refactoricé y rediseñé una app móvil originalmente en .NET 8, mejorando UI/UX completa: colores, layouts, popups, alertas, loaders, módulos y lógica.',
      'Añadí funcionalidades a app Xamarin: PDFs, impresión con impresoras portátiles, XML automático, automatización de procesos.'
    ],
    ib: [
      'Implemento y optimizo funcionalidades en frontend y backend.',
      'Trabajo con Agile/Scrum.',
      'Uso Boilerplate como base de buenas prácticas.',
      'Aplico SOLID en repositorios y mantenimientos para código limpio y mantenible.'
    ],
    educationText: 'Instituto Tecnológico de las Américas (ITLA) — Desarrollo de Software (En curso)'
  },
  en: {
    nav: ['Home', 'Summary', 'Experience', 'Skills', 'Projects', 'Contact'],
    heroTitle: "Hello, I'm",
    role: 'Full Stack Developer',
    summaryTitle: 'Professional Summary',
    summary:
      'Software Developer with over 2 years of experience. I began as a mobile developer implementing features and fixing bugs in Xamarin apps, and building new mobile apps and APIs using .NET MAUI and ASP.NET 9 tailored to client needs. I focus on great UX applying Clean Architecture, clean code, design patterns, and security best practices. I worked with SQL Server (views, stored procedures, structured models) and SQLite for local mobile storage. Currently, I work as a Full Stack Developer improving backend and frontend with Angular, Bootstrap, JavaScript/TypeScript, ASP.NET, SQL Server, and Boilerplate, relying on critical thinking and analytical skills to deliver high-quality software.',
    status: 'Currently working at IB Systems as a Full Stack Developer',
    experience: 'Professional Experience',
    education: 'Education',
    contact: 'Contact',
    location: 'Santo Domingo, Dominican Republic',
    send: 'Send Message',
    loading: 'Sending...',
    success: 'Your message has been sent. Thank you!',
    error: 'Message could not be sent. Please try again.',
    portfolioTitle: 'Applications I have worked on',
    portfolioSubtitle: 'Mobile, Web and API projects built, modernized, and integrated with clean architecture and UX focus.',
    filters: { all: 'All', mobile: 'Mobile', web: 'Web', api: 'APIs' },
    placeholders: { name: 'Name', email: 'Email', subject: 'Subject', message: 'Message' },
    mdsoft: [
      'Developed mobile and database features tailored to client needs, delivering three projects in record time.',
      'Implemented SOLID principles and best practices.',
      'Built a B2B app with .NET MAUI (.NET 9) consuming an ASP.NET 9 API with Onion Architecture and security.',
      'Refactored and redesigned a mobile app originally built in .NET 8, improving complete UI/UX: colors, layouts, popups, alerts, loaders, modules, and logic.',
      'Added features to a Xamarin app: PDFs, portable-printer printing, automatic XML, and process automation.'
    ],
    ib: [
      'Implement and optimize features across frontend and backend.',
      'Work with Agile/Scrum.',
      'Use Boilerplate as a best-practices foundation.',
      'Apply SOLID in repositories and maintenance for clean, maintainable code.'
    ],
    educationText: 'Institute of the Americas (ITLA) — Software Development (In progress)'
  }
};

const backendSkills = ['ASP.NET Framework, ASP.NET Core, ASP.NET', 'Boilerplate', '.NET MAUI, MVVM, MVC, XAML, XML', 'SQL Server, MySQL, SQLite, MongoDB, Oracle', 'EF, Dapper, ADO.NET', 'SOLID, DI, REST APIs, HTTP methods', 'Clean Architecture, Onion Architecture, Vertical Slice Architecture, Modular Clean Architecture', 'Design Patterns, Regex, Parallel Programming, Async/Await, OOP', 'Node.js, Next.js'];
const frontendSkills = ['HTML5, CSS3, SCSS, Tailwind CSS, Bootstrap', 'AngularJS, Angular 20', 'React.js', 'Blazor, Razor', 'JavaScript, TypeScript', 'XAML (.NET MAUI), Jetpack Compose (Kotlin XML)'];

const projects = {
  es: [
    { id: 1, category: 'mobile', title: 'App B2B de operaciones', description: 'Aplicación móvil en .NET MAUI (.NET 9) con flujos empresariales, consumo de API ASP.NET 9 y seguridad por arquitectura Onion.', image: '/img/portfolio/project-mobile-b2b.svg' },
    { id: 2, category: 'mobile', title: 'Modernización app Xamarin', description: 'Mejora funcional de aplicación existente: PDFs, impresión portable, XML automático y automatizaciones operativas.', image: '/img/portfolio/project-xamarin-modernization.svg' },
    { id: 3, category: 'api', title: 'API ASP.NET 9 para ecosistema móvil', description: 'Servicios backend para apps móviles con enfoque en Clean/Onion Architecture, validaciones y buenas prácticas de seguridad.', image: '/img/portfolio/project-api-aspnet.svg' },
    { id: 4, category: 'web', title: 'Módulos web Full Stack en IB Systems', description: 'Implementación y optimización de funcionalidades frontend/backend con Angular, TypeScript, ASP.NET y SQL Server.', image: '/img/portfolio/project-web-fullstack.svg' },
    { id: 5, category: 'api', title: 'Integraciones de datos y SQL Server', description: 'Diseño y optimización de estructuras, vistas y stored procedures para soportar procesos críticos de negocio.', image: '/img/portfolio/project-sql-integrations.svg' },
    { id: 6, category: 'web', title: 'Refactor y mejora UX de módulos internos', description: 'Refactor técnico y ajustes UI/UX de módulos corporativos para aumentar mantenibilidad y experiencia de uso.', image: '/img/portfolio/project-ux-refactor.svg' }
  ],
  en: [
    { id: 1, category: 'mobile', title: 'B2B operations app', description: '.NET MAUI (.NET 9) mobile application with enterprise flows, ASP.NET 9 API integration, and Onion-based security.', image: '/img/portfolio/project-mobile-b2b.svg' },
    { id: 2, category: 'mobile', title: 'Xamarin app modernization', description: 'Feature upgrades in an existing app: PDFs, portable printing, automatic XML generation, and process automation.', image: '/img/portfolio/project-xamarin-modernization.svg' },
    { id: 3, category: 'api', title: 'ASP.NET 9 API for mobile ecosystem', description: 'Backend services for mobile apps with Clean/Onion Architecture, robust validation, and security best practices.', image: '/img/portfolio/project-api-aspnet.svg' },
    { id: 4, category: 'web', title: 'Full Stack web modules at IB Systems', description: 'Implemented and optimized frontend/backend features with Angular, TypeScript, ASP.NET, and SQL Server.', image: '/img/portfolio/project-web-fullstack.svg' },
    { id: 5, category: 'api', title: 'Data integrations and SQL Server', description: 'Designed and optimized structures, views, and stored procedures for business-critical workflows.', image: '/img/portfolio/project-sql-integrations.svg' },
    { id: 6, category: 'web', title: 'Refactor and UX improvements', description: 'Technical refactoring and UI/UX adjustments in internal modules to improve maintainability and user experience.', image: '/img/portfolio/project-ux-refactor.svg' }
  ]
} as const;

export function App() {
  const [lang, setLang] = useState<Lang>('es');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('all');
  const reduceMotion = useReducedMotion();
  const t = content[lang];

  const anim = useMemo(
    () =>
      reduceMotion
        ? {}
        : { initial: { opacity: 0, y: 10 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.45 } },
    [reduceMotion]
  );

  const filteredProjects = projects[lang].filter((project) => activeFilter === 'all' || project.category === activeFilter);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries()))
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <header id="header" className="header d-flex align-items-center light-background sticky-top">
        <div className="container position-relative d-flex align-items-center justify-content-between">
          <nav id="navmenu" className="navmenu">
            <ul>
              <li><a href="#hero" className="active">{t.nav[0]}</a></li>
              <li><a href="#summary">{t.nav[1]}</a></li>
              <li><a href="#experience">{t.nav[2]}</a></li>
              <li><a href="#skills">{t.nav[3]}</a></li>
              <li><a href="#portfolio">{t.nav[4]}</a></li>
              <li><a href="#contact">{t.nav[5]}</a></li>
            </ul>
          </nav>
          <div className="header-social-links">
            <a href="https://x.com/elvish24?s=21" aria-label="X"><i className="bi bi-twitter-x" /></a>
            <a href="https://www.facebook.com/share/1AzuN7NYMz/?mibextid=wwXIfr" aria-label="Facebook"><i className="bi bi-facebook" /></a>
            <a href="https://www.instagram.com/elvis_h24" aria-label="Instagram"><i className="bi bi-instagram" /></a>
            <a href="https://www.threads.com/@elvis_h24?igshid=NTc4MTIwNjQ2YQ==" aria-label="Threads"><i className="bi bi-threads" /></a>
            <a href="https://github.com/Elvis2025" aria-label="GitHub"><i className="bi bi-github" /></a>
            <a href="https://linkedin.com/in/elvis-hernandez075496285" aria-label="LinkedIn"><i className="bi bi-linkedin" /></a>
            <button type="button" className="lang-toggle" onClick={() => setLang(lang === 'es' ? 'en' : 'es')}>{lang.toUpperCase()}</button>
          </div>
        </div>
      </header>

      <main className="main">
        <section id="hero" className="hero section">
          <div className="container">
            <div className="row gy-4 align-items-center">
              <div className="col-lg-6 order-2 order-lg-1">
                <div className="hero-content">
                  <h1>{t.heroTitle} <span className="highlight">Elvis Jesús Hernández Suárez</span></h1>
                  <h2>{t.role}</h2>
                  <p>{t.location} · inelvis16031124@gmail.com · +1 849-869-8664</p>
                  <motion.div className="professional-status" aria-label={t.status} animate={reduceMotion ? {} : { opacity: [0.95, 1, 0.95] }} transition={{ duration: 3, repeat: Infinity }}>
                    <span className="dot" /> {t.status}
                  </motion.div>
                </div>
              </div>
              <div className="col-lg-6 order-1 order-lg-2"><div className="hero-image"><div className="image-wrapper"><img src="/img/profile/MyProfile01.webp" alt="Elvis Hernandez" className="img-fluid" /></div></div></div>
            </div>
          </div>
        </section>

        <motion.section id="summary" className="section" {...anim}><div className="container section-title"><h2>{t.summaryTitle}</h2><p>{t.summary}</p></div></motion.section>

        <motion.section id="experience" className="resume section" {...anim}><div className="container"><h3 className="resume-title">{t.experience}</h3>
          <article className="experience-item"><h4>MDSOFT — Mobile Developer</h4><ul>{t.mdsoft.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article className="experience-item"><h4>IB Systems — Full Stack Developer</h4><ul>{t.ib.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <h3 className="resume-title mt-4">{t.education}</h3><p>{t.educationText}</p></div></motion.section>

        <motion.section id="skills" className="services section" {...anim}><div className="container"><div className="row g-4"><div className="col-lg-6"><div className="service-item"><h3>Backend</h3><ul>{backendSkills.map((s) => <li key={s}>{s}</li>)}</ul></div></div><div className="col-lg-6"><div className="service-item"><h3>Frontend</h3><ul>{frontendSkills.map((s) => <li key={s}>{s}</li>)}</ul></div></div></div></div></motion.section>

        <motion.section id="portfolio" className="portfolio section" {...anim}>
          <div className="container section-title">
            <h2>{t.portfolioTitle}</h2>
            <p>{t.portfolioSubtitle}</p>
          </div>

          <div className="container">
            <ul className="portfolio-filters isotope-filters">
              {(['all', 'mobile', 'web', 'api'] as const).map((filter) => (
                <li key={filter} className={activeFilter === filter ? 'filter-active' : ''} onClick={() => setActiveFilter(filter)}>
                  {t.filters[filter]}
                </li>
              ))}
            </ul>

            <div className="row gy-4 isotope-container">
              {filteredProjects.map((project, index) => (
                <motion.div key={project.id} className={`col-lg-4 col-md-6 portfolio-item isotope-item filter-${project.category}`} initial={reduceMotion ? {} : { opacity: 0, y: 12 }} whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: index * 0.04 }}>
                  <div className="portfolio-content h-100">
                    <img src={project.image} className="img-fluid" alt={project.title} />
                    <div className="portfolio-info">
                      <h4>{project.title}</h4>
                      <p>{project.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section id="contact" className="contact section" {...anim}><div className="container"><div className="contact-form"><h3>{t.contact}</h3>
          <form className="php-email-form" onSubmit={onSubmit}><div className="row gy-4">
            <div className="col-md-6"><input type="text" name="name" className="form-control" placeholder={t.placeholders.name} required /></div>
            <div className="col-md-6"><input type="email" name="email" className="form-control" placeholder={t.placeholders.email} required /></div>
            <div className="col-12"><input type="text" name="subject" className="form-control" placeholder={t.placeholders.subject} required /></div>
            <div className="col-12"><textarea name="message" className="form-control" rows={6} placeholder={t.placeholders.message} required /></div>
            <input type="text" name="company" className="d-none" tabIndex={-1} autoComplete="off" />
            <div className="col-12 text-center"><div className="loading" style={{ display: status === 'loading' ? 'block' : 'none' }}>{t.loading}</div><div className="error-message" style={{ display: status === 'error' ? 'block' : 'none' }}>{t.error}</div><div className="sent-message" style={{ display: status === 'success' ? 'block' : 'none' }}>{t.success}</div><button type="submit" className="btn">{t.send}</button></div>
          </div></form>
        </div></div></motion.section>
      </main>
    </>
  );
}
