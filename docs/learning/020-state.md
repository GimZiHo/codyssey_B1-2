# 020. state — 렌더링 사이에 값을 기억하고, 바꾸면 React가 다시 그린다

> 정규 단계 19(변경). 새 핵심 개념: **state(`useState`)** 하나.
> 구현 전에 작성한 자료를 구현·검토 뒤 실제 변경과 검증 결과로 보완했다. 4절은 실제 적용한 코드, 5절은 실제 검증 결과와 미확인 사항이다.

## 1. 지금 해결할 문제

이전 홈 화면([src/pages/HomePage.jsx](../../src/pages/HomePage.jsx))은 제목, 정적 기록 3개 목록, `기록 수 확인` 버튼을 보여 줬다. [19번 자료](019-react-events.md)에서 버튼 클릭으로 핸들러를 실행했지만 alert만 띄웠고 **화면은 바뀌지 않았다**.

과제가 강조하는 흐름은 **이벤트 → 상태 변경 → 렌더링**이다. 이번 단계는 목록의 **표시 범위**를 사용자가 바꾸게 해 이 흐름을 완성한다.

- 처음에는 기록 2개만 보인다.
- `전체 보기` 버튼을 누르면 3개 모두 보인다.
- `2개 보기` 버튼을 누르면 다시 2개만 보인다.
- 기존 `기록 수 확인` 버튼은 표시 범위와 관계없이 전체 기록 수(`3개`)를 알린다.

필요한 것은 "지금 몇 개를 보여 주는가"라는 값 하나를 **기억**하고, 그 값이 바뀌면 **화면을 다시 그리는** 방법이다.

## 2. 핵심 개념

### 2.1 state와 `useState`

**state**는 컴포넌트가 렌더링 사이에 기억하는 값이다. React 공식 문서는 이를 "컴포넌트의 기억(memory)"이라 부른다([State: A Component's Memory](https://react.dev/learn/state-a-components-memory)).

`useState`는 state를 만드는 React 함수다([useState 레퍼런스](https://react.dev/reference/react/useState)).

```jsx
const [visibleCount, setVisibleCount] = useState(2);
```

| 항목 | 내용 |
| --- | --- |
| 인자 `initialState` | 처음 렌더링할 때의 값. 이번에는 숫자 `2`. 공식 문서: 첫 렌더링 뒤에는 이 인자를 무시한다. |
| 반환값 | 정확히 두 값이 든 배열. ① 현재 state 값, ② 값을 바꾸고 다시 렌더링을 요청하는 **set 함수** |
| 이름 | 배열 구조 분해로 받으며 관례상 `[something, setSomething]` 형태로 짓는다. |

### 2.2 set 함수가 하는 일

공식 레퍼런스의 동작 중 이번 단계에 관련된 것만 적는다.

- set 함수를 부르면 React가 컴포넌트를 **다시 렌더링**한다. 다시 실행된 `HomePage`에서 `useState`는 새 값을 돌려준다.
- set 함수는 **다음 렌더링**의 값만 바꾼다. 같은 핸들러 안에서 호출 직후 변수를 읽으면 아직 이전 값이다.
- 새 값이 현재 값과 같으면(`Object.is` 비교) React는 다시 렌더링을 건너뛸 수 있다. 예를 들어 이미 3개가 보일 때 `전체 보기`를 또 눌러도 값은 3 그대로다.

### 2.3 Hook 규칙

`use`로 시작하는 함수를 **Hook**이라 한다. 공식 문서: Hook은 컴포넌트(또는 직접 만든 Hook)의 **최상위**에서만 호출하며 조건문·반복문·중첩 함수 안에서 호출할 수 없다. 그래서 `useState`는 `HomePage` 함수 본문 맨 위, 핸들러 밖에서 호출한다.

### 2.4 state를 바꾸는 쪽과 읽는 쪽

- **바꾸는 쪽**: 이벤트 핸들러가 `setVisibleCount(...)`를 부른다(이벤트 → 상태 변경).
- **읽는 쪽**: 렌더링 중 JSX가 `records.slice(0, visibleCount)`로 보여 줄 배열을 계산한다(상태 → 렌더링).

`Array.prototype.slice(start, end)`는 원본 배열을 바꾸지 않고 `start` 이상 `end` 미만 위치의 항목으로 **새 배열**을 반환한다. `records.slice(0, 2)`는 앞의 2개, `records.slice(0, 3)`은 3개 전부다. 그 결과에 기존과 같은 `map`·`key`를 적용한다([17번](017-array-rendering.md)·[18번](018-key.md) 자료).

## 3. 기존 방식과 대안 비교

### 3.1 기존 JavaScript 방식(B1-1)

B1-1에서는 순수 JavaScript로 요소를 찾아 `li`를 직접 지우거나 추가하고, `style.display`나 클래스를 바꿔 숨겼다. React 화면에서 이 방식을 쓸 수 있는지는 다음과 같다.

| 대안 | 가능 여부 | 필요한 추가 설정·제약 | 이번에 선택하지 않은 이유 |
| --- | --- | --- | --- |
| 핸들러에서 `document.querySelector`로 3번째 `li`를 지우거나 `style.display`로 숨김 | 가능하지만 불안정 | React가 관리하는 DOM을 React 밖에서 바꾼다. React가 다시 렌더링하면 직접 바꾼 내용과 React가 기억하는 화면이 어긋날 수 있다. | 화면을 데이터에서 계산한다는 React 방식과 충돌한다. 이번 과제 조건도 DOM 직접 변경을 쓰지 않는다. |
| **`useState` 숫자 + `slice` 렌더링** | 가능 | 없음. React 기본 기능이다. | **선택.** |

### 3.2 React 안에서의 다른 방법

| 대안 | 가능 여부 | 이번 판단 |
| --- | --- | --- |
| 컴포넌트 안 일반 지역변수 `let visibleCount = 2;`를 핸들러에서 변경 | **의도대로 동작 불가** | 공식 문서의 두 이유: ① 지역변수는 렌더링 사이에 유지되지 않는다(다시 렌더링하면 처음부터 실행되어 다시 `2`). ② 지역변수 변경은 렌더링을 일으키지 않는다(React가 새 데이터로 다시 그려야 하는지 모른다). |
| 컴포넌트 밖 모듈 변수 `let visibleCount = 2;` | 값은 유지되지만 **화면 갱신 불가** | ①은 해결되지만 ②가 남는다. 값만 바뀌고 React는 다시 렌더링하지 않는다. 또한 같은 컴포넌트를 두 번 그리면 값을 공유한다(state는 컴포넌트 인스턴스마다 따로 있다). |
| `useState` 불리언(`showAll`) | 가능 | 불리언이면 `showAll ? records : records.slice(0, 2)` 같은 조건식이 필요하다. 조건부 렌더링은 20단계 개념이므로, 숫자 하나를 `slice`에 그대로 넘기는 방식을 택했다. |
| 한 버튼으로 전체/2개 토글 | 가능 | 버튼 문구를 상태에 따라 바꾸려면 조건식이 필요하다. 이번에는 두 버튼을 **항상 표시**하고 각 버튼이 정해진 값을 설정한다. |
| `useReducer`·외부 상태 라이브러리 | 가능 | 값 하나에는 과하다. 새 개념·의존성이 늘어난다. |

## 4. 적용한 변경

변경 파일은 [src/pages/HomePage.jsx](../../src/pages/HomePage.jsx) 하나다. `main.jsx`·`PageTitle.jsx`·`index.html`·패키지·CSS·Vite 설정은 바꾸지 않았다. 추가 state·조건부 렌더링·Effect·라우팅·DOM 직접 변경도 없다. 기존 제목(`title` prop)·`records` 3개·`id`/`key`·`기록 수 확인` alert(전체 3개)는 그대로다.

### 4.1 state 선언 — 컴포넌트 최상위

```jsx
import { useState } from 'react';
// ...
export default function HomePage() {
  const [visibleCount, setVisibleCount] = useState(2);
```

- `useState`는 react 패키지의 named export라 중괄호로 가져온다([10번 자료](010-javascript-modules.md)).
- 호출 위치는 `HomePage` 본문 맨 위다. 핸들러나 조건문 안이 아니므로 2.3절 Hook 규칙을 지킨다.

### 4.2 상태를 바꾸는 핸들러 두 개

```jsx
function handleShowAll() {
  setVisibleCount(records.length);
}

function handleShowTwo() {
  setVisibleCount(2);
}
```

- `전체 보기`는 숫자 `3`을 직접 쓰지 않고 `records.length`를 넘긴다. 기록 수가 바뀌어도 "전체"의 뜻이 유지된다.
- 두 핸들러 모두 DOM을 건드리지 않고 set 함수만 부른다. 화면 변경은 React의 다시 렌더링이 맡는다.

### 4.3 상태를 읽는 JSX

```jsx
<p>{records.length}개 중 {visibleCount}개 표시</p>
<ul>
  {records.slice(0, visibleCount).map((record) => (
    <li key={record.id}>{record.title} ({record.project})</li>
  ))}
</ul>
<button type="button" onClick={handleShowAll}>전체 보기</button>
<button type="button" onClick={handleShowTwo}>2개 보기</button>
<button type="button" onClick={handleCheckRecordCount}>기록 수 확인</button>
```

- 표시 수 문구도 state를 읽는 JSX 표현식이다. 문구를 따로 고치는 코드가 없다.
- `slice` 결과에 기존 `map`·`key={record.id}`를 그대로 적용한다. 버튼 3개는 조건 없이 항상 렌더링된다.

### 4.4 실행 흐름(작은 입력부터 결과까지)

| 순서 | 사용자 동작 | 코드에서 일어나는 일 | 화면 |
| --- | --- | --- | --- |
| 1 | 페이지 진입 | `useState(2)` → `visibleCount`=2, `slice(0, 2)` | `3개 중 2개 표시`, `li` 2개(3번째 `li`는 DOM에 없음) |
| 2 | `전체 보기` 클릭 | `handleShowAll` → `setVisibleCount(3)` → `HomePage` 재실행, `useState`가 3 반환 | `3개 중 3개 표시`, `li` 3개 |
| 3 | `2개 보기` 클릭 | `handleShowTwo` → `setVisibleCount(2)` → 다시 렌더링 | 다시 2개 |
| 4 | `기록 수 확인` 클릭 | `records.length`로 alert | 표시 범위와 관계없이 `현재 학습 기록은 3개입니다.` |
| 5 | 새로고침 | 페이지와 React 루트가 새로 시작 | 초기값 2로 복구. state는 브라우저 저장소가 아니라 현재 화면의 기억이다. |

## 5. 검증 결과

### 5.1 실행 방법과 환경

- 기존 검증 스크립트 `/tmp/b12-step19/check.cjs`를 시나리오 인자(`render`·`state`·`links`)로 나눠 실행했다. Playwright 브라우저로 로컬 Vite 개발 서버 화면을 열어 확인하고, 끝나면 서버를 종료한다. 결과는 `/tmp/b12-step19/results/`의 실행 시각별 폴더에 있다(버전 관리 제외 임시 경로).
- 브라우저 실행 환경 변수는 [도구 환경](../tool-environment.md)의 경로를 따랐다.

### 5.2 실행 기록

| 실행(결과 폴더) | 시나리오 | 결과 |
| --- | --- | --- |
| `12-25-25-545Z` | render+state+links | state 10건·links 2건 통과. **render는 최초 실행에서 실패**: console 오류 2건, warning 1건, pageerror 1건 |
| `12-25-52-045Z` | render 재실행 | 9건 통과, 오류 없음 |
| `12-28-20-318Z` | render, Vite `--force`(의존성 강제 재최적화) 조건 | 10건 통과(그중 1건은 실행 조건을 남긴 정보 기록), 오류 없음 |

최종적으로 실질 검사 항목 21건(render 9 + state 10 + links 2)이 모두 현재 통과 상태다.

### 5.3 확인한 항목

- **초기 렌더링**: 기록 2개와 `3개 중 2개 표시`. 3번째 `li`는 숨김이 아니라 DOM에 없다.
- **상태 전환**: `전체 보기`로 3개, `2개 보기`로 2개. 반복 전환해도 항목이 중복되지 않는다.
- **키보드**: Tab으로 버튼에 초점을 옮긴 뒤 Enter·Space로도 같은 전환이 된다.
- **표시 상태**: 보이는 항목의 계산 스타일과 박스 크기로 실제로 화면에 나타나는지 확인했다.
- **기존 동작 유지**: `기록 수 확인` alert 문구는 표시 범위와 무관하게 3개다.
- **새로고침**: 새로고침 뒤 초기값 2개로 표시된다.
- **기타**: 클릭 뒤 URL 유지, 최종 실행의 console 오류·pageerror 없음, 자료의 로컬 링크 대상 존재, 검증 뒤 서버 종료.

### 5.4 최초 render 실패와 판단

- 첫 render 실행에서 console 오류 2건·warning 1건·pageerror 1건이 기록됐다. 이후 같은 코드로 재실행한 render와 `--force` 재최적화 조건 render는 모두 오류 없이 통과했다.
- **원인은 확정하지 못했다.** 이전 Vite 의존성 최적화 캐시(`react` 등을 미리 묶어 두는 결과)가 새로 추가된 `useState` import와 맞지 않았을 수 있다는 가설이 있지만 **추정**이며 재현하지 못했다.
- 제품 코드의 결함을 가리키는 근거는 없다. 현재 상태와 강제 재최적화 상태 모두 정상이다.

### 5.5 미확인 사항

- 개발 중 파일 저장 시 HMR(모듈 교체) 동작은 확인하지 않았다.
- 자료 안 링크는 파일 대상만 확인했고, 제목 앵커(`#...`)와 외부 원격 링크는 확인하지 않았다.
- 최초 render 실패의 원인(5.4절).

## 참고자료

- React, [State: A Component's Memory](https://react.dev/learn/state-a-components-memory) — 지역변수로 부족한 두 이유, `useState`가 주는 두 가지, 이름 관례, Hook 최상위 호출 규칙, 인스턴스별 state.
- React, [useState](https://react.dev/reference/react/useState) — 인자·반환값, set 함수가 다음 렌더링 값만 바꾸는 점, `Object.is` 비교, 주의사항.
- MDN, [Array.prototype.slice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) — 원본을 바꾸지 않는 부분 배열 반환.
- 관련 자료: [010 JavaScript 모듈](010-javascript-modules.md), [017 배열 렌더링](017-array-rendering.md), [018 key](018-key.md), [019 React 이벤트 처리](019-react-events.md).
