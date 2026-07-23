import { Link } from 'react-router-dom'
import { BookOpen, ClipboardCheck, Award } from 'lucide-react'
import DashboardShell from '../components/DashboardShell'
import { useStudentCollection } from '../hooks/useStudentCollection'
import { studentNavItems } from '../navItems'

export { studentNavItems }

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

export default function StudentDashboard() {
  const { items: enrollments, loading } = useStudentCollection('enrollments')
  const { items: results } = useStudentCollection('testResults')

  return (
    <DashboardShell navItems={studentNavItems} activeKey="home">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard icon={BookOpen} value={enrollments.length} label="الكورسات المسجّلة" tone="bg-blue-50 text-blue-500" />
        <StatCard icon={ClipboardCheck} value={results.length} label="اختبارات مُنجزة" tone="bg-violet-50 text-violet-500" />
        <StatCard icon={Award} value="—" label="الشهادات" tone="bg-amber-50 text-amber-500" />
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-800">كورساتي</h2>
          <Link to="/student/courses" className="text-primary-600 text-sm font-semibold hover:underline">
            عرض الكل
          </Link>
        </div>

        {loading && <p className="text-slate-500 text-sm">جاري التحميل...</p>}
        {!loading && enrollments.length === 0 && (
          <p className="text-slate-500 text-sm">
            لسه ماسجلتش في أي كورس،{' '}
            <Link to="/student/courses" className="text-primary-600 font-semibold hover:underline">
              تصفح الكورسات المتاحة
            </Link>
            .
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollments.slice(0, 3).map((en) => (
            <Link
              key={en.id}
              to={`/student/course/${en.courseId}`}
              className="border border-slate-100 rounded-xl p-4 hover:border-primary-200 transition-colors"
            >
              <h3 className="font-bold text-slate-800">{en.courseName}</h3>
              <p className="text-sm text-slate-500 mt-1">التقدم: {en.progress || 0}%</p>
            </Link>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
