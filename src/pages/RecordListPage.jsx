import { Link } from 'react-router';
import PageTitle from '../components/PageTitle.jsx';
import { staticRecords } from '../lib/staticRecords.js';

// 목록 페이지: /records 경로에 매핑된다. 기록마다 id를 넣은 상세 경로 링크를 만든다.
export default function RecordListPage() {
  return (
    <div>
      <PageTitle title="학습 기록 목록" />
      <ul>
        {staticRecords.map((record) => (
          <li key={record.id}>
            <Link to={`/records/${record.id}`}>{record.title} ({record.project})</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
