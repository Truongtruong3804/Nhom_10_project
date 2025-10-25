import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env'), override: true });

console.log('[ENV]', process.env.SQL_SERVER, process.env.SQL_USER); 

import express from 'express';
import cors from 'cors';
import auth from '../routes/auth.js';
import posts from '../routes/posts.js';
import comments from '../routes/comments.js';
import favorites from '../routes/favorites.js';
import messages from '../routes/messages.js';
import notifications from '../routes/notifications.js';
import ratings from '../routes/ratings.js';
import reports from '../routes/reports.js';
import search from '../routes/search.js';



const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/', (req,res)=>res.json({ ok:true, service:'market-api' }));

app.use('/api/auth', auth);
app.use('/api/posts', posts);
app.use('/api/comments', comments);
app.use('/api/favorites', favorites);
app.use('/api/ratings', ratings);
app.use('/api/reports', reports);
app.use('/api/messages', messages);
app.use('/api/notifications', notifications);
app.use('/api/search', search);

app.listen(process.env.PORT || 3000, ()=> {
  console.log('Server listening on ' + (process.env.PORT || 3000));
});
