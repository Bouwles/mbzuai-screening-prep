// A small interpreter for the house pseudocode dialect (see SPEC.md, section 1.3).
//
// The tests use it twice over:
//   1. As the dialect's definition. A snippet that doesn't parse here isn't in the dialect.
//   2. As an independent answer check. A snippet that can run on its own is run, and what it
//      prints is compared with the marked option, the same way the Python questions are run for real.

type Expr =
  | { k: 'num'; v: number }
  | { k: 'str'; v: string }
  | { k: 'bool'; v: boolean }
  | { k: 'var'; n: string }
  | { k: 'arr'; xs: Expr[] }
  | { k: 'idx'; a: Expr; i: Expr }
  | { k: 'call'; f: string; args: Expr[] }
  | { k: 'un'; op: string; x: Expr }
  | { k: 'bin'; op: string; l: Expr; r: Expr };

type Stmt =
  | { k: 'assign'; target: Expr; v: Expr }
  | { k: 'expr'; e: Expr }
  | { k: 'print'; args: Expr[] }
  | { k: 'if'; c: Expr; then: Stmt[]; else: Stmt[] }
  | { k: 'while'; c: Expr; body: Stmt[] }
  | { k: 'for'; v: string; from: Expr; to: Expr; body: Stmt[] }
  | { k: 'break' }
  | { k: 'return'; v?: Expr };

interface Fn {
  params: string[];
  body: Stmt[];
}

export interface Program {
  main: Stmt[];
  fns: Map<string, Fn>;
}

class ParseError extends Error {}

// ---------------------------------------------------------------- expressions
const TOKEN = /\s*(<=|>=|==|!=|"[^"]*"|\d+\.\d+|\d+|[A-Za-z_][A-Za-z0-9_]*|[-+*/^<>=()[\],])/y;
const WORD_OPS = new Set(['and', 'or', 'not']);
const RESERVED = new Set(['while', 'if', 'else', 'for', 'to', 'break', 'return', 'function', 'end', 'print']);

function tokenize(s: string): string[] {
  const out: string[] = [];
  TOKEN.lastIndex = 0;
  let i = 0;
  while (i < s.length) {
    if (!s.slice(i).trim()) break;
    TOKEN.lastIndex = i;
    const m = TOKEN.exec(s);
    if (!m) throw new ParseError(`cannot read "${s.slice(i)}"`);
    out.push(m[1]);
    i = TOKEN.lastIndex;
  }
  return out;
}

class ExprParser {
  p = 0;
  constructor(readonly t: string[]) {}
  peek() {
    return this.t[this.p];
  }
  eat(x?: string): string {
    const v = this.t[this.p];
    if (v === undefined) throw new ParseError('unexpected end of expression');
    if (x !== undefined && v !== x) throw new ParseError(`expected "${x}", found "${v}"`);
    this.p++;
    return v;
  }
  done() {
    return this.p >= this.t.length;
  }
  expr(): Expr {
    return this.or();
  }
  private or(): Expr {
    let l = this.and();
    while (this.peek() === 'or') {
      this.eat();
      l = { k: 'bin', op: 'or', l, r: this.and() };
    }
    return l;
  }
  private and(): Expr {
    let l = this.not();
    while (this.peek() === 'and') {
      this.eat();
      l = { k: 'bin', op: 'and', l, r: this.not() };
    }
    return l;
  }
  private not(): Expr {
    if (this.peek() === 'not') {
      this.eat();
      return { k: 'un', op: 'not', x: this.not() };
    }
    return this.cmp();
  }
  private cmp(): Expr {
    let l = this.add();
    while (['<', '>', '<=', '>=', '==', '!='].includes(this.peek() ?? '')) {
      const op = this.eat();
      l = { k: 'bin', op, l, r: this.add() };
    }
    return l;
  }
  private add(): Expr {
    let l = this.mul();
    while (this.peek() === '+' || this.peek() === '-') {
      const op = this.eat();
      l = { k: 'bin', op, l, r: this.mul() };
    }
    return l;
  }
  private mul(): Expr {
    let l = this.unary();
    while (this.peek() === '*' || this.peek() === '/') {
      const op = this.eat();
      l = { k: 'bin', op, l, r: this.unary() };
    }
    return l;
  }
  private unary(): Expr {
    if (this.peek() === '-') {
      this.eat();
      return { k: 'un', op: '-', x: this.unary() };
    }
    return this.pow();
  }
  private pow(): Expr {
    const l = this.postfix();
    if (this.peek() === '^') {
      this.eat();
      return { k: 'bin', op: '^', l, r: this.unary() };
    }
    return l;
  }
  private args(close: string): Expr[] {
    const xs: Expr[] = [];
    if (this.peek() !== close) {
      xs.push(this.expr());
      while (this.peek() === ',') {
        this.eat();
        xs.push(this.expr());
      }
    }
    this.eat(close);
    return xs;
  }
  private postfix(): Expr {
    let e = this.primary();
    while (this.peek() === '[') {
      this.eat();
      const i = this.expr();
      this.eat(']');
      e = { k: 'idx', a: e, i };
    }
    return e;
  }
  private primary(): Expr {
    const v = this.eat();
    if (v === '(') {
      const e = this.expr();
      this.eat(')');
      return e;
    }
    if (v === '[') return { k: 'arr', xs: this.args(']') };
    if (/^\d/.test(v)) return { k: 'num', v: Number(v) };
    if (v.startsWith('"')) return { k: 'str', v: v.slice(1, -1) };
    if (v === 'true' || v === 'false') return { k: 'bool', v: v === 'true' };
    if (/^[A-Za-z_]/.test(v)) {
      if (RESERVED.has(v) || WORD_OPS.has(v)) throw new ParseError(`keyword "${v}" used as a value`);
      if (this.peek() === '(') {
        this.eat();
        return { k: 'call', f: v, args: this.args(')') };
      }
      return { k: 'var', n: v };
    }
    throw new ParseError(`unexpected "${v}"`);
  }
}

function parseExpr(s: string): Expr {
  const p = new ExprParser(tokenize(s));
  const e = p.expr();
  if (!p.done()) throw new ParseError(`unexpected "${p.peek()}" in "${s}"`);
  return e;
}

// ---------------------------------------------------------------- statements
interface Line {
  no: number;
  indent: number;
  text: string;
}

const stripComment = (l: string) => {
  // "//" starts a comment unless it sits inside a string.
  let inStr = false;
  for (let i = 0; i < l.length - 1; i++) {
    if (l[i] === '"') inStr = !inStr;
    if (!inStr && l[i] === '/' && l[i + 1] === '/') return l.slice(0, i);
  }
  return l;
};

/** Things other languages write that the dialect doesn't allow, with what to write instead. */
const BANNED: [RegExp, string][] = [
  [/:\s*$/, 'blocks have no colon'],
  [/\b(elif|elseif|elsif)\b/, 'write "else" with a nested "if" inside it'],
  [/^else\s+if\b/, 'write "else" with a nested "if" on the next line'],
  [/\b(then|do|begin|continue|endif|endwhile|endfor|endfunction|def|range|None|True|False|null|repeat|until|step|downto|foreach)\b/, 'not in the dialect'],
  [/\b(WHILE|IF|ELSE|FOR|TO|END|PRINT|RETURN|FUNCTION|BREAK|While|If|Else|For|To|End|Print|Return|Function|Break)\b/, 'keywords are lowercase'],
  [/←|:=|\*\*|%|&&|\|\||\+=|-=|\*=|\/=|\+\+|--/, 'not in the dialect (use =, ^, mod(a,b), and, or, x = x + 1)'],
  [/;\s*$/, 'no semicolons'],
  [/[{}]/, 'no braces'],
  [/\bMOD\b|\bDIV\b|\s(mod|div)\s/, 'write mod(a,b) and div(a,b) as functions'],
];

/** Parse a snippet. Throws with a message if it is not in the dialect. */
export function parsePseudo(src: string): Program {
  const lines: Line[] = [];
  src.split('\n').forEach((raw, i) => {
    const text = stripComment(raw).trimEnd();
    if (!text.trim()) return;
    const indent = text.length - text.trimStart().length;
    if (indent % 3 !== 0) throw new ParseError(`line ${i + 1}: indent is ${indent} spaces, the dialect uses 3 per level`);
    if (/\t/.test(text)) throw new ParseError(`line ${i + 1}: tab in the indent`);
    const body = text.trim();
    for (const [re, msg] of BANNED) if (re.test(body)) throw new ParseError(`line ${i + 1}: "${body}": ${msg}`);
    lines.push({ no: i + 1, indent: indent / 3, text: body });
  });
  const fns = new Map<string, Fn>();
  let p = 0;

  const fail = (l: Line, msg: string): never => {
    throw new ParseError(`line ${l.no}: "${l.text}": ${msg}`);
  };

  const block = (level: number, stops: string[]): Stmt[] => {
    const out: Stmt[] = [];
    while (p < lines.length) {
      const l = lines[p];
      if (stops.includes(l.text)) return out;
      if (l.indent !== level) fail(l, `expected an indent of ${level * 3} spaces, found ${l.indent * 3}`);
      out.push(stmt(l, level));
    }
    if (stops.length) throw new ParseError(`missing "${stops.join('" or "')}" at the end`);
    return out;
  };

  const close = (word: string, level: number) => {
    const l = lines[p];
    if (!l || l.text !== word) throw new ParseError(`missing "${word}"`);
    if (l.indent !== level) fail(l, `"${word}" should line up with its opening line`);
    p++;
  };

  const stmt = (l: Line, level: number): Stmt => {
    const t = l.text;
    let m: RegExpMatchArray | null;
    try {
      if ((m = t.match(/^function\s+([A-Za-z_]\w*)\s*\(([^)]*)\)$/))) {
        p++;
        const params = m[2].split(',').map((x) => x.trim()).filter(Boolean);
        const body = block(level + 1, ['end function']);
        close('end function', level);
        fns.set(m[1], { params, body });
        return { k: 'expr', e: { k: 'num', v: 0 } };
      }
      if ((m = t.match(/^while\b\s*(.*)$/))) {
        if (!/^\(.*\)$/.test(m[1])) fail(l, 'write the condition in brackets: while (cond)');
        p++;
        const c = parseExpr(m[1]);
        const body = block(level + 1, ['end while']);
        close('end while', level);
        return { k: 'while', c, body };
      }
      if ((m = t.match(/^for\s+([A-Za-z_]\w*)\s*=\s*(.+?)\s+to\s+(.+)$/))) {
        p++;
        const from = parseExpr(m[2]);
        const to = parseExpr(m[3]);
        const body = block(level + 1, ['end for']);
        close('end for', level);
        return { k: 'for', v: m[1], from, to, body };
      }
      if (/^for\b/.test(t)) fail(l, 'write: for i = a to b');
      if ((m = t.match(/^if\b\s*(.+)$/))) {
        p++;
        const c = parseExpr(m[1]);
        const then = block(level + 1, ['else', 'end if']);
        let otherwise: Stmt[] = [];
        if (lines[p]?.text === 'else') {
          if (lines[p].indent !== level) fail(lines[p], '"else" should line up with its "if"');
          p++;
          otherwise = block(level + 1, ['end if']);
        }
        close('end if', level);
        return { k: 'if', c, then, else: otherwise };
      }
      if (t === 'else' || t.startsWith('end ')) fail(l, 'does not close anything here');
      p++;
      if (t === 'break') return { k: 'break' };
      if (t === 'return') return { k: 'return' };
      if ((m = t.match(/^return\s+(.+)$/))) return { k: 'return', v: parseExpr(m[1]) };
      if ((m = t.match(/^print\((.*)\)$/))) {
        const ep = new ExprParser(tokenize(`[${m[1]}]`));
        const arr = ep.expr();
        if (arr.k !== 'arr' || !ep.done()) fail(l, 'bad print');
        return { k: 'print', args: (arr as { xs: Expr[] }).xs };
      }
      if (/^print\b/.test(t)) fail(l, 'write print(x) with brackets');
      // assignment: split on the first "=" that isn't part of ==, <=, >=, !=
      const eq = findAssign(t);
      if (eq >= 0) {
        const target = parseExpr(t.slice(0, eq));
        if (target.k !== 'var' && target.k !== 'idx') fail(l, 'can only assign to a variable or an array element');
        return { k: 'assign', target, v: parseExpr(t.slice(eq + 1)) };
      }
      const e = parseExpr(t);
      if (e.k !== 'call') fail(l, 'not a statement');
      return { k: 'expr', e };
    } catch (err) {
      if (err instanceof ParseError && !/^line \d+/.test(err.message)) fail(l, err.message);
      throw err;
    }
  };

  const main = block(0, []);
  return { main, fns };
}

function findAssign(t: string): number {
  let inStr = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (c === '"') inStr = !inStr;
    if (inStr || c !== '=') continue;
    if ('=<>!'.includes(t[i - 1] ?? '') || t[i + 1] === '=') {
      if (t[i + 1] === '=') i++;
      continue;
    }
    return i;
  }
  return -1;
}

/** Everything wrong with a snippet's dialect, including the comment rules parsing can't see. */
export function dialectProblems(src: string): string[] {
  const out: string[] = [];
  try {
    parsePseudo(src);
  } catch (e) {
    out.push((e as Error).message);
  }
  const lines = src.split('\n');
  for (const [fn, word] of [['mod', 'mod'], ['div', 'div']] as const) {
    const re = new RegExp(`\\b${fn}\\(`);
    const first = lines.findIndex((l) => re.test(stripComment(l)));
    if (first >= 0) {
      const c = lines[first].slice(stripComment(lines[first]).length);
      if (!new RegExp(`//.*\\b${word}\\b`).test(c)) out.push(`line ${first + 1}: first use of ${fn}() needs a comment, e.g. "// ${word} is the ${fn === 'mod' ? 'modulus operator' : 'integer division operator'}"`);
    }
  }
  return out;
}

// ---------------------------------------------------------------- running
class Halt extends Error {
  constructor(readonly why: 'infinite' | 'unrunnable', msg: string) {
    super(msg);
  }
}
class BreakSig {}
class ReturnSig {
  constructor(readonly v: unknown) {}
}

export type RunResult =
  /** Ran to the end. */
  | { status: 'ok'; stdout: string }
  /** Ran past the step or depth cap: an infinite loop or a function that never stops. */
  | { status: 'infinite'; stdout: string }
  /** Can't run on its own (an undefined input such as `n`, or an illustrative call). */
  | { status: 'unrunnable'; why: string };

const STEP_CAP = 200_000;
const DEPTH_CAP = 2_000;

export function fmtValue(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(fmtValue).join(', ')}]`;
  if (typeof v === 'number') return Number.isInteger(v) ? String(v) : String(Number(v.toFixed(10)));
  return String(v);
}

export function runPseudo(src: string): RunResult {
  let prog: Program;
  try {
    prog = parsePseudo(src);
  } catch (e) {
    return { status: 'unrunnable', why: (e as Error).message };
  }
  const out: string[] = [];
  let steps = 0;
  let depth = 0;
  const tick = () => {
    if (++steps > STEP_CAP) throw new Halt('infinite', 'step cap');
  };
  const num = (v: unknown): number => {
    if (typeof v !== 'number') throw new Halt('unrunnable', `expected a number, got ${fmtValue(v)}`);
    return v;
  };
  const list = (v: unknown): unknown[] => {
    if (!Array.isArray(v)) throw new Halt('unrunnable', `expected an array, got ${fmtValue(v)}`);
    return v;
  };

  const builtin = (f: string, a: unknown[]): { v: unknown } | null => {
    switch (f) {
      case 'mod': {
        const m = num(a[1]);
        if (m === 0) throw new Halt('unrunnable', 'mod by zero');
        return { v: ((num(a[0]) % m) + m) % m };
      }
      case 'div': {
        const d = num(a[1]);
        if (d === 0) throw new Halt('unrunnable', 'div by zero');
        return { v: Math.floor(num(a[0]) / d) };
      }
      case 'length':
        return { v: typeof a[0] === 'string' ? a[0].length : list(a[0]).length };
      case 'abs':
        return { v: Math.abs(num(a[0])) };
      case 'floor':
        return { v: Math.floor(num(a[0])) };
      case 'ceil':
        return { v: Math.ceil(num(a[0])) };
      case 'sqrt':
        return { v: Math.sqrt(num(a[0])) };
      case 'max':
        return { v: Math.max(...a.map(num)) };
      case 'min':
        return { v: Math.min(...a.map(num)) };
      case 'push':
      case 'append':
      case 'enqueue':
        list(a[0]).push(a[1]);
        return { v: undefined };
      case 'pop': {
        const s = list(a[0]);
        if (!s.length) throw new Halt('unrunnable', 'pop from empty');
        return { v: s.pop() };
      }
      case 'dequeue': {
        const s = list(a[0]);
        if (!s.length) throw new Halt('unrunnable', 'dequeue from empty');
        return { v: s.shift() };
      }
      case 'top':
      case 'peek': {
        const s = list(a[0]);
        return { v: s[s.length - 1] };
      }
      case 'isEmpty':
        return { v: list(a[0]).length === 0 };
    }
    return null;
  };

  const ev = (e: Expr, env: Map<string, unknown>): unknown => {
    tick();
    switch (e.k) {
      case 'num':
      case 'str':
      case 'bool':
        return e.v;
      case 'var': {
        if (!env.has(e.n)) throw new Halt('unrunnable', `undefined variable ${e.n}`);
        return env.get(e.n);
      }
      case 'arr':
        return e.xs.map((x) => ev(x, env));
      case 'idx': {
        const a = ev(e.a, env);
        const i = num(ev(e.i, env));
        if (typeof a === 'string') {
          if (i < 1 || i > a.length) throw new Halt('unrunnable', `index ${i} out of range`);
          return a[i - 1];
        }
        const xs = list(a);
        if (i < 1 || i > xs.length) throw new Halt('unrunnable', `index ${i} out of range`);
        return xs[i - 1];
      }
      case 'un': {
        const v = ev(e.x, env);
        return e.op === 'not' ? !v : -num(v);
      }
      case 'bin': {
        if (e.op === 'and') return ev(e.l, env) && ev(e.r, env);
        if (e.op === 'or') return ev(e.l, env) || ev(e.r, env);
        const l = ev(e.l, env);
        const r = ev(e.r, env);
        switch (e.op) {
          case '==':
            return l === r;
          case '!=':
            return l !== r;
          case '+':
            if (typeof l === 'string' && typeof r === 'string') return l + r;
            return num(l) + num(r);
          case '-':
            return num(l) - num(r);
          case '*':
            return num(l) * num(r);
          case '/':
            if (num(r) === 0) throw new Halt('unrunnable', 'division by zero');
            return num(l) / num(r);
          case '^':
            return num(l) ** num(r);
          case '<':
            return (l as number) < (r as number);
          case '>':
            return (l as number) > (r as number);
          case '<=':
            return (l as number) <= (r as number);
          case '>=':
            return (l as number) >= (r as number);
        }
        throw new Halt('unrunnable', `unknown operator ${e.op}`);
      }
      case 'call': {
        const fn = prog.fns.get(e.f);
        if (fn) {
          if (++depth > DEPTH_CAP) throw new Halt('infinite', 'depth cap');
          const local = new Map<string, unknown>();
          fn.params.forEach((p, i) => local.set(p, ev(e.args[i], env)));
          let ret: unknown;
          try {
            run(fn.body, local);
          } catch (s) {
            if (s instanceof ReturnSig) ret = s.v;
            else throw s;
          } finally {
            depth--;
          }
          return ret;
        }
        const r = builtin(e.f, e.args.map((x) => ev(x, env)));
        if (!r) throw new Halt('unrunnable', `unknown function ${e.f}`);
        return r.v;
      }
    }
  };

  const run = (body: Stmt[], env: Map<string, unknown>) => {
    for (const s of body) {
      tick();
      switch (s.k) {
        case 'assign':
          if (s.target.k === 'var') env.set(s.target.n, ev(s.v, env));
          else if (s.target.k === 'idx') {
            const xs = list(ev(s.target.a, env));
            const i = num(ev(s.target.i, env));
            if (i < 1 || i > xs.length) throw new Halt('unrunnable', `index ${i} out of range`);
            xs[i - 1] = ev(s.v, env);
          }
          break;
        case 'expr':
          ev(s.e, env);
          break;
        case 'print':
          out.push(s.args.map((a) => fmtValue(ev(a, env))).join(' '));
          break;
        case 'if':
          run(ev(s.c, env) ? s.then : s.else, env);
          break;
        case 'while':
          while (ev(s.c, env)) {
            tick();
            try {
              run(s.body, env);
            } catch (x) {
              if (x instanceof BreakSig) break;
              throw x;
            }
          }
          break;
        case 'for': {
          const from = num(ev(s.from, env));
          const to = num(ev(s.to, env));
          for (let i = from; i <= to; i++) {
            tick();
            env.set(s.v, i);
            try {
              run(s.body, env);
            } catch (x) {
              if (x instanceof BreakSig) break;
              throw x;
            }
            // The loop variable drives the count, so changing it inside the body has no lasting effect.
          }
          break;
        }
        case 'break':
          throw new BreakSig();
        case 'return':
          throw new ReturnSig(s.v ? ev(s.v, env) : undefined);
      }
    }
  };

  try {
    run(prog.main, new Map());
    return { status: 'ok', stdout: out.join('\n') };
  } catch (e) {
    if (e instanceof Halt) return e.why === 'infinite' ? { status: 'infinite', stdout: out.join('\n') } : { status: 'unrunnable', why: e.message };
    if (e instanceof RangeError) return { status: 'infinite', stdout: out.join('\n') };
    if (e instanceof BreakSig || e instanceof ReturnSig) return { status: 'unrunnable', why: 'break or return outside a loop or function' };
    throw e;
  }
}
