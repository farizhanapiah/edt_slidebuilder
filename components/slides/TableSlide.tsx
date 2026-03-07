import { PixelGrid } from "@/components/ui/PixelGrid";
import type { TableContent, TableColumn } from "@/types/slide";

interface Props {
  content: TableContent;
  isExport?: boolean;
}

function formatCell(
  value: string | number,
  col: TableColumn,
  currencySymbol: string
): string {
  if (col.format === "currency") {
    const num = typeof value === "number" ? value : parseFloat(String(value)) || 0;
    return `${currencySymbol}${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (col.format === "number") {
    const num = typeof value === "number" ? value : parseFloat(String(value)) || 0;
    return num.toLocaleString("en-US");
  }
  if (col.format === "percentage") {
    return `${value}%`;
  }
  return String(value ?? "");
}

function computeTotal(
  rows: Record<string, string | number>[],
  key: string
): number {
  return rows.reduce((sum, row) => {
    const v = row[key];
    return sum + (typeof v === "number" ? v : parseFloat(String(v)) || 0);
  }, 0);
}

export function TableSlide({ content, isExport }: Props) {
  const {
    headline,
    eyebrow,
    columns,
    rows,
    show_total_row,
    total_column,
    currency_symbol = "$",
    highlight_last_column,
  } = content;

  const animate = !isExport;
  const lastColKey = columns[columns.length - 1]?.key;

  const CELL_H = 48;
  const HEADER_H = 44;
  const hasHeader = !!(headline || eyebrow);
  const topPad = 60;
  const headerBlockH = hasHeader ? 130 : 0;
  const tableTop = topPad + headerBlockH;
  const tableMaxH = 720 - tableTop - 48;

  // Single grid template from column widths — guarantees perfect column alignment
  // Guard against undefined/null/0 widths (e.g. from AI-generated content)
  const gridCols = columns.map((c) => `${Number(c.width) || 1}fr`).join(" ");

  const isMonoFont = (col: TableColumn) =>
    col.format === "currency" || col.format === "number";

  return (
    <div
      className="slide-base"
      style={{ backgroundColor: "#0A0A0A", position: "relative", overflow: "hidden" }}
    >
      <PixelGrid opacity={0.05} />

      {/* Left blue bar */}
      <div
        className={animate ? "anim-bar-in anim-d-0" : ""}
        style={{
          position: "absolute",
          left: 0, top: 0, bottom: 0,
          width: 6,
          backgroundColor: "#2D2DFF",
          zIndex: 3,
        }}
      />

      {/* Slide header */}
      {hasHeader && (
        <div
          style={{
            position: "absolute",
            top: topPad,
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
                display: "block",
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
                fontSize: 48,
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
          <div
            className={animate ? "anim-fade-up anim-d-2" : ""}
            style={{
              height: 1,
              backgroundColor: "rgba(255,255,255,0.15)",
              width: 48,
              marginTop: 4,
            }}
          />
        </div>
      )}

      {/* ── Table — single CSS grid, all rows share the same column tracks ── */}
      <div
        style={{
          position: "absolute",
          top: tableTop,
          left: 88,
          right: 80,
          zIndex: 2,
          overflow: "hidden",
          maxHeight: tableMaxH,
          display: "grid",
          gridTemplateColumns: gridCols,
          // Row heights: header row, then data rows, then (optional) total row
          gridTemplateRows: [
            `${HEADER_H}px`,
            ...rows.map(() => `${CELL_H}px`),
            ...(show_total_row && total_column ? [`${CELL_H + 4}px`] : []),
          ].join(" "),
          alignItems: "stretch",
        }}
      >
        {/* ── Header cells ── */}
        {columns.map((col) => (
          <div
            key={`h-${col.key}`}
            className={animate ? "anim-fade-up" : ""}
            style={
              {
                "--anim-delay": "160ms",
                display: "flex",
                alignItems: "center",
                padding: "0 14px",
                backgroundColor: "#2D2DFF",
                borderBottom: "2px solid rgba(255,255,255,0.2)",
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                justifyContent:
                  col.align === "right"
                    ? "flex-end"
                    : col.align === "center"
                    ? "center"
                    : "flex-start",
              } as React.CSSProperties
            }
          >
            {col.label}
          </div>
        ))}

        {/* ── Data cells ── */}
        {rows.map((row, ri) => {
          const isEven = ri % 2 === 0;
          const delayMs = Math.min((ri + 3) * 80, 960);
          return columns.map((col) => {
            const isLast = col.key === lastColKey;
            const cellValue = formatCell(row[col.key] ?? "", col, currency_symbol);
            return (
              <div
                key={`${ri}-${col.key}`}
                className={animate ? "anim-fade-up" : ""}
                style={
                  {
                    "--anim-delay": `${delayMs}ms`,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 14px",
                    backgroundColor: isEven ? "#0F0F0F" : "#0A0A0A",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    fontFamily: isMonoFont(col)
                      ? '"Space Grotesk", monospace'
                      : '"Space Grotesk", sans-serif',
                    fontSize: 15,
                    fontWeight: highlight_last_column && isLast ? 700 : 400,
                    color:
                      highlight_last_column && isLast ? "#FFFFFF" : "#CCCCCC",
                    justifyContent:
                      col.align === "right"
                        ? "flex-end"
                        : col.align === "center"
                        ? "center"
                        : "flex-start",
                    letterSpacing: isMonoFont(col) ? "0.02em" : undefined,
                  } as React.CSSProperties
                }
              >
                {cellValue}
              </div>
            );
          });
        })}

        {/* ── Total cells ── */}
        {show_total_row &&
          total_column &&
          columns.map((col, ci) => {
            const isLast = col.key === lastColKey;
            const isTotalCol = col.key === total_column;
            const isFirstCol = ci === 0;
            const delayMs = Math.min((rows.length + 3) * 80, 960);

            let cellContent = "";
            if (isTotalCol) {
              const sum = computeTotal(rows, total_column);
              cellContent = formatCell(sum, col, currency_symbol);
            } else if (isFirstCol) {
              cellContent = "TOTAL";
            }

            return (
              <div
                key={`total-${col.key}`}
                className={animate ? "anim-fade-up" : ""}
                style={
                  {
                    "--anim-delay": `${delayMs}ms`,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 14px",
                    backgroundColor: "#111",
                    borderTop: "2px solid rgba(255,255,255,0.25)",
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: isFirstCol ? 11 : 16,
                    fontWeight: 700,
                    color: isTotalCol || isLast ? "#FFFFFF" : "#8C8C8C",
                    justifyContent: isFirstCol
                      ? "flex-start"
                      : col.align === "right"
                      ? "flex-end"
                      : col.align === "center"
                      ? "center"
                      : "flex-start",
                    letterSpacing: isFirstCol ? "0.1em" : "0.02em",
                    textTransform: isFirstCol ? "uppercase" : undefined,
                  } as React.CSSProperties
                }
              >
                {cellContent}
              </div>
            );
          })}
      </div>
    </div>
  );
}
