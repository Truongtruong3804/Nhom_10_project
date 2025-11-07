import { useState } from 'react'

const cannedFaq = [
  {
    keywords: ['đăng', 'bài', 'tin'],
    answer: 'Để đăng đồ cần nhượng, bạn chọn nút "Đăng đồ cần nhượng" ở hero hoặc vào /posts/new, điền thông tin + hình ảnh rồi bấm Đăng. Nếu cần hướng dẫn chi tiết hãy xem mục Hỗ trợ trong footer.',
  },
  {
    keywords: ['quy định', 'vi phạm', 'cấm'],
    answer: 'MABU không cho phép đăng sản phẩm bị cấm, nội dung spam hoặc chứa thông tin nhạy cảm của người khác. Một món đồ chỉ nên đăng một lần để tránh bị ẩn.',
  },
  {
    keywords: ['phí', 'chiết khấu', 'hoa hồng'],
    answer: 'Hiện việc đăng và trao đổi đồ cũ trên MABU hoàn toàn miễn phí. Chúng tôi sẽ thông báo trước nếu có thay đổi về phí dịch vụ.',
  },
  {
    keywords: ['liên hệ', 'hỗ trợ', 'support'],
    answer: 'Bạn có thể liên hệ support@mabu.vn hoặc hotline 0900 000 000 để được hỗ trợ nhanh hơn. Ngoài ra mục Hỗ trợ ở footer cũng có các hướng dẫn chi tiết.',
  },
]

function getBotReply(text) {
  const normalized = text.toLowerCase()
  const matched = cannedFaq.find((faq) => faq.keywords.every((kw) => normalized.includes(kw)))
  if (matched) return matched.answer

  if (normalized.includes('xin chào') || normalized.includes('hello')) {
    return 'Xin chào! Bạn đang cần trao đổi đồ cũ hay tìm hiểu quy định nào? Mình sẵn sàng hỗ trợ.'
  }

  return 'Mình đã ghi nhận câu hỏi. Hiện bot chỉ trả lời các thắc mắc phổ biến về đăng bài, quy định và liên hệ. Bạn có thể để lại email để đội hỗ trợ phản hồi chi tiết hơn.'
}

export default function SupportBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Xin chào, mình là MABU Assistant. Bạn muốn hỏi gì về việc trao đổi đồ cũ không?' },
  ])
  const [draft, setDraft] = useState('')
  const [waiting, setWaiting] = useState(false)

  const sendMessage = () => {
    const text = draft.trim()
    if (!text) return
    setMessages((prev) => [...prev, { from: 'user', text }])
    setDraft('')
    setWaiting(true)
    setTimeout(() => {
      const reply = getBotReply(text)
      setMessages((prev) => [...prev, { from: 'bot', text: reply }])
      setWaiting(false)
    }, 400)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <button type="button" className="bot-toggle" onClick={() => setOpen((v) => !v)}>
        {open ? 'Đóng trợ lý' : 'Chat với MABU'}
      </button>
      {open && (
        <div className="bot-panel">
          <div className="bot-header">
            <div>
              <strong>MABU Assistant</strong>
              <span>Chatbot hỗ trợ trao đổi đồ cũ</span>
            </div>
            <button type="button" onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="bot-messages">
            {messages.map((msg, idx) => (
              <div key={`${msg.from}-${idx}`} className={`bot-bubble ${msg.from}`}>
                {msg.text}
              </div>
            ))}
            {waiting && <div className="bot-bubble bot-typing">Assistant đang trả lời...</div>}
          </div>
          <div className="bot-input">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Hỏi về đăng bài, quy định, phí..."
              rows={2}
            />
            <button type="button" onClick={sendMessage}>Gửi</button>
          </div>
        </div>
      )}
    </>
  )
}
