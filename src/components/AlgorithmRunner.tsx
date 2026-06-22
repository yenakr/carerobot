'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Check, Info, HelpCircle, AlertTriangle, ThumbsUp, ArrowRight } from 'lucide-react';
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
  mode: 'learning';
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
    pros: ['바닥 공간을 전혀 차지하지 않아 통로가 좁은 방이나 화장실 입구에서도 이송이 편리함', '천장 레일 모터를 통해 보호자 단 한 명으로도 대상자를 안전하게 들어 올려 공중 이동 가능'],
    precautions: ['리프트 하중을 버틸 수 있도록 건물 천장 옹벽의 보강 공사가 필수적으로 수반됩니다.', '레일이 고정되어 있어 레일 경로를 벗어난 다른 방으로의 이동은 불가능합니다.'],
    environment: '천장 구조물 보강이 가능한 콘크리트 슬라브 가옥',
    reason: '천장 레일 시공이 가능하며, 하지와 상체 근력이 모두 저하되어 전신을 매달아야 하므로 바닥 차지가 없는 가장 편리한 천장 고정형이 추천됩니다.'
  },
  'T-F': {
    deviceName: '벽 고정형 리프트',
    image: '/images/wall_lift.png',
    whenToUse: '천장 레일 공사는 불가능하지만 침대 옆에 단단한 콘크리트 옹벽이 존재하는 경우',
    pros: ['천장에 구멍을 뚫지 않고도 침대 인근의 단단한 벽면 기둥 고정만으로 리프트 설치 가능', '사용하지 않을 때는 벽면 방향으로 스윙 암을 깔끔하게 접어둘 수 있어 공간 효율성 우수'],
    precautions: ['벽체가 옹벽(내력벽)이 아닌 석고보드나 가벽일 경우 기둥이 이탈할 수 있으니 사전 진단 필수', '벽면 암의 회전 반경 내로만 이동 범위가 제한됨'],
    environment: '콘크리트 옹벽이 배치된 침실 벽면',
    reason: '천장 공사는 곤란하지만 단단한 옹벽이 옆에 위치하여, 벽면 스윙 암 방식으로 환자를 공중 이송하는 리프트입니다.'
  },
  'T-G': {
    deviceName: '이동식 리프트 (바퀴식 슬링 리프트)',
    image: '/images/mobile_sling_lift.png',
    whenToUse: '천장이나 벽 타공 공사가 일절 불가하며, 여러 방과 거실 등을 자유롭게 이동해야 하는 경우',
    pros: ['고정식 시공 공사가 불필요하여 즉시 도입이 가능하고 세입자 가구에 최적화됨', '바퀴식 프레임을 밀고 이동하므로 거실, 방, 부엌 등 가옥 내 여러 장소를 자유롭게 전환 가능'],
    precautions: ['바닥에 문턱이나 단차가 있을 경우 바퀴 주행이 멈추거나 흔들려 낙상 위험이 생길 수 있습니다.', '리프트 하부 프레임이 침대 밑이나 휠체어 아래로 들어갈 수 있는 공간적 틈새가 필요합니다.'],
    environment: '바닥 문턱이 없고 침대 밑 공간이 확보된 가옥',
    reason: '가옥 훼손 공사가 절대 불가능한 세입자 환경이거나 여러 방으로 이동하며 사용해야 하므로, 바퀴식 프레임을 지탱하는 이동형 슬링 리프트가 가장 적절합니다.'
  },
  'T-H': {
    deviceName: '이동식 겐트리 리프트 (독립 프레임 리프트)',
    image: '/images/gantry_lift.png',
    whenToUse: '천장/벽 타공 훼손은 불가하지만 침대 위에 독립적인 조립식 레일 프레임 설치 공간이 있는 고령자',
    pros: ['벽면이나 천장 훼손이 전혀 없어 주택 손상 없이 수직 리프트의 안전성 확보', '조립형 독립 프레임 형태로 이전 설치 및 해체가 간편함'],
    precautions: ['침대 주위에 기둥 프레임을 설치할 넓은 침실 공간이 필요합니다.', '기둥 연결부가 느슨해지지 않도록 정기적인 조임 상태를 점검해야 합니다.'],
    environment: '침대 주위에 가로 2m, 세로 2.5m 이상의 충분한 설치 공간 확보',
    reason: '벽이나 천장 공사가 일절 불가능하지만 독립적인 문형(겐트리) 프레임을 침대 위에 조립해 수직 이송하는 슬링 리프트입니다.'
  },

  // 배설돌봄 결과 기기 상세
  'B-A': {
    deviceName: '도움 불필요 (일반 배설 자립)',
    image: '',
    whenToUse: '인지, 화장실 이동, 용변 후 뒤처리 동작을 모두 아무 도움 없이 완수할 수 있는 상태',
    pros: ['스스로 배설을 통제하여 일상 근골격 기능 및 심리적 존엄성을 지속적으로 보존', '돌봄 제공자의 신체적 노동이 일절 발생하지 않음'],
    precautions: ['야간 화장실 이동 시 안전을 위해 센서등을 켜고 변기 옆 안전 바를 설치하는 편이 좋습니다.', '정기적인 건강 검진을 통해 실금 징후나 관절 염증 상태를 정기 검진하세요.'],
    environment: '일반 가정 화장실 및 주거 환경',
    reason: '배설과 관련된 모든 단계(요변의 인지, 화장실 보행, 위생 처리)에서 지장이 없는 건강한 상태입니다.'
  },
  'B-B': {
    deviceName: '비데 (자동 세정 양변기 시트)',
    image: '/images/hygiene_bidet.png',
    whenToUse: '생리적 인지와 화장실 이동은 스스로 하나, 손 관절염이나 오십견 등으로 항문 뒤처리가 힘든 고령자',
    pros: ['휴지 사용 대비 위생적이며 항문 주위 피부 쓸림 및 미세 상처 방지', '온수 세정과 온풍 건조 자동 구동을 통해 항문 및 요로 감염 질환을 예방함'],
    precautions: ['사용자가 변기 조작판의 작동 순서를 명확하게 인지하고 누를 수 있어야 합니다.', '노즐 세척과 필터 교체 등 세균 번식 방지를 위한 정기적인 위생 세척이 요구됩니다.'],
    environment: '일반 가정 내 화장실 양변기 공간',
    reason: '용변 인지와 보행력은 우수하여 변기 착석은 원활하지만, 위생 뒤처리를 독자적으로 완수하기 어렵기 때문에 자동 온수 비데 시트가 가장 추천됩니다.'
  },
  'B-C': {
    deviceName: '화장실 이동 보조 및 변기 리프트',
    image: '/images/toilet_lift.png',
    whenToUse: '의사와 뒤처리 능력은 충분하나, 하체 힘 약화로 변기에 착석/기립 시 낙상 우려가 큰 고령자',
    pros: ['변기 착석 및 일어서기 동작 시 하체 관절 압박 최소화 및 낙상 예방', '보호자의 부축 없이 독립적인 용변 기회 제공으로 심리적 만족 증대'],
    precautions: ['사용 중인 일반 양변기 외형 규격과 리프트 고정 장치와의 연결 호환성을 확인해야 합니다.', '기기 작동 시 갑작스러운 각도 상승에 놀라지 않도록 리프트 조작법 안내가 수반되어야 합니다.'],
    environment: '전원 연결 콘센트가 있고 리프트 프레임 장착이 가능한 화장실',
    reason: '배설 인지와 위생 뒤처리는 가능하지만, 기립 및 착석 단계에서 낙상 위험이 높아 관절을 전동으로 지지해주는 양변기 리프트가 필요합니다.'
  },
  'B-D': {
    deviceName: '이동 변기 (가구형 침상 변기)',
    image: '/images/toilet_lift.png',
    whenToUse: '요의/변의를 명확히 인지하고 뒤처리 능력도 일부 있으나, 보행 장애로 화장실 이동 자체가 불가한 경우',
    pros: ['침대 측면에 밀착 배치하여 침상 밖 보행 이동 시 일어나는 낙상 및 중간 실금 방지', '안전 손잡이와 바퀴가 내장되어 보호자의 도움으로 휠체어에서 스무스하게 슬라이딩 이승 가능'],
    precautions: ['용변 후 보호자가 바스켓의 오물을 바로 비워내고 위생 소독해야 하는 관리 부담이 존재합니다.', '실내 악취 확산을 억제하기 위해 밀폐 뚜껑 닫기 및 냄새 탈취 필터 관리가 필요합니다.'],
    environment: '침대 바로 옆 안방 공간',
    reason: '대소변 감각은 인지하지만 화장실 이동 및 옷 정리/뒤처리 능력에 전적인 장애가 있어, 침대 바로 옆에서 즉시 해결 가능한 이동 변기 솔루션이 권장됩니다.'
  },
  'B-E': {
    deviceName: '시간에 맞춘 배설 유도 프로그램',
    image: '/images/excretion_robot.png',
    whenToUse: '화장실로 걷고 뒤처리는 할 수 있지만, 인지 기능 저하로 요의를 못 느껴 상습적으로 실금하는 고령자',
    pros: ['일정한 시간 간격 유도로 실금율을 줄이고 방광 훈련 병행', '실금 방지를 통한 위생적인 피부 보호 및 보호자 의류 세탁 부담 경감'],
    precautions: ['환자의 하루 평균 배설 빈도를 측정하여 알림 주기를 꼼꼼히 관리해야 합니다.', '화장실 거부 행동 발생 시 강요하지 않고 정서적 유도를 통한 접근이 요구됩니다.'],
    environment: '화장실로 안전하게 이동할 수 있는 장애물 없는 주거 환경',
    reason: '화장실 이동력은 정상이지만, 인지 능력 저하로 배설 의사소통이 되지 않아 시간 알림을 통한 화장실 유도가 적절합니다.'
  },
  'B-F': {
    deviceName: '시간에 맞춘 배설 프로그램 및 비데 결합 적용',
    image: '/images/hygiene_bidet.png',
    whenToUse: '이동은 가능하나 배설 시기를 잘 인지하지 못하고 용변 후 잔여 위생 처리가 불가능한 고령자',
    pros: ['규칙적인 배설 유도로 실금을 방지하며, 비데를 통해 뒤처리 청결 보완', '화장실 보행 잔존 능력을 최대한 살리는 인지/위생 동시 보조'],
    precautions: ['스마트 센서 알림 시간에 맞춰 안전하게 화장실로 동반 이동', '비데 자동 조작 패널을 보호자가 대행하거나 자동 세정 모드 세팅 필요'],
    environment: '자동 물 내림 및 비데 장치가 연동될 수 있는 안전한 화장실',
    reason: '배설 인지 및 뒤처리 자립도가 모두 상실되었지만 화장실 이동 보행력은 남아있어, 시간 안내와 비데 자동 세정을 병합 제공합니다.'
  },
  'B-G': {
    deviceName: '자동배설로봇 (간헐적 침상 연결)',
    image: '/images/excretion_robot.png',
    whenToUse: '배설감을 못 느끼고 전혀 걸을 수 없는 와상 환자로, 야간이나 특정 시간대에 기저귀 대신 자동 처리를 원하는 고령자',
    pros: ['대소변 발생 즉시 음압 흡입, 온수 정밀 세정, 온풍 건조가 냄새 없이 자동 대행됨', '보호자의 야간 오물 청소 횟수를 비약적으로 줄여 수면의 질 개선'],
    precautions: ['흡입 패드 컵이 환자의 은밀한 부위에 정확히 밀착 조준 부착되어야 오물 누수가 없음', '주기적으로 정수통 채우기 및 오물 회수통 비우기 필요'],
    environment: '상시 전원 공급 및 침대 등받이 각도 조절이 편한 침상 환경',
    reason: '소변 감각 지각 및 화장실 보행이 모두 불가한 침상 와상 상태에서, 오물 감지 즉시 음압 진공으로 엉덩이를 씻겨주는 로봇을 배치하는 것이 타당합니다.'
  },
  'B-H': {
    deviceName: '흡인형 스마트 기저귀 로봇시스템 (24시간 지속 케어)',
    image: '/images/smart_diaper_robot.png',
    whenToUse: '24시간 침상에 완전히 누워 지내며 인지/이동/자조 능력을 모두 상실한 고령자',
    pros: ['기저귀 내부의 실시간 음압 수거 모듈이 대소변 즉시 감지하여 외부에 전혀 냄새를 유출하지 않고 청결 흡수', '엉덩이에 습기가 찰 틈 없이 지속적인 공기 순환 및 살균 건조로 욕창 예방 효과 극대화'],
    precautions: ['피부에 밀착되는 일회용 스마트 기저귀 패드 커버의 정기적인 소모품 교체 예산 필요', '대소변 수거 호스가 꺾이거나 환자의 몸에 눌리지 않도록 위치 점검'],
    environment: '24시간 돌봄 요양 병실 또는 요양 케어 가정 침실',
    reason: '배설 인지, 화장실 이동, 용변 후 청결 전 평가 영역에서 가장 중증인 극심한 어려움 상태를 보이고 있습니다.'
  }
};

// Learning guides dictionary to explain the meaning/criteria of each step
const learningGuides: Record<string, { title: string; content: string; details: { key: string; val: string }[] }> = {
  q1: {
    title: '자리이동 기능평가 기준',
    content: '침대, 의자, 휠체어 등으로 자리를 옮길 때 환자의 자립 수준을 평가합니다. 어려움 지표가 중간 정도 이상(2점 이상)일 경우 로봇 이송 지원이 적극 요구됩니다.',
    details: [
      { key: '0점 (문제 없음)', val: '아무런 보조 없이 안전하게 이동 가능 (로봇 비대상)' },
      { key: '1점 (가벼운 어려움)', val: '가벼운 피로가 있으나 자력 수행 가능 (단순 보조장비 적합)' },
      { key: '2점 (중간 정도)', val: '안전을 위해 부축이나 로봇 기립 보조 필요' },
      { key: '3점 (심한 어려움)', val: '상당 부분의 물리적 부축 및 지지가 필요함' },
      { key: '4점 (극심한 어려움)', val: '환자의 협조 불가로 전동식 슬링 리프트 필수' }
    ]
  },
  q2: {
    title: '하지 근력 및 체중 지지',
    content: '다리 근력이 스스로 체중을 지지하고 서있을 수 있는지 판단합니다. 이에 따라 리프트(슬링 매달기)형과 기립보조(일으켜 세우기)형이 구분됩니다.',
    details: [
      { key: '예, 체중을 지탱하기 어렵다', val: '다리 힘으로 지탱이 불가하여 안전하게 전신을 감싸 띄우는 전신슬링 리프트 적합' },
      { key: '아니오, 체중을 지탱할 수 있다', val: '상체 힘이 남아있고 기립 협조가 가능하여 일으켜 세우는 기립보조리프트/스탠딩리프트 적합' }
    ]
  },
  q3: {
    title: '사용 환경 평가',
    content: '천장이나 벽의 구조, 방의 크기에 따라 고정형 또는 이동형 리프트를 선별합니다.',
    details: [
      { key: '천장 설치 가능', val: '천장 옹벽 보강 후 레일 모터 장착 (바닥 차지 없음)' },
      { key: '벽면 설치 가능', val: '천장 공사가 불가할 때 튼튼한 옆 벽에 회전 암 장착' },
      { key: '이동식 리프트', val: '고정 공사 없이 바퀴 달린 프레임으로 다목적 이송' },
      { key: '이동식 겐트리', val: '천장 손상 없이 침대 주위에 독립 지지대 조립' }
    ]
  },
  q3_1: {
    title: '우선순위 가치 선별',
    content: '주거 환경상 여러 로봇 설치가 가능한 경우 사용 편의성, 설치비용, 공사 최소화 중 선호하는 가치를 판별합니다.',
    details: [
      { key: '사용 편의성', val: '가장 편안하고 바닥 차지가 없는 천장 고정식 추천' },
      { key: '설치비용 절감', val: '공사 효율이 좋은 벽면 고정식 리프트 추천' },
      { key: '공사 최소화', val: '설치 훼손이 없는 이동식/겐트리 조립식 추천' }
    ]
  },
  q3_2: {
    title: '독립 지지대 프레임 조립 여부',
    content: '천장 타공이나 벽면 훼손 공사가 어려운 상황에서 침대 주변에 지지대 구조물을 독립적으로 배치할 공간과 여건이 되는지 확인합니다.',
    details: [
      { key: '가능하다', val: '수직 이동 안전성이 좋은 독립 겐트리 리프트 추천' },
      { key: '어렵다', val: '프레임 배치 없이 바퀴로만 끄는 순수 이동식 리프트 추천' }
    ]
  },
  q4: {
    title: '상체 조절 능력 평가',
    content: '다리 지지는 힘드나 상체 잔존 근력이 있어 등받이 벨트를 파지하고 로봇과 협조하여 상체를 버틸 수 있는지 확인합니다.',
    details: [
      { key: '가능하다', val: '스스로 잡고 일어서는 속도를 돕는 전동형 기립보조리프트 추천' },
      { key: '어렵다', val: '더 많은 신체 고정과 보조가 이루어지는 비전동형 기립보조기기 추천' }
    ]
  },
  
  // 배설돌봄 가이드
  toileting_q1: {
    title: '배설 인지 조절 능력',
    content: '스스로 요의와 변의를 지각하고 배뇨/배변 타이밍을 컨트롤할 수 있는지 평가합니다. 인지 장애가 있을 경우 시간 맞춤형 알림 및 기저귀 흡인 로봇 개입이 요구됩니다.',
    details: [
      { key: '0~1점 (양호)', val: '배설 의사를 스스로 지각하고 제어 가능' },
      { key: '2~4점 (장해)', val: '배설 시기를 모르거나 실금이 있어 주기적 돌봄 필요' }
    ]
  },
  toileting_q2_a: {
    title: '물리적 화장실 이동 능력',
    content: '침실에서 화장실 변기 앞까지 자력으로 걸어가 안전하게 착석할 수 있는지 판단합니다. 보행 장해가 클 경우 침상 변기 또는 이동식 휠체어 보조가 연동됩니다.',
    details: [
      { key: '0~1점 (양호)', val: '부축 없이 화장실로 스스로 안전하게 이동' },
      { key: '2~4점 (장해)', val: '낙상 위험으로 화장실 이동이 불가하거나 부축 필수' }
    ]
  },
  toileting_q2_b: {
    title: '물리적 화장실 이동 능력',
    content: '배설 신호 지각은 어려우나 신체적으로 화장실까지 갈 수 있는지 평가합니다. 이동이 가능하다면 시간 맞춤 이동을, 불가능하다면 침상 자동배설로봇을 선택합니다.',
    details: [
      { key: '0~1점 (양호)', val: '유도를 통해 화장실 변기까지 이동 가능' },
      { key: '2~4점 (장해)', val: '침상에서 와상 상태로 기계식 배설 관리가 요구됨' }
    ]
  },
  toileting_q3_a1: {
    title: '용변 후 청결 마무리',
    content: '용변을 마친 후 스스로 옷을 입고 항문 주변을 깨끗하게 닦아내 뒤처리를 끝마칠 수 있는지 측정합니다.',
    details: [
      { key: '0~1점 (양호)', val: '자력 위생 뒤처리 완수 가능' },
      { key: '2~4점 (장해)', val: '비데 세정 시스템이나 세정 보조 장치 필수' }
    ]
  },
  toileting_q3_a2: {
    title: '용변 후 청결 마무리',
    content: '화장실 이동은 불가해 침상 변기를 이용하는 상황에서 엉덩이 청결 닦기를 환자 스스로 수행할 수 있는지 평가합니다.',
    details: [
      { key: '0~1점 (양호)', val: '침상 변기 이용 후 스스로 위생 뒤처리 가능' },
      { key: '2~4점 (장해)', val: '침상 변기 및 보호자의 뒤처리 부축 연동' }
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

// Node positioning and styling configurations
const transferNodes: Record<string, { x: number; y: number; label: string; isResult?: boolean; typeLabel: string }> = {
  q1: { x: 415, y: 20, label: "자리이동에 어려움이 있나요?", typeLabel: "기능평가" },
  'T-A': { x: 20, y: 180, label: "도움 불필요", isResult: true, typeLabel: "기기 추천" },
  'T-B': { x: 210, y: 180, label: "이승보조장비", isResult: true, typeLabel: "기기 추천" },
  q2: { x: 620, y: 180, label: "체중을 스스로 지탱할 수 없는가?", typeLabel: "하지 근력" },
  q3: { x: 420, y: 340, label: "사용자의 환경은 어떤가요?", typeLabel: "설치 환경" },
  q4: { x: 780, y: 340, label: "상체를 스스로 일으킬 수 있나요?", typeLabel: "상체 조절" },
  q3_1: { x: 200, y: 500, label: "우선순위가 어떻게 되나요?", typeLabel: "가치 선별" },
  'T-C': { x: 620, y: 500, label: "전동형 기립보조리프트", isResult: true, typeLabel: "기기 추천" },
  'T-D': { x: 810, y: 500, label: "비전동형 기립보조기기", isResult: true, typeLabel: "기기 추천" },
  'T-E': { x: 20, y: 660, label: "천장 고정형 리프트", isResult: true, typeLabel: "기기 추천" },
  'T-F': { x: 200, y: 660, label: "벽 고정형 리프트", isResult: true, typeLabel: "기기 추천" },
  q3_2: { x: 420, y: 660, label: "독립 지지대 설치가 가능한가요?", typeLabel: "공사 평가" },
  'T-G': { x: 320, y: 820, label: "이동식 리프트", isResult: true, typeLabel: "기기 추천" },
  'T-H': { x: 520, y: 820, label: "이동식 겐트리 리프트", isResult: true, typeLabel: "기기 추천" },
};

const toiletingNodes: Record<string, { x: number; y: number; label: string; isResult?: boolean; typeLabel: string }> = {
  q1: { x: 415, y: 20, label: "배설 인지 조절에 어려움이 있나요?", typeLabel: "인지 평가" },
  q2_a: { x: 200, y: 180, label: "화장실 이동에 어려움이 있나요? (A)", typeLabel: "이동 평가" },
  q2_b: { x: 630, y: 180, label: "화장실 이동에 어려움이 있나요? (B)", typeLabel: "이동 평가" },
  q3_a1: { x: 80, y: 340, label: "스스로 뒤처리를 할 수 있나요? (A1)", typeLabel: "뒤처리 평가" },
  q3_a2: { x: 290, y: 340, label: "스스로 뒤처리를 할 수 있나요? (A2)", typeLabel: "뒤처리 평가" },
  q3_b1: { x: 540, y: 340, label: "스스로 뒤처리를 할 수 있나요? (B1)", typeLabel: "뒤처리 평가" },
  q3_b2: { x: 750, y: 340, label: "스스로 뒤처리를 할 수 있나요? (B2)", typeLabel: "뒤처리 평가" },
  'B-A': { x: 10, y: 500, label: "도움 불필요", isResult: true, typeLabel: "기기 추천" },
  'B-B': { x: 135, y: 500, label: "비데", isResult: true, typeLabel: "기기 추천" },
  'B-C': { x: 260, y: 500, label: "변기 리프트", isResult: true, typeLabel: "기기 추천" },
  'B-D': { x: 385, y: 500, label: "이동 변기", isResult: true, typeLabel: "기기 추천" },
  'B-E': { x: 505, y: 500, label: "배설 유도 프로그램", isResult: true, typeLabel: "기기 추천" },
  'B-F': { x: 630, y: 500, label: "배설 프로그램 + 비데", isResult: true, typeLabel: "기기 추천" },
  'B-G': { x: 755, y: 500, label: "자동배설로봇 (간헐)", isResult: true, typeLabel: "기기 추천" },
  'B-H': { x: 880, y: 500, label: "스마트 기저귀 로봇", isResult: true, typeLabel: "기기 추천" },
};

const transferEdges = [
  { from: 'q1', to: 'T-A', label: "0점", condition: (ans: any) => ans['q1'] === '0' },
  { from: 'q1', to: 'T-B', label: "1점", condition: (ans: any) => ans['q1'] === '1' },
  { from: 'q1', to: 'q2', label: "2점 이상", condition: (ans: any) => parseInt(ans['q1'] || '-1') >= 2 },
  { from: 'q2', to: 'q3', label: "체중 지탱 불가", condition: (ans: any) => ans['q2'] === 'yes' },
  { from: 'q2', to: 'q4', label: "체중 지탱 가능", condition: (ans: any) => ans['q2'] === 'no' },
  { 
    from: 'q3', 
    to: 'q3_1', 
    label: "복수 환경", 
    condition: (ans: any) => {
      const selected = ans['q3'] || [];
      const hasCeiling = selected.includes('ceiling');
      const hasWall = selected.includes('wall');
      const hasMovable = selected.includes('movable');
      const fixedCount = [hasCeiling, hasWall].filter(Boolean).length;
      return fixedCount >= 2 || (fixedCount >= 1 && hasMovable);
    }
  },
  { 
    from: 'q3', 
    to: 'q3_2', 
    label: "이동식만", 
    condition: (ans: any) => {
      const selected = ans['q3'] || [];
      const hasCeiling = selected.includes('ceiling');
      const hasWall = selected.includes('wall');
      const hasMovable = selected.includes('movable');
      const fixedCount = [hasCeiling, hasWall].filter(Boolean).length;
      if (fixedCount >= 2 || (fixedCount >= 1 && hasMovable)) return false;
      return !hasCeiling && !hasWall;
    }
  },
  { 
    from: 'q3', 
    to: 'T-E', 
    label: "천장형만", 
    condition: (ans: any) => {
      const selected = ans['q3'] || [];
      const hasCeiling = selected.includes('ceiling');
      const hasWall = selected.includes('wall');
      const hasMovable = selected.includes('movable');
      return hasCeiling && !hasWall && !hasMovable;
    }
  },
  { 
    from: 'q3', 
    to: 'T-F', 
    label: "벽형만", 
    condition: (ans: any) => {
      const selected = ans['q3'] || [];
      const hasCeiling = selected.includes('ceiling');
      const hasWall = selected.includes('wall');
      const hasMovable = selected.includes('movable');
      return hasWall && !hasCeiling && !hasMovable;
    }
  },
  { from: 'q3_1', to: 'T-E', label: "사용 편의", condition: (ans: any) => ans['q3_1'] === 'convenience' },
  { from: 'q3_1', to: 'T-F', label: "비용 절감", condition: (ans: any) => ans['q3_1'] === 'cost' },
  { from: 'q3_1', to: 'q3_2', label: "공사 최소", condition: (ans: any) => ans['q3_1'] === 'minimal' },
  { from: 'q3_2', to: 'T-H', label: "프레임 가능", condition: (ans: any) => ans['q3_2'] === 'yes' },
  { from: 'q3_2', to: 'T-G', label: "프레임 불가", condition: (ans: any) => ans['q3_2'] === 'no' },
  { from: 'q4', to: 'T-C', label: "상체 지탱 가능", condition: (ans: any) => ans['q4'] === 'yes' },
  { from: 'q4', to: 'T-D', label: "상체 지탱 불가", condition: (ans: any) => ans['q4'] === 'no' },
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

export default function AlgorithmRunner({ algorithm, mode, onPathChange, onLearnMore }: AlgorithmRunnerProps) {
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(algorithm.startQuestionId);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [history, setHistory] = useState<string[]>([]);
  const [resultId, setResultId] = useState<string | null>(null);

  // Guide panel tracking
  const [selectedGuideQuestionId, setSelectedGuideQuestionId] = useState<string | null>(algorithm.startQuestionId);
  const [tempMultiSelect, setTempMultiSelect] = useState<string[]>([]);

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
    // If user interacts with a question that is NOT the active one, we should reset history to this node first
    let currentHistory = [...history];
    let currentAnswers = { ...answers };

    if (history.includes(qId)) {
      const idx = history.indexOf(qId);
      currentHistory = history.slice(0, idx);
      // Remove stale answers
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
    if (!isTransfer && id.startsWith('B-')) return 110; // toileting results are slightly slimmer
    return 170; // increased from 160 to prevent text wrapping/overflow
  };
  const getNodeHeight = (id: string) => {
    const node = nodes[id];
    if (node?.isResult) return 76;
    return 96; // increased from 84 for questions to fit titles and quick-action/selected badges comfortably
  };

  // Path Bezier curve calculation
  const getBezierPath = (x1: number, y1: number, x2: number, y2: number) => {
    const controlY = y1 + (y2 - y1) * 0.45;
    return `M ${x1} ${y1} C ${x1} ${controlY}, ${x2} ${y1 + (y2 - y1) * 0.55}, ${x2} ${y2}`;
  };

  // Check if an edge is active on user's traversed path
  const isEdgeActive = (edge: typeof edges[0]) => {
    if (!history.includes(edge.from)) return false;
    return edge.condition(answers);
  };

  // Check if a node is completed, active, or inactive
  const getNodeStatus = (nodeId: string) => {
    if (nodeId === resultId) return 'result-active';
    if (nodeId === currentQuestionId) return 'active';
    if (history.includes(nodeId)) return 'completed';
    return 'inactive';
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Top Header Panel */}
      <div className="flex flex-wrap justify-between items-center bg-white border border-slate-200/80 rounded-2xl px-6 py-4 shadow-sm gap-4">
        <div>
          <span className="text-xs font-black text-primary uppercase tracking-wider block mb-0.5">자가 진단 및 흐름 학습</span>
          <h3 className="text-sm font-bold text-slate-700 leading-snug">아래 지도의 카드들을 클릭하며 분기를 직접 탐색해 보세요.</h3>
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 hover:border-red-200 border border-slate-200 bg-white rounded-xl shadow-sm transition-all flex items-center gap-1.5 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>진단 초기화</span>
        </button>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive SVG Flowchart Canvas */}
        <div className="lg:col-span-8 w-full border border-slate-200 bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center px-6 shrink-0">
            <span className="text-xs font-bold text-slate-400">의사결정 지도</span>
            <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
              드래그/스크롤하여 전체 탐색
            </span>
          </div>

          <div className="w-full overflow-x-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
            {/* Scrollable grid matching coordinates */}
            <div 
              className="relative mx-auto select-none"
              style={{ 
                width: '1000px', 
                height: isTransfer ? '920px' : '600px' 
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
                        stroke={active ? '#0E4A84' : '#E2E8F0'}
                        strokeWidth={active ? 3.5 : 1.5}
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
                      className="overflow-visible pointer-events-none"
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
                          ? 'border-primary bg-primary text-white shadow-lg scale-[1.04] z-20 cursor-default'
                          : isActive
                            ? 'border-primary bg-white shadow-md ring-2 ring-primary/10 z-20 cursor-default scale-[1.02]'
                            : isCompleted
                              ? 'border-slate-300 bg-white hover:border-primary/50 shadow-sm cursor-pointer hover:shadow'
                              : 'border-slate-100 bg-white opacity-40 grayscale pointer-events-none'
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

                        {/* Title (Always 자연어) */}
                        <h4 className={`text-xs leading-snug font-bold ${
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
                                className="flex-1 text-[8px] sm:text-[9px] font-extrabold px-1 py-0.5 rounded bg-primary/5 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all text-center whitespace-nowrap"
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
                              className="w-full text-[8px] sm:text-[9px] font-extrabold py-0.5 rounded bg-primary text-white text-center hover:bg-primary-dark transition-colors"
                            >
                              오른쪽 패널에서 조건 입력
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
                              return `${ans.length}개 조건 선택됨`;
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

        {/* Right Column: Dynamic Detail Panel or Enhanced Result Details */}
        <div className="lg:col-span-4 w-full lg:sticky lg:top-6 space-y-6">
          
          {/* Active Result screen (Shown when resultId exists) */}
          {resultId ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden animate-fade-in flex flex-col">
              <div className="bg-primary px-6 py-4 text-white">
                <span className="text-[10px] font-black text-white/80 uppercase tracking-widest block">자가 진단 최종 매칭</span>
                <h3 className="font-extrabold text-sm sm:text-base leading-tight">자가평가 결과</h3>
              </div>

              <div className="p-6 space-y-6 flex-1">
                {/* Result Title */}
                <div className="text-center pb-5 border-b border-slate-100 space-y-2">
                  <span className="text-[9px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    최적 추천 기기
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 pt-1 tracking-tight leading-snug">
                    {resultDetails[resultId]?.deviceName || algorithm.results[resultId]?.title}
                  </h2>
                </div>

                {/* Device representative Image */}
                {resultDetails[resultId]?.image ? (
                  <div className="relative mx-auto w-40 h-40 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-3">
                    <Image
                      src={resultDetails[resultId].image}
                      alt={resultDetails[resultId].deviceName}
                      fill
                      className="object-contain p-2 hover:scale-105 transition-transform duration-300"
                      priority
                    />
                  </div>
                ) : (
                  <div className="mx-auto w-40 h-40 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 text-xs">
                    이미지 준비 중
                  </div>
                )}

                {/* Rich Details List */}
                <div className="space-y-5 text-left text-xs leading-normal">
                  {/* When to use */}
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-400 tracking-wide uppercase text-[10px]">언제 사용하는가?</h5>
                    <p className="text-slate-700 font-semibold leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {resultDetails[resultId]?.whenToUse}
                    </p>
                  </div>

                  {/* Recommendation Reason */}
                  <div className="space-y-1.5 border-t border-slate-100 pt-4">
                    <h5 className="font-bold text-slate-400 tracking-wide uppercase text-[10px] flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-primary" />
                      추천 이유
                    </h5>
                    <p className="text-slate-600 font-semibold leading-relaxed">
                      {resultDetails[resultId]?.reason || algorithm.results[resultId]?.reason}
                    </p>
                  </div>

                  {/* Pros & Precautions */}
                  {resultDetails[resultId]?.pros && (
                    <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-4">
                      {/* Pros */}
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5 space-y-1.5">
                        <h6 className="text-[10px] font-bold text-emerald-700 flex items-center gap-1.5 uppercase font-black">
                          <ThumbsUp className="w-3 h-3" />
                          장점
                        </h6>
                        <ul className="space-y-1 text-[11px] text-emerald-800 font-semibold list-disc pl-4 leading-relaxed">
                          {resultDetails[resultId].pros.map((pro, idx) => (
                            <li key={idx}>{pro}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Precautions */}
                      <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3.5 space-y-1.5">
                        <h6 className="text-[10px] font-bold text-amber-700 flex items-center gap-1.5 uppercase font-black">
                          <AlertTriangle className="w-3 h-3" />
                          주의사항
                        </h6>
                        <ul className="space-y-1 text-[11px] text-amber-800 font-semibold list-disc pl-4 leading-relaxed">
                          {resultDetails[resultId].precautions.map((pre, idx) => (
                            <li key={idx}>{pre}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Installation Environment */}
                  {resultDetails[resultId]?.environment && (
                    <div className="space-y-1 border-t border-slate-100 pt-4">
                      <h5 className="font-bold text-slate-400 tracking-wide uppercase text-[10px]">설치 권장 환경</h5>
                      <p className="text-slate-600 font-bold leading-relaxed text-slate-800">
                        ✓ {resultDetails[resultId].environment}
                      </p>
                    </div>
                  )}
                </div>

                {/* More Details Redirect Button & Reset */}
                <div className="space-y-3 pt-4 border-t border-slate-100 mt-4 shrink-0">
                  {onLearnMore && (
                    <button
                      onClick={() => onLearnMore(resultId)}
                      className="w-full py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 hover:shadow-lg scale-[1.01]"
                    >
                      <span>상세 정보 및 영상 더 알아보기</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={handleReset}
                    className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-bold text-xs transition-colors"
                  >
                    새로운 진단 시작하기
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Question/Guide Detail Panel (Shown during traversal) */
            <div className="space-y-6">
              {/* Question panel with selection list (especially important for q3 multi-select) */}
              {currentQuestion && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5 animate-fade-in">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-primary uppercase bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 inline-block">
                      STEP {history.length + 1}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
                      {currentQuestion.title}
                    </h3>
                  </div>

                  {/* Render Options inside Side Panel */}
                  {currentQuestion.type === 'single' ? (
                    <div className="space-y-2">
                      {currentQuestion.options.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleSingleSelect(currentQuestion.id, opt.value)}
                          className="w-full text-left p-3.5 rounded-xl border border-slate-100 hover:border-primary hover:bg-primary/5 transition-all flex justify-between items-center group font-bold text-slate-700 text-xs"
                        >
                          <span>{opt.text}</span>
                          <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all shrink-0">
                            <div className="w-2 h-2 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform" />
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-2">
                        {currentQuestion.options.map((opt) => {
                          const isChecked = tempMultiSelect.includes(opt.value);
                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleMultiToggle(opt.value)}
                              className={`text-left p-3 rounded-xl border transition-all flex items-center gap-3 font-bold text-xs ${
                                isChecked
                                  ? 'border-primary bg-primary/5 text-primary'
                                  : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                isChecked ? 'border-primary bg-primary text-white' : 'border-slate-300 bg-white'
                              }`}>
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="leading-snug">{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => handleMultiSubmit(currentQuestion.id)}
                        disabled={tempMultiSelect.length === 0}
                        className="w-full py-2.5 rounded-xl bg-primary text-white font-extrabold text-xs hover:bg-primary-dark transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>선택 완료</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Detailed Explanation Panel for current clicked guide */}
              {selectedGuide ? (
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4 animate-fade-in">
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
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 text-center shadow-sm">
                  <p className="text-xs text-slate-400 font-semibold">알고리즘 단계를 선택하시면 임상 평가 기준과 설명이 여기에 표시됩니다.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
