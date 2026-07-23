import { Link } from 'react-router-dom'
import { Award, CheckCircle2, Lock } from 'lucide-react'
import DashboardShell from '../components/DashboardShell'
import { useStudentCollection } from '../hooks/useStudentCollection'
import { useCollectionByCourseIds } from '../hooks/useCollectionByCourseIds'
import { studentNavItems } from './StudentDashboard'

export default function StudentCertificatesPage() {
  const { items: enrollments, loading } = useStudentCollection('enrollments')
  const { items: results } = useStudentCollection('testResults')
  const courseIds = enrollments.map((e) => e.courseId)
  const { items: tests } = useCollectionByCourseIds('tests', courseIds)

  function isEligible(courseId) {
    const courseTests = tests.filter((t) => t.courseId === courseId)
    if (courseTests.length === 0) return true
    const courseResults = results.filter((r) => r.courseId === courseId)
    return courseResults.length >= courseTests.length
  }

  return (
    <DashboardShell
      navItems={studentNavItems}
      activeKey="certs"
      title="الشهادات"
      subtitle="شهادات إتمام كورساتك"
    >
      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8">
        {loading && <p className="text-slate-500 text-sm">جاري التحميل...</p>}
        {!loading && enrollments.length === 0 && (
          <p className="text-slate-500 text-sm">لسه ماسجلتش في أي كورس.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollments.map((en) => {
            const eligible = isEligible(en.courseId)
            return (
              <div key={en.id} className="border border-slate-100 rounded-xl p-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                    eligible ? 'bg-amber-50 text-amber-500' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Award size={18} />
                </div>
                <h3 className="font-bold text-slate-800">{en.courseName}</h3>

                {eligible ? (
                  <>
                    <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                      <CheckCircle2 size={12} /> جاهزة للاستخراج
                    </p>
                    <Link
                      to={`/student/certificate/${en.courseId}`}
                      className="inline-block mt-3 text-primary-600 text-sm font-semibold hover:underline"
                    >
                      عرض الشهادة
                    </Link>
                  </>
                ) : (
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Lock size={12} /> كمّل كل اختبارات الكورس أولاً
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </DashboardShell>
  )
}
