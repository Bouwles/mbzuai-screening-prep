import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import { memo, useMemo } from 'react';
import type { CodeBlock } from '../types';

hljs.registerLanguage('python', python);

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Highlighted code with line numbers (for tracing questions). */
export const CodeView = memo(function CodeView({ code }: { code: CodeBlock }) {
  const lines = useMemo(() => {
    const html = code.lang === 'python' ? hljs.highlight(code.source, { language: 'python' }).value : escapeHtml(code.source);
    // hljs spans never cross lines for python, so splitting on \n keeps tags balanced
    return html.split('\n');
  }, [code]);
  return (
    <figure className="code-block">
      <figcaption>{code.lang === 'python' ? 'Python' : 'Pseudocode'}</figcaption>
      <pre>
        <code>
          {lines.map((l, i) => (
            <span className="code-line" key={i}>
              <span className="ln" aria-hidden>
                {i + 1}
              </span>
              <span dangerouslySetInnerHTML={{ __html: l || ' ' }} />
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
});
