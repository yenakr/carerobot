'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, GitMerge, HelpCircle, Trophy, Check, Info } from 'lucide-react';

export default function Home() {
  const [mode, setMode] = useState<'detail' | 'simple'>('detail');

  useEffect(() => {
    const saved = localStorage.getItem('care-mode');
    if (saved === 'simple' || saved === 'detail') {
      setMode(saved);
    }
  }, []);

  const selectMode = (newMode: 'detail' | 'simple') => {
    setMode(newMode);
    localStorage.setItem('care-mode', newMode);
  };

  const steps = [
    {
      step: 1,
      title: '교육자료 학습',
      description: '돌봄로봇의 기본 정의와 평가기준을 확인합니다.',
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      step: 2,
      title: '알고리즘 학습',
      description: '평가 질문에 답하며 최적의 매칭 경로를 파악합니다.',
      icon: GitMerge,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      step: 3,
      title: '사례 기반 테스트',
      description: '실제 사례 문제를 해결하며 지식을 점검합니다.',
      icon: HelpCircle,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      step: 4,
      title: '결과 확인',
      description: '분석에 따른 최적의 추천 모델과 근거를 확인합니다.',
      icon: Trophy,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-secondary text-white py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none">
            돌봄로봇 교육 및 자가평가
          </h1>
          <p className="max-w-3xl mx-auto text-sm sm:text-base lg:text-lg text-slate-100/90 leading-relaxed font-semibold">
            이승돌봄과 배설돌봄 상황에 맞는 돌봄기기와 돌봄로봇을 이해하고, 나에게 필요한 유형을 확인해보세요.
          </p>

          {/* Mode Selection Area */}
          <div className="max-w-3xl mx-auto mt-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center justify-center gap-2">
              <span className="bg-white/20 p-1.5 rounded-lg text-white">
                <Info className="w-5 h-5" />
              </span>
              어떤 방식으로 보시겠습니까?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: 전문가 추천 */}
              <div
                onClick={() => selectMode('detail')}
                className={`cursor-pointer p-5 rounded-xl border-2 text-left transition-all duration-300 relative group flex flex-col justify-between ${
                  mode === 'detail'
                    ? 'border-white bg-white text-slate-800 shadow-lg scale-[1.01]'
                    : 'border-white/20 bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                {mode === 'detail' && (
                  <div className="absolute top-4 right-4 bg-primary text-white p-1 rounded-full">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      mode === 'detail' ? 'bg-primary/10 text-primary' : 'bg-white/10 text-white/90'
                    }`}>
                      상세 정보 확인
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight mb-2">전문가 추천</h3>
                  <p className={`text-xs leading-relaxed font-semibold ${
                    mode === 'detail' ? 'text-slate-600' : 'text-slate-200'
                  }`}>
                    평가 기준, 알고리즘 흐름, 추천 이유를 함께 확인합니다.
                  </p>
                </div>
                <div className={`text-[10px] mt-4 font-bold ${
                  mode === 'detail' ? 'text-slate-400' : 'text-white/50'
                }`}>
                  대상: 간호학생, 연구자, 교육자, 종사자 등
                </div>
              </div>

              {/* Card 2: 돌봄대상자 추천 */}
              <div
                onClick={() => selectMode('simple')}
                className={`cursor-pointer p-5 rounded-xl border-2 text-left transition-all duration-300 relative group flex flex-col justify-between ${
                  mode === 'simple'
                    ? 'border-white bg-white text-slate-800 shadow-lg scale-[1.01]'
                    : 'border-white/20 bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                {mode === 'simple' && (
                  <div className="absolute top-4 right-4 bg-primary text-white p-1 rounded-full">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      mode === 'simple' ? 'bg-primary/10 text-primary' : 'bg-white/10 text-white/90'
                    }`}>
                      쉬운 설명 위주
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight mb-2">돌봄대상자 추천</h3>
                  <p className={`text-xs leading-relaxed font-semibold ${
                    mode === 'simple' ? 'text-slate-600' : 'text-slate-200'
                  }`}>
                    큰 글씨와 쉬운 설명 중심으로 필요한 내용만 간단히 확인합니다.
                  </p>
                </div>
                <div className={`text-[10px] mt-4 font-bold ${
                  mode === 'simple' ? 'text-slate-400' : 'text-white/50'
                }`}>
                  대상: 가족 보호자, 요양보호사, 고령 돌봄 제공자 등
                </div>
              </div>
            </div>

            {/* Category Entry Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 max-w-md mx-auto sm:max-w-none">
              <Link
                href={`/transfer?mode=${mode}`}
                className="px-8 py-4 rounded-xl bg-white text-primary hover:bg-slate-100 font-extrabold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <span>이승돌봄 바로가기</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href={`/toileting?mode=${mode}`}
                className="px-8 py-4 rounded-xl bg-primary-dark/40 text-white hover:bg-primary-dark/60 font-extrabold text-base border border-white/20 hover:border-white/50 backdrop-blur-md transition-all flex items-center justify-center gap-2"
              >
                <span>배설돌봄 바로가기</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Objectives Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-bold text-primary uppercase tracking-wider font-semibold">ABOUT</span>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
            소개
          </h2>
          <div className="h-1.5 w-16 bg-primary rounded" />
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed pt-2 font-medium">
            이송과 위생 관리를 돕는 돌봄로봇의 특성을 이해하고, 환경과 대상자의 특성에 따른 최적의 대안을 확인할 수 있도록 지원합니다.
          </p>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-4">
            <div className="bg-primary/5 text-primary p-3 rounded-xl w-fit">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">이승돌봄</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              침대, 의자, 휠체어 등으로 자리를 옮길 때 필요한 기기와 로봇
            </p>
            <Link href={`/transfer?mode=${mode}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline pt-2">
              이승돌봄 로봇 살펴보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-4">
            <div className="bg-primary/5 text-primary p-3 rounded-xl w-fit">
              <FileCheckIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">배설돌봄</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              배뇨와 배변 등 위생 관리를 돕는 기기와 로봇
            </p>
            <Link href={`/toileting?mode=${mode}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline pt-2">
              배설돌봄 로봇 살펴보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Usage Process Section */}
      <section className="bg-slate-100/60 border-y border-slate-200/50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-wider font-semibold">PROCESS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Process
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm relative group">
                  <div className="absolute top-4 right-4 text-xs font-black text-slate-200">
                    STEP 0{item.step}
                  </div>
                  <div className={`p-3 rounded-xl border w-fit mb-4 ${item.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function FileCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <polyline points="9 15 11 17 15 13" />
    </svg>
  );
}
