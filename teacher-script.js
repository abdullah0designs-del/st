import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA8mfw8bl9ZhdvEoIK5BbgA7Auv1-FHcvw",
    authDomain: "naji-nouri-platform.firebaseapp.com",
    projectId: "naji-nouri-platform",
    storageBucket: "naji-nouri-platform.firebasestorage.app",
    messagingSenderId: "961146979515",
    appId: "1:961146979515:web:3efae492da30ed15aed59e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// إضافة درس جديد
window.addLesson = async function() {
    const title = document.getElementById('lessonTitle').value;
    const category = document.getElementById('lessonCategory').value;
    const link = document.getElementById('lessonLink').value;
    const orderValue = document.getElementById('lessonOrder').value;

    if (!title || !link || !orderValue) {
        alert("برجاء إدخال كافة البيانات بما فيها رقم الترتيب!");
        return;
    }

    try {
        await addDoc(collection(db, "lessons"), {
            title: title,
            category: category,
            link: link,
            orderIndex: parseInt(orderValue), // حفظ الترتيب كرقم للفرز الصحيح
            createdAt: new Date()
        });
        alert("✅ تم نشر الدرس بنجاح!");
        location.reload();
    } catch (e) {
        alert("خطأ أثناء النشر: " + e.message);
    }
};

// تحميل الدروس لإدارتها
async function loadLessonsForAdmin() {
    const listDiv = document.getElementById('lessonsList');
    const status = document.getElementById('adminStatus');

    try {
        // جلب البيانات مرتبة حسب حقل orderIndex تصاعدياً
        const q = query(collection(db, "lessons"), orderBy("orderIndex", "asc"));
        const snap = await getDocs(q);
        
        status.style.display = "none";
        listDiv.innerHTML = "";

        snap.forEach((document) => {
            const data = document.data();
            const id = document.id;

            listDiv.innerHTML += `
                <div class="lesson-item">
                    <div>
                        <strong>الدرس رقم ${data.orderIndex}: ${data.title}</strong> <br>
                        <small style="color: #666;">${data.category}</small>
                    </div>
                    <button class="del-btn" onclick="deleteLesson('${id}')">حذف</button>
                </div>
            `;
        });
    } catch (e) {
        status.innerHTML = "خطأ في التحميل: " + e.message;
    }
}

// حذف درس
window.deleteLesson = async function(id) {
    if (confirm("هل أنت متأكد من حذف هذا الدرس نهائياً؟")) {
        try {
            await deleteDoc(doc(db, "lessons", id));
            alert("تم الحذف بنجاح");
            location.reload();
        } catch (e) {
            alert("فشل الحذف: " + e.message);
        }
    }
};

// تشغيل التحميل عند فتح الصفحة
loadLessonsForAdmin();
