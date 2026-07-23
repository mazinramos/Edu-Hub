import { LayoutGrid, Presentation, GraduationCap, Users, BookOpen, Wallet, Download } from 'lucide-react'
import DashboardShell from '../components/DashboardShell'
import { useAllCollection } from '../hooks/useAllCollection'
import { exportToExcel } from '../utils/exportExcel'

export const adminNavItems = [
  { key: 'home', label: 'الرئيسية', icon: LayoutGrid, to: '/admin' },
  { key: 'teachers', label: 'المدرسين', icon: Presentation, to: '/admin/teachers' },
  { key: 'students', label: 'الطلاب', icon: GraduationCap, to: '/admin/students' },
  { key: 'parents', label: 'أولياء الأمور', icon: Users, to: '/admin/parents' },
  { key: 'courses', label: 'الكورسات', icon: BookOpen, to: '/admin/courses' }
]

function StatCard({ icon: Icon, value, label, tone }) {
  return (
    <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${tone}`}>
        <Icon size={20} />
      </div>
      <div>
        <div className="text-xl font-extrabold text-slate-800">{value}</div>
        <div className="text-sm text-slate-500">{label}</div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { items: users, loading } = useAllCollection('users')
  const { items: courses } = useAllCollection('courses')
  const { items: payments } = useAllCollection('payments')

  const teachers = users.filter((u) => u.role === 'teacher')
  const students = users.filter((u) => u.role === 'student')
  const parents = users.filter((u) => u.role === 'parent')
  const revenue = payments
    .filter((p) => !p.status || p.status === 'paid')
    .reduce((sum, p) => sum + (p.amount || 0), 0)

  function handleExport() {
    exportToExcel(
      [
        {
          name: 'المدرسين',
          rows: teachers.map((t) => ({
            الاسم: t.name,
            البريد: t.email,
            الحالة: t.disabled ? 'معطّل' : 'نشط',
            'عدد الكورسات': courses.filter((c) => c.teacherId === t.id).length
          }))
        },
        {
          name: 'الطلاب',
          rows: students.map((s) => ({
            الاسم: s.name,
            البريد: s.email,
            الحالة: s.disabled ? 'معطّل' : 'نشط'
          }))
        },
        {
          name: 'أولياء الأمور',
          rows: parents.map((p) => ({
            الاسم: p.name,
            البريد: p.email,
            الحالة: p.disabled ? 'معطّل' : 'نشط'
          }))
        },
        {
          name: 'الكورسات',
          rows: courses.map((c) => ({
            الكورس: c.title,
            'السعر (جنيه)': c.price || 0,
            'عدد الطلاب': c.studentsCount || 0
          }))
        },
        {
          name: 'ملخص الإيرادات',
          rows: [{ 'إجمالي الإيرادات (جنيه)': revenue, 'عدد عمليات الشراء': payments.length }]
        }
      ],
      'تقرير-EduHub-الشامل.xlsx'
    )
  }

  return (
    <DashboardShell navItems={adminNavItems} activeKey="home" title="لوحة تحكم الإدارة" subtitle="نظرة شاملة على المنصة">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 text-sm font-semibold text-primary-600 border border-primary-200 rounded-lg px-3 py-1.5 hover:bg-primary-50 bg-white"
        >
          <Download size={14} /> تصدير تقرير شامل (Excel)
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Presentation} value={teachers.length} label="المدرسين" tone="bg-blue-50 text-blue-500" />
        <StatCard icon={GraduationCap} value={students.length} label="الطلاب" tone="bg-violet-50 text-violet-500" />
        <StatCard icon={Users} value={parents.length} label="أولياء الأمور" tone="bg-amber-50 text-amber-500" />
        <StatCard icon={BookOpen} value={courses.length} label="الكورسات" tone="bg-emerald-50 text-emerald-500" />
        <StatCard icon={Wallet} value={`${revenue} جنيه`} label="إجمالي الإيرادات" tone="bg-rose-50 text-rose-500" />
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-slate-800 mb-5">أحدث المستخدمين</h2>
        {loading && <p className="text-slate-500 text-sm">جاري التحميل...</p>}
        <div className="space-y-2">
          {users.slice(0, 6).map((u) => (
            <div key={u.id} className="flex items-center justify-between border border-slate-100 rounded-xl p-3">
              <div>
                <p className="font-semibold text-slate-800 text-sm">{u.name}</p>
                <p className="text-xs text-slate-500">{u.email}</p>
              </div>
              <span className="text-xs font-semibold text-primary-600 bg-primary-50 rounded-full px-2.5 py-1">
                {{ student: 'طالب', teacher: 'مدرس', parent: 'ولي أمر', admin: 'إدارة' }[u.role] || u.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
