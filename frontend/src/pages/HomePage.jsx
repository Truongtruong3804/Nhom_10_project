import { useEffect, useState } from 'react'
import { listProducts } from '../services/products'
import { isFavorite, toggleFavorite } from '../services/favorites'
import { navigate } from '../router'

const PAGE_SIZE = 8

function ProductCard({ item, onFav }) {
  return (
    <div className="card product">
      <div style={{ position: 'relative' }}>
        <img onClick={() => navigate(`/posts/${item.id}`)} src={item.images?.[0] || 'https://via.placeholder.com/300x200?text=Item'} alt={item.title} />
        <button className={`heart-btn ${isFavorite(item.id) ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); onFav(item.id) }} aria-label="Yêu thích">♥</button>
      </div>
      <div className="product-body">
        <h4>{item.title}</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="price">{item.price === 0 ? 'Miễn phí' : item.price.toLocaleString('vi-VN') + 'đ'}</div>
          {item.price === 0 && <span className="badge free">Free</span>}
        </div>
        <div className="meta">{item.category} • {item.condition}</div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('relevant')
  const [freeOnly, setFreeOnly] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const applySearchFromStorage = () => {
      try {
        const raw = localStorage.getItem('svm_search')
        if (raw) {
          const s = JSON.parse(raw) || {}
          if (typeof s.q === 'string') setQ(s.q)
          if (typeof s.category === 'string') setCategory(s.category)
        }
      } catch {}
    }
    applySearchFromStorage()
    const handler = () => applySearchFromStorage()
    window.addEventListener('svm_search_change', handler)
    let mounted = true
    listProducts({}).then((res) => {
      if (mounted) {
        setItems(res)
        setLoading(false)
      }
    })
    return () => { mounted = false; window.removeEventListener('svm_search_change', handler) }
  }, [])

  useEffect(() => {
    setPage(1)
  }, [q, category, sort, freeOnly])

  const filtered = items.filter((it) =>
    it.title.toLowerCase().includes(q.toLowerCase()) && (!category || it.category === category) && (!freeOnly || it.price === 0)
  )

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    return 0
  })

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages))
  }, [totalPages])

  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const paged = sorted.slice(start, start + PAGE_SIZE)

  const onFav = (id) => {
    toggleFavorite(id)
    setItems((prev) => [...prev])
  }

  const changePage = (next) => {
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const visiblePages = (() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 3) return [1, 2, 3, 4, 5]
    if (currentPage >= totalPages - 2) return Array.from({ length: 5 }, (_, i) => totalPages - 4 + i)
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2]
  })()

  return (
    <div className="page">
      <section className="home-hero">
        <div className="hero-text">
          <span className="hero-pill">Sàn trao đổi đồ cũ · Sinh viên</span>
          <h1>Đồ cũ vẫn chất, trao đổi cực nhanh</h1>
          <p>
            MABU là nơi bạn có thể mua bán lại sách, đồ điện tử, nội thất và hàng trăm món đồ cũ khác. Tái sử dụng để tiết kiệm và cùng nhau sống xanh hơn.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn" onClick={() => navigate('/posts/new')}>
              Đăng đồ cần nhượng
            </button>
            <button type="button" className="btn-light" onClick={() => navigate('/favorites')}>
              Xem đồ đang hot
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card marketing">
            <span className="hero-label">Giảm 50%</span>
            <h3>Tuần lễ tái sử dụng</h3>
            <p>Đăng bán đồ cũ của bạn ngay hôm nay để nhận ưu đãi phí dịch vụ.</p>
          </div>
          <div className="hero-card second marketing">
            <span className="hero-label">Hot trend</span>
            <h3>Đồ cũ, ý tưởng mới</h3>
            <p>Lên đồ độc lạ từ các món second-hand chất lượng được chọn lọc.</p>
          </div>
          <div className="hero-badge">MABU Campaign</div>
        </div>
      </section>

      <div className="home-cats">
        {[
          { label: 'Điện thoại – Laptop – Tablet', value: 'Điện tử' },
          { label: 'Đồ điện tử – Gia dụng', value: 'Điện tử' },
          { label: 'Xe máy – Xe đạp', value: 'Khác' },
          { label: 'Đồ nội thất – Trang trí', value: 'Nội thất' },
          { label: 'Thời trang – Phụ kiện', value: 'Thời trang' },
          { label: 'Sách – Đồ học tập', value: 'Sách' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className={`home-cat-card ${category === value ? 'active' : ''}`}
            onClick={() => setCategory(category === value ? '' : value)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setCategory(category === value ? '' : value) }}
          >
            {label}
          </div>
        ))}
      </div>

      {!loading && (
        <div className="toolbar-box" role="region" aria-label="Thanh công cụ">
          <div className="toolbar-left">
            <strong>{sorted.length}</strong> kết quả
          </div>
          <div className="toolbar-actions">
            <label className="field">
              <span>Sắp xếp</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="relevant">Mặc định</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
              </select>
            </label>
            <button className={`btn-toggle ${freeOnly ? 'active' : ''}`} onClick={() => setFreeOnly((v) => !v)}>
              Chỉ miễn phí
            </button>
            {category && (
              <button className="btn-ghost" onClick={() => setCategory('')}>Xóa bộ lọc</button>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card product skeleton">
              <div className="media" />
              <div className="line" />
              <div className="line" style={{ width: '60%' }} />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty">Không có kết quả.</div>
      ) : (
        <>
          <div className="grid">
            {paged.map((it) => (
              <ProductCard key={it.id} item={it} onFav={onFav} />
            ))}
          </div>
          {sorted.length > PAGE_SIZE && (
            <div className="pagination" role="navigation" aria-label="Phân trang sản phẩm">
              <button
                className="page-btn"
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Trước
              </button>
              <div className="pagination-pages">
                {visiblePages[0] > 1 && (
                  <>
                    <button className="page-btn" onClick={() => changePage(1)}>1</button>
                    {visiblePages[0] > 2 && <span className="pagination-ellipsis">…</span>}
                  </>
                )}
                {visiblePages.map((num) => (
                  <button
                    key={num}
                    className={`page-btn ${num === currentPage ? 'active' : ''}`}
                    onClick={() => changePage(num)}
                  >
                    {num}
                  </button>
                ))}
                {visiblePages[visiblePages.length - 1] < totalPages && (
                  <>
                    {visiblePages[visiblePages.length - 1] < totalPages - 1 && <span className="pagination-ellipsis">…</span>}
                    <button className="page-btn" onClick={() => changePage(totalPages)}>{totalPages}</button>
                  </>
                )}
              </div>
              <button
                className="page-btn"
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
