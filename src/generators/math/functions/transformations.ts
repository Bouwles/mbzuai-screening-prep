import type { Generator } from '../../../types';
import { m, num, paren, poly, signed } from '../../../lib/tex';

type Pt = [number, number];
const ptKey = (p: Pt) => `${p[0]},${p[1]}`;
const ptTex = (p: Pt) => m(`(${num(p[0])}, ${num(p[1])})`);

/** Picks the first 3 candidates that differ from the answer and from each other (by value and text). */
function pickDistinct<T extends { key: string; text: string }>(answerKey: string, answerText: string, pool: T[]): T[] {
  const out: T[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (c.key === answerKey || c.text === answerText) continue;
    if (out.some((o) => o.key === c.key || o.text === c.text)) continue;
    out.push(c);
  }
  if (out.length < 3) throw new Error('not enough distinct distractors');
  return out;
}

/** "2f(x + 3)", "-f(x - 1)", "f(x + 2)" */
function fTex(a: number, inner: string): string {
  const coef = a === 1 ? '' : a === -1 ? '-' : num(a);
  return `${coef}f(${inner})`;
}

export const generators: Generator[] = [
  // ---------------------------------------------------------------- image of a point
  {
    id: 'gen-transformations-point-image',
    subtopic: 'transformations',
    difficulty: 'exam',
    title: 'Image of a point under y = a f(x + c) + d',
    generate(rng) {
      const p = rng.int(-6, 6);
      const q = rng.intNonZero(-6, 6);
      const a = rng.pick([-3, -2, -1, 2, 3, 4]);
      const c = rng.intNonZero(-5, 5);
      const d = rng.intNonZero(-6, 6);

      const inner = `x${signed(c)}`;
      const gTex = `y = ${fTex(a, inner)}${signed(d)}`;
      const ans: Pt = [p - c, a * q + d];
      const answer = ptTex(ans);

      const hDir = c > 0 ? 'left' : 'right';
      const vWord = a === -1 ? 'reflection in the $x$-axis' : a < 0 ? `vertical stretch (factor ${num(-a)}) with a reflection` : `vertical stretch (factor ${num(a)})`;
      const addWord = d > 0 ? `adding ${num(d)}` : `subtracting ${num(-d)}`;
      const pool: { key: string; text: string; value: string; why: string }[] = [];
      const add = (pt: Pt, why: string) => pool.push({ key: ptKey(pt), text: ptTex(pt), value: ptKey(pt), why });
      add(
        [p + c, a * q + d],
        `This moves the point the wrong way horizontally. Inside the bracket the effect is reversed: ${m(inner)} moves the graph ${Math.abs(c)} unit${Math.abs(c) === 1 ? '' : 's'} to the **${hDir}**, so the new ${m('x')} solves ${m(`${inner} = ${num(p)}`)}.`,
      );
      add(
        [p - c, a * (q + d)],
        `This does the ${d > 0 ? 'adding' : 'subtracting'} first and multiplies afterwards: ${m(`${paren(a)} \\times (${num(q)}${signed(d)})`)}. In ${m(gTex)} the output of ${m('f')} is multiplied by ${m(num(a))} first, and only then is ${num(Math.abs(d))} ${d > 0 ? 'added' : 'subtracted'}.`,
      );
      add(
        [p - c, q + d],
        `This forgets the ${vWord}: the ${m('y')}-value must be multiplied by ${m(num(a))} before ${addWord}.`,
      );
      add(
        [a * p - c, q + d],
        `This applies the factor ${m(num(a))} to the ${m('x')}-coordinate instead of the ${m('y')}-coordinate. The ${m(num(a))} is outside the function, so it only changes ${m('y')}-values.`,
      );
      add(
        [p - c, a * q - d],
        `This moves the point the wrong way vertically. The ${m(signed(d).trim())} is outside the function, so it is added to the ${m('y')}-value exactly as written.`,
      );
      add(
        [p + c, a * (q + d)],
        `This makes two slips: it moves the wrong way horizontally (inside the bracket the effect is reversed) and it does the ${d > 0 ? 'adding' : 'subtracting'} before multiplying by ${m(num(a))}.`,
      );
      const ds = pickDistinct(ptKey(ans), answer, pool);

      const solution =
        `Write the new graph as ${m(gTex)} and treat the two coordinates separately.\n\n` +
        `**${m('x')}-coordinate (inside the bracket, do the opposite):** the new graph uses the same output ${m(`f(${num(p)}) = ${num(q)}`)} when the input to ${m('f')} is ${m(num(p))}:` +
        `\n\n$$${inner} = ${num(p)} \\Rightarrow x = ${p === 0 ? num(ans[0]) : `${num(p)}${signed(-c)} = ${num(ans[0])}`}$$\n\n` +
        `This is a translation of ${Math.abs(c)} unit${Math.abs(c) === 1 ? '' : 's'} to the ${hDir}.\n\n` +
        `**${m('y')}-coordinate (outside, do what you see):** multiply by ${m(num(a))} first, then ${d > 0 ? 'add' : 'subtract'} ${num(Math.abs(d))}:` +
        `\n\n$$${paren(a)} \\times ${paren(q)}${signed(d)} = ${num(a * q)}${signed(d)} = ${num(ans[1])}$$\n\n` +
        `So ${ptTex([p, q])} moves to ${answer}.\n\nAnswer: ${answer}`;

      return {
        stem: `The point ${ptTex([p, q])} lies on the graph of ${m('y = f(x)')}. Which point must lie on the graph of ${m(gTex)}?`,
        answer,
        answerValue: ptKey(ans),
        distractors: ds.map((x) => ({ text: x.text, value: x.value, why: x.why })),
        solution,
        keyIdea: `Under ${m('y = af(x + c) + d')} a point ${m('(p, q)')} moves to ${m('(p - c, aq + d)')}: inside acts on ${m('x')} (opposite way), outside acts on ${m('y')} (multiply, then add).`,
      };
    },
  },
  // ---------------------------------------------------------------- vertex of a translated quadratic
  {
    id: 'gen-transformations-quadratic-vertex',
    subtopic: 'transformations',
    difficulty: 'exam',
    title: 'Vertex of a translated quadratic (complete the square first)',
    generate(rng) {
      const h = rng.intNonZero(-5, 5);
      const k = rng.int(-6, 6);
      const p = -2 * h;
      const r = k + h * h;
      const c = rng.intNonZero(-4, 4);
      const d = rng.intNonZero(-6, 6);

      const fx = poly([1, p, r]);
      const inner = `x${signed(c)}`;
      const gTex = `y = f(${inner})${signed(d)}`;
      const ans: Pt = [h - c, k + d];
      const answer = ptTex(ans);

      const pool: { key: string; text: string; why: string }[] = [];
      const add = (pt: Pt, why: string) => pool.push({ key: ptKey(pt), text: ptTex(pt), why });
      add(
        [h + c, k + d],
        `This moves the vertex the wrong way horizontally. ${m(inner)} inside the bracket shifts the graph ${Math.abs(c)} unit${Math.abs(c) === 1 ? '' : 's'} to the **${c > 0 ? 'left' : 'right'}**.`,
      );
      add(
        [-h - c, k + d],
        `This starts from the wrong vertex ${ptTex([-h, k])}. In ${m(`(x${signed(-h)})^2`)} the bracket is zero when ${m(`x = ${num(h)}`)}, so the vertex of ${m('f')} is at ${m(`x = ${num(h)}`)}.`,
      );
      add(
        [h - c, r + d],
        `This uses the constant term ${m(num(r))} as the ${m('y')}-coordinate of the vertex. The constant term is the ${m('y')}-intercept; the vertex height comes from completing the square.`,
      );
      add(
        [h - c, k - d],
        `This moves the vertex the wrong way vertically. The ${m(signed(d).trim())} is outside the function, so it is added to the ${m('y')}-value as written.`,
      );
      add(
        [h + c, k - d],
        `This reverses both shifts. Inside the bracket the effect is reversed, but outside it is not.`,
      );
      const ds = pickDistinct(ptKey(ans), answer, pool);

      const half = -h; // p / 2
      const squareStep =
        `${fx} = (x${signed(half)})^2 - ${num(h * h)}${r !== 0 ? signed(r) : ''} = (x${signed(-h)})^2${k !== 0 ? signed(k) : ''}`;
      const solution =
        `**Step 1: find the vertex of ${m('f')}** by completing the square. Half of ${m(num(p))} is ${m(num(half))}:` +
        `\n\n$$${squareStep}$$\n\n` +
        `So the vertex of ${m('y = f(x)')} is ${ptTex([h, k])}.\n\n` +
        `**Step 2: apply the translation** ${m(gTex)}.\n\n` +
        `- Inside: ${m(inner)} moves the graph ${Math.abs(c)} unit${Math.abs(c) === 1 ? '' : 's'} ${c > 0 ? 'left' : 'right'}: ${m(`${num(h)}${signed(-c)} = ${num(ans[0])}`)}\n` +
        `- Outside: ${m(signed(d).trim())} moves it ${Math.abs(d)} unit${Math.abs(d) === 1 ? '' : 's'} ${d > 0 ? 'up' : 'down'}: ${m(`${num(k)}${signed(d)} = ${num(ans[1])}`)}\n\n` +
        `Answer: ${answer}`;

      return {
        stem: `Let ${m(`f(x) = ${fx}`)}. What are the coordinates of the vertex of the graph of ${m(gTex)}?`,
        answer,
        answerValue: ptKey(ans),
        distractors: ds.map((x) => ({ text: x.text, value: x.key, why: x.why })),
        solution,
        keyIdea: 'Complete the square to find the vertex of the original graph, then move the vertex exactly as the translation moves every point.',
      };
    },
  },
  // ---------------------------------------------------------------- asymptotes of a transformed 1/x
  {
    id: 'gen-transformations-reciprocal-asymptotes',
    subtopic: 'transformations',
    difficulty: 'foundation',
    title: 'Asymptotes of a transformed reciprocal graph',
    generate(rng) {
      const a = rng.pick([1, 2, 3, 4, 5, -1, -2, -3]);
      const c = rng.intNonZero(-5, 5);
      const d = rng.intNonZero(-6, 6);
      const den = `x${signed(c)}`;
      const fracTex = a < 0 ? `-\\frac{${num(-a)}}{${den}}` : `\\frac{${num(a)}}{${den}}`;
      const gTex = `y = ${fracTex}${signed(d)}`;

      const txt = (va: number, ha: number) => `${m(`x = ${num(va)}`)} and ${m(`y = ${num(ha)}`)}`;
      const ans: Pt = [-c, d];
      const answer = txt(ans[0], ans[1]);

      const pool: { key: string; text: string; why: string }[] = [];
      const add = (pt: Pt, why: string) => pool.push({ key: ptKey(pt), text: txt(pt[0], pt[1]), why });
      add(
        [c, d],
        `This moves the vertical asymptote the wrong way. The denominator ${m(den)} is zero when ${m(`x = ${num(-c)}`)}, not ${m(`x = ${num(c)}`)}.`,
      );
      add(
        [-c, 0],
        `This forgets that the horizontal asymptote moves with the graph: the ${m(signed(d).trim())} outside shifts it from ${m('y = 0')} to ${m(`y = ${num(d)}`)}.`,
      );
      add(
        [d, -c],
        `This swaps the two asymptotes. The number in the denominator gives the vertical asymptote; the number added outside gives the horizontal one.`,
      );
      add(
        [-c, a],
        `This uses the ${a < 0 ? `number ${m(num(a))} in front of the fraction (the minus sign with the numerator)` : `numerator ${m(num(a))}`} as the horizontal asymptote. Multiplying ${m(`\\frac{1}{${den}}`)} by ${m(num(a))} only ${a === 1 ? 'leaves the graph unchanged' : a === -1 ? 'reflects the graph in the $x$-axis' : a < 0 ? 'stretches the graph vertically and reflects it' : 'stretches the graph vertically'}; it does not move the asymptote ${m('y = 0')}.`,
      );
      add(
        [-c, -d],
        `This moves the horizontal asymptote the wrong way. The ${m(signed(d).trim())} outside the fraction is added to every ${m('y')}-value as written.`,
      );
      add([c, -d], `This reverses both shifts: the vertical asymptote is where the denominator is zero, and the outside constant is added as written.`);
      const ds = pickDistinct(ptKey(ans), answer, pool);

      const stretch =
        a === 1
          ? ''
          : a === -1
            ? `- The minus sign in front reflects the graph in the ${m('x')}-axis. A horizontal asymptote ${m('y = 0')} stays at ${m('y = 0')} under a reflection, so this does not move any asymptote.\n`
            : `- The numerator ${m(num(a))} is a vertical stretch${a < 0 ? ' with a reflection in the $x$-axis' : ''}. Stretching ${m('y = 0')} keeps it at ${m('y = 0')}, so this does not move any asymptote.\n`;
      const solution =
        `Start from ${m('y = \\frac{1}{x}')}, which has asymptotes ${m('x = 0')} and ${m('y = 0')}, and follow how each part of ${m(gTex)} moves them.\n\n` +
        stretch +
        `- The denominator ${m(den)}: you cannot divide by zero, so the vertical asymptote is where ${m(`${den} = 0`)}, i.e. ${m(`x = ${num(-c)}`)} (a shift ${Math.abs(c)} ${c > 0 ? 'left' : 'right'}).\n` +
        `- The ${m(signed(d).trim())} outside: as ${m('x')} gets very large the fraction gets close to 0, so ${m('y')} gets close to ${m(num(d))}. The horizontal asymptote is ${m(`y = ${num(d)}`)}.\n\n` +
        `Answer: ${answer}`;

      return {
        stem: `What are the asymptotes of the graph of ${m(gTex)}?`,
        answer,
        answerValue: ptKey(ans),
        distractors: ds.map((x) => ({ text: x.text, value: x.key, why: x.why })),
        solution,
        keyIdea: `${m('y = \\frac{a}{x - h} + k')} is ${m('y = \\frac{1}{x}')} stretched by ${m('a')} and moved by ${m('h')} right and ${m('k')} up, so its asymptotes are ${m('x = h')} and ${m('y = k')}.`,
      };
    },
  },
];
