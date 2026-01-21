import { forwardRef } from 'react';

const Progress = forwardRef(({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  label,
  className = '',
  ...props
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6',
  };

  const variants = {
    default: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-600',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600',
    info: 'bg-gradient-to-r from-blue-500 to-cyan-600',
  };

  const sizeClass = sizes[size] || sizes.md;
  const variantClass = variants[variant] || variants.default;

  return (
    <div ref={ref} className={className} {...props}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showLabel && (
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`
        w-full ${sizeClass} 
        bg-gray-200 dark:bg-gray-700 
        rounded-full overflow-hidden
      `}>
        <div
          className={`
            ${sizeClass} ${variantClass}
            rounded-full transition-all duration-500 ease-out
            relative overflow-hidden
          `}
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer effect */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
            style={{
              backgroundSize: '200% 100%',
            }}
          />
        </div>
      </div>
    </div>
  );
});

Progress.displayName = 'Progress';

export default Progress;

// Circular Progress Component
export function CircularProgress({
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = 'default',
  showLabel = true,
  label,
  className = '',
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const variants = {
    default: 'stroke-indigo-600',
    success: 'stroke-green-500',
    warning: 'stroke-amber-500',
    danger: 'stroke-red-500',
    info: 'stroke-blue-500',
  };

  const variantClass = variants[variant] || variants.default;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={variantClass}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 0.5s ease-out',
          }}
        />
      </svg>
      
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {Math.round(percentage)}%
          </span>
          {label && (
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
