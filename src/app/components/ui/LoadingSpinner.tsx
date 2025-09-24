// components/LoadingSpinner.tsx
import React from 'react';

export type SpinnerVariant = 'classic' | 'dots' | 'pulse' | 'ring';

export interface LoadingSpinnerProps {
  variant?: SpinnerVariant;
  size?: number;
  color?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  variant = 'classic',
  size = 24,
  color = '#3b82f6', // blue-500
  className = '',
}) => {
  const spinnerStyle = {
    width: size,
    height: size,
  };

  const commonClasses = `inline-block ${className}`;

  const renderSpinner = () => {
    switch (variant) {
      case 'classic':
        return (
          <div
            style={{
              ...spinnerStyle,
              border: `2px solid ${color}20`,
              borderTop: `2px solid ${color}`,
            }}
            className={`rounded-full animate-spin ${commonClasses}`}
          />
        );

      case 'dots':
        return (
          <div 
            style={spinnerStyle} 
            className={`flex justify-between items-center ${commonClasses}`}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  backgroundColor: color,
                  animationDelay: `${i * 0.16}s`,
                }}
                className="w-1/4 h-1/4 rounded-full animate-bounce"
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div
            style={{
              ...spinnerStyle,
              backgroundColor: color,
            }}
            className={`rounded-full animate-pulse ${commonClasses}`}
          />
        );

      case 'ring':
        return (
          <div
            style={{
              ...spinnerStyle,
              border: `2px solid transparent`,
              borderLeft: `2px solid ${color}`,
              borderTop: `2px solid ${color}`,
            }}
            className={`rounded-full animate-spin ${commonClasses}`}
          />
        );

      default:
        return (
          <div
            style={{
              ...spinnerStyle,
              border: `2px solid ${color}20`,
              borderTop: `2px solid ${color}`,
            }}
            className={`rounded-full animate-spin ${commonClasses}`}
          />
        );
    }
  };

  return renderSpinner();
};

export default LoadingSpinner;