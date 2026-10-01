# 라우트 매핑 — 경로 다섯 개를 페이지 컴포넌트에 연결한다

> 단계: 정규 24단계(변경). 처음에는 구현 전 선행 자료로 작성했고, 구현·검토·브라우저 검증이 끝난 뒤 실제 변경 파일과 검증 결과로 보완했다. 코드 블록은 모두 실제 소스에서 옮긴 것이며, 실행하지 않은 내용은 "미확인"으로 따로 적는다.

## 1. 학습 목적

- **라우트 매핑**: "어느 경로(URL path)에 어느 페이지 컴포넌트를 그릴지"를 `Route`로 선언하는 방법을 이해한다.
- `BrowserRouter`·`Routes`·`Route` 세 컴포넌트의 역할과 감싸는 순서를 안다.
- 고정 경로(`/records/new`)와 동적 세그먼트(`/records/:recordId`)가 함께 있을 때 어떤 경로가 선택되는지 확인할 기준을 안다.
- 라우터를 도입해도 기존 `Layout`의 children 구조와 `HomePage`의 이벤트 → 상태 변경 → 렌더링 흐름이 그대로 유지되는 이유를 안다.

클라이언트 라우팅이 왜 필요한지, React Router Declarative 모드를 왜 골랐는지는 [클라이언트 라우팅 자료](024-client-routing.md)에서 다뤘다. 이 문서는 그 선택을 실제 경로 표로 옮긴 결과에 집중한다.

## 2. 용어

| 용어 | 뜻 |
| --- | --- |
| 라우트(route) | 경로 패턴 하나와 그 경로에서 그릴 화면의 짝 |
| 라우트 매핑 | 서비스의 경로 목록을 라우트로 선언해 페이지 컴포넌트에 연결하는 일 |
| 세그먼트(segment) | 경로를 `/`로 나눈 한 칸. `/records/new`는 `records`와 `new` 두 세그먼트다 |
| 정적 세그먼트 | 글자 그대로 일치해야 하는 세그먼트. 예: `records`, `new`, `edit` |
| 동적 세그먼트 | `:`로 시작해 어떤 값이든 받는 세그먼트. 예: `:recordId` |
| 매칭(matching) | 현재 URL과 라우트 패턴을 비교해 그릴 라우트를 고르는 일 |

## 3. 변경 전 상태와 문제

변경 전 [`src/main.jsx`](../../src/main.jsx)는 URL과 무관하게 항상 `<Layout><HomePage /></Layout>`를 렌더링했다. 5개 페이지(홈·목록·상세·등록·수정)를 URL로 구분할 방법이 없었다.

이번 단계에서 해결한 것은 **URL → 페이지 컴포넌트** 연결 하나다. 화면 사이를 이동하는 링크(25단계), 상세 경로의 식별자로 기록 고르기(26단계), 잘못된 주소 처리(27단계)는 다음 단계로 남겼다.

## 4. 경로 설계

[진행 상태](../progress.md)의 화면 구성 초안(홈·목록·상세·등록·수정)을 다음 경로로 정했다. "표시 제목"은 실제 페이지의 `h1` 문구다.

| 페이지 | 경로 패턴 | 검증에 쓴 URL | 컴포넌트 | 표시 제목 |
| --- | --- | --- | --- | --- |
| 홈 | `/` | `/` | 기존 `HomePage`(변경 없음) | 학습 기록 서비스 |
| 목록 | `/records` | `/records` | `RecordListPage` | 학습 기록 목록 |
| 등록 | `/records/new` | `/records/new` | `RecordNewPage` | 학습 기록 등록 |
| 상세 | `/records/:recordId` | `/records/jsx` | `RecordDetailPage` | 학습 기록 상세 |
| 수정 | `/records/:recordId/edit` | `/records/jsx/edit` | `RecordEditPage` | 학습 기록 수정 |

- 학습 기록을 `records`라는 하나의 자원으로 보고, 목록 아래에 개별 기록(`:recordId`), 그 아래에 동작(`edit`)을 둔다. 주소만 봐도 "어떤 기록의 어떤 화면"인지 드러난다.
- 등록은 아직 식별자가 없는 새 기록이므로 `:recordId` 자리에 고정 단어 `new`를 쓴다.
- **주의할 점**: `/records/new`는 글자로만 보면 `/records/:recordId` 패턴에도 맞는다(`recordId`가 `new`인 경우). 실제 검증에서 `/records/new`는 등록 제목 하나만 표시했고 상세 제목은 나오지 않았다(8절).
- 동적 세그먼트 이름은 무엇을 가리키는지 드러나게 `recordId`로 정했다. 값을 읽는 `useParams`는 26단계에서 다루며, 이번에는 패턴만 선언했다. 그래서 `/records/jsx`든 `/records/abc`든 상세 페이지는 같은 문구를 표시한다.

## 5. React Router 구성 요소

공식 설치 문서는 Declarative 모드 설치를 `npm i react-router`로, 앱을 `BrowserRouter`로 감싸는 형태로 안내하며 `import { BrowserRouter } from "react-router"`를 사용한다. 라우팅 문서는 `<Routes>`와 `<Route>`를 렌더링해 URL 세그먼트를 UI 요소와 연결한다고 설명한다.

| 컴포넌트 | 역할 | 이번 사용 |
| --- | --- | --- |
| `BrowserRouter` | 브라우저 주소창의 URL을 읽고(이후 단계에서는 바꾸고) 그 정보를 안쪽 라우팅 컴포넌트에 제공한다 | 앱 전체를 한 번 감쌌다 |
| `Routes` | 안쪽 `Route`들 중 현재 위치에 **가장 잘 맞는** 라우트를 골라 렌더링한다(API 문서: "best matches the current location") | `Layout`의 children 자리에 하나 두었다 |
| `Route` | `path`(경로 패턴)와 `element`(그 경로에서 그릴 JSX)의 짝 | 5개 선언했다 |

`Routes`는 `Route` 목록을 **위에서부터 처음 맞는 것을 고르는 방식이 아니라** 가장 잘 맞는 것을 고른다고 문서화되어 있다. 이번 코드는 `/records/new`를 `/records/:recordId`보다 위에 적었으므로, 검증 결과만으로는 "선언 순서 덕분"과 "더 잘 맞는 쪽 선택 덕분"을 구분하지 못한다. 순서를 바꿔 본 실험과 내부 순위 계산 규칙은 확인하지 않았다(10절).

동적 세그먼트는 라우팅 문서의 "Dynamic Segments" 절에 따라 `:`로 시작하는 세그먼트이며, 라우트가 URL과 일치하면 그 값이 `params`로 파싱되어 `useParams` 같은 API에 제공된다. 이번 단계는 값을 읽지 않았다.

## 6. 실제 적용

### 변경 파일

| 파일 | 변경 |
| --- | --- |
| [`package.json`](../../package.json) | `dependencies`에 `"react-router": "^8.4.0"` 추가 |
| `package-lock.json` | `react-router` 8.4.0과 하위 의존성 `@remix-run/route-pattern` 0.22.1, `cookie-es` 3.1.1 항목 추가 |
| [`src/main.jsx`](../../src/main.jsx) | `BrowserRouter` → `Layout` → `Routes` 구조와 `Route` 5개 |
| [`src/pages/RecordListPage.jsx`](../../src/pages/RecordListPage.jsx) | 새 파일. 목록 제목 + 안내 문구 |
| [`src/pages/RecordNewPage.jsx`](../../src/pages/RecordNewPage.jsx) | 새 파일. 등록 제목 + 안내 문구 |
| [`src/pages/RecordDetailPage.jsx`](../../src/pages/RecordDetailPage.jsx) | 새 파일. 상세 제목 + 안내 문구 |
| [`src/pages/RecordEditPage.jsx`](../../src/pages/RecordEditPage.jsx) | 새 파일. 수정 제목 + 안내 문구 |

`HomePage`·`Layout`·`SiteHeader`·`PageTitle`·`global.css`·`index.html`은 바꾸지 않았고, Vite 설정 파일도 만들지 않았다.

### 패키지 설치(2026-10-01 실제 실행)

```text
npm install react-router
```

- 환경: Node.js `v24.18.1`, npm `11.16.0`(nvm 경로).
- 결과: 패키지 3개 추가(`react-router`와 하위 의존성 2개), `npm audit` 취약점 0건. `package.json`에는 캐럿 범위 `^8.4.0`으로 기록됐다.
- 기존 React·react-dom `19.3.0`과 Vite `8.3.1`은 바뀌지 않았다. react-router 8.4.0의 요구 범위(engines `node >=22.22.0`, peer `react`·`react-dom >=19.2.7`)를 모두 충족한다(설치 전 확인은 7절).
- 공식 설치 문서의 `npm i`는 `npm install`의 줄임 표기다.

### 진입 파일 매핑

```jsx
// src/main.jsx(주석·import 일부 생략)
import { BrowserRouter, Routes, Route } from 'react-router';

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
```

- 바깥부터 `BrowserRouter` → `Layout` → `Routes` 순서다. `Layout`은 지금처럼 children을 `main`에 그리므로, 공통 헤더는 모든 경로에서 유지되고 `Routes`가 고른 페이지만 `main` 안에서 바뀐다.
- `element`에는 컴포넌트 함수가 아니라 JSX 요소(`<HomePage />`)를 넘긴다. `Routes`는 고른 `Route`의 이 요소를 그대로 렌더링한다.

### 새 페이지 컴포넌트

네 파일은 제목과 문구만 다르고 구조가 같다. 기존 [`PageTitle`](../../src/components/PageTitle.jsx)에 `title` props를 넘기고 안내 문구 하나를 둔다.

```jsx
// src/pages/RecordNewPage.jsx
import PageTitle from '../components/PageTitle.jsx';

// 등록 페이지: /records/new 경로에 매핑된다. 폼은 이후 단계에서 추가한다.
export default function RecordNewPage() {
  return (
    <div>
      <PageTitle title="학습 기록 등록" />
      <p>새 학습 기록을 등록할 페이지입니다.</p>
    </div>
  );
}
```

폼·데이터·식별자 표시는 넣지 않았다. 매핑이 맞는지 화면 제목으로 구분할 수 있는 최소 내용이다.

## 7. 실행 흐름

### 직접 접근·새로고침

```text
주소창에 /records/new 입력(직접 접근) 또는 새로고침
→ Vite 개발 서버가 index.html 응답(appType 'spa' 기본 fallback, 검증에서 HTTP 200 확인)
→ src/main.jsx 실행 → BrowserRouter가 현재 URL '/records/new' 확인
→ Routes가 5개 Route 중 '/records/new' 선택
→ <RecordNewPage />가 Layout의 children으로 main 안에 렌더링
→ 화면: 공통 헤더 "Codyssey B1-2" + main 안 h1 "학습 기록 등록" + 안내 문구
```

### 홈 페이지 안쪽 흐름(라우터 도입 전과 동일)

```text
/ 접근 → Routes가 HomePage 선택
→ 버튼 클릭(onClick) → setVisibleCount(n) → HomePage 다시 렌더링 → 목록 개수 변경
→ URL은 계속 '/'
```

라우터는 "어느 페이지인가"만 정하고, 페이지 안쪽 state에는 관여하지 않는다. 그래서 `visibleCount`는 여전히 URL에 남지 않으며, 새로고침하면 초기값 2로 돌아간다([클라이언트 라우팅 자료](024-client-routing.md)에서 다룬 한계 그대로다).

## 8. 확인 결과(2026-10-01)

### 설치 전 확인(실제 실행)

| 확인 | 명령 | 결과 |
| --- | --- | --- |
| Node.js 경로·버전 | `command -v node`, `node --version` | nvm 경로의 Node.js `v24.18.1` |
| npm 경로·버전 | `command -v npm`, `npm --version` | 같은 nvm 경로의 npm `11.16.0` |
| 설치될 최신 버전 | `npm view react-router version` | `8.4.0` |
| Node.js 요구 범위 | `npm view react-router engines` | `node: '>=22.22.0'` → `v24.18.1` 충족 |
| React 요구 범위 | `npm view react-router peerDependencies` | `react`·`react-dom` 모두 `>=19.2.7`(react-dom은 `peerDependenciesMeta`에서 optional) → 설치된 `19.3.0` 충족 |
| 하위 의존성 | `npm view react-router dependencies` | `cookie-es`, `@remix-run/route-pattern` |
| `react-router-dom` 최신 | `npm view react-router-dom version` | `7.18.4`(8.x 없음) |

### 브라우저 검증

- 환경: Node.js `v24.18.1`, Vite 개발 서버(`127.0.0.1:5199`, 검증 스크립트가 직접 시작·종료), Playwright Chromium(headless).
- 명령: `node /tmp/codyssey-step24/check.cjs all`(시나리오 `routes`·`home`·`links`)
- 결과: **총 32건 통과, 0건 실패**(근거: `/tmp/codyssey-step24/results/all-2026-10-01T13-22-58-293Z.json`, 버전 관리 대상 아님)

| 시나리오 | 건수 | 확인 내용 |
| --- | --- | --- |
| 서버 | 2 | 개발 서버 시작, 종료 뒤 포트 응답 없음 |
| routes | 21 | 5개 URL 각각: HTTP 200 + `index.html` 응답 / 직접 접근 표시 / 새로고침 후 동일 표시 / console 오류·경고·pageerror 없음(5×4=20건), `/records/new`는 등록 제목만 표시(1건) |
| home | 7 | `/`에서 목록 2 → `전체 보기` 3 → `목록 비우기` 0(빈 안내 표시, `ul` 없음) → `2개 보기` 2, `기록 수 확인` alert 1건 문구 "현재 학습 기록은 3개입니다.", alert 뒤 2개·주소 `/` 유지, 오류 없음 |
| links | 2 | 이 문서 9건, 목록 28건의 로컬 링크 대상 존재(문서 보완 전 기준. 보완 후 재검사는 완료 보고에 기록) |

"표시"의 판정 기준은 경로마다 같다. `pathname`이 요청 경로와 같고, `header`·`main`·`h1`이 각 1개이며 `h1`이 `main` 안에 있고, 제목·안내 문구가 4절 표와 일치하고, 헤더 문구가 `Codyssey B1-2`다. 계산 스타일은 `body` margin `0px`, 헤더 배경 `rgb(245, 245, 245)`·아래 테두리 `1px`, `main` max-width `720px`, 헤더·`main`·`h1`·`p`가 숨김 없이 보이는지 확인했다. 박스는 네 요소 모두 너비·높이가 0보다 크다(예: `/records/new`에서 헤더 1280×49, `main` 768×133.4, `h1` 720×48, `p` 720×24).

## 9. 대안 비교

| 선택 지점 | 대안 | 가능 여부 | 이번에 선택하지 않은 이유 |
| --- | --- | --- | --- |
| 패키지 | `react-router-dom` | 7.x까지 배포되어 있으나 최신 8.x는 없다. 공식 설치 문서는 `react-router`를 안내한다 | 공식 문서 기준 패키지 하나로 충분하다 |
| 라우터 모드 | Data 모드(`createBrowserRouter` + `RouterProvider`) | 가능 | 데이터 로딩 기능이 아직 필요 없고, 23단계에서 Declarative 모드를 선택했다 |
| 매핑 위치 | 새 `App.jsx`에 `Routes` 두기 | 가능 | 현재 `main.jsx`에 라우트 5개만 두면 되므로 파일을 하나 더 만들 이유가 아직 없다 |
| 레이아웃 연결 | 부모 `Route`에 `Layout`을 두고 `Outlet`으로 자식 표시(중첩 라우트) | 가능 | `Outlet`은 새 개념이다. 기존 `Layout` children 구조로 같은 결과(모든 경로에 헤더 1개)를 냈다 |
| 경로 표기 | `records` 아래 중첩 `Route`와 `index` 라우트 | 가능 | 중첩 없이 전체 경로를 적으면 5개 경로가 한눈에 보인다. 중첩은 필요해질 때 다룬다 |
| 등록 경로 | `/new-record` 같은 별도 최상위 경로 | 가능 | `records` 자원 아래에 모아야 목록·상세·수정과 주소 구조가 일관된다 |
| 페이지 내용 | 지금 폼·상세 표시까지 작성 | 가능 | 폼은 43단계, 식별자 사용은 26단계 범위다. 매핑 확인에 필요한 최소 내용만 두었다 |

## 10. 현재 한계와 미확인 항목

이번 단계에서 하지 않은 것:

- `Link`·`NavLink` 등 이동 링크(25단계). 지금은 주소창에 직접 입력해야만 다른 페이지로 갈 수 있다.
- `useParams`와 기록 선택(26단계). 상세·수정 페이지는 어떤 `recordId`에도 같은 문구를 표시한다.
- Not Found(27단계). 5개 패턴에 맞지 않는 주소(예: `/abc`)는 처리하지 않았다.
- `Outlet`·중첩 라우트, `App.jsx` 추가
- 폼·원격 데이터·Vite 설정 파일·배포 rewrite

검증하지 않은 것:

- 매칭되지 않는 주소에서의 화면과 콘솔 출력
- `Route` 선언 순서를 바꿨을 때도 `/records/new`가 등록으로 선택되는지(5절)
- 프로덕션 빌드(`vite build`)와 빌드 결과에서의 직접 접근
- HMR(파일 수정 시 즉시 반영) 동작
- 이 문서·목록 링크의 `#` 앵커 정확성(링크 검사는 파일 존재만 확인)

## 11. 참고자료

- [React Router — Declarative 모드 설치](https://reactrouter.com/start/declarative/installation): `npm i react-router`, `BrowserRouter` import와 앱 감싸기
- [React Router — Declarative 모드 라우팅](https://reactrouter.com/start/declarative/routing): `Routes`·`Route`로 URL 세그먼트와 UI 연결, 중첩 라우트와 `Outlet`, Dynamic Segments와 `useParams`
- [React Router API — Routes](https://reactrouter.com/api/components/Routes): 현재 위치에 가장 잘 맞는 `Route` 분기를 렌더링
- [Vite — appType](https://vite.dev/config/shared-options.html#apptype): 개발 서버의 SPA fallback 기본값
- 관련 자료: [클라이언트 라우팅](024-client-routing.md), [props](016-props.md), [state](020-state.md), [children](022-children.md), [CSS import](023-css-import.md)
