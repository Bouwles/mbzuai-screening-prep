// Engine tests: mock exam assembly, serving every question, apportioning.
import { describe, expect, it } from 'vitest';
import { apportion, buildMock, stepLevel } from '../src/engine/select';
import { levelFor } from '../src/engine/mastery';
import { hintsFor } from '../src/lib/hints';
import { VIDEOS } from '../src/config/videos';
import { hasSubtopic, SUBTOPICS } from '../src/syllabus';
import { GENERATORS, STATIC, serve } from '../src/engine/bank';
import { EXAM } from '../src/config/exam';
import { subtopicInfo } from '../src/syllabus';

describe('config', () => {
  it('weights and difficulty mix add up to 1', () => {
    expect(Object.values(EXAM.areaWeights).reduce((x: number, y) => x + y, 0)).toBeCloseTo(1);
    expect(Object.values(EXAM.difficultyMix).reduce((x: number, y) => x + y, 0)).toBeCloseTo(1);
  });
});

describe('apportion', () => {
  it('splits a total exactly', () => {
    const r = apportion(13, { a: 0.45, b: 0.25, c: 0.15, d: 0.15 });
    expect(Object.values(r).reduce((x, y) => x + y, 0)).toBe(13);
    expect(r.a).toBe(6);
  });
});

describe('mock exams', () => {
  for (const f of EXAM.mockFormats) {
    it(`${f.label}: ${f.questions} distinct questions with the configured area split`, () => {
      for (let seed = 1; seed <= 25; seed++) {
        const qs = buildMock(f.questions, seed).map((r) => serve(r)!);
        expect(qs.length).toBe(f.questions);
        expect(qs.every(Boolean)).toBe(true);
        expect(new Set(qs.map((q) => q.key)).size).toBe(f.questions);
        const want = apportion(f.questions, EXAM.areaWeights as Record<string, number>);
        for (const [area, n] of Object.entries(want)) expect(qs.filter((q) => subtopicInfo(q.subtopic).area.id === area).length).toBe(n);
      }
    });
  }
});

describe('serving', () => {
  it('every static question serves with its correct answer intact', () => {
    for (const q of STATIC) {
      const s = serve({ kind: 'static', id: q.id })!;
      expect(s.options[s.correctIndex]).toBe(q.options[q.correctIndex]);
      expect(s.markScheme.whyWrong[s.correctIndex]).toBeNull();
    }
  });
  it('every generator serves', () => {
    for (const g of GENERATORS) {
      const s = serve({ kind: 'gen', id: g.id, seed: 12345 })!;
      expect(s.options.length).toBe(4);
      expect(s.markScheme.whyWrong[s.correctIndex]).toBeNull();
    }
  });
  it('correct answers are spread across A-D after shuffling', () => {
    const counts = [0, 0, 0, 0];
    STATIC.forEach((q) => counts[serve({ kind: 'static', id: q.id })!.correctIndex]++);
    for (const c of counts) expect(c).toBeGreaterThan(STATIC.length * 0.15);
  });
});

describe('mistakes deck (spaced repetition)', () => {
  it('wrong -> 1 day; each correct review -> 3, 7, 14 days; then mastered; wrong again resets', async () => {
    const { recordAttempt, getState, resetAll } = await import('../src/store/progress');
    const DAY = 86_400_000;
    resetAll();
    const base = { key: 'x-1', sourceId: 'x-1', sub: 'vectors', chosen: 0, ms: 1 };
    let t = 1_000_000;
    recordAttempt({ ...base, correct: false, at: t, mode: 'practice' }, false);
    expect(getState().mistakes['x-1'].due).toBe(t + DAY);
    for (const days of [3, 7, 14]) {
      t += DAY;
      recordAttempt({ ...base, correct: true, at: t, mode: 'mistakes' }, false);
      expect(getState().mistakes['x-1'].due).toBe(t + days * DAY);
    }
    recordAttempt({ ...base, correct: true, at: t + 14 * DAY, mode: 'mistakes' }, false);
    expect(getState().mistakes['x-1']).toBeUndefined();
    expect(getState().mastered).toBe(1);
    // generated questions are tracked per template, not per seed
    recordAttempt({ ...base, key: 'gen:gen-a:5', sourceId: 'gen-a', seed: 5, correct: false, at: t, mode: 'feed' }, true);
    expect(getState().mistakes['tpl:gen-a']).toBeDefined();
    recordAttempt({ ...base, key: 'gen:gen-a:9', sourceId: 'gen-a', seed: 9, correct: true, at: t, mode: 'mistakes' }, true);
    expect(getState().mistakes['tpl:gen-a'].level).toBe(1);
    recordAttempt({ ...base, key: 'gen:gen-a:11', sourceId: 'gen-a', seed: 11, correct: false, at: t, mode: 'mistakes' }, true);
    expect(getState().mistakes['tpl:gen-a'].level).toBe(0);
  });
});

describe('learning flow', () => {
  it('hints never include the final paragraph, and drop the last calculation before a short answer line', () => {
    expect(hintsFor('Set up.\n\nWork.\n\nPutting it together, the answer is 7, which matches the check above.', 'key')).toEqual(['Set up.', 'Work.']);
    expect(hintsFor('Set up.\n\nRule.\n\n$$x = 3$$\n\nAnswer: $3$', 'key')).toEqual(['Set up.']);
    expect(hintsFor('All in one paragraph.', 'Use the key idea.')).toEqual(['Use the key idea.']);
  });

  it('every served question has at least one hint that is not the whole solution', () => {
    for (const q of STATIC) {
      const h = hintsFor(q.markScheme.solution, q.markScheme.keyIdea);
      expect(h.length, q.id).toBeGreaterThan(0);
      expect(h.join('\n\n'), q.id).not.toBe(q.markScheme.solution.trim());
    }
  });

  it('mastery needs accuracy and exam-level answers', () => {
    const f = (correct: boolean) => ({ correct, diff: 'foundation' as const });
    const e = (correct: boolean) => ({ correct, diff: 'exam' as const });
    expect(levelFor([]).level).toBe('new');
    expect(levelFor([e(true), e(true)]).level).toBe('started');
    expect(levelFor([f(true), f(true), f(true), f(true), f(true)]).level).toBe('developing'); // no exam-level evidence
    expect(levelFor([e(true), e(true), e(true), f(true), f(false)]).level).toBe('mastered');
    expect(levelFor([e(false), e(false), f(true), f(false)]).level).toBe('weak');
  });

  it('Build up moves to Exam after two hint-free rights and back after two wrongs', () => {
    expect(stepLevel([])).toBe('foundation');
    expect(stepLevel([{ correct: true }, { correct: true, hints: 1 }])).toBe('foundation');
    expect(stepLevel([{ correct: true }, { correct: true }])).toBe('exam');
    expect(stepLevel([{ correct: true }, { correct: true }, { correct: false }, { correct: false }])).toBe('foundation');
  });

  it('every subtopic has recommended videos with valid ids', () => {
    for (const s of SUBTOPICS) expect(VIDEOS[s.id]?.length, s.id).toBeGreaterThan(0);
    for (const [sub, vs] of Object.entries(VIDEOS)) {
      expect(hasSubtopic(sub), sub).toBe(true);
      for (const v of vs) expect(v.id, `${sub}: ${v.title}`).toMatch(/^[\w-]{11}$/);
    }
  });

  it('mock exams contain no Challenge questions', () => {
    for (let seed = 1; seed <= 10; seed++) expect(buildMock(53, seed).map((r) => serve(r)!).filter((q) => q.difficulty === 'challenge')).toEqual([]);
  });
});
