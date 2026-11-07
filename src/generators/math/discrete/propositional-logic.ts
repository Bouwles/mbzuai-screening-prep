import type { Generator } from '../../../types';
import { steps as stepsOf, table as tbl } from '../../../lib/explanation';
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

const OP_NAME: Record<Op, string> = { and: 'AND', or: 'OR', imp: 'implication', iff: '"if and only if"' };

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
    add(wrap(Bin('iff', a, b)), 'This treats the one-way arrow $\\to$ as the two-way arrow $\\leftrightarrow$ ("same truth value"), but an implication with a false left side is always true.');
    add(wrap(Bin('and', a, b)), 'This treats the implication as AND, forgetting that an implication with a false left side is always true.');
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
    add(wrap(Bin('and', a, b)), 'This forgets that $\\leftrightarrow$ is also true when **both** sides are false.');
    add(wrap(Not(Bin('iff', a, b))), 'This reverses the rule for $\\leftrightarrow$: it is true when the two sides are the **same**, not when they differ.');
  }
  pool.push({ c: answerCol.split('').map((x) => (x === 'T' ? 'F' : 'T')).join(''), why: 'Every row has been flipped: this is the column of the negation of the whole statement.' });
  const rowName = ['$p$ true, $q$ true', '$p$ true, $q$ false', '$p$ false, $q$ true', '$p$ false, $q$ false'];
  for (let i = 0; i < 4; i++) {
    const c = answerCol.split('');
    c[i] = c[i] === 'T' ? 'F' : 'T';
    pool.push({ c: c.join(''), why: `This has a slip in the row with ${rowName[i]}: work that row out again, one symbol at a time.` });
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
  const truthTable = tbl(
    cols.map((f) => `$${tex(f)}$`),
    ROWS2.map((e) => cols.map((f) => TV(ev(f, e)))),
  );
  const rule: Record<Op, string> = {
    and: `The symbol $${OP_TEX[op]}$ is read "and". It is true only when both sides are true.`,
    or: `The symbol $${OP_TEX[op]}$ is read "or". It is true when at least one side is true, so it is false only when both sides are false.`,
    imp: `The symbol $${OP_TEX[op]}$ is read "if ... then". It is false only when the left side is true and the right side is false. Every other row is true.`,
    iff: `The symbol $${OP_TEX[op]}$ is read "if and only if". It is true when the two sides match, and false when they differ.`,
  };
  const anyNot = a.k === 'not' || b.k === 'not' || outer;
  const solution = stepsOf(
    rule[op],
    anyNot && 'The symbol $\\neg$ means "not". It flips every T to F and every F to T.',
    `Work from the inside out, adding one column at a time${outer ? ', and flip the bracket last' : ''}. The rows go in the order given:\n\n${truthTable}`,
  );

  return {
    stem: `In a truth table with rows in the order $(p, q)$ = (T, T), (T, F), (F, T), (F, F), which column gives the statement $${tex(S)}$?`,
    answer,
    answerValue: answerCol,
    distractors: picked.map((d) => ({ text: colText(d.c), value: d.c, why: d.why })),
    asking: `What are the four truth values of $${tex(S)}$, from the top row to the bottom?`,
    solution,
    conclusion: `Reading the last column from top to bottom gives ${answer}.`,
    keyIdea: 'Add one helper column for each negated letter and bracket. Work from the inside out: flip single letters first, apply the main symbol row by row, then any outer $\\neg$. The last column is the result.',
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

function genForms(rng: Rng) {
  const kind = rng.pick<Kind>(['converse', 'inverse', 'contrapositive', 'contrapositive', 'negation', 'equivalent']);
  const english = rng.bool(0.55);
  const forms: Exclude<Kind, 'equivalent'>[] = ['converse', 'inverse', 'contrapositive', 'negation'];
  const target: Exclude<Kind, 'equivalent'> = kind === 'equivalent' ? 'contrapositive' : kind;

  let stmt: string;
  let text: Record<string, string>;
  let partsStep: string;
  if (english) {
    const c = rng.pick(CTX);
    stmt = `"If ${c.P}, then ${c.Q}."`;
    text = {
      converse: `If ${c.Q}, then ${c.P}.`,
      inverse: `If ${c.nP}, then ${c.nQ}.`,
      contrapositive: `If ${c.nQ}, then ${c.nP}.`,
      negation: `${cap(c.P)} and ${c.nQ}.`,
    };
    partsStep = `Name the two parts. The "if" part is "${c.P}". The "then" part is "${c.Q}".`;
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
    partsStep = `Name the two parts. The left part of the arrow is $${tex(a)}$ and the right part is $${tex(b)}$. The symbol $\\neg$ means "not", and putting "not" on a part that already has $\\neg$ cancels it, because "not not $p$" means $p$.`;
  }

  const stem =
    kind === 'equivalent'
      ? `Which statement is **logically equivalent** to ${stmt}?`
      : `Which statement is the **${kind}** of ${stmt}?`;

  const whyFor = (f: Exclude<Kind, 'equivalent'>): string => {
    const base: Record<string, string> = {
      converse: 'This is the **converse** (the parts are swapped but not negated).',
      inverse: 'This is the **inverse** (both parts are negated but not swapped).',
      contrapositive: 'This is the **contrapositive** (the parts are swapped **and** both negated).',
      negation: 'This is the **negation** of the statement (the first part true and the second part false). It is not an implication at all.',
    };
    let w = base[f];
    if (kind === 'equivalent' && (f === 'converse' || f === 'inverse'))
      w += ' It is not equivalent: it can be false when the original is true (first part false, second part true).';
    if (kind === 'equivalent' && f === 'negation') w += ' It is true exactly when the original is false, the opposite of equivalent.';
    return w;
  };

  const answer = text[target];
  const distractors = forms
    .filter((f) => f !== target)
    .map((f) => ({ text: text[f], value: f, why: whyFor(f) }));

  const end = (t: string) => (t.endsWith('.') ? t : `${t}.`);
  const asking: Record<Kind, string> = {
    converse: 'What do you get when you swap the two parts of this if-then statement?',
    inverse: 'What do you get when you put "not" on both parts of this if-then statement, without swapping them?',
    contrapositive: 'What is the "swap and negate" version of this if-then statement?',
    negation: 'What statement is true exactly when this if-then statement is false?',
    equivalent: 'Which statement is true and false in exactly the same cases as this if-then statement?',
  };
  const ruleStep: Record<Kind, string> = {
    converse: 'The **converse** swaps the two parts and changes nothing else.',
    inverse: 'The **inverse** puts "not" on both parts and does not swap them.',
    contrapositive: 'The **contrapositive** does two things: it swaps the two parts, and it puts "not" on both.',
    negation: 'The **negation** is true exactly when the original is false. An if-then statement is false in only one case: the first part is true and the second part is false.',
    equivalent: '**Logically equivalent** means true and false in exactly the same cases. An if-then statement is false in only one case: the first part is true and the second part is false.',
  };
  const lastStep: Record<Kind, string> = {
    converse: `Swap the two parts: ${text.converse}`,
    inverse: `Put "not" on each part and keep the order: ${text.inverse}`,
    contrapositive: `Swap the parts: ${end(text.converse)} Then put "not" on each part: ${text.contrapositive}`,
    negation: english
      ? `So the negation says the first part happens and the second part doesn't: ${text.negation}`
      : `So the negation says the first part happens and the second part doesn't. The symbol $\\land$ means "and", which gives ${text.negation}`,
    equivalent: `Swap the parts: ${end(text.converse)} Then put "not" on each part: ${text.contrapositive}`,
  };
  const conclusion: Record<Kind, string> = {
    converse: `Swapping the two parts and changing nothing else gives: ${end(answer)}`,
    inverse: `Putting "not" on both parts without swapping gives: ${end(answer)}`,
    contrapositive: `Swapping the parts and putting "not" on both gives: ${end(answer)}`,
    negation: `This is true in the one case where the original is false, so the negation is: ${end(answer)}`,
    equivalent: `It is false in the same single case as the original, so the equivalent statement is: ${end(answer)}`,
  };
  const solution = stepsOf(
    partsStep,
    ruleStep[kind],
    kind === 'equivalent' &&
      'The **contrapositive** (swap the two parts and put "not" on both) is false in that same case and no other, so it always matches the original. The converse and the inverse can be false when the original is true, so they do not match.',
    lastStep[kind],
  );

  return {
    stem,
    answer,
    answerValue: target,
    distractors,
    asking: asking[kind],
    solution,
    conclusion: conclusion[kind],
    keyIdea:
      kind === 'equivalent'
        ? 'An if-then statement, written $p \\to q$, always matches its contrapositive, $\\neg q \\to \\neg p$, where $\\neg$ means "not". The converse, the inverse and the negation do not. To test a claimed match, try $p$ true and $q$ false, the one case where $p \\to q$ is false.'
        : 'For $p \\to q$, meaning "if $p$ then $q$", with $\\neg$ for "not" and $\\land$ for "and": the converse swaps to $q \\to p$. The inverse negates to $\\neg p \\to \\neg q$. The contrapositive does both, $\\neg q \\to \\neg p$. The negation is $p \\land \\neg q$.',
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
      ? [{ f: Bin('and', p, q), isTrue: true, deduce: 'An "and" ($\\land$) is true only when both parts are true, so $p$ and $q$ are both true.' }]
      : !env.p && !env.q
        ? [
            { f: Bin('or', p, q), isTrue: false, deduce: 'An "or" ($\\lor$) is false only when both parts are false, so $p$ and $q$ are both false.' },
            { f: Not(Bin('or', p, q)), isTrue: true, deduce: 'If $\\neg(p \\lor q)$ is true then $p \\lor q$ is false. An "or" is false only when both parts are false, so $p$ and $q$ are both false.' },
          ]
        : env.p
          ? [
              { f: Bin('imp', p, q), isTrue: false, deduce: 'An implication ($\\to$) is false only when its left side is true and its right side is false, so $p$ is true and $q$ is false.' },
              { f: Bin('and', p, Not(q)), isTrue: true, deduce: 'An "and" ($\\land$) is true only when both parts are true. So $p$ is true and $\\neg q$ is true, which means $q$ is false.' },
            ]
          : [
              { f: Bin('imp', q, p), isTrue: false, deduce: 'An implication ($\\to$) is false only when its left side is true and its right side is false, so $q$ is true and $p$ is false.' },
              { f: Bin('and', Not(p), q), isTrue: true, deduce: 'An "and" ($\\land$) is true only when both parts are true. So $\\neg p$ is true, which means $p$ is false, and $q$ is true.' },
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
            ? 'the right side is true, so the implication holds'
            : 'the left side is false, so the implication counts as true'
          : 'true then false is the one case where an implication is false';
        break;
      case 'iff':
        r = iv ? 'both sides have the same truth value' : `the two sides differ, ${TV(lv)} versus ${TV(rv)}, so the "if and only if" is false`;
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
  const inners = all.map((f) => (f.k === 'not' ? (f.a as Extract<F, { k: 'bin' }>) : (f as Extract<F, { k: 'bin' }>)));
  const usedOps = (['and', 'or', 'imp', 'iff'] as Op[]).filter((op) => inners.some((f) => f.op === op));
  const opRow: Record<Op, string[]> = {
    and: ['$\\land$', 'and', 'both sides are true'],
    or: ['$\\lor$', 'or', 'at least one side is true'],
    imp: ['$\\to$', 'if ... then', 'any case except true then false'],
    iff: ['$\\leftrightarrow$', 'if and only if', 'both sides match'],
  };
  const clueHasNot = clue !== null && (clue.f.k === 'not' || (clue.f.k === 'bin' && (clue.f.a.k === 'not' || clue.f.b.k === 'not')));
  const hasNot = clueHasNot || all.some((f) => f.k === 'not') || inners.some((f) => f.a.k === 'not' || f.b.k === 'not');
  const symbolTable = tbl(['Symbol', 'Read it as', 'True when'], usedOps.map((op) => opRow[op]));
  const solution = stepsOf(
    `${hasNot ? 'The symbol $\\neg$ means "not": it flips T and F. Here is what the other symbols mean' : 'Here is what the symbols mean'}:\n\n${symbolTable}`,
    clue && `First find $p$ and $q$. ${clue.deduce}`,
    `Put in $p = ${TVt(env.p)}$, $q = ${TVt(env.q)}$ and $r = ${TVt(env.r)}$. Flip single letters first, then apply the main symbol, then any $\\neg$ outside a bracket:\n\n${tbl(
      ['Statement', 'Working', 'Result'],
      order.map((f) => [`$${tex(f)}$`, `$${subst(f)}$`, ev(f, env) ? 'True' : 'False']),
    )}`,
  );

  const tvWord = (b: boolean) => (b ? '**true**' : '**false**');
  const given = clue
    ? `It is known that ${clue.text} and that $r$ is ${tvWord(env.r)}.`
    : `Suppose $p$ is ${tvWord(env.p)}, $q$ is ${tvWord(env.q)} and $r$ is ${tvWord(env.r)}.`;
  return {
    stem: `${given} Which of the following statements is **${word}**?`,
    answer,
    answerValue: tex(answerF),
    distractors,
    asking: clue ? `After working out $p$ and $q$, which statement comes out ${word}?` : `With these truth values, which statement comes out ${word}?`,
    solution,
    conclusion: `Only one of the four statements comes out ${word} with these values, and that is ${answer}.`,
    keyIdea: 'Replace each letter with T or F. Flip any $\\neg$ on a single letter first, apply the main symbol, then any outer $\\neg$. An implication is false only for true then false.',
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
