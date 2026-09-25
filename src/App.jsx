// 환경 구성 단계의 기본 화면. 라우팅·CRUD·원격 연동은 다음 단위에서 추가한다.
function App() {
  return (
    <main className="app-shell">
      <h1>학습 기록 서비스</h1>
      <p>B1-1과 B1-2 학습자료를 한 곳에서 관리할 예정입니다.</p>
      <p className="status-note">현재는 개발 환경 준비 단계이며, 목록·상세·등록·수정 기능은 아직 없습니다.</p>
    </main>
  )
}

export default App
