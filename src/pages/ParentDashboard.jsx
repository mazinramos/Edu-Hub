import { Link } from 'react-router-dom'
import { Users, ClipboardCheck, BookOpen, GraduationCap } from 'lucide-react'
import DashboardShell from '../components/DashboardShell'
import { useParentCollection } from '../hooks/useParentCollection'
import { useCollectionByStudentIds } from '../hooks/useCollectionByStudentIds'
import { parentNavItems } from '../navItems'

export { parentNavItems }

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

export default function ParentDashboard() {
  const { items: children, loading } = useParentCollection('parentLinks')
  const studentIds = children.map((c) => c.studentId)
  const { items: enrollments } = useCollectionByStudentIds('enrollments', studentIds)
  const { items: results } = useCollectionByStudentIds('testResults', studentIds)

  return (
    <DashboardShell navItems={parentNavItems} activeKey="home">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Users} value={children.length} label="الأبناء المرتبطين" tone="bg-blue-50 text-blue-500" />
        <StatCard icon={BookOpen} value={enrollments.length} label="كورسات مسجّلة" tone="bg-violet-50 text-violet-500" />
        <StatCard icon={ClipboardCheck} value={results.length} label="اختبارات مُنجزة" tone="bg-emerald-50 text-emerald-500" />
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-800">الأبناء</h2>
          <Link to="/parent/children" className="text-primary-600 text-sm font-semibold hover:underline">
            إدارة الأبناء
          </Link>
        </div>

        {loading && <p className="text-slate-500 text-sm">جاري التحميل...</p>}
        {!loading && children.length === 0 && (
          <p className="text-slate-500 text-sm">
            لسه مربطتش أي طالب،{' '}
            <Link to="/parent/children" className="text-primary-600 font-semibold hover:underline">
              اربط أول طالب
            </Link>
            .
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.map((child) => {
            const childCourses = enrollments.filter((e) => e.studentId === child.studentId).length
            return (
              <div key={child.id} className="border border-slate-100 rounded-xl p-4">
                <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center mb-3">
                  <GraduationCap size={18} />
                </div>
                <h3 className="font-bold text-slate-800">{child.studentName}</h3>
                <p className="text-sm text-slate-500 mt-1">عدد الكورسات: {childCourses}</p>
              </div>
            )
          })}
        </div>
      </div>
    </DashboardShell>
  )
}
