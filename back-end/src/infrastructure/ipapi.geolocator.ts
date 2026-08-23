import type { GeoLocator } from '../application/cv-download.js';
import type { VisitorLocation } from '../domain/cv-download.js';

type IpApiResponse = { country_name?: string; region?: string; error?: boolean };
const unknownLocation: VisitorLocation = { country: 'Desconocido', region: 'Desconocida' };

function isPublicIp(ip: string) {
  return ip && ip !== '::1' && ip !== '127.0.0.1' && !ip.startsWith('10.') && !ip.startsWith('192.168.') && !ip.startsWith('172.');
}

export class IpApiGeoLocator implements GeoLocator {
  async locate(ipAddress: string): Promise<VisitorLocation> {
    if (!isPublicIp(ipAddress)) return unknownLocation;
    try {
      const response = await fetch(`https://ipapi.co/${encodeURIComponent(ipAddress)}/json/`, {
        headers: { 'User-Agent': 'ElvisPortfolio/1.0' },
        signal: AbortSignal.timeout(3000)
      });
      if (!response.ok) return unknownLocation;
      const data = await response.json() as IpApiResponse;
      if (data.error) return unknownLocation;
      return { country: data.country_name || unknownLocation.country, region: data.region || unknownLocation.region };
    } catch {
      return unknownLocation;
    }
  }
}
