import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Lang, PortfolioCategory } from '../../domain/portfolio.types';
import { portfolioContent } from '../../content/portfolio.content';
import { ProjectPreviewSvg } from './ProjectPreviewSvg';

export function PortfolioPage({ lang }: { lang: Lang }) {
  const data = portfolioContent[lang];
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>('all');
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(null);
  const [openPanel, setOpenPanel] = useState<'overview' | 'challenge' | 'solution' | null>('overview');
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const visibleProjects = useMemo(
    () =>
      activeCategory === 'all' ? data.projects : data.projects.filter((project) => project.category === activeCategory),
    [activeCategory, data.projects]
  );

  const activeProject = activeProjectIndex !== null ? visibleProjects[activeProjectIndex] : null;

  const closeModal = () => {
    if (isClosing) return;
    setIsClosing(true);
    window.setTimeout(() => {
      setActiveProjectIndex(null);
      setIsClosing(false);
      setOpenPanel('overview');
    }, 280);
  };

  useEffect(() => {
    if (!activeProject) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
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
            <li key={category}>
              <button
                type="button"
                className={activeCategory === category ? 'filter-active' : ''}
                aria-pressed={activeCategory === category}
                onClick={() => {
                  setActiveCategory(category);
                  setActiveProjectIndex(null);
                }}
              >
                {data.categories[category]}
              </button>
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

      {activeProject ? createPortal(
        <div className="portfolio portfolio-modal-portal">
        <div className={`portfolio-modal-backdrop ${isClosing ? 'is-closing' : ''}`} role="dialog" aria-modal="true" aria-labelledby="portfolio-modal-title" onClick={closeModal}>
          <article ref={modalRef} className="portfolio-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="portfolio-modal-close" onClick={closeModal} aria-label="Close">
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

            <div ref={modalContentRef} className="portfolio-details-content">
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
                  <div className={`accordion-item ${openPanel === 'overview' ? 'is-open' : ''}`}>
                    <h3 className="accordion-header">
                      <button className="accordion-button" type="button" aria-expanded={openPanel === 'overview'} aria-controls="project-panel-overview" onClick={() => setOpenPanel((current) => current === 'overview' ? null : 'overview')}>
                        <span className="accordion-icon"><i className="bi bi-compass" /></span>
                        <span>{data.overview}</span>
                        <i className="bi bi-chevron-down accordion-chevron" />
                      </button>
                    </h3>
                    <div id="project-panel-overview" className="accordion-panel" aria-hidden={openPanel !== 'overview'}>
                      <div className="accordion-body"><p>{activeProject.summary}</p></div>
                    </div>
                  </div>
                  <div className={`accordion-item ${openPanel === 'challenge' ? 'is-open' : ''}`}>
                    <h3 className="accordion-header">
                      <button className="accordion-button" type="button" aria-expanded={openPanel === 'challenge'} aria-controls="project-panel-challenge" onClick={() => setOpenPanel((current) => current === 'challenge' ? null : 'challenge')}>
                        <span className="accordion-icon"><i className="bi bi-lightning-charge" /></span>
                        <span>{data.challengeTitle}</span>
                        <i className="bi bi-chevron-down accordion-chevron" />
                      </button>
                    </h3>
                    <div id="project-panel-challenge" className="accordion-panel" aria-hidden={openPanel !== 'challenge'}>
                      <div className="accordion-body"><p>{activeProject.challenge}</p></div>
                    </div>
                  </div>
                  <div className={`accordion-item ${openPanel === 'solution' ? 'is-open' : ''}`}>
                    <h3 className="accordion-header">
                      <button className="accordion-button" type="button" aria-expanded={openPanel === 'solution'} aria-controls="project-panel-solution" onClick={() => setOpenPanel((current) => current === 'solution' ? null : 'solution')}>
                        <span className="accordion-icon"><i className="bi bi-stars" /></span>
                        <span>{data.solutionTitle}</span>
                        <i className="bi bi-chevron-down accordion-chevron" />
                      </button>
                    </h3>
                    <div id="project-panel-solution" className="accordion-panel" aria-hidden={openPanel !== 'solution'}>
                      <div className="accordion-body"><p>{activeProject.solution}</p></div>
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
                  onClick={() => {
                    setOpenPanel('overview');
                    setActiveProjectIndex((current) => (current === null ? 0 : (current + 1) % visibleProjects.length));
                    window.requestAnimationFrame(() => {
                      modalRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                      modalContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                    });
                  }}
                >
                  {data.nextProject} <i className="bi bi-arrow-right" />
                </button>
              </div>
            </div>
          </article>
        </div>
        </div>, document.body
      ) : null}
    </section>
  );
}
