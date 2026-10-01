import { useParams } from 'react-router';
import PageTitle from '../components/PageTitle.jsx';
import { staticRecords } from '../lib/staticRecords.js';

// 상세 페이지: /records/:recordId 경로에 매핑된다.
export default function RecordDetailPage() {
  // 라우트 파라미터: 동적 세그먼트 :recordId 자리에 들어온 URL 값(항상 문자열).
  const { recordId } = useParams();
  // state에 복사하지 않고 렌더링마다 찾는다. 상세 사이에서 id만 바뀌어도 현재 URL의 기록을 표시한다.
  const record = staticRecords.find((item) => item.id === recordId);

  // 일치하는 기록이 없으면 최소 안내만 표시한다(전용 Not Found는 다음 단계).
  return (
    <div>
      <PageTitle title="학습 기록 상세" />
      {record ? (
        <div>
          <p>제목: {record.title}</p>
          <p>프로젝트: {record.project}</p>
        </div>
      ) : (
        <p>해당 학습 기록을 찾을 수 없습니다.</p>
      )}
    </div>
  );
}
