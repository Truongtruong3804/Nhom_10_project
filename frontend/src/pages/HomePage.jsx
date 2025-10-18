import { useEffect, useState } from 'react'
import { listProducts } from '../services/products'
import { isFavorite, toggleFavorite } from '../services/favorites'
import { navigate } from '../router'

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

  const filtered = items.filter((it) =>
    it.title.toLowerCase().includes(q.toLowerCase()) && (!category || it.category === category) && (!freeOnly || it.price === 0)
  )

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    return 0
  })

  const onFav = (id) => {
    toggleFavorite(id)
    setItems((prev) => [...prev])
  }

  return (
    <div className="page">
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
        <div className="grid">
          {sorted.map((it) => (
            <ProductCard key={it.id} item={it} onFav={onFav} />
          ))}
        </div>
      )}
    </div>
  )
}

