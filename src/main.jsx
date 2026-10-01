import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import RecordListPage from './pages/RecordListPage.jsx';
import RecordNewPage from './pages/RecordNewPage.jsx';
import RecordDetailPage from './pages/RecordDetailPage.jsx';
import RecordEditPage from './pages/RecordEditPage.jsx';
// CSS import: 값을 받지 않는 부수 효과 import. Vite 개발 서버가 이 CSS를 <style>로 페이지에 넣는다(index.html의 link 대신 코드 의존 관계로 연결).
import './styles/global.css';

// React 루트: #root 안쪽 DOM을 React가 관리한다.
const root = createRoot(document.getElementById('root'));
// BrowserRouter: 주소창의 URL을 읽어 안쪽 Routes에 제공한다.
// Routes가 현재 URL에 가장 잘 맞는 Route 하나를 골라, 그 element가 Layout의 children으로 main 안에 그려진다.
// 라우트 매핑: path(경로 패턴)와 element(그릴 페이지)의 짝. :recordId는 어떤 값이든 받는 동적 세그먼트다.
root.render(
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/records" element={<RecordListPage />} />
        <Route path="/records/new" element={<RecordNewPage />} />
        <Route path="/records/:recordId" element={<RecordDetailPage />} />
        <Route path="/records/:recordId/edit" element={<RecordEditPage />} />
      </Routes>
    </Layout>
  </BrowserRouter>,
);
