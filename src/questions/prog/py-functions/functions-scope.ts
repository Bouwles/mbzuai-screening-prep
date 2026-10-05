import type { StaticQuestion } from '../../../types';

/** Join source lines into one code string. */
const src = (...lines: string[]) => lines.join('\n');

export const questions: StaticQuestion[] = [
  {
    id: 'py-func-001',
    subtopic: 'functions-scope',
    difficulty: 'challenge',
    stem: 'What does this Python code print? (Each line of output is shown separated by a space.)',
    code: {
      lang: 'python',
      source: 'def add_item(x, bag=[]):\n    bag.append(x)\n    return bag\n\nprint(add_item(1))\nprint(add_item(2))\nprint(add_item(3, []))',
    },
    options: ['`[1] [1, 2] [3]`', '`[1] [2] [3]`', '`[1] [1, 2] [1, 2, 3]`', '`[1] [1, 2] [3, 1, 2]`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The default list `bag=[]` is created **once**, when the function is defined, and reused by every call that does not pass its own list.\n\n' +
        '1. `add_item(1)`: default list is `[]`, append 1, it becomes `[1]`. Prints `[1]`.\n' +
        '2. `add_item(2)`: the **same** default list `[1]`, append 2, it becomes `[1, 2]`. Prints `[1, 2]`.\n' +
        '3. `add_item(3, [])`: a brand-new empty list is passed in, append 3. Prints `[3]`. The default list is untouched.\n\n' +
        'Output: `[1] [1, 2] [3]`.',
      whyWrong: [
        null,
        'This assumes a fresh empty list is made on every call. In Python the default value is evaluated only once, so the second call still sees the 1.',
        'This forgets that the third call passes its own new list `[]`, so it does not use the shared default list.',
        'This mixes the new list and the default list together; they are two separate list objects.',
      ],
      keyIdea: 'Mutable default arguments are created once at definition time and shared between calls, unless the caller passes their own object.',
    },
    python: { stdout: '[1]\n[1, 2]\n[3]\n' },
  },

  // ---------------------------------------------------------------- foundation
  {
    id: 'functions-scope-001',
    subtopic: 'functions-scope',
    difficulty: 'foundation',
    stem: 'What does this Python code print? (Each line of output is shown separated by a space.)',
    code: {
      lang: 'python',
      source: src('def f(x):', '    print(x * 2)', '', 'result = f(5)', 'print(result)'),
    },
    options: ['`10 10`', '`None`', '`10 None`', '`10`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Line by line:\n\n' +
        '1. `result = f(5)` calls `f` with `x = 5`. Inside, `print(x * 2)` **displays** `10` on the screen.\n' +
        '2. `f` has no `return` statement, so when its body ends it gives back the special value `None`. So `result = None`.\n' +
        '3. `print(result)` displays `None`.\n\n' +
        'The two lines of output are `10` and `None`, so the answer is `10 None`.\n\n' +
        '`print` only shows a value to the human; it does not hand the value back to the code that called the function. Only `return` does that.',
      whyWrong: [
        'This assumes `print(x * 2)` also hands 10 back to the caller, so `result` would be 10 and the last line would print 10 again. But `print` only displays; `f` has no `return`, so `result` is `None`.',
        'This forgets that calling `f(5)` still runs the `print(x * 2)` inside it, which displays 10 before anything else.',
        null,
        'This forgets the second `print(result)`, which displays the word `None` (printing `None` is not the same as printing nothing).',
      ],
      keyIdea: '`print` displays a value but the function still returns `None` unless it has a `return` statement.',
    },
    python: { stdout: '10\nNone\n' },
  },
  {
    id: 'functions-scope-002',
    subtopic: 'functions-scope',
    difficulty: 'foundation',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: src('def describe(name, age):', '    print(name, "is", age)', '', 'describe(age=17, name="Sara")'),
    },
    options: ['`17 is Sara`', '`Sara is 17`', 'A `TypeError` is raised because the arguments are given in the wrong order', '`name is age`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The call uses **keyword arguments**: `age=17` and `name="Sara"`. With keyword arguments Python matches each value to the parameter **by name**, so the order in the call does not matter.\n\n' +
        '- `name` gets `"Sara"`\n' +
        '- `age` gets `17`\n\n' +
        'Then `print(name, "is", age)` prints the three values separated by spaces: `Sara is 17`.',
      whyWrong: [
        'This matches the values by position (first value to the first parameter). Keyword arguments are matched by name, not by position.',
        null,
        'Keyword arguments may be given in any order; an error only happens if a parameter is missing or gets two values.',
        'This prints the parameter names instead of their values. `name` and `age` are variables, so their values are printed.',
      ],
      keyIdea: 'Keyword arguments (`param=value`) are matched to parameters by name, so their order in the call does not matter.',
    },
    python: { stdout: 'Sara is 17\n' },
  },
  {
    id: 'functions-scope-003',
    subtopic: 'functions-scope',
    difficulty: 'foundation',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: src('def power(base, exp=2):', '    return base ** exp', '', 'print(power(3), power(2, 3))'),
    },
    options: ['`9 9`', '`6 6`', '`9 6`', '`9 8`'],
    correctIndex: 3,
    markScheme: {
      solution:
        '`exp=2` is a **default argument**: it is used only when the caller does not give a value for `exp`. In Python `**` means "to the power of".\n\n' +
        '1. `power(3)`: only `base` is given, so `base = 3` and `exp = 2` (the default). $3^2 = 9$.\n' +
        '2. `power(2, 3)`: both are given by position, so `base = 2`, `exp = 3`. The default is ignored. $2^3 = 8$.\n\n' +
        '`print` shows both values separated by a space: `9 8`.',
      whyWrong: [
        'This swaps the arguments in the second call, working out $3^2$. Positional arguments fill the parameters left to right, so `base = 2` and `exp = 3`.',
        'This reads `**` as multiplication: $3 \\times 2 = 6$ and $2 \\times 3 = 6$. In Python `**` is the power operator.',
        'The first call is right, but the second treats `**` as multiplication ($2 \\times 3 = 6$) instead of $2^3 = 8$.',
        null,
      ],
      keyIdea: 'A default argument is used only when the caller leaves that parameter out; a value passed in always replaces it.',
    },
    check: {
      optionValues: ['9 9', '6 6', '9 6', '9 8'],
      compute: () => {
        const power = (base: number, exp = 2) => base ** exp;
        return `${power(3)} ${power(2, 3)}`;
      },
    },
    python: { stdout: '9 8\n' },
  },
  {
    id: 'functions-scope-004',
    subtopic: 'functions-scope',
    difficulty: 'foundation',
    stem: 'A Python function finishes running its body without ever reaching a `return` statement. What does the function call evaluate to?',
    options: [
      '`0`',
      'The value of the last line that ran inside the function',
      '`None`',
      'Nothing: Python raises an error, because every function must return a value',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'Every Python function call gives back **some** value. If the body ends without a `return` (or with a bare `return` that has no value), Python returns the special value `None`, which means "no value".\n\n' +
        'Example:\n\n' +
        '```python\ndef greet():\n    print("hi")\n\nx = greet()   # prints hi\nprint(x)      # prints None\n```\n\n' +
        'So the call evaluates to `None`.',
      whyWrong: [
        '`0` is a number. Python does not invent a number; a missing `return` gives `None`, which is a different value from `0`.',
        'Some other languages (such as Ruby) automatically return the last value worked out, but Python does not: a Python function only hands back a value through `return`. Without one, it returns `None`.',
        null,
        'Functions without `return` are completely legal in Python (for example, functions that only print). No error is raised; they return `None`.',
      ],
      keyIdea: 'A Python function with no `return` (or a bare `return`) returns `None`.',
    },
  },
  {
    id: 'functions-scope-005',
    subtopic: 'functions-scope',
    difficulty: 'foundation',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: src('square = lambda x: x * x', 'print(square(4) + square(1))'),
    },
    options: ['`17`', '`25`', '`10`', '`5`'],
    correctIndex: 0,
    markScheme: {
      solution:
        '`lambda x: x * x` is a small **anonymous function**: it takes one argument `x` and returns `x * x`. Storing it in `square` is the same as writing\n\n' +
        '```python\ndef square(x):\n    return x * x\n```\n\n' +
        'Now evaluate each call separately, then add:\n\n' +
        '1. `square(4)` returns $4 \\times 4 = 16$.\n' +
        '2. `square(1)` returns $1 \\times 1 = 1$.\n' +
        '3. $16 + 1 = 17$.\n\n' +
        'Output: `17`.',
      whyWrong: [
        null,
        'This adds first and squares afterwards: $(4 + 1)^2 = 25$. Each call is evaluated on its own first, then the two results are added.',
        'This reads `x * x` as `x * 2` (doubling): $8 + 2 = 10$.',
        'This forgets that the lambda does anything and just adds the arguments: $4 + 1 = 5$.',
      ],
      keyIdea: '`lambda args: expression` is a one-line function that returns the value of the expression.',
    },
    check: {
      optionValues: [17, 25, 10, 5],
      compute: () => {
        const square = (x: number) => x * x;
        return square(4) + square(1);
      },
    },
    python: { stdout: '17\n' },
  },

  // ---------------------------------------------------------------- exam
  {
    id: 'functions-scope-006',
    subtopic: 'functions-scope',
    difficulty: 'exam',
    stem: 'What does this Python code print? (Each line of output is shown separated by a space.)',
    code: {
      lang: 'python',
      source: src('x = 10', '', 'def change():', '    x = 5', '    print(x)', '', 'change()', 'print(x)'),
    },
    options: ['`5 5`', '`5 10`', '`10 10`', '`10 5`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'There are **two different** variables called `x` here.\n\n' +
        '| Line | What happens | global `x` | local `x` (inside `change`) |\n' +
        '| --- | --- | --- | --- |\n' +
        '| `x = 10` | creates a global variable | 10 | - |\n' +
        '| `change()` runs `x = 5` | assigning inside a function creates a **new local** `x` | 10 | 5 |\n' +
        '| `print(x)` inside | uses the local `x` | 10 | 5 |\n' +
        '| function ends | the local `x` disappears | 10 | - |\n' +
        '| `print(x)` outside | uses the global `x` | 10 | - |\n\n' +
        'Output lines: `5` then `10`, so the answer is `5 10`.',
      whyWrong: [
        'This assumes `x = 5` inside the function changes the global `x`. Without the `global` keyword, assignment inside a function creates a separate local variable.',
        null,
        'This assumes the `print(x)` inside the function sees the global `x`. But the function has just made its own local `x = 5`, and the local one is used first.',
        'This has the two lines the wrong way round: the function prints its local 5 first, and the global `x` (still 10) is printed last.',
      ],
      keyIdea: 'Assigning to a name inside a function creates a local variable that hides the global one; the global is unchanged.',
    },
    python: { stdout: '5\n10\n' },
  },
  {
    id: 'functions-scope-007',
    subtopic: 'functions-scope',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: src(
        'count = 0',
        '',
        'def add(n):',
        '    global count',
        '    count = count + n',
        '    return count',
        '',
        'add(3)',
        'add(4)',
        'print(count)',
      ),
    },
    options: ['`0`', '`4`', '`3 7 7`', '`7`'],
    correctIndex: 3,
    markScheme: {
      solution:
        '`global count` tells Python that `count` inside `add` **is** the global variable, so changes made inside the function stay after it ends.\n\n' +
        '| Step | `n` | global `count` |\n' +
        '| --- | --- | --- |\n' +
        '| start | - | 0 |\n' +
        '| `add(3)` | 3 | $0 + 3 = 3$ |\n' +
        '| `add(4)` | 4 | $3 + 4 = 7$ |\n\n' +
        'The two calls return 3 and 7, but those return values are not printed (they are not stored or passed to `print`). Only the final `print(count)` produces output: `7`.',
      whyWrong: [
        'This ignores the `global count` line and treats `count` inside the function as local. With `global`, the function really changes the global variable.',
        'This assumes each call starts again from 0, so only the last call (adding 4) counts. The global `count` keeps its value between calls.',
        'This assumes the values returned by `add(3)` and `add(4)` are displayed. A returned value is only shown if you `print` it; here the calls are on lines of their own, so nothing is printed for them.',
        null,
      ],
      keyIdea: 'With `global name`, assignments inside the function change the global variable, and the change persists across calls.',
    },
    check: {
      optionValues: [0, 4, '3 7 7', 7],
      compute: () => {
        let count = 0;
        const add = (n: number) => {
          count = count + n;
          return count;
        };
        add(3);
        add(4);
        return count;
      },
    },
    python: { stdout: '7\n' },
  },
  {
    id: 'functions-scope-008',
    subtopic: 'functions-scope',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: src(
        'nums = [1, 2, 3, 4, 5, 6]',
        'result = list(map(lambda x: x * 10, filter(lambda x: x % 2 == 0, nums)))',
        'print(result)',
      ),
    },
    options: ['`[20, 40, 60]`', '`[10, 30, 50]`', '`[10, 20, 30, 40, 50, 60]`', '`[2, 4, 6]`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Work from the **inside out**.\n\n' +
        '1. `filter(lambda x: x % 2 == 0, nums)` keeps the items for which the function returns `True`. `x % 2 == 0` is `True` for even numbers, so it keeps `2, 4, 6`.\n' +
        '2. `map(lambda x: x * 10, ...)` applies the function to every remaining item: $2 \\times 10 = 20$, $4 \\times 10 = 40$, $6 \\times 10 = 60$.\n' +
        '3. `list(...)` turns the result into a list so it can be printed.\n\n' +
        'Output: `[20, 40, 60]`.',
      whyWrong: [
        null,
        'This keeps the odd numbers, as if `filter` **removed** the items where the condition is `True`. `filter` keeps the items where the condition is `True`.',
        'This ignores the `filter` step and multiplies every number by 10.',
        'This does the filtering but forgets the `map` step that multiplies each kept number by 10.',
      ],
      keyIdea: '`filter(f, xs)` keeps the items where `f` returns `True`; `map(f, xs)` applies `f` to every item.',
    },
    python: { stdout: '[20, 40, 60]\n' },
  },
  {
    id: 'functions-scope-009',
    subtopic: 'functions-scope',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: src('words = ["kiwi", "fig", "banana", "apple"]', 'print(sorted(words, key=len))'),
    },
    options: [
      "`['apple', 'banana', 'fig', 'kiwi']`",
      "`['banana', 'apple', 'kiwi', 'fig']`",
      "`['fig', 'kiwi', 'apple', 'banana']`",
      '`[3, 4, 5, 6]`',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        '`key=len` tells `sorted` to compare the words by `len(word)` instead of alphabetically. The key is only used for **comparing**; the list still contains the original words.\n\n' +
        '| word | `len(word)` |\n' +
        '| --- | --- |\n' +
        '| kiwi | 4 |\n' +
        '| fig | 3 |\n' +
        '| banana | 6 |\n' +
        '| apple | 5 |\n\n' +
        'Sorting by length from smallest to largest (the default order): fig (3), kiwi (4), apple (5), banana (6).\n\n' +
        "Output: `['fig', 'kiwi', 'apple', 'banana']`.",
      whyWrong: [
        'This is plain alphabetical order, which is what `sorted(words)` would give without `key=len`.',
        'This sorts by length from **longest** to shortest. That needs `reverse=True`; the default order is smallest key first.',
        null,
        'This returns the key values (the lengths) instead of the words. The key is only used to decide the order; the words themselves are returned.',
      ],
      keyIdea: '`sorted(xs, key=f)` orders the items by `f(item)` (smallest first) but returns the original items.',
    },
    python: { stdout: "['fig', 'kiwi', 'apple', 'banana']\n" },
  },
  {
    id: 'functions-scope-010',
    subtopic: 'functions-scope',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: src(
        'def double(x):',
        '    return 2 * x',
        '',
        'def apply_twice(f, x):',
        '    return f(f(x))',
        '',
        'print(apply_twice(double, 3))',
      ),
    },
    options: ['`6`', '`12`', '`36`', 'An error is raised, because a function cannot be passed as an argument to another function'],
    correctIndex: 1,
    markScheme: {
      solution:
        'In Python a function is a value like any other, so it can be passed as an argument. Note that `double` is passed **without brackets**: we pass the function itself, we do not call it yet.\n\n' +
        'Inside `apply_twice`, `f` is `double` and `x` is 3.\n\n' +
        '1. Inner call first: `f(x)` = `double(3)` = $2 \\times 3 = 6$.\n' +
        '2. Outer call: `f(6)` = `double(6)` = $2 \\times 6 = 12$.\n\n' +
        'Output: `12`.',
      whyWrong: [
        'This applies `double` only once. `f(f(x))` applies it twice: once to 3, then again to the result.',
        null,
        'This multiplies the result by itself ($6 \\times 6$). `f(f(x))` means "apply `f` to the result of `f(x)`", not "multiply two results".',
        'Functions are values in Python, so passing `double` (without brackets) to another function is perfectly legal.',
      ],
      keyIdea: 'Functions are values: you can pass a function (without brackets) as an argument and call it inside another function.',
    },
    check: {
      optionValues: [6, 12, 36, null],
      compute: () => {
        const double = (x: number) => 2 * x;
        const applyTwice = (f: (v: number) => number, x: number) => f(f(x));
        return applyTwice(double, 3);
      },
    },
    python: { stdout: '12\n' },
  },
  {
    id: 'functions-scope-011',
    subtopic: 'functions-scope',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: src(
        'def check(n):',
        '    for i in range(2, n):',
        '        if n % i == 0:',
        '            return False',
        '    return True',
        '',
        'print(check(9), check(7))',
      ),
    },
    options: ['`True False`', '`True True`', '`False False`', '`False True`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'A `return` statement **ends the function immediately**, even in the middle of a loop. The final `return True` is only reached if the loop finishes without returning.\n\n' +
        '`check(9)`: `range(2, 9)` gives $i = 2, 3, \\ldots, 8$.\n\n' +
        '- $i = 2$: $9 \\bmod 2 = 1$, not 0, carry on.\n' +
        '- $i = 3$: $9 \\bmod 3 = 0$, so `return False`. The function stops here.\n\n' +
        '`check(7)`: $i = 2, 3, 4, 5, 6$ give remainders $1, 1, 3, 2, 1$. None is 0, so the loop finishes and `return True` runs. (`range(2, 7)` stops **before** 7.)\n\n' +
        'Output: `False True` (the function tests whether a number is prime).',
      whyWrong: [
        'This has the logic backwards: finding a divisor makes the function return `False`, not `True`.',
        'This assumes the loop keeps going after `return False` and the last line `return True` wins. A `return` ends the function at once.',
        'This assumes `range(2, 7)` includes 7, so $7 \\bmod 7 = 0$ would return `False`. `range(2, n)` stops at $n - 1$.',
        null,
      ],
      keyIdea: '`return` exits the function immediately, so a `return` inside a loop stops both the loop and the function.',
    },
    python: { stdout: 'False True\n' },
  },
  {
    id: 'functions-scope-012',
    subtopic: 'functions-scope',
    difficulty: 'exam',
    stem: 'What happens when this Python code runs?',
    code: {
      lang: 'python',
      source: src('def greet(name, greeting="Hello"):', '    return greeting + ", " + name', '', 'print(greet("Hi", name="Omar"))'),
    },
    options: ['A `TypeError` is raised', '`Hi, Omar`', '`Hello, Omar`', '`Hello, Hi`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Python matches arguments in two stages:\n\n' +
        '1. **Positional** arguments fill the parameters from left to right. `"Hi"` is the first positional argument, so it goes to the first parameter, `name`.\n' +
        '2. **Keyword** arguments are then matched by name. `name="Omar"` tries to give `name` a value too.\n\n' +
        '`name` would receive two values, which is not allowed, so Python raises `TypeError: greet() got multiple values for argument \'name\'`. Nothing is printed.\n\n' +
        'To get `Hi, Omar` you would write `greet("Omar", "Hi")` or `greet(name="Omar", greeting="Hi")`.',
      whyWrong: [
        null,
        'This assumes Python sees that `name` is given by keyword and so slots `"Hi"` into `greeting`. It does not: positional arguments are matched left to right first, so `"Hi"` goes to `name`.',
        'This assumes the keyword `name="Omar"` simply overrides the positional value. Python never lets a parameter receive two values; it raises an error instead.',
        'This assumes the keyword argument is ignored. Every argument must be used, and here two of them target the same parameter.',
      ],
      keyIdea: 'Positional arguments fill parameters left to right first; giving the same parameter a keyword value as well raises a `TypeError`.',
    },
    python: { error: 'TypeError' },
  },
  {
    id: 'functions-scope-013',
    subtopic: 'functions-scope',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: src(
        'students = [("Ali", 72), ("Bea", 85), ("Cai", 64)]',
        'best = sorted(students, key=lambda s: s[1], reverse=True)',
        'print(best[0][0])',
      ),
    },
    options: ['`Cai`', "`('Bea', 85)`", '`Bea`', '`85`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Each student is a tuple `(name, score)`, so `s[0]` is the name and `s[1]` is the score.\n\n' +
        '1. `key=lambda s: s[1]` sorts by score: the scores are 72, 85, 64.\n' +
        '2. `reverse=True` puts the **largest** first: `[("Bea", 85), ("Ali", 72), ("Cai", 64)]`.\n' +
        '3. `best[0]` is the first tuple, `("Bea", 85)`.\n' +
        '4. `best[0][0]` is the first item of that tuple: the name `Bea`.\n\n' +
        'Output: `Bea`.',
      whyWrong: [
        'This forgets `reverse=True`: without it the smallest score (64) comes first, giving Cai.',
        'This stops at `best[0]`, the whole tuple. The second `[0]` picks out just the name.',
        null,
        'This picks index 1 of the tuple (the score). `best[0][0]` takes index 0, which is the name.',
      ],
      keyIdea: '`sorted(..., key=lambda s: s[1], reverse=True)` sorts records by their second field, largest first.',
    },
    python: { stdout: 'Bea\n' },
  },
  {
    id: 'functions-scope-014',
    subtopic: 'functions-scope',
    difficulty: 'exam',
    stem: 'In the pseudocode below, `RETURN` sends a value back to the line that called the function. What is printed?',
    code: {
      lang: 'pseudocode',
      source: src('FUNCTION f(a, b)', '    RETURN a * 2 + b', 'END FUNCTION', '', 'x = f(3, 4)', 'y = f(x, 5)', 'PRINT(y)'),
    },
    options: ['10', '25', '21', '126'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Arguments are matched to parameters by position: the first value goes to `a`, the second to `b`. Multiplication is done before addition.\n\n' +
        '1. `x = f(3, 4)`: $a = 3$, $b = 4$, so $3 \\times 2 + 4 = 10$. Now $x = 10$.\n' +
        '2. `y = f(x, 5)`: $a = 10$, $b = 5$, so $10 \\times 2 + 5 = 25$. Now $y = 25$.\n' +
        '3. `PRINT(y)` prints 25.',
      whyWrong: [
        'This is the value of `x` after the first call. The program prints `y`, which needs the second call `f(10, 5)`.',
        null,
        'This swaps the parameters, working out `b * 2 + a`: $4 \\times 2 + 3 = 11$, then $5 \\times 2 + 11 = 21$. Arguments go to parameters in order, so the first one is `a`.',
        'This adds before multiplying, working out $a \\times (2 + b)$: $3 \\times 6 = 18$, then $18 \\times 7 = 126$. Multiplication comes before addition.',
      ],
      keyIdea: 'Trace function calls one at a time, matching arguments to parameters by position and using the returned value in the next line.',
    },
    check: {
      optionValues: [10, 25, 21, 126],
      compute: () => {
        const f = (a: number, b: number) => a * 2 + b;
        const x = f(3, 4);
        return f(x, 5);
      },
    },
  },
  {
    id: 'functions-scope-015',
    subtopic: 'functions-scope',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: src('def total(a, b=2, c=3):', '    return a + b * c', '', 'print(total(1, c=10))'),
    },
    options: ['`31`', '`7`', '`30`', '`21`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Match the arguments to the parameters:\n\n' +
        '- `1` is positional, so it goes to the first parameter: $a = 1$.\n' +
        '- `c=10` is a keyword argument, so it goes to `c`: $c = 10$.\n' +
        '- Nothing is given for `b`, so it keeps its default: $b = 2$.\n\n' +
        'Now evaluate `a + b * c`, multiplying first: $1 + 2 \\times 10 = 1 + 20 = 21$.\n\n' +
        'Output: `21`.',
      whyWrong: [
        'This gives 10 to `b` (the next parameter in order) and keeps the default $c = 3$: $1 + 10 \\times 3 = 31$. A keyword argument goes to the parameter it names.',
        'This ignores `c=10` and uses all the defaults: $1 + 2 \\times 3 = 7$.',
        'This works left to right, $(1 + 2) \\times 10 = 30$, forgetting that `*` is done before `+`.',
        null,
      ],
      keyIdea: 'A keyword argument can skip over parameters; any parameter not given a value uses its default.',
    },
    check: {
      optionValues: [31, 7, 30, 21],
      compute: () => {
        const total = (a: number, b = 2, c = 3) => a + b * c;
        return total(1, undefined, 10);
      },
    },
    python: { stdout: '21\n' },
  },

  // ---------------------------------------------------------------- challenge
  {
    id: 'functions-scope-016',
    subtopic: 'functions-scope',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: src(
        'def add_one(items):',
        '    items.append(1)',
        '    items = [0]',
        '    return items',
        '',
        'data = [5]',
        'result = add_one(data)',
        'print(data, result)',
      ),
    },
    options: ['`[5, 1] [0]`', '`[5] [0]`', '`[0] [0]`', '`[5, 1] [5, 1]`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'When you pass a list to a function, the parameter refers to the **same list object** (no copy is made).\n\n' +
        '| Line | `items` refers to | `data` refers to |\n' +
        '| --- | --- | --- |\n' +
        '| call `add_one(data)` | the list `[5]` (same object as `data`) | `[5]` |\n' +
        '| `items.append(1)` | changes that shared list to `[5, 1]` | `[5, 1]` |\n' +
        '| `items = [0]` | a **brand-new** list `[0]` | still `[5, 1]` |\n' +
        '| `return items` | returns `[0]` | `[5, 1]` |\n\n' +
        '`append` **changes** the shared list, so `data` sees it. But `items = [0]` only makes the local name `items` point somewhere new; it does not touch `data`.\n\n' +
        'So `data` is `[5, 1]` and `result` is `[0]`. Output: `[5, 1] [0]`.',
      whyWrong: [
        null,
        'This assumes the function works on a copy of the list. It does not: `items.append(1)` changes the very list that `data` refers to.',
        'This assumes `items = [0]` also changes `data`. Reassigning a parameter only rebinds the local name; the caller\'s variable still points to the old list.',
        'This ignores the line `items = [0]`. After it, `items` refers to a new list, and that new list is what gets returned.',
      ],
      keyIdea: 'Mutating a list passed in (e.g. `append`) affects the caller, but reassigning the parameter (`items = ...`) does not.',
    },
    python: { stdout: '[5, 1] [0]\n' },
  },
  {
    id: 'functions-scope-017',
    subtopic: 'functions-scope',
    difficulty: 'challenge',
    stem: 'What happens when this Python code runs?',
    code: {
      lang: 'python',
      source: src('total = 5', '', 'def bump():', '    total = total + 1', '    return total', '', 'print(bump())'),
    },
    options: ['`6`', '`5`', 'An `UnboundLocalError` is raised (a kind of `NameError`)', '`1`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Python decides whether a name is local **before** the function runs: if a function **assigns** to a name anywhere in its body (and has no `global` line for it), that name is local for the **whole** function.\n\n' +
        '1. `bump` contains `total = ...`, so `total` is a local variable throughout `bump`.\n' +
        '2. The right-hand side `total + 1` is evaluated first. It needs the local `total`, which has not been given a value yet.\n' +
        '3. Python raises `UnboundLocalError: cannot access local variable \'total\' where it is not associated with a value`. Nothing is printed.\n\n' +
        'Fix: add `global total` as the first line of `bump` (then it would print 6), or better, pass the value in as a parameter and return the new value.',
      whyWrong: [
        'This assumes Python reads the global `total` on the right-hand side and then creates a local one. Because `total` is assigned in the function, it is local everywhere in the function, so the global is never read.',
        'This assumes the function quietly returns the global value unchanged. In fact the function crashes before it can return anything.',
        null,
        'This assumes a new local variable starts at 0. Python variables have no starting value; using one before assigning it is an error.',
      ],
      keyIdea: 'Assigning to a name anywhere in a function makes it local for the whole function, so reading it before the assignment raises `UnboundLocalError`.',
    },
    python: { error: 'UnboundLocalError' },
  },
  {
    id: 'functions-scope-018',
    subtopic: 'functions-scope',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: src(
        'def make_multiplier(n):',
        '    return lambda x: x * n',
        '',
        'triple = make_multiplier(3)',
        'double = make_multiplier(2)',
        'print(triple(double(5)))',
      ),
    },
    options: ['`15`', '`30`', '`10`', 'An error is raised, because `n` no longer exists once `make_multiplier` has returned'],
    correctIndex: 1,
    markScheme: {
      solution:
        '`make_multiplier` **returns a function**. The returned lambda remembers the value of `n` from the call that created it.\n\n' +
        '- `triple = make_multiplier(3)`: `triple` is the function `lambda x: x * 3`.\n' +
        '- `double = make_multiplier(2)`: `double` is the function `lambda x: x * 2`.\n\n' +
        'Now evaluate `triple(double(5))` from the inside out:\n\n' +
        '1. `double(5)` = $5 \\times 2 = 10$.\n' +
        '2. `triple(10)` = $10 \\times 3 = 30$.\n\n' +
        'Output: `30`.',
      whyWrong: [
        'This applies only `triple` to 5 ($5 \\times 3 = 15$) and forgets the inner `double(5)` call.',
        null,
        'This stops after the inner call `double(5)` = 10 and forgets to apply `triple` to the result.',
        'A function created inside another function keeps access to the variables it uses (this is called a closure), so each lambda still knows its own `n`.',
      ],
      keyIdea: 'A function can return another function, and the returned function remembers the variables from where it was created.',
    },
    check: {
      optionValues: [15, 30, 10, null],
      compute: () => {
        const makeMultiplier = (n: number) => (x: number) => x * n;
        const triple = makeMultiplier(3);
        const double = makeMultiplier(2);
        return triple(double(5));
      },
    },
    python: { stdout: '30\n' },
  },
  {
    id: 'functions-scope-019',
    subtopic: 'functions-scope',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: src(
        'data = [3, -7, 2, -1, 5]',
        'result = sorted(data, key=lambda v: abs(v))',
        'print(result[-1], sum(map(lambda v: v * v, filter(lambda v: v > 0, data))))',
      ),
    },
    options: ['`5 38`', '`7 38`', '`-7 88`', '`-7 38`'],
    correctIndex: 3,
    markScheme: {
      solution:
        '**First value.** `key=lambda v: abs(v)` sorts by distance from zero, but keeps the original numbers.\n\n' +
        '| `v` | 3 | -7 | 2 | -1 | 5 |\n' +
        '| --- | --- | --- | --- | --- | --- |\n' +
        '| `abs(v)` | 3 | 7 | 2 | 1 | 5 |\n\n' +
        'Smallest key first: `result = [-1, 2, 3, 5, -7]`. `result[-1]` is the **last** item: `-7`.\n\n' +
        '**Second value.** Inside out:\n\n' +
        '1. `filter(lambda v: v > 0, data)` keeps 3, 2, 5.\n' +
        '2. `map(lambda v: v * v, ...)` squares them: 9, 4, 25.\n' +
        '3. `sum(...)` = $9 + 4 + 25 = 38$.\n\n' +
        'Output: `-7 38`.',
      whyWrong: [
        'This ignores the key and sorts by the numbers themselves, giving `[-7, -1, 2, 3, 5]` with 5 last. The key `abs(v)` sorts by size ignoring the sign, so -7 (size 7) comes last.',
        'This assumes the key changes the stored values into their absolute values. The key is only used for comparing; -7 stays -7.',
        'The first value is right, but this squares **every** number ($9 + 49 + 4 + 1 + 25 = 88$), forgetting that `filter` keeps only the positive ones.',
        null,
      ],
      keyIdea: 'A sort key only decides the order (the items are unchanged), and nested `map`/`filter` calls are evaluated from the inside out.',
    },
    check: {
      optionValues: ['5 38', '7 38', '-7 88', '-7 38'],
      compute: () => {
        const data = [3, -7, 2, -1, 5];
        const result = [...data].sort((p, q) => Math.abs(p) - Math.abs(q));
        const s = data.filter((v) => v > 0).map((v) => v * v).reduce((p, q) => p + q, 0);
        return `${result[result.length - 1]} ${s}`;
      },
    },
    python: { stdout: '-7 38\n' },
  },
  {
    id: 'functions-scope-020',
    subtopic: 'functions-scope',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: src(
        'x = 1',
        '',
        'def f(x):',
        '    x = x + 10',
        '    return x',
        '',
        'def g():',
        '    global x',
        '    x = x * 3',
        '    return f(x)',
        '',
        'y = g()',
        'print(x, y)',
      ),
    },
    options: ['`3 13`', '`13 13`', '`3 11`', '`1 13`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Keep track of which `x` each line uses.\n\n' +
        '| Step | global `x` | `x` inside `f` (parameter) | value |\n' +
        '| --- | --- | --- | --- |\n' +
        '| `x = 1` | 1 | - | - |\n' +
        '| `g()` runs `global x; x = x * 3` | 3 | - | - |\n' +
        '| `g` calls `f(x)`, i.e. `f(3)` | 3 | 3 | - |\n' +
        '| `x = x + 10` inside `f` | 3 | 13 | - |\n' +
        '| `f` returns 13, `g` returns 13 | 3 | - | `y = 13` |\n\n' +
        'In `g`, `global x` means `x = x * 3` really changes the global `x` to 3. In `f`, `x` is a **parameter**, which is always a local variable, so `x = x + 10` changes only `f`\'s own copy of the name.\n\n' +
        'Output: `3 13`.',
      whyWrong: [
        null,
        'This assumes `x = x + 10` inside `f` changes the global `x`. A parameter is a local variable, so the global `x` stays 3.',
        'This assumes `f` receives the original value 1. But `g` has already changed the global `x` to 3 before it calls `f(x)`, so `f` gets 3.',
        'This ignores `global x` in `g`, treating `x = x * 3` as a change to a local copy only. With `global x`, the global variable really becomes 3. (Without the `global` line, Python would in fact raise an `UnboundLocalError` there.)',
      ],
      keyIdea: '`global` lets a function change a global variable, but a parameter is always local, even if it has the same name as a global.',
    },
    check: {
      optionValues: ['3 13', '13 13', '3 11', '1 13'],
      compute: () => {
        let x = 1;
        const f = (xp: number) => {
          let local = xp;
          local = local + 10;
          return local;
        };
        const g = () => {
          x = x * 3;
          return f(x);
        };
        const y = g();
        return `${x} ${y}`;
      },
    },
    python: { stdout: '3 13\n' },
  },
];
