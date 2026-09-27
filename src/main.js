import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

// React 루트: #root 안쪽 DOM을 React가 관리한다.
const root = createRoot(document.getElementById('root'));
// JSX 변환 없이 React 요소(화면 설명 객체)를 직접 만들어 렌더링한다.
root.render(createElement('h1', null, '학습 기록 서비스'));
