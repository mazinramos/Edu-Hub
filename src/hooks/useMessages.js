import { useEffect, useState } from 'react'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

/**
 * يشترك في كل الرسائل اللي المستخدم الحالي طرف فيها (participants array-contains uid)
 * ويرجّعها مرتبة زمنيًا. استخدم groupMessagesByThread لتقسيمها لمحادثات.
 */
export function useMessages() {
  const { currentUser } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    const q = query(
      collection(db, 'messages'),
      where('participants', 'array-contains', currentUser.uid),
      orderBy('createdAt', 'asc')
    )

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      (err) => {
        console.error(err)
        setLoading(false)
      }
    )
    return unsubscribe
  }, [currentUser])

  return { items, loading }
}

export function groupMessagesByThread(messages) {
  const threads = {}
  messages.forEach((m) => {
    if (!threads[m.threadId]) threads[m.threadId] = []
    threads[m.threadId].push(m)
  })
  return threads
}
