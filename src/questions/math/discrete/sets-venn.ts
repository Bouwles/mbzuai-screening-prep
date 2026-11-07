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
      asking: 'Which numbers are in both $A$ and $B$?',
      solution:
        'The symbol $\\cap$ means **intersection**: the items that are in the first set and also in the second set.\n\n' +
        'Go through $A$ one number at a time and ask whether it is also in $B = \\{4, 5, 6, 7\\}$:\n\n| In $A$ | Also in $B$? |\n|---|---|\n| 1 | No |\n| 2 | No |\n| 3 | No |\n| 4 | Yes |\n| 5 | Yes |\n\n' +
        'Keep only the rows that say yes. That leaves 4 and 5.',
      conclusion: '4 and 5 are the only numbers found in both sets, so the intersection is $\\{4, 5\\}$.',
      whyWrong: [
        'This is $A \\cup B$, the **union** (everything in $A$ or $B$). The intersection symbol $\\cap$ asks for elements in both sets only.',
        null,
        'This is $A \\setminus B$, the elements of $A$ that are **not** in $B$. The intersection keeps the shared elements, not the leftovers.',
        'This is $B \\setminus A$, the elements of $B$ that are not in $A$, which is the opposite of what the intersection asks for.',
      ],
      keyIdea: 'For $\\cap$, keep what is in both sets (think "and"). For $\\cup$, keep what is in either set (think "or"). Go through the first set and test each item against the second.',
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
      asking: 'How many different selections can be made from the four letters, including no letters and all of them?',
      solution:
        'A **subset** is any selection of items from a set. It can use all of them, some of them or none of them. For example, $\\{a, c\\}$ is one subset.\n\n' +
        'Build a subset by making one decision per letter: is it in, or is it out? So each letter has 2 choices.\n\n' +
        'Each pattern of in and out gives a different subset. All out gives the empty set, and all in gives the whole set, so both get counted.\n\n' +
        'The four decisions are separate, so multiply the choices: $2 \\times 2 \\times 2 \\times 2 = 2^4 = 16$.',
      conclusion: 'Four letters with 2 choices each give $2^4$ subsets, so the answer is $16$.',
      whyWrong: [
        'This is $2 \\times 4$: it multiplies the number of elements by 2 instead of raising 2 to the power 4.',
        'This is just the number of **elements** (or the number of one-element subsets). A subset can have 0, 1, 2, 3 or 4 elements.',
        'This is $2^{4} - 1$: it leaves out one subset (the empty set, or the set itself). The question asks for all subsets, so both are included.',
        null,
      ],
      keyIdea: 'A set with $n$ elements has $2^n$ subsets, because each element is either in or out. Start from this whenever a question asks how many subsets, then remove any the question excludes.',
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
      asking: 'Which numbers from 1 to 10 are in neither $A$ nor $B$?',
      solution:
        'Work from the inside of the bracket outwards. $A \\cup B$ is the **union**: everything that is in $A$ or in $B$ or in both.\n\n' +
        'Combine the two lists, writing each number once: $A \\cup B = \\{1, 2, 3, 4, 6, 8, 10\\}$.\n\n' +
        'The dash in $(A \\cup B)\'$ means **complement**: everything in the universal set that is not inside the bracket. The universal set $U$ is the full list of numbers we are allowed to use, here 1 to 10.\n\n' +
        'Cross the numbers from the union off the list 1 to 10. The numbers left are 5, 7 and 9.',
      conclusion: '5, 7 and 9 are the only numbers of $U$ outside both sets, so the complement is $\\{5, 7, 9\\}$.',
      whyWrong: [
        null,
        "This is $(A \\cap B)'$, the complement of the **intersection** $\\{2, 4\\}$. The question takes the complement of the union.",
        "This is $A'$ on its own (the odd numbers). It ignores $B$, so it still contains $1$ and $3$, which are in $B$.",
        'This is $A \\cap B$, the elements in both sets. It does not take a union or a complement at all.',
      ],
      keyIdea: 'Work out the bracket first, then apply the dash. Write out $U$ in full and cross off everything in the bracket. What remains is the complement.',
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
      asking: 'How many items are in $A$ or $B$ or both?',
      solution:
        '$n(A)$ means the number of items in set $A$. So $A$ has 20 items and $B$ has 15. $n(A \\cap B) = 6$ means 6 items are in both.\n\n' +
        'If we just add $20 + 15 = 35$, those 6 shared items have been counted twice: once in $A$ and once in $B$.\n\n' +
        'We want each item counted once, so we take off one copy of the overlap. This gives the formula $n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$.\n\n' +
        'Substitute the numbers: $n(A \\cup B) = 20 + 15 - 6 = 29$.',
      conclusion: 'Adding the two sets counts the 6 shared items twice, and removing one copy of them gives $29$.',
      whyWrong: [
        'This is $20 + 15$: it forgets that the 6 elements in both sets have been counted twice.',
        'This is $20 + 15 - 2 \\times 6$: it subtracts the overlap twice. The overlap was only counted one extra time, so subtract it once.',
        null,
        'This is $20 + 15 + 6$: it adds the overlap instead of subtracting it.',
      ],
      keyIdea: 'For two overlapping sets use $n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$. Any three of these numbers give you the fourth. Spot it from the words "or" and "at least one", or from a given overlap.',
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
      asking: 'Which statement uses the set symbols correctly for $A = \\{1, 2, 3\\}$?',
      solution:
        'The two symbols compare different things. $\\in$ means "is an element of": one item listed inside the set. $\\subseteq$ means "is a subset of": a whole set, all of whose items are in the other set.\n\n' +
        'The items listed inside $A$ are the numbers 1, 2 and 3. So $1 \\in A$ is the right way to talk about the number 1. The curly brackets in $\\{1\\}$ make it a set, and that set is not one of the three listed items.\n\n' +
        'A set is compared using $\\subseteq$. The only item of $\\{1\\}$ is 1, and 1 is in $A$, so $\\{1\\} \\subseteq A$ holds.',
      conclusion: 'A set on the left needs $\\subseteq$, and every item of $\\{1\\}$ is in $A$, so the true statement is $\\{1\\} \\subseteq A$.',
      whyWrong: [
        'The number $1$ is an **element**, so the correct symbol is $\\in$ (that is, $1 \\in A$). The subset symbol compares two sets.',
        'The elements of $A$ are the numbers $1$, $2$, $3$. The set $\\{1\\}$ is not one of them, so it is a subset of $A$ but not an element.',
        null,
        'The empty set is a **subset** of every set ($\\varnothing \\subseteq A$), but it is not one of the elements listed inside $A$, so $\\varnothing \\in A$ is false.',
      ],
      keyIdea: 'Look at the left side. A single item goes with $\\in$, and a set in curly brackets goes with $\\subseteq$, unless that set is itself listed as an item. Then test it: is the item listed, or is every item of the set in the other set?',
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
      asking: 'How many whole numbers lie from $-2$ up to $5$, counting both ends?',
      solution:
        'Read the notation. $x \\in \\mathbb{Z}$ means $x$ is an integer: a whole number, which can be negative or zero. The colon means "such that".\n\n' +
        '$-2 \\le x \\le 5$ means $x$ is at least $-2$ and at most 5. The two ends themselves are allowed, because the symbol is $\\le$ and not $<$.\n\n' +
        'List every integer in that range: $-2, -1, 0, 1, 2, 3, 4, 5$. Counting along the list gives 8 numbers.',
      conclusion: 'The list runs from $-2$ to 5 and has eight numbers in it, so the set has $8$ elements.',
      whyWrong: [
        null,
        'This is $5 - (-2) = 7$: subtracting the end points measures the **gap**, and forgets to count one of the end points. Add 1 when both ends are included.',
        'This treats $\\le$ as $<$ and leaves out both $-2$ and $5$. The symbol $\\le$ means the end points are included.',
        'This counts only the positive integers $1$ to $5$, forgetting that $0$, $-1$ and $-2$ are integers too.',
      ],
      keyIdea: 'To count whole numbers between two ends, with both included, use: largest $-$ smallest $+ 1$. Here that is $5 - (-2) + 1 = 8$. If a sign is $<$, leave that end out.',
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
      asking: 'How many students are in the overlap, studying both languages?',
      solution:
        'Picture two overlapping circles, one for French and one for Spanish. The 7 students who study neither sit outside both circles.\n\n' +
        'So the number of students inside the circles is $40 - 7 = 33$. These 33 study at least one language.\n\n' +
        'Now add the two circle totals: $25 + 18 = 43$. That is more than 33, because anyone who studies both was counted once in each circle.\n\n' +
        'The extra above 33 must be exactly the students who were counted twice: $43 - 33 = 10$.',
      conclusion: 'Only 33 students are inside the circles but the totals add up to 43, so the overlap is $10$.',
      whyWrong: [
        'This is $25 + 18 - 40$: it forgets that 7 students are outside both circles, so only 33 students are inside the circles.',
        null,
        'This is $40 - 7$, the number who study **at least one** language, not the number who study both.',
        'This is French **only** ($25 - 10$). It is one step too far: the question asks for the overlap itself.',
      ],
      keyIdea: 'Remove the "neither" group from the total first. Then overlap $=$ first group $+$ second group $-$ number inside the circles. When two groups add up to more than the people available, the extra is the overlap.',
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
      asking: 'Which numbers are in $A$ but not in $B$?',
      solution:
        '$A \\setminus B$ means: start with $A$, then remove anything that is also in $B$. The order matters, so we start from $A$.\n\n' +
        'Check each number of $A$ against $B = \\{1, 3, 5, 7, 9\\}$:\n\n| In $A$ | In $B$ as well? | Keep it? |\n|---|---|---|\n| 2 | No | Yes |\n| 3 | Yes | No |\n| 5 | Yes | No |\n| 7 | Yes | No |\n| 11 | No | Yes |\n\n' +
        'The numbers we keep are 2 and 11.',
      conclusion: 'Removing 3, 5 and 7 from $A$ leaves 2 and 11, so the set difference is $\\{2, 11\\}$.',
      whyWrong: [
        'This is $B \\setminus A$ (in $B$ but not in $A$). Order matters for set difference: $A \\setminus B$ starts from $A$.',
        'This is $A \\cap B$, the elements the sets share. Set difference removes exactly these elements.',
        null,
        'This is the **symmetric difference** (in exactly one of the two sets), which combines $A \\setminus B$ and $B \\setminus A$.',
      ],
      keyIdea: 'For $A \\setminus B$, start from the first set and delete everything that also appears in the second. Nothing from the second set is ever added. Swapping the order gives a different answer.',
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
      asking: 'How many subsets are left once we rule out the empty set and the whole set?',
      solution:
        'A **subset** is any selection of elements from a set. Each of the 5 elements is either in a subset or out of it, which is 2 choices per element. So the total number of subsets is $2^5 = 2 \\times 2 \\times 2 \\times 2 \\times 2 = 32$.\n\n' +
        '"Non-empty" rules out $\\varnothing$, the empty set, which is the subset with nothing in it. That is 1 subset.\n\n' +
        '"Proper" rules out $S$ itself, the subset with everything in it. That is 1 more subset.\n\n' +
        'Take both away: $32 - 1 - 1 = 30$.',
      conclusion: 'There are 32 subsets in all and 2 of them are excluded, so the answer is $30$.',
      whyWrong: [
        'This is $2^{5}$, the number of **all** subsets. It still includes $\\varnothing$ and $S$, which the question excludes.',
        'This is $2^{5} - 1$: it removes only one of the two excluded subsets ($\\varnothing$ or $S$), but both must go.',
        'This is $5^{2}$: the base and the power are swapped. The number of subsets is $2^{n}$, not $n^{2}$.',
        null,
      ],
      keyIdea: 'Start from $2^n$ subsets, then subtract 1 for each special subset the question excludes. "Non-empty" removes $\\varnothing$, and "proper" removes the whole set.',
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
      asking: 'How many of the 100 people are outside all three drink groups?',
      solution:
        'Use **inclusion-exclusion**: a way to count people in overlapping groups without counting anyone twice. We first find how many like at least one drink, then take that from 100.\n\n' +
        'Add the three single totals: $45 + 50 + 35 = 130$. This is too many, because anyone who likes two drinks has been counted twice.\n\n' +
        'Take off the three pair totals: $15 + 10 + 12 = 37$, and $130 - 37 = 93$.\n\n' +
        'Now think about the 5 people who like all three. They were added 3 times in the singles and taken off 3 times in the pairs, so they are not counted at all. Add them back: $93 + 5 = 98$.\n\n' +
        'So 98 people like at least one drink. The rest like none: $100 - 98 = 2$.',
      conclusion: '98 of the 100 people like at least one drink, so $2$ people like none of the drinks.',
      whyWrong: [
        'This forgets to add back the 5 people who like all three: $130 - 37 = 93$, then $100 - 93 = 7$.',
        null,
        'This is the number who like **at least one** drink. The question asks for the people outside all three circles.',
        'This subtracts the triple instead of adding it back: $130 - 37 - 5 = 88$, then $100 - 88 = 12$.',
      ],
      keyIdea: 'For three overlapping groups: add the singles, subtract the pairs, add back the triple. That gives the number in at least one group. Subtract it from the total to get "none".',
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
      asking: 'How many people own a cat or a dog, but not both?',
      solution:
        '"Exactly one" means the people with only a cat plus the people with only a dog. The 8 who own both do not count.\n\n' +
        'The 30 cat owners include the 8 who also own a dog. So cat only is $30 - 8 = 22$.\n\n' +
        'The same goes for dogs. Dog only is $25 - 8 = 17$.\n\n' +
        'Add the two "only" groups: $22 + 17 = 39$.',
      conclusion: '22 people own only a cat and 17 own only a dog, so $39$ own exactly one.',
      whyWrong: [
        'This is $30 + 25 - 8 = n(A \\cup B)$, the number who own **at least one** pet. It still includes the 8 who own both.',
        'This is $30 + 25$, which counts the 8 owners of both pets twice and does not remove them at all.',
        null,
        'This is cat owners **only**. It forgets to add the 17 who own a dog only.',
      ],
      keyIdea: 'Fill a Venn diagram (overlapping circles, one per group) from the middle out: write the overlap first, then subtract it from each group\'s total to get the "only" regions. "Exactly one" is the sum of the "only" regions.',
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
      asking: 'What fraction of the class plays neither sport?',
      solution:
        'Probability here is the number who play neither, divided by the total of 30. So first we need the number who play neither.\n\n' +
        'Adding the sports gives $18 + 12 = 30$, but the 5 who play both were counted twice. Take off one copy: $18 + 12 - 5 = 25$. So 25 students play at least one sport.\n\n' +
        'The rest play neither: $30 - 25 = 5$.\n\n' +
        'The probability is $\\frac{5}{30}$. Divide the top and bottom by 5 to simplify it: $\\frac{5}{30} = \\frac{1}{6}$.',
      conclusion: '5 out of 30 students play neither sport, and that fraction simplifies to $\\frac{1}{6}$.',
      whyWrong: [
        'This uses $18 + 12 = 30$ and concludes everybody plays a sport. It forgets that the 5 who play both were counted twice.',
        'This subtracts the overlap twice: $18 + 12 - 10 = 20$, giving $\\frac{10}{30} = \\frac{1}{3}$.',
        'This is $\\frac{25}{30}$, the probability of playing **at least one** sport, the complement of what was asked.',
        null,
      ],
      keyIdea: 'For a probability with overlapping groups, find the count for the region you want, then divide by the total. Here neither $=$ total $-$ (first $+$ second $-$ both).',
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
      asking: 'Which expression means "in exactly one of the two sets"?',
      solution:
        'Picture two overlapping circles. We want the two outer crescents, without the overlap in the middle and without the space outside the circles.\n\n' +
        '$A \\cup B$ is the union: everything inside the circles. That still includes the overlap.\n\n' +
        '$A \\cap B$ is the intersection: just the overlap.\n\n' +
        'The symbol $\\setminus$ means "take away". Start with everything inside the circles and take away the overlap, and only the two crescents remain: $(A \\cup B) \\setminus (A \\cap B)$.',
      conclusion: 'Everything in the circles minus the overlap is exactly "in one set but not both", so the answer is $(A \\cup B) \\setminus (A \\cap B)$.',
      whyWrong: [
        'The union includes the overlap $A \\cap B$, so it contains the elements that are in both sets.',
        "This is everything outside the overlap, which also includes the elements in **neither** set (the region outside both circles).",
        null,
        "This is the region outside both circles (in neither set). By De Morgan's law it equals $(A \\cup B)'$.",
      ],
      keyIdea: 'Draw two circles and shade the region described. Then turn each option into shading and see which one matches. $\\cup$ means both circles, $\\cap$ means the overlap, a dash means outside, and $\\setminus$ means take away.',
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
      asking: 'How many elements are in $A$ or $B$, but not in $C$?',
      solution:
        'Translate the notation. $n(\\dots)$ means the number of elements in the set inside the brackets. $A \\cup B$ means in $A$ or $B$ or both. $C\'$ means not in $C$, because the dash means complement. The symbol $\\cap$ means both conditions must hold.\n\n' +
        'So a region counts only if it is in $A$ or $B$, and also outside $C$. Test every row of the table:\n\n| Region | In $A$ or $B$? | Outside $C$? | Count it? |\n|---|---|---|---|\n| $A$ only | Yes | Yes | Yes |\n| $B$ only | Yes | Yes | Yes |\n| $C$ only | No | No | No |\n| $A$ and $B$ only | Yes | Yes | Yes |\n| $A$ and $C$ only | Yes | No | No |\n| $B$ and $C$ only | Yes | No | No |\n| All three | Yes | No | No |\n| None of the three | No | Yes | No |\n\n' +
        'Add the three regions we kept: $8 + 6 + 4 = 18$.',
      conclusion: 'Only the $A$ only, $B$ only, and $A$ and $B$ only regions pass both tests, and together they hold $18$ elements.',
      whyWrong: [
        'This is $n(A \\cup B) = 8 + 6 + 4 + 3 + 2 + 1 = 24$. It forgets the condition "not in $C$", so it includes the regions that overlap $C$.',
        null,
        "This is $n(C') = 8 + 6 + 4 + 7 = 25$. It includes the 7 elements outside all circles, which are not in $A \\cup B$.",
        'This adds only $A$ only and $B$ only ($8 + 6$). The $A$ and $B$ only region (4 elements) is also outside $C$ and must be included.',
      ],
      keyIdea: 'Turn the set expression into a yes or no test. Apply it to each region in turn, then add the counts of the regions that pass. Avoid adding whole circles, because they include regions you don\'t want.',
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
      asking: 'How many elements are outside both $A$ and $B$?',
      solution:
        '$A\'$ means not in $A$, and $B\'$ means not in $B$. The $\\cap$ means both must be true. So $A\' \\cap B\'$ is the elements in neither set. Picture $A$ and $B$ as two overlapping circles: these elements sit outside both.\n\n' +
        'The elements outside are whatever is left after removing those inside. So first count the elements inside, which is $n(A \\cup B)$: the number of elements in $A$ or $B$ or both.\n\n' +
        'Add the sets and take off the overlap, which would otherwise be counted twice: $n(A \\cup B) = 20 + 25 - 8 = 37$.\n\n' +
        'Everything else among the 50 elements of $U$, the full set we are working in, lies outside: $50 - 37 = 13$.',
      conclusion: '37 of the 50 elements are inside the circles, so $13$ are outside both.',
      whyWrong: [
        null,
        'This is $50 - (20 + 25)$: it forgets to subtract the overlap when finding $n(A \\cup B)$, so the 8 shared elements are removed twice.',
        "This is $50 - 8 = n\\big((A \\cap B)'\\big)$, which equals $A' \\cup B'$. De Morgan's law pairs $A' \\cap B'$ with the complement of the **union**, not the intersection.",
        "This is $n(A \\cup B)$. It forgets the final step of taking the complement.",
      ],
      keyIdea: 'Read $A\' \\cap B\'$ as "in neither". It equals $n(U) - n(A \\cup B)$. This is De Morgan\'s law: $A\' \\cap B\' = (A \\cup B)\'$.',
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
      asking: 'If $A$ sits completely inside a bigger set $B$, which statement must hold?',
      solution:
        '$A \\subseteq B$ means every element of $A$ is also in $B$. Picture a small circle $A$ drawn completely inside a bigger circle $B$.\n\n' +
        'Choose a tiny example that fits: $U = \\{1, 2, 3\\}$, $A = \\{1\\}$ and $B = \\{1, 2\\}$. Here $B$ has the extra element 2. The complements (everything in $U$ outside the set) are $A\' = \\{2, 3\\}$ and $B\' = \\{3\\}$.\n\n' +
        'Test each statement on the example. Here $\\cup$ means in either set, $\\cap$ means in both, $\\setminus$ means take away, and $\\varnothing$ is the empty set:\n\n| Statement | In the example | True? |\n|---|---|---|\n| $A \\cup B = A$ | $A \\cup B$ is $\\{1, 2\\}$, not $\\{1\\}$ | No |\n| $A \\cap B = A$ | $A \\cap B$ is $\\{1\\}$, the same as $A$ | Yes |\n| $B \\setminus A = \\varnothing$ | $B \\setminus A$ is $\\{2\\}$, not empty | No |\n| $A\' \\subseteq B\'$ | 2 is in $A\'$ but not in $B\'$ | No |',
      conclusion: 'Every element of $A$ is in $B$, so the part they share is all of $A$. That makes $A \\cap B = A$ always true.',
      whyWrong: [
        'When $A$ sits inside $B$, the union is the bigger set: $A \\cup B = B$. It equals $A$ only if the two sets are equal, which the question rules out.',
        null,
        '$B \\setminus A$ is the part of $B$ outside $A$. The question says $B$ has an element not in $A$, so this is not empty.',
        "Taking complements reverses a subset relation: $A \\subseteq B$ gives $B' \\subseteq A'$, not $A' \\subseteq B'$.",
      ],
      keyIdea: 'For "always true" questions about sets, draw the picture and choose a tiny example that fits the conditions. Test each statement on it. One failure rules a statement out.',
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
      asking: 'Which numbers are in exactly one of $A$ and $B$?',
      solution:
        'Start with the first bracket. $A \\cup B$ is the union: all the numbers in either set, each written once. So $A \\cup B = \\{1, 2, 3, 4, 5, 6\\}$.\n\n' +
        '$A \\cap B$ is the intersection: the numbers in both sets. Only 3 and 4 appear in both, so $A \\cap B = \\{3, 4\\}$.\n\n' +
        'The symbol $\\setminus$ means take away. Remove 3 and 4 from the union, and 1, 2, 5 and 6 are left.',
      conclusion: 'Removing the shared numbers 3 and 4 from the union leaves $\\{1, 2, 5, 6\\}$.',
      whyWrong: [
        'This is $A \\cap B$, the part that has to be removed, not what is left after removing it.',
        null,
        'This is $A \\cup B$: it forgets to remove the elements 3 and 4 that are in both sets.',
        'This is $A \\setminus B$ only. The elements 5 and 6 are in exactly one set too, so they also belong.',
      ],
      keyIdea: 'Symmetric difference means "in exactly one set". Find the union, find the intersection, then remove the intersection from the union. As a check, each number left should appear in one list only.',
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
      asking: 'After finding $x$, how many elements are in $B$ but not in $A$?',
      solution:
        '$n(A)$ means the number of elements in $A$. $A \\cup B$ is everything in either set, and $A \\cap B$ is the overlap, in both. Picture two overlapping circles: the 30 elements of $U$ split into those inside the circles and the 8 outside. So the number inside is $30 - 8 = 22$.\n\n' +
        'Write the number inside using the overlap formula, which adds the two sets and takes off the overlap once: $n(A \\cup B) = 3x + (2x + 2) - x$.\n\n' +
        'Collect the $x$ terms: $3x + 2x - x = 4x$. So the number inside is $4x + 2$.\n\n' +
        'Both expressions count the same elements, so $4x + 2 = 22$. Take 2 from both sides: $4x = 20$. Divide both sides by 4: $x = 5$.\n\n' +
        '$B$ only means the elements of $B$ that are not also in $A$. So $B$ only $= n(B) - n(A \\cap B) = (2x + 2) - x = x + 2$.\n\n' +
        'Substitute $x = 5$: $5 + 2 = 7$.',
      conclusion: 'With $x = 5$, set $B$ has 12 elements and 5 of them are shared, which leaves $7$ in $B$ only.',
      whyWrong: [
        null,
        'This comes from $3x + (2x + 2) + 8 = 30$, which forgets to subtract the overlap $x$. That gives $x = 4$ and $B$ only $= 6$.',
        'This forgets the 8 elements outside both sets: $4x + 2 = 30$ gives $x = 7$ and $B$ only $= 9$.',
        'This is the whole of set $B$ ($2x + 2 = 12$ with the correct $x = 5$), but it forgets to remove the $x$ elements that are also in $A$.',
      ],
      keyIdea: 'When set sizes contain $x$, write the total as inside $+$ outside, using $n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$. Solve for $x$, then substitute to find the region asked for.',
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
      asking: 'Out of all the subsets of 1 to 10, how many include an odd number?',
      solution:
        '"At least one" has many cases: one odd number, two odd numbers, and so on. It is quicker to count the opposite, subsets with **no** odd number, and subtract.\n\n' +
        'A **subset** is any selection of the numbers, from none of them to all of them. The set has 10 numbers, each in or out, so there are $2^{10} = 1024$ subsets in all.\n\n' +
        'A subset with no odd number can only use the even numbers 2, 4, 6, 8, 10. That is 5 numbers, each in or out, so $2^5 = 32$ subsets. This includes the empty set, which has no odd number either.\n\n' +
        'Subtract: $1024 - 32 = 992$.',
      conclusion: 'Of the 1024 subsets, 32 have no odd number, so $992$ have at least one.',
      whyWrong: [
        'This is $2^{10} - 1$: it removes only the empty set. But subsets such as $\\{2, 4\\}$ are non-empty and still contain no odd number.',
        'This is $2^{5} - 1$, the non-empty subsets of the **odd** numbers only. It forgets that any even numbers can be added freely, which multiplies the count by $2^{5}$.',
        'This is $2^{5}$, the number of subsets with **no** odd number. It is the complement; it must be subtracted from $1024$.',
        null,
      ],
      keyIdea: '"At least one" usually means total minus none. Count all subsets as $2^n$, count the subsets using only the other items, then subtract.',
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
      asking: 'How many elements does this set have?',
      solution:
        'The **cardinality** of a set is how many elements it has. It depends on the count, not on the sizes of the numbers.\n\n' +
        'Count the items one at a time: 2, 4, 6, 8, 10. That makes 5 items.',
      conclusion: 'The set lists five different numbers, so its cardinality is $5$.',
      whyWrong: [
        null,
        'This is the largest element. Cardinality counts the elements; it does not depend on how big they are.',
        'This is the sum of the elements. Cardinality counts them instead of adding them.',
        'This is the smallest element (and the gap between neighbouring elements), not the number of elements.',
      ],
      keyIdea: 'Cardinality, written $n(A)$ or $|A|$, is just a count of the different elements. Ignore how large the numbers are, and count a repeated element once.',
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
      asking: 'What does it mean for two sets to be disjoint?',
      solution:
        '**Disjoint** means the two sets have nothing in common. Picture two circles that do not touch. For example, $\\{1, 2\\}$ and $\\{3, 4\\}$ are disjoint.\n\n' +
        '$A \\cap B$ is what the sets share, and $\\varnothing$ is the empty set, which has nothing in it. So saying the sets share nothing is written $A \\cap B = \\varnothing$.',
      conclusion: 'Sharing nothing means the intersection is empty, so disjoint means $A \\cap B = \\varnothing$.',
      whyWrong: [
        null,
        'This says that together the sets cover the whole universal set. It says nothing about whether they overlap.',
        'This says $A$ sits inside $B$, so (unless $A$ is empty) they do share elements.',
        'Equal sets share every element, which is the opposite of disjoint (unless both are empty).',
      ],
      keyIdea: 'Translate each symbol into words and match it to the definition. Disjoint means no overlap, so look for an intersection equal to the empty set. For disjoint sets, the number of elements in either set is $n(A \\cup B) = n(A) + n(B)$, where $n$ counts elements.',
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
      asking: 'What does the dash in $A\'$ mean?',
      solution:
        '$U$ is the **universal set**: everything under discussion. Every other set sits inside it.\n\n' +
        'The **complement** $A\'$ is what remains of $U$ once $A$ is removed. For example, if $U = \\{1, 2, 3, 4\\}$ and $A = \\{1, 2\\}$, then $A\' = \\{3, 4\\}$.',
      conclusion: 'What remains after removing $A$ is exactly the elements in $U$ but not in $A$.',
      whyWrong: [
        null,
        'Every element of $A$ is already in $U$, so this set is empty. The order is the wrong way round.',
        'Every element of $A$ is in $U$, so this is just $A$ itself, the opposite of the complement.',
        '$U$ contains everything being talked about, so nothing in the question lies outside it.',
      ],
      keyIdea: 'Whenever you see a dash on a set, read it as "not in". Write out $U$ and cross off the set\'s elements. What remains is the complement.',
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
      asking: 'Which sets have the empty set as a subset?',
      solution:
        '$\\varnothing$ is the **empty set**: a set with nothing in it.\n\n' +
        '$X$ is a subset of $Y$ when no element of $X$ is missing from $Y$. To show $X$ is **not** a subset, you must point to an element of $X$ that is not in $Y$.\n\n' +
        'The empty set has no elements, so you can never point to one, whatever $Y$ is. The subset test can\'t fail.',
      conclusion: 'The subset test can never fail for the empty set, so it is a subset of every set.',
      whyWrong: [
        null,
        'It is a subset of itself, but the same reasoning works for any other set as well.',
        'Having no elements does not stop it being a subset: no element of it is missing from the other set.',
        'The size of the other set makes no difference, so finite sets count too.',
      ],
      keyIdea: 'To test $X \\subseteq Y$, look for an element of $X$ that is missing from $Y$. If none exists, $X$ is a subset. This is also why $\\varnothing$ is always counted among the $2^n$ subsets of a set.',
    },
  },
];
