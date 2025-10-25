import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { query } from '../src/db.js';
const r = Router();

r.post('/:postId', auth, async (req,res)=>{
  await query(`
    INSERT INTO dbo.BaoCao(IDBaiDang, IDNguoiDung, LyDo, NgayBaoCao, TrangThai)
    VALUES(@p, @u, @lydo, SYSUTCDATETIME(), N'ChoXuLy')`,
    (rq, sql)=>{ rq.input('p', sql.Int, Number(req.params.postId));
                 rq.input('u', sql.Int, req.user.uid);
                 rq.input('lydo', sql.NVarChar(255), req.body.lyDo); });
  res.json({ ok:true });
});
export default r;
