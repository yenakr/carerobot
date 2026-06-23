import React from 'react';
import { Lock, AlertTriangle, EyeOff, ShieldAlert } from 'lucide-react';

export interface SafetyCheckItem {
  id: string;
  title: string;
  description: string;
  type: 'lock' | 'warning' | 'privacy' | 'obstacle';
}

interface SafetyCheckCardProps {
  items: SafetyCheckItem[];
}

export default function SafetyCheckCard({ items }: SafetyCheckCardProps) {
  const getIcon = (type: SafetyCheckItem['type']) => {
    switch (type) {
      case 'lock':
        return (
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl border border-amber-200 shadow-sm shrink-0">
            <Lock className="w-5 h-5 stroke-[2.5]" />
          </div>
        );
      case 'privacy':
        return (
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl border border-indigo-200 shadow-sm shrink-0">
            <EyeOff className="w-5 h-5 stroke-[2.5]" />
          </div>
        );
      case 'obstacle':
        return (
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl border border-slate-200 shadow-sm shrink-0">
            <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
          </div>
        );
      case 'warning':
      default:
        return (
          <div className="p-3 bg-rose-100 text-rose-600 rounded-xl border border-rose-200 shadow-sm shrink-0">
            <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
          </div>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
      {items.map((item) => (
        <div 
          key={item.id} 
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition-shadow flex gap-4 items-start text-left"
        >
          {getIcon(item.type)}
          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-800 leading-snug">
              {item.title}
            </h4>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
