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
      solution:
        "A half turn is $180^\\circ = \\pi$ radians, so to go from degrees to radians multiply by $\\frac{\\pi}{180}$.\n\n" +
        "$$135^\\circ = 135 \\times \\frac{\\pi}{180} = \\frac{135\\pi}{180}$$\n\n" +
        "Simplify the fraction: $\\frac{135}{180} = \\frac{3}{4}$ (divide top and bottom by $45$).\n\n" +
        "So $135^\\circ = \\frac{3\\pi}{4}$.\n\n" +
        "Sanity check: $135^\\circ$ is between $90^\\circ = \\frac{\\pi}{2}$ and $180^\\circ = \\pi$, and $\\frac{3\\pi}{4}$ is between those too.",
      whyWrong: [
        "This uses the conversion factor upside down, $\\frac{180}{135}\\pi$. The angle in degrees goes on top: $\\frac{135}{180}\\pi$.",
        "This uses $360^\\circ = \\pi$. A full turn is $2\\pi$; it is a **half** turn ($180^\\circ$) that equals $\\pi$.",
        null,
        "This uses $180^\\circ = 2\\pi$, giving $135 \\times \\frac{2\\pi}{180}$. Remember $180^\\circ = \\pi$, not $2\\pi$.",
      ],
      keyIdea: "Degrees to radians: multiply by $\\frac{\\pi}{180}$ (because $180^\\circ = \\pi$ radians).",
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
      solution:
        "Use half of an equilateral triangle with side $2$. Cutting it in half gives a right-angled triangle with angles $30^\\circ$, $60^\\circ$, $90^\\circ$ and sides $1$, $\\sqrt{3}$, $2$ (hypotenuse $2$, since $1^2 + (\\sqrt{3})^2 = 4$).\n\n" +
        "For the $30^\\circ$ angle: the opposite side is $1$ and the adjacent side is $\\sqrt{3}$.\n\n" +
        "$$\\tan 30^\\circ = \\frac{\\text{opp}}{\\text{adj}} = \\frac{1}{\\sqrt{3}}$$\n\n" +
        "Rationalise the denominator (multiply top and bottom by $\\sqrt{3}$): $\\frac{1}{\\sqrt{3}} = \\frac{\\sqrt{3}}{3}$.\n\n" +
        "Check on a calculator: $\\tan 30^\\circ \\approx 0.577$ and $\\frac{\\sqrt{3}}{3} \\approx 0.577$.",
      whyWrong: [
        "$\\sqrt{3}$ is $\\tan 60^\\circ$: the opposite and adjacent sides have been swapped.",
        "$\\frac{1}{2}$ is $\\sin 30^\\circ$ (opposite over hypotenuse), not $\\tan 30^\\circ$.",
        "$\\frac{\\sqrt{3}}{2}$ is $\\cos 30^\\circ$ (adjacent over hypotenuse), not $\\tan 30^\\circ$.",
        null,
      ],
      keyIdea: "From the $1$, $\\sqrt{3}$, $2$ triangle, $\\tan 30^\\circ = \\frac{1}{\\sqrt{3}} = \\frac{\\sqrt{3}}{3}$.",
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
      solution:
        "Label the sides from the point of view of angle $A$:\n\n" +
        "- hypotenuse (opposite the right angle): $AB = 10$\n" +
        "- opposite angle $A$: $BC$ (the side we want)\n" +
        "- adjacent to angle $A$: $AC$\n\n" +
        "Opposite and hypotenuse means **SOH**: $\\sin A = \\frac{\\text{opp}}{\\text{hyp}}$.\n\n" +
        "$$\\sin 30^\\circ = \\frac{BC}{10} \\quad\\Rightarrow\\quad BC = 10 \\sin 30^\\circ = 10 \\times \\frac{1}{2} = 5$$\n\n" +
        "So $BC = 5$ cm.",
      whyWrong: [
        "This uses cosine, $10 \\cos 30^\\circ = 5\\sqrt{3}$, which gives the **adjacent** side $AC$, not $BC$.",
        null,
        "This divides instead of multiplying: $\\frac{10}{\\sin 30^\\circ} = 20$. A side of a right-angled triangle can never be longer than the hypotenuse.",
        "This treats $10$ as the adjacent side and uses tangent, $10 \\tan 30^\\circ$. But $10$ is the hypotenuse.",
      ],
      keyIdea: "Label opp/adj/hyp relative to the given angle, then pick SOH, CAH or TOA from the two sides involved.",
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
      solution:
        "On the unit circle, the point at angle $\\theta$ is $(\\cos\\theta, \\sin\\theta)$.\n\n" +
        "For $90^\\circ < \\theta < 180^\\circ$ the point is in the **second quadrant** (top left):\n\n" +
        "- its $x$-coordinate is negative, so $\\cos\\theta < 0$\n" +
        "- its $y$-coordinate is positive, so $\\sin\\theta > 0$\n" +
        "- $\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta} = \\frac{\\text{positive}}{\\text{negative}} < 0$\n\n" +
        "Example: $\\theta = 120^\\circ$ gives $\\sin 120^\\circ = \\frac{\\sqrt{3}}{2} > 0$ and $\\cos 120^\\circ = -\\frac{1}{2} < 0$.\n\n" +
        "So the true statement is $\\sin\\theta > 0$ and $\\cos\\theta < 0$ (CAST: in the second quadrant only **S**ine is positive).",
      whyWrong: [
        "These are the signs in the **fourth** quadrant ($270^\\circ$ to $360^\\circ$), where the point is below the $x$-axis and to the right.",
        "Both being positive happens in the **first** quadrant. In the second quadrant $\\tan\\theta$ is negative because $\\cos\\theta$ is negative.",
        "This is the **third** quadrant pattern ($\\sin$ and $\\cos$ both negative make $\\tan$ positive). In the second quadrant $\\tan\\theta < 0$.",
        null,
      ],
      keyIdea: "CAST: first quadrant All positive, second Sine, third Tangent, fourth Cosine.",
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
      solution:
        "For $y = a\\sin(bx)$:\n\n" +
        "- amplitude $= |a|$ (the height from the middle line up to a peak)\n" +
        "- period $= \\frac{2\\pi}{b}$ (the length of one full wave)\n\n" +
        "Here $a = 3$ and $b = 2$.\n\n" +
        "- Amplitude $= 3$ (the graph goes from $-3$ up to $3$).\n" +
        "- Period $= \\frac{2\\pi}{2} = \\pi$. The $2$ inside squashes the graph horizontally, so it repeats twice as often as $\\sin x$.",
      whyWrong: [
        null,
        "This multiplies $2\\pi$ by $2$ instead of dividing. A bigger $b$ makes the waves **shorter**, so the period is $\\frac{2\\pi}{b}$.",
        "$6$ is the distance from the lowest point to the highest point. Amplitude is only **half** of that: the distance from the middle to a peak.",
        "This ignores the $2$ inside the bracket and uses the period of plain $\\sin x$.",
      ],
      keyIdea: "For $y = a\\sin(bx)$ the amplitude is $|a|$ and the period is $\\frac{2\\pi}{b}$.",
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
      solution:
        "The arc-length formula $s = r\\theta$ only works with $\\theta$ in **radians**, so convert first:\n\n" +
        "$$120^\\circ = 120 \\times \\frac{\\pi}{180} = \\frac{2\\pi}{3}$$\n\n" +
        "Then\n\n" +
        "$$s = r\\theta = 9 \\times \\frac{2\\pi}{3} = 6\\pi \\text{ cm}$$\n\n" +
        "Check with fractions of a circle: $120^\\circ$ is $\\frac{1}{3}$ of a full turn, and the full circumference is $2\\pi \\times 9 = 18\\pi$, so the arc is $\\frac{18\\pi}{3} = 6\\pi$ cm.",
      whyWrong: [
        "This uses the **sector area** formula $\\frac{1}{2}r^2\\theta = \\frac{1}{2} \\times 81 \\times \\frac{2\\pi}{3} = 27\\pi$. That is an area (in square cm), not a length.",
        null,
        "This puts the angle into $s = r\\theta$ in degrees: $9 \\times 120 = 1080$. The formula needs $\\theta$ in radians.",
        "$18\\pi$ is the circumference of the **whole** circle. The arc is only $\\frac{120}{360} = \\frac{1}{3}$ of it.",
      ],
      keyIdea: "Arc length $s = r\\theta$ with $\\theta$ in radians (or the fraction $\\frac{\\theta}{360}$ of the circumference when working in degrees).",
    },
    check: {
      optionValues: [27 * PI, 6 * PI, 1080, 18 * PI],
      compute: () => 9 * rad(120),
    },
  },
  {
    id: 'trig-functions-007',
    subtopic: 'trig-functions',
    difficulty: 'exam',
    stem: "A sector has radius $4$ cm and angle $1.5$ radians at the centre. What is its area?",
    options: ['$6 \\text{ cm}^2$', '$24 \\text{ cm}^2$', '$4.5 \\text{ cm}^2$', '$12 \\text{ cm}^2$'],
    correctIndex: 3,
    markScheme: {
      solution:
        "The angle is already in radians, so use the sector area formula directly:\n\n" +
        "$$A = \\frac{1}{2}r^2\\theta$$\n\n" +
        "Substitute $r = 4$ and $\\theta = 1.5$:\n\n" +
        "$$A = \\frac{1}{2} \\times 4^2 \\times 1.5 = \\frac{1}{2} \\times 16 \\times 1.5 = 8 \\times 1.5 = 12$$\n\n" +
        "So the area is $12 \\text{ cm}^2$.",
      whyWrong: [
        "$6$ is the **arc length** $r\\theta = 4 \\times 1.5$, not the area.",
        "This forgets the $\\frac{1}{2}$ in the formula: $r^2\\theta = 16 \\times 1.5 = 24$.",
        "This squares the angle instead of the radius: $\\frac{1}{2} \\times 4 \\times 1.5^2 = 4.5$. It is $r$ that is squared.",
        null,
      ],
      keyIdea: "Sector area $= \\frac{1}{2}r^2\\theta$ with $\\theta$ in radians.",
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
      solution:
        "We know two angles and the side opposite one of them, so use the **sine rule**, pairing each side with its opposite angle:\n\n" +
        "$$\\frac{b}{\\sin B} = \\frac{a}{\\sin A}$$\n\n" +
        "Rearrange for $b$:\n\n" +
        "$$b = \\frac{a \\sin B}{\\sin A} = \\frac{5 \\sin 45^\\circ}{\\sin 30^\\circ}$$\n\n" +
        "Use exact values $\\sin 45^\\circ = \\frac{\\sqrt{2}}{2}$ and $\\sin 30^\\circ = \\frac{1}{2}$:\n\n" +
        "$$b = \\frac{5 \\times \\frac{\\sqrt{2}}{2}}{\\frac{1}{2}} = 5\\sqrt{2} \\approx 7.07 \\text{ cm}$$\n\n" +
        "Sanity check: $B > A$, so $b$ should be longer than $a = 5$. It is.",
      whyWrong: [
        "$10$ is only $\\frac{a}{\\sin A} = \\frac{5}{\\frac{1}{2}}$, the common ratio of the sine rule. You still need to multiply by $\\sin B$.",
        "This assumes sides are proportional to the **angles** themselves: $5 \\times \\frac{45}{30} = 7.5$. The sine rule uses the **sines** of the angles.",
        null,
        "This has the ratio upside down, $b = \\frac{a \\sin A}{\\sin B}$, giving $\\frac{5}{\\sqrt{2}}$. The larger angle $B$ must face the longer side, so $b > 5$.",
      ],
      keyIdea: "Sine rule: $\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}$, each side over the sine of its opposite angle.",
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
      solution:
        "Two sides and the angle **between** them: use the **cosine rule**. With $b = AC = 5$, $c = AB = 8$ and $a = BC$:\n\n" +
        "$$a^2 = b^2 + c^2 - 2bc\\cos A$$\n\n" +
        "Substitute:\n\n" +
        "$$a^2 = 5^2 + 8^2 - 2 \\times 5 \\times 8 \\times \\cos 60^\\circ$$\n\n" +
        "$$a^2 = 25 + 64 - 80 \\times \\frac{1}{2} = 89 - 40 = 49$$\n\n" +
        "Take the square root: $a = \\sqrt{49} = 7$.\n\n" +
        "So $BC = 7$ cm.",
      whyWrong: [
        null,
        "$49$ is $a^2$. The last step, taking the square root, has been forgotten.",
        "This adds the $2bc\\cos A$ term instead of subtracting it: $89 + 40 = 129$.",
        "This uses Pythagoras ($a^2 = 25 + 64$), which only works when the angle is $90^\\circ$. Here it is $60^\\circ$.",
      ],
      keyIdea: "Cosine rule $a^2 = b^2 + c^2 - 2bc\\cos A$ finds the third side from two sides and the included angle.",
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
      solution:
        "The largest angle is opposite the longest side, $c = 7$. Use the cosine rule rearranged for the angle:\n\n" +
        "$$\\cos C = \\frac{a^2 + b^2 - c^2}{2ab}$$\n\n" +
        "With $a = 3$, $b = 5$, $c = 7$:\n\n" +
        "$$\\cos C = \\frac{9 + 25 - 49}{2 \\times 3 \\times 5} = \\frac{-15}{30} = -\\frac{1}{2}$$\n\n" +
        "A negative cosine means the angle is **obtuse** (between $90^\\circ$ and $180^\\circ$).\n\n" +
        "$$C = \\cos^{-1}\\left(-\\frac{1}{2}\\right) = 120^\\circ$$",
      whyWrong: [
        "This loses the minus sign (for example by computing $49 - 9 - 25$ on top), giving $\\cos C = \\frac{1}{2}$ and $60^\\circ$. Because $7^2 > 3^2 + 5^2$, the angle must be obtuse.",
        "This assumes the largest angle is a right angle. But $3^2 + 5^2 = 34 \\ne 49 = 7^2$, so it is not a right-angled triangle.",
        null,
        "This matches $\\cos C = -\\frac{1}{2}$ to the wrong exact value: $\\cos 150^\\circ = -\\frac{\\sqrt{3}}{2}$, while $\\cos 120^\\circ = -\\frac{1}{2}$.",
      ],
      keyIdea: "Rearranged cosine rule $\\cos C = \\frac{a^2 + b^2 - c^2}{2ab}$; a negative result means an obtuse angle.",
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
      solution:
        "Convert to degrees to see where the angle is: $\\frac{4\\pi}{3} = \\frac{4 \\times 180^\\circ}{3} = 240^\\circ$.\n\n" +
        "1. **Quadrant:** $240^\\circ$ is between $180^\\circ$ and $270^\\circ$, the third quadrant. There only $\\tan$ is positive, so $\\cos$ is **negative**.\n" +
        "2. **Reference angle** (angle to the nearest $x$-axis): $240^\\circ - 180^\\circ = 60^\\circ$.\n" +
        "3. **Exact value:** $\\cos 60^\\circ = \\frac{1}{2}$.\n\n" +
        "Put the sign and the value together: $\\cos\\left(\\frac{4\\pi}{3}\\right) = -\\frac{1}{2}$.",
      whyWrong: [
        "This has the right size but the wrong sign: in the third quadrant the $x$-coordinate on the unit circle is negative, so $\\cos$ is negative.",
        "This is $\\sin\\left(\\frac{4\\pi}{3}\\right)$, not $\\cos$: it uses $\\sin 60^\\circ = \\frac{\\sqrt{3}}{2}$ for the reference angle instead of $\\cos 60^\\circ$.",
        "This uses the sine value of the reference angle **and** forgets that cosine is negative in the third quadrant.",
        null,
      ],
      keyIdea: "Any angle: find its quadrant (for the sign) and its reference angle (for the size), then use the exact-value table.",
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
      solution:
        "Work out each constant separately.\n\n" +
        "1. **Amplitude** $a$ is half the distance from minimum to maximum: $a = \\frac{5 - (-1)}{2} = \\frac{6}{2} = 3$.\n" +
        "2. **Vertical shift** $d$ is the middle line, the average of max and min: $d = \\frac{5 + (-1)}{2} = \\frac{4}{2} = 2$.\n" +
        "3. **Period** $= \\frac{2\\pi}{b} = \\pi$, so $b = \\frac{2\\pi}{\\pi} = 2$.\n\n" +
        "So $y = 3\\sin(2x) + 2$.\n\n" +
        "Check: the maximum is $3 + 2 = 5$ and the minimum is $-3 + 2 = -1$.",
      whyWrong: [
        "This uses the full height ($5 - (-1) = 6$) as the amplitude and the minimum as the shift. Its range is $-7 \\le y \\le 5$, so the minimum is wrong.",
        null,
        "This swaps the amplitude and the shift: its maximum is $2 + 3 = 5$ but its minimum is $-2 + 3 = 1$, not $-1$.",
        "This gets $b$ upside down. $\\sin\\left(\\frac{x}{2}\\right)$ has period $\\frac{2\\pi}{\\frac{1}{2}} = 4\\pi$, not $\\pi$.",
      ],
      keyIdea: "Amplitude $= \\frac{\\max - \\min}{2}$, middle line $= \\frac{\\max + \\min}{2}$, and $b = \\frac{2\\pi}{\\text{period}}$.",
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
      solution:
        "Read two things from the graph.\n\n" +
        "1. **Amplitude:** the graph goes from a maximum of $4$ down to a minimum of $-4$. The amplitude is half of that range: $a = \\frac{4 - (-4)}{2} = 4$.\n" +
        "2. **Period:** the graph is at a peak at $x = 0^\\circ$, and the next peak is at $x = 180^\\circ$. So one full wave takes $180^\\circ$.\n\n" +
        "For $y = a\\cos(bx)$ in degrees, period $= \\frac{360^\\circ}{b}$, so\n\n" +
        "$$b = \\frac{360^\\circ}{180^\\circ} = 2$$\n\n" +
        "There are $2$ complete waves between $0^\\circ$ and $360^\\circ$, which matches $b = 2$.\n\n" +
        "So $a = 4$ and $b = 2$: the graph is $y = 4\\cos(2x)$.",
      whyWrong: [
        "$8$ is the full distance from the lowest point ($-4$) to the highest point ($4$). The amplitude is half of that.",
        "$180$ is the **period**, not $b$. The value of $b$ is $\\frac{360}{\\text{period}}$, the number of waves in $360^\\circ$.",
        "This computes $b = \\frac{\\text{period}}{360} = \\frac{180}{360}$, upside down. A $b$ bigger than $1$ squashes the graph so it repeats more often.",
        null,
      ],
      keyIdea: "Amplitude is half the max-to-min height; $b$ counts how many full waves fit into $360^\\circ$ (or $2\\pi$).",
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
      solution:
        "On the unit circle the point at angle $\\theta$ is $(\\cos\\theta, \\sin\\theta)$. So\n\n" +
        "- $\\cos\\theta = x = -\\frac{3}{5}$\n" +
        "- $\\sin\\theta = y = \\frac{4}{5}$\n\n" +
        "Then\n\n" +
        "$$\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta} = \\frac{\\frac{4}{5}}{-\\frac{3}{5}} = -\\frac{4}{3}$$\n\n" +
        "Sign check: $P$ is in the second quadrant (top left), where $\\tan$ is negative.",
      whyWrong: [
        null,
        "This divides $x$ by $y$ ($\\frac{\\cos\\theta}{\\sin\\theta}$). Tangent is $\\frac{y}{x} = \\frac{\\sin\\theta}{\\cos\\theta}$.",
        "This drops the minus sign. $P$ has a negative $x$-coordinate, so $\\tan\\theta = \\frac{y}{x}$ is negative.",
        "$\\frac{4}{5}$ is the $y$-coordinate, which is $\\sin\\theta$, not $\\tan\\theta$.",
      ],
      keyIdea: "On the unit circle $x = \\cos\\theta$, $y = \\sin\\theta$ and $\\tan\\theta = \\frac{y}{x}$.",
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
    stem:
      "From a point on level ground $20$ m from the foot of a vertical tower, the angle of elevation of the top of the tower is $60^\\circ$. How tall is the tower?",
    options: ['$10\\sqrt{3}$ m', '$20\\sqrt{3}$ m', '$10$ m', '$\\frac{20\\sqrt{3}}{3}$ m'],
    correctIndex: 1,
    markScheme: {
      solution:
        "Draw the right-angled triangle: the ground ($20$ m) is the side **adjacent** to the $60^\\circ$ angle, and the tower height $h$ is the side **opposite** it.\n\n" +
        "Opposite and adjacent means **TOA**:\n\n" +
        "$$\\tan 60^\\circ = \\frac{h}{20} \\quad\\Rightarrow\\quad h = 20\\tan 60^\\circ = 20\\sqrt{3}$$\n\n" +
        "So the tower is $20\\sqrt{3} \\approx 34.6$ m tall.\n\n" +
        "Sanity check: a $60^\\circ$ elevation is steep, so the tower should be taller than the $20$ m distance. It is.",
      whyWrong: [
        "This uses $20\\sin 60^\\circ$, treating the $20$ m ground distance as the hypotenuse. The hypotenuse is the sloping line of sight.",
        null,
        "This uses $20\\cos 60^\\circ$, again treating $20$ as the hypotenuse and also using the wrong ratio.",
        "This divides instead of multiplying: $\\frac{20}{\\tan 60^\\circ}$. From $\\tan 60^\\circ = \\frac{h}{20}$ you multiply both sides by $20$.",
      ],
      keyIdea: "Angle of elevation problems are right-angled triangles: horizontal distance is adjacent, height is opposite, so use $\\tan$.",
    },
    check: {
      optionValues: [10 * Math.sqrt(3), 20 * Math.sqrt(3), 10, (20 * Math.sqrt(3)) / 3],
      compute: () => 20 * Math.tan(rad(60)),
    },
  },
  {
    id: 'trig-functions-016',
    subtopic: 'trig-functions',
    difficulty: 'challenge',
    stem: "A sector of a circle has radius $6$ cm and area $24 \\text{ cm}^2$. What is the perimeter of the sector?",
    options: ['$8$ cm', '$14$ cm', '$20$ cm', '$16$ cm'],
    correctIndex: 2,
    markScheme: {
      solution:
        "**Step 1: find the angle** (in radians) from the area formula $A = \\frac{1}{2}r^2\\theta$:\n\n" +
        "$$24 = \\frac{1}{2} \\times 6^2 \\times \\theta = 18\\theta \\quad\\Rightarrow\\quad \\theta = \\frac{24}{18} = \\frac{4}{3}$$\n\n" +
        "**Step 2: find the arc length:**\n\n" +
        "$$s = r\\theta = 6 \\times \\frac{4}{3} = 8 \\text{ cm}$$\n\n" +
        "**Step 3: add up the boundary.** The perimeter of a sector is two radii plus the arc:\n\n" +
        "$$P = 6 + 6 + 8 = 20 \\text{ cm}$$",
      whyWrong: [
        "$8$ cm is only the curved arc. The perimeter also includes the two straight edges (the radii).",
        "This adds only **one** radius to the arc ($6 + 8$). A sector is bounded by two radii.",
        null,
        "This forgets the $\\frac{1}{2}$ in the area formula, so $36\\theta = 24$ gives $\\theta = \\frac{2}{3}$, an arc of $4$ cm and a perimeter of $16$ cm.",
      ],
      keyIdea: "Sector perimeter $= 2r + r\\theta$; get $\\theta$ from the area $\\frac{1}{2}r^2\\theta$ first.",
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
    id: 'trig-functions-017',
    subtopic: 'trig-functions',
    difficulty: 'challenge',
    stem:
      "In triangle $ABC$, angle $A = 30^\\circ$, side $a = BC = 5$ cm and side $b = AC = 8$ cm. How many different triangles fit this information?",
    options: ['$0$', '$1$', '$2$', 'Infinitely many'],
    correctIndex: 2,
    markScheme: {
      solution:
        "We know one angle and the side opposite it, plus another side, so use the sine rule to find angle $B$:\n\n" +
        "$$\\frac{\\sin B}{b} = \\frac{\\sin A}{a} \\quad\\Rightarrow\\quad \\sin B = \\frac{b\\sin A}{a} = \\frac{8 \\times \\frac{1}{2}}{5} = \\frac{4}{5} = 0.8$$\n\n" +
        "Since $0.8 < 1$, there is at least one solution. But **two** angles between $0^\\circ$ and $180^\\circ$ have sine $0.8$:\n\n" +
        "- $B_1 = \\sin^{-1}(0.8) \\approx 53.1^\\circ$ (the calculator answer)\n" +
        "- $B_2 = 180^\\circ - 53.1^\\circ \\approx 126.9^\\circ$\n\n" +
        "Check each still leaves room for angle $C$ (the angles must add to $180^\\circ$):\n\n" +
        "- $30^\\circ + 53.1^\\circ = 83.1^\\circ < 180^\\circ$, so $C \\approx 96.9^\\circ$. Valid.\n" +
        "- $30^\\circ + 126.9^\\circ = 156.9^\\circ < 180^\\circ$, so $C \\approx 23.1^\\circ$. Valid.\n\n" +
        "Both work, so there are $2$ different triangles (the \"ambiguous case\" of the sine rule).",
      whyWrong: [
        "This comes from rearranging the sine rule wrongly, for example $\\sin B = \\frac{b}{a\\sin A} = \\frac{8}{2.5} = 3.2 > 1$, which looks impossible. Correctly, $\\sin B = \\frac{b\\sin A}{a} = 0.8$.",
        "This takes only the calculator value $B \\approx 53.1^\\circ$ and forgets that $\\sin(180^\\circ - B) = \\sin B$, so $126.9^\\circ$ also works.",
        null,
        "This assumes that because the known angle is not between the two known sides, the triangle is not fixed at all. In fact the sine rule gives at most two possible values for $B$, so there can be at most two triangles.",
      ],
      keyIdea: "When the sine rule gives an angle, also test $180^\\circ$ minus it: if both fit with the known angle, there are two triangles.",
    },
    check: {
      optionValues: [0, 1, 2, null],
      compute: () => {
        const A = rad(30);
        const a = 5;
        const b = 8;
        const s = (b * Math.sin(A)) / a;
        if (s > 1) return 0;
        const B1 = Math.asin(s);
        const options = Math.abs(s - 1) < 1e-12 ? [B1] : [B1, PI - B1];
        return options.filter((B) => A + B < PI - 1e-9).length;
      },
    },
  },
  {
    id: 'trig-functions-018',
    subtopic: 'trig-functions',
    difficulty: 'challenge',
    stem:
      "Two boats leave a harbour at the same time. After one hour boat $P$ is $5$ km from the harbour and boat $Q$ is $3$ km from the harbour, and the angle between their two straight paths at the harbour is $120^\\circ$. How far apart are the boats?",
    options: ['$\\sqrt{19}$ km', '$\\sqrt{34}$ km', '$8$ km', '$7$ km'],
    correctIndex: 3,
    markScheme: {
      solution:
        "The harbour $H$ and the boats form triangle $HPQ$ with $HP = 5$, $HQ = 3$ and angle $H = 120^\\circ$ between them. Two sides and the included angle: use the cosine rule.\n\n" +
        "$$PQ^2 = 5^2 + 3^2 - 2 \\times 5 \\times 3 \\times \\cos 120^\\circ$$\n\n" +
        "Careful: $120^\\circ$ is in the second quadrant, so its cosine is **negative**: $\\cos 120^\\circ = -\\frac{1}{2}$.\n\n" +
        "$$PQ^2 = 25 + 9 - 30 \\times \\left(-\\frac{1}{2}\\right) = 34 + 15 = 49$$\n\n" +
        "$$PQ = \\sqrt{49} = 7 \\text{ km}$$\n\n" +
        "Sanity check: the angle is wider than $90^\\circ$, so the distance must be more than the Pythagoras value $\\sqrt{34} \\approx 5.8$, and less than $5 + 3 = 8$. It is.",
      whyWrong: [
        "This uses $\\cos 120^\\circ = +\\frac{1}{2}$, so $34 - 15 = 19$. Cosine is negative for obtuse angles.",
        "This uses Pythagoras, $5^2 + 3^2$, which only works for a $90^\\circ$ angle.",
        "This just adds the distances, which would only be right if the boats went in exactly opposite directions ($180^\\circ$).",
        null,
      ],
      keyIdea: "For an obtuse included angle, $\\cos$ is negative, so the cosine rule ADDS to $b^2 + c^2$ and the third side gets longer.",
    },
    check: {
      optionValues: [Math.sqrt(19), Math.sqrt(34), 8, 7],
      compute: () => Math.sqrt(5 ** 2 + 3 ** 2 - 2 * 5 * 3 * Math.cos(rad(120))),
    },
  },
  {
    id: 'trig-functions-019',
    subtopic: 'trig-functions',
    difficulty: 'challenge',
    stem: "For $y = 2 - 3\\cos\\left(\\frac{x}{2}\\right)$, with $x$ in radians, what are the range and the period?",
    options: [
      'Range $-1 \\le y \\le 5$, period $4\\pi$',
      'Range $-1 \\le y \\le 5$, period $\\pi$',
      'Range $-3 \\le y \\le 3$, period $4\\pi$',
      'Range $-1 \\le y \\le 5$, period $2\\pi$',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        "Rewrite as $y = -3\\cos\\left(\\frac{x}{2}\\right) + 2$, the form $y = a\\cos(bx) + d$ with $a = -3$, $b = \\frac{1}{2}$, $d = 2$.\n\n" +
        "**Range.** $\\cos$ of anything lies between $-1$ and $1$, so $-3\\cos\\left(\\frac{x}{2}\\right)$ lies between $-3$ and $3$ (the minus sign only flips the graph upside down; amplitude $= |a| = 3$). Adding $2$ shifts everything up by $2$:\n\n" +
        "$$-3 + 2 \\le y \\le 3 + 2 \\quad\\Rightarrow\\quad -1 \\le y \\le 5$$\n\n" +
        "**Period.**\n\n" +
        "$$\\text{period} = \\frac{2\\pi}{b} = \\frac{2\\pi}{\\frac{1}{2}} = 4\\pi$$\n\n" +
        "Dividing $x$ by $2$ stretches the graph, so it takes twice as long to repeat as $\\cos x$.",
      whyWrong: [
        null,
        "This multiplies $2\\pi$ by $\\frac{1}{2}$ instead of dividing by it. A factor of $\\frac{1}{2}$ on $x$ **stretches** the graph, making the period longer.",
        "This forgets the vertical shift: the $+2$ (written first as $2 - \\ldots$) moves the whole range up by $2$.",
        "This ignores the $\\frac{1}{2}$ inside the cosine and uses the period of plain $\\cos x$.",
      ],
      keyIdea: "For $y = a\\cos(bx) + d$: range is $d - |a|$ to $d + |a|$ and period is $\\frac{2\\pi}{b}$.",
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
    difficulty: 'challenge',
    stem: "Given that $\\sin\\theta = \\frac{5}{13}$ and that $\\theta$ is obtuse ($90^\\circ < \\theta < 180^\\circ$), find the exact value of $\\tan\\theta$.",
    options: ['$\\frac{5}{12}$', '$-\\frac{12}{5}$', '$-\\frac{5}{12}$', '$-\\frac{12}{13}$'],
    correctIndex: 2,
    markScheme: {
      solution:
        "**Step 1: right-angled triangle for the reference angle.** $\\sin = \\frac{\\text{opp}}{\\text{hyp}} = \\frac{5}{13}$, so take opposite $= 5$ and hypotenuse $= 13$. By Pythagoras the adjacent side is\n\n" +
        "$$\\sqrt{13^2 - 5^2} = \\sqrt{169 - 25} = \\sqrt{144} = 12$$\n\n" +
        "So for the reference angle, $\\tan = \\frac{\\text{opp}}{\\text{adj}} = \\frac{5}{12}$.\n\n" +
        "**Step 2: the sign.** $\\theta$ is obtuse, so it is in the second quadrant, where only $\\sin$ is positive. So $\\tan\\theta$ is negative.\n\n" +
        "$$\\tan\\theta = -\\frac{5}{12}$$\n\n" +
        "(Check: $\\cos\\theta = -\\frac{12}{13}$ and $\\frac{\\sin\\theta}{\\cos\\theta} = \\frac{5}{13} \\div \\left(-\\frac{12}{13}\\right) = -\\frac{5}{12}$.)",
      whyWrong: [
        "This is the right size but ignores the quadrant. An obtuse angle is in the second quadrant, where $\\tan$ is negative.",
        "This is adjacent over opposite, $\\frac{\\cos\\theta}{\\sin\\theta}$, upside down. Tangent is opposite over adjacent.",
        null,
        "$-\\frac{12}{13}$ is $\\cos\\theta$. It is a correct step on the way, but the question asks for $\\tan\\theta$.",
      ],
      keyIdea: "Build a right-angled triangle from the given ratio (Pythagoras for the missing side), then fix the sign from the quadrant.",
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
      solution:
        "Use the unit circle: the point at angle $\\theta$ is $(\\cos\\theta, \\sin\\theta)$.\n\n" +
        "- At $90^\\circ$ the point is $(0, 1)$, so $\\sin 90^\\circ = 1$.\n" +
        "- At $180^\\circ$ the point is $(-1, 0)$, so $\\cos 180^\\circ = -1$.\n" +
        "- $\\tan 45^\\circ = 1$ (in the $45^\\circ$ right-angled triangle the opposite and adjacent sides are equal).\n\n" +
        "Add them:\n\n" +
        "$$1 + (-1) + 1 = 1$$",
      whyWrong: [
        "This takes $\\cos 180^\\circ = 1$. At $180^\\circ$ the unit-circle point is $(-1, 0)$, so $\\cos 180^\\circ = -1$.",
        null,
        "This takes $\\cos 180^\\circ = 0$, confusing it with $\\sin 180^\\circ = 0$.",
        "This takes $\\sin 90^\\circ = 0$, confusing it with $\\cos 90^\\circ = 0$.",
      ],
      keyIdea: "For $0^\\circ$, $90^\\circ$, $180^\\circ$, $270^\\circ$, read $\\cos$ and $\\sin$ straight off the unit-circle point $(\\cos\\theta, \\sin\\theta)$.",
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
      solution:
        "**Step 1: the period of plain $\\tan x$.** Unlike $\\sin x$ and $\\cos x$ (which repeat every $2\\pi$), the graph of $y = \\tan x$ repeats every $\\pi$ (that is, $180^\\circ$). It has vertical asymptotes at $x = \\frac{\\pi}{2}, \\frac{3\\pi}{2}, \\ldots$ and the same shape between each pair of asymptotes.\n\n" +
        "**Step 2: the effect of the $4$.** Multiplying $x$ by $b$ squashes the graph horizontally by a factor of $b$, so the period is divided by $b$:\n\n" +
        "$$\\text{period of } \\tan(bx) = \\frac{\\pi}{b} = \\frac{\\pi}{4}$$\n\n" +
        "**Step 3: the $2$ in front.** This stretches the graph vertically, but it does not change where the graph repeats. ($\\tan$ has no maximum or minimum, so there is no amplitude to find.)\n\n" +
        "So the period is $\\frac{\\pi}{4}$.",
      whyWrong: [
        "This uses the formula for sine and cosine, $\\frac{2\\pi}{b} = \\frac{2\\pi}{4}$. But $\\tan x$ repeats every $\\pi$, not $2\\pi$, so the period of $\\tan(bx)$ is $\\frac{\\pi}{b}$.",
        "This multiplies the period of $\\tan x$ by $4$ instead of dividing. A bigger number in front of $x$ squashes the graph, so the period gets **shorter**.",
        null,
        "This is the period of plain $\\tan x$. It ignores the $4$ inside the bracket.",
      ],
      keyIdea: "$\\tan x$ has period $\\pi$, so $\\tan(bx)$ has period $\\frac{\\pi}{b}$; a number in front of $\\tan$ does not change the period.",
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
];
