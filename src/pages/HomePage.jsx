import PageTitle from '../components/PageTitle.jsx';

// 정적 예시 배열: 원격 조회 전까지 쓰는 학습 기록. 배열 순서가 곧 화면 순서다.
const records = [
  { title: 'JSX', project: 'B1-2' },
  { title: '함수 컴포넌트', project: 'B1-2' },
  { title: 'props', project: 'B1-2' },
];

// 함수 컴포넌트: JSX를 반환하는 대문자 이름의 함수. 홈 페이지 화면을 맡는다.
export default function HomePage() {
  // title prop: 표시할 제목은 부모인 HomePage가 정해 PageTitle에 전달한다.
  // 배열 렌더링: map이 기록마다 li를 만든 배열을 반환하고 React가 순서대로 그린다.
  // key는 17단계에서 지정하므로 지금은 개발 모드 key 경고가 출력된다.
  return (
    <div>
      <PageTitle title="학습 기록 서비스" />
      <ul>
        {records.map((record) => <li>{record.title} ({record.project})</li>)}
      </ul>
    </div>
  );
}
