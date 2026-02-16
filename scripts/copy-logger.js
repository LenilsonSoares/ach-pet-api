// scripts/copy-logger.js
import fs from 'fs';
import path from 'path';

const src = path.resolve('src/infra/observability/logger.js');
const dest = path.resolve('dist/infra/observability/logger.js');

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(src, dest);
console.log(`logger.js copiado para ${dest}`);