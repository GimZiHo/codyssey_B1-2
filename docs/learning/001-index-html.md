# 001. index.html — 브라우저가 HTML을 읽어 화면에 표시한다

## 핵심 흐름

브라우저가 `index.html`을 열면 `head`는 탭·메타 정보를, `body`는 화면에 보이는 내용을 렌더링한다.

## 적용한 파일

[`index.html`](../../index.html) (12줄). React·npm·Vite·CSS·JS 없이 순수 HTML만 있다.

```html
<!DOCTYPE html>          <!-- 브라우저에 HTML5 문서임을 알림 -->
<html lang="ko">          <!-- 문서 언어 표시, 검색·접근성에 사용 -->
<head>
  <meta charset="UTF-8">  <!-- 한글 등 문자 인코딩 지정 -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>학습 기록 서비스</title>  <!-- 브라우저 탭에 표시되는 이름 -->
</head>
<body>
  <h1>학습 기록 서비스</h1>  <!-- 실제 화면에 보이는 내용 -->
</body>
</html>
```

- 탭 이름은 `head`의 `title`, 화면에 보이는 문구는 `body`의 `h1`이 결정한다. 이 파일에서는 두 값이 같아서 헷갈리기 쉽지만 역할은 다르다.
- 파일 이름이 `index.html`이라고 해서 브라우저가 자동으로 여는 것은 아니다. 이번 확인은 파일을 브라우저로 직접 열어서(`file://` 경로) 본 것이다. 서버가 있으면 서버가 "기본 파일"로 `index.html`을 찾아주는 규칙이 따로 있지만, 이번 단계에서는 다루지 않는다.

## 확인 결과

브라우저로 `index.html`을 직접 열어 확인: 탭 제목 표시, `lang="ko"` 적용, `charset UTF-8`로 한글 정상 표시, 화면에 `h1` 텍스트 표시(계산 스타일 `display: block`, `visibility: visible`, 박스 1264x38), 콘솔 오류 없음. 5개 항목 모두 통과.

## 실습해보기

1. `index.html`을 텍스트 에디터로 열어 `h1`의 문구를 다른 말로 바꾸고 저장한다.
2. 브라우저에서 그 파일을 열어(또는 이미 열려 있으면 새로고침) 화면이 바뀌는지 확인한다.
3. 이번에는 `title`만 바꿔보고, 탭 이름과 화면 문구 중 어느 쪽이 바뀌는지 비교한다.

**확인 질문**: `title`과 `h1`을 각각 다른 문구로 바꾸면 브라우저의 어느 부분이 바뀌는가?
