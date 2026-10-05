import { Link } from 'react-router-dom';
import { EXAM } from '../config/exam';
import { accuracyBySub, dayKey, dueMistakes, streak, useStore, type State } from '../store/progress';
import { SUBTOPICS, subtopicInfo } from '../syllabus';
import { ScoreChart } from '../components/ScoreChart';

/** The single recommended next step, like Khan Academy's "Up next". */
function upNext(s: State): { title: string; text: string; to: string; cta: string } {
  const active = s.mocks.find((m) => m.id === s.activeMockId && !m.submittedAt);
  if (active) return { title: `Finish your ${active.label.toLowerCase()}`, text: 'Your mock exam is still running. The clock has kept going.', to: `/mock/run/${active.id}`, cta: 'Return to the exam' };
  const due = dueMistakes(s).length;
  if (due) return { title: `Review ${due} mistake${due > 1 ? 's' : ''}`, text: 'These questions are due today. Spaced review is the fastest way to stop repeating errors.', to: '/mistakes', cta: 'Start review' };
  if (s.last) return { title: `Continue: ${s.last.label}`, text: 'Pick up exactly where you left off.', to: s.last.path, cta: 'Continue' };
  const unread = SUBTOPICS.find((x) => !s.read.includes(x.id));
  if (unread) return { title: `Lesson: ${unread.name}`, text: `${unread.area.name} › ${unread.topic.name}. Start from the basics, then try five check questions.`, to: `/learn/${unread.id}`, cta: 'Start lesson' };
  return { title: 'Take a full mock exam', text: 'You have read every lesson. Test yourself under exam conditions.', to: '/mock?start=full', cta: 'Start mock' };
}

export function Home() {
  const s = useStore((x) => x);
  const next = upNext(s);
  const total = s.attempts.length;
  const correct = s.attempts.filter((a) => a.correct).length;
  const acc = total ? Math.round((100 * correct) / total) : null;
  const due = dueMistakes(s).length;
  const st = streak(s);
  const today = s.daily[dayKey()] ?? 0;
  const bySub = accuracyBySub(s);
  const weakest = [...bySub.entries()]
    .filter(([, a]) => a.attempts >= EXAM.weakTopicMinAttempts)
    .map(([sub, a]) => ({ sub, pct: Math.round((100 * a.correct) / a.attempts), n: a.attempts }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 5);
  const mocks = s.mocks.filter((m) => m.submittedAt);
  const recent = mocks.slice(-3);
  const estimate = recent.length ? Math.round(recent.reduce((n, m) => n + (m.score ?? 0), 0) / recent.length) : null;
  const readPct = Math.round((100 * s.read.length) / SUBTOPICS.length);
  const target = EXAM.targetPercent;

  return (
    <div className="page home">
      <header className="home-head">
        <h1>Your exam prep</h1>
        <p className="lede">MBZUAI BSc screening exam. Aim for {target}% or above.</p>
      </header>

      <section className="upnext card">
        <p className="card-kicker">Up next</p>
        <h2>{next.title}</h2>
        <p className="muted">{next.text}</p>
        <div className="card-actions">
          <Link className="btn-primary btn-lg" to={next.to}>
            {next.cta}
          </Link>
        </div>
      </section>

      <section className="summary-grid">
        <div className="card">
          <p className="card-kicker">Estimated score</p>
          <p className="metric">
            {estimate === null ? '–' : `${estimate}%`}
            <span className="metric-sub">{estimate === null ? 'Take a mock exam to see it' : `average of your last ${recent.length} mock${recent.length > 1 ? 's' : ''}`}</span>
          </p>
          <div className="target-meter" aria-label={`Estimated score against the ${target}% target`}>
            <span className={`fill ${estimate !== null && estimate >= target ? 'ok' : ''}`} style={{ width: `${estimate ?? 0}%` }} />
            <span className="mark" style={{ left: `${target}%` }} />
          </div>
          <p className="small-print muted">Line marks the {target}% target</p>
        </div>
        <div className="card">
          <p className="card-kicker">Syllabus</p>
          <p className="metric">
            {readPct}%<span className="metric-sub">of lessons read ({s.read.length} of {SUBTOPICS.length})</span>
          </p>
          <div className="target-meter" aria-hidden>
            <span className="fill" style={{ width: `${readPct}%` }} />
          </div>
          <p className="small-print muted">
            {total.toLocaleString()} {total === 1 ? 'question' : 'questions'} answered{acc !== null ? `, ${acc}% correct` : ''}
          </p>
        </div>
        <div className="card">
          <p className="card-kicker">Today</p>
          <p className="metric">
            {today}
            <span className="metric-sub">of {EXAM.streakDailyTarget} questions for your streak</span>
          </p>
          <div className="target-meter" aria-hidden>
            <span className="fill" style={{ width: `${Math.min(100, (100 * today) / EXAM.streakDailyTarget)}%` }} />
          </div>
          <p className="small-print muted">
            {st}-day streak, <Link to="/mistakes">{due} mistakes due</Link>
          </p>
        </div>
      </section>

      <div className="two-col">
        <section className="card">
          <div className="card-head">
            <h2>Mock exam scores</h2>
          </div>
          <ScoreChart mocks={mocks.slice(-8)} compact />
          <div className="card-actions">
            <Link className="btn-secondary" to="/mock">
              Mock exams
            </Link>
          </div>
        </section>

        <section className="card">
          <div className="card-head">
            <h2>Weakest topics</h2>
          </div>
          {weakest.length === 0 ? (
            <p className="muted">After {EXAM.weakTopicMinAttempts} answers in a topic, your weakest topics appear here with a shortcut to practise them.</p>
          ) : (
            <ul className="topic-rows">
              {weakest.map((w) => (
                <li key={w.sub}>
                  <div className="topic-row-main">
                    <span className="topic-row-name">{subtopicInfo(w.sub).name}</span>
                    <span className="mastery" aria-hidden>
                      <span style={{ width: `${w.pct}%` }} />
                    </span>
                    <span className="topic-row-pct">{w.pct}%</span>
                  </div>
                  <div className="topic-row-links">
                    <Link to={`/practice?subs=${w.sub}`}>Practise this</Link>
                    <Link to={`/learn/${w.sub}`}>Read the lesson</Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="card">
        <div className="card-head">
          <h2>Ways to study</h2>
        </div>
        <ul className="mode-list">
          <li>
            <Link to="/learn">
              <strong>Learn</strong>
              <span>Lessons for every topic, from the basics to exam level</span>
            </Link>
          </li>
          <li>
            <Link to="/practice">
              <strong>Topic practice</strong>
              <span>Choose topics and a difficulty, with a mark scheme after every answer</span>
            </Link>
          </li>
          <li>
            <Link to="/feed">
              <strong>General questions</strong>
              <span>An endless mix from the whole syllabus, weighted to your weak spots</span>
            </Link>
          </li>
          <li>
            <Link to="/mock?start=m15">
              <strong>15-minute mock</strong>
              <span>13 timed questions, no feedback until the end</span>
            </Link>
          </li>
          <li>
            <Link to="/mock?start=full">
              <strong>Full mock</strong>
              <span>40 questions in 45 minutes</span>
            </Link>
          </li>
          <li>
            <Link to="/mistakes">
              <strong>Mistakes review</strong>
              <span>{due} due today</span>
            </Link>
          </li>
        </ul>
      </section>

      <p className="byline">Made by Paul Nercessian</p>
    </div>
  );
}
