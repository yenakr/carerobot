import React from 'react';
import { Trophy, HelpCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import HighlightText from './HighlightText';

interface SimpleResultCardProps {
  recommendation: string;
  reason: string;
  whenToUse: string;
  precautions: string[];
}

export default function SimpleResultCard({
  recommendation,
  reason,
  whenToUse,
  precautions
}: SimpleResultCardProps) {
  return (
    <div className="flex flex-col gap-6 text-left w-full max-w-2xl mx-auto">
      {/* 1. 추천 돌봄로봇 */}
      <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
        <h4 className="text-base font-black text-indigo-800 flex items-center gap-1.5 uppercase tracking-wider">
          <Trophy className="w-5 h-5 text-indigo-650 shrink-0" />
          추천 돌봄로봇
        </h4>
        <p className="text-3xl font-black text-indigo-950 leading-snug">
          <HighlightText text={`*${recommendation}*을 사용할 수 있습니다.`} type="robot" />
        </p>
      </div>

      {/* 2. 왜 추천하나요? */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
        <h4 className="text-base font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
          <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
          왜 추천하나요?
        </h4>
        <p className="text-lg sm:text-xl text-slate-700 leading-relaxed font-bold">
          <HighlightText text={reason} />
        </p>
      </div>

      {/* 3. 이럴 때 사용해요 */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
        <h4 className="text-base font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
          <HelpCircle className="w-5 h-5 text-indigo-500 shrink-0" />
          이럴 때 사용해요
        </h4>
        <p className="text-lg sm:text-xl text-slate-700 leading-relaxed font-semibold">
          <HighlightText text={whenToUse} />
        </p>
      </div>

      {/* 4. 조심하세요 */}
      {precautions && precautions.length > 0 && (
        <div className="bg-orange-50/50 border-2 border-orange-200 rounded-3xl p-6 sm:p-8 space-y-4">
          <h4 className="text-base font-black text-orange-950 flex items-center gap-1.5 uppercase tracking-wider">
            <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0" />
            조심하세요
          </h4>
          <ul className="space-y-2 text-lg text-slate-700 font-bold list-disc pl-5 leading-relaxed">
            {precautions.map((tip, idx) => (
              <li key={idx}>
                <HighlightText text={tip} type="warning" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
