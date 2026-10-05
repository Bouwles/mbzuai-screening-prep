// Hand-drawn SVG charts for data questions (no chart library).
import { memo } from 'react';
import type { ChartSpec, TableSpec } from '../types';
import { RichInline } from './Rich';

const W = 640;
const H = 340;
const M = { l: 64, r: 20, t: 34, b: 58 };
const PW = W - M.l - M.r;
const PH = H - M.t - M.b;
const SERIES = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', 'var(--chart-6)'];

function niceTicks(min: number, max: number, count = 5): number[] {
  if (min === max) max = min + 1;
  const raw = (max - min) / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((k) => k * mag).find((s) => s >= raw) ?? raw;
  const start = Math.floor(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + step * 1e-9; v += step) ticks.push(Math.round(v * 1e6) / 1e6);
  if (ticks[ticks.length - 1] < max) ticks.push(Math.round((ticks[ticks.length - 1] + step) * 1e6) / 1e6);
  return ticks;
}
const fmt = (v: number) => (Math.abs(v) >= 1000 ? v.toLocaleString('en-US') : String(Math.round(v * 1000) / 1000));

function YAxis({ ticks, y, label }: { ticks: number[]; y: (v: number) => number; label?: string }) {
  return (
    <g>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={M.l} x2={W - M.r} y1={y(t)} y2={y(t)} className="grid" />
          <text x={M.l - 8} y={y(t)} className="tick" textAnchor="end" dominantBaseline="middle">
            {fmt(t)}
          </text>
        </g>
      ))}
      {label && (
        <text className="axis-label" transform={`translate(16 ${M.t + PH / 2}) rotate(-90)`} textAnchor="middle">
          {label}
        </text>
      )}
    </g>
  );
}

function Legend({ names }: { names: string[] }) {
  if (names.length < 2) return null;
  return (
    <g>
      {names.map((n, i) => (
        <g key={n} transform={`translate(${M.l + i * 140} ${H - 14})`}>
          <rect width="12" height="12" y="-10" rx="2" fill={SERIES[i % SERIES.length]} />
          <text x="18" className="tick">
            {n}
          </text>
        </g>
      ))}
    </g>
  );
}

function CategoryChart({ spec }: { spec: Extract<ChartSpec, { kind: 'bar' | 'line' }> }) {
  const all = spec.series.flatMap((s) => s.values);
  const lo = spec.yMin ?? Math.min(0, ...all);
  const hi = spec.yMax ?? Math.max(...all);
  const ticks = niceTicks(lo, hi);
  const y0 = spec.yMin ?? ticks[0];
  const y1 = spec.yMax ?? ticks[ticks.length - 1];
  const y = (v: number) => M.t + PH - ((v - y0) / (y1 - y0)) * PH;
  const n = spec.categories.length;
  const band = PW / n;
  const cx = (i: number) => M.l + band * (i + 0.5);
  const legendSpace = spec.series.length > 1;
  return (
    <>
      <YAxis ticks={ticks.filter((t) => t >= y0 && t <= y1)} y={y} label={spec.yLabel} />
      {spec.kind === 'bar' &&
        spec.series.map((s, si) => {
          const bw = (band * 0.7) / spec.series.length;
          return s.values.map((v, i) => {
            const x = M.l + band * i + band * 0.15 + si * bw;
            const top = y(Math.max(v, y0));
            const base = y(Math.min(Math.max(0, y0), y1)); // bars start at 0, or at the axis minimum if the axis is truncated
            return <rect key={`${si}-${i}`} x={x} y={Math.min(top, base)} width={bw - 2} height={Math.abs(base - top)} fill={SERIES[si % SERIES.length]} rx="2" />;
          });
        })}
      {spec.kind === 'line' &&
        spec.series.map((s, si) => (
          <g key={si}>
            <polyline points={s.values.map((v, i) => `${cx(i)},${y(v)}`).join(' ')} fill="none" stroke={SERIES[si % SERIES.length]} strokeWidth="2.5" />
            {s.values.map((v, i) => (
              <circle key={i} cx={cx(i)} cy={y(v)} r="4" fill={SERIES[si % SERIES.length]} />
            ))}
          </g>
        ))}
      <line x1={M.l} x2={W - M.r} y1={M.t + PH} y2={M.t + PH} className="axis" />
      {spec.categories.map((c, i) => (
        <text key={i} x={cx(i)} y={M.t + PH + 18} className="tick" textAnchor="middle">
          {c}
        </text>
      ))}
      {spec.xLabel && (
        <text x={M.l + PW / 2} y={M.t + PH + (legendSpace ? 36 : 42)} className="axis-label" textAnchor="middle">
          {spec.xLabel}
        </text>
      )}
      <Legend names={spec.series.map((s) => s.name)} />
    </>
  );
}

function Scatter({ spec }: { spec: Extract<ChartSpec, { kind: 'scatter' }> }) {
  const xs = spec.points.map((p) => p.x);
  const ys = spec.points.map((p) => p.y);
  const xt = niceTicks(Math.min(...xs), Math.max(...xs));
  const yt = niceTicks(Math.min(...ys), Math.max(...ys));
  const x = (v: number) => M.l + ((v - xt[0]) / (xt[xt.length - 1] - xt[0])) * PW;
  const y = (v: number) => M.t + PH - ((v - yt[0]) / (yt[yt.length - 1] - yt[0])) * PH;
  const [ax, bx] = [xt[0], xt[xt.length - 1]];
  return (
    <>
      <YAxis ticks={yt} y={y} label={spec.yLabel} />
      {xt.map((t) => (
        <text key={t} x={x(t)} y={M.t + PH + 18} className="tick" textAnchor="middle">
          {fmt(t)}
        </text>
      ))}
      <line x1={M.l} x2={W - M.r} y1={M.t + PH} y2={M.t + PH} className="axis" />
      {spec.line && (
        <line x1={x(ax)} y1={y(spec.line.slope * ax + spec.line.intercept)} x2={x(bx)} y2={y(spec.line.slope * bx + spec.line.intercept)} stroke="var(--chart-2)" strokeWidth="2" strokeDasharray="6 4" clipPath="url(#plot)" />
      )}
      {spec.points.map((p, i) => (
        <circle key={i} cx={x(p.x)} cy={y(p.y)} r="5" fill="var(--chart-1)" fillOpacity="0.85" />
      ))}
      {spec.xLabel && (
        <text x={M.l + PW / 2} y={M.t + PH + 42} className="axis-label" textAnchor="middle">
          {spec.xLabel}
        </text>
      )}
    </>
  );
}

function Pie({ spec }: { spec: Extract<ChartSpec, { kind: 'pie' }> }) {
  const total = spec.slices.reduce((n, s) => n + s.value, 0);
  const cx = 200;
  const cy = M.t + PH / 2 + 8;
  const r = 128;
  let a = -Math.PI / 2;
  return (
    <>
      {spec.slices.map((s, i) => {
        const a2 = a + (s.value / total) * Math.PI * 2;
        const large = a2 - a > Math.PI ? 1 : 0;
        const d =
          spec.slices.length === 1
            ? `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0`
            : `M ${cx} ${cy} L ${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)} A ${r} ${r} 0 ${large} 1 ${cx + r * Math.cos(a2)} ${cy + r * Math.sin(a2)} Z`;
        a = a2;
        return <path key={i} d={d} fill={SERIES[i % SERIES.length]} stroke="var(--surface)" strokeWidth="2" />;
      })}
      {spec.slices.map((s, i) => (
        <g key={i} transform={`translate(380 ${M.t + 30 + i * 28})`}>
          <rect width="14" height="14" y="-11" rx="3" fill={SERIES[i % SERIES.length]} />
          <text x="22" className="tick legend-text">
            {s.label}: {fmt(s.value)}
          </text>
        </g>
      ))}
    </>
  );
}

function Histogram({ spec }: { spec: Extract<ChartSpec, { kind: 'histogram' }> }) {
  const lo = spec.edges[0];
  const hi = spec.edges[spec.edges.length - 1];
  const yt = niceTicks(0, Math.max(...spec.frequencies));
  const x = (v: number) => M.l + ((v - lo) / (hi - lo)) * PW;
  const y = (v: number) => M.t + PH - (v / yt[yt.length - 1]) * PH;
  return (
    <>
      <YAxis ticks={yt} y={y} label={spec.yLabel ?? 'Frequency'} />
      {spec.frequencies.map((f, i) => (
        <rect key={i} x={x(spec.edges[i])} y={y(f)} width={x(spec.edges[i + 1]) - x(spec.edges[i])} height={M.t + PH - y(f)} fill="var(--chart-1)" stroke="var(--surface)" strokeWidth="1.5" />
      ))}
      <line x1={M.l} x2={W - M.r} y1={M.t + PH} y2={M.t + PH} className="axis" />
      {spec.edges.map((e) => (
        <text key={e} x={x(e)} y={M.t + PH + 18} className="tick" textAnchor="middle">
          {fmt(e)}
        </text>
      ))}
      {spec.xLabel && (
        <text x={M.l + PW / 2} y={M.t + PH + 42} className="axis-label" textAnchor="middle">
          {spec.xLabel}
        </text>
      )}
    </>
  );
}

function BoxPlot({ spec }: { spec: Extract<ChartSpec, { kind: 'boxplot' }> }) {
  const all = spec.boxes.flatMap((b) => [b.min, b.max]);
  const xt = niceTicks(Math.min(...all), Math.max(...all));
  const left = M.l + 50;
  const x = (v: number) => left + ((v - xt[0]) / (xt[xt.length - 1] - xt[0])) * (W - left - M.r);
  const rowH = PH / spec.boxes.length;
  return (
    <>
      {xt.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={M.t} y2={M.t + PH} className="grid" />
          <text x={x(t)} y={M.t + PH + 18} className="tick" textAnchor="middle">
            {fmt(t)}
          </text>
        </g>
      ))}
      {spec.boxes.map((b, i) => {
        const cy = M.t + rowH * (i + 0.5);
        const h = Math.min(44, rowH * 0.5);
        return (
          <g key={i}>
            <text x={left - 12} y={cy} className="tick" textAnchor="end" dominantBaseline="middle">
              {b.label}
            </text>
            <line x1={x(b.min)} x2={x(b.q1)} y1={cy} y2={cy} className="whisker" />
            <line x1={x(b.q3)} x2={x(b.max)} y1={cy} y2={cy} className="whisker" />
            <line x1={x(b.min)} x2={x(b.min)} y1={cy - h / 3} y2={cy + h / 3} className="whisker" />
            <line x1={x(b.max)} x2={x(b.max)} y1={cy - h / 3} y2={cy + h / 3} className="whisker" />
            <rect x={x(b.q1)} y={cy - h / 2} width={x(b.q3) - x(b.q1)} height={h} fill={SERIES[i % SERIES.length]} fillOpacity="0.35" stroke={SERIES[i % SERIES.length]} strokeWidth="2" rx="3" />
            <line x1={x(b.median)} x2={x(b.median)} y1={cy - h / 2} y2={cy + h / 2} stroke="var(--text)" strokeWidth="2.5" />
          </g>
        );
      })}
      {spec.xLabel && (
        <text x={left + (W - left - M.r) / 2} y={M.t + PH + 42} className="axis-label" textAnchor="middle">
          {spec.xLabel}
        </text>
      )}
    </>
  );
}

export const ChartView = memo(function ChartView({ spec }: { spec: ChartSpec }) {
  return (
    <figure className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={spec.title ?? `${spec.kind} chart`}>
        <defs>
          <clipPath id="plot">
            <rect x={M.l} y={M.t} width={PW} height={PH} />
          </clipPath>
        </defs>
        {spec.title && (
          <text x={W / 2} y={18} className="chart-title" textAnchor="middle">
            {spec.title}
          </text>
        )}
        {(spec.kind === 'bar' || spec.kind === 'line') && <CategoryChart spec={spec} />}
        {spec.kind === 'scatter' && <Scatter spec={spec} />}
        {spec.kind === 'pie' && <Pie spec={spec} />}
        {spec.kind === 'histogram' && <Histogram spec={spec} />}
        {spec.kind === 'boxplot' && <BoxPlot spec={spec} />}
      </svg>
    </figure>
  );
});

export const TableView = memo(function TableView({ table }: { table: TableSpec }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        {table.caption && <caption>{table.caption}</caption>}
        <thead>
          <tr>
            {table.headers.map((h, i) => (
              <th key={i}>
                <RichInline text={String(h)} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j}>{typeof c === 'number' ? fmt(c) : <RichInline text={c} />}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
