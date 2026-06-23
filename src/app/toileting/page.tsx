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
import ScenarioStepList from '@/components/ScenarioStepList';
import SafetyCheckCard from '@/components/SafetyCheckCard';
import CareTabs from '@/components/CareTabs';
import CareSafetyCard from '@/components/CareSafetyCard';
import RobotStorySection from '@/components/RobotStorySection';
import { IllustrationType } from '@/components/CareSceneIllustration';

const getToiletImage = (id: string) => {
  if (id === 'B-B') return '/images/hygiene_bidet.png';
  if (id === 'B-C' || id === 'B-D') return '/images/toilet_lift.png';
  if (id === 'B-G') return '/images/excretion_robot.png';
  if (id === 'B-H') return '/images/smart_diaper_robot.png';
  return '/images/excretion_robot.png';
};

const toiletingScenarios = [
  { type: 'express-need' as const, title: '배설 신호 인지', description: '소변이나 대변이 마려운 감각을 올바르게 느끼고 의사를 조율합니다.' },
  { type: 'move-difficulty' as const, title: '화장실 이동', description: '침대에서 일어나 화장실 변기까지 안전하게 이동을 돕습니다.' },
  { type: 'bedside-toileting' as const, title: '침상 간이 변기', description: '화장실까지 가기 곤란한 대상자를 위해 침상 옆 간이 변기 사용을 보조합니다.' },
  { type: 'clean-after' as const, title: '뒤처리 및 의복 정리', description: '용변 후 깨끗한 뒤처리와 바지를 입고 벗는 것을 세심하게 케어합니다.' }
];

const toiletingScenariosData = [
  { illustrationType: 'express-need' as const, title: '배설 신호 인지하기', description: '용변이 마려운 감각을 느끼고 표현해야 합니다.' },
  { illustrationType: 'move-difficulty' as const, title: '변기까지 이동하기', description: '침대에서 일어나 변기까지 걸어갈 때 넘어지지 않아야 합니다.' },
  { illustrationType: 'bedside-toileting' as const, title: '침상에서 용변 해결하기', description: '화장실까지 가기 곤란하면 침대 옆 변기를 이용해야 합니다.' },
  { illustrationType: 'clean-after' as const, title: '위생 뒤처리하기', description: '용변을 본 후 깨끗하게 닦고 바지를 올리는 과정이 필요합니다.' },
];

const toiletingHelpers = [
  '배뇨/배변 센서로 대소변이 나오면 *즉시 알아차리고 세정*해 줍니다.',
  '변기 시트의 높이와 각도를 조절해 *무릎 관절의 부담을 덜어* 줍니다.',
  '화장실까지 걸어가지 않고 *침대 바로 옆에서 안전하게 해결*하도록 돕습니다.',
  '오물을 깨끗이 진공 세정하고 온풍 건조하여 *피부의 짓무름과 염증을 예방*합니다.'
];

const toiletingStoryRobots = toiletingEducationData.devices.list.map(d => {
  let illustrationType: IllustrationType = 'hygiene-manage';
  if (d.id === 'B-B') illustrationType = 'hygiene-manage';
  else if (d.id === 'B-C') illustrationType = 'wheelchair-to-toilet';
  else if (d.id === 'B-D') illustrationType = 'bedside-toileting';
  else if (d.id === 'B-G') illustrationType = 'clean-after';
  else if (d.id === 'B-H') illustrationType = 'privacy-protection';
  
  return {
    id: d.id,
    name: d.name,
    category: d.category,
    description: d.description,
    whenToUse: d.target,
    precautions: d.precautions,
    illustrationType,
    pros: d.pros,
    target: d.target,
    imgPath: getToiletImage(d.id)
  };
});

const toiletingSafetyTips = [
  '대상자의 개인 사생활이 노출되지 않도록 가림막이나 커튼을 쳐 주세요.',
  '이동 변기나 리프트를 사용할 때는 바퀴가 확실히 잠겨 있는지 매번 확인하세요.',
  '화장실 이동 경로에 물기나 걸려 넘어질 수 있는 신발, 카펫 등을 깨끗이 치워 주세요.',
  '사용 중에 이상 동작이나 대상자가 고통을 호소하면 작동을 멈추고 보호자가 개입하세요.'
];

const toiletingSafetyItems = [
  { id: 't-s1', title: '개인 프라이버시 보호', description: '수치심을 유발하지 않게 항상 가림막이나 문을 잘 닫아 드립니다.', illustrationType: 'privacy-protection' as const },
  { id: 't-s2', title: '변기 고정 및 높이 맞춤', description: '이동식 변기의 바퀴를 잠그고 침대와의 높이 편차를 줄여 고정합니다.', illustrationType: 'safety-check' as const },
  { id: 't-s3', title: '이동로 장애물 제거', description: '바닥의 물기나 미끄러운 신발, 걸려 넘어질 물건을 모두 치웁니다.', illustrationType: 'move-difficulty' as const },
  { id: 't-s4', title: '도움 과정 미리 알리기', description: '갑자기 몸을 만지기 전에 진행하려는 과정을 대상자에게 먼저 상냥히 설명합니다.', illustrationType: 'caregiver-prep' as const },
  { id: 't-s5', title: '철저한 소독 및 위생', description: '배설 즉시 소독 및 환기를 진행하고 용기 수거 등 위생을 정돈합니다.', illustrationType: 'hygiene-manage' as const },
];

const toiletingSafetyCheckItems = [
  { id: 'ts-c1', title: '개인 프라이버시 보호', description: '수치심을 느끼지 않도록 커튼이나 스크린으로 사생활 공간을 보호해 주세요.', type: 'privacy' as const },
  { id: 'ts-c2', title: '변기/바퀴 고정 확인', description: '간이 변기나 휠체어의 바퀴가 안전하게 고정되어 있고 수평인지 확인하세요.', type: 'lock' as const },
  { id: 'ts-c3', title: '주변 장애물 제거', description: '낙상 예방을 위해 화장실 바닥의 물기나 문턱의 미끄러운 신발 등을 정돈하세요.', type: 'obstacle' as const },
];

export default function ToiletingPage() {
  const [uiMode, setUiMode] = useState<'detail' | 'simple'>('detail');
  const [activeTab, setActiveTab] = useState<'info' | 'devices' | 'learning' | 'quiz'>('info');
  const [learningPath, setLearningPath] = useState<string[]>([]);
  const [showDetailedStandards, setShowDetailedStandards] = useState(false);

  // Safety checklist state for simple mode Tab 4
  const [checkedSafety, setCheckedSafety] = useState<Record<string, boolean>>({});
  const [quizSafetyApproved, setQuizSafetyApproved] = useState(false);

  const handleToggleSafety = (id: string) => {
    setCheckedSafety(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
    { id: 'devices', name: uiMode === 'simple' ? '돌봄로봇 살펴보기' : '배설로봇 종류', icon: Shield },
    { id: 'learning', name: uiMode === 'simple' ? '나에게 맞는 돌봄로봇 찾기' : '알고리즘 학습', icon: GitMerge },
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
    setCheckedSafety({});
    setQuizSafetyApproved(false);
  };



  const isSimple = uiMode === 'simple';

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col w-full max-w-full overflow-x-hidden min-w-0 ${
      isSimple ? 'text-lg' : 'text-sm sm:text-base'
    }`}>
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className={`font-extrabold text-slate-800 tracking-tight ${isSimple ? 'text-4xl' : 'text-3xl'}`}>
          배설돌봄로봇
        </h1>
      </div>

      {/* Tabs Navigation */}
      <CareTabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
        isSimple={isSimple} 
      />

      {/* Tab Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex-1">
          {/* Tab 1: 소개 & 평가기준 */}
          {activeTab === 'info' && (
            <div className="space-y-10 animate-fade-in text-left">
              {isSimple ? (
                <>
                  {/* Definition Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-2">
                      <span className="w-2.5 h-6 bg-indigo-600 rounded-full inline-block" />
                      배설돌봄(화장실 및 위생)이란?
                    </h2>
                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-semibold">
                      스스로 화장실을 이용하거나 대소변 후 청결을 유지하기 어려운 대상자를 위해 이동, 자세 유지, 용변 후 뒤처리 및 기저귀 위생 등을 돕는 돌봄입니다.
                    </p>
                  </div>

                  {/* Scenarios Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                      <span className="w-2.5 h-5 bg-indigo-600 rounded inline-block" />
                      주로 이런 상황에서 필요합니다
                    </h3>
                    <ScenarioStepList scenarios={toiletingScenarios} />
                  </div>

                  {/* Safety Precautions Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                      <span className="w-2.5 h-5 bg-amber-500 rounded inline-block" />
                      사용 전 확인하세요 (핵심 주의사항)
                    </h3>
                    <SafetyCheckCard items={toiletingSafetyCheckItems} />
                  </div>
                </>
              ) : (
                <>
                  {/* Definition Card */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2.5 h-6 bg-primary rounded-full inline-block" />
                      {toiletingEducationData.definition.title}
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-semibold">
                      {toiletingEducationData.definition.content}
                    </p>
                    <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200/80 shadow-sm space-y-3">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">배설 영역 주요 5가지 관리 단계</h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-semibold text-slate-700 text-sm">
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
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2.5 h-6 bg-primary rounded-full inline-block" />
                      배설 영역 기능평가 기준
                    </h2>
                    <p className="text-sm sm:text-base text-slate-500 font-semibold">
                      {toiletingEducationData.standards.description} 2점 이상부터는 돌봄 로봇이나 위생 보조기기의 개입이 적극 장려됩니다.
                    </p>

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
                  </div>
                </>
              )}
            </div>
          )}

          {/* Tab 2: 배설로봇 종류 */}
          {activeTab === 'devices' && (
            isSimple ? (
              <RobotStorySection
                scenariosTitle="이런 상황에서 필요해요"
                scenarios={toiletingScenariosData}
                helpersTitle="돌봄로봇이 이렇게 도와줘요"
                helpers={toiletingHelpers}
                robots={toiletingStoryRobots}
                safetyTips={toiletingSafetyTips}
                onCTAChangeTab={() => {
                  setActiveTab('learning');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
                  <h2 className="font-bold text-slate-800 mb-2 text-xl sm:text-2xl">
                    배설돌봄로봇 종류
                  </h2>
                  <p className="text-slate-500 font-semibold leading-relaxed text-sm sm:text-base">
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
                      devices: toiletingEducationData.devices.list.filter(d => d.category === '위생 케어'),
                    },
                    {
                      name: '이동 및 자세 보조',
                      description: '배설감은 인지하나 화장실로 걸어가는 것이 힘들어 침실 옆에 임시 변기가 필요하거나 변기에 앉고 일어설 때 무릎 충격을 줄여주어야 하는 기기입니다.',
                      targetLevel: '보행 장애 (변기 리프트 / 이동 변기 적합)',
                      devices: toiletingEducationData.devices.list.filter(d => d.category === '이동 및 자세 보조'),
                    },
                    {
                      name: '배설처리로봇',
                      description: '배설 시기를 감지하지 못하고 스스로 거동도 불가능한 와상 환자의 대소변 오물을 센서로 감지 즉시 물세정, 건조까지 처리해주는 로봇입니다.',
                      targetLevel: '와상 상태 & 대소변 조절 불가능 (자동배설로봇 / 스마트기저귀 적합)',
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
                              {cat.description}
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
            )
          )}

          {/* Tab 3: 알고리즘 학습 */}
          {activeTab === 'learning' && (
            <div className="space-y-6 animate-fade-in flex-1 flex flex-col">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
                <h2 className={`font-bold text-slate-800 mb-2 ${isSimple ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
                  {isSimple ? '나에게 맞는 돌봄로봇 찾기' : '알고리즘 학습'}
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
              {isSimple && !quizSafetyApproved ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-md space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-2">
                      <span className="w-2.5 h-6 bg-emerald-500 rounded-full inline-block" />
                      안전한 배설돌봄을 위한 5대 약속
                    </h2>
                    <p className="text-sm text-slate-500 leading-relaxed font-semibold">
                      대상자와 보호자 모두의 위생과 안전을 지키는 가장 확실한 습관입니다. 아래 수칙을 터치하여 모두 확인해 주세요.
                    </p>
                  </div>

                  <CareSafetyCard
                    items={toiletingSafetyItems}
                    checkedItems={checkedSafety}
                    onToggle={handleToggleSafety}
                  />

                  <div className="flex justify-end pt-6 border-t border-slate-200">
                    <button
                      onClick={() => setQuizSafetyApproved(true)}
                      disabled={Object.keys(checkedSafety).length < toiletingSafetyItems.length || !Object.values(checkedSafety).every(Boolean)}
                      className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-405 disabled:cursor-not-allowed text-white font-extrabold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <span>확인 완료 및 연습 시작하기</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : !quizFinished ? (
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
