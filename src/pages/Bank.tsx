import { useMemo, useState } from 'react';
import { SYLLABUS, subtopicInfo } from '../syllabus';
import { GENERATORS, STATIC, serve } from '../engine/bank';
import { lastResultByKey, useStore } from '../store/progress';
import { toPlain } from '../lib/richtext';
import { QuestionSession } from '../components/QuestionSession';
import type { Difficulty, QRef } from '../types';
import { freshSeed } from '../lib/rng';

type Status = 'all' | 'unseen' | 'correct' | 'wrong' | 'flagged';
const PAGE = 40;

export function BankBrowser() {
  const s = useStore((x) => x);
  const last = useMemo(() => lastResultByKey(s), [s]);
  const [area, setArea] = useState('');
  const [topic, setTopic] = useState('');
  const [sub, setSub] = useState('');
  const [diff, setDiff] = useState<'' | Difficulty>('');
  const [status, setStatus] = useState<Status>('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState<QRef | null>(null);

  const areaObj = SYLLABUS.find((a) => a.id === area);
  const topicObj = areaObj?.topics.find((t) => t.id === topic);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STATIC.filter((x) => {
      const info = subtopicInfo(x.subtopic);
      if (area && info.area.id !== area) return false;
      if (topic && info.topic.id !== topic) return false;
      if (sub && x.subtopic !== sub) return false;
      if (diff && x.difficulty !== diff) return false;
      const r = last.get(x.id);
      if (status === 'unseen' && r !== undefined) return false;
      if (status === 'correct' && r !== true) return false;
      if (status === 'wrong' && r !== false) return false;
      if (status === 'flagged' && !s.flags.includes(x.id)) return false;
      if (q && !toPlain(`${x.stem} ${x.options.join(' ')} ${x.code?.source ?? ''} ${info.name}`).toLowerCase().includes(q)) return false;
      return true;
    });
  }, [area, topic, sub, diff, status, query, last, s.flags]);

  const gens = GENERATORS.filter((g) => {
    const info = subtopicInfo(g.subtopic);
    return (!area || info.area.id === area) && (!topic || info.topic.id === topic) && (!sub || g.subtopic === sub) && (!diff || g.difficulty === diff);
  });

  if (open)
    return (
      <div className="page">
        <QuestionSession mode="bank" title="Question bank" onExit={() => setOpen(null)} next={(used) => (used.size ? null : open)} limit={1} />
      </div>
    );

  const shown = rows.slice(page * PAGE, page * PAGE + PAGE);
  const reset = () => setPage(0);

  return (
    <div className="page">
      <header className="page-head">
        <h1>Question bank</h1>
        <p className="lede">
          {STATIC.length.toLocaleString()} hand-written questions and {GENERATORS.length} generators that make fresh variants on demand.
        </p>
      </header>
      <div className="filters">
        <select
          value={area}
          onChange={(e) => {
            setArea(e.target.value);
            setTopic('');
            setSub('');
            reset();
          }}
          aria-label="Area"
        >
          <option value="">All areas</option>
          {SYLLABUS.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <select
          value={topic}
          disabled={!areaObj}
          onChange={(e) => {
            setTopic(e.target.value);
            setSub('');
            reset();
          }}
          aria-label="Topic"
        >
          <option value="">All topics</option>
          {areaObj?.topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <select
          value={sub}
          disabled={!topicObj}
          onChange={(e) => {
            setSub(e.target.value);
            reset();
          }}
          aria-label="Subtopic"
        >
          <option value="">All subtopics</option>
          {topicObj?.subtopics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <select
          value={diff}
          onChange={(e) => {
            setDiff(e.target.value as Difficulty | '');
            reset();
          }}
          aria-label="Difficulty"
        >
          <option value="">All difficulties</option>
          <option value="foundation">Foundation</option>
          <option value="exam">Exam</option>
          <option value="challenge">Challenge</option>
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as Status);
            reset();
          }}
          aria-label="Status"
        >
          <option value="all">Any status</option>
          <option value="unseen">Unseen</option>
          <option value="correct">Last answer correct</option>
          <option value="wrong">Last answer wrong</option>
          <option value="flagged">Flagged</option>
        </select>
        <input
          type="search"
          placeholder="Search by keyword"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            reset();
          }}
          aria-label="Search"
        />
      </div>
      <p className="muted">
        {rows.length} matching questions. Click one to answer it.
      </p>
      <ul className="bank-list">
        {shown.map((x) => {
          const r = last.get(x.id);
          const sq = serve({ kind: 'static', id: x.id })!;
          return (
            <li key={x.id}>
              <button type="button" className="bank-row" onClick={() => setOpen({ kind: 'static', id: x.id })}>
                <span className={`status-dot ${r === undefined ? '' : r ? 'ok' : 'bad'}`} title={r === undefined ? 'Unseen' : r ? 'Correct' : 'Wrong'} />
                <span className="bank-stem">{toPlain(sq.stem).slice(0, 150)}</span>
                <span className="bank-meta">
                  <span className="tag">{subtopicInfo(x.subtopic).name}</span>
                  <span className={`tag diff-${x.difficulty}`}>{x.difficulty[0].toUpperCase() + x.difficulty.slice(1)}</span>
                  {s.flags.includes(x.id) && <span className="tag tag-variant">Flagged</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {rows.length > PAGE && (
        <div className="pager-buttons">
          <button type="button" className="btn-ghost small" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span className="muted">
            Page {page + 1} of {Math.ceil(rows.length / PAGE)}
          </span>
          <button type="button" className="btn-ghost small" disabled={(page + 1) * PAGE >= rows.length} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}
      {status === 'all' && !query && gens.length > 0 && (
        <section className="panel gen-panel">
          <h2>Generators ({gens.length})</h2>
          <p className="muted">Each one builds a fresh question with new numbers every time.</p>
          <ul className="gen-list">
            {gens.map((g) => (
              <li key={g.id}>
                <button type="button" className="bank-row" onClick={() => setOpen({ kind: 'gen', id: g.id, seed: freshSeed() })}>
                  <span className="bank-stem">{g.title}</span>
                  <span className="bank-meta">
                    <span className="tag">{subtopicInfo(g.subtopic).name}</span>
                    <span className="tag tag-variant">Generated variant</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
