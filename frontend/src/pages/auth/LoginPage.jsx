import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { navigate } from '../../router'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError('Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page narrow">
      <h2>Đăng nhập</h2>
      <form className="form" onSubmit={submit}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Mật khẩu</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <div className="error">{error}</div>}
        <button className="btn" disabled={loading}>{loading ? 'Đang xử lý...' : 'Đăng nhập'}</button>
      </form>
      <p>Chưa có tài khoản? <a onClick={() => navigate('/register')}>Đăng ký</a></p>
    </div>
  )
}

