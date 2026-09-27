# 000. 브라우저와 웹 기초 배경지식

이 문서는 [진행 상태](../progress.md)의 작업 단계를 따라가기 전에 알아두면 좋은 배경지식을 정리한다. 브라우저가 파일을 받아 해석하고, 화면을 만들고, JavaScript로 그 화면을 바꾸는 흐름에 필요한 선수 개념을 순서대로 학습한다.

- 각 항목은 하나씩 학습하며 설명을 추가한다.
- React·Node.js·npm·Vite·모듈·라우팅·원격 데이터처럼 진행 상태에 별도 단계로 잡힌 개념은 여기서 다루지 않는다.
- 각 절의 `관련 단계`는 이 배경지식이 이어지는 진행 상태의 단계 번호다.
- 관련 기존 자료: [001. 브라우저가 HTML을 읽어 화면에 표시한다](001-index-html.md)

---

# 1. 웹 페이지를 이루는 것

## 1. HTML·CSS·JavaScript는 각각 무엇을 맡는가?

웹 페이지를 구성하는 기본 요소는 HTML, CSS, JavaScript다.

- **HTML**: 페이지의 내용과 구조를 표현한다.
- **CSS**: HTML 요소가 어떻게 보일지를 정한다.
- **JavaScript**: 사용자 입력이나 이벤트에 따라 어떻게 동작할지를 정한다.

예를 들어:

```html
<button>로그인</button>
```

HTML은 버튼이 존재한다는 것을 표현한다.

```css
button {
    color: white;
    background-color: blue;
}
```

CSS는 버튼의 시각적인 표현을 정한다.

```javascript
button.addEventListener('click', () => {
    alert('로그인 버튼을 눌렀습니다.');
});
```

JavaScript는 버튼을 클릭했을 때 수행할 동작을 정의한다.

정리하면:

```text
HTML       = 내용과 구조
CSS        = 모양과 배치
JavaScript = 동작
```

브라우저가 이 세 가지를 읽고 해석하거나 실행하여 하나의 웹 페이지를 만든다.

---

## 2. 파일과 확장자 — 같은 텍스트 파일을 누가 어떻게 해석하는가?

파일은 데이터를 저장한 것이다.

예를 들어:

```text
<h1>Hello</h1>
```

이라는 내용 자체는 문자 데이터다.

파일 이름이:

```text
index.html
```

이면 `.html`이 확장자다.

다른 예:

```text
style.css
app.js
memo.txt
```

확장자는 사람과 프로그램에게 파일의 종류를 알려주는 표시다.

하지만 파일 이름을 바꾼다고 파일 내부 데이터가 자동으로 변환되는 것은 아니다.

중요한 것은 **어떤 프로그램이 어떤 규칙으로 파일을 해석하느냐**다.

```text
파일의 데이터
    ↓
프로그램이 읽음
    ↓
프로그램의 규칙에 따라 해석
```

또한 `.js` 파일이라고 해서 파일 자체가 JavaScript를 실행하는 것은 아니다. JavaScript를 실행할 수 있는 환경이 파일의 코드를 읽고 실행해야 한다.

핵심:

```text
파일은 데이터다.

확장자는 파일의 종류를 나타내는 표시다.

실제 의미는 파일을 읽는 프로그램이
어떤 규칙으로 해석하느냐에 따라 결정된다.
```

---

## 3. 실행 환경이란 무엇인가? — 코드를 읽고 실행하는 주체

코드 파일은 스스로 실행되지 않는다.

예를 들어:

```javascript
console.log("Hello");
```

가 `app.js`에 들어 있어도 파일 자체가 실행되는 것은 아니다.

코드를 읽고 실제로 실행하는 환경이 필요하다.

```text
JavaScript 코드
      ↓
실행 환경
      ↓
코드 실행
      ↓
결과 발생
```

웹에서 JavaScript를 실행할 수 있는 대표적인 환경은 **웹 브라우저**다.

HTML과 CSS는 일반적으로 브라우저가 **해석한다**고 표현하고, JavaScript는 **실행한다**고 표현한다.

```text
HTML
 ↓
브라우저가 해석
 ↓
페이지 구조 생성

CSS
 ↓
브라우저가 해석
 ↓
표현 방식 결정

JavaScript
 ↓
브라우저가 실행
 ↓
동작 수행
```

핵심:

> 코드는 스스로 실행되지 않는다. 코드를 실행할 수 있는 환경이 필요하며, 웹에서는 브라우저가 JavaScript의 실행 환경을 제공한다.

관련 단계: 01, 02, 13

---

# 2. 브라우저와 서버가 주고받는 것

## 4. 클라이언트와 서버

웹 통신의 기본 구조는 다음과 같다.

```text
클라이언트 → 요청 → 서버
클라이언트 ← 응답 ← 서버
```

- **클라이언트**: 요청하는 쪽
- **서버**: 요청을 받아 응답하는 쪽

웹에서는 브라우저가 대표적인 클라이언트다.

```text
브라우저
   ↓ 요청
서버
   ↓ 응답
브라우저
```

서버는 특정 종류의 컴퓨터를 의미하는 것이 아니라 **요청을 받고 응답하는 역할**을 의미한다.

따라서 클라이언트와 서버는 같은 컴퓨터 안에 있을 수도 있다.

핵심:

```text
요청하는 쪽 = 클라이언트
응답하는 쪽 = 서버
```

---

## 5. URL의 구성 — 프로토콜·호스트·경로

예:

```text
https://example.com/users/10
```

크게 세 부분으로 볼 수 있다.

```text
https
= 프로토콜
= 어떤 방식으로 통신할 것인가

example.com
= 호스트
= 어느 서버로 갈 것인가

/users/10
= 경로
= 그 서버에서 무엇을 요청할 것인가
```

URL은 단순한 문자열이 아니라 **어디에, 어떤 방식으로, 무엇을 요청할지 나타내는 주소**다.

---

## 6. 요청과 응답 — HTTP 메서드와 상태 코드

클라이언트는 서버에 HTTP 요청을 보내고 서버는 HTTP 응답을 돌려준다.

대표적인 HTTP 메서드는:

```text
GET     = 가져오기
POST    = 새로 만들기
PUT     = 수정하기
DELETE  = 삭제하기
```

예를 들어:

```text
GET /users
```

와:

```text
POST /users
```

는 경로가 같더라도 요청하는 작업이 다를 수 있다.

서버는 요청 처리 결과를 **HTTP 상태 코드**로 알려준다.

대표적으로:

```text
200 = 정상 처리

404 = 요청한 것을 찾지 못함

500 = 서버 내부 오류
```

핵심:

```text
HTTP 메서드
= 클라이언트가 원하는 작업

HTTP 상태 코드
= 서버가 요청을 처리한 결과
```

---

## 7. `file://`과 `http://`의 차이

`file://`은 브라우저가 내 컴퓨터의 파일을 직접 읽는 방식이다.

```text
내 컴퓨터의 파일
       ↓
    브라우저
```

HTTP 요청과 응답이 없다.

반면:

```text
http://localhost:3000/index.html
```

같은 주소는 서버를 이용한다.

```text
브라우저
   ↓ HTTP 요청
서버
   ↓ HTTP 응답
브라우저
```

핵심:

```text
file://
= 파일을 직접 읽는다.

http://
= 서버에게 요청해서 받는다.
```

---

## 8. JSON — 주고받는 데이터의 형식

JSON은 데이터를 일정한 규칙으로 표현하는 형식이다.

예:

```json
{
  "name": "Kim",
  "age": 30
}
```

기본적으로:

```text
키 : 값
```

형태로 데이터를 표현할 수 있다.

여러 데이터를 표현할 수도 있다.

```json
[
  {
    "name": "Kim",
    "age": 30
  },
  {
    "name": "Lee",
    "age": 25
  }
]
```

웹에서는 서버와 클라이언트가 데이터를 주고받을 때 자주 사용한다.

```text
브라우저
   ↓ 요청
서버
   ↓ JSON 응답
브라우저의 JavaScript
   ↓
데이터 사용
```

JSON은 JavaScript 객체와 모양이 비슷하지만 JavaScript 코드 자체는 아니다.

> **JSON은 데이터를 표현하고 전달하기 위한 형식이다.**

관련 단계: 07, 08, 23, 35, 58

---

# 3. 브라우저가 화면을 만드는 과정

## 9. HTML 파싱 — 태그가 적힌 문자열을 구조로 읽기

브라우저가 서버에서 HTML을 받으면 처음에는 문자 데이터다.

예:

```html
<div>
    <h1>Hello</h1>
    <p>반갑습니다.</p>
</div>
```

브라우저는 HTML 문법에 따라 이 문자열을 읽고 구조를 파악한다.

이 과정을 **HTML 파싱(Parsing)**이라고 한다.

```text
HTML 문자열

<div>
  <h1>Hello</h1>
  <p>반갑습니다.</p>
</div>

        ↓ 파싱

구조

div
 ├─ h1
 │   └─ Hello
 └─ p
     └─ 반갑습니다.
```

브라우저는 태그의 시작과 끝, 포함 관계, 텍스트 등을 파악한다.

파싱은 아직 실제 화면에 픽셀을 그리는 과정은 아니다.

> **HTML 파싱은 HTML 문자열을 읽어 브라우저가 다룰 수 있는 구조로 만드는 과정이다.**

---

## 10. DOM 트리 — 노드·요소·속성·텍스트

HTML을 파싱하면 브라우저는 문서를 **DOM(Document Object Model)** 구조로 표현한다.

예:

```html
<body>
  <h1>Hello</h1>
  <p>반갑습니다.</p>
</body>
```

대략 다음과 같은 트리가 만들어진다.

```text
document
└─ html
   └─ body
      ├─ h1
      │  └─ "Hello"
      └─ p
         └─ "반갑습니다."
```

DOM 트리의 각각의 구성 단위를 **노드(Node)**라고 한다.

HTML 태그에서 만들어진 노드는 **요소(Element)**다.

```text
h1
p
button
div
```

등이 요소가 될 수 있다.

텍스트 역시 별도의 **텍스트 노드**로 존재한다.

```html
<h1>Hello</h1>
```

은 DOM에서:

```text
h1 요소
└─ "Hello" 텍스트 노드
```

가 된다.

HTML 속성도 요소가 가진 정보로 표현된다.

```html
<button id="delete-button">삭제</button>
```

대략:

```text
button 요소
 ├─ 속성: id="delete-button"
 └─ 텍스트: "삭제"
```

로 이해할 수 있다.

핵심:

```text
DOM
= HTML 문서를 브라우저가 트리 구조로 표현한 것

노드
= DOM의 구성 단위

요소
= HTML 태그에서 만들어진 노드

텍스트 노드
= 실제 글자를 나타내는 노드
```

---

## 11. HTML 소스와 DOM은 같은 것인가?

HTML 소스와 DOM은 동일하지 않다.

HTML 소스는 브라우저가 받은 **원본 문자 데이터**다.

```html
<h1>Hello</h1>
```

브라우저는 이것을 파싱해서 DOM을 만든다.

```text
h1
└─ "Hello"
```

그리고 JavaScript는 DOM을 변경할 수 있다.

예:

```javascript
document.querySelector("h1").textContent = "Bye";
```

실행 후 현재 DOM은:

```text
h1
└─ "Bye"
```

가 될 수 있다.

하지만 서버에서 처음 받은 HTML 파일 자체가 자동으로:

```html
<h1>Bye</h1>
```

로 저장되는 것은 아니다.

따라서:

```text
HTML 소스
= 처음 받은 원본

DOM
= 브라우저가 현재 가지고 있는 문서 구조
```

이며 JavaScript 실행 등에 의해 둘이 달라질 수 있다.

---

## 12. CSS 선택자와 스타일 적용 — 계산된 스타일

CSS 선택자는 **어떤 DOM 요소에 스타일을 적용할 것인지** 정한다.

예:

```css
h1 {
    color: red;
}
```

여기서 `h1`이 선택자다.

대표적으로:

```text
button
= 태그 선택자

.danger
= class="danger"인 요소

#delete-button
= id="delete-button"인 요소
```

한 요소에는 여러 CSS 규칙이 동시에 적용될 수도 있다.

```css
p {
    color: blue;
}

.important {
    font-size: 20px;
}
```

```html
<p class="important">Hello</p>
```

라면 두 규칙 모두 적용될 수 있다.

같은 속성에 서로 다른 값이 지정되면 브라우저는 CSS의 우선순위 규칙을 이용해 최종 값을 결정한다.

여러 CSS 규칙을 종합한 결과 해당 요소가 실제로 사용할 스타일을 **계산된 스타일(Computed Style)**이라고 한다.

전체 흐름:

```text
DOM 요소
   ↓
선택자와 일치하는 CSS 규칙 찾기
   ↓
여러 규칙 종합
   ↓
최종 스타일 결정
```

---

## 13. 박스 모델과 레이아웃 — 요소의 크기와 위치 정하기

브라우저는 대부분의 HTML 요소를 화면상의 **박스**로 취급한다.

박스 모델은 네 영역으로 구성된다.

```text
margin
┌──────────────────────────┐
│        border            │
│   ┌──────────────────┐   │
│   │     padding      │   │
│   │   ┌──────────┐   │   │
│   │   │ content  │   │   │
│   │   └──────────┘   │   │
│   └──────────────────┘   │
└──────────────────────────┘
```

각 영역은:

```text
content
= 실제 내용

padding
= 내용과 테두리 사이의 안쪽 여백

border
= 요소의 테두리

margin
= 요소 바깥쪽 여백
```

이다.

**레이아웃(Layout)**은 여러 요소가 화면의 어느 위치에 얼마나 큰 크기로 배치될지를 계산하는 과정이다.

즉:

> 박스 모델은 요소 하나가 차지하는 공간을 설명하고, 레이아웃은 이러한 박스들을 화면에 배치하는 과정이다.

전체 흐름:

```text
DOM
 ↓
스타일 결정
 ↓
요소의 크기 계산
 ↓
요소의 위치 계산
```

---

## 14. 그리기 — 계산된 결과가 화면 픽셀이 되기까지

레이아웃까지 끝나면 브라우저는 요소가 어디에 얼마나 크게 있어야 하는지 알고 있다.

예:

```text
크기: 100px × 40px
위치: 특정 좌표
배경색: 파란색
글자색: 흰색
```

이 계산 결과를 바탕으로 글자, 배경색, 테두리 등을 실제 화면에 표현한다.

이를 **페인팅(Painting)**이라고 한다.

넓은 의미에서는 브라우저가 페이지를 화면에 표현하는 전체 과정을 **렌더링(Rendering)**이라고 부른다.

레이아웃과 그리기를 구분하면:

```text
레이아웃
= 어디에, 얼마나 크게 표시할지 계산

그리기
= 계산 결과를 실제 화면에 표현
```

최종적으로 브라우저의 계산 결과는 화면의 픽셀로 표시된다.

현재까지의 전체 흐름은:

```text
HTML 문자열
    ↓
HTML 파싱
    ↓
DOM 생성
    ↓
CSS 규칙 적용
    ↓
계산된 스타일 결정
    ↓
레이아웃
    ↓
크기와 위치 계산
    ↓
그리기
    ↓
화면 표시
```

---

## 15. `<script>`는 문서를 읽는 중 언제 실행되는가?

브라우저는 HTML을 위에서부터 파싱한다.

일반적인 `<script>`를 만나면 기본적으로 HTML 파싱을 잠시 멈추고 JavaScript를 실행한 뒤 다시 파싱한다.

예:

```html
<body>
  <h1>Hello</h1>

  <script>
    console.log("JavaScript 실행");
  </script>

  <p>반갑습니다.</p>
</body>
```

대략적인 흐름:

```text
h1까지 HTML 파싱
   ↓
script 발견
   ↓
HTML 파싱 중단
   ↓
JavaScript 실행
   ↓
실행 완료
   ↓
HTML 파싱 재개
   ↓
p 파싱
```

따라서 다음 코드에서는:

```html
<body>
  <script>
    const button = document.querySelector("button");
  </script>

  <button>확인</button>
</body>
```

JavaScript가 실행되는 순간 `button`은 아직 파싱되지 않았기 때문에 DOM에 존재하지 않을 수 있다.

반대로:

```html
<body>
  <button>확인</button>

  <script>
    const button = document.querySelector("button");
  </script>
</body>
```

에서는 먼저 `button`이 DOM에 만들어지고 그다음 JavaScript가 실행되기 때문에 버튼을 찾을 수 있다.

외부 JavaScript 파일은 다음과 같이 불러올 수 있다.

```html
<script src="app.js"></script>
```

일반적인 `script`는 JavaScript 파일을 가져오고 실행하는 동안 HTML 파싱을 지연시킬 수 있다.

### `defer`

```html
<script src="app.js" defer></script>
```

`defer`가 있으면 JavaScript 파일을 가져오는 동안 HTML 파싱을 계속하고, HTML 파싱이 끝난 후 JavaScript를 실행한다.

```text
HTML 파싱
   ↓
script defer 발견
   ↓
JS 파일 가져오기 시작
   ↓
HTML 파싱 계속
   ↓
HTML 파싱 완료
   ↓
JavaScript 실행
```

### `async`

```html
<script src="app.js" async></script>
```

`async`는 JavaScript 파일을 가져오는 동안 HTML 파싱을 계속하지만, 파일 준비가 끝나면 실행한다.

현재 단계에서는 다음 정도로 구분하면 충분하다.

```text
일반 script
= 만나면 HTML 파싱을 멈추고 실행

defer
= HTML 파싱이 끝난 뒤 실행

async
= 파일이 준비되면 실행
```

핵심:

> **JavaScript가 실행되는 시점에 HTML 전체가 항상 DOM으로 만들어져 있는 것은 아니다.**

관련 단계: 10, 13, 22

---

# 4. JavaScript가 화면을 바꾸는 방법

## 16. JavaScript 엔진 — 브라우저 안에서 코드를 실행하는 부분

JavaScript 코드를 실제로 읽고 실행하는 것은 브라우저 안의 **JavaScript 엔진(JavaScript Engine)**이다.

예를 들어:

```javascript
const a = 1;
const b = 2;

console.log(a + b);
```

라는 코드가 있다면 대략 다음과 같은 흐름으로 실행된다.

```text
JavaScript 코드
      ↓
JavaScript 엔진
      ↓
코드 해석 및 실행
      ↓
결과
```

JavaScript 엔진은 브라우저 전체와 같은 것이 아니다.

브라우저는 HTML 처리, CSS 처리, 네트워크 통신, 화면 그리기 등 여러 기능을 가지고 있고 JavaScript 엔진은 그중 JavaScript 실행을 담당하는 부분이다.

```text
브라우저
├─ HTML 처리
├─ CSS 처리
├─ 네트워크 처리
├─ 화면 그리기
├─ JavaScript 엔진
└─ 기타 기능
```

대표적인 JavaScript 엔진에는 Chrome 계열의 V8, Firefox의 SpiderMonkey, Safari의 JavaScriptCore 등이 있다.

또한 JavaScript 엔진이 브라우저의 모든 기능을 직접 제공하는 것은 아니다.

예를 들어:

```javascript
const result = 1 + 2;
```

와 같은 계산은 JavaScript 언어 자체의 기능이다.

반면:

```javascript
document.querySelector("button");
```

에서 `document`는 JavaScript 언어 자체가 아니라 브라우저가 제공하는 기능이다.

핵심:

```text
JavaScript 엔진
= JavaScript 코드를 실행하는 부분

브라우저
= JavaScript 엔진을 포함하며,
  DOM·네트워크·화면 출력 등의 기능도 제공
```

---

## 17. `window`·`document`와 브라우저 API

브라우저 환경에서 JavaScript를 실행하면 브라우저가 여러 기능을 JavaScript에서 사용할 수 있도록 제공한다.

대표적인 객체가 `window`와 `document`다.

### `window`

`window`는 브라우저 탭의 실행 환경을 대표하는 객체라고 볼 수 있다.

단순화하면:

```text
window
├─ document
├─ alert
├─ setTimeout
└─ 기타 브라우저 기능
```

예를 들어:

```javascript
window.alert("Hello");
```

라고 쓸 수 있다.

일반적으로는:

```javascript
alert("Hello");
```

처럼 `window.`를 생략해서 사용한다.

### `document`

`document`는 현재 웹 페이지의 DOM 문서를 나타내는 객체다.

예를 들어:

```javascript
document.querySelector("button");
```

은 현재 DOM에서 `button` 요소를 찾는다.

관계를 단순화하면:

```text
window
└─ document
   └─ DOM
      └─ HTML 요소들
```

### 브라우저 API

브라우저는 JavaScript가 브라우저의 기능을 사용할 수 있도록 여러 API를 제공한다.

예:

```javascript
document.querySelector(...)
```

→ DOM을 다루는 기능

```javascript
alert(...)
```

→ 알림창을 표시하는 기능

```javascript
setTimeout(...)
```

→ 일정 시간이 지난 뒤 코드를 실행하는 기능

핵심:

```text
window
= 브라우저 탭의 실행 환경을 대표하는 객체

document
= 현재 페이지의 DOM 문서를 나타내는 객체

브라우저 API
= JavaScript가 브라우저 기능을 사용할 수 있도록
  브라우저가 제공하는 기능
```

---

## 18. DOM 요소 찾기

JavaScript로 화면을 바꾸려면 먼저 어떤 DOM 요소를 조작할지 찾아야 한다.

대표적으로 `document.querySelector()`를 사용한다.

```javascript
document.querySelector("CSS 선택자");
```

예를 들어 HTML이:

```html
<button id="delete-button" class="danger">삭제</button>
```

라면 다음처럼 찾을 수 있다.

```javascript
document.querySelector("button");
```

→ 첫 번째 `button` 요소

```javascript
document.querySelector(".danger");
```

→ `class="danger"`인 첫 번째 요소

```javascript
document.querySelector("#delete-button");
```

→ `id="delete-button"`인 요소

찾은 DOM 요소는 변수에 저장할 수 있다.

```javascript
const button = document.querySelector("#delete-button");
```

여기서 `button` 변수는 HTML 문자열을 저장하는 것이 아니라 **브라우저가 만든 실제 DOM 요소 객체를 가리킨다.**

조건에 맞는 요소가 없다면:

```javascript
null
```

이 반환된다.

여러 요소를 한꺼번에 찾으려면:

```javascript
document.querySelectorAll("button");
```

을 사용할 수 있다.

정리:

```text
querySelector(...)
= 조건에 맞는 첫 번째 요소 하나

querySelectorAll(...)
= 조건에 맞는 요소 여러 개
```

---

## 19. DOM의 내용·속성·스타일 바꾸기

DOM 요소를 찾은 뒤에는 JavaScript로 그 요소의 내용이나 속성, 스타일 등을 변경할 수 있다.

### 텍스트 변경

HTML:

```html
<h1 id="title">Hello</h1>
```

JavaScript:

```javascript
const title = document.querySelector("#title");

title.textContent = "Bye";
```

그러면 DOM의 텍스트가 `Hello`에서 `Bye`로 변경된다.

### 속성 변경

HTML:

```html
<img id="profile" src="old.png">
```

JavaScript:

```javascript
const profile = document.querySelector("#profile");

profile.setAttribute("src", "new.png");
```

속성 값을 읽으려면:

```javascript
profile.getAttribute("src");
```

을 사용할 수 있다.

```text
setAttribute()
= 속성 변경

getAttribute()
= 속성 값 읽기
```

### 스타일 변경

```javascript
const message = document.querySelector("#message");

message.style.color = "red";
```

처럼 요소의 스타일을 직접 변경할 수도 있다.

### 클래스 변경

실제 코드에서는 JavaScript에서 스타일을 하나씩 지정하기보다 CSS 클래스를 추가하거나 제거하는 방식도 많이 사용한다.

CSS:

```css
.error {
    color: red;
    font-weight: bold;
}
```

JavaScript:

```javascript
message.classList.add("error");
```

그러면 해당 요소에 `error` 클래스가 추가되고 CSS 규칙이 적용된다.

```text
CSS
= 어떻게 보일지를 정의

JavaScript
= 언제 해당 스타일을 적용할지 결정
```

JavaScript가 변경하는 것은 원본 HTML 파일이 아니라 **현재 브라우저의 DOM**이다.

---

## 20. 요소를 만들고 붙이고 지우기

JavaScript에서는 기존 DOM 요소를 수정하는 것뿐 아니라 새로운 요소를 만들 수도 있다.

### 요소 만들기

```javascript
const li = document.createElement("li");
```

이 코드는 새로운 `li` 요소 객체를 만든다.

이 시점에는 아직 DOM 트리에 연결되지 않았기 때문에 화면에는 보이지 않는다.

내용을 넣을 수 있다.

```javascript
li.textContent = "새로운 항목";
```

### DOM에 추가하기

HTML:

```html
<ul id="list"></ul>
```

JavaScript:

```javascript
const list = document.querySelector("#list");

const li = document.createElement("li");
li.textContent = "새로운 항목";

list.append(li);
```

변경 전:

```text
ul
```

변경 후:

```text
ul
└─ li
   └─ "새로운 항목"
```

DOM에 추가된 뒤 화면에도 나타난다.

### 요소 삭제하기

```javascript
const item = document.querySelector("#item");

item.remove();
```

하면 해당 요소가 DOM에서 제거되고 화면에서도 사라진다.

전체 흐름:

```text
요소 생성
   ↓
내용 설정
   ↓
DOM에 추가
   ↓
화면에 나타남
   ↓
필요하면 DOM에서 제거
```

이 역시 원본 HTML 파일 자체를 수정하는 것은 아니다.

---

## 21. DOM이 바뀌면 화면은 어떻게 다시 그려지는가?

JavaScript가 DOM이나 스타일을 변경하면 브라우저는 그 변경을 화면에 반영해야 한다.

예를 들어:

```javascript
element.textContent = "새로운 내용";
```

이 실행되면 대략:

```text
JavaScript
   ↓
DOM 변경
   ↓
브라우저가 변경된 상태 확인
   ↓
필요한 스타일 다시 계산
   ↓
필요하면 레이아웃 다시 계산
   ↓
필요한 부분 다시 그리기
   ↓
화면 변경
```

크기나 위치가 변경되면 주변 요소의 위치에도 영향을 줄 수 있기 때문에 레이아웃 계산이 다시 필요할 수 있다.

```javascript
element.style.width = "500px";
```

반면:

```javascript
element.style.color = "red";
```

처럼 색상만 변경하면 크기나 위치는 그대로이고 화면을 다시 그리는 작업만 필요할 수도 있다.

브라우저는 작은 변경이 발생했다고 해서 HTML 전체를 다시 파싱하고 DOM을 처음부터 만드는 것은 아니다.

일반적으로 필요한 부분만 다시 계산하고 그리려고 한다.

핵심:

> JavaScript는 화면 픽셀을 직접 수정하는 것이 아니라 DOM이나 스타일을 변경하고, 브라우저가 그 변경을 바탕으로 필요한 계산과 그리기를 수행한다.

---

## 22. 이벤트와 이벤트 리스너

사용자의 클릭이나 키보드 입력처럼 브라우저에서 발생하는 사건을 **이벤트(Event)**라고 한다.

예:

```text
버튼 클릭
키보드 입력
마우스 이동
폼 제출
페이지 로드
```

특정 이벤트가 발생했을 때 실행할 함수를 등록하는 것이 **이벤트 리스너(Event Listener)**다.

예:

```javascript
const button = document.querySelector("button");

button.addEventListener("click", () => {
    console.log("버튼 클릭");
});
```

형태는:

```javascript
element.addEventListener("이벤트 종류", 실행할 함수);
```

이다.

`addEventListener()`를 실행했다고 등록한 함수가 즉시 실행되는 것은 아니다.

```text
이벤트 리스너 등록
      ↓
이벤트를 기다림
      ↓
사용자가 버튼 클릭
      ↓
click 이벤트 발생
      ↓
등록된 함수 실행
```

DOM 변경과 연결하면:

```text
사용자 클릭
   ↓
click 이벤트 발생
   ↓
이벤트 리스너 실행
   ↓
JavaScript 실행
   ↓
DOM 변경
   ↓
브라우저가 화면 갱신
```

이라는 흐름이 된다.

핵심:

```text
이벤트
= 브라우저에서 발생한 사건

이벤트 리스너
= 특정 이벤트가 발생했을 때 실행할 코드를 등록하는 것
```

---

## 23. 이벤트 객체와 기본 동작 — 폼 제출과 링크 이동

이벤트가 발생하면 브라우저는 이벤트에 대한 정보를 담은 **이벤트 객체(Event Object)**를 만들어 이벤트 리스너에 전달한다.

예:

```javascript
button.addEventListener("click", (event) => {
    console.log(event.type);
});
```

여기서 `event`가 이벤트 객체다.

이벤트 객체를 통해 이벤트 종류나 실제 이벤트가 발생한 요소 등의 정보를 확인할 수 있다.

```javascript
event.type
```

→ 이벤트 종류

```javascript
event.target
```

→ 실제로 이벤트가 발생한 요소

### 기본 동작

일부 HTML 요소에는 JavaScript가 없어도 브라우저가 수행하는 기본 동작이 있다.

예를 들어 링크:

```html
<a href="/users">사용자 목록</a>
```

를 클릭하면 브라우저가 `/users`로 이동한다.

폼:

```html
<form>
    <input>
    <button type="submit">전송</button>
</form>
```

에서는 전송 시 기본적으로 폼 제출 동작이 수행된다.

이러한 기본 동작을 막으려면:

```javascript
event.preventDefault();
```

를 사용한다.

예:

```javascript
const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    // JavaScript에서 직접 처리
});
```

`preventDefault()`는 이벤트 자체를 없애는 것이 아니다.

```text
이벤트 발생
= 그대로 발생

이벤트 리스너 실행
= 그대로 실행

브라우저 기본 동작
= preventDefault()로 취소 가능
```

핵심:

```text
이벤트 객체
= 발생한 이벤트에 관한 정보를 담은 객체

preventDefault()
= 이벤트 자체가 아니라
  브라우저의 기본 동작을 막는다.
```

---

## 24. 이벤트 전파 — 클릭은 어느 요소에서 처리되는가?

DOM 요소는 부모와 자식 관계를 가진다.

예:

```html
<div id="box">
  <button id="button">클릭</button>
</div>
```

DOM 구조:

```text
div
└─ button
```

자식 요소에서 발생한 이벤트는 부모 요소 쪽으로 전달될 수 있다.

이를 **이벤트 전파(Event Propagation)**라고 한다.

특히 자식에서 부모 방향으로 이벤트가 올라가는 현상을 **버블링(Bubbling)**이라고 한다.

```text
button 클릭
   ↓
button
   ↓
div
   ↓
body
```

예를 들어:

```javascript
button.addEventListener("click", () => {
    console.log("button");
});

box.addEventListener("click", () => {
    console.log("box");
});
```

에서 `button`을 클릭하면 두 이벤트 리스너가 모두 실행될 수 있다.

### `event.target`

```javascript
event.target
```

은 **실제로 이벤트가 발생한 요소**다.

### `event.currentTarget`

```javascript
event.currentTarget
```

은 **현재 실행 중인 이벤트 리스너가 등록된 요소**다.

예를 들어 `button`을 클릭했고 이벤트를 부모 `box`에서 처리하고 있다면:

```text
event.target
= button

event.currentTarget
= box
```

가 될 수 있다.

자식에서 발생한 이벤트를 부모에서 처리하는 구조를 활용하는 방식을 **이벤트 위임(Event Delegation)**이라고 한다.

### 이벤트 전파 중단

이벤트가 부모로 계속 전달되지 않게 하려면:

```javascript
event.stopPropagation();
```

을 사용할 수 있다.

앞에서 배운 `preventDefault()`와는 역할이 다르다.

```text
preventDefault()
= 브라우저의 기본 동작을 막음

stopPropagation()
= 이벤트가 다른 요소로 전파되는 것을 막음
```

이벤트 전파에는 정확히는 캡처링, 타깃, 버블링 단계가 있지만 현재 단계에서는 **자식에서 발생한 이벤트가 부모로 버블링될 수 있다**는 점을 우선 이해하면 충분하다.

관련 단계: 10, 18, 19, 43

관련 단계: 10, 18, 19, 43

---

# 5. 이후 단계에 필요한 JavaScript 기초

## 25. 값과 자료형 — 문자열·숫자·불리언·`null`·`undefined`

JavaScript에서는 여러 종류의 값을 다룬다.

예:

```javascript
"Hello"
30
true
null
undefined
```

이러한 값의 종류를 **자료형(Data Type)**이라고 한다.

### 문자열(String)

문자를 표현하는 값이다.

```javascript
const name = "Kim";
```

숫자처럼 보여도 따옴표 안에 있으면 문자열이다.

```text
"30" → 문자열
30   → 숫자
```

### 숫자(Number)

숫자를 표현한다.

```javascript
const age = 30;
```

숫자이므로 계산할 수 있다.

```javascript
10 + 20
```

결과:

```text
30
```

### 불리언(Boolean)

참과 거짓을 표현한다.

```javascript
true
false
```

예:

```javascript
const isLoggedIn = true;
```

### `null`

값이 없다는 것을 **의도적으로 표현**할 때 사용할 수 있다.

```javascript
let selectedUser = null;
```

### `undefined`

값이 아직 할당되지 않았거나 정해지지 않은 경우 등에 나타난다.

```javascript
let name;
```

이때 `name`의 값은 `undefined`다.

단순하게 구분하면:

```text
null
= 값이 없다고 명시적으로 표현

undefined
= 아직 값이 정해지지 않음
```

앞에서 배운 `querySelector()`도 요소를 찾지 못하면 `null`을 반환한다.

```javascript
const button = document.querySelector("#not-exists");
```

요소가 없다면:

```text
button → null
```

자료형은 JavaScript의 동작에도 영향을 준다.

```javascript
10 + 20
```

결과:

```text
30
```

반면:

```javascript
"10" + "20"
```

은 문자열이기 때문에:

```text
"1020"
```

이 될 수 있다.

핵심:

```text
"Hello"
→ String

30
→ Number

true / false
→ Boolean

null
→ 의도적으로 값이 없음을 표현

undefined
→ 아직 값이 정해지지 않은 상태 등에 사용
```

---

## 26. 변수 — `const`와 `let`

변수는 값에 이름을 붙여 나중에 다시 사용할 수 있게 한다.

```javascript
const name = "Kim";
```

여기서는 `"Kim"`이라는 값에 `name`이라는 이름을 붙였다.

### `const`

다른 값으로 다시 대입하지 않을 변수를 선언할 때 사용한다.

```javascript
const name = "Kim";
```

이후:

```javascript
name = "Lee";
```

처럼 다시 대입할 수 없다.

### `let`

값을 나중에 다시 대입해야 한다면 `let`을 사용한다.

```javascript
let count = 0;

count = 1;
count = 2;
```

정리:

```text
const
= 다시 대입하지 않을 변수

let
= 이후 다른 값으로 다시 대입할 변수
```

Java와 달리 JavaScript에서는 변수 선언 시 자료형을 직접 적지 않는다.

Java:

```java
String name = "Kim";
int age = 30;
```

JavaScript:

```javascript
const name = "Kim";
const age = 30;
```

변수가 아니라 **현재 저장된 값이 자료형을 가진다.**

앞에서 사용한:

```javascript
const button = document.querySelector("button");
```

도 DOM 요소를 찾은 결과에 `button`이라는 이름을 붙인 것이다.

일반적으로 JavaScript에서는 기본적으로 `const`를 사용하고, 실제로 재대입이 필요한 경우 `let`을 사용하는 방식이 많이 쓰인다.

---

## 27. 비교와 조건 — `if`, 삼항 연산자, `&&`

JavaScript에서는 조건의 결과가 `true`인지 `false`인지에 따라 다른 동작을 수행할 수 있다.

### 비교 연산

```javascript
const age = 30;

age >= 20
```

결과:

```javascript
true
```

대표적인 비교 연산자는:

```text
===   같다
!==   다르다
>     크다
<     작다
>=    크거나 같다
<=    작거나 같다
```

이다.

### `if`

조건이 참일 때 코드를 실행한다.

```javascript
if (age >= 20) {
    console.log("성인입니다.");
}
```

`else`를 이용하면 조건이 거짓일 때 다른 코드를 실행할 수 있다.

```javascript
if (age >= 20) {
    console.log("성인입니다.");
} else {
    console.log("미성년자입니다.");
}
```

DOM 요소의 존재 여부를 확인할 때도 사용할 수 있다.

```javascript
const button = document.querySelector("#button");

if (button !== null) {
    button.textContent = "확인";
}
```

### 삼항 연산자

조건에 따라 두 값 중 하나를 선택할 때 사용할 수 있다.

```javascript
const message = age >= 20 ? "성인" : "미성년자";
```

형태:

```text
조건 ? 참일 때 값 : 거짓일 때 값
```

### `&&`

두 조건이 모두 참인지 확인하는 AND 연산자다.

```javascript
if (age >= 20 && isLoggedIn) {
    console.log("접근 가능");
}
```

```text
true  && true  → true
true  && false → false
false && true  → false
false && false → false
```

핵심:

```text
비교
→ true 또는 false 생성

if
→ 조건에 따라 코드 실행

삼항 연산자
→ 조건에 따라 값 선택

&&
→ 두 조건이 모두 참인지 확인
```

---

## 28. 함수 — 매개변수·반환값·화살표 함수

함수는 여러 코드를 하나로 묶어 필요할 때 실행할 수 있게 한다.

### 함수 정의와 호출

```javascript
function greet() {
    console.log("Hello");
}
```

함수를 정의했다고 바로 실행되는 것은 아니다.

```javascript
greet();
```

처럼 호출해야 실행된다.

### 매개변수(Parameter)

함수가 외부에서 값을 받을 수 있다.

```javascript
function greet(name) {
    console.log(name);
}

greet("Kim");
```

여기서 `name`이 매개변수다.

여러 개의 값을 받을 수도 있다.

```javascript
function add(a, b) {
    console.log(a + b);
}
```

### 반환값(Return Value)

함수가 처리한 결과를 호출한 곳으로 돌려줄 수 있다.

```javascript
function add(a, b) {
    return a + b;
}

const result = add(10, 20);
```

결과:

```text
result → 30
```

`console.log()`와 `return`은 다르다.

```text
console.log()
= 콘솔에 출력

return
= 함수의 결과를 호출한 곳으로 전달
```

### 화살표 함수

JavaScript에서는 다음처럼 함수도 작성할 수 있다.

```javascript
const add = (a, b) => {
    return a + b;
};
```

한 줄의 값을 반환하는 경우:

```javascript
const add = (a, b) => a + b;
```

처럼 줄일 수도 있다.

이벤트 리스너에서 사용했던:

```javascript
button.addEventListener("click", () => {
    console.log("클릭");
});
```

의 두 번째 인자도 화살표 함수다.

핵심:

```text
입력값
 ↓
함수 실행
 ↓
처리
 ↓
반환값
```

---

## 29. 객체와 속성

객체(Object)는 관련된 여러 값을 하나로 묶어 표현할 때 사용한다.

```javascript
const user = {
    name: "Kim",
    age: 30,
    isLoggedIn: true
};
```

객체 안의 각각의 항목을 **속성(Property)**이라고 한다.

```text
name       → "Kim"
age        → 30
isLoggedIn → true
```

속성은 점(`.`)을 이용해 접근할 수 있다.

```javascript
user.name
user.age
```

속성 값을 변경할 수도 있다.

```javascript
user.age = 31;
```

객체 안에는 함수도 넣을 수 있다.

```javascript
const user = {
    name: "Kim",

    greet: () => {
        console.log("Hello");
    }
};
```

호출:

```javascript
user.greet();
```

객체가 가진 함수를 **메서드(Method)**라고 부른다.

앞에서 이미 비슷한 코드를 사용했다.

```javascript
document.querySelector(...)
```

에서 `document`는 객체이고 `querySelector()`는 메서드다.

```javascript
button.textContent
```

에서 `textContent`는 `button` 객체의 속성이다.

정리:

```text
객체.속성

객체.메서드()
```

---

## 30. 배열과 배열 메서드 — `map`·`filter`

배열(Array)은 여러 값을 순서대로 저장하는 구조다.

```javascript
const names = ["Kim", "Lee", "Park"];
```

각 값은 인덱스를 가지고 있으며 0부터 시작한다.

```text
names[0] → "Kim"
names[1] → "Lee"
names[2] → "Park"
```

객체 여러 개를 배열에 넣을 수도 있다.

```javascript
const users = [
    { name: "Kim", age: 30 },
    { name: "Lee", age: 25 },
    { name: "Park", age: 35 }
];
```

### `map()`

배열의 각 값을 변환해서 **새로운 배열**을 만든다.

```javascript
const numbers = [1, 2, 3];

const result = numbers.map((number) => {
    return number * 10;
});
```

결과:

```javascript
[10, 20, 30]
```

흐름:

```text
1 → 10
2 → 20
3 → 30
```

원본 배열은 그대로 유지된다.

### `filter()`

조건에 맞는 값만 골라 새로운 배열을 만든다.

```javascript
const numbers = [1, 2, 3, 4, 5];

const result = numbers.filter((number) => {
    return number > 3;
});
```

결과:

```javascript
[4, 5]
```

객체 배열에서도 사용할 수 있다.

```javascript
const adults = users.filter((user) => {
    return user.age >= 20;
});
```

정리:

```text
map
= 각 값을 변환

filter
= 조건에 맞는 값만 선별
```

---

## 31. 구조 분해와 전개 구문(`...`)

### 구조 분해(Destructuring)

객체나 배열에서 필요한 값을 꺼내 변수로 만들 수 있다.

객체:

```javascript
const user = {
    name: "Kim",
    age: 30
};

const { name, age } = user;
```

결과:

```text
name → "Kim"
age  → 30
```

배열:

```javascript
const numbers = [10, 20, 30];

const [first, second] = numbers;
```

결과:

```text
first  → 10
second → 20
```

객체 구조 분해는 속성 이름을 기준으로 하고, 배열 구조 분해는 순서를 기준으로 한다.

### 전개 구문(Spread Syntax)

`...`을 사용해 배열이나 객체의 내용을 펼칠 수 있다.

배열:

```javascript
const numbers = [1, 2, 3];

const copied = [...numbers];
```

새 값을 추가한 배열도 만들 수 있다.

```javascript
const newNumbers = [...numbers, 4];
```

결과:

```javascript
[1, 2, 3, 4]
```

객체:

```javascript
const user = {
    name: "Kim",
    age: 30
};

const copiedUser = {
    ...user
};
```

일부 속성을 바꾼 새로운 객체도 만들 수 있다.

```javascript
const updatedUser = {
    ...user,
    age: 31
};
```

결과:

```javascript
{
    name: "Kim",
    age: 31
}
```

정리:

```text
구조 분해
= 객체나 배열에서 값을 꺼내기

전개 구문
= 객체나 배열의 내용을 펼치기
```

---

## 32. 값의 복사와 참조 — 객체를 바꾸면 무엇이 같이 바뀌는가?

숫자나 문자열 같은 값과 객체·배열은 변수에 복사될 때 동작이 다르다.

### 숫자·문자열

```javascript
let a = 10;
let b = a;

b = 20;
```

결과:

```text
a → 10
b → 20
```

값 자체가 복사되기 때문에 서로 독립적이다.

### 객체

```javascript
const user1 = {
    name: "Kim"
};

const user2 = user1;
```

이 경우 객체 전체가 새로 만들어지는 것이 아니라 두 변수가 **같은 객체를 가리킨다.**

```text
user1 ─┐
       ↓
   같은 객체
       ↑
user2 ─┘
```

따라서:

```javascript
user2.name = "Lee";
```

라고 하면:

```text
user1.name → "Lee"
user2.name → "Lee"
```

가 된다.

배열도 같은 방식이다.

```javascript
const numbers1 = [1, 2, 3];
const numbers2 = numbers1;

numbers2.push(4);
```

결과:

```text
numbers1 → [1, 2, 3, 4]
numbers2 → [1, 2, 3, 4]
```

### 전개 구문으로 새 객체 만들기

```javascript
const user2 = {
    ...user1
};
```

이 경우 별도의 새 객체가 만들어진다.

```text
user1 → 객체 A
user2 → 객체 B
```

그래서 한쪽 객체의 속성을 바꿔도 다른 객체에는 바로 영향을 주지 않는다.

또한 `const`는 객체 내부 변경까지 막는 것이 아니다.

```javascript
const user = {
    name: "Kim"
};

user.name = "Lee";
```

는 가능하다.

`const`가 막는 것은 변수 자체에 다른 값을 다시 대입하는 것이다.

---

## 33. 콜백 함수 — 함수를 값으로 전달하기

JavaScript에서는 함수도 다른 함수에 값처럼 전달할 수 있다.

```javascript
const greet = () => {
    console.log("Hello");
};

function run(callback) {
    callback();
}

run(greet);
```

여기서 `greet`가 콜백 함수다.

흐름:

```text
greet 함수
   ↓
run()에 전달
   ↓
callback으로 받음
   ↓
callback() 실행
   ↓
greet 실행
```

특히 다음 차이가 중요하다.

```text
greet
= 함수 자체

greet()
= 함수를 지금 실행
```

이벤트 리스너에서도 콜백을 사용한다.

```javascript
button.addEventListener("click", () => {
    console.log("클릭");
});
```

여기서 화살표 함수는 클릭이 발생했을 때 나중에 실행될 콜백이다.

`map()`과 `filter()`에서도 콜백을 사용한다.

```javascript
numbers.map((number) => number * 10);
```

```javascript
numbers.filter((number) => number > 3);
```

핵심:

> **콜백 함수는 다른 함수에 전달되어, 필요한 시점에 실행되는 함수다.**

---

## 34. 동기와 비동기 — 기다리는 작업은 어떻게 처리되는가?

### 동기(Synchronous)

현재 작업이 끝난 뒤 다음 작업을 실행한다.

```javascript
console.log("A");
console.log("B");
console.log("C");
```

결과:

```text
A
B
C
```

```text
A 실행
 ↓
완료
 ↓
B 실행
 ↓
완료
 ↓
C 실행
```

### 비동기(Asynchronous)

서버 요청이나 일정 시간 기다리기처럼 시간이 걸리는 작업 때문에 전체 흐름을 멈추지 않고 다른 작업을 계속할 수 있다.

예:

```javascript
console.log("A");

setTimeout(() => {
    console.log("B");
}, 1000);

console.log("C");
```

결과는 보통:

```text
A
C
B
```

다.

단순화하면:

```text
A 실행
 ↓
1초 뒤 실행할 작업 등록
 ↓
C 실행
 ↓
시간이 지난 뒤 콜백 실행
 ↓
B 실행
```

비동기라고 해서 여러 JavaScript 코드가 반드시 동시에 실행된다는 뜻은 아니다.

핵심은:

> **기다림이 필요한 작업 때문에 현재 코드 흐름 전체를 멈추지 않을 수 있다는 것**

이다.

---

## 35. Promise와 `async` / `await`

비동기 작업은 결과가 즉시 나오지 않는다.

JavaScript에서는 나중에 완료될 작업의 결과를 **Promise**로 표현할 수 있다.

### Promise

Promise에는 대표적으로 세 상태가 있다.

```text
pending
= 처리 중

fulfilled
= 성공적으로 완료

rejected
= 실패
```

예를 들어:

```javascript
const promise = fetch("/users");
```

`fetch()`는 서버의 최종 응답을 즉시 반환하는 것이 아니라 비동기 요청의 결과를 나타내는 Promise를 반환한다.

### `.then()`

Promise가 성공했을 때 결과를 처리할 수 있다.

```javascript
fetch("/users").then((response) => {
    console.log(response);
});
```

실패하면 `.catch()`로 처리할 수 있다.

```javascript
fetch("/users")
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.log(error);
    });
```

### `async`

함수 앞에 `async`를 붙이면 그 함수 안에서 `await`를 사용할 수 있다.

```javascript
const loadUsers = async () => {
};
```

### `await`

```javascript
const loadUsers = async () => {
    const response = await fetch("/users");

    console.log(response);
};
```

`await`는 Promise가 완료될 때까지 **현재 async 함수의 다음 진행을 잠시 기다린다.**

```text
fetch() 실행
   ↓
Promise 반환
   ↓
await
   ↓
현재 함수 잠시 대기
   ↓
다른 작업은 처리 가능
   ↓
Promise 완료
   ↓
함수 다시 진행
```

`await` 때문에 JavaScript 전체가 멈추는 것은 아니다.

정리:

```text
Promise
= 비동기 작업의 미래 결과

async
= await를 사용할 수 있는 함수

await
= Promise 결과가 나올 때까지
  현재 async 함수의 진행을 기다림
```

---

## 36. 오류 처리 — `try` / `catch`

프로그램 실행 중 오류가 발생하면 현재 실행 흐름이 중단될 수 있다.

`try` / `catch`를 사용하면 오류가 발생했을 때 어떻게 처리할지 정의할 수 있다.

기본 형태:

```javascript
try {
    // 실행할 코드
} catch (error) {
    // 오류 처리
}
```

예:

```javascript
try {
    const user = null;

    console.log(user.name);
} catch (error) {
    console.log("오류가 발생했습니다.");
}
```

`user.name`에서 오류가 발생하면 `try`의 나머지 실행이 중단되고 `catch`로 이동한다.

```text
try
 ↓
코드 실행
 ↓
오류 없음
 ↓
계속 진행
```

또는:

```text
try
 ↓
오류 발생
 ↓
try의 나머지 코드 중단
 ↓
catch
 ↓
오류 처리
```

`catch`의 `error`에는 발생한 오류에 관한 정보가 들어간다.

```javascript
catch (error) {
    console.log(error.message);
}
```

비동기 코드와 함께서도 자주 사용한다.

```javascript
const loadUsers = async () => {
    try {
        const response = await fetch("/users");

        console.log(response);
    } catch (error) {
        console.log(error);
    }
};
```

핵심:

> **`try` / `catch`는 오류를 숨기는 기능이 아니라 실패가 발생했을 때 프로그램이 어떻게 대응할지를 정의하는 방법이다.**

관련 단계: 14~21, 35~50

---

# 6. 확인 도구

## 37. 브라우저 개발자 도구 — Elements·Console·Network에서 무엇을 볼 수 있는가?

브라우저 개발자 도구는 웹 페이지의 현재 상태를 확인하고 문제를 분석할 때 사용한다.

Chrome에서는 일반적으로:

```text
F12
```

또는:

```text
Ctrl + Shift + I
```

로 열 수 있다.

이번 과정에서 우선 알아둘 탭은 세 가지다.

```text
Elements
Console
Network
```

### Elements

현재 브라우저가 가지고 있는 **DOM과 적용된 CSS**를 확인한다.

예를 들어 원래 HTML이:

```html
<h1 id="title">Hello</h1>
```

이고 JavaScript에서:

```javascript
document.querySelector("#title").textContent = "Bye";
```

로 변경했다면 Elements에서는 현재 DOM 상태인:

```html
<h1 id="title">Bye</h1>
```

를 확인할 수 있다.

Elements에서는 특정 요소에 적용된 CSS, 계산된 스타일, `margin`, `padding`, `border` 등의 정보도 확인할 수 있다.

```text
Elements
= 현재 DOM과 CSS 확인
```

### Console

JavaScript 실행 결과와 오류를 확인한다.

```javascript
console.log("Hello");
```

를 실행하면:

```text
Hello
```

가 표시된다.

JavaScript 오류가 발생하면 오류 메시지도 Console에서 확인할 수 있다.

또한 Console에 직접 JavaScript를 입력해 실행할 수도 있다.

```javascript
1 + 2
```

결과:

```text
3
```

DOM도 직접 확인할 수 있다.

```javascript
document.querySelector("h1");
```

따라서:

```text
Console
= JavaScript 로그
= JavaScript 오류
= 간단한 JavaScript 직접 실행
```

에 사용할 수 있다.

### Network

브라우저와 서버 사이에서 발생하는 HTTP 요청과 응답을 확인한다.

예를 들어:

```text
GET /users
```

라는 요청이 발생하면 다음과 같은 정보를 확인할 수 있다.

```text
요청 URL
HTTP 메서드
상태 코드
응답 내용
요청 시간
```

상태 코드:

```text
200
404
500
```

등도 여기서 볼 수 있다.

서버가 JSON을 응답했다면 실제 응답 내용도 확인할 수 있다.

```json
{
  "name": "Kim",
  "age": 30
}
```

따라서 문제가 발생했을 때:

```text
서버 응답 자체가 잘못됐는가?

JavaScript가 잘못 처리했는가?

DOM이나 CSS가 잘못됐는가?
```

를 구분하는 데 사용할 수 있다.

세 탭을 가장 단순하게 정리하면:

```text
Elements
= 화면 구조와 CSS

Console
= JavaScript

Network
= 서버 통신
```

관련 단계: 모든 브라우저 확인 단계