import jwt from 'jsonwebtoken';
import 'dotenv/config';

export function signAccess(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '15m'
  });
}
export function verifyToken(t) { return jwt.verify(t, process.env.JWT_SECRET); }
