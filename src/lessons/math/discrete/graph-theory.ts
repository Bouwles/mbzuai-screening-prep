import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'graph-theory',
  know:
    '### What is a graph?\n\n' +
    'In discrete maths a **graph** is not a curve on axes. It is a set of dots called **vertices** (or nodes) joined by lines called **edges**. Graphs model anything with connections: friends on a social network, cities and roads, computers and cables, web pages and links. In AI they appear as neural-network diagrams, decision trees and knowledge graphs.\n\n' +
    'A **simple graph** has no loops (an edge from a vertex to itself) and no repeated edges between the same two vertices. Assume a graph is simple unless told otherwise.\n\n' +
    '### Degree and the handshake lemma\n\n' +
    'The **degree** of a vertex, written $\\deg(v)$, is the number of edges touching it. An edge A–B is the same as B–A, so count it at both A and B.\n\n' +
    'Every edge has **two ends**, and each end adds 1 to some degree. So when you add up all the degrees, every edge is counted exactly twice:\n\n' +
    '$$\\text{sum of degrees} = 2E$$\n\n' +
    'This is the **handshake lemma** (at a party, the total number of hands shaken is twice the number of handshakes). Two quick consequences:\n\n' +
    '- To find the number of edges, add the degrees and **halve**.\n' +
    '- The sum of degrees is always even, so the number of **odd-degree** vertices is always even. A list like $3, 3, 3, 2$ cannot be a graph.\n\n' +
    'Also, in a simple graph with $n$ vertices, no degree can be bigger than $n - 1$.\n\n' +
    '### Walks, paths, cycles and connected graphs\n\n' +
    '| Word | Meaning |\n' +
    '|---|---|\n' +
    '| walk | any route along edges (repeats allowed) |\n' +
    '| path | a walk that never repeats a vertex |\n' +
    '| cycle | a closed path: starts and ends at the same vertex, at least 3 edges, no other repeats |\n' +
    '| connected | you can get from every vertex to every other |\n\n' +
    'The **length** of a walk is the number of edges it uses (or the total weight, in a weighted graph).\n\n' +
    '### Trees\n\n' +
    'A **tree** is a connected graph with **no cycles**. Every tree with $V$ vertices has exactly $V - 1$ edges: start with one vertex, and each new edge brings in exactly one new vertex. Add one more edge and you create a cycle; remove one and the tree falls apart. So a tree is the **cheapest** way to connect $V$ vertices.\n\n' +
    'A **spanning tree** of a connected graph is a tree that uses all of its vertices; to get one from a graph with $E$ edges, remove $E - (V - 1)$ edges. A **forest** (a graph with no cycles) made of $k$ separate trees has $V - k$ edges. Vertices of degree 1 in a tree are called **leaves**.\n\n' +
    '### Complete graphs\n\n' +
    'In the **complete graph** $K_n$ every pair of the $n$ vertices is joined. Each vertex has degree $n - 1$, so the degrees add to $n(n-1)$ and\n\n' +
    '$$E = \\frac{n(n-1)}{2} = \\binom{n}{2}$$\n\n' +
    'Any "everyone plays everyone once" or "everyone shakes hands with everyone" question is $K_n$. For example $K_{10}$ has $45$ edges. This is the **most** edges a simple graph on $n$ vertices can have.\n\n' +
    '### Directed graphs\n\n' +
    'In a **directed graph** (digraph) each edge has an arrow: $A \\to B$ is not the same as $B \\to A$. Each vertex has an **in-degree** (arrows coming in) and an **out-degree** (arrows going out). The handshake lemma becomes: total in-degree = total out-degree = number of edges.\n\n' +
    '### Adjacency matrices\n\n' +
    'An **adjacency matrix** $M$ stores a graph as a table: the entry in row $i$, column $j$ is 1 if there is an edge from $i$ to $j$, and 0 if not.\n\n' +
    '- Undirected graph: $M$ is **symmetric** and its diagonal is 0 (no loops). A row sum is that vertex\'s degree, and the total of all entries is $2E$.\n' +
    '- Directed graph: row sum = out-degree, column sum = in-degree, and the total is $E$.\n' +
    '- Powers count walks: the entry $(M^k)_{ij}$ is the number of walks of length $k$ from $i$ to $j$. For $k = 2$ that is the number of middle vertices $m$ with an edge from $i$ to $m$ and an edge from $m$ to $j$ (in an undirected graph: the common neighbours of $i$ and $j$).\n\n' +
    '### Euler paths and circuits\n\n' +
    'An **Euler path** uses every **edge** exactly once (draw the picture without lifting your pen). An **Euler circuit** does this and ends where it started. Each time you pass **through** a vertex you use two of its edges, so only the start and the end can have odd degree. For a **connected** graph:\n\n' +
    '| Odd-degree vertices | Result |\n' +
    '|---|---|\n' +
    '| 0 | Euler circuit (start anywhere) |\n' +
    '| 2 | Euler path only: start at one odd vertex, end at the other |\n' +
    '| 4 or more | neither |\n\n' +
    '### Shortest paths\n\n' +
    'In a **weighted** graph each edge has a number (distance, time, cost). The shortest path is the route with the smallest **total weight**, not the fewest edges. For exam-sized networks, list the sensible routes and add them up; watch for a detour through a cheap edge that beats a direct but expensive one.',
  formulas: [
    { label: 'Handshake lemma', tex: '\\sum_{v} \\deg(v) = 2E', note: 'Add the degrees and halve to get the number of edges.' },
    { label: 'Odd-degree vertices', tex: '\\text{number of odd-degree vertices is even}', note: 'Follows from the handshake lemma: the degree sum must be even.' },
    { label: 'Maximum degree (simple graph)', tex: '\\deg(v) \\le n - 1', note: 'A vertex can join at most all the other vertices.' },
    { label: 'Edges of the complete graph', tex: 'E(K_n) = \\frac{n(n-1)}{2} = \\binom{n}{2}', note: 'One edge for every pair of vertices.' },
    { label: 'Tree', tex: 'E = V - 1', note: 'Connected and no cycles; the minimum number of edges to connect V vertices.' },
    { label: 'Forest of k trees', tex: 'E = V - k' },
    { label: 'Edges to remove for a spanning tree', tex: 'E - (V - 1)' },
    { label: 'Regular graph (every degree d)', tex: 'E = \\frac{nd}{2}' },
    { label: 'Directed graph', tex: '\\sum \\text{in-degrees} = \\sum \\text{out-degrees} = E' },
    { label: 'Walks from the adjacency matrix', tex: '(M^k)_{ij} = \\text{number of walks of length } k \\text{ from } i \\text{ to } j' },
    { label: 'Euler path / circuit (connected graph)', tex: '0 \\text{ odd vertices: circuit}, \\quad 2 \\text{ odd vertices: path only}', note: 'With 4 or more odd vertices there is no Euler path.' },
  ],
  examples: [
    {
      title: 'Edges from degrees',
      problem: 'A graph has 6 vertices with degrees $4, 3, 3, 2, 2, 2$. How many edges does it have?',
      steps: [
        'Add the degrees: $4 + 3 + 3 + 2 + 2 + 2 = 16$.',
        'By the handshake lemma, the sum of degrees is $2E$, so $2E = 16$.',
        'Halve: $E = \\frac{16}{2} = 8$.',
      ],
      answer: '$8$ edges',
    },
    {
      title: 'A round-robin tournament',
      problem: 'In a chess club every member plays every other member exactly once, and 28 games are played. How many members are there?',
      steps: [
        'Members are vertices and games are edges, and everyone plays everyone, so this is the complete graph $K_n$.',
        '$K_n$ has $\\frac{n(n-1)}{2}$ edges, so $\\frac{n(n-1)}{2} = 28$, which gives $n(n-1) = 56$.',
        'Find two consecutive whole numbers that multiply to 56: $8 \\times 7 = 56$, so $n = 8$.',
        'Check: $\\frac{8 \\times 7}{2} = 28$. Correct.',
      ],
      answer: '$8$ members',
    },
    {
      title: 'Euler path: where must it start?',
      problem: 'A connected graph has the edges A–B, A–C, B–C, B–D, C–D. Can you trace every edge exactly once? If so, where must you start?',
      steps: [
        'Degrees: A: 2 (A–B, A–C); B: 3 (A–B, B–C, B–D); C: 3 (A–C, B–C, C–D); D: 2 (B–D, C–D).',
        'Check with the handshake lemma: $2 + 3 + 3 + 2 = 10 = 2 \\times 5$ edges.',
        'There are exactly 2 odd-degree vertices, B and C, so an Euler path exists but not an Euler circuit.',
        'The path must start at one odd vertex and finish at the other, for example B–A–C–B–D–C.',
      ],
      answer: 'Yes: an Euler path exists; it must start at B and end at C (or the reverse).',
    },
    {
      title: 'Leaves of a tree (simultaneous equations)',
      problem: 'A tree has 8 vertices. Every vertex has degree 1 or 3. How many vertices have degree 1?',
      steps: [
        'Let $L$ be the number of degree-1 vertices and $T$ the number of degree-3 vertices. Counting vertices: $L + T = 8$.',
        'A tree with 8 vertices has $8 - 1 = 7$ edges, so the degrees add to $2 \\times 7 = 14$: $L + 3T = 14$.',
        'Subtract the first equation from the second: $2T = 6$, so $T = 3$.',
        'Then $L = 8 - 3 = 5$. Check: $5 \\times 1 + 3 \\times 3 = 14$. Correct.',
      ],
      answer: '$5$ vertices of degree 1',
    },
  ],
  traps: [
    'Forgetting to **halve** the degree sum. Adding the degrees counts every edge twice; the number of edges is half the total.',
    'Counting the 1s in an undirected adjacency matrix as the number of edges. Each edge appears twice (row A column B and row B column A), so halve the total. For a **directed** graph you do not halve.',
    'Using $n^2$ or $n(n+1)/2$ for the complete graph. Each of the $n$ vertices joins the **other** $n - 1$, and each edge is shared by two vertices: $\\frac{n(n-1)}{2}$.',
    'Writing $E = V$ for a tree. A tree always has one edge **fewer** than vertices; a connected graph with $E = V$ already contains a cycle.',
    'Thinking the shortest path is the one with the fewest edges. In a weighted graph you must add the weights; a route through a cheap extra edge can be shorter.',
    'Mixing up Euler conditions: 0 odd vertices gives a circuit, exactly 2 gives a path that must start and end at the two odd vertices. Remember that 1 is an odd degree too.',
  ],
  examTip:
    'Graph questions on the exam are usually one formula plus careful counting, so they are quick marks.\n\n' +
    '- **Edges from degrees:** add and halve. If an option equals the raw degree sum, it is the "forgot to halve" trap.\n' +
    '- **Is this degree list possible?** First check the sum is even (an even number of odd degrees), then that no degree is bigger than $n - 1$. This usually eliminates three options instantly.\n' +
    '- **Complete graph / tournaments:** use $\\frac{n(n-1)}{2}$. To go backwards from the number of edges, double it and look for two consecutive numbers that multiply to it (e.g. $2 \\times 45 = 90 = 10 \\times 9$). You can also plug each option into the formula with your calculator.\n' +
    '- **Trees:** the words "tree", "no cycles" or "minimum number of connections" mean $E = V - 1$.\n' +
    '- **Adjacency matrix:** row sum = degree; total of entries = $2E$ for undirected graphs.\n' +
    '- **Shortest path:** write the routes in a quick list with totals; do not stop at the route with the fewest roads.\n' +
    '- **Euler:** count odd-degree vertices; the answer is decided by whether there are 0, 2 or more.',
};
