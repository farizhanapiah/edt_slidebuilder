"use client";

import { useState, useEffect } from "react";

interface ParsedValue {
  prefix: string;
  number: number;
  suffix: string;
  decimals: number;
}

/** Parse a stat string like "$2.4M", "96%", "24h" into parts */
export function parseStatValue(value: string): ParsedValue {
  const match = value.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!match) return { prefix: "", number: 0, suffix: value, decimals: 0 };
  const num = parseFloat(match[2]);
  const decimals = match[2].includes(".") ? match[2].split(".")[1].length : 0;
  return { prefix: match[1], number: num, suffix: match[3], decimals };
}

/** Format a number back to its display string */
export function formatCountValue(parsed: ParsedValue, current: number): string {
  const formatted =
    parsed.decimals > 0
      ? current.toFixed(parsed.decimals)
      : Math.floor(current).toString();
  return `${parsed.prefix}${formatted}${parsed.suffix}`;
}

/** Easing: ease-out cubic */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Animates a numeric value from 0 to `target` over `duration` ms.
 * Returns the current display string (e.g. "$2.4M" counting up).
 * When `enabled` is false (e.g. isExport), returns the final value immediately.
 */
export function useCountUp(
  rawValue: string,
  duration = 1400,
  enabled = true,
  delay = 0
): string {
  const parsed = parseStatValue(rawValue);
  const [display, setDisplay] = useState(
    enabled ? formatCountValue(parsed, 0) : rawValue
  );

  useEffect(() => {
    if (!enabled) {
      setDisplay(rawValue);
      return;
    }

    // Reset on value change
    setDisplay(formatCountValue(parsed, 0));

    let startTime: number | null = null;
    let raf: number;

    const delayTimer = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const current = eased * parsed.number;
        setDisplay(formatCountValue(parsed, current));
        if (progress < 1) {
          raf = requestAnimationFrame(step);
        } else {
          setDisplay(rawValue); // ensure exact final value
        }
      };
      raf = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(delayTimer);
      cancelAnimationFrame(raf);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawValue, duration, enabled, delay]);

  return display;
}
