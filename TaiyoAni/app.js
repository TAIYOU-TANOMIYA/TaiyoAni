<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>TaiyoAni UI - Task & Team Hub</title>
  <link rel="icon" type="image/png" href="./Tanomiya.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body class="device-mode-auto">

  <!-- กล่องแสดงป๊อปอัปแจ้งเตือนภายในแอป (In-App Glass Toast) -->
  <div id="inAppToastContainer" class="in-app-toast-container"></div>

  <!-- ================= AUTH GATE OVERLAY ================= -->
  <div class="auth-gate-overlay" id="authGate">
    <div class="auth-card">
      <div class="auth-header">
        <div class="brand-icon">
          <img src="./Tanomiya.png" alt="TaiyoAni Logo" class="brand-img">
        </div>
        <h2>TaiyoAni UI</h2>
        <p>ระบบจัดการงานและโปรเจกต์ทีม</p>
      </div>

      <div class="auth-tabs">
        <button type="button" class="auth-tab-btn active" id="tabBtnLogin" onclick="switchAuthTab('login')">เข้าสู่ระบบ</button>
        <button type="button" class="auth-tab-btn" id="tabBtnRegister" onclick="switchAuthTab('register')">สมัครสมาชิกใหม่</button>
      </div>

      <!-- ส่วนเข้าสู่ระบบ -->
      <!-- ✅ โค้ดใหม่ (ใช้ช่องกรอก Username/Email + ดึงเฉพาะบัญชีในเครื่อง) -->
<div id="loginSection">
  <form onsubmit="handleLoginSubmit(event)">
    <div class="form-group">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <label style="margin-bottom: 0;">ชื่อผู้ใช้ หรือ อีเมล *</label>
        <div style="display: flex; gap: 8px;">
          <button type="button" class="btn-forget-link" style="color: var(--accent);" onclick="openForgotPasswordModal()">❓ ลืมรหัสผ่าน?</button>
          <button type="button" class="btn-forget-link" onclick="handleClearDeviceSavedAccounts()" title="ล้างประวัติชื่อที่จำไว้บนเครื่องนี้">🧹 ล้างประวัติในเครื่อง</button>
        </div>
      </div>
      <input type="text" id="loginUsernameInput" class="form-control" placeholder="กรอกชื่อผู้ใช้ หรือ อีเมลของคุณ" list="deviceAccountsList" required autocomplete="username">
      <datalist id="deviceAccountsList"></datalist>
    </div>

    <div class="form-group">
      <label>รหัสผ่าน *</label>
      <input type="password" id="loginPasswordInput" class="form-control" placeholder="กรอกรหัสผ่านของคุณ" required autocomplete="current-password">
    </div>
    <div id="loginErrorMsg" class="auth-error-msg" style="display: none;"></div>
    <button type="submit" class="btn-primary-auth">เข้าสู่ระบบ</button>
  </form>
</div>

      <!-- ส่วนสมัครสมาชิกใหม่ -->
      <div id="registerSection" style="display: none;">
        <form onsubmit="handleRegisterSubmit(event)">
          <div class="form-group">
            <label>รูปโปรไฟล์ (อัปโหลดจากเครื่อง หรือเลือก Preset / รองรับ GIF)</label>
            <div class="avatar-upload-wrapper">
              <div class="avatar-preview-box" id="avatarPreviewDisplay">
                <span>👨‍💻</span>
              </div>
              <div class="avatar-upload-controls">
                <label class="btn-file-upload">
                  📁 เลือกรูปจากเครื่อง
                  <input type="file" id="avatarFileInput" accept="image/*" onchange="handleAvatarFileSelect(event, 'reg')">
                </label>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">หรือเลือก Preset:</div>
              </div>
            </div>
            <div class="avatar-picker" id="authAvatarPicker"></div>
            <input type="hidden" id="authAvatarDataInput" value="👨‍💻">
          </div>

          <div class="form-group">
            <label>ชื่อผู้ใช้งาน / ฉายาในทีม *</label>
            <input type="text" id="regNameInput" class="form-control" placeholder="เช่น Taiyo, พี่ยอด, นนนี่" required>
          </div>

          <div class="form-group">
            <label>อีเมลส่วนตัว (ใช้รับรหัสยืนยัน OTP) *</label>
            <input type="email" id="regEmailInput" class="form-control" placeholder="example@gmail.com" required>
          </div>

          <div class="form-group">
            <label>ตำแหน่ง / หน้าที่ในทีม</label>
            <input type="text" id="regRoleInput" class="form-control" placeholder="เช่น 3D Animator, Graphic Designer, Lead">
          </div>

          <div class="form-group">
            <label>คำแนะนำตัว / Bio (แนะนำตัวสั้นๆ)</label>
            <textarea id="regBioInput" class="form-control" placeholder="เขียนแนะนำตัว สไตล์งาน หรือสิ่งที่สนใจ..."></textarea>
          </div>

          <div class="form-group">
            <label>ตั้งรหัสผ่าน (อย่างน้อย 4 ตัวอักษร) *</label>
            <input type="password" id="regPasswordInput" class="form-control" placeholder="ตั้งรหัสผ่าน" required minlength="4">
          </div>

          <div class="form-group">
            <label>ยืนยันรหัสผ่าน *</label>
            <input type="password" id="regConfirmPasswordInput" class="form-control" placeholder="กรอกรหัสผ่านอีกครั้ง" required minlength="4">
          </div>

          <div id="regErrorMsg" class="auth-error-msg" style="display: none;"></div>
          <button type="submit" class="btn-primary-auth">สมัครสมาชิกและรับรหัส OTP</button>
        </form>
      </div>
    </div>
  </div>

  <!-- Modal ยืนยันรหัส OTP ทางอีเมล -->
  <div class="modal-overlay" id="otpModal">
    <div class="modal" style="max-width: 420px; text-align: center;">
      <div style="font-size: 2.8rem; margin-bottom: 8px;">📩</div>
      <h3 style="color: #fff; margin-bottom: 6px;">ยืนยันตัวตนผ่านอีเมล</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
        ระบบได้ส่งรหัสยืนยัน 6 หลักไปที่อีเมล<br>
        <strong id="otpTargetEmailDisplay" style="color: var(--accent);"></strong>
      </p>

      <form onsubmit="handleVerifyOtpSubmit(event)">
        <div class="form-group" id="otpEmailInputGroup" style="display: none; text-align: left;">
          <label>ระบุอีเมลส่วนตัวของคุณ:</label>
          <div style="display: flex; gap: 6px;">
            <input type="email" id="unverifiedAccountEmailInput" class="form-control" placeholder="example@gmail.com">
            <button type="button" class="btn-sm" onclick="handleSendOtpToExistingUser()" style="white-space: nowrap;">ส่งรหัส</button>
          </div>
        </div>

        <div class="form-group">
          <label style="display: block; text-align: left;">กรอกรหัส OTP (6 หลัก):</label>
          <input type="text" id="otpCodeInput" class="form-control otp-input-box" placeholder="••••••" maxlength="6" required autocomplete="one-time-code">
        </div>

        <div id="otpErrorMsg" class="auth-error-msg" style="display: none; margin-bottom: 12px;"></div>

        <button type="submit" class="btn-primary-auth" style="margin-top: 6px;">ยืนยันรหัส OTP</button>
        <div style="margin-top: 14px; display: flex; justify-content: space-between; align-items: center;">
          <button type="button" class="btn-forget-link" onclick="handleResendOtp()">🔄 ส่งรหัส OTP อีกครั้ง</button>
          <button type="button" class="btn-sm" onclick="closeOtpModal()">ยกเลิก</button>
        </div>
      </form>
    </div>
  </div>

  <div class="sidebar-backdrop" id="sidebarBackdrop" onclick="toggleMobileSidebar()"></div>

  <!-- ================= APP MAIN CONTAINER ================= -->
  <div class="app-layout" id="mainAppLayout" style="display: none;">

    <!-- 1. หน้าโฮม (HOME VIEW) -->
    <section class="app-view-section active" id="viewHome">
      <div class="home-top-left-profile clickable-profile" onclick="openCurrentUserProfile()" title="คลิกเพื่อดูโปรไฟล์ของคุณ">
        <div class="home-profile-avatar" id="homeUserAvatarDisplay"></div>
        <div class="home-profile-info">
          <div class="home-profile-name" id="homeUserNameDisplay">กำลังโหลด...</div>
          <div class="home-profile-role" id="homeUserRoleDisplay">สมาชิกทั่วไป</div>
        </div>
      </div>

      <div class="home-top-center-clock" id="homeTopCenterClock">
        <div class="home-clock-time" id="homeClockTimeDisplay">00:00:00</div>
        <div class="home-clock-date" id="homeClockDateDisplay">วัน... ที่ ...</div>
      </div>

      <div class="home-top-right-actions">
        <button type="button" class="btn-glass-icon-circle" onclick="openTeamMembersModal()" title="รายชื่อสมาชิกในทีม">
          <span>👥</span>
          <span class="home-members-badge" id="homeOnlineIndicator">0</span>
        </button>
        <button type="button" class="btn-glass-icon-circle" onclick="openSettingsModal()" title="ตั้งค่าระบบและอุปกรณ์เสียง">
          <span>⚙️</span>
        </button>
        <button type="button" class="btn-glass-icon-circle btn-logout-circle" onclick="handleLogout()" title="ออกจากระบบ / สลับบัญชี">
          <span>🚪</span>
        </button>
      </div>

      <div class="home-center-stage">
        <div class="home-banner-wrapper">
          <div class="home-banner-admin-bar" id="homeBannerAdminBar" style="display: none;">
            <button type="button" class="btn-admin-add-banner" onclick="openAddBannerModal()">
              👑 ➕ เพิ่มแบนเนอร์ใหม่ (Admin)
            </button>
          </div>

          <div class="home-banner-carousel" id="homeBannerCarousel">
            <div class="home-banner-track" id="homeBannerTrack"></div>
            <button type="button" class="banner-nav-btn prev" onclick="prevBannerSlide()" title="แบนเนอร์ก่อนหน้า">❮</button>
            <button type="button" class="banner-nav-btn next" onclick="nextBannerSlide()" title="แบนเนอร์ถัดไป">❯</button>
            <div class="banner-dots-container" id="bannerDotsContainer"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. หน้าคอมมูนิตี้ (COMMUNITY VIEW) -->
    <section class="app-view-section" id="viewCommunity">
      <div class="community-fullscreen-card">
        <div class="community-header-compact">
          <div class="community-title-mini">
            <span class="community-mini-icon">💡</span>
            <div class="community-mini-text">
              <h2>คอมมูนิตี้</h2>
              <p>แลกเปลี่ยนไอเดีย & พูดคุย</p>
            </div>
          </div>

          <div class="community-header-actions">
            <button type="button" class="btn-search-trigger" id="btnOpenSearchFilter" onclick="openCommunitySearchModal()" title="ค้นหาและกรองกระทู้">
              <span>🔍</span>
              <span class="search-btn-text">ค้นหา / กรอง</span>
              <span class="filter-active-dot" id="filterActiveDot" style="display: none;"></span>
            </button>

            <button type="button" class="btn-community-post-compact" onclick="openCommunityPostModal()" title="สร้างกระทู้ใหม่">
              <span>✨</span>
              <span>ตั้งกระทู้</span>
            </button>
          </div>
        </div>

        <div class="community-stories-tray" id="communityStoriesTray">
          <div class="story-item story-create-item" onclick="openCreateStoryModal()">
            <div class="story-avatar-ring add-story-ring">
              <div class="story-avatar-inner" id="currentUserStoryAvatar">
                <span>➕</span>
              </div>
              <div class="story-add-badge">+</div>
            </div>
            <span class="story-username">สตอรี่ของคุณ</span>
          </div>

          <div class="stories-feed-list" id="storiesFeedList"></div>
        </div>

        <div class="community-feed-container" id="communityPostsFeed"></div>
      </div>
    </section>

    <!-- 3. หน้าโปรเจกต์ (PROJECTS VIEW) - สิทธิ์แอดมินและทีมงาน -->
    <section class="app-view-section" id="viewProjects">
      <aside class="sidebar" id="appSidebar">
        <div class="sidebar-header-row">
          <div class="brand">
            <div class="brand-icon">
              <img src="./Tanomiya.png" alt="TaiyoAni Logo" class="brand-img">
            </div>
            <div class="brand-title">TaiyoAni UI</div>
          </div>
          <button type="button" class="btn-close-sidebar-mobile" onclick="toggleMobileSidebar()" title="ปิดเมนู">✕</button>
        </div>

        <div class="device-switcher-box">
          <div class="device-switcher-title">โหมดการแสดงผล (Device View)</div>
          <div class="device-switcher-buttons">
            <button type="button" class="btn-device-opt active" id="devOptAuto" onclick="setDeviceMode('auto')">🔄 Auto</button>
            <button type="button" class="btn-device-opt" id="devOptDesktop" onclick="setDeviceMode('desktop')">🖥️ PC</button>
            <button type="button" class="btn-device-opt" id="devOptTablet" onclick="setDeviceMode('tablet')">📱 iPad</button>
            <button type="button" class="btn-device-opt" id="devOptMobile" onclick="setDeviceMode('mobile')">📲 มือถือ</button>
          </div>
        </div>

        <div class="sidebar-section-title">หัวข้อโปรเจกต์ (Projects)</div>
        <ul class="project-list" id="projectList"></ul>

        <button type="button" class="btn-glass-action" onclick="openAddProjectModal()">+ สร้างโปรเจกต์ใหม่</button>

        <div class="user-profile-card">
          <div class="user-avatar clickable-profile" id="currentAvatarDisplay" onclick="openCurrentUserProfile()" title="คลิกเพื่อดูโปรไฟล์"></div>
          <div class="user-info clickable-profile" onclick="openCurrentUserProfile()" title="คลิกเพื่อดูโปรไฟล์">
            <div class="user-name" id="currentUserNameDisplay">กำลังโหลด...</div>
            <div class="user-role" id="currentUserRoleDisplay">สมาชิกทั่วไป</div>
          </div>
          <div class="user-profile-actions">
            <button type="button" class="btn-action-icon" onclick="openEditProfileModal()" title="แก้ไขข้อมูลโปรไฟล์">✏️</button>
          </div>
        </div>
      </aside>

      <main class="main-window">
        <header class="window-header">
          <div class="header-left">
            <button type="button" class="btn-hamburger" onclick="toggleMobileSidebar()" title="เปิดเมนูโปรเจกต์">☰</button>
            <div>
              <h1 id="currentProjectTitle">เลือกโปรเจกต์</h1>
              <p id="currentProjectDesc">จัดการงาน สตอรี่รายละเอียด และลิ้งก์ส่งงาน</p>
            </div>
          </div>
          
          <div class="header-actions">
            <button type="button" class="btn-notes-action" onclick="openProjectNotesModal()" id="btnProjectNotes" title="สมุดโน้ตบันทึกข้อมูลประจำโปรเจกต์">
              <span>📝</span> <span class="action-text">โน้ต</span>
            </button>
            <button type="button" class="btn-script-header" onclick="openNewScriptModal()" id="btnNewScript" title="สร้างสคริปต์บทพากย์/เนื้อเรื่องใหม่">
              <span>📜</span> <span class="action-text">สคริปต์</span>
            </button>
            <button type="button" class="btn-idea-action" onclick="openAddIdeaModal()" id="btnNewIdea">
              <span>💡</span> <span class="action-text">ไอเดีย</span>
            </button>
            <button type="button" class="btn-create-task" onclick="openAddTaskModal()" id="btnNewTask">
              <span>+</span> <span class="action-text">งานใหม่</span>
            </button>
          </div>
        </header>

        <section class="board-viewport">
          <div class="tasks-grid" id="tasksContainer"></div>
        </section>
      </main>
    </section>

    <!-- 4. หน้ารายได้ (REVENUE VIEW) - สิทธิ์แอดมินและทีมงาน -->
    <section class="app-view-section" id="viewRevenue">
      <div class="revenue-fullscreen-card">
        <div class="revenue-widget-header">
          <div class="revenue-header-title">
            <div class="revenue-header-icon-box">💎</div>
            <div>
              <h2>รายได้และงบประมาณทีม (Team Revenue & Payout Hub)</h2>
              <p class="revenue-updated-badge" id="revenueUpdatedBadge">อัปเดตล่าสุด: พร้อมใช้งาน</p>
            </div>
          </div>
          <div>
            <button type="button" class="btn-edit-revenue-gold" id="btnAdminEditRevenue" onclick="openRevenueModal()" style="display: none;">
              <span>👑</span> จัดการงบ & ข้อมูลโอนเงิน
            </button>
          </div>
        </div>

        <div class="revenue-scroll-viewport">
          <div class="revenue-hero-card">
            <div class="revenue-hero-bg-glow"></div>
            <div class="revenue-hero-content">
              <div class="revenue-hero-badge">✨ TOTAL BUDGET POOL</div>
              <div class="revenue-hero-amount" id="revenueTotalDisplay">฿ 0</div>
              <div class="revenue-hero-subtitle" id="revenueNoteDisplay">งบประมาณและผลตอบแทนรวมทุกฝ่าย</div>
            </div>
          </div>

          <div class="revenue-cards-grid-modern">
            <div class="revenue-card-premium card-voice">
              <div class="revenue-card-header">
                <div class="rev-tag-badge voice">🎙️ ทีมพากย์</div>
                <span class="rev-sub-tag">Voice Over</span>
              </div>
              <div class="revenue-amount-modern" id="revenueVoiceDisplay">฿ 0</div>
              <div class="revenue-card-footer-modern">งานลงเสียง, แคสต์บท & พากย์ตัวละคร</div>
            </div>

            <div class="revenue-card-premium card-animation">
              <div class="revenue-card-header">
                <div class="rev-tag-badge anim">🎬 ทีมแอนิเมชั่น</div>
                <span class="rev-sub-tag">3D & Rigging</span>
              </div>
              <div class="revenue-amount-modern" id="revenueAnimDisplay">฿ 0</div>
              <div class="revenue-card-footer-modern">โมเดล 3D, แอนิเมชั่น & จัดฉาก</div>
            </div>

            <div class="revenue-card-premium card-audio">
              <div class="revenue-card-header">
                <div class="rev-tag-badge audio">🎵 ทีมงานเสียง</div>
                <span class="rev-sub-tag">SFX & Music</span>
              </div>
              <div class="revenue-amount-modern" id="revenueAudioDisplay">฿ 0</div>
              <div class="revenue-card-footer-modern">ดนตรีประกอบ, มิกซ์เสียง & Sound FX</div>
            </div>

            <div class="revenue-card-premium card-other">
              <div class="revenue-card-header">
                <div class="rev-tag-badge other">✨ ทีมสนับสนุน</div>
                <span class="rev-sub-tag">Support & Ops</span>
              </div>
              <div class="revenue-amount-modern" id="revenueOtherDisplay">฿ 0</div>
              <div class="revenue-card-footer-modern">งานกราฟิก, ตัดต่อ & ค่าใช้จ่ายกลาง</div>
            </div>
          </div>

          <div class="revenue-payout-panel">
            <div class="payout-panel-header">
              <div class="payout-panel-title">
                <span class="payout-icon">💳</span>
                <div>
                  <h3>กำหนดการและรายละเอียดการโอนเงิน (Payout Schedule & Notice)</h3>
                  <span class="payout-sub">ข้อมูลทางการสำหรับทีมงาน ประกาศโดยแอดมิน</span>
                </div>
              </div>
              <div id="revenueTransferStatusBadge" class="payout-status-badge status-pending">⏳ กำลังสรุปยอด</div>
            </div>

            <div class="payout-info-grid">
              <div class="payout-info-item">
                <span class="payout-info-label">📅 วันที่กำหนดโอนเงิน:</span>
                <span class="payout-info-val highlight" id="revenueTransferDateDisplay">ยังไม่ได้กำหนดวันที่</span>
              </div>
              <div class="payout-info-item">
                <span class="payout-info-label">👤 ผู้ดูแลการจ่ายเงิน:</span>
                <span class="payout-info-val" id="revenuePayerDisplay">TaiyoAni (Admin)</span>
              </div>
            </div>

            <div class="payout-notes-container">
              <span class="payout-notes-label">📢 คำชี้แจง / เงื่อนไขการโอนเงิน:</span>
              <div class="payout-notes-content" id="revenueTransferDetailsDisplay">
                ยังไม่มีข้อความชี้แจงการโอนเงินจากแอดมิน
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. หน้าแชท (CHAT VIEW) -->
    <section class="app-view-section" id="viewChat">
      <div class="discord-chat-layout">
        <aside class="discord-sidebar" id="discordSidebar">
          <div class="discord-sidebar-header">
            <span class="discord-server-icon">⚡</span>
            <div class="discord-server-info">
              <h3>TaiyoAni Hub</h3>
              <span>Workspace Server</span>
            </div>
            <button type="button" class="btn-discord-mobile-close" onclick="toggleDiscordSidebar()">✕</button>
          </div>

          <div class="discord-channels-scroll">
            <div class="discord-category-title">
              <span>📢 ห้องแชทหลัก (MAIN)</span>
            </div>
            <div class="discord-channel-item active" id="channelItemMain" onclick="switchChatChannel('team')">
              <span class="channel-hash">#</span>
              <span class="channel-name">ห้องแชทรวมทีม (Main Chat)</span>
              <span class="discord-badge-count" id="mainChatBadgeCounter">0</span>
            </div>

            <div class="discord-category-title" style="margin-top: 14px;">
              <span>👥 กลุ่มส่วนตัว (GROUPS)</span>
              <button type="button" class="btn-discord-add" onclick="openCreateGroupModal()" title="สร้างกลุ่มใหม่">➕</button>
            </div>
            <div class="discord-group-list" id="discordGroupList"></div>

            <div class="discord-category-title" style="margin-top: 14px;">
              <span>💬 แชทส่วนตัว (DIRECT MESSAGES)</span>
            </div>
            <div class="discord-dm-list" id="discordDmList"></div>
          </div>
        </aside>

        <main class="discord-chat-main">
          <header class="discord-chat-header">
            <div class="discord-header-left">
              <button type="button" class="btn-discord-hamburger" onclick="toggleDiscordSidebar()" title="เปิดรายชื่อห้อง">☰</button>
              <span class="discord-header-prefix" id="discordHeaderPrefix">#</span>
              <div class="discord-header-title-box">
                <h3 id="discordChatHeaderTitle">ห้องแชทรวมทีม (Main Chat)</h3>
                <span id="discordChatHeaderDesc">พื้นที่พูดคุยรวมทุกคนในทีม</span>
              </div>
            </div>

            <div class="discord-header-actions">
              <!-- แถบโปรไฟล์ผู้ที่อยู่ในห้องสนทนาเสียง (แสดงเฉพาะแชทกลุ่ม) -->
              <div class="voice-room-participants-bar" id="voiceRoomParticipantsBar" style="display: none;"></div>

              <!-- ปุ่มเข้าร่วม/ออกจากห้องเสียง (แสดงเฉพาะแชทกลุ่ม) -->
              <button type="button" class="btn-voice-room-toggle" id="btnToggleVoiceRoom" onclick="toggleVoiceRoom()" style="display: none;" title="เข้าร่วม/ออกจากห้องเสียง">
                <span id="voiceRoomBtnIcon">🎧</span>
                <span id="voiceRoomBtnText">เข้าร่วมเสียง</span>
              </button>

              <!-- ปุ่มโทรด้วยเสียงแบบ 1-on-1 (แสดงเฉพาะแชทส่วนตัว DM) -->
              <button type="button" class="btn-voice-call" id="btnVoiceCall" onclick="startVoiceCall()" style="display: none;" title="โทรคุยด้วยเสียง">
                <span>📞</span>
                <span class="voice-call-text">โทรเสียง</span>
              </button>

              <!-- ปุ่มลบกลุ่มแชท -->
              <button type="button" class="btn-delete-group-header" id="btnDeleteCurrentGroup" onclick="handleDeleteCurrentGroup()" style="display: none;" title="ลบกลุ่มแชทนี้">
                🗑️ ลบกลุ่ม
              </button>

              <button type="button" class="btn-chat-control" id="btnClearChat" onclick="handleClearChat()" title="ล้างประวัติแชท (เฉพาะแอดมิน)" style="display: none;">🗑️</button>
            </div>
          </header>

          <div class="chat-messages-body" id="chatMessagesBody"></div>

          <div class="chat-image-preview-wrapper" id="chatImagePreviewWrapper">
            <div class="chat-image-preview-thumb">
              <img src="" id="chatImagePreviewImg" alt="Preview">
            </div>
            <span style="font-size: 0.8rem; color: #cbd5e1; flex: 1;">แนบรูปภาพพร้อมส่ง</span>
            <button type="button" class="btn-sm delete" onclick="removeChatImageAttachment()">✕ ลบรูป</button>
          </div>

          <form class="chat-input-row" onsubmit="handleSendChatMessage(event)">
            <button type="button" class="btn-chat-tool" id="btnChatEmojiToggle" onclick="toggleChatEmojiPicker()" title="ใส่อิโมจิ">😊</button>
            <label class="btn-chat-tool" title="แนบรูปภาพส่งในแชท">
              📷
              <input type="file" id="chatFileInput" accept="image/*" style="display: none;" onchange="handleChatImageSelect(event)">
            </label>
            <input type="text" id="chatTextInput" class="chat-input" placeholder="พิมพ์ข้อความ... (กด Enter เพื่อส่ง)" autocomplete="off">
            <button type="submit" class="btn-chat-send" title="ส่งข้อความ">🚀</button>
            <div class="chat-emoji-popover" id="chatEmojiPickerPopover"></div>
          </form>
        </main>
      </div>
    </section>

    <!-- ================= BOTTOM DOCK NAV ================= -->
    <nav class="bottom-dock-nav">
      <button type="button" class="bottom-nav-item active" id="navBtnHome" onclick="switchAppView('home')">
        <span class="bottom-nav-icon">🏠</span>
        <span class="bottom-nav-text">โฮม</span>
      </button>

      <button type="button" class="bottom-nav-item" id="navBtnCommunity" onclick="switchAppView('community')">
        <span class="bottom-nav-icon">💡</span>
        <span class="bottom-nav-text">คอมมู</span>
      </button>

      <button type="button" class="bottom-nav-item" id="navBtnProjects" onclick="switchAppView('projects')">
        <span class="bottom-nav-icon">📁</span>
        <span class="bottom-nav-text">โปรเจกต์</span>
      </button>

      <button type="button" class="bottom-nav-item" id="navBtnRevenue" onclick="switchAppView('revenue')">
        <span class="bottom-nav-icon">💰</span>
        <span class="bottom-nav-text">รายได้</span>
      </button>

      <button type="button" class="bottom-nav-item" id="navBtnChat" onclick="switchAppView('chat')">
        <span class="bottom-nav-icon" style="position: relative;">
          💬
          <span class="chat-badge-counter" id="chatBadgeCounter">0</span>
        </span>
        <span class="bottom-nav-text">แชท</span>
      </button>
    </nav>
  </div>

  <!-- ================= INCOMING CALL POPUP MODAL (สำหรับแชทส่วนตัว) ================= -->
  <div class="modal-overlay" id="incomingCallModal" style="z-index: 1320;">
    <div class="modal voice-call-card incoming-card">
      <div class="voice-call-avatar-pulse ringing" id="incomingCallAvatarPulse">
        <div class="voice-call-avatar" id="incomingCallAvatarDisplay">📞</div>
      </div>
      <h3 class="voice-call-target-name" id="incomingCallerNameDisplay">สายเรียกเข้า...</h3>
      <p class="voice-call-status-text">📞 มีสมาชิกกำลังโทรหาคุณ...</p>

      <div class="voice-call-actions" style="margin-top: 14px;">
        <button type="button" class="btn-voice-action accept" onclick="acceptIncomingCall()" title="รับสาย">
          🟢 รับสาย
        </button>
        <button type="button" class="btn-voice-action end" onclick="declineIncomingCall()" title="ปฏิเสธสาย">
          🔴 วางสาย
        </button>
      </div>
    </div>
  </div>

  <!-- ================= VOICE CALL ACTIVE MODAL (สำหรับแชทส่วนตัว) ================= -->
  <div class="modal-overlay" id="voiceCallModal" style="z-index: 1250;">
    <div class="modal voice-call-card">
      <div class="voice-call-avatar-pulse" id="voiceCallAvatarPulse">
        <div class="voice-call-avatar" id="voiceCallAvatarDisplay">📞</div>
      </div>
      <h3 class="voice-call-target-name" id="voiceCallTargetNameDisplay">กำลังสนทนาสาย...</h3>
      <p class="voice-call-status-text" id="voiceCallStatusText">กำลังเชื่อมต่อสัญญาณเสียง...</p>
      <div class="voice-call-timer" id="voiceCallTimerDisplay" style="display: none;">00:00</div>

      <div class="voice-call-actions">
        <button type="button" class="btn-voice-action mute" id="btnVoiceMute" onclick="toggleVoiceMute()" title="ปิด/เปิดไมค์">
          🎤 ปิดไมค์
        </button>
        <button type="button" class="btn-voice-action settings" onclick="openSettingsModal()" title="ตั้งค่าไมโครโฟน/ลำโพง">
          ⚙️ ตั้งค่า
        </button>
        <button type="button" class="btn-voice-action end" onclick="endVoiceCall()" title="วางสาย">
          🔴 วางสาย
        </button>
      </div>

      <audio id="remoteVoiceAudio" autoplay playsinline></audio>
    </div>
  </div>

  <!-- ================= MODALS อื่นๆ ================= -->

  <!-- ADD HOME BANNER MODAL -->
  <div class="modal-overlay" id="homeBannerModal" style="z-index: 1270;">
    <div class="modal" style="max-width: 520px;">
      <div class="modal-header">
        <h3 style="display: flex; align-items: center; gap: 8px;">👑 เพิ่มแบนเนอร์โฆษณา / โปรเจกต์ล่าสุด</h3>
        <button type="button" class="close-btn" onclick="closeModal('homeBannerModal')">✕</button>
      </div>
      <form onsubmit="handleSaveHomeBanner(event)">
        <div class="form-group">
          <label>หัวข้อโฆษณา / ชื่องาน *</label>
          <input type="text" id="bannerTitleInput" class="form-control" placeholder="เช่น โปรเจกต์ Animation EP.1 กำลังจะมา!" required>
        </div>

        <div class="form-group">
          <label>คำอธิบายสั้นๆ / ไฮไลท์</label>
          <input type="text" id="bannerSubtitleInput" class="form-control" placeholder="เช่น ติดตามรับชมผลงานใหม่ของทีมงานเร็วๆ นี้...">
        </div>

        <div class="form-group">
          <label>ลิ้งก์ปลายทางเมื่อคลิก (Optional):</label>
          <input type="url" id="bannerLinkInput" class="form-control" placeholder="https://youtube.com/... หรือ ลิ้งก์ภายนอก">
        </div>

        <div class="form-group">
          <label>อัปโหลดไฟล์สื่อ (ภาพ / GIF / วิดีโอสั้นไม่เกิน 1 นาที และไฟล์ < 750KB) *</label>
          <input type="file" id="bannerFileInput" class="form-control" accept="image/*,video/mp4,video/webm" onchange="handleBannerMediaSelect(event)" required>
          <input type="hidden" id="bannerMediaDataInput">
          <input type="hidden" id="bannerMediaTypeInput" value="image">
          
          <div id="bannerMediaPreviewContainer" class="banner-upload-preview-box">
            <span style="font-size: 0.8rem; color: var(--text-muted);">ตัวอย่างไฟล์สื่อจะแสดงที่นี่</span>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-sm" onclick="closeModal('homeBannerModal')">ยกเลิก</button>
          <button type="submit" class="btn-create-task" id="btnSubmitBanner" style="background: linear-gradient(135deg, rgba(251, 191, 36, 0.4), rgba(245, 158, 11, 0.6)); border-color: var(--amber); color: #fff;">
            🚀 โพสต์ขึ้นแบนเนอร์
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- COMMUNITY SEARCH MODAL -->
  <div class="modal-overlay" id="communitySearchModal" style="z-index: 1245;">
    <div class="modal" style="max-width: 460px;">
      <div class="modal-header">
        <h3 style="display: flex; align-items: center; gap: 8px;">🔍 ค้นหา & กรองกระทู้</h3>
        <button type="button" class="close-btn" onclick="closeModal('communitySearchModal')">✕</button>
      </div>
      
      <div class="form-group">
        <label>คำค้นหา (ค้นจากชื่อเรื่อง, เนื้อหา, ชื่อผู้โพสต์ หรือแท็ก):</label>
        <input type="text" id="modalSearchInput" class="form-control" placeholder="พิมพ์ข้อความที่ต้องการค้นหา...">
      </div>

      <div class="form-group">
        <label>หมวดหมู่กระทู้:</label>
        <div class="search-category-grid">
          <button type="button" class="category-select-pill active" data-cat="all" onclick="selectSearchCategory('all')">🌟 ทั้งหมด</button>
          <button type="button" class="category-select-pill" data-cat="idea" onclick="selectSearchCategory('idea')">💡 ไอเดีย</button>
          <button type="button" class="category-select-pill" data-cat="discussion" onclick="selectSearchCategory('discussion')">💬 พูดคุย</button>
          <button type="button" class="category-select-pill" data-cat="art" onclick="selectSearchCategory('art')">🎨 อาร์ต</button>
          <button type="button" class="category-select-pill" data-cat="qa" onclick="selectSearchCategory('qa')">❓ Q&A</button>
        </div>
      </div>

      <div class="modal-footer" style="justify-content: space-between; margin-top: 20px;">
        <button type="button" class="btn-sm delete" onclick="handleResetSearchFilter()">ล้างการค้นหา</button>
        <div style="display: flex; gap: 8px;">
          <button type="button" class="btn-sm" onclick="closeModal('communitySearchModal')">ปิด</button>
          <button type="button" class="btn-create-task" onclick="handleApplySearchFilter()">ค้นหาเลย 🚀</button>
        </div>
      </div>
    </div>
  </div>

  <!-- CREATE STORY MODAL -->
  <div class="modal-overlay" id="createStoryModal" style="z-index: 1260;">
    <div class="modal" style="max-width: 440px;">
      <div class="modal-header">
        <h3 style="display: flex; align-items: center; gap: 8px;">📸 เพิ่มสตอรี่ใหม่ (อยู่ได้ 24 ชม.)</h3>
        <button type="button" class="close-btn" onclick="closeModal('createStoryModal')">✕</button>
      </div>
      <form onsubmit="handleCreateStorySubmit(event)">
        <div class="form-group">
          <label>ข้อความสตอรี่ / อัปเดตสั้นๆ *</label>
          <textarea id="storyTextInput" class="form-control" style="min-height: 85px;" placeholder="กำลังทำอะไรอยู่? หรือแชร์เรื่องราวสั้นๆ..." required></textarea>
        </div>

        <div class="form-group">
          <label>เลือกโทนสีพื้นหลัง:</label>
          <div class="story-bg-picker">
            <label class="bg-color-opt active" style="background: linear-gradient(135deg, #38bdf8, #818cf8);">
              <input type="radio" name="storyBg" value="linear-gradient(135deg, #38bdf8, #818cf8)" checked>
            </label>
            <label class="bg-color-opt" style="background: linear-gradient(135deg, #f43f5e, #fb923c);">
              <input type="radio" name="storyBg" value="linear-gradient(135deg, #f43f5e, #fb923c)">
            </label>
            <label class="bg-color-opt" style="background: linear-gradient(135deg, #10b981, #3b82f6);">
              <input type="radio" name="storyBg" value="linear-gradient(135deg, #10b981, #3b82f6)">
            </label>
            <label class="bg-color-opt" style="background: linear-gradient(135deg, #c084fc, #ec4899);">
              <input type="radio" name="storyBg" value="linear-gradient(135deg, #c084fc, #ec4899)">
            </label>
            <label class="bg-color-opt" style="background: linear-gradient(135deg, #1e293b, #0f172a);">
              <input type="radio" name="storyBg" value="linear-gradient(135deg, #1e293b, #0f172a)">
            </label>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-sm" onclick="closeModal('createStoryModal')">ยกเลิก</button>
          <button type="submit" class="btn-create-task">🚀 โพสต์สตอรี่</button>
        </div>
      </form>
    </div>
  </div>

  <!-- STORY VIEWER MODAL -->
  <div class="modal-overlay" id="storyViewerModal" style="z-index: 1300;" onclick="handleStoryViewerBgClick(event)">
    <div class="story-viewer-card" id="storyViewerCard">
      <div class="story-progress-bar-track">
        <div class="story-progress-bar-fill" id="storyProgressBarFill"></div>
      </div>

      <div class="story-viewer-header">
        <div class="story-author-info">
          <div class="story-author-avatar" id="storyViewerAvatar"></div>
          <div>
            <div class="story-author-name" id="storyViewerAuthorName">Username</div>
            <div class="story-time-ago" id="storyViewerTimeAgo">เมื่อสักครู่</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button type="button" class="btn-delete-story" id="btnDeleteCurrentStory" onclick="handleDeleteCurrentStory()" title="ลบสตอรี่นี้" style="display: none;">🗑️</button>
          <button type="button" class="story-close-btn" onclick="closeStoryViewer()">✕</button>
        </div>
      </div>

      <div class="story-viewer-content" id="storyViewerContent">
        <p id="storyViewerTextDisplay"></p>
      </div>

      <div class="story-nav-btn prev" onclick="prevStorySlide()">❮</div>
      <div class="story-nav-btn next" onclick="nextStorySlide()">❯</div>
    </div>
  </div>

  <!-- COMMUNITY POST MODAL -->
  <div class="modal-overlay" id="communityPostModal" style="z-index: 1240;">
    <div class="modal" style="max-width: 540px;">
      <div class="modal-header">
        <h3 style="display: flex; align-items: center; gap: 8px;">✨ สร้างกระทู้ / เสนอไอเดียใหม่</h3>
        <button type="button" class="close-btn" onclick="closeModal('communityPostModal')">✕</button>
      </div>
      <form onsubmit="handleCreateCommunityPost(event)">
        <div class="form-group">
          <label>เลือกหมวดหมู่ *</label>
          <select id="communityCategorySelect" class="form-control" required>
            <option value="idea">💡 ไอเดียใหม่ (New Idea)</option>
            <option value="discussion">💬 พูดคุยทั่วไป (General Discussion)</option>
            <option value="art">🎨 อาร์ต & สไตล์ (Art & Design)</option>
            <option value="qa">❓ สอบถาม / เสนอแนะ (Q&A / Feedback)</option>
          </select>
        </div>

        <div class="form-group">
          <label>หัวข้อกระทู้ / ชื่อไอเดีย *</label>
          <input type="text" id="communityTitleInput" class="form-control" placeholder="เช่น ชวนระดมไอเดียฉากต่อสู้, เสนอโทนสีงานใหม่" required>
        </div>

        <div class="form-group">
          <label>รายละเอียด & แนวคิด *</label>
          <textarea id="communityContentInput" class="form-control" style="min-height: 120px;" placeholder="อธิบายแนวคิด ข้อดี หรือจุดเด่นของไอเดียนี้..." required></textarea>
        </div>

        <div class="form-group">
          <label>แท็กกำกับ (ใส่เครื่องหมาย # คั่นคำ)</label>
          <input type="text" id="communityTagsInput" class="form-control" placeholder="เช่น #3D #Blender #Anime #ConceptArt">
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-sm" onclick="closeModal('communityPostModal')">ยกเลิก</button>
          <button type="submit" class="btn-create-task">🚀 โพสต์ลงคอมมูนิตี้</button>
        </div>
      </form>
    </div>
  </div>

  <!-- COMMUNITY POST DETAIL MODAL -->
  <div class="modal-overlay" id="communityDetailModal" style="z-index: 1250;">
    <div class="modal" style="max-width: 600px; max-height: 90vh; max-height: 90dvh; display: flex; flex-direction: column; padding: 20px;">
      <div class="modal-header" style="margin-bottom: 12px;">
        <div id="detailModalCategoryBox"></div>
        <button type="button" class="close-btn" onclick="closeModal('communityDetailModal')">✕</button>
      </div>

      <div id="communityDetailBody" style="flex: 1 1 auto; overflow-y: auto; padding-right: 4px; display: flex; flex-direction: column; gap: 14px;"></div>

      <div style="padding-top: 12px; border-top: 1px solid var(--glass-border); margin-top: 8px;">
        <form class="ig-comment-input-bar" id="detailModalCommentForm" onsubmit="handleModalAddComment(event)">
          <input type="text" id="detailModalCommentInput" class="ig-comment-input" placeholder="แสดงความคิดเห็นเพิ่มเติม..." autocomplete="off" required>
          <button type="submit" class="btn-ig-submit-comment">โพสต์</button>
        </form>
      </div>
    </div>
  </div>

  <!-- ACCESS DENIED MODAL -->
  <div class="modal-overlay" id="accessDeniedModal" style="z-index: 1350;">
    <div class="modal" style="max-width: 400px; text-align: center; padding: 26px 20px;">
      <div style="font-size: 3rem; margin-bottom: 8px;">🔒</div>
      <h3 style="color: #ffffff; margin-bottom: 8px; font-size: 1.2rem;">จำกัดสิทธิ์การเข้าถึง</h3>
      <p style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.6; margin-bottom: 20px;">
        หน้านี้เปิดให้เข้าถึงได้เฉพาะ <strong style="color: #fbbf24;">ยศทีมงาน</strong> และ <strong style="color: #f43f5e;">แอดมิน</strong> เท่านั้น<br>
        สมาชิกทั่วไปสามารถใช้งานหน้าโฮม คอมมูนิตี้ และห้องแชทได้ตามปกติ
      </p>
      <button type="button" class="btn-create-task" onclick="closeAccessDeniedModal()" style="width: 100%; justify-content: center; padding: 10px 16px; font-size: 0.92rem;">
        🏠 กลับไปหน้าโฮม
      </button>
    </div>
  </div>

  <!-- ADMIN ROLE MODAL -->
  <div class="modal-overlay" id="adminRoleModal" style="z-index: 1220;">
    <div class="modal" style="max-width: 440px;">
      <div class="modal-header">
        <h3 style="display: flex; align-items: center; gap: 8px;">🎖️ ปรับยศสมาชิก (Admin Only)</h3>
        <button type="button" class="close-btn" onclick="closeModal('adminRoleModal')">✕</button>
      </div>
      <form onsubmit="handleSaveUserRoleSubmit(event)">
        <input type="hidden" id="adminTargetUserId">
        <div style="display: flex; align-items: center; gap: 12px; background: rgba(0,0,0,0.25); padding: 12px; border-radius: 10px; margin-bottom: 14px; border: 1px solid var(--glass-border);">
          <div class="member-avatar-wrapper" id="adminTargetUserAvatar"></div>
          <div>
            <h4 id="adminTargetUserName" style="color: #fff; font-size: 1.05rem;">-</h4>
            <p id="adminTargetUserCurrentRole" style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">ยศปัจจุบัน: -</p>
          </div>
        </div>

        <div class="form-group">
          <label>เลือกประเภทยศ *</label>
          <select id="adminRoleSelect" class="form-control" onchange="handleAdminRoleSelectChange()" required>
            <option value="ทีมงาน">🛡️ ทีมงาน (Staff / Team Crew)</option>
            <option value="สมาชิกทั่วไป">👤 สมาชิกทั่วไป (General Member)</option>
          </select>
        </div>

        <div class="form-group">
          <label>ระบุตำแหน่ง / หน้าที่เจาะจง (แสดงในโปรไฟล์):</label>
          <input type="text" id="adminRoleCustomInput" class="form-control" placeholder="เช่น 3D Animator (ทีมงาน), ผู้ช่วยงานตัดต่อ">
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-sm" onclick="closeModal('adminRoleModal')">ยกเลิก</button>
          <button type="submit" class="btn-create-task">💾 บันทึกการปรับยศ</button>
        </div>
      </form>
    </div>
  </div>

  <!-- LIGHTBOX IMAGE MODAL -->
  <div class="image-lightbox-modal" id="imageLightboxModal" onclick="closeLightbox()">
    <img src="" class="image-lightbox-content" id="imageLightboxImg" alt="Full View">
  </div>

  <!-- TEAM MEMBERS MODAL -->
  <div class="modal-overlay" id="teamMembersModal">
    <div class="modal team-members-modal-box">
      <div class="modal-header">
        <h3 style="display: flex; align-items: center; gap: 8px;">👥 รายชื่อสมาชิกในระบบ (<span id="modalOnlineCountText">0 ออนไลน์</span>)</h3>
        <button type="button" class="close-btn" onclick="closeModal('teamMembersModal')">✕</button>
      </div>
      <div class="dock-members-list" id="membersPresenceList"></div>
    </div>
  </div>

  <!-- VIEW PROFILE MODAL -->
  <div class="modal-overlay" id="viewProfileModal">
    <div class="modal profile-modal-container">
      <div class="profile-view-card">
        <div class="profile-view-banner-wrapper">
          <div class="profile-view-banner" id="viewProfileBannerDisplay"></div>
          <button type="button" class="close-btn profile-close-floating" onclick="closeModal('viewProfileModal')">✕</button>
        </div>

        <div class="profile-view-header-content">
          <div class="profile-view-avatar-box" id="viewProfileAvatarDisplay"></div>
          <h3 class="profile-view-name" id="viewProfileNameDisplay"></h3>
          <div class="profile-view-role-tag" id="viewProfileRoleDisplay"></div>
          <div class="profile-view-status" id="viewProfileStatusDisplay"></div>
        </div>

        <div class="profile-view-body">
          <div class="profile-view-section">
            <label class="profile-view-label">📧 อีเมลติดต่อ:</label>
            <div class="profile-view-val" id="viewProfileEmailDisplay">-</div>
          </div>

          <div class="profile-view-section">
            <label class="profile-view-label">📝 คำแนะนำตัว / Bio:</label>
            <div class="profile-view-bio-box" id="viewProfileBioDisplay">ยังไม่มีคำแนะนำตัว</div>
          </div>

          <div class="profile-view-actions" id="viewProfileActionsContainer"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- EDIT PROFILE MODAL -->
  <div class="modal-overlay" id="editProfileModal">
    <div class="modal">
      <div class="modal-header">
        <h3>แก้ไขข้อมูลส่วนตัว / โปรไฟล์</h3>
        <button type="button" class="close-btn" onclick="closeModal('editProfileModal')">✕</button>
      </div>
      <form onsubmit="handleEditProfileSubmit(event)">
        <div class="form-group">
          <label>ภาพหน้าปกโปรไฟล์ (Cover Banner / รองรับ GIF):</label>
          <div class="banner-upload-wrapper">
            <div class="banner-preview-box" id="editBannerPreviewDisplay">
              <span style="font-size: 0.85rem; color: var(--text-muted);">ไม่มีภาพหน้าปก</span>
            </div>
            <div class="banner-upload-controls">
              <label class="btn-file-upload">
                🖼️ เปลี่ยนภาพหน้าปก
                <input type="file" id="editBannerFileInput" accept="image/*" onchange="handleBannerFileSelect(event)">
              </label>
              <button type="button" class="btn-sm delete" style="margin-left: 6px;" onclick="handleRemoveBanner()" title="ลบภาพหน้าปก">ลบหน้าปก</button>
            </div>
          </div>
          <input type="hidden" id="editBannerDataInput">
        </div>

        <div class="form-group">
          <label>รูปโปรไฟล์ (อัปโหลดจากเครื่อง หรือเลือก Preset / รองรับ GIF):</label>
          <div class="avatar-upload-wrapper">
            <div class="avatar-preview-box" id="editAvatarPreviewDisplay">
              <span>👤</span>
            </div>
            <div class="avatar-upload-controls">
              <label class="btn-file-upload">
                📁 เปลี่ยนรูปโปรไฟล์
                <input type="file" id="editAvatarFileInput" accept="image/*" onchange="handleAvatarFileSelect(event, 'edit')">
              </label>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">หรือเลือก Preset:</div>
            </div>
          </div>
          <div class="avatar-picker" id="editAvatarPicker"></div>
          <input type="hidden" id="editAvatarDataInput">
        </div>

        <div class="form-group">
          <label>ชื่อผู้ใช้งาน / ฉายา *</label>
          <input type="text" id="editNameInput" class="form-control" required>
        </div>

        <div class="form-group">
          <label>อีเมลส่วนตัว</label>
          <input type="email" id="editEmailInput" class="form-control" placeholder="example@gmail.com" required>
        </div>

        <div class="form-group">
          <label>ตำแหน่ง / หน้าที่ในทีม</label>
          <input type="text" id="editRoleInput" class="form-control" placeholder="เช่น 3D Animator, Editor">
        </div>

        <div class="form-group">
          <label>คำแนะนำตัว / Bio (แสดงให้ทุกคนในทีมอ่าน)</label>
          <textarea id="editBioInput" class="form-control" placeholder="เขียนแนะนำตัว สไตล์งาน หรือสิ่งที่คุณรับผิดชอบ..."></textarea>
        </div>

        <div class="form-group">
          <label>เปลี่ยนรหัสผ่านใหม่ (หากไม่ต้องการเปลี่ยนให้เว้นว่างไว้)</label>
          <input type="password" id="editPasswordInput" class="form-control" placeholder="กรอกรหัสผ่านใหม่" minlength="4">
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-sm" onclick="closeModal('editProfileModal')">ยกเลิก</button>
          <button type="submit" class="btn-create-task">บันทึกข้อมูลโปรไฟล์</button>
        </div>
      </form>
    </div>
  </div>

  <!-- LOADING PROGRESS MODAL -->
  <div class="modal-overlay" id="loadingModal" style="z-index: 1200;">
    <div class="modal save-loading-card">
      <div class="save-loading-icon" id="saveLoadingIcon">⏳</div>
      <h3 class="save-loading-title" id="saveLoadingTitle">กำลังบันทึกข้อมูลโปรไฟล์...</h3>
      <p class="save-loading-desc" id="saveLoadingDesc">กรุณารอสักครู่ ระบบกำลังอัปเดตข้อมูล</p>
      <div class="progress-bar-track">
        <div class="progress-bar-fill" id="saveProgressBarFill"></div>
      </div>
    </div>
  </div>

  <!-- NEW SCRIPT MODAL -->
  <div class="modal-overlay" id="newScriptModal">
    <div class="modal" style="max-width: 480px;">
      <div class="modal-header">
        <h3 style="display: flex; align-items: center; gap: 8px;">📜 สร้างสคริปต์ใหม่</h3>
        <button type="button" class="close-btn" onclick="closeModal('newScriptModal')">✕</button>
      </div>
      <form onsubmit="handleCreateNewScript(event)">
        <div class="form-group">
          <label>ชื่อสคริปต์ / หัวข้อบท *</label>
          <input type="text" id="newScriptTitleInput" class="form-control" placeholder="เช่น สคริปต์บทพากย์ ตอนที่ 1, บทสนทนาตัวละครหลัก" required>
        </div>
        <div class="form-group">
          <label>คำอธิบายย่อ / แท็กระบุ</label>
          <input type="text" id="newScriptDescInput" class="form-control" placeholder="เช่น ใช้สำหรับอัดเสียงรอบที่ 1">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-sm" onclick="closeModal('newScriptModal')">ยกเลิก</button>
          <button type="submit" class="btn-script-create-submit">🚀 เปิดหน้าเขียนสคริปต์</button>
        </div>
      </form>
    </div>
  </div>

  <!-- SCRIPT EDITOR MODAL -->
  <div class="modal-overlay" id="scriptEditorModal">
    <div class="modal word-editor-modal">
      <div class="modal-header" style="margin-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 8px; overflow: hidden;">
          <span style="font-size: 1.4rem;">📑</span>
          <div>
            <h3 id="scriptEditorTaskTitle" style="font-size: 1.05rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">สคริปต์บทพากย์</h3>
            <div id="scriptEditorMetaInfo" style="font-size: 0.72rem; color: var(--text-muted);">เขียนและจัดรูปแบบเอกสารแบบเรียลไทม์</div>
          </div>
        </div>
        <button type="button" class="close-btn" onclick="closeModal('scriptEditorModal')">✕</button>
      </div>

      <div class="word-pages-nav-bar">
        <div class="page-nav-controls">
          <button type="button" class="btn-page-nav" onclick="prevPage()" id="btnPrevPage">⬅️ ก่อนหน้า</button>
          <div class="page-indicator-box">
            <span>หน้า</span>
            <select id="pageSelectDropdown" onchange="jumpToPage(this.value)" class="page-select-dropdown"></select>
            <span id="pageTotalDisplay">/ 1</span>
          </div>
          <button type="button" class="btn-page-nav" onclick="nextPage()" id="btnNextPage">ถัดไป ➡️</button>
        </div>

        <div class="page-action-controls">
          <button type="button" class="btn-page-add" onclick="addNewPage()" id="btnAddNewPage">➕ เพิ่มหน้า</button>
          <button type="button" class="btn-page-delete" onclick="deleteCurrentPage()" id="btnDeleteCurrentPage">🗑️ ลบหน้า</button>
        </div>
      </div>

      <div class="word-toolbar">
        <div class="word-toolbar-group">
          <button type="button" class="word-tool-btn" onclick="execWordCmd('undo')" title="เลิกทำ">↩️</button>
          <button type="button" class="word-tool-btn" onclick="execWordCmd('redo')" title="ทำซ้ำ">↪️</button>
        </div>
        <div class="word-toolbar-divider"></div>
        <div class="word-toolbar-group">
          <button type="button" class="word-tool-btn" onclick="execWordCmd('formatBlock', '<h1>')"><b>H1</b></button>
          <button type="button" class="word-tool-btn" onclick="execWordCmd('formatBlock', '<h2>')"><b>H2</b></button>
          <button type="button" class="word-tool-btn" onclick="execWordCmd('formatBlock', '<p>')">¶</button>
        </div>
        <div class="word-toolbar-divider"></div>
        <div class="word-toolbar-group">
          <button type="button" class="word-tool-btn" onclick="execWordCmd('bold')"><b>B</b></button>
          <button type="button" class="word-tool-btn" onclick="execWordCmd('italic')"><i>I</i></button>
          <button type="button" class="word-tool-btn" onclick="execWordCmd('underline')"><u>U</u></button>
          <button type="button" class="word-tool-btn" onclick="execWordCmd('strikeThrough')"><s>S</s></button>
        </div>
        <div class="word-toolbar-divider"></div>
        <div class="word-toolbar-group">
          <label class="word-color-picker-label" title="สีตัวอักษร">
            <span style="font-weight: bold; border-bottom: 3px solid #38bdf8;">A</span>
            <input type="color" onchange="execWordCmd('foreColor', this.value)" value="#ffffff">
          </label>
          <label class="word-color-picker-label" title="สีไฮไลต์">
            <span style="background: #fbbf24; color: #000; padding: 0 3px; border-radius: 2px;">🖍️</span>
            <input type="color" onchange="execWordCmd('hiliteColor', this.value)" value="#fbbf24">
          </label>
        </div>
        <div class="word-toolbar-divider"></div>
        <div class="word-toolbar-group">
          <button type="button" class="word-tool-btn" onclick="execWordCmd('justifyLeft')">⇤</button>
          <button type="button" class="word-tool-btn" onclick="execWordCmd('justifyCenter')">≡</button>
          <button type="button" class="word-tool-btn" onclick="execWordCmd('justifyRight')">⇥</button>
        </div>
        <div class="word-toolbar-divider"></div>
        <div class="word-toolbar-group">
          <button type="button" class="word-tool-btn" onclick="execWordCmd('insertUnorderedList')">• List</button>
          <button type="button" class="word-tool-btn" onclick="execWordCmd('insertOrderedList')">1. List</button>
          <button type="button" class="word-tool-btn" onclick="removeFormat()">🧹</button>
        </div>
      </div>

      <div class="word-paper-container">
        <div class="word-paper-sheet" id="wordPaperEditor" contenteditable="true" spellcheck="false" placeholder="เริ่มพิมพ์สคริปต์งาน บทพากย์ หรือเนื้อเรื่องในหน้านี้..."></div>
      </div>

      <div class="word-editor-footer">
        <div class="word-stats" id="wordStatsDisplay">0 คำ | 0 ตัวอักษร</div>
        <div class="modal-footer" style="margin-top: 0;">
          <button type="button" class="btn-sm" onclick="closeModal('scriptEditorModal')">ปิด</button>
          <button type="button" class="btn-create-task" id="btnSaveScriptAction" onclick="handleSaveTaskScript()">💾 บันทึกสคริปต์</button>
        </div>
      </div>
    </div>
  </div>

  <!-- SUBMIT WORK MODAL -->
  <div class="modal-overlay" id="submitWorkModal">
    <div class="modal" style="max-width: 480px;">
      <div class="modal-header">
        <h3 style="display: flex; align-items: center; gap: 8px;">📤 ส่งงาน</h3>
        <button type="button" class="close-btn" onclick="closeModal('submitWorkModal')">✕</button>
      </div>
      <form onsubmit="handleSaveSubmission(event)">
        <input type="hidden" id="submitTaskIdInput">
        <div style="background: rgba(0,0,0,0.25); padding: 12px; border-radius: 8px; margin-bottom: 16px; border: 1px solid var(--glass-border);">
          <div style="font-size: 0.78rem; color: var(--text-muted);">ชื่องาน:</div>
          <div id="submitTaskTitleDisplay" style="font-size: 1rem; font-weight: 600; color: #ffffff; margin-top: 2px;"></div>
        </div>

        <div class="form-group">
          <label>🔗 ลิ้งก์ส่งงาน (Google Drive, Figma, Dropbox, YouTube ฯลฯ) *</label>
          <input type="url" id="submitWorkLinkInput" class="form-control" placeholder="https://drive.google.com/drive/folders/..." required>
        </div>

        <div class="form-group">
          <label>สถานะงาน</label>
          <select id="submitWorkStatusInput" class="form-control">
            <option value="completed">🟢 เสร็จสิ้น (Completed / ส่งงานแล้ว)</option>
            <option value="in_progress">🔵 กำลังทำ (In Progress / ดราฟต์งาน)</option>
            <option value="pending">🟡 รอดำเนินการ (Pending)</option>
          </select>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-sm" onclick="closeModal('submitWorkModal')">ยกเลิก</button>
          <button type="submit" class="btn-submit-action">🚀 ยืนยันการส่งงาน</button>
        </div>
      </form>
    </div>
  </div>

  <!-- REVENUE MODAL -->
  <div class="modal-overlay" id="revenueModal" style="z-index: 1260;">
    <div class="modal" style="max-width: 560px;">
      <div class="modal-header">
        <h3 style="display: flex; align-items: center; gap: 8px;">👑 จัดการงบประมาณและข้อมูลโอนเงิน (Admin Only)</h3>
        <button type="button" class="close-btn" onclick="closeModal('revenueModal')">✕</button>
      </div>
      <form onsubmit="handleSaveRevenue(event)">
        <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 14px;">
          กรอกงบประมาณของแต่ละฝ่าย พร้อมกำหนดวันโอนเงินและคำชี้แจง ข้อมูลจะถูกอัปเดตแบบเรียลไทม์ทันที:
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
          <div class="form-group" style="margin-bottom: 0;">
            <label>🎙️ ทีมพากย์ (บาท):</label>
            <input type="number" id="inputRevenueVoice" class="form-control" placeholder="0" min="0" step="any" required>
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label>🎬 ทีมแอนิเมชั่น (บาท):</label>
            <input type="number" id="inputRevenueAnim" class="form-control" placeholder="0" min="0" step="any" required>
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label>🎵 ทีมงานเสียง (บาท):</label>
            <input type="number" id="inputRevenueAudio" class="form-control" placeholder="0" min="0" step="any" required>
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label>✨ ทีมสนับสนุน (บาท):</label>
            <input type="number" id="inputRevenueOther" class="form-control" placeholder="0" min="0" step="any" required>
          </div>
        </div>

        <div class="form-group">
          <label>📌 หัวข้องวด / หมายเหตุภาพรวม:</label>
          <input type="text" id="inputRevenueNote" class="form-control" placeholder="เช่น ประจำงวด Episode 1 / งบเดือนสิงหาคม">
        </div>

        <hr style="border: none; border-top: 1px solid var(--glass-border); margin: 16px 0;">

        <div style="font-size: 0.86rem; font-weight: 700; color: #fbbf24; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
          💳 ข้อมูลกำหนดการโอนเงิน (แสดงให้ทุกคนในทีมอ่าน)
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
          <div class="form-group" style="margin-bottom: 0;">
            <label>📅 กำหนดวันโอนเงิน:</label>
            <input type="text" id="inputRevenueTransferDate" class="form-control" placeholder="เช่น 31 ส.ค. 2026 หรือ ทุกวันศุกร์สิ้นเดือน">
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label>🚦 สถานะการโอนเงิน:</label>
            <select id="inputRevenueTransferStatus" class="form-control">
              <option value="pending">⏳ กำลังสรุปยอด / รอโอน</option>
              <option value="processing">🔄 กำลังดำเนินการโอนเงิน</option>
              <option value="completed">✅ โอนเงินเรียบร้อยแล้ว</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>📝 คำอธิบายการโอนเงิน / ช่องทางส่งสลิป / หมายเหตุจากแอดมิน:</label>
          <textarea id="inputRevenueTransferDetails" class="form-control" style="min-height: 90px;" placeholder="เช่น โอนเข้าบัญชีที่แจ้งไว้ในแชทส่วนตัว หากท่านใดยังไม่ส่งเลขบัญชีกรุณาทักหาแอดมิน..."></textarea>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-sm" onclick="closeModal('revenueModal')">ยกเลิก</button>
          <button type="submit" class="btn-create-task" style="background: linear-gradient(135deg, rgba(251, 191, 36, 0.4), rgba(245, 158, 11, 0.6)); border-color: var(--amber); color: #fff;">
            💾 บันทึกงบประมาณ & แจ้งเตือนวันโอน
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- PROJECT NOTES MODAL -->
  <div class="modal-overlay" id="projectNotesModal">
    <div class="modal" style="max-width: 650px;">
      <div class="modal-header">
        <h3 style="display: flex; align-items: center; gap: 8px;">📝 สมุดโน้ตโปรเจกต์</h3>
        <button type="button" class="close-btn" onclick="closeModal('projectNotesModal')">✕</button>
      </div>
      <form onsubmit="handleSaveProjectNotes(event)">
        <div class="form-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <label style="margin-bottom: 0;">บันทึกข้อมูลประจำโปรเจกต์:</label>
            <span id="notesLastUpdatedInfo" style="font-size: 0.75rem; color: var(--text-muted);"></span>
          </div>
          <textarea id="projectNotesContent" class="form-control" style="min-height: 280px; font-size: 0.95rem; line-height: 1.6;" placeholder="พิมพ์บันทึกรายละเอียดของโปรเจกต์นี้ที่ทุกคนในทีมสามารถอ่านและแก้ไขร่วมกันได้..."></textarea>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-sm" onclick="closeModal('projectNotesModal')">ปิด</button>
          <button type="submit" class="btn-create-task">💾 บันทึกโน้ต</button>
        </div>
      </form>
    </div>
  </div>

  <!-- IDEA MODAL -->
  <div class="modal-overlay" id="ideaModal">
    <div class="modal" style="max-width: 480px;">
      <div class="modal-header">
        <h3 style="display: flex; align-items: center; gap: 8px;">💡 เสนอไอเดียใหม่ให้โปรเจกต์</h3>
        <button type="button" class="close-btn" onclick="closeModal('ideaModal')">✕</button>
      </div>
      <form onsubmit="handleSaveIdea(event)">
        <div class="form-group">
          <label>หัวข้อไอเดีย / Concept Idea *</label>
          <input type="text" id="ideaTitleInput" class="form-control" placeholder="เช่น เพิ่มฉากต่อสู้ตอนฝนตก, ปรับโทนแสงเป็นนีออนย้อนยุค" required>
        </div>
        <div class="form-group">
          <label>รายละเอียดไอเดีย / คอนเซ็ปต์ที่อยากเสนอ *</label>
          <textarea id="ideaStoryInput" class="form-control" placeholder="อธิบายแนวคิด ข้อดี หรือจุดเด่นของไอเดียนี้..." required></textarea>
        </div>
        <div class="form-group">
          <label>ลิ้งก์ตัวอย่างอ้างอิง / Moodboard (เช่น Pinterest, YouTube, Google Drive)</label>
          <input type="url" id="ideaLinkInput" class="form-control" placeholder="https://...">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-sm" onclick="closeModal('ideaModal')">ยกเลิก</button>
          <button type="submit" class="btn-idea-submit">🚀 โพสต์เสนอไอเดีย</button>
        </div>
      </form>
    </div>
  </div>

  <!-- PROJECT MODAL -->
  <div class="modal-overlay" id="projectModal">
    <div class="modal">
      <div class="modal-header">
        <h3>เพิ่มโปรเจกต์ใหม่</h3>
        <button type="button" class="close-btn" onclick="closeModal('projectModal')">✕</button>
      </div>
      <form onsubmit="handleCreateProject(event)">
        <div class="form-group">
          <label>ชื่อโปรเจกต์ *</label>
          <input type="text" id="projTitleInput" class="form-control" placeholder="เช่น Animation Episode 1, Web App" required>
        </div>
        <div class="form-group">
          <label>คำอธิบายสั้นๆ</label>
          <input type="text" id="projDescInput" class="form-control" placeholder="เป้าหมายทีมหรือขอบเขตงาน">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-sm" onclick="closeModal('projectModal')">ยกเลิก</button>
          <button type="submit" class="btn-create-task">บันทึกโปรเจกต์</button>
        </div>
      </form>
    </div>
  </div>

  <!-- TASK MODAL -->
  <div class="modal-overlay" id="taskModal">
    <div class="modal">
      <div class="modal-header">
        <h3 id="taskModalTitle">มอบหมายงานใหม่</h3>
        <button type="button" class="close-btn" onclick="closeModal('taskModal')">✕</button>
      </div>
      <form onsubmit="handleSaveTask(event)">
        <input type="hidden" id="taskIdInput">
        <div class="form-group">
          <label>ชื่องาน / Task Title *</label>
          <input type="text" id="taskTitleInput" class="form-control" placeholder="เช่น ออกแบบ Concept Art, ทำ 3D Rigging" required>
        </div>
        <div class="form-group">
          <label>มอบหมายให้ใคร (Assignee) *</label>
          <select id="taskAssigneeInput" class="form-control" required></select>
        </div>
        <div class="form-group">
          <label>รายละเอียด & สตอรี่งาน (Story / Requirements)</label>
          <textarea id="taskStoryInput" class="form-control" placeholder="อธิบายขั้นตอนงาน, คอนเซ็ปต์, ขอบเขตที่ต้องการ..."></textarea>
        </div>
        <div class="form-group">
          <label>สถานะเริ่มต้น</label>
          <select id="taskStatusInput" class="form-control">
            <option value="pending">🟡 รอดำเนินการ (Pending)</option>
            <option value="in_progress">🔵 กำลังทำ (In Progress)</option>
            <option value="completed">🟢 เสร็จสิ้น (Completed)</option>
          </select>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-sm" onclick="closeModal('taskModal')">ยกเลิก</button>
          <button type="submit" class="btn-create-task">บันทึกงาน</button>
        </div>
      </form>
    </div>
  </div>

  <!-- CREATE GROUP CHAT MODAL -->
  <div class="modal-overlay" id="createGroupChatModal" style="z-index: 1270;">
    <div class="modal" style="max-width: 480px;">
      <div class="modal-header">
        <h3 style="display: flex; align-items: center; gap: 8px;">👥 สร้างกลุ่มแชทส่วนตัวใหม่</h3>
        <button type="button" class="close-btn" onclick="closeModal('createGroupChatModal')">✕</button>
      </div>
      <form onsubmit="handleCreateGroupChat(event)">
        <div class="form-group">
          <label>ชื่อกลุ่มแชท (Group Name) *</label>
          <input type="text" id="createGroupNameInput" class="form-control" placeholder="เช่น ทีมพากย์เสียงหลัก, ฝ่ายทำ 3D Rigging" required>
        </div>

        <div class="form-group">
          <label>เลือกสมาชิกที่ต้องการดึงเข้ากลุ่ม (เลือกได้หลายคน):</label>
          <div class="group-members-select-list" id="groupMembersSelectList"></div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-sm" onclick="closeModal('createGroupChatModal')">ยกเลิก</button>
          <button type="submit" class="btn-create-task">🚀 สร้างกลุ่มแชท</button>
        </div>
      </form>
    </div>
  </div>

  <!-- SETTINGS & AUDIO HARDWARE MODAL -->
  <div class="modal-overlay" id="settingsModal" style="z-index: 1280;">
    <div class="modal" style="max-width: 520px;">
      <div class="modal-header">
        <h3 style="display: flex; align-items: center; gap: 8px;">⚙️ ตั้งค่าอุปกรณ์เสียง (Voice & Audio Hardware)</h3>
        <button type="button" class="close-btn" onclick="closeSettingsModal()">✕</button>
      </div>
      
      <div class="settings-body">
        <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 14px;">
          ระบบจะตรวจจับไมโครโฟนและลำโพงในอุปกรณ์ของคุณอัตโนมัติ เพื่อให้พร้อมสำหรับการคุยด้วยเสียง
        </p>

        <div class="form-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <label style="margin-bottom: 0;">🎙️ อุปกรณ์รับเสียง (Microphone Input):</label>
            <button type="button" class="btn-sm" style="padding: 2px 8px; font-size: 0.72rem;" onclick="refreshAudioDevices()">🔄 ค้นหาใหม่</button>
          </div>
          <select id="settingAudioInputSelect" class="form-control" onchange="handleAudioDeviceChange()"></select>
        </div>

        <div class="audio-test-box">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 0.8rem; font-weight: 600; color: #f8fafc;">ระดับเสียงไมโครโฟน (Live Mic Meter):</span>
            <button type="button" id="btnToggleMicTest" class="btn-sm" onclick="toggleMicTest()">🎙️ เริ่มทดสอบไมค์</button>
          </div>
          <div class="audio-meter-track">
            <div class="audio-meter-fill" id="audioMeterFill"></div>
          </div>
          <div id="micTestStatusText" style="font-size: 0.72rem; color: var(--text-muted); margin-top: 6px;">กดเริ่มทดสอบ แล้วลองพูดเพื่อดูการตอบสนองของไมค์</div>
        </div>

        <div class="form-group" style="margin-top: 14px;">
          <label>🔊 อุปกรณ์ส่งออกเสียง (Speaker / Output):</label>
          <select id="settingAudioOutputSelect" class="form-control" onchange="handleAudioDeviceChange()"></select>
        </div>

        <div class="audio-test-box">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 0.8rem; font-weight: 600; color: #f8fafc;">ทดสอบเสียงลำโพง (Speaker Test):</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">ส่งสัญญาณเสียงทดสอบเพื่อตรวจเช็กความชัดเจน</div>
            </div>
            <button type="button" class="btn-sm" onclick="testSpeakerSound()">🔔 เล่นเสียงทดสอบ</button>
          </div>
        </div>
      </div>

      <div class="modal-footer" style="margin-top: 16px;">
        <button type="button" class="btn-create-task" onclick="closeSettingsModal()" style="width: 100%; justify-content: center;">
          💾 บันทึกและเสร็จสิ้น
        </button>
      </div>
    </div>
  </div>

  <!-- ================= FORGOT & RESET PASSWORD MODAL ================= -->
  <div class="modal-overlay" id="forgotPasswordModal" style="z-index: 1350;">
    <div class="modal" style="max-width: 420px; text-align: center;">
      <div style="font-size: 2.6rem; margin-bottom: 8px;">🔑</div>
      <h3 style="color: #fff; margin-bottom: 6px;">รีเซ็ตรหัสผ่านผ่านอีเมล</h3>
      <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 16px;">
        ระบบจะส่งรหัส OTP 6 หลักไปยังอีเมลที่ลงทะเบียนไว้
      </p>

      <!-- ขั้นตอนที่ 1: กรอกอีเมลเพื่อขอรับ OTP -->
      <div id="forgotStep1">
        <form onsubmit="handleRequestPasswordResetOtp(event)">
          <div class="form-group" style="text-align: left;">
            <label>ระบุอีเมลที่ใช้ลงทะเบียนในระบบ *</label>
            <input type="email" id="forgotEmailInput" class="form-control" placeholder="example@gmail.com" required>
          </div>
          <div id="forgotErrorMsg1" class="auth-error-msg" style="display: none; margin-bottom: 12px;"></div>
          <button type="submit" class="btn-primary-auth" style="margin-top: 6px;">ส่งรหัส OTP ไปที่อีเมล</button>
        </form>
      </div>

      <!-- ขั้นตอนที่ 2: กรอกรหัส OTP และตั้งรหัสผ่านใหม่ -->
      <div id="forgotStep2" style="display: none; text-align: left;">
        <form onsubmit="handleResetPasswordSubmit(event)">
          <div class="form-group">
            <label>รหัส OTP 6 หลักที่ได้รับในอีเมล *</label>
            <input type="text" id="resetOtpCodeInput" class="form-control otp-input-box" placeholder="••••••" maxlength="6" required>
          </div>
          <div class="form-group">
            <label>รหัสผ่านใหม่ (อย่างน้อย 4 ตัวอักษร) *</label>
            <input type="password" id="resetNewPasswordInput" class="form-control" placeholder="กรอกรหัสผ่านใหม่" minlength="4" required>
          </div>
          <div class="form-group">
            <label>ยืนยันรหัสผ่านใหม่ *</label>
            <input type="password" id="resetConfirmPasswordInput" class="form-control" placeholder="กรอกรหัสผ่านใหม่อีกครั้ง" minlength="4" required>
          </div>
          <div id="forgotErrorMsg2" class="auth-error-msg" style="display: none; margin-bottom: 12px;"></div>
          <button type="submit" class="btn-primary-auth">บันทึกรหัสผ่านใหม่</button>
        </form>
      </div>

      <div style="margin-top: 14px; text-align: center;">
        <button type="button" class="btn-sm" onclick="closeModal('forgotPasswordModal')">ยกเลิก</button>
      </div>
    </div>
  </div>

  <script type="module" src="app.js"></script>
</body>
</html>
