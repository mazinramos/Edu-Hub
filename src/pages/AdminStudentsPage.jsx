import { httpsCallable } from 'firebase/functions'
import { GraduationCap, Ban, CheckCircle2 } from 'lucide-react'
import DashboardShell from '../components/DashboardShell'
import { useAllCollection } from '../hooks/useAllCollection'
import { functions } from '../firebase'
import { adminNavItems } from './AdminDashboard'

export default function AdminStudentsPage() {
  const { items: users, loading } = useAllCollection('users')
  const { items: enrollments } = useAllCollection('enrollments')

  const students = users.filter((u) => u.role === 'student')

  async function toggleDisabled(user) {
    const action = user.disabled ? 'تفعيل' : 'تعطيل'
    if (!confirm(`متأكد إنك عايز ${action} حساب "${user.name}"؟`)) return
    try {
      const setUserDisabled = httpsCallable(functions, 'setUserDisabled')
      await setUserDisabled({ uid: user.id, disabled: !user.disabled })
    } catch (err) {
      console.error(err)
      alert('تعذر تنفيذ العملية، تأكد إن دالة setUserDisabled متنشرة على السيرفر.')
    }
  }

  return (
    <DashboardShell navItems={adminNavItems} activeKey="students" title="الطلاب" subtitle="كل طلاب المنصة">
      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8">
        {loading && <p className="text-slate-500 text-sm">جاري التحميل...</p>}
        {!loading && students.length === 0 && <p className="text-slate-500 text-sm">لسه مفيش طلاب.</p>}

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-slate-500 text-right">
                <th className="px-2 pb-3 font-medium">الطالب</th>
                <th className="px-2 pb-3 font-medium">عدد الكورسات المسجّلة</th>
                <th className="px-2 pb-3 font-medium">الحالة</th>
                <th className="px-2 pb-3 font-medium">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const courseCount = enrollments.filter((e) => e.studentId === s.id).length
                return (
                  <tr key={s.id} className="border-t border-slate-100">
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-500 flex items-center justify-center">
                          <GraduationCap size={14} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{s.name}</p>
                          <p className="text-xs text-slate-500">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-slate-600">{courseCount}</td>
                    <td className="px-2 py-3">
                      <span
                        className={`text-xs font-semibold rounded-full px-2.5 py-1 ${
                          s.disabled ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'
                        }`}
                      >
                        {s.disabled ? 'معطّل' : 'نشط'}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <button
                        onClick={() => toggleDisabled(s)}
                        className={`flex items-center gap-1 text-xs font-semibold rounded-lg px-3 py-1.5 ${
                          s.disabled
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-500 hover:bg-red-100'
                        }`}
                      >
                        {s.disabled ? <CheckCircle2 size={14} /> : <Ban size={14} />}
                        {s.disabled ? 'تفعيل' : 'تعطيل'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  )
}
