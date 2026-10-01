import PageTitle from '../components/PageTitle.jsx';

// 목록 페이지: /records 경로에 매핑된다. 이번 단계는 경로 확인용 최소 내용만 둔다.
export default function RecordListPage() {
  return (
    <div>
      <PageTitle title="학습 기록 목록" />
      <p>학습 기록 목록을 표시할 페이지입니다.</p>
    </div>
  );
}
