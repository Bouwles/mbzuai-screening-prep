import type { Generator, GeneratedCore } from '../../../types';
import type { Rng } from '../../../lib/rng';

type Cand = { text: string; value: number | string; why: string };

/** Keep up to 3 candidates that differ from the answer and from each other (by value and by text). */
function pickDistinct(answer: Cand, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const d of pool) {
    if (out.length === 3) break;
    if (String(d.value) === String(answer.value) || d.text === answer.text) continue;
    if (out.some((x) => String(x.value) === String(d.value) || x.text === d.text)) continue;
    out.push(d);
  }
  return out;
}

const code = (s: string) => '`' + s + '`';

// ================================================================ 1. default + keyword arguments
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
    altWhy: 'works left to right, adding before multiplying. In Python `*` is done before `+`.',
  },
  {
    body: 'a - b * c',
    ev: (a, b, c) => a - b * c,
    work: (a, b, c) => `${a} - ${b} \\times ${c} = ${a} - ${b * c} = ${a - b * c}`,
    alt: (a, b, c) => (a - b) * c,
    altWhy: 'works left to right, subtracting before multiplying. In Python `*` is done before `-`.',
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

type Src = 'positional' | 'keyword' | 'default';

const genDefaultArgs: Generator = {
  id: 'gen-functions-scope-default-args',
  subtopic: 'functions-scope',
  difficulty: 'exam',
  title: 'Trace a call with default and keyword arguments',
  generate(rng: Rng): GeneratedCore {
    for (;;) {
      const fname = rng.pick(['calc', 'total', 'score', 'mix', 'f']);
      const tpl = rng.pick(EXPRS);
      const B = rng.int(2, 5);
      let C = rng.int(2, 6);
      while (C === B) C = rng.int(2, 6);
      const x = rng.int(1, 9);
      let y = rng.int(2, 9);
      while (y === B) y = rng.int(2, 9);
      let z = rng.int(2, 9);
      while (z === C) z = rng.int(2, 9);
      const kind = rng.pick(['kwC', 'none', 'posB', 'kwSwap', 'all'] as const);

      let call: string;
      let args: [number, number, number];
      let srcs: [Src, Src, Src];
      const pool: Cand[] = [];
      const val = (a: number, b: number, c: number) => tpl.ev(a, b, c);
      const mk = (v: number, why: string): Cand => ({ text: code(String(v)), value: v, why });

      if (kind === 'kwC') {
        call = `${fname}(${x}, c=${z})`;
        args = [x, B, z];
        srcs = ['positional', 'default', 'keyword'];
        pool.push(
          mk(val(x, z, C), `This gives ${z} to \`b\` (the next parameter in order) and keeps the default \`c = ${C}\`. A keyword argument \`c=${z}\` goes to the parameter it names, \`c\`.`),
          mk(val(x, B, C), `This ignores \`c=${z}\` and uses both defaults (\`b = ${B}\`, \`c = ${C}\`). A value passed in always replaces the default.`),
          mk(tpl.alt(x, B, z), `The arguments are matched correctly, but this ${tpl.altWhy}`),
        );
      } else if (kind === 'none') {
        call = `${fname}(${x})`;
        args = [x, B, C];
        srcs = ['positional', 'default', 'default'];
        pool.push(
          { text: 'A `TypeError` is raised', value: 'error', why: `This assumes every parameter must be given a value in the call. Parameters with defaults (\`b=${B}\`, \`c=${C}\`) can be left out.` },
          mk(val(x, 0, 0), 'This treats the missing parameters as 0. Parameters that are left out take their default values from the `def` line.'),
          mk(tpl.alt(x, B, C), `The defaults are used correctly, but this ${tpl.altWhy}`),
        );
      } else if (kind === 'posB') {
        call = `${fname}(${x}, ${y})`;
        args = [x, y, C];
        srcs = ['positional', 'positional', 'default'];
        pool.push(
          mk(val(x, B, C), `This keeps the default \`b = ${B}\`, ignoring the ${y}. A value passed for a parameter always replaces its default.`),
          mk(val(x, B, y), `This sends ${y} to the last parameter \`c\`. Positional arguments fill the parameters from left to right, so ${y} goes to \`b\`.`),
          mk(tpl.alt(x, y, C), `The arguments are matched correctly, but this ${tpl.altWhy}`),
        );
      } else if (kind === 'kwSwap') {
        call = `${fname}(b=${y}, a=${x})`;
        args = [x, y, C];
        srcs = ['keyword', 'keyword', 'default'];
        pool.push(
          mk(val(y, x, C), `This matches the values by their position in the call (${y} to \`a\`, ${x} to \`b\`). Keyword arguments are matched by name, so \`a = ${x}\` and \`b = ${y}\`.`),
          mk(val(x, B, C), `This ignores \`b=${y}\` and uses the default \`b = ${B}\`. A value passed in always replaces the default.`),
          mk(tpl.alt(x, y, C), `The arguments are matched correctly, but this ${tpl.altWhy}`),
        );
      } else {
        call = `${fname}(${x}, ${y}, ${z})`;
        args = [x, y, z];
        srcs = ['positional', 'positional', 'positional'];
        pool.push(
          mk(val(x, B, C), `This uses the defaults \`b = ${B}\` and \`c = ${C}\` even though values were passed. Defaults are only used when a parameter is left out.`),
          mk(val(x, y, C), `This keeps the default \`c = ${C}\` and ignores the third argument ${z}.`),
          mk(tpl.alt(x, y, z), `The arguments are matched correctly, but this ${tpl.altWhy}`),
        );
      }

      const [a, b, c] = args;
      const v = val(a, b, c);
      const answer: Cand = { text: code(String(v)), value: v, why: '' };
      const ds = pickDistinct(answer, pool);
      if (ds.length < 3) continue;

      const source = `def ${fname}(a, b=${B}, c=${C}):\n    return ${tpl.body}\n\nprint(${call})`;
      const reason = (name: string, value: number, s: Src) =>
        s === 'positional'
          ? `- \`${name} = ${value}\`: given by **position** in the call.`
          : s === 'keyword'
            ? `- \`${name} = ${value}\`: given by **keyword** (\`${name}=${value}\`), matched by name.`
            : `- \`${name} = ${value}\`: not given in the call, so it keeps its **default**.`;
      const solution =
        'First match each argument to a parameter. Positional arguments fill the parameters from left to right, keyword arguments go to the parameter they name, and anything left over uses its default.\n\n' +
        `${reason('a', a, srcs[0])}\n${reason('b', b, srcs[1])}\n${reason('c', c, srcs[2])}\n\n` +
        `Now evaluate \`${tpl.body}\` (brackets first, then \`*\` before \`+\` or \`-\`):\n\n` +
        `$$${tpl.work(a, b, c)}$$\n\n` +
        `\`print\` displays the returned value. Answer: ${answer.text}`;

      return {
        stem: 'What does this Python code print?',
        code: { lang: 'python', source },
        answer: answer.text,
        answerValue: v,
        distractors: ds.map((d) => ({ text: d.text, value: d.value, why: d.why })),
        solution,
        keyIdea: 'Positional arguments fill parameters left to right, keyword arguments are matched by name, and missing parameters use their defaults.',
        python: { stdout: `${v}\n` },
      };
    }
  },
};

// ================================================================ 2. map / filter pipelines
interface Pred {
  src: (t: number) => string;
  test: (x: number, t: number) => boolean;
  /** Plain-English description. */
  words: (t: number) => string;
}

/** Python's % (result has the sign of the divisor), so e.g. -1 % 2 == 1 as in Python, not -1 as in JS. */
const pyMod = (x: number, m: number) => ((x % m) + m) % m;

const PREDS: Pred[] = [
  { src: () => 'x % 2 == 0', test: (x) => pyMod(x, 2) === 0, words: () => 'the number is even' },
  { src: () => 'x % 2 == 1', test: (x) => pyMod(x, 2) === 1, words: () => 'the number is odd' },
  { src: () => 'x % 3 == 0', test: (x) => pyMod(x, 3) === 0, words: () => 'the number is a multiple of 3' },
  { src: (t) => `x > ${t}`, test: (x, t) => x > t, words: (t) => `the number is greater than ${t}` },
  { src: (t) => `x < ${t}`, test: (x, t) => x < t, words: (t) => `the number is less than ${t}` },
];

interface MapFn {
  src: (k: number) => string;
  f: (x: number, k: number) => number;
  tex: (x: number, k: number) => string;
}

const MAPS: MapFn[] = [
  { src: (k) => `x * ${k}`, f: (x, k) => x * k, tex: (x, k) => `${x} \\times ${k} = ${x * k}` },
  { src: (k) => `x + ${k}`, f: (x, k) => x + k, tex: (x, k) => `${x} + ${k} = ${x + k}` },
  { src: (k) => `x - ${k}`, f: (x, k) => x - k, tex: (x, k) => `${x} - ${k} = ${x - k}` },
  { src: () => 'x ** 2', f: (x) => x * x, tex: (x) => `${x}^{2} = ${x * x}` },
];

const pyList = (xs: (number | boolean)[]) => '[' + xs.map((x) => (typeof x === 'boolean' ? (x ? 'True' : 'False') : String(x))).join(', ') + ']';

const genMapFilter: Generator = {
  id: 'gen-functions-scope-map-filter',
  subtopic: 'functions-scope',
  difficulty: 'exam',
  title: 'Trace map and filter with lambda functions',
  generate(rng: Rng): GeneratedCore {
    for (;;) {
      const pool15 = Array.from({ length: 15 }, (_, i) => i + 1);
      const nums = rng.sample(pool15, rng.int(5, 6));
      const pred = rng.pick(PREDS);
      const sortedNums = [...nums].sort((p, q) => p - q);
      const t = sortedNums[rng.int(1, nums.length - 2)];
      const mp = rng.pick(MAPS);
      const k = rng.int(2, 6);
      const twoStep = rng.bool();

      const kept = nums.filter((x) => pred.test(x, t));
      if (kept.length < 2 || kept.length > nums.length - 2) continue;
      const result = kept.map((x) => mp.f(x, k));

      const answerText = code(pyList(result));
      const answer: Cand = { text: answerText, value: pyList(result), why: '' };
      const mkL = (xs: (number | boolean)[], why: string): Cand => ({ text: code(pyList(xs)), value: pyList(xs), why });
      const rejected = nums.filter((x) => !pred.test(x, t));
      const pool: Cand[] = [
        mkL(nums.map((x) => mp.f(x, k)), `This ignores the \`filter\` step and applies \`${mp.src(k)}\` to every number in the list.`),
        mkL(kept, `This does the filtering but forgets the \`map\` step, which applies \`${mp.src(k)}\` to each kept number.`),
        mkL(
          rejected.map((x) => mp.f(x, k)),
          `This keeps the numbers where \`${pred.src(t)}\` is **False**, as if \`filter\` removed the matching items. \`filter\` keeps the items where the function returns \`True\`.`,
        ),
        mkL(
          nums.map((x) => mp.f(x, k)).filter((x) => pred.test(x, t)),
          `This applies \`map\` first and then \`filter\` to the new values. The \`filter\` is applied to the original numbers first, and only the kept numbers are then mapped.`,
        ),
        mkL(
          nums.map((x) => pred.test(x, t)),
          `This treats \`filter\` like \`map\`, giving the \`True\`/\`False\` result of the test for every number instead of keeping the numbers that pass.`,
        ),
      ];
      const ds = pickDistinct(answer, pool);
      if (ds.length < 3) continue;

      const filt = `filter(lambda x: ${pred.src(t)}, nums)`;
      const source = twoStep
        ? `nums = ${pyList(nums)}\nkept = ${filt}\nresult = list(map(lambda x: ${mp.src(k)}, kept))\nprint(result)`
        : `nums = ${pyList(nums)}\nresult = list(map(lambda x: ${mp.src(k)}, ${filt}))\nprint(result)`;

      const table =
        '| `x` | ' +
        `\`${pred.src(t)}\`` +
        ' | kept? |\n| --- | --- | --- |\n' +
        nums.map((x) => `| ${x} | ${pred.test(x, t) ? '`True`' : '`False`'} | ${pred.test(x, t) ? 'yes' : 'no'} |`).join('\n');
      const solution =
        (twoStep ? 'Work through the lines in order.\n\n' : 'Work from the **inside out**: the `filter` runs first, then `map` is applied to what it keeps.\n\n') +
        `**Step 1: filter.** \`filter\` keeps each number for which \`${pred.src(t)}\` is \`True\`, i.e. ${pred.words(t)}.\n\n` +
        table +
        `\n\nKept: ${kept.join(', ')}.\n\n` +
        `**Step 2: map.** \`map\` applies \`lambda x: ${mp.src(k)}\` to each kept number:\n\n` +
        kept.map((x) => `- $${mp.tex(x, k)}$`).join('\n') +
        `\n\n**Step 3:** \`list(...)\` collects the results into a list, which is printed. Answer: ${answerText}`;

      return {
        stem: 'What does this Python code print?',
        code: { lang: 'python', source },
        answer: answerText,
        answerValue: pyList(result),
        distractors: ds.map((d) => ({ text: d.text, value: d.value, why: d.why })),
        solution,
        keyIdea: '`filter(f, xs)` keeps the items where `f` returns `True`; `map(f, xs)` applies `f` to every item.',
        python: { stdout: `${pyList(result)}\n` },
      };
    }
  },
};

// ================================================================ 3. local vs global scope
const genScope: Generator = {
  id: 'gen-functions-scope-scope-trace',
  subtopic: 'functions-scope',
  difficulty: 'exam',
  title: 'Local vs global variables: trace a function call',
  generate(rng: Rng): GeneratedCore {
    for (;;) {
      const nm = rng.pick(['n', 'total', 'score', 'x', 'count']);
      const fn = rng.pick(['change', 'update', 'step']);
      const variant = rng.pick(['local', 'global', 'param'] as const);
      const A = rng.int(1, 9);
      const D = rng.int(1, 9);
      const pair = (p: number, q: number) => `${p} ${q}`;
      const mk = (p: number, q: number, why: string): Cand => ({ text: code(pair(p, q)), value: pair(p, q), why });

      let source: string;
      let ans: [number, number];
      let pool: Cand[];
      let trace: string;
      let keyIdea: string;

      if (variant === 'local') {
        const B = rng.int(1, 9);
        if (B === A) continue;
        source = `${nm} = ${A}\n\ndef ${fn}():\n    ${nm} = ${B}\n    return ${nm} + ${D}\n\nm = ${fn}()\nprint(${nm}, m)`;
        ans = [A, B + D];
        pool = [
          mk(B, B + D, `This assumes \`${nm} = ${B}\` inside the function changes the global \`${nm}\`. Without a \`global\` line, assigning inside a function creates a separate local variable.`),
          mk(A, A + D, `This uses the global value ${A} in \`return ${nm} + ${D}\`. But the function has just made its own local \`${nm} = ${B}\`, and the local one is used inside the function.`),
          mk(A, B, `The global value is right, but this forgets that the function returns \`${nm} + ${D}\`, not just \`${nm}\`.`),
          mk(B + D, B + D, `This assumes the global \`${nm}\` ends up holding the returned value. Only \`m\` receives the returned value.`),
        ];
        trace =
          `| Line | global \`${nm}\` | local \`${nm}\` | \`m\` |\n| --- | --- | --- | --- |\n` +
          `| \`${nm} = ${A}\` | ${A} | - | - |\n` +
          `| inside \`${fn}\`: \`${nm} = ${B}\` (new local variable) | ${A} | ${B} | - |\n` +
          `| \`return ${nm} + ${D}\` uses the local: $${B} + ${D} = ${B + D}$ | ${A} | ${B} | - |\n` +
          `| back outside: \`m = ${B + D}\` (the local is gone) | ${A} | - | ${B + D} |\n\n` +
          `Because there is no \`global\` line, \`${nm} = ${B}\` inside the function creates a **local** variable, and the global \`${nm}\` is never changed.`;
        keyIdea = 'Assigning to a name inside a function creates a local variable; the global variable with the same name is unchanged.';
      } else if (variant === 'global') {
        source = `${nm} = ${A}\n\ndef ${fn}(k):\n    global ${nm}\n    ${nm} = ${nm} + k\n    return ${nm} * 2\n\nm = ${fn}(${D})\nprint(${nm}, m)`;
        const s = A + D;
        ans = [s, 2 * s];
        pool = [
          mk(A, 2 * s, `This ignores the \`global ${nm}\` line and treats the change as local. With \`global\`, \`${nm} = ${nm} + k\` really changes the global variable. (Without the \`global\` line, that assignment would actually raise an \`UnboundLocalError\`.)`),
          mk(2 * s, 2 * s, `This assumes \`return ${nm} * 2\` also changes \`${nm}\`. A \`return\` only sends a value back (to \`m\`); it does not store anything in \`${nm}\`.`),
          mk(s, s, `The global value is right, but this forgets that the function returns \`${nm} * 2\`, not \`${nm}\`.`),
          mk(A, A + D, `This ignores \`global ${nm}\` and also forgets the \`* 2\` in the return line.`),
        ];
        trace =
          `| Line | \`k\` | global \`${nm}\` | \`m\` |\n| --- | --- | --- | --- |\n` +
          `| \`${nm} = ${A}\` | - | ${A} | - |\n` +
          `| call \`${fn}(${D})\` | ${D} | ${A} | - |\n` +
          `| \`${nm} = ${nm} + k\` (global): $${A} + ${D} = ${s}$ | ${D} | ${s} | - |\n` +
          `| \`return ${nm} * 2\`: $${s} \\times 2 = ${2 * s}$ | ${D} | ${s} | ${2 * s} |\n\n` +
          `\`global ${nm}\` makes the function use (and change) the global variable, so the change is still there after the call.`;
        keyIdea = 'With a `global` line, assignments inside the function change the global variable; `return` only sends a value back to the caller.';
      } else {
        const K = rng.int(2, 5);
        source = `${nm} = ${A}\n\ndef ${fn}(${nm}):\n    ${nm} = ${nm} * ${K}\n    return ${nm}\n\nm = ${fn}(${nm} + ${D})\nprint(${nm}, m)`;
        const r = (A + D) * K;
        ans = [A, r];
        pool = [
          mk(r, r, `This assumes the parameter \`${nm}\` is the same as the global \`${nm}\`. A parameter is always a local variable, so the global \`${nm}\` stays ${A}.`),
          mk(A, A * K + D, `This reads \`${fn}(${nm} + ${D})\` as \`${fn}(${nm}) + ${D}\`. The argument \`${nm} + ${D}\` is worked out first ($${A} + ${D} = ${A + D}$) and then passed in.`),
          mk(A + D, r, `This assumes writing \`${nm} + ${D}\` in the call changes \`${nm}\`. It only calculates a value to pass in; \`${nm}\` is not reassigned.`),
          mk(A, A * K, `This forgets to add ${D} before passing the value in, so it calls the function with ${A} instead of ${A + D}.`),
        ];
        trace =
          `| Line | global \`${nm}\` | parameter \`${nm}\` (local) | \`m\` |\n| --- | --- | --- | --- |\n` +
          `| \`${nm} = ${A}\` | ${A} | - | - |\n` +
          `| argument \`${nm} + ${D}\` $= ${A} + ${D} = ${A + D}$ is passed in | ${A} | ${A + D} | - |\n` +
          `| \`${nm} = ${nm} * ${K}\`: $${A + D} \\times ${K} = ${r}$ | ${A} | ${r} | - |\n` +
          `| \`return ${nm}\`, so \`m = ${r}\` | ${A} | - | ${r} |\n\n` +
          `The parameter has the same name as the global variable, but it is a separate **local** variable, so changing it does not affect the global \`${nm}\`.`;
        keyIdea = 'A parameter is always a local variable, even when it has the same name as a global variable.';
      }

      const answer: Cand = { text: code(pair(ans[0], ans[1])), value: pair(ans[0], ans[1]), why: '' };
      const ds = pickDistinct(answer, pool);
      if (ds.length < 3) continue;

      return {
        stem: `What does this Python code print? (\`print(${nm}, m)\` shows both values on one line, separated by a space.)`,
        code: { lang: 'python', source },
        answer: answer.text,
        answerValue: answer.value,
        distractors: ds.map((d) => ({ text: d.text, value: d.value, why: d.why })),
        solution: `Track the global variable and the function's local variables separately.\n\n${trace}\n\nSo \`${nm}\` is ${ans[0]} and \`m\` is ${ans[1]}. Answer: ${answer.text}`,
        keyIdea,
        python: { stdout: `${pair(ans[0], ans[1])}\n` },
      };
    }
  },
};

export const generators: Generator[] = [genDefaultArgs, genMapFilter, genScope];
