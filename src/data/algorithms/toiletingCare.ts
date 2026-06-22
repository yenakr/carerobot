import { Question, Option } from './transferCare';

export const toiletingCareAlgorithm = {
  id: 'toileting',
  title: '배설돌봄 자가평가 알고리즘',
  startQuestionId: 'q1',
  questions: {
    q1: {
      id: 'q1',
      title: 'Q1. 배뇨감 및 배변감 인지 평가',
      description: '배뇨감 또는 배변감을 인지하고 스스로 조절하는 데 어려움이 있나요?',
      type: 'single',
      options: [
        { id: 'q1_0', text: '0점: 문제 없음', score: 0, value: '0' },
        { id: 'q1_1', text: '1점: 가벼운 어려움', score: 1, value: '1' },
        { id: 'q1_2', text: '2점: 중간 정도의 어려움', score: 2, value: '2' },
        { id: 'q1_3', text: '3점: 심한 어려움', score: 3, value: '3' },
        { id: 'q1_4', text: '4점: 극심한 어려움', score: 4, value: '4' },
      ],
      nextQuestionId: (answers: Record<string, any>) => {
        const val = parseInt(answers['q1'] || '0');
        if (val >= 2) return 'q2_b';
        return 'q2_a';
      }
    } as Question,

    q2_a: {
      id: 'q2_a',
      title: 'Q2-A. 화장실 이동 평가',
      description: '화장실까지 스스로 이동하는 데 어려움이 있나요?',
      type: 'single',
      options: [
        { id: 'q2a_0', text: '0점: 문제 없음', score: 0, value: '0' },
        { id: 'q2a_1', text: '1점: 가벼운 어려움', score: 1, value: '1' },
        { id: 'q2a_2', text: '2점: 중간 정도의 어려움', score: 2, value: '2' },
        { id: 'q2a_3', text: '3점: 심한 어려움', score: 3, value: '3' },
        { id: 'q2a_4', text: '4점: 극심한 어려움', score: 4, value: '4' },
      ],
      nextQuestionId: (answers: Record<string, any>) => {
        const val = parseInt(answers['q2_a'] || '0');
        if (val >= 2) return 'q3_a2';
        return 'q3_a1';
      }
    } as Question,

    q3_a1: {
      id: 'q3_a1',
      title: 'Q3-A1. 용변 후 청결 평가',
      description: '상황: 인지 어려움 낮음, 이동 어려움 낮음\n용변 후 청결을 스스로 할 수 있나요?',
      type: 'single',
      options: [
        { id: 'q3a1_0', text: '0점: 문제 없음', score: 0, value: '0' },
        { id: 'q3a1_1', text: '1점: 가벼운 어려움', score: 1, value: '1' },
        { id: 'q3a1_2', text: '2점: 중간 정도의 어려움', score: 2, value: '2' },
        { id: 'q3a1_3', text: '3점: 심한 어려움', score: 3, value: '3' },
        { id: 'q3a1_4', text: '4점: 극심한 어려움', score: 4, value: '4' },
      ],
      resultId: (answers: Record<string, any>) => {
        const val = parseInt(answers['q3_a1'] || '0');
        if (val >= 2) return 'B-B';
        return 'B-A';
      }
    } as Question,

    q3_a2: {
      id: 'q3_a2',
      title: 'Q3-A2. 용변 후 청결 평가',
      description: '상황: 인지 어려움 낮음, 이동 어려움 높음\n용변 후 청결을 스스로 할 수 있나요?',
      type: 'single',
      options: [
        { id: 'q3a2_0', text: '0점: 문제 없음', score: 0, value: '0' },
        { id: 'q3a2_1', text: '1점: 가벼운 어려움', score: 1, value: '1' },
        { id: 'q3a2_2', text: '2점: 중간 정도의 어려움', score: 2, value: '2' },
        { id: 'q3a2_3', text: '3점: 심한 어려움', score: 3, value: '3' },
        { id: 'q3a2_4', text: '4점: 극심한 어려움', score: 4, value: '4' },
      ],
      resultId: (answers: Record<string, any>) => {
        const val = parseInt(answers['q3_a2'] || '0');
        if (val >= 2) return 'B-D';
        return 'B-C';
      }
    } as Question,

    q2_b: {
      id: 'q2_b',
      title: 'Q2-B. 화장실 이동 평가',
      description: '화장실까지 스스로 이동하는 데 어려움이 있나요?',
      type: 'single',
      options: [
        { id: 'q2b_0', text: '0점: 문제 없음', score: 0, value: '0' },
        { id: 'q2b_1', text: '1점: 가벼운 어려움', score: 1, value: '1' },
        { id: 'q2b_2', text: '2점: 중간 정도의 어려움', score: 2, value: '2' },
        { id: 'q2b_3', text: '3점: 심한 어려움', score: 3, value: '3' },
        { id: 'q2b_4', text: '4점: 극심한 어려움', score: 4, value: '4' },
      ],
      nextQuestionId: (answers: Record<string, any>) => {
        const val = parseInt(answers['q2_b'] || '0');
        if (val >= 2) return 'q3_b2';
        return 'q3_b1';
      }
    } as Question,

    q3_b1: {
      id: 'q3_b1',
      title: 'Q3-B1. 용변 후 청결 평가',
      description: '상황: 인지 어려움 높음, 이동 어려움 낮음\n용변 후 청결을 스스로 할 수 있나요?',
      type: 'single',
      options: [
        { id: 'q3b1_0', text: '0점: 문제 없음', score: 0, value: '0' },
        { id: 'q3b1_1', text: '1점: 가벼운 어려움', score: 1, value: '1' },
        { id: 'q3b1_2', text: '2점: 중간 정도의 어려움', score: 2, value: '2' },
        { id: 'q3b1_3', text: '3점: 심한 어려움', score: 3, value: '3' },
        { id: 'q3b1_4', text: '4점: 극심한 어려움', score: 4, value: '4' },
      ],
      resultId: (answers: Record<string, any>) => {
        const val = parseInt(answers['q3_b1'] || '0');
        if (val >= 2) return 'B-F';
        return 'B-E';
      }
    } as Question,

    q3_b2: {
      id: 'q3_b2',
      title: 'Q3-B2. 용변 후 청결 평가',
      description: '상황: 인지 어려움 높음, 이동 어려움 높음\n용변 후 청결을 스스로 할 수 있나요?',
      type: 'single',
      options: [
        { id: 'q3b2_0', text: '0점: 문제 없음', score: 0, value: '0' },
        { id: 'q3b2_1', text: '1점: 가벼운 어려움', score: 1, value: '1' },
        { id: 'q3b2_2', text: '2점: 중간 정도의 어려움', score: 2, value: '2' },
        { id: 'q3b2_3', text: '3점: 심한 어려움', score: 3, value: '3' },
        { id: 'q3b2_4', text: '4점: 극심한 어려움', score: 4, value: '4' },
      ],
      resultId: (answers: Record<string, any>) => {
        const val = parseInt(answers['q3_b2'] || '0');
        if (val >= 2) return 'B-H';
        return 'B-G';
      }
    } as Question,
  },
  results: {
    'B-A': {
      id: 'B-A',
      title: 'B-A. 도움 불필요',
      description: '인지력, 화장실 이동 능력, 용변 후 청결 관리 능력이 모두 양호하여 현재 특별한 돌봄기기나 로봇 지원은 필요하지 않습니다.',
      recommendation: '독립적인 배설 관리를 유지하기 위해 가벼운 스트레칭이나 일상 활동을 계속 장려합니다.',
      reason: '배뇨와 배변 인지, 화장실 이동, 용변 후 청결 평가에서 모두 어려움이 낮음으로 판정되었습니다.'
    },
    'B-B': {
      id: 'B-B',
      title: 'B-B. 용변 후 처리 돕기',
      description: '인지와 화장실 이동은 양호하나 용변 후 잔여물을 깨끗하게 뒤처리하고 옷을 입고 벗는 등의 개인 위생 처리에 중간 이상의 어려움이 있는 상태입니다.',
      recommendation: '비데 일체형 변기, 항문 청결 보조도구, 또는 자동 위생 뒤처리 장치 도입을 고려해보세요.',
      reason: '배뇨와 배변 인지 조절과 화장실 이동 능력은 양호하나 용변 후 위생 뒤처리 단계에서 중간 정도 이상의 기능적 지장이 평가되었습니다.'
    },
    'B-C': {
      id: 'B-C',
      title: 'B-C. 화장실 이동 돕기',
      description: '배설 의사는 명확히 인지하고 뒤처리 능력도 갖추었으나 보행 장애나 균형 저하로 인해 침대에서 화장실까지 물리적으로 안전하게 이동하는 데 어려움이 큽니다.',
      recommendation: '보행 보조기, 휠체어, 또는 화장실 문턱 제거 및 안전 바 설치, 간이 이동변기 활용을 추천합니다.',
      reason: '배뇨와 배변감 인지는 잘하고 뒤처리는 가능하지만 화장실까지의 이동 단계에서 낙상 위험 등 중등도 이상의 어려움을 겪고 있습니다.'
    },
    'B-D': {
      id: 'B-D',
      title: 'B-D. 침상 배변 또는 이동변기 이용',
      description: '배설감은 스스로 느끼지만 화장실로의 이동과 용변 후 뒤처리를 독자적으로 수행하기 불가능하므로 침실 내에서 해결하는 보조 솔루션이 권장됩니다.',
      recommendation: '방 안에 배치할 수 있는 침상용 이동변기 또는 침상용 소형 기립보조, 이승보조 기기를 고려하세요.',
      reason: '배뇨와 배변감은 인지하지만 이동과 위생 뒤처리 모두에서 자립 수행이 불가능한 수준의 큰 제한이 존재합니다.'
    },
    'B-E': {
      id: 'B-E',
      title: 'B-E. 시간에 맞춘 배뇨·배변 프로그램 적용',
      description: '화장실로 걸어갈 수 있고 뒤처리도 할 수 있지만 인지 기능 저하로 인해 배뇨와 배변 시기를 알아차리지 못해 실금하는 위험이 높은 단계입니다.',
      recommendation: '스마트 배뇨 예측 센서를 활용하여 정해진 시간마다 화장실로 동반 이동하는 체계적 훈련을 실시하세요.',
      reason: '배뇨와 배변감 인지에 중등도 이상의 장해가 있지만 신체적 이동력과 뒤처리 기능은 보존되어 인지적 지원이 주로 필요합니다.'
    },
    'B-F': {
      id: 'B-F',
      title: 'B-F. 시간에 맞춘 배뇨·배변 프로그램 및 용변 후 처리 돕기',
      description: '배설 인지 능력이 떨어져 제때 화장실을 가기 어렵고 신체적 관절 가동 범위 제한 등으로 용변 후 처리 능력마저 결여된 상태입니다.',
      recommendation: '주기적 알림 센서와 함께 위생비데 및 환자용 자동 세정, 건조 장치를 보조로 구축하는 것을 고려하십시오.',
      reason: '배설 인지 및 위생 뒤처리 영역에서 동시에 독립성이 결여되었으나 화장실까지의 이동은 비교적 가능한 상태입니다.'
    },
    'B-G': {
      id: 'B-G',
      title: 'B-G. 자동 배설처리로봇 간헐적 이용',
      description: '배설감을 인지하지 못하고 화장실로 직접 이동할 수도 없지만 다행히 보호자 도움을 받아 간헐적으로 침상에서 기기를 장착하여 뒤처리를 자동화하는 솔루션이 효과적입니다.',
      recommendation: '야간 또는 특정 시간대에 탈부착이 가능한 세정식 자동배설처리로봇의 간헐적 도입을 고려해 볼 수 있습니다.',
      reason: '배설 인지 및 이동 능력이 크게 손상되어 있으나 신체 협조와 위생 청결 자체는 일정 수준 협조가 가능한 상황입니다.'
    },
    'B-H': {
      id: 'B-H',
      title: 'B-H. 자동 배설처리로봇 지속적 이용',
      description: '배설 인지, 이동 능력, 용변 후 뒤처리 자립도가 모두 상실된 전적인 침상 고정 상태의 대상자에게 가장 높은 등급의 간호를 제공하는 로봇형 배설 케어입니다.',
      recommendation: '침상에 누운 상태에서 소변과 대변을 감지하여 즉시 흡입, 온수 세정, 온풍 건조까지 전 과정을 자동으로 처리하는 흡입식 자동배설처리로봇을 24시간 연동 사용하기를 권장합니다.',
      reason: '배설 인지, 화장실 이동, 용변 후 청결 전 평가 영역에서 가장 중증인 극심한 어려움 상태를 보이고 있습니다.'
    }
  }
};
