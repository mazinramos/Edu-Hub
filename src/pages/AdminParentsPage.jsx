import { httpsCallable } from 'firebase/functions'
import { Users, Ban, CheckCircle2 } from 'lucide-react'
import DashboardShell from '../components/DashboardShell'
import { useAllCollection } from '../hooks/useAllCollection'
import { functions } from '../firebase'
import { adminNavItems } from './AdminDashboard'

export default function AdminParentsPage() {
  const { items: users, loading } = useAllCollection('users')
  const { items: parentLinks } = useAllCollection('parentLinks')

  const parents = users.filter((u) => u.role === 'parent')

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
    <DashboardShell navItems={adminNavItems} activeKey="parents" title="أولياء الأمور" subtitle="كل أولياء الأمور على المنصة">
      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8">
        {loading && <p className="text-slate-500 text-sm">جاري التحميل...</p>}
        {!loading && parents.length === 0 && <p className="text-slate-500 text-sm">لسه مفيش أولياء أمور.</p>}

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-slate-500 text-right">
                <th className="px-2 pb-3 font-medium">ولي الأمر</th>
                <th className="px-2 pb-3 font-medium">عدد الأبناء المرتبطين</th>
                <th className="px-2 pb-3 font-medium">الحالة</th>
                <th className="px-2 pb-3 font-medium">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {parents.map((p) => {
                const childrenCount = parentLinks.filter((l) => l.parentId === p.id).length
                return (
                  <tr key={p.id} className="border-t border-slate-100">
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
                          <Users size={14} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{p.name}</p>
                          <p className="text-xs text-slate-500">{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-slate-600">{childrenCount}</td>
                    <td className="px-2 py-3">
                      <span
                        className={`text-xs font-semibold rounded-full px-2.5 py-1 ${
                          p.disabled ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'
                        }`}
                      >
                        {p.disabled ? 'معطّل' : 'نشط'}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <button
                        onClick={() => toggleDisabled(p)}
                        className={`flex items-center gap-1 text-xs font-semibold rounded-lg px-3 py-1.5 ${
                          p.disabled
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-500 hover:bg-red-100'
                        }`}
                      >
                        {p.disabled ? <CheckCircle2 size={14} /> : <Ban size={14} />}
                        {p.disabled ? 'تفعيل' : 'تعطيل'}
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
