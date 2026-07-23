export function translateFirebaseError(error) {
  const code = error?.code || ''
  const map = {
    'auth/email-already-in-use': 'البريد الإلكتروني ده مستخدم بالفعل، جرّب تسجيل الدخول.',
    'auth/invalid-email': 'صيغة البريد الإلكتروني غير صحيحة.',
    'auth/weak-password': 'كلمة المرور ضعيفة، لازم تكون 6 أحرف على الأقل.',
    'auth/user-not-found': 'مفيش حساب بهذا البريد الإلكتروني.',
    'auth/wrong-password': 'كلمة المرور غير صحيحة.',
    'auth/invalid-credential': 'بيانات الدخول غير صحيحة، تأكد من البريد وكلمة المرور.',
    'auth/too-many-requests': 'محاولات كتيرة، حاول تاني بعد شوية.',
    'auth/network-request-failed': 'في مشكلة في الاتصال بالإنترنت.'
  }
  return map[code] || 'حصل خطأ غير متوقع، حاول تاني.'
}
