# Nhom_10_project
Web trao đổi – cho tặng đồ cũ miễn phí

# Hướng dẫn cài đặt và chạy dự án

## Yêu cầu môi trường
- Node.js >= 20.19.0 (khuyến nghị dùng Node 20.19.0 trở lên)
- cài các extension cơ bản để chạy dự án
- npm (đi kèm Node.js)

## Các bước cài đặt
chạy database của MINH gửi ở nhóm ZALO, với user của SQL Server như sau:

SQL_SERVER=localhost\SQLEXPRESS
SQL_DB=QLTraoDoiDoDung
SQL_USER=new_user1
SQL_PWD=123456789

### 1. Clone dự án về máy
```sh
git clone https://github.com/Truongtruong3804/Nhom_10_project.git
cd Nhom_10_project
```

### 2. Cài đặt dependencies
```sh
cd backend
npm install
cd ../frontend
npm install
```

ở Folder Backend, tạo file có tên .env (ghi đúng như vậy .env) rồi đưa sữ liệu này vào file:

PORT=3000
SQL_SERVER=localhost\SQLEXPRESS
SQL_DB=QLTraoDoiDoDung
SQL_USER=new_user1
SQL_PWD=123456789
JWT_SECRET=change-this-256-bit-secret
JWT_EXPIRES=15m
REFRESH_EXPIRES_DAYS=30


### 3. Chạy dự án
Mở 2 terminal:

- **Terminal 1 (Backend):**
  ```sh
  cd backend
  npm run dev
  ```
- **Terminal 2 (Frontend):**
  ```sh
  cd frontend
  npm run dev
  ```

### 4. Truy cập web
- Mở trình duyệt và vào địa chỉ: http://localhost:5173

## Lưu ý
- Nếu gặp lỗi về phiên bản Node, hãy nâng cấp Node.js lên bản mới hơn (>= 20.19.0).
- Backend mặc định chạy ở http://localhost:3000 (có thể thay đổi trong file backend/server.js).
- Frontend sẽ tự động gọi API tới backend qua các endpoint.

