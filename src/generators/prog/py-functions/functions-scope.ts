import type { Generator, GeneratedCore } from '../../../types';
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
}

const EXPRS: ExprTpl[] = [
  {
    body: 'a + b * c',
    ev: (a, b, c) => a + b * c,
    work: (a, b, c) => `${a} + ${b} \\times ${c} = ${a} + ${b * c} = ${a + b * c}`,
    alt: (a, b, c) => (a + b) * c,
    altWhy: 'works left to right, adding before multiplying. `*` is done before `+`.',
  },
  {
    body: 'a - b * c',
    ev: (a, b, c) => a - b * c,
    work: (a, b, c) => `${a} - ${b} \\times ${c} = ${a} - ${b * c} = ${a - b * c}`,
    alt: (a, b, c) => (a - b) * c,
    altWhy: 'works left to right, subtracting before multiplying. `*` is done before `-`.',
  },
  {
    body: 'a * (b + c)',
    ev: (a, b, c) => a * (b + c),
    work: (a, b, c) => `${a} \\times (${b} + ${c}) = ${a} \\times ${b + c} = ${a * (b + c)}`,
    alt: (a, b, c) => a * b + c,
    altWhy: 'ignores the brackets and multiplies first. The brackets mean `b + c` must be worked out first.',
  },
  {
    body: 'a * b + c',
    ev: (a, b, c) => a * b + c,
    work: (a, b, c) => `${a} \\times ${b} + ${c} = ${a * b} + ${c} = ${a * b + c}`,
    alt: (a, b, c) => a * (b + c),
    altWhy: 'adds `b + c` before multiplying. With no brackets, `*` is done before `+`.',
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
      const matching = named
        ? `The call passes the values of \`b\`, \`c\` and \`a\`, which are ${y}, ${z} and ${x}. Arguments are matched **by position**, so inside the function`
        : 'Arguments are matched **by position**, left to right, so inside the function';
      const solution =
        `${matching} $a = ${a}$, $b = ${b}$ and $c = ${c}$.\n\n` +
        `Now evaluate \`${tpl.body}\` (brackets first, then \`*\` before \`+\` or \`-\`):\n\n` +
        `$$${tpl.work(a, b, c)}$$\n\n` +
        `\`print\` displays the returned value. Answer: ${answer.text}`;

      return {
        stem: 'What does this pseudocode print?',
        code: { lang: 'pseudocode', source: [...header, ...main].join('\n') },
        answer: answer.text,
        answerValue: v,
        distractors: ds.map((d) => ({ text: d.text, value: d.value, why: d.why })),
        solution,
        keyIdea: 'Arguments are matched to parameters by position, whatever the variables in the call are named.',
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
      let trace: string;
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
        trace =
          `| Line | outer \`${nm}\` | local \`${nm}\` | \`m\` |\n| --- | --- | --- | --- |\n` +
          `| \`${nm} = ${A}\` | ${A} | - | - |\n` +
          `| inside \`${fn}\`: \`${nm} = ${B}\` (new local variable) | ${A} | ${B} | - |\n` +
          `| \`return ${nm} + ${D}\` uses the local: $${B} + ${D} = ${B + D}$ | ${A} | ${B} | - |\n` +
          `| back outside: \`m = ${B + D}\` (the local is gone) | ${A} | - | ${B + D} |\n\n` +
          `\`${nm} = ${B}\` inside the function creates a **local** variable, and the outer \`${nm}\` is never changed.`;
        keyIdea = 'Assigning to a name inside a function creates a local variable; the outer variable with the same name is unchanged.';
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
        trace =
          `| Line | outer \`${nm}\` | parameter \`${nm}\` (local) | \`m\` |\n| --- | --- | --- | --- |\n` +
          `| \`${nm} = ${A}\` | ${A} | - | - |\n` +
          `| argument \`${nm} + ${D}\` $= ${A} + ${D} = ${A + D}$ is passed in | ${A} | ${A + D} | - |\n` +
          `| \`${nm} = ${nm} * ${K}\`: $${A + D} \\times ${K} = ${r}$ | ${A} | ${r} | - |\n` +
          `| \`return ${nm}\`, so \`m = ${r}\` | ${A} | - | ${r} |\n\n` +
          `The parameter has the same name as the outer variable, but it is a separate **local** variable, so changing it does not affect the outer \`${nm}\`.`;
        keyIdea = 'A parameter is always a local variable, even when it has the same name as an outer variable.';
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
        solution: `Track the outer variable and the function's local variables separately.\n\n${trace}\n\nSo \`${nm}\` is ${ans[0]} and \`m\` is ${ans[1]}. Answer: ${answer.text}`,
        keyIdea,
      };
    }
  },
};

export const generators: Generator[] = [genArgs, genScope];
