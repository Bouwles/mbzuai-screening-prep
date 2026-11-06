import type { StaticQuestion } from '../../../types';
import { Frac } from '../../../lib/frac';

// ---- small helpers used only by the answer checks (they re-derive answers from the raw sets) ----
const range = (a: number, b: number): number[] => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const key = (xs: Iterable<number>): string => [...xs].sort((p, q) => p - q).join(',');
const union = (a: number[], b: number[]): number[] => [...new Set([...a, ...b])];
const inter = (a: number[], b: number[]): number[] => a.filter((x) => b.includes(x));
const minus = (a: number[], b: number[]): number[] => a.filter((x) => !b.includes(x));
const comp = (u: number[], a: number[]): number[] => minus(u, a);
/** Count the subsets of an n-element set (as bitmasks 0 .. 2^n - 1) that pass a test. */
function countSubsets(n: number, ok: (mask: number) => boolean): number {
  let c = 0;
  for (let mask = 0; mask < 1 << n; mask++) if (ok(mask)) c++;
  return c;
}

export const questions: StaticQuestion[] = [
  // ================================================================ foundation
  {
    id: 'sets-venn-001',
    subtopic: 'sets-venn',
    difficulty: 'foundation',
    stem: 'Let $A = \\{1, 2, 3, 4, 5\\}$ and $B = \\{4, 5, 6, 7\\}$. What is $A \\cap B$?',
    options: ['$\\{1, 2, 3, 4, 5, 6, 7\\}$', '$\\{4, 5\\}$', '$\\{1, 2, 3\\}$', '$\\{6, 7\\}$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The symbol $\\cap$ means **intersection**: the elements that are in $A$ **and** in $B$ at the same time.\n\n' +
        'Go through $A$ one element at a time and ask "is it also in $B$?"\n\n' +
        '- $1$, $2$, $3$: not in $B$\n' +
        '- $4$, $5$: in $B$\n\n' +
        'So $A \\cap B = \\{4, 5\\}$.',
      whyWrong: [
        'This is $A \\cup B$, the **union** (everything in $A$ or $B$). The intersection symbol $\\cap$ asks for elements in both sets only.',
        null,
        'This is $A \\setminus B$, the elements of $A$ that are **not** in $B$. The intersection keeps the shared elements, not the leftovers.',
        'This is $B \\setminus A$, the elements of $B$ that are not in $A$, which is the opposite of what the intersection asks for.',
      ],
      keyIdea: 'Intersection $A \\cap B$ means "in both": keep only the elements the two sets share.',
    },
    check: {
      optionValues: ['1,2,3,4,5,6,7', '4,5', '1,2,3', '6,7'],
      compute: () => key(inter([1, 2, 3, 4, 5], [4, 5, 6, 7])),
    },
  },
  {
    id: 'sets-venn-002',
    subtopic: 'sets-venn',
    difficulty: 'foundation',
    stem: 'How many subsets does the set $\\{a, b, c, d\\}$ have? (Include the empty set and the set itself.)',
    options: ['$8$', '$4$', '$15$', '$16$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Build a subset by deciding, for each element, whether it is **in** or **out**.\n\n' +
        '- $a$: 2 choices (in or out)\n' +
        '- $b$: 2 choices\n' +
        '- $c$: 2 choices\n' +
        '- $d$: 2 choices\n\n' +
        'Multiply the choices: $2 \\times 2 \\times 2 \\times 2 = 2^{4} = 16$.\n\n' +
        'Choosing "out" every time gives the empty set $\\varnothing$, and "in" every time gives $\\{a, b, c, d\\}$ itself; both are counted.',
      whyWrong: [
        'This is $2 \\times 4$: it multiplies the number of elements by 2 instead of raising 2 to the power 4.',
        'This is just the number of **elements** (or the number of one-element subsets). A subset can have 0, 1, 2, 3 or 4 elements.',
        'This is $2^{4} - 1$: it leaves out one subset (the empty set, or the set itself). The question asks for all subsets, so both are included.',
        null,
      ],
      keyIdea: 'A set with $n$ elements has $2^{n}$ subsets, because each element is either in or out.',
    },
    check: { optionValues: [8, 4, 15, 16], compute: () => countSubsets(4, () => true) },
  },
  {
    id: 'sets-venn-003',
    subtopic: 'sets-venn',
    difficulty: 'exam',
    stem: 'The universal set is $U = \\{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\\}$. Let $A = \\{2, 4, 6, 8, 10\\}$ and $B = \\{1, 2, 3, 4\\}$. What is $(A \\cup B)\'$?',
    options: ['$\\{5, 7, 9\\}$', '$\\{1, 3, 5, 6, 7, 8, 9, 10\\}$', '$\\{1, 3, 5, 7, 9\\}$', '$\\{2, 4\\}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Work from the inside of the bracket outwards.\n\n' +
        '1. Union first: $A \\cup B$ is everything in $A$ or $B$ (or both): $\\{1, 2, 3, 4, 6, 8, 10\\}$.\n' +
        '2. The dash $\'$ means **complement**: everything in $U$ that is **not** in the set.\n' +
        '3. From $\\{1, 2, \\dots, 10\\}$ remove $1, 2, 3, 4, 6, 8, 10$. What is left is $5, 7, 9$.\n\n' +
        'So $(A \\cup B)\' = \\{5, 7, 9\\}$: the numbers in neither set.',
      whyWrong: [
        null,
        "This is $(A \\cap B)'$, the complement of the **intersection** $\\{2, 4\\}$. The question takes the complement of the union.",
        "This is $A'$ on its own (the odd numbers). It ignores $B$, so it still contains $1$ and $3$, which are in $B$.",
        'This is $A \\cap B$, the elements in both sets. It does not take a union or a complement at all.',
      ],
      keyIdea: "$(A \\cup B)'$ is the region outside both circles: the elements in neither set.",
    },
    check: {
      optionValues: ['5,7,9', '1,3,5,6,7,8,9,10', '1,3,5,7,9', '2,4'],
      compute: () => key(comp(range(1, 10), union([2, 4, 6, 8, 10], [1, 2, 3, 4]))),
    },
  },
  {
    id: 'sets-venn-004',
    subtopic: 'sets-venn',
    difficulty: 'foundation',
    stem: 'Sets $A$ and $B$ have $n(A) = 20$, $n(B) = 15$ and $n(A \\cap B) = 6$. What is $n(A \\cup B)$?',
    options: ['$35$', '$23$', '$29$', '$41$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Use the **inclusion-exclusion** rule for two sets:\n\n' +
        '$$n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$$\n\n' +
        'Adding $n(A) + n(B)$ counts the 6 shared elements twice, so subtract them once:\n\n' +
        '$$n(A \\cup B) = 20 + 15 - 6 = 29$$',
      whyWrong: [
        'This is $20 + 15$: it forgets that the 6 elements in both sets have been counted twice.',
        'This is $20 + 15 - 2 \\times 6$: it subtracts the overlap twice. The overlap was only counted one extra time, so subtract it once.',
        null,
        'This is $20 + 15 + 6$: it adds the overlap instead of subtracting it.',
      ],
      keyIdea: '$n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$: subtract the overlap once because it was counted twice.',
    },
    check: {
      optionValues: [35, 23, 29, 41],
      // A = {1..20}, B = {15..29} share exactly 6 elements (15..20)
      compute: () => union(range(1, 20), range(15, 29)).length,
    },
  },
  {
    id: 'sets-venn-005',
    subtopic: 'sets-venn',
    difficulty: 'foundation',
    stem: 'Let $A = \\{1, 2, 3\\}$. Which statement is **true**?',
    options: ['$1 \\subseteq A$', '$\\{1\\} \\in A$', '$\\{1\\} \\subseteq A$', '$\\varnothing \\in A$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Two different symbols are being tested:\n\n' +
        '- $\\in$ ("is an element of") links a single **element** to a set: $1 \\in A$.\n' +
        '- $\\subseteq$ ("is a subset of") links a **set** to a set: every element of the left set must be in the right set.\n\n' +
        'Check $\\{1\\} \\subseteq A$: the set $\\{1\\}$ has one element, $1$, and $1$ is in $A$. So it is a subset. **True.**\n\n' +
        'The others are false: $1$ is a number, not a set, so it should be $1 \\in A$; the set $\\{1\\}$ is not one of the listed elements $1, 2, 3$; and $\\varnothing$ is a subset of $A$ but is not listed as an element.',
      whyWrong: [
        'The number $1$ is an **element**, so the correct symbol is $\\in$ (that is, $1 \\in A$). The subset symbol compares two sets.',
        'The elements of $A$ are the numbers $1$, $2$, $3$. The set $\\{1\\}$ is not one of them, so it is a subset of $A$ but not an element.',
        null,
        'The empty set is a **subset** of every set ($\\varnothing \\subseteq A$), but it is not one of the elements listed inside $A$, so $\\varnothing \\in A$ is false.',
      ],
      keyIdea: 'Use $\\in$ for an element belonging to a set, and $\\subseteq$ for a whole set sitting inside another set.',
    },
  },
  {
    id: 'sets-venn-006',
    subtopic: 'sets-venn',
    difficulty: 'foundation',
    stem: 'How many elements are in the set $\\{x \\in \\mathbb{Z} : -2 \\le x \\le 5\\}$? (Here $\\mathbb{Z}$ is the set of integers.)',
    options: ['$8$', '$7$', '$6$', '$5$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Read the set-builder notation: "all integers $x$ such that $x$ is between $-2$ and $5$, **including** both ends" (because of $\\le$).\n\n' +
        'List them: $-2, -1, 0, 1, 2, 3, 4, 5$.\n\n' +
        'Count: $8$ elements. (Shortcut for whole numbers from $a$ to $b$ inclusive: $b - a + 1 = 5 - (-2) + 1 = 8$.)',
      whyWrong: [
        null,
        'This is $5 - (-2) = 7$: subtracting the end points measures the **gap**, and forgets to count one of the end points. Add 1 when both ends are included.',
        'This treats $\\le$ as $<$ and leaves out both $-2$ and $5$. The symbol $\\le$ means the end points are included.',
        'This counts only the positive integers $1$ to $5$, forgetting that $0$, $-1$ and $-2$ are integers too.',
      ],
      keyIdea: 'Set-builder notation describes a rule; list the elements it allows (watch $\\le$ versus $<$) and count them.',
    },
    check: {
      optionValues: [8, 7, 6, 5],
      compute: () => range(-10, 10).filter((x) => Number.isInteger(x) && -2 <= x && x <= 5).length,
    },
  },

  // ================================================================ exam
  {
    id: 'sets-venn-007',
    subtopic: 'sets-venn',
    difficulty: 'exam',
    stem: 'In a class of 40 students, 25 study French, 18 study Spanish and 7 study neither language. How many students study **both** French and Spanish?',
    options: ['$3$', '$10$', '$33$', '$15$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The 7 who study neither are outside both circles, so remove them first. Students who study **at least one** language: $40 - 7 = 33$.\n\n' +
        '1. Inclusion-exclusion: $n(F \\cup S) = n(F) + n(S) - n(F \\cap S)$.\n' +
        '2. Substitute: $33 = 25 + 18 - n(F \\cap S) = 43 - n(F \\cap S)$.\n' +
        '3. So $n(F \\cap S) = 43 - 33 = 10$.\n\n' +
        'Check with a Venn diagram: French only $= 15$, both $= 10$, Spanish only $= 8$, neither $= 7$. Total $15 + 10 + 8 + 7 = 40$.',
      whyWrong: [
        'This is $25 + 18 - 40$: it forgets that 7 students are outside both circles, so only 33 students are inside the circles.',
        null,
        'This is $40 - 7$, the number who study **at least one** language, not the number who study both.',
        'This is French **only** ($25 - 10$). It is one step too far: the question asks for the overlap itself.',
      ],
      keyIdea: 'Remove the "neither" group first, then the overlap is $n(A) + n(B) - n(A \\cup B)$.',
    },
    check: {
      optionValues: [3, 10, 33, 15],
      compute: () => {
        // find the overlap b that makes the four Venn regions add up to the class size
        for (let b = 0; b <= 18; b++) if (25 - b + b + (18 - b) + 7 === 40) return b;
        return -1;
      },
    },
  },
  {
    id: 'sets-venn-008',
    subtopic: 'sets-venn',
    difficulty: 'foundation',
    stem: 'Let $A = \\{2, 3, 5, 7, 11\\}$ and $B = \\{1, 3, 5, 7, 9\\}$. What is the set difference $A \\setminus B$ (also written $A - B$)?',
    options: ['$\\{1, 9\\}$', '$\\{3, 5, 7\\}$', '$\\{2, 11\\}$', '$\\{1, 2, 9, 11\\}$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '$A \\setminus B$ means "in $A$ but **not** in $B$". Start with $A$ and cross out anything that is also in $B$.\n\n' +
        '- $2$: not in $B$, keep\n' +
        '- $3$, $5$, $7$: in $B$, cross out\n' +
        '- $11$: not in $B$, keep\n\n' +
        'So $A \\setminus B = \\{2, 11\\}$.',
      whyWrong: [
        'This is $B \\setminus A$ (in $B$ but not in $A$). Order matters for set difference: $A \\setminus B$ starts from $A$.',
        'This is $A \\cap B$, the elements the sets share. Set difference removes exactly these elements.',
        null,
        'This is the **symmetric difference** (in exactly one of the two sets), which combines $A \\setminus B$ and $B \\setminus A$.',
      ],
      keyIdea: '$A \\setminus B$ keeps the elements of $A$ that are not in $B$; it is not the same as $B \\setminus A$.',
    },
    check: {
      optionValues: ['1,9', '3,5,7', '2,11', '1,2,9,11'],
      compute: () => key(minus([2, 3, 5, 7, 11], [1, 3, 5, 7, 9])),
    },
  },
  {
    id: 'sets-venn-009',
    subtopic: 'sets-venn',
    difficulty: 'exam',
    stem: 'A set $S$ has 5 elements. How many subsets of $S$ are **non-empty proper** subsets (that is, neither $\\varnothing$ nor $S$ itself)?',
    options: ['$32$', '$31$', '$25$', '$30$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '1. Total number of subsets of a 5-element set: $2^{5} = 32$.\n' +
        '2. A **proper** subset is any subset except $S$ itself: remove 1.\n' +
        '3. **Non-empty** also removes $\\varnothing$: remove 1 more.\n\n' +
        'So the count is $32 - 2 = 30$.',
      whyWrong: [
        'This is $2^{5}$, the number of **all** subsets. It still includes $\\varnothing$ and $S$, which the question excludes.',
        'This is $2^{5} - 1$: it removes only one of the two excluded subsets ($\\varnothing$ or $S$), but both must go.',
        'This is $5^{2}$: the base and the power are swapped. The number of subsets is $2^{n}$, not $n^{2}$.',
        null,
      ],
      keyIdea: 'Start from $2^{n}$ subsets, then subtract 1 for each of $\\varnothing$ and the whole set that you must exclude.',
    },
    check: { optionValues: [32, 31, 25, 30], compute: () => countSubsets(5, (mask) => mask !== 0 && mask !== (1 << 5) - 1) },
  },
  {
    id: 'sets-venn-010',
    subtopic: 'sets-venn',
    difficulty: 'exam',
    stem: 'The table gives counts for 100 people; each pair count includes those who like all three. How many people like **none** of the three drinks?',
    table: {
      headers: ['Likes', 'People'],
      rows: [
        ['Tea', 45],
        ['Coffee', 50],
        ['Juice', 35],
        ['Tea and coffee', 15],
        ['Tea and juice', 10],
        ['Coffee and juice', 12],
        ['All three', 5],
      ],
    },
    options: ['$7$', '$2$', '$98$', '$12$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Use inclusion-exclusion for three sets:\n\n' +
        '$$n(T \\cup C \\cup J) = n(T) + n(C) + n(J) - n(T \\cap C) - n(T \\cap J) - n(C \\cap J) + n(T \\cap C \\cap J)$$\n\n' +
        '1. Add the singles: $45 + 50 + 35 = 130$.\n' +
        '2. Subtract the pairs: $15 + 10 + 12 = 37$, so $130 - 37 = 93$.\n' +
        '3. Add back the triple: $93 + 5 = 98$ like at least one drink.\n' +
        '4. None: $100 - 98 = 2$.\n\n' +
        'Why add back the 5? They were added 3 times in step 1 and subtracted 3 times in step 2, so at that point they were not counted at all.',
      whyWrong: [
        'This forgets to add back the 5 people who like all three: $130 - 37 = 93$, then $100 - 93 = 7$.',
        null,
        'This is the number who like **at least one** drink. The question asks for the people outside all three circles.',
        'This subtracts the triple instead of adding it back: $130 - 37 - 5 = 88$, then $100 - 88 = 12$.',
      ],
      keyIdea: 'Three-set inclusion-exclusion: add the singles, subtract the pairs, add back the triple.',
    },
    check: {
      optionValues: [7, 2, 98, 12],
      compute: () => {
        // rebuild the seven Venn regions from the data, then count what is left of the 100
        const all3 = 5;
        const tc = 15 - all3;
        const tj = 10 - all3;
        const cj = 12 - all3;
        const tOnly = 45 - tc - tj - all3;
        const cOnly = 50 - tc - cj - all3;
        const jOnly = 35 - tj - cj - all3;
        return 100 - (tOnly + cOnly + jOnly + tc + tj + cj + all3);
      },
    },
  },
  {
    id: 'sets-venn-011',
    subtopic: 'sets-venn',
    difficulty: 'exam',
    stem: 'In a group of people, 30 own a cat, 25 own a dog and 8 own both a cat and a dog. How many people own **exactly one** of these two pets?',
    options: ['$47$', '$55$', '$39$', '$22$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Fill in the Venn diagram from the middle outwards.\n\n' +
        '1. Both: $8$.\n' +
        '2. Cat only: $30 - 8 = 22$.\n' +
        '3. Dog only: $25 - 8 = 17$.\n' +
        '4. Exactly one pet: cat only + dog only $= 22 + 17 = 39$.\n\n' +
        'Equivalent formula: $n(A) + n(B) - 2\\,n(A \\cap B) = 30 + 25 - 16 = 39$.',
      whyWrong: [
        'This is $30 + 25 - 8 = n(A \\cup B)$, the number who own **at least one** pet. It still includes the 8 who own both.',
        'This is $30 + 25$, which counts the 8 owners of both pets twice and does not remove them at all.',
        null,
        'This is cat owners **only**. It forgets to add the 17 who own a dog only.',
      ],
      keyIdea: '"Exactly one" means the two crescent-shaped regions: $n(A \\text{ only}) + n(B \\text{ only})$.',
    },
    check: {
      optionValues: [47, 55, 39, 22],
      compute: () => {
        const cats = range(1, 30);
        const dogs = range(23, 47); // 25 dog owners, 8 of them (23..30) also own a cat
        return minus(cats, dogs).length + minus(dogs, cats).length;
      },
    },
  },
  {
    id: 'sets-venn-012',
    subtopic: 'sets-venn',
    difficulty: 'exam',
    stem: 'In a class of 30 students, 18 play football, 12 play basketball and 5 play both. A student is chosen at random. What is the probability that the student plays **neither** sport?',
    options: ['$0$', '$\\frac{1}{3}$', '$\\frac{5}{6}$', '$\\frac{1}{6}$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '1. Students who play at least one sport: $n(F \\cup B) = 18 + 12 - 5 = 25$.\n' +
        '2. Students who play neither: $30 - 25 = 5$.\n' +
        '3. Probability: $\\frac{5}{30} = \\frac{1}{6}$.',
      whyWrong: [
        'This uses $18 + 12 = 30$ and concludes everybody plays a sport. It forgets that the 5 who play both were counted twice.',
        'This subtracts the overlap twice: $18 + 12 - 10 = 20$, giving $\\frac{10}{30} = \\frac{1}{3}$.',
        'This is $\\frac{25}{30}$, the probability of playing **at least one** sport, the complement of what was asked.',
        null,
      ],
      keyIdea: 'Find the "neither" region with inclusion-exclusion, then divide by the total.',
    },
    check: {
      optionValues: [0, 1 / 3, 5 / 6, 1 / 6],
      compute: () => {
        const football = range(1, 18);
        const basketball = range(14, 25); // 12 players, 5 of them (14..18) also play football
        const neither = comp(range(1, 30), union(football, basketball)).length;
        return new Frac(neither, 30).value();
      },
    },
  },
  {
    id: 'sets-venn-013',
    subtopic: 'sets-venn',
    difficulty: 'exam',
    stem: 'Which expression describes the elements that are in $A$ or in $B$, but **not in both**?',
    options: ['$A \\cup B$', "$(A \\cap B)'$", '$(A \\cup B) \\setminus (A \\cap B)$', "$A' \\cap B'$"],
    correctIndex: 2,
    markScheme: {
      solution:
        '"In $A$ or $B$" is the union $A \\cup B$. "But not in both" means we must remove the overlap $A \\cap B$.\n\n' +
        'So the set is $(A \\cup B) \\setminus (A \\cap B)$ (called the **symmetric difference**).\n\n' +
        'Test with an example: $U = \\{1, \\dots, 8\\}$, $A = \\{1, 2, 3, 4\\}$, $B = \\{3, 4, 5, 6\\}$.\n\n' +
        '- $(A \\cup B) \\setminus (A \\cap B) = \\{1, 2, 3, 4, 5, 6\\} \\setminus \\{3, 4\\} = \\{1, 2, 5, 6\\}$: exactly the elements in one set only.\n' +
        "- $A \\cup B = \\{1, 2, 3, 4, 5, 6\\}$ still contains $3, 4$; $(A \\cap B)' = \\{1, 2, 5, 6, 7, 8\\}$ wrongly adds $7, 8$; $A' \\cap B' = \\{7, 8\\}$ is the outside region.",
      whyWrong: [
        'The union includes the overlap $A \\cap B$, so it contains the elements that are in both sets.',
        "This is everything outside the overlap, which also includes the elements in **neither** set (the region outside both circles).",
        null,
        "This is the region outside both circles (in neither set). By De Morgan's law it equals $(A \\cup B)'$.",
      ],
      keyIdea: '"Or but not both" is the union with the intersection removed: $(A \\cup B) \\setminus (A \\cap B)$.',
    },
    check: {
      // evaluate each option on U = {1..8}, A = {1,2,3,4}, B = {3,4,5,6}
      optionValues: ['1,2,3,4,5,6', '1,2,5,6,7,8', '1,2,5,6', '7,8'],
      compute: () => {
        const U = range(1, 8);
        const A = [1, 2, 3, 4];
        const B = [3, 4, 5, 6];
        return key(U.filter((x) => A.includes(x) !== B.includes(x)));
      },
    },
  },
  {
    id: 'sets-venn-014',
    subtopic: 'sets-venn',
    difficulty: 'exam',
    stem: 'A Venn diagram shows three sets $A$, $B$ and $C$ inside a universal set $U$. The table gives the number of elements in each region. What is $n\\big((A \\cup B) \\cap C\'\\big)$?',
    table: {
      headers: ['Region', 'Number of elements'],
      rows: [
        ['In $A$ only', 8],
        ['In $B$ only', 6],
        ['In $C$ only', 5],
        ['In $A$ and $B$ only (not $C$)', 4],
        ['In $A$ and $C$ only (not $B$)', 3],
        ['In $B$ and $C$ only (not $A$)', 2],
        ['In all three', 1],
        ['In none of the three', 7],
      ],
    },
    options: ['$24$', '$18$', '$25$', '$14$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'We need the regions that are in $A$ or $B$ (or both) **and** outside $C$.\n\n' +
        '1. Regions inside $A \\cup B$: $A$ only, $B$ only, $A$ and $B$ only, $A$ and $C$ only, $B$ and $C$ only, all three.\n' +
        '2. Keep only those that are **not** in $C$: $A$ only ($8$), $B$ only ($6$), $A$ and $B$ only ($4$).\n' +
        '3. Add: $8 + 6 + 4 = 18$.',
      whyWrong: [
        'This is $n(A \\cup B) = 8 + 6 + 4 + 3 + 2 + 1 = 24$. It forgets the condition "not in $C$", so it includes the regions that overlap $C$.',
        null,
        "This is $n(C') = 8 + 6 + 4 + 7 = 25$. It includes the 7 elements outside all circles, which are not in $A \\cup B$.",
        'This adds only $A$ only and $B$ only ($8 + 6$). The $A$ and $B$ only region (4 elements) is also outside $C$ and must be included.',
      ],
      keyIdea: 'For a region expression, decide for each of the 8 regions whether it satisfies every condition, then add those regions.',
    },
    check: {
      optionValues: [24, 18, 25, 14],
      compute: () => {
        // [inA, inB, inC, count] for every region of the diagram
        const regions: [boolean, boolean, boolean, number][] = [
          [true, false, false, 8],
          [false, true, false, 6],
          [false, false, true, 5],
          [true, true, false, 4],
          [true, false, true, 3],
          [false, true, true, 2],
          [true, true, true, 1],
          [false, false, false, 7],
        ];
        return regions.filter(([a, b, c]) => (a || b) && !c).reduce((s, r) => s + r[3], 0);
      },
    },
  },
  {
    id: 'sets-venn-015',
    subtopic: 'sets-venn',
    difficulty: 'exam',
    stem: "In a universal set $U$ with $n(U) = 50$, sets $A$ and $B$ have $n(A) = 20$, $n(B) = 25$ and $n(A \\cap B) = 8$. What is $n(A' \\cap B')$?",
    options: ['$13$', '$5$', '$42$', '$37$'],
    correctIndex: 0,
    markScheme: {
      solution:
        "$A' \\cap B'$ means \"not in $A$ **and** not in $B$\", which is the region outside both circles. By De Morgan's law, $A' \\cap B' = (A \\cup B)'$.\n\n" +
        '1. $n(A \\cup B) = 20 + 25 - 8 = 37$.\n' +
        "2. $n(A' \\cap B') = n(U) - n(A \\cup B) = 50 - 37 = 13$.",
      whyWrong: [
        null,
        'This is $50 - (20 + 25)$: it forgets to subtract the overlap when finding $n(A \\cup B)$, so the 8 shared elements are removed twice.',
        "This is $50 - 8 = n\\big((A \\cap B)'\\big)$, which equals $A' \\cup B'$. De Morgan's law pairs $A' \\cap B'$ with the complement of the **union**, not the intersection.",
        "This is $n(A \\cup B)$. It forgets the final step of taking the complement.",
      ],
      keyIdea: "De Morgan: $A' \\cap B' = (A \\cup B)'$, so subtract $n(A \\cup B)$ from $n(U)$.",
    },
    check: {
      optionValues: [13, 5, 42, 37],
      compute: () => {
        const U = range(1, 50);
        const A = range(1, 20);
        const B = range(13, 37); // 25 elements, 8 of them (13..20) shared with A
        return inter(comp(U, A), comp(U, B)).length;
      },
    },
  },
  {
    id: 'sets-venn-016',
    subtopic: 'sets-venn',
    difficulty: 'exam',
    stem: 'Sets $A$ and $B$ satisfy $A \\subseteq B$, and $B$ has at least one element that is not in $A$. Which statement is **always** true?',
    options: ['$A \\cup B = A$', '$A \\cap B = A$', '$B \\setminus A = \\varnothing$', "$A' \\subseteq B'$"],
    correctIndex: 1,
    markScheme: {
      solution:
        '$A \\subseteq B$ means every element of $A$ is also in $B$: the circle for $A$ sits **inside** the circle for $B$.\n\n' +
        '- $A \\cap B$: the elements in both. Every element of $A$ is in $B$, so the overlap is all of $A$. $A \\cap B = A$ is **true**.\n\n' +
        'Test the others with $A = \\{1\\}$, $B = \\{1, 2\\}$, $U = \\{1, 2, 3\\}$:\n\n' +
        '- $A \\cup B = \\{1, 2\\} = B$, not $A$.\n' +
        '- $B \\setminus A = \\{2\\}$, not empty.\n' +
        "- $A' = \\{2, 3\\}$ and $B' = \\{3\\}$, so $A'$ is **not** a subset of $B'$ (it is the other way round: $B' \\subseteq A'$).",
      whyWrong: [
        'When $A$ sits inside $B$, the union is the bigger set: $A \\cup B = B$. It equals $A$ only if the two sets are equal, which the question rules out.',
        null,
        '$B \\setminus A$ is the part of $B$ outside $A$. The question says $B$ has an element not in $A$, so this is not empty.',
        "Taking complements reverses a subset relation: $A \\subseteq B$ gives $B' \\subseteq A'$, not $A' \\subseteq B'$.",
      ],
      keyIdea: 'If $A \\subseteq B$ then $A \\cap B = A$ and $A \\cup B = B$; complements reverse the inclusion.',
    },
  },
  {
    id: 'sets-venn-017',
    subtopic: 'sets-venn',
    difficulty: 'exam',
    stem: 'Let $A = \\{1, 2, 3, 4\\}$ and $B = \\{3, 4, 5, 6\\}$. What is the **symmetric difference** $(A \\cup B) \\setminus (A \\cap B)$?',
    options: ['$\\{3, 4\\}$', '$\\{1, 2, 5, 6\\}$', '$\\{1, 2, 3, 4, 5, 6\\}$', '$\\{1, 2\\}$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The **symmetric difference** is the set of elements in exactly one of the two sets.\n\n' +
        '1. Union: $A \\cup B = \\{1, 2, 3, 4, 5, 6\\}$.\n' +
        '2. Intersection: $A \\cap B = \\{3, 4\\}$.\n' +
        '3. Remove the intersection from the union: $\\{1, 2, 5, 6\\}$.',
      whyWrong: [
        'This is $A \\cap B$, the part that has to be removed, not what is left after removing it.',
        null,
        'This is $A \\cup B$: it forgets to remove the elements 3 and 4 that are in both sets.',
        'This is $A \\setminus B$ only. The elements 5 and 6 are in exactly one set too, so they also belong.',
      ],
      keyIdea: 'The symmetric difference keeps the elements that are in exactly one of the two sets.',
    },
    check: {
      optionValues: ['3,4', '1,2,5,6', '1,2,3,4,5,6', '1,2'],
      compute: () => {
        const A = [1, 2, 3, 4];
        const B = [3, 4, 5, 6];
        return key(minus(union(A, B), inter(A, B)));
      },
    },
  },
  {
    id: 'sets-venn-020',
    subtopic: 'sets-venn',
    difficulty: 'exam',
    stem: 'In a universal set with $n(U) = 30$, sets $A$ and $B$ satisfy $n(A) = 3x$, $n(B) = 2x + 2$ and $n(A \\cap B) = x$. There are 8 elements in neither $A$ nor $B$. How many elements are in $B$ **only**?',
    options: ['$7$', '$6$', '$9$', '$12$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Fill the four regions in terms of $x$:\n\n' +
        '- $A$ only: $3x - x = 2x$\n' +
        '- both: $x$\n' +
        '- $B$ only: $(2x + 2) - x = x + 2$\n' +
        '- neither: $8$\n\n' +
        'The regions add up to $n(U)$:\n\n' +
        '$$2x + x + (x + 2) + 8 = 30$$\n\n' +
        '$4x + 10 = 30$, so $4x = 20$ and $x = 5$.\n\n' +
        '$B$ only $= x + 2 = 7$. (Check: $10 + 5 + 7 + 8 = 30$.)',
      whyWrong: [
        null,
        'This comes from $3x + (2x + 2) + 8 = 30$, which forgets to subtract the overlap $x$. That gives $x = 4$ and $B$ only $= 6$.',
        'This forgets the 8 elements outside both sets: $4x + 2 = 30$ gives $x = 7$ and $B$ only $= 9$.',
        'This is the whole of set $B$ ($2x + 2 = 12$ with the correct $x = 5$), but it forgets to remove the $x$ elements that are also in $A$.',
      ],
      keyIdea: 'Write every region in terms of $x$, make the regions add up to $n(U)$, solve, then read off the region asked for.',
    },
    check: {
      optionValues: [7, 6, 9, 12],
      compute: () => {
        for (let x = 0; x <= 30; x++) if (3 * x - x + x + (2 * x + 2 - x) + 8 === 30) return 2 * x + 2 - x;
        return -1;
      },
    },
  },
  {
    id: 'sets-venn-021',
    subtopic: 'sets-venn',
    difficulty: 'exam',
    stem: 'How many subsets of $\\{1, 2, 3, \\dots, 10\\}$ contain **at least one** odd number?',
    options: ['$1023$', '$31$', '$32$', '$992$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Use the complement: count the subsets with **no** odd number and subtract from the total.\n\n' +
        '1. All subsets of a 10-element set: $2^{10} = 1024$.\n' +
        '2. Subsets with no odd number use only the evens $\\{2, 4, 6, 8, 10\\}$: $2^{5} = 32$ of them (this includes $\\varnothing$).\n' +
        '3. At least one odd: $1024 - 32 = 992$.',
      whyWrong: [
        'This is $2^{10} - 1$: it removes only the empty set. But subsets such as $\\{2, 4\\}$ are non-empty and still contain no odd number.',
        'This is $2^{5} - 1$, the non-empty subsets of the **odd** numbers only. It forgets that any even numbers can be added freely, which multiplies the count by $2^{5}$.',
        'This is $2^{5}$, the number of subsets with **no** odd number. It is the complement; it must be subtracted from $1024$.',
        null,
      ],
      keyIdea: '"At least one" is easiest by complement: total subsets minus the subsets with none.',
    },
    check: {
      optionValues: [1023, 31, 32, 992],
      compute: () => {
        // bit i stands for the number i + 1; odd numbers are at even bit positions
        const oddMask = [0, 2, 4, 6, 8].reduce((s, i) => s | (1 << i), 0);
        return countSubsets(10, (mask) => (mask & oddMask) !== 0);
      },
    },
  },
  {
    id: 'sets-venn-023',
    subtopic: 'sets-venn',
    difficulty: 'foundation',
    stem: 'What is the **cardinality** of the set $\\{2, 4, 6, 8, 10\\}$?',
    options: ['$5$', '$10$', '$30$', '$2$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The **cardinality** of a set, written $n(A)$ or $|A|$, is the number of elements it contains.\n\n' +
        'This set lists the elements $2, 4, 6, 8, 10$, so its cardinality is $5$.',
      whyWrong: [
        null,
        'This is the largest element. Cardinality counts the elements; it does not depend on how big they are.',
        'This is the sum of the elements. Cardinality counts them instead of adding them.',
        'This is the smallest element (and the gap between neighbouring elements), not the number of elements.',
      ],
      keyIdea: 'Cardinality means the number of elements in a set.',
    },
    check: { optionValues: [5, 10, 30, 2], compute: () => new Set([2, 4, 6, 8, 10]).size },
  },
  {
    id: 'sets-venn-024',
    subtopic: 'sets-venn',
    difficulty: 'foundation',
    stem: 'Sets $A$ and $B$ are called **disjoint** when:',
    options: ['$A \\cap B = \\varnothing$', '$A \\cup B = U$', '$A \\subseteq B$', '$A = B$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Disjoint** sets have no elements in common, so their intersection is the empty set: $A \\cap B = \\varnothing$.\n\n' +
        'On a Venn diagram the two circles do not overlap.',
      whyWrong: [
        null,
        'This says that together the sets cover the whole universal set. It says nothing about whether they overlap.',
        'This says $A$ sits inside $B$, so (unless $A$ is empty) they do share elements.',
        'Equal sets share every element, which is the opposite of disjoint (unless both are empty).',
      ],
      keyIdea: 'Disjoint means no overlap: $A \\cap B = \\varnothing$.',
    },
  },
  {
    id: 'sets-venn-025',
    subtopic: 'sets-venn',
    difficulty: 'foundation',
    stem: "The complement $A'$ of a set $A$ contains the elements that are:",
    options: ['in $U$ but not in $A$', 'in $A$ but not in $U$', 'in both $A$ and $U$', 'in neither $A$ nor $U$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The **complement** $A\'$ is everything in the universal set $U$ that is not in $A$.\n\n' +
        'On a Venn diagram it is the part of the rectangle outside the circle for $A$.',
      whyWrong: [
        null,
        'Every element of $A$ is already in $U$, so this set is empty. The order is the wrong way round.',
        'Every element of $A$ is in $U$, so this is just $A$ itself, the opposite of the complement.',
        '$U$ contains everything being talked about, so nothing in the question lies outside it.',
      ],
      keyIdea: "$A'$ means in the universal set but not in $A$.",
    },
  },
  {
    id: 'sets-venn-026',
    subtopic: 'sets-venn',
    difficulty: 'foundation',
    stem: 'The empty set $\\varnothing$ is a subset of:',
    options: ['every set', 'only itself', 'no set', 'only infinite sets'],
    correctIndex: 0,
    markScheme: {
      solution:
        '$X \\subseteq Y$ means every element of $X$ is in $Y$. The empty set has no elements, so there is nothing that could fail this test.\n\n' +
        'So $\\varnothing \\subseteq A$ for every set $A$.',
      whyWrong: [
        null,
        'It is a subset of itself, but the same reasoning works for any other set as well.',
        'Having no elements does not stop it being a subset: no element of it is missing from the other set.',
        'The size of the other set makes no difference, so finite sets count too.',
      ],
      keyIdea: 'The empty set is a subset of every set.',
    },
  },
];
