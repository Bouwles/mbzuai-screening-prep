import { useCallback, useRef, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SUBTOPICS, SYLLABUS, hasSubtopic, subtopicInfo } from '../syllabus';
import { LESSON_BY_SUBTOPIC, generatorsForSubtopic, staticForSubtopic } from '../engine/bank';
import { accuracyBySub, markRead, useStore } from '../store/progress';
import { Rich, Tex } from '../components/Rich';
import { QuestionSession } from '../components/QuestionSession';
import { Rng, freshSeed } from '../lib/rng';
import type { QRef, WorkedExample } from '../types';

export function LearnIndex() {
  const read = useStore((s) => s.read);
  const acc = accuracyBySub(useStore((s) => s));
  const pct = Math.round((100 * read.length) / SUBTOPICS.length);
  return (
    <div className="page">
      <header className="page-head">
        <h1>Learn</h1>
        <p className="lede">
          One lesson for every part of the syllabus, written to take you from the basics to exam level. Each ends with five quick check
          questions.
        </p>
        <div className="syllabus-progress">
          <div className="meter big" aria-hidden>
            <span style={{ width: `${pct}%` }} />
          </div>
          <span>
            {read.length} of {SUBTOPICS.length} lessons read
          </span>
          <Link to="/formulas" className="btn-ghost small">
            Formula sheet
          </Link>
        </div>
      </header>
      {SYLLABUS.map((area) => (
        <section key={area.id} className="area-block">
          <h2>{area.name}</h2>
          {area.topics.map((t) => (
            <div key={t.id} className="topic-block">
              <h3>{t.name}</h3>
              <ul className="lesson-list">
                {t.subtopics.map((s) => {
                  const a = acc.get(s.id);
                  return (
                    <li key={s.id}>
                      <Link to={`/learn/${s.id}`} className={`lesson-row ${read.includes(s.id) ? 'is-read' : ''}`}>
                        <span className="read-dot" aria-label={read.includes(s.id) ? 'Read' : 'Not read'} />
                        <span className="lesson-name">{s.name}</span>
                        <span className="muted lesson-stat">
                          {a ? `${Math.round((100 * a.correct) / a.attempts)}% of ${a.attempts}` : `${staticForSubtopic(s.id).length} questions`}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

function CheckYourself({ sub }: { sub: string }) {
  const [run, setRun] = useState(0);
  const next = useCallback(
    (used: Set<string>): QRef | null => {
      const rng = new Rng(freshSeed());
      const pool = staticForSubtopic(sub).filter((q) => !used.has(q.id));
      const easy = pool.filter((q) => q.difficulty !== 'challenge');
      const pick = easy.length ? easy : pool;
      if (pick.length) return { kind: 'static', id: rng.pick(pick).id };
      const gens = generatorsForSubtopic(sub);
      return gens.length ? { kind: 'gen', id: rng.pick(gens).id, seed: freshSeed() } : null;
    },
    [sub],
  );
  if (!run)
    return (
      <button type="button" className="btn-primary" onClick={() => setRun(1)}>
        Start 5 check questions
      </button>
    );
  return (
    <QuestionSession
      key={`${sub}-${run}`}
      mode="lesson"
      variant="inline"
      title="Check yourself"
      next={next}
      limit={5}
      showTopic={false}
      onDone={() => (
        <div className="row-actions">
          <button type="button" className="btn-ghost" onClick={() => setRun((r) => r + 1)}>
            Another 5
          </button>
          <Link className="btn-primary" to={`/practice?subs=${sub}`}>
            Practise this topic
          </Link>
        </div>
      )}
    />
  );
}


/** Split the lesson text at its ### headings into short chunks. */
function chunksOf(text: string): { title: string; body: string }[] {
  const parts = text.split(/^###\s+/m);
  const out: { title: string; body: string }[] = [];
  if (parts[0].trim()) out.push({ title: 'The big idea', body: parts[0].trim() });
  for (const p of parts.slice(1)) {
    const nl = p.indexOf('\n');
    out.push({ title: (nl < 0 ? p : p.slice(0, nl)).trim(), body: nl < 0 ? '' : p.slice(nl + 1).trim() });
  }
  return out;
}

/** "What you need to know", one chunk at a time (like Brilliant), with an option to show everything. */
function SteppedKnow({ text, children }: { text: string; children: ReactNode }) {
  const chunks = chunksOf(text);
  const [shown, setShown] = useState(1);
  const all = shown >= chunks.length;
  const last = useRef<HTMLDivElement>(null);
  const more = () => {
    setShown((n) => n + 1);
    setTimeout(() => last.current?.scrollIntoView({ block: 'start' }), 0);
  };
  return (
    <section className="lesson-section">
      <div className="know-head">
        <h2>What you need to know</h2>
        {!all && (
          <button type="button" className="btn-text" onClick={() => setShown(chunks.length)}>
            Show it all
          </button>
        )}
      </div>
      <div className="know-progress" aria-hidden>
        {chunks.map((_, i) => (
          <span key={i} className={i < shown ? 'on' : ''} />
        ))}
      </div>
      {chunks.slice(0, shown).map((c, i) => (
        <div key={i} className="know-card" ref={i === shown - 1 ? last : undefined}>
          <p className="know-step">
            {i + 1} of {chunks.length}
          </p>
          <h3>{c.title}</h3>
          <Rich text={c.body} className="reading" />
        </div>
      ))}
      {!all && (
        <button type="button" className="btn-primary btn-lg know-next" onClick={more}>
          Continue
        </button>
      )}
      {/* formulas, examples, traps and tip appear once every chunk has been read */}
      {all && children}
    </section>
  );
}

/** Worked example: try it first, then reveal the steps one by one. */
function Example({ n, ex }: { n: number; ex: WorkedExample }) {
  const [step, setStep] = useState(0);
  const done = step >= ex.steps.length;
  return (
    <div className="example">
      <h3>
        Example {n}: <Rich text={ex.title} className="inline-rich" />
      </h3>
      <Rich text={ex.problem} className="example-problem" />
      {step > 0 && (
        <ol className="steps">
          {ex.steps.slice(0, step).map((st, j) => (
            <li key={j}>
              <Rich text={st} />
            </li>
          ))}
        </ol>
      )}
      {done ? (
        <div className="example-answer">
          <span className="ms-label">Answer</span>
          <Rich text={ex.answer} />
        </div>
      ) : (
        <div className="example-actions">
          <button type="button" className="btn-secondary" onClick={() => setStep((x) => x + 1)}>
            {step === 0 ? 'Show the first step' : `Next step (${step + 1} of ${ex.steps.length})`}
          </button>
          <button type="button" className="btn-text" onClick={() => setStep(ex.steps.length)}>
            Show full solution
          </button>
        </div>
      )}
    </div>
  );
}

export function LessonPage() {
  const { sub = '' } = useParams();
  const read = useStore((s) => s.read.includes(sub));
  if (!hasSubtopic(sub)) return <p className="empty">Lesson not found.</p>;
  const info = subtopicInfo(sub);
  const lesson = LESSON_BY_SUBTOPIC.get(sub);
  const i = SUBTOPICS.findIndex((s) => s.id === sub);
  const prev = SUBTOPICS[i - 1];
  const next = SUBTOPICS[i + 1];

  return (
    <article className="page lesson" key={sub}>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/learn">Learn</Link> <span aria-hidden>/</span> {info.area.name} <span aria-hidden>/</span> {info.topic.name}
      </nav>
      <header className="page-head">
        <h1>{info.name}</h1>
        <p className="lede">{info.covers}</p>
        <div className="row-actions">
          <button type="button" className={read ? 'btn-ghost' : 'btn-primary'} onClick={() => markRead(sub, !read)}>
            {read ? 'Marked as read (undo)' : 'Mark as read'}
          </button>
          <Link className="btn-ghost" to={`/practice?subs=${sub}`}>
            Practise this topic
          </Link>
        </div>
      </header>

      {!lesson ? (
        <p className="empty">This lesson hasn't been written yet.</p>
      ) : (
        <>
          <SteppedKnow text={lesson.know}>
          <section className="lesson-section">
            <h2>Key formulas and rules</h2>
            <dl className="formula-list">
              {lesson.formulas.map((f, k) => (
                <div key={k} className="formula">
                  <dt>
                    <Rich text={f.label} />
                  </dt>
                  <dd>
                    <Tex src={f.tex} display />
                    {f.note && <Rich text={f.note} className="muted" />}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="lesson-section">
            <h2>Worked examples</h2>
            <p className="muted">Try each one yourself first, then reveal the steps one at a time.</p>
            {lesson.examples.map((ex, k) => (
              <Example key={k} n={k + 1} ex={ex} />
            ))}
          </section>
          <section className="lesson-section">
            <h2>Common traps</h2>
            <ul className="traps">
              {lesson.traps.map((t, k) => (
                <li key={k}>
                  <Rich text={t} />
                </li>
              ))}
            </ul>
          </section>
          <section className="lesson-section tip">
            <h2>Exam tip</h2>
            <Rich text={lesson.examTip} className="reading" />
          </section>
          </SteppedKnow>
        </>
      )}

      <section className="lesson-section">
        <h2>Check yourself</h2>
        <CheckYourself sub={sub} key={sub} />
      </section>

      <nav className="pager" aria-label="Lessons">
        {prev ? <Link to={`/learn/${prev.id}`}>Previous: {prev.name}</Link> : <span />}
        {next ? <Link to={`/learn/${next.id}`}>Next: {next.name}</Link> : <span />}
      </nav>
    </article>
  );
}
