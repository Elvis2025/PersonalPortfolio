import type { MouseEvent, ReactNode } from 'react';

const basePath = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL.replace(/\/$/, '');
const toBrowserPath = (path: string) => `${basePath}${path === '/' ? '/' : path}`;

export function navigateTo(path: string) {
  window.history.pushState({}, '', toBrowserPath(path));
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function normalizePathname(pathname: string) {
  const [pathOnly] = pathname.split(/[?#]/);
  const appPath = basePath && (pathOnly === basePath || pathOnly.startsWith(`${basePath}/`))
    ? pathOnly.slice(basePath.length) || '/'
    : pathOnly;
  const trimmed = appPath.length > 1 ? appPath.replace(/\/+$/, '') : appPath;
  return trimmed || '/';
}

export function Link({ to, children, className, onNavigate }: { to: string; children: ReactNode; className?: string; onNavigate?: () => void }) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate?.();
    navigateTo(to);
  };

  return (
    <a href={toBrowserPath(to)} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

export function downloadCv(event: MouseEvent<HTMLAnchorElement>, lang: 'en' | 'es') {
  event.preventDefault();
  window.location.assign(`/api/cv/download?lang=${lang}`);
}
