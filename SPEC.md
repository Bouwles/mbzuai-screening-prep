# Screening Prep — Bank Clean-up, Exam-Style Screen and Timer Spec

> **Commit this file** to the repo root as `SPEC.md`, along with the work it describes.
>
> **Keep all wording neutral.** That covers code comments, commit messages, README, RESEARCH_NOTES, UI text and this file. Describe changes by what they do, e.g. *"Refocused the bank on exam-level questions: short stems, pseudocode, no challenge tier."*

## Contents

1. [The target question style](#1-the-target-question-style)
2. [Bank audit: what to delete, rewrite and keep](#2-bank-audit-what-to-delete-rewrite-and-keep)
3. [Refilling the bank after the clean-up](#3-refilling-the-bank-after-the-clean-up)
4. [Generators](#4-generators)
5. [Lessons](#5-lessons)
6. [Timers](#6-timers)
7. [Exam-style screen design](#7-exam-style-screen-design)
8. [Config, progress data and app-wide clean-up](#8-config-progress-data-and-app-wide-clean-up)
9. [README and RESEARCH_NOTES](#9-readme-and-research_notes)
10. [Checks before finishing](#10-checks-before-finishing)

---

## 1. The target question style

This is the standard every question in the bank is judged against. A question that doesn't fit it is deleted or rewritten (section 2).

### 1.1 General rules

| Rule | Detail |
|---|---|
| **Short stem** | One sentence wherever possible, and **at most about 35 words**, not counting code, tables or charts. No story or scenario wrapper unless it is the point of the question (e.g. a data-interpretation chart). |
| **Direct ask** | Use forms like "Find…", "What is…", "Which of the following…". A stem can also end with a colon and let the options finish the sentence (e.g. "…then for r(X) as the rank of a matrix X:"). |
| **Level** | Upper-secondary school to early first-year university. **One idea per question.** Foundation = one step or recall; Exam = two to four short steps. **No challenge tier** (section 2.1). |
| **Time** | A prepared student should answer it in about 30–90 seconds with paper and a calculator. |
| **Options** | Exactly 4, short (a number, a word or phrase, a short expression, or "Infinite loop" / "Error"). No letters in the option text. |
| **Wording** | Plain, and sometimes slightly formal or textbook-like. For example "unit matrix of order m" for the m × m identity, `r(A)` for rank, "a m × n matrix". The bank should use this kind of wording in some questions so students aren't thrown by it. Each such question says what the term means in its solution. |
| **Notation** | Standard school notation. Use `r(A)` or "rank of A", Iₙ or "unit/identity matrix", "slope" and "gradient" both, "mod" for remainder. |
| **Code** | Language-neutral **pseudocode** by default (section 1.3). Python only under the conditions in section 2.3. |
| **Distractors** | Each wrong option is the result of a specific, common mistake. The mark scheme's `whyWrong` names that mistake. |

### 1.2 Original examples of the target style

These are examples written for this spec, to show the style. They can go into the bank.

- *Matrices:* "Which of the following matrix products is not defined?" Options: a 3×4 matrix with a 4×2 / a 2×5 matrix with a 5×5 / a 3×2 matrix with a 3×2 / a 1×3 matrix with a 3×1.
- *Rank, symbolic:* "Let P be a p × q matrix and Q a q × p matrix with q < p. Which statement about PQ is always true?" Options: r(PQ) ≤ q / r(PQ) = p / PQ is invertible / r(PQ) = p − q.
- *Algebra:* "Find the slope of the line 3x + 6y = 2." Options: −0.5 / 0.5 / −2 / 2.
- *Data structures:* "Which principle does a queue follow?" Options: First in first out / Last in first out / First in last out / Last in last out.
- *Pseudocode trace:* the snippet in 1.3. Options: 9 / 10 / 14 / Infinite loop. Answer: 10.

### 1.3 The house pseudocode dialect

Every pseudocode snippet in the bank and the generators uses exactly this dialect:

```
n = 40
t = 0
while (true)
   t = t + mod(n,6) // mod is the modulus operator
   n = n - 11
   if n<0
      break
   end if
end while
print(t)
```

| Rule | Detail |
|---|---|
| **Indent** | 3 spaces per level |
| **Block endings** | No colons. Blocks close with `end if`, `end while`, `end for` |
| **Loops** | `while (true)` with parentheses and a `break` inside, or `while (cond)`, or `for i = 1 to n` (inclusive) |
| **If** | `if cond` on its own line, then `else`, then `end if` |
| **Remainder** | `mod(a,b)` as a function. The first time it appears in a snippet, add the comment `// mod is the modulus operator`. Use `div(a,b)` for integer division, with a similar comment on first use |
| **Output** | `print(x)` |
| **Assignment** | `=`, with comparisons written as `<`, `<=`, `==`, `!=` |
| **Keywords** | All lowercase: `while`, `if`, `else`, `for`, `to`, `break`, `return`, `function`, `end function` |
| **Arrays** | Only when needed, written `A[1]`, **1-based**. Say so in the stem: "Arrays are indexed from 1." |
| **Functions** | `function f(x)` … `return …` … `end function` |
| **Comments** | `//` comments are allowed. Keep them short |
| **"Infinite loop"** | Should be one of the four options in many trace questions, and the correct answer in some of them |

Write the answer of the example above into its mark scheme as an iteration table:

| n | mod(n,6) | t |
|---|---|---|
| 40 | 4 | 4 |
| 29 | 5 | 9 |
| 18 | 0 | 9 |
| 7 | 1 | 10 |

After the last row n becomes −4, so the loop breaks and prints **10**.

---

## 2. Bank audit: what to delete, rewrite and keep

Snapshot of the bank before this work:

| | Count |
|---|---|
| Static questions | 1,304 |
| Foundation | 357 |
| Exam | 681 |
| Challenge | 266 |
| Python code blocks | 184 |
| Pseudocode code blocks | 39 |

The ID lists below come from an automated scan. **Treat them as a starting point:** open every listed question, apply the rule, and also apply the rules to anything the scan missed.

### 2.1 Delete the whole Challenge tier (266 questions)

**Why:** these are well above the target level. They include:

- olympiad-style puzzles: six-inhabitant knights and knaves, clock-hand right angles, trailing zeros of 100!
- A-level Further / first-year-plus topics: directional derivatives, related rates, self-inverse functions, two's-complement overflow, determinant row operations, closed forms of recurrences, STATISTICS-style arrangements

Mocks already leave them out, so they only teach a harder exam than the real one.

**How:**
- Delete every static question with `difficulty: 'challenge'`.
- Delete the 4 generators with `difficulty: 'challenge'`, in:
  - `math/matrices-vectors/determinants-inverses.ts`
  - `math/functions/trig-equations.ts`
  - `prog/py-functions/recursion.ts`
  - `data/machine-learning/classic-algorithms.ts`
- **Exception:** if a challenge question is really a clean two-to-four-step Exam-level question that was over-labelled, you may relabel it `exam` instead of deleting it. It must meet section 1.1, especially the 35-word stem and 90-second rules. Expect this to apply to only a few, at most about 15.
- Remove the tier from the app (section 8.2).

### 2.2 Delete the `rates-clocks` subtopic

"Rates, work & clock problems" (20 questions) is general aptitude-test material. It isn't part of Computational Thinking & Logic or Pattern Recognition as the syllabus describes them.

Delete:
- `src/questions/ctl/patterns/rates-clocks.ts`
- its generators file
- its lesson file
- its entry in `src/syllabus.ts`
- its entry in `src/config/videos.ts`
- every other reference to it (search for `rates-clocks`)

Saved progress for it must be dropped cleanly (section 8.3).

### 2.3 Python questions

**Rule A — delete** any question whose answer depends on Python-specific behaviour that a language-neutral exam can't test:

- slicing with steps or negative indices
- negative indexing
- f-strings and format specs
- `lambda`, `map`, `filter`, comprehensions
- `global` / `nonlocal` / `UnboundLocalError`
- mutable default arguments
- `type()` output
- `is`
- `copy` / `deepcopy` / aliasing via `[:]`
- string methods (`split`, `join`, `strip`, `find`, …)
- `dict.get` / `.items()`
- `sorted(key=…)`
- sets of unhashable types
- tuple/string immutability errors
- `TypeError` from `str + int`
- `int("3.5")`
- classes / `Node` objects
- keyword-argument order rules

Non-challenge questions this applies to (49):

```
boolean-logic-015 evaluation-metrics-015 training-generalisation-016 number-bases-015 sets-venn-017
vectors-015 dicts-sets-002 dicts-sets-006 dicts-sets-008 dicts-sets-014 dicts-sets-017
lists-tuples-001 lists-tuples-002 lists-tuples-003 lists-tuples-007 lists-tuples-009 lists-tuples-011
lists-tuples-012 lists-tuples-013 stacks-queues-010 stacks-queues-015 trees-012 functions-scope-002
functions-scope-005 functions-scope-007 functions-scope-008 functions-scope-009 functions-scope-013
recursion-004 recursion-011 recursion-015 strings-001 strings-002 strings-003 strings-004 strings-006
strings-007 strings-008 strings-009 strings-010 strings-011 strings-013 strings-014
variables-operators-002 variables-operators-005 variables-operators-009 variables-operators-010
variables-operators-011 variables-operators-020
```

Exceptions:
- `recursion-004` and `recursion-015` (recursion that never stops) test a real idea. **Rewrite** them in pseudocode with "Infinite loop" / "The function never stops" as the answer, instead of `RecursionError`.
- `dicts-sets-006` / `-008` (counting and summing over a map) can become pseudocode with a 1-based array instead, if that still makes sense. Otherwise delete them.
- The maths and data questions with Python code (`vectors-015`, `sets-venn-017`, `number-bases-015`, `evaluation-metrics-015`, `training-generalisation-016`, `boolean-logic-015`) should be rewritten as plain maths or as pseudocode where the idea is worth keeping.

**Rule B — convert to pseudocode** any Python question that only tests a language-neutral idea (loops, conditionals, accumulators, counting iterations, recursion, stack/queue operations, searching/sorting steps, complexity). Rewrite the code in the section 1.3 dialect, keep the idea and the distractor logic, and update the mark scheme trace.

Candidates (85):

```
boolean-logic-010 boolean-logic-011 boolean-logic-014 ordering-puzzles-015 letter-symbol-patterns-016
number-sequences-014 classic-algorithms-015 neural-networks-013 regression-gradient-descent-013
sequences-series-012 modular-arithmetic-013 number-bases-012 propositional-logic-014
recurrence-relations-013 domain-range-014 matrix-operations-016 counting-013 variance-sd-012
complexity-007 complexity-008 complexity-012 complexity-019 complexity-020 searching-sorting-011
tracing-pseudocode-005 tracing-pseudocode-012 dicts-sets-001 dicts-sets-004 dicts-sets-007
dicts-sets-009 dicts-sets-011 dicts-sets-012 dicts-sets-013 lists-tuples-004 lists-tuples-005
lists-tuples-006 lists-tuples-008 lists-tuples-010 stacks-queues-004 stacks-queues-009
functions-scope-001 functions-scope-003 functions-scope-006 functions-scope-010 functions-scope-011
functions-scope-015 recursion-002 recursion-003 recursion-006 recursion-007 recursion-008
recursion-009 recursion-012 conditionals-001 conditionals-003 conditionals-005 conditionals-006
conditionals-009 conditionals-010 conditionals-011 conditionals-013 conditionals-019 loops-001
loops-002 loops-003 loops-004 loops-005 loops-007 loops-008 loops-009 loops-011 loops-013 loops-014
loops-015 strings-005 strings-012 strings-015 strings-016 variables-operators-001
variables-operators-004 variables-operators-006 variables-operators-007 variables-operators-008
variables-operators-013 variables-operators-014
```

When converting:
- A question that only made sense because of a Python feature falls under Rule A and is deleted. For example, `range(1, n)` excluding `n`, or `//` vs `/`, unless it's rewritten as an explicit `div` question.
- Converted questions use `lang: 'pseudocode'`. Their checks must be re-computed in TypeScript, because the Python runner no longer applies.

**Rule C — Python allowed:** after conversion, Python may stay **only** in questions that are explicitly about reading basic Python (variables, `if/elif/else`, `while`, `for i in range(…)` with the range rule explained in the solution, `def` / `return`). Python must be **at most 20%** of the code questions in the Programming area. Everything else is pseudocode.

### 2.4 Rewrite long or scenario stems

Any remaining Foundation/Exam question with a stem over about 35 words (not counting code, tables and charts) is rewritten shorter. Over 300 characters now:

```
deductive-reasoning-010 deductive-reasoning-012 knights-knaves-009 ordering-puzzles-014
valid-conclusions-007 ml-basics-008 ml-basics-018 regression-gradient-descent-008
searching-sorting-007 searching-sorting-012 dicts-sets-010 dicts-sets-018 stacks-queues-012
```

Then check every stem above about 250 characters.

- **Scenario wrappers** around a plain concept come off. Example: the browser "Back button" stack question becomes "Which data structure removes the most recently added item first?"
- **Keep** scenarios where reading the context *is* the skill: data-interpretation charts and tables, conditional-probability wording, ML "which approach fits this problem" questions. Even then, trim them to the minimum.

### 2.5 Specific topic checks

| File | Check |
|---|---|
| `ctl/logic/knights-knaves` | Keep only two-person puzzles, plus very short three-person ones, that solve in under 90 s. |
| `ctl/logic/ordering-puzzles` | At most 4 people/items and 3–4 clues. Remove round-table and 6-person arrangements. |
| `math/calculus/partial-derivatives` | Keep only ∂f/∂x and ∂f/∂y of simple polynomials and the gradient of a simple squared-error loss. No directional derivatives or second partials. |
| `math/discrete/recurrence-relations` | Keep "compute the first few terms" and simple linear recurrences. No closed forms or counting-regions problems. |
| `math/functions/trig-equations` | Keep standard-angle equations on one interval. No sum-of-solutions or identity-heavy multi-step questions. |
| `math/matrices-vectors/*` | Make sure dimension-compatibility, product size, transpose, basic determinant/inverse of 2×2 and **symbolic rank** facts are all covered (section 3). |
| `prog/syntax/strings` | After Rule A this file will be nearly empty. Keep only language-neutral ideas: length, concatenation, character at a stated position (1-based in pseudocode), comparing strings, counting characters in a loop. |
| `prog/data-structures/lists-tuples` | The "tuples" part is Python-specific. Refocus on 1-based arrays in pseudocode: indexing, traversing, finding max/min, sum, swapping, shifting. Keep the file and subtopic IDs so progress isn't lost, but rename the display name to "Arrays and lists" in `syllabus.ts`. |
| `prog/py-functions/functions-scope` | Refocus on calling a function, parameters vs arguments, return values and local vs outer variables in pseudocode. Drop Python-only scope rules. |

---

## 3. Refilling the bank after the clean-up

After sections 2.1–2.5, every remaining subtopic must have at least:

- **15 static questions**
- **6 at Exam level**
- **5 at Foundation level**

The mastery rule needs 3 right answers at Exam level, so these minimums matter. Write new questions to the section 1 style until each subtopic meets them. **Priority question types** (add these even if the minimum is already met):

| File | Add |
|---|---|
| `math/matrices-vectors/matrix-operations.ts` | "Which product is (not) defined?" with dimension-only options. Size of AB from dimensions. A case where BA is defined but AB isn't. Which of AᵀA, AAᵀ, A², A + Aᵀ is defined for a non-square A, with exactly one correct option. |
| `math/matrices-vectors/rank-eigen.ts` | Symbolic rank: AB = Iₘ for A m × n and B n × m ⇒ r(A) = r(B) = m; maximum rank of a p × q matrix; r(AB) ≤ min(r(A), r(B)); square n × n with rank n ⇔ invertible ⇔ det ≠ 0; can a 4 × 6 matrix have independent columns. Use "unit matrix of order m" and `r(X)` wording in at least two, with symbolic options such as `r(A) = m, r(B) = n`. |
| `math/algebra/linear-equations.ts` | Slope from `ax + by = c`, including cases where it simplifies to a whole number (e.g. 4x − 4y = 9 → slope 1). y-intercept from standard form. Parallel to a given line. Perpendicular to a given line. Distractors: sign error (a/b), b/a, c/b, and 0. |
| `prog/data-structures/stacks-queues.ts` | Bare definition questions: stack principle, queue principle, what pop/dequeue removes, where push/enqueue adds. **Include one question whose options contain both LIFO and FILO wording**, and explain in the solution that "Last in first out" and "First in last out" describe the same behaviour, so if both appear, pick the standard name, LIFO. |
| `prog/algorithms/tracing-pseudocode.ts` | At least 8 traces in the section 1.3 dialect: `while (true)` + `break` with `mod` accumulators (vary start, step, modulus, and break on `<0` vs `<=0`); two where the correct answer is "Infinite loop"; one `for i = 1 to n`; one nested `if/else` inside a loop. |
| `prog/syntax/loops.ts` | "How many times does the loop body run?" in pseudocode. |
| Every subtopic | Make sure Foundation includes a few **pure recall/definition** questions (one line, four short options), since the target style has many of these. |

All new questions must use the existing data format (`src/types.ts`):

- 4 options and a `correctIndex`
- a full `markScheme`: a step-by-step `solution`, a `whyWrong` entry for each wrong option (`null` at the correct index, never mentioning letters), and a `keyIdea`
- an `AnswerCheck` that recomputes the answer in code, where neighbouring questions use one

Pseudocode traces get a TypeScript re-implementation of the loop, with an iteration cap that maps to "Infinite loop".

IDs continue each file's numbering. **Don't reuse deleted IDs** — saved progress may still reference them.

---

## 4. Generators

Apply the same rules to `src/generators/**`:

1. **Delete** the 4 challenge generators and the `rates-clocks` generators.
2. **Python generators** (in `boolean-logic`, `recursion`, `functions-scope`, `lists-tuples`, `strings`, `conditionals`, `loops`, `complexity`, `dicts-sets`, `variables-operators`):
   - Python-only behaviour → delete.
   - Language-neutral → output the pseudocode dialect instead.
3. **Add** these generators:
   - `pseudo-while-true-mod` in `prog/algorithms/tracing-pseudocode.ts`:
     - start 15–60, step 4–9, modulus 2–5, break on `<0` or `<=0`
     - about 15% of the time, a version that never breaks, with "Infinite loop" as the answer
     - distractors from one extra iteration, one missing iteration, the wrong break condition, and "Infinite loop"
     - the answer is computed by simulating the loop
   - `matrix-product-defined` in `math/matrices-vectors/matrix-operations.ts`: random dimensions; asks which product is not possible, or the size of the product.
   - `slope-standard-form` in `math/algebra/linear-equations.ts`: integer a, b, c with b ≠ 0, biased towards whole-number or simple-fraction slopes.
4. Every remaining generator must produce stems that follow section 1.1. Shorten any templated stem over about 35 words.

---

## 5. Lessons

- **Remove the optional Challenge offering** from every lesson and from `src/pages/Learn.tsx`.
- **Remove the `rates-clocks` lesson.**
- **`src/lessons/prog/**`:**
  - Rewrite worked examples and practice references that use Python-only features, so they match what the questions now test.
  - Add a short **"Exam pseudocode conventions"** box to `tracing-pseudocode`: `mod`, `div`, `while (true)` + `break`, `end if` / `end while` / `end for`, `//` comments, 1-based arrays, and "Infinite loop" as an option. Include one fully worked `while (true)`/`mod` trace with an iteration table.
- **`src/lessons/math/matrices-vectors/rank-eigen.ts`:** add the AB = Iₘ ⇒ r(A) = r(B) = m worked example. Add a common-trap line: picking n "because A has n columns".
- **`src/lessons/math/matrices-vectors/matrix-operations.ts`:** add the "inner dimensions must match; outer dimensions give the size" cue.
- **`src/lessons/prog/data-structures/stacks-queues.ts`:** add the LIFO = FILO note.
- **`src/lessons/math/algebra/linear-equations.ts`:** add a one-line method for the slope from `ax + by = c` (slope = −a/b).
- Don't restructure lessons beyond this.

---

## 6. Timers

| Mode | Timer |
|---|---|
| Topic practice | **None** |
| General questions feed | **None** |
| Mistakes review | **None** |
| Lesson steps (including "Exam level") | **None** |
| Mock exams (all formats) | **Countdown for the whole mock** (exists; restyled in 7.10) |

The per-question "Xs of 68s" pace counter is removed completely. It shouldn't be hidden behind a setting.

| File | Change |
|---|---|
| `src/components/QuestionSession.tsx` | Delete the `elapsed` state and its interval, the `started` ref if unused, `pace`, the `timerOn` selector, and the whole `{timerOn && <span className="pace">…}` block. The action bar shows only `Question N` / `Question N of M`. Change "Correct" feedback from `` `Answered in ${elapsed}s.` `` to `Nice — that's right.` Remove the `EXAM` import if it's now unused. |
| `src/store/progress.ts` | Remove `practiceTimer` from the type and the defaults. Ignore or delete the old key when loading. |
| `src/pages/Settings.tsx` | Remove the per-question timer checkbox. |
| `src/pages/Learn.tsx` | Exam-level description: remove "with the timer at the estimated exam pace". |
| `src/styles.css` | Remove `.pace` / `.pace.over`. |
| `src/config/exam.ts` | Keep `secondsPerQuestion`, which is only used to estimate mock question counts. Update the comment to say so. |

---

## 7. Exam-style screen design

### 7.1 Scope

- **Mock exams** (`src/pages/Mock.tsx`) use the full exam-style screen described in 7.2–7.14. Sitting a mock should feel like sitting the real exam.
- **The question block** (number, stem, code/chart/table, options, rule, Reset) is **one shared component** used in every mode: mocks, practice, feed, mistakes, lesson steps and the review screen after a mock. Students always read questions in the exam layout.
- **Practice-only parts:** Check button, feedback, hints and the mark scheme sit **below** the question block (7.12), in the site's normal style.
- **The rest of the site** (dashboard, Learn index, bank, settings, mock results summary) doesn't change.
- **No exam-vendor names or logos** anywhere.

### 7.2 Component structure

Create `src/components/exam/` with:

| Component | Responsibility |
|---|---|
| `ExamQuestion.tsx` | Number column, stem, bookmark, content (code/chart/table), `ExamOptions`, rule, Reset. Props: `number`, `q`, `selected`, `onSelect`, `onReset`, `marked`, `onToggleMark`, `mode: 'mock' \| 'practice' \| 'review'`, `reveal?: { correctIndex: number }`, `locked?: boolean` |
| `ExamOptions.tsx` | The option rows (7.6) |
| `ExamTopBar.tsx` | Top bar with the "Saved" indicator (7.4) |
| `ExamNavStrip.tsx` | Bottom tab strip, Submit tab, timer slot, label (7.9–7.11) |
| `BookmarkIcon.tsx` | Inline SVG, outline/filled |
| `exam.css` | All styles, imported once. Every rule is scoped under `.ex` so nothing leaks into the rest of the site |

`QuestionView.tsx` becomes a thin wrapper around `ExamQuestion` (or is replaced by it). Delete the old `.options` / `.option` styles and the `LETTERS` badges once nothing uses them.

**Feedback text:** `QuestionSession`'s "You chose B. The answer is C." has to change, because letters are gone. Use "The answer is: ‹option text›". If the option is long, show the first 60 characters with "…".

### 7.3 Page layout (mock)

```
┌───────────────────────────────────────────────────────────── top bar (44px) ──┐
│                                                                       Saved   │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   12   Stem text on one or two lines …                                  [🔖]  │
│        code / chart / table (if any)                                          │
│        ┌─────────────────────────────────────────────────────────────┐        │
│        │ ○  option 1                                                 │        │
│        ├─────────────────────────────────────────────────────────────┤        │
│        │ ○  option 2                                                 │        │
│        ├─────────────────────────────────────────────────────────────┤        │
│        │ ◉  option 3   ← selected row is blue                        │        │
│        ├─────────────────────────────────────────────────────────────┤        │
│        │ ○  option 4                                                 │        │
│        └─────────────────────────────────────────────────────────────┘        │
│        ───────────────────────────────────────────────────────────────        │
│        Reset                                                                  │
│                                                                               │
│                         (empty page below — question stays at the top)        │
│                                                                               │
├───────────────────────────────────────────────────────── bottom strip (64px) ─┤
│ Full-length mock  ‹ │▔1▔│▔2▔│ 3 │▔4▔│█12█│ 13 │ 14 │ … │ Submit │ ›   47:12  │
└───────────────────────────────────────────────────────────────────────────────┘
```

(The box lines only show the row structure. There's no outer border in the real design. `▔` = blue "answered" bar on top of a tab, `█12█` = current tab.)

- The page is `display: grid; grid-template-rows: 44px 1fr 64px; height: 100dvh;`. Only the middle area scrolls. The top bar and bottom strip never move.
- No cards, panels, shadows or rounded corners anywhere on the exam screen.
- The question is anchored to the **top** of the middle area, not centred vertically.

### 7.4 Top bar

- **Height:** 44px.
- **Background:** `--ex-bar`.
- **Border:** 1px bottom border `--ex-line`, edge to edge.
- **Left and centre:** empty.
- **Right:** "Saved" indicator. 13px, colour `--ex-muted`, 24px from the right edge, vertically centred.
  - It appears every time an answer is chosen, changed or reset, and every time a question is marked or unmarked.
  - It shows instantly (`opacity: 1`), stays 1.6 s, then fades over 300ms (`opacity: 0`). Each new save restarts the timer.
  - It has `aria-live="polite"`.

### 7.5 Question header row

- **Grid:** `grid-template-columns: 64px minmax(0, 1fr) 64px;`, top margin 40px.
- **Number column:** question number only (no "Question" word). **Bold 18px**, `--ex-text`, top-aligned with the first line of the stem (`padding-top: 1px`).
  - In practice modes, show the session's running number.
- **Stem column:** 17px, line-height 1.45, weight 400, `--ex-text`, max width 1100px.
  - Paragraph spacing inside the stem: 10px.
  - Bold and italic from the Rich-text subset still work.
- **Bookmark column:** `BookmarkIcon`, 16×20px, stroke 1.5px, `--ex-icon`, top-aligned with the stem.
  - Outline = not marked; filled `--ex-accent` = marked.
  - It's a `<button>` with `aria-pressed`, `aria-label="Mark for review"`, a 32×32px hit area and the tooltip "Mark for review".
  - The `F` shortcut toggles it.
  - **Practice modes:** this is the existing "Flag" feature, with the same store and the same Mistakes/Bank filters, just drawn as the bookmark icon.
- **Content column width:** the stem column plus the options are about 78% of viewport width, max 1100px, centred on the page with at least 24px either side.

### 7.6 Options

**Container:**
- 14px below the stem, or below the code/chart/table if present.
- Same left edge as the stem; width 100% of the stem column (max 1100px).
- No radius, no outer border.

**Row:**
- `min-height: 52px; padding: 13px 18px; display: flex; align-items: center; gap: 12px;`
- Background `--ex-row`.
- Separator: `border-top: 1px solid --ex-row-line` on every row except the first.
- The **whole row is clickable**. Cursor pointer.

**Radio circle:**
- 15px circle, `border: 1.5px solid --ex-radio`, white fill, `flex: none`.
- Built with a real `<input type="radio" name="q-{id}">` and `appearance: none`, so arrow-key behaviour inside the group comes for free.
- The label wraps the whole row.

**Option text:**
- 17px, `--ex-text`.
- Long text wraps; the circle stays aligned to the first line (`align-items: flex-start` when wrapped, with the circle offset 3px down).
- **Maths-only options** render at 1.15em (`.ex-opt-math`). Detect an option that is entirely `$…$`.

**No letters.** Don't render A–D anywhere on the option rows.

**States:**

| State | Row background | Radio | Text |
|---|---|---|---|
| Default | `--ex-row` | border `--ex-radio`, white fill | `--ex-text` |
| Hover (not locked) | `--ex-row-hover` | unchanged | unchanged |
| Keyboard focus | unchanged + `outline: 2px solid --ex-focus; outline-offset: -2px` | unchanged | unchanged |
| Selected | `--ex-row-selected` | border `--ex-accent-2`, 7px inner dot `--ex-accent-2` (`box-shadow: inset 0 0 0 3px #fff` on a filled circle) | unchanged |
| Practice: revealed correct | `--ex-ok-bg` | as selected if chosen, else default | unchanged, plus a ✓ (16px, `--ex-ok`) at the right end |
| Practice: revealed wrong pick | `--ex-bad-bg` | as selected | unchanged, plus a ✗ (16px, `--ex-bad`) at the right end |
| Locked (after Check, or in review) | no hover change | — | cursor default |

**Transitions:** background 80ms linear. No other animation.

**Shuffling:** keep the current per-attempt shuffle unless `fixedOrder`.

**Keyboard:**
- `1`–`4` and `A`–`D` still choose options (the letters just aren't shown).
- `Space`/`Enter` on a focused row selects it.
- Arrow keys move within the radio group.

### 7.7 Rule and Reset

- **Rule:** 16px below the options block, `border-top: 1px solid --ex-rule`, same width as the options.
- **Reset:** 10px below the rule. A `<button>` styled as a text link, 16px, colour `--ex-link`, no underline, underline on hover/focus.
  - Clicking it clears the selection for this question and triggers "Saved".
  - It's hidden in practice modes after Check, and always hidden in review.
  - Disabled-looking (`--ex-muted`, no hover) when nothing is selected, but still in the layout so nothing jumps.

### 7.8 Code, charts and tables inside the question

**Code (`CodeView` with a new `variant` prop):**
- `variant="exam"`:
  - Used for **all** code in mocks and for **pseudocode** everywhere.
  - Font `"Courier New", Courier, monospace`, 15px, line-height 1.55, `--ex-text`.
  - **No** background, border, radius, caption, line numbers or syntax highlighting.
  - `white-space: pre`; `overflow-x: auto` with no visible box.
  - Margin 10px above, 4px below. Left edge aligned with the stem.
  - `//` comments are the same colour as the code.
- `variant="study"`: the current highlighted, line-numbered look. Used only for **Python in practice modes** and inside mark-scheme traces.

**Charts / tables:**
- Keep `ChartView` / `TableView` but remove any card background.
- Max width 720px, 12px margin above.
- Tables use 1px `--ex-line` cell borders, 8px 12px cell padding, header row background `--ex-bar`, and 15px text.

### 7.9 Bottom navigation strip (mock)

**Container:**
- 64px tall, background `--ex-bar`, `border-top: 1px solid --ex-line`.
- `display: grid; grid-template-columns: auto auto 1fr auto auto; align-items: stretch;`
- Columns: label (7.11), left arrow, tab track, right arrow, timer (7.10).

**Tab track:**
- `display: flex; overflow-x: auto; scrollbar-width: none;` (also hide the WebKit scrollbar).
- Each tab:
  - `flex: 0 0 148px` (`72px` under 760px wide), full strip height
  - centred number, 17px, `--ex-muted`
  - `border-left: 1px solid --ex-line`
  - a `<button>` with an `aria-label` like "Question 7, answered, marked for review"

**Tab states:**

| State | Look |
|---|---|
| Unvisited / unanswered | Default |
| Answered | `box-shadow: inset 0 3px 0 --ex-accent` (3px blue bar along the top edge) |
| Marked | 9×11px filled bookmark in the top-right corner (6px in from the top and right), `--ex-accent` |
| Current | Background `--ex-accent`, number white and bold, `transform: translateY(-4px)`, plus a 4px tall extension of the same colour below (`::after`) so it still reaches the bottom edge, giving a raised-tab look. Overrides the answered bar. |
| Hover (non-current) | Background `--ex-row-hover` |

**Behaviour:**
- Clicking a tab jumps to that question.
- When the current question changes, run `scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })` on its tab.
- **Arrows:** `‹` and `›` buttons, 36px wide, 20px glyph, `--ex-muted`. They scroll the track by 80% of its width. Disabled (opacity 0.35) at the ends.
- **← / →** keys still move to the previous/next question. `Enter` moves to the next.

**Submit tab:**
- Last item in the track, same size as a question tab, text "Submit", 16px bold, `--ex-accent`.
- Disabled (`--ex-muted`, `cursor: not-allowed`, tooltip "Go through every question first") until the last question has been visited. Keep the current `canSubmit` rule.
- When enabled, it opens the submit dialog (7.13).

**Removed from the mock screen:**
- Back/Next buttons
- "N of N answered" text
- the navigator popover
- the keyboard-hint paragraph
- the mock title in the top bar

### 7.10 Timer (mock)

- **Position:** right end of the bottom strip, outside the tab track.
- **Size and spacing:** `min-width: 96px`, 24px right padding, a 1px `--ex-line` left border.
- **Text:**
  - bold 18px, `font-variant-numeric: tabular-nums`, `--ex-text`
  - `MM:SS`, or `H:MM:SS` from 60 minutes up
  - updates every 250ms, as now
- **Low time:** under 5 minutes the colour turns `--ex-low`. Under 1 minute it also pulses its opacity between 1 and 0.55 every second. Respect `prefers-reduced-motion`: no pulse.
- **Hide/show:** clicking the timer toggles it.
  - Hidden shows `––:––` in `--ex-muted`.
  - It can't be hidden under 5 minutes (as now).
  - It's a `<button>` with `aria-label="Time remaining 47 minutes 12 seconds. Click to hide."`.
  - Keep `role="timer"` on the text.
- **Logic:** unchanged. `startedAt + durationSec`, auto-submit at 0, resumes after reload.

### 7.11 Bottom-left label (mock)

- The mock's name (`rec.label`), 13px, `--ex-muted`, 20px left padding, vertically centred, `white-space: nowrap`.
- Hidden under 760px wide.
- Plain text only. No logo.

### 7.12 Practice-mode layout

Practice, feed, mistakes and lesson steps use the same page background and question block as mocks, but:

- **No exam top bar or bottom strip.** The site's normal top navigation stays.
- The question block sits on an `--ex-bg` page area that is full width under the site header, with the same centred column (7.5).
- **Below Reset, 28px gap, then the practice panel** in the site's normal styles (Inter font, theme colours):
  - **Before Check:** a row with `Question N of M` (muted, left), the Hint button, and the **Check** button (primary, right). The existing `action-bar` can stay as a sticky bottom bar on small screens.
  - **After Check:** feedback line ("Correct" / "Not quite — the answer is: ‹option text›"), then the existing mark scheme (solution, why each wrong option is wrong, key idea, lesson link), then **Next**.
- Option rows get the revealed-correct / revealed-wrong states (7.6) after Check.
- **Dark theme:** practice modes follow the site theme, so the `--ex-*` variables have dark values (7.14).

### 7.13 Submit dialog (mock)

- Centred modal, width 440px (90vw on mobile), background white, 1px `--ex-line` border, **no radius, no shadow except `0 0 0 100vmax rgba(0,0,0,.35)`** for the backdrop.
- Title: "Submit your answers?" (bold 18px).
- Body (15px):
  - "You have answered X of N questions."
  - If unanswered > 0: "There is no negative marking, so it's worth answering every question."
  - If marked > 0: "M questions are marked for review."
- **Buttons, right-aligned:**
  - "Go back": text-link style, `--ex-link`.
  - "Submit": solid `--ex-accent` background, white bold text, 10px 20px padding, no radius.
- Focus starts on "Go back". `Esc` closes. Focus stays inside the dialog while it's open.

### 7.14 Design tokens

Define these on `.ex` (light). For practice modes in dark theme, also define them on `[data-theme="dark"] .ex:not(.ex-mock)`. **Mocks always use the light values**, whatever the site theme (`.ex.ex-mock` doesn't get the dark override).

| Token | Light | Dark (practice only) | Used for |
|---|---|---|---|
| `--ex-bg` | `#f0f0f0` | `#17191d` | Page |
| `--ex-bar` | `#f7f7f7` | `#1d2025` | Top bar, bottom strip, table headers |
| `--ex-line` | `#d4d4d4` | `#30343b` | Bar borders, tab dividers, table borders |
| `--ex-text` | `#1f1f1f` | `#e6e7ea` | Main text |
| `--ex-muted` | `#6b6b6b` | `#9aa0aa` | Secondary text |
| `--ex-icon` | `#444444` | `#b8bdc6` | Bookmark outline |
| `--ex-row` | `#e9e9e9` | `#22262c` | Option rows |
| `--ex-row-hover` | `#e1e1e1` | `#292e35` | Row/tab hover |
| `--ex-row-line` | `#dadada` | `#2f343b` | Row separators |
| `--ex-row-selected` | `#b5c9e2` | `#2c3f5c` | Selected row |
| `--ex-radio` | `#5a5a5a` | `#8a909a` | Radio border |
| `--ex-accent` | `#2f5d8f` | `#5b8fd6` | Current tab, answered bar, marked icon, Submit |
| `--ex-accent-2` | `#2a56c6` | `#7aa6ff` | Selected radio |
| `--ex-rule` | `#8a8a8a` | `#4a4f57` | Rule under options |
| `--ex-link` | `#3b5f8a` | `#8fb3e8` | Reset, dialog links |
| `--ex-focus` | `#2a56c6` | `#7aa6ff` | Focus outline |
| `--ex-low` | `#b3261e` | — | Low-time timer |
| `--ex-ok` / `--ex-ok-bg` | `#2e7d32` / `#cfe8d4` | `#6fcf7a` / `#1f3a25` | Practice reveal: correct |
| `--ex-bad` / `--ex-bad-bg` | `#b3261e` / `#f1d0d0` | `#ff8a80` / `#3d2222` | Practice reveal: wrong |

**Typography on `.ex`:**
- `font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;`
- `-webkit-font-smoothing: antialiased;`
- `letter-spacing: 0;`

**KaTeX inside `.ex`:**
- `.ex .katex { font-size: 1.05em; }`
- `.ex .ex-opt-math .katex { font-size: 1.15em; }`

### 7.15 Spacing reference

| Gap | Value |
|---|---|
| Top bar → question row | 40px |
| Number column width | 64px |
| Stem → code/chart/table | 10px / 12px |
| Stem or content → options | 14px |
| Option row min-height / padding | 52px / 13px 18px |
| Radio → option text | 12px |
| Options → rule | 16px |
| Rule → Reset | 10px |
| Reset → practice panel | 28px |
| Bottom strip height | 64px |
| Tab width (desktop / mobile) | 148px / 72px |
| Current tab raise | 4px |

### 7.16 Responsive (under 760px)

- Content column: full width, 16px side padding.
- The number moves **above** the stem (`grid-template-columns: 1fr 40px`; number on its own row, 6px gap). The bookmark stays at the top right.
- Stem and options at 16px. Rows keep their 52px min-height.
- Bottom strip: label hidden; tabs 72px; arrows and timer stay; Submit stays in the track.
- Nothing overflows horizontally except the tab track and wide code blocks, which scroll inside themselves.

### 7.17 Accessibility

- Options are a real radio group with an accessible name ("Answer options for question N").
- Every icon button has an `aria-label`. Focus is always visible (`--ex-focus` outline).
- The "Saved" indicator and the practice feedback use `aria-live="polite"`.
- Colour is never the only signal: answered tabs also say "answered" in their label; revealed rows add ✓/✗.
- Text and background contrast is at least 4.5:1 for every token pair in 7.14. Check the muted text on `--ex-bar` and adjust slightly if needed.

### 7.18 Review after a mock

`/mock/results/:id` → review uses `ExamQuestion` with `mode="review"`:
- locked rows
- revealed correct/wrong colours
- the student's pick shown as selected
- the mark scheme underneath, as in practice

The results summary page itself stays in the site's normal style.

---

## 8. Config, progress data and app-wide clean-up

### 8.1 `src/config/exam.ts`

- `difficultyMix`: `{ foundation: 0.4, exam: 0.6 }`. Remove the `challenge` key once the type is narrowed. The comment should just say it's an estimate weighted towards one-step questions.
- `areaWeights`: **unchanged.**
- Mocks: programming code questions should be pseudocode by default. If `src/engine/select.ts` can prefer pseudocode without a redesign, have it do so; if not, skip this, because after section 2.3 the bank is mostly pseudocode anyway.
- `secondsPerQuestion`: comment update only (section 6).

### 8.2 Removing the Challenge tier from the app

| File | Change |
|---|---|
| `src/types.ts` | `Difficulty = 'foundation' \| 'exam'` |
| `src/components/QuestionView.tsx` | `DIFF_LABEL` without challenge |
| `src/pages/Practice.tsx` | Difficulty choices: Build up / Foundation / Exam / Mixed |
| `src/pages/Bank.tsx` | Remove the Challenge filter |
| `src/pages/Learn.tsx` | Remove the optional challenge questions |
| `src/engine/*`, `src/store/*` | Remove challenge handling |
| `src/styles.css` | Remove `.diff-challenge` |
| `tests/*` | Update any test that counts or expects challenge questions |
| `README.md` | Remove the 4 mentions of Challenge |

### 8.3 Saved progress

Students may have localStorage progress that references deleted question IDs, deleted generators, the `rates-clocks` subtopic, `practiceTimer`, or `difficulty: 'challenge'` filters.

On load:
- Silently drop mistakes, flags, attempts and mastery entries for question/generator IDs that no longer exist, and for removed subtopics.
- Reset a saved Practice difficulty of `challenge` to `mixed`.
- Ignore `practiceTimer`.
- Never throw, and never wipe the rest of the progress.
- Add a test that loads a progress object containing all of these and checks that it survives.

---

## 9. README and RESEARCH_NOTES

**README.md:**
- Update the question, generator and lesson counts (lessons = 65 after removing `rates-clocks`).
- Remove the practice-timer wording and all Challenge mentions.
- *Mock exams* row: add "laid out like the real exam screen: numbered tab strip, mark-for-review bookmark, Reset, timer bottom-right".
- *Every question has a full mark scheme*: unchanged.
- Replace `docs/screenshots/mock.png` and `practice.png` if you can take screenshots. If not, say so in the summary.

**RESEARCH_NOTES.md:**
- In "(e) How this changed the app", add one neutral bullet: *"Bank refocused on exam-level style: short one-sentence stems, more definition questions, pseudocode as the default code language, Python-specific trivia and the Challenge tier removed, Rates & clocks dropped as off-syllabus."*
- Don't add anything else.

**Commit messages:** commit `SPEC.md` and all changes. Keep the messages neutral, e.g. "Refocus question bank on exam-level style", "Exam-style mock screen", "Remove per-question practice timer".

---

## 10. Checks before finishing

1. `npm test` passes, including `tests/validate.ts` on every remaining and new question and generator.
2. `npm run build` passes with no TypeScript errors.
3. A script or test prints the per-subtopic counts and confirms the section 3 minimums (≥15 static, ≥6 Exam, ≥5 Foundation) for every subtopic.
4. A test confirms:
   - no static question has a stem over about 35 words (not counting code, tables and charts), except data-interpretation, conditional-probability and ML scenario questions, which have a hard limit of 60 words
   - no `difficulty: 'challenge'` remains
   - Python is ≤ 20% of Programming-area code questions
5. Run `npm run dev` and check by hand:
   - Practice, feed, mistakes and lessons: no timer anywhere; Settings has no timer option.
   - Mock screen matches section 7:
     - light grey page, no cards
     - bold number left, bookmark right
     - grey option rows, radio circles, no letters, blue selected row
     - grey rule, Reset
     - "Saved" flash top-right
     - bottom tab strip with raised dark-blue current tab, blue bars on answered tabs, bookmarks on marked tabs
     - Submit tab (disabled until the last question has been visited)
     - timer bottom-right, red under 5 minutes, hide/show by clicking
   - The mock stays light in dark theme; practice follows the theme.
   - Pseudocode is plain Courier everywhere; Python in practice keeps highlighting.
   - Countdown auto-submits at 0 and resumes after reload.
   - Layout works at 375px wide.
   - Old progress with deleted IDs, `rates-clocks`, `practiceTimer` and a `challenge` filter loads without errors.
6. Finish with a short summary:
   - questions deleted / converted / rewritten / added, per subtopic
   - generators deleted / converted / added
   - final totals
   - anything unsure
