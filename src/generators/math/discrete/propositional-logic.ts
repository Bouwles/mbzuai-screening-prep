import type { Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';

// ---------------------------------------------------------------- a tiny formula AST
type Op = 'and' | 'or' | 'imp' | 'iff';
type F = { k: 'var'; v: string } | { k: 'not'; a: F } | { k: 'bin'; op: Op; a: F; b: F };
type Env = Record<string, boolean>;

const V = (v: string): F => ({ k: 'var', v });
const Not = (a: F): F => ({ k: 'not', a });
const Bin = (op: Op, a: F, b: F): F => ({ k: 'bin', op, a, b });
/** Negate, removing a double negation (so the negation of \neg p is p). */
const neg = (a: F): F => (a.k === 'not' ? a.a : Not(a));

const OP_TEX: Record<Op, string> = { and: '\\land', or: '\\lor', imp: '\\to', iff: '\\leftrightarrow' };

function tex(f: F): string {
  if (f.k === 'var') return f.v;
  if (f.k === 'not') return f.a.k === 'bin' ? `\\neg(${tex(f.a)})` : `\\neg ${tex(f.a)}`;
  const w = (x: F) => (x.k === 'bin' ? `(${tex(x)})` : tex(x));
  return `${w(f.a)} ${OP_TEX[f.op]} ${w(f.b)}`;
}

function ev(f: F, e: Env): boolean {
  if (f.k === 'var') return e[f.v];
  if (f.k === 'not') return !ev(f.a, e);
  const a = ev(f.a, e);
  const b = ev(f.b, e);
  switch (f.op) {
    case 'and':
      return a && b;
    case 'or':
      return a || b;
    case 'imp':
      return !a || b;
    case 'iff':
      return a === b;
  }
}

const TV = (b: boolean) => (b ? 'T' : 'F');
const TVt = (b: boolean) => (b ? '\\text{T}' : '\\text{F}');
/** Rows (p, q) = TT, TF, FT, FF. */
const ROWS2: Env[] = [
  { p: true, q: true },
  { p: true, q: false },
  { p: false, q: true },
  { p: false, q: false },
];
const col = (f: F): string => ROWS2.map((e) => TV(ev(f, e))).join('');
const colText = (c: string): string => c.split('').join(', ');

const OP_NAME: Record<Op, string> = { and: 'AND', or: 'OR', imp: 'implication', iff: 'biconditional' };

// ================================================================ generator 1: truth-table column
function genColumn(rng: Rng) {
  const a: F = rng.bool() ? Not(V('p')) : V('p');
  const b: F = rng.bool() ? Not(V('q')) : V('q');
  const op = rng.pick<Op>(['and', 'or', 'imp', 'imp', 'iff']);
  const outer = rng.bool(0.4);
  const inner = Bin(op, a, b);
  const S = outer ? Not(inner) : inner;
  const wrap = (x: F) => (outer ? Not(x) : x);
  const answerCol = col(S);
  const answer = colText(answerCol);

  // ---- pool of genuine mistakes
  type Cand = { f?: F; c: string; why: string };
  const pool: Cand[] = [];
  const add = (f: F, why: string) => pool.push({ f, c: col(f), why });
  if (a.k === 'not')
    add(wrap(Bin(op, V('p'), b)), `This is the column of ${'$' + tex(wrap(Bin(op, V('p'), b))) + '$'}: the $\\neg$ on $p$ has been forgotten.`);
  if (b.k === 'not')
    add(wrap(Bin(op, a, V('q'))), `This is the column of ${'$' + tex(wrap(Bin(op, a, V('q')))) + '$'}: the $\\neg$ on $q$ has been forgotten.`);
  if (outer) {
    add(inner, 'This is the column of the expression inside the brackets: the outer $\\neg$ (which flips every row) has been forgotten.');
    if (op === 'and' || op === 'or') {
      const f = Bin(op, neg(a), neg(b));
      add(
        f,
        `This is the column of $${tex(f)}$: it negates each part but keeps $${OP_TEX[op]}$. De Morgan's law also swaps $\\land$ and $\\lor$.`,
      );
    }
    if (op === 'imp') {
      const f = Bin('imp', neg(a), neg(b));
      add(f, `This is the column of $${tex(f)}$: it negates both parts of the implication, but the negation of $X \\to Y$ is $X \\land \\neg Y$, not another implication.`);
    }
  }
  if (op === 'imp') {
    add(wrap(Bin('imp', b, a)), `This is the column of $${tex(wrap(Bin('imp', b, a)))}$: the arrow has been read backwards (the converse).`);
    add(wrap(Bin('iff', a, b)), 'This treats the one-way arrow $\\to$ as the two-way arrow $\\leftrightarrow$ ("same truth value"), but an implication with a false hypothesis is always true.');
    add(wrap(Bin('and', a, b)), 'This treats the implication as AND, forgetting that an implication with a false hypothesis is (vacuously) true.');
  }
  if (op === 'or') {
    add(wrap(Bin('and', a, b)), 'This uses AND instead of OR: OR is true when **at least one** part is true.');
    add(wrap(Not(Bin('iff', a, b))), 'This treats OR as "exclusive or", making it false when both parts are true. In logic, OR includes the both-true case.');
  }
  if (op === 'and') {
    add(wrap(Bin('or', a, b)), 'This uses OR instead of AND: AND is true only when **both** parts are true.');
    add(wrap(Bin('iff', a, b)), 'This treats AND as "same truth value", so it wrongly counts the row where both parts are false as true.');
  }
  if (op === 'iff') {
    add(wrap(Bin('imp', a, b)), 'This treats the two-way arrow $\\leftrightarrow$ as a one-way implication $\\to$.');
    add(wrap(Bin('and', a, b)), 'This forgets that a biconditional is also true when **both** sides are false.');
    add(wrap(Not(Bin('iff', a, b))), 'This reverses the rule for $\\leftrightarrow$: it is true when the two sides are the **same**, not when they differ.');
  }
  pool.push({ c: answerCol.split('').map((x) => (x === 'T' ? 'F' : 'T')).join(''), why: 'Every row has been flipped: this is the column of the negation of the whole statement.' });
  const rowName = ['$p$ true, $q$ true', '$p$ true, $q$ false', '$p$ false, $q$ true', '$p$ false, $q$ false'];
  for (let i = 0; i < 4; i++) {
    const c = answerCol.split('');
    c[i] = c[i] === 'T' ? 'F' : 'T';
    pool.push({ c: c.join(''), why: `This has a slip in the row with ${rowName[i]}: work that row out again carefully, one connective at a time.` });
  }
  const picked: Cand[] = [];
  for (const d of pool) {
    if (picked.length === 3) break;
    if (d.c === answerCol || picked.some((x) => x.c === d.c)) continue;
    picked.push(d);
  }

  // ---- solution: truth table with helper columns
  const cols: F[] = [V('p'), V('q')];
  if (a.k === 'not') cols.push(a);
  if (b.k === 'not') cols.push(b);
  if (outer) cols.push(inner);
  cols.push(S);
  const header = '| ' + cols.map((f) => `$${tex(f)}$`).join(' | ') + ' |';
  const sep = '| ' + cols.map(() => '---').join(' | ') + ' |';
  const body = ROWS2.map((e) => '| ' + cols.map((f) => TV(ev(f, e))).join(' | ') + ' |').join('\n');
  const rule: Record<Op, string> = {
    and: '$X \\land Y$ is true only when both parts are true.',
    or: '$X \\lor Y$ is true when at least one part is true (false only when both are false).',
    imp: '$X \\to Y$ is false only when $X$ is true and $Y$ is false.',
    iff: '$X \\leftrightarrow Y$ is true when both sides have the same truth value.',
  };
  const steps: string[] = [];
  steps.push(`Build the truth table one column at a time, in the row order $(p, q)$ = (T, T), (T, F), (F, T), (F, F).`);
  if (a.k === 'not' || b.k === 'not') steps.push('First negate the letters that carry a $\\neg$ (just flip T and F).');
  steps.push(`Then apply the main connective. Rule: ${rule[op]}`);
  if (outer) steps.push('Finally the outer $\\neg$ flips every value of the bracket.');
  const solution =
    steps.join('\n\n') +
    '\n\n' +
    header +
    '\n' +
    sep +
    '\n' +
    body +
    `\n\nReading the last column from top to bottom gives the answer.\n\nAnswer: ${answer}`;

  return {
    stem: `In a truth table with rows in the order $(p, q)$ = (T, T), (T, F), (F, T), (F, F), which column gives the statement $${tex(S)}$?`,
    answer,
    answerValue: answerCol,
    distractors: picked.map((d) => ({ text: colText(d.c), value: d.c, why: d.why })),
    solution,
    keyIdea: 'Work inside out: negate single letters first, then apply the connective, then any outer negation, one row at a time.',
  };
}

// ================================================================ generator 2: converse / inverse / contrapositive / negation
type Kind = 'converse' | 'inverse' | 'contrapositive' | 'negation' | 'equivalent';
interface Ctx {
  P: string;
  nP: string;
  Q: string;
  nQ: string;
}
const CTX: Ctx[] = [
  { P: 'it rains', nP: 'it does not rain', Q: 'the match is cancelled', nQ: 'the match is not cancelled' },
  { P: '$n$ is divisible by 4', nP: '$n$ is not divisible by 4', Q: '$n$ is even', nQ: '$n$ is not even' },
  { P: 'you revise every day', nP: 'you do not revise every day', Q: 'you pass the exam', nQ: 'you do not pass the exam' },
  { P: 'the alarm rings', nP: 'the alarm does not ring', Q: 'Sara wakes up', nQ: 'Sara does not wake up' },
  { P: 'the shape is a square', nP: 'the shape is not a square', Q: 'the shape has four sides', nQ: 'the shape does not have four sides' },
  { P: 'the light is green', nP: 'the light is not green', Q: 'the cars can go', nQ: 'the cars cannot go' },
  { P: 'the model passes the test set', nP: 'the model does not pass the test set', Q: 'the model is deployed', nQ: 'the model is not deployed' },
];
const cap = (s: string) => (/^[a-z]/.test(s) ? s[0].toUpperCase() + s.slice(1) : s);

const KIND_DEF: Record<Exclude<Kind, 'equivalent'>, string> = {
  converse: 'the **converse** swaps the two parts',
  inverse: 'the **inverse** negates both parts but does not swap them',
  contrapositive: 'the **contrapositive** swaps the two parts **and** negates both',
  negation: 'the **negation** says the implication fails: the hypothesis happens **and** the conclusion does not',
};

function genForms(rng: Rng) {
  const kind = rng.pick<Kind>(['converse', 'inverse', 'contrapositive', 'contrapositive', 'negation', 'equivalent']);
  const english = rng.bool(0.55);
  const forms: Exclude<Kind, 'equivalent'>[] = ['converse', 'inverse', 'contrapositive', 'negation'];
  const target: Exclude<Kind, 'equivalent'> = kind === 'equivalent' ? 'contrapositive' : kind;

  let stmt: string;
  let text: Record<string, string>;
  let symbolSteps: string;
  if (english) {
    const c = rng.pick(CTX);
    stmt = `"If ${c.P}, then ${c.Q}."`;
    text = {
      converse: `If ${c.Q}, then ${c.P}.`,
      inverse: `If ${c.nP}, then ${c.nQ}.`,
      contrapositive: `If ${c.nQ}, then ${c.nP}.`,
      negation: `${cap(c.P)} and ${c.nQ}.`,
    };
    symbolSteps = `The hypothesis is $H$ = "${c.P}" and the conclusion is $C$ = "${c.Q}", so the statement is $H \\to C$.`;
  } else {
    const a: F = rng.bool() ? Not(V('p')) : V('p');
    const b: F = rng.bool() ? Not(V('q')) : V('q');
    stmt = `$${tex(Bin('imp', a, b))}$`;
    text = {
      converse: `$${tex(Bin('imp', b, a))}$`,
      inverse: `$${tex(Bin('imp', neg(a), neg(b)))}$`,
      contrapositive: `$${tex(Bin('imp', neg(b), neg(a)))}$`,
      negation: `$${tex(Bin('and', a, neg(b)))}$`,
    };
    symbolSteps = `The hypothesis is $H = ${tex(a)}$ and the conclusion is $C = ${tex(b)}$. When you negate, remove double negations: $\\neg\\neg p \\equiv p$.`;
  }

  const stem =
    kind === 'equivalent'
      ? `Which statement is **logically equivalent** to ${stmt}?`
      : `Which statement is the **${kind}** of ${stmt}?`;

  const sym: Record<string, string> = {
    converse: '$C \\to H$',
    inverse: '$\\neg H \\to \\neg C$',
    contrapositive: '$\\neg C \\to \\neg H$',
    negation: '$H \\land \\neg C$',
  };
  const whyFor = (f: Exclude<Kind, 'equivalent'>): string => {
    const base: Record<string, string> = {
      converse: 'This is the **converse** (the parts are swapped but not negated).',
      inverse: 'This is the **inverse** (both parts are negated but not swapped).',
      contrapositive: 'This is the **contrapositive** (the parts are swapped **and** both negated).',
      negation: 'This is the **negation** of the statement (hypothesis true and conclusion false); it is not an implication at all.',
    };
    let w = base[f];
    if (kind === 'equivalent' && (f === 'converse' || f === 'inverse'))
      w += ' It is not equivalent: it can be false when the original is true (hypothesis false, conclusion true).';
    if (kind === 'equivalent' && f === 'negation') w += ' It is true exactly when the original is false, the opposite of equivalent.';
    return w;
  };

  const answer = text[target];
  const distractors = forms
    .filter((f) => f !== target)
    .map((f) => ({ text: text[f], value: f, why: whyFor(f) }));

  const solLines = [
    symbolSteps,
    'For an implication $H \\to C$ (hypothesis $H$, conclusion $C$) the four related statements are:',
    `- converse: ${sym.converse}\n- inverse: ${sym.inverse}\n- contrapositive: ${sym.contrapositive}\n- negation: ${sym.negation}`,
    `Applied to ${stmt}:`,
    forms.map((f) => `- ${f}: ${text[f]}`).join('\n'),
  ];
  if (kind === 'equivalent')
    solLines.push(
      'A statement is always logically equivalent to its **contrapositive** (they are false in exactly the same case: hypothesis true, conclusion false). The converse and inverse are not equivalent to it, and the negation has the opposite truth value in every case.',
    );
  else solLines.push(`Here we need the ${kind}: ${KIND_DEF[kind]}.`);
  solLines.push(`Answer: ${answer}`);

  return {
    stem,
    answer,
    answerValue: target,
    distractors,
    solution: solLines.join('\n\n'),
    keyIdea:
      kind === 'equivalent'
        ? 'An implication is equivalent to its contrapositive, $\\neg q \\to \\neg p$, and to nothing else among converse, inverse and negation.'
        : 'Converse = swap; inverse = negate both; contrapositive = swap and negate; negation of $p \\to q$ is $p \\land \\neg q$.',
  };
}

// ================================================================ generator 3: evaluate statements for given truth values
function genEvaluate(rng: Rng) {
  const vars = ['p', 'q', 'r'];
  const env: Env = { p: rng.bool(), q: rng.bool(), r: rng.bool() };
  const wantTrue = rng.bool(0.7);
  const randF = (): F => {
    const op = rng.pick<Op>(['and', 'or', 'imp', 'imp', 'iff']);
    const pair = rng.sample(vars, 2);
    // keep alphabetical order for the symmetric connectives (looks natural); order matters for an implication
    const [x, y] = op === 'imp' ? pair : pair.slice().sort();
    const a: F = rng.bool(0.35) ? Not(V(x)) : V(x);
    const b: F = rng.bool(0.35) ? Not(V(y)) : V(y);
    const f = Bin(op, a, b);
    return rng.bool(0.2) ? Not(f) : f;
  };
  // Half the time, give p and q indirectly through a compound statement that forces both values.
  type Clue = { f: F; isTrue: boolean; deduce: string };
  const p = V('p');
  const q = V('q');
  const clueOpts: Clue[] =
    env.p && env.q
      ? [{ f: Bin('and', p, q), isTrue: true, deduce: 'AND is true only when both parts are true, so $p$ and $q$ are both true.' }]
      : !env.p && !env.q
        ? [
            { f: Bin('or', p, q), isTrue: false, deduce: 'OR is false only when both parts are false, so $p$ and $q$ are both false.' },
            { f: Not(Bin('or', p, q)), isTrue: true, deduce: 'If $\\neg(p \\lor q)$ is true then $p \\lor q$ is false, and OR is false only when both parts are false. So $p$ and $q$ are both false.' },
          ]
        : env.p
          ? [
              { f: Bin('imp', p, q), isTrue: false, deduce: 'An implication is false only when the hypothesis is true and the conclusion is false, so $p$ is true and $q$ is false.' },
              { f: Bin('and', p, Not(q)), isTrue: true, deduce: 'AND is true only when both parts are true, so $p$ is true and $\\neg q$ is true, i.e. $q$ is false.' },
            ]
          : [
              { f: Bin('imp', q, p), isTrue: false, deduce: 'An implication is false only when the hypothesis is true and the conclusion is false, so $q$ is true and $p$ is false.' },
              { f: Bin('and', Not(p), q), isTrue: true, deduce: 'AND is true only when both parts are true, so $\\neg p$ is true (i.e. $p$ is false) and $q$ is true.' },
            ];
  const clueF = rng.bool() ? rng.pick(clueOpts) : null;
  const clue = clueF ? { ...clueF, text: `$${tex(clueF.f)}$ is ${clueF.isTrue ? '**true**' : '**false**'}` } : null;

  const good: F[] = [];
  const bad: F[] = [];
  const seen = new Set<string>();
  if (clue) {
    // never offer the clue itself, its negation, or the bracket inside a negated clue as an option
    // (they would be true/false just by reading the stem)
    seen.add(tex(clue.f));
    seen.add(tex(Not(clue.f)));
    if (clue.f.k === 'not') seen.add(tex(clue.f.a));
  }
  for (let guard = 0; guard < 500 && (good.length < 1 || bad.length < 3); guard++) {
    const f = randF();
    const t = tex(f);
    if (seen.has(t)) continue;
    seen.add(t);
    if (ev(f, env) === wantTrue) {
      if (good.length < 1) good.push(f);
    } else if (bad.length < 3) bad.push(f);
  }
  if (good.length < 1 || bad.length < 3) throw new Error('evaluate generator: could not build options');

  /** "$\text{T} \land \text{F} = \text{F}$" style substitution for one formula. */
  const subst = (f: F): string => {
    const lit = (x: F): string => (x.k === 'var' ? TVt(env[x.v]) : `\\neg ${TVt(ev(x.a, env))}`);
    const inner = f.k === 'not' ? (f.a as Extract<F, { k: 'bin' }>) : (f as Extract<F, { k: 'bin' }>);
    const lv = ev(inner.a, env);
    const rv = ev(inner.b, env);
    const mid = `${TVt(lv)} ${OP_TEX[inner.op]} ${TVt(rv)}`;
    const first = `${lit(inner.a)} ${OP_TEX[inner.op]} ${lit(inner.b)}`;
    const chain = first === mid ? [first] : [first, mid];
    if (f.k === 'not') return `\\neg(${chain.join(') = \\neg(')}) = \\neg ${TVt(ev(inner, env))} = ${TVt(ev(f, env))}`;
    return `${chain.join(' = ')} = ${TVt(ev(f, env))}`;
  };
  const reason = (f: F): string => {
    const inner = f.k === 'not' ? (f.a as Extract<F, { k: 'bin' }>) : (f as Extract<F, { k: 'bin' }>);
    const lv = ev(inner.a, env);
    const rv = ev(inner.b, env);
    const iv = ev(inner, env);
    let r: string;
    switch (inner.op) {
      case 'and':
        r = iv ? 'AND is true because both parts are true' : 'AND needs both parts to be true, and at least one part is false here';
        break;
      case 'or':
        r = iv ? 'OR is true because at least one part is true' : 'OR is false only when both parts are false, which is the case here';
        break;
      case 'imp':
        r = iv
          ? lv
            ? 'the conclusion is true, so the implication holds'
            : 'the hypothesis is false, so the implication is (vacuously) true'
          : 'a true hypothesis with a false conclusion is the one case where an implication is false';
        break;
      case 'iff':
        r = iv ? 'both sides have the same truth value' : `the two sides differ, ${TV(lv)} versus ${TV(rv)}, so the biconditional is false`;
        break;
    }
    if (f.k === 'not') r += `; then the outer $\\neg$ flips the bracket from ${TV(iv)} to ${TV(!iv)}`;
    return r;
  };

  const answerF = good[0];
  const answer = `$${tex(answerF)}$`;
  const word = wantTrue ? 'true' : 'false';
  const opp = wantTrue ? 'false' : 'true';
  const distractors = bad.map((f) => {
    const ib = f.k === 'not' ? (f.a as Extract<F, { k: 'bin' }>) : (f as Extract<F, { k: 'bin' }>);
    const slip =
      f.k === 'not'
        ? 'Choosing it usually comes from forgetting the outer $\\neg$.'
        : ib.a.k === 'not' || ib.b.k === 'not'
          ? `Choosing it usually comes from forgetting a $\\neg$ or misreading the ${OP_NAME[ib.op]} rule.`
          : `Choosing it comes from misreading the ${OP_NAME[ib.op]} rule.`;
    return {
      text: `$${tex(f)}$`,
      value: tex(f),
      why: `This statement is ${opp}: $${subst(f)}$ (${reason(f)}). ${slip}`,
    };
  });

  const all = [answerF, ...bad];
  const order = rng.shuffle(all);
  const lines = order.map((f) => `- $${tex(f)}$: $${subst(f)}$ (${reason(f)})`).join('\n');
  const solution =
    (clue ? `**Step 1: find $p$ and $q$.** ${clue.deduce}\n\n**Step 2: substitute.** ` : '') +
    `Substitute $p = ${TVt(env.p)}$, $q = ${TVt(env.q)}$, $r = ${TVt(env.r)}$ into each statement. Negate single letters first, then apply the connective, then any outer $\\neg$.\n\n` +
    lines +
    `\n\nOnly one statement is ${word}.\n\nAnswer: ${answer}`;

  const tvWord = (b: boolean) => (b ? '**true**' : '**false**');
  const given = clue
    ? `It is known that ${clue.text} and that $r$ is ${tvWord(env.r)}.`
    : `Suppose $p$ is ${tvWord(env.p)}, $q$ is ${tvWord(env.q)} and $r$ is ${tvWord(env.r)}.`;
  return {
    stem: `${given} Which of the following statements is **${word}**?`,
    answer,
    answerValue: tex(answerF),
    distractors,
    solution,
    keyIdea: 'Substitute the truth values, negate single letters first, then use the rule for the connective (an implication is false only for true $\\to$ false).',
  };
}

export const generators: Generator[] = [
  {
    id: 'gen-propositional-logic-truth-column',
    subtopic: 'propositional-logic',
    difficulty: 'exam',
    title: 'Truth-table column of a compound statement',
    generate: genColumn,
  },
  {
    id: 'gen-propositional-logic-converse-contrapositive',
    subtopic: 'propositional-logic',
    difficulty: 'foundation',
    title: 'Converse, inverse, contrapositive or negation of an implication',
    generate: genForms,
  },
  {
    id: 'gen-propositional-logic-evaluate',
    subtopic: 'propositional-logic',
    difficulty: 'foundation',
    title: 'Which statement is true for given truth values?',
    generate: genEvaluate,
  },
];
