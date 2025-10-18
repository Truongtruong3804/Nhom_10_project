import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { navigate } from '../../router'

export default function RegisterPage() {
  const { login } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Mock register -> auto login
    await new Promise((r) => setTimeout(r, 500))
    await login(email, password)
    navigate('/')
  }

  return (
    <div className="page narrow">
      <h2>Đăng ký</h2>
      <form className="form" onSubmit={submit}>
        <label>Họ tên</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Mật khẩu</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn" disabled={loading}>{loading ? 'Đang xử lý...' : 'Tạo tài khoản'}</button>
      </form>
    </div>
  )
}

