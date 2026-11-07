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
      asking: 'Which type of person is able to say "I am a knave"?',
      solution:
        'A **knight** always tells the truth and a **knave** always lies. Test each type saying the sentence.\n\n' +
        'Suppose a knight says it. He is really a knight, so the sentence is false. Knights never say false things, so a knight cannot say it.\n\n' +
        'Suppose a knave says it. He really is a knave, so the sentence is true. Knaves never say true things, so a knave cannot say it either. So nobody can say it.',
      conclusion: 'Both types fail the test, so the answer is Nobody.',
      whyWrong: [
        'A knight tells the truth, so a knight saying "I am a knave" would be saying something false. That can never happen.',
        'If a knave said "I am a knave", the statement would be true, and a knave never says anything true. Taking the words at face value is the trap here.',
        null,
        'This is the conclusion for "I am a knight", which both types can say. "I am a knave" is the opposite: neither type can say it.',
      ],
      keyIdea: 'To test any statement, assume the speaker is a knight and see if the statement is true. Then assume a knave and see if it is false. If a type fails its test, that type cannot have said it.',
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
      asking: 'What does Ali\'s sentence tell us about how Ali and Bea are related?',
      solution:
        'We do not know Ali\'s type, so test both cases.\n\n' +
        '**Case 1: Ali is a knight.** He tells the truth, so "Bea is a knight" is true. Bea is a knight.\n\n' +
        '**Case 2: Ali is a knave.** He lies, so "Bea is a knight" is false. Bea is a knave.\n\n' +
        'Compare the cases: knight and knight, or knave and knave. We cannot tell which case is real, but in both of them Ali and Bea are the same type.',
      conclusion: 'They match in every possible case, so what must be true is: They are the same type.',
      whyWrong: [
        'Both knights is only one of the two possible cases. Both knaves also works: a knave saying "Bea is a knight" about a knave Bea is a lie, which is allowed.',
        'Different types never works: a knight Ali makes Bea a knight, and a knave Ali makes Bea a knave. Either way they match.',
        'Ali could also be a knave (with Bea a knave too), so Ali is not necessarily a knight. And once Ali\'s type is fixed, Bea\'s is fixed as well.',
        null,
      ],
      keyIdea: 'Use this shortcut: when $X$ says "$Y$ is a knight", $X$ and $Y$ are the same type. When $X$ says "$Y$ is a knave", they are different types. To prove it, split into two cases on the speaker\'s type.',
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
      asking: 'Sam always lies, so what does Sam\'s statement tell us about the weather?',
      solution:
        'Sam is a knave, so what Sam says is false. That means "raining and cold" is false.\n\n' +
        'An "and" statement is true only when both parts are true. So one false part is enough to make it false.\n\n' +
        'So at least one part must be false: it is not raining, or it is not cold. Both could also be false.',
      conclusion: 'That is exactly the option "It is not raining, or it is not cold (or both)."',
      whyWrong: [
        null,
        'This negates each part but keeps the "and". The opposite of "P and Q" is "not P **or** not Q". It could be raining but warm, for example.',
        'This is only one of the three possible situations; it might instead be dry and cold, or dry and warm.',
        'This believes Sam. Sam is a knave, so what he says is false.',
      ],
      keyIdea: 'To see what a lie really tells you, flip the statement. "A and B" is false when at least one part is false. "A or B" is false only when both parts are false.',
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
      asking: 'Follow what Dana says. What type does that make Farah?',
      solution:
        'We are told Dana is a knight, so everything Dana says is true. So Eli really is a knave.\n\n' +
        'Eli is a knave, so everything Eli says is false. Eli says "Farah is a knight", so that sentence must be false.\n\n' +
        'Everyone is one type or the other. So if "Farah is a knight" is false, Farah is a knave.',
      conclusion: 'Eli\'s statement is a lie, so the answer is: Farah is a knave.',
      whyWrong: [
        'This believes Eli. But Dana, a knight, has told us that Eli is a knave, so Eli\'s statement is a lie.',
        null,
        'Farah does not speak, but her type is still fixed: Eli\'s statement about her must be false.',
        'There is no contradiction: Dana a knight, Eli a knave and Farah a knave makes every statement behave correctly.',
      ],
      keyIdea: 'Start from the one person whose type you are told. Their statement tells you the next person\'s type, and that person\'s statement tells you the next. Work along the chain: keep a knight\'s statement as it is, and flip a knave\'s.',
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
      asking: 'Which sentence can be spoken by a truth-teller and also by a liar?',
      solution:
        'A knight can only say something true, and a knave can only say something false. We need a sentence that passes both tests.\n\n' +
        'Test each sentence, then look for the row with Yes in both columns:\n\n| Sentence | True if a knight says it? | False if a knave says it? |\n|---|---|---|\n| $2 + 2 = 4$ | Yes | No: it is true |\n| $2 + 2 = 5$ | No: it is false | Yes |\n| I am a knave | No: it would be false | No: it would be true |\n| I am a knight | Yes | Yes |',
      conclusion: 'From a knight it is true, and from a knave it is a lie, so both can say "I am a knight."',
      whyWrong: [
        'This is true whoever says it, so a knave (who must lie) could never say it. Only knights can.',
        null,
        'This is false from a knight and true from a knave, so **nobody** can say it.',
        'This is false whoever says it, so a knight could never say it. Only knaves can.',
      ],
      keyIdea: 'Draw two columns: true if a knight says it, and false if a knave says it. A plain fact about the world passes only one column. "I am a knight" passes both, and "I am a knave" passes neither.',
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
      asking: 'Ali claims that both of them are knaves. What are Ali and Bea really?',
      solution:
        'Test Ali first, because his sentence is about himself. Suppose Ali is a knight. Then his sentence is true, so he is a knave. A knight cannot be a knave, so this is impossible.\n\n' +
        'So Ali is a knave, and his sentence must be false.\n\n' +
        '"Bea and I are both knaves" is an **and** statement, which is false when at least one part is false. The part about Ali is true, because he is a knave. So the false part must be the part about Bea.\n\n' +
        '"Bea is a knave" is false, so Bea is the other type: a knight.',
      conclusion: 'A knight could never say this, and the lie means Bea is not a knave, so the answer is Ali knave, Bea knight.',
      whyWrong: [
        'If Ali were a knight, his statement "we are both knaves" would have to be true, making him a knave. A knight can never claim to be a knave.',
        'Ali cannot be a knight, whatever Bea is: a knight\'s statement must be true, but "Bea and I are both knaves" would then call a knight a knave.',
        null,
        'If both were knaves, Ali\'s statement would be true, but a knave cannot say something true. This is the trap of believing a liar.',
      ],
      keyIdea: 'When a sentence includes "I am a knave" as one part of an "and", a knight cannot say it, so the speaker is a knave. The whole sentence is then false, so find which part can still be false.',
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
      asking: 'Omar says at least one of the two is a knave. What are Omar and Lina?',
      solution:
        '"At least one" means one or both. Test Omar first, because the sentence includes him.\n\n' +
        'Suppose Omar is a knave. Then "at least one of us is a knave" would be true, because Omar himself is one. A knave cannot say something true, so Omar cannot be a knave.\n\n' +
        'So Omar is a knight, and his sentence is true: at least one of them is a knave.\n\n' +
        'Omar is not the knave, so the knave must be Lina.',
      conclusion: 'Omar must be truthful, and the knave must be the other person, so the answer is Omar knight, Lina knave.',
      whyWrong: [
        null,
        'If both were knights, "at least one of us is a knave" would be false, but a knight cannot say something false.',
        'If Omar were a knave, his statement would actually be **true** (he himself is a knave), and knaves cannot tell the truth.',
        'Two knaves make the statement true, so Omar, a knave, would be telling the truth: impossible.',
      ],
      keyIdea: '"At least one of us is a knave" can never come from a knave, because it would be true. So the speaker is a knight and the other person is a knave. With any "or" sentence, ask first what happens if the speaker is a knave.',
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
      asking: 'Which of Amir, Bella and Chen are knights, and which are knaves?',
      solution:
        'Chen\'s sentence says the most, so test Chen first. Suppose Chen is a knight. Then his sentence is true: Amir and Bella are both knaves.\n\n' +
        'Now look at Amir in that case. He says "Bella is a knave", and Bella is a knave here, so Amir has said something true. But he is supposed to be a knave. That is impossible, so Chen is not a knight.\n\n' +
        'So Chen is a knave.\n\n' +
        'Bella says "Chen is a knave". That is true, so Bella tells the truth and she is a knight.\n\n' +
        'Amir says "Bella is a knave". That is false, so Amir is a knave. Check Chen\'s sentence: "Amir and Bella are both knaves" is false because Bella is a knight, which fits Chen being a knave.',
      conclusion: 'Only this assignment makes every statement match its speaker, so the answer is Amir knave, Bella knight, Chen knave.',
      whyWrong: [
        'Here Bella would be a knave saying "Chen is a knave" while Chen is a knight, which is false: fine so far. But knight Chen\'s claim "Amir and Bella are both knaves" would be false because Amir is a knight. Contradiction.',
        'This believes Chen. With Amir and Bella both knaves, Amir\'s statement "Bella is a knave" would be true, and a knave cannot say something true.',
        'Here knave Bella says "Chen is a knave", which would be true because Chen is a knave. A knave cannot tell the truth.',
        null,
      ],
      keyIdea: 'Start with the person whose statement says the most. Suppose they are a knight and follow the consequences. A contradiction means they are a knave. Each person\'s type then fixes the next person\'s, and a final look at every statement confirms it.',
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
      asking: 'How many of Dina, Eli and Farah are telling the truth?',
      solution:
        '"Us" means all three people. Start with Farah. If she were a knight, her sentence would be true, which would make her a knave. That is impossible, so Farah is a knave.\n\n' +
        'Farah\'s sentence is false, so not all three are knaves. At least one person is a knight, and it must be Dina or Eli.\n\n' +
        'Dina and Eli cannot both be knights, because "exactly one" and "exactly two" cannot both be true.\n\n' +
        'So Farah is out, Dina and Eli are not both in, and at least one of them is. That leaves one knight in total. Dina\'s "exactly one" is then true, so she is the knight, and Eli\'s "exactly two" is false, so he is a knave.',
      conclusion: 'Dina is the only knight, so the number of knights is $1$.',
      whyWrong: [
        'Zero knights means all three are knaves, which would make Farah\'s statement true. A knave cannot say something true.',
        null,
        'Two knights would make Eli a knight, and the second knight would have to be Dina (Farah can never be a knight). But then Dina\'s "exactly one" would be false.',
        'Dina and Eli contradict each other, so they cannot both be knights, and Farah can never be a knight.',
      ],
      keyIdea: 'When statements count knights, suppose each possible count in turn (0, 1, 2, 3). A count works only if the people whose statements match it are the knights, and there are exactly that many of them.',
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
      asking: 'Yusuf makes an if-then claim about himself and Sara. What are they both?',
      solution:
        'An if-then statement is false in only one situation: the "if" part is true and the "then" part is false. In every other situation it counts as true. So if the "if" part is false, the whole statement is true.\n\n' +
        'Suppose Yusuf is a knave. Then the "if" part, "I am a knight", is false, so the whole statement is true. A knave cannot say something true, so Yusuf is not a knave.\n\n' +
        'So Yusuf is a knight, and his whole statement is true.\n\n' +
        'Now the "if" part, "I am a knight", is also true. For the statement to be true, the "then" part must be true as well. So "Sara is a knight" is true.',
      conclusion: 'Yusuf cannot be a knave, and his true statement forces Sara to be a knight, so the answer is Both knights.',
      whyWrong: [
        null,
        'With Yusuf a knight and Sara a knave, the "if" part is true and the "then" part is false, so the statement is false. Knights never say false things.',
        'If Yusuf were a knave, the "if" part ("I am a knight") would be false, which makes the whole if-then statement true. A knave cannot say it.',
        'Whatever Sara is, a knave Yusuf makes the "if" part false and so the statement automatically true. This answer forgets that a false "if" part makes an if-then statement true.',
      ],
      keyIdea: 'Read "If I am a knight, then $X$" like this. For a knave, the "if" part is false, so the statement would be true, and a knave cannot say it. So the speaker is a knight, and $X$ must be true.',
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
      asking: 'Who ate the cake, if only one of the three statements is true?',
      solution:
        'We do not know who ate it, so try each person as the eater. Once the eater is fixed, every statement is either true or false.\n\n' +
        'Mark each statement and count the true ones. We need a count of exactly 1:\n\n| If the eater is | Hana says "Jude" | Imran says "Jude" | Jude says "Hana" | Number true |\n|---|---|---|---|---|\n| Hana | false | false | true | 1 |\n| Imran | false | false | false | 0 |\n| Jude | true | true | false | 2 |',
      conclusion: 'Only the first row gives exactly one true statement, so the answer is Hana.',
      whyWrong: [
        null,
        'If Imran ate it, every statement would be false: 0 true statements, not 1.',
        'If Jude ate it, Hana\'s and Imran\'s statements would both be true: 2 true statements, not 1. This comes from believing the claim made twice.',
        'Trying each of the three suspects leaves exactly one who gives one true statement, so the culprit can be determined.',
      ],
      keyIdea: 'When exactly one statement is true (or false) and one person did it, draw a table with one row per suspect and one column per statement. Mark each true or false, then count. The suspect with the required count is the answer.',
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
      asking: 'Bea and Cal each make a claim. What types are they?',
      solution:
        'Start with Bea, and split into two cases. If Bea is a knight, "Cal is a knight" is true, so Cal is a knight. If Bea is a knave, the sentence is false, so Cal is a knave.\n\n' +
        'In both cases they match. So Bea and Cal are the same type.\n\n' +
        'Now Cal says "Bea and I are of different types". We have just seen that this is false. Only a knave says something false, so Cal is a knave.\n\n' +
        'Bea is the same type as Cal, so Bea is a knave too.',
      conclusion: 'Cal\'s claim is false, so he is a knave, and Bea matches him, so the answer is Both knaves.',
      whyWrong: [
        'If both were knights, Cal\'s claim "we are of different types" would be false, but a knight cannot say something false.',
        'Here Bea is a knight, so her claim "Cal is a knight" would have to be true, but in this option Cal is a knave. Contradiction.',
        'Here Bea is a knave who says "Cal is a knight", which would be true. A knave cannot say something true. This answer believes Cal\'s claim of being different.',
        null,
      ],
      keyIdea: 'Turn each "$X$ is a knight" into "same type", and each "$X$ is a knave" into "different types". Then compare these facts with the other statements. A statement you know is false comes from a knave, and one you know is true comes from a knight.',
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
      asking: 'Who broke the beaker, if only one of the three statements is false?',
      solution:
        'Quinn says "Pia is lying". If Pia\'s statement is true, Quinn\'s is false. If Pia\'s is false, Quinn\'s is true. So exactly one of those two statements is false.\n\n' +
        'We are told there is exactly one false statement in total, and it is one of those two. So Ravi\'s statement must be true.\n\n' +
        'Ravi says "I broke it", and that is true, so Ravi broke it. Check the count: Pia\'s "Quinn broke it" is false, Quinn\'s "Pia is lying" is true, and Ravi\'s is true. That is one false statement.',
      conclusion: 'Pia and Quinn use up the single false statement, so the third speaker is truthful and the answer is Ravi.',
      whyWrong: [
        'If Pia did it, her own statement and Ravi\'s would both be false: 2 false statements, not 1.',
        'This believes Pia. If Quinn did it, Quinn\'s and Ravi\'s statements would both be false: 2 false statements, not 1.',
        null,
        'Only one of the three suspects gives exactly one false statement, so the culprit can be determined.',
      ],
      keyIdea: 'Look for two statements that contradict each other, such as "$X$ is lying". Exactly one of that pair is false. If the puzzle allows just one false statement, every other statement must be true, so use those to find the answer.',
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
      asking: 'What do we know for certain about anything a knave says?',
      solution:
        'A knave **always** lies. There are no exceptions, whatever the topic.\n\n' +
        'A lie is a statement that is not true, so anything a knave says is false.',
      conclusion: 'Lying always means saying something untrue, so about any statement by a knave we can say: It is false.',
      whyWrong: [
        null,
        'This describes a knight. A knave never says anything true.',
        'This describes an ordinary person. A knave always lies, with no exceptions.',
        'A knave can talk about anything. What is fixed is that the statement is false, not its subject.',
      ],
      keyIdea: 'Turn each person\'s type into a test: a knight\'s statement must be true and a knave\'s statement must be false. Every knights and knaves puzzle comes down to applying this test to each speaker.',
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
      asking: 'Can we work out Zed\'s type from the sentence "I am a knight"?',
      solution:
        'Suppose Zed is a knight. Then "I am a knight" is true, and knights say true things. That works.\n\n' +
        'Suppose Zed is a knave. Then "I am a knight" is false, and knaves say false things. That works too, so both cases are possible and we learn nothing about Zed.',
      conclusion: 'A knight and a knave can both say it, so it tells us Nothing: either type can say it.',
      whyWrong: [
        null,
        'This believes the speaker. A knave would also claim to be a knight, because for a knave that claim is a lie.',
        'A knight can truthfully say this, so the statement does not prove that Zed is a knave.',
        'This is the fact about "I am a knave". "I am a knight" can be said by both types.',
      ],
      keyIdea: 'To see what a statement proves, test both types. If only one type can say it, you know the speaker\'s type. If both can, it tells you nothing. If neither can, the situation is impossible.',
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
      asking: 'What does Ali\'s sentence tell us about how Ali and Bea are related?',
      solution:
        'We do not know Ali\'s type, so test both cases.\n\n' +
        '**Case 1: Ali is a knight.** His sentence is true, so Bea is a knave. That gives one knight and one knave.\n\n' +
        '**Case 2: Ali is a knave.** His sentence is false, so Bea is a knight. That gives one knave and one knight.\n\n' +
        'We cannot tell which case is real, but in both of them Ali and Bea are different types.',
      conclusion: 'There is one of each in every possible case, so what must be true is: They are different types.',
      whyWrong: [
        null,
        'This is the rule for "Bea is a knight". Saying "Bea is a knave" forces the opposite: different types.',
        'This believes Ali. Ali could be a knave, with Bea a knight.',
        'This also believes Ali. If Ali is a knave, the statement is false and Bea is a knight.',
      ],
      keyIdea: 'When $X$ says "$Y$ is a knave", $X$ and $Y$ are different types. When $X$ says "$Y$ is a knight", they are the same type. If you forget which is which, test both cases of the speaker.',
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
      asking: 'Whatever Ali is, what type must Bea be?',
      solution:
        'We do not know Ali\'s type, so test both cases.\n\n' +
        '**Case 1: Ali is a knight.** His sentence is true, so exactly one of them is a knight. Ali is that one, so Bea is a knave.\n\n' +
        '**Case 2: Ali is a knave.** His sentence is false, so the number of knights is not one: it is 0 or 2. Ali is not a knight, so it cannot be 2. It is 0, so Bea is a knave here as well.',
      conclusion: 'Both cases lead to the same result, so Bea must be A knave.',
      whyWrong: [
        null,
        'If Bea were a knight, then a knight Ali would make two knights, so his statement would be false. A knave Ali would make exactly one knight, so his statement would be true. Both break the rules.',
        'Ali could be either type, but Bea cannot. This mixes up the person who is undetermined with the person who is fixed.',
        'This is only one of the two cases. When Ali is a knight, he and Bea are different types.',
      ],
      keyIdea: 'When a puzzle asks about just one person, split on the other person\'s type and work out each case. If every case gives the same result, that result is forced. A false "exactly one" means the count is some other number.',
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
      asking: 'Nour and Omar each make a claim. What types are they?',
      solution:
        'Nour says "Omar is a knave". If Nour is a knight, Omar really is a knave. If Nour is a knave, the sentence is false and Omar is a knight. Either way, they are different types.\n\n' +
        'Omar says "Nour and I are both knights". They are different types, so they cannot both be knights. So Omar\'s sentence is false.\n\n' +
        'Only a knave says something false, so Omar is a knave.\n\n' +
        'They are different types, so Nour is a knight.',
      conclusion: 'Omar\'s claim is false, so he is the knave and the other person is the knight: Nour knight, Omar knave.',
      whyWrong: [
        'If both were knights, Nour\'s "Omar is a knave" would be false, and a knight cannot say something false.',
        null,
        'This believes Omar\'s high opinion of himself. A knight Omar must speak the truth, but "both knights" is false when Nour is a knave.',
        'If both were knaves, Nour\'s "Omar is a knave" would be true, and a knave cannot say something true.',
      ],
      keyIdea: 'Use a simple statement first to get a link: "$X$ is a knave" means different types. Then test the other statement against that link. If the link makes it false, its speaker is a knave. If true, its speaker is a knight.',
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
      asking: 'Can any mix of knights and knaves fit both statements?',
      solution:
        'Cal says "Dee is a knight". A knight Cal makes Dee a knight, and a knave Cal makes Dee a knave. Either way, they are the **same** type.\n\n' +
        'Dee says "Cal is a knave". A knight Dee makes Cal a knave, and a knave Dee makes Cal a knight. Either way, they are **different** types.\n\n' +
        'They cannot be the same type and different types at once. So no mix of types fits both statements.',
      conclusion: 'The two statements demand opposite things, so the answer is: This situation is impossible.',
      whyWrong: [
        'If both were knights, Dee\'s "Cal is a knave" would be false, and a knight cannot say something false.',
        'If Dee were a knave, Cal\'s "Dee is a knight" would be false, and a knight Cal cannot say something false.',
        'If both were knaves, Dee\'s "Cal is a knave" would be true, and a knave cannot say something true.',
        null,
      ],
      keyIdea: 'Turn each one-line claim into a link: "$Y$ is a knight" means same type, and "$Y$ is a knave" means different types. If two links disagree, no assignment works and the situation is impossible.',
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
      asking: 'How many of Amy, Ben and Cy are knights?',
      solution:
        'Start with Cy, whose sentence includes himself. If Cy were a knight, his sentence would be true, making him a knave. That is impossible, so Cy is a knave.\n\n' +
        'So Cy\'s sentence is false. "Amy and I are both knaves" is false when at least one part is false. The part about Cy is true, so the part about Amy must be false. Amy is a knight.\n\n' +
        'Amy tells the truth, so "Ben is a knight" is true. Ben is a knight.\n\n' +
        'Ben says "Cy is a knave", which is true, so Ben\'s statement fits. Now count: Amy and Ben are knights, and Cy is not. That makes 2 knights.',
      conclusion: 'Amy and Ben are knights and Cy is a knave, so the number of knights is $2$.',
      whyWrong: [
        'If all three were knaves, Cy\'s "Amy and I are both knaves" would be true, and a knave cannot say something true.',
        'This stops after finding Amy. Amy is a knight, so her statement about Ben is true and Ben is a knight as well.',
        null,
        'Cy can never be a knight, because a knight cannot say he is a knave.',
      ],
      keyIdea: 'Start with anyone who calls themselves a knave, even as part of an "and": they must be a knave. Then flip their statement and follow each "$X$ is a knight" along the chain. Count only after testing every statement.',
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
