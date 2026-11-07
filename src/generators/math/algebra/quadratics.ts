import type { Generator } from '../../../types';
import { steps } from '../../../lib/explanation';
import { Frac, gcd } from '../../../lib/frac';
import { m, paren, poly, signed, sum, term } from '../../../lib/tex';

// ---------------------------------------------------------------- helpers

type RootPair = [Frac, Frac];

const sortPair = ([u, v]: RootPair): RootPair => (u.value() <= v.value() ? [u, v] : [v, u]);
const pairKey = (pr: RootPair): string =>
  sortPair(pr)
    .map((f) => f.toString())
    .join(',');
const pairText = (pr: RootPair): string => {
  const [u, v] = sortPair(pr);
  return `${m(`x = ${u.tex()}`)} or ${m(`x = ${v.tex()}`)}`;
};

/** "x - 3" / "2x + 1" : the linear expression px - q. */
const lin = (p: number, q: number): string => sum([[p, 'x'], [-q, '']]);

// ---------------------------------------------------------------- generators

export const generators: Generator[] = [
  {
    id: 'gen-quadratics-solve-factorise',
    subtopic: 'quadratics',
    difficulty: 'exam',
    title: 'Solve a quadratic equation by factorising',
    generate(rng) {
      const monic = rng.bool();
      let p = 1;
      let q = 0;
      let r = 0;
      if (monic) {
        for (;;) {
          q = rng.intNonZero(-9, 9);
          r = rng.intNonZero(-9, 9);
          if (q !== r && q !== -r) break;
        }
      } else {
        p = rng.pick([2, 3]);
        for (;;) {
          q = rng.intNonZero(-7, 7);
          if (gcd(p, q) === 1) break;
        }
        r = rng.intNonZero(-6, 6);
      }
      // (px - q)(x - r) = px^2 - (pr + q)x + qr
      const a = p;
      const b = -(p * r + q);
      const c = q * r;
      const x1 = new Frac(q, p);
      const x2 = new Frac(r);
      const correct: RootPair = [x1, x2];
      const f1 = lin(p, q);
      const f2 = lin(1, r);
      const eq = `${poly([a, b, c])} = 0`;

      const signFlip = {
        pair: [x1.neg(), x2.neg()] as RootPair,
        why: `Both signs are flipped. The bracket ${m(`(${f2})`)} is zero when ${m(`x = ${r}`)}, not ${m(`x = ${-r}`)}: the root has the opposite sign to the number written in the bracket.`,
      };
      const middle: { pair: RootPair; why: string }[] = [];
      if (!monic) {
        middle.push({
          pair: [new Frac(q), x2],
          why: `This solves ${m(`${f1} = 0`)} as ${m(`x = ${q}`)}, forgetting to divide by ${p}.`,
        });
        middle.push({
          pair: [new Frac(p, q), x2],
          why: `This divides the wrong way round: ${m(`${p}x = ${q}`)} gives ${m(`x = ${x1.tex()}`)}, not ${m(`x = ${new Frac(p, q).tex()}`)}.`,
        });
      } else {
        // other integer pairs (s, t) with s * t = c: a trial factorisation (x + s)(x + t) whose middle term is wrong
        const pairs: [number, number][] = [];
        for (let s = -Math.abs(c); s <= Math.abs(c); s++) {
          if (s === 0 || c % s !== 0) continue;
          const t = c / s;
          if (s > t) continue;
          if (s + t === b || s + t === -b) continue; // the correct pair, or its sign-flipped twin
          pairs.push([s, t]);
        }
        for (const [s, t] of rng.shuffle(pairs)) {
          middle.push({
            pair: [new Frac(-s), new Frac(-t)],
            why: `This comes from factorising as ${m(`(x${signed(s)})(x${signed(t)})`)}: the numbers ${m(String(s))} and ${m(String(t))} multiply to ${m(String(c))} but add to ${m(String(s + t))}, not ${m(String(b))}, so it does not expand back to the original.`,
          });
        }
      }
      const halfFlips = [
        {
          pair: [x1, x2.neg()] as RootPair,
          why: `Sign slip in one bracket: ${m(`${f2} = 0`)} gives ${m(`x = ${r}`)}, not ${m(`x = ${-r}`)}.`,
        },
        {
          pair: [x1.neg(), x2] as RootPair,
          why: `Sign slip in one bracket: ${m(`${f1} = 0`)} gives ${m(`x = ${x1.tex()}`)}, not ${m(`x = ${x1.neg().tex()}`)}.`,
        },
      ];
      const pool = [signFlip, ...rng.shuffle(middle), ...halfFlips];
      const used = new Set<string>([pairKey(correct)]);
      const distractors: { text: string; value: string; why: string }[] = [];
      for (const d of pool) {
        if (distractors.length === 3) break;
        const key = pairKey(d.pair);
        if (used.has(key) || d.pair[0].equals(d.pair[1])) continue;
        used.add(key);
        distractors.push({ text: pairText(d.pair), value: key, why: d.why });
      }

      const answer = pairText(correct);
      const whyBrackets = `We want two brackets multiplied together, because if two things multiply to 0, at least one of them must be 0. Turning the expression into brackets is called **factorising**.`;
      const solveBrackets =
        `Set each bracket to 0 and solve. ${m(`${f1} = 0`)} gives ${m(`x = ${x1.tex()}`)}, and ${m(`${f2} = 0`)} gives ${m(`x = ${r}`)}.`;
      const solution = monic
        ? steps(
            whyBrackets,
            `There is no number in front of ${m('x^{2}')}, so the brackets look like ${m('(x + s)(x + t)')}. Multiplying these out shows that ${m('s')} and ${m('t')} must **multiply to** ${m(String(c))} and **add to** ${m(String(b))}.`,
            `The numbers ${m(String(-q))} and ${m(String(-r))} work: ${m(`${-q} \\times ${paren(-r)} = ${c}`)} and ${m(`${-q} + ${paren(-r)} = ${b}`)}.`,
            `So the equation becomes ${m(`(${f1})(${f2}) = 0`)}.`,
            `${solveBrackets} Each root has the opposite sign to the number in its bracket.`,
          )
        : steps(
            whyBrackets,
            `There is a ${m(String(a))} in front of ${m('x^{2}')}, so we split the middle term into two parts. Multiply the first and last numbers: ${m(`${a} \\times ${paren(c)} = ${a * c}`)}. We need two numbers that multiply to ${m(String(a * c))} and add to ${m(String(b))}.`,
            `They are ${m(String(-p * r))} and ${m(String(-q))}. Use them to split the middle term: ${m(sum([[p, 'x^{2}'], [-p * r, 'x'], [-q, 'x'], [q * r, '']]))}.`,
            `Take out what each pair has in common: ${m(`${p}x(${f2})${term(-q, `(${f2})`, false)}`)}. Both parts contain ${m(`(${f2})`)}, so take that out too: ${m(`(${f1})(${f2}) = 0`)}.`,
            solveBrackets,
          );
      return {
        stem: `Solve ${m(eq)}.`,
        answer,
        answerValue: pairKey(correct),
        distractors,
        asking: `Which two values of ${m('x')} make ${m(poly([a, b, c]))} equal to 0?`,
        solution,
        conclusion: `Each value makes one bracket zero, so the whole product is zero. The answer is ${answer}.`,
        keyIdea: 'To solve a quadratic equal to 0, factorise it and set each bracket to zero. For $x^{2} + bx + c$, find two numbers that multiply to $c$ and add to $b$. For $ax^{2} + bx + c$, find two numbers that multiply to $ac$ and add to $b$, then use them to split $bx$ into two terms.',
      };
    },
  },

  {
    id: 'gen-quadratics-complete-square',
    subtopic: 'quadratics',
    difficulty: 'exam',
    title: 'Complete the square',
    generate(rng) {
      const a = rng.pick([1, 1, 2, 3]);
      const lim = a === 3 ? 4 : 6;
      const p = rng.intNonZero(-lim, lim);
      const qv = rng.intNonZero(-12, 12);
      const b = 2 * a * p;
      const c = a * p * p + qv;
      const lead = a === 1 ? '' : String(a);
      const form = (pp: number, qq: number) => `${lead}(${sum([[1, 'x'], [pp, '']])})^{2}${qq === 0 ? '' : signed(qq)}`;
      const xp = sum([[1, 'x'], [p, '']]);
      const sc = c === 0 ? '' : signed(c);
      const answer = m(form(p, qv));

      const pool: { pp: number; qq: number; why: string }[] = [
        {
          pp: p,
          qq: c + a * p * p,
          why:
            a === 1
              ? `This adds ${m(String(p * p))} instead of subtracting it. ${m(`(${xp})^{2}`)} already contains ${m(`+${p * p}`)}, so it has to be taken away again.`
              : `This adds ${m(String(a * p * p))} instead of subtracting it. ${m(`${a}(${xp})^{2}`)} already contains ${m(`+${a * p * p}`)}, so it has to be taken away again.`,
        },
        {
          pp: 2 * p,
          qq: c - a * 4 * p * p,
          why: `This forgets to halve the coefficient of ${m('x')} inside the bracket: ${m(`(${sum([[1, 'x'], [2 * p, '']])})^{2}`)} has the wrong ${m('x')} term.`,
        },
        {
          pp: -p,
          qq: qv,
          why: `The sign inside the bracket is wrong: ${m(`(${sum([[1, 'x'], [-p, '']])})^{2}`)} expands to give ${m(`${-2 * p}x`)}, but the bracket must give ${m(`${2 * p}x`)}${a === 1 ? '' : ` (so that ${a} times it is ${m(`${b}x`)})`}.`,
        },
      ];
      if (a > 1)
        pool.push({
          pp: p,
          qq: c - p * p,
          why: `This forgets to multiply the ${m(String(-p * p))} by the ${a} outside the bracket. Expanding ${m(`${a}\\left[(${xp})^{2} - ${p * p}\\right]`)} gives ${m(String(-a * p * p))}, not ${m(String(-p * p))}.`,
        });
      const used = new Set<string>([`${p},${qv}`]);
      const distractors: { text: string; value: string; why: string }[] = [];
      for (const d of rng.shuffle(pool)) {
        if (distractors.length === 3) break;
        const key = `${d.pp},${d.qq}`;
        if (used.has(key)) continue;
        used.add(key);
        distractors.push({ text: m(form(d.pp, d.qq)), value: key, why: d.why });
      }

      const solution =
        a === 1
          ? steps(
              `This method is called **completing the square**. We want a bracket whose square starts with ${m(poly([1, b, 0]))}.`,
              `Take the number in front of ${m('x')}, which is ${m(String(b))}, and halve it: ${m(`${b} \\div 2 = ${p}`)}. That number goes in the bracket, giving ${m(`(${xp})^{2}`)}.`,
              `Multiply the bracket out to see what it really gives: ${m(`(${xp})^{2} = ${poly([1, b, p * p])}`)}.`,
              `That matches the start of our expression, but it ends in ${m(`+${p * p}`)} and we need ${m(String(c))}. The gap is ${m(`${c} - ${p * p} = ${qv}`)}.`,
              `So put ${m(String(qv))} after the bracket: ${m(`${poly([1, b, c])} = ${form(p, qv)}`)}.`,
            )
          : steps(
              `This method is called **completing the square**. The ${m(String(a))} in front of ${m('x^{2}')} gets in the way, so take it out of the first two terms only: ${m(`${poly([a, b, c])} = ${a}\\left(${poly([1, 2 * p, 0])}\\right)${sc}`)}.`,
              `Inside the bracket, take the number in front of ${m('x')}, which is ${m(String(2 * p))}, and halve it: ${m(`${2 * p} \\div 2 = ${p}`)}. So we use ${m(`(${xp})^{2}`)}.`,
              `Multiply that out: ${m(`(${xp})^{2} = ${poly([1, 2 * p, p * p])}`)}. That is ${m(String(p * p))} too many, so ${m(`${poly([1, 2 * p, 0])} = (${xp})^{2} - ${p * p}`)}.`,
              `Put this back in. The ${m(String(a))} multiplies both parts: ${m(`${a}\\left[(${xp})^{2} - ${p * p}\\right]${sc} = ${a}(${xp})^{2} - ${a * p * p}${sc}`)}.${c === 0 ? ' There is only one plain number, so this is the form we want.' : ''}`,
              c !== 0 && `Combine the plain numbers: ${m(`-${a * p * p}${sc} = ${qv}`)}. This gives ${m(form(p, qv))}.`,
            );
      return {
        stem: `Write ${m(poly([a, b, c]))} in the form ${m(a === 1 ? '(x + p)^{2} + q' : 'a(x + p)^{2} + q')}.`,
        answer,
        answerValue: `${p},${qv}`,
        distractors,
        asking: `Rewrite ${m(poly([a, b, c]))} so that ${m('x')} appears only once, inside a squared bracket.`,
        solution,
        conclusion: `Test with ${m('x = 0')}: the original gives ${m(String(c))} and the new form gives ${m(`${a * p * p}${signed(qv)} = ${c}`)}. They match, so the answer is ${answer}.`,
        keyIdea: 'To write $x^{2} + bx + c$ as a squared bracket: halve $b$ and put it in the bracket, square that halved number, then subtract the result from $c$. If there is a number in front of $x^{2}$, take it out of the first two terms first.',
      };
    },
  },

  {
    id: 'gen-quadratics-root-sum-product',
    subtopic: 'quadratics',
    difficulty: 'exam',
    title: 'Use the sum and product of roots',
    generate(rng) {
      for (;;) {
        const a = rng.pick([1, 1, 2]);
        const b = rng.intNonZero(-9, 9);
        const c = rng.intNonZero(-9, 9);
        if (b * b - 4 * a * c <= 0) continue;
        if (gcd(gcd(a, b), c) !== 1) continue;
        const kind = rng.pick(['sq', 'recip', 'diff2'] as const);
        const S = new Frac(-b, a);
        const P = new Frac(c, a);
        const S2 = S.mul(S);
        const sqS = S.isInt() && S.n > 0 ? `${S.n}^{2}` : `\\left(${S.tex()}\\right)^{2}`;
        let ans: Frac;
        let target: string;
        let identity: (string | false)[];
        let pool: { f: Frac; why: string }[];
        if (kind === 'sq') {
          ans = S2.sub(P.mul(2));
          target = '\\alpha^{2} + \\beta^{2}';
          identity = [
            `We need ${m(target)} written using only the sum and the product. Expand the square of the sum: ${m('(\\alpha + \\beta)^{2} = \\alpha^{2} + 2\\alpha\\beta + \\beta^{2}')}.`,
            `Take ${m('2\\alpha\\beta')} from both sides: ${m('\\alpha^{2} + \\beta^{2} = (\\alpha + \\beta)^{2} - 2\\alpha\\beta')}.`,
            `Substitute the sum and the product: ${m(`\\alpha^{2} + \\beta^{2} = ${sqS} - 2 \\times ${paren(P)} = ${S2.tex()}${signed(P.mul(-2))} = ${ans.tex()}`)}.`,
          ];
          pool = [
            { f: S2.sub(P), why: `This subtracts ${m('\\alpha\\beta')} only once. The expansion of ${m('(\\alpha + \\beta)^{2}')} contains ${m('2\\alpha\\beta')}, so subtract ${m('2\\alpha\\beta')}.` },
            { f: S2.add(P.mul(2)), why: `This adds ${m('2\\alpha\\beta')} instead of subtracting it: ${m('\\alpha^{2} + \\beta^{2} = (\\alpha + \\beta)^{2} - 2\\alpha\\beta')}.` },
            { f: S2, why: `This assumes ${m('\\alpha^{2} + \\beta^{2} = (\\alpha + \\beta)^{2}')}, forgetting the middle term ${m('2\\alpha\\beta')} of the expansion.` },
            { f: S2.sub(P.mul(4)), why: `This uses ${m('4\\alpha\\beta')}, which belongs to the identity for ${m('(\\alpha - \\beta)^{2}')}, not ${m('\\alpha^{2} + \\beta^{2}')}.` },
          ];
          if (a > 1) pool.push({ f: new Frac(b * b - 2 * c), why: `This forgets to divide by ${m(`a = ${a}`)}: it uses ${m(`\\alpha + \\beta = ${-b}`)} and ${m(`\\alpha\\beta = ${c}`)}.` });
        } else if (kind === 'recip') {
          ans = S.div(P);
          target = '\\frac{1}{\\alpha} + \\frac{1}{\\beta}';
          identity = [
            `We need ${m(target)} written using only the sum and the product. Fractions add once their bottoms match, so give both the bottom ${m('\\alpha\\beta')}. Multiply the first top and bottom by ${m('\\beta')}, and the second by ${m('\\alpha')}: ${m('\\frac{\\beta}{\\alpha\\beta} + \\frac{\\alpha}{\\alpha\\beta} = \\frac{\\alpha + \\beta}{\\alpha\\beta}')}.`,
            `That is the sum divided by the product. Substitute them: ${m(`\\frac{\\alpha + \\beta}{\\alpha\\beta} = ${paren(S)} \\div ${paren(P)} = ${ans.tex()}`)}.`,
          ];
          pool = [
            { f: P.div(S), why: `This turns the fraction upside down: ${m('\\frac{1}{\\alpha} + \\frac{1}{\\beta} = \\frac{\\alpha + \\beta}{\\alpha\\beta}')}, not ${m('\\frac{\\alpha\\beta}{\\alpha + \\beta}')}.` },
            { f: S.neg().div(P), why: `This uses ${m('\\alpha + \\beta = \\frac{b}{a}')} instead of ${m('-\\frac{b}{a}')}, so the sign is wrong.` },
            { f: new Frac(1).div(S), why: `This assumes ${m('\\frac{1}{\\alpha} + \\frac{1}{\\beta} = \\frac{1}{\\alpha + \\beta}')}, but fractions do not add like that.` },
            { f: S.mul(P), why: `This multiplies the sum by the product instead of dividing: the correct result is ${m('\\frac{\\alpha + \\beta}{\\alpha\\beta}')}.` },
            { f: P.neg().div(S), why: `This turns the fraction upside down **and** uses the wrong sign for the sum of the roots.` },
          ];
          if (a > 1) pool.push({ f: S.div(c), why: `This uses ${m(`\\alpha\\beta = ${c}`)}, forgetting to divide ${m('c')} by ${m(`a = ${a}`)}.` });
        } else {
          ans = S2.sub(P.mul(4));
          target = '(\\alpha - \\beta)^{2}';
          identity = [
            `We need ${m(target)} written using only the sum and the product. Expand it: ${m('(\\alpha - \\beta)^{2} = \\alpha^{2} - 2\\alpha\\beta + \\beta^{2}')}. Compare this with ${m('(\\alpha + \\beta)^{2} = \\alpha^{2} + 2\\alpha\\beta + \\beta^{2}')}.`,
            `Only the middle term differs. To go from ${m('+2\\alpha\\beta')} to ${m('-2\\alpha\\beta')}, take away ${m('4\\alpha\\beta')}. So ${m('(\\alpha - \\beta)^{2} = (\\alpha + \\beta)^{2} - 4\\alpha\\beta')}.`,
            `Substitute the sum and the product: ${m(`(\\alpha - \\beta)^{2} = ${sqS} - 4 \\times ${paren(P)} = ${S2.tex()}${signed(P.mul(-4))} = ${ans.tex()}`)}.`,
          ];
          pool = [
            { f: S2.sub(P.mul(2)), why: `This uses ${m('2\\alpha\\beta')}, which is the identity for ${m('\\alpha^{2} + \\beta^{2}')}. For ${m('(\\alpha - \\beta)^{2}')} you subtract ${m('4\\alpha\\beta')}.` },
            { f: S2.add(P.mul(4)), why: `This adds ${m('4\\alpha\\beta')} instead of subtracting it: ${m('(\\alpha - \\beta)^{2} = (\\alpha + \\beta)^{2} - 4\\alpha\\beta')}.` },
            { f: S2, why: `This assumes ${m('(\\alpha - \\beta)^{2} = (\\alpha + \\beta)^{2}')}, but the cross terms differ: ${m('-2\\alpha\\beta')} versus ${m('+2\\alpha\\beta')}.` },
          ];
          if (a > 1) pool.push({ f: new Frac(b * b - 4 * a * c), why: `This is the discriminant ${m('b^{2} - 4ac')} itself. It equals ${m('(\\alpha - \\beta)^{2}')} only when ${m('a = 1')}; here you must divide by ${m(`a^{2} = ${a * a}`)}.` });
        }
        const distractors: { text: string; value: number; why: string }[] = [];
        const seen: Frac[] = [ans];
        // shuffle so every listed mistake (including "forgot to divide by a") can appear
        for (const d of rng.shuffle(pool)) {
          if (distractors.length === 3) break;
          if (seen.some((s) => s.equals(d.f))) continue;
          seen.push(d.f);
          distractors.push({ text: m(d.f.tex()), value: d.f.value(), why: d.why });
        }
        if (distractors.length < 3) continue; // re-roll the numbers
        const answer = m(ans.tex());
        const sumWork =
          a === 1
            ? b < 0
              ? `-\\left(${b}\\right) = ${S.tex()}`
              : S.tex()
            : `-\\left(${b}\\right) \\div ${a} = ${S.tex()}`;
        const productWork = a === 1 ? P.tex() : `${c} \\div ${a} = ${P.tex()}`;
        const solution = steps(
          `${m('\\alpha')} and ${m('\\beta')} (alpha and beta) stand for the two roots, the solutions of the equation. We never need to find them. For ${m('ax^{2} + bx + c = 0')}, their sum is ${m('\\alpha + \\beta = -\\frac{b}{a}')} and their product is ${m('\\alpha\\beta = \\frac{c}{a}')}.`,
          `Here ${m(`a = ${a}`)}, ${m(`b = ${b}`)} and ${m(`c = ${c}`)}. So the sum is ${m(`\\alpha + \\beta = ${sumWork}`)} and the product is ${m(`\\alpha\\beta = ${productWork}`)}.`,
          ...identity,
        );
        const rule =
          kind === 'sq'
            ? ' For squares, use $\\alpha^{2} + \\beta^{2} = (\\alpha + \\beta)^{2} - 2\\alpha\\beta$.'
            : kind === 'recip'
              ? ' For fractions, add them over the bottom $\\alpha\\beta$.'
              : ' For the squared difference, use $(\\alpha - \\beta)^{2} = (\\alpha + \\beta)^{2} - 4\\alpha\\beta$.';
        return {
          stem: `The roots of ${m(`${poly([a, b, c])} = 0`)} are ${m('\\alpha')} and ${m('\\beta')}. Without solving the equation, find the value of ${m(target)}.`,
          answer,
          answerValue: ans.value(),
          distractors,
          asking: `What is the value of ${m(target)}, worked out without finding the roots?`,
          solution,
          conclusion: `Using the sum ${m(S.tex())} and the product ${m(P.tex())}, the expression works out to the answer, ${answer}.`,
          keyIdea: `When a question says "without solving", find the sum and product of the roots from ${m('-\\frac{b}{a}')} and ${m('\\frac{c}{a}')}, then rewrite the target using them.${rule}`,
        };
      }
    },
  },
];
