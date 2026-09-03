// ================= FIREBASE SDK IMPORTS (CDN) =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getFirestore, collection, doc, setDoc, getDocs, 
  onSnapshot, query, orderBy, addDoc, deleteDoc, updateDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { 
  getMessaging, getToken, onMessage 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyBsf2pAoaT0OB9cgMBksB2igZGp7y4yWAI",
  authDomain: "taiyoani.firebaseapp.com",
  projectId: "taiyoani",
  storageBucket: "taiyoani.firebasestorage.app",
  messagingSenderId: "900402723577",
  appId: "1:900402723577:web:90c5b93dcac66ea7930028",
  measurementId: "G-J76JT5GJJY"
};

const VAPID_KEY = "วาง_VAPID_KEY_จาก_FIREBASE_CONSOLE_ที่นี่";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let messaging = null;
try {
  messaging = getMessaging(app);
} catch (e) {
  console.warn("Firebase Messaging not supported on this browser:", e);
}

// ================= EMAIL CONFIGURATION (EmailJS) =================
const EMAILJS_PUBLIC_KEY = "7V9Ht6H8soo45HjeR";
const EMAILJS_SERVICE_ID = "service_02kcs7q";
const EMAILJS_TEMPLATE_ID = "template_0x0kyls";

if (EMAILJS_PUBLIC_KEY && window.emailjs) {
  try {
    window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  } catch (e) {
    console.warn("EmailJS init warning:", e);
  }
}

async function sendOtpEmail(targetEmail, userName, otpCode, introMessage = "รหัสยืนยันตัวตนของคุณคือ:", subject = "รหัสยืนยัน OTP - TaiyoAni UI Hub") {
  if (!targetEmail) return false;

  const templateParams = {
    to_email: targetEmail,
    email: targetEmail,
    reply_to: targetEmail,
    to_name: userName || "สมาชิก",
    name: userName || "สมาชิก",
    from_name: "TaiyoAni UI Hub",
    otp_code: otpCode,
    message_intro: introMessage,
    message: `${introMessage} ${otpCode}`,
    subject: subject,
    system_name: "TaiyoAni UI Hub"
  };

  if (EMAILJS_PUBLIC_KEY && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && window.emailjs) {
    try {
      await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      return true;
    } catch (err) {
      alert(`⚠️ ส่งอีเมลไม่สำเร็จ\n\nรหัส OTP สำหรับทดสอบของคุณคือ: ${otpCode}`);
      return false;
    }
  } else {
    alert(`[โหมดจำลองส่งเมลไปยัง: ${targetEmail}]\n\nรหัสยืนยัน OTP คือ: ${otpCode}`);
    return true;
  }
}

// ================= WEB AUDIO API =================
const AudioFX = {
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },
  playTone(freqStart, freqEnd, type, duration, vol = 0.08) {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freqStart, this.ctx.currentTime);
      if (freqEnd) {
        osc.frequency.exponentialRampToValueAtTime(freqEnd, this.ctx.currentTime + duration);
      }
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  },
  click() { this.playTone(700, 350, 'sine', 0.04, 0.06); },
  sendChat() { this.playTone(380, 920, 'sine', 0.08, 0.12); },
  newIncomingMsg() { this.playTone(600, 1200, 'sine', 0.1, 0.14); },
  submitWork() { this.playTone(400, 1000, 'sine', 0.15, 0.12); },
  pageFlip() { this.playTone(550, 750, 'triangle', 0.08, 0.08); },
  ringtone() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(480, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {}
  },
  like() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(523.25, now);
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);

      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1046.50, now + 0.06);
      gain2.gain.setValueAtTime(0.08, now + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.22);
    } catch (e) {}
  },
  success() { this.playTone(440, 880, 'sine', 0.12, 0.1); },
  delete() { this.playTone(280, 120, 'sine', 0.07, 0.08); }
};

document.addEventListener('click', (e) => {
  if (e.target.closest('button') || e.target.closest('.avatar-opt') || e.target.closest('.project-item') || e.target.closest('.word-tool-btn') || e.target.closest('.emoji-btn-opt') || e.target.closest('.category-select-pill') || e.target.closest('.fb-action-btn') || e.target.closest('.fb-tool-icon-btn')) {
    AudioFX.click();
  }
});

// ================= APP STATES =================
const AVATAR_PRESETS = ['👨‍💻', '👩‍💻', '🐱', '🦊', '🚀', '🎨', '🎬', '⚡', '🐉', '✨'];
const EMOJI_LIST = ['😀', '😂', '😍', '😎', '🥳', '🔥', '🎉', '👍', '❤️', '✨', '🎬', '🎨', '🚀', '💡', '🙌', '💯', '⭐', '☕', '🐱', '🌸', '👏', '💬', '👀', '📌'];
const MAX_PAGES = 50;
const STORY_EXPIRATION_HOURS = 24;

let teamUsers = [];
let projects = [];
let communityPosts = [];
let communityStories = [];
let chatMessages = [];
let dmChatMessages = [];
let currentUserId = localStorage.getItem('taiyoani_active_user_id') || null;
let activeProjectId = null;
let isMobileSidebarOpen = false;
let initialChatLoadDone = false;
let pendingVerificationUser = null;

// Notification System States
let systemNotifications = [];
let swRegistration = null;
let lastKnownNotifTimestamp = parseInt(localStorage.getItem('taiyoani_last_read_notif') || '0', 10);

// Home Banner States
let homeBanners = [];
let currentBannerSlideIndex = 0;
let bannerAutoSlideTimer = null;
const BANNER_AUTO_SLIDE_INTERVAL = 6000;

// Lock Screen States
let enteredPinBuffer = '';
let isScreenLocked = false;
let currentLockBannerIndex = 0;
let lockBannerTimer = null;

// Search & Filter States
let activeCommunityFilter = 'all';
let modalTempSearchCategory = 'all';
let communitySearchQuery = '';
let activeDetailPostId = null;

// Instagram & Facebook Upgrade States
let activeReplyTarget = null;
let selectedStoryMediaBase64 = null;
let selectedStoryMediaType = 'text';
let selectedCommunityPostImageBase64 = null;

// Story Player States
let storyViewerQueue = [];
let currentStorySlideIndex = 0;
let storyTimerInterval = null;
let storyProgressStep = 0;
const STORY_DURATION_MS = 5000;

// Discord Chat & Voice Call States
let activeChatMode = 'team';
let activeDmTargetUser = null;
let activeGroupId = null;
let activeGroupData = null;
let groupChats = [];
let groupUnsubscribe = null;
let groupChatMessages = [];
let dmUnsubscribe = null;
let selectedChatImageBase64 = null;

// Voice Call 1-on-1 States
let isVoiceCallActive = false;
let isVoiceMuted = false;
let voiceCallTimerInterval = null;
let voiceCallSeconds = 0;
let callRingtoneInterval = null;
let activeCallDocId = null;
let currentPeerConnection = null;
let localVoiceStream = null;
let incomingCallData = null;

// WebRTC Group Voice Room States
let activeVoiceRoomId = null;
let voiceRoomParticipantsUnsubscribe = null;
let voiceRoomSignalsUnsubscribe = null;
let isUserInVoiceRoom = false;
let voiceRoomPeers = {};

// Audio Hardware States
let isMicTesting = false;
let micTestStream = null;
let micTestAudioCtx = null;
let micTestAnalyser = null;
let micTestAnimId = null;

const RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

let activeScriptTaskId = null;
let currentScriptPages = [''];
let activePageIndex = 0;

let revenueData = {
  voice: 0,
  animation: 0,
  audio: 0,
  other: 0,
  note: '',
  transferDate: '',
  transferStatus: 'pending',
  transferDetails: '',
  updatedBy: '',
  updatedTime: ''
};

function getCurrentUser() {
  return teamUsers.find(u => u && u.id === currentUserId) || null;
}

function isAdmin(user = getCurrentUser()) {
  if (!user || !user.name) return false;
  return user.name.trim().toLowerCase() === 'taiyoani';
}

function isStaff(user = getCurrentUser()) {
  if (!user) return false;
  if (isAdmin(user)) return true;
  return user.rankType === 'ทีมงาน' || (user.role && user.role.includes('ทีมงาน'));
}

function renderAvatarHtml(avatarData, customClass = '') {
  if (!avatarData || typeof avatarData !== 'string') {
    return `<span class="avatar-chip ${customClass}">👤</span>`;
  }
  if (avatarData.startsWith('data:image') || avatarData.startsWith('http') || avatarData.startsWith('./') || avatarData.startsWith('/')) {
    return `<span class="avatar-chip ${customClass}"><img src="${escapeHtml(avatarData)}" alt="avatar"></span>`;
  }
  return `<span class="avatar-chip ${customClass}">${escapeHtml(avatarData)}</span>`;
}

function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return '฿ ' + num.toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

// ================= WEB PUSH & FCM TOKEN ENGINE =================
async function requestNotificationPermission() {
  if ('serviceWorker' in navigator) {
    try {
      swRegistration = await navigator.serviceWorker.register('./sw.js');
    } catch (e) {
      console.warn('SW register warning:', e);
    }
  }

  if ('Notification' in window && Notification.permission !== 'granted') {
    try {
      await Notification.requestPermission();
    } catch (e) {}
  }

  if (messaging && swRegistration && Notification.permission === 'granted') {
    try {
      const token = await getToken(messaging, {
        serviceWorkerRegistration: swRegistration,
        vapidKey: VAPID_KEY
      });

      if (token && currentUserId) {
        await updateDoc(doc(db, "users", currentUserId), {
          fcmToken: token,
          fcmUpdatedAt: Date.now()
        });
      }
    } catch (err) {
      console.warn("FCM Token registration error:", err);
    }
  }
}

if (messaging) {
  onMessage(messaging, (payload) => {
    const title = payload.notification?.title || payload.data?.title || '🔔 แจ้งเตือนใหม่';
    const body = payload.notification?.body || payload.data?.body || '';
    triggerHardwareAlert(title, body, './Tanomiya.png');
  });
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'NAVIGATE_VIEW') {
      window.switchAppView(event.data.view);
    }
  });
}

function triggerHardwareAlert(title, body, iconUrl = './Tanomiya.png', onClickCallback = null) {
  if ('vibrate' in navigator) {
    navigator.vibrate([300, 100, 300]);
  }

  AudioFX.newIncomingMsg();

  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'TRIGGER_NOTIFICATION',
      title: title,
      options: {
        body: body,
        icon: iconUrl || './Tanomiya.png',
        badge: './Tanomiya.png'
      }
    });
  } else if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body: body,
        icon: iconUrl || './Tanomiya.png',
        badge: './Tanomiya.png'
      });
    } catch (e) {}
  }

  showInAppToast(title, body, iconUrl, onClickCallback);
}

function showInAppToast(title, body, iconUrl, onClick) {
  const container = document.getElementById('inAppToastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'in-app-toast';
  toast.onclick = () => {
    if (onClick) onClick();
    toast.remove();
  };

  toast.innerHTML = `
    <div class="in-app-toast-avatar">${renderAvatarHtml(iconUrl)}</div>
    <div class="in-app-toast-content">
      <div class="in-app-toast-title">${escapeHtml(title)}</div>
      <div class="in-app-toast-body">${escapeHtml(body)}</div>
    </div>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

// ================= NOTIFICATION CENTER MANAGER =================
async function pushSystemNotification({ type, title, body, authorName, authorAvatar, linkView, targetUserId = null }) {
  try {
    const currentUser = getCurrentUser();
    await addDoc(collection(db, "system_notifications"), {
      type: type || 'post',
      title: title,
      body: body,
      authorName: authorName || (currentUser ? currentUser.name : 'สมาชิก'),
      authorAvatar: authorAvatar || (currentUser ? currentUser.avatar : '👤'),
      linkView: linkView || 'home',
      targetUserId: targetUserId,
      createdAt: Date.now(),
      timestamp: serverTimestamp()
    });
  } catch (err) {
    console.warn("Push notification error:", err);
  }
}

window.openNotificationsModal = function() {
  AudioFX.click();
  renderNotificationsList();
  const modal = document.getElementById('notificationsModal');
  if (modal) modal.style.display = 'flex';
};

window.markAllNotificationsAsRead = function() {
  AudioFX.success();
  lastKnownNotifTimestamp = Date.now();
  localStorage.setItem('taiyoani_last_read_notif', lastKnownNotifTimestamp.toString());
  updateNotificationBadge();
  renderNotificationsList();
};

function updateNotificationBadge() {
  const badge = document.getElementById('notifBadgeCounter');
  if (!badge) return;

  const unreadCount = systemNotifications.filter(n => {
    const time = n.createdAt || 0;
    return time > lastKnownNotifTimestamp;
  }).length;

  if (unreadCount > 0) {
    badge.innerText = unreadCount > 99 ? '99+' : unreadCount;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

function renderNotificationsList() {
  const container = document.getElementById('notificationsListContainer');
  if (!container) return;
  container.innerHTML = '';

  if (systemNotifications.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:36px 16px; color:var(--text-muted); font-size:0.85rem;">🔔 ยังไม่มีการแจ้งเตือนกิจกรรมใหม่</div>';
    return;
  }

  const typeConfig = {
    post: { tag: '💡 โพสต์คอมมู', class: 'tag-notif-post' },
    story: { tag: '📸 สตอรี่ใหม่', class: 'tag-notif-story' },
    project: { tag: '📁 โปรเจกต์', class: 'tag-notif-project' },
    task: { tag: '📋 งานในโปรเจกต์', class: 'tag-notif-project' },
    chat: { tag: '💬 ข้อความแชท', class: 'tag-notif-chat' }
  };

  systemNotifications.forEach(notif => {
    const isUnread = (notif.createdAt || 0) > lastKnownNotifTimestamp;
    const conf = typeConfig[notif.type] || typeConfig.post;

    const card = document.createElement('div');
    card.className = `notif-card-item ${isUnread ? 'unread' : ''}`;
    card.onclick = () => {
      closeModal('notificationsModal');
      if (notif.linkView) window.switchAppView(notif.linkView);
    };

    const timeAgo = formatTimeAgo(notif.createdAt);

    card.innerHTML = `
      <div class="notif-icon-bubble">${renderAvatarHtml(notif.authorAvatar)}</div>
      <div class="notif-content">
        <div class="notif-header-row">
          <span class="notif-title">${escapeHtml(notif.title)}</span>
          <span class="notif-time">${timeAgo}</span>
        </div>
        <div class="notif-body">${escapeHtml(notif.body)}</div>
        <span class="notif-badge-tag ${conf.class}">${conf.tag}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return 'เมื่อสักครู่';
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return 'เมื่อสักครู่';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} ชม. ที่แล้ว`;
  return `${Math.floor(diffHour / 24)} วันที่แล้ว`;
}

// ================= LOCK SCREEN & PIN SYSTEM =================
function getStoredLockPin() {
  const uid = currentUserId || 'guest';
  return localStorage.getItem(`taiyoani_lock_pin_${uid}`) || '';
}

window.lockAppScreen = function() {
  AudioFX.click();
  isScreenLocked = true;
  enteredPinBuffer = '';
  updatePinDots();

  const overlay = document.getElementById('lockScreenOverlay');
  const errorMsg = document.getElementById('lockErrorMsg');
  const dotsDisplay = document.getElementById('pinDotsDisplay');
  const keypad = document.getElementById('pinKeypadGrid');
  const quickUnlockBtn = document.getElementById('btnQuickUnlock');
  const userAvatar = document.getElementById('lockUserAvatarDisplay');
  const userName = document.getElementById('lockUserNameDisplay');

  if (errorMsg) errorMsg.style.display = 'none';

  const currentUser = getCurrentUser();
  if (currentUser) {
    if (userAvatar) userAvatar.innerHTML = renderAvatarHtml(currentUser.avatar);
    if (userName) userName.innerText = currentUser.name;
  }

  const storedPin = getStoredLockPin();
  if (storedPin && storedPin.trim() !== '') {
    if (dotsDisplay) dotsDisplay.style.display = 'flex';
    if (keypad) keypad.style.display = 'grid';
    if (quickUnlockBtn) quickUnlockBtn.style.display = 'none';
  } else {
    if (dotsDisplay) dotsDisplay.style.display = 'none';
    if (keypad) keypad.style.display = 'none';
    if (quickUnlockBtn) quickUnlockBtn.style.display = 'inline-flex';
  }

  renderLockBanners();

  if (overlay) overlay.style.display = 'flex';
};

window.unlockAppScreen = function() {
  AudioFX.success();
  isScreenLocked = false;
  enteredPinBuffer = '';
  if (lockBannerTimer) clearInterval(lockBannerTimer);
  const overlay = document.getElementById('lockScreenOverlay');
  if (overlay) overlay.style.display = 'none';
};

window.enterPinDigit = function(digit) {
  if (enteredPinBuffer.length >= 4) return;
  AudioFX.click();
  enteredPinBuffer += digit;
  updatePinDots();

  if (enteredPinBuffer.length === 4) {
    validateEnteredPin();
  }
};

window.deletePinDigit = function() {
  if (enteredPinBuffer.length > 0) {
    AudioFX.delete();
    enteredPinBuffer = enteredPinBuffer.slice(0, -1);
    updatePinDots();
  }
};

window.clearPinInput = function() {
  AudioFX.delete();
  enteredPinBuffer = '';
  updatePinDots();
};

function updatePinDots() {
  const dots = document.querySelectorAll('#pinDotsDisplay .pin-dot');
  dots.forEach((dot, index) => {
    if (index < enteredPinBuffer.length) {
      dot.classList.add('filled');
    } else {
      dot.classList.remove('filled');
    }
  });
}

function validateEnteredPin() {
  const storedPin = getStoredLockPin();
  const errorMsg = document.getElementById('lockErrorMsg');

  if (enteredPinBuffer === storedPin) {
    unlockAppScreen();
  } else {
    AudioFX.delete();
    if (errorMsg) {
      errorMsg.style.display = 'block';
    }
    const keypad = document.getElementById('pinKeypadGrid');
    if (keypad) {
      keypad.style.animation = 'none';
      keypad.offsetHeight;
      keypad.style.animation = 'shakeKeypad 0.35s ease';
    }
    setTimeout(() => {
      enteredPinBuffer = '';
      updatePinDots();
    }, 400);
  }
}

window.saveLockScreenPin = function() {
  const input = document.getElementById('settingLockPinInput');
  if (!input) return;
  const pin = input.value.trim();
  const uid = currentUserId || 'guest';

  if (pin !== '' && !/^\d{4}$/.test(pin)) {
    AudioFX.delete();
    alert('รหัส PIN ต้องเป็นตัวเลข 4 หลักเท่านั้น');
    return;
  }

  AudioFX.success();
  if (pin === '') {
    localStorage.removeItem(`taiyoani_lock_pin_${uid}`);
    alert('ยกเลิกการตั้งรหัสผ่านล็อกหน้าจอเรียบร้อยแล้ว');
  } else {
    localStorage.setItem(`taiyoani_lock_pin_${uid}`, pin);
    alert('ตั้งรหัส PIN 4 หลักสำหรับล็อกหน้าจอเรียบร้อยแล้ว');
  }

  input.value = '';
  updateLockStatusInSettings();
};

function updateLockStatusInSettings() {
  const text = document.getElementById('currentLockStatusText');
  if (!text) return;
  const pin = getStoredLockPin();
  if (pin) {
    text.innerText = '🟢 เปิดใช้งาน PIN แล้ว';
    text.style.color = '#6ee7b7';
  } else {
    text.innerText = '⚪ ปิดใช้งาน (แตะปลดล็อกได้ทันที)';
    text.style.color = '#94a3b8';
  }
}

function renderLockBanners() {
  const track = document.getElementById('lockBannerTrack');
  const dots = document.getElementById('lockBannerDotsContainer');
  if (!track || !dots) return;

  track.innerHTML = '';
  dots.innerHTML = '';

  const banners = homeBanners.length > 0 ? homeBanners : [{
    title: '✨ ยินดีต้อนรับสู่ TaiyoAni Hub',
    subtitle: 'ระบบบริหารงาน ออกแบบ และแอนิเมชั่นประจำทีม',
    mediaType: 'image',
    mediaData: './Tanomiya.png'
  }];

  if (currentLockBannerIndex >= banners.length) currentLockBannerIndex = 0;

  banners.forEach((b, idx) => {
    const slide = document.createElement('div');
    slide.className = `lock-banner-slide ${idx === currentLockBannerIndex ? 'active' : ''}`;

    let mediaHtml = b.mediaType === 'video'
      ? `<video src="${b.mediaData}" autoplay muted loop playsinline></video>`
      : `<img src="${b.mediaData}" alt="Banner">`;

    slide.innerHTML = `
      ${mediaHtml}
      <div class="lock-banner-overlay-info">
        <h4>${escapeHtml(b.title)}</h4>
        <p>${escapeHtml(b.subtitle || '')}</p>
      </div>
    `;
    track.appendChild(slide);

    const dot = document.createElement('div');
    dot.className = `lock-banner-dot ${idx === currentLockBannerIndex ? 'active' : ''}`;
    dots.appendChild(dot);
  });

  if (lockBannerTimer) clearInterval(lockBannerTimer);
  if (banners.length > 1) {
    lockBannerTimer = setInterval(() => {
      currentLockBannerIndex = (currentLockBannerIndex + 1) % banners.length;
      document.querySelectorAll('.lock-banner-slide').forEach((s, i) => s.classList.toggle('active', i === currentLockBannerIndex));
      document.querySelectorAll('.lock-banner-dot').forEach((d, i) => d.classList.toggle('active', i === currentLockBannerIndex));
    }, 5500);
  }
}

// ================= CATEGORIZED SETTINGS MODAL =================
window.switchSettingsTab = function(tabName) {
  AudioFX.click();
  document.querySelectorAll('.settings-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.settings-tab-pane').forEach(pane => pane.classList.remove('active'));

  const activeBtn = document.getElementById(`tabBtnSetting${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
  const activePane = document.getElementById(`paneSetting${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);

  if (activeBtn) activeBtn.classList.add('active');
  if (activePane) activePane.classList.add('active');

  if (tabName === 'security') {
    updateLockStatusInSettings();
  }
};

window.openSettingsModal = async function() {
  AudioFX.click();
  document.getElementById('settingsModal').style.display = 'flex';
  updateLockStatusInSettings();
  await refreshAudioDevices();
};

window.closeSettingsModal = function() {
  stopMicTest();
  document.getElementById('settingsModal').style.display = 'none';
};

window.refreshAudioDevices = async function() {
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      } catch (e) {}
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    const inputSelect = document.getElementById('settingAudioInputSelect');
    const outputSelect = document.getElementById('settingAudioOutputSelect');

    if (!inputSelect || !outputSelect) return;

    inputSelect.innerHTML = '';
    outputSelect.innerHTML = '';

    const savedInputId = localStorage.getItem('taiyoani_audio_input_id') || '';
    const savedOutputId = localStorage.getItem('taiyoani_audio_output_id') || '';

    let micCount = 0;
    let speakerCount = 0;

    devices.forEach((device) => {
      const opt = document.createElement('option');
      opt.value = device.deviceId;

      if (device.kind === 'audioinput') {
        micCount++;
        opt.innerText = device.label || `ไมโครโฟน ${micCount}`;
        if (device.deviceId === savedInputId) opt.selected = true;
        inputSelect.appendChild(opt);
      } else if (device.kind === 'audiooutput') {
        speakerCount++;
        opt.innerText = device.label || `ลำโพง / หูฟัง ${speakerCount}`;
        if (device.deviceId === savedOutputId) opt.selected = true;
        outputSelect.appendChild(opt);
      }
    });

    if (micCount === 0) inputSelect.innerHTML = '<option value="">ไม่พบอุปกรณ์ไมโครโฟน</option>';
    if (speakerCount === 0) outputSelect.innerHTML = '<option value="">ลำโพงเริ่มต้นของระบบ (Default Speaker)</option>';
  } catch (err) {
    console.warn("Hardware enumeration error:", err);
  }
};

window.handleAudioDeviceChange = function() {
  const inputSelect = document.getElementById('settingAudioInputSelect');
  const outputSelect = document.getElementById('settingAudioOutputSelect');
  if (inputSelect && inputSelect.value) {
    localStorage.setItem('taiyoani_audio_input_id', inputSelect.value);
  }
  if (outputSelect && outputSelect.value) {
    const speakerId = outputSelect.value;
    localStorage.setItem('taiyoani_audio_output_id', speakerId);
    
    const remoteAudio = document.getElementById('remoteVoiceAudio');
    if (remoteAudio && typeof remoteAudio.setSinkId === 'function') {
      remoteAudio.setSinkId(speakerId).catch(() => {});
    }

    document.querySelectorAll('#groupVoiceAudioContainer audio').forEach(a => {
      if (typeof a.setSinkId === 'function') {
        a.setSinkId(speakerId).catch(() => {});
      }
    });
  }
  if (isMicTesting) {
    stopMicTest();
    startMicTest();
  }
};

window.toggleMicTest = function() {
  AudioFX.click();
  if (isMicTesting) {
    stopMicTest();
  } else {
    startMicTest();
  }
};

async function startMicTest() {
  const meterFill = document.getElementById('audioMeterFill');
  const btn = document.getElementById('btnToggleMicTest');
  const statusText = document.getElementById('micTestStatusText');
  const selectedMicId = document.getElementById('settingAudioInputSelect')?.value;

  try {
    const constraints = {
      audio: selectedMicId ? { deviceId: { exact: selectedMicId } } : true
    };

    micTestStream = await navigator.mediaDevices.getUserMedia(constraints);
    micTestAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = micTestAudioCtx.createMediaStreamSource(micTestStream);
    micTestAnalyser = micTestAudioCtx.createAnalyser();
    micTestAnalyser.fftSize = 256;
    source.connect(micTestAnalyser);

    const bufferLength = micTestAnalyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    isMicTesting = true;
    if (btn) btn.innerText = '⏹️ หยุดทดสอบ';
    if (statusText) statusText.innerText = '🟢 ไมค์กำลังทำงาน: ลองพูดเพื่อดูระดับเสียง';

    function drawMeter() {
      if (!isMicTesting) return;
      micTestAnalyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      let avg = sum / bufferLength;
      let percent = Math.min(100, Math.round((avg / 128) * 100 * 1.5));

      if (meterFill) meterFill.style.width = `${percent}%`;
      micTestAnimId = requestAnimationFrame(drawMeter);
    }
    drawMeter();
  } catch (err) {
    console.error("Mic test error:", err);
    alert("ไม่สามารถเข้าถึงไมโครโฟนได้ กรุณาอนุญาตใช้งานไมค์ในเบราว์เซอร์");
    stopMicTest();
  }
}

function stopMicTest() {
  isMicTesting = false;
  if (micTestAnimId) cancelAnimationFrame(micTestAnimId);
  if (micTestStream) {
    micTestStream.getTracks().forEach(track => track.stop());
    micTestStream = null;
  }
  if (micTestAudioCtx && micTestAudioCtx.state !== 'closed') {
    micTestAudioCtx.close();
    micTestAudioCtx = null;
  }
  const meterFill = document.getElementById('audioMeterFill');
  const btn = document.getElementById('btnToggleMicTest');
  const statusText = document.getElementById('micTestStatusText');
  if (meterFill) meterFill.style.width = '0%';
  if (btn) btn.innerText = '🎙️ เริ่มทดสอบไมค์';
  if (statusText) statusText.innerText = 'กดเริ่มทดสอบ แล้วลองพูดเพื่อดูการตอบสนองของไมค์';
}

window.testSpeakerSound = function() {
  AudioFX.init();
  if (!AudioFX.ctx) return;

  const now = AudioFX.ctx.currentTime;
  const osc = AudioFX.ctx.createOscillator();
  const gain = AudioFX.ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(523.25, now);
  osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12);
  osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.24);
  osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.36);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

  osc.connect(gain);
  gain.connect(AudioFX.ctx.destination);

  osc.start(now);
  osc.stop(now + 0.6);
};

// ================= SECTION VIEW ROUTER =================
window.switchAppView = function(viewName) {
  AudioFX.click();
  const currentUser = getCurrentUser();

  if ((viewName === 'projects' || viewName === 'revenue') && !isAdmin(currentUser) && !isStaff(currentUser)) {
    AudioFX.delete();
    openAccessDeniedModal();
    return;
  }

  document.querySelectorAll('.app-view-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.bottom-nav-item').forEach(btn => btn.classList.remove('active'));

  const targetSection = document.getElementById(`view${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`);
  const targetBtn = document.getElementById(`navBtn${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`);

  if (targetSection) targetSection.classList.add('active');
  if (targetBtn) targetBtn.classList.add('active');

  localStorage.setItem('taiyoani_active_view', viewName);

  if (viewName === 'chat') {
    renderDiscordSidebarChannels();
    renderChatMessages();
    scrollChatToBottom();
  } else if (viewName === 'community') {
    renderStoriesTray();
    renderCommunityPosts();
  } else if (viewName === 'home') {
    renderHomeBanners();
  }
};

window.openAccessDeniedModal = function() {
  const modal = document.getElementById('accessDeniedModal');
  if (modal) {
    modal.style.display = 'flex';
  } else {
    alert('⚠️ เฉพาะยศแอดมินและทีมงานเท่านั้นที่มีสิทธิ์เข้าถึงหน้านี้');
    window.switchAppView('home');
  }
};

window.closeAccessDeniedModal = function() {
  const modal = document.getElementById('accessDeniedModal');
  if (modal) modal.style.display = 'none';
  window.switchAppView('home');
};

function initAppView() {
  const savedView = localStorage.getItem('taiyoani_active_view') || 'home';
  const currentUser = getCurrentUser();
  if ((savedView === 'projects' || savedView === 'revenue') && !isAdmin(currentUser) && !isStaff(currentUser)) {
    window.switchAppView('home');
  } else {
    window.switchAppView(savedView);
  }
}

// ================= LIVE CLOCK (FOR LOCK SCREEN ONLY) =================
function startLiveClock() {
  function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('th-TH', { hour12: false });
    const dateStr = now.toLocaleDateString('th-TH', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const lockTimeEl = document.getElementById('lockClockTimeDisplay');
    const lockDateEl = document.getElementById('lockClockDateDisplay');
    if (lockTimeEl) lockTimeEl.innerText = timeStr;
    if (lockDateEl) lockDateEl.innerText = dateStr;
  }
  updateClock();
  setInterval(updateClock, 1000);
}

window.openTeamMembersModal = function() {
  AudioFX.click();
  renderMembersPresenceList();
  document.getElementById('teamMembersModal').style.display = 'flex';
};

// ================= HOME BANNER CAROUSEL SYSTEM =================
window.openAddBannerModal = function() {
  if (!isAdmin()) {
    AudioFX.delete();
    alert('เฉพาะแอดมิน (TaiyoAni) เท่านั้นที่มีสิทธิ์ลงแบนเนอร์');
    return;
  }
  AudioFX.click();
  document.getElementById('bannerTitleInput').value = '';
  document.getElementById('bannerSubtitleInput').value = '';
  document.getElementById('bannerLinkInput').value = '';
  document.getElementById('bannerFileInput').value = '';
  document.getElementById('bannerMediaDataInput').value = '';
  document.getElementById('bannerMediaTypeInput').value = 'image';
  document.getElementById('bannerMediaPreviewContainer').innerHTML = '<span style="font-size: 0.8rem; color: var(--text-muted);">ตัวอย่างไฟล์สื่อจะแสดงที่นี่</span>';
  document.getElementById('homeBannerModal').style.display = 'flex';
};

window.handleBannerMediaSelect = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const isVideo = file.type.startsWith('video/');
  const previewBox = document.getElementById('bannerMediaPreviewContainer');

  if (isVideo) {
    if (file.size > 750 * 1024) {
      AudioFX.delete();
      alert('⚠️ ไฟล์วิดีโอมีขนาดใหญ่เกินไป (จำกัดไม่เกิน 750 KB)\nแนะนำให้บีบอัดไฟล์วิดีโอก่อน หรือใช้ไฟล์ภาพ GIF แทน');
      event.target.value = '';
      return;
    }

    const videoEl = document.createElement('video');
    videoEl.preload = 'metadata';
    videoEl.src = URL.createObjectURL(file);

    videoEl.onloadedmetadata = function() {
      URL.revokeObjectURL(videoEl.src);
      if (videoEl.duration > 60) {
        AudioFX.delete();
        alert('⚠️ วิดีโอมีความยาวเกิน 1 นาที (จำกัดไม่เกิน 60 วินาที)');
        event.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = function(e) {
        const base64 = e.target.result;
        document.getElementById('bannerMediaDataInput').value = base64;
        document.getElementById('bannerMediaTypeInput').value = 'video';
        if (previewBox) {
          previewBox.innerHTML = `<video src="${base64}" autoplay muted loop playsinline></video>`;
        }
      };
      reader.readAsDataURL(file);
    };
  } else {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let width = img.width, height = img.height;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const base64 = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.85);
        document.getElementById('bannerMediaDataInput').value = base64;
        document.getElementById('bannerMediaTypeInput').value = 'image';
        if (previewBox) {
          previewBox.innerHTML = `<img src="${base64}" alt="Banner Preview">`;
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

window.handleSaveHomeBanner = async function(e) {
  e.preventDefault();
  if (!isAdmin()) return;

  const title = document.getElementById('bannerTitleInput').value.trim();
  const subtitle = document.getElementById('bannerSubtitleInput').value.trim();
  const link = document.getElementById('bannerLinkInput').value.trim();
  const mediaData = document.getElementById('bannerMediaDataInput').value;
  const mediaType = document.getElementById('bannerMediaTypeInput').value;

  if (!mediaData) {
    alert('กรุณาเลือกไฟล์ภาพหรือวิดีโอ');
    return;
  }

  const currentUser = getCurrentUser();
  AudioFX.success();

  try {
    await addDoc(collection(db, "home_banners"), {
      title,
      subtitle,
      link,
      mediaData,
      mediaType,
      createdBy: currentUser ? currentUser.name : 'TaiyoAni',
      createdAt: Date.now(),
      timestamp: serverTimestamp()
    });
    closeModal('homeBannerModal');
  } catch (err) {
    console.error("Save banner error:", err);
    AudioFX.delete();
    alert("เกิดข้อผิดพลาดในการบันทึกแบนเนอร์: ขนาดไฟล์สื่ออาจใหญ่เกินขีดจำกัด");
  }
};

window.handleDeleteBanner = async function(bannerId) {
  if (!isAdmin()) return;
  if (confirm('คุณต้องการลบแบนเนอร์นี้ใช่หรือไม่?')) {
    AudioFX.delete();
    await deleteDoc(doc(db, "home_banners", bannerId));
  }
};

function renderHomeBanners() {
  const track = document.getElementById('homeBannerTrack');
  const dotsContainer = document.getElementById('bannerDotsContainer');
  const adminBar = document.getElementById('homeBannerAdminBar');
  if (!track || !dotsContainer) return;

  if (adminBar) {
    adminBar.style.display = isAdmin() ? 'flex' : 'none';
  }

  track.innerHTML = '';
  dotsContainer.innerHTML = '';

  const bannersToRender = homeBanners.length > 0 ? homeBanners : [{
    id: 'default-banner',
    title: '✨ ยินดีต้อนรับสู่ TaiyoAni Hub',
    subtitle: 'พื้นที่แสดงผลงาน ความคืบหน้าโปรเจกต์ และข่าวสารทางการของทีม',
    mediaType: 'image',
    mediaData: './Tanomiya.png',
    isDefault: true
  }];

  if (currentBannerSlideIndex >= bannersToRender.length) {
    currentBannerSlideIndex = 0;
  }

  bannersToRender.forEach((banner, index) => {
    const isActive = index === currentBannerSlideIndex;
    const slide = document.createElement('div');
    slide.className = `home-banner-slide ${isActive ? 'active' : ''}`;

    let mediaHtml = '';
    if (banner.mediaType === 'video') {
      mediaHtml = `<video src="${banner.mediaData}" autoplay muted loop playsinline></video>`;
    } else {
      mediaHtml = `<img src="${banner.mediaData}" alt="${escapeHtml(banner.title)}">`;
    }

    const deleteBtnHtml = (isAdmin() && !banner.isDefault) ? `
      <button type="button" class="btn-delete-banner-admin" onclick="handleDeleteBanner('${banner.id}')" title="ลบแบนเนอร์">
        🗑️ ลบแบนเนอร์
      </button>
    ` : '';

    const linkBtnHtml = banner.link ? `
      <a href="${escapeHtml(banner.link)}" target="_blank" rel="noopener noreferrer" class="btn-banner-link">
        ดูรายละเอียด ↗
      </a>
    ` : '';

    slide.innerHTML = `
      ${deleteBtnHtml}
      ${mediaHtml}
      <div class="home-banner-overlay">
        <div class="banner-info-box">
          <h3>${escapeHtml(banner.title)}</h3>
          <p>${escapeHtml(banner.subtitle || '')}</p>
        </div>
        ${linkBtnHtml}
      </div>
    `;
    track.appendChild(slide);

    const dot = document.createElement('div');
    dot.className = `banner-dot ${isActive ? 'active' : ''}`;
    dot.onclick = () => goToBannerSlide(index);
    dotsContainer.appendChild(dot);
  });

  resetBannerAutoSlide(bannersToRender.length);
}

window.nextBannerSlide = function() {
  const total = homeBanners.length > 0 ? homeBanners.length : 1;
  currentBannerSlideIndex = (currentBannerSlideIndex + 1) % total;
  updateBannerSlidesUI();
};

window.prevBannerSlide = function() {
  const total = homeBanners.length > 0 ? homeBanners.length : 1;
  currentBannerSlideIndex = (currentBannerSlideIndex - 1 + total) % total;
  updateBannerSlidesUI();
};

window.goToBannerSlide = function(index) {
  currentBannerSlideIndex = index;
  updateBannerSlidesUI();
};

function updateBannerSlidesUI() {
  AudioFX.click();
  const slides = document.querySelectorAll('.home-banner-slide');
  const dots = document.querySelectorAll('.banner-dot');

  slides.forEach((s, idx) => {
    s.classList.toggle('active', idx === currentBannerSlideIndex);
  });
  dots.forEach((d, idx) => {
    d.classList.toggle('active', idx === currentBannerSlideIndex);
  });

  resetBannerAutoSlide(slides.length);
}

function resetBannerAutoSlide(totalSlides) {
  if (bannerAutoSlideTimer) clearInterval(bannerAutoSlideTimer);
  if (totalSlides <= 1) return;

  bannerAutoSlideTimer = setInterval(() => {
    currentBannerSlideIndex = (currentBannerSlideIndex + 1) % totalSlides;
    const slides = document.querySelectorAll('.home-banner-slide');
    const dots = document.querySelectorAll('.banner-dot');
    slides.forEach((s, idx) => s.classList.toggle('active', idx === currentBannerSlideIndex));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === currentBannerSlideIndex));
  }, BANNER_AUTO_SLIDE_INTERVAL);
}

// ================= UNIFIED SEARCH & FILTER MODAL SYSTEM =================
window.openCommunitySearchModal = function() {
  AudioFX.click();
  const searchInput = document.getElementById('modalSearchInput');
  if (searchInput) searchInput.value = communitySearchQuery;
  
  modalTempSearchCategory = activeCommunityFilter;
  updateSearchPillsUI();
  document.getElementById('communitySearchModal').style.display = 'flex';
};

window.selectSearchCategory = function(cat) {
  AudioFX.click();
  modalTempSearchCategory = cat;
  updateSearchPillsUI();
};

function updateSearchPillsUI() {
  document.querySelectorAll('.category-select-pill').forEach(pill => {
    if (pill.getAttribute('data-cat') === modalTempSearchCategory) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });
}

window.handleApplySearchFilter = function() {
  AudioFX.success();
  activeCommunityFilter = modalTempSearchCategory;
  const input = document.getElementById('modalSearchInput');
  communitySearchQuery = input ? input.value.trim() : '';

  updateFilterActiveIndicator();
  closeModal('communitySearchModal');
  renderCommunityPosts();
};

window.handleResetSearchFilter = function() {
  AudioFX.delete();
  activeCommunityFilter = 'all';
  modalTempSearchCategory = 'all';
  communitySearchQuery = '';
  const input = document.getElementById('modalSearchInput');
  if (input) input.value = '';

  updateSearchPillsUI();
  updateFilterActiveIndicator();
  closeModal('communitySearchModal');
  renderCommunityPosts();
};

function updateFilterActiveIndicator() {
  const dot = document.getElementById('filterActiveDot');
  if (!dot) return;
  if (activeCommunityFilter !== 'all' || communitySearchQuery !== '') {
    dot.style.display = 'block';
  } else {
    dot.style.display = 'none';
  }
}

// ================= 1. ENHANCED STORIES SYSTEM =================
window.handleStoryMediaSelect = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const isVideo = file.type.startsWith('video/');
  const preview = document.getElementById('storyMediaPreviewContainer');
  const bgGroup = document.getElementById('storyBgColorPickerGroup');

  if (isVideo) {
    if (file.size > 1024 * 1024) {
      AudioFX.delete();
      alert('⚠️ ไฟล์วิดีโอสตอรี่มีขนาดใหญ่เกิน 1MB กรุณาบีบอัดไฟล์ก่อนอัปโหลด');
      event.target.value = '';
      return;
    }

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(file);
    video.onloadedmetadata = function() {
      URL.revokeObjectURL(video.src);
      if (video.duration > 60) {
        AudioFX.delete();
        alert('⚠️ วิดีโอสตอรี่ต้องมีความยาวไม่เกิน 60 วินาที');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        selectedStoryMediaBase64 = e.target.result;
        selectedStoryMediaType = 'video';
        document.getElementById('storyMediaDataInput').value = selectedStoryMediaBase64;
        document.getElementById('storyMediaTypeInput').value = 'video';
        if (preview) {
          preview.style.display = 'flex';
          preview.innerHTML = `<video src="${selectedStoryMediaBase64}" autoplay muted loop style="width:100%; height:100%; object-fit:cover;"></video><button type="button" class="btn-sm delete" style="position: absolute; top: 6px; right: 6px; z-index: 5;" onclick="removeStoryMediaAttachment()">✕ นำออก</button>`;
        }
        if (bgGroup) bgGroup.style.display = 'none';
      };
      reader.readAsDataURL(file);
    };
  } else {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        const maxDim = 1080;
        let w = img.width, h = img.height;
        if (w > h && w > maxDim) { h = Math.round((h * maxDim) / w); w = maxDim; }
        else if (h > maxDim) { w = Math.round((w * maxDim) / h); h = maxDim; }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        selectedStoryMediaBase64 = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.85);
        selectedStoryMediaType = 'image';
        document.getElementById('storyMediaDataInput').value = selectedStoryMediaBase64;
        document.getElementById('storyMediaTypeInput').value = 'image';
        if (preview) {
          preview.style.display = 'flex';
          preview.innerHTML = `<img src="${selectedStoryMediaBase64}" style="width:100%; height:100%; object-fit:cover;"><button type="button" class="btn-sm delete" style="position: absolute; top: 6px; right: 6px; z-index: 5;" onclick="removeStoryMediaAttachment()">✕ นำออก</button>`;
        }
        if (bgGroup) bgGroup.style.display = 'none';
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

window.removeStoryMediaAttachment = function() {
  selectedStoryMediaBase64 = null;
  selectedStoryMediaType = 'text';
  document.getElementById('storyMediaDataInput').value = '';
  document.getElementById('storyMediaTypeInput').value = 'text';
  document.getElementById('storyFileInput').value = '';
  const preview = document.getElementById('storyMediaPreviewContainer');
  const bgGroup = document.getElementById('storyBgColorPickerGroup');
  if (preview) preview.style.display = 'none';
  if (bgGroup) bgGroup.style.display = 'block';
};

window.openCreateStoryModal = function() {
  AudioFX.click();
  document.getElementById('storyTextInput').value = '';
  removeStoryMediaAttachment();
  document.getElementById('createStoryModal').style.display = 'flex';
};

window.handleCreateStorySubmit = async function(e) {
  e.preventDefault();
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const text = document.getElementById('storyTextInput').value.trim();
  const mediaData = document.getElementById('storyMediaDataInput').value;
  const mediaType = document.getElementById('storyMediaTypeInput').value;
  const selectedBg = document.querySelector('input[name="storyBg"]:checked')?.value || 'linear-gradient(135deg, #38bdf8, #818cf8)';

  if (!text && !mediaData) {
    alert('กรุณาพิมพ์ข้อความ หรือเลือกไฟล์ภาพ/วิดีโอ');
    return;
  }

  const newStory = {
    authorId: currentUser.id,
    authorName: currentUser.name,
    authorAvatar: currentUser.avatar,
    text: text || '',
    mediaData: mediaData || null,
    mediaType: mediaType || 'text',
    bg: selectedBg,
    createdAt: Date.now(),
    timestamp: serverTimestamp()
  };

  AudioFX.success();
  await addDoc(collection(db, "community_stories"), newStory);

  await pushSystemNotification({
    type: 'story',
    title: `${currentUser.name} ลงสตอรี่ใหม่`,
    body: text || '📸 อัปเดตเรื่องราวใหม่ในคอมมูนิตี้',
    authorName: currentUser.name,
    authorAvatar: currentUser.avatar,
    linkView: 'community'
  });

  removeStoryMediaAttachment();
  closeModal('createStoryModal');
};

function getActiveStories() {
  const now = Date.now();
  const lifetimeMs = STORY_EXPIRATION_HOURS * 60 * 60 * 1000;
  return communityStories.filter(story => {
    const createdTime = story.createdAt || (story.timestamp?.toDate ? story.timestamp.toDate().getTime() : now);
    return (now - createdTime) < lifetimeMs;
  });
}

function renderStoriesTray() {
  const feedList = document.getElementById('storiesFeedList');
  const userStoryAvatar = document.getElementById('currentUserStoryAvatar');
  const currentUser = getCurrentUser();

  if (userStoryAvatar && currentUser) {
    userStoryAvatar.innerHTML = renderAvatarHtml(currentUser.avatar);
  }

  if (!feedList) return;
  feedList.innerHTML = '';

  const activeStories = getActiveStories();
  const groupedByUser = {};

  activeStories.forEach(s => {
    if (!groupedByUser[s.authorId]) groupedByUser[s.authorId] = [];
    groupedByUser[s.authorId].push(s);
  });

  const userIds = Object.keys(groupedByUser);
  if (userIds.length === 0) {
    feedList.innerHTML = '<div style="font-size:0.75rem; color:var(--text-muted); padding-left:6px; white-space:nowrap;">ยังไม่มีสตอรี่ใน 24 ชม. นี้</div>';
    return;
  }

  userIds.forEach(uid => {
    const userStories = groupedByUser[uid];
    const latestStory = userStories[userStories.length - 1];
    const hasVideo = userStories.some(s => s.mediaType === 'video');

    const item = document.createElement('div');
    item.className = 'story-item';
    item.onclick = () => openStoryViewer(uid);
    item.innerHTML = `
      <div class="story-avatar-ring ${hasVideo ? 'has-video' : ''}">
        <div class="story-avatar-inner">
          ${renderAvatarHtml(latestStory.authorAvatar)}
        </div>
      </div>
      <span class="story-username">${escapeHtml(latestStory.authorName)}</span>
    `;
    feedList.appendChild(item);
  });
}

window.openStoryViewer = function(authorId) {
  const activeStories = getActiveStories();
  storyViewerQueue = activeStories.filter(s => s.authorId === authorId);
  if (storyViewerQueue.length === 0) return;

  currentStorySlideIndex = 0;
  AudioFX.click();
  document.getElementById('storyViewerModal').style.display = 'flex';
  showCurrentStorySlide();
};

function showCurrentStorySlide() {
  if (storyTimerInterval) clearInterval(storyTimerInterval);

  const story = storyViewerQueue[currentStorySlideIndex];
  if (!story) {
    closeStoryViewer();
    return;
  }

  const card = document.getElementById('storyViewerCard');
  const avatar = document.getElementById('storyViewerAvatar');
  const authorName = document.getElementById('storyViewerAuthorName');
  const timeAgo = document.getElementById('storyViewerTimeAgo');
  const textDisplay = document.getElementById('storyViewerTextDisplay');
  const mediaLayer = document.getElementById('storyViewerMediaLayer');
  const delBtn = document.getElementById('btnDeleteCurrentStory');
  const fill = document.getElementById('storyProgressBarFill');

  if (avatar) avatar.innerHTML = renderAvatarHtml(story.authorAvatar);
  if (authorName) authorName.innerText = story.authorName;

  if (mediaLayer) {
    mediaLayer.innerHTML = '';
    if (story.mediaType === 'video' && story.mediaData) {
      mediaLayer.innerHTML = `<video src="${story.mediaData}" class="story-media-layer" autoplay playsinline></video>`;
      if (card) card.style.background = '#000';
    } else if (story.mediaType === 'image' && story.mediaData) {
      mediaLayer.innerHTML = `<img src="${story.mediaData}" class="story-media-layer">`;
      if (card) card.style.background = '#000';
    } else {
      if (card) card.style.background = story.bg || 'linear-gradient(135deg, #38bdf8, #818cf8)';
    }
  }

  if (textDisplay) {
    if (story.text) {
      textDisplay.innerText = story.text;
      textDisplay.parentElement.className = (story.mediaData) ? 'story-caption-overlay' : 'story-viewer-content';
      textDisplay.parentElement.style.display = 'block';
    } else {
      textDisplay.parentElement.style.display = 'none';
    }
  }

  const now = Date.now();
  const createdTime = story.createdAt || (story.timestamp?.toDate ? story.timestamp.toDate().getTime() : now);
  const diffMins = Math.max(0, Math.floor((now - createdTime) / (1000 * 60)));
  const diffHours = Math.floor(diffMins / 60);

  if (timeAgo) {
    timeAgo.innerText = diffMins < 1 ? 'เมื่อสักครู่' : (diffMins < 60 ? `${diffMins} นาทีที่แล้ว` : `${diffHours} ชม. ที่แล้ว`);
  }

  const currentUser = getCurrentUser();
  if (delBtn) delBtn.style.display = (currentUser && (isAdmin(currentUser) || currentUser.id === story.authorId)) ? 'flex' : 'none';

  storyProgressStep = 0;
  if (fill) fill.style.width = '0%';

  const intervalStep = 50;
  const totalSteps = STORY_DURATION_MS / intervalStep;

  storyTimerInterval = setInterval(() => {
    storyProgressStep++;
    const percent = (storyProgressStep / totalSteps) * 100;
    if (fill) fill.style.width = `${percent}%`;

    if (storyProgressStep >= totalSteps) {
      clearInterval(storyTimerInterval);
      nextStorySlide();
    }
  }, intervalStep);
}

window.nextStorySlide = function() {
  if (currentStorySlideIndex < storyViewerQueue.length - 1) {
    currentStorySlideIndex++;
    showCurrentStorySlide();
  } else {
    closeStoryViewer();
  }
};

window.prevStorySlide = function() {
  if (currentStorySlideIndex > 0) {
    currentStorySlideIndex--;
    showCurrentStorySlide();
  }
};

window.closeStoryViewer = function() {
  if (storyTimerInterval) clearInterval(storyTimerInterval);
  const modal = document.getElementById('storyViewerModal');
  if (modal) modal.style.display = 'none';
};

window.handleStoryViewerBgClick = function(event) {
  if (event.target.id === 'storyViewerModal') {
    closeStoryViewer();
  }
};

window.handleDeleteCurrentStory = async function() {
  const story = storyViewerQueue[currentStorySlideIndex];
  if (!story) return;

  const currentUser = getCurrentUser();
  if (!currentUser || (!isAdmin(currentUser) && currentUser.id !== story.authorId)) {
    alert('คุณไม่มีสิทธิ์ลบสตอรี่นี้');
    return;
  }

  if (confirm('คุณต้องการลบสตอรี่นี้ใช่หรือไม่?')) {
    AudioFX.delete();
    await deleteDoc(doc(db, "community_stories", story.id));
    closeStoryViewer();
  }
};

// ================= COMMUNITY POST MODAL & FEED =================
window.openCommunityPostModal = function(initialAction = null) {
  AudioFX.click();
  const currentUser = getCurrentUser();

  const modalAvatar = document.getElementById('createPostModalAvatar');
  const modalUsername = document.getElementById('createPostModalUserName');
  const contentInput = document.getElementById('communityContentInput');

  if (currentUser) {
    if (modalAvatar) modalAvatar.innerHTML = renderAvatarHtml(currentUser.avatar);
    if (modalUsername) modalUsername.innerText = currentUser.name;
    if (contentInput) contentInput.placeholder = `คุณกำลังคิดอะไรอยู่, ${currentUser.name}?`;
  }

  document.getElementById('communityCategorySelect').value = 'idea';
  document.getElementById('communityTitleInput').value = '';
  if (contentInput) contentInput.value = '';
  document.getElementById('communityTagsInput').value = '';
  removeCommunityPostImage();

  document.getElementById('communityPostModal').style.display = 'flex';

  setTimeout(() => {
    if (initialAction === 'image') {
      document.getElementById('communityPostFileInput')?.click();
    } else if (initialAction === 'tag') {
      document.getElementById('communityTagsInput')?.focus();
    } else {
      contentInput?.focus();
    }
  }, 100);
};

window.handleCommunityPostImageSelect = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const maxDim = 1200;
      let w = img.width, h = img.height;
      if (w > h && w > maxDim) { h = Math.round((h * maxDim) / w); w = maxDim; }
      else if (h > maxDim) { w = Math.round((w * maxDim) / h); h = maxDim; }
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);

      selectedCommunityPostImageBase64 = canvas.toDataURL('image/jpeg', 0.85);
      document.getElementById('communityPostImageData').value = selectedCommunityPostImageBase64;
      const preview = document.getElementById('communityPostImagePreview');
      const previewImg = document.getElementById('communityPostPreviewImg');
      if (preview && previewImg) {
        previewImg.src = selectedCommunityPostImageBase64;
        preview.style.display = 'block';
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

window.removeCommunityPostImage = function() {
  selectedCommunityPostImageBase64 = null;
  const dataInput = document.getElementById('communityPostImageData');
  const fileInput = document.getElementById('communityPostFileInput');
  const preview = document.getElementById('communityPostImagePreview');
  const previewImg = document.getElementById('communityPostPreviewImg');

  if (dataInput) dataInput.value = '';
  if (fileInput) fileInput.value = '';
  if (previewImg) previewImg.src = '';
  if (preview) preview.style.display = 'none';
};

window.focusTagsInput = function() {
  AudioFX.click();
  document.getElementById('communityTagsInput')?.focus();
};

window.togglePostEmojiPicker = function(event) {
  event.stopPropagation();
  AudioFX.click();
  const popover = document.getElementById('postEmojiPickerPopover');
  if (!popover) return;

  const isShown = popover.style.display === 'grid';
  if (isShown) {
    popover.style.display = 'none';
  } else {
    popover.innerHTML = '';
    EMOJI_LIST.forEach(emoji => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'emoji-btn-opt';
      btn.innerText = emoji;
      btn.onclick = (e) => {
        e.stopPropagation();
        const contentInput = document.getElementById('communityContentInput');
        if (contentInput) {
          contentInput.value += emoji;
          contentInput.focus();
        }
        popover.style.display = 'none';
      };
      popover.appendChild(btn);
    });
    popover.style.display = 'grid';
  }
};

document.addEventListener('click', (e) => {
  const popover = document.getElementById('postEmojiPickerPopover');
  if (popover && popover.style.display === 'grid') {
    if (!popover.contains(e.target)) {
      popover.style.display = 'none';
    }
  }
});

window.handleCreateCommunityPost = async function(e) {
  e.preventDefault();
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const category = document.getElementById('communityCategorySelect').value;
  const title = document.getElementById('communityTitleInput').value.trim();
  const content = document.getElementById('communityContentInput').value.trim();
  const image = document.getElementById('communityPostImageData').value;
  const rawTags = document.getElementById('communityTagsInput').value.trim();

  if (!title || !content) return;

  const tags = rawTags
    ? rawTags.split(/\s+/).filter(t => t.length > 0).map(t => t.startsWith('#') ? t : `#${t}`)
    : [];

  const nowStr = new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }) + ' ' + 
                 new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newPost = {
    title,
    content,
    category,
    image: image || null,
    tags,
    likes: 0,
    likedBy: [],
    comments: [],
    authorId: currentUser.id,
    authorName: currentUser.name,
    authorAvatar: currentUser.avatar,
    authorRole: isAdmin(currentUser) ? 'แอดมิน' : (currentUser.role || 'สมาชิกทั่วไป'),
    time: nowStr,
    timestamp: serverTimestamp()
  };

  AudioFX.success();
  await addDoc(collection(db, "community_posts"), newPost);

  await pushSystemNotification({
    type: 'post',
    title: `${currentUser.name} โพสต์กระทู้ใหม่`,
    body: title,
    authorName: currentUser.name,
    authorAvatar: currentUser.avatar,
    linkView: 'community'
  });

  removeCommunityPostImage();
  closeModal('communityPostModal');
};

window.handleLikeCommunityPost = async function(postId) {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const post = communityPosts.find(p => p.id === postId);
  if (!post) return;

  const likedBy = Array.isArray(post.likedBy) ? [...post.likedBy] : [];
  const hasLiked = likedBy.includes(currentUser.id);

  AudioFX.like();
  if (hasLiked) {
    const updatedLikedBy = likedBy.filter(id => id !== currentUser.id);
    await updateDoc(doc(db, "community_posts", postId), {
      likes: Math.max(0, (post.likes || 1) - 1),
      likedBy: updatedLikedBy
    });
  } else {
    likedBy.push(currentUser.id);
    await updateDoc(doc(db, "community_posts", postId), {
      likes: (post.likes || 0) + 1,
      likedBy: likedBy
    });
  }
};

window.handlePostMediaDoubleTap = function(postId, event) {
  const container = event.currentTarget;
  const heart = container.querySelector('.ig-heart-splash');
  if (heart) {
    heart.classList.add('active');
    setTimeout(() => heart.classList.remove('active'), 600);
  }
  handleLikeCommunityPost(postId);
};

window.openPostLikesModal = function(postId) {
  const post = communityPosts.find(p => p.id === postId);
  if (!post) return;

  const container = document.getElementById('postLikesListContainer');
  if (!container) return;
  container.innerHTML = '';

  const likedByIds = Array.isArray(post.likedBy) ? post.likedBy : [];
  if (likedByIds.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:0.85rem;">ยังไม่มีผู้กดถูกใจโพสต์นี้</div>';
  } else {
    likedByIds.forEach(uid => {
      const user = teamUsers.find(u => u.id === uid) || { id: uid, name: 'สมาชิก', avatar: '👤', role: 'สมาชิกทั่วไป' };
      const row = document.createElement('div');
      row.className = 'likes-user-row';
      row.innerHTML = `
        <div class="likes-user-left clickable-profile" onclick="closeModal('postLikesModal'); openUserProfile('${user.id}')">
          <div class="member-avatar-wrapper">${renderAvatarHtml(user.avatar)}</div>
          <div>
            <div style="font-size:0.88rem; font-weight:700; color:#fff;">${escapeHtml(user.name)} ${isAdmin(user) ? '👑' : ''}</div>
            <div style="font-size:0.72rem; color:var(--text-muted);">${escapeHtml(user.role || 'สมาชิก')}</div>
          </div>
        </div>
        <button type="button" class="btn-dm-start" onclick="closeModal('postLikesModal'); startDirectChat('${user.id}')">💬 ทัก</button>
      `;
      container.appendChild(row);
    });
  }

  AudioFX.click();
  document.getElementById('postLikesModal').style.display = 'flex';
};

window.deleteCommunityPost = async function(postId) {
  const post = communityPosts.find(p => p.id === postId);
  if (!post) return;

  const currentUser = getCurrentUser();
  const isAuthor = currentUser && post.authorId === currentUser.id;
  if (!isAdmin(currentUser) && !isAuthor) {
    AudioFX.delete();
    alert('คุณไม่มีสิทธิ์ลบกระทู้นี้');
    return;
  }

  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบกระทู้นี้?')) {
    AudioFX.delete();
    await deleteDoc(doc(db, "community_posts", postId));
    if (activeDetailPostId === postId) {
      closeModal('communityDetailModal');
    }
  }
};

window.openCommunityPostDetail = function(postId) {
  const post = communityPosts.find(p => p.id === postId);
  if (!post) return;

  activeDetailPostId = postId;
  cancelCommentReply();
  AudioFX.click();
  renderCommunityDetailModal();
  document.getElementById('communityDetailModal').style.display = 'flex';
};

function renderCommunityPosts() {
  const feed = document.getElementById('communityPostsFeed');
  if (!feed) return;
  feed.innerHTML = '';

  const currentUser = getCurrentUser();

  const composerAvatar = document.getElementById('communityComposerAvatar');
  const composerPlaceholder = document.getElementById('communityComposerPlaceholder');
  if (composerAvatar && currentUser) {
    composerAvatar.innerHTML = renderAvatarHtml(currentUser.avatar);
  }
  if (composerPlaceholder && currentUser) {
    composerPlaceholder.innerText = `คุณกำลังคิดอะไรอยู่, ${currentUser.name}?`;
  }

  let filtered = [...communityPosts];

  if (activeCommunityFilter !== 'all') filtered = filtered.filter(p => p.category === activeCommunityFilter);
  if (communitySearchQuery.trim() !== '') {
    const q = communitySearchQuery.toLowerCase();
    filtered = filtered.filter(p => 
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.content && p.content.toLowerCase().includes(q)) ||
      (p.authorName && p.authorName.toLowerCase().includes(q))
    );
  }

  if (filtered.length === 0) {
    feed.innerHTML = `<div style="text-align: center; padding: 46px 16px; color: var(--text-muted);"><div style="font-size: 2.8rem; margin-bottom: 8px;">💡</div><h4>ไม่พบโพสต์</h4></div>`;
    return;
  }

  const categoryMap = {
    idea: { text: '💡 Idea', class: 'tag-idea' },
    discussion: { text: '💬 Chat', class: 'tag-discussion' },
    art: { text: '🎨 Art', class: 'tag-art' },
    qa: { text: '❓ Q&A', class: 'tag-qa' }
  };

  filtered.forEach(post => {
    const catInfo = categoryMap[post.category] || categoryMap.idea;
    const likedBy = Array.isArray(post.likedBy) ? post.likedBy : [];
    const isLiked = currentUser && likedBy.includes(currentUser.id);
    const canDelete = isAdmin(currentUser) || (currentUser && post.authorId === currentUser.id);
    const commentsList = Array.isArray(post.comments) ? post.comments : [];

    const card = document.createElement('div');
    card.className = 'community-post-card';
    card.innerHTML = `
      <div class="ig-post-header">
        <div class="ig-author-wrapper">
          <div class="ig-avatar-ring clickable-profile" onclick="openUserProfile('${post.authorId}')">
            <div class="ig-avatar-inner">${renderAvatarHtml(post.authorAvatar)}</div>
          </div>
          <div class="ig-author-meta">
            <div class="ig-author-name clickable-profile" onclick="openUserProfile('${post.authorId}')">
              ${escapeHtml(post.authorName)} ${post.authorRole === 'แอดมิน' ? '👑' : ''}
            </div>
            <span class="ig-post-time">${escapeHtml(post.time || '')}</span>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <span class="post-category-tag ${catInfo.class}">${catInfo.text}</span>
          ${canDelete ? `<button type="button" class="btn-delete-comment" onclick="deleteCommunityPost('${post.id}')">✕</button>` : ''}
        </div>
      </div>

      ${post.image ? `
        <div class="ig-post-media-container" ondblclick="handlePostMediaDoubleTap('${post.id}', event)" onclick="openLightboxImage('${post.image}')">
          <div class="ig-heart-splash">❤️</div>
          <img src="${post.image}" alt="Post Media">
        </div>
      ` : ''}

      <div class="ig-post-body">
        <h3 class="ig-post-title clickable-title" onclick="openCommunityPostDetail('${post.id}')">${escapeHtml(post.title)}</h3>
        <p class="ig-post-caption">${escapeHtml(post.content)}</p>
        <div class="ig-tags-container">
          ${(post.tags || []).map(t => `<span class="ig-tag-chip">${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>

      <div class="ig-action-bar">
        <div class="ig-action-left">
          <button type="button" class="ig-btn-icon ${isLiked ? 'is-liked' : ''}" onclick="handleLikeCommunityPost('${post.id}')" title="ถูกใจ">
            <span>${isLiked ? '❤️' : '🤍'}</span>
          </button>
          <button type="button" class="ig-btn-icon" onclick="openCommunityPostDetail('${post.id}')" title="ดูรายละเอียดและแสดงความคิดเห็น">
            <span>💬</span>
          </button>
          ${(!currentUser || post.authorId !== currentUser.id) ? `
            <button type="button" class="ig-btn-icon" onclick="startDirectChat('${post.authorId}')" title="ส่งข้อความส่วนตัว"><span>✈️</span></button>
          ` : ''}
        </div>
        <div class="ig-likes-text clickable-profile" onclick="openPostLikesModal('${post.id}')" title="ดูว่าใครกดถูกใจบ้าง">
          ถูกใจ ${post.likes || 0} คน ❯
        </div>
      </div>

      ${commentsList.length > 0 ? `
        <div class="ig-comment-preview-box">
          <button type="button" class="btn-view-all-comments" onclick="openCommunityPostDetail('${post.id}')">
            💬 ดูความคิดเห็นทั้งหมด (${commentsList.length} ข้อความ) ❯
          </button>
        </div>
      ` : ''}
    `;
    feed.appendChild(card);
  });

  if (activeDetailPostId) renderCommunityDetailModal();
}

function renderCommunityDetailModal() {
  const post = communityPosts.find(p => p.id === activeDetailPostId);
  const container = document.getElementById('communityDetailBody');
  const catBox = document.getElementById('detailModalCategoryBox');
  if (!post || !container) return;

  const currentUser = getCurrentUser();
  const likedBy = Array.isArray(post.likedBy) ? post.likedBy : [];
  const isLiked = currentUser && likedBy.includes(currentUser.id);
  const commentsList = Array.isArray(post.comments) ? post.comments : [];

  if (catBox) {
    catBox.innerHTML = `<span class="post-category-tag tag-${post.category || 'idea'}">💡 ${escapeHtml(post.category || 'General')}</span>`;
  }

  container.innerHTML = `
    <div class="ig-post-header">
      <div class="ig-author-wrapper">
        <div class="ig-avatar-ring clickable-profile" onclick="closeModal('communityDetailModal'); openUserProfile('${post.authorId}')">
          <div class="ig-avatar-inner">${renderAvatarHtml(post.authorAvatar)}</div>
        </div>
        <div class="ig-author-meta">
          <div class="ig-author-name clickable-profile" onclick="closeModal('communityDetailModal'); openUserProfile('${post.authorId}')">
            ${escapeHtml(post.authorName)} ${post.authorRole === 'แอดมิน' ? '👑' : ''}
          </div>
          <span class="ig-post-time">${escapeHtml(post.time || '')}</span>
        </div>
      </div>
    </div>

    ${post.image ? `
      <div class="ig-post-media-container" ondblclick="handlePostMediaDoubleTap('${post.id}', event)" onclick="openLightboxImage('${post.image}')">
        <div class="ig-heart-splash">❤️</div>
        <img src="${post.image}" alt="Post Media">
      </div>
    ` : ''}

    <div class="ig-post-body">
      <h2 style="font-size: 1.15rem; font-weight: 700; color: #fff;">${escapeHtml(post.title)}</h2>
      <p style="font-size: 0.9rem; color: #cbd5e1; line-height: 1.55; white-space: pre-wrap;">${escapeHtml(post.content)}</p>
    </div>

    <div class="ig-action-bar">
      <div class="ig-action-left">
        <button type="button" class="ig-btn-icon ${isLiked ? 'is-liked' : ''}" onclick="handleLikeCommunityPost('${post.id}')">
          <span>${isLiked ? '❤️' : '🤍'}</span>
        </button>
        <span class="ig-likes-text clickable-profile" onclick="openPostLikesModal('${post.id}')">ถูกใจ ${post.likes || 0} คน ❯</span>
      </div>
      <span style="font-size: 0.8rem; color: var(--text-muted);">${commentsList.length} ความคิดเห็น</span>
    </div>

    <div class="ig-comments-vertical-list">
      <h4 style="font-size: 0.86rem; color: #94a3b8; margin-bottom: 4px;">💬 ความคิดเห็นทั้งหมด:</h4>
      ${commentsList.length === 0 ? `
        <div style="font-size: 0.82rem; color: var(--text-muted); text-align: center; padding: 18px;">ยังไม่มีความคิดเห็น เป็นคนแรกที่ตอบกลับ!</div>
      ` : commentsList.map(c => {
          const isMine = currentUser && c.authorId === currentUser.id;
          const canDel = isAdmin(currentUser) || isMine;
          const replies = Array.isArray(c.replies) ? c.replies : [];
          return `
            <div class="ig-comment-block">
              <div class="ig-comment-row">
                <div class="ig-comment-avatar clickable-profile" onclick="closeModal('communityDetailModal'); openUserProfile('${c.authorId}')">
                  ${renderAvatarHtml(c.authorAvatar)}
                </div>
                <div class="ig-comment-content">
                  <div>
                    <span class="ig-comment-user clickable-profile" onclick="closeModal('communityDetailModal'); openUserProfile('${c.authorId}')">
                      ${escapeHtml(c.authorName)}${c.authorRole === 'แอดมิน' ? ' 👑' : ''}
                    </span>
                    <span class="ig-comment-text">${escapeHtml(c.text)}</span>
                  </div>
                  <div class="ig-comment-footer">
                    <span>${escapeHtml(c.time || '')}</span>
                    <button type="button" class="btn-reply-trigger" onclick="setCommentReplyTarget('${c.id}', '${escapeHtml(c.authorName)}')">↩️ ตอบกลับ</button>
                    ${canDel ? `<button type="button" class="btn-delete-comment" onclick="handleDeleteComment('${post.id}', '${c.id}')">ลบ</button>` : ''}
                  </div>
                </div>
              </div>

              ${replies.length > 0 ? `
                <div class="ig-reply-indent-wrapper">
                  ${replies.map(r => {
                    const isReplyMine = currentUser && r.authorId === currentUser.id;
                    const canDelReply = isAdmin(currentUser) || isReplyMine;
                    return `
                      <div class="ig-comment-row">
                        <div class="ig-comment-avatar" style="width:22px; height:22px;">${renderAvatarHtml(r.authorAvatar)}</div>
                        <div class="ig-comment-content" style="background: rgba(255,255,255,0.04);">
                          <div>
                            <span class="ig-comment-user">${escapeHtml(r.authorName)}</span>
                            <span class="ig-comment-text">${escapeHtml(r.text)}</span>
                          </div>
                          <div class="ig-comment-footer">
                            <span>${escapeHtml(r.time || '')}</span>
                            ${canDelReply ? `<button type="button" class="btn-delete-comment" onclick="handleDeleteReply('${post.id}', '${c.id}', '${r.id}')">ลบ</button>` : ''}
                          </div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
    </div>
  `;
}

window.setCommentReplyTarget = function(commentId, authorName) {
  activeReplyTarget = { commentId, authorName };
  const banner = document.getElementById('commentReplyBanner');
  const targetText = document.getElementById('replyTargetText');
  const input = document.getElementById('detailModalCommentInput');

  if (banner && targetText) {
    targetText.innerText = `กำลังตอบกลับ @${authorName}...`;
    banner.style.display = 'flex';
  }
  if (input) {
    input.placeholder = `ตอบกลับ @${authorName}...`;
    input.focus();
  }
};

window.cancelCommentReply = function() {
  activeReplyTarget = null;
  const banner = document.getElementById('commentReplyBanner');
  const input = document.getElementById('detailModalCommentInput');
  if (banner) banner.style.display = 'none';
  if (input) input.placeholder = 'แสดงความคิดเห็น หรือ ตอบกลับ...';
};

window.handleModalAddComment = async function(event) {
  event.preventDefault();
  const currentUser = getCurrentUser();
  if (!currentUser || !activeDetailPostId) return;

  const inputEl = document.getElementById('detailModalCommentInput');
  const text = inputEl.value.trim();
  if (!text) return;

  const post = communityPosts.find(p => p.id === activeDetailPostId);
  if (!post) return;

  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentComments = Array.isArray(post.comments) ? [...post.comments] : [];

  if (activeReplyTarget) {
    const parentComment = currentComments.find(c => c.id === activeReplyTarget.commentId);
    if (parentComment) {
      if (!Array.isArray(parentComment.replies)) parentComment.replies = [];
      parentComment.replies.push({
        id: 'rep-' + Date.now(),
        text: text,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar,
        authorRole: isAdmin(currentUser) ? 'แอดมิน' : (currentUser.role || 'สมาชิกทั่วไป'),
        time: nowStr
      });
    }
  } else {
    currentComments.push({
      id: 'cm-' + Date.now(),
      text: text,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: isAdmin(currentUser) ? 'แอดมิน' : (currentUser.role || 'สมาชิกทั่วไป'),
      time: nowStr,
      replies: []
    });
  }

  AudioFX.sendChat();
  inputEl.value = '';
  cancelCommentReply();

  await updateDoc(doc(db, "community_posts", activeDetailPostId), {
    comments: currentComments
  });
};

window.handleDeleteComment = async function(postId, commentId) {
  const post = communityPosts.find(p => p.id === postId);
  if (!post || !Array.isArray(post.comments)) return;

  const comment = post.comments.find(c => c.id === commentId);
  if (!comment) return;

  const currentUser = getCurrentUser();
  const isCommentAuthor = currentUser && comment.authorId === currentUser.id;
  if (!isAdmin(currentUser) && !isCommentAuthor) {
    AudioFX.delete();
    alert('คุณไม่มีสิทธิ์ลบคอมเมนต์นี้');
    return;
  }

  if (confirm('คุณต้องการลบคอมเมนต์นี้ใช่หรือไม่?')) {
    AudioFX.delete();
    const updatedComments = post.comments.filter(c => c.id !== commentId);
    await updateDoc(doc(db, "community_posts", postId), {
      comments: updatedComments
    });
  }
};

window.handleDeleteReply = async function(postId, commentId, replyId) {
  const post = communityPosts.find(p => p.id === postId);
  if (!post || !Array.isArray(post.comments)) return;

  const comment = post.comments.find(c => c.id === commentId);
  if (!comment || !Array.isArray(comment.replies)) return;

  if (confirm('คุณต้องการลบข้อความตอบกลับนี้ใช่หรือไม่?')) {
    AudioFX.delete();
    comment.replies = comment.replies.filter(r => r.id !== replyId);
    await updateDoc(doc(db, "community_posts", postId), {
      comments: post.comments
    });
  }
};

// ================= DISCORD-STYLE CHANNELS & GROUPS =================
window.toggleDiscordSidebar = function() {
  AudioFX.click();
  const sidebar = document.getElementById('discordSidebar');
  if (sidebar) sidebar.classList.toggle('open');
};

window.switchChatChannel = function(mode, targetId = null) {
  AudioFX.click();
  const sidebar = document.getElementById('discordSidebar');
  if (sidebar) sidebar.classList.remove('open');

  activeChatMode = mode;

  if (dmUnsubscribe) { dmUnsubscribe(); dmUnsubscribe = null; }
  if (groupUnsubscribe) { groupUnsubscribe(); groupUnsubscribe = null; }

  const currentUser = getCurrentUser();

  if (mode === 'team') {
    activeDmTargetUser = null;
    activeGroupId = null;
    activeGroupData = null;
    updateDiscordChatHeader('team');
    renderChatMessages();
    scrollChatToBottom();
  } else if (mode === 'dm') {
    const targetUser = teamUsers.find(u => u.id === targetId);
    if (!targetUser) return;
    activeDmTargetUser = targetUser;
    activeGroupId = null;
    activeGroupData = null;

    updateDiscordChatHeader('dm', targetUser.name);

    const currentUid = currentUser ? currentUser.id : 'guest';
    const roomId = [currentUid, targetUser.id].sort().join('_');
    const dmQuery = query(collection(db, "direct_chats", roomId, "messages"), orderBy("timestamp", "asc"));
    
    dmUnsubscribe = onSnapshot(dmQuery, (snapshot) => {
      dmChatMessages = [];
      snapshot.forEach(doc => dmChatMessages.push({ id: doc.id, ...doc.data() }));
      if (activeChatMode === 'dm') {
        renderChatMessages();
        scrollChatToBottom();
      }
    });
  } else if (mode === 'group') {
    const group = groupChats.find(g => g.id === targetId);
    if (!group) return;
    activeGroupId = group.id;
    activeGroupData = group;
    activeDmTargetUser = null;

    updateDiscordChatHeader('group', group.name);

    const groupQuery = query(collection(db, "group_chats", group.id, "messages"), orderBy("timestamp", "asc"));
    groupUnsubscribe = onSnapshot(groupQuery, (snapshot) => {
      groupChatMessages = [];
      snapshot.forEach(doc => groupChatMessages.push({ id: doc.id, ...doc.data() }));
      if (activeChatMode === 'group') {
        renderChatMessages();
        scrollChatToBottom();
      }
    });
  }

  highlightActiveChannelItem();
};

function getVoiceRoomId() {
  if (activeChatMode === 'group' && activeGroupId) {
    return 'group_' + activeGroupId;
  }
  return null;
}

function updateDiscordChatHeader(mode, titleName = '') {
  const prefixEl = document.getElementById('discordHeaderPrefix');
  const titleEl = document.getElementById('discordChatHeaderTitle');
  const descEl = document.getElementById('discordChatHeaderDesc');
  const voiceRoomBtn = document.getElementById('btnToggleVoiceRoom');
  const voiceRoomSettingsBtn = document.getElementById('btnVoiceRoomSettings');
  const voiceCallBtn = document.getElementById('btnVoiceCall');
  const deleteGroupBtn = document.getElementById('btnDeleteCurrentGroup');
  const clearBtn = document.getElementById('btnClearChat');
  const currentUser = getCurrentUser();

  const roomId = getVoiceRoomId();
  listenVoiceRoomParticipants(roomId);

  if (mode === 'team') {
    if (prefixEl) prefixEl.innerText = '#';
    if (titleEl) titleEl.innerText = 'ห้องแชทรวมทีม (Main Chat)';
    if (descEl) descEl.innerText = 'พื้นที่พูดคุยรวมทุกคนในทีม (ไม่รองรับการโทร)';
    if (voiceRoomBtn) voiceRoomBtn.style.display = 'none';
    if (voiceRoomSettingsBtn) voiceRoomSettingsBtn.style.display = 'none';
    if (voiceCallBtn) voiceCallBtn.style.display = 'none';
    if (deleteGroupBtn) deleteGroupBtn.style.display = 'none';
    if (clearBtn) clearBtn.style.display = isAdmin() ? 'inline-flex' : 'none';
  } else if (mode === 'dm') {
    if (prefixEl) prefixEl.innerText = '@';
    if (titleEl) titleEl.innerText = titleName;
    if (descEl) descEl.innerText = 'แชทส่วนตัว 1-on-1 (รองรับการโทรเสียงแบบตัวต่อตัว)';
    if (voiceCallBtn) voiceCallBtn.style.display = 'inline-flex';
    if (voiceRoomBtn) voiceRoomBtn.style.display = 'none';
    if (voiceRoomSettingsBtn) voiceRoomSettingsBtn.style.display = 'none';
    if (deleteGroupBtn) deleteGroupBtn.style.display = 'none';
    if (clearBtn) clearBtn.style.display = 'none';
  } else if (mode === 'group') {
    if (prefixEl) prefixEl.innerText = '👥';
    if (titleEl) titleEl.innerText = titleName;
    if (descEl) descEl.innerText = 'กลุ่มแชทส่วนตัว (มีช่องสนทนาเสียงประจำกลุ่ม)';
    if (voiceRoomBtn) voiceRoomBtn.style.display = 'inline-flex';
    if (voiceRoomSettingsBtn) voiceRoomSettingsBtn.style.display = 'inline-flex';
    if (voiceCallBtn) voiceCallBtn.style.display = 'none';
    if (clearBtn) clearBtn.style.display = 'none';

    const canDeleteGroup = activeGroupData && currentUser && (isAdmin(currentUser) || activeGroupData.createdById === currentUser.id);
    if (deleteGroupBtn) deleteGroupBtn.style.display = canDeleteGroup ? 'inline-flex' : 'none';
  }
}

function highlightActiveChannelItem() {
  document.querySelectorAll('.discord-channel-item').forEach(el => el.classList.remove('active'));
  if (activeChatMode === 'team') {
    document.getElementById('channelItemMain')?.classList.add('active');
  } else if (activeChatMode === 'dm' && activeDmTargetUser) {
    document.getElementById(`channelDm-${activeDmTargetUser.id}`)?.classList.add('active');
  } else if (activeChatMode === 'group' && activeGroupId) {
    document.getElementById(`channelGroup-${activeGroupId}`)?.classList.add('active');
  }
}

function renderDiscordSidebarChannels() {
  const groupListEl = document.getElementById('discordGroupList');
  const dmListEl = document.getElementById('discordDmList');
  const currentUser = getCurrentUser();

  if (groupListEl) {
    groupListEl.innerHTML = '';
    const myGroups = groupChats.filter(g => Array.isArray(g.members) && currentUser && g.members.includes(currentUser.id));
    if (myGroups.length === 0) {
      groupListEl.innerHTML = '<div style="font-size:0.72rem; color:var(--text-muted); padding:4px 8px;">ยังไม่มีกลุ่มส่วนตัว</div>';
    } else {
      myGroups.forEach(g => {
        const item = document.createElement('div');
        item.className = `discord-channel-item ${activeChatMode === 'group' && activeGroupId === g.id ? 'active' : ''}`;
        item.id = `channelGroup-${g.id}`;
        item.onclick = () => switchChatChannel('group', g.id);
        item.innerHTML = `
          <span class="channel-hash">👥</span>
          <span class="channel-name">${escapeHtml(g.name)}</span>
        `;
        groupListEl.appendChild(item);
      });
    }
  }

  if (dmListEl) {
    dmListEl.innerHTML = '';
    const otherMembers = teamUsers.filter(u => currentUser && u.id !== currentUser.id);
    if (otherMembers.length === 0) {
      dmListEl.innerHTML = '<div style="font-size:0.72rem; color:var(--text-muted); padding:4px 8px;">ไม่มีสมาชิกอื่น</div>';
    } else {
      otherMembers.forEach(u => {
        const item = document.createElement('div');
        item.className = `discord-channel-item ${activeChatMode === 'dm' && activeDmTargetUser?.id === u.id ? 'active' : ''}`;
        item.id = `channelDm-${u.id}`;
        item.onclick = () => switchChatChannel('dm', u.id);
        item.innerHTML = `
          <div class="discord-dm-avatar">${renderAvatarHtml(u.avatar)}</div>
          <span class="channel-name">${escapeHtml(u.name)} ${isAdmin(u) ? '👑' : ''}</span>
        `;
        dmListEl.appendChild(item);
      });
    }
  }
}

window.openCreateGroupModal = function() {
  AudioFX.click();
  const listEl = document.getElementById('groupMembersSelectList');
  const currentUser = getCurrentUser();
  if (!listEl) return;

  listEl.innerHTML = '';
  document.getElementById('createGroupNameInput').value = '';

  const otherMembers = teamUsers.filter(u => currentUser && u.id !== currentUser.id);
  if (otherMembers.length === 0) {
    listEl.innerHTML = '<div style="font-size:0.78rem; color:var(--text-muted); padding:6px;">ยังไม่มีสมาชิกคนอื่นในระบบ</div>';
  } else {
    otherMembers.forEach(u => {
      const row = document.createElement('label');
      row.className = 'group-member-opt-row';
      row.innerHTML = `
        <input type="checkbox" name="groupMemberCheckbox" value="${u.id}">
        <div class="discord-dm-avatar">${renderAvatarHtml(u.avatar)}</div>
        <span style="font-size: 0.82rem; color: #fff; font-weight: 600;">${escapeHtml(u.name)}</span>
        <span style="font-size: 0.7rem; color: var(--text-muted);">(${escapeHtml(u.role || 'สมาชิก')})</span>
      `;
      listEl.appendChild(row);
    });
  }

  document.getElementById('createGroupChatModal').style.display = 'flex';
};

window.handleCreateGroupChat = async function(e) {
  e.preventDefault();
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const groupName = document.getElementById('createGroupNameInput').value.trim();
  if (!groupName) return;

  const checkboxes = document.querySelectorAll('input[name="groupMemberCheckbox"]:checked');
  const selectedUserIds = Array.from(checkboxes).map(cb => cb.value);

  selectedUserIds.push(currentUser.id);

  if (selectedUserIds.length < 2) {
    alert('กรุณาเลือกสมาชิกอย่างน้อย 1 คนเพื่อตั้งกลุ่ม');
    return;
  }

  AudioFX.success();
  const newGroupDoc = await addDoc(collection(db, "group_chats"), {
    name: groupName,
    members: selectedUserIds,
    createdById: currentUser.id,
    createdByName: currentUser.name,
    createdAt: serverTimestamp()
  });

  closeModal('createGroupChatModal');
  switchChatChannel('group', newGroupDoc.id);
};

window.handleDeleteCurrentGroup = async function() {
  const currentUser = getCurrentUser();
  if (!activeGroupData || !currentUser) return;

  const isCreator = activeGroupData.createdById === currentUser.id;
  if (!isAdmin(currentUser) && !isCreator) {
    AudioFX.delete();
    alert("เฉพาะผู้สร้างกลุ่มนี้ หรือแอดมินเท่านั้นที่มีสิทธิ์ลบกลุ่ม");
    return;
  }

  if (confirm(`คุณต้องการลบกลุ่ม "${activeGroupData.name}" และข้อความทั้งหมดใช่หรือไม่?`)) {
    AudioFX.delete();
    const gId = activeGroupData.id;
    
    const msgsSnap = await getDocs(collection(db, "group_chats", gId, "messages"));
    msgsSnap.forEach(async (d) => await deleteDoc(doc(db, "group_chats", gId, "messages", d.id)));

    if (activeVoiceRoomId) await leaveVoiceRoom();

    await deleteDoc(doc(db, "group_chats", gId));
    
    switchChatChannel('team');
    alert("ลบกลุ่มแชทเรียบร้อยแล้ว");
  }
};

// ================= REAL-TIME MULTI-USER WebRTC GROUP VOICE ROOM =================
window.toggleVoiceRoom = async function() {
  AudioFX.click();
  const currentUser = getCurrentUser();
  const roomId = getVoiceRoomId();
  if (!currentUser || !roomId) return;

  if (isUserInVoiceRoom) {
    await leaveVoiceRoom();
  } else {
    await joinVoiceRoom(roomId, currentUser);
  }
};

async function joinVoiceRoom(roomId, user) {
  try {
    const selectedMicId = localStorage.getItem('taiyoani_audio_input_id') || '';
    const audioConstraints = selectedMicId ? { deviceId: { exact: selectedMicId } } : true;
    localVoiceStream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints, video: false });

    isUserInVoiceRoom = true;
    activeVoiceRoomId = roomId;

    await setDoc(doc(db, "voice_rooms", roomId, "participants", user.id), {
      userId: user.id,
      name: user.name,
      avatar: user.avatar,
      joinedAt: Date.now()
    });

    updateVoiceRoomButtonUI(true);
    triggerHardwareAlert("🔊 เข้าร่วมห้องเสียงแล้ว", `คุณกำลังอยู่ในช่องสนทนาเสียงของกลุ่ม`, user.avatar);

    listenVoiceRoomSignals(roomId, user.id);

  } catch (err) {
    console.error("Join Voice Room Error:", err);
    alert("ไม่สามารถเข้าถึงไมโครโฟนได้ กรุณาตรวจสอบและอนุญาตการใช้งานไมค์");
  }
}

async function leaveVoiceRoom() {
  const currentUser = getCurrentUser();
  if (activeVoiceRoomId && currentUser) {
    try {
      await deleteDoc(doc(db, "voice_rooms", activeVoiceRoomId, "participants", currentUser.id));
    } catch (e) {}
  }

  if (voiceRoomSignalsUnsubscribe) {
    voiceRoomSignalsUnsubscribe();
    voiceRoomSignalsUnsubscribe = null;
  }

  Object.keys(voiceRoomPeers).forEach(peerId => {
    try {
      voiceRoomPeers[peerId].close();
    } catch(e) {}
    removeRemoteGroupAudio(peerId);
  });
  voiceRoomPeers = {};

  if (localVoiceStream && !isVoiceCallActive) {
    localVoiceStream.getTracks().forEach(t => t.stop());
    localVoiceStream = null;
  }

  isUserInVoiceRoom = false;
  activeVoiceRoomId = null;
  updateVoiceRoomButtonUI(false);
}

function updateVoiceRoomButtonUI(inRoom) {
  const btn = document.getElementById('btnToggleVoiceRoom');
  const icon = document.getElementById('voiceRoomBtnIcon');
  const text = document.getElementById('voiceRoomBtnText');
  if (!btn) return;

  btn.classList.toggle('in-room', inRoom);
  if (icon) icon.innerText = inRoom ? '🔴' : '🎧';
  if (text) text.innerText = inRoom ? 'ออกจากห้องเสียง' : 'เข้าร่วมเสียง';
}

function listenVoiceRoomParticipants(roomId) {
  if (voiceRoomParticipantsUnsubscribe) {
    voiceRoomParticipantsUnsubscribe();
    voiceRoomParticipantsUnsubscribe = null;
  }

  const bar = document.getElementById('voiceRoomParticipantsBar');
  if (!bar) return;
  bar.innerHTML = '';

  if (!roomId) {
    bar.style.display = 'none';
    return;
  }
  bar.style.display = 'flex';

  voiceRoomParticipantsUnsubscribe = onSnapshot(collection(db, "voice_rooms", roomId, "participants"), async (snap) => {
    bar.innerHTML = '';
    const activeParticipants = [];

    snap.forEach((d) => {
      const p = d.data();
      activeParticipants.push(p);

      const chip = document.createElement('div');
      chip.className = 'voice-participant-chip';
      chip.title = `${p.name} (กำลังอยู่ในห้องเสียง)`;
      chip.innerHTML = renderAvatarHtml(p.avatar);
      bar.appendChild(chip);
    });

    if (isUserInVoiceRoom && activeVoiceRoomId === roomId && currentUserId) {
      const otherParticipants = activeParticipants.filter(p => p.userId !== currentUserId);

      for (const peer of otherParticipants) {
        if (currentUserId < peer.userId && !voiceRoomPeers[peer.userId]) {
          const pc = createVoiceRoomPeerConnection(peer.userId, roomId);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          await addDoc(collection(db, "voice_rooms", roomId, "signals"), {
            senderId: currentUserId,
            receiverId: peer.userId,
            type: 'offer',
            data: { type: offer.type, sdp: offer.sdp },
            timestamp: Date.now()
          });
        }
      }

      const currentActiveIds = otherParticipants.map(p => p.userId);
      Object.keys(voiceRoomPeers).forEach(peerId => {
        if (!currentActiveIds.includes(peerId)) {
          try { voiceRoomPeers[peerId].close(); } catch(e){}
          delete voiceRoomPeers[peerId];
          removeRemoteGroupAudio(peerId);
        }
      });
    }
  });
}

function listenVoiceRoomSignals(roomId, myUserId) {
  if (voiceRoomSignalsUnsubscribe) {
    voiceRoomSignalsUnsubscribe();
    voiceRoomSignalsUnsubscribe = null;
  }

  const signalsQuery = collection(db, "voice_rooms", roomId, "signals");
  voiceRoomSignalsUnsubscribe = onSnapshot(signalsQuery, async (snap) => {
    for (const change of snap.docChanges()) {
      if (change.type === 'added') {
        const signal = change.doc.data();
        if (signal.receiverId === myUserId) {
          await handleIncomingGroupSignal(signal, roomId);
          try { await deleteDoc(change.doc.ref); } catch(e){}
        }
      }
    }
  });
}

async function handleIncomingGroupSignal(signal, roomId) {
  const peerId = signal.senderId;

  if (signal.type === 'offer') {
    const pc = createVoiceRoomPeerConnection(peerId, roomId);
    await pc.setRemoteDescription(new RTCSessionDescription(signal.data));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    await addDoc(collection(db, "voice_rooms", roomId, "signals"), {
      senderId: currentUserId,
      receiverId: peerId,
      type: 'answer',
      data: { type: answer.type, sdp: answer.sdp },
      timestamp: Date.now()
    });
  } else if (signal.type === 'answer') {
    const pc = voiceRoomPeers[peerId];
    if (pc && !pc.currentRemoteDescription) {
      await pc.setRemoteDescription(new RTCSessionDescription(signal.data));
    }
  } else if (signal.type === 'candidate') {
    const pc = voiceRoomPeers[peerId];
    if (pc && signal.data) {
      await pc.addIceCandidate(new RTCIceCandidate(signal.data));
    }
  }
}

function createVoiceRoomPeerConnection(peerId, roomId) {
  if (voiceRoomPeers[peerId]) {
    try { voiceRoomPeers[peerId].close(); } catch(e){}
  }

  const pc = new RTCPeerConnection(RTC_CONFIG);
  voiceRoomPeers[peerId] = pc;

  if (localVoiceStream) {
    localVoiceStream.getTracks().forEach(track => {
      pc.addTrack(track, localVoiceStream);
    });
  }

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      addDoc(collection(db, "voice_rooms", roomId, "signals"), {
        senderId: currentUserId,
        receiverId: peerId,
        type: 'candidate',
        data: event.candidate.toJSON(),
        timestamp: Date.now()
      }).catch(()=>{});
    }
  };

  pc.ontrack = (event) => {
    if (event.streams && event.streams[0]) {
      playRemoteGroupAudio(peerId, event.streams[0]);
    }
  };

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
      removeRemoteGroupAudio(peerId);
    }
  };

  return pc;
}

function playRemoteGroupAudio(peerId, stream) {
  let container = document.getElementById('groupVoiceAudioContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'groupVoiceAudioContainer';
    container.style.display = 'none';
    document.body.appendChild(container);
  }

  let audioEl = document.getElementById(`audio-peer-${peerId}`);
  if (!audioEl) {
    audioEl = document.createElement('audio');
    audioEl.id = `audio-peer-${peerId}`;
    audioEl.autoplay = true;
    audioEl.playsInline = true;
    container.appendChild(audioEl);
  }

  audioEl.srcObject = stream;
  const selectedSpeakerId = localStorage.getItem('taiyoani_audio_output_id');
  if (selectedSpeakerId && typeof audioEl.setSinkId === 'function') {
    audioEl.setSinkId(selectedSpeakerId).catch(() => {});
  }
  audioEl.play().catch(() => {});
}

function removeRemoteGroupAudio(peerId) {
  const audioEl = document.getElementById(`audio-peer-${peerId}`);
  if (audioEl) {
    audioEl.srcObject = null;
    audioEl.remove();
  }
}

// ================= 1-ON-1 VOICE CALL SYSTEM =================
function startIncomingCallListener() {
  if (!currentUserId) return;
  
  const callsQuery = query(collection(db, "voice_calls"));
  onSnapshot(callsQuery, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const call = { id: change.doc.id, ...change.doc.data() };
      
      if (call.receiverId === currentUserId && call.status === 'ringing') {
        if (!isVoiceCallActive && !incomingCallData) {
          showIncomingCallPopup(call);
        }
      }

      if (activeCallDocId && call.id === activeCallDocId) {
        if (call.status === 'ended') {
          handleRemoteHangup();
        } else if (call.status === 'connected' && !isVoiceCallActive) {
          onCallConnectedUI();
        }
      }
    });
  });
}

function showIncomingCallPopup(call) {
  incomingCallData = call;
  const modal = document.getElementById('incomingCallModal');
  const nameEl = document.getElementById('incomingCallerNameDisplay');
  const avatarEl = document.getElementById('incomingCallAvatarDisplay');

  if (nameEl) nameEl.innerText = `${call.callerName} กำลังโทรหาคุณ...`;
  if (avatarEl) avatarEl.innerHTML = renderAvatarHtml(call.callerAvatar);

  if (modal) modal.style.display = 'flex';

  AudioFX.ringtone();
  if (callRingtoneInterval) clearInterval(callRingtoneInterval);
  callRingtoneInterval = setInterval(() => {
    if (incomingCallData) AudioFX.ringtone();
  }, 2400);
}

window.acceptIncomingCall = async function() {
  if (!incomingCallData) return;
  AudioFX.click();
  if (callRingtoneInterval) clearInterval(callRingtoneInterval);

  const modal = document.getElementById('incomingCallModal');
  if (modal) modal.style.display = 'none';

  activeCallDocId = incomingCallData.id;
  const callDocRef = doc(db, "voice_calls", activeCallDocId);

  await updateDoc(callDocRef, { status: 'connected' });

  openVoiceCallUI(incomingCallData.callerName, incomingCallData.callerAvatar);
  await setupWebRTCPeer(false, callDocRef);
  incomingCallData = null;
};

window.declineIncomingCall = async function() {
  AudioFX.delete();
  if (callRingtoneInterval) clearInterval(callRingtoneInterval);

  const modal = document.getElementById('incomingCallModal');
  if (modal) modal.style.display = 'none';

  if (incomingCallData) {
    try {
      await updateDoc(doc(db, "voice_calls", incomingCallData.id), { status: 'ended' });
    } catch (e) {}
    incomingCallData = null;
  }
};

window.startVoiceCall = async function() {
  AudioFX.click();
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  if (activeChatMode !== 'dm' || !activeDmTargetUser) {
    alert('การโทรด้วยเสียงใช้ได้เฉพาะในแชทส่วนตัวแบบ 1-on-1 เท่านั้น');
    return;
  }

  const callTargetName = activeDmTargetUser.name;
  const callAvatar = activeDmTargetUser.avatar;
  const callReceiverId = activeDmTargetUser.id;

  openVoiceCallUI(callTargetName, callAvatar);

  const callDocRef = await addDoc(collection(db, "voice_calls"), {
    callerId: currentUser.id,
    callerName: currentUser.name,
    callerAvatar: currentUser.avatar,
    receiverId: callReceiverId,
    receiverName: callTargetName,
    isGroupCall: false,
    status: 'ringing',
    timestamp: serverTimestamp()
  });

  activeCallDocId = callDocRef.id;

  await pushSystemNotification({
    type: 'chat',
    title: `📞 สายเรียกเข้าจาก ${currentUser.name}`,
    body: 'กำลังโทรหาคุณผ่านระบบเสียง...',
    authorName: currentUser.name,
    authorAvatar: currentUser.avatar,
    targetUserId: callReceiverId,
    linkView: 'chat'
  });

  AudioFX.ringtone();
  if (callRingtoneInterval) clearInterval(callRingtoneInterval);
  callRingtoneInterval = setInterval(() => {
    if (isVoiceCallActive && voiceCallSeconds === 0) AudioFX.ringtone();
  }, 2400);

  await setupWebRTCPeer(true, callDocRef);
};

async function setupWebRTCPeer(isCaller, callDocRef) {
  try {
    currentPeerConnection = new RTCPeerConnection(RTC_CONFIG);

    const selectedMicId = localStorage.getItem('taiyoani_audio_input_id') || '';
    const audioConstraints = selectedMicId ? { deviceId: { exact: selectedMicId } } : true;
    localVoiceStream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints, video: false });

    localVoiceStream.getTracks().forEach(track => {
      currentPeerConnection.addTrack(track, localVoiceStream);
    });

    currentPeerConnection.ontrack = (event) => {
      const remoteAudio = document.getElementById('remoteVoiceAudio');
      if (remoteAudio && event.streams[0]) {
        remoteAudio.srcObject = event.streams[0];
        const selectedSpeakerId = localStorage.getItem('taiyoani_audio_output_id');
        if (selectedSpeakerId && typeof remoteAudio.setSinkId === 'function') {
          remoteAudio.setSinkId(selectedSpeakerId).catch(() => {});
        }
      }
    };

    const candidatesCol = collection(callDocRef, isCaller ? "callerCandidates" : "calleeCandidates");
    currentPeerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(candidatesCol, event.candidate.toJSON());
      }
    };

    if (isCaller) {
      const offer = await currentPeerConnection.createOffer();
      await currentPeerConnection.setLocalDescription(offer);
      await updateDoc(callDocRef, { offer: { type: offer.type, sdp: offer.sdp } });

      onSnapshot(callDocRef, async (snapshot) => {
        const data = snapshot.data();
        if (data && data.answer && !currentPeerConnection.currentRemoteDescription) {
          const answerDesc = new RTCSessionDescription(data.answer);
          await currentPeerConnection.setRemoteDescription(answerDesc);
          onCallConnectedUI();
        }
      });

      onSnapshot(collection(callDocRef, "calleeCandidates"), (snap) => {
        snap.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            await currentPeerConnection.addIceCandidate(new RTCIceCandidate(change.doc.data()));
          }
        });
      });
    } else {
      const callData = (await getDocs(query(collection(db, "voice_calls")))).docs.find(d => d.id === callDocRef.id)?.data();
      if (callData && callData.offer) {
        await currentPeerConnection.setRemoteDescription(new RTCSessionDescription(callData.offer));
        const answer = await currentPeerConnection.createAnswer();
        await currentPeerConnection.setLocalDescription(answer);
        await updateDoc(callDocRef, { answer: { type: answer.type, sdp: answer.sdp } });
        onCallConnectedUI();
      }

      onSnapshot(collection(callDocRef, "callerCandidates"), (snap) => {
        snap.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            await currentPeerConnection.addIceCandidate(new RTCIceCandidate(change.doc.data()));
          }
        });
      });
    }
  } catch (err) {
    console.error("WebRTC Error:", err);
    alert("ไม่สามารถเข้าถึงไมโครโฟนได้ กรุณาตรวจสอบการอนุญาตใช้งานไมค์");
    endVoiceCall();
  }
}

function openVoiceCallUI(targetName, avatarData) {
  isVoiceCallActive = true;
  isVoiceMuted = false;
  voiceCallSeconds = 0;

  const modal = document.getElementById('voiceCallModal');
  const targetNameEl = document.getElementById('voiceCallTargetNameDisplay');
  const avatarEl = document.getElementById('voiceCallAvatarDisplay');
  const statusEl = document.getElementById('voiceCallStatusText');
  const timerEl = document.getElementById('voiceCallTimerDisplay');

  if (targetNameEl) targetNameEl.innerText = targetName;
  if (statusEl) statusEl.innerText = 'กำลังส่งสัญญาณเรียกสาย...';
  if (avatarEl) avatarEl.innerHTML = renderAvatarHtml(avatarData);
  if (timerEl) {
    timerEl.style.display = 'none';
    timerEl.innerText = '00:00';
  }

  if (modal) modal.style.display = 'flex';
}

function onCallConnectedUI() {
  if (callRingtoneInterval) clearInterval(callRingtoneInterval);
  AudioFX.success();

  const statusEl = document.getElementById('voiceCallStatusText');
  const timerEl = document.getElementById('voiceCallTimerDisplay');
  if (statusEl) statusEl.innerText = '🟢 กำลังสนทนาเสียง (Connected)';
  if (timerEl) timerEl.style.display = 'block';

  if (voiceCallTimerInterval) clearInterval(voiceCallTimerInterval);
  voiceCallTimerInterval = setInterval(() => {
    voiceCallSeconds++;
    const mins = String(Math.floor(voiceCallSeconds / 60)).padStart(2, '0');
    const secs = String(voiceCallSeconds % 60).padStart(2, '0');
    if (timerEl) timerEl.innerText = `${mins}:${secs}`;
  }, 1000);
}

function handleRemoteHangup() {
  AudioFX.delete();
  cleanupCallResources();
  alert('คู่สนทนาวางสายแล้ว');
}

window.endVoiceCall = async function() {
  AudioFX.delete();
  if (activeCallDocId) {
    try {
      await updateDoc(doc(db, "voice_calls", activeCallDocId), { status: 'ended' });
    } catch (e) {}
  }
  cleanupCallResources();
};

function cleanupCallResources() {
  isVoiceCallActive = false;
  activeCallDocId = null;
  if (callRingtoneInterval) clearInterval(callRingtoneInterval);
  if (voiceCallTimerInterval) clearInterval(voiceCallTimerInterval);

  if (localVoiceStream && !isUserInVoiceRoom) {
    localVoiceStream.getTracks().forEach(t => t.stop());
    localVoiceStream = null;
  }
  if (currentPeerConnection) {
    currentPeerConnection.close();
    currentPeerConnection = null;
  }

  const remoteAudio = document.getElementById('remoteVoiceAudio');
  if (remoteAudio) remoteAudio.srcObject = null;

  const modal = document.getElementById('voiceCallModal');
  if (modal) modal.style.display = 'none';
}

window.toggleVoiceMute = function() {
  AudioFX.click();
  isVoiceMuted = !isVoiceMuted;
  if (localVoiceStream) {
    localVoiceStream.getAudioTracks().forEach(track => {
      track.enabled = !isVoiceMuted;
    });
  }
  const btn = document.getElementById('btnVoiceMute');
  if (btn) {
    btn.classList.toggle('active', isVoiceMuted);
    btn.innerText = isVoiceMuted ? '🔇 เปิดไมค์' : '🎤 ปิดไมค์';
  }
};

// ================= MESSAGE SEND & UNSEND =================
window.handleSendChatMessage = async function(e) {
  e.preventDefault();
  const input = document.getElementById('chatTextInput');
  const text = input.value.trim();
  const imageBase64ToSend = selectedChatImageBase64;

  if (!text && !imageBase64ToSend) return;

  const currentUser = getCurrentUser();
  if (!currentUser) return;

  AudioFX.sendChat();
  input.value = '';
  removeChatImageAttachment();

  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const payload = {
    senderId: currentUser.id,
    senderName: currentUser.name,
    senderAvatar: currentUser.avatar,
    text: text,
    image: imageBase64ToSend || null,
    time: nowStr,
    timestamp: serverTimestamp()
  };

  if (activeChatMode === 'team') {
    await addDoc(collection(db, "chats"), payload);

    await pushSystemNotification({
      type: 'chat',
      title: `💬 ${currentUser.name} (ห้องรวม)`,
      body: text || '📷 ส่งรูปภาพในห้องแชท',
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      linkView: 'chat'
    });
  } else if (activeChatMode === 'dm' && activeDmTargetUser) {
    const roomId = [currentUser.id, activeDmTargetUser.id].sort().join('_');
    await addDoc(collection(db, "direct_chats", roomId, "messages"), {
      ...payload,
      receiverId: activeDmTargetUser.id
    });

    await pushSystemNotification({
      type: 'chat',
      title: `💬 ข้อความส่วนตัวจาก ${currentUser.name}`,
      body: text || '📷 ส่งรูปภาพ',
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      targetUserId: activeDmTargetUser.id,
      linkView: 'chat'
    });
  } else if (activeChatMode === 'group' && activeGroupId) {
    await addDoc(collection(db, "group_chats", activeGroupId, "messages"), payload);

    if (activeGroupData && Array.isArray(activeGroupData.members)) {
      activeGroupData.members.forEach(async (memberId) => {
        if (memberId !== currentUser.id) {
          await pushSystemNotification({
            type: 'chat',
            title: `👥 ${currentUser.name} ในกลุ่ม ${activeGroupData.name}`,
            body: text || '📷 ส่งรูปภาพ',
            authorName: currentUser.name,
            authorAvatar: currentUser.avatar,
            targetUserId: memberId,
            linkView: 'chat'
          });
        }
      });
    }
  }
};

window.handleUnsendMessage = async function(messageId) {
  const currentUser = getCurrentUser();
  if (!currentUser || !messageId) return;

  if (confirm("คุณต้องการยกเลิกข้อความนี้ใช่หรือไม่?")) {
    AudioFX.delete();
    if (activeChatMode === 'team') {
      await deleteDoc(doc(db, "chats", messageId));
    } else if (activeChatMode === 'dm' && activeDmTargetUser) {
      const roomId = [currentUser.id, activeDmTargetUser.id].sort().join('_');
      await deleteDoc(doc(db, "direct_chats", roomId, "messages", messageId));
    } else if (activeChatMode === 'group' && activeGroupId) {
      await deleteDoc(doc(db, "group_chats", activeGroupId, "messages", messageId));
    }
  }
};

window.handleClearChat = async function() {
  if (!isAdmin()) {
    AudioFX.delete();
    alert('เฉพาะแอดมิน (TaiyoAni) เท่านั้นที่มีสิทธิ์ล้างประวัติแชท');
    return;
  }

  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างประวัติแชทห้องทีมทั้งหมด?')) {
    AudioFX.delete();
    const snap = await getDocs(collection(db, "chats"));
    snap.forEach(async (d) => await deleteDoc(doc(db, "chats", d.id)));
  }
};

function renderChatMessages() {
  const body = document.getElementById('chatMessagesBody');
  const mainCounter = document.getElementById('mainChatBadgeCounter');
  const dockCounter = document.getElementById('chatBadgeCounter');
  if (mainCounter) mainCounter.innerText = chatMessages.length;
  if (dockCounter) dockCounter.innerText = chatMessages.length;
  if (!body) return;

  body.innerHTML = '';
  const currentUser = getCurrentUser();
  
  let msgsToRender = chatMessages;
  if (activeChatMode === 'dm') msgsToRender = dmChatMessages;
  if (activeChatMode === 'group') msgsToRender = groupChatMessages;

  if (msgsToRender.length === 0) {
    body.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; margin-top: 40px;">💬 ยังไม่มีข้อความในห้องนี้</div>`;
    return;
  }

  msgsToRender.forEach(msg => {
    const isMine = currentUser && msg.senderId === currentUser.id;
    const canUnsend = isMine || isAdmin(currentUser);
    const row = document.createElement('div');
    row.className = `chat-message-row ${isMine ? 'is-mine' : ''}`;

    let imageAttachmentHtml = '';
    if (msg.image) {
      imageAttachmentHtml = `
        <div class="chat-attached-image-box" onclick="openLightboxImage('${msg.image}')" title="คลิกเพื่อดูรูปภาพ">
          <img src="${msg.image}" alt="รูปภาพแนบ">
        </div>
      `;
    }

    row.innerHTML = `
      <div class="chat-msg-avatar clickable-profile" onclick="openUserProfile('${msg.senderId}')" title="ดูโปรไฟล์">${renderAvatarHtml(msg.senderAvatar)}</div>
      <div class="chat-msg-content">
        <div class="chat-msg-author clickable-profile" onclick="openUserProfile('${msg.senderId}')">${escapeHtml(msg.senderName)}</div>
        <div class="chat-msg-bubble">
          ${msg.text ? `<div>${escapeHtml(msg.text)}</div>` : ''}
          ${imageAttachmentHtml}
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <span class="chat-msg-time">${escapeHtml(msg.time || '')}</span>
          ${canUnsend ? `<button type="button" class="btn-unsend-msg" onclick="handleUnsendMessage('${msg.id}')" title="ยกเลิกข้อความนี้">ยกเลิกข้อความ</button>` : ''}
        </div>
      </div>
    `;
    body.appendChild(row);
  });
}

function scrollChatToBottom() {
  const body = document.getElementById('chatMessagesBody');
  if (body) {
    setTimeout(() => { body.scrollTop = body.scrollHeight; }, 60);
  }
}

// ================= CHAT EMOJI & LIGHTBOX =================
function renderChatEmojiPicker() {
  const container = document.getElementById('chatEmojiPickerPopover');
  if (!container) return;
  container.innerHTML = '';

  EMOJI_LIST.forEach(emoji => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'emoji-btn-opt';
    btn.innerText = emoji;
    btn.onclick = (e) => {
      e.stopPropagation();
      const input = document.getElementById('chatTextInput');
      if (input) {
        input.value += emoji;
        input.focus();
      }
      container.style.display = 'none';
    };
    container.appendChild(btn);
  });
}

window.toggleChatEmojiPicker = function(event) {
  if (event) event.stopPropagation();
  AudioFX.click();
  const picker = document.getElementById('chatEmojiPickerPopover');
  if (picker) {
    const isShown = picker.style.display === 'grid';
    picker.style.display = isShown ? 'none' : 'grid';
  }
};

document.addEventListener('click', (e) => {
  const picker = document.getElementById('chatEmojiPickerPopover');
  const toggleBtn = document.getElementById('btnChatEmojiToggle');
  if (picker && picker.style.display === 'grid') {
    if (!picker.contains(e.target) && !toggleBtn?.contains(e.target)) {
      picker.style.display = 'none';
    }
  }
});

window.handleChatImageSelect = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const maxDim = 800;
      let width = img.width, height = img.height;

      if (width > height && width > maxDim) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else if (height > maxDim) {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      selectedChatImageBase64 = canvas.toDataURL('image/jpeg', 0.82);

      const previewBox = document.getElementById('chatImagePreviewWrapper');
      const previewImg = document.getElementById('chatImagePreviewImg');
      if (previewBox && previewImg) {
        previewImg.src = selectedChatImageBase64;
        previewBox.style.display = 'flex';
      }
      AudioFX.click();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

window.removeChatImageAttachment = function() {
  selectedChatImageBase64 = null;
  const previewBox = document.getElementById('chatImagePreviewWrapper');
  const fileInput = document.getElementById('chatFileInput');
  if (previewBox) previewBox.style.display = 'none';
  if (fileInput) fileInput.value = '';
};

window.openLightboxImage = function(imgSrc) {
  AudioFX.click();
  const modal = document.getElementById('imageLightboxModal');
  const imgEl = document.getElementById('imageLightboxImg');
  if (modal && imgEl) {
    imgEl.src = imgSrc;
    modal.style.display = 'flex';
  }
};

window.closeLightbox = function() {
  const modal = document.getElementById('imageLightboxModal');
  if (modal) modal.style.display = 'none';
};

// ================= SAVE LOADING CONTROLLERS =================
function showSaveLoadingModal(title, desc) {
  const modal = document.getElementById('loadingModal');
  const titleEl = document.getElementById('saveLoadingTitle');
  const descEl = document.getElementById('saveLoadingDesc');
  const iconEl = document.getElementById('saveLoadingIcon');
  const fillEl = document.getElementById('saveProgressBarFill');
  if (!modal) return;
  
  if (titleEl) titleEl.innerText = title;
  if (descEl) descEl.innerText = desc;
  if (iconEl) iconEl.innerText = '⏳';
  if (fillEl) {
    fillEl.classList.remove('success');
    fillEl.style.width = '12%';
  }
  modal.style.display = 'flex';
}

function setSaveProgress(percent) {
  const fillEl = document.getElementById('saveProgressBarFill');
  if (fillEl) fillEl.style.width = `${percent}%`;
}

function showSaveSuccessModal(title, desc) {
  const titleEl = document.getElementById('saveLoadingTitle');
  const descEl = document.getElementById('saveLoadingDesc');
  const iconEl = document.getElementById('saveLoadingIcon');
  const fillEl = document.getElementById('saveProgressBarFill');
  
  if (titleEl) titleEl.innerText = title;
  if (descEl) descEl.innerText = desc;
  if (iconEl) iconEl.innerText = '✅';
  if (fillEl) {
    fillEl.classList.add('success');
    fillEl.style.width = '100%';
  }
}

function hideSaveLoadingModal() {
  const modal = document.getElementById('loadingModal');
  if (modal) modal.style.display = 'none';
}

// ================= DEVICE MODE SWITCHER =================
window.setDeviceMode = function(mode) {
  AudioFX.click();
  const body = document.body;
  body.classList.remove('device-mode-auto', 'device-mode-desktop', 'device-mode-tablet', 'device-mode-mobile');
  body.classList.add(`device-mode-${mode}`);

  localStorage.setItem('taiyoani_device_mode', mode);

  document.querySelectorAll('.btn-device-opt').forEach(btn => btn.classList.remove('active'));
  const targetBtn = document.getElementById(`devOpt${mode.charAt(0).toUpperCase() + mode.slice(1)}`);
  if (targetBtn) targetBtn.classList.add('active');

  isMobileSidebarOpen = false;
  const sidebar = document.getElementById('appSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (sidebar) sidebar.classList.remove('mobile-open');
  if (backdrop) backdrop.classList.remove('active');
};

function initDeviceMode() {
  const savedMode = localStorage.getItem('taiyoani_device_mode') || 'auto';
  window.setDeviceMode(savedMode);
}

window.toggleMobileSidebar = function() {
  AudioFX.click();
  isMobileSidebarOpen = !isMobileSidebarOpen;
  const sidebar = document.getElementById('appSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (sidebar) sidebar.classList.toggle('mobile-open', isMobileSidebarOpen);
  if (backdrop) backdrop.classList.toggle('active', isMobileSidebarOpen);
};

// ================= PRESENCE & HEARTBEAT SYSTEM =================
function startHeartbeat() {
  if (!currentUserId) return;
  updateDoc(doc(db, "users", currentUserId), { lastActive: serverTimestamp() }).catch(() => {});

  setInterval(() => {
    if (currentUserId) {
      updateDoc(doc(db, "users", currentUserId), { lastActive: serverTimestamp() }).catch(() => {});
    }
  }, 45000);
}

function getPresenceStatus(lastActive) {
  if (!lastActive) return { isOnline: false, text: 'ออฟไลน์นานแล้ว' };
  const lastTime = lastActive.toDate ? lastActive.toDate().getTime() : (typeof lastActive === 'number' ? lastActive : new Date(lastActive).getTime());
  const diffMs = Date.now() - lastTime;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 2) return { isOnline: true, text: '🟢 ออนไลน์' };
  if (diffMin < 60) return { isOnline: false, text: `${diffMin} น. ที่แล้ว` };
  if (diffMin < 1440) return { isOnline: false, text: `${Math.floor(diffMin / 60)} ชม. ที่แล้ว` };
  return { isOnline: false, text: `${Math.floor(diffMin / 1440)} วันที่แล้ว` };
}

// ================= REAL-TIME FIRESTORE LISTENERS =================
function startRealtimeSync() {
  onSnapshot(collection(db, "users"), (snapshot) => {
    teamUsers = [];
    snapshot.forEach(doc => teamUsers.push(doc.data()));
    populateLoginUserSelect();
    populateAssigneeDropdown();
    updateCurrentUserDisplay();
    renderMembersPresenceList();
    renderDiscordSidebarChannels();
    renderHomeBanners();
  });

  onSnapshot(collection(db, "group_chats"), (snapshot) => {
    groupChats = [];
    snapshot.forEach(doc => groupChats.push({ id: doc.id, ...doc.data() }));
    renderDiscordSidebarChannels();
  });

  onSnapshot(collection(db, "projects"), (snapshot) => {
    projects = [];
    snapshot.forEach(doc => projects.push(doc.data()));
    if (projects.length > 0 && !activeProjectId) {
      activeProjectId = projects[0].id;
    } else if (projects.length === 0) {
      activeProjectId = null;
    }
    renderProjects();
  });

  onSnapshot(doc(db, "finances", "revenue_stats"), (docSnap) => {
    if (docSnap.exists()) {
      revenueData = docSnap.data();
    } else {
      revenueData = { voice: 0, animation: 0, audio: 0, other: 0, note: '', updatedBy: 'แอดมิน', updatedTime: 'เริ่มต้น' };
    }
    renderRevenueWidget();
  });

  const chatQuery = query(collection(db, "chats"), orderBy("timestamp", "asc"));
  onSnapshot(chatQuery, (snapshot) => {
    const newChats = [];
    snapshot.forEach(doc => newChats.push({ id: doc.id, ...doc.data() }));
    initialChatLoadDone = true;
    chatMessages = newChats;
    if (activeChatMode === 'team') {
      renderChatMessages();
      scrollChatToBottom();
    }
  });

  const communityQuery = query(collection(db, "community_posts"), orderBy("timestamp", "desc"));
  onSnapshot(communityQuery, (snapshot) => {
    communityPosts = [];
    snapshot.forEach(doc => communityPosts.push({ id: doc.id, ...doc.data() }));
    renderCommunityPosts();
  });

  const storiesQuery = query(collection(db, "community_stories"), orderBy("timestamp", "asc"));
  onSnapshot(storiesQuery, (snapshot) => {
    communityStories = [];
    snapshot.forEach(doc => communityStories.push({ id: doc.id, ...doc.data() }));
    renderStoriesTray();
  });

  const bannersQuery = query(collection(db, "home_banners"), orderBy("createdAt", "desc"));
  onSnapshot(bannersQuery, (snapshot) => {
    homeBanners = [];
    snapshot.forEach(doc => homeBanners.push({ id: doc.id, ...doc.data() }));
    renderHomeBanners();
    renderLockBanners();
  });

  let initialNotifLoad = true;
  const notifQuery = query(collection(db, "system_notifications"), orderBy("createdAt", "desc"));
  onSnapshot(notifQuery, (snapshot) => {
    const freshNotifs = [];
    snapshot.forEach(doc => freshNotifs.push({ id: doc.id, ...doc.data() }));

    const myId = currentUserId;
    const userFilteredNotifs = freshNotifs.filter(n => !n.targetUserId || n.targetUserId === myId);

    if (!initialNotifLoad && freshNotifs.length > 0) {
      const newest = freshNotifs[0];
      const currentUser = getCurrentUser();

      const isTargetedToMe = !newest.targetUserId || newest.targetUserId === myId;
      if (newest && isTargetedToMe && (!currentUser || newest.authorName !== currentUser.name)) {
        triggerHardwareAlert(newest.title, newest.body, newest.authorAvatar, () => {
          if (newest.linkView) window.switchAppView(newest.linkView);
        });
      }
    }

    initialNotifLoad = false;
    systemNotifications = userFilteredNotifs.slice(0, 50);
    updateNotificationBadge();
    const notifModal = document.getElementById('notificationsModal');
    if (notifModal && notifModal.style.display === 'flex') {
      renderNotificationsList();
    }
  });
}

// ================= REVENUE & PAYOUT SYSTEM =================
function renderRevenueWidget() {
  const voice = Number(revenueData.voice) || 0;
  const anim = Number(revenueData.animation) || 0;
  const audio = Number(revenueData.audio) || 0;
  const other = Number(revenueData.other) || 0;
  const total = voice + anim + audio + other;

  const voiceEl = document.getElementById('revenueVoiceDisplay');
  const animEl = document.getElementById('revenueAnimDisplay');
  const audioEl = document.getElementById('revenueAudioDisplay');
  const otherEl = document.getElementById('revenueOtherDisplay');
  const totalEl = document.getElementById('revenueTotalDisplay');

  if (voiceEl) voiceEl.innerText = formatCurrency(voice);
  if (animEl) animEl.innerText = formatCurrency(anim);
  if (audioEl) audioEl.innerText = formatCurrency(audio);
  if (otherEl) otherEl.innerText = formatCurrency(other);
  if (totalEl) totalEl.innerText = formatCurrency(total);

  const noteEl = document.getElementById('revenueNoteDisplay');
  if (noteEl) {
    noteEl.innerText = revenueData.note ? `งวด: ${revenueData.note}` : 'งบประมาณและผลตอบแทนรวมทุกฝ่าย';
  }

  const badge = document.getElementById('revenueUpdatedBadge');
  if (badge) {
    badge.innerText = revenueData.updatedTime ? `อัปเดตล่าสุด: ${revenueData.updatedTime} โดย ${revenueData.updatedBy || 'แอดมิน'}` : `อัปเดตล่าสุด: พร้อมใช้งาน`;
  }

  const transferDateEl = document.getElementById('revenueTransferDateDisplay');
  const transferDetailsEl = document.getElementById('revenueTransferDetailsDisplay');
  const statusBadgeEl = document.getElementById('revenueTransferStatusBadge');
  const payerEl = document.getElementById('revenuePayerDisplay');

  if (transferDateEl) transferDateEl.innerText = (revenueData.transferDate && revenueData.transferDate.trim() !== '') ? revenueData.transferDate : 'ยังไม่ได้กำหนดวันที่';
  if (transferDetailsEl) transferDetailsEl.innerText = (revenueData.transferDetails && revenueData.transferDetails.trim() !== '') ? revenueData.transferDetails : 'ยังไม่มีข้อความชี้แจงการโอนเงินจากแอดมิน';
  if (payerEl) payerEl.innerText = `${revenueData.updatedBy || 'TaiyoAni'} (Admin)`;

  if (statusBadgeEl) {
    const status = revenueData.transferStatus || 'pending';
    statusBadgeEl.className = 'payout-status-badge';
    if (status === 'completed') {
      statusBadgeEl.classList.add('status-completed');
      statusBadgeEl.innerText = '✅ โอนเงินเรียบร้อยแล้ว';
    } else if (status === 'processing') {
      statusBadgeEl.classList.add('status-processing');
      statusBadgeEl.innerText = '🔄 กำลังดำเนินการโอนเงิน';
    } else {
      statusBadgeEl.classList.add('status-pending');
      statusBadgeEl.innerText = '⏳ กำลังสรุปยอด / รอโอน';
    }
  }
}

window.openRevenueModal = function() {
  if (!isAdmin()) {
    AudioFX.delete();
    alert('เฉพาะแอดมิน (TaiyoAni) เท่านั้นที่มีสิทธิ์จัดการรายได้และข้อมูลโอนเงิน');
    return;
  }
  AudioFX.click();
  document.getElementById('inputRevenueVoice').value = revenueData.voice || 0;
  document.getElementById('inputRevenueAnim').value = revenueData.animation || 0;
  document.getElementById('inputRevenueAudio').value = revenueData.audio || 0;
  document.getElementById('inputRevenueOther').value = revenueData.other || 0;
  document.getElementById('inputRevenueNote').value = revenueData.note || '';
  document.getElementById('inputRevenueTransferDate').value = revenueData.transferDate || '';
  document.getElementById('inputRevenueTransferStatus').value = revenueData.transferStatus || 'pending';
  document.getElementById('inputRevenueTransferDetails').value = revenueData.transferDetails || '';

  document.getElementById('revenueModal').style.display = 'flex';
};

window.handleSaveRevenue = async function(e) {
  e.preventDefault();
  if (!isAdmin()) {
    alert('เฉพาะแอดมินเท่านั้นที่มีสิทธิ์บันทึกรายได้');
    return;
  }

  const voice = parseFloat(document.getElementById('inputRevenueVoice').value) || 0;
  const animation = parseFloat(document.getElementById('inputRevenueAnim').value) || 0;
  const audio = parseFloat(document.getElementById('inputRevenueAudio').value) || 0;
  const other = parseFloat(document.getElementById('inputRevenueOther').value) || 0;
  const note = document.getElementById('inputRevenueNote').value.trim();
  const transferDate = document.getElementById('inputRevenueTransferDate').value.trim();
  const transferStatus = document.getElementById('inputRevenueTransferStatus').value;
  const transferDetails = document.getElementById('inputRevenueTransferDetails').value.trim();

  const currentUser = getCurrentUser();
  const nowStr = new Date().toLocaleDateString('th-TH') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  AudioFX.success();
  await setDoc(doc(db, "finances", "revenue_stats"), {
    voice, animation, audio, other, note, transferDate, transferStatus, transferDetails,
    updatedBy: currentUser ? currentUser.name : 'TaiyoAni',
    updatedTime: nowStr,
    timestamp: serverTimestamp()
  });

  closeModal('revenueModal');
};

// ================= SCRIPT & WORKSPACE =================
window.openNewScriptModal = function() {
  if (!activeProjectId) { alert('กรุณาสร้างหรือเลือกโปรเจกต์ก่อนสร้างสคริปต์'); return; }
  AudioFX.click();
  document.getElementById('newScriptTitleInput').value = '';
  document.getElementById('newScriptDescInput').value = '';
  document.getElementById('newScriptModal').style.display = 'flex';
};

window.handleCreateNewScript = async function(e) {
  e.preventDefault();
  const currentProj = projects.find(p => p.id === activeProjectId);
  if (!currentProj) return;

  const title = document.getElementById('newScriptTitleInput').value.trim();
  const desc = document.getElementById('newScriptDescInput').value.trim();
  if (!title) return;

  const currentUser = getCurrentUser();
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const scriptId = 'script-' + Date.now();

  const newScriptTask = {
    id: scriptId,
    title,
    assignee: 'ทีมพากย์ / ผลิตบท',
    story: desc || 'เอกสารสคริปต์บทพากย์และเนื้อเรื่องประจำโปรเจกต์',
    status: 'script',
    pages: [''],
    likes: 0,
    createdBy: currentUser ? { name: currentUser.name, avatar: currentUser.avatar } : null,
    updatedBy: currentUser ? { name: currentUser.name, avatar: currentUser.avatar, time: nowStr } : null
  };

  const updatedTasks = [newScriptTask, ...(currentProj.tasks || [])];
  AudioFX.success();
  await updateDoc(doc(db, "projects", activeProjectId), { tasks: updatedTasks });

  await pushSystemNotification({
    type: 'task',
    title: `เพิ่มสคริปต์ใหม่: ${title}`,
    body: desc || 'มีเอกสารบทพากย์ใหม่เพิ่มเข้ามาในโปรเจกต์',
    authorName: currentUser ? currentUser.name : 'สมาชิก',
    authorAvatar: currentUser ? currentUser.avatar : '📜',
    linkView: 'projects'
  });
  
  closeModal('newScriptModal');
  openScriptEditor(scriptId);
};

window.execWordCmd = function(command, value = null) {
  document.getElementById('wordPaperEditor').focus();
  document.execCommand(command, false, value);
  saveCurrentPageBuffer();
  updateWordStats();
};

window.removeFormat = function() {
  document.getElementById('wordPaperEditor').focus();
  document.execCommand('removeFormat', false, null);
  saveCurrentPageBuffer();
  updateWordStats();
};

function saveCurrentPageBuffer() {
  const editor = document.getElementById('wordPaperEditor');
  if (editor && currentScriptPages[activePageIndex] !== undefined) {
    currentScriptPages[activePageIndex] = editor.innerHTML;
  }
}

function updateWordStats() {
  const editor = document.getElementById('wordPaperEditor');
  if (!editor) return;
  const text = editor.innerText || '';
  const charCount = text.length;
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  document.getElementById('wordStatsDisplay').innerText = `หน้า ${activePageIndex + 1}: ${wordCount} คำ | ${charCount} ตัวอักษร (รวม ${currentScriptPages.length} หน้า)`;
}

function updatePageControlsUI() {
  const total = currentScriptPages.length;
  const dropdown = document.getElementById('pageSelectDropdown');
  dropdown.innerHTML = '';

  for (let i = 0; i < total; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.innerText = `${i + 1}`;
    if (i === activePageIndex) opt.selected = true;
    dropdown.appendChild(opt);
  }

  document.getElementById('pageTotalDisplay').innerText = `/ ${total}`;
  document.getElementById('btnPrevPage').disabled = (activePageIndex === 0);
  document.getElementById('btnNextPage').disabled = (activePageIndex === total - 1);
  document.getElementById('btnAddNewPage').disabled = (total >= MAX_PAGES);
  document.getElementById('btnDeleteCurrentPage').disabled = (total <= 1);
}

window.jumpToPage = function(pageIndex) {
  saveCurrentPageBuffer();
  activePageIndex = parseInt(pageIndex, 10) || 0;
  loadPageContent();
};

window.prevPage = function() {
  if (activePageIndex > 0) {
    AudioFX.pageFlip();
    saveCurrentPageBuffer();
    activePageIndex--;
    loadPageContent();
  }
};

window.nextPage = function() {
  if (activePageIndex < currentScriptPages.length - 1) {
    AudioFX.pageFlip();
    saveCurrentPageBuffer();
    activePageIndex++;
    loadPageContent();
  }
};

window.addNewPage = function() {
  if (currentScriptPages.length >= MAX_PAGES) { alert(`ไม่สามารถเพิ่มหน้าได้เกิน ${MAX_PAGES} หน้า`); return; }
  AudioFX.pageFlip();
  saveCurrentPageBuffer();
  currentScriptPages.push('');
  activePageIndex = currentScriptPages.length - 1;
  loadPageContent();
};

window.deleteCurrentPage = function() {
  if (currentScriptPages.length <= 1) { alert('ต้องมีสคริปต์อย่างน้อย 1 หน้า'); return; }
  if (confirm(`คุณต้องการลบ "หน้าที่ ${activePageIndex + 1}" ใช่หรือไม่?`)) {
    AudioFX.delete();
    currentScriptPages.splice(activePageIndex, 1);
    if (activePageIndex >= currentScriptPages.length) {
      activePageIndex = currentScriptPages.length - 1;
    }
    loadPageContent();
  }
};

function loadPageContent() {
  const paper = document.getElementById('wordPaperEditor');
  paper.innerHTML = currentScriptPages[activePageIndex] || '';
  updatePageControlsUI();
  updateWordStats();
}

const paperEditorEl = document.getElementById('wordPaperEditor');
if (paperEditorEl) {
  paperEditorEl.addEventListener('input', () => {
    saveCurrentPageBuffer();
    updateWordStats();
  });
}

window.openScriptEditor = function(taskId) {
  const currentProj = projects.find(p => p.id === activeProjectId);
  if (!currentProj) return;

  const task = currentProj.tasks.find(t => t.id === taskId);
  if (!task) return;

  activeScriptTaskId = taskId;
  AudioFX.click();

  document.getElementById('scriptEditorTaskTitle').innerText = `📜 สคริปต์: ${task.title}`;
  
  const currentUser = getCurrentUser();
  const isCreator = currentUser && task.createdBy && task.createdBy.name === currentUser.name;
  const canEdit = isAdmin(currentUser) || isCreator;

  if (Array.isArray(task.pages) && task.pages.length > 0) {
    currentScriptPages = [...task.pages];
  } else if (task.scriptContent) {
    currentScriptPages = [task.scriptContent];
  } else {
    currentScriptPages = [''];
  }

  activePageIndex = 0;

  const paper = document.getElementById('wordPaperEditor');
  paper.contentEditable = canEdit ? 'true' : 'false';

  const saveBtn = document.getElementById('btnSaveScriptAction');
  const addPageBtn = document.getElementById('btnAddNewPage');
  const delPageBtn = document.getElementById('btnDeleteCurrentPage');
  if (saveBtn) saveBtn.style.display = canEdit ? 'inline-flex' : 'none';
  if (addPageBtn) addPageBtn.style.display = canEdit ? 'inline-flex' : 'none';
  if (delPageBtn) delPageBtn.style.display = canEdit ? 'inline-flex' : 'none';

  const metaInfo = document.getElementById('scriptEditorMetaInfo');
  if (task.scriptUpdatedBy) {
    metaInfo.innerText = `✏️ แก้ไขล่าสุดโดย ${task.scriptUpdatedBy.name} (${task.scriptUpdatedBy.time}) ${!canEdit ? '• [โหมดอ่าน]' : ''}`;
  } else {
    metaInfo.innerText = canEdit ? 'เขียนและจัดรูปแบบเอกสารแบบเรียลไทม์' : 'โหมดอ่านอย่างเดียว';
  }

  loadPageContent();
  document.getElementById('scriptEditorModal').style.display = 'flex';
};

window.handleSaveTaskScript = async function() {
  const currentProj = projects.find(p => p.id === activeProjectId);
  if (!currentProj || !activeScriptTaskId) return;

  const task = currentProj.tasks.find(t => t.id === activeScriptTaskId);
  if (!task) return;

  const currentUser = getCurrentUser();
  const isCreator = currentUser && task.createdBy && task.createdBy.name === currentUser.name;
  if (!isAdmin() && !isCreator) { alert('คุณไม่มีสิทธิ์แก้ไขสคริปต์นี้'); return; }

  saveCurrentPageBuffer();
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const updatedTasks = currentProj.tasks.map(t => {
    if (t.id === activeScriptTaskId) {
      return {
        ...t,
        pages: currentScriptPages,
        scriptContent: currentScriptPages[0] || '',
        scriptUpdatedBy: currentUser ? { name: currentUser.name, time: nowStr } : null
      };
    }
    return t;
  });

  AudioFX.success();
  await updateDoc(doc(db, "projects", activeProjectId), { tasks: updatedTasks });
  closeModal('scriptEditorModal');
  alert(`💾 บันทึกสคริปต์สำเร็จ (${currentScriptPages.length} หน้า)!`);
};

// ================= AUTH & ACCOUNT MANAGEMENT =================
function initAuth() {
  initDeviceMode();
  initAppView();
  startLiveClock();
  renderChatEmojiPicker();
  startRealtimeSync();
  startIncomingCallListener();
  initDockGestureScrubber();

  if (currentUserId) {
    document.getElementById('authGate').style.display = 'none';
    document.getElementById('mainAppLayout').style.display = 'flex';
    updateCurrentUserDisplay();
    startHeartbeat();
    requestNotificationPermission();

    const pin = getStoredLockPin();
    if (pin && pin.trim() !== '') {
      window.lockAppScreen();
    }
  } else {
    document.getElementById('authGate').style.display = 'flex';
    document.getElementById('mainAppLayout').style.display = 'none';
    renderAuthAvatarPicker();
  }
}

window.switchAuthTab = function(tab) {
  const isLogin = tab === 'login';
  document.getElementById('loginSection').style.display = isLogin ? 'block' : 'none';
  document.getElementById('registerSection').style.display = isLogin ? 'none' : 'block';
  document.getElementById('tabBtnLogin').className = `auth-tab-btn ${isLogin ? 'active' : ''}`;
  document.getElementById('tabBtnRegister').className = `auth-tab-btn ${!isLogin ? 'active' : ''}`;
  document.getElementById('loginErrorMsg').style.display = 'none';
  document.getElementById('regErrorMsg').style.display = 'none';
};

function renderAuthAvatarPicker() {
  const container = document.getElementById('authAvatarPicker');
  if (!container) return;
  container.innerHTML = '';
  const currentVal = document.getElementById('authAvatarDataInput').value;

  AVATAR_PRESETS.forEach(emoji => {
    const div = document.createElement('div');
    div.className = `avatar-opt ${emoji === currentVal ? 'active' : ''}`;
    div.innerText = emoji;
    div.onclick = () => {
      document.querySelectorAll('#authAvatarPicker .avatar-opt').forEach(el => el.classList.remove('active'));
      div.classList.add('active');
      document.getElementById('authAvatarDataInput').value = emoji;
      document.getElementById('avatarPreviewDisplay').innerHTML = `<span>${emoji}</span>`;
    };
    container.appendChild(div);
  });
}

function renderEditAvatarPicker(selectedAvatar) {
  const container = document.getElementById('editAvatarPicker');
  if (!container) return;
  container.innerHTML = '';

  AVATAR_PRESETS.forEach(emoji => {
    const div = document.createElement('div');
    div.className = `avatar-opt ${emoji === selectedAvatar ? 'active' : ''}`;
    div.innerText = emoji;
    div.onclick = () => {
      document.querySelectorAll('#editAvatarPicker .avatar-opt').forEach(el => el.classList.remove('active'));
      div.classList.add('active');
      document.getElementById('editAvatarDataInput').value = emoji;
      document.getElementById('editAvatarPreviewDisplay').innerHTML = `<span>${emoji}</span>`;
    };
    container.appendChild(div);
  });
}

window.handleAvatarFileSelect = function(event, mode) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      const maxDim = 160;
      let width = img.width, height = img.height;

      if (width > height && width > maxDim) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else if (height > maxDim) {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);

      if (mode === 'reg') {
        document.getElementById('authAvatarDataInput').value = compressedBase64;
        document.getElementById('avatarPreviewDisplay').innerHTML = `<img src="${compressedBase64}" alt="Avatar">`;
        document.querySelectorAll('#authAvatarPicker .avatar-opt').forEach(el => el.classList.remove('active'));
      } else if (mode === 'edit') {
        document.getElementById('editAvatarDataInput').value = compressedBase64;
        document.getElementById('editAvatarPreviewDisplay').innerHTML = `<img src="${compressedBase64}" alt="Avatar">`;
        document.querySelectorAll('#editAvatarPicker .avatar-opt').forEach(el => el.classList.remove('active'));
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

window.handleBannerFileSelect = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const base64 = e.target.result;
    document.getElementById('editBannerDataInput').value = base64;
    document.getElementById('editBannerPreviewDisplay').innerHTML = `<img src="${base64}" alt="Banner">`;
  };
  reader.readAsDataURL(file);
};

window.handleRemoveBanner = function() {
  document.getElementById('editBannerDataInput').value = '';
  document.getElementById('editBannerPreviewDisplay').innerHTML = `<span style="font-size: 0.85rem; color: var(--text-muted);">ไม่มีภาพหน้าปก</span>`;
  document.getElementById('editBannerFileInput').value = '';
};

function renderDeviceAccountsList() {
  const datalist = document.getElementById('deviceAccountsList');
  if (!datalist) return;
  datalist.innerHTML = '';

  try {
    const saved = JSON.parse(localStorage.getItem('taiyoani_device_accounts') || '[]');
    saved.forEach(acc => {
      const opt = document.createElement('option');
      opt.value = acc.name;
      opt.label = acc.email ? `${acc.name} (${acc.email})` : acc.name;
      datalist.appendChild(opt);
    });
  } catch (e) {}
}

function saveDeviceAccount(user) {
  try {
    let saved = JSON.parse(localStorage.getItem('taiyoani_device_accounts') || '[]');
    const existingIndex = saved.findIndex(a => a.id === user.id);
    if (existingIndex > -1) {
      saved[existingIndex] = { id: user.id, name: user.name, email: user.email || '' };
    } else {
      saved.push({ id: user.id, name: user.name, email: user.email || '' });
    }
    localStorage.setItem('taiyoani_device_accounts', JSON.stringify(saved));
    renderDeviceAccountsList();
  } catch (e) {}
}

window.handleClearDeviceSavedAccounts = function() {
  if (confirm('ต้องการล้างประวัติชื่อบัญชีที่เคยล็อกอินบนอุปกรณ์นี้หรือไม่?')) {
    AudioFX.delete();
    localStorage.removeItem('taiyoani_device_accounts');
    renderDeviceAccountsList();
    const input = document.getElementById('loginUsernameInput');
    if (input) input.value = '';
    alert('ล้างประวัติบัญชีบนอุปกรณ์นี้เรียบร้อยแล้ว');
  }
};

function populateLoginUserSelect() {
  renderDeviceAccountsList();
}

window.handleLoginSelectChange = function() {
  document.getElementById('loginPasswordInput').value = '';
  document.getElementById('loginErrorMsg').style.display = 'none';
};

window.handleLoginSubmit = async function(e) {
  e.preventDefault();
  const usernameOrEmail = document.getElementById('loginUsernameInput').value.trim().toLowerCase();
  const password = document.getElementById('loginPasswordInput').value;
  const errorMsg = document.getElementById('loginErrorMsg');

  const targetUser = teamUsers.find(u => 
    (u.name && u.name.trim().toLowerCase() === usernameOrEmail) ||
    (u.email && u.email.trim().toLowerCase() === usernameOrEmail)
  );

  if (!targetUser) {
    AudioFX.delete();
    errorMsg.innerText = 'ไม่พบบัญชีผู้ใช้หรืออีเมลนี้ในระบบ';
    errorMsg.style.display = 'block';
    return;
  }

  if (targetUser.password === password) {
    if (!targetUser.isVerified) {
      AudioFX.click();
      pendingVerificationUser = targetUser;
      openOtpVerificationModal(targetUser);
      return;
    }

    AudioFX.success();
    currentUserId = targetUser.id;
    localStorage.setItem('taiyoani_active_user_id', currentUserId);
    
    saveDeviceAccount(targetUser);

    document.getElementById('authGate').style.display = 'none';
    document.getElementById('mainAppLayout').style.display = 'flex';
    document.getElementById('loginPasswordInput').value = '';
    document.getElementById('loginUsernameInput').value = '';
    errorMsg.style.display = 'none';
    
    updateCurrentUserDisplay();
    renderProjects();
    startHeartbeat();
    requestNotificationPermission();

    const pin = getStoredLockPin();
    if (pin && pin.trim() !== '') {
      window.lockAppScreen();
    }
  } else {
    AudioFX.delete();
    errorMsg.innerText = 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง';
    errorMsg.style.display = 'block';
  }
};

window.handleRegisterSubmit = async function(e) {
  e.preventDefault();
  const name = document.getElementById('regNameInput').value.trim();
  const email = document.getElementById('regEmailInput').value.trim().toLowerCase();
  let role = document.getElementById('regRoleInput').value.trim();
  const bio = document.getElementById('regBioInput').value.trim();
  const password = document.getElementById('regPasswordInput').value;
  const confirmPassword = document.getElementById('regConfirmPasswordInput').value;
  const avatarData = document.getElementById('authAvatarDataInput').value || '👨‍💻';
  const errorMsg = document.getElementById('regErrorMsg');

  errorMsg.style.display = 'none';

  const nameLower = name.toLowerCase();
  if (nameLower === 'taiyoani') {
    const existingAdmin = teamUsers.find(u => u.name.trim().toLowerCase() === 'taiyoani');
    if (existingAdmin) {
      AudioFX.delete();
      errorMsg.innerText = 'ชื่อผู้ใช้ "TaiyoAni" สงวนสิทธิ์สำหรับแอดมิน (Creator) เท่านั้น';
      errorMsg.style.display = 'block';
      return;
    }
    role = 'แอดมิน';
  }

  const emailExists = teamUsers.find(u => u.email && u.email.toLowerCase() === email);
  if (emailExists) {
    AudioFX.delete();
    errorMsg.innerText = 'อีเมลนี้ถูกใช้งานในระบบแล้ว กรุณาใช้อีเมลอื่น';
    errorMsg.style.display = 'block';
    return;
  }

  const usernameExists = teamUsers.find(u => u.name && u.name.trim().toLowerCase() === nameLower);
  if (usernameExists) {
    AudioFX.delete();
    errorMsg.innerText = 'ชื่อผู้ใช้งานนี้ถูกใช้งานแล้ว กรุณาตั้งชื่ออื่น';
    errorMsg.style.display = 'block';
    return;
  }

  if (password !== confirmPassword) {
    AudioFX.delete();
    errorMsg.innerText = 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน';
    errorMsg.style.display = 'block';
    return;
  }

  const submitBtn = e.target.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerText = '⏳ กำลังส่งรหัส OTP...';
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const userId = 'user-' + Date.now();

  const newUser = {
    id: userId,
    name,
    email,
    role: role || 'สมาชิกทั่วไป',
    rankType: 'สมาชิกทั่วไป',
    bio: bio || '',
    avatar: avatarData,
    banner: '',
    password: password,
    isVerified: false,
    otpCode: otpCode,
    lastActive: serverTimestamp()
  };

  try {
    await setDoc(doc(db, "users", userId), newUser);
    await sendOtpEmail(email, name, otpCode);

    pendingVerificationUser = newUser;
    openOtpVerificationModal(newUser);
  } catch (err) {
    console.error("Register error:", err);
    errorMsg.innerText = 'เกิดข้อผิดพลาด: ' + (err.message || err);
    errorMsg.style.display = 'block';
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerText = 'สมัครสมาชิกและรับรหัส OTP';
    }
  }
};

function openOtpVerificationModal(user) {
  document.getElementById('otpCodeInput').value = '';
  document.getElementById('otpErrorMsg').style.display = 'none';

  if (user && user.email) {
    document.getElementById('otpTargetEmailDisplay').innerText = user.email;
    document.getElementById('otpEmailInputGroup').style.display = 'none';
  } else {
    document.getElementById('otpTargetEmailDisplay').innerText = 'ยังไม่ได้ระบุอีเมล';
    document.getElementById('otpEmailInputGroup').style.display = 'block';
  }

  document.getElementById('otpModal').style.display = 'flex';
}

window.closeOtpModal = function() {
  document.getElementById('otpModal').style.display = 'none';
  pendingVerificationUser = null;
};

window.handleSendOtpToExistingUser = async function() {
  if (!pendingVerificationUser) return;
  const email = document.getElementById('unverifiedAccountEmailInput').value.trim().toLowerCase();
  
  if (!email || !email.includes('@')) {
    alert('กรุณากรอกอีเมลที่ถูกต้อง');
    return;
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  pendingVerificationUser.email = email;
  pendingVerificationUser.otpCode = otpCode;

  await updateDoc(doc(db, "users", pendingVerificationUser.id), {
    email: email,
    otpCode: otpCode
  });

  await sendOtpEmail(email, pendingVerificationUser.name, otpCode);
  document.getElementById('otpTargetEmailDisplay').innerText = email;
  document.getElementById('otpEmailInputGroup').style.display = 'none';
};

window.handleVerifyOtpSubmit = async function(e) {
  e.preventDefault();
  const enteredOtp = document.getElementById('otpCodeInput').value.trim();
  const errorMsg = document.getElementById('otpErrorMsg');

  if (!pendingVerificationUser) return;

  if (enteredOtp === pendingVerificationUser.otpCode) {
    AudioFX.success();
    await updateDoc(doc(db, "users", pendingVerificationUser.id), {
      isVerified: true,
      otpCode: null
    });

    currentUserId = pendingVerificationUser.id;
    localStorage.setItem('taiyoani_active_user_id', currentUserId);
    saveDeviceAccount(pendingVerificationUser);

    closeOtpModal();
    document.getElementById('authGate').style.display = 'none';
    document.getElementById('mainAppLayout').style.display = 'flex';
    document.getElementById('loginPasswordInput').value = '';
    updateCurrentUserDisplay();
    renderProjects();
    startHeartbeat();
    requestNotificationPermission();
    alert('🎉 ยืนยันตัวตนผ่านอีเมลสำเร็จ ยินดีต้อนรับเข้าสู่ระบบ!');
  } else {
    AudioFX.delete();
    errorMsg.innerText = 'รหัส OTP ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง';
    errorMsg.style.display = 'block';
  }
};

window.handleResendOtp = async function() {
  if (!pendingVerificationUser || !pendingVerificationUser.email) {
    alert('กรุณาระบุอีเมลก่อนขอรับรหัส');
    return;
  }

  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
  pendingVerificationUser.otpCode = newOtp;

  await updateDoc(doc(db, "users", pendingVerificationUser.id), {
    otpCode: newOtp
  });

  await sendOtpEmail(pendingVerificationUser.email, pendingVerificationUser.name, newOtp);
  AudioFX.click();
};

window.handleLogout = function() {
  if (confirm('คุณต้องการออกจากระบบ / สลับบัญชีหรือไม่?')) {
    AudioFX.click();
    currentUserId = null;
    localStorage.removeItem('taiyoani_active_user_id');
    document.getElementById('loginPasswordInput').value = '';
    initAuth();
  }
};

// ================= MEMBERS PRESENCE =================
function renderMembersPresenceList() {
  const container = document.getElementById('membersPresenceList');
  const homeOnlinePill = document.getElementById('homeOnlineIndicator');
  const dockOnlineCount = document.getElementById('modalOnlineCountText');
  if (!container) return;
  container.innerHTML = '';

  let onlineCount = 0;
  const currentUser = getCurrentUser();

  if (teamUsers.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:0.85rem;">ยังไม่มีสมาชิกในระบบ</div>';
    return;
  }

  teamUsers.forEach(user => {
    const presence = getPresenceStatus(user.lastActive);
    if (presence.isOnline) onlineCount++;

    const isSelf = currentUser && user.id === currentUser.id;
    const userIsAdmin = isAdmin(user);
    const userIsStaff = isStaff(user);
    const adminTag = userIsAdmin ? ' 👑' : '';

    let badgeClass = 'member';
    let badgeText = '👤 สมาชิกทั่วไป';
    if (userIsAdmin) {
      badgeClass = 'admin';
      badgeText = '👑 แอดมิน';
    } else if (userIsStaff) {
      badgeClass = 'staff';
      badgeText = '🛡️ ทีมงาน';
    }

    let adminManageBtn = '';
    if (isAdmin() && !isSelf && !userIsAdmin) {
      adminManageBtn = `
        <button type="button" class="btn-admin-manage-role" onclick="openAdminRoleModal('${user.id}')" title="ปรับยศสมาชิก">
          🎖️ ปรับยศ
        </button>
      `;
    }

    const item = document.createElement('div');
    item.className = 'member-presence-item';
    item.innerHTML = `
      <div class="member-presence-left clickable-profile" onclick="openUserProfile('${user.id}')" title="คลิกเพื่อดูโปรไฟล์">
        <div class="member-avatar-wrapper">${renderAvatarHtml(user.avatar)}<span class="status-badge-dot ${presence.isOnline ? 'online' : 'offline'}"></span></div>
        <div class="member-presence-info">
          <div class="member-presence-name-row">
            <span class="member-presence-name">${escapeHtml(user.name)}${adminTag}</span>
            <span class="member-role-badge ${badgeClass}">${badgeText}</span>
          </div>
          <div class="member-presence-status ${presence.isOnline ? 'online' : ''}">
            ${escapeHtml(presence.text)} • <span style="color:#cbd5e1;">${userIsAdmin ? '👑 แอดมิน' : escapeHtml(user.role || 'สมาชิกทั่วไป')}</span>
          </div>
        </div>
      </div>
      <div class="member-presence-actions">
        ${!isSelf ? `
          <button type="button" class="btn-dm-start" onclick="startDirectChat('${user.id}')" title="เปิดแชทส่วนตัวกับ ${escapeHtml(user.name)}">
            💬 ทักแชท
          </button>
        ` : ''}
        ${adminManageBtn}
      </div>
    `;
    container.appendChild(item);
  });

  if (homeOnlinePill) homeOnlinePill.innerText = `${onlineCount}`;
  if (dockOnlineCount) dockOnlineCount.innerText = `${onlineCount} ออนไลน์`;
}

window.startDirectChat = function(targetUserId) {
  const targetUser = teamUsers.find(u => u.id === targetUserId);
  if (!targetUser) return;

  closeModal('teamMembersModal');
  closeModal('viewProfileModal');

  window.switchAppView('chat');
  window.switchChatChannel('dm', targetUser.id);
};

// ================= PROJECT NOTES & EDIT PROFILE =================
window.openProjectNotesModal = function() {
  const currentProj = projects.find(p => p.id === activeProjectId);
  if (!currentProj) { alert('กรุณาเลือกโปรเจกต์ก่อน'); return; }
  AudioFX.click();
  document.getElementById('projectNotesContent').value = currentProj.notes || '';
  
  const infoSpan = document.getElementById('notesLastUpdatedInfo');
  if (currentProj.notesUpdatedBy) {
    infoSpan.innerText = `✏️ ${currentProj.notesUpdatedBy.name} (${currentProj.notesUpdatedBy.time})`;
  } else {
    infoSpan.innerText = '';
  }

  document.getElementById('projectNotesModal').style.display = 'flex';
};

window.handleSaveProjectNotes = async function(e) {
  e.preventDefault();
  const currentProj = projects.find(p => p.id === activeProjectId);
  if (!currentProj) return;

  const notesText = document.getElementById('projectNotesContent').value;
  const currentUser = getCurrentUser();
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  AudioFX.success();
  await updateDoc(doc(db, "projects", activeProjectId), {
    notes: notesText,
    notesUpdatedBy: currentUser ? { name: currentUser.name, avatar: currentUser.avatar, time: nowStr } : null
  });

  closeModal('projectNotesModal');
};

let pendingPasswordUpdate = null;

async function saveProfileChanges(user, updatedFields) {
  showSaveLoadingModal("กำลังบันทึกข้อมูลโปรไฟล์...", "ระบบกำลังอัปเดตข้อมูลขึ้นระบบคลาวด์");
  setSaveProgress(30);

  try {
    const oldName = user.name;
    setSaveProgress(60);
    await updateDoc(doc(db, "users", user.id), updatedFields);

    if (oldName !== updatedFields.name) {
      setSaveProgress(80);
      for (const p of projects) {
        let isChanged = false;
        let pData = { ...p };
        if (pData.createdBy && pData.createdBy.name === oldName) {
          pData.createdBy.name = updatedFields.name;
          pData.createdBy.avatar = updatedFields.avatar;
          isChanged = true;
        }
        pData.tasks = (pData.tasks || []).map(t => {
          let taskUpdated = { ...t };
          if (t.assignee === oldName) { taskUpdated.assignee = updatedFields.name; isChanged = true; }
          if (t.createdBy && t.createdBy.name === oldName) { taskUpdated.createdBy.name = updatedFields.name; taskUpdated.createdBy.avatar = updatedFields.avatar; isChanged = true; }
          if (t.updatedBy && t.updatedBy.name === oldName) { taskUpdated.updatedBy.name = updatedFields.name; taskUpdated.updatedBy.avatar = updatedFields.avatar; isChanged = true; }
          return taskUpdated;
        });
        if (isChanged) {
          await updateDoc(doc(db, "projects", p.id), pData);
        }
      }
    }

    setSaveProgress(100);
    showSaveSuccessModal("บันทึกข้อมูลสำเร็จแล้ว!", "อัปเดตโปรไฟล์ของคุณเรียบร้อย");
    AudioFX.success();

    setTimeout(() => {
      hideSaveLoadingModal();
      closeModal('editProfileModal');
      document.getElementById('editPasswordInput').value = '';
      updateCurrentUserDisplay();
    }, 900);

  } catch (err) {
    console.error("Save profile error:", err);
    hideSaveLoadingModal();
    AudioFX.delete();
    alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
  }
}

window.openEditProfileModal = function() {
  const user = getCurrentUser();
  if (!user) return;

  document.getElementById('editNameInput').value = user.name;
  document.getElementById('editEmailInput').value = user.email || '';
  document.getElementById('editRoleInput').value = user.role || '';
  document.getElementById('editBioInput').value = user.bio || '';
  document.getElementById('editPasswordInput').value = '';
  document.getElementById('editAvatarDataInput').value = user.avatar || '👤';
  document.getElementById('editBannerDataInput').value = user.banner || '';

  const preview = document.getElementById('editAvatarPreviewDisplay');
  if (user.avatar && (user.avatar.startsWith('data:image') || user.avatar.startsWith('http'))) {
    preview.innerHTML = `<img src="${user.avatar}" alt="Avatar">`;
  } else {
    preview.innerHTML = `<span>${user.avatar || '👤'}</span>`;
  }

  const bannerPreview = document.getElementById('editBannerPreviewDisplay');
  if (user.banner) {
    bannerPreview.innerHTML = `<img src="${user.banner}" alt="Cover Banner">`;
  } else {
    bannerPreview.innerHTML = `<span style="font-size: 0.85rem; color: var(--text-muted);">ไม่มีภาพหน้าปก</span>`;
  }

  const delBtn = document.getElementById('btnOpenDeleteAccountModal');
  if (delBtn) {
    delBtn.style.display = isAdmin(user) ? 'none' : 'inline-block';
  }

  renderEditAvatarPicker(user.avatar);
  document.getElementById('editProfileModal').style.display = 'flex';
};

window.handleEditProfileSubmit = async function(e) {
  e.preventDefault();
  const user = getCurrentUser();
  if (!user) return;

  const newName = document.getElementById('editNameInput').value.trim();
  const newEmail = document.getElementById('editEmailInput').value.trim().toLowerCase();
  const newRole = document.getElementById('editRoleInput').value.trim();
  const newBio = document.getElementById('editBioInput').value.trim();
  const newPassword = document.getElementById('editPasswordInput').value;
  const newAvatar = document.getElementById('editAvatarDataInput').value;
  const newBanner = document.getElementById('editBannerDataInput').value;

  if (!newName) return;

  if (newName.toLowerCase() === 'taiyoani' && !isAdmin(user)) {
    AudioFX.delete();
    alert('ไม่สามารถเปลี่ยนชื่อเป็น "TaiyoAni" ได้ เนื่องจากสงวนสิทธิ์สำหรับแอดมินเท่านั้น');
    return;
  }

  const updatedFields = {
    name: newName,
    email: newEmail || user.email,
    role: newRole || (isAdmin(user) ? 'แอดมิน' : 'สมาชิกทั่วไป'),
    bio: newBio || '',
    avatar: newAvatar || user.avatar,
    banner: newBanner || ''
  };

  if (newPassword && newPassword.trim() !== '') {
    if (newPassword.length < 4) {
      AudioFX.delete();
      alert('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร');
      return;
    }

    const registeredEmail = user.email;
    if (!registeredEmail) {
      alert('⚠️ บัญชีนี้ไม่มีอีเมลที่ผูกไว้ในระบบ ไม่สามารถส่ง OTP ได้');
      return;
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    pendingPasswordUpdate = {
      user: user,
      newPassword: newPassword,
      updatedFields: updatedFields,
      otpCode: otpCode,
      registeredEmail: registeredEmail
    };

    showSaveLoadingModal("กำลังส่งรหัส OTP...", `ส่งรหัสไปยัง ${registeredEmail}`);
    setSaveProgress(50);

    const isSent = await sendOtpEmail(
      registeredEmail,
      user.name,
      otpCode,
      "คุณได้ทำรายการขอเปลี่ยนรหัสผ่านใหม่ในหน้าแก้ไขโปรไฟล์",
      "🔐 รหัสยืนยัน OTP สำหรับเปลี่ยนรหัสผ่าน - TaiyoAni UI Hub"
    );

    hideSaveLoadingModal();

    if (isSent) {
      openChangePasswordOtpModal(registeredEmail);
    }
    return;
  }

  await saveProfileChanges(user, updatedFields);
};

function openChangePasswordOtpModal(email) {
  AudioFX.click();
  document.getElementById('pwdOtpTargetEmailDisplay').innerText = email;
  document.getElementById('pwdChangeOtpInput').value = '';
  document.getElementById('pwdChangeOtpErrorMsg').style.display = 'none';
  document.getElementById('changePasswordOtpModal').style.display = 'flex';
}

window.closeChangePasswordOtpModal = function() {
  document.getElementById('changePasswordOtpModal').style.display = 'none';
  pendingPasswordUpdate = null;
};

window.handleVerifyPasswordOtpSubmit = async function(e) {
  e.preventDefault();
  const enteredOtp = document.getElementById('pwdChangeOtpInput').value.trim();
  const errorMsg = document.getElementById('pwdChangeOtpErrorMsg');

  if (!pendingPasswordUpdate) return;

  if (enteredOtp === pendingPasswordUpdate.otpCode) {
    AudioFX.success();
    pendingPasswordUpdate.updatedFields.password = pendingPasswordUpdate.newPassword;

    const user = pendingPasswordUpdate.user;
    const fields = pendingPasswordUpdate.updatedFields;

    closeChangePasswordOtpModal();
    await saveProfileChanges(user, fields);
  } else {
    AudioFX.delete();
    errorMsg.innerText = 'รหัส OTP ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง';
    errorMsg.style.display = 'block';
  }
};

window.handleResendPasswordOtp = async function() {
  if (!pendingPasswordUpdate || !pendingPasswordUpdate.registeredEmail) return;

  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
  pendingPasswordUpdate.otpCode = newOtp;

  AudioFX.click();
  await sendOtpEmail(
    pendingPasswordUpdate.registeredEmail,
    pendingPasswordUpdate.user.name,
    newOtp,
    "คุณได้ขอรับรหัสยืนยัน OTP ใหม่สำหรับเปลี่ยนรหัสผ่าน",
    "🔐 รหัสยืนยัน OTP (ส่งซ้ำ) - TaiyoAni UI Hub"
  );
};

// ================= WORKSPACE PROJECTS & TASKS =================
window.openAddProjectModal = function() {
  document.getElementById('projTitleInput').value = '';
  document.getElementById('projDescInput').value = '';
  document.getElementById('projectModal').style.display = 'flex';
};

window.handleCreateProject = async function(e) {
  e.preventDefault();
  const name = document.getElementById('projTitleInput').value.trim();
  const desc = document.getElementById('projDescInput').value.trim();
  if (!name) return;

  AudioFX.success();
  const currentUser = getCurrentUser();
  const projId = 'proj-' + Date.now();

  const newProj = {
    id: projId,
    name,
    desc,
    notes: '',
    createdBy: currentUser ? { name: currentUser.name, avatar: currentUser.avatar } : null,
    tasks: []
  };

  await setDoc(doc(db, "projects", projId), newProj);

  await pushSystemNotification({
    type: 'project',
    title: `เปิดโปรเจกต์ใหม่: ${name}`,
    body: desc || 'เริ่มโปรเจกต์ใหม่ใน Workspace',
    authorName: currentUser ? currentUser.name : 'สมาชิก',
    authorAvatar: currentUser ? currentUser.avatar : '📁',
    linkView: 'projects'
  });

  activeProjectId = projId;
  closeModal('projectModal');
};

window.selectProject = function(id) {
  activeProjectId = id;
  renderProjects();
  if (isMobileSidebarOpen) toggleMobileSidebar();
};

window.deleteProject = async function(id) {
  if (!isAdmin()) {
    AudioFX.delete();
    alert('เฉพาะแอดมิน (TaiyoAni) เท่านั้นที่มีสิทธิ์ลบโปรเจกต์');
    return;
  }

  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบโปรเจกต์นี้และงานทั้งหมด?')) {
    AudioFX.delete();
    await deleteDoc(doc(db, "projects", id));
    if (activeProjectId === id) activeProjectId = null;
  }
};

window.openAddTaskModal = function() {
  if (!activeProjectId) { alert('กรุณาสร้างหรือเลือกโปรเจกต์ก่อน'); return; }
  populateAssigneeDropdown();
  document.getElementById('taskIdInput').value = '';
  document.getElementById('taskTitleInput').value = '';
  document.getElementById('taskStoryInput').value = '';
  document.getElementById('taskStatusInput').value = 'pending';
  document.getElementById('taskModalTitle').innerText = 'มอบหมายงานใหม่';
  document.getElementById('taskModal').style.display = 'flex';
};

window.editTask = function(taskId) {
  const currentProj = projects.find(p => p.id === activeProjectId);
  if (!currentProj) return;
  const task = currentProj.tasks.find(t => t.id === taskId);
  if (!task) return;

  const currentUser = getCurrentUser();
  const isCreator = currentUser && task.createdBy && task.createdBy.name === currentUser.name;
  if (!isAdmin() && !isCreator) {
    AudioFX.delete();
    alert('เฉพาะผู้ที่มอบหมายงานนี้ หรือ แอดมิน (TaiyoAni) เท่านั้นที่มีสิทธิ์แก้ไขงาน');
    return;
  }

  populateAssigneeDropdown();
  document.getElementById('taskIdInput').value = task.id;
  document.getElementById('taskTitleInput').value = task.title;
  document.getElementById('taskAssigneeInput').value = task.assignee;
  document.getElementById('taskStoryInput').value = task.story || '';
  document.getElementById('taskStatusInput').value = task.status || 'pending';
  document.getElementById('taskModalTitle').innerText = 'แก้ไขข้อมูลการมอบหมายงาน';
  document.getElementById('taskModal').style.display = 'flex';
};

window.handleSaveTask = async function(e) {
  e.preventDefault();
  const currentProj = projects.find(p => p.id === activeProjectId);
  if (!currentProj) return;

  const taskId = document.getElementById('taskIdInput').value;
  const title = document.getElementById('taskTitleInput').value.trim();
  const assignee = document.getElementById('taskAssigneeInput').value;
  const story = document.getElementById('taskStoryInput').value.trim();
  const status = document.getElementById('taskStatusInput').value;

  const currentUser = getCurrentUser();
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let updatedTasks = [...(currentProj.tasks || [])];

  if (taskId) {
    const taskIndex = updatedTasks.findIndex(t => t.id === taskId);
    if (taskIndex > -1) {
      const existingTask = updatedTasks[taskIndex];
      const isCreator = currentUser && existingTask.createdBy && existingTask.createdBy.name === currentUser.name;
      if (!isAdmin() && !isCreator) {
        alert('คุณไม่มีสิทธิ์แก้ไขงานนี้');
        return;
      }

      updatedTasks[taskIndex] = {
        ...existingTask,
        title, assignee, story, status,
        updatedBy: currentUser ? { name: currentUser.name, avatar: currentUser.avatar, time: nowStr } : null
      };
    }
  } else {
    updatedTasks.push({
      id: 'task-' + Date.now(),
      title, assignee, story, submissionLink: '', scriptContent: '', status, likes: 0,
      createdBy: currentUser ? { name: currentUser.name, avatar: currentUser.avatar } : null,
      updatedBy: currentUser ? { name: currentUser.name, avatar: currentUser.avatar, time: nowStr } : null
    });

    const targetUserObj = teamUsers.find(u => u.name === assignee);
    await pushSystemNotification({
      type: 'task',
      title: `มอบหมายงานใหม่: ${title}`,
      body: `ผู้รับผิดชอบ: ${assignee}`,
      authorName: currentUser ? currentUser.name : 'สมาชิก',
      authorAvatar: currentUser ? currentUser.avatar : '📋',
      targetUserId: targetUserObj ? targetUserObj.id : null,
      linkView: 'projects'
    });
  }

  AudioFX.success();
  await updateDoc(doc(db, "projects", activeProjectId), { tasks: updatedTasks });
  closeModal('taskModal');
};

window.deleteTask = async function(taskId) {
  const currentProj = projects.find(p => p.id === activeProjectId);
  if (!currentProj) return;

  const task = currentProj.tasks.find(t => t.id === taskId);
  if (!task) return;

  const currentUser = getCurrentUser();
  const isCreator = currentUser && task.createdBy && task.createdBy.name === currentUser.name;
  if (!isAdmin() && !isCreator) {
    AudioFX.delete();
    alert('เฉพาะผู้ที่สร้างรายการนี้ หรือ แอดมิน (TaiyoAni) เท่านั้นที่มีสิทธิ์ลบ');
    return;
  }

  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) {
    AudioFX.delete();
    const updatedTasks = currentProj.tasks.filter(t => t.id !== taskId);
    await updateDoc(doc(db, "projects", activeProjectId), { tasks: updatedTasks });
  }
};

window.openSubmitWorkModal = function(taskId) {
  const currentProj = projects.find(p => p.id === activeProjectId);
  if (!currentProj) return;

  const task = currentProj.tasks.find(t => t.id === taskId);
  if (!task) return;

  AudioFX.click();
  document.getElementById('submitTaskIdInput').value = task.id;
  document.getElementById('submitTaskTitleDisplay').innerText = task.title;
  document.getElementById('submitWorkLinkInput').value = task.submissionLink || '';
  document.getElementById('submitWorkStatusInput').value = 'completed';
  document.getElementById('submitWorkModal').style.display = 'flex';
};

window.handleSaveSubmission = async function(e) {
  e.preventDefault();
  const currentProj = projects.find(p => p.id === activeProjectId);
  if (!currentProj) return;

  const taskId = document.getElementById('submitTaskIdInput').value;
  const submissionLink = document.getElementById('submitWorkLinkInput').value.trim();
  const status = document.getElementById('submitWorkStatusInput').value;

  if (!submissionLink) return;

  const currentUser = getCurrentUser();
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let submittedTaskTitle = '';
  const updatedTasks = currentProj.tasks.map(t => {
    if (t.id === taskId) {
      submittedTaskTitle = t.title;
      return {
        ...t,
        submissionLink: submissionLink,
        status: status,
        updatedBy: currentUser ? { name: currentUser.name, avatar: currentUser.avatar, time: nowStr } : null
      };
    }
    return t;
  });

  AudioFX.submitWork();
  await updateDoc(doc(db, "projects", activeProjectId), { tasks: updatedTasks });

  await pushSystemNotification({
    type: 'task',
    title: `${currentUser ? currentUser.name : 'สมาชิก'} ได้ส่งงานแล้ว`,
    body: `งาน: ${submittedTaskTitle}`,
    authorName: currentUser ? currentUser.name : 'สมาชิก',
    authorAvatar: currentUser ? currentUser.avatar : '📤',
    linkView: 'projects'
  });

  closeModal('submitWorkModal');
  alert('🎉 บันทึกการส่งงานเรียบร้อยแล้ว!');
};

window.openAddIdeaModal = function() {
  if (!activeProjectId) { alert('กรุณาสร้างหรือเลือกโปรเจกต์ก่อนเสนอไอเดีย'); return; }
  document.getElementById('ideaTitleInput').value = '';
  document.getElementById('ideaStoryInput').value = '';
  document.getElementById('ideaLinkInput').value = '';
  document.getElementById('ideaModal').style.display = 'flex';
};

window.handleSaveIdea = async function(e) {
  e.preventDefault();
  const currentProj = projects.find(p => p.id === activeProjectId);
  if (!currentProj) return;

  const title = document.getElementById('ideaTitleInput').value.trim();
  const story = document.getElementById('ideaStoryInput').value.trim();
  const submissionLink = document.getElementById('ideaLinkInput').value.trim();

  AudioFX.like();
  const currentUser = getCurrentUser();
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const updatedTasks = [
    {
      id: 'idea-' + Date.now(),
      title,
      assignee: 'ทีม (ระดมความคิด)',
      story,
      submissionLink,
      scriptContent: '',
      status: 'idea',
      likes: 1,
      createdBy: currentUser ? { name: currentUser.name, avatar: currentUser.avatar } : null,
      updatedBy: currentUser ? { name: currentUser.name, avatar: currentUser.avatar, time: nowStr } : null
    },
    ...(currentProj.tasks || [])
  ];

  await updateDoc(doc(db, "projects", activeProjectId), { tasks: updatedTasks });

  await pushSystemNotification({
    type: 'task',
    title: `เสนอไอเดียใหม่: ${title}`,
    body: story,
    authorName: currentUser ? currentUser.name : 'สมาชิก',
    authorAvatar: currentUser ? currentUser.avatar : '💡',
    linkView: 'projects'
  });

  closeModal('ideaModal');
};

window.handleLikeTask = async function(taskId) {
  const currentProj = projects.find(p => p.id === activeProjectId);
  if (!currentProj) return;

  const updatedTasks = currentProj.tasks.map(t => {
    if (t.id === taskId) {
      AudioFX.like();
      return { ...t, likes: (t.likes || 0) + 1 };
    }
    return t;
  });

  await updateDoc(doc(db, "projects", activeProjectId), { tasks: updatedTasks });
};

function updateCurrentUserDisplay() {
  const user = getCurrentUser();
  if (user) {
    const userIsAdmin = isAdmin(user);
    const userIsStaff = isStaff(user);
    const adminTag = userIsAdmin ? ' 👑' : '';
    const displayRole = userIsAdmin ? '👑 แอดมิน' : (user.role || (userIsStaff ? '🛡️ ทีมงาน' : '👤 สมาชิกทั่วไป'));
    
    document.getElementById('currentAvatarDisplay').innerHTML = renderAvatarHtml(user.avatar);
    document.getElementById('currentUserNameDisplay').innerText = `${user.name}${adminTag}`;
    document.getElementById('currentUserRoleDisplay').innerText = displayRole;
    
    const homeAvatar = document.getElementById('homeUserAvatarDisplay');
    const homeName = document.getElementById('homeUserNameDisplay');
    const homeRole = document.getElementById('homeUserRoleDisplay');
    if (homeAvatar) homeAvatar.innerHTML = renderAvatarHtml(user.avatar);
    if (homeName) homeName.innerText = `${user.name}${adminTag}`;
    if (homeRole) homeRole.innerText = displayRole;

    const editRevenueBtn = document.getElementById('btnAdminEditRevenue');
    if (editRevenueBtn) editRevenueBtn.style.display = userIsAdmin ? 'inline-flex' : 'none';

    const bannerAdminBar = document.getElementById('homeBannerAdminBar');
    if (bannerAdminBar) bannerAdminBar.style.display = userIsAdmin ? 'flex' : 'none';

    const canAccessWork = userIsAdmin || userIsStaff;
    const navProjects = document.getElementById('navBtnProjects');
    const navRevenue = document.getElementById('navBtnRevenue');

    if (navProjects) navProjects.style.display = canAccessWork ? 'flex' : 'none';
    if (navRevenue) navRevenue.style.display = canAccessWork ? 'flex' : 'none';
  }
}

function populateAssigneeDropdown() {
  const select = document.getElementById('taskAssigneeInput');
  if (!select) return;
  select.innerHTML = '';
  teamUsers.forEach(user => {
    const opt = document.createElement('option');
    opt.value = user.name;
    const adminTag = isAdmin(user) ? ' 👑' : '';
    const roleText = isAdmin(user) ? 'แอดมิน' : (user.role || 'สมาชิกทั่วไป');
    opt.innerText = `${user.name}${adminTag} (${roleText})`;
    select.appendChild(opt);
  });
}

function renderProjects() {
  const list = document.getElementById('projectList');
  if (!list) return;
  list.innerHTML = '';

  if (projects.length === 0) {
    list.innerHTML = '<li style="padding:10px; color:#94a3b8; font-size:0.82rem;">ยังไม่มีโปรเจกต์</li>';
    document.getElementById('currentProjectTitle').innerText = 'ไม่มีโปรเจกต์ที่เลือก';
    document.getElementById('currentProjectDesc').innerText = 'กดปุ่มด้านล่างเพื่อเพิ่มโปรเจกต์ใหม่';
    document.getElementById('btnNewTask').style.display = 'none';
    document.getElementById('btnNewIdea').style.display = 'none';
    document.getElementById('btnNewScript').style.display = 'none';
    document.getElementById('btnProjectNotes').style.display = 'none';
    renderTasks();
    return;
  }

  document.getElementById('btnNewTask').style.display = 'inline-flex';
  document.getElementById('btnNewIdea').style.display = 'inline-flex';
  document.getElementById('btnNewScript').style.display = 'inline-flex';
  document.getElementById('btnProjectNotes').style.display = 'inline-flex';

  projects.forEach(p => {
    const li = document.createElement('li');
    li.className = `project-item ${p.id === activeProjectId ? 'active' : ''}`;
    li.onclick = () => selectProject(p.id);

    const creatorAvatar = p.createdBy ? renderAvatarHtml(p.createdBy.avatar) : '';
    const creatorName = p.createdBy ? p.createdBy.name : '';

    const deleteBtnHtml = isAdmin() 
      ? `<button type="button" class="btn-delete-proj" title="ลบโปรเจกต์ (เฉพาะแอดมิน)" onclick="event.stopPropagation(); deleteProject('${p.id}')">🗑</button>`
      : '';

    li.innerHTML = `
      <div style="overflow:hidden;">
        <div class="project-name" title="${p.name}">📁 ${escapeHtml(p.name)}</div>
        ${creatorName ? `
          <div style="font-size:0.7rem; color:#94a3b8; margin-top:2px; display:flex; align-items:center; gap:3px;">
            สร้างโดย ${creatorAvatar} <span>${escapeHtml(creatorName)}</span>
          </div>` : ''}
      </div>
      ${deleteBtnHtml}
    `;
    list.appendChild(li);
  });

  const currentProj = projects.find(p => p.id === activeProjectId);
  if (currentProj) {
    document.getElementById('currentProjectTitle').innerText = currentProj.name;
    document.getElementById('currentProjectDesc').innerText = currentProj.desc || 'จัดการงาน สตอรี่รายละเอียด และลิ้งก์ส่งงาน';
  }
  renderTasks();
}

function renderTasks() {
  const container = document.getElementById('tasksContainer');
  if (!container) return;
  container.innerHTML = '';

  const currentProj = projects.find(p => p.id === activeProjectId);
  if (!currentProj || !currentProj.tasks || currentProj.tasks.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">💡</div>
        <h3 style="color:#ffffff;">ยังไม่มีงาน ไอเดีย หรือสคริปต์ในโปรเจกต์นี้</h3>
        <p style="margin-top: 6px;">คลิกปุ่ม "📜 สร้างสคริปต์", "💡 เสนอไอเดีย" หรือ "+ มอบหมายงานใหม่" ด้านบนเพื่อเริ่มต้น</p>
      </div>
    `;
    return;
  }

  const currentUser = getCurrentUser();

  currentProj.tasks.forEach(task => {
    const isIdea = task.status === 'idea';
    const isScript = task.status === 'script';

    const pageCount = Array.isArray(task.pages) ? task.pages.length : (task.scriptContent ? 1 : 1);

    const badgeMap = {
      script: { text: `📜 สคริปต์ (${pageCount} หน้า)`, class: 'badge-script' },
      idea: { text: '💡 ไอเดีย / Concept', class: 'badge-idea' },
      pending: { text: '🟡 รอดำเนินการ', class: 'badge-pending' },
      in_progress: { text: '🔵 กำลังทำ', class: 'badge-in_progress' },
      completed: { text: '🟢 เสร็จสิ้น', class: 'badge-completed' }
    };

    const badge = badgeMap[task.status] || badgeMap.pending;
    const assigneeUser = teamUsers.find(u => u.name === task.assignee);
    const assigneeAvatar = assigneeUser ? renderAvatarHtml(assigneeUser.avatar) : '👤';
    const assigneeId = assigneeUser ? assigneeUser.id : null;

    const creatorUser = task.createdBy ? teamUsers.find(u => u.name === task.createdBy.name) : null;
    const creatorId = creatorUser ? creatorUser.id : null;

    const isCreator = currentUser && task.createdBy && task.createdBy.name === currentUser.name;
    const canManage = isAdmin(currentUser) || isCreator;

    const card = document.createElement('div');
    card.className = `task-card ${isIdea ? 'is-idea' : ''} ${isScript ? 'is-script' : ''}`;

    let labelName = '📖 รายละเอียด & สตอรี่:';
    if (isIdea) labelName = '💡 แนวคิด & รายละเอียด:';
    if (isScript) labelName = '📑 รายละเอียดสคริปต์:';

    card.innerHTML = `
      <div class="task-header-row">
        <span class="task-badge ${badge.class}">${badge.text}</span>
        ${task.createdBy ? `
          <div class="attribution-box ${creatorId ? 'clickable-profile' : ''}" ${creatorId ? `onclick="openUserProfile('${creatorId}')"` : ''} title="คลิกเพื่อดูโปรไฟล์">
            ${renderAvatarHtml(task.createdBy.avatar)}
            <span>สร้างโดย <strong>${escapeHtml(task.createdBy.name)}</strong></span>
          </div>
        ` : ''}
      </div>

      <h3 class="task-title">${escapeHtml(task.title)}</h3>
      
      <div class="task-story">
        <strong style="color:${isIdea ? '#fef08a' : (isScript ? '#e9d5ff' : '#cbd5e1')};">${labelName}</strong><br>${escapeHtml(task.story || 'ไม่มีรายละเอียดเพิ่มเติม')}
      </div>

      <div class="task-meta">
        <div class="meta-row">
          <span class="meta-label">👤 ผู้เกี่ยวข้อง:</span>
          <div class="clickable-profile" ${assigneeId ? `onclick="openUserProfile('${assigneeId}')"` : ''} style="display:flex; align-items:center; gap:6px;" title="คลิกเพื่อดูโปรไฟล์">
            ${assigneeAvatar}
            <strong style="color:#f8fafc;">${escapeHtml(task.assignee)}</strong>
          </div>
        </div>
        ${task.updatedBy ? `
          <div class="meta-row" style="font-size: 0.72rem; color: #94a3b8; gap:4px;">
            <span>✏️ อัปเดตล่าสุด:</span>
            ${renderAvatarHtml(task.updatedBy.avatar)}
            <span>${escapeHtml(task.updatedBy.name)} (${task.updatedBy.time})</span>
          </div>
        ` : ''}
      </div>

      ${task.submissionLink ? `
        <div class="drive-link-box">
          <a href="${escapeHtml(task.submissionLink)}" target="_blank" rel="noopener noreferrer">
            <span>${isIdea ? '🔗 ลิ้งก์ตัวอย่าง / Reference' : '📁 ลิ้งก์ส่งงาน (Google Drive / Cloud Link)'}</span> ↗
          </a>
        </div>
      ` : ''}

      <div class="card-actions">
        <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
          <button type="button" class="btn-like" onclick="handleLikeTask('${task.id}')" title="กดถูกใจ">
            👍 <span>${task.likes || 0}</span>
          </button>

          ${isScript ? `
            <button type="button" class="btn-open-script-card" onclick="openScriptEditor('${task.id}')" title="เปิดโปรแกรมเขียนสคริปต์">
              <span>📖</span> เปิดสคริปต์ (${pageCount} หน้า)
            </button>
          ` : ''}
          
          ${(!isIdea && !isScript) ? `
            <button type="button" class="btn-submit-work" onclick="openSubmitWorkModal('${task.id}')" title="เปิดหน้าต่างส่งงาน">
              📤 ส่งงาน
            </button>
          ` : ''}
        </div>

        <div class="card-action-group">
          ${canManage ? `
            ${!isScript ? `<button type="button" class="btn-sm" onclick="editTask('${task.id}')">✏️ แก้ไข</button>` : ''}
            <button type="button" class="btn-sm delete" onclick="deleteTask('${task.id}')">ลบ</button>
          ` : ''}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

window.closeModal = function(modalId) {
  document.getElementById(modalId).style.display = 'none';
};

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ================= FORGOT & RESET PASSWORD =================
let resetPasswordTargetUser = null;

window.openForgotPasswordModal = function() {
  AudioFX.click();
  document.getElementById('forgotStep1').style.display = 'block';
  document.getElementById('forgotStep2').style.display = 'none';
  document.getElementById('forgotEmailInput').value = '';
  document.getElementById('resetOtpCodeInput').value = '';
  document.getElementById('resetNewPasswordInput').value = '';
  document.getElementById('resetConfirmPasswordInput').value = '';
  document.getElementById('forgotErrorMsg1').style.display = 'none';
  document.getElementById('forgotErrorMsg2').style.display = 'none';
  resetPasswordTargetUser = null;
  document.getElementById('forgotPasswordModal').style.display = 'flex';
};

window.handleRequestPasswordResetOtp = async function(e) {
  e.preventDefault();
  const emailInput = document.getElementById('forgotEmailInput').value.trim().toLowerCase();
  const errorMsg1 = document.getElementById('forgotErrorMsg1');

  const matchedUser = teamUsers.find(u => u.email && u.email.toLowerCase() === emailInput);
  if (!matchedUser) {
    AudioFX.delete();
    errorMsg1.innerText = "ไม่พบบัญชีที่ผูกกับอีเมลนี้ในระบบ";
    errorMsg1.style.display = 'block';
    return;
  }

  const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
  resetPasswordTargetUser = { ...matchedUser, resetOtp };

  try {
    await updateDoc(doc(db, "users", matchedUser.id), {
      resetOtpCode: resetOtp
    });

    await sendOtpEmail(
      matchedUser.email,
      matchedUser.name,
      resetOtp,
      "คุณได้ทำรายการขอรีเซ็ตรหัสผ่านใหม่",
      "🔑 รหัส OTP สำหรับรีเซ็ตรหัสผ่าน - TaiyoAni UI Hub"
    );

    AudioFX.success();
    document.getElementById('forgotStep1').style.display = 'none';
    document.getElementById('forgotStep2').style.display = 'block';
  } catch (err) {
    console.error("Reset OTP error:", err);
    errorMsg1.innerText = "เกิดข้อผิดพลาดในการส่ง OTP กรุณาลองใหม่อีกครั้ง";
    errorMsg1.style.display = 'block';
  }
};

window.handleResetPasswordSubmit = async function(e) {
  e.preventDefault();
  const otpInput = document.getElementById('resetOtpCodeInput').value.trim();
  const newPass = document.getElementById('resetNewPasswordInput').value;
  const confirmPass = document.getElementById('resetConfirmPasswordInput').value;
  const errorMsg2 = document.getElementById('forgotErrorMsg2');

  if (!resetPasswordTargetUser) return;

  if (otpInput !== resetPasswordTargetUser.resetOtp) {
    AudioFX.delete();
    errorMsg2.innerText = "รหัส OTP ไม่ถูกต้อง กรุณาตรวจสอบอีเมลอีกครั้ง";
    errorMsg2.style.display = 'block';
    return;
  }

  if (newPass !== confirmPass) {
    AudioFX.delete();
    errorMsg2.innerText = "รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน";
    errorMsg2.style.display = 'block';
  }

  try {
    await updateDoc(doc(db, "users", resetPasswordTargetUser.id), {
      password: newPass,
      resetOtpCode: null
    });

    AudioFX.success();
    closeModal('forgotPasswordModal');
    alert("🎉 รีเซ็ตรหัสผ่านสำเร็จเรียบร้อย! คุณสามารถใช้รหัสผ่านใหม่เข้าสู่ระบบได้ทันที");
  } catch (err) {
    console.error("Save new password error:", err);
    errorMsg2.innerText = "เกิดข้อผิดพลาดในการบันทึกรหัสผ่านใหม่";
    errorMsg2.style.display = 'block';
  }
};

// ================= DELETE ACCOUNT SYSTEM =================
window.openDeleteAccountModal = function() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  if (isAdmin(currentUser)) {
    AudioFX.delete();
    alert('⚠️ บัญชีแอดมินหลัก (TaiyoAni) ไม่สามารถลบบัญชีได้');
    return;
  }

  AudioFX.click();
  document.getElementById('deleteAccountPasswordInput').value = '';
  document.getElementById('deleteAccountErrorMsg').style.display = 'none';
  document.getElementById('deleteAccountModal').style.display = 'flex';
};

window.handleConfirmDeleteAccount = async function(e) {
  e.preventDefault();
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  if (isAdmin(currentUser)) {
    AudioFX.delete();
    alert('⚠️ บัญชีแอดมินหลัก (TaiyoAni) ไม่สามารถลบบัญชีได้');
    closeModal('deleteAccountModal');
    return;
  }

  const enteredPassword = document.getElementById('deleteAccountPasswordInput').value;
  const errorMsg = document.getElementById('deleteAccountErrorMsg');

  if (enteredPassword !== currentUser.password) {
    AudioFX.delete();
    errorMsg.innerText = 'รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง';
    errorMsg.style.display = 'block';
    return;
  }

  showSaveLoadingModal("กำลังลบบัญชีผู้ใช้...", "ระบบกำลังลบข้อมูลและออกจากระบบ");
  setSaveProgress(40);

  try {
    const deletedUserId = currentUser.id;

    await deleteDoc(doc(db, "users", deletedUserId));
    setSaveProgress(75);

    try {
      let savedAccounts = JSON.parse(localStorage.getItem('taiyoani_device_accounts') || '[]');
      savedAccounts = savedAccounts.filter(a => a.id !== deletedUserId);
      localStorage.setItem('taiyoani_device_accounts', JSON.stringify(savedAccounts));
    } catch (err) {}

    localStorage.removeItem('taiyoani_active_user_id');
    currentUserId = null;

    setSaveProgress(100);
    AudioFX.delete();

    setTimeout(() => {
      hideSaveLoadingModal();
      closeModal('deleteAccountModal');
      closeModal('editProfileModal');
      closeModal('viewProfileModal');
      alert('ลบบัญชีผู้ใช้สำเร็จเรียบร้อย');
      initAuth();
    }, 700);

  } catch (err) {
    console.error("Delete account error:", err);
    hideSaveLoadingModal();
    AudioFX.delete();
    errorMsg.innerText = 'เกิดข้อผิดพลาดในการลบบัญชี: ' + (err.message || err);
    errorMsg.style.display = 'block';
  }
};

// ================= iOS DOCK DRAG & SCRUB GESTURE ENGINE =================
function initDockGestureScrubber() {
  const dock = document.querySelector('.bottom-dock-nav');
  if (!dock) return;

  let isDragging = false;
  let currentTargetBtn = null;

  function getNavItemUnderPoint(x, y) {
    const el = document.elementFromPoint(x, y);
    if (!el) return null;
    return el.closest('.bottom-nav-item');
  }

  function handleStart(e) {
    isDragging = true;
    dock.classList.add('is-scrubbing');
    handleMove(e);
  }

  function handleMove(e) {
    if (!isDragging) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const hoveredItem = getNavItemUnderPoint(clientX, clientY);

    if (hoveredItem && hoveredItem !== currentTargetBtn) {
      if (currentTargetBtn) {
        currentTargetBtn.classList.remove('is-scrub-hovered');
      }
      currentTargetBtn = hoveredItem;
      currentTargetBtn.classList.add('is-scrub-hovered');

      AudioFX.click();
      if ('vibrate' in navigator) navigator.vibrate(8);
    }
  }

  function handleEnd() {
    if (!isDragging) return;
    isDragging = false;
    dock.classList.remove('is-scrubbing');

    if (currentTargetBtn) {
      currentTargetBtn.classList.remove('is-scrub-hovered');
      
      const btnId = currentTargetBtn.id;
      const viewMap = {
        navBtnHome: 'home',
        navBtnCommunity: 'community',
        navBtnProjects: 'projects',
        navBtnRevenue: 'revenue',
        navBtnChat: 'chat'
      };

      const targetView = viewMap[btnId];
      if (targetView) {
        window.switchAppView(targetView);
      }
      currentTargetBtn = null;
    }
  }

  dock.addEventListener('touchstart', handleStart, { passive: false });
  window.addEventListener('touchmove', handleMove, { passive: false });
  window.addEventListener('touchend', handleEnd);
  window.addEventListener('touchcancel', handleEnd);

  dock.addEventListener('mousedown', (e) => {
    if (e.button === 0) handleStart(e);
  });
  window.addEventListener('mousemove', handleMove);
  window.addEventListener('mouseup', handleEnd);
}

window.addEventListener('beforeunload', () => {
  if (isUserInVoiceRoom && activeVoiceRoomId) {
    leaveVoiceRoom();
  }
});

document.addEventListener('click', () => { requestNotificationPermission(); }, { once: true });

initAuth();
