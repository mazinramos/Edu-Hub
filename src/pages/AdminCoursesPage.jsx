import { doc, deleteDoc } from 'firebase/firestore'
import { Trash2 } from 'lucide-react'
import DashboardShell from '../components/DashboardShell'
import { useAllCollection } from '../hooks/useAllCollection'
import { db } from '../firebase'
import { adminNavItems } from './AdminDashboard'

export default function AdminCoursesPage() {
  const { items: courses, loading } = useAllCollection('courses')
  const { items: users } = useAllCollection('users')

  const teacherName = (id) => users.find((u) => u.id === id)?.name || 'مدرس محذوف'

  async function handleDelete(course) {
    if (!confirm(`متأكد إنك عايز تحذف كورس "${course.title}"؟ الإجراء ده نهائي.`)) return
    try {
      await deleteDoc(doc(db, 'courses', course.id))
    } catch (err) {
      console.error(err)
      alert('تعذر حذف الكورس.')
    }
  }

  return (
    <DashboardShell navItems={adminNavItems} activeKey="courses" title="الكورسات" subtitle="كل كورسات المنصة عبر كل المدرسين">
      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8">
        {loading && <p className="text-slate-500 text-sm">جاري التحميل...</p>}
        {!loading && courses.length === 0 && <p className="text-slate-500 text-sm">لسه مفيش كورسات على المنصة.</p>}

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm min-w-[650px]">
            <thead>
              <tr className="text-slate-500 text-right">
                <th className="px-2 pb-3 font-medium">الكورس</th>
                <th className="px-2 pb-3 font-medium">المدرس</th>
                <th className="px-2 pb-3 font-medium">السعر</th>
                <th className="px-2 pb-3 font-medium">الطلاب</th>
                <th className="px-2 pb-3 font-medium">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="border-t border-slate-100">
                  <td className="px-2 py-3">
                    <p className="font-semibold text-slate-800">{c.title}</p>
                    <p className="text-xs text-slate-500">{c.category}</p>
                  </td>
                  <td className="px-2 py-3 text-slate-600">{teacherName(c.teacherId)}</td>
                  <td className="px-2 py-3 text-slate-600">{c.price ? `${c.price} جنيه` : 'مجاني'}</td>
                  <td className="px-2 py-3 text-slate-600">{c.studentsCount || 0}</td>
                  <td className="px-2 py-3">
                    <button
                      onClick={() => handleDelete(c)}
                      className="flex items-center gap-1 text-xs font-semibold rounded-lg px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100"
                    >
                      <Trash2 size={14} /> حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  )
}
