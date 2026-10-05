import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'knights-knaves',
  know:
    '### The set-up\n\n' +
    'These puzzles take place on an island where every inhabitant is one of two types:\n\n' +
    '- a **knight** always tells the truth (every statement they make is true);\n' +
    '- a **knave** always lies (every statement they make is false).\n\n' +
    'You are told what some people say, and you must work out who is which. There is no maths formula to memorise. The whole skill is **careful case checking**.\n\n' +
    '### The one rule you need\n\n' +
    'A situation is possible only if **every knight\'s statement is true and every knave\'s statement is false**. Turn each statement into this check:\n\n' +
    '| Speaker is... | Their statement must be... |\n|---|---|\n| knight | true |\n| knave | false |\n\n' +
    'So you never just "believe" a statement. You ask: *if this person were a knight, would the statement be true? If they were a knave, would it be false?*\n\n' +
    '### Case analysis (the main method)\n\n' +
    'Pick one person and **suppose** they are a knight. Follow the consequences. If you reach a contradiction, that case is impossible, so they must be a knave. Then do the same for the next person.\n\n' +
    'With $n$ people there are only $2^n$ possible cases ($4$ for two people, $8$ for three). If you are stuck, list them all in a table and cross out every row where someone\'s statement does not match their type. The row that survives is the answer.\n\n' +
    'Tip: start with the person whose statement says the **most** (for example "we are all knaves"), because it breaks quickly.\n\n' +
    '### Self-referential statements\n\n' +
    'Statements about the speaker are where most marks are won:\n\n' +
    '- "**I am a knave**" can be said by **nobody**: false from a knight, true from a knave.\n' +
    '- "**I am a knight**" can be said by **anyone**, so it tells you nothing.\n' +
    '- Anyone who says "**we are both knaves**" or "**all of us are knaves**" must be a knave (a knight would be calling himself a knave). Then the statement is false, so at least one other person is a knight.\n' +
    '- A knave can never say "**at least one of us is a knave**", because his own presence makes it true. So the speaker is a knight, and someone else is a knave.\n' +
    '- "X says Y is a knight" means X and Y are the **same** type. "X says Y is a knave" means they are **different** types.\n\n' +
    '### Negating statements correctly\n\n' +
    'When you know someone is a knave, you need the **opposite** of what they said. Be careful with "and", "or" and "if":\n\n' +
    '- The opposite of "P **and** Q" is "not P **or** not Q" (at least one part fails).\n' +
    '- The opposite of "P **or** Q" is "not P **and** not Q" (both parts fail).\n' +
    '- "**If** P **then** Q" is false only when P is true and Q is false. If P is false, the whole statement counts as true.\n' +
    '- The opposite of "exactly 2 are knights" is "the number of knights is **not** 2" (it could be 0, 1 or 3).\n\n' +
    '### "Exactly one is lying" and who-did-it puzzles\n\n' +
    'Some puzzles have ordinary people instead of knights and knaves: one person committed a crime, everyone makes a statement, and you are told how many statements are true (for example "exactly one is true" or "exactly one is lying").\n\n' +
    'Method: **try each suspect as the culprit**, mark every statement true or false, and count. Keep the suspect that gives the right count.\n\n' +
    'Two shortcuts:\n\n' +
    '- If A says "B is lying" (or A and B say opposite things), exactly **one** of them is true.\n' +
    '- If two people say the **same** thing, they are both true or both false.\n\n' +
    '### Lists of statements about themselves\n\n' +
    'A list like "1. At least one of these is false. 2. At least two are false..." is solved by letting $f$ be the number of false statements, working out which statements that makes true, and requiring the count to agree. The same works for a row of islanders who each claim a number of knaves.',
  formulas: [
    { label: 'Knight rule', tex: '\\text{speaker is a knight} \\iff \\text{statement is true}', note: 'Equivalently: a knave\'s statement is always false.' },
    { label: 'Number of cases', tex: '2^{n} \\text{ cases for } n \\text{ people}', note: 'Small enough to check every case in a table: 4 for two people, 8 for three.' },
    { label: 'Same or different type', tex: 'X \\text{ says "}Y\\text{ is a knight"} \\Rightarrow X, Y \\text{ same type}', note: 'If X says "Y is a knave", X and Y are of different types.' },
    { label: 'Negating "and" (De Morgan)', tex: '\\neg(P \\land Q) \\equiv \\neg P \\lor \\neg Q' },
    { label: 'Negating "or" (De Morgan)', tex: '\\neg(P \\lor Q) \\equiv \\neg P \\land \\neg Q' },
    { label: 'When "if P then Q" is false', tex: 'P \\Rightarrow Q \\text{ is false} \\iff P \\text{ true and } Q \\text{ false}', note: 'So a knave can never say "If I am a knight, then ...".' },
    { label: 'Impossible self-statement', tex: '\\text{"I am a knave"} \\text{ cannot be said by anyone}', note: '"I am a knight" can be said by anyone.' },
    { label: 'Contradicting pair', tex: 'A \\text{ says "}B\\text{ is lying"} \\Rightarrow \\text{exactly one of } A, B \\text{ is true}' },
  ],
  examples: [
    {
      title: 'One speaker, two people',
      problem: 'Zaid says: "Maya and I are both knaves." What are Zaid and Maya?',
      steps: [
        'Suppose Zaid is a knight. Then his statement is true, so Zaid is a knave. Contradiction. So Zaid is a **knave**.',
        'Zaid is a knave, so his statement is false: it is **not** true that both are knaves.',
        'Zaid is a knave, so the one who is not a knave must be Maya: Maya is a **knight**.',
        'Check: a knave Zaid says "we are both knaves", which is false because Maya is a knight. Correct.',
      ],
      answer: 'Zaid is a knave and Maya is a knight.',
    },
    {
      title: 'A chain of three statements',
      problem: 'Amir says "Bella is a knave." Bella says "Chen is a knave." Chen says "Amir and Bella are both knaves." Who is what?',
      steps: [
        'Start with Chen (the strongest statement). Suppose Chen is a knight: then Amir and Bella are knaves.',
        'But then Amir, a knave, says "Bella is a knave", which would be true. Contradiction. So Chen is a **knave**.',
        'Bella says "Chen is a knave", which is true, so Bella is a **knight**.',
        'Amir says "Bella is a knave", which is false, so Amir is a **knave**.',
        'Check Chen: "Amir and Bella are both knaves" is false (Bella is a knight), as a knave\'s statement should be.',
      ],
      answer: 'Amir is a knave, Bella is a knight, Chen is a knave.',
    },
    {
      title: 'Exactly one statement is true',
      problem: 'Exactly one of four friends ate the cake. Rana: "Sami ate it." Sami: "Tala ate it." Tala: "Sami is lying." Umar: "I didn\'t eat it." Exactly **one** statement is true. Who ate the cake?',
      steps: [
        'Tala says Sami is lying, so exactly one of Sami and Tala is telling the truth.',
        'Only one statement in total is true, so that true statement is Sami\'s or Tala\'s. Rana and Umar must both be **false**.',
        'Umar\'s "I didn\'t eat it" is false, so **Umar** ate the cake.',
        'Check: Rana ("Sami") false, Sami ("Tala") false, Tala ("Sami is lying") true, Umar false. Exactly one true statement.',
      ],
      answer: 'Umar ate the cake.',
    },
    {
      title: 'A self-referential list',
      problem: 'Three statements: (1) "Exactly one of these statements is false." (2) "Exactly two of these statements are false." (3) "All three of these statements are false." Which statements are true?',
      steps: [
        'The statements claim different numbers, so at most one of them is true.',
        'If none were true, all three would be false, which would make statement 3 true. Contradiction.',
        'So exactly one is true and the other two are false: exactly two are false.',
        'That is what statement 2 says, so statement 2 is the true one; statements 1 and 3 are false.',
      ],
      answer: 'Only statement 2 is true.',
    },
  ],
  traps: [
    'Believing what a speaker says. Never accept a statement at face value: always test it against both possible types of the speaker.',
    'Thinking "I am a knave" proves the speaker is a knave. Nobody can say it at all; and "I am a knight" tells you nothing, because both types can say it.',
    'Negating "and" wrongly. If a knave says "P and Q", you only know that at least one part is false, not that both are false.',
    'Forgetting that "if P then Q" is automatically true when P is false. This is why a knave cannot say "If I am a knight, then ...".',
    'Stopping after finding one case that works. In a who-did-it puzzle, check every suspect: the question needs exactly one culprit that matches the count.',
    'Not rechecking at the end. After deducing everyone\'s type, go back and check every statement once more; many wrong options fail only on the final check.',
  ],
  examTip:
    'In the exam the options usually list full assignments ("A is a knight, B is a knave, ...") or name a culprit. You rarely need to solve from scratch: **plug each option in** and check every statement. Cross out an option as soon as one knight says something false or one knave says something true. Spot the quick kills first: nobody can say "I am a knave", anyone who says "all of us are knaves" must be a knave, and anyone who says "at least one of us is a knave" must be a knight. For "exactly one is true/false" puzzles, look for a pair of opposite or identical statements, which usually decides the answer in seconds. With about a minute per question, a quick table of the 4 or 8 cases is often faster than clever reasoning.',
};
