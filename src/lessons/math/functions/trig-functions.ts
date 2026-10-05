import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'trig-functions',
  know:
    "### 1. Right-angled triangles: SOH CAH TOA\n\n" +
    "In a right-angled triangle, pick one of the two acute angles and call it $\\theta$. Then name the sides **from that angle's point of view**:\n\n" +
    "- **hypotenuse**: the longest side, opposite the right angle\n" +
    "- **opposite**: the side facing $\\theta$\n" +
    "- **adjacent**: the side next to $\\theta$ that is not the hypotenuse\n\n" +
    "Then $\\sin\\theta = \\frac{\\text{opp}}{\\text{hyp}}$, $\\cos\\theta = \\frac{\\text{adj}}{\\text{hyp}}$ and $\\tan\\theta = \\frac{\\text{opp}}{\\text{adj}}$ (SOH CAH TOA). To use them, look at which two sides the question involves (the one you know and the one you want) and choose the ratio containing exactly those two.\n\n" +
    "### 2. Degrees and radians\n\n" +
    "Radians are another unit for angles, and the one used in calculus and in most university maths. The key fact is $180^\\circ = \\pi$ radians (a half turn), so a full turn is $2\\pi$.\n\n" +
    "- degrees to radians: multiply by $\\frac{\\pi}{180}$, e.g. $60^\\circ = \\frac{\\pi}{3}$\n" +
    "- radians to degrees: multiply by $\\frac{180}{\\pi}$, or simply replace $\\pi$ by $180^\\circ$, e.g. $\\frac{5\\pi}{6} = \\frac{5 \\times 180^\\circ}{6} = 150^\\circ$\n\n" +
    "Always check your calculator is in the right mode (DEG or RAD) before pressing sin, cos or tan.\n\n" +
    "### 3. Arc length and sector area\n\n" +
    "A sector is a pizza slice of a circle with radius $r$ and angle $\\theta$ at the centre. **With $\\theta$ in radians**, the arc length is $s = r\\theta$ and the area is $A = \\frac{1}{2}r^2\\theta$. In degrees, use the fraction of the circle instead: arc $= \\frac{\\theta}{360} \\times 2\\pi r$ and area $= \\frac{\\theta}{360} \\times \\pi r^2$. The perimeter of a sector is $2r + s$ (two straight edges plus the curve).\n\n" +
    "### 4. The unit circle and exact values\n\n" +
    "Draw a circle of radius $1$ centred at the origin. Turn anticlockwise from the positive $x$-axis by $\\theta$. The point you land on is $(\\cos\\theta, \\sin\\theta)$, and $\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$. This definition works for **any** angle, not just acute ones. The values you must know by heart come from two triangles: half an equilateral triangle (sides $1$, $\\sqrt{3}$, $2$) and the isosceles right triangle (sides $1$, $1$, $\\sqrt{2}$).\n\n" +
    "| $\\theta$ | $0^\\circ$ | $30^\\circ$ | $45^\\circ$ | $60^\\circ$ | $90^\\circ$ |\n" +
    "| --- | --- | --- | --- | --- | --- |\n" +
    "| radians | $0$ | $\\frac{\\pi}{6}$ | $\\frac{\\pi}{4}$ | $\\frac{\\pi}{3}$ | $\\frac{\\pi}{2}$ |\n" +
    "| $\\sin\\theta$ | $0$ | $\\frac{1}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{\\sqrt{3}}{2}$ | $1$ |\n" +
    "| $\\cos\\theta$ | $1$ | $\\frac{\\sqrt{3}}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{1}{2}$ | $0$ |\n" +
    "| $\\tan\\theta$ | $0$ | $\\frac{\\sqrt{3}}{3}$ | $1$ | $\\sqrt{3}$ | not defined |\n\n" +
    "Memory trick: $\\sin$ goes $\\frac{\\sqrt{0}}{2}, \\frac{\\sqrt{1}}{2}, \\frac{\\sqrt{2}}{2}, \\frac{\\sqrt{3}}{2}, \\frac{\\sqrt{4}}{2}$, and $\\cos$ is the same list backwards.\n\n" +
    "### 5. Signs in the four quadrants (CAST)\n\n" +
    "Because $\\cos\\theta$ is the $x$-coordinate and $\\sin\\theta$ the $y$-coordinate, the signs depend on the quadrant. Going anticlockwise from the first quadrant: **A**ll positive ($0^\\circ$ to $90^\\circ$), only **S**in ($90^\\circ$ to $180^\\circ$), only **T**an ($180^\\circ$ to $270^\\circ$), only **C**os ($270^\\circ$ to $360^\\circ$). To find, say, $\\sin 210^\\circ$: the quadrant is the third, so $\\sin$ is negative; the **reference angle** (the angle to the nearest $x$-axis) is $210^\\circ - 180^\\circ = 30^\\circ$; so $\\sin 210^\\circ = -\\frac{1}{2}$.\n\n" +
    "### 6. Graphs, amplitude and period\n\n" +
    "$y = \\sin x$ and $y = \\cos x$ are waves between $-1$ and $1$ that repeat every $360^\\circ$ ($2\\pi$). $\\sin x$ starts at $0$ and rises; $\\cos x$ starts at its maximum $1$. $y = \\tan x$ repeats every $180^\\circ$ ($\\pi$), has no maximum or minimum, and has vertical asymptotes at $90^\\circ$, $270^\\circ$, and so on. For $y = a\\sin(bx) + d$ (same for $\\cos$): amplitude $= |a|$, period $= \\frac{2\\pi}{b}$ (or $\\frac{360^\\circ}{b}$), and $d$ moves the middle line up, so the range is $d - |a| \\le y \\le d + |a|$.\n\n" +
    "### 7. Non-right-angled triangles: sine and cosine rules\n\n" +
    "Label the triangle so side $a$ is opposite angle $A$, and so on. Use the **sine rule** $\\frac{a}{\\sin A} = \\frac{b}{\\sin B}$ when you know a side and its opposite angle. Use the **cosine rule** $a^2 = b^2 + c^2 - 2bc\\cos A$ when you know two sides and the angle between them, or all three sides. If the sine rule gives you an angle, remember $180^\\circ$ minus that angle has the same sine: sometimes two triangles are possible.",
  formulas: [
    { label: 'SOH CAH TOA', tex: '\\sin\\theta = \\frac{\\text{opp}}{\\text{hyp}}, \\quad \\cos\\theta = \\frac{\\text{adj}}{\\text{hyp}}, \\quad \\tan\\theta = \\frac{\\text{opp}}{\\text{adj}}' },
    { label: 'Degrees and radians', tex: '180^\\circ = \\pi \\text{ rad}, \\quad \\text{rad} = \\text{deg} \\times \\frac{\\pi}{180}', note: 'To go back to degrees, replace $\\pi$ by $180^\\circ$.' },
    { label: 'Arc length', tex: 's = r\\theta', note: '$\\theta$ in radians.' },
    { label: 'Sector area', tex: 'A = \\frac{1}{2}r^2\\theta', note: '$\\theta$ in radians. Sector perimeter $= 2r + r\\theta$.' },
    { label: 'Unit circle', tex: '(x, y) = (\\cos\\theta, \\sin\\theta), \\quad \\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}' },
    { label: 'Exact values (30, 45, 60 degrees)', tex: '\\sin 30^\\circ = \\frac{1}{2}, \\; \\sin 45^\\circ = \\frac{\\sqrt{2}}{2}, \\; \\sin 60^\\circ = \\frac{\\sqrt{3}}{2}, \\; \\tan 30^\\circ = \\frac{\\sqrt{3}}{3}, \\; \\tan 45^\\circ = 1, \\; \\tan 60^\\circ = \\sqrt{3}', note: '$\\cos 30^\\circ = \\sin 60^\\circ$ and $\\cos 60^\\circ = \\sin 30^\\circ$.' },
    { label: 'Related angles', tex: '\\sin(180^\\circ - \\theta) = \\sin\\theta, \\quad \\cos(180^\\circ - \\theta) = -\\cos\\theta, \\quad \\cos(-\\theta) = \\cos\\theta', note: 'In general use CAST for the sign and the reference angle for the size.' },
    { label: 'Amplitude, period and range', tex: 'y = a\\sin(bx) + d: \\quad \\text{amplitude} = |a|, \\quad \\text{period} = \\frac{2\\pi}{b}, \\quad d - |a| \\le y \\le d + |a|', note: 'Period of $\\tan(bx)$ is $\\frac{\\pi}{b}$.' },
    { label: 'Sine rule', tex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}' },
    { label: 'Cosine rule', tex: 'a^2 = b^2 + c^2 - 2bc\\cos A, \\qquad \\cos A = \\frac{b^2 + c^2 - a^2}{2bc}' },
    { label: 'Area of a triangle', tex: '\\text{Area} = \\frac{1}{2}ab\\sin C', note: 'Two sides and the angle between them.' },
  ],
  examples: [
    {
      title: 'Exact value in another quadrant',
      problem: "Find the exact value of $\\sin\\left(\\frac{5\\pi}{4}\\right)$.",
      steps: [
        "Convert to degrees by replacing $\\pi$ with $180^\\circ$: $\\frac{5 \\times 180^\\circ}{4} = 225^\\circ$.",
        "$225^\\circ$ is between $180^\\circ$ and $270^\\circ$: the third quadrant, where only $\\tan$ is positive. So $\\sin$ is negative.",
        "Reference angle: $225^\\circ - 180^\\circ = 45^\\circ$.",
        "Exact value: $\\sin 45^\\circ = \\frac{\\sqrt{2}}{2}$.",
        "Combine the sign and the size: $\\sin\\left(\\frac{5\\pi}{4}\\right) = -\\frac{\\sqrt{2}}{2}$.",
      ],
      answer: "$-\\frac{\\sqrt{2}}{2}$",
    },
    {
      title: 'Arc length and sector area',
      problem: "A sector has radius $10$ cm and angle $72^\\circ$. Find its arc length and its area, in terms of $\\pi$.",
      steps: [
        "Convert the angle to radians: $72 \\times \\frac{\\pi}{180} = \\frac{2\\pi}{5}$.",
        "Arc length: $s = r\\theta = 10 \\times \\frac{2\\pi}{5} = 4\\pi$ cm.",
        "Area: $A = \\frac{1}{2}r^2\\theta = \\frac{1}{2} \\times 100 \\times \\frac{2\\pi}{5} = 20\\pi \\text{ cm}^2$.",
        "Check with fractions: $72^\\circ$ is $\\frac{1}{5}$ of a turn. $\\frac{1}{5}$ of the circumference $20\\pi$ is $4\\pi$, and $\\frac{1}{5}$ of the area $100\\pi$ is $20\\pi$.",
      ],
      answer: "Arc $4\\pi$ cm, area $20\\pi \\text{ cm}^2$",
    },
    {
      title: 'Reading amplitude and period',
      problem: "A function $y = a\\cos(bx) + d$ (with $x$ in degrees, $a > 0$, $b > 0$) has maximum $7$, minimum $1$ and period $120^\\circ$. Find $a$, $b$ and $d$.",
      steps: [
        "Amplitude: $a = \\frac{\\max - \\min}{2} = \\frac{7 - 1}{2} = 3$.",
        "Middle line: $d = \\frac{\\max + \\min}{2} = \\frac{7 + 1}{2} = 4$.",
        "Period: $\\frac{360^\\circ}{b} = 120^\\circ$, so $b = \\frac{360}{120} = 3$.",
        "Check: $y = 3\\cos(3x) + 4$ goes from $4 - 3 = 1$ up to $4 + 3 = 7$.",
      ],
      answer: "$a = 3$, $b = 3$, $d = 4$",
    },
    {
      title: 'Cosine rule with an obtuse angle, then the sine rule',
      problem: "In triangle $ABC$, $b = 5$, $c = 3$ and angle $A = 120^\\circ$. Find $a$, then find $\\sin B$.",
      steps: [
        "Two sides and the included angle: cosine rule $a^2 = b^2 + c^2 - 2bc\\cos A$.",
        "$\\cos 120^\\circ = -\\frac{1}{2}$ (second quadrant, so negative; reference angle $60^\\circ$).",
        "$a^2 = 25 + 9 - 2 \\times 5 \\times 3 \\times \\left(-\\frac{1}{2}\\right) = 34 + 15 = 49$, so $a = 7$.",
        "Now the sine rule: $\\frac{\\sin B}{b} = \\frac{\\sin A}{a}$, so $\\sin B = \\frac{5 \\sin 120^\\circ}{7}$.",
        "$\\sin 120^\\circ = \\sin 60^\\circ = \\frac{\\sqrt{3}}{2}$, so $\\sin B = \\frac{5}{7} \\times \\frac{\\sqrt{3}}{2} = \\frac{5\\sqrt{3}}{14}$.",
      ],
      answer: "$a = 7$ and $\\sin B = \\frac{5\\sqrt{3}}{14}$",
    },
  ],
  traps: [
    "**Calculator in the wrong mode.** $\\sin 30$ in RAD mode gives about $-0.988$, not $0.5$. If the question uses $\\pi$, you need radians; if it uses the degree sign, you need degrees.",
    "**Using degrees in $s = r\\theta$ or $A = \\frac{1}{2}r^2\\theta$.** These formulas only work in radians. Putting $120$ in instead of $\\frac{2\\pi}{3}$ gives an answer hundreds of times too big.",
    "**Forgetting the sign in other quadrants.** $\\cos 120^\\circ = -\\frac{1}{2}$, not $\\frac{1}{2}$. In the cosine rule this flips a subtraction into an addition, so for an obtuse angle the third side comes out longer than Pythagoras would give.",
    "**Getting the period upside down.** $y = \\sin(2x)$ has period $\\frac{2\\pi}{2} = \\pi$ (shorter), not $4\\pi$; $y = \\sin\\left(\\frac{x}{2}\\right)$ has period $4\\pi$ (longer).",
    "**Amplitude is half the height.** If a wave goes from $-1$ to $5$, the amplitude is $3$, not $6$, and the middle line is $y = 2$.",
    "**Missing the second triangle.** When the sine rule gives $\\sin B = 0.8$, the calculator says $53.1^\\circ$, but $126.9^\\circ$ has the same sine and may also fit.",
  ],
  examTip:
    "These questions are usually one or two steps, so speed comes from knowing the exact-value table and CAST cold.\n\n" +
    "- **Sign check first:** decide the quadrant before calculating anything. This often eliminates two options straight away (for example, all the positive ones).\n" +
    "- **Calculator check:** type the expression in (right mode!) and compare with the decimal value of each option, e.g. $\\frac{\\sqrt{3}}{3} \\approx 0.577$ and $\\frac{\\sqrt{3}}{2} \\approx 0.866$.\n" +
    "- **Size check:** in a right-angled triangle no side beats the hypotenuse; in any triangle the biggest angle faces the biggest side; a negative cosine means an obtuse angle.\n" +
    "- **Graph questions:** read the max and min (amplitude and middle line) and the distance between two peaks (period), then test each option at $x = 0$.\n" +
    "- **Sector questions:** sanity check with the fraction of the circle, e.g. $90^\\circ$ gives a quarter of the circumference or area.",
};
