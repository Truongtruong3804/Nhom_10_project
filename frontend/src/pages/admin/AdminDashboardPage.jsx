import { useMemo, useState } from 'react'

const mockUsers = [
  { id: 'u1', name: 'Trần Minh An', email: 'antran@svmarket.vn', joined: '2024-05-12', posts: 12, status: 'active', verified: true },
  { id: 'u2', name: 'Nguyễn Thu Hà', email: 'thuha@svmarket.vn', joined: '2024-03-22', posts: 5, status: 'locked', verified: false },
  { id: 'u3', name: 'Phạm Quang Huy', email: 'huypham@svmarket.vn', joined: '2023-12-01', posts: 31, status: 'active', verified: true },
  { id: 'u4', name: 'Lê Hoàng Mai', email: 'hoangmai@svmarket.vn', joined: '2024-07-01', posts: 2, status: 'pending', verified: false },
]

const mockPosts = [
  { id: 'p101', title: 'Laptop Dell Inspiron 14', seller: 'Trần Minh An', created: '2024-09-10', price: 8500000, status: 'pending', reports: 0 },
  { id: 'p141', title: 'Tủ lạnh mini Sharp', seller: 'Nguyễn Thu Hà', created: '2024-09-08', price: 1700000, status: 'flagged', reports: 3 },
  { id: 'p161', title: 'Xe đạp Giant ATX', seller: 'Phạm Quang Huy', created: '2024-09-01', price: 3200000, status: 'approved', reports: 0 },
  { id: 'p188', title: 'Giáo trình Xác suất thống kê', seller: 'Lê Hoàng Mai', created: '2024-09-03', price: 90000, status: 'pending', reports: 1 },
]

const tabs = [
  { id: 'users', label: 'Người dùng', description: 'Quản lý tài khoản, khóa/mở, duyệt xác minh' },
  { id: 'posts', label: 'Bài đăng', description: 'Duyệt/xóa bài, xử lý báo cáo' },
  { id: 'stats', label: 'Thống kê', description: 'Theo dõi số liệu hoạt động' },
]

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState(mockUsers)
  const [posts, setPosts] = useState(mockPosts)
  const [userFilter, setUserFilter] = useState('all')
  const [postFilter, setPostFilter] = useState('all')

  const filteredUsers = useMemo(() => {
    if (userFilter === 'all') return users
    return users.filter((u) => u.status === userFilter)
  }, [users, userFilter])

  const filteredPosts = useMemo(() => {
    if (postFilter === 'all') return posts
    return posts.filter((p) => p.status === postFilter)
  }, [posts, postFilter])

  const toggleUserStatus = (id) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== id) return user
        const statusOrder = { active: 'locked', locked: 'active', pending: 'active' }
        return { ...user, status: statusOrder[user.status] || 'active' }
      }),
    )
  }

  const verifyUser = (id) => {
    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, verified: true, status: user.status === 'pending' ? 'active' : user.status } : user)))
  }

  const updatePostStatus = (id, status) => {
    setPosts((prev) => prev.map((post) => (post.id === id ? { ...post, status } : post)))
  }

  const stats = useMemo(() => {
    const totalPosts = posts.length
    const pendingPosts = posts.filter((p) => p.status === 'pending').length
    const flaggedPosts = posts.filter((p) => p.status === 'flagged').length
    const activeUsers = users.filter((u) => u.status === 'active').length
    return [
      { label: 'Tổng bài đăng', value: totalPosts },
      { label: 'Chờ duyệt', value: pendingPosts },
      { label: 'Báo cáo/vi phạm', value: flaggedPosts },
      { label: 'Người dùng hoạt động', value: activeUsers },
    ]
  }, [posts, users])

  return (
    <div className="page admin-page">
      <header className="admin-header">
        <div>
          <h2>Admin Dashboard</h2>
          <p>Theo dõi và xử lý nhanh các hoạt động trên SV Market.</p>
        </div>
        <div className="admin-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <strong>{tab.label}</strong>
              <span>{tab.description}</span>
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'users' && (
        <section>
          <div className="admin-controls">
            <h3>Người dùng</h3>
            <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)}>
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="locked">Đã khóa</option>
              <option value="pending">Chờ duyệt</option>
            </select>
          </div>
          <div className="admin-table" role="table" aria-label="Danh sách người dùng">
            <div className="admin-row admin-head">
              <span>Tên</span>
              <span>Email</span>
              <span>Bài đăng</span>
              <span>Trạng thái</span>
              <span>Hành động</span>
            </div>
            {filteredUsers.map((user) => (
              <div className="admin-row" key={user.id}>
                <div>
                  <div className="text-strong">{user.name}</div>
                  <div className="muted">Tham gia {new Date(user.joined).toLocaleDateString('vi-VN')}</div>
                </div>
                <span>{user.email}</span>
                <span>{user.posts}</span>
                <span>
                  <span className={`status-pill ${user.status}`}>{user.status === 'active' ? 'Hoạt động' : user.status === 'locked' ? 'Đã khóa' : 'Chờ duyệt'}</span>
                  {user.verified && <span className="status-pill verified">✓ Đã xác minh</span>}
                </span>
                <div className="row-actions">
                  <button type="button" className="btn-light small" onClick={() => toggleUserStatus(user.id)}>
                    {user.status === 'locked' ? 'Mở khóa' : 'Khóa'}
                  </button>
                  {!user.verified && (
                    <button type="button" className="btn small" onClick={() => verifyUser(user.id)}>
                      Duyệt
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'posts' && (
        <section>
          <div className="admin-controls">
            <h3>Bài đăng</h3>
            <select value={postFilter} onChange={(e) => setPostFilter(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="flagged">Bị báo cáo</option>
            </select>
          </div>
          <div className="admin-table" role="table" aria-label="Danh sách bài đăng">
            <div className="admin-row admin-head">
              <span>Tiêu đề</span>
              <span>Người bán</span>
              <span>Giá</span>
              <span>Trạng thái</span>
              <span>Hành động</span>
            </div>
            {filteredPosts.map((post) => (
              <div className="admin-row" key={post.id}>
                <div>
                  <div className="text-strong">{post.title}</div>
                  <div className="muted">Đăng ngày {new Date(post.created).toLocaleDateString('vi-VN')}</div>
                </div>
                <span>{post.seller}</span>
                <span>{post.price.toLocaleString('vi-VN')} đ</span>
                <span>
                  <span className={`status-pill ${post.status}`}>
                    {post.status === 'pending' && 'Chờ duyệt'}
                    {post.status === 'approved' && 'Đã duyệt'}
                {post.status === 'flagged' && 'Bị báo cáo'}
                  </span>
                  {post.reports > 0 && <span className="badge">Báo cáo: {post.reports}</span>}
                </span>
                <div className="row-actions">
                  {post.status !== 'approved' && (
                    <button type="button" className="btn small" onClick={() => updatePostStatus(post.id, 'approved')}>
                      Duyệt
                    </button>
                  )}
                  {post.status !== 'flagged' && (
                    <button type="button" className="btn-light small" onClick={() => updatePostStatus(post.id, 'flagged')}>
                      Gắn cờ
                    </button>
                  )}
                  <button type="button" className="btn-ghost small" onClick={() => updatePostStatus(post.id, 'pending')}>
                    Hoàn tác
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'stats' && (
        <section>
          <div className="admin-controls">
            <h3>Thống kê nhanh</h3>
          </div>
          <div className="admin-grid">
            {stats.map((item) => (
              <div key={item.label} className="card admin-stat">
                <div className="stat-value">{item.value}</div>
                <div className="muted">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="admin-note">
            Các con số hiện tại là mock data để mô phỏng storyboard. Khi API sẵn sàng, chỉ cần thay bằng dữ liệu thực thông qua fetch.
          </div>
        </section>
      )}
    </div>
  )
}
