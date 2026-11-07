import type { Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { steps, table } from '../../../lib/explanation';

const NAMES = ['Amir', 'Bella', 'Chen', 'Dina', 'Eli', 'Farah', 'Omar', 'Lina', 'Yusuf', 'Sara', 'Zaid', 'Maya', 'Hana', 'Imran', 'Jude', 'Kira', 'Rana', 'Tariq'];

const ISLAND = 'Knights always tell the truth; knaves always lie.';

type W = boolean[];
interface Claim {
  text: string;
  f: (w: W) => boolean;
}

const knights = (w: W) => w.filter(Boolean).length;
const typeWord = (k: boolean) => (k ? 'knight' : 'knave');
const tf = (b: boolean) => (b ? 'true' : 'false');
const codeOf = (w: W) => w.map((k) => (k ? 'K' : 'N')).join('');

/** Worlds for n people, listed with knights first. */
const worlds = (n: number): W[] =>
  Array.from({ length: 2 ** n }, (_, mask) => Array.from({ length: n }, (_, i) => ((mask >> (n - 1 - i)) & 1) === 0));

function describe(N: string[], w: W): string {
  return w.map((k, i) => `${N[i]} ${typeWord(k)}`).join(', ');
}

function caseTable(N: string[], claims: Claim[], all: W[]): string {
  const header = `| ${N.join(' | ')} | ${claims.map((_, s) => `${N[s]}'s claim`).join(' | ')} | Possible? |`;
  const sep = `|${'---|'.repeat(N.length + claims.length + 1)}`;
  const rows = all.map((w) => {
    const cells = claims.map((c, s) => (c.f(w) === w[s] ? tf(c.f(w)) : `${tf(c.f(w))} ✗`));
    const good = claims.every((c, s) => c.f(w) === w[s]);
    return `| ${w.map(typeWord).join(' | ')} | ${cells.join(' | ')} | ${good ? '**yes**' : 'no'} |`;
  });
  return `${header}\n${sep}\n${rows.join('\n')}`;
}

/** The reason an assignment fails: the first speaker whose statement does not match their type. */
function failReason(N: string[], claims: Claim[], w: W): string {
  const bad = claims.findIndex((c, s) => c.f(w) !== w[s]);
  return `${N[bad]} would be a ${typeWord(w[bad])}, but the statement "${claims[bad].text}" would be ${tf(claims[bad].f(w))}, which a ${typeWord(w[bad])} can never say.`;
}

/** Plain-words help for the harder kinds of claim in this puzzle, if there are any. */
function claimHelp(claims: Claim[]): string | false {
  const texts = claims.map((c) => c.text);
  const notes: string[] = [];
  if (texts.some((t) => t.startsWith('If I am'))) notes.push('An if-then statement is false only when the "if" part is true and the "then" part is false. Otherwise it counts as true.');
  if (texts.some((t) => t.includes('both'))) notes.push('A "both" statement is true only when both people fit it.');
  if (texts.some((t) => t.includes('one of us'))) notes.push('"Us" means all three people.');
  if (texts.some((t) => t.includes('At least one'))) notes.push('"At least one" means one or more.');
  if (texts.some((t) => t.includes('Exactly one'))) notes.push('"Exactly one" means one and no more.');
  return notes.length > 0 && notes.join(' ');
}

/** A worked example: why one particular case is ruled out. */
function exampleLine(N: string[], claims: Claim[], all: W[], sol: W): string {
  const w = all.find((x) => codeOf(x) !== codeOf(sol))!;
  return `Try one case: ${describe(N, w)}. ${failReason(N, claims, w)} So this case is ruled out.`;
}

// ---------------------------------------------------------------- two islanders
/** Statements by speaker s about the other person x. */
const TWO_CLAIMS: ((N: string[], s: number, x: number) => Claim)[] = [
  (N, _s, x) => ({ text: `${N[x]} is a knave.`, f: (w) => !w[x] }),
  (N, _s, x) => ({ text: `${N[x]} is a knight.`, f: (w) => w[x] }),
  (N, s, x) => ({ text: `${N[x]} and I are different types.`, f: (w) => w[x] !== w[s] }),
  (N, s, x) => ({ text: `${N[x]} and I are the same type.`, f: (w) => w[x] === w[s] }),
  (N, s, x) => ({ text: `${N[x]} and I are both knaves.`, f: (w) => !w[s] && !w[x] }),
  (N, s, x) => ({ text: `${N[x]} and I are both knights.`, f: (w) => w[s] && w[x] }),
  (N, s, x) => ({ text: `At least one of ${N[x]} and me is a knave.`, f: (w) => !w[s] || !w[x] }),
  (N, s, x) => ({ text: `If I am a knight, then ${N[x]} is a knave.`, f: (w) => !w[s] || !w[x] }),
  (N, s, x) => ({ text: `If I am a knight, then ${N[x]} is a knight.`, f: (w) => !w[s] || w[x] }),
];

// ---------------------------------------------------------------- three islanders
/** A claim that breaks the knight/knave symmetry, so the puzzle has one answer. */
const BREAKERS: ((N: string[], s: number, x: number) => Claim)[] = [
  (N, s, x) => ({ text: `${N[x]} and I are both knaves.`, f: (w) => !w[s] && !w[x] }),
  () => ({ text: 'All three of us are knaves.', f: (w) => knights(w) === 0 }),
  () => ({ text: 'At least one of us is a knave.', f: (w) => knights(w) < 3 }),
  () => ({ text: 'Exactly one of us is a knight.', f: (w) => knights(w) === 1 }),
];
const SIMPLE: ((N: string[], x: number) => Claim)[] = [
  (N, x) => ({ text: `${N[x]} is a knave.`, f: (w) => !w[x] }),
  (N, x) => ({ text: `${N[x]} is a knight.`, f: (w) => w[x] }),
];

// ---------------------------------------------------------------- who did it
interface Ctx {
  intro: string;
  did: string;
  didnt: string;
  question: string;
}

const CTXS: Ctx[] = [
  { intro: 'One of three friends ate the last samosa.', did: 'ate it', didnt: "didn't eat it", question: 'Who ate the samosa?' },
  { intro: 'One of three classmates took the calculator.', did: 'took it', didnt: "didn't take it", question: 'Who took the calculator?' },
  { intro: 'One of three flatmates broke the kettle.', did: 'broke it', didnt: "didn't break it", question: 'Who broke the kettle?' },
  { intro: 'One of three teammates deleted the file.', did: 'deleted it', didnt: "didn't delete it", question: 'Who deleted the file?' },
  { intro: 'One of three students broke the beaker.', did: 'broke it', didnt: "didn't break it", question: 'Who broke the beaker?' },
];

interface Stmt {
  text: string;
  f: (c: number) => boolean;
}

function baseStatement(rng: Rng, N: string[], ctx: Ctx, s: number): Stmt {
  const x = rng.pick([0, 1, 2].filter((i) => i !== s));
  switch (rng.int(0, 3)) {
    case 0:
      return { text: `${N[x]} ${ctx.did}.`, f: (c) => c === x };
    case 1:
      return { text: `${N[x]} ${ctx.didnt}.`, f: (c) => c !== x };
    case 2:
      return { text: `I ${ctx.didnt}.`, f: (c) => c !== s };
    default:
      return { text: `I ${ctx.did}.`, f: (c) => c === s };
  }
}

export const generators: Generator[] = [
  {
    id: 'gen-knights-knaves-two-islanders',
    subtopic: 'knights-knaves',
    difficulty: 'exam',
    title: 'Two islanders: who is a knight and who is a knave?',
    generate(rng) {
      const all = worlds(2);
      for (;;) {
        const N = rng.sample(NAMES, 2);
        const first = rng.pick(TWO_CLAIMS)(N, 0, 1);
        const twoSpeakers = rng.bool(0.5);
        const second = twoSpeakers ? rng.pick(TWO_CLAIMS)(N, 1, 0) : null;
        const claims: Claim[] = second ? [first, second] : [first];
        const ok = all.filter((w) => claims.every((c, s) => c.f(w) === w[s]));
        if (ok.length !== 1) continue;
        const sol = ok[0];
        const answer = describe(N, sol);
        const distractors = all
          .filter((w) => codeOf(w) !== codeOf(sol))
          .map((w) => ({ text: describe(N, w), value: codeOf(w), why: `In this case ${failReason(N, claims, w)}` }));
        const said = claims.map((c, s) => `${N[s]} says: "${c.text}"`).join(' ');
        const solution = steps(
          'A case is possible only if every **knight** says something **true** and every **knave** says something **false**. With two people there are only $2 \\times 2 = 4$ cases, so we can test them all.',
          claimHelp(claims),
          exampleLine(N, claims, all, sol),
          `Now test all 4 cases the same way. Each cell says whether that statement is true in that case, and ✗ marks a statement that does not fit its speaker. The only row with no ✗ is ${answer}:\n\n${caseTable(N, claims, all)}`,
        );
        return {
          stem: `${ISLAND} ${said} What are they?`,
          answer,
          answerValue: codeOf(sol),
          distractors,
          asking: 'What type is each person: knight or knave?',
          solution,
          conclusion: `Only this case has every statement fitting its speaker, so the answer is ${answer}.`,
          keyIdea: 'List the 4 cases of knight and knave. In each case, work out whether each statement is true, then test it: knights need true, knaves need false. Cross out any case that fails. The case left is the answer.',
        };
      }
    },
  },
  {
    id: 'gen-knights-knaves-three-islanders',
    subtopic: 'knights-knaves',
    difficulty: 'exam',
    title: 'Three islanders: who is a knight and who is a knave?',
    generate(rng) {
      const all = worlds(3);
      for (;;) {
        const N = rng.sample(NAMES, 3);
        const breaker = rng.int(0, 2);
        const claims: Claim[] = [0, 1, 2].map((s) => {
          const x = rng.pick([0, 1, 2].filter((i) => i !== s));
          return s === breaker ? rng.pick(BREAKERS)(N, s, x) : rng.pick(SIMPLE)(N, x);
        });
        if (new Set(claims.map((c) => c.text)).size < 3) continue;
        const ok = all.filter((w) => claims.every((c, s) => c.f(w) === w[s]));
        if (ok.length !== 1) continue;
        const sol = ok[0];
        const answer = describe(N, sol);
        const distractors = [0, 1, 2].map((i) => {
          const w = sol.slice();
          w[i] = !w[i];
          return { text: describe(N, w), value: codeOf(w), why: `This gets ${N[i]}'s type wrong. In this case ${failReason(N, claims, w)}` };
        });
        const solution = steps(
          'A case is possible only if every **knight** says something **true** and every **knave** says something **false**. Each of the three people has 2 possible types, so there are $2 \\times 2 \\times 2 = 8$ cases.',
          claimHelp(claims),
          exampleLine(N, claims, all, sol),
          `Now test all 8 cases the same way. Each cell says whether that statement is true in that case, and ✗ marks a statement that does not fit its speaker. The only row with no ✗ is ${answer}:\n\n${caseTable(N, claims, all)}`,
        );
        return {
          stem: `${ISLAND}\n\n${claims.map((c, s) => `- ${N[s]}: "${c.text}"`).join('\n')}\n\nWhat type is each of them?`,
          answer,
          answerValue: codeOf(sol),
          distractors,
          asking: 'Which of the three people are knights, and which are knaves?',
          solution,
          conclusion: `Only this case has every statement fitting its speaker, so the answer is ${answer}.`,
          keyIdea: `A table of all 8 cases always works. For speed, start with the statement that says the most (here ${N[breaker]}'s), suppose the speaker is a knight and follow each claim to the next person. A contradiction means the speaker is a knave.`,
        };
      }
    },
  },
  {
    id: 'gen-knights-knaves-who-did-it',
    subtopic: 'knights-knaves',
    difficulty: 'exam',
    title: 'Exactly one statement is true (or false): who did it?',
    generate(rng) {
      for (;;) {
        const N = rng.sample(NAMES, 3);
        const ctx = rng.pick(CTXS);
        const stmts: Stmt[] = [0, 1, 2].map((s) => baseStatement(rng, N, ctx, s));
        // Sometimes one speaker comments on another speaker instead.
        if (rng.bool(0.5)) {
          const s = rng.int(0, 2);
          const t = rng.pick([0, 1, 2].filter((i) => i !== s));
          const target = stmts[t];
          stmts[s] = { text: `${N[t]} is lying.`, f: (c) => !target.f(c) };
        }
        if (new Set(stmts.map((x) => x.text)).size < 3) continue;
        const value = rng.bool();
        const word = value ? 'true' : 'false';
        const counts = [0, 1, 2].map((c) => stmts.filter((x) => x.f(c) === value).length);
        const good = counts.map((k, c) => (k === 1 ? c : -1)).filter((c) => c >= 0);
        if (good.length !== 1) continue;
        const culprit = good[0];
        const answer = N[culprit];

        const others = [0, 1, 2]
          .filter((c) => c !== culprit)
          .map((c) => ({
            text: N[c],
            value: N[c],
            why: `If ${N[c]} were the culprit, ${counts[c]} statement${counts[c] === 1 ? '' : 's'} would be ${word}, not exactly one.`,
          }));
        const distractors = [
          ...others,
          { text: 'Cannot be determined', value: 'ambiguous', why: `Trying all three suspects leaves exactly one who gives one ${word} statement, so the culprit can be determined.` },
        ];

        const lying = stmts.find((x) => x.text.endsWith('is lying.'));
        const example = [0, 1, 2].find((c) => c !== culprit)!;
        const solution = steps(
          'We do not know who did it, so try each person as the culprit in turn. Once the culprit is fixed, every statement is either true or false.',
          lying && `"${lying.text}" is true exactly when that person's own statement is false. So those two statements are always opposites.`,
          `Try one suspect: if ${N[example]} did it, ${N[0]}'s statement is ${tf(stmts[0].f(example))}, ${N[1]}'s is ${tf(stmts[1].f(example))} and ${N[2]}'s is ${tf(stmts[2].f(example))}. That makes ${counts[example]} ${word}, and we need exactly 1.`,
          `Do the same for every suspect and count the ${word} statements. Only ${answer} gives a count of 1:\n\n${table(
            ['If the culprit is', ...N.map((n) => `${n}'s statement`), `Number ${word}`],
            [0, 1, 2].map((c) => [N[c], ...stmts.map((x) => tf(x.f(c))), c === culprit ? `**${counts[c]}**` : counts[c]]),
          )}`,
        );
        return {
          stem: `${ctx.intro} Exactly **one** statement below is **${word}**.\n\n${stmts.map((x, s) => `- ${N[s]}: "${x.text}"`).join('\n')}\n\n${ctx.question}`,
          answer,
          answerValue: answer,
          distractors,
          asking: `If exactly one statement is ${word}, who did it?`,
          solution,
          conclusion: `Only this suspect gives exactly one ${word} statement, so the answer is ${answer}.`,
          keyIdea: 'Draw a table with one row per suspect and one column per statement. Mark each statement true or false in that row, then count. When one person says another is lying, those two statements are always opposites.',
        };
      }
    },
  },
];
