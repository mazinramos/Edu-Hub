import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { doc, getDoc } from 'firebase/firestore'
import DashboardShell from '../components/DashboardShell'
import ChatThread from '../components/ChatThread'
import { useAuth } from '../context/AuthContext'
import { useParentCollection } from '../hooks/useParentCollection'
import { useCollectionByStudentIds } from '../hooks/useCollectionByStudentIds'
import { useMessages, groupMessagesByThread } from '../hooks/useMessages'
import { db } from '../firebase'
import { parentNavItems } from './ParentDashboard'

export default function ParentContactPage() {
  const { currentUser, profile } = useAuth()
  const { items: children } = useParentCollection('parentLinks')
  const studentIds = children.map((c) => c.studentId)
  const { items: enrollments } = useCollectionByStudentIds('enrollments', studentIds)
  const { items: allMessages } = useMessages()

  const [teacherNames, setTeacherNames] = useState({})
  const [activeTeacherId, setActiveTeacherId] = useState(null)

  const uniqueTeacherIds = [...new Set(enrollments.map((e) => e.teacherId))]

  useEffect(() => {
    uniqueTeacherIds.forEach(async (id) => {
      if (teacherNames[id] || !id) return
      const snap = await getDoc(doc(db, 'users', id))
      if (snap.exists()) {
        setTeacherNames((prev) => ({ ...prev, [id]: snap.data().name }))
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrollments.length])

  const threads = groupMessagesByThread(allMessages)

  function threadIdFor(teacherId) {
    return [currentUser.uid, teacherId].sort().join('_')
  }

  const activeThreadId = activeTeacherId ? threadIdFor(activeTeacherId) : null
  const activeMessages = activeThreadId ? threads[activeThreadId] || [] : []

  return (
    <DashboardShell
      navItems={parentNavItems}
      activeKey="contact"
      title="التواصل مع المدرسين"
      subtitle="راسل مدرسي أبنائك مباشرة"
    >
      {uniqueTeacherIds.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-8 text-center text-slate-500">
          لسه مفيش مدرسين لأبنائك، لازم يسجّلوا في كورس الأول.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`bg-white rounded-2xl shadow-soft border border-slate-100 p-4 sm:col-span-1 ${activeTeacherId ? 'hidden sm:block' : ''}`}>
            <h2 className="text-sm font-bold text-slate-500 mb-3 px-1">المدرسين</h2>
            <div className="space-y-1">
              {uniqueTeacherIds.map((id) => (
                <button
                  key={id}
                  onClick={() => setActiveTeacherId(id)}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-right transition-colors ${
                    activeTeacherId === id ? 'bg-primary-50 text-primary-700' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                    <MessageCircle size={14} />
                  </div>
                  <span className="font-semibold truncate">{teacherNames[id] || 'مدرس'}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={`sm:col-span-2 ${activeTeacherId ? '' : 'hidden sm:block'}`}>
            {activeTeacherId ? (
              <ChatThread
                threadId={activeThreadId}
                participants={[currentUser.uid, activeTeacherId]}
                otherName={teacherNames[activeTeacherId] || 'مدرس'}
                currentUser={currentUser}
                senderName={profile?.name || ''}
                messages={activeMessages}
                onBack={() => setActiveTeacherId(null)}
              />
            ) : (
              <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-8 text-center text-slate-400 h-[70vh] flex items-center justify-center">
                اختار مدرس من القائمة عشان تبدأ المحادثة
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  )
}
