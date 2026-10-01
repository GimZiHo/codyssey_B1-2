import PageTitle from '../components/PageTitle.jsx';

// 등록 페이지: /records/new 경로에 매핑된다. 폼은 이후 단계에서 추가한다.
export default function RecordNewPage() {
  return (
    <div>
      <PageTitle title="학습 기록 등록" />
      <p>새 학습 기록을 등록할 페이지입니다.</p>
    </div>
  );
}
