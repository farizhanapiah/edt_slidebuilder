"use client";

import { PixelGrid } from "@/components/ui/PixelGrid";
import type { ChartContent } from "@/types/slide";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface Props {
  content: ChartContent;
  isExport?: boolean;
}

const EDT_BLUE = "#2D2DFF";
const EDT_WHITE = "#FFFFFF";
const EDT_GREY = "#8C8C8C";
const GRID_COLOR = "rgba(255,255,255,0.08)";
const AXIS_STYLE = {
  fontFamily: '"Space Grotesk", sans-serif',
  fontSize: 12,
  fill: EDT_GREY,
};

// Pie chart colors — blue-dominant palette
const PIE_COLORS = [
  "#2D2DFF",
  "#FFFFFF",
  "#5A5AFF",
  "#8C8C8C",
  "#0000CC",
  "#CCCCCC",
];

function formatValue(
  value: number,
  prefix = "",
  suffix = ""
): string {
  return `${prefix}${value.toLocaleString()}${suffix}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label, prefix, suffix }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        backgroundColor: "#111",
        border: "1px solid rgba(255,255,255,0.2)",
        padding: "10px 14px",
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: 13,
      }}
    >
      {label && (
        <p style={{ color: EDT_GREY, margin: "0 0 6px", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {label}
        </p>
      )}
      {payload.map((entry: { name: string; value: number; color: string }, i: number) => (
        <p key={i} style={{ margin: "2px 0", color: entry.color, fontWeight: 600 }}>
          {entry.name ? `${entry.name}: ` : ""}
          {formatValue(entry.value, prefix, suffix)}
        </p>
      ))}
    </div>
  );
}

export function ChartSlide({ content, isExport }: Props) {
  const {
    headline,
    eyebrow,
    chart_type,
    data,
    value_prefix = "",
    value_suffix = "",
    series_label,
    series2_label,
    show_legend,
    show_values,
    show_grid,
  } = content;

  const animate = !isExport;
  const hasHeader = !!(headline || eyebrow);
  const headerH = hasHeader ? 140 : 0;
  const chartH = 720 - 60 - headerH - 60; // top pad + header + bottom pad
  const chartW = 1280 - 88 - 80; // left + right pad

  const isHorizontalBar = chart_type === "bar_horizontal";
  const isPie = chart_type === "pie" || chart_type === "donut";

  function renderChart() {
    if (chart_type === "bar") {
      return (
        <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
          {show_grid && <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />}
          <XAxis dataKey="label" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis
            tick={AXIS_STYLE}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatValue(v, value_prefix, value_suffix)}
            width={64}
          />
          <Tooltip content={<CustomTooltip prefix={value_prefix} suffix={value_suffix} />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          {show_legend && <Legend wrapperStyle={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 12, color: EDT_GREY }} />}
          <Bar dataKey="value" name={series_label || "Value"} fill={EDT_BLUE} isAnimationActive={animate} radius={0}>
            {show_values && (
              <LabelList
                dataKey="value"
                position="top"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(v: any) => formatValue(Number(v), value_prefix, value_suffix)}
                style={{ fill: EDT_WHITE, fontFamily: '"Space Grotesk", sans-serif', fontSize: 12, fontWeight: 600 }}
              />
            )}
          </Bar>
          {data.some((d) => d.value2 !== undefined) && (
            <Bar dataKey="value2" name={series2_label || "Series 2"} fill={EDT_WHITE} isAnimationActive={animate} radius={0} />
          )}
        </BarChart>
      );
    }

    if (isHorizontalBar) {
      return (
        <BarChart layout="vertical" data={data} margin={{ top: 0, right: 60, left: 0, bottom: 0 }}>
          {show_grid && <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} horizontal={false} />}
          <XAxis
            type="number"
            tick={AXIS_STYLE}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatValue(v, value_prefix, value_suffix)}
          />
          <YAxis dataKey="label" type="category" tick={{ ...AXIS_STYLE, textAnchor: "end" }} axisLine={false} tickLine={false} width={160} />
          <Tooltip content={<CustomTooltip prefix={value_prefix} suffix={value_suffix} />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          {show_legend && <Legend wrapperStyle={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 12, color: EDT_GREY }} />}
          <Bar dataKey="value" name={series_label || "Value"} fill={EDT_BLUE} isAnimationActive={animate} radius={0}>
            {show_values && (
              <LabelList
                dataKey="value"
                position="right"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(v: any) => formatValue(Number(v), value_prefix, value_suffix)}
                style={{ fill: EDT_WHITE, fontFamily: '"Space Grotesk", sans-serif', fontSize: 12, fontWeight: 600 }}
              />
            )}
          </Bar>
        </BarChart>
      );
    }

    if (chart_type === "line") {
      return (
        <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          {show_grid && <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />}
          <XAxis dataKey="label" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis
            tick={AXIS_STYLE}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatValue(v, value_prefix, value_suffix)}
            width={64}
          />
          <Tooltip content={<CustomTooltip prefix={value_prefix} suffix={value_suffix} />} />
          {show_legend && <Legend wrapperStyle={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 12, color: EDT_GREY }} />}
          <Line
            type="monotone"
            dataKey="value"
            name={series_label || "Value"}
            stroke={EDT_BLUE}
            strokeWidth={3}
            dot={{ r: 5, fill: EDT_BLUE, stroke: "#0A0A0A", strokeWidth: 2 }}
            activeDot={{ r: 7 }}
            isAnimationActive={animate}
          >
            {show_values && (
              <LabelList
                dataKey="value"
                position="top"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(v: any) => formatValue(Number(v), value_prefix, value_suffix)}
                style={{ fill: EDT_WHITE, fontFamily: '"Space Grotesk", sans-serif', fontSize: 11 }}
              />
            )}
          </Line>
          {data.some((d) => d.value2 !== undefined) && (
            <Line
              type="monotone"
              dataKey="value2"
              name={series2_label || "Series 2"}
              stroke={EDT_WHITE}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4, fill: EDT_WHITE }}
              isAnimationActive={animate}
            />
          )}
        </LineChart>
      );
    }

    if (chart_type === "area") {
      return (
        <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={EDT_BLUE} stopOpacity={0.4} />
              <stop offset="95%" stopColor={EDT_BLUE} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          {show_grid && <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />}
          <XAxis dataKey="label" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis
            tick={AXIS_STYLE}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatValue(v, value_prefix, value_suffix)}
            width={64}
          />
          <Tooltip content={<CustomTooltip prefix={value_prefix} suffix={value_suffix} />} />
          {show_legend && <Legend wrapperStyle={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 12, color: EDT_GREY }} />}
          <Area
            type="monotone"
            dataKey="value"
            name={series_label || "Value"}
            stroke={EDT_BLUE}
            strokeWidth={3}
            fill="url(#areaGrad)"
            dot={{ r: 4, fill: EDT_BLUE, stroke: "#0A0A0A", strokeWidth: 2 }}
            isAnimationActive={animate}
          />
        </AreaChart>
      );
    }

    if (isPie) {
      const inner = chart_type === "donut" ? Math.min(chartH, chartW) * 0.22 : 0;
      const outer = Math.min(chartH, chartW) * 0.38;
      return (
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={inner}
            outerRadius={outer}
            paddingAngle={2}
            isAnimationActive={animate}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            label={show_values ? ({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%` : undefined}
            labelLine={show_values}
          >
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={PIE_COLORS[i % PIE_COLORS.length]}
                stroke="#0A0A0A"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip prefix={value_prefix} suffix={value_suffix} />} />
          {show_legend && (
            <Legend
              wrapperStyle={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 12, color: EDT_GREY }}
              formatter={(value) => <span style={{ color: EDT_WHITE }}>{value}</span>}
            />
          )}
        </PieChart>
      );
    }

    return null;
  }

  return (
    <div
      className="slide-base"
      style={{
        backgroundColor: "#0A0A0A",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <PixelGrid opacity={0.05} />

      {/* Left blue bar */}
      <div
        className={animate ? "anim-bar-in anim-d-0" : ""}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          backgroundColor: "#2D2DFF",
          zIndex: 3,
        }}
      />

      {/* Header */}
      {hasHeader && (
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 88,
            right: 80,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {eyebrow && (
            <span
              className={animate ? "anim-fade-up anim-d-0" : ""}
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#2D2DFF",
              }}
            >
              {eyebrow}
            </span>
          )}
          {headline && (
            <h2
              className={animate ? "anim-fade-up anim-d-1" : ""}
              style={{
                fontFamily: '"Dela Gothic One", sans-serif',
                fontSize: 44,
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                color: "#FFFFFF",
                lineHeight: 1,
                margin: 0,
              }}
            >
              {headline}
            </h2>
          )}
        </div>
      )}

      {/* Chart */}
      <div
        className={animate ? "anim-fade-up anim-d-2" : ""}
        style={{
          position: "absolute",
          top: 60 + headerH,
          left: isHorizontalBar ? 88 : 72,
          right: 80,
          height: chartH,
          zIndex: 2,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          {renderChart() as React.ReactElement}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
