# 001. React 진입점에서 화면까지의 렌더링 흐름

## 학습 목적

React 프로젝트의 진입점이 어디서 시작해 화면에 어떻게 표시되는지 이해한다. B1-1에서 직접 DOM을 조작해 화면을 그리던 방식과 비교해, React가 같은 결과를 어떤 경로로 만드는지 확인한다.

## 핵심 개념

1. `index.html`의 `<div id="root"></div>`가 React가 실제 DOM 요소를 그려 넣을 자리다. B1-1에서 `document.getElementById`로 직접 찾아 `innerHTML`이나 `appendChild`로 채우던 그 대상과 같은 종류의 노드다(B1-1 학습자료 참고: `../../../codyssey_B1-1/docs/learning/README.md`).
2. `src/main.jsx`의 `createRoot(document.getElementById('root')).render(<App />)`가 그 자리를 React의 렌더링 대상으로 지정하고, `App` 컴포넌트가 반환하는 JSX를 최초로 그린다. `createRoot`는 react-dom/client가 제공하는 함수로, DOM 노드를 인자로 받아 React 전용 루트를 만든다. 이후 `.render()`가 실제 컴포넌트 트리를 그 루트에 그린다.
3. `src/App.jsx`의 `App` 함수는 JSX(`<main>...</main>`)를 반환하는 순수 함수 컴포넌트다. React는 이 반환값을 해석해 실제 DOM 요소(`<main>`, `<h1>`, `<p>`)를 만들어 `#root` 아래에 삽입한다. B1-1처럼 각 요소를 직접 생성·삽입하는 코드를 작성하지 않고, "무엇을 보여줄지"만 선언하면 React가 DOM 반영을 대신한다.

## 적용

- `index.html:9` `<div id="root">`
- `src/main.jsx:7-11` `createRoot(...).render(<StrictMode><App /></StrictMode>)`
- `src/App.jsx:2-10` `App` 함수의 JSX 반환

## 실행 흐름

1. 브라우저가 `index.html`을 읽고 `#root` 빈 요소와 `src/main.jsx` 모듈 스크립트를 로드한다.
2. `main.jsx`가 `#root`를 찾아 React 루트를 만들고 `<App />`을 렌더링 요청한다.
3. `App` 함수가 호출되어 JSX를 반환하면, React가 이를 실제 DOM 요소로 변환해 `#root` 내부에 삽입한다.

## 확인 결과

- `npm run dev`로 개발 서버를 실행해 브라우저에서 `h1`("학습 기록 서비스")과 안내 문구가 표시됨을 확인했다. `h1`은 `display: block`, `visibility: visible`, 박스 크기 592×38로 실제 화면에 반영됨을 확인했다.
- `App.jsx`의 텍스트를 임시로 바꿔 HMR(Hot Module Replacement)로 화면이 즉시 갱신되는 것을 확인한 뒤 원래 제목으로 복원했다. 브라우저 콘솔 오류는 없었다.
- `npm run build`, `npm run lint` 각 1회 통과.

## 질문·추가 확인

- 학습자 본인이 이 흐름(진입점 → 렌더링 → 화면 반영)을 직접 설명할 수 있는지는 아직 확인하지 않았다.

## 참고자료

- [React: Rendering with createRoot](https://react.dev/reference/react-dom/client/createRoot)
- [Vite: Getting Started](https://vite.dev/guide/)
