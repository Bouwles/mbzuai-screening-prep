// The exam screen's colours must stay readable: at least 4.5:1 for every text and background pair.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('../src/components/exam/exam.css', import.meta.url), 'utf8');

function tokens(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  const body = css.slice(start, css.indexOf('}', start));
  return Object.fromEntries([...body.matchAll(/--ex-([a-z0-9-]+):\s*(#[0-9a-f]{6})/g)].map((m) => [m[1], m[2]]));
}

const channel = (v: number) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}
function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const light = tokens('.ex');
const dark = { ...light, ...tokens("[data-theme='dark'] .ex:not(.ex-mock)") };

const PAIRS: [string, string][] = [
  ['text', 'bg'],
  ['text', 'bar'],
  ['text', 'row'],
  ['text', 'row-hover'],
  ['text', 'row-selected'],
  ['text', 'ok-bg'],
  ['text', 'bad-bg'],
  ['muted', 'bg'],
  ['muted', 'bar'],
  ['muted', 'row-hover'],
  ['link', 'bg'],
  ['accent', 'bar'],
  ['ok', 'ok-bg'],
  ['bad', 'bad-bg'],
];

describe('exam screen contrast', () => {
  for (const [theme, t] of [['light', light], ['dark', dark]] as const) {
    it(`${theme}: text pairs reach 4.5:1`, () => {
      const low = PAIRS.map(([a, b]) => ({ pair: `${a} on ${b}`, ratio: contrast(t[a], t[b]) })).filter((x) => x.ratio < 4.5);
      expect(low).toEqual([]);
    });
  }
  it('mock-only pairs reach 4.5:1 in light', () => {
    expect(contrast('#ffffff', light.accent)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(light.low, light.bar)).toBeGreaterThanOrEqual(4.5);
  });
});
