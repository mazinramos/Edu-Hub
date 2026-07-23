import { useState } from 'react'
import { Send, ArrowRight } from 'lucide-react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { createNotification } from '../utils/notify'

export default function ChatThread({ threadId, participants, otherName, currentUser, senderName, messages, onBack }) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  async function handleSend(e) {
    e.preventDefault()
    if (!text.trim()) return
    setSending(true)
    try {
      await addDoc(collection(db, 'messages'), {
        threadId,
        participants,
        senderId: currentUser.uid,
        senderName,
        text: text.trim(),
        createdAt: serverTimestamp()
      })

      const otherId = participants.find((p) => p !== currentUser.uid)
      await createNotification({
        userId: otherId,
        type: 'message',
        title: `رسالة جديدة من ${senderName}`,
        body: text.trim().slice(0, 80),
        link: '' // كل صفحة بتحدد رابطها بنفسها عند العرض لاحقًا لو حبينا
      })

      setText('')
    } catch (err) {
      console.error(err)
      alert('تعذر إرسال الرسالة، حاول تاني.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-slate-100 flex flex-col h-[70vh]">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
        <button onClick={onBack} className="sm:hidden text-slate-500">
          <ArrowRight size={18} />
        </button>
        <h2 className="font-bold text-slate-800">{otherName}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {messages.length === 0 && (
          <p className="text-slate-400 text-sm text-center mt-10">ابدأ المحادثة بإرسال أول رسالة</p>
        )}
        {messages.map((m) => {
          const mine = m.senderId === currentUser.uid
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-start' : 'justify-end'}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  mine ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-800'
                }`}
              >
                {m.text}
              </div>
            </div>
          )
        })}
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 p-4 border-t border-slate-100">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب رسالتك..."
          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm focus-ring focus:border-primary-400"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white rounded-lg p-2.5"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}
