import { forwardRef } from 'react';

const Card = forwardRef(({
  children,
  variant = 'default',
  hover = false,
  padding = 'md',
  className = '',
  onClick,
  ...props
}, ref) => {
  const baseStyles = 'rounded-xl overflow-hidden transition-all duration-300';

  const variants = {
    default: `
      bg-white dark:bg-gray-800 
      border border-gray-100 dark:border-gray-700 
      shadow-md
    `,
    gradient: `
      bg-gradient-to-br from-white via-gray-50 to-white
      dark:from-gray-800 dark:via-gray-900 dark:to-gray-800
      border border-gray-100 dark:border-gray-700
      shadow-lg
    `,
    glass: `
      bg-white/10 dark:bg-gray-900/10
      backdrop-blur-xl border border-white/20
      shadow-lg
    `,
    outlined: `
      bg-transparent 
      border-2 border-gray-200 dark:border-gray-700
    `,
    elevated: `
      bg-white dark:bg-gray-800
      shadow-xl hover:shadow-2xl
    `,
    neumorphic: `
      bg-gray-100 dark:bg-gray-800
      shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]
      dark:shadow-[9px_9px_16px_rgba(0,0,0,0.6),-9px_-9px_16px_rgba(55,65,81,0.5)]
    `,
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const hoverStyles = hover || onClick ? `
    cursor-pointer 
    hover:-translate-y-1 hover:shadow-xl 
    hover:border-indigo-200 dark:hover:border-indigo-600
    active:scale-95
  ` : '';

  const variantClass = variants[variant] || variants.default;
  const paddingClass = paddings[padding] || paddings.md;

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`${baseStyles} ${variantClass} ${paddingClass} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// Card Header Component
export const CardHeader = ({ children, className = '', ...props }) => (
  <div 
    className={`mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Card Title Component
export const CardTitle = ({ children, className = '', ...props }) => (
  <h3 
    className={`text-xl font-bold text-gray-900 dark:text-gray-100 ${className}`}
    {...props}
  >
    {children}
  </h3>
);

// Card Description Component
export const CardDescription = ({ children, className = '', ...props }) => (
  <p 
    className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}
    {...props}
  >
    {children}
  </p>
);

// Card Footer Component
export const CardFooter = ({ children, className = '', ...props }) => (
  <div 
    className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
