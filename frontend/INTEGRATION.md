Frontend integration guide

Overview
- Simple hash router in `src/router.js` (no external libs).
- Auth mock via `src/context/AuthContext.jsx` stores user in `localStorage`.
- Mock data/services under `src/mocks` and `src/services`.
- All API calls centralize via `src/services/apiClient.js`.

Connect when backend is ready
Option A — Vite proxy (recommended in dev)
- Keep API paths starting with `/api` (already set in services).
- Do NOT set `VITE_API_URL` (leave empty).
- Flip `USE_MOCKS` to `false` in `src/services/apiClient.js`.
- Start backend at `http://localhost:4000` and Vite dev server will proxy `/api` → backend.

Option B — Absolute base URL
- Create `.env` in `frontend` with `VITE_API_URL=https://your-backend-host`.
- Flip `USE_MOCKS` to `false` in `src/services/apiClient.js`.
- Calls will go to `VITE_API_URL + '/api/...'`.

API patterns (suggested)
- Authentication: return `{ user, token }`; store `token` in `localStorage`; attach `Authorization: Bearer <token>` headers in `apiClient.js`.
- Error shape: `{ message, code }` for consistent UI handling.

Touchpoints by feature
- Home feed: `src/pages/HomePage.jsx` uses `listProducts()`.
- Post detail: `src/pages/posts/PostDetailPage.jsx` uses `getProductById(id)`.
- Create post: `src/pages/posts/CreatePostPage.jsx` uses `createProduct(payload)`.
- Login/Register: `src/pages/auth/*.jsx` call `AuthContext.login()`; replace with service once available.
- Chats & chat room: `src/pages/chat/*.jsx` use `listChats()`, `getChatById()`, `sendMessage()`.
- Profile: reads from `AuthContext`.
- Admin dashboard: UI placeholder only; wire later.

CORS/Proxy in dev
- Already configured proxy in `vite.config.js` for `/api`.
- If using Option B, configure CORS on backend to allow `http://localhost:5173`.

Routing
- Paths are hash-based: `#/`, `#/posts/123`. Use `navigate('/path')`.
- Dynamic routes supported like `/posts/:id`.

State
- Keep server state in services; easy to swap to React Query later.
