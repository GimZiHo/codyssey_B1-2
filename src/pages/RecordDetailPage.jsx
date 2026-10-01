import PageTitle from '../components/PageTitle.jsx';

// 상세 페이지: /records/:recordId 경로에 매핑된다. 식별자 값은 아직 읽지 않는다.
export default function RecordDetailPage() {
  return (
    <div>
      <PageTitle title="학습 기록 상세" />
      <p>학습 기록 하나를 표시할 페이지입니다.</p>
    </div>
  );
}
