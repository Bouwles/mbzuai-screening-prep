import type { Generator, GeneratedCore } from '../../../types';
import { steps, table } from '../../../lib/explanation';
import type { Rng } from '../../../lib/rng';

type Cand = { text: string; value: number | string; why: string };

/** Options are compared with their spaces removed, so "1 23" and "12 3" count as the same. */
const squash = (s: string) => s.replace(/[\s`]/g, '');

/** Keep up to 3 candidates that differ from the answer and from each other. */
function pickDistinct(answer: Cand, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const d of pool) {
    if (out.length === 3) break;
    if (squash(d.text) === squash(answer.text)) continue;
    if (out.some((x) => squash(x.text) === squash(d.text))) continue;
    out.push(d);
  }
  return out;
}

const code = (s: string) => '`' + s + '`';

// ================================================================ 1. match arguments to parameters
interface ExprTpl {
  body: string;
  ev: (a: number, b: number, c: number) => number;
  /** LaTeX working "a + b \times c = ... = v" */
  work: (a: number, b: number, c: number) => string;
  alt: (a: number, b: number, c: number) => number;
  altWhy: string;
  /** Which part goes first, and why. */
  order: string;
}

const EXPRS: ExprTpl[] = [
  {
    body: 'a + b * c',
    ev: (a, b, c) => a + b * c,
    work: (a, b, c) => `${a} + ${b} \\times ${c} = ${a} + ${b * c} = ${a + b * c}`,
    alt: (a, b, c) => (a + b) * c,
    altWhy: 'works left to right, adding before multiplying. `*` is done before `+`.',
    order: 'Multiplying comes before adding, so `b * c` goes first',
  },
  {
    body: 'a - b * c',
    ev: (a, b, c) => a - b * c,
    work: (a, b, c) => `${a} - ${b} \\times ${c} = ${a} - ${b * c} = ${a - b * c}`,
    alt: (a, b, c) => (a - b) * c,
    altWhy: 'works left to right, subtracting before multiplying. `*` is done before `-`.',
    order: 'Multiplying comes before subtracting, so `b * c` goes first',
  },
  {
    body: 'a * (b + c)',
    ev: (a, b, c) => a * (b + c),
    work: (a, b, c) => `${a} \\times (${b} + ${c}) = ${a} \\times ${b + c} = ${a * (b + c)}`,
    alt: (a, b, c) => a * b + c,
    altWhy: 'ignores the brackets and multiplies first. The brackets mean `b + c` must be worked out first.',
    order: 'Brackets come first, so `b + c` goes first',
  },
  {
    body: 'a * b + c',
    ev: (a, b, c) => a * b + c,
    work: (a, b, c) => `${a} \\times ${b} + ${c} = ${a * b} + ${c} = ${a * b + c}`,
    alt: (a, b, c) => a * (b + c),
    altWhy: 'adds `b + c` before multiplying. With no brackets, `*` is done before `+`.',
    order: 'Multiplying comes before adding, so `a * b` goes first',
  },
];

const genArgs: Generator = {
  id: 'gen-functions-scope-default-args',
  subtopic: 'functions-scope',
  difficulty: 'exam',
  title: 'Trace a call: match arguments to parameters by position',
  generate(rng: Rng): GeneratedCore {
    for (;;) {
      const fname = rng.pick(['calc', 'total', 'score', 'mix', 'f']);
      const tpl = rng.pick(EXPRS);
      const [x, y, z] = rng.sample([2, 3, 4, 5, 6, 7, 8, 9], 3);
      const named = rng.bool();
      const val = tpl.ev;
      const mk = (v: number, why: string): Cand => ({ text: String(v), value: v, why });

      // In the named form the outer variables a, b, c are passed in a different order, so the names don't line up.
      const [a, b, c] = named ? [y, z, x] : [x, y, z];
      const v = val(a, b, c);
      const pool: Cand[] = [
        ...(named ? [mk(val(x, y, z), `This matches by name, keeping \`a = ${x}\`, \`b = ${y}\` and \`c = ${z}\` inside the function. The first value in the call goes to the first parameter, whatever it is called.`)] : []),
        mk(tpl.alt(a, b, c), `The arguments are matched correctly, but this ${tpl.altWhy}`),
        mk(val(b, a, c), `This swaps the first two arguments. Values go to parameters in order, so \`a = ${a}\` and \`b = ${b}\`.`),
        mk(val(a, c, b), `This swaps the last two arguments. Values go to parameters in order, so \`b = ${b}\` and \`c = ${c}\`.`),
        mk(val(c, b, a), `This reads the arguments from right to left. The first value goes to the first parameter, so \`a = ${a}\`.`),
        mk(a + b + c, 'This adds the three values and ignores the expression in the function.'),
      ];
      const answer: Cand = { text: String(v), value: v, why: '' };
      const ds = pickDistinct(answer, pool);
      if (ds.length < 3) continue;

      const header = [`function ${fname}(a, b, c)`, `   return ${tpl.body}`, 'end function', ''];
      const main = named ? [`a = ${x}`, `b = ${y}`, `c = ${z}`, `print(${fname}(b, c, a))`] : [`print(${fname}(${x}, ${y}, ${z}))`];
      const callLine = named ? 8 : 5;
      const solution = steps(
        named && `Lines 5 to 7 set the outer variables: \`a\` is ${x}, \`b\` is ${y} and \`c\` is ${z}. Lines 1 to 3 only define the function, so nothing inside it runs until it is called.`,
        named
          ? `Line 8 calls \`${fname}(b, c, a)\`. First replace each name with its value. That makes the call \`${fname}(${y}, ${z}, ${x})\`.`
          : `Line 5 calls \`${fname}(${x}, ${y}, ${z})\`. The names in the function's first line, \`a\`, \`b\` and \`c\`, are its **parameters**: they receive the values in the call.`,
        `Values go to parameters **by position**: the first value to the first name, the second to the second and the third to the third. So inside the function \`a\` is ${a}, \`b\` is ${b} and \`c\` is ${c}.`,
        named && 'Those are new variables that exist only inside the function. Sharing a name with an outer variable makes no difference.',
        `Put those values into line 2. ${tpl.order}: $${tpl.work(a, b, c)}$. The function returns ${v}, and line ${callLine} prints it.`,
      );

      return {
        stem: 'What does this pseudocode print?',
        code: { lang: 'pseudocode', source: [...header, ...main].join('\n') },
        answer: answer.text,
        answerValue: v,
        distractors: ds.map((d) => ({ text: d.text, value: d.value, why: d.why })),
        asking: `What number comes back from \`${fname}\` for these values, ready to be printed?`,
        solution,
        conclusion: `Inside the function \`a\` is ${a}, \`b\` is ${b} and \`c\` is ${c}, so it returns and prints ${answer.text}.`,
        keyIdea: 'Turn any variable in the call into its value, then pair the values with the parameter names from left to right. Then substitute into the body: brackets first, then `*`, then `+` and `-`.',
      };
    }
  },
};

// ================================================================ 2. local vs outer variables
const genScope: Generator = {
  id: 'gen-functions-scope-scope-trace',
  subtopic: 'functions-scope',
  difficulty: 'exam',
  title: 'Local vs outer variables: trace a function call',
  generate(rng: Rng): GeneratedCore {
    for (;;) {
      const nm = rng.pick(['n', 'total', 'score', 'x', 'count']);
      const fn = rng.pick(['change', 'update', 'adjust']);
      const variant = rng.pick(['local', 'param'] as const);
      const A = rng.int(1, 9);
      const D = rng.int(1, 9);
      const pair = (p: number, q: number) => `${p} ${q}`;
      const mk = (p: number, q: number, why: string): Cand => ({ text: code(pair(p, q)), value: pair(p, q), why });

      let lines: string[];
      let ans: [number, number];
      let pool: Cand[];
      let working: string;
      let conclusion: string;
      let keyIdea: string;

      if (variant === 'local') {
        const B = rng.int(1, 9);
        if (B === A) continue;
        lines = [`${nm} = ${A}`, '', `function ${fn}()`, `   ${nm} = ${B}`, `   return ${nm} + ${D}`, 'end function', '', `m = ${fn}()`, `print(${nm})`, 'print(m)'];
        ans = [A, B + D];
        pool = [
          mk(B, B + D, `This assumes \`${nm} = ${B}\` inside the function changes the outer \`${nm}\`. Assigning inside a function creates a separate local variable.`),
          mk(A, A + D, `This uses the outer value ${A} in \`return ${nm} + ${D}\`. The function has just made its own local \`${nm} = ${B}\`, and that one is used inside the function.`),
          mk(A, B, `The outer value is right, but this forgets that the function returns \`${nm} + ${D}\`, not just \`${nm}\`.`),
          mk(B + D, B + D, `This assumes the outer \`${nm}\` ends up holding the returned value. Only \`m\` receives the returned value.`),
        ];
        const r = B + D;
        working = steps(
          `A variable given a value with \`=\` inside a function is **local**: it exists only inside that function. So \`${nm}\` on line 4 is a different variable from \`${nm}\` on line 1, even though the names match.`,
          'Lines 3 to 6 only define the function, so nothing inside runs until line 8 calls it.',
          `Here is each line that runs, with the two variables in separate columns. Lines 9 and 10 print the outer \`${nm}\` and then \`m\`:`,
          table(['Line', `Outer \`${nm}\``, `Local \`${nm}\``, '`m`', 'Printed'], [
            [1, A, '-', '-', '-'],
            [4, A, B, '-', '-'],
            [`5, returns $${B} + ${D} = ${r}$`, A, B, '-', '-'],
            ['8, stores it in `m`', A, 'gone', r, '-'],
            [9, A, 'gone', r, A],
            [10, A, 'gone', r, r],
          ]),
        );
        conclusion = `The outer \`${nm}\` never changed and \`m\` received the returned ${r}, so the answer is ${code(pair(A, r))}.`;
        keyIdea = 'Draw separate columns for outer and local variables. A name assigned inside a function goes in the local column, even if an outer variable has the same name. Only `return` gets a value out, and the line making the call stores it.';
      } else {
        const K = rng.int(2, 5);
        lines = [`${nm} = ${A}`, '', `function ${fn}(${nm})`, `   ${nm} = ${nm} * ${K}`, `   return ${nm}`, 'end function', '', `m = ${fn}(${nm} + ${D})`, `print(${nm})`, 'print(m)'];
        const r = (A + D) * K;
        ans = [A, r];
        pool = [
          mk(r, r, `This assumes the parameter \`${nm}\` is the same as the outer \`${nm}\`. A parameter is always a local variable, so the outer \`${nm}\` stays ${A}.`),
          mk(A, A * K + D, `This reads \`${fn}(${nm} + ${D})\` as \`${fn}(${nm}) + ${D}\`. The argument \`${nm} + ${D}\` is worked out first ($${A} + ${D} = ${A + D}$) and then passed in.`),
          mk(A + D, r, `This assumes writing \`${nm} + ${D}\` in the call changes \`${nm}\`. It only calculates a value to pass in; \`${nm}\` is not reassigned.`),
          mk(A, A * K, `This forgets to add ${D} before passing the value in, so it calls the function with ${A} instead of ${A + D}.`),
        ];
        working = steps(
          `A **parameter** is a name in a function's first line, and it acts as a local variable: it exists only inside the function. So \`${nm}\` on lines 3 to 5 is separate from \`${nm}\` on line 1, even though the names match.`,
          `Line 8 calls \`${fn}(${nm} + ${D})\`. What is inside the brackets is worked out first: $${A} + ${D} = ${A + D}$. This only calculates a value to pass in, so the outer \`${nm}\` stays ${A}.`,
          `Here is each line that runs, with the two variables in separate columns. Lines 9 and 10 print the outer \`${nm}\` and then \`m\`:`,
          table(['Line', `Outer \`${nm}\``, `Parameter \`${nm}\``, '`m`', 'Printed'], [
            [1, A, '-', '-', '-'],
            [`8, passes ${A + D} in`, A, A + D, '-', '-'],
            [`4, $${A + D} \\times ${K} = ${r}$`, A, r, '-', '-'],
            ['5 and 8, returns it into `m`', A, 'gone', r, '-'],
            [9, A, 'gone', r, A],
            [10, A, 'gone', r, r],
          ]),
        );
        conclusion = `The outer \`${nm}\` never changed and \`m\` received the returned ${r}, so the answer is ${code(pair(A, r))}.`;
        keyIdea = 'Draw separate columns for the outer variable and the parameter, even when they share a name. Work out the argument (the value inside the brackets of the call) first and put it in the parameter column. Changing the parameter leaves the outer column alone.';
      }

      const answer: Cand = { text: code(pair(ans[0], ans[1])), value: pair(ans[0], ans[1]), why: '' };
      const ds = pickDistinct(answer, pool);
      if (ds.length < 3) continue;

      return {
        stem: 'Variables assigned inside a function are local to it. What does this pseudocode print? Printed values are shown in order, separated by a space.',
        code: { lang: 'pseudocode', source: lines.join('\n') },
        answer: answer.text,
        answerValue: answer.value,
        distractors: ds.map((d) => ({ text: d.text, value: d.value, why: d.why })),
        asking: `Which two values get printed: the outer \`${nm}\`, and then \`m\`?`,
        solution: working,
        conclusion,
        keyIdea,
      };
    }
  },
};

export const generators: Generator[] = [genArgs, genScope];
