import { useState } from 'react';
import type { FormEvent } from 'react';
import type { ContactFormData, Lang } from '../../domain/portfolio.types';
import { copy } from '../../content/portfolio.content';

export function ContactPage({ lang }: { lang: Lang }) {
  const text = copy[lang].contact;
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    company: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onChange = (field: keyof ContactFormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorMessage(text.errors.missingFields);
      setSuccessMessage('');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const payload = (await response.json().catch(() => null)) as { error?: string; message?: string; retryAfterSeconds?: number } | null;

      if (!response.ok) {
        if (response.status === 429 || payload?.error === 'TOO_MANY_REQUESTS') {
          const waitSuffix = payload?.retryAfterSeconds ? ` (${payload.retryAfterSeconds}s)` : '';
          throw new Error(`${text.errors.tooManyRequests}${waitSuffix}`);
        }

        if (response.status === 400 && (payload?.error === 'MISSING_REQUIRED_FIELDS' || payload?.error === 'INVALID_EMAIL_FORMAT')) {
          throw new Error(payload.error === 'INVALID_EMAIL_FORMAT' ? text.errors.invalidEmail : text.errors.missingFields);
        }

        if (response.status === 503 || payload?.error === 'CONTACT_SERVICE_UNAVAILABLE') {
          throw new Error(payload?.message ?? text.errors.serviceUnavailable);
        }

        if (response.status === 502 || payload?.error === 'EMAIL_DELIVERY_FAILED') {
          throw new Error(text.errors.deliveryFailed);
        }

        throw new Error(payload?.message ?? text.errors.generic);
      }

      setSuccessMessage(text.success);
      setFormData({ name: '', email: '', subject: '', message: '', company: '' });
    } catch (error) {
      const message = error instanceof Error ? error.message : text.errors.generic;
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="contact section">
      <div className="container section-title" data-aos="fade-up">
        <h2>{text.title}</h2>
        <p>{text.subtitle}</p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row g-4 g-lg-5">
          <div className="col-lg-5">
            <div className="info-box" data-aos="fade-up" data-aos-delay="200">
              <h3>{text.infoTitle}</h3>
              <p>{text.infoText}</p>

              <div className="info-item" data-aos="fade-up" data-aos-delay="300">
                <div className="icon-box"><i className="bi bi-geo-alt" /></div>
                <div className="content">
                  <h4>{text.locationLabel}</h4>
                  <p>{text.locationValue}</p>
                </div>
              </div>

              <div className="info-item" data-aos="fade-up" data-aos-delay="400">
                <div className="icon-box"><i className="bi bi-telephone" /></div>
                <div className="content">
                  <h4>{text.phoneLabel}</h4>
                  <p><a href={`tel:${text.phoneValue.replace(/[^+\d]/g, '')}`}>{text.phoneValue}</a></p>
                </div>
              </div>

              <div className="info-item" data-aos="fade-up" data-aos-delay="500">
                <div className="icon-box"><i className="bi bi-envelope" /></div>
                <div className="content">
                  <h4>{text.emailLabel}</h4>
                  <p><a href={`mailto:${text.emailValue}`}>{text.emailValue}</a></p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="contact-form" data-aos="fade-up" data-aos-delay="300">
              <h3>{text.formTitle}</h3>
              <p>{text.formText}</p>

              <form className="php-email-form" data-aos="fade-up" data-aos-delay="200" onSubmit={onSubmit}>
                <div className="row gy-4">
                  <div className="col-md-6">
                    <input type="text" name="name" className="form-control" placeholder={text.placeholders.name} required value={formData.name} onChange={(e) => onChange('name', e.target.value)} />
                  </div>

                  <div className="col-md-6">
                    <input type="email" className="form-control" name="email" placeholder={text.placeholders.email} required value={formData.email} onChange={(e) => onChange('email', e.target.value)} />
                  </div>

                  <div className="col-12">
                    <input type="text" className="form-control" name="subject" placeholder={text.placeholders.subject} required value={formData.subject} onChange={(e) => onChange('subject', e.target.value)} />
                  </div>

                  <div className="col-12 d-none" aria-hidden="true">
                    <input type="text" name="company" tabIndex={-1} autoComplete="off" value={formData.company} onChange={(e) => onChange('company', e.target.value)} />
                  </div>

                  <div className="col-12">
                    <textarea className="form-control" name="message" rows={6} placeholder={text.placeholders.message} required value={formData.message} onChange={(e) => onChange('message', e.target.value)} />
                  </div>

                  <div className="col-12 text-center">
                    {isLoading ? <div className="loading d-block">{text.loading}</div> : null}
                    {errorMessage ? <div className="error-message d-block">{errorMessage}</div> : null}
                    {successMessage ? <div className="sent-message d-block">{successMessage}</div> : null}

                    <button type="submit" className="btn" disabled={isLoading}>
                      {text.button}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
