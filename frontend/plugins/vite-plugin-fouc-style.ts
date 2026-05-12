import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

const PLACEHOLDER = '<!-- %FOUC_STYLE% -->';
const HEX_COLOR_RE = /^#[0-9a-fA-F]{3,8}$/;
const RGB_CHANNELS_RE = /^\d{1,3}\s+\d{1,3}\s+\d{1,3}$/;

const CSS_PATH = path.resolve(import.meta.dirname, '../src/index.css');

let cachedStyleTag: string | null = null;

function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

function getVar(block: string, name: string): string | null {
  const m = block.match(new RegExp(`--color-${name}:\\s*([^;]+);`));
  return m?.[1]?.trim() ?? null;
}

function toCssColor(value: string): string {
  if (HEX_COLOR_RE.test(value)) return value;
  if (RGB_CHANNELS_RE.test(value)) return `rgb(${value})`;
  return value;
}

function requireColor(block: string, blockName: string, name: string): string {
  const value = getVar(block, name);
  if (!value) {
    throw new Error(
      `[vite-plugin-fouc-style] Could not extract --color-${name} from ${blockName} in index.css`
    );
  }
  if (!HEX_COLOR_RE.test(value) && !RGB_CHANNELS_RE.test(value)) {
    throw new Error(
      `[vite-plugin-fouc-style] Invalid color for --color-${name}: "${value}" in index.css (expected hex or space-separated RGB)`
    );
  }
  return value;
}

function extractColors(css: string) {
  const stripped = stripComments(css);
  const themeMatch = stripped.match(/@theme\s*\{([^}]+)\}/s);
  const darkMatch = stripped.match(/(?:^|\n)\.dark\s*\{([^}]*)\}/m);

  if (!themeMatch) {
    throw new Error('[vite-plugin-fouc-style] @theme block not found in index.css');
  }
  if (!darkMatch) {
    throw new Error('[vite-plugin-fouc-style] .dark block not found in index.css');
  }

  return {
    lightBg: requireColor(themeMatch[1], '@theme', 'background'),
    lightFg: requireColor(themeMatch[1], '@theme', 'foreground'),
    darkBg: requireColor(darkMatch[1], '.dark', 'background'),
    darkFg: requireColor(darkMatch[1], '.dark', 'foreground'),
  };
}

function generateStyleTag(colors: ReturnType<typeof extractColors>): string {
  return `<style>
      :root {
        --color-background: ${toCssColor(colors.lightBg)};
        --color-foreground: ${toCssColor(colors.lightFg)};
      }
      .dark {
        --color-background: ${toCssColor(colors.darkBg)};
        --color-foreground: ${toCssColor(colors.darkFg)};
      }
      body {
        background: var(--color-background);
        color: var(--color-foreground);
      }
    </style>`;
}

export function foucStylePlugin(): Plugin {
  return {
    name: 'vite-plugin-fouc-style',
    buildStart() {
      cachedStyleTag = null;
    },
    transformIndexHtml(html: string) {
      if (!html.includes(PLACEHOLDER)) {
        throw new Error(
          `[vite-plugin-fouc-style] ${PLACEHOLDER} placeholder not found in index.html`
        );
      }

      if (cachedStyleTag) {
        return html.replace(PLACEHOLDER, cachedStyleTag);
      }

      const css = fs.readFileSync(CSS_PATH, 'utf-8');
      const colors = extractColors(css);
      cachedStyleTag = generateStyleTag(colors);
      return html.replace(PLACEHOLDER, cachedStyleTag);
    },
  };
}

export { extractColors, generateStyleTag, PLACEHOLDER };
