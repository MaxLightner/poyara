import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../src/data/projects/', import.meta.url);
const files = readdirSync(root).filter((file) => file.endsWith('.json'));
let failures = 0;

for (const file of files) {
  const path = join(root.pathname, file);
  try {
    const data = JSON.parse(readFileSync(path, 'utf8'));
    const fields = ['title', 'summary', 'category', 'role', 'evidenceUrl'];
    const missing = fields.filter((key) => typeof data[key] !== 'string' || !data[key].trim());
    if (missing.length) throw new Error(`missing required fields: ${missing.join(', ')}`);
    if (!data.evidenceUrl.startsWith('https://')) throw new Error('evidenceUrl must be HTTPS');
    const forbidden = ['draft', 'private', 'secret', 'internalOnly', 'unpublished', 'published'];
    const found = forbidden.filter((key) => Object.hasOwn(data, key));
    if (found.length) throw new Error(`public-only collection cannot include flags: ${found.join(', ')}`);
  } catch (error) {
    failures++;
    process.stderr.write(`Invalid project ${file}: ${error.message}\n`);
  }
}

if (failures) process.exit(1);
process.stdout.write(`Validated ${files.length} public project record(s).\n`);
