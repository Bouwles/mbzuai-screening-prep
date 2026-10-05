import type { StaticQuestion } from '../../../types';
import { Frac } from '../../../lib/frac';

// ---- helpers used only by the answer checks (re-derive answers from the raw numbers) ----

/** Smaller angle (degrees) between the hands of an analogue clock at h:m. */
function clockAngle(h: number, m: number): number {
  const hour = 30 * (h % 12) + 0.5 * m;
  const minute = 6 * m;
  const raw = Math.abs(hour - minute) % 360;
  return Math.min(raw, 360 - raw);
}

const WEEK_MON = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** Time (hours) for workers with the given individual times to finish one job together. */
const together = (...times: number[]) => new Frac(1).div(times.reduce((acc, t) => acc.add(new Frac(1, t)), new Frac(0)));

export const questions: StaticQuestion[] = [
  // ================================================================ foundation
  {
    id: 'rates-clocks-001',
    subtopic: 'rates-clocks',
    difficulty: 'foundation',
    stem: 'A car travels $180$ km in $2$ hours $15$ minutes. What is its average speed?',
    options: ['$90$ km/h', '$405$ km/h', '$80$ km/h', '$83.7$ km/h (to 1 d.p.)'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Speed $= \\frac{\\text{distance}}{\\text{time}}$, with the time in **hours** because the answer is in km/h.\n\n' +
        'Convert the time: $15$ minutes $= \\frac{15}{60} = 0.25$ hours, so $2$ h $15$ min $= 2.25$ hours.\n\n' +
        '$$\\text{speed} = \\frac{180}{2.25} = 80 \\text{ km/h}$$\n\n' +
        'Sense check: in $2$ hours at $80$ km/h you cover $160$ km, and the extra quarter hour adds $20$ km, giving $180$ km.',
      whyWrong: [
        'This is $\\frac{180}{2}$: it ignores the extra $15$ minutes completely.',
        'This is $180 \\times 2.25$: it multiplies distance by time instead of dividing.',
        null,
        'This is $\\frac{180}{2.15}$: it treats "2 hours 15 minutes" as the decimal $2.15$ hours. There are $60$ minutes in an hour, so $15$ minutes is $0.25$ h, not $0.15$ h.',
      ],
      keyIdea: 'Convert minutes to hours by dividing by $60$ before dividing the distance by the time.',
    },
    check: { optionValues: [90, 405, 80, 83.7], compute: () => 180 / (2 + 15 / 60) },
  },
  {
    id: 'rates-clocks-002',
    subtopic: 'rates-clocks',
    difficulty: 'foundation',
    stem: 'What is the **smaller** angle between the hour hand and the minute hand of a clock at $9{:}30$?',
    options: ['$90^\\circ$', '$105^\\circ$', '$75^\\circ$', '$255^\\circ$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Measure both hands clockwise from 12.\n\n' +
        '- The minute hand turns $360^\\circ$ in $60$ minutes, so $6^\\circ$ per minute. At $30$ minutes it is at $30 \\times 6 = 180^\\circ$.\n' +
        '- The hour hand turns $30^\\circ$ per hour **and** keeps moving between the numbers at $0.5^\\circ$ per minute. At $9{:}30$ it is at $9 \\times 30 + 30 \\times 0.5 = 270 + 15 = 285^\\circ$.\n\n' +
        'Difference: $285 - 180 = 105^\\circ$. This is less than $180^\\circ$, so it is already the smaller angle.\n\n' +
        'Formula check: $|30H - 5.5M| = |270 - 165| = 105^\\circ$.',
      whyWrong: [
        'This is $270 - 180$: it leaves the hour hand pointing exactly at 9. At half past, the hour hand is halfway between 9 and 10.',
        null,
        'This moves the hour hand $15^\\circ$ the wrong way (back towards 8) instead of on towards 10: $255 - 180 = 75$.',
        'This is the reflex angle $360 - 105$, the larger way round. The question asks for the smaller angle.',
      ],
      keyIdea: 'The minute hand moves $6^\\circ$ per minute and the hour hand $0.5^\\circ$ per minute, so the angle is $|30H - 5.5M|$.',
    },
    check: { optionValues: [90, 105, 75, 255], compute: () => clockAngle(9, 30) },
  },
  {
    id: 'rates-clocks-003',
    subtopic: 'rates-clocks',
    difficulty: 'foundation',
    stem: 'A $750$ g bag of rice costs AED 21. At the same price per gram, how much would $2$ kg of rice cost?',
    options: ['AED 42', 'AED 5.60', 'AED 28', 'AED 56'],
    correctIndex: 3,
    markScheme: {
      solution:
        'First make the units match: $2$ kg $= 2000$ g.\n\n' +
        'Unit rate (price of one gram): $\\frac{21}{750} = 0.028$ AED per gram.\n\n' +
        'Cost of $2000$ g: $2000 \\times 0.028 = 56$.\n\n' +
        'Alternative without decimals: $2000$ g is $\\frac{2000}{750} = \\frac{8}{3}$ bags, and $\\frac{8}{3} \\times 21 = 56$. So the cost is AED 56.',
      whyWrong: [
        'This doubles AED 21, as if one bag were $1$ kg. A bag is only $750$ g.',
        'This uses $2$ kg $= 200$ g. There are $1000$ g in a kilogram, so $2$ kg $= 2000$ g.',
        'This is the price of **one** kilogram ($\\frac{21}{750} \\times 1000 = 28$). You need two kilograms.',
        null,
      ],
      keyIdea: 'Convert to the same unit, find the price of one unit, then multiply by the amount you need.',
    },
    check: { optionValues: [42, 5.6, 28, 56], compute: () => (21 / 750) * (2 * 1000) },
  },
  {
    id: 'rates-clocks-004',
    subtopic: 'rates-clocks',
    difficulty: 'foundation',
    stem: 'Pipe P fills an empty tank in $6$ hours. Pipe Q fills the same tank in $3$ hours. If both pipes are opened together, how long does it take to fill the empty tank?',
    options: ['$2$ hours', '$4.5$ hours', '$9$ hours', '$30$ minutes'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Work with **rates** (fraction of the tank filled per hour), not with times.\n\n' +
        '- P fills $\\frac{1}{6}$ of the tank per hour.\n' +
        '- Q fills $\\frac{1}{3}$ of the tank per hour.\n\n' +
        'Together: $\\frac{1}{6} + \\frac{1}{3} = \\frac{1}{6} + \\frac{2}{6} = \\frac{3}{6} = \\frac{1}{2}$ of the tank per hour.\n\n' +
        'Time $= \\frac{1}{\\text{rate}} = 1 \\div \\frac{1}{2} = 2$ hours.\n\n' +
        'Sense check: together they must be faster than the faster pipe alone ($3$ hours), and $2 < 3$.',
      whyWrong: [
        null,
        'This averages the two times, $\\frac{6 + 3}{2}$. Two pipes together are faster than either pipe alone, so the answer must be under $3$ hours.',
        'This adds the two times. Adding times would mean the second pipe slows the first down.',
        'This stops at the combined rate, $\\frac{1}{2}$ tank per hour, and reads it as $\\frac{1}{2}$ hour. The time is the reciprocal of the rate: $1 \\div \\frac{1}{2} = 2$ hours.',
      ],
      keyIdea: 'Add the rates ($\\frac{1}{\\text{time}}$ each), never the times, then take the reciprocal of the total rate.',
    },
    check: { optionValues: [2, 4.5, 9, 0.5], compute: () => together(6, 3).value() },
  },
  {
    id: 'rates-clocks-005',
    subtopic: 'rates-clocks',
    difficulty: 'foundation',
    stem: 'Today is a Wednesday. What day of the week will it be $100$ days from today?',
    options: ['Monday', 'Thursday', 'Wednesday', 'Friday'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The days of the week repeat every $7$ days, so only the **remainder** after dividing by $7$ matters.\n\n' +
        '$100 = 14 \\times 7 + 2$, so $100 \\bmod 7 = 2$.\n\n' +
        'After $98$ days ($14$ full weeks) it is Wednesday again. Two more days: Wednesday, Thursday, **Friday**.',
      whyWrong: [
        'This counts the $2$ extra days backwards (Wednesday, Tuesday, Monday). "From today" means forwards.',
        'This counts today as day $1$, so it moves only $99$ days ($99 \\bmod 7 = 1$). "100 days from today" means $100$ days after today.',
        'This assumes $100$ days is a whole number of weeks. It is not: $98$ is, so there are $2$ days left over.',
        null,
      ],
      keyIdea: 'For day-of-the-week problems, divide the number of days by 7 and move forward by the remainder.',
    },
    check: { optionValues: ['Monday', 'Thursday', 'Wednesday', 'Friday'], compute: () => WEEK_MON[(WEEK_MON.indexOf('Wednesday') + 100) % 7] },
  },

  // ================================================================ exam
  {
    id: 'rates-clocks-006',
    subtopic: 'rates-clocks',
    difficulty: 'exam',
    stem: 'Towns A and B are $300$ km apart. At the same moment, a train leaves A heading for B at $70$ km/h and another train leaves B heading for A at $80$ km/h. How far from town A do the trains meet?',
    options: ['$150$ km', '$140$ km', '$2100$ km', '$160$ km'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The trains move **towards** each other, so the gap closes at the sum of their speeds:\n\n' +
        '$$70 + 80 = 150 \\text{ km/h}$$\n\n' +
        'Time until they meet: $\\frac{300}{150} = 2$ hours.\n\n' +
        'In $2$ hours the train from A travels $70 \\times 2 = 140$ km.\n\n' +
        'Check: the other train travels $80 \\times 2 = 160$ km, and $140 + 160 = 300$ km.',
      whyWrong: [
        'This assumes they meet halfway. The slower train covers less ground, so the meeting point is closer to A.',
        null,
        'This uses the difference of the speeds ($80 - 70 = 10$ km/h, giving $30$ hours, then $70 \\times 30$). You subtract speeds only when one object chases another in the same direction.',
        'This is how far the train from **B** travels ($80 \\times 2$). The question asks for the distance from A.',
      ],
      keyIdea: 'Objects moving towards each other close the gap at the sum of their speeds.',
    },
    check: {
      optionValues: [150, 140, 2100, 160],
      compute: () => {
        const t = 300 / (70 + 80);
        return 70 * t;
      },
    },
  },
  {
    id: 'rates-clocks-007',
    subtopic: 'rates-clocks',
    difficulty: 'exam',
    stem: 'A cyclist leaves a village at 9:00 am riding at a steady $12$ km/h. At 9:30 am a car leaves the same village and follows the same road at $48$ km/h. At what time does the car catch up with the cyclist?',
    options: ['9:36 am', '9:10 am', '9:40 am', '9:37:30 am'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Head start.** By 9:30 am the cyclist has ridden for $0.5$ hours: $12 \\times 0.5 = 6$ km ahead.\n\n' +
        '**Closing speed.** Both move in the same direction, so the car gains on the cyclist at $48 - 12 = 36$ km/h.\n\n' +
        '**Time to close the gap.** $\\frac{6}{36} = \\frac{1}{6}$ hour $= 10$ minutes after the car leaves.\n\n' +
        '$9{:}30 + 10$ minutes $=$ 9:40 am.\n\n' +
        'Check: at 9:40 am the cyclist has ridden $\\frac{40}{60}$ h, so $12 \\times \\frac{2}{3} = 8$ km. The car has driven $\\frac{1}{6}$ h, so $48 \\times \\frac{1}{6} = 8$ km. Same place.',
      whyWrong: [
        'This adds the speeds ($6 \\div 60$ h $= 6$ minutes). Adding speeds is for objects moving towards each other. Here the car chases the cyclist, so subtract.',
        'This finds the $10$ minutes correctly but adds them to 9:00 am, when the **cyclist** left. The $10$ minutes are counted from 9:30 am, when the car left.',
        null,
        'This divides the head start by the car\'s own speed ($6 \\div 48$ h $= 7.5$ minutes), forgetting that the cyclist keeps moving forward while the car chases.',
      ],
      keyIdea: 'In a catch-up problem, the time taken is the head-start distance divided by the difference in speeds.',
    },
    check: {
      // values: minutes after 9:00 am
      optionValues: [36, 10, 40, 37.5],
      compute: () => {
        const headStart = 12 * (30 / 60);
        return 30 + (headStart / (48 - 12)) * 60;
      },
    },
  },
  {
    id: 'rates-clocks-008',
    subtopic: 'rates-clocks',
    difficulty: 'exam',
    stem: 'Sara drives from her home to the airport at an average speed of $60$ km/h and returns along the same road at an average speed of $40$ km/h. What is her average speed for the whole round trip?',
    options: ['$50$ km/h', '$48$ km/h', '$100$ km/h', '$24$ km/h'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Average speed $= \\frac{\\text{total distance}}{\\text{total time}}$. It is **not** the average of the two speeds, because she spends longer on the slow leg.\n\n' +
        'The distance is not given, so pick a convenient one that both speeds divide: $120$ km each way.\n\n' +
        '- Going: $\\frac{120}{60} = 2$ hours.\n' +
        '- Returning: $\\frac{120}{40} = 3$ hours.\n\n' +
        'Total distance $= 240$ km, total time $= 5$ hours.\n\n' +
        '$$\\text{average speed} = \\frac{240}{5} = 48 \\text{ km/h}$$\n\n' +
        'Shortcut for equal distances: $\\frac{2 \\times 60 \\times 40}{60 + 40} = \\frac{4800}{100} = 48$.',
      whyWrong: [
        'This is the plain average $\\frac{60 + 40}{2}$. It would be right only if she spent equal **times** at each speed. She spends longer at $40$ km/h, which pulls the average down.',
        null,
        'This adds the two speeds. A combined speed cannot be faster than both legs.',
        'This uses $\\frac{60 \\times 40}{60 + 40} = 24$, the equal-distance shortcut without the factor of $2$ (there are two legs).',
      ],
      keyIdea: 'Average speed is total distance divided by total time; for two equal distances it is $\\frac{2ab}{a + b}$, not $\\frac{a + b}{2}$.',
    },
    check: {
      optionValues: [50, 48, 100, 24],
      compute: () => {
        const d = 120;
        return (2 * d) / (d / 60 + d / 40);
      },
    },
  },
  {
    id: 'rates-clocks-009',
    subtopic: 'rates-clocks',
    difficulty: 'exam',
    stem: 'What is the smaller angle between the hands of a clock at $7{:}20$?',
    options: ['$110^\\circ$', '$260^\\circ$', '$100^\\circ$', '$90^\\circ$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Measure clockwise from 12.\n\n' +
        '- Minute hand: $20 \\times 6 = 120^\\circ$.\n' +
        '- Hour hand: $7 \\times 30 + 20 \\times 0.5 = 210 + 10 = 220^\\circ$.\n\n' +
        'Difference: $220 - 120 = 100^\\circ$. It is less than $180^\\circ$, so this is the smaller angle.\n\n' +
        'Formula check: $|30 \\times 7 - 5.5 \\times 20| = |210 - 110| = 100^\\circ$.',
      whyWrong: [
        'This moves the hour hand $1^\\circ$ per minute ($210 + 20 = 230$, then $230 - 120$). The hour hand moves $30^\\circ$ in $60$ minutes, which is only $0.5^\\circ$ per minute.',
        'This is the reflex angle $360 - 100$. The question asks for the smaller angle.',
        null,
        'This leaves the hour hand exactly on the 7 ($210 - 120$). After $20$ minutes the hour hand has moved a third of the way towards 8.',
      ],
      keyIdea: 'The angle between the hands is $|30H - 5.5M|$; take $360^\\circ$ minus it if the result is over $180^\\circ$.',
    },
    check: { optionValues: [110, 260, 100, 90], compute: () => clockAngle(7, 20) },
  },
  {
    id: 'rates-clocks-010',
    subtopic: 'rates-clocks',
    difficulty: 'exam',
    stem: 'Layla can build a website on her own in $12$ days. Yusuf can build the same website on his own in $18$ days. Layla works alone for the first $4$ days, then Yusuf joins her and they finish it together. How many **more** days do they need after Yusuf joins?',
    options: ['$7.2$ days', '$12$ days', '$8$ days', '$4.8$ days'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Think of the whole job as $1$.\n\n' +
        '**Layla alone.** Her rate is $\\frac{1}{12}$ of the job per day. In $4$ days she does $\\frac{4}{12} = \\frac{1}{3}$, so $\\frac{2}{3}$ is left.\n\n' +
        '**Together.** Combined rate $= \\frac{1}{12} + \\frac{1}{18} = \\frac{3}{36} + \\frac{2}{36} = \\frac{5}{36}$ of the job per day.\n\n' +
        '**Time for the rest.** $\\frac{2}{3} \\div \\frac{5}{36} = \\frac{2}{3} \\times \\frac{36}{5} = \\frac{72}{15} = \\frac{24}{5} = 4.8$ days.',
      whyWrong: [
        'This is the time for the **whole** job together ($1 \\div \\frac{5}{36} = 7.2$). It forgets that Layla already did $\\frac{1}{3}$ of the work.',
        'This is how long Yusuf would take to do the remaining $\\frac{2}{3}$ alone ($\\frac{2}{3} \\times 18$), ignoring that Layla keeps working.',
        'This is how long Layla would take to do the remaining $\\frac{2}{3}$ alone ($\\frac{2}{3} \\times 12$), ignoring Yusuf\'s help.',
        null,
      ],
      keyIdea: 'Subtract the work already done, then divide the remaining fraction of the job by the combined rate.',
    },
    check: {
      optionValues: [7.2, 12, 8, 4.8],
      compute: () => {
        const remaining = new Frac(1).sub(new Frac(4, 12));
        return remaining.div(new Frac(1, 12).add(new Frac(1, 18))).value();
      },
    },
  },
  {
    id: 'rates-clocks-011',
    subtopic: 'rates-clocks',
    difficulty: 'exam',
    stem: 'A tap can fill an empty tank in $4$ hours. A drain at the bottom can empty a full tank in $6$ hours. The tank starts empty and someone opens the tap but forgets to close the drain. How long does it take to fill the tank?',
    options: ['$2.4$ hours', '$12$ hours', '$2$ hours', '$10$ hours'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Use rates in "tanks per hour". The drain works **against** the tap, so its rate is subtracted.\n\n' +
        '- Tap: $+\\frac{1}{4}$ tank per hour.\n' +
        '- Drain: $-\\frac{1}{6}$ tank per hour.\n\n' +
        'Net rate: $\\frac{1}{4} - \\frac{1}{6} = \\frac{3}{12} - \\frac{2}{12} = \\frac{1}{12}$ tank per hour.\n\n' +
        'Time $= 1 \\div \\frac{1}{12} = 12$ hours.\n\n' +
        'Sense check: it must take longer than the $4$ hours the tap needs on its own.',
      whyWrong: [
        'This adds the two rates ($\\frac{1}{4} + \\frac{1}{6} = \\frac{5}{12}$, giving $2.4$ hours), as if the drain were helping to fill the tank.',
        null,
        'This subtracts the times ($6 - 4$). Times cannot be combined directly; subtract the rates instead.',
        'This adds the times ($4 + 6$). Combine rates, not times.',
      ],
      keyIdea: 'A pipe that empties the tank has a negative rate, so the net rate is the fill rate minus the drain rate.',
    },
    check: { optionValues: [2.4, 12, 2, 10], compute: () => new Frac(1).div(new Frac(1, 4).sub(new Frac(1, 6))).value() },
  },
  {
    id: 'rates-clocks-012',
    subtopic: 'rates-clocks',
    difficulty: 'exam',
    stem: 'A flight leaves Abu Dhabi (UTC+4) at 22:30 local time on Monday. The flight lasts $13$ hours $45$ minutes and lands in New York (UTC-4). What is the local time in New York when it lands?',
    options: ['20:15 on Tuesday', '08:15 on Tuesday', '04:15 on Tuesday', '12:15 on Tuesday'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Step 1: add the flight time in Abu Dhabi time.** $22{:}30 + 13$ h $45$ min. $22{:}30 + 13$ h $= 35{:}30$, then $+ 45$ min $= 36{:}15$. Since $36{:}15 - 24{:}00 = 12{:}15$, that is 12:15 on Tuesday (Abu Dhabi time).\n\n' +
        '**Step 2: convert to New York time.** The time difference is $4 - (-4) = 8$ hours, and New York is **behind** (its UTC offset is smaller). So subtract $8$ hours: $12{:}15 - 8$ h $=$ 04:15.\n\n' +
        'The plane lands at 04:15 on Tuesday, New York time.',
      whyWrong: [
        'This adds the $8$ hours instead of subtracting them. New York (UTC-4) is behind Abu Dhabi (UTC+4), so its clocks show an earlier time.',
        'This takes the time difference as $4$ hours. From UTC+4 to UTC-4 is $4 + 4 = 8$ hours.',
        null,
        'This is the landing time on an Abu Dhabi clock: it forgets to convert to New York time.',
      ],
      keyIdea: 'Do the elapsed-time arithmetic in one time zone, then shift by the difference in UTC offsets.',
    },
    check: {
      // values: minutes after Monday 00:00 (New York time)
      optionValues: [1440 + 20 * 60 + 15, 1440 + 8 * 60 + 15, 1440 + 4 * 60 + 15, 1440 + 12 * 60 + 15],
      compute: () => 22 * 60 + 30 + (13 * 60 + 45) + (-4 - 4) * 60,
    },
  },
  {
    id: 'rates-clocks-013',
    subtopic: 'rates-clocks',
    difficulty: 'exam',
    stem: '$6$ identical machines make $480$ bottles in $4$ hours. Working at the same rate, how many bottles would $9$ of these machines make in $5$ hours?',
    options: ['$576$', '$900$', '$720$', '$600$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Find the **unit rate**: bottles made by one machine in one hour.\n\n' +
        '$6$ machines $\\times$ $4$ hours $= 24$ machine-hours make $480$ bottles, so one machine-hour makes $\\frac{480}{24} = 20$ bottles.\n\n' +
        '$9$ machines for $5$ hours $= 45$ machine-hours.\n\n' +
        '$45 \\times 20 = 900$ bottles.\n\n' +
        'Both changes increase the output (more machines **and** more time), so the answer must be bigger than $480 \\times \\frac{9}{6} = 720$.',
      whyWrong: [
        'This is $480 \\times \\frac{9}{6} \\times \\frac{4}{5}$: it treats time as inversely proportional. More hours means **more** bottles, so multiply by $\\frac{5}{4}$, not $\\frac{4}{5}$.',
        null,
        'This scales for the extra machines ($480 \\times \\frac{9}{6}$) but forgets that they also work $5$ hours instead of $4$.',
        'This scales for the extra hour ($480 \\times \\frac{5}{4}$) but forgets there are $9$ machines instead of $6$.',
      ],
      keyIdea: 'Reduce to a unit rate (per machine per hour), then scale up by every factor that changes.',
    },
    check: { optionValues: [576, 900, 720, 600], compute: () => (480 / (6 * 4)) * 9 * 5 },
  },
  {
    id: 'rates-clocks-014',
    subtopic: 'rates-clocks',
    difficulty: 'exam',
    stem: '1 March 2024 was a Friday. On what day of the week was 1 March 2025?',
    options: ['Sunday', 'Friday', 'Thursday', 'Saturday'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Count the days from 1 March 2024 to 1 March 2025.\n\n' +
        '2024 is a leap year, but its extra day (29 February 2024) comes **before** 1 March 2024. The period March 2024 to February 2025 contains 28 February 2025 only, and 2025 is not a leap year. So the gap is $365$ days.\n\n' +
        '$365 = 52 \\times 7 + 1$, so $365 \\bmod 7 = 1$.\n\n' +
        'Move forward $1$ day from Friday: **Saturday**.',
      whyWrong: [
        'This adds $2$ days because 2024 is a leap year. But 29 February 2024 is before 1 March 2024, so it is not inside the year being counted.',
        'This assumes a year is exactly $52$ weeks. $52 \\times 7 = 364$, so a $365$-day year has $1$ day left over.',
        'This moves the extra day backwards instead of forwards in time.',
        null,
      ],
      keyIdea: 'A 365-day year shifts the weekday forward by 1 (a span containing 29 February shifts it by 2), because $365 \\bmod 7 = 1$.',
    },
    check: {
      optionValues: ['Sunday', 'Friday', 'Thursday', 'Saturday'],
      compute: () => {
        const days = (Date.UTC(2025, 2, 1) - Date.UTC(2024, 2, 1)) / 86400000;
        return WEEK_MON[(WEEK_MON.indexOf('Friday') + days) % 7];
      },
    },
  },
  {
    id: 'rates-clocks-015',
    subtopic: 'rates-clocks',
    difficulty: 'exam',
    stem: 'A train $240$ m long travels at $72$ km/h. How long does it take to pass **completely** through a tunnel that is $360$ m long (from the front entering to the back leaving)?',
    options: ['$30$ seconds', '$18$ seconds', '$12$ seconds', '$8\\frac{1}{3}$ seconds'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Convert the speed** to metres per second: $72$ km/h $= \\frac{72 \\times 1000}{3600} = 20$ m/s (shortcut: divide km/h by $3.6$).\n\n' +
        '**Distance travelled.** From the moment the front enters until the back leaves, the front travels the tunnel length **plus** the train length: $360 + 240 = 600$ m.\n\n' +
        '**Time.** $\\frac{600}{20} = 30$ seconds.',
      whyWrong: [
        null,
        'This uses only the tunnel length ($\\frac{360}{20}$). When the front reaches the exit, the rest of the train ($240$ m) is still inside.',
        'This uses only the train length ($\\frac{240}{20}$), which is the time to pass a single point such as a signal post.',
        'This divides $600$ m by $72$ without converting km/h into m/s. Units must match before dividing.',
      ],
      keyIdea: 'A train passing through a tunnel or over a bridge travels its own length plus the length of the tunnel or bridge.',
    },
    check: { optionValues: [30, 18, 12, 25 / 3], compute: () => (240 + 360) / ((72 * 1000) / 3600) },
  },

  // ================================================================ challenge
  {
    id: 'rates-clocks-016',
    subtopic: 'rates-clocks',
    difficulty: 'challenge',
    stem: 'Between 4 o\'clock and 5 o\'clock, when are the hands of a clock **first** at right angles to each other?',
    options: [
      '$38\\frac{2}{11}$ minutes past 4',
      '$5\\frac{5}{11}$ minutes past 4',
      '$16\\frac{4}{11}$ minutes past 4',
      'Exactly $5$ minutes past 4',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Let the time be $t$ minutes past 4. Measure angles clockwise from 12.\n\n' +
        '- Minute hand: $6t$ degrees.\n' +
        '- Hour hand: starts at $4 \\times 30 = 120^\\circ$ and moves $0.5^\\circ$ per minute: $120 + 0.5t$ degrees.\n\n' +
        'At 4:00 the hour hand is $120^\\circ$ ahead. The minute hand gains $6 - 0.5 = 5.5^\\circ$ per minute, so the gap is $120 - 5.5t$.\n\n' +
        'The first right angle happens when the gap has shrunk to $90^\\circ$:\n\n' +
        '$$120 - 5.5t = 90 \\implies 5.5t = 30 \\implies t = \\frac{30}{5.5} = \\frac{60}{11} = 5\\frac{5}{11}$$\n\n' +
        'So the first right angle is at $5\\frac{5}{11}$ minutes past 4 (about 4:05 and 27 seconds).\n\n' +
        '(The second right angle is when the minute hand is $90^\\circ$ **ahead**: $5.5t - 120 = 90$, giving $t = 38\\frac{2}{11}$.)',
      whyWrong: [
        'This is the **second** right angle of the hour (minute hand $90^\\circ$ ahead of the hour hand). The question asks for the first.',
        null,
        'This solves $5.5t = 90$, forgetting that the hour hand starts $120^\\circ$ ahead at 4:00. At that time the hands are only $30^\\circ$ apart.',
        'This ignores the movement of the hour hand: at 4:05 the minute hand is at $30^\\circ$, but the hour hand has moved on to $122.5^\\circ$, so the angle is $92.5^\\circ$, not $90^\\circ$.',
      ],
      keyIdea: 'The minute hand gains $5.5^\\circ$ per minute on the hour hand, so solve $\\text{starting gap} - 5.5t = \\text{target angle}$.',
    },
    check: {
      // values: minutes past 4
      optionValues: [420 / 11, 60 / 11, 180 / 11, 5],
      compute: () => {
        // smallest t in [0, 60) with the hands exactly 90 degrees apart: 5.5t = 120 +/- 90 (mod 360)
        const cands: number[] = [];
        for (let k = -1; k <= 2; k++) for (const s of [90, -90]) cands.push((120 + s + 360 * k) / 5.5);
        return Math.min(...cands.filter((t) => t >= 0 && t < 60 && Math.abs(clockAngle(4, t) - 90) < 1e-9));
      },
    },
  },
  {
    id: 'rates-clocks-017',
    subtopic: 'rates-clocks',
    difficulty: 'challenge',
    stem: 'Ali and Bilal together can finish a job in $12$ days. Bilal and Chen together can finish it in $15$ days. Ali and Chen together can finish it in $20$ days. How many days would **Ali alone** take to finish the job?',
    options: ['$20$ days', '$5$ days', '$30$ days', '$10$ days'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Let $a$, $b$, $c$ be the fractions of the job each person does per day.\n\n' +
        '$$a + b = \\frac{1}{12}, \\quad b + c = \\frac{1}{15}, \\quad a + c = \\frac{1}{20}$$\n\n' +
        'Add all three equations. Each person appears twice:\n\n' +
        '$$2(a + b + c) = \\frac{5}{60} + \\frac{4}{60} + \\frac{3}{60} = \\frac{12}{60} = \\frac{1}{5}$$\n\n' +
        'So $a + b + c = \\frac{1}{10}$ (all three together take $10$ days).\n\n' +
        'Ali\'s rate is the total minus Bilal and Chen: $a = \\frac{1}{10} - \\frac{1}{15} = \\frac{3}{30} - \\frac{2}{30} = \\frac{1}{30}$.\n\n' +
        'Ali alone takes $30$ days.',
      whyWrong: [
        'This subtracts the wrong pair: $\\frac{1}{10} - \\frac{1}{20} = \\frac{1}{20}$ removes Ali and Chen, leaving **Bilal\'s** rate.',
        'This adds the three pair-rates to get $\\frac{1}{5}$ and takes $1 \\div \\frac{1}{5} = 5$ days as the answer. But that sum counts every person twice (it is $2(a + b + c)$), and even after halving it gives all three together, not Ali alone.',
        null,
        'This is the time for all **three** together ($a + b + c = \\frac{1}{10}$). You still need to subtract Bilal and Chen\'s rate.',
      ],
      keyIdea: 'Adding the three pair-rates counts each worker twice; halve to get the total rate, then subtract a pair to isolate one worker.',
    },
    check: {
      optionValues: [20, 5, 30, 10],
      compute: () => {
        const ab = new Frac(1, 12);
        const bc = new Frac(1, 15);
        const ac = new Frac(1, 20);
        const all = ab.add(bc).add(ac).div(2);
        return new Frac(1).div(all.sub(bc)).value();
      },
    },
  },
  {
    id: 'rates-clocks-018',
    subtopic: 'rates-clocks',
    difficulty: 'challenge',
    stem: 'In a $100$ m race, Amal beats Bushra by $10$ m. In another $100$ m race, Bushra beats Celine by $10$ m. Each runner always runs at her own constant speed. If Amal and Celine race over $100$ m, by how many metres does Amal win?',
    options: ['$19$ m', '$20$ m', '$10$ m', '$81$ m'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Constant speeds mean distances covered **in the same time** are in a fixed ratio.\n\n' +
        '- When Amal runs $100$ m, Bushra runs $90$ m. So Bushra covers $\\frac{90}{100} = 0.9$ of Amal\'s distance.\n' +
        '- When Bushra runs $100$ m, Celine runs $90$ m. So Celine covers $0.9$ of Bushra\'s distance.\n\n' +
        'So in the time Amal runs $100$ m, Celine runs $100 \\times 0.9 \\times 0.9 = 81$ m.\n\n' +
        'Amal wins by $100 - 81 = 19$ m.',
      whyWrong: [
        null,
        'This adds the two winning margins. But Celine\'s $10$ m deficit is measured over a full $100$ m of Bushra\'s running, and while Amal runs $100$ m Bushra only runs $90$ m, so the second margin shrinks to $9$ m.',
        'This assumes the margin stays the same. Beating a runner who is beaten by someone else must give a bigger margin.',
        'This is how far **Celine** has run when Amal finishes, not the winning margin.',
      ],
      keyIdea: 'Speed ratios multiply: with constant speeds, distance ratios over the same time chain together by multiplication.',
    },
    check: { optionValues: [19, 20, 10, 81], compute: () => 100 - 100 * ((100 - 10) / 100) * ((100 - 10) / 100) },
  },
  {
    id: 'rates-clocks-019',
    subtopic: 'rates-clocks',
    difficulty: 'challenge',
    stem: 'A boat travels $36$ km downstream (with the current) in $2$ hours. The return trip of $36$ km upstream (against the current) takes $3$ hours. Assuming the boat\'s engine and the current are both steady, what is the speed of the boat in still water?',
    options: ['$3$ km/h', '$30$ km/h', '$14.4$ km/h', '$15$ km/h'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Let the boat\'s speed in still water be $b$ and the current\'s speed be $c$ (both in km/h).\n\n' +
        '- Downstream the current helps: $b + c = \\frac{36}{2} = 18$.\n' +
        '- Upstream the current slows it: $b - c = \\frac{36}{3} = 12$.\n\n' +
        'Add the equations: $2b = 30$, so $b = 15$ km/h.\n\n' +
        '(Subtracting instead gives $2c = 6$, so the current is $3$ km/h. Check: $15 + 3 = 18$ and $15 - 3 = 12$.)',
      whyWrong: [
        'This is the speed of the **current** ($c = 3$), not of the boat.',
        'This adds $18 + 12$ but forgets to divide by $2$: $b + c$ plus $b - c$ equals $2b$, not $b$.',
        'This is the average speed for the whole round trip ($\\frac{72}{5}$). The boat spends longer going slowly upstream, so this is not the still-water speed.',
        null,
      ],
      keyIdea: 'Downstream speed is $b + c$ and upstream speed is $b - c$, so the still-water speed is their average: $b = \\frac{\\text{down} + \\text{up}}{2}$.',
    },
    check: {
      optionValues: [3, 30, 14.4, 15],
      compute: () => {
        const down = 36 / 2;
        const up = 36 / 3;
        return (down + up) / 2;
      },
    },
  },
  {
    id: 'rates-clocks-020',
    subtopic: 'rates-clocks',
    difficulty: 'challenge',
    stem: 'From 12:00 noon up to (but not including) 12:00 midnight, how many times are the hour hand and minute hand of a clock exactly at right angles ($90^\\circ$) to each other?',
    options: ['$24$', '$44$', '$22$', '$11$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The minute hand gains $6 - 0.5 = 5.5^\\circ$ per minute on the hour hand.\n\n' +
        'In $12$ hours ($720$ minutes) it gains $720 \\times 5.5 = 3960^\\circ$, which is $\\frac{3960}{360} = 11$ full laps on the hour hand.\n\n' +
        'During each lap the gap between the hands passes through $90^\\circ$ once and through $270^\\circ$ once (which is also a right angle, measured the other way round). That is $2$ right angles per lap.\n\n' +
        'Total: $11 \\times 2 = 22$ times.\n\n' +
        'Why not $24$? Around 3 o\'clock and 9 o\'clock the "two per hour" pattern overlaps: between 2:00 and 4:00 there are only $3$ right angles (about 2:27, exactly 3:00, about 3:33), not $4$.',
      whyWrong: [
        'This assumes exactly $2$ right angles every hour. The minute hand laps the hour hand only $11$ times in $12$ hours (not $12$), so there are $11 \\times 2 = 22$.',
        'This is the count for a full $24$ hours. The question covers only $12$ hours.',
        null,
        'This counts only one right angle per lap. Each lap has two: once with the minute hand $90^\\circ$ behind and once $90^\\circ$ ahead.',
      ],
      keyIdea: 'The minute hand laps the hour hand 11 times in 12 hours, and each lap contains two right angles.',
    },
    check: {
      optionValues: [24, 44, 22, 11],
      compute: () => {
        // gap between hands = 5.5t (mod 360); right angle when the gap is 90 or 270
        let count = 0;
        for (let k = 0; ; k++) {
          const t = (90 + 180 * k) / 5.5;
          if (t >= 720) break;
          if (Math.abs(clockAngle(12 + Math.floor(t / 60), t % 60) - 90) < 1e-9) count++;
        }
        return count;
      },
    },
  },
];

