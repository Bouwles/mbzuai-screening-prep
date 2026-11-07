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
      asking: 'How many edges touch vertex C?',
      solution:
        'A graph is a set of points, called **vertices**, joined by lines, called **edges**. The **degree** of a vertex is the number of edges touching it.\n\n' +
        'An edge has no direction, so A–C and C–A are the same edge. That means C can appear at either end. Go through the list: A–C, B–C, C–D and C–E contain C, while A–B and D–E do not.\n\n' +
        'Count the edges containing C: there are 4.',
      conclusion: 'Four of the edges contain C, so its degree is $4$.',
      whyWrong: [
        'This counts only the edges written with C first (C–D and C–E). An edge is the same whichever way round it is written, so A–C and B–C touch C too.',
        'This is the total number of edges in the whole graph, not the number of edges that touch C.',
        null,
        'This doubles the degree. The "each edge counts twice" rule applies to the **sum of all the degrees**; each edge at C adds just 1 to the degree of C.',
      ],
      keyIdea: 'To find a vertex\'s degree, scan the edge list and count each edge containing that letter, whichever way round it is written. As a check, all the degrees should add up to twice the number of edges.',
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
      asking: 'Given the degrees, how many edges are in the graph?',
      solution:
        'A graph is made of points, called **vertices**, joined by lines, called **edges**. The **degree** of a vertex is how many edges touch it. Each edge has two ends, so it adds 1 to the degree of two vertices.\n\n' +
        'So if you add all the degrees, each edge has been counted exactly twice. This is the **handshake lemma**: sum of degrees $= 2 \\times$ number of edges.\n\n' +
        'Add the degrees: $3 + 3 + 2 + 2 + 4 = 14$.\n\n' +
        'Halve that total to undo the double counting: $14 \\div 2 = 7$.',
      conclusion: 'The degrees total 14 and each edge was counted twice, so there are $7$ edges.',
      whyWrong: [
        null,
        'This is the sum of the degrees. Every edge is counted twice in that sum (once from each end), so you must halve it.',
        'This is the number of vertices, not the number of edges.',
        'This multiplies the degree sum by 2 instead of dividing: the rule is sum of degrees $= 2E$, so $E = 14 \\div 2$.',
      ],
      keyIdea: 'Whenever degrees and edges appear together, use: sum of degrees $= 2E$, where $E$ is the number of edges. This also means the degree sum must be even.',
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
      asking: 'How many edges are needed to join every pair of 6 vertices?',
      solution:
        'In $K_6$, each of the 6 points, called **vertices**, is joined to all the others by a line, called an **edge**. The $K$ stands for complete, and the 6 is the number of vertices.\n\n' +
        'Each vertex joins to the other 5, so 5 edges meet at each vertex. Counting from every vertex gives $6 \\times 5 = 30$.\n\n' +
        'Each edge has two ends, so it was counted twice: once from each end. Halve the count: $30 \\div 2 = 15$.',
      conclusion: 'Counting from each vertex gives 30, and that counts every edge twice, so $K_6$ has $15$ edges.',
      whyWrong: [
        'This is $6 \\times 5 = 30$: it counts every edge from both of its ends, so each edge is counted twice. Divide by 2.',
        'This is $6^2 = 36$: it pairs every vertex with every vertex, including itself, and also counts each edge twice.',
        'This is $\\frac{6 \\times 7}{2} = 21$, which uses $n + 1$ instead of $n - 1$. Each vertex joins to the **other** 5 vertices, not 7.',
        null,
      ],
      keyIdea: 'A complete graph $K_n$ has $\\frac{n(n-1)}{2}$ edges, where $n$ is the number of vertices. Each vertex joins $n - 1$ others, then you halve because each edge has two ends.',
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
      asking: 'How many edges does a tree with 12 vertices have?',
      solution:
        'A graph is made of points, called **vertices**, joined by lines, called **edges**. A **tree** is a connected graph with no cycles. Connected means you can get from any vertex to any other. A cycle is a closed loop.\n\n' +
        'Build a tree one vertex at a time. Start with 1 vertex and 0 edges. Each new vertex must connect to what is there with exactly 1 edge, because a second edge would create a cycle.\n\n' +
        'So the edges are always one fewer than the vertices: a tree with $V$ vertices has $V - 1$ edges. With 12 vertices that is $12 - 1 = 11$.',
      conclusion: 'Every vertex after the first adds one edge, so 12 vertices give $11$ edges.',
      whyWrong: [
        'This assumes $E = V$. A connected graph with as many edges as vertices always contains a cycle, so it cannot be a tree.',
        null,
        'This uses $E = V + 1$; a tree has one edge **fewer** than vertices, not one more.',
        'This is $\\frac{12 \\times 11}{2} = 66$, the number of edges of the complete graph $K_{12}$, which has the **most** edges possible, not the fewest.',
      ],
      keyIdea: 'Whenever a question says "tree", or "connected with no cycles", use $E = V - 1$, where $E$ is edges and $V$ is vertices. A quick example to anchor it: 2 vertices joined by 1 edge.',
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
      asking: 'Which sentence correctly describes a tree in a graph?',
      solution:
        'In graph theory, a **tree** is defined by two properties. **Connected** means you can travel from any point (**vertex**) to any other along the lines (**edges**). **No cycles** means no route goes round in a closed loop.\n\n' +
        'Draw a tiny tree: one centre vertex with edges to 4 outer vertices. It has 5 vertices and 4 edges, its centre has degree 4 (4 edges touching it), and it has no closed loop. This rules out "$n$ edges", "degree at most 2" and "exactly one cycle".',
      conclusion: 'The definition itself is the true statement: A tree is connected and contains no cycles.',
      whyWrong: [
        'A tree with $n$ vertices has $n - 1$ edges. Adding one more edge to a tree always creates a cycle.',
        'That describes a **path**, which is only one kind of tree. A star with one centre and 4 leaves is a tree whose centre has degree 4.',
        'A tree has **no** cycles at all. A connected graph with exactly one cycle is a tree plus one extra edge.',
        null,
      ],
      keyIdea: 'Know the tree facts: connected, no cycles, and exactly $n - 1$ edges for $n$ vertices. A star (one centre with many outer vertices) is a handy test example, because it breaks false claims about degrees.',
    },
  },

  // ================================================================ exam
  {
    id: 'graph-theory-006',
    subtopic: 'graph-theory',
    difficulty: 'exam',
    stem: 'The table shows the adjacency matrix of an undirected simple graph (1 means an edge, 0 means no edge). How many **edges** does the graph have?',
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
      asking: 'How many edges does the graph in this matrix have?',
      solution:
        'An **adjacency matrix** is a table with a row and a column for each point (**vertex**) of a graph. A 1 in row A, column B means a line (**edge**) joins A and B.\n\n' +
        'The graph is undirected, meaning edges have no direction, so edge A–B shows up twice: in row A, column B and in row B, column A.\n\n' +
        'Count the 1s in each row: A has 2, B has 3, C has 3 and D has 2. The total is $2 + 3 + 3 + 2 = 10$.\n\n' +
        'Each edge was counted twice, so halve the total: $10 \\div 2 = 5$. Listing them confirms it: A–B, A–C, B–C, B–D, C–D.',
      conclusion: 'There are ten 1s and each edge appears twice, so the graph has $5$ edges.',
      whyWrong: [
        'This is the number of 1s in the matrix. Each edge appears twice (row A column B and row B column A), so the count must be halved.',
        'This is the number of entries in a $4 \\times 4$ matrix, including the 0s.',
        null,
        'This is the degree of vertex B (or C): the sum of a single row, not the number of edges in the whole graph.',
      ],
      keyIdea: 'For an undirected adjacency matrix, edges $=$ number of 1s $\\div 2$. Or count only the 1s above the diagonal, the line of cells from top left to bottom right. A row\'s sum gives that vertex\'s degree (how many edges touch it). In a directed graph, where edges are one-way arrows, don\'t halve.',
    },
    check: { optionValues: [10, 16, 5, 3], compute: () => sumOf(ADJ_4.flat()) / 2 },
  },
  {
    id: 'graph-theory-007',
    subtopic: 'graph-theory',
    difficulty: 'foundation',
    stem:
      'A **directed** graph has these 7 edges:\n\n' +
      '$A \\to B$, $A \\to C$, $B \\to C$, $C \\to A$, $C \\to D$, $D \\to B$, $D \\to C$\n\n' +
      'What is the **in-degree** of vertex C?',
    options: ['$3$', '$2$', '$5$', '$7$'],
    correctIndex: 0,
    markScheme: {
      asking: 'How many arrows point into vertex C?',
      solution:
        'A graph is made of points, called **vertices**, joined by lines, called **edges**. In a **directed** graph, each edge is an arrow with a start and an end. $A \\to B$ goes from A into B.\n\n' +
        'The **in-degree** of a vertex is the number of arrows coming into it. So we want the edges with C on the right-hand side of the arrow.\n\n' +
        'Scan the list. $A \\to C$, $B \\to C$ and $D \\to C$ end at C, which makes 3. $C \\to A$ and $C \\to D$ start at C, so they don\'t count.',
      conclusion: 'Three arrows end at C, so its in-degree is $3$.',
      whyWrong: [
        null,
        'This is the **out-degree** of C: the edges $C \\to A$ and $C \\to D$ leave C rather than arrive at it.',
        'This is the total number of edges touching C ($3$ in $+ 2$ out). The question asks only for the edges coming in.',
        'This is the total number of edges in the graph.',
      ],
      keyIdea: 'In a directed graph, in-degree counts arrows ending at the vertex, and out-degree counts arrows starting from it. Look for the letter on the right of the arrow for in, and on the left for out.',
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
    stem: 'Each option lists the degrees of a **connected** graph. Which has an **Euler path** (uses every edge exactly once) but **no** Euler circuit (such a path ending where it started)?',
    options: ['$2, 2, 2, 2$', '$3, 3, 2, 2$', '$3, 3, 3, 3$', '$3, 1, 1, 1$'],
    correctIndex: 1,
    markScheme: {
      asking: 'Which list of degrees allows a route using every edge once, but ending somewhere else?',
      solution:
        'A graph is points (**vertices**) joined by lines (**edges**), and **connected** means you can get from any vertex to any other. An **Euler path** travels along every edge exactly once. An **Euler circuit** does the same but ends where it started. The **degree** of a vertex is the number of edges touching it.\n\n' +
        'Whenever a route passes through a vertex, it uses two edges: one in and one out. So a vertex that isn\'t a start or end must have an even degree.\n\n' +
        'A vertex with an odd degree has an edge left over, so the route must start or end there. A path has only 2 ends. So a path that isn\'t a circuit needs **exactly 2** odd vertices, and a circuit needs 0.\n\n' +
        'Count the odd degrees in each list:\n\n| Degrees | Odd degrees | Result |\n|---|---|---|\n| $2, 2, 2, 2$ | 0 | Euler circuit |\n| $3, 3, 3, 3$ | 4 | Neither |\n| $3, 1, 1, 1$ | 4 | Neither |\n| $3, 3, 2, 2$ | 2 | Euler path, no circuit |',
      conclusion: 'Exactly two vertices are odd in $3, 3, 2, 2$, so those two are the ends of an Euler path that is not a circuit.',
      whyWrong: [
        'Every degree is even (0 odd vertices), so this graph has an Euler **circuit**. The question asks for a path that is **not** a circuit.',
        null,
        'All four degrees are odd. Every odd vertex must be the start or the end of an Euler path, and a path only has two ends, so there is no Euler path.',
        'The degrees $3, 1, 1, 1$ are **all** odd (1 is odd too), giving 4 odd vertices, so there is no Euler path.',
      ],
      keyIdea: 'For a connected graph, count the odd-degree vertices. 0 odd: Euler circuit. 2 odd: Euler path that starts and ends at those two. Any other number: neither. Don\'t forget that 1 is odd too.',
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
    stem: 'The table gives the length in km of each road in a network, and roads can be used both ways. What is the length of the **shortest route** from A to E?',
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
      asking: 'What is the smallest total distance from A to E?',
      solution:
        'The shortest route means the smallest total km, not the fewest roads. So work outwards from A, keeping the shortest distance found so far to each place.\n\n' +
        'From A, the roads reach B in 4 km and C in 2 km. C is the closest, so its shortest distance is settled at 2 km.\n\n' +
        'Now try the roads out of C. B via C costs $2 + 1 = 3$, which beats 4. D via C costs $2 + 9 = 11$. E via C costs $2 + 10 = 12$.\n\n' +
        'B is now the closest unsettled place, at 3 km. Try its road to D: $3 + 5 = 8$, which beats 11.\n\n' +
        'D is next, at 8 km. Try its road to E: $8 + 2 = 10$, which beats 12.',
      conclusion: 'The best route is A–C–B–D–E, with lengths $2 + 1 + 5 + 2$, so the shortest route is $10$ km.',
      whyWrong: [
        'This is the route A–B–D–E. It misses the cheaper way of reaching B: A–C–B costs $3$, less than the direct road A–B at $4$.',
        'This is the route A–C–E, which uses the **fewest roads** (2). Shortest means the smallest total length, not the fewest edges.',
        'This is the route A–C–D–E, which uses the long road C–D ($9$ km).',
        null,
      ],
      keyIdea: 'For shortest routes, repeatedly take the closest unsettled place and update the places next to it using distance so far $+$ road length. Keep a table of best distances. The route with the fewest roads is often not the shortest.',
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
    stem: 'The complete graph $K_n$ has 66 edges. What is $n$?',
    options: ['$11$', '$12$', '$33$', '$132$'],
    correctIndex: 1,
    markScheme: {
      asking: 'How many vertices does a complete graph with 66 edges have?',
      solution:
        'In the complete graph $K_n$, every pair of the $n$ points, called **vertices**, is joined by a line, called an **edge**. Each vertex joins $n - 1$ others, which counts $n(n-1)$ edge ends. Each edge has two ends, so the number of edges is $\\frac{n(n-1)}{2}$.\n\n' +
        'Set this equal to 66: $\\frac{n(n-1)}{2} = 66$.\n\n' +
        'Multiply both sides by 2 to remove the fraction: $n(n-1) = 132$.\n\n' +
        'We need two whole numbers in a row that multiply to 132. Since $11^2 = 121$ is close, try 11 and 12: $12 \\times 11 = 132$. So the larger number, $n$, is 12.',
      conclusion: '$K_{12}$ has $\\frac{12 \\times 11}{2} = 66$ edges, so $n$ is $12$.',
      whyWrong: [
        'This comes from solving $\\frac{n(n+1)}{2} = 66$. Each vertex joins the **other** $n - 1$ vertices, so the formula is $\\frac{n(n-1)}{2}$; $K_{11}$ has only $55$ edges.',
        null,
        'This is $66 \\div 2$. Halving the number of edges does not give the number of vertices.',
        'This is $2 \\times 66 = 132$, which equals $n(n-1)$. You still need to find $n$: $12 \\times 11 = 132$.',
      ],
      keyIdea: 'To reverse the edge formula, double the edges, then find two neighbouring whole numbers whose product is that value. The larger one is $n$. Start from a number whose square is close.',
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
      asking: 'Which value of $x$ could make these degrees belong to a real graph?',
      solution:
        'A graph is made of points, called **vertices**, joined by lines, called **edges**. The **degree** of a vertex is how many edges touch it. Two rules limit the possible degrees.\n\n' +
        'First rule, called the **handshake lemma**: each edge adds 2 to the total of all the degrees, one for each end. So the degree total must be even.\n\n' +
        'Second rule: in a **simple** graph, no edge joins a vertex to itself and no pair is joined twice. With 7 vertices, a vertex can join at most the other 6, so $x \\le 6$.\n\n' +
        'Add the known degrees: $1 + 2 + 2 + 3 + 3 + 3 = 14$. This is even, so $x$ must be even to keep the total even.\n\n' +
        'Test the options:\n\n| $x$ | Total | Problem |\n|---|---|---|\n| 1 | 15 | Odd total |\n| 3 | 17 | Odd total |\n| 7 | 21 | Odd total, and above 6 |\n| 4 | 18 | None |',
      conclusion: 'Only 4 gives an even total and stays at or below 6, so $x$ could be $4$.',
      whyWrong: [
        'With $x = 1$ the degrees add to $15$, an odd number. The sum of degrees is always $2E$, so it must be even.',
        'With $x = 3$ the degrees add to $17$, which is odd, so this breaks the handshake lemma.',
        null,
        'In a simple graph with 7 vertices a vertex can be joined to at most the other 6, so degree 7 is impossible (and the total $21$ would be odd too).',
      ],
      keyIdea: 'To test a list of degrees, use two checks: the total must be even, and no degree can exceed the number of vertices minus 1. These rule out most options quickly.',
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
      asking: 'How many edges must go to leave a tree on all 10 vertices?',
      solution:
        'A graph is points (**vertices**) joined by lines (**edges**). A **tree** is connected, meaning every vertex can be reached from any other, and has no cycles (closed loops). A tree on $V$ vertices always has exactly $V - 1$ edges, because each vertex after the first joins on with exactly one edge.\n\n' +
        'So the tree we want has $10 - 1 = 9$ edges.\n\n' +
        'Removing an edge from a cycle never disconnects the graph, because you can still go the other way round. So we can keep removing such edges until only 9 remain.\n\n' +
        'The graph has 14 edges now. Keep 9 and remove the rest: $14 - 9 = 5$.',
      conclusion: 'A tree on 10 vertices keeps 9 edges, so $5$ of the 14 must go.',
      whyWrong: [
        null,
        'This is $14 - 10$: it assumes a tree on 10 vertices has 10 edges. A tree has $V - 1 = 9$ edges.',
        'This is the number of edges that **remain** in the tree, not the number removed.',
        'This is $14 \\div 2$: halving the edges is the handshake-lemma step for degrees, and has nothing to do with this question.',
      ],
      keyIdea: 'To reduce a connected graph to a tree using all its vertices, remove $E - (V - 1)$ edges, where $E$ is edges and $V$ is vertices. This counts edges removed, not edges kept.',
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
      asking: 'Which closed route is a genuine cycle in this graph?',
      solution:
        'In a graph, the letters are points called **vertices**, and each listed pair is a line called an **edge**. A **cycle** is a closed route that starts and ends at the same vertex. It uses only edges in the graph, and it doesn\'t repeat an edge or any vertex other than the start.\n\n' +
        'Test each route by checking every hop against the edge list:\n\n| Route | Problem |\n|---|---|\n| A–B–D–A | No edge B–D |\n| A–C–D–E–A | No edge E–A |\n| A–B–C–B–A | Repeats vertex B and its edges |\n| A–B–C–A | None: A–B, B–C and A–C all exist |',
      conclusion: 'It uses three real edges and returns to the start with no repeats, so the cycle is A–B–C–A.',
      whyWrong: [
        'There is no edge between B and D, so this route cannot be followed in the graph.',
        'There is no edge between E and A: E is only joined to D, so the route cannot get back to A.',
        'This goes back along the same edges (B–C then C–B, B–A after A–B). A cycle may not repeat edges or vertices; this is only a closed walk.',
        null,
      ],
      keyIdea: 'To test a route as a cycle, check each hop is an edge (either way round), then check no vertex or edge repeats except the start and end. A cycle in a simple graph needs at least 3 edges.',
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
      'Which statement about an **Euler path** (a route using every edge exactly once) is correct?',
    options: [
      'Its two ends must be A and E.',
      'Its two ends must be B and D.',
      'It must start and finish at C.',
      'It can start at any vertex.',
    ],
    correctIndex: 1,
    markScheme: {
      asking: 'Where must a route using every edge exactly once start and finish?',
      solution:
        'A graph is points (**vertices**) joined by lines (**edges**), and **connected** means you can get from any vertex to any other. The **degree** of a vertex is the number of edges touching it. Each time a route passes through a vertex, it uses one edge in and one edge out, which takes 2 from its degree.\n\n' +
        'So a vertex in the middle of the route needs an even degree. A vertex with an odd degree always has one edge left over, so the route must start or finish there.\n\n' +
        'Count each vertex\'s degree from the list of edges:\n\n| Vertex | Edges | Degree |\n|---|---|---|\n| A | A–B, A–C | 2 |\n| B | A–B, B–C, B–D | 3 |\n| C | A–C, B–C, C–D, C–E | 4 |\n| D | B–D, C–D, D–E | 3 |\n| E | C–E, D–E | 2 |\n\n' +
        'Only B and D have an odd degree, so they are the two ends. One such route is B–A–C–B–D–C–E–D, which uses all 7 edges.',
      conclusion: 'B and D are the only odd-degree vertices, so the correct statement is: Its two ends must be B and D.',
      whyWrong: [
        'A and E have the smallest degrees, but they are **even** (2). An Euler path must start and end at the odd-degree vertices, which are B and D.',
        null,
        'Starting and finishing at the same vertex would be an Euler **circuit**, which needs every degree to be even. Here B and D are odd.',
        'Being connected is needed but is not enough: because B and D have odd degree, a route starting anywhere else gets stuck before using every edge.',
      ],
      keyIdea: 'For an Euler path in a connected graph, work out every degree from the edge list. With exactly two odd vertices, those two are the ends. With none, the path can start anywhere and returns to its start.',
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
    stem: 'A complete graph has 45 edges. What is the **minimum** number of edges of a connected graph on the same vertices?',
    options: ['$44$', '$10$', '$36$', '$9$'],
    correctIndex: 3,
    markScheme: {
      asking: 'How few edges can keep these vertices all connected?',
      solution:
        'A graph is points (**vertices**) joined by lines (**edges**). A **complete graph** joins every pair of vertices. Each of the $n$ vertices joins $n - 1$ others, and each edge has two ends, so it has $\\frac{n(n-1)}{2}$ edges. First we need $n$ from the 45 edges.\n\n' +
        'Set $\\frac{n(n-1)}{2} = 45$. Multiply both sides by 2: $n(n-1) = 90$. The two whole numbers in a row that multiply to 90 are 10 and 9, so $n = 10$.\n\n' +
        '**Connected** means you can get from any vertex to any other. A connected graph with the fewest edges has no cycles (closed loops), because an edge in a cycle could be removed without disconnecting anything. A connected graph with no cycles is a **tree**.\n\n' +
        'Each vertex after the first joins a tree with exactly one edge, so a tree has one edge fewer than it has vertices. With 10 vertices that is $10 - 1 = 9$.',
      conclusion: '45 edges means 10 vertices, and connecting 10 vertices takes at least $9$ edges.',
      whyWrong: [
        'This subtracts 1 from the number of **edges** (45). The tree rule $E = V - 1$ uses the number of **vertices**, which is 10.',
        'This is the number of vertices. A connected graph on 10 vertices needs only $10 - 1 = 9$ edges (a tree).',
        'This is $45 - 9 = 36$, the number of edges **removed**, not the number kept.',
        null,
      ],
      keyIdea: 'Two formulas: a complete graph has $\\frac{n(n-1)}{2}$ edges (the most possible), and a tree has $n - 1$ edges (the fewest that keep it connected). Find $n$ first, then use the one you need.',
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
  {
    id: 'graph-theory-018',
    subtopic: 'graph-theory',
    difficulty: 'exam',
    stem: 'The table is the adjacency matrix of a **directed** graph (row X, column Y is 1 if there is an edge $X \\to Y$). How many walks of length 2 go **from P to S**?',
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
      asking: 'How many two-step routes go from P to S, following the arrows?',
      solution:
        'A **walk of length 2** is a route along two arrows in a row: P to some middle point (a **vertex**), then on to S. In this table, the row is where an arrow starts and the column is where it ends.\n\n' +
        'Read row P. The 1s are under Q and R, so P\'s arrows go to Q and R. These are the only possible middle vertices.\n\n' +
        'Now check whether each middle vertex has an arrow to S. Row Q, column S is 1, so $P \\to Q \\to S$ works. Row R, column S is 1, so $P \\to R \\to S$ works.',
      conclusion: 'Both middle vertices connect on to S, so there are $2$ walks.',
      whyWrong: [
        null,
        'This is the entry in row P, column S of $M$ itself, which counts direct edges $P \\to S$ (walks of length 1). There are none, but there are 2-step walks.',
        'This counts walks from S to P (only $S \\to R \\to P$), going against the direction asked. In a directed graph the order matters.',
        'This counts **all** walks of length 2 starting at P ($P \\to Q \\to R$, $P \\to Q \\to S$, $P \\to R \\to P$, $P \\to R \\to S$), not just those ending at S.',
      ],
      keyIdea: 'To count 2-step walks from X to Y, list the 1s in row X, then count how many of those vertices have a 1 in column Y. This equals the X, Y entry of the matrix multiplied by itself.',
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
    difficulty: 'exam',
    stem:
      'A graph with 20 vertices has **no cycles** and is made of exactly 3 separate connected pieces (components). How many edges does it have?',
    options: ['$19$', '$20$', '$17$', '$23$'],
    correctIndex: 2,
    markScheme: {
      asking: 'How many edges are in a graph made of 3 separate trees on 20 vertices?',
      solution:
        'A graph is points (**vertices**) joined by lines (**edges**). A connected piece with no cycles (closed loops) is a **tree**. So this graph is 3 separate trees. We don\'t know their sizes, but they have 20 vertices in total.\n\n' +
        'Each vertex after the first joins a tree with exactly one edge, so each tree has one edge fewer than it has vertices. Say the trees have $a$, $b$ and $c$ vertices, where $a + b + c = 20$. Their edges are $a - 1$, $b - 1$ and $c - 1$.\n\n' +
        'Add the three edge counts: $(a - 1) + (b - 1) + (c - 1) = (a + b + c) - 3$.\n\n' +
        'Substitute $a + b + c = 20$: $20 - 3 = 17$.',
      conclusion: 'Each of the 3 trees has one edge fewer than vertices, so there are $17$ edges.',
      whyWrong: [
        'This is $20 - 1$, the edge count for a **single** tree. With 3 separate trees, you lose one edge per tree: $20 - 3$.',
        'This assumes $E = V$, but every tree has one edge fewer than vertices, and here there are 3 trees.',
        null,
        'This adds the number of components ($20 + 3$) instead of subtracting it. Splitting a tree into more pieces means **fewer** edges, not more.',
      ],
      keyIdea: 'For a graph with no cycles, use $E = V - C$, where $E$ is edges, $V$ is vertices and $C$ is the number of separate pieces. The sizes of the pieces make no difference.',
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
    id: 'graph-theory-021',
    subtopic: 'graph-theory',
    difficulty: 'foundation',
    stem: 'What is the largest possible degree of a vertex in a simple graph of **order** $n$?',
    options: ['$n - 1$', '$n$', '$2n$', '$\\frac{n(n-1)}{2}$'],
    correctIndex: 0,
    markScheme: {
      asking: 'How many edges can touch one vertex in a simple graph with $n$ vertices?',
      solution:
        'A graph is points (**vertices**) joined by lines (**edges**). **Order** means the number of vertices, so there are $n$ vertices. The **degree** of a vertex is how many edges touch it. In a **simple** graph, no edge joins a vertex to itself and no pair has two edges.\n\n' +
        'So one vertex can be joined to each other vertex at most once. It can\'t join to itself, which leaves $n - 1$ others.',
      conclusion: 'A vertex joined to every other vertex has the largest degree possible, which is $n - 1$.',
      whyWrong: [
        null,
        'This counts the vertex itself, but a simple graph has no edge from a vertex to itself.',
        'This doubles the vertex count. No vertex can be joined to any other more than once in a simple graph.',
        'This is the number of edges of the complete graph $K_n$, not the degree of one vertex.',
      ],
      keyIdea: 'In a simple graph, degrees run from 0 up to the number of vertices minus 1. Use this limit to rule out impossible lists of degrees.',
    },
  },
  {
    id: 'graph-theory-022',
    subtopic: 'graph-theory',
    difficulty: 'foundation',
    stem: 'In a graph, a **loop** is:',
    options: ['an edge from a vertex to itself', 'a vertex of degree 1', 'two edges joining the same pair', 'a route visiting every vertex'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is meant by a loop in a graph?',
      solution:
        'An **edge** is a line in a graph, and it normally joins two different points, called **vertices**.\n\n' +
        'A **loop** is the special case in which both ends are the same vertex. Picture a small circle drawn from vertex A back to A.',
      conclusion: 'A loop has both ends at one vertex, so it is an edge from a vertex to itself.',
      whyWrong: [
        null,
        'A vertex of degree 1 is called a leaf when the graph is a tree. It is a vertex, not an edge.',
        'These are repeated (multiple) edges. They join two different vertices.',
        'This describes a route through the graph, not a single edge.',
      ],
      keyIdea: 'Keep the words apart: a loop is one edge with both ends at one vertex, multiple edges join the same pair more than once, and a simple graph has neither. A loop adds 2 to its vertex\'s degree, the count of edge ends there.',
    },
  },
  {
    id: 'graph-theory-023',
    subtopic: 'graph-theory',
    difficulty: 'foundation',
    stem: 'A vertex of degree 1 in a tree is called a:',
    options: ['leaf', 'root', 'cycle', 'bridge'],
    correctIndex: 0,
    markScheme: {
      asking: 'What do we call a vertex with only one edge in a tree?',
      solution:
        'A **tree** is a connected graph with no closed loops, made of points (**vertices**) joined by lines (**edges**). The **degree** of a vertex is the number of edges touching it. So a vertex of degree 1 has only one edge, and it sits at the end of a branch.\n\n' +
        'As in a real tree, the ends of the branches are called **leaves**.',
      conclusion: 'A vertex of degree 1 sits at the end of a branch, so it is called a leaf.',
      whyWrong: [
        null,
        'A root is a vertex chosen as the top of the tree, and it can have any degree.',
        'A cycle is a closed route, not a vertex. A tree contains no cycles.',
        'A bridge is an edge whose removal disconnects the graph, not a vertex.',
      ],
      keyIdea: 'Match the tree words: a leaf has degree 1, a root is the vertex chosen as the top, and a bridge is an edge whose removal disconnects the graph. A cycle is a closed route, which a tree never has.',
    },
  },
  {
    id: 'graph-theory-024',
    subtopic: 'graph-theory',
    difficulty: 'foundation',
    stem: 'The adjacency matrix of an undirected simple graph is always:',
    options: ['symmetric', 'invertible', 'the identity matrix', 'non-zero on its diagonal'],
    correctIndex: 0,
    markScheme: {
      asking: 'What pattern must the adjacency matrix of an undirected graph always show?',
      solution:
        'An **adjacency matrix** is a table with a row and a column for each point (**vertex**) of a graph. It has a 1 in row X, column Y when a line (**edge**) joins X and Y. **Undirected** means an edge works both ways.\n\n' +
        'So if A is joined to B, then B is joined to A. The entry in row A, column B must equal the entry in row B, column A.\n\n' +
        'A matrix in which row X, column Y always equals row Y, column X is called **symmetric**: it mirrors across the diagonal from top left to bottom right.',
      conclusion: 'An undirected edge appears twice, mirrored across the diagonal, so the matrix is always symmetric.',
      whyWrong: [
        null,
        'A graph with no edges has the zero matrix as its adjacency matrix, and that is not invertible.',
        'The identity has 1s on the diagonal, which would mean every vertex has a loop. A simple graph has no loops.',
        'The diagonal is all 0s, because a simple graph has no loops.',
      ],
      keyIdea: 'Undirected means symmetric, and a simple graph also has all 0s on the diagonal because it has no loops (edges from a vertex to itself). A directed graph, with one-way edges, need not be symmetric. Test a matrix by comparing each entry with its mirror image.',
    },
  },
];
