import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

/**
 * يشترك في كل مجموعة Firestore بدون فلترة — تستخدم لتصفح الكورسات المتاحة للطلاب.
 */
export function useAllCourses() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    const unsubscribe = onSnapshot(
      collection(db, 'courses'),
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        setItems(list)
        setLoading(false)
        setError('')
      },
      (err) => {
        console.error(err)
        setError('تعذر تحميل الكورسات، تأكد من اتصالك بالإنترنت.')
        setLoading(false)
      }
    )
    return unsubscribe
  }, [])

  return { items, loading, error }
}
