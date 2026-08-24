import { useEffect, useState } from 'react';
import type { NavItem } from '../../domain/portfolio.types';
import { Link } from '../navigation/navigation';

export function Header({ pathname, navItems, langToggle, onToggleLang }: { pathname: string; navItems: NavItem[]; langToggle: string; onToggleLang: () => void }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileNavOpen(false);
      }
    };

    document.body.classList.toggle('mobile-nav-active', isMobileNavOpen);
    document.addEventListener('keydown', onEsc);

    return () => {
      document.body.classList.remove('mobile-nav-active');
      document.removeEventListener('keydown', onEsc);
    };
  }, [isMobileNavOpen]);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  return (
    <header id="header" className="header d-flex align-items-center light-background sticky-top">
      <div className="container position-relative d-flex align-items-center justify-content-between">
        <nav
          id="navmenu"
          className={`navmenu ${isMobileNavOpen ? 'navmenu-open' : ''}`}
          aria-label="Main navigation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsMobileNavOpen(false);
            }
          }}
        >
          <ul className={isMobileNavOpen ? 'navmenu-list-open' : undefined}>
            {navItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={pathname === item.to ? 'active' : ''} onNavigate={() => setIsMobileNavOpen(false)}>
                  <i className={`nav-item-icon bi ${item.icon}`} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className={`mobile-nav-toggle d-md-none bi ${isMobileNavOpen ? 'bi-x' : 'bi-list'}`}
            aria-label="Toggle navigation"
            aria-controls="navmenu"
            aria-expanded={isMobileNavOpen}
            onClick={() => setIsMobileNavOpen((current) => !current)}
          />
        </nav>

        <div className="header-social-links">
          <button type="button" className="lang-toggle" onClick={onToggleLang} aria-label="Change language">
            {langToggle}
          </button>
          <a href="https://x.com/elvish24" target="_blank" rel="noreferrer" className="twitter" aria-label="X">
            <i className="bi bi-twitter-x" />
          </a>
          <a href="https://linkedin.com/in/elvis-hernandez-075496285" target="_blank" rel="noreferrer" className="linkedin" aria-label="LinkedIn">
            <i className="bi bi-linkedin" />
          </a>
          <a href="https://github.com/Elvis2025" target="_blank" rel="noreferrer" className="github" aria-label="GitHub">
            <i className="bi bi-github" />
          </a>
        </div>
      </div>
    </header>
  );
}
