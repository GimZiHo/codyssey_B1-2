import PageTitle from '../components/PageTitle.jsx';

// 수정 페이지: /records/:recordId/edit 경로에 매핑된다. 식별자 값은 아직 읽지 않는다.
export default function RecordEditPage() {
  return (
    <div>
      <PageTitle title="학습 기록 수정" />
      <p>학습 기록을 수정할 페이지입니다.</p>
    </div>
  );
}
