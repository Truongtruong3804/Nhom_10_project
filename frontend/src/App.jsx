import './App.css'
import './index.css'
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
  return (
    <header className="nav">
      <div className="nav-left" onClick={() => navigate('/')}
        style={{display:'flex',alignItems:'center',gap:8}}>
        <img src={logoUrl} alt="MABU" style={{width:28,height:28}}/>
        <span>MABU</span>
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
    </header>
  )
}

function Layout({ children }) {
  return (
    <div className="layout">
      <NavBar />
      <main className="container">{children}</main>
      <footer className="footer">© {new Date().getFullYear()} SV Market</footer>
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
