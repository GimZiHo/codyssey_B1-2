import { createRoot } from 'react-dom/client';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';

// React 루트: #root 안쪽 DOM을 React가 관리한다.
const root = createRoot(document.getElementById('root'));
// <HomePage />를 Layout 태그 사이에 넣으면 Layout이 children prop으로 받아 main 안에 그린다.
root.render(
  <Layout>
    <HomePage />
  </Layout>,
);
