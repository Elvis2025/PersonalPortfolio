export type CvLanguage = 'en' | 'es';

export type VisitorLocation = {
  country: string;
  region: string;
};

export type CvDownloadEvent = VisitorLocation & {
  language: CvLanguage;
  browser: string;
  downloadedAt: Date;
};
