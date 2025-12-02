import React from 'react';
import { ButtonVariant } from '../types';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  display?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = ButtonVariant.LIGHT,
  display,
  className = "",
  disabled = false,
  style = {},
  onMouseEnter,
  onMouseLeave
}) => {

  let baseClasses = "relative flex items-center justify-center rounded select-none text-lg active:scale-[0.98] transition-transform touch-manipulation";

  // Desmos-like styling with CSS variables
  let variantStyles: React.CSSProperties = {};
  let variantClasses = "";

  switch (variant) {
    case ButtonVariant.BLUE:
      variantStyles = {
        backgroundColor: '#2f72dc',
        color: 'white',
        boxShadow: '0 2px 0 #1e4c9a'
      };
      variantClasses = "hover:bg-[#2862bd] active:shadow-none active:translate-y-[2px]";
      break;
    case ButtonVariant.DARK:
      variantStyles = {
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        borderColor: 'var(--border-primary)',
        borderWidth: '1px',
        boxShadow: '0 1px 0 rgba(0,0,0,0.1)'
      };
      variantClasses = "hover:brightness-95 active:shadow-none active:brightness-90";
      break;
    case ButtonVariant.LIGHT:
      variantStyles = {
        backgroundColor: 'var(--operation-button-bg)',
        color: 'var(--operation-button-text)',
        borderColor: 'var(--border-primary)',
        borderWidth: '1px',
        boxShadow: '0 1px 0 rgba(0,0,0,0.1)'
      };
      variantClasses = "hover:brightness-95 active:shadow-none active:brightness-90";
      break;
    case ButtonVariant.DEFAULT:
    default:
      variantStyles = {
        backgroundColor: 'var(--button-active)',
        color: 'var(--text-secondary)'
      };
      variantClasses = "hover:brightness-95";
      break;
  }

  if (disabled) {
    variantClasses += " opacity-50 cursor-not-allowed active:scale-100 active:shadow-auto active:translate-y-0";
  }

  return (
    <button
      onMouseDown={(e) => e.preventDefault()} // CRITICAL: Prevents button from stealing focus from MathField
      onClick={disabled ? undefined : onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={{ ...variantStyles, ...style }}
      aria-label={label}
    >
      {display || label}
    </button>
  );
};

export default Button;