// Small maths toolkit used by generators and by answer checks in the tests.
import { Frac } from './frac';

export const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));
export const nPr = (n: number, r: number): number => (r < 0 || r > n ? 0 : factorial(n) / factorial(n - r));
export function nCr(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  r = Math.min(r, n - r);
  let out = 1;
  for (let i = 1; i <= r; i++) out = (out * (n - r + i)) / i;
  return Math.round(out);
}

export const sumOf = (xs: number[]): number => xs.reduce((a, b) => a + b, 0);
export const mean = (xs: number[]): number => sumOf(xs) / xs.length;

export function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const k = s.length;
  return k % 2 ? s[(k - 1) / 2] : (s[k / 2 - 1] + s[k / 2]) / 2;
}

/** All modes (values with the highest frequency). */
export function modes(xs: number[]): number[] {
  const c = new Map<number, number>();
  xs.forEach((x) => c.set(x, (c.get(x) ?? 0) + 1));
  const top = Math.max(...c.values());
  return [...c.entries()].filter(([, v]) => v === top).map(([k]) => k).sort((a, b) => a - b);
}

/**
 * Quartiles by the "median of each half" method (the method used by IB / calculators like the TI-84):
 * for odd n the median itself is excluded from both halves.
 */
export function quartiles(xs: number[]): { q1: number; q2: number; q3: number } {
  const s = [...xs].sort((a, b) => a - b);
  const k = s.length;
  const lower = s.slice(0, Math.floor(k / 2));
  const upper = s.slice(Math.ceil(k / 2));
  return { q1: median(lower), q2: median(s), q3: median(upper) };
}

/** Population variance (divide by n). */
export function variance(xs: number[]): number {
  const mu = mean(xs);
  return mean(xs.map((x) => (x - mu) ** 2));
}
/** Sample variance (divide by n - 1). */
export function sampleVariance(xs: number[]): number {
  const mu = mean(xs);
  return sumOf(xs.map((x) => (x - mu) ** 2)) / (xs.length - 1);
}
export const sd = (xs: number[]): number => Math.sqrt(variance(xs));

export function round(x: number, dp = 0): number {
  const f = 10 ** dp;
  return Math.round((x + Number.EPSILON * Math.sign(x)) * f) / f;
}

export function approxEqual(a: number, b: number, tol = 1e-9): boolean {
  return Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b));
}

// ----- matrices (plain number arrays) -----
export type Mat = number[][];

export function matMul(a: Mat, b: Mat): Mat {
  if (a[0].length !== b.length) throw new Error('matMul: incompatible dimensions');
  return a.map((row) => b[0].map((_, j) => row.reduce((acc, v, k) => acc + v * b[k][j], 0)));
}
export const transpose = (a: Mat): Mat => a[0].map((_, j) => a.map((r) => r[j]));
export const det2 = (a: Mat): number => a[0][0] * a[1][1] - a[0][1] * a[1][0];
export function det3(a: Mat): number {
  return (
    a[0][0] * (a[1][1] * a[2][2] - a[1][2] * a[2][1]) -
    a[0][1] * (a[1][0] * a[2][2] - a[1][2] * a[2][0]) +
    a[0][2] * (a[1][0] * a[2][1] - a[1][1] * a[2][0])
  );
}
export function det(a: Mat): number {
  if (a.length === 1) return a[0][0];
  if (a.length === 2) return det2(a);
  if (a.length === 3) return det3(a);
  // Laplace expansion along the first row.
  return a[0].reduce((acc, v, j) => acc + (j % 2 ? -1 : 1) * v * det(a.slice(1).map((r) => r.filter((_, k) => k !== j))), 0);
}
/** Exact inverse of a 2x2 integer matrix as Fracs (throws if singular). */
export function inv2(a: Mat): Frac[][] {
  const d = det2(a);
  if (d === 0) throw new Error('inv2: singular');
  return [
    [new Frac(a[1][1], d), new Frac(-a[0][1], d)],
    [new Frac(-a[1][0], d), new Frac(a[0][0], d)],
  ];
}
/** Rank by Gaussian elimination with a tolerance. */
export function rank(a: Mat): number {
  const m = a.map((r) => r.slice());
  let r = 0;
  for (let c = 0; c < m[0].length && r < m.length; c++) {
    let p = r;
    for (let i = r + 1; i < m.length; i++) if (Math.abs(m[i][c]) > Math.abs(m[p][c])) p = i;
    if (Math.abs(m[p][c]) < 1e-9) continue;
    [m[r], m[p]] = [m[p], m[r]];
    for (let i = 0; i < m.length; i++) {
      if (i === r) continue;
      const f = m[i][c] / m[r][c];
      for (let j = c; j < m[0].length; j++) m[i][j] -= f * m[r][j];
    }
    r++;
  }
  return r;
}
export const dot = (u: number[], v: number[]): number => u.reduce((acc, x, i) => acc + x * v[i], 0);
export const norm = (u: number[]): number => Math.sqrt(dot(u, u));

// ----- number theory -----
export function isPrime(n: number): boolean {
  if (n < 2 || !Number.isInteger(n)) return false;
  for (let k = 2; k * k <= n; k++) if (n % k === 0) return false;
  return true;
}
/** Mathematical modulo (always non-negative for positive m), same as Python's %. */
export const mod = (a: number, m: number): number => ((a % m) + m) % m;
/** Python-style floor division. */
export const floorDiv = (a: number, b: number): number => Math.floor(a / b);
