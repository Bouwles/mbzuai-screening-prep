import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'descriptive-stats',
  know:
    '### What "descriptive statistics" means\n\n' +
    'A list of numbers is hard to take in. Descriptive statistics squeeze it into a few useful numbers: an **average** (where the middle of the data is) and a **measure of spread** (how far apart the values are). Almost every exam question here is one of these, done carefully.\n\n' +
    '### The three averages\n\n' +
    '- **Mean**: add everything up and divide by how many values there are. For 3, 8, 4, 15, 5, 7 the total is $42$ and there are $6$ values, so $\\bar{x} = \\frac{42}{6} = 7$.\n' +
    '- **Median**: the middle value **once the data are in order**. With $n$ values it sits in position $\\frac{n + 1}{2}$. If $n$ is even, that position is a "half" (like $3.5$), so take the mean of the two middle values.\n' +
    '- **Mode**: the value that appears most often. There can be more than one mode, or none if no value repeats.\n\n' +
    '### Which average should you use?\n\n' +
    '| Average | Good for | Weakness |\n|---|---|---|\n| Mean | data without extreme values; uses every value | pulled towards outliers |\n| Median | skewed data or data with outliers (salaries, house prices) | ignores the size of the extreme values |\n| Mode | categories (favourite colour, shoe size) | may not exist or may not be central |\n\n' +
    'One very large salary drags the mean up but barely moves the median, which is why "typical income" is usually reported as a median.\n\n' +
    '### Means are really totals in disguise\n\n' +
    'The single most useful trick in this topic: **total = mean $\\times$ number of values**. Use it whenever a value is missing, added or removed.\n\n' +
    '- *Missing value*: the mean of 5 numbers is 12, so their total is $60$. If four of them add to $47$, the fifth is $60 - 47 = 13$.\n' +
    '- *Adding a value*: 8 scores with mean 70 have total $560$. Add a score of 88: $\\frac{648}{9} = 72$.\n' +
    '- *Removing a value*: subtract it from the total and divide by the **new, smaller** count.\n' +
    '- *Combining groups*: add the two totals and divide by the total number of people. Never just average the two means unless the groups are the same size.\n\n' +
    'Adding a value **above** the mean raises the mean; adding one **below** lowers it; adding a value equal to the mean leaves it unchanged.\n\n' +
    '### Mean and median from a frequency table\n\n' +
    'A frequency table is a short way to write repeated values: "value $x$ appears $f$ times". Add a column $fx$ (value $\\times$ frequency). Then\n\n' +
    '$$\\bar{x} = \\frac{\\sum fx}{\\sum f}$$\n\n' +
    'where $\\sum f$ is the total number of items, **not** the number of rows. For the median, find the position $\\frac{n + 1}{2}$ and keep a running total of the frequencies until you reach it.\n\n' +
    '### Spread: range, quartiles and IQR\n\n' +
    '- **Range** $=$ largest $-$ smallest. Quick, but one outlier can make it huge.\n' +
    '- **Quartiles** split the ordered data into four equal parts. $Q_1$ (lower quartile) has a quarter of the data below it, the median $Q_2$ has half, $Q_3$ (upper quartile) has three quarters.\n' +
    '- A simple method: sort the data, find the median, then $Q_1$ is the median of the lower half and $Q_3$ the median of the upper half. With an odd number of values, leave the median itself out of both halves.\n' +
    '- **Interquartile range** $\\text{IQR} = Q_3 - Q_1$: the spread of the middle 50% of the data. Because it ignores the top and bottom quarters, it is hardly affected by outliers (unlike the range).\n' +
    '- Books, calculators and software do not all use the same quartile rule, so they can give slightly different quartiles for the same data. A well-written question tells you which method to use; this site always uses the halves method above.\n\n' +
    '### Outliers: the 1.5 $\\times$ IQR rule\n\n' +
    'A value is an outlier if it is below $Q_1 - 1.5 \\times \\text{IQR}$ or above $Q_3 + 1.5 \\times \\text{IQR}$. These two numbers are called the **fences**. Measure from the quartiles, never from the median.\n\n' +
    '### Box plots\n\n' +
    'A box plot draws the **five-number summary**: minimum, $Q_1$, median, $Q_3$, maximum. The box runs from $Q_1$ to $Q_3$ (its length is the IQR), the line inside is the median and the whiskers reach the smallest and largest values (outliers are sometimes shown as separate dots). Each of the four sections holds about **25%** of the data, whatever its length: a long section means those values are spread out, not that there are more of them.\n\n' +
    '### Changing every value\n\n' +
    'If every value is multiplied by $a$ and then $b$ is added, the mean, median and mode do the same thing ($a \\times \\text{old} + b$). The range and IQR are differences, so adding $b$ does not change them; they are only multiplied by $a$ (if $a$ is negative, use its size).',
  formulas: [
    { label: 'Mean', tex: '\\bar{x} = \\frac{\\sum x}{n}', note: 'Sum of the values divided by the number of values.' },
    { label: 'Total from a mean', tex: '\\sum x = n \\times \\bar{x}', note: 'Use this for missing, added or removed values and for combining groups.' },
    { label: 'Mean from a frequency table', tex: '\\bar{x} = \\frac{\\sum fx}{\\sum f}', note: 'Divide by the total frequency, not by the number of rows.' },
    { label: 'Combined mean of two groups', tex: '\\bar{x} = \\frac{n_1 \\bar{x}_1 + n_2 \\bar{x}_2}{n_1 + n_2}' },
    { label: 'Position of the median', tex: '\\text{median position} = \\frac{n + 1}{2}', note: 'In the ORDERED data. A half position means average the two middle values.' },
    { label: 'Range', tex: '\\text{range} = \\text{largest value} - \\text{smallest value}' },
    { label: 'Interquartile range', tex: '\\text{IQR} = Q_3 - Q_1', note: '$Q_1$ and $Q_3$ are the medians of the lower and upper halves of the ordered data.' },
    { label: 'Outlier fences', tex: 'x < Q_1 - 1.5 \\times \\text{IQR} \\quad \\text{or} \\quad x > Q_3 + 1.5 \\times \\text{IQR}' },
    { label: 'Linear change of every value', tex: 'y = ax + b \\;\\Rightarrow\\; \\bar{y} = a\\bar{x} + b, \\quad \\text{IQR}_y = |a| \\times \\text{IQR}_x', note: 'Averages shift and scale; spreads only scale.' },
  ],
  examples: [
    {
      title: 'Mean, median, mode and range',
      problem: 'Find the mean, median, mode and range of: 6, 2, 9, 4, 9, 3, 2, 9.',
      steps: [
        'Order the data: 2, 2, 3, 4, 6, 9, 9, 9. There are $n = 8$ values.',
        'Mean: total $= 2 + 2 + 3 + 4 + 6 + 9 + 9 + 9 = 44$, so $\\bar{x} = \\frac{44}{8} = 5.5$.',
        'Median: position $\\frac{8 + 1}{2} = 4.5$, so average the 4th and 5th values: $\\frac{4 + 6}{2} = 5$.',
        'Mode: $9$ appears three times, more than any other value, so the mode is $9$.',
        'Range: $9 - 2 = 7$.',
      ],
      answer: 'Mean $5.5$, median $5$, mode $9$, range $7$.',
    },
    {
      title: 'A missing value from the mean',
      problem: 'The mean of six numbers is $11$. Five of them are $7$, $14$, $9$, $12$ and $10$. Find the sixth number.',
      steps: [
        'Total of all six numbers $= 11 \\times 6 = 66$.',
        'Total of the five known numbers $= 7 + 14 + 9 + 12 + 10 = 52$.',
        'Sixth number $= 66 - 52 = 14$.',
        'Check: $\\frac{52 + 14}{6} = \\frac{66}{6} = 11$.',
      ],
      answer: 'The sixth number is $14$.',
    },
    {
      title: 'Mean and median from a frequency table',
      problem: 'In a survey of 20 households, 3 have no car, 9 have one car, 6 have two cars and 2 have three cars. Find the mean and the median number of cars.',
      steps: [
        'Values $x = 0, 1, 2, 3$ with frequencies $f = 3, 9, 6, 2$. Check $\\sum f = 20$.',
        '$\\sum fx = 0 \\times 3 + 1 \\times 9 + 2 \\times 6 + 3 \\times 2 = 0 + 9 + 12 + 6 = 27$.',
        'Mean $= \\frac{27}{20} = 1.35$ cars.',
        'Median position $= \\frac{20 + 1}{2} = 10.5$, so average the 10th and 11th values.',
        'Running totals: 0 cars covers positions 1 to 3; 1 car covers positions 4 to 12. Both the 10th and 11th values are $1$.',
        'Median $= 1$ car.',
      ],
      answer: 'Mean $= 1.35$, median $= 1$.',
    },
    {
      title: 'Quartiles, IQR and outliers',
      problem: 'For the data 15, 4, 18, 22, 17, 40, 19, 16, 21, 20, 14, find the IQR and decide whether any value is an outlier.',
      steps: [
        'Order the 11 values: 4, 14, 15, 16, 17, 18, 19, 20, 21, 22, 40.',
        'Median: the 6th value, $18$.',
        'Lower half 4, 14, 15, 16, 17 gives $Q_1 = 15$. Upper half 19, 20, 21, 22, 40 gives $Q_3 = 21$.',
        '$\\text{IQR} = 21 - 15 = 6$, so $1.5 \\times \\text{IQR} = 9$.',
        'Lower fence: $15 - 9 = 6$. Upper fence: $21 + 9 = 30$.',
        '$4 < 6$, so $4$ is an outlier. $40 > 30$, so $40$ is an outlier. Every other value lies between the fences.',
      ],
      answer: '$\\text{IQR} = 6$; the outliers are $4$ and $40$.',
    },
  ],
  traps: [
    'Finding the median without sorting the data first. Always put the values in order before looking for the middle.',
    'Giving the **position** of the median, $\\frac{n + 1}{2}$, as the answer instead of the value found at that position.',
    'In a frequency table, dividing $\\sum fx$ by the number of rows, or averaging the frequency column. Divide by $\\sum f$, the total number of items.',
    'Averaging two group means when the groups are different sizes. Convert each mean to a total first, add the totals, then divide by the total number of people.',
    'Building outlier fences from the median, or forgetting the $1.5$. The fences are $Q_1 - 1.5 \\times \\text{IQR}$ and $Q_3 + 1.5 \\times \\text{IQR}$.',
    'Thinking a longer section of a box plot contains more data. Each section holds about a quarter of the data; length shows spread, not quantity.',
  ],
  examTip:
    'These questions are quick marks if you work with **totals**. When a mean changes because a value is added, removed or missing, write total $=$ mean $\\times$ count for each stage and subtract. With about a minute per question, use these checks to cut options:\n\n' +
    '- **Direction check**: adding a value above the mean must raise it; removing one above the mean must lower it. Any option moving the wrong way is out.\n' +
    '- **Plug back in**: for a missing value, put each option back and see which gives the stated mean. Your calculator does this in seconds.\n' +
    '- **Spot the trap options**: the distractors are usually the median instead of the mean, the range instead of the IQR, the median position instead of its value, or a total divided by the wrong count. If your answer matches one of these "nearly right" numbers, re-read what is asked.\n' +
    '- **Frequency tables**: the mean must lie between the smallest and largest values in the table, and it is pulled towards the rows with big frequencies.\n' +
    '- **Box plots**: read the five numbers first and remember each section is 25% of the data.',
};
