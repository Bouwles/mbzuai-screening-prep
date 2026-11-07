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
      asking: 'What appears on the screen when this code runs?',
      solution:
        'Lines 1 and 2 only create the function `f`. Nothing inside it runs until something calls it.\n\n' +
        'Line 4 calls `f(5)`, so inside the function `x` is 5. Line 2 works out $5 \\times 2 = 10$ and prints it, so 10 appears on the screen.\n\n' +
        '`print` only shows a value. It does not hand the value back to the line that made the call. Only `return` does that, and `f` has no `return`.\n\n' +
        'A Python function with no `return` hands back `None`, a special value meaning "nothing". So line 4 stores `None` in `result`.\n\n' +
        'Line 5 prints `result`, so the word `None` appears next. The screen has shown 10 and then `None`.',
      conclusion: 'The call prints 10, and `result` holds `None` because nothing was returned, so the answer is `10 None`.',
      whyWrong: [
        'This assumes `print(x * 2)` also hands 10 back to the caller, so `result` would be 10 and the last line would print 10 again. But `print` only displays; `f` has no `return`, so `result` is `None`.',
        'This forgets that calling `f(5)` still runs the `print(x * 2)` inside it, which displays 10 before anything else.',
        null,
        'This forgets the second `print(result)`, which displays the word `None` (printing `None` is not the same as printing nothing).',
      ],
      keyIdea: 'For every function call, ask two separate questions: what does the body print, and what does it return? Write printed values in order. Store the returned value in the variable, using `None` if no `return` runs.',
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
      asking: 'What two numbers come out when `power` is called twice with different values?',
      solution:
        'Line 2 says the function sends back `base` to the power of `exp`. For example, $5^2 = 5 \\times 5 = 25$.\n\n' +
        '`base` and `exp` are the function\'s **parameters**: names that receive the values in a call. The first value in a call goes to the first name, and the second value goes to the second name.\n\n' +
        'Line 5 calls `power(3, 2)`, so `base` is 3 and `exp` is 2. The function returns $3^2 = 3 \\times 3 = 9$, and `print` shows 9.\n\n' +
        'Line 6 calls `power(2, 3)`, so `base` is 2 and `exp` is 3. The function returns $2^3 = 2 \\times 2 \\times 2 = 8$, and `print` shows 8.',
      conclusion: 'The two calls print 9 and then 8, so the answer is `9 8`.',
      whyWrong: [
        'This swaps the arguments in the second call, working out $3^2$. The first value always goes to the first parameter, so that call is $2^3$.',
        'This reads the power sign as multiplication: $3 \\times 2 = 6$ and $2 \\times 3 = 6$.',
        'This swaps the arguments in both calls, working out $2^3$ and then $3^2$. The first value goes to `base`.',
        null,
      ],
      keyIdea: 'Pair the values in each call with the parameter names from left to right, and write the pairs down. Order matters in a function like this, because $3^2$ and $2^3$ are different numbers.',
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
      asking: 'What value do you get from a Python function that never reaches a `return`?',
      solution:
        'A function hands a value back to the line that called it only through a `return` statement.\n\n' +
        'If it finishes without reaching one, Python still has to give the call some value. It gives `None`, a special value meaning "nothing". For example, a function whose only line is `print(5)` shows 5 on the screen but hands back `None`.',
      conclusion: 'With no `return` reached, nothing is handed back, so the call evaluates to `None`.',
      whyWrong: [
        '`0` is a number. Python does not invent a number; a missing `return` gives `None`, which is a different value from `0`.',
        'A Python function only hands back a value through `return`. The last line running does not count as returning it.',
        null,
        'Functions without `return` are legal (for example, functions that only print). No error is raised.',
      ],
      keyIdea: 'To find what a Python call gives, look for the `return` that actually runs. If none runs, the value is `None`, whatever the function printed or calculated along the way.',
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
      asking: 'What is the name for the names written in a function\'s first line?',
      solution:
        'The line `function area(w, h)` sets up the function. `w` and `h` hold no values yet. They are placeholder names for values the function will be given later.\n\n' +
        'A placeholder name in a function\'s definition is called a **parameter**.',
      conclusion: '`w` and `h` are placeholder names in the definition, which makes them Parameters.',
      whyWrong: [
        null,
        'Arguments are the values written in a call, such as 3 and 4 in `area(3, 4)`. Here `w` and `h` are names in the definition.',
        'A return value is what the function sends back when it finishes. It does not appear on the definition line.',
        'A call is the line that runs the function, such as `area(3, 4)`. This line only defines it.',
      ],
      keyIdea: 'Look at where the word sits. Names in the definition line are parameters. Values written in a call are arguments. To remember it: parameters are placeholders, arguments are the actual values.',
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
      asking: 'What is the name for the values you put in the brackets when you run a function?',
      solution:
        '`area(3, 4)` is a **call**: the line that runs the function. The 3 and 4 are real values being handed to it.\n\n' +
        'A value handed to a function in a call is called an **argument**. Here the 3 goes to the first parameter (the first name in the definition), and the 4 goes to the second.',
      conclusion: '3 and 4 are values written in a call, so they are Arguments.',
      whyWrong: [
        'Parameters are the names in the definition line, such as `w` and `h`. The values in a call are the arguments.',
        null,
        'A return value comes out of the function when it finishes. The values 3 and 4 go in.',
        'A local variable is a name used inside the function. The values 3 and 4 are written in the call, outside the function.',
      ],
      keyIdea: 'Look at where the word sits. Values written in a call are arguments. Names in the definition line are parameters. To remember it: arguments are the actual values, parameters are placeholders.',
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
      asking: 'What happens when a function reaches a `return` line?',
      solution:
        'Picture a function `double(x)` containing the line `return 2 * x`. The call `double(4)` reaches that line and works out 8.\n\n' +
        'The function stops there, so any lines below are skipped.\n\n' +
        'The 8 goes back to the line that made the call, where it can be stored or used. Nothing appears on the screen unless that line prints it. So `return` stops the function and hands a value back.',
      conclusion: '`return` does both jobs, so the answer is: Ends the function and sends back a value.',
      whyWrong: [
        null,
        'Printing is what `print` does. A returned value appears on the screen only if the caller prints it.',
        'Running the function again needs another call. `return` leaves the function.',
        'Local variables disappear when the call ends, so nothing is kept for the next call. The value goes back to the caller.',
      ],
      keyIdea: 'Keep three actions apart when tracing. `print` shows a value on the screen. `return` stops the function and hands a value back. `x = ...` changes a variable. Ask which of the three each line does.',
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
      asking: 'Which parts of a program can use a variable created inside a function?',
      solution:
        'A **local variable** is one created inside a function. For example, `s = 0` inside a function creates a local `s`.\n\n' +
        'It exists only while that function runs, and it disappears when the function finishes. The main program and other functions cannot see it.',
      conclusion: 'Nothing outside the function can see it, so a local variable can be used Only inside its function.',
      whyWrong: [
        null,
        'A variable usable everywhere is a global (outer) variable, which is the opposite of local.',
        'The main program is outside the function, so it cannot see the local variable at all.',
        'Another function has its own local variables and cannot use this one. To share a value, pass it as an argument.',
      ],
      keyIdea: 'To check whether a line can use a variable, find where the variable was created. If it was created inside a function, only lines in that same function can use it. To pass a value out, use `return`.',
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
      asking: 'If nothing ever calls a function, how many times do the lines inside it run?',
      solution:
        'Writing a function (its **definition**) only stores the instructions under a name. It is like writing down a recipe without cooking it.\n\n' +
        'The **body** (the lines inside) runs once each time the function is **called**, for example with `f(3)`.\n\n' +
        'Here there are no calls, so the body never runs: 0 times.',
      conclusion: 'The body runs once per call and there are no calls, so the answer is 0.',
      whyWrong: [
        null,
        'This treats the definition as if it also ran the body. A definition only stores the instructions.',
        'Parameters are placeholders for values. They do not make the body run.',
        'Nothing repeats here, because nothing runs at all.',
      ],
      keyIdea: 'To count how many times a function body runs, ignore the definition and count the calls that actually happen, including any calls inside loops. Each call runs the body once.',
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
      asking: 'Which call gives the value 2 to `y`, the second name in `f(x, y)`?',
      solution:
        'An **actual argument** is a value written in a call. A **formal parameter** is a name in the definition. These are the full names for argument and parameter.\n\n' +
        'Arguments go to parameters by position. The first value in the call goes to `x`, and the second value goes to `y`.\n\n' +
        'So 2 must be the second value, and something else must come first so that `x` gets a value too. In `f(1, 2)`, `x` gets 1 and `y` gets 2.',
      conclusion: 'Only `f(1, 2)` has the value 2 in second place, so `y` receives 2.',
      whyWrong: [
        'Here 2 is the first argument, so it goes to the first parameter, `x`.',
        null,
        'A single argument goes to the first parameter, `x`, and `y` gets no value at all.',
        'This passes the value of a variable called `y` to the first parameter. It does not pass 2, and names do not decide the matching.',
      ],
      keyIdea: 'Write the definition\'s names above the call\'s values and pair them from left to right. The position decides the match. The names of any variables in the call make no difference.',
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
      asking: 'What do the two `print` lines show, one inside the function and one outside?',
      solution:
        'A variable is **assigned** when it is given a value with `=`. The stem tells us that a variable assigned inside a function is **local**: a new variable that exists only inside that function.\n\n' +
        'So `x` on line 4 is a different variable from `x` on line 1, even though the names match. Changing one does not touch the other.\n\n' +
        'Lines 3 to 6 only define the function, so they do nothing until line 8 calls it. Here is each line that runs, with the two variables in separate columns:\n\n| Line | Outer `x` | Local `x` | Printed |\n|---|---|---|---|\n| 1 | 10 | - | - |\n| 4 | 10 | 5 | - |\n| 5 | 10 | 5 | 5 |\n| 9 | 10 | gone | 10 |',
      conclusion: 'The function prints its local 5, and the outer `x` is still 10 on line 9, so the answer is `5 10`.',
      whyWrong: [
        'This assumes `x = 5` inside the function changes the outer `x`. It creates a separate local variable, so the outer one stays 10.',
        null,
        'This assumes the `print(x)` inside the function sees the outer `x`. The function has just made its own `x = 5`, and that one is used inside.',
        'This has the two values the wrong way round: the function prints its local 5 first, and the outer 10 is printed last.',
      ],
      keyIdea: 'Keep one column for outer variables and one for local variables. A name assigned inside a function goes in the local column, and that column is wiped when the function ends. Printing outside the function reads the outer column.',
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
      asking: 'What number do you get when `addOne` and `double` are used on 3?',
      solution:
        'Line 9 has one call inside another. `double` needs its value before it can start, so the inner call `addOne(3)` must finish first. Always work from the inside out.\n\n' +
        'Inner call: in `addOne(3)`, `x` is 3, so line 6 returns $3 + 1 = 4$.\n\n' +
        'That returned 4 takes the place of the inner call, so line 9 now reads `print(double(4))`.\n\n' +
        'Outer call: in `double(4)`, `x` is 4, so line 2 returns $2 \\times 4 = 8$. `print` shows that value.',
      conclusion: 'Adding one first gives 4, and doubling that gives 8, so the answer is 8.',
      whyWrong: [
        'This runs `double` first: $2 \\times 3 + 1 = 7$. The inner call `addOne(3)` must finish before `double` can start.',
        null,
        'This stops after the inner call. The value 4 is then passed to `double`.',
        'This ignores `addOne` and doubles 3 directly.',
      ],
      keyIdea: 'For nested calls like `f(g(a))`, work from the inside out. Work out the innermost call, replace it with the value it returned, then do the next call out.',
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
      asking: 'What does `check` give for 9, and what does it give for 7?',
      solution:
        '`range(2, n)` counts from 2 and stops before `n`, so `n` itself is not included. `n % i` is the remainder when `n` is divided by `i`. For example, `7 % 2` is 1, because $7 \\div 2$ is 3 remainder 1.\n\n' +
        'A remainder of 0 means `i` divides `n` exactly. As soon as that happens, line 4 runs `return False`. A `return` ends the function at once, so the loop stops too.\n\n' +
        'Line 5 runs only if the loop finishes without that ever happening.\n\n' +
        'For `check(9)`, `range(2, 9)` starts 2, 3, and so on. The function stops as soon as a remainder is 0:\n\n| `i` | `9 % i` | Is it 0? |\n|---|---|---|\n| 2 | 1 | no |\n| 3 | 0 | yes, so `return False` |\n\n' +
        'For `check(7)`, `range(2, 7)` gives 2, 3, 4, 5, 6. No remainder is 0, so the loop finishes and line 5 runs `return True`:\n\n| `i` | `7 % i` |\n|---|---|\n| 2 | 1 |\n| 3 | 1 |\n| 4 | 3 |\n| 5 | 2 |\n| 6 | 1 |',
      conclusion: '`check(9)` finds the divisor 3 and `check(7)` finds none. Line 7 prints the two results in order, so the answer is `False True`.',
      whyWrong: [
        'This has the logic backwards: finding a divisor makes the function return `False`, not `True`.',
        'This assumes the loop keeps going after `return False` and the last line `return True` wins. A `return` ends the function at once.',
        'This assumes `range(2, 7)` includes 7, so $7 \\bmod 7 = 0$ would return `False`. `range(2, n)` stops at $n - 1$.',
        null,
      ],
      keyIdea: 'When a loop has a `return` inside an `if`, trace row by row and stop at the first row where the `if` is true. The line after the loop only runs if no row ever passes. Also check where `range` stops.',
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
      asking: 'What is in `y` after `f` is used twice, with the first result fed into the second call?',
      solution:
        'Line 2 is the rule: double the first value, then add the second. Multiplying comes before adding.\n\n' +
        'Line 5 calls `f(3, 4)`, so `a` is 3 and `b` is 4. It returns $3 \\times 2 + 4 = 6 + 4 = 10$. Line 5 stores that in `x`, so `x` is 10.\n\n' +
        'Line 6 calls `f(x, 5)`. `x` holds 10, so `a` is 10 and `b` is 5. It returns $10 \\times 2 + 5 = 20 + 5 = 25$. Line 6 stores that in `y`, and line 7 prints `y`.',
      conclusion: 'The first call gives 10, which feeds the second call, so `y` holds the printed answer 25.',
      whyWrong: [
        'This is the value of `x` after the first call. The program prints `y`, which needs the second call `f(10, 5)`.',
        null,
        'This swaps the parameters, working out `b * 2 + a`: $4 \\times 2 + 3 = 11$, then $5 \\times 2 + 11 = 21$. Arguments go to parameters in order, so the first one is `a`.',
        'This adds before multiplying, working out $a \\times (2 + b)$: $3 \\times 6 = 18$, then $18 \\times 7 = 126$. Multiplication comes before addition.',
      ],
      keyIdea: 'When one call\'s result feeds another, write each call on its own line: the values, the sum, then where the result is stored. Put the stored value into the next call before you calculate.',
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
      asking: 'What number comes back from `total` when it is given 1, 2 and 10?',
      solution:
        'Values go to the function\'s names, called **parameters**, in order. So `a` is 1, `b` is 2 and `c` is 10.\n\n' +
        'Put them into line 2. `a + b * c` becomes $1 + 2 \\times 10$, because `*` means multiply.\n\n' +
        'Multiplying comes before adding, even though the `+` is written first. So work out $2 \\times 10 = 20$ first.\n\n' +
        'Then add: $1 + 20 = 21$. The function returns this, and line 5 prints it.',
      conclusion: 'Multiplying first gives 20, and adding the 1 gives 21, so the answer is 21.',
      whyWrong: [
        'This treats the `*` as `+`, adding all three values.',
        'This works out $2 \\times 10$ and forgets to add `a`.',
        'This works left to right, $(1 + 2) \\times 10 = 30$, forgetting that `*` is done before `+`.',
        null,
      ],
      keyIdea: 'To work out a function call, pair values with parameter names from left to right, substitute them, then calculate in the right order: brackets, then `*` and `/`, then `+` and `-`.',
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
      asking: 'What does `sub` give back when the call passes `b` first and `a` second?',
      solution:
        'Lines 5 and 6 create outer variables: `a` is 2 and `b` is 9.\n\n' +
        'Line 7 calls `sub(b, a)`. First replace each name with its value. `b` is 9 and `a` is 2, so the call is really `sub(9, 2)`.\n\n' +
        'Values go to the function\'s names, called **parameters**, by position. The first value, 9, goes to the first name, `a`. The second value, 2, goes to `b`. Inside the function `a` is 9 and `b` is 2, the opposite way round from outside.\n\n' +
        'Line 2 returns $9 - 2 = 7$, and line 7 prints it.',
      conclusion: 'Inside the function `a` is 9 and `b` is 2, so it returns and prints 7.',
      whyWrong: [
        null,
        'This matches by name, keeping $a = 2$ and $b = 9$ inside the function. The first value in the call goes to the first parameter, whatever it is called.',
        'This adds the two values. The function subtracts.',
        'This stops at the parameter `a`, which is 9, and forgets to subtract `b`.',
      ],
      keyIdea: 'Turn each name in the call into its value first, so the call has plain numbers. Then match left to right with the parameters. Ignore any outer variable that happens to share a name with a parameter.',
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
      asking: 'After the call, what is in the outer `n`, and what is in `m`?',
      solution:
        'A **parameter** is a name in a function\'s first line, and it acts as a local variable. So the `n` on lines 1 to 3 is separate from the `n` on line 6, even though the names match.\n\n' +
        'Line 7 passes the value of the outer `n`, which is 5, into the parameter. Only the value is passed, so the function gets its own copy to work on.\n\n' +
        'Here is each line that runs, with the two variables in separate columns. Lines 8 and 9 print the outer `n` and then `m`:\n\n| Line | Outer `n` | Parameter `n` | `m` | Printed |\n|---|---|---|---|---|\n| 6 | 5 | - | - | - |\n| 7, passes 5 in | 5 | 5 | - | - |\n| 2, $5 + 10 = 15$ | 5 | 15 | - | - |\n| 3 and 7, returns 15 into `m` | 5 | gone | 15 | - |\n| 8 | 5 | gone | 15 | 5 |\n| 9 | 5 | gone | 15 | 15 |',
      conclusion: 'The outer `n` never changed and `m` received the returned 15, so the answer is `5 15`.',
      whyWrong: [
        null,
        'This assumes the parameter and the outer `n` are the same variable. Changing the parameter only changes the local copy.',
        'This forgets that `return n` sends back the new local value, 15, which is stored in `m`.',
        'This swaps the two: `n` keeps 5 and `m` receives 15.',
      ],
      keyIdea: 'Draw separate columns for the outer variable and the parameter, even when the names match. Changing the parameter changes only its own column. The result gets out only through `return`, stored by the line that made the call.',
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
      asking: 'What total do you get by adding `triple(1)`, `triple(2)` and `triple(3)`?',
      solution:
        '`triple(x)` returns 3 times its input. `for i = 1 to 3` runs line 7 with `i` as 1, then 2, then 3.\n\n' +
        '`t` is a **running total**. It starts at 0 on line 5. Line 7 takes the old `t`, adds the value returned by `triple(i)`, and stores the result back in `t`.\n\n' +
        'Trace each pass. Line 9 prints the value of `t` in the last row:\n\n| Pass | `i` | `triple(i)` returns | `t` becomes |\n|---|---|---|---|\n| 1 | 1 | $3 \\times 1 = 3$ | $0 + 3 = 3$ |\n| 2 | 2 | $3 \\times 2 = 6$ | $3 + 6 = 9$ |\n| 3 | 3 | $3 \\times 3 = 9$ | $9 + 9 = 18$ |',
      conclusion: 'Adding 3, 6 and 9 to a total that starts at 0 gives 18, so the answer is 18.',
      whyWrong: [
        null,
        'This is only the last call, `triple(3)`. The line `t = t + triple(i)` keeps adding, so the earlier results stay in `t`.',
        'This adds the values of `i` and forgets to pass them through `triple`.',
        'This uses `triple(3)` on all three passes. Each pass calls the function with its own `i`.',
      ],
      keyIdea: 'When a loop calls a function, draw one row per pass: the loop variable, the value the call returns, and the running total. Work out the call first, then update the total from its old value.',
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
      asking: 'What is the first value of `i` whose square is bigger than 10?',
      solution:
        'The call `f(10)` sets `n` to 10. So the loop on line 2 tries `i` as 1, 2, 3 and so on, up to 10.\n\n' +
        'Line 3 checks whether `i * i` (`i` squared) is bigger than `n`. As soon as it is, line 4 runs `return i`. A `return` ends the whole function at once, so the loop stops too.\n\n' +
        'Test each `i` in order until the test is true. Line 7 is never reached, and line 10 prints what the function returned:\n\n| `i` | `i * i` | Is it bigger than 10? |\n|---|---|---|\n| 1 | 1 | no |\n| 2 | 4 | no |\n| 3 | 9 | no |\n| 4 | 16 | yes, so `return 4` |',
      conclusion: '4 is the first `i` whose square is above 10, so `f(10)` returns and prints 4.',
      whyWrong: [
        'This is the last value of `i` where the test is false. The function returns the first `i` where it is true.',
        null,
        'This assumes the last line always runs. `return i` has already ended the function, so `return 0` is never reached.',
        'This assumes the loop runs to the end. `return` stops the loop as well as the function.',
      ],
      keyIdea: 'A `return` inside a loop means "stop at the first value that passes". Trace row by row, test the condition, and stop at the first true. The line after the loop runs only if no row ever passes.',
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
      asking: 'Does the loop inside `g` ever finish when `n` starts at 5?',
      solution:
        '`!=` means "is not equal to". So line 3 keeps the loop going while `n` is anything other than 0. The only way out is for `n` to be exactly 0.\n\n' +
        'The call `g(5)` sets `n` to 5, and line 5 takes 2 off on each pass. Follow `n`:\n\n| Pass | `n` at the start | `n != 0`? | `n` after line 5 |\n|---|---|---|---|\n| 1 | 5 | true | 3 |\n| 2 | 3 | true | 1 |\n| 3 | 1 | true | $-1$ |\n| 4 | $-1$ | true | $-3$ |\n\n' +
        '`n` goes from 1 straight to $-1$, jumping over 0. Taking 2 from an odd number always leaves an odd number, and 0 is even. So `n` is never 0.\n\n' +
        'So the condition on line 3 can never become false. The loop never ends, line 7 is never reached, and line 10 prints nothing.',
      conclusion: '`n` can never become 0, so the loop never ends and the answer is Infinite loop.',
      whyWrong: [
        'This is $5 + 3 + 1$, assuming the loop stops at 1. The condition is `n != 0`, and 1 is not 0, so the loop carries on past it.',
        'This is $5 + 4 + 3 + 2 + 1$, reading the step as 1. The code subtracts 2.',
        'This is $5 + 3$, stopping before 1 is added. The loop only stops when `n` is exactly 0, which never happens.',
        null,
      ],
      keyIdea: 'For `while (n != target)`, write out the values `n` takes and see whether it lands exactly on the target or jumps over it. Stepping by 2 from an odd number jumps over 0. A test like `n > 0` would stop.',
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
      asking: 'What is 2 squared plus 3 squared, worked out by these two functions?',
      solution:
        'Line 9 calls `sumSquares(2, 3)`, so `a` is 2 and `b` is 3.\n\n' +
        'With those values, line 6 reads `square(2) + square(3)`. It needs two other calls to finish before it can add.\n\n' +
        '`square(2)`: here `x` is 2, so line 2 returns $2 \\times 2 = 4$.\n\n' +
        '`square(3)`: here `x` is 3, so line 2 returns $3 \\times 3 = 9$.\n\n' +
        'Line 6 adds the two returned values: $4 + 9 = 13$. It returns 13 to line 9, which prints it.',
      conclusion: 'Each value is squared on its own and then added: $4 + 9$ gives 13.',
      whyWrong: [
        null,
        'This adds first and squares afterwards: $(2 + 3)^2 = 25$. Each value is squared on its own, then the results are added.',
        'This reads `x * x` as doubling: $4 + 6 = 10$.',
        'This adds the arguments and ignores `square`.',
      ],
      keyIdea: 'When one function calls another, pause the outer function, work out each inner call on its own line, and replace it with its returned value. Only then finish the outer line.',
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
