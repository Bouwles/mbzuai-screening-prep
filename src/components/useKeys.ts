import { useEffect, useRef } from 'react';

/** Global keyboard shortcuts, ignored while typing in inputs. */
export function useKeys(handler: (e: KeyboardEvent) => void) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      // Answer options are real radio inputs, and shortcuts must keep working while one has focus.
      const radio = t instanceof HTMLInputElement && t.type === 'radio';
      if (t && !radio && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Enter' && t?.tagName === 'BUTTON') {
        // Exam navigation buttons keep their own Enter: it activates the button.
        if (t.closest('[data-native-enter]')) return;
        // Elsewhere Enter is ours (check / next), not a click on whichever button has focus.
        e.preventDefault();
      }
      ref.current(e);
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);
}
