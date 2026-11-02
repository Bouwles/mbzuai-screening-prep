import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SUBTOPICS, SYLLABUS, hasSubtopic, subtopicInfo } from '../syllabus';
import { LESSON_BY_SUBTOPIC, staticForSubtopic } from '../engine/bank';
import { MASTERY_LABEL, masteryBySub, masteryOf, type Mastery } from '../engine/mastery';
import { nextPractice } from '../engine/select';
import { markRead, setStage, useStore } from '../store/progress';
import { VIDEOS } from '../config/videos';
import { Rich, Tex } from '../components/Rich';
import { QuestionSession } from '../components/QuestionSession';
import { Rng, freshSeed } from '../lib/rng';
import type { Difficulty, Lesson, QRef, WorkedExample } from '../types';

export function MasteryBadge({ m }: { m: Mastery }) {
  return <span className={`mastery-badge lvl-${m.level}`}>{MASTERY_LABEL[m.level]}</span>;
}

export function LearnIndex() {
  const s = useStore((x) => x);
  const mastery = masteryBySub(s);
  const mastered = SUBTOPICS.filter((x) => mastery.get(x.id)?.level === 'mastered').length;
  const weak = SUBTOPICS.filter((x) => mastery.get(x.id)?.level === 'weak');
  const pct = Math.round((100 * mastered) / SUBTOPICS.length);
  return (
    <div className="page">
      <header className="page-head">
        <h1>Learn</h1>
        <p className="lede">
          Every lesson runs in five steps: a simple explanation with videos, worked examples, guided practice with hints, questions on your own,
          then exam-level questions. Skip any step you already know. A topic counts as mastered only when you get exam-level questions right
          without hints.
        </p>
        <div className="syllabus-progress">
          <div className="meter big" aria-hidden>
            <span style={{ width: `${pct}%` }} />
          </div>
          <span>
            {mastered} of {SUBTOPICS.length} topics mastered
            {weak.length > 0 && `, ${weak.length} need${weak.length === 1 ? 's' : ''} work`}
          </span>
          <Link to="/formulas" className="btn-ghost small">
            Formula sheet
          </Link>
        </div>
        {weak.length > 0 && (
          <p className="revisit">
            <strong>Revisit:</strong>{' '}
            {weak.slice(0, 6).map((w, i) => (
              <span key={w.id}>
                {i > 0 && ', '}
                <Link to={`/learn/${w.id}`}>{w.name}</Link>
              </span>
            ))}
          </p>
        )}
      </header>
      {SYLLABUS.map((area) => (
        <section key={area.id} className="area-block">
          <h2>{area.name}</h2>
          {area.topics.map((t) => (
            <div key={t.id} className="topic-block">
              <h3>{t.name}</h3>
              <ul className="lesson-list">
                {t.subtopics.map((sub) => {
                  const m = mastery.get(sub.id) ?? masteryOf(s, sub.id);
                  return (
                    <li key={sub.id}>
                      <Link to={`/learn/${sub.id}`} className={`lesson-row ${s.read.includes(sub.id) ? 'is-read' : ''}`}>
                        <span className="lesson-name">{sub.name}</span>
                        <span className="muted lesson-stat">
                          {m.n ? `${m.correct} of last ${m.n} right` : `${staticForSubtopic(sub.id).length} questions`}
                        </span>
                        <MasteryBadge m={m} />
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

// ------------------------------------------------------------------ lesson steps

const STAGES = ['Understand', 'Worked examples', 'Guided practice', 'On your own', 'Exam level'] as const;

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

/** "What you need to know", one chunk at a time, with an option to show everything. */
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
        <h2>Step by step</h2>
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

function Videos({ sub, name }: { sub: string; name: string }) {
  const vids = VIDEOS[sub] ?? [];
  return (
    <section className="lesson-section">
      <h2>Prefer to watch first?</h2>
      <p className="muted">Short videos from trusted teachers, best first. They open on YouTube in a new tab.</p>
      <ul className="video-list">
        {vids.map((v) => (
          <li key={v.id}>
            <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer">
              {v.title}
            </a>
            <span className="muted">
              {v.channel} · {v.length}
            </span>
          </li>
        ))}
        <li>
          <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(name)}`} target="_blank" rel="noreferrer">
            Search YouTube for more
          </a>
        </li>
      </ul>
    </section>
  );
}

function Methods({ lesson }: { lesson: Lesson }) {
  if (!lesson.methods?.length) return null;
  return (
    <section className="lesson-section">
      <h2>Which method when?</h2>
      <p className="muted">How to tell from the wording what a question wants.</p>
      <dl className="method-list">
        {lesson.methods.map((m, i) => (
          <div key={i} className="method">
            <dt>
              <Rich text={m.cue} />
            </dt>
            <dd>
              <Rich text={m.method} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** A short inline question set for one lesson step. `plan[i]` is the difficulty of question i. */
function StepSession({
  sub,
  plan,
  title,
  hints,
  onDone,
}: {
  sub: string;
  plan: Difficulty[];
  title: string;
  hints: 'open' | 'quiet';
  onDone: () => ReactNode;
}) {
  const [run, setRun] = useState(0);
  const rng = useMemo(() => new Rng(freshSeed()), [run]);
  const next = useCallback(
    (used: Set<string>, count: number): QRef | null =>
      nextPractice([sub], plan[Math.min(count, plan.length - 1)], used, rng) ?? nextPractice([sub], 'mixed', used, rng),
    [sub, plan, rng],
  );
  if (!run)
    return (
      <button type="button" className="btn-primary btn-lg" onClick={() => setRun(1)}>
        Start {plan.length} questions
      </button>
    );
  return (
    <QuestionSession
      key={`${sub}-${title}-${run}`}
      mode="lesson"
      variant="inline"
      title={title}
      next={next}
      limit={plan.length}
      showTopic={false}
      hints={hints}
      onDone={() => (
        <div className="row-actions">
          {onDone()}
          <button type="button" className="btn-ghost" onClick={() => setRun((r) => r + 1)}>
            Another {plan.length}
          </button>
        </div>
      )}
    />
  );
}

const GUIDED: Difficulty[] = ['foundation', 'foundation', 'foundation', 'foundation'];
const OWN: Difficulty[] = ['foundation', 'exam', 'foundation', 'exam', 'exam'];
const EXAM_LEVEL: Difficulty[] = ['exam', 'exam', 'exam', 'exam', 'exam'];

export function LessonPage() {
  const { sub = '' } = useParams();
  return hasSubtopic(sub) ? <LessonBody key={sub} sub={sub} /> : <p className="empty">Lesson not found.</p>;
}

function LessonBody({ sub }: { sub: string }) {
  const read = useStore((s) => s.read.includes(sub));
  const furthest = useStore((s) => s.stage[sub] ?? 0);
  const m = masteryOf(useStore((s) => s), sub);
  const [stage, setLocal] = useState(furthest);
  const top = useRef<HTMLDivElement>(null);
  const info = subtopicInfo(sub);
  const lesson = LESSON_BY_SUBTOPIC.get(sub);
  const i = SUBTOPICS.findIndex((s) => s.id === sub);
  const prev = SUBTOPICS[i - 1];
  const nextSub = SUBTOPICS[i + 1];

  const go = (n: number) => {
    setLocal(n);
    setStage(sub, n);
    if (n >= 2 && !read) markRead(sub);
    setTimeout(() => top.current?.scrollIntoView({ block: 'start' }), 0);
  };
  const nextBtn = (label: string) => (
    <button type="button" className="btn-primary btn-lg" onClick={() => go(stage + 1)}>
      Next: {label}
    </button>
  );

  return (
    <article className="page lesson">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/learn">Learn</Link> <span aria-hidden>/</span> {info.area.name} <span aria-hidden>/</span> {info.topic.name}
      </nav>
      <header className="page-head">
        <h1>{info.name}</h1>
        <p className="lede">{info.covers}</p>
        <div className="lesson-status">
          <MasteryBadge m={m} />
          <span className="muted">
            {m.n
              ? `${m.correct} of your last ${m.n} hint-free answers right, ${m.examCorrect} at exam level.`
              : 'Mastery comes from exam-level questions answered without hints.'}
          </span>
        </div>
        <div className="row-actions">
          {stage < 4 && (
            <button type="button" className="btn-ghost" onClick={() => go(4)}>
              Know it already? Skip to exam level
            </button>
          )}
          <Link className="btn-ghost" to={`/practice?subs=${sub}`}>
            Practise this topic
          </Link>
          <button type="button" className="btn-text" onClick={() => markRead(sub, !read)}>
            {read ? 'Marked as read (undo)' : 'Mark as read'}
          </button>
        </div>
        {m.level === 'weak' && (
          <p className="warn revisit">
            This topic needs work. Go back over <button type="button" className="btn-text inline" onClick={() => go(0)}>the simple version</button> and{' '}
            <button type="button" className="btn-text inline" onClick={() => go(1)}>the worked examples</button>, then try{' '}
            <button type="button" className="btn-text inline" onClick={() => go(2)}>guided practice</button> with hints.
          </p>
        )}
      </header>

      <div ref={top} />
      <ol className="stepper" aria-label="Lesson steps">
        {STAGES.map((label, k) => (
          <li key={label}>
            <button
              type="button"
              className={`${k === stage ? 'on' : ''} ${k <= furthest ? 'reached' : ''}`}
              aria-current={k === stage ? 'step' : undefined}
              onClick={() => go(k)}
            >
              <span className="step-num">{k + 1}</span>
              <span className="step-label">{label}</span>
            </button>
          </li>
        ))}
      </ol>

      {!lesson ? (
        <p className="empty">This lesson hasn't been written yet.</p>
      ) : (
        <>
          {stage === 0 && (
            <>
              {lesson.simple && (
                <section className="lesson-section simple">
                  <h2>The simple version</h2>
                  <Rich text={lesson.simple} className="reading" />
                </section>
              )}
              <Videos sub={sub} name={info.name} />
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
                {nextBtn('worked examples')}
              </SteppedKnow>
            </>
          )}

          {stage === 1 && (
            <>
              <section className="lesson-section">
                <h2>Worked examples</h2>
                <p className="muted">Try each one on paper first, then reveal the steps one at a time and compare.</p>
                {lesson.examples.map((ex, k) => (
                  <Example key={k} n={k + 1} ex={ex} />
                ))}
              </section>
              <Methods lesson={lesson} />
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
              {nextBtn('guided practice')}
            </>
          )}

          {stage === 2 && (
            <section className="lesson-section">
              <h2>Guided practice</h2>
              <p className="muted">
                Four Foundation questions. If you get stuck, show a hint: each one reveals the next step of the worked solution, but never the final step.
                After each answer you see why the options are right or wrong.
              </p>
              <StepSession sub={sub} plan={GUIDED} title="Guided practice" hints="open" onDone={() => nextBtn('on your own')} />
            </section>
          )}

          {stage === 3 && (
            <section className="lesson-section">
              <h2>On your own</h2>
              <p className="muted">
                Five questions that step up from Foundation to Exam level. Try them without hints: only hint-free answers count towards mastery.
              </p>
              <StepSession sub={sub} plan={OWN} title="On your own" hints="quiet" onDone={() => nextBtn('exam level')} />
            </section>
          )}

          {stage === 4 && (
            <>
              <section className="lesson-section tip">
                <h2>Exam tip</h2>
                <Rich text={lesson.examTip} className="reading" />
              </section>
              <section className="lesson-section">
                <h2>Exam level</h2>
                <p className="muted">
                  Five questions modelled on the level of MBZUAI's official sample questions, with the timer at the estimated exam pace. Get at least 80% of
                  your recent hint-free answers right, including three at exam level, to master the topic.
                </p>
                <StepSession
                  sub={sub}
                  plan={EXAM_LEVEL}
                  title="Exam level"
                  hints="quiet"
                  onDone={() =>
                    nextSub ? (
                      <Link className="btn-primary" to={`/learn/${nextSub.id}`}>
                        Next lesson: {nextSub.name}
                      </Link>
                    ) : (
                      <Link className="btn-primary" to="/mock">
                        Take a mock exam
                      </Link>
                    )
                  }
                />
              </section>
              <section className="lesson-section optional">
                <h2>Optional: Challenge questions</h2>
                <p className="muted">
                  Harder than the official samples, for when the exam-level questions feel easy. Skip them if time is short; they are not needed for
                  mastery.
                </p>
                <Link className="btn-ghost" to={`/practice?subs=${sub}&diff=challenge`}>
                  Try Challenge questions
                </Link>
              </section>
            </>
          )}
        </>
      )}

      <nav className="pager" aria-label="Lessons">
        {prev ? <Link to={`/learn/${prev.id}`}>Previous: {prev.name}</Link> : <span />}
        {nextSub ? <Link to={`/learn/${nextSub.id}`}>Next: {nextSub.name}</Link> : <span />}
      </nav>
    </article>
  );
}
