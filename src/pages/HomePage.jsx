import { useState } from 'react';
import PageTitle from '../components/PageTitle.jsx';

// 정적 예시 배열: 원격 조회 전까지 쓰는 학습 기록. 배열 순서가 곧 화면 순서다.
// id: 기록마다 고정된 고유 식별값. 위치(index)가 아닌 데이터로 항목을 구분한다.
const records = [
  { id: 'jsx', title: 'JSX', project: 'B1-2' },
  { id: 'function-component', title: '함수 컴포넌트', project: 'B1-2' },
  { id: 'props', title: 'props', project: 'B1-2' },
];

// 함수 컴포넌트: JSX를 반환하는 대문자 이름의 함수. 홈 페이지 화면을 맡는다.
export default function HomePage() {
  // state: 렌더링 사이에 기억할 표시 개수. 지역변수와 달리 set 함수로 바꾸면 다시 렌더링된다.
  // Hook은 조건·핸들러 안이 아닌 컴포넌트 최상위에서 호출한다.
  const [visibleCount, setVisibleCount] = useState(2);

  // 이벤트 핸들러: 클릭 때 React가 호출할 함수. 화면을 바꾸지 않는 부수 효과(alert)만 실행한다.
  function handleCheckRecordCount() {
    window.alert(`현재 학습 기록은 ${records.length}개입니다.`);
  }

  // 이벤트 → 상태 변경: DOM을 직접 고치지 않고 state만 바꾸면 React가 목록을 다시 그린다.
  function handleShowAll() {
    setVisibleCount(records.length);
  }

  function handleShowTwo() {
    setVisibleCount(2);
  }

  // title prop: 표시할 제목은 부모인 HomePage가 정해 PageTitle에 전달한다.
  // 배열 렌더링: slice로 앞에서 visibleCount개만 고른 새 배열을 map으로 li로 바꾼다(원본 records는 그대로).
  // key: 다시 렌더링할 때 React가 같은 기록의 li를 짝지어 재사용하게 하는 표시.
  return (
    <div>
      <PageTitle title="학습 기록 서비스" />
      <p>{records.length}개 중 {visibleCount}개 표시</p>
      <ul>
        {records.slice(0, visibleCount).map((record) => (
          <li key={record.id}>{record.title} ({record.project})</li>
        ))}
      </ul>
      <button type="button" onClick={handleShowAll}>전체 보기</button>
      <button type="button" onClick={handleShowTwo}>2개 보기</button>
      {/* onClick에는 호출 결과가 아닌 함수 자체를 전달한다(괄호 없음). */}
      <button type="button" onClick={handleCheckRecordCount}>기록 수 확인</button>
    </div>
  );
}
