// props: 부모가 JSX 속성으로 넘긴 값을 담은 객체. 구조 분해로 title만 꺼내 제목으로 표시한다.
export default function PageTitle({ title }) {
  return <h1>{title}</h1>;
}
