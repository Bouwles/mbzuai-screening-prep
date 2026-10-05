// One-question-at-a-time session with instant feedback and mark schemes.
// Layout follows Khan Academy / Brilliant / Duolingo practice screens: a focus view with the
// site navigation hidden, an exit button top-left, a thin progress bar, the question in a centred
// column and one primary action (Check -> Next) in a fixed bar at the bottom right.
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { EXAM } from '../config/exam';
import { refKey, serve } from '../engine/bank';
import { recordAttempt, toggleFlag, useStore, type Mode } from '../store/progress';
import type { QRef, ServedQuestion } from '../types';
import { useKeys } from './useKeys';
import { LETTERS, MarkScheme, QuestionMeta, QuestionView } from './QuestionView';

interface Props {
  mode: Mode;
  /** Shown top-left next to the exit button. */
  title: string;
  /** Returns the next question, or null when there are no more. */
  next: (used: Set<string>, count: number) => QRef | null;
  /** Number of questions, or null for endless. */
  limit: number | null;
  onExit?: () => void;
  onDone?: (results: { q: ServedQuestion; correct: boolean }[]) => ReactNode;
  showTopic?: boolean;
  /** 'focus' takes over the screen (default); 'inline' sits inside a page (lesson check questions). */
  variant?: 'focus' | 'inline';
}

/** Hides the site navigation while a focus session is on screen. */
function useFocusMode(on: boolean) {
  useEffect(() => {
    if (!on) return;
    document.body.classList.add('focus-mode');
    return () => document.body.classList.remove('focus-mode');
  }, [on]);
}

export function QuestionSession({ mode, title, next, limit, onExit, onDone, showTopic = true, variant = 'focus' }: Props) {
  const focus = variant === 'focus';
  useFocusMode(focus);
  const used = useRef(new Set<string>());
  const [results, setResults] = useState<{ q: ServedQuestion; correct: boolean; chosen: number }[]>([]);
  const [q, setQ] = useState<ServedQuestion | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const [exhausted, setExhausted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const started = useRef(Date.now());
  const msRef = useRef<HTMLDivElement>(null);
  const timerOn = useStore((s) => s.practiceTimer);
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
        setAnswered(false);
        setElapsed(0);
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

  useEffect(() => {
    if (answered || !q) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - started.current) / 1000)), 1000);
    return () => clearInterval(id);
  }, [answered, q]);

  const submit = () => {
    if (!q || selected === null || answered) return;
    const correct = selected === q.correctIndex;
    const ms = Date.now() - started.current;
    setElapsed(Math.floor(ms / 1000));
    recordAttempt({ key: q.key, sourceId: q.sourceId, sub: q.subtopic, correct, chosen: selected, ms, at: Date.now(), mode, seed: q.seed }, q.generated);
    setResults((r) => [...r, { q, correct, chosen: selected }]);
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
    window.scrollTo(0, 0);
  };

  useKeys((e) => {
    if (!q || finished) return;
    const k = e.key.toLowerCase();
    const idx = k.length === 1 ? ('1234'.includes(k) ? '1234'.indexOf(k) : 'abcd'.indexOf(k)) : -1;
    if (idx >= 0 && !answered) setSelected(idx);
    else if (k === 'enter') (answered ? goNext : submit)();
    else if (k === 'f') toggleFlag(q.key);
  });

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

  const pace = Math.round(EXAM.secondsPerQuestion);
  const correct = answered && selected === q.correctIndex;
  const qNumber = done + (answered ? 0 : 1);

  const actionBar = (
    <div className={`action-bar ${answered ? (correct ? 'is-ok' : 'is-bad') : ''} ${focus ? 'fixed' : ''}`}>
      <div className="action-inner">
        <div className="action-left">
          {answered ? (
            <div className="feedback" role="status">
              <span className="feedback-icon" aria-hidden>
                {correct ? '✓' : '✗'}
              </span>
              <div>
                <strong>{correct ? 'Correct' : 'Not quite'}</strong>
                <span>{correct ? `Answered in ${elapsed}s.` : `You chose ${LETTERS[selected!]}. The answer is ${LETTERS[q.correctIndex]}. See the mark scheme below.`}</span>
              </div>
            </div>
          ) : (
            <span className="action-meta">
              Question {qNumber}
              {limit !== null ? ` of ${limit}` : ''}
              {timerOn && (
                <span className={`pace ${elapsed > pace ? 'over' : ''}`} title="Time on this question compared with the real exam pace">
                  {elapsed}s of {pace}s
                </span>
              )}
            </span>
          )}
        </div>
        <div className="action-right">
          <button type="button" className={`btn-text ${flagged ? 'on' : ''}`} onClick={() => toggleFlag(q.key)} title="Flag this question (F)">
            {flagged ? '⚑ Flagged' : '⚐ Flag'}
          </button>
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
    </div>
  );

  return (
    <div className={`session ${focus ? 'is-focus' : 'is-inline'}`}>
      {topBar}
      <div className="session-col">
        <div className="q-head">
          <QuestionMeta q={q} showTopic={showTopic} />
        </div>
        <QuestionView q={q} selected={selected} onSelect={answered ? undefined : setSelected} reveal={answered} />
        {!focus && actionBar}
        {answered && (
          <div ref={msRef}>
            <MarkScheme q={q} selected={selected} />
          </div>
        )}
        <p className="kbd-hint">
          Shortcuts: <kbd>1</kbd>–<kbd>4</kbd> choose, <kbd>Enter</kbd> {answered ? 'next' : 'check'}, <kbd>F</kbd> flag
        </p>
      </div>
      {focus && actionBar}
    </div>
  );
}
