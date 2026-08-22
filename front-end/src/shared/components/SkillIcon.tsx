import type { Lang, SkillCard, SkillCategory } from '../../domain/portfolio.types';

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

export function renderSkillIcon(icon: string, label: string, variant: 'default' | 'large' = 'default') {
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

export function getSkillDeepDescription(skill: SkillCard, lang: Lang) {
  return `${skill.description} ${skillDetailByCategory[lang][skill.category]}`;
}
