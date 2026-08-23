import type { CvDownloadEvent, CvLanguage, VisitorLocation } from '../domain/cv-download.js';

export interface GeoLocator {
  locate(ipAddress: string): Promise<VisitorLocation>;
}

export interface CvDownloadNotifier {
  readonly configured: boolean;
  notifyCvDownload(event: CvDownloadEvent): Promise<void>;
}

export class TrackCvDownload {
  constructor(private geoLocator: GeoLocator, private notifier: CvDownloadNotifier) {}

  async execute(input: { ipAddress: string; browser: string; language: CvLanguage }) {
    if (!this.notifier.configured) return;
    const location = await this.geoLocator.locate(input.ipAddress);
    await this.notifier.notifyCvDownload({ ...input, ...location, downloadedAt: new Date() });
  }
}
