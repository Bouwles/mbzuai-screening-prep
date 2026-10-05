import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'conditional-probability',
  know:
    '### What "conditional" means\n\n' +
    'A **conditional probability** is a probability worked out *after* you are told something. We write $P(A \\mid B)$ and say "the probability of $A$ **given** $B$". The bar $\\mid$ means "given that".\n\n' +
    'The key idea: being told $B$ happened **shrinks the sample space** to $B$. You then ask "what fraction of $B$ is also $A$?"\n\n' +
    '$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$$\n\n' +
    'Example: roll one fair die. $P(6) = \\frac{1}{6}$. But if you are told the number is **even**, only 2, 4, 6 are left, so $P(6 \\mid \\text{even}) = \\frac{1}{3}$.\n\n' +
    '**Order matters.** $P(A \\mid B)$ and $P(B \\mid A)$ are usually different. $P(\\text{has four legs} \\mid \\text{dog})$ is almost 1, but $P(\\text{dog} \\mid \\text{has four legs})$ is much smaller.\n\n' +
    '### Two-way tables\n\n' +
    'In a table of counts, "given" tells you which **row or column total** to divide by.\n\n' +
    '| | Plays sport | No sport | Total |\n' +
    '|---|---|---|---|\n' +
    '| Year 12 | 12 | 8 | 20 |\n' +
    '| Year 13 | 18 | 12 | 30 |\n' +
    '| Total | 30 | 20 | 50 |\n\n' +
    '- $P(\\text{Year 12} \\mid \\text{sport}) = \\frac{12}{30}$ (divide by the sport column total)\n' +
    '- $P(\\text{sport} \\mid \\text{Year 12}) = \\frac{12}{20}$ (divide by the Year 12 row total)\n' +
    '- $P(\\text{Year 12 and sport}) = \\frac{12}{50}$ (divide by everyone)\n\n' +
    '### Multiplication rule and tree diagrams\n\n' +
    'Rearranging the definition gives the **multiplication rule**: $P(A \\cap B) = P(A) \\times P(B \\mid A)$. This is exactly what a tree diagram does:\n\n' +
    '- The second set of branches holds **conditional** probabilities (given what happened on the first branch).\n' +
    '- **Multiply along** a path to get the probability of that whole path ("and").\n' +
    '- **Add** the paths you want ("or").\n' +
    '- The branches leaving any point add up to 1.\n\n' +
    '### With and without replacement\n\n' +
    '- **With replacement**: the item goes back, the bag resets, and the draws are **independent**. $P(\\text{two reds})$ from 3 red out of 10 is $\\frac{3}{10} \\times \\frac{3}{10}$.\n' +
    '- **Without replacement**: after a red is taken, there is one fewer red **and** one fewer item in total: $\\frac{3}{10} \\times \\frac{2}{9}$.\n\n' +
    'Useful facts: "one of each" happens in **two orders** (add both). "At least one" is fastest as $1 - P(\\text{none})$. And if you know nothing about the earlier draws, the 2nd (or 3rd) ball has the **same** chance of being red as the 1st.\n\n' +
    '### Independence\n\n' +
    '$A$ and $B$ are **independent** if knowing one does not change the other: $P(A \\mid B) = P(A)$, which is the same as $P(A \\cap B) = P(A)P(B)$. Do not confuse this with **mutually exclusive** ($P(A \\cap B) = 0$, cannot happen together).\n\n' +
    '### Law of total probability\n\n' +
    'If every case falls into exactly one of $B$ or $B\'$, then\n\n' +
    '$$P(A) = P(B)P(A \\mid B) + P(B\')P(A \\mid B\')$$\n\n' +
    'In tree language: find every path that ends in $A$, multiply along each, and add them. It works the same with three or more branches (for example three machines).\n\n' +
    '### Bayes\' theorem: turning a condition round\n\n' +
    'Often you are given $P(A \\mid B)$ but asked for $P(B \\mid A)$, for example given "the test is positive for 90% of ill people" and asked "if I test positive, how likely am I to be ill?". Bayes\' theorem:\n\n' +
    '$$P(B \\mid A) = \\frac{P(B)P(A \\mid B)}{P(A)}$$\n\n' +
    'where the bottom, $P(A)$, comes from the law of total probability. In words: **the path you care about, divided by all paths that give what you observed**.\n\n' +
    '### Medical tests and false positives\n\n' +
    'The easiest way to do Bayes is with **natural frequencies**: imagine 1000 (or 10000) people and turn every percentage into a count.\n\n' +
    '| Words | Meaning |\n' +
    '|---|---|\n' +
    '| prevalence / base rate | $P(D)$, how common the condition is |\n' +
    '| sensitivity | $P(+ \\mid D)$, ill people correctly detected |\n' +
    '| false positive rate | $P(+ \\mid D\')$, healthy people wrongly flagged |\n\n' +
    'When a condition is rare, the healthy group is so big that even a small false-positive rate produces more false positives than true positives. So $P(D \\mid +)$ can be surprisingly small even for a "90% accurate" test. The same maths is used in AI for spam filters and fraud detectors.',
  formulas: [
    { label: 'Conditional probability', tex: 'P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}', note: '"Given $B$": divide by the probability of the condition.' },
    { label: 'Multiplication rule (tree path)', tex: 'P(A \\cap B) = P(A) \\times P(B \\mid A)', note: 'Multiply along the branches of a tree.' },
    { label: 'Independent events', tex: 'P(A \\mid B) = P(A) \\iff P(A \\cap B) = P(A)\\,P(B)', note: 'Not the same as mutually exclusive, which means $P(A \\cap B) = 0$.' },
    { label: 'Addition rule (to find the overlap)', tex: 'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)' },
    { label: 'Complement / at least one', tex: 'P(\\text{at least one}) = 1 - P(\\text{none})' },
    { label: 'Law of total probability', tex: "P(A) = P(B)\\,P(A \\mid B) + P(B')\\,P(A \\mid B')", note: 'Add every tree path that ends in $A$.' },
    { label: "Bayes' theorem", tex: "P(B \\mid A) = \\frac{P(B)\\,P(A \\mid B)}{P(B)\\,P(A \\mid B) + P(B')\\,P(A \\mid B')}", note: 'The path you want divided by all paths giving the evidence.' },
    { label: 'Without replacement (two of a kind)', tex: 'P(\\text{both red}) = \\frac{r}{n} \\times \\frac{r - 1}{n - 1}', note: '$r$ red items out of $n$ in total.' },
  ],
  examples: [
    {
      title: 'Reading a two-way table',
      problem:
        'Of 40 people, 25 own a cat. Of the cat owners, 10 also own a dog. Of the people without a cat, 6 own a dog. A dog owner is chosen at random. What is the probability that they own a cat?',
      steps: [
        'Dog owners: $10 + 6 = 16$. This is the new sample space, because we are told the person owns a dog.',
        'Dog owners who also own a cat: 10.',
        '$P(\\text{cat} \\mid \\text{dog}) = \\frac{10}{16} = \\frac{5}{8}$.',
      ],
      answer: '$\\frac{5}{8}$',
    },
    {
      title: 'Without replacement: one of each colour',
      problem: 'A bag holds 3 red and 5 blue sweets. Two are taken at random and eaten, one after the other. What is the probability that they are different colours?',
      steps: [
        'There are 8 sweets. Different colours can happen in two orders.',
        'Red then blue: $\\frac{3}{8} \\times \\frac{5}{7} = \\frac{15}{56}$.',
        'Blue then red: $\\frac{5}{8} \\times \\frac{3}{7} = \\frac{15}{56}$.',
        'Add the two paths: $\\frac{15}{56} + \\frac{15}{56} = \\frac{30}{56} = \\frac{15}{28}$.',
      ],
      answer: '$\\frac{15}{28}$',
    },
    {
      title: 'Law of total probability, then Bayes',
      problem:
        'Machine X makes 70% of a factory\'s phones and 2% of them are faulty. Machine Y makes 30% and 4% of them are faulty. (a) Find the probability that a random phone is faulty. (b) A phone is faulty; find the probability it came from Y.',
      steps: [
        'X and faulty: $0.7 \\times 0.02 = 0.014$.',
        'Y and faulty: $0.3 \\times 0.04 = 0.012$.',
        '(a) Add the faulty paths: $P(F) = 0.014 + 0.012 = 0.026$.',
        '(b) Bayes: $P(Y \\mid F) = \\frac{0.012}{0.026} = \\frac{12}{26} = \\frac{6}{13}$.',
      ],
      answer: '(a) $0.026$ (b) $\\frac{6}{13}$',
    },
    {
      title: 'A positive medical test',
      problem:
        'A condition affects 2% of people. A test is positive for 95% of people with the condition and for 5% of people without it. Someone tests positive. What is the probability they have the condition?',
      steps: [
        'Imagine 10000 people: 2% of 10000 = 200 have the condition and 9800 do not.',
        'True positives: 95% of 200 = 190.',
        'False positives: 5% of 9800 = 490.',
        'All positives: $190 + 490 = 680$.',
        '$P(D \\mid +) = \\frac{190}{680} = \\frac{19}{68}$, which is about $0.28$ - far lower than 95%.',
      ],
      answer: '$\\frac{19}{68}$ (about 28%)',
    },
  ],
  traps: [
    'Mixing up $P(A \\mid B)$ and $P(B \\mid A)$. Always ask "what am I told?" - that is the condition, and its total goes on the bottom.',
    'Dividing by the grand total in a two-way table. "Given that" means divide by the row or column total of the group you are told about; dividing by everyone gives the "and" probability.',
    'Forgetting to reduce the total in "without replacement" problems: after one item is removed, both the count of that colour **and** the total drop by one.',
    'Counting only one order for "one of each" (red then blue) and forgetting the other order (blue then red).',
    'Confusing independent with mutually exclusive. Mutually exclusive events (with non-zero probabilities) are actually dependent: if one happens, the other cannot.',
    'Answering a Bayes question with the sensitivity (for example 90%) instead of $P(D \\mid +)$. With a rare condition, most positive results are false positives.',
  ],
  examTip:
    'In the 4-option MCQ, the wrong options are usually the **other** probabilities from the same problem: the reverse conditional, the "and" probability (forgot to divide), the base rate (ignored the information), or the with-replacement version. So first write down exactly which event is given, then check that your answer divides by **its** probability. Quick checks: a conditional probability can never exceed 1; for Bayes, $P(D \\mid +)$ should move from the base rate towards the evidence, so if the condition is rare and the answer equals the test accuracy, it is wrong. For Bayes, use natural frequencies (imagine 1000 or 10000 people), and use your calculator\'s fraction key to match the exact fraction in the options. For "at least one", use $1 - P(\\text{none})$ to save time.',
};
