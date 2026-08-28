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
  if (e.target.closest('button') || e.target.closest('.avatar-opt') || e.target.closest('.project-item') || e.target.closest('.word-tool-btn') || e.target.closest('.emoji-btn-opt') || e.target.closest('.community-filter-pill')) {
    AudioFX.click();
  }
});

// ================= APP STATES =================
const AVATAR_PRESETS = ['👨‍💻', '👩‍💻', '🐱', '🦊', '🚀', '🎨', '🎬', '⚡', '🐉', '✨'];
const EMOJI_LIST = ['😀', '😂', '😍', '😎', '🥳', '🔥', '🎉', '👍', '❤️', '✨', '🎬', '🎨', '🚀', '💡', '🙌', '💯', '⭐', '☕', '🐱', '🌸', '👏', '💬', '👀', '📌'];
const MAX_PAGES = 50;

let teamUsers = [];
let projects = [];
let communityPosts = [];
let chatMessages = [];
let dmChatMessages = [];
let currentUserId = localStorage.getItem('taiyoani_active_user_id') || null;
let activeProjectId = null;
let isMobileSidebarOpen = false;
let initialChatLoadDone = false;
let pendingVerificationUser = null;

let activeCommunityFilter = 'all';
let communitySearchQuery = '';

// Discord Chat States
let activeChatMode = 'team'; // 'team' | 'dm' | 'group'
let activeDmTargetUser = null;
let activeGroupId = null;
let activeGroupData = null;
let groupChats = [];
let groupUnsubscribe = null;
let groupChatMessages = [];
let dmUnsubscribe = null;
let selectedChatImageBase64 = null;

// Voice Call & Hardware States
let isVoiceCallActive = false;
let isVoiceMuted = false;
let voiceCallTimerInterval = null;
let voiceCallSeconds = 0;
let callRingtoneInterval = null;
let activeCallDocId = null;
let currentPeerConnection = null;
let localVoiceStream = null;
let incomingCallData = null;

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

// ================= SECTION VIEW ROUTER WITH ACCESS CONTROL =================
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
    renderCommunityPosts();
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

// ================= LIVE CLOCK SYSTEM FOR HOME =================
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

    const timeEl = document.getElementById('homeClockTimeDisplay');
    const dateEl = document.getElementById('homeClockDateDisplay');
    if (timeEl) timeEl.innerText = timeStr;
    if (dateEl) dateEl.innerText = dateStr;
  }
  updateClock();
  setInterval(updateClock, 1000);
}

window.openTeamMembersModal = function() {
  AudioFX.click();
  renderMembersPresenceList();
  document.getElementById('teamMembersModal').style.display = 'flex';
};

// ================= COMMUNITY HUB SYSTEM (IG STYLE) =================
let openCommentPostIds = new Set();

window.openCommunityPostModal = function() {
  AudioFX.click();
  document.getElementById('communityCategorySelect').value = 'idea';
  document.getElementById('communityTitleInput').value = '';
  document.getElementById('communityContentInput').value = '';
  document.getElementById('communityTagsInput').value = '';
  document.getElementById('communityPostModal').style.display = 'flex';
};

window.handleCreateCommunityPost = async function(e) {
  e.preventDefault();
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const category = document.getElementById('communityCategorySelect').value;
  const title = document.getElementById('communityTitleInput').value.trim();
  const content = document.getElementById('communityContentInput').value.trim();
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
  closeModal('communityPostModal');
};

window.filterCommunity = function(category) {
  AudioFX.click();
  activeCommunityFilter = category;
  document.querySelectorAll('.community-filter-pill').forEach(btn => btn.classList.remove('active'));
  
  const pills = document.querySelectorAll('.community-filter-pill');
  pills.forEach(pill => {
    if (pill.getAttribute('onclick')?.includes(`'${category}'`)) {
      pill.classList.add('active');
    }
  });

  renderCommunityPosts();
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
  }
};

window.togglePostComments = function(postId) {
  AudioFX.click();
  if (openCommentPostIds.has(postId)) {
    openCommentPostIds.delete(postId);
  } else {
    openCommentPostIds.add(postId);
  }
  renderCommunityPosts();
};

window.handleAddComment = async function(postId, event) {
  event.preventDefault();
  const currentUser = getCurrentUser();
  if (!currentUser) {
    alert('กรุณาเข้าสู่ระบบก่อนแสดงความคิดเห็น');
    return;
  }

  const inputEl = document.getElementById(`igCommentInput-${postId}`);
  if (!inputEl) return;
  const text = inputEl.value.trim();
  if (!text) return;

  const post = communityPosts.find(p => p.id === postId);
  if (!post) return;

  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const newComment = {
    id: 'cm-' + Date.now(),
    text: text,
    authorId: currentUser.id,
    authorName: currentUser.name,
    authorAvatar: currentUser.avatar,
    authorRole: isAdmin(currentUser) ? 'แอดมิน' : (currentUser.role || 'สมาชิกทั่วไป'),
    time: nowStr
  };

  const currentComments = Array.isArray(post.comments) ? [...post.comments] : [];
  currentComments.push(newComment);

  AudioFX.sendChat();
  inputEl.value = '';
  openCommentPostIds.add(postId);

  await updateDoc(doc(db, "community_posts", postId), {
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

function renderCommunityPosts() {
  const feed = document.getElementById('communityPostsFeed');
  if (!feed) return;
  feed.innerHTML = '';

  const currentUser = getCurrentUser();
  let filtered = [...communityPosts];

  if (activeCommunityFilter !== 'all') {
    filtered = filtered.filter(p => p.category === activeCommunityFilter);
  }

  if (communitySearchQuery.trim() !== '') {
    const queryLower = communitySearchQuery.toLowerCase();
    filtered = filtered.filter(p => 
      (p.title && p.title.toLowerCase().includes(queryLower)) ||
      (p.content && p.content.toLowerCase().includes(queryLower)) ||
      (p.authorName && p.authorName.toLowerCase().includes(queryLower)) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(queryLower)))
    );
  }

  if (filtered.length === 0) {
    feed.innerHTML = `
      <div style="text-align: center; padding: 46px 16px; color: var(--text-muted);">
        <div style="font-size: 2.8rem; margin-bottom: 8px;">💡</div>
        <h4 style="color: #ffffff; font-size: 1.05rem;">ยังไม่มีกระทู้ในหมวดนี้</h4>
        <p style="font-size: 0.82rem; margin-top: 4px;">คลิกปุ่ม "✨ ตั้งกระทู้ / เสนอไอเดีย" ด้านบนเพื่อเริ่มแลกเปลี่ยนความคิดเห็น!</p>
      </div>
    `;
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
    const isAuthor = currentUser && post.authorId === currentUser.id;
    const isPostAdmin = post.authorRole === 'แอดมิน' || (post.authorName && post.authorName.toLowerCase() === 'taiyoani');
    const canDelete = isAdmin(currentUser) || isAuthor;
    const commentsList = Array.isArray(post.comments) ? post.comments : [];
    const isCommentOpen = openCommentPostIds.has(post.id);

    const card = document.createElement('div');
    card.className = 'community-post-card';
    card.innerHTML = `
      <div class="ig-post-header">
        <div class="ig-author-wrapper">
          <div class="ig-avatar-ring clickable-profile" onclick="openUserProfile('${post.authorId}')" title="ดูโปรไฟล์">
            <div class="ig-avatar-inner">
              ${renderAvatarHtml(post.authorAvatar)}
            </div>
          </div>
          <div class="ig-author-meta">
            <div class="ig-author-name clickable-profile" onclick="openUserProfile('${post.authorId}')">
              ${escapeHtml(post.authorName)} ${isPostAdmin ? '👑' : ''}
            </div>
            <span class="ig-post-time">${escapeHtml(post.time || '')}</span>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 6px;">
          <span class="post-category-tag ${catInfo.class}">${catInfo.text}</span>
          ${canDelete ? `
            <button type="button" class="btn-delete-comment" onclick="deleteCommunityPost('${post.id}')" title="ลบโพสต์" style="font-size: 0.9rem; padding: 2px 4px;">✕</button>
          ` : ''}
        </div>
      </div>

      <div class="ig-post-body">
        <h3 class="ig-post-title">${escapeHtml(post.title)}</h3>
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
          <button type="button" class="ig-btn-icon" onclick="togglePostComments('${post.id}')" title="ความคิดเห็น">
            <span>💬</span>
          </button>
          ${!isAuthor ? `
            <button type="button" class="ig-btn-icon" onclick="startDirectChat('${post.authorId}')" title="ส่งข้อความส่วนตัว (DM)">
              <span>✈️</span>
            </button>
          ` : ''}
        </div>
        <div class="ig-likes-text">
          ถูกใจ ${post.likes || 0} คน
        </div>
      </div>

      ${isCommentOpen ? `
        <div class="ig-comments-drawer">
          <div class="ig-comments-list">
            ${commentsList.length === 0 ? `
              <div style="font-size: 0.76rem; color: var(--text-muted); text-align: center; padding: 6px;">
                ยังไม่มีความคิดเห็น มาร่วมแสดงความคิดเห็นคนแรกเลย!
              </div>
            ` : commentsList.map(c => {
                const isMine = currentUser && c.authorId === currentUser.id;
                const canDel = isAdmin(currentUser) || isMine;
                return `
                  <div class="ig-comment-row">
                    <div class="ig-comment-avatar clickable-profile" onclick="openUserProfile('${c.authorId}')">
                      ${renderAvatarHtml(c.authorAvatar)}
                    </div>
                    <div class="ig-comment-content">
                      <div>
                        <span class="ig-comment-user clickable-profile" onclick="openUserProfile('${c.authorId}')">
                          ${escapeHtml(c.authorName)}${c.authorRole === 'แอดมิน' ? ' 👑' : ''}
                        </span>
                        <span class="ig-comment-text">${escapeHtml(c.text)}</span>
                      </div>
                      <div class="ig-comment-footer">
                        <span>${escapeHtml(c.time || '')}</span>
                        ${canDel ? `<button type="button" class="btn-delete-comment" onclick="handleDeleteComment('${post.id}', '${c.id}')">ลบ</button>` : ''}
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
          </div>

          <form class="ig-comment-input-bar" onsubmit="handleAddComment('${post.id}', event)">
            <input type="text" id="igCommentInput-${post.id}" class="ig-comment-input" placeholder="เพิ่มความคิดเห็นในชื่อ ${escapeHtml(currentUser ? currentUser.name : 'คุณ')}..." autocomplete="off" required>
            <button type="submit" class="btn-ig-submit-comment">โพสต์</button>
          </form>
        </div>
      ` : ''}
    `;
    feed.appendChild(card);
  });
}

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

function updateDiscordChatHeader(mode, titleName = '') {
  const prefixEl = document.getElementById('discordHeaderPrefix');
  const titleEl = document.getElementById('discordChatHeaderTitle');
  const descEl = document.getElementById('discordChatHeaderDesc');
  const callBtn = document.getElementById('btnVoiceCall');
  const clearBtn = document.getElementById('btnClearChat');

  if (mode === 'team') {
    if (prefixEl) prefixEl.innerText = '#';
    if (titleEl) titleEl.innerText = 'ห้องแชทรวมทีม (Main Chat)';
    if (descEl) descEl.innerText = 'พื้นที่พูดคุยรวมทุกคนในทีม (ไม่รองรับการโทร)';
    if (callBtn) callBtn.style.display = 'none';
    if (clearBtn) clearBtn.style.display = isAdmin() ? 'inline-flex' : 'none';
  } else if (mode === 'dm') {
    if (prefixEl) prefixEl.innerText = '@';
    if (titleEl) titleEl.innerText = titleName;
    if (descEl) descEl.innerText = 'แชทส่วนตัว 1-on-1 (รองรับการโทรเสียง)';
    if (callBtn) callBtn.style.display = 'inline-flex';
    if (clearBtn) clearBtn.style.display = 'none';
  } else if (mode === 'group') {
    if (prefixEl) prefixEl.innerText = '👥';
    if (titleEl) titleEl.innerText = titleName;
    if (descEl) descEl.innerText = 'กลุ่มแชทส่วนตัว (รองรับการโทรเสียงประจำกลุ่ม)';
    if (callBtn) callBtn.style.display = 'inline-flex';
    if (clearBtn) clearBtn.style.display = 'none';
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

// ================= MESSAGE SEND & RENDER =================
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
  } else if (activeChatMode === 'dm' && activeDmTargetUser) {
    const roomId = [currentUser.id, activeDmTargetUser.id].sort().join('_');
    await addDoc(collection(db, "direct_chats", roomId, "messages"), {
      ...payload,
      receiverId: activeDmTargetUser.id
    });
  } else if (activeChatMode === 'group' && activeGroupId) {
    await addDoc(collection(db, "group_chats", activeGroupId, "messages"), payload);
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
    let emptyNotice = '💬 ยังไม่มีข้อความในห้องแชทหลัก';
    if (activeChatMode === 'dm') emptyNotice = `🔒 ยังไม่มีข้อความคุยกับ ${activeDmTargetUser?.name || 'สมาชิก'} เริ่มทักทายได้เลย!`;
    if (activeChatMode === 'group') emptyNotice = `👥 ยังไม่มีข้อความในกลุ่ม ${activeGroupData?.name || ''} เริ่มเปิดบทสนทนาเลย!`;
    body.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; margin-top: 40px;">${emptyNotice}</div>`;
    return;
  }

  msgsToRender.forEach(msg => {
    const isMine = currentUser && msg.senderId === currentUser.id;
    const row = document.createElement('div');
    row.className = `chat-message-row ${isMine ? 'is-mine' : ''}`;

    let imageAttachmentHtml = '';
    if (msg.image) {
      imageAttachmentHtml = `
        <div class="chat-attached-image-box" onclick="openLightboxImage('${msg.image}')" title="คลิกเพื่อดูรูปภาพขนาดเต็ม">
          <img src="${msg.image}" alt="รูปภาพแนบ">
        </div>
      `;
    }

    row.innerHTML = `
      <div class="chat-msg-avatar clickable-profile" onclick="openUserProfile('${msg.senderId}')" title="คลิกเพื่อดูโปรไฟล์">${renderAvatarHtml(msg.senderAvatar)}</div>
      <div class="chat-msg-content">
        <div class="chat-msg-author clickable-profile" onclick="openUserProfile('${msg.senderId}')">${escapeHtml(msg.senderName)}</div>
        <div class="chat-msg-bubble">
          ${msg.text ? `<div>${escapeHtml(msg.text)}</div>` : ''}
          ${imageAttachmentHtml}
        </div>
        <div class="chat-msg-time">${escapeHtml(msg.time || '')}</div>
      </div>
    `;
    body.appendChild(row);
  });
}

function scrollChatToBottom() {
  const body = document.getElementById('chatMessagesBody');
  if (body) {
    setTimeout(() => { 
      body.scrollTop = body.scrollHeight; 
    }, 60);
  }
}

// ================= REAL-TIME WEBRTC VOICE CALL SYSTEM =================
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

  if (activeChatMode === 'team') {
    alert('ห้องแชทรวมหลักไม่รองรับการโทรเสียง กรุณาสร้างกลุ่มหรือทักแชทส่วนตัวเพื่อโทรคุย');
    return;
  }

  let callTargetName = '';
  let callAvatar = '';
  let callReceiverId = '';

  if (activeChatMode === 'dm' && activeDmTargetUser) {
    callTargetName = activeDmTargetUser.name;
    callAvatar = activeDmTargetUser.avatar;
    callReceiverId = activeDmTargetUser.id;
  } else if (activeChatMode === 'group' && activeGroupData) {
    callTargetName = `กลุ่ม: ${activeGroupData.name}`;
    callAvatar = '👥';
    callReceiverId = activeGroupData.id;
  }

  openVoiceCallUI(callTargetName, callAvatar);

  const callDocRef = await addDoc(collection(db, "voice_calls"), {
    callerId: currentUser.id,
    callerName: currentUser.name,
    callerAvatar: currentUser.avatar,
    receiverId: callReceiverId,
    receiverName: callTargetName,
    isGroupCall: (activeChatMode === 'group'),
    status: 'ringing',
    timestamp: serverTimestamp()
  });

  activeCallDocId = callDocRef.id;

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

  if (localVoiceStream) {
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

// ================= AUDIO HARDWARE & SETTINGS =================
window.openSettingsModal = async function() {
  AudioFX.click();
  document.getElementById('settingsModal').style.display = 'flex';
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
    localStorage.setItem('taiyoani_audio_output_id', outputSelect.value);
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
    if (statusText) statusText.innerText = '🟢 ไมค์กำลังทำงาน: ลองพูดเพื่อดูความดังของเสียง';

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
    alert("ไม่สามารถเข้าถึงไมโครโฟนได้ กรุณาตรวจสอบการอนุญาตใช้งานไมค์ในเบราว์เซอร์");
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

// ================= ADMIN ROLE MANAGEMENT SYSTEM =================
window.openAdminRoleModal = function(userId) {
  if (!isAdmin()) {
    AudioFX.delete();
    alert('เฉพาะแอดมิน (TaiyoAni) เท่านั้นที่มีสิทธิ์ปรับยศสมาชิก');
    return;
  }

  const user = teamUsers.find(u => u.id === userId);
  if (!user) return;

  AudioFX.click();
  closeModal('teamMembersModal');
  closeModal('viewProfileModal');

  document.getElementById('adminTargetUserId').value = user.id;
  document.getElementById('adminTargetUserName').innerText = user.name;
  document.getElementById('adminTargetUserCurrentRole').innerText = `ยศปัจจุบัน: ${isAdmin(user) ? 'แอดมิน' : (user.role || 'สมาชิกทั่วไป')}`;
  document.getElementById('adminTargetUserAvatar').innerHTML = renderAvatarHtml(user.avatar);

  const isUserStaff = isStaff(user) && !isAdmin(user);
  document.getElementById('adminRoleSelect').value = isUserStaff ? 'ทีมงาน' : 'สมาชิกทั่วไป';
  document.getElementById('adminRoleCustomInput').value = user.customRole || user.role || '';

  document.getElementById('adminRoleModal').style.display = 'flex';
};

window.handleAdminRoleSelectChange = function() {
  const selectVal = document.getElementById('adminRoleSelect').value;
  const customInput = document.getElementById('adminRoleCustomInput');
  if (selectVal === 'สมาชิกทั่วไป' && (!customInput.value || customInput.value.includes('ทีมงาน'))) {
    customInput.value = 'สมาชิกทั่วไป';
  } else if (selectVal === 'ทีมงาน' && (!customInput.value || customInput.value.includes('สมาชิกทั่วไป'))) {
    customInput.value = 'ทีมงาน';
  }
};

window.handleSaveUserRoleSubmit = async function(e) {
  e.preventDefault();
  if (!isAdmin()) {
    alert('เฉพาะแอดมินเท่านั้นที่มีสิทธิ์เปลี่ยนยศ');
    return;
  }

  const targetUserId = document.getElementById('adminTargetUserId').value;
  const selectedRank = document.getElementById('adminRoleSelect').value;
  const customRole = document.getElementById('adminRoleCustomInput').value.trim();

  const finalRole = customRole || (selectedRank === 'ทีมงาน' ? 'ทีมงาน' : 'สมาชิกทั่วไป');

  closeModal('adminRoleModal');
  showSaveLoadingModal("กำลังบันทึกการเปลี่ยนยศ...", "กรุณารอสักครู่ ระบบกำลังอัปเดตข้อมูลขึ้นระบบคลาวด์");
  setSaveProgress(40);

  try {
    await updateDoc(doc(db, "users", targetUserId), {
      role: finalRole,
      rankType: selectedRank,
      customRole: customRole
    });

    setSaveProgress(100);
    showSaveSuccessModal("ปรับยศสมาชิกสำเร็จ!", `เปลี่ยนยศเป็น "${finalRole}" เรียบร้อยแล้ว`);
    AudioFX.success();

    setTimeout(() => {
      hideSaveLoadingModal();
      updateCurrentUserDisplay();
      renderMembersPresenceList();
    }, 900);
  } catch (err) {
    console.error("Change role error:", err);
    hideSaveLoadingModal();
    AudioFX.delete();
    alert("เกิดข้อผิดพลาดในการบันทึกยศ กรุณาลองใหม่อีกครั้ง");
  }
};

// ================= VIEW PROFILE & BIO SYSTEM =================
window.openUserProfile = function(userId) {
  const user = teamUsers.find(u => u.id === userId);
  if (!user) return;

  closeModal('teamMembersModal');
  AudioFX.click();

  const isSelf = currentUserId && user.id === currentUserId;
  const userIsAdmin = isAdmin(user);
  const adminTag = userIsAdmin ? ' 👑 (Admin)' : '';
  const presence = getPresenceStatus(user.lastActive);
  const displayRole = userIsAdmin ? '👑 แอดมิน' : (user.role || (isStaff(user) ? '🛡️ ทีมงาน' : '👤 สมาชิกทั่วไป'));

  const bannerContainer = document.getElementById('viewProfileBannerDisplay');
  if (bannerContainer) {
    if (user.banner) {
      bannerContainer.innerHTML = `<img src="${escapeHtml(user.banner)}" alt="Cover Banner">`;
    } else {
      bannerContainer.innerHTML = '';
    }
  }

  document.getElementById('viewProfileAvatarDisplay').innerHTML = renderAvatarHtml(user.avatar);
  document.getElementById('viewProfileNameDisplay').innerText = `${user.name}${adminTag}`;
  document.getElementById('viewProfileRoleDisplay').innerText = displayRole;
  document.getElementById('viewProfileStatusDisplay').innerHTML = `<span style="color: ${presence.isOnline ? '#6ee7b7' : '#94a3b8'}">${presence.text}</span>`;
  document.getElementById('viewProfileEmailDisplay').innerText = user.email || 'ไม่ได้ระบุ';
  document.getElementById('viewProfileBioDisplay').innerText = user.bio && user.bio.trim() !== '' ? user.bio : 'ผู้ใช้นี้ยังไม่ได้ระบุคำแนะนำตัว';

  const actionsContainer = document.getElementById('viewProfileActionsContainer');
  let adminBtnHtml = '';
  if (isAdmin() && !isSelf && !userIsAdmin) {
    adminBtnHtml = `
      <button type="button" class="btn-admin-manage-role" onclick="openAdminRoleModal('${user.id}')">
        🎖️ ปรับยศสมาชิก (Admin)
      </button>
    `;
  }

  if (isSelf) {
    actionsContainer.innerHTML = `
      <button type="button" class="btn-create-task" onclick="closeModal('viewProfileModal'); openEditProfileModal();">
        ✏️ แก้ไขข้อมูลโปรไฟล์ของคุณ
      </button>
    `;
  } else {
    actionsContainer.innerHTML = `
      <button type="button" class="btn-dm-start" style="padding: 8px 18px; font-size: 0.85rem;" onclick="closeModal('viewProfileModal'); startDirectChat('${user.id}');">
        💬 ส่งข้อความส่วนตัว (DM)
      </button>
      ${adminBtnHtml}
    `;
  }

  document.getElementById('viewProfileModal').style.display = 'flex';
};

window.openCurrentUserProfile = function() {
  if (currentUserId) {
    window.openUserProfile(currentUserId);
  }
};

// ================= CHAT EMOJI & IMAGE ATTACHMENT =================
function renderChatEmojiPicker() {
  const container = document.getElementById('chatEmojiPickerPopover');
  if (!container) return;
  container.innerHTML = '';

  EMOJI_LIST.forEach(emoji => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'emoji-btn-opt';
    btn.innerText = emoji;
    btn.onclick = () => {
      const input = document.getElementById('chatTextInput');
      input.value += emoji;
      input.focus();
      container.style.display = 'none';
    };
    container.appendChild(btn);
  });
}

window.toggleChatEmojiPicker = function() {
  AudioFX.click();
  const picker = document.getElementById('chatEmojiPickerPopover');
  if (picker) {
    const isShown = picker.style.display === 'grid';
    picker.style.display = isShown ? 'none' : 'grid';
  }
};

document.addEventListener('click', (e) => {
  const picker = document.getElementById('chatEmojiPickerPopover');
  const btn = document.getElementById('btnChatEmojiToggle');
  if (picker && picker.style.display === 'grid') {
    if (!picker.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
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

// ================= SAVE LOADING MODAL CONTROLLERS =================
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
  if (!lastActive) {
    return { isOnline: false, text: 'ออฟไลน์นานแล้ว' };
  }
  const lastTime = lastActive.toDate ? lastActive.toDate().getTime() : (typeof lastActive === 'number' ? lastActive : new Date(lastActive).getTime());
  const diffMs = Date.now() - lastTime;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 2) {
    return { isOnline: true, text: '🟢 ออนไลน์' };
  } else if (diffMin < 60) {
    return { isOnline: false, text: `${diffMin} น. ที่แล้ว` };
  } else if (diffMin < 1440) {
    const diffHr = Math.floor(diffMin / 60);
    return { isOnline: false, text: `${diffHr} ชม. ที่แล้ว` };
  } else {
    const diffDay = Math.floor(diffMin / 1440);
    return { isOnline: false, text: `${diffDay} วันที่แล้ว` };
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
    renderDiscordSidebarChannels();
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

  const communityQuery = query(collection(db, "community_posts"), orderBy("timestamp", "desc"));
  onSnapshot(communityQuery, (snapshot) => {
    communityPosts = [];
    snapshot.forEach(doc => communityPosts.push({ id: doc.id, ...doc.data() }));
    renderCommunityPosts();
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
    if (revenueData.updatedTime) {
      badge.innerText = `อัปเดตล่าสุด: ${revenueData.updatedTime} โดย ${revenueData.updatedBy || 'แอดมิน'}`;
    } else {
      badge.innerText = `อัปเดตล่าสุด: พร้อมใช้งาน`;
    }
  }

  const transferDateEl = document.getElementById('revenueTransferDateDisplay');
  const transferDetailsEl = document.getElementById('revenueTransferDetailsDisplay');
  const statusBadgeEl = document.getElementById('revenueTransferStatusBadge');
  const payerEl = document.getElementById('revenuePayerDisplay');

  if (transferDateEl) {
    transferDateEl.innerText = (revenueData.transferDate && revenueData.transferDate.trim() !== '') 
      ? revenueData.transferDate 
      : 'ยังไม่ได้กำหนดวันที่';
  }

  if (transferDetailsEl) {
    transferDetailsEl.innerText = (revenueData.transferDetails && revenueData.transferDetails.trim() !== '')
      ? revenueData.transferDetails
      : 'ยังไม่มีข้อความชี้แจงการโอนเงินจากแอดมิน';
  }

  if (payerEl) {
    payerEl.innerText = `${revenueData.updatedBy || 'TaiyoAni'} (Admin)`;
  }

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
    voice,
    animation,
    audio,
    other,
    note,
    transferDate,
    transferStatus,
    transferDetails,
    updatedBy: currentUser ? currentUser.name : 'TaiyoAni',
    updatedTime: nowStr,
    timestamp: serverTimestamp()
  });

  closeModal('revenueModal');
};

// ================= NEW SCRIPT CREATION =================
window.openNewScriptModal = function() {
  if (!activeProjectId) {
    alert('กรุณาสร้างหรือเลือกโปรเจกต์ก่อนสร้างสคริปต์');
    return;
  }
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
  
  closeModal('newScriptModal');
  openScriptEditor(scriptId);
};

// ================= MULTI-PAGE WORD SCRIPT EDITOR =================
window.execWordCmd = function(command, value = null) {
  document.getElementById('wordPaperEditor').focus();
  document.execCommand(command, false, value);
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
  if (currentScriptPages.length >= MAX_PAGES) {
    alert(`ไม่สามารถเพิ่มหน้าได้เกิน ${MAX_PAGES} หน้า`);
    return;
  }
  AudioFX.pageFlip();
  saveCurrentPageBuffer();
  currentScriptPages.push('');
  activePageIndex = currentScriptPages.length - 1;
  loadPageContent();
};

window.deleteCurrentPage = function() {
  if (currentScriptPages.length <= 1) {
    alert('ต้องมีสคริปต์อย่างน้อย 1 หน้า');
    return;
  }
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
  if (!isAdmin() && !isCreator) {
    alert('คุณไม่มีสิทธิ์แก้ไขสคริปต์นี้');
    return;
  }

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

// ================= AUTH GATEKEEPER =================
function initAuth() {
  initDeviceMode();
  initAppView();
  startLiveClock();
  renderChatEmojiPicker();
  startRealtimeSync();
  startIncomingCallListener();
  
  const searchInput = document.getElementById('communitySearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      communitySearchQuery = e.target.value;
      renderCommunityPosts();
    });
  }

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
    const adminTag = isAdmin(u) ? ' 👑 (Admin)' : '';
    const verifyStatus = u.isVerified ? '' : ' [⚠️ ยังไม่ยืนยันอีเมล]';
    const roleText = isAdmin(u) ? 'แอดมิน' : (u.role || 'สมาชิกทั่วไป');
    opt.innerText = `${u.name}${adminTag}${verifyStatus} (${roleText})`;
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
  const bio = document.getElementById('regBioInput').value.trim();
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
    role = 'แอดมิน';
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

// ================= MEMBERS PRESENCE RENDERING =================
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
        <div class="member-avatar-wrapper">
          ${renderAvatarHtml(user.avatar)}
          <span class="status-badge-dot ${presence.isOnline ? 'online' : 'offline'}"></span>
        </div>
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

// ================= DIRECT MESSAGING SHORTCUT =================
window.startDirectChat = function(targetUserId) {
  const targetUser = teamUsers.find(u => u.id === targetUserId);
  if (!targetUser) return;

  closeModal('teamMembersModal');
  closeModal('viewProfileModal');

  window.switchAppView('chat');
  window.switchChatChannel('dm', targetUser.id);
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

// ================= EDIT PROFILE MODAL =================
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

  showSaveLoadingModal("กำลังบันทึกข้อมูลโปรไฟล์...", "กรุณารอสักครู่ ระบบกำลังอัปเดตข้อมูลขึ้นระบบคลาวด์");
  setSaveProgress(30);

  try {
    const oldName = user.name;
    const updatedFields = {
      name: newName,
      email: newEmail,
      role: newRole || (isAdmin(user) ? 'แอดมิน' : 'สมาชิกทั่วไป'),
      bio: newBio || '',
      avatar: newAvatar || user.avatar,
      banner: newBanner || ''
    };

    if (newPassword && newPassword.trim() !== '') {
      updatedFields.password = newPassword;
    }

    setSaveProgress(60);
    await updateDoc(doc(db, "users", user.id), updatedFields);

    if (oldName !== newName) {
      setSaveProgress(80);
      for (const p of projects) {
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
      }
    }

    setSaveProgress(100);
    showSaveSuccessModal("บันทึกข้อมูลสำเร็จแล้ว!", "อัปเดตโปรไฟล์ของคุณเรียบร้อย");
    AudioFX.success();

    setTimeout(() => {
      hideSaveLoadingModal();
      closeModal('editProfileModal');
      updateCurrentUserDisplay();
    }, 900);

  } catch (err) {
    console.error("Save profile error:", err);
    hideSaveLoadingModal();
    AudioFX.delete();
    alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
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
  if (!activeProjectId) {
    alert('กรุณาสร้างหรือเลือกโปรเจกต์ก่อน');
    return;
  }
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
        title, 
        assignee, 
        story, 
        status,
        updatedBy: currentUser ? { name: currentUser.name, avatar: currentUser.avatar, time: nowStr } : null
      };
    }
  } else {
    updatedTasks.push({
      id: 'task-' + Date.now(),
      title, 
      assignee, 
      story, 
      submissionLink: '',
      scriptContent: '',
      status, 
      likes: 0,
      createdBy: currentUser ? { name: currentUser.name, avatar: currentUser.avatar } : null,
      updatedBy: currentUser ? { name: currentUser.name, avatar: currentUser.avatar, time: nowStr } : null
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

// ================= SUBMIT WORK HANDLER =================
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

  const updatedTasks = currentProj.tasks.map(t => {
    if (t.id === taskId) {
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
  closeModal('submitWorkModal');
  alert('🎉 บันทึกการส่งงานเรียบร้อยแล้ว!');
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
      scriptContent: '',
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

// ================= RENDER WORKSPACE UI =================
function updateCurrentUserDisplay() {
  const user = getCurrentUser();
  if (user) {
    const userIsAdmin = isAdmin(user);
    const adminTag = userIsAdmin ? ' 👑' : '';
    const displayRole = userIsAdmin ? '👑 แอดมิน' : (user.role || (isStaff(user) ? '🛡️ ทีมงาน' : '👤 สมาชิกทั่วไป'));
    
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
    if (editRevenueBtn) {
      editRevenueBtn.style.display = userIsAdmin ? 'inline-flex' : 'none';
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

initAuth();
