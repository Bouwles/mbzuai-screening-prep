import { useEffect, useRef, useState } from 'react';

const SHOW_MS = 1600;
const FADE_MS = 300;

/** Top bar of the exam screen. `saves` goes up by one each time an answer or mark is saved. */
export function ExamTopBar({ saves }: { saves: number }) {
  const [phase, setPhase] = useState<'off' | 'on' | 'fading'>('off');
  const seen = useRef(saves);

  useEffect(() => {
    if (saves === seen.current) return;
    seen.current = saves;
    setPhase('on');
    const fade = setTimeout(() => setPhase('fading'), SHOW_MS);
    const clear = setTimeout(() => setPhase('off'), SHOW_MS + FADE_MS);
    return () => {
      clearTimeout(fade);
      clearTimeout(clear);
    };
  }, [saves]);

  return (
    <header className="ex-top">
      <span className={`ex-saved ${phase === 'on' ? 'is-on' : ''}`} aria-live="polite">
        {phase === 'off' ? '' : 'Saved'}
      </span>
    </header>
  );
}
