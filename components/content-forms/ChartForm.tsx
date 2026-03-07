"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { ChartContent, ChartDataPoint, ChartType } from "@/types/slide";

interface Props {
  content: ChartContent;
  onChange: (updated: Partial<ChartContent>) => void;
}

const CHART_TYPE_OPTIONS: { value: ChartType; label: string; desc: string }[] = [
  { value: "bar",            label: "Bar (Vertical)",    desc: "Vertical bars for comparison" },
  { value: "bar_horizontal", label: "Bar (Horizontal)",  desc: "Horizontal bars for rankings" },
  { value: "line",           label: "Line",              desc: "Trend over time" },
  { value: "area",           label: "Area",              desc: "Line with filled gradient" },
  { value: "pie",            label: "Pie",               desc: "Part-to-whole breakdown" },
  { value: "donut",          label: "Donut",             desc: "Pie chart with center hole" },
];

const labelStyle: React.CSSProperties = {
  fontFamily: '"Space Grotesk", sans-serif',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#8C8C8C",
};

const isPolar = (type: ChartType) => type === "pie" || type === "donut";

export function ChartForm({ content, onChange }: Props) {
  function updatePoint(i: number, updates: Partial<ChartDataPoint>) {
    const data = [...content.data];
    data[i] = { ...data[i], ...updates };
    onChange({ data });
  }

  function addPoint() {
    onChange({ data: [...content.data, { label: `Item ${content.data.length + 1}`, value: 0 }] });
  }

  function removePoint(i: number) {
    onChange({ data: content.data.filter((_, idx) => idx !== i) });
  }

  const showAxes = !isPolar(content.chart_type);
  const hasSecondSeries = content.data.some((d) => d.value2 !== undefined);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <Input
        label="Eyebrow (optional)"
        value={content.eyebrow ?? ""}
        onChange={(e) => onChange({ eyebrow: e.target.value })}
        placeholder="BY THE NUMBERS"
      />
      <Input
        label="Headline (optional)"
        value={content.headline ?? ""}
        onChange={(e) => onChange({ headline: e.target.value })}
        placeholder="PERFORMANCE OVERVIEW"
      />

      {/* Chart type */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={labelStyle}>CHART TYPE</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {CHART_TYPE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                border: `1px solid ${content.chart_type === opt.value ? "#2D2DFF" : "rgba(255,255,255,0.08)"}`,
                backgroundColor: content.chart_type === opt.value ? "rgba(45,45,255,0.12)" : "transparent",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="chart_type"
                value={opt.value}
                checked={content.chart_type === opt.value}
                onChange={() => onChange({ chart_type: opt.value })}
                style={{ accentColor: "#2D2DFF" }}
              />
              <div>
                <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 12, fontWeight: 600, color: "#FFFFFF" }}>
                  {opt.label}
                </div>
                <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, color: "#8C8C8C" }}>
                  {opt.desc}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Value formatting */}
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <Input
            label="Value prefix"
            value={content.value_prefix ?? ""}
            onChange={(e) => onChange({ value_prefix: e.target.value })}
            placeholder="$"
          />
        </div>
        <div style={{ flex: 1 }}>
          <Input
            label="Value suffix"
            value={content.value_suffix ?? ""}
            onChange={(e) => onChange({ value_suffix: e.target.value })}
            placeholder="%"
          />
        </div>
      </div>

      {/* Data points */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={labelStyle}>DATA</span>
          <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={hasSecondSeries}
              onChange={(e) => {
                const data = content.data.map((d) =>
                  e.target.checked ? { ...d, value2: d.value2 ?? 0 } : (({ value2, ...rest }) => rest)(d) as ChartDataPoint
                );
                onChange({ data });
              }}
              style={{ accentColor: "#2D2DFF" }}
            />
            <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, color: "#8C8C8C" }}>2nd series</span>
          </label>
        </div>

        {content.data.map((point, i) => (
          <div
            key={i}
            style={{ border: "1px solid rgba(255,255,255,0.08)", padding: 10, display: "flex", flexDirection: "column", gap: 8 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, color: "#555" }}>POINT {i + 1}</span>
              <button
                onClick={() => removePoint(i)}
                style={{ backgroundColor: "transparent", border: "none", color: "#555", cursor: "pointer", fontSize: 14, padding: 0 }}
              >
                ✕
              </button>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 2 }}>
                <Input
                  label="Label"
                  value={point.label}
                  onChange={(e) => updatePoint(i, { label: e.target.value })}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Input
                  label="Value"
                  type="number"
                  value={String(point.value)}
                  onChange={(e) => updatePoint(i, { value: parseFloat(e.target.value) || 0 })}
                />
              </div>
              {hasSecondSeries && (
                <div style={{ flex: 1 }}>
                  <Input
                    label="Value 2"
                    type="number"
                    value={String(point.value2 ?? 0)}
                    onChange={(e) => updatePoint(i, { value2: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        <Button variant="secondary" size="sm" onClick={addPoint}>+ ADD DATA POINT</Button>
      </div>

      {/* Series labels */}
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <Input
            label="Series 1 label"
            value={content.series_label ?? ""}
            onChange={(e) => onChange({ series_label: e.target.value })}
            placeholder="Value"
          />
        </div>
        {hasSecondSeries && (
          <div style={{ flex: 1 }}>
            <Input
              label="Series 2 label"
              value={content.series2_label ?? ""}
              onChange={(e) => onChange({ series2_label: e.target.value })}
              placeholder="Comparison"
            />
          </div>
        )}
      </div>

      {/* Axis labels (not for polar) */}
      {showAxes && (
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <Input
              label="X-axis label"
              value={content.x_axis_label ?? ""}
              onChange={(e) => onChange({ x_axis_label: e.target.value })}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Input
              label="Y-axis label"
              value={content.y_axis_label ?? ""}
              onChange={(e) => onChange({ y_axis_label: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* Display options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={labelStyle}>DISPLAY</span>
        {[
          { key: "show_legend", label: "Show legend" },
          { key: "show_values", label: "Show value labels on chart" },
          ...(showAxes ? [{ key: "show_grid", label: "Show grid lines" }] : []),
        ].map(({ key, label }) => (
          <label key={key} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={!!content[key as keyof ChartContent]}
              onChange={(e) => onChange({ [key]: e.target.checked } as Partial<ChartContent>)}
              style={{ accentColor: "#2D2DFF" }}
            />
            <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 13, color: "#CCCCCC" }}>
              {label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
