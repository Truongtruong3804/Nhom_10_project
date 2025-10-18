import sql from 'mssql';
import 'dotenv/config';

const cfg = {
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DB,
  user: process.env.SQL_USER,
  password: process.env.SQL_PWD,
  options: { encrypt: false, trustServerCertificate: true },
  pool: { max: 10, min: 1, idleTimeoutMillis: 30000 }
};
const pool = new sql.ConnectionPool(cfg);
const poolConnect = pool.connect();

export async function query(q, paramsFn) {
  await poolConnect;
  const req = pool.request();
  if (paramsFn) paramsFn(req, sql);
  const result = await req.query(q);
  return result;
}
export { sql };
