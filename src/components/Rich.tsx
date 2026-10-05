import katex from 'katex';
import { memo, type ReactNode } from 'react';
import { parseBlocks, parseInline, type Block, type Inline } from '../lib/richtext';
import { CodeView } from './CodeView';

const texCache = new Map<string, string>();
export function texHtml(src: string, display: boolean): string {
  const k = (display ? 'D' : 'I') + src;
  let html = texCache.get(k);
  if (html === undefined) {
    // Inline \frac is tiny in KaTeX; show full-size fractions everywhere for readability.
    if (!display) src = src.replace(/\\frac(?=[{\s\d])/g, '\\dfrac');
    html = katex.renderToString(src, { displayMode: display, throwOnError: false, strict: 'ignore', output: 'htmlAndMathml' });
    texCache.set(k, html);
  }
  return html;
}

export function Tex({ src, display = false }: { src: string; display?: boolean }) {
  return <span className={display ? 'tex-display' : 'tex'} dangerouslySetInnerHTML={{ __html: texHtml(src, display) }} />;
}

function renderInline(xs: Inline[], big = false): ReactNode[] {
  return xs.map((x, i) => {
    switch (x.t) {
      case 'text':
        return x.v;
      case 'code':
        return (
          <code key={i} className="inline-code">
            {x.v}
          </code>
        );
      case 'math':
        // big: full-size fractions etc. inside answer options
        return <Tex key={i} src={big && !x.display ? `\\displaystyle ${x.v}` : x.v} display={x.display} />;
      case 'b':
        return <strong key={i}>{renderInline(x.c, big)}</strong>;
      case 'i':
        return <em key={i}>{renderInline(x.c, big)}</em>;
    }
  });
}

function renderBlock(b: Block, i: number): ReactNode {
  switch (b.t) {
    case 'p':
      return <p key={i}>{renderInline(b.c)}</p>;
    case 'h':
      return b.level <= 2 ? <h2 key={i}>{renderInline(b.c)}</h2> : b.level === 3 ? <h3 key={i}>{renderInline(b.c)}</h3> : <h4 key={i}>{renderInline(b.c)}</h4>;
    case 'ul':
      return (
        <ul key={i}>
          {b.items.map((it, j) => (
            <li key={j}>{renderInline(it)}</li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol key={i}>
          {b.items.map((it, j) => (
            <li key={j}>{renderInline(it)}</li>
          ))}
        </ol>
      );
    case 'mathblock':
      return <Tex key={i} src={b.v} display />;
    case 'code':
      return <CodeView key={i} code={{ lang: b.lang === 'python' ? 'python' : 'pseudocode', source: b.v }} />;
    case 'table':
      return (
        <div className="table-wrap" key={i}>
          <table className="data-table">
            <thead>
              <tr>
                {b.head.map((h, j) => (
                  <th key={j}>{renderInline(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, j) => (
                <tr key={j}>
                  {r.map((c, k) => (
                    <td key={k}>{renderInline(c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

/** Block-level rich text (paragraphs, lists, display maths...). */
export const Rich = memo(function Rich({ text, className }: { text: string; className?: string }) {
  return <div className={`rich ${className ?? ''}`}>{parseBlocks(text).map(renderBlock)}</div>;
});

/** Inline rich text (for options, labels): no paragraphs. */
export const RichInline = memo(function RichInline({ text, big = false }: { text: string; big?: boolean }) {
  const blocks = parseBlocks(text);
  if (blocks.length === 1 && blocks[0].t === 'p') return <>{renderInline(blocks[0].c, big)}</>;
  if (blocks.length === 0) return <>{renderInline(parseInline(text), big)}</>;
  return <Rich text={text} className="rich-inline" />;
});
