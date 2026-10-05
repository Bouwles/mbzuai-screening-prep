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

const ISLAND = 'On an island, every inhabitant is either a **knight**, who always tells the truth, or a **knave**, who always lies.';

export const questions: StaticQuestion[] = [
  // ================================================================ foundation
  {
    id: 'knights-knaves-001',
    subtopic: 'knights-knaves',
    difficulty: 'foundation',
    stem: `${ISLAND} A visitor claims she heard one inhabitant say: "I am a knave." What can you conclude?`,
    options: [
      'The speaker is a knight.',
      'The speaker is a knave.',
      "No inhabitant could ever say this, so the visitor's report must be wrong.",
      'The speaker could be either a knight or a knave.',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'Try both possible types for the speaker.\n\n' +
        '- **Speaker is a knight.** Then "I am a knave" is false. But knights only say true things. Contradiction.\n' +
        '- **Speaker is a knave.** Then "I am a knave" is true. But knaves only say false things. Contradiction.\n\n' +
        'Both cases are impossible, so **no inhabitant can say "I am a knave"**. So the visitor\'s report must be wrong (she misheard, or she is mistaken about what was said).\n\n' +
        'Remember this fact: it is the starting point of many harder puzzles.',
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
      'Ali and Bea are both knights.',
      'Ali and Bea are of different types.',
      'Ali is a knight, but Bea could be either type.',
      'Ali and Bea are the same type (both knights or both knaves).',
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
      'Ali and Bea are both knights.',
      'Ali is a knight and Bea is a knave.',
      'Ali is a knave and Bea is a knight.',
      'Ali and Bea are both knaves.',
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
      'Omar is a knight and Lina is a knave.',
      'Omar and Lina are both knights.',
      'Omar is a knave and Lina is a knight.',
      'Omar and Lina are both knaves.',
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
    stem: `${ISLAND} You meet three inhabitants.\n\n- Amir says: "Bella is a knave."\n- Bella says: "Chen is a knave."\n- Chen says: "Amir and Bella are both knaves."\n\nWhat are they?`,
    options: [
      'Amir is a knight, Bella is a knave, Chen is a knight.',
      'Amir is a knave, Bella is a knave, Chen is a knight.',
      'Amir is a knight, Bella is a knave, Chen is a knave.',
      'Amir is a knave, Bella is a knight, Chen is a knave.',
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
    stem: `${ISLAND} Three inhabitants make these statements.\n\n- Dina: "Exactly one of us three is a knight."\n- Eli: "Exactly two of us three are knights."\n- Farah: "All three of us are knaves."\n\nHow many of them are knights?`,
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
      'Yusuf and Sara are both knights.',
      'Yusuf is a knight and Sara is a knave.',
      'Yusuf is a knave and Sara is a knight.',
      'Yusuf and Sara are both knaves.',
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
    stem: 'Exactly one of four friends ate the last slice of pizza. Each makes one statement.\n\n- Hana: "Imran ate it."\n- Imran: "I didn\'t eat it."\n- Jude: "Hana ate it."\n- Kira: "Imran didn\'t eat it."\n\nExactly **one** of the four statements is **true**. Who ate the pizza?',
    options: ['Hana', 'Imran', 'Jude', 'Kira'],
    correctIndex: 1,
    markScheme: {
      solution:
        '**Spot the pair.** Imran and Kira make the *same* claim ("Imran didn\'t eat it"), so they are both true or both false. Only one statement is true, so they cannot both be true. Hence both are **false**, which means **Imran ate it**.\n\n' +
        'Check every suspect by counting true statements:\n\n' +
        '| Culprit | Hana | Imran | Jude | Kira | Number true |\n|---|---|---|---|---|---|\n' +
        '| Hana | false | true | true | true | 3 |\n' +
        '| Imran | true | false | false | false | **1** |\n' +
        '| Jude | false | true | false | true | 2 |\n' +
        '| Kira | false | true | false | true | 2 |\n\n' +
        'Only "Imran ate it" gives exactly one true statement (Hana\'s). Imran ate the pizza.',
      whyWrong: [
        'If Hana ate it, Imran\'s, Jude\'s and Kira\'s statements would all be true: 3 true statements, not 1.',
        null,
        'If Jude ate it, Imran\'s and Kira\'s statements would both be true: 2 true statements, not 1.',
        'If Kira ate it, Imran\'s and Kira\'s statements would both be true: 2 true statements, not 1.',
      ],
      keyIdea: 'For "exactly one statement is true" puzzles, try each suspect and count the true statements; identical or opposite statements give a quick shortcut.',
    },
    check: {
      optionValues: ['Hana', 'Imran', 'Jude', 'Kira'],
      compute: () => {
        const names = ['Hana', 'Imran', 'Jude', 'Kira'];
        return culprits(names, [(c) => c === 1, (c) => c !== 1, (c) => c === 0, (c) => c !== 1], true, 1);
      },
    },
  },
  {
    id: 'knights-knaves-012',
    subtopic: 'knights-knaves',
    difficulty: 'exam',
    stem: `${ISLAND} Bea says: "Cal is a knight." Cal says: "Bea and I are of different types." What are Bea and Cal?`,
    options: [
      'Bea and Cal are both knights.',
      'Bea is a knight and Cal is a knave.',
      'Bea is a knave and Cal is a knight.',
      'Bea and Cal are both knaves.',
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
    stem: 'Exactly one of four students broke a beaker in the lab. Each makes one statement.\n\n- Pia: "It was Quinn or Ravi."\n- Quinn: "It wasn\'t me."\n- Ravi: "It was Sami."\n- Sami: "Ravi is lying."\n\nExactly **one** of the four statements is **false**. Who broke the beaker?',
    options: ['Pia', 'Quinn', 'Ravi', 'Sami'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Spot the contradiction.** Sami says Ravi is lying, so Ravi and Sami cannot both be telling the truth, and they cannot both be lying either: **exactly one of them is false**.\n\n' +
        'Only one statement in total is false, so Pia and Quinn are both **true**.\n\n' +
        '- Pia (true): it was Quinn or Ravi.\n' +
        '- Quinn (true): it wasn\'t Quinn.\n\n' +
        'So **Ravi** broke it.\n\n' +
        'Check: Ravi\'s "It was Sami" is false and Sami\'s "Ravi is lying" is true. That is exactly one false statement. Checking the other suspects:\n\n' +
        '| Culprit | Pia | Quinn | Ravi | Sami | Number false |\n|---|---|---|---|---|---|\n' +
        '| Pia | false | true | false | true | 2 |\n' +
        '| Quinn | true | false | false | true | 2 |\n' +
        '| Ravi | true | true | false | true | **1** |\n' +
        '| Sami | false | true | true | false | 2 |',
      whyWrong: [
        'If Pia did it, both her own statement and Ravi\'s would be false: 2 false statements, not 1.',
        'If Quinn did it, Quinn\'s "It wasn\'t me" and Ravi\'s "It was Sami" would both be false: 2 false statements. This comes from trusting Pia but ignoring Quinn.',
        null,
        'This believes Ravi. If Sami did it, Pia\'s statement and Sami\'s statement would both be false: 2 false statements, not 1.',
      ],
      keyIdea: 'When one person says another is lying, exactly one of those two statements is false, which tells you the rest must be true.',
    },
    check: {
      optionValues: ['Pia', 'Quinn', 'Ravi', 'Sami'],
      compute: () => {
        const names = ['Pia', 'Quinn', 'Ravi', 'Sami'];
        const ravi = (c: number) => c === 3;
        return culprits(names, [(c) => c === 1 || c === 2, (c) => c !== 1, ravi, (c) => !ravi(c)], false, 1);
      },
    },
  },

  // ================================================================ challenge
  {
    id: 'knights-knaves-014',
    subtopic: 'knights-knaves',
    difficulty: 'challenge',
    stem: 'A list contains exactly these four statements.\n\n1. At least one of these four statements is false.\n2. At least two of these four statements are false.\n3. At least three of these four statements are false.\n4. All four of these statements are false.\n\nHow many of the four statements are true?',
    options: ['Exactly $1$', 'Exactly $2$', 'Exactly $3$', 'None: no consistent answer exists (it is a paradox).'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Let $f$ be the number of false statements. Statement $k$ says "at least $k$ are false", so statement $k$ is true exactly when $k \\le f$.\n\n' +
        'That makes statements $1, 2, \\ldots, f$ true, so there are $f$ true statements, and therefore $4 - f$ false ones. But the number of false statements is $f$:\n\n' +
        '$$4 - f = f \\quad \\Rightarrow \\quad f = 2$$\n\n' +
        'So statements 1 and 2 are true, statements 3 and 4 are false.\n\n' +
        'Check by trying every value of $f$:\n\n' +
        '| $f$ (claimed false) | Statements that would be true | Actual number false | Consistent? |\n|---|---|---|---|\n' +
        '| 0 | none | 4 | no |\n| 1 | 1 | 3 | no |\n| 2 | 1, 2 | 2 | **yes** |\n| 3 | 1, 2, 3 | 1 | no |\n| 4 | 1, 2, 3, 4 | 0 | no |\n\n' +
        'Exactly $2$ statements are true.',
      whyWrong: [
        'If only statement 1 were true, three statements would be false, which would make statements 2 and 3 true as well. Contradiction.',
        null,
        'If statements 1 to 3 were true, only one statement would be false, but then statements 2 and 3 ("at least two/three are false") would be false. Contradiction.',
        'There is a consistent answer: with 1 and 2 true and 3 and 4 false, exactly two are false, which matches every statement. Try every possible count before calling it a paradox.',
      ],
      keyIdea: 'For self-referential lists, let the number of false statements be $f$, work out which statements that makes true, and require the counts to agree.',
    },
    check: {
      optionValues: [1, 2, 3, null],
      compute: () => {
        const ok = allWorlds(4).filter((t) => {
          const falseCount = t.filter((x) => !x).length;
          return t.every((isTrue, i) => isTrue === (falseCount >= i + 1));
        });
        return ok.length === 1 ? ok[0].filter(Boolean).length : -1;
      },
    },
  },
  {
    id: 'knights-knaves-015',
    subtopic: 'knights-knaves',
    difficulty: 'challenge',
    stem: `${ISLAND} You meet Gil, Hiba and Ivo.\n\n- Gil says: "All three of us are knaves."\n- Hiba says: "Exactly one of us three is a knight."\n\nIvo says nothing. What are they?`,
    options: [
      'Gil is a knave, Hiba is a knight, Ivo is a knave.',
      'Gil is a knave, Hiba is a knave, Ivo is a knight.',
      'Gil is a knave, Hiba is a knight, Ivo is a knight.',
      'Gil, Hiba and Ivo are all knaves.',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Gil.** A knight cannot say "all of us are knaves" (it would include "I am a knave"). So **Gil is a knave**, and his statement is false: **at least one** of the three is a knight.\n\n' +
        '**Hiba, case 1: knight.** Then exactly one of them is a knight, and that knight is Hiba. So Ivo is a knave. Check Gil: "all knaves" is false because Hiba is a knight. Everything fits.\n\n' +
        '**Hiba, case 2: knave.** Then Gil and Hiba are knaves, and at least one person is a knight, so Ivo is a knight. But then there is **exactly one** knight, which makes Hiba\'s statement true. A knave cannot say something true. Contradiction.\n\n' +
        'So Gil is a knave, Hiba is a knight and Ivo is a knave. Ivo never spoke, but the others\' statements still fix his type.',
      whyWrong: [
        null,
        'This makes Ivo the only knight, so "exactly one of us is a knight" would be true, but Hiba is a knave here and cannot say something true.',
        'With two knights, Hiba\'s "exactly one of us is a knight" would be false, but Hiba is a knight here. This forgets to recheck Hiba\'s statement after choosing Ivo.',
        'If all three were knaves, Gil\'s statement "all three of us are knaves" would be true, which a knave cannot say.',
      ],
      keyIdea: 'Use the impossible self-accusation to fix one person, then test the remaining cases and recheck every statement, including the one that seemed settled.',
    },
    check: {
      optionValues: ['NKN', 'NNK', 'NKK', 'NNN'],
      compute: () => {
        const count = (w: W) => w.filter(Boolean).length;
        return solve(3, [
          [0, (w) => count(w) === 0],
          [1, (w) => count(w) === 1],
        ]);
      },
    },
  },
  {
    id: 'knights-knaves-016',
    subtopic: 'knights-knaves',
    difficulty: 'challenge',
    stem: `${ISLAND} You stand in front of two doors: one leads to freedom, the other to a dungeon. Each door has a guard. One guard is a knight and the other is a knave, but you do not know which is which. You may ask **one** guard **one** yes/no question.\n\nWhich question lets you work out the correct door from the answer, **whichever** guard you ask?`,
    options: [
      '"Are you a knight?"',
      '"Does the left door lead to freedom?"',
      '"Is the other guard a knave?"',
      '"If I asked the other guard whether the left door leads to freedom, would he say yes?"',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        'Write $L$ for "the left door leads to freedom". Check what each guard actually **replies** to the nested question.\n\n' +
        '- **You ask the knight.** The other guard is the knave, who would lie about $L$. The knight truthfully reports that lie. Reply: the **opposite** of the truth.\n' +
        '- **You ask the knave.** The other guard is the knight, who would tell the truth about $L$. The knave lies about that. Reply: the **opposite** of the truth.\n\n' +
        'Either way the reply is the opposite of the truth (exactly one lie happens along the chain). So if the answer is "yes", take the **right** door; if "no", take the left.\n\n' +
        'The other questions fail:\n\n' +
        '| Question | Knight replies | Knave replies | Useful? |\n|---|---|---|---|\n' +
        '| "Are you a knight?" | yes | yes | no |\n' +
        '| "Does the left door lead to freedom?" | the truth | the opposite | no (you do not know who you asked) |\n' +
        '| "Is the other guard a knave?" | yes | yes | no |\n' +
        '| nested question | the opposite | the opposite | **yes** |',
      whyWrong: [
        'Both guards answer "yes": the knight truthfully, the knave as a lie. The reply says nothing about the doors.',
        'The knight gives the truth and the knave gives the opposite, and you do not know which guard you asked, so the answer cannot be trusted.',
        'The knight says "yes" (the other really is a knave) and the knave also says "yes" (lying about the knight). The same reply every time, and nothing about the doors.',
        null,
      ],
      keyIdea: 'Route the question through both a knight and a knave so that exactly one lie always happens; then the answer is reliably the opposite of the truth.',
    },
    check: {
      optionValues: ['self', 'direct', 'otherType', 'nested'],
      compute: () => {
        // truthful answer to each question, given (asked guard is a knight, left door is free)
        const qs: [string, (askedKnight: boolean, left: boolean) => boolean][] = [
          ['self', (k) => k],
          ['direct', (_k, left) => left],
          ['otherType', (k) => !!k], // the other guard is a knave exactly when the asked guard is a knight
          ['nested', (k, left) => (!k ? left : !left)], // what the other guard would reply about the left door
        ];
        const reply = (q: (k: boolean, l: boolean) => boolean, k: boolean, l: boolean) => (k ? q(k, l) : !q(k, l));
        return qs
          .filter(([, q]) => {
            const sameForBoth = [true, false].every((l) => reply(q, true, l) === reply(q, false, l));
            const tellsDoors = reply(q, true, true) !== reply(q, true, false);
            return sameForBoth && tellsDoors;
          })
          .map(([l]) => l)
          .join('|');
      },
    },
  },
  {
    id: 'knights-knaves-017',
    subtopic: 'knights-knaves',
    difficulty: 'challenge',
    stem: `${ISLAND} Three inhabitants, Amal, Bilal and Carla, stand together. Amal says: "Bilal and Carla are the same type." You then ask Carla: "Are Amal and Bilal the same type?" What does Carla answer?`,
    options: [
      '"Yes"',
      '"No"',
      '"Yes" if Carla is a knight, "No" if Carla is a knave',
      '"Yes" if Amal is a knight, "No" if Amal is a knave',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        'Amal\'s statement must be true if Amal is a knight and false if Amal is a knave. That leaves exactly four possible worlds. For each, work out the true answer to "Are Amal and Bilal the same type?" and then what Carla actually says (a knight says the truth, a knave says the opposite).\n\n' +
        '| Amal | Bilal | Carla | Amal\'s claim | True answer | Carla says |\n|---|---|---|---|---|---|\n' +
        '| knight | knight | knight | true | yes | **yes** |\n' +
        '| knight | knave | knave | true | no | **yes** (lie) |\n' +
        '| knave | knight | knave | false | no | **yes** (lie) |\n' +
        '| knave | knave | knight | false | yes | **yes** |\n\n' +
        'In every possible world Carla answers **"Yes"**. (Reason: "Amal is a knight" matches "Bilal and Carla are the same type"; the same pattern makes "Carla is a knight" match "Amal and Bilal are the same type", which is exactly the condition for Carla to answer yes.)',
      whyWrong: [
        null,
        'Carla never answers "No" in any of the four possible worlds. This comes from checking only one world and forgetting that a knave reverses the true answer.',
        'This ignores the information from Amal. When Carla is a knave, the true answer is always "no", so her lie is "yes".',
        'When Amal is a knave, the true answer is "no" only if Carla is a knave, who then lies and says "yes"; when the true answer is "yes", Carla is a knight and says "yes". So Carla says "yes" either way.',
      ],
      keyIdea: 'List only the worlds consistent with the first statement, then for each one apply "a knave flips the true answer": the reply turns out to be the same in every world.',
    },
    check: {
      optionValues: ['yes', 'no', 'depC', 'depA'],
      compute: () => {
        const worlds = consistent(3, [[0, (w) => w[1] === w[2]]]);
        const says = worlds.map((w) => (w[2] ? w[0] === w[1] : w[0] !== w[1]));
        if (says.every((x) => x)) return 'yes';
        if (says.every((x) => !x)) return 'no';
        if (worlds.every((w, i) => says[i] === w[2])) return 'depC';
        if (worlds.every((w, i) => says[i] === w[0])) return 'depA';
        return 'other';
      },
    },
  },
  {
    id: 'knights-knaves-018',
    subtopic: 'knights-knaves',
    difficulty: 'challenge',
    stem: `${ISLAND} Six inhabitants stand in a row, numbered 1 to 6. Person 1 says "Exactly 1 of us six is a knave", person 2 says "Exactly 2 of us six are knaves", and so on, up to person 6, who says "Exactly 6 of us six are knaves". Which of the following is true?`,
    options: [
      'Only person 1 is a knight.',
      'Only person 5 is a knight.',
      'Only person 6 is a knight.',
      'All six are knaves.',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'The six statements give six **different** numbers of knaves, so at most one of them can be true. That means at most one knight.\n\n' +
        '**Could there be no knights?** Then there are 6 knaves, which makes person 6\'s statement true. But person 6 would be a knave. Contradiction.\n\n' +
        '**So there is exactly one knight**, and therefore exactly $6 - 1 = 5$ knaves. The person telling the truth is the one who said "exactly 5", which is **person 5**.\n\n' +
        'Check: 5 knaves (persons 1, 2, 3, 4, 6), each of whom said a wrong number, so they all lie. Person 5 says 5, which is true.',
      whyWrong: [
        'This mixes up knights and knaves: there is exactly one **knight**, so there are 5 knaves, not 1. Person 1\'s claim of 1 knave is false.',
        null,
        'If only person 6 were a knight there would be 5 knaves, so person 6\'s claim of 6 knaves would be false. A knight cannot say that.',
        'With six knaves, person 6\'s statement "exactly 6 of us are knaves" would be true, so person 6 could not be a knave.',
      ],
      keyIdea: 'Mutually exclusive "exactly k" claims allow at most one knight; rule out zero knights, then the knave count is the total minus one.',
    },
    check: {
      optionValues: [1, 5, 6, 0],
      compute: () => {
        const said: Said[] = [1, 2, 3, 4, 5, 6].map((k) => [k - 1, (w: W) => w.filter((x) => !x).length === k] as Said);
        const s = consistent(6, said);
        if (s.length !== 1) return -1;
        const knights = s[0].map((k, i) => (k ? i + 1 : 0)).filter((x) => x > 0);
        return knights.length === 0 ? 0 : knights.length === 1 ? knights[0] : -1;
      },
    },
  },
];
