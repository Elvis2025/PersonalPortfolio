import fs from 'node:fs';
import path from 'node:path';
type Cv = { fileName: string; filePath: string; mtime: number };
export class CvRepository {
  constructor(private directories: string[]) {}
  find(lang?: 'en' | 'es'): Cv | null {
    const files = this.directories.flatMap((dir) => !fs.existsSync(dir) ? [] : fs.readdirSync(dir).filter((name) => ['.pdf', ''].includes(path.extname(name).toLowerCase())).map((name) => ({ fileName: name, filePath: path.join(dir, name), mtime: fs.statSync(path.join(dir, name)).mtimeMs }))).sort((a, b) => b.mtime - a.mtime);
    if (!lang) return files[0] ?? null;
    const names = lang === 'en' ? ['english-eh-cv.pdf', 'english-eh-cv'] : ['spanish-eh-cv.pdf', 'spanish-eh-cv'];
    return files.find((file) => names.includes(file.fileName.toLowerCase())) ?? null;
  }
}
