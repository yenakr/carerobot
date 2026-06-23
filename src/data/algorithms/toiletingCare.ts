import { Question, Option } from './transferCare';

export const toiletingCareAlgorithm = {
  id: 'toileting',
  title: '배설돌봄로봇 자가평가 알고리즘',
  startQuestionId: 'q1',
  questions: {
    q1: {
      id: 'q1',
      title: '배뇨감 및 배변감을 인지하고 조절하는 데 어려움이 있나요?',
      simpleTitle: '스스로 대소변이 마렵다는 느낌(요의, 변의)을 잘 느끼고 조절하실 수 있나요?',
      description: '',
      simpleDescription: '환자분이 요의나 변의 신호를 느끼고 참거나 의사 표현을 잘 하시는지 체크해 보세요.',
      type: 'single',
      options: [
        { id: 'q1_0', text: '0점: 문제 없음', simpleText: '네, 대소변 신호를 알고 잘 조절해요', score: 0, value: '0' },
        { id: 'q1_1', text: '1점: 가벼운 어려움', simpleText: '가끔 실수하시지만 스스로 알아차려요', score: 1, value: '1' },
        { id: 'q1_2', text: '2점: 중간 정도의 어려움', simpleText: '신호를 가끔 모르시거나 대소변 실수가 잦아요', score: 2, value: '2' },
        { id: 'q1_3', text: '3점: 심한 어려움', simpleText: '참지 못하고 기저귀나 이불에 실례를 자주 해요', score: 3, value: '3' },
        { id: 'q1_4', text: '4점: 극심한 어려움', simpleText: '신호를 전혀 느끼지 못해 기저귀에 의존해요', score: 4, value: '4' },
      ],
      nextQuestionId: (answers: Record<string, any>) => {
        const val = parseInt(answers['q1'] || '0');
        if (val >= 2) return 'q2_b';
        return 'q2_a';
      }
    } as Question,

    q2_a: {
      id: 'q2_a',
      title: '화장실까지 스스로 이동하는 데 어려움이 있나요?',
      simpleTitle: '스스로 침실방에서 화장실 변기까지 안전하게 이동하실 수 있나요?',
      description: '',
      simpleDescription: '화장실까지 걸어가거나 휠체어로 안전하게 이동이 가능하신지 체크합니다.',
      type: 'single',
      options: [
        { id: 'q2a_0', text: '0점: 문제 없음', simpleText: '네, 혼자 걸어가실 수 있어요', score: 0, value: '0' },
        { id: 'q2a_1', text: '1점: 가벼운 어려움', simpleText: '약간 흔들리시지만 혼자 이동하세요', score: 1, value: '1' },
        { id: 'q2a_2', text: '2점: 중간 정도의 어려움', simpleText: '안전을 위해 보행기를 짚거나 부축해야 해요', score: 2, value: '2' },
        { id: 'q2a_3', text: '3점: 심한 어려움', simpleText: '다리 힘이 약해 주로 휠체어를 타고 부축받아야 해요', score: 3, value: '3' },
        { id: 'q2a_4', text: '4점: 극심한 어려움', simpleText: '화장실 거동이 안 되어 방 변기나 침상에서 해야 해요', score: 4, value: '4' },
      ],
      nextQuestionId: (answers: Record<string, any>) => {
        const val = parseInt(answers['q2_a'] || '0');
        if (val >= 2) return 'q3_a2';
        return 'q3_a1';
      }
    } as Question,

    q3_a1: {
      id: 'q3_a1',
      title: '용변을 마친 뒤 스스로 뒤처리를 할 수 있나요?',
      simpleTitle: '볼일을 다 보신 후에 스스로 휴지로 닦거나 옷을 정리할 수 있나요?',
      description: '',
      simpleDescription: '용변 뒤처리(세정)를 하고 바지를 온전히 올려 입을 수 있는지 체크합니다.',
      type: 'single',
      options: [
        { id: 'q3a1_0', text: '0점: 문제 없음', simpleText: '네, 혼자서 닦고 옷 입기까지 다 하세요', score: 0, value: '0' },
        { id: 'q3a1_1', text: '1점: 가벼운 어려움', simpleText: '시간이 걸리거나 서투르지만 혼자 하세요', score: 1, value: '1' },
        { id: 'q3a1_2', text: '2점: 중간 정도의 어려움', simpleText: '손이나 어깨 통증으로 닦을 때 부축이 필요해요', score: 2, value: '2' },
        { id: 'q3a1_3', text: '3점: 심한 어려움', simpleText: '보호자가 뒤처리를 해주고 바지 정리를 다 해야 해요', score: 3, value: '3' },
        { id: 'q3a1_4', text: '4점: 극심한 어려움', simpleText: '위생 처리를 할 수 없어 전적으로 닦아 드려야 해요', score: 4, value: '4' },
      ],
      resultId: (answers: Record<string, any>) => {
        const val = parseInt(answers['q3_a1'] || '0');
        if (val >= 2) return 'B-B';
        return 'B-A';
      }
    } as Question,

    q3_a2: {
      id: 'q3_a2',
      title: '용변을 마친 뒤 스스로 뒤처리를 할 수 있나요?',
      simpleTitle: '볼일을 다 보신 후에 스스로 휴지로 닦거나 옷을 정리할 수 있나요?',
      description: '',
      simpleDescription: '용변 뒤처리(세정)를 하고 바지를 온전히 올려 입을 수 있는지 체크합니다.',
      type: 'single',
      options: [
        { id: 'q3a2_0', text: '0점: 문제 없음', simpleText: '네, 혼자서 닦고 옷 입기까지 다 하세요', score: 0, value: '0' },
        { id: 'q3a2_1', text: '1점: 가벼운 어려움', simpleText: '시간이 걸리거나 서투르지만 혼자 하세요', score: 1, value: '1' },
        { id: 'q3a2_2', text: '2점: 중간 정도의 어려움', simpleText: '손이나 어깨 통증으로 닦을 때 부축이 필요해요', score: 2, value: '2' },
        { id: 'q3a2_3', text: '3점: 심한 어려움', simpleText: '보호자가 뒤처리를 해주고 바지 정리를 다 해야 해요', score: 3, value: '3' },
        { id: 'q3a2_4', text: '4점: 극심한 어려움', simpleText: '위생 처리를 할 수 없어 전적으로 닦아 드려야 해요', score: 4, value: '4' },
      ],
      resultId: (answers: Record<string, any>) => {
        const val = parseInt(answers['q3_a2'] || '0');
        if (val >= 2) return 'B-D';
        return 'B-C';
      }
    } as Question,

    q2_b: {
      id: 'q2_b',
      title: '화장실까지 스스로 이동하는 데 어려움이 있나요?',
      simpleTitle: '스스로 침실방에서 화장실 변기까지 안전하게 이동하실 수 있나요?',
      description: '',
      simpleDescription: '대소변 실수가 다소 잦은 상황에서, 화장실 변기까지 걸어갈 수 있는 능력을 확인합니다.',
      type: 'single',
      options: [
        { id: 'q2b_0', text: '0점: 문제 없음', simpleText: '네, 혼자 걸어가실 수 있어요', score: 0, value: '0' },
        { id: 'q2b_1', text: '1점: 가벼운 어려움', simpleText: '약간 흔들리시지만 혼자 이동하세요', score: 1, value: '1' },
        { id: 'q2b_2', text: '2점: 중간 정도의 어려움', simpleText: '안전을 위해 보행기를 짚거나 부축해야 해요', score: 2, value: '2' },
        { id: 'q2b_3', text: '3점: 심한 어려움', simpleText: '다리 힘이 약해 주로 휠체어를 타고 부축받아야 해요', score: 3, value: '3' },
        { id: 'q2b_4', text: '4점: 극심한 어려움', simpleText: '화장실 거동이 안 되어 방 변기나 침상에서 해야 해요', score: 4, value: '4' },
      ],
      nextQuestionId: (answers: Record<string, any>) => {
        const val = parseInt(answers['q2_b'] || '0');
        if (val >= 2) return 'q3_b2';
        return 'q3_b1';
      }
    } as Question,

    q3_b1: {
      id: 'q3_b1',
      title: '용변을 마친 뒤 스스로 뒤처리를 할 수 있나요?',
      simpleTitle: '볼일을 다 보신 후에 스스로 휴지로 닦거나 옷을 정리할 수 있나요?',
      description: '',
      simpleDescription: '용변 뒤처리(세정)를 하고 바지를 온전히 올려 입을 수 있는지 체크합니다.',
      type: 'single',
      options: [
        { id: 'q3b1_0', text: '0점: 문제 없음', simpleText: '네, 혼자서 닦고 옷 입기까지 다 하세요', score: 0, value: '0' },
        { id: 'q3b1_1', text: '1점: 가벼운 어려움', simpleText: '시간이 걸리거나 서투르지만 혼자 하세요', score: 1, value: '1' },
        { id: 'q3b1_2', text: '2점: 중간 정도의 어려움', simpleText: '손이나 어깨 통증으로 닦을 때 부축이 필요해요', score: 2, value: '2' },
        { id: 'q3b1_3', text: '3점: 심한 어려움', simpleText: '보호자가 뒤처리를 해주고 바지 정리를 다 해야 해요', score: 3, value: '3' },
        { id: 'q3b1_4', text: '4점: 극심한 어려움', simpleText: '위생 처리를 할 수 없어 전적으로 닦아 드려야 해요', score: 4, value: '4' },
      ],
      resultId: (answers: Record<string, any>) => {
        const val = parseInt(answers['q3_b1'] || '0');
        if (val >= 2) return 'B-F';
        return 'B-E';
      }
    } as Question,

    q3_b2: {
      id: 'q3_b2',
      title: '용변을 마친 뒤 스스로 뒤처리를 할 수 있나요?',
      simpleTitle: '볼일을 다 보신 후에 스스로 휴지로 닦거나 옷을 정리할 수 있나요?',
      description: '',
      simpleDescription: '용변 뒤처리(세정)를 하고 바지를 온전히 올려 입을 수 있는지 체크합니다.',
      type: 'single',
      options: [
        { id: 'q3b2_0', text: '0점: 문제 없음', simpleText: '네, 혼자서 닦고 옷 입기까지 다 하세요', score: 0, value: '0' },
        { id: 'q3b2_1', text: '1점: 가벼운 어려움', simpleText: '시간이 걸리거나 서투르지만 혼자 하세요', score: 1, value: '1' },
        { id: 'q3b2_2', text: '2점: 중간 정도의 어려움', simpleText: '손이나 어깨 통증으로 닦을 때 부축이 필요해요', score: 2, value: '2' },
        { id: 'q3b2_3', text: '3점: 심한 어려움', simpleText: '보호자가 뒤처리를 해주고 바지 정리를 다 해야 해요', score: 3, value: '3' },
        { id: 'q3b2_4', text: '4점: 극심한 어려움', simpleText: '위생 처리를 할 수 없어 전적으로 닦아 드려야 해요', score: 4, value: '4' },
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
      title: '도움 불필요',
      simpleTitle: '기기 도움 없이 스스로 해결 가능',
      description: '인지력, 화장실 이동 능력, 용변 후 청결 관리 능력이 모두 양호하여 현재 특별한 돌봄로봇 지원은 필요하지 않습니다.',
      simpleDescription: '요의 인지, 보행 이동, 뒤처리가 모두 원활하게 잘 유지되는 상태이므로 특별한 위생 보조 기기는 불필요합니다.',
      recommendation: '독립적인 배설 관리를 유지하기 위해 가벼운 스트레칭이나 일상 활동을 계속 장려합니다.',
      simpleRecommendation: '현재의 양호한 신체 관리 능력을 유지하도록 스트레칭과 규칙적인 화장실 이용을 계속 장려합니다.',
      reason: '배뇨와 배변 인지, 화장실 이동, 용변 후 청결 평가에서 모두 어려움이 낮음으로 판정되었습니다.',
      simpleResultSummary: '스스로 신호를 알고 화장실로 이동해 뒤처리를 안전히 마치실 수 있어 보조 기기가 필요하지 않습니다.'
    },
    'B-B': {
      id: 'B-B',
      title: '비데 고려',
      simpleTitle: '자동 위생 세정 비데 추천',
      description: '인지와 화장실 이동은 양호하나 용변 후 잔여물을 깨끗하게 뒤처리하고 위생관리를 대행받을 필요가 있는 상태입니다.',
      simpleDescription: '화장실로 직접 걸어가실 수 있고 정신이 명료하지만, 손가락 통증 등으로 휴지 뒤처리가 잘 안 될 때 요로 감염 등을 예방하기 위해 세정을 돕는 기기입니다.',
      recommendation: '온수 세정 및 건조가 자동으로 연동되는 비데 시트 도입을 고려해보세요.',
      simpleRecommendation: '용변 후 따뜻한 물로 세척하고 바람으로 보송하게 건조하는 전동 온수 비데 사용을 추천합니다.',
      reason: '배뇨와 배변 인지 조절과 화장실 이동 능력은 양호하나 용변 후 위생 뒤처리 단계에서 중간 정도 이상의 기능적 지장이 평가되었습니다.',
      simpleResultSummary: '어깨 결림이나 관절 통증 등으로 휴지 닦기가 곤란하시므로, 자동 위생 비데를 추천합니다.'
    },
    'B-C': {
      id: 'B-C',
      title: '화장실 이동 보조 및 변기 리프트 고려',
      simpleTitle: '화장실 변기 전동 리프트 추천',
      description: '배설 의사는 명확히 인지하고 뒤처리 능력도 갖추었으나 보행 장애나 균형 저하로 인해 변기에 착석하고 일어서는 데 어려움이 큽니다.',
      simpleDescription: '화장실 변기에서 앉고 일어설 때 하체 근력이 부족해 무리가 가거나 낙상 위험이 높을 때, 모터 힘으로 시트를 밀어 올려 관절을 지켜주는 리프트입니다.',
      recommendation: '일반 변기에 설치 가능한 양변기 리프트 또는 보행 보조기 활용을 추천합니다.',
      simpleRecommendation: '양변기 주변에 설치하여 시트 각도와 높이를 부드럽게 세워주는 변기 전동 리프트 시공을 권장합니다.',
      reason: '배뇨와 배변감 인지는 잘하고 뒤처리는 가능하지만 화장실까지의 이동 단계에서 낙상 위험 등 중등도 이상의 어려움을 겪고 있습니다.',
      simpleResultSummary: '스스로의 인지와 세정은 양호하나 변기 착석/기립 시 무릎 통증이 심하시므로, 전동 변기 리프트를 추천합니다.'
    },
    'B-D': {
      id: 'B-D',
      title: '이동 변기 이용',
      simpleTitle: '침실 간이 이동 변기 추천',
      description: '배설감은 스스로 느끼지만 화장실로의 이동과 용변 후 뒤처리를 독자적으로 수행하기 불가능하므로 침실 내에서 해결하는 이동 변기 솔루션이 권장됩니다.',
      recommendation: '방 안에 배치할 수 있고 팔걸이와 높이 조절이 가능한 가구형 이동 변기를 도입하세요.',
      simpleDescription: '소대변 신호는 아시나 거동이 불편해 방 밖의 먼 화장실까지 걸어갈 수 없는 분들을 위해, 침대 바로 옆에 놓고 안전하게 이동 탑승하여 해결하는 침상 변기입니다.',
      simpleRecommendation: '높이 조절식 스윙 팔걸이로 휠체어에서 즉각 슬라이딩 착석이 가능한 목재/가구형 이동 변기 사용을 권장합니다.',
      reason: '배뇨와 배변감은 인지하지만 이동과 위생 뒤처리 모두에서 자립 수행이 불가능한 수준의 큰 제한이 존재합니다.',
      simpleResultSummary: '요의는 확실하나 화장실 이동 보행이 불가하므로 침대 바로 곁에서 용변을 해결하는 이동식 변기를 추천합니다.'
    },
    'B-E': {
      id: 'B-E',
      title: '시간에 맞춘 배뇨·배변 프로그램 적용',
      simpleTitle: '인지 유도식 배설 프로그램 추천',
      description: '화장실로 걸어갈 수 있고 뒤처리도 할 수 있지만 인지 기능 저하로 인해 배뇨와 배변 시기를 알아차리지 못해 실금하는 위험이 높은 단계입니다.',
      simpleDescription: '치매나 뇌기능 저하로 방광에 소변이 차는 감각을 제때 알아차리지 못해 실금할 때, 스마트 센서 신호에 맞추어 시간마다 배설을 유도하는 훈련법입니다.',
      recommendation: '스마트 배뇨 예측 센서를 활용하여 정해진 시간마다 화장실로 동반 이동하는 체계적 훈련을 실시하세요.',
      simpleRecommendation: '하복부에 초음파 예측 센서를 대어 소변 참을성을 측정하고, 2시간 간격 등으로 동행해 배뇨하도록 돕는 예약 훈련을 시작해 보십시오.',
      reason: '배뇨와 배변감 인지에 중등도 이상의 장해가 있지만 신체적 이동력과 뒤처리 기능은 보존되어 인지적 지원이 주로 필요합니다.',
      simpleResultSummary: '신체 거동과 청결 관리는 양호하나 대소변 시기를 자각하지 못하므로, 정기적 알림 유도 배설을 추천합니다.'
    },
    'B-F': {
      id: 'B-F',
      title: '시간에 맞춘 배뇨·배변 프로그램 및 비데 이용',
      simpleTitle: '예약 배설 유도 및 비데 세정 추천',
      description: '배설 인지 능력이 떨어져 제때 화장실을 가기 어렵고 신체적 관절 가동 범위 제한 등으로 용변 후 처리 능력마저 결여된 상태입니다.',
      simpleDescription: '배설 신호를 제때 알지 못하고 손 움직임도 둔해 닦아내지 못하지만 보호자가 부축하면 변기까지 걸어갈 수 있는 분들을 위한 혼합 조력 방식입니다.',
      recommendation: '주기적 알림 센서와 함께 화장실 내 전동 비데 시트 세정 시스템을 보조로 구축하는 것을 고려하십시오.',
      simpleRecommendation: '정해진 시간에 환자를 화장실로 인도하고, 뒤처리는 기계의 도움을 받아 자동으로 스프레이 세정 건조하도록 비데를 연동해 구축하십시오.',
      reason: '배설 인지 및 위생 뒤처리 영역에서 동시에 독립성이 결여되었으나 화장실까지의 이동은 비교적 가능한 상태입니다.',
      simpleResultSummary: '용변 신호를 인지하기 힘든 인지저하 상태이고 뒤처리도 불가하므로, 규칙적인 동행 부축과 자동 비데 시트를 추천합니다.'
    },
    'B-G': {
      id: 'B-G',
      title: '자동배설로봇 간헐적 이용',
      simpleTitle: '자동 배설 처리 로봇 (간헐용) 추천',
      description: '배설감을 인지하지 못하고 화장실로 직접 이동할 수도 없지만 다행히 보호자 도움을 받아 간헐적으로 침상에서 기기를 장착하여 뒤처리를 자동화하는 솔루션이 효과적입니다.',
      simpleDescription: '용변 느낌을 잘 모르고 걷지 못해 침대에 완전히 누워 계실 때, 소대변 감지 센서가 내장된 패드를 착용해 오물 처리 물청소를 대행해 주는 로봇입니다.',
      recommendation: '야간 또는 특정 시간대에 탈부착이 가능한 세정식 자동배설로봇의 간헐적 도입을 고려해 볼 수 있습니다.',
      simpleRecommendation: '취침 시간대나 특정 시간에 탈착식 패드 컵 센서를 부착하여 오물을 빨아들이고 자동으로 씻겨주는 배설로봇을 추천합니다.',
      reason: '배설 인지 및 이동 능력이 크게 손상되어 있으나 신체 협조와 위생 청결 자체는 일정 수준 협조가 가능한 상황입니다.',
      simpleResultSummary: '대소변 신호를 자각하지 못하고 침상에 줄곧 누워 지내시므로, 오물 감지 시 자동으로 수거·세정하는 간헐식 배설로봇을 추천합니다.'
    },
    'B-H': {
      id: 'B-H',
      title: '흡인형 스마트 기저귀 로봇시스템 지속적 이용',
      simpleTitle: '음압 진공 스마트 기저귀 로봇 추천',
      description: '배설 인지, 이동 능력, 용변 후 뒤처리 자립도가 모두 상실된 전적인 와상 환자에게 자동으로 대소변을 처리해주는 스마트 기저귀 로봇시스템입니다.',
      simpleDescription: '24시간 침대에 완전히 누워 지내며 스스로의 어떠한 신체 기능 조율도 불가능한 환자에게, 자동으로 오물을 1초 만에 감지 진공 흡입하고 세정 드라이까지 마무리해주는 로봇입니다.',
      recommendation: '침상에서 대소변을 감지 즉시 흡입, 세정, 온풍 건조하는 24시간 연동 흡인형 스마트 기저귀 로봇시스템 배치를 추천합니다.',
      simpleRecommendation: '배뇨 배변과 즉시 음압 진공으로 흡인하고 물 세척과 온풍 드라이를 사람 손 없이 원스톱으로 처리하는 지속 가동 스마트 기저귀 로봇 구축을 추천합니다.',
      reason: '배설 인지, 화장실 이동, 용변 후 청결 전 평가 영역에서 가장 중증인 극심한 어려움 상태를 보이고 있습니다.',
      simpleResultSummary: '인지, 거동, 뒤처리가 모두 차단되어 줄곧 누워 계시는 중증 와상 상태로, 24시간 대소변 감지 후 자동 물세척을 처리해주는 음압 스마트 기저귀 로봇을 추천합니다.'
    }
  }
};
