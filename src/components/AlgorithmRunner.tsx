'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  RotateCcw, Check, Info, HelpCircle, AlertTriangle, ThumbsUp, ArrowRight, 
  ChevronRight, ChevronLeft, ChevronDown, Move, Footprints, Scale, 
  Accessibility, Users, Bot, Shield, Trophy, GitMerge, Maximize2, Bed, Heart 
} from 'lucide-react';
import Image from 'next/image';
import { Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import SimpleResultCard from './SimpleResultCard';

const simpleIconMap: Record<string, React.ReactNode> = {
  transfer: <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm"><Bed className="w-8 h-8" /></div>,
  walking: <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm"><Footprints className="w-8 h-8" /></div>,
  balance: <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm"><Scale className="w-8 h-8" /></div>,
  toilet: <div className="w-16 h-16 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-sm"><Accessibility className="w-8 h-8" /></div>,
  caregiver: <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm"><Users className="w-8 h-8" /></div>,
  robot: <div className="w-16 h-16 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shadow-sm"><Bot className="w-8 h-8" /></div>,
  safety: <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-sm"><Shield className="w-8 h-8" /></div>
};

const getResultIcon = (resultId: string) => {
  if (resultId === 'T-A' || resultId === 'B-A') {
    return <ThumbsUp className="w-8 h-8 text-emerald-600" />;
  }
  if (resultId.startsWith('T-')) {
    if (['T-B', 'T-C', 'T-D'].includes(resultId)) {
      return <Move className="w-8 h-8 text-blue-600" />;
    }
    return <Bot className="w-8 h-8 text-sky-600" />;
  }
  if (resultId.startsWith('B-')) {
    if (['B-B', 'B-C', 'B-D'].includes(resultId)) {
      return <Accessibility className="w-8 h-8 text-purple-600" />;
    }
    return <Bot className="w-8 h-8 text-sky-600" />;
  }
  return <Bot className="w-8 h-8 text-sky-600" />;
};

interface Option {
  id: string;
  text: string;
  simpleText?: string;
  simpleLabel?: string;
  score?: number;
  value: string;
}

interface Question {
  id: string;
  title: string;
  simpleTitle?: string;
  description?: string;
  simpleDescription?: string;
  simpleLabel?: string;
  iconType?: 'transfer' | 'walking' | 'balance' | 'toilet' | 'caregiver' | 'robot' | 'safety';
  type: 'single' | 'multi';
  options: Option[];
  nextQuestionId?: string | ((answers: Record<string, any>) => string | null);
  resultId?: string | ((answers: Record<string, any>) => string | null);
}

interface Result {
  id: string;
  title: string;
  simpleTitle?: string;
  description: string;
  simpleDescription?: string;
  simpleLabel?: string;
  recommendation: string;
  simpleRecommendation?: string;
  reason: string;
  simpleReason?: string;
  simpleResultSummary?: string;
  simpleTips?: string[];
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
  mode: 'learning';
  uiMode?: 'simple' | 'detail';
  onPathChange?: (path: string[]) => void;
  onLearnMore?: (deviceId: string) => void;
}

// Complete rich details database for each matching result ID
const resultDetails: Record<string, {
  deviceName: string;
  image: string;
  whenToUse: string;
  pros: string[];
  precautions: string[];
  environment: string;
  reason: string;
}> = {
  // 이승돌봄 결과 기기 상세
  'T-A': {
    deviceName: '도움 불필요 (일반 자립)',
    image: '',
    whenToUse: '자리이동에 어려움이 없고 스스로 침대와 휠체어 등을 안전하게 오갈 수 있는 상태',
    pros: ['사용자의 잔존 신체 기능을 최대한 유지하여 퇴행 예방', '보호자의 별도 물리적 개입이 불필요하여 돌봄 독립성 유지'],
    precautions: ['낙상 방지를 위해 침대 주변 장애물을 정리하고 조명을 밝게 유지하세요.', '신체 근력 상태를 주기적으로 체크하여 변화가 생기는지 모니터링이 권장됩니다.'],
    environment: '일반 가정 주거 환경',
    reason: '자리이동 기능평가 결과 0점(문제 없음)으로 평가되어, 현재 특별한 전동 리프트나 신체 보조기기가 요구되지 않습니다.'
  },
  'T-B': {
    deviceName: '이승보조장비 (슬라이딩 보드/이승벨트)',
    image: '/images/transfer_board.png',
    whenToUse: '자리이동 시 가벼운 균형 불안정이 있어 보호자의 가벼운 조력이나 이동판 보조가 필요한 상태',
    pros: ['무거운 전동 장비 설치 없이 가볍고 신속하게 이동을 지원함', '대상자를 휠체어로 끌 때 발생하는 마찰을 줄여 피부 쓸림 및 상처를 방지함'],
    precautions: ['환자가 등받이 없이 앉은 자세에서 스스로 최소한의 상체 균형을 잡을 수 있어야 안전합니다.', '미끄러질 때 낙상을 방지하기 위해 보호자가 곁에서 파지 벨트 등을 함께 잡아야 합니다.'],
    environment: '침실 및 휠체어 주변 이승 공간',
    reason: '자리이동 기능평가에서 1점(가벼운 어려움) 수준을 보여, 고가의 전동 리프트 대신 물리적 마찰을 줄이는 슬라이딩 보드로 이송을 돕는 것이 가장 효율적입니다.'
  },
  'T-C': {
    deviceName: '전동형 기립보조리프트 (허그, 업고플러스 등)',
    image: '/images/standing_aid.png',
    whenToUse: '자리이동 장애와 하지 지지 능력은 부족하나, 스스로 상체를 세우고 로봇 손잡이를 지탱해 잡을 수 있는 고령자',
    pros: ['전동 버튼 조작만으로 보호자가 허리 힘을 전혀 쓰지 않고 고령자를 안전하게 일으켜 세움', '기립 자세를 유지하는 과정에서 하지 근력 재활 및 서기 훈련 효과를 유도함'],
    precautions: ['환자가 로봇의 팔걸이나 손잡이를 잡고 버틸 수 있는 최소한의 상체 근력과 인지 능력이 필요합니다.', '벨트 체결 시 조임 상태가 늑골이나 가슴에 압박을 주지 않는지 이송 전 확인하세요.'],
    environment: '바닥 문턱이 없고 리프트가 안전하게 회전할 수 있는 침대 및 화장실 주변 공간',
    reason: '다리 근력으로 체중을 스스로 지탱하지는 못하지만 상체를 가눌 힘이 남아 있어, 등판을 벨트로 감싸 안전하게 일으켜 세우는 전동 기립보조 로봇이 적합합니다.'
  },
  'T-D': {
    deviceName: '비전동형 기립보조기기 (수동 스탠딩 에이드)',
    image: '/images/manual_standing_aid.png',
    whenToUse: '하지 지지력이 약하지만 상체 협조가 어느 정도 가능하며, 전원 충전이 번거로운 환경의 사용자',
    pros: ['전기 동력이 필요 없어 방전이나 전원 고장 우려가 전혀 없고 실외에서도 사용 가능', '무릎 가슴 패드와 고정 플레이트로 다중 지지하여 전복 위험을 원천 차단함'],
    precautions: ['기계식 수동 지렛대 작동 구조를 위해 보호자가 레버를 밀거나 당길 수 있는 최소한의 힘이 필요합니다.', '환자의 무릎이 지지 패드에 정확히 밀착되도록 조정해 안전을 확보하십시오.'],
    environment: '단차가 없는 실내 침대/휠체어 이송 구간',
    reason: '체중 지지가 어렵고 상체 가누기가 불안정하지만, 모터 전동 방식 대신 보호자의 수동 조작으로 환자의 가슴과 무릎을 밀착해 간편하게 일으켜 주는 장치입니다.'
  },
  'T-E': {
    deviceName: '천장 고정형 리프트',
    image: '/images/transfer_lift.png',
    whenToUse: '하지 근력 및 상체 지지력이 모두 불가능하며, 주택 천장에 레일 공사가 가능한 와상 고령자',
    pros: ['바닥 공간을 전혀 차지하지 않아 협소한 방에서도 사용 가능', '보호자 한 명만으로도 근골격계 부담 없이 완벽한 이송 가능'],
    precautions: ['건물 천장 구조물의 내하중 보강 공사가 필수적임', '초기 설치 비용이 비교적 높음'],
    environment: '천장 레일 매립/노출 주행이 확보되는 공간 및 침대 주변',
    reason: '다리에 전혀 힘이 들어가지 않아 스스로 서거나 일어설 수 없으며, 벽체 타공 대신 천장 지지 공간을 안전하게 마련할 수 있는 가정에 가장 이상적입니다.'
  },
  'T-F': {
    deviceName: '벽 고정형 리프트',
    image: '/images/wall_lift.png',
    whenToUse: '하지 근력 및 상체 지지력이 불가하고 천장 공사는 지지 하중 등의 이유로 제한되나, 튼튼한 옹벽이 존재하는 장소',
    pros: ['천장 지지가 부실하더라도 옹벽에 강력 고정하여 낙상 없이 사용', '관절식 회전 암 구조로 침대 주변 등 좁은 영역 내에서 빠르게 휠체어 탑승을 지원함'],
    precautions: ['장비 지지용 콘크리트 내력벽 확인이 필수적이며 벽면 상태에 따라 장착 보강이 수반되어야 합니다.', '벽면 암의 작동 반경을 벗어난 장소로의 직접적인 이동은 불가합니다.'],
    environment: '리프트 회전이 자유롭고 단단한 콘크리트 내력벽이 존재하는 침실',
    reason: '천장 보강 공사가 불가능해 슬링 리프트를 설치할 차선책이 필요하나, 침대 주변의 옹벽을 이용해 그네 리프트를 안전히 작동시켜 이송을 돕는 합리적인 기기입니다.'
  },
  'T-G': {
    deviceName: '이동식 리프트 (슬링 없음, 슬링 자동 삽입, 슬링 수동 체결)',
    image: '/images/mobile_sling_lift.png',
    whenToUse: '벽/천장 공사가 완전히 금지되는 주거 환경이거나, 거실과 안방 등 여러 장소로 굴려서 이송해야 하는 와상 사용자',
    pros: ['별도의 영구 설치 공사나 가옥 훼손 없이 즉각적 조립 사용이 가능', '바퀴 이동식으로 설계되어 욕실, 거실, 침실 등 전 공간 이동성 지원'],
    precautions: ['바닥에 단차가 있거나 문턱이 있으면 이동이 제한되므로 턱 제거 시공이 우선입니다.', '침대 밑에 리프트의 하부 프레임(다리 부분)이 들어갈 수 있는 빈 틈새(높이 10~12cm)가 필수입니다.'],
    environment: '바닥 문턱이 없고 평평하며 침대 하단 틈새가 열려있는 주거 공간',
    reason: '공사가 절대 불가해 고정식 레일을 달 수 없지만, 바닥이 평평하고 문턱이 없어 부드러운 바퀴 주행이 가능한 방과 거실에서 전신 슬링을 체결하여 옮기기에 가장 훌륭한 바퀴형 이동 리프트입니다.'
  },
  'T-H': {
    deviceName: '이동식 겐트리 리프트',
    image: '/images/gantry_lift.png',
    whenToUse: '천장/벽 손상 공사가 불가능하며, 침대 주변 공간이 넓고 수직 리프팅의 강한 하중 안정성을 선호하는 와상 사용자',
    pros: ['천장/벽 훼손 없이 튼튼한 문 모양 철제 독립 프레임을 세워 안정적으로 공중 이송', '조립형 구조로 임대 주택 거주자도 추후 이사 시 쉽게 분해 및 이전 설치가 용이함'],
    precautions: ['침대 좌우 및 상단으로 큰 겐트리 지지 기둥이 세워지므로 가구 배치 공간 확보가 먼저 요구됩니다.', '프레임의 수평 유지 및 연결 볼트의 견고한 고정 상태를 정기적으로 관리해야 합니다.'],
    environment: '철제 겐트리 지지 프레임을 침대 위에 충분히 둘러서 세울 수 있는 넓은 침실 공간',
    reason: '벽이나 천장 타공 등 가옥 훼손은 일절 불가능하지만, 침실 침대 사방으로 튼튼한 A자형 철제 프레임 기둥을 조립 배치하여 안정적으로 환자를 공중에 띄워 옮길 수 있습니다.'
  },

  // 배설돌봄 결과 기기 상세
  'B-A': {
    deviceName: '도움 불필요 (위생 자립)',
    image: '',
    whenToUse: '용변 요의/변의 인지, 화장실 보행 이동, 스스로 닦기 및 의복 조절이 원활히 가능한 자력 해결 상태',
    pros: ['환자 본인의 신체 잔존 역량 및 독립적 자조 능력을 최대한 유지', '보호자의 배설 돌봄 물리적 개입이 불필요하여 삶의 피로도 최하 유지'],
    precautions: ['화장실 바닥 물기로 인한 낙상을 예방하기 위해 미끄럼방지 테이프를 붙여두세요.', '인지 및 다리 근력 등의 퇴행 변화가 일어나는지 주기적 자가점검이 권장됩니다.'],
    environment: '일반 가정 화장실 및 욕실 주거 공간',
    reason: '배뇨/배변 인지 조절, 이동, 청결 전 과정에서 기능 제한이 거의 존재하지 않는 완전 자립 상태이므로 기기 지원이 필요하지 않습니다.'
  },
  'B-B': {
    deviceName: '온수 세정 자동 비데',
    image: '/images/hygiene_bidet.png',
    whenToUse: '화장실 이동과 기본적인 앉기/일어서기는 양호하지만 관절 손상이나 근육 마비로 용변 후 휴지로 깔끔히 닦아내지 못하는 사용자',
    pros: ['화장지 문지름에 따르는 노령 피부의 마찰 손상 및 통증 완화', '노즐 자동 온수 스프레이와 바람 건조로 청결한 항문 위생 조력 및 요로감염 예방'],
    precautions: ['컨트롤러 패널을 사용자가 보고 직접 누를 수 있는 인지력이 유지되어야 합니다.', '정기적인 비데 필터 교환 및 세정 노즐 청결 소독이 필요합니다.'],
    environment: '양변기 주변에 방수 플러그 전기 공급 및 급수 배관이 연결 가능한 화장실',
    reason: '배뇨 배변감 인지와 화장실 이동 능력은 양호하지만, 류마티스 관절염이나 어깨 및 허리 회전 가동 범위 제한으로 휴지를 써서 깨끗이 닦아내기 힘드므로 자동 세정 비데가 가장 적합합니다.'
  },
  'B-C': {
    deviceName: '화장실 전동 변기 리프트',
    image: '/images/toilet_lift.png',
    whenToUse: '배뇨/배변 신호를 스스로 인지하고 뒤처리 능력도 있지만, 무릎 고관절 연골 마모로 쪼그려 앉고 일어설 때 통증이 심하고 낙상 우려가 높은 사용자',
    pros: ['시트 자체의 높낮이와 각도를 유압 전동식으로 조절해 안전하게 일어서도록 유도', '무릎 관절에 체중 부담을 거의 주지 않고 편안한 용변 시작과 일어서기 퇴거를 보장함'],
    precautions: ['일반 변기 위에 결합하므로 도기 모양 규격을 체크하고 전기 전원 연결 유무를 보십시오.', '전동 시트가 회전해 올라올 때 균형을 잃고 쏠리지 않도록 속도에 익숙해지는 연습이 필요합니다.'],
    environment: '전동 변기 리프트를 지탱하고 안착할 수 있는 여유 면적의 화장실 양변기 주변',
    reason: '용변 신호를 잘 알고 뒤처리도 자력 해결하지만, 다리 힘과 고관절 약화로 변기에 완전히 착석하고 일어나 서는 과정에서 낙상 및 근골격계 손상이 우려되어 전동 보조 변기 리프트가 필요합니다.'
  },
  'B-D': {
    deviceName: '가구형 침상 이동 변기',
    image: '/images/toilet_lift.png', // Fallback
    whenToUse: '용변을 보고 싶은 신호는 정확히 느끼나, 화장실 문턱을 넘어가거나 먼 거리를 보행해 이동할 수 없는 사용자',
    pros: ['침실 침대 곁에 바로 닿게 설치해 실금과 낙상을 동시에 차단', '스윙식 안전 팔걸이 조절로 휠체어에서 변기로 미끄러지듯 바로 이동 승차 가능'],
    precautions: ['사용 후 오물 버킷을 즉시 비우고 전용 세정제로 씻어주지 않으면 악취가 날 수 있습니다.', '안정성을 위해 환자가 착석했을 때 고정 바퀴가 확실하게 잠겨서 뒤로 밀리지 않도록 고정해야 합니다.'],
    environment: '침대 바로 옆에 이동 변기를 배치할 여유 영역이 확보되는 침실 공간',
    reason: '소대변 감각 인지와 뒤처리는 보존되거나 보조가 가능하지만, 하반신 보행 장애로 인해 방 밖 화장실 변기까지 움직일 수 없으므로 침대 바로 옆 가구형 이동 변기가 필수적입니다.'
  },
  'B-E': {
    deviceName: '시간에 맞춘 예약 배설 유도 프로그램 (배뇨 예측 센서 활용)',
    image: '/images/excretion_robot.png',
    whenToUse: '다리 거동 및 위생 뒤처리는 자력 완수가 가능하나, 치매 또는 인지저하로 방광에 오물이 차오르는 것을 자각하지 못해 실금이 빈번한 사용자',
    pros: ['스마트 센서가 방광 팽창도를 직접 추적하여 제시간에 소변을 해결하게 알림', '불필요한 기저귀 착용을 원천 차단하고 스스로의 신체 배설 능력을 마지막까지 보존 지원'],
    precautions: ['아랫배에 부착하는 젤 전도체 센서 스티커가 흔들림 없이 고정되도록 파지해야 합니다.', '알람 수신 시 보호자가 귀찮아하지 않고 정해진 시간에 동행하는 관리가 지속되어야 합니다.'],
    environment: '센서 수신용 스마트폰 연동 환경 및 자력 보행 화장실',
    reason: '신체적 화장실 이동과 세정 능력은 양호하지만, 인지 왜곡으로 배뇨 감각을 차단 인지하여 제때 용변을 보지 못하므로 초음파 배뇨 예측 센서로 때맞춰 화장실로 이끄는 훈련이 효과적입니다.'
  },
  'B-F': {
    deviceName: '시간에 맞춘 배설 유도 및 양변기 비데 연동 프로그램',
    image: '/images/hygiene_bidet.png', // Fallback
    whenToUse: '배설 요의/변의를 지각하지 못하고, 손의 움직임도 무뎌 항문 위생을 닦지 못하지만 부축하면 변기까지 걸어갈 수 있는 상태',
    pros: ['보호자의 정기적 화장실 유도로 침상 실금을 원천 방지', '항문 청소는 비데가 물로 알아서 세정 건조하므로 보호자의 뒤처리 노고가 크게 줄어듦'],
    precautions: ['기계의 물살 자극에 환자가 놀라거나 벌떡 일어서는 사고를 예방하도록 곁에서 지탱하세요.', '방광 팽만 센서 신호에 맞추어 즉시 이송 유도가 지켜져야 효과가 큽니다.'],
    environment: '자동 비데가 구축된 거주지 안 화장실 공간',
    reason: '인지 왜곡으로 배뇨 신호를 차단하며 손을 돌리는 청결 세정도 불완전하지만, 다행히 부축해 화장실까지 걸어갈 힘은 유지되므로 예약 유도와 자동 비데 세정을 결합하는 것이 효율적입니다.'
  },
  'B-G': {
    deviceName: '자동배설처리로봇 (간헐적 이용)',
    image: '/images/excretion_robot.png',
    whenToUse: '배설 신호를 자각하지 못하고 화장실로 걸어갈 수도 없어 24시간 침대에 누워 지내지만, 주로 밤 시간대 위주로 뒤처리를 기계가 대행하기를 바랄 때',
    pros: ['소대변 감지 즉시 음압 진공으로 분뇨를 빨아들이고 온수로 중요부위를 자동 씻겨줌', '주요 오물 감지 시에만 노즐 패드를 착용해 피부 통풍 제한을 경감함'],
    precautions: ['오물 흡입 컵 부착 시 환자의 피부 밀착 상태가 부정확하면 소변이 이불로 유출될 수 있습니다.', '주기적으로 기계 정수통의 온수를 리필하고 오물 분뇨 보틀을 위생적으로 버려야 합니다.'],
    environment: '배설로봇 기계를 침대 옆에 바퀴로 거치할 수 있는 침실 환경',
    reason: '스스로 용변 신호를 못 느끼며 보행 이동도 불가능해 주로 침상에 누워 계시지만, 기저귀 짓무름을 예방하기 위해 밤이나 특정 시간대에 부착해 오물을 수거하는 탈착식 배설 로봇이 알맞습니다.'
  },
  'B-H': {
    deviceName: '흡인형 스마트 기저귀 로봇시스템 (지속적 이용)',
    image: '/images/smart_diaper_robot.png',
    whenToUse: '24시간 침상에 누워 지내며 자력 배뇨감 인지 및 화장실 거동이 일절 불가하고, 보호자의 잦은 수동 기저귀 교체가 극도로 고된 중증 환자',
    pros: ['대소변이 나오자마자 1초 만에 로봇이 진공 흡입하여 실내 오물 냄새 차단 및 유출 방지', '물 세정부터 온풍 드라이까지 손 하나 안 대고 케어하므로 침상 피부 청결의 완벽 유지'],
    precautions: ['로봇 커버 컵이 신체 틈새로 접혀 짓눌리거나 흡입 호스가 꺾여 음압이 떨어지지 않도록 확인이 필요합니다.', '밀착 고무 패드 부분의 피부에 기계식 눌림 상처(욕창 등)가 생기지 않는지 주기적으로 점검하세요.'],
    environment: '스마트 기저귀 호스 주행 및 오물 흡입 본체가 안전하게 밀착 거치될 수 있는 침상 침실',
    reason: '배설 인지, 거동 이동, 위생 뒤처리 전 영역에서 완전한 자립 불가능(극심한 어려움) 판정을 받은 전형적인 침상 누움 환자로, 24시간 자동으로 대소변을 진공 흡입하고 세정하는 최첨단 스마트 기저귀 로봇 시스템이 적합합니다.'
  }
};

// Learning/Detail Guide details mapping
const learningGuides: Record<string, { title: string; content: string; details: { key: string; val: string }[] }> = {
  q1: {
    title: '자리이동하기 기능평가',
    content: '자리이동 평가는 스스로 자세를 완전히 바꾸지 않고 침대 등 한 면에서 휠체어와 같은 다른 면으로 공간적 위치를 이동하는 모든 행위를 포함합니다. (ADL 항목 중 침대-휠체어 이승 평가 기준)',
    details: [
      { key: '0점 (문제 없음)', val: '혼자서 아무런 도구와 도움 없이 침대와 휠체어 등을 안전하게 오갈 수 있는 수준' },
      { key: '1점 (가벼운 어려움)', val: '이동 시 가벼운 균형 불안정이나 피로감이 있으나 스스로 조절하고 극복할 수 있는 상태' },
      { key: '2점 (중간 정도)', val: '일상생활에 일부 지장을 초래하며 안전을 위해 보조 기구나 타인의 가벼운 밀착 도움이 요구되는 수준' },
      { key: '3점 (심한 어려움)', val: '스스로의 힘으로는 거의 이동이 불가하여 신체적 지탱과 부분적인 완전 보조가 수시로 필요한 수준' },
      { key: '4점 (극심한 어려움)', val: '자리이동을 위한 어떠한 신체 협조도 불가능하여 전적인 기계장치나 다수 제공자의 도움이 필수적인 수준' }
    ]
  },
  q2: {
    title: '체중 지탱(다리 근력) 평가',
    content: '의료진이 사용하는 MMT(Manual Muscle Test) 등급을 기반으로 판단하며, 다리 근력이 Grade IV 이상(약간의 저항을 극복하고 서서 버틸 수 있는 단계)이면 체중 지지가 가능하다고 평가하여 기립보조리프트를 추천 대상에 올립니다. Grade III 이하(중력은 극복해 다리를 수직으로 들지만 외부 저항을 전혀 버티지 못해 스스로 설 수 없는 단계)는 지탱 불가능으로 봅니다.',
    details: [
      { key: '체중 지탱 가능 (MMT IV~V)', val: '다리에 스스로 힘을 주어 버틸 수 있으므로 기립보조리프트(T-C, T-D)로 유도가 원활합니다.' },
      { key: '체중 지탱 불가 (MMT 0~III)', val: '스스로 지탱하여 일어설 수 없으므로 전신을 그네 시트로 띄우는 전신슬링 리프트(T-E, T-F, T-G, T-H) 계열이 안전합니다.' }
    ]
  },
  q3: {
    title: '사용자 주거 및 시설 환경 평가',
    content: '전신슬링 리프트는 종류에 따라 가옥 내부에 하중 지지 공사(천장 보강 공사, 옹벽 앵커 설치 등)를 동반해야 하는 경우가 많습니다. 공사가 가능한지, 불가능하여 이동식(바퀴형)이나 독립 조립 프레임(겐트리)을 세워야 하는지에 따라 최종 로봇 세부 추천이 결정됩니다.',
    details: [
      { key: '천장 고정 (T-E)', val: '천장에 단단히 레일을 매립/설치할 수 있어 공간 낭비가 전혀 없습니다.' },
      { key: '벽 고정 (T-F)', val: '콘크리트 옹벽면에 스윙 관절 암 타입으로 고정하여 회전 반경 내에서만 이동시킵니다.' },
      { key: '이동식 (T-G)', val: '가구 훼손이나 공사가 전면 불가할 때 바퀴로 끄는 형태이나 문턱 제거가 요구됩니다.' },
      { key: '이동식 겐트리 (T-H)', val: '공사는 어렵지만 침대 주변에 A자형 독립 프레임 철제 기둥 구조물을 단독 조립할 공간이 나올 때 훌륭한 대안입니다.' }
    ]
  },
  q3_1: {
    title: '우선순위 및 가치 판단',
    content: '천장이나 벽 설치가 둘 다 가능한 경우 또는 환경 제약이 적을 때 사용자의 선호 가치(사용 편의성 향상 vs 초기 비용 아끼기)를 선별합니다.',
    details: [
      { key: '사용 편의성 우선', val: '천장 주행 모터를 매달아 힘이 전혀 들지 않고 즉시 거실/침실 이동이 가능한 천장 고정형(T-E) 추천' },
      { key: '설치 비용 절감 우선', val: '옹벽 고정 암만 설치해 설치비를 줄이고 방 내부에서 부드럽게 사용하는 벽 고정형(T-F) 추천' }
    ]
  },
  q3_2: {
    title: '조립식 겐트리 지지대 배치 공간',
    content: '주택 손상이 불가해 공사는 거부하지만, 침대 위에 커다란 독립 지지 프레임을 세울 공간(침대 좌우 20cm 이상 빈 여유 공간)이 있는지 평가합니다.',
    details: [
      { key: '겐트리 프레임 가능 (T-H)', val: '방 공간이 충분하여 단독 지지 프레임을 세워 안정적으로 리프팅 주행 가능' },
      { key: '순수 이동식 필요 (T-G)', val: '방이 좁아 기둥 세우기가 곤란하여 바퀴로 굴리는 이동식 프레임을 사용하고, 침대 밑에 하부 바퀴가 들어갈 틈새를 둡니다.' }
    ]
  },
  q4: {
    title: '상체 조절 및 협조 능력 평가',
    content: '다리 힘은 지탱하기 어렵지만 환자가 앉은 상태에서 스스로 등받이 없이 허리와 고개를 세우고 버티며, 리프트 앞의 보조 손잡이를 꽉 쥘 수 있는 잔존 기능이 살아있는지 검사합니다.',
    details: [
      { key: '상체 조절 가능 (T-C)', val: '전동 버튼 조작으로 벨트를 등뒤에 걸어 자연스럽게 세워 이송하는 전동형 기립보조리프트가 효율적입니다.' },
      { key: '상체 조절 불가 (T-D)', val: '손잡이를 잡고 버틸 능력이 부족하여 무릎 패드와 가슴 고정 밴드로 신체를 다중 밀착해 억지로 일으켜주는 탑승식 수동 기립보조기기가 안전합니다.' }
    ]
  },
  toileting_q1: {
    title: '생리적 배설 인지 능력 평가',
    content: '소변과 대변이 마렵다는 신호(요의 및 변의)를 환자 본인의 신경계가 명확히 인지하고, 마려울 때 괄약근을 의식적으로 조절해 참거나 화장실 가기를 표현할 수 있는지 확인합니다.',
    details: [
      { key: '인지 능력 양호 (0~1점)', val: '배설 신호를 제때 자각하므로 화장실 이동이나 뒤처리 세정이 양호하면 비데나 리프트로 쉽게 자립 유도가 가능합니다.' },
      { key: '인지 능력 저하 (2~4점)', val: '요의/변의를 지각하지 못해 실금이 잦으므로, 제시간에 맞춰 배설을 유도하는 프로그램이나 기저귀를 자동으로 세정 진공 수거하는 배설로봇(B-G, B-H) 케어가 권장됩니다.' }
    ]
  },
  toileting_q2_a: {
    title: '화장실 이동 능력 평가 (배설 인지 양호 시)',
    content: '배뇨와 배변 신호를 잘 인지하고 있을 때, 침대에서 일어나 화장실 도기 변기 위까지 안전하게 이동할 수 있는지 다리 거동과 균형을 채점합니다.',
    details: [
      { key: '이동 능력 양호 (0~1점)', val: '화장실까지 자력 보행이 되므로, 항문 위생 청결 상태만 보고 비데(B-B) 여부를 검토합니다.' },
      { key: '이동 능력 저하 (2~4점)', val: '낙상 불안이 크거나 걷지 못해 침대 근처에서 변기 리프트(B-C)를 대거나 침실 옆 가구형 이동 변기(B-D)를 이용해야 합니다.' }
    ]
  },
  toileting_q2_b: {
    title: '화장실 이동 능력 평가 (배설 인지 저하 시)',
    content: '배뇨와 배변 신호를 스스로 인지하지 못해 실금이 빈번한 와중에도, 부축을 받거나 자력으로 화장실 변기 앞까지 움직여 갈 수 있는 신체적 보행력 자체는 유지되고 있는지 판단합니다.',
    details: [
      { key: '이동 능력 유지 (0~1점)', val: '실금 위험이 크지만 신체 이동은 되므로, 시간마다 화장실로 이송을 유도(B-E, B-F)하여 기저귀 사용을 억제합니다.' },
      { key: '이동 능력 손상 (2~4점)', val: '인지 및 이동이 모두 불가능한 와상 단계이므로, 침상에 누운 채 자동으로 대소변을 처리해주는 배설처리로봇(B-G, B-H) 기기를 대항 구축합니다.' }
    ]
  },
  toileting_q3_a1: {
    title: '용변 후 청결 마무리',
    content: '화장실까지 갈 수 있고 인지도 양호할 때, 용변 후 스스로 항문을 화장지로 닦아내고 바지와 속옷을 올바르게 제 위치로 정리할 수 있는지 손가락 미세 가동 능력과 관절의 꼬임 능력을 봅니다.',
    details: [
      { key: '0~1점 (양호)', val: '위생 처리를 온전히 혼자서 하여 기기 도움 불필요 (B-A)' },
      { key: '2~4점 (장해)', val: '어깨 결림이나 관절염 등으로 뒤처리가 힘들어 양변기 자동 온수 세정 비데(B-B) 도입 필요' }
    ]
  },
  toileting_q3_a2: {
    title: '용변 후 청결 마무리',
    content: '인지 지각은 양호하나 화장실까지 걸어가지 못할 때, 변기 착석을 도우면서 용변 처리를 완수할 수 있도록 뒤처리와 기립을 보완하는 단계를 결정합니다.',
    details: [
      { key: '0~1점 (양호)', val: '변기 시트를 높이고 손잡이로 일어서기만 도우면 혼자 닦을 수 있어 양변기 전동 변기 리프트(B-C) 도입' },
      { key: '2~4점 (장해)', val: '화장실 이동도 어렵고 용변 후 닦아줄 사람도 필요해 침대 옆에서 해결하는 이동 변기(B-D) 도입' }
    ]
  },
  toileting_q3_b1: {
    title: '용변 후 청결 마무리',
    content: '인지 지각은 낮고 화장실 이동은 가능할 때 스스로 항문을 세정하고 뒤처리를 수행할 수 있는지 확인합니다.',
    details: [
      { key: '0~1점 (양호)', val: '유도를 통한 시간 맞춰 화장실 이용 후 스스로 뒤처리' },
      { key: '2~4점 (장해)', val: '시간 맞춰 화장실 유도 및 비데 세정 자동화 구축' }
    ]
  },
  toileting_q3_b2: {
    title: '용변 후 청결 마무리',
    content: '인지도 낮고 이동도 불가능해 누워 지내는 와상 상태에서 배설 후 엉덩이 세정 조치를 기계적으로 자동화할 수 있는지 결정합니다.',
    details: [
      { key: '0~1점 (양호)', val: '누운 채 탈착형 자동배설로봇 간헐적 이용' },
      { key: '2~4점 (장해)', val: '24시간 스마트 기저귀 흡인형 배설로봇 지속 가동' }
    ]
  }
};

// Node positioning and styling configurations (Detail Mode React Flow coordinates)
const transferNodes: Record<string, { x: number; y: number; label: string; isResult?: boolean; typeLabel: string }> = {
  q1: { x: 760, y: 0, label: "자리이동에 어려움이 있나요?", typeLabel: "기능평가" },
  q2: { x: 1520, y: 200, label: "체중을 스스로 지탱할 수 없는가?", typeLabel: "하지 근력" },
  q4: { x: 965, y: 400, label: "스스로 상체를 일으킬 수 없는가?", typeLabel: "상체 조절" },
  q3: { x: 2075, y: 400, label: "사용자의 환경은 어떤가요?", typeLabel: "설치 환경" },
  q3_1: { x: 2075, y: 600, label: "우선순위가 어떻게 되나요?", typeLabel: "가치 선별" },
  q3_2: { x: 2645, y: 800, label: "독립 지지대 설치가 가능한가요?", typeLabel: "공사 평가" },
  'T-A': { x: 0, y: 1000, label: "도움 불필요", isResult: true, typeLabel: "돌봄로봇 추천" },
  'T-B': { x: 420, y: 1000, label: "이승보조장비", isResult: true, typeLabel: "돌봄로봇 추천" },
  'T-C': { x: 840, y: 1000, label: "전동형 기립보조리프트", isResult: true, typeLabel: "돌봄로봇 추천" },
  'T-D': { x: 1260, y: 1000, label: "비전동형 기립보조기기", isResult: true, typeLabel: "돌봄로봇 추천" },
  'T-E': { x: 1680, y: 1000, label: "천장 고정형 리프트", isResult: true, typeLabel: "돌봄로봇 추천" },
  'T-F': { x: 2100, y: 1000, label: "벽 고정형 리프트", isResult: true, typeLabel: "돌봄로봇 추천" },
  'T-H': { x: 2520, y: 1000, label: "이동식 겐트리 리프트", isResult: true, typeLabel: "돌봄로봇 추천" },
  'T-G': { x: 2940, y: 1000, label: "이동식 리프트", isResult: true, typeLabel: "돌봄로봇 추천" },
};

const toiletingNodes: Record<string, { x: number; y: number; label: string; isResult?: boolean; typeLabel: string }> = {
  q1: { x: 1385, y: 0, label: "배설 인지 조절에 어려움이 있나요?", typeLabel: "인지 평가" },
  q2_a: { x: 545, y: 200, label: "화장실 이동에 어려움이 있나요? (A)", typeLabel: "이동 평가" },
  q2_b: { x: 2225, y: 200, label: "화장실 이동에 어려움이 있나요? (B)", typeLabel: "이동 평가" },
  q3_a1: { x: 125, y: 400, label: "스스로 뒤처리를 할 수 있나요? (A1)", typeLabel: "뒤처리 평가" },
  q3_a2: { x: 965, y: 400, label: "스스로 뒤처리를 할 수 있나요? (A2)", typeLabel: "뒤처리 평가" },
  q3_b1: { x: 1805, y: 400, label: "스스로 뒤처리를 할 수 있나요? (B1)", typeLabel: "뒤처리 평가" },
  q3_b2: { x: 2645, y: 400, label: "스스로 뒤처리를 할 수 있나요? (B2)", typeLabel: "뒤처리 평가" },
  'B-A': { x: 0, y: 600, label: "도움 불필요", isResult: true, typeLabel: "돌봄로봇 추천" },
  'B-B': { x: 420, y: 600, label: "비데", isResult: true, typeLabel: "돌봄로봇 추천" },
  'B-C': { x: 840, y: 600, label: "변기 리프트", isResult: true, typeLabel: "돌봄로봇 추천" },
  'B-D': { x: 1260, y: 600, label: "이동 변기", isResult: true, typeLabel: "돌봄로봇 추천" },
  'B-E': { x: 1680, y: 600, label: "배설 유도 프로그램", isResult: true, typeLabel: "돌봄로봇 추천" },
  'B-F': { x: 2100, y: 600, label: "배설 프로그램 + 비데", isResult: true, typeLabel: "돌봄로봇 추천" },
  'B-G': { x: 2520, y: 600, label: "자동배설로봇 (간헐)", isResult: true, typeLabel: "돌봄로봇 추천" },
  'B-H': { x: 2940, y: 600, label: "스마트 기저귀 로봇", isResult: true, typeLabel: "돌봄로봇 추천" },
};

const transferEdges = [
  { from: 'q1', to: 'T-A', label: "0점", condition: (ans: any) => ans['q1'] === '0' },
  { from: 'q1', to: 'T-B', label: "1점", condition: (ans: any) => ans['q1'] === '1' },
  { from: 'q1', to: 'q2', label: "2점 이상", condition: (ans: any) => parseInt(ans['q1'] || '-1') >= 2 },
  { from: 'q2', to: 'q3', label: "예 (지탱 불가)", condition: (ans: any) => ans['q2'] === 'yes' },
  { from: 'q2', to: 'q4', label: "아니오 (지탱 가능)", condition: (ans: any) => ans['q2'] === 'no' },
  { from: 'q4', to: 'T-C', label: "아니오 (상체 조절)", condition: (ans: any) => ans['q4'] === 'no' },
  { from: 'q4', to: 'T-D', label: "예 (상체 조절 불가)", condition: (ans: any) => ans['q4'] === 'yes' },
  { from: 'q3', to: 'T-E', label: "천장식 단독", condition: (ans: any) => (ans['q3'] || []).includes('ceiling') && !(ans['q3'] || []).includes('wall') && !(ans['q3'] || []).includes('movable') },
  { from: 'q3', to: 'T-F', label: "벽식 단독", condition: (ans: any) => !(ans['q3'] || []).includes('ceiling') && (ans['q3'] || []).includes('wall') && !(ans['q3'] || []).includes('movable') },
  { from: 'q3', to: 'q3_1', label: "복수 환경 지원", condition: (ans: any) => {
      const sel = ans['q3'] || [];
      const hasCeil = sel.includes('ceiling');
      const hasWall = sel.includes('wall');
      const hasMovable = sel.includes('movable');
      return (hasCeil ? 1 : 0) + (hasWall ? 1 : 0) >= 2 || (((hasCeil ? 1 : 0) + (hasWall ? 1 : 0) >= 1) && hasMovable);
    }},
  { from: 'q3', to: 'q3_2', label: "천장/벽 공사 불가", condition: (ans: any) => !(ans['q3'] || []).includes('ceiling') && !(ans['q3'] || []).includes('wall') },
  { from: 'q3_1', to: 'T-E', label: "편의성", condition: (ans: any) => ans['q3_1'] === 'convenience' },
  { from: 'q3_1', to: 'T-F', label: "비용 절감", condition: (ans: any) => ans['q3_1'] === 'cost' },
  { from: 'q3_1', to: 'q3_2', label: "공사 최소화", condition: (ans: any) => ans['q3_1'] === 'minimal' },
  { from: 'q3_2', to: 'T-H', label: "프레임 가능", condition: (ans: any) => ans['q3_2'] === 'yes' },
  { from: 'q3_2', to: 'T-G', label: "프레임 불가", condition: (ans: any) => ans['q3_2'] === 'no' }
];

const toiletingEdges = [
  { from: 'q1', to: 'q2_a', label: "0~1점 (양호)", condition: (ans: any) => parseInt(ans['q1'] || '-1') >= 0 && parseInt(ans['q1'] || '-1') <= 1 },
  { from: 'q1', to: 'q2_b', label: "2~4점 (장해)", condition: (ans: any) => parseInt(ans['q1'] || '-1') >= 2 },
  { from: 'q2_a', to: 'q3_a1', label: "0~1점 (양호)", condition: (ans: any) => parseInt(ans['q2_a'] || '-1') >= 0 && parseInt(ans['q2_a'] || '-1') <= 1 },
  { from: 'q2_a', to: 'q3_a2', label: "2~4점 (장해)", condition: (ans: any) => parseInt(ans['q2_a'] || '-1') >= 2 },
  { from: 'q2_b', to: 'q3_b1', label: "0~1점 (양호)", condition: (ans: any) => parseInt(ans['q2_b'] || '-1') >= 0 && parseInt(ans['q2_b'] || '-1') <= 1 },
  { from: 'q2_b', to: 'q3_b2', label: "2~4점 (장해)", condition: (ans: any) => parseInt(ans['q2_b'] || '-1') >= 2 },
  { from: 'q3_a1', to: 'B-A', label: "0~1점 (양호)", condition: (ans: any) => parseInt(ans['q3_a1'] || '-1') >= 0 && parseInt(ans['q3_a1'] || '-1') <= 1 },
  { from: 'q3_a1', to: 'B-B', label: "2~4점 (장해)", condition: (ans: any) => parseInt(ans['q3_a1'] || '-1') >= 2 },
  { from: 'q3_a2', to: 'B-C', label: "0~1점 (양호)", condition: (ans: any) => parseInt(ans['q3_a2'] || '-1') >= 0 && parseInt(ans['q3_a2'] || '-1') <= 1 },
  { from: 'q3_a2', to: 'B-D', label: "2~4점 (장해)", condition: (ans: any) => parseInt(ans['q3_a2'] || '-1') >= 2 },
  { from: 'q3_b1', to: 'B-E', label: "0~1점 (양호)", condition: (ans: any) => parseInt(ans['q3_b1'] || '-1') >= 0 && parseInt(ans['q3_b1'] || '-1') <= 1 },
  { from: 'q3_b1', to: 'B-F', label: "2~4점 (장해)", condition: (ans: any) => parseInt(ans['q3_b1'] || '-1') >= 2 },
  { from: 'q3_b2', to: 'B-G', label: "0~1점 (양호)", condition: (ans: any) => parseInt(ans['q3_b2'] || '-1') >= 0 && parseInt(ans['q3_b2'] || '-1') <= 1 },
  { from: 'q3_b2', to: 'B-H', label: "2~4점 (장해)", condition: (ans: any) => parseInt(ans['q3_b2'] || '-1') >= 2 },
];

const getShortOptionText = (text: string) => {
  if (text.includes('사용 편의성')) return '사용 편의';
  if (text.includes('비용 절감')) return '비용 절감';
  if (text.includes('공사 과정 최소화')) return '공사 최소';
  const parts = text.split(/[:;,]/);
  return parts[0].trim();
};

const optionDetails: Record<string, string> = {
  'q1_0': '혼자서 아무런 도구와 도움 없이 자리를 옮기거나 인지 조절이 원활한 상태',
  'q1_1': '약간 불안정하거나 가벼운 피로감이 있으나 대부분 자력으로 할 수 있는 상태',
  'q1_2': '넘어짐 방지를 위해 보조 기구를 쓰거나 타인의 가벼운 손길/부축이 있는 상태',
  'q1_3': '혼자서는 거의 어려워 전적인 지탱이나 부분적인 완전 보조가 자주 들어가는 상태',
  'q1_4': '신체 협조가 전혀 불가하여 기계 장치나 다수의 제공자가 부축해야 하는 상태',
  
  'q2_yes': '다리에 힘이 없어 본인의 힘으로 서서 몸무게를 버티지 못합니다.',
  'q2_no': '보호자가 부축해 주면 잔존 다리 힘으로 서 있거나 버티실 수 있습니다.',
  
  'q4_yes': '앉아 있을 때 허리와 고개가 꺾이고, 보조 손잡이를 꽉 잡지 못합니다.',
  'q4_no': '앉은 상태에서 스스로 상체를 세우고, 리프트 앞 손잡이를 힘있게 잡을 수 있습니다.',

  'q2a_0': '아무런 도움 없이도 안전하게 화장실까지 걸어서 가십니다.',
  'q2a_1': '화장실까지 가실 때 가끔 흔들리지만 스스로 해결하십니다.',
  'q2a_2': '낙상 예방을 위해 보행 보조기를 짚거나 보호자가 잡아주어야 합니다.',
  'q2a_3': '다리에 힘이 약해 주로 휠체어를 부축해 옮겨 태워 가야 합니다.',
  'q2a_4': '거동이 일절 불가능하여 침대를 전혀 벗어나지 못하십니다.',

  'q2b_0': '아무런 도움 없이도 안전하게 화장실까지 걸어서 가십니다.',
  'q2b_1': '화장실까지 가실 때 가끔 흔들리지만 스스로 해결하십니다.',
  'q2b_2': '낙상 예방을 위해 보행 보조기를 짚거나 보호자가 잡아주어야 합니다.',
  'q2b_3': '다리에 힘이 약해 주로 휠체어를 부축해 옮겨 태워 가야 합니다.',
  'q2b_4': '거동이 일절 불가능하여 침대를 전혀 벗어나지 못하십니다.',

  'q3a1_0': '화장실 용변 후에 혼자서 닦고 옷 입기까지 완벽히 해내십니다.',
  'q3a1_1': '약간 서툴거나 시간이 지체되지만 스스로 닦고 옷 정리를 하십니다.',
  'q3a1_2': '손에 힘이 없거나 통증으로 인해 엉덩이를 닦아줄 때 가벼운 부축이 필요합니다.',
  'q3a1_3': '용변 뒤처리를 보호자가 물티슈 등으로 다 닦아주고 옷도 정리해 주어야 합니다.',
  'q3a1_4': '스스로 위생 관리를 하려는 의도나 시도 자체가 불가능한 중증 상태입니다.',

  'q3a2_0': '화장실 용변 후에 혼자서 닦고 옷 입기까지 완벽히 해내십니다.',
  'q3a2_1': '약간 서툴거나 시간이 지체되지만 스스로 닦고 옷 정리를 하십니다.',
  'q3a2_2': '손에 힘이 없거나 통증으로 인해 엉덩이를 닦아줄 때 가벼운 부축이 필요합니다.',
  'q3a2_3': '용변 뒤처리를 보호자가 물티슈 등으로 다 닦아주고 옷도 정리해 주어야 합니다.',
  'q3a2_4': '스스로 위생 관리를 하려는 의도나 시도 자체가 불가능한 중증 상태입니다.',

  'q3b1_0': '화장실 용변 후에 혼자서 닦고 옷 입기까지 완벽히 해내십니다.',
  'q3b1_1': '약간 서툴거나 시간이 지체되지만 스스로 닦고 옷 정리를 하십니다.',
  'q3b1_2': '손에 힘이 없거나 통증으로 인해 엉덩이를 닦아줄 때 가벼운 부축이 필요합니다.',
  'q3b1_3': '용변 뒤처리를 보호자가 물티슈 등으로 다 닦아주고 옷도 정리해 주어야 합니다.',
  'q3b1_4': '스스로 위생 관리를 하려는 의도나 시도 자체가 불가능한 중증 상태입니다.',

  'q3b2_0': '화장실 용변 후에 혼자서 닦고 옷 입기까지 완벽히 해내십니다.',
  'q3b2_1': '약간 서툴거나 시간이 지체되지만 스스로 닦고 옷 정리를 하십니다.',
  'q3b2_2': '손에 힘이 없거나 통증으로 인해 엉덩이를 닦아줄 때 가벼운 부축이 필요합니다.',
  'q3b2_3': '용변 뒤처리를 보호자가 물티슈 등으로 다 닦아주고 옷도 정리해 주어야 합니다.',
  'q3b2_4': '스스로 위생 관리를 하려는 의도나 시도 자체가 불가능한 중증 상태입니다.',

  'q3_ceiling': '천장 레일 및 슬링 모터 장착을 위한 튼튼한 하중 공사가 가능합니다.',
  'q3_wall': '방 또는 화장실에 관절식 회전 암 지지대를 박아 고정할 옹벽이 있습니다.',
  'q3_movable': '집을 훼손하거나 타공을 뚫는 공사는 일절 어려운 환경입니다.',
  'q3_narrow': '침대 밑 공간이 막혀 있거나 휠체어 회전 반경이 좁아 주행이 어렵습니다.',
  'q3_home': '보호자 1인이 돌보는 일반 단독주택이나 아파트 가정 환경입니다.',
  'q3_facility': '이동 통로가 넓고 턱이 없는 요양원, 요양병원 등 전문 의료기관입니다.'
};

const CustomNode = ({ data }: { data: any }) => {
  const {
    id,
    label,
    typeLabel,
    isResult,
    isActive,
    isCompleted,
    isHighlightedResult,
    nodeW,
    nodeH,
    options,
    type,
    onNodeClick,
    onSingleSelect,
    onMultiSelectClick,
    completedText,
  } = data;

  return (
    <div
      onClick={() => onNodeClick(id)}
      className={`flex flex-col justify-between rounded-xl border p-3 select-none transition-all duration-300 ${
        isHighlightedResult
          ? 'border-primary bg-primary text-white shadow-lg scale-[1.04] z-20 cursor-default'
          : isActive
            ? 'border-primary bg-white shadow-md ring-2 ring-primary/10 z-20 cursor-default scale-[1.02]'
            : isCompleted
              ? 'border-slate-300 bg-white hover:border-primary/50 shadow-sm cursor-pointer hover:shadow'
              : 'border-slate-100 bg-white opacity-40 grayscale pointer-events-none'
      }`}
      style={{
        width: `${nodeW}px`,
        minHeight: `${nodeH}px`,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#cbd5e1', width: '8px', height: '8px' }} />
      <div className="space-y-1">
        <div className="flex justify-between items-center w-full">
          <span className={`text-[8px] font-black uppercase tracking-wider ${
            isHighlightedResult ? 'text-white/80' : isActive ? 'text-primary' : 'text-slate-400'
          }`}>
            {typeLabel}
          </span>
          
          {isCompleted && (
            <span className="text-emerald-500 bg-emerald-50 w-3.5 h-3.5 rounded-full flex items-center justify-center border border-emerald-200">
              <Check className="w-2.5 h-2.5 stroke-[4]" />
            </span>
          )}
        </div>

        <h4 className={`text-xs leading-snug font-bold ${
          isHighlightedResult ? 'text-white' : 'text-slate-800'
        }`}>
          {label}
        </h4>
      </div>

      {isActive && !isResult && (
        <div className="pt-2 flex flex-wrap gap-1 border-t border-slate-100 mt-1 shrink-0">
          {type === 'single' ? (
            options.map((opt: any) => (
              <button
                key={opt.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSingleSelect(id, opt.value);
                }}
                className="flex-1 text-[8px] sm:text-[9px] font-extrabold px-1 py-0.5 rounded bg-primary/5 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all text-center whitespace-nowrap cursor-pointer"
              >
                {getShortOptionText(opt.text)}
              </button>
            ))
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMultiSelectClick(id);
              }}
              className="w-full text-[8px] sm:text-[9px] font-extrabold py-0.5 rounded bg-primary text-white text-center hover:bg-primary-dark transition-colors cursor-pointer"
            >
              오른쪽 패널에서 조건 입력
            </button>
          )}
        </div>
      )}

      {isCompleted && !isResult && completedText && (
        <div className="text-[9px] text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 mt-1 truncate font-bold text-center">
          {completedText}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} style={{ background: '#cbd5e1', width: '8px', height: '8px' }} />
    </div>
  );
};

export function getDisplayText<T extends Record<string, any>>(
  item: T | null | undefined,
  field: keyof T,
  uiMode: 'simple' | 'detail'
): string {
  if (!item) return '';
  if (uiMode === 'simple') {
    const simpleField = `simple${String(field).charAt(0).toUpperCase()}${String(field).slice(1)}`;
    if (item[simpleField] !== undefined) {
      return String(item[simpleField]);
    }
  }
  return String(item[field] || '');
}

export default function AlgorithmRunner({ algorithm, mode, uiMode = 'detail', onPathChange, onLearnMore }: AlgorithmRunnerProps) {
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(algorithm.startQuestionId);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [history, setHistory] = useState<string[]>([]);
  const [resultId, setResultId] = useState<string | null>(null);

  // Guide panel tracking
  const [selectedGuideQuestionId, setSelectedGuideQuestionId] = useState<string | null>(algorithm.startQuestionId);
  const [tempMultiSelect, setTempMultiSelect] = useState<string[]>([]);

  // Detailed mode map collapsible & zoom states
  const [showDecisionMap, setShowDecisionMap] = useState(false);
  const [zoom, setZoom] = useState(0.3);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleFitView = () => {
    if (wrapperRef.current) {
      const wrapperWidth = wrapperRef.current.clientWidth;
      const logicalWidth = 3110;
      const fitScale = Math.max(0.15, Math.min(wrapperWidth / logicalWidth, 1.0));
      setZoom(fitScale);
    }
  };

  useEffect(() => {
    if (showDecisionMap) {
      setTimeout(handleFitView, 100);
    }
  }, [showDecisionMap]);

  const isTransfer = algorithm.id === 'transfer';
  const nodes = isTransfer ? transferNodes : toiletingNodes;
  const edges = isTransfer ? transferEdges : toiletingEdges;

  const currentQuestion = currentQuestionId ? algorithm.questions[currentQuestionId] : null;

  // Keep selected guide synced with active question
  useEffect(() => {
    if (currentQuestionId) {
      setSelectedGuideQuestionId(currentQuestionId);
    }
  }, [currentQuestionId]);

  const getGuideKey = (qId: string | null) => {
    if (!qId) return '';
    return algorithm.id === 'toileting' && ['q1', 'q2_a', 'q2_b', 'q3_a1', 'q3_a2', 'q3_b1', 'q3_b2'].includes(qId)
      ? `toileting_${qId}`
      : qId;
  };

  const selectedGuide = selectedGuideQuestionId ? learningGuides[getGuideKey(selectedGuideQuestionId)] : null;

  const handleSingleSelect = (qId: string, optionValue: string) => {
    let currentHistory = [...history];
    let currentAnswers = { ...answers };

    if (history.includes(qId)) {
      const idx = history.indexOf(qId);
      currentHistory = history.slice(0, idx);
      history.slice(idx).forEach(id => {
        delete currentAnswers[id];
      });
      setResultId(null);
    }

    const updatedAnswers = { ...currentAnswers, [qId]: optionValue };
    const newHistory = [...currentHistory, qId];

    setAnswers(updatedAnswers);
    setHistory(newHistory);

    if (onPathChange) {
      onPathChange([...newHistory, optionValue]);
    }

    resolveNextStep(qId, updatedAnswers, newHistory);
  };

  const handleMultiToggle = (optionValue: string) => {
    if (tempMultiSelect.includes(optionValue)) {
      setTempMultiSelect(tempMultiSelect.filter((v) => v !== optionValue));
    } else {
      setTempMultiSelect([...tempMultiSelect, optionValue]);
    }
  };

  const handleMultiSubmit = (qId: string) => {
    if (tempMultiSelect.length === 0) {
      alert('최소 하나 이상의 옵션을 선택해주세요.');
      return;
    }

    let currentHistory = [...history];
    let currentAnswers = { ...answers };

    if (history.includes(qId)) {
      const idx = history.indexOf(qId);
      currentHistory = history.slice(0, idx);
      history.slice(idx).forEach(id => {
        delete currentAnswers[id];
      });
      setResultId(null);
    }

    const updatedAnswers = { ...currentAnswers, [qId]: tempMultiSelect };
    const newHistory = [...currentHistory, qId];

    setAnswers(updatedAnswers);
    setHistory(newHistory);

    if (onPathChange) {
      onPathChange([...newHistory, tempMultiSelect.join(',')]);
    }

    resolveNextStep(qId, updatedAnswers, newHistory);
  };

  const resolveNextStep = (qId: string, currentAnswers: Record<string, any>, currentHistory: string[]) => {
    const question = algorithm.questions[qId];
    let nextId: string | null = null;
    let resId: string | null = null;

    if (question.nextQuestionId) {
      if (typeof question.nextQuestionId === 'function') {
        nextId = question.nextQuestionId(currentAnswers);
      } else {
        nextId = question.nextQuestionId;
      }
    }

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
      setSelectedGuideQuestionId(qId);
    } else if (nextId) {
      setCurrentQuestionId(nextId);
      const nextQuestion = algorithm.questions[nextId];
      if (nextQuestion && nextQuestion.type === 'multi') {
        setTempMultiSelect(currentAnswers[nextId] || []);
      }
    } else {
      alert('알고리즘 분기 경로를 매칭할 수 없습니다.');
    }
  };

  const handleNodeClick = (nodeId: string) => {
    if (nodes[nodeId]?.isResult) return;
    
    setSelectedGuideQuestionId(nodeId);

    // Rollback to clicked node
    if (history.includes(nodeId)) {
      const idx = history.indexOf(nodeId);
      const newHistory = history.slice(0, idx);
      const newAnswers = { ...answers };

      history.slice(idx).forEach(qId => {
        delete newAnswers[qId];
      });

      setHistory(newHistory);
      setCurrentQuestionId(nodeId);
      setResultId(null);
      setAnswers(newAnswers);

      const clickedQuestion = algorithm.questions[nodeId];
      if (clickedQuestion && clickedQuestion.type === 'multi') {
        setTempMultiSelect(newAnswers[nodeId] || []);
      }

      if (onPathChange) {
        onPathChange(newHistory);
      }
    }
  };

  const handlePrevQuestion = () => {
    if (history.length === 0) return;
    const lastQuestionId = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    const newAnswers = { ...answers };
    delete newAnswers[lastQuestionId];

    setAnswers(newAnswers);
    setHistory(newHistory);
    setResultId(null);
    setCurrentQuestionId(lastQuestionId);
    
    const prevQuestion = algorithm.questions[lastQuestionId];
    if (prevQuestion && prevQuestion.type === 'multi') {
      setTempMultiSelect(newAnswers[lastQuestionId] || []);
    } else {
      setTempMultiSelect([]);
    }

    if (onPathChange) {
      onPathChange(newHistory);
    }
  };

  const handleReset = () => {
    setCurrentQuestionId(algorithm.startQuestionId);
    setAnswers({});
    setHistory([]);
    setResultId(null);
    setTempMultiSelect([]);
    setSelectedGuideQuestionId(algorithm.startQuestionId);
    if (onPathChange) {
      onPathChange([]);
    }
  };

  // Node dimensions config
  const getNodeWidth = (id: string) => {
    if (!isTransfer && id.startsWith('B-')) return 110;
    return 170;
  };
  const getNodeHeight = (id: string) => {
    const node = nodes[id];
    if (node?.isResult) return 76;
    return 96;
  };

  const getBezierPath = (x1: number, y1: number, x2: number, y2: number) => {
    const controlY = y1 + (y2 - y1) * 0.45;
    return `M ${x1} ${y1} C ${x1} ${controlY}, ${x2} ${y1 + (y2 - y1) * 0.55}, ${x2} ${y2}`;
  };

  const isEdgeActive = (edge: typeof edges[0]) => {
    if (!history.includes(edge.from)) return false;
    return edge.condition(answers);
  };

  const getNodeStatus = (nodeId: string) => {
    if (nodeId === resultId) return 'result-active';
    if (nodeId === currentQuestionId) return 'active';
    if (history.includes(nodeId)) return 'completed';
    return 'inactive';
  };

  // Render Simple UI Mode (Single Card Wizard)
  if (uiMode === 'simple') {
    const prog = (() => {
      const questionId = currentQuestionId;
      if (!questionId) return { current: 0, total: 1 };
      const transferProgress: Record<string, { current: number; total: number }> = {
        q1: { current: 1, total: 4 },
        q2: { current: 2, total: 4 },
        q3: { current: 3, total: 4 },
        q4: { current: 3, total: 4 },
        q3_1: { current: 4, total: 4 },
        q3_2: { current: 4, total: 4 }
      };
      const toiletingProgress: Record<string, { current: number; total: number }> = {
        q1: { current: 1, total: 3 },
        q2_a: { current: 2, total: 3 },
        q2_b: { current: 2, total: 3 },
        q3_a1: { current: 3, total: 3 },
        q3_a2: { current: 3, total: 3 },
        q3_b1: { current: 3, total: 3 },
        q3_b2: { current: 3, total: 3 }
      };
      
      if (questionId in transferProgress) return transferProgress[questionId];
      if (questionId in toiletingProgress) return toiletingProgress[questionId];
      return { current: history.length + 1, total: history.length + 1 };
    })();

    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* Wizard Main Card */}
        {resultId ? (
          // Matched Recommendation screen in Simple Mode
          <div className="space-y-8 animate-fade-in w-full max-w-2xl mx-auto">
            {/* Header: 추천 결과 안내 */}
            <div className="text-center space-y-2 pb-4 border-b border-slate-100">
              <span className="text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                나에게 맞는 돌봄로봇 추천 결과
              </span>
              <h2 className="text-3xl font-black text-slate-800 pt-2 leading-snug">
                진단 결과가 나왔습니다
              </h2>
            </div>

            {/* Simple Result Card */}
            <SimpleResultCard
              recommendation={algorithm.results[resultId]?.simpleRecommendation || algorithm.results[resultId]?.recommendation}
              reason={algorithm.results[resultId]?.simpleReason || algorithm.results[resultId]?.reason}
              whenToUse={algorithm.results[resultId]?.simpleResultSummary || resultDetails[resultId]?.whenToUse}
              precautions={algorithm.results[resultId]?.simpleTips || resultDetails[resultId]?.precautions}
            />

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-250">
              {onLearnMore && (
                <button
                  onClick={() => onLearnMore(resultId)}
                  className="flex-1 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-md transition-all flex items-center justify-center gap-1.5 hover:shadow-lg cursor-pointer"
                >
                  <span>상세 돌봄로봇 정보 더 알아보기</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={handleReset}
                className="py-4 px-8 rounded-2xl border border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-850 font-bold text-base transition-colors cursor-pointer"
              >
                처음부터 다시 진단하기
              </button>
            </div>
          </div>
        ) : (
          // Question card in Simple Mode
          currentQuestion && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6 animate-fade-in flex flex-col text-left">
              {/* Progress Bar & indicator */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${(prog.current / prog.total) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-400 shrink-0">
                  {prog.current} / {prog.total}
                </span>
              </div>

              {/* Question title & description with circular illustration icon */}
              <div className="space-y-4 text-center sm:text-left">
                {currentQuestion.iconType && simpleIconMap[currentQuestion.iconType] && (
                  <div className="flex justify-center sm:justify-start mb-2">
                    {simpleIconMap[currentQuestion.iconType]}
                  </div>
                )}
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 leading-snug">
                  {getDisplayText(currentQuestion, 'title', uiMode)}
                </h3>
                {getDisplayText(currentQuestion, 'description', uiMode) && (
                  <p className="text-sm sm:text-base text-slate-550 leading-relaxed font-bold bg-slate-50 p-4 rounded-xl border border-slate-100/60 text-left">
                    💡 {getDisplayText(currentQuestion, 'description', uiMode)}
                  </p>
                )}
              </div>

              {/* Render Options as Large Button Cards */}
              {currentQuestion.type === 'single' ? (
                <div className="space-y-3">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = answers[currentQuestion.id] === opt.value;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSingleSelect(currentQuestion.id, opt.value)}
                        className={`w-full text-left p-5 sm:p-6 rounded-2xl border-2 transition-all flex items-center justify-between font-extrabold shadow-sm cursor-pointer ${
                          isSelected
                            ? 'border-primary bg-primary/5 text-primary scale-[1.01]'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-355 hover:bg-slate-50/50'
                        }`}
                      >
                        <span className="text-lg sm:text-xl">
                          {getDisplayText(opt, 'text', uiMode)}
                        </span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-primary bg-primary text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {currentQuestion.options.map((opt) => {
                      const isChecked = tempMultiSelect.includes(opt.value);
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleMultiToggle(opt.value)}
                          className={`text-left p-5 sm:p-6 rounded-2xl border-2 transition-all flex items-center justify-between font-extrabold shadow-sm cursor-pointer ${
                            isChecked
                              ? 'border-primary bg-primary/5 text-primary scale-[1.01]'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                          }`}
                        >
                          <span className="text-lg sm:text-xl">
                            {getDisplayText(opt, 'text', uiMode)}
                          </span>
                          <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all shrink-0 ${
                            isChecked ? 'border-primary bg-primary text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => handleMultiSubmit(currentQuestion.id)}
                    disabled={tempMultiSelect.length === 0}
                    className="w-full py-4 rounded-xl bg-primary text-white font-extrabold text-base hover:bg-primary-dark transition-all flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>선택 완료</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Navigation Back / Reset */}
              <div className="flex justify-between items-center pt-5 border-t border-slate-100">
                {history.length > 0 ? (
                  <button
                    onClick={handlePrevQuestion}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors font-bold text-sm cursor-pointer flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>이전 질문</span>
                  </button>
                ) : <div />}
                
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:text-red-650 text-slate-400 hover:border-red-100 transition-colors font-bold text-sm cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>처음부터 다시</span>
                </button>
              </div>
            </div>
          )
        )}
      </div>
    );
  }

  // Render Detailed UI Mode (React Flow interactive flowchart)
  return (
    <div className="w-full space-y-6">
      
      {/* Top Header Panel */}
      <div className="flex flex-wrap justify-between items-center bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm gap-4">
        <div className="text-left">
          <span className="text-xs font-black text-primary uppercase tracking-wider block mb-0.5">자가 진단 및 흐름 학습</span>
          <h3 className="text-sm font-bold text-slate-700 leading-snug">아래의 상세 단계를 따라 진단을 진행하고 평가 기준을 학습해 보세요.</h3>
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 hover:border-red-200 border border-slate-200 bg-white rounded-xl shadow-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>진단 초기화</span>
        </button>
      </div>

      {/* Collapsible Decision Map Section */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <button
          onClick={() => setShowDecisionMap(!showDecisionMap)}
          className="w-full py-4 px-6 bg-slate-50/70 hover:bg-slate-100/80 transition-all font-bold text-sm text-slate-700 flex justify-between items-center cursor-pointer border-b border-slate-200/60"
        >
          <span className="flex items-center gap-2">
            <GitMerge className="w-4 h-4 text-primary animate-pulse" />
            <span>의사결정 지도 보기</span>
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDecisionMap ? 'rotate-180' : ''}`} />
        </button>

        {showDecisionMap && (
          <div className="w-full border-t border-slate-100 flex flex-col bg-slate-50/30">
            <div className="p-3 bg-slate-100/50 border-b border-slate-200 flex justify-between items-center px-6 shrink-0 text-xs">
              <div className="text-left">
                <span className="font-extrabold text-slate-700">의사결정 지도</span>
                <p className="text-[10px] text-slate-400 mt-0.5">지도의 카드를 클릭하여 단계를 확인해 보세요.</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setZoom(z => Math.max(0.15, z - 0.1))} 
                  className="p-1 px-2.5 bg-white border border-slate-200 rounded text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 cursor-pointer"
                >
                  -
                </button>
                <span className="text-[10px] font-bold text-slate-400 min-w-10 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button 
                  onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} 
                  className="p-1 px-2.5 bg-white border border-slate-200 rounded text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 cursor-pointer"
                >
                  +
                </button>
                <button 
                  onClick={handleFitView} 
                  className="p-1 px-2 bg-white border border-slate-200 rounded text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 cursor-pointer flex items-center gap-1"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>화면맞춤</span>
                </button>
              </div>
            </div>

            <div 
              ref={wrapperRef}
              className="w-full overflow-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 bg-slate-50/10"
              style={{ maxHeight: '550px' }}
            >
              <div 
                ref={containerRef}
                className="relative select-none origin-top-left"
                style={{ 
                  width: '3110px', 
                  height: isTransfer ? '1100px' : '700px',
                  transform: `scale(${zoom})`,
                  transition: 'transform 0.15s ease-out'
                }}
              >
                {/* SVG Layer for Drawing Bezier Curves */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  {edges.map((edge, idx) => {
                    const fromNode = nodes[edge.from];
                    const toNode = nodes[edge.to];
                    if (!fromNode || !toNode) return null;

                    const parentW = getNodeWidth(edge.from);
                    const parentH = getNodeHeight(edge.from);
                    const childW = getNodeWidth(edge.to);

                    // Port coordinates (Bottom Center to Top Center)
                    const startX = fromNode.x + parentW / 2;
                    const startY = fromNode.y + parentH;
                    const endX = toNode.x + childW / 2;
                    const endY = toNode.y;

                    const active = isEdgeActive(edge);

                    return (
                      <g key={`${edge.from}-${edge.to}-${idx}`}>
                        {/* Connection Line */}
                        <path
                          d={getBezierPath(startX, startY, endX, endY)}
                          fill="none"
                          stroke={active ? '#2563EB' : '#E2E8F0'}
                          strokeWidth={active ? 4.0 : 1.5}
                          className="transition-all duration-300"
                        />
                      </g>
                    );
                  })}

                  {/* SVG Middle-Labels for conditions */}
                  {edges.map((edge, idx) => {
                    const fromNode = nodes[edge.from];
                    const toNode = nodes[edge.to];
                    if (!fromNode || !toNode) return null;

                    const parentW = getNodeWidth(edge.from);
                    const parentH = getNodeHeight(edge.from);
                    const childW = getNodeWidth(edge.to);

                    const startX = fromNode.x + parentW / 2;
                    const startY = fromNode.y + parentH;
                    const endX = toNode.x + childW / 2;
                    const endY = toNode.y;

                    const active = isEdgeActive(edge);

                    // Midpoint of Bezier curve
                    const midX = (startX + endX) / 2;
                    const midY = (startY + endY) / 2;

                    return (
                      <foreignObject
                        key={`label-${edge.from}-${edge.to}-${idx}`}
                        x={midX - 50}
                        y={midY - 12}
                        width={100}
                        height={24}
                        className="foreign-object overflow-visible pointer-events-none"
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border shadow-sm tracking-tight transition-all duration-300 ${
                            active 
                              ? 'bg-primary text-white border-primary scale-105 shadow-sm' 
                              : 'bg-white text-slate-400 border-slate-200'
                          }`}>
                            {edge.label}
                          </span>
                        </div>
                      </foreignObject>
                    );
                  })}
                </svg>

                {/* HTML Absolute Nodes Layer */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                  {Object.entries(nodes).map(([id, node]) => {
                    const status = getNodeStatus(id);
                    const nodeW = getNodeWidth(id);
                    const nodeH = getNodeHeight(id);

                    const isActive = status === 'active';
                    const isCompleted = status === 'completed';
                    const isResult = node.isResult;
                    const isHighlightedResult = status === 'result-active';

                    return (
                      <div
                        key={id}
                        onClick={() => handleNodeClick(id)}
                        className={`absolute pointer-events-auto flex flex-col justify-between rounded-xl border p-3 select-none transition-all duration-300 ${
                          isHighlightedResult
                            ? 'border-2 border-primary bg-primary text-white shadow-lg scale-[1.04] z-20 cursor-default ring-4 ring-primary/30'
                            : isActive
                              ? 'border-2 border-primary bg-primary/5 shadow-md ring-4 ring-primary/20 scale-[1.02] z-20 cursor-default'
                              : isCompleted
                                ? 'border-sky-300 bg-sky-50 text-slate-800 shadow-sm cursor-pointer hover:shadow-md hover:border-sky-400'
                                : 'border-slate-200 bg-slate-100 text-slate-400 opacity-75 cursor-not-allowed pointer-events-none'
                        }`}
                        style={{
                          left: `${node.x}px`,
                          top: `${node.y}px`,
                          width: `${nodeW}px`,
                          height: `${nodeH}px`,
                        }}
                      >
                        <div className="space-y-1">
                          {/* Card Top Label */}
                          <div className="flex justify-between items-center w-full">
                            <span className={`text-[8px] font-black uppercase tracking-wider ${
                              isHighlightedResult ? 'text-white/80' : isActive ? 'text-primary' : 'text-slate-400'
                            }`}>
                              {node.typeLabel}
                            </span>
                            
                            {/* Completed checkmark */}
                            {isCompleted && (
                              <span className="text-emerald-500 bg-emerald-50 w-3.5 h-3.5 rounded-full flex items-center justify-center border border-emerald-200">
                                <Check className="w-2.5 h-2.5 stroke-[4]" />
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h4 className={`text-xs leading-snug font-bold text-left ${
                            isHighlightedResult ? 'text-white' : 'text-slate-800'
                          }`}>
                            {node.label}
                          </h4>
                        </div>

                        {/* Card Bottom Quick Action Interface */}
                        {isActive && !isResult && (
                          <div className="pt-2 flex flex-wrap gap-1 border-t border-slate-100 mt-1 shrink-0">
                            {algorithm.questions[id]?.type === 'single' ? (
                              algorithm.questions[id].options.map((opt) => (
                                <button
                                  key={opt.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSingleSelect(id, opt.value);
                                  }}
                                  className="flex-1 text-[8px] sm:text-[9px] font-extrabold px-1 py-0.5 rounded bg-primary/5 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all text-center whitespace-nowrap cursor-pointer"
                                >
                                  {getShortOptionText(opt.text)}
                                </button>
                              ))
                            ) : (
                              <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedGuideQuestionId(id);
                                }}
                                className="w-full text-[8px] sm:text-[9px] font-extrabold py-0.5 rounded bg-primary text-white text-center hover:bg-primary-dark transition-colors cursor-pointer"
                              >
                                조건 입력
                              </button>
                            )}
                          </div>
                        )}

                        {/* Selected result/badge for completed questions */}
                        {isCompleted && !isResult && (
                          <div className="text-[9px] text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 mt-1 truncate font-bold text-center">
                            {(() => {
                              const ans = answers[id];
                              const q = algorithm.questions[id];
                              if (!q) return '';
                              if (q.type === 'single') {
                                const matchedOpt = q.options.find(o => o.value === ans);
                                return matchedOpt ? getShortOptionText(matchedOpt.text) : '';
                              } else if (Array.isArray(ans)) {
                                return `${ans.length}개 조건`;
                              }
                              return '';
                            })()}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Active Question / Result Details & Path History */}
        <div className="lg:col-span-8 w-full space-y-6">
          {resultId ? (
            /* Result Details Card in Detailed Mode */
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden animate-fade-in flex flex-col text-left">
              <div className="bg-primary px-6 py-4 text-white">
                <span className="text-[10px] font-black text-white/80 uppercase tracking-widest block">자가 진단 최종 매칭</span>
                <h3 className="font-extrabold text-sm sm:text-base leading-tight">자가평가 결과</h3>
              </div>

              <div className="p-6 space-y-6 flex-1">
                {/* Result Title */}
                <div className="text-center pb-5 border-b border-slate-100 space-y-2">
                  <span className="text-[9px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    최적 추천 돌봄로봇
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-800 pt-1 tracking-tight leading-snug">
                    {resultDetails[resultId]?.deviceName || algorithm.results[resultId]?.title}
                  </h2>
                </div>

                {/* Device representative Image */}
                {resultDetails[resultId]?.image ? (
                  <div className="relative mx-auto w-48 h-48 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-3">
                    <Image
                      src={resultDetails[resultId].image}
                      alt={resultDetails[resultId].deviceName}
                      fill
                      className="object-contain p-2 hover:scale-105 transition-transform duration-300"
                      priority
                    />
                  </div>
                ) : (
                  <div className="mx-auto w-48 h-48 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-350 text-xs">
                    이미지 준비 중
                  </div>
                )}

                {/* Details layout: grid of 3 key cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* When to use */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2 col-span-2">
                    <h5 className="font-bold text-slate-400 tracking-wide uppercase text-[10px]">사용 조건 / 상황</h5>
                    <p className="text-slate-700 font-semibold leading-relaxed text-sm">
                      {resultDetails[resultId]?.whenToUse}
                    </p>
                  </div>

                  {/* Pros */}
                  {resultDetails[resultId]?.pros && (
                    <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 space-y-2">
                      <h5 className="font-bold text-emerald-700 tracking-wide uppercase text-[10px] flex items-center gap-1 font-extrabold">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        주요 장점
                      </h5>
                      <ul className="space-y-1 text-emerald-800 font-semibold list-disc pl-4 leading-relaxed">
                        {resultDetails[resultId].pros.map((pro, idx) => (
                          <li key={idx}>{pro}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Precautions */}
                  {resultDetails[resultId]?.precautions && (
                    <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 space-y-2">
                      <h5 className="font-bold text-amber-700 tracking-wide uppercase text-[10px] flex items-center gap-1 font-extrabold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        사용 시 유의사항
                      </h5>
                      <ul className="space-y-1 text-amber-850 font-semibold list-disc pl-4 leading-relaxed">
                        {resultDetails[resultId].precautions.map((pre, idx) => (
                          <li key={idx}>{pre}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Additional Clinical details */}
                <div className="space-y-4 border-t border-slate-100 pt-6 text-xs leading-normal">
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-400 tracking-wide uppercase text-[10px]">매칭 매커니즘 / 임상 근거</h5>
                    <p className="text-slate-600 font-semibold leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {resultDetails[resultId]?.reason || algorithm.results[resultId]?.reason}
                    </p>
                  </div>

                  {resultDetails[resultId]?.environment && (
                    <div className="space-y-1">
                      <h5 className="font-bold text-slate-400 tracking-wide uppercase text-[10px]">설치 및 권장 주거 환경</h5>
                      <p className="text-slate-750 font-extrabold">
                        ✓ {resultDetails[resultId].environment}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="space-y-3 pt-6 border-t border-slate-100 mt-6 shrink-0">
                  {onLearnMore && (
                    <button
                      onClick={() => onLearnMore(resultId)}
                      className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-1.5 hover:shadow-lg scale-[1.01] cursor-pointer"
                    >
                      <span>상세 돌봄로봇 정보 더 알아보기</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={handleReset}
                    className="w-full py-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-bold text-sm transition-colors cursor-pointer"
                  >
                    새로운 진단 시작하기
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Active Question Card in Detailed Mode */
            currentQuestion && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6 animate-fade-in flex flex-col text-left">
                {/* Header indicators */}
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <span className="text-[10px] font-black text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 inline-block shrink-0">
                    STEP {history.length + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    평가 세부 문항
                  </span>
                </div>

                {/* Question title & description */}
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
                    {getDisplayText(currentQuestion, 'title', uiMode)}
                  </h3>
                  {getDisplayText(currentQuestion, 'description', uiMode) && (
                    <p className="text-sm text-slate-550 leading-relaxed font-bold bg-slate-50 p-4 rounded-xl border border-slate-100/60">
                      💡 {getDisplayText(currentQuestion, 'description', uiMode)}
                    </p>
                  )}
                </div>

                {/* Options list inside main area */}
                {currentQuestion.type === 'single' ? (
                  <div className="space-y-2.5">
                    {currentQuestion.options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleSingleSelect(currentQuestion.id, opt.value)}
                        className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-primary hover:bg-primary/5 transition-all flex justify-between items-center group font-bold text-slate-755 text-sm bg-white cursor-pointer shadow-sm hover:shadow"
                      >
                        <span>{opt.text}</span>
                        <div className="w-5 h-5 rounded-full border-slate-300 border-2 flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all shrink-0">
                          <div className="w-2.5 h-2.5 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform" />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-2.5">
                      {currentQuestion.options.map((opt) => {
                        const isChecked = tempMultiSelect.includes(opt.value);
                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleMultiToggle(opt.value)}
                            className={`text-left p-4 rounded-xl border transition-all flex items-center gap-3 font-bold text-sm cursor-pointer shadow-sm ${
                              isChecked
                                ? 'border-primary bg-primary/5 text-primary font-black'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all shrink-0 ${
                              isChecked ? 'border-primary bg-primary text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <span className="leading-snug">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => handleMultiSubmit(currentQuestion.id)}
                      disabled={tempMultiSelect.length === 0}
                      className="w-full py-3.5 rounded-xl bg-primary text-white font-extrabold text-sm hover:bg-primary-dark transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <span>선택 완료</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Back / Reset Controls */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 text-xs">
                  {history.length > 0 ? (
                    <button
                      onClick={handlePrevQuestion}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>이전 단계</span>
                    </button>
                  ) : <div />}
                  <button
                    onClick={handleReset}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all font-bold cursor-pointer"
                  >
                    처음부터 다시 진단하기
                  </button>
                </div>
              </div>
            )
          )}

          {/* Current Path Timeline (History list) */}
          {history.length > 0 && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3 text-left">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">자가진단 진행 과정</h4>
              <div className="relative border-l border-slate-200 ml-2.5 pl-4 space-y-4 py-2">
                {history.map((histId, index) => {
                  const q = algorithm.questions[histId];
                  if (!q) return null;
                  const ansVal = answers[histId];
                  const matchedOpt = q.options.find(o => o.value === ansVal);
                  return (
                    <div key={histId} className="relative text-xs">
                      {/* Node point marker */}
                      <span className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-white ring-2 ring-primary/20 inline-block" />
                      <div className="text-slate-600 font-bold leading-normal">
                        <span className="text-slate-400 mr-1.5 font-black">STEP {index + 1}:</span>
                        <span className="text-slate-800">{q.title}</span>
                        <div className="mt-1 text-primary font-black flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>선택한 답변: {matchedOpt ? matchedOpt.text : (Array.isArray(ansVal) ? `${ansVal.length}개 조건` : '')}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Detail Panel (Guide info) */}
        <div className="lg:col-span-4 w-full lg:sticky lg:top-6 space-y-6">
          {selectedGuide ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 animate-fade-in text-left">
              <div className="flex items-center gap-1.5 text-primary">
                <Info className="w-4 h-4 shrink-0" />
                <h4 className="font-extrabold text-sm leading-tight">
                  {selectedGuide.title}
                </h4>
              </div>
              
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                {selectedGuide.content}
              </p>

              <div className="border-t border-slate-100 pt-3 space-y-2">
                {selectedGuide.details.map((detail, idx) => (
                  <div key={idx} className="text-[11px] leading-relaxed font-medium">
                    <strong className="text-slate-700 block mb-0.5">{detail.key}</strong>
                    <span className="text-slate-400 block">{detail.val}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
              <p className="text-xs text-slate-400 font-semibold">알고리즘 단계를 선택하시면 임상 평가 기준과 설명이 여기에 표시됩니다.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
