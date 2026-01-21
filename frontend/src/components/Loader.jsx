export default function Loader({ fullScreen = true, size = 'md', message = '' }) {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
    xl: 'w-24 h-24 border-4',
  };

  const loaderSize = sizes[size] || sizes.md;

  const loader = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Spinning Gradient Ring */}
      <div className="relative">
        <div className={`${loaderSize} border-gray-200 border-t-transparent rounded-full animate-spin`}></div>
        <div className={`absolute inset-0 ${loaderSize} border-transparent border-t-indigo-600 rounded-full animate-spin`} style={{ animationDuration: '1s' }}></div>
      </div>

      {/* Pulsing Dots */}
      <div className="flex gap-2">
        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>

      {/* Loading Message */}
      {message && (
        <p className="text-sm font-medium text-gray-600 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        {loader}
      </div>
    );
  }

  return loader;
}