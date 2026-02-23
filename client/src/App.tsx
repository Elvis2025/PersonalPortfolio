import { FormEvent, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
type Lang = 'es' | 'en';

const content: Record<Lang, {
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
  placeholders: { name: string; email: string; subject: string; message: string };
  mdsoft: readonly string[];
  ib: readonly string[];
  educationText: string;
}> = {
  es: {
    nav: ['Inicio', 'Resumen', 'Experiencia', 'Skills', 'Contacto'],
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
    nav: ['Home', 'Summary', 'Experience', 'Skills', 'Contact'],
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

export function App() {
  const [lang, setLang] = useState<Lang>('es');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const reduceMotion = useReducedMotion();
  const t = content[lang];

  const anim = useMemo(
    () =>
      reduceMotion
        ? {}
        : { initial: { opacity: 0, y: 10 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.45 } },
    [reduceMotion]
  );

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
              <li><a href="#contact">{t.nav[4]}</a></li>
            </ul>
          </nav>
          <div className="header-social-links">
            <a href="https://x.com/elvish24?s=21" aria-label="X"><i className="bi bi-twitter-x" /></a>
            <a href="https://www.facebook.com/share/1AzuN7NYMz/?mibextid=wwXIfr" aria-label="Facebook"><i className="bi bi-facebook" /></a>
            <a href="https://www.instagram.com/elvis_h24" aria-label="Instagram"><i className="bi bi-instagram" /></a>
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
          <article className="experience-item"><h4>MDSOFT — Mobile Developer</h4><ul>{t.mdsoft.map((i) => <li key={i}>{i}</li>)}</ul></article>
          <article className="experience-item"><h4>IB Systems — Full Stack Developer</h4><ul>{t.ib.map((i) => <li key={i}>{i}</li>)}</ul></article>
          <h3 className="resume-title mt-4">{t.education}</h3><p>{t.educationText}</p></div></motion.section>

        <motion.section id="skills" className="services section" {...anim}><div className="container"><div className="row g-4"><div className="col-lg-6"><div className="service-item"><h3>Backend</h3><ul>{backendSkills.map((s) => <li key={s}>{s}</li>)}</ul></div></div><div className="col-lg-6"><div className="service-item"><h3>Frontend</h3><ul>{frontendSkills.map((s) => <li key={s}>{s}</li>)}</ul></div></div></div></div></motion.section>

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
