import sql from 'mssql';
import 'dotenv/config';

function buildConfig() {
  const raw = process.env.SQL_SERVER?.trim();
  const cfg = {
    database: process.env.SQL_DB,
    user: process.env.SQL_USER,
    password: process.env.SQL_PWD,
    options: {
      encrypt: true,
      trustServerCertificate: true,
      enableArithAbort: true
    },
    pool: { max: 10, min: 0, idleTimeoutMillis: 30000 }
  };

  if (!raw) throw new Error('Missing SQL_SERVER');
  if (raw.includes('\\')) {
    const [host, instanceName] = raw.split('\\');
    cfg.server = host;
    cfg.options.instanceName = instanceName;
  } else if (raw.includes(':')) {
    const [host, port] = raw.split(':');
    cfg.server = host;
    cfg.port = Number(port);
  } else {
    cfg.server = raw;
  }
  return cfg;
}

const config = buildConfig();
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect().then(() => {
  console.log('[DB] Connected:', config.server, config.options.instanceName || '', config.port || '');
}).catch(e => {
  console.error('[DB] Connection error:', e?.originalError?.message || e.message);
  throw e;
});

export async function query(q, paramsFn){
  await poolConnect;
  const req = pool.request();
  if (typeof paramsFn === 'function') paramsFn(req, sql);
  return req.query(q);
}
export { sql, pool };
