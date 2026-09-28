# B1-2 학습자료 목록

작성 기준은 [GUIDE.md](GUIDE.md), 요구사항·진행 상태 원본은 [../progress.md](../progress.md)를 따른다.

| 순서 | 개념 | 적용한 기능 | 문서 |
| --- | --- | --- | --- |
| 000 | 브라우저와 웹 기초 배경지식 | 사용자 작성 배경지식 | [000-browser-web-basics.md](000-browser-web-basics.md) |
| 001 | 브라우저가 HTML을 읽어 화면에 표시한다 | `index.html` 기본 구조와 탭/화면 표시 | [001-index-html.md](001-index-html.md) |
| 002 | React는 원하는 화면을 선언하면 DOM 갱신을 맡는다 | 정적 화면과 필요한 화면 갱신, 순수 JavaScript 대안과 React 선택 근거(설명, 미구현) | [002-react-role.md](002-react-role.md) |
| 003 | Node.js는 브라우저 밖에서 JavaScript를 실행해 개발 도구를 돌린다 | Vite 실행 환경과 이용자 브라우저 구분, 기존 설치 확인 범위(설명, 미구현) | [003-nodejs-role.md](003-nodejs-role.md) |
| 004 | npm은 프로젝트가 쓰는 패키지를 설치하고 기록한다 | 패키지 관리 필요성, 수동 방식·대안 비교와 npm 선택 근거, `npm install` 역할과 향후 실행 순서(설명, 미구현) | [004-npm-role.md](004-npm-role.md) |
| 005 | package.json은 프로젝트의 의존성과 실행 명령을 기록한다 | 파일의 역할과 주요 필드, 직접 작성·`npm init` 방법 비교, scripts 역할과 향후 작업 순서(설명, 미구현) | [005-package-json-role.md](005-package-json-role.md) |
| 006 | package-lock.json은 실제 설치된 의존성 트리를 고정해 공유한다 | package.json과의 차이, 생성·갱신 시점과 Git 공유, 잠금 없는 방식·대안 비교, 재현성 조건과 한계(설명, 미구현) | [006-package-lock-json-role.md](006-package-lock-json-role.md) |
| 007 | node_modules는 로컬 설치한 패키지의 실제 파일을 두는 결과물 폴더다 | 설치 경로와 `.bin`, package.json·package-lock.json과의 역할 차이, Git 제외·커밋 대안 비교와 재설치 흐름(설명, 미구현) | [007-node-modules-role.md](007-node-modules-role.md) |
| 008 | Vite는 개발 서버와 배포 빌드를 맡는 도구다 | `index.html` 직접 실행과의 차이, B1-1 방식 지속 가능 여부, 대안 비교와 Vite 선택 근거, 미실행 설치·scripts 예시와 08~13단계 순서(설명, 미구현) | [008-vite-role.md](008-vite-role.md) |
| 009 | 최소 npm·Vite 환경으로 기존 HTML을 개발 서버에 띄운다 | 버전 확인, `package.json` 직접 작성과 `npm install --save-dev vite`, 생성·변경 파일, 설치 수와 잠금 파일 항목 차이, 대안 비교, `npm run dev` 실행·종료와 검증 결과 | [009-minimal-vite-setup.md](009-minimal-vite-setup.md) |
| 010 | JavaScript 모듈은 export로 내보낸 기능을 다른 파일에서 import로 가져온다 | React 진입 파일에 필요한 import/export, named·default와 대응 import, 상대 경로·패키지 이름, `type="module"`, 일반 script·import map·CommonJS 대안 비교, Vite의 패키지 이름 해석(설명, 미구현) | [010-javascript-modules.md](010-javascript-modules.md) |
| 011 | React 루트는 HTML의 한 요소 안쪽을 React가 관리하게 한다 | react·react-dom 역할, `createRoot`·`createElement` 인자와 반환값, CDN·`ReactDOM.render`·JSX 대안 비교, `index.html` 빈 `#root`와 `src/main.js`로 제목을 React 루트에서 표시, react·react-dom 19.3.0 설치와 간접 의존성 scheduler, 브라우저 검증 7건 결과 | [011-react-root.md](011-react-root.md) |
| 012 | Vite 설정 파일은 기본값을 바꿔야 할 때만 루트에 두는 선택 파일이다 | 자동 탐색 위치·이름, `type` 없는 package.json의 `.mjs`/`type: module` 조건, `defineConfig`, `.jsx` 기본 변환과 `.js` 제외(8.3.1 구현), 설정 없음·CLI 옵션·설정 파일 비교, 설정 없음 유지와 12~13단계 순서(설명, 미구현) | [012-vite-config.md](012-vite-config.md) |
| 013 | Vite 플러그인은 기본 기능 밖의 처리를 더하며, `.jsx` 변환은 플러그인 없이 기본 지원된다 | 플러그인 정의·설치와 `plugins` 등록, 내장 `vite:oxc`의 `.jsx` 기본 변환(automatic 런타임, `.js` 제외)과 React 플러그인의 Fast Refresh 구분, 대안 비교와 13단계 최소 구성(`.jsx` 진입 파일, 플러그인·설정 없음) 판단(설명, 미구현) | [013-vite-plugin.md](013-vite-plugin.md) |
| 014 | JSX는 React 요소를 HTML과 비슷한 문법으로 적는 JavaScript 문법 확장이다 | `createElement`와 JSX 대응, 이번에 필요한 JSX 규칙, `createElement` 유지·`.js` 내 JSX·React 플러그인·Babel 브라우저 변환 대안 비교, `src/main.js` 삭제·`src/main.jsx`에서 JSX로 제목 렌더링·`index.html` 모듈 경로 변경(패키지·설정·플러그인 변경 없음), 변환된 모듈의 automatic 런타임 import 확인 등 브라우저 검증 7건 결과 | [014-jsx.md](014-jsx.md) |
