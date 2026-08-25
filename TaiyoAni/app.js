// ================= FIREBASE SDK IMPORTS (CDN) =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getFirestore, collection, doc, setDoc, getDocs, 
  onSnapshot, query, orderBy, addDoc, deleteDoc, updateDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBsf2pAoaT0OB9cgMBksB2igZGp7y4yWAI",
  authDomain: "taiyoani.firebaseapp.com",
  projectId: "taiyoani",
  storageBucket: "taiyoani.firebasestorage.app",
  messagingSenderId: "900402723577",
  appId: "1:900402723577:web:90c5b93dcac66ea7930028",
  measurementId: "G-J76JT5GJJY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================= EMAIL CONFIGURATION (EmailJS) =================
const EMAILJS_PUBLIC_KEY = "";
const EMAILJS_SERVICE_ID = "";
const EMAILJS_TEMPLATE_ID = "";

if (EMAILJS_PUBLIC_KEY && window.emailjs) {
  window.emailjs.init(EMAILJS_PUBLIC_KEY);
}

async function sendOtpEmail(targetEmail, userName, otpCode) {
  if (EMAILJS_PUBLIC_KEY && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && window.emailjs) {
    try {
      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: targetEmail,
        to_name: userName,
        otp_code: otpCode,
        system_name: "TaiyoAni UI Hub"
      });
    } catch (err) {
      console.warn("EmailJS sending failed:", err);
    }
  } else {
    alert(`[ระบบจำลองส่งเมลไปยัง: ${targetEmail}]\n\nรหัสยืนยัน OTP 6 หลักของคุณคือ: ${otpCode}`);
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
  if (e.target.closest('button') || e.target.closest('.avatar-opt') || e.target.closest('.project-item')) {
    AudioFX.click();
  }
});

// ================= APP STATES =================
const AVATAR_PRESETS = ['👨‍💻', '👩‍💻', '🐱', '🦊', '🚀', '🎨', '🎬', '⚡', '🐉', '✨'];
let teamUsers = [];
let projects = [];
let chatMessages = [];
let dmChatMessages = [];
let currentUserId = localStorage.getItem('taiyoani_active_user_id') || null;
let activeProjectId = null;
let isChatOpen = false;
let isMembersPanelOpen = false;
let initialChatLoadDone = false;
let pendingVerificationUser = null;

let activeChatMode = 'team';
let activeDmTargetUser = null;
let dmUnsubscribe = null;

function getCurrentUser() {
  return teamUsers.find(u => u && u.id === currentUserId) || null;
}

function isAdmin(user = getCurrentUser()) {
  if (!user || !user.name) return false;
  return user.name.trim().toLowerCase() === 'taiyoani';
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
  if (!lastActive) {
    return { isOnline: false, text: 'ออฟไลน์นานแล้ว' };
  }
  const lastTime = lastActive.toDate ? lastActive.toDate().getTime() : (typeof lastActive === 'number' ? lastActive : new Date(lastActive).getTime());
  const diffMs = Date.now() - lastTime;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 2) {
    return { isOnline: true, text: '🟢 กำลังออนไลน์' };
  } else if (diffMin < 60) {
    return { isOnline: false, text: `ออฟไลน์เมื่อ ${diffMin} นาทีที่แล้ว` };
  } else if (diffMin < 1440) {
    const diffHr = Math.floor(diffMin / 60);
    return { isOnline: false, text: `ออฟไลน์เมื่อ ${diffHr} ชม. ที่แล้ว` };
  } else {
    const diffDay = Math.floor(diffMin / 1440);
    return { isOnline: false, text: `ออฟไลน์เมื่อ ${diffDay} วันที่แล้ว` };
  }
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

  const chatQuery = query(collection(db, "chats"), orderBy("timestamp", "asc"));
  onSnapshot(chatQuery, (snapshot) => {
    const newChats = [];
    snapshot.forEach(doc => newChats.push({ id: doc.id, ...doc.data() }));

    if (initialChatLoadDone && activeChatMode === 'team' && newChats.length > chatMessages.length) {
      const lastMsg = newChats[newChats.length - 1];
      if (lastMsg && lastMsg.senderId !== currentUserId) {
        AudioFX.newIncomingMsg();
      }
    }
    initialChatLoadDone = true;
    chatMessages = newChats;
    if (activeChatMode === 'team') {
      renderChatMessages();
      scrollChatToBottom();
    }
  });
}

// ================= AUTH GATEKEEPER & OTP VERIFICATION =================
function initAuth() {
  startRealtimeSync();
  
  if (currentUserId) {
    document.getElementById('authGate').style.display = 'none';
    document.getElementById('mainAppLayout').style.display = 'flex';
    updateCurrentUserDisplay();
    startHeartbeat();
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

function populateLoginUserSelect() {
  const select = document.getElementById('loginUserSelect');
  if (!select) return;
  select.innerHTML = '';

  if (teamUsers.length === 0) {
    select.innerHTML = '<option value="">ยังไม่มีบัญชีในระบบ (กรุณาสมัครสมาชิกใหม่)</option>';
    return;
  }

  teamUsers.forEach(u => {
    const opt = document.createElement('option');
    opt.value = u.id;
    const adminTag = (u.name.trim().toLowerCase() === 'taiyoani') ? ' 👑 (Admin)' : '';
    const verifyStatus = u.isVerified ? '' : ' [⚠️ ยังไม่ยืนยันอีเมล]';
    opt.innerText = `${u.name}${adminTag}${verifyStatus} (${u.role || 'Member'})`;
    select.appendChild(opt);
  });
}

window.handleLoginSelectChange = function() {
  document.getElementById('loginPasswordInput').value = '';
  document.getElementById('loginErrorMsg').style.display = 'none';
};

window.handleLoginSubmit = async function(e) {
  e.preventDefault();
  const userId = document.getElementById('loginUserSelect').value;
  const password = document.getElementById('loginPasswordInput').value;
  const errorMsg = document.getElementById('loginErrorMsg');

  const targetUser = teamUsers.find(u => u.id === userId);
  if (!targetUser) return;

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
    document.getElementById('authGate').style.display = 'none';
    document.getElementById('mainAppLayout').style.display = 'flex';
    document.getElementById('loginPasswordInput').value = '';
    updateCurrentUserDisplay();
    renderProjects();
    startHeartbeat();
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
  const password = document.getElementById('regPasswordInput').value;
  const confirmPassword = document.getElementById('regConfirmPasswordInput').value;
  const avatarData = document.getElementById('authAvatarDataInput').value || '👨‍💻';
  const errorMsg = document.getElementById('regErrorMsg');

  const nameLower = name.toLowerCase();
  if (nameLower === 'taiyoani') {
    const existingAdmin = teamUsers.find(u => u.name.trim().toLowerCase() === 'taiyoani');
    if (existingAdmin) {
      AudioFX.delete();
      errorMsg.innerText = 'ชื่อผู้ใช้ "TaiyoAni" สงวนสิทธิ์สำหรับแอดมิน (Creator) เท่านั้น';
      errorMsg.style.display = 'block';
      return;
    }
    role = 'Creator (Admin)';
  }

  const emailExists = teamUsers.find(u => u.email && u.email.toLowerCase() === email);
  if (emailExists) {
    AudioFX.delete();
    errorMsg.innerText = 'อีเมลนี้ถูกใช้งานในระบบแล้ว กรุณาใช้อีเมลอื่น';
    errorMsg.style.display = 'block';
    return;
  }

  if (password !== confirmPassword) {
    AudioFX.delete();
    errorMsg.innerText = 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน';
    errorMsg.style.display = 'block';
    return;
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const userId = 'user-' + Date.now();

  const newUser = {
    id: userId,
    name,
    email,
    role: role || 'ลูกทีม',
    avatar: avatarData,
    password: password,
    isVerified: false,
    otpCode: otpCode,
    lastActive: serverTimestamp()
  };

  await setDoc(doc(db, "users", userId), newUser);
  await sendOtpEmail(email, name, otpCode);

  pendingVerificationUser = newUser;
  openOtpVerificationModal(newUser);
};

function openOtpVerificationModal(user) {
  document.getElementById('otpCodeInput').value = '';
  document.getElementById('otpErrorMsg').style.display = 'none';

  if (user.email) {
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

    closeOtpModal();
    document.getElementById('authGate').style.display = 'none';
    document.getElementById('mainAppLayout').style.display = 'flex';
    document.getElementById('loginPasswordInput').value = '';
    updateCurrentUserDisplay();
    renderProjects();
    startHeartbeat();
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

window.handleForgetSelectedAccount = async function() {
  const select = document.getElementById('loginUserSelect');
  const userId = select.value;
  if (!userId) return;

  const targetUser = teamUsers.find(u => u.id === userId);
  if (!targetUser) return;

  const adminUser = teamUsers.find(u => u.name.trim().toLowerCase() === 'taiyoani');
  if (!adminUser) {
    alert('ยังไม่มีบัญชีแอดมิน TaiyoAni ในระบบ');
    return;
  }

  const adminPass = prompt(`[สิทธิ์แอดมินเท่านั้น]\nกรุณากรอกรหัสผ่านของ TaiyoAni (Admin) เพื่อยืนยันการลบบัญชี "${targetUser.name}" ออกจากระบบ:`);
  if (!adminPass) return;

  if (adminUser.password !== adminPass) {
    AudioFX.delete();
    alert('รหัสผ่านแอดมินไม่ถูกต้อง ไม่อนุญาตให้ลบบัญชี');
    return;
  }

  if (confirm(`ยืนยันการลบบัญชี "${targetUser.name}" ออกจากระบบอย่างถาวร?`)) {
    AudioFX.delete();
    await deleteDoc(doc(db, "users", userId));
    if (currentUserId === userId) {
      currentUserId = null;
      localStorage.removeItem('taiyoani_active_user_id');
    }
    AudioFX.success();
    alert(`ลบบัญชี "${targetUser.name}" สำเร็จ`);
  }
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

// ================= MEMBERS PRESENCE PANEL =================
window.toggleMembersPanel = function() {
  AudioFX.click();
  isMembersPanelOpen = !isMembersPanelOpen;
  const panel = document.getElementById('membersPresencePanel');
  if (panel) {
    panel.classList.toggle('open', isMembersPanelOpen);
    if (isMembersPanelOpen) renderMembersPresenceList();
  }
};

document.addEventListener('click', (e) => {
  const panel = document.getElementById('membersPresencePanel');
  const btn = document.getElementById('btnMembersToggle');
  if (panel && isMembersPanelOpen && !panel.contains(e.target) && !btn.contains(e.target)) {
    isMembersPanelOpen = false;
    panel.classList.remove('open');
  }
});

function renderMembersPresenceList() {
  const container = document.getElementById('membersPresenceList');
  const counterPill = document.getElementById('onlineIndicatorCounter');
  if (!container) return;
  container.innerHTML = '';

  let onlineCount = 0;
  const currentUser = getCurrentUser();

  teamUsers.forEach(user => {
    const presence = getPresenceStatus(user.lastActive);
    if (presence.isOnline) onlineCount++;

    const isSelf = currentUser && user.id === currentUser.id;
    const adminTag = isAdmin(user) ? ' 👑' : '';

    const item = document.createElement('div');
    item.className = 'member-presence-item';
    item.innerHTML = `
      <div class="member-presence-left">
        <div class="member-avatar-wrapper">
          ${renderAvatarHtml(user.avatar)}
          <span class="status-badge-dot ${presence.isOnline ? 'online' : 'offline'}"></span>
        </div>
        <div class="member-presence-info">
          <div class="member-presence-name">
            ${escapeHtml(user.name)}${adminTag} ${isSelf ? '<span style="color:var(--text-muted); font-size:0.75rem;">(คุณ)</span>' : ''}
          </div>
          <div class="member-presence-status ${presence.isOnline ? 'online' : ''}">
            ${escapeHtml(presence.text)}
          </div>
        </div>
      </div>
      <div>
        ${!isSelf ? `
          <button type="button" class="btn-dm-start" onclick="startDirectChat('${user.id}')" title="เปิดแชทส่วนตัวกับ ${escapeHtml(user.name)}">
            💬 ทักแชท
          </button>
        ` : ''}
      </div>
    `;
    container.appendChild(item);
  });

  if (counterPill) {
    counterPill.innerText = `${onlineCount} ออนไลน์`;
  }
}

// ================= DIRECT MESSAGING =================
window.startDirectChat = function(targetUserId) {
  const targetUser = teamUsers.find(u => u.id === targetUserId);
  if (!targetUser) return;

  activeChatMode = 'dm';
  activeDmTargetUser = targetUser;

  isMembersPanelOpen = false;
  const panel = document.getElementById('membersPresencePanel');
  if (panel) panel.classList.remove('open');

  isChatOpen = true;
  const chatWin = document.getElementById('chatWindow');
  if (chatWin) chatWin.classList.add('open');

  document.getElementById('btnChatBackToTeam').style.display = 'inline-block';
  document.getElementById('chatHeaderTitleText').innerText = `🔒 แชทส่วนตัว: ${targetUser.name}`;
  document.getElementById('dmStatusBanner').style.display = 'flex';
  document.getElementById('dmTargetNameDisplay').innerText = targetUser.name;
  document.getElementById('btnClearChat').style.display = 'none';

  const currentUid = currentUserId || 'guest';
  const roomId = [currentUid, targetUser.id].sort().join('_');

  if (dmUnsubscribe) dmUnsubscribe();

  const dmQuery = query(collection(db, "direct_chats", roomId, "messages"), orderBy("timestamp", "asc"));
  dmUnsubscribe = onSnapshot(dmQuery, (snapshot) => {
    dmChatMessages = [];
    snapshot.forEach(doc => dmChatMessages.push({ id: doc.id, ...doc.data() }));
    if (activeChatMode === 'dm') {
      renderChatMessages();
      scrollChatToBottom();
    }
  });

  document.getElementById('chatTextInput').focus();
};

window.switchToTeamChat = function() {
  AudioFX.click();
  activeChatMode = 'team';
  activeDmTargetUser = null;

  if (dmUnsubscribe) {
    dmUnsubscribe();
    dmUnsubscribe = null;
  }

  document.getElementById('btnChatBackToTeam').style.display = 'none';
  document.getElementById('chatHeaderTitleText').innerText = '💬 ห้องพูดคุยทีม (Team Chat)';
  document.getElementById('dmStatusBanner').style.display = 'none';
  
  const clearChatBtn = document.getElementById('btnClearChat');
  if (clearChatBtn) {
    clearChatBtn.style.display = isAdmin() ? 'inline-block' : 'none';
  }

  renderChatMessages();
  scrollChatToBottom();
};

// ================= PROJECT NOTES =================
window.openProjectNotesModal = function() {
  const currentProj = projects.find(p => p.id === activeProjectId);
  if (!currentProj) {
    alert('กรุณาเลือกโปรเจกต์ก่อน');
    return;
  }
  AudioFX.click();
  document.getElementById('projectNotesContent').value = currentProj.notes || '';
  
  const infoSpan = document.getElementById('notesLastUpdatedInfo');
  if (currentProj.notesUpdatedBy) {
    infoSpan.innerText = `✏️ แก้ไขล่าสุดโดย ${currentProj.notesUpdatedBy.name} (${currentProj.notesUpdatedBy.time})`;
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

// ================= EDIT PROFILE MODAL =================
window.openEditProfileModal = function() {
  const user = getCurrentUser();
  if (!user) return;

  document.getElementById('editNameInput').value = user.name;
  document.getElementById('editEmailInput').value = user.email || '';
  document.getElementById('editRoleInput').value = user.role || '';
  document.getElementById('editPasswordInput').value = '';
  document.getElementById('editAvatarDataInput').value = user.avatar || '👤';

  const preview = document.getElementById('editAvatarPreviewDisplay');
  if (user.avatar && (user.avatar.startsWith('data:image') || user.avatar.startsWith('http'))) {
    preview.innerHTML = `<img src="${user.avatar}" alt="Avatar">`;
  } else {
    preview.innerHTML = `<span>${user.avatar || '👤'}</span>`;
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
  const newPassword = document.getElementById('editPasswordInput').value;
  const newAvatar = document.getElementById('editAvatarDataInput').value;

  if (!newName) return;

  if (newName.toLowerCase() === 'taiyoani' && !isAdmin(user)) {
    AudioFX.delete();
    alert('ไม่สามารถเปลี่ยนชื่อเป็น "TaiyoAni" ได้ เนื่องจากสงวนสิทธิ์สำหรับแอดมินเท่านั้น');
    return;
  }

  AudioFX.success();
  const oldName = user.name;
  const updatedFields = {
    name: newName,
    email: newEmail,
    role: newRole || (isAdmin(user) ? 'Creator (Admin)' : 'ลูกทีม'),
    avatar: newAvatar || user.avatar
  };

  if (newPassword && newPassword.trim() !== '') {
    updatedFields.password = newPassword;
  }

  await updateDoc(doc(db, "users", user.id), updatedFields);

  if (oldName !== newName) {
    projects.forEach(async (p) => {
      let isChanged = false;
      let pData = { ...p };
      if (pData.createdBy && pData.createdBy.name === oldName) {
        pData.createdBy.name = newName;
        pData.createdBy.avatar = updatedFields.avatar;
        isChanged = true;
      }
      pData.tasks = (pData.tasks || []).map(t => {
        let taskUpdated = { ...t };
        if (t.assignee === oldName) { taskUpdated.assignee = newName; isChanged = true; }
        if (t.createdBy && t.createdBy.name === oldName) { taskUpdated.createdBy.name = newName; taskUpdated.createdBy.avatar = updatedFields.avatar; isChanged = true; }
        if (t.updatedBy && t.updatedBy.name === oldName) { taskUpdated.updatedBy.name = newName; taskUpdated.updatedBy.avatar = updatedFields.avatar; isChanged = true; }
        return taskUpdated;
      });
      if (isChanged) {
        await updateDoc(doc(db, "projects", p.id), pData);
      }
    });
  }

  closeModal('editProfileModal');
  updateCurrentUserDisplay();
};

// ================= WORKSPACE ACTIONS (PROJECT & TASKS) =================
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
  activeProjectId = projId;
  closeModal('projectModal');
};

window.selectProject = function(id) {
  activeProjectId = id;
  renderProjects();
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
  if (!activeProjectId) {
    alert('กรุณาสร้างหรือเลือกโปรเจกต์ก่อน');
    return;
  }
  populateAssigneeDropdown();
  document.getElementById('taskIdInput').value = '';
  document.getElementById('taskTitleInput').value = '';
  document.getElementById('taskStoryInput').value = '';
  document.getElementById('taskSubmissionInput').value = '';
  document.getElementById('taskStatusInput').value = 'pending';
  document.getElementById('taskModalTitle').innerText = 'มอบหมายงานใหม่';
  document.getElementById('taskModal').style.display = 'flex';
};

window.editTask = function(taskId) {
  const currentProj = projects.find(p => p.id === activeProjectId);
  if (!currentProj) return;
  const task = currentProj.tasks.find(t => t.id === taskId);
  if (!task) return;

  populateAssigneeDropdown();
  document.getElementById('taskIdInput').value = task.id;
  document.getElementById('taskTitleInput').value = task.title;
  document.getElementById('taskAssigneeInput').value = task.assignee;
  document.getElementById('taskStoryInput').value = task.story || '';
  document.getElementById('taskSubmissionInput').value = task.submissionLink || '';
  document.getElementById('taskStatusInput').value = task.status || 'pending';
  document.getElementById('taskModalTitle').innerText = 'แก้ไขข้อมูลงาน / ไอเดีย';
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
  const submissionLink = document.getElementById('taskSubmissionInput').value.trim();
  const status = document.getElementById('taskStatusInput').value;

  AudioFX.success();
  const currentUser = getCurrentUser();
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let updatedTasks = [...(currentProj.tasks || [])];

  if (taskId) {
    const taskIndex = updatedTasks.findIndex(t => t.id === taskId);
    if (taskIndex > -1) {
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        title, assignee, story, submissionLink, status,
        updatedBy: currentUser ? { name: currentUser.name, avatar: currentUser.avatar, time: nowStr } : null
      };
    }
  } else {
    updatedTasks.push({
      id: 'task-' + Date.now(),
      title, assignee, story, submissionLink, status, likes: 0,
      createdBy: currentUser ? { name: currentUser.name, avatar: currentUser.avatar } : null,
      updatedBy: currentUser ? { name: currentUser.name, avatar: currentUser.avatar, time: nowStr } : null
    });
  }

  await updateDoc(doc(db, "projects", activeProjectId), { tasks: updatedTasks });
  closeModal('taskModal');
};

window.deleteTask = async function(taskId) {
  const currentProj = projects.find(p => p.id === activeProjectId);
  if (!currentProj) return;

  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) {
    AudioFX.delete();
    const updatedTasks = currentProj.tasks.filter(t => t.id !== taskId);
    await updateDoc(doc(db, "projects", activeProjectId), { tasks: updatedTasks });
  }
};

window.openAddIdeaModal = function() {
  if (!activeProjectId) {
    alert('กรุณาสร้างหรือเลือกโปรเจกต์ก่อนเสนอไอเดีย');
    return;
  }
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
      status: 'idea',
      likes: 1,
      createdBy: currentUser ? { name: currentUser.name, avatar: currentUser.avatar } : null,
      updatedBy: currentUser ? { name: currentUser.name, avatar: currentUser.avatar, time: nowStr } : null
    },
    ...(currentProj.tasks || [])
  ];

  await updateDoc(doc(db, "projects", activeProjectId), { tasks: updatedTasks });
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

// ================= TEAM CHAT LOGIC =================
window.toggleChatWindow = function() {
  AudioFX.click();
  isChatOpen = !isChatOpen;
  const chatWin = document.getElementById('chatWindow');
  if (chatWin) {
    chatWin.classList.toggle('open', isChatOpen);
    if (isChatOpen) {
      scrollChatToBottom();
      document.getElementById('chatTextInput').focus();
    }
  }
};

window.handleSendChatMessage = async function(e) {
  e.preventDefault();
  const input = document.getElementById('chatTextInput');
  const text = input.value.trim();
  if (!text) return;

  const currentUser = getCurrentUser();
  if (!currentUser) return;

  AudioFX.sendChat();
  input.value = '';

  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (activeChatMode === 'team') {
    await addDoc(collection(db, "chats"), {
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: text,
      time: nowStr,
      timestamp: serverTimestamp()
    });
  } else if (activeChatMode === 'dm' && activeDmTargetUser) {
    const roomId = [currentUser.id, activeDmTargetUser.id].sort().join('_');
    await addDoc(collection(db, "direct_chats", roomId, "messages"), {
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      receiverId: activeDmTargetUser.id,
      text: text,
      time: nowStr,
      timestamp: serverTimestamp()
    });
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
  const counter = document.getElementById('chatBadgeCounter');
  if (counter) counter.innerText = chatMessages.length;
  if (!body) return;

  body.innerHTML = '';
  const currentUser = getCurrentUser();
  const msgsToRender = activeChatMode === 'dm' ? dmChatMessages : chatMessages;

  if (msgsToRender.length === 0) {
    body.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); font-size: 0.82rem; margin-top: 40px;">
        ${activeChatMode === 'dm' ? '🔒 ยังไม่มีข้อความคุยส่วนตัว เริ่มทักทายได้เลย!' : '💬 ยังไม่มีข้อความในห้องทีม'}
      </div>
    `;
    return;
  }

  msgsToRender.forEach(msg => {
    const isMine = currentUser && msg.senderId === currentUser.id;
    const row = document.createElement('div');
    row.className = `chat-message-row ${isMine ? 'is-mine' : ''}`;

    row.innerHTML = `
      <div class="chat-msg-avatar">${renderAvatarHtml(msg.senderAvatar)}</div>
      <div class="chat-msg-content">
        <div class="chat-msg-author">${escapeHtml(msg.senderName)}</div>
        <div class="chat-msg-bubble">${escapeHtml(msg.text)}</div>
        <div class="chat-msg-time">${escapeHtml(msg.time || '')}</div>
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

// ================= RENDER WORKSPACE UI =================
function updateCurrentUserDisplay() {
  const user = getCurrentUser();
  if (user) {
    const adminTag = isAdmin(user) ? ' 👑' : '';
    document.getElementById('currentAvatarDisplay').innerHTML = renderAvatarHtml(user.avatar);
    document.getElementById('currentUserNameDisplay').innerText = `${user.name}${adminTag}`;
    document.getElementById('currentUserRoleDisplay').innerText = user.role || (isAdmin(user) ? 'Creator (Admin)' : 'สมาชิกทีม');
    
    const clearChatBtn = document.getElementById('btnClearChat');
    if (clearChatBtn && activeChatMode === 'team') {
      clearChatBtn.style.display = isAdmin(user) ? 'inline-block' : 'none';
    }
  }
}

function populateAssigneeDropdown() {
  const select = document.getElementById('taskAssigneeInput');
  if (!select) return;
  select.innerHTML = '';
  teamUsers.forEach(user => {
    const opt = document.createElement('option');
    opt.value = user.name;
    const adminTag = (user.name.trim().toLowerCase() === 'taiyoani') ? ' 👑' : '';
    opt.innerText = `${user.name}${adminTag} (${user.role || 'Member'})`;
    select.appendChild(opt);
  });
}

function renderProjects() {
  const list = document.getElementById('projectList');
  if (!list) return;
  list.innerHTML = '';

  if (projects.length === 0) {
    list.innerHTML = '<li style="padding:12px; color:#94a3b8; font-size:0.85rem;">ยังไม่มีโปรเจกต์</li>';
    document.getElementById('currentProjectTitle').innerText = 'ไม่มีโปรเจกต์ที่เลือก';
    document.getElementById('currentProjectDesc').innerText = 'กดปุ่มด้านล่างเพื่อเพิ่มโปรเจกต์ใหม่';
    document.getElementById('btnNewTask').style.display = 'none';
    document.getElementById('btnNewIdea').style.display = 'none';
    document.getElementById('btnProjectNotes').style.display = 'none';
    renderTasks();
    return;
  }

  document.getElementById('btnNewTask').style.display = 'inline-flex';
  document.getElementById('btnNewIdea').style.display = 'inline-flex';
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
          <div style="font-size:0.72rem; color:#94a3b8; margin-top:3px; display:flex; align-items:center; gap:4px;">
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
        <h3 style="color:#ffffff;">ยังไม่มีงานหรือไอเดียในโปรเจกต์นี้</h3>
        <p style="margin-top: 6px;">คลิกปุ่ม "💡 เสนอไอเดีย" หรือ "+ มอบหมายงานใหม่" ด้านบนเพื่อเริ่มแชร์ความคิดเห็น</p>
      </div>
    `;
    return;
  }

  currentProj.tasks.forEach(task => {
    const isIdea = task.status === 'idea';
    const badgeMap = {
      idea: { text: '💡 ไอเดีย / Concept', class: 'badge-idea' },
      pending: { text: '🟡 รอดำเนินการ', class: 'badge-pending' },
      in_progress: { text: '🔵 กำลังทำ', class: 'badge-in_progress' },
      completed: { text: '🟢 เสร็จสิ้น', class: 'badge-completed' }
    };

    const badge = badgeMap[task.status] || badgeMap.pending;
    const assigneeUser = teamUsers.find(u => u.name === task.assignee);
    const assigneeAvatar = assigneeUser ? renderAvatarHtml(assigneeUser.avatar) : '👤';

    const card = document.createElement('div');
    card.className = `task-card ${isIdea ? 'is-idea' : ''}`;

    card.innerHTML = `
      <div class="task-header-row">
        <span class="task-badge ${badge.class}">${badge.text}</span>
        ${task.createdBy ? `
          <div class="attribution-box" title="ผู้เสนอไอเดีย/มอบหมายงานนี้">
            ${renderAvatarHtml(task.createdBy.avatar)}
            <span>เสนอโดย <strong>${escapeHtml(task.createdBy.name)}</strong></span>
          </div>
        ` : ''}
      </div>

      <h3 class="task-title">${escapeHtml(task.title)}</h3>
      
      <div class="task-story">
        <strong style="color:${isIdea ? '#fef08a' : '#cbd5e1'};">${isIdea ? '💡 แนวคิด & รายละเอียด:' : '📖 รายละเอียด & สตอรี่:'}</strong><br>${escapeHtml(task.story || 'ไม่มีรายละเอียดเพิ่มเติม')}
      </div>

      <div class="task-meta">
        <div class="meta-row">
          <span class="meta-label">👤 ผู้รับผิดชอบ:</span>
          <div style="display:flex; align-items:center; gap:6px;">
            ${assigneeAvatar}
            <strong style="color:#f8fafc;">${escapeHtml(task.assignee)}</strong>
          </div>
        </div>
        ${task.updatedBy ? `
          <div class="meta-row" style="font-size: 0.75rem; color: #94a3b8; gap:4px;">
            <span>✏️ อัปเดตล่าสุด:</span>
            ${renderAvatarHtml(task.updatedBy.avatar)}
            <span>${escapeHtml(task.updatedBy.name)} (${task.updatedBy.time})</span>
          </div>
        ` : ''}
      </div>

      <!-- ลิ้งก์ Drive / Cloud Storage / Reference -->
      ${task.submissionLink ? `
        <div class="drive-link-box">
          <a href="${escapeHtml(task.submissionLink)}" target="_blank" rel="noopener noreferrer">
            <span>${isIdea ? '🔗 ลิ้งก์ตัวอย่าง / Reference' : '📁 ลิ้งก์ส่งงาน (Google Drive / Cloud Link)'}</span> ↗
          </a>
        </div>
      ` : ''}

      <div class="card-actions">
        <button type="button" class="btn-like" onclick="handleLikeTask('${task.id}')" title="กดถูกใจ / สนับสนุนไอเดียนี้">
          👍 <span>${task.likes || 0}</span>
        </button>
        <div class="card-action-group">
          <button type="button" class="btn-sm" onclick="editTask('${task.id}')">✏️ แก้ไข</button>
          <button type="button" class="btn-sm delete" onclick="deleteTask('${task.id}')">ลบ</button>
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

initAuth();