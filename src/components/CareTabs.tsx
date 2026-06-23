import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TabItem {
  readonly id: string;
  readonly name: string;
  readonly icon: LucideIcon;
}

interface CareTabsProps {
  tabs: readonly TabItem[];
  activeTab: string;
  onChange: (id: any) => void;
  isSimple?: boolean;
}

export default function CareTabs({ tabs, activeTab, onChange, isSimple = false }: CareTabsProps) {
  return (
    <nav 
      aria-label="돌봄 로봇 학습 탭 메뉴" 
      className="flex overflow-x-auto w-full max-w-full gap-2.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50 mb-8 scrollbar-none items-center shadow-inner"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            role="tab"
            aria-selected={isActive}
            className={`flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl transition-all cursor-pointer flex-1 text-center border-none select-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              isSimple ? 'text-lg font-black' : 'text-sm font-bold'
            } ${
              isActive
                ? 'bg-indigo-700 text-white shadow-md font-black ring-2 ring-indigo-300 ring-offset-1'
                : 'text-slate-600 hover:text-slate-800 hover:bg-white/50 font-bold'
            }`}
          >
            <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[3]' : 'stroke-[2]'}`} />
            <span>{tab.name}</span>
          </button>
        );
      })}
    </nav>
  );
}
