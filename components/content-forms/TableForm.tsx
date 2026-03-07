"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { TableContent, TableColumn } from "@/types/slide";

interface Props {
  content: TableContent;
  onChange: (updated: Partial<TableContent>) => void;
}

const COST_ESTIMATE_PRESET: Partial<TableContent> = {
  headline: "COST ESTIMATE",
  eyebrow: "BUDGET BREAKDOWN",
  columns: [
    { key: "id",    label: "#",        width: 6,  align: "center", format: "text"     },
    { key: "item",  label: "Item",      width: 46, align: "left",   format: "text"     },
    { key: "qty",   label: "Qty",       width: 12, align: "center", format: "number"   },
    { key: "cost",  label: "Unit Cost", width: 18, align: "right",  format: "currency" },
    { key: "total", label: "Total",     width: 18, align: "right",  format: "currency" },
  ],
  rows: [
    { id: "01", item: "Design & Creative Direction", qty: 1, cost: 5000, total: 5000 },
    { id: "02", item: "Development",                 qty: 1, cost: 8000, total: 8000 },
    { id: "03", item: "Content Production",          qty: 3, cost: 1200, total: 3600 },
  ],
  show_total_row: true,
  total_column: "total",
  currency_symbol: "$",
  highlight_last_column: true,
};

const ALIGN_OPTIONS = [
  { value: "left",   label: "Left" },
  { value: "center", label: "Center" },
  { value: "right",  label: "Right" },
];

const FORMAT_OPTIONS = [
  { value: "text",       label: "Text" },
  { value: "number",     label: "Number" },
  { value: "currency",   label: "Currency" },
  { value: "percentage", label: "Percentage" },
];

const labelStyle: React.CSSProperties = {
  fontFamily: '"Space Grotesk", sans-serif',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#8C8C8C",
};

const sectionStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

export function TableForm({ content, onChange }: Props) {
  function updateColumn(i: number, updates: Partial<TableColumn>) {
    const columns = [...content.columns];
    columns[i] = { ...columns[i], ...updates };
    onChange({ columns });
  }

  function addColumn() {
    const newKey = `col${content.columns.length + 1}`;
    onChange({
      columns: [...content.columns, { key: newKey, label: "Column", width: 15, align: "left", format: "text" }],
    });
  }

  function removeColumn(i: number) {
    onChange({ columns: content.columns.filter((_, idx) => idx !== i) });
  }

  function updateRow(rowIdx: number, colKey: string, value: string) {
    const rows = [...content.rows];
    rows[rowIdx] = { ...rows[rowIdx], [colKey]: value };
    onChange({ rows });
  }

  function addRow() {
    const emptyRow: Record<string, string> = {};
    content.columns.forEach((col) => { emptyRow[col.key] = ""; });
    onChange({ rows: [...content.rows, emptyRow] });
  }

  function removeRow(i: number) {
    onChange({ rows: content.rows.filter((_, idx) => idx !== i) });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Preset */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onChange(COST_ESTIMATE_PRESET)}
      >
        LOAD COST ESTIMATE TEMPLATE
      </Button>

      {/* Header */}
      <Input
        label="Eyebrow (optional)"
        value={content.eyebrow ?? ""}
        onChange={(e) => onChange({ eyebrow: e.target.value })}
        placeholder="BUDGET BREAKDOWN"
      />
      <Input
        label="Headline (optional)"
        value={content.headline ?? ""}
        onChange={(e) => onChange({ headline: e.target.value })}
        placeholder="COST ESTIMATE"
      />

      {/* Columns */}
      <div style={sectionStyle}>
        <span style={labelStyle}>COLUMNS</span>
        {content.columns.map((col, i) => (
          <div
            key={i}
            style={{ border: "1px solid rgba(255,255,255,0.1)", padding: 12, display: "flex", flexDirection: "column", gap: 10 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, color: "#555" }}>
                COL {i + 1} — {col.key}
              </span>
              <button
                onClick={() => removeColumn(i)}
                style={{ backgroundColor: "transparent", border: "none", color: "#555", cursor: "pointer", fontSize: 14, padding: 0 }}
              >
                ✕
              </button>
            </div>
            <Input
              label="Label"
              value={col.label}
              onChange={(e) => updateColumn(i, { label: e.target.value })}
            />
            <Input
              label="Key (no spaces)"
              value={col.key}
              onChange={(e) => updateColumn(i, { key: e.target.value.replace(/\s/g, "_") })}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <Select
                  label="Align"
                  value={col.align}
                  onChange={(e) => updateColumn(i, { align: e.target.value as TableColumn["align"] })}
                  options={ALIGN_OPTIONS}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Select
                  label="Format"
                  value={col.format}
                  onChange={(e) => updateColumn(i, { format: e.target.value as TableColumn["format"] })}
                  options={FORMAT_OPTIONS}
                />
              </div>
            </div>
            <Input
              label="Width %"
              type="number"
              value={String(col.width)}
              onChange={(e) => updateColumn(i, { width: Math.max(5, parseInt(e.target.value) || 10) })}
            />
          </div>
        ))}
        <Button variant="secondary" size="sm" onClick={addColumn}>+ ADD COLUMN</Button>
      </div>

      {/* Rows */}
      <div style={sectionStyle}>
        <span style={labelStyle}>DATA ROWS</span>
        {content.rows.map((row, ri) => (
          <div
            key={ri}
            style={{ border: "1px solid rgba(255,255,255,0.08)", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, color: "#555" }}>ROW {ri + 1}</span>
              <button
                onClick={() => removeRow(ri)}
                style={{ backgroundColor: "transparent", border: "none", color: "#555", cursor: "pointer", fontSize: 14, padding: 0 }}
              >
                ✕
              </button>
            </div>
            {content.columns.map((col) => (
              <Input
                key={col.key}
                label={col.label}
                value={String(row[col.key] ?? "")}
                onChange={(e) => updateRow(ri, col.key, e.target.value)}
              />
            ))}
          </div>
        ))}
        <Button variant="secondary" size="sm" onClick={addRow}>+ ADD ROW</Button>
      </div>

      {/* Footer options */}
      <div style={sectionStyle}>
        <span style={labelStyle}>OPTIONS</span>
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={content.show_total_row}
            onChange={(e) => onChange({ show_total_row: e.target.checked })}
            style={{ accentColor: "#2D2DFF" }}
          />
          <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 13, color: "#CCCCCC" }}>
            Show total row
          </span>
        </label>
        {content.show_total_row && (
          <Select
            label="Total column"
            value={content.total_column ?? ""}
            onChange={(e) => onChange({ total_column: e.target.value })}
            options={[{ value: "", label: "— none —" }, ...content.columns.map((c) => ({ value: c.key, label: c.label }))]}
          />
        )}
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={content.highlight_last_column}
            onChange={(e) => onChange({ highlight_last_column: e.target.checked })}
            style={{ accentColor: "#2D2DFF" }}
          />
          <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 13, color: "#CCCCCC" }}>
            Highlight last column
          </span>
        </label>
        <Input
          label="Currency symbol"
          value={content.currency_symbol ?? "$"}
          onChange={(e) => onChange({ currency_symbol: e.target.value })}
          placeholder="$"
        />
      </div>
    </div>
  );
}
