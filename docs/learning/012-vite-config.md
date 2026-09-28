# 012. Vite 설정 파일

> 정규 단계 11 · 설명 단계. 설치·소스 변경·설정 파일 생성·서버 실행을 하지 않았다. 아래 코드와 명령은 모두 **미실행 예시**다.

## 학습 목적

지금 프로젝트는 Vite 설정 파일 없이 `npm run dev`로 동작한다([009](009-minimal-vite-setup.md), [011](011-react-root.md)). 앞으로 JSX를 쓰려고 할 때 "설정 파일이 꼭 있어야 하는가, 있다면 어디에 무엇을 적는가, 무엇은 기본값으로 둘 것인가"를 판단할 수 있게 한다.

## 현재 상태와 문제

| 항목 | 현재 값 |
| --- | --- |
| Vite | `8.3.1` (`node_modules/vite/package.json`) |
| `package.json` | `"dev": "vite"`만 있음, `type` 필드 없음 |
| 설정 파일 | 없음 (`vite.config.*` 파일 없음) |
| 진입 | `index.html` → `<script type="module" src="/src/main.js">` |
| 화면 코드 | `src/main.js`에서 `createRoot`·`createElement`로 제목 표시, JSX 없음 |

지금까지는 Vite의 기본 동작만으로 충분했다. 다음 단계들(12 플러그인, 13 JSX)에서 JSX 변환을 도입하므로, 그때 설정이 필요한지 판단할 기준이 필요하다.

## 핵심 개념: 설정 파일은 기본값을 바꾸고 싶을 때 쓰는 선택 파일이다

- **설정 파일**: Vite가 시작할 때 읽어 들이는 JavaScript 모듈이다. 기본으로 내보낸(`export default`) 객체의 옵션으로 Vite의 기본 동작을 바꾸거나 플러그인을 등록한다.
- **없어도 된다**: `vite` 명령은 프로젝트 루트에서 설정 파일을 찾아보고, 없으면 기본값으로 실행한다. 설치된 Vite 8.3.1 구현(`node_modules/vite/dist/node/chunks/node.js`)도 설정 파일을 찾지 못하면 디버그 메시지 `no config file found.`만 남기고 설정 없이 진행한다. 현재 프로젝트가 설정 없이 동작하는 이유다.
- **적지 않은 옵션은 기본값**: 설정 파일을 만들더라도 적은 옵션만 바뀌고 나머지는 기본값을 그대로 쓴다. 그래서 설정 파일에는 "현재 문제를 해결하는 데 필요한 옵션"만 적으면 된다.

### 둘 위치와 이름

- 공식 문서: `vite` 명령은 프로젝트 루트에서 `vite.config.js`를 자동으로 찾고, 다른 JS·TS 확장자도 지원한다.
- 설치된 8.3.1 구현의 자동 탐색 순서: `vite.config.js` → `.mjs` → `.ts` → `.cjs` → `.mts` → `.cts`.
- 이 프로젝트의 루트는 `package.json`·`index.html`이 있는 작업트리 최상위다. 설정 파일을 만든다면 그 옆에 둔다(`src/` 안이 아니다).
- 다른 이름·위치를 쓰려면 `vite --config my-config.js`처럼 명시한다(경로는 명령을 실행한 폴더 기준).

### 파일 형식(ESM)과 현재 package.json

- 설정 파일은 보통 `import`/`export default`를 쓰는 ES 모듈(ESM, [010](010-javascript-modules.md)) 문법으로 작성한다.
- 공식 문서는 ESM 문법을 쓰려면 Node.js가 ESM으로 인식하는 파일, 즉 **`.mjs`** 또는 **가장 가까운 `package.json`에 `"type": "module"`이 있는 `.js`**를 쓰라고 안내한다.
- 현재 `package.json`에는 `type`이 없으므로 Node.js는 `.js`를 CommonJS로 본다. 따라서 문서 기준을 따르면 두 가지 중 하나가 필요하다.
  - `vite.config.mjs`로 만든다 → `package.json` 변경 없음.
  - `package.json`에 `"type": "module"`을 추가하고 `vite.config.js`로 만든다 → 프로젝트의 다른 `.js` 해석에도 영향을 주는 변경이다.
- 참고: 8.3.1 구현은 설정 파일을 먼저 번들링한 뒤 ESM 여부에 따라 ESM 또는 CommonJS 형식으로 불러온다. `type` 없이 `vite.config.js`에 ESM 문법을 써도 동작하는지는 이 프로젝트에서 실행 확인하지 않았으므로 문서 기준을 따른다.

### `defineConfig`

`vite` 패키지가 제공하는 도우미 함수다. 받은 설정 객체를 그대로 돌려주며, 편집기가 옵션 이름·타입을 자동완성하도록 돕는 역할만 한다. 쓰지 않고 객체를 바로 `export default` 해도 된다.

```js
// vite.config.mjs — 미실행 예시. 옵션이 비어 있으므로 동작은 설정 파일이 없을 때와 같다.
import { defineConfig } from 'vite';

export default defineConfig({
  // 필요한 옵션만 여기에 추가한다. 적지 않은 옵션은 기본값을 쓴다.
});
```

## JSX와 설정 파일의 관계

- 공식 문서(Features › JSX): `.jsx`·`.tsx` 파일은 **별도 설정 없이 기본 지원**되며, Vite 8에서는 Oxc 변환기가 JSX를 변환한다. 공식 React 플러그인(`@vitejs/plugin-react`)은 여기에 HMR 등 React 전용 기능을 더하는 선택지로 소개된다.
- 설치된 8.3.1 구현(`oxcPlugin`)의 기본 변환 대상은 `.ts`·`.mts`·`.jsx`·`.tsx`이고 **`.js`는 제외**된다. 즉 지금의 `src/main.js`에 JSX를 그대로 쓰면 기본 설정으로는 변환 대상이 아니다. JSX가 들어갈 파일을 `.jsx`로 두면 설정 파일 없이도 기본 변환 대상이 되고, `.js`를 유지하려면 설정으로 변환 대상을 바꾸는 등 추가 설정이 필요하다.
- 따라서 "JSX를 쓰려면 설정 파일이나 React 플러그인이 반드시 필요하다"고 단정할 수 없다. 설정 파일은 기본값으로 해결되지 않는 요구(예: 플러그인 등록, 변환 대상·JSX 옵션 변경)가 생길 때 만든다. 플러그인이 실제로 필요한지는 12단계, JSX 파일 구성과 적용은 13단계에서 결정한다.

## 방법 비교

| 방법 | 가능 여부 | 필요한 추가 설정·제약 | 이번 선택 |
| --- | --- | --- | --- |
| 설정 없음(현재) | 가능. 현재 실행 방식 그대로 | 기본값만 쓸 수 있다. JSX는 `.jsx` 등 기본 변환 대상 파일에서 가능 | **유지**. 지금 바꿔야 할 기본값이 없다 |
| CLI 옵션 | 일부 가능. `--port`·`--host`·`--base`·`--mode`·`--config` 등 | `package.json` scripts 문자열이 길어지고, 공식 CLI 옵션 목록에 플러그인 등록·JSX 변환 옵션은 없다 | 선택 안 함. 지금 바꿀 서버 옵션이 없다 |
| 설정 파일 | 가능. 모든 설정 옵션·플러그인 등록 | 루트에 파일 추가, 현재 `package.json` 기준 `.mjs` 또는 `type: module` 결정 필요 | 지금은 만들지 않음. 12·13단계에서 필요할 때만 만든다 |

## B1-1 방식과의 관계

B1-1은 빌드 도구 없이 브라우저가 파일을 직접 읽었으므로 도구 설정 파일이라는 개념이 없었다. B1-2는 Vite를 쓰지만 현재까지는 설정 없이 기본값만으로 실행되므로, B1-1처럼 "설정할 것이 없는" 상태를 계속 유지할 수 있다. 달라지는 점은 도구의 기본값을 바꿔야 할 이유가 생겼을 때 설정 파일로 바꿀 수 있다는 것이다.

## 실제 작업 순서

| 단계 | 내용 | 파일 변화 |
| --- | --- | --- |
| 11 (현재, 설명) | 설정 파일의 역할·위치·기본값 유지 범위를 정리 | 이 자료와 목록만 추가. 설정 파일 없음 유지 |
| 12 (설명) | 선택한 JSX 변환 구성에서 플러그인이 필요한지 판단 | 설치·설정 없음 |
| 13 (변경) | 화면을 JSX로 옮기고, 필요한 변환 설정만 추가 | 필요할 때만 루트에 설정 파일 생성(형식은 위 ESM 조건에 따라 결정) |

## 확인 결과

- 실행 검증: 해당 없음(설명 단계). 설치·설정 생성·서버/브라우저 실행을 하지 않았다.
- 확인한 근거: 공식 문서 3건(아래 참고자료), 설치된 `vite@8.3.1`의 설정 파일 탐색 목록·설정 없음 처리·Oxc 기본 변환 대상 구현 부분 읽기.

## 남은 확인

- `type` 없는 현재 `package.json`에서 ESM 문법 `vite.config.js`가 실제로 불러와지는지는 미확인이다. 문서 기준(`.mjs` 또는 `type: module`)을 따르면 확인할 필요가 없다.
- `.jsx` 파일의 기본 JSX 변환 결과가 현재 React 19 설정과 맞게 동작하는지는 13단계 실제 적용에서 확인한다.

## 참고자료

- [Vite 공식 문서 — Configuring Vite](https://vite.dev/config/): 설정 파일 자동 탐색, ESM 조건, `--config`, `defineConfig`
- [Vite 공식 문서 — Features › JSX](https://vite.dev/guide/features.html#jsx): `.jsx`·`.tsx` 기본 지원, Oxc 변환, React 플러그인 소개
- [Vite 공식 문서 — Command Line Interface](https://vite.dev/guide/cli): 개발 서버 CLI 옵션 목록
- 이전 자료: [008 Vite 역할](008-vite-role.md), [009 최소 Vite 환경](009-minimal-vite-setup.md), [010 JavaScript 모듈](010-javascript-modules.md), [011 React 루트](011-react-root.md)
