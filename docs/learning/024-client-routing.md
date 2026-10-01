# 클라이언트 라우팅 — URL에 맞는 화면을 브라우저 안에서 고른다

> 단계: 정규 23단계(설명). 이번 단계는 설치·소스 수정·실행 검증을 하지 않는다. 아래 코드와 명령은 모두 **미실행 예시**이며 실제 적용은 24단계 이후에 한다.

## 1. 학습 목적

- URL(주소)과 화면이 어떻게 연결되는지 이해한다.
- 페이지 이동을 구현하는 세 가지 방식(일반 링크와 서버 페이지, History API 직접 구현, React Router)을 가능 여부·필요한 설정·제약으로 비교한다.
- 이 프로젝트가 React Router의 Declarative 모드를 고른 이유와, 그 선택이 의무가 아니라는 점을 구분한다.
- 직접 접근·새로고침에는 서버 쪽 처리도 필요하다는 점과 그 처리를 언제 하는지 안다.

## 2. 용어

| 용어 | 뜻 |
| --- | --- |
| 경로(path) | URL에서 도메인 뒤의 `/`부터 시작하는 부분. 예: `https://example.com/records`의 `/records` |
| 라우팅(routing) | 경로에 따라 보여 줄 화면을 정하는 규칙과 그 처리 |
| 서버 라우팅 | 경로마다 서버가 다른 HTML 문서를 응답해, 브라우저가 문서 전체를 새로 불러오는 방식 |
| 클라이언트 라우팅 | 처음 받은 문서 하나를 유지한 채, 브라우저의 JavaScript가 주소를 바꾸고 그 주소에 맞는 컴포넌트를 렌더링하는 방식 |
| SPA(Single Page Application) | HTML 문서 하나를 받은 뒤 화면 전환을 JavaScript로 처리하는 애플리케이션. 이 프로젝트의 형태다 |
| 세션 기록(session history) | 탭에서 방문한 주소의 목록. 뒤로/앞으로 버튼이 이 목록을 따라 움직인다 |

## 3. 현재 상태와 문제

### 현재 코드

`src/main.jsx`는 주소와 관계없이 항상 같은 화면을 렌더링한다.

```jsx
// src/main.jsx (현재 코드 일부)
root.render(
  <Layout>
    <HomePage />
  </Layout>,
);
```

- [`src/components/Layout.jsx`](../../src/components/Layout.jsx)는 공통 헤더와 `main`을 그리고, `children`으로 받은 내용을 `main`에 넣는다([children 자료](022-children.md)).
- [`src/pages/HomePage.jsx`](../../src/pages/HomePage.jsx)는 정적 records 3개와 `visibleCount` state(초기값 2)를 가지고, 버튼으로 표시 개수를 바꾼다([state 자료](020-state.md)).

### 실행 흐름(현재)

```text
브라우저가 index.html 요청 → src/main.jsx 실행
→ root.render(<Layout><HomePage /></Layout>)   ← 어떤 경로든 항상 HomePage
→ 버튼 클릭 → setVisibleCount(n) → HomePage 다시 렌더링
   (주소창의 URL은 그대로, 세션 기록도 늘지 않음)
```

### 문제

1. **화면이 하나뿐이다.** 과제는 홈·목록·상세·등록·수정 5개 페이지와 Not Found를 요구한다([진행 상태](../progress.md)의 화면 구성 초안). 지금은 `<HomePage />`가 고정되어 있어 다른 페이지를 그릴 방법이 없다.
2. **화면 변화가 URL에 남지 않는다.** `visibleCount` 변경은 페이지 안의 상태 변화다. 주소가 바뀌지 않으므로 특정 화면을 주소로 공유하거나, 뒤로 가기로 이전 화면에 돌아오거나, 새로고침 후 같은 화면을 다시 여는 것은 불가능하다. 실제로 이전 단계 검증에서 새로고침 후 표시 개수는 초기값 2로 돌아갔다.
   - 표시 개수 같은 페이지 내부 상태까지 URL에 담을 필요는 없다. 이번에 URL과 연결할 대상은 **어떤 페이지를 보여 줄지**다.
3. **state만으로 페이지를 바꾸는 방법도 있지만 같은 한계가 있다.** 예를 들어 `currentPage` state를 두고 조건부 렌더링으로 페이지를 바꾸면 화면은 바뀌지만 URL·뒤로 가기·새로고침과는 연결되지 않는다.

정리하면 필요한 것은 "**URL → 화면**" 규칙(어느 경로에 어느 페이지 컴포넌트를 그릴지)과, 이동할 때 "**화면 → URL**"을 함께 바꾸는 처리다.

## 4. 가능한 방식 비교

세 방식 모두 **기술적으로 가능**하다. 차이는 필요한 설정·제약과 이 프로젝트 조건과의 맞음이다.

### A. 일반 `<a>` 링크와 서버 페이지 전환

- **방식**: 경로마다 별도 HTML 문서를 두고 `<a href="/records">`로 이동한다. 브라우저가 새 문서를 요청해 페이지 전체를 다시 불러온다. B1-1의 정적 HTML 방식과 같다.
- **가능 여부**: 가능하다. 브라우저 기본 동작이라 라이브러리가 필요 없고, 각 주소에 실제 문서가 있으므로 직접 접근·새로고침도 그대로 동작한다.
- **필요한 설정**: 페이지마다 HTML과 진입 스크립트, 각 문서마다 React 루트가 필요하다. Vite에서는 여러 HTML 진입점을 빌드 설정에 등록하는 멀티 페이지 구성이 필요하다(Vercel 문서가 Vite의 Multi-Page App 모드를 안내한다).
- **제약**: 이동할 때마다 문서와 React 루트가 새로 만들어져 state가 초기화된다. 상세 페이지처럼 식별자가 바뀌는 경로(`/records/:id` 형태)는 기록 수만큼 문서를 만들 수 없으므로 결국 클라이언트나 서버에서 경로를 해석하는 처리가 따로 필요하다.
- **선택하지 않은 이유**: 과제의 서비스 형태가 SPA이고, 동적 상세 경로와 공통 레이아웃을 하나의 React 루트에서 다루는 쪽이 현재 구조(`main.jsx` 하나, `Layout`)와 맞는다.

### B. History API로 직접 구현

- **방식**: 브라우저의 `history` 객체로 세션 기록과 주소를 바꾸고, 현재 경로(`window.location.pathname`)를 state로 두어 경로별 컴포넌트를 조건부 렌더링한다. MDN은 History API가 `history` 전역 객체로 세션 기록에 접근해 앞뒤 이동과 기록 스택 조작을 제공한다고 설명한다. 예제로 `pushState`·`replaceState`로 기록을 추가·교체하고 `popstate` 이벤트로 뒤로/앞으로 이동을 감지하는 코드를 보여 준다.
- **가능 여부**: 가능하다. 라이브러리 없이 브라우저 API만으로 구현할 수 있다.
- **직접 만들어야 하는 것**: 링크 클릭 시 기본 문서 이동 막기와 `pushState` 호출, `popstate` 구독과 경로 state 갱신, 경로 문자열 비교·`/records/:id` 같은 파라미터 추출, 일치하는 경로가 없을 때의 처리, 컴포넌트 해제 시 이벤트 정리.
- **제약**: 위 처리를 모두 직접 작성·검증해야 하고, 아직 배우지 않은 Effect·cleanup 개념이 먼저 필요하다. 한 단계에 새 개념 하나라는 진행 원칙과 맞지 않는다.
- **선택하지 않은 이유**: 라우팅 원리를 배우기에는 의미가 있지만, 과제의 목표인 컴포넌트·데이터 흐름보다 라우터 구현에 시간이 쓰인다. 기술 구성에서 이미 라이브러리를 선택했다.
- **근거**: MDN `pushState()` 문서는 이 메서드가 세션 기록 스택에 항목을 추가하며, 호출 후 브라우저가 새 URL을 불러오려 하지 않는다고 설명한다. 다만 브라우저를 다시 시작한 뒤처럼 나중에 그 URL을 불러올 수는 있고, 새 URL은 현재 URL과 같은 출처(origin)여야 한다. 즉 주소는 바뀌어도 문서 요청은 없으므로 화면 교체는 JavaScript가 맡아야 하고, 나중의 직접 요청은 서버가 처리해야 한다(5절).

### C. React Router 활용(선택)

- **방식**: 라이브러리가 B의 주소 변경·기록 구독·경로 비교를 맡고, 개발자는 "어느 경로에 어느 컴포넌트"를 JSX로 선언한다. React Router 문서는 `<Routes>`와 `<Route>`가 URL 구간을 UI 요소와 연결한다고 설명한다.
- **모드**: React Router에는 Framework·Data·Declarative 세 모드가 있다. 이 프로젝트는 **Declarative 모드**(컴포넌트 기반 라우팅)를 선택했다. 설치 문서는 Framework 모드를 프레임워크 전체 기능, Data 모드를 데이터 라우터 기능을 갖춘 모드로 소개한다. 두 모드도 가능하지만 세부 기능은 이번에 확인하지 않았고, 현재의 Vite + `main.jsx` 구조와 "데이터 요청은 훅에서 학습"한다는 진행 계획([진행 상태](../progress.md)의 기술 구성)에는 Declarative 모드가 가장 작은 변경이다.
- **필요한 설정**: 패키지 설치(`npm i react-router`)와 진입 파일에서 앱을 `<BrowserRouter>`로 감싸기. 설치 문서는 Vite React 템플릿을 시작점으로 안내한다.
- **제약**: 외부 의존성이 하나 늘어 `package.json`·`package-lock.json`이 바뀐다. 설치 시 버전 호환성을 확인해야 한다. 브라우저 안에서만 동작하므로 직접 접근·새로고침의 서버 처리는 해결하지 않는다(5절).

### 비교 요약

| 항목 | A. `<a>` + 서버 페이지 | B. History API 직접 | C. React Router Declarative |
| --- | --- | --- | --- |
| 가능 여부 | 가능 | 가능 | 가능 |
| 추가 의존성 | 없음 | 없음 | `react-router` |
| 이동 시 문서 재요청 | 매번 | 직접 막아야 함 | 라이브러리가 처리 |
| 이동 시 React state | 초기화 | 유지 가능 | 유지 가능 |
| 동적 경로·일치 없음 처리 | 서버 또는 별도 처리 | 직접 작성 | 라우트 선언으로 처리 |
| 직접 접근·새로고침 | 문서가 있으면 동작 | 서버 처리 필요 | 서버 처리 필요 |
| 선택 여부 | 미선택 | 미선택 | 선택 |

React Router는 과제 조건을 만족하는 **하나의 방법**이며 필수가 아니다. 다른 라우팅 라이브러리나 B 방식으로도 같은 요구를 구현할 수 있다.

## 5. 직접 접근·새로고침과 서버 처리

클라이언트 라우팅은 **문서를 받은 뒤** 브라우저에서 일어난다. 주소창에 `/records/abc`를 직접 입력하거나 그 주소에서 새로고침하면 브라우저는 먼저 서버에 그 경로를 요청한다. 서버가 그 경로에 해당하는 파일이 없다고 404로 응답하면 React Router는 실행될 기회가 없다. 따라서 서버는 앱의 경로 요청에 `index.html`을 돌려줘야 하고, 그 뒤 React Router가 URL을 읽어 화면을 고른다.

```text
직접 접근 /records/abc
→ 서버: index.html 응답(서버 설정 필요)
→ main.jsx 실행 → BrowserRouter가 현재 URL 확인 → 일치하는 Route의 컴포넌트 렌더링
```

이 서버 처리는 실행 환경마다 따로 다룬다.

| 환경 | 처리 | 시기 |
| --- | --- | --- |
| Vite 개발 서버(`npm run dev`) | Vite의 `appType` 옵션 기본값은 `'spa'`이며, 이 값은 HTML 미들웨어를 포함하고 SPA fallback(앱 경로 요청에 HTML을 돌려주는 처리)을 사용한다. 이 프로젝트에는 Vite 설정 파일이 없어 기본값이 적용되므로 별도 설정을 추가할 필요가 없다. 실제로 5개 경로에 직접 접근해 표시되는지는 **24단계에서 검증**한다. | 24단계 |
| Vercel 배포 | Vercel 문서는 SPA로 배포한 Vite 앱은 딥 링크(직접 접근)가 기본으로 동작하지 않는다고 안내하고, 프로젝트 루트 `vercel.json`의 `rewrites`로 모든 경로를 `/index.html`로 보내는 설정을 제시한다. | 58단계(SPA rewrite) |

Vercel 문서가 제시하는 설정 형태(이번 단계 미작성):

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

같은 문서는 `cleanUrls`를 켠 경우 경로에서 확장자를 빼라고 하고, 프로덕션에는 Multi-Page App 모드를 권장한다고도 적는다. 이 프로젝트는 SPA 구조를 유지하며 rewrite 적용과 검증은 배포 단계에서 결정한다.

## 6. 다음 단계 미실행 예시(24단계)

아래는 공식 문서의 형태를 현재 구조에 맞춰 옮긴 **예시**다. 경로 이름·페이지 파일·`Layout` 배치는 24단계에서 확정하며 이번에는 작성하지 않는다.

```text
npm i react-router      (미실행. package.json·package-lock.json이 바뀌고 node_modules에 설치된다)
```

```jsx
// src/main.jsx 변경 예시(미실행)
import { BrowserRouter, Routes, Route } from 'react-router';

root.render(
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* 목록·상세·등록·수정 경로를 같은 형태로 추가 */}
      </Routes>
    </Layout>
  </BrowserRouter>,
);
```

- `BrowserRouter`: 브라우저 주소를 읽고 바꾸는 라우터. 앱 바깥을 한 번 감싼다.
- `Routes`: 안쪽 `Route` 중 현재 URL과 맞는 것을 고른다.
- `Route`: `path`(경로)와 `element`(그 경로에서 그릴 JSX)의 짝.

실행 흐름(예정): URL 확인 → 일치하는 `Route` 선택 → 그 `element`가 `Layout`의 `children`으로 `main`에 렌더링. 기존 `HomePage`의 `visibleCount` 이벤트 → 상태 변경 → 렌더링 흐름은 그대로 페이지 안에서 동작한다.

## 7. 이후 작업 순서

| 단계 | 작업 | 이번 상태 |
| --- | --- | --- |
| 24 | React Router 설치, 5개 페이지 경로 매핑, 각 경로 직접 접근 확인(개발 서버) | 미구현 |
| 25 | 공통 헤더에 페이지 이동 링크 추가 | 미구현 |
| 26 | 상세 경로의 식별자로 기록 선택 | 미구현 |
| 27 | 잘못된 주소의 Not Found 페이지 | 미구현 |
| 55 | 프로덕션 빌드와 로컬 미리보기에서 주요 경로 확인 | 미구현 |
| 58 | Vercel SPA rewrite 설정 | 미구현 |
| 59 | 배포 URL에서 직접 접근·새로고침 검증 | 미구현 |

링크 컴포넌트, 경로 파라미터, Not Found의 세부 개념은 각 단계의 자료에서 다룬다.

## 8. 이번 단계의 파일과 검증

- **생성**: `docs/learning/024-client-routing.md`(이 문서)
- **변경**: `docs/learning/README.md`(목록에 이 문서 연결)
- **변경 없음**: `src/` 전체, `index.html`, `package.json`, `package-lock.json`. 패키지 설치·`vercel.json` 작성 없음.
- **실행 검증**: 해당 없음(설명 단계). 문서의 로컬 링크 대상 존재만 확인했다.
- **미확인**: Vite 개발 서버에서 실제로 직접 접근·새로고침이 되는지(공식 문서의 기본 fallback만 확인, 실행은 24단계), 설치할 React Router 버전과 호환성(24단계 설치 시 확인).

## 9. 참고자료

- [React Router — Declarative 모드 설치](https://reactrouter.com/start/declarative/installation): 세 가지 모드, `npm i react-router`, `BrowserRouter`로 앱 감싸기
- [React Router — Declarative 모드 라우팅](https://reactrouter.com/start/declarative/routing): `Routes`·`Route`로 URL 구간과 UI 연결
- [MDN — History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API): 세션 기록 접근, `back`·`forward`·`go`, `pushState`·`replaceState`·`popstate` 예제
- [MDN — History.pushState()](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState): 세션 기록 추가, 호출 후 URL을 불러오지 않음, 같은 출처 조건
- [Vite — appType](https://vite.dev/config/shared-options.html#apptype): 기본값 `'spa'`의 HTML 미들웨어와 SPA fallback
- [Vercel — Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite): SPA 딥 링크와 `vercel.json` rewrites
- 관련 자료: [브라우저와 웹 기초](000-browser-web-basics.md), [Vite의 역할](008-vite-role.md), [state](020-state.md), [조건부 렌더링](021-conditional-rendering.md), [children](022-children.md)
