import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { query } from '../db.js';
const r = Router();

r.post('/:to', auth, async (req,res)=>{
  await query(`
    INSERT INTO dbo.TinNhan(NguoiGui, NguoiNhan, NoiDung, ThoiGian, DaDoc)
    VALUES(@from,@to,@c,SYSUTCDATETIME(),0)`,
    (rq, sql)=>{ rq.input('from', sql.Int, req.user.uid);
                 rq.input('to', sql.Int, Number(req.params.to));
                 rq.input('c', sql.NVarChar(sql.MAX), req.body.noiDung); });
  res.json({ ok:true });
});

r.get('/dialog/:userA/:userB', auth, async (req,res)=>{
  const { userA, userB } = req.params;
  const rs = await query(`
    SELECT * FROM dbo.TinNhan
    WHERE (NguoiGui=@a AND NguoiNhan=@b) OR (NguoiGui=@b AND NguoiNhan=@a)
    ORDER BY ThoiGian`,
    (rq, sql)=>{ rq.input('a', sql.Int, Number(userA)); rq.input('b', sql.Int, Number(userB)); });
  res.json(rs.recordset);
});

r.post('/read/:from', auth, async (req,res)=>{
  await query(`UPDATE dbo.TinNhan SET DaDoc=1 WHERE NguoiGui=@f AND NguoiNhan=@me AND DaDoc=0`,
    (rq, sql)=>{ rq.input('f', sql.Int, Number(req.params.from)); rq.input('me', sql.Int, req.user.uid); });
  res.json({ ok:true });
});

export default r;
