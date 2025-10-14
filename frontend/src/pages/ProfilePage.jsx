import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user } = useAuth()
  if (!user) return <div className="page">Vui lòng đăng nhập để xem hồ sơ.</div>
  return (
    <div className="page">
      <h2>Hồ sơ</h2>
      <div className="card">
        <div><b>Tên:</b> {user.name}</div>
        <div><b>Email:</b> {user.email}</div>
        <div><b>Uy tín:</b> ★★★★☆ (mock)</div>
      </div>
    </div>
  )
}

