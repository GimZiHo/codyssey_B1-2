# 022. children — 페이지 내용을 받는 공통 레이아웃

정규 단계 21(변경). 새 핵심 개념은 `children` 하나다. 이전 개념은 [props](016-props.md), [함수 컴포넌트](015-function-component.md), [조건부 렌더링](021-conditional-rendering.md)을 참고한다.

## 1. 현재 문제

지금 화면은 `src/main.jsx`가 `root.render(<HomePage />)`로 홈 페이지 하나만 그린다. 앞으로 목록·상세·등록·수정 페이지가 추가되면(24단계 라우트 매핑), 모든 페이지에 같은 헤더와 "페이지 본문 영역"이 필요하다.

- 각 페이지가 헤더를 직접 그리면 같은 JSX가 페이지 수만큼 복제된다.
- 헤더·본문 영역의 구조를 바꿀 때 모든 페이지를 고쳐야 한다.
- 레이아웃 입장에서는 "무엇을 넣을지"(페이지 내용)는 모르고 "어디에 넣을지"(본문 자리)만 안다.

필요한 것은 **틀은 한 곳에서 정하고, 그 안의 내용은 바깥(부모)이 정하는** 방법이다.

## 2. 핵심 개념: children

[React 공식 문서 — Passing JSX as children](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)에 따르면 JSX 태그 **사이에** 내용을 넣으면 부모 컴포넌트는 그 내용을 `children`이라는 prop으로 받는다.

```jsx
// 공식 문서 예시(요약). 이 프로젝트 코드가 아니다.
function Card({ children }) {
  return <div className="card">{children}</div>;
}

<Card>
  <Avatar />
</Card>
```

- `children`은 특별한 문법이 아니라 **이름이 정해진 prop**이다. 16단계 `title`처럼 구조 분해 `{ children }`으로 꺼낸다.
- 차이는 전달 방법이다. `title="..."`은 속성으로, `children`은 여는 태그와 닫는 태그 사이에 적어 전달한다.
- 받은 컴포넌트는 `{children}`을 원하는 위치에 두기만 한다. 공식 문서는 이를 부모가 임의의 JSX로 채울 수 있는 "구멍(hole)"에 비유하고, 패널·그리드 같은 시각적 감싸개(wrapper)에 자주 쓴다고 설명한다.
- props와 마찬가지로 읽기 전용이다. 레이아웃은 받은 페이지를 고치지 않고 배치만 한다.

## 3. 대안 비교

| 방법 | 가능 여부 | 제약·필요한 것 | 이번 선택 |
| --- | --- | --- | --- |
| 각 페이지가 헤더·`main`을 직접 작성 | 가능 | 페이지마다 같은 구조 복제, 변경 시 전 페이지 수정 | 선택하지 않음. 페이지가 늘수록 중복이 커진다 |
| 레이아웃이 `HomePage`를 직접 import해 그림 | 가능 | 레이아웃이 특정 페이지에 묶여 다른 페이지를 넣을 수 없음 | 선택하지 않음. 재사용이 목적이다 |
| 이름 붙인 prop으로 전달(`<Layout page={<HomePage />} />`) | 가능 | JSX를 속성 값으로 넘겨 중첩 구조가 덜 드러남 | 선택하지 않음. 넣을 자리가 하나뿐이면 `children`이 자연스럽다 |
| `index.html`에 정적 `<header>`를 두고 React는 본문만 | 가능 | React 밖이라 25단계 헤더 링크·상태와 연결하기 어려움 | 선택하지 않음 |
| **`children`으로 감싸기** | 가능 | 추가 설치·설정 없음 | **선택** |

라우터의 레이아웃 라우트(`Outlet`)도 공통 틀을 만드는 방법이지만 라우터 도입(23~24단계) 전이므로 이번에는 사용할 수 없다. 레이아웃을 "필수로" 분리해야 하는 것은 아니며, 여러 페이지가 같은 틀을 공유할 예정이라서 지금 분리한다.

## 4. 선택 이유

- 레이아웃이 페이지를 몰라도 되므로 24단계에서 어떤 페이지든 같은 틀에 넣을 수 있다.
- 이미 배운 props·구조 분해만으로 구현된다(새 설치·설정 없음).
- 제목 `h1`은 페이지(`PageTitle`)가 계속 맡는다. 헤더에 또 `h1`을 두면 페이지 제목이 두 개가 되므로 헤더에는 서비스 이름을 일반 텍스트로만 둔다.

## 5. 수행 순서

1. `src/components/`에 헤더 컴포넌트를 만든다(`header` 요소, h1 없음).
2. `src/components/`에 레이아웃 컴포넌트를 만들어 헤더와 `<main>{children}</main>`을 반환한다.
3. `src/main.jsx`에서 `<HomePage />`를 레이아웃 태그 사이에 넣는다. `HomePage`는 바꾸지 않는다.
4. 브라우저에서 구조(header·main 각 1개, main 안의 페이지)와 기존 동작(목록 전환·alert·새로고침)이 유지되는지 확인한다.

CSS import·스타일(22단계)·라우터·링크(24~25단계)는 이번 범위가 아니다.

## 6. 실제 적용

생성 2개, 수정 1개. `HomePage.jsx`·`PageTitle.jsx`·`index.html`·패키지·Vite 설정은 바꾸지 않았다.

`src/components/SiteHeader.jsx`(생성) — props 없이 `header` 안에 서비스 이름을 `p`로 표시한다. 페이지 제목과 겹치지 않게 h1을 쓰지 않았다.

```jsx
export default function SiteHeader() {
  return (
    <header>
      <p>Codyssey B1-2</p>
    </header>
  );
}
```

`src/components/Layout.jsx`(생성) — `{ children }`을 구조 분해해 `main` 안에 둔다. 17단계처럼 여러 요소를 하나로 묶기 위해 `div`로 감쌌다.

```jsx
export default function Layout({ children }) {
  return (
    <div>
      <SiteHeader />
      <main>{children}</main>
    </div>
  );
}
```

`src/main.jsx`(수정) — `Layout`을 import하고 `<HomePage />`를 태그 사이에 넣었다.

```jsx
root.render(
  <Layout>
    <HomePage />
  </Layout>,
);
```

## 7. 실행 흐름

1. `root.render`가 `<Layout>` 요소를 받는다. 태그 사이의 `<HomePage />` 요소는 Layout의 props 객체에 `children`으로 담긴다(`{ children: <HomePage /> }`).
2. React가 `Layout({ children })`을 호출한다. Layout은 `SiteHeader`와 `<main>{children}</main>`을 반환한다. 이때 Layout은 children이 어떤 페이지인지 확인하지 않는다.
3. React가 `SiteHeader`와 `HomePage`를 호출한다. HomePage의 state·이벤트는 그대로 HomePage 안에서 동작한다.
4. 결과 DOM: `#root > div > header + main > div(HomePage)`.

버튼 클릭 → `setVisibleCount` → HomePage 다시 렌더링의 흐름은 HomePage 안에서 일어나며, Layout은 children을 자리에 놓기만 한다. 버튼 전환 중 header·main이 그대로 유지되는 것을 아래 state 시나리오에서 확인했다.

## 8. 확인 결과

2026-09-30, Node.js `v24.18.1`, Vite 개발 서버(포트 5221, 스크립트가 시작·종료), Playwright Chromium Headless Shell, 1280×800. 스크린샷 없음. 시나리오별 선택 실행(`render`·`state`·`reload`·`links`).

| 시나리오 | 결과 | 확인 내용 |
| --- | --- | --- |
| render | 11/11 통과 | 모듈 5개(main·Layout·SiteHeader·HomePage·PageTitle) 200·JavaScript. `#root > div > header + main` 순서로 header·main 각 1개. header `display: block`, 1264×19(y 16), 문구 `Codyssey B1-2`, h1 없음. main `display: block`, 1264×169.4, y 56.4로 header 아래. main 안 `div > h1·p·ul·button×4`. 문서 전체 h1 1개(`학습 기록 서비스`, main 안). 초기 li 2개, 최초 alert 0회, console error/warning·pageerror 0건, 서버 종료 |
| state | 5/5 통과 | 전체 보기 3 → 목록 비우기 0(안내 문구 실제 표시) → 2개 보기 2. 전환 중 header·main 각 1개 유지. 2개·빈·3개 상태에서 alert 3건 모두 `현재 학습 기록은 3개입니다.`, 오류 0건, 서버 종료 |
| reload | 4/4 통과 | 빈 상태에서 새로고침 → 레이아웃 유지·초기 2개·alert 0회, URL 유지, 오류 0건, 서버 종료 |
| links | 3/3 통과 | 이 문서와 자료 목록의 로컬 링크 대상 존재, 목록의 022 행과 링크 존재 |

main의 y(56.4)가 header 아래(16+19)보다 더 떨어진 것은 브라우저 기본 여백(`p`·`h1`의 margin)이 겹친 결과다. 스타일은 22단계에서 다룬다.

## 9. 남은 확인

- HMR(파일 저장 시 화면 갱신 방식)과 문서 링크의 앵커 정확성은 확인하지 않았다.
- 여러 페이지를 같은 Layout에 넣는 동작은 라우트가 생기는 24단계에서 확인한다.

## 참고자료

- [React — Passing JSX as children](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)
