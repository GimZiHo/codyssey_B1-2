import { createRoot } from 'react-dom/client';

// React 루트: #root 안쪽 DOM을 React가 관리한다.
const root = createRoot(document.getElementById('root'));
// JSX: Vite(Oxc)가 .jsx를 React 요소 생성 호출로 변환한다. automatic 런타임이 import를 자동으로 넣는다.
root.render(<h1>학습 기록 서비스</h1>);
