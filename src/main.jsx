import { createRoot } from 'react-dom/client';
import HomePage from './pages/HomePage.jsx';

// React 루트: #root 안쪽 DOM을 React가 관리한다.
const root = createRoot(document.getElementById('root'));
// <HomePage />: React가 HomePage 함수를 호출해 반환한 요소를 그린다.
root.render(<HomePage />);
