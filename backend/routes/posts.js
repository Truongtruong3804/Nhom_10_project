import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { query } from '../src/db.js';
import cron from 'node-cron';

const r = Router();

// tạo bài đăng
r.post('/', auth, async (req, res) => {
  const { tieuDe, moTa, gia, viTri, idDanhMuc, hinhAnhUrls=[] } = req.body;
  const rs = await query(
   `INSERT INTO dbo.BaiDang(IDNguoiDung, IDDanhMuc, TieuDe, MoTa, Gia, ViTri, TrangThai, NgayDang, NgayCapNhat)
    OUTPUT INSERTED.IDBaiDang
    VALUES(@uid, @cat, @td, @mt, @gia, @vt, N'ConHang', SYSUTCDATETIME(), SYSUTCDATETIME());`,
    (rq, sql) => {
      rq.input('uid', sql.Int, req.user.uid);
      rq.input('cat', sql.Int, idDanhMuc);
      rq.input('td', sql.NVarChar(255), tieuDe);
      rq.input('mt', sql.NVarChar(sql.MAX), moTa ?? null);
      rq.input('gia', sql.Decimal(18,2), gia ?? null);
      rq.input('vt', sql.NVarChar(255), viTri ?? null);
    }
  );
  const id = rs.recordset[0].IDBaiDang;
  // ảnh
  for (let i=0;i<hinhAnhUrls.length;i++){
    await query(`INSERT INTO dbo.HinhAnh(IDBaiDang, Url, ThuTu) VALUES(@id, @u, @i)`,
      (rq, sql)=>{ rq.input('id', sql.Int, id); rq.input('u', sql.NVarChar(500), hinhAnhUrls[i]); rq.input('i', sql.Int, i+1); });
  }
  res.json({ id });
});

// cập nhật (giá, mô tả, trạng thái)
r.put('/:id', auth, async (req, res) => {
  const { moTa, gia, trangThai, viTri, idDanhMuc } = req.body;
  await query(
    `UPDATE dbo.BaiDang SET MoTa=@mt, Gia=@gia, TrangThai=ISNULL(@tt, TrangThai), ViTri=@vt, IDDanhMuc=ISNULL(@dm, IDDanhMuc),
     NgayCapNhat = SYSUTCDATETIME()
     WHERE IDBaiDang=@id AND IDNguoiDung=@uid`,
    (rq, sql)=>{
      rq.input('mt', sql.NVarChar(sql.MAX), moTa ?? null);
      rq.input('gia', sql.Decimal(18,2), gia ?? null);
      rq.input('tt', sql.NVarChar(30), trangThai ?? null);
      rq.input('vt', sql.NVarChar(255), viTri ?? null);
      rq.input('dm', sql.Int, idDanhMuc ?? null);
      rq.input('id', sql.Int, Number(req.params.id));
      rq.input('uid', sql.Int, req.user.uid);
    }
  );
  res.json({ ok:true });
});

// xoá bài (hard delete vì FK cascade ảnh/bình luận/yêu thích/báo cáo)
r.delete('/:id', auth, async (req, res)=>{
  await query(`DELETE FROM dbo.BaiDang WHERE IDBaiDang=@id AND IDNguoiDung=@uid`,
    (rq, sql)=>{ rq.input('id', sql.Int, Number(req.params.id)); rq.input('uid', sql.Int, req.user.uid); });
  res.json({ ok:true });
});

// lấy chi tiết
r.get('/:id', async (req,res)=>{
  const id = Number(req.params.id);
  const post = await query(
   `SELECT b.*, n.TenDangNhap AS ChuBai
    FROM dbo.BaiDang b JOIN dbo.NguoiDung n ON n.IDNguoiDung=b.IDNguoiDung
    WHERE b.IDBaiDang=@id`,
    (rq, sql)=>rq.input('id', sql.Int, id)
  );
  const imgs = await query(`SELECT Url, ThuTu FROM dbo.HinhAnh WHERE IDBaiDang=@id ORDER BY ThuTu`,
    (rq, sql)=>rq.input('id', sql.Int, id));
  res.json({ post: post.recordset[0], images: imgs.recordset });
});

// cron cập nhật thống kê mỗi ngày 00:05 UTC
cron.schedule('5 0 * * *', async ()=> { try { await query('EXEC dbo.sp_CapNhatThongKeNgay'); } catch{} });

export default r;
