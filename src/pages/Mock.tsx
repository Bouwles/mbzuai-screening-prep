import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { EXAM, type MockFormat } from '../config/exam';
import { buildMock } from '../engine/select';
import { refKey, serve } from '../engine/bank';
import { getState, recordAttempt, update, useStore, type MockRecord } from '../store/progress';
import { SYLLABUS, subtopicInfo } from '../syllabus';
import { freshSeed } from '../lib/rng';
import { LETTERS, MarkScheme, QuestionMeta, QuestionView } from '../components/QuestionView';
import { QuestionSession } from '../components/QuestionSession';
import { ScoreChart } from '../components/ScoreChart';
import { useKeys } from '../components/useKeys';
import type { QRef, ServedQuestion } from '../types';

const fmtTime = (sec: number) => {
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}` : `${m}:${String(r).padStart(2, '0')}`;
};

export function startMock(f: MockFormat): string {
  const refs = buildMock(f.questions, freshSeed());
  const rec: MockRecord = {
    id: `mock-${Date.now().toString(36)}`,
    formatId: f.id,
    label: f.label,
    startedAt: Date.now(),
    durationSec: f.minutes * 60,
    refs,
    answers: refs.map(() => null),
    flags: refs.map(() => false),
    current: 0,
    maxVisited: 0,
  };
  update((s) => ({ ...s, mocks: [...s.mocks, rec], activeMockId: rec.id }));
  return rec.id;
}

/** Score a mock, record every answer (blank = wrong) and send mistakes to the Mistakes deck. */
function submitMock(id: string) {
  const rec = getState().mocks.find((m) => m.id === id);
  if (!rec || rec.submittedAt) return;
  const now = Date.now();
  let correct = 0;
  rec.refs.forEach((r, i) => {
    const q = serve(r);
    if (!q) return;
    const chosen = rec.answers[i];
    const ok = chosen === q.correctIndex;
    if (ok) correct++;
    recordAttempt({ key: q.key, sourceId: q.sourceId, sub: q.subtopic, correct: ok, chosen: chosen ?? -1, ms: 0, at: now, mode: 'mock', seed: q.seed }, q.generated);
  });
  const score = Math.round((100 * correct) / rec.refs.length);
  const timeUsedSec = Math.min(rec.durationSec, Math.round((now - rec.startedAt) / 1000));
  update((s) => ({
    ...s,
    activeMockId: s.activeMockId === id ? null : s.activeMockId,
    mocks: s.mocks.map((m) => (m.id === id ? { ...m, submittedAt: now, score, timeUsedSec } : m)),
  }));
}

function patchMock(id: string, fn: (m: MockRecord) => MockRecord) {
  update((s) => ({ ...s, mocks: s.mocks.map((m) => (m.id === id ? fn(m) : m)) }));
}

// ------------------------------------------------------------------ home + pre-exam screen
export function MockHome() {
  const mocks = useStore((s) => s.mocks);
  const activeId = useStore((s) => s.activeMockId);
  const [params, setParams] = useSearchParams();
  const nav = useNavigate();
  const chosen = EXAM.mockFormats.find((f) => f.id === params.get('start'));
  const done = mocks.filter((m) => m.submittedAt);
  const active = mocks.find((m) => m.id === activeId && !m.submittedAt);

  if (chosen)
    return (
      <div className="page pre-exam">
        <h1>{chosen.label}</h1>
        <p className="lede">
          {chosen.questions} questions · {chosen.minutes} minutes · about {Math.round((chosen.minutes * 60) / chosen.questions)} seconds per question
        </p>
        <section className="panel rules">
          <h2>Before you start</h2>
          <ul>
            <li>One attempt, one sitting. The clock cannot be paused, and keeps running if you close the tab.</li>
            <li>No negative marking, so answer every question. A blank scores the same as a wrong answer.</li>
            <li>You may use a physical calculator, blank paper and a pen. No notes, books, phone or other people.</li>
            <li>Sit somewhere quiet, as you would for the real AI-proctored exam.</li>
            <li>Each question has four options and exactly one correct answer. You can flag questions and go back to them.</li>
            <li>The Submit button appears once you reach the last question. The exam submits itself when time runs out.</li>
            <li>No feedback until the end. Then you get your score, a breakdown and a full mark scheme for every question.</li>
          </ul>
        </section>
        <div className="row-actions">
          <button
            type="button"
            className="btn-primary"
            disabled={!!active}
            onClick={() => {
              const id = startMock(chosen);
              nav(`/mock/run/${id}`, { replace: true });
            }}
          >
            Start the exam
          </button>
          <button type="button" className="btn-ghost" onClick={() => setParams({})}>
            Back
          </button>
        </div>
        {active && (
          <p className="warn">
            You already have a mock in progress. <Link to={`/mock/run/${active.id}`}>Return to it</Link> first.
          </p>
        )}
      </div>
    );

  return (
    <div className="page">
      <header className="page-head">
        <h1>Mock exams</h1>
        <p className="lede">Timed, exam-style papers drawn from all four areas. No feedback until you submit.</p>
      </header>
      {active && (
        <div className="panel live-panel">
          <strong>Mock in progress: {active.label}.</strong>{' '}
          <Link className="btn-primary" to={`/mock/run/${active.id}`}>
            Return to the exam
          </Link>
        </div>
      )}
      <div className="format-grid">
        {EXAM.mockFormats.map((f) => (
          <button key={f.id} type="button" className="format-card" onClick={() => setParams({ start: f.id })}>
            <span className="format-time">{f.minutes} min</span>
            <strong>{f.label}</strong>
            <span>{f.questions} questions</span>
            <span className="muted">{f.blurb}</span>
          </button>
        ))}
      </div>
      <section className="panel">
        <h2>Score history</h2>
        <ScoreChart mocks={done} />
        {done.length > 0 && (
          <table className="data-table history">
            <thead>
              <tr>
                <th>Date</th>
                <th>Format</th>
                <th>Score</th>
                <th>Time used</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {done
                .slice()
                .reverse()
                .map((m) => (
                  <tr key={m.id}>
                    <td>{new Date(m.startedAt).toLocaleString()}</td>
                    <td>{m.label}</td>
                    <td className={m.score! >= EXAM.targetPercent ? 'pass' : 'below'}>{m.score}%</td>
                    <td>{fmtTime(m.timeUsedSec ?? 0)}</td>
                    <td>
                      <Link to={`/mock/results/${m.id}`}>Review</Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

// ------------------------------------------------------------------ the exam itself
export function MockRun() {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const rec = useStore((s) => s.mocks.find((m) => m.id === id));
  const [now, setNow] = useState(Date.now());
  const [confirm, setConfirm] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [timerHidden, setTimerHidden] = useState(false);
  const questions = useMemo(() => rec?.refs.map((r) => serve(r)) ?? [], [rec?.id]);

  const remaining = rec ? rec.startedAt + rec.durationSec * 1000 - now : 0;

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!rec) return;
    if (rec.submittedAt) nav(`/mock/results/${rec.id}`, { replace: true });
    else if (remaining <= 0) {
      submitMock(rec.id);
      nav(`/mock/results/${rec.id}`, { replace: true });
    }
  }, [rec, remaining, nav]);

  const go = (i: number) => {
    if (!rec) return;
    const c = Math.max(0, Math.min(rec.refs.length - 1, i));
    patchMock(rec.id, (m) => ({ ...m, current: c, maxVisited: Math.max(m.maxVisited, c) }));
  };
  const choose = (i: number) => rec && patchMock(rec.id, (m) => ({ ...m, answers: m.answers.map((a, k) => (k === m.current ? i : a)) }));
  const flag = () => rec && patchMock(rec.id, (m) => ({ ...m, flags: m.flags.map((f, k) => (k === m.current ? !f : f)) }));

  useKeys((e) => {
    if (!rec || confirm) return;
    const k = e.key.toLowerCase();
    const idx = '1234'.indexOf(k) >= 0 && k.length === 1 ? '1234'.indexOf(k) : 'abcd'.indexOf(k) >= 0 && k.length === 1 ? 'abcd'.indexOf(k) : -1;
    if (idx >= 0) choose(idx);
    else if (k === 'f') flag();
    else if (k === 'arrowright' || k === 'enter') go(rec.current + 1);
    else if (k === 'arrowleft') go(rec.current - 1);
  });

  if (!rec) return <p className="empty">This mock exam doesn't exist.</p>;
  const q = questions[rec.current];
  const n = rec.refs.length;
  const unanswered = rec.answers.filter((a) => a === null).length;
  const canSubmit = rec.maxVisited >= n - 1;
  const lowTime = remaining < 5 * 60 * 1000;

  const doSubmit = () => {
    submitMock(rec.id);
    nav(`/mock/results/${rec.id}`, { replace: true });
  };

  return (
    <div className="exam">
      <header className="exam-top">
        <span className="exam-title">{rec.label}</span>
        <div className="exam-timer">
          {timerHidden && !lowTime ? (
            <span className="timer muted">Timer hidden</span>
          ) : (
            <span className={`timer ${lowTime ? 'low' : ''}`} role="timer">
              {fmtTime(remaining / 1000)}
            </span>
          )}
          <button type="button" className="btn-text small" onClick={() => setTimerHidden((h) => !h)}>
            {timerHidden && !lowTime ? 'Show' : 'Hide'}
          </button>
        </div>
        <span />
      </header>

      <main className="exam-col">
        <div className="exam-qhead">
          <span className="qnum">{rec.current + 1}</span>
          <button type="button" className={`btn-text ${rec.flags[rec.current] ? 'on' : ''}`} onClick={flag}>
            {rec.flags[rec.current] ? '⚑ Marked for review' : '⚐ Mark for review'}
          </button>
        </div>
        {q ? <QuestionView q={q} selected={rec.answers[rec.current]} onSelect={choose} /> : <p className="empty">Question unavailable.</p>}
        <p className="kbd-hint">
          Shortcuts: <kbd>1</kbd>–<kbd>4</kbd> or <kbd>A</kbd>–<kbd>D</kbd> choose, <kbd>F</kbd> mark for review, <kbd>←</kbd> <kbd>→</kbd> move
        </p>
      </main>

      <footer className="exam-bottom">
        <div className="exam-bottom-inner">
          <span className="exam-answered muted">
            {n - unanswered} of {n} answered
          </span>
          <div className="nav-pop-wrap">
            <button type="button" className="nav-toggle" aria-expanded={showNav} onClick={() => setShowNav((v) => !v)}>
              Question {rec.current + 1} of {n} <span aria-hidden>{showNav ? '▾' : '▴'}</span>
            </button>
            {showNav && (
              <div className="nav-pop" role="dialog" aria-label="Question navigator">
                <div className="nav-grid">
                  {rec.refs.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`nav-cell ${rec.answers[i] !== null ? 'answered' : ''} ${rec.flags[i] ? 'flagged' : ''} ${i === rec.current ? 'current' : ''}`}
                      onClick={() => {
                        go(i);
                        setShowNav(false);
                      }}
                      aria-label={`Question ${i + 1}${rec.answers[i] !== null ? ', answered' : ', unanswered'}${rec.flags[i] ? ', marked for review' : ''}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <ul className="nav-legend">
                  <li>
                    <span className="nav-cell answered sample" /> Answered
                  </li>
                  <li>
                    <span className="nav-cell sample" /> Unanswered ({unanswered})
                  </li>
                  <li>
                    <span className="nav-cell flagged sample" /> For review ({rec.flags.filter(Boolean).length})
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="exam-buttons">
            <button type="button" className="btn-secondary" disabled={rec.current === 0} onClick={() => go(rec.current - 1)}>
              Back
            </button>
            {rec.current < n - 1 && (
              <button type="button" className="btn-primary" onClick={() => go(rec.current + 1)}>
                Next
              </button>
            )}
            {canSubmit && (
              <button type="button" className={rec.current === n - 1 ? 'btn-primary' : 'btn-secondary'} onClick={() => setConfirm(true)}>
                Submit
              </button>
            )}
          </div>
        </div>
      </footer>
      {confirm && (
        <div className="modal-back" role="dialog" aria-modal="true" aria-labelledby="submit-title">
          <div className="modal">
            <h2 id="submit-title">Submit your exam?</h2>
            {unanswered > 0 ? (
              <p className="warn">
                You have {unanswered} unanswered question{unanswered > 1 ? 's' : ''}. There is no negative marking, so a guess can only help.
              </p>
            ) : (
              <p>All questions answered. You can't change answers after submitting.</p>
            )}
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setConfirm(false)}>
                Keep working
              </button>
              <button type="button" className="btn-primary" onClick={doSubmit}>
                Submit now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ results + review
export function MockResults() {
  const { id = '' } = useParams();
  const rec = useStore((s) => s.mocks.find((m) => m.id === id));
  const [practise, setPractise] = useState(false);
  const [filter, setFilter] = useState<'all' | 'wrong'>('all');
  const qs = useMemo(() => (rec ? rec.refs.map((r) => serve(r)) : []), [rec?.id]);
  // Wrong or blank questions: the same static question again, or a fresh variant of a generated one.
  const wrongRefs = useMemo<QRef[]>(
    () =>
      qs.flatMap((q, i) =>
        !q || rec?.answers[i] === q.correctIndex ? [] : [q.generated ? { kind: 'gen' as const, id: q.sourceId, seed: freshSeed() } : { kind: 'static' as const, id: q.sourceId }],
      ),
    [qs],
  );
  if (!rec) return <p className="empty">This mock exam doesn't exist.</p>;
  if (!rec.submittedAt)
    return (
      <p className="empty">
        This mock is still running. <Link to={`/mock/run/${rec.id}`}>Return to it</Link>.
      </p>
    );
  const items = qs.map((q, i) => ({ q, i, chosen: rec.answers[i], ok: !!q && rec.answers[i] === q.correctIndex })).filter((x) => x.q) as {
    q: ServedQuestion;
    i: number;
    chosen: number | null;
    ok: boolean;
  }[];
  const correct = items.filter((x) => x.ok).length;
  const pass = rec.score! >= EXAM.targetPercent;

  const byArea = SYLLABUS.map((a) => {
    const xs = items.filter((x) => x.q.area === a.id);
    return { name: a.name, n: xs.length, ok: xs.filter((x) => x.ok).length };
  }).filter((x) => x.n);
  const subMap = new Map<string, { n: number; ok: number }>();
  items.forEach((x) => {
    const v = subMap.get(x.q.subtopic) ?? { n: 0, ok: 0 };
    v.n++;
    if (x.ok) v.ok++;
    subMap.set(x.q.subtopic, v);
  });
  const bySub = [...subMap.entries()].sort((a, b) => a[1].ok / a[1].n - b[1].ok / b[1].n);

  if (practise)
    return (
      <div className="page">
        <QuestionSession
          title="Mistakes from this exam"
          onExit={() => setPractise(false)}
          mode="practice" limit={wrongRefs.length} next={(used) => wrongRefs.find((r) => !used.has(refKey(r))) ?? null} />
      </div>
    );

  return (
    <div className="page results">
      <header className="page-head">
        <h1>{rec.label}: results</h1>
        <p className="muted">{new Date(rec.startedAt).toLocaleString()}</p>
      </header>
      <section className="result-hero">
        <div className={`score-dial ${pass ? 'pass' : 'below'}`}>
          <span className="score-pct">{rec.score}%</span>
          <span>
            {correct} / {items.length} correct
          </span>
        </div>
        <div className="score-bar-wrap">
          <div className="score-bar" aria-label={`Score ${rec.score}%, target ${EXAM.targetPercent}%`}>
            <span className="score-fill" style={{ width: `${rec.score}%` }} />
            <span className="score-target" style={{ left: `${EXAM.targetPercent}%` }}>
              <span>{EXAM.targetPercent}% target</span>
            </span>
          </div>
          <p>
            {pass
              ? `At or above the ${EXAM.targetPercent}% line. Keep it there.`
              : `${EXAM.targetPercent - rec.score!} percentage points below the ${EXAM.targetPercent}% line.`}{' '}
            Time used: {fmtTime(rec.timeUsedSec ?? 0)} of {fmtTime(rec.durationSec)}.
          </p>
          <div className="row-actions">
            {wrongRefs.length > 0 && (
              <button type="button" className="btn-primary" onClick={() => setPractise(true)}>
                Practise my mistakes from this exam ({wrongRefs.length})
              </button>
            )}
            <Link className="btn-secondary" to="/mock">
              All mock exams
            </Link>
          </div>
        </div>
      </section>

      <div className="two-col results-grid">
        <section className="card">
          <h2>By area</h2>
          <ul className="topic-rows">
            {byArea.map((a) => (
              <li key={a.name}>
                <div className="topic-row-main">
                  <span className="topic-row-name">{a.name}</span>
                  <span className="mastery" aria-hidden>
                    <span style={{ width: `${(100 * a.ok) / a.n}%` }} />
                  </span>
                  <span className="topic-row-pct">
                    {a.ok}/{a.n}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="card">
          <h2>By subtopic</h2>
          <table className="data-table compact-table">
            <tbody>
              {bySub.map(([sub, v]) => (
                <tr key={sub}>
                  <td>
                    <Link to={`/learn/${sub}`}>{subtopicInfo(sub).name}</Link>
                  </td>
                  <td className={v.ok === v.n ? 'pass' : v.ok === 0 ? 'below' : ''}>
                    {v.ok}/{v.n}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <section className="review">
        <div className="card-head review-head-bar">
          <h2>Review every question</h2>
          <div className="seg small" role="radiogroup" aria-label="Show">
            <button type="button" role="radio" aria-checked={filter === 'all'} className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')}>
              All
            </button>
            <button type="button" role="radio" aria-checked={filter === 'wrong'} className={filter === 'wrong' ? 'on' : ''} onClick={() => setFilter('wrong')}>
              Wrong or blank only
            </button>
          </div>
        </div>
        {items
          .filter((x) => filter === 'all' || !x.ok)
          .map((x) => (
            <article key={x.i} className={`review-item ${x.ok ? 'ok' : 'bad'}`}>
              <header className="review-head">
                <strong>Question {x.i + 1}</strong>
                <span className={x.ok ? 'pass' : 'below'}>
                  {x.ok ? 'Correct' : x.chosen === null ? 'Not answered' : `Wrong: you chose ${LETTERS[x.chosen]}`}
                </span>
                <QuestionMeta q={x.q} />
              </header>
              <QuestionView q={x.q} selected={x.chosen} reveal />
              <details open={!x.ok}>
                <summary>Mark scheme</summary>
                <MarkScheme q={x.q} selected={x.chosen} />
              </details>
            </article>
          ))}
      </section>
    </div>
  );
}
