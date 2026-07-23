import { Link } from 'react-router-dom'
import { Star, Wallet, Users, BookOpen } from 'lucide-react'
import DashboardShell from '../components/DashboardShell'
import { useTeacherCollection } from '../hooks/useTeacherCollection'
import { teacherNavItems } from './TeacherCoursesPage'

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

export default function TeacherDashboard() {
  const { items: courses, loading } = useTeacherCollection('courses')
  const { items: payments } = useTeacherCollection('payments')
  const { items: ratings } = useTeacherCollection('ratings')

  const totalStudents = courses.reduce((sum, c) => sum + (c.studentsCount || 0), 0)
  const totalEarnings = payments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const avgRating = ratings.length
    ? (ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length).toFixed(1)
    : '—'

  return (
    <DashboardShell navItems={teacherNavItems} activeKey="home">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Star} value={avgRating} label="التقييم" tone="bg-amber-50 text-amber-500" />
        <StatCard icon={Wallet} value={`${totalEarnings} جنيه`} label="الأرباح" tone="bg-emerald-50 text-emerald-500" />
        <StatCard icon={Users} value={totalStudents} label="الطلاب" tone="bg-blue-50 text-blue-500" />
        <StatCard icon={BookOpen} value={courses.length} label="الكورسات" tone="bg-violet-50 text-violet-500" />
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-800">أحدث الكورسات</h2>
          <Link to="/teacher/courses" className="text-primary-600 text-sm font-semibold hover:underline">
            عرض الكل
          </Link>
        </div>

        {loading && <p className="text-slate-500 text-sm">جاري التحميل...</p>}
        {!loading && courses.length === 0 && (
          <p className="text-slate-500 text-sm">
            لسه معملتش أي كورس،{' '}
            <Link to="/teacher/courses" className="text-primary-600 font-semibold hover:underline">
              ابدأ بإنشاء أول كورس
            </Link>
            .
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.slice(0, 3).map((course) => (
            <div key={course.id} className="border border-slate-100 rounded-xl p-4">
              <div className="w-full h-24 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold mb-3">
                {course.category}
              </div>
              <h3 className="font-bold text-slate-800">{course.title}</h3>
              <p className="text-sm text-slate-500 mt-1">عدد الطلاب: {course.studentsCount || 0}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
