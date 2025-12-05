import React from 'react';

/**
 * Angle mode for trigonometric calculations.
 * DEG = degrees (0-360), RAD = radians (0-2π)
 */
export type AngleMode = 'DEG' | 'RAD';

/**
 * Keypad tab modes for different button layouts.
 */
export type TabMode = 'MAIN' | 'ABC' | 'FUNC';

/**
 * Output format for calculation results.
 */
export type OutputFormat = 'decimal' | 'fraction';

/**
 * Output format constants for type safety.
 */
export const OUTPUT_FORMATS = {
  DECIMAL: 'decimal' as const,
  FRACTION: 'fraction' as const,
} as const;

/**
 * Represents a single calculation entry in the history.
 */
export interface HistoryItem {
  /** Unique identifier for the history entry */
  id: string;
  /** The mathematical expression in LaTeX format */
  expression: string;
  /** The calculated result, null if not computed */
  result: string | null;
  /** Whether the calculation resulted in an error */
  isError: boolean;
}

/**
 * Button visual variants for styling.
 */
export enum ButtonVariant {
  /** Default button style */
  DEFAULT = 'DEFAULT',
  /** Blue accent button (e.g., Enter) */
  BLUE = 'BLUE',
  /** Dark button for numbers */
  DARK = 'DARK',
  /** Light button for functions/operators */
  LIGHT = 'LIGHT',
}

/**
 * Configuration for a keypad button.
 */
export interface KeyConfig {
  /** Display label for the button */
  label: string;
  /** Command to execute when pressed */
  command: string;
  /** Visual variant style */
  variant?: ButtonVariant;
  /** Custom React node to display instead of label */
  display?: React.ReactNode;
  /** Grid column span for layout */
  span?: number;
}
