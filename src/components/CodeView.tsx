import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import { memo, useMemo } from 'react';
import type { CodeBlock } from '../types';

hljs.registerLanguage('python', python);
hljs.registerLanguage('pseudocode', () => ({
  name: 'pseudocode',
  keywords: {
    keyword: 'while if else for to end break return function',
    literal: 'true false',
    built_in: 'print mod div length push pop enqueue dequeue and or not',
  },
  contains: [
    { scope: 'comment', begin: '//', end: '$' },
    { scope: 'string', begin: '"', end: '"' },
    { scope: 'number', begin: /\b\d+(\.\d+)?\b/ },
  ],
}));

/** Plain, unboxed code as it appears on the exam screen. Used for all pseudocode and for all code in mocks. */
function ExamCode({ source }: { source: string }) {
  return (
    <pre className="ex-code">
      <code>{source}</code>
    </pre>
  );
}

/**
 * 'exam' is plain Courier with no box. 'study' adds syntax highlighting and line numbers, for Python
 * outside mocks and for code in explanations. By default pseudocode is 'exam' and Python is 'study'.
 */
export const CodeView = memo(function CodeView({ code, variant }: { code: CodeBlock; variant?: 'exam' | 'study' }) {
  if ((variant ?? (code.lang === 'python' ? 'study' : 'exam')) === 'exam') return <ExamCode source={code.source} />;
  return <StudyCode code={code} />;
});

/** Highlighted code with line numbers. */
function StudyCode({ code }: { code: CodeBlock }) {
  const lines = useMemo(() => {
    const html = hljs.highlight(code.source, { language: code.lang }).value;
    // hljs spans never cross lines for these languages, so splitting on \n keeps tags balanced
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
}
