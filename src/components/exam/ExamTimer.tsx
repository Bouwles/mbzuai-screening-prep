const FIVE_MIN = 5 * 60 * 1000;
const ONE_MIN = 60 * 1000;

/** MM:SS, or H:MM:SS from 60 minutes up. */
function clock(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${r}` : `${String(m).padStart(2, '0')}:${r}`;
}

function spoken(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const unit = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;
  return [h ? unit(h, 'hour') : '', m || h ? unit(m, 'minute') : '', unit(s % 60, 'second')].filter(Boolean).join(' ');
}

interface Props {
  remainingMs: number;
  hidden: boolean;
  onToggle: () => void;
}

/** Countdown at the right of the bottom strip. Click to hide it; it can't stay hidden under 5 minutes. */
export function ExamTimer({ remainingMs, hidden, onToggle }: Props) {
  const low = remainingMs < FIVE_MIN;
  const showHidden = hidden && !low;
  const cls = ['ex-timer-text', low && 'is-low', remainingMs < ONE_MIN && 'is-last', showHidden && 'is-hidden'].filter(Boolean).join(' ');
  const label = showHidden ? 'Timer hidden. Click to show.' : `Time remaining ${spoken(remainingMs)}.${low ? '' : ' Click to hide.'}`;
  return (
    <button type="button" className="ex-timer" data-native-enter aria-label={label} title={label} onClick={onToggle}>
      {showHidden ? (
        <span className={cls}>––:––</span>
      ) : (
        <span className={cls} role="timer">
          {clock(remainingMs)}
        </span>
      )}
    </button>
  );
}
