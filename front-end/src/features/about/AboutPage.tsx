import type { Lang } from '../../domain/portfolio.types';
import { copy } from '../../content/portfolio.content';
import { Link } from '../../shared/navigation/navigation';
import { SkillsSection } from './SkillsSection';

export function AboutPage({ lang }: { lang: Lang }) {
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
