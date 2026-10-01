# 진행 상태와 개념별 작업 단계

[과제 분석](requirement-analysis.md)을 기반으로 작업을 실행 순서와 개념 단위로 재구성했다. 평소에는 이 문서의 현재 단계·수행 범위·완료 기준으로 작업하며 분석 문서나 PDF를 함께 읽지 않는다. 분석은 단계 재구성 때, PDF는 요구사항의 누락·불명확성이 있을 때만 확인한다. 단계의 완료는 실제 수행 결과이며 사용자 이해 완료를 뜻하지 않는다.

## 현재 상태

- **완료**: 기존 과제 분석 확인, 운영 지침·학습자료 작성 기준·공통 도구 정보 이관. 서비스 주제를 학습 기록으로 결정하고 자료 범위를 B1-1·B1-2로 확정. 백엔드·개발 및 배포 도구 선택(아래 기술 구성 참고). Git 저장소 초기화. 단일 `index.html` 기본 화면 구현·브라우저 검증·학습자료 반영. 최소 npm·Vite 환경 구성과 개발 서버 표시 검증·학습자료 반영. 정규 단계 23(클라이언트 라우팅) 설명·학습자료 반영 완료. 정규 단계 24(라우트 매핑)·25(내비게이션 링크)·26(라우트 파라미터) 구현·검증·검토·학습자료 반영 완료. 정규 단계 13(JSX)·14(함수 컴포넌트)·15(props)·16(배열 렌더링)·17(key)·18(React 이벤트 처리)·19(state)·20(조건부 렌더링)·21(children)·22(CSS import) 구현·검증·검토·학습자료 반영. 사용자가 외부 대화로 작성한 웹 기초 배경지식 자료를 `000-browser-web-basics.md`로 추가해 자료 목록에 연결.
- **진행 중**: 없음. 정규 작업은 기존 단계 순서로 이어간다.
- **다음 작업**: 정규 단계 27 — 잘못된 주소에 전용 Not Found 페이지를 표시한다.
- **진행 방식**: 대화 한 번에 아래 단계 하나를 진행한다. 다음 진행 요청에서 이어가고 질문이면 현재 단계에 머문다. 이미 다룬 개념을 별도로 기록하거나 조회하지 않는다.
- **미정**: 데이터 모델 세부 사항·자료 본문 표시 및 이전 방식·원격 데이터 접근 권한. Supabase·Vercel 계정 및 프로젝트 연결 상태는 아직 확인하지 않았다.
- **자료 반영 대기**: 없음.
- **Git**: main과 기존 커밋 이력은 유지한다. 환경 구성 변경은 삭제·복원 커밋으로 되돌린다. 기존 미추적 과제·지침 파일은 보존한다.
- **검증 범위**: 26단계 detail 14·home 5·links 2 총 21항목 통과, 실패 0건. 목록 3개 링크 href·실제 표시/스타일/박스·클릭 결과·문서 재요청 없음·상세 식별자 변경·뒤로/앞으로·직접 접근/새로고침·알 수 없는 id 안내·등록/수정 경로·공통 헤더·Tab/Enter·홈 2→3→0→2·alert 3개·오류 없음·서버 시작/종료 확인. 상세 사이 이동은 History API+popstate 및 실제 뒤로/앞으로로 검사했다. 모든 시나리오 최초 통과, 서버 검증 순차 실행. HMR·프로덕션 빌드·문서 앵커 정확성·인코딩된 id·원격 연동은 미검증. 19단계 최초 render 오류의 원인은 미확정으로 남아 있다.
- **마지막 갱신**: 2026-10-01

## 서비스 주제와 자료 범위

- **주제**: 학습 기록 서비스. 핵심 데이터는 학습 기록 하나이며 등록·조회·수정·삭제를 제공한다.
- **포트폴리오 범위**: B1-1과 B1-2의 모든 학습자료. 다른 프로젝트는 현재 범위에 포함하지 않는다.
- **기존 자료 위치**: `../codyssey_B1-1/docs/learning/`. 2026-09-25 파일 목록 기준 번호가 붙은 Markdown 학습자료 25개와 `README.md`, `GUIDE.md`가 있다. 본문은 이번 범위 결정에서 검토하지 않았다. 안내 문서의 서비스 내 배치 방식은 이전 단계에서 정한다.
- **B1-2 자료**: 앞으로 작성되는 이 프로젝트 학습자료도 같은 서비스에 포함한다.
- **데이터 구성 초안**: 제목·프로젝트(B1-1/B1-2)·학습 날짜·분류·본문. 프로젝트는 학습 기록의 구분 속성으로 두며 별도 프로젝트 CRUD로 범위를 넓히지 않는다.
- **화면 구성 초안**: 홈·학습 기록 목록·상세·등록·수정의 5개 라우트와 Not Found.
- **진행 순서**: 서비스 CRUD 구현·검증 후 기존 자료를 이전한다. 원본 파일은 보존한다. 이번 단계에서는 자료 복사·원격 등록·기능 구현을 수행하지 않았다.

## 기술 구성 — 2026-09-25 선택

기술 선택은 유지하되 일괄 환경 구성은 사용자 요청으로 되돌렸다. 현재는 `src/main.jsx`가 BrowserRouter 안에서 Layout과 Routes·Route로 홈(`/`)·목록(`/records`)·등록(`/records/new`)·상세(`/records/:recordId`)·수정(`/records/:recordId/edit`)을 매핑하고 `Layout`이 children을 main에 표시하며 `SiteHeader`를 공통 헤더로 두고 Link로 홈(`/`)·목록(`/records`)·등록(`/records/new`) 이동을 제공한다. `index.html`의 `#root`에 `src/main.jsx`가 `src/pages/HomePage.jsx`의 함수 컴포넌트(default export)를 import하고, HomePage는 `src/components/PageTitle.jsx`에 title prop을 전달해 제목을 React로 표시하며, HomePage의 정적 records 배열 3개를 map으로 목록 표시하고 고정 id를 li의 key로 지정한다. useState의 visibleCount(초기값 2)로 목록의 표시 개수를 관리하고 전체 보기·2개 보기·목록 비우기(0개) 버튼으로 전환한다. 표시할 기록이 0개이면 삼항 연산자로 ul 대신 안내 문구만 렌더링한다. 기록 수 확인 버튼은 표시 범위와 무관하게 전체 기록 수 3개를 alert로 표시한다. `src/main.jsx`에서 `src/styles/global.css`를 import하여 body·header·main·button에 일반 CSS를 적용한다. JSX는 플러그인·설정 파일 없이 Vite 기본 변환(automatic 런타임)을 사용한다. `package.json`·`package-lock.json`에는 Vite `8.3.1`(devDependencies)과 React·react-dom `19.3.0`, React Router `8.4.0`(dependencies)이 있다. React Router는 Node.js `>=22.22.0`, React·react-dom `>=19.2.7`을 요구하며 현재 환경이 충족한다. 정적 records 3개는 `src/lib/staticRecords.js`에서 공유한다. 목록은 기록별 Link를 표시하고 상세는 useParams의 recordId로 find하여 제목·프로젝트를 표시한다. 알 수 없는 id에는 최소 안내만 표시한다. 등록·수정은 제목·안내만 표시하며 전용 Not Found는 후속 단계다. 빌드 스크립트·Vite 설정·플러그인은 아직 도입하지 않았다. 계정 생성·원격 연동·배포는 수행하지 않았다.

| 역할 | 선택 | 선택 이유 |
| --- | --- | --- |
| UI·언어 | React 18 이상, JavaScript와 JSX | B1-1의 JavaScript 경험을 이어가며 컴포넌트·상태 학습에 집중한다. |
| 개발·빌드 | Vite, npm | 필요한 개념별 설명 후 최소 설정으로 개발 서버와 배포 빌드를 구성한다. 개발 서버(`npm run dev`)까지 도입, 빌드는 미구성. |
| 라우팅 | React Router의 Declarative 모드 | BrowserRouter·Routes·Route로 URL과 페이지의 관계를 명시하고 데이터 요청은 훅에서 학습한다. |
| 스타일 | 일반 CSS | 기존 CSS 경험을 재사용한다. |
| 원격 데이터 | Supabase, @supabase/supabase-js | 학습 기록 하나를 테이블의 행으로 관리하고 JavaScript에서 CRUD를 호출한다. |
| 배포 | Vercel | Vite 빌드 결과를 배포한다. 상세 URL 직접 접근·새로고침을 위한 SPA rewrite를 배포 단계에 구성한다. |
| 소스 관리 | Git, GitHub | 로컬에서 검토한 작업 단위로 커밋하고, 사용자 요청 시 푸시한다. |

- **소스 경로**: `src/pages`, `src/components`, `src/hooks`, `src/lib`, `src/styles`. 환경 구성 단계에 필요한 경로부터 만들고 역할에 따라 확장한다.
- **버전 관리**: 2026-09-25 실행 확인 결과 Node.js `v24.18.1`, npm `11.16.0`, Git `2.43.0`, Claude Code `2.1.270`. 현재 Node.js는 Vite 공식 문서의 요구 범위를 충족한다. 2026-09-27 재확인 후 Vite `8.3.1`(요구 Node.js `^20.19.0 || >=22.12.0`)을 설치해 `package-lock.json`에 기록했다. 이후 패키지도 설치 시 호환성을 확인하고 잠금 파일에 기록한다.
- **원격 연동 경계**: 브라우저에는 Supabase URL과 publishable key만 사용한다. secret/service_role 키는 넣지 않는다. 환경변수만으로 데이터 접근을 제한할 수 없으므로 실제 학습자료 이전 전 읽기·쓰기 정책과 RLS를 확정한다. 인증 채택 여부는 이 단계에서 변경하지 않는다.
- **확인 근거**: [Vite 시작하기](https://vite.dev/guide/), [React Router Declarative 설치](https://reactrouter.com/start/declarative/installation), [Supabase React 연동](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs), [Supabase API 키](https://supabase.com/docs/guides/getting-started/api-keys), [Vercel의 Vite 배포](https://vercel.com/docs/frameworks/frontend/vite). 2026-09-25 공식 문서 확인. 실행·빌드·원격 CRUD 검증은 환경 구성 및 구현 단계에서 수행한다.

## 작업 단계

각 행은 한 대화의 범위다. 새 핵심 개념은 최대 하나이며 `없음`인 실행·검증 단계는 앞 단계의 개념을 함께 적용한다. 각 절을 한 번에 구현하지 않는다. 상세화가 더 필요하면 실행 전에 해당 행을 나누고 이 문서만 갱신한다. 미래 단계의 순서는 실제 필요에 따라 조정할 수 있지만 필수 완료 기준은 보존한다.

`설명`은 설치·소스 변경 없이 필요성·역할·현재 방식과의 관계를 학습자료로 작성하는 단계다. 자료 작성과 자료 목록 링크 반영을 완료 기준으로 삼고, 상태와 필요한 결정은 이 문서에 기록한다. 모든 단계의 개념 설명은 학습자료로 제공하며 터미널·대화에는 작업 범위·결과·자료 링크만 간단히 보고한다. `변경`은 실제 파일 변경·필요한 검증·변경 기반 학습자료 반영까지 마감한다. `확인`은 명시한 결과를 검증한다. 아래 모든 미수행 단계는 `대기`로 유지하며, 완료 시 같은 행에 결과·자료 또는 검증 근거를 간단히 남긴다. 개념 이력 표는 만들지 않는다.

### 1. React 도입과 실행 환경

| 단계 | 상태 | 구분 | 새 핵심 개념 | 수행 범위·완료 기준 |
| --- | --- | --- | --- | --- |
| 01 | 완료 | 설명 | React의 역할 | 현재 정적 화면과 앞으로 필요한 화면 갱신, 순수 JavaScript 대안과 React 선택 근거를 [학습자료](learning/002-react-role.md)로 작성하고 자료 목록에 연결했다. 링크 대상 5건 확인 통과, 실패 0건. 설치·소스 변경·실행 검증 없음. 근거: [React 공식 문서](https://react.dev/learn/reacting-to-input-with-state). |
| 02 | 완료 | 설명 | Node.js | 개발 도구 실행 환경의 역할과 기존 방식·대안을 [학습자료](learning/003-nodejs-role.md)로 작성하고 목록에 연결했다. 2026-09-26 `command -v node`, `node --version`으로 기존 설치 경로와 `v24.18.1` 확인. 링크 대상 5건 통과, 실패 0건. 설치·소스 변경 없음. Vite 실행·빌드 검증은 08 단계에서 수행한다. |
| 03 | 완료 | 설명 | npm | 프로젝트 패키지 관리의 필요성·대안·설치 명령의 역할을 [학습자료](learning/004-npm-role.md)로 작성하고 목록에 연결했다. 기존 npm 경로와 `11.16.0` 확인. 로컬 링크 대상 8건 통과, 실패 0건. 설치·소스 변경·실행 검증 없음. 명령 예시는 미실행으로 표시했다. 근거: [npm 소개](https://docs.npmjs.com/about-npm), [npm install](https://docs.npmjs.com/cli/v11/commands/npm-install), [Vite 시작하기](https://vite.dev/guide/). |
| 04 | 완료 | 설명 | package.json | 프로젝트 의존성과 실행 명령을 기록할 파일의 역할·작성 방법을 [학습자료](learning/005-package-json-role.md)로 작성하고 목록에 연결했다. 로컬 링크 대상 4건 통과, 실패 0건. 설치·설정 생성·실행 검증 없음. 예시는 미실행으로 표시했다. 근거: [npm package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json), [npm init](https://docs.npmjs.com/cli/v11/commands/npm-init). 실제 생성 방법·private 사용 여부·Vite 의존성 분류는 08 단계에서 결정한다. |
| 05 | 완료 | 설명 | package-lock.json | 설치 버전을 기록할 파일의 역할·package.json과의 차이·공유 및 재설치 방식을 [학습자료](learning/006-package-lock-json-role.md)로 작성하고 목록에 연결했다. 로컬 링크 대상 14건 통과, 실패 0건(자료 목록 포함). 설치·설정 생성·실행 검증 없음. 명령·JSON은 미실행 예시로 표시했다. 근거: [npm package-lock.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json), [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci), [npm install](https://docs.npmjs.com/cli/v11/commands/npm-install). |
| 06 | 완료 | 설명 | node_modules | 설치된 패키지 경로·버전 관리 제외 이유·재설치 흐름을 [학습자료](learning/007-node-modules-role.md)로 작성하고 목록에 연결했다. 자료와 목록의 로컬 링크 19건 통과, 실패 0건. 설치·설정 변경·실행 검증 없음. 기존 `.gitignore`의 `node_modules/` 설정은 유지하며 실제 설치 후 제외 적용과 `.bin` 연결 확인은 08 단계에 남겼다. 근거: [npm folders](https://docs.npmjs.com/cli/v11/configuring-npm/folders/), [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/). |
| 07 | 완료 | 설명 | Vite | 선택한 개발·빌드 도구의 필요성·대안·기존 화면 실행 방식과의 차이를 [학습자료](learning/008-vite-role.md)로 작성하고 목록에 연결했다. 자료와 목록의 로컬 링크 21건 통과, 실패 0건. 설치·소스 변경·실행 검증 없음. 명령과 생성 파일은 미실행 예시로 구분했으며 실제 버전 호환성·패키지 생성 방법·실행 명령 구성은 08 단계에서 확인한다. 근거: [Vite 시작하기](https://vite.dev/guide/), [React 앱을 처음부터 만들기](https://react.dev/learn/build-a-react-app-from-scratch). |
| 08 | 완료 | 변경 | 없음 | Node.js `v24.18.1`·npm `11.16.0`이 Vite 8.3.1 요구 범위를 충족함을 확인했다. `package.json`을 직접 작성(`private: true`, `scripts.dev: vite`, `name`·`version` 생략)하고 `npm install --save-dev vite`로 설치(15개, audit 0건)해 `package-lock.json`(lockfileVersion 3, 선택 의존성 포함 41항목)을 생성했다. 기존 `.gitignore`의 `node_modules/` 제외와 `.bin/vite` 연결 확인. `index.html` 변경 없음. `npm run dev` 개발 서버에서 HTTP 응답·제목·언어·인코딩·h1 계산 스타일과 박스·오류 없음·서버 종료 7건 통과, 실패 0건. React·빌드·설정 파일 미도입. [학습자료](learning/009-minimal-vite-setup.md) 작성·목록 연결. |
| 09 | 완료 | 설명 | JavaScript 모듈 | React 진입 파일에서 사용할 import/export, named/default export, 상대 경로·패키지 이름, 모듈 script와 Vite의 역할을 [학습자료](learning/010-javascript-modules.md)로 작성하고 목록에 연결했다. 자료와 목록의 로컬 링크 20건 통과, 실패 0건. 예시는 미실행으로 표시했고 설치·소스 변경·실행 검증 없음. 근거: [MDN 모듈](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), [Vite 기능](https://vite.dev/guide/features.html#npm-dependency-resolving-and-pre-bundling). |
| 10 | 완료 | 변경 | React 루트 | React·react-dom `19.3.0`을 설치하고 `index.html`의 `#root`에 `src/main.js`의 createRoot·createElement로 기존 제목을 표시했다. JSX·컴포넌트 분리·state·Vite 설정은 미도입. 브라우저 검증 7건 통과, 실패 0건(HTTP·메타데이터·계산 스타일/박스·새로고침·오류 없음·서버 종료). [학습자료](learning/011-react-root.md)와 목록에 실제 변경·검증 결과 반영. |
| 11 | 완료 | 설명 | Vite 설정 파일 | 설정 파일의 역할·위치, 설정 없음·CLI·설정 파일의 대안과 기본값 유지 범위를 [학습자료](learning/012-vite-config.md)로 작성하고 목록에 연결했다. 자료·목록 로컬 링크 22건 통과, 실패 0건. 설치·소스 및 설정 변경·실행 검증 없음. 설정 파일 로딩과 JSX 기본 변환의 실제 동작 확인은 13단계에 남겼다. 근거: [Vite 설정](https://vite.dev/config/), [Vite JSX 지원](https://vite.dev/guide/features.html#jsx). |
| 12 | 완료 | 설명 | Vite 플러그인 | 기본 JSX 변환과 React 플러그인의 추가 역할·대안을 [학습자료](learning/013-vite-plugin.md)로 작성하고 목록에 연결했다. 자료·목록 로컬 링크 19건 통과, 실패 0건. 다음 단계는 Vite 기본 JSX 변환을 우선 사용하며 플러그인·설정 파일을 미리 추가하지 않는다. 실제 화면 동작은 13단계에서 확인한다. 설치·소스 및 설정 변경·실행 검증 없음. 근거: [Vite JSX 지원](https://vite.dev/guide/features.html#jsx), [Vite 공식 플러그인](https://vite.dev/plugins/). |
| 13 | 완료 | 변경 | JSX | `src/main.js`를 삭제하고 `src/main.jsx`에서 `createRoot`를 유지한 채 `root.render(<h1>학습 기록 서비스</h1>)`로 바꿨으며 `index.html` 모듈 경로를 `/src/main.jsx`로 변경했다. 패키지·Vite 설정·플러그인 변경 없이 기본 변환 사용. 브라우저 검증 7건 통과, 실패 0건(HTTP·변환 모듈의 jsx-dev-runtime import·메타데이터·계산 스타일/박스·새로고침·오류 없음·로컬 링크 25건·서버 종료). [학습자료](learning/014-jsx.md)와 목록에 실제 변경·검증 결과 반영. 근거: [React JSX](https://react.dev/learn/writing-markup-with-jsx), [Vite JSX 지원](https://vite.dev/guide/features.html#jsx). |
| 14 | 완료 | 변경 | 함수 컴포넌트 | `src/pages/HomePage.jsx`에 기존 `h1`을 반환하는 `HomePage`를 default export하고 `src/main.jsx`에서 import해 `root.render(<HomePage />)`로 바꿨다. `index.html`·패키지·Vite 설정 변경 없음, props·state·라우팅·App 미도입. 브라우저 검증 8건 통과, 실패 0건(HTTP·두 모듈 변환·모듈 응답·메타데이터·단일 h1 계산 스타일/박스·새로고침·오류 없음·로컬 링크·서버 종료). 첫 실행의 HTTP 실패 1건은 주석 문자열을 미변환 JSX로 오인한 검사 조건 오류로, 검사 수정 후 해당 항목 재실행 통과. [학습자료](learning/015-function-component.md)와 목록에 실제 변경·검증 결과 반영. 근거: [React 첫 컴포넌트](https://react.dev/learn/your-first-component), [컴포넌트 import/export](https://react.dev/learn/importing-and-exporting-components). |

### 2. 재사용과 화면 갱신

| 단계 | 상태 | 구분 | 새 핵심 개념 | 수행 범위·완료 기준 |
| --- | --- | --- | --- | --- |
| 15 | 완료 | 변경 | props | `src/components/PageTitle.jsx`가 title prop을 받아 h1으로 표시하고 `HomePage.jsx`가 제목을 전달하도록 분리했다. 모듈 응답·변환, 실제 제목의 계산 스타일·박스, prop 임시 변경과 파일·화면 복구, 새로고침, 오류 없음, 로컬 링크, 서버 종료 7건 통과, 실패 0건. 자료 보완 후 링크 검사 1건 추가 통과. [학습자료](learning/016-props.md)와 목록에 실제 변경·검증 반영. 화면 갱신이 HMR인지 전체 새로고침인지는 미확인. 근거: [React props](https://react.dev/learn/passing-props-to-a-component). |
| 16 | 완료 | 변경 | 배열 렌더링 | HomePage의 정적 records 배열 3개를 map으로 li 목록에 표시하고 기존 제목을 유지했다. 모듈 변환·내용/순서·계산 스타일/박스·새로고침·예상 key 경고 외 오류 없음·서버 종료 6건 통과, 실패 0건. 자료 보완 후 로컬 링크 대상 28건 통과(앵커 정확성 미검증). [학습자료](learning/017-array-rendering.md)와 목록에 실제 변경·검증 반영. key 미지정 경고는 17단계 범위로 남겼으며 원격 조회·state·이벤트는 미구현. 근거: [React 목록 렌더링](https://react.dev/learn/rendering-lists). |
| 17 | 완료 | 변경 | key | records에 고정 고유 id를 추가하고 li에 key={record.id}를 지정했다. 모듈 변환·화면/스타일/박스·새로고침·key 경고 포함 오류 없음·같은 root에서 순서 역전/복구 시 id별 li 객체 유지·링크·서버 종료 15항목 통과, 현재 실패 0건. 검증 스크립트의 jsxDEV 모듈 처리 오류 수정 후 order만 재실행했다. [학습자료](learning/018-key.md)와 목록에 실제 변경·검증 결과를 반영했다. 자료 보완 후 링크 검사 2항목 추가 통과. 제품에 state·이벤트 미도입. 근거: [React 목록 key](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key). |
| 18 | 완료 | 변경 | React 이벤트 처리 | HomePage에 handleCheckRecordCount와 type=button·onClick 버튼을 추가해 현재 정적 기록 수를 alert로 표시한다. 모듈·화면/스타일/박스·자동 실행 없음·마우스/키보드 조작·새로고침·오류 없음·링크·서버 종료 19항목 통과, 현재 실패 0건. 검증 스크립트의 초점 준비 및 결과 스냅샷 오류를 보완해 events만 재실행했다. [학습자료](learning/019-react-events.md)와 목록에 실제 변경·검증을 반영했다. 자료 보완 후 링크 검사 2항목 추가 통과. state는 미도입. 근거: [React 이벤트 처리](https://react.dev/learn/responding-to-events). |
| 19 | 완료 | 변경 | state | HomePage에 visibleCount 숫자 상태(초기 2), 전체 보기·2개 보기 고정 버튼과 slice 기반 목록을 추가했다. 이벤트 → 상태 변경 → 렌더링·키보드·반복·새로고침·실제 표시 등 실질 21항목 현재 통과. 최초 render 훅 오류는 재실행 및 강제 재최적화에서 재현되지 않아 원인 미확정으로 기록했다. state·links 성공 근거 재사용. [학습자료](learning/020-state.md)와 목록에 실제 변경·검증 반영. |
| 20 | 완료 | 변경 | 조건부 렌더링 | HomePage에 목록 비우기 버튼(`setVisibleCount(0)`)을 추가하고 `visibleRecords.length === 0` 삼항 연산자로 안내 p와 ul을 상호배타로 렌더링했다. 초기 2·전체/2개·alert 3개 유지. 빈 안내 계산 스타일/박스·ul/li DOM 부재·복원 반복·키보드·alert·새로고침·링크·서버 종료 33항목 통과, 실패 0건. 자료 보완 후 links만 재실행. [학습자료](learning/021-conditional-rendering.md)와 목록에 실제 변경·검증 반영. HMR·앵커 정확성 미검증. 근거: [React 조건부 렌더링](https://react.dev/learn/conditional-rendering). |
| 21 | 완료 | 변경 | children | `Layout.jsx`가 children을 main에 표시하고 `SiteHeader.jsx`를 공통 헤더로 구성했다. `main.jsx`에서 HomePage를 Layout으로 감쌌으며 기존 페이지·패키지 변경 없이 CSS·라우팅은 미도입. 구조·실제 표시/박스·목록 전환·alert·새로고침·오류 없음·링크·서버 종료 23항목 통과, 실패 0건. [학습자료](learning/022-children.md)와 목록에 실제 변경·검증 반영. 근거: [React children](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children). |
| 22 | 완료 | 변경 | CSS import | `src/styles/global.css`를 `main.jsx`에서 import하여 최소 전역 스타일을 적용했다. 기존 컴포넌트·상태·이벤트 유지. CSS 모듈 응답·개발 서버 style 주입·계산 스타일/박스·목록 전환·alert·새로고침·오류 없음·링크·서버 종료 26항목 통과, 실패 0건. 자료 보완 후 links 3항목 추가 통과. [학습자료](learning/023-css-import.md)와 목록에 실제 변경·검증 반영. CSS HMR·프로덕션 빌드는 미검증. 근거: [Vite CSS](https://vite.dev/guide/features.html#css). |

### 3. 페이지 이동

| 단계 | 상태 | 구분 | 새 핵심 개념 | 수행 범위·완료 기준 |
| --- | --- | --- | --- | --- |
| 23 | 완료 | 설명 | 클라이언트 라우팅 | URL과 화면의 관계·현재 고정 렌더링 방식·대안과 React Router Declarative 선택 근거를 [학습자료](learning/024-client-routing.md)로 작성하고 목록에 연결했다. History API·Vite SPA fallback·배포 rewrite의 공식 근거를 확인했다. 자료·목록 로컬 링크 대상 38건 통과, 실패 0건. 공식 근거 보완 후 links만 재실행했으며 기존 결과는 보존했다. 설치·소스 변경·실행 검증 없음. 예시는 미실행으로 구분했다. React Router 설치 버전·호환성 및 개발 서버의 실제 직접 접근·새로고침 검증은 24단계에 남겼다. |
| 24 | 완료 | 변경 | 라우트 매핑 | React Router `8.4.0`을 설치하고 `main.jsx`의 BrowserRouter·Routes·Route로 5개 경로를 매핑했다. 추가 4페이지는 PageTitle·안내만 표시하며 기존 홈·Layout·CSS 유지. 직접 접근·새로고침·실제 표시/스타일/박스·등록 경로 선택·홈 상태/alert·오류 없음·링크·서버 종료 32항목 통과, 실패 0건. 자료 보완 후 links 2항목 추가 통과. [학습자료](learning/025-route-mapping.md)와 목록에 실제 변경·검증 반영. Link·useParams·Not Found·원격·빌드는 미도입. |
| 25 | 완료 | 변경 | 내비게이션 링크 | SiteHeader에 Link로 홈·학습 기록·기록 등록 링크를 추가하고 링크 간격 CSS를 적용했다. 클릭 URL/제목·재로드 없음·뒤로/앞으로·5개 경로 직접 접근/새로고침·공통 헤더·계산 스타일/박스·Tab/Enter·홈 회귀·오류 없음·링크·서버 시작/종료 19항목 통과, 실패 0건. 검사 타이밍 보완 후 nav, 서버 소유 불명확으로 home만 재실행했다. [학습자료](learning/026-navigation-links.md)와 목록에 실제 변경·검증 반영, 자료 보완 후 links 2항목 추가 통과. NavLink·useParams·Not Found 미도입. |
| 26 | 완료 | 변경 | 라우트 파라미터 | 정적 기록 3개를 src/lib/staticRecords.js에서 공유하고 목록 Link·상세 useParams+find로 제목·프로젝트를 표시했다. 알 수 없는 id는 최소 안내만 표시한다. 식별자 변경·목록 이동·직접 접근/새로고침·뒤로/앞으로·실제 표시/스타일/박스·키보드·홈 회귀·오류 없음·링크·서버 시작/종료 21항목 통과, 실패 0건. 재검증 없이 순차 실행. [학습자료](learning/027-route-params.md)와 목록에 실제 변경·검증 반영. 상세 사이 이동은 History API+popstate로 검사했으며 HMR·빌드·인코딩된 id는 미검증. |
| 27 | 대기 | 변경 | Not Found | 잘못된 주소에 전용 페이지를 표시한다. 존재하지 않는 기록은 조회 단계에서 별도로 처리한다. |

### 4. 원격 데이터 조회

| 단계 | 상태 | 구분 | 새 핵심 개념 | 수행 범위·완료 기준 |
| --- | --- | --- | --- | --- |
| 28 | 대기 | 설명 | 데이터 모델 | 학습 기록 하나를 핵심 데이터로 유지하고 제목·프로젝트·날짜·분류·본문의 필드와 식별자를 확정한다. |
| 29 | 대기 | 설명 | Supabase | 원격 데이터 서비스를 사용하는 이유와 현재 프로젝트에서 맡길 역할을 설명한다. |
| 30 | 대기 | 변경 | 테이블 | Supabase 계정·프로젝트 연결 상태를 확인하고 확정한 기록 테이블을 구성한다. 실제 적용한 스키마를 파일로 남긴다. |
| 31 | 대기 | 설명 | 클라이언트 공개 키 | 브라우저에 둘 수 있는 키와 서버 전용 키를 구분한다. 실제 키 값은 자료나 저장소에 기록하지 않는다. |
| 32 | 대기 | 변경 | 환경변수 | 연결 설정을 환경변수로 분리하고 .env를 Git에서 제외한다. 값 없는 예시 파일만 버전 관리한다. |
| 33 | 대기 | 변경 | 데이터 접근 정책 | 원격 데이터의 읽기·쓰기 허용 범위와 RLS를 확정하고 정책을 파일로 남긴다. 실제 접근 검증은 아래 원격 조회 단계에서 수행하고, 그 검증 전 실제 자료는 등록하지 않는다. 인증을 임의 추가하지 않는다. |
| 34 | 대기 | 변경 | Supabase 클라이언트 | 선택한 SDK와 연결 초기화를 src/lib에 구성한다. 원격 데이터 변경은 아직 하지 않는다. |
| 35 | 대기 | 변경 | 원격 조회 | 버튼으로 테스트 기록 조회를 실행하고 반환 데이터로 목록 상태를 갱신한다. 조회 대상·테스트 데이터·정리 범위를 명시하고 앞서 설정한 읽기·쓰기 접근 정책을 검증한다. |
| 36 | 대기 | 변경 | useEffect | 페이지 진입 시 조회하도록 연결하고 실행 시점을 확인한다. |
| 37 | 대기 | 변경 | Effect 의존성 | 상세 페이지의 식별자 변화에 맞춰 해당 기록을 조회한다. 식별자 변경 시 재조회되는지 확인한다. |
| 38 | 대기 | 변경 | Effect cleanup | 빠른 페이지 이동에서 이전 조회 응답이 현재 화면을 덮지 않도록 정리 처리를 추가하고 확인한다. |
| 39 | 대기 | 변경 | 로딩 상태 | 조회 시작·완료에 따라 로딩 UI를 표시한다. 상태와 실제 화면 변화를 검사한다. |
| 40 | 대기 | 변경 | 에러 상태 | 조회 실패를 상태와 오류 UI로 표시하고 재시도 동작을 확인한다. |
| 41 | 대기 | 변경 | 빈 결과 | 목록 0건과 상세 기록 없음의 표시를 구현한다. 로딩·에러 표시와 충돌하지 않는지 확인한다. |
| 42 | 대기 | 변경 | 커스텀 훅 | 조회·상태 관리 흐름을 src/hooks로 분리하고 기존 목록·상세 동작을 유지한다. |

### 5. 기록 등록·수정·삭제

| 단계 | 상태 | 구분 | 새 핵심 개념 | 수행 범위·완료 기준 |
| --- | --- | --- | --- | --- |
| 43 | 대기 | 변경 | controlled input | 등록 폼의 입력값을 React 상태와 연결한다. 사용자 입력 → 상태 변경 → 입력·미리보기 렌더링을 확인한다. |
| 44 | 대기 | 변경 | 폼 검증 | 필수값 검증과 입력 오류 표시를 구현한다. 잘못된 입력으로 원격 요청이 나가지 않는지 확인한다. |
| 45 | 대기 | 변경 | 원격 등록 | 폼 값으로 테스트 기록을 생성한다. 성공 결과와 요청 실패를 표시하고 원격 저장 여부를 확인한다. |
| 46 | 대기 | 변경 | 프로그램에 의한 이동 | 등록 성공 후 목록 또는 상세로 이동한다. 이동한 화면에서 저장 결과가 보이는지 확인한다. |
| 47 | 대기 | 변경 | 제출 중 상태 | 전송 중 버튼 비활성화 또는 스피너를 구현한다. 중복 요청 방지와 성공·실패 후 해제를 확인한다. |
| 48 | 대기 | 변경 | 폼 초기값 | 수정 페이지에서 조회한 기록으로 입력 상태를 채운다. 기록을 바꿨을 때 이전 입력이 남지 않는지 확인한다. |
| 49 | 대기 | 변경 | 원격 수정 | 수정 폼을 저장하고 성공 시 이동 또는 갱신한다. 필수값·실패 표시·전송 중 처리를 유지하고 원격 결과를 확인한다. |
| 50 | 대기 | 변경 | 원격 삭제 | 테스트 기록 삭제 후 목록을 갱신하거나 목록으로 이동한다. 실패 표시와 원격 삭제 결과를 확인한다. |
| 51 | 대기 | 변경 | 없음 | 실제 중복 UI를 재사용 컴포넌트로 정리한다. prop을 받는 컴포넌트 최소 8개, 페이지/UI 역할 분리, 공통 헤더·내비게이션·레이아웃, 로딩·에러·빈 상태 컴포넌트 통일을 확인한다. 개수를 채우기 위한 무의미한 분리는 하지 않는다. |
| 52 | 대기 | 확인 | 없음 | 원격 CRUD·필수값·전송 중·네트워크 및 권한 실패를 시나리오별로 확인한다. 이벤트 → 상태 변경 → 렌더링이 목록 조작·폼 입력·CRUD 결과 등 최소 3곳에서 나타나는지 확인한다. 테스트 데이터를 정리한다. |

### 6. 기존 학습자료 이전

| 단계 | 상태 | 구분 | 새 핵심 개념 | 수행 범위·완료 기준 |
| --- | --- | --- | --- | --- |
| 53 | 대기 | 설명 | 자료 본문 표현 | B1-1·B1-2 학습자료의 본문 표시 방식과 이전 범위를 확정한다. 새 표시 도구가 필요하면 도입 전에 이 표에 개념별 단계를 추가한다. |
| 54 | 대기 | 변경 | 자료 이전 | 선택한 본문 표시와 등록 방식으로 B1-1·B1-2 자료를 서비스에 옮긴다. 원본을 보존하고 다른 프로젝트로 범위를 넓히지 않는다. 제목·본문·링크의 표시를 확인한다. |

### 7. 배포와 제출

| 단계 | 상태 | 구분 | 새 핵심 개념 | 수행 범위·완료 기준 |
| --- | --- | --- | --- | --- |
| 55 | 대기 | 변경 | 프로덕션 빌드 | 배포용 결과물을 생성하고 로컬 미리보기에서 주요 경로가 표시되는지 확인한다. |
| 56 | 대기 | 설명 | Vercel | 선택한 호스팅 서비스의 역할과 저장소 연동 배포 흐름을 설명한다. |
| 57 | 대기 | 변경 | 배포 환경변수 | Vercel 프로젝트 연결 상태를 확인하고 필요한 환경변수를 설정한다. 비밀값 없는 설정 절차를 파일로 남긴다. |
| 58 | 대기 | 변경 | SPA rewrite | 상세 URL 직접 접근·새로고침을 위한 배포 라우팅 설정을 추가한다. |
| 59 | 대기 | 확인 | 없음 | 사용자의 푸시 요청과 GitHub 저장소 연동을 전제로 배포한다. 요청이 없으면 배포 준비 상태를 기록하고 원격 푸시를 실행하지 않는다. 배포 후 외부 URL에서 5개 라우트·Not Found·목록·상세·원격 CRUD·직접 접근·새로고침을 검증한다. 테스트 데이터를 정리한다. |
| 60 | 대기 | 변경 | 없음 | 루트 README에 로컬 설치·실행 명령과 기술 스택을 작성한다. 루트 README 작업은 사용자에게 명시적으로 요청받은 뒤 수행한다. 제출 URL과 GitHub 저장소 URL을 확인하고, 푸시는 사용자 요청 시에만 한다. |
| 61 | 대기 | 확인 | 없음 | React 18 이상·컴포넌트 8개와 prop·5개 라우트와 Not Found·상태 변화 3곳·controlled input·커스텀 훅·원격 CRUD·실패/로딩/빈 UI·환경변수와 민감정보 제외·배포 URL·GitHub URL·README 조건의 근거를 이 문서에 남기고 제출을 마감한다. |

## 범위 밖의 선택 사항

Context·메모이제이션·인증·TypeScript·반응형은 필수가 아니며 현재 작업 단계에 포함하지 않는다. 사용자 요청이나 현재 문제의 근거 없이 추가하지 않는다. `/login`은 과제 예시이며 로그인 구현 의무가 아니다. 시각적 완성도보다 React 구조와 데이터 흐름을 우선한다.
