import { forwardRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  icon,
  iconPosition = 'left',
  className = '',
  fullWidth = false,
  rounded = 'lg',
  withRipple = true,
  withShadow = true,
  ...props 
}, ref) => {
  const [ripples, setRipples] = useState([]);

  const createRipple = (e) => {
    if (!withRipple || disabled || loading) return;
    
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const newRipple = { x, y, size, id: Date.now() };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  };

  const baseStyles = `
    inline-flex items-center justify-center font-medium 
    transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed 
    relative overflow-hidden group
    active:scale-95
  `;
  
  const variants = {
    primary: `
      bg-gradient-to-r from-indigo-600 to-blue-600 text-white 
      hover:from-indigo-700 hover:to-blue-700 
      focus:ring-indigo-500 
      ${withShadow ? 'shadow-md hover:shadow-lg hover:-translate-y-0.5' : ''}
    `,
    secondary: `
      bg-gradient-to-r from-purple-600 to-pink-600 text-white 
      hover:from-purple-700 hover:to-pink-700 
      focus:ring-purple-500 
      ${withShadow ? 'shadow-md hover:shadow-lg hover:-translate-y-0.5' : ''}
    `,
    success: `
      bg-gradient-to-r from-green-500 to-emerald-600 text-white 
      hover:from-green-600 hover:to-emerald-700 
      focus:ring-green-500 
      ${withShadow ? 'shadow-md hover:shadow-lg hover:-translate-y-0.5' : ''}
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-rose-600 text-white 
      hover:from-red-600 hover:to-rose-700 
      focus:ring-red-500 
      ${withShadow ? 'shadow-md hover:shadow-lg hover:-translate-y-0.5' : ''}
    `,
    warning: `
      bg-gradient-to-r from-amber-500 to-orange-600 text-white 
      hover:from-amber-600 hover:to-orange-700 
      focus:ring-amber-500 
      ${withShadow ? 'shadow-md hover:shadow-lg hover:-translate-y-0.5' : ''}
    `,
    outline: `
      border-2 border-indigo-600 text-indigo-600 bg-white
      hover:bg-indigo-50 
      focus:ring-indigo-500
      dark:bg-gray-800 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-gray-700
    `,
    ghost: `
      text-gray-700 bg-transparent
      hover:bg-gray-100 
      focus:ring-gray-400
      dark:text-gray-300 dark:hover:bg-gray-800
    `,
    glass: `
      bg-white/10 backdrop-blur-xl border border-white/20 text-white 
      hover:bg-white/20 
      focus:ring-white/50
      ${withShadow ? 'shadow-lg' : ''}
    `,
    gradient: `
      bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
      bg-size-200 bg-pos-0 text-white
      hover:bg-pos-100
      focus:ring-purple-500
      ${withShadow ? 'shadow-md hover:shadow-xl hover:-translate-y-0.5' : ''}
      transition-all duration-500
    `,
    neumorphic: `
      bg-gray-100 text-gray-700
      shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]
      hover:shadow-[inset_9px_9px_16px_rgba(163,177,198,0.6),inset_-9px_-9px_16px_rgba(255,255,255,0.5)]
      focus:ring-gray-400
    `,
  };

  const sizes = {
    xs: 'px-2.5 py-1 text-xs gap-1',
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
    xl: 'px-8 py-4 text-xl gap-3',
  };

  const roundedOptions = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;
  const roundedClass = roundedOptions[rounded] || roundedOptions.lg;
  const widthClass = fullWidth ? 'w-full' : '';
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={`${baseStyles} ${variantClass} ${sizeClass} ${roundedClass} ${widthClass} ${className}`}
      onClick={createRipple}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            animation: 'ripple 0.6s ease-out'
          }}
        />
      ))}

      {/* Shimmer effect on hover */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
      
      {/* Content */}
      <span className="relative flex items-center gap-2">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!loading && icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
        {!loading && icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
      </span>
    </button>
  );
});

Button.displayName = 'Button';

export default Button;