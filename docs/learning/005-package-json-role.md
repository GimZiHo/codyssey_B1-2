# 005. package.json — 프로젝트의 의존성과 실행 명령을 한 파일에 기록한다

> 정규 단계 04(설명). 설치·`npm init`·파일 생성·실행 검증은 하지 않았다. 현재 프로젝트에는 `package.json`이 **없다**. 아래의 JSON·명령 예시는 모두 **아직 실행하거나 만들지 않은 다음 단계 예시**다.

## 1. 지금 해결할 문제

현재 프로젝트 루트에는 제목 한 줄을 보여 주는 [`index.html`](../../index.html)만 있다([001](001-index-html.md)). 앞 단계에서 패키지를 설치·관리할 도구로 npm을 선택했다([004](004-npm-role.md)).

npm으로 Vite·React 같은 패키지를 설치하기 시작하면 두 가지를 어딘가에 남겨야 한다.

1. **무엇에 의존하는가**: 이 프로젝트가 어떤 패키지를 어떤 버전 범위로 쓰는지. 다른 컴퓨터(배포 서버 포함)에서 같은 패키지 구성을 다시 설치하려면 이 목록이 필요하다.
2. **어떻게 실행하는가**: 개발 서버 실행, 배포용 빌드 같은 작업을 어떤 명령으로 하는지. 명령을 매번 기억하거나 사람마다 다르게 입력하면 결과가 달라질 수 있다.

npm은 이 두 정보를 프로젝트 루트의 **`package.json`** 파일에서 읽고 쓴다. 이 파일은 "이 폴더가 npm으로 관리되는 프로젝트이며, 이런 패키지와 명령을 쓴다"는 선언이다.

## 2. 기존 방식과 가능한 대안

| 방식 | 가능 여부 | 필요한 추가 작업·제약 | 이번 판단 |
| --- | --- | --- | --- |
| 지금처럼 기록 파일 없이 `index.html`만 두기 | 현재 화면에는 가능 | 설치한 패키지 목록과 실행 명령을 npm이 저장할 곳이 없다. | 패키지를 쓰기 시작하면 유지할 수 없다. |
| README·메모에 의존성과 명령을 사람이 적기 | 기록 자체는 가능 | npm이 그 문서를 읽지 않는다. 설치할 때마다 사람이 목록을 보고 명령을 입력해야 하고, 실제 설치 상태와 문서가 어긋나기 쉽다. | 사람을 위한 설명으로는 쓸 수 있지만 `package.json`을 대신할 수 없다. |
| 다른 패키지 매니저 전용 설정 | 해당 없음 | yarn·pnpm 등도 `package.json`을 기본 기록 파일로 쓴다. 패키지 매니저를 바꿔도 이 파일은 남는다. | npm을 선택했으므로 비교 대상이 아니다([004](004-npm-role.md)). |
| **`package.json`** | 가능 | JSON 형식을 지켜야 한다(3절). | **선택** — npm이 읽고 갱신하는 표준 위치다. |

정리하면, npm을 쓰는 한 `package.json`은 사실상 필수다. 선택할 수 있는 것은 **이 파일을 어떻게 만드는가**(4절)이다.

## 3. package.json의 역할과 주요 필드

공식 문서: [npm v11 — package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)

### 형식

- 파일은 **실제 JSON**이어야 한다. 공식 문서는 "JavaScript 객체 리터럴이 아니라 실제 JSON이어야 한다"고 명시한다. 즉 키는 큰따옴표로 감싸고, 주석과 마지막 쉼표(trailing comma)를 쓸 수 없다.

### 이 프로젝트에 관련된 필드

| 필드 | 역할 | 이 프로젝트에서의 의미 |
| --- | --- | --- |
| `name`, `version` | 패키지 이름과 버전. 공개(publish)할 패키지에서는 가장 중요한 필수 필드다. | 공식 문서는 "공개할 계획이 없다면 name과 version은 선택 사항"이라고 한다. 이 프로젝트는 npm 레지스트리에 공개하지 않는 서비스 앱이다. 다만 `npm init`은 두 필드를 기본으로 만든다(4절). |
| `private` | `true`이면 npm이 공개(publish)를 거부한다. | 실수로 레지스트리에 올리는 일을 막는 안전장치다. 필수는 아니다. |
| `scripts` | 이름 → 실행할 명령의 사전(dictionary). | 개발 서버·빌드 명령을 이름으로 저장한다(아래 5절). |
| `dependencies` | 프로젝트가 동작하는 데 필요한 패키지와 버전 범위. | React 등 이용자 브라우저에서 실행될 코드가 여기에 들어간다. |
| `devDependencies` | 개발할 때만 쓰는 도구. 공식 문서는 테스트·문서화 프레임워크처럼 패키지를 **사용하는 사람**에게는 필요 없는 것을 예로 든다. | 개발·빌드 도구를 둘 수 있는 곳이다. 실제 배치는 설치 단계(08)에서 결정·확인한다. |

`type`(`.js` 파일을 Node.js가 어떤 모듈 방식으로 해석할지), `engines`(필요한 Node.js·npm 버전 범위) 같은 필드도 있지만, 모듈은 정규 단계 09의 개념이고 `engines`는 현재 필요한 근거가 없어 이 자료에서 다루지 않는다.

### 의존성이 기록되는 방식

직접 편집할 수도 있지만, 보통은 **`npm install <패키지>`가 대신 기록**한다. [npm install](https://docs.npmjs.com/cli/v11/commands/npm-install) 문서 기준:

- 기본 동작: 설치한 패키지가 `dependencies`에 기록된다("`-D`나 `-O`가 없으면 이것이 기본").
- `-D`(`--save-dev`): `devDependencies`에 기록된다.
- 인자 없는 `npm install`: `package.json`에 적힌 의존성을 읽어 설치한다. → 다른 컴퓨터에서 같은 구성을 만드는 방법이다.

`package.json`에는 보통 `^18.3.0`처럼 **허용할 버전 범위**가 적힌다. 실제로 설치된 정확한 버전을 기록하는 파일은 따로 있으며 다음 단계(05 — package-lock.json)에서 다룬다. 설치된 패키지 파일이 놓이는 위치는 06 — node_modules에서 다룬다.

## 4. 파일을 만드는 방법 비교

| 방법 | 동작 | 추가 설정·제약 | 선택 여부 |
| --- | --- | --- | --- |
| 직접 작성 | 편집기로 루트에 `package.json`을 만들고 필요한 필드만 쓴다. | JSON 문법 오류를 스스로 막아야 한다. 무엇을 넣을지 알아야 한다. | 가능. 파일이 작아 이해하기 쉽다. |
| `npm init` (질문형) | 이름·버전·설명 등 질문에 답하면 `package.json`을 써 준다. 이미 있는 파일에는 필드를 **추가만** 한다. | 대화형 입력이 필요하다. | 가능. |
| `npm init -y` (`--yes`) | 질문 없이 기본값으로 만든다. 폴더 이름을 `name`으로, `version`은 항상 `1.0.0`으로 쓰고 description·test 스크립트·keywords·author·license(기본 ISC) 등도 채운다. | 이 프로젝트에 필요 없는 필드(예: 동작하지 않는 기본 test 스크립트)가 생길 수 있어 정리가 필요하다. | 가능. |
| `npm init <initializer>` (예: `npm init vite`) | `npm exec create-<initializer>`로 바뀌어 템플릿 생성 도구를 실행한다. `package.json`뿐 아니라 여러 파일을 함께 만들 수 있다. | 한 번에 여러 파일과 개념이 들어온다. | 이번 과제는 **선택하지 않는다.** 진행 상태의 08 단계가 "React 템플릿 전체를 일괄 도입하지 않는다"고 정했고, 한 단계에 개념 하나씩 도입하기 위해서다. |

근거: [npm init](https://docs.npmjs.com/cli/v11/commands/npm-init), [Creating a package.json file](https://docs.npmjs.com/creating-a-package-json-file)

어떤 방법이든 결과는 같은 형식의 `package.json` 한 파일이다. 직접 작성·`npm init`·`npm init -y` 중 무엇을 쓸지는 필수 조건이 아니며, 실제 생성 방법은 08 단계(최소 패키지 환경 구성)에서 정한다. 이번 단계에서는 어느 방법도 실행하지 않았다.

## 5. scripts — 실행 명령을 이름으로 저장하기

`scripts`에 적은 명령은 `npm run <이름>`으로 실행한다([npm run](https://docs.npmjs.com/cli/v11/commands/npm-run), [scripts](https://docs.npmjs.com/cli/v11/using-npm/scripts)).

- 명령은 프로젝트 루트에서 실행된다. Unix 계열에서는 기본적으로 `/bin/sh`로 실행된다.
- 실행할 때 `node_modules/.bin`이 `PATH`에 추가된다. 그래서 프로젝트에 설치한 도구(예: `vite`)를 경로 없이 이름만으로 부를 수 있다.
- 인자 없이 `npm run`만 입력하면 등록된 스크립트 목록을 보여 준다.
- `test`·`start` 같은 일부 이름은 `npm test`처럼 `run` 없이도 실행된다.

Vite 공식 문서는 Vite 프로젝트의 기본 스크립트로 다음을 소개한다([Vite 시작하기](https://vite.dev/guide/)).

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

> **미실행 예시.** 현재 이 파일도, Vite도 없다. 위 내용은 공식 문서의 예시이며 08 단계에서 필요한 스크립트만 추가할 예정이다.

이렇게 두면 누구나 `npm run dev`라는 같은 이름으로 개발 서버를 켤 수 있고, 실제 명령이 바뀌어도 `package.json` 한 곳만 고치면 된다.

## 6. 전체 모습 (미실행 예시)

아래는 08 단계 이후에 가질 수 있는 **형태의 예시**다. 패키지 이름·버전·필드 구성은 실제 설치 시 확인한 값으로 정하며, 이 예시를 그대로 만들지 않는다.

```json
{
  "name": "codyssey-b1-2",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "devDependencies": {
    "vite": "(설치 시 기록되는 버전 범위)"
  }
}
```

| 부분 | 읽는 법 |
| --- | --- |
| `"private": true` | 레지스트리에 공개하지 않는 프로젝트임을 표시 |
| `scripts.dev` | `npm run dev` → `vite` 실행 |
| `devDependencies.vite` | 개발 도구 Vite에 의존함. `npm install -D vite`가 기록하는 위치 |

`dependencies`의 React 등은 정규 단계 10에서 추가한다.

## 7. 실제 작업 순서에서의 위치

| 단계 | 내용 | 파일 변화 |
| --- | --- | --- |
| 03 npm (완료) | 패키지 매니저의 역할 | 없음 |
| **04 package.json (현재)** | 의존성·실행 명령 기록 파일의 역할 | 없음(이 학습자료만 추가) |
| 05 package-lock.json | 실제 설치 버전 기록 파일 | 없음(설명) |
| 06 node_modules | 설치된 패키지 위치와 버전 관리 제외 | 없음(설명) |
| 07 Vite | 개발·빌드 도구의 필요성 | 없음(설명) |
| 08 최소 환경 구성 | `package.json` 생성, Vite 설치, 실행 명령 구성 | `package.json`, `package-lock.json`, `node_modules/` 등이 **이때 처음** 생긴다. |

## 8. 확인 결과와 남은 확인

- 이번 단계는 설명 단계로 실행 검증 대상이 없다. `package.json`은 생성하지 않았다.
- 파일 생성 방법(직접 작성·`npm init`·`npm init -y`), `private` 사용 여부, Vite를 둘 의존성 필드는 08 단계에서 실제 설치 결과와 함께 확정한다.

## 참고자료

- [npm v11 — package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)
- [npm v11 — npm init](https://docs.npmjs.com/cli/v11/commands/npm-init)
- [npm — Creating a package.json file](https://docs.npmjs.com/creating-a-package-json-file)
- [npm v11 — npm install](https://docs.npmjs.com/cli/v11/commands/npm-install)
- [npm v11 — npm run](https://docs.npmjs.com/cli/v11/commands/npm-run)
- [npm v11 — scripts](https://docs.npmjs.com/cli/v11/using-npm/scripts)
- [Vite 시작하기](https://vite.dev/guide/)
