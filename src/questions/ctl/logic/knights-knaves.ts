import type { StaticQuestion } from '../../../types';

// ---------------------------------------------------------------- brute-force helpers for the answer checks
/** A "world" lists each person's type: true = knight, false = knave. */
type W = boolean[];
/** [speaker index, truth value of what they said in world w]. */
type Said = [number, (w: W) => boolean];

function allWorlds(n: number): W[] {
  const out: W[] = [];
  for (let mask = 0; mask < 1 << n; mask++) out.push(Array.from({ length: n }, (_, i) => ((mask >> (n - 1 - i)) & 1) === 1));
  return out;
}

/** Worlds in which every knight's statement is true and every knave's statement is false. */
function consistent(n: number, said: Said[]): W[] {
  return allWorlds(n).filter((w) => said.every(([s, f]) => w[s] === f(w)));
}

const code = (w: W) => w.map((k) => (k ? 'K' : 'N')).join('');

/** 'KN...' when there is exactly one consistent world, otherwise a marker that matches no option. */
function solve(n: number, said: Said[]): string {
  const s = consistent(n, said);
  return s.length === 1 ? code(s[0]) : `ambiguous:${s.map(code).join(',')}`;
}

/** Labels of the options whose predicate holds in EVERY world of the list (joined if several). */
function entailed<T>(worlds: T[], preds: [string, (w: T) => boolean][]): string {
  if (worlds.length === 0) return 'no worlds';
  return preds
    .filter(([, p]) => worlds.every(p))
    .map(([l]) => l)
    .join('|');
}

/** Suspects for whom exactly `count` statements (functions of the culprit) come out `value`. */
function culprits(names: string[], stmts: ((c: number) => boolean)[], value: boolean, count: number): string {
  const ok = names.filter((_, c) => stmts.filter((f) => f(c) === value).length === count);
  return ok.join('|');
}

const ISLAND = 'Knights always tell the truth; knaves always lie.';

export const questions: StaticQuestion[] = [
  // ================================================================ foundation
  {
    id: 'knights-knaves-001',
    subtopic: 'knights-knaves',
    difficulty: 'foundation',
    stem: `${ISLAND} Who can say "I am a knave"?`,
    options: ['Only a knight', 'Only a knave', 'Nobody', 'Anybody'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Try both possible types for the speaker.\n\n' +
        '- **Speaker is a knight.** Then "I am a knave" is false. But knights only say true things. Contradiction.\n' +
        '- **Speaker is a knave.** Then "I am a knave" is true. But knaves only say false things. Contradiction.\n\n' +
        'Both cases are impossible, so **nobody** can say "I am a knave".\n\n' +
        'Remember this fact: it is the starting point of many puzzles.',
      whyWrong: [
        'A knight tells the truth, so a knight saying "I am a knave" would be saying something false. That can never happen.',
        'If a knave said "I am a knave", the statement would be true, and a knave never says anything true. Taking the words at face value is the trap here.',
        null,
        'This is the conclusion for "I am a knight", which both types can say. "I am a knave" is the opposite: neither type can say it.',
      ],
      keyIdea: 'Test every case: "I am a knave" is false if said by a knight and true if said by a knave, so nobody can say it.',
    },
    check: {
      optionValues: ['K', 'N', 'none', 'either'],
      compute: () => {
        const s = consistent(1, [[0, (w) => !w[0]]]);
        return s.length === 0 ? 'none' : s.length === 2 ? 'either' : code(s[0]);
      },
    },
  },
  {
    id: 'knights-knaves-002',
    subtopic: 'knights-knaves',
    difficulty: 'foundation',
    stem: `${ISLAND} Ali says: "Bea is a knight." Which of the following **must** be true?`,
    options: [
      'Both are knights',
      'They are different types',
      'Ali is a knight; Bea could be either',
      'They are the same type',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        'Try both cases for Ali.\n\n' +
        '- **Ali is a knight.** His statement is true, so Bea is a knight. Both are knights.\n' +
        '- **Ali is a knave.** His statement is false, so Bea is **not** a knight: Bea is a knave. Both are knaves.\n\n' +
        'Both cases are possible, so we cannot say exactly who is what. But in **every** possible case they are the same type.\n\n' +
        'General rule: "X says Y is a knight" means X and Y are the same type.',
      whyWrong: [
        'Both knights is only one of the two possible cases. Both knaves also works: a knave saying "Bea is a knight" about a knave Bea is a lie, which is allowed.',
        'Different types never works: a knight Ali makes Bea a knight, and a knave Ali makes Bea a knave. Either way they match.',
        'Ali could also be a knave (with Bea a knave too), so Ali is not necessarily a knight. And once Ali\'s type is fixed, Bea\'s is fixed as well.',
        null,
      ],
      keyIdea: '"X says Y is a knight" forces X and Y to be the same type; "X says Y is a knave" forces them to be different.',
    },
    check: {
      optionValues: ['both K', 'different', 'Ali K', 'same'],
      compute: () =>
        entailed(consistent(2, [[0, (w) => w[1]]]), [
          ['both K', (w) => w[0] && w[1]],
          ['different', (w) => w[0] !== w[1]],
          ['Ali K', (w) => w[0]],
          ['same', (w) => w[0] === w[1]],
        ]),
    },
  },
  {
    id: 'knights-knaves-003',
    subtopic: 'knights-knaves',
    difficulty: 'foundation',
    stem: `${ISLAND} Sam is known to be a knave. Sam says: "It is raining and it is cold." Which of the following must be true?`,
    options: [
      'It is not raining, or it is not cold (or both).',
      'It is not raining and it is not cold.',
      'It is raining but it is not cold.',
      'It is raining and it is cold.',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        'Sam is a knave, so his statement is **false**.\n\n' +
        'An "and" statement is true only when **both** parts are true. So "raining and cold" is false when **at least one** part fails:\n\n' +
        '| Raining? | Cold? | "Raining and cold" |\n|---|---|---|\n| yes | yes | true |\n| yes | no | false |\n| no | yes | false |\n| no | no | false |\n\n' +
        'Sam\'s statement must be false, so we are in one of the last three rows. The only thing true in **all three** rows is: it is not raining, or it is not cold (or both).\n\n' +
        'This is De Morgan\'s law: $\\neg(P \\land Q) \\equiv \\neg P \\lor \\neg Q$.',
      whyWrong: [
        null,
        'This negates each part but keeps the "and". The opposite of "P and Q" is "not P **or** not Q". It could be raining but warm, for example.',
        'This is only one of the three possible situations; it might instead be dry and cold, or dry and warm.',
        'This believes Sam. Sam is a knave, so what he says is false.',
      ],
      keyIdea: 'A knave\'s statement is false, and the negation of "P and Q" is "not P or not Q" (De Morgan).',
    },
    check: {
      optionValues: ['notR or notC', 'notR and notC', 'R and notC', 'R and C'],
      compute: () => {
        const worlds = [
          [true, true],
          [true, false],
          [false, true],
          [false, false],
        ].filter(([r, c]) => !(r && c)); // Sam lies, so his statement is false
        return entailed(worlds, [
          ['notR or notC', ([r, c]) => !r || !c],
          ['notR and notC', ([r, c]) => !r && !c],
          ['R and notC', ([r, c]) => r && !c],
          ['R and C', ([r, c]) => r && c],
        ]);
      },
    },
  },
  {
    id: 'knights-knaves-004',
    subtopic: 'knights-knaves',
    difficulty: 'foundation',
    stem: `${ISLAND} Dana is known to be a knight.\n\n- Dana says: "Eli is a knave."\n- Eli says: "Farah is a knight."\n\nWhat type is Farah?`,
    options: [
      'Farah is a knight.',
      'Farah is a knave.',
      'Farah could be either type.',
      'The statements contradict each other, so this situation is impossible.',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Work along the chain.\n\n' +
        '1. Dana is a knight, so her statement is true: **Eli is a knave**.\n' +
        '2. Eli is a knave, so his statement is false. He said "Farah is a knight", so in fact **Farah is a knave**.\n\n' +
        'Check: Dana (knight) says something true, Eli (knave) says something false. Everything fits.',
      whyWrong: [
        'This believes Eli. But Dana, a knight, has told us that Eli is a knave, so Eli\'s statement is a lie.',
        null,
        'Farah does not speak, but her type is still fixed: Eli\'s statement about her must be false.',
        'There is no contradiction: Dana a knight, Eli a knave and Farah a knave makes every statement behave correctly.',
      ],
      keyIdea: 'Start from the person whose type you know and follow the chain: a knight\'s claim is true, a knave\'s claim is false.',
    },
    check: {
      optionValues: ['K', 'N', 'either', 'none'],
      compute: () => {
        const worlds = consistent(3, [
          [0, (w) => !w[1]],
          [1, (w) => w[2]],
        ]).filter((w) => w[0]);
        if (worlds.length === 0) return 'none';
        const types = new Set(worlds.map((w) => w[2]));
        return types.size === 2 ? 'either' : worlds[0][2] ? 'K' : 'N';
      },
    },
  },
  {
    id: 'knights-knaves-005',
    subtopic: 'knights-knaves',
    difficulty: 'foundation',
    stem: `${ISLAND} Which of these statements could be said **both** by a knight and by a knave?`,
    options: ['"$2 + 2 = 4$"', '"I am a knight."', '"I am a knave."', '"$2 + 2 = 5$"'],
    correctIndex: 1,
    markScheme: {
      solution:
        'A knight can only say **true** things; a knave can only say **false** things. Check each statement for each speaker.\n\n' +
        '| Statement | Said by a knight, it is... | Said by a knave, it is... | Who can say it? |\n|---|---|---|---|\n' +
        '| "$2 + 2 = 4$" | true | true | knights only |\n' +
        '| "I am a knight." | true | false | **both** |\n' +
        '| "I am a knave." | false | true | nobody |\n' +
        '| "$2 + 2 = 5$" | false | false | knaves only |\n\n' +
        'Only "I am a knight" is true from a knight and false from a knave, so both can say it. That is why hearing "I am a knight" tells you nothing.',
      whyWrong: [
        'This is true whoever says it, so a knave (who must lie) could never say it. Only knights can.',
        null,
        'This is false from a knight and true from a knave, so **nobody** can say it.',
        'This is false whoever says it, so a knight could never say it. Only knaves can.',
      ],
      keyIdea: 'A statement about the speaker\'s own type can change truth value with the speaker: "I am a knight" suits both types, "I am a knave" suits neither.',
    },
    check: {
      optionValues: ['four', 'knight', 'knave', 'five'],
      compute: () => {
        const stmts: [string, (w: W) => boolean][] = [
          ['four', () => 2 + 2 === 4],
          ['knight', (w) => w[0]],
          ['knave', (w) => !w[0]],
          ['five', () => 2 + 2 === 5],
        ];
        // knight can say it: true when speaker is a knight; knave can say it: false when speaker is a knave
        return stmts
          .filter(([, f]) => f([true]) === true && f([false]) === false)
          .map(([l]) => l)
          .join('|');
      },
    },
  },

  // ================================================================ exam
  {
    id: 'knights-knaves-006',
    subtopic: 'knights-knaves',
    difficulty: 'exam',
    stem: `${ISLAND} Ali says: "Bea and I are both knaves." What are Ali and Bea?`,
    options: [
      'Both knights',
      'Ali knight, Bea knave',
      'Ali knave, Bea knight',
      'Both knaves',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Case 1: Ali is a knight.** Then "we are both knaves" is true, so Ali is a knave. Contradiction. So Ali is **not** a knight.\n\n' +
        '**Case 2: Ali is a knave.** Then the statement is false, so it is **not** true that both are knaves. Ali definitely is a knave, so Bea must be the one who is not: **Bea is a knight**.\n\n' +
        'Check: Ali (knave) says "we are both knaves", which is false because Bea is a knight. Correct for a knave.\n\n' +
        'So Ali is a knave and Bea is a knight.',
      whyWrong: [
        'If Ali were a knight, his statement "we are both knaves" would have to be true, making him a knave. A knight can never claim to be a knave.',
        'Ali cannot be a knight, whatever Bea is: a knight\'s statement must be true, but "Bea and I are both knaves" would then call a knight a knave.',
        null,
        'If both were knaves, Ali\'s statement would be true, but a knave cannot say something true. This is the trap of believing a liar.',
      ],
      keyIdea: 'Anyone who includes "I am a knave" in a claim must be a knave, and then the whole claim is false.',
    },
    check: {
      optionValues: ['KK', 'KN', 'NK', 'NN'],
      compute: () => solve(2, [[0, (w) => !w[0] && !w[1]]]),
    },
  },
  {
    id: 'knights-knaves-007',
    subtopic: 'knights-knaves',
    difficulty: 'exam',
    stem: `${ISLAND} Omar says: "At least one of Lina and me is a knave." What are Omar and Lina?`,
    options: [
      'Omar knight, Lina knave',
      'Both knights',
      'Omar knave, Lina knight',
      'Both knaves',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Case 1: Omar is a knave.** Then his statement is false, so **neither** of them is a knave. But Omar is a knave. Contradiction.\n\n' +
        '**Case 2: Omar is a knight.** Then his statement is true: at least one of them is a knave. Omar is not, so **Lina is a knave**.\n\n' +
        'Check: Omar (knight) says "at least one of us is a knave". Lina is a knave, so this is true. Correct.\n\n' +
        'So Omar is a knight and Lina is a knave.',
      whyWrong: [
        null,
        'If both were knights, "at least one of us is a knave" would be false, but a knight cannot say something false.',
        'If Omar were a knave, his statement would actually be **true** (he himself is a knave), and knaves cannot tell the truth.',
        'Two knaves make the statement true, so Omar, a knave, would be telling the truth: impossible.',
      ],
      keyIdea: 'A knave can never say "at least one of us is a knave", because his own presence makes it true.',
    },
    check: {
      optionValues: ['KN', 'KK', 'NK', 'NN'],
      compute: () => solve(2, [[0, (w) => !w[0] || !w[1]]]),
    },
  },
  {
    id: 'knights-knaves-008',
    subtopic: 'knights-knaves',
    difficulty: 'exam',
    stem: `${ISLAND}\n\n- Amir: "Bella is a knave."\n- Bella: "Chen is a knave."\n- Chen: "Amir and Bella are both knaves."\n\nWhat are they?`,
    options: [
      'Amir knight, Bella knave, Chen knight',
      'Amir knave, Bella knave, Chen knight',
      'Amir knight, Bella knave, Chen knave',
      'Amir knave, Bella knight, Chen knave',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        'Start with Chen, whose statement is the strongest.\n\n' +
        '**Suppose Chen is a knight.** Then Amir and Bella are both knaves. Amir (knave) says "Bella is a knave", which would be true. A knave cannot say something true. Contradiction. So **Chen is a knave**.\n\n' +
        '**Bella:** Bella says "Chen is a knave". That is true, so Bella must be a knight (a knave could not say it). **Bella is a knight**.\n\n' +
        '**Amir:** Amir says "Bella is a knave". That is false, so **Amir is a knave**.\n\n' +
        '**Final check of Chen:** Chen (knave) says "Amir and Bella are both knaves". Bella is a knight, so this is false. Correct for a knave.\n\n' +
        'Amir is a knave, Bella is a knight, Chen is a knave.',
      whyWrong: [
        'Here Bella would be a knave saying "Chen is a knave" while Chen is a knight, which is false: fine so far. But knight Chen\'s claim "Amir and Bella are both knaves" would be false because Amir is a knight. Contradiction.',
        'This believes Chen. With Amir and Bella both knaves, Amir\'s statement "Bella is a knave" would be true, and a knave cannot say something true.',
        'Here knave Bella says "Chen is a knave", which would be true because Chen is a knave. A knave cannot tell the truth.',
        null,
      ],
      keyIdea: 'Start case analysis with the person whose statement says the most, then use each deduced type to read the next statement.',
    },
    check: {
      optionValues: ['KNK', 'NNK', 'KNN', 'NKN'],
      compute: () =>
        solve(3, [
          [0, (w) => !w[1]],
          [1, (w) => !w[2]],
          [2, (w) => !w[0] && !w[1]],
        ]),
    },
  },
  {
    id: 'knights-knaves-009',
    subtopic: 'knights-knaves',
    difficulty: 'exam',
    stem: `${ISLAND}\n\n- Dina: "Exactly one of us is a knight."\n- Eli: "Exactly two of us are knights."\n- Farah: "All of us are knaves."\n\nHow many are knights?`,
    options: ['$0$', '$1$', '$2$', '$3$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '**Farah first.** If Farah were a knight, "all three of us are knaves" would make her a knave. Contradiction. So **Farah is a knave**, and her statement is false: **at least one** of them is a knight.\n\n' +
        '**Dina and Eli cannot both be right**, since "exactly one" and "exactly two" cannot both be true. Try the cases.\n\n' +
        '- **Eli is a knight:** exactly two knights. Farah is a knave, so the other knight is Dina. But then Dina\'s "exactly one" is false while she is a knight. Contradiction.\n' +
        '- **Eli is a knave, Dina is a knave:** with Farah also a knave there are no knights, but we showed there is at least one. Contradiction.\n' +
        '- **Eli is a knave, Dina is a knight:** exactly one knight (Dina). Dina\'s statement is true, Eli\'s "exactly two" is false, Farah\'s "all knaves" is false. Everything fits.\n\n' +
        'So there is exactly $1$ knight (Dina).',
      whyWrong: [
        'Zero knights means all three are knaves, which would make Farah\'s statement true. A knave cannot say something true.',
        null,
        'Two knights would make Eli a knight, and the second knight would have to be Dina (Farah can never be a knight). But then Dina\'s "exactly one" would be false.',
        'Dina and Eli contradict each other, so they cannot both be knights, and Farah can never be a knight.',
      ],
      keyIdea: 'Statements like "exactly one" and "exactly two" are mutually exclusive, so at most one of the speakers can be a knight; combine that with the impossible "all of us are knaves".',
    },
    check: {
      optionValues: [0, 1, 2, 3],
      compute: () => {
        const count = (w: W) => w.filter(Boolean).length;
        const s = consistent(3, [
          [0, (w) => count(w) === 1],
          [1, (w) => count(w) === 2],
          [2, (w) => count(w) === 0],
        ]);
        return s.length === 1 ? count(s[0]) : -1;
      },
    },
  },
  {
    id: 'knights-knaves-010',
    subtopic: 'knights-knaves',
    difficulty: 'exam',
    stem: `${ISLAND} Yusuf says: "If I am a knight, then Sara is a knight." What are Yusuf and Sara?`,
    options: [
      'Both knights',
      'Yusuf knight, Sara knave',
      'Yusuf knave, Sara knight',
      'Both knaves',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        'An "if P then Q" statement is **false only when P is true and Q is false**. In every other case it counts as true. In particular, if P is false, "if P then Q" is automatically true.\n\n' +
        '**Case 1: Yusuf is a knave.** Then P = "I am a knight" is false, so the whole if-then statement is **true**. A knave cannot say something true. Contradiction.\n\n' +
        '**Case 2: Yusuf is a knight.** His statement is true. P = "I am a knight" is true, so Q must be true too: **Sara is a knight**.\n\n' +
        'So both are knights.',
      whyWrong: [
        null,
        'With Yusuf a knight and Sara a knave, the "if" part is true and the "then" part is false, so the statement is false. Knights never say false things.',
        'If Yusuf were a knave, the "if" part ("I am a knight") would be false, which makes the whole if-then statement true. A knave cannot say it.',
        'Whatever Sara is, a knave Yusuf makes the "if" part false and so the statement automatically true. This answer forgets that a false "if" part makes an if-then statement true.',
      ],
      keyIdea: '"If P then Q" is false only when P is true and Q is false, so a knave can never say "If I am a knight, then ...".',
    },
    check: {
      optionValues: ['KK', 'KN', 'NK', 'NN'],
      compute: () => solve(2, [[0, (w) => !w[0] || w[1]]]),
    },
  },
  {
    id: 'knights-knaves-011',
    subtopic: 'knights-knaves',
    difficulty: 'exam',
    stem: 'One of Hana, Imran and Jude ate the cake. Exactly **one** statement below is true.\n\n- Hana: "Jude ate it."\n- Imran: "Jude ate it."\n- Jude: "Hana ate it."\n\nWho ate the cake?',
    options: ['Hana', 'Imran', 'Jude', 'Cannot be determined'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Spot the pair.** Hana and Imran make the *same* claim, so they are either both true or both false.\n\n' +
        'Only one statement is true, so they cannot both be true. Hence both are **false**, and the one true statement is Jude\'s: **Hana ate it**.\n\n' +
        'Check every suspect by counting true statements:\n\n' +
        '| Culprit | Hana | Imran | Jude | Number true |\n|---|---|---|---|---|\n' +
        '| Hana | false | false | true | **1** |\n' +
        '| Imran | false | false | false | 0 |\n' +
        '| Jude | true | true | false | 2 |\n\n' +
        'Only "Hana ate it" gives exactly one true statement. Hana ate the cake.',
      whyWrong: [
        null,
        'If Imran ate it, every statement would be false: 0 true statements, not 1.',
        'If Jude ate it, Hana\'s and Imran\'s statements would both be true: 2 true statements, not 1. This comes from believing the claim made twice.',
        'Trying each of the three suspects leaves exactly one who gives one true statement, so the culprit can be determined.',
      ],
      keyIdea: 'For "exactly one statement is true" puzzles, try each suspect and count the true statements; identical or opposite statements give a quick shortcut.',
    },
    check: {
      optionValues: ['Hana', 'Imran', 'Jude', 'ambiguous'],
      compute: () => culprits(['Hana', 'Imran', 'Jude'], [(c) => c === 2, (c) => c === 2, (c) => c === 0], true, 1),
    },
  },
  {
    id: 'knights-knaves-012',
    subtopic: 'knights-knaves',
    difficulty: 'exam',
    stem: `${ISLAND} Bea says: "Cal is a knight." Cal says: "Bea and I are of different types." What are Bea and Cal?`,
    options: [
      'Both knights',
      'Bea knight, Cal knave',
      'Bea knave, Cal knight',
      'Both knaves',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        'Bea says "Cal is a knight", so Bea and Cal are the **same type** (a knight Bea makes Cal a knight; a knave Bea makes Cal a knave).\n\n' +
        'So "Bea and I are of different types" is **false**. Cal said something false, so **Cal is a knave**.\n\n' +
        'Same type as Cal, so **Bea is a knave** too.\n\n' +
        'Check: Bea (knave) says "Cal is a knight": false. Cal (knave) says "we are different types": false, since both are knaves. Both lie, as knaves should.',
      whyWrong: [
        'If both were knights, Cal\'s claim "we are of different types" would be false, but a knight cannot say something false.',
        'Here Bea is a knight, so her claim "Cal is a knight" would have to be true, but in this option Cal is a knave. Contradiction.',
        'Here Bea is a knave who says "Cal is a knight", which would be true. A knave cannot say something true. This answer believes Cal\'s claim of being different.',
        null,
      ],
      keyIdea: 'Turn each statement into a fact about types ("same type" or "different type") and combine the facts.',
    },
    check: {
      optionValues: ['KK', 'KN', 'NK', 'NN'],
      compute: () =>
        solve(2, [
          [0, (w) => w[1]],
          [1, (w) => w[0] !== w[1]],
        ]),
    },
  },
  {
    id: 'knights-knaves-013',
    subtopic: 'knights-knaves',
    difficulty: 'exam',
    stem: 'One of Pia, Quinn and Ravi broke a beaker. Exactly **one** statement below is false.\n\n- Pia: "Quinn broke it."\n- Quinn: "Pia is lying."\n- Ravi: "I broke it."\n\nWho broke the beaker?',
    options: ['Pia', 'Quinn', 'Ravi', 'Cannot be determined'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Spot the contradiction.** Quinn says Pia is lying, so Pia and Quinn cannot both be telling the truth, and they cannot both be lying either: **exactly one of them is false**.\n\n' +
        'Only one statement in total is false, so Ravi\'s statement is **true**: Ravi broke it.\n\n' +
        'Check every suspect by counting false statements:\n\n' +
        '| Culprit | Pia | Quinn | Ravi | Number false |\n|---|---|---|---|---|\n' +
        '| Pia | false | true | false | 2 |\n' +
        '| Quinn | true | false | false | 2 |\n' +
        '| Ravi | false | true | true | **1** |',
      whyWrong: [
        'If Pia did it, her own statement and Ravi\'s would both be false: 2 false statements, not 1.',
        'This believes Pia. If Quinn did it, Quinn\'s and Ravi\'s statements would both be false: 2 false statements, not 1.',
        null,
        'Only one of the three suspects gives exactly one false statement, so the culprit can be determined.',
      ],
      keyIdea: 'When one person says another is lying, exactly one of those two statements is false, which tells you the rest must be true.',
    },
    check: {
      optionValues: ['Pia', 'Quinn', 'Ravi', 'ambiguous'],
      compute: () => {
        const pia = (c: number) => c === 1;
        return culprits(['Pia', 'Quinn', 'Ravi'], [pia, (c) => !pia(c), (c) => c === 2], false, 1);
      },
    },
  },
  {
    id: 'knights-knaves-019',
    subtopic: 'knights-knaves',
    difficulty: 'foundation',
    stem: `${ISLAND} What must be true of any statement made by a knave?`,
    options: ['It is false', 'It is true', 'It could be either', 'It is about the knave'],
    correctIndex: 0,
    markScheme: {
      solution: 'A knave always lies, so every statement a knave makes is **false**. A knight is the opposite: every statement a knight makes is true.',
      whyWrong: [
        null,
        'This describes a knight. A knave never says anything true.',
        'This describes an ordinary person. A knave always lies, with no exceptions.',
        'A knave can talk about anything. What is fixed is that the statement is false, not its subject.',
      ],
      keyIdea: 'A knight\'s statements are all true and a knave\'s statements are all false.',
    },
    check: {
      optionValues: ['false', 'true', 'either', null],
      compute: () => {
        const ok = [true, false].filter((t) => consistent(1, [[0, () => t]]).some((w) => !w[0]));
        return ok.length === 1 ? String(ok[0]) : 'either';
      },
    },
  },
  {
    id: 'knights-knaves-020',
    subtopic: 'knights-knaves',
    difficulty: 'foundation',
    stem: `${ISLAND} Zed says: "I am a knight." What does this tell you about Zed?`,
    options: ['Nothing: either type can say it', 'Zed is a knight', 'Zed is a knave', 'Nobody could say this'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Test both types.\n\n' +
        '- **Zed is a knight:** "I am a knight" is true, which a knight may say.\n' +
        '- **Zed is a knave:** "I am a knight" is false, which a knave may say.\n\n' +
        'Both cases work, so the statement tells you **nothing** about Zed.',
      whyWrong: [
        null,
        'This believes the speaker. A knave would also claim to be a knight, because for a knave that claim is a lie.',
        'A knight can truthfully say this, so the statement does not prove that Zed is a knave.',
        'This is the fact about "I am a knave". "I am a knight" can be said by both types.',
      ],
      keyIdea: '"I am a knight" can be said by anyone, so it gives no information.',
    },
    check: {
      optionValues: ['either', 'K', 'N', 'none'],
      compute: () => {
        const s = consistent(1, [[0, (w) => w[0]]]);
        return s.length === 2 ? 'either' : s.length === 0 ? 'none' : code(s[0]);
      },
    },
  },
  {
    id: 'knights-knaves-021',
    subtopic: 'knights-knaves',
    difficulty: 'foundation',
    stem: `${ISLAND} Ali says: "Bea is a knave." Which must be true?`,
    options: ['They are different types', 'They are the same type', 'Ali is a knight', 'Bea is a knave'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Try both cases for Ali.\n\n' +
        '- **Ali is a knight:** the statement is true, so Bea is a knave.\n' +
        '- **Ali is a knave:** the statement is false, so Bea is a knight.\n\n' +
        'Either way they are **different types**. We cannot tell which of them is which.',
      whyWrong: [
        null,
        'This is the rule for "Bea is a knight". Saying "Bea is a knave" forces the opposite: different types.',
        'This believes Ali. Ali could be a knave, with Bea a knight.',
        'This also believes Ali. If Ali is a knave, the statement is false and Bea is a knight.',
      ],
      keyIdea: '"X says Y is a knave" forces X and Y to be different types.',
    },
    check: {
      optionValues: ['different', 'same', 'Ali K', 'Bea N'],
      compute: () =>
        entailed(consistent(2, [[0, (w) => !w[1]]]), [
          ['different', (w) => w[0] !== w[1]],
          ['same', (w) => w[0] === w[1]],
          ['Ali K', (w) => w[0]],
          ['Bea N', (w) => !w[1]],
        ]),
    },
  },
  {
    id: 'knights-knaves-022',
    subtopic: 'knights-knaves',
    difficulty: 'exam',
    stem: `${ISLAND} Ali says to Bea: "Exactly one of us is a knight." What must Bea be?`,
    options: ['A knave', 'A knight', 'Either type', 'The same type as Ali'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Try both cases for Ali.\n\n' +
        '- **Ali is a knight:** the statement is true, so exactly one of them is a knight. That one is Ali, so Bea is a knave.\n' +
        '- **Ali is a knave:** the statement is false, so the number of knights is not one. Ali is not a knight, so the number is zero and Bea is a knave.\n\n' +
        'Bea is a **knave** in both cases, even though Ali could be either type.',
      whyWrong: [
        null,
        'If Bea were a knight, then a knight Ali would make two knights, so his statement would be false. A knave Ali would make exactly one knight, so his statement would be true. Both break the rules.',
        'Ali could be either type, but Bea cannot. This mixes up the person who is undetermined with the person who is fixed.',
        'This is only one of the two cases. When Ali is a knight, he and Bea are different types.',
      ],
      keyIdea: 'Run both cases for the speaker: a fact that holds in every surviving case must be true.',
    },
    check: {
      optionValues: ['N', 'K', 'either', 'same'],
      compute: () => {
        const s = consistent(2, [[0, (w) => w[0] !== w[1]]]);
        const types = new Set(s.map((w) => w[1]));
        return types.size === 2 ? 'either' : s[0][1] ? 'K' : 'N';
      },
    },
  },
  {
    id: 'knights-knaves-023',
    subtopic: 'knights-knaves',
    difficulty: 'exam',
    stem: `${ISLAND} Nour says: "Omar is a knave." Omar says: "Nour and I are both knights." What are they?`,
    options: ['Both knights', 'Nour knight, Omar knave', 'Nour knave, Omar knight', 'Both knaves'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Nour says Omar is a knave, so they are **different types**.\n\n' +
        'That makes "Nour and I are both knights" false, so Omar is a **knave**. Different types means Nour is a **knight**.\n\n' +
        'Check: Nour (knight) says "Omar is a knave", which is true. Omar (knave) says "both knights", which is false.',
      whyWrong: [
        'If both were knights, Nour\'s "Omar is a knave" would be false, and a knight cannot say something false.',
        null,
        'This believes Omar\'s high opinion of himself. A knight Omar must speak the truth, but "both knights" is false when Nour is a knave.',
        'If both were knaves, Nour\'s "Omar is a knave" would be true, and a knave cannot say something true.',
      ],
      keyIdea: 'Turn the simple statement into "same type" or "different types" first, then test the other statement against it.',
    },
    check: {
      optionValues: ['KK', 'KN', 'NK', 'NN'],
      compute: () =>
        solve(2, [
          [0, (w) => !w[1]],
          [1, (w) => w[0] && w[1]],
        ]),
    },
  },
  {
    id: 'knights-knaves-024',
    subtopic: 'knights-knaves',
    difficulty: 'exam',
    stem: `${ISLAND} Cal says: "Dee is a knight." Dee says: "Cal is a knave." What can you conclude?`,
    options: ['Both are knights', 'Cal knight, Dee knave', 'Both are knaves', 'This situation is impossible'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Turn each statement into a fact about types.\n\n' +
        '- "Dee is a knight" means Cal and Dee are the **same** type.\n' +
        '- "Cal is a knave" means Dee and Cal are **different** types.\n\n' +
        'They cannot be both, so no assignment fits:\n\n' +
        '| Cal | Dee | Cal\'s statement | Dee\'s statement | Possible? |\n|---|---|---|---|---|\n' +
        '| knight | knight | true | false ✗ | no |\n' +
        '| knight | knave | false ✗ | false | no |\n' +
        '| knave | knight | true ✗ | true | no |\n' +
        '| knave | knave | false | true ✗ | no |\n\n' +
        'The situation is **impossible**.',
      whyWrong: [
        'If both were knights, Dee\'s "Cal is a knave" would be false, and a knight cannot say something false.',
        'If Dee were a knave, Cal\'s "Dee is a knight" would be false, and a knight Cal cannot say something false.',
        'If both were knaves, Dee\'s "Cal is a knave" would be true, and a knave cannot say something true.',
        null,
      ],
      keyIdea: 'One statement forces "same type" and the other forces "different types", so no assignment can satisfy both.',
    },
    check: {
      optionValues: ['KK', 'KN', 'NN', 'impossible'],
      compute: () => {
        const s = consistent(2, [
          [0, (w) => w[1]],
          [1, (w) => !w[0]],
        ]);
        return s.length === 0 ? 'impossible' : s.map(code).join('|');
      },
    },
  },
  {
    id: 'knights-knaves-025',
    subtopic: 'knights-knaves',
    difficulty: 'exam',
    stem: `${ISLAND}\n\n- Amy: "Ben is a knight."\n- Ben: "Cy is a knave."\n- Cy: "Amy and I are both knaves."\n\nHow many of the three are knights?`,
    options: ['$0$', '$1$', '$2$', '$3$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Start with Cy.** A knight cannot call himself a knave, so Cy is a **knave** and his statement is false.\n\n' +
        '**Amy.** Cy is a knave, so "both knaves" being false means Amy is a **knight**.\n\n' +
        '**Ben.** Amy is a knight, so "Ben is a knight" is true: Ben is a **knight**.\n\n' +
        'Check: Ben says "Cy is a knave", which is true. So there are $2$ knights.',
      whyWrong: [
        'If all three were knaves, Cy\'s "Amy and I are both knaves" would be true, and a knave cannot say something true.',
        'This stops after finding Amy. Amy is a knight, so her statement about Ben is true and Ben is a knight as well.',
        null,
        'Cy can never be a knight, because a knight cannot say he is a knave.',
      ],
      keyIdea: 'Start with the speaker who includes "I am a knave" in a claim: that speaker is a knave and the whole claim is false.',
    },
    check: {
      optionValues: [0, 1, 2, 3],
      compute: () => {
        const s = consistent(3, [
          [0, (w) => w[1]],
          [1, (w) => !w[2]],
          [2, (w) => !w[0] && !w[2]],
        ]);
        return s.length === 1 ? s[0].filter(Boolean).length : -1;
      },
    },
  },
];
