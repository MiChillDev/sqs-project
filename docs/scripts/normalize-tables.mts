import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..', 'arc42');

function cells(line: string): string[] {
  return line.split('|').slice(1, -1).map((c) => c.trim());
}

function isSeparator(line: string): boolean {
  return line.startsWith('|') && cells(line).every((c) => /^-+$/.test(c));
}

function normalise(content: string): string {
  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    if (isSeparator(lines[i]) && i > 0 && lines[i - 1].startsWith('|')) {
      const header = cells(lines[i - 1]);
      const rows = [header];
      let j = i + 1;
      while (j < lines.length && lines[j].startsWith('|') && !isSeparator(lines[j])) {
        rows.push(cells(lines[j]));
        j++;
      }

      const widths = Array(header.length).fill(0);
      for (const row of rows) {
        for (let c = 0; c < row.length; c++) {
          if (row[c].length > widths[c]) widths[c] = row[c].length;
        }
      }

      const pad = (row: string[]) =>
        `| ${row.map((c, ci) => c.padEnd(widths[ci])).join(' | ')} |`;

      lines[i - 1] = pad(header);
      lines[i] = `| ${widths.map((w) => '-'.repeat(w)).join(' | ')} |`;
      for (let r = 1; r < rows.length; r++) {
        lines[i + r] = pad(rows[r]);
      }

      i = j;
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
