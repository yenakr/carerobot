'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { BookOpen, GitMerge, CheckSquare, Shield, ArrowRight, CheckCircle2, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, ThumbsUp, AlertTriangle } from 'lucide-react';

// Data imports
import { toiletingCareAlgorithm } from '@/data/algorithms/toiletingCare';
import { toiletingEducationData } from '@/data/education/toiletingEducation';
import { toiletingCases } from '@/data/cases/toiletingCases';

// Component imports
import AlgorithmRunner from '@/components/AlgorithmRunner';

export default function ToiletingPage() {
  const [uiMode, setUiMode] = useState<'detail' | 'simple'>('detail');
  const [activeTab, setActiveTab] = useState<'info' | 'devices' | 'learning' | 'quiz'>('info');
  const [learningPath, setLearningPath] = useState<string[]>([]);
  const [showDetailedStandards, setShowDetailedStandards] = useState(false);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Collapsible categories state for Care Robot Types
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({
    '위생 케어': true,
    '이동 및 자세 보조': true,
    '배설처리로봇': true,
  });

  // Resolve active mode on mount and listen to changes
  useEffect(() => {
    const resolveMode = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const queryMode = searchParams.get('mode');
      
      let activeMode: 'detail' | 'simple' = 'detail';
      
      if (queryMode === 'simple' || queryMode === 'detail') {
        activeMode = queryMode;
        localStorage.setItem('care-mode', queryMode);
      } else {
        const saved = localStorage.getItem('care-mode');
        if (saved === 'simple' || saved === 'detail') {
          activeMode = saved as 'detail' | 'simple';
        }
      }
      setUiMode(activeMode);
    };

    resolveMode();

    const handleModeChange = () => {
      resolveMode();
    };

    window.addEventListener('careModeChanged', handleModeChange);
    window.addEventListener('popstate', handleModeChange);

    return () => {
      window.removeEventListener('careModeChanged', handleModeChange);
      window.removeEventListener('popstate', handleModeChange);
    };
  }, []);

  const toggleCat = (catName: string) => {
    setOpenCats(prev => ({ ...prev, [catName]: !prev[catName] }));
  };

  const handleLearnMore = (deviceId: string) => {
    setActiveTab('devices');
    const device = toiletingEducationData.devices.list.find(d => d.id === deviceId);
    if (device) {
      setOpenCats(prev => ({ ...prev, [device.category]: true }));
    }
    setTimeout(() => {
      const element = document.getElementById(`device-${deviceId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-4', 'ring-primary', 'ring-offset-2');
        setTimeout(() => {
          element.classList.remove('ring-4', 'ring-primary', 'ring-offset-2');
        }, 2000);
      }
    }, 150);
  };

  const tabs = [
    { id: 'info', name: uiMode === 'simple' ? '쉽게 알아보기' : '소개 & 평가기준', icon: BookOpen },
    { id: 'devices', name: uiMode === 'simple' ? '돌봄 기기 살펴보기' : '배설로봇 종류', icon: Shield },
    { id: 'learning', name: uiMode === 'simple' ? '나에게 맞는 기기 찾기' : '알고리즘 학습', icon: GitMerge },
    { id: 'quiz', name: uiMode === 'simple' ? '연습해보기' : '사례 테스트 (퀴즈)', icon: CheckSquare },
  ] as const;

  const tabOrder = ['info', 'devices', 'learning', 'quiz'] as const;
  const currentIdx = tabOrder.indexOf(activeTab);

  const handlePrevTab = () => {
    if (currentIdx > 0) {
      setActiveTab(tabOrder[currentIdx - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextTab = () => {
    if (currentIdx < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIdx + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleQuizAnswer = (optionIdx: number) => {
    if (isQuizSubmitted) return;
    setSelectedQuizOption(optionIdx);
  };

  const handleQuizSubmit = () => {
    if (selectedQuizOption === null) return;
    
    const currentCase = toiletingCases[quizIndex];
    if (selectedQuizOption === currentCase.correctAnswerIndex) {
      setQuizScore(prev => prev + 1);
    }
    setIsQuizSubmitted(true);
  };

  const handleQuizNext = () => {
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);
    if (quizIndex < toiletingCases.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  const getToiletImage = (id: string) => {
    if (id === 'B-B') return '/images/hygiene_bidet.png';
    if (id === 'B-C' || id === 'B-D') return '/images/toilet_lift.png';
    if (id === 'B-G') return '/images/excretion_robot.png';
    if (id === 'B-H') return '/images/smart_diaper_robot.png';
    return '/images/excretion_robot.png';
  };

  const isSimple = uiMode === 'simple';

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col w-full max-w-full overflow-x-hidden min-w-0 ${
      isSimple ? 'text-lg' : 'text-sm sm:text-base'
    }`}>
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className={`font-extrabold text-slate-800 tracking-tight ${isSimple ? 'text-4xl' : 'text-3xl'}`}>
          배설돌봄기기
        </h1>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto w-full max-w-full gap-2 border-b border-slate-200 pb-px mb-8 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSimple ? 'text-base sm:text-lg' : 'text-sm'
              } ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex-1">
          {/* Tab 1: 소개 & 평가기준 */}
          {activeTab === 'info' && (
            <div className="space-y-10 animate-fade-in">
              {/* Definition Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className={`font-bold text-slate-800 flex items-center gap-2 ${
                  isSimple ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                }`}>
                  <span className="w-2.5 h-6 bg-primary rounded-full inline-block" />
                  {isSimple ? '배설돌봄(화장실 및 위생)이란?' : toiletingEducationData.definition.title}
                </h2>
                <p className={`text-slate-600 leading-relaxed font-semibold ${
                  isSimple ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
                }`}>
                  {isSimple 
                    ? '배설돌봄은 환자분이 안전하고 청결하게 소변과 대변을 해결할 수 있도록 화장실 이동, 자세 유지, 용변 후 뒤처리 및 기저귀 위생 등을 도와주는 일을 말합니다.' 
                    : toiletingEducationData.definition.content
                  }
                </p>
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200/80 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">배설 영역 주요 5가지 관리 단계</h3>
                  <ul className={`grid grid-cols-1 sm:grid-cols-2 gap-3 font-semibold text-slate-700 ${
                    isSimple ? 'text-base sm:text-lg' : 'text-sm'
                  }`}>
                    {toiletingEducationData.definition.examples.map((ex, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Standards Section */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
                <h2 className={`font-bold text-slate-800 flex items-center gap-2 ${
                  isSimple ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                }`}>
                  <span className="w-2.5 h-6 bg-primary rounded-full inline-block" />
                  {isSimple ? '기기 선택 전 확인해 볼 핵심 항목' : '배설 영역 기능평가 기준'}
                </h2>
                
                {isSimple ? (
                  // Simple layout for caregivers
                  <div className="space-y-4">
                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-semibold">
                      환자분에게 딱 맞는 배설 보조기나 기저귀 로봇을 찾으려면 다음 세 가지 자립 능력을 먼저 확인해 보셔야 합니다.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm">1</div>
                        <h3 className="text-lg font-bold text-slate-800">대소변 신호(인지력)</h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                          스스로 소변이나 대변을 누고 싶다는 느낌(요의, 변의)을 느끼고 참거나 조절할 수 있는지 확인합니다.
                        </p>
                      </div>
                      
                      <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm">2</div>
                        <h3 className="text-lg font-bold text-slate-800">화장실 이동 능력</h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                          침대에서 일어나 화장실 변기까지 스스로 걷거나 휠체어를 안전하게 조작해 진입할 수 있는지 확인합니다.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm">3</div>
                        <h3 className="text-lg font-bold text-slate-800">위생 뒤처리 능력</h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                          용변을 다 본 후에 휴지를 꺼내 스스로 엉덩이를 깨끗하게 닦아내거나 바지를 올릴 힘이 있는지 확인합니다.
                        </p>
                      </div>
                    </div>

                    {/* Collapsible detailed standards */}
                    <div className="border-t border-slate-200 pt-6 mt-4">
                      <button
                        onClick={() => setShowDetailedStandards(!showDetailedStandards)}
                        className="w-full py-3.5 px-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-sm text-slate-700 flex justify-between items-center transition-all cursor-pointer shadow-sm"
                      >
                        <span>자세한 기준 보기 (0~4점 배설 영역 상세 기준표)</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDetailedStandards ? 'rotate-180' : ''}`} />
                      </button>

                      {showDetailedStandards && (
                        <div className="mt-4 p-5 rounded-xl border border-slate-200 bg-white space-y-4 animate-fade-in text-sm">
                          <h4 className="font-bold text-slate-800">배설 영역 기능평가 세부 기준</h4>
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
                            {toiletingEducationData.standards.items.map((item) => (
                              <div key={item.score} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                                <span className="font-bold text-primary block mb-1">{item.score} ({item.label})</span>
                                <span className="text-slate-500 font-medium">{item.details}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // Detail layout (original)
                  <>
                    <p className="text-sm sm:text-base text-slate-500 font-semibold">
                      {toiletingEducationData.standards.description} 2점 이상부터는 돌봄 로봇이나 위생 보조기기의 개입이 적극 장려됩니다.
                    </p>

                    {/* Grid representation of scores */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                      {toiletingEducationData.standards.items.map((item) => {
                        const scoreVal = parseInt(item.score);
                        const isHighlight = scoreVal >= 2;
                        return (
                          <div 
                            key={item.score} 
                            className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                              isHighlight 
                                ? 'border-primary bg-white shadow-md ring-1 ring-primary/20 scale-[1.02]' 
                                : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
                            }`}
                          >
                            <div>
                              <div className="flex justify-between items-center mb-3">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                                  isHighlight ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {item.score}
                                </span>
                                {isHighlight && (
                                  <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                                    로봇 매칭 기준
                                  </span>
                                )}
                              </div>
                              <h3 className="text-base font-bold text-slate-800 mb-1.5">{item.label}</h3>
                              <p className="text-xs text-slate-500 leading-relaxed font-semibold">{item.details}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: 배설로봇 종류 */}
          {activeTab === 'devices' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
                <h2 className={`font-bold text-slate-800 mb-2 ${isSimple ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
                  배설돌봄기기 종류
                </h2>
                <p className={`text-slate-500 font-semibold leading-relaxed ${isSimple ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                  대상자의 생리적 인지 수준과 거동 및 세정 관리 능력에 따라 최적의 솔루션을 제공합니다. 크게 비데용 시트, 변기 리프트 및 이동 변기, 음압 진공 자동배설로봇 등으로 나뉩니다.
                </p>
              </div>

              {/* Collapsible Categories Accordion */}
              <div className="space-y-6">
                {[
                  {
                    name: '위생 케어',
                    description: '스스로 화장실 이동과 기본적인 배설은 가능하나 관절염이나 유연성 감소로 용변 후 항문 부위를 깨끗이 닦기 힘든 상태를 보조합니다.',
                    targetLevel: '화장실 자력 이동 가능 & 뒤처리 제한 (비데 적합)',
                    simpleDescription: '혼자 화장실에 가실 수는 있지만 손 움직임이 둔하여 휴지로 깨끗하게 닦는 일만 어려워하실 때 자동으로 씻겨주는 기기입니다.',
                    devices: toiletingEducationData.devices.list.filter(d => d.category === '위생 케어'),
                  },
                  {
                    name: '이동 및 자세 보조',
                    description: '배설감은 인지하나 화장실로 걸어가는 것이 힘들어 침실 옆에 임시 변기가 필요하거나 변기에 앉고 일어설 때 무릎 충격을 줄여주어야 하는 기기입니다.',
                    targetLevel: '보행 장애 (변기 리프트 / 이동 변기 적합)',
                    simpleDescription: '용변 신호는 아시지만 변기까지 걷다가 넘어질 우려가 클 때, 변기 착석을 돕거나 침대 바로 옆에서 대소변을 보게 돕는 장치입니다.',
                    devices: toiletingEducationData.devices.list.filter(d => d.category === '이동 및 자세 보조'),
                  },
                  {
                    name: '배설처리로봇',
                    description: '배설 시기를 감지하지 못하고 스스로 거동도 불가능한 와상 환자의 대소변 오물을 센서로 감지 즉시 물세정, 건조까지 처리해주는 로봇입니다.',
                    targetLevel: '와상 상태 & 대소변 조절 불가능 (자동배설로봇 / 스마트기저귀 적합)',
                    simpleDescription: '스스로 대소변 신호를 인지하지 못하고 온종일 누워 계시는 분들의 기저귀 대소변을 사람 손 없이 자동으로 세정하고 흡입하는 첨단 로봇입니다.',
                    devices: toiletingEducationData.devices.list.filter(d => d.category === '배설처리로봇'),
                  },
                ].map((cat) => {
                  const isOpen = openCats[cat.name];
                  return (
                    <div key={cat.name} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                      {/* Accordion Header */}
                      <button
                        onClick={() => toggleCat(cat.name)}
                        className="w-full text-left p-6 bg-slate-50/70 hover:bg-slate-100/80 transition-all flex justify-between items-start gap-4 border-b border-slate-200/60 cursor-pointer"
                      >
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-800">{cat.name}</h3>
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                              {cat.targetLevel}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed">
                            {isSimple ? cat.simpleDescription : cat.description}
                          </p>
                        </div>
                        <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-sm text-slate-500 shrink-0 mt-1">
                          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {/* Accordion Content */}
                      {isOpen && (
                        <div className="p-6 bg-slate-50/20">
                          {cat.devices.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-4">등록된 로봇 정보가 없습니다.</p>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {cat.devices.map((device) => {
                                const imgPath = getToiletImage(device.id);
                                return (
                                  <div id={`device-${device.id}`} key={device.id} className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow duration-200 transition-all">
                                    <div className="p-5 sm:p-6 space-y-6">
                                      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                                        {/* Device Image */}
                                        <div className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2">
                                          <Image
                                            src={imgPath}
                                            alt={device.name}
                                            fill
                                            className="object-contain p-1"
                                          />
                                        </div>
                                        
                                        {/* Device Info */}
                                        <div className="flex-1 space-y-3 text-center sm:text-left">
                                          <div>
                                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-primary-light text-primary uppercase">
                                              {device.category}
                                            </span>
                                            <h3 className="text-base sm:text-lg font-bold text-slate-800 mt-1.5 leading-snug">{device.name}</h3>
                                          </div>
                                          <p className="text-xs text-slate-400 font-semibold leading-normal">
                                            <strong className="text-slate-600 block mb-0.5">추천 대상자:</strong>
                                            {device.target}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Description */}
                                      <p className="text-sm text-slate-600 leading-relaxed font-semibold border-t border-slate-100 pt-4">
                                        {device.description}
                                      </p>

                                      {/* Pros and Precautions */}
                                      <div className="grid grid-cols-1 gap-4 pt-2">
                                        {/* Pros */}
                                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 space-y-2">
                                          <h4 className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 uppercase font-extrabold">
                                            <ThumbsUp className="w-3.5 h-3.5" />
                                            장점
                                          </h4>
                                          <ul className="space-y-1 text-xs text-emerald-800 font-semibold list-disc pl-4 leading-relaxed">
                                            {device.pros.map((pro, idx) => (
                                              <li key={idx}>{pro}</li>
                                            ))}
                                          </ul>
                                        </div>

                                        {/* Precautions */}
                                        <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 space-y-2">
                                          <h4 className="text-xs font-bold text-amber-700 flex items-center gap-1.5 uppercase font-extrabold">
                                            <AlertTriangle className="w-3.5 h-3.5" />
                                            유의사항
                                          </h4>
                                          <ul className="space-y-1 text-xs text-amber-800 font-semibold list-disc pl-4 leading-relaxed">
                                            {device.precautions.map((pre, idx) => (
                                              <li key={idx}>{pre}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: 알고리즘 학습 */}
          {activeTab === 'learning' && (
            <div className="space-y-6 animate-fade-in flex-1 flex flex-col">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
                <h2 className={`font-bold text-slate-800 mb-2 ${isSimple ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
                  {isSimple ? '나에게 맞는 기기 찾기' : '알고리즘 학습'}
                </h2>
                <p className={`text-slate-500 leading-relaxed font-semibold ${isSimple ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                  {isSimple 
                    ? '몇 가지 간단한 질문에 차근차근 답하시면, 환자분에게 가장 유용한 배설 및 위생 돌봄 장치를 추천해 드립니다.'
                    : '상태 평가 질문에 답하며 돌봄 로봇 매칭 기준을 확인해보세요.'
                  }
                </p>
              </div>

              <div className="w-full">
                <AlgorithmRunner
                  algorithm={toiletingCareAlgorithm}
                  mode="learning"
                  uiMode={uiMode}
                  onPathChange={(path) => setLearningPath(path)}
                  onLearnMore={handleLearnMore}
                />
              </div>
            </div>
          )}

          {/* Tab 4: 사례 테스트 */}
          {activeTab === 'quiz' && (
            <div className="max-w-3xl mx-auto w-full py-4 animate-fade-in">
              {!quizFinished ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden">
                  <div className="bg-slate-100 h-1.5 w-full">
                    <div 
                      className="bg-primary h-full transition-all duration-300"
                      style={{ width: `${((quizIndex) / toiletingCases.length) * 100}%` }}
                    />
                  </div>

                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                      <span className="text-xs font-bold text-slate-400">
                        사례 테스트 Q. 0{quizIndex + 1} / 0{toiletingCases.length}
                      </span>
                      <span className="text-sm font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded-full">
                        맞춘 개수: {quizScore}
                      </span>
                    </div>

                    <div className="p-5 bg-slate-50 rounded-xl border border-slate-200/50 space-y-2">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">사례 (Scenario)</span>
                      <p className={`text-slate-700 leading-relaxed font-semibold ${isSimple ? 'text-base sm:text-lg' : 'text-sm'}`}>
                        {toiletingCases[quizIndex].scenario}
                      </p>
                    </div>

                    <h3 className={`font-bold text-slate-800 ${isSimple ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'}`}>
                      {toiletingCases[quizIndex].question}
                    </h3>

                    <div className="space-y-3">
                      {toiletingCases[quizIndex].options.map((opt, idx) => {
                        let btnStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 bg-white';
                        
                        if (selectedQuizOption === idx) {
                          btnStyle = 'border-primary bg-primary/5 text-primary font-bold';
                        }

                        if (isQuizSubmitted) {
                          if (idx === toiletingCases[quizIndex].correctAnswerIndex) {
                            btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold';
                          } else if (selectedQuizOption === idx) {
                            btnStyle = 'border-red-400 bg-red-50 text-red-800';
                          } else {
                            btnStyle = 'border-slate-200 text-slate-400 opacity-60 bg-white';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleQuizAnswer(idx)}
                            disabled={isQuizSubmitted}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between font-bold cursor-pointer ${
                              isSimple ? 'text-base sm:text-lg' : 'text-sm'
                            } ${btnStyle}`}
                          >
                            <span className="text-sm sm:text-base">{opt}</span>
                            <ChevronRight className="w-4 h-4 shrink-0" />
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                      {!isQuizSubmitted ? (
                        <button
                          onClick={handleQuizSubmit}
                          disabled={selectedQuizOption === null}
                          className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
                        >
                          답안 제출하기
                        </button>
                      ) : (
                        <button
                          onClick={handleQuizNext}
                          className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer"
                        >
                          <span>{quizIndex < toiletingCases.length - 1 ? '다음 문제' : '퀴즈 완료'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {isQuizSubmitted && (
                      <div className="mt-6 p-5 rounded-xl border border-slate-200/80 bg-white shadow-sm space-y-2 animate-fade-in">
                        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 font-semibold">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                          <span>정답 해설 ({selectedQuizOption === toiletingCases[quizIndex].correctAnswerIndex ? '정답입니다!' : '오답입니다.'})</span>
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
                          {toiletingCases[quizIndex].explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-md text-center space-y-6 animate-fade-in">
                  <div className="bg-primary/5 text-primary p-4 rounded-full w-fit mx-auto">
                    <TrophyIcon className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">사례 퀴즈 종료</h2>
                    <p className="text-sm text-slate-500 font-semibold">
                      사례 해결 퀴즈를 모두 마쳤습니다.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 max-w-sm mx-auto">
                    <span className="text-xs font-bold text-slate-400 block uppercase">최종 평가 점수</span>
                    <span className="text-4xl sm:text-5xl font-black text-primary mt-2 block">
                      {quizScore} / {toiletingCases.length}
                    </span>
                  </div>

                  <div className="flex justify-center gap-4 pt-4">
                    <button
                      onClick={resetQuiz}
                      className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold shadow-md transition-all cursor-pointer"
                    >
                      퀴즈 다시 풀기
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tab Left/Right Navigation Arrows */}
        <div className="flex justify-between items-center border-t border-slate-200 pt-8 mt-12 w-full">
          {currentIdx > 0 ? (
            <button
              onClick={handlePrevTab}
              className="px-4 sm:px-5 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1 sm:gap-1.5 transition-all shadow-sm max-w-[48%] truncate cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 shrink-0" />
              <span className="truncate">이전: {tabs.find(t => t.id === tabOrder[currentIdx - 1])?.name}</span>
            </button>
          ) : <div />}

          {currentIdx < tabOrder.length - 1 ? (
            <button
              onClick={handleNextTab}
              className="px-4 sm:px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm flex items-center gap-1 sm:gap-1.5 transition-all shadow-sm max-w-[48%] truncate cursor-pointer"
            >
              <span className="truncate">다음: {tabs.find(t => t.id === tabOrder[currentIdx + 1])?.name}</span>
              <ChevronRight className="w-4 h-4 shrink-0" />
            </button>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}

function TrophyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
      <path d="M12 2a6 6 0 0 0-6 6v3.5c0 1.63 1.37 2.95 3.08 2.95h5.84c1.71 0 3.08-1.32 3.08-2.95V8a6 6 0 0 0-6-6z" />
    </svg>
  );
}
