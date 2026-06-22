import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, extname, relative, resolve } from 'node:path';
import { describe, it } from 'vitest';

const SRC_DIR = resolve(process.cwd(), 'src');
const TEST_UNIT_DIR = resolve(process.cwd(), 'tests', 'unit');

const SHADCN_EXEMPT = new Set([
  'shared/components/ui/button.tsx',
  'shared/components/ui/input.tsx',
  'shared/components/ui/label.tsx',
  'shared/components/ui/separator.tsx',
  'shared/components/ui/textarea.tsx',
  'shared/components/ui/dropdown-menu.tsx',
  'shared/components/ui/sheet.tsx',
  'shared/components/ui/card.tsx',
]);

const TRIVIAL_EXEMPT = new Set([
  'app/router.ts',
  'app/routes/admin/index.ts',
  'app/routes/index.tsx',
  'app/routes/login/login-page.tsx',
  'app/routes/login/use-banner.ts',
  'shared/api/api-error.ts',
  'shared/components/error-alert.tsx',
  'shared/lib/utils.ts',
]);

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function walkDir(dir: string, exts: string[]): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(full, exts));
    } else if (exts.some((e) => entry.name.endsWith(e))) {
      files.push(full);
    }
  }
  return files;
}

function isBarrel(filePath: string): boolean {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '') continue;
    if (trimmed.startsWith('//')) continue;
    if (trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed === '*/') continue;
    if (/^export\s/.test(trimmed) && /from\s+['"]/.test(trimmed)) continue;
    return false;
  }
  return true;
}

function isExemptSource(absPath: string): boolean {
  const rel = relative(SRC_DIR, absPath);
  if (rel.startsWith('assets' + '/')) return true;
  if (rel.endsWith('.css') || rel.endsWith('.module.css')) return true;
  if (SHADCN_EXEMPT.has(rel)) return true;
  if (TRIVIAL_EXEMPT.has(rel)) return true;
  if (basename(rel).startsWith('index.') && isBarrel(absPath)) return true;
  return false;
}

function findMatchingTest(srcRel: string): boolean {
  const ext = extname(srcRel);
  const name = basename(srcRel, ext);
  const dir = dirname(srcRel);
  const regex = new RegExp(`^${escapeRegex(name)}.*\\.test\\.(ts|tsx)$`);

  const candidateDirs = [resolve(TEST_UNIT_DIR, dir)];
  if (dir !== '.') {
    candidateDirs.push(resolve(TEST_UNIT_DIR, dir, name));
  } else {
    candidateDirs.push(resolve(TEST_UNIT_DIR, name));
  }

  for (const testDir of candidateDirs) {
    if (!existsSync(testDir)) continue;
    try {
      if (readdirSync(testDir).some((entry) => regex.test(entry))) return true;
    } catch {
      // skip
    }
  }
  return false;
}

describe('test presence', () => {
  it('every source file has a matching test', () => {
    const sourceFiles = walkDir(SRC_DIR, ['.ts', '.tsx']);
    const missing: string[] = [];

    for (const absPath of sourceFiles) {
      if (isExemptSource(absPath)) continue;

      const rel = relative(SRC_DIR, absPath);
      if (!findMatchingTest(rel)) {
        const ext = extname(absPath);
        const name = basename(rel, ext);
        const dir = dirname(rel);
        const testRelPath =
          dir === '.' ? `tests/unit/${name}.test${ext}` : `tests/unit/${dir}/${name}.test${ext}`;
        missing.push(`src/${rel} → ${testRelPath}`);
      }
    }

    if (missing.length > 0) {
      const message = `Missing tests (${missing.length}):\n  ${missing.join('\n  ')}`;
      throw new Error(message);
    }
  });
});
