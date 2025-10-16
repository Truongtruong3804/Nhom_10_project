import './App.css'
import './index.css'
import React from 'react'
import { RouterView, navigate } from './router'
import { AuthProvider, useAuth } from './context/AuthContext'
import logoUrl from './assets/mabu.svg'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import CreatePostPage from './pages/posts/CreatePostPage'
import PostDetailPage from './pages/posts/PostDetailPage'
import FavoritesPage from './pages/FavoritesPage'
import ChatsPage from './pages/chat/ChatsPage'
import ChatRoomPage from './pages/chat/ChatRoomPage'
import ProfilePage from './pages/ProfilePage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'

const routes = {
  '/': HomePage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/posts/new': CreatePostPage,
  '/posts/:id': PostDetailPage,
  '/favorites': FavoritesPage,
  '/chats': ChatsPage,
  '/chats/:id': ChatRoomPage,
  '/profile': ProfilePage,
  '/admin': AdminDashboardPage,
}

function NavBar() {
  const { user, logout } = useAuth()
  // Header search state synced with HomePage via localStorage
  let initial = { q: '', category: '', location: '' }
  try {
    const raw = localStorage.getItem('svm_search')
    if (raw) initial = { ...initial, ...(JSON.parse(raw) || {}) }
  } catch {}
  const [q, setQ] = React.useState(initial.q)
  const [cat, setCat] = React.useState(initial.category)
  const [loc, setLoc] = React.useState(initial.location)

  const submitSearch = () => {
    try {
      localStorage.setItem('svm_search', JSON.stringify({ q, category: cat, location: loc }))
    } catch {}
    try { window.dispatchEvent(new Event('svm_search_change')) } catch {}
    navigate('/')
  }
  return (
    <header className="nav">
      <div className="nav-inner container">
        <div className="nav-left" onClick={() => navigate('/')}
          style={{display:'flex',alignItems:'center',gap:8}}>
          <img src={logoUrl} alt="MABU" style={{width:28,height:28}}/>
          <span>MABU</span>
        </div>
        <div className="nav-search">
          <div className="home-search nav-search-box">
            <label className="seg seg-cat">
              <span>DM</span>
              <select value={cat} onChange={(e)=>setCat(e.target.value)}>
                <option value="">Tất cả</option>
                <option value="Điện tử">Điện tử</option>
                <option value="Sách">Sách</option>
                <option value="Thời trang">Thời trang</option>
                <option value="Nội thất">Nội thất</option>
                <option value="Khác">Khác</option>
              </select>
            </label>
            <div className="seg seg-input">
              <span aria-hidden>🔎</span>
              <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Tìm sản phẩm..." onKeyDown={(e)=>{ if(e.key==='Enter') submitSearch() }} />
            </div>
            <button className="seg seg-loc" type="button" onClick={(e)=>e.preventDefault()}>
              <span aria-hidden>📍</span>
              <span>{loc || 'Khu vực'}</span>
            </button>
            <button className="seg seg-action" type="button" onClick={submitSearch}>Tìm</button>
          </div>
        </div>
        <nav className="nav-links">
          <a onClick={() => navigate('/')}>Trang chủ</a>
          <a onClick={() => navigate('/posts/new')}>Đăng bài</a>
          <a onClick={() => navigate('/favorites')}>Yêu thích</a>
          <a onClick={() => navigate('/chats')}>Chat</a>
          {user ? (
            <div className="nav-user">
              <a onClick={() => navigate('/profile')}>{user.name}</a>
              <button className="btn btn-light" onClick={logout}>Đăng xuất</button>
            </div>
          ) : (
            <div className="nav-auth">
              <button className="btn btn-light" onClick={() => navigate('/login')}>Đăng nhập</button>
              <button className="btn" onClick={() => navigate('/register')}>Đăng ký</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

function Layout({ children }) {
  return (
    <div className="layout">
      <NavBar />
      <main className="container">{children}</main>
      <footer className="footer">
        <div className="footer-inner container">
          <div className="footer-grid">
            <div>
              <h4>Liên hệ</h4>
              <p>Hotline: 0900 000 000</p>
              <p>Email: support@svmarket.vn</p>
              <p>Địa chỉ: Đại Học Giao Thông Vận Tải</p>
            </div>
            <div>
              <h4>Về chúng tôi</h4>
              <p>Nền tảng trao đổi đồ dùng cho sinh viên: an toàn, nhanh chóng, thân thiện.</p>
            </div>
            <div>
              <h4>Hỗ trợ</h4>
              <p>Hướng dẫn đăng tin</p>
              <p>Quy định đăng bài</p>
              <p>Chính sách bảo mật</p>
            </div>
          </div>
          <div className="footer-copy">© {new Date().getFullYear()} SV Market</div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Layout>
        <RouterView routes={routes} />
      </Layout>
    </AuthProvider>
  )
}

export default App
