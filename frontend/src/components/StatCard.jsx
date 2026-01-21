import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  color = 'indigo',
  delay = 0 
}) {
  const colorClasses = {
    indigo: 'from-indigo-500 to-blue-600',
    purple: 'from-purple-500 to-pink-600',
    green: 'from-green-500 to-emerald-600',
    orange: 'from-orange-500 to-amber-600',
    red: 'from-red-500 to-rose-600',
    cyan: 'from-cyan-500 to-blue-600',
  };

  const bgClasses = {
    indigo: 'bg-indigo-50',
    purple: 'bg-purple-50',
    green: 'bg-green-50',
    orange: 'bg-orange-50',
    red: 'bg-red-50',
    cyan: 'bg-cyan-50',
  };

  const iconBgClasses = {
    indigo: 'from-indigo-600 to-blue-600',
    purple: 'from-purple-600 to-pink-600',
    green: 'from-green-500 to-emerald-600',
    orange: 'from-orange-500 to-amber-600',
    red: 'from-red-500 to-rose-600',
    cyan: 'from-cyan-500 to-blue-600',
  };

  const gradientClass = colorClasses[color] || colorClasses.indigo;
  const bgClass = bgClasses[color] || bgClasses.indigo;
  const iconGradient = iconBgClasses[color] || iconBgClasses.indigo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative group"
    >
      {/* Card */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 overflow-hidden h-full relative transition-shadow duration-300 group-hover:shadow-xl">
        {/* Gradient Accent */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientClass}`}></div>
        
        {/* Background Pattern */}
        <div className={`absolute inset-0 opacity-[0.02] ${bgClass}`}
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            </div>
            
            {/* Icon */}
            <div className={`p-3 rounded-xl bg-gradient-to-br ${iconGradient} shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Trend */}
          {trend && trendValue && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              {trend === 'up' ? (
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">+{trendValue}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm font-semibold">-{trendValue}</span>
                </div>
              )}
              <span className="text-xs text-gray-500">vs last period</span>
            </div>
          )}
        </div>

        {/* Hover Glow Effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      </div>
    </motion.div>
  );
}
