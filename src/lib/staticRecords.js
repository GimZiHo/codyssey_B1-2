// 정적 예시 배열: 원격 조회 전까지 홈·목록·상세가 함께 쓰는 학습 기록. 배열 순서가 곧 화면 순서다.
// id: 기록마다 고정된 고유 식별값. 목록 key와 상세 경로(/records/:recordId)의 값으로 쓴다.
export const staticRecords = [
  { id: 'jsx', title: 'JSX', project: 'B1-2' },
  { id: 'function-component', title: '함수 컴포넌트', project: 'B1-2' },
  { id: 'props', title: 'props', project: 'B1-2' },
];
