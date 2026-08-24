import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Lang, ServiceItem } from '../../domain/portfolio.types';
import { servicesContent } from '../../content/portfolio.content';
import { Link } from '../../shared/navigation/navigation';

export function ServicesPage({ lang }: { lang: Lang }) {
  const data = servicesContent[lang];
  const [activeService, setActiveService] = useState<ServiceItem | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const closeModal = () => {
    if (isClosing) return;
    setIsClosing(true);
    window.setTimeout(() => {
      setActiveService(null);
      setIsClosing(false);
    }, 280);
  };

  useEffect(() => {
    if (!activeService) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
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

      {activeService ? createPortal(
        <div className="services service-modal-portal">
          <div className={`service-modal-backdrop ${isClosing ? 'is-closing' : ''}`} role="dialog" aria-modal="true" aria-labelledby="service-modal-title" onClick={closeModal}>
            <div className="service-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="service-modal-close" aria-label="Close" onClick={closeModal}>
              <i className="bi bi-x-lg" />
            </button>

            <div className="service-modal-media">
              <img src={`${import.meta.env.BASE_URL}img/profile/eh-details.webp`} alt="Elvis Hernandez details" loading="lazy" />
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
        </div>, document.body
      ) : null}
    </section>
  );
}
