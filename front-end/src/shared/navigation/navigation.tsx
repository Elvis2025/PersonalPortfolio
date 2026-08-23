import type { MouseEvent, ReactNode } from 'react';

export function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function normalizePathname(pathname: string) {
  const [pathOnly] = pathname.split(/[?#]/);
  const trimmed = pathOnly.length > 1 ? pathOnly.replace(/\/+$/, '') : pathOnly;
  return trimmed || '/';
}

export function Link({ to, children, className, onNavigate }: { to: string; children: ReactNode; className?: string; onNavigate?: () => void }) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate?.();
    navigateTo(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

export function downloadCv(event: MouseEvent<HTMLAnchorElement>, lang: 'en' | 'es') {
  event.preventDefault();
  window.location.assign(`/api/cv/download?lang=${lang}`);
}
