'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { BookOpen, GitMerge, CheckSquare, Shield, ArrowRight, CheckCircle2, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, ThumbsUp, AlertTriangle } from 'lucide-react';

// Data imports
import { transferCareAlgorithm } from '@/data/algorithms/transferCare';
import { transferEducationData } from '@/data/education/transferEducation';
import { transferCases } from '@/data/cases/transferCases';

// Component imports
import AlgorithmRunner from '@/components/AlgorithmRunner';

export default function TransferPage() {
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
    '이승보조장비': true,
    '기립보조리프트 / 스탠딩리프트': true,
    '전신슬링 리프트': true,
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
    const device = transferEducationData.devices.list.find(d => d.id === deviceId);
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
    { id: 'devices', name: uiMode === 'simple' ? '돌봄 기기 살펴보기' : '이승로봇 종류', icon: Shield },
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
    
    const currentCase = transferCases[quizIndex];
    if (selectedQuizOption === currentCase.correctAnswerIndex) {
      setQuizScore(prev => prev + 1);
    }
    setIsQuizSubmitted(true);
  };

  const handleQuizNext = () => {
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);
    if (quizIndex < transferCases.length - 1) {
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

  const getSlingImage = (id: string) => {
    if (id === 'T-B') return '/images/transfer_board.png';
    if (id === 'T-C') return '/images/standing_aid.png';
    if (id === 'T-D') return '/images/manual_standing_aid.png';
    if (id === 'T-E') return '/images/transfer_lift.png';
    if (id === 'T-F') return '/images/wall_lift.png';
    if (id === 'T-G') return '/images/mobile_sling_lift.png';
    if (id === 'T-H') return '/images/gantry_lift.png';
    return '/images/transfer_lift.png';
  };

  const isSimple = uiMode === 'simple';

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col w-full max-w-full overflow-x-hidden min-w-0 ${
      isSimple ? 'text-lg' : 'text-sm sm:text-base'
    }`}>
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className={`font-extrabold text-slate-800 tracking-tight ${isSimple ? 'text-4xl' : 'text-3xl'}`}>
          이승돌봄기기
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
                  {isSimple ? '자리이동(이승) 돌봄이란?' : transferEducationData.definition.title}
                </h2>
                <p className={`text-slate-600 leading-relaxed font-semibold ${
                  isSimple ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
                }`}>
                  {isSimple 
                    ? '이승돌봄은 환자분이 스스로 다른 자리로 옮겨 앉지 못할 때 침대, 의자, 휠체어, 변기 등으로 자리를 안전하게 옮겨 태워주는 도움을 말합니다.' 
                    : transferEducationData.definition.content
                  }
                </p>
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200/80 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">주요 이승 상황 예시</h3>
                  <ul className={`grid grid-cols-1 sm:grid-cols-2 gap-3 font-semibold text-slate-700 ${
                    isSimple ? 'text-base sm:text-lg' : 'text-sm'
                  }`}>
                    {transferEducationData.definition.examples.map((ex, idx) => (
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
                  {isSimple ? '기기 선택 전 확인해 볼 핵심 항목' : '자리이동 기능평가'}
                </h2>
                
                {isSimple ? (
                  // Simple layout for caregivers
                  <div className="space-y-4">
                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-semibold">
                      환자분의 상태와 집안 환경에 꼭 맞는 이승 보조 기기를 찾기 위해 다음 두 가지를 중점적으로 체크해 보세요.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm">1</div>
                        <h3 className="text-lg font-bold text-slate-800">자리이동 능력 체크</h3>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                          침대에서 휠체어로 스스로 안전하게 넘어갈 수 있는지, 아니면 상당한 신체 지탱이나 전적인 기계 도움(리프트)이 요구되는지 살펴봅니다.
                        </p>
                      </div>
                      
                      <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm">2</div>
                        <h3 className="text-lg font-bold text-slate-800">다리 힘(체중 지탱) 체크</h3>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                          보호자가 양손으로 겨드랑이 밑을 잡아 지탱해주었을 때, 환자 본인의 다리 힘으로 서 있을 수 있는지 확인합니다.
                        </p>
                      </div>
                    </div>

                    {/* Collapsible detailed standards */}
                    <div className="border-t border-slate-200 pt-6 mt-4">
                      <button
                        onClick={() => setShowDetailedStandards(!showDetailedStandards)}
                        className="w-full py-3.5 px-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-sm text-slate-700 flex justify-between items-center transition-all cursor-pointer shadow-sm"
                      >
                        <span>자세한 기준 보기 (FIM 점수 및 의학적 MMT 등급 기준표)</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDetailedStandards ? 'rotate-180' : ''}`} />
                      </button>

                      {showDetailedStandards && (
                        <div className="mt-4 p-5 rounded-xl border border-slate-200 bg-white space-y-6 animate-fade-in text-sm">
                          <div className="space-y-4">
                            <h4 className="font-bold text-slate-800">자리이동 기능평가 점수 기준</h4>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
                              {transferEducationData.standards.items.map((item) => (
                                <div key={item.score} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                                  <span className="font-bold text-primary block mb-1">{item.score} ({item.label})</span>
                                  <span className="text-slate-500 font-medium">{item.details}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {transferEducationData.standards.subSection && (
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                              <h4 className="font-bold text-slate-800">하지 근력 (MMT) 등급 상세</h4>
                              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                                <table className="min-w-full text-xs text-left">
                                  <thead className="bg-slate-50 font-bold text-slate-700">
                                    <tr>
                                      <th className="p-3">근력 레벨</th>
                                      <th className="p-3">상태 구분</th>
                                      <th className="p-3">임상 판정 기준</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 bg-white font-medium text-slate-500">
                                    {transferEducationData.standards.subSection.items.map((subItem) => (
                                      <tr key={subItem.grade}>
                                        <td className="p-3 font-bold text-slate-700">{subItem.grade}</td>
                                        <td className="p-3">{subItem.label}</td>
                                        <td className="p-3">{subItem.criteria}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // Detail layout (original)
                  <>
                    <p className="text-sm sm:text-base text-slate-500 font-semibold">
                      {transferEducationData.standards.description} 2점 이상부터 이승돌봄로봇의 적극적 개입이 요구됩니다.
                    </p>

                    {/* Grid representation of scores */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                      {transferEducationData.standards.items.map((item) => {
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

                    {/* Muscle Grade Section */}
                    {transferEducationData.standards.subSection && (
                      <div className="border-t border-slate-100 pt-8 mt-8 space-y-4">
                        <h3 className="text-lg font-bold text-slate-800">
                          {transferEducationData.standards.subSection.title}
                        </h3>
                        <p className="text-sm text-slate-500 font-semibold">
                          {transferEducationData.standards.subSection.description}
                        </p>

                        <div className="bg-white border border-slate-200/80 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-bold text-slate-700 shadow-sm">
                          <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-slate-200">
                            <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                            <span>Grade 0 ~ III: 체중 지지 불가능 (전신슬링 리프트 적합)</span>
                          </div>
                          <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-slate-200">
                            <span className="w-3 h-3 rounded-full bg-primary shrink-0" />
                            <span>Grade IV ~ V: 체중 지지 가능 (기립보조리프트 적합)</span>
                          </div>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-200/70">
                          <table className="min-w-full divide-y divide-slate-200 text-left text-sm bg-white">
                            <thead className="bg-slate-50 font-bold text-slate-700">
                              <tr>
                                <th className="px-6 py-3">근력 레벨</th>
                                <th className="px-6 py-3">상태 구분</th>
                                <th className="px-6 py-3">임상 판정 기준</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                              {transferEducationData.standards.subSection.items.map((subItem) => {
                                const isWeightBearing = ['Grade IV', 'Grade V'].includes(subItem.grade);
                                return (
                                  <tr key={subItem.grade} className={isWeightBearing ? 'bg-slate-50/30' : ''}>
                                    <td className="px-6 py-4 font-bold text-slate-800">{subItem.grade}</td>
                                    <td className="px-6 py-4">
                                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                        isWeightBearing ? 'bg-sky-100 text-primary' : 'bg-slate-100 text-slate-500'
                                      }`}>
                                        {subItem.label}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-slate-700">
                                      {subItem.criteria}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: 이승로봇 종류 */}
          {activeTab === 'devices' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
                <h2 className={`font-bold text-slate-800 mb-2 ${isSimple ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
                  이승돌봄기기 종류
                </h2>
                <p className={`text-slate-500 font-semibold leading-relaxed ${isSimple ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                  환자분의 신체 조건과 가정 공간 환경에 따라 가장 잘 맞는 장치를 선택합니다. 크게 이승보조도구, 일어서기 보조 전동/수동 리프트, 공중에 매다는 그네식 리프트로 분류됩니다.
                </p>
              </div>

              {/* Collapsible Categories Accordion */}
              <div className="space-y-6">
                {[
                  {
                    name: '이승보조장비',
                    description: '자리이동 기능에 가벼운 어려움이 있어 간단한 도구를 활용해 신체 마찰과 보호자의 신체 부담을 줄여주는 장비군입니다.',
                    targetLevel: '자리이동 가벼운 어려움 (MMT Grade IV ~ V)',
                    simpleDescription: '자리이동이 어느 정도 스스로 가능하지만 가끔 보충 지탱이 필요할 때 마찰을 줄여 옮겨주는 가벼운 판이나 부축 벨트입니다.',
                    devices: transferEducationData.devices.list.filter(d => d.category === '이승보조장비'),
                  },
                  {
                    name: '기립보조리프트 / 스탠딩리프트',
                    description: '다리 근력이 약해 스스로 지탱하여 일어서기는 어려우나, 상체 조절이 가능하여 보호자나 전동 로봇의 힘을 빌려 일어서고 앉을 수 있는 장비군입니다.',
                    targetLevel: '하지 지지 어려움 (Grade III 이하) & 상체 가누기 가능',
                    simpleDescription: '다리 힘이 약해 일어서기 곤란하지만 스스로 상체를 가누고 손을 잡고 버틸 수 있을 때, 기계 힘으로 세워주는 장치입니다.',
                    devices: transferEducationData.devices.list.filter(d => d.category === '기립보조리프트 / 스탠딩리프트'),
                  },
                  {
                    name: '전신슬링 리프트',
                    description: '다리 지지와 상체 조절이 모두 불가능한 와상/중증 상태의 환자를 전용 슬링 시트로 완전히 공중에 매달아 이동시키는 안전한 리프트 장비군입니다.',
                    targetLevel: '하지 지지 및 상체 가누기 불가 (Grade III 이하)',
                    simpleDescription: '다리와 허리 힘이 전혀 없어 스스로 자세를 유지할 수 없는 분을 그네식 전용 시트(슬링)로 감싸 완전히 들어 올려 옮겨주는 기기입니다.',
                    devices: transferEducationData.devices.list.filter(d => d.category === '전신슬링 리프트'),
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
                                const imgPath = getSlingImage(device.id);
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
                    ? '몇 가지 간단한 질문에 차근차근 답하시면, 환자분에게 가장 안전한 이송 보조 장치 유형을 찾아드립니다.'
                    : '상태 평가 질문에 답하며 돌봄 로봇 매칭 기준을 확인해보세요.'
                  }
                </p>
              </div>

              <div className="w-full">
                <AlgorithmRunner
                  algorithm={transferCareAlgorithm}
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
                      style={{ width: `${((quizIndex) / transferCases.length) * 100}%` }}
                    />
                  </div>

                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                      <span className="text-xs font-bold text-slate-400">
                        사례 테스트 Q. 0{quizIndex + 1} / 0{transferCases.length}
                      </span>
                      <span className="text-sm font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded-full">
                        맞춘 개수: {quizScore}
                      </span>
                    </div>

                    <div className="p-5 bg-slate-50 rounded-xl border border-slate-200/50 space-y-2">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">사례 (Scenario)</span>
                      <p className={`text-slate-700 leading-relaxed font-semibold ${isSimple ? 'text-base sm:text-lg' : 'text-sm'}`}>
                        {transferCases[quizIndex].scenario}
                      </p>
                    </div>

                    <h3 className={`font-bold text-slate-800 ${isSimple ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'}`}>
                      {transferCases[quizIndex].question}
                    </h3>

                    <div className="space-y-3">
                      {transferCases[quizIndex].options.map((opt, idx) => {
                        let btnStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 bg-white';
                        
                        if (selectedQuizOption === idx) {
                          btnStyle = 'border-primary bg-primary/5 text-primary font-bold';
                        }

                        if (isQuizSubmitted) {
                          if (idx === transferCases[quizIndex].correctAnswerIndex) {
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
                          <span>{quizIndex < transferCases.length - 1 ? '다음 문제' : '퀴즈 완료'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {isQuizSubmitted && (
                      <div className="mt-6 p-5 rounded-xl border border-slate-200/80 bg-white shadow-sm space-y-2 animate-fade-in">
                        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 font-semibold">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                          <span>정답 해설 ({selectedQuizOption === transferCases[quizIndex].correctAnswerIndex ? '정답입니다!' : '오답입니다.'})</span>
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
                          {transferCases[quizIndex].explanation}
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
                      {quizScore} / {transferCases.length}
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
