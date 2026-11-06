import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { BookmarkIcon } from './BookmarkIcon';

interface Props {
  /** The mock's name, shown at the left. */
  label: string;
  current: number;
  answered: boolean[];
  marked: boolean[];
  onGo: (i: number) => void;
  /** True once the last question has been visited. */
  canSubmit: boolean;
  onSubmit: () => void;
  /** The timer, shown at the right. */
  timer: ReactNode;
}

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Bottom strip of the exam screen: label, numbered tabs with Submit at the end, and the timer. */
export function ExamNavStrip({ label, current, answered, marked, onGo, canSubmit, onSubmit, timer }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const currentTab = useRef<HTMLButtonElement>(null);
  const [ends, setEnds] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const t = track.current;
    if (!t) return;
    setEnds({ start: t.scrollLeft <= 1, end: t.scrollLeft + t.clientWidth >= t.scrollWidth - 1 });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  // Keep the current tab in view.
  useEffect(() => {
    currentTab.current?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reducedMotion() ? 'auto' : 'smooth' });
  }, [current]);

  const page = (dir: 1 | -1) => {
    const t = track.current;
    if (t) t.scrollBy({ left: dir * t.clientWidth * 0.8, behavior: reducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <nav className="ex-strip" aria-label="Questions" data-native-enter>
      <span className="ex-strip-label">{label}</span>
      <button type="button" className="ex-arrow" aria-label="Scroll question tabs left" disabled={ends.start} onClick={() => page(-1)}>
        ‹
      </button>
      <div className="ex-track" ref={track} onScroll={measure}>
        {answered.map((isAnswered, i) => {
          const isCurrent = i === current;
          const isMarked = marked[i];
          const cls = ['ex-tab', isAnswered && 'is-answered', isCurrent && 'is-current'].filter(Boolean).join(' ');
          const words = `Question ${i + 1}${isAnswered ? ', answered' : ', not answered'}${isMarked ? ', marked for review' : ''}`;
          return (
            <button key={i} type="button" className={cls} ref={isCurrent ? currentTab : undefined} aria-label={words} aria-current={isCurrent ? 'step' : undefined} onClick={() => onGo(i)}>
              {i + 1}
              {isMarked && <BookmarkIcon filled className="ex-tab-mark" />}
            </button>
          );
        })}
        <button
          type="button"
          className={`ex-tab ex-tab-submit ${canSubmit ? '' : 'is-disabled'}`}
          aria-disabled={!canSubmit}
          title={canSubmit ? undefined : 'Go through every question first'}
          onClick={() => {
            if (canSubmit) onSubmit();
          }}
        >
          Submit
        </button>
      </div>
      <button type="button" className="ex-arrow" aria-label="Scroll question tabs right" disabled={ends.end} onClick={() => page(1)}>
        ›
      </button>
      {timer}
    </nav>
  );
}
