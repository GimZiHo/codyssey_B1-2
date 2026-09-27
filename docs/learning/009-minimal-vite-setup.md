# 009 — 최소 npm·Vite 환경 구성

정규 단계 08(변경)의 실제 수행 기록이다. 새 핵심 개념은 없고 앞 단계에서 설명한 [Node.js](003-nodejs-role.md)·[npm](004-npm-role.md)·[package.json](005-package-json-role.md)·[package-lock.json](006-package-lock-json-role.md)·[node_modules](007-node-modules-role.md)·[Vite](008-vite-role.md)를 처음으로 함께 적용했다.

## 학습 목적

- 기존 `index.html` 한 장을 바꾸지 않고 Vite 개발 서버로 띄우는 데 필요한 최소 파일과 명령을 확인한다.
- 명령 하나가 어떤 파일을 만들거나 바꾸는지 구분한다.
- 각 선택에서 가능했던 대안과 이번에 선택하지 않은 이유를 정리한다.

## 해결할 문제

지금까지 화면은 브라우저로 `index.html` 파일을 직접 여는 방식으로만 확인했다. 이후 단계의 React·JSX·모듈은 개발 서버와 패키지 설치가 필요하므로([008 Vite](008-vite-role.md) 참고), 이번 단계는 다음만 준비했다.

1. Vite를 실행할 Node.js·npm이 Vite의 요구 버전을 충족하는지 확인한다.
2. 프로젝트에 Vite를 설치하고 설치 내역을 기록한다.
3. `npm run dev` 한 명령으로 개발 서버를 실행하게 한다.
4. 기존 화면이 개발 서버에서 그대로 표시되는지 확인한다.

React·JSX·`src` 폴더·Vite 설정 파일·빌드·배포는 이번 단계에 넣지 않았다.

## 실제 작업 순서

| 순서 | 수행한 작업 | 생성·변경된 것 |
| --- | --- | --- |
| 1 | `command -v node`, `command -v npm`으로 실행 파일 경로를, `node --version`, `npm --version`으로 버전을 확인 | 없음 |
| 2 | 루트에 `package.json`을 직접 작성해 `private`와 `scripts.dev`만 기록 | `package.json` 생성 |
| 3 | `npm install --save-dev vite` 실행 | `package.json`에 `devDependencies` 추가, `package-lock.json` 생성, `node_modules/` 생성 |
| 4 | `npm ls`로 설치 트리 확인, `.gitignore`의 `node_modules/` 제외와 `node_modules/.bin/vite` 연결 확인 | 없음 |
| 5 | `npm run dev`로 개발 서버를 띄워 브라우저에서 화면 확인 후 서버 종료 | 없음 (`index.html` 변경 없음) |

### 1. 버전 확인

| 항목 | 확인 결과 |
| --- | --- |
| Node.js | `v24.18.1` |
| npm | `11.16.0` |
| Vite 8.3.1이 요구하는 Node.js 범위 | `^20.19.0 \|\| >=22.12.0` (`package-lock.json`의 `engines.node`) |

`>=22.12.0`은 22.12.0 이상 모든 버전을 뜻하므로 v24.18.1은 범위 안이다. [Vite 시작하기](https://vite.dev/guide/)도 같은 Node.js 범위를 요구한다. 버전이 맞지 않았다면 설치 전에 Node.js 교체가 먼저 필요했지만 이번에는 기존 설치를 그대로 재사용했다.

### 2. package.json 직접 작성

작성 직후에는 아래 두 필드만 있었다.

- `"private": true` — npm 레지스트리 공개(`npm publish`)를 거부하게 하는 표시다. 이 프로젝트는 배포할 웹 서비스이지 다른 사람이 설치할 패키지가 아니므로 실수로 공개되지 않게 한다.
- `"scripts": { "dev": "vite" }` — `npm run dev`를 실행하면 `vite` 명령이 실행된다.

`name`·`version`은 넣지 않았다. [npm package.json 문서](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)는 패키지를 공개할 계획이 없으면 두 필드가 선택 사항이라고 설명한다. 공개하지 않는 프로젝트이므로 현재는 생략을 유지한다.

### 3. Vite 설치

```bash
npm install --save-dev vite
```

실제 결과: 패키지 15개 설치, `npm audit` 취약점 0건. 이 명령 하나로 세 곳이 바뀌었다.

- `package.json`에 `"devDependencies": { "vite": "^8.3.1" }`가 추가됐다. `^8.3.1`은 "8.x.x 중 8.3.1 이상"을 허용하는 범위다.
- `package-lock.json`이 새로 생겨 실제 설치 버전 Vite `8.3.1`과 하위 의존성 트리를 고정했다. `lockfileVersion`은 `3`이다.
- `node_modules/`에 실제 파일이 설치됐다.

최종 [`package.json`](../../package.json):

```json
{
  "private": true,
  "scripts": {
    "dev": "vite"
  },
  "devDependencies": {
    "vite": "^8.3.1"
  }
}
```

#### 설치 수 15개와 잠금 파일 항목 41개

[`package-lock.json`](../../package-lock.json)의 `packages`에는 루트(`""`)를 포함해 41개 항목이 있다. 설치 수 15개와 다른 이유는 운영체제·CPU별 선택 의존성(`optional`) 때문이다.

| 구분 | 개수 | 내용 |
| --- | --- | --- |
| 루트 항목 `""` | 1 | 이 프로젝트 자신. `devDependencies`만 기록 |
| 필수 패키지 | 13 | `vite`와 `rolldown`, `lightningcss`, `postcss`, `picomatch`, `tinyglobby` 등 하위 의존성 |
| 선택 의존성 | 27 | `rolldown`·`lightningcss`의 플랫폼별 네이티브 바이너리 후보 |

npm은 선택 의존성 중 현재 환경(Linux·x64·glibc)에 맞는 `@rolldown/binding-linux-x64-gnu`와 `lightningcss-linux-x64-gnu` 2개만 설치했다. 13 + 2 = 15개다. 나머지 25개는 다른 운영체제에서 같은 잠금 파일로 설치할 때 쓰도록 기록만 되어 있다. 따라서 잠금 파일 항목 수를 설치된 패키지 수로 읽지 않는다.

### 4. 설치 결과 확인

- `npm ls`로 루트 아래 `vite@8.3.1`이 설치된 것을 확인했다.
- 기존 [`.gitignore`](../../.gitignore)에 이미 `node_modules/`가 있어 설치 폴더는 버전 관리에서 제외된다. 이번에 `.gitignore`를 바꾸지 않았다.
- `node_modules/.bin/vite`는 `../vite/bin/vite.js`를 가리키는 연결이며 실행 가능하다. [`npm run`](https://docs.npmjs.com/cli/v11/commands/npm-run/)은 스크립트를 실행할 때 `node_modules/.bin`을 경로에 추가하므로 `scripts.dev`에 `vite`만 적어도 이 파일이 실행된다.

### 5. 개발 서버 표시 확인

Vite는 설정 파일이 없으면 프로젝트 루트의 [`index.html`](../../index.html)을 진입점으로 제공한다. 그래서 HTML을 옮기거나 고치지 않았다.

## 대안 비교와 선택

| 결정 | 대안 | 가능 여부 | 이번에 선택하지 않은 이유 |
| --- | --- | --- | --- |
| package.json 생성 방법 | **직접 작성 (선택)** | 가능 | 필요한 필드만 두고 각 필드의 역할을 직접 확인할 수 있다. |
| | `npm init -y` | 가능 | `name`·`version`·`main`·`scripts.test`·`license` 등 이번에 쓰지 않는 필드가 함께 생겨 다시 지워야 한다. |
| | `npm create vite@latest` 템플릿 | 가능 | React 템플릿·`src`·설정 파일을 한꺼번에 만든다. 개념별로 하나씩 도입하는 진행 방식과 맞지 않아 쓰지 않았다. |
| Vite 의존성 위치 | **`devDependencies` (선택)** | 가능 | Vite는 개발 서버·빌드에만 쓰고 이용자 브라우저에서 실행되지 않는다. [Vite 시작하기](https://vite.dev/guide/)의 수동 설치도 `npm install -D vite`다. |
| | `dependencies` | 가능 | 공개하지 않는 앱이라 동작은 같지만 실행 코드와 개발 도구의 구분이 흐려진다. |
| | 전역 설치(`npm install -g vite`) | 가능 | 버전이 프로젝트 파일에 기록되지 않아 다른 환경에서 같은 버전을 재현할 수 없다. |
| | 설치 없이 `npx vite` | 가능 | 실행할 때마다 받은 버전이 달라질 수 있고 잠금 파일에 남지 않는다. |
| 실행 명령 | **`scripts.dev` = `vite` (선택)** | 가능 | `npm run dev` 한 가지로 실행 방법을 통일하고 README 등에서 안내하기 쉽다. |
| | `./node_modules/.bin/vite` 직접 실행 | 가능 | 동작은 같지만 경로를 매번 입력해야 하고 실행 방법이 파일에 기록되지 않는다. |
| `name`·`version` | **생략 (선택)** | 가능 | 공개하지 않는 프로젝트에서는 선택 사항이다. |
| | 기록 | 가능 | 현재 쓰는 곳이 없어 추가하지 않았다. |

## 직접 실행하고 종료하는 방법

처음 저장소를 받은 환경이라면 `node_modules/`가 없으므로 먼저 설치한다. `package-lock.json`이 있으므로 `npm install` 또는 잠금 파일 그대로 설치하는 `npm ci` 중 하나를 쓴다([006](006-package-lock-json-role.md) 참고).

```bash
npm install     # node_modules가 없을 때만
npm run dev
```

1. 터미널에 `Local:` 뒤로 주소가 표시된다. 이번 검증에서는 `http://localhost:5173/`였다. 포트가 이미 사용 중이면 다른 번호가 표시될 수 있으므로 터미널 주소를 그대로 연다.
2. 브라우저에서 탭 제목과 화면 제목이 `학습 기록 서비스`로 보이는지 확인한다.
3. 서버를 실행한 터미널에서 `Ctrl+C`를 눌러 종료한다. 종료 후 같은 주소를 새로고침하면 연결할 수 없다는 오류가 나야 정상이다.

## 확인 결과

구현 단계에서 Node.js `v24.18.1` 환경에 `npm run dev`로 서버를 띄우고 Playwright로 Chromium(창 크기 1280×800)을 실행해 확인했다. 7개 항목 통과, 실패 0건이다.

| 항목 | 실제 결과 |
| --- | --- |
| HTTP 응답 | `http://localhost:5173/` 상태 200, `text/html`, 응답 HTML에 Vite 클라이언트(`/@vite/client`) 삽입 확인 |
| 탭 제목 | `학습 기록 서비스` |
| 문서 언어 | `lang="ko"` |
| 문자 인코딩 | `UTF-8` |
| 화면 제목 `h1` | 1개, 텍스트 `학습 기록 서비스`. 계산 스타일 `display: block`·`visibility: visible`·`opacity: 1`, 박스 너비 1264·높이 38로 화면 안에 실제 표시 |
| 오류 | 콘솔 오류·페이지 오류·실패 요청·400 이상 응답 0건 |
| 서버 종료 | 종료 신호 후 같은 주소 연결 불가 확인 |

HTML 파일을 직접 열었을 때와 달리 응답에 `/@vite/client`가 들어간 것이 Vite 개발 서버를 거쳐 제공됐다는 차이다. 이 스크립트는 파일 변경 시 화면을 갱신하는 연결을 맡는다.

## 이번에 하지 않은 것

- `build`·`preview` 스크립트와 배포 빌드 확인 — [진행 상태](../progress.md)의 프로덕션 빌드 단계에서 다룬다.
- React·JSX·`src` 폴더·Vite 설정 파일(`vite.config.js`) — 이후 단계에서 하나씩 도입한다. 다음 단계는 JavaScript 모듈(import/export) 설명이다.
- 개발 서버 실행 중 파일 수정 시 자동 갱신 동작은 이번에 검증하지 않았다.

## 참고자료

- [Vite 시작하기](https://vite.dev/guide/) — 수동 설치 `npm install -D vite`, `scripts`의 `dev: vite`, 지원 Node.js 범위
- [npm package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json) — `private`, `name`·`version`의 선택 여부, `scripts`, `devDependencies`
- [npm run](https://docs.npmjs.com/cli/v11/commands/npm-run/) — `scripts`의 명령 실행과 `node_modules/.bin`의 PATH 추가
