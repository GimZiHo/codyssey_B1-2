# 011 — React 루트: HTML의 한 요소를 React에 맡긴다

정규 단계 10(React 루트, `변경`)의 학습자료다. 1~4절은 **구현 전에** 작성한 설명과 계획이고, 실제 설치 결과·변경 내용·브라우저 검증 결과는 검토를 마친 뒤 [5. 실제 적용 결과](#5-실제-적용-결과)에 기록했다.

- 이전 단계: [009 — 최소 npm·Vite 환경](009-minimal-vite-setup.md), [010 — JavaScript 모듈](010-javascript-modules.md)
- React를 쓰는 이유 자체는 [002 — React의 역할](002-react-role.md)에서 다뤘다.

## 1. 현재 문제

현재 `index.html`은 제목을 HTML에 직접 적어 두었다.

```html
<body>
  <h1>학습 기록 서비스</h1>
</body>
```

`npm run dev`로 Vite 개발 서버에서 이 파일을 보여 주는 데까지는 성공했다(08 단계). 하지만 이 화면에는 JavaScript가 전혀 없고, React도 설치되어 있지 않다. 앞으로 목록·상세·폼처럼 **데이터에 따라 바뀌는 화면**을 React로 그리려면, 먼저 다음 두 가지가 필요하다.

1. React 패키지가 프로젝트에 설치되어 있어야 한다.
2. HTML 문서의 어느 부분을 React가 관리할지 정하고, 그 안에 React가 화면을 그리도록 연결해야 한다.

이 "React가 관리하는 DOM 영역의 시작점"이 **React 루트(root)** 다. 이번 단계는 제목 한 줄을 HTML 직접 작성 대신 React 루트에서 그리도록 바꾸는 것까지만 한다.

## 2. 핵심 개념

### 용어

- **DOM 노드**: 브라우저가 HTML을 읽어 만든 요소 객체. `document.getElementById('root')`가 돌려주는 값이 DOM 노드다.
- **React 요소(element)**: "이런 화면을 그려 달라"는 설명을 담은 **평범한 JavaScript 객체**. 실제 DOM 노드가 아니다.
- **React 루트**: `createRoot`로 만든 객체. 지정한 DOM 노드 **안쪽**을 React가 관리한다.
- **렌더링(render)**: React 요소(설명)를 보고 React가 실제 DOM을 만들거나 고치는 일.

### 두 패키지의 역할

| 패키지 | 이번에 사용하는 기능 | 역할 |
| --- | --- | --- |
| `react` | `createElement` | 화면 설명(React 요소)을 만든다. 브라우저와 무관한 핵심 라이브러리다. |
| `react-dom` | `createRoot` (`react-dom/client` 경로) | React 요소를 **브라우저 DOM**에 반영한다. |

두 패키지가 나뉜 이유는 "무엇을 그릴지(react)"와 "어디에 어떻게 그릴지(react-dom)"를 분리하기 위해서다. `react-dom` 19.3.0은 `peerDependencies`로 `react ^19.3.0`을 요구하므로 **두 패키지의 버전을 맞춰 함께** 설치한다(작성 시점 `npm view` 확인).

### `createRoot(domNode, options?)`

- 인자
  - `domNode`: React가 루트를 만들고 **그 안의 DOM을 관리할** HTML 요소.
  - `options`(선택): 오류 콜백·`useId` 접두사 등. 이번 단계에서는 사용하지 않는다.
- 반환값: `render`와 `unmount` 두 메서드를 가진 루트 객체.
- `root.render(reactNode)`: 전달한 React 노드(요소·문자열·숫자·`null` 등)를 루트에 표시한다. 반환값은 `undefined`다. 공식 문서에 따르면 **처음 `render`를 호출할 때 루트 안에 있던 기존 HTML은 모두 지워진다.**
- `root.unmount()`: 렌더링한 트리를 제거한다. 이번 단계에서는 사용하지 않는다.
- React로만 만든 앱은 보통 **`createRoot`를 한 번만** 호출한다.

### `createElement(type, props, ...children)`

- `type`: 태그 이름 문자열(`'h1'`) 또는 컴포넌트.
- `props`: 속성 객체 또는 `null`(빈 객체와 같다).
- `...children`: 0개 이상의 자식. 문자열·숫자·다른 React 요소 등.
- 반환값: `type`·`props`·`key`·`ref`를 가진 **React 요소 객체**. 만든 뒤에는 내용을 바꾸지 말아야 한다(불변으로 취급).

즉 다음 한 줄은 DOM을 직접 만드는 것이 아니라 "`h1` 태그에 '학습 기록 서비스'라는 글자를 넣은 화면"이라는 **설명 객체**를 만든다.

```js
createElement('h1', null, '학습 기록 서비스')
// 대략 { type: 'h1', props: { children: '학습 기록 서비스' }, key: null, ref: null, ... }
```

이후 단계에서 쓸 JSX(`<h1>학습 기록 서비스</h1>`)는 결국 이 `createElement` 호출과 같은 결과를 만드는 **문법**이다. JSX는 브라우저가 직접 읽지 못해 변환 설정이 필요하므로 11~13 단계에서 다룬다. 이번에는 변환 없이 동작하는 `createElement`를 직접 호출한다.

### 전체 흐름

```text
브라우저가 index.html 요청
  → <div id="root"></div>와 <script type="module" src="/src/main.js"> 읽음
  → Vite가 main.js의 'react', 'react-dom/client' import를 node_modules 패키지로 해석(010 자료 참고)
  → createRoot(#root 노드) : #root 안쪽을 React가 관리하기 시작
  → createElement('h1', null, '학습 기록 서비스') : 화면 설명 객체 생성
  → root.render(설명) : React가 #root 안에 실제 <h1> DOM을 만든다
```

## 3. 기존 방식과 대안

| 방식 | 가능 여부 | 필요한 추가 설정·제약 | 이번 선택 |
| --- | --- | --- | --- |
| A. 지금처럼 HTML에 `<h1>` 직접 작성 | 가능 | React가 전혀 관여하지 않아 이후 상태에 따른 갱신을 React로 할 수 없다. | 단계 목표(React 루트) 미충족으로 선택하지 않음 |
| B. `<script>`로 React를 CDN에서 불러오기(UMD) | **React 19에서 불가** | React 19부터 UMD 빌드를 배포하지 않는다(공식 업그레이드 가이드). | 불가능 |
| C. ESM CDN(예: esm.sh)에서 `import` | 가능 | 공식 가이드가 script 태그 방식의 대안으로 소개. 외부 CDN에 의존하고 npm 잠금 파일로 버전이 기록되지 않는다. | 이미 npm·Vite를 선택(08 단계)했으므로 선택하지 않음 |
| D. `ReactDOM.render(요소, 노드)` | **React 19에서 불가** | 18.0.0에서 폐기 예고, 19에서 제거. React 18에서는 경고와 함께 동작했지만 18 이상 요구에 맞는 방식이 아니다. | 불가능 |
| E. `hydrateRoot` | 가능하지만 해당 없음 | 서버가 미리 만든 HTML에 React를 붙일 때 쓴다. 이 프로젝트는 서버 렌더링을 하지 않는다. | 선택하지 않음 |
| F. JSX로 작성(`main.jsx`) | 가능 | JSX 변환 설정이 필요하며 11~13 단계의 별도 개념이다. | 이번 단계 범위 밖 |
| G. `npm install` + `createRoot` + `createElement` | 가능 | 변환 설정 없이 현재 Vite 개발 서버에서 동작한다(5절 검증 결과). | **선택** |

### React 18과 19

과제 조건은 "React 18 이상"이다. 18과 19 모두 `createRoot`를 제공하므로 둘 다 조건을 만족한다. 작성 시점 npm 최신 안정 버전이 19.3.0이고 이 프로젝트는 폐기된 API를 쓰지 않으므로, 18로 고정할 필요가 없어 최신 버전을 설치한다. React 19를 설치하는 것이 필수라는 뜻은 아니다.

### 세부 결정

- **`dependencies`에 설치**: Vite는 개발 도구라 `devDependencies`에 두었지만(08 단계), React는 사용자 브라우저에서 실제로 실행되는 코드이므로 `dependencies`에 둔다. 배포 빌드 도구가 포함 여부를 이 분류로 정하지는 않지만, 역할을 구분해 기록하는 관례를 따른다.
- **루트 요소를 비워 둔다**: 공식 문서대로 첫 `render`에서 루트 안의 기존 HTML은 지워진다. `<div id="root"><h1>…</h1></div>`처럼 남겨 두어도 동작하지만, 제목이 HTML과 JavaScript 두 곳에 중복되고 어느 쪽이 표시되는지 헷갈리므로 빈 `div`만 둔다. `id="root"`라는 이름은 관례일 뿐 필수는 아니다.
- **파일 이름 `src/main.js`**: JSX가 없으므로 `.jsx` 확장자가 필요 없다. `src/` 아래에 둔 것은 프로젝트 소스 경로 규칙을 따른 것이다.
- **`StrictMode`는 넣지 않는다**: 개발 중 추가 검사를 켜는 별도 기능이라 새 개념을 늘리지 않기 위해 이번에는 제외한다.
- **`<title>`은 HTML에 남긴다**: 탭 제목은 React 루트 밖(`<head>`)에 있으므로 이번 변경 대상이 아니다. 화면의 `<h1>`만 React로 옮긴다.

## 4. 작업 순서(구현 전 작성한 계획)

자료 작성 → 설치 → 소스 변경 → 브라우저 검증 → 검토 → 이 문서 보완 순서로 진행했다. 아래 "(예정)"은 작성 시점 표기이며, 실제 수행 결과는 5절에 있다.

1. **환경 확인**: `command -v node npm`, `node --version`, `npm --version`, `npm view react ...`/`npm view react-dom ...`로 호환성 확인. (작성 시점 확인값: Node.js `v24.18.1`, npm `11.16.0`, react/react-dom 최신 `19.3.0`, react의 `engines.node`는 `>=0.10.0`.)
2. **설치(예정)**: 프로젝트 루트에서 `npm install react react-dom`.
   - 변경될 파일: `package.json`(`dependencies` 추가), `package-lock.json`(설치 트리 갱신), `node_modules/`(Git 제외).
3. **`index.html` 변경(예정)**: `<h1>`을 빈 루트 요소와 모듈 스크립트로 바꾼다.

   ```html
   <body>
     <div id="root"></div>
     <script type="module" src="/src/main.js"></script>
   </body>
   ```

4. **`src/main.js` 작성(예정)**:

   ```js
   import { createElement } from 'react';
   import { createRoot } from 'react-dom/client';

   const root = createRoot(document.getElementById('root'));
   root.render(createElement('h1', null, '학습 기록 서비스'));
   ```

   - `createElement`, `createRoot` 모두 named export이므로 중괄호로 가져온다([010](010-javascript-modules.md) 참고).
   - `'react-dom/client'`처럼 패키지 이름 뒤에 하위 경로를 붙여 필요한 진입점만 가져온다.

5. **검증(예정)**: `npm run dev` 개발 서버에서 HTTP 응답, 탭 제목·언어·인코딩, `#root` 내부 `h1`의 실제 표시(계산된 스타일·박스 크기), 새로고침 후 재표시, 콘솔·페이지 오류 없음, 서버 종료를 확인한다.

이번 단계에서 하지 않는 것: JSX, 컴포넌트 분리, state, 빌드 스크립트, Vite 설정 파일.

## 5. 실제 적용 결과

4절 계획대로 적용했고, 검토에서 결함은 발견되지 않았다.

### 변경 파일

| 파일 | 변경 내용 |
| --- | --- |
| `package.json` | `dependencies`에 `react: ^19.3.0`, `react-dom: ^19.3.0` 추가. 기존 `devDependencies`의 `vite`와 `scripts.dev`는 그대로다. |
| `package-lock.json` | `node_modules/react` 19.3.0, `node_modules/react-dom` 19.3.0, `node_modules/scheduler` 0.28.0 항목 추가 |
| `index.html` | `<body>`의 `<h1>학습 기록 서비스</h1>`을 `<div id="root"></div>`와 `<script type="module" src="/src/main.js"></script>`로 교체. `<head>`의 `<title>`·`lang`·`charset`은 그대로다. |
| `src/main.js` | 새 파일. 4절 코드(import 2줄, 루트 생성, `render`)에 역할 주석 2줄을 더한 7줄 |
| `node_modules/` | 설치 결과. Git 제외 대상([007](007-node-modules-role.md)) |

`scheduler`는 직접 설치하지 않았다. 잠금 파일에서 `react-dom`의 `dependencies`가 `scheduler: ^0.28.0`을 요구하므로 npm이 함께 설치한 **간접 의존성**이다(`package.json`에는 나타나지 않는다). 같은 항목의 `peerDependencies`에 `react: ^19.3.0`이 기록되어 있어, 2절에서 말한 버전 맞춤 조건도 잠금 파일로 확인된다.

실제 `src/main.js`:

```js
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

// React 루트: #root 안쪽 DOM을 React가 관리한다.
const root = createRoot(document.getElementById('root'));
// JSX 변환 없이 React 요소(화면 설명 객체)를 직접 만들어 렌더링한다.
root.render(createElement('h1', null, '학습 기록 서비스'));
```

### 환경과 호환성

- Node.js `v24.18.1`, npm `11.16.0`, Vite `8.3.1`
- react·react-dom `19.3.0`(과제 조건 "React 18 이상" 충족), react의 `engines.node`는 `>=0.10.0`이라 현재 Node.js와 호환된다.
- `npm audit`: 알려진 취약점 0건

### 브라우저 검증

`npm run dev`로 Vite 개발 서버를 띄우고 Playwright 1.63.0 Chromium headless shell(창 크기 1280×800)로 확인했다. 총 7건 통과, 0건 실패다.

| 확인 항목 | 실제 결과 |
| --- | --- |
| `index.html` 응답 | HTTP 200, `text/html` |
| `/src/main.js` 응답 | HTTP 200, `text/javascript` |
| 탭 제목·언어·인코딩 | `학습 기록 서비스`, `ko`, `UTF-8` — HTML에 남긴 `<title>`이 그대로 동작 |
| `#root` 안 제목 | `#root` 자식 1개, 문서 전체 `h1` 1개, 글자 `학습 기록 서비스` |
| 실제 표시 여부 | 계산된 스타일 `display: block`, `visibility: visible`, `opacity: 1`, `font-size: 32px`, `font-weight: 700`, 박스 1264×38px |
| 새로고침 후 | 위와 같은 값으로 다시 표시 |
| 콘솔·페이지 오류 | 없음 |
| 서버 종료 | 종료 후 접속 거부, 프로세스 그룹 없음 |

읽는 법:

- `index.html`의 `#root`는 비어 있는데 브라우저에서 `h1`이 1개 보인다. 즉 이 `h1`은 HTML이 아니라 `main.js`의 `root.render(...)`가 만든 DOM이다. 2절 "전체 흐름"이 실제로 일어났다는 근거다.
- `h1`이 1개뿐이므로 HTML과 JavaScript에 제목이 중복되지 않았다(3절 "루트 요소를 비워 둔다").
- `main.js`가 `text/javascript`로 응답되고 오류가 없으므로, 브라우저가 직접 읽지 못하는 `'react'`·`'react-dom/client'` 같은 패키지 이름 import를 Vite가 해석해 주었다([010](010-javascript-modules.md)).
- 박스 너비 1264px는 창 너비 1280px에서 `body` 기본 여백(좌우 8px)을 뺀 값이고, 32px·700은 브라우저 기본 `h1` 스타일이다. 별도 CSS 없이 일반 `h1`으로 그려졌다.

### 남은 확인

- 이번 검증은 자동화된 Chromium 한 가지다. 다른 브라우저에서의 표시는 확인하지 않았다.
- 배포 빌드(`vite build`)는 아직 scripts에 없으며 이번 범위가 아니다.

## 6. 참고자료

- React 공식 문서, [createRoot](https://react.dev/reference/react-dom/client/createRoot) — 인자·반환값, 첫 `render`에서 기존 HTML 제거, 앱당 보통 한 번 호출.
- React 공식 문서, [createElement](https://react.dev/reference/react/createElement) — 인자·반환 요소 객체, 불변 취급, JSX 없이 요소 만들기.
- React 공식 블로그, [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide) — UMD 빌드 제거와 ESM CDN 대안, `ReactDOM.render` 제거와 `createRoot` 전환.
- 2026-09-27 공식 문서 확인, `npm view`로 react·react-dom 19.3.0 메타데이터 확인.
