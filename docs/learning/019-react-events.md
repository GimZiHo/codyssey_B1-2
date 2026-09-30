# 019. React 이벤트 처리 — 함수를 전달해 두면 React가 사용자 동작 때 호출한다

> 정규 단계 18(변경). 새 핵심 개념: **React 이벤트 처리** 하나.
> 구현 전에 작성하고 구현·검토 후 보완했다. 4절은 실제 적용한 변경, 5절은 실제 브라우저 검증 결과다. 6절의 state 연결은 아직 구현하지 않은 다음 단계 설명이다.

## 1. 지금 해결할 문제

현재 홈 화면([src/pages/HomePage.jsx](../../src/pages/HomePage.jsx))은 제목과 정적 기록 3개를 **보여 주기만** 한다. 사용자가 무엇을 눌러도 코드가 실행되지 않는다.

앞으로 필요한 기능(목록 표시 범위 바꾸기, 등록·수정·삭제 버튼, 폼 제출)은 모두 "사용자가 무엇을 했을 때 코드를 실행한다"에서 시작한다. 과제가 강조하는 **이벤트 → 상태 변경 → 렌더링** 흐름 중 첫 칸이 이벤트다.

이번 단계는 그 첫 칸만 만든다.

- 화면에 `기록 수 확인` 버튼 하나를 추가한다.
- 버튼을 누르면 `window.alert`로 `현재 학습 기록은 3개입니다.`를 띄운다(3은 `records.length`).
- 화면 내용은 바뀌지 않는다. 화면을 바꾸려면 state가 필요하며 그것은 다음 단계(19)의 개념이다.

## 2. 핵심 개념

### 2.1 이벤트 핸들러

**이벤트**는 클릭·키 입력처럼 브라우저가 알려 주는 사용자 동작이다. **이벤트 핸들러**는 그 이벤트가 일어났을 때 실행할 함수다.

React 공식 문서의 순서는 세 단계다([Responding to Events](https://react.dev/learn/responding-to-events)).

1. 컴포넌트 **안에** 함수를 선언한다.
2. 함수 안에 할 일을 적는다.
3. JSX 태그의 `onClick` 같은 prop에 그 함수를 **넘긴다**.

이름은 관례상 `handle` + 동작 이름으로 짓는다(`handleClick`, `handleMouseEnter`). 이번 함수 이름 `handleCheckRecordCount`도 "기록 수 확인" 동작을 다루는 핸들러라는 뜻이다.

`<button>` 같은 내장 태그는 `onClick`처럼 **브라우저 이벤트 이름**만 인식한다. HTML 속성 `onclick`과 달리 카멜 표기(`onClick`)이며, 값은 문자열이 아니라 `{}` 안의 JavaScript 함수다.

### 2.2 함수 전달과 함수 호출의 차이

가장 흔한 실수다. `{}` 안의 JavaScript는 **렌더링할 때 바로 실행**된다([16단계](016-props.md)·[17단계](017-array-rendering.md)에서 본 JSX의 `{}` 규칙과 같다).

| 코드 | `{}` 안의 값 | 결과 |
| --- | --- | --- |
| `onClick={handleCheckRecordCount}` | 함수 자체 | React가 함수를 보관했다가 **클릭할 때** 호출한다. (올바름) |
| `onClick={handleCheckRecordCount()}` | 함수를 **호출한 결과**(`undefined`) | 렌더링하는 순간 alert가 뜨고, 클릭 때는 아무 일도 없다. (잘못) |
| `onClick={() => window.alert('...')}` | 새로 만든 화살표 함수 | 클릭할 때 화살표 함수가 실행된다. (올바름) |
| `onClick={window.alert('...')}` | `alert`를 호출한 결과 | 렌더링할 때마다 alert가 뜬다. (잘못) |

공식 문서 표현: `handleClick()`의 끝 `()`는 "클릭 없이 렌더링 중에 **즉시** 함수를 실행한다". 즉 **괄호가 없으면 전달, 있으면 호출**이다.

이번 검증에서 "페이지 최초 진입과 새로고침 때 alert 0회"를 확인하는 이유가 이것이다. 실수로 괄호를 붙였다면 로드할 때 alert가 뜬다.

### 2.3 핸들러 안에서 읽을 수 있는 값

핸들러는 컴포넌트 함수 안에 선언하므로 그 범위의 값을 읽을 수 있다. 공식 문서는 props를 예로 들며, 같은 원리로 이번 핸들러는 모듈 상단의 `records`를 읽어 `records.length`를 계산한다.

### 2.4 부수 효과는 핸들러에 둔다

렌더링(컴포넌트 함수가 JSX를 반환하는 과정)은 같은 입력에 같은 결과를 내는 순수한 계산이어야 한다. 반면 공식 문서는 "이벤트 핸들러는 부수 효과를 두기 가장 좋은 곳이며 순수할 필요가 없다"고 한다. `window.alert`는 화면 밖에 대화상자를 띄우는 부수 효과이므로 렌더링이 아니라 핸들러에서 실행한다.

### 2.5 이벤트 객체는 이번에 쓰지 않는다

React는 핸들러에 **이벤트 객체**(관례상 `e`) 하나를 인자로 넘긴다. 어떤 요소에서 일어났는지, 기본 동작 막기(`e.preventDefault()`) 등에 쓴다. 이번 핸들러는 이 값이 필요 없으므로 매개변수를 선언하지 않는다. JavaScript는 선언하지 않은 인자를 무시하므로 문제가 없다.

## 3. 기존 방식과 대안 비교

### 3.1 B1-1 방식: `addEventListener`

B1-1은 순수 JavaScript로 요소를 찾은 뒤 `element.addEventListener('click', handler)`로 핸들러를 연결했다. 연결 코드와 화면 HTML이 떨어져 있어 "이 버튼에 무엇이 연결됐는지"를 다른 파일·위치에서 찾아야 했다.

React 화면에서 같은 방식을 계속 쓸 수 있는지 구분하면 다음과 같다.

| 대안 | 가능 여부 | 필요한 추가 설정·제약 | 이번에 선택하지 않은 이유 |
| --- | --- | --- | --- |
| `main.jsx`에서 `root.render` 뒤 `document.querySelector('button').addEventListener(...)` | 가능하지만 불안정 | React는 렌더링을 예약해 처리하므로 `render` 호출 직후 버튼이 아직 없을 수 있다. React가 DOM을 다시 만들면 연결이 사라진다. | React가 관리하는 DOM을 React 밖에서 건드리게 되어 화면 선언과 동작이 분리된다. |
| 컴포넌트 안에서 ref + Effect로 `addEventListener` 연결 | 가능 | `useRef`로 DOM 참조, `useEffect`로 연결, 정리(cleanup)로 해제해야 한다. | ref·Effect·cleanup 세 개념이 더 필요하다. 한 단계 한 개념 원칙에 어긋나며, 내장 태그의 클릭은 `onClick`으로 충분하다. Effect는 36단계 이후에 다룬다. |
| **JSX의 `onClick` prop에 함수 전달** | 가능 | 없음. React 기본 기능이다. | **선택.** |

`addEventListener` 자체가 금지된 것은 아니다. `window` 스크롤처럼 React가 그리지 않는 대상에는 Effect와 함께 쓸 수 있다. 이번처럼 React가 그리는 버튼의 클릭은 JSX에 적는 것이 공식 문서의 기본 방법이다.

### 3.2 React 안에서의 작성 방식

| 대안 | 가능 여부 | 이번 판단 |
| --- | --- | --- |
| 이름 있는 함수 `handleCheckRecordCount`를 선언해 `onClick={handleCheckRecordCount}` | 가능 | **선택.** 전달과 호출의 차이가 코드에 드러나고, 다음 단계에서 state 변경을 같은 함수에 추가하기 쉽다. |
| 인라인 화살표 `onClick={() => window.alert(...)}` | 가능 | 짧은 동작에는 흔히 쓴다. 이번에는 핸들러의 선언과 전달을 따로 보여 주기 위해 선택하지 않았다. |
| `onClick={handleCheckRecordCount()}` | 문법은 통과하지만 **의도대로 동작 불가** | 렌더링 때 실행된다(2.2). |
| `<div onClick={...}>` | 마우스 클릭은 가능 | 공식 문서는 클릭 처리에 `<button>`을 쓰라고 한다. 실제 `<button>`은 키보드 이동 같은 브라우저 기본 동작을 제공하며, MDN도 버튼을 마우스·키보드·보조 기술로 활성화하는 대화형 요소로 설명한다. `div`는 이를 직접 구현해야 한다. |
| 결과를 화면에 글자로 표시 | state 필요 | 화면을 바꾸려면 state가 필요하다(19단계). 이번에는 화면을 바꾸지 않는 `alert`로 핸들러 실행만 확인한다. |

### 3.3 `type="button"`을 적는 이유

MDN 기준으로 `<button>`의 `type` 기본값 `submit`은 **폼(`<form>`)에 속한 버튼**에 적용되며, 누르면 폼을 제출한다. `type="button"`은 기본 동작이 없고 스크립트가 연결한 동작만 한다([MDN `<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button)).

현재 화면에는 폼이 없으므로 `type`을 생략해도 제출은 일어나지 않는다. **지금 필수는 아니다.** 다만 이 버튼의 목적이 "스크립트 동작 전용"임을 명시하고, 나중에 폼 안으로 옮겨져도 의도치 않게 제출되지 않도록 적는다.

## 4. 적용한 변경

변경 파일은 [src/pages/HomePage.jsx](../../src/pages/HomePage.jsx) 하나다. `main.jsx`·`PageTitle.jsx`·`index.html`·패키지·Vite 설정은 바꾸지 않았다. state·이벤트 객체·조건부 렌더링·새 컴포넌트·의존성도 추가하지 않았다. 기존 `records` 3개·`id`/`key`·제목(`학습 기록 서비스`)은 그대로다.

1. `HomePage` 함수 안, `return` 위에 핸들러를 선언한다.

   ```jsx
   function handleCheckRecordCount() {
     window.alert(`현재 학습 기록은 ${records.length}개입니다.`);
   }
   ```

   - `window.alert(message)`: 브라우저 대화상자에 문자열을 띄우고 사용자가 닫을 때까지 기다린다. 반환값은 `undefined`.
   - 템플릿 리터럴의 `${records.length}`는 현재 배열 길이 `3`으로 바뀐다.

2. 기존 제목과 목록(`key` 포함)은 그대로 두고, `ul` 뒤에 버튼을 추가한다.

   ```jsx
   <button type="button" onClick={handleCheckRecordCount}>기록 수 확인</button>
   ```

   - `onClick`에는 괄호 없이 함수를 **전달**한다.
   - 소스에는 핸들러 위에 "클릭 때 React가 호출할 함수, 화면을 바꾸지 않는 부수 효과만 실행", 버튼 위에 "함수 자체를 전달(괄호 없음)" 주석을 두었다.

3. 실행 흐름(5절 검증으로 확인)
   1. 렌더링: `HomePage`가 실행되어 `handleCheckRecordCount` 함수가 만들어지고, JSX가 그 함수를 버튼의 `onClick`으로 React에 넘긴다. 이때 alert는 실행되지 않는다.
   2. 사용자가 버튼을 클릭하거나, 버튼에 초점을 둔 채 Enter/Space를 누른다. 브라우저는 버튼의 click 이벤트를 발생시킨다.
   3. React가 보관한 `handleCheckRecordCount`를 호출하고 `현재 학습 기록은 3개입니다.` 대화상자가 뜬다.
   4. 대화상자를 닫아도 state가 없으므로 다시 렌더링되지 않고 화면·URL은 그대로다.

## 5. 검증 결과

검증 스크립트: `/tmp/b12-step18/verify.cjs` (저장소 밖, 버전 관리 제외). 시나리오 이름을 인자로 골라 실행한다(`render`, `events`, `links`). 스크립트가 개발 서버를 띄우고 브라우저로 페이지를 연 뒤 검사하고 서버를 종료한다. 각 검사는 동작 전후 실제 상태 변화를 비교하며 화면 캡처는 하지 않았다.

| 시나리오 | 확인 내용 | 결과 | 근거 파일 |
| --- | --- | --- | --- |
| `render` | 모듈 응답, 제목·목록 3개·버튼의 실제 내용, 계산 스타일·박스 | 5건 통과 | `/tmp/b12-step18/results/2026-09-30T12-11-19-289Z-render+events+links.json` |
| `links` | 로컬 링크 대상 파일 존재 | 2건 통과 | 같은 파일 |
| `events` | 아래 이벤트 동작 | 11건 통과 | `/tmp/b12-step18/results/2026-09-30T12-12-32-253Z-events.json` |
| 서버 | 검증 뒤 개발 서버 종료 | 1건 통과 | 같은 파일 |

중복을 뺀 최종 19건이 통과했고 현재 실패는 0건이다.

`events`에서 확인한 실제 동작:

- 최초 진입과 새로고침 직후 alert **0회** → 렌더링 중 핸들러가 호출되지 않았다(2.2의 괄호 실수 없음).
- 버튼 동작별 alert 횟수: 마우스 클릭 1회, 연속 클릭 3회, Tab으로 버튼에 초점 이동 뒤 Enter 1회·Space 1회, 새로고침 뒤 다시 클릭 1회 — 총 **7회**. 모두 문구가 정확히 `현재 학습 기록은 3개입니다.`였다.
- 대화상자를 닫은(dismiss) 뒤 제목·목록·버튼과 URL이 그대로였다 → state가 없어 화면이 바뀌지 않는다.
- console error/warning과 페이지 예외(pageerror) 0건.

검증 과정의 실패와 수정: 처음에는 키보드 검사 준비 단계가 실패했다. 원인은 검증 스크립트가 초점을 초기화하려고 `body`를 클릭하고 `blur`한 뒤 Tab을 눌러 버튼에 초점이 가지 않은 것이며, `h1`을 클릭한 뒤 Tab을 누르도록 스크립트를 고쳤다. 마지막 재실행은 결과 파일의 대화상자 목록이 이후 동작에 따라 바뀌지 않도록 스냅샷으로 기록하게 고친 것으로, 근거 기록의 정확성 보완이다. 제품 코드의 오류는 없었다.

미확인 항목: 개발 서버 실행 중 코드 수정 반영(HMR), 링크 앵커(`#...`) 정확성, state·다시 렌더링에 따른 화면 변화(이번 범위 밖), 원격 데이터 연동.

## 6. 다음 단계와의 관계

이번 단계는 **이벤트 → (핸들러 실행)** 까지다. 다음은 아직 구현하지 않은 예정 내용이다. 19단계에서 핸들러가 state를 바꾸면 **이벤트 → 상태 변경 → 렌더링**이 완성되어 화면 자체가 바뀐다.

## 참고자료

- React, [Responding to Events](https://react.dev/learn/responding-to-events) — 핸들러 선언·전달, 전달과 호출의 차이, 부수 효과, 이벤트 객체, `<button>` 사용 권장.
- MDN, [`<button>`: The Button element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button) — `type` 기본값과 `button` 값, 대화형 요소.
- 관련 자료: [016 props](016-props.md), [017 배열 렌더링](017-array-rendering.md), [018 key](018-key.md).
