// Script para capturar exemplos reais de requests/respostas dos testes de integração
// Salva snapshots em docs/openapi-exemplos.md

import fs from 'fs';
import path from 'path';

const OUTPUT = path.join('docs', 'openapi-exemplos.md');

/**
 * Chame esta função nos testes para registrar exemplos:
 *   logExample('POST /auth/login', req, res)
 */

type Example = {
  title: string;
  req: unknown;
  res: unknown;
};
const examples: Example[] = [];


export function logExample(title: string, req: unknown, res: unknown) {
  examples.push({ title, req, res });
}

export function saveExamples() {
  let md = '# Exemplos reais de requests/respostas\n\n';
  for (const ex of examples) {
    md += `## ${ex.title}\n`;
    md += '### Request\n';
    md += '```json\n' + JSON.stringify(ex.req, null, 2) + '\n```\n';
    md += '### Response\n';
    md += '```json\n' + JSON.stringify(ex.res, null, 2) + '\n```\n';
  }
  fs.writeFileSync(OUTPUT, md);
}
