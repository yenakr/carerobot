'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle, HelpCircle, Check, Info } from 'lucide-react';
import Image from 'next/image';

interface Option {
  id: string;
  text: string;
  score?: number;
  value: string;
}

interface Question {
  id: string;
  title: string;
  description?: string;
  type: 'single' | 'multi';
  options: Option[];
  nextQuestionId?: string | ((answers: Record<string, any>) => string | null);
  resultId?: string | ((answers: Record<string, any>) => string | null);
}

interface Result {
  id: string;
  title: string;
  description: string;
  recommendation: string;
  reason: string;
}

interface Algorithm {
  id: string;
  title: string;
  startQuestionId: string;
  questions: Record<string, Question>;
  results: Record<string, Result>;
}

interface AlgorithmRunnerProps {
  algorithm: Algorithm;
  mode: 'self-assessment' | 'learning';
  onPathChange?: (path: string[]) => void;
}

// Helper to resolve device images based on Result ID
function getDeviceImage(resultId: string): string {
  if (resultId.startsWith('T-')) {
    // Transfer Care
    if (['T-C', 'T-D'].includes(resultId)) {
      return '/images/standing_aid.png';
    }
    if (['T-E', 'T-F', 'T-G', 'T-H'].includes(resultId)) {
      return '/images/transfer_lift.png';
    }
    return '';
  } else {
    // Toileting Care
    if (['B-G', 'B-H'].includes(resultId)) {
      return '/images/excretion_robot.png';
    }
    if (['B-B', 'B-C', 'B-D'].includes(resultId)) {
      return '/images/toilet_lift.png';
    }
    return '';
  }
}

export default function AlgorithmRunner({ algorithm, mode, onPathChange }: AlgorithmRunnerProps) {
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(algorithm.startQuestionId);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [history, setHistory] = useState<string[]>([]);
  const [resultId, setResultId] = useState<string | null>(null);

  // For multi-select questions
  const [tempMultiSelect, setTempMultiSelect] = useState<string[]>([]);

  const currentQuestion = currentQuestionId ? algorithm.questions[currentQuestionId] : null;

  // Handle single selection
  const handleSingleSelect = (optionValue: string) => {
    const updatedAnswers = { ...answers, [currentQuestionId!]: optionValue };
    setAnswers(updatedAnswers);

    // Save history
    const newHistory = [...history, currentQuestionId!];
    setHistory(newHistory);

    // Dynamic path reporting
    if (onPathChange) {
      onPathChange([...newHistory, optionValue]);
    }

    // Resolve next step
    resolveNextStep(currentQuestionId!, updatedAnswers, newHistory);
  };

  // Handle multi-select toggles
  const handleMultiToggle = (optionValue: string) => {
    if (tempMultiSelect.includes(optionValue)) {
      setTempMultiSelect(tempMultiSelect.filter((v) => v !== optionValue));
    } else {
      setTempMultiSelect([...tempMultiSelect, optionValue]);
    }
  };

  // Handle multi-select submission
  const handleMultiSubmit = () => {
    if (tempMultiSelect.length === 0) {
      alert('최소 하나 이상의 옵션을 선택해주세요.');
      return;
    }

    const updatedAnswers = { ...answers, [currentQuestionId!]: tempMultiSelect };
    setAnswers(updatedAnswers);

    const newHistory = [...history, currentQuestionId!];
    setHistory(newHistory);

    if (onPathChange) {
      onPathChange([...newHistory, tempMultiSelect.join(',')]);
    }

    resolveNextStep(currentQuestionId!, updatedAnswers, newHistory);
  };

  const resolveNextStep = (qId: string, currentAnswers: Record<string, any>, currentHistory: string[]) => {
    const question = algorithm.questions[qId];
    let nextId: string | null = null;
    let resId: string | null = null;

    // Check nextQuestionId
    if (question.nextQuestionId) {
      if (typeof question.nextQuestionId === 'function') {
        nextId = question.nextQuestionId(currentAnswers);
      } else {
        nextId = question.nextQuestionId;
      }
    }

    // Check resultId
    if (question.resultId) {
      if (typeof question.resultId === 'function') {
        resId = question.resultId(currentAnswers);
      } else {
        resId = question.resultId;
      }
    }

    if (resId) {
      setResultId(resId);
      setCurrentQuestionId(null);
    } else if (nextId) {
      setCurrentQuestionId(nextId);
      // Pre-populate if multi-select was answered before
      const nextQuestion = algorithm.questions[nextId];
      if (nextQuestion && nextQuestion.type === 'multi') {
        setTempMultiSelect(currentAnswers[nextId] || []);
      }
    } else {
      // Fallback
      alert('알고리즘 분기 경로를 탐색할 수 없습니다.');
    }
  };

  // Backtracking
  const handleBack = () => {
    if (history.length === 0) return;

    const newHistory = [...history];
    const prevQuestionId = newHistory.pop()!;
    
    setHistory(newHistory);
    setResultId(null);
    setCurrentQuestionId(prevQuestionId);

    // If going back to a multi-select, restore temp state
    const prevQuestion = algorithm.questions[prevQuestionId];
    if (prevQuestion && prevQuestion.type === 'multi') {
      setTempMultiSelect(answers[prevQuestionId] || []);
    }

    // Update path reporting
    if (onPathChange) {
      onPathChange(newHistory);
    }
  };

  // Reset
  const handleReset = () => {
    setCurrentQuestionId(algorithm.startQuestionId);
    setAnswers({});
    setHistory([]);
    setResultId(null);
    setTempMultiSelect([]);
    if (onPathChange) {
      onPathChange([]);
    }
  };

  // Map history to nice text representation
  const getSelectedPathList = () => {
    return history.map((qId) => {
      const q = algorithm.questions[qId];
      const ans = answers[qId];
      if (!q) return null;

      let answerText = '';
      if (q.type === 'single') {
        const option = q.options.find((o) => o.value === ans);
        answerText = option ? option.text : '';
      } else if (q.type === 'multi' && Array.isArray(ans)) {
        answerText = ans
          .map((v) => q.options.find((o) => o.value === v)?.text || '')
          .filter(Boolean)
          .join(', ');
      }

      return {
        questionTitle: q.title,
        answerText,
      };
    }).filter(Boolean);
  };

  const pathList = getSelectedPathList();

  return (
    <div className="w-full">
      {/* Questionnaire Screen */}
      {!resultId && currentQuestion && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 sm:p-8 transition-all duration-300">
          
          {/* Progress Indicator */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-semibold text-primary uppercase bg-primary-light px-3 py-1 rounded-full">
              {mode === 'learning' ? '알고리즘 시뮬레이션' : '자가평가 수행 중'}
            </span>
            <span className="text-sm font-medium text-slate-500">
              이전 단계 개수: {history.length}
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(10, history.length * 25))}%` }}
            />
          </div>

          {/* Question Headers */}
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 leading-tight">
            {currentQuestion.title}
          </h3>
          {currentQuestion.description && (
            <p className="text-sm sm:text-base text-slate-500 mb-8 whitespace-pre-line">
              {currentQuestion.description}
            </p>
          )}

          {/* Options Display */}
          {currentQuestion.type === 'single' ? (
            <div className="space-y-4 mb-8">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSingleSelect(opt.value)}
                  className="w-full text-left p-5 rounded-xl border-2 border-slate-100 hover:border-primary hover:bg-primary/5 transition-all duration-200 flex justify-between items-center group font-medium text-slate-700"
                >
                  <span className="text-base sm:text-lg group-hover:text-primary transition-colors">
                    {opt.text}
                  </span>
                  <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all">
                    <div className="w-2.5 h-2.5 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQuestion.options.map((opt) => {
                  const isChecked = tempMultiSelect.includes(opt.value);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleMultiToggle(opt.value)}
                      className={`text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 font-medium ${
                        isChecked
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-slate-100 bg-white text-slate-700 hover:border-slate-200'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                        isChecked ? 'border-primary bg-primary text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-sm sm:text-base leading-snug">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleMultiSubmit}
                  disabled={tempMultiSelect.length === 0}
                  className="px-6 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>다음 단계</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center border-t border-slate-100 pt-6 mt-8">
            <button
              onClick={handleBack}
              disabled={history.length === 0}
              className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>이전 질문으로</span>
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-semibold text-red-500 hover:text-red-700 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>처음부터 다시하기</span>
            </button>
          </div>
        </div>
      )}

      {/* Result Screen */}
      {resultId && (
        <div className="space-y-6">
          {/* Main Result Card */}
          <div className="bg-white rounded-2xl border-2 border-primary/20 shadow-lg overflow-hidden transition-all duration-300">
            <div className="bg-primary px-6 py-5 text-white flex items-center gap-3">
              <CheckCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg sm:text-xl font-bold">평가 매칭 결과</h3>
            </div>

            <div className="p-6 sm:p-8">
              {/* Product Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-8">
                {/* Visual Section */}
                <div className="md:col-span-5 flex flex-col items-center justify-center">
                  {getDeviceImage(resultId) ? (
                    <div className="relative w-full max-w-[240px] md:max-w-none aspect-square rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center p-4">
                      <Image
                        src={getDeviceImage(resultId)}
                        alt={algorithm.results[resultId]?.title || 'Device Image'}
                        fill
                        className="object-contain p-2 hover:scale-105 transition-transform duration-300"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="w-full max-w-[240px] md:max-w-none aspect-square rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <span className="text-slate-300 text-sm">추천 이미지 준비 중</span>
                    </div>
                  )}
                  <span className="text-[11px] text-slate-400 mt-2 text-center leading-normal">
                    * 위 이미지는 사용자의 선택 결과를 시각화하기 위해 AI로 생성된 예시 모델입니다.
                  </span>
                </div>


                {/* Information Section */}
                <div className="md:col-span-7 space-y-5">
                  <div>
                    <span className="text-xs font-bold text-primary uppercase bg-primary-light px-2.5 py-1 rounded-md">
                      추천 돌봄기기 유형
                    </span>
                    <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2 tracking-tight">
                      {algorithm.results[resultId]?.title}
                    </h4>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-sm sm:text-base text-slate-600 font-semibold leading-relaxed">
                      {algorithm.results[resultId]?.description}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-primary" />
                      판단 기준 및 세부 해설
                    </h5>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                      {algorithm.results[resultId]?.reason}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h5 className="text-sm font-bold text-slate-500 uppercase">
                      가이드라인 및 권장 조치
                    </h5>
                    <p className="text-sm sm:text-base text-slate-700 bg-sky-50/50 p-4 rounded-xl border border-sky-100/50 leading-relaxed font-semibold">
                      {algorithm.results[resultId]?.recommendation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Response Path */}
              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                  나의 응답 경로 (의사결정 이력)
                </h4>
                <div className="bg-slate-50/80 rounded-xl p-4 sm:p-5 border border-slate-100 space-y-4">
                  {pathList.map((step, idx) => (
                    <div key={idx} className="flex gap-3 items-start text-sm">
                      <div className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-slate-500 block text-xs">{step?.questionTitle}</span>
                        <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{step?.answerText}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center border-t border-slate-100 pt-6 mt-8">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>이전 질문으로 돌아가기</span>
                </button>

                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>새로운 진단 시작하기</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
