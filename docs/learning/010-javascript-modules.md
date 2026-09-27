# 010 — JavaScript 모듈(import/export)

- **단계**: 정규 09단계 — 설명(설치·소스 변경·실행 검증 없음)
- **새 핵심 개념**: JavaScript 모듈 — 파일 단위로 코드를 나누고 `export`로 내보낸 값을 다른 파일에서 `import`로 가져오는 방식
- **이 문서의 코드**: 모두 **아직 실행하지 않은 예시**다. 이번 단계에서 만든 파일이나 실행 결과가 아니다.

## 1. 현재 해결할 문제

현재 프로젝트 상태는 다음과 같다.

- `index.html`: 제목 한 줄(`<h1>학습 기록 서비스</h1>`)만 있는 정적 HTML이며 `<script>`가 없다. ([001](001-index-html.md))
- `package.json`: `private: true`, `scripts.dev: "vite"`, `devDependencies`에 `vite ^8.3.1`만 있다. ([009](009-minimal-vite-setup.md))
- React는 아직 설치하지 않았다.

다음 변경 단계(10단계)에서는 React 패키지를 설치하고 제목을 React로 표시한다. 그러려면 두 가지가 필요하다.

1. `index.html`이 불러올 **JavaScript 진입 파일**(앱 실행이 시작되는 첫 파일)
2. 그 진입 파일이 `node_modules`에 설치된 **React 패키지의 기능을 가져오는 방법**

이후에는 `src/pages`·`src/components`·`src/hooks`·`src/lib`처럼 역할별로 파일을 나눌 예정이다. 파일이 나뉘면 "어느 파일이 무엇을 제공하고, 누가 그것을 쓰는가"를 코드로 표현해야 한다. 이것이 모듈의 `export`/`import`가 맡는 일이다.

## 2. 핵심 개념

MDN은 규모가 커진 프로그램을 필요할 때 가져다 쓸 수 있는 별도 모듈로 나누는 방법이 필요해졌고, 현대 브라우저는 모듈 기능을 기본 지원한다고 설명한다. ([MDN — A background on modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#a_background_on_modules))

모듈에서 기억할 역할은 세 가지다.

| 구성 | 역할 |
| --- | --- |
| `export` | 이 파일이 밖으로 제공할 값·함수를 표시한다. 표시하지 않은 것은 파일 안에만 머문다. |
| `import` | 다른 모듈이 제공한 값·함수를 가져와 이 파일에서 쓴다. |
| 모듈 지정자(module specifier) | `from` 뒤의 문자열. 가져올 모듈이 어디 있는지 JavaScript 실행 환경이 해석할 수 있는 이름·경로다. |

### 2-1. named export와 대응 import

이름을 붙여 여러 개를 내보낼 수 있다. 가져올 때는 **중괄호 `{}`** 안에 내보낸 이름을 그대로 적는다.

```js
// (미실행 예시) format.js
export const siteTitle = '학습 기록 서비스';
export function formatDate(date) {
  return date.toISOString().slice(0, 10);
}
```

```js
// (미실행 예시) 같은 폴더의 main.js
import { siteTitle, formatDate } from './format.js';
```

- 이름이 다르면 가져올 수 없다. 내보낸 쪽의 이름이 곧 약속이다.
- 필요한 것만 골라서 가져올 수 있다(`import { siteTitle } from './format.js'`).

### 2-2. default export와 대응 import

모듈마다 **기본값 하나**를 내보낼 수 있다. MDN은 모듈당 default export는 하나만 허용된다고 설명한다. 가져올 때는 **중괄호 없이** 가져오는 쪽에서 이름을 정한다.

```js
// (미실행 예시) greeting.js
export default function greeting(name) {
  return `안녕하세요, ${name}`;
}
```

```js
// (미실행 예시) main.js
import greeting from './greeting.js';
```

| 구분 | 내보내기 | 가져오기 | 개수 | 이름 |
| --- | --- | --- | --- | --- |
| named | `export const a` / `export function f` / `export { a, f }` | `import { a, f } from '...'` | 여러 개 | 내보낸 이름과 같아야 함 |
| default | `export default 값` | `import 아무이름 from '...'` | 모듈당 하나 | 가져오는 쪽이 정함 |

한 모듈이 둘 다 제공할 수도 있다. 어떤 형태로 제공하는지는 **그 모듈(또는 패키지)이 정한다**. 그래서 패키지를 쓸 때는 해당 패키지 공식 문서의 `import` 문을 따른다. React 패키지의 실제 `import` 문은 10단계에서 공식 문서로 확인한다.

근거: [MDN — Exporting module features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#exporting_module_features), [Importing features into your script](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#importing_features_into_your_script), [Default exports versus named exports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#default_exports_versus_named_exports)

### 2-3. 모듈 지정자: 상대 경로와 패키지 이름

| 형태 | 예시(미실행) | 의미 | 일반 브라우저에서 |
| --- | --- | --- | --- |
| 상대 경로 | `'./format.js'`, `'../lib/format.js'` | **현재 파일 위치 기준**의 파일. `./`는 같은 폴더, `../`는 상위 폴더 | 그대로 해석된다 |
| 패키지 이름(bare 이름) | `'some-package'` | `./`·`/`·URL 없이 이름만 적은 것. 보통 npm으로 설치한 패키지를 뜻한다 | **import map 없이는 해석하지 못한다** |

- 상대 경로는 "이 파일에서 봤을 때" 기준이다. 같은 `format.js`라도 가져오는 파일의 위치에 따라 `./`와 `../`가 달라진다.
- MDN의 예시처럼 브라우저가 직접 해석하는 경로에는 확장자(`.js`)까지 적는다.
- 브라우저는 `'some-package'`가 `node_modules`의 어느 파일인지 스스로 알지 못한다. 일반 브라우저에서 패키지 이름을 쓰려면 `<script type="importmap">`으로 이름과 실제 경로를 직접 연결해야 한다. ([MDN — Importing modules using import maps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#importing_modules_using_import_maps))
- `node_modules`의 역할은 [007](007-node-modules-role.md)을 참고한다.

### 2-4. `type="module"`

HTML에서 모듈을 불러올 때는 `<script>`에 `type="module"`을 붙인다.

```html
<!-- (미실행 예시) 실제 경로·파일명은 10단계에서 정한다 -->
<script type="module" src="진입 파일 경로"></script>
```

MDN은 `import`/`export`는 모듈 안에서만 쓸 수 있고, `type="module"`이 없는 `<script>`가 다른 모듈을 가져오려 하면 오류가 난다고 설명한다. 모듈 스크립트는 일반 스크립트와 다음이 다르다. ([MDN — Applying the module to your HTML](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#applying_the_module_to_your_html), [Other differences between modules and classic scripts](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#other_differences_between_modules_and_classic_scripts))

| 항목 | 일반 script | 모듈 script |
| --- | --- | --- |
| `import`/`export` | 사용 불가(오류) | 사용 가능 |
| 최상위 변수 범위 | 전역에 공유될 수 있다 | 그 모듈 안에만 있다. 가져온 기능도 가져온 스크립트에서만 쓸 수 있다 |
| 실행 시점 | 기본은 만나는 즉시 실행 | 자동으로 지연(`defer`) 실행 |
| 엄격 모드 | 선택 | 자동 적용 |
| 여러 번 참조 | 참조마다 실행될 수 있다 | 한 번만 실행 |
| `file://`로 직접 열기 | 가능 | 보안 요구사항 때문에 CORS 오류. 서버를 통해 열어야 한다 |

마지막 행 때문에 [001](001-index-html.md)처럼 `index.html`을 파일로 직접 여는 방식은 모듈 스크립트에서는 쓸 수 없다. 이 프로젝트는 08단계에서 이미 Vite 개발 서버(`npm run dev`)로 `index.html`을 여는 환경을 갖췄다. ([009](009-minimal-vite-setup.md))

## 3. 기존 방식과 대안 비교

B1-1은 순수 JavaScript·라이브러리 금지 조건이었다는 점만 프로젝트 공통 조건으로 알고 있다. B1-1의 실제 코드는 이번에 확인하지 않았으므로 여러 일반 script를 썼는지, 모듈을 썼는지는 단정하지 않는다. 아래는 가능한 방식의 일반 비교다.

| 방식 | 가능 여부 | 필요한 추가 설정 | 제약 | 이번 판단 |
| --- | --- | --- | --- | --- |
| A. 일반 `<script>` 여러 개 + 전역 변수 | 가능 | 없음. 파일마다 `<script src>` 추가 | 파일 간 의존을 **태그 순서**로만 맞춘다. 전역 이름 충돌 위험. `import`를 쓸 수 없어 npm 패키지를 이 방식으로 가져오지 못한다 | 가능하지만 미선택. React 패키지를 npm으로 가져오고 파일을 역할별로 나누는 목표와 맞지 않는다 |
| B. 브라우저 기본 ES 모듈 + import map (Vite 없이) | 가능 | 정적 서버, 패키지마다 `node_modules` 안의 실제 파일 경로를 import map에 직접 적기 | 패키지가 브라우저가 바로 읽을 수 있는 ES 모듈 파일을 제공해야 한다. 패키지 추가·갱신 때마다 경로를 수동 관리 | 가능하지만 미선택. 이미 도입한 Vite가 같은 문제를 자동 처리한다 |
| C. ES 모듈 + Vite | 가능 | 없음(08단계에서 설치 완료). 진입 파일과 `type="module"` 연결은 10단계 | Vite 개발 서버·빌드를 거쳐야 한다(이미 이 흐름을 채택함) | **선택** |
| D. CommonJS `require()` | 브라우저 기본으로는 불가 | 별도 도구의 변환 필요 | MDN은 ES 모듈 이전에 CommonJS·AMD 같은 별도 모듈 시스템이 쓰였다고 설명한다. 브라우저가 기본 지원하는 것은 `import`/`export` 방식이다 | 소스 작성 방식으로 선택하지 않음 |

모듈 방식 자체(`import`/`export`)는 React를 쓰기 위한 유일한 방법이 아니라, 이 프로젝트가 **npm 패키지 + Vite**를 선택했기 때문에 가장 자연스러운 방법이다.

## 4. Vite의 역할(이번 개념에 필요한 범위)

Vite 공식 문서는 브라우저 기본 ES import가 `import { someMethod } from 'my-dep'` 같은 패키지 이름(bare) import를 지원하지 않는다고 밝히고, Vite가 이를 다음과 같이 처리한다고 설명한다. ([Vite — NPM Dependency Resolving and Pre-Bundling](https://vite.dev/guide/features.html#npm-dependency-resolving-and-pre-bundling))

1. **사전 번들링(pre-bundling)**: 의존성 패키지를 미리 묶어 페이지 로딩을 빠르게 하고, CommonJS·UMD 형식의 패키지를 ES 모듈로 변환한다.
2. **import 경로 재작성**: 패키지 이름을 `/node_modules/.vite/deps/my-dep.js?v=...` 같은 브라우저가 가져올 수 있는 URL로 바꾼다.

구분하면 다음과 같다.

| 지정자 | 일반 브라우저 | Vite 개발 서버 |
| --- | --- | --- |
| 상대 경로 `'./x.js'` | 해석 가능 | 해석 가능 |
| 패키지 이름 `'my-dep'` | import map이 있어야 해석 | Vite가 URL로 재작성해 해석 |

즉 소스에는 `from '패키지 이름'`만 적고, `node_modules` 안의 실제 파일 경로 연결은 Vite에 맡긴다. 같은 페이지는 HTML 파일이 Vite 프로젝트의 진입점이며 `<script type="module" src>`가 가리키는 파일이 앱의 일부로 처리된다고 설명한다. Vite 전반의 역할은 [008](008-vite-role.md)을 참고한다.

## 5. 선택 이유

- React를 npm 패키지로 설치할 계획이므로([004](004-npm-role.md)), 진입 파일이 패키지 기능을 `import`로 가져와야 한다.
- 이후 `src/pages`·`src/components` 등으로 파일을 나누면 파일 간 제공·사용 관계를 `export`/`import`로 명시할 수 있다. 전역 변수와 script 순서에 기대지 않는다.
- 패키지 이름 해석은 이미 도입한 Vite가 처리하므로 import map을 직접 관리하지 않아도 된다.
- `file://` 직접 열기 제약은 08단계의 Vite 개발 서버로 이미 해소되어 있다.

## 6. 현재 수행과 다음 작업

| 구분 | 내용 |
| --- | --- |
| 이번 단계(09)에서 수행 | 이 학습자료 작성과 자료 목록 연결만 수행했다. `index.html`·`package.json` 변경 없음, 설치·실행 없음, 새 파일 생성은 이 문서뿐이다. |
| 다음 단계(10)에서 할 일 | React 패키지 설치, JavaScript 진입 파일 생성, `index.html`에 `type="module"` script 연결, 진입 파일에서 패키지 `import` 사용. 실제 파일 경로·가져올 이름·생성·변경 파일은 그 단계에서 확인해 기록한다. |
| 이번 학습 범위 밖 | JSX, React 루트 생성 방식, 컴포넌트, state는 각 단계에서 다룬다. |

## 7. 질문·추가 확인

- 10단계에서 설치할 React 패키지가 어떤 이름을 named/default 중 어떤 형태로 제공하는지는 React 공식 문서로 확인한다.
- Vite가 상대 경로의 확장자 생략 등 브라우저 기본 규칙 외의 해석을 지원하는지는 이번에 확인하지 않았다. 필요해지면 Vite 문서로 확인한다.

## 참고자료

- MDN, [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) — 2026-09-27 확인
- Vite, [Features — NPM Dependency Resolving and Pre-Bundling](https://vite.dev/guide/features.html#npm-dependency-resolving-and-pre-bundling) — 2026-09-27 확인
