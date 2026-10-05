import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EXAM } from '../config/exam';
import { refForMistake } from '../engine/select';
import { GEN_BY_ID, STATIC_BY_ID, refKey } from '../engine/bank';
import { dueMistakes, getState, useStore, type MistakeCard } from '../store/progress';
import { subtopicInfo } from '../syllabus';
import { toPlain } from '../lib/richtext';
import { QuestionSession } from '../components/QuestionSession';

const DAY = 86_400_000;

function cardTitle(c: MistakeCard): string {
  if (c.key.startsWith('tpl:')) return `${GEN_BY_ID.get(c.key.slice(4))?.title ?? 'Generated question'} (fresh variant each time)`;
  return toPlain(STATIC_BY_ID.get(c.key)?.stem ?? c.key).slice(0, 120);
}

export function Mistakes() {
  const cards = useStore((s) => s.mistakes);
  const mastered = useStore((s) => s.mastered);
  const [run, setRun] = useState<'due' | 'all' | null>(null);
  const all = useMemo(() => Object.values(cards).sort((a, b) => a.due - b.due), [cards]);
  const due = dueMistakes({ ...getState(), mistakes: cards });

  // Snapshot the queue when a review starts, so answering doesn't reshuffle it.
  const [queue, setQueue] = useState<MistakeCard[]>([]);
  const next = useCallback(
    (used: Set<string>) => {
      for (const c of queue) {
        if (used.has(`card:${c.key}`)) continue;
        used.add(`card:${c.key}`);
        const r = refForMistake(c);
        if (r && !used.has(refKey(r))) return r;
      }
      return null;
    },
    [queue],
  );

  if (run)
    return (
      <div className="page">
        <QuestionSession mode="mistakes" title="Mistakes review" onExit={() => setRun(null)} next={next} limit={queue.length} />
      </div>
    );

  const start = (mode: 'due' | 'all') => {
    setQueue(mode === 'due' ? due : all);
    setRun(mode);
  };

  return (
    <div className="page">
      <header className="page-head">
        <h1>Mistakes</h1>
        <p className="lede">
          Every question you get wrong lands here and comes back after {EXAM.mistakeIntervalsDays.join(', then ')} days. Get it right and it moves up a
          level; get it wrong and it starts again. Generated questions come back with new numbers, so you learn the method, not the answer.
        </p>
      </header>
      <section className="summary-grid">
        <div className="card">
          <p className="metric">{due.length}<span className="metric-sub">due today</span></p>
        </div>
        <div className="card">
          <p className="metric">{all.length}<span className="metric-sub">in the deck</span></p>
        </div>
        <div className="card">
          <p className="metric">{mastered}<span className="metric-sub">mastered</span></p>
        </div>
      </section>
      <div className="row-actions">
        <button type="button" className="btn-primary" disabled={!due.length} onClick={() => start('due')}>
          Review {due.length} due
        </button>
        <button type="button" className="btn-ghost" disabled={!all.length} onClick={() => start('all')}>
          Review the whole deck now
        </button>
      </div>
      {all.length === 0 ? (
        <p className="empty">
          No mistakes yet. Questions you get wrong in <Link to="/practice">practice</Link>, <Link to="/feed">general questions</Link> or{' '}
          <Link to="/mock">mock exams</Link> will appear here.
        </p>
      ) : (
        <table className="data-table deck">
          <thead>
            <tr>
              <th>Question</th>
              <th>Topic</th>
              <th>Level</th>
              <th>Next review</th>
            </tr>
          </thead>
          <tbody>
            {all.map((c) => (
              <tr key={c.key}>
                <td>{cardTitle(c)}</td>
                <td>{subtopicInfo(c.sub).name}</td>
                <td>
                  {c.level + 1} of {EXAM.mistakeIntervalsDays.length}
                </td>
                <td>{c.due <= Date.now() ? <strong>Due now</strong> : `in ${Math.ceil((c.due - Date.now()) / DAY)} day(s)`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
