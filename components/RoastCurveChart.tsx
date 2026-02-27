"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export type RoastCurveSeriesItem = {
  key: string;
  label: string;
  values: (number | null)[];
  roastLabel?: string;
};

type RoastCurveChartProps = {
  time: number[];
  series: RoastCurveSeriesItem[];
  timeUnit?: string;
  height?: number;
};

function buildChartData(
  time: number[],
  series: RoastCurveSeriesItem[]
): Record<string, number | string>[] {
  if (!time.length) return [];
  return time.map((t, i) => {
    const row: Record<string, number | string> = {
      time: Math.round(t * 10) / 10,
      _timeSeconds: t,
    };
    series.forEach((s) => {
      const name = s.roastLabel ? `${s.label} (${s.roastLabel})` : s.label;
      row[name] = s.values[i] ?? null;
    });
    return row;
  });
}

const COLORS = ["#2563eb", "#dc2626", "#16a34a", "#ca8a04"];

export default function RoastCurveChart({
  time,
  series,
  timeUnit = "seconds",
  height = 320,
}: RoastCurveChartProps) {
  const data = buildChartData(time, series);
  const dataKeys = series.map(
    (s) => (s.roastLabel ? `${s.label} (${s.roastLabel})` : s.label)
  );

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-neutral-500"
        style={{ height }}
      >
        데이터가 없습니다.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200" />
        <XAxis
          dataKey="time"
          type="number"
          domain={["dataMin", "dataMax"]}
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => String(v)}
        />
        <YAxis
          domain={["auto", "auto"]}
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => (typeof v === "number" ? String(v) : "")}
        />
        <Tooltip
          formatter={(value: number) => (value != null ? [value, ""] : [])}
          labelFormatter={(label) => `${timeUnit === "seconds" ? "시간(초)" : "시간"}: ${label}`}
        />
        <Legend />
        {dataKeys.map((name, idx) => (
          <Line
            key={name}
            type="monotone"
            dataKey={name}
            name={name}
            stroke={COLORS[idx % COLORS.length]}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
