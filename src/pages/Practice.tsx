import { useCallback, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SYLLABUS, SUBTOPICS, hasSubtopic } from '../syllabus';
import { generatorsForSubtopic, staticForSubtopic } from '../engine/bank';
import { nextPractice, type DiffChoice } from '../engine/select';
import { QuestionSession } from '../components/QuestionSession';
import { Rng, freshSeed } from '../lib/rng';

const DIFFS: { id: DiffChoice; label: string; hint: string }[] = [
  { id: 'foundation', label: 'Foundation', hint: 'Basics, one or two steps' },
  { id: 'exam', label: 'Exam', hint: 'Typical exam questions' },
  { id: 'challenge', label: 'Challenge', hint: 'Harder, multi-step' },
  { id: 'mixed', label: 'Mixed', hint: 'All levels' },
];
const COUNTS: (number | null)[] = [10, 20, 30, null];

export function Practice() {
  const [params] = useSearchParams();
  const initial = (params.get('subs') ?? '').split(',').filter(hasSubtopic);
  const [subs, setSubs] = useState<string[]>(initial);
  const [diff, setDiff] = useState<DiffChoice>('mixed');
  const [count, setCount] = useState<number | null>(10);
  const [run, setRun] = useState(0);

  const toggle = (ids: string[], on: boolean) => setSubs((cur) => (on ? [...new Set([...cur, ...ids])] : cur.filter((x) => !ids.includes(x))));

  const rng = useMemo(() => new Rng(freshSeed()), [run]);
  const next = useCallback((used: Set<string>) => nextPractice(subs, diff, used, rng), [subs, diff, rng]);
  const available = subs.reduce((n, s) => n + staticForSubtopic(s).length, 0);
  const gens = subs.reduce((n, s) => n + generatorsForSubtopic(s).length, 0);

  if (run > 0)
    return (
      <div className="page">
        <QuestionSession
          key={run}
          title="Topic practice"
          onExit={() => setRun(0)}
          mode="practice"
          next={next}
          limit={count}
          onDone={() => (
            <div className="row-actions">
              <button type="button" className="btn-primary" onClick={() => setRun((r) => r + 1)}>
                Same settings again
              </button>
              <button type="button" className="btn-ghost" onClick={() => setRun(0)}>
                Change topics
              </button>
              <Link className="btn-ghost" to="/mistakes">
                Review mistakes
              </Link>
            </div>
          )}
        />
      </div>
    );

  return (
    <div className="page">
      <header className="page-head">
        <h1>Topic practice</h1>
        <p className="lede">Choose one or more topics, a difficulty and how many questions. You get feedback and a full mark scheme after every answer.</p>
      </header>

      <section className="setup">
        <h2>Topics</h2>
        <div className="row-actions">
          <button type="button" className="btn-ghost small" onClick={() => setSubs(SUBTOPICS.map((s) => s.id))}>
            Select all
          </button>
          <button type="button" className="btn-ghost small" onClick={() => setSubs([])}>
            Clear
          </button>
        </div>
        <div className="picker">
          {SYLLABUS.map((area) => {
            const ids = area.topics.flatMap((t) => t.subtopics.map((s) => s.id));
            const allOn = ids.every((id) => subs.includes(id));
            return (
              <fieldset key={area.id} className="picker-area">
                <legend>
                  <label>
                    <input type="checkbox" checked={allOn} onChange={(e) => toggle(ids, e.target.checked)} /> {area.name}
                  </label>
                </legend>
                {area.topics.map((t) => {
                  const tids = t.subtopics.map((s) => s.id);
                  return (
                    <div key={t.id} className="picker-topic">
                      <label className="picker-topic-name">
                        <input type="checkbox" checked={tids.every((id) => subs.includes(id))} onChange={(e) => toggle(tids, e.target.checked)} /> {t.name}
                      </label>
                      <div className="picker-subs">
                        {t.subtopics.map((s) => (
                          <label key={s.id} className="chip-check">
                            <input type="checkbox" checked={subs.includes(s.id)} onChange={(e) => toggle([s.id], e.target.checked)} />
                            <span>{s.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </fieldset>
            );
          })}
        </div>

        <h2>Difficulty</h2>
        <div className="seg" role="radiogroup" aria-label="Difficulty">
          {DIFFS.map((d) => (
            <button key={d.id} type="button" role="radio" aria-checked={diff === d.id} className={diff === d.id ? 'on' : ''} onClick={() => setDiff(d.id)}>
              <strong>{d.label}</strong>
              <span>{d.hint}</span>
            </button>
          ))}
        </div>

        <h2>Number of questions</h2>
        <div className="seg" role="radiogroup" aria-label="Number of questions">
          {COUNTS.map((c) => (
            <button key={String(c)} type="button" role="radio" aria-checked={count === c} className={count === c ? 'on' : ''} onClick={() => setCount(c)}>
              <strong>{c ?? 'Endless'}</strong>
            </button>
          ))}
        </div>

        <div className="start-bar">
          <span className="muted">
            {subs.length ? `${subs.length} subtopics · ${available} hand-written questions + ${gens} generators` : 'Pick at least one topic.'}
          </span>
          <button type="button" className="btn-primary" disabled={!subs.length} onClick={() => setRun(1)}>
            Start practice
          </button>
        </div>
      </section>
    </div>
  );
}
