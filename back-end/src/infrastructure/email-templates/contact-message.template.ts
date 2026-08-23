import type { ContactMessage } from '../../domain/contact.js';

const timeZone = 'America/Santo_Domingo';
const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

function getDateContext(date: Date) {
  const hour = Number(new Intl.DateTimeFormat('en-US', { timeZone, hour: '2-digit', hourCycle: 'h23' }).format(date));
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';
  const day = capitalize(new Intl.DateTimeFormat('es-DO', { timeZone, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date));
  const time = new Intl.DateTimeFormat('es-DO', { timeZone, hour: 'numeric', minute: '2-digit', hour12: true }).format(date);
  return { greeting, day, time };
}

export function createContactMessageEmail(message: ContactMessage, receivedAt = new Date()) {
  const { greeting, day, time } = getDateContext(receivedAt);
  const name = escapeHtml(message.name);
  const email = escapeHtml(message.email);
  const subject = escapeHtml(message.subject);
  const content = escapeHtml(message.message);

  return {
    subject: `[Portfolio] ${message.subject}`,
    html: `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
@keyframes enter{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
.email-card{animation:enter .55s ease-out both}.message-icon{animation:pulse 2.8s ease-in-out infinite}.info-card{transition:transform .2s ease,border-color .2s ease}.info-card:hover{transform:translateY(-2px);border-color:#38bdf8!important}
@media(max-width:560px){.shell{padding:18px 10px!important}.email-card{border-radius:20px!important}.content{padding:26px 20px!important}.info-column{display:block!important;width:100%!important;padding:0 0 10px!important}.title{font-size:27px!important}}
@media(prefers-reduced-motion:reduce){.email-card,.message-icon{animation:none!important}.info-card{transition:none!important}}
</style></head>
<body style="margin:0;padding:0;background:#07131d;color:#e8f3f8;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${greeting}, ${name} te envió un mensaje desde tu portafolio.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#07131d"><tr><td class="shell" align="center" style="padding:38px 16px">
<table role="presentation" class="email-card" width="100%" cellpadding="0" cellspacing="0" style="max-width:660px;background:#0d202e;border:1px solid #1d3b4d;border-radius:28px;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,.28)">
<tr><td style="height:6px;background:#38bdf8;font-size:0">&nbsp;</td></tr><tr><td class="content" style="padding:38px 42px 32px">
<table role="presentation" width="100%"><tr><td><span style="display:inline-block;padding:7px 12px;border-radius:999px;background:#12364a;color:#7dd3fc;font-size:11px;font-weight:800;letter-spacing:1.2px">PORTFOLIO · INBOX</span></td><td align="right"><span class="message-icon" style="display:inline-block;width:48px;height:48px;line-height:48px;text-align:center;border-radius:14px;background:#38bdf8;color:#062033;font-size:22px">✉</span></td></tr></table>
<p style="margin:28px 0 8px;color:#7dd3fc;font-size:15px;font-weight:700">${greeting}, Elvis</p>
<h1 class="title" style="margin:0;color:#f4fbff;font-size:34px;line-height:1.14;letter-spacing:-.8px">Tienes un nuevo mensaje.</h1>
<p style="margin:14px 0 0;color:#a9c2d0;font-size:16px;line-height:1.65">Alguien inició una conversación desde tu portafolio. La información está organizada para que puedas responder rápidamente.</p>
<table role="presentation" width="100%" style="margin-top:28px"><tr>
<td class="info-column" width="50%" style="padding-right:7px;vertical-align:top"><div class="info-card" style="min-height:94px;padding:18px;background:#0a1924;border:1px solid #18394c;border-radius:16px"><div style="font-size:20px">●</div><div style="margin-top:12px;color:#7698aa;font-size:11px;font-weight:800;letter-spacing:.8px">REMITENTE</div><div style="margin-top:5px;color:#edf8fc;font-size:15px;font-weight:700">${name}</div></div></td>
<td class="info-column" width="50%" style="padding-left:7px;vertical-align:top"><div class="info-card" style="min-height:94px;padding:18px;background:#0a1924;border:1px solid #18394c;border-radius:16px"><div style="font-size:20px">@</div><div style="margin-top:12px;color:#7698aa;font-size:11px;font-weight:800;letter-spacing:.8px">CORREO</div><div style="margin-top:5px;color:#7dd3fc;font-size:14px;font-weight:700;word-break:break-word">${email}</div></div></td>
</tr></table>
<div style="margin-top:14px;padding:20px 22px;background:#102b3b;border:1px solid #20465c;border-radius:18px"><div style="color:#8ba9b9;font-size:11px;font-weight:800;letter-spacing:.8px">ASUNTO</div><div style="margin-top:7px;color:#f4fbff;font-size:18px;font-weight:750">${subject}</div></div>
<div style="margin-top:14px;padding:22px;background:#f0f9ff;border-radius:18px;color:#173244"><div style="color:#39708c;font-size:11px;font-weight:800;letter-spacing:.8px">MENSAJE</div><div style="margin-top:11px;font-size:15px;line-height:1.75;white-space:pre-wrap;word-break:break-word">${content}</div></div>
<table role="presentation" width="100%" style="margin-top:14px;background:#0a1924;border:1px solid #18394c;border-radius:16px"><tr><td width="48" style="padding:18px 0 18px 18px;font-size:22px">◷</td><td style="padding:18px 14px"><div style="color:#7698aa;font-size:11px;font-weight:800;letter-spacing:.8px">RECIBIDO</div><div style="margin-top:5px;color:#edf8fc;font-size:15px;font-weight:700">${day} · ${time}</div></td><td align="right" style="padding:18px;color:#38bdf8;font-size:12px;font-weight:700">AST · Santo Domingo</td></tr></table>
<div style="margin-top:26px;padding:16px 18px;border-radius:14px;background:#102535;color:#91adbb;font-size:13px;line-height:1.55">↩ <strong style="color:#dff5ff">Respuesta directa:</strong> usa “Responder” y tu mensaje llegará a ${name}.</div>
</td></tr><tr><td style="padding:19px 42px;background:#091923;border-top:1px solid #183648;color:#648493;font-size:11px">Notificación automática y privada de Elvis Portfolio · Mensaje enviado desde el formulario web.</td></tr>
</table></td></tr></table></body></html>`
  };
}
