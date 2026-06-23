export interface Option {
  id: string;
  text: string;
  simpleText?: string;
  simpleLabel?: string;
  score?: number;
  value: string;
}

export interface Question {
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

export interface Result {
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

export const transferCareAlgorithm = {
  id: 'transfer',
  title: '이승돌봄로봇 자가평가 알고리즘',
  startQuestionId: 'q1',
  questions: {
    q1: {
      id: 'q1',
      title: '자리이동에 어려움이 있나요?',
      simpleTitle: '침대에서 일어나거나 의자로 옮겨 앉을 때 도움이 필요한가요?',
      description: '',
      simpleDescription: '혼자 몸을 일으키거나 앉는 자세로 바꾸기 어려운지 확인합니다.',
      iconType: 'transfer',
      type: 'single',
      options: [
        { id: 'q1_0', text: '0점: 문제 없음', simpleText: '아니요, 혼자서 아주 잘해요', score: 0, value: '0' },
        { id: 'q1_1', text: '1점: 가벼운 어려움', simpleText: '혼자 할 수는 있지만 약간 불안해요', score: 1, value: '1' },
        { id: 'q1_2', text: '2점: 중간 정도의 어려움', simpleText: '일어서거나 탈 때 약간 도와주어야 해요', score: 2, value: '2' },
        { id: 'q1_3', text: '3점: 심한 어려움', simpleText: '다치지 않게 많이 붙잡아 주어야 해요', score: 3, value: '3' },
        { id: 'q1_4', text: '4점: 극심한 어려움', simpleText: '스스로 움직이지 못해 전적으로 도와주어야 해요', score: 4, value: '4' },
      ],
      nextQuestionId: (answers: Record<string, any>) => {
        const val = parseInt(answers['q1'] || '0');
        if (val >= 2) return 'q2';
        return null;
      },
      resultId: (answers: Record<string, any>) => {
        const val = parseInt(answers['q1'] || '0');
        if (val === 0) return 'T-A';
        if (val === 1) return 'T-B';
        return null;
      }
    } as Question,
    q2: {
      id: 'q2',
      title: '다리 힘으로 체중을 지탱할 수 없는가?',
      simpleTitle: '보호자가 부축해 주었을 때, 환자분이 본인의 다리 힘으로 서 계실 수 있나요?',
      description: '',
      simpleDescription: '보호자가 양손으로 부축하여 서 있게 도울 때, 다리로 버텨 지탱할 수 있는지 판단해 주세요.',
      iconType: 'balance',
      type: 'single',
      options: [
        { id: 'q2_yes', text: '예, 체중을 지탱하기 어렵다', simpleText: '아니요, 다리 힘이 없어 서지 못해요', value: 'yes' },
        { id: 'q2_no', text: '아니오, 체중을 지탱할 수 있다', simpleText: '네, 붙잡아 주면 서 있을 수 있어요', value: 'no' },
      ],
      nextQuestionId: (answers: Record<string, any>) => {
        const val = answers['q2'];
        if (val === 'yes') return 'q3';
        if (val === 'no') return 'q4';
        return null;
      }
    } as Question,
    q3: {
      id: 'q3',
      title: '사용 환경은 어떤가요?',
      simpleTitle: '장비를 설치하고 작동할 공간의 상태는 어떤가요?',
      description: '(복수 선택 가능)',
      simpleDescription: '방이나 거실, 천장 구조에 해당하는 내용을 모두 선택해 주세요.',
      iconType: 'safety',
      type: 'multi',
      options: [
        { id: 'q3_ceiling', text: '천장에 장비 설치가 가능하다', simpleText: '천장에 장비를 달기 위한 공사를 할 수 있어요', value: 'ceiling' },
        { id: 'q3_wall', text: '벽면에 장비 설치가 가능하다', simpleText: '방에 단단한 콘크리트 벽이 있어 고정할 수 있어요', value: 'wall' },
        { id: 'q3_movable', text: '고정식 설치는 어렵고 이동식 장비가 필요하다', simpleText: '공사를 할 수 없어 바퀴로 끄는 이동식이 필요해요', value: 'movable' },
        { id: 'q3_narrow', text: '침대 주변 공간이 좁다', simpleText: '침대 주변이나 방 공간이 좁은 편이에요', value: 'narrow' },
        { id: 'q3_home', text: '가정 환경이다', simpleText: '집(가정 환경)에서 사용할 예정이에요', value: 'home' },
        { id: 'q3_facility', text: '병원 또는 요양시설 환경이다', simpleText: '병원이나 요양시설에서 사용할 예정이에요', value: 'facility' },
      ],
      nextQuestionId: (answers: Record<string, any>) => {
        const selected: string[] = answers['q3'] || [];
        const hasCeiling = selected.includes('ceiling');
        const hasWall = selected.includes('wall');
        const hasMovable = selected.includes('movable');

        const fixedCount = [hasCeiling, hasWall].filter(Boolean).length;
        if (fixedCount >= 2 || (fixedCount >= 1 && hasMovable)) {
          return 'q3_1';
        }
        
        if (!hasCeiling && !hasWall) {
          return 'q3_2';
        }

        return null;
      },
      resultId: (answers: Record<string, any>) => {
        const selected: string[] = answers['q3'] || [];
        const hasCeiling = selected.includes('ceiling');
        const hasWall = selected.includes('wall');
        const hasMovable = selected.includes('movable');

        if (hasCeiling && !hasWall && !hasMovable) {
          return 'T-E';
        }
        if (hasWall && !hasCeiling && !hasMovable) {
          return 'T-F';
        }
        return null;
      }
    } as Question,
    q3_1: {
      id: 'q3_1',
      title: '우선순위가 어떻게 되나요?',
      simpleTitle: '장비를 설치할 때 가장 중요하게 고려하시는 가치는 무엇인가요?',
      description: '',
      simpleDescription: '설치 시 편리함과 사용 편의성, 혹은 초기 비용 등 우선적으로 고려할 가치를 선택해 주세요.',
      iconType: 'caregiver',
      type: 'single',
      options: [
        { id: 'q3_1_convenience', text: '설치 후 사용 편의성 및 효율성', simpleText: '쓰기 편리하고 힘이 적게 드는 것', value: 'convenience' },
        { id: 'q3_1_cost', text: '설치 비용 절감', simpleText: '설치에 드는 비용을 최대한 줄이는 것', value: 'cost' },
        { id: 'q3_1_minimal', text: '공사 과정 최소화 및 이동성', simpleText: '집 공사를 최소한으로 줄이고 이동이 쉬운 것', value: 'minimal' },
      ],
      nextQuestionId: (answers: Record<string, any>) => {
        const val = answers['q3_1'];
        if (val === 'minimal') return 'q3_2';
        return null;
      },
      resultId: (answers: Record<string, any>) => {
        const val = answers['q3_1'];
        if (val === 'convenience') return 'T-E';
        if (val === 'cost') return 'T-F';
        return null;
      }
    } as Question,
    q3_2: {
      id: 'q3_2',
      title: '독립 지지대 설치가 가능한가요?',
      simpleTitle: '벽이나 천장 공사는 어렵지만, 침실 바닥에 문 모양의 큰 조립 지지대를 세워둘 공간이 있나요?',
      description: '',
      simpleDescription: '바닥 공간 여유를 파악하여 A자형 철제 프레임 기둥을 배치할 수 있는지 여부를 선택합니다.',
      iconType: 'safety',
      type: 'single',
      options: [
        { id: 'q3_2_yes', text: '가능하다: 이동식 겐트리 및 독립 프레임 설치', simpleText: '네, 프레임 기둥을 조립해 세워둘 공간이 있어요', value: 'yes' },
        { id: 'q3_2_no', text: '어렵다: 설치 없이 바퀴로 끄는 순수 이동식 필요', simpleText: '아니요, 방이 좁아 구조물 기둥을 세우기 곤란해요', value: 'no' },
      ],
      resultId: (answers: Record<string, any>) => {
        const val = answers['q3_2'];
        if (val === 'yes') return 'T-H';
        return 'T-G';
      }
    } as Question,
    q4: {
      id: 'q4',
      title: '스스로 상체를 일으킬 수 없는가?',
      simpleTitle: '환자분이 앉은 상태에서 스스로 상체(허리와 목)를 세우거나 손잡이를 꽉 잡을 수 있나요?',
      description: '',
      simpleDescription: '기립 시 스스로 앉은 자세를 유지하고 손으로 당겨 지지할 수 있는지 판단해 주세요.',
      iconType: 'balance',
      type: 'single',
      options: [
        { id: 'q4_yes', text: '예, 상체를 일으킬 수 없음', simpleText: '아니요, 상체 힘이 없어 버티거나 잡기 힘들어요', value: 'yes' },
        { id: 'q4_no', text: '아니오, 상체를 일으킬 수 있음', simpleText: '네, 스스로 상체를 세우고 손잡이를 꽉 잡을 수 있어요', value: 'no' },
      ],
      resultId: (answers: Record<string, any>) => {
        const val = answers['q4'];
        if (val === 'yes') return 'T-C';
        if (val === 'no') return 'T-D';
        return null;
      }
    } as Question,
  },
  results: {
    'T-A': {
      id: 'T-A',
      title: '현재 이승돌봄로봇 필요도 낮음',
      simpleTitle: '혼자서 안전하게 이동 가능',
      description: '현재 혼자서 안전하게 자리를 이동할 수 있어 관련 로봇의 필요도가 매우 낮은 수준입니다.',
      simpleDescription: '현재 혼자서 안전하게 침대와 휠체어 등을 오갈 수 있으므로, 별도의 이송 지원 기기는 필요하지 않습니다.',
      recommendation: '현재 상태를 유지하는 것을 권장합니다.',
      simpleRecommendation: '현재 신체 기능을 유지하기 위해 걷기 등 가벼운 일상 활동을 계속 장려합니다.',
      reason: '자리이동하기 기능평가 결과, 일상생활에 지장을 초래하지 않는 가벼운 수준이거나 어려움이 관찰되지 않았습니다.',
      simpleResultSummary: '스스로 자리를 옮기실 수 있어, 현재는 별도의 이송 기기가 필요하지 않은 상태입니다.'
    },
    'T-B': {
      id: 'T-B',
      title: '이승보조장비 고려',
      simpleTitle: '이송 보조판 및 벨트 추천',
      description: '자리이동 시 약간의 불안정함이나 가벼운 어려움이 있으므로 안전을 보조할 수 있는 도구를 권장합니다.',
      simpleDescription: '자리를 옮길 때 약간 휘청거리거나 미끄러질 위험이 있으므로, 가볍게 도와줄 수 있는 도구를 추천합니다.',
      recommendation: '미끄럼방지 매트, 이승용 슬라이딩 보드, 안전 손잡이 등의 간단한 이승보조도구 도입을 고려해보세요.',
      simpleRecommendation: '침대와 휠체어 사이를 매끄럽게 연결하는 슬라이딩 보드(미끄럼판)나 보호자가 잡는 이승 부축 벨트를 추천합니다.',
      reason: '자리이동하기 기능평가 결과 가벼운 정도의 어려움이 존재하나 체중 지지나 일상 수행은 크게 훼손되지 않은 단계입니다.',
      simpleResultSummary: '안전하게 미끄러지듯 이동하도록 돕는 슬라이딩 보드나 파지용 부축 벨트를 추천합니다.',
      simpleTips: [
        '슬라이딩 보드(미끄럼판)를 침대와 휠체어 사이에 놓고 엉덩이를 가볍게 밀어서 이동합니다.',
        '환자가 등받이 없이 스스로 앉아 균형을 잠시 유지할 수 있는 근력이 필요합니다.',
        '환자의 피부가 쓸리거나 허리를 삐끗하는 부상을 획기적으로 막아줍니다.'
      ]
    },
    'T-C': {
      id: 'T-C',
      title: '전동형 기립보조리프트 고려',
      simpleTitle: '일어서기를 돕는 전동 리프트 추천',
      description: '다리 근력이 부족하여 스스로 체중을 지탱하지 못하지만 상체 조절이 가능한 상태이므로 동력을 지원하는 기립보조리프트가 적합합니다.',
      simpleDescription: '다리 근력이 약해 혼자 서기는 어려우나 스스로 상체를 꼿꼿이 펴고 손잡이를 쥘 힘이 있을 때, 전동 힘으로 자연스럽게 일으켜 세워 옮기는 기기입니다.',
      recommendation: '모터 구동식 전동형 기립보조리프트(허그, 업고플러스 등) 고려를 추천합니다. 벨트를 등에 지지하고 기립을 도와 이승을 돕습니다.',
      simpleRecommendation: '벨트로 엉덩이와 등을 받친 후 단추만 누르면 알아서 일으켜 태우고 이동할 수 있는 전동 기립 리프트를 추천합니다.',
      reason: '자리이동 기능평가 결과 중간 정도 이상의 어려움이 있으나, 스스로 몸을 지탱하고 손잡이를 잡을 수 있는 등 상체 잔존 근력이 남아있어 전동기립 시 협조가 원활한 상황입니다.',
      simpleResultSummary: '다리 힘은 약하나 상체 고정이 가능하므로, 엉덩이를 벨트로 감싸서 전동 힘으로 일어서게 돕는 리프트를 추천합니다.',
      simpleTips: [
        '환자가 앞에 있는 기둥과 안전 손잡이를 스스로 꼭 쥐어 협조해 줄 능력이 있어야 합니다.',
        '보호자가 허리 힘을 전혀 쓰지 않고도 환자를 침대에서 휠체어로 안전하게 세워 보낼 수 있습니다.',
        '자주 일어나는 움직임을 통해 환자의 하체 근육 수축 재활에도 도움을 줍니다.'
      ]
    },
    'T-D': {
      id: 'T-D',
      title: '비전동형 기립보조기기 고려',
      simpleTitle: '안전 패드 밀착형 수동 기립기 추천',
      description: '체중 지지가 어렵고 상체도 가누기 힘든 상태이므로 대상자를 안전하게 안아 올리거나 슬링으로 감싸 이동을 돕는 보조 수준이 높은 비전동형 기립보조기기를 고려해야 합니다.',
      simpleDescription: '다리 힘이 없고 스스로 상체를 가누거나 지탱하기도 어려우나, 무릎과 가슴을 패드로 튼튼하게 다중 밀착해 안전하게 고정해 일으켜 세우는 수동 기기입니다.',
      recommendation: '탑승식 수동형 기립보조기기 또는 전적으로 몸을 고정해주는 기립 보조 리프트 전환을 고려하세요.',
      simpleRecommendation: '전기 충전 번거로움이 없이 무릎 패드와 엉덩이 받침대를 지렛대 지지 구조로 안전하게 밀착하여 끄는 수동식 리프트 차를 추천합니다.',
      reason: '체중 지지가 불가능하고 스스로 상체를 가누거나 지탱하기도 어려워 전동 기립 시 낙상 위험이 높으며 더 전반적인 신체 지지가 요구됩니다.',
      simpleResultSummary: '스스로 상체를 버티거나 손잡이를 꽉 쥐기 힘드므로, 가슴과 무릎을 패드로 다중 밀착 고정해 세우는 수동형 기립기를 추천합니다.',
      simpleTips: [
        '전기 배터리를 충전할 필요가 없으므로 방전이나 급작스러운 고장 우려가 전혀 없습니다.',
        '가슴과 무릎 패드로 삼중 고정해주기 때문에 몸을 가누기 어려운 환자도 낙상할 위험이 적습니다.',
        '다만 기계식 손잡이를 밀어 올리기 위해 보호자분의 가벼운 밀치는 힘이 수반됩니다.'
      ]
    },
    'T-E': {
      id: 'T-E',
      title: '천장 고정형 리프트 고려',
      simpleTitle: '천장 레일 매립식 안전 리프트 추천',
      description: '체중 지지는 어렵고 전신 슬링 지원이 필요한 중등도 이상 상태이며 주거 혹은 시설 환경상 천장 레일 공사가 가능하고 사용 빈도가 높을 때 적합한 솔루션입니다.',
      simpleDescription: '다리 및 상체 힘이 전혀 없는 와상 환자분을 그네 시트(슬링)로 감싸 천장에 매단 레일과 모터를 작동하여 안전하게 띄워 이송하는 장치입니다.',
      recommendation: '방 또는 욕실 천장에 레일을 설치하고 슬링 모터를 장착하여 이송하는 천장 주행식 리프트를 설치하세요.',
      simpleRecommendation: '집 천장에 하중 보강 및 레일 설치 공사를 한 뒤, 그네식 슬링 시트로 환자를 띄워 이동하는 천장 리프트를 설치하십시오.',
      reason: '다리 힘으로 체중 지탱이 불가능하여 전신슬링 리프팅이 필요하며, 사용 장소의 천장 구조상 레일 보강 공사가 가능하고 뛰어난 사용 편의성을 선호하셨습니다.',
      simpleResultSummary: '다리와 상체를 가누기 어렵고 전신을 받쳐야 하는 상태로, 천장 레일에 매달아 안전하게 띄워 옮기는 리프트를 추천합니다.',
      simpleTips: [
        '바닥 공간을 전혀 차지하지 않기 때문에 방이나 욕실이 좁은 집에서 사용하기 가장 유용합니다.',
        '모터 전동 제어로 보호자 한 명이 손가락 버튼 하나로 힘들이지 않고 완벽한 이송이 가능합니다.',
        '설치 전 천장이 무게를 견딜 수 있도록 튼튼하게 보강하는 사전 공사가 반드시 수반되어야 합니다.'
      ]
    },
    'T-F': {
      id: 'T-F',
      title: '벽 고정형 리프트 고려',
      simpleTitle: '벽 고정형 관절 리프트 추천',
      description: '천장 공사는 지지 하중 제한 등으로 어려우나 벽면의 내력벽 지지가 가능한 환경에서 효율적으로 이승을 돕는 리프트입니다.',
      simpleDescription: '천장 공사는 불가능하지만 단단한 콘크리트 벽(옹벽)에 회전 기둥 암을 고정해 환자를 그네 시트로 들어 올려 이송하는 리프트입니다.',
      recommendation: '벽면에 회전 가능한 관절 암 타입의 리프트를 장착하여 침대에서 휠체어로 이동시키는 벽 고정식 리프트를 설치하세요.',
      simpleRecommendation: '튼튼한 콘크리트 벽면에 관절 회전 기둥 리프트를 장착하여 회전 반경 내에서 슬링 시트로 옮기는 리프트를 추천합니다.',
      reason: '다리 힘으로 체중 지탱이 불가능하여 전신슬링 리프팅이 필요하지만 천장 레일 공사는 어렵고 튼튼한 옹벽이 지원되며 합리적인 설치 비용을 선호하셨습니다.',
      simpleResultSummary: '천장 레일 공사는 어렵지만 콘크리트 옹벽이 있는 방에서, 벽에 기둥 관절을 달아 그네 시트로 들어 올리는 리프트를 추천합니다.',
      simpleTips: [
        '천장 구조상 공사가 어려울 때 훌륭한 대안이 되며 단단한 내력벽 지지가 필수적입니다.',
        '사용하지 않을 때는 벽 쪽으로 차분히 접어둘 수 있어 방을 넓게 사용하는 장점이 있습니다.',
        '벽 고정 기둥의 회전 작동 반경 내로 이동 가능한 범위가 제한됨을 염두에 두십시오.'
      ]
    },
    'T-G': {
      id: 'T-G',
      title: '이동식 리프트 고려',
      simpleTitle: '바퀴식 주행 슬링 리프트 추천',
      description: '방, 거실 등 다양한 공간으로 기기를 바퀴로 끌고 가 이승을 도울 수 있는 장비입니다. 고정식 공사가 전혀 필요 없습니다.',
      simpleDescription: '벽이나 천장 타공 공사가 전면 불가할 때, 바퀴 달린 프레임을 이용해 방과 거실 등을 돌아다니며 환자를 그네 시트로 들어 올리는 이동식 리프트입니다.',
      recommendation: '바퀴 달린 다목적 하부 프레임과 유압 혹은 전동 실린더가 장착된 이동식 리프트(슬링 없음, 슬링 자동 삽입, 슬링 수동 체결) 고려를 추천합니다.',
      simpleRecommendation: '집 손상 공사 없이 즉각 조립하여 바퀴로 굴리며 사용하는 전동 실린더 이동식 리프트를 추천합니다.',
      reason: '다리 힘으로 체중 지탱이 불가능해 전신슬링 리프팅이 필수적이나, 건물 구조 손상 우려로 천장/벽면 고정형 설치가 불가능하고 바닥 주행이 용이한 환경입니다.',
      simpleResultSummary: '벽이나 천장을 뚫는 공사가 일절 불가하므로, 바퀴를 굴려 끌고 다니며 그네 시트로 띄워 옮기는 이동식 리프트를 추천합니다.',
      simpleTips: [
        '공사나 집 훼손이 전혀 없어 즉각 조립해 쓸 수 있고, 나중에 이사할 때 가져가기 간편합니다.',
        '바닥에 문턱이 있으면 굴리기 어려우므로 화장실 및 침실 바닥 문턱 제거가 동반되어야 좋습니다.',
        '침대 밑으로 기계 바퀴 프레임이 쑥 들어가야 하므로 침대 하단 틈새가 최소 10cm 이상 비어있어야 합니다.'
      ]
    },
    'T-H': {
      id: 'T-H',
      title: '이동식 겐트리 리프트 고려',
      simpleTitle: '조립식 독립 거치대 리프트 추천',
      description: '천장 타공 공사 등은 불가능하지만 방안에 A자형 지지대 구조물을 단독 배치하여 안정적인 수직 리프팅을 할 수 있는 보조 장치입니다.',
      simpleDescription: '천장이나 벽 공사는 곤란하지만, 침실 침대 주위에 문 모양의 독립 대형 프레임을 조립해 세운 뒤 모터를 결합해 띄워 올리는 리프트입니다.',
      recommendation: '이동식 겐트리 프레임과 모터를 결합한 패키지 제품 사용을 고려하세요.',
      simpleRecommendation: '천장에 타공을 뚫을 수 없는 주거 형태에서, 방에 A자형 철제 프레임 기둥만 세워 그네식 슬링 모터를 매달아 쓰는 리프트 패키지를 추천합니다.',
      reason: '다리 힘으로 체중 지탱이 불가하여 전신슬링 리프트가 필요하지만 고정형 공사가 불가능하며, 대신 침대 주변 공간에 독립적인 A자형 지지 프레임을 세울 수 있는 환경입니다.',
      simpleResultSummary: '공사를 할 수 없으나, 침대 위에 독립된 조립식 기둥 지지대(겐트리 프레임)를 세워 그네 시트로 띄워 옮기는 리프트를 추천합니다.',
      simpleTips: [
        '전세집 등 가옥 벽/천장 손상이 전혀 불가능할 때 슬링 리프팅을 적용하는 가장 안전한 기법입니다.',
        '독립적인 기둥 구조물이 침대 주변으로 둘러지므로 침대 양옆과 위 공간이 충분히 넉넉해야 합니다.',
        '조립형 기기이므로 정기적으로 기둥 나사의 풀림 및 철제 균형 상태를 가볍게 점검해 줍니다.'
      ]
    }
  }
};
