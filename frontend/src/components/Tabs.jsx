import { useState } from 'react';

export default function Tabs({
  tabs,
  defaultTab = 0,
  onChange,
  variant = 'default',
  className = '',
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (index) => {
    setActiveTab(index);
    if (onChange) onChange(index);
  };

  const variants = {
    default: {
      container: 'border-b border-gray-200 dark:border-gray-700',
      tab: 'px-4 py-2 text-sm font-medium transition-colors',
      active: 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400',
      inactive: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
    },
    pills: {
      container: 'bg-gray-100 dark:bg-gray-800 p-1 rounded-lg',
      tab: 'px-4 py-2 text-sm font-medium rounded-md transition-all',
      active: 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm',
      inactive: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
    },
    underline: {
      container: 'border-b-2 border-gray-200 dark:border-gray-700',
      tab: 'px-6 py-3 text-sm font-medium transition-all relative',
      active: 'text-indigo-600 dark:text-indigo-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600',
      inactive: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
    },
    buttons: {
      container: 'flex gap-2',
      tab: 'px-6 py-2.5 text-sm font-medium rounded-lg transition-all',
      active: 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md',
      inactive: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700',
    },
  };

  const variantStyles = variants[variant] || variants.default;

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className={`flex ${variantStyles.container}`}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabChange(index)}
            className={`
              ${variantStyles.tab}
              ${activeTab === index ? variantStyles.active : variantStyles.inactive}
            `}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
            {tab.badge && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
}
