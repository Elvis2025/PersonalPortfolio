import { FormEvent, MouseEvent, ReactNode, useEffect, useMemo, useState } from 'react';

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

type ServiceItem = {
  id: string;
  icon: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  description: string;
  benefits: string[];
};

type ServicesContent = {
  title: string;
  subtitle: string;
  learnMore: string;
  modalCta: string;
  items: ServiceItem[];
};

type PortfolioCategory = 'all' | 'web' | 'mobile' | 'desktop' | 'api' | 'legacy';

type PortfolioProject = {
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

type PortfolioContent = {
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
    langToggle: 'ES',
    contact: {
      title: 'Contact',
      subtitle: 'Let’s talk about your project, migration, or product idea. I usually reply within 24 hours.',
      infoTitle: 'Contact Info',
      infoText: 'Open to freelance work, full-time roles, and technical collaborations.',
      locationLabel: 'Location',
      locationValue: 'Santo Domingo, Dominican Republic',
      phoneLabel: 'Phone',
      phoneValue: '+1 (849) 356-3687',
      emailLabel: 'Email',
      emailValue: 'inelvis16031124@gmail.com',
      formTitle: 'Get In Touch',
      formText: 'Share a few details and I will respond directly by email.',
      placeholders: {
        name: 'Your Name',
        email: 'Your Email',
        subject: 'Subject',
        message: 'Message'
      },
      button: 'Send Message',
      loading: 'Sending message...',
      success: 'Your message has been sent successfully. Thank you!',
      errors: {
        generic: 'Could not send your message right now. Please try again in a moment.',
        tooManyRequests: 'Too many attempts. Please wait one minute and try again.',
        missingFields: 'Please complete all required fields before sending.',
        invalidEmail: 'Please enter a valid email address.',
        serviceUnavailable: 'Contact service is temporarily unavailable. Please try again later or email me directly at inelvis16031124@gmail.com.',
        deliveryFailed: 'Your message could not be delivered right now. Please try again later or email me directly at inelvis16031124@gmail.com.'
      }
    }
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
    langToggle: 'EN',
    contact: {
      title: 'Contacto',
      subtitle: 'Conversemos sobre tu proyecto, migración o idea de producto. Normalmente respondo en 24 horas.',
      infoTitle: 'Información de contacto',
      infoText: 'Disponible para proyectos freelance, posiciones full-time y colaboraciones técnicas.',
      locationLabel: 'Ubicación',
      locationValue: 'Santo Domingo, República Dominicana',
      phoneLabel: 'Teléfono',
      phoneValue: '+1 (849) 356-3687',
      emailLabel: 'Correo',
      emailValue: 'inelvis16031124@gmail.com',
      formTitle: 'Hablemos',
      formText: 'Comparte algunos detalles y te responderé directamente por correo.',
      placeholders: {
        name: 'Tu nombre',
        email: 'Tu correo',
        subject: 'Asunto',
        message: 'Mensaje'
      },
      button: 'Enviar mensaje',
      loading: 'Enviando mensaje...',
      success: 'Tu mensaje fue enviado correctamente. ¡Gracias!',
      errors: {
        generic: 'No se pudo enviar tu mensaje ahora mismo. Inténtalo de nuevo en unos minutos.',
        tooManyRequests: 'Demasiados intentos. Espera un minuto y vuelve a intentarlo.',
        missingFields: 'Por favor completa todos los campos requeridos antes de enviar.',
        invalidEmail: 'Por favor ingresa un correo electrónico válido.',
        serviceUnavailable: 'El servicio de contacto no está disponible temporalmente. Inténtalo más tarde o escríbeme directamente a inelvis16031124@gmail.com.',
        deliveryFailed: 'No se pudo entregar tu mensaje en este momento. Inténtalo más tarde o escríbeme directamente a inelvis16031124@gmail.com.'
      }
    }
  }
};

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  company: string;
};

function ContactPage({ lang }: { lang: Lang }) {
  const text = copy[lang].contact;
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    company: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onChange = (field: keyof ContactFormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorMessage(text.errors.missingFields);
      setSuccessMessage('');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const payload = (await response.json().catch(() => null)) as { error?: string; message?: string; retryAfterSeconds?: number } | null;

      if (!response.ok) {
        if (response.status === 429 || payload?.error === 'TOO_MANY_REQUESTS') {
          const waitSuffix = payload?.retryAfterSeconds ? ` (${payload.retryAfterSeconds}s)` : '';
          throw new Error(`${text.errors.tooManyRequests}${waitSuffix}`);
        }

        if (response.status === 400 && (payload?.error === 'MISSING_REQUIRED_FIELDS' || payload?.error === 'INVALID_EMAIL_FORMAT')) {
          throw new Error(payload.error === 'INVALID_EMAIL_FORMAT' ? text.errors.invalidEmail : text.errors.missingFields);
        }

        if (response.status === 503 || payload?.error === 'CONTACT_SERVICE_UNAVAILABLE') {
          throw new Error(payload?.message ?? text.errors.serviceUnavailable);
        }

        if (response.status === 502 || payload?.error === 'EMAIL_DELIVERY_FAILED') {
          throw new Error(text.errors.deliveryFailed);
        }

        throw new Error(payload?.message ?? text.errors.generic);
      }

      setSuccessMessage(text.success);
      setFormData({ name: '', email: '', subject: '', message: '', company: '' });
    } catch (error) {
      const message = error instanceof Error ? error.message : text.errors.generic;
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="contact section">
      <div className="container section-title" data-aos="fade-up">
        <h2>{text.title}</h2>
        <p>{text.subtitle}</p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row g-4 g-lg-5">
          <div className="col-lg-5">
            <div className="info-box" data-aos="fade-up" data-aos-delay="200">
              <h3>{text.infoTitle}</h3>
              <p>{text.infoText}</p>

              <div className="info-item" data-aos="fade-up" data-aos-delay="300">
                <div className="icon-box"><i className="bi bi-geo-alt" /></div>
                <div className="content">
                  <h4>{text.locationLabel}</h4>
                  <p>{text.locationValue}</p>
                </div>
              </div>

              <div className="info-item" data-aos="fade-up" data-aos-delay="400">
                <div className="icon-box"><i className="bi bi-telephone" /></div>
                <div className="content">
                  <h4>{text.phoneLabel}</h4>
                  <p><a href={`tel:${text.phoneValue.replace(/[^+\d]/g, '')}`}>{text.phoneValue}</a></p>
                </div>
              </div>

              <div className="info-item" data-aos="fade-up" data-aos-delay="500">
                <div className="icon-box"><i className="bi bi-envelope" /></div>
                <div className="content">
                  <h4>{text.emailLabel}</h4>
                  <p><a href={`mailto:${text.emailValue}`}>{text.emailValue}</a></p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="contact-form" data-aos="fade-up" data-aos-delay="300">
              <h3>{text.formTitle}</h3>
              <p>{text.formText}</p>

              <form className="php-email-form" data-aos="fade-up" data-aos-delay="200" onSubmit={onSubmit}>
                <div className="row gy-4">
                  <div className="col-md-6">
                    <input type="text" name="name" className="form-control" placeholder={text.placeholders.name} required value={formData.name} onChange={(e) => onChange('name', e.target.value)} />
                  </div>

                  <div className="col-md-6">
                    <input type="email" className="form-control" name="email" placeholder={text.placeholders.email} required value={formData.email} onChange={(e) => onChange('email', e.target.value)} />
                  </div>

                  <div className="col-12">
                    <input type="text" className="form-control" name="subject" placeholder={text.placeholders.subject} required value={formData.subject} onChange={(e) => onChange('subject', e.target.value)} />
                  </div>

                  <div className="col-12 d-none" aria-hidden="true">
                    <input type="text" name="company" tabIndex={-1} autoComplete="off" value={formData.company} onChange={(e) => onChange('company', e.target.value)} />
                  </div>

                  <div className="col-12">
                    <textarea className="form-control" name="message" rows={6} placeholder={text.placeholders.message} required value={formData.message} onChange={(e) => onChange('message', e.target.value)} />
                  </div>

                  <div className="col-12 text-center">
                    {isLoading ? <div className="loading d-block">{text.loading}</div> : null}
                    {errorMessage ? <div className="error-message d-block">{errorMessage}</div> : null}
                    {successMessage ? <div className="sent-message d-block">{successMessage}</div> : null}

                    <button type="submit" className="btn" disabled={isLoading}>
                      {text.button}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
      { name: 'Spring Boot / Java', level: 86 },
      { name: 'ASP .NET / C#', level: 94 }
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
      { name: 'Spring Boot / Java', level: 86 },
      { name: 'ASP .NET / C#', level: 94 }
    ]
  }
};

const servicesContent: Record<Lang, ServicesContent> = {
  en: {
    title: 'Services',
    subtitle:
      'End-to-end services designed to ship scalable products, improve business workflows, and deliver measurable impact in web, mobile, and backend systems.',
    learnMore: 'Learn More',
    modalCta: 'Let’s discuss this service',
    items: [
      {
        id: 'fullstack',
        icon: 'bi-code-slash',
        title: 'Custom Full Stack Development',
        summary: 'Web platforms and business systems built with React, Angular, ASP.NET, and SQL-based architectures.',
        category: 'Full Stack Engineering',
        readTime: '4 min read',
        description:
          'I build complete digital products from architecture to production release. This includes robust APIs, modern UIs, scalable database design, and maintainable code standards for long-term growth.',
        benefits: ['Clean architecture and SOLID principles', 'Secure API design and integrations', 'Performance-focused frontend and backend delivery']
      },
      {
        id: 'api',
        icon: 'bi-hdd-network',
        title: 'API & Backend Architecture',
        summary: 'Reliable APIs for mobile apps, web apps, and enterprise integrations with strong validation and security.',
        category: 'Backend Systems',
        readTime: '5 min read',
        description:
          'I design and implement backend services with layered architecture, clear contracts, and observability. Ideal for products that need high reliability, modular growth, and easy maintenance.',
        benefits: ['REST API design with clean contracts', 'Authentication, authorization, and business rules', 'Data access optimization and maintainability']
      },
      {
        id: 'mobile',
        icon: 'bi-phone-fill',
        title: 'Mobile App Development',
        summary: 'Cross-platform mobile solutions with .NET MAUI and Flutter focused on speed, usability, and reliability.',
        category: 'Mobile Delivery',
        readTime: '4 min read',
        description:
          'From concept to store-ready builds, I create mobile experiences connected to real business operations. I prioritize responsive UX, data synchronization, and smooth API communication.',
        benefits: ['Cross-platform delivery and reusable code', 'Business-oriented UX and app flows', 'Backend-connected mobile architecture']
      },
      {
        id: 'uiux',
        icon: 'bi-palette2',
        title: 'UI/UX Implementation',
        summary: 'Interfaces transformed from ideas into production-ready experiences with accessibility and consistency.',
        category: 'Product Experience',
        readTime: '3 min read',
        description:
          'I convert design systems and product ideas into polished interfaces that users understand quickly. I balance aesthetics and usability to make products easier to adopt and maintain.',
        benefits: ['Design-to-code implementation', 'Reusable components and visual consistency', 'Accessibility and responsive behavior']
      },
      {
        id: 'modernization',
        icon: 'bi-arrow-repeat',
        title: 'Legacy Modernization',
        summary: 'Modernization of existing apps and ERP modules without breaking critical business operations.',
        category: 'System Evolution',
        readTime: '5 min read',
        description:
          'I help teams migrate legacy systems to modern stacks through iterative refactors and controlled releases. This reduces technical debt and unlocks safer future improvements.',
        benefits: ['Incremental migration strategy', 'Refactor legacy modules with low risk', 'Improved maintainability and release speed']
      },
      {
        id: 'devops',
        icon: 'bi-cloud-arrow-up',
        title: 'DevOps & CI/CD Enablement',
        summary: 'Automation pipelines and deployment workflows to ship faster, safer, and with better release visibility.',
        category: 'DevOps Engineering',
        readTime: '4 min read',
        description:
          'I implement DevOps practices that improve delivery speed and reliability: CI/CD pipelines, versioning strategy, environment consistency, and deployment automation. The goal is to reduce manual errors and create predictable releases.',
        benefits: ['CI/CD pipelines for build, test, and deployment', 'Environment and release workflow standardization', 'Monitoring-oriented delivery and rollback readiness']
      },
      {
        id: 'refactoring',
        icon: 'bi-arrow-repeat',
        title: 'Code Refactoring & Process Optimization',
        summary: 'Technical refactors focused on improving code quality, maintainability, and operational efficiency.',
        category: 'Engineering Optimization',
        readTime: '5 min read',
        description:
          'I analyze existing systems and refactor critical areas to improve readability, reduce complexity, and optimize execution flows. This service is ideal when teams need cleaner codebases and faster processes without rebuilding everything from scratch.',
        benefits: ['Refactor legacy and high-risk modules safely', 'Improve performance and reduce technical bottlenecks', 'Optimize development and business process workflows']
      },
      {
        id: 'consulting',
        icon: 'bi-diagram-3',
        title: 'Technical Consulting',
        summary: 'Architecture and implementation guidance for teams that need clarity on product and engineering decisions.',
        category: 'Strategy & Guidance',
        readTime: '3 min read',
        description:
          'I support teams in defining architecture, coding standards, and delivery workflows that align with business goals. This is ideal for projects that need direction, structure, and execution confidence.',
        benefits: ['Architecture and roadmap review', 'Standards for scalable team collaboration', 'Actionable recommendations focused on delivery']
      }
    ]
  },
  es: {
    title: 'Servicios',
    subtitle:
      'Servicios end-to-end diseñados para lanzar productos escalables, optimizar procesos de negocio y generar impacto real en web, móvil y backend.',
    learnMore: 'Leer más',
    modalCta: 'Quiero este servicio',
    items: [
      {
        id: 'fullstack',
        icon: 'bi-code-slash',
        title: 'Desarrollo Full Stack a Medida',
        summary: 'Plataformas web y sistemas de negocio construidos con React, Angular, ASP.NET y arquitecturas SQL.',
        category: 'Ingeniería Full Stack',
        readTime: '4 min de lectura',
        description:
          'Construyo productos digitales completos desde la arquitectura hasta el release en producción. Incluye APIs robustas, interfaces modernas, diseño escalable de base de datos y código mantenible.',
        benefits: ['Arquitectura limpia y principios SOLID', 'Diseño seguro de APIs e integraciones', 'Entrega frontend y backend orientada a rendimiento']
      },
      {
        id: 'api',
        icon: 'bi-hdd-network',
        title: 'Arquitectura de APIs y Backend',
        summary: 'APIs confiables para apps móviles, web e integraciones empresariales con validación y seguridad.',
        category: 'Sistemas Backend',
        readTime: '5 min de lectura',
        description:
          'Diseño e implemento servicios backend con arquitectura por capas, contratos claros y observabilidad. Ideal para productos que necesitan confiabilidad, crecimiento modular y mantenimiento simple.',
        benefits: ['Diseño REST con contratos limpios', 'Autenticación, autorización y reglas de negocio', 'Optimización de acceso a datos y mantenibilidad']
      },
      {
        id: 'mobile',
        icon: 'bi-phone-fill',
        title: 'Desarrollo de Apps Móviles',
        summary: 'Soluciones cross-platform con .NET MAUI y Flutter enfocadas en velocidad, usabilidad y estabilidad.',
        category: 'Delivery Móvil',
        readTime: '4 min de lectura',
        description:
          'Desde la idea hasta una app lista para producción, creo experiencias móviles conectadas a operaciones reales de negocio. Priorizo UX fluida, sincronización de datos y comunicación estable con APIs.',
        benefits: ['Entrega multiplataforma y código reutilizable', 'UX orientada a procesos de negocio', 'Arquitectura móvil conectada con backend']
      },
      {
        id: 'uiux',
        icon: 'bi-palette2',
        title: 'Implementación UI/UX',
        summary: 'Interfaces convertidas de ideas a experiencias productivas con accesibilidad y consistencia visual.',
        category: 'Experiencia de Producto',
        readTime: '3 min de lectura',
        description:
          'Transformo sistemas de diseño e ideas de producto en interfaces pulidas que los usuarios comprenden rápido. Equilibro estética y usabilidad para facilitar adopción y mantenimiento.',
        benefits: ['Implementación fiel de diseño a código', 'Componentes reutilizables y coherencia visual', 'Accesibilidad y comportamiento responsive']
      },
      {
        id: 'modernization',
        icon: 'bi-arrow-repeat',
        title: 'Modernización de Sistemas Legacy',
        summary: 'Modernización de apps existentes y módulos ERP sin romper operaciones críticas del negocio.',
        category: 'Evolución Tecnológica',
        readTime: '5 min de lectura',
        description:
          'Ayudo a migrar sistemas legacy a stacks modernos mediante refactors iterativos y releases controlados. Esto reduce deuda técnica y habilita mejoras futuras con menos riesgo.',
        benefits: ['Estrategia de migración incremental', 'Refactor seguro de módulos legacy', 'Mayor mantenibilidad y velocidad de entrega']
      },
      {
        id: 'devops',
        icon: 'bi-cloud-arrow-up',
        title: 'DevOps y CI/CD',
        summary: 'Pipelines automatizados y flujos de despliegue para entregar más rápido, con menos riesgo y mayor control.',
        category: 'Ingeniería DevOps',
        readTime: '4 min de lectura',
        description:
          'Implemento prácticas DevOps para mejorar velocidad y confiabilidad de entrega: pipelines de CI/CD, estrategia de versionado, consistencia entre ambientes y automatización de despliegues. El objetivo es reducir errores manuales y lograr releases predecibles.',
        benefits: ['Pipelines CI/CD para build, pruebas y despliegue', 'Estandarización de ambientes y flujo de releases', 'Entrega orientada a monitoreo y capacidad de rollback']
      },
      {
        id: 'refactoring',
        icon: 'bi-arrow-repeat',
        title: 'Refactorización de Código y Optimización de Procesos',
        summary: 'Refactors técnicos enfocados en calidad de código, mantenibilidad y eficiencia operativa.',
        category: 'Optimización de Ingeniería',
        readTime: '5 min de lectura',
        description:
          'Analizo sistemas existentes y refactorizo áreas críticas para mejorar legibilidad, reducir complejidad y optimizar flujos de ejecución. Este servicio es ideal cuando un equipo necesita limpiar su base de código y acelerar procesos sin rehacer todo desde cero.',
        benefits: ['Refactor seguro de módulos legacy o críticos', 'Mejora de rendimiento y reducción de cuellos de botella', 'Optimización de flujos de desarrollo y procesos de negocio']
      },
      {
        id: 'consulting',
        icon: 'bi-diagram-3',
        title: 'Consultoría Técnica',
        summary: 'Acompañamiento en arquitectura e implementación para equipos que necesitan claridad técnica.',
        category: 'Estrategia y Guía',
        readTime: '3 min de lectura',
        description:
          'Acompaño equipos definiendo arquitectura, estándares de código y flujos de entrega alineados al negocio. Ideal para proyectos que necesitan dirección, estructura y confianza para ejecutar.',
        benefits: ['Revisión de arquitectura y roadmap técnico', 'Estándares para trabajo escalable en equipo', 'Recomendaciones accionables enfocadas en entrega']
      }
    ]
  }
};



const portfolioContent: Record<Lang, PortfolioContent> = {
  en: {
    title: 'Portfolio',
    subtitle:
      'A curated set of real projects across web, mobile, desktop, APIs, and modernization work delivered for business operations and product growth.',
    viewAll: 'View All Projects',
    viewProject: 'View project details',
    nextProject: 'Next project',
    overview: 'Project Overview',
    challengeTitle: 'The Challenge',
    solutionTitle: 'The Solution',
    featuresTitle: 'Key Features',
    categories: {
      all: 'All',
      web: 'Web',
      mobile: 'Mobile',
      desktop: 'Desktop',
      api: 'APIs',
      legacy: 'Legacy / Modernization'
    },
    projects: [
      {
        id: 'veterinary-web',
        title: 'Veterinary Management Platform',
        type: 'Web Application',
        category: 'web',
        summary: 'A complete veterinary platform built with React, JavaScript, Tailwind CSS, Node.js, and MongoDB.',
        month: '2023',
        client: 'Veterinary Clinic',
        stack: ['React', 'JavaScript', 'Tailwind CSS', 'Node.js', 'MongoDB'],
        challenge: 'The clinic needed one place to manage pets, owners, appointments, and treatment history with fast search and easy admin workflows.',
        solution: 'I delivered a full-stack dashboard with modular frontend components, API integration, appointment flow, and secure role-aware data operations.',
        impact: ['Pet and owner records centralized', 'Faster appointment scheduling and history tracking', 'Cleaner data flow between reception and doctors'],
        tags: ['React', 'MongoDB', 'Tailwind']
      },
      {
        id: 'b2b-maui',
        title: 'B2B Sales & Operations App',
        type: 'Mobile Application',
        category: 'mobile',
        summary: 'Cross-platform business app using .NET MAUI connected to ASP.NET 9 APIs with Onion Architecture.',
        month: '2024',
        client: 'MDSOFT Client',
        stack: ['.NET MAUI', 'ASP.NET 9', 'C#', 'SQL Server', 'Onion Architecture'],
        challenge: 'Sales and operations teams required offline-friendly mobile workflows with secure API access and synchronized business data.',
        solution: 'Implemented robust mobile modules, secure auth flows, and API integrations while preserving clean architecture and maintainability.',
        impact: ['Improved field productivity', 'Reduced manual reporting errors', 'Better mobile-to-backend reliability'],
        tags: ['.NET MAUI', 'ASP.NET', 'B2B']
      },
      {
        id: 'erp-modernization',
        title: 'Legacy ERP Modernization Initiative',
        type: 'Modernization Program',
        category: 'legacy',
        summary: 'Incremental refactor and migration of ERP modules toward modular clean architecture and improved UX.',
        month: '2025',
        client: 'Enterprise Internal Systems',
        stack: ['C#', '.NET', 'SQL Server', 'Clean Architecture', 'Angular'],
        challenge: 'The legacy ERP had tight coupling, difficult maintenance, and slow delivery cycles for new business requirements.',
        solution: 'Led targeted module refactors, defined cleaner boundaries, and improved frontend/backend collaboration without operational downtime.',
        impact: ['Reduced technical debt hotspots', 'Faster module delivery cycles', 'More maintainable architecture for future growth'],
        tags: ['Refactor', 'ERP', 'Architecture']
      },
      {
        id: 'desktop-operations',
        title: 'Internal Desktop Operations Suite',
        type: 'Desktop Application',
        category: 'desktop',
        summary: 'Desktop workflows for operational control, reporting, and document processing in enterprise environments.',
        month: '2022 - 2024',
        client: 'Operations Teams',
        stack: ['WinForms', 'WPF', 'C#', 'SQL Server'],
        challenge: 'Teams depended on scattered manual tools for daily processes, creating delays and inconsistency in reporting.',
        solution: 'Developed and maintained desktop modules with business rules, reusable components, and database-driven process automation.',
        impact: ['Standardized internal workflows', 'Improved report consistency', 'Lowered repetitive manual workload'],
        tags: ['Desktop', 'WinForms', 'Automation']
      },
      {
        id: 'enterprise-apis',
        title: 'Enterprise API Ecosystem',
        type: 'API Platform',
        category: 'api',
        summary: 'Backend APIs powering mobile and web clients with secure validation, integration, and scalable service boundaries.',
        month: '2024 - Present',
        client: 'IB Systems',
        stack: ['ASP.NET Core', 'C#', 'SQL Server', 'Postman', 'Azure DevOps'],
        challenge: 'Multiple clients required reliable, secure APIs with consistent contracts and better observability across features.',
        solution: 'Designed and optimized API modules with layered architecture, validation pipelines, and delivery workflows aligned with agile teams.',
        impact: ['More stable integrations across apps', 'Improved maintainability and testability', 'Higher confidence in production deployments'],
        tags: ['API', 'ASP.NET Core', 'SQL Server']
      },
      {
        id: 'xamarin-enhancements',
        title: 'Xamarin Legacy App Enhancements',
        type: 'Mobile Maintenance & Refactor',
        category: 'legacy',
        summary: 'Feature expansion and technical improvements for existing Xamarin apps in production.',
        month: '2022 - 2023',
        client: 'MDSOFT Client Projects',
        stack: ['Xamarin', 'C#', 'XML', 'PDF tooling'],
        challenge: 'Legacy mobile apps needed new business features while keeping compatibility with existing operational processes.',
        solution: 'Added PDF generation, printer formatting, XML automation, and performance-focused fixes while stabilizing legacy code paths.',
        impact: ['Extended product lifecycle', 'Maintained continuity for existing users', 'Enabled gradual transition to newer stacks'],
        tags: ['Xamarin', 'Legacy', 'Optimization']
      },
      {
        id: 'song-manager',
        title: 'Song Manager',
        type: 'Desktop + Web Utility',
        category: 'desktop',
        summary: 'Music catalog manager for organizing songs, metadata, playlists, and fast library search.',
        month: '2023 - 2024',
        client: 'Personal/Product Build',
        stack: ['C#', 'SQLite', 'React', 'TypeScript'],
        challenge: 'Managing large music collections with inconsistent metadata and duplicate files was slow and error-prone.',
        solution: 'Built a management tool with search, grouping, metadata editing, and clean indexing workflow for better music library control.',
        impact: ['Faster organization of song libraries', 'Cleaner metadata consistency', 'Reduced duplicate and misclassified tracks'],
        tags: ['Song Manager', 'Desktop', 'Productivity']
      },
      {
        id: 'ai-integration',
        title: 'AI Integration Workflows',
        type: 'AI-Enhanced Feature Set',
        category: 'api',
        summary: 'Integration of AI-assisted workflows into product features to automate repetitive and decision-heavy tasks.',
        month: '2025',
        client: 'Internal Product Initiatives',
        stack: ['ASP.NET Core', 'TypeScript', 'Prompt Engineering', 'REST APIs'],
        challenge: 'Teams required faster processing for repetitive operations and better assisted decision-making across modules.',
        solution: 'Implemented AI-connected service flows with prompt orchestration, validations, and integration-safe backend endpoints.',
        impact: ['Reduced manual processing time', 'Improved operator productivity', 'Enabled scalable AI-assisted workflows'],
        tags: ['AI', 'Integration', 'Automation']
      },
      {
        id: 'spend-flow',
        title: 'Spend Flow',
        type: 'Finance & Budget App',
        category: 'web',
        summary: 'Expense and budget management solution for tracking cash flow, categories, and spending behavior.',
        month: '2024',
        client: 'Product Concept',
        stack: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
        challenge: 'Users needed a clear and simple way to control personal/business spending and visualize trends.',
        solution: 'Designed a finance dashboard with transaction management, budgeting rules, and spending insights by category.',
        impact: ['Better visibility of monthly spending', 'Faster financial decisions', 'Improved control over budgets and categories'],
        tags: ['Fintech', 'Dashboard', 'Budgeting']
      },
      {
        id: 'owney-beauty',
        title: 'Owney Beauty',
        type: 'Beauty Booking Platform',
        category: 'web',
        summary: 'Booking and client management platform for beauty services, schedules, and customer follow-up.',
        month: '2024',
        client: 'Owney Beauty',
        stack: ['React', 'JavaScript', 'Tailwind CSS', 'Node.js'],
        challenge: 'The business needed digital booking, service visibility, and follow-up workflows to reduce manual coordination.',
        solution: 'Built a responsive booking experience with service catalog, appointment management, and simple client tracking tools.',
        impact: ['More organized appointment calendar', 'Better client communication flow', 'Reduced manual scheduling workload'],
        tags: ['Beauty', 'Booking', 'Web App']
      }
    ]
  },
  es: {
    title: 'Portafolio',
    subtitle:
      'Selección de proyectos reales en web, móvil, desktop, APIs y modernización, entregados para mejorar operación y crecimiento de producto.',
    viewAll: 'Ver todos los proyectos',
    viewProject: 'Ver detalles del proyecto',
    nextProject: 'Siguiente proyecto',
    overview: 'Resumen del Proyecto',
    challengeTitle: 'El Reto',
    solutionTitle: 'La Solución',
    featuresTitle: 'Características Clave',
    categories: {
      all: 'Todos',
      web: 'Web',
      mobile: 'Mobile',
      desktop: 'Desktop',
      api: 'APIs',
      legacy: 'Legacy / Modernización'
    },
    projects: [
      {
        id: 'veterinary-web',
        title: 'Plataforma de Gestión Veterinaria',
        type: 'Aplicación Web',
        category: 'web',
        summary: 'Plataforma veterinaria completa construida con React, JavaScript, Tailwind CSS, Node.js y MongoDB.',
        month: '2023',
        client: 'Clínica Veterinaria',
        stack: ['React', 'JavaScript', 'Tailwind CSS', 'Node.js', 'MongoDB'],
        challenge: 'La clínica necesitaba centralizar mascotas, dueños, citas e historial de tratamientos con búsqueda rápida y administración simple.',
        solution: 'Entregué un dashboard full-stack con componentes modulares, integración API, flujo de citas y operaciones seguras por rol.',
        impact: ['Centralización de expedientes de mascotas y clientes', 'Agendamiento e historial más ágiles', 'Flujo de datos más limpio entre recepción y doctores'],
        tags: ['React', 'MongoDB', 'Tailwind']
      },
      {
        id: 'b2b-maui',
        title: 'App B2B de Ventas y Operaciones',
        type: 'Aplicación Móvil',
        category: 'mobile',
        summary: 'Aplicación cross-platform con .NET MAUI conectada a APIs ASP.NET 9 bajo Onion Architecture.',
        month: '2024',
        client: 'Cliente de MDSOFT',
        stack: ['.NET MAUI', 'ASP.NET 9', 'C#', 'SQL Server', 'Onion Architecture'],
        challenge: 'Los equipos comerciales y operativos necesitaban flujos móviles confiables con acceso seguro a APIs y sincronización de datos.',
        solution: 'Implementé módulos móviles robustos, autenticación segura e integraciones API manteniendo arquitectura limpia y mantenibilidad.',
        impact: ['Mayor productividad en campo', 'Menos errores en reportes manuales', 'Mejor confiabilidad entre app y backend'],
        tags: ['.NET MAUI', 'ASP.NET', 'B2B']
      },
      {
        id: 'erp-modernization',
        title: 'Modernización de ERP Legacy',
        type: 'Programa de Modernización',
        category: 'legacy',
        summary: 'Refactor incremental y migración de módulos ERP hacia arquitectura limpia modular y mejor UX.',
        month: '2025',
        client: 'Sistemas Empresariales Internos',
        stack: ['C#', '.NET', 'SQL Server', 'Clean Architecture', 'Angular'],
        challenge: 'El ERP legacy tenía alto acoplamiento, mantenimiento difícil y ciclos lentos para nuevas necesidades de negocio.',
        solution: 'Lideré refactors por módulos, definí fronteras más limpias y mejoré colaboración frontend/backend sin detener operación.',
        impact: ['Reducción de deuda técnica crítica', 'Ciclos más rápidos de entrega por módulo', 'Arquitectura más mantenible para escalar'],
        tags: ['Refactor', 'ERP', 'Arquitectura']
      },
      {
        id: 'desktop-operations',
        title: 'Suite Desktop para Operaciones Internas',
        type: 'Aplicación Desktop',
        category: 'desktop',
        summary: 'Flujos desktop para control operativo, reportes y procesamiento documental en entornos empresariales.',
        month: '2022 - 2024',
        client: 'Equipos de Operaciones',
        stack: ['WinForms', 'WPF', 'C#', 'SQL Server'],
        challenge: 'Los equipos dependían de herramientas manuales dispersas para procesos diarios, generando retrasos e inconsistencias.',
        solution: 'Desarrollé y mantuve módulos desktop con reglas de negocio, componentes reutilizables y automatización de procesos.',
        impact: ['Estandarización de flujos internos', 'Mayor consistencia en reportes', 'Menor carga manual repetitiva'],
        tags: ['Desktop', 'WinForms', 'Automatización']
      },
      {
        id: 'enterprise-apis',
        title: 'Ecosistema de APIs Empresariales',
        type: 'Plataforma de APIs',
        category: 'api',
        summary: 'APIs backend para clientes móviles y web con validación segura, integración y límites escalables.',
        month: '2024 - Actualidad',
        client: 'IB Systems',
        stack: ['ASP.NET Core', 'C#', 'SQL Server', 'Postman', 'Azure DevOps'],
        challenge: 'Múltiples clientes requerían APIs confiables, seguras y con contratos consistentes para nuevos módulos.',
        solution: 'Diseñé y optimicé módulos API con arquitectura en capas, validaciones y flujo de entrega alineado a equipos ágiles.',
        impact: ['Integraciones más estables entre aplicaciones', 'Mayor mantenibilidad y testabilidad', 'Más confianza en despliegues productivos'],
        tags: ['API', 'ASP.NET Core', 'SQL Server']
      },
      {
        id: 'xamarin-enhancements',
        title: 'Mejoras en Apps Legacy con Xamarin',
        type: 'Mantenimiento Móvil y Refactor',
        category: 'legacy',
        summary: 'Expansión funcional y mejoras técnicas para aplicaciones Xamarin en producción.',
        month: '2022 - 2023',
        client: 'Proyectos Cliente MDSOFT',
        stack: ['Xamarin', 'C#', 'XML', 'PDF tooling'],
        challenge: 'Las apps legacy requerían nuevas funciones de negocio manteniendo compatibilidad con procesos existentes.',
        solution: 'Implementé generación PDF, formato de impresión, automatización XML y mejoras de rendimiento estabilizando código legado.',
        impact: ['Extensión de vida útil del producto', 'Continuidad operativa para usuarios activos', 'Transición gradual habilitada hacia nuevos stacks'],
        tags: ['Xamarin', 'Legacy', 'Optimización']
      },
      {
        id: 'song-manager',
        title: 'Song Manager',
        type: 'Utilidad Desktop + Web',
        category: 'desktop',
        summary: 'Gestor musical para organizar canciones, metadatos, playlists y búsqueda rápida del catálogo.',
        month: '2023 - 2024',
        client: 'Construcción Personal / Producto',
        stack: ['C#', 'SQLite', 'React', 'TypeScript'],
        challenge: 'Gestionar bibliotecas grandes con metadatos inconsistentes y duplicados consumía demasiado tiempo.',
        solution: 'Construí una herramienta de administración con búsqueda, agrupación, edición de metadatos e indexación limpia.',
        impact: ['Organización más rápida del catálogo musical', 'Mejor consistencia de metadatos', 'Menos duplicados y pistas mal clasificadas'],
        tags: ['Song Manager', 'Desktop', 'Productividad']
      },
      {
        id: 'ai-integration',
        title: 'Integraciones con IA',
        type: 'Set de Funcionalidades con IA',
        category: 'api',
        summary: 'Integración de flujos asistidos por IA para automatizar tareas repetitivas y procesos de decisión.',
        month: '2025',
        client: 'Iniciativas Internas de Producto',
        stack: ['ASP.NET Core', 'TypeScript', 'Prompt Engineering', 'REST APIs'],
        challenge: 'Los equipos requerían acelerar operaciones repetitivas y mejorar decisiones asistidas dentro de módulos clave.',
        solution: 'Implementé flujos conectados con IA mediante orquestación de prompts, validaciones y endpoints backend seguros.',
        impact: ['Reducción del tiempo de procesamiento manual', 'Mayor productividad operativa', 'Escalabilidad en flujos asistidos por IA'],
        tags: ['IA', 'Integración', 'Automatización']
      },
      {
        id: 'spend-flow',
        title: 'Spend Flow',
        type: 'App de Finanzas y Presupuesto',
        category: 'web',
        summary: 'Solución para gestionar gastos y presupuestos, con control de flujo de dinero y análisis por categorías.',
        month: '2024',
        client: 'Concepto de Producto',
        stack: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
        challenge: 'Los usuarios necesitaban una forma clara y sencilla de controlar gastos personales y de negocio.',
        solution: 'Diseñé un dashboard financiero con gestión de transacciones, reglas de presupuesto y métricas de consumo.',
        impact: ['Mayor visibilidad del gasto mensual', 'Decisiones financieras más rápidas', 'Mejor control de presupuesto por categorías'],
        tags: ['Fintech', 'Dashboard', 'Presupuesto']
      },
      {
        id: 'owney-beauty',
        title: 'Owney Beauty',
        type: 'Plataforma de Reservas Beauty',
        category: 'web',
        summary: 'Plataforma de reservas y gestión de clientes para servicios de belleza y seguimiento comercial.',
        month: '2024',
        client: 'Owney Beauty',
        stack: ['React', 'JavaScript', 'Tailwind CSS', 'Node.js'],
        challenge: 'El negocio necesitaba digitalizar reservas, visibilidad de servicios y seguimiento de clientes.',
        solution: 'Construí una experiencia responsive de reservas con catálogo de servicios, agenda y herramientas de seguimiento.',
        impact: ['Calendario de citas mejor organizado', 'Mejor flujo de comunicación con clientes', 'Reducción de carga manual en agendamiento'],
        tags: ['Beauty', 'Reservas', 'Web App']
      }
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

function triggerDualCvDownload(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();

  const downloadUrls = ['/api/cv/download?lang=en', '/api/cv/download?lang=es'];

  downloadUrls.forEach((url, index) => {
    window.setTimeout(() => {
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }, index * 180);
  });
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
                <a href="/api/cv/download" onClick={triggerDualCvDownload} className="link-underline cv-download-trigger">
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
                <a className="link-underline cv-download-trigger" href="/api/cv/download" onClick={triggerDualCvDownload}>
                  {data.downloadCta} <i className="bi bi-download" />
                </a>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="resume-item resume-card" data-aos="fade-left" data-aos-delay="180">
              <h3 className="resume-title"><i className="bi bi-stars" /> {data.skillsTitle}</h3>
              {data.highlightedSkills.map((skill) => (
                <div key={skill.name} className="skill-item">
                  <h4>{skill.name} — {skill.level}%</h4>
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

function ServicesPage({ lang }: { lang: Lang }) {
  const data = servicesContent[lang];
  const [activeService, setActiveService] = useState<ServiceItem | null>(null);

  useEffect(() => {
    if (!activeService) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveService(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [activeService]);

  return (
    <section id="services" className="services section">
      <div className="container section-title" data-aos="fade-up">
        <h2>{data.title}</h2>
        <p>{data.subtitle}</p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row justify-content-center g-4 g-lg-5">
          {data.items.map((service, index) => (
            <div
              key={service.id}
              className="col-md-6"
              data-aos={index % 2 === 0 ? 'fade-right' : 'fade-left'}
              data-aos-delay={100 + Math.floor(index / 2) * 100}
            >
              <div className="service-item">
                <div className="service-icon">
                  <i className={`bi ${service.icon}`} />
                </div>
                <div className="service-content">
                  <h3>{service.title}</h3>
                  <p>{service.summary}</p>
                  <button type="button" className="service-link service-modal-trigger" onClick={() => setActiveService(service)}>
                    <span>{data.learnMore}</span>
                    <i className="bi bi-arrow-right" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeService ? (
        <div className="service-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="service-modal-title" onClick={() => setActiveService(null)}>
          <div className="service-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="service-modal-close" aria-label="Close" onClick={() => setActiveService(null)}>
              <i className="bi bi-x-lg" />
            </button>

            <div className="service-modal-media">
              <img src="/img/profile/eh-details.webp" alt="Elvis Hernandez details" loading="lazy" />
            </div>

            <div className="service-modal-content">
              <div className="service-meta">
                <span className="service-category">{activeService.category}</span>
                <span className="reading-time">{activeService.readTime}</span>
              </div>
              <h3 id="service-modal-title">{activeService.title}</h3>
              <p>{activeService.description}</p>
              <ul>
                {activeService.benefits.map((benefit) => (
                  <li key={benefit}>
                    <i className="bi bi-check2-circle" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="btn btn-consultation">
                <span>{data.modalCta}</span>
                <i className="bi bi-arrow-right" />
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ProjectPreviewSvg({ project }: { project: PortfolioProject }) {
  const presets: Record<string, { icon: string; motif: string; accent: string }> = {
    'veterinary-web': { icon: '🐾', motif: 'Pet records • Appointments • Medical history', accent: '#22c55e' },
    'song-manager': { icon: '🎵', motif: 'Tracks • Playlists • Metadata manager', accent: '#a855f7' },
    'ai-integration': { icon: '🤖', motif: 'Prompts • AI workflows • Smart automation', accent: '#06b6d4' },
    'spend-flow': { icon: '💸', motif: 'Budgeting • Expenses • Cash-flow control', accent: '#f59e0b' },
    'owney-beauty': { icon: '💄', motif: 'Bookings • Catalog • Client loyalty', accent: '#ec4899' },
    'b2b-maui': { icon: '📱', motif: 'Field sales • Sync • Business operations', accent: '#3b82f6' },
    'erp-modernization': { icon: '🧩', motif: 'Modular ERP • Refactor • Migration', accent: '#14b8a6' },
    'desktop-operations': { icon: '🖥️', motif: 'Internal workflows • Reporting suite', accent: '#6366f1' },
    'enterprise-apis': { icon: '🔌', motif: 'Secure APIs • Integrations • Contracts', accent: '#0ea5e9' },
    'xamarin-enhancements': { icon: '🛠️', motif: 'Legacy support • PDF • XML automation', accent: '#f97316' }
  };

  const preset = presets[project.id] ?? { icon: '🚀', motif: project.type, accent: '#1387c1' };
  const bg = '#0f1b22';

  return (
    <svg viewBox="0 0 640 360" role="img" aria-label={project.title} className="portfolio-svg-preview" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`g-${project.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={bg} />
          <stop offset="100%" stopColor="#17303d" />
        </linearGradient>
      </defs>
      <rect width="640" height="360" rx="22" fill={`url(#g-${project.id})`} />
      <circle cx="548" cy="90" r="78" fill={`${preset.accent}33`} />
      <circle cx="102" cy="290" r="92" fill={`${preset.accent}22`} />
      <rect x="32" y="30" width="576" height="50" rx="12" fill="rgba(231,242,247,0.10)" />
      <text x="54" y="63" fill="#e7f2f7" fontSize="22" fontFamily="Poppins, sans-serif">{preset.icon} {project.title}</text>
      <rect x="44" y="96" width="380" height="16" rx="7" fill="rgba(231,242,247,0.24)" />
      <rect x="44" y="121" width="330" height="12" rx="6" fill="rgba(231,242,247,0.14)" />
      <text x="48" y="107" fill="#e7f2f7" fontSize="11" fontFamily="Poppins, sans-serif">{project.type}</text>
      <text x="48" y="129" fill={preset.accent} fontSize="11" fontFamily="Poppins, sans-serif">{preset.motif}</text>

      <rect x="44" y="160" width="168" height="136" rx="12" fill={`${preset.accent}24`} stroke={`${preset.accent}77`} />
      <rect x="236" y="160" width="168" height="136" rx="12" fill="rgba(231,242,247,0.08)" stroke="rgba(231,242,247,0.20)" />
      <rect x="428" y="160" width="168" height="136" rx="12" fill="rgba(231,242,247,0.06)" stroke="rgba(231,242,247,0.16)" />

      <text x="58" y="182" fill="#e7f2f7" fontSize="11" fontFamily="Poppins, sans-serif">MAIN FLOW</text>
      <text x="250" y="182" fill="#e7f2f7" fontSize="11" fontFamily="Poppins, sans-serif">LOGIC</text>
      <text x="440" y="182" fill="#e7f2f7" fontSize="11" fontFamily="Poppins, sans-serif">OUTPUT</text>

      <rect x="58" y="194" width="140" height="10" rx="5" fill="rgba(231,242,247,0.2)" />
      <rect x="58" y="211" width="116" height="10" rx="5" fill="rgba(231,242,247,0.14)" />
      <rect x="58" y="228" width="132" height="10" rx="5" fill="rgba(231,242,247,0.14)" />

      <circle cx="320" cy="228" r="26" fill={`${preset.accent}55`} />
      <text x="312" y="234" fill="#fff" fontSize="14" fontFamily="Poppins, sans-serif">SYS</text>

      <rect x="442" y="206" width="140" height="58" rx="10" fill={`${preset.accent}33`} />
      <text x="452" y="240" fill="#e7f2f7" fontSize="12" fontFamily="Poppins, sans-serif">{project.stack.slice(0, 2).join(' + ')}</text>

      <text x="48" y="336" fill={preset.accent} fontSize="14" fontFamily="Poppins, sans-serif">{project.tags.join(' • ')}</text>
    </svg>
  );
}

function PortfolioPage({ lang }: { lang: Lang }) {
  const data = portfolioContent[lang];
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>('all');
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(null);

  const visibleProjects = useMemo(
    () =>
      activeCategory === 'all' ? data.projects : data.projects.filter((project) => project.category === activeCategory),
    [activeCategory, data.projects]
  );

  const activeProject = activeProjectIndex !== null ? visibleProjects[activeProjectIndex] : null;

  useEffect(() => {
    if (!activeProject) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveProjectIndex(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onEscape);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onEscape);
    };
  }, [activeProject]);

  const categoryOrder: PortfolioCategory[] = ['all', 'web', 'mobile', 'desktop', 'api', 'legacy'];

  return (
    <section id="portfolio" className="portfolio section">
      <div className="container section-title" data-aos="fade-up">
        <h2>{data.title}</h2>
        <p>{data.subtitle}</p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <ul className="portfolio-filters" data-aos="fade-up" data-aos-delay="200">
          {categoryOrder.map((category) => (
            <li
              key={category}
              className={activeCategory === category ? 'filter-active' : ''}
              onClick={() => {
                setActiveCategory(category);
                setActiveProjectIndex(null);
              }}
            >
              {data.categories[category]}
            </li>
          ))}
        </ul>

        <div className="row gy-4" data-aos="fade-up" data-aos-delay="300">
          {visibleProjects.map((project, index) => (
            <div key={project.id} className="col-lg-4 col-md-6 portfolio-item">
              <div className="portfolio-card">
                <div className="portfolio-img">
                  <ProjectPreviewSvg project={project} />
                  <div className="portfolio-overlay">
                    <button type="button" className="portfolio-overlay-button" onClick={() => setActiveProjectIndex(index)} aria-label={data.viewProject}>
                      <i className="bi bi-eye" />
                    </button>
                  </div>
                </div>
                <div className="portfolio-info">
                  <h4>{project.title}</h4>
                  <p>{project.summary}</p>
                  <div className="portfolio-tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5" data-aos="fade-up" data-aos-delay="400">
          <button type="button" className="btn btn-primary" onClick={() => setActiveCategory('all')}>
            {data.viewAll}
          </button>
        </div>
      </div>

      {activeProject ? (
        <div className="portfolio-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="portfolio-modal-title" onClick={() => setActiveProjectIndex(null)}>
          <article className="portfolio-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="portfolio-modal-close" onClick={() => setActiveProjectIndex(null)} aria-label="Close">
              <i className="bi bi-x-lg" />
            </button>

            <div className="portfolio-details-media">
              <div className="main-image">
                <ProjectPreviewSvg project={activeProject} />
              </div>
              <div className="tech-stack-badges">
                {activeProject.stack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </div>

            <div className="portfolio-details-content">
              <div className="project-meta">
                <div className="badge-wrapper">
                  <span className="project-badge">{activeProject.type}</span>
                </div>
                <div className="date-client">
                  <div className="meta-item">
                    <i className="bi bi-calendar-check" />
                    <span>{activeProject.month}</span>
                  </div>
                  <div className="meta-item">
                    <i className="bi bi-buildings" />
                    <span>{activeProject.client}</span>
                  </div>
                </div>
              </div>

              <h2 className="project-title" id="portfolio-modal-title">{activeProject.title}</h2>

              {activeProject.url ? (
                <div className="project-website">
                  <i className="bi bi-link-45deg" />
                  <a href={activeProject.url} target="_blank" rel="noreferrer">{activeProject.url}</a>
                </div>
              ) : null}

              <div className="project-overview">
                <p className="lead">{activeProject.summary}</p>
                <div className="accordion project-accordion">
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button className="accordion-button" type="button">{data.overview}</button>
                    </h3>
                    <div className="accordion-body">
                      <p>{activeProject.summary}</p>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button className="accordion-button" type="button">{data.challengeTitle}</button>
                    </h3>
                    <div className="accordion-body">
                      <p>{activeProject.challenge}</p>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button className="accordion-button" type="button">{data.solutionTitle}</button>
                    </h3>
                    <div className="accordion-body">
                      <p>{activeProject.solution}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="project-features">
                <h3><i className="bi bi-stars" /> {data.featuresTitle}</h3>
                <ul className="feature-list">
                  {activeProject.impact.map((point) => (
                    <li key={point}><i className="bi bi-check2-circle" /> {point}</li>
                  ))}
                </ul>
              </div>

              <div className="cta-buttons">
                <button
                  type="button"
                  className="btn-next-project"
                  onClick={() => setActiveProjectIndex((current) => (current === null ? 0 : (current + 1) % visibleProjects.length))}
                >
                  {data.nextProject} <i className="bi bi-arrow-right" />
                </button>
              </div>
            </div>
          </article>
        </div>
      ) : null}
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
      return <ServicesPage lang={lang} />;
    case '/portfolio':
      return <PortfolioPage lang={lang} />;
    case '/contact':
      return <ContactPage lang={lang} />;
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
        onClick={triggerDualCvDownload}
        className={`floating-cv-download ${showFloatingDownload ? 'active' : ''}`}
        aria-label="Download CV"
      >
        <i className="bi bi-file-earmark-arrow-down" />
      </a>
      <Footer lang={lang} />
    </>
  );
}
