// One-question-at-a-time session with instant feedback and mark schemes.
// The question is drawn in the exam layout. Under it, the practice panel holds what only practice
// has: hints, Check, feedback, the mark scheme and Next.
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { hintsFor } from '../lib/hints';
import { toPlain } from '../lib/richtext';
import { Rich, RichInline } from './Rich';
import { refKey, serve } from '../engine/bank';
import { recordAttempt, toggleFlag, useStore, type Mode } from '../store/progress';
import type { QRef, ServedQuestion } from '../types';
import { useKeys } from './useKeys';
import { Explanation } from './Explanation';
import { QuestionMeta } from './QuestionView';
import { ExamQuestion } from './exam/ExamQuestion';

interface Props {
  mode: Mode;
  /** Shown top-left next to the exit button. */
  title: string;
  /** Returns the next question, or null when there are no more. */
  next: (used: Set<string>, count: number) => QRef | null;
  /** Number of questions, or null for endless. */
  limit: number | null;
  onExit?: () => void;
  onDone?: (results: SessionResult[]) => ReactNode;
  showTopic?: boolean;
  /** 'focus' takes over the screen (default); 'inline' sits inside a page (lesson check questions). */
  variant?: 'focus' | 'inline';
  /**
   * Progressive hints, one solution step at a time. 'open': encouraged (guided practice).
   * 'quiet' (default): available but low-key, and a hinted answer does not count towards mastery. 'off': none.
   */
  hints?: 'open' | 'quiet' | 'off';
}

export interface SessionResult {
  q: ServedQuestion;
  correct: boolean;
  chosen: number;
  hints: number;
}

/** Hints revealed so far. */
function HintPanel({ hints, shown, open }: { hints: string[]; shown: number; open: boolean }) {
  if (!hints.length || (!shown && open)) return null;
  return (
    <section className="hint-panel" aria-label="Hints">
      {hints.slice(0, shown).map((h, i) => (
        <div key={i} className="hint">
          <span className="hint-label">Hint {i + 1}</span>
          <Rich text={h} />
        </div>
      ))}
      {shown === 0 && <span className="muted small-print">Answers after a hint don't count towards mastery.</span>}
    </section>
  );
}

/** The correct option for the feedback line. Long text is cut; maths can't be cut safely, so it stays whole. */
function AnswerText({ option }: { option: string }) {
  const plain = toPlain(option);
  if (!option.includes('$') && plain.length > 60) return <>{plain.slice(0, 60)}…</>;
  return <RichInline text={option} />;
}

/** Marks a full-width session while it's on screen. */
function useFocusMode(on: boolean) {
  useEffect(() => {
    if (!on) return;
    document.body.classList.add('focus-mode');
    return () => document.body.classList.remove('focus-mode');
  }, [on]);
}

export function QuestionSession({ mode, title, next, limit, onExit, onDone, showTopic = true, variant = 'focus', hints: hintMode = 'quiet' }: Props) {
  const focus = variant === 'focus';
  useFocusMode(focus);
  const used = useRef(new Set<string>());
  const [results, setResults] = useState<SessionResult[]>([]);
  const [hintsShown, setHintsShown] = useState(0);
  const [q, setQ] = useState<ServedQuestion | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const [exhausted, setExhausted] = useState(false);
  const started = useRef(Date.now());
  const msRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const flagged = useStore((s) => (q ? s.flags.includes(q.key) : false));

  const loadNext = useCallback(
    (count: number) => {
      for (let tries = 0; tries < 20; tries++) {
        const r = next(used.current, count);
        if (!r) break;
        const sq = serve(r);
        if (!sq) continue;
        used.current.add(refKey(r));
        setQ(sq);
        setSelected(null);
        setHintsShown(0);
        setAnswered(false);
        started.current = Date.now();
        return;
      }
      setQ(null);
      setExhausted(true);
    },
    [next],
  );

  // Load the first question once. (Not on every `next` change, so hot reloads don't skip questions.)
  const loaded = useRef(false);
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    loadNext(0);
  }, [loadNext]);

  const submit = () => {
    if (!q || selected === null || answered) return;
    const correct = selected === q.correctIndex;
    const ms = Date.now() - started.current;
    recordAttempt(
      { key: q.key, sourceId: q.sourceId, sub: q.subtopic, correct, chosen: selected, ms, at: Date.now(), mode, seed: q.seed, ...(hintsShown ? { hints: hintsShown } : {}) },
      q.generated,
    );
    setResults((r) => [...r, { q, correct, chosen: selected, hints: hintsShown }]);
    setAnswered(true);
    if (!correct) setTimeout(() => msRef.current?.scrollIntoView({ block: 'start' }), 0);
  };

  const goNext = () => {
    if (!answered) return;
    if (limit !== null && results.length >= limit) {
      setFinished(true);
      return;
    }
    loadNext(results.length);
    // Focus view: back to the top of the page. Inline (in a lesson): only back to the top of this question.
    if (focus) window.scrollTo(0, 0);
    else if ((rootRef.current?.getBoundingClientRect().top ?? 0) < 0) rootRef.current?.scrollIntoView({ block: 'start' });
  };

  useKeys((e) => {
    if (!q || finished) return;
    const k = e.key.toLowerCase();
    const idx = k.length === 1 ? ('1234'.includes(k) ? '1234'.indexOf(k) : 'abcd'.indexOf(k)) : -1;
    if (idx >= 0 && !answered) setSelected(idx);
    else if (k === 'enter') (answered ? goNext : submit)();
    else if (k === 'f') toggleFlag(q.key);
    else if (k === 'h' && !answered && hintMode !== 'off') setHintsShown((n) => Math.min(n + 1, hintList.length));
  });

  const hintList = useMemo(() => (q && hintMode !== 'off' ? hintsFor(q.markScheme.solution, q.markScheme.keyIdea) : []), [q, hintMode]);
  const score = results.filter((r) => r.correct).length;
  const done = results.length;
  const progress = limit ? Math.min(1, done / limit) : 0;

  const topBar = focus && (
    <header className="focus-top">
      {onExit && (
        <button type="button" className="exit-btn" onClick={onExit} aria-label="Exit session">
          <span aria-hidden>✕</span> Exit
        </button>
      )}
      <span className="focus-title">{title}</span>
      <div className="focus-progress" aria-hidden>
        {limit ? <span style={{ width: `${progress * 100}%` }} /> : null}
      </div>
      <span className="focus-score">
        {done > 0 ? `${score} of ${done} right` : limit ? `${limit} questions` : 'Endless'}
      </span>
    </header>
  );

  if (finished || (exhausted && done)) {
    const pct = Math.round((100 * score) / Math.max(1, done));
    return (
      <div className={`session ${focus ? 'is-focus' : 'is-inline'}`}>
        {topBar}
        <div className="session-col summary">
          <p className="summary-kicker">Session complete</p>
          <p className="big-score">
            {score} out of {done}
          </p>
          <p className="muted">{pct}% correct</p>
          <ol className="summary-list">
            {results.map((r, i) => (
              <li key={i} className={r.correct ? 'ok' : 'bad'}>
                <span className="mark">{r.correct ? '✓' : '✗'}</span>
                <QuestionMeta q={r.q} />
                {r.hints > 0 && <span className="muted small-print">with {r.hints === 1 ? 'a hint' : `${r.hints} hints`}</span>}
              </li>
            ))}
          </ol>
          {onDone?.(results)}
        </div>
      </div>
    );
  }
  if (exhausted)
    return (
      <div className={`session ${focus ? 'is-focus' : 'is-inline'}`}>
        {topBar}
        <p className="session-col empty">No questions match these settings yet. Choose another topic or difficulty.</p>
      </div>
    );
  if (!q) return <p className="empty">Loading…</p>;

  const correct = answered && selected === q.correctIndex;
  const qNumber = done + (answered ? 0 : 1);
  const moreHints = !answered && hintMode !== 'off' && hintsShown < hintList.length;

  return (
    <div className={`session ${focus ? 'is-focus' : 'is-inline'}`} ref={rootRef}>
      {topBar}
      <div className="ex ex-practice">
        <ExamQuestion
          number={qNumber}
          q={q}
          selected={selected}
          onSelect={answered ? undefined : setSelected}
          onReset={() => setSelected(null)}
          marked={flagged}
          onToggleMark={() => toggleFlag(q.key)}
          mode="practice"
          reveal={answered ? { correctIndex: q.correctIndex } : undefined}
          locked={answered}
        />
        <div className="ex-panel">
          <QuestionMeta q={q} showTopic={showTopic} />
          {!answered && hintMode !== 'off' && <HintPanel hints={hintList} shown={hintsShown} open={hintMode === 'open'} />}
          <div aria-live="polite">
            {answered && (
              <div ref={msRef} className={`ex-answer-note ${correct ? 'is-ok' : 'is-bad'}`}>
                <div className="feedback">
                  <span className="feedback-icon" aria-hidden>
                    {correct ? '✓' : '✗'}
                  </span>
                  <div>
                    <strong>{correct ? 'Correct' : 'Not quite'}</strong>
                    {correct ? (
                      <span>Nice — that's right.</span>
                    ) : (
                      <span>
                        The answer is: <AnswerText option={q.options[q.correctIndex]} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          {answered && <Explanation q={q} selected={selected} />}
        </div>
        <div className="ex-actions">
          {!answered && (
            <span className="ex-actions-meta">
              Question {qNumber}
              {limit !== null ? ` of ${limit}` : ''}
            </span>
          )}
          <div className="ex-actions-right">
            {moreHints && (
              <button type="button" className={hintMode === 'open' ? 'btn-secondary' : 'btn-text'} onClick={() => setHintsShown((n) => n + 1)} title="Show a hint (H)">
                {hintsShown === 0 ? 'Hint' : `Next hint (${hintsShown + 1} of ${hintList.length})`}
              </button>
            )}
            {!answered ? (
              <button type="button" className="btn-primary btn-lg" disabled={selected === null} onClick={submit}>
                Check
              </button>
            ) : (
              <button type="button" className={`btn-primary btn-lg ${correct ? 'btn-ok' : 'btn-bad'}`} onClick={goNext}>
                {limit !== null && done >= limit ? 'See results' : 'Next question'}
              </button>
            )}
          </div>
        </div>
        <p className="ex-keys kbd-hint">
          Shortcuts: <kbd>1</kbd>–<kbd>4</kbd> choose, <kbd>Enter</kbd> {answered ? 'next' : 'check'}, <kbd>F</kbd> mark
          {hintMode !== 'off' && !answered && (
            <>
              , <kbd>H</kbd> hint
            </>
          )}
        </p>
      </div>
    </div>
  );
}
