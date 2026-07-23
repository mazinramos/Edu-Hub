# EduHub — منصة تعليمية متكاملة (مرحلة 12: تصفح عام + أسئلة شائعة + صور شخصية)

## المحتوى الحالي

### المرحلة 1 — الحسابات
- تسجيل دخول / إنشاء حساب بالبريد وكلمة المرور (Firebase Auth).
- عند التسجيل، بيتحدد نوع الحساب وبيتخزن في Firestore داخل `users/{uid}`.
- بعد تسجيل الدخول، المستخدم بيتوجه تلقائيًا للوحة تحكمه حسب دوره.
- تصميم متجاوب و RTL بالكامل (القائمة الجانبية تظهر باليمين، وتتحول لقائمة منسدلة على الموبايل).

### المرحلة 2 — لوحة تحكم المدرس
- **الكورسات** (`/teacher/courses`): إنشاء، عرض، وحذف كورسات (وسعر لكل كورس).
- **الدروس** (`/teacher/lessons`): إضافة درس مربوط بكورس، مع رفع فيديو وملفات فعليًا على Firebase Storage.
- **الاختبارات** (`/teacher/tests`): إنشاء اختبار اختيار من متعدد بعدد أسئلة غير محدود.

### المرحلة 3 — لوحة تحكم الطالب
- **الكورسات** (`/student/courses`): تصفح كل الكورسات + بحث + التسجيل الفعلي.
- **تفاصيل الكورس** (`/student/course/:courseId`): عرض دروس الكورس + تقييم الكورس بعد التسجيل.
- **الاختبارات** (`/student/tests`): حل الاختبارات، حساب الدرجة تلقائيًا، منع إعادة الحل.

### المرحلة 4 — لوحة تحكم ولي الأمر
- **أبنائي** (`/parent/children`): ربط حساب ولي الأمر بحساب طالب عن طريق بريده الإلكتروني.
- **التقدم الدراسي / نتائج الاختبارات**: متابعة كل الأبناء المرتبطين من مكان واحد.

### المرحلة 5 — الأرباح والتقييمات (متصلة فعليًا)
- **سعر الكورس**: المدرس بيحدد سعر لكل كورس (أو "مجاني") من صفحة الكورسات.
- **محاكاة الدفع**: لما الطالب يسجّل في كورس بسعر، بيتسجّل عملية شراء في `payments`
  (⚠️ محاكاة بيانات فقط، لسه معندناش بوابة دفع إلكتروني حقيقية زي Paymob أو Stripe).
- **الأرباح** (`/teacher/earnings`): إجمالي الأرباح، أرباح الشهر الحالي، وسجل كل عملية شراء.
- **التقييمات** (`/teacher/ratings`): الطالب يقدر يقيّم أي كورس مسجّل فيه (نجوم + تعليق) من
  صفحة تفاصيل الكورس، والمدرس بيشوف متوسط تقييمه وكل الآراء.
- **الطلاب** (`/teacher/students`): جدول بكل طلاب المدرس عبر كل كورساته مع نسبة التقدم وحالة الأداء.
- **الرئيسية للمدرس**: كل الإحصائيات (التقييم، الأرباح، الطلاب، الكورسات) بقت بيانات حقيقية بالكامل.


### المرحلة 6 — الشهادات (جديدة)
- **قائمة الشهادات** (`/student/certs`): بتوضح لكل كورس مسجّل فيه الطالب هل هو مؤهل
  لاستخراج شهادة ولا لأ — الشرط: يكون حل كل اختبارات الكورس (لو الكورس معملوش اختبارات،
  الشهادة متاحة فورًا).
- **صفحة الشهادة** (`/student/certificate/:courseId`): تصميم شهادة رسمية باسم الطالب،
  اسم الكورس، اسم المدرس، تاريخ الإصدار، ورقم شهادة فريد — وبتتسجل مرة واحدة بس في
  `certificates` (نفس الشهادة بترجع تاني من غير ما تتكرر).
- **تحميل/طباعة**: زرار "طباعة / حفظ PDF" بيستخدم طباعة المتصفح (Ctrl+P / Cmd+P) وتقدر
  تختار "Save as PDF" — تصميم الشهادة بيتظبط تلقائيًا للطباعة.


### المرحلة 7 — بوابة دفع Paymob حقيقية (جديدة)
- استبدلنا محاكاة المدفوعات بربط فعلي مع **Paymob** عن طريق **Cloud Functions** (مجلد `functions/`):
  - `createPaymobPayment`: دالة بيستدعيها التطبيق لما الطالب يدوس "ادفع واشترك"، بتتصل بـ Paymob
    وترجع رابط صفحة الدفع (iframe) وتوجّه الطالب ليها مباشرة.
  - `paymobWebhook`: نقطة استقبال بيبعتلها Paymob تأكيد الدفع بعد ما الطالب يخلّص، وبتتأكد من
    توقيع HMAC، وبعدها بتسجّل الطالب في الكورس فعليًا وتحدّث الأرباح — كل ده من السيرفر، مش من المتصفح
    (أهم مبدأ أمان في أي نظام دفع: التأكيد النهائي لازم يكون من السيرفر مش من الكلاينت).
- الكورسات المجانية لسه بتتسجل فورًا بدون المرور على بوابة الدفع.
- صفحة "الأرباح" دلوقتي بتعرض بس المدفوعات اللي اتأكدت فعليًا (`status: paid`).

⚠️ **الكود ده لسه معملوش نشر (Deploy) ولا اختبار فعلي** — لأن ده محتاج حساب Paymob حقيقي ومفاتيح
API بتاعتك، وترقية مشروعك في Firebase لخطة Blaze. الخطوات كاملة تحت.


### المرحلة 8 — تتبع التقدم التلقائي + نظام الرسائل (جديدة)
- **تتبع التقدم التلقائي**: في صفحة تفاصيل الكورس، الطالب بيقدر يعلّم أي درس "مكتمل" ✅،
  ونسبة التقدم في `enrollments` بتتحدث تلقائيًا = (عدد الدروس المكتملة ÷ إجمالي دروس الكورس) × 100
  — بدل ما كانت رقم ثابت (0%). البيانات دي بتتسجل في مجموعة جديدة `lessonCompletions`.
- **نظام رسائل حقيقي بين ولي الأمر والمدرس** (`/parent/contact` و `/teacher/messages`):
  محادثة مباشرة (زي أي تطبيق شات بسيط) بتتخزن في مجموعة `messages`، وولي الأمر بيقدر يراسل
  أي مدرس لأبنائه المسجّلين عنده، والمدرس بيشوف كل المحادثات مع أولياء الأمور ويرد عليهم.


### المرحلة 9 — لوحة تحكم الإدارة (جديدة)
- دور رابع جديد: **admin** — مش متاح للتسجيل العادي من صفحة "إنشاء حساب" (بيتحدد يدويًا، شوف الخطوات تحت).
- **الرئيسية** (`/admin`): إحصائيات شاملة على المنصة كلها (عدد المدرسين، الطلاب، أولياء
  الأمور، الكورسات، وإجمالي الإيرادات الفعلية من كل المدرسين) + أحدث المستخدمين المسجّلين.
- **المدرسين / الطلاب / أولياء الأمور** (`/admin/teachers`, `/admin/students`, `/admin/parents`):
  جدول بكل مستخدمي كل فئة، مع زرار **تعطيل / تفعيل** الحساب.
- **الكورسات** (`/admin/courses`): كل كورسات المنصة عبر كل المدرسين، مع إمكانية حذف أي
  كورس مخالف (رقابة إدارية).

✅ **تحديث المرحلة 10:** زرار "تعطيل" دلوقتي بيقفل حساب الدخول فعليًا في Firebase Auth
(مش مجرد علم في Firestore) عن طريق دالة `setUserDisabled` — شوف تفاصيلها تحت.

### إزاي تعمل أول حساب إدارة (Admin)
مفيش زرار تسجيل كـ "إدارة" في الموقع عمدًا (أمان)، فالطريقة:
1. سجّل حساب عادي (بأي دور، مثلاً "طالب") من صفحة التسجيل بإيميلك.
2. روح لـ **Firebase Console → Firestore Database → users**، دوّر على المستند بتاعك (هتلاقيه
   بالإيميل اللي سجّلت بيه).
3. غيّر قيمة الحقل `role` من `student` لـ `admin` يدويًا واحفظ.
4. سجّل خروج ودخول تاني من الموقع — هتتوجه تلقائيًا للوحة تحكم الإدارة.


### المرحلة 10 — تعطيل حقيقي + تحسين الأداء + إشعارات (جديدة)
- **تعطيل حساب حقيقي**: زرار "تعطيل" في لوحة الإدارة بقى بيستدعي دالة `setUserDisabled`
  (Cloud Function جديدة، للإدارة بس) بتعطّل المستخدم فعليًا في **Firebase Auth** نفسه —
  يعني مش هيقدر يسجّل دخول تاني خالص، مش بس علم جوه Firestore زي قبل كده.
- **تحسين الأداء (Code Splitting)**: كل صفحات التطبيق بقت بتتحمّل بـ `React.lazy` بدل ما
  تتحمّل كلها مع بعض في ملف واحد ضخم — المتصفح دلوقتي بيحمّل بس الصفحة اللي المستخدم فيها،
  فسرعة فتح التطبيق الأول تحسنت بشكل ملحوظ.
- **إشعارات داخل التطبيق** 🔔: جرس إشعارات في أعلى كل لوحة تحكم، بيوصل فيه إشعار تلقائي عند:
  - وصول رسالة جديدة (من/لـ ولي أمر أو مدرس).
  - ظهور نتيجة اختبار جديدة (بيوصل لولي الأمر المرتبط بالطالب).
  - تسجيل طالب جديد في كورس (بيوصل للمدرس، سواء الكورس مجاني أو مدفوع عن طريق Paymob).


### المرحلة 11 — صفحة هبوط + فلاتر متقدمة + تصدير تقارير (جديدة)
- **صفحة هبوط عامة** (`/`): صفحة تعريفية للزوار قبل تسجيل الدخول، بنفس روح تصميم اللقطات
  اللي بعتها أول مرة (Hero، المميزات الستة، خطوات "كيف تعمل المنصة")، مع أزرار "ابدأ الآن"
  و"تسجيل الدخول" بتوديك للمكان الصح.
- **فلاتر وترتيب متقدم في كورسات الطالب** (`/student/courses`): فلترة حسب المادة، السعر
  (مجاني/مدفوع)، وترتيب حسب الأحدث / الأعلى تقييمًا / السعر — وكل كارت كورس بقى بيعرض
  متوسط تقييمه (⭐ من واقع تقييمات الطلاب الحقيقية) وعدد المقيّمين.
- **تصدير تقارير Excel حقيقية**:
  - المدرس: تصدير قائمة الطلاب (`/teacher/students`) وسجل المدفوعات (`/teacher/earnings`).
  - الإدارة: تصدير تقرير شامل من الرئيسية (`/admin`) بخمس شيتات (مدرسين، طلاب، أولياء أمور،
    كورسات، ملخص إيرادات) في ملف واحد.
  - التصدير بيستخدم مكتبة `xlsx` وبيتحمّل بس لما تدوس على زرار التصدير (مش مع كل صفحة)
    بفضل الـ Code Splitting اللي عملناه في المرحلة اللي فاتت.


### المرحلة 12 — تصفح عام + أسئلة شائعة + صور شخصية (جديدة)
- **صفحة "مدرسينا" العامة** (`/teachers`): متاحة لأي زائر بدون تسجيل دخول، بتعرض كل
  المدرسين (اسم، صورة، متوسط تقييم حقيقي، عدد الكورسات) مع زرار "سجّل لمتابعته".
- **قسم الأسئلة الشائعة وتواصل معنا** في صفحة الهبوط، بروابط في القائمة العلوية (زي
  ما كانت في تصميمك الأصلي بالظبط).
- **إحصائيات حقيقية** في صفحة الهبوط (عدد الكورسات وعدد المدرسين الفعلي على المنصة،
  مش أرقام وهمية).
- **صور شخصية (Avatar)**: كل مستخدم (طالب/مدرس/ولي أمر) يقدر يرفع صورة شخصية من صفحة
  "الملف الشخصي" — رفعها بيتم على Firebase Storage وبتظهر في رأس كل لوحة تحكم.

⚠️ **مهم:** عشان صفحة "مدرسينا" ولوحة الهبوط تشتغلوا بدون تسجيل دخول، لازم قواعد Firestore
تتغيّر (قراءة عامة لمجموعات `courses`، `ratings`، ومستندات المستخدمين اللي دورهم `teacher` بس)
— القواعد الجديدة كاملة تحت. البريد والتليفون في قسم "تواصل معنا" placeholders لسه، بدّلهم
ببيانات التواصل الحقيقية بتاعتك في `src/pages/LandingPage.jsx`.

## هيكل بيانات Firestore الحالي
```
users        { uid, name, email, role, createdAt }
courses      { teacherId, title, category, description, price, studentsCount, createdAt }
lessons      { teacherId, courseId, courseName, title, duration, videoUrl, files[], createdAt }
tests        { teacherId, courseId, courseName, title, duration, totalScore, questions[], questionsCount, createdAt }
enrollments  { studentId, studentName, courseId, courseName, teacherId, progress, createdAt }
testResults  { studentId, studentName, testId, testTitle, courseId, courseName, score, totalScore, correctCount, questionsCount, createdAt }
parentLinks  { parentId, studentId, studentName, studentEmail, createdAt }
payments     { studentId, studentName, teacherId, courseId, courseName, amount, createdAt }
ratings      { studentId, studentName, teacherId, courseId, courseName, rating, comment, createdAt }
certificates { studentId, studentName, courseId, courseName, teacherId, issuedAt }
```

## التشغيل محليًا
```bash
npm install
npm run dev
```
هيفتح المشروع على `http://localhost:5173`.

## إعداد Firebase (مهم قبل التشغيل الفعلي)

المشروع متظبط بالفعل على بيانات مشروعك (`gess-v2`) في `src/firebase.js`.
لازم تعمل الخطوات دي في [Firebase Console](https://console.firebase.google.com):

### 1. تفعيل Authentication
- من القائمة الجانبية: **Authentication → Get started**
- فعّل طريقة الدخول **Email/Password**

### 2. إنشاء قاعدة بيانات Firestore
- من القائمة الجانبية: **Firestore Database → Create database**
- اختر **Start in production mode** (هنضيف الـ Rules تحت)

### 3. تفعيل Firebase Storage (لازمة لرفع فيديوهات وملفات الدروس)
- من القائمة الجانبية: **Storage → Get started**
- اختر **Start in production mode**

### 4. ضبط Security Rules

**Firestore Rules:**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAdmin() {
      return request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /users/{userId} {
      allow read: if request.auth != null || resource.data.role == 'teacher';
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && (request.auth.uid == userId || isAdmin());
    }

    match /courses/{courseId} {
      allow read: if true;
      allow create: if request.auth != null && request.resource.data.teacherId == request.auth.uid;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && (resource.data.teacherId == request.auth.uid || isAdmin());
    }

    match /lessons/{lessonId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.teacherId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.teacherId == request.auth.uid;
    }

    match /tests/{testId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.teacherId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.teacherId == request.auth.uid;
    }

    match /enrollments/{enrollmentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.studentId == request.auth.uid;
      allow update: if request.auth != null && resource.data.studentId == request.auth.uid;
    }

    match /testResults/{resultId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.studentId == request.auth.uid;
    }

    match /parentLinks/{linkId} {
      allow read, delete: if request.auth != null && resource.data.parentId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.parentId == request.auth.uid;
    }

    match /payments/{paymentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.studentId == request.auth.uid;
    }

    match /ratings/{ratingId} {
      allow read: if true;
      allow create: if request.auth != null && request.resource.data.studentId == request.auth.uid;
    }

    match /certificates/{certId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.studentId == request.auth.uid;
    }

    match /lessonCompletions/{completionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.studentId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.studentId == request.auth.uid;
    }

    match /messages/{messageId} {
      allow read: if request.auth != null && request.auth.uid in resource.data.participants;
      allow create: if request.auth != null &&
        request.auth.uid in request.resource.data.participants &&
        request.resource.data.senderId == request.auth.uid;
    }

    match /notifications/{notificationId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

**Storage Rules:**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /lessons/{teacherId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == teacherId;
    }

    match /avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**ملاحظات مهمة:**
- قواعد `users`، `courses` (التحديث)، `enrollments`، و`testResults` مفتوحة للقراءة/التحديث
  لأي مستخدم مسجّل دخوله حاليًا — مطلوبة عشان: التسجيل في كورس يزوّد `studentsCount`، وولي
  الأمر يقدر يدوّر على حساب ابنه بالإيميل ويشوف تقدمه ونتائجه. ده مقبول في مرحلة التطوير،
  وهنقفلها بقواعد أدق (تعتمد على `parentLinks` فعليًا داخل الـ Rules) لما نجهّز المشروع للإطلاق الفعلي.
- أول مرة تستخدم فيها البحث بالإيميل في صفحة "أبنائي"، أو صفحة الرسائل، Firebase هيطلب منك
  تعمل **Composite Index** (هيظهر لينك جاهز في رسالة الخطأ بـ Developer Tools بالمتصفح) — دوس
  عليه وسيبه يخلص إنشاء الـ Index (بياخد دقيقة أو اتنين)، وبعدها هيشتغل عادي. صفحة الرسائل
  محتاجة index مركّب على `participants` (array-contains) + `createdAt`.

## نشر بوابة الدفع (Cloud Functions + Paymob)

### 1. رقّي مشروعك لخطة Blaze
من Firebase Console → اختار مشروعك → **Upgrade** (تحت جنب اسم المشروع) → اختار خطة **Blaze**.
مفيش تكلفة إضافية غير باستخدامك الفعلي، وحجم الاستخدام في مشروع زي ده هيفضل غالبًا داخل الحصة المجانية.

### 2. اعمل حساب Paymob وجيب مفاتيحك
- سجّل على [Paymob](https://paymob.com) واعمل **Payment Integration** (اختار "Online Card" على الأقل).
- من **Settings → Account Info**: انسخ الـ **API Key**.
- من **Settings → Payment Integrations**: انسخ **Integration ID**.
- من **Settings → iFrames**: اعمل iFrame واربطه بالـ Integration، وانسخ **iFrame ID**.
- من **Settings → Payment Integrations → HMAC**: انسخ **HMAC Secret**.
- Paymob بيديك بيئة **Test** تقدر تجرب بيها ببطاقات وهمية قبل ما تروح للبيئة الحقيقية (Live).

### 3. جهّز متغيرات البيئة
```bash
cd functions
cp .env.example .env
```
افتح `.env` واملى القيم الأربعة اللي جبتها من Paymob.

### 4. ثبّت Firebase CLI وسجّل دخولك
```bash
npm install -g firebase-tools
firebase login
```

### 5. انشر الدوال
من مجلد المشروع الرئيسي (`eduhub`):
```bash
firebase deploy --only functions
```
هياخد كذا دقيقة، وفي الآخر هيديك رابط كل دالة، هتلاقي حاجة زي:
```
https://us-central1-gess-v2.cloudfunctions.net/paymobWebhook
```

### 6. اربط الـ Webhook بـ Paymob
ارجع لـ **Paymob Dashboard → Payment Integrations → (الـ Integration بتاعتك)** وحط رابط
`paymobWebhook` اللي طلع في الخطوة اللي فاتت في خانتين:
- **Transaction processed callback**
- **Transaction response callback**

### 7. جرّب بالبيئة التجريبية (Test) الأول
Paymob بيديك بطاقات اختبار (Test Cards) في التوثيق بتاعه — جرّب عملية شراء كاملة وتأكد إن:
1. بتتوجه لصفحة الدفع صح.
2. بعد الدفع، الطالب بيتسجل في الكورس تلقائيًا (اتأكد من `enrollments` و`payments` في Firestore).
3. صفحة "الأرباح" عند المدرس بتحدّث صح.

بعد ما تتأكد إن كل حاجة شغالة كويس في Test، بدّل مفاتيحك في `.env` بمفاتيح البيئة الحقيقية (Live)
وانشر تاني (`firebase deploy --only functions`).

### ملاحظة: دالة setUserDisabled
دالة تعطيل/تفعيل الحسابات (`setUserDisabled`) بتتنشر تلقائيًا مع نفس أمر
`firebase deploy --only functions` اللي فوق (كل الدوال في `functions/index.js` بتتنشر مع
بعض). ميحتاجش أي مفاتيح إضافية، بس محتاج نفس خطوة ترقية Blaze اللي عملتها لبوابة الدفع.

## الخطوة الجاية (المرحلة 13)
- صفحة تفاصيل عامة لكل مدرس (`/teachers/:id`) بدل الكارت المختصر بس — تعرض وصفه وكل
  كورساته وتقييماته بالتفصيل.
- دعم تعليقات/ردود المدرس على تقييمات الطلاب.
- حماية أقوى: تفعيل reCAPTCHA على نموذج إنشاء الحساب لتقليل الحسابات الوهمية.

## هيكل المشروع
```
src/
  firebase.js            # إعداد الاتصال بـ Firebase (Auth + Firestore + Storage + Functions)
  context/AuthContext.jsx# إدارة حالة المستخدم والدور
  components/            # مكونات مشتركة (الشعار، حماية المسارات، قالب اللوحة)
  hooks/                 # Hooks لجلب بيانات Firestore حسب الدور
  pages/                 # الصفحات (تسجيل الدخول، التسجيل، لوحات التحكم)
functions/
  index.js               # Cloud Functions: createPaymobPayment و paymobWebhook
  .env.example           # نموذج متغيرات بيئة مفاتيح Paymob
```
