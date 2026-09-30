import { createRoot } from 'react-dom/client';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
// CSS import: 값을 받지 않는 부수 효과 import. Vite 개발 서버가 이 CSS를 <style>로 페이지에 넣는다(index.html의 link 대신 코드 의존 관계로 연결).
import './styles/global.css';

// React 루트: #root 안쪽 DOM을 React가 관리한다.
const root = createRoot(document.getElementById('root'));
// <HomePage />를 Layout 태그 사이에 넣으면 Layout이 children prop으로 받아 main 안에 그린다.
root.render(
  <Layout>
    <HomePage />
  </Layout>,
);
