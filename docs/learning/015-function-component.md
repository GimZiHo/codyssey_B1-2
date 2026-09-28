# 015. 함수 컴포넌트 — 화면 조각을 이름 붙인 함수로 만든다

> 정규 단계 14(변경). 새 핵심 개념은 **함수 컴포넌트** 하나다. 이 문서는 실제 변경한 `src/pages/HomePage.jsx`·`src/main.jsx`와 2026-09-28 브라우저 검증 결과를 바탕으로 한다.

## 1. 변경 전 문제

13단계까지의 화면은 [`src/main.jsx`](../../src/main.jsx)에서 JSX 한 줄로 만들었다([JSX 자료](014-jsx.md)).

```jsx
// 변경 전 src/main.jsx (13단계 결과)
const root = createRoot(document.getElementById('root'));
root.render(<h1>학습 기록 서비스</h1>);
```

제목 하나일 때는 문제가 없지만, 이 서비스는 앞으로 홈·목록·상세·등록·수정의 5개 페이지와 Not Found를 가져야 한다([진행 상태](../progress.md)). 모든 화면을 진입 파일의 `root.render(...)` 안에 JSX로 계속 적으면 다음 문제가 생긴다.

- **역할이 섞인다**: 진입 파일은 "React 루트를 만들고 무엇을 그릴지 넘기는 곳"인데 화면 내용까지 떠안는다.
- **이름이 없다**: `<h1>...</h1>` 덩어리는 "홈 페이지"라는 이름이 없어서, 나중에 라우트에 연결하거나 다른 파일에서 가져다 쓸 수 없다.
- **소스 구조 요구**: 프로젝트는 `src/pages`에 페이지 역할을 분리해야 한다. 페이지를 파일로 나누려면 먼저 "화면 조각을 내보내고 가져오는 단위"가 필요하다.

이 단위가 **컴포넌트**다.

## 2. 핵심 개념: 함수 컴포넌트

React 공식 문서는 컴포넌트를 "마크업을 곁들일 수 있는 JavaScript 함수"라고 설명한다. 즉 **JSX를 반환(return)하는 일반 함수**다. 이번에 만든 [`src/pages/HomePage.jsx`](../../src/pages/HomePage.jsx)의 함수 본문은 다음과 같다.

```jsx
function HomePage() {
  return <h1>학습 기록 서비스</h1>;
}
```

| 부분 | 의미 |
| --- | --- |
| `function HomePage()` | 일반 JavaScript 함수 선언. 이번 단계에서는 인자(props)를 받지 않는다. props는 15단계의 개념이다. |
| `return <h1>…</h1>` | 이 컴포넌트가 화면에 그릴 React 요소를 반환한다. 여러 줄이면 `return (` 괄호로 감싸야 한다. 괄호 없이 줄을 바꾸면 `return` 다음 줄은 무시된다. |
| `<HomePage />` | 컴포넌트를 사용하는 JSX. React가 `HomePage` 함수를 호출하고, 반환한 요소를 그 자리에 그린다. |

### 이름은 대문자로 시작한다

공식 문서: "React 컴포넌트는 일반 JavaScript 함수지만 이름이 **대문자로 시작해야** 동작한다." JSX에서 `<h1>`, `<section>`처럼 소문자 태그는 HTML 태그로, `<HomePage />`처럼 대문자로 시작하면 같은 이름의 컴포넌트로 해석되기 때문이다. `function homePage()`로 만들고 `<homePage />`로 쓰면 React는 `homePage`라는 HTML 태그를 만들려 한다(이 경우는 실행하지 않은 설명이다).

### 컴포넌트는 최상위에 정의한다

컴포넌트는 다른 컴포넌트를 렌더링할 수 있지만, **다른 컴포넌트 안에서 컴포넌트 함수를 정의하면 안 된다**(공식 문서). 이번 단계는 컴포넌트가 하나뿐이라 해당 사항은 없고, `HomePage`는 파일 최상위에 선언했다.

## 3. 파일로 나누기: export와 import

컴포넌트를 별도 파일로 옮기는 공식 문서의 순서는 세 단계다.

1. 컴포넌트를 둘 새 파일을 만든다.
2. 그 파일에서 함수 컴포넌트를 **export**한다.
3. 사용할 파일에서 **import**한다.

export/import 문법 자체는 [JavaScript 모듈 자료](010-javascript-modules.md)에서 다뤘다. 컴포넌트에서의 대응은 다음과 같다.

| 방식 | 내보내기 | 가져오기 |
| --- | --- | --- |
| default | `export default function HomePage() {}` | `import HomePage from './pages/HomePage.jsx';` |
| named | `export function HomePage() {}` | `import { HomePage } from './pages/HomePage.jsx';` |

- 한 파일의 default export는 최대 하나, named export는 여러 개 가능하다.
- default로 내보낸 것을 `{ }`로 가져오는 등 방식을 섞으면 오류가 난다.
- 경로의 확장자는 적어도 되고 생략해도 동작하지만, 공식 문서는 확장자를 적는 쪽이 브라우저의 네이티브 ES 모듈 방식에 더 가깝다고 설명한다.

## 4. 대안 비교와 선택

| 대안 | 가능 여부 | 필요한 추가 작업·제약 | 이번 선택 |
| --- | --- | --- | --- |
| A. 지금처럼 `main.jsx`에 JSX를 직접 둔다 | 가능 | 없음. 단, 페이지에 이름이 없고 `src/pages` 역할 분리를 충족하지 못한다. | 선택하지 않음 |
| B. `main.jsx` 안에 `HomePage` 함수를 정의한다 | 가능 | 컴포넌트 개념은 익히지만 진입 파일과 페이지가 여전히 한 파일에 있다. 곧 다시 옮겨야 한다. | 선택하지 않음 |
| C. `src/pages/HomePage.jsx`에 함수 컴포넌트를 두고 `main.jsx`에서 import | 가능 | 새 파일 1개, 진입 파일 import 1줄 | **선택** |
| D. `App` 루트 컴포넌트를 추가하고 그 안에서 `HomePage`를 렌더링 | 가능 | 파일이 하나 더 늘고, `App`이 할 일(라우트 묶기·공통 레이아웃)이 아직 없다. 라우팅·레이아웃 단계에서 필요에 따라 결정한다. | 선택하지 않음(이번 범위 밖) |
| E. 클래스 컴포넌트 | 가능 | `class ... extends Component`와 `render()` 메서드가 필요하다. 공식 학습 문서는 함수 컴포넌트로 설명하며, 이번 목적에 클래스가 필요한 이유가 없다. | 선택하지 않음 |

세부 선택:

- **함수 선언 vs 화살표 함수**: `const HomePage = () => <h1>…</h1>;`도 컴포넌트로 동작한다(필수 선택 아님). 공식 문서 예시와 같은 `function` 선언을 사용했다.
- **default vs named export**: 둘 다 가능하다. 페이지 파일 하나에 컴포넌트 하나를 두므로 공식 문서 예시처럼 `export default`를 사용했다.
- **파일 확장자 `.jsx`**: 13단계에서 확인한 대로 Vite 기본 변환은 `.jsx`에만 JSX를 적용한다([JSX 자료](014-jsx.md)). 컴포넌트가 JSX를 반환하므로 `.jsx`로 만들었다.
- **파일 이름 `HomePage.jsx`**: 컴포넌트 이름과 파일 이름을 맞춰 찾기 쉽게 했다. `src/pages`는 페이지 단위 컴포넌트를 두는 경로다.

## 5. 실제 변경

소스는 두 파일만 바꿨다.

1. **`src/pages/HomePage.jsx` 생성** — 기존 제목을 반환하는 함수 컴포넌트를 default export한다. `src/pages` 디렉터리도 이때 처음 생겼다.

   ```jsx
   // 함수 컴포넌트: JSX를 반환하는 대문자 이름의 함수. 홈 페이지 화면을 맡는다.
   export default function HomePage() {
     return <h1>학습 기록 서비스</h1>;
   }
   ```

2. **`src/main.jsx` 수정** — `HomePage`를 import하고 `root.render(<HomePage />)`로 바꿨다. `createRoot` 부분은 그대로 두고, JSX 변환 설명 주석은 컴포넌트 호출 설명으로 바꿨다.

   ```jsx
   import { createRoot } from 'react-dom/client';
   import HomePage from './pages/HomePage.jsx';

   // React 루트: #root 안쪽 DOM을 React가 관리한다.
   const root = createRoot(document.getElementById('root'));
   // <HomePage />: React가 HomePage 함수를 호출해 반환한 요소를 그린다.
   root.render(<HomePage />);
   ```

3. **바꾸지 않은 것**: `index.html`, `package.json`·`package-lock.json`, Vite 설정·플러그인(여전히 없음), props·state·라우팅·`App` 컴포넌트.

### 실행 흐름

```text
index.html의 <script type="module" src="/src/main.jsx">
  → Vite가 main.jsx를 변환해 응답. 변환 결과에 import HomePage from "/src/pages/HomePage.jsx"가 있다
  → 브라우저가 HomePage.jsx 모듈을 추가로 요청 (이것도 JSX가 변환된 JavaScript로 응답)
  → createRoot(#root)
  → root.render(<HomePage />)  : React가 HomePage()를 호출
  → HomePage가 <h1>학습 기록 서비스</h1> 요소를 반환
  → React가 #root 안에 h1 DOM을 만든다
```

화면 결과는 13단계와 같다. 이번 단계는 **보이는 결과를 바꾸지 않고 코드 구조만 바꾼** 변경이다. 두 파일 모두 변환 후 `react/jsx-dev-runtime`을 import하므로, 각 `.jsx` 파일의 JSX가 파일별로 automatic 런타임 호출로 바뀐다는 점도 확인됐다.

## 6. 확인 결과

- **환경**: 2026-09-28, Node.js `v24.18.1`, Vite 개발 서버(포트 5184), Playwright headless 브라우저. 임시 검증 스크립트로 항목별 선택 실행했다.
- **결과**: 최종 8건 통과, 실패 0건.

| 항목 | 실제 결과 |
| --- | --- |
| HTTP·변환 | HTML 200, `/src/main.jsx` 모듈 script. 변환된 `main.jsx`는 `/src/pages/HomePage.jsx`를 import하고 원본 JSX가 남지 않음. `HomePage.jsx`는 200·`text/javascript`, jsx-dev-runtime import와 default export 포함, 원본 JSX 없음 |
| 메타데이터 | 제목 `학습 기록 서비스`, `lang="ko"`, `UTF-8`, viewport 유지 |
| 렌더링 | `#root` 자식 1개, 문서 전체 `h1` 1개, 텍스트 `학습 기록 서비스`. 계산 스타일 `display: block`, `32px`, `700`, 보임·불투명. 박스 1264×38(양수) |
| 모듈 응답 | `/src/main.jsx`, `/src/pages/HomePage.jsx` 모두 200·`text/javascript` |
| 새로고침 | 첫 로드와 같은 `h1` 1개·텍스트·박스 |
| 오류 | 콘솔·페이지 오류·실패 요청·오류 응답 모두 0건 |
| 로컬 링크 | 구현 시 23건 통과. 자료 보완 후 재검사 24건 통과(이 문서의 `HomePage.jsx` 링크 추가) |
| 서버 종료 | 포트 닫힘 확인 |

- **검증 과정의 수정**: 첫 실행은 7건 통과·1건 실패였다. 실패한 HTTP 검사는 `main.jsx` 변환 결과의 주석 `// <HomePage />: ...` 문자열을 변환되지 않은 JSX로 오인한 것이었다. 소스 결함이 아니라 검사 조건 오류였으므로, 주석을 제외하도록 검사만 고친 뒤 HTTP·서버 종료 2건을 재실행해 통과했다. 나머지 6건은 첫 실행 결과를 그대로 사용했다.
- **미확인**: 소문자 이름 컴포넌트·default/named 혼용 오류는 설명만 했고 실행하지 않았다. props·state·라우팅은 다루지 않았다.

## 참고자료

- [React — Your First Component](https://react.dev/learn/your-first-component): 컴포넌트 정의, 대문자 이름 규칙, 여러 줄 return 괄호, 정의 중첩 금지. 2026-09-28 확인.
- [React — Importing and Exporting Components](https://react.dev/learn/importing-and-exporting-components): 파일 분리 3단계, default/named export와 import 대응, 확장자 표기. 2026-09-28 확인.
