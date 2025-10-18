import { useEffect, useState } from 'react'
import { listChats } from '../../services/chats'
import { navigate } from '../../router'

export default function ChatsPage() {
  const [chats, setChats] = useState([])
  useEffect(() => { listChats().then(setChats) }, [])
  return (
    <div className="page">
      <h2>Hộp thư</h2>
      {chats.length === 0 ? (
        <div className="empty">Chưa có cuộc trò chuyện.</div>
      ) : (
        <div className="list">
          {chats.map((c) => (
            <div key={c.id} className="item" onClick={() => navigate(`/chats/${c.id}`)}>
              <div className="title">{c.withUser.name}</div>
              <div className="sub">{c.lastMessage}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

