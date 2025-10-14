import { useEffect, useState } from 'react'
import { getFavorites } from '../services/favorites'
import { listProducts } from '../services/products'
import { navigate } from '../router'

export default function FavoritesPage() {
  const [items, setItems] = useState([])
  useEffect(() => {
    Promise.all([listProducts({}), getFavorites()]).then(([all, ids]) => {
      setItems(all.filter((p) => ids.includes(p.id)))
    })
  }, [])
  return (
    <div className="page">
      <h2>Sản phẩm yêu thích</h2>
      {items.length === 0 ? (
        <div className="empty">Chưa có sản phẩm yêu thích.</div>
      ) : (
        <div className="grid">
          {items.map((it) => (
            <div key={it.id} className="card product" onClick={() => navigate(`/posts/${it.id}`)}>
              <img src={it.images?.[0] || 'https://via.placeholder.com/300x200?text=Item'} />
              <div className="product-body">
                <h4>{it.title}</h4>
                <div className="price">{it.price === 0 ? 'Miễn phí' : it.price.toLocaleString('vi-VN') + 'đ'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
