import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'functions-scope',
  simple:
    'A **function** is like a recipe card: you write it once, then "cook" it whenever you like by calling it with ingredients (the **arguments**). `return` hands the finished dish back to whoever asked for it, while `print` only shows it on the screen. Variables created inside a function are **local**: they live only while that call runs, like notes on a scrap of paper thrown away afterwards, so they do not change variables with the same name outside.',
  methods: [
    { cue: 'A call such as `f(3, 4)` or `f(b, a)`', method: 'Match by **position**: the first value goes to the first parameter, whatever the names in the call are. Write `a = ..., b = ...` next to the definition, then evaluate the body.' },
    { cue: 'The same variable name inside and outside a function', method: 'Keep two columns, outer and local. Assigning inside a function (or using a parameter) makes a separate local variable, so the outer one keeps its value.' },
    { cue: 'A function that `print`s and also returns something', method: 'The print happens during the call. The value stored or printed by the caller is the one from `return`.' },
    { cue: 'A `return` inside a loop', method: 'The first `return` reached ends the whole function at once; later lines and later loop passes never run.' },
    { cue: 'A nested call such as `f(g(3))`, or a function that calls another', method: 'Work out the innermost call first, then pass its result outwards.' },
    { cue: 'A question that says **Python**', method: 'Read `def` as `function`. A function with no `return` gives back `None`, and `range(a, b)` stops before `b`.' },
  ],
  know:
    '### What a function is\n\n' +
    'A **function** is a named, reusable block of code. You **define** it once, then **call** it as many times as you like. The names in brackets on the definition line are **parameters**; the values you put in the brackets when calling are **arguments**. Some books say **formal parameters** and **actual arguments** for the same two things.\n\n' +
    '```pseudocode\nfunction area(width, height)\n   return width * height\nend function\n\nprint(area(3, 4))\n```\n\n' +
    'When `area(3, 4)` runs, `width` becomes 3 and `height` becomes 4, the body runs, and the call is replaced by the returned value, 12. A function that is defined but never called does nothing at all.\n\n' +
    '### return vs print\n\n' +
    'This is the most tested idea in the whole topic.\n\n' +
    '- `return value` **sends a value back** to the code that called the function and **ends the function immediately** (even inside a loop).\n' +
    '- `print(value)` only **shows** a value on the screen. The calling code gets nothing from it.\n\n' +
    'So a function can print one thing and return another. The caller only receives what is returned, and it appears on the screen only if the caller prints it.\n\n' +
    '### Matching arguments to parameters\n\n' +
    'Arguments are matched **by position**: the first value goes to the first parameter, the second to the second, and so on. The names used in the call do not matter. With `function sub(a, b)`, the call `sub(b, a)` passes the outer `b` to the parameter `a`.\n\n' +
    '### Local and outer variables\n\n' +
    '- A variable **assigned** inside a function, and every parameter, is **local**: it exists only while that call runs, and it hides any outer variable with the same name.\n' +
    '- A variable created outside all functions is an **outer** (or global) variable. Assigning to the same name inside a function does not change it.\n' +
    '- Changing a parameter changes only the local copy, so the variable passed in keeps its value.\n\n' +
    'To get a result out of a function, return it and store it: `m = addTen(n)`.\n\n' +
    '### Functions calling functions\n\n' +
    'One function can call another, and a call can be an argument of another call. Python and pseudocode work the same way here: the inner call finishes and hands back its value first, then the outer expression carries on. A call inside a loop runs once per pass, using the loop variable at that moment.\n\n' +
    '### Reading the same thing in Python\n\n' +
    'A few questions show short Python. `def f(x):` means `function f(x)`, indentation shows where the body ends, and `%` means `mod`. Two details differ from the pseudocode:\n\n' +
    '- A Python function that ends without `return` gives back the special value `None`, so printing the result of such a call shows the word `None`.\n' +
    '- `for i in range(a, b):` runs `i` from `a` up to but not including `b`.',
  formulas: [
    { label: 'Define and call', tex: '\\texttt{function f(a, b)} \\ldots \\texttt{return a + b} \\;\\Rightarrow\\; \\texttt{f(2, 3)} = 5' },
    { label: 'Parameters and arguments', tex: '\\text{parameters: names in the definition}; \\quad \\text{arguments: values in the call}' },
    { label: 'Argument matching', tex: '\\text{first value} \\to \\text{first parameter}, \\quad \\text{second value} \\to \\text{second parameter}', note: 'By position, never by name.' },
    { label: 'return ends the function', tex: '\\texttt{return} \\Rightarrow \\text{leave the function at once}', note: 'Any lines (or loop passes) after it are skipped.' },
    { label: 'Scope rule', tex: '\\text{assigned inside (or a parameter)} \\Rightarrow \\text{local; the outer variable is unchanged}' },
    { label: 'Python: no return', tex: '\\text{function ends without return} \\Rightarrow \\text{it returns None}', note: '`print` shows a value but does not return it.' },
  ],
  examples: [
    {
      title: 'return vs print',
      problem: 'What does this print?\n\n```pseudocode\nfunction f(x)\n   print(x + 1)\n   return x * 2\nend function\n\ny = f(4)\nprint(y)\n```',
      steps: [
        '`y = f(4)` calls `f` with `x = 4`. Inside, `print(x + 1)` displays 5.',
        '`return x * 2` sends back 8, so `y = 8`.',
        '`print(y)` displays 8.',
      ],
      answer: 'Two values: 5 then 8.',
    },
    {
      title: 'Matching by position',
      problem: 'What does this print?\n\n```pseudocode\nfunction total(a, b, c)\n   return a + b * c\nend function\n\nb = 5\nprint(total(4, 2, b))\n```',
      steps: [
        'The first value goes to `a`, so `a = 4`.',
        'The second value goes to `b`, so the parameter `b` is 2. The outer `b` does not matter here.',
        'The third value is the outer `b`, which is 5, so `c = 5`.',
        'Evaluate with multiplication first: $4 + 2 \\times 5 = 4 + 10 = 14$.',
      ],
      answer: '14',
    },
    {
      title: 'Local vs outer',
      problem: 'What does this print?\n\n```pseudocode\nn = 3\n\nfunction g()\n   n = 8\n   return n * 2\nend function\n\nm = g()\nprint(n)\nprint(m)\n```',
      steps: [
        '`n = 3` creates an outer `n`.',
        'Inside `g`, `n = 8` creates a **new local** `n`. The outer `n` is still 3.',
        '`return n * 2` uses the local `n`: $8 \\times 2 = 16$, so `m = 16`.',
        'After the call the local `n` is gone, so `print(n)` uses the outer `n`.',
      ],
      answer: '3 then 16',
    },
    {
      title: 'Functions calling functions',
      problem: 'What does this print?\n\n```pseudocode\nfunction square(x)\n   return x * x\nend function\n\nfunction f(a, b)\n   return square(a) - b\nend function\n\nprint(f(square(2), 6))\n```',
      steps: [
        'The argument `square(2)` runs first and gives 4, so the call is `f(4, 6)`.',
        'Inside `f`, $a = 4$ and $b = 6$, and `square(a)` gives 16.',
        '`return square(a) - b` gives $16 - 6 = 10$.',
      ],
      answer: '10',
    },
  ],
  traps: [
    'Thinking `print` hands a value back. Only `return` does. A printed value is shown on the screen and the caller receives nothing from it.',
    'Forgetting that `return` ends the function at once: a `return` inside a loop stops the loop on the first pass where it runs.',
    'Assuming `x = 5` inside a function changes the outer `x`. It creates a separate local variable, and the outer one keeps its old value.',
    'Matching arguments by name. In `sub(b, a)` the first value goes to the first parameter, even though it comes from a variable called `b`.',
    'Thinking a change to a parameter reaches the caller. To get a new value out of a function, return it and store it.',
    'In a nested call `f(g(3))`, starting with the outer function. The inner call has to finish first, because its result is the argument.',
  ],
  examTip:
    'These questions are almost always "what does this code print?" with four outputs. Trace it on paper with a small table of variable values, one row per line, and keep **outer** and **local** variables in separate columns. Then eliminate fast:\n\n' +
    '- Two options often differ only by "did the outer variable change?". Assigning inside a function never changes it.\n' +
    '- For calls with several arguments, write `a = ..., b = ..., c = ...` next to the definition before calculating anything; most wrong options come from giving a value to the wrong parameter.\n' +
    '- If there is a `return` inside a loop, look for the first pass that reaches it. Everything after that is skipped.\n' +
    '- "Infinite loop" is correct only if a loop inside the function can never meet its stopping condition, for example `while (n != 0)` with a step that jumps over 0.',
};
