import { RichInline } from '../Rich';

interface Props {
  /** Question key, used to name the radio group. */
  name: string;
  /** Question number, for the group's accessible name. */
  number: number;
  options: string[];
  selected: number | null;
  onSelect?: (i: number) => void;
  /** After Check, or in review: rows no longer respond. */
  locked?: boolean;
  /** Shows the correct option and, if it differs, the option picked. */
  correctIndex?: number;
}

/** An option that is nothing but maths gets slightly larger type. */
const isMathOnly = (o: string) => /^\s*\$\$?[^$]+\$\$?\s*$/.test(o);

export function ExamOptions({ name, number, options, selected, onSelect, locked, correctIndex }: Props) {
  const revealed = correctIndex !== undefined;
  return (
    <div className="ex-opts" role="radiogroup" aria-label={`Answer options for question ${number}`}>
      {options.map((o, i) => {
        const picked = selected === i;
        const right = revealed && i === correctIndex;
        const wrong = revealed && picked && !right;
        const cls = ['ex-opt', picked && 'is-selected', locked && 'is-locked', right && 'is-right', wrong && 'is-wrong', isMathOnly(o) && 'has-math'].filter(Boolean).join(' ');
        return (
          <label key={i} className={cls}>
            <input
              type="radio"
              name={`q-${name}`}
              checked={picked}
              disabled={locked}
              onChange={() => onSelect?.(i)}
              onKeyDown={(e) => {
                // Enter on a row that isn't chosen yet chooses it. On a chosen row it stays the Check / Next shortcut.
                if (e.key === 'Enter' && !picked && !locked) {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelect?.(i);
                }
              }}
            />
            <span className={`ex-opt-text ${isMathOnly(o) ? 'ex-opt-math' : ''}`}>
              <RichInline text={o} big />
            </span>
            {right && (
              <span className="ex-verdict ex-verdict-ok" role="img" aria-label="Correct answer">
                ✓
              </span>
            )}
            {wrong && (
              <span className="ex-verdict ex-verdict-bad" role="img" aria-label="Your answer, incorrect">
                ✗
              </span>
            )}
          </label>
        );
      })}
    </div>
  );
}
