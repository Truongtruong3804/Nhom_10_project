import bcrypt from 'bcryptjs';
export const hash = async (s) => await bcrypt.hash(s, 12);
export const verify = async (s, h) => await bcrypt.compare(s, h);
