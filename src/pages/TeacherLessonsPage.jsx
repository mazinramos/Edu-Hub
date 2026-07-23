import { useState } from 'react'
import { Video, FileText, Trash2 } from 'lucide-react'
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import DashboardShell from '../components/DashboardShell'
import { useAuth } from '../context/AuthContext'
import { useTeacherCollection } from '../hooks/useTeacherCollection'
import { db, storage } from '../firebase'
import { teacherNavItems } from './TeacherCoursesPage'

export default function TeacherLessonsPage() {
  const { currentUser } = useAuth()
  const { items: courses } = useTeacherCollection('courses')
  const { items: lessons, loading, error } = useTeacherCollection('lessons')

  const [title, setTitle] = useState('')
  const [courseId, setCourseId] = useState('')
  const [duration, setDuration] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [extraFiles, setExtraFiles] = useState([])
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  async function handleCreate(e) {
    e.preventDefault()
    setFormError('')

    if (!title.trim()) return setFormError('اكتب عنوان الدرس.')
    if (!courseId) return setFormError('اختار الكورس التابع له الدرس.')
    if (courses.length === 0) return setFormError('لازم تعمل كورس الأول من صفحة الكورسات.')

    setSaving(true)
    try {
      let videoUrl = ''
      if (videoFile) {
        const videoRef = ref(storage, `lessons/${currentUser.uid}/${Date.now()}_${videoFile.name}`)
        await uploadBytes(videoRef, videoFile)
        videoUrl = await getDownloadURL(videoRef)
      }

      const fileUrls = []
      for (const file of extraFiles) {
        const fileRef = ref(storage, `lessons/${currentUser.uid}/files/${Date.now()}_${file.name}`)
        await uploadBytes(fileRef, file)
        fileUrls.push({ name: file.name, url: await getDownloadURL(fileRef) })
      }

      const course = courses.find((c) => c.id === courseId)
      await addDoc(collection(db, 'lessons'), {
        teacherId: currentUser.uid,
        courseId,
        courseName: course?.title || '',
        title: title.trim(),
        duration: duration.trim() || '—',
        videoUrl,
        files: fileUrls,
        createdAt: serverTimestamp()
      })

      setTitle('')
      setDuration('')
      setVideoFile(null)
      setExtraFiles([])
      e.target.reset()
    } catch (err) {
      console.error(err)
      setFormError('حصل خطأ أثناء حفظ الدرس، تأكد إن Firebase Storage مفعّل وحاول تاني.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('متأكد إنك عايز تحذف الدرس ده؟')) return
    try {
      await deleteDoc(doc(db, 'lessons', id))
    } catch (err) {
      console.error(err)
      alert('تعذر حذف الدرس.')
    }
  }

  return (
    <DashboardShell
      navItems={teacherNavItems}
      activeKey="lessons"
      title="إدارة الدروس"
      subtitle="أضف وتابع محتوى دروسك التعليمية"
    >
      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8 mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-5">إضافة درس جديد</h2>

        {formError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            {formError}
          </div>
        )}

        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">عنوان الدرس</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: شرح التكامل بالتجزئة"
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">مدة الفيديو</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="مثال: 45 دقيقة"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm focus-ring focus:border-primary-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">رفع الفيديو</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-slate-500 file:ml-3 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 file:px-4 file:py-2 file:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">ملفات الدرس</label>
            <input
              type="file"
              multiple
              onChange={(e) => setExtraFiles(Array.from(e.target.files || []))}
              className="w-full text-sm text-slate-500 file:ml-3 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 file:px-4 file:py-2 file:text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 px-6 text-sm transition-colors focus-ring"
            >
              {saving ? 'جاري رفع الدرس...' : 'حفظ الدرس'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-slate-800 mb-5">قائمة الدروس</h2>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {loading && <p className="text-slate-500 text-sm">جاري التحميل...</p>}
        {!loading && lessons.length === 0 && (
          <p className="text-slate-500 text-sm">لسه معملتش أي درس، ابدأ بإضافة أول درس من فوق.</p>
        )}

        <div className="space-y-3">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-slate-100 rounded-xl p-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center shrink-0">
                  <Video size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-800 truncate">{lesson.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lesson.courseName} · {lesson.duration}
                    {lesson.files?.length > 0 && (
                      <span className="inline-flex items-center gap-1 ms-2">
                        <FileText size={12} /> {lesson.files.length} ملف
                      </span>
                    )}
                  </p>
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
                    مشاهدة
                  </a>
                )}
                <button
                  onClick={() => handleDelete(lesson.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                  title="حذف الدرس"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
