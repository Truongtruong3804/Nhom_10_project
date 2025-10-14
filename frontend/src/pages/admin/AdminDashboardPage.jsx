export default function AdminDashboardPage() {
  return (
    <div className="page">
      <h2>Admin Dashboard</h2>
      <div className="grid admin">
        <div className="card">
          <h4>Người dùng</h4>
          <p>Quản lý tài khoản, khóa/mở, duyệt xác minh (mock)</p>
        </div>
        <div className="card">
          <h4>Bài đăng</h4>
          <p>Duyệt/xóa bài, báo cáo vi phạm, ẩn nội dung (mock)</p>
        </div>
        <div className="card">
          <h4>Thống kê</h4>
          <p>Số bài đăng, giao dịch, người dùng hoạt động (mock)</p>
        </div>
      </div>
    </div>
  )
}

