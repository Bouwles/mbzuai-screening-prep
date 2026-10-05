import { Link } from 'react-router-dom';
import type { ServedQuestion } from '../types';
import { subtopicInfo } from '../syllabus';
import { ChartView, TableView } from './ChartView';
import { CodeView } from './CodeView';
import { Rich, RichInline } from './Rich';

export const LETTERS = ['A', 'B', 'C', 'D'];
const DIFF_LABEL = { foundation: 'Foundation', exam: 'Exam', challenge: 'Challenge' } as const;

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

interface Props {
  q: ServedQuestion;
  selected: number | null;
  onSelect?: (i: number) => void;
  /** After answering in practice, or in review: colour options as correct/incorrect. */
  reveal?: boolean;
}

export function QuestionView({ q, selected, onSelect, reveal }: Props) {
  return (
    <div className="question">
      <Rich text={q.stem} className="stem" />
      {q.code && <CodeView code={q.code} />}
      {q.chart && <ChartView spec={q.chart} />}
      {q.table && <TableView table={q.table} />}
      <div className="options" role="radiogroup" aria-label="Answer options">
        {q.options.map((o, i) => {
          let cls = 'option';
          if (selected === i) cls += ' selected';
          if (reveal && i === q.correctIndex) cls += ' correct';
          if (reveal && selected === i && i !== q.correctIndex) cls += ' wrong';
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={selected === i}
              className={cls}
              disabled={reveal || !onSelect}
              onClick={() => onSelect?.(i)}
            >
              <span className="letter">{LETTERS[i]}</span>
              <span className="option-text">
                <RichInline text={o} big />
              </span>
              {reveal && i === q.correctIndex && <span className="verdict">Correct answer</span>}
              {reveal && selected === i && i !== q.correctIndex && <span className="verdict">Your answer</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MarkScheme({ q, selected }: { q: ServedQuestion; selected: number | null }) {
  const info = subtopicInfo(q.subtopic);
  return (
    <section className="markscheme" aria-label="Mark scheme">
      <h3>Mark scheme</h3>
      <div className="ms-answer">
        <span className="ms-label">Correct answer</span>
        <span className="ms-answer-text">
          <strong>{LETTERS[q.correctIndex]}</strong>
          <span className="ms-sep" aria-hidden>
            {' '}
          </span>
          <RichInline text={q.options[q.correctIndex]} big />
        </span>
      </div>
      <h4>Worked solution</h4>
      <Rich text={q.markScheme.solution} className="ms-solution" />
      <h4>Why the other options are wrong</h4>
      <ul className="why-list">
        {q.options.map((o, i) =>
          i === q.correctIndex ? null : (
            <li key={i} className={selected === i ? 'chosen' : ''}>
              <div className="why-head">
                <strong>{LETTERS[i]}</strong> <RichInline text={o} />
                {selected === i && <span className="why-yours">Your answer</span>}
              </div>
              <Rich text={q.markScheme.whyWrong[i] ?? ''} />
            </li>
          ),
        )}
      </ul>
      <div className="key-idea">
        <span className="ms-label">Key idea</span>
        <Rich text={q.markScheme.keyIdea} />
      </div>
      <p className="ms-lesson">
        <Link to={`/learn/${q.subtopic}`}>Read the lesson: {info.name}</Link>
      </p>
    </section>
  );
}
