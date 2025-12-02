import React from 'react';

export type AngleMode = 'DEG' | 'RAD';
export type TabMode = 'MAIN' | 'ABC' | 'FUNC';

export interface HistoryItem {
  id: string;
  expression: string; // Stored as LaTeX
  result: string | null;
  isError: boolean;
}

export enum ButtonVariant {
  DEFAULT = 'DEFAULT',
  BLUE = 'BLUE',
  DARK = 'DARK', // Numbers
  LIGHT = 'LIGHT', // Functions
}

export interface KeyConfig {
  label: string;
  command: string;
  variant?: ButtonVariant;
  display?: React.ReactNode;
  span?: number; // Grid column span
}
