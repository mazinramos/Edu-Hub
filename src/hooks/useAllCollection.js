import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

/**
 * يشترك في مجموعة Firestore كاملة بدون فلترة — يُستخدم في لوحة تحكم الإدارة
 * اللي محتاجة ترى كل البيانات على المنصة.
 */
export function useAllCollection(collectionName) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        setItems(list)
        setLoading(false)
        setError('')
      },
      (err) => {
        console.error(err)
        setError('تعذر تحميل البيانات، تأكد من صلاحياتك.')
        setLoading(false)
      }
    )
    return unsubscribe
  }, [collectionName])

  return { items, loading, error }
}
