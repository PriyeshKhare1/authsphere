import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ variant = 'default', className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const variants = {
    default: `
      p-2 rounded-lg
      bg-gray-100 dark:bg-gray-800
      text-gray-700 dark:text-gray-300
      hover:bg-gray-200 dark:hover:bg-gray-700
      transition-all duration-300
    `,
    floating: `
      p-3 rounded-full
      bg-white dark:bg-gray-800
      shadow-lg hover:shadow-xl
      text-gray-700 dark:text-gray-300
      border border-gray-200 dark:border-gray-700
      hover:-translate-y-1
      transition-all duration-300
    `,
    minimal: `
      p-2
      text-gray-600 dark:text-gray-400
      hover:text-gray-900 dark:hover:text-gray-100
      transition-colors duration-300
    `,
  };

  const variantClass = variants[variant] || variants.default;

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative overflow-hidden
        ${variantClass}
        ${className}
      `}
      aria-label="Toggle theme"
    >
      {/* Sun Icon */}
      <Sun 
        className={`
          w-5 h-5 
          transition-all duration-500
          ${isDark ? 'rotate-90 scale-0 absolute' : 'rotate-0 scale-100'}
        `}
      />
      
      {/* Moon Icon */}
      <Moon 
        className={`
          w-5 h-5
          transition-all duration-500
          ${isDark ? 'rotate-0 scale-100' : '-rotate-90 scale-0 absolute'}
        `}
      />
    </button>
  );
}
