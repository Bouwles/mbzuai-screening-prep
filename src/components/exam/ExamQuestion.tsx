import type { ServedQuestion } from '../../types';
import { ChartView, TableView } from '../ChartView';
import { CodeView } from '../CodeView';
import { Rich } from '../Rich';
import { BookmarkIcon } from './BookmarkIcon';
import { ExamOptions } from './ExamOptions';

interface Props {
  /** Number shown in the left column: the exam position, or the session's running number. */
  number: number;
  q: ServedQuestion;
  selected: number | null;
  onSelect?: (i: number) => void;
  onReset?: () => void;
  marked?: boolean;
  /** Leave out to show the bookmark without letting it change (review). */
  onToggleMark?: () => void;
  mode: 'mock' | 'practice' | 'review';
  /** Colours the correct option and any wrong pick. */
  reveal?: { correctIndex: number };
  /** After Check, or in review: options no longer respond and Reset is hidden. */
  locked?: boolean;
}

/** The question as it appears on the exam screen. Every mode reads questions in this one layout. */
export function ExamQuestion({ number, q, selected, onSelect, onReset, marked = false, onToggleMark, mode, reveal, locked = false }: Props) {
  const isLocked = locked || mode === 'review';
  return (
    <div className="ex-q">
      <div className="ex-num">{number}</div>
      <div className="ex-body">
        <Rich text={q.stem} className="ex-stem" />
        {q.code && <CodeView code={q.code} variant={mode === 'mock' ? 'exam' : undefined} />}
        {q.chart && <ChartView spec={q.chart} />}
        {q.table && <TableView table={q.table} />}
        <ExamOptions name={q.key} number={number} options={q.options} selected={selected} onSelect={onSelect} locked={isLocked} correctIndex={reveal?.correctIndex} />
        <div className="ex-rule" />
        {!isLocked && (
          <button type="button" className="ex-reset" data-native-enter disabled={selected === null} onClick={onReset}>
            Reset
          </button>
        )}
      </div>
      <div className="ex-mark">
        {onToggleMark ? (
          <button
            type="button"
            className={`ex-mark-btn ${marked ? 'is-marked' : ''}`}
            data-native-enter
            aria-pressed={marked}
            aria-label="Mark for review"
            title="Mark for review"
            onClick={onToggleMark}
          >
            <BookmarkIcon filled={marked} />
          </button>
        ) : (
          marked && (
            <span className="ex-mark-btn is-marked" role="img" aria-label="Marked for review">
              <BookmarkIcon filled />
            </span>
          )
        )}
      </div>
    </div>
  );
}
