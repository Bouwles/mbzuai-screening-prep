// Helpers that produce CLEAN LaTeX for generated questions:
// no "1x", no "+ -3", no "x^1", fractions reduced, negatives bracketed when substituted.
import { Frac } from './frac';

/** Format a number for LaTeX: integers as-is, decimals trimmed to `dp` places, minus sign kept. */
export function num(x: number, dp = 4): string {
  if (!Number.isFinite(x)) throw new Error(`num(): not finite: ${x}`);
  const r = Math.round(x * 10 ** dp) / 10 ** dp;
  const s = Object.is(r, -0) ? '0' : String(r);
  if (s.includes('e')) throw new Error(`num(): exponent form not allowed: ${s}`);
  return s;
}

/** Plain-text number for prose (thousands separators off, trimmed decimals). Same as num(). */
export const fmt = num;

/** Number wrapped in brackets if negative, for substitution: 3 -> "3", -3 -> "(-3)". */
export function paren(x: number | Frac): string {
  const t = typeof x === 'number' ? num(x) : x.tex();
  return (typeof x === 'number' ? x < 0 : x.n < 0) ? `\\left(${t}\\right)` : t;
}

/** LaTeX fraction n/d, reduced; integer if it divides. */
export function frac(n: number, d: number): string {
  return new Frac(n, d).tex();
}

/** " + 3" / " - 3" for appending a constant to an expression. */
export function signed(x: number | Frac): string {
  if (typeof x === 'number') return x < 0 ? ` - ${num(-x)}` : ` + ${num(x)}`;
  return x.n < 0 ? ` - ${x.neg().tex()}` : ` + ${x.tex()}`;
}

/**
 * A single signed term "coef·v" inside a sum.
 * first=true gives a leading term ("-x", "3x", "x"); otherwise " + 3x" / " - x".
 * Returns '' for a zero coefficient.
 */
export function term(coef: number | Frac, v: string, first: boolean): string {
  const c = typeof coef === 'number' ? new Frac(coef) : coef;
  if (c.n === 0) return '';
  const neg = c.n < 0;
  const a = neg ? c.neg() : c;
  let body: string;
  if (v === '') body = a.tex();
  else if (a.equals(1)) body = v;
  else body = `${a.tex()}${v}`;
  if (first) return neg ? `-${body}` : body;
  return neg ? ` - ${body}` : ` + ${body}`;
}

/** Join terms [[coef, variablePart], ...] into a clean sum; "0" if every coefficient is zero. */
export function sum(terms: [number | Frac, string][]): string {
  let out = '';
  for (const [c, v] of terms) {
    const t = term(c, v, out === '');
    out += t;
  }
  return out === '' ? '0' : out;
}

/** Polynomial from coefficients in DESCENDING powers: poly([2,-3,0,1]) = "2x^{3} - 3x^{2} + 1". */
export function poly(coeffs: (number | Frac)[], v = 'x'): string {
  const n = coeffs.length - 1;
  return sum(coeffs.map((c, i) => [c, power(v, n - i)] as [number | Frac, string]));
}

/** "x^{3}", "x", "" (for power 0). */
export function power(v: string, p: number): string {
  if (p === 0) return '';
  if (p === 1) return v;
  return `${v}^{${p}}`;
}

/** Matrix in LaTeX using bmatrix. Entries may be numbers, Fracs or ready-made LaTeX strings. */
export function matrix(rows: (number | Frac | string)[][]): string {
  const cell = (x: number | Frac | string) => (typeof x === 'string' ? x : typeof x === 'number' ? num(x) : x.tex());
  return `\\begin{bmatrix} ${rows.map((r) => r.map(cell).join(' & ')).join(' \\\\ ')} \\end{bmatrix}`;
}

/** Column vector. */
export function vec(entries: (number | Frac | string)[]): string {
  return matrix(entries.map((e) => [e]));
}

/** Simplify sqrt(n) for integer n >= 0: 12 -> "2\sqrt{3}", 9 -> "3", 7 -> "\sqrt{7}". */
export function sqrtTex(n: number): string {
  if (!Number.isInteger(n) || n < 0) throw new Error(`sqrtTex needs a non-negative integer, got ${n}`);
  let outside = 1;
  let inside = n;
  for (let k = 2; k * k <= inside; k++) {
    while (inside % (k * k) === 0) {
      inside /= k * k;
      outside *= k;
    }
  }
  if (inside === 1) return String(outside);
  return outside === 1 ? `\\sqrt{${inside}}` : `${outside}\\sqrt{${inside}}`;
}

/** Wrap LaTeX as inline maths for rich text. */
export function m(texSrc: string): string {
  return `$${texSrc}$`;
}

/** Wrap LaTeX as display maths for rich text (own paragraph). */
export function dm(texSrc: string): string {
  return `\n\n$$${texSrc}$$\n\n`;
}

/** Python repr of a list of numbers/strings, e.g. [1, 2, 'a'] -> "[1, 2, 'a']". */
export function pyList(items: (number | string)[]): string {
  return `[${items.map((x) => (typeof x === 'string' ? `'${x}'` : String(x))).join(', ')}]`;
}
