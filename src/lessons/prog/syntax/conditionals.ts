import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'conditionals',
  know:
    '### True, False and comparisons\n\n' +
    'A **Boolean** is a value that is either `True` or `False` (capital letters in Python). You usually get one by **comparing** two values:\n\n' +
    '| Python | Meaning | Example | Result |\n' +
    '|---|---|---|---|\n' +
    '| `==` | equal to | `3 == 3` | `True` |\n' +
    '| `!=` | not equal to | `3 != 3` | `False` |\n' +
    '| `<` and `>` | strictly less / greater | `5 > 5` | `False` |\n' +
    '| `<=` and `>=` | less / greater **or equal** | `5 >= 5` | `True` |\n\n' +
    'Do not mix up `=` (store a value: `x = 5`) with `==` (ask a question: `x == 5`). An `if` always needs a question.\n\n' +
    'Strings compare **character by character** using character codes: digits come before uppercase letters, which come before lowercase letters. So `"Zebra" < "apple"` is True and `"10" < "9"` is True (the first characters 1 and 9 decide). Floats can carry tiny rounding errors: `0.1 + 0.2 == 0.3` is False, so compare floats with a tolerance such as `abs(a - b) < 1e-9`.\n\n' +
    '### Combining conditions: and, or, not\n\n' +
    '- `A and B` is True only if **both** are True.\n' +
    '- `A or B` is True if **at least one** is True.\n' +
    '- `not A` flips True and False.\n\n' +
    '**Order of operations** (strongest first): arithmetic such as `%`, then comparisons, then `not`, then `and`, then `or`. So `x > 0 or y > 0 and z > 0` means `x > 0 or (y > 0 and z > 0)`, and `not x == 5` means `not (x == 5)`. When in doubt, add brackets.\n\n' +
    'A classic bug: `if x == 1 or 2:` means `(x == 1) or 2`, and the lone `2` is always truthy, so the condition is always satisfied. Write `x == 1 or x == 2`.\n\n' +
    '### Truthiness: every value can act as a condition\n\n' +
    'You can write `if name:` or `if items:` without a comparison. Python then asks whether the value is **truthy** or **falsy**. The falsy values are:\n\n' +
    '- zero: `0`, `0.0`\n' +
    '- empty containers: `""`, `[]`, `{}`, `()`\n' +
    '- `None` and `False`\n\n' +
    'Everything else is truthy, including `"0"`, `" "` (a space), `"False"` and `[0]`, because they are not empty.\n\n' +
    '### Short-circuit evaluation\n\n' +
    'Python works through `and`/`or` **left to right and stops as soon as the answer is known**:\n\n' +
    '- `False and anything` is False, so the right side is skipped.\n' +
    '- `True or anything` is True, so the right side is skipped.\n\n' +
    'This protects risky code: `if a != 0 and b / a > 2:` never divides by zero. But swap the order and the division happens first and crashes. Also, `and`/`or` return **one of their operands**, not always True/False: `0 or 5` gives `5`, `3 and 0` gives `0`, `"" or "hi"` gives `"hi"`.\n\n' +
    '### Chained comparisons\n\n' +
    'Python lets you write `1 < x < 10`, meaning `1 < x and x < 10`. It is **not** `(1 < x) < 10` as in C or Java. So with `x = 7`, `8 < x < 10` is False and `3 < x == 7` is True.\n\n' +
    '### if / elif / else: order of checking\n\n' +
    'In a chain, Python tests the conditions **from the top down** and runs **only the first branch whose condition is True**. The `else` runs only if all of them are False. If conditions overlap, order matters:\n\n' +
    '| Order written | score = 95 gives |\n' +
    '|---|---|\n' +
    '| `>= 90` then `>= 70` then `>= 50` | A (correct) |\n' +
    '| `>= 50` then `>= 70` then `>= 90` | C (bug: 95 is caught by the first test) |\n\n' +
    'So test the **most restrictive** condition first. Separate `if` statements are different: each one is checked, so several can run.\n\n' +
    '### Nested conditions and one-line if\n\n' +
    'An `if` inside another `if` is only reached when the outer condition is True. **Indentation** shows which `else` belongs to which `if`. Once any branch of a chain runs, the rest of that chain is skipped.\n\n' +
    'Python also has a one-line form: `A if condition else B` gives A when the condition is True, otherwise B. These can be chained: `"neg" if n < 0 else "zero" if n == 0 else "pos"` works like if/elif/else.\n\n' +
    '### Pseudocode\n\n' +
    'Exam pseudocode writes the same ideas as `if ... then`, `else if`, `end if`, uses `AND`, `OR`, `NOT`, `MOD` for the remainder (like `%` in Python), and often `=` for comparison and `←` for assignment. The logic is exactly the same as in Python.',
  formulas: [
    {
      label: 'Chained comparison',
      tex: 'a < b < c \\;\\Longleftrightarrow\\; (a < b) \\text{ and } (b < c)',
      note: 'Python meaning of `a < b < c`; it is never `(a < b) < c`.',
    },
    {
      label: 'Precedence (strongest first)',
      tex: '\\text{arithmetic} \\;\\succ\\; \\text{comparisons} \\;\\succ\\; \\text{not} \\;\\succ\\; \\text{and} \\;\\succ\\; \\text{or}',
      note: 'So `not x == 5` is `not (x == 5)` and `A or B and C` is `A or (B and C)`.',
    },
    {
      label: 'De Morgan (and)',
      tex: '\\text{not}\\,(A \\text{ and } B) = (\\text{not } A) \\text{ or } (\\text{not } B)',
    },
    {
      label: 'De Morgan (or)',
      tex: '\\text{not}\\,(A \\text{ or } B) = (\\text{not } A) \\text{ and } (\\text{not } B)',
    },
    {
      label: 'Negating comparisons',
      tex: '\\text{not}\\,(x > a) \\iff x \\le a \\qquad \\text{not}\\,(x \\le a) \\iff x > a \\qquad \\text{not}\\,(x = a) \\iff x \\ne a',
      note: 'The opposite of `>` is `<=` (not `<`): the boundary value switches sides.',
    },
    {
      label: 'What and returns',
      tex: 'x \\text{ and } y = \\begin{cases} x & \\text{if } x \\text{ is falsy} \\\\ y & \\text{otherwise} \\end{cases}',
      note: 'If `x` is falsy, `y` is never evaluated (short-circuit).',
    },
    {
      label: 'What or returns',
      tex: 'x \\text{ or } y = \\begin{cases} x & \\text{if } x \\text{ is truthy} \\\\ y & \\text{otherwise} \\end{cases}',
      note: 'If `x` is truthy, `y` is never evaluated (short-circuit).',
    },
    {
      label: 'Falsy values',
      tex: '0,\\ 0.0,\\ \\text{empty string},\\ \\text{empty list / dict / tuple},\\ \\text{None},\\ \\text{False}',
      note: 'Everything else is truthy, including `"0"`, `" "` and `[0]`.',
    },
  ],
  examples: [
    {
      title: 'Reading an if/elif/else chain',
      problem: 'What does this print?\n\n```\nmark = 70\nif mark >= 80:\n    print("merit")\nelif mark >= 70:\n    print("pass+")\nelif mark >= 50:\n    print("pass")\nelse:\n    print("fail")\n```',
      steps: [
        'Test `mark >= 80`: `70 >= 80` is False, so move on.',
        'Test `mark >= 70`: `70 >= 70` is True (the boundary counts with `>=`), so print `pass+`.',
        'Stop: the remaining `elif` and `else` are skipped, even though `70 >= 50` is also True.',
      ],
      answer: '`pass+`',
    },
    {
      title: 'Truthiness and what or/and return',
      problem: 'What does `print([] or "empty", 0 and 1/0)` print?',
      steps: [
        '`[] or "empty"`: the empty list is falsy, so `or` returns its right operand, `"empty"`.',
        '`0 and 1/0`: `0` is falsy, so `and` returns `0` straight away and never evaluates `1/0` (short-circuit), so there is no error.',
        '`print` shows the two values separated by a space, strings without quotes.',
      ],
      answer: '`empty 0`',
    },
    {
      title: 'Chained comparison vs C-style reading',
      problem: 'With `x = 2`, what is the value of `5 < x < 10` in Python?',
      steps: [
        'Python reads it as `5 < x and x < 10`.',
        '`5 < 2` is False, so the whole `and` is False (and `x < 10` is not even checked).',
        'Compare the C-style reading `(5 < x) < 10`: that would be `False < 10`, i.e. `0 < 10`, which is True. That is the trap answer.',
      ],
      answer: '`False`',
    },
    {
      title: 'Exam level: precedence and short-circuit together',
      problem: 'For how many n in `[4, 9, 12, 15, 20]` is `n % 3 == 0 or n > 10 and n % 2 == 0` True?',
      steps: [
        '`and` binds before `or`, so the condition is `n % 3 == 0 or (n > 10 and n % 2 == 0)`.',
        'n = 4: `4 % 3 == 0` False; `4 > 10` False, so the bracket is False. Result False.',
        'n = 9: `9 % 3 == 0` True, so `or` stops. Result True.',
        'n = 12: `12 % 3 == 0` True. Result True.',
        'n = 15: `15 % 3 == 0` True. Result True.',
        'n = 20: `20 % 3 == 0` False; `20 > 10` True and `20 % 2 == 0` True, so the bracket is True. Result True.',
        'Count the Trues: 9, 12, 15, 20.',
      ],
      answer: '4 values',
    },
  ],
  traps: [
    'Thinking several branches of an if/elif chain can run. Only the first true branch runs; the `else` runs only when everything above it is False.',
    'Putting overlapping conditions in the wrong order (for example `>= 50` before `>= 90`), so the later, more specific branches can never be reached.',
    'Writing `if x == 1 or 2:`. It means `(x == 1) or 2`, which is always truthy. Write `x == 1 or x == 2` or `x in (1, 2)`.',
    'Believing `"0"`, `" "`, `"False"` or `[0]` are falsy. Only zero, empty containers, `None` and `False` are falsy.',
    'Forgetting short-circuiting: in `a != 0 and b / a > 2` the division is skipped when `a` is 0, but in `b / a > 2 and a != 0` it crashes with `ZeroDivisionError`.',
    'Negating `x > 3` as `x < 3` (it is `x <= 3`), or negating `A and B` without changing `and` to `or` (De Morgan).',
  ],
  examTip:
    'These questions are usually "what does this code print?" with four outputs. Trace it on paper: write the variable values, then test each condition **in order**, writing T or F next to it. Fast eliminations:\n\n' +
    '- An option showing **two or more** words from one if/elif chain is wrong (only one branch runs), unless the code uses separate `if`s.\n' +
    '- Check the **boundary** first: if a variable equals a threshold, `>` vs `>=` usually decides between two options.\n' +
    '- If an option is "an error is raised", look for a division by zero or a bad operation that short-circuiting might (or might not) skip; remember operands are evaluated left to right.\n' +
    '- For `and`/`or` printing values, remember they return an **operand**, so options showing only True/False may be traps.\n' +
    '- For "which condition is equivalent", plug a boundary value (such as x = 3 for `x > 3`) into each option; it kills the `<` vs `<=` and `and` vs `or` traps in seconds.',
};
