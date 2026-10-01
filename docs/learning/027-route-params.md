# 027. 라우트 파라미터 — `useParams`로 상세 경로의 식별자를 읽는다

> 단계: 정규 26단계(변경). 구현 전 개념 자료로 먼저 작성하고, 구현·브라우저 검증 뒤 실제 변경 파일과 결과로 보완했다. "아직 수행하지 않은 예시"라고 적은 코드 외에는 실제 소스에서 옮겼다.

## 학습 목적

[라우트 매핑](025-route-mapping.md)에서 `/records/:recordId`를 상세 페이지에 연결했지만, 변경 전 상세 페이지는 `/records/jsx`든 `/records/abc`든 같은 문구만 표시한다. [내비게이션 링크](026-navigation-links.md)로 헤더 이동은 생겼지만 목록에서 기록 하나를 골라 상세로 가는 길도 없다. 이번 단계의 새 핵심 개념은 **라우트 파라미터(`useParams`)** 하나다.

- URL의 동적 세그먼트 값이 컴포넌트에 전달되는 경로를 안다.
- 그 값으로 기록 하나를 골라 화면에 표시한다.
- 같은 상세 페이지 안에서 식별자만 바뀌어도 화면이 새 값을 따르는 이유를 안다.

## 변경 전 문제

| 상황 | 변경 전 동작 |
| --- | --- |
| `/records/jsx` 접근 | "학습 기록 상세" 제목과 고정 안내 문구만 표시. 어떤 기록인지 알 수 없다 |
| 목록 페이지(`/records`) | 고정 안내 문구만 있고 기록 목록·상세 링크가 없다 |
| 기록 데이터 위치 | 정적 배열 3개가 `src/pages/HomePage.jsx` 안에만 있어 다른 페이지가 쓸 수 없다 |

## 핵심 개념

### 용어

| 용어 | 뜻 |
| --- | --- |
| 동적 세그먼트 | 라우트 경로에서 `:`로 시작하는 칸. `/records/:recordId`의 `:recordId` |
| 라우트 파라미터(params) | 현재 URL이 라우트와 일치할 때 동적 세그먼트 자리에 들어온 실제 값. `/records/jsx`이면 `recordId`는 `"jsx"` |
| `useParams` | 현재 일치한 라우트의 params 객체를 컴포넌트 안에서 읽는 React Router 훅 |

### 동적 세그먼트에서 params로

React Router 라우팅 문서(Declarative 모드)의 "Dynamic Segments" 절은 `:`로 시작하는 세그먼트를 동적 세그먼트라 하고, 라우트가 URL과 일치하면 그 값이 URL에서 파싱되어 `useParams()` 같은 API에 `params`로 제공된다고 설명한다. 한 경로에 동적 세그먼트를 여러 개 둘 수 있으며 이름은 서로 달라야 한다(같으면 뒤 값이 앞 값을 덮는다).

```text
라우트 패턴  /records/:recordId
현재 URL     /records/jsx
params       { recordId: "jsx" }
```

### `useParams`

| 항목 | 내용(공식 API 문서 기준) |
| --- | --- |
| 가져오기 | `import { useParams } from 'react-router';` (설치된 `react-router` 8.4.0) |
| 인자 | 없음 |
| 반환값 | 현재 URL에서 파싱한 동적 파라미터의 키/값 객체. 값은 문자열이며 없으면 `undefined`. 읽기 전용 |
| 사용 위치 | 라우트 컨텍스트 안. 즉 `Route`의 `element`로 그려진 컴포넌트(또는 그 자식) |
| 사용 가능한 모드 | Framework·Data·Declarative 모두. 이 프로젝트는 Declarative 모드다 |

값이 항상 **문자열**이라는 점이 중요하다. 기록의 `id`가 숫자라면 비교 전에 변환이 필요하지만, 현재 정적 기록의 `id`는 `'jsx'` 같은 문자열이라 그대로 비교한다.

`useParams`는 [state](020-state.md)처럼 컴포넌트 최상위에서 호출하는 훅이다. 값을 직접 바꾸는 set 함수는 없고, URL이 바뀌면 React Router가 컴포넌트를 다시 렌더링하면서 새 값을 돌려준다.

### 식별자가 바뀔 때

`/records/jsx`에서 `/records/props`로 이동하면 두 URL 모두 같은 `Route`(`/records/:recordId`)와 일치한다. 같은 자리에 같은 컴포넌트를 그리므로 React는 `RecordDetailPage`를 새로 만들지 않고 **다시 렌더링**할 수 있다. 이때 화면이 이전 기록을 그대로 보여 주지 않으려면, 표시할 기록을 렌더링할 때마다 params에서 계산해야 한다. 처음 값을 state에 복사해 두면 다시 렌더링되어도 state는 이전 값으로 남을 수 있다.

```jsx
// 아직 수행하지 않은 비교 예시
const { recordId } = useParams();
const record = records.find((r) => r.id === recordId); // 렌더링마다 다시 계산 → 항상 현재 URL 기준

const [record] = useState(() => records.find((r) => r.id === recordId)); // 첫 값만 기억 → 이동 뒤 이전 기록이 남을 수 있음
```

### 고정 경로 `/records/new`와의 관계

`/records/new`는 글자로는 `/records/:recordId`에도 맞지만 [라우트 매핑](025-route-mapping.md)에서 등록 페이지가 선택됨을 확인했다. 이번 단계에서도 라우트를 바꾸지 않았고, 검증에서 `/records/new`는 등록 제목만 표시했으며 상세의 기록·안내 문구가 나오지 않았다. 즉 `new`가 `recordId`로 읽히지 않았다.

## 대안 비교

| 대안 | 가능 여부 | 필요한 추가 작업·제약 | 이번 판단 |
| --- | --- | --- | --- |
| 쿼리 문자열 `/records?id=jsx` + `useSearchParams` | 가능 | 라우트 패턴에 식별자가 드러나지 않고, 이미 정한 `/records/:recordId` 경로 설계와 맞지 않는다 | 선택하지 않음 |
| `useLocation().pathname`을 직접 `split('/')` | 가능 | 경로 구조를 컴포넌트가 다시 해석해야 하고 경로 패턴이 바뀌면 함께 고쳐야 한다 | 라우트가 이미 파싱한 값을 다시 만드는 일이라 선택하지 않음 |
| `Link`의 `state`로 기록 객체 전달 | 가능 | 목록에서 클릭했을 때만 값이 있고 직접 접근·새로고침에서는 없다 | 직접 접근을 지원해야 하므로 선택하지 않음 |
| 기록마다 고정 라우트(`/records/jsx` …) | 가능 | 기록이 늘 때마다 `Route`를 추가해야 하고 원격 데이터와 맞지 않는다 | 선택하지 않음 |
| `useParams` | 가능 | `react-router`가 24단계에 이미 설치되어 새 의존성이 없다 | **선택** |

React Router 공식 문서는 Data·Framework 모드에서 `loader`가 params를 받는 방식도 안내하지만, 이 프로젝트는 Declarative 모드이고 데이터 요청은 이후 훅 단계에서 다룬다.

## 프로젝트 적용

변경 파일은 4개다(새 파일 1개 포함). `src/main.jsx`의 라우트, CSS, 패키지는 바꾸지 않았다.

| 파일 | 변경 |
| --- | --- |
| `src/lib/staticRecords.js`(새 파일) | `HomePage` 안에 있던 정적 기록 3개를 그대로 옮겨 named export `staticRecords`로 내보냄. 필드 추가 없음 |
| `src/pages/HomePage.jsx` | 배열 선언을 지우고 `import { staticRecords as records } from '../lib/staticRecords.js'`로 교체. 본문은 기존 이름 `records`를 그대로 써서 변경 없음 |
| `src/pages/RecordListPage.jsx` | 고정 안내 문구 대신 공유 목록을 `ul > li > Link`로 표시 |
| `src/pages/RecordDetailPage.jsx` | `useParams`로 `recordId`를 읽고 `find`로 기록을 골라 제목·프로젝트 표시, 없으면 안내 한 줄 |

데이터를 `src/lib`로 옮긴 이유는 홈·목록·상세 세 페이지가 같은 기록을 써야 하기 때문이다. 페이지 파일 하나에서 다른 페이지 파일의 내부 값을 가져오는 대신, 페이지가 아닌 데이터 모듈을 두고 각 페이지가 import한다([JavaScript 모듈](010-javascript-modules.md)). `as records`는 import한 이름을 이 파일 안에서만 바꿔 부르는 문법이라 홈의 나머지 코드를 건드리지 않았다.

### 목록: 기록마다 상세 경로 링크

```jsx
<ul>
  {staticRecords.map((record) => (
    <li key={record.id}>
      <Link to={`/records/${record.id}`}>{record.title} ({record.project})</Link>
    </li>
  ))}
</ul>
```

[배열 렌더링](017-array-rendering.md)과 [key](018-key.md)를 그대로 쓰고, 각 항목을 [`Link`](026-navigation-links.md)로 감쌌다. `to`는 템플릿 리터럴로 기록의 `id`를 경로에 넣는다. 결과 DOM은 `<a href="/records/jsx">` 같은 일반 링크다.

| 링크 문구 | `href` |
| --- | --- |
| JSX (B1-2) | `/records/jsx` |
| 함수 컴포넌트 (B1-2) | `/records/function-component` |
| props (B1-2) | `/records/props` |

### 상세: `useParams`로 기록 고르기

```jsx
const { recordId } = useParams();
const record = staticRecords.find((item) => item.id === recordId);

<PageTitle title="학습 기록 상세" />
{record ? (
  <div>
    <p>제목: {record.title}</p>
    <p>프로젝트: {record.project}</p>
  </div>
) : (
  <p>해당 학습 기록을 찾을 수 없습니다.</p>
)}
```

- `Array.prototype.find`는 조건을 만족하는 첫 요소를 반환하고, 없으면 `undefined`를 반환한다. 그래서 알 수 없는 id는 `record`가 `undefined`가 되어 [조건부 렌더링](021-conditional-rendering.md)의 안내 분기로 간다. `record.title`을 읽기 전에 분기하므로 오류가 나지 않는다.
- 기록을 state에 복사하지 않고 렌더링마다 계산하므로, 같은 상세 페이지에서 `recordId`만 바뀌어도 이전 기록이 남지 않는다.
- 페이지 제목(`h1`)은 기존 "학습 기록 상세"를 유지했다.
- 두 `p`를 묶는 데 Fragment(`<>`) 대신 기존 자료와 같이 `div`를 썼다.
- 안내 문구는 최소 처리다. 잘못된 주소 전용 페이지는 27단계(Not Found), 원격 조회의 "기록 없음"은 41단계(빈 결과)에서 다루며 이번에는 구현하지 않았다.

### 실행 흐름

```text
목록에서 'props (B1-2)' 클릭
→ Link가 문서 이동을 막고 /records/props를 기록에 추가
→ Routes가 /records/:recordId 라우트를 선택, params = { recordId: "props" }
→ RecordDetailPage 렌더링: useParams()가 { recordId: "props" } 반환
→ find가 id === "props"인 기록 반환 → "제목: props", "프로젝트: B1-2" 표시

같은 상세에서 /records/unknown-id로 주소만 바뀜
→ 같은 Route·같은 컴포넌트가 다시 렌더링, useParams()가 { recordId: "unknown-id" } 반환
→ find가 undefined 반환 → 안내 문구만 표시
```

## 확인 결과

Vite 개발 서버(`127.0.0.1:5186`)와 Playwright(Chromium Headless Shell)로 검증했다. 스크립트 `/tmp/b1-2-step26/check.cjs`가 서버를 직접 시작·종료하고 시나리오별 결과를 `/tmp/b1-2-step26/result-<시나리오>.json`에 남긴다. 서버를 쓰는 두 시나리오는 순차 실행했다. 임시 경로이며 버전 관리에 넣지 않는다.

| 검사 묶음 | 결과 | 확인한 내용 |
| --- | --- | --- |
| detail | 14통과 0실패 | 목록 링크 3개의 `href`·문구, 계산 스타일·박스(표시되고 `main` 안에 있음), 클릭 시 해당 기록 표시와 문서 재요청 없음, 상세 사이 `recordId` 변경 반영, 알 수 없는 id의 안내만 표시, 목록 경유 뒤로/앞으로, 3개 기록·알 수 없는 id의 직접 접근·새로고침, `/records/new`·`/records/jsx/edit` 유지, 공통 헤더, Tab 초점 이동 뒤 Enter, 콘솔 오류·경고 없음, 서버 시작/종료 |
| home | 5통과 0실패 | 데이터 이동 뒤에도 홈 표시 개수 2→3→0→2, 전체 보기 시 기록 3개 문구·순서, alert "현재 학습 기록은 3개입니다.", 오류 없음, 서버 시작/종료 |
| links | 2통과 0실패 | 이 자료와 목록의 상대 링크 대상 존재(앵커 정확성 제외) |

상세 사이 이동 검사의 방법과 결과는 다음과 같다.

- 현재 화면에는 상세에서 다른 상세로 가는 링크가 없다. 그래서 검사에서 `history.pushState`로 주소를 추가하고 `popstate` 이벤트로 라우터에 알렸다. 이후 뒤로/앞으로는 실제 브라우저 기록 이동이다. 순서: `/records/jsx` → `props` → `unknown-id` → 뒤로 `props` → 뒤로 `jsx` → 앞으로 `props` → `function-component`.
- 모든 단계에서 URL에 맞는 기록(또는 안내)만 표시했고, `unknown-id`에서는 직전 기록의 제목·프로젝트가 남지 않았다.
- 이동 내내 문서 재요청이 없었고, 처음 `h1` DOM 요소에 붙인 표시가 유지되었다. 같은 `Route`의 `RecordDetailPage`가 새로 마운트되지 않고 다시 렌더링되었다는 뜻이다.

미확인: HMR, 프로덕션 빌드, 문서 내 앵커(`#`) 링크의 정확성, 상세 사이 이동을 사용자가 링크로 하는 경우(그런 링크가 아직 없음). 값이 퍼센트 인코딩된 id(예: 한글·공백)의 디코딩은 현재 id가 영문이라 확인하지 않았다.

## 참고자료

- [React Router `useParams`](https://reactrouter.com/api/hooks/useParams) — 2026-10-01 확인. 반환값(문자열 또는 `undefined`의 읽기 전용 객체), 다중 파라미터·splat 예시, 모드별 사용 가능 범위
- [React Router Declarative 모드 라우팅 — Dynamic Segments](https://reactrouter.com/start/declarative/routing#dynamic-segments) — 2026-10-01 확인. `:` 세그먼트가 params로 파싱되어 `useParams`에 제공됨, 다중 세그먼트 이름 고유성
