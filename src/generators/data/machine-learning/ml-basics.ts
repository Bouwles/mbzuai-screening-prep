import type { Generator } from '../../../types';
import { Frac } from '../../../lib/frac';
import { m } from '../../../lib/tex';

// ---------------------------------------------------------------- task-type identification
type TaskType = 'reg' | 'cls' | 'clu' | 'rl';

interface Task {
  type: TaskType;
  /** Completes "a system to ..." */
  desc: string;
  /** What the system outputs, for the explanations. */
  out: string;
}

const TYPE_NAME: Record<TaskType, string> = {
  reg: 'Regression (supervised learning)',
  cls: 'Classification (supervised learning)',
  clu: 'Clustering (unsupervised learning)',
  rl: 'Reinforcement learning',
};

const TASKS: Task[] = [
  // regression
  { type: 'reg', desc: 'predict the selling price in AED of a used car from its age, mileage and engine size, using records of past sales', out: 'a price in AED' },
  { type: 'reg', desc: 'predict tomorrow\'s electricity demand (in megawatts) for a city, using several years of recorded daily demand and weather', out: 'an amount of electricity in megawatts' },
  { type: 'reg', desc: 'estimate how many minutes a taxi journey will take, using thousands of past journeys with their actual times', out: 'a time in minutes' },
  { type: 'reg', desc: 'predict a student\'s final exam mark out of 100 from their coursework marks, using last year\'s students and their real final marks', out: 'a mark out of 100' },
  { type: 'reg', desc: 'predict the amount of rainfall (in millimetres) tomorrow from today\'s weather readings, using historical weather records', out: 'an amount of rain in millimetres' },
  { type: 'reg', desc: 'estimate a person\'s age in years from a photo, after training on photos of people whose ages are known', out: 'an age in years' },
  { type: 'reg', desc: 'predict how many kilowatt-hours a solar panel will generate tomorrow from the weather forecast, using past daily output records', out: 'an amount of energy in kilowatt-hours' },
  { type: 'reg', desc: 'predict the monthly rent in AED of an apartment from its size and location, using a list of apartments with their actual rents', out: 'a rent in AED' },
  // classification
  { type: 'cls', desc: 'decide whether an email is spam or not spam, using emails that people have already marked', out: 'one of two categories (spam or not spam)' },
  { type: 'cls', desc: 'recognise which digit from 0 to 9 has been handwritten, after training on images labelled with the correct digit', out: 'one of ten categories (the digits 0 to 9)' },
  { type: 'cls', desc: 'decide whether a card payment is fraudulent or genuine, using past payments that were checked and labelled', out: 'one of two categories (fraudulent or genuine)' },
  { type: 'cls', desc: 'identify whether a photo shows a cat, a dog or a rabbit, after training on photos tagged with the correct animal', out: 'one of three categories (cat, dog or rabbit)' },
  { type: 'cls', desc: 'predict whether a customer will cancel their subscription next month (yes or no), using past customers whose outcome is known', out: 'one of two categories (yes or no)' },
  { type: 'cls', desc: 'decide whether a skin scan shows a harmful or a harmless mole, after training on scans labelled by doctors', out: 'one of two categories (harmful or harmless)' },
  { type: 'cls', desc: 'detect whether a short text is written in Arabic, English, French or Hindi, after training on texts labelled with their language', out: 'one of four categories (the languages)' },
  { type: 'cls', desc: 'decide whether a product review is positive or negative, after training on reviews already labelled positive or negative', out: 'one of two categories (positive or negative)' },
  // clustering
  { type: 'clu', desc: 'divide a supermarket\'s customers into groups with similar shopping habits, with no groups decided in advance', out: 'groups discovered from the data' },
  { type: 'clu', desc: 'organise 50,000 news articles into topics, when no topics or labels are given', out: 'groups of articles discovered from the data' },
  { type: 'clu', desc: 'group songs with similar sound features to build playlists, without using any genre labels', out: 'groups of songs discovered from the data' },
  { type: 'clu', desc: 'split the pixels of a satellite image into regions of similar colour, with no labels saying what each region is', out: 'regions discovered from the data' },
  { type: 'clu', desc: 'group website visitors by the way they browse the site, with no categories chosen beforehand', out: 'groups of visitors discovered from the data' },
  { type: 'clu', desc: 'find groups of similar genes from laboratory measurements, without knowing any gene types in advance', out: 'groups of genes discovered from the data' },
  { type: 'clu', desc: 'group the photos in a phone gallery by the faces that appear in them, without being told who anyone is', out: 'groups of photos discovered from the data' },
  // reinforcement learning
  { type: 'rl', desc: 'learn to play chess by playing millions of games against itself, getting a reward for winning and a penalty for losing', out: 'a choice of move' },
  { type: 'rl', desc: 'teach a robot to walk by letting it try movements and rewarding it for moving forward without falling', out: 'a choice of movement' },
  { type: 'rl', desc: 'control the traffic lights at a junction by trying different timings and being rewarded when cars wait less', out: 'a choice of light timing' },
  { type: 'rl', desc: 'drive a car around a simulated track, earning points for staying on the road and losing points for crashing', out: 'a choice of steering and speed' },
  { type: 'rl', desc: 'manage a building\'s air-conditioning by trying settings and being rewarded for comfort at a low energy cost', out: 'a choice of setting' },
  { type: 'rl', desc: 'land a drone by trial and error, being rewarded for gentle landings and penalised for crashes', out: 'a choice of control action' },
  { type: 'rl', desc: 'play a video game, receiving the change in the game score as a reward after each move', out: 'a choice of move' },
];

function whyNot(wrong: TaskType, t: Task): string {
  const labelled = t.type === 'reg' || t.type === 'cls';
  switch (wrong) {
    case 'reg':
      return t.type === 'cls'
        ? `Regression predicts a number on a continuous scale, but here the output is ${t.out}. Choosing from a fixed set of categories is classification.`
        : t.type === 'clu'
          ? 'Regression is supervised: it needs past examples with the correct number attached. Here there are no labels at all; the groups are discovered from the data, which is clustering.'
          : 'Regression learns from a fixed dataset of labelled examples. Here there are no labelled correct answers; an agent tries actions and learns from rewards and penalties, which is reinforcement learning.';
    case 'cls':
      return t.type === 'reg'
        ? `Classification picks one of a fixed set of categories, but here the output is ${t.out}, a number that can take any value in a range. Predicting a continuous number is regression.`
        : t.type === 'clu'
          ? 'Classification needs labelled examples with the categories fixed in advance. Here there are no labels and the groups are discovered from the data, which is clustering.'
          : 'Classification learns from a dataset of labelled examples. Here nobody supplies correct answers; an agent learns by trial and error from rewards, which is reinforcement learning.';
    case 'clu':
      return labelled
        ? `Clustering is for data **without labels**. Here every past example comes with its correct output, which is ${t.out}, so this is supervised learning.`
        : 'Clustering groups a fixed set of unlabelled data points and gets no feedback. Here an agent takes actions and learns from rewards and penalties, which is reinforcement learning.';
    case 'rl':
    default:
      return labelled
        ? 'Reinforcement learning means an agent learning by trial and error from rewards. Here the model learns from a fixed dataset of labelled examples, so it is supervised learning.'
        : 'Reinforcement learning means an agent taking actions and learning from rewards. Here there are no actions or rewards; the model simply looks for groups in unlabelled data.';
  }
}

function taskSolution(t: Task): string {
  // Numbered steps are joined with single newlines so they render as ONE list (1, 2, 3);
  // a blank line between items would start a new list and every item would show "1.".
  const steps: string[] = [];
  let conclusion: string;
  if (t.type === 'rl') {
    steps.push(
      '1. **Is there an agent taking actions and receiving rewards or penalties?** Yes: the system tries actions and is rewarded or penalised for the results. Nobody gives it labelled correct answers.',
    );
    conclusion = 'That is enough: learning by trial and error from rewards is **reinforcement learning**.';
  } else {
    steps.push('1. **Is there an agent taking actions and receiving rewards?** No: the system learns from a dataset, not from rewards for actions.');
    if (t.type === 'clu') {
      steps.push(
        '2. **Does the data come with labels (correct answers)?** No: there are no labels and no groups chosen in advance. The system must find groups of similar items itself.',
      );
      conclusion = 'Finding groups in unlabelled data is **clustering**, a type of **unsupervised** learning.';
    } else {
      steps.push('2. **Does the data come with labels (correct answers)?** Yes: the past examples include the correct output, so this is **supervised** learning.');
      steps.push(
        t.type === 'reg'
          ? `3. **Is the output a category or a continuous number?** The output is ${t.out}, a number on a continuous scale.`
          : `3. **Is the output a category or a continuous number?** The output is ${t.out}.`,
      );
      conclusion =
        t.type === 'reg'
          ? 'Supervised learning that predicts a continuous number is **regression**.'
          : 'Supervised learning that predicts a category from a fixed set is **classification**.';
    }
  }
  return `Ask these questions in order, stopping as soon as you have the answer.\n\n${steps.join('\n')}\n\n${conclusion}\n\nAnswer: ${TYPE_NAME[t.type]}`;
}

// ---------------------------------------------------------------- approval-rate gap (fairness)
interface GapCtx {
  intro: string;
  decided: string; // column header, e.g. "Approved by the model"
  verbed: string; // "approved"
  rateWord: string; // "approval rate"
  groups: [string, string][];
}

const GAP_CTX: GapCtx[] = [
  {
    intro: 'A bank tests a loan-approval model on applicants from two groups.',
    decided: 'Approved by the model',
    verbed: 'approved',
    rateWord: 'approval rate',
    groups: [
      ['Group A', 'Group B'],
      ['Urban applicants', 'Rural applicants'],
      ['Under 40', '40 and over'],
    ],
  },
  {
    intro: 'A company uses a model to shortlist job applicants for interview. It checks the results for two groups of applicants.',
    decided: 'Shortlisted by the model',
    verbed: 'shortlisted',
    rateWord: 'shortlisting rate',
    groups: [
      ['Women', 'Men'],
      ['Group A', 'Group B'],
      ['Local applicants', 'International applicants'],
    ],
  },
  {
    intro: 'A scholarship fund uses a model to decide which applications to accept. It checks the results for two groups of students.',
    decided: 'Accepted by the model',
    verbed: 'accepted',
    rateWord: 'acceptance rate',
    groups: [
      ['State-school students', 'Private-school students'],
      ['Group A', 'Group B'],
      ['First-generation students', 'Other students'],
    ],
  },
];

const GROUP_SIZES = [80, 100, 120, 150, 160, 200, 240, 250, 300, 400];
const RATES = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85];

type NumCand = { v: number; why: string };

/** Keep up to 3 candidates that are whole numbers, differ from the answer and from each other. */
function pickNum(answer: number, pool: NumCand[], max = Infinity): NumCand[] {
  const out: NumCand[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (!Number.isInteger(c.v) || c.v < 0 || c.v > max) continue;
    if (c.v === answer || out.some((o) => o.v === c.v)) continue;
    out.push(c);
  }
  return out;
}

const pp = (v: number) => `${m(String(v))} percentage points`;

// ---------------------------------------------------------------- image features
const SIDES = [8, 10, 12, 16, 20, 24, 28, 32, 48, 64];

export const generators: Generator[] = [
  {
    id: 'gen-ml-basics-task-type',
    subtopic: 'ml-basics',
    difficulty: 'foundation',
    title: 'Identify the type of machine learning task',
    generate(rng) {
      const t = rng.pick(TASKS);
      const frame = rng.int(0, 1);
      const stem =
        frame === 0
          ? `A team wants to build a system to ${t.desc}. Which description of this machine learning task is correct?`
          : `An AI system is being designed to ${t.desc}. What type of machine learning problem is this?`;
      const others = (['reg', 'cls', 'clu', 'rl'] as TaskType[]).filter((x) => x !== t.type);
      return {
        stem,
        answer: TYPE_NAME[t.type],
        answerValue: t.type,
        distractors: others.map((o) => ({ text: TYPE_NAME[o], value: o, why: whyNot(o, t) })),
        solution: taskSolution(t),
        keyIdea: 'Actions and rewards: reinforcement learning. No labels: clustering. Labels with a category output: classification. Labels with a number output: regression.',
      };
    },
  },

  {
    id: 'gen-ml-basics-approval-gap',
    subtopic: 'ml-basics',
    difficulty: 'exam',
    title: 'Fairness check: compare approval rates of two groups',
    generate(rng) {
      const ctx = rng.pick(GAP_CTX);
      const [gA, gB] = rng.pick(ctx.groups);
      for (;;) {
        const nA = rng.pick(GROUP_SIZES);
        const nB = rng.pick(GROUP_SIZES);
        const rA = rng.pick(RATES);
        const rB = rng.pick(RATES);
        if (nA === nB || Math.abs(rA - rB) < 10) continue;
        if ((nA * rA) % 100 !== 0 || (nB * rB) % 100 !== 0) continue;
        const aA = (nA * rA) / 100;
        const aB = (nB * rB) / 100;
        const gap = Math.abs(rA - rB);
        const hi = rA > rB ? gA : gB;
        const lo = rA > rB ? gB : gA;
        const total = nA + nB;
        const shareA = new Frac(aA * 100, total);
        const shareB = new Frac(aB * 100, total);
        const totalDiff = shareA.sub(shareB);
        const ratio = new Frac(Math.min(rA, rB) * 100, Math.max(rA, rB));
        const rejA = nA - aA;
        const rejB = nB - aB;

        const pool: NumCand[] = [
          {
            v: Math.abs(aA - aB),
            why: `This is ${m(`${Math.max(aA, aB)} - ${Math.min(aA, aB)} = ${Math.abs(aA - aB)}`)}, the difference in the **number** ${ctx.verbed}. The groups have different sizes (${nA} and ${nB}), so you must compare rates.`,
          },
          {
            v: totalDiff.isInt() ? Math.abs(totalDiff.value()) : NaN,
            why: `This divides both groups' counts by all ${total} applicants: ${m(`\\frac{${Math.max(aA, aB)} - ${Math.min(aA, aB)}}{${total}} \\times 100 = ${totalDiff.isInt() ? Math.abs(totalDiff.value()) : 0}`)}. Each group's rate must use **its own** number of applicants.`,
          },
          {
            v: ratio.isInt() ? ratio.value() : NaN,
            why: `This is ${m(`\\frac{${Math.min(rA, rB)}\\%}{${Math.max(rA, rB)}\\%} \\times 100 = ${ratio.isInt() ? ratio.value() : 0}`)}, the **ratio** of the two rates, not the difference between them in percentage points.`,
          },
          {
            v: Math.abs(rejA - rejB),
            why: `This is ${m(`${Math.max(rejA, rejB)} - ${Math.min(rejA, rejB)} = ${Math.abs(rejA - rejB)}`)}, the difference in the **number of applicants not ${ctx.verbed}**. Counts cannot be compared fairly when the groups are different sizes.`,
          },
          {
            v: Math.max(rA, rB),
            why: `This is only the higher group's ${ctx.rateWord} (${m(`${Math.max(rA, rB)}\\%`)}). The question asks for the **gap**, so you still need to subtract the other group's rate (${m(`${Math.min(rA, rB)}\\%`)}).`,
          },
          {
            v: rA + rB,
            why: `This **adds** the two rates (${m(`${rA}\\% + ${rB}\\%`)}) instead of subtracting one from the other.`,
          },
        ];
        const ds = pickNum(gap, pool, 100);
        if (ds.length < 3) continue;

        const fracLine = (a: number, n: number, r: number) => m(`\\frac{${a}}{${n}} = ${r / 100} = ${r}\\%`);
        return {
          stem: `${ctx.intro} The results are shown in the table. A fairness check compares the **${ctx.rateWord}s** of the two groups. By how many percentage points do the two groups' ${ctx.rateWord}s differ?`,
          table: {
            headers: ['Group', 'Applicants', ctx.decided],
            rows: [
              [gA, nA, aA],
              [gB, nB, aB],
            ],
          },
          answer: pp(gap),
          answerValue: gap,
          distractors: ds.map((d) => ({ text: pp(d.v), value: d.v, why: d.why })),
          solution:
            `The groups are different sizes, so compare **rates** (the number ${ctx.verbed} divided by that group's own number of applicants), not counts.\n\n` +
            `- ${gA}: ${fracLine(aA, nA, rA)}\n` +
            `- ${gB}: ${fracLine(aB, nB, rB)}\n\n` +
            `Difference: ${m(`${Math.max(rA, rB)}\\% - ${Math.min(rA, rB)}\\% = ${gap}`)} percentage points: the ${ctx.rateWord} for ${hi} is higher than for ${lo}.\n\n` +
            `A large gap like this is a warning sign that the model may be treating the groups unfairly (comparing rates like this is called checking **demographic parity**).\n\n` +
            `Answer: ${pp(gap)}`,
          keyIdea: 'To compare groups of different sizes fairly, turn each count into a rate using that group\'s own total, then subtract the rates.',
        };
      }
    },
  },

  {
    id: 'gen-ml-basics-image-features',
    subtopic: 'ml-basics',
    difficulty: 'foundation',
    title: 'Count the input features of an image',
    generate(rng) {
      const W = rng.pick(SIDES);
      const H = rng.pick(SIDES);
      const colour = rng.bool();
      const c = colour ? 3 : 1;
      const pixels = W * H;
      const answer = pixels * c;
      const kind = colour
        ? '**colour** images, where every pixel is stored as three values (red, green and blue)'
        : '**grayscale** images, where every pixel is stored as one brightness value';
      const object = rng.pick(['a road sign', 'an animal', 'a piece of fruit', 'a handwritten letter', 'a type of leaf', 'a clothing item']);

      const pool: NumCand[] = [
        {
          v: answer + 1,
          why: 'This adds 1 for the label. The label (what the image shows) is the answer the model predicts, not an input feature.',
        },
        colour
          ? { v: pixels, why: `This is ${m(`${W} \\times ${H} = ${pixels}`)}, the number of pixels. Each colour pixel gives **three** values, so multiply by 3.` }
          : { v: pixels * 3, why: `This is ${m(`${W} \\times ${H} \\times 3`)}, treating the images as colour. A grayscale pixel has only **one** value.` },
        {
          v: (W + H) * c,
          why: colour
            ? `This is ${m(`(${W} + ${H}) \\times 3`)}: the width and height were **added**. A grid of pixels has width times height pixels.`
            : `This is ${m(`${W} + ${H}`)}: the width and height were **added**. A grid of pixels has width times height pixels.`,
        },
        { v: W + H, why: `This is ${m(`${W} + ${H}`)}: it adds the side lengths and ignores the values per pixel. Multiply width by height, then by the values per pixel.` },
        {
          v: W * c,
          why: colour
            ? `This is ${m(`${W} \\times 3 = ${W * 3}`)}, which only counts one row of the image (${W} pixels wide). The image has ${H} rows.`
            : `This only counts one row of the image (${W} pixels wide). The image has ${H} rows.`,
        },
      ];
      const ds = pickNum(answer, pool);
      while (ds.length < 3) ds.push({ v: answer * 2 + ds.length, why: 'This doubles the count, as if every value were stored twice; each value is one feature.' });

      const calc = colour
        ? `${m(`${W} \\times ${H} = ${pixels}`)} pixels, and each pixel has 3 values, so ${m(`${pixels} \\times 3 = ${answer}`)} features.`
        : `${m(`${W} \\times ${H} = ${pixels}`)} pixels, and each pixel has 1 value, so there are ${m(String(answer))} features.`;
      return {
        stem: `A model is trained to recognise ${object} in small ${kind}. Each image is ${W} pixels wide and ${H} pixels tall, and comes with a label saying what it shows. Every stored pixel value is one input feature. How many **input features** does each image give the model?`,
        answer: m(String(answer)),
        answerValue: answer,
        distractors: ds.map((d) => ({ text: m(String(d.v)), value: d.v, why: d.why })),
        solution:
          `The image is a grid with ${W} pixels across and ${H} pixels down.\n\n` +
          `${calc}\n\n` +
          'The label is **not** a feature: it is the answer the model learns to predict.\n\n' +
          `Answer: ${m(String(answer))}`,
        keyIdea: 'Image features = width times height times values per pixel (1 for grayscale, 3 for colour); the label is never an input.',
      };
    },
  },
];
