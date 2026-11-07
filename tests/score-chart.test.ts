// The target label must never run into a score label, whatever the scores are.
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ScoreChart } from '../src/components/ScoreChart';
import type { MockRecord } from '../src/store/progress';

const mock = (i: number, score: number) => ({ id: `m${i}`, label: 'Mock', startedAt: i, submittedAt: i, score }) as MockRecord;
const ys = (html: string, re: RegExp) => [...html.matchAll(re)].map((m) => Number(m[1]));

describe('score chart', () => {
  for (const compact of [true, false]) {
    it(`${compact ? 'compact' : 'full'}: the target label sits below the plot and score labels stay in view`, () => {
      for (let score = 0; score <= 100; score++) {
        const html = renderToStaticMarkup(createElement(ScoreChart, { mocks: [mock(1, 50), mock(2, score)], compact }));
        const [targetLabel] = ys(html, /<text[^>]*?y="([\d.]+)"[^>]*class="target-label"/g);
        const plotBottom = Math.max(...ys(html, /class="grid"[^>]*?y1="([\d.]+)"|y1="([\d.]+)"[^>]*class="grid"/g).filter(Number.isFinite));
        const scoreLabels = ys(html, /<text[^>]*?y="([\d.]+)"[^>]*class="tick pt-label"/g);
        expect(targetLabel).toBeGreaterThan(plotBottom);
        // Text is about 12 units tall above its baseline.
        for (const y of scoreLabels) expect(y).toBeGreaterThanOrEqual(12);
      }
    });
  }
});
