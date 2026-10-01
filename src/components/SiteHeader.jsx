import { Link } from 'react-router';

// 공통 헤더: 모든 페이지 위에 같은 서비스 이름을 둔다. 페이지 제목 h1은 페이지가 맡으므로 여기서는 쓰지 않는다.
// Link: <a href>를 그리되, 클릭 시 문서를 다시 받지 않고 주소만 바꿔 Routes가 페이지를 다시 고르게 한다.
export default function SiteHeader() {
  return (
    <header>
      <p>Codyssey B1-2</p>
      <nav>
        <Link to="/">홈</Link>
        <Link to="/records">학습 기록</Link>
        <Link to="/records/new">기록 등록</Link>
      </nav>
    </header>
  );
}
