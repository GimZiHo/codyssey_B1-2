# 016. props — 부모가 값을 정해 자식 컴포넌트에 전달한다

> 정규 단계 15(변경). 새 핵심 개념은 **props** 하나다. 구현 전에 작성한 설명에 실제 변경([4절](#4-실제-변경))과 브라우저 검증 결과([5절](#5-확인-결과))를 보완했다. 이번에 적용하지 않은 방식은 `(적용하지 않은 방식)`으로 표시했다.

## 1. 현재 상태와 해결할 문제

14단계 결과 [`src/pages/HomePage.jsx`](../../src/pages/HomePage.jsx)는 제목 `h1`을 직접 반환한다([함수 컴포넌트 자료](015-function-component.md)).

```jsx
// 현재 src/pages/HomePage.jsx (14단계 결과)
export default function HomePage() {
  return <h1>학습 기록 서비스</h1>;
}
```

앞으로 목록·상세·등록·수정 페이지와 Not Found도 각자 제목이 필요하다([진행 상태](../progress.md)). 페이지마다 `<h1>…</h1>`를 따로 쓰면 제목의 모양·구조를 바꿀 때 모든 페이지를 고쳐야 한다. 반대로 제목 컴포넌트 하나를 만들면 **글자만 페이지마다 다르다**. 과제도 prop을 받는 재사용 컴포넌트를 최소 8개 요구한다.

그래서 필요한 것은 "모양은 한 컴포넌트가 맡고, 표시할 값은 사용하는 쪽이 정해 넘기는" 방법이다. 그 방법이 **props**다.

## 2. 핵심 개념: props

React 공식 문서의 설명을 옮기면 다음과 같다.

- 컴포넌트는 props로 서로 소통한다. **부모 컴포넌트는 자식 컴포넌트에 props를 줘서 정보를 전달**한다.
- props는 HTML 속성처럼 보이지만, 문자열뿐 아니라 객체·배열·함수 등 **어떤 JavaScript 값도** 전달할 수 있다.
- 컴포넌트 함수는 인자를 하나 받는데, 그것이 **props 객체**다. JSX에 적은 속성 이름이 객체의 속성 이름이 된다.

용어 정리:

| 용어 | 뜻 | 이번 단계에서 |
| --- | --- | --- |
| 부모 컴포넌트 | 다른 컴포넌트를 JSX로 사용(렌더링)하는 쪽 | `HomePage` |
| 자식 컴포넌트 | JSX로 사용되는 쪽 | `PageTitle` |
| prop | 부모가 JSX 속성으로 넘기는 값 하나 | `title` |
| props 객체 | 자식 함수가 받는 인자. 모든 prop을 담는다 | `{ title: '학습 기록 서비스' }` |

### 2-1. 전달하기: JSX 속성으로 적는다

```jsx
// 부모 쪽 — 실제 적용: src/pages/HomePage.jsx
<PageTitle title="학습 기록 서비스" />
```

- 문자열은 따옴표로 바로 적는다: `title="학습 기록 서비스"`.
- 문자열이 아닌 값이나 변수는 중괄호로 감싼다: `size={100}`, `title={pageTitle}` ([JSX 자료](014-jsx.md)의 중괄호 규칙).

### 2-2. 읽기: 함수의 매개변수로 받는다

두 방식 모두 동작한다.

```jsx
// 방식 A — 구조 분해 (실제 적용: src/components/PageTitle.jsx)
function PageTitle({ title }) {
  return <h1>{title}</h1>;
}

// 방식 B — props 객체 전체 (적용하지 않은 방식)
function PageTitle(props) {
  return <h1>{props.title}</h1>;
}
```

- 방식 A의 `({ title })`는 JavaScript의 **구조 분해 할당**이다. 인자로 들어온 객체에서 `title` 속성만 꺼내 같은 이름의 변수로 만든다. 공식 문서는 `(` `)` 안의 `{` `}` 한 쌍을 빠뜨리지 말라고 강조한다. `function PageTitle(title)`로 쓰면 `title` 변수에 문자열이 아니라 **props 객체 전체**가 들어간다.
- `<h1>{title}</h1>`의 중괄호는 JSX 안에서 JavaScript 값을 표시하는 자리다.

### 2-3. props는 읽기 전용이다

공식 문서는 props를 **immutable(바꿀 수 없음)** 이라고 설명한다. 자식은 받은 `title`을 고치지 않는다. 다른 값이 필요하면 부모가 **다른 props를 새로 전달**해야 하고, 그러면 자식은 새 값으로 다시 그려진다. 공식 문서 표현대로 props는 "처음 한 번"이 아니라 **렌더링 시점의 데이터**를 반영한다.

사용자 조작으로 값이 바뀌는 상호작용은 props가 아니라 state가 맡는다. state는 19단계의 개념이며 이번에는 다루지 않는다.

### 2-4. 이번에 쓰지 않는 기능

공식 문서에는 아래 기능도 있지만 이번 목적(제목 하나 전달)에 필요하지 않아 사용하지 않는다.

| 기능 | 내용 | 이번에 쓰지 않는 이유 |
| --- | --- | --- |
| 기본값 `({ title = '...' })` | prop이 없거나 `undefined`일 때만 기본값을 쓴다. `null`·`0`이면 기본값을 쓰지 않는다 | 부모가 항상 제목을 넘긴다. 기본값을 두면 전달 누락이 화면에서 드러나지 않는다 |
| 전개 `{...props}` | 받은 props를 그대로 다른 컴포넌트에 넘긴다. 공식 문서도 절제해서 쓰라고 한다 | 넘길 prop이 `title` 하나뿐이다 |
| `children` | 태그 사이에 넣은 JSX가 `children` prop으로 전달된다 | 21단계(레이아웃)의 개념이다 |

## 3. 대안 비교와 선택

| 대안 | 가능 여부 | 필요한 추가 작업·제약 | 이번 선택 |
| --- | --- | --- | --- |
| A. 지금처럼 `HomePage`에 `h1`을 직접 둔다 | 가능 | 없음. 단, 페이지가 늘면 제목 구조가 페이지마다 복제되고 prop을 받는 컴포넌트 요구를 채우지 못한다 | 선택하지 않음 |
| B. 제목 글자까지 고정한 `PageTitle`(props 없음)을 만든다 | 가능 | 다른 페이지에서 다른 제목을 쓸 수 없어 재사용되지 않는다 | 선택하지 않음 |
| C. `PageTitle`이 `title` prop을 받고 `HomePage`가 제목을 전달한다 | 가능 | 새 파일 1개, `HomePage` 수정 | **선택** |
| D. 제목을 `children`으로 받는다 (`<PageTitle>학습 기록 서비스</PageTitle>`) | 가능 | 제목 문자열 하나에는 C와 결과가 같다. 다만 `children`은 별도 개념이라 이번 단계의 새 개념 하나 원칙을 넘는다 | 선택하지 않음(21단계에서 레이아웃에 사용) |
| E. `PageTitle`이 모듈 변수나 전역 값을 직접 읽는다 | 가능 | 어느 부모가 어떤 값을 넘겼는지 JSX에 드러나지 않고, 페이지별로 다른 값을 줄 수 없다 | 선택하지 않음 |

세부 선택(필수 아님):

- **구조 분해 vs `props.title`**: 둘 다 동작한다. 공식 문서 예시처럼 받을 prop 이름이 매개변수에 바로 보이는 구조 분해를 사용한다.
- **prop 이름 `title`**: 표시할 값의 의미를 이름으로 드러낸다. HTML 요소에도 `title` 속성(툴팁)이 있지만, 컴포넌트에 넘긴 prop은 컴포넌트가 사용하는 방식으로만 쓰인다. 여기서는 `h1`의 텍스트로만 사용하고 `h1`의 `title` 속성으로 넘기지 않는다.
- **위치 `src/components`**: 여러 페이지에서 쓸 UI 조각이므로 페이지 경로 `src/pages`와 구분한다. export 방식은 기존 `HomePage`와 같게 default로 한다.

## 4. 실제 변경

변경 파일은 두 개다. 검토 후 코드 보완은 없었다.

1. [`src/components/PageTitle.jsx`](../../src/components/PageTitle.jsx) 신규 — 자식 컴포넌트

   ```jsx
   // props: 부모가 JSX 속성으로 넘긴 값을 담은 객체. 구조 분해로 title만 꺼내 제목으로 표시한다.
   export default function PageTitle({ title }) {
     return <h1>{title}</h1>;
   }
   ```

   - 인자: props 객체 하나. 구조 분해 `{ title }`로 `title` 속성만 꺼낸다.
   - 반환값: `title` 값을 텍스트로 담은 `h1` JSX. `title`을 `h1`의 HTML 속성으로 넘기지 않는다.

2. [`src/pages/HomePage.jsx`](../../src/pages/HomePage.jsx) 수정 — 부모 컴포넌트

   ```jsx
   import PageTitle from '../components/PageTitle.jsx';

   // 함수 컴포넌트: JSX를 반환하는 대문자 이름의 함수. 홈 페이지 화면을 맡는다.
   export default function HomePage() {
     // title prop: 표시할 제목은 부모인 HomePage가 정해 PageTitle에 전달한다.
     return <PageTitle title="학습 기록 서비스" />;
   }
   ```

   - 14단계의 `<h1>학습 기록 서비스</h1>` 대신 `<PageTitle title="학습 기록 서비스" />`를 반환한다.
   - `HomePage.jsx`는 `src/pages`에 있으므로 `src/components`의 파일은 한 단계 위(`../`)로 올라가 찾는다. `PageTitle`이 default export이므로 중괄호 없이 import한다([함수 컴포넌트 자료](015-function-component.md)).

3. 바꾸지 않은 것: `src/main.jsx`, `index.html`, 패키지·Vite 설정, CSS. state·children·목록은 도입하지 않았다.

### 실행 흐름

```text
root.render(<HomePage />)      : React가 HomePage()를 호출
  → HomePage가 <PageTitle title="학습 기록 서비스" /> 반환
  → React가 PageTitle({ title: '학습 기록 서비스' }) 호출
  → PageTitle이 <h1>학습 기록 서비스</h1> 반환
  → #root 안에 h1 DOM 생성
```

아래 검증에서 개발 서버가 변환한 `HomePage.jsx`에 `title: "학습 기록 서비스"`가 **객체 속성 형태**로 들어 있음을 확인했다. JSX 속성 `title="..."`이 props 객체 `{ title: ... }`로 바뀌어 자식에게 전달된다는 뜻이다.

화면은 14단계와 같다. 차이는 **제목 글자를 정하는 곳(HomePage)과 제목을 그리는 곳(PageTitle)이 분리**된 점이다.

## 5. 확인 결과

- 환경: Vite 개발 서버(`npm run dev`, 포트 5185), Playwright Chromium 헤드리스, 뷰포트 1280×800
- 검증 스크립트: 임시 경로의 Node 스크립트로 시나리오를 선택 실행했다(버전 관리 대상 아님).
- 결과: 7건 통과, 실패 0건

| 시나리오 | 확인 방법 | 실제 결과 |
| --- | --- | --- |
| 모듈 응답·변환 | `/`, `/src/pages/HomePage.jsx`, `/src/components/PageTitle.jsx` 요청 | 모두 200, 두 모듈 `text/javascript`. `HomePage`는 `PageTitle` import와 `title: "학습 기록 서비스"` 포함, 원본 JSX 태그 없음. `PageTitle`은 JSX 런타임 사용·`function PageTitle({ title })` 유지, 원본 `<h1>` 태그 없음 |
| 단일 제목 표시 | 문서의 `h1` 개수, 텍스트, 계산 스타일, 박스 크기 | `h1` 1개(`#root` 안, `#root` 자식 1개), 텍스트 `학습 기록 서비스`, `title` 속성 없음, `display: block`·`visibility: visible`·`opacity: 1`, 32px·700, 1264×38 |
| prop 값 변경 | `HomePage.jsx`의 `title` 값을 `임시 제목 props 검증`으로 임시 저장 → 화면 확인 → `finally`에서 파일 원복 → 화면 확인 | 변경 중 화면 제목이 `임시 제목 props 검증`으로 바뀜(같은 스타일·박스). 파일 원본과 일치하게 복구, 화면 제목도 `학습 기록 서비스`로 복구 |
| 새로고침 | 페이지 새로고침 후 같은 항목 확인 | 처음과 같은 텍스트·스타일·박스(1264×38) |
| 오류 | 콘솔 error·warning, 페이지 예외, 요청 실패, 400 이상 응답 수집 | 모두 0건 |
| 자료 링크 | 이 문서와 자료 목록의 로컬 링크 대상 존재 | 누락 없음 |
| 서버 종료 | 검증 후 개발 서버 종료, 포트 확인 | 포트 5185 닫힘 |

prop 값 변경 결과는 2-3절의 "다른 값이 필요하면 부모가 다른 props를 전달하고, 자식은 새 값으로 다시 그려진다"를 확인한 것이다. `PageTitle.jsx`는 고치지 않고 부모의 `title` 값만 바꿨는데 화면 제목이 바뀌었다.

### 남은 확인

- prop 값 변경 때 스크립트는 페이지를 새로고침하지 않았다. 화면 반영은 Vite 개발 서버의 파일 변경 처리에 의한 것이며, 모듈 교체(HMR)인지 전체 새로고침인지는 구분해 기록하지 않았다.
- `PageTitle`을 다른 페이지에서 다른 `title`로 재사용하는 것은 해당 페이지를 만드는 이후 단계에서 확인한다.

## 참고자료

- [React — Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component): props의 역할, 전달·읽기 2단계, 구조 분해의 중괄호, 기본값 적용 조건, 전개 문법, children, props의 불변성과 시간에 따른 변화. 2026-09-28 확인.
- [React — Your First Component](https://react.dev/learn/your-first-component): 컴포넌트 정의 규칙(14단계 근거).
