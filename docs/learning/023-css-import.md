# 023. CSS import — JavaScript 모듈에서 일반 CSS 파일을 가져와 화면에 적용한다

정규 단계 22(변경)의 학습자료다. 구현 전에 개념·대안을 정리했고, 소스 검토 뒤 실제 변경과 브라우저 검증 결과를 반영했다. `미실행 예시`로 표시한 코드는 이번에 수행하지 않은 대안이다.

## 1. 현재 문제

[children 단계](022-children.md)에서 `Layout`이 공통 `header`와 `main`을 그리게 되었지만 화면에는 브라우저 기본 스타일만 적용되었다.

- `body`의 기본 여백(Chromium 기준 8px) 때문에 헤더가 화면 가장자리에 붙지 않고, 헤더와 본문을 구분하는 선·배경이 없다.
- 버튼 네 개가 기본 모양으로 붙어 있다.
- 기술 구성에서 스타일은 **일반 CSS**로 정했고([진행 상태](../progress.md)의 기술 구성 표), 소스 경로 중 `src/styles`가 스타일 파일을 둘 자리다. 이 단계 전에는 이 경로와 CSS 파일이 없었다.

이번 단계의 목표는 디자인을 꾸미는 것이 아니라 **CSS 파일을 어떤 방법으로 화면에 연결하는지**다. 그래서 적용한 규칙도 여백·구분선·버튼 간격 정도로 최소화했다.

## 2. 핵심 개념

### 2.1 부수 효과(side effect) import

[JavaScript 모듈](010-javascript-modules.md)에서 `import X from './a.js'`는 다른 파일이 export한 값을 가져온다. 이름 없이 경로만 쓰는 형태도 있으며, 이번에 [`src/main.jsx`](../../src/main.jsx)에 추가한 줄이 이 형태다.

```js
import './styles/global.css';
```

이 형태는 가져올 값(바인딩)이 없고, 모듈을 **실행하는 것 자체**가 목적이다([MDN import — 부수 효과만을 위한 import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#import_a_module_for_its_side_effects_only)). 표준 브라우저는 `.css` 파일을 JavaScript 모듈로 실행하지 못하므로, 이 문장이 동작하는 것은 **Vite가 CSS 파일을 JavaScript 모듈로 바꿔 주기 때문**이다.

### 2.2 Vite가 CSS import를 처리하는 방식

[Vite 기능 — CSS](https://vite.dev/guide/features.html#css)(문서 표기 v8.3.1, 프로젝트 설치 버전과 같음)의 설명은 다음과 같다.

| 상황 | Vite의 처리 |
| --- | --- |
| 개발 서버(`npm run dev`) | `.css` 파일을 import하면 그 내용을 `<style>` 태그로 페이지에 넣고 HMR(파일 수정 시 새로고침 없는 교체)을 지원한다. |
| 프로덕션 빌드 | CSS를 별도 파일로 추출한다. 이 프로젝트는 빌드를 아직 구성하지 않았으므로(55단계) 이번에는 확인하지 않았다. |
| CSS 안의 `@import`·`url()` | `@import`는 인라인으로 합치고 `url()` 경로는 파일 위치에 맞게 다시 계산한다. 이번 CSS에는 쓰지 않았다. |

개발 중 흐름은 다음과 같고, 2~4는 8절의 브라우저 검증에서 실제로 확인했다.

1. 브라우저가 `index.html`의 `<script type="module" src="/src/main.jsx">`를 요청한다.
2. Vite가 변환한 `main.jsx` 안에 `import "/src/styles/global.css";`가 남는다.
3. 브라우저가 이 경로를 모듈(요청 종류 `script`)로 요청하면 Vite는 CSS 원문이 아니라 **CSS 문자열과 `<style>` 주입 코드를 담은 JavaScript**(`text/javascript`)를 응답한다.
4. 그 JavaScript가 실행되어 `<head>`에 `<style data-vite-dev-id="…/src/styles/global.css">`가 생기고, 브라우저가 규칙을 계산해 화면에 반영한다.

### 2.3 CSS import는 전역이다

일반 `.css` 파일은 어느 JavaScript 파일에서 import하든 **문서 전체**에 적용된다. `main.jsx`에서 가져오든 `Layout.jsx`에서 가져오든 선택자 `header`는 문서의 모든 `header`에 맞는다. import 위치는 "어느 컴포넌트에만 적용"이 아니라 "이 모듈이 로드될 때 스타일도 함께 로드"라는 뜻이다. 컴포넌트 단위로 이름 충돌을 막으려면 CSS Modules(아래 대안) 같은 별도 방식이 필요하다.

### 2.4 className

React에서 HTML의 `class` 속성은 `className` prop으로 쓴다([React 공통 컴포넌트 — CSS 스타일 적용](https://react.dev/reference/react-dom/components/common#applying-css-styles)). 이번 단계는 `body`·`header`·`main`·`button` 같은 요소 선택자만으로 충분한 범위라 **className을 추가하지 않았다.** 컴포넌트 소스(`Layout`·`SiteHeader`·`HomePage`)는 바꾸지 않았다.

## 3. 기존 방식과 대안 비교

React 공식 문서는 CSS 파일을 추가하는 방법을 정하지 않으며, 가장 단순한 경우 HTML의 `<link>`를 쓰고 빌드 도구를 쓰면 그 문서를 따르라고 안내한다([React 공통 컴포넌트](https://react.dev/reference/react-dom/components/common#applying-css-styles)). 따라서 아래 방식 중 어느 것도 React가 강제하는 것은 아니다.

| 방식 | 가능 여부 | 필요한 추가 작업·제약 | 이번 선택 |
| --- | --- | --- | --- |
| `index.html`의 `<link rel="stylesheet" href="/src/styles/global.css">` | 가능 | Vite는 `index.html`을 모듈 그래프의 일부로 처리하며 `<link href>`로 참조한 CSS도 Vite 기능을 적용받는다([Vite 시작하기 — index.html과 프로젝트 루트](https://vite.dev/guide/#index-html-and-project-root)). 추가 설정은 없다. | 미선택 |
| `public/`에 CSS를 두고 `<link href="/global.css">` | 가능 | `public` 파일은 변환 없이 루트 경로로 그대로 제공·복사된다([Vite 정적 에셋 — public 디렉터리](https://vite.dev/guide/assets.html#the-public-directory)). 소스 경로 `src/styles` 규칙과 어긋난다. | 미선택 |
| JavaScript에서 `import './styles/global.css'` | 가능 | Vite 기본 기능이라 패키지·설정·플러그인이 필요 없다. | **선택** |
| JSX `style` 속성(인라인 스타일) | 가능 | 값이 JavaScript 변수에 따라 바뀔 때 권장되고, 그 외에는 className이 더 효율적이라고 안내된다(React 공통 컴포넌트). 일반 CSS 파일을 쓰기로 한 결정과 맞지 않는다. | 미선택 |
| CSS Modules(`*.module.css`) | 가능 | 파일 이름 규칙만 지키면 되지만 import가 클래스 이름 객체를 반환해 `className={styles.x}`로 써야 하는 새 개념이 추가된다(Vite 기능 — CSS Modules). | 미선택 |
| Sass 등 전처리기 | 가능 | 전처리기 패키지 설치가 필요하다(Vite 기능 — CSS Pre-processors). 패키지 추가 금지 범위. | 미선택 |
| `?inline` import | 가능 | 자동 주입 없이 CSS 문자열만 받는다(Vite 기능 — Disabling CSS injection). 직접 넣는 코드가 추가로 필요하다. | 미선택 |
| CSS-in-JS 라이브러리 | 가능 | 별도 패키지가 필요하고 기술 구성(일반 CSS)과 다르다. | 미선택 |

`<link>` 방식은 **불가능해서가 아니라 선택하지 않은 것**이다. 두 방식 모두 개발 서버에서 같은 CSS를 적용할 수 있다. 차이는 연결 정보가 어디에 있느냐다.

| 비교 | HTML `<link>`(일반적인 방식) | 이번 JavaScript import |
| --- | --- | --- |
| 연결을 적는 곳 | HTML 문서의 `<head>` | 진입 모듈 `src/main.jsx`의 import 목록 |
| 브라우저가 받는 것 | CSS 파일 자체(스타일시트 요청) | 개발 서버에서는 CSS를 `<style>`로 넣는 JavaScript 모듈 |
| 페이지에 생기는 요소 | `<link rel="stylesheet">` | `<head>`의 `<style data-vite-dev-id>`(이번 검증에서 `link` stylesheet 0개) |
| 번들러 없이 동작 | 동작한다 | 동작하지 않는다(Vite 같은 도구가 필요) |

## 4. 선택 이유

- **스타일 연결이 코드 의존 관계에 드러난다.** `main.jsx`의 import 목록만 보면 앱이 어떤 컴포넌트와 스타일을 쓰는지 한곳에서 보인다. `index.html`은 `#root`와 진입 스크립트만 두는 현재 역할을 유지한다.
- **이후 단계와 이어진다.** 앞으로 컴포넌트가 늘어 전용 CSS가 필요해지면 같은 문법으로 해당 컴포넌트 파일에서 import할 수 있다. 단, 2.3처럼 전역 적용이라는 점은 그대로다.
- **추가 비용이 없다.** Vite 기본 기능이라 `package.json`·Vite 설정·플러그인을 바꾸지 않았다.
- **일반 CSS 결정을 유지한다.** 파일 내용은 브라우저 표준 CSS 그대로다.

## 5. 수행 순서

1. **학습자료 작성**: 이 문서의 1~4절과 [자료 목록](README.md) 링크.
2. **CSS 파일 생성**: `src/styles/global.css`를 새로 만들고 요소 선택자 최소 규칙만 두었다(6절). transition은 넣지 않았다.
3. **진입 파일에서 import**: `src/main.jsx`의 기존 import 아래에 `import './styles/global.css';`와 개발 서버에서 `<style>`로 주입된다는 주석을 추가했다. [`index.html`](../../index.html)·패키지·Vite 설정·컴포넌트 소스는 바꾸지 않았고 기존 state·이벤트·children 동작도 그대로다.
4. **브라우저 검증**: 8절.
5. **자료 보완**: 검토된 변경과 검증 결과를 이 문서에 반영.

## 6. 실제 적용

[`src/styles/global.css`](../../src/styles/global.css)의 규칙은 다섯 개다.

| 선택자 | 규칙 | 목적 |
| --- | --- | --- |
| `body` | `margin: 0`, `font-family: system-ui, sans-serif`, `line-height: 1.5`, `color: #222` | 기본 8px 여백 제거, 글꼴·줄 높이·글자색 통일 |
| `header` | `padding: 12px 24px`, `border-bottom: 1px solid #ddd`, `background-color: #f5f5f5` | 헤더 영역과 본문 구분 |
| `header p` | `margin: 0`, `font-weight: bold` | 헤더 문구의 기본 `p` 여백 제거 |
| `main` | `max-width: 720px`, `padding: 0 24px 24px` | 본문 너비 제한과 좌우·아래 여백 |
| `button` | `margin-right: 8px`, `padding: 6px 12px` | 버튼 사이 간격과 누르기 쉬운 크기 |

`src/main.jsx`의 변경은 import 한 줄과 그 위 주석 한 줄뿐이다. 값을 받지 않으므로 이후 코드(`createRoot`·`<Layout><HomePage /></Layout>`)는 그대로다.

## 7. 실행 흐름

1. 브라우저가 `main.jsx`를 실행하면 import 순서대로 `Layout`·`HomePage`·`global.css` 모듈을 가져온다.
2. `global.css` 모듈이 실행되어 `<head>`에 `<style>`이 하나 생긴다. 이 시점에는 스타일 규칙만 등록된다.
3. `root.render`가 `header`·`main`·버튼을 그리면 브라우저가 이미 등록된 요소 선택자 규칙을 맞춰 계산 스타일을 정한다.
4. 버튼 클릭 → `setVisibleCount` → HomePage 다시 렌더링 흐름은 이전 단계와 같다. `<style>`은 React가 관리하는 `#root` 밖(`<head>`)에 있으므로 다시 렌더링되어도 그대로이고, 새로 생긴 요소(빈 안내 `p` 등)에도 같은 전역 규칙이 적용된다.

## 8. 확인 결과

2026-09-30, Node.js `v24.18.1`, Vite `v8.3.1` 개발 서버(포트 5222, 스크립트가 시작·종료), Playwright Chromium, 뷰포트 1280×800. 스크린샷 없음. 시나리오별 선택 실행(`render`·`state`·`links`). 구현 검증 뒤 소스는 주석 문구만 보완(기능 변경 없음)되어 브라우저 결과를 재사용했고, 자료 보완 뒤에는 `links`만 다시 실행했다.

| 시나리오 | 결과 | 확인 내용 |
| --- | --- | --- |
| render | 16/16 통과 | `index.html`에 stylesheet `link` 없음. 변환된 `main.jsx`에 `import "/src/styles/global.css";` 유지. `/src/styles/global.css` 응답 200·`text/javascript`·요청 종류 `script`, 응답에 CSS 규칙과 style 주입 코드 포함·transition 없음. `<head>`에 `data-vite-dev-id`가 global.css인 `<style>` 1개, `link` stylesheet 0개. 계산 스타일·박스(아래 표). 레이아웃 header+main·h1 1개 유지, 초기 li 2개·`3개 중 2개 표시`, 최초 alert 0회, console error/warning·pageerror 0건, 서버 종료 |
| state | 7/7 통과 | 초기 2 → 전체 보기 3 → 목록 비우기 0(안내 문구 표시, 720×24) → 2개 보기 2. 전환 중 `<style>` 1개와 header x 0·폭 1280 유지. 2개·빈·3개 상태에서 alert 3건 모두 `현재 학습 기록은 3개입니다.` 빈 상태에서 새로고침 → 초기 2개·CSS 재적용·추가 alert 없음·URL 유지. 오류 0건, 서버 종료 |
| links | 3/3 통과 | 이 문서와 자료 목록의 로컬 링크 대상 존재, 목록의 023 행과 링크 존재 |

render에서 확인한 계산 스타일·박스는 다음과 같다.

| 요소 | 계산값·박스 | 해석 |
| --- | --- | --- |
| `body` | margin 0, `system-ui, sans-serif`, line-height 24px, color `rgb(34, 34, 34)` | 16px 글꼴 × 1.5 = 24px. `#222` = rgb(34, 34, 34) |
| `header` | x 0·y 0, 1280×49, padding 12px/24px, 하단 1px solid `rgb(221, 221, 221)`, 배경 `rgb(245, 245, 245)` | body 여백이 사라져 화면 가장자리에 붙음. 높이 49 = 12 + 줄 높이 24 + 12 + 선 1 |
| `header p` | margin 0, font-weight 700 | `bold` = 700 |
| `main` | x 0·y 70.4375, 폭 768, max-width 720px, padding 좌우 24px·아래 24px | 기본 `box-sizing: content-box`라 폭 = 콘텐츠 720 + 좌우 패딩 48 |
| 버튼 4개 | x 24·112·196·296, 폭 80·76·92·96, 높이 31, margin-right 8px, padding 6px/12px, transition 0s | 앞 버튼 x + 폭 + 8 = 다음 버튼 x. 간격이 정확히 8px |

main의 y가 header 높이(49)보다 약 21.4 큰 것은 `main`에 위쪽 패딩이 없어 안쪽 h1의 기본 위 여백이 `main` 바깥으로 겹쳐 나온 결과(마진 상쇄)로 해석된다. h1의 y도 main과 같은 70.4375였다.

## 9. 남은 확인

- HMR로 CSS가 교체되는지와 프로덕션 빌드의 CSS 추출(별도 파일)은 확인하지 않았다(빌드는 55단계).
- 문서 링크의 앵커(`#…`) 정확성은 확인하지 않았다.

## 참고자료

- [Vite 기능 — CSS](https://vite.dev/guide/features.html#css) (v8.3.1 표기, 2026-09-30 확인)
- [Vite 시작하기 — index.html과 프로젝트 루트](https://vite.dev/guide/#index-html-and-project-root)
- [Vite 정적 에셋 — public 디렉터리](https://vite.dev/guide/assets.html#the-public-directory)
- [React 공통 컴포넌트 — CSS 스타일 적용](https://react.dev/reference/react-dom/components/common#applying-css-styles)
- [MDN import — 부수 효과만을 위한 import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#import_a_module_for_its_side_effects_only)
