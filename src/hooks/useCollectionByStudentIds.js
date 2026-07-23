import { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

/**
 * يجلب مستندات مرتبطة بقائمة studentIds (حتى 10 طلاب، حد Firestore لـ "in").
 */
export function useCollectionByStudentIds(collectionName, studentIds) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const key = (studentIds || []).slice().sort().join(',')

  useEffect(() => {
    if (!studentIds || studentIds.length === 0) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    const limited = studentIds.slice(0, 10)
    const q = query(collection(db, collectionName), where('studentId', 'in', limited))

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
