import { useState } from 'react'
import { ClipboardCheck, CheckCircle2, Clock } from 'lucide-react'
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore'
import DashboardShell from '../components/DashboardShell'
import { useAuth } from '../context/AuthContext'
import { useStudentCollection } from '../hooks/useStudentCollection'
import { useCollectionByCourseIds } from '../hooks/useCollectionByCourseIds'
import { db } from '../firebase'
import { createNotification } from '../utils/notify'
import { studentNavItems } from './StudentDashboard'

export default function StudentTestsPage() {
  const { currentUser, profile } = useAuth()
  const { items: enrollments } = useStudentCollection('enrollments')
  const { items: results } = useStudentCollection('testResults')

  const courseIds = enrollments.map((e) => e.courseId)
  const { items: tests, loading } = useCollectionByCourseIds('tests', courseIds)

  const [activeTest, setActiveTest] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [lastResult, setLastResult] = useState(null)

  const resultByTestId = {}
  results.forEach((r) => {
    resultByTestId[r.testId] = r
  })

  function startTest(test) {
    setActiveTest(test)
    setAnswers({})
    setLastResult(null)
  }

  async function submitTest() {
    setSubmitting(true)
    try {
      const perQuestion = activeTest.totalScore / activeTest.questions.length
      let correctCount = 0
      activeTest.questions.forEach((q, i) => {
        if (answers[i] === q.correctIndex) correctCount += 1
      })
      const score = Math.round(correctCount * perQuestion)

      const resultDoc = {
        studentId: currentUser.uid,
        studentName: profile?.name || '',
        testId: activeTest.id,
        testTitle: activeTest.title,
        courseId: activeTest.courseId,
        courseName: activeTest.courseName,
        score,
        totalScore: activeTest.totalScore,
        correctCount,
        questionsCount: activeTest.questions.length,
        createdAt: serverTimestamp()
      }
      await addDoc(collection(db, 'testResults'), resultDoc)
      setLastResult(resultDoc)

      // إشعار أولياء الأمور المرتبطين بالطالب (لو موجودين)
      const parentsSnap = await getDocs(
        query(collection(db, 'parentLinks'), where('studentId', '==', currentUser.uid))
      )
      parentsSnap.forEach((p) => {
        createNotification({
          userId: p.data().parentId,
          type: 'test_result',
          title: `نتيجة اختبار جديدة لـ ${profile?.name || 'ابنك'}`,
          body: `${activeTest.title}: ${score} / ${activeTest.totalScore}`,
          link: '/parent/tests'
        })
      })
    } catch (err) {
      console.error(err)
      alert('تعذر إرسال إجاباتك، حاول تاني.')
    } finally {
      setSubmitting(false)
    }
  }

  // شاشة نتيجة الاختبار بعد التسليم
  if (activeTest && lastResult) {
    return (
      <DashboardShell navItems={studentNavItems} activeKey="tests" title="نتيجة الاختبار">
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={30} />
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-1">{activeTest.title}</h2>
          <p className="text-slate-500 text-sm mb-4">تم تسليم إجاباتك بنجاح</p>
          <div className="text-3xl font-extrabold text-primary-600 mb-6">
            {lastResult.score} / {lastResult.totalScore}
          </div>
          <button
            onClick={() => {
              setActiveTest(null)
              setLastResult(null)
            }}
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg py-2.5 px-6 text-sm"
          >
            رجوع لقائمة الاختبارات
          </button>
        </div>
      </DashboardShell>
    )
  }

  // شاشة حل الاختبار
  if (activeTest) {
    const allAnswered = activeTest.questions.every((_, i) => answers[i] !== undefined)
    return (
      <DashboardShell navItems={studentNavItems} activeKey="tests" title={activeTest.title} subtitle={activeTest.courseName}>
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8">
          <div className="space-y-5">
            {activeTest.questions.map((q, qIndex) => (
              <div key={qIndex} className="border border-slate-100 rounded-xl p-4">
                <p className="font-semibold text-slate-800 mb-3">
                  {qIndex + 1}. {q.text}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.answers.map((a, aIndex) => (
                    <label
                      key={aIndex}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer ${
                        answers[qIndex] === aIndex
                          ? 'border-primary-400 bg-primary-50'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`answer-${qIndex}`}
                        checked={answers[qIndex] === aIndex}
                        onChange={() => setAnswers((prev) => ({ ...prev, [qIndex]: aIndex }))}
                        className="accent-primary-500"
                      />
                      {a}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setActiveTest(null)}
              className="border border-slate-200 text-slate-600 font-semibold rounded-lg py-2.5 px-6 text-sm"
            >
              إلغاء
            </button>
            <button
              onClick={submitTest}
              disabled={!allAnswered || submitting}
              className="bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 px-6 text-sm"
            >
              {submitting ? 'جاري الإرسال...' : 'تسليم الإجابات'}
            </button>
          </div>
        </div>
      </DashboardShell>
    )
  }

  // قائمة الاختبارات
  return (
    <DashboardShell navItems={studentNavItems} activeKey="tests" title="الاختبارات" subtitle="حل اختبارات كورساتك">
      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8">
        {loading && <p className="text-slate-500 text-sm">جاري التحميل...</p>}
        {!loading && tests.length === 0 && (
          <p className="text-slate-500 text-sm">مفيش اختبارات متاحة، سجّل في كورس الأول من صفحة الكورسات.</p>
        )}

        <div className="space-y-3">
          {tests.map((test) => {
            const done = resultByTestId[test.id]
            return (
              <div
                key={test.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-slate-100 rounded-xl p-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center shrink-0">
                    <ClipboardCheck size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 truncate">{test.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                      <span>{test.courseName}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {test.duration}
                      </span>
                    </p>
                  </div>
                </div>
                {done ? (
                  <span className="text-sm font-semibold text-emerald-600 shrink-0">
                    نتيجتك: {done.score} / {done.totalScore}
                  </span>
                ) : (
                  <button
                    onClick={() => startTest(test)}
                    className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-lg py-2 px-4 shrink-0"
                  >
                    ابدأ الاختبار
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </DashboardShell>
  )
}
