import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

/**
 * ينشئ إشعار داخل التطبيق لمستخدم معيّن.
 * type: 'message' | 'test_result' | 'enrollment' | 'general'
 */
export async function createNotification({ userId, type = 'general', title, body = '', link = '' }) {
  if (!userId) return
  try {
    await addDoc(collection(db, 'notifications'), {
      userId,
      type,
      title,
      body,
      link,
      read: false,
      createdAt: serverTimestamp()
    })
  } catch (err) {
    // الإشعارات مش حرجة لعمل التطبيق، فلو فشلت منسيبهاش توقف أي عملية أساسية
    console.error('تعذر إنشاء الإشعار', err)
  }
}
