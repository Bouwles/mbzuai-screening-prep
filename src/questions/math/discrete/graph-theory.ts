import type { StaticQuestion } from '../../../types';
import { matMul, nCr, sumOf } from '../../../lib/mathx';

// ---------------------------------------------------------------- helpers used by the answer checks
type Edge = [string, string];

/** Degree of every vertex of an undirected graph given as an edge list. */
function degrees(edges: Edge[]): Map<string, number> {
  const d = new Map<string, number>();
  for (const [u, v] of edges) {
    d.set(u, (d.get(u) ?? 0) + 1);
    d.set(v, (d.get(v) ?? 0) + 1);
  }
  return d;
}

/** Havel-Hakimi: can this list be the degree sequence of a simple graph? */
function graphical(seq: number[]): boolean {
  let s = [...seq];
  for (;;) {
    s = s.filter((x) => x > 0).sort((a, b) => b - a);
    if (s.length === 0) return true;
    const k = s.shift()!;
    if (k > s.length) return false;
    for (let i = 0; i < k; i++) {
      s[i] -= 1;
      if (s[i] < 0) return false;
    }
  }
}

/** Shortest distance between two vertices of an undirected weighted graph (Dijkstra). */
function shortest(edges: [string, string, number][], from: string, to: string): number {
  const dist = new Map<string, number>();
  const done = new Set<string>();
  const verts = new Set(edges.flatMap(([u, v]) => [u, v]));
  verts.forEach((v) => dist.set(v, Infinity));
  dist.set(from, 0);
  while (done.size < verts.size) {
    let best = '';
    let bd = Infinity;
    verts.forEach((v) => {
      if (!done.has(v) && dist.get(v)! < bd) {
        bd = dist.get(v)!;
        best = v;
      }
    });
    if (best === '') break;
    done.add(best);
    for (const [u, v, w] of edges) {
      if (u === best && dist.get(v)! > bd + w) dist.set(v, bd + w);
      if (v === best && dist.get(u)! > bd + w) dist.set(u, bd + w);
    }
  }
  return dist.get(to)!;
}

const ADJ_4: number[][] = [
  [0, 1, 1, 0],
  [1, 0, 1, 1],
  [1, 1, 0, 1],
  [0, 1, 1, 0],
];

export const questions: StaticQuestion[] = [
  // ================================================================ foundation
  {
    id: 'graph-theory-001',
    subtopic: 'graph-theory',
    difficulty: 'foundation',
    stem:
      'A simple graph has vertices A, B, C, D, E and these 6 edges:\n\n' +
      'A–C, B–C, C–D, C–E, A–B, D–E\n\n' +
      'What is the **degree** of vertex C?',
    options: ['$2$', '$6$', '$4$', '$8$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The **degree** of a vertex is the number of edges that touch it (its number of "ends").\n\n' +
        'Go through the list and pick out every edge that has C at one end, whichever way round it is written:\n\n' +
        '- A–C: yes\n' +
        '- B–C: yes\n' +
        '- C–D: yes\n' +
        '- C–E: yes\n' +
        '- A–B: no\n' +
        '- D–E: no\n\n' +
        'Four edges touch C, so $\\deg(C) = 4$.',
      whyWrong: [
        'This counts only the edges written with C first (C–D and C–E). An edge is the same whichever way round it is written, so A–C and B–C touch C too.',
        'This is the total number of edges in the whole graph, not the number of edges that touch C.',
        null,
        'This doubles the degree. The "each edge counts twice" rule applies to the **sum of all the degrees**; each edge at C adds just 1 to the degree of C.',
      ],
      keyIdea: 'The degree of a vertex is the number of edges with that vertex at one end.',
    },
    check: {
      optionValues: [2, 6, 4, 8],
      compute: () =>
        degrees([
          ['A', 'C'],
          ['B', 'C'],
          ['C', 'D'],
          ['C', 'E'],
          ['A', 'B'],
          ['D', 'E'],
        ]).get('C')!,
    },
  },
  {
    id: 'graph-theory-002',
    subtopic: 'graph-theory',
    difficulty: 'foundation',
    stem: 'A simple graph has 5 vertices with degrees $3, 3, 2, 2, 4$. How many **edges** does the graph have?',
    options: ['$7$', '$14$', '$5$', '$28$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Use the **handshake lemma**: every edge has two ends, and each end adds 1 to the degree of a vertex. So\n\n' +
        '$$\\text{sum of degrees} = 2 \\times \\text{number of edges}$$\n\n' +
        'Sum of degrees: $3 + 3 + 2 + 2 + 4 = 14$.\n\n' +
        'Number of edges: $E = \\frac{14}{2} = 7$.',
      whyWrong: [
        null,
        'This is the sum of the degrees. Every edge is counted twice in that sum (once from each end), so you must halve it.',
        'This is the number of vertices, not the number of edges.',
        'This multiplies the degree sum by 2 instead of dividing: the rule is sum of degrees $= 2E$, so $E = 14 \\div 2$.',
      ],
      keyIdea: 'Handshake lemma: the degrees add up to twice the number of edges.',
    },
    check: { optionValues: [7, 14, 5, 28], compute: () => sumOf([3, 3, 2, 2, 4]) / 2 },
  },
  {
    id: 'graph-theory-003',
    subtopic: 'graph-theory',
    difficulty: 'foundation',
    stem: 'How many edges does the complete graph $K_6$ have? (In a complete graph, every pair of distinct vertices is joined by exactly one edge.)',
    options: ['$30$', '$36$', '$21$', '$15$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '$K_6$ has 6 vertices and every vertex is joined to each of the other 5.\n\n' +
        'Counting from every vertex gives $6 \\times 5 = 30$ edge-ends, but each edge has been counted **twice** (once from each end).\n\n' +
        '$$E = \\frac{n(n-1)}{2} = \\frac{6 \\times 5}{2} = 15$$\n\n' +
        'Check by choosing pairs: $\\binom{6}{2} = 15$.',
      whyWrong: [
        'This is $6 \\times 5 = 30$: it counts every edge from both of its ends, so each edge is counted twice. Divide by 2.',
        'This is $6^2 = 36$: it pairs every vertex with every vertex, including itself, and also counts each edge twice.',
        'This is $\\frac{6 \\times 7}{2} = 21$, which uses $n + 1$ instead of $n - 1$. Each vertex joins to the **other** 5 vertices, not 7.',
        null,
      ],
      keyIdea: 'The complete graph $K_n$ has $\\frac{n(n-1)}{2}$ edges: one for every pair of vertices.',
    },
    check: { optionValues: [30, 36, 21, 15], compute: () => nCr(6, 2) },
  },
  {
    id: 'graph-theory-004',
    subtopic: 'graph-theory',
    difficulty: 'foundation',
    stem: 'A **tree** has 12 vertices. How many edges does it have?',
    options: ['$12$', '$11$', '$13$', '$66$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'A tree is a connected graph with no cycles. Every tree with $V$ vertices has exactly\n\n' +
        '$$E = V - 1$$\n\n' +
        'edges. (Start with one vertex; each new edge brings in exactly one new vertex.)\n\n' +
        'So $E = 12 - 1 = 11$.',
      whyWrong: [
        'This assumes $E = V$. A connected graph with as many edges as vertices always contains a cycle, so it cannot be a tree.',
        null,
        'This uses $E = V + 1$; a tree has one edge **fewer** than vertices, not one more.',
        'This is $\\frac{12 \\times 11}{2} = 66$, the number of edges of the complete graph $K_{12}$, which has the **most** edges possible, not the fewest.',
      ],
      keyIdea: 'A tree with $V$ vertices always has $V - 1$ edges.',
    },
    check: { optionValues: [12, 11, 13, 66], compute: () => 12 - 1 },
  },
  {
    id: 'graph-theory-005',
    subtopic: 'graph-theory',
    difficulty: 'foundation',
    stem: 'Which statement about **trees** (in graph theory) is TRUE?',
    options: [
      'A tree with $n$ vertices has $n$ edges.',
      'Every vertex in a tree has degree at most $2$.',
      'A tree contains exactly one cycle.',
      'A tree is connected and contains no cycles.',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        'The definition of a **tree** is a graph that is **connected** (you can get from any vertex to any other) and has **no cycles** (no closed loops).\n\n' +
        'Consequences: a tree with $n$ vertices has $n - 1$ edges, and there is exactly one path between any two vertices.\n\n' +
        'Check the other statements against a star (one centre joined to 4 leaves): it is a tree, its centre has degree 4, it has 5 vertices and 4 edges, and it has no cycle.',
      whyWrong: [
        'A tree with $n$ vertices has $n - 1$ edges. Adding one more edge to a tree always creates a cycle.',
        'That describes a **path**, which is only one kind of tree. A star with one centre and 4 leaves is a tree whose centre has degree 4.',
        'A tree has **no** cycles at all. A connected graph with exactly one cycle is a tree plus one extra edge.',
        null,
      ],
      keyIdea: 'Tree = connected + no cycles (and then automatically $E = V - 1$).',
    },
  },

  // ================================================================ exam
  {
    id: 'graph-theory-006',
    subtopic: 'graph-theory',
    difficulty: 'exam',
    stem:
      'The table shows the adjacency matrix of an undirected simple graph: an entry of 1 means the two vertices are joined by an edge, 0 means they are not. How many **edges** does the graph have?',
    table: {
      headers: ['', 'A', 'B', 'C', 'D'],
      rows: [
        ['A', 0, 1, 1, 0],
        ['B', 1, 0, 1, 1],
        ['C', 1, 1, 0, 1],
        ['D', 0, 1, 1, 0],
      ],
    },
    options: ['$10$', '$16$', '$5$', '$3$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'In an undirected graph the matrix is symmetric: the edge A–B appears as a 1 in row A (column B) **and** in row B (column A).\n\n' +
        'Row sums give the degrees: A: $2$, B: $3$, C: $3$, D: $2$.\n\n' +
        'Total of all entries $= 2 + 3 + 3 + 2 = 10$, which is the sum of degrees $= 2E$.\n\n' +
        'So $E = \\frac{10}{2} = 5$. Listing them confirms it: A–B, A–C, B–C, B–D, C–D.',
      whyWrong: [
        'This is the number of 1s in the matrix. Each edge appears twice (row A column B and row B column A), so the count must be halved.',
        'This is the number of entries in a $4 \\times 4$ matrix, including the 0s.',
        null,
        'This is the degree of vertex B (or C): the sum of a single row, not the number of edges in the whole graph.',
      ],
      keyIdea: 'For an undirected graph, the 1s in the adjacency matrix add up to twice the number of edges.',
    },
    check: { optionValues: [10, 16, 5, 3], compute: () => sumOf(ADJ_4.flat()) / 2 },
  },
  {
    id: 'graph-theory-007',
    subtopic: 'graph-theory',
    difficulty: 'exam',
    stem:
      'A **directed** graph has these 7 edges:\n\n' +
      '$A \\to B$, $A \\to C$, $B \\to C$, $C \\to A$, $C \\to D$, $D \\to B$, $D \\to C$\n\n' +
      'What is the **in-degree** of vertex C?',
    options: ['$3$', '$2$', '$5$', '$7$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'In a directed graph each edge has a direction. The **in-degree** of a vertex is the number of edges **arriving** at it (arrow pointing into it); the **out-degree** is the number **leaving** it.\n\n' +
        'Edges arriving at C (of the form $\\square \\to C$): $A \\to C$, $B \\to C$, $D \\to C$. That is 3.\n\n' +
        'For comparison, edges leaving C: $C \\to A$, $C \\to D$, so the out-degree is 2.\n\n' +
        'In-degree of C $= 3$.',
      whyWrong: [
        null,
        'This is the **out-degree** of C: the edges $C \\to A$ and $C \\to D$ leave C rather than arrive at it.',
        'This is the total number of edges touching C ($3$ in $+ 2$ out). The question asks only for the edges coming in.',
        'This is the total number of edges in the graph.',
      ],
      keyIdea: 'In-degree counts arrows into a vertex; out-degree counts arrows out of it.',
    },
    check: {
      optionValues: [3, 2, 5, 7],
      compute: () => {
        const edges: Edge[] = [
          ['A', 'B'],
          ['A', 'C'],
          ['B', 'C'],
          ['C', 'A'],
          ['C', 'D'],
          ['D', 'B'],
          ['D', 'C'],
        ];
        return edges.filter(([, to]) => to === 'C').length;
      },
    },
  },
  {
    id: 'graph-theory-008',
    subtopic: 'graph-theory',
    difficulty: 'exam',
    stem:
      'Each option lists the vertex degrees of a **connected** graph. Which graph has an **Euler path** (a route that uses every edge exactly once) but **not** an Euler circuit (such a route that finishes where it started)?',
    options: ['$2, 2, 2, 2$', '$3, 3, 2, 2$', '$3, 3, 3, 3$', '$3, 1, 1, 1$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'For a connected graph, count the vertices of **odd** degree:\n\n' +
        '- 0 odd vertices: Euler circuit (and so also an Euler path).\n' +
        '- exactly 2 odd vertices: Euler path, but no circuit. The path must start at one odd vertex and end at the other.\n' +
        '- 4 or more odd vertices: no Euler path at all.\n\n' +
        'Count the odd degrees in each option:\n\n' +
        '| Degrees | Odd vertices | Result |\n' +
        '|---|---|---|\n' +
        '| $2, 2, 2, 2$ | 0 | circuit |\n' +
        '| $3, 3, 2, 2$ | 2 | path only |\n' +
        '| $3, 3, 3, 3$ | 4 | neither |\n' +
        '| $3, 1, 1, 1$ | 4 | neither |\n\n' +
        'So the answer is $3, 3, 2, 2$ (for example, a square with one diagonal).',
      whyWrong: [
        'Every degree is even (0 odd vertices), so this graph has an Euler **circuit**. The question asks for a path that is **not** a circuit.',
        null,
        'All four degrees are odd. Every odd vertex must be the start or the end of an Euler path, and a path only has two ends, so there is no Euler path.',
        'The degrees $3, 1, 1, 1$ are **all** odd (1 is odd too), giving 4 odd vertices, so there is no Euler path.',
      ],
      keyIdea: 'Connected graph: 0 odd vertices gives an Euler circuit, exactly 2 odd vertices gives an Euler path only, more than 2 gives neither.',
    },
    check: {
      optionValues: ['2222', '3322', '3333', '3111'],
      compute: () => {
        const seqs = [
          [2, 2, 2, 2],
          [3, 3, 2, 2],
          [3, 3, 3, 3],
          [3, 1, 1, 1],
        ];
        const hit = seqs.find((s) => s.filter((d) => d % 2 === 1).length === 2)!;
        return hit.join('');
      },
    },
  },
  {
    id: 'graph-theory-009',
    subtopic: 'graph-theory',
    difficulty: 'exam',
    stem:
      'The table lists the roads in a small network and their lengths in km. Every road can be used in both directions. What is the length of the **shortest route** from A to E?',
    table: {
      headers: ['Road', 'Length (km)'],
      rows: [
        ['A–B', 4],
        ['A–C', 2],
        ['B–C', 1],
        ['B–D', 5],
        ['C–D', 9],
        ['C–E', 10],
        ['D–E', 2],
      ],
    },
    options: ['$11$ km', '$12$ km', '$13$ km', '$10$ km'],
    correctIndex: 3,
    markScheme: {
      solution:
        'List the sensible routes from A to E and add up the lengths:\n\n' +
        '| Route | Total (km) |\n' +
        '|---|---|\n' +
        '| A–C–E | $2 + 10 = 12$ |\n' +
        '| A–B–D–E | $4 + 5 + 2 = 11$ |\n' +
        '| A–C–D–E | $2 + 9 + 2 = 13$ |\n' +
        '| A–C–B–D–E | $2 + 1 + 5 + 2 = 10$ |\n' +
        '| A–B–C–E | $4 + 1 + 10 = 15$ |\n\n' +
        'The trick: going A–C–B ($2 + 1 = 3$) reaches B more cheaply than the direct road A–B ($4$).\n\n' +
        'Shortest route: A–C–B–D–E, length $10$ km.',
      whyWrong: [
        'This is the route A–B–D–E. It misses the cheaper way of reaching B: A–C–B costs $3$, less than the direct road A–B at $4$.',
        'This is the route A–C–E, which uses the **fewest roads** (2). Shortest means the smallest total length, not the fewest edges.',
        'This is the route A–C–D–E, which uses the long road C–D ($9$ km).',
        null,
      ],
      keyIdea: 'Shortest path means the smallest total weight; a route with more edges can still be shorter.',
    },
    check: {
      optionValues: [11, 12, 13, 10],
      compute: () =>
        shortest(
          [
            ['A', 'B', 4],
            ['A', 'C', 2],
            ['B', 'C', 1],
            ['B', 'D', 5],
            ['C', 'D', 9],
            ['C', 'E', 10],
            ['D', 'E', 2],
          ],
          'A',
          'E',
        ),
    },
  },
  {
    id: 'graph-theory-010',
    subtopic: 'graph-theory',
    difficulty: 'exam',
    stem: 'In a league, every team plays every other team exactly **once**. A total of 66 matches are played. How many teams are in the league?',
    options: ['$11$', '$12$', '$33$', '$132$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Model the league as a complete graph $K_n$: teams are vertices and each match is an edge between two teams.\n\n' +
        '$K_n$ has $\\frac{n(n-1)}{2}$ edges, so\n\n' +
        '$$\\frac{n(n-1)}{2} = 66 \\quad\\Rightarrow\\quad n(n-1) = 132$$\n\n' +
        'Look for two consecutive whole numbers that multiply to 132: $12 \\times 11 = 132$.\n\n' +
        'So $n = 12$ teams. (Check: $\\frac{12 \\times 11}{2} = 66$.)',
      whyWrong: [
        'This comes from solving $\\frac{n(n+1)}{2} = 66$. Each team plays the **other** $n - 1$ teams, so the formula is $\\frac{n(n-1)}{2}$; with 11 teams there would be only $55$ matches.',
        null,
        'This is $66 \\div 2$. The 66 matches are already the edges; halving them does not give the number of teams.',
        'This is $2 \\times 66 = 132$, which equals $n(n-1)$. You still need to find $n$: $12 \\times 11 = 132$.',
      ],
      keyIdea: 'Everyone-plays-everyone problems are complete graphs: matches $= \\frac{n(n-1)}{2}$.',
    },
    check: {
      optionValues: [11, 12, 33, 132],
      compute: () => {
        let n = 1;
        while (nCr(n, 2) < 66) n++;
        return n;
      },
    },
  },
  {
    id: 'graph-theory-011',
    subtopic: 'graph-theory',
    difficulty: 'exam',
    stem:
      'A simple graph has 7 vertices. Six of the vertex degrees are $1, 2, 2, 3, 3, 3$ and the seventh vertex has degree $x$. Which of these could be the value of $x$?',
    options: ['$1$', '$3$', '$4$', '$7$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Two facts limit $x$:\n\n' +
        '1. **Handshake lemma:** the sum of the degrees is $2E$, so it must be **even**.\n' +
        '2. In a **simple** graph (no loops, no repeated edges) a vertex can join at most the other $7 - 1 = 6$ vertices, so $x \\le 6$.\n\n' +
        'The six known degrees add to $1 + 2 + 2 + 3 + 3 + 3 = 14$, which is even, so $x$ must be even.\n\n' +
        '- $x = 1$: total $15$, odd. Impossible.\n' +
        '- $x = 3$: total $17$, odd. Impossible.\n' +
        '- $x = 7$: odd total, and $7 > 6$. Impossible.\n' +
        '- $x = 4$: total $18$, so $E = 9$. Such a graph can be drawn.\n\n' +
        'So $x = 4$.',
      whyWrong: [
        'With $x = 1$ the degrees add to $15$, an odd number. The sum of degrees is always $2E$, so it must be even.',
        'With $x = 3$ the degrees add to $17$, which is odd, so this breaks the handshake lemma.',
        null,
        'In a simple graph with 7 vertices a vertex can be joined to at most the other 6, so degree 7 is impossible (and the total $21$ would be odd too).',
      ],
      keyIdea: 'The sum of the degrees must be even, so a graph always has an even number of odd-degree vertices.',
    },
    check: {
      optionValues: [1, 3, 4, 7],
      compute: () => {
        const known = [1, 2, 2, 3, 3, 3];
        const ok = [1, 3, 4, 7].filter((x) => graphical([...known, x]));
        return ok.length === 1 ? ok[0] : -1;
      },
    },
  },
  {
    id: 'graph-theory-012',
    subtopic: 'graph-theory',
    difficulty: 'exam',
    stem:
      'A connected graph has 10 vertices and 14 edges. What is the **smallest** number of edges you must remove so that what is left is a tree containing all 10 vertices?',
    options: ['$5$', '$4$', '$9$', '$7$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A tree that contains all 10 vertices (a **spanning tree**) has $V - 1 = 10 - 1 = 9$ edges.\n\n' +
        'The graph has 14 edges now, so you remove\n\n' +
        '$$14 - 9 = 5$$\n\n' +
        'edges (choosing edges that lie on cycles, so the graph stays connected).',
      whyWrong: [
        null,
        'This is $14 - 10$: it assumes a tree on 10 vertices has 10 edges. A tree has $V - 1 = 9$ edges.',
        'This is the number of edges that **remain** in the tree, not the number removed.',
        'This is $14 \\div 2$: halving the edges is the handshake-lemma step for degrees, and has nothing to do with this question.',
      ],
      keyIdea: 'A spanning tree keeps exactly $V - 1$ edges, so remove $E - (V - 1)$.',
    },
    check: { optionValues: [5, 4, 9, 7], compute: () => 14 - (10 - 1) },
  },
  {
    id: 'graph-theory-013',
    subtopic: 'graph-theory',
    difficulty: 'exam',
    stem:
      'A graph has these edges:\n\n' +
      'A–B, B–C, C–D, D–A, A–C, D–E\n\n' +
      'Which of the following is a **cycle** in this graph?',
    options: ['A–B–D–A', 'A–C–D–E–A', 'A–B–C–B–A', 'A–B–C–A'],
    correctIndex: 3,
    markScheme: {
      solution:
        'A **cycle** is a closed route that:\n\n' +
        '- uses only edges that exist,\n' +
        '- starts and ends at the same vertex,\n' +
        '- never repeats an edge or any other vertex (and has at least 3 edges).\n\n' +
        'Check each option:\n\n' +
        '- A–B–D–A: there is no edge B–D. Not valid.\n' +
        '- A–C–D–E–A: there is no edge E–A (E is only joined to D). Not valid.\n' +
        '- A–B–C–B–A: goes back along B–C and B–A, repeating edges and vertex B. This is a closed walk, not a cycle.\n' +
        '- A–B–C–A: edges A–B, B–C and C–A all exist, and no vertex repeats except the start/end. **This is a cycle** (a triangle).',
      whyWrong: [
        'There is no edge between B and D, so this route cannot be followed in the graph.',
        'There is no edge between E and A: E is only joined to D, so the route cannot get back to A.',
        'This goes back along the same edges (B–C then C–B, B–A after A–B). A cycle may not repeat edges or vertices; this is only a closed walk.',
        null,
      ],
      keyIdea: 'A cycle is a closed path: every edge must exist and no edge or vertex (other than the start) may repeat.',
    },
    check: {
      optionValues: ['ABDA', 'ACDEA', 'ABCBA', 'ABCA'],
      compute: () => {
        const edges = ['AB', 'BC', 'CD', 'DA', 'AC', 'DE'];
        const has = (u: string, v: string) => edges.includes(u + v) || edges.includes(v + u);
        const isCycle = (w: string) => {
          if (w[0] !== w[w.length - 1] || w.length < 4) return false;
          const inner = w.slice(0, -1);
          if (new Set(inner).size !== inner.length) return false;
          for (let i = 0; i + 1 < w.length; i++) if (!has(w[i], w[i + 1])) return false;
          return true;
        };
        const ok = ['ABDA', 'ACDEA', 'ABCBA', 'ABCA'].filter(isCycle);
        return ok.length === 1 ? ok[0] : 'none';
      },
    },
  },
  {
    id: 'graph-theory-014',
    subtopic: 'graph-theory',
    difficulty: 'exam',
    stem:
      'A connected graph has these 7 edges:\n\n' +
      'A–B, A–C, B–C, B–D, C–D, C–E, D–E\n\n' +
      'You want to trace every edge exactly once without lifting your pen (an Euler path). Which statement is correct?',
    options: [
      'It must start at A and end at E (or the other way round).',
      'It must start at B and end at D (or the other way round).',
      'It must start and finish at C.',
      'It can start at any vertex, because the graph is connected.',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Find the degree of every vertex:\n\n' +
        '| Vertex | Edges | Degree |\n' +
        '|---|---|---|\n' +
        '| A | A–B, A–C | 2 |\n' +
        '| B | A–B, B–C, B–D | 3 |\n' +
        '| C | A–C, B–C, C–D, C–E | 4 |\n' +
        '| D | B–D, C–D, D–E | 3 |\n' +
        '| E | C–E, D–E | 2 |\n\n' +
        'Check: $2 + 3 + 4 + 3 + 2 = 14 = 2 \\times 7$.\n\n' +
        'Exactly two vertices, B and D, have odd degree. Every time the pen passes **through** a vertex it uses 2 edges there, so an odd vertex must be a start or an end. Hence an Euler path exists, and it must start at B and finish at D (or start at D and finish at B).\n\n' +
        'Example: B–A–C–B–D–C–E–D.',
      whyWrong: [
        'A and E have the smallest degrees, but they are **even** (2). An Euler path must start and end at the odd-degree vertices, which are B and D.',
        null,
        'Starting and finishing at the same vertex would be an Euler **circuit**, which needs every degree to be even. Here B and D are odd.',
        'Being connected is needed but is not enough: because B and D have odd degree, a route starting anywhere else gets stuck before using every edge.',
      ],
      keyIdea: 'An Euler path with exactly two odd vertices must start at one odd vertex and end at the other.',
    },
    check: {
      optionValues: ['A,E', 'B,D', 'C', null],
      compute: () => {
        const d = degrees([
          ['A', 'B'],
          ['A', 'C'],
          ['B', 'C'],
          ['B', 'D'],
          ['C', 'D'],
          ['C', 'E'],
          ['D', 'E'],
        ]);
        return [...d.entries()]
          .filter(([, k]) => k % 2 === 1)
          .map(([v]) => v)
          .sort()
          .join(',');
      },
    },
  },
  {
    id: 'graph-theory-015',
    subtopic: 'graph-theory',
    difficulty: 'exam',
    stem:
      'An engineer finds that connecting every pair of computers in a lab directly (a complete network) would need 45 cables. What is the **minimum** number of cables needed to connect the same computers so that every computer can reach every other one (possibly through other computers)?',
    options: ['$44$', '$10$', '$36$', '$9$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Step 1: find the number of computers.** A complete network is $K_n$ with $\\frac{n(n-1)}{2}$ edges:\n\n' +
        '$$\\frac{n(n-1)}{2} = 45 \\quad\\Rightarrow\\quad n(n-1) = 90 = 10 \\times 9$$\n\n' +
        'so $n = 10$ computers.\n\n' +
        '**Step 2: the cheapest connected network.** The smallest connected graph on $n$ vertices is a **tree**, which has $n - 1$ edges.\n\n' +
        'Minimum cables $= 10 - 1 = 9$.',
      whyWrong: [
        'This subtracts 1 from the number of **cables** (45). The tree rule $E = V - 1$ uses the number of **vertices** (computers), which is 10.',
        'This is the number of computers. A connected network on 10 computers needs only $10 - 1 = 9$ cables (a tree).',
        'This is $45 - 9 = 36$, the number of cables **saved**, not the number needed.',
        null,
      ],
      keyIdea: 'Use $\\frac{n(n-1)}{2}$ to find $n$, then the minimum connected network is a tree with $n - 1$ edges.',
    },
    check: {
      optionValues: [44, 10, 36, 9],
      compute: () => {
        let n = 1;
        while (nCr(n, 2) < 45) n++;
        return n - 1;
      },
    },
  },

  // ================================================================ challenge
  {
    id: 'graph-theory-016',
    subtopic: 'graph-theory',
    difficulty: 'challenge',
    stem:
      'The table is the adjacency matrix $M$ of an undirected graph. The entry in row $i$, column $j$ of $M^3$ counts the walks of length 3 from vertex $i$ to vertex $j$. What is the entry in row B, column B of $M^3$?',
    table: {
      headers: ['', 'A', 'B', 'C', 'D'],
      rows: [
        ['A', 0, 1, 1, 0],
        ['B', 1, 0, 1, 1],
        ['C', 1, 1, 0, 1],
        ['D', 0, 1, 1, 0],
      ],
    },
    options: ['$2$', '$3$', '$4$', '$0$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'A walk of length 3 from B back to B uses 3 edges and returns to B, so it goes round a **triangle** through B.\n\n' +
        'Edges: A–B, A–C, B–C, B–D, C–D. Triangles containing B:\n\n' +
        '- B, A, C (edges B–A, A–C, C–B all exist)\n' +
        '- B, C, D (edges B–C, C–D, D–B all exist)\n' +
        '- B, A, D is not a triangle (no edge A–D).\n\n' +
        'Each triangle can be walked in **two directions**, so the walks are:\n\n' +
        'B–A–C–B, B–C–A–B, B–C–D–B, B–D–C–B: that is $2 \\times 2 = 4$ walks.\n\n' +
        'Matrix check: row B of $M^2$ is the sum of the rows of B\'s neighbours A, C, D: $(0,1,1,0) + (1,1,0,1) + (0,1,1,0) = (1,3,2,1)$. Multiply by column B of $M$, which is $(1,0,1,1)$: $1 \\times 1 + 3 \\times 0 + 2 \\times 1 + 1 \\times 1 = 4$.\n\n' +
        'So $(M^3)_{BB} = 4$.',
      whyWrong: [
        'This counts the two triangles through B but forgets that each triangle can be walked in two directions (B–A–C–B and B–C–A–B are different walks).',
        'This is $(M^2)_{BB}$, which equals the degree of B (walks of length 2 go out along an edge and straight back). The question asks about $M^3$.',
        null,
        'This copies the diagonal of $M$ itself, which is 0 because there are no loops. Powers of $M$ can have non-zero diagonal entries.',
      ],
      keyIdea: '$(M^k)_{ij}$ counts walks of length $k$ from $i$ to $j$; the diagonal of $M^3$ counts triangles through a vertex, twice each.',
    },
    check: {
      optionValues: [2, 3, 4, 0],
      compute: () => matMul(matMul(ADJ_4, ADJ_4), ADJ_4)[1][1],
    },
  },
  {
    id: 'graph-theory-017',
    subtopic: 'graph-theory',
    difficulty: 'challenge',
    stem: 'A tree has 10 vertices, and every vertex has degree either $1$ or $3$. How many vertices of degree $1$ (leaves) does the tree have?',
    options: ['$4$', '$6$', '$5$', '$9$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Let $L$ be the number of leaves (degree 1) and $T$ the number of vertices of degree 3.\n\n' +
        '**Count the vertices:** $L + T = 10$.\n\n' +
        '**Count the edges:** a tree with 10 vertices has $10 - 1 = 9$ edges, so by the handshake lemma the degrees add to $2 \\times 9 = 18$:\n\n' +
        '$$L + 3T = 18$$\n\n' +
        '**Solve:** subtract the first equation from the second: $2T = 8$, so $T = 4$ and $L = 10 - 4 = 6$.\n\n' +
        'Check: $6 \\times 1 + 4 \\times 3 = 18$. (Such a tree exists: a path of 4 degree-3 vertices with 2 leaves on each end vertex and 1 leaf on each middle vertex.)\n\n' +
        'So there are $6$ leaves.',
      whyWrong: [
        'This is $T$, the number of vertices of degree **3**. The question asks for the degree-1 vertices: $L = 10 - 4 = 6$.',
        null,
        'This uses $E = V = 10$, so the degrees add to $20$, giving $L + 3T = 20$ and $L = T = 5$. A tree has $V - 1 = 9$ edges, so the sum is $18$.',
        'This is the number of edges of the tree ($10 - 1$), not the number of leaves.',
      ],
      keyIdea: 'Combine $E = V - 1$ for trees with the handshake lemma (sum of degrees $= 2E$) to set up simultaneous equations.',
    },
    check: {
      optionValues: [4, 6, 5, 9],
      compute: () => {
        const V = 10;
        for (let L = 0; L <= V; L++) if (L * 1 + (V - L) * 3 === 2 * (V - 1)) return L;
        return -1;
      },
    },
  },
  {
    id: 'graph-theory-018',
    subtopic: 'graph-theory',
    difficulty: 'challenge',
    stem:
      'The table is the adjacency matrix of a **directed** graph: the entry in row X, column Y is 1 if there is an edge $X \\to Y$, and 0 otherwise. How many directed walks of length 2 (two edges, following the arrows) go **from P to S**?',
    table: {
      headers: ['From / To', 'P', 'Q', 'R', 'S'],
      rows: [
        ['P', 0, 1, 1, 0],
        ['Q', 0, 0, 1, 1],
        ['R', 1, 0, 0, 1],
        ['S', 0, 1, 1, 0],
      ],
    },
    options: ['$2$', '$0$', '$1$', '$4$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A walk of length 2 from P to S is $P \\to X \\to S$ for some middle vertex $X$. We need an edge $P \\to X$ **and** an edge $X \\to S$.\n\n' +
        'Row P tells us where P can go: $P \\to Q$ and $P \\to R$.\n\n' +
        '- $X = Q$: is there $Q \\to S$? Row Q, column S is 1. Yes.\n' +
        '- $X = R$: is there $R \\to S$? Row R, column S is 1. Yes.\n\n' +
        'So the walks are $P \\to Q \\to S$ and $P \\to R \\to S$: **2** walks. This is the entry in row P, column S of $M^2$: row P is $(0,1,1,0)$ and column S is $(0,1,1,0)$; only the Q and R positions have a 1 in both, giving $1 \\cdot 1 + 1 \\cdot 1 = 2$.',
      whyWrong: [
        null,
        'This is the entry in row P, column S of $M$ itself, which counts direct edges $P \\to S$ (walks of length 1). There are none, but there are 2-step walks.',
        'This counts walks from S to P (only $S \\to R \\to P$), going against the direction asked. In a directed graph the order matters.',
        'This counts **all** walks of length 2 starting at P ($P \\to Q \\to R$, $P \\to Q \\to S$, $P \\to R \\to P$, $P \\to R \\to S$), not just those ending at S.',
      ],
      keyIdea: 'Walks of length 2 from $X$ to $Y$ are counted by $(M^2)_{XY}$: sum over middle vertices of (edge in) times (edge out).',
    },
    check: {
      optionValues: [2, 0, 1, 4],
      compute: () => {
        const M = [
          [0, 1, 1, 0],
          [0, 0, 1, 1],
          [1, 0, 0, 1],
          [0, 1, 1, 0],
        ];
        return matMul(M, M)[0][3];
      },
    },
  },
  {
    id: 'graph-theory-019',
    subtopic: 'graph-theory',
    difficulty: 'challenge',
    stem:
      'A graph with 20 vertices has **no cycles** and is made of exactly 3 separate connected pieces (components). How many edges does it have?',
    options: ['$19$', '$20$', '$17$', '$23$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'A graph with no cycles is a **forest**: each connected piece is a tree.\n\n' +
        'Suppose the 3 trees have $a$, $b$ and $c$ vertices, with $a + b + c = 20$. Each tree has one edge fewer than its vertices:\n\n' +
        '$$E = (a - 1) + (b - 1) + (c - 1) = (a + b + c) - 3 = 20 - 3 = 17$$\n\n' +
        'In general, a forest with $V$ vertices and $k$ trees has $V - k$ edges.',
      whyWrong: [
        'This is $20 - 1$, the edge count for a **single** tree. With 3 separate trees, you lose one edge per tree: $20 - 3$.',
        'This assumes $E = V$, but every tree has one edge fewer than vertices, and here there are 3 trees.',
        null,
        'This adds the number of components ($20 + 3$) instead of subtracting it. Splitting a tree into more pieces means **fewer** edges, not more.',
      ],
      keyIdea: 'A forest with $V$ vertices and $k$ trees has $V - k$ edges (each tree has one fewer edge than vertices).',
    },
    check: {
      optionValues: [19, 20, 17, 23],
      compute: () => {
        // any split into 3 trees gives the same total; use 10 + 6 + 4
        const sizes = [10, 6, 4];
        return sumOf(sizes.map((s) => s - 1));
      },
    },
  },
  {
    id: 'graph-theory-020',
    subtopic: 'graph-theory',
    difficulty: 'challenge',
    stem: 'What is the **largest** number of edges a simple graph with 8 vertices can have while still being **disconnected**?',
    options: ['$28$', '$21$', '$27$', '$7$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'If the graph is disconnected, the vertices split into two groups with **no** edges between them. To get as many edges as possible, make each group complete.\n\n' +
        'With groups of size $k$ and $8 - k$ the maximum is $\\binom{k}{2} + \\binom{8-k}{2}$:\n\n' +
        '| Split | Edges |\n' +
        '|---|---|\n' +
        '| $7 + 1$ | $21$ (the single vertex has no edges) |\n' +
        '| $6 + 2$ | $15 + 1 = 16$ |\n' +
        '| $5 + 3$ | $10 + 3 = 13$ |\n' +
        '| $4 + 4$ | $6 + 6 = 12$ |\n\n' +
        'The best is to make 7 vertices into a complete graph $K_7$ and leave one vertex on its own: $\\frac{7 \\times 6}{2} = 21$ edges.\n\n' +
        'One more edge would have to touch the lonely vertex and would connect the graph.',
      whyWrong: [
        'This is the number of edges of $K_8$, which is connected. A disconnected graph must be missing at least all the edges from some vertex group to the rest.',
        null,
        'This is $28 - 1$. Removing one edge from $K_8$ does not disconnect it: the two end vertices are still joined through any of the other 6 vertices.',
        'This is $8 - 1 = 7$, the **minimum** number of edges a connected graph on 8 vertices needs (a tree). It answers a different question.',
      ],
      keyIdea: 'A disconnected graph on $n$ vertices has at most $\\binom{n-1}{2}$ edges: a complete $K_{n-1}$ plus one isolated vertex.',
    },
    check: {
      optionValues: [28, 21, 27, 7],
      compute: () => {
        let best = 0;
        for (let k = 1; k <= 7; k++) best = Math.max(best, nCr(k, 2) + nCr(8 - k, 2));
        return best;
      },
    },
  },
];
