import { useState } from 'react'
import { createProduct } from '../../services/products'
import { navigate } from '../../router'

export default function CreatePostPage() {
  const [form, setForm] = useState({ title: '', price: 0, category: 'Điện tử', condition: 'Cũ', description: '', images: [''] })
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const created = await createProduct(form)
    setLoading(false)
    navigate(`/posts/${created.id}`)
  }

  return (
    <div className="page narrow">
      <h2>Đăng bài</h2>
      <form className="form" onSubmit={submit}>
        <label>Tiêu đề</label>
        <input value={form.title} onChange={(e) => set('title', e.target.value)} required />

        <label>Mô tả</label>
        <textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} />

        <div className="row">
          <div>
            <label>Giá (0 = miễn phí)</label>
            <input type="number" value={form.price} onChange={(e) => set('price', Number(e.target.value))} min={0} />
          </div>
          <div>
            <label>Danh mục</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)}>
              <option>Điện tử</option>
              <option>Sách</option>
              <option>Thời trang</option>
              <option>Nội thất</option>
            </select>
          </div>
          <div>
            <label>Tình trạng</label>
            <select value={form.condition} onChange={(e) => set('condition', e.target.value)}>
              <option>Mới</option>
              <option>Cũ</option>
            </select>
          </div>
        </div>

        <label>Ảnh (URL)</label>
        {form.images.map((u, idx) => (
          <input key={idx} value={u} placeholder={`https://...`} onChange={(e) => {
            const v = e.target.value
            setForm((f) => ({ ...f, images: f.images.map((x, i) => (i === idx ? v : x)) }))
          }} />
        ))}
        <button type="button" className="btn-light" onClick={() => setForm((f) => ({ ...f, images: [...f.images, ''] }))}>Thêm ảnh</button>

        <button className="btn" disabled={loading}>{loading ? 'Đang đăng...' : 'Đăng bài'}</button>
      </form>
    </div>
  )
}

