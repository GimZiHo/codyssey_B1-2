# 000. 브라우저와 웹 기초 배경지식 — 개념 목차

이 문서는 [진행 상태](../progress.md)의 작업 단계를 따라가기 전에 알아두면 좋은 배경지식의 **목차**다. 브라우저가 파일을 받아 해석하고, 화면을 만들고, JavaScript로 그 화면을 바꾸는 흐름에 필요한 선수 개념만 순서대로 나열했다.

- 이후 대화에서 항목을 하나씩 골라 문서 끝의 [항목별 설명](#item-explanations)에 추가한다. 현재 항목 1만 작성했고 나머지는 제목만 있다. 설명을 작성할 때 공식 문서 등 1차 자료를 확인해 연결한다.
- React·Node.js·npm·Vite·모듈·라우팅·원격 데이터처럼 진행 상태에 단계로 잡힌 개념은 여기서 다루지 않고 해당 단계에서 학습한다.
- 각 절의 `관련 단계`는 이 배경지식이 이어지는 진행 상태의 단계 번호다.
- 관련 기존 자료: [001. 브라우저가 HTML을 읽어 화면에 표시한다](001-index-html.md)

## 1. 웹 페이지를 이루는 것

1. [HTML·CSS·JavaScript는 각각 무엇을 맡는가?](#item-1)
2. 파일과 확장자 — 같은 텍스트 파일을 누가 어떻게 해석하는가?
3. 실행 환경이란 무엇인가? — 코드를 읽고 실행하는 주체

관련 단계: 01, 02, 13

## 2. 브라우저와 서버가 주고받는 것

4. 클라이언트와 서버
5. URL의 구성 — 프로토콜·호스트·경로
6. 요청과 응답 — HTTP 메서드와 상태 코드
7. 파일을 직접 여는 것(`file://`)과 서버에서 받는 것(`http://`)은 어떻게 다른가?
8. JSON — 주고받는 데이터의 형식

관련 단계: 07, 08, 23, 35, 58

## 3. 브라우저가 화면을 만드는 과정

9. HTML 파싱 — 태그가 적힌 문자열을 구조로 읽기
10. DOM 트리 — 노드·요소·속성·텍스트
11. HTML 소스와 DOM은 같은 것인가?
12. CSS 선택자와 스타일 적용 — 계산된 스타일
13. 박스 모델과 레이아웃 — 요소의 크기와 위치 정하기
14. 그리기 — 계산된 결과가 화면 픽셀이 되기까지
15. `<script>`는 문서를 읽는 중 언제 실행되는가?

관련 단계: 10, 13, 22

## 4. JavaScript가 화면을 바꾸는 방법

16. JavaScript 엔진 — 브라우저 안에서 코드를 실행하는 부분
17. `window`·`document`와 브라우저 API
18. DOM 요소 찾기
19. DOM의 내용·속성·스타일 바꾸기
20. 요소를 만들고 붙이고 지우기
21. DOM이 바뀌면 화면은 어떻게 다시 그려지는가?
22. 이벤트와 이벤트 리스너
23. 이벤트 객체와 기본 동작 — 폼 제출과 링크 이동
24. 이벤트 전파 — 클릭은 어느 요소에서 처리되는가?

관련 단계: 10, 18, 19, 43

## 5. 이후 단계에 필요한 JavaScript 기초

25. 값과 자료형 — 문자열·숫자·불리언·`null`·`undefined`
26. 변수 — `const`와 `let`
27. 비교와 조건 — `if`, 삼항 연산자, `&&`
28. 함수 — 매개변수·반환값·화살표 함수
29. 객체와 속성
30. 배열과 배열 메서드 — `map`·`filter`
31. 구조 분해와 전개 구문(`...`)
32. 값의 복사와 참조 — 객체를 바꾸면 무엇이 같이 바뀌는가?
33. 콜백 함수 — 함수를 값으로 전달하기
34. 동기와 비동기 — 기다리는 작업은 어떻게 처리되는가?
35. Promise와 `async`/`await`
36. 오류 처리 — `try`/`catch`

관련 단계: 14~21, 35~50

## 6. 확인 도구

37. 브라우저 개발자 도구 — Elements·Console·Network에서 무엇을 볼 수 있는가?

관련 단계: 모든 브라우저 확인 단계

---

<a id="item-explanations"></a>

## 항목별 설명

<a id="item-1"></a>

### 1. HTML·CSS·JavaScript는 각각 무엇을 맡는가?

**학습 목적**: 웹 페이지를 만드는 세 언어가 나눠 맡는 일을 구분하고, 현재 `index.html`에 무엇이 있고 무엇이 아직 없는지 확인한다. 앞으로 React(JavaScript)와 일반 CSS를 도입할 때 각 코드가 어느 역할에 속하는지 판단하는 기준으로 삼는다.

#### 핵심 개념 — 구조·표현·동작

| 언어 | 맡는 일 | 공식 근거의 표현 |
| --- | --- | --- |
| HTML | 문서의 **구조와 의미**. 이 글자는 제목이고, 이것은 문단이며, 이것은 버튼이라는 식으로 내용이 무엇인지 표시한다. | HTML 표준은 HTML을 웹의 핵심 마크업 언어로 소개하고, 표준의 범위를 "의미 수준(semantic-level)의 마크업 언어"로 한정한다. ([Background](https://html.spec.whatwg.org/multipage/introduction.html#background), [Scope](https://html.spec.whatwg.org/multipage/introduction.html#scope)) |
| CSS | 문서의 **표현**. 글꼴·색·간격처럼 내용이 어떻게 보일지 정한다. | W3C는 CSS를 웹 문서에 스타일(예: 글꼴·색·간격)을 더하는 데 쓰는 언어로 설명한다. ([Cascading Style Sheets](https://www.w3.org/Style/CSS/Overview.en.html)) |
| JavaScript | 페이지의 **동작**. 사용자 입력이나 시간에 따라 계산하고 페이지 내용을 바꾼다. | HTML 표준은 스크립트를 "보통 JavaScript로 작성하는 작은 프로그램"이며 `script` 요소 등으로 문서에 넣는다고 설명한다. JavaScript의 언어 표준인 ECMAScript는 범용 프로그래밍 언어이며, 웹 브라우저가 창 등 화면 요소를 나타내는 객체를 제공하는 **호스트 환경**이 된다고 설명한다. ([A quick introduction to HTML](https://html.spec.whatwg.org/multipage/introduction.html#a-quick-introduction-to-html), [ECMAScript 4.1 Web Scripting](https://tc39.es/ecma262/#sec-web-scripting)) |

- **마크업 언어**: 내용에 태그를 붙여 "이 부분이 무엇인지" 표시하는 언어다. 계산이나 반복을 하는 프로그래밍 언어와 다르다.
- **JavaScript와 ECMAScript**: ECMAScript는 JavaScript의 문법과 기본 동작을 정한 표준 이름이다. 이 자료가 확인한 판은 2026-09-26 기준 [tc39.es/ecma262](https://tc39.es/ecma262/)의 ECMAScript 2027 초안이며, 여기서 인용한 역할 설명은 판에 따라 달라지는 내용이 아니다.
- ECMAScript 표준은 언어만으로 모든 일을 하도록 설계하지 않았고, 호스트 환경이 추가 객체를 제공한다고 전제한다([4 Overview](https://tc39.es/ecma262/#sec-overview)). 브라우저가 JavaScript에 무엇을 제공하는지는 항목 3과 4장(항목 16~22)에서 다룬다.

#### 왜 나누는가 — 경계가 겹치는 경우

세 역할은 기술적으로 완전히 막혀 있지 않다. 가능하지만 이 프로젝트에서 기본 방식으로 삼지 않는 경우를 구분한다.

| 경우 | 가능 여부 | 기본 방식으로 쓰지 않는 이유 |
| --- | --- | --- |
| HTML 안에 표현을 적기(`style` 속성·`style` 요소) | 가능. HTML 표준에 남은 유일한 표현용 기능이다. | HTML 표준은 이전 버전의 표현용 기능 대부분을 더 이상 허용하지 않으며, 표현과 무관한(media-independent) 마크업이 더 많은 사용자에게 동작하는 문서를 만든다고 설명한다([Presentational markup](https://html.spec.whatwg.org/multipage/introduction.html#presentational-markup)). 이 프로젝트는 기술 구성에서 스타일을 일반 CSS 파일로 두기로 정했다. |
| JavaScript로 구조나 스타일을 만들기 | 가능. JavaScript는 페이지 내용과 모양을 바꿀 수 있다. | 모든 것을 JavaScript에 두면 문서가 무엇인지(구조)와 어떻게 보이는지(표현)를 코드 실행 결과로만 알 수 있다. React를 쓰더라도 화면 구조는 JSX(HTML과 닮은 문법, 13단계)로, 스타일은 CSS 파일로, 변화 규칙은 JavaScript로 나눠 적는다. |

즉 "구조는 HTML, 표현은 CSS, 동작은 JavaScript"는 기술적 금지가 아니라 **각 코드를 찾고 고치기 쉽게 하는 역할 분담**이다.

#### 현재 프로젝트 적용 — 실제 현황

2026-09-26 기준 현재 소스는 루트의 [`index.html`](../../index.html) 하나다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>학습 기록 서비스</title>
</head>
<body>
  <h1>학습 기록 서비스</h1>
</body>
</html>
```

| 역할 | 현재 소스에 있는가 | 근거 |
| --- | --- | --- |
| HTML(구조) | 있음 | `<title>`은 탭 제목, `<h1>`은 화면의 최상위 제목이라는 의미를 표시한다. 각 줄의 뜻은 [001](001-index-html.md)에서 다뤘다. |
| CSS(표현) | 없음 | `<link rel="stylesheet">`, `<style>` 요소, `style` 속성이 없다. 제목이 크고 굵게 보이는 것은 이 프로젝트가 정한 스타일이 아니라 브라우저가 기본으로 적용하는 모양이다. |
| JavaScript(동작) | 없음 | `<script>` 요소가 없다. 그래서 페이지는 열린 뒤 스스로 바뀌지 않는 정적 화면이다. 이 한계와 React 선택 근거는 [002](002-react-role.md)에서 다뤘다. |

#### 미구현 예시 — 아직 수행하지 않음

아래는 역할 구분을 보여 주기 위한 예시다. **현재 소스에 추가하지 않았고 실행하지 않았다.** 실제 도입 방식은 진행 상태의 해당 단계에서 정한다.

```css
/* 표현(CSS): 제목의 색만 정한다. 제목이라는 의미는 HTML이 정한다. */
h1 {
  color: #1f4e79;
}
```

```html
<!-- 동작(JavaScript): 버튼을 누르면 제목 글자를 바꾼다. -->
<button type="button" id="rename">제목 바꾸기</button>
<script>
  document.getElementById('rename').addEventListener('click', () => {
    document.querySelector('h1').textContent = '나의 학습 기록';
  });
</script>
```

- CSS 예시는 `<h1>`이라는 구조를 건드리지 않고 모양만 바꾼다.
- JavaScript 예시는 사용자 행동(클릭)에 따라 내용을 바꾼다. `document`·요소 찾기·이벤트 리스너의 의미는 4장(항목 17~22)에서 다루며, 이 프로젝트에서는 이 방식을 직접 쓰지 않고 React로 대신한다([002](002-react-role.md)).

#### 이 프로젝트에서 각 역할이 이어지는 단계

| 역할 | 앞으로 담당할 곳 | 관련 단계(진행 상태 기준, 모두 대기) |
| --- | --- | --- |
| HTML | `index.html`은 진입 문서로 남고, 화면 구조는 JSX로 적는다. | 13(JSX) |
| CSS | `src/styles`의 일반 CSS 파일 | 22(CSS import) |
| JavaScript | React 코드(`src/pages`·`src/components`·`src/hooks`) | 10(React 루트)부터 |

#### 확인 결과

이번에는 설명만 작성했다. 설치·소스 변경·브라우저 실행 검증은 하지 않았으며, 위 현황표는 현재 `index.html` 소스를 읽은 결과다.

#### 다음 항목과의 관계

HTML·CSS·JavaScript가 모두 텍스트로 적힌다면 브라우저는 어떤 파일을 어떤 언어로 읽을지 어떻게 정하는가? 이는 항목 2(파일과 확장자)에서 다룬다.

#### 참고자료

- WHATWG, HTML Standard — [1.3 Background](https://html.spec.whatwg.org/multipage/introduction.html#background), [1.5 Scope](https://html.spec.whatwg.org/multipage/introduction.html#scope), [A quick introduction to HTML](https://html.spec.whatwg.org/multipage/introduction.html#a-quick-introduction-to-html), [Presentational markup](https://html.spec.whatwg.org/multipage/introduction.html#presentational-markup) (2026-09-26 확인)
- W3C, [Cascading Style Sheets](https://www.w3.org/Style/CSS/Overview.en.html) (2026-09-26 확인)
- Ecma TC39, ECMAScript 2027 Language Specification 초안 — [4 Overview](https://tc39.es/ecma262/#sec-overview), [4.1 Web Scripting](https://tc39.es/ecma262/#sec-web-scripting) (2026-09-26 확인)
