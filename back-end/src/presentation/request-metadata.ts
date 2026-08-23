import type { Request } from 'express';

export function getVisitorIp(request: Request) {
  const forwarded = request.headers['x-forwarded-for'];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0];
  return String(value || request.ip || request.socket.remoteAddress || '').trim().replace(/^::ffff:/, '');
}

export function getBrowserName(userAgent = '') {
  const rules: Array<[RegExp, string]> = [
    [/EdgA?\/([\d.]+)/, 'Microsoft Edge'],
    [/CriOS\/([\d.]+)/, 'Google Chrome para iOS'],
    [/Chrome\/([\d.]+)/, 'Google Chrome'],
    [/FxiOS\/([\d.]+)/, 'Mozilla Firefox para iOS'],
    [/Firefox\/([\d.]+)/, 'Mozilla Firefox'],
    [/Version\/([\d.]+).*Mobile.*Safari/, 'Safari para iPhone/iPad'],
    [/Version\/([\d.]+).*Safari/, 'Safari']
  ];
  for (const [pattern, name] of rules) {
    const match = userAgent.match(pattern);
    if (match) return `${name} ${match[1]}`;
  }
  return userAgent ? 'Navegador no identificado' : 'Desconocido';
}
