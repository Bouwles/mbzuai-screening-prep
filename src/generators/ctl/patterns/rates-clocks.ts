import type { GeneratedCore, Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { Frac } from '../../../lib/frac';
import { num } from '../../../lib/tex';

type Cand = { v: number; text: string; why: string };

/** Keep up to 3 candidates that differ from the answer and from each other (by value and by text). */
function pickDistinct(answer: { v: number; text: string }, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  const close = (a: number, b: number) => Math.abs(a - b) < 1e-9;
  for (const c of pool) {
    if (out.length === 3) break;
    if (!Number.isFinite(c.v)) continue;
    if (close(c.v, answer.v) || c.text === answer.text) continue;
    if (out.some((x) => close(x.v, c.v) || x.text === c.text)) continue;
    out.push(c);
  }
  return out;
}

// ======================================================================== clock angles

/** Reduce any angle to the smaller angle between two hands, in [0, 180]. */
function smaller(a: number): number {
  const r = ((a % 360) + 360) % 360;
  return Math.min(r, 360 - r);
}
const deg = (x: number) => `$${num(x)}^\\circ$`;
const two = (x: number) => (x < 10 ? `0${x}` : String(x));

function clockAngle(rng: Rng): GeneratedCore {
  for (;;) {
    const h = rng.int(1, 12);
    const mm = rng.bool(0.6) ? 5 * rng.int(1, 11) : rng.int(1, 59);
    const hh = h % 12;
    const hourPos = 30 * hh + 0.5 * mm;
    const minPos = 6 * mm;
    const raw = Math.abs(hourPos - minPos);
    const ans = raw > 180 ? 360 - raw : raw;
    if (ans === 0 || ans === 180) continue;
    const answer = deg(ans);
    const time = `$${h}{:}${two(mm)}$`;
    const pool: Cand[] = [
      {
        v: smaller(30 * hh - 6 * mm),
        text: '',
        why: `This leaves the hour hand pointing exactly at ${h}. In ${mm} minutes the hour hand also moves, by $0.5^\\circ$ per minute, so it is $${num(0.5 * mm)}^\\circ$ past the ${h}.`,
      },
      {
        v: 360 - ans,
        text: '',
        why: 'This is the reflex (larger) angle, the long way round. The question asks for the smaller angle, so it must be at most $180^\\circ$.',
      },
      {
        v: smaller(30 * hh + mm - 6 * mm),
        text: '',
        why: 'This moves the hour hand $1^\\circ$ per minute. It moves $30^\\circ$ in $60$ minutes, which is only $0.5^\\circ$ per minute.',
      },
      {
        v: smaller(30 * hh - 0.5 * mm - 6 * mm),
        text: '',
        why: `This moves the hour hand backwards (towards ${hh === 1 ? 12 : (hh + 11) % 12 || 12}) instead of forwards towards the next number.`,
      },
      {
        v: smaller(30 * (hh + 1) - 6 * mm),
        text: '',
        why: `This rounds the hour hand up to point exactly at the next number. It has only moved $${num(0.5 * mm)}^\\circ$ past the ${h}.`,
      },
      {
        v: smaller(hourPos - 5 * mm),
        text: '',
        why: 'This moves the minute hand $5^\\circ$ per minute. It turns $360^\\circ$ in $60$ minutes, which is $6^\\circ$ per minute.',
      },
    ].map((c) => ({ ...c, text: deg(c.v) }));
    const ds = pickDistinct({ v: ans, text: answer }, pool);
    if (ds.length < 3) continue;

    const hourLine =
      hh === 0
        ? `- Hour hand: at 12 o'clock it points at $0^\\circ$, then moves $0.5^\\circ$ per minute: $${mm} \\times 0.5 = ${num(hourPos)}^\\circ$.`
        : `- Hour hand: $30^\\circ$ per hour plus $0.5^\\circ$ per minute: $${hh} \\times 30 + ${mm} \\times 0.5 = ${30 * hh} + ${num(0.5 * mm)} = ${num(hourPos)}^\\circ$.`;
    const big = Math.max(hourPos, minPos);
    const small = Math.min(hourPos, minPos);
    const diffLine =
      raw > 180
        ? `Difference: $${num(big)} - ${num(small)} = ${num(raw)}^\\circ$. This is more than $180^\\circ$, so the smaller angle is $360 - ${num(raw)} = ${num(ans)}^\\circ$.`
        : `Difference: $${num(big)} - ${num(small)} = ${num(raw)}^\\circ$. This is at most $180^\\circ$, so it is already the smaller angle.`;
    const solution =
      'Measure both hands clockwise from 12.\n\n' +
      `- Minute hand: $6^\\circ$ per minute, so $${mm} \\times 6 = ${minPos}^\\circ$.\n` +
      hourLine +
      '\n\n' +
      diffLine +
      '\n\n' +
      `Answer: ${answer}`;
    return {
      stem: `What is the **smaller** angle between the hour hand and the minute hand of an analogue clock at ${time}?`,
      answer,
      answerValue: ans,
      distractors: ds.map((d) => ({ text: d.text, value: d.v, why: d.why })),
      solution,
      keyIdea: 'The minute hand moves $6^\\circ$ per minute and the hour hand $0.5^\\circ$ per minute, so the angle is $|30H - 5.5M|$ (use $360^\\circ$ minus this if it is over $180^\\circ$).',
    };
  }
}

// ======================================================================== work rates

const NICE_DEN = new Set([1, 2, 4, 5]);
/** Hours as rich text: decimals when they terminate nicely, otherwise a fraction. */
function hoursText(f: Frac): string {
  const body = NICE_DEN.has(f.d) ? num(f.value()) : f.tex();
  return `$${body}$ ${f.equals(1) ? 'hour' : 'hours'}`;
}
const hoursTex = (f: Frac) => (NICE_DEN.has(f.d) ? num(f.value()) : f.tex());

interface WorkCtx {
  /** Stem for "both work together". */
  together: (a: number, b: number) => string;
  unit: string; // "of the tank"
  who: [string, string];
}
const WORK_CTX: WorkCtx[] = [
  {
    together: (a, b) =>
      `Pipe A can fill an empty tank on its own in $${a}$ hours. Pipe B can fill the same tank on its own in $${b}$ hours. If both pipes are opened at the same time, how long does it take to fill the empty tank?`,
    unit: 'of the tank',
    who: ['Pipe A', 'Pipe B'],
  },
  {
    together: (a, b) =>
      `Mariam can paint a fence on her own in $${a}$ hours. Karim can paint the same fence on his own in $${b}$ hours. How long will it take them to paint the fence if they work together?`,
    unit: 'of the fence',
    who: ['Mariam', 'Karim'],
  },
  {
    together: (a, b) =>
      `An old printer prints a batch of reports in $${a}$ hours. A new printer prints the same batch in $${b}$ hours. If the batch is split between both printers running at the same time, how long does the whole batch take?`,
    unit: 'of the batch',
    who: ['the old printer', 'the new printer'],
  },
];

function workRate(rng: Rng): GeneratedCore {
  const drain = rng.bool(0.35);
  for (;;) {
    const a = rng.int(2, 20);
    const b = rng.int(a + 1, 30);
    const rateA = new Frac(1, a);
    const rateB = new Frac(1, b);
    const net = drain ? rateA.sub(rateB) : rateA.add(rateB);
    const T = new Frac(1).div(net);
    if (!NICE_DEN.has(T.d) || T.value() > 60) continue;
    const answer = hoursText(T);
    const av = T.value();

    let stem: string;
    let pool: Cand[];
    let solution: string;
    if (drain) {
      stem = `A tap can fill an empty tank in $${a}$ hours. A leak in the bottom of the tank can empty a full tank in $${b}$ hours. The tank starts empty and the tap is turned on while the leak is still there. How long does it take to fill the tank?`;
      const added = new Frac(1).div(rateA.add(rateB));
      const raw: { f: Frac; why: string }[] = [
        { f: added, why: 'This adds the two rates, as if the leak were helping to fill the tank. The leak removes water, so its rate must be subtracted.' },
        { f: new Frac(b - a), why: `This subtracts the times ($${b} - ${a}$). Times cannot be combined like this; subtract the rates $\\frac{1}{${a}} - \\frac{1}{${b}}$ instead.` },
        { f: new Frac(a + b), why: `This adds the times ($${a} + ${b}$). Combine rates, not times.` },
        { f: net, why: `This stops at the net rate, $${net.tex()}$ of the tank per hour, and reads it as a time. The time is the reciprocal of the rate.` },
        { f: new Frac(a + b, 2), why: 'This averages the two times, which has no meaning here: one of them fills and the other empties.' },
      ];
      pool = raw.map((r) => ({ v: r.f.value(), text: hoursText(r.f), why: r.why }));
      solution =
        'Work with rates: the fraction of the tank filled per hour.\n\n' +
        `- Tap: $+\\frac{1}{${a}}$ of the tank per hour.\n` +
        `- Leak: $-\\frac{1}{${b}}$ of the tank per hour (it works against the tap).\n\n` +
        `Net rate: $\\frac{1}{${a}} - \\frac{1}{${b}} = \\frac{${b}}{${a * b}} - \\frac{${a}}{${a * b}} = \\frac{${b - a}}{${a * b}}${net.d === a * b ? '' : ` = ${net.tex()}`}$ of the tank per hour.\n\n` +
        `Time $= 1 \\div ${net.tex()} = ${hoursTex(T)}$ hours. It is longer than the $${a}$ hours the tap needs alone, as it should be.\n\n` +
        `Answer: ${answer}`;
    } else {
      const ctx = rng.pick(WORK_CTX);
      stem = ctx.together(a, b);
      const raw: { f: Frac; why: string }[] = [
        { f: new Frac(a + b, 2), why: `This averages the two times. Working together is faster than either alone, so the answer must be less than $${a}$ hours.` },
        { f: new Frac(a + b), why: 'This adds the two times, as if the second one slowed the first down. Add the rates, not the times.' },
        { f: net, why: `This stops at the combined rate, $${net.tex()}$ ${ctx.unit} per hour, and reads it as a time. The time is the reciprocal of the rate.` },
        { f: new Frac(b - a), why: `This subtracts the times ($${b} - ${a}$). Times cannot be combined directly; add the rates $\\frac{1}{${a}} + \\frac{1}{${b}}$.` },
        { f: new Frac(a + b, 4), why: `This pretends both take the average time $\\frac{${a} + ${b}}{2}$ each, then halves it. Averaging the times gives too much weight to the slower one; add the rates instead.` },
        { f: new Frac(a, 2), why: `This halves the faster time, as if both were as fast as ${ctx.who[0]}.` },
      ];
      pool = raw.map((r) => ({ v: r.f.value(), text: hoursText(r.f), why: r.why }));
      const sumUnred = `\\frac{${b}}{${a * b}} + \\frac{${a}}{${a * b}} = \\frac{${a + b}}{${a * b}}`;
      const sumLine = net.d === a * b ? sumUnred : `${sumUnred} = ${net.tex()}`;
      solution =
        'Work with rates: the fraction of the job done per hour.\n\n' +
        `- ${ctx.who[0][0].toUpperCase() + ctx.who[0].slice(1)} does $\\frac{1}{${a}}$ ${ctx.unit} per hour.\n` +
        `- ${ctx.who[1][0].toUpperCase() + ctx.who[1].slice(1)} does $\\frac{1}{${b}}$ ${ctx.unit} per hour.\n\n` +
        `Together: $\\frac{1}{${a}} + \\frac{1}{${b}} = ${sumLine}$ ${ctx.unit} per hour.\n\n` +
        `Time $= 1 \\div ${net.tex()} = ${hoursTex(T)}$ hours. This is less than the $${a}$ hours of the faster one alone, as it should be.\n\n` +
        `Answer: ${answer}`;
    }
    const ds = pickDistinct({ v: av, text: answer }, pool);
    if (ds.length < 3) continue;
    return {
      stem,
      answer,
      answerValue: av,
      distractors: ds.map((d) => ({ text: d.text, value: d.v, why: d.why })),
      solution,
      keyIdea: drain
        ? 'An emptying pipe has a negative rate: the net rate is $\\frac{1}{a} - \\frac{1}{b}$, and the time is $1$ divided by the net rate.'
        : 'Add the rates, $\\frac{1}{a} + \\frac{1}{b}$, never the times, then take the reciprocal to get the time together.',
    };
  }
}

// ======================================================================== catch-up

interface ChaseCtx {
  slow: string;
  fast: string;
  slowSpeeds: number[];
  fastSpeeds: number[];
  delays: number[];
}
const CHASE_CTX: ChaseCtx[] = [
  { slow: 'A walker', fast: 'a cyclist', slowSpeeds: [4, 5, 6], fastSpeeds: [12, 15, 16, 18, 20], delays: [12, 15, 20, 24, 30, 36, 40, 45, 60] },
  { slow: 'A cyclist', fast: 'a car', slowSpeeds: [10, 12, 15, 16, 18, 20], fastSpeeds: [40, 45, 48, 50, 60], delays: [10, 15, 20, 30, 40, 45, 60] },
  { slow: 'A lorry', fast: 'a car', slowSpeeds: [50, 60, 70], fastSpeeds: [80, 90, 100, 110], delays: [6, 10, 12, 15, 20, 30] },
];
const niceNum = (x: number) => Math.abs(x * 100 - Math.round(x * 100)) < 1e-9;
const minText = (x: number) => `$${num(x)}$ ${x === 1 ? 'minute' : 'minutes'}`;
/** A Frac as TeX: a short decimal when it terminates within 2 d.p., otherwise an exact fraction. */
const exactTex = (f: Frac) => (niceNum(f.value()) ? num(f.value()) : f.tex());

function catchUp(rng: Rng): GeneratedCore {
  for (;;) {
    const ctx = rng.pick(CHASE_CTX);
    const v1 = rng.pick(ctx.slowSpeeds);
    const v2 = rng.pick(ctx.fastSpeeds);
    const d = rng.pick(ctx.delays);
    const closing = v2 - v1;
    const head = new Frac(v1 * d, 60); // km
    const t = head.div(closing).mul(60); // minutes after the faster one leaves
    if (!t.isInt() || !niceNum(head.value())) continue;
    const tv = t.value();
    const answer = minText(tv);
    const H = num(head.value());
    const slowThe = ctx.slow.replace(/^A /, 'the ');
    const fastThe = ctx.fast.replace(/^a /, 'the ');
    const pool: Cand[] = [
      {
        v: tv + d,
        text: minText(tv + d),
        why: `This is the time since the **first** traveller set off ($${num(tv)} + ${d}$). The question counts from when ${fastThe} sets off.`,
      },
      {
        v: head.div(v2).mul(60).value(),
        text: minText(head.div(v2).mul(60).value()),
        why: `This divides the head start by ${fastThe}'s own speed ($${H} \\div ${v2}$ hours), forgetting that the one in front keeps moving. Use the difference in speeds.`,
      },
      {
        v: head.div(v1 + v2).mul(60).value(),
        text: minText(head.div(v1 + v2).mul(60).value()),
        why: 'This adds the speeds. Adding speeds is for objects moving towards each other; in a chase the gap closes at the difference of the speeds.',
      },
      {
        v: d,
        text: minText(d),
        why: `This assumes catching up takes as long as the head start of $${d}$ minutes. It depends on how much faster the chaser is.`,
      },
      {
        v: tv / 60,
        text: minText(tv / 60),
        why: `This finds the time in **hours** ($${head.div(closing).tex()}$ h) and writes it as minutes without multiplying by $60$.`,
      },
    ].filter((c) => niceNum(c.v));
    const ds = pickDistinct({ v: tv, text: answer }, pool);
    if (ds.length < 3) continue;
    const hoursFrac = new Frac(d, 60);
    const tHours = head.div(closing);
    const solution =
      `**Head start.** When ${fastThe} sets off, ${slowThe} has been travelling for $${d}$ minutes $= ${hoursFrac.tex()}$ h, so is $${v1} \\times ${hoursFrac.tex()} = ${H}$ km ahead.\n\n` +
      `**Closing speed.** Both go the same way, so the gap shrinks at $${v2} - ${v1} = ${closing}$ km/h.\n\n` +
      `**Time to close the gap.** $${H} \\div ${closing} = ${tHours.tex()}$ h $= ${tHours.tex()} \\times 60 = ${num(tv)}$ minutes.\n\n` +
      `Check: in that time ${fastThe} travels $${v2} \\times ${tHours.tex()} = ${exactTex(tHours.mul(v2))}$ km, and ${slowThe} has travelled $${v1} \\times ${t.add(d).div(60).tex()} = ${exactTex(t.add(d).div(60).mul(v1))}$ km in total. They are at the same place.\n\n` +
      `Answer: ${answer}`;
    return {
      stem: `${ctx.slow} sets off from a town at a steady $${v1}$ km/h. Exactly $${d}$ minutes later, ${ctx.fast} leaves the same place and follows the same road at a steady $${v2}$ km/h. How many minutes after ${fastThe} sets off does it catch up with ${slowThe}?`,
      answer,
      answerValue: tv,
      distractors: ds.map((x) => ({ text: x.text, value: x.v, why: x.why })),
      solution,
      keyIdea: 'The catch-up time is the head-start distance divided by the difference in speeds.',
    };
  }
}

export const generators: Generator[] = [
  {
    id: 'gen-rates-clocks-clock-angle',
    subtopic: 'rates-clocks',
    difficulty: 'exam',
    title: 'Angle between the hands of a clock',
    generate: clockAngle,
  },
  {
    id: 'gen-rates-clocks-work-rate',
    subtopic: 'rates-clocks',
    difficulty: 'exam',
    title: 'Two workers or pipes working together (or against each other)',
    generate: workRate,
  },
  {
    id: 'gen-rates-clocks-catch-up',
    subtopic: 'rates-clocks',
    difficulty: 'exam',
    title: 'Catch-up problem: head start and closing speed',
    generate: catchUp,
  },
];
