import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..', 'arc42');

function cells(line: string): string[] {
  return line.split('|').slice(1, -1).map((c) => c.trim());
}

function isSeparator(line: string): boolean {
  return line.startsWith('|') && cells(line).every((c) => /^-+$/.test(c));
}

function collectRows(lines: string[], startIdx: number): [string[][], number] {
  const header = cells(lines[startIdx]);
  const rows = [header];
  let j = startIdx + 2;
  while (j < lines.length && lines[j].startsWith('|') && !isSeparator(lines[j])) {
    rows.push(cells(lines[j]));
    j++;
  }
  return [rows, j];
}

function computeWidths(rows: string[][]): number[] {
  const widths = new Array(rows[0].length).fill(0);
  for (const row of rows) {
    for (let c = 0; c < row.length; c++) {
      if (row[c].length > widths[c]) widths[c] = row[c].length;
    }
  }
  return widths;
}

function formatRow(row: string[], widths: number[]): string {
  return `| ${row.map((c, ci) => c.padEnd(widths[ci])).join(' | ')} |`;
}

function formatSeparator(widths: number[]): string {
  return `| ${widths.map((w) => '-'.repeat(w)).join(' | ')} |`;
}

function normalise(content: string): string {
  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    if (isSeparator(lines[i]) && i > 0 && lines[i - 1].startsWith('|')) {
      const [rows, next] = collectRows(lines, i - 1);
      const widths = computeWidths(rows);

      lines[i - 1] = formatRow(rows[0], widths);
      lines[i] = formatSeparator(widths);
      for (let r = 1; r < rows.length; r++) {
        lines[i + r] = formatRow(rows[r], widths);
      }

      i = next;
    } else {
      i++;
    }
  }

  return lines.join('\n');
}

const entries = readdirSync(ROOT, { recursive: true }) as string[];
const files = entries.filter((f) => f.endsWith('.md')).map((f) => resolve(ROOT, f));

let count = 0;
for (const file of files) {
  const src = readFileSync(file, 'utf-8');
  const out = normalise(src);
  if (src !== out) {
    writeFileSync(file, out, 'utf-8');
    count++;
    console.log(`  normalised: ${file}`);
  }
}
console.log(`\nDone. ${count} of ${files.length} files changed.`);
