// Turns a question's stored explanation into the four parts shown after answering.
// Stored data can be incomplete, so nothing here assumes a field exists or has the right shape.
import type { QuestionBody } from '../types';

export interface Explanation {
  /** "What is it asking?" */
  asking: string | null;
  /** "How to solve it": one entry per numbered step. */
  steps: string[];
  /** "Why this is the answer" */
  conclusion: string | null;
  /** "For similar questions" */
  method: string | null;
}

const text = (x: unknown): string | null => (typeof x === 'string' && x.trim() ? x.trim() : null);

/** Join worked-solution steps. Each entry becomes one numbered step on screen. */
export const steps = (...parts: (string | false | null | undefined)[]): string => parts.filter(Boolean).join('\n\n');

/** A small Markdown table, for tracing variables through a loop. */
export function table(head: (string | number)[], rows: (string | number)[][]): string {
  const row = (cells: (string | number)[]) => `| ${cells.join(' | ')} |`;
  return [row(head), row(head.map(() => '---')), ...rows.map(row)].join('\n');
}

/** A table, display maths, code block or bullet list continues the step before it. */
const continuesStep = (block: string) => /^(\$\$|\||```|[-*]\s)/.test(block);

/**
 * Split a worked solution into steps: one per blank-line-separated block, keeping code fences whole
 * and keeping tables, display maths, code and bullets with the sentence that introduces them.
 */
export function splitSteps(solution: unknown): string[] {
  const src = text(solution);
  if (!src) return [];
  const blocks: string[] = [];
  let cur: string[] = [];
  let inFence = false;
  for (const line of src.replace(/\r\n/g, '\n').split('\n')) {
    if (line.trim().startsWith('```')) inFence = !inFence;
    if (!inFence && !line.trim()) {
      if (cur.length) blocks.push(cur.join('\n'));
      cur = [];
    } else cur.push(line);
  }
  if (cur.length) blocks.push(cur.join('\n'));

  const out: string[] = [];
  for (const block of blocks) {
    // A numbered list already is a list of steps.
    if (/^\d+\.\s/.test(block) && block.split('\n').every((l) => /^(\d+\.\s|\s{2,}\S)/.test(l))) {
      out.push(...block.split(/\n(?=\d+\.\s)/).map((item) => item.replace(/^\d+\.\s+/, '').trim()));
    } else if (continuesStep(block) && out.length) out[out.length - 1] += `\n\n${block}`;
    else out.push(block);
  }
  return out;
}

/** The four parts of a question's explanation. Anything missing or malformed comes back empty. */
export function explanationOf(q: Pick<QuestionBody, 'markScheme'>): Explanation {
  const ms = q.markScheme as Partial<QuestionBody['markScheme']> | null | undefined;
  return {
    asking: text(ms?.asking),
    steps: splitSteps(ms?.solution),
    conclusion: text(ms?.conclusion),
    method: text(ms?.keyIdea),
  };
}

/** Why a particular option is wrong, if the data says. */
export function whyWrongFor(q: Pick<QuestionBody, 'markScheme'>, i: number): string | null {
  const list = (q.markScheme as Partial<QuestionBody['markScheme']> | null | undefined)?.whyWrong;
  return Array.isArray(list) ? text(list[i]) : null;
}
