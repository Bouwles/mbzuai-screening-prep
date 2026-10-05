// Mock-exam score history, drawn in SVG, with the 75% target line.
import { EXAM } from '../config/exam';
import type { MockRecord } from '../store/progress';

export function ScoreChart({ mocks, compact = false }: { mocks: MockRecord[]; compact?: boolean }) {
  const done = mocks.filter((m) => m.submittedAt !== undefined && m.score !== undefined);
  const W = 640;
  const H = compact ? 170 : 260;
  const M = { l: 44, r: 16, t: 16, b: 30 };
  const PW = W - M.l - M.r;
  const PH = H - M.t - M.b;
  const y = (p: number) => M.t + PH - (p / 100) * PH;
  const n = done.length;
  const x = (i: number) => M.l + (n <= 1 ? PW / 2 : (i / (n - 1)) * PW);
  const target = EXAM.targetPercent;
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
      <text x={W - M.r} y={y(target) - 6} className="target-label" textAnchor="end">
        Target {target}%
      </text>
      {n > 1 && <polyline points={done.map((m, i) => `${x(i)},${y(m.score!)}`).join(' ')} className="score-line" fill="none" />}
      {done.map((m, i) => (
        <g key={m.id}>
          <circle cx={x(i)} cy={y(m.score!)} r="5.5" className={m.score! >= target ? 'pt-pass' : 'pt-below'}>
            <title>
              {m.label}: {m.score}% on {new Date(m.startedAt).toLocaleDateString()}
            </title>
          </circle>
          {(!compact || i === n - 1) && (
            <text x={x(i)} y={y(m.score!) - 11} className="tick pt-label" textAnchor="middle">
              {m.score}%
            </text>
          )}
        </g>
      ))}
      <text x={M.l} y={H - 8} className="tick">
        {new Date(done[0].startedAt).toLocaleDateString()}
      </text>
      {n > 1 && (
        <text x={W - M.r} y={H - 8} className="tick" textAnchor="end">
          {new Date(done[n - 1].startedAt).toLocaleDateString()}
        </text>
      )}
    </svg>
  );
}
