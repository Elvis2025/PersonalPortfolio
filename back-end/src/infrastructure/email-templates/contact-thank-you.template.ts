import type { ContactMessage } from '../../domain/contact.js';

const timeZone = 'America/Santo_Domingo';
const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
const socialCell = (url: string, icon: string, padding: string) => {
  const displayUrl = url.replace(/^mailto:/, '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  return `<td class="social-cell" width="50%" style="padding:${padding}"><a class="social-link" href="${escapeHtml(url)}" style="display:block;padding:12px 14px;background:#102837;border-radius:12px;color:#eaf8ff;text-decoration:none;font-size:12px;font-weight:700"><img src="https://img.icons8.com/ios-filled/48/7dd3fc/${icon}.png" width="20" height="20" alt="" style="display:inline-block;width:20px;height:20px;margin-right:9px;vertical-align:middle">${escapeHtml(displayUrl)}</a></td>`;
};

function greeting(date: Date, language: 'en' | 'es') {
  const hour = Number(new Intl.DateTimeFormat('en-US', { timeZone, hour: '2-digit', hourCycle: 'h23' }).format(date));
  if (language === 'en') return hour < 12 ? 'Good morning' : hour < 19 ? 'Good afternoon' : 'Good evening';
  return hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';
}

export function createContactThankYouEmail(message: ContactMessage, sentAt = new Date(), profileImageUrl = 'cid:elvis-profile') {
  const visitorName = escapeHtml(message.name.trim());
  const isEnglish = message.language === 'en';
  const copy = isEnglish ? {
    subject: 'Thank you for reaching out · Elvis Hernández',
    eyebrow: 'MESSAGE RECEIVED', title: 'Thank you for connecting.',
    intro: 'It genuinely means a lot that you took the time to explore my portfolio and share your message with me.',
    body: 'Behind every project there is curiosity, intention, and the desire to build something valuable. I appreciate the opportunity to learn about your idea, and I will personally review your message and get back to you as soon as possible.',
    open: 'If any question, additional detail, or new idea comes up, please do not hesitate to contact me. I will be happy to continue the conversation.',
    closing: 'Thank you again for your time and trust.', signature: 'Warm regards', role: 'Full Stack Developer', connect: 'LET’S STAY CONNECTED'
  } : {
    subject: 'Gracias por contactarme · Elvis Hernández',
    eyebrow: 'MENSAJE RECIBIDO', title: 'Gracias por conectar conmigo.',
    intro: 'Significa mucho para mí que hayas dedicado tiempo a conocer mi portafolio y compartir tu mensaje conmigo.',
    body: 'Detrás de cada proyecto existe curiosidad, intención y el deseo de construir algo valioso. Aprecio la oportunidad de conocer tu idea; revisaré personalmente tu mensaje y te responderé tan pronto como sea posible.',
    open: 'Si surge cualquier duda, comentario, detalle adicional o una nueva idea, no dudes en contactarme. Estaré encantado de continuar la conversación.',
    closing: 'Gracias nuevamente por tu tiempo y confianza.', signature: 'Con aprecio', role: 'Full Stack Developer', connect: 'SIGAMOS CONECTADOS'
  };

  const socialLinks = [
    { url: 'https://wa.me/18498698664', icon: 'whatsapp' },
    { url: 'mailto:inelvis16031124@gmail.com', icon: 'new-post' },
    { url: 'https://linkedin.com/in/elvis-hernandez-075496285', icon: 'linkedin' },
    { url: 'https://github.com/Elvis2025', icon: 'github' },
    { url: 'https://www.instagram.com/elvis_h24/', icon: 'instagram-new' },
    { url: 'https://x.com/elvish24', icon: 'twitterx--v2' },
    { url: 'https://www.threads.com/@elvis_h24', icon: 'threads' }
  ];
  const socialRows = Array.from({ length: Math.ceil(socialLinks.length / 2) }, (_, row) => {
    const left = socialLinks[row * 2];
    const right = socialLinks[row * 2 + 1];
    return `<tr>${socialCell(left.url, left.icon, '0 5px 8px 0')}${right ? socialCell(right.url, right.icon, '0 0 8px 5px') : '<td></td>'}</tr>`;
  }).join('');

  return { subject: copy.subject, html: `<!doctype html><html lang="${message.language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
@keyframes enter{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@keyframes glow{0%,100%{box-shadow:0 0 0 0 rgba(56,189,248,.12)}50%{box-shadow:0 0 0 10px rgba(56,189,248,0)}}
.email-card{animation:enter .65s ease-out both}.profile-photo{animation:glow 3s ease-in-out infinite}.social-link{transition:transform .2s ease,background-color .2s ease}.social-link:hover{transform:translateY(-2px);background:#16415a!important}
@media(max-width:560px){.shell{padding:14px 8px!important}.email-card{border-radius:20px!important}.hero,.content,.footer{padding-left:20px!important;padding-right:20px!important}.title{font-size:29px!important}.profile-photo{width:104px!important;height:104px!important}.signature-copy{padding-left:12px!important}.social-cell{display:block!important;width:100%!important;padding:5px 0!important}.social-link{display:block!important}}
@media(prefers-reduced-motion:reduce){.email-card,.profile-photo{animation:none!important}.social-link{transition:none!important}}
</style></head>
<body style="margin:0;padding:0;background:#050b11;color:#eef7fb;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${greeting(sentAt,message.language)}, ${visitorName}. ${copy.intro}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050b11"><tr><td class="shell" align="center" style="padding:38px 16px">
<table role="presentation" class="email-card" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background:#0b1823;border:1px solid #1c3445;border-radius:30px;overflow:hidden;box-shadow:0 28px 80px rgba(0,0,0,.38)">
<tr><td style="height:6px;background:linear-gradient(90deg,#38bdf8,#eaf8ff,#38bdf8);font-size:0">&nbsp;</td></tr>
<tr><td class="hero" align="center" style="padding:42px 42px 32px;background:#0d2130">
<img class="profile-photo" src="${escapeHtml(profileImageUrl)}" width="128" height="128" alt="Elvis Hernández" style="display:block;width:128px;height:128px;object-fit:cover;border-radius:50%;border:5px solid #f5fbff;box-shadow:0 0 0 5px #38bdf8">
<div style="margin-top:26px"><span style="display:inline-block;padding:7px 13px;border-radius:999px;background:#12384d;color:#7dd3fc;font-size:11px;font-weight:800;letter-spacing:1.2px">${copy.eyebrow}</span></div>
<p style="margin:22px 0 7px;color:#7dd3fc;font-size:16px;font-weight:700">${greeting(sentAt,message.language)}, ${visitorName}</p>
<h1 class="title" style="margin:0;color:#fff;font-size:38px;line-height:1.12;letter-spacing:-1px">${copy.title}</h1>
</td></tr>
<tr><td class="content" style="padding:34px 44px">
<p style="margin:0;color:#e9f4f8;font-size:17px;font-weight:650;line-height:1.7">${copy.intro}</p>
<p style="margin:18px 0 0;color:#a9beca;font-size:15px;line-height:1.78">${copy.body}</p>
<div style="margin-top:25px;padding:21px 22px;background:#f4f8fa;border-radius:18px;border-left:5px solid #38bdf8;color:#243b49;font-size:15px;line-height:1.75">“${copy.open}”</div>
<p style="margin:26px 0 0;color:#d8e7ed;font-size:15px;line-height:1.7">${copy.closing}</p>
<p style="margin:8px 0 22px;color:#7895a4;font-size:13px;font-style:italic">${copy.signature},</p>
<table role="presentation" cellpadding="0" cellspacing="0"><tr><td><img src="${escapeHtml(profileImageUrl)}" width="58" height="58" alt="Elvis Hernández" style="display:block;width:58px;height:58px;object-fit:cover;border-radius:50%;border:2px solid #38bdf8"></td><td class="signature-copy" style="padding-left:15px"><div style="color:#fff;font-size:17px;font-weight:800">Elvis Hernández</div><div style="margin-top:4px;color:#7dd3fc;font-size:13px;font-weight:650">${copy.role}</div></td></tr></table>
</td></tr>
<tr><td class="footer" style="padding:28px 44px;background:#07131d;border-top:1px solid #193344">
<div style="margin-bottom:15px;color:#718e9d;font-size:10px;font-weight:800;letter-spacing:1.2px">${copy.connect}</div>
<table role="presentation" width="100%">${socialRows}</table>
<div style="margin-top:22px;padding-top:18px;border-top:1px solid #172d3b;color:#536f7e;font-size:10px;line-height:1.6;text-align:center">Elvis Hernández · Full Stack Developer · Santo Domingo, República Dominicana</div>
</td></tr></table></td></tr></table></body></html>` };
}
