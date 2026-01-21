import { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2, X } from 'lucide-react';

const Input = forwardRef(({ 
  label, 
  error, 
  success,
  helperText,
  icon,
  iconPosition = 'left',
  type = 'text',
  variant = 'default',
  size = 'md',
  className = '',
  floatingLabel = false,
  clearable = false,
  maxLength,
  showCounter = false,
  onClear,
  value,
  onChange,
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState('');

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const currentValue = value !== undefined ? value : internalValue;
  const hasValue = currentValue && currentValue.length > 0;

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(e);
    } else {
      setInternalValue(newValue);
    }
  };

  const handleClear = () => {
    const syntheticEvent = { target: { value: '' } };
    if (onChange) {
      onChange(syntheticEvent);
    } else {
      setInternalValue('');
    }
    if (onClear) {
      onClear();
    }
  };

  const baseStyles = `
    w-full border transition-all duration-200 
    focus:outline-none 
    disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50
    dark:disabled:bg-gray-800
  `;
  
  const variants = {
    default: `
      border-gray-300 bg-white text-gray-900
      focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
      dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100
      dark:focus:border-indigo-400 dark:focus:ring-indigo-900/50
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/50' : ''}
      ${success ? 'border-green-500 focus:border-green-500 focus:ring-green-200 dark:focus:ring-green-900/50' : ''}
    `,
    filled: `
      border-transparent bg-gray-100 text-gray-900
      focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
      dark:bg-gray-700 dark:text-gray-100
      dark:focus:bg-gray-800 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/50
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
      ${success ? 'border-green-500 focus:border-green-500 focus:ring-green-200' : ''}
    `,
    glass: `
      bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 
      focus:border-white/40 focus:ring-white/20
    `,
    neumorphic: `
      border-transparent bg-gray-100 text-gray-900
      shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.9)]
      focus:shadow-[inset_6px_6px_12px_rgba(163,177,198,0.5),inset_-6px_-6px_12px_rgba(255,255,255,1)]
    `,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-base rounded-lg',
    lg: 'px-5 py-3 text-lg rounded-xl',
  };

  const variantClass = variants[variant] || variants.default;
  const sizeClass = sizes[size] || sizes.md;

  const paddingClass = icon && iconPosition === 'left' ? 'pl-11' : icon && iconPosition === 'right' ? 'pr-11' : '';
  const passwordPadding = isPassword ? 'pr-11' : '';
  const clearablePadding = clearable && hasValue ? 'pr-11' : '';

  return (
    <div className="w-full">
      {/* Static Label (non-floating) */}
      {label && !floatingLabel && (
        <label className={`
          block text-sm font-medium mb-2 transition-colors
          ${variant === 'glass' ? 'text-white' : isFocused ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'}
          ${error ? 'text-red-600 dark:text-red-400' : ''} 
          ${success ? 'text-green-600 dark:text-green-400' : ''}
        `}>
          {label}
          {maxLength && showCounter && (
            <span className="ml-2 text-xs text-gray-400">
              {currentValue?.length || 0}/{maxLength}
            </span>
          )}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <span className={`
            absolute left-3 top-1/2 -translate-y-1/2 transition-colors
            ${variant === 'glass' ? 'text-white/60' : isFocused ? 'text-indigo-500' : 'text-gray-400'}
            ${error ? 'text-red-500' : ''}
            ${success ? 'text-green-500' : ''}
          `}>
            {icon}
          </span>
        )}

        {/* Floating Label */}
        {label && floatingLabel && (
          <label className={`
            absolute left-3 transition-all duration-200 pointer-events-none
            ${icon && iconPosition === 'left' ? 'left-11' : 'left-3'}
            ${isFocused || hasValue 
              ? 'top-0 -translate-y-1/2 text-xs bg-white dark:bg-gray-800 px-1' 
              : 'top-1/2 -translate-y-1/2 text-base'
            }
            ${variant === 'glass' ? 'text-white bg-transparent' : isFocused ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}
            ${error ? 'text-red-600 dark:text-red-400' : ''} 
            ${success ? 'text-green-600 dark:text-green-400' : ''}
          `}>
            {label}
          </label>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          type={inputType}
          value={currentValue}
          onChange={handleChange}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`${baseStyles} ${variantClass} ${sizeClass} ${paddingClass} ${passwordPadding} ${clearablePadding} ${className}`}
          {...props}
        />

        {/* Clear Button */}
        {clearable && hasValue && !isPassword && (
          <button
            type="button"
            onClick={handleClear}
            className={`
              absolute right-3 top-1/2 -translate-y-1/2 
              ${variant === 'glass' ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}
              transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700
            `}
            tabIndex={-1}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`
              absolute right-3 top-1/2 -translate-y-1/2 
              ${variant === 'glass' ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}
              transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700
            `}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}

        {/* Right Icon (non-password) */}
        {icon && iconPosition === 'right' && !isPassword && !clearable && (
          <span className={`
            absolute right-3 top-1/2 -translate-y-1/2 transition-colors
            ${variant === 'glass' ? 'text-white/60' : isFocused ? 'text-indigo-500' : 'text-gray-400'}
            ${error ? 'text-red-500' : ''}
            ${success ? 'text-green-500' : ''}
          `}>
            {icon}
          </span>
        )}

        {/* Success/Error Icons */}
        {!isPassword && !icon && success && (
          <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-3 top-1/2 -translate-y-1/2" />
        )}
        {!isPassword && !icon && error && (
          <AlertCircle className="w-5 h-5 text-red-500 absolute right-3 top-1/2 -translate-y-1/2" />
        )}

        {/* Focus Ring Indicator */}
        {isFocused && variant !== 'glass' && variant !== 'neumorphic' && (
          <div className="absolute inset-0 rounded-lg pointer-events-none transition-all duration-200">
            <div className="absolute inset-0 rounded-lg bg-indigo-500/5 animate-pulse" />
          </div>
        )}
      </div>

      {/* Helper Text / Error / Success Message */}
      {(helperText || error || success) && (
        <div className={`mt-2 text-sm flex items-start gap-1.5 ${
          error ? 'text-red-600 dark:text-red-400' : success ? 'text-green-600 dark:text-green-400' : variant === 'glass' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {error && <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
          {success && !error && <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />}
          <span>{error || success || helperText}</span>
        </div>
      )}

      {/* Character Counter (bottom position) */}
      {maxLength && showCounter && !label && (
        <div className="mt-1 text-xs text-right text-gray-400 dark:text-gray-500">
          {currentValue?.length || 0}/{maxLength}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;