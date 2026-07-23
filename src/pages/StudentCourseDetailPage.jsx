import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PlayCircle, FileText, ArrowRight, Star, CheckCircle2, Circle } from 'lucide-react'
import { collection, addDoc, doc, setDoc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import DashboardShell from '../components/DashboardShell'
import { useAuth } from '../context/AuthContext'
import { useAllCourses } from '../hooks/useAllCourses'
import { useStudentCollection } from '../hooks/useStudentCollection'
import { useCollectionByCourseIds } from '../hooks/useCollectionByCourseIds'
import { db } from '../firebase'
import { studentNavItems } from './StudentDashboard'

function RatingForm({ course, currentUser, profile, existingRating }) {
  const [rating, setRating] = useState(existingRating?.rating || 0)
  const [comment, setComment] = useState('')
  const [hover, setHover] = useState(0)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  if (existingRating || done) {
    return (
      <div className="border border-slate-100 rounded-xl p-4 mt-6">
        <p className="text-sm font-semibold text-slate-800 mb-2">تقييمك للكورس ده</p>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              size={18}
              className={n <= (existingRating?.rating || rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
            />
          ))}
        </div>
      </div>
    )
  }

  async function submit() {
    if (!rating) return
    setSaving(true)
    try {
      await addDoc(collection(db, 'ratings'), {
        studentId: currentUser.uid,
        studentName: profile?.name || '',
        teacherId: course.teacherId,
        courseId: course.id,
        courseName: course.title,
        rating,
        comment: comment.trim(),
        createdAt: serverTimestamp()
      })
      setDone(true)
    } catch (err) {
      console.error(err)
      alert('تعذر إرسال التقييم، حاول تاني.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="border border-slate-100 rounded-xl p-4 mt-6">
      <p className="text-sm font-semibold text-slate-800 mb-3">قيّم الكورس ده</p>
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
          >
            <Star
              size={24}
              className={n <= (hover || rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        placeholder="رأيك في الكورس (اختياري)"
        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm focus-ring focus:border-primary-400 mb-3"
      />
      <button
        onClick={submit}
        disabled={!rating || saving}
        className="bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-semibold rounded-lg py-2 px-5 text-sm"
      >
        {saving ? 'جاري الإرسال...' : 'إرسال التقييم'}
      </button>
    </div>
  )
}

export default function StudentCourseDetailPage() {
  const { courseId } = useParams()
  const { currentUser, profile } = useAuth()
  const { items: allCourses } = useAllCourses()
  const { items: enrollments } = useStudentCollection('enrollments')
  const { items: myRatings } = useStudentCollection('ratings')
  const { items: completions } = useStudentCollection('lessonCompletions')
  const { items: lessons, loading } = useCollectionByCourseIds('lessons', [courseId])

  const [togglingId, setTogglingId] = useState(null)

  const course = allCourses.find((c) => c.id === courseId)
  const enrollment = enrollments.find((e) => e.courseId === courseId)
  const isEnrolled = !!enrollment
  const existingRating = myRatings.find((r) => r.courseId === courseId)
  const completedLessonIds = new Set(
    completions.filter((c) => c.courseId === courseId).map((c) => c.lessonId)
  )

  async function toggleLesson(lesson) {
    setTogglingId(lesson.id)
    try {
      const completionId = `${currentUser.uid}_${lesson.id}`
      const isDone = completedLessonIds.has(lesson.id)

      if (isDone) {
        await deleteDoc(doc(db, 'lessonCompletions', completionId))
      } else {
        await setDoc(doc(db, 'lessonCompletions', completionId), {
          studentId: currentUser.uid,
          courseId,
          lessonId: lesson.id,
          createdAt: serverTimestamp()
        })
      }

      if (enrollment && lessons.length > 0) {
        const newCompletedCount = isDone
          ? completedLessonIds.size - 1
          : completedLessonIds.size + 1
        const newProgress = Math.round((newCompletedCount / lessons.length) * 100)
        await updateDoc(doc(db, 'enrollments', enrollment.id), { progress: newProgress })
      }
    } catch (err) {
      console.error(err)
      alert('تعذر تحديث حالة الدرس، حاول تاني.')
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <DashboardShell
      navItems={studentNavItems}
      activeKey="courses"
      title={course?.title || 'تفاصيل الكورس'}
      subtitle={course?.category}
    >
      <Link
        to="/student/courses"
        className="inline-flex items-center gap-1 text-primary-600 text-sm font-semibold hover:underline mb-4"
      >
        <ArrowRight size={16} /> رجوع للكورسات
      </Link>

      {!course ? (
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-8 text-center text-slate-500">
          الكورس غير موجود.
        </div>
      ) : !isEnrolled ? (
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-8 text-center text-slate-500">
          لازم تسجّل في الكورس ده الأول من صفحة الكورسات عشان تشوف الدروس.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-800">دروس الكورس</h2>
            <span className="text-sm text-slate-500">التقدم: {enrollment.progress || 0}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mb-6">
            <div
              className="h-full bg-primary-500 rounded-full transition-all"
              style={{ width: `${enrollment.progress || 0}%` }}
            />
          </div>

          {loading && <p className="text-slate-500 text-sm">جاري التحميل...</p>}
          {!loading && lessons.length === 0 && (
            <p className="text-slate-500 text-sm">المدرس لسه مضافش دروس للكورس ده.</p>
          )}

          <div className="space-y-3">
            {lessons.map((lesson) => {
              const done = completedLessonIds.has(lesson.id)
              return (
                <div
                  key={lesson.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-slate-100 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => toggleLesson(lesson)}
                      disabled={togglingId === lesson.id}
                      className="shrink-0"
                      title={done ? 'إلغاء تعليم الدرس كمكتمل' : 'علّم الدرس كمكتمل'}
                    >
                      {done ? (
                        <CheckCircle2 size={22} className="text-emerald-500" />
                      ) : (
                        <Circle size={22} className="text-slate-300" />
                      )}
                    </button>
                    <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center shrink-0">
                      <PlayCircle size={18} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-800 truncate">{lesson.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{lesson.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {lesson.videoUrl && (
                      <a
                        href={lesson.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary-600 text-sm font-semibold hover:underline"
                      >
                        مشاهدة الفيديو
                      </a>
                    )}
                    {lesson.files?.map((f, i) => (
                      <a
                        key={i}
                        href={f.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 text-sm hover:underline flex items-center gap-1"
                      >
                        <FileText size={14} /> ملف {i + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <RatingForm
            course={course}
            currentUser={currentUser}
            profile={profile}
            existingRating={existingRating}
          />
        </div>
      )}
    </DashboardShell>
  )
}
