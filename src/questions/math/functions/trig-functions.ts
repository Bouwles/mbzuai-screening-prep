import type { StaticQuestion } from '../../../types';

const PI = Math.PI;
const rad = (deg: number) => (deg * PI) / 180;
const r2 = (x: number) => Math.round(x * 100) / 100;

/**
 * Numerically measures a periodic function: max, min (sampled finely) and the smallest period
 * T = k*pi/12 (k = 1..96) such that f(x + T) = f(x) at several test points.
 * Returns "min|max|period-in-units-of-pi" (used by the answer checks only).
 */
function features(f: (x: number) => number): { min: number; max: number; periodOverPi: number } {
  let mx = -Infinity;
  let mn = Infinity;
  for (let i = 0; i <= 19200; i++) {
    const v = f((i * PI) / 2400);
    if (v > mx) mx = v;
    if (v < mn) mn = v;
  }
  const xs = [0.1, 0.37, 0.9, 1.3, 2.2, 2.9, 4.1];
  let periodOverPi = NaN;
  for (let k = 1; k <= 96; k++) {
    const T = (k * PI) / 12;
    if (xs.every((x) => Math.abs(f(x + T) - f(x)) < 1e-9)) {
      periodOverPi = Math.round((T / PI) * 10000) / 10000;
      break;
    }
  }
  return { min: r2(mn), max: r2(mx), periodOverPi };
}

// Data for the graph question (trig-functions-013): y = 4cos(2x), x in degrees.
const g13x = Array.from({ length: 25 }, (_, i) => i * 15);
const g13y = g13x.map((x) => Math.round(4 * Math.cos(rad(2 * x)) * 100) / 100);

export const questions: StaticQuestion[] = [
  {
    id: 'trig-functions-001',
    subtopic: 'trig-functions',
    difficulty: 'foundation',
    stem: "Convert $135^\\circ$ to radians.",
    options: ['$\\frac{4\\pi}{3}$', '$\\frac{3\\pi}{8}$', '$\\frac{3\\pi}{4}$', '$\\frac{3\\pi}{2}$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What is $135^\\circ$ when measured in radians instead of degrees?',
      solution:
        'A **radian** is another unit for measuring angles. A half turn is $180^\\circ$, and in radians it is $\\pi$. So $180^\\circ = \\pi$ radians.\n\n' +
        'So each degree is $\\frac{\\pi}{180}$ radians, and we multiply by that: $135^\\circ = 135 \\times \\frac{\\pi}{180} = \\frac{135\\pi}{180}$.\n\n' +
        'Simplify the fraction. Both 135 and 180 divide by 45: $135 \\div 45 = 3$ and $180 \\div 45 = 4$. This gives $\\frac{3\\pi}{4}$.',
      conclusion: '$135^\\circ$ is three quarters of a half turn, and a half turn is $\\pi$, so the answer is $\\frac{3\\pi}{4}$.',
      whyWrong: [
        "This uses the conversion factor upside down, $\\frac{180}{135}\\pi$. The angle in degrees goes on top: $\\frac{135}{180}\\pi$.",
        "This uses $360^\\circ = \\pi$. A full turn is $2\\pi$; it is a **half** turn ($180^\\circ$) that equals $\\pi$.",
        null,
        "This uses $180^\\circ = 2\\pi$, giving $135 \\times \\frac{2\\pi}{180}$. Remember $180^\\circ = \\pi$, not $2\\pi$.",
      ],
      keyIdea: 'Degrees to radians: multiply by $\\frac{\\pi}{180}$. Radians to degrees: multiply by $\\frac{180}{\\pi}$, or replace $\\pi$ with $180^\\circ$. Everything rests on the single fact that $\\pi$ radians is $180^\\circ$.',
    },
    check: {
      optionValues: [(4 * PI) / 3, (3 * PI) / 8, (3 * PI) / 4, (3 * PI) / 2],
      compute: () => (135 * PI) / 180,
    },
  },
  {
    id: 'trig-functions-002',
    subtopic: 'trig-functions',
    difficulty: 'foundation',
    stem: "What is the exact value of $\\tan 30^\\circ$?",
    options: ['$\\sqrt{3}$', '$\\frac{1}{2}$', '$\\frac{\\sqrt{3}}{2}$', '$\\frac{\\sqrt{3}}{3}$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What is $\\tan 30^\\circ$ as an exact fraction, without a calculator?',
      solution:
        '$\\tan$ of an angle in a right-angled triangle is the opposite side divided by the adjacent side. For $30^\\circ$ we can build a special triangle.\n\n' +
        'Take an equilateral triangle with sides of 2 and cut it in half. This gives a right-angled triangle with angles $30^\\circ$, $60^\\circ$ and $90^\\circ$. Its hypotenuse is 2, and the cut halves the base, so its shortest side is 1.\n\n' +
        'Find the third side with Pythagoras\' theorem: $\\sqrt{2^2 - 1^2} = \\sqrt{4 - 1} = \\sqrt{3}$.\n\n' +
        'The side opposite $30^\\circ$ is the shortest one, 1. The adjacent side is $\\sqrt{3}$. So $\\tan 30^\\circ = \\frac{1}{\\sqrt{3}}$.\n\n' +
        'Multiply the top and bottom by $\\sqrt{3}$ to remove the root from the bottom: $\\frac{1 \\times \\sqrt{3}}{\\sqrt{3} \\times \\sqrt{3}} = \\frac{\\sqrt{3}}{3}$.',
      conclusion: 'Opposite over adjacent in the special triangle is $\\frac{1}{\\sqrt{3}}$, which is written as $\\frac{\\sqrt{3}}{3}$.',
      whyWrong: [
        "$\\sqrt{3}$ is $\\tan 60^\\circ$: the opposite and adjacent sides have been swapped.",
        "$\\frac{1}{2}$ is $\\sin 30^\\circ$ (opposite over hypotenuse), not $\\tan 30^\\circ$.",
        "$\\frac{\\sqrt{3}}{2}$ is $\\cos 30^\\circ$ (adjacent over hypotenuse), not $\\tan 30^\\circ$.",
        null,
      ],
      keyIdea: 'Rebuild exact values from two triangles. Half an equilateral triangle, with sides 1, $\\sqrt{3}$ and 2, gives $30^\\circ$ and $60^\\circ$. A right-angled isosceles triangle, with sides 1, 1 and $\\sqrt{2}$, gives $45^\\circ$.',
    },
    check: {
      optionValues: [Math.sqrt(3), 1 / 2, Math.sqrt(3) / 2, Math.sqrt(3) / 3],
      compute: () => Math.tan(rad(30)),
    },
  },
  {
    id: 'trig-functions-003',
    subtopic: 'trig-functions',
    difficulty: 'foundation',
    stem: "In triangle $ABC$, angle $C = 90^\\circ$, the hypotenuse $AB = 10$ cm and angle $A = 30^\\circ$. What is the length of $BC$?",
    options: ['$5\\sqrt{3}$ cm', '$5$ cm', '$20$ cm', '$\\frac{10\\sqrt{3}}{3}$ cm'],
    correctIndex: 1,
    markScheme: {
      asking: 'How long is the side opposite the $30^\\circ$ angle?',
      solution:
        'Label the sides as seen from angle $A$. The **hypotenuse** is the longest side, across from the right angle: that is $AB = 10$. The side **opposite** $A$ is the one that doesn\'t touch $A$: that is $BC$.\n\n' +
        'We know the hypotenuse and want the opposite side. The ratio linking them is sine: $\\sin A = \\frac{\\text{opposite}}{\\text{hypotenuse}}$.\n\n' +
        'Substitute: $\\sin 30^\\circ = \\frac{BC}{10}$. Multiply both sides by 10 to get $BC$ alone: $BC = 10 \\sin 30^\\circ$.\n\n' +
        'Use the exact value $\\sin 30^\\circ = \\frac{1}{2}$: $BC = 10 \\times \\frac{1}{2} = 5$.',
      conclusion: '$BC$ faces the $30^\\circ$ angle, so it is half of the hypotenuse, and the length is $5$ cm.',
      whyWrong: [
        "This uses cosine, $10 \\cos 30^\\circ = 5\\sqrt{3}$, which gives the **adjacent** side $AC$, not $BC$.",
        null,
        "This divides instead of multiplying: $\\frac{10}{\\sin 30^\\circ} = 20$. A side of a right-angled triangle can never be longer than the hypotenuse.",
        "This treats $10$ as the adjacent side and uses tangent, $10 \\tan 30^\\circ$. But $10$ is the hypotenuse.",
      ],
      keyIdea: 'In a right-angled triangle, label the sides opposite, adjacent and hypotenuse from the known angle. Then choose: SOH (sine) for opposite and hypotenuse, CAH (cosine) for adjacent and hypotenuse, TOA (tangent) for opposite and adjacent.',
    },
    check: {
      optionValues: [5 * Math.sqrt(3), 5, 20, (10 * Math.sqrt(3)) / 3],
      compute: () => 10 * Math.sin(rad(30)),
    },
  },
  {
    id: 'trig-functions-004',
    subtopic: 'trig-functions',
    difficulty: 'foundation',
    stem: "The angle $\\theta$ satisfies $90^\\circ < \\theta < 180^\\circ$. Which statement is true?",
    options: [
      '$\\sin\\theta < 0$ and $\\cos\\theta > 0$',
      '$\\sin\\theta > 0$ and $\\tan\\theta > 0$',
      '$\\cos\\theta < 0$ and $\\tan\\theta > 0$',
      '$\\sin\\theta > 0$ and $\\cos\\theta < 0$',
    ],
    correctIndex: 3,
    markScheme: {
      asking: 'Which signs do sine, cosine and tangent have for an angle between $90^\\circ$ and $180^\\circ$?',
      solution:
        'Picture an angle $\\theta$ measured anticlockwise from the positive $x$-axis, ending at a point on a circle of radius 1 centred at the origin. That point\'s $x$-coordinate is $\\cos\\theta$, and its $y$-coordinate is $\\sin\\theta$.\n\n' +
        'An angle between $90^\\circ$ and $180^\\circ$ ends in the top-left quarter of the circle, called the second quadrant. There the point is above the $x$-axis, so $y$ is positive and sine is positive.\n\n' +
        'The point is also to the left of the $y$-axis, so $x$ is negative and cosine is negative.',
      conclusion: 'Above the $x$-axis and left of the $y$-axis gives $\\sin\\theta > 0$ and $\\cos\\theta < 0$.',
      whyWrong: [
        "These are the signs in the **fourth** quadrant ($270^\\circ$ to $360^\\circ$), where the point is below the $x$-axis and to the right.",
        "Both being positive happens in the **first** quadrant. In the second quadrant $\\tan\\theta$ is negative because $\\cos\\theta$ is negative.",
        "This is the **third** quadrant pattern ($\\sin$ and $\\cos$ both negative make $\\tan$ positive). In the second quadrant $\\tan\\theta < 0$.",
        null,
      ],
      keyIdea: 'Sketch the circle and mark the quadrant: $\\sin$ has the sign of $y$, $\\cos$ has the sign of $x$, and $\\tan$ is $\\frac{y}{x}$. The word CAST (Cosine, All, Sine, Tangent), anticlockwise from the bottom right, names what is positive in each quadrant.',
    },
    check: {
      optionValues: ['s-c+', 's+t+', 'c-t+', 's+c-'],
      compute: () => {
        const thetas = [95, 110, 120, 135, 150, 170].map(rad);
        const statements: [string, (t: number) => boolean][] = [
          ['s-c+', (t) => Math.sin(t) < 0 && Math.cos(t) > 0],
          ['s+t+', (t) => Math.sin(t) > 0 && Math.tan(t) > 0],
          ['c-t+', (t) => Math.cos(t) < 0 && Math.tan(t) > 0],
          ['s+c-', (t) => Math.sin(t) > 0 && Math.cos(t) < 0],
        ];
        return statements.filter(([, p]) => thetas.every(p)).map(([k]) => k).join(',');
      },
    },
  },
  {
    id: 'trig-functions-005',
    subtopic: 'trig-functions',
    difficulty: 'foundation',
    stem: "What are the amplitude and the period of $y = 3\\sin(2x)$, where $x$ is in radians?",
    options: ['Amplitude $3$, period $\\pi$', 'Amplitude $3$, period $4\\pi$', 'Amplitude $6$, period $\\pi$', 'Amplitude $3$, period $2\\pi$'],
    correctIndex: 0,
    markScheme: {
      asking: 'How tall is this wave, and how long is one full wave?',
      solution:
        '**Amplitude** is how far a wave goes above or below its middle line. **Period** is the horizontal length of one full wave before it repeats.\n\n' +
        '$\\sin$ of anything goes between $-1$ and 1. Multiplying by 3 makes $y$ go between $-3$ and 3. So the amplitude is 3.\n\n' +
        '$\\sin$ completes one full wave when its input goes from 0 to $2\\pi$ (a full turn in radians). Here the input is $2x$, so we need $2x$ to reach $2\\pi$.\n\n' +
        'Divide both sides of $2x = 2\\pi$ by 2: $x = \\pi$. So one wave finishes at $x = \\pi$, and the period is $\\pi$.',
      conclusion: 'The 3 sets the height and the 2 squeezes the wave, so the answer is amplitude $3$, period $\\pi$.',
      whyWrong: [
        null,
        "This multiplies $2\\pi$ by $2$ instead of dividing. A bigger $b$ makes the waves **shorter**, so the period is $\\frac{2\\pi}{b}$.",
        "$6$ is the distance from the lowest point to the highest point. Amplitude is only **half** of that: the distance from the middle to a peak.",
        "This ignores the $2$ inside the bracket and uses the period of plain $\\sin x$.",
      ],
      keyIdea: 'For $y = a\\sin(bx)$ or $y = a\\cos(bx)$, the amplitude is $\\lvert a \\rvert$ (the size of $a$, ignoring any minus sign) and the period is $\\frac{2\\pi}{b}$, or $\\frac{360^\\circ}{b}$ in degrees. The number multiplying $x$ squeezes the wave, so a bigger $b$ means a shorter period.',
    },
    check: {
      optionValues: ['3|1', '3|4', '6|1', '3|2'],
      compute: () => {
        const f = features((x) => 3 * Math.sin(2 * x));
        return `${r2((f.max - f.min) / 2)}|${f.periodOverPi}`;
      },
    },
  },
  {
    id: 'trig-functions-006',
    subtopic: 'trig-functions',
    difficulty: 'exam',
    stem: "A sector of a circle has radius $9$ cm and angle $120^\\circ$ at the centre. What is the length of its arc?",
    options: ['$27\\pi$ cm', '$6\\pi$ cm', '$1080$ cm', '$18\\pi$ cm'],
    correctIndex: 1,
    markScheme: {
      asking: 'How long is the curved edge of this slice of the circle?',
      solution:
        'A **sector** is a slice of a circle, like a slice of pizza. The **arc** is its curved edge.\n\n' +
        'What fraction of the full $360^\\circ$ is $120^\\circ$? $\\frac{120}{360} = \\frac{1}{3}$. So the arc is one third of the way round the circle.\n\n' +
        'The whole way round is the circumference, $2\\pi r$, where $r$ is the radius: $2 \\times \\pi \\times 9 = 18\\pi$ cm.\n\n' +
        'Take one third of that: $\\frac{1}{3} \\times 18\\pi = 6\\pi$ cm.',
      conclusion: 'The arc is one third of a circumference of $18\\pi$ cm, so its length is $6\\pi$ cm.',
      whyWrong: [
        "This uses the **sector area** formula $\\frac{1}{2}r^2\\theta = \\frac{1}{2} \\times 81 \\times \\frac{2\\pi}{3} = 27\\pi$. That is an area (in square cm), not a length.",
        null,
        "This puts the angle into $s = r\\theta$ in degrees: $9 \\times 120 = 1080$. The formula needs $\\theta$ in radians.",
        "$18\\pi$ is the circumference of the **whole** circle. The arc is only $\\frac{120}{360} = \\frac{1}{3}$ of it.",
      ],
      keyIdea: 'Arc length is $\\frac{\\text{angle}}{360}$ of $2\\pi r$ when the angle is in degrees. In radians, use $s = r\\theta$, which gives the same result: here, $9 \\times \\frac{2\\pi}{3} = 6\\pi$.',
    },
    check: {
      optionValues: [27 * PI, 6 * PI, 1080, 18 * PI],
      compute: () => 9 * rad(120),
    },
  },
  {
    id: 'trig-functions-007',
    subtopic: 'trig-functions',
    difficulty: 'foundation',
    stem: "A sector has radius $4$ cm and angle $1.5$ radians at the centre. What is its area?",
    options: ['$6 \\text{ cm}^2$', '$24 \\text{ cm}^2$', '$4.5 \\text{ cm}^2$', '$12 \\text{ cm}^2$'],
    correctIndex: 3,
    markScheme: {
      asking: 'How much area does this slice of the circle cover?',
      solution:
        'A **sector** is a slice of a circle. When the angle $\\theta$ at the centre is in radians, the area is $A = \\frac{1}{2}r^2\\theta$, where $r$ is the radius.\n\n' +
        'Why? A full circle has area $\\pi r^2$ and angle $2\\pi$ radians, so the slice is the fraction $\\frac{\\theta}{2\\pi}$ of it: $\\frac{\\theta}{2\\pi} \\times \\pi r^2 = \\frac{1}{2}r^2\\theta$.\n\n' +
        'Substitute $r = 4$ and $\\theta = 1.5$: $A = \\frac{1}{2} \\times 4^2 \\times 1.5$.\n\n' +
        'Power first: $4^2 = 16$. Then $\\frac{1}{2} \\times 16 = 8$, and $8 \\times 1.5 = 12$.',
      conclusion: 'The formula gives $\\frac{1}{2} \\times 16 \\times 1.5$, so the area is $12 \\text{ cm}^2$.',
      whyWrong: [
        "$6$ is the **arc length** $r\\theta = 4 \\times 1.5$, not the area.",
        "This forgets the $\\frac{1}{2}$ in the formula: $r^2\\theta = 16 \\times 1.5 = 24$.",
        "This squares the angle instead of the radius: $\\frac{1}{2} \\times 4 \\times 1.5^2 = 4.5$. It is $r$ that is squared.",
        null,
      ],
      keyIdea: 'With the angle in radians, arc length is $s = r\\theta$ and sector area is $A = \\frac{1}{2}r^2\\theta$. If the angle is in degrees, change it to radians first by multiplying by $\\frac{\\pi}{180}$.',
    },
    check: {
      optionValues: [6, 24, 4.5, 12],
      compute: () => 0.5 * 4 ** 2 * 1.5,
    },
  },
  {
    id: 'trig-functions-008',
    subtopic: 'trig-functions',
    difficulty: 'exam',
    stem: "In triangle $ABC$, angle $A = 30^\\circ$, angle $B = 45^\\circ$ and side $a = BC = 5$ cm. Find side $b = AC$.",
    options: ['$10$ cm', '$\\frac{15}{2}$ cm', '$5\\sqrt{2}$ cm', '$\\frac{5\\sqrt{2}}{2}$ cm'],
    correctIndex: 2,
    markScheme: {
      asking: 'How long is side $b$, given two angles and side $a$?',
      solution:
        'We know two angles and the side opposite one of them, and we want the side opposite the other. That calls for the **sine rule**: $\\frac{a}{\\sin A} = \\frac{b}{\\sin B}$. Here $a$ is the side opposite angle $A$, and $b$ is the side opposite angle $B$.\n\n' +
        'Substitute $a = 5$, $A = 30^\\circ$ and $B = 45^\\circ$: $\\frac{5}{\\sin 30^\\circ} = \\frac{b}{\\sin 45^\\circ}$.\n\n' +
        'Multiply both sides by $\\sin 45^\\circ$ to get $b$ alone: $b = \\frac{5 \\sin 45^\\circ}{\\sin 30^\\circ}$.\n\n' +
        'Use the exact values $\\sin 45^\\circ = \\frac{\\sqrt{2}}{2}$ and $\\sin 30^\\circ = \\frac{1}{2}$: $b = 5 \\times \\frac{\\sqrt{2}}{2} \\div \\frac{1}{2}$.\n\n' +
        'Dividing by $\\frac{1}{2}$ is the same as multiplying by 2, and that cancels the 2 on the bottom: $b = 5\\sqrt{2}$.',
      conclusion: 'The bigger angle $B$ faces the longer side, and $b \\approx 7.07$ is more than 5, as it should be. So the answer is $5\\sqrt{2}$ cm.',
      whyWrong: [
        "$10$ is only $\\frac{a}{\\sin A} = \\frac{5}{\\frac{1}{2}}$, the common ratio of the sine rule. You still need to multiply by $\\sin B$.",
        "This assumes sides are proportional to the **angles** themselves: $5 \\times \\frac{45}{30} = 7.5$. The sine rule uses the **sines** of the angles.",
        null,
        "This has the ratio upside down, $b = \\frac{a \\sin A}{\\sin B}$, giving $\\frac{5}{\\sqrt{2}}$. The larger angle $B$ must face the longer side, so $b > 5$.",
      ],
      keyIdea: 'Use the sine rule when you have a side and its opposite angle, plus one more side or angle. Write only the two fractions you need. As a test, the largest angle must face the longest side.',
    },
    check: {
      optionValues: [10, 15 / 2, 5 * Math.sqrt(2), (5 * Math.sqrt(2)) / 2],
      compute: () => (5 * Math.sin(rad(45))) / Math.sin(rad(30)),
    },
  },
  {
    id: 'trig-functions-009',
    subtopic: 'trig-functions',
    difficulty: 'exam',
    stem: "In triangle $ABC$, $AB = 8$ cm, $AC = 5$ cm and the angle between them is $A = 60^\\circ$. Find the length of $BC$.",
    options: ['$7$ cm', '$49$ cm', '$\\sqrt{129}$ cm', '$\\sqrt{89}$ cm'],
    correctIndex: 0,
    markScheme: {
      asking: 'How long is the third side, given two sides and the angle between them?',
      solution:
        'We know two sides and the angle between them. That is the pattern for the **cosine rule**: $a^2 = b^2 + c^2 - 2bc\\cos A$. Here $a$ is the side we want, opposite angle $A$, and $b$ and $c$ are the other two sides.\n\n' +
        'Substitute $b = 8$, $c = 5$ and $A = 60^\\circ$: $a^2 = 8^2 + 5^2 - 2 \\times 8 \\times 5 \\times \\cos 60^\\circ$.\n\n' +
        'Work out the squares and the product: $a^2 = 64 + 25 - 80\\cos 60^\\circ$.\n\n' +
        'Use $\\cos 60^\\circ = \\frac{1}{2}$, so $80 \\times \\frac{1}{2} = 40$. This gives $a^2 = 89 - 40 = 49$.\n\n' +
        'Take the square root, since $a^2$ is the length multiplied by itself: $a = \\sqrt{49} = 7$.',
      conclusion: 'The cosine rule gives $BC^2 = 49$, so the length of $BC$ is $7$ cm.',
      whyWrong: [
        null,
        "$49$ is $a^2$. The last step, taking the square root, has been forgotten.",
        "This adds the $2bc\\cos A$ term instead of subtracting it: $89 + 40 = 129$.",
        "This uses Pythagoras ($a^2 = 25 + 64$), which only works when the angle is $90^\\circ$. Here it is $60^\\circ$.",
      ],
      keyIdea: 'Use the cosine rule when you have two sides and the angle between them, or all three sides. Substitute, find $a^2$, then take the square root as the final step. Pythagoras is the special case $A = 90^\\circ$.',
    },
    check: {
      optionValues: [7, 49, Math.sqrt(129), Math.sqrt(89)],
      compute: () => Math.sqrt(5 ** 2 + 8 ** 2 - 2 * 5 * 8 * Math.cos(rad(60))),
    },
  },
  {
    id: 'trig-functions-010',
    subtopic: 'trig-functions',
    difficulty: 'exam',
    stem: "A triangle has sides $3$ cm, $5$ cm and $7$ cm. What is the size of its largest angle?",
    options: ['$60^\\circ$', '$90^\\circ$', '$120^\\circ$', '$150^\\circ$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What is the biggest angle in a triangle with sides 3, 5 and 7?',
      solution:
        'The largest angle is opposite the longest side, which is 7. Call that angle $C$.\n\n' +
        'We know all three sides, so use the **cosine rule**: $c^2 = a^2 + b^2 - 2ab\\cos C$. Here $c = 7$ is the side opposite $C$, and $a = 3$ and $b = 5$ are the other two.\n\n' +
        'Substitute: $49 = 9 + 25 - 2 \\times 3 \\times 5 \\times \\cos C$, which is $49 = 34 - 30\\cos C$.\n\n' +
        'Get $\\cos C$ alone. Subtract 34 from both sides: $15 = -30\\cos C$. Divide by $-30$: $\\cos C = -\\frac{15}{30} = -\\frac{1}{2}$.\n\n' +
        'Now find the angle. A negative cosine means an obtuse angle (between $90^\\circ$ and $180^\\circ$). We know $\\cos 60^\\circ = \\frac{1}{2}$. The angle $60^\\circ$ short of a half turn has the same size of cosine with a minus sign, so the angle we want is $180^\\circ - 60^\\circ = 120^\\circ$.',
      conclusion: 'In a triangle, only one angle has a cosine of $-\\frac{1}{2}$, so the largest angle is $120^\\circ$.',
      whyWrong: [
        "This loses the minus sign (for example by computing $49 - 9 - 25$ on top), giving $\\cos C = \\frac{1}{2}$ and $60^\\circ$. Because $7^2 > 3^2 + 5^2$, the angle must be obtuse.",
        "This assumes the largest angle is a right angle. But $3^2 + 5^2 = 34 \\ne 49 = 7^2$, so it is not a right-angled triangle.",
        null,
        "This matches $\\cos C = -\\frac{1}{2}$ to the wrong exact value: $\\cos 150^\\circ = -\\frac{\\sqrt{3}}{2}$, while $\\cos 120^\\circ = -\\frac{1}{2}$.",
      ],
      keyIdea: 'With three sides known, rearrange the cosine rule to $\\cos C = \\frac{a^2 + b^2 - c^2}{2ab}$, with $c$ the side opposite the angle you want. A negative result means the angle is obtuse.',
    },
    check: {
      optionValues: [60, 90, 120, 150],
      compute: () => (Math.acos((3 ** 2 + 5 ** 2 - 7 ** 2) / (2 * 3 * 5)) * 180) / PI,
    },
  },
  {
    id: 'trig-functions-011',
    subtopic: 'trig-functions',
    difficulty: 'exam',
    stem: "What is the exact value of $\\cos\\left(\\frac{4\\pi}{3}\\right)$?",
    options: ['$\\frac{1}{2}$', '$-\\frac{\\sqrt{3}}{2}$', '$\\frac{\\sqrt{3}}{2}$', '$-\\frac{1}{2}$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What is the cosine of this angle as an exact number?',
      solution:
        'It is easier in degrees. Since $\\pi$ radians is $180^\\circ$, replace $\\pi$ with $180^\\circ$: $\\frac{4 \\times 180^\\circ}{3} = 240^\\circ$.\n\n' +
        'Find the sign. $240^\\circ$ is between $180^\\circ$ and $270^\\circ$, which is the third quadrant, the bottom left of the circle. Cosine is the $x$-coordinate on a circle of radius 1, and $x$ is negative there, so cosine is negative.\n\n' +
        'Find the **reference angle**, the acute angle between the line and the $x$-axis. Here it is $240^\\circ - 180^\\circ = 60^\\circ$.\n\n' +
        'The size comes from the reference angle: $\\cos 60^\\circ = \\frac{1}{2}$. Adding the negative sign gives $-\\frac{1}{2}$.',
      conclusion: 'The third quadrant makes cosine negative, and the reference angle gives the size, so the value is $-\\frac{1}{2}$.',
      whyWrong: [
        "This has the right size but the wrong sign: in the third quadrant the $x$-coordinate on the unit circle is negative, so $\\cos$ is negative.",
        "This is $\\sin\\left(\\frac{4\\pi}{3}\\right)$, not $\\cos$: it uses $\\sin 60^\\circ = \\frac{\\sqrt{3}}{2}$ for the reference angle instead of $\\cos 60^\\circ$.",
        "This uses the sine value of the reference angle **and** forgets that cosine is negative in the third quadrant.",
        null,
      ],
      keyIdea: 'For any angle, convert to degrees, find the quadrant for the sign, find the reference angle for the size, then combine. CAST (Cosine, All, Sine, Tangent), read anticlockwise from the bottom right, names what is positive in each quadrant.',
    },
    check: {
      optionValues: [1 / 2, -Math.sqrt(3) / 2, Math.sqrt(3) / 2, -1 / 2],
      compute: () => Math.cos((4 * PI) / 3),
    },
  },
  {
    id: 'trig-functions-012',
    subtopic: 'trig-functions',
    difficulty: 'exam',
    stem:
      "A function of the form $y = a\\sin(bx) + d$, with $x$ in radians, $a > 0$ and $b > 0$, has maximum value $5$, minimum value $-1$ and period $\\pi$. Which function is it?",
    options: ['$y = 6\\sin(2x) - 1$', '$y = 3\\sin(2x) + 2$', '$y = 2\\sin(2x) + 3$', '$y = 3\\sin\\left(\\frac{x}{2}\\right) + 2$'],
    correctIndex: 1,
    markScheme: {
      asking: 'Which values of $a$, $b$ and $d$ give this highest point, lowest point and wave length?',
      solution:
        'In $y = a\\sin(bx) + d$, $\\sin$ goes between $-1$ and 1. So the maximum is $d + a$ and the minimum is $d - a$. $a$ is the **amplitude** (middle to top), $d$ is the height of the middle line, and $b$ controls how quickly the wave repeats.\n\n' +
        'The middle line is halfway between the maximum and minimum: $d = \\frac{5 + (-1)}{2} = \\frac{4}{2} = 2$.\n\n' +
        'The amplitude is half the distance from minimum to maximum: $a = \\frac{5 - (-1)}{2} = \\frac{6}{2} = 3$.\n\n' +
        'The **period** (the length of one wave) of $\\sin(bx)$ is $\\frac{2\\pi}{b}$. Here the period is $\\pi$, so $\\frac{2\\pi}{b} = \\pi$. Multiply both sides by $b$ and divide by $\\pi$: $b = 2$.\n\n' +
        'Put the values in: $y = 3\\sin(2x) + 2$.',
      conclusion: 'Testing: the maximum is $3 + 2 = 5$ and the minimum is $-3 + 2 = -1$, so the function is $y = 3\\sin(2x) + 2$.',
      whyWrong: [
        "This uses the full height ($5 - (-1) = 6$) as the amplitude and the minimum as the shift. Its range is $-7 \\le y \\le 5$, so the minimum is wrong.",
        null,
        "This swaps the amplitude and the shift: its maximum is $2 + 3 = 5$ but its minimum is $-2 + 3 = 1$, not $-1$.",
        "This gets $b$ upside down. $\\sin\\left(\\frac{x}{2}\\right)$ has period $\\frac{2\\pi}{\\frac{1}{2}} = 4\\pi$, not $\\pi$.",
      ],
      keyIdea: 'For a sine or cosine wave: $d = \\frac{\\text{max} + \\text{min}}{2}$, $a = \\frac{\\text{max} - \\text{min}}{2}$, and $b = \\frac{2\\pi}{\\text{period}}$, or $\\frac{360^\\circ}{\\text{period}}$ in degrees. Then test the maximum and minimum.',
    },
    check: {
      optionValues: ['6,2,-1', '3,2,2', '2,2,3', '3,0.5,2'],
      compute: () => {
        const candidates: [number, number, number][] = [
          [6, 2, -1],
          [3, 2, 2],
          [2, 2, 3],
          [3, 0.5, 2],
        ];
        return candidates
          .filter(([a, b, d]) => {
            const f = features((x) => a * Math.sin(b * x) + d);
            return f.max === 5 && f.min === -1 && f.periodOverPi === 1;
          })
          .map((c) => c.join(','))
          .join(';');
      },
    },
  },
  {
    id: 'trig-functions-013',
    subtopic: 'trig-functions',
    difficulty: 'exam',
    stem:
      "The chart shows the graph of $y = a\\cos(bx)$ for $0^\\circ \\le x \\le 360^\\circ$, where $a > 0$ and $b > 0$. Find $a$ and $b$.",
    chart: {
      kind: 'line',
      title: 'y = a cos(bx)',
      xLabel: 'x (degrees)',
      yLabel: 'y',
      categories: g13x.map(String),
      series: [{ name: 'y', values: g13y }],
    },
    options: ['$a = 8$, $b = 2$', '$a = 4$, $b = 180$', '$a = 4$, $b = \\frac{1}{2}$', '$a = 4$, $b = 2$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What are the height of this wave and the number of waves in $360^\\circ$?',
      solution:
        '$a$ is the **amplitude**: how far the wave rises above its middle line. The chart has a highest value of 4 and a lowest value of $-4$, with the middle at 0. So $a = 4$.\n\n' +
        'Find the **period**, the horizontal length of one full wave. A cosine wave starts at its top. The chart is at the top ($y = 4$) at $x = 0^\\circ$, and next at the top at $x = 180^\\circ$. So the period is $180^\\circ$.\n\n' +
        'Plain $\\cos x$ has a period of $360^\\circ$, and $b$ says how many full waves fit into $360^\\circ$. So $b = \\frac{360^\\circ}{\\text{period}} = \\frac{360^\\circ}{180^\\circ} = 2$.',
      conclusion: 'Testing: at $x = 45^\\circ$, $4\\cos 90^\\circ = 0$, which matches the chart. So the answer is $a = 4$, $b = 2$.',
      whyWrong: [
        "$8$ is the full distance from the lowest point ($-4$) to the highest point ($4$). The amplitude is half of that.",
        "$180$ is the **period**, not $b$. The value of $b$ is $\\frac{360}{\\text{period}}$, the number of waves in $360^\\circ$.",
        "This computes $b = \\frac{\\text{period}}{360} = \\frac{180}{360}$, upside down. A $b$ bigger than $1$ squashes the graph so it repeats more often.",
        null,
      ],
      keyIdea: 'Read the amplitude from the top of the wave, and the period from the distance between two tops. Then $b = \\frac{360^\\circ}{\\text{period}}$ in degrees, or $b = \\frac{2\\pi}{\\text{period}}$ in radians.',
    },
    check: {
      optionValues: ['8,2', '4,180', '4,0.5', '4,2'],
      compute: () => {
        const mx = Math.max(...g13y);
        const mn = Math.min(...g13y);
        const amp = (mx - mn) / 2;
        const peaks = g13x.filter((_, i) => g13y[i] === mx);
        const period = peaks[1] - peaks[0];
        return `${amp},${360 / period}`;
      },
    },
  },
  {
    id: 'trig-functions-014',
    subtopic: 'trig-functions',
    difficulty: 'exam',
    stem:
      "The point $P\\left(-\\frac{3}{5}, \\frac{4}{5}\\right)$ lies on the unit circle. The line $OP$ makes an angle $\\theta$ measured anticlockwise from the positive $x$-axis. What is $\\tan\\theta$?",
    options: ['$-\\frac{4}{3}$', '$-\\frac{3}{4}$', '$\\frac{4}{3}$', '$\\frac{4}{5}$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Given the coordinates of $P$, what is the tangent of its angle?',
      solution:
        'The **unit circle** has radius 1 and its centre at the origin $O$. For a point on it at angle $\\theta$, the $x$-coordinate is $\\cos\\theta$ and the $y$-coordinate is $\\sin\\theta$.\n\n' +
        'So $P$ tells us that $\\cos\\theta = -\\frac{3}{5}$ and $\\sin\\theta = \\frac{4}{5}$.\n\n' +
        '$\\tan\\theta$ is sine divided by cosine, which is $\\frac{y}{x}$: $\\tan\\theta = \\frac{4}{5} \\div \\left(-\\frac{3}{5}\\right)$.\n\n' +
        'To divide by a fraction, flip it and multiply: $\\frac{4}{5} \\times \\left(-\\frac{5}{3}\\right)$. The 5s cancel, which leaves $-\\frac{4}{3}$.',
      conclusion: 'A positive divided by a negative is negative, which fits a point in the top left, so $\\tan\\theta$ is $-\\frac{4}{3}$.',
      whyWrong: [
        null,
        "This divides $x$ by $y$ ($\\frac{\\cos\\theta}{\\sin\\theta}$). Tangent is $\\frac{y}{x} = \\frac{\\sin\\theta}{\\cos\\theta}$.",
        "This drops the minus sign. $P$ has a negative $x$-coordinate, so $\\tan\\theta = \\frac{y}{x}$ is negative.",
        "$\\frac{4}{5}$ is the $y$-coordinate, which is $\\sin\\theta$, not $\\tan\\theta$.",
      ],
      keyIdea: 'For a point on the unit circle: $\\cos\\theta = x$, $\\sin\\theta = y$ and $\\tan\\theta = \\frac{y}{x}$. Read them straight off the coordinates, keeping the signs.',
    },
    check: {
      optionValues: [-4 / 3, -3 / 4, 4 / 3, 4 / 5],
      compute: () => Math.tan(Math.atan2(4 / 5, -3 / 5)),
    },
  },
  {
    id: 'trig-functions-015',
    subtopic: 'trig-functions',
    difficulty: 'exam',
    stem: 'From a point on level ground $20$ m from the foot of a vertical tower, the angle of elevation of its top is $60^\\circ$. How tall is the tower?',
    options: ['$10\\sqrt{3}$ m', '$20\\sqrt{3}$ m', '$10$ m', '$\\frac{20\\sqrt{3}}{3}$ m'],
    correctIndex: 1,
    markScheme: {
      asking: 'How tall is the tower, given the ground distance and the angle up to its top?',
      solution:
        'Draw it. The tower, the ground and the line of sight form a right-angled triangle. The **angle of elevation** is the angle up from the ground to the top of the tower, which is $60^\\circ$.\n\n' +
        'Label the sides as seen from that angle. The tower, of height $h$, is **opposite** the angle. The 20 m along the ground is **adjacent** (next to it). The line of sight is the hypotenuse, which we don\'t need.\n\n' +
        'The ratio linking opposite and adjacent is tangent: $\\tan 60^\\circ = \\frac{h}{20}$.\n\n' +
        'Multiply both sides by 20 to get $h$ alone: $h = 20\\tan 60^\\circ$.\n\n' +
        'Use the exact value $\\tan 60^\\circ = \\sqrt{3}$: $h = 20\\sqrt{3}$.',
      conclusion: 'The tower is opposite the angle and the ground is adjacent, so the height is $20\\sqrt{3}$ m.',
      whyWrong: [
        "This uses $20\\sin 60^\\circ$, treating the $20$ m ground distance as the hypotenuse. The hypotenuse is the sloping line of sight.",
        null,
        "This uses $20\\cos 60^\\circ$, again treating $20$ as the hypotenuse and also using the wrong ratio.",
        "This divides instead of multiplying: $\\frac{20}{\\tan 60^\\circ}$. From $\\tan 60^\\circ = \\frac{h}{20}$ you multiply both sides by $20$.",
      ],
      keyIdea: 'For height and distance problems, sketch the right-angled triangle, mark the angle, and label opposite, adjacent and hypotenuse. Ground distance plus height means tangent. The line of sight is the hypotenuse, never the ground.',
    },
    check: {
      optionValues: [10 * Math.sqrt(3), 20 * Math.sqrt(3), 10, (20 * Math.sqrt(3)) / 3],
      compute: () => 20 * Math.tan(rad(60)),
    },
  },
  {
    id: 'trig-functions-016',
    subtopic: 'trig-functions',
    difficulty: 'exam',
    stem: "A sector of a circle has radius $6$ cm and area $24 \\text{ cm}^2$. What is the perimeter of the sector?",
    options: ['$8$ cm', '$14$ cm', '$20$ cm', '$16$ cm'],
    correctIndex: 2,
    markScheme: {
      asking: 'How far is it all the way around the edge of this slice?',
      solution:
        'A **sector** is a slice of a circle. Its **perimeter** is the distance around its edge: the curved arc plus two straight radii. So we need the arc length, and for that we need the angle.\n\n' +
        'Use the sector area formula $A = \\frac{1}{2}r^2\\theta$, where $r$ is the radius and $\\theta$ is the angle at the centre in radians. Substitute $A = 24$ and $r = 6$: $24 = \\frac{1}{2} \\times 36 \\times \\theta$.\n\n' +
        'Simplify: $24 = 18\\theta$. Divide both sides by 18: $\\theta = \\frac{24}{18} = \\frac{4}{3}$ radians.\n\n' +
        'The arc length is $s = r\\theta$: $s = 6 \\times \\frac{4}{3} = 8$ cm.\n\n' +
        'Add all three edges: $8 + 6 + 6 = 20$ cm.',
      conclusion: 'The arc is 8 cm and each of the two straight edges is 6 cm, so the perimeter is $20$ cm.',
      whyWrong: [
        "$8$ cm is only the curved arc. The perimeter also includes the two straight edges (the radii).",
        "This adds only **one** radius to the arc ($6 + 8$). A sector is bounded by two radii.",
        null,
        "This forgets the $\\frac{1}{2}$ in the area formula, so $36\\theta = 24$ gives $\\theta = \\frac{2}{3}$, an arc of $4$ cm and a perimeter of $16$ cm.",
      ],
      keyIdea: 'Sector questions link $r$, the angle $\\theta$ in radians, the arc $s = r\\theta$ and the area $A = \\frac{1}{2}r^2\\theta$. Use the given quantity to find $\\theta$, then find the other. The perimeter is the arc plus $2r$.',
    },
    check: {
      optionValues: [8, 14, 20, 16],
      compute: () => {
        const r = 6;
        const area = 24;
        const theta = (2 * area) / (r * r);
        return 2 * r + r * theta;
      },
    },
  },
  {
    id: 'trig-functions-018',
    subtopic: 'trig-functions',
    difficulty: 'exam',
    stem: 'In triangle $HPQ$, $HP = 5$ km, $HQ = 3$ km and angle $PHQ = 120^\\circ$. Find the length of $PQ$.',
    options: ['$\\sqrt{19}$ km', '$\\sqrt{34}$ km', '$8$ km', '$7$ km'],
    correctIndex: 3,
    markScheme: {
      asking: 'How long is the third side, given two sides and the $120^\\circ$ angle between them?',
      solution:
        'We know two sides and the angle between them, so use the **cosine rule**. For side $PQ$, opposite angle $H$: $PQ^2 = HP^2 + HQ^2 - 2 \\times HP \\times HQ \\times \\cos H$.\n\n' +
        'Substitute: $PQ^2 = 5^2 + 3^2 - 2 \\times 5 \\times 3 \\times \\cos 120^\\circ$, which is $PQ^2 = 25 + 9 - 30\\cos 120^\\circ$.\n\n' +
        'Find $\\cos 120^\\circ$. Angles between $90^\\circ$ and $180^\\circ$ have a negative cosine. The **reference angle**, the matching acute angle, is $180^\\circ - 120^\\circ = 60^\\circ$, and $\\cos 60^\\circ = \\frac{1}{2}$. So $\\cos 120^\\circ = -\\frac{1}{2}$.\n\n' +
        'Taking away a negative adds: $-30 \\times \\left(-\\frac{1}{2}\\right) = 15$. So $PQ^2 = 34 + 15 = 49$.\n\n' +
        'Take the square root: $PQ = \\sqrt{49} = 7$.',
      conclusion: 'The negative cosine makes the last term add, giving $PQ^2 = 49$, so the length is $7$ km.',
      whyWrong: [
        "This uses $\\cos 120^\\circ = +\\frac{1}{2}$, so $34 - 15 = 19$. Cosine is negative for obtuse angles.",
        "This uses Pythagoras, $5^2 + 3^2$, which only works for a $90^\\circ$ angle.",
        "This just adds the two sides, which would only be right if $H$ lay on the straight segment $PQ$, with an angle of $180^\\circ$.",
        null,
      ],
      keyIdea: 'With an obtuse angle in the cosine rule, $\\cos$ is negative, so the last term adds and the side comes out longer than Pythagoras would give. Put the negative cosine in brackets when substituting.',
    },
    check: {
      optionValues: [Math.sqrt(19), Math.sqrt(34), 8, 7],
      compute: () => Math.sqrt(5 ** 2 + 3 ** 2 - 2 * 5 * 3 * Math.cos(rad(120))),
    },
  },
  {
    id: 'trig-functions-019',
    subtopic: 'trig-functions',
    difficulty: 'exam',
    stem: "For $y = 2 - 3\\cos\\left(\\frac{x}{2}\\right)$, with $x$ in radians, what are the range and the period?",
    options: [
      'Range $-1 \\le y \\le 5$, period $4\\pi$',
      'Range $-1 \\le y \\le 5$, period $\\pi$',
      'Range $-3 \\le y \\le 3$, period $4\\pi$',
      'Range $-1 \\le y \\le 5$, period $2\\pi$',
    ],
    correctIndex: 0,
    markScheme: {
      asking: 'Which values can $y$ take, and how long is one full wave?',
      solution:
        '**Range** means all the values $y$ can take. **Period** means the horizontal length of one full wave.\n\n' +
        'Start from what cosine can do: $-1 \\le \\cos\\left(\\frac{x}{2}\\right) \\le 1$, whatever its input.\n\n' +
        'The biggest $y$ happens when cosine is at its lowest, because we subtract it. With cosine at $-1$: $y = 2 - 3 \\times (-1) = 2 + 3 = 5$.\n\n' +
        'The smallest $y$ happens when cosine is at its highest. With cosine at 1: $y = 2 - 3 \\times 1 = -1$. So $y$ runs from $-1$ to 5.\n\n' +
        'For the period, cosine completes a wave when its input goes from 0 to $2\\pi$. Here the input is $\\frac{x}{2}$, so solve $\\frac{x}{2} = 2\\pi$. Multiply both sides by 2: $x = 4\\pi$.',
      conclusion: 'The outputs run from $-1$ to 5 and one wave takes $4\\pi$, so the answer is range $-1 \\le y \\le 5$, period $4\\pi$.',
      whyWrong: [
        null,
        "This multiplies $2\\pi$ by $\\frac{1}{2}$ instead of dividing by it. A factor of $\\frac{1}{2}$ on $x$ **stretches** the graph, making the period longer.",
        "This forgets the vertical shift: the $+2$ (written first as $2 - \\ldots$) moves the whole range up by $2$.",
        "This ignores the $\\frac{1}{2}$ inside the cosine and uses the period of plain $\\cos x$.",
      ],
      keyIdea: 'For $y = d + a\\cos(bx)$, the range runs from $d - \\lvert a \\rvert$ to $d + \\lvert a \\rvert$, where $\\lvert a \\rvert$ is the size of $a$ ignoring any minus sign. The period is $\\frac{2\\pi}{b}$. A minus in front of $a$ flips the wave but doesn\'t change the range. A fractional $b$ lengthens the period.',
    },
    check: {
      optionValues: ['-1|5|4', '-1|5|1', '-3|3|4', '-1|5|2'],
      compute: () => {
        const f = features((x) => 2 - 3 * Math.cos(x / 2));
        return `${f.min}|${f.max}|${f.periodOverPi}`;
      },
    },
  },
  {
    id: 'trig-functions-020',
    subtopic: 'trig-functions',
    difficulty: 'exam',
    stem: "Given that $\\sin\\theta = \\frac{5}{13}$ and that $\\theta$ is obtuse ($90^\\circ < \\theta < 180^\\circ$), find the exact value of $\\tan\\theta$.",
    options: ['$\\frac{5}{12}$', '$-\\frac{12}{5}$', '$-\\frac{5}{12}$', '$-\\frac{12}{13}$'],
    correctIndex: 2,
    markScheme: {
      asking: 'Given $\\sin\\theta$ and that the angle is obtuse, what is $\\tan\\theta$?',
      solution:
        'We need both sine and cosine, because $\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$. We are given sine, so find cosine with the identity $\\sin^2\\theta + \\cos^2\\theta = 1$. Here $\\sin^2\\theta$ means $\\sin\\theta$ multiplied by itself.\n\n' +
        'Substitute: $\\left(\\frac{5}{13}\\right)^2 + \\cos^2\\theta = 1$, so $\\frac{25}{169} + \\cos^2\\theta = 1$.\n\n' +
        'Subtract $\\frac{25}{169}$ from both sides: $\\cos^2\\theta = \\frac{169}{169} - \\frac{25}{169} = \\frac{144}{169}$.\n\n' +
        'Take the square root: $\\cos\\theta = \\pm\\frac{12}{13}$. An obtuse angle is in the second quadrant, the top-left quarter of a circle of radius 1. Cosine is the $x$-coordinate on that circle, and $x$ is negative there. So $\\cos\\theta = -\\frac{12}{13}$.\n\n' +
        'Divide: $\\tan\\theta = \\frac{5}{13} \\div \\left(-\\frac{12}{13}\\right) = \\frac{5}{13} \\times \\left(-\\frac{13}{12}\\right)$. The 13s cancel, which leaves $-\\frac{5}{12}$.',
      conclusion: 'Sine is positive and cosine is negative for an obtuse angle, so $\\tan\\theta$ is $-\\frac{5}{12}$.',
      whyWrong: [
        "This is the right size but ignores the quadrant. An obtuse angle is in the second quadrant, where $\\tan$ is negative.",
        "This is adjacent over opposite, $\\frac{\\cos\\theta}{\\sin\\theta}$, upside down. Tangent is opposite over adjacent.",
        null,
        "$-\\frac{12}{13}$ is $\\cos\\theta$. It is a correct step on the way, but the question asks for $\\tan\\theta$.",
      ],
      keyIdea: 'Given one ratio and the quadrant, find the second ratio with $\\sin^2\\theta + \\cos^2\\theta = 1$, pick its sign from the quadrant, then divide to get $\\tan\\theta$. A right-angled triangle with sides 5, 12 and 13 gives the same size.',
    },
    check: {
      optionValues: [5 / 12, -12 / 5, -5 / 12, -12 / 13],
      compute: () => Math.tan(PI - Math.asin(5 / 13)),
    },
  },
  {
    id: 'trig-functions-021',
    subtopic: 'trig-functions',
    difficulty: 'foundation',
    stem: "What is the value of $\\sin 90^\\circ + \\cos 180^\\circ + \\tan 45^\\circ$?",
    options: ['$3$', '$1$', '$2$', '$0$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What is the total of these three trig values?',
      solution:
        'Use the **unit circle**, a circle of radius 1 centred at the origin. The point at angle $\\theta$ has coordinates $(\\cos\\theta, \\sin\\theta)$.\n\n' +
        'Work out each term:\n\n| Term | Why | Value |\n|---|---|---|\n| $\\sin 90^\\circ$ | a quarter turn lands on $(0, 1)$, and sine is the $y$-coordinate | $1$ |\n| $\\cos 180^\\circ$ | a half turn lands on $(-1, 0)$, and cosine is the $x$-coordinate | $-1$ |\n| $\\tan 45^\\circ$ | opposite and adjacent are equal in a $45^\\circ$ right-angled triangle | $1$ |\n\n' +
        'Add them: $1 + (-1) + 1 = 1$.',
      conclusion: 'The first two values cancel, which leaves just $\\tan 45^\\circ$, so the total is $1$.',
      whyWrong: [
        "This takes $\\cos 180^\\circ = 1$. At $180^\\circ$ the unit-circle point is $(-1, 0)$, so $\\cos 180^\\circ = -1$.",
        null,
        "This takes $\\cos 180^\\circ = 0$, confusing it with $\\sin 180^\\circ = 0$.",
        "This takes $\\sin 90^\\circ = 0$, confusing it with $\\cos 90^\\circ = 0$.",
      ],
      keyIdea: 'For $0^\\circ$, $90^\\circ$, $180^\\circ$ and $270^\\circ$, read the unit circle: the points are $(1, 0)$, $(0, 1)$, $(-1, 0)$ and $(0, -1)$. Cosine is the first coordinate, and sine is the second.',
    },
    check: {
      optionValues: [3, 1, 2, 0],
      compute: () => Math.sin(rad(90)) + Math.cos(rad(180)) + Math.tan(rad(45)),
    },
  },
  {
    id: 'trig-functions-022',
    subtopic: 'trig-functions',
    difficulty: 'exam',
    stem: "What is the period of $y = 2\\tan(4x)$, where $x$ is in radians?",
    options: ['$\\frac{\\pi}{2}$', '$4\\pi$', '$\\frac{\\pi}{4}$', '$\\pi$'],
    correctIndex: 2,
    markScheme: {
      asking: 'How far along the $x$-axis does this tangent graph go before it repeats?',
      solution:
        'The **period** is how far along the $x$-axis you go before a graph repeats. Plain $\\tan x$ repeats every $\\pi$ radians, unlike sine and cosine, which repeat every $2\\pi$.\n\n' +
        'The 2 in front stretches the graph vertically. It doesn\'t change where the graph repeats, so ignore it for the period.\n\n' +
        'The 4 inside makes the input grow 4 times as fast. One repeat needs the input $4x$ to cover $\\pi$, so $4x = \\pi$.\n\n' +
        'Divide both sides by 4: $x = \\frac{\\pi}{4}$.',
      conclusion: 'Four times the speed means a quarter of the length, so the period is $\\frac{\\pi}{4}$.',
      whyWrong: [
        "This uses the formula for sine and cosine, $\\frac{2\\pi}{b} = \\frac{2\\pi}{4}$. But $\\tan x$ repeats every $\\pi$, not $2\\pi$, so the period of $\\tan(bx)$ is $\\frac{\\pi}{b}$.",
        "This multiplies the period of $\\tan x$ by $4$ instead of dividing. A bigger number in front of $x$ squashes the graph, so the period gets **shorter**.",
        null,
        "This is the period of plain $\\tan x$. It ignores the $4$ inside the bracket.",
      ],
      keyIdea: 'The period of $\\tan(bx)$ is $\\frac{\\pi}{b}$. The period of $\\sin(bx)$ and $\\cos(bx)$ is $\\frac{2\\pi}{b}$. The number in front of the function never affects the period.',
    },
    check: {
      optionValues: [0.5, 4, 0.25, 1],
      compute: () => {
        // Smallest T = k*pi/48 with 2tan(4(x+T)) = 2tan(4x) at several test points; returned as T/pi.
        const f = (x: number) => 2 * Math.tan(4 * x);
        const xs = [0.1, 0.37, 0.9, 1.3, 2.2];
        for (let k = 1; k <= 192; k++) {
          const T = (k * PI) / 48;
          if (xs.every((x) => Math.abs(f(x + T) - f(x)) < 1e-6)) return k / 48;
        }
        return NaN;
      },
    },
  },
  {
    id: 'trig-functions-023',
    subtopic: 'trig-functions',
    difficulty: 'foundation',
    stem: 'How many degrees are equal to $\\pi$ radians?',
    options: ['$180^\\circ$', '$360^\\circ$', '$90^\\circ$', '$3.14^\\circ$'],
    correctIndex: 0,
    markScheme: {
      asking: 'How many degrees is an angle of $\\pi$ radians?',
      solution:
        'A **radian** is another unit for measuring angles. A full turn is $360^\\circ$, and it is also $2\\pi$ radians, because a circle of radius 1 has a circumference of $2\\pi$.\n\n' +
        '$\\pi$ radians is half of $2\\pi$ radians, so it is half a turn: $360^\\circ \\div 2 = 180^\\circ$.',
      conclusion: '$\\pi$ radians is a half turn, so it equals $180^\\circ$.',
      whyWrong: [
        null,
        '$360^\\circ$ is a full turn, which is $2\\pi$ radians.',
        '$90^\\circ$ is a quarter turn, which is $\\frac{\\pi}{2}$ radians.',
        'This uses the size of the number $\\pi$ as if it were in degrees. One radian is about $57.3^\\circ$, so $\\pi$ radians is far more than $3.14^\\circ$.',
      ],
      keyIdea: 'Use $\\pi$ radians $= 180^\\circ$ for every conversion. Then $\\frac{\\pi}{2}$ is $90^\\circ$, $\\frac{\\pi}{3}$ is $60^\\circ$, $\\frac{\\pi}{6}$ is $30^\\circ$, and $2\\pi$ is $360^\\circ$.',
    },
    check: {
      optionValues: [180, 360, 90, 3.14],
      compute: () => PI / rad(1),
    },
  },
  {
    id: 'trig-functions-024',
    subtopic: 'trig-functions',
    difficulty: 'foundation',
    stem: 'What is the range of $y = \\sin x$?',
    options: ['$-1 \\le y \\le 1$', '$0 \\le y \\le 1$', '$-\\pi \\le y \\le \\pi$', 'All real numbers'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which values can $\\sin x$ take?',
      solution:
        'The **range** is all the values $y$ can take. On the unit circle (radius 1, centred at the origin), $\\sin x$ is the height of the point at angle $x$.\n\n' +
        'The highest that point gets is the top of the circle, at height 1. The lowest is the bottom, at height $-1$. As it goes round, it passes through every height in between: $-1 \\le y \\le 1$.',
      conclusion: 'The height on a circle of radius 1 can\'t go beyond the top or bottom, so the range is $-1 \\le y \\le 1$.',
      whyWrong: [
        null,
        'This leaves out negative values, but $\\sin 270^\\circ = -1$.',
        'This confuses the outputs with the inputs. $\\pi$ is an angle in radians, not a value that the sine reaches.',
        'This is the range of $y = \\tan x$. The sine never goes beyond $\\pm 1$.',
      ],
      keyIdea: 'Sine and cosine both have a range from $-1$ to 1. So $y = a\\sin x + d$ has a range from $d - \\lvert a \\rvert$ to $d + \\lvert a \\rvert$, where $\\lvert a \\rvert$ is the size of $a$ ignoring any minus sign. Tangent alone can be any real number.',
    },
    check: {
      optionValues: ['-1|1', '0|1', '-3.14|3.14', 'all'],
      compute: () => {
        const f = features((x) => Math.sin(x));
        return `${f.min}|${f.max}`;
      },
    },
  },
  {
    id: 'trig-functions-025',
    subtopic: 'trig-functions',
    difficulty: 'foundation',
    stem: 'What is the period of $y = \\cos x$, with $x$ in degrees?',
    options: ['$360^\\circ$', '$180^\\circ$', '$90^\\circ$', '$720^\\circ$'],
    correctIndex: 0,
    markScheme: {
      asking: 'After how many degrees does the graph of $\\cos x$ start repeating?',
      solution:
        'The **period** is how far along the $x$-axis you go before a graph starts repeating.\n\n' +
        '$\\cos x$ is the $x$-coordinate of a point moving round the unit circle (a circle of radius 1). Starting at $0^\\circ$, the values are $\\cos 0^\\circ = 1$, $\\cos 90^\\circ = 0$, $\\cos 180^\\circ = -1$, $\\cos 270^\\circ = 0$ and then 1 again.\n\n' +
        'After one full turn, the point is back where it started and everything repeats. One full turn is $360^\\circ$.',
      conclusion: 'The values only return to their starting pattern after one full turn, so the period is $360^\\circ$.',
      whyWrong: [
        null,
        '$180^\\circ$ is the period of $\\tan x$. After $180^\\circ$, $\\cos x$ is at $-1$, only halfway through its cycle.',
        '$90^\\circ$ is a quarter of a cycle: this is where $\\cos x$ first reaches $0$.',
        '$720^\\circ$ is two full cycles. The graph has already repeated by $360^\\circ$.',
      ],
      keyIdea: 'Sine and cosine repeat after a full turn, $360^\\circ$ or $2\\pi$. Tangent repeats after a half turn, $180^\\circ$ or $\\pi$. When the input is $bx$, divide the period by $b$.',
    },
    check: {
      optionValues: [360, 180, 90, 720],
      compute: () => {
        const c = (d: number) => Math.cos(rad(d));
        for (let p = 1; p <= 720; p++) {
          if ([0, 10, 25, 70].every((d) => Math.abs(c(d + p) - c(d)) < 1e-9)) return p;
        }
        return 0;
      },
    },
  },
  {
    id: 'trig-functions-026',
    subtopic: 'trig-functions',
    difficulty: 'foundation',
    stem: 'In a right-angled triangle, which ratio equals $\\frac{\\text{opposite}}{\\text{hypotenuse}}$?',
    options: ['Sine', 'Cosine', 'Tangent', 'Inverse sine'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which trig ratio is the opposite side divided by the hypotenuse?',
      solution:
        'In a right-angled triangle, the **hypotenuse** is the longest side, across from the right angle. The **opposite** side is across from the chosen angle, and the **adjacent** side is next to it.\n\n' +
        'The memory word SOH CAH TOA gives the three ratios. S-O-H means **S**ine is **O**pposite over **H**ypotenuse.',
      conclusion: 'SOH says it directly: opposite over hypotenuse is sine.',
      whyWrong: [
        null,
        'Cosine is adjacent over hypotenuse.',
        'Tangent is opposite over adjacent.',
        'Inverse sine goes the other way: it takes a ratio and gives back an angle.',
      ],
      keyIdea: 'Use SOH CAH TOA: sine is opposite over hypotenuse, cosine is adjacent over hypotenuse, and tangent is opposite over adjacent. Write it at the top of your working for any right-angled triangle question.',
    },
  },];
