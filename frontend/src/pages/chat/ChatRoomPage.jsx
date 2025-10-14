import { useEffect, useRef, useState } from 'react'
import { getChatById, sendMessage } from '../../services/chats'

export default function ChatRoomPage({ params }) {
  const [chat, setChat] = useState(null)
  const [text, setText] = useState('')
  const listRef = useRef(null)
  
  useEffect(() => {
    getChatById(params.id).then(setChat)
  }, [params.id])

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [chat])

  if (!chat) return <div className="page">Đang tải...</div>

  const onSend = async () => {
    if (!text.trim()) return
    const updated = await sendMessage(chat.id, text)
    setChat(updated)
    setText('')
  }

  return (
    <div className="page">
      <h3>Chat với {chat.withUser.name}</h3>
      <div className="chat-box">
        <div className="chat-list" ref={listRef}>
          {chat.messages.map((m, idx) => (
            <div key={idx} className={`bubble ${m.me ? 'me' : ''}`}>
              <div className="content">{m.text}</div>
              <div className="time">{new Date(m.at).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Nhập tin nhắn..." onKeyDown={(e) => e.key==='Enter' && onSend()} />
          <button className="btn" onClick={onSend}>Gửi</button>
        </div>
      </div>
    </div>
  )
}

