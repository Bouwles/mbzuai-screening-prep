// The explanation shown after a question is answered, and in the review after a mock.
import { Component, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { explanationOf, whyWrongFor } from '../lib/explanation';
import { hasSubtopic, subtopicInfo } from '../syllabus';
import type { ServedQuestion } from '../types';
import { CodeView } from './CodeView';
import { Rich, RichInline } from './Rich';

/** If an explanation can't be drawn, the student still sees the answer and the rest of the page keeps working. */
class ExplanationBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function CorrectAnswer({ q }: { q: ServedQuestion }) {
  const answer = q.options?.[q.correctIndex];
  if (typeof answer !== 'string') return null;
  return (
    <div className="xp-answer">
      <span className="xp-label">Correct answer</span>
      <span className="xp-answer-text">
        <RichInline text={answer} big />
      </span>
    </div>
  );
}

function Part({ title, className = '', children }: { title: string; className?: string; children: ReactNode }) {
  return (
    <section className={`xp-part ${className}`}>
      <h4>{title}</h4>
      {children}
    </section>
  );
}

function Body({ q, selected }: { q: ServedQuestion; selected: number | null }) {
  const { asking, steps, conclusion, method } = explanationOf(q);
  const wrong = selected !== null && selected >= 0 && selected !== q.correctIndex;
  const yourWhy = wrong ? whyWrongFor(q, selected) : null;
  const others = q.options
    .map((option, i) => ({ option, i, why: whyWrongFor(q, i) }))
    .filter(({ i, why }) => i !== q.correctIndex && !(wrong && i === selected) && why);
  return (
    <section className="xp" aria-label="Explanation">
      <CorrectAnswer q={q} />
      {wrong && (
        <div className="xp-yours">
          <span className="xp-label">Your answer</span>
          <span className="xp-yours-text">
            <RichInline text={q.options[selected]} />
          </span>
          {yourWhy && <Rich text={yourWhy} className="xp-yours-why" />}
        </div>
      )}
      {asking && (
        <Part title="What is it asking?">
          <Rich text={asking} />
        </Part>
      )}
      <Part title="How to solve it">
        {q.code && <CodeView code={q.code} variant="study" />}
        {steps.length > 0 ? (
          <ol className="xp-steps">
            {steps.map((step, i) => (
              <li key={i}>
                <Rich text={step} codeVariant="study" />
              </li>
            ))}
          </ol>
        ) : (
          <p className="muted">A worked explanation isn't available for this question yet.</p>
        )}
      </Part>
      {conclusion && (
        <Part title="Why this is the answer">
          <Rich text={conclusion} />
        </Part>
      )}
      {method && (
        <Part title="For similar questions" className="xp-method">
          <Rich text={method} />
        </Part>
      )}
      {others.length > 0 && (
        <details className="xp-others">
          <summary>{wrong ? 'Why the other options are wrong' : 'Why the wrong options are wrong'}</summary>
          <ul>
            {others.map(({ option, i, why }) => (
              <li key={i}>
                <div className="xp-other-option">
                  <RichInline text={option} />
                </div>
                <Rich text={why!} />
              </li>
            ))}
          </ul>
        </details>
      )}
      {hasSubtopic(q.subtopic) && (
        <p className="xp-lesson">
          <Link to={`/learn/${q.subtopic}`}>Revisit the lesson: {subtopicInfo(q.subtopic).name}</Link>
        </p>
      )}
    </section>
  );
}

export function Explanation({ q, selected }: { q: ServedQuestion; selected: number | null }) {
  const fallback = (
    <section className="xp" aria-label="Explanation">
      <CorrectAnswer q={q} />
      <p className="muted xp-fallback">This explanation couldn't be displayed.</p>
    </section>
  );
  return (
    <ExplanationBoundary fallback={fallback}>
      <Body q={q} selected={selected} />
    </ExplanationBoundary>
  );
}
