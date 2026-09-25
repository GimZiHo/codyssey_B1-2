# 002. package.json — npm이 프로젝트 정보를 관리한다

이전 개념: [001-index-html.md](001-index-html.md)

## 왜 필요한가

React를 화면에 쓰려면 Vite 같은 개발 서버·빌드 도구가 필요하고, 그 도구들은 npm 패키지로 설치한다. npm이 "어떤 프로젝트에 어떤 패키지를 설치했는지"를 기록하는 곳이 `package.json`이다. 이 파일이 없으면 `npm install`로 받은 패키지를 어느 프로젝트 것인지 npm이 구분하지 못한다. 그래서 Vite 설치보다 먼저 이 파일이 있어야 한다.

## 전체 과정에서 지금 단계

Vite 개발 서버를 띄우기까지의 순서는 다음과 같다.

1. **npm 프로젝트 초기화** — `package.json` 생성 (← 이번 개념, 완료)
2. Vite 설치 — `npm install`로 `vite` 패키지를 받아 `node_modules`와 `package-lock.json` 생성 (다음 작업, 아직 미수행)
3. `package.json`의 `scripts.dev`로 개발 서버 실행 (다음 작업, 아직 미수행)

지금까지는 1단계만 했다. 2·3단계는 아래 "예시"로만 설명하고 실제로 실행하지 않았다.

## 실제 수행한 작업

[`package.json`](../../package.json) (5줄)은 `npm init`이 아니라 세 필드(`name`, `version`, `private`)를 직접 작성해 만들었다.

```json
{
  "name": "codyssey-b1-2",
  "version": "0.1.0",
  "private": true
}
```

- `name`: npm이 프로젝트를 식별하는 이름.
- `version`: 프로젝트 버전. `npm publish` 대상이 아니어도 필수 필드다.
- `private: true`: 이 패키지를 `npm publish`로 실수로 공개하지 못하게 막는 표시.

`npm pkg get name version private` 실행 결과 세 값 모두 파일 내용과 일치. 통과 3건 / 실패 0건. Node.js `v24.18.1`, npm `11.16.0`. (근거: `/tmp/codyssey-package-json-logs/validation.txt`)

## 다음 작업 예시 (아직 실행하지 않음)

- `npm init -y`를 썼다면 `name`·`version`·`main`·`scripts`·`license` 등 더 많은 필드가 자동 생성됐을 것이다. 지금 파일은 그 결과와 항목 구성이 다르며, 직접 작성한 세 필드만 있다.
- `npm install vite -D` 같은 **설치** 명령은 초기화(`npm init`)와 다른 명령이다. 설치는 `package.json`의 `dependencies`/`devDependencies`에 패키지를 추가하고 `node_modules`·`package-lock.json`을 만든다.
- 설치 후 `package.json`에 `"dev": "vite"` 같은 `scripts` 항목을 추가하면 `npm run dev`로 개발 서버를 실행할 수 있다.

## 오해 바로잡기

- **React는 UI 라이브러리이지 동적 서버가 아니다.** React 컴포넌트는 브라우저에서 화면을 그리는 역할만 하며, 요청마다 서버가 페이지를 만들어주는 것과는 다른 동작이다.
- **브라우저 UI 변경과 서버 렌더링은 별개다.** 이 프로젝트는 React로 SPA(Single Page Application, 페이지 하나에서 화면을 갈아끼우는 방식)를 만들고, 빌드 결과(정적 HTML/JS/CSS 파일)를 정적 호스팅한다. 서버가 매 요청마다 HTML을 새로 만들어주지 않는다.
- **Vite는 개발 서버와 빌드 도구이지, 배포 서버의 필수 조건이 아니다.** Vite로 만든 빌드 산출물은 어떤 정적 호스팅에도 올릴 수 있다.
- **GitHub Actions와 GitHub Pages는 역할이 다르다.** Actions는 빌드·배포를 자동화하는 도구이고, Pages는 정적 파일을 호스팅하는 서비스다. SPA는 `/detail/1`처럼 파일이 실제로 없는 경로를 새로고침할 때 처리(라우팅 rewrite)가 별도로 필요하다.
- 이 프로젝트는 [진행 상태](../progress.md)의 기술 구성대로 Vercel 배포를 유지한다. 위 내용은 개념 정리이며 배포 도구 선택을 바꾸지 않는다.

## 참고자료

- [npm Docs — Creating a package.json file](https://docs.npmjs.com/creating-a-package-json-file/)
- [Vite — Getting Started](https://vite.dev/guide/)
- [Vite — Building for Production](https://vite.dev/guide/build)
- [Vite — Deploying a Static Site (GitHub Pages/Actions 포함)](https://vite.dev/guide/static-deploy)

## 남은 확인

Vite 설치·`scripts.dev`·개발 서버 실행·React 화면 도입은 다음 작업에서 실제로 수행하고 검증한다.
