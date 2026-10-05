// Validation helpers shared by the content tests.
import katex from 'katex';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { extractMath, extractText, toPlain } from '../src/lib/richtext';
import type { ChartSpec, TableSpec } from '../src/types';

const katexCache = new Map<string, string | null>();

/** Returns an error message, or null if the LaTeX renders cleanly. */
export function katexError(src: string, display: boolean): string | null {
  const k = (display ? 'D|' : 'I|') + src;
  if (katexCache.has(k)) return katexCache.get(k)!;
  let err: string | null = null;
  try {
    katex.renderToString(src, { displayMode: display, throwOnError: true, strict: 'error' });
  } catch (e) {
    err = (e as Error).message;
  }
  katexCache.set(k, err);
  return err;
}

/** Style rules for LaTeX: catches "1x", "+ -3", "x^{1}", "\frac{a}{1}", "+ 0". */
export function mathLint(src: string): string | null {
  const rules: [RegExp, string][] = [
    [/(?<![\w.^_{\\])1(?=[a-zA-Z])(?!\s)/, 'coefficient 1 written explicitly (e.g. "1x")'],
    [/\{1(?=[a-zA-Z])/, 'coefficient 1 written explicitly (e.g. "{1x}")'],
    [/[+-]\s*[+-]/,'double sign such as "+ -" or "- -"'],
    [/\^\{1\}|\^1(?![\d.])/, 'power of 1 written explicitly'],
    [/\\frac\{[^{}]*\}\{1\}/, 'fraction with denominator 1'],
    [/(?<![\w.\\])[+-]\s*0(?![\d.,])/, 'adding or subtracting 0'],
    [/NaN|Infinity|undefined|\[object/, 'NaN / Infinity / undefined in maths'],
  ];
  // ignore words inside \text{...} / \mathrm{...} (e.g. "1st")
  const bare = src.replace(/\\(?:text|mathrm|textbf|mathbf|operatorname)\{[^{}]*\}/g, '\\square');
  for (const [re, msg] of rules) if (re.test(bare)) return `${msg}: ${src}`;
  return null;
}

/** Checks one rich-text field. Returns a list of problems. */
export function richProblems(field: string, text: string): string[] {
  const out: string[] = [];
  if (typeof text !== 'string') return [`${field}: not a string`];
  if (/\bNaN\b|\bInfinity\b|\bundefined\b|\[object Object\]/.test(text)) out.push(`${field}: contains NaN/Infinity/undefined`);
  // Unbalanced $ (after removing escaped \$, code spans and matched maths)
  const stripped = text
    .replace(/\\\$/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/\$\$[\s\S]*?\$\$/g, '')
    .replace(/\$[^$]*\$/g, '');
  if (stripped.includes('$')) out.push(`${field}: unbalanced $ (use \\$ for a literal dollar sign)`);
  for (const mth of extractMath(text)) {
    const err = katexError(mth.v, mth.display);
    if (err) out.push(`${field}: KaTeX error "${err}" in: ${mth.v}`);
    const lint = mathLint(mth.v);
    if (lint) out.push(`${field}: ${lint}`);
  }
  for (const t of extractText(text)) {
    if (/\^|\\[a-zA-Z]+|sqrt\(/.test(t)) out.push(`${field}: maths written as plain text (put it inside $...$): "${t.trim().slice(0, 80)}"`);
  }
  return out;
}

export const norm = (s: string) => toPlain(s).toLowerCase().replace(/\s+/g, '');

export function finiteDeep(x: unknown, path: string, out: string[]) {
  if (typeof x === 'number' && !Number.isFinite(x)) out.push(`${path}: non-finite number`);
  else if (typeof x === 'string' && /\bNaN\b|\bInfinity\b|\bundefined\b/.test(x)) out.push(`${path}: bad string ${x}`);
  else if (Array.isArray(x)) x.forEach((v, i) => finiteDeep(v, `${path}[${i}]`, out));
  else if (x && typeof x === 'object') Object.entries(x).forEach(([k, v]) => finiteDeep(v, `${path}.${k}`, out));
}

export function visualProblems(chart?: ChartSpec, table?: TableSpec): string[] {
  const out: string[] = [];
  if (chart) {
    finiteDeep(chart, 'chart', out);
    if ((chart.kind === 'bar' || chart.kind === 'line') && chart.series.some((s) => s.values.length !== chart.categories.length))
      out.push('chart: series length != categories length');
    if (chart.kind === 'histogram' && chart.edges.length !== chart.frequencies.length + 1) out.push('chart: histogram edges length');
  }
  if (table) {
    finiteDeep(table, 'table', out);
    if (table.rows.some((r) => r.length !== table.headers.length)) out.push('table: row length != headers length');
    [...table.headers, ...table.rows.flat()].forEach((c) => {
      if (typeof c === 'string') out.push(...richProblems('table cell', c));
    });
  }
  return out;
}

// ---------------------------------------------------------------- Python
let pythonCmd: string | null | undefined;
export function findPython(): string | null {
  if (pythonCmd !== undefined) return pythonCmd;
  pythonCmd = null;
  for (const c of ['python', 'python3', 'py']) {
    const r = spawnSync(c, ['-c', 'import sys; print(sys.version_info[0])'], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout.trim() === '3') {
      pythonCmd = c;
      break;
    }
  }
  return pythonCmd;
}

export interface PyResult {
  stdout: string;
  error: string | null;
}

const RUNNER = `
import sys, io, json, contextlib, traceback
sys.setrecursionlimit(3000)
data = json.load(open(sys.argv[1], encoding='utf-8'))
res = []
for src in data:
    buf = io.StringIO()
    err = None
    try:
        with contextlib.redirect_stdout(buf):
            exec(compile(src, '<snippet>', 'exec'), {'__name__': '__main__'})
    except BaseException as e:
        err = type(e).__name__
    res.append({'stdout': buf.getvalue(), 'error': err})
json.dump(res, open(sys.argv[2], 'w', encoding='utf-8'))
`;

/** Runs many snippets in ONE Python process (fast). Each snippet gets a fresh namespace. */
export function runPythonBatch(snippets: string[]): PyResult[] {
  const py = findPython();
  if (!py) throw new Error('python not found');
  const dir = mkdtempSync(join(tmpdir(), 'pyq-'));
  const inF = join(dir, 'in.json');
  const outF = join(dir, 'out.json');
  const runF = join(dir, 'run.py');
  writeFileSync(inF, JSON.stringify(snippets), 'utf8');
  writeFileSync(runF, RUNNER, 'utf8');
  const r = spawnSync(py, [runF, inF, outF], { encoding: 'utf8', timeout: 300_000, env: { ...process.env, PYTHONIOENCODING: 'utf-8' } });
  if (r.status !== 0) throw new Error(`python runner failed: ${r.stderr || r.error}`);
  return JSON.parse(readFileSync(outF, 'utf8'));
}

/** Option text -> comparable output: strip backticks/markdown, collapse whitespace. */
export const outNorm = (s: string) => toPlain(s).replace(/\s+/g, ' ').trim();
