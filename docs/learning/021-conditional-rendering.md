# 021. 조건부 렌더링 — 조건에 따라 JSX 중 하나를 고르거나 아무것도 그리지 않는다

> 정규 단계 20(변경). 새 핵심 개념: **조건부 렌더링** 하나.
> 1~3절은 구현 전에 작성한 설명이다. 4~5절은 검토를 마친 실제 변경([src/pages/HomePage.jsx](../../src/pages/HomePage.jsx))과 브라우저 검증 결과를 바탕으로 보완했다. 2.4절의 `&&` 코드는 설명용 미실행 예시다.

## 1. 지금 해결할 문제

현재 홈 화면([src/pages/HomePage.jsx](../../src/pages/HomePage.jsx))은 [20번 자료](020-state.md)에서 도입한 `visibleCount` state로 기록을 2개 또는 3개 보여 준다. 표시 개수는 `records.slice(0, visibleCount)`로 계산한다.

이번 단계는 목록이 **비는 경우**를 다룬다. 표시 개수를 0으로 만드는 `목록 비우기` 버튼을 추가했다. 조건부 렌더링 없이 버튼만 추가하면 다음 문제가 생긴다.

- `slice(0, 0)`은 빈 배열이라 `li`는 하나도 없지만, **빈 `ul`은 여전히 DOM에 남는다**.
- 사용자에게는 아무것도 없는 영역만 보이고 "기록이 없다"는 설명이 없다.

필요한 것은 **목록이 비었을 때는 안내 문구만, 비지 않았을 때는 목록만** 그리는 방법이다. 두 요소가 동시에 나타나지 않아야 한다(상호배타적).

## 2. 핵심 개념

### 2.1 조건부 렌더링이란

**조건부 렌더링**은 조건에 따라 서로 다른 JSX를 반환하거나 포함하는 것이다. React에는 이를 위한 별도 문법이 없고 **`if`, `? :`, `&&` 같은 JavaScript 문법을 그대로 쓴다**([React: Conditional Rendering](https://react.dev/learn/conditional-rendering)).

React는 매 렌더링마다 컴포넌트 함수를 다시 실행하므로([20번 자료](020-state.md) 2.2절), 조건식도 매번 **현재 state**로 다시 계산된다. 즉 흐름은 다음과 같다.

```
이벤트 → set 함수로 state 변경 → 다시 렌더링 → 조건식 재계산 → 고른 JSX만 화면에 반영
```

### 2.2 공식 문서의 네 가지 방법

| 방법 | 형태 | 특징 |
| --- | --- | --- |
| `if` 문과 `return` | 조건마다 다른 JSX를 `return` | JSX 밖(함수 본문)에서만 쓸 수 있다. 조건에 따라 **컴포넌트 전체**의 결과를 바꿀 때 알맞다. |
| 삼항 연산자 `조건 ? A : B` | JSX `{}` 안에 넣는 표현식 | 둘 중 **하나를 반드시** 고른다. |
| 논리 AND `조건 && A` | JSX `{}` 안에 넣는 표현식 | 조건이 참이면 `A`, 거짓이면 **아무것도 그리지 않는다**. |
| 변수에 JSX 대입 | `let content = ...; if (...) content = ...;` | 가장 길지만 가장 유연하다. |

`{}` 안에는 **표현식**만 들어간다([17번 자료](017-array-rendering.md)). `if` 문은 표현식이 아니므로 JSX 안에서는 삼항 연산자나 `&&`를 쓴다.

### 2.3 "아무것도 그리지 않는" 값

공식 문서: React는 JSX 안의 `false`를 `null`·`undefined`와 마찬가지로 **빈자리**로 보고 그 자리에 아무것도 그리지 않는다. 그래서 `조건 && <p>...</p>`에서 조건이 `false`면 `p`는 DOM에 만들어지지 않는다. CSS로 숨기는 것과 달리 **요소 자체가 없다**.

### 2.4 `&&` 왼쪽에 숫자를 두지 않는다

공식 문서의 주의사항이다. `&&`는 왼쪽이 거짓 같은 값이면 **그 왼쪽 값 자체**를 결과로 돌려준다. 왼쪽이 `false`면 아무것도 그리지 않지만, 왼쪽이 숫자 `0`이면 결과가 `0`이 되고 React는 **숫자 0을 화면에 그린다**.

이번 단계는 `visibleCount`가 실제로 `0`이 되므로 이 함정에 직접 해당한다.

```jsx
// 미실행 예시 — 잘못된 형태: visibleCount가 0이면 화면에 "0"이 표시된다
{visibleCount && <ul>...</ul>}

// 미실행 예시 — 비교식으로 불리언을 만든다
{visibleCount > 0 && <ul>...</ul>}
```

## 3. 기존 방식과 대안 비교

### 3.1 기존 JavaScript 방식(B1-1)

| 대안 | 가능 여부 | 필요한 추가 설정·제약 | 이번에 선택하지 않은 이유 |
| --- | --- | --- | --- |
| 핸들러에서 `document.querySelector`로 `ul`을 지우고 안내 `p`를 만들어 붙임 | 가능하지만 불안정 | React가 관리하는 DOM을 React 밖에서 바꾼다. 다음 렌더링 때 React가 기억하는 화면과 어긋날 수 있다. | [20번 자료](020-state.md) 3.1절과 같은 이유. 화면은 state에서 계산한다. |
| 안내 `p`와 `ul`을 항상 그리고 CSS(`display: none`)나 `hidden` 속성으로 한쪽만 숨김 | 가능 | 조건에 따른 클래스·속성 값은 결국 조건식으로 계산해야 한다. 숨긴 요소도 DOM에 남는다. | 이번 완료 기준은 빈 경우 `ul`이 **DOM에 없는 것**이다. 스타일 적용 방식(CSS import)은 22단계 범위다. |

### 3.2 React 안에서의 방법

| 대안 | 가능 여부 | 이번 판단 |
| --- | --- | --- |
| `if (visibleRecords.length === 0) return <p>…</p>;` 로 컴포넌트 전체를 바꿈 | 가능하지만 부적합 | 제목·표시 수 문구·버튼까지 함께 사라진다. 이를 피하려면 같은 제목·버튼 JSX를 두 `return`에 **중복**해야 한다. 바뀌는 부분은 목록 영역 하나뿐이다. |
| `&&` 두 번: `{isEmpty && <p>…</p>}` + `{!isEmpty && <ul>…</ul>}` | 가능 | 두 조건을 따로 적으므로 한쪽을 고칠 때 다른 쪽과 어긋나면 둘 다 보이거나 둘 다 사라질 수 있다. 상호배타가 코드 구조로 보장되지 않는다. |
| **삼항 연산자: `{isEmpty ? <p>…</p> : <ul>…</ul>}`** | 가능 | **선택.** 조건 하나로 둘 중 정확히 하나만 고르므로 상호배타가 문법으로 보장된다. |
| 변수에 JSX 대입 후 `{listContent}` | 가능 | 분기가 두 개뿐이라 삼항 연산자보다 코드가 길어진다. 분기가 늘면 고려할 수 있다. |
| 안내를 별도 컴포넌트(예: `EmptyMessage`)로 분리 | 가능 | 지금은 문구 한 줄이고 재사용처가 없다. 재사용 컴포넌트 정리는 51단계 범위다. |

### 3.3 조건을 무엇으로 쓸까

| 조건 | 판단 |
| --- | --- |
| `visibleCount === 0` | 동작은 같지만 "표시 개수 설정값"을 본다. |
| **`visibleRecords.length === 0`** | **선택.** 실제로 그릴 배열이 비었는지를 직접 본다. "목록이 비었을 때"라는 요구와 뜻이 같다. |
| `visibleCount && …` | 2.4절 함정 때문에 쓰지 않는다. |

## 4. 실제 적용

변경 파일은 [src/pages/HomePage.jsx](../../src/pages/HomePage.jsx) 하나다. 기존 state(초기 2), `전체 보기`·`2개 보기` 버튼, `records` 3개와 `key`, `기록 수 확인` alert(전체 3개)는 그대로 두었다. `main.jsx`·`PageTitle.jsx`·`index.html`·패키지·CSS·Vite 설정은 바꾸지 않았다.

### 4.1 추가한 핸들러

```jsx
// src/pages/HomePage.jsx
// 기록 삭제가 아니라 표시 개수만 0으로 바꾼다(원본 records는 그대로).
function handleClear() {
  setVisibleCount(0);
}
```

`setVisibleCount(0)`은 [20번 자료](020-state.md)의 set 함수와 같다. 인자로 받은 0을 다음 렌더링의 `visibleCount`로 예약하고 다시 렌더링을 요청한다. 반환값은 없다.

### 4.2 목록 영역의 조건부 렌더링

```jsx
// src/pages/HomePage.jsx
const visibleRecords = records.slice(0, visibleCount);

// return 안
<p>{records.length}개 중 {visibleCount}개 표시</p>
{visibleRecords.length === 0 ? (
  <p>표시할 학습 기록이 없습니다.</p>
) : (
  <ul>
    {visibleRecords.map((record) => (
      <li key={record.id}>{record.title} ({record.project})</li>
    ))}
  </ul>
)}
<button type="button" onClick={handleShowAll}>전체 보기</button>
<button type="button" onClick={handleShowTwo}>2개 보기</button>
<button type="button" onClick={handleClear}>목록 비우기</button>
```

- `records.slice(0, visibleCount)`: 0번부터 `visibleCount` 앞까지 복사한 **새 배열**을 반환한다. `visibleCount`가 0이면 빈 배열 `[]`이다. 원본 `records`는 바뀌지 않는다.
- `visibleRecords.length === 0`: 비교식이라 결과가 항상 `true`/`false`다. 2.4절의 숫자 0 함정이 생기지 않는다.
- 삼항 연산자는 조건 하나로 `p`와 `ul` 중 **정확히 하나**를 반환한다. 고르지 않은 쪽은 DOM에 만들어지지 않는다.
- 표시 수 문구 `3개 중 0개 표시`와 버튼들은 삼항 밖에 있으므로 빈 경우에도 그대로 남는다(3.2절의 `if`+`return` 대안을 고르지 않은 이유).

### 4.3 실제 실행 흐름

| 순서 | 사용자 동작 | 코드에서 일어나는 일 | 화면 |
| --- | --- | --- | --- |
| 1 | 페이지 진입 | `useState(2)` → `visibleRecords` 2개 → 조건 거짓 | `ul`과 `li` 2개, 안내 없음 |
| 2 | `목록 비우기` 클릭 | `handleClear` → `setVisibleCount(0)` → 다시 렌더링 → `slice(0, 0)`은 `[]` → 조건 참 | `3개 중 0개 표시`와 안내 문구, `ul`·`li`는 DOM에 없음 |
| 3 | `전체 보기` 또는 `2개 보기` 클릭 | 3 또는 2로 변경 → 조건 거짓 | 안내 `p`가 DOM에서 사라지고 `ul`이 새로 생성됨 |
| 4 | `기록 수 확인` 클릭 | `records.length`로 alert | 표시 범위와 관계없이 `현재 학습 기록은 3개입니다.` |

"비우기"는 기록 삭제가 아니라 **표시 개수를 0으로** 바꾸는 것이다. state는 메모리에만 있으므로 새로고침하면 초기값 2로 돌아간다.

## 5. 확인 결과

Vite 개발 서버와 헤드리스 브라우저로 시나리오별 검사를 실행했다(임시 검증 스크립트, 버전 관리 제외). 총 33항목 통과, 실패 0건이며 서버 종료까지 확인했다.

| 시나리오 | 항목 | 확인한 내용 |
| --- | --- | --- |
| render | 7 | 최초 진입 시 `li` 2개와 안내 부재, 오류 없음 |
| empty | 7 | `목록 비우기` 뒤 안내 `p`의 계산 스타일 `display: block`·`visibility: visible`·`opacity: 1`, 박스 1264×19로 실제 표시. `ul`·`li`는 DOM에 없음 |
| restore | 5 | `전체 보기`·`2개 보기`로 목록 복원과 안내 제거, 비우기↔복원 반복 전환 |
| keyboard | 4 | Tab으로 초점 이동 뒤 Enter·Space로 같은 전환 |
| alert | 4 | 표시 범위(0개 포함)와 관계없이 기존 문구 `현재 학습 기록은 3개입니다.` 유지 |
| reload | 4 | 비운 뒤 새로고침하면 초기 2개로 돌아옴 |
| links | 2 | 이 자료와 자료 목록의 로컬 링크 대상 존재(자료 보완 뒤 재실행) |

미확인: 파일 수정 시 HMR로 갱신되는지 전체 새로고침인지, 문서 앵커(`#…`)의 정확성.

## 참고자료

- React, [Conditional Rendering](https://react.dev/learn/conditional-rendering) — `if`·삼항·`&&`·변수 대입, `false`/`null`/`undefined`가 아무것도 그리지 않는 점, `&&` 왼쪽 숫자 주의.
- 관련 자료: [017 배열 렌더링](017-array-rendering.md), [018 key](018-key.md), [019 React 이벤트 처리](019-react-events.md), [020 state](020-state.md).
