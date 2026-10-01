import { useState } from 'react';
import PageTitle from '../components/PageTitle.jsx';
// 정적 기록은 목록·상세와 공유하도록 src/lib로 옮겼다. 홈에서는 기존 이름 records로 쓴다.
import { staticRecords as records } from '../lib/staticRecords.js';

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

  // 기록 삭제가 아니라 표시 개수만 0으로 바꾼다(원본 records는 그대로).
  function handleClear() {
    setVisibleCount(0);
  }

  // 배열 렌더링: slice로 앞에서 visibleCount개만 고른 새 배열(원본 records는 그대로).
  const visibleRecords = records.slice(0, visibleCount);

  // title prop: 표시할 제목은 부모인 HomePage가 정해 PageTitle에 전달한다.
  // 조건부 렌더링: 삼항 연산자로 안내와 목록 중 정확히 하나만 그린다(빈 ul은 DOM에 남지 않음).
  // 조건은 비교식으로 쓴다. `visibleCount && ...`는 0일 때 숫자 0을 그린다.
  // key: 다시 렌더링할 때 React가 같은 기록의 li를 짝지어 재사용하게 하는 표시.
  return (
    <div>
      <PageTitle title="학습 기록 서비스" />
      <p>{records.length}개 중 {visibleCount}개 표시</p>
      {visibleRecords.length === 0 ? (
        <p>표시할 학습 기록이 없습니다.</p>
      ) : (
        <ul>
          {visibleRecords.map((record) => (
            <li key={record.id}>{record.title} ({record.project})</li>
          ))}
        </ul>
      )}
      <button type="button" onClick={handleShowAll}>전체 보기</button>
      <button type="button" onClick={handleShowTwo}>2개 보기</button>
      <button type="button" onClick={handleClear}>목록 비우기</button>
      {/* onClick에는 호출 결과가 아닌 함수 자체를 전달한다(괄호 없음). */}
      <button type="button" onClick={handleCheckRecordCount}>기록 수 확인</button>
    </div>
  );
}
