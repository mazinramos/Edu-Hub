import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import DashboardShell from '../components/DashboardShell'
import ChatThread from '../components/ChatThread'
import { useAuth } from '../context/AuthContext'
import { useMessages, groupMessagesByThread } from '../hooks/useMessages'
import { teacherNavItems } from './TeacherCoursesPage'

export default function TeacherMessagesPage() {
  const { currentUser, profile } = useAuth()
  const { items: allMessages, loading } = useMessages()
  const [activeThreadId, setActiveThreadId] = useState(null)

  const threads = groupMessagesByThread(allMessages)

  const conversations = Object.entries(threads)
    .map(([threadId, messages]) => {
      const last = messages[messages.length - 1]
      const otherId = last.participants.find((p) => p !== currentUser.uid)
      const otherMessage = messages.find((m) => m.senderId !== currentUser.uid)
      const otherName = otherMessage?.senderName || 'ولي أمر'
      return { threadId, otherId, otherName, last, messages }
    })
    .sort((a, b) => (b.last.createdAt?.seconds || 0) - (a.last.createdAt?.seconds || 0))

  const activeConversation = conversations.find((c) => c.threadId === activeThreadId)

  return (
    <DashboardShell
      navItems={teacherNavItems}
      activeKey="messages"
      title="الرسائل"
      subtitle="محادثاتك مع أولياء أمور طلابك"
    >
      {loading && <p className="text-slate-500 text-sm">جاري التحميل...</p>}
      {!loading && conversations.length === 0 && (
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-8 text-center text-slate-500">
          لسه معندكش أي رسائل من أولياء الأمور.
        </div>
      )}

      {conversations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`bg-white rounded-2xl shadow-soft border border-slate-100 p-4 sm:col-span-1 ${activeThreadId ? 'hidden sm:block' : ''}`}>
            <h2 className="text-sm font-bold text-slate-500 mb-3 px-1">المحادثات</h2>
            <div className="space-y-1">
              {conversations.map((c) => (
                <button
                  key={c.threadId}
                  onClick={() => setActiveThreadId(c.threadId)}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-right transition-colors ${
                    activeThreadId === c.threadId ? 'bg-primary-50 text-primary-700' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                    <MessageCircle size={14} />
                  </div>
                  <div className="min-w-0 text-right">
                    <p className="font-semibold truncate">{c.otherName}</p>
                    <p className="text-xs text-slate-400 truncate">{c.last.text}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className={`sm:col-span-2 ${activeThreadId ? '' : 'hidden sm:block'}`}>
            {activeConversation ? (
              <ChatThread
                threadId={activeConversation.threadId}
                participants={[currentUser.uid, activeConversation.otherId]}
                otherName={activeConversation.otherName}
                currentUser={currentUser}
                senderName={profile?.name || ''}
                messages={activeConversation.messages}
                onBack={() => setActiveThreadId(null)}
              />
            ) : (
              <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-8 text-center text-slate-400 h-[70vh] flex items-center justify-center">
                اختار محادثة من القائمة
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  )
}
