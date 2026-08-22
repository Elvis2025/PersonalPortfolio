import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
for (const file of [path.join(projectRoot, '.env'), path.resolve(process.cwd(), '.env')]) {
  if (fs.existsSync(file)) dotenv.config({ path: file, override: false });
}
const clean = (value?: string) => value?.trim().replace(/^['"]|['"]$/g, '').trim() ?? '';
export const environment = {
  port: Number(process.env.PORT ?? 4000),
  origins: clean(process.env.ALLOWED_ORIGINS).split(',').map((x) => x.trim()).filter(Boolean),
  cvPath: clean(process.env.CV_STORAGE_PATH),
  resend: { apiKey: clean(process.env.RESEND_API_KEY), from: clean(process.env.RESEND_FROM), to: clean(process.env.CONTACT_TO_EMAIL) }
};
