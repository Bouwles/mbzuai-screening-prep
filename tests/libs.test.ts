// Unit tests for the shared maths/LaTeX helpers and the rich-text parser.
import { describe, expect, it } from 'vitest';
import { Frac } from '../src/lib/frac';
import { frac, matrix, num, paren, poly, signed, sqrtTex, sum, term } from '../src/lib/tex';
import { det, det3, inv2, mean, median, nCr, nPr, quartiles, rank, sd, variance, mod, floorDiv } from '../src/lib/mathx';
import { Rng, hashSeed } from '../src/lib/rng';
import { extractMath, extractText, parseBlocks } from '../src/lib/richtext';
import { mathLint } from './validate';

describe('tex helpers', () => {
  it('builds clean polynomials', () => {
    expect(poly([1, -3, 2])).toBe('x^{2} - 3x + 2');
    expect(poly([-1, 0, 1])).toBe('-x^{2} + 1');
    expect(poly([2, 1, 0])).toBe('2x^{2} + x');
    expect(poly([0, 0, 0])).toBe('0');
    expect(sum([[3, 'x'], [-1, 'y'], [0, 'z'], [-4, '']])).toBe('3x - y - 4');
    expect(term(new Frac(-1, 2), 'x', false)).toBe(' - \\frac{1}{2}x');
  });
  it('formats numbers and fractions', () => {
    expect(num(0.1 + 0.2)).toBe('0.3');
    expect(num(-0)).toBe('0');
    expect(frac(6, 8)).toBe('\\frac{3}{4}');
    expect(frac(-4, 2)).toBe('-2');
    expect(frac(3, -6)).toBe('-\\frac{1}{2}');
    expect(paren(-3)).toBe('\\left(-3\\right)');
    expect(signed(-5)).toBe(' - 5');
    expect(sqrtTex(12)).toBe('2\\sqrt{3}');
    expect(sqrtTex(49)).toBe('7');
    expect(matrix([[1, 2], [3, 4]])).toBe('\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}');
  });
  it('generated polynomials pass the LaTeX lint', () => {
    const rng = new Rng(7);
    for (let i = 0; i < 2000; i++) {
      const cs = [rng.int(-5, 5), rng.int(-5, 5), rng.int(-5, 5), rng.int(-5, 5)];
      expect(mathLint(poly(cs))).toBeNull();
    }
  });
});

describe('lint catches ugly LaTeX', () => {
  it.each(['1x + 2', 'x + -3', 'x - -3', 'x^{1}', '\\frac{3}{1}', 'x + 0'])('flags %s', (s) => expect(mathLint(s)).not.toBeNull());
  it.each(['10x + 2', 'x - 3', 'x^{10}', '\\frac{1}{2}', 'x + 0.5', '\\text{1st}', 'x_1 + x_2'])('allows %s', (s) => expect(mathLint(s)).toBeNull());
});

describe('Frac', () => {
  it('reduces and does arithmetic exactly', () => {
    expect(new Frac(6, -8).toString()).toBe('-3/4');
    expect(new Frac(1, 3).add(new Frac(1, 6)).toString()).toBe('1/2');
    expect(new Frac(2, 3).mul(new Frac(3, 4)).equals(new Frac(1, 2))).toBe(true);
    expect(new Frac(1, 2).div(new Frac(1, 4)).toString()).toBe('2');
  });
});

describe('mathx', () => {
  it('counts', () => {
    expect(nCr(5, 3)).toBe(10);
    expect(nCr(52, 5)).toBe(2598960);
    expect(nPr(5, 2)).toBe(20);
  });
  it('statistics', () => {
    expect(mean([4, 6, 6, 7, 8, 10])).toBeCloseTo(41 / 6);
    expect(median([3, 1, 2])).toBe(2);
    expect(median([4, 1, 3, 2])).toBe(2.5);
    expect(quartiles([1, 2, 3, 4, 5, 6, 7])).toEqual({ q1: 2, q2: 4, q3: 6 });
    expect(quartiles([1, 2, 3, 4, 5, 6, 7, 8])).toEqual({ q1: 2.5, q2: 4.5, q3: 6.5 });
    expect(variance([2, 4, 4, 4, 5, 5, 7, 9])).toBe(4);
    expect(sd([2, 4, 4, 4, 5, 5, 7, 9])).toBe(2);
  });
  it('linear algebra', () => {
    expect(det([[1, 2], [3, 4]])).toBe(-2);
    expect(det3([[1, 2, 3], [0, 1, 4], [5, 6, 0]])).toBe(1);
    expect(inv2([[4, 7], [2, 6]]).map((r) => r.map((f) => f.toString()))).toEqual([
      ['3/5', '-7/10'],
      ['-1/5', '2/5'],
    ]);
    expect(rank([[1, 2, 3], [2, 4, 6], [3, 6, 9]])).toBe(1);
    expect(rank([[1, 2], [3, 4]])).toBe(2);
    expect(rank([[0, 0], [0, 0]])).toBe(0);
  });
  it('python-style % and //', () => {
    expect(mod(-7, 3)).toBe(2);
    expect(floorDiv(-7, 2)).toBe(-4);
  });
});

describe('rng', () => {
  it('is deterministic per seed and in range', () => {
    const a = new Rng(42);
    const b = new Rng(42);
    for (let i = 0; i < 100; i++) expect(a.int(1, 6)).toBe(b.int(1, 6));
    const r = new Rng(1);
    for (let i = 0; i < 1000; i++) {
      const v = r.int(-3, 3);
      expect(v).toBeGreaterThanOrEqual(-3);
      expect(v).toBeLessThanOrEqual(3);
    }
    expect(hashSeed('abc')).toBe(hashSeed('abc'));
  });
});

describe('rich text parser', () => {
  it('separates maths, code and text', () => {
    const src = 'Solve $x^2 = 4$ and print `x ** 2`. Cost: AED \\$5.\n\n$$\\frac{1}{2}$$\n\n- item $a$\n- **bold $b$**';
    expect(extractMath(src).map((m) => m.v)).toEqual(['x^2 = 4', '\\frac{1}{2}', 'a', 'b']);
    expect(extractText(src).join('')).not.toContain('^');
    expect(parseBlocks(src).map((b) => b.t)).toEqual(['p', 'mathblock', 'ul']);
  });
  it('parses tables', () => {
    expect(parseBlocks('| a | b |\n|---|---|\n| 1 | $2$ |')[0].t).toBe('table');
  });
});
