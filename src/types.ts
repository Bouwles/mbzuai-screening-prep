// Core data model shared by the question bank, generators, lessons and the UI.
//
// Text fields ("Rich text") use a small Markdown subset plus LaTeX:
//   **bold**, *italic*, `inline code`, "- " bullet lists, "1. " numbered lists,
//   blank line = new paragraph, $inline maths$, $$display maths$$, \$ = literal dollar sign.
// All maths MUST be inside $...$ so KaTeX typesets it (never plain text like x^2).

export type AreaId = 'math' | 'ctl' | 'prog' | 'data';
export type Difficulty = 'foundation' | 'exam' | 'challenge';

export interface CodeBlock {
  /** 'python' is syntax-highlighted (and run by the tests if `python` is set on the question). */
  lang: 'python' | 'pseudocode';
  source: string;
}

export interface TableSpec {
  caption?: string;
  headers: string[];
  rows: (string | number)[][];
}

export type ChartSpec =
  | {
      kind: 'bar';
      title?: string;
      xLabel?: string;
      yLabel?: string;
      categories: string[];
      /** One or more series; several series are drawn as grouped bars. */
      series: { name: string; values: number[] }[];
      /** Optional y-axis minimum (use a non-zero value only for "misleading graph" questions). */
      yMin?: number;
      yMax?: number;
    }
  | {
      kind: 'line';
      title?: string;
      xLabel?: string;
      yLabel?: string;
      categories: string[];
      series: { name: string; values: number[] }[];
      yMin?: number;
      yMax?: number;
    }
  | {
      kind: 'scatter';
      title?: string;
      xLabel?: string;
      yLabel?: string;
      points: { x: number; y: number }[];
      /** Optional straight line y = slope*x + intercept drawn across the plot. */
      line?: { slope: number; intercept: number };
    }
  | {
      kind: 'pie';
      title?: string;
      slices: { label: string; value: number }[];
    }
  | {
      kind: 'histogram';
      title?: string;
      xLabel?: string;
      yLabel?: string;
      /** Bin edges, length = frequencies.length + 1. */
      edges: number[];
      frequencies: number[];
    }
  | {
      kind: 'boxplot';
      title?: string;
      xLabel?: string;
      /** One box per entry, drawn horizontally on a shared axis. */
      boxes: { label: string; min: number; q1: number; median: number; q3: number; max: number }[];
    };

export interface MarkScheme {
  /** Full worked solution, step by step (rich text). For code: trace line by line with variable values. */
  solution: string;
  /**
   * One entry per option, same order as `options`. The entry at `correctIndex` must be null;
   * every other entry names the specific mistake that produces that option
   * (e.g. "This is what you get if you forget the ball is not replaced.").
   * Never refer to options by letter (A-D) here: options are shuffled when displayed.
   */
  whyWrong: (string | null)[];
  /** The key idea in one sentence. */
  keyIdea: string;
}

/** Independent numeric/string check used by the test-suite (not shown to students). */
export interface AnswerCheck {
  /** Value of each option, same order as `options` (null for options that are not a value). */
  optionValues: (number | string | null)[];
  /** Recomputes the answer from the raw inputs of the question, in code. Must NOT just return a literal. */
  compute: () => number | string;
}

/** Marks a "what does this Python print" question so the tests run the snippet for real. */
export interface PythonCheck {
  /** Exact expected stdout (trailing whitespace ignored). Omit when an error is expected. */
  stdout?: string;
  /** Expected exception name, e.g. 'TypeError', when the correct answer is "an error is raised". */
  error?: string;
}

/** Shape shared by static (hand-written) and generated questions once materialised. */
export interface QuestionBody {
  stem: string;
  code?: CodeBlock;
  chart?: ChartSpec;
  table?: TableSpec;
  /** Exactly 4 options (rich text). */
  options: string[];
  correctIndex: number;
  markScheme: MarkScheme;
  /** Keep authored order (needed for options like "Both A and B"). Otherwise options are shuffled per question. */
  fixedOrder?: boolean;
}

export interface StaticQuestion extends QuestionBody {
  /** Unique id, e.g. "alg-quad-007". */
  id: string;
  subtopic: string;
  difficulty: Difficulty;
  check?: AnswerCheck;
  python?: PythonCheck;
}

/** What a generator returns for one seed. The engine shuffles the options with the same seed. */
export interface GeneratedCore {
  stem: string;
  code?: CodeBlock;
  chart?: ChartSpec;
  table?: TableSpec;
  /** Correct answer text (rich text) and, if numeric, its value. */
  answer: string;
  answerValue?: number | string;
  /** Exactly 3 distractors, each from a genuine mistake, with the explanation of that mistake. */
  distractors: { text: string; value?: number | string; why: string }[];
  /** Full worked solution built from the same numbers. Should end by stating the final answer. */
  solution: string;
  keyIdea: string;
  /** Optional: generated Python snippet whose stdout must equal `answer` (tests run it). */
  python?: PythonCheck;
}

export interface Generator {
  /** Unique id, e.g. "gen-quad-roots". */
  id: string;
  subtopic: string;
  difficulty: Difficulty;
  /** Short human title, e.g. "Solve a factorisable quadratic". */
  title: string;
  generate: (rng: import('./lib/rng').Rng) => GeneratedCore;
}

export interface Formula {
  label: string;
  /** LaTeX without surrounding $ (rendered in display mode). */
  tex: string;
  note?: string;
}

export interface WorkedExample {
  title: string;
  /** Problem statement (rich text). */
  problem: string;
  /** Each step is rich text. */
  steps: string[];
  answer: string;
}

export interface Lesson {
  subtopic: string;
  /** "What you need to know": plain-English explanation from the basics up (rich text, can use ### headings). */
  know: string;
  formulas: Formula[];
  examples: WorkedExample[];
  traps: string[];
  examTip: string;
}

/** A question as served to the UI: static or a generated variant, already shuffled. */
export interface ServedQuestion extends QuestionBody {
  /** Stable key used for progress: static id, or "gen:<generatorId>:<seed>". */
  key: string;
  /** Static id or generator id. */
  sourceId: string;
  generated: boolean;
  seed?: number;
  subtopic: string;
  topic: string;
  area: AreaId;
  difficulty: Difficulty;
  /** Generator title, for "Variant of: ..." label. */
  templateTitle?: string;
}

/** Reference to a question that can be re-materialised exactly. */
export type QRef = { kind: 'static'; id: string } | { kind: 'gen'; id: string; seed: number };
