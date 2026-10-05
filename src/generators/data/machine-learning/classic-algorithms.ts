import type { Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { Frac } from '../../../lib/frac';
import { m, num } from '../../../lib/tex';

type Pt = [number, number];

const sqDist = (a: Pt, b: Pt): number => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;

/** "3^2 + 1^2 = 10", omitting zero terms (so no "+ 0" ever appears). */
function sqWorking(a: Pt, b: Pt): string {
  const dx = Math.abs(a[0] - b[0]);
  const dy = Math.abs(a[1] - b[1]);
  const parts = [dx, dy].filter((v) => v !== 0).map((v) => `${v}^2`);
  const total = dx * dx + dy * dy;
  if (parts.length === 0) return '0';
  return `${parts.join(' + ')} = ${total}`;
}

/** Point names A, B, C, ... */
const NAMES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

// ---------------------------------------------------------------- k-NN
const CLASS_SETS: string[][] = [
  ['Cat', 'Dog', 'Rabbit'],
  ['Red', 'Blue', 'Green'],
  ['Apple', 'Orange', 'Pear'],
  ['Sedan', 'SUV', 'Truck'],
  ['Rock', 'Pop', 'Jazz'],
];

function knnVote(rng: Rng) {
  const [X, Y, Z] = rng.shuffle(rng.pick(CLASS_SETS));
  for (;;) {
    const q: Pt = [rng.int(2, 7), rng.int(2, 7)];
    const n = rng.int(6, 7);
    const pts: Pt[] = [];
    let guard = 0;
    while (pts.length < n && guard++ < 200) {
      const p: Pt = [rng.int(1, 9), rng.int(1, 9)];
      if (p[0] === q[0] && p[1] === q[1]) continue;
      if (pts.some((o) => o[0] === p[0] && o[1] === p[1])) continue;
      pts.push(p);
    }
    if (pts.length < n) continue;
    const order = pts.map((p, i) => ({ p, i, d2: sqDist(p, q) })).sort((a, b) => a.d2 - b.d2);
    // strict gaps among the four nearest, so "the 3 nearest" is unambiguous
    if (!(order[0].d2 < order[1].d2 && order[1].d2 < order[2].d2 && order[2].d2 < order[3].d2)) continue;
    // the overall-majority trap needs the far points to be clearly further away
    const labelsByRank: string[] = [Y, X, X];
    const extraPos = n === 7 ? rng.int(3, 6) : -1;
    const extraLabel = rng.pick([Y, Z]);
    for (let r = 3; r < n; r++) labelsByRank.push(r === extraPos ? extraLabel : Z);
    // build the table in random order
    const ranked = order.map((o, r) => ({ ...o, label: labelsByRank[r] }));
    const tableOrder = rng.shuffle(ranked);
    const named = tableOrder.map((o, t) => ({ ...o, name: NAMES[t] }));
    const byRank = [...named].sort((a, b) => a.d2 - b.d2);
    const countZ = named.filter((o) => o.label === Z).length;
    const countX = named.filter((o) => o.label === X).length;
    const nearest = byRank[0];

    const distCell = (d2: number) => {
      const r = Math.sqrt(d2);
      return Number.isInteger(r) ? m(String(r)) : m(`\\sqrt{${d2}} \\approx ${num(r, 2)}`);
    };

    const solution =
      `Work out the distance from $Q = (${q[0]}, ${q[1]})$ to every training point. Comparing **squared** distances gives the same order, so square roots are optional.\n\n` +
      '| Point | $d^2$ | $d$ | Class |\n|---|---|---|---|\n' +
      byRank.map((o) => `| ${o.name} $(${o.p[0]}, ${o.p[1]})$ | ${m(sqWorking(o.p, q))} | ${distCell(o.d2)} | ${o.label} |`).join('\n') +
      '\n\n' +
      `The 3 nearest points are ${byRank[0].name} (${byRank[0].label}), ${byRank[1].name} (${byRank[1].label}) and ${byRank[2].name} (${byRank[2].label}).\n\n` +
      `Vote: ${X} 2, ${Y} 1, so k-NN predicts ${X}.\n\n` +
      `Answer: ${X}`;

    return {
      stem: `The table shows ${n} labelled training points. A new point $Q = (${q[0]}, ${q[1]})$ is classified by **k-NN with $k = 3$**, using Euclidean distance. Which class is predicted for $Q$?`,
      table: {
        headers: ['Point', '$x_1$', '$x_2$', 'Class'],
        rows: named.map((o) => [o.name, o.p[0], o.p[1], o.label] as (string | number)[]),
      },
      answer: X,
      answerValue: X,
      distractors: [
        {
          text: Y,
          value: Y,
          why: `${Y} is the class of the single nearest point, ${nearest.name}. That is the $k = 1$ prediction; with $k = 3$ the next two neighbours (both ${X}) outvote it.`,
        },
        {
          text: Z,
          value: Z,
          why: `${Z} is the most common class in the whole table (${countZ} of ${n}, against ${countX} for ${X}), but none of the ${Z} points is among the 3 nearest. k-NN only lets the $k$ nearest points vote.`,
        },
        {
          text: 'No prediction: the vote is tied',
          value: 'tie',
          why: `A tie (one ${Y}, one ${X}) happens with only the 2 nearest neighbours. With $k = 3$ the third neighbour, ${byRank[2].name}, is ${X} and breaks the tie.`,
        },
      ],
      solution,
      keyIdea: 'k-NN: find the distance to every training point, keep the k nearest, and take a majority vote of their labels.',
    };
  }
}

// ---------------------------------------------------------------- k-means update
/** Coordinate text: terminating decimals as decimals, others as fractions. */
function coordTex(f: Frac): string {
  return [1, 2, 4, 5, 8, 10].includes(f.d) ? num(f.value()) : f.tex();
}
const ptTex = (p: [Frac, Frac]) => `\\left(${coordTex(p[0])}, ${coordTex(p[1])}\\right)`;
const ptVal = (p: [Frac, Frac]) => `${p[0].toString()},${p[1].toString()}`;

function meanOf(pts: Pt[]): [Frac, Frac] {
  return [new Frac(pts.reduce((a, p) => a + p[0], 0), pts.length), new Frac(pts.reduce((a, p) => a + p[1], 0), pts.length)];
}
function medianFrac(xs: number[]): Frac {
  const s = [...xs].sort((a, b) => a - b);
  const k = s.length;
  return k % 2 ? new Frac(s[(k - 1) / 2]) : new Frac(s[k / 2 - 1] + s[k / 2], 2);
}
const sumTex = (xs: number[]) => [...xs].sort((a, b) => a - b).join(' + ');
/** Reduced fraction, followed by "= 3.5" when the answer shows that coordinate as a decimal. */
const meanTex = (f: Frac): string => (f.tex() === coordTex(f) ? f.tex() : `${f.tex()} = ${coordTex(f)}`);

function kmeansUpdate(rng: Rng) {
  for (;;) {
    const mu: Pt[] = [
      [rng.int(1, 4), rng.int(1, 4)],
      [rng.int(5, 9), rng.int(5, 9)],
    ];
    const n = rng.int(5, 7);
    const pts: Pt[] = [];
    let guard = 0;
    while (pts.length < n && guard++ < 200) {
      const p: Pt = [rng.int(1, 9), rng.int(1, 9)];
      if (pts.some((o) => o[0] === p[0] && o[1] === p[1])) continue;
      if (mu.some((c) => c[0] === p[0] && c[1] === p[1])) continue;
      pts.push(p);
    }
    if (pts.length < n) continue;
    const d = pts.map((p) => [sqDist(p, mu[0]), sqDist(p, mu[1])]);
    if (d.some(([a, b]) => a === b)) continue;
    const cl = d.map(([a, b]) => (a < b ? 0 : 1));
    const groups: Pt[][] = [pts.filter((_, i) => cl[i] === 0), pts.filter((_, i) => cl[i] === 1)];
    if (groups[0].length < 2 || groups[1].length < 2) continue;
    const t = rng.int(0, 1);
    const g = groups[t];
    const ans = meanOf(g);
    const xs = g.map((p) => p[0]);
    const ys = g.map((p) => p[1]);

    // closest call: smallest |d1 - d2|
    let border = 0;
    pts.forEach((_, i) => {
      if (Math.abs(d[i][0] - d[i][1]) < Math.abs(d[border][0] - d[border][1])) border = i;
    });
    const bName = NAMES[border];
    const bInT = cl[border] === t;
    const flipped = bInT ? g.filter((p) => p !== pts[border]) : [...g, pts[border]];

    type Cand = { p: [Frac, Frac]; why: string };
    const pool: Cand[] = [];
    if (flipped.length > 0)
      pool.push({
        p: meanOf(flipped),
        why: `This ${bInT ? 'leaves out' : 'includes'} point ${bName}, the point nearest the boundary between the two clusters (the closest call). Its squared distances are ${d[border][0]} to $\\mu_1$ and ${d[border][1]} to $\\mu_2$, so it belongs to $\\mu_${cl[border] + 1}$.`,
      });
    pool.push({
      p: [new Frac(xs.reduce((a, b) => a + b, 0) + mu[t][0], g.length + 1), new Frac(ys.reduce((a, b) => a + b, 0) + mu[t][1], g.length + 1)],
      why: `This includes the old centroid $(${mu[t][0]}, ${mu[t][1]})$ in the average as if it were a data point. The new centroid is the mean of the ${g.length} assigned points only.`,
    });
    pool.push({
      p: [medianFrac(xs), medianFrac(ys)],
      why: 'This takes the **median** of each coordinate. k-means moves the centroid to the **mean** of its points.',
    });
    pool.push({
      p: meanOf(groups[1 - t]),
      why: `This is the new position of the **other** centroid, $\\mu_${2 - t}$, not $\\mu_${t + 1}$.`,
    });
    pool.push({
      p: [new Frac(Math.min(...xs) + Math.max(...xs), 2), new Frac(Math.min(...ys) + Math.max(...ys), 2)],
      why: 'This is the midpoint of the smallest and largest coordinates, which ignores the points in between. The centroid averages **all** the assigned points.',
    });
    pool.push({
      p: [new Frac(xs.reduce((a, b) => a + b, 0)), new Frac(ys.reduce((a, b) => a + b, 0))],
      why: `This adds the coordinates but forgets to divide by the number of points, ${g.length}.`,
    });

    const chosen: Cand[] = [];
    for (const c of pool) {
      if (chosen.length === 3) break;
      const v = ptVal(c.p);
      const tx = ptTex(c.p);
      if (v === ptVal(ans) || tx === ptTex(ans)) continue;
      if (chosen.some((o) => ptVal(o.p) === v || ptTex(o.p) === tx)) continue;
      chosen.push(c);
    }
    if (chosen.length < 3) continue;

    const answer = m(`\\mu_${t + 1} = ${ptTex(ans)}`);
    const rows = pts
      .map((p, i) => `| ${NAMES[i]} $(${p[0]}, ${p[1]})$ | ${m(sqWorking(p, mu[0]))} | ${m(sqWorking(p, mu[1]))} | $\\mu_${cl[i] + 1}$ |`)
      .join('\n');
    const members = pts.map((_, i) => i).filter((i) => cl[i] === t).map((i) => NAMES[i]);
    const solution =
      '**Assignment step.** Give each point to the nearer centroid (compare squared distances).\n\n' +
      `| Point | $d^2$ to $\\mu_1 = (${mu[0][0]}, ${mu[0][1]})$ | $d^2$ to $\\mu_2 = (${mu[1][0]}, ${mu[1][1]})$ | nearest |\n|---|---|---|---|\n` +
      rows +
      '\n\n' +
      `So $\\mu_${t + 1}$ gets ${members.length} points: ${members.join(', ')}.\n\n` +
      `**Update step.** Move $\\mu_${t + 1}$ to the mean of its points:\n\n` +
      `$$\\bar{x} = \\frac{${sumTex(xs)}}{${g.length}} = ${meanTex(ans[0])}, \\qquad \\bar{y} = \\frac{${sumTex(ys)}}{${g.length}} = ${meanTex(ans[1])}$$\n\n` +
      `Answer: ${answer}`;

    return {
      stem:
        `k-means with $k = 2$ is run on the points in the table. The current centroids are $\\mu_1 = (${mu[0][0]}, ${mu[0][1]})$ and $\\mu_2 = (${mu[1][0]}, ${mu[1][1]})$. ` +
        `After one assignment step (Euclidean distance) and one update step, where is $\\mu_${t + 1}$?`,
      table: {
        headers: ['Point', '$x$', '$y$'],
        rows: pts.map((p, i) => [NAMES[i], p[0], p[1]] as (string | number)[]),
      },
      answer,
      answerValue: ptVal(ans),
      distractors: chosen.map((c) => ({ text: m(`\\mu_${t + 1} = ${ptTex(c.p)}`), value: ptVal(c.p), why: c.why })),
      solution,
      keyIdea: 'k-means: assign each point to its nearest centroid, then move each centroid to the mean of the points assigned to it.',
    };
  }
}

// ---------------------------------------------------------------- split impurity (Gini or entropy)
const SPLIT_CTX: { yes: string; no: string; intro: string }[] = [
  { yes: 'Yes', no: 'No', intro: 'A decision-tree node holds training examples labelled "Yes" or "No".' },
  { yes: 'Spam', no: 'Not spam', intro: 'A decision tree for a spam filter has a node holding emails labelled "Spam" or "Not spam".' },
  { yes: 'Pass', no: 'Fail', intro: 'A decision tree that predicts exam results has a node holding students labelled "Pass" or "Fail".' },
  { yes: 'Buy', no: 'No buy', intro: 'A decision tree for an online shop has a node holding customers labelled "Buy" or "No buy".' },
];

const giniF = (y: number, n: number): Frac => {
  const t = y + n;
  return new Frac(1).sub(new Frac(y * y + n * n, t * t));
};
const H = (counts: number[], log: (x: number) => number = Math.log2): number => {
  const t = counts.reduce((a, b) => a + b, 0);
  return -counts.reduce((acc, c) => (c === 0 ? acc : acc + (c / t) * log(c / t)), 0);
};
/** " = 0.375" when the fraction is an exact short decimal, " \approx 0.4688" otherwise, "" for integers. */
const decTex = (f: Frac): string => {
  if (f.isInt()) return '';
  const s = num(f.value(), 4);
  return Math.abs(Number(s) - f.value()) < 1e-12 ? ` = ${s}` : ` \\approx ${s}`;
};
const r3 = (x: number) => (Math.round(x * 1000 + 1e-9) / 1000).toFixed(3);
const nearBoundary = (x: number) => Math.abs(((x * 1000) % 1) - 0.5) < 0.02;
/** Options must be clearly different: at least 0.02 apart once rounded to 3 d.p. */
const MIN_GAP = 0.02;
const tooClose = (v: number, others: number[]) => others.some((o) => Math.abs(Number(r3(v)) - Number(r3(o))) < MIN_GAP);

function giniWorking(label: string, y: number, n: number, ctx: { yes: string; no: string }): string {
  const t = y + n;
  const G = giniF(y, n);
  if (y === 0 || n === 0) return `- ${label} (${y} ${ctx.yes}, ${n} ${ctx.no}) is pure, so $G_{${label[0]}} = 0$.`;
  const py = new Frac(y, t);
  const pn = new Frac(n, t);
  return (
    `- ${label} (${y} ${ctx.yes}, ${n} ${ctx.no}): ` +
    m(`G_{${label[0]}} = 1 - \\left(${py.tex()}\\right)^2 - \\left(${pn.tex()}\\right)^2 = ${G.tex()}${decTex(G)}`)
  );
}

function entropyWorking(label: string, sub: string, y: number, n: number, ctx: { yes: string; no: string }): string {
  const t = y + n;
  const h = H([y, n]);
  if (y === 0 || n === 0) return `- ${label} (${y} ${ctx.yes}, ${n} ${ctx.no}) is pure, so $H_{${sub}} = 0$ (we take $0 \\log_2 0 = 0$).`;
  const py = new Frac(y, t).tex();
  const pn = new Frac(n, t).tex();
  return (
    `- ${label} (${y} ${ctx.yes}, ${n} ${ctx.no}): ` +
    m(`H_{${sub}} = -${py}\\log_2 ${py} - ${pn}\\log_2 ${pn} ${y === n ? '=' : '\\approx'} ${num(h, 4)}`)
  );
}

function splitImpurity(rng: Rng) {
  const ctx = rng.pick(SPLIT_CTX);
  const mode = rng.pick(['gini', 'entropy'] as const);
  for (;;) {
    const a = rng.int(0, 6);
    const b = rng.int(0, 6);
    const c = rng.int(0, 6);
    const d = rng.int(0, 6);
    const nL = a + b;
    const nR = c + d;
    if (nL < 2 || nR < 2) continue;
    const N = nL + nR;
    const Y = a + c;
    const No = b + d;
    if (Y === 0 || No === 0) continue;
    // child proportions must differ (otherwise the split does nothing)
    if (a * nR === c * nL) continue;
    const table = {
      headers: ['Child node', ctx.yes, ctx.no, 'Total'],
      rows: [
        ['Left', a, b, nL],
        ['Right', c, d, nR],
      ] as (string | number)[][],
    };
    const wL = new Frac(nL, N);
    const wR = new Frac(nR, N);

    if (mode === 'gini') {
      const GL = giniF(a, b);
      const GR = giniF(c, d);
      const GP = giniF(Y, No);
      const W = wL.mul(GL).add(wR.mul(GR));
      if (nearBoundary(W.value())) continue;
      // the split must do something useful, otherwise answer, parent Gini and averages bunch together
      if (GP.sub(W).value() < 0.03) continue;
      const ans = r3(W.value());
      const pool: { v: number; why: string }[] = [
        { v: GL.add(GR).div(2).value(), why: `This is the plain average of the two child Ginis, ${m(`\\frac{${[GL.value(), GR.value()].sort((x, y) => x - y).map((v) => num(v, 4)).join(' + ')}}{2}`)}. Each child must be weighted by its size (${nL} and ${nR} out of ${N}).` },
        { v: GP.value(), why: `This is the Gini impurity of the **parent** node (${Y} ${ctx.yes}, ${No} ${ctx.no}) before the split.` },
        { v: GP.sub(W).value(), why: 'This is the Gini **gain** (parent Gini minus the weighted Gini). The question asks for the weighted Gini of the split itself.' },
        { v: new Frac(1).sub(W).value(), why: 'This is the weighted sum of the squared proportions: the "1 minus" in $G = 1 - \\sum p_i^2$ was forgotten for each child.' },
        { v: GL.add(GR).value(), why: 'This adds the two child Ginis without any weights.' },
      ];
      const chosen: { v: number; why: string }[] = [];
      for (const p of pool) {
        if (chosen.length === 3) break;
        if (nearBoundary(p.v)) continue;
        if (tooClose(p.v, [W.value(), ...chosen.map((o) => o.v)])) continue;
        chosen.push(p);
      }
      if (chosen.length < 3) continue;
      const answer = m(ans);
      return {
        stem: `${ctx.intro} It contains ${Y} "${ctx.yes}" and ${No} "${ctx.no}" examples. A split sends them into two child nodes as shown in the table. What is the **weighted Gini impurity** of the split, to 3 decimal places?`,
        table,
        answer,
        answerValue: Number(ans),
        distractors: chosen.map((p) => ({ text: m(r3(p.v)), value: Number(r3(p.v)), why: p.why })),
        solution:
          '**Step 1: Gini of each child**, $G = 1 - \\sum p_i^2$.\n\n' +
          giniWorking('Left', a, b, ctx) +
          '\n' +
          giniWorking('Right', c, d, ctx) +
          '\n\n' +
          `**Step 2: weight each child by its share of the ${N} examples.**\n\n` +
          `$$G_{\\text{split}} = ${wL.tex()} \\times ${GL.tex()} + ${wR.tex()} \\times ${GR.tex()} = ${W.tex()}${decTex(W)}$$\n\n` +
          `Answer: ${answer}`,
        keyIdea: 'The impurity of a split is the size-weighted average of the child impurities: lower is better.',
      };
    }

    // entropy / information gain
    const HL = H([a, b]);
    const HR = H([c, d]);
    const HP = H([Y, No]);
    const Wt = (nL / N) * HL + (nR / N) * HR;
    const IG = HP - Wt;
    if (IG < 0.08 || nearBoundary(IG)) continue;
    const ans = r3(IG);
    const ln = Math.log;
    const IGln = H([Y, No], ln) - (nL / N) * H([a, b], ln) - (nR / N) * H([c, d], ln);
    const GG = giniF(Y, No).sub(wL.mul(giniF(a, b)).add(wR.mul(giniF(c, d)))).value();
    const pool: { v: number; why: string }[] = [
      { v: Wt, why: `This is the weighted child entropy, about ${num(Wt, 3)}. It still has to be subtracted from the parent entropy (about ${num(HP, 3)}).` },
      { v: HP - (HL + HR) / 2, why: `This averages the child entropies **without weights**. The children hold ${nL} and ${nR} of the ${N} examples, so they must be weighted ${m(wL.tex())} and ${m(wR.tex())}.` },
      { v: IGln, why: 'This uses the natural log $\\ln$ instead of $\\log_2$. Entropy in bits needs base 2 (on a calculator, $\\log_2 x = \\frac{\\ln x}{\\ln 2}$).' },
      { v: HP, why: 'This is just the parent entropy; the entropy left after the split was never subtracted.' },
      { v: GG, why: 'This is the **Gini** gain (using $1 - \\sum p_i^2$), not the information gain based on entropy.' },
    ];
    const chosen: { v: number; why: string }[] = [];
    for (const p of pool) {
      if (chosen.length === 3) break;
      if (p.v < 0 || nearBoundary(p.v)) continue;
      if (tooClose(p.v, [IG, ...chosen.map((o) => o.v)])) continue;
      chosen.push(p);
    }
    if (chosen.length < 3) continue;
    const answer = m(ans);
    return {
      stem: `${ctx.intro} It contains ${Y} "${ctx.yes}" and ${No} "${ctx.no}" examples. A split sends them into two child nodes as shown in the table. What is the **information gain** of the split, using entropy with $\\log_2$, to 3 decimal places?`,
      table,
      answer,
      answerValue: Number(ans),
      distractors: chosen.map((p) => ({ text: m(r3(p.v)), value: Number(r3(p.v)), why: p.why })),
      solution:
        'Information gain = parent entropy minus the weighted average of the child entropies, with $H = -\\sum p_i \\log_2 p_i$.\n\n' +
        entropyWorking('Parent', '\\text{parent}', Y, No, ctx) +
        '\n' +
        entropyWorking('Left', 'L', a, b, ctx) +
        '\n' +
        entropyWorking('Right', 'R', c, d, ctx) +
        '\n\n' +
        `Weighted child entropy: ${m(`${wL.tex()} \\times ${num(HL, 4)} + ${wR.tex()} \\times ${num(HR, 4)} \\approx ${num(Wt, 4)}`)}.\n\n` +
        (Wt === 0
          ? `Both children are pure, so nothing is subtracted and the information gain equals the parent entropy, ${m(`\\approx ${num(IG, 4)}`)}`
          : `Information gain: ${m(`${num(HP, 4)} - ${num(Wt, 4)} \\approx ${num(IG, 4)}`)} (using unrounded values)`) +
        `, which is ${answer} to 3 decimal places.\n\n` +
        `Answer: ${answer}`,
      keyIdea: 'Information gain = H(parent) minus the size-weighted average of H(children); the best split has the largest gain.',
    };
  }
}

export const generators: Generator[] = [
  {
    id: 'gen-classic-algorithms-knn-vote',
    subtopic: 'classic-algorithms',
    difficulty: 'exam',
    title: 'Classify a point with 3-nearest neighbours',
    generate: knnVote,
  },
  {
    id: 'gen-classic-algorithms-kmeans-update',
    subtopic: 'classic-algorithms',
    difficulty: 'exam',
    title: 'One k-means iteration: where does the centroid move?',
    generate: kmeansUpdate,
  },
  {
    id: 'gen-classic-algorithms-split-impurity',
    subtopic: 'classic-algorithms',
    difficulty: 'challenge',
    title: 'Weighted Gini or information gain of a decision-tree split',
    generate: splitImpurity,
  },
];
