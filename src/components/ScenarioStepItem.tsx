import React from 'react';
import CareSceneIllustration, { IllustrationType } from './CareSceneIllustration';

interface ScenarioStepItemProps {
  number: number;
  type: IllustrationType;
  title: string;
  description: string;
}

export default function ScenarioStepItem({ number, type, title, description }: ScenarioStepItemProps) {
  const getTheme = (num: number) => {
    const safeNum = ((num - 1) % 4) + 1;
    switch (safeNum) {
      case 1:
        return {
          bg: 'bg-purple-50/40',
          border: 'border-purple-200/80',
          badgeBg: 'bg-purple-600',
          sideBorder: 'border-l-4 border-l-purple-600',
          illustBg: 'bg-purple-100/50'
        };
      case 2:
        return {
          bg: 'bg-sky-50/40',
          border: 'border-sky-200/80',
          badgeBg: 'bg-sky-600',
          sideBorder: 'border-l-4 border-l-sky-600',
          illustBg: 'bg-sky-100/50'
        };
      case 3:
        return {
          bg: 'bg-teal-50/40',
          border: 'border-teal-200/80',
          badgeBg: 'bg-teal-650',
          sideBorder: 'border-l-4 border-l-teal-600',
          illustBg: 'bg-teal-100/50'
        };
      case 4:
      default:
        return {
          bg: 'bg-orange-50/40',
          border: 'border-orange-200/80',
          badgeBg: 'bg-orange-600',
          sideBorder: 'border-l-4 border-l-orange-600',
          illustBg: 'bg-orange-100/50'
        };
    }
  };

  const theme = getTheme(number);

  return (
    <div className={`flex flex-col sm:flex-row items-stretch bg-white border ${theme.border} ${theme.sideBorder} rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 w-full max-w-2xl mx-auto`}>
      {/* Left Area: Step Number Badge & Illustration */}
      <div className={`w-full sm:w-44 ${theme.bg} p-4 shrink-0 border-b sm:border-b-0 sm:border-r border-slate-100 flex flex-col justify-between items-center gap-3`}>
        {/* Step Number Badge */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className={`w-7 h-7 rounded-full ${theme.badgeBg} text-white flex items-center justify-center font-black text-sm shadow-sm`}>
            {number}
          </span>
        </div>

        {/* Visual Illustration */}
        <div className={`w-full p-1 rounded-xl ${theme.illustBg}`}>
          <CareSceneIllustration type={type} size="sm" />
        </div>
      </div>

      {/* Right Area: Text Description Info */}
      <div className="flex-1 p-6 flex flex-col justify-center text-left space-y-2">
        <h4 className="text-xl font-black text-slate-800 leading-snug">
          {title}
        </h4>
        <p className="text-base text-slate-600 font-semibold leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
