// ================= FIREBASE SDK IMPORTS (CDN) =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getFirestore, collection, doc, setDoc, getDocs, 
  onSnapshot, query, orderBy, addDoc, deleteDoc, updateDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsf2pAoaT0OB9cgMBksB2igZGp7y4yWAI",
  authDomain: "taiyoani.firebaseapp.com",
  projectId: "taiyoani",
  storageBucket: "taiyoani.firebasestorage.app",
  messagingSenderId: "900402723577",
  appId: "1:900402723577:web:90c5b93dcac66ea7930028",
  measurementId: "G-J76JT5GJJY"
};

// Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================= WEB AUDIO API (ระบบเสียงในตัว) =================
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
let currentUserId = localStorage.getItem('taiyoani_active_user_id') || null;
let activeProjectId = null;
let isChatOpen = false;
let initialChatLoadDone = false;

function getCurrentUser() {
  return teamUsers.find(u => u && u.id === currentUserId) || null;
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

// ================= REAL-TIME FIRESTORE LISTENERS =================
function startRealtimeSync() {
  // ซิงค์รายชื่อสมาชิก
  onSnapshot(collection(db, "users"), (snapshot) => {
    teamUsers = [];
    snapshot.forEach(doc => teamUsers.push(doc.data()));
    populateLoginUserSelect();
    populateAssigneeDropdown();
    updateCurrentUserDisplay();
  });

  // ซิงค์โปรเจกต์และงาน
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

  // ซิงค์แชททีม
  const chatQuery = query(collection(db, "chats"), orderBy("timestamp", "asc"));
  onSnapshot(chatQuery, (snapshot) => {
    const newChats = [];
    snapshot.forEach(doc => newChats.push({ id: doc.id, ...doc.data() }));

    if (initialChatLoadDone && newChats.length > chatMessages.length) {
      const lastMsg = newChats[newChats.length - 1];
      if (lastMsg && lastMsg.senderId !== currentUserId) {
        AudioFX.newIncomingMsg();
      }
    }
    initialChatLoadDone = true;
    chatMessages = newChats;
    renderChatMessages();
    scrollChatToBottom();
  });
}

// ================= AUTH GATEKEEPER =================
function initAuth() {
  startRealtimeSync();
  
  if (currentUserId) {
    document.getElementById('authGate').style.display = 'none';
    document.getElementById('mainAppLayout').style.display = 'flex';
    updateCurrentUserDisplay();
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
    opt.innerText = `${u.name} (${u.role || 'Member'})`;
    select.appendChild(opt);
  });
}

window.handleLoginSelectChange = function() {
  document.getElementById('loginPasswordInput').value = '';
  document.getElementById('loginErrorMsg').style.display = 'none';
};

window.handleLoginSubmit = function(e) {
  e.preventDefault();
  const userId = document.getElementById('loginUserSelect').value;
  const password = document.getElementById('loginPasswordInput').value;
  const errorMsg = document.getElementById('loginErrorMsg');

  const targetUser = teamUsers.find(u => u.id === userId);
  if (!targetUser) return;

  if (targetUser.password === password) {
    AudioFX.success();
    currentUserId = targetUser.id;
    localStorage.setItem('taiyoani_active_user_id', currentUserId);
    document.getElementById('authGate').style.display = 'none';
    document.getElementById('mainAppLayout').style.display = 'flex';
    document.getElementById('loginPasswordInput').value = '';
    updateCurrentUserDisplay();
    renderProjects();
  } else {
    AudioFX.delete();
    errorMsg.innerText = 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง';
    errorMsg.style.display = 'block';
  }
};

window.handleRegisterSubmit = async function(e) {
  e.preventDefault();
  const name = document.getElementById('regNameInput').value.trim();
  const role = document.getElementById('regRoleInput').value.trim();
  const password = document.getElementById('regPasswordInput').value;
  const confirmPassword = document.getElementById('regConfirmPasswordInput').value;
  const avatarData = document.getElementById('authAvatarDataInput').value || '👨‍💻';
  const errorMsg = document.getElementById('regErrorMsg');

  if (password !== confirmPassword) {
    AudioFX.delete();
    errorMsg.innerText = 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน';
    errorMsg.style.display = 'block';
    return;
  }

  const userId = 'user-' + Date.now();
  const newUser = {
    id: userId,
    name,
    role: role || 'ลูกทีม',
    avatar: avatarData,
    password: password
  };

  await setDoc(doc(db, "users", userId), newUser);

  AudioFX.success();
  currentUserId = userId;
  localStorage.setItem('taiyoani_active_user_id', currentUserId);

  document.getElementById('authGate').style.display = 'none';
  document.getElementById('mainAppLayout').style.display = 'flex';
  updateCurrentUserDisplay();
  renderProjects();
};

window.handleForgetSelectedAccount = async function() {
  const select = document.getElementById('loginUserSelect');
  const userId = select.value;
  if (!userId) return;

  const user = teamUsers.find(u => u.id === userId);
  if (!user) return;

  if (confirm(`คุณต้องการลบข้อมูลบัญชี "${user.name}" ออกจากระบบใช่หรือไม่?`)) {
    AudioFX.delete();
    await deleteDoc(doc(db, "users", userId));
    if (currentUserId === userId) {
      currentUserId = null;
      localStorage.removeItem('taiyoani_active_user_id');
    }
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
  if (confirm('คุณต้องการลบโปรเจกต์นี้และงานทั้งหมดหรือไม่?')) {
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

// ================= TEAM CHAT LOGIC (FIRESTORE) =================
window.toggleChatWindow = function() {
  AudioFX.click();
  isChatOpen = !isChatOpen;
  const chatWin = document.getElementById('chatWindow');
  if (chatWin) {
    if (isChatOpen) {
      chatWin.classList.add('open');
      scrollChatToBottom();
      document.getElementById('chatTextInput').focus();
    } else {
      chatWin.classList.remove('open');
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

  await addDoc(collection(db, "chats"), {
    senderId: currentUser.id,
    senderName: currentUser.name,
    senderAvatar: currentUser.avatar,
    text: text,
    time: nowStr,
    timestamp: serverTimestamp()
  });
};

window.handleClearChat = async function() {
  if (confirm('คุณต้องการล้างประวัติแชททั้งหมดหรือไม่?')) {
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

  chatMessages.forEach(msg => {
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
    document.getElementById('currentAvatarDisplay').innerHTML = renderAvatarHtml(user.avatar);
    document.getElementById('currentUserNameDisplay').innerText = user.name;
    document.getElementById('currentUserRoleDisplay').innerText = user.role || 'สมาชิกทีม';
  }
}

function populateAssigneeDropdown() {
  const select = document.getElementById('taskAssigneeInput');
  if (!select) return;
  select.innerHTML = '';
  teamUsers.forEach(user => {
    const opt = document.createElement('option');
    opt.value = user.name;
    opt.innerText = `${user.name} (${user.role || 'Member'})`;
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
    renderTasks();
    return;
  }

  document.getElementById('btnNewTask').style.display = 'inline-flex';
  document.getElementById('btnNewIdea').style.display = 'inline-flex';

  projects.forEach(p => {
    const li = document.createElement('li');
    li.className = `project-item ${p.id === activeProjectId ? 'active' : ''}`;
    li.onclick = () => selectProject(p.id);

    const creatorAvatar = p.createdBy ? renderAvatarHtml(p.createdBy.avatar) : '';
    const creatorName = p.createdBy ? p.createdBy.name : '';

    li.innerHTML = `
      <div style="overflow:hidden;">
        <div class="project-name" title="${p.name}">📁 ${escapeHtml(p.name)}</div>
        ${creatorName ? `
          <div style="font-size:0.72rem; color:#94a3b8; margin-top:3px; display:flex; align-items:center; gap:4px;">
            สร้างโดย ${creatorAvatar} <span>${escapeHtml(creatorName)}</span>
          </div>` : ''}
      </div>
      <button type="button" class="btn-delete-proj" title="ลบโปรเจกต์" onclick="event.stopPropagation(); deleteProject('${p.id}')">🗑</button>
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

      ${task.submissionLink ? `
        <div class="drive-link-box">
          <a href="${escapeHtml(task.submissionLink)}" target="_blank" rel="noopener noreferrer">
            <span>${isIdea ? '🔗 ลิ้งก์ตัวอย่าง / Reference' : '📁 ลิ้งก์ส่งงาน (Google Drive)'}</span> ↗
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

// เริ่มต้นระบบ
initAuth();