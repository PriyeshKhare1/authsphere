export default function Skeleton({ 
  variant = 'text', 
  width,
  height,
  className = '',
  count = 1,
  circle = false,
}) {
  const baseStyles = 'animate-shimmer bg-gray-200 dark:bg-gray-700';
  
  const variants = {
    text: 'h-4 rounded',
    title: 'h-8 rounded',
    avatar: 'w-10 h-10 rounded-full',
    button: 'h-10 rounded-lg',
    card: 'h-32 rounded-xl',
    image: 'aspect-video rounded-lg',
  };

  const variantClass = variants[variant] || variants.text;
  const shapeClass = circle ? 'rounded-full' : '';

  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`${baseStyles} ${variantClass} ${shapeClass} ${className}`}
            style={style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseStyles} ${variantClass} ${shapeClass} ${className}`}
      style={style}
    />
  );
}

// Skeleton Components for common patterns
export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" />
          <Skeleton width="40%" />
        </div>
      </div>
      <Skeleton variant="card" />
      <div className="mt-4 space-y-2">
        <Skeleton count={3} />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton 
          key={index} 
          width={index === lines - 1 ? '70%' : '100%'} 
        />
      ))}
    </div>
  );
}
