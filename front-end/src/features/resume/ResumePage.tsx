import type { Lang } from '../../domain/portfolio.types';
import { resumeContent } from '../../content/portfolio.content';
import { downloadCv, Link } from '../../shared/navigation/navigation';

export function ResumePage({ lang }: { lang: Lang }) {
  const data = resumeContent[lang];

  return (
    <section id="resume" className="resume section">
      <div className="container section-title" data-aos="fade-up">
        <h2>{data.title}</h2>
        <p>{data.subtitle}</p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="120">
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <div className="resume-item resume-card" data-aos="fade-right" data-aos-delay="150">
              <h3 className="resume-title"><i className="bi bi-person-badge" /> {data.profileTitle}</h3>
              <div className="resume-content">
                <article>
                  <h4>Elvis Jesús Hernández Suárez</h4>
                  <p>{data.profileSummary}</p>
                  <ul className="resume-contact-list">
                    <li>
                      <i className="bi bi-geo-alt" aria-hidden="true" />
                      <span>{data.location}</span>
                    </li>
                    <li>
                      <i className="bi bi-linkedin" aria-hidden="true" />
                      <span className="contact-link-stack">
                        <a href={data.linkedin.url} target="_blank" rel="noreferrer">
                          {data.linkedin.label}
                        </a>
                        <small>{data.linkedin.displayUrl}</small>
                      </span>
                    </li>
                    <li>
                      <i className="bi bi-envelope" aria-hidden="true" />
                      <span className="contact-link-stack">
                        <a href={`mailto:${data.email.address}`}>{data.email.label}</a>
                        <small>{data.email.address}</small>
                      </span>
                    </li>
                    <li>
                      <i className="bi bi-whatsapp" aria-hidden="true" />
                      <span className="flag-do" aria-label="República Dominicana">🇩🇴</span>
                      <span>{data.phone}</span>
                    </li>
                    <li>
                      <i className="bi bi-github" aria-hidden="true" />
                      <span className="contact-link-stack">
                        <a href={data.github.url} target="_blank" rel="noreferrer">
                          {data.github.label}
                        </a>
                        <small>{data.github.displayUrl}</small>
                      </span>
                    </li>
                  </ul>
                </article>
              </div>
              <div className="resume-actions">
                <Link to="/contact" className="btn btn-ghost">
                  <i className="bi bi-chat-dots" /> {data.contactCta} <i className="bi bi-arrow-up-right" />
                </Link>
                <a className="link-underline cv-download-trigger" href={`/api/cv/download?lang=${lang}`} onClick={(event) => downloadCv(event, lang)}>
                  {data.downloadCta} <i className="bi bi-download" />
                </a>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="resume-item resume-card" data-aos="fade-left" data-aos-delay="180">
              <h3 className="resume-title"><i className="bi bi-stars" /> {data.skillsTitle}</h3>
              {data.highlightedSkills.map((skill) => (
                <div key={skill.name} className="skill-item">
                  <h4>{skill.name} — {skill.level}%</h4>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      aria-valuenow={skill.level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-12">
            <div className="resume-item resume-card" data-aos="fade-up" data-aos-delay="210">
              <h3 className="resume-title"><i className="bi bi-briefcase" /> {data.experienceTitle}</h3>
              <div className="resume-content">
                {data.experience.map((job) => (
                  <article key={`${job.company}-${job.role}`}>
                    <h4><i className="bi bi-person-workspace" /> {job.role}</h4>
                    <h5><i className="bi bi-calendar3" /> {job.period}</h5>
                    <p className="company"><i className="bi bi-building" /> {job.company}</p>
                    <ul>
                      {job.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="resume-item resume-card" data-aos="fade-up" data-aos-delay="250">
              <h3 className="resume-title"><i className="bi bi-mortarboard" /> {data.educationTitle}</h3>
              <div className="resume-content">
                {data.education.map((item) => (
                  <article key={item.institution}>
                    <h4><i className="bi bi-award" /> {item.degree}</h4>
                    <h5><i className="bi bi-calendar3" /> {item.period}</h5>
                    <p className="institution"><i className="bi bi-bank" /> {item.institution}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
