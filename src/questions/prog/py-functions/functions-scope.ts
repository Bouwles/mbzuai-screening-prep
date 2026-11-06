import type { StaticQuestion } from '../../../types';

/** Join source lines into one code string. */
const src = (...lines: string[]) => lines.join('\n');

const LOCAL = 'Variables assigned inside a function are local to it.';
const ORDER = 'Printed values are shown in order, separated by a space.';

export const questions: StaticQuestion[] = [

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
    id: 'functions-scope-003',
    subtopic: 'functions-scope',
    difficulty: 'foundation',
    stem: `What does this pseudocode print? ${ORDER}`,
    code: {
      lang: 'pseudocode',
      source: src('function power(base, exp)', '   return base ^ exp // ^ means to the power of', 'end function', '', 'print(power(3, 2))', 'print(power(2, 3))'),
    },
    options: ['`9 9`', '`6 6`', '`8 9`', '`9 8`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Arguments fill the parameters **by position**: the first value goes to `base` and the second to `exp`.\n\n' +
        '1. `power(3, 2)`: `base = 3`, `exp = 2`, so $3^2 = 9$.\n' +
        '2. `power(2, 3)`: `base = 2`, `exp = 3`, so $2^3 = 8$.\n\n' +
        'The two printed values are 9 then 8, so the answer is `9 8`.',
      whyWrong: [
        'This swaps the arguments in the second call, working out $3^2$. The first value always goes to the first parameter, so that call is $2^3$.',
        'This reads the power sign as multiplication: $3 \\times 2 = 6$ and $2 \\times 3 = 6$.',
        'This swaps the arguments in both calls, working out $2^3$ and then $3^2$. The first value goes to `base`.',
        null,
      ],
      keyIdea: 'Arguments are matched to parameters by position, left to right.',
    },
    check: {
      optionValues: ['9 9', '6 6', '8 9', '9 8'],
      compute: () => {
        const power = (base: number, exp: number) => base ** exp;
        return `${power(3, 2)} ${power(2, 3)}`;
      },
    },
  },
  {
    id: 'functions-scope-004',
    subtopic: 'functions-scope',
    difficulty: 'foundation',
    stem: 'A Python function finishes running without reaching a `return` statement. What does the call evaluate to?',
    options: ['`0`', 'The value of its last line', '`None`', 'An error is raised'],
    correctIndex: 2,
    markScheme: {
      solution:
        'A Python function call always gives back some value. If the body ends without a `return` (or with a bare `return` that has no value), Python gives back the special value `None`, which means "no value".\n\n' +
        'Example:\n\n' +
        '```python\ndef greet():\n    print("hi")\n\nx = greet()   # prints hi\nprint(x)      # prints None\n```\n\n' +
        'So the call evaluates to `None`.',
      whyWrong: [
        '`0` is a number. Python does not invent a number; a missing `return` gives `None`, which is a different value from `0`.',
        'A Python function only hands back a value through `return`. The last line running does not count as returning it.',
        null,
        'Functions without `return` are legal (for example, functions that only print). No error is raised.',
      ],
      keyIdea: 'A Python function with no `return` (or a bare `return`) returns `None`.',
    },
  },
  {
    id: 'functions-scope-021',
    subtopic: 'functions-scope',
    difficulty: 'foundation',
    stem: 'In the definition `function area(w, h)`, what are `w` and `h` called?',
    options: ['Parameters', 'Arguments', 'Return values', 'Function calls'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The names in brackets on the definition line are **parameters**. They stand for whatever values are supplied when the function is called.\n\n' +
        'The values supplied in a call, such as 3 and 4 in `area(3, 4)`, are the **arguments**.',
      whyWrong: [
        null,
        'Arguments are the values written in a call, such as 3 and 4 in `area(3, 4)`. Here `w` and `h` are names in the definition.',
        'A return value is what the function sends back when it finishes. It does not appear on the definition line.',
        'A call is the line that runs the function, such as `area(3, 4)`. This line only defines it.',
      ],
      keyIdea: 'Parameters are the names in the definition; arguments are the values in the call.',
    },
  },
  {
    id: 'functions-scope-022',
    subtopic: 'functions-scope',
    difficulty: 'foundation',
    stem: 'In the call `area(3, 4)`, what are 3 and 4 called?',
    options: ['Parameters', 'Arguments', 'Return values', 'Local variables'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The values written in the brackets of a **call** are the **arguments**. Each one is passed to the matching parameter in the definition, so with `function area(w, h)` the call gives `w = 3` and `h = 4`.',
      whyWrong: [
        'Parameters are the names in the definition line, such as `w` and `h`. The values in a call are the arguments.',
        null,
        'A return value comes out of the function when it finishes. The values 3 and 4 go in.',
        'A local variable is a name used inside the function. The values 3 and 4 are written in the call, outside the function.',
      ],
      keyIdea: 'Arguments are the values passed in a call.',
    },
  },
  {
    id: 'functions-scope-023',
    subtopic: 'functions-scope',
    difficulty: 'foundation',
    stem: 'What does a `return` statement do?',
    options: ['Ends the function and sends back a value', 'Prints a value on the screen', 'Runs the function again', 'Saves a value for the next call'],
    correctIndex: 0,
    markScheme: {
      solution:
        '`return` does two things: it **ends the function immediately**, even inside a loop, and it **sends a value back** to the line that made the call. That line can then store the value or use it in a calculation.',
      whyWrong: [
        null,
        'Printing is what `print` does. A returned value appears on the screen only if the caller prints it.',
        'Running the function again needs another call. `return` leaves the function.',
        'Local variables disappear when the call ends, so nothing is kept for the next call. The value goes back to the caller.',
      ],
      keyIdea: '`return` ends the function and hands a value back to the caller.',
    },
  },
  {
    id: 'functions-scope-024',
    subtopic: 'functions-scope',
    difficulty: 'foundation',
    stem: 'Where can a local variable be used?',
    options: ['Only inside its function', 'Anywhere in the program', 'Only in the main program', 'In every function called later'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A **local** variable is created inside a function and exists only while that call runs. Code outside the function cannot use it, and it disappears when the call ends.',
      whyWrong: [
        null,
        'A variable usable everywhere is a global (outer) variable, which is the opposite of local.',
        'The main program is outside the function, so it cannot see the local variable at all.',
        'Another function has its own local variables and cannot use this one. To share a value, pass it as an argument.',
      ],
      keyIdea: 'A local variable exists only inside the function call that created it.',
    },
  },
  {
    id: 'functions-scope-025',
    subtopic: 'functions-scope',
    difficulty: 'foundation',
    stem: 'A function is defined but never called. How many times does its body run?',
    options: ['0', '1', 'Once per parameter', 'Infinite loop'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Defining a function only stores its instructions under a name. The body runs **once per call**, so with no calls it runs 0 times.',
      whyWrong: [
        null,
        'This treats the definition as if it also ran the body. A definition only stores the instructions.',
        'Parameters are placeholders for values. They do not make the body run.',
        'Nothing repeats here, because nothing runs at all.',
      ],
      keyIdea: 'A function body runs only when the function is called.',
    },
  },
  {
    id: 'functions-scope-026',
    subtopic: 'functions-scope',
    difficulty: 'foundation',
    stem: 'Given `function f(x, y)`, which call passes the actual argument 2 to the formal parameter `y`?',
    options: ['`f(2, 1)`', '`f(1, 2)`', '`f(2)`', '`f(y)`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'A **formal parameter** is a name in the definition. An **actual argument** is a value supplied in the call. They are matched by position.\n\n' +
        '`y` is the second parameter, so 2 must be the second argument: `f(1, 2)` gives `x = 1` and `y = 2`.',
      whyWrong: [
        'Here 2 is the first argument, so it goes to the first parameter, `x`.',
        null,
        'A single argument goes to the first parameter, `x`, and `y` gets no value at all.',
        'This passes the value of a variable called `y` to the first parameter. It does not pass 2, and names do not decide the matching.',
      ],
      keyIdea: 'Formal parameters are names in the definition; actual arguments are values in the call, matched by position.',
    },
  },

  // ---------------------------------------------------------------- exam
  {
    id: 'functions-scope-006',
    subtopic: 'functions-scope',
    difficulty: 'exam',
    stem: `${LOCAL} What does this pseudocode print? ${ORDER}`,
    code: {
      lang: 'pseudocode',
      source: src('x = 10', '', 'function change()', '   x = 5', '   print(x)', 'end function', '', 'change()', 'print(x)'),
    },
    options: ['`5 5`', '`5 10`', '`10 10`', '`10 5`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'There are **two different** variables called `x` here.\n\n' +
        '| Line | What happens | outer `x` | local `x` |\n' +
        '| --- | --- | --- | --- |\n' +
        '| `x = 10` | creates the outer variable | 10 | - |\n' +
        '| `x = 5` inside `change` | creates a separate local variable | 10 | 5 |\n' +
        '| `print(x)` inside | uses the local `x` | 10 | 5 |\n' +
        '| function ends | the local `x` disappears | 10 | - |\n' +
        '| `print(x)` outside | uses the outer `x` | 10 | - |\n\n' +
        'The printed values are 5 then 10, so the answer is `5 10`.',
      whyWrong: [
        'This assumes `x = 5` inside the function changes the outer `x`. It creates a separate local variable, so the outer one stays 10.',
        null,
        'This assumes the `print(x)` inside the function sees the outer `x`. The function has just made its own `x = 5`, and that one is used inside.',
        'This has the two values the wrong way round: the function prints its local 5 first, and the outer 10 is printed last.',
      ],
      keyIdea: 'Assigning to a name inside a function creates a local variable; the outer variable with that name is unchanged.',
    },
    check: {
      optionValues: ['5 5', '5 10', '10 10', '10 5'],
      compute: () => {
        const out: number[] = [];
        const x = 10;
        const change = () => {
          const local = 5;
          out.push(local);
        };
        change();
        out.push(x);
        return out.join(' ');
      },
    },
  },
  {
    id: 'functions-scope-010',
    subtopic: 'functions-scope',
    difficulty: 'exam',
    stem: 'What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: src('function double(x)', '   return 2 * x', 'end function', '', 'function addOne(x)', '   return x + 1', 'end function', '', 'print(double(addOne(3)))'),
    },
    options: ['7', '8', '4', '6'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Work out the **inner** call first, then pass its result to the outer call.\n\n' +
        '1. `addOne(3)` returns $3 + 1 = 4$.\n' +
        '2. `double(4)` returns $2 \\times 4 = 8$.\n\n' +
        'Output: 8.',
      whyWrong: [
        'This runs `double` first: $2 \\times 3 + 1 = 7$. The inner call `addOne(3)` must finish before `double` can start.',
        null,
        'This stops after the inner call. The value 4 is then passed to `double`.',
        'This ignores `addOne` and doubles 3 directly.',
      ],
      keyIdea: 'In a nested call, the inner call runs first and its result becomes the argument of the outer call.',
    },
    check: {
      optionValues: [7, 8, 4, 6],
      compute: () => {
        const double = (x: number) => 2 * x;
        const addOne = (x: number) => x + 1;
        return double(addOne(3));
      },
    },
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
        '`check(7)`: $i = 2, 3, 4, 5, 6$ give remainders $1, 1, 3, 2, 1$. None is 0, so the loop finishes and `return True` runs. `range(2, 7)` stops before 7.\n\n' +
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
    id: 'functions-scope-014',
    subtopic: 'functions-scope',
    difficulty: 'exam',
    stem: 'What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: src('function f(a, b)', '   return a * 2 + b', 'end function', '', 'x = f(3, 4)', 'y = f(x, 5)', 'print(y)'),
    },
    options: ['10', '25', '21', '126'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Arguments are matched to parameters by position: the first value goes to `a`, the second to `b`. Multiplication is done before addition.\n\n' +
        '1. `x = f(3, 4)`: $a = 3$, $b = 4$, so $3 \\times 2 + 4 = 10$. Now $x = 10$.\n' +
        '2. `y = f(x, 5)`: $a = 10$, $b = 5$, so $10 \\times 2 + 5 = 25$. Now $y = 25$.\n' +
        '3. `print(y)` prints 25.',
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
    stem: 'What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: src('function total(a, b, c)', '   return a + b * c', 'end function', '', 'print(total(1, 2, 10))'),
    },
    options: ['13', '20', '30', '21'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Match the arguments to the parameters by position: $a = 1$, $b = 2$, $c = 10$.\n\n' +
        'Now evaluate `a + b * c`, multiplying first: $1 + 2 \\times 10 = 1 + 20 = 21$.\n\n' +
        'Output: 21.',
      whyWrong: [
        'This treats the `*` as `+`, adding all three values.',
        'This works out $2 \\times 10$ and forgets to add `a`.',
        'This works left to right, $(1 + 2) \\times 10 = 30$, forgetting that `*` is done before `+`.',
        null,
      ],
      keyIdea: 'Match arguments to parameters first, then evaluate the body with the usual order of operations.',
    },
    check: {
      optionValues: [13, 20, 30, 21],
      compute: () => {
        const total = (a: number, b: number, c: number) => a + b * c;
        return total(1, 2, 10);
      },
    },
  },
  {
    id: 'functions-scope-027',
    subtopic: 'functions-scope',
    difficulty: 'exam',
    stem: 'What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: src('function sub(a, b)', '   return a - b', 'end function', '', 'a = 2', 'b = 9', 'print(sub(b, a))'),
    },
    options: ['7', '-7', '11', '9'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Arguments are matched by **position**, not by name.\n\n' +
        '1. The call is `sub(b, a)`, so the values passed are 9 and then 2.\n' +
        '2. Inside the function the parameter `a` is 9 and the parameter `b` is 2.\n' +
        '3. `return a - b` gives $9 - 2 = 7$.\n\n' +
        'Output: 7.',
      whyWrong: [
        null,
        'This matches by name, keeping $a = 2$ and $b = 9$ inside the function. The first value in the call goes to the first parameter, whatever it is called.',
        'This adds the two values. The function subtracts.',
        'This stops at the parameter `a`, which is 9, and forgets to subtract `b`.',
      ],
      keyIdea: 'The names used in a call do not matter: the first argument goes to the first parameter.',
    },
    check: {
      optionValues: [7, -7, 11, 9],
      compute: () => {
        const sub = (p: number, q: number) => p - q;
        const a = 2;
        const b = 9;
        return sub(b, a);
      },
    },
  },
  {
    id: 'functions-scope-028',
    subtopic: 'functions-scope',
    difficulty: 'exam',
    stem: `${LOCAL} What does this pseudocode print? ${ORDER}`,
    code: {
      lang: 'pseudocode',
      source: src('function addTen(n)', '   n = n + 10', '   return n', 'end function', '', 'n = 5', 'm = addTen(n)', 'print(n)', 'print(m)'),
    },
    options: ['`5 15`', '`15 15`', '`5 5`', '`15 5`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A parameter is a local variable, even when it has the same name as an outer variable.\n\n' +
        '1. Outer `n` is 5, and the call passes that value in.\n' +
        '2. Inside, the local `n` becomes $5 + 10 = 15$ and is returned, so $m = 15$.\n' +
        '3. The outer `n` was never changed, so it is still 5.\n\n' +
        'The printed values are 5 then 15.',
      whyWrong: [
        null,
        'This assumes the parameter and the outer `n` are the same variable. Changing the parameter only changes the local copy.',
        'This forgets that `return n` sends back the new local value, 15, which is stored in `m`.',
        'This swaps the two: `n` keeps 5 and `m` receives 15.',
      ],
      keyIdea: 'Changing a parameter inside a function does not change the outer variable passed in.',
    },
    check: {
      optionValues: ['5 15', '15 15', '5 5', '15 5'],
      compute: () => {
        const addTen = (p: number) => {
          const local = p + 10;
          return local;
        };
        const n = 5;
        const m = addTen(n);
        return `${n} ${m}`;
      },
    },
  },
  {
    id: 'functions-scope-029',
    subtopic: 'functions-scope',
    difficulty: 'exam',
    stem: 'What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: src('function triple(x)', '   return 3 * x', 'end function', '', 't = 0', 'for i = 1 to 3', '   t = t + triple(i)', 'end for', 'print(t)'),
    },
    options: ['18', '9', '6', '27'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The function is called once per pass, with the current value of `i`.\n\n' +
        '| i | triple(i) | t |\n' +
        '|---|---|---|\n' +
        '| 1 | 3 | 3 |\n' +
        '| 2 | 6 | 9 |\n' +
        '| 3 | 9 | 18 |\n\n' +
        'Output: 18.',
      whyWrong: [
        null,
        'This is only the last call, `triple(3)`. The line `t = t + triple(i)` keeps adding, so the earlier results stay in `t`.',
        'This adds the values of `i` and forgets to pass them through `triple`.',
        'This uses `triple(3)` on all three passes. Each pass calls the function with its own `i`.',
      ],
      keyIdea: 'A call inside a loop runs once per pass, using the loop variable at that moment.',
    },
    check: {
      optionValues: [18, 9, 6, 27],
      compute: () => {
        const triple = (x: number) => 3 * x;
        let t = 0;
        for (let i = 1; i <= 3; i++) t = t + triple(i);
        return t;
      },
    },
  },
  {
    id: 'functions-scope-030',
    subtopic: 'functions-scope',
    difficulty: 'exam',
    stem: 'What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: src(
        'function f(n)',
        '   for i = 1 to n',
        '      if i * i > n',
        '         return i',
        '      end if',
        '   end for',
        '   return 0',
        'end function',
        '',
        'print(f(10))',
      ),
    },
    options: ['3', '4', '0', '10'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The first `return` reached ends the whole function, including the loop.\n\n' +
        '| i | i * i | i * i > 10? |\n' +
        '|---|---|---|\n' +
        '| 1 | 1 | no |\n' +
        '| 2 | 4 | no |\n' +
        '| 3 | 9 | no |\n' +
        '| 4 | 16 | yes, so return 4 |\n\n' +
        'Output: 4.',
      whyWrong: [
        'This is the last value of `i` where the test is false. The function returns the first `i` where it is true.',
        null,
        'This assumes the last line always runs. `return i` has already ended the function, so `return 0` is never reached.',
        'This assumes the loop runs to the end. `return` stops the loop as well as the function.',
      ],
      keyIdea: 'The first `return` reached ends the function at once, even inside a loop.',
    },
    check: {
      optionValues: [3, 4, 0, 10],
      compute: () => {
        const f = (n: number) => {
          for (let i = 1; i <= n; i++) if (i * i > n) return i;
          return 0;
        };
        return f(10);
      },
    },
  },
  {
    id: 'functions-scope-031',
    subtopic: 'functions-scope',
    difficulty: 'exam',
    stem: 'What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: src(
        'function g(n)',
        '   s = 0',
        '   while (n != 0)',
        '      s = s + n',
        '      n = n - 2',
        '   end while',
        '   return s',
        'end function',
        '',
        'print(g(5))',
      ),
    },
    options: ['9', '15', '8', 'Infinite loop'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Follow `n`, which goes down by 2 on each pass.\n\n' +
        '| n | n != 0? | s after the pass |\n' +
        '|---|---|---|\n' +
        '| 5 | yes | 5 |\n' +
        '| 3 | yes | 8 |\n' +
        '| 1 | yes | 9 |\n' +
        '| -1 | yes | 8 |\n\n' +
        '`n` jumps from 1 to $-1$, so it is never exactly 0. The condition stays true for ever, the function never returns and nothing is printed: **Infinite loop**.',
      whyWrong: [
        'This is $5 + 3 + 1$, assuming the loop stops at 1. The condition is `n != 0`, and 1 is not 0, so the loop carries on past it.',
        'This is $5 + 4 + 3 + 2 + 1$, reading the step as 1. The code subtracts 2.',
        'This is $5 + 3$, stopping before 1 is added. The loop only stops when `n` is exactly 0, which never happens.',
        null,
      ],
      keyIdea: 'A loop testing `n != 0` never ends if the step jumps over 0.',
    },
    check: {
      optionValues: [9, 15, 8, 'Infinite loop'],
      compute: () => {
        let n = 5;
        let s = 0;
        let passes = 0;
        while (n !== 0) {
          if (++passes > 1000) return 'Infinite loop';
          s = s + n;
          n = n - 2;
        }
        return s;
      },
    },
  },
  {
    id: 'functions-scope-032',
    subtopic: 'functions-scope',
    difficulty: 'exam',
    stem: 'What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: src(
        'function square(x)',
        '   return x * x',
        'end function',
        '',
        'function sumSquares(a, b)',
        '   return square(a) + square(b)',
        'end function',
        '',
        'print(sumSquares(2, 3))',
      ),
    },
    options: ['13', '25', '10', '5'],
    correctIndex: 0,
    markScheme: {
      solution:
        'One function can call another. Each inner call finishes and hands back its value before the addition happens.\n\n' +
        '1. `sumSquares(2, 3)` sets $a = 2$, $b = 3$.\n' +
        '2. `square(2)` returns 4 and `square(3)` returns 9.\n' +
        '3. $4 + 9 = 13$ is returned and printed.',
      whyWrong: [
        null,
        'This adds first and squares afterwards: $(2 + 3)^2 = 25$. Each value is squared on its own, then the results are added.',
        'This reads `x * x` as doubling: $4 + 6 = 10$.',
        'This adds the arguments and ignores `square`.',
      ],
      keyIdea: 'When one function calls another, each inner call returns its value before the outer expression is finished.',
    },
    check: {
      optionValues: [13, 25, 10, 5],
      compute: () => {
        const square = (x: number) => x * x;
        const sumSquares = (a: number, b: number) => square(a) + square(b);
        return sumSquares(2, 3);
      },
    },
  },
];
