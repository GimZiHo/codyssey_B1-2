# 000. 프로젝트 환경 구성 — 파일별 역할과 아키텍처

## 학습 목적

저장소를 처음 열었을 때 낯선 파일이 많다. 각 파일이 "누가/무엇이 왜 만들었는지", "실행할 때 누가 읽는지", "직접 고치는 파일인지 자동 생성 파일인지", "Git에 포함하는지"를 구분하고, `npm run dev`로 브라우저 화면이 뜨기까지 파일들이 어떻게 연결되는지 설명할 수 있게 한다. [001](001-entry-point-rendering.md)은 `index.html → main.jsx → App.jsx`의 렌더링 흐름만 다루므로, 이 문서는 그 앞 단계인 "이 파일들이 왜 존재하는가"부터 정리한다.

## 먼저 알아둘 용어

- **React**: 화면을 "무엇을 보여줄지" 선언하면 화면에 반영해주는 JavaScript 라이브러리. **ReactDOM**(`react-dom`)은 그 결과를 실제 브라우저 DOM(화면에 보이는 HTML 요소 트리)에 그리는 역할을 맡는다. React 자체는 DOM을 몰라도 되고, react-dom이 연결한다.
- **JSX**: `<h1>제목</h1>`처럼 JavaScript 안에 HTML과 비슷한 문법을 쓰는 표기법. 브라우저는 JSX를 직접 실행하지 못하므로 일반 JavaScript 함수 호출로 변환되어야 한다(아래 Vite 항목 참고).
- **브라우저**: 사용자가 여는 창. HTML·CSS·JavaScript를 읽고 실행해 화면을 그린다.
- **Node.js**: 브라우저 밖에서 JavaScript를 실행하는 프로그램. 개발 중 Vite·ESLint 같은 도구를 돌리는 데 쓴다(브라우저에 화면을 그리는 주체가 아니다).
- **npm**: Node.js와 함께 설치되는 패키지(=다른 사람이 만든 코드 묶음) 설치·실행 도구. `package.json`에 적힌 패키지를 내려받고 `npm run <스크립트명>`으로 명령을 실행한다.
- **Vite**: 개발 서버와 빌드 도구. 개발 중에는 브라우저 요청이 올 때마다 JSX·최신 문법을 브라우저가 이해할 JavaScript로 즉시 변환해 보내주고, 배포용으로는 전체 소스를 미리 변환·압축해 정적 파일 묶음으로 만든다.
- **개발 서버 / 빌드 / 프리뷰**: `npm run dev`는 Vite가 로컬에 임시 서버를 띄워 매 요청마다 변환하며 실시간으로 코드 수정을 반영(HMR)한다. `npm run build`는 배포용으로 한 번에 변환·최적화해 `dist/` 폴더에 정적 파일을 만든다. `npm run preview`는 `dist/`에 이미 만들어진 빌드 결과를 로컬에서 정적 서버로 잠깐 띄워 배포 전 확인하는 용도이며, 이때는 더 이상 소스를 변환하지 않는다.
- **ESLint**: 소스 코드의 문법·잠재적 실수를 검사하는 코드 검사 도구다. `npm run lint`는 화면을 만들거나 실행하지 않으며, 오직 코드 규칙 위반을 찾아 보고만 한다.
- **의존성 / 개발 의존성(dependencies / devDependencies)**: `dependencies`는 배포된 앱이 브라우저에서 실제로 실행될 때도 필요한 패키지(예: react, react-dom). `devDependencies`는 개발·빌드·검사 과정에만 필요하고 최종 배포 결과물에는 직접 포함되지 않는 패키지(예: vite, eslint)다.
- **lock 파일**: 각 패키지가 의존하는 하위 패키지까지 정확히 어떤 버전을 설치했는지 고정해 기록한 파일. 이것이 없으면 같은 `package.json`이라도 설치 시점에 따라 하위 버전이 달라질 수 있다.

## 파일별 역할

### 실행 흐름에 직접 관여하는 소스

- **`index.html`**: 브라우저가 맨 처음 받는 HTML 문서. 사람이 직접 작성·수정한다. 안에 있는 `<div id="root"></div>`가 React가 내용을 채울 빈 자리이고, `<script type="module" src="/src/main.jsx">`가 다음에 실행할 진입점을 지정한다. 이 파일이 없으면 브라우저가 무엇을 로드할지 알 수 없어 빈 화면조차 뜨지 않는다.
- **`src/main.jsx`**: React가 `#root`를 찾아 `App` 컴포넌트를 그려 넣도록 지시하는 진입 스크립트. 사람이 작성하며, 렌더링 시작점이다. 자세한 동작은 [001](001-entry-point-rendering.md) 참고.
- **`src/App.jsx`**: 실제 화면 내용(JSX)을 반환하는 최상위 컴포넌트. 지금은 환경 구성 단계의 안내 문구만 있으며, 앞으로 라우팅·페이지가 이 아래로 연결된다.
- **`src/styles/index.css`**: 일반 CSS 파일. `main.jsx`에서 `import './styles/index.css'`로 불러오면 Vite가 이 CSS를 최종 HTML에 연결해준다. 사람이 직접 수정한다. 이 import가 없으면 스타일이 전혀 적용되지 않는다(빈 화면은 아니고 스타일 없는 화면).
- **`src/pages`, `src/components`, `src/hooks`, `src/lib`**: 아직 생성되지 않은 설계상 경로다. 앞으로 페이지·재사용 컴포넌트·커스텀 훅·Supabase 연동 코드가 이 아래 추가될 예정이며, 현재 화면에는 관여하지 않는다.

### 도구 설정 파일 (사람이 작성, Git 포함)

- **`package.json`**: 이 프로젝트가 어떤 패키지(react, vite 등)를 쓰는지, `npm run dev/build/lint/preview` 각 명령이 실제로 무엇을 실행하는지 정의한다. `npm install` 등이 참고하는 기준 파일이며 직접 수정하는 파일이다.
- **`package-lock.json`**: `npm install` 실행 결과로 npm이 자동 생성·갱신한다. 직접 손으로 고치지 않는다. `package.json`에 적힌 패키지가 의존하는 모든 하위 패키지의 정확한 버전을 기록해, 다른 컴퓨터에서 `npm ci`로 설치해도 완전히 같은 버전 조합이 재현되게 한다. Git에 포함해야 이 재현성이 보장된다.
- **`vite.config.js`**: Vite 동작을 설정하는 파일(현재는 React 플러그인만 등록). Vite가 `npm run dev`/`build`/`preview` 실행 시 읽는다. 사람이 필요할 때 수정한다.
- **`eslint.config.js`**: ESLint가 어떤 규칙으로 코드를 검사할지 정의한다. `npm run lint` 실행 시 ESLint가 읽는다. 화면 렌더링에는 전혀 관여하지 않는다.
- **`.env.example`**: 앞으로 필요할 환경변수 이름(`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`)만 적어둔 예시 파일로, 값은 비어 있다. 실제 값을 넣는 `.env.local`은 아직 만들지 않았으며, 만들더라도 `.gitignore`에 걸려 Git에 올라가지 않는다. **주의**: Vite는 `VITE_`로 시작하는 환경변수를 빌드 시 브라우저 코드에 그대로 심어 노출한다. 즉 `.env` 파일을 Git에서 제외하는 것은 "저장소에 값이 남지 않게" 막을 뿐이며, `VITE_` 접두사가 붙은 값 자체는 배포된 사이트를 열어보면 누구나 볼 수 있다. 그래서 이 접두사에는 공개돼도 되는 값(공개 URL, publishable key)만 넣고, 비밀로 지켜야 하는 값(secret/service_role 키)은 애초에 브라우저용 환경변수로 만들지 않는다.
- **`.gitignore`**: Git이 추적하지 않을 경로 목록. 사람이 작성한다. `node_modules/`, `dist/`, `.env`류, `.verify-tmp/` 등 "자동 생성되거나 로컬 전용"인 것들을 저장소에서 제외해 저장소 용량과 충돌을 줄인다.

### 자동 생성되는 산출물 (Git 제외)

- **`node_modules/`**: `npm install`(또는 `npm ci`)이 `package.json`/`package-lock.json`을 읽고 실제 패키지 코드를 내려받아 채우는 폴더. 직접 수정하지 않으며, 지워도 같은 명령으로 다시 만들 수 있다. 용량이 크고 재생성 가능하므로 Git에 포함하지 않는다.
- **`dist/`**: `npm run build`가 소스를 변환·번들링해 만든 배포용 정적 파일 폴더(HTML/JS/CSS). 사람이 직접 편집하지 않는다. 빌드할 때마다 새로 만들어지므로 Git에 포함하지 않고, 이 폴더를 Vercel 같은 정적 호스팅에 올려 배포한다.
- **`.git/`**: Git 자신이 관리하는 저장소 메타데이터(커밋 이력, 브랜치 등). Git 명령이 직접 다루는 영역이며 사람이 안의 파일을 직접 편집하지 않는다.
- **`.verify-tmp/`**: 코드 실행 없이 검증할 때 쓰는 일회성 임시 결과 저장 경로. `.gitignore`에 이미 등록돼 있어 Git에 포함되지 않는다.

### 문서 (Git 포함, 앱 실행과 무관)

- **`docs/Requirement_B1-2.pdf`, `docs/requirement-analysis.md`, `docs/project-handoff.md`**: 과제 원문과 해석·인수인계 기록. 브라우저 화면 구동에는 관여하지 않는다.
- **`docs/progress.md`**: 요구사항 체크리스트와 현재 진행 상태의 원본 문서.
- **`docs/tool-environment.md`**: PDF·브라우저 검증에 쓰는 공용 도구 버전·경로 기록.
- **`docs/learning/`**: 이 문서를 포함한 학습자료 모음. `GUIDE.md`는 작성 기준, `README.md`는 목차다.
- **`AGENTS.md`, `CLAUDE.md`**: 이 저장소에서 Codex·Claude Code가 따르는 작업 지침. 코드 실행과 무관하다.
- **`config/`**: 이번 환경 구성에서 다루지 않은 별도 설정 보관 경로다.

## 왜 필요한가 — 파일이 없으면 생기는 일 (요약)

| 파일이 없으면 | 결과 |
| --- | --- |
| `index.html` | 브라우저가 로드할 진입 문서 자체가 없어 아무것도 뜨지 않는다 |
| `src/main.jsx` | `#root`에 아무것도 그려지지 않아 빈 화면만 남는다 |
| `package.json` | `npm install`/`npm run ...`이 무엇을 설치·실행할지 알 수 없어 명령이 실패한다 |
| `package-lock.json` | 설치할 때마다 하위 패키지 버전이 달라져 "내 컴퓨터에서는 되는데" 문제가 생길 수 있다 |
| `vite.config.js` | Vite 기본 설정으로 동작하나, React JSX 변환 플러그인이 빠지면 `.jsx` 처리가 실패한다 |
| `.gitignore` | `node_modules/`처럼 큰 자동 생성 폴더나 `.env`의 비밀값이 실수로 Git에 올라갈 수 있다 |

## 아키텍처

### 현재 구조 (문서 / 도구 설정 / 소스 / 생성 결과)

```
문서(Git 포함, 실행과 무관)
  docs/, AGENTS.md, CLAUDE.md

도구 설정(Git 포함, 사람이 작성)
  package.json, package-lock.json, vite.config.js, eslint.config.js, .env.example, .gitignore

소스(Git 포함, 사람이 작성 — 실제 화면을 구성)
  index.html, src/main.jsx, src/App.jsx, src/styles/index.css

생성 결과(Git 제외, 자동 생성)
  node_modules/  ← npm install이 package.json을 읽어 생성
  dist/          ← npm run build가 소스를 읽어 생성
  .git/          ← Git이 관리
  .verify-tmp/   ← 일회성 검증 산출물
```

### 개발 중 화면이 뜨기까지 (`npm run dev`)

```
브라우저 요청
  → Vite 개발 서버가 index.html 응답
  → 브라우저가 index.html의 <script src="/src/main.jsx"> 로드 요청
  → Vite가 main.jsx(JSX 포함)를 그 자리에서 브라우저가 읽을 수 있는 JS로 변환해 응답
  → main.jsx 실행: index.html의 빈 <div id="root">를 찾아 React 루트로 지정
  → App.jsx가 반환한 JSX(역시 Vite가 변환)를 React가 실제 DOM으로 만들어 #root 안에 삽입
  → main.jsx가 import한 styles/index.css를 브라우저가 함께 적용
  → 화면 표시
```

핵심은 "최초의 `index.html`은 `#root`가 빈 채로 오고, React가 실행되면서 그 안을 채운다"는 것과, "브라우저는 JSX를 직접 읽는 게 아니라 Vite가 변환해준 결과를 읽는다"는 두 가지다. CSS는 App의 실행 "이후" 순서로 걸리는 게 아니라, `main.jsx`가 로드되는 시점에 함께 브라우저에 전달되어 화면 표시에 함께 반영된다(App 렌더링과 CSS 적용은 순차적 대기 관계가 아니라 같은 로드 과정에서 함께 준비된다).

### 배포용 빌드 (`npm run build`)

```
src/**, index.html (소스)
  → Vite build
  → dist/ (변환·번들링된 정적 HTML/JS/CSS)
  → 정적 호스팅(예: Vercel)에 dist/ 내용을 업로드
  → 사용자가 배포 URL 접속 시 dist/의 정적 파일을 그대로 받는다 (더 이상 Vite 변환 없음)
```

`npm run preview`는 이 `dist/`를 로컬에서 미리 확인하는 단계로, 배포 전 마지막 점검용이다.

### 아직 없는 것 (Supabase)

현재 `.env.example`에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` 키 이름만 준비돼 있을 뿐, `@supabase/supabase-js` 패키지 설치나 실제 연동 코드(`src/lib` 등)는 아직 없다. 지금의 화면 흐름은 Supabase와 무관하게 완전히 로컬에서만 동작한다.

## 읽기 순서 제안

1. `index.html` — 브라우저가 맨 처음 받는 문서, `#root`와 진입 스크립트 확인
2. `src/main.jsx` → `src/App.jsx` → `src/styles/index.css` — 진입점부터 실제 화면 내용까지 ([001](001-entry-point-rendering.md) 참고)
3. `package.json` — 어떤 명령(`dev`/`build`/`lint`/`preview`)이 있고 어떤 패키지를 쓰는지
4. `vite.config.js`, `eslint.config.js` — 개발 서버/빌드와 코드 검사가 각각 무엇을 참고하는지
5. `.gitignore`, `.env.example` — 무엇을 Git에서 제외하고 왜인지
6. (선택) `package-lock.json` 맨 위 몇 줄만 — 실제 파일 하나하나를 다 읽기보다 "자동 생성된 잠금 파일"이라는 점만 확인

## 소규모 확인 실습 (안내만, 직접 실행은 학습자 몫)

- `index.html`을 열어 `<div id="root">`가 비어 있는 것을 직접 확인한다. 이후 브라우저 개발자 도구의 Elements 탭에서 같은 자리를 보면 React가 그려 넣은 `<main class="app-shell">...` 이하가 채워져 있는 것을 비교해본다.
- `npm run dev`로 개발 서버를 켠 상태에서 `src/App.jsx`의 문구 한 줄을 잠시 바꿔보고 저장한다. 브라우저가 새로고침 없이 즉시 바뀌는지(HMR) 확인한 뒤 원래 문구로 되돌린다.
- `npm run build` 실행 후 새로 생긴 `dist/` 폴더 안의 파일 목록만 열어본다. `index.html`과 비교해 `<script>` 경로가 원래의 `/src/main.jsx`가 아니라 `dist/` 안의 번들 파일로 바뀌어 있는지 확인한다.
- `package.json`의 `scripts` 항목과 실제로 실행해본 `dev`/`build`/`lint`/`preview` 명령 이름을 맞춰본다.

이 실습들은 이미 통과한 lint·build·render·HMR 검증(아래 참고)과 같은 종류의 확인이며, 새 기능 추가나 전체 재검증을 요구하지 않는다.

## 확인 결과 (재사용 근거)

- [001](001-entry-point-rendering.md)에서 이미 수행한 lint 1건, build 1건, 브라우저 render·HMR 각 1건(총 4건) 통과, 실패 0건, 브라우저 콘솔 오류 0건 근거를 그대로 재사용한다. 이 문서 작성을 위해 별도 실행은 하지 않았다.
- 실제 배포·preview 브라우저 검증은 미수행 상태이며 이 문서에서도 수행하지 않았다.

## 참고자료

- [Vite: Getting Started](https://vite.dev/guide/)
- [Vite: Env Variables and Modes](https://vite.dev/guide/env-and-mode.html)
- [React: Rendering with createRoot](https://react.dev/reference/react-dom/client/createRoot)
- [npm docs: package-lock.json](https://docs.npmjs.com/cli/v10/configuring-npm/package-lock-json)
