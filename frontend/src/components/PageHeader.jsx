import { motion } from 'framer-motion';

export default function PageHeader({ title, subtitle, actions, gradient = 'indigo' }) {
  const gradients = {
    indigo: 'from-indigo-600 via-purple-600 to-blue-600',
    purple: 'from-purple-600 via-pink-600 to-rose-600',
    green: 'from-green-500 via-emerald-600 to-teal-600',
    orange: 'from-orange-500 via-amber-600 to-yellow-500',
  };

  const gradientClass = gradients[gradient] || gradients.indigo;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent mb-2`}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 text-lg">{subtitle}</p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
      
      {/* Decorative line */}
      <div className="mt-6 h-1 w-24 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full"></div>
    </motion.div>
  );
}
