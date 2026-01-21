import { forwardRef } from 'react';
import { User } from 'lucide-react';

const Avatar = forwardRef(({
  src,
  alt = 'Avatar',
  size = 'md',
  status,
  fallback,
  className = '',
  ...props
}, ref) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
    '2xl': 'w-24 h-24 text-4xl',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  const sizeClass = sizes[size] || sizes.md;
  const statusSizeClass = statusSizes[size] || statusSizes.md;
  const statusColorClass = status ? statusColors[status] || statusColors.offline : '';

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div ref={ref} className={`relative inline-block ${className}`} {...props}>
      <div 
        className={`
          ${sizeClass} 
          rounded-full overflow-hidden
          bg-gradient-to-br from-indigo-500 to-purple-600
          flex items-center justify-center
          text-white font-semibold
          ring-2 ring-white dark:ring-gray-800
          shadow-md
        `}
      >
        {src ? (
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : fallback ? (
          <span>{getInitials(fallback)}</span>
        ) : (
          <User className="w-1/2 h-1/2" />
        )}
      </div>

      {/* Status Indicator */}
      {status && (
        <span 
          className={`
            absolute bottom-0 right-0
            ${statusSizeClass}
            ${statusColorClass}
            rounded-full
            ring-2 ring-white dark:ring-gray-800
          `}
        />
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;
