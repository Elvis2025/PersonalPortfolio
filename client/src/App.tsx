import { MouseEvent, ReactNode, useEffect, useMemo, useState } from 'react';

type Lang = 'en' | 'es';
type SkillCategory =
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
  icon: string;
};

const brandedSkillIcons: Record<string, string> = {
  'ASP.NET Core': 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg',
  'C#': 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
  Java: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  'Spring Boot': 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
  'Node.js': 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  Express: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  'SQL Server': 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg',
  SQLite: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg',
  MongoDB: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  PostgreSQL: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  MySQL: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  Angular: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
  React: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  JavaScript: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  TypeScript: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  HTML5: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  CSS3: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  SCSS: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',
  Blazor: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blazor/blazor-original.svg',
  Razor: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg',
  XAML: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows11/windows11-original.svg',
  Flutter: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
  '.NET MAUI': 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg',
  Xamarin: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xamarin/xamarin-original.svg',
  WinForms: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows11/windows11-original.svg',
  WinUI: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows11/windows11-original.svg',
  WPF: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows11/windows11-original.svg',
  JavaFX: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  'Servicio Windows con C#': 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows11/windows11-original.svg',
  'Servicio Windows con VB': 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualbasic/visualbasic-original.svg',
  'Windows Service with C#': 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows11/windows11-original.svg',
  'Windows Service with VB': 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualbasic/visualbasic-original.svg',
  'Visual Studio Code': 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
  'Visual Studio': 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg',
  'SQL Server Management Studio': 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg',
  'MySQL Workbench': 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  'pgAdmin / gestor PostgreSQL': 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  'pgAdmin / PostgreSQL manager': 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  'Android Studio': 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg',
  NetBeans: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netbeans/netbeans-original.svg',
  Eclipse: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eclipse/eclipse-original.svg',
  Postman: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg',
  Git: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  'Azure DevOps': 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azuredevops/azuredevops-original.svg',
  GitHub: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  GitLab: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg',
  Bitbucket: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bitbucket/bitbucket-original.svg'
};

function renderSkillIcon(icon: string, label: string, variant: 'default' | 'large' = 'default') {
  const resolvedIcon = brandedSkillIcons[label] ?? icon;
  const className = variant === 'large' ? 'skill-icon-image skill-icon-large' : 'skill-icon-image';

  if (resolvedIcon.startsWith('img:')) {
    return <img className={className} src={resolvedIcon.replace('img:', '')} alt={`${label} icon`} loading="lazy" />;
  }

  return <i className={`bi ${resolvedIcon} ${variant === 'large' ? 'skill-icon-large' : ''}`.trim()} aria-hidden="true" />;
}

const skillDetailByCategory: Record<Lang, Record<SkillCategory, string>> = {
  es: {
    all: 'Capacidad aplicada en escenarios reales con enfoque en calidad, escalabilidad y mantenimiento continuo.',
    frontend: 'Incluye arquitectura de componentes, accesibilidad, rendimiento, manejo de estado y UX consistente en producción.',
    backend: 'Aplicado en diseño de APIs, seguridad, validación, rendimiento, integración de datos y observabilidad.',
    architectures: 'Usado para estructurar soluciones escalables, facilitar pruebas y separar responsabilidades por capas.',
    patterns: 'Implementado para reducir acoplamiento, mejorar legibilidad y estandarizar decisiones técnicas.',
    methodologies: 'Aplicado en planeación, seguimiento de entregas y mejora continua en equipos multidisciplinarios.',
    practices: 'Guía de calidad para escribir código mantenible, claro y enfocado en valor de negocio.',
    mobile: 'Experiencia construyendo apps con buen performance, integración de servicios y experiencia de usuario estable.',
    tools: 'Herramientas usadas para desarrollo diario, integración continua, versionamiento y diagnóstico técnico.',
    desktop: 'Aplicado en interfaces empresariales orientadas a productividad, estabilidad y mantenimiento en operación.',
    windows: 'Servicios de fondo para procesos críticos, automatización y comunicación entre sistemas legacy y modernos.'
  },
  en: {
    all: 'Applied in real-world delivery with a strong focus on quality, scalability, and long-term maintainability.',
    frontend: 'Covers component architecture, accessibility, performance, state management, and production-grade UX consistency.',
    backend: 'Used in API design, security, validation, performance optimization, data integration, and observability.',
    architectures: 'Used to structure scalable systems, enable testing, and enforce clear separation of concerns.',
    patterns: 'Applied to reduce coupling, improve readability, and standardize reusable technical decisions.',
    methodologies: 'Applied for planning, delivery tracking, and continuous improvement across cross-functional teams.',
    practices: 'Quality principles that drive maintainable, clean, and business-focused engineering outcomes.',
    mobile: 'Hands-on delivery of mobile apps with solid performance, service integration, and stable UX.',
    tools: 'Core daily toolset for development, CI/CD workflows, source control, and technical diagnostics.',
    desktop: 'Applied in enterprise desktop interfaces focused on productivity, stability, and operational continuity.',
    windows: 'Background services for critical automation, integrations, and reliable system-to-system processing.'
  }
};

function getSkillDeepDescription(skill: SkillCard, lang: Lang) {
  return `${skill.description} ${skillDetailByCategory[lang][skill.category]}`;
}

type Dictionary = {
  nav: string[];
  heroGreeting: string;
  heroPrefix: string;
  heroDescription: string;
  ctaWork: string;
  ctaContact: string;
  ctaDownloadCv: string;
  floating: { design: string; code: string; ideas: string };
  pages: Record<'resume' | 'services' | 'portfolio' | 'contact', { title: string; text: string }>;
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
};

type ResumeContent = {
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

const copy: Record<Lang, Dictionary> = {
  en: {
    nav: ['Home', 'About', 'Resume', 'Services', 'Portfolio', 'Contact'],
    heroGreeting: "Hello, I'm",
    heroPrefix: 'Creative',
    heroDescription:
      'Full Stack Developer focused on building web and mobile products with strong UX/UI, clean architecture, and business impact.',
    ctaWork: 'View My Work',
    ctaContact: 'Get In Touch',
    ctaDownloadCv: 'Download CV',
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
      subtitle:
        'Results-driven software professional focused on solving real business problems with scalable, secure and maintainable solutions across backend, frontend, mobile and architecture.',
      filters: {
        all: 'All',
        frontend: 'Front-end',
        backend: 'Back-end',
        architectures: 'Architectures',
        patterns: 'Design Patterns',
        methodologies: 'Work Methodologies',
        practices: 'Best Practices',
        mobile: 'Mobile',
        tools: 'Tools',
        desktop: 'Desktop',
        windows: 'Windows Services'
      },
      summaryTitle: 'Professional Focus',
      summary: {
        frontend: 'Front-End Developer',
        backend: 'Back-End Developer',
        mobile: 'Mobile Developer'
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
    ctaDownloadCv: 'Descargar CV',
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
      subtitle:
        'Profesional del software orientado a resultados, enfocado en resolver problemas reales con soluciones escalables, seguras y mantenibles en backend, frontend, mobile y arquitectura.',
      filters: {
        all: 'Todos',
        frontend: 'Front-end',
        backend: 'Back-end',
        architectures: 'Arquitecturas',
        patterns: 'Patrones de diseños',
        methodologies: 'Metodologías de trabajo',
        practices: 'Buenas prácticas',
        mobile: 'Mobile',
        tools: 'Herramientas/Tools',
        desktop: 'Desktop',
        windows: 'Servicios de Windows'
      },
      summaryTitle: 'Enfoque Profesional',
      summary: {
        frontend: 'Front-End Developer',
        backend: 'Back-End Developer',
        mobile: 'Mobile Developer'
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

const resumeContent: Record<Lang, ResumeContent> = {
  en: {
    title: 'Resume',
    subtitle: 'Professional profile, experience, education, and technical strengths built from real project delivery.',
    profileTitle: 'Professional Summary',
    profileSummary:
      'Software Developer with over 2 years of experience. I started as a mobile developer working with Xamarin, then built mobile apps and APIs with .NET MAUI and ASP.NET 9. I focus on clean architecture, clean code, design patterns, and secure, high-performance solutions with strong UX impact.',
    location: 'Santo Domingo, Dominican Republic',
    linkedin: {
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/elvis-hernandez-075496285',
      displayUrl: 'linkedin.com/in/elvis-hernandez-075496285'
    },
    github: {
      label: 'GitHub',
      url: 'https://github.com/Elvis2025',
      displayUrl: 'github.com/Elvis2025'
    },
    email: { label: 'Email', address: 'inelvis16031124@gmail.com' },
    phone: '+1 849-869-8664',
    experienceTitle: 'Professional Experience',
    educationTitle: 'Education',
    skillsTitle: 'Core Skills',
    contactCta: 'Contact me',
    downloadCta: 'Download CV',
    experience: [
      {
        company: 'IB Systems',
        role: 'Full Stack Developer',
        period: '2024 - Present',
        bullets: [
          'Currently implementing and optimizing high-quality backend and frontend features in production systems.',
          'Working under Agile and Scrum methodologies to improve delivery predictability and throughput.',
          'Using Boilerplate as a base to keep consistency, quality standards, and maintainable architecture.',
          'Applying SOLID principles in new repositories and maintenance tasks for clean and readable code.'
        ]
      },
      {
        company: 'MDSOFT',
        role: 'Mobile Developer',
        period: '2022 - 2024',
        bullets: [
          'Delivered three mobile and database-driven projects in record time, fully tailored to client needs.',
          'Applied SOLID principles and engineering best practices across all delivered modules.',
          'Built a B2B application with .NET MAUI (.NET 9) consuming an ASP.NET 9 API using Onion Architecture and security controls.',
          'Refactored and redesigned a .NET 8 mobile application, revamping UI/UX and implementing new modules and business logic.',
          'Extended Xamarin features with PDF generation, portable printer formatting, XML automation, and internal enterprise processes.'
        ]
      }
    ],
    education: [
      {
        institution: 'Technological Institute of the Americas (ITLA)',
        degree: 'Software Development Degree (Ongoing)',
        period: 'In progress'
      }
    ],
    highlightedSkills: [
      { name: 'Software Architecture', level: 93 },
      { name: 'Flutter', level: 84 },
      { name: 'React / TypeScript', level: 90 },
      { name: 'Blazor / C#', level: 88 },
      { name: 'Spring Boot / Java', level: 86 }
    ]
  },
  es: {
    title: 'Resumen',
    subtitle: 'Perfil profesional, experiencia, educación y fortalezas técnicas construidas en proyectos reales.',
    profileTitle: 'Resumen Profesional',
    profileSummary:
      'Desarrollador de software con más de 2 años de experiencia. Inicié como desarrollador móvil trabajando con Xamarin, luego construí aplicaciones y APIs con .NET MAUI y ASP.NET 9. Me enfoco en arquitectura limpia, código limpio, patrones de diseño y soluciones seguras y de alto rendimiento con impacto en UX.',
    location: 'Santo Domingo, República Dominicana',
    linkedin: {
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/elvis-hernandez-075496285',
      displayUrl: 'linkedin.com/in/elvis-hernandez-075496285'
    },
    github: {
      label: 'GitHub',
      url: 'https://github.com/Elvis2025',
      displayUrl: 'github.com/Elvis2025'
    },
    email: { label: 'Correo', address: 'inelvis16031124@gmail.com' },
    phone: '+1 849-869-8664',
    experienceTitle: 'Experiencia Profesional',
    educationTitle: 'Educación',
    skillsTitle: 'Habilidades Clave',
    contactCta: 'Contáctame',
    downloadCta: 'Descargar CV',
    experience: [
      {
        company: 'IB Systems',
        role: 'Full Stack Developer',
        period: '2024 - Actualidad',
        bullets: [
          'Actualmente implemento y optimizo funcionalidades de alta calidad para backend y frontend en producción.',
          'Trabajo con metodologías Agile y Scrum para mejorar predictibilidad y velocidad de entrega.',
          'Uso Boilerplate como base para mantener consistencia técnica, calidad y mantenibilidad.',
          'Aplico principios SOLID en nuevos repositorios y mantenimientos para código limpio y legible.'
        ]
      },
      {
        company: 'MDSOFT',
        role: 'Desarrollador Móvil',
        period: '2022 - 2024',
        bullets: [
          'Entregué tres proyectos móviles y de base de datos en tiempo récord, totalmente adaptados al cliente.',
          'Apliqué principios SOLID y buenas prácticas de ingeniería en todos los módulos desarrollados.',
          'Construí una app B2B con .NET MAUI (.NET 9) consumiendo una API en ASP.NET 9 con Onion Architecture y controles de seguridad.',
          'Refactoricé y rediseñé una app móvil en .NET 8, renovando UI/UX y agregando nuevos módulos y lógica de negocio.',
          'Extendí funcionalidades en Xamarin con generación de PDFs, formato para impresoras portátiles, automatización XML y procesos internos.'
        ]
      }
    ],
    education: [
      {
        institution: 'Instituto Tecnológico de las Américas (ITLA)',
        degree: 'Carrera de Desarrollo de Software (En curso)',
        period: 'En progreso'
      }
    ],
    highlightedSkills: [
      { name: 'Arquitectura de Software', level: 93 },
      { name: 'Flutter', level: 84 },
      { name: 'React / TypeScript', level: 90 },
      { name: 'Blazor / C#', level: 88 },
      { name: 'Spring Boot / Java', level: 86 }
    ]
  }
};

const skillsCatalog: Record<Lang, SkillCard[]> = {
  es: [
    { title: 'ASP.NET Core', description: 'APIs robustas con seguridad, validaciones y arquitectura limpia.', percent: 95, category: 'backend', icon: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg' },
    { title: 'C#', description: 'Lenguaje principal para backend, desktop y servicios empresariales.', percent: 94, category: 'backend', icon: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
    { title: 'Java', description: 'Desarrollo backend y desktop con enfoque enterprise.', percent: 82, category: 'backend', icon: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    { title: 'Spring Boot', description: 'Microservicios y APIs Java listas para producción.', percent: 79, category: 'backend', icon: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
    { title: 'Node.js', description: 'Runtime para servicios web y APIs orientadas a eventos.', percent: 80, category: 'backend', icon: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { title: 'Express', description: 'Framework minimalista para construir APIs en Node.js.', percent: 78, category: 'backend', icon: 'bi-diagram-2' },
    { title: 'SQL Server', description: 'Diseño de BD, SPs, vistas y optimización de consultas.', percent: 93, category: 'backend', icon: 'bi-database-fill' },
    { title: 'SQLite', description: 'Persistencia local eficiente para apps móviles.', percent: 88, category: 'backend', icon: 'bi-device-hdd' },
    { title: 'MongoDB', description: 'Modelado NoSQL para documentos y escenarios flexibles.', percent: 77, category: 'backend', icon: 'bi-hdd-network' },
    { title: 'PostgreSQL', description: 'Base de datos relacional avanzada para sistemas robustos.', percent: 80, category: 'backend', icon: 'bi-database-gear' },
    { title: 'MySQL', description: 'Gestión de datos relacionales en soluciones web.', percent: 82, category: 'backend', icon: 'bi-database-check' },

    { title: 'Angular', description: 'Interfaces modernas y escalables para aplicaciones empresariales.', percent: 82, category: 'frontend', icon: 'bi-window-sidebar' },
    { title: 'React', description: 'UI modular basada en componentes y estado reactivo.', percent: 80, category: 'frontend', icon: 'bi-bounding-box-circles' },
    { title: 'JavaScript', description: 'Lenguaje base para interactividad frontend en navegador.', percent: 84, category: 'frontend', icon: 'bi-filetype-js' },
    { title: 'TypeScript', description: 'Tipado estático para frontend más mantenible y seguro.', percent: 86, category: 'frontend', icon: 'bi-filetype-tsx' },
    { title: 'HTML5', description: 'Estructura semántica para experiencias web accesibles.', percent: 90, category: 'frontend', icon: 'bi-filetype-html' },
    { title: 'CSS3', description: 'Estilado moderno, responsive y consistente.', percent: 88, category: 'frontend', icon: 'bi-filetype-css' },
    { title: 'SCSS', description: 'Estilos escalables con variables, nesting y reutilización.', percent: 86, category: 'frontend', icon: 'bi-palette2' },
    { title: 'Blazor', description: 'Desarrollo web interactivo con C# en el frontend.', percent: 72, category: 'frontend', icon: 'bi-browser-edge' },
    { title: 'Razor', description: 'Vistas dinámicas .NET para server rendering.', percent: 78, category: 'frontend', icon: 'bi-file-earmark-code' },
    { title: 'XAML', description: 'Markup para interfaces ricas en aplicaciones .NET.', percent: 85, category: 'frontend', icon: 'bi-columns-gap' },

    { title: 'Clean Architecture', description: 'Separación de capas para escalabilidad y testabilidad.', percent: 94, category: 'architectures', icon: 'bi-diagram-3' },
    { title: 'Onion Architecture', description: 'Dominio en el centro y desacople de infraestructura.', percent: 90, category: 'architectures', icon: 'bi-bullseye' },
    { title: 'Arquitectura Modular', description: 'Sistemas desacoplados por módulos.', percent: 88, category: 'architectures', icon: 'bi-boxes' },
    { title: 'Arquitectura Monolítica', description: 'Diseño coherente para soluciones centralizadas.', percent: 85, category: 'architectures', icon: 'bi-square' },
    { title: 'Vertical Slice', description: 'Organización por caso de uso orientada a features.', percent: 89, category: 'architectures', icon: 'bi-grid-1x2' },
    { title: 'Horizontal Slice', description: 'Separación por capas funcionales transversales.', percent: 84, category: 'architectures', icon: 'bi-layout-three-columns' },

    { title: 'Repository Pattern', description: 'Abstracción de acceso a datos limpia y mantenible.', percent: 92, category: 'patterns', icon: 'bi-archive' },
    { title: 'Unit of Work', description: 'Control transaccional y coordinación de persistencia.', percent: 91, category: 'patterns', icon: 'bi-arrow-repeat' },
    { title: 'Factory Pattern', description: 'Creación estandarizada de objetos por contexto.', percent: 85, category: 'patterns', icon: 'bi-tools' },
    { title: 'Strategy Pattern', description: 'Intercambio de algoritmos sin cambiar clientes.', percent: 87, category: 'patterns', icon: 'bi-shuffle' },
    { title: 'Mediator Pattern', description: 'Comunicación desacoplada entre componentes.', percent: 86, category: 'patterns', icon: 'bi-diagram-2-fill' },
    { title: 'Result Pattern', description: 'Respuesta consistente de éxito/error.', percent: 88, category: 'patterns', icon: 'bi-check2-square' },
    { title: 'CQRS', description: 'Separación comando/consulta para claridad y escala.', percent: 86, category: 'patterns', icon: 'bi-distribute-vertical' },
    { title: 'Singleton Pattern', description: 'Instancia única controlada para recursos compartidos.', percent: 83, category: 'patterns', icon: 'bi-1-circle' },

    { title: 'Agile', description: 'Entrega iterativa enfocada en valor continuo.', percent: 90, category: 'methodologies', icon: 'bi-lightning-charge' },
    { title: 'Scrum', description: 'Framework por sprints con roles y ceremonias claras.', percent: 89, category: 'methodologies', icon: 'bi-kanban' },
    { title: 'Kanban', description: 'Flujo visual con límites WIP y visibilidad de entrega.', percent: 88, category: 'methodologies', icon: 'bi-columns-gap' },

    { title: 'SOLID', description: 'Principios para código flexible y mantenible.', percent: 94, category: 'practices', icon: 'bi-bricks' },
    { title: 'KISS', description: 'Soluciones simples para reducir complejidad.', percent: 92, category: 'practices', icon: 'bi-emoji-smile' },
    { title: 'DRY', description: 'Evitar lógica duplicada para mantener consistencia.', percent: 93, category: 'practices', icon: 'bi-files' },
    { title: 'YAGNI', description: 'Construir lo necesario sin sobreingeniería.', percent: 91, category: 'practices', icon: 'bi-scissors' },

    { title: 'Flutter', description: 'Desarrollo cross-platform con alto rendimiento UI.', percent: 72, category: 'mobile', icon: 'bi-phone' },
    { title: '.NET MAUI', description: 'Apps móviles/desktop con stack .NET unificado.', percent: 93, category: 'mobile', icon: 'bi-phone-fill' },
    { title: 'Xamarin', description: 'Mantenimiento y evolución de apps móviles enterprise.', percent: 92, category: 'mobile', icon: 'bi-phone-vibrate' },

    { title: 'WinForms', description: 'Aplicaciones desktop clásicas para operación interna.', percent: 80, category: 'desktop', icon: 'bi-window' },
    { title: 'WinUI', description: 'Interfaz moderna nativa en ecosistema Windows.', percent: 74, category: 'desktop', icon: 'bi-windows' },
    { title: 'WPF', description: 'Desktop .NET con UI avanzada y data binding.', percent: 81, category: 'desktop', icon: 'bi-display' },
    { title: 'JavaFX', description: 'Framework de interfaz desktop en Java.', percent: 68, category: 'desktop', icon: 'bi-cpu' },

    { title: 'Servicio Windows con C#', description: 'Servicios .NET en segundo plano para procesos automáticos.', percent: 88, category: 'windows', icon: 'bi-gear-wide-connected' },
    { title: 'Servicio Windows con VB', description: 'Servicios en Visual Basic para tareas de background legacy.', percent: 73, category: 'windows', icon: 'bi-gear-fill' },

    { title: 'Visual Studio Code', description: 'Editor principal para frontend, backend y automatizaciones.', percent: 95, category: 'tools', icon: 'bi-code-square' },
    { title: 'Visual Studio', description: 'IDE principal para soluciones .NET complejas.', percent: 94, category: 'tools', icon: 'bi-terminal' },
    { title: 'SQL Server Management Studio', description: 'Gestión, tuning y administración de SQL Server.', percent: 93, category: 'tools', icon: 'bi-database-fill-gear' },
    { title: 'MySQL Workbench', description: 'Diseño y administración de bases MySQL.', percent: 86, category: 'tools', icon: 'bi-diagram-3-fill' },
    { title: 'pgAdmin / gestor PostgreSQL', description: 'Administración y monitoreo de PostgreSQL.', percent: 84, category: 'tools', icon: 'bi-hdd-stack' },
    { title: 'Android Studio', description: 'Pruebas, emulación y soporte para entorno móvil.', percent: 78, category: 'tools', icon: 'bi-android2' },
    { title: 'NetBeans', description: 'IDE usado en proyectos Java y mantenimiento.', percent: 72, category: 'tools', icon: 'bi-cup' },
    { title: 'Eclipse', description: 'IDE para ecosistema Java en entornos enterprise.', percent: 70, category: 'tools', icon: 'bi-easel' },
    { title: 'Postman', description: 'Pruebas, colecciones y validación de APIs.', percent: 94, category: 'tools', icon: 'bi-send' },
    { title: 'Git', description: 'Control de versiones y flujo colaborativo.', percent: 95, category: 'tools', icon: 'bi-git' },
    { title: 'Azure DevOps', description: 'Boards, repos y CI/CD para entrega continua.', percent: 88, category: 'tools', icon: 'bi-cloud-check' },
    { title: 'GitHub', description: 'Repositorios, PRs y colaboración técnica.', percent: 92, category: 'tools', icon: 'bi-github' },
    { title: 'GitLab', description: 'Gestión de repositorios y pipelines CI/CD.', percent: 82, category: 'tools', icon: 'bi-gitlab' },
    { title: 'Bitbucket', description: 'Versionamiento y trabajo en equipos enterprise.', percent: 80, category: 'tools', icon: 'bi-diagram-2' }
  ],
  en: [
    { title: 'ASP.NET Core', description: 'Robust APIs with security, validation and clean architecture.', percent: 95, category: 'backend', icon: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg' },
    { title: 'C#', description: 'Primary language for backend, desktop and enterprise services.', percent: 94, category: 'backend', icon: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
    { title: 'Java', description: 'Backend and desktop development with enterprise approach.', percent: 82, category: 'backend', icon: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    { title: 'Spring Boot', description: 'Production-ready Java microservices and APIs.', percent: 79, category: 'backend', icon: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
    { title: 'Node.js', description: 'Runtime for event-driven web services and APIs.', percent: 80, category: 'backend', icon: 'img:https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { title: 'Express', description: 'Minimal framework for building Node.js APIs.', percent: 78, category: 'backend', icon: 'bi-diagram-2' },
    { title: 'SQL Server', description: 'DB design, stored procedures, views and query optimization.', percent: 93, category: 'backend', icon: 'bi-database-fill' },
    { title: 'SQLite', description: 'Efficient local persistence for mobile workflows.', percent: 88, category: 'backend', icon: 'bi-device-hdd' },
    { title: 'MongoDB', description: 'NoSQL modeling for document-based flexible systems.', percent: 77, category: 'backend', icon: 'bi-hdd-network' },
    { title: 'PostgreSQL', description: 'Advanced relational database for robust systems.', percent: 80, category: 'backend', icon: 'bi-database-gear' },
    { title: 'MySQL', description: 'Relational data management for web solutions.', percent: 82, category: 'backend', icon: 'bi-database-check' },

    { title: 'Angular', description: 'Modern, scalable UI delivery for enterprise apps.', percent: 82, category: 'frontend', icon: 'bi-window-sidebar' },
    { title: 'React', description: 'Modular UI through component-driven architecture.', percent: 80, category: 'frontend', icon: 'bi-bounding-box-circles' },
    { title: 'JavaScript', description: 'Core browser language for modern frontend interactivity.', percent: 84, category: 'frontend', icon: 'bi-filetype-js' },
    { title: 'TypeScript', description: 'Static typing for safer and scalable frontend code.', percent: 86, category: 'frontend', icon: 'bi-filetype-tsx' },
    { title: 'HTML5', description: 'Semantic structure for accessible web experiences.', percent: 90, category: 'frontend', icon: 'bi-filetype-html' },
    { title: 'CSS3', description: 'Modern responsive styling and visual consistency.', percent: 88, category: 'frontend', icon: 'bi-filetype-css' },
    { title: 'SCSS', description: 'Scalable styles with variables and composition.', percent: 86, category: 'frontend', icon: 'bi-palette2' },
    { title: 'Blazor', description: 'Interactive web UI built with C#.', percent: 72, category: 'frontend', icon: 'bi-browser-edge' },
    { title: 'Razor', description: 'Server-rendered .NET dynamic views.', percent: 78, category: 'frontend', icon: 'bi-file-earmark-code' },
    { title: 'XAML', description: '.NET markup for rich UI composition.', percent: 85, category: 'frontend', icon: 'bi-columns-gap' },

    { title: 'Clean Architecture', description: 'Layered separation for scalable and testable solutions.', percent: 94, category: 'architectures', icon: 'bi-diagram-3' },
    { title: 'Onion Architecture', description: 'Domain-centered architecture with infra decoupling.', percent: 90, category: 'architectures', icon: 'bi-bullseye' },
    { title: 'Modular Architecture', description: 'Decoupled systems structured by modules.', percent: 88, category: 'architectures', icon: 'bi-boxes' },
    { title: 'Monolithic Architecture', description: 'Coherent centralized architecture when context requires.', percent: 85, category: 'architectures', icon: 'bi-square' },
    { title: 'Vertical Slice', description: 'Feature/use-case oriented system organization.', percent: 89, category: 'architectures', icon: 'bi-grid-1x2' },
    { title: 'Horizontal Slice', description: 'Layered cross-cutting organization by responsibility.', percent: 84, category: 'architectures', icon: 'bi-layout-three-columns' },

    { title: 'Repository Pattern', description: 'Clean and maintainable data-access abstraction.', percent: 92, category: 'patterns', icon: 'bi-archive' },
    { title: 'Unit of Work', description: 'Transactional consistency and persistence orchestration.', percent: 91, category: 'patterns', icon: 'bi-arrow-repeat' },
    { title: 'Factory Pattern', description: 'Standardized object creation per business context.', percent: 85, category: 'patterns', icon: 'bi-tools' },
    { title: 'Strategy Pattern', description: 'Swappable algorithms without changing clients.', percent: 87, category: 'patterns', icon: 'bi-shuffle' },
    { title: 'Mediator Pattern', description: 'Decoupled communication through a coordinator.', percent: 86, category: 'patterns', icon: 'bi-diagram-2-fill' },
    { title: 'Result Pattern', description: 'Consistent success/error handling flow.', percent: 88, category: 'patterns', icon: 'bi-check2-square' },
    { title: 'CQRS', description: 'Command/query separation for clarity and scale.', percent: 86, category: 'patterns', icon: 'bi-distribute-vertical' },
    { title: 'Singleton Pattern', description: 'Single controlled instance for shared resources.', percent: 83, category: 'patterns', icon: 'bi-1-circle' },

    { title: 'Agile', description: 'Iterative delivery focused on continuous value.', percent: 90, category: 'methodologies', icon: 'bi-lightning-charge' },
    { title: 'Scrum', description: 'Sprint framework with clear roles and ceremonies.', percent: 89, category: 'methodologies', icon: 'bi-kanban' },
    { title: 'Kanban', description: 'Flow-based delivery with WIP limits and visibility.', percent: 88, category: 'methodologies', icon: 'bi-columns-gap' },

    { title: 'SOLID', description: 'Principles for flexible and maintainable codebases.', percent: 94, category: 'practices', icon: 'bi-bricks' },
    { title: 'KISS', description: 'Simple solutions to reduce accidental complexity.', percent: 92, category: 'practices', icon: 'bi-emoji-smile' },
    { title: 'DRY', description: 'Avoid duplicate logic for consistency.', percent: 93, category: 'practices', icon: 'bi-files' },
    { title: 'YAGNI', description: 'Build only what is needed today.', percent: 91, category: 'practices', icon: 'bi-scissors' },

    { title: 'Flutter', description: 'Cross-platform mobile development with rich UI.', percent: 72, category: 'mobile', icon: 'bi-phone' },
    { title: '.NET MAUI', description: 'Unified .NET stack for mobile and desktop apps.', percent: 93, category: 'mobile', icon: 'bi-phone-fill' },
    { title: 'Xamarin', description: 'Enterprise mobile app maintenance and enhancement.', percent: 92, category: 'mobile', icon: 'bi-phone-vibrate' },

    { title: 'WinForms', description: 'Classic desktop apps for internal operation workflows.', percent: 80, category: 'desktop', icon: 'bi-window' },
    { title: 'WinUI', description: 'Modern native interface layer for Windows apps.', percent: 74, category: 'desktop', icon: 'bi-windows' },
    { title: 'WPF', description: '.NET desktop UI with rich binding capabilities.', percent: 81, category: 'desktop', icon: 'bi-display' },
    { title: 'JavaFX', description: 'Java desktop UI framework for cross-platform apps.', percent: 68, category: 'desktop', icon: 'bi-cpu' },

    { title: 'Windows Service with C#', description: '.NET background services running as Windows services.', percent: 88, category: 'windows', icon: 'bi-gear-wide-connected' },
    { title: 'Windows Service with VB', description: 'Visual Basic background services for legacy integrations.', percent: 73, category: 'windows', icon: 'bi-gear-fill' },

    { title: 'Visual Studio Code', description: 'Main editor for frontend, backend and automation tasks.', percent: 95, category: 'tools', icon: 'bi-code-square' },
    { title: 'Visual Studio', description: 'Main IDE for complex .NET solutions.', percent: 94, category: 'tools', icon: 'bi-terminal' },
    { title: 'SQL Server Management Studio', description: 'Management, tuning and SQL Server administration.', percent: 93, category: 'tools', icon: 'bi-database-fill-gear' },
    { title: 'MySQL Workbench', description: 'MySQL data modeling and administration.', percent: 86, category: 'tools', icon: 'bi-diagram-3-fill' },
    { title: 'pgAdmin / PostgreSQL manager', description: 'PostgreSQL administration and monitoring.', percent: 84, category: 'tools', icon: 'bi-hdd-stack' },
    { title: 'Android Studio', description: 'Mobile emulation, debugging and Android support.', percent: 78, category: 'tools', icon: 'bi-android2' },
    { title: 'NetBeans', description: 'IDE used in Java projects and maintenance.', percent: 72, category: 'tools', icon: 'bi-cup' },
    { title: 'Eclipse', description: 'Java ecosystem IDE for enterprise projects.', percent: 70, category: 'tools', icon: 'bi-easel' },
    { title: 'Postman', description: 'API testing, collections and endpoint validation.', percent: 94, category: 'tools', icon: 'bi-send' },
    { title: 'Git', description: 'Version control and collaboration workflows.', percent: 95, category: 'tools', icon: 'bi-git' },
    { title: 'Azure DevOps', description: 'Boards, repos and CI/CD for continuous delivery.', percent: 88, category: 'tools', icon: 'bi-cloud-check' },
    { title: 'GitHub', description: 'Repositories, PR reviews and technical collaboration.', percent: 92, category: 'tools', icon: 'bi-github' },
    { title: 'GitLab', description: 'Repository management and CI/CD pipelines.', percent: 82, category: 'tools', icon: 'bi-gitlab' },
    { title: 'Bitbucket', description: 'Source control workflows for enterprise teams.', percent: 80, category: 'tools', icon: 'bi-diagram-2' }
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
                <Link to="/contact" className="btn btn-ghost">
                  <i className="bi bi-chat-dots" /> {text.ctaContact} <i className="bi bi-arrow-up-right" />
                </Link>
                <a href="/api/cv/download" className="link-underline cv-download-trigger">
                  {text.ctaDownloadCv} <i className="bi bi-download" />
                </a>
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
  const [counts, setCounts] = useState({ frontend: 0, backend: 0, mobile: 0 });
  const [summaryStarted, setSummaryStarted] = useState(false);
  const sectionText = copy[lang].skillsSection;
  const skills = skillsCatalog[lang];

  const targets = { frontend: 82, backend: 93, mobile: 88 };

  useEffect(() => {
    setActiveFilter('all');
  }, [lang]);

  useEffect(() => {
    const summaryElement = document.getElementById('skills-summary');
    if (!summaryElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSummaryStarted(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(summaryElement);
    return () => observer.disconnect();
  }, [lang]);

  useEffect(() => {
    if (!summaryStarted) return;
    const timers: number[] = [];

    const animateCounter = (key: 'frontend' | 'backend' | 'mobile', target: number) => {
      let value = 0;
      const timer = window.setInterval(() => {
        value += 1;
        setCounts((current) => ({ ...current, [key]: Math.min(value, target) }));
        if (value >= target) window.clearInterval(timer);
      }, 18);
      timers.push(timer);
    };

    animateCounter('frontend', targets.frontend);
    animateCounter('backend', targets.backend);
    animateCounter('mobile', targets.mobile);

    return () => timers.forEach((timer) => window.clearInterval(timer));
  }, [summaryStarted]);

  useEffect(() => {
    const skillElements = Array.from(document.querySelectorAll<HTMLElement>('#skills .skills-animation [data-aos]'));
    if (!skillElements.length) return;

    const timers: number[] = [];
    let revealOrder = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          const currentOrder = revealOrder;
          revealOrder += 1;
          const delay = Math.min(currentOrder * 28, 196);
          const timer = window.setTimeout(() => {
            element.classList.add('aos-animate');
          }, delay);
          timers.push(timer);
          observer.unobserve(element);
        });
      },
      { threshold: 0.02, rootMargin: '0px 0px 22% 0px' }
    );

    skillElements.forEach((element) => {
      element.classList.remove('aos-animate');
      element.dataset.aosDelay = '0';
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [activeFilter, lang]);

  const filteredSkills = skills.filter((skill) => activeFilter === 'all' || skill.category === activeFilter);
  const filterOrder: SkillCategory[] = ['all', 'frontend', 'backend', 'mobile', 'desktop', 'windows', 'architectures', 'patterns', 'methodologies', 'practices', 'tools'];

  return (
    <section id="skills" className="skills section">
      <div className="container section-title" data-aos="fade-up">
        <h2>{sectionText.title}</h2>
        <p>{sectionText.subtitle}</p>
      </div>

      <div className="container" id="skills-summary" data-aos="fade-up" data-aos-delay="100">
        <h3 className="skills-summary-title">{sectionText.summaryTitle}</h3>
        <div className="skills-summary-grid">
          <div className="skills-summary-card" data-aos="zoom-in" data-aos-delay="140">
            <span>{sectionText.summary.frontend}</span>
            <strong>{counts.frontend}%</strong>
          </div>
          <div className="skills-summary-card" data-aos="zoom-in" data-aos-delay="220">
            <span>{sectionText.summary.backend}</span>
            <strong>{counts.backend}%</strong>
          </div>
          <div className="skills-summary-card" data-aos="zoom-in" data-aos-delay="300">
            <span>{sectionText.summary.mobile}</span>
            <strong>{counts.mobile}%</strong>
          </div>
        </div>
      </div>

      <ul className="skills-filters" data-aos="fade-up" data-aos-delay="180">
        {filterOrder.map((filter) => (
          <li key={filter} className={activeFilter === filter ? 'filter-active' : ''} onClick={() => setActiveFilter(filter)}>
            {sectionText.filters[filter]}
          </li>
        ))}
      </ul>

      <div className="container-fluid px-4 px-lg-5">
        <div className="row g-4 skills-animation">
          {filteredSkills.map((skill, index) => (
            <div key={`${skill.category}-${skill.title}`} className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay={0}>
              <div className="skill-box" tabIndex={0} aria-label={`${skill.title} ${skill.percent}%`}>
                <div className="skill-box-inner">
                  <div className="skill-face skill-front">
                    <h3>{skill.title}</h3>
                    <p>{skill.description}</p>
                    <span className="skill-percent">{renderSkillIcon(skill.icon, skill.title)} {skill.percent}%</span>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        aria-valuenow={skill.percent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        style={{ width: `${skill.percent}%` }}
                      />
                    </div>
                  </div>
                  <div className="skill-face skill-back">
                    <div className="skill-back-header">
                      <span className="skill-percent skill-percent-large">
                        {renderSkillIcon(skill.icon, skill.title, 'large')} {skill.percent}%
                      </span>
                    </div>
                    <h4>{skill.title}</h4>
                    <p>{getSkillDeepDescription(skill, lang)}</p>
                  </div>
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
                <div key={skill.title} className="col-6 col-md-4 col-lg-3" data-aos="fade-up" data-aos-delay={160 + index * 80}>
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
                <div key={item.year + item.title} className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay={160 + index * 80}>
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

          <blockquote className="personal-quote text-center mb-5" data-aos="fade-down" data-aos-delay="220">
            <p>{about.quote}</p>
          </blockquote>

          <div className="row g-3 justify-content-center">
            {about.facts.map((fact, index) => (
              <div key={fact.label} className="col-6 col-md-3 col-lg-2" data-aos="zoom-in" data-aos-delay={180 + index * 80}>
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

function ResumePage({ lang }: { lang: Lang }) {
  const data = resumeContent[lang];
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    setShowProgress(false);
    const timer = window.setTimeout(() => setShowProgress(true), 220);
    return () => window.clearTimeout(timer);
  }, [lang]);

  return (
    <section id="resume" className="resume section">
      <div className="container section-title" data-aos="fade-up">
        <h2>{data.title}</h2>
        <p>{data.subtitle}</p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="120">
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <div className="resume-item resume-card" data-aos="fade-right" data-aos-delay="150">
              <span className="resume-card-line" aria-hidden="true" />
              <h3 className="resume-title"><i className="bi bi-person-badge" /> {data.profileTitle}</h3>
              <div className="resume-content">
                <article>
                  <h4>Elvis Jesús Hernández Suárez</h4>
                  <p>{data.profileSummary}</p>
                  <ul className="resume-contact-list">
                    <li>
                      <i className="bi bi-geo-alt" aria-hidden="true" />
                      <span>{data.location}</span>
                    </li>
                    <li>
                      <i className="bi bi-linkedin" aria-hidden="true" />
                      <span className="contact-link-stack">
                        <a href={data.linkedin.url} target="_blank" rel="noreferrer">
                          {data.linkedin.label}
                        </a>
                        <small>{data.linkedin.displayUrl}</small>
                      </span>
                    </li>
                    <li>
                      <i className="bi bi-envelope" aria-hidden="true" />
                      <span className="contact-link-stack">
                        <a href={`mailto:${data.email.address}`}>{data.email.label}</a>
                        <small>{data.email.address}</small>
                      </span>
                    </li>
                    <li>
                      <i className="bi bi-whatsapp" aria-hidden="true" />
                      <span className="flag-do" aria-label="República Dominicana">🇩🇴</span>
                      <span>{data.phone}</span>
                    </li>
                    <li>
                      <i className="bi bi-github" aria-hidden="true" />
                      <span className="contact-link-stack">
                        <a href={data.github.url} target="_blank" rel="noreferrer">
                          {data.github.label}
                        </a>
                        <small>{data.github.displayUrl}</small>
                      </span>
                    </li>
                  </ul>
                </article>
              </div>
              <div className="resume-actions">
                <Link to="/contact" className="btn btn-ghost">
                  <i className="bi bi-chat-dots" /> {data.contactCta} <i className="bi bi-arrow-up-right" />
                </Link>
                <a className="link-underline cv-download-trigger" href="/api/cv/download">
                  {data.downloadCta} <i className="bi bi-download" />
                </a>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="resume-item resume-card" data-aos="fade-left" data-aos-delay="180">
              <span className="resume-card-line" aria-hidden="true" />
              <h3 className="resume-title"><i className="bi bi-stars" /> {data.skillsTitle}</h3>
              {data.highlightedSkills.map((skill) => (
                <div key={skill.name} className="skill-item">
                  <h4>{skill.name}</h4>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      aria-valuenow={skill.level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      style={{ width: showProgress ? `${skill.level}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-12">
            <div className="resume-item resume-card" data-aos="fade-up" data-aos-delay="210">
              <span className="resume-card-line" aria-hidden="true" />
              <h3 className="resume-title"><i className="bi bi-briefcase" /> {data.experienceTitle}</h3>
              <div className="resume-content">
                {data.experience.map((job) => (
                  <article key={`${job.company}-${job.role}`}>
                    <h4><i className="bi bi-person-workspace" /> {job.role}</h4>
                    <h5><i className="bi bi-calendar3" /> {job.period}</h5>
                    <p className="company"><i className="bi bi-building" /> {job.company}</p>
                    <ul>
                      {job.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="resume-item resume-card" data-aos="fade-up" data-aos-delay="250">
              <span className="resume-card-line" aria-hidden="true" />
              <h3 className="resume-title"><i className="bi bi-mortarboard" /> {data.educationTitle}</h3>
              <div className="resume-content">
                {data.education.map((item) => (
                  <article key={item.institution}>
                    <h4><i className="bi bi-award" /> {item.degree}</h4>
                    <h5><i className="bi bi-calendar3" /> {item.period}</h5>
                    <p className="institution"><i className="bi bi-bank" /> {item.institution}</p>
                  </article>
                ))}
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
      <div className="container" data-aos="fade-up" data-aos-delay="120">
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
      return <ResumePage lang={lang} />;
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
  const [showFloatingDownload, setShowFloatingDownload] = useState(true);

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
    const timer = window.setTimeout(() => setIsBootLoading(false), 2000);
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
      { threshold: 0.18, rootMargin: '0px 0px -5% 0px' }
    );

    elements.forEach((element) => {
      element.classList.remove('aos-animate');
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [pathname, lang]);

  useEffect(() => {
    const downloadTriggers = Array.from(document.querySelectorAll<HTMLElement>('.cv-download-trigger'));
    if (downloadTriggers.length === 0) {
      setShowFloatingDownload(true);
      return;
    }

    const visibleIds = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const elementId = (entry.target as HTMLElement).dataset.cvObserverId;
          if (!elementId) return;

          if (entry.isIntersecting) {
            visibleIds.add(elementId);
          } else {
            visibleIds.delete(elementId);
          }
        });
        setShowFloatingDownload(visibleIds.size === 0);
      },
      { threshold: 0.25 }
    );

    downloadTriggers.forEach((item, index) => {
      item.dataset.cvObserverId = `cv-trigger-${index}`;
      observer.observe(item);
    });

    return () => {
      downloadTriggers.forEach((item) => {
        delete item.dataset.cvObserverId;
      });
      observer.disconnect();
    };
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
      <a
        href="/api/cv/download"
        className={`floating-cv-download ${showFloatingDownload ? 'active' : ''}`}
        aria-label="Download CV"
      >
        <i className="bi bi-file-earmark-arrow-down" />
      </a>
      <Footer lang={lang} />
    </>
  );
}
