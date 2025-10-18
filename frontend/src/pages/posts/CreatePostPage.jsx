import { useState } from 'react'
import { createProduct } from '../../services/products'
import { navigate } from '../../router'

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function CreatePostPage() {
  const [form, setForm] = useState({
    title: '',
    price: 0,
    category: 'Điện tử',
    condition: 'Cũ',
    description: '',
    images: [],
  })
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const onFiles = async (fileList) => {
    const files = Array.from(fileList || [])
    const imgs = []
    for (const f of files) {
      if (!f.type?.startsWith('image/')) continue
      const data = await fileToDataUrl(f)
      imgs.push(data)
    }
    if (imgs.length) setForm((f) => ({ ...f, images: [...f.images, ...imgs] }))
  }

  const removeImage = (idx) => setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setLoading(true)
    const created = await createProduct(form)
    setLoading(false)
    navigate(`/posts/${created.id}`)
  }

  return (
    <div className="page">
      <div className="compose">
        {/* Media column */}
        <section className="panel card">
          <h3>Hình ảnh</h3>
          <div
            className={`dropzone ${dragOver ? 'over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); onFiles(e.dataTransfer.files) }}
            onPaste={(e) => onFiles(e.clipboardData.files)}
          >
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => onFiles(e.target.files)}
            />
            <p>Kéo & thả ảnh vào đây, hoặc</p>
            <button type="button" className="btn" onClick={() => document.getElementById('fileInput').click()}>
              Chọn ảnh
            </button>
            <p className="muted">Mẹo: dán (Ctrl/⌘+V) ảnh đã chụp màn hình</p>
          </div>

          {form.images.length > 0 && (
            <div className="thumbs">
              {form.images.map((src, idx) => (
                <div className="thumb" key={idx}>
                  <img src={src} alt={`Ảnh ${idx + 1}`} />
                  <button type="button" className="thumb-remove" onClick={() => removeImage(idx)}>×</button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Form column */}
        <section className="panel card">
          <h2>Đăng bài</h2>
          <form className="form" onSubmit={submit}>
            <label>Tiêu đề</label>
            <input className="input-lg" value={form.title} onChange={(e) => set('title', e.target.value)} required />

            <label>Mô tả</label>
            <textarea rows={5} value={form.description} onChange={(e) => set('description', e.target.value)} />

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
                  <option>Khác</option>
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

            <div className="actions" style={{justifyContent:'flex-end'}}>
              <button className="btn" disabled={loading}>{loading ? 'Đang đăng...' : 'Đăng bài'}</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}

