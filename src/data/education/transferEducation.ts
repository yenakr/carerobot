export interface DeviceType {
  id: string;
  name: string;
  category: string;
  target: string;
  description: string;
  features: string[];
  imageUrl?: string;
}

export interface EducationData {
  title: string;
  definition: {
    title: string;
    content: string;
    examples: string[];
  };
  standards: {
    title: string;
    description: string;
    items: { score: string; label: string; details: string }[];
    subSection?: {
      title: string;
      description: string;
      items: { grade: string; label: string; criteria: string }[];
    };
  };
  devices: {
    title: string;
    description: string;
    list: DeviceType[];
  };
}

export const transferEducationData: EducationData = {
  title: '이승돌봄 교육 자료',
  definition: {
    title: '이승돌봄이란?',
    content: '이승돌봄은 대상자가 침대, 의자, 휠체어, 변기 등으로 자리를 옮길 때 필요한 돌봄을 의미합니다. 자리이동하기란 스스로 자세를 완전히 바꾸지 않고 침대 등 한 면에서 휠체어와 같은 다른 면으로 공간적 위치를 이동하는 모든 행위를 포함합니다.',
    examples: [
      '침대에서 의자나 휠체어로의 이동',
      '휠체어나 의자에서 침대로의 이동',
      '휠체어에서 변기나 목욕 의자로의 이동',
      '침대에서 다른 침대로의 이동'
    ]
  },
  standards: {
    title: '자리이동 기능평가 및 하지 근력 평가 기준',
    description: '이승돌봄 기기 선정의 핵심은 대상자의 자리이동 장애 점수와 다리 근력입니다.',
    items: [
      { score: '0점', label: '문제 없음', details: '혼자서 아무런 도구와 도움 없이 침대와 휠체어 등을 안전하게 오갈 수 있는 수준' },
      { score: '1점', label: '가벼운 어려움', details: '이동 시 가벼운 균형 불안정이나 피로감이 있으나 스스로 조절하고 극복할 수 있는 상태' },
      { score: '2점', label: '중간 정도의 어려움', details: '일상생활에 일부 지장을 초래하며, 안전을 위해 보조 기구나 타인의 가벼운 밀착 도움이 요구되는 수준' },
      { score: '3점', label: '심한 어려움', details: '스스로의 힘으로는 거의 이동이 불가하여 신체적 지탱과 부분적인 완전 보조가 수시로 필요한 수준' },
      { score: '4점', label: '극심한 어려움', details: '자리이동을 위한 어떠한 신체 협조도 불가능하여 전적인 기계장치나 다수 제공자의 도움이 필수적인 수준' }
    ],
    subSection: {
      title: '하지 근력 평가 기준',
      description: '의학적 근력 등급을 기반으로 하며, 알고리즘에서는 Grade IV 이상을 체중 지지 가능으로 평가합니다.',
      items: [
        { grade: 'Grade 0', label: '완전 마비', criteria: '근육의 수축이나 기능이 전혀 관찰되지 않는 상태' },
        { grade: 'Grade I', label: '미세 수축', criteria: '눈으로 보거나 만졌을 때 미세한 수축은 느껴지나 관절을 움직일 수는 없음' },
        { grade: 'Grade II', label: '중력 미달', criteria: '다리를 들어올릴 수 없으며, 중력이 없는 수평 상태에서만 겨우 움직임 가능' },
        { grade: 'Grade III', label: '중력 극복', criteria: '중력에 맞서 다리를 수직으로 들어올릴 수는 있으나 외부에서 누르는 힘은 전혀 이기지 못함' },
        { grade: 'Grade IV', label: '약간의 저항 극복', criteria: '약간의 약화는 있으나 스스로 체중을 지탱하고 서거나 가벼운 보행이 가능한 수준' },
        { grade: 'Grade V', label: '정상 근력', criteria: '충분한 저항을 극복하며 완전히 혼자서 걷고 자유롭게 활동 가능한 상태' }
      ]
    }
  },
  devices: {
    title: '이승돌봄 기기 및 로봇의 종류',
    description: '대상자의 기능 수준과 사용 환경에 따라 최적의 기기를 선택합니다. 크게 기립보조형과 슬링 리프트형으로 나뉩니다.',
    list: [
      {
        id: 'T-C',
        name: '전동형 기립보조기기',
        category: '기립보조기기 계열',
        target: '하지 지지는 어려우나 스스로 상체를 세우고 등받이 벨트를 잡을 수 있는 사용자',
        description: '모터 구동 실린더를 이용하여 벨트를 매고 엉덩이와 등을 받친 후 전동으로 부드럽게 일으켜 세워 침대에서 휠체어나 변기로 이송하는 기기입니다.',
        features: ['하체 근력이 부족해도 안전하게 기립 가능', '이승과 동시에 일어서기 운동 효과', '상체 및 손잡이 파지 협조 필수']
      },
      {
        id: 'T-D',
        name: '비전동형 기립보조기기',
        category: '기립보조기기 계열',
        target: '체중 지지가 어렵고 상체 근력 및 협조 능력이 많이 떨어지는 사용자',
        description: '대퇴부 및 전신을 감싸주는 하프슬링이나 고안전 패드를 이용하여 환자의 상체를 강하게 지탱한 후 레버나 수동 핸들링으로 들어 올려 앉히고 끌고 갈 수 있는 기기입니다.',
        features: ['전동 모터 없이 기계적 지렛대나 수동 조작 이용', '벨트 외에 무릎 지지대와 가슴 패드로 다중 지지', '환자 낙상 위험 최소화 구조']
      },
      {
        id: 'T-E',
        name: '천장 고정형 리프트',
        category: '전신 슬링 리프트 계열',
        target: '전신 마비 등으로 체중 지지가 불가하며 주거 내 천장 레일 설치가 가능한 사용자',
        description: '침대 위 천장 레일에 고정 모터를 매달아 전신 슬링 시트로 환자를 공중에 띄운 후 레일을 따라 휠체어나 화장실로 이송하는 편리하고 위생적인 장비입니다.',
        features: ['바닥 공간을 전혀 차지하지 않음', '단 한 명의 보호자도 무리 없이 극도로 안전한 이송 가능', '설치 공사 및 높은 초기 비용 소요']
      },
      {
        id: 'T-F',
        name: '벽 고정형 리프트',
        category: '전신 슬링 리프트 계열',
        target: '천장 공사는 불가능하지만 단단한 옹벽이 존재하여 고정 암 설치가 가능한 사용자',
        description: '벽면에 리프트 기둥과 회전식 암을 고정 설치하여 침대 주변 180도 반경 내에서 환자를 안아 올린 뒤 이송하는 기기입니다.',
        features: ['천장 지지가 약한 조립식 주택 등에도 설치 가능', '침대 바로 옆 휠체어 이승에 탁월함', '암의 회전 반경 내로 이동 범위 제한']
      },
      {
        id: 'T-G',
        name: '이동식 리프트',
        category: '전신 슬링 리프트 계열',
        target: '공사가 일절 불가하거나 여러 공간을 돌아다니며 리프트를 써야 하는 사용자',
        description: '바퀴가 달린 H형 지지대 프레임 위에 유압식 또는 전동 실린더 리프트를 올린 형태로, 고정 공사 없이 환자를 침대에서 들어 올려 원하는 방으로 이동하는 기기입니다.',
        features: ['공사 필요 없음', '바닥이 평평하고 문턱이 없어야 함', '장비 자체의 부피로 인해 좁은 문이나 코너 주행 시 회전 반경 필요']
      },
      {
        id: 'T-H',
        name: '이동식 겐트리 리프트',
        category: '전신 슬링 리프트 계열',
        target: '천장 타공 공사는 원치 않으나 독립형 지지대를 조립하여 안정적인 이동을 원하는 사용자',
        description: '침대 주변에 문 모양의 대형 프레임을 조립 세워놓고 그 프레임 상단의 레일을 따라 윈치 모터로 환자를 들어 올리는 임시 설치형 리프트입니다.',
        features: ['천장 훼손 불가 시 대안', '수평 및 수직 이동의 뛰어난 안정성', '프레임 조립을 위한 주변 여유 공간 필요']
      }
    ]
  }
};
