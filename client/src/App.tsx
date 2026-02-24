import { FormEvent, useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Lang = 'es' | 'en';
type ProjectCategory = 'all' | 'mobile' | 'web' | 'api';
type KnowledgeCategory = 'all' | 'methodologies' | 'architectures' | 'patterns' | 'languages' | 'practices';

type Translation = {
  nav: readonly string[];
  heroTitle: string;
  role: string;
  heroRolePrefix: string;
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
  knowledgeTitle: string;
  knowledgeSubtitle: string;
  migrationTitle: string;
  knowledgeFilters: Record<KnowledgeCategory, string>;
  filters: Record<ProjectCategory, string>;
  placeholders: { name: string; email: string; subject: string; message: string };
  mdsoft: readonly string[];
  ib: readonly string[];
  migrationHighlights: readonly string[];
  educationText: string;
};

type KnowledgeItem = {
  id: number;
  category: KnowledgeCategory;
  title: string;
  description: string;
  icon: string;
  image: string;
};

const content: Record<Lang, Translation> = {
  es: {
    nav: ['Inicio', 'Resumen', 'Experiencia', 'Skills', 'Proyectos', 'Conocimiento', 'Contacto'],
    heroTitle: 'Hola, soy',
    role: 'Desarrollador Full Stack',
    heroRolePrefix: 'Creativo',
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
    knowledgeTitle: 'Base de Conocimiento Técnico',
    knowledgeSubtitle: 'Todo lo que he ido aprendiendo y aplicando: metodologías, arquitecturas, patrones, lenguajes y tecnologías.',
    migrationTitle: 'Migraciones destacadas',
    knowledgeFilters: {
      all: 'Todos',
      methodologies: 'Metodologías de trabajo',
      architectures: 'Arquitecturas de software',
      patterns: 'Patrones de Diseño',
      languages: 'Lenguajes y Tecnologías',
      practices: 'Buenas prácticas'
    },
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
    migrationHighlights: [
      'Realicé la migración de una app móvil desde Java hacia .NET MAUI 9, modernizando arquitectura, rendimiento y mantenibilidad.',
      'Ejecuté la migración de un ERP construido en .NET Framework 4.8 + AngularJS + Bootstrap hacia una nueva versión con Clean Architecture, modular .NET 10 y Angular 20+.'
    ],
    educationText: 'Instituto Tecnológico de las Américas (ITLA) — Desarrollo de Software (En curso)'
  },
  en: {
    nav: ['Home', 'Summary', 'Experience', 'Skills', 'Projects', 'Knowledge', 'Contact'],
    heroTitle: "Hello, I'm",
    role: 'Full Stack Developer',
    heroRolePrefix: 'Creative',
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
    knowledgeTitle: 'Technical Knowledge Base',
    knowledgeSubtitle: 'Everything I have learned and applied: methodologies, architectures, patterns, languages, and technologies.',
    migrationTitle: 'Migration highlights',
    knowledgeFilters: {
      all: 'All',
      methodologies: 'Work Methodologies',
      architectures: 'Software Architectures',
      patterns: 'Design Patterns',
      languages: 'Languages & Technologies',
      practices: 'Best Practices'
    },
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
    migrationHighlights: [
      'Completed a mobile app migration from Java to .NET MAUI 9, improving architecture, performance, and maintainability.',
      'Led migration of an ERP built with .NET Framework 4.8 + AngularJS + Bootstrap into a new version using Clean Architecture, modular .NET 10, and Angular 20+.'
    ],
    educationText: 'Institute of the Americas (ITLA) — Software Development (In progress)'
  }
};

const backendSkills = ['ASP.NET Framework, ASP.NET Core, ASP.NET', 'Boilerplate', '.NET MAUI, MVVM, MVC, XAML, XML', 'SQL Server, MySQL, SQLite, MongoDB, Oracle', 'EF, Dapper, ADO.NET', 'SOLID, DI, REST APIs, HTTP methods', 'Clean Architecture, Onion Architecture, Vertical Slice Architecture, Modular Clean Architecture', 'Design Patterns, Regex, Parallel Programming, Async/Await, OOP', 'Node.js, Next.js'];
const frontendSkills = ['HTML5, CSS3, SCSS, Tailwind CSS, Bootstrap', 'AngularJS, Angular 20', 'React.js', 'Blazor, Razor', 'JavaScript, TypeScript', 'XAML (.NET MAUI), Jetpack Compose (Kotlin XML)'];

const knowledgeData: Record<Lang, KnowledgeItem[]> = {
  es: [
    { id: 1, category: 'methodologies', title: 'Agile', description: 'Trabajo iterativo para entregar valor continuo y responder al cambio con velocidad.', icon: 'bi-lightning-charge', image: '/img/knowledge/agile.svg' },
    { id: 2, category: 'methodologies', title: 'Scrum', description: 'Sprints, backlog y ceremonias para ejecutar objetivos claros y medibles por iteración.', icon: 'bi-kanban', image: '/img/knowledge/scrum.svg' },
    { id: 3, category: 'methodologies', title: 'Kanban', description: 'Gestión visual del flujo para optimizar tiempos, limitar WIP y mejorar el throughput.', icon: 'bi-columns-gap', image: '/img/knowledge/kanban.svg' },

    { id: 4, category: 'architectures', title: 'Clean Architecture', description: 'Separa capas y dependencias para tener soluciones escalables, testeables y mantenibles.', icon: 'bi-diagram-3', image: '/img/knowledge/clean-architecture.svg' },
    { id: 5, category: 'architectures', title: 'Onion Architecture', description: 'Ubica el dominio en el núcleo y desacopla infraestructura para proteger reglas de negocio.', icon: 'bi-bullseye', image: '/img/knowledge/onion-architecture.svg' },
    { id: 6, category: 'architectures', title: 'Vertical Slice Architecture', description: 'Organiza por features/casos de uso, reduciendo fricción al evolucionar funcionalidades.', icon: 'bi-grid-1x2', image: '/img/knowledge/vertical-slice.svg' },
    { id: 7, category: 'architectures', title: 'Modular Architecture', description: 'Divide el sistema en módulos cohesivos para escalar equipos y despliegues con menor riesgo.', icon: 'bi-boxes', image: '/img/knowledge/modular-architecture.svg' },

    { id: 8, category: 'patterns', title: 'Repository', description: 'Abstrae el acceso a datos para desacoplar dominio y persistencia.', icon: 'bi-database', image: '/img/knowledge/repository-pattern.svg' },
    { id: 9, category: 'patterns', title: 'Unit of Work', description: 'Coordina transacciones y asegura consistencia al confirmar múltiples cambios.', icon: 'bi-arrow-repeat', image: '/img/knowledge/unit-of-work.svg' },
    { id: 10, category: 'patterns', title: 'Factory', description: 'Centraliza la creación de objetos complejos según contexto de negocio.', icon: 'bi-tools', image: '/img/knowledge/factory-pattern.svg' },
    { id: 11, category: 'patterns', title: 'Strategy', description: 'Permite variar algoritmos o reglas sin cambiar el cliente que los consume.', icon: 'bi-gear-wide-connected', image: '/img/knowledge/strategy-pattern.svg' },
    { id: 12, category: 'patterns', title: 'Mediator', description: 'Reduce acoplamiento coordinando la comunicación entre componentes.', icon: 'bi-shuffle', image: '/img/knowledge/mediator-pattern.svg' },
    { id: 13, category: 'patterns', title: 'Result Pattern', description: 'Estandariza respuestas exitosas/errores sin depender de excepciones en flujo normal.', icon: 'bi-check2-square', image: '/img/knowledge/result-pattern.svg' },
    { id: 14, category: 'patterns', title: 'CQRS', description: 'Separa comandos y consultas para optimizar rendimiento, claridad y escalabilidad.', icon: 'bi-distribute-vertical', image: '/img/knowledge/cqrs-pattern.svg' },

    { id: 15, category: 'languages', title: 'C# / .NET (ASP.NET, MAUI)', description: 'Desarrollo de APIs, sistemas empresariales y apps móviles multiplataforma.', icon: 'bi-code-slash', image: '/img/knowledge/csharp-dotnet.svg' },
    { id: 16, category: 'languages', title: 'TypeScript / JavaScript', description: 'Base para frontend moderno y aplicaciones robustas en ecosistemas web.', icon: 'bi-filetype-tsx', image: '/img/knowledge/typescript-javascript.svg' },
    { id: 17, category: 'languages', title: 'Angular / React', description: 'Frameworks UI para construir interfaces escalables y experiencias de usuario modernas.', icon: 'bi-window-stack', image: '/img/knowledge/angular-react.svg' },
    { id: 18, category: 'languages', title: 'SQL Server / SQLite / MySQL / MongoDB', description: 'Diseño y optimización de datos relacionales y no relacionales.', icon: 'bi-hdd-network', image: '/img/knowledge/databases.svg' },

    { id: 19, category: 'practices', title: 'SOLID', description: 'Principios para código orientado a objetos flexible, mantenible y extensible.', icon: 'bi-bricks', image: '/img/knowledge/solid.svg' },
    { id: 20, category: 'practices', title: 'KISS', description: 'Resolver con simplicidad para reducir complejidad accidental y errores.', icon: 'bi-emoji-smile', image: '/img/knowledge/kiss.svg' },
    { id: 21, category: 'practices', title: 'DRY', description: 'Evita duplicidad de lógica para facilitar mantenimiento y consistencia.', icon: 'bi-files', image: '/img/knowledge/dry.svg' },
    { id: 22, category: 'practices', title: 'YAGNI', description: 'Implementar solo lo necesario hoy para evitar sobreingeniería.', icon: 'bi-scissors', image: '/img/knowledge/yagni.svg' },
    { id: 23, category: 'practices', title: 'SoC', description: 'Separación de responsabilidades para sistemas más claros y testeables.', icon: 'bi-layers', image: '/img/knowledge/soc.svg' }
  ],
  en: [
    { id: 1, category: 'methodologies', title: 'Agile', description: 'Iterative way of working to deliver continuous value and adapt quickly to change.', icon: 'bi-lightning-charge', image: '/img/knowledge/agile.svg' },
    { id: 2, category: 'methodologies', title: 'Scrum', description: 'Sprints, backlog, and ceremonies to execute clear and measurable iteration goals.', icon: 'bi-kanban', image: '/img/knowledge/scrum.svg' },
    { id: 3, category: 'methodologies', title: 'Kanban', description: 'Visual flow management to optimize lead time, limit WIP, and improve throughput.', icon: 'bi-columns-gap', image: '/img/knowledge/kanban.svg' },

    { id: 4, category: 'architectures', title: 'Clean Architecture', description: 'Layered separation for scalable, testable, and maintainable solutions.', icon: 'bi-diagram-3', image: '/img/knowledge/clean-architecture.svg' },
    { id: 5, category: 'architectures', title: 'Onion Architecture', description: 'Keeps domain in the core and decouples infrastructure from business rules.', icon: 'bi-bullseye', image: '/img/knowledge/onion-architecture.svg' },
    { id: 6, category: 'architectures', title: 'Vertical Slice Architecture', description: 'Feature/use-case organization to evolve functionality with less friction.', icon: 'bi-grid-1x2', image: '/img/knowledge/vertical-slice.svg' },
    { id: 7, category: 'architectures', title: 'Modular Architecture', description: 'Divides the system into cohesive modules for safer scaling and deployments.', icon: 'bi-boxes', image: '/img/knowledge/modular-architecture.svg' },

    { id: 8, category: 'patterns', title: 'Repository', description: 'Abstracts data access to decouple business logic from persistence.', icon: 'bi-database', image: '/img/knowledge/repository-pattern.svg' },
    { id: 9, category: 'patterns', title: 'Unit of Work', description: 'Coordinates transactions and ensures consistency across multiple changes.', icon: 'bi-arrow-repeat', image: '/img/knowledge/unit-of-work.svg' },
    { id: 10, category: 'patterns', title: 'Factory', description: 'Centralizes creation of complex objects according to business context.', icon: 'bi-tools', image: '/img/knowledge/factory-pattern.svg' },
    { id: 11, category: 'patterns', title: 'Strategy', description: 'Allows switching algorithms/rules without changing consuming clients.', icon: 'bi-gear-wide-connected', image: '/img/knowledge/strategy-pattern.svg' },
    { id: 12, category: 'patterns', title: 'Mediator', description: 'Reduces coupling by coordinating communication between components.', icon: 'bi-shuffle', image: '/img/knowledge/mediator-pattern.svg' },
    { id: 13, category: 'patterns', title: 'Result Pattern', description: 'Standardizes success/error responses without relying on exceptions for regular flow.', icon: 'bi-check2-square', image: '/img/knowledge/result-pattern.svg' },
    { id: 14, category: 'patterns', title: 'CQRS', description: 'Separates commands and queries to optimize performance and scalability.', icon: 'bi-distribute-vertical', image: '/img/knowledge/cqrs-pattern.svg' },

    { id: 15, category: 'languages', title: 'C# / .NET (ASP.NET, MAUI)', description: 'API, enterprise system, and cross-platform mobile app development.', icon: 'bi-code-slash', image: '/img/knowledge/csharp-dotnet.svg' },
    { id: 16, category: 'languages', title: 'TypeScript / JavaScript', description: 'Core stack for modern web applications and reliable frontend architecture.', icon: 'bi-filetype-tsx', image: '/img/knowledge/typescript-javascript.svg' },
    { id: 17, category: 'languages', title: 'Angular / React', description: 'UI frameworks for scalable interfaces and modern user experience.', icon: 'bi-window-stack', image: '/img/knowledge/angular-react.svg' },
    { id: 18, category: 'languages', title: 'SQL Server / SQLite / MySQL / MongoDB', description: 'Relational and non-relational data modeling and optimization.', icon: 'bi-hdd-network', image: '/img/knowledge/databases.svg' },

    { id: 19, category: 'practices', title: 'SOLID', description: 'Principles for flexible, maintainable, and extensible object-oriented code.', icon: 'bi-bricks', image: '/img/knowledge/solid.svg' },
    { id: 20, category: 'practices', title: 'KISS', description: 'Keep solutions simple to reduce accidental complexity and bugs.', icon: 'bi-emoji-smile', image: '/img/knowledge/kiss.svg' },
    { id: 21, category: 'practices', title: 'DRY', description: 'Avoid duplicated logic to improve consistency and maintainability.', icon: 'bi-files', image: '/img/knowledge/dry.svg' },
    { id: 22, category: 'practices', title: 'YAGNI', description: 'Build only what is needed today to avoid overengineering.', icon: 'bi-scissors', image: '/img/knowledge/yagni.svg' },
    { id: 23, category: 'practices', title: 'SoC', description: 'Separation of concerns for clearer and more testable systems.', icon: 'bi-layers', image: '/img/knowledge/soc.svg' }
  ]
};

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

const displayName = 'Elvis Hernández';

const roleVariants: Record<Lang, readonly string[]> = {
  es: [
    'Back-End Developer',
    'Front-End Developer',
    'Full Stack Developer',
    'Analista de Software',
    'Mobile Developer',
    'Arquitecto de Soluciones',
    'API Developer'
  ],
  en: [
    'Back-End Developer',
    'Front-End Developer',
    'Full Stack Developer',
    'Software Analyst',
    'Mobile Developer',
    'Solutions Architect',
    'API Developer'
  ]
};

export function App() {
  const [lang, setLang] = useState<Lang>('es');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('all');
  const [activeKnowledgeFilter, setActiveKnowledgeFilter] = useState<KnowledgeCategory>('all');
  const [typedRole, setTypedRole] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const reduceMotion = useReducedMotion();
  const t = content[lang];

  useEffect(() => {
    if (reduceMotion) {
      setTypedRole(roleVariants[lang][0]);
      return;
    }

    const current = roleVariants[lang][roleIndex];
    const nextText = isDeleting ? current.slice(0, Math.max(0, typedRole.length - 1)) : current.slice(0, typedRole.length + 1);
    const timeout = setTimeout(() => {
      setTypedRole(nextText);

      if (!isDeleting && nextText === current) {
        setTimeout(() => setIsDeleting(true), 900);
      } else if (isDeleting && nextText.length === 0) {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roleVariants[lang].length);
      }
    }, isDeleting ? 45 : 75);

    return () => clearTimeout(timeout);
  }, [typedRole, isDeleting, roleIndex, reduceMotion, lang]);

  const anim = useMemo(
    () =>
      reduceMotion
        ? {}
        : { initial: { opacity: 0, y: 10 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.45 } },
    [reduceMotion]
  );

  const filteredProjects = projects[lang].filter((project) => activeFilter === 'all' || project.category === activeFilter);
  const filteredKnowledge = knowledgeData[lang].filter((item) => activeKnowledgeFilter === 'all' || item.category === activeKnowledgeFilter);

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
              <li><a href="#knowledge">{t.nav[5]}</a></li>
              <li><a href="#contact">{t.nav[6]}</a></li>
            </ul>
          </nav>
          <div className="header-social-links social-spaced">
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
                  <h1>{t.heroTitle} <span className="highlight">{displayName}</span></h1>
                  <h2 className="hero-role-line"><span className="role-prefix">{t.heroRolePrefix}</span> <span className="typed-role">{typedRole}<span className="typed-cursor">|</span></span></h2>
                  <p>{t.location} · inelvis16031124@gmail.com · +1 849-869-8664</p>
                  <motion.div className="professional-status" aria-label={t.status} animate={reduceMotion ? {} : { opacity: [0.95, 1, 0.95] }} transition={{ duration: 3, repeat: Infinity }}>
                    <span className="dot" /> {t.status}
                  </motion.div>
                </div>
              </div>
              <div className="col-lg-6 order-1 order-lg-2">
                <div className="hero-image">
                  <div className="image-wrapper">
                    <img src="/img/profile/EH-IMG.webp" alt="Elvis Hernandez" className="img-fluid" />
                    <div className="floating-elements">
                      <motion.div className="floating-card design" animate={reduceMotion ? {} : { y: [0, -8, 0] }} transition={{ duration: 3.1, repeat: Infinity }}>
                        <i className="bi bi-palette" />
                        <span>Design</span>
                      </motion.div>
                      <motion.div className="floating-card code" animate={reduceMotion ? {} : { y: [0, -8, 0] }} transition={{ duration: 3.1, repeat: Infinity, delay: 1 }}>
                        <i className="bi bi-code-slash" />
                        <span>Code</span>
                      </motion.div>
                      <motion.div className="floating-card creativity" animate={reduceMotion ? {} : { y: [0, -8, 0] }} transition={{ duration: 3.1, repeat: Infinity, delay: 2 }}>
                        <i className="bi bi-lightbulb" />
                        <span>Ideas</span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <motion.section id="summary" className="section" {...anim}><div className="container section-title"><h2>{t.summaryTitle}</h2><p>{t.summary}</p></div></motion.section>

        <motion.section id="experience" className="resume section" {...anim}>
          <div className="container">
            <div className="section-title">
              <h2>{t.experience}</h2>
            </div>
            <div className="row g-4 experience-grid">
              <div className="col-lg-6">
                <motion.article className="experience-card" whileHover={reduceMotion ? {} : { y: -4 }} transition={{ duration: 0.2 }}>
                  <div className="experience-head"><span className="experience-pill current">IB Systems</span><h4>Full Stack Developer</h4></div>
                  <ul>{t.ib.map((item) => <li key={item}>{item}</li>)}</ul>
                </motion.article>
              </div>
              <div className="col-lg-6">
                <motion.article className="experience-card" whileHover={reduceMotion ? {} : { y: -4 }} transition={{ duration: 0.2 }}>
                  <div className="experience-head"><span className="experience-pill">MDSOFT</span><h4>Mobile Developer</h4></div>
                  <ul>{t.mdsoft.map((item) => <li key={item}>{item}</li>)}</ul>
                </motion.article>
              </div>
              <div className="col-12">
                <motion.article className="experience-card migration-card" whileHover={reduceMotion ? {} : { y: -4 }} transition={{ duration: 0.2 }}>
                  <div className="experience-head"><span className="experience-pill accent">Migration</span><h4>{t.migrationTitle}</h4></div>
                  <ul>{t.migrationHighlights.map((item) => <li key={item}>{item}</li>)}</ul>
                </motion.article>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section id="skills" className="services section" {...anim}>
          <div className="container section-title">
            <h2>Skills Stack</h2>
            <p>{lang === 'es' ? 'Tecnologías, frameworks y herramientas aplicadas en soluciones reales de alto impacto.' : 'Technologies, frameworks, and tools applied in real high-impact solutions.'}</p>
          </div>
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-6">
                <motion.div className="service-item skill-card" whileHover={reduceMotion ? {} : { y: -6 }} transition={{ duration: 0.2 }}>
                  <h3><i className="bi bi-server me-2" />Backend</h3>
                  <div className="skill-chip-wrap">{backendSkills.map((item) => <span key={item} className="skill-chip">{item}</span>)}</div>
                </motion.div>
              </div>
              <div className="col-lg-6">
                <motion.div className="service-item skill-card" whileHover={reduceMotion ? {} : { y: -6 }} transition={{ duration: 0.2 }}>
                  <h3><i className="bi bi-window-sidebar me-2" />Frontend</h3>
                  <div className="skill-chip-wrap">{frontendSkills.map((item) => <span key={item} className="skill-chip">{item}</span>)}</div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section id="portfolio" className="portfolio section" {...anim}>
          <div className="container section-title"><h2>{t.portfolioTitle}</h2><p>{t.portfolioSubtitle}</p></div>
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
                    <div className="portfolio-info"><h4>{project.title}</h4><p>{project.description}</p></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section id="knowledge" className="portfolio section" {...anim}>
          <div className="container section-title"><h2>{t.knowledgeTitle}</h2><p>{t.knowledgeSubtitle}</p></div>
          <div className="container">
            <div className="knowledge-filter-wrap">
              <ul className="portfolio-filters isotope-filters knowledge-filters">
                {(['all', 'methodologies', 'architectures', 'patterns', 'languages', 'practices'] as const).map((filter) => (
                  <li key={filter} className={activeKnowledgeFilter === filter ? 'filter-active' : ''} onClick={() => setActiveKnowledgeFilter(filter)}>
                    {t.knowledgeFilters[filter]}
                  </li>
                ))}
              </ul>
            </div>
            <div className="row gy-4 isotope-container">
              {filteredKnowledge.map((item, index) => (
                <motion.div key={item.id} className={`col-lg-4 col-md-6 portfolio-item isotope-item filter-${item.category}`} initial={reduceMotion ? {} : { opacity: 0, scale: 0.97, y: 14 }} whileInView={reduceMotion ? {} : { opacity: 1, scale: 1, y: 0 }} whileHover={reduceMotion ? {} : { y: -5 }} viewport={{ once: true }} transition={{ duration: 0.26, delay: index * 0.02 }}>
                  <div className="portfolio-content h-100 knowledge-card">
                    <img src={item.image} className="img-fluid" alt={item.title} />
                    <div className="portfolio-info">
                      <span className="knowledge-tag">{t.knowledgeFilters[item.category]}</span>
                      <h4><i className={`bi ${item.icon} me-2`} />{item.title}</h4>
                      <p>{item.description}</p>
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
