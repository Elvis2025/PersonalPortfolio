import { useEffect, useState } from 'react';
import type { Lang, SkillCategory } from '../../domain/portfolio.types';
import { copy, skillsCatalog } from '../../content/portfolio.content';
import { getSkillDeepDescription, renderSkillIcon } from '../../shared/components/SkillIcon';

export function SkillsSection({ lang }: { lang: Lang }) {
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
          {filteredSkills.map((skill) => (
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
