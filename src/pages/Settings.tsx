import { useRef, useState } from 'react';
import { exportJson, importJson, resetAll, update, useStore } from '../store/progress';

export function Settings() {
  const theme = useStore((s) => s.theme);
  const timer = useStore((s) => s.practiceTimer);
  const answered = useStore((s) => s.attempts.length);
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const doExport = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `screening-prep-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMsg({ ok: true, text: 'Progress exported. Import this file on your other computer.' });
  };

  const doImport = async (f: File) => {
    try {
      importJson(await f.text());
      setMsg({ ok: true, text: 'Progress imported.' });
    } catch (e) {
      setMsg({ ok: false, text: `Import failed: ${(e as Error).message}` });
    }
  };

  return (
    <div className="page settings">
      <header className="page-head">
        <h1>Settings</h1>
      </header>
      <section className="panel">
        <h2>Appearance</h2>
        <div className="seg" role="radiogroup" aria-label="Theme">
          {(['dark', 'light'] as const).map((t) => (
            <button key={t} type="button" role="radio" aria-checked={theme === t} className={theme === t ? 'on' : ''} onClick={() => update((s) => ({ ...s, theme: t }))}>
              <strong>{t === 'dark' ? 'Dark' : 'Light'}</strong>
            </button>
          ))}
        </div>
        <label className="check-row">
          <input type="checkbox" checked={timer} onChange={(e) => update((s) => ({ ...s, practiceTimer: e.target.checked }))} /> Show the per-question timer in
          practice
        </label>
      </section>
      <section className="panel">
        <h2>Move progress between computers</h2>
        <p className="muted">Progress is saved in this browser only. Export it to a file, then import that file on your other computer.</p>
        <div className="row-actions">
          <button type="button" className="btn-primary" onClick={doExport}>
            Export progress
          </button>
          <button type="button" className="btn-ghost" onClick={() => fileRef.current?.click()}>
            Import progress
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) doImport(f);
              e.target.value = '';
            }}
          />
        </div>
        <p className="muted small-print">Importing replaces the progress currently in this browser.</p>
        {msg && <p className={msg.ok ? 'pass' : 'below'}>{msg.text}</p>}
      </section>
      <section className="panel danger">
        <h2>Reset progress</h2>
        <p className="muted">Deletes every answer, mock exam, mistake card and lesson mark ({answered.toLocaleString()} answers). This cannot be undone.</p>
        {!confirmReset ? (
          <button type="button" className="btn-danger" onClick={() => setConfirmReset(true)}>
            Reset progress
          </button>
        ) : (
          <div className="row-actions">
            <span className="warn">Are you sure? Export first if you might want it back.</span>
            <button
              type="button"
              className="btn-danger"
              onClick={() => {
                resetAll();
                setConfirmReset(false);
                setMsg({ ok: true, text: 'Progress reset.' });
              }}
            >
              Yes, delete everything
            </button>
            <button type="button" className="btn-ghost" onClick={() => setConfirmReset(false)}>
              Cancel
            </button>
          </div>
        )}
      </section>
      <section className="panel">
        <h2>Exam settings</h2>
        <p className="muted">
          Mock lengths, question counts, topic weights and the 75% target line live in <code className="inline-code">src/config/exam.ts</code>. Edit that file
          and save; the site updates.
        </p>
      </section>
    </div>
  );
}
