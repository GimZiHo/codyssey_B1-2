# 003. Node.js의 역할 — 개발 도구를 실행하는 환경

- **단계**: 02 설명 (구현 없음)
- **새 개념**: Node.js는 브라우저 밖에서 JavaScript를 실행하는 런타임이다.
- **현재 프로젝트 상태**: 제목 한 줄의 [`index.html`](../../index.html)만 있다. `package.json`·npm 패키지·Vite는 아직 도입하지 않았다.
- **이번 단계에서 한 일**: 이 자료 작성과 [자료 목록](README.md) 연결뿐이다. 설치·명령 실행·파일 생성은 하지 않았다. 아래 명령 예시는 설치 확인 기록을 빼면 모두 **미수행**이다.

## 1. 해결할 문제

[React의 역할](002-react-role.md)에서 React로 화면 갱신을 맡기기로 했고, 개발·빌드 도구로 Vite를 선택했다([진행 상태](../progress.md)의 기술 구성). 이제 생기는 질문은 다음과 같다.

> Vite 같은 개발 도구는 **어디에서** 실행되는가?

지금까지의 방식은 이렇다.

```text
index.html 파일 ──(브라우저로 직접 열기)──▶ 브라우저가 HTML을 읽고, <script>의 JavaScript를 실행
```

여기서 JavaScript를 실행하는 곳은 **브라우저 하나뿐**이다. 그런데 Vite는 웹 페이지에 들어가는 코드가 아니라 개발자 컴퓨터에서 돌아가는 프로그램이다. 파일을 읽고, 로컬 개발 서버를 띄우고, 배포용 파일을 `dist` 폴더에 써야 한다. Vite 자체도 JavaScript로 작성된 도구이므로 **브라우저가 아닌 곳에서 JavaScript를 실행할 환경**이 필요하다. 그 환경이 Node.js다.

## 2. 핵심 개념: 런타임

- **JavaScript 엔진**: JavaScript 코드를 해석·실행하는 부품. Chrome에는 V8 엔진이 들어 있다.
- **런타임(runtime)**: 엔진에 "사용할 수 있는 기능(API)"을 붙여 실제로 코드를 실행할 수 있게 만든 환경.

Node.js 공식 문서는 Node.js를 "오픈 소스, 크로스 플랫폼 JavaScript 런타임 환경"이라 하고, "Chrome의 핵심인 V8 JavaScript 엔진을 브라우저 밖에서 실행한다"고 설명한다([Introduction to Node.js](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)).

같은 언어라도 런타임마다 제공하는 기능이 다르다([Differences between Node.js and the Browser](https://nodejs.org/en/learn/getting-started/differences-between-nodejs-and-the-browser)).

| 구분 | 브라우저 | Node.js |
| --- | --- | --- |
| 실행 위치 | 이용자의 브라우저 탭 | 개발자 컴퓨터의 터미널 |
| 주로 쓰는 기능 | `document`, `window` 등 DOM·웹 플랫폼 API | 파일 시스템 접근 등 Node.js 모듈 |
| 없는 기능 | 로컬 파일 시스템 자유 접근 | `document`, `window` (화면이 없다) |
| 버전 선택 | 이용자가 쓰는 브라우저를 개발자가 고를 수 없다 | 개발자가 실행 버전을 정할 수 있다 |

즉 Node.js는 화면을 그리는 곳이 아니라, **파일을 다루는 도구 프로그램을 돌리는 곳**이다.

## 3. 기존 방식과 대안 비교

"Vite 같은 개발 도구를 실행한다"는 목적 기준으로 비교한다. 다른 JavaScript 런타임(예: Deno, Bun)까지의 비교는 이번 범위에서 다루지 않는다.

| 방식 | 가능 여부 | 필요한 추가 구성 | 제약 | 이번 판단 |
| --- | --- | --- | --- | --- |
| A. 지금처럼 `index.html`을 브라우저로 직접 열기 | 현재 화면 표시는 **가능** | 없음 | 브라우저 안의 JavaScript는 개발자 컴퓨터의 파일을 읽고 써서 빌드 결과를 만드는 도구 역할을 할 수 없다. Vite 개발 서버·빌드를 이 방식으로 실행하는 것은 **불가능**하다. | 기존 화면 확인용으로는 유효하지만 Vite 도입에는 부족하다. |
| B. 로컬 설치 없이 React 사용 (온라인 샌드박스, React가 제공하는 예제 HTML 파일) | **가능**. React 공식 문서가 "React를 써 보는 데 아무것도 설치할 필요가 없다"며 온라인 샌드박스와 로컬 HTML 파일 예제를 안내한다([Installation](https://react.dev/learn/installation)). | 없음 또는 외부 서비스 계정 | 이 저장소의 파일 구조(`src/pages` 등)와 Vite 빌드·Vercel 배포 흐름을 그대로 쓰지 않는다. | 가능하지만 **선택하지 않음**. 이미 Vite·npm 기반 구성을 선택했기 때문이다. |
| C. 개발자 컴퓨터에서 Node.js로 Vite 실행 | **가능**. Vite 공식 문서가 Node.js 20.19+ 또는 22.12+를 요구한다([Vite Getting Started](https://vite.dev/guide/)). | Node.js 설치(이미 있음), 이후 단계의 패키지 환경 | Node.js 버전이 Vite 요구 범위에 맞아야 한다. | **선택**. |

정리하면 다음 두 가지를 구분해야 한다.

- **React 자체가 Node.js를 요구하는 것은 아니다.** B처럼 로컬 Node.js 없이도 React를 써 볼 수 있다. React는 브라우저에서 화면을 갱신하는 라이브러리이고 Node.js는 런타임이므로 서로 다른 것이다.
- **이 프로젝트가 선택한 Vite가 Node.js를 요구한다.** 그래서 이 프로젝트에서는 개발자 컴퓨터에 Node.js가 필요하다.

### 이전 과제(B1-1)와 달라진 점

B1-1은 순수 JavaScript·라이브러리 금지 조건이었으므로 브라우저만으로 충분했다. B1-2는 React·Vite를 쓰기로 해서 개발 도구 실행 환경이 추가로 필요해졌다. 기존 방식 A는 여전히 HTML 파일을 여는 데는 쓸 수 있지만, Vite를 도입한 뒤에는 개발 서버와 빌드를 통해 화면을 확인하게 된다(07·08 단계에서 다룬다).

## 4. 선택 근거와 역할의 경계

### 개발 도구 실행 환경과 이용자 브라우저는 다르다

```text
[개발자 컴퓨터]                                   [이용자]
 Node.js ─ Vite 실행 ─┬─ 개발 서버 ──────────▶ 개발자 브라우저에서 확인
                      └─ 빌드 → dist/ 정적 파일 ──(배포)──▶ 이용자 브라우저가 실행
```

- Node.js는 **개발자 컴퓨터**에서 Vite를 돌리는 데 쓰인다.
- Vite 빌드 결과는 "프로덕션용으로 최적화된 정적 에셋"이며 기본 위치는 `dist`다. 이 폴더를 원하는 플랫폼에 배포할 수 있다([Vite Getting Started](https://vite.dev/guide/), [Deploying a Static Site](https://vite.dev/guide/static-deploy)).
- 배포 후 이용자는 **자신의 브라우저**로 그 정적 파일을 받아 실행한다. 이용자 컴퓨터에 Node.js를 설치할 필요는 없다.

### 자체 Node.js 백엔드를 만든다는 뜻이 아니다

Node.js 공식 문서에는 Node.js로 HTTP 서버를 만드는 예제도 있다. 그러나 이 프로젝트는 그 예제를 구현하지 않는다. 원격 데이터는 Supabase, 배포는 Vercel이 맡는다([진행 상태](../progress.md)의 기술 구성). 이 프로젝트에서 Node.js의 역할은 **개발 도구 실행**으로 한정된다.

Vite 개발 서버도 Node.js 위에서 도는 서버이지만, 개발 중 확인용이다. Vite 문서는 로컬 미리보기(`vite preview`)도 "프로덕션 서버용이 아니다"라고 밝힌다([Deploying a Static Site](https://vite.dev/guide/static-deploy)).

## 5. 현재 설치 확인 범위

2026-09-26 Codex가 읽기 전용 명령으로 확인한 결과다. 프로젝트 파일은 생성·변경되지 않았다.

| 명령 | 역할 | 실제 결과 |
| --- | --- | --- |
| `command -v node` | 셸이 찾는 `node` 실행파일 경로 확인 | `~/.nvm/versions/node/v24.18.1/bin/node` |
| `node --version` | 설치된 Node.js 버전 확인 | `v24.18.1` |

- 경로에 `.nvm`이 있으므로 nvm(Node 버전 관리 도구)으로 설치된 Node.js다. 이미 설치되어 있어 재설치하지 않았다.
- `v24.18.1`은 Vite 공식 문서의 요구 범위(20.19+, 22.12+)보다 높은 주 버전이다. 이것은 **버전 숫자 비교**일 뿐이다.

**확인하지 않은 것**

- Node.js로 Vite를 실제 실행할 수 있는지(도구 실행 호환성), 개발 서버 표시, 빌드 결과 — 08 단계에서 실제 환경을 구성하며 확인한다.
- 설치할 패키지의 세부 버전 요구 — 설치 시점에 확인한다.

## 6. 실제 작업 순서와 현재 위치

```text
01 React 역할 → [02 Node.js 역할] ← 현재 → 03 npm → 04 package.json → 05 package-lock.json
→ 06 node_modules → 07 Vite → 08 패키지 환경·Vite 실행 명령 구성과 확인
```

- **02(현재)**: 설명만 한다. 파일 생성·변경 없음(이 자료와 목록 제외).
- **03~07**: Node.js 위에서 쓸 패키지 관리와 Vite를 차례로 설명한다. 이 자료에서는 다루지 않는다.
- **08**: 처음으로 실제 명령을 실행해 패키지 파일과 Vite 실행 명령을 구성하고, 기존 HTML 화면이 개발 서버에서 표시되는지 확인한다. 이때 Node.js 설치 상태도 다시 확인한다.

## 7. 질문·추가 확인

- **Node.js를 쓰면 서버 개발을 하는 것인가?** 아니다. 이 프로젝트에서는 개발 도구 실행에만 쓴다.
- **React 앱을 쓰는 이용자도 Node.js가 필요한가?** 아니다. 이용자는 배포된 정적 파일을 브라우저로 실행한다.
- **React를 쓰려면 항상 Node.js가 필요한가?** 아니다. 이 프로젝트가 Vite를 선택했기 때문에 개발자 컴퓨터에 필요한 것이다.

## 참고자료

- [Introduction to Node.js — Node.js](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)
- [Differences between Node.js and the Browser — Node.js](https://nodejs.org/en/learn/getting-started/differences-between-nodejs-and-the-browser)
- [Getting Started — Vite](https://vite.dev/guide/) (Node.js 버전 요구, 빌드 결과)
- [Deploying a Static Site — Vite](https://vite.dev/guide/static-deploy) (`dist` 배포, `vite preview`의 용도)
- [Installation — React](https://react.dev/learn/installation) (로컬 설치 없이 React 사용)

모든 공식 문서는 2026-09-26에 확인했다.
