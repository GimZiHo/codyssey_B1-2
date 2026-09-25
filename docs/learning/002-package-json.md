# 002. package.json — npm이 프로젝트 정보를 관리한다

이전 개념: [001-index-html.md](001-index-html.md)

## 핵심 개념

`package.json`은 npm이 프로젝트를 식별하는 설정 파일이다. `name`은 프로젝트 이름, `version`은 버전, `private`는 `npm publish`로 공개 배포되지 않도록 막는 표시다.

## 프로젝트 적용

[`package.json`](../../package.json) (5줄). 아직 패키지 설치·scripts·`type`·lockfile은 없다.

```json
{
  "name": "codyssey-b1-2",
  "version": "0.1.0",
  "private": true
}
```

## 확인 결과

`npm pkg get name version private` 실행 결과 세 값 모두 파일 내용과 일치. 통과 3건 / 실패 0건. Node.js `v24.18.1`, npm `11.16.0`.

## 남은 확인

패키지 설치·`scripts`·`type`·lockfile·React·Vite 도입은 다음 작업에서 다룬다.
