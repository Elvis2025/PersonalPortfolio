import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import type { Lang, NavItem } from '../domain/portfolio.types';
import { copy } from '../content/portfolio.content';
import { AboutPage } from '../features/about/AboutPage';
import { ContactPage } from '../features/contact/ContactPage';
import { HomePage } from '../features/home/HomePage';
import { PortfolioPage } from '../features/portfolio/PortfolioPage';
import { ResumePage } from '../features/resume/ResumePage';
import { ServicesPage } from '../features/services/ServicesPage';
import { Footer } from '../shared/layout/Footer';
import { Header } from '../shared/layout/Header';
import { WhatsAppFloat } from '../shared/components/WhatsAppFloat';
import { ExperienceLayer } from '../shared/components/ExperienceLayer';
import { downloadCv, normalizePathname } from '../shared/navigation/navigation';

function renderPage(pathname: string, lang: Lang) {
  const normalizedPath = normalizePathname(pathname);
  switch (normalizedPath) {
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
  const [pathname, setPathname] = useState(normalizePathname(window.location.pathname));
  const [lang, setLang] = useState<Lang>('en');
  const [showFloatingDownload, setShowFloatingDownload] = useState(true);
  const [showScrollTopFab, setShowScrollTopFab] = useState(false);

  const navItems = useMemo<NavItem[]>(() => {
    const labels = copy[lang].nav;
    return [
      { label: labels[0], to: '/', icon: 'bi-house-door' },
      { label: labels[1], to: '/about', icon: 'bi-person' },
      { label: labels[2], to: '/resume', icon: 'bi-file-earmark-person' },
      { label: labels[3], to: '/services', icon: 'bi-grid' },
      { label: labels[4], to: '/portfolio', icon: 'bi-code-square' },
      { label: labels[5], to: '/contact', icon: 'bi-send' }
    ];
  }, [lang]);

  useLayoutEffect(() => {
    const onPopState = () => setPathname(normalizePathname(window.location.pathname));
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    if (normalizePathname(window.location.pathname) === '/') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
    window.addEventListener('popstate', onPopState);
    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  useEffect(() => {
    const onScrollState = () => {
      document.body.classList.toggle('scrolled', window.scrollY > 8);
    };

    onScrollState();
    window.addEventListener('scroll', onScrollState, { passive: true });
    return () => window.removeEventListener('scroll', onScrollState);
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-aos]'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          element.classList.add('aos-animate');
          observer.unobserve(element);
        });
      },
      { threshold: 0.04, rootMargin: '0px 0px 10% 0px' }
    );

    elements.forEach((element) => {
      element.classList.remove('aos-animate');
      const bounds = element.getBoundingClientRect();
      if (bounds.top < window.innerHeight * 0.94 && bounds.bottom > 0) {
        element.classList.add('aos-animate', 'aos-initial-visible');
      } else {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [pathname, lang]);

  useEffect(() => {
    // Selectores para botón de descarga integrado (ajústalos aquí si cambias el markup en páginas).
    const inlineDownloadSelector = '.cv-download-trigger, [data-download-cv], .btn-download-cv, #downloadCvButton';
    const downloadTriggers = Array.from(document.querySelectorAll<HTMLElement>(inlineDownloadSelector));
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

  useEffect(() => {
    // Umbral para mostrar el botón "ir arriba" (ajústalo aquí).
    const scrollThreshold = 200;
    const onScroll = () => {
      setShowScrollTopFab(window.scrollY > scrollThreshold);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  return (
    <>
      <ExperienceLayer />
      <Header
        pathname={pathname}
        navItems={navItems}
        langToggle={copy[lang].langToggle}
        onToggleLang={() => setLang((current) => (current === 'en' ? 'es' : 'en'))}
      />
      <main className="main">
        <div className="page-transition" key={`${pathname}-${lang}`}>{renderPage(pathname, lang)}</div>
      </main>
      <div className="fab-stack" aria-label="Global quick actions">
        {showScrollTopFab ? (
          <button
            type="button"
            className="fab fab--scroll-top"
            aria-label="Ir arriba"
            title="Ir arriba"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className="fab__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" focusable="false">
                <path
                  d="M12 18V8m0 0-4 4m4-4 4 4M5 6h14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        ) : null}
        {showFloatingDownload ? (
          <a
            href={`/api/cv/download?lang=${lang}`}
            onClick={(event) => downloadCv(event, lang)}
            className="floating-cv-download fab fab--cv active"
            aria-label="Download CV"
            title="Download CV"
          >
            <span className="fab__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" focusable="false">
                <path
                  d="M12 4v10m0 0-4-4m4 4 4-4M5 18h14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        ) : null}
        <WhatsAppFloat />
      </div>
      <Footer lang={lang} />
    </>
  );
}
