import type { StaticQuestion } from '../../../types';
import { Frac } from '../../../lib/frac';

export const questions: StaticQuestion[] = [
  // ---------------------------------------------------------------- foundation
  {
    id: 'percentages-ratio-001',
    subtopic: 'percentages-ratio',
    difficulty: 'foundation',
    stem: 'What is 35% of AED 240?',
    options: ['AED 156', 'AED 8.40', 'AED 84', 'AED 840'],
    correctIndex: 2,
    markScheme: {
      asking: 'How much money is 35 parts out of every 100 parts of AED 240?',
      solution:
        '**Per cent** means out of 100. So 35% is the fraction $\\frac{35}{100}$, which as a decimal is $0.35$.\n\n' +
        'In maths, "of" means multiply. So we need $0.35 \\times 240$.\n\n' +
        'Split it to make it easy: $0.3 \\times 240 = 72$ and $0.05 \\times 240 = 12$. Add them: $72 + 12 = 84$.',
      conclusion: '35% of 240 is 84, so the answer is AED 84.',
      whyWrong: [
        'This is $240 - 84 = 156$, the amount left after taking 35% off (65% of AED 240), not 35% of it.',
        'This uses $0.035$ instead of $0.35$: that is 3.5% of the amount, a decimal-place slip when converting the percentage.',
        null,
        'This multiplies by $3.5$ instead of $0.35$. 35% of an amount must be smaller than the amount itself.',
      ],
      keyIdea: 'To find a percentage of an amount, turn the percentage into a decimal by dividing by 100, then multiply. Test by size: a percentage under 100 must give less than the amount.',
    },
    check: {
      optionValues: [156, 8.4, 84, 840],
      compute: () => (240 * 35) / 100,
    },
  },
  {
    id: 'percentages-ratio-002',
    subtopic: 'percentages-ratio',
    difficulty: 'foundation',
    stem: 'A price is **decreased** by 15%. Which single number can you multiply the original price by to get the new price?',
    options: ['$1.15$', '$0.85$', '$0.15$', '$0.985$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What single number turns an old price into the price after a 15% cut?',
      solution:
        'The original price counts as 100%. A 15% decrease takes 15% away, so $100\\% - 15\\% = 85\\%$ of the price is left.\n\n' +
        'To use 85% in a calculation, divide by 100: $85 \\div 100 = 0.85$. Multiplying by this number gives the new price.',
      conclusion: 'Multiplying by this number leaves 85% of the original, so the answer is $0.85$.',
      whyWrong: [
        'This is the multiplier for a 15% **increase** ($100\\% + 15\\% = 115\\%$), not a decrease.',
        null,
        'Multiplying by $0.15$ gives the size of the **decrease** (the 15% that is removed), not the new price.',
        'This writes 15% as $0.015$ instead of $0.15$, and then works out $1 - 0.015$. That would be a 1.5% decrease.',
      ],
      keyIdea: 'The multiplier for a change is the new percentage divided by 100. A decrease of $r$% gives $1 - \\frac{r}{100}$, and an increase of $r$% gives $1 + \\frac{r}{100}$.',
    },
    check: {
      optionValues: [1.15, 0.85, 0.15, 0.985],
      compute: () => 1 - 15 / 100,
    },
  },
  {
    id: 'percentages-ratio-005',
    subtopic: 'percentages-ratio',
    difficulty: 'foundation',
    stem: 'A value rises from 80 to 92. What is the percentage increase?',
    options: ['12%', '15%', '13.0% (to 3 s.f.)', '115%'],
    correctIndex: 1,
    markScheme: {
      asking: 'How big is the rise from 80 to 92, as a percentage of the starting value?',
      solution:
        'Percentage change measures the change against the **starting** value: percentage increase $= \\frac{\\text{increase}}{\\text{original}} \\times 100$.\n\n' +
        'Find the increase: $92 - 80 = 12$. The original value is 80.\n\n' +
        'Divide and turn the result into a percentage: $\\frac{12}{80} = 0.15$, and $0.15 \\times 100 = 15$.',
      conclusion: 'A rise of 12 on a start of 80 is 15 out of every 100, so the answer is 15%.',
      whyWrong: [
        'This is the actual increase (12), not the **percentage** increase. You still need to divide by the original 80.',
        null,
        'This divides the change by the **new** value: $\\frac{12}{92} \\times 100 \\approx 13.0\\%$. Percentage change is always measured against the original value.',
        'This is $\\frac{92}{80} \\times 100$: the new value as a percentage of the old one. The increase is $115\\% - 100\\% = 15\\%$.',
      ],
      keyIdea: 'Percentage change $= \\frac{\\text{change}}{\\text{original}} \\times 100$. Find the change by subtracting, and always divide by the starting value, not the new one.',
    },
    check: {
      optionValues: [12, 15, 1200 / 92, 115],
      compute: () => ((92 - 80) / 80) * 100,
    },
  },
  {
    id: 'percentages-ratio-021',
    subtopic: 'percentages-ratio',
    difficulty: 'foundation',
    stem: 'What does "per cent" mean?',
    options: ['Out of 100', 'Out of 10', 'Out of 1000', 'For each unit'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does the phrase "per cent" tell you?',
      solution:
        '"Cent" comes from the word for 100, as in "century" (100 years). So "per cent" means out of 100.\n\n' +
        'For example, 35% means 35 out of every 100, which is $\\frac{35}{100}$.',
      conclusion: 'A percentage always compares with 100, so the answer is Out of 100.',
      whyWrong: [
        null,
        'Out of 10 would make 35% equal to 3.5, a decimal-place slip.',
        'Out of 1000 would make 35% equal to 0.035, a decimal-place slip.',
        'This describes a unit rate, such as a price per gram, not a percentage.',
      ],
      keyIdea: 'Turn any percentage into a fraction by putting it over 100, then into a decimal by dividing by 100. So $35\\%$ is $\\frac{35}{100}$, which is $0.35$.',
    },
  },
  {
    id: 'percentages-ratio-022',
    subtopic: 'percentages-ratio',
    difficulty: 'foundation',
    stem: 'What is the multiplier for an increase of 8%?',
    options: ['$1.08$', '$0.08$', '$1.8$', '$0.92$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What single number turns an old value into the value after an 8% rise?',
      solution:
        'The original counts as 100%. An 8% increase adds 8%, so the new value is $100\\% + 8\\% = 108\\%$ of the original.\n\n' +
        'To turn a percentage into a multiplier, divide by 100: $108 \\div 100 = 1.08$.',
      conclusion: 'Multiplying by this number gives 108% of the original, so the answer is $1.08$.',
      whyWrong: [
        null,
        'Multiplying by $0.08$ gives only the size of the increase, not the new value.',
        'This is the multiplier for an **80%** increase: 8% is $0.08$, not $0.8$.',
        'This is the multiplier for an 8% **decrease**, $1 - 0.08$.',
      ],
      keyIdea: 'For an increase, add the percentage to 100 and divide by 100. For a decrease, subtract it from 100 and divide by 100. So a 3% rise is 1.03 and a 3% fall is 0.97.',
    },
    check: {
      optionValues: [1.08, 0.08, 1.8, 0.92],
      compute: () => 1 + 8 / 100,
    },
  },
  {
    id: 'percentages-ratio-023',
    subtopic: 'percentages-ratio',
    difficulty: 'foundation',
    stem: 'Simplify the ratio $12 : 18$.',
    options: ['$2 : 3$', '$6 : 9$', '$3 : 2$', '$1 : 6$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is $12 : 18$ written with the smallest possible whole numbers?',
      solution:
        'A **ratio** compares amounts. You can divide both numbers by the same thing without changing the comparison, just as with a fraction.\n\n' +
        'Find the largest number that divides both 12 and 18. That is 6, since $12 = 6 \\times 2$ and $18 = 6 \\times 3$.\n\n' +
        'Divide both by 6: $12 \\div 6 = 2$ and $18 \\div 6 = 3$. This gives $2 : 3$.',
      conclusion: '2 and 3 share no factor except 1, so we cannot go further. The answer is $2 : 3$.',
      whyWrong: [
        null,
        'This divides by 2 only. 6 and 9 still share the factor 3, so the ratio is not in its simplest form.',
        'This reverses the order. The first number in the ratio must stay first.',
        'This uses the difference, $18 - 12 = 6$. Simplifying divides both numbers by the same factor.',
      ],
      keyIdea: 'To simplify a ratio, divide every number by the largest number that divides them all. Keep the numbers in the same order as the question.',
    },
    check: {
      optionValues: ['2:3', '6:9', '3:2', '1:6'],
      compute: () => {
        const f = new Frac(12, 18);
        return `${f.n}:${f.d}`;
      },
    },
  },
  {
    id: 'percentages-ratio-024',
    subtopic: 'percentages-ratio',
    difficulty: 'foundation',
    stem: 'If $y$ is inversely proportional to $x$, then for some constant $k$:',
    options: ['$y = \\frac{k}{x}$', '$y = kx$', '$y = x + k$', '$y = kx^{2}$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which equation shows $y$ shrinking in step as $x$ grows, in inverse proportion?',
      solution:
        '**Inversely proportional** means that when $x$ is multiplied by a number, $y$ is divided by that same number. If $x$ doubles, $y$ halves.\n\n' +
        'That means $x$ and $y$ multiply to the same number every time. Call that fixed number $k$ (a **constant**). So $xy = k$.\n\n' +
        'Divide both sides by $x$ to get $y$ alone: $y = \\frac{k}{x}$.',
      conclusion: 'Doubling $x$ in this formula halves $y$, which is inverse proportion, so the answer is $y = \\frac{k}{x}$.',
      whyWrong: [
        null,
        'This is **direct** proportion: $y$ doubles when $x$ doubles.',
        'This keeps a fixed difference between $y$ and $x$. Proportion works by multiplying, not by adding.',
        'This is direct proportion to the square of $x$.',
      ],
      keyIdea: 'Direct proportion: $y = kx$, so $\\frac{y}{x}$ stays the same. Inverse proportion: $y = \\frac{k}{x}$, so $xy$ stays the same. Use a given pair to find $k$, then use $k$ for the new value.',
    },
  },
  {
    id: 'percentages-ratio-025',
    subtopic: 'percentages-ratio',
    difficulty: 'foundation',
    stem: 'Compound interest for each year is calculated on:',
    options: ['The original amount plus earlier interest', 'The original amount only', 'The earlier interest only', 'The final amount'],
    correctIndex: 0,
    markScheme: {
      asking: 'What amount is each year\'s compound interest worked out from?',
      solution:
        '**Interest** is money added for keeping your money in an account. With **compound** interest, each year\'s interest joins the balance, and next year\'s interest is worked out on the new balance.\n\n' +
        'Take AED 100 at 10%. Year 1 earns 10, giving 110. Year 2 earns 10% of 110, which is 11, not 10. That extra 1 is interest on the earlier interest.',
      conclusion: 'Each year uses what has built up so far, so the answer is the original amount plus earlier interest.',
      whyWrong: [
        null,
        'Interest on the original amount only is **simple** interest.',
        'The original amount stays in the account, so it keeps earning interest too.',
        'The final amount is not known until the end. Each year uses the balance at the start of that year.',
      ],
      keyIdea: 'Simple interest is on the original amount only, so it is the same each year. Compound interest is on the current balance, so it grows each year, and the total is start $\\times$ multiplier to the power of the years.',
    },
  },
  // ---------------------------------------------------------------- exam
  {
    id: 'percentages-ratio-003',
    subtopic: 'percentages-ratio',
    difficulty: 'exam',
    stem: 'Huda and Karim share AED 360 in the ratio $4 : 5$. How much does the person with the **larger** share receive?',
    options: ['AED 160', 'AED 180', 'AED 72', 'AED 200'],
    correctIndex: 3,
    markScheme: {
      asking: 'How much does the person with the bigger share get?',
      solution:
        'The ratio $4 : 5$ means the money is cut into equal parts. Huda gets 4 parts and Karim gets 5 parts, so Karim has the larger share.\n\n' +
        'Count the parts in total: $4 + 5 = 9$.\n\n' +
        'Find the value of one part: $360 \\div 9 = 40$, so one part is AED 40.\n\n' +
        'The larger share is 5 parts: $5 \\times 40 = 200$.',
      conclusion: 'Karim\'s 5 parts are worth 200 and Huda\'s 4 parts are worth 160, which add to 360. So the answer is AED 200.',
      whyWrong: [
        'This is the **smaller** share ($4 \\times 40$), not the larger one.',
        'This splits the money equally ($360 \\div 2$) and ignores the ratio completely.',
        'This divides 360 by 5 (one number of the ratio) instead of by the total number of parts, 9.',
        null,
      ],
      keyIdea: 'To share in a ratio: add the ratio numbers to get the total parts, divide the amount by that total to get one part, then multiply by the number of parts you want.',
    },
    check: {
      optionValues: [160, 180, 72, 200],
      compute: () => (360 / (4 + 5)) * Math.max(4, 5),
    },
  },
  {
    id: 'percentages-ratio-004',
    subtopic: 'percentages-ratio',
    difficulty: 'exam',
    stem: 'A 750 g bag of rice costs AED 12. At the same price per gram, how much would **2 kg** of rice cost?',
    options: ['AED 32', 'AED 24', 'AED 0.032', 'AED 16'],
    correctIndex: 0,
    markScheme: {
      asking: 'What would 2 kg of rice cost at the same price per gram?',
      solution:
        'The bag is in grams but the question is in kilograms. Change to the same unit first: 1 kg is 1000 g, so 2 kg is $2 \\times 1000 = 2000$ g.\n\n' +
        'Find the price of 1 gram: $12 \\div 750 = 0.016$, so each gram costs AED 0.016.\n\n' +
        'Multiply by the number of grams: $0.016 \\times 2000 = 32$.',
      conclusion: '2000 g at 0.016 per gram costs 32, so the answer is AED 32.',
      whyWrong: [
        null,
        'This assumes 2 kg is two bags. Two bags are only $2 \\times 750 = 1500$ g, not 2000 g.',
        'This multiplies the price per gram by 2 instead of by 2000: the kilograms were not converted to grams.',
        'This is the price of **1 kg** ($0.016 \\times 1000$). The question asks for 2 kg, so it must be doubled.',
      ],
      keyIdea: 'For same-rate questions: put the quantities in the same unit, find the cost of one unit by dividing, then multiply by the amount you want.',
    },
    check: {
      optionValues: [32, 24, 0.032, 16],
      compute: () => (12 / 750) * (2 * 1000),
    },
  },
  {
    id: 'percentages-ratio-006',
    subtopic: 'percentages-ratio',
    difficulty: 'exam',
    stem: 'In a sale, all prices are reduced by 20%. A jacket now costs AED 240. What was its price **before** the sale?',
    options: ['AED 288', 'AED 300', 'AED 200', 'AED 192'],
    correctIndex: 1,
    markScheme: {
      asking: 'What was the price before the 20% reduction?',
      solution:
        'Start from what the sale does. The original price counts as 100%. Taking off 20% leaves $100\\% - 20\\% = 80\\%$, so the sale price is 80% of the original.\n\n' +
        'As a multiplier, 80% is $0.8$. So $\\text{original} \\times 0.8 = 240$.\n\n' +
        'To undo multiplying by 0.8, divide by 0.8: $\\text{original} = 240 \\div 0.8 = 300$.',
      conclusion: '20% of 300 is 60, and $300 - 60 = 240$, which matches the sale price. So the answer is AED 300.',
      whyWrong: [
        'This adds 20% **of the sale price** ($240 \\times 1.2$). The 20% was taken off the original price, which is bigger than 240, so adding 20% of 240 is not enough.',
        null,
        'This divides by $1.2$ as if the price had gone **up** by 20%. The original price must be more than AED 240.',
        'This takes another 20% off ($240 \\times 0.8$). The original price must be higher than the sale price, not lower.',
      ],
      keyIdea: 'When you know the price after a percentage change and want the original: original $=$ new $\\div$ multiplier. Never take the percentage of the new price, because the percentage was of the original.',
    },
    check: {
      optionValues: [288, 300, 200, 192],
      compute: () => 240 / (1 - 20 / 100),
    },
  },
  {
    id: 'percentages-ratio-007',
    subtopic: 'percentages-ratio',
    difficulty: 'exam',
    stem: 'A restaurant bill of AED 420 **includes** 5% VAT. What was the bill before VAT was added?',
    options: ['AED 399', 'AED 441', 'AED 20', 'AED 400'],
    correctIndex: 3,
    markScheme: {
      asking: 'What was the bill before the 5% VAT was added?',
      solution:
        'VAT is a tax added on top of a price. The price before VAT counts as 100%. Adding 5% gives $100\\% + 5\\% = 105\\%$, so 420 is 105% of the original.\n\n' +
        'As a multiplier, 105% is $1.05$. So $\\text{original} \\times 1.05 = 420$.\n\n' +
        'To undo multiplying by 1.05, divide by 1.05: $\\text{original} = 420 \\div 1.05 = 400$.',
      conclusion: '5% of 400 is 20, and $400 + 20 = 420$, which matches the bill. So the answer is AED 400.',
      whyWrong: [
        'This subtracts 5% **of 420** ($420 \\times 0.95$). VAT was 5% of the smaller pre-VAT price, so taking 5% of 420 removes too much.',
        'This adds another 5% ($420 \\times 1.05$) instead of removing the VAT that is already included.',
        'This is the amount of VAT paid ($420 - 400$), not the price before VAT.',
        null,
      ],
      keyIdea: 'When a price already includes a percentage, divide by its multiplier to remove it. Do not subtract the percentage of the total, because the percentage was worked out on the smaller price.',
    },
    check: {
      optionValues: [399, 441, 20, 400],
      compute: () => 420 / (1 + 5 / 100),
    },
  },
  {
    id: 'percentages-ratio-008',
    subtopic: 'percentages-ratio',
    difficulty: 'exam',
    stem: 'A price rises by 30% and then falls by 30%. What is the overall percentage change?',
    options: ['no change', 'a 9% decrease', 'a 9% increase', 'a 91% decrease'],
    correctIndex: 1,
    markScheme: {
      asking: 'After the rise and the fall, what is the total percentage change in the price?',
      solution:
        'Percentage changes happen one after the other, so the second is taken from the new price. That is why they cannot simply be added. Use multipliers instead.\n\n' +
        'A 30% rise means multiply by $1 + 0.3 = 1.3$. A 30% fall means multiply by $1 - 0.3 = 0.7$.\n\n' +
        'Doing both means multiplying by both: $1.3 \\times 0.7 = 0.91$.\n\n' +
        'So the final price is 91% of the start. The change is $100\\% - 91\\% = 9\\%$, downwards.',
      conclusion: 'A price of 100 goes to 130 and then 91, so it ends 9 lower. The answer is a 9% decrease.',
      whyWrong: [
        'This adds the percentages: $+30\\% - 30\\% = 0$. But the 30% fall is taken from the **bigger** price after the rise, so more is lost than was gained.',
        null,
        'The size (9%) is right, but the direction is wrong: the overall multiplier $0.91$ is less than 1, so the price went **down**.',
        'This reads the overall multiplier $0.91$ as the change. The final price is 91% **of** the start, so the decrease is only 9%.',
      ],
      keyIdea: 'For one percentage change after another: write each as a multiplier and multiply them. A result below 1 is a decrease, and above 1 is an increase. The size of the change is the gap from 1.',
    },
    check: {
      optionValues: [0, -9, 9, -91],
      compute: () => (1.3 * 0.7 - 1) * 100,
    },
  },
  {
    id: 'percentages-ratio-009',
    subtopic: 'percentages-ratio',
    difficulty: 'exam',
    stem: 'AED 5000 is invested at 4% per year **compound** interest, compounded annually. What is the total value of the investment after 3 years? Give your answer to 2 decimal places.',
    options: ['AED 5624.32', 'AED 5600.00', 'AED 624.32', 'AED 5849.29'],
    correctIndex: 0,
    markScheme: {
      asking: 'How much is the investment worth in total after 3 years of compound interest?',
      solution:
        '**Compound** interest means each year\'s interest joins the balance, and the next year\'s interest is worked out on the new balance.\n\n' +
        'Each year, 4% is added, so the balance becomes 104% of what it was. That is a multiplier of $1.04$.\n\n' +
        'Go year by year:\n\n| Year | Start | Working | End |\n|---|---|---|---|\n| 1 | 5000 | $5000 \\times 1.04$ | 5200 |\n| 2 | 5200 | $5200 \\times 1.04$ | 5408 |\n| 3 | 5408 | $5408 \\times 1.04$ | 5624.32 |',
      conclusion: 'Three lots of the multiplier give $5000 \\times 1.04^3$, so the answer is AED 5624.32.',
      whyWrong: [
        null,
        'This is **simple** interest: $5000 \\times 0.04 \\times 3 = 600$ added once. Compound interest also earns interest on previous interest.',
        'This is only the interest earned ($5624.32 - 5000$), not the total value of the investment.',
        'This uses 4 years instead of 3: $5000 \\times 1.04^{4} \\approx 5849.29$. The power must equal the number of years.',
      ],
      keyIdea: 'For compound growth: value $= P \\times m^n$, where $P$ is the start, $m$ is the yearly multiplier and $n$ is the number of years. See whether the question wants the total value or only the interest.',
    },
    check: {
      optionValues: [5624.32, 5600, 624.32, 5849.29],
      compute: () => Math.round(5000 * (1 + 4 / 100) ** 3 * 100) / 100,
    },
  },
  {
    id: 'percentages-ratio-010',
    subtopic: 'percentages-ratio',
    difficulty: 'exam',
    stem: 'Sami puts AED 2400 in an account that pays **simple** interest at 3.5% per year. How much **interest** has he earned after 4 years?',
    options: ['AED 2736', 'AED 84', 'AED 336', 'AED 354.06'],
    correctIndex: 2,
    markScheme: {
      asking: 'How much interest does the money earn in 4 years at 3.5% simple interest?',
      solution:
        '**Simple** interest is worked out on the original amount only, so the same amount is earned every year.\n\n' +
        'Find one year\'s interest. 3.5% as a decimal is $3.5 \\div 100 = 0.035$. So one year earns $2400 \\times 0.035 = 84$.\n\n' +
        'Multiply by the number of years: $84 \\times 4 = 336$.',
      conclusion: 'He earns 84 a year for 4 years, so the interest is AED 336.',
      whyWrong: [
        'This is the total in the account ($2400 + 336$). The question asks only for the interest earned.',
        'This is the interest for **one** year only. It must be multiplied by 4 years.',
        null,
        'This uses **compound** interest: $2400 \\times 1.035^{4} - 2400 \\approx 354.06$. The account pays simple interest.',
      ],
      keyIdea: 'Simple interest $=$ amount $\\times$ rate as a decimal $\\times$ years. See whether the question wants the interest alone or the total in the account, which is the amount plus the interest.',
    },
    check: {
      optionValues: [2736, 84, 336, 354.06],
      compute: () => (2400 * 3.5 * 4) / 100,
    },
  },
  {
    id: 'percentages-ratio-011',
    subtopic: 'percentages-ratio',
    difficulty: 'exam',
    stem: '$y$ is directly proportional to $x^2$. When $x = 2$, $y = 12$. What is the value of $y$ when $x = 5$?',
    options: ['$30$', '$150$', '$1.92$', '$75$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What is $y$ at $x = 5$ if $y$ is always a fixed number times $x^2$?',
      solution:
        '"Directly proportional to $x^2$" means $y$ is always a fixed number times $x^2$. Write this as $y = kx^2$, where $k$ is the fixed number, called the **constant**.\n\n' +
        'Find $k$ using the pair we know, $x = 2$ and $y = 12$: $12 = k \\times 2^2$, so $12 = 4k$.\n\n' +
        'Divide both sides by 4: $k = 3$. So the rule is $y = 3x^2$.\n\n' +
        'Use the rule for $x = 5$: $y = 3 \\times 5^2 = 3 \\times 25 = 75$.',
      conclusion: 'With the fixed number 3, the rule gives 75 at $x = 5$, so the answer is $75$.',
      whyWrong: [
        'This treats $y$ as proportional to $x$ (not $x^2$): $\\frac{12}{2} \\times 5 = 30$.',
        'This finds $k$ by dividing by $x$ instead of $x^2$ ($k = \\frac{12}{2} = 6$), then uses $y = 6 \\times 25$.',
        'This uses **inverse** proportion, $y = \\frac{k}{x^2}$, giving $k = 48$ and $y = \\frac{48}{25} = 1.92$.',
        null,
      ],
      keyIdea: 'For proportion questions: write the rule with $k$, such as $y = kx$, $y = kx^2$ or $y = \\frac{k}{x}$. Put the given pair in to find $k$, then put the new value in.',
    },
    check: {
      optionValues: [30, 150, 1.92, 75],
      compute: () => {
        const k = 12 / 2 ** 2;
        return k * 5 ** 2;
      },
    },
  },
  {
    id: 'percentages-ratio-012',
    subtopic: 'percentages-ratio',
    difficulty: 'exam',
    stem: '6 workers, all working at the same rate, take 10 days to build a wall. How long would 4 workers take to build the same wall?',
    options: ['15 days', '$6\\frac{2}{3}$ days', '12 days', '60 days'],
    correctIndex: 0,
    markScheme: {
      asking: 'How many days would 4 workers need for the same wall?',
      solution:
        'Fewer workers take longer, so this is **inverse proportion**: the number of workers times the number of days stays the same.\n\n' +
        'Find the total work in **worker-days**, where one worker-day is one worker working for one day: $6 \\times 10 = 60$ worker-days.\n\n' +
        'Share this between 4 workers: $60 \\div 4 = 15$ days.',
      conclusion: '4 workers for 15 days also makes $4 \\times 15 = 60$ worker-days, so the answer is 15 days.',
      whyWrong: [
        null,
        'This uses **direct** proportion ($10 \\times \\frac{4}{6}$). Fewer workers cannot finish the job faster.',
        'This says "2 fewer workers, so 2 more days". Proportion works by multiplying, not by adding or subtracting.',
        'This is the total work, $6 \\times 10 = 60$ worker-days. It still has to be divided by the 4 workers.',
      ],
      keyIdea: 'For "more workers, less time" questions: multiply workers by time to get the total work, then divide by the new number of workers. If fewer workers come out faster, you have used the wrong method.',
    },
    check: {
      optionValues: [15, 20 / 3, 12, 60],
      compute: () => (6 * 10) / 4,
    },
  },
  {
    id: 'percentages-ratio-013',
    subtopic: 'percentages-ratio',
    difficulty: 'exam',
    stem: 'In a class, the ratio of boys to girls is $3 : 5$. There are 12 more girls than boys. How many students are in the class altogether?',
    options: ['18', '30', '48', '96'],
    correctIndex: 2,
    markScheme: {
      asking: 'How many students are in a class where girls outnumber boys by 12, in the ratio $3 : 5$?',
      solution:
        'The ratio $3 : 5$ means boys are 3 parts and girls are 5 parts, where every part has the same number of students.\n\n' +
        'Girls have $5 - 3 = 2$ more parts than boys. We are told there are 12 more girls, so those 2 parts equal 12 students.\n\n' +
        'Find one part: $12 \\div 2 = 6$ students.\n\n' +
        'The whole class has $3 + 5 = 8$ parts, so the class has $8 \\times 6 = 48$ students.',
      conclusion: 'That is 18 boys and 30 girls, which differ by 12 and add to 48. So the answer is 48.',
      whyWrong: [
        'This is the number of **boys** only ($3 \\times 6$), not the whole class.',
        'This is the number of **girls** only ($5 \\times 6$), not the whole class.',
        null,
        'This treats the difference of 12 as **one** part, giving $8 \\times 12$. The difference is $5 - 3 = 2$ parts.',
      ],
      keyIdea: 'When you are given a difference and a ratio: subtract the ratio numbers to see how many parts the difference covers. Divide to get one part, then multiply by the parts you want.',
    },
    check: {
      optionValues: [18, 30, 48, 96],
      compute: () => (12 / (5 - 3)) * (3 + 5),
    },
  },
  {
    id: 'percentages-ratio-014',
    subtopic: 'percentages-ratio',
    difficulty: 'exam',
    stem: 'A car uses 6 litres of fuel for every 100 km. Fuel costs AED 3 per litre. How much does the fuel cost for a 450 km trip?',
    options: ['AED 27', 'AED 81', 'AED 13.50', 'AED 225'],
    correctIndex: 1,
    markScheme: {
      asking: 'What will the fuel cost for a 450 km trip?',
      solution:
        'The car\'s rate is per 100 km, so find how many lots of 100 km are in the trip: $450 \\div 100 = 4.5$.\n\n' +
        'Each 100 km uses 6 litres, so the trip uses $4.5 \\times 6 = 27$ litres.\n\n' +
        'Each litre costs 3, so the fuel costs $27 \\times 3 = 81$.',
      conclusion: '27 litres at 3 each costs 81, so the answer is AED 81.',
      whyWrong: [
        'This is the number of **litres** used (27), not the cost. It still needs multiplying by AED 3 per litre.',
        null,
        'This multiplies $4.5 \\times 3$ and forgets the car uses **6** litres per 100 km, not 1 litre.',
        'This divides $450 \\div 6 = 75$ as if the car did 6 km per litre, then multiplies by 3. The rate is 6 litres per **100** km.',
      ],
      keyIdea: 'Chain the rates: go from distance to fuel using the rate per km, then from fuel to money using the price per litre. Write the units at each stage to see which to divide and which to multiply.',
    },
    check: {
      optionValues: [27, 81, 13.5, 225],
      compute: () => (450 / 100) * 6 * 3,
    },
  },
  {
    id: 'percentages-ratio-015',
    subtopic: 'percentages-ratio',
    difficulty: 'exam',
    stem: 'A new car is worth AED 80000. Its value **depreciates** (falls) by 15% each year. What is it worth after 2 years?',
    options: ['AED 56000', 'AED 68000', 'AED 105800', 'AED 57800'],
    correctIndex: 3,
    markScheme: {
      asking: 'What is the car worth after losing 15% of its value twice?',
      solution:
        '**Depreciates** means the value falls. Each year the car keeps $100\\% - 15\\% = 85\\%$ of its value, so the multiplier is $0.85$.\n\n' +
        'The 15% is taken from the current value each year, not the original. So go year by year.\n\n' +
        'Year 1: $80000 \\times 0.85 = 68000$.\n\n' +
        'Year 2: $68000 \\times 0.85 = 57800$.',
      conclusion: 'That is the same as $80000 \\times 0.85^2$, so the answer is AED 57800.',
      whyWrong: [
        'This takes off $2 \\times 15\\% = 30\\%$ of the **original** value. In year 2 the 15% is taken from the already lower value of AED 68000.',
        'This is the value after only **one** year.',
        'This uses the multiplier $1.15$ (growth) instead of $0.85$. Depreciation means the value goes down.',
        null,
      ],
      keyIdea: 'For depreciation: value $= P \\times m^n$, where $P$ is the start, $m$ is 1 minus the rate as a decimal, and $n$ is the number of years. Never multiply the percentage by the years.',
    },
    check: {
      optionValues: [56000, 68000, 105800, 57800],
      compute: () => Math.round(80000 * (1 - 15 / 100) ** 2),
    },
  },
  {
    id: 'percentages-ratio-016',
    subtopic: 'percentages-ratio',
    difficulty: 'exam',
    stem: 'A price rises by 20%, then falls by 10% to AED 540. What was the price **before** the rise?',
    options: ['AED 490.91', 'AED 475.20', 'AED 500', 'AED 496.80'],
    correctIndex: 2,
    markScheme: {
      asking: 'What was the starting price, before both changes?',
      solution:
        'Write each change as a multiplier. A 20% rise multiplies by $1.2$, and a 10% fall multiplies by $0.9$.\n\n' +
        'So $\\text{start} \\times 1.2 \\times 0.9 = 540$. Multiply the two: $1.2 \\times 0.9 = 1.08$, which gives $\\text{start} \\times 1.08 = 540$.\n\n' +
        'To undo multiplying by 1.08, divide by it: $\\text{start} = 540 \\div 1.08 = 500$.',
      conclusion: 'Going forwards, 500 rises by 20% to 600, then falls by 10% to 540. So the answer is AED 500.',
      whyWrong: [
        'This adds the percentages ($+20\\% - 10\\% = +10\\%$) and divides by $1.1$. Successive changes multiply: the overall multiplier is $1.08$, not $1.1$.',
        'This "undoes" each change by applying the opposite percentage to the final price ($540 \\times 0.8 \\times 1.1$). Reversing must be done by dividing by the multipliers.',
        null,
        'This finds the overall change (+8%) correctly but then takes 8% **of 540** off ($540 \\times 0.92$). Reverse percentages need a division by $1.08$.',
      ],
      keyIdea: 'When several percentage changes lead to a final value: write each as a multiplier, multiply them together, then divide the final value by the result. Reversing means dividing, not applying the opposite percentage.',
    },
    check: {
      optionValues: [490.91, 475.2, 500, 496.8],
      compute: () => 540 / ((1 + 20 / 100) * (1 - 10 / 100)),
    },
  },
];
