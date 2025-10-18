import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { query } from '../db.js';
const r = Router();

r.post('/:postId', auth, async (req,res)=>{
  await query(`
    IF NOT EXISTS(SELECT 1 FROM dbo.YeuThich WHERE IDNguoiDung=@u AND IDBaiDang=@p)
      INSERT INTO dbo.YeuThich(IDNguoiDung, IDBaiDang, ThoiGian) VALUES(@u, @p, SYSUTCDATETIME())`,
    (rq, sql)=>{ rq.input('u', sql.Int, req.user.uid); rq.input('p', sql.Int, Number(req.params.postId)); });
  res.json({ ok:true });
});
r.delete('/:postId', auth, async (req,res)=>{
  await query(`DELETE FROM dbo.YeuThich WHERE IDNguoiDung=@u AND IDBaiDang=@p`,
    (rq, sql)=>{ rq.input('u', sql.Int, req.user.uid); rq.input('p', sql.Int, Number(req.params.postId)); });
  res.json({ ok:true });
});
r.get('/', auth, async (req,res)=>{
  const rs = await query(`
    SELECT y.IDBaiDang, b.TieuDe, b.Gia FROM dbo.YeuThich y
    JOIN dbo.BaiDang b ON b.IDBaiDang=y.IDBaiDang
    WHERE y.IDNguoiDung=@u ORDER BY y.ThoiGian DESC`,
    (rq, sql)=>rq.input('u', sql.Int, req.user.uid));
  res.json(rs.recordset);
});
export default r;
