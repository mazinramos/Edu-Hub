import { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

/**
 * يشترك في مجموعة Firestore ويفلترها حسب field == value.
 * مفيد لما نحتاج نجيب بيانات مستخدم تاني (زي ولي الأمر بيتابع ابنه).
 */
export function useCollectionWhere(collectionName, field, value) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!value) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    const q = query(collection(db, collectionName), where(field, '==', value))

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
  }, [collectionName, field, value])

  return { items, loading, error }
}
