import { useEffect, useState } from 'react';
import type { Lang } from '../../domain/portfolio.types';
import { copy, rolesByLang } from '../../content/portfolio.content';
import { downloadCv, Link } from '../../shared/navigation/navigation';

export function HomePage({ lang }: { lang: Lang }) {
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
                <a href={`/api/cv/download?lang=${lang}`} onClick={(event) => downloadCv(event, lang)} className="link-underline cv-download-trigger">
                  {text.ctaDownloadCv} <i className="bi bi-download" />
                </a>
              </div>
              <div className="social-links" data-aos="fade-up" data-aos-delay="600">
                <a href="https://x.com/elvish24" target="_blank" rel="noreferrer" aria-label="X">
                  <i className="bi bi-twitter-x" />
                </a>
                <a href="https://linkedin.com/in/elvis-hernandez-075496285" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <i className="bi bi-linkedin" />
                </a>
                <a href="https://github.com/Elvis2025" target="_blank" rel="noreferrer" aria-label="GitHub">
                  <i className="bi bi-github" />
                </a>
                <a href="https://www.instagram.com/elvis_h24/" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <i className="bi bi-instagram" />
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-6 order-1 order-lg-2">
            <div className="hero-image" data-aos="zoom-in" data-aos-delay="300">
              <div className="image-wrapper">
                <img src="/img/profile/elvis-hernandez.webp" alt="Elvis Hernandez" className="img-fluid" width="2272" height="1856" fetchPriority="high" />
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
