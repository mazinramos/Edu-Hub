import { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

/**
 * يشترك في مجموعة Firestore ويفلترها حسب teacherId = المستخدم الحالي
 * ويرجّع النتيجة مرتبة بالأحدث أولاً (ترتيب على الكلاينت لتجنب الحاجة لـ index).
 */
export function useTeacherCollection(collectionName) {
  const { currentUser } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!currentUser) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    const q = query(collection(db, collectionName), where('teacherId', '==', currentUser.uid))

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        setItems(list)
        setLoading(false)
        setError('')
      },
      (err) => {
        console.error(err)
        setError('تعذر تحميل البيانات، تأكد من اتصالك بالإنترنت.')
        setLoading(false)
      }
    )

    return unsubscribe
  }, [currentUser, collectionName])

  return { items, loading, error }
}
