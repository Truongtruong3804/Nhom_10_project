import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { query } from '../db.js';
const r = Router();

r.get('/', auth, async (req,res)=>{
  const rs = await query(`SELECT * FROM dbo.ThongBao WHERE IDNguoiNhan=@u ORDER BY ThoiGian DESC`,
    (rq, sql)=>rq.input('u', sql.Int, req.user.uid));
  res.json(rs.recordset);
});

r.post('/', auth, async (req,res)=>{
  const { toUserId, loai, noiDung } = req.body;
  await query(`INSERT INTO dbo.ThongBao(IDNguoiNhan, LoaiThongBao, NoiDung, DaDoc, ThoiGian)
               VALUES(@to, @l, @c, 0, SYSUTCDATETIME())`,
    (rq, sql)=>{ rq.input('to', sql.Int, toUserId);
                 rq.input('l', sql.NVarChar(50), loai);
                 rq.input('c', sql.NVarChar(500), noiDung); });
  res.json({ ok:true });
});

r.post('/read/:id', auth, async (req,res)=>{
  await query(`UPDATE dbo.ThongBao SET DaDoc=1 WHERE IDThongBao=@id AND IDNguoiNhan=@u`,
    (rq, sql)=>{ rq.input('id', sql.Int, Number(req.params.id)); rq.input('u', sql.Int, req.user.uid); });
  res.json({ ok:true });
});

export default r;
