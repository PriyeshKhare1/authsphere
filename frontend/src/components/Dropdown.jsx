import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Dropdown({
  trigger,
  children,
  align = 'left',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const alignments = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  const alignClass = alignments[align] || alignments.left;

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className={`
            absolute ${alignClass} mt-2 z-50
            min-w-[200px]
            bg-white dark:bg-gray-800 
            border border-gray-200 dark:border-gray-700
            rounded-xl shadow-xl
            overflow-hidden
            animate-fadeInDown
          `}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// Dropdown Item Component
export function DropdownItem({ 
  children, 
  onClick, 
  icon,
  variant = 'default',
  className = '',
  ...props 
}) {
  const variants = {
    default: 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
    danger: 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400',
    success: 'hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400',
  };

  const variantClass = variants[variant] || variants.default;

  return (
    <button
      onClick={onClick}
      className={`
        w-full px-4 py-2.5
        flex items-center gap-3
        text-sm font-medium
        transition-colors
        ${variantClass}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

// Dropdown Divider Component
export function DropdownDivider() {
  return <div className="my-1 border-t border-gray-200 dark:border-gray-700" />;
}

// Dropdown Header Component
export function DropdownHeader({ children, className = '' }) {
  return (
    <div className={`px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase ${className}`}>
      {children}
    </div>
  );
}
