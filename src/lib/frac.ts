// Exact rational arithmetic for generators (probability, linear algebra, ...).

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

export function lcm(a: number, b: number): number {
  return a === 0 || b === 0 ? 0 : Math.abs(a * b) / gcd(a, b);
}

export class Frac {
  readonly n: number;
  readonly d: number;
  constructor(n: number, d = 1) {
    if (!Number.isInteger(n) || !Number.isInteger(d)) throw new Error(`Frac needs integers, got ${n}/${d}`);
    if (d === 0) throw new Error('Frac: zero denominator');
    const g = gcd(n, d) || 1;
    const s = d < 0 ? -1 : 1;
    this.n = (s * n) / g;
    this.d = (s * d) / g;
  }
  static of(x: number | Frac): Frac {
    return x instanceof Frac ? x : new Frac(x, 1);
  }
  add(o: number | Frac): Frac {
    const b = Frac.of(o);
    return new Frac(this.n * b.d + b.n * this.d, this.d * b.d);
  }
  sub(o: number | Frac): Frac {
    const b = Frac.of(o);
    return new Frac(this.n * b.d - b.n * this.d, this.d * b.d);
  }
  mul(o: number | Frac): Frac {
    const b = Frac.of(o);
    return new Frac(this.n * b.n, this.d * b.d);
  }
  div(o: number | Frac): Frac {
    const b = Frac.of(o);
    if (b.n === 0) throw new Error('Frac: divide by zero');
    return new Frac(this.n * b.d, this.d * b.n);
  }
  neg(): Frac {
    return new Frac(-this.n, this.d);
  }
  equals(o: number | Frac): boolean {
    const b = Frac.of(o);
    return this.n === b.n && this.d === b.d;
  }
  isInt(): boolean {
    return this.d === 1;
  }
  value(): number {
    return this.n / this.d;
  }
  /** LaTeX: "3", "-\frac{1}{2}", "\frac{7}{3}". */
  tex(): string {
    if (this.d === 1) return String(this.n);
    const body = `\\frac{${Math.abs(this.n)}}{${this.d}}`;
    return this.n < 0 ? `-${body}` : body;
  }
  toString(): string {
    return this.d === 1 ? String(this.n) : `${this.n}/${this.d}`;
  }
}
