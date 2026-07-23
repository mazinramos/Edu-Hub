import { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

/**
 * يجلب مستندات مرتبطة بقائمة courseIds (حتى 10 كورسات، حد Firestore لـ "in").
 */
export function useCollectionByCourseIds(collectionName, courseIds) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const key = (courseIds || []).slice().sort().join(',')

  useEffect(() => {
    if (!courseIds || courseIds.length === 0) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    const limited = courseIds.slice(0, 10)
    const q = query(collection(db, collectionName), where('courseId', 'in', limited))

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
        setError('تعذر تحميل البيانات.')
        setLoading(false)
      }
    )
    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, collectionName])

  return { items, loading, error }
}
