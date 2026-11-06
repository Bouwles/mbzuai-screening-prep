import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'conditionals',
  simple:
    'A **condition** is a yes/no question the computer asks, such as "is the temperature above 30?". The answer is `true` or `false`. An `if` statement is like a fork in a road: the indented lines under it run only when the answer is `true`, and the lines under `else` run when it is `false`. Inside an `else` you can ask another question, so the computer works down from the top and takes the **first** road whose answer is yes.',
  methods: [
    { cue: 'A chain of `if` and `else`, and "what is printed?"', method: 'Test the conditions from the top down and stop at the **first** true one; only that branch runs. Watch for `>` versus `>=` when the value sits exactly on a boundary.' },
    { cue: 'A condition joining tests with `and`, `or`, `not`', method: 'Use the order comparisons, then `not`, then `and`, then `or`. So `a or b and c` means `a or (b and c)`.' },
    { cue: 'Counting how many items in an array pass a condition', method: 'Make a table with one row per item and one column per part of the condition, then count the rows where the whole condition is true.' },
    { cue: 'Two separate `if` statements, one after the other', method: 'Both are checked. If the first one changes a variable, the second one sees the new value.' },
    { cue: 'An `if` inside a loop', method: 'Trace one row per pass and choose the branch using the current value. Check that the variable can still change on every pass, otherwise the loop may never end.' },
    { cue: 'Asked which condition is **equivalent** to `not (A and B)` or `not (A or B)`', method: 'De Morgan: negate each part and swap `and` with `or`. The opposite of `>` is `<=`, and of `<` is `>=`.' },
    { cue: 'The code is labelled Python', method: 'Read `elif` as "else if", and the indented block after a colon as the body. Python writes the values as `True` and `False`.' },
  ],
  know:
    '### True, false and comparisons\n\n' +
    'A **Boolean** is a value that is either `true` or `false`. You usually get one by **comparing** two values:\n\n' +
    '| Operator | Meaning | Example | Result |\n' +
    '|---|---|---|---|\n' +
    '| `==` | equal to | `3 == 3` | `true` |\n' +
    '| `!=` | not equal to | `3 != 3` | `false` |\n' +
    '| `<` and `>` | strictly less / greater | `5 > 5` | `false` |\n' +
    '| `<=` and `>=` | less / greater **or equal** | `5 >= 5` | `true` |\n\n' +
    'Do not mix up `=` (store a value: `x = 5`) with `==` (ask a question: `x == 5`). An `if` always needs a question.\n\n' +
    '### Combining conditions: and, or, not\n\n' +
    '- `A and B` is true only if **both** are true.\n' +
    '- `A or B` is true if **at least one** is true. It is false only when both are false.\n' +
    '- `not A` flips true and false.\n\n' +
    '**Order of operations** (strongest first): arithmetic and `mod`, then comparisons, then `not`, then `and`, then `or`. So `x > 0 or y > 0 and z > 0` means `x > 0 or (y > 0 and z > 0)`, and `not x == 5` means `not (x == 5)`. When in doubt, add brackets.\n\n' +
    'To test whether `x` is 1 or 2, write each comparison in full: `x == 1 or x == 2`. To test whether `x` lies between two values, join two comparisons: `x > 1 and x < 10`.\n\n' +
    '**Exclusive or** means one or the other but not both, which is `(p or q) and not (p and q)`.\n\n' +
    '### if and else: order of checking\n\n' +
    'An `if` runs its block when the condition is true. An `else` block runs when it is false, so exactly one of the two runs. There is no separate "else if" in the pseudocode: put another `if` inside the `else`, as in the example below.\n\n' +
    '```pseudocode\nif score >= 90\n   print("top")\nelse\n   if score >= 50\n      print("pass")\n   else\n      print("fail")\n   end if\nend if\n```\n\n' +
    'Tests run **from the top down**, and only the first true branch runs. If conditions overlap, order matters:\n\n' +
    '| Order written | score = 95 gives |\n' +
    '|---|---|\n' +
    '| `>= 90` then `>= 70` then `>= 50` | the top band (correct) |\n' +
    '| `>= 50` then `>= 70` then `>= 90` | the lowest passing band (bug: 95 is caught by the first test) |\n\n' +
    'So test the **most restrictive** condition first. Separate `if` statements are different: each one is checked, so several can run.\n\n' +
    '### Nested conditions\n\n' +
    'An `if` inside another `if` is only reached when the outer condition is true. **Indentation** and the `end if` lines show which `else` belongs to which `if`. Once an outer branch is chosen, the other outer branch is skipped.\n\n' +
    '### Reading the same ideas in Python\n\n' +
    'Some questions use short pieces of Python, and the stem says so. Python ends the condition line with a colon and uses indentation instead of `end if`. It writes "else if" as one word, `elif`, and the logic is the same: only the first true branch of a chain runs. It also writes the two Boolean values with capitals: `True` and `False`.',
  formulas: [
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
      label: 'Exclusive or',
      tex: '(p \\text{ or } q) \\text{ and not } (p \\text{ and } q)',
      note: 'True when exactly one of $p$ and $q$ is true.',
    },
  ],
  examples: [
    {
      title: 'Reading a chain of if and else',
      problem: 'What does this print?\n\n```pseudocode\nmark = 70\nif mark >= 80\n   print("merit")\nelse\n   if mark >= 70\n      print("credit")\n   else\n      print("fail")\n   end if\nend if\n```',
      steps: [
        'Test `mark >= 80`: `70 >= 80` is false, so go to the `else`.',
        'Test `mark >= 70`: `70 >= 70` is true (the boundary counts with `>=`), so print `credit`.',
        'The inner `else` is skipped.',
      ],
      answer: '`credit`',
    },
    {
      title: 'The same logic in Python',
      problem: 'What does this Python code print?\n\n```python\nn = 12\nif n % 2 == 1:\n    print("odd")\nelif n > 10:\n    print("big even")\nelse:\n    print("small even")\n```',
      steps: [
        '`%` is the remainder, and `12 % 2` is 0, so the first test is False.',
        '`12 > 10` is True, so `big even` is printed.',
        'The `else` is skipped, because a branch of the chain has already run.',
      ],
      answer: '`big even`',
    },
    {
      title: 'Using not and or together',
      problem: 'With `x = 5` and `y = 2`, what is the value of `not x > 3 or y == 2`?',
      steps: [
        'Comparisons come first: `x > 3` is true and `y == 2` is true.',
        '`not` comes next: `not true` is false.',
        '`or` comes last: `false or true` is true.',
      ],
      answer: '`true`',
    },
    {
      title: 'Exam level: precedence over an array',
      problem: 'For how many `n` in the array `[4, 9, 12, 15, 20]` is `mod(n,3) == 0 or n > 10 and mod(n,2) == 0` true?',
      steps: [
        '`and` is done before `or`, so the condition is `mod(n,3) == 0 or (n > 10 and mod(n,2) == 0)`.',
        'n = 4: not a multiple of 3, and `4 > 10` is false, so the bracket is false. Result false.',
        'n = 9: a multiple of 3. Result true.',
        'n = 12: a multiple of 3. Result true.',
        'n = 15: a multiple of 3. Result true.',
        'n = 20: not a multiple of 3, but `20 > 10` is true and 20 is even, so the bracket is true. Result true.',
        'Count the true results: 9, 12, 15, 20.',
      ],
      answer: '4 values',
    },
  ],
  traps: [
    'Thinking several branches of a chain can run. Only the first true branch runs, and the final `else` runs only when everything above it is false.',
    'Putting overlapping conditions in the wrong order (for example `>= 50` before `>= 90`), so the later, more specific branches can never be reached.',
    'Treating two separate `if` statements as one chain. Each `end if` closes its own statement, so the second test still runs.',
    'Using an old value in a later test. If an earlier line changed `x`, the next `if` sees the new value.',
    'Working `a or b and c` from left to right. `and` is done first, so it means `a or (b and c)`.',
    'Negating `x > 3` as `x < 3` (it is `x <= 3`), or negating `A and B` without changing `and` to `or` (De Morgan).',
  ],
  examTip:
    'These questions are usually "what does this code print?" with four outputs. Trace it on paper: write the variable values, then test each condition **in order**, writing T or F next to it. Fast eliminations:\n\n' +
    '- An option showing **two or more** words from one chain is wrong (only one branch runs), unless the code uses separate `if` statements.\n' +
    '- Check the **boundary** first: if a variable equals a threshold, `>` vs `>=` usually decides between two options.\n' +
    '- If an option is "Infinite loop", check whether the variable in the loop condition changes on every branch.\n' +
    '- For "which condition is equivalent", plug a boundary value (such as x = 3 for `x > 3`) into each option; it removes the `<` vs `<=` and `and` vs `or` traps in seconds.',
};
