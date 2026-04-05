/// <reference types="vitest/globals" />

import fs from 'node:fs';
import { extractColors, foucStylePlugin, generateStyleTag } from '../../vite-plugin-fouc-style';

const VALID_CSS = `@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-background: #ffffff;
  --color-foreground: #0f172a;
  --color-card: #ffffff;
  --color-card-foreground: #0f172a;
  --color-popover: #ffffff;
  --color-popover-foreground: #0f172a;
  --color-primary: #1d4ed8;
  --color-primary-foreground: #ffffff;
  --color-secondary: #f1f5f9;
  --color-secondary-foreground: #0f172a;
  --color-muted: #f1f5f9;
  --color-muted-foreground: #64748b;
  --color-accent: #f1f5f9;
  --color-accent-foreground: #0f172a;
  --color-destructive: #ef4444;
  --color-destructive-foreground: #ffffff;
  --color-border: #e2e8f0;
  --color-input: #e2e8f0;
  --color-ring: #1d4ed8;
  --radius: 0.5rem;
}

body {
  background: var(--color-background);
  color: var(--color-foreground);
}

.dark {
  --color-background: #0f172a;
  --color-foreground: #f8fafc;
  --color-card: #0f172a;
  --color-card-foreground: #f8fafc;
  --color-popover: #0f172a;
  --color-popover-foreground: #f8fafc;
  --color-primary: #3b82f6;
  --color-primary-foreground: #ffffff;
  --color-secondary: #1e293b;
  --color-secondary-foreground: #f8fafc;
  --color-muted: #1e293b;
  --color-muted-foreground: #94a3b8;
  --color-accent: #1e293b;
  --color-accent-foreground: #f8fafc;
  --color-destructive: #dc2626;
  --color-destructive-foreground: #ffffff;
  --color-border: #1e293b;
  --color-input: #1e293b;
  --color-ring: #3b82f6;
}
`;

describe('extractColors', () => {
  it('extracts all 4 colors from valid CSS', () => {
    const colors = extractColors(VALID_CSS);
    expect(colors).toEqual({
      lightBg: '#ffffff',
      lightFg: '#0f172a',
      darkBg: '#0f172a',
      darkFg: '#f8fafc',
    });
  });

  it('throws when @theme block is missing', () => {
    const noTheme = VALID_CSS.replace(/@theme/, '/* removed */');
    expect(() => extractColors(noTheme)).toThrow(
      '[vite-plugin-fouc-style] @theme block not found in index.css',
    );
  });

  it('throws when .dark block is missing', () => {
    const noDark = VALID_CSS.replace(/\.dark\s*\{[^}]+\}/s, '');
    expect(() => extractColors(noDark)).toThrow(
      '[vite-plugin-fouc-style] .dark block not found in index.css',
    );
  });

  it('throws when --color-background is missing from @theme', () => {
    const noBg = VALID_CSS.replace(/--color-background: #ffffff;/, '');
    expect(() => extractColors(noBg)).toThrow(
      '[vite-plugin-fouc-style] Could not extract --color-background from @theme in index.css',
    );
  });

  it('throws when color value is not a valid hex', () => {
    const badHex = VALID_CSS.replace(
      '--color-background: #ffffff;',
      '--color-background: rgb(255, 255, 255);',
    );
    expect(() => extractColors(badHex)).toThrow(
      '[vite-plugin-fouc-style] Invalid hex color for --color-background: "rgb(255, 255, 255)" in index.css',
    );
  });

  it('accepts 3-digit hex colors', () => {
    const shortHex = VALID_CSS.replace('--color-background: #ffffff;', '--color-background: #fff;');
    const colors = extractColors(shortHex);
    expect(colors.lightBg).toBe('#fff');
  });

  it('accepts 8-digit hex colors', () => {
    const longHex = VALID_CSS.replace(
      '--color-foreground: #0f172a;',
      '--color-foreground: #0f172a00;',
    );
    const colors = extractColors(longHex);
    expect(colors.lightFg).toBe('#0f172a00');
  });

  it('ignores CSS comments containing .dark {', () => {
    const cssWithComment = VALID_CSS.replace(
      '.dark {',
      '/* .dark { --color-background: #ff0000; --color-foreground: #ff0000; } */\n.dark {',
    );
    const colors = extractColors(cssWithComment);
    expect(colors.darkBg).toBe('#0f172a');
    expect(colors.darkFg).toBe('#f8fafc');
  });

  it('ignores .dark-mode selector', () => {
    const cssWithDarkMode = VALID_CSS.replace('.dark {', '.dark-mode {');
    expect(() => extractColors(cssWithDarkMode)).toThrow(
      '[vite-plugin-fouc-style] .dark block not found in index.css',
    );
  });
});

describe('generateStyleTag', () => {
  const colors = {
    lightBg: '#ffffff',
    lightFg: '#0f172a',
    darkBg: '#0f172a',
    darkFg: '#f8fafc',
  };

  it('wraps output in <style> tags', () => {
    const result = generateStyleTag(colors);
    expect(result).toContain('<style>');
    expect(result).toContain('</style>');
  });

  it('contains :root with light color variables', () => {
    const result = generateStyleTag(colors);
    expect(result).toMatch(
      /:root\s*\{[^}]*--color-background:\s*#ffffff;[^}]*--color-foreground:\s*#0f172a;[^}]*\}/s,
    );
  });

  it('contains .dark with dark color variables', () => {
    const result = generateStyleTag(colors);
    expect(result).toMatch(
      /\.dark\s*\{[^}]*--color-background:\s*#0f172a;[^}]*--color-foreground:\s*#f8fafc;[^}]*\}/s,
    );
  });

  it('contains body with CSS variable references', () => {
    const result = generateStyleTag(colors);
    expect(result).toMatch(
      /body\s*\{[^}]*background:\s*var\(--color-background\);[^}]*color:\s*var\(--color-foreground\);[^}]*\}/s,
    );
  });

  it('correctly interpolates color values', () => {
    const customColors = {
      lightBg: '#aabbcc',
      lightFg: '#ddeeff',
      darkBg: '#112233',
      darkFg: '#445566',
    };
    const result = generateStyleTag(customColors);
    expect(result).toContain('#aabbcc');
    expect(result).toContain('#ddeeff');
    expect(result).toContain('#112233');
    expect(result).toContain('#445566');
  });
});

describe('foucStylePlugin', () => {
  const HTML_WITH_PLACEHOLDER = '<html><head><!-- %FOUC_STYLE% --></head></html>';

  let readFileSyncSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    const plugin = foucStylePlugin();
    plugin.buildStart?.(
      {} as Parameters<NonNullable<Parameters<typeof foucStylePlugin>[0]['buildStart']>>[0],
    );
    readFileSyncSpy = vi.spyOn(fs, 'readFileSync').mockReturnValue(VALID_CSS);
  });

  afterEach(() => {
    readFileSyncSpy.mockRestore();
  });

  it('replaces placeholder with generated style tag', () => {
    const plugin = foucStylePlugin();
    const result = plugin.transformIndexHtml?.(HTML_WITH_PLACEHOLDER);

    expect(result).not.toContain('<!-- %FOUC_STYLE% -->');
    expect(result).toContain('<style>');
    expect(result).toContain('--color-background: #ffffff');
  });

  it('throws when placeholder is missing from HTML', () => {
    const plugin = foucStylePlugin();

    expect(() => plugin.transformIndexHtml?.('<html><head></head></html>')).toThrow(
      '[vite-plugin-fouc-style] <!-- %FOUC_STYLE% --> placeholder not found in index.html',
    );
  });

  it('transformIndexHtml caches style tag across calls', () => {
    const plugin = foucStylePlugin();

    plugin.transformIndexHtml?.(HTML_WITH_PLACEHOLDER);
    plugin.transformIndexHtml?.(HTML_WITH_PLACEHOLDER);

    expect(readFileSyncSpy).toHaveBeenCalledTimes(1);
  });

  it('cache invalidated on buildStart', () => {
    const plugin = foucStylePlugin();

    plugin.transformIndexHtml?.(HTML_WITH_PLACEHOLDER);
    plugin.buildStart?.(
      {} as Parameters<NonNullable<Parameters<typeof foucStylePlugin>[0]['buildStart']>>[0],
    );
    plugin.transformIndexHtml?.(HTML_WITH_PLACEHOLDER);

    expect(readFileSyncSpy).toHaveBeenCalledTimes(2);
  });
});
