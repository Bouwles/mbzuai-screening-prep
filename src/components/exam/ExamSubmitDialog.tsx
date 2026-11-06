import { useEffect, useRef } from 'react';

interface Props {
  answered: number;
  total: number;
  marked: number;
  onClose: () => void;
  onSubmit: () => void;
}

/** Confirms a submission. Focus stays inside while it's open, and Esc closes it. */
export function ExamSubmitDialog({ answered, total, marked, onClose, onSubmit }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const goBack = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    goBack.current?.focus();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key !== 'Tab') return;
    const items = box.current?.querySelectorAll<HTMLButtonElement>('button');
    if (!items?.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="ex-dialog-back" data-native-enter>
      <div className="ex-dialog" ref={box} role="dialog" aria-modal="true" aria-labelledby="ex-dialog-title" onKeyDown={onKeyDown}>
        <h2 id="ex-dialog-title">Submit your answers?</h2>
        <p>
          You have answered {answered} of {total} questions.
        </p>
        {answered < total && <p>There is no negative marking, so it's worth answering every question.</p>}
        {marked > 0 && <p>{marked === 1 ? '1 question is marked for review.' : `${marked} questions are marked for review.`}</p>}
        <div className="ex-dialog-actions">
          <button type="button" className="ex-dialog-back-btn" ref={goBack} onClick={onClose}>
            Go back
          </button>
          <button type="button" className="ex-dialog-submit" onClick={onSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
