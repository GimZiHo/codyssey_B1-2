import SiteHeader from './SiteHeader.jsx';

// children: 여는 태그와 닫는 태그 사이에 넣은 JSX를 받는 prop.
// 레이아웃은 어떤 페이지인지 모른 채 틀(헤더·main)만 정하고, 내용은 부모가 채운다.
export default function Layout({ children }) {
  return (
    <div>
      <SiteHeader />
      <main>{children}</main>
    </div>
  );
}
