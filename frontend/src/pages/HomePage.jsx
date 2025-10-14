import { useEffect, useState } from 'react'
import { listProducts } from '../services/products'
import { isFavorite, toggleFavorite } from '../services/favorites'
import { navigate } from '../router'

function ProductCard({ item, onFav }) {
  return (
    <div className="card product">
      <div style={{position:'relative'}}>
        <img onClick={() => navigate(`/posts/${item.id}`)} src={item.images?.[0] || 'https://via.placeholder.com/300x200?text=Item'} alt={item.title} />
        <button className={`heart-btn ${isFavorite(item.id)?'active':''}`} onClick={(e)=>{e.stopPropagation(); onFav(item.id)}} aria-label="Yêu thích">♥</button>
      </div>
      <div className="product-body">
        <h4>{item.title}</h4>
        <div style={{display:'flex', alignItems:'center', gap:8}}>
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

  useEffect(() => {
    let mounted = true
    listProducts({}).then((res) => {
      if (mounted) {
        setItems(res)
        setLoading(false)
      }
    })
    return () => (mounted = false)
  }, [])

  const filtered = items.filter((it) =>
    it.title.toLowerCase().includes(q.toLowerCase()) && (!category || it.category === category)
  )

  const onFav = (id) => {
    toggleFavorite(id)
    // Force refresh by updating state reference
    setItems((prev)=>[...prev])
  }

  return (
    <div className="page">
      <section className="hero">
        <h2 className="hero-title">Tìm đồ cho sinh viên nhanh hơn</h2>
        <div className="search-bar">
          <span className="seg" role="img" aria-label="search">🔍</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm kiếm đồ dùng..." />
          <span className="seg">Khu vực</span>
          <button className="btn">Tìm</button>
        </div>
        <div className="chips" style={{marginTop:8}}>
          {['Điện tử','Sách','Thời trang','Nội thất','Khác'].map((c) => (
            <div key={c} className={`chip ${category===c?'active':''}`} onClick={() => setCategory(category===c?'':c)}>{c}</div>
          ))}
        </div>
      </section>
      {loading ? (
        <div className="empty">Đang tải...</div>
      ) : filtered.length === 0 ? (
        <div className="empty">Không có kết quả.</div>
      ) : (
        <div className="grid">
          {filtered.map((it) => (
            <ProductCard key={it.id} item={it} onFav={onFav} />
          ))}
        </div>
      )}
    </div>
  )
}
