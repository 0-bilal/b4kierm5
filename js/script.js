// إعدادات تيليجرام - استبدل بالقيم الخاصة بك
const TELEGRAM_CONFIG = {
    botToken: '8403602991:AAFfui3P-PptepN33x3cnRSC40KwzTQpX2g',
    chatId: '-1002985521806'
};


const BIRTHDAY_MONTH = 12; // يناير (1-12)
const BIRTHDAY_DAY = 18;   // يوم 18

let countdownInterval;
let birthdayDate;
let currentPoetryText = '';

// حساب تاريخ عيد الميلاد القادم
function calculateNextBirthday() {
    const now = new Date();
    const currentYear = now.getFullYear();
    let birthday = new Date(currentYear, BIRTHDAY_MONTH - 1, BIRTHDAY_DAY);
    
    // إذا مر عيد الميلاد هذا العام، احسب للعام القادم
    if (birthday <= now) {
        birthday.setFullYear(currentYear + 1);
    }
    
    return birthday;
}

// إنشاء القلوب المتحركة
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
    heart.style.animationDelay = Math.random() * 2 + 's';
    document.getElementById('heartsContainer').appendChild(heart);

    // إزالة القلب بعد انتهاء الأنيميشن
    setTimeout(() => {
        if (heart.parentNode) {
            heart.remove();
        }
    }, 9000);
}

// إنشاء القلوب بشكل مستمر
setInterval(createHeart, 800);

// وظيفة العد التنازلي
function updateCountdown() {
    const now = new Date().getTime();
    const distance = birthdayDate - now;

    if (distance < 0) {
        document.getElementById('poetryText').innerHTML = "🎉 عيد ميلاد سعيد حبيبتي! 🎉<br>كل عام وأنت بألف خير وسعادة";
        clearInterval(countdownInterval);
        
        // إرسال رسالة تهنئة عبر تيليجرام
        sendBirthdayNotification();
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;

    // اختيار البيت الشعري بناءً على الأيام المتبقية
    if (typeof poetryLines !== 'undefined' && poetryLines.length > 0) {
        const poetryIndex = days % poetryLines.length;
        currentPoetryText = poetryLines[poetryIndex];
        document.getElementById('poetryText').textContent = currentPoetryText;
    }
}

// حفظ البيت المفضل
function saveFavorite() {
    if (!currentPoetryText) {
        showNotification('لا يوجد بيت شعر لحفظه! 🤔');
        return;
    }

    // إرسال إشعار حفظ البيت عبر تيليجرام فقط
    sendFavoriteNotification(currentPoetryText);
    showNotification('تم احفظ البيت كتفضيل   💖');
}


// تحميل الأبيات المفضلة
// function loadFavorites() {
//    const favorites = JSON.parse(localStorage.getItem('favoritePoetry') || '[]');
//    const favoritesList = document.getElementById('favoritesList');

//    if (favorites.length === 0) {
//        favoritesList.innerHTML = '<p style="text-align: center; color: #4B2C2C; opacity: 0.7;">لا توجد أبيات محفوظة بعد</p>';
//        return;
//    }

//    favoritesList.innerHTML = favorites.map((poetry, index) => `
//        <div class="favorite-item">
//            <button class="remove-favorite" onclick="removeFavorite(${index})" title="حذف من المفضلة">✕</button>
//            ${poetry}
//        </div>
//    `).join('');
// }

// حذف من المفضلة
// function removeFavorite(index) {
//    let favorites = JSON.parse(localStorage.getItem('favoritePoetry') || '[]');
//    const removedPoetry = favorites[index];
//    
//    favorites.splice(index, 1);
//    localStorage.setItem('favoritePoetry', JSON.stringify(favorites));
//    loadFavorites();
//    showNotification('تم حذف البيت من المفضلة');
    
    // إرسال إشعار حذف البيت عبر تيليجرام
//    sendRemoveFavoriteNotification(removedPoetry);
//}

// مشاركة البيت
function sharePoetry() {
    if (!currentPoetryText) {
        showNotification('لا يوجد بيت شعر للمشاركة! 🤔');
        return;
    }

    const shareText = `${currentPoetryText}\n\n💖 من موقع سعاد الخاص`;

    if (navigator.share) {
        navigator.share({
            title: 'بيت شعر جميل من وعد',
            text: shareText,
            url: window.location.href
        }).then(() => {
            showNotification('تم مشاركة البيت بنجاح! 📤');
        }).catch(() => {
            copyToClipboard(shareText);
        });
    } else {
        copyToClipboard(shareText);
    }
}

// نسخ النص للحافظة
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('تم نسخ البيت! يمكنك مشاركته الآن 📋');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

// نسخ احتياطي للحافظة
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('تم نسخ البيت! يمكنك مشاركته الآن 📋');
    } catch (err) {
        showNotification('لم يتم النسخ! جرب مرة أخرى 😅');
    }
    
    document.body.removeChild(textArea);
}

// إرسال رسالة عبر تيليجرام
async function sendMessage() {
    const messageText = document.getElementById('messageText').value.trim();
    
    if (!messageText) {
        showNotification('يرجى كتابة رسالة أولاً! ✍️');
        return;
    }

    if (TELEGRAM_CONFIG.botToken === 'YOUR_BOT_TOKEN_HERE' || TELEGRAM_CONFIG.chatId === 'YOUR_CHAT_ID_HERE') {
        showNotification('يرجى تكوين إعدادات أولاً! ⚙️');
        console.warn('تحتاج لتعديل TELEGRAM_CONFIG في ملف script.js');
        return;
    }

    // إظهار حالة الإرسال
    const sendBtn = document.querySelector('.send-btn');
    const originalText = sendBtn.textContent;
    sendBtn.textContent = 'جاري الإرسال... ⏳';
    sendBtn.disabled = true;

    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chatId,
                text: `💌 رسالة جديدة من سعاد:\n\n"${messageText}"\n\n⏰ الوقت: ${new Date().toLocaleString('en-US')}`
            })
        });

        if (response.ok) {
            showNotification('تم إرسال الرسالة بنجاح! 💕');
            document.getElementById('messageText').value = '';
        } else {
            const errorData = await response.json();
            throw new Error(errorData.description || 'فشل في الإرسال');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        showNotification('حدث خطأ في الإرسال! تأكد  😢');
    } finally {
        sendBtn.textContent = originalText;
        sendBtn.disabled = false;
    }
}

// إرسال إشعار زيارة الموقع
   // async function sendVisitNotification() {
  //  if (TELEGRAM_CONFIG.botToken === 'YOUR_BOT_TOKEN_HERE' || TELEGRAM_CONFIG.chatId === 'YOUR_CHAT_ID_HERE') {
  //      return;
  //  }

   // try {
   //     const now = new Date().toLocaleString('en-US', {
   //         year: 'numeric',
   //         month: 'numeric',
   //        day: 'numeric',
   //         hour: 'numeric',
   //         minute: '2-digit',
   //         second: '2-digit',
   //         hour12: true
   //     });

   //     await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`, {
   //         method: 'POST',
   //         headers: {
   //             'Content-Type': 'application/json',
   //         },
   //         body: JSON.stringify({
   //             chat_id: TELEGRAM_CONFIG.chatId,
   //             text: `💖 وعد زارت الموقع الآن!\n⏰ الوقت: ${now}\n\n🎯 الأيام المتبقية: ${document.getElementById('days').textContent || '...'} يوم\n🌹 البيت اليوم: \n${currentPoetryText || 'جاري التحميل...'}`
   //         })
   //     });
   // } catch (error) {
   //    console.error('Error sending visit notification:', error);
   // }
   // }


// إرسال إشعار حفظ البيت المفضل
async function sendFavoriteNotification(poetry) {
    if (TELEGRAM_CONFIG.botToken === 'YOUR_BOT_TOKEN_HERE' || TELEGRAM_CONFIG.chatId === 'YOUR_CHAT_ID_HERE') {
        return;
    }

    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chatId,
                text: `💖 سعاد أضافت بيتاً جديداً للمفضلة!\n\n🌹 البيت: "${poetry}"\n\n⏰ الوقت: ${new Date().toLocaleString('en-US')}`
            })
        });
    } catch (error) {
        console.error('Error sending favorite notification:', error);
    }
}

// إرسال إشعار حذف البيت من المفضلة
async function sendRemoveFavoriteNotification(poetry) {
    if (TELEGRAM_CONFIG.botToken === 'YOUR_BOT_TOKEN_HERE' || TELEGRAM_CONFIG.chatId === 'YOUR_CHAT_ID_HERE') {
        return;
    }

    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chatId,
                text: `💔 سعاد حذفت بيتاً من المفضلة\n\n🌹 البيت المحذوف: "${poetry}"\n\n⏰ الوقت: ${new Date().toLocaleString('en-US')}`
            })
        });
    } catch (error) {
        console.error('Error sending remove favorite notification:', error);
    }
}

// إرسال رسالة تهنئة عيد الميلاد
async function sendBirthdayNotification() {
    if (TELEGRAM_CONFIG.botToken === 'YOUR_BOT_TOKEN_HERE' || TELEGRAM_CONFIG.chatId === 'YOUR_CHAT_ID_HERE') {
        return;
    }

    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chatId,
                text: `🎉🎂 عيد ميلاد سعيد سعاد! 🎂🎉\n\nكل عام وأنت بألف خير وسعادة\nتم الوصول لليوم المنتظر!\n\n💖 أجمل التهاني والأمنيات\n⏰ ${new Date().toLocaleString('en-US')}`
            })
        });
    } catch (error) {
        console.error('Error sending birthday notification:', error);
    }
}

// عرض الإشعارات
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// التحقق من حالة الاتصال بالإنترنت
function checkConnection() {
    if (!navigator.onLine) {
        showNotification('لا يوجد اتصال بالإنترنت! 📡');
        return false;
    }
    return true;
}

// حفظ إحصائيات الزيارة
function saveVisitStats() {
    const today = new Date().toDateString();
    let visitStats = JSON.parse(localStorage.getItem('visitStats') || '{}');
    
    if (!visitStats[today]) {
        visitStats[today] = 0;
    }
    visitStats[today]++;
    
    localStorage.setItem('visitStats', JSON.stringify(visitStats));
    
    // الاحتفاظ بإحصائيات آخر 30 يوم فقط
    const dates = Object.keys(visitStats);
    if (dates.length > 30) {
        dates.sort().slice(0, -30).forEach(date => {
            delete visitStats[date];
        });
        localStorage.setItem('visitStats', JSON.stringify(visitStats));
    }
}

// بدء العداد عند تحميل الصفحة
window.addEventListener('load', function() {
    birthdayDate = calculateNextBirthday().getTime();
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
    
    // إضافة تأثير نبضات القلب
    document.querySelector('.poetry-container').classList.add('heartbeat');
    
    // تحميل الأبيات المفضلة
    // loadFavorites();
    
    // حفظ إحصائيات الزيارة
    saveVisitStats();
    
    // إرسال إشعار الزيارة بعد ثانيتين
    setTimeout(() => {
        if (checkConnection()) {
            sendVisitNotification();
        }
    }, 2000);
    
    // رسالة ترحيب
    setTimeout(() => {
        showNotification('مرحباً سعاد! أهلاً بك في موقعك الخاص 💖');
    }, 1000);
});

// إضافة مستمعي الأحداث
document.addEventListener('DOMContentLoaded', function() {
    // تأثيرات التمرير على مربعات العداد
    const timeUnits = document.querySelectorAll('.time-unit');
    timeUnits.forEach(unit => {
        unit.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        unit.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // مستمع الضغط على Enter في مربع الرسالة
    const messageInput = document.getElementById('messageText');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // حفظ المسودة تلقائياً
        messageInput.addEventListener('input', function() {
            localStorage.setItem('messageDraft', this.value);
        });

        // استرجاع المسودة
        const draft = localStorage.getItem('messageDraft');
        if (draft) {
            messageInput.value = draft;
        }
    }

    // مستمع تغيير حالة الاتصال
    window.addEventListener('online', () => {
        showNotification('تم استعادة الاتصال بالإنترنت! 🌐');
    });

    window.addEventListener('offline', () => {
        showNotification('انقطع الاتصال بالإنترنت! 📡');
    });
});

// تنظيف الذاكرة عند إغلاق الصفحة
window.addEventListener('beforeunload', function() {
    // مسح المسودة إذا تم إرسال الرسالة
    const messageText = document.getElementById('messageText');
    if (messageText && messageText.value.trim() === '') {
        localStorage.removeItem('messageDraft');
    }
});

// دالة لتصدير الأبيات المفضلة
//function exportFavorites() {
//    const favorites = JSON.parse(localStorage.getItem('favoritePoetry') || '[]');
    
//    if (favorites.length === 0) {
//        showNotification('لا توجد أبيات مفضلة للتصدير! 📝');
//        return;
//    }

//    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(favorites, null, 2));
//    const downloadAnchorNode = document.createElement('a');
//    downloadAnchorNode.setAttribute("href", dataStr);
//    downloadAnchorNode.setAttribute("download", "ابيات_وعد_المفضلة.json");
//    document.body.appendChild(downloadAnchorNode);
//    downloadAnchorNode.click();
//    downloadAnchorNode.remove();
    
//    showNotification('تم تصدير الأبيات المفضلة! 📥');
//}