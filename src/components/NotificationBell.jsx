import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useNotifications } from '../hooks/useNotifications'

function timeAgo(seconds) {
  if (!seconds) return ''
  const diff = Date.now() / 1000 - seconds
  if (diff < 60) return 'الآن'
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`
  return `منذ ${Math.floor(diff / 86400)} يوم`
}

export default function NotificationBell() {
  const { items } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  const unreadCount = items.filter((n) => !n.read).length

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleClick(n) {
    if (!n.read) {
      try {
        await updateDoc(doc(db, 'notifications', n.id), { read: true })
      } catch (err) {
        console.error(err)
      }
    }
    setOpen(false)
    if (n.link) navigate(n.link)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -left-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-80 max-w-[90vw] bg-white rounded-2xl shadow-soft border border-slate-100 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 font-bold text-slate-800 text-sm">
            الإشعارات
          </div>
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 && (
              <p className="text-slate-400 text-sm text-center py-8">مفيش إشعارات لسه</p>
            )}
            {items.map((n) => (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={`w-full text-right px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                  !n.read ? 'bg-primary-50/40' : ''
                }`}
              >
                <div className="flex items-start gap-2">
                  {!n.read && <span className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 shrink-0" />}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                    {n.body && <p className="text-xs text-slate-500 mt-0.5">{n.body}</p>}
                    <p className="text-[11px] text-slate-400 mt-1">{timeAgo(n.createdAt?.seconds)}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
