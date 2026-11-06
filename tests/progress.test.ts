// Saved progress from older versions of the site must load cleanly.
import { describe, expect, it } from 'vitest';
import { GENERATORS, STATIC } from '../src/engine/bank';
import { emptyState, importJson, getState, resetAll, sanitizeState } from '../src/store/progress';

const liveQ = STATIC[0];
const liveG = GENERATORS[0];
const attempt = (sourceId: string, sub: string, key = sourceId) => ({ key, sourceId, sub, correct: true, chosen: 0, ms: 1, at: 1, mode: 'practice' });
const card = (key: string, sub: string) => ({ key, sub, level: 1, due: 5, added: 1 });

/** Progress from before the clean-up: deleted ids, a removed subtopic, a removed setting and filter. */
const OLD = {
  v: 1,
  attempts: [
    attempt(liveQ.id, liveQ.subtopic),
    attempt(liveG.id, liveG.subtopic, `gen:${liveG.id}:7`),
    attempt('deleted-question-999', liveQ.subtopic),
    attempt('rates-clocks-001', 'rates-clocks'),
    attempt('gen-deleted-generator', liveG.subtopic, 'gen:gen-deleted-generator:3'),
  ],
  read: [liveQ.subtopic, 'rates-clocks'],
  flags: [liveQ.id, `gen:${liveG.id}:1`, 'deleted-question-999', 'gen:gen-deleted-generator:1'],
  mistakes: {
    [liveQ.id]: card(liveQ.id, liveQ.subtopic),
    [`tpl:${liveG.id}`]: card(`tpl:${liveG.id}`, liveG.subtopic),
    'deleted-question-999': card('deleted-question-999', liveQ.subtopic),
    'tpl:gen-deleted-generator': card('tpl:gen-deleted-generator', liveG.subtopic),
    'rates-clocks-001': card('rates-clocks-001', 'rates-clocks'),
  },
  mastered: 4,
  mocks: [
    {
      id: 'done',
      formatId: 'm15',
      label: '15-minute mock',
      startedAt: 1,
      durationSec: 900,
      refs: [{ kind: 'static', id: 'deleted-question-999' }],
      answers: [0],
      flags: [false],
      current: 0,
      maxVisited: 0,
      submittedAt: 2,
      score: 80,
      timeUsedSec: 100,
    },
    {
      id: 'live',
      formatId: 'm15',
      label: '15-minute mock',
      startedAt: 1,
      durationSec: 900,
      refs: [{ kind: 'static', id: 'deleted-question-999' }, { kind: 'static', id: liveQ.id }, { kind: 'gen', id: 'gen-deleted-generator', seed: 1 }, { kind: 'gen', id: liveG.id, seed: 2 }],
      answers: [0, 1, 2, 3],
      flags: [true, false, true, true],
      current: 3,
      maxVisited: 3,
    },
  ],
  activeMockId: 'live',
  theme: 'dark',
  practiceTimer: true,
  practiceDiff: 'challenge',
  daily: { '2026-01-01': 12 },
  last: { path: '/learn/rates-clocks', label: 'Rates lesson', at: 1 },
  stage: { [liveQ.subtopic]: 3, 'rates-clocks': 2 },
};

describe('loading old progress', () => {
  const s = sanitizeState(OLD);

  it('drops attempts, mistakes, flags and lesson marks for things that no longer exist', () => {
    expect(s.attempts.map((a) => a.sourceId)).toEqual([liveQ.id, liveG.id]);
    expect(Object.keys(s.mistakes).sort()).toEqual([liveQ.id, `tpl:${liveG.id}`].sort());
    expect(s.flags).toEqual([liveQ.id, `gen:${liveG.id}:1`]);
    expect(s.read).toEqual([liveQ.subtopic]);
    expect(s.stage).toEqual({ [liveQ.subtopic]: 3 });
    expect(s.last).toBeNull();
  });

  it('removes the practice timer setting and resets a Challenge filter', () => {
    expect('practiceTimer' in s).toBe(false);
    expect((s as unknown as Record<string, unknown>).practiceDiff).toBe('mixed');
  });

  it('keeps everything else', () => {
    expect(s.theme).toBe('dark');
    expect(s.mastered).toBe(4);
    expect(s.daily).toEqual({ '2026-01-01': 12 });
  });

  it('keeps finished mock scores, and removes deleted questions from a mock in progress', () => {
    expect(s.mocks.find((m) => m.id === 'done')?.score).toBe(80);
    const live = s.mocks.find((m) => m.id === 'live')!;
    expect(live.refs).toEqual([{ kind: 'static', id: liveQ.id }, { kind: 'gen', id: liveG.id, seed: 2 }]);
    expect(live.answers).toEqual([1, 3]);
    expect(live.flags).toEqual([false, true]);
    expect(live.current).toBe(1);
    expect(live.maxVisited).toBe(1);
    expect(s.activeMockId).toBe('live');
  });

  it('never throws on damaged data', () => {
    for (const bad of [null, undefined, 3, 'x', [], {}, { attempts: 'x', mistakes: 1, flags: {}, mocks: [null, 1, {}], read: 7, stage: [], last: 'x', daily: null }]) {
      expect(() => sanitizeState(bad)).not.toThrow();
    }
    expect(sanitizeState(null)).toEqual(emptyState());
  });

  it('an active mock that lost every question is closed', () => {
    const only = { ...OLD.mocks[1], refs: [{ kind: 'static', id: 'deleted-question-999' }], answers: [0], flags: [false] };
    const r = sanitizeState({ ...OLD, mocks: [only], activeMockId: 'live' });
    expect(r.mocks).toEqual([]);
    expect(r.activeMockId).toBeNull();
  });

  it('importing an old export cleans it too', () => {
    importJson(JSON.stringify({ app: 'mbzuai-screening-prep', state: OLD }));
    expect(getState().attempts.map((a) => a.sourceId)).toEqual([liveQ.id, liveG.id]);
    resetAll();
  });
});
