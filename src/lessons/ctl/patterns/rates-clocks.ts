import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'rates-clocks',
  know:
    '### What a rate is\n\n' +
    'A **rate** tells you how much of one thing happens per one unit of another: kilometres per hour, dirhams per gram, tanks per hour, jobs per day. Almost every question in this topic is solved by finding the rate for **one** unit, then scaling up.\n\n' +
    '### Speed, distance and time\n\n' +
    '$$\\text{speed} = \\frac{\\text{distance}}{\\text{time}} \\qquad \\text{distance} = \\text{speed} \\times \\text{time} \\qquad \\text{time} = \\frac{\\text{distance}}{\\text{speed}}$$\n\n' +
    'Units must match. If the speed is in km/h, the time must be in **hours**:\n\n' +
    '| Time | In hours |\n' +
    '| --- | --- |\n' +
    '| 15 min | $0.25$ |\n' +
    '| 20 min | $\\frac{1}{3}$ |\n' +
    '| 45 min | $0.75$ |\n' +
    '| 2 h 15 min | $2.25$ (not $2.15$) |\n\n' +
    'To change km/h into m/s, divide by $3.6$ (because $1$ km/h $= \\frac{1000}{3600}$ m/s). So $72$ km/h $= 20$ m/s.\n\n' +
    '**Average speed** is always total distance divided by total time. It is usually **not** the average of the speeds. Going $60$ km/h and returning $40$ km/h over the same road gives $48$ km/h, not $50$, because you spend more time on the slow leg.\n\n' +
    '### Relative speed: two moving objects\n\n' +
    '- **Towards each other** (or moving apart): the gap changes at the **sum** of the speeds.\n' +
    '- **Same direction** (a chase): the gap changes at the **difference** of the speeds.\n\n' +
    'For a catch-up problem: work out the **head start** (how far ahead the first one is when the second starts), then divide by the difference in speeds.\n\n' +
    'A train passing through a tunnel or over a bridge must travel **its own length plus** the tunnel length. Passing a post or a person standing still: just its own length.\n\n' +
    'For boats: downstream speed $= b + c$, upstream speed $= b - c$ ($b$ = boat in still water, $c$ = current).\n\n' +
    '### Work rates (people, pipes, machines)\n\n' +
    'If someone finishes a job in $6$ hours, they do $\\frac{1}{6}$ of the job each hour. **Rates add, times do not.** Two workers taking $a$ and $b$ hours together do $\\frac{1}{a} + \\frac{1}{b}$ of the job per hour, and the time is $1$ divided by that.\n\n' +
    'A pipe that **empties** the tank has a negative rate: subtract it.\n\n' +
    'Sense check: working together must be faster than the fastest person alone.\n\n' +
    'For "machines and hours" problems, find the output of **one machine in one hour** first, then multiply by the new number of machines and hours.\n\n' +
    '### Clock angles\n\n' +
    '- The minute hand turns $360^\\circ$ in $60$ minutes: $6^\\circ$ per minute.\n' +
    '- The hour hand turns $30^\\circ$ per hour, which is $0.5^\\circ$ per minute. It does **not** jump from number to number; at half past, it is halfway between two numbers.\n\n' +
    'At $H$ hours and $M$ minutes, the angle between the hands is $|30H - 5.5M|$. If that is over $180^\\circ$, the smaller angle is $360^\\circ$ minus it.\n\n' +
    'The minute hand **gains** $5.5^\\circ$ per minute on the hour hand. That is the "relative speed" for clock puzzles such as "when are the hands next at right angles?". It laps the hour hand $11$ times in $12$ hours, so the hands overlap $11$ times and form a right angle $22$ times in $12$ hours.\n\n' +
    '### Days, dates and time zones\n\n' +
    'Weekdays repeat every $7$ days, so divide the number of days by $7$ and move forward by the **remainder**. A normal year has $365 = 52 \\times 7 + 1$ days, so the same date moves forward $1$ weekday; across a 29 February it moves forward $2$.\n\n' +
    'For time zones, do the time arithmetic in one zone first, then shift by the difference in UTC offsets. A place with a smaller offset is **behind** (earlier clock time). Remember to roll over to the next day when you pass 24:00.\n\n' +
    '### Unit rates and proportion\n\n' +
    'To compare deals or scale a recipe, convert to the same units, find the cost (or amount) for **one** unit, then multiply. Ask: if one quantity doubles, should the answer double (direct proportion) or halve (inverse proportion, like more workers needing fewer days)?\n\n' +
    'Example of inverse proportion: $4$ workers finish a job in $6$ days, so the job is $4 \\times 6 = 24$ worker-days. With $3$ workers it takes $\\frac{24}{3} = 8$ days (fewer workers, more days).',
  formulas: [
    { label: 'Speed, distance, time', tex: '\\text{speed} = \\frac{\\text{distance}}{\\text{time}}', note: 'Make the time units match the speed units (hours for km/h).' },
    { label: 'Average speed', tex: '\\bar{v} = \\frac{\\text{total distance}}{\\text{total time}}' },
    { label: 'Average speed, two equal distances', tex: '\\bar{v} = \\frac{2ab}{a + b}', note: 'Here $a$ and $b$ are the two speeds. It is not $\\frac{a + b}{2}$.' },
    { label: 'km/h to m/s', tex: '1 \\text{ km/h} = \\frac{1000}{3600} \\text{ m/s}, \\text{ so divide by } 3.6' },
    { label: 'Relative speed, towards each other', tex: 'v_{\\text{rel}} = v_1 + v_2' },
    { label: 'Relative speed, same direction', tex: 'v_{\\text{rel}} = v_{\\text{fast}} - v_{\\text{slow}}' },
    { label: 'Catch-up time', tex: 't = \\frac{\\text{head-start distance}}{v_{\\text{fast}} - v_{\\text{slow}}}' },
    { label: 'Boat and current', tex: '\\text{down} = b + c, \\quad \\text{up} = b - c, \\quad b = \\frac{\\text{down} + \\text{up}}{2}' },
    { label: 'Work rate', tex: '\\text{rate} = \\frac{1}{\\text{time for the whole job}}' },
    { label: 'Two workers together', tex: '\\frac{1}{T} = \\frac{1}{a} + \\frac{1}{b} \\implies T = \\frac{ab}{a + b}' },
    { label: 'Fill pipe with a drain', tex: '\\frac{1}{T} = \\frac{1}{a} - \\frac{1}{b}', note: '$a$ = time to fill, $b$ = time to empty (it fills only if $b > a$).' },
    { label: 'Clock hands', tex: '\\text{minute hand: } 6^\\circ \\text{ per min}, \\quad \\text{hour hand: } 0.5^\\circ \\text{ per min}' },
    { label: 'Angle between the hands at H:M', tex: '\\theta = |30H - 5.5M|', note: 'Use the 12-hour value of $H$. If the result is over $180^\\circ$, use $360^\\circ$ minus it.' },
    { label: 'Days of the week', tex: '\\text{shift} = (\\text{number of days}) \\bmod 7' },
  ],
  examples: [
    {
      title: 'Average speed with mixed units',
      problem: 'A bus travels $54$ km in $1$ hour $30$ minutes. What is its average speed in km/h?',
      steps: [
        'Convert the time to hours: $30$ minutes $= \\frac{30}{60} = 0.5$ h, so the time is $1.5$ h.',
        'Speed $= \\frac{\\text{distance}}{\\text{time}} = \\frac{54}{1.5}$.',
        '$\\frac{54}{1.5} = 36$ km/h.',
      ],
      answer: '$36$ km/h',
    },
    {
      title: 'Clock angle',
      problem: 'Find the smaller angle between the hands of a clock at $3{:}40$.',
      steps: [
        'Minute hand: $40 \\times 6 = 240^\\circ$ from 12.',
        'Hour hand: $3 \\times 30 + 40 \\times 0.5 = 90 + 20 = 110^\\circ$ from 12.',
        'Difference: $240 - 110 = 130^\\circ$.',
        '$130^\\circ$ is less than $180^\\circ$, so it is already the smaller angle. (Formula check: $|90 - 220| = 130$.)',
      ],
      answer: '$130^\\circ$',
    },
    {
      title: 'Two pipes and a drain',
      problem: 'Pipe A fills a tank in $3$ hours and pipe B fills it in $6$ hours. A drain empties a full tank in $4$ hours. All three are opened on an empty tank. How long does it take to fill?',
      steps: [
        'Rates in tanks per hour: A $= +\\frac{1}{3}$, B $= +\\frac{1}{6}$, drain $= -\\frac{1}{4}$.',
        'Use a common denominator of $12$: $\\frac{4}{12} + \\frac{2}{12} - \\frac{3}{12} = \\frac{3}{12} = \\frac{1}{4}$ tank per hour.',
        'Time $= 1 \\div \\frac{1}{4} = 4$ hours.',
        'Sense check: A and B alone would take $1 \\div \\frac{1}{2} = 2$ hours; the drain slows them down, so $4$ hours is reasonable.',
      ],
      answer: '$4$ hours',
    },
    {
      title: 'Catch-up (exam level)',
      problem: 'A walker leaves a park at 10:00 am at $5$ km/h. A cyclist leaves the same park at 10:24 am on the same path at $15$ km/h. At what time does the cyclist catch the walker?',
      steps: [
        'Head start: the walker has walked $24$ minutes $= \\frac{24}{60} = 0.4$ h, so is $5 \\times 0.4 = 2$ km ahead.',
        'Same direction, so the closing speed is $15 - 5 = 10$ km/h.',
        'Time to close the gap: $\\frac{2}{10} = 0.2$ h $= 12$ minutes after the cyclist leaves.',
        '10:24 am plus $12$ minutes is 10:36 am.',
        'Check: walker $5 \\times 0.6 = 3$ km; cyclist $15 \\times 0.2 = 3$ km. Same place.',
      ],
      answer: '10:36 am',
    },
  ],
  traps: [
    'Writing 2 hours 15 minutes as $2.15$ h. Minutes are sixtieths of an hour: $15$ minutes is $0.25$ h, so the time is $2.25$ h.',
    'Averaging two speeds for a round trip. Average speed is total distance over total time; for equal distances use $\\frac{2ab}{a + b}$.',
    'Adding the times in work problems ("6 hours plus 3 hours"). Add the **rates** $\\frac{1}{6} + \\frac{1}{3}$, then flip the result to get the time.',
    'Leaving the hour hand exactly on the number. At 7:20 the hour hand has moved $10^\\circ$ past the 7, because it moves $0.5^\\circ$ every minute.',
    'Using the sum of the speeds in a chase (or the difference when objects approach each other). Same direction: subtract. Opposite directions: add.',
    'Forgetting the train\'s own length when it passes through a tunnel, or forgetting to convert km/h to m/s when lengths are in metres.',
  ],
  examTip:
    'Expect a short word problem with four numerical options, roughly a minute per question. The wrong options are almost always the results of the classic slips listed above, so use quick checks to eliminate them:\n\n' +
    '- **Work together:** the answer must be **less** than the fastest single time. That instantly removes the "add the times" and "average the times" options.\n' +
    '- **Fill with a drain:** the answer must be **more** than the fill time alone.\n' +
    '- **Round-trip average speed:** it lies between the two speeds and is **below** their plain average.\n' +
    '- **Clock angle:** the smaller angle is never above $180^\\circ$. If an option equals $360^\\circ$ minus another option, one is the reflex trap. If an option is a multiple of $30^\\circ$ for a time like 7:20, it probably ignores the hour hand\'s movement.\n' +
    '- **Plug an option back in:** for a catch-up time, check that both travellers have covered the same distance at that moment. It takes seconds on a calculator.\n' +
    '- **Units:** if lengths are in metres and speed in km/h, divide the speed by $3.6$ first.',
};
