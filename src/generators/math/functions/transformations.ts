import type { Generator } from '../../../types';
import { steps } from '../../../lib/explanation';
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

      const units = (n: number) => `${Math.abs(n)} unit${Math.abs(n) === 1 ? '' : 's'}`;
      const solution = steps(
        `${ptTex([p, q])} on ${m('y = f(x)')} means ${m(`f(${num(p)}) = ${num(q)}`)}: when the input to ${m('f')} is ${m(num(p))}, the output is ${m(num(q))}. We can follow this one value through the new equation, handling ${m('x')} and ${m('y')} separately.`,
        `Find the new ${m('x')}. To use that same value of ${m('f')}, the bracket must equal ${m(num(p))}: ${m(`${inner} = ${num(p)}`)}. ${c > 0 ? 'Subtract' : 'Add'} ${m(num(Math.abs(c)))} ${c > 0 ? 'from' : 'to'} both sides: ${m(`x = ${num(p)}${signed(-c)} = ${num(ans[0])}`)}.`,
        `Find the new ${m('y')}. The equation multiplies the output of ${m('f')} by ${m(num(a))}, then ${d > 0 ? 'adds' : 'subtracts'} ${m(num(Math.abs(d)))}. Multiply first: ${m(`${paren(a)} \\times ${paren(q)} = ${num(a * q)}`)}.`,
        `Then ${d > 0 ? 'add' : 'subtract'}: ${m(`${num(a * q)}${signed(d)} = ${num(ans[1])}`)}. So the new point has ${m(`x = ${num(ans[0])}`)} and ${m(`y = ${num(ans[1])}`)}.`,
      );

      return {
        stem: `The point ${ptTex([p, q])} lies on the graph of ${m('y = f(x)')}. Which point must lie on the graph of ${m(gTex)}?`,
        answer,
        answerValue: ptKey(ans),
        distractors: ds.map((x) => ({ text: x.text, value: x.value, why: x.why })),
        asking: `Where does the point ${ptTex([p, q])} end up on the new graph?`,
        solution,
        conclusion: `The bracket moves the point ${units(c)} to the ${hDir}, and the numbers outside set its new height, so the point is ${answer}.`,
        keyIdea: `For ${m('y = af(x + c) + d')}, set the bracket equal to the old ${m('x')}-coordinate and solve for the new ${m('x')}. Then multiply the old ${m('y')} by ${m('a')} and add ${m('d')}, in that order. So ${m('(p, q)')} moves to ${m('(p - c, aq + d)')}.`,
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
      const units = (n: number) => `${Math.abs(n)} unit${Math.abs(n) === 1 ? '' : 's'}`;
      const vertexForm = `(x${signed(half)})^2${k !== 0 ? signed(k) : ''}`;
      const solution = steps(
        `The **vertex** is the turning point of the curve. A translation slides every point the same way without changing the shape. So find the vertex of ${m('f')}, then slide it.`,
        `Find the vertex by completing the square. Halve the number in front of ${m('x')}: ${m(`${num(p)} \\div 2 = ${num(half)}`)}. So use the bracket ${m(`(x${signed(half)})^2`)}, which expands to ${m(`x^{2}${signed(p)}x + ${num(h * h)}`)}.`,
        k === 0
          ? `The number on the end of ${m('f(x)')} is also ${m(num(h * h))}, so nothing needs adding: ${m(`f(x) = ${vertexForm}`)}.`
          : `The number on the end of ${m('f(x)')} is ${m(num(r))}, not ${m(num(h * h))}. To fix that, put the difference after the bracket: ${m(`${num(r)} - ${num(h * h)} = ${num(k)}`)}. So ${m(`f(x) = ${vertexForm}`)}.`,
        `A square is never negative, so ${m(`(x${signed(half)})^2`)} is smallest, at 0, when ${m(`x = ${num(h)}`)}. At that point ${m(`y = ${num(k)}`)}. So the vertex of ${m('f')} is ${ptTex([h, k])}.`,
        `Slide it sideways. Inside the bracket the effect is opposite to the sign, so ${m(inner)} moves the graph ${units(c)} ${c > 0 ? 'left' : 'right'}. The new ${m('x')} is ${m(`${num(h)}${signed(-c)} = ${num(ans[0])}`)}.`,
        `Slide it vertically. Outside the bracket the sign means what it says, so ${m(signed(d).trim())} moves the graph ${units(d)} ${d > 0 ? 'up' : 'down'}. The new ${m('y')} is ${m(`${num(k)}${signed(d)} = ${num(ans[1])}`)}.`,
      );

      return {
        stem: `Let ${m(`f(x) = ${fx}`)}. What are the coordinates of the vertex of the graph of ${m(gTex)}?`,
        answer,
        answerValue: ptKey(ans),
        distractors: ds.map((x) => ({ text: x.text, value: x.key, why: x.why })),
        asking: `Where is the turning point of ${m('f')} after the graph is moved?`,
        solution,
        conclusion: `Starting at ${ptTex([h, k])} and moving ${units(c)} ${c > 0 ? 'left' : 'right'} and ${units(d)} ${d > 0 ? 'up' : 'down'}, the new vertex is ${answer}.`,
        keyIdea: 'Complete the square to find the vertex of the original graph. Then move that point: $f(x + c)$ shifts it left by $c$, and adding $d$ outside shifts it up by $d$. No new equation is needed.',
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
          ? false
          : a === -1
            ? `The minus sign in front turns the graph upside down, but it moves neither line. A fraction near 0 is still near 0 after changing its sign.`
            : `The ${a < 0 ? `${m(num(a))} in front of the fraction stretches the graph and turns it upside down` : `${m(num(a))} on top stretches the graph vertically`}, but it moves neither line. A number near 0 is still near 0 after multiplying by ${m(num(a))}.`;
      const solution = steps(
        `An **asymptote** is a line that a graph gets closer and closer to but never reaches. A vertical one sits where the function breaks. A horizontal one is the height the graph settles at for huge ${m('x')}.`,
        `Vertical asymptote: the fraction breaks when its bottom is 0, since we can't divide by 0. Solve ${m(`${den} = 0`)} by ${c > 0 ? 'subtracting' : 'adding'} ${m(num(Math.abs(c)))}: ${m(`x = ${num(-c)}`)}.`,
        stretch,
        `Horizontal asymptote: when ${m('x')} is huge, the bottom of the fraction is huge, so the fraction is almost 0. That leaves only the number on the end, so the graph settles at ${m(`y = ${num(d)}`)}.`,
      );

      return {
        stem: `What are the asymptotes of the graph of ${m(gTex)}?`,
        answer,
        answerValue: ptKey(ans),
        distractors: ds.map((x) => ({ text: x.text, value: x.key, why: x.why })),
        asking: 'Which vertical and horizontal lines does this graph approach but never touch?',
        solution,
        conclusion: `The bottom is 0 at ${m(`x = ${num(-c)}`)} and the graph settles at height ${m(num(d))}, so the asymptotes are ${answer}.`,
        keyIdea: `For ${m('y = \\frac{a}{x - h} + k')}, the vertical asymptote is where the bottom is 0, ${m('x = h')}. The horizontal asymptote is the number added on the end, ${m('y = k')}. The number ${m('a')} on top moves neither.`,
      };
    },
  },
];
