import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { query } from '../db.js';
const r = Router();

// tạo/sửa 1 lần mỗi cặp
r.post('/', auth, async (req,res)=>{
  const { toUserId, diem, nhanXet } = req.body;
  await query(`
    IF EXISTS (SELECT 1 FROM dbo.DanhGia WHERE IDNguoiDanhGia=@from AND IDNguoiDuocDanhGia=@to)
      UPDATE dbo.DanhGia SET Diem=@d, NhanXet=@nx, NgayDanhGia=SYSUTCDATETIME()
      WHERE IDNguoiDanhGia=@from AND IDNguoiDuocDanhGia=@to
    ELSE
      INSERT INTO dbo.DanhGia(IDNguoiDanhGia, IDNguoiDuocDanhGia, Diem, NhanXet, NgayDanhGia)
      VALUES(@from, @to, @d, @nx, SYSUTCDATETIME())`,
    (rq, sql)=>{ rq.input('from', sql.Int, req.user.uid);
                 rq.input('to', sql.Int, toUserId);
                 rq.input('d', sql.Int, diem);
                 rq.input('nx', sql.NVarChar(255), nhanXet ?? null); });
  res.json({ ok:true });
});

// điểm uy tín
r.get('/reputation/:userId', async (req,res)=>{
  const rs = await query(`
    SELECT AVG(CAST(Diem AS FLOAT)) AS DiemTB, COUNT(*) AS SoDanhGia
    FROM dbo.DanhGia WHERE IDNguoiDuocDanhGia=@id`,
    (rq, sql)=>rq.input('id', sql.Int, Number(req.params.userId)));
  res.json(rs.recordset[0] || { DiemTB: null, SoDanhGia: 0 });
});

export default r;
