Quy trình Git (dự án MABU)

Giữ terminal tại thư mục repo `Nhom_10_project`. Dùng checklist dưới đây để đẩy code ổn định.

Thiết lập lần đầu (chỉ 1 lần trên máy)
- Cấu hình danh tính:
  - `git config --global user.name "Truongtruong3804"`
  - `git config --global user.email "truong3804@gmail.com"`
- Tuỳ chọn (Windows, xử lý xuống dòng):
  - `git config --global core.autocrlf true`

Nếu tạo mới repo từ đầu (chưa có `.git` và remote)
- Khởi tạo repo tại thư mục hiện tại:
  - `git init`
  - `git branch -M main`
- Tạo repo trống trên GitHub (ví dụ): `https://github.com/<yourname>/mabu.git`
- Thêm remote và đẩy commit đầu tiên:
  - `git add -A`
  - `git commit -m "feat: initial MABU UI + mocks"`
  - `git remote add origin https://github.com/<yourname>/mabu.git`
  - `git push -u origin main`

Cập nhật về sau (repo đã gắn remote)
- Kiểm tra trạng thái hiện tại:
  - `git status`
  - `git branch -vv`
- Cách A — Đẩy trực tiếp lên `main` (nhanh nhất):
  - `git add -A`
  - `git commit -m "feat(frontend): MABU branding, theme, favorites"`
  - `git pull --rebase origin main`
  - `git push`
- Cách B — Làm trên nhánh tính năng (khuyến nghị):
  - `git switch -c feature/mabu-ui`
  - `git add -A`
  - `git commit -m "feat(frontend): MABU branding, theme, favorites"`
  - `git push -u origin feature/mabu-ui`
  - Lên GitHub mở Pull Request vào `main`

Tình huống: đã clone sẵn, sửa xong muốn cập nhật nhanh
- `cd Nhom_10_project`
- `git status` (xem thay đổi)
- `git add -A`
- `git commit -m "feat: cập nhật frontend MABU"`
- `git pull --rebase origin main` (kéo mới nhất, gộp lịch sử gọn)
- `git push` (hoặc `git push -u origin <ten-nhanh>` nếu là nhánh mới)

Lỗi thường gặp và cách xử lý nhanh
- "Author identity unknown": chạy 2 lệnh `git config --global` ở phần thiết lập.
- Khi push báo "no upstream": dùng `git push -u origin <ten-nhanh>` lần đầu.
- Conflict sau khi `pull --rebase`:
  - Sửa các file bị conflict (xem `git status`).
  - `git add -A`
  - Nếu đang rebase: `git rebase --continue` (lặp lại đến khi xong)
  - `git push`
- Đổi URL remote (khi chuyển repo):
  - `git remote set-url origin https://github.com/<yourname>/<new-repo>.git`

Những thứ nên bỏ qua khi commit
- Tạo `.gitignore` ở thư mục gốc repo, tối thiểu có:
  - `node_modules/`
  - `dist/`
  - `.vite/`
  - `.DS_Store`
  - `.env`

Tham khảo nhanh
- Xem remote: `git remote -v`
- Xem log gọn: `git log --oneline --graph --decorate -n 20`
- Hoàn tác commit cuối (giữ thay đổi đã stage): `git reset --soft HEAD^`
- Huỷ thay đổi cục bộ của một file: `git checkout -- <đường-dẫn-tập-tin>`

Khôi phục mã cũ khi gặp lỗi
- Tạo nhánh backup trước thao tác rủi ro:
  - `git switch -c backup/before-change`
- Xem lịch sử để tìm commit tốt:
  - `git log --oneline --graph -n 20`
- Khôi phục nội dung 1 file từ commit cũ (không đổi HEAD):
  - `git checkout <commit> -- <đường-dẫn-tập-tin>`
- Quay tạm thời về một commit để kiểm tra (detached HEAD):
  - `git checkout <commit>` → xem thử; quay lại nhánh: `git switch -`
- Đảo ngược 1 hoặc nhiều commit (tạo commit mới “revert”):
  - `git revert <commit>` (nhiều commit: từ cũ đến mới)
- Đặt lại nhánh về commit an toàn (cẩn trọng):
  - `git reset --hard <commit>` (chỉ dùng khi chắc chắn; nếu đã push cần `git push --force-with-lease` và nên trao đổi với team)
- Tìm lại commit “mất” gần đây:
  - `git reflog` → copy mã commit rồi `git checkout <commit>` hoặc `git reset --hard <commit>`
- Đang rebase/merge lỗi, muốn hủy:
  - Rebase: `git rebase --abort`
  - Merge: `git merge --abort`
- Lưu tạm thay đổi chưa sẵn sàng (stash):
  - Lưu: `git stash push -m "wip"`
  - Danh sách: `git stash list`
  - Khôi phục: `git stash pop`
