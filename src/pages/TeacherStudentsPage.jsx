import { Users, CheckCircle2, Download } from 'lucide-react'
import DashboardShell from '../components/DashboardShell'
import { useTeacherCollection } from '../hooks/useTeacherCollection'
import { exportToExcel } from '../utils/exportExcel'
import { teacherNavItems } from './TeacherCoursesPage'

function statusFor(progress) {
  if (progress >= 80) return { label: 'ممتاز', tone: 'bg-emerald-50 text-emerald-600' }
  if (progress >= 50) return { label: 'متوسط', tone: 'bg-amber-50 text-amber-600' }
  return { label: 'يحتاج متابعة', tone: 'bg-red-50 text-red-500' }
}

export default function TeacherStudentsPage() {
  const { items: enrollments, loading, error } = useTeacherCollection('enrollments')

  const uniqueStudents = new Set(enrollments.map((e) => e.studentId)).size

  function handleExport() {
    const rows = enrollments.map((en) => ({
      الطالب: en.studentName,
      الكورس: en.courseName,
      'التقدم %': en.progress || 0,
      الحالة: statusFor(en.progress || 0).label
    }))
    exportToExcel([{ name: 'الطلاب', rows }], 'طلاب-EduHub.xlsx')
  }

  return (
    <DashboardShell
      navItems={teacherNavItems}
      activeKey="students"
      title="الطلاب"
      subtitle="متابعة أداء طلابك وتقدمهم"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <Users size={20} />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-800">{uniqueStudents}</div>
            <div className="text-sm text-slate-500">إجمالي الطلاب</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-800">{enrollments.length}</div>
            <div className="text-sm text-slate-500">إجمالي التسجيلات</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <h2 className="text-lg font-bold text-slate-800">قائمة الطلاب</h2>
          {enrollments.length > 0 && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 text-sm font-semibold text-primary-600 border border-primary-200 rounded-lg px-3 py-1.5 hover:bg-primary-50"
            >
              <Download size={14} /> تصدير Excel
            </button>
          )}
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {loading && <p className="text-slate-500 text-sm">جاري التحميل...</p>}
        {!loading && enrollments.length === 0 && (
          <p className="text-slate-500 text-sm">لسه مفيش طلاب مسجّلين في كورساتك.</p>
        )}

        {enrollments.length > 0 && (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="text-slate-500 text-right">
                  <th className="px-2 pb-3 font-medium">الطالب</th>
                  <th className="px-2 pb-3 font-medium">الكورس</th>
                  <th className="px-2 pb-3 font-medium">التقدم</th>
                  <th className="px-2 pb-3 font-medium">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((en) => {
                  const status = statusFor(en.progress || 0)
                  return (
                    <tr key={en.id} className="border-t border-slate-100">
                      <td className="px-2 py-3 font-semibold text-slate-800">{en.studentName}</td>
                      <td className="px-2 py-3 text-slate-600">{en.courseName}</td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-primary-500 rounded-full"
                              style={{ width: `${en.progress || 0}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500">{en.progress || 0}%</span>
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${status.tone}`}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
