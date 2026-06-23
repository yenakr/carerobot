import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, ChevronDown, ChevronUp, ThumbsUp, Target, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import CareSceneIllustration, { IllustrationType } from './CareSceneIllustration';
import HighlightText from './HighlightText';

interface SimpleRobotCardProps {
  id: string;
  name: string;
  category: string;
  description: string;
  whenToUse: string;
  precautions: string[];
  illustrationType: IllustrationType;
  // Expert details for collapsible drawer
  pros: string[];
  target: string;
  imgPath: string;
}

export default function SimpleRobotCard({
  id,
  name,
  category,
  description,
  whenToUse,
  precautions,
  illustrationType,
  pros,
  target,
  imgPath
}: SimpleRobotCardProps) {
  const [isDetailedOpen, setIsDetailedOpen] = useState(false);

  return (
    <div 
      id={`device-${id}`} 
      className="bg-white rounded-3xl border-2 border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow duration-200 text-left w-full max-w-2xl mx-auto"
    >
      <div className="p-6 sm:p-8 space-y-6">
        {/* Illustration Banner */}
        <div className="w-full shrink-0 p-1 bg-slate-50/50 rounded-2xl border border-slate-100">
          <CareSceneIllustration type={illustrationType} size="md" />
        </div>

        {/* Robot Name Header */}
        <div className="space-y-1">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800 leading-snug">
            <HighlightText text={name} type="robot" />
          </h3>
        </div>

        {/* Core Description */}
        <p className="text-lg sm:text-xl text-slate-700 leading-relaxed font-bold border-t border-slate-100 pt-4">
          <HighlightText text={description} />
        </p>

        {/* Usage & Safety Details Grid */}
        <div className="grid grid-cols-1 gap-5 pt-2">
          {/* When to use */}
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-2">
            <h4 className="text-base font-black text-slate-800 flex items-center gap-1.5 uppercase">
              <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
              이럴 때 사용해요
            </h4>
            <p className="text-base sm:text-lg text-slate-650 leading-relaxed font-semibold">
              <HighlightText text={whenToUse} />
            </p>
          </div>

          {/* Precautions */}
          <div className="bg-orange-50/50 border border-orange-150 rounded-2xl p-5 space-y-2">
            <h4 className="text-base font-black text-orange-950 flex items-center gap-1.5 uppercase">
              <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0" />
              조심하세요
            </h4>
            <ul className="space-y-2 text-base text-slate-700 font-semibold list-disc pl-4 leading-relaxed">
              {precautions.map((pre, idx) => (
                <li key={idx}>
                  <HighlightText text={pre} type="warning" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Collapsible Expert Details Drawer */}
      <div className="border-t border-slate-200">
        <button
          onClick={() => setIsDetailedOpen(!isDetailedOpen)}
          className="w-full py-4.5 px-6 bg-slate-50 hover:bg-slate-100/80 font-black text-sm sm:text-base text-slate-600 flex justify-between items-center transition-colors cursor-pointer select-none border-none"
        >
          <span>상세 설명 및 전문가 기준 보기</span>
          {isDetailedOpen ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>

        {isDetailedOpen && (
          <div className="p-6 bg-slate-50/30 border-t border-slate-150 space-y-6 animate-fade-in text-sm sm:text-base font-semibold text-slate-600">
            {/* Category and Target */}
            <div className="space-y-3 border-b border-slate-150 pb-5">
              <div>
                <span className="text-xs font-black px-3 py-1 rounded bg-indigo-50 border border-indigo-150 text-indigo-700 uppercase tracking-wider">
                  분류: {category}
                </span>
              </div>
              
              {imgPath && (
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start pt-3">
                  <div className="relative w-28 h-28 shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-2">
                    <Image
                      src={imgPath}
                      alt={name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <h4 className="text-xs font-black text-slate-400 uppercase flex items-center justify-center sm:justify-start gap-1">
                      <Target className="w-3.5 h-3.5" />
                      추천 세부 대상
                    </h4>
                    <p className="text-sm text-slate-600 font-bold leading-normal">{target}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Pros List */}
            <div className="space-y-2">
              <h4 className="text-sm font-black text-emerald-700 flex items-center gap-1.5 uppercase">
                <ThumbsUp className="w-4 h-4" />
                상세 장점
              </h4>
              <ul className="space-y-1.5 text-sm sm:text-base text-emerald-800 list-disc pl-4 leading-relaxed font-semibold">
                {pros.map((pro, idx) => (
                  <li key={idx}>{pro}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
