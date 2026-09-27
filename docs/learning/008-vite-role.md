# 008 — Vite는 개발 서버와 배포 빌드를 맡는 도구다

> **현재 단계**: 정규 07단계(설명). 설치·파일 생성·소스 변경·실행 검증은 하지 않았다. 이 문서의 명령·파일 구성은 모두 **미실행 예시**이며, 실제 도입은 08단계에서 수행한다.

## 1. 학습 목적

- 지금처럼 `index.html`을 브라우저로 직접 여는 방식이 앞으로의 React SPA 작업에서 어디까지 통하고 어디서 막히는지 구분한다.
- Vite가 맡는 두 역할인 **개발 서버**와 **프로덕션 빌드**를 이해한다.
- 대안(직접 실행 유지, 빌드 도구 없이 React 사용, 다른 빌드 도구)과 비교해 Vite를 선택한 근거를 정리한다.

## 2. 현재 프로젝트 상태

현재 저장소에는 제목 한 줄을 표시하는 `index.html`만 있다. `package.json`, Vite, React는 아직 없다.

```html
<!-- index.html (현재 실제 파일의 body) -->
<body>
  <h1>학습 기록 서비스</h1>
</body>
```

이 파일은 브라우저가 `file://` 주소로 직접 열어도 표시된다([001 — index.html](001-index-html.md)). 브라우저가 HTML을 읽어 그대로 그리면 되므로 중간 도구가 필요 없다.

## 3. 해결할 문제 — 앞으로 필요한 것

이번 과제는 React 18 이상의 SPA로 5개 이상의 라우트, 재사용 컴포넌트, 원격 CRUD를 구현하고 배포 URL로 제출해야 한다([진행 상태](../progress.md)). 이를 위해 앞으로 소스는 다음처럼 바뀐다.

| 앞으로 필요한 것 | 직접 연 `index.html`로 가능한가 | 근거 |
| --- | --- | --- |
| 코드를 여러 파일로 나누고 `import`로 연결 | `file://`에서는 모듈 스크립트가 CORS 오류로 막힌다. **로컬 서버가 필요**하다. | [MDN JavaScript 모듈](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) |
| npm으로 설치한 `react` 같은 패키지를 이름으로 가져오기 | 브라우저는 `"react"` 같은 이름(bare specifier)을 스스로 경로로 바꾸지 못한다. import map 등 별도 설정이 필요하다. | [MDN JavaScript 모듈](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) |
| JSX로 화면 작성 | 브라우저는 JSX를 JavaScript 문법으로 읽지 못해 **변환이 필요**하다. | [React — 기존 프로젝트에 React 추가](https://react.dev/learn/add-react-to-an-existing-project) |
| 배포용 결과물 | 모듈을 파일 단위로 그대로 배포하면 중첩 import마다 네트워크 왕복이 생겨 비효율적이다. 묶고 최적화하는 빌드가 필요하다. | [Vite를 쓰는 이유](https://vite.dev/guide/why) |

즉 문제는 "HTML을 표시하는 것"이 아니라 "여러 파일·패키지·JSX로 된 소스를 개발 중에 브라우저에서 돌리고, 제출 때 배포 가능한 결과물로 만드는 것"이다. 모듈·JSX 자체는 09·11~13단계에서 다루며 여기서는 "도구가 필요해지는 이유"로만 언급한다.

## 4. B1-1 방식과 무엇이 달라졌나

| 구분 | B1-1 | B1-2(이번 과제) |
| --- | --- | --- |
| 기술 조건 | 순수 JavaScript, 라이브러리 금지 | React 18 이상 필수, npm 패키지 사용 |
| 소스 형태 | 브라우저가 그대로 읽는 HTML·CSS·JS | 여러 모듈 파일, npm 패키지, JSX |
| 실행 방식 | 파일을 직접 열거나 정적 서버로 제공 | 변환·경로 해석을 해주는 개발 서버 필요 |
| 배포 | 작성한 파일을 그대로 올림 | 빌드한 결과물(`dist`)을 올림 |

**기존 방식을 계속 쓸 수 있는가?** 현재의 정적 제목 화면까지는 가능하다. 그러나 React 패키지를 npm으로 설치해 이름으로 가져오고 JSX를 쓰는 순간, 직접 열기만으로는 동작하지 않는다(3절 근거). B1-1의 "라이브러리 금지" 조건이 사라지고 React 사용이 요구되었으므로 실행 방식도 바꿔야 한다. B1-1의 순수 JavaScript·소스 구조는 계승하지 않는다([AGENTS.md](../../AGENTS.md)).

## 5. Vite의 역할

[Vite 시작하기](https://vite.dev/guide/)에 따르면 Vite는 두 부분으로 되어 있다.

1. **개발 서버**: 브라우저의 네이티브 ES 모듈 위에 기능을 더해 소스를 제공한다. 파일을 요청받을 때 필요한 변환을 하고, 수정 사항을 새로고침 없이 반영하는 HMR(Hot Module Replacement, 바뀐 모듈만 교체)을 제공한다. 앱 소스는 요청 시 변환해 주고, 의존성 패키지는 미리 묶어 둔다([Vite를 쓰는 이유](https://vite.dev/guide/why)).
2. **빌드 명령**: 배포용으로 코드를 묶고 최적화한 결과물을 만든다. 기본 출력 위치는 `dist` 폴더다([정적 사이트 배포](https://vite.dev/guide/static-deploy)).

특히 Vite는 **`index.html`을 진입점이자 소스의 일부**로 다룬다. 공식 문서는 `index.html`이 숨겨지지 않고 프로젝트의 "앞과 중심"에 있다고 설명한다. 그래서 현재의 `index.html`을 버리지 않고 그대로 Vite의 시작점으로 쓸 수 있다. 이것이 08단계에서 "기존 HTML이 개발 서버에서 표시되는지"부터 확인하는 이유다.

실행 환경은 [Node.js](003-nodejs-role.md)이고, Vite 자체는 [npm](004-npm-role.md)으로 프로젝트에 설치해 [package.json](005-package-json-role.md)·[package-lock.json](006-package-lock-json-role.md)에 기록되며 실제 파일은 [node_modules](007-node-modules-role.md)에 놓인다. 이용자의 브라우저에는 Vite가 아니라 빌드 결과물만 전달된다.

## 6. 대안 비교

| 대안 | 가능 여부 | 필요한 추가 설정·제약 | 이번에 선택하지 않은 이유 |
| --- | --- | --- | --- |
| `index.html` 직접 열기 유지 | 현재 정적 화면만 **가능**. 모듈 import·npm 패키지 이름·JSX를 쓰면 **불가능** | `file://` 모듈 CORS 제한, 패키지 이름 해석 불가, JSX 변환 없음 | 과제의 React SPA 요구를 충족할 수 없다. |
| 빌드 도구 없이 React 사용(정적 서버 + import map + CDN의 ES 모듈, JSX 대신 `createElement`) | **가능하지만 선택하지 않음** | 로컬 정적 서버 별도 필요, import map으로 패키지 URL 직접 지정, JSX 대신 [`createElement`](https://react.dev/reference/react/createElement) 호출, 배포 최적화(묶기·축소)를 직접 해결 | 설정을 손으로 관리해야 하고 JSX를 쓸 수 없어 컴포넌트 학습 코드가 장황해진다. npm·package-lock.json으로 버전을 고정하는 흐름과도 어긋난다. |
| 다른 빌드 도구(Parcel, Rsbuild 등) | **가능하지만 선택하지 않음** | 각 도구의 설치·설정 방식 학습 | React 공식 문서가 Vite와 함께 권장하는 도구로 기능(개발 서버·JSX·번들링)은 유사하다. 필수 선택이 아니며, 배포 대상 Vercel의 Vite 안내와 이미 확정한 기술 구성([진행 상태](../progress.md))에 맞춰 Vite를 쓴다. |
| React 프레임워크(React Router 프레임워크 모드, Next.js 등) | **가능하지만 선택하지 않음** | 서버 렌더링·파일 기반 라우팅 등 자체 규칙 학습 | React 공식 문서는 대부분 프로젝트에 프레임워크를 권하지만, 이번 과제는 클라이언트 SPA와 컴포넌트·상태·비동기 흐름 이해가 목적이다. 프레임워크 규칙이 이 흐름을 가려 선택하지 않았다([React — 처음부터 만들기](https://react.dev/learn/build-a-react-app-from-scratch)). |

React 공식 문서는 빌드 도구가 "소스 코드를 묶고 실행하는 기능, 로컬 개발 서버, 배포용 빌드 명령"을 제공한다고 설명하며 Vite·Parcel·Rsbuild를 예로 든다. 이 도구들은 기본적으로 클라이언트 전용 SPA를 지원하는데, 이는 이번 과제 범위와 일치한다. 다만 처음부터 구성하는 방식은 "직접 만든 임시 프레임워크"가 될 수 있다는 트레이드오프도 함께 명시되어 있다. 이번 과제는 라우팅을 React Router, 데이터를 Supabase로 필요한 만큼만 추가해 이 부담을 제한한다.

## 7. 선택 근거 요약

- 과제가 React SPA를 요구하므로 모듈·패키지·JSX를 처리할 도구가 **필요하다**(3절). 이 중 Vite는 필수가 아닌 **선택**이다(6절).
- Vite는 현재 `index.html`을 그대로 진입점으로 쓰므로 지금 화면에서 한 단계씩 확장하기 쉽다.
- 수동 설치를 공식 지원하므로 React 템플릿 전체를 한 번에 생성하지 않고 필요한 파일만 단계별로 추가할 수 있다.
- 개발(`dev`)·배포 빌드(`build`)·빌드 미리보기(`preview`)를 한 도구로 처리하고 배포 대상 Vercel이 Vite 빌드를 지원한다([Vercel의 Vite 배포](https://vercel.com/docs/frameworks/frontend/vite)).
- 현재 Node.js `v24.18.1`은 Vite 공식 요구 범위(20.19+ 또는 22.12+)를 충족한다([진행 상태](../progress.md)의 버전 기록, 2026-09-25 확인).

## 8. 다음 실행 흐름 (미실행 예시)

아래는 [Vite 시작하기](https://vite.dev/guide/)의 수동 설치 절차를 이 프로젝트에 대입한 **예시**다. 아직 어떤 명령도 실행하지 않았고 어떤 파일도 생성되지 않았다. 실제 명령·파일 구성·버전은 08단계에서 결정한다.

```bash
# 미실행 예시 — 08단계에서 확정
npm install -D vite   # Vite를 개발 의존성으로 설치
npx vite              # 개발 서버 시작 (기본 http://localhost:5173)
```

이 명령을 실행하면 예상되는 변경(미실행, 08단계에서 실제 확인):

| 대상 | 예상 변화 |
| --- | --- |
| `package.json` | 없으면 생성, `devDependencies`에 `vite` 기록 |
| `package-lock.json` | 생성 또는 갱신, 실제 설치 버전 고정 |
| `node_modules/` | Vite와 의존 패키지 설치, `.bin`에 실행 파일 연결. Git에서는 제외 |
| `index.html` | 변경 없음. 개발 서버의 진입점으로 사용 |

공식 문서가 안내하는 npm scripts 구성 예시(미실행):

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

| 스크립트 | 역할 | 이 프로젝트에서 쓰는 단계 |
| --- | --- | --- |
| `dev` | 개발 서버 시작 | 08단계부터 |
| `build` | 배포용 결과물을 `dist`에 생성 | 55단계(프로덕션 빌드) |
| `preview` | 빌드 결과를 로컬에서 확인. **프로덕션 서버가 아니다** | 55단계 |

단계 순서: **07 Vite 설명(현재)** → 08 최소 npm/Vite 구성과 기존 HTML의 개발 서버 표시 확인 → 09 JavaScript 모듈 설명 → 10 React 루트 → 11 Vite 설정 파일 → 12 Vite 플러그인 → 13 JSX.

## 9. 확인 결과

설명 단계이므로 실행 검증은 해당하지 않는다. Vite 설치·개발 서버 표시·빌드는 08단계와 55단계에서 확인한다.

## 10. 남은 확인

- 실제 설치될 Vite 버전과 현재 Node.js의 호환성은 08단계 설치 시 확인한다.
- `package.json`의 생성 방법과 scripts 최종 구성은 08단계에서 결정한다.
- JSX 변환을 위한 설정 파일·플러그인의 필요 여부는 11·12단계에서 확인한다.

## 참고자료

- [Vite 시작하기](https://vite.dev/guide/) — 개발 서버·빌드 구성, Node.js 요구 버전, 수동 설치, `index.html` 진입점, `dev`/`build`/`preview` scripts
- [Vite를 쓰는 이유](https://vite.dev/guide/why) — 네이티브 ES 모듈 기반 개발 서버, 프로덕션 번들링이 필요한 이유
- [Vite 정적 사이트 배포](https://vite.dev/guide/static-deploy) — `dist` 출력, `vite preview`는 프로덕션 서버가 아님
- [MDN JavaScript 모듈](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) — `file://` 모듈 CORS 제한, bare specifier와 import map
- [React — 처음부터 React 앱 만들기](https://react.dev/learn/build-a-react-app-from-scratch) — 빌드 도구의 역할과 Vite·Parcel·Rsbuild, 프레임워크와의 트레이드오프
- [React — 기존 프로젝트에 React 추가](https://react.dev/learn/add-react-to-an-existing-project) — JSX 변환 필요, 모듈 컴파일 환경이 없으면 Vite 사용 안내
- [React — createElement](https://react.dev/reference/react/createElement) — JSX 대신 쓸 수 있는 함수
- [Vercel의 Vite 배포](https://vercel.com/docs/frameworks/frontend/vite) — 2026-09-25 진행 상태 기록의 확인 근거(이번 세션에서 재확인하지 않음)

공식 문서는 2026-09-27 확인(Vercel 제외).
