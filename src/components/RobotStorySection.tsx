import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';
import CareSceneIllustration, { IllustrationType } from './CareSceneIllustration';
import SimpleRobotCard from './SimpleRobotCard';
import SafetyTipsCard from './SafetyTipsCard';
import NextStepCTA from './NextStepCTA';
import HighlightText from './HighlightText';

export interface StoryScenario {
  title: string;
  description: string;
  illustrationType: IllustrationType;
}

export interface StoryRobot {
  id: string;
  name: string;
  category: string;
  description: string;
  whenToUse: string;
  precautions: string[];
  illustrationType: IllustrationType;
  pros: string[];
  target: string;
  imgPath: string;
}

interface RobotStorySectionProps {
  scenariosTitle: string;
  scenarios: StoryScenario[];
  helpersTitle: string;
  helpers: string[];
  robots: StoryRobot[];
  safetyTips: string[];
  onCTAChangeTab: () => void;
}

  const getTheme = (idx: number) => {
    const safeNum = (idx % 4) + 1;
    switch (safeNum) {
      case 1:
        return {
          bg: 'bg-purple-50/40',
          border: 'border-purple-200/80',
          badgeBg: 'bg-purple-650',
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

  return (
    <div className="space-y-16 animate-fade-in text-left pb-10 w-full max-w-full overflow-x-hidden">
      
      {/* 1. 이런 상황에서 필요해요 */}
      <section className="space-y-6 flex flex-col items-center w-full">
        <h3 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-2 self-start max-w-2xl mx-auto w-full">
          <span className="w-2.5 h-6 bg-indigo-600 rounded inline-block animate-pulse" />
          {scenariosTitle}
        </h3>
        
        <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto pt-2">
          {scenarios.map((sc, idx) => {
            const theme = getTheme(idx);
            return (
              <div 
                key={idx} 
                className={`flex flex-col sm:flex-row items-stretch bg-white border ${theme.border} ${theme.sideBorder} rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 w-full`}
              >
                {/* Scenario Illustration */}
                <div className={`w-full sm:w-44 ${theme.bg} p-4 shrink-0 border-b sm:border-b-0 sm:border-r border-slate-100 flex flex-col justify-center items-center`}>
                  <div className={`w-full p-1 rounded-xl ${theme.illustBg}`}>
                    <CareSceneIllustration type={sc.illustrationType} size="sm" />
                  </div>
                </div>
                {/* Scenario Info */}
                <div className="flex-1 p-6 flex flex-col justify-center text-left space-y-2">
                  <h4 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-full ${theme.badgeBg} text-white flex items-center justify-center font-black text-sm`}>
                      {idx + 1}
                    </span>
                    {sc.title}
                  </h4>
                  <p className="text-base text-slate-650 font-semibold leading-relaxed">
                    <HighlightText text={sc.description} />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. 돌봄로봇이 이렇게 도와줘요 */}
      <section className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-6 sm:p-8 space-y-5 max-w-2xl mx-auto w-full">
        <h3 className="text-xl sm:text-2xl font-black text-indigo-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          {helpersTitle}
        </h3>
        
        <ul className="flex flex-col gap-4 font-semibold text-slate-700 w-full">
          {helpers.map((help, idx) => (
            <li 
              key={idx} 
              className="flex items-center gap-2.5 bg-white border border-slate-150 p-4 rounded-2xl shadow-sm hover:translate-x-0.5 transition-transform"
            >
              <div className="w-2 h-2 rounded-full bg-indigo-650 shrink-0" />
              <span className="text-base sm:text-lg text-slate-700 leading-relaxed font-bold">
                <HighlightText text={help} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. 어떤 돌봄로봇이 있나요? */}
      <section className="space-y-6 flex flex-col items-center w-full">
        <h3 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-2 self-start max-w-2xl mx-auto w-full">
          <span className="w-2.5 h-6 bg-indigo-600 rounded inline-block" />
          어떤 돌봄로봇이 있나요?
        </h3>

        <div className="flex flex-col gap-8 pt-2 w-full">
          {robots.map((robot) => (
            <SimpleRobotCard
              key={robot.id}
              id={robot.id}
              name={robot.name}
              category={robot.category}
              description={robot.description}
              whenToUse={robot.whenToUse}
              precautions={robot.precautions}
              illustrationType={robot.illustrationType}
              pros={robot.pros}
              target={robot.target}
              imgPath={robot.imgPath}
            />
          ))}
        </div>
      </section>

      {/* 4. 사용 전 꼭 확인해요 */}
      <section className="pt-2 max-w-2xl mx-auto w-full">
        <SafetyTipsCard tips={safetyTips} />
      </section>

      {/* 5. 나에게 필요한 돌봄로봇 찾아보기 */}
      <section className="pt-4 max-w-2xl mx-auto w-full">
        <NextStepCTA 
          label="나에게 필요한 돌봄로봇 찾아보기" 
          subLabel="간단한 질문에 답하고 나에게 가장 알맞은 돌봄로봇을 추천받아 보세요."
          onClick={onCTAChangeTab} 
        />
      </section>

    </div>
  );
}
