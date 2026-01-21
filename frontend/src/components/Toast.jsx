import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: 'from-green-500 to-emerald-600',
    error: 'from-red-500 to-rose-600',
    warning: 'from-amber-500 to-orange-600',
    info: 'from-blue-500 to-indigo-600',
  };

  const bgColors = {
    success: 'bg-green-50',
    error: 'bg-red-50',
    warning: 'bg-amber-50',
    info: 'bg-blue-50',
  };

  const Icon = icons[type] || icons.success;
  const gradientClass = colors[type] || colors.success;
  const bgClass = bgColors[type] || bgColors.success;

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        className={`${bgClass} border-l-4 rounded-xl shadow-xl p-4 flex items-start gap-3 max-w-md backdrop-blur-sm`}
        style={{ borderLeftColor: `var(--color-${type === 'success' ? 'success' : type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'info'})` }}
      >
        <div className={`p-2 rounded-lg bg-gradient-to-br ${gradientClass} flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        
        <p className="text-sm font-medium text-gray-900 flex-1 pt-1">{message}</p>
        
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
