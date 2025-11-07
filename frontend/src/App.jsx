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

const icons = {
  home: (
    <svg className="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10.5V20a1 1 0 0 0 1 1h4.5v-5.5H13V21H18a1 1 0 0 0 1-1v-9.5" />
    </svg>
  ),
  post: (
    <svg className="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  ),
  heart: (
    <svg className="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20s-7-4.4-9-9.3C2 7 3.8 4.5 6.7 4.5c1.7 0 3.2.9 4.3 2.3 1.1-1.4 2.6-2.3 4.3-2.3 2.9 0 4.7 2.5 3.7 6.2-2 4.9-9 9.3-9 9.3z" />
    </svg>
  ),
  chat: (
    <svg className="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8l-4 4V6a1 1 0 0 1 1-1z" />
    </svg>
  ),
  user: (
    <svg className="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20.5c1.5-3.5 4.2-5.5 7-5.5s5.5 2 7 5.5" />
    </svg>
  ),
  logout: (
    <svg className="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h3" />
      <path d="M16 8l4 4-4 4" />
      <path d="M11 12h9" />
    </svg>
  ),
  login: (
    <svg className="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 5h3a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-3" />
      <path d="M8 8l-4 4 4 4" />
      <path d="M4 12h11" />
    </svg>
  ),
  register: (
    <svg className="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="2.5" />
      <path d="M3.5 19c1.2-2.8 3.4-4.3 5.5-4.3s4.3 1.5 5.5 4.3" />
      <path d="M17 8v8" />
      <path d="M13 12h8" />
    </svg>
  ),
}

function Icon({ name }) {
  return icons[name] || null
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
  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: 'home', action: () => navigate('/') },
    { id: 'post', label: 'Đăng bài', icon: 'post', action: () => navigate('/posts/new') },
    { id: 'fav', label: 'Yêu thích', icon: 'heart', action: () => navigate('/favorites') },
    { id: 'chat', label: 'Chat', icon: 'chat', action: () => navigate('/chats') },
  ]

  const userInitial = (user?.name || '?').trim().charAt(0).toUpperCase() || 'U'

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
        <nav className="nav-links nav-icons">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="nav-icon-btn"
              title={item.label}
              onClick={item.action}
            >
              <Icon name={item.icon} />
              <span className="sr-only">{item.label}</span>
            </button>
          ))}
          {user ? (
            <>
              <button
                type="button"
                className="nav-icon-btn nav-avatar"
                title="Tài khoản"
                onClick={() => navigate('/profile')}
              >
                <span aria-hidden>{userInitial}</span>
                <span className="sr-only">Trang cá nhân</span>
              </button>
              <button
                type="button"
                className="nav-icon-btn nav-logout"
                title="Đăng xuất"
                onClick={logout}
              >
                <Icon name="logout" />
                <span className="sr-only">Đăng xuất</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="nav-icon-btn"
                title="Đăng nhập"
                onClick={() => navigate('/login')}
              >
                <Icon name="login" />
                <span className="sr-only">Đăng nhập</span>
              </button>
              <button
                type="button"
                className="nav-icon-btn"
                title="Đăng ký"
                onClick={() => navigate('/register')}
              >
                <Icon name="register" />
                <span className="sr-only">Đăng ký tài khoản</span>
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

function FestiveDecor() {
  return (
    <div className="festive-decor" aria-hidden="true">
      <div className="decor-moon" />
      <div className="decor-mist" />
      <div className="decor-cloud decor-cloud-1" />
      <div className="decor-cloud decor-cloud-2" />
      <div className="decor-cloud decor-cloud-3" />
      <svg className="decor-sleigh" viewBox="0 0 360 150">
        <defs>
          <linearGradient id="sleighGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6b8cec" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>
        <path d="M20 120 C70 140 120 138 170 120 C194 112 214 126 260 118 C302 110 330 124 350 132" stroke="rgba(173,216,230,0.4)" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M30 96 Q60 130 130 110 Q160 100 190 70 L220 70 Q210 90 250 96 Q310 110 320 134 Q300 122 252 125 Q210 128 170 140 Q90 144 40 118 Z" fill="url(#sleighGlow)" opacity="0.85" />
        <circle cx="95" cy="64" r="18" fill="#0f172a" />
        <path d="M140 58 Q160 40 190 48 Q170 70 150 80" fill="#0f172a" />
        <path d="M200 58 Q230 52 250 60 Q240 78 218 86" fill="#0f172a" />
        <path d="M230 60 Q260 50 280 62 Q272 80 250 88" fill="#0f172a" />
        <path d="M260 62 Q290 52 310 64 Q300 82 278 90" fill="#0f172a" />
      </svg>
      <div className="decor-gifts">
        <div className="gift gift-gold">
          <span className="gift-ribbon" />
        </div>
        <div className="gift gift-red">
          <span className="gift-ribbon" />
        </div>
        <div className="gift gift-purple">
          <span className="gift-ribbon" />
        </div>
        <div className="gift-snowman">
          <div className="snowman-head">
            <span className="snowman-eye" />
            <span className="snowman-eye" />
            <span className="snowman-nose" />
          </div>
          <div className="snowman-body" />
          <div className="snowman-scarf" />
          <div className="snowman-hat" />
        </div>
        <div className="gift-lantern">
          <div className="lantern-light" />
        </div>
      </div>
      <div className="decor-fireflies">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}

const footerInfo = {
  guide: {
    title: 'Hướng dẫn đăng tin',
    points: [
      'Chuẩn bị hình ảnh rõ nét, tối đa 8 ảnh.',
      'Viết tiêu đề súc tích, không spam ký tự.',
      'Mô tả chi tiết tình trạng, phụ kiện kèm theo và lý do bán.',
      'Kiểm tra lại giá, danh mục, khu vực trước khi đăng.'
    ],
  },
  rules: {
    title: 'Quy định đăng bài',
    points: [
      'Không đăng sản phẩm bị cấm theo pháp luật Việt Nam.',
      'Một sản phẩm chỉ tạo một bài, không lặp lại cùng nội dung.',
      'Không sử dụng ngôn từ phản cảm, thông tin cá nhân của người khác.',
      'Hệ thống sẽ ẩn bài nếu phát hiện spam, bán hàng đa cấp.'
    ],
  },
  policy: {
    title: 'Chính sách bảo mật',
    points: [
      'Chúng tôi chỉ thu thập dữ liệu phục vụ trải nghiệm mua bán.',
      'Thông tin nhạy cảm (mật khẩu, token) được mã hóa và không chia sẻ cho bên thứ ba.',
      'Bạn có thể yêu cầu xuất hoặc xóa dữ liệu bằng cách liên hệ support@svmarket.vn.',
      'Cập nhật chính sách sẽ được thông báo trên trang chủ và email đăng ký.'
    ],
  },
}

function InfoModal({ data, onClose }) {
  if (!data) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{data.title}</h3>
        <ul>
          {data.points.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <button type="button" className="btn btn-light modal-close" onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  )
}

function Layout({ children }) {
  const [infoModal, setInfoModal] = React.useState(null)
  const openModal = (key) => setInfoModal(footerInfo[key])
  const closeModal = () => setInfoModal(null)
  return (
    <div className="layout">
      <FestiveDecor />
      <NavBar />
      <main>
        <div className="container">{children}</div>
      </main>
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
              <div className="footer-links">
                <button type="button" onClick={() => openModal('guide')}>Hướng dẫn đăng tin</button>
                <button type="button" onClick={() => openModal('rules')}>Quy định đăng bài</button>
                <button type="button" onClick={() => openModal('policy')}>Chính sách bảo mật</button>
              </div>
            </div>
          </div>
          <div className="footer-copy">© {new Date().getFullYear()} MABU</div>
        </div>
      </footer>
      <InfoModal data={infoModal} onClose={closeModal} />
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
