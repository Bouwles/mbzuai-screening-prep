// Mock-exam score history, drawn in SVG, with the 75% target line.
import { EXAM } from '../config/exam';
import type { MockRecord } from '../store/progress';

export function ScoreChart({ mocks, compact = false }: { mocks: MockRecord[]; compact?: boolean }) {
  const done = mocks.filter((m) => m.submittedAt !== undefined && m.score !== undefined);
  const W = 640;
  const H = compact ? 170 : 260;
  // The top margin leaves room for the label above a score of 100%.
  const M = { l: 44, r: 16, t: 26, b: 30 };
  const PW = W - M.l - M.r;
  const PH = H - M.t - M.b;
  const y = (p: number) => M.t + PH - (p / 100) * PH;
  const n = done.length;
  const x = (i: number) => M.l + (n <= 1 ? PW / 2 : (i / (n - 1)) * PW);
  const target = EXAM.targetPercent;
  // The first and last labels stay inside the plot, clear of the axis labels on the left.
  const labelAt = (i: number) =>
    n > 1 && i === 0
      ? { x: x(i) - 5, textAnchor: 'start' as const }
      : n > 1 && i === n - 1
        ? { x: x(i) + 5, textAnchor: 'end' as const }
        : { x: x(i), textAnchor: 'middle' as const };
  if (!n)
    return (
      <div className="chart-empty">
        <p>No mock exams yet. Your scores will appear here against the {target}% line.</p>
      </div>
    );
  return (
    <svg className="score-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Mock exam scores over time, target ${target}%`}>
      {[0, 25, 50, 75, 100].map((t) => (
        <g key={t}>
          <line x1={M.l} x2={W - M.r} y1={y(t)} y2={y(t)} className="grid" />
          <text x={M.l - 8} y={y(t)} className="tick" textAnchor="end" dominantBaseline="middle">
            {t}%
          </text>
        </g>
      ))}
      <line x1={M.l} x2={W - M.r} y1={y(target)} y2={y(target)} className="target-line" />
      {n > 1 && <polyline points={done.map((m, i) => `${x(i)},${y(m.score!)}`).join(' ')} className="score-line" fill="none" />}
      {done.map((m, i) => (
        <g key={m.id}>
          <circle cx={x(i)} cy={y(m.score!)} r="5.5" className={m.score! >= target ? 'pt-pass' : 'pt-below'}>
            <title>
              {m.label}: {m.score}% on {new Date(m.startedAt).toLocaleDateString()}
            </title>
          </circle>
          {(!compact || i === n - 1) && (
            <text {...labelAt(i)} y={y(m.score!) - 11} className="tick pt-label">
              {m.score}%
            </text>
          )}
        </g>
      ))}
      <text x={M.l} y={H - 8} className="tick">
        {new Date(done[0].startedAt).toLocaleDateString()}
      </text>
      {/* The key sits below the plot, where no score label can run into it. */}
      <line x1={M.l + PW / 2 - 60} x2={M.l + PW / 2 - 34} y1={H - 12} y2={H - 12} className="target-line" />
      <text x={M.l + PW / 2 - 28} y={H - 8} className="target-label">
        {target}% fee waiver
      </text>
      {n > 1 && (
        <text x={W - M.r} y={H - 8} className="tick" textAnchor="end">
          {new Date(done[n - 1].startedAt).toLocaleDateString()}
        </text>
      )}
    </svg>
  );
}
