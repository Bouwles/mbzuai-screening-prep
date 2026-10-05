import type { Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { m } from '../../../lib/tex';

type Cand = { v: number; text: string; why: string };

/** Keep up to 3 candidates that differ from the answer and from each other (by value and by text). */
function pickDistinct(answer: number, answerText: string, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (!Number.isFinite(c.v) || c.v < 0) continue;
    if (c.v === answer || c.text === answerText) continue;
    if (out.some((x) => x.v === c.v || x.text === c.text)) continue;
    out.push(c);
  }
  return out;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

/** Random simple undirected graph on n vertices as an adjacency matrix (no isolated vertices). */
function randomGraph(rng: Rng, n: number, p: number): number[][] {
  for (;;) {
    const M = Array.from({ length: n }, () => Array(n).fill(0) as number[]);
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++)
        if (rng.next() < p) {
          M[i][j] = 1;
          M[j][i] = 1;
        }
    if (M.every((row) => row.some((x) => x === 1))) return M;
  }
}

const rowSum = (r: number[]) => r.reduce((a, b) => a + b, 0);

// ---------------------------------------------------------------- shortest path helpers
type WEdge = [number, number, number]; // u, v, weight

/** All simple paths from s to t, each as a list of vertex indices. */
function simplePaths(n: number, edges: WEdge[], s: number, t: number): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const out: number[][] = [];
  const walk = (path: number[]) => {
    const last = path[path.length - 1];
    if (last === t) {
      out.push(path);
      return;
    }
    for (const nb of [...adj[last]].sort((a, b) => a - b)) if (!path.includes(nb)) walk([...path, nb]);
  };
  walk([s]);
  return out;
}

function weightOf(edges: WEdge[], u: number, v: number): number {
  const e = edges.find(([a, b]) => (a === u && b === v) || (a === v && b === u));
  if (!e) throw new Error('no such edge');
  return e[2];
}

const pathLen = (edges: WEdge[], p: number[]) => {
  let s = 0;
  for (let i = 0; i + 1 < p.length; i++) s += weightOf(edges, p[i], p[i + 1]);
  return s;
};
const pathName = (p: number[]) => p.map((i) => LETTERS[i]).join('–');
const pathSum = (edges: WEdge[], p: number[]) => {
  const parts: number[] = [];
  for (let i = 0; i + 1 < p.length; i++) parts.push(weightOf(edges, p[i], p[i + 1]));
  return parts.length === 1 ? `${parts[0]}` : `${parts.join(' + ')} = ${pathLen(edges, p)}`;
};

/** Network shapes (edge lists without weights), start at vertex 0, finish at the last vertex. */
const SHAPES: { n: number; edges: [number, number][] }[] = [
  // A..E
  { n: 5, edges: [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [2, 4], [3, 4]] },
  { n: 5, edges: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 4], [2, 3], [3, 4]] },
  { n: 5, edges: [[0, 1], [0, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 2]] },
  // A..F
  { n: 6, edges: [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4], [3, 5], [4, 5]] },
  { n: 6, edges: [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 5], [1, 2]] },
];

export const generators: Generator[] = [
  // ---------------------------------------------------------------- handshake lemma
  {
    id: 'gen-graph-theory-handshake',
    subtopic: 'graph-theory',
    difficulty: 'foundation',
    title: 'Handshake lemma: count the edges from the degrees',
    generate(rng) {
      for (;;) {
        if (rng.bool(0.5)) {
          // ---- degree list of a random graph
          const V = rng.int(5, 7);
          const M = randomGraph(rng, V, rng.pick([0.4, 0.5, 0.6]));
          const degs = rng.shuffle(M.map(rowSum));
          const S = degs.reduce((a, b) => a + b, 0);
          const E = S / 2;
          const answer = m(`${E}`);
          const pool: Cand[] = [
            { v: S, text: m(`${S}`), why: `This is the **sum** of the degrees. Every edge has two ends, so it is counted twice in that sum: divide by 2.` },
            { v: 2 * S, text: m(`${2 * S}`), why: `This multiplies the degree sum by 2 instead of dividing. The rule is sum of degrees ${m('= 2E')}, so ${m(`E = ${S} \\div 2`)}.` },
            { v: V, text: m(`${V}`), why: `This is the number of **vertices** (the number of degrees listed), not the number of edges.` },
            { v: V - 1, text: m(`${V - 1}`), why: `This uses the tree rule ${m('E = V - 1')}, but nothing says the graph is a tree. Use the degrees: ${m(`E = \\frac{${S}}{2}`)}.` },
          ];
          const ds = pickDistinct(E, answer, pool);
          if (ds.length < 3) continue;
          const list = degs.join(', ');
          return {
            stem: `A simple graph has ${V} vertices with degrees ${m(list)}. How many **edges** does the graph have?`,
            answer,
            answerValue: E,
            distractors: ds.map((d) => ({ text: d.text, value: d.v, why: d.why })),
            solution:
              `Use the **handshake lemma**: each edge has two ends and adds 1 to the degree of each end, so\n\n` +
              `$$\\text{sum of degrees} = 2E$$\n\n` +
              `Sum of degrees: ${m(`${degs.join(' + ')} = ${S}`)}.\n\n` +
              `Number of edges: ${m(`E = \\frac{${S}}{2} = ${E}`)}.\n\n` +
              `Answer: ${answer}`,
            keyIdea: 'Handshake lemma: the degrees add up to twice the number of edges, so halve the degree sum.',
          };
        }
        // ---- regular graph: n vertices, every vertex of degree d
        const n = rng.int(5, 14);
        const d = rng.int(2, Math.min(n - 1, 8));
        if ((n * d) % 2 !== 0) continue;
        const E = (n * d) / 2;
        const ctx = rng.pick([
          {
            text: `At a meeting of ${n} people, each person shakes hands with exactly ${d} of the others (nobody shakes the same person's hand twice). How many handshakes take place in total?`,
            v: 'people',
            e: 'handshakes',
          },
          {
            text: `A network has ${n} computers. Each computer is connected by a cable directly to exactly ${d} other computers (at most one cable between any two). How many cables are there?`,
            v: 'computers',
            e: 'cables',
          },
          {
            text: `A simple graph has ${n} vertices and every vertex has degree ${d}. How many edges does the graph have?`,
            v: 'vertices',
            e: 'edges',
          },
        ]);
        const answer = m(`${E}`);
        const complete = (n * (n - 1)) / 2;
        const pool: Cand[] = [
          { v: n * d, text: m(`${n * d}`), why: `This is ${m(`${n} \\times ${d}`)}, the sum of the degrees. Each of the ${ctx.e} is counted twice in it (once from each end), so halve it.` },
          { v: complete, text: m(`${complete}`), why: `This is ${m(`\\frac{${n} \\times ${n - 1}}{2}`)}, which assumes **everyone** is joined to everyone else (a complete graph). Each one is joined to only ${d} others.` },
          { v: 2 * n * d, text: m(`${2 * n * d}`), why: `This doubles ${m(`${n} \\times ${d}`)} instead of halving it. The sum of the degrees is ${m('2E')}, so ${m('E')} is half of it.` },
          { v: n, text: m(`${n}`), why: `This is the number of ${ctx.v}, not the number of ${ctx.e}.` },
        ];
        const ds = pickDistinct(E, answer, pool);
        if (ds.length < 3) continue;
        return {
          stem: ctx.text,
          answer,
          answerValue: E,
          distractors: ds.map((x) => ({ text: x.text, value: x.v, why: x.why })),
          solution:
            (ctx.v === 'vertices'
              ? `Every one of the ${n} vertices has degree ${d}.\n\n`
              : `Model it as a graph: the ${ctx.v} are vertices and the ${ctx.e} are edges. Every vertex has degree ${d}.\n\n`) +
            `Sum of the degrees: ${m(`${n} \\times ${d} = ${n * d}`)}.\n\n` +
            `Each edge has two ends, so it is counted twice in this sum (handshake lemma: sum of degrees ${m('= 2E')}):\n\n` +
            `$$E = \\frac{${n * d}}{2} = ${E}$$\n\n` +
            `Answer: ${answer}`,
          keyIdea: 'Handshake lemma: add up the degrees and halve, because every edge has two ends.',
        };
      }
    },
  },

  // ---------------------------------------------------------------- adjacency matrix
  {
    id: 'gen-graph-theory-adjacency-matrix',
    subtopic: 'graph-theory',
    difficulty: 'exam',
    title: 'Read an adjacency matrix: edges, degree, walks of length 2',
    generate(rng) {
      for (;;) {
        const n = 5;
        const M = randomGraph(rng, n, rng.pick([0.4, 0.5, 0.6]));
        const names = LETTERS.slice(0, n);
        const degs = M.map(rowSum);
        const S = degs.reduce((a, b) => a + b, 0);
        const E = S / 2;
        const table = {
          headers: ['', ...names],
          rows: M.map((r, i) => [names[i], ...r] as (string | number)[]),
        };
        const intro =
          'The table shows the adjacency matrix $M$ of an undirected simple graph: 1 means the two vertices are joined by an edge, 0 means they are not.';
        const mode = rng.pick(['edges', 'degree', 'walks'] as const);
        const edgeList: string[] = [];
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (M[i][j]) edgeList.push(`${names[i]}–${names[j]}`);

        if (mode === 'edges') {
          const answer = m(`${E}`);
          const non = (n * (n - 1) - S) / 2;
          const pool: Cand[] = [
            { v: S, text: m(`${S}`), why: `This is the number of 1s in the matrix. Each edge appears twice (row X column Y **and** row Y column X), so halve it.` },
            { v: non, text: m(`${non}`), why: `This counts the pairs marked 0 (the pairs that are **not** joined) instead of the pairs marked 1.` },
            { v: degs[0], text: m(`${degs[0]}`), why: `This is the sum of row A only, which is the degree of A, not the number of edges in the whole graph.` },
            { v: n, text: m(`${n}`), why: `This is the number of vertices (rows), not the number of edges.` },
          ];
          const ds = pickDistinct(E, answer, pool);
          if (ds.length < 3) continue;
          return {
            stem: `${intro} How many **edges** does the graph have?`,
            table,
            answer,
            answerValue: E,
            distractors: ds.map((x) => ({ text: x.text, value: x.v, why: x.why })),
            solution:
              `Each row sum is the degree of that vertex: ${names.map((x, i) => `${x}: ${degs[i]}`).join(', ')}.\n\n` +
              `Total of all entries ${m(`= ${degs.join(' + ')} = ${S}`)}. This is the sum of the degrees, which equals ${m('2E')} because every edge appears twice in a symmetric matrix.\n\n` +
              `$$E = \\frac{${S}}{2} = ${E}$$\n\n` +
              `Check by listing the 1s above the diagonal: ${edgeList.join(', ')} (${edgeList.length} edges).\n\n` +
              `Answer: ${answer}`,
            keyIdea: 'In an undirected adjacency matrix, the 1s add up to twice the number of edges.',
          };
        }

        if (mode === 'degree') {
          const x = rng.int(0, n - 1);
          const d = degs[x];
          const answer = m(`${d}`);
          const pool: Cand[] = [
            { v: 2 * d, text: m(`${2 * d}`), why: `This adds row ${names[x]} **and** column ${names[x]}. In an undirected graph they hold the same edges, so the degree is just the row sum.` },
            { v: n - 1 - d, text: m(`${n - 1 - d}`), why: `This counts the 0s in row ${names[x]} (leaving out the diagonal): the vertices ${names[x]} is **not** joined to.` },
            { v: E, text: m(`${E}`), why: `This is the total number of edges in the graph (half of all the 1s), not just those at ${names[x]}.` },
            { v: n - d, text: m(`${n - d}`), why: `This counts every 0 in row ${names[x]}, including the diagonal. The degree counts the 1s.` },
          ];
          const ds = pickDistinct(d, answer, pool);
          if (ds.length < 3) continue;
          const nbrs = names.filter((_, j) => M[x][j] === 1);
          return {
            stem: `${intro} What is the **degree** of vertex ${names[x]}?`,
            table,
            answer,
            answerValue: d,
            distractors: ds.map((c) => ({ text: c.text, value: c.v, why: c.why })),
            solution:
              `The degree of a vertex is the number of edges at it, which is the number of 1s in its row.\n\n` +
              `Row ${names[x]} is ${m(M[x].join(',\\ '))}. The 1s are in ${nbrs.length === 1 ? 'column' : 'columns'} ${nbrs.join(', ')}, so ${names[x]} is joined to ${nbrs.length === 1 ? 'one vertex' : `${nbrs.length} vertices`}.\n\n` +
              `$$\\deg(${names[x]}) = ${d === 1 ? '1' : `${Array(d).fill(1).join(' + ')} = ${d}`}$$\n\n` +
              `Answer: ${answer}`,
            keyIdea: 'The degree of a vertex is the sum of its row in the adjacency matrix.',
          };
        }

        // walks of length 2 between two different vertices
        const [x, y] = rng.sample([0, 1, 2, 3, 4], 2).sort((a, b) => a - b);
        const mids = names.filter((_, k) => M[x][k] === 1 && M[k][y] === 1);
        const c = mids.length;
        if (c < 1) continue;
        const answer = m(`${c}`);
        const pool: Cand[] = [
          { v: 2 * c, text: m(`${2 * c}`), why: `This counts the walks from ${names[x]} to ${names[y]} **and** the walks back from ${names[y]} to ${names[x]}. A walk from ${names[x]} to ${names[y]} has a fixed start and end, so each common neighbour Z gives just one walk ${names[x]}–Z–${names[y]}.` },
          { v: M[x][y], text: m(`${M[x][y]}`), why: `This is the entry of ${m('M')} itself, which counts walks of length **1** (a direct edge ${names[x]}–${names[y]}). Walks of length 2 are counted by ${m('M^2')}.` },
          { v: degs[x], text: m(`${degs[x]}`), why: `This is the degree of ${names[x]} (all the first steps you could take), without checking that the second step reaches ${names[y]}.` },
          { v: degs[y], text: m(`${degs[y]}`), why: `This is the degree of ${names[y]} (all the last steps that could arrive at ${names[y]}), without checking that the first step starts from ${names[x]}.` },
          { v: degs[x] * degs[y], text: m(`${degs[x] * degs[y]}`), why: `This multiplies the two degrees. A walk only exists through a vertex that is a neighbour of **both** ${names[x]} and ${names[y]}.` },
        ];
        const ds = pickDistinct(c, answer, pool);
        if (ds.length < 3) continue;
        const checkRows = names
          .map((z, k) => ({ z, k }))
          .filter(({ k }) => k !== x && k !== y)
          .map(({ z, k }) => `| ${z} | ${M[x][k] ? 'yes' : 'no'} | ${M[k][y] ? 'yes' : 'no'} | ${M[x][k] && M[k][y] ? '**yes**' : 'no'} |`)
          .join('\n');
        return {
          stem: `${intro} The entry in row $i$, column $j$ of $M^2$ counts the walks of length 2 from vertex $i$ to vertex $j$. How many walks of length 2 are there from ${names[x]} to ${names[y]}?`,
          table,
          answer,
          answerValue: c,
          distractors: ds.map((q) => ({ text: q.text, value: q.v, why: q.why })),
          solution:
            `A walk of length 2 is ${names[x]}–Z–${names[y]}, where the middle vertex Z must be joined to **both** ${names[x]} and ${names[y]}.\n\n` +
            `Neighbours of ${names[x]} (1s in row ${names[x]}): ${names.filter((_, k) => M[x][k] === 1).join(', ')}.\n\n` +
            `Neighbours of ${names[y]} (1s in row ${names[y]}): ${names.filter((_, k) => M[y][k] === 1).join(', ')}.\n\n` +
            `Common neighbours: ${mids.join(', ')}, giving the walks ${mids.map((z) => `${names[x]}–${z}–${names[y]}`).join(', ')}.\n\n` +
            `Checking every possible middle vertex:\n\n| Middle vertex Z | edge ${names[x]}–Z? | edge Z–${names[y]}? | walk? |\n|---|---|---|---|\n${checkRows}\n\n` +
            `So ${m(`(M^2)_{${names[x]}${names[y]}} = ${c}`)}: multiplying row ${names[x]} by column ${names[y]} adds 1 exactly for each common neighbour.\n\n` +
            `Answer: ${answer}`,
          keyIdea: 'The number of walks of length 2 from X to Y is the number of common neighbours, which is the entry of $M^2$.',
        };
      }
    },
  },

  // ---------------------------------------------------------------- shortest path by inspection
  {
    id: 'gen-graph-theory-shortest-path',
    subtopic: 'graph-theory',
    difficulty: 'exam',
    title: 'Shortest route in a weighted network',
    generate(rng) {
      for (;;) {
        const shape = rng.pick(SHAPES);
        const t = shape.n - 1;
        const edges: WEdge[] = shape.edges.map(([u, v]) => [u, v, rng.int(1, 12)]);
        const paths = simplePaths(shape.n, edges, 0, t).map((p) => ({ p, len: pathLen(edges, p) }));
        paths.sort((a, b) => a.len - b.len || a.p.length - b.p.length);
        const best = paths[0];
        if (paths.length > 1 && paths[1].len === best.len) continue; // need a unique shortest route
        // fewest roads (and cheapest among those)
        const minHops = Math.min(...paths.map((q) => q.p.length));
        const hopRoutes = paths.filter((q) => q.p.length === minHops);
        const hopRoute = hopRoutes[0];
        const roads = minHops - 1;
        const hopDesc =
          hopRoutes.length === 1
            ? `the route with the **fewest roads** (${roads})`
            : `the shortest of the routes with the **fewest roads** (${roads})`;
        if (hopRoute.len === best.len) continue; // the interesting case: more roads, shorter route
        // greedy "always take the shortest next road"
        let cur = 0;
        const gPath = [0];
        let gLen = 0;
        while (cur !== t) {
          const opts = edges
            .filter(([u, v]) => (u === cur && !gPath.includes(v)) || (v === cur && !gPath.includes(u)))
            .map(([u, v, w]) => ({ to: u === cur ? v : u, w }))
            .sort((a, b) => a.w - b.w || a.to - b.to);
          if (!opts.length || (opts.length > 1 && opts[0].w === opts[1].w)) {
            gLen = -1;
            break;
          }
          cur = opts[0].to;
          gPath.push(cur);
          gLen += opts[0].w;
        }
        const answer = `${m(`${best.len}`)} km`;
        const pool: Cand[] = [
          {
            v: hopRoute.len,
            text: `${m(`${hopRoute.len}`)} km`,
            why: `This is the route ${pathName(hopRoute.p)}, ${hopDesc}. Shortest means the smallest total length, and ${pathName(best.p)} is shorter even though it uses more roads.`,
          },
          ...(gLen > 0
            ? [
                {
                  v: gLen,
                  text: `${m(`${gLen}`)} km`,
                  why: `This is the route ${pathName(gPath)}, found by always taking the shortest next road. Grabbing the cheapest road at each step does not guarantee the shortest total.`,
                },
              ]
            : []),
          ...paths.slice(1).map((q) => ({
            v: q.len,
            text: `${m(`${q.len}`)} km`,
            why: `This is the length of the route ${pathName(q.p)}, but ${pathName(best.p)} is shorter (${best.len} km). Check every sensible route before choosing.`,
          })),
        ];
        const ds = pickDistinct(best.len, answer, pool);
        if (ds.length < 3) continue;
        const end = LETTERS[t];
        const tableRows = edges.map(([u, v, w]) => [`${LETTERS[u]}–${LETTERS[v]}`, w] as (string | number)[]);
        const shown = paths.slice(0, 8);
        return {
          stem: `The table lists the roads in a small network and their lengths in km. Every road can be used in both directions. What is the length of the **shortest route** from A to ${end}?`,
          table: { headers: ['Road', 'Length (km)'], rows: tableRows },
          answer,
          answerValue: best.len,
          distractors: ds.map((q) => ({ text: q.text, value: q.v, why: q.why })),
          solution:
            `List the routes from A to ${end} that never revisit a vertex, and add up the road lengths${paths.length > shown.length ? ' (the shortest few are shown; every other route is longer)' : ''}:\n\n` +
            `| Route | Total (km) |\n|---|---|\n` +
            shown.map((q) => `| ${pathName(q.p)} | ${m(pathSum(edges, q.p))} |`).join('\n') +
            `\n\nThe best route with the fewest roads (${roads}) is ${pathName(hopRoute.p)} at ${hopRoute.len} km, but a route with more roads can be shorter.\n\n` +
            `Shortest route: ${pathName(best.p)}.\n\nAnswer: ${answer}`,
          keyIdea: 'The shortest path has the smallest total weight, not the fewest edges; compare all sensible routes.',
        };
      }
    },
  },
];
