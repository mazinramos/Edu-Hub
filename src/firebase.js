// إعداد Firebase الخاص بمنصة EduHub
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getFunctions } from 'firebase/functions'

// بيانات مشروعك في Firebase
// ملاحظة: مفتاح apiKey الخاص بتطبيقات الويب ليس سرًا،
// الحماية الحقيقية تكون عبر Firestore Security Rules
const firebaseConfig = {
  apiKey: 'AIzaSyAqZaSVSt_5mJYbEzdz_3YtnHBklFXUHd0',
  authDomain: 'gess-v2.firebaseapp.com',
  projectId: 'gess-v2',
  storageBucket: 'gess-v2.firebasestorage.app',
  messagingSenderId: '656536899110',
  appId: '1:656536899110:web:070e22e98565eccd89a0e7',
  measurementId: 'G-1PNXM5H0CR'
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const functions = getFunctions(app)
export default app
