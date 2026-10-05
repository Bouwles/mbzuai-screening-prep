import type { Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';

const NAMES = ['Amir', 'Bella', 'Chen', 'Dina', 'Eli', 'Farah', 'Omar', 'Lina', 'Yusuf', 'Sara', 'Zaid', 'Maya', 'Hana', 'Imran', 'Jude', 'Kira', 'Rana', 'Tariq'];

const ISLAND = 'On an island, every inhabitant is either a **knight**, who always tells the truth, or a **knave**, who always lies.';

// ---------------------------------------------------------------- three islanders
type W = boolean[];
interface Claim {
  text: string;
  f: (w: W) => boolean;
}

const knights = (w: W) => w.filter(Boolean).length;
const typeWord = (k: boolean) => (k ? 'knight' : 'knave');

/** Statement templates: s = speaker, x and y = the two other people. */
const CLAIMS: ((N: string[], s: number, x: number, y: number) => Claim)[] = [
  (N, _s, x) => ({ text: `${N[x]} is a knave.`, f: (w) => !w[x] }),
  (N, _s, x) => ({ text: `${N[x]} is a knight.`, f: (w) => w[x] }),
  (N, _s, x, y) => ({ text: `${N[x]} and ${N[y]} are the same type.`, f: (w) => w[x] === w[y] }),
  (N, _s, x, y) => ({ text: `${N[x]} and ${N[y]} are different types.`, f: (w) => w[x] !== w[y] }),
  (N, s, x) => ({ text: `${N[x]} and I are different types.`, f: (w) => w[x] !== w[s] }),
  (N, s, x) => ({ text: `${N[x]} and I are the same type.`, f: (w) => w[x] === w[s] }),
  (N, _s, x, y) => ({ text: `At least one of ${N[x]} and ${N[y]} is a knave.`, f: (w) => !w[x] || !w[y] }),
  (N, _s, x, y) => ({ text: `${N[x]} and ${N[y]} are both knights.`, f: (w) => w[x] && w[y] }),
  () => ({ text: 'Exactly one of us three is a knight.', f: (w) => knights(w) === 1 }),
  () => ({ text: 'Exactly two of us three are knights.', f: (w) => knights(w) === 2 }),
  () => ({ text: 'All three of us are knaves.', f: (w) => knights(w) === 0 }),
  () => ({ text: 'At least one of us three is a knave.', f: (w) => knights(w) < 3 }),
  (N, s, x) => ({ text: `I am a knave or ${N[x]} is a knight.`, f: (w) => !w[s] || w[x] }),
  (N, s, x) => ({ text: `${N[x]} and I are both knaves.`, f: (w) => !w[s] && !w[x] }),
  (N, s, x) => ({ text: `If I am a knight, then ${N[x]} is a knave.`, f: (w) => !w[s] || !w[x] }),
];

const WORLDS: W[] = Array.from({ length: 8 }, (_, mask) => [0, 1, 2].map((i) => ((mask >> (2 - i)) & 1) === 0));

function describe(N: string[], w: W): string {
  return `${N[0]} is a ${typeWord(w[0])}, ${N[1]} is a ${typeWord(w[1])}, ${N[2]} is a ${typeWord(w[2])}.`;
}

// ---------------------------------------------------------------- who did it
interface Ctx {
  intro: string; // "Exactly one of four friends took the shared calculator."
  did: string; // "took it"
  didnt: string; // "didn't take it"
  question: string; // "Who took the calculator?"
}

const CTXS: Ctx[] = [
  { intro: 'Exactly one of four friends ate the last samosa.', did: 'ate it', didnt: "didn't eat it", question: 'Who ate the samosa?' },
  { intro: 'Exactly one of four classmates took the shared calculator.', did: 'took it', didnt: "didn't take it", question: 'Who took the calculator?' },
  { intro: 'Exactly one of four flatmates broke the kettle.', did: 'broke it', didnt: "didn't break it", question: 'Who broke the kettle?' },
  { intro: 'Exactly one of four teammates deleted the shared project file.', did: 'deleted it', didnt: "didn't delete it", question: 'Who deleted the file?' },
  { intro: 'Exactly one of four students left the lab door open.', did: 'left it open', didnt: "didn't leave it open", question: 'Who left the door open?' },
];

interface Stmt {
  text: string;
  f: (c: number) => boolean;
}

function baseStatement(rng: Rng, N: string[], ctx: Ctx, s: number): Stmt {
  const others = [0, 1, 2, 3].filter((i) => i !== s);
  const [x, y] = rng.sample(others, 2);
  const kind = rng.int(0, 5);
  switch (kind) {
    case 0:
      return { text: `${N[x]} ${ctx.did}.`, f: (c) => c === x };
    case 1:
      return { text: `${N[x]} ${ctx.didnt}.`, f: (c) => c !== x };
    case 2:
      return { text: `I ${ctx.didnt}.`, f: (c) => c !== s };
    case 3:
      return { text: `It was ${N[x]} or ${N[y]}.`, f: (c) => c === x || c === y };
    case 4:
      return { text: `Neither ${N[x]} nor ${N[y]} did it.`, f: (c) => c !== x && c !== y };
    default:
      return { text: `It wasn't me, it was ${N[x]}.`, f: (c) => c === x };
  }
}

export const generators: Generator[] = [
  {
    id: 'gen-knights-knaves-three-islanders',
    subtopic: 'knights-knaves',
    difficulty: 'exam',
    title: 'Three islanders: who is a knight and who is a knave?',
    generate(rng) {
      for (;;) {
        const N = rng.sample(NAMES, 3);
        const claims: Claim[] = [0, 1, 2].map((s) => {
          const [x, y] = rng.shuffle([0, 1, 2].filter((i) => i !== s));
          return rng.pick(CLAIMS)(N, s, x, y);
        });
        if (new Set(claims.map((c) => c.text)).size < 3) continue;
        const ok = WORLDS.filter((w) => claims.every((c, s) => c.f(w) === w[s]));
        if (ok.length !== 1) continue;
        const sol = ok[0];
        const answer = describe(N, sol);

        const distractors = [0, 1, 2].map((i) => {
          const w = sol.slice();
          w[i] = !w[i];
          const bad = claims.findIndex((c, s) => c.f(w) !== w[s]);
          const truth = claims[bad].f(w);
          return {
            text: describe(N, w),
            value: w.map((k) => (k ? 'K' : 'N')).join(''),
            why: `This gets ${N[i]}'s type wrong. In this case ${N[bad]} would be a ${typeWord(w[bad])}, but ${N[bad]}'s statement "${claims[bad].text}" would be ${truth ? 'true' : 'false'}, which a ${typeWord(w[bad])} can never say.`,
          };
        });

        const header = `| ${N[0]} | ${N[1]} | ${N[2]} | ${N[0]}'s claim | ${N[1]}'s claim | ${N[2]}'s claim | Possible? |`;
        const rows = WORLDS.map((w) => {
          const cells = claims.map((c, s) => {
            const t = c.f(w);
            return t === w[s] ? (t ? 'true' : 'false') : `${t ? 'true' : 'false'} ✗`;
          });
          const good = claims.every((c, s) => c.f(w) === w[s]);
          return `| ${w.map(typeWord).join(' | ')} | ${cells.join(' | ')} | ${good ? '**yes**' : 'no'} |`;
        });
        const solution =
          'A case is possible only if every **knight** says something **true** and every **knave** says something **false**.\n\n' +
          'There are $2^3 = 8$ cases. For each one, work out whether each claim is true or false, and mark ✗ when it does not match the speaker (a knight saying something false, or a knave saying something true):\n\n' +
          `${header}\n|---|---|---|---|---|---|---|\n${rows.join('\n')}\n\n` +
          'Exactly one row has no ✗, so that is the only possible situation.\n\n' +
          `Answer: ${answer}`;
        return {
          stem: `${ISLAND} You meet ${N[0]}, ${N[1]} and ${N[2]}.\n\n${claims.map((c, s) => `- ${N[s]} says: "${c.text}"`).join('\n')}\n\nWhat type is each of them?`,
          answer,
          answerValue: sol.map((k) => (k ? 'K' : 'N')).join(''),
          distractors,
          solution,
          keyIdea: 'Test each case: a situation is possible only when every knight\'s statement is true and every knave\'s statement is false.',
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
        const N = rng.sample(NAMES, 4);
        const ctx = rng.pick(CTXS);
        const stmts: Stmt[] = [0, 1, 2, 3].map((s) => baseStatement(rng, N, ctx, s));
        // Sometimes one speaker comments on another speaker instead.
        if (rng.bool(0.6)) {
          const s = rng.int(0, 3);
          const t = rng.pick([0, 1, 2, 3].filter((i) => i !== s));
          const target = stmts[t];
          stmts[s] = rng.bool(0.75)
            ? { text: `${N[t]} is lying.`, f: (c) => !target.f(c) }
            : { text: `${N[t]} is telling the truth.`, f: (c) => target.f(c) };
        }
        if (new Set(stmts.map((x) => x.text)).size < 4) continue;
        const value = rng.bool();
        const word = value ? 'true' : 'false';
        const counts = [0, 1, 2, 3].map((c) => stmts.filter((x) => x.f(c) === value).length);
        const good = counts.map((k, c) => (k === 1 ? c : -1)).filter((c) => c >= 0);
        if (good.length !== 1) continue;
        const culprit = good[0];
        const answer = N[culprit];

        const listOf = (c: number) => N.filter((_, s) => stmts[s].f(c) === value);
        const distractors = [0, 1, 2, 3]
          .filter((c) => c !== culprit)
          .map((c) => {
            const who = listOf(c);
            const desc =
              who.length === 0
                ? `no statement at all would be ${word}`
                : `${who.length} statement${who.length === 1 ? '' : 's'} would be ${word} (${who.map((n) => `${n}'s`).join(', ')})`;
            return {
              text: N[c],
              value: N[c],
              why: `If ${N[c]} were the culprit, ${desc}, not exactly one.`,
            };
          });

        const header = `| Culprit | ${N.map((n) => `${n}'s statement`).join(' | ')} | Number ${word} |`;
        const rows = [0, 1, 2, 3].map(
          (c) => `| ${N[c]} | ${stmts.map((x) => (x.f(c) ? 'true' : 'false')).join(' | ')} | ${c === culprit ? `**${counts[c]}**` : counts[c]} |`,
        );
        const solution =
          `Exactly one person did it, so try each suspect as the culprit, mark every statement true or false, and count the ${word} statements. We need exactly one ${word} statement.\n\n` +
          `${header}\n|---|---|---|---|---|---|\n${rows.join('\n')}\n\n` +
          `Only ${answer} as the culprit gives exactly one ${word} statement.\n\n` +
          `Answer: ${answer}`;
        return {
          stem: `${ctx.intro} Each makes one statement.\n\n${stmts.map((x, s) => `- ${N[s]}: "${x.text}"`).join('\n')}\n\nExactly **one** of the four statements is **${word}**. ${ctx.question}`,
          answer,
          answerValue: answer,
          distractors,
          solution,
          keyIdea: `Try each suspect in turn and count the ${word} statements; a pair of contradicting statements (one says the other is lying) always contains exactly one true statement.`,
        };
      }
    },
  },
];
