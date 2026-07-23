import { useState } from 'react'
import { Plus, Trash2, ClipboardCheck } from 'lucide-react'
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import DashboardShell from '../components/DashboardShell'
import { useAuth } from '../context/AuthContext'
import { useTeacherCollection } from '../hooks/useTeacherCollection'
import { db } from '../firebase'
import { teacherNavItems } from './TeacherCoursesPage'

function emptyQuestion() {
  return { text: '', answers: ['', '', '', ''], correctIndex: 0 }
}

export default function TeacherTestsPage() {
  const { currentUser } = useAuth()
  const { items: courses } = useTeacherCollection('courses')
  const { items: tests, loading, error } = useTeacherCollection('tests')

  const [title, setTitle] = useState('')
  const [courseId, setCourseId] = useState('')
  const [duration, setDuration] = useState('30')
  const [totalScore, setTotalScore] = useState('20')
  const [questions, setQuestions] = useState([emptyQuestion()])
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  function updateQuestion(index, patch) {
    setQuestions((qs) => qs.map((q, i) => (i === index ? { ...q, ...patch } : q)))
  }

  function updateAnswer(qIndex, aIndex, value) {
    setQuestions((qs) =>
      qs.map((q, i) =>
        i === qIndex ? { ...q, answers: q.answers.map((a, j) => (j === aIndex ? value : a)) } : q
      )
    )
  }

  function addQuestion() {
    setQuestions((qs) => [...qs, emptyQuestion()])
  }

  function removeQuestion(index) {
    setQuestions((qs) => (qs.length > 1 ? qs.filter((_, i) => i !== index) : qs))
  }

  async function handleCreate(e) {
    e.preventDefault()
    setFormError('')

    if (!title.trim()) return setFormError('اكتب اسم الاختبار.')
    if (!courseId) return setFormError('اختار الكورس التابع له الاختبار.')
    const incomplete = questions.some((q) => !q.text.trim() || q.answers.some((a) => !a.trim()))
    if (incomplete) return setFormError('كمّل كل الأسئلة والإجابات الأربعة قبل الحفظ.')

    setSaving(true)
    try {
      const course = courses.find((c) => c.id === courseId)
      await addDoc(collection(db, 'tests'), {
        teacherId: currentUser.uid,
        courseId,
        courseName: course?.title || '',
        title: title.trim(),
        duration: duration.trim() || '30 دقيقة',
        totalScore: Number(totalScore) || questions.length * 2,
        questions,
        questionsCount: questions.length,
        createdAt: serverTimestamp()
      })
      setTitle('')
      setTotalScore('20')
      setDuration('30')
      setQuestions([emptyQuestion()])
    } catch (err) {
      console.error(err)
      setFormError('حصل خطأ أثناء حفظ الاختبار، حاول تاني.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('متأكد إنك عايز تحذف الاختبار ده؟')) return
    try {
      await deleteDoc(doc(db, 'tests', id))
    } catch (err) {
      console.error(err)
      alert('تعذر حذف الاختبار.')
    }
  }

  return (
    <DashboardShell
      navItems={teacherNavItems}
      activeKey="tests"
      title="إدارة الاختبارات"
      subtitle="أنشئ اختبارات وتابع نتائج طلابك"
    >
      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8 mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-5">إنشاء اختبار جديد</h2>

        {formError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            {formError}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">اسم الاختبار</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: اختبار الوحدة الأولى"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm focus-ring focus:border-primary-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">الكورس</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm focus-ring focus:border-primary-400"
              >
                <option value="">اختار الكورس</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">المدة</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm focus-ring focus:border-primary-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">الدرجة</label>
                <input
                  type="number"
                  value={totalScore}
                  onChange={(e) => setTotalScore(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm focus-ring focus:border-primary-400"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="border border-slate-100 rounded-xl p-4 relative">
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="absolute left-3 top-3 text-slate-300 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  السؤال {qIndex + 1}
                </label>
                <textarea
                  value={q.text}
                  onChange={(e) => updateQuestion(qIndex, { text: e.target.value })}
                  rows={2}
                  placeholder="اكتب السؤال هنا"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm focus-ring focus:border-primary-400 mb-3"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.answers.map((a, aIndex) => (
                    <label
                      key={aIndex}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer ${
                        q.correctIndex === aIndex
                          ? 'border-primary-400 bg-primary-50'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={q.correctIndex === aIndex}
                        onChange={() => updateQuestion(qIndex, { correctIndex: aIndex })}
                        className="accent-primary-500"
                      />
                      <input
                        type="text"
                        value={a}
                        onChange={(e) => updateAnswer(qIndex, aIndex, e.target.value)}
                        placeholder={`الإجابة ${aIndex + 1}`}
                        className="flex-1 bg-transparent focus:outline-none"
                      />
                    </label>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2">اختار دائرة الإجابة الصحيحة</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center justify-center gap-2 border border-primary-200 text-primary-600 font-semibold rounded-lg py-2.5 px-5 text-sm hover:bg-primary-50 transition-colors"
            >
              <Plus size={16} /> إضافة سؤال
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 px-6 text-sm transition-colors focus-ring"
            >
              {saving ? 'جاري الحفظ...' : 'حفظ الاختبار'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-slate-800 mb-5">قائمة الاختبارات</h2>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {loading && <p className="text-slate-500 text-sm">جاري التحميل...</p>}
        {!loading && tests.length === 0 && (
          <p className="text-slate-500 text-sm">لسه معملتش أي اختبار، ابدأ بإضافة أول اختبار من فوق.</p>
        )}

        <div className="space-y-3">
          {tests.map((test) => (
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
                  <p className="text-xs text-slate-500 mt-0.5">
                    {test.courseName} · {test.questionsCount} أسئلة · {test.duration} · الدرجة {test.totalScore}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(test.id)}
                className="text-slate-300 hover:text-red-500 transition-colors shrink-0"
                title="حذف الاختبار"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
