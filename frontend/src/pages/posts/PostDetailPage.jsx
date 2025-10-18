import { useEffect, useState } from 'react'
import { getProductById } from '../../services/products'
import { isFavorite, toggleFavorite } from '../../services/favorites'
import { navigate } from '../../router'

export default function PostDetailPage({ params }) {
  const { id } = params
  const [item, setItem] = useState(null)

  useEffect(() => {
    getProductById(id).then(setItem)
  }, [id])

  if (!item) return <div className="page">Đang tải...</div>

  return (
    <div className="page">
      <div className="detail">
        <div className="detail-media">
          <img src={item.images?.[0] || 'https://via.placeholder.com/600x400?text=Item'} alt={item.title} />
        </div>
        <div className="detail-info">
          <h2>{item.title}</h2>
          <div className="price big">{item.price === 0 ? 'Miễn phí' : item.price.toLocaleString('vi-VN') + 'đ'}</div>
          <div className="meta">{item.category} • {item.condition}</div>
          <p>{item.description || 'Không có mô tả.'}</p>
          <div className="actions">
            <button className="btn" onClick={() => navigate(`/chats/${item.sellerId || 'u2'}`)}>Chat với người bán</button>
            <button className="btn-light" onClick={() => { toggleFavorite(item.id); alert(isFavorite(item.id)?'Đã bỏ yêu thích':'Đã thêm vào yêu thích') }}>
              {isFavorite(item.id) ? 'Bỏ yêu thích' : 'Yêu thích'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
