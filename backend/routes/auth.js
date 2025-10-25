import { Router } from 'express';
import { body } from 'express-validator';
import { query } from '../src/db.js';
import { hash, verify } from '../src/utils/hash.js';
import { signAccess } from '../src/utils/jwt.js';
import crypto from 'crypto';

const r = Router();

// Đăng ký
r.post('/register',
  body('username').isLength({ min: 4 }),
  body('password').isLength({ min: 6 }),
  body('email').isEmail(),
  async (req, res) => {
    const { username, password, email } = req.body;
    // tạo hash/salt theo schema (varbinary 64/32)
    const salt = crypto.randomBytes(32);
    const passHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256');

    try {
      await query(`
        INSERT INTO dbo.NguoiDung (TenDangNhap, MatKhauHash, PasswordSalt, Email, VaiTro, TrangThai, NgayTao)
        VALUES (@u, @h, @s, @e, N'user', 1, SYSUTCDATETIME());`,
        (req, sql) => {
          req.input('u', sql.NVarChar(50), username);
          req.input('h', sql.VarBinary(64), passHash);
          req.input('s', sql.VarBinary(32), salt);
          req.input('e', sql.NVarChar(100), email);
        });
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: 'Username/Email duplicate?', detail: err.message });
    }
  }
);

// Đăng nhập
r.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const rs = await query(
    `SELECT TOP 1 IDNguoiDung, TenDangNhap, MatKhauHash, PasswordSalt, VaiTro
     FROM dbo.NguoiDung WHERE TenDangNhap=@u AND TrangThai=1`,
    (rq, sql) => rq.input('u', sql.NVarChar(50), username)
  );
  if (!rs.recordset.length) return res.status(401).json({ error: 'Invalid credentials' });

  const u = rs.recordset[0];
  const cand = crypto.pbkdf2Sync(password, u.PasswordSalt, 100000, 64, 'sha256');
  if (!crypto.timingSafeEqual(cand, u.MatKhauHash)) return res.status(401).json({ error: 'Invalid credentials' });

  const accessToken = signAccess({ uid: u.IDNguoiDung, role: u.VaiTro, name: u.TenDangNhap });

  // refresh token: random 256-bit lưu vào UserSession
  const refresh = crypto.randomBytes(48).toString('base64url');
  const exp = new Date(); exp.setDate(exp.getDate() + Number(process.env.REFRESH_EXPIRES_DAYS || 30));

  await query(
    `INSERT INTO dbo.UserSession (IDNguoiDung, RefreshToken, IssuedAt, ExpiresAt)
     VALUES(@id, @rt, SYSUTCDATETIME(), @exp)`,
    (rq, sql) => { rq.input('id', sql.Int, u.IDNguoiDung); rq.input('rt', sql.NVarChar(200), refresh); rq.input('exp', sql.DateTime2, exp); }
  );

  res.json({ accessToken, refreshToken: refresh });
});

// Refresh
r.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  const rs = await query(
    `SELECT TOP 1 s.IDNguoiDung, n.TenDangNhap, n.VaiTro
     FROM dbo.UserSession s JOIN dbo.NguoiDung n ON n.IDNguoiDung=s.IDNguoiDung
     WHERE s.RefreshToken=@rt AND s.ExpiresAt > SYSUTCDATETIME()`,
    (rq, sql) => rq.input('rt', sql.NVarChar(200), refreshToken)
  );
  if (!rs.recordset.length) return res.status(401).json({ error: 'Invalid refresh' });
  const u = rs.recordset[0];
  const accessToken = signAccess({ uid: u.IDNguoiDung, role: u.VaiTro, name: u.TenDangNhap });
  res.json({ accessToken });
});

export default r;
