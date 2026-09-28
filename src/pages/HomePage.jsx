import PageTitle from '../components/PageTitle.jsx';

// 함수 컴포넌트: JSX를 반환하는 대문자 이름의 함수. 홈 페이지 화면을 맡는다.
export default function HomePage() {
  // title prop: 표시할 제목은 부모인 HomePage가 정해 PageTitle에 전달한다.
  return <PageTitle title="학습 기록 서비스" />;
}
