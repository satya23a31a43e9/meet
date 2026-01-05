
import React from 'react';

interface InfoSectionProps {
  title: string;
  items: string[];
  icon: React.ReactNode;
  emptyText?: string;
  variant?: 'default' | 'danger' | 'success';
}

export const InfoSection: React.FC<InfoSectionProps> = ({ 
  title, 
  items, 
  icon, 
  emptyText = "Nothing to display",
  variant = 'default'
}) => {
  const variantStyles = {
    default: "border-slate-200",
    danger: "border-rose-100 bg-rose-50/30",
    success: "border-emerald-100 bg-emerald-50/30",
  };

  const iconStyles = {
    default: "text-indigo-500",
    danger: "text-rose-500",
    success: "text-emerald-500",
  };

  return (
    <div className={`bg-white rounded-xl border shadow-sm p-6 ${variantStyles[variant]}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className={iconStyles[variant]}>{icon}</span>
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
      <ul className="space-y-3">
        {items.length === 0 ? (
          <li className="text-slate-400 italic text-sm">{emptyText}</li>
        ) : (
          items.map((item, idx) => (
            <li key={idx} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0"></span>
              {item}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
