import type { CvDownloadEvent } from '../../domain/cv-download.js';

const PORTFOLIO_TIME_ZONE = 'America/Santo_Domingo';

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getLocalHour(date: Date) {
  const hour = new Intl.DateTimeFormat('en-US', {
    timeZone: PORTFOLIO_TIME_ZONE,
    hour: '2-digit',
    hourCycle: 'h23'
  }).format(date);
  return Number(hour);
}

function getGreeting(date: Date) {
  const hour = getLocalHour(date);
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

function formatDate(date: Date) {
  return capitalize(new Intl.DateTimeFormat('es-DO', {
    timeZone: PORTFOLIO_TIME_ZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date));
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('es-DO', {
    timeZone: PORTFOLIO_TIME_ZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

export function createCvDownloadEmail(event: CvDownloadEvent) {
  const language = event.language === 'en' ? 'Inglés' : 'Español';
  const greeting = getGreeting(event.downloadedAt);
  const date = formatDate(event.downloadedAt);
  const time = formatTime(event.downloadedAt);
  const browser = escapeHtml(event.browser);
  const country = escapeHtml(event.country);
  const region = escapeHtml(event.region);

  return {
    subject: `[Portfolio] Nueva descarga · CV en ${language}`,
    html: `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    @keyframes enter { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
    .email-card { animation: enter .55s ease-out both; }
    .download-icon { animation: pulse 2.8s ease-in-out infinite; }
    .data-card { transition: transform .2s ease, border-color .2s ease; }
    .data-card:hover { transform: translateY(-2px); border-color: #38bdf8 !important; }
    @media only screen and (max-width: 560px) {
      .shell { padding: 18px 10px !important; }
      .email-card { border-radius: 20px !important; }
      .content { padding: 26px 20px !important; }
      .data-column { display: block !important; width: 100% !important; padding: 0 0 10px !important; }
      .title { font-size: 27px !important; }
    }
    @media (prefers-reduced-motion: reduce) {
      .email-card, .download-icon { animation: none !important; }
      .data-card { transition: none !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#07131d;color:#e8f3f8;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${greeting}, alguien acaba de descargar tu CV en ${language}.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background:#07131d;">
    <tr>
      <td class="shell" align="center" style="padding:38px 16px;">
        <table role="presentation" class="email-card" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:660px;background:#0d202e;border:1px solid #1d3b4d;border-radius:28px;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,.28);">
          <tr>
            <td style="height:6px;background:#38bdf8;font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td class="content" style="padding:38px 42px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="display:inline-block;padding:7px 12px;border-radius:999px;background:#12364a;color:#7dd3fc;font-size:11px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;">PORTFOLIO · ACTIVITY</span>
                  </td>
                  <td align="right">
                    <span class="download-icon" style="display:inline-block;width:48px;height:48px;line-height:48px;text-align:center;border-radius:14px;background:#38bdf8;color:#062033;font-size:24px;">↓</span>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 8px;color:#7dd3fc;font-size:15px;font-weight:700;">${greeting}, Elvis</p>
              <h1 class="title" style="margin:0;color:#f4fbff;font-size:34px;line-height:1.14;letter-spacing:-.8px;">Tu CV despertó interés.</h1>
              <p style="margin:14px 0 0;color:#a9c2d0;font-size:16px;line-height:1.65;">Una persona acaba de descargar tu currículum. Aquí tienes el contexto de la visita, organizado para que puedas identificar rápidamente la oportunidad.</p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;background:#102b3b;border-radius:18px;border:1px solid #20465c;">
                <tr>
                  <td style="padding:20px 22px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#8ba9b9;font-size:12px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;">Documento descargado</td>
                        <td align="right"><span style="display:inline-block;padding:6px 11px;border-radius:9px;background:#38bdf8;color:#062033;font-size:12px;font-weight:800;">${language}</span></td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top:9px;color:#f4fbff;font-size:19px;font-weight:750;">Elvis Hernández · Curriculum Vitae</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;">
                <tr>
                  <td class="data-column" width="50%" style="padding-right:7px;vertical-align:top;">
                    <div class="data-card" style="min-height:102px;padding:18px;background:#0a1924;border:1px solid #18394c;border-radius:16px;">
                      <div style="font-size:20px;line-height:1;">◉</div>
                      <div style="margin-top:12px;color:#7698aa;font-size:11px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;">Navegador</div>
                      <div style="margin-top:5px;color:#edf8fc;font-size:14px;font-weight:650;line-height:1.4;">${browser}</div>
                    </div>
                  </td>
                  <td class="data-column" width="50%" style="padding-left:7px;vertical-align:top;">
                    <div class="data-card" style="min-height:102px;padding:18px;background:#0a1924;border:1px solid #18394c;border-radius:16px;">
                      <div style="font-size:20px;line-height:1;">⌖</div>
                      <div style="margin-top:12px;color:#7698aa;font-size:11px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;">Ubicación aproximada</div>
                      <div style="margin-top:5px;color:#edf8fc;font-size:14px;font-weight:650;line-height:1.4;">${region}, ${country}</div>
                    </div>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;background:#0a1924;border:1px solid #18394c;border-radius:16px;">
                <tr>
                  <td width="48" style="padding:18px 0 18px 18px;font-size:22px;vertical-align:middle;">◷</td>
                  <td style="padding:18px 14px;vertical-align:middle;">
                    <div style="color:#7698aa;font-size:11px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;">Momento de la descarga</div>
                    <div style="margin-top:5px;color:#edf8fc;font-size:15px;font-weight:700;">${date} · ${time}</div>
                  </td>
                  <td align="right" style="padding:18px;color:#38bdf8;font-size:12px;font-weight:700;vertical-align:middle;">AST · Santo Domingo</td>
                </tr>
              </table>

              <div style="margin-top:26px;padding:16px 18px;border-radius:14px;background:#102535;color:#91adbb;font-size:13px;line-height:1.55;">✦ <strong style="color:#dff5ff;">Señal de interés:</strong> cada descarga puede representar una nueva conversación profesional, colaboración o propuesta.</div>
            </td>
          </tr>
          <tr>
            <td style="padding:19px 42px;background:#091923;border-top:1px solid #183648;color:#648493;font-size:11px;line-height:1.5;">Notificación automática y privada de Elvis Hernandez · La ubicación se estima mediante la red del visitante.</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  };
}
