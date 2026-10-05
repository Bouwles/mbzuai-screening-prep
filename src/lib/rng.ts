// Seeded random number generator (mulberry32). Same seed => same sequence, so any
// generated question can be rebuilt exactly from (generatorId, seed).

export class Rng {
  private s: number;
  constructor(seed: number) {
    this.s = seed >>> 0 || 0x9e3779b9;
  }
  /** Float in [0, 1). */
  next(): number {
    let t = (this.s = (this.s + 0x6d2b79f5) >>> 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  /** Integer in [min, max] inclusive. */
  int(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }
  /** Non-zero integer in [min, max]. */
  intNonZero(min: number, max: number): number {
    for (;;) {
      const v = this.int(min, max);
      if (v !== 0) return v;
    }
  }
  pick<T>(items: readonly T[]): T {
    return items[Math.floor(this.next() * items.length)];
  }
  /** k distinct items. */
  sample<T>(items: readonly T[], k: number): T[] {
    return this.shuffle(items).slice(0, k);
  }
  shuffle<T>(items: readonly T[]): T[] {
    const a = items.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  bool(p = 0.5): boolean {
    return this.next() < p;
  }
}

/** Hash a string to a 32-bit seed (used to shuffle static questions deterministically). */
export function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** A fresh random seed for a new variant (UI only; generators must use the Rng they are given). */
export function freshSeed(): number {
  return (Math.random() * 2 ** 31) >>> 0 || 1;
}
