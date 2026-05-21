/**
 * scripts/generate-og.mjs
 *
 * Generates the static Open Graph image → public/og-image.png
 * Runs before `astro build` (wired into the build script). The og:image
 * meta tag in the layout points at /og-image.png.
 *
 * Design: feedzz Ember theme — dark warm background, amber accent bar +
 * glow, wordmark in Space Grotesk Bold, tagline in Inter.
 */

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ROOT = resolve(process.cwd());
const FONTS_DIR = join(ROOT, 'src/assets/fonts');

function loadFont(file) {
  const buf = readFileSync(join(FONTS_DIR, file));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

/** Minimal createElement — avoids a react dependency. */
const h = (type, props, ...children) => ({
  type,
  props: { ...props, children: children.length <= 1 ? children[0] : children },
});

// ── feedzz Ember theme (oklch → hex approximations) ──────────────────────────
const C = {
  bg: '#161210',
  accent: '#ef9a3a',
  textPrimary: '#f7f3ef',
  textSecondary: '#b9ab9e',
  textMuted: '#82776c',
  border: 'rgba(255,255,255,0.10)',
};

const card = h(
  'div',
  {
    style: {
      width: '1200px',
      height: '630px',
      display: 'flex',
      backgroundColor: C.bg,
      position: 'relative',
      fontFamily: '"Inter"',
    },
  },
  // Radial accent glow, top-right
  h('div', {
    style: {
      position: 'absolute',
      top: '-160px',
      right: '-120px',
      width: '560px',
      height: '560px',
      borderRadius: '50%',
      background: `radial-gradient(circle, ${C.accent}26 0%, transparent 70%)`,
    },
  }),
  // Left accent bar
  h('div', {
    style: {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '8px',
      height: '630px',
      background: C.accent,
    },
  }),
  // Content column
  h(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px 64px 100px',
        width: '1200px',
        height: '630px',
      },
    },
    // Eyebrow
    h(
      'div',
      {
        style: {
          color: C.accent,
          fontSize: '21px',
          fontWeight: 600,
          letterSpacing: '0.14em',
          fontFamily: '"Inter"',
        },
      },
      'DISCOVERY FEED',
    ),
    // Wordmark + tagline
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column' } },
      h(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'row',
            fontSize: '132px',
            fontWeight: 700,
            fontFamily: '"Space Grotesk"',
            letterSpacing: '-0.03em',
            lineHeight: '1',
          },
        },
        h('span', { style: { color: C.textPrimary } }, 'feed'),
        h('span', { style: { color: C.accent } }, 'zz'),
      ),
      h(
        'div',
        {
          style: {
            color: C.textSecondary,
            fontSize: '42px',
            fontWeight: 400,
            marginTop: '26px',
            fontFamily: '"Inter"',
          },
        },
        'AI launches, hot off the press.',
      ),
    ),
    // Footer
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column' } },
      h('div', {
        style: { height: '1px', backgroundColor: C.border, marginBottom: '22px' },
      }),
      h(
        'div',
        {
          style: {
            color: C.textMuted,
            fontSize: '23px',
            fontFamily: '"Inter"',
            letterSpacing: '0.01em',
          },
        },
        'feedzz.online',
      ),
    ),
  ),
);

const fonts = [
  { name: 'Inter', data: loadFont('inter-regular.ttf'), weight: 400, style: 'normal' },
  { name: 'Inter', data: loadFont('inter-semibold.ttf'), weight: 600, style: 'normal' },
  { name: 'Inter', data: loadFont('inter-bold.ttf'), weight: 700, style: 'normal' },
  { name: 'Space Grotesk', data: loadFont('space-grotesk-bold.ttf'), weight: 700, style: 'normal' },
];

const svg = await satori(card, { width: 1200, height: 630, fonts });
const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

mkdirSync(join(ROOT, 'public'), { recursive: true });
writeFileSync(join(ROOT, 'public/og-image.png'), png);
console.log('✅  OG image → public/og-image.png');
