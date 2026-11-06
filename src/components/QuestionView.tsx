import { Link } from 'react-router-dom';
import type { ServedQuestion } from '../types';
import { subtopicInfo } from '../syllabus';
import { Rich, RichInline } from './Rich';

const DIFF_LABEL = { foundation: 'Foundation', exam: 'Exam level' } as const;

export function QuestionMeta({ q, showTopic = true }: { q: ServedQuestion; showTopic?: boolean }) {
  const info = subtopicInfo(q.subtopic);
  return (
    <div className="q-meta">
      {showTopic && <span className="tag">{info.name}</span>}
      <span className={`tag diff-${q.difficulty}`}>{DIFF_LABEL[q.difficulty]}</span>
      {q.generated && <span className="tag tag-variant" title={`Generated variant of: ${q.templateTitle}`}>Generated variant</span>}
    </div>
  );
}

export function MarkScheme({ q, selected }: { q: ServedQuestion; selected: number | null }) {
  const info = subtopicInfo(q.subtopic);
  const wrong = selected !== null && selected >= 0 && selected !== q.correctIndex;
  const keyIdea = (
    <div className="key-idea">
      <span className="ms-label">How to recognise this type</span>
      <Rich text={q.markScheme.keyIdea} />
    </div>
  );
  return (
    <section className="markscheme" aria-label="Mark scheme">
      <h3>Mark scheme</h3>
      {wrong && (
        <div className="ms-mistake">
          <span className="ms-label">Where your answer went wrong</span>
          <div className="why-head">
            <RichInline text={q.options[selected]} />
          </div>
          <Rich text={q.markScheme.whyWrong[selected] ?? ''} />
        </div>
      )}
      {wrong && keyIdea}
      <div className="ms-answer">
        <span className="ms-label">Correct answer</span>
        <span className="ms-answer-text">
          <RichInline text={q.options[q.correctIndex]} big />
        </span>
      </div>
      <h4>Worked solution</h4>
      <Rich text={q.markScheme.solution} className="ms-solution" />
      <h4>{wrong ? 'Why the other options are wrong' : 'Why the wrong options are wrong'}</h4>
      <ul className="why-list">
        {q.options.map((o, i) =>
          i === q.correctIndex || (wrong && i === selected) ? null : (
            <li key={i}>
              <div className="why-head">
                <RichInline text={o} />
              </div>
              <Rich text={q.markScheme.whyWrong[i] ?? ''} />
            </li>
          ),
        )}
      </ul>
      {!wrong && keyIdea}
      <p className="ms-lesson">
        <Link to={`/learn/${q.subtopic}`}>Revisit the lesson: {info.name}</Link>
      </p>
    </section>
  );
}
