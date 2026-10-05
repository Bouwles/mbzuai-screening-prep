import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'functions-scope',
  know:
    '### What a function is\n\n' +
    'A **function** is a named, reusable block of code. You **define** it once with `def`, then **call** it as many times as you like. The names in brackets on the `def` line are **parameters**; the values you put in the brackets when calling are **arguments**.\n\n' +
    '```python\ndef area(width, height):\n    return width * height\n\nprint(area(3, 4))   # 12\n```\n\n' +
    'When `area(3, 4)` runs, Python sets `width = 3`, `height = 4`, runs the body, and the call is replaced by the returned value, 12.\n\n' +
    '### return vs print\n\n' +
    'This is the most tested idea in the whole topic.\n\n' +
    '- `return value` **sends a value back** to the code that called the function and **ends the function immediately** (even inside a loop).\n' +
    '- `print(value)` only **shows** a value on the screen. The calling code gets nothing from it.\n' +
    '- A function that ends without a `return` (or with a bare `return`) gives back the special value `None`.\n\n' +
    'So if `f` only prints, then `x = f(5)` still runs the print, but `x` is `None`, and `print(x)` shows the word `None`.\n\n' +
    '### Positional and keyword arguments\n\n' +
    '| Kind | Example call | How it is matched |\n' +
    '| --- | --- | --- |\n' +
    '| positional | `area(3, 4)` | left to right: first value to first parameter |\n' +
    '| keyword | `area(height=4, width=3)` | by **name**, so order does not matter |\n' +
    '| mixed | `area(3, height=4)` | positional ones first, then keywords |\n\n' +
    'Rules: positional arguments must come **before** keyword arguments in a call, and no parameter may receive two values. `area(3, width=5)` raises a `TypeError` because 3 already went to `width`.\n\n' +
    '### Default arguments\n\n' +
    'A parameter can have a default value: `def power(base, exp=2)`. If the caller leaves `exp` out, it is 2; if the caller passes a value, that value wins. A keyword argument can skip over a default: with `def total(a, b=2, c=3)`, the call `total(1, c=10)` gives `a = 1`, `b = 2`, `c = 10`.\n\n' +
    '**The mutable default trap.** A default value is created **once**, when the `def` line runs, not on every call. If the default is a list (or dict) and the function changes it, the change is remembered by the next call:\n\n' +
    '```python\ndef add(x, bag=[]):\n    bag.append(x)\n    return bag\n\nadd(1)   # [1]\nadd(2)   # [1, 2]  (same list!)\n```\n\n' +
    'The safe pattern is `bag=None`, then `if bag is None: bag = []` inside the function.\n\n' +
    '### Local and global scope\n\n' +
    '- A variable created **outside** all functions is **global**: functions can read it.\n' +
    '- A variable **assigned** inside a function (and every parameter) is **local**: it exists only while that call runs, and it hides any global with the same name.\n' +
    '- To change a global from inside a function, write `global name` first.\n' +
    '- Python decides "local or not" for the **whole** function. If a function assigns to `total` anywhere, then reading `total` before that assignment raises `UnboundLocalError`.\n\n' +
    'Lists are different in one way: if you pass a list in and call `items.append(...)`, you are changing the **same** list the caller has, so the caller sees it. But `items = [0]` inside the function only points the local name at a new list; the caller is unaffected.\n\n' +
    '### Functions as values and lambda\n\n' +
    'A function is a value, like a number. Without brackets, `double` is the function itself; with brackets, `double(3)` calls it. So you can store functions in variables, pass them to other functions (`apply_twice(double, 3)`), and even return them.\n\n' +
    '`lambda x: x * x` is a one-line function with no name. It takes `x` and returns `x * x`. It is mostly used as a short argument to another function.\n\n' +
    '### map, filter and sorted with key\n\n' +
    '| Call | What it does | Example result |\n' +
    '| --- | --- | --- |\n' +
    '| `list(map(f, xs))` | applies `f` to **every** item | `map(lambda x: x * 10, [1, 2])` gives `[10, 20]` |\n' +
    '| `list(filter(f, xs))` | **keeps** items where `f` returns `True` | `filter(lambda x: x > 1, [1, 2, 3])` gives `[2, 3]` |\n' +
    '| `sorted(xs, key=f)` | orders items by `f(item)`, smallest first | `sorted(["bb", "a"], key=len)` gives `[\'a\', \'bb\']` |\n\n' +
    'In Python 3, `map` and `filter` do not give back a list directly (printing one shows something like `<map object at ...>`), so wrap them in `list(...)` to see the values. `sorted` returns a **new** list of the **original** items: the key is only used for comparing. If two items have the same key, they keep their original order. Add `reverse=True` for largest first. Nested calls are worked out from the **inside out**.',
  formulas: [
    { label: 'Define and call', tex: '\\texttt{def f(a, b): return a + b} \\;\\Rightarrow\\; \\texttt{f(2, 3)} = 5' },
    { label: 'No return', tex: '\\text{function ends without return} \\Rightarrow \\text{it returns None}', note: '`print` shows a value but does not return it.' },
    { label: 'return ends the function', tex: '\\texttt{return} \\Rightarrow \\text{leave the function at once}', note: 'Any lines (or loop passes) after it are skipped.' },
    { label: 'Argument matching order', tex: '\\text{positional (left to right)} \\rightarrow \\text{keyword (by name)} \\rightarrow \\text{defaults}', note: 'A parameter given two values raises a `TypeError`.' },
    { label: 'Default arguments', tex: '\\texttt{def f(a, b=2)}: \\; \\texttt{f(5)} \\Rightarrow b = 2, \\quad \\texttt{f(5, 7)} \\Rightarrow b = 7' },
    { label: 'Mutable default trap', tex: '\\text{default evaluated once at def} \\Rightarrow \\text{a default list is shared between calls}', note: 'Use `None` as the default and create the list inside.' },
    { label: 'Scope rule', tex: '\\text{assigned inside (or a parameter)} \\Rightarrow \\text{local}; \\quad \\texttt{global name} \\Rightarrow \\text{changes the global}' },
    { label: 'lambda', tex: '\\texttt{lambda x: x * x} \\;\\equiv\\; \\texttt{def f(x): return x * x}' },
    { label: 'map', tex: '\\texttt{list(map(f, [x1, x2]))} \\rightarrow \\texttt{[f(x1), f(x2)]}' },
    { label: 'filter', tex: '\\texttt{list(filter(f, xs))} \\rightarrow \\text{items with } \\texttt{f(x)} = \\texttt{True}' },
    { label: 'sorted with key', tex: '\\texttt{sorted(xs, key=f)} \\rightarrow \\text{original items, ordered by } \\texttt{f(x)} \\text{ (smallest first)}', note: 'Add `reverse=True` for largest first.' },
  ],
  examples: [
    {
      title: 'return vs print',
      problem: 'What does this print?\n\n```python\ndef f(x):\n    print(x + 1)\n\ny = f(4)\nprint(y)\n```',
      steps: [
        '`y = f(4)` calls `f` with `x = 4`. Inside, `print(x + 1)` displays `5`.',
        '`f` has no `return`, so the call gives back `None`. So `y = None`.',
        '`print(y)` displays `None`.',
      ],
      answer: 'Two lines: `5` then `None`.',
    },
    {
      title: 'Default and keyword arguments',
      problem: 'With `def total(a, b=2, c=3): return a + b * c`, what is `total(4, c=5)`?',
      steps: [
        '`4` is positional, so it goes to the first parameter: `a = 4`.',
        '`c=5` is a keyword argument, so `c = 5`.',
        '`b` is not given, so it keeps its default: `b = 2`.',
        'Evaluate with multiplication first: $4 + 2 \\times 5 = 4 + 10 = 14$.',
      ],
      answer: '`14`',
    },
    {
      title: 'Local vs global',
      problem: 'What does this print?\n\n```python\nn = 3\n\ndef g():\n    n = 8\n    return n * 2\n\nm = g()\nprint(n, m)\n```',
      steps: [
        '`n = 3` creates a global `n`.',
        'Inside `g`, `n = 8` creates a **new local** `n` (there is no `global` line). The global `n` is still 3.',
        '`return n * 2` uses the local `n`: $8 \\times 2 = 16$, so `m = 16`.',
        'After the call the local `n` is gone; `print(n, m)` uses the global `n`.',
      ],
      answer: '`3 16`',
    },
    {
      title: 'map, filter and sorted',
      problem: 'What does this print?\n\n```python\nnums = [5, 2, 8, 3]\nprint(sorted(map(lambda x: x * x, filter(lambda x: x > 2, nums)), reverse=True))\n```',
      steps: [
        'Innermost first: `filter(lambda x: x > 2, nums)` keeps 5, 8, 3 (2 is not greater than 2).',
        '`map(lambda x: x * x, ...)` squares each: $5^2 = 25$, $8^2 = 64$, $3^2 = 9$.',
        '`sorted(..., reverse=True)` orders them largest first: 64, 25, 9.',
      ],
      answer: '`[64, 25, 9]`',
    },
  ],
  traps: [
    'Thinking `print` returns a value. A function that only prints returns `None`, so `x = f()` makes `x` equal to `None`.',
    'Forgetting that `return` ends the function at once: a `return` inside a loop stops the loop on the first pass where it runs.',
    'Assuming `x = 5` inside a function changes the global `x`. Without `global x` it creates a separate local variable, and the global keeps its old value.',
    'The mutable default trap: `def f(x, bag=[])` creates the list once, so items appended in one call are still there in the next call.',
    'Mixing up `map` and `filter`: `filter` keeps the items where the test is `True` (it does not change them); `map` changes every item.',
    'Thinking `sorted(xs, key=len)` returns the lengths. The key is only used for comparing; you get back the original items in a new order.',
  ],
  examTip:
    'These questions are almost always "what does this code print?" with four outputs. Trace it on paper with a small table of variable values, one row per line, and keep **global** and **local** variables in separate columns. Then eliminate fast:\n\n' +
    '- If a function has no `return`, look for `None` in the output.\n' +
    '- Two options often differ only by "did the global change?": check for a `global` line. No `global` line means the global is unchanged.\n' +
    '- For calls with defaults, write `a = ..., b = ..., c = ...` next to the `def` line before calculating anything; most wrong options come from giving a value to the wrong parameter.\n' +
    '- For `map`/`filter`/`sorted`, work from the inside out and check the length of the result: `filter` keeps the length the same or makes the list shorter, while `map` always keeps the length the same.\n' +
    '- An option that says "an error is raised" is correct only for a real rule break, such as a parameter receiving two values or reading a local variable before it is assigned.',
};
