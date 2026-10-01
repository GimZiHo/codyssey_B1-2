# 026. 내비게이션 링크 — `Link`로 문서를 다시 받지 않고 페이지를 이동한다

## 학습 목적

[라우트 매핑](025-route-mapping.md)으로 5개 경로마다 그릴 페이지는 정해졌지만, 지금은 주소창에 URL을 직접 입력해야만 다른 페이지로 갈 수 있다. 이번 단계(정규 25단계)는 모든 페이지 위에 있는 공통 헤더에 이동 링크를 두어, 클릭으로 주소와 화면이 함께 바뀌게 한다. 새 핵심 개념은 **내비게이션 링크(React Router의 `Link`)** 하나다.

- 전 단계: [클라이언트 라우팅](024-client-routing.md)(개념) → [라우트 매핑](025-route-mapping.md)(`BrowserRouter`·`Routes`·`Route`)
- 이번 단계: 공통 헤더 `src/components/SiteHeader.jsx`에 `Link` 3개 추가
- 다음 단계: 라우트 파라미터(26), Not Found(27)

## 현재 문제

| 상황 | 현재 동작 |
| --- | --- |
| 홈에서 목록 페이지로 가기 | 주소창에 `/records`를 직접 입력해야 한다 |
| 화면 안의 이동 수단 | 없음. `SiteHeader`는 서비스 이름 `Codyssey B1-2`만 표시한다 |
| 주소창 입력으로 이동할 때 | 브라우저가 문서(`index.html`)를 서버에서 다시 받고 JavaScript를 처음부터 실행한다. 홈의 `visibleCount` 같은 state도 초기값으로 돌아간다 |

공통 헤더는 [children](022-children.md) 단계에서 `Layout`이 모든 페이지 위에 그리도록 만들었으므로, 링크를 여기 한 곳에만 두면 5개 페이지 모두에서 같은 이동 수단이 생긴다.

## 핵심 개념

### 링크 이동의 두 종류

- **문서 이동(document navigation)**: 브라우저가 새 URL의 문서를 서버에 요청하고 현재 문서를 버린 뒤 새로 그린다. 일반 `<a href>` 클릭과 주소창 입력이 여기에 해당한다. 브라우저의 기본 동작이므로 [브라우저와 웹 기초](000-browser-web-basics.md)에서 본 요청·응답이 매번 일어난다.
- **클라이언트 측 이동(client-side navigation)**: 문서는 그대로 두고, JavaScript가 History API로 주소만 바꾼 뒤 React Router가 새 URL에 맞는 `Route`를 다시 골라 그린다. 서버에 문서를 다시 요청하지 않는다. 자세한 원리는 [클라이언트 라우팅](024-client-routing.md)을 참고한다.

### `Link`

React Router 공식 문서는 `Link`를 "클라이언트 측 라우팅을 하는, 점진적으로 향상된 `<a href>` 래퍼"로 설명한다. 정리하면 다음과 같다.

| 항목 | 내용 |
| --- | --- |
| 가져오기 | `import { Link } from 'react-router';` (설치된 패키지 `react-router` 8.4.0) |
| 실제 DOM | `<a href="...">`. 그래서 접근성·키보드 초점·주소 복사·새 탭 열기 같은 링크의 기본 성질을 그대로 가진다 |
| `to` prop | 이동할 위치. 문자열(`"/records"`) 또는 `{ pathname, search, hash }` 객체. `/`로 시작하면 절대 경로다 |
| 일반 클릭 | 기본 문서 이동을 막고 History API로 기록을 **추가(push)**한 뒤 화면만 다시 그린다. 그래서 브라우저의 뒤로/앞으로가 동작한다 |
| 그대로 브라우저에 맡기는 클릭 | 설치된 8.4.0 소스(`node_modules/react-router/dist/development/lib/dom/dom.js`의 `shouldProcessLinkClick`)는 왼쪽 버튼(`button === 0`)이고, `target`이 없거나 `_self`이며, Ctrl·Shift·Alt·Meta 키를 누르지 않았을 때만 클라이언트 측 이동을 한다. 나머지(예: Ctrl+클릭으로 새 탭)는 일반 `<a>`처럼 동작한다 |
| 사용 가능한 모드 | Declarative·Data·Framework 모두. 이 프로젝트는 Declarative 모드(`BrowserRouter`)를 쓴다 |

이번에 쓰지 않는 주요 prop은 다음과 같다(모두 공식 문서 기준).

| prop | 역할 | 이번에 쓰지 않는 이유 |
| --- | --- | --- |
| `replace` | 기록을 추가하지 않고 현재 기록을 바꾼다 | 헤더 이동은 뒤로 가기로 돌아올 수 있어야 한다 |
| `reloadDocument` | 클라이언트 측 이동 대신 문서 이동을 한다 | 문서를 다시 받지 않는 것이 이번 목적이다 |
| `state` | 주소에 드러나지 않는 값을 `history.state`에 함께 넘긴다 | 넘길 값이 없다 |
| `relative` | 상대 경로 해석 기준(`"route"`/`"path"`)을 정한다 | 모두 `/`로 시작하는 절대 경로를 쓴다 |
| `prefetch`·`discover`·`viewTransition` 등 | 미리 불러오기·전환 효과 | Framework·Data 모드 전용이거나 이번 범위 밖이다 |

## 대안 비교

| 대안 | 가능 여부 | 필요한 추가 작업·제약 | 이번 판단 |
| --- | --- | --- | --- |
| 일반 `<a href="/records">` | 가능 | 추가 코드 없음. 대신 클릭마다 문서 이동이 일어나 `index.html`과 모듈을 다시 받고, React 트리 전체와 state가 초기화된다. 개발 서버의 SPA fallback 덕분에 화면은 표시된다 | 클라이언트 라우팅을 도입한 이유가 사라지므로 선택하지 않음 |
| `button` + `useNavigate()` 호출 | 가능 | 핸들러 작성이 필요하고, 결과가 `<a>`가 아니라서 주소 미리보기·새 탭 열기·링크로서의 접근성 의미가 없다 | 이동 자체가 목적인 메뉴에는 맞지 않음. 등록 성공 뒤 이동 같은 "프로그램에 의한 이동"은 46단계에서 다룬다 |
| `<a>` + `onClick`에서 `preventDefault()`·`history.pushState()` 직접 호출 | 가능 | 수정 키·`target` 처리를 직접 구현해야 하고, React Router는 `pushState`를 직접 호출한 사실을 알지 못해 화면이 바뀌지 않는다 | `Link`가 이미 하는 일을 다시 구현하는 것이라 선택하지 않음 |
| `NavLink` | 가능 | `Link`에 "현재 페이지인지" 상태(활성 클래스·`aria-current`)를 더한 컴포넌트다 | 현재 위치 표시는 이번 개념 밖이라 이번 단계에서는 쓰지 않음 |
| `Link` | 가능 | `react-router`는 24단계에 이미 설치되어 새 의존성이 없다 | **선택** |

## 프로젝트 적용

변경 파일은 두 개다. `BrowserRouter` 안의 공통 `Layout`/`SiteHeader` 구조는 그대로 두었다.

### `src/components/SiteHeader.jsx`

`react-router`에서 `Link`를 가져와 서비스 이름 아래 `nav`에 3개를 배치했다.

```jsx
import { Link } from 'react-router';

<header>
  <p>Codyssey B1-2</p>
  <nav>
    <Link to="/">홈</Link>
    <Link to="/records">학습 기록</Link>
    <Link to="/records/new">기록 등록</Link>
  </nav>
</header>
```

| 링크 문구 | `to` | 렌더링되는 DOM | 매핑된 페이지(25단계) |
| --- | --- | --- | --- |
| 홈 | `/` | `<a href="/">` | `HomePage` |
| 학습 기록 | `/records` | `<a href="/records">` | `RecordListPage` |
| 기록 등록 | `/records/new` | `<a href="/records/new">` | `RecordNewPage` |

### `src/styles/global.css`

`a`는 인라인 요소라 그대로 두면 문구가 붙어 보이므로, 헤더 안 링크 사이 간격만 추가했다. 선택자를 `header nav a`로 좁혀 페이지 본문 링크에는 영향이 없다.

```css
header nav a {
  margin-right: 16px;
}
```

이번에 하지 않은 것: 상세(`/records/:recordId`)·수정(`/records/:recordId/edit`) 고정 링크(실제 식별자는 26단계에서 다룬다), 현재 위치 표시(`NavLink`), `useParams`, Not Found(27단계).

### 실행 흐름

`Link`가 `SiteHeader` 안에 있으므로 `BrowserRouter`(`src/main.jsx`) 안쪽에서 렌더링되어야 한다. 현재 구조는 `BrowserRouter` > `Layout` > `SiteHeader`이므로 이 조건을 만족한다.

```text
'학습 기록' 링크 클릭
→ Link가 문서 이동을 막고 History API로 /records를 기록에 추가
→ BrowserRouter가 바뀐 URL을 감지
→ Routes가 path="/records"인 Route를 선택
→ Layout의 main 안 children만 RecordListPage로 바뀌고 헤더는 유지
```

이 흐름은 아래 브라우저 검증에서 실제로 확인했다.

## 확인 결과

Vite 개발 서버와 Playwright(Chromium)로 검증했다. 검증 스크립트와 결과는 임시 경로 `/tmp/b1-2-step25/`에 있으며 버전 관리에 넣지 않는다.

| 검사 묶음 | 결과 | 확인한 내용 |
| --- | --- | --- |
| 내비게이션 | 12통과 0실패 | 링크 클릭 시 URL과 페이지 제목 변경, 클릭 이동 중 문서 재요청 없음, 뒤로/앞으로, 각 경로 직접 접근·새로고침, 모든 페이지의 공통 헤더 유지, Tab으로 초점 이동 후 Enter 이동, 계산된 스타일·박스(링크 간격), 홈 복귀 시 `visibleCount` 3→2, 콘솔 오류 없음 |
| 홈 회귀 | 5통과 0실패 | 기존 홈 동작(표시 개수 2→3→0→2, alert 3개)이 링크 추가 뒤에도 유지 |
| 자료 링크 | 2통과 0실패 | 학습자료·목록의 상대 링크 |

- 첫 내비게이션 검사는 URL이 바뀐 직후 DOM 갱신 전에 제목을 읽어 실패했다. 앱 결함이 아니라 검사의 읽기 시점 문제였고, 화면 갱신을 기다리도록 고친 뒤 통과했다. 클라이언트 측 이동에서는 주소 변경과 다시 그리기가 한 순간에 끝나지 않는다는 점을 보여 준다.
- 첫 홈 회귀 검사는 같은 포트에서 다른 검사와 병렬로 실행되어 어느 검사가 서버를 띄웠는지 보장되지 않았다. 단독으로 다시 실행해 위 결과를 얻었다.

미확인: HMR(파일 저장 시 화면 갱신), 프로덕션 빌드 결과물에서의 동작, 문서 내 앵커(`#`) 링크, 수정 키(Ctrl·Shift 등) 클릭의 실제 브라우저 동작. 수정 키 처리는 위 [`Link`](#link) 표의 설치 소스 근거만 있고 실행으로 확인하지 않았다.

## 질문·추가 확인

- 현재 위치한 페이지를 헤더에서 구분해 보여 주려면 `NavLink`가 필요하다. 이번 단계 범위 밖이다.
- 홈에서 표시 개수를 3으로 바꾼 뒤 다른 페이지로 갔다가 돌아오면 `visibleCount`가 초기값 2로 돌아온다(검증에서 확인). 문서 재요청은 없었으므로 문서 재로드 때문이 아니라, `Routes`가 다른 페이지를 그리는 동안 `HomePage`가 화면에서 빠졌다가(언마운트) 다시 마운트되기 때문이다. 페이지 이동 뒤에도 값을 유지하려면 state를 URL이나 상위 컴포넌트로 옮겨야 하며 이번 범위 밖이다.

## 참고자료

- [React Router `Link`](https://reactrouter.com/api/components/Link) — 2026-10-01 확인. `<a href>` 래퍼, `to`·`replace`·`reloadDocument`·`state`·`relative` prop과 모드별 사용 가능 범위
- 설치된 `react-router` 8.4.0의 `node_modules/react-router/dist/development/lib/dom/dom.js` `shouldProcessLinkClick` — 클라이언트 측 이동을 처리하는 클릭 조건
