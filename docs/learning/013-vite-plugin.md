# 013. Vite 플러그인 — 기본 JSX 변환과 React 플러그인의 역할 구분

> 단계: 정규 12단계(설명). 설치·소스 변경·설정 파일 생성·실행 검증을 하지 않았다. 이 문서의 명령·코드·설정은 모두 **미실행 예시**다.

## 학습 목적

다음 13단계에서 화면 코드를 JSX로 옮길 때 "Vite 플러그인, 특히 React 플러그인이 꼭 필요한가"를 판단할 수 있게 한다. 판단 기준은 두 가지다.

- JSX를 **변환**하는 일은 누가 하는가 (Vite 기본 기능인가, 플러그인인가)
- 플러그인이 **추가로** 주는 것은 무엇이고, 지금 프로젝트에 그것이 필요한가

## 현재 프로젝트 상태 (2026-09-28 파일 확인)

| 항목 | 상태 |
| --- | --- |
| `package.json` | devDependencies `vite ^8.3.1`, dependencies `react`·`react-dom ^19.3.0`, `scripts.dev: vite`. 플러그인 패키지 없음 |
| Vite 설정 파일 | 없음([012](012-vite-config.md)) |
| `index.html` | `<div id="root">`와 `<script type="module" src="/src/main.js">` |
| `src/main.js` | `createRoot`·`createElement`로 `<h1>학습 기록 서비스</h1>`를 표시. JSX 없음([011](011-react-root.md)) |

## 핵심 개념

### Vite 플러그인이란

- **플러그인**: Vite가 파일을 읽고 변환하고 묶는 과정의 중간 지점(hook)에 끼워 넣는 기능 묶음이다. 공식 문서는 "Rollup의 플러그인 인터페이스에 Vite 전용 옵션을 더한 것"이라고 설명한다.
- **사용 방법**(공식 Using Plugins): ① 플러그인 패키지를 `devDependencies`로 설치하고 ② 설정 파일의 `plugins` 배열에 넣는다. 즉 플러그인을 쓰면 **설치 + 설정 파일 생성**이 함께 따라온다.
- `enforce: 'pre' | 'post'`로 Vite 핵심 플러그인 앞뒤 실행 순서를, `apply: 'serve' | 'build'`로 개발 서버·빌드 중 어디에만 적용할지를 정할 수 있다.
- 공식 Plugins 페이지는 플러그인을 찾기 전에 **Features 가이드에서 기본 지원 여부를 먼저 확인하라**고 권한다. 흔한 작업은 이미 기본 기능으로 처리되는 경우가 많기 때문이다.

### Vite 내부에도 "플러그인"이 있다

Vite는 자기 기본 기능도 내부 플러그인으로 구현한다. 설치된 8.3.1 소스(`node_modules/vite/dist/node/chunks/node.js`)의 `oxcPlugin`은 이름이 `vite:oxc`인 **핵심 플러그인**으로, 설정 없이도 항상 동작한다. 따라서 "JSX를 변환하려면 플러그인이 필요하다"는 말은 반만 맞다. 변환은 이 **내장 플러그인**이 하고, 우리가 따로 설치하는 **외부 플러그인**은 필수가 아니다.

## 기본 JSX 변환: 무엇이 이미 되는가

### 공식 근거

- Features › JSX: "`.jsx` and `.tsx` files are also supported out of the box." JSX 변환은 Oxc Transformer가 맡는다.
- Oxc JSX 문서: 기본 런타임은 **automatic**이다. automatic 런타임은 `react/jsx-runtime`에서 필요한 함수를 가져오는 `import`를 **자동으로 넣어 주므로** 파일마다 `import React from 'react'`를 쓸 필요가 없다. React Fast Refresh(`jsx.refresh`)는 **기본으로 꺼져 있다**.

### 설치된 Vite 8.3.1 소스로 확인한 기본값

| 소스 위치(`chunks/node.js`) | 내용 | 의미 |
| --- | --- | --- |
| `oxcPlugin`의 `createFilter$1(include \|\| /\.(m?ts\|[jt]sx)$/, exclude \|\| /\.js$/)` | 기본 변환 대상 `.ts`·`.mts`·`.jsx`·`.tsx`, **`.js` 제외** | 지금의 `src/main.js`에 JSX를 쓰면 변환되지 않는다 |
| `oxcPlugin`의 `jsxImportSource ... \|\| "react"` | JSX 함수를 가져올 기본 패키지 `react` | 설치된 react 19.3.0의 `react/jsx-runtime`을 사용 |
| 설정 해석부의 `oxc.jsx` 기본값 `{ development: !isProduction }` | 런타임을 따로 지정하지 않음 → Oxc 기본값 automatic, `refresh` 지정 없음 | 추가 설정 없이 automatic 변환, Fast Refresh는 꺼짐 |

정리하면 **설정 파일도 플러그인도 없이** `.jsx` 파일 안의 JSX는 `react/jsx-runtime` 호출로 변환된다. 이것은 공식 문서와 설치 소스로 확인한 내용이며, 이 프로젝트에서 실제로 실행해 확인한 결과는 아니다.

## React 플러그인이 추가하는 것

공식 Plugins 페이지와 `@vitejs/plugin-react` README 기준이다(이 프로젝트에는 설치하지 않았다).

| 기능 | 기본 Vite(현재) | `@vitejs/plugin-react` 추가 시 |
| --- | --- | --- |
| `.jsx` JSX 변환 | 가능(Oxc, automatic) | 가능(Oxc, automatic) |
| `.js` 안의 JSX | 기본 제외. 설정 파일로 `oxc.include`/`exclude`를 바꾸면 가능 | 기본 처리 대상에 `.js`·`.jsx`·`.ts`·`.tsx` 포함 |
| **React Fast Refresh** | 없음 | 개발 중 컴포넌트를 수정하면 페이지 새로고침 없이 교체하고 state를 가능한 유지 |
| 필요한 작업 | 없음 | 패키지 설치, 설정 파일 생성과 `plugins: [react()]` 등록 |

- **Fast Refresh**: 개발 서버에서 코드를 고쳤을 때 해당 React 컴포넌트만 바꿔 끼우는 기능이다. 공식 Plugins 페이지는 React 플러그인을 "Oxc Transformer를 통한 React Fast Refresh 지원"으로 소개한다. 즉 이 플러그인의 핵심 추가 역할은 JSX 변환 자체가 아니라 **개발 중 갱신 경험**이다.
- 플러그인이 없을 때: 설치 소스의 HMR 처리부는 변경을 받아 줄 모듈(HMR 경계)이 없으면 `page reload`로 전체 새로고침한다. 현재 `src/main.js`에는 그런 처리가 없으므로 파일 수정 시 전체 새로고침될 것으로 보인다(소스 기반 판단, 이 프로젝트에서 미확인). 전체 새로고침은 화면에 있던 state를 잃지만, **지금은 state가 없다**.
- 다른 공식 React 계열 플러그인: `@vitejs/plugin-react-swc`는 개발 중 변환기를 Oxc 대신 SWC로 바꾸는 선택지로, SWC 전용 플러그인이 필요할 때 쓴다. `@vitejs/plugin-rsc`는 React Server Components용이다. 둘 다 이 프로젝트 요구와 관계없다.

## 대안 비교 — 13단계 JSX 도입 방식

| 대안 | 가능 여부 | 필요한 추가 작업·제약 | 판단 |
| --- | --- | --- | --- |
| A. JSX 파일을 `.jsx`로 두고 기본 변환 사용 | 가능 | `index.html`의 script 경로를 `.jsx` 파일로 맞춤. 설치·설정 파일 없음. Fast Refresh 없음 | **추천** |
| B. `.js`를 유지하고 설정 파일로 `oxc` 변환 대상 변경 | 가능 | 설정 파일 생성(현재 `package.json` 기준 `.mjs` 또는 `type: module` 결정, [012](012-vite-config.md)), 옵션 작성 | 선택 안 함. 확장자만 바꾸면 되는 문제에 설정을 추가하게 된다 |
| C. `@vitejs/plugin-react` 설치·등록 | 가능 | 패키지 설치와 잠금 파일 갱신, 설정 파일 생성. 설치 시 Vite 8.3.1과의 호환(peer 의존성) 확인 필요 | 지금은 선택 안 함. 핵심 추가 기능인 Fast Refresh가 보존할 state가 생기기 전에는 이점이 작다 |
| D. `@vitejs/plugin-react-swc` | 가능 | C와 같은 작업 + SWC 도입 | 선택 안 함. SWC 플러그인이 필요한 요구가 없다 |
| E. JSX 없이 `createElement` 유지 | 가능 | 없음 | 선택 안 함. 13단계 목표가 JSX 도입이다 |
| F. `oxc.jsxInject`로 import 자동 삽입 | 가능하지만 불필요 | 설정 파일 필요 | automatic 런타임이 이미 import를 넣으므로 해결할 문제가 없다 |

불가능한 대안은 없다. B~D는 모두 가능하지만 이번 목표(화면을 JSX로 옮기기)에 비해 추가 작업이 크기 때문에 선택하지 않는다. 플러그인은 **JSX의 필수 조건이 아니다**.

## 다음 13단계 최소 구성 판단

- **추천 구성**: 대안 A. 플러그인 설치 없음, 설정 파일 없음.
- **예상 변경 파일**(미실행 예시, 확정은 13단계):
  - `src/main.js` → JSX를 담은 `.jsx` 진입 파일(예: `src/main.jsx`)로 교체
  - `index.html`의 `<script type="module" src>` 경로를 새 진입 파일로 변경
  - `package.json`·`package-lock.json`·설정 파일은 변경 없음
- **13단계에서 확인할 것**: `.jsx` 파일이 설정 없이 변환되어 기존 제목이 그대로 표시되는지, `react/jsx-runtime` 요청을 포함해 콘솔·요청 오류가 없는지.
- **다시 판단할 시점**: state가 생겨 개발 중 전체 새로고침으로 state가 사라지는 것이 실제 불편이 되거나, `.js` 파일에 JSX를 써야 하는 요구가 생기면 대안 C를 다시 검토한다. 이때 설치 전 호환 버전을 확인한다.

## 이 단계의 실제 수행

- 수행: `package.json`·`index.html`·`src/main.js` 확인, 공식 문서 확인, 설치된 Vite 8.3.1 소스 읽기, 이 자료 작성과 자료 목록 연결.
- 수행하지 않음: 패키지 설치, 설정 파일 생성, 소스 변경, 개발 서버 실행. 실행 검증은 이 단계에 해당하지 않는다.

## 남은 확인

- `.jsx` 기본 변환이 React 19.3.0과 함께 실제로 동작하는지 → 13단계 실제 적용에서 확인.
- 플러그인 없이 파일 수정 시 전체 새로고침되는지 → 소스 기반 판단이며 이 프로젝트에서는 미확인.
- `@vitejs/plugin-react`의 Vite 8.3.1 호환 버전 → 설치하지 않았으므로 미확인. 도입할 때 확인한다.

## 참고자료 (2026-09-28 확인)

- [Vite — Features › JSX](https://vite.dev/guide/features.html#jsx): `.jsx`·`.tsx` 기본 지원, Oxc 변환, `jsxInject`, React 플러그인 소개
- [Vite — Using Plugins](https://vite.dev/guide/using-plugins.html): 플러그인 정의, 설치·`plugins` 등록, `enforce`·`apply`
- [Vite — Plugins](https://vite.dev/plugins/): 기본 지원 먼저 확인 권고, `@vitejs/plugin-react`(Fast Refresh)·`plugin-react-swc`·`plugin-rsc`
- [Oxc — JSX 변환](https://oxc.rs/docs/guide/usage/transformer/jsx.html): 기본 automatic 런타임, 자동 import, `refresh` 기본 꺼짐
- [@vitejs/plugin-react README](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md): Fast Refresh, automatic 런타임, 기본 처리 확장자, 사용 예시
- 설치 소스: `node_modules/vite/dist/node/chunks/node.js`의 `oxcPlugin`, `oxc` 설정 해석부, HMR `page reload` 처리부(Vite 8.3.1)
