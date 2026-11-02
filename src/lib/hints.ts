// Progressive hints, built from a question's worked solution: one paragraph at a time,
// never the last paragraph (that is where the solution states the answer).

/** Split rich text into paragraphs, keeping $$...$$ blocks, tables and lists whole. */
function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function hintsFor(solution: string, keyIdea: string): string[] {
  const ps = paragraphs(solution);
  // A short display-maths paragraph belongs with the sentence that introduces it.
  const merged: string[] = [];
  for (const p of ps) {
    if (merged.length && /^\$\$[\s\S]*\$\$$/.test(p)) merged[merged.length - 1] += `\n\n${p}`;
    else merged.push(p);
  }
  // Drop the last paragraph; if it is only a short "Answer: ..." line, the one before it is the
  // final calculation, so drop that too.
  const last = merged[merged.length - 1] ?? '';
  const cut = merged.length > 2 && last.length < 60 ? 2 : 1;
  const steps = merged.slice(0, -cut).filter((p) => !/^(answer|output)\b/i.test(p));
  if (steps.length) return steps;
  // One-paragraph solutions: give the method instead.
  return keyIdea ? [keyIdea] : [];
}
