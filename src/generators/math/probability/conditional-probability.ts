import type { Generator } from '../../../types';
import { Frac } from '../../../lib/frac';
import { m } from '../../../lib/tex';

type Cand = { f: Frac; why: string };

/** Keep up to 3 candidates that differ from the answer and from each other (by value and by rendered text) and lie strictly between 0 and 1. */
function pickDistinct(answer: Frac, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const d of pool) {
    if (out.length === 3) break;
    if (d.f.equals(answer) || d.f.tex() === answer.tex()) continue;
    if (d.f.value() >= 1 || d.f.value() <= 0) continue; // a probability option must lie strictly between 0 and 1
    if (out.some((x) => x.f.equals(d.f) || x.f.tex() === d.f.tex())) continue;
    out.push(d);
  }
  return out;
}

/** "\frac{a}{b}" unreduced, followed by "= reduced" when it simplifies. */
function fracSteps(n: number, d: number): string {
  const r = new Frac(n, d);
  return r.n === n && r.d === d ? `\\frac{${n}}{${d}}` : `\\frac{${n}}{${d}} = ${r.tex()}`;
}

// ---------------------------------------------------------------- Bayes (positive test) contexts
interface BayesCtx {
  intro: (prev: number, sens: number, fpr: number) => string;
  question: string;
  items: string; // "people"
  has: string; // "have the disease"
  hasNot: string; // "do not have the disease"
  flagged: string; // "test positive"
  flaggedNoun: string; // "positives"
  ev: string; // short label for the evidence inside \text{...}
  cond: string; // short label for the condition inside \text{...}
}

const BAYES_CTX: BayesCtx[] = [
  {
    intro: (p, s, f) =>
      `A disease affects ${p}% of a population. A screening test is positive for ${s}% of people who have the disease, and it is also (wrongly) positive for ${f}% of people who do not have it.`,
    question: 'A randomly chosen person tests positive. What is the probability that they actually have the disease?',
    items: 'people',
    has: 'have the disease',
    hasNot: 'do not have the disease',
    flagged: 'test positive',
    flaggedNoun: 'positive results',
    ev: 'positive',
    cond: 'disease',
  },
  {
    intro: (p, s, f) =>
      `${p}% of the emails arriving at a company are spam. A spam filter flags ${s}% of spam emails, and it also wrongly flags ${f}% of genuine emails.`,
    question: 'An email is flagged by the filter. What is the probability that it really is spam?',
    items: 'emails',
    has: 'are spam',
    hasNot: 'are genuine',
    flagged: 'are flagged',
    flaggedNoun: 'flagged emails',
    ev: 'flagged',
    cond: 'spam',
  },
  {
    intro: (p, s, f) =>
      `${p}% of the card payments at an online shop are fraudulent. A fraud-detection model raises an alert for ${s}% of fraudulent payments, and it also raises an alert for ${f}% of genuine payments.`,
    question: 'A payment triggers an alert. What is the probability that it is fraudulent?',
    items: 'payments',
    has: 'are fraudulent',
    hasNot: 'are genuine',
    flagged: 'trigger an alert',
    flaggedNoun: 'alerts',
    ev: 'alert',
    cond: 'fraud',
  },
];

// ---------------------------------------------------------------- two-way table contexts
interface TableCtx {
  intro: (n: number) => string;
  item: string; // "student"
  pronoun: string; // "the student" / "it"
  rowHeader: string;
  rows: [string, string];
  cols: [string, string];
  /** [singular, plural] phrases for each row / column category. */
  rowPh: [[string, string], [string, string]];
  colPh: [[string, string], [string, string]];
  plural: string;
}

const TABLE_CTX: TableCtx[] = [
  {
    intro: (n) => `The table shows how ${n} students travel to school.`,
    item: 'student',
    pronoun: 'the student',
    rowHeader: 'Year group',
    rows: ['Year 12', 'Year 13'],
    cols: ['Walks', 'Takes the bus'],
    rowPh: [
      ['is in Year 12', 'are in Year 12'],
      ['is in Year 13', 'are in Year 13'],
    ],
    colPh: [
      ['walks to school', 'walk to school'],
      ['takes the bus', 'take the bus'],
    ],
    plural: 'students',
  },
  {
    intro: (n) => `The table shows the hot-drink preference of ${n} adults.`,
    item: 'adult',
    pronoun: 'the adult',
    rowHeader: 'Age',
    rows: ['Under 30', '30 and over'],
    cols: ['Prefers tea', 'Prefers coffee'],
    rowPh: [
      ['is under 30', 'are under 30'],
      ['is 30 or over', 'are 30 or over'],
    ],
    colPh: [
      ['prefers tea', 'prefer tea'],
      ['prefers coffee', 'prefer coffee'],
    ],
    plural: 'adults',
  },
  {
    intro: (n) => `The table shows how a spam filter handled ${n} emails.`,
    item: 'email',
    pronoun: 'it',
    rowHeader: 'Email type',
    rows: ['Spam', 'Not spam'],
    cols: ['Flagged', 'Not flagged'],
    rowPh: [
      ['is spam', 'are spam'],
      ['is not spam', 'are not spam'],
    ],
    colPh: [
      ['was flagged by the filter', 'were flagged by the filter'],
      ['was not flagged by the filter', 'were not flagged by the filter'],
    ],
    plural: 'emails',
  },
];

export const generators: Generator[] = [
  {
    id: 'gen-prob-cond-two-draws',
    subtopic: 'conditional-probability',
    difficulty: 'exam',
    title: 'Two draws without replacement: both a given colour',
    generate(rng) {
      const r = rng.int(3, 9);
      const b = rng.int(2, 8);
      const n = r + b;
      const colour = rng.pick(['red', 'blue'] as const);
      const k = colour === 'red' ? r : b;
      const answer = new Frac(k, n).mul(new Frac(k - 1, n - 1));
      const withRep = new Frac(k * k, n * n);
      const firstOnly = new Frac(k, n);
      const forgotN = new Frac(k - 1, n).mul(new Frac(k, n));
      // distractors must differ from the answer and from each other; fall back to other genuine slips
      const pool = [
        { f: withRep, why: `This treats the draws as **with** replacement: ${m(`\\frac{${k}}{${n}} \\times \\frac{${k}}{${n}}`)}. After the first ${colour} ball is taken there are only ${k - 1} ${colour} balls and ${n - 1} balls in total.` },
        { f: firstOnly, why: `This is only the probability that the **first** ball is ${colour}; the question needs both draws.` },
        { f: forgotN, why: `This reduces the number of ${colour} balls for the second draw but forgets the total also drops from ${n} to ${n - 1}.` },
        { f: new Frac(k, n).add(new Frac(k - 1, n - 1)).div(2), why: `This averages the two probabilities instead of multiplying them; "and" means multiply along the branch.` },
        { f: new Frac(k + k - 1, n + n - 1), why: `This adds the numerators and denominators, which is not a valid way to combine probabilities.` },
      ];
      const distractors: Cand[] = [];
      for (const d of pool) {
        if (distractors.length === 3) break;
        if (d.f.equals(answer) || distractors.some((x) => x.f.equals(d.f))) continue;
        distractors.push(d);
      }
      return {
        stem: `A bag contains ${r} red balls and ${b} blue balls. Two balls are drawn at random **without replacement**. What is the probability that **both** are ${colour}?`,
        answer: m(answer.tex()),
        answerValue: answer.value(),
        distractors: distractors.map((d) => ({ text: m(d.f.tex()), value: d.f.value(), why: d.why })),
        solution:
          `There are ${n} balls, ${k} of them ${colour}.\n\n` +
          `- First ball ${colour}: ${m(`\\frac{${k}}{${n}}`)}\n` +
          `- Second ball ${colour}, given the first was: ${m(`\\frac{${k - 1}}{${n - 1}}`)} (one ${colour} ball and one ball in total are gone)\n\n` +
          `Multiply along the branch: ${m(`\\frac{${k}}{${n}} \\times \\frac{${k - 1}}{${n - 1}} = ${fracSteps(k * (k - 1), n * (n - 1))}`)}` +
          `.\n\nAnswer: ${m(answer.tex())}`,
        keyIdea: 'Without replacement, both the number of favourable balls and the total drop by one after each draw; multiply along the branch.',
      };
    },
  },

  // ---------------------------------------------------------------- Bayes: positive test result
  {
    id: 'gen-conditional-probability-bayes-test',
    subtopic: 'conditional-probability',
    difficulty: 'exam',
    title: "Bayes' theorem: what does a positive result really mean?",
    generate(rng) {
      const ctx = rng.pick(BAYES_CTX);
      const N = 10000;
      const prev = rng.pick([1, 2, 4, 5, 10]); // % with the condition
      const sens = rng.pick([80, 90, 95]); // % of those with it that are flagged
      const fpr = rng.pick([2, 5, 10, 20]); // % of those without it that are flagged
      const D = (N * prev) / 100;
      const H = N - D;
      const TP = (D * sens) / 100;
      const FP = (H * fpr) / 100;
      const allPos = TP + FP;
      const answer = new Frac(TP, allPos);

      const pool: Cand[] = [
        {
          f: new Frac(sens, 100),
          why: `This is the ${sens}% from the question, ${m(`P(\\text{${ctx.ev}} \\mid \\text{${ctx.cond}})`)}. The question asks the reverse, ${m(`P(\\text{${ctx.cond}} \\mid \\text{${ctx.ev}})`)}, which must also take into account the ${FP} false positives among the ${allPos} ${ctx.flaggedNoun}.`,
        },
        {
          f: new Frac(TP, N),
          why: `This is ${m(`\\frac{${TP}}{${N}}`)}, the probability of ${ctx.cond} **and** ${ctx.ev} together. It divides by all ${N} ${ctx.items} instead of only the ${allPos} ${ctx.flaggedNoun}.`,
        },
        ...(TP < FP
          ? [
              {
                f: new Frac(TP, FP),
                why: `This is ${m(`\\frac{${TP}}{${FP}}`)}: the true positives divided by the false positives. You must divide by **all** ${ctx.flaggedNoun}, ${m(`${TP} + ${FP} = ${allPos}`)}.`,
              },
            ]
          : []),
        {
          f: new Frac(prev, 100),
          why: `This is the ${prev}% base rate, the probability before the evidence is seen. It ignores the result of the ${ctx.ev === 'positive' ? 'test' : 'check'}.`,
        },
        {
          f: new Frac(FP, allPos),
          why: `This is ${m(`\\frac{${FP}}{${allPos}}`)}, the fraction of ${ctx.flaggedNoun} that are **false** alarms: the right total but the wrong group on top.`,
        },
        {
          f: new Frac(100 - fpr, 100),
          why: `This is ${m(`1 - ${fpr / 100}`)}, the probability that one of the ${ctx.items} that ${ctx.hasNot} is correctly **not** flagged. It answers a different question.`,
        },
      ];
      const distractors = pickDistinct(answer, pool);

      return {
        stem: `${ctx.intro(prev, sens, fpr)} ${ctx.question}`,
        answer: m(answer.tex()),
        answerValue: answer.value(),
        distractors: distractors.map((d) => ({ text: m(d.f.tex()), value: d.f.value(), why: d.why })),
        solution:
          `Imagine ${N} ${ctx.items} (natural frequencies).\n\n` +
          `- ${prev}% of ${N} ${ctx.has}: ${m(`${N} \\times ${prev / 100} = ${D}`)}. Of these, ${sens}% ${ctx.flagged}: ${m(`${D} \\times ${sens / 100} = ${TP}`)} (true positives).\n` +
          `- The other ${m(`${N} - ${D} = ${H}`)} ${ctx.hasNot}. Of these, ${fpr}% ${ctx.flagged}: ${m(`${H} \\times ${fpr / 100} = ${FP}`)} (false positives).\n\n` +
          `Total ${ctx.flaggedNoun}: ${m(`${TP} + ${FP} = ${allPos}`)}. Of these, ${TP} really ${ctx.has}, so\n\n` +
          `$$P(\\text{${ctx.cond}} \\mid \\text{${ctx.ev}}) = ${fracSteps(TP, allPos)}$$\n\n` +
          `Answer: ${m(answer.tex())}`,
        keyIdea: 'Bayes: divide the true positives by ALL positives; when the condition is rare, even a good test gives many false positives.',
      };
    },
  },

  // ---------------------------------------------------------------- two-way table conditional
  {
    id: 'gen-conditional-probability-two-way-table',
    subtopic: 'conditional-probability',
    difficulty: 'foundation',
    title: 'Conditional probability from a two-way table',
    generate(rng) {
      const ctx = rng.pick(TABLE_CTX);
      for (;;) {
        const a = rng.int(4, 40);
        const b = rng.int(4, 40);
        const c = rng.int(4, 40);
        const d = rng.int(4, 40);
        const cells = [
          [a, b],
          [c, d],
        ];
        const rowT = [a + b, c + d];
        const colT = [a + c, b + d];
        const N = a + b + c + d;
        const i = rng.int(0, 1); // row category
        const j = rng.int(0, 1); // column category
        const givenCol = rng.bool(); // true: given column j, find P(row i); false: given row i, find P(column j)
        const cell = cells[i][j];
        const condTotal = givenCol ? colT[j] : rowT[i];
        const otherTotal = givenCol ? rowT[i] : colT[j];
        const otherCondTotal = givenCol ? colT[1 - j] : rowT[1 - i];
        const condPh = givenCol ? ctx.colPh[j] : ctx.rowPh[i];
        const targetPh = givenCol ? ctx.rowPh[i] : ctx.colPh[j];
        const condLabel = givenCol ? ctx.cols[j] : ctx.rows[i];
        const targetLabel = givenCol ? ctx.rows[i] : ctx.cols[j];
        const answer = new Frac(cell, condTotal);

        const pool: Cand[] = [
          {
            f: new Frac(cell, otherTotal),
            why: `This is ${m(`\\frac{${cell}}{${otherTotal}}`)}: it divides by the "${targetLabel}" total, which gives the reverse conditional probability (the ${ctx.plural} that ${condPh[1]} out of those that ${targetPh[1]}).`,
          },
          {
            f: new Frac(cell, N),
            why: `This is ${m(`\\frac{${cell}}{${N}}`)}: it divides by all ${N} ${ctx.plural}, giving the probability of both together. "Given that" means you only divide by the ${condTotal} that ${condPh[1]}.`,
          },
          {
            f: new Frac(otherTotal, N),
            why: `This is ${m(`\\frac{${otherTotal}}{${N}}`)}, the probability for **any** ${ctx.item}; it ignores the information that ${ctx.pronoun} ${condPh[0]}.`,
          },
          {
            f: new Frac(cell, otherCondTotal),
            why: `This is ${m(`\\frac{${cell}}{${otherCondTotal}}`)}: it divides by the total of the wrong group (the other ${givenCol ? 'column' : 'row'}), not the ${condTotal} that ${condPh[1]}.`,
          },
        ];
        const distractors = pickDistinct(answer, pool);
        if (distractors.length < 3) continue; // re-roll the counts

        return {
          stem: `${ctx.intro(N)} ${/^[aeiou]/.test(ctx.item) ? 'An' : 'A'} ${ctx.item} is chosen at random. Given that ${ctx.pronoun === 'it' ? `the ${ctx.item}` : ctx.pronoun} ${condPh[0]}, what is the probability that ${ctx.pronoun} ${targetPh[0]}?`,
          table: {
            headers: [ctx.rowHeader, ctx.cols[0], ctx.cols[1], 'Total'],
            rows: [
              [ctx.rows[0], a, b, rowT[0]],
              [ctx.rows[1], c, d, rowT[1]],
              ['Total', colT[0], colT[1], N],
            ],
          },
          answer: m(answer.tex()),
          answerValue: answer.value(),
          distractors: distractors.map((x) => ({ text: m(x.f.tex()), value: x.f.value(), why: x.why })),
          solution:
            `"Given that ${ctx.pronoun === 'it' ? `the ${ctx.item}` : ctx.pronoun} ${condPh[0]}" means we only look at the "${condLabel}" ${givenCol ? 'column' : 'row'}: ${condTotal} ${ctx.plural}.\n\n` +
            `Of these ${condTotal}, the number that ${targetPh[1]} ("${targetLabel}") is ${cell}.\n\n` +
            `$$P = \\frac{\\text{(${condLabel}) and (${targetLabel})}}{\\text{${condLabel} total}} = ${fracSteps(cell, condTotal)}$$\n\n` +
            `Answer: ${m(answer.tex())}`,
          keyIdea: 'In a two-way table, the condition tells you which row or column total to divide by.',
        };
      }
    },
  },
];
