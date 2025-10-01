// Modal Management
const modals = {
    watch: document.getElementById('watchModal'),
    room: document.getElementById('roomModal'),
    player: document.getElementById('playerModal'),
    login: document.getElementById('loginModal')
};

function showModal(modalName) {
    const modal = modals[modalName];
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function hideModal(modalName) {
    const modal = modals[modalName];
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

function hideAllModals() {
    Object.keys(modals).forEach(key => {
        hideModal(key);
    });
}

// Close modal when clicking outside
Object.values(modals).forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideAllModals();
        }
    });
});

// Close modal buttons
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        hideAllModals();
    });
});

// Escape key to close modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideAllModals();
    }
});

// Main CTA Button
document.querySelector('.btn-primary').addEventListener('click', () => {
    showModal('watch');
});

// Login Button
document.querySelector('.btn-login').addEventListener('click', () => {
    showModal('login');
});

// Watch Options
const optionCards = document.querySelectorAll('.option-card');
const urlSection = document.getElementById('urlSection');
const fileSection = document.getElementById('fileSection');
const screenSection = document.getElementById('screenSection');

optionCards.forEach(card => {
    card.addEventListener('click', () => {
        optionCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        urlSection.style.display = 'none';
        fileSection.style.display = 'none';
        screenSection.style.display = 'none';
        
        const type = card.dataset.type;
        switch(type) {
            case 'url':
                urlSection.style.display = 'block';
                break;
            case 'file':
                fileSection.style.display = 'block';
                break;
            case 'screen':
                screenSection.style.display = 'block';
                break;
        }
    });
});

// URL Input
const videoUrlInput = document.getElementById('videoUrl');
const createRoomBtn = document.getElementById('createRoom');

createRoomBtn.addEventListener('click', () => {
    const url = videoUrlInput.value.trim();
    if (!url) {
        alert('Пожалуйста, введите ссылку на видео');
        return;
    }
    
    if (!isValidVideoUrl(url)) {
        alert('Неподдерживаемый формат ссылки. Поддерживаются: YouTube, RUTUBE, VK Видео, Twitch, Vimeo');
        return;
    }
    
    createRoomBtn.textContent = 'Создание комнаты...';
    createRoomBtn.disabled = true;
    
    setTimeout(() => {
        hideModal('watch');
        showRoomModal(url);
        createRoomBtn.textContent = 'Создать комнату';
        createRoomBtn.disabled = false;
    }, 1500);
});

// File Upload
const fileDropZone = document.getElementById('fileDropZone');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const uploadFileBtn = document.getElementById('uploadFile');

fileDropZone.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFileSelection(file);
    }
});

fileDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileDropZone.style.borderColor = '#ff6b6b';
    fileDropZone.style.background = 'rgba(255, 107, 107, 0.1)';
});

fileDropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    fileDropZone.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    fileDropZone.style.background = 'transparent';
});

fileDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    fileDropZone.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    fileDropZone.style.background = 'transparent';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelection(files[0]);
    }
});

function handleFileSelection(file) {
    if (!file.type.startsWith('video/')) {
        alert('Пожалуйста, выберите видео-файл');
        return;
    }
    
    const fileName = file.name;
    const fileSize = formatFileSize(file.size);
    
    document.querySelector('.file-name').textContent = fileName;
    document.querySelector('.file-size').textContent = fileSize;
    fileInfo.style.display = 'block';
}

uploadFileBtn.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) {
        alert('Пожалуйста, выберите файл');
        return;
    }
    
    uploadFileBtn.textContent = 'Загрузка...';
    uploadFileBtn.disabled = true;
    
    setTimeout(() => {
        hideModal('watch');
        showRoomModal('file', file.name);
        uploadFileBtn.textContent = 'Загрузить и создать комнату';
        uploadFileBtn.disabled = false;
    }, 2000);
});

// Screen Share
const screenOptions = document.querySelectorAll('.screen-option');
const startScreenShareBtn = document.getElementById('startScreenShare');

screenOptions.forEach(option => {
    option.addEventListener('click', () => {
        screenOptions.forEach(o => o.classList.remove('active'));
        option.classList.add('active');
    });
});

startScreenShareBtn.addEventListener('click', () => {
    startScreenShareBtn.textContent = 'Запуск...';
    startScreenShareBtn.disabled = true;
    
    setTimeout(() => {
        hideModal('watch');
        showRoomModal('screen');
        startScreenShareBtn.textContent = 'Начать демонстрацию';
        startScreenShareBtn.disabled = false;
    }, 1000);
});

// Room Modal
function showRoomModal(type, data = '') {
    const roomLink = document.getElementById('roomLink');
    const roomId = generateRoomId();
    const roomUrl = `https://wparty.net/room/${roomId}`;
    
    roomLink.value = roomUrl;
    showModal('room');
    updateRoomStats();
}

function generateRoomId() {
    return Math.random().toString(36).substr(2, 9);
}

// Copy Room Link
document.getElementById('copyLink').addEventListener('click', () => {
    const roomLink = document.getElementById('roomLink');
    roomLink.select();
    document.execCommand('copy');
    
    const copyBtn = document.getElementById('copyLink');
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="fas fa-check"></i> Скопировано';
    
    setTimeout(() => {
        copyBtn.innerHTML = originalText;
    }, 2000);
});

// Join Room
document.getElementById('joinRoom').addEventListener('click', () => {
    hideModal('room');
    showPlayerModal();
});

// Player Modal
function showPlayerModal() {
    showModal('player');
    initializePlayer();
}

function initializePlayer() {
    const videoPlayer = document.getElementById('videoPlayer');
    const placeholder = videoPlayer.querySelector('.video-placeholder');
    
    setTimeout(() => {
        placeholder.innerHTML = `
            <div style="width: 100%; height: 100%; background: #000; display: flex; align-items: center; justify-content: center; color: #fff;">
                <div style="text-align: center;">
                    <i class="fas fa-play-circle" style="font-size: 4rem; color: #ff6b6b; margin-bottom: 1rem;"></i>
                    <p>Видео загружено и готово к просмотру</p>
                    <button class="btn-primary" style="margin-top: 1rem;" onclick="startVideo()">
                        <i class="fas fa-play"></i> Начать просмотр
                    </button>
                </div>
            </div>
        `;
    }, 1000);
}

// Video Controls
let isPlaying = false;
let currentTime = 0;
let duration = 180;

function startVideo() {
    isPlaying = true;
    const playBtn = document.getElementById('playBtn');
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    
    const progressInterval = setInterval(() => {
        if (isPlaying && currentTime < duration) {
            currentTime += 1;
            updateProgress();
        } else if (currentTime >= duration) {
            clearInterval(progressInterval);
            isPlaying = false;
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }, 1000);
}

function updateProgress() {
    const progress = document.getElementById('progress');
    const progressHandle = document.getElementById('progressHandle');
    const currentTimeDisplay = document.getElementById('currentTime');
    const totalTimeDisplay = document.getElementById('totalTime');
    
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = progressPercent + '%';
    progressHandle.style.left = progressPercent + '%';
    
    currentTimeDisplay.textContent = formatTime(currentTime);
    totalTimeDisplay.textContent = formatTime(duration);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Play/Pause Button
document.getElementById('playBtn').addEventListener('click', () => {
    if (isPlaying) {
        isPlaying = false;
        document.getElementById('playBtn').innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        startVideo();
    }
});

// Progress Bar
const progressBar = document.querySelector('.progress-bar');
progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    
    currentTime = Math.floor(percentage * duration);
    updateProgress();
});

// Volume Control
const volumeBtn = document.getElementById('volumeBtn');
const volumeSlider = document.getElementById('volumeSlider');

volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value;
    if (volume == 0) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else if (volume < 50) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
    } else {
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
});

// Fullscreen
document.getElementById('fullscreenBtn').addEventListener('click', () => {
    const playerModal = document.getElementById('playerModal');
    if (!document.fullscreenElement) {
        playerModal.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// Chat
const chatBtn = document.getElementById('chatBtn');
const chatContainer = document.getElementById('chatContainer');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendMessageBtn = document.getElementById('sendMessage');

chatBtn.addEventListener('click', () => {
    chatContainer.style.display = chatContainer.style.display === 'none' ? 'block' : 'none';
    chatBtn.classList.toggle('active');
});

sendMessageBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    messageElement.innerHTML = `
        <span class="message-author">Вы:</span>
        <span class="message-text">${message}</span>
    `;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatInput.value = '';
    
    setTimeout(() => {
        const responseElement = document.createElement('div');
        responseElement.className = 'chat-message';
        responseElement.innerHTML = `
            <span class="message-author">Друг:</span>
            <span class="message-text">Отличное видео!</span>
        `;
        chatMessages.appendChild(responseElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

// Sync Button
document.getElementById('syncBtn').addEventListener('click', () => {
    const syncBtn = document.getElementById('syncBtn');
    syncBtn.classList.toggle('active');
    
    if (syncBtn.classList.contains('active')) {
        syncBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Синхронизация включена';
    } else {
        syncBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Синхронизация';
    }
});

// Room Stats
function updateRoomStats() {
    const participantCount = document.querySelector('.room-stats .stat:first-child .stat-number');
    const timeCount = document.querySelector('.room-stats .stat:last-child .stat-number');
    
    let participants = 1;
    const participantInterval = setInterval(() => {
        participants += Math.floor(Math.random() * 2);
        participantCount.textContent = participants;
        
        if (participants >= 5) {
            clearInterval(participantInterval);
        }
    }, 2000);
    
    let seconds = 0;
    const timeInterval = setInterval(() => {
        seconds += 1;
        timeCount.textContent = formatTime(seconds);
    }, 1000);
}

// Login Tabs
const loginTabs = document.querySelectorAll('.tab-btn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

loginTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        loginTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        if (tab.dataset.tab === 'login') {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        } else {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        }
    });
});

// Social Login
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const platform = btn.classList.contains('google') ? 'Google' : 'VK';
        alert(`Вход через ${platform} будет реализован в полной версии`);
    });
});

// Utility Functions
function isValidVideoUrl(url) {
    const patterns = [
        /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/,
        /^https?:\/\/(www\.)?rutube\.ru/,
        /^https?:\/\/(www\.)?vk\.com\/video/,
        /^https?:\/\/(www\.)?twitch\.tv/,
        /^https?:\/\/(www\.)?vimeo\.com/
    ];
    
    return patterns.some(pattern => pattern.test(url));
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        header.style.background = 'rgba(10, 10, 10, 0.95)';
    }
});

// Feature cards hover effect
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add CSS for loading state
const style = document.createElement('style');
style.textContent = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #0a0a0a;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    body:not(.loaded)::after {
        content: 'WPARTY';
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #ff6b6b;
        font-size: 2rem;
        font-weight: 700;
        z-index: 10000;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
`;
document.head.appendChild(style);

// =====================
// NEW ADVANCED FEATURES
// =====================

// Settings Modal
const settingsModal = document.getElementById('settingsModal');
const settingsTabs = document.querySelectorAll('.settings-tab');
const settingsContentTabs = document.querySelectorAll('.settings-content-tab');

// Settings tabs
settingsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        settingsTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const tabName = tab.dataset.tab;
        settingsContentTabs.forEach(content => {
            content.style.display = 'none';
        });
        document.getElementById(tabName + 'Settings').style.display = 'block';
    });
});

// Settings functionality
document.getElementById('settingsBtn').addEventListener('click', () => {
    showModal('settings');
});

// Volume slider
const defaultVolumeSlider = document.getElementById('defaultVolume');
const volumeValue = document.getElementById('volumeValue');

defaultVolumeSlider.addEventListener('input', (e) => {
    volumeValue.textContent = e.target.value + '%';
});

// Playlist functionality
const playlistModal = document.getElementById('playlistModal');
const playlistBtn = document.getElementById('playlistBtn');
const addToPlaylistBtn = document.getElementById('addToPlaylist');
const shufflePlaylistBtn = document.getElementById('shufflePlaylist');
const playlistItems = document.getElementById('playlistItems');

playlistBtn.addEventListener('click', () => {
    showModal('playlist');
});

addToPlaylistBtn.addEventListener('click', () => {
    const url = prompt('Введите ссылку на видео для добавления в плейлист:');
    if (url && isValidVideoUrl(url)) {
        addVideoToPlaylist(url);
        showNotification('Видео добавлено в плейлист!');
    } else if (url) {
        showNotification('Неподдерживаемый формат ссылки', 'error');
    }
});

shufflePlaylistBtn.addEventListener('click', () => {
    const items = Array.from(playlistItems.children);
    const shuffled = items.sort(() => Math.random() - 0.5);
    playlistItems.innerHTML = '';
    shuffled.forEach(item => playlistItems.appendChild(item));
    showNotification('Плейлист перемешан!');
});

function addVideoToPlaylist(url) {
    const playlistItem = document.createElement('div');
    playlistItem.className = 'playlist-item';
    playlistItem.innerHTML = `
        <div class="playlist-thumbnail">
            <img src="https://via.placeholder.com/120x68/8b5cf6/ffffff?text=New+Video" alt="New Video">
            <div class="playlist-duration">4:20</div>
        </div>
        <div class="playlist-info">
            <h4>Новое видео</h4>
            <p>Добавлено в плейлист</p>
        </div>
        <div class="playlist-actions">
            <button class="playlist-action-btn" title="Удалить" onclick="removeFromPlaylist(this)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    playlistItems.appendChild(playlistItem);
}

function removeFromPlaylist(btn) {
    btn.closest('.playlist-item').remove();
    showNotification('Видео удалено из плейлиста');
}

// Participants functionality
const participantsModal = document.getElementById('participantsModal');
const participantsBtn = document.getElementById('participantsBtn');
const participantCount = document.getElementById('participantCount');
const participantsList = document.getElementById('participantsList');

participantsBtn.addEventListener('click', () => {
    showModal('participants');
    updateParticipantsList();
});

function updateParticipantsList() {
    // Simulate participants joining
    const participants = [
        { name: 'Алексей', status: 'online', isHost: false },
        { name: 'Мария', status: 'online', isHost: false },
        { name: 'Дмитрий', status: 'away', isHost: false }
    ];
    
    participantsList.innerHTML = `
        <div class="participant-item host">
            <div class="participant-avatar">
                <img src="https://via.placeholder.com/40x40/ff6b6b/ffffff?text=H" alt="Host">
            </div>
            <div class="participant-info">
                <h4>Вы (Хост)</h4>
                <span class="participant-status">Онлайн</span>
            </div>
            <div class="participant-actions">
                <button class="participant-action-btn" title="Настройки">
                    <i class="fas fa-cog"></i>
                </button>
            </div>
        </div>
    `;
    
    participants.forEach(participant => {
        const participantItem = document.createElement('div');
        participantItem.className = 'participant-item';
        participantItem.innerHTML = `
            <div class="participant-avatar">
                <img src="https://via.placeholder.com/40x40/6366f1/ffffff?text=${participant.name[0]}" alt="${participant.name}">
            </div>
            <div class="participant-info">
                <h4>${participant.name}</h4>
                <span class="participant-status">${participant.status === 'online' ? 'Онлайн' : 'Отошел'}</span>
            </div>
            <div class="participant-actions">
                <button class="participant-action-btn" title="Настройки">
                    <i class="fas fa-cog"></i>
                </button>
            </div>
        `;
        participantsList.appendChild(participantItem);
    });
    
    participantCount.textContent = participants.length + 1;
}

// Invite functionality
document.getElementById('inviteLink').addEventListener('click', () => {
    const roomLink = document.getElementById('roomLink').value;
    navigator.clipboard.writeText(roomLink).then(() => {
        showNotification('Ссылка скопирована в буфер обмена!');
    });
});

document.getElementById('inviteQR').addEventListener('click', () => {
    showNotification('QR код будет сгенерирован в полной версии');
});

document.getElementById('inviteSocial').addEventListener('click', () => {
    if (navigator.share) {
        navigator.share({
            title: 'Присоединяйтесь к просмотру видео!',
            text: 'Смотрите видео вместе со мной на WPARTY',
            url: document.getElementById('roomLink').value
        });
    } else {
        showNotification('Поделиться ссылкой через социальные сети');
    }
});

// Reactions functionality
const reactionsPanel = document.getElementById('reactionsPanel');
const reactionsBtn = document.getElementById('reactionsBtn');
const reactionBtns = document.querySelectorAll('.reaction-btn');

reactionsBtn.addEventListener('click', () => {
    reactionsPanel.classList.toggle('show');
});

reactionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const reaction = btn.dataset.reaction;
        showReaction(reaction);
        reactionsPanel.classList.remove('show');
    });
});

function showReaction(reaction) {
    // Create floating reaction
    const reactionElement = document.createElement('div');
    reactionElement.className = 'floating-reaction';
    reactionElement.textContent = reaction;
    reactionElement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 3rem;
        z-index: 5000;
        pointer-events: none;
        animation: reactionFloat 3s ease-out forwards;
    `;
    
    document.body.appendChild(reactionElement);
    
    setTimeout(() => {
        reactionElement.remove();
    }, 3000);
    
    // Add reaction to chat
    const chatMessages = document.getElementById('chatMessages');
    const reactionMessage = document.createElement('div');
    reactionMessage.className = 'chat-message reaction-message';
    reactionMessage.innerHTML = `
        <span class="message-author">Вы:</span>
        <span class="message-text">${reaction}</span>
    `;
    chatMessages.appendChild(reactionMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Voice chat functionality
const voiceChatPanel = document.getElementById('voiceChatPanel');
const voiceBtn = document.getElementById('voiceBtn');
const muteBtn = document.getElementById('muteBtn');
const deafenBtn = document.getElementById('deafenBtn');
const settingsVoiceBtn = document.getElementById('settingsVoiceBtn');

let isMuted = false;
let isDeafened = false;

voiceBtn.addEventListener('click', () => {
    voiceChatPanel.classList.toggle('show');
});

muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    muteBtn.classList.toggle('muted', isMuted);
    muteBtn.innerHTML = isMuted ? '<i class="fas fa-microphone-slash"></i>' : '<i class="fas fa-microphone"></i>';
    showNotification(isMuted ? 'Микрофон отключен' : 'Микрофон включен');
});

deafenBtn.addEventListener('click', () => {
    isDeafened = !isDeafened;
    deafenBtn.classList.toggle('muted', isDeafened);
    deafenBtn.innerHTML = isDeafened ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    showNotification(isDeafened ? 'Звук отключен' : 'Звук включен');
});

settingsVoiceBtn.addEventListener('click', () => {
    showNotification('Настройки голосового чата будут доступны в полной версии');
});

// Notification system
const notificationToast = document.getElementById('notificationToast');
const toastMessage = document.querySelector('.toast-message');
const toastClose = document.querySelector('.toast-close');

function showNotification(message, type = 'info') {
    const icons = {
        info: 'fas fa-info-circle',
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle'
    };
    
    const colors = {
        info: '#ff6b6b',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b'
    };
    
    const icon = icons[type] || icons.info;
    const color = colors[type] || colors.info;
    
    toastMessage.textContent = message;
    notificationToast.querySelector('i').className = icon;
    notificationToast.querySelector('i').style.color = color;
    notificationToast.classList.add('show');
    
    setTimeout(() => {
        notificationToast.classList.remove('show');
    }, 4000);
}

toastClose.addEventListener('click', () => {
    notificationToast.classList.remove('show');
});

// Add reaction animation CSS
const reactionStyle = document.createElement('style');
reactionStyle.textContent = `
    @keyframes reactionFloat {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.5);
        }
        50% {
            opacity: 1;
            transform: translate(-50%, -80%) scale(1.2);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -120%) scale(1);
        }
    }
    
    .reaction-message {
        background: rgba(255, 107, 107, 0.1) !important;
        border: 1px solid rgba(255, 107, 107, 0.3) !important;
    }
    
    .reaction-message .message-text {
        font-size: 1.5rem;
    }
`;
document.head.appendChild(reactionStyle);

// Enhanced chat with timestamps
function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const showTimestamps = document.getElementById('showTimestamps')?.checked ?? true;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    messageElement.innerHTML = `
        <span class="message-author">Вы:</span>
        <span class="message-text">${message}</span>
        ${showTimestamps ? `<span class="message-time">${timeString}</span>` : ''}
    `;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatInput.value = '';
    
    // Simulate other user response
    setTimeout(() => {
        const responseElement = document.createElement('div');
        responseElement.className = 'chat-message';
        responseElement.innerHTML = `
            <span class="message-author">Друг:</span>
            <span class="message-text">Отличное видео!</span>
            ${showTimestamps ? `<span class="message-time">${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>` : ''}
        `;
        chatMessages.appendChild(responseElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Space bar to play/pause
    if (e.code === 'Space' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        if (document.getElementById('playBtn')) {
            document.getElementById('playBtn').click();
        }
    }
    
    // M key to mute/unmute
    if (e.code === 'KeyM' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        if (muteBtn) {
            muteBtn.click();
        }
    }
    
    // C key to toggle chat
    if (e.code === 'KeyC' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        if (chatBtn) {
            chatBtn.click();
        }
    }
    
    // F key for fullscreen
    if (e.code === 'KeyF' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        if (document.getElementById('fullscreenBtn')) {
            document.getElementById('fullscreenBtn').click();
        }
    }
});

// Auto-save settings
function saveSettings() {
    const settings = {
        username: document.getElementById('username')?.value || 'Гость',
        language: document.getElementById('language')?.value || 'ru',
        theme: document.getElementById('theme')?.value || 'dark',
        videoQuality: document.getElementById('videoQuality')?.value || 'auto',
        autoplay: document.getElementById('autoplay')?.checked ?? true,
        loop: document.getElementById('loop')?.checked ?? true,
        defaultVolume: document.getElementById('defaultVolume')?.value || '80',
        muteOnJoin: document.getElementById('muteOnJoin')?.checked ?? true,
        chatColor: document.getElementById('chatColor')?.value || '#ff6b6b',
        soundNotifications: document.getElementById('soundNotifications')?.checked ?? true,
        showTimestamps: document.getElementById('showTimestamps')?.checked ?? true
    };
    
    localStorage.setItem('wparty-settings', JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem('wparty-settings');
    if (saved) {
        const settings = JSON.parse(saved);
        
        Object.keys(settings).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = settings[key];
                } else {
                    element.value = settings[key];
                }
            }
        });
    }
}

// Load settings on page load
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    
    // Save settings on change
    document.querySelectorAll('#settingsModal input, #settingsModal select').forEach(element => {
        element.addEventListener('change', saveSettings);
    });
});

// Enhanced room stats with real-time updates
function updateRoomStats() {
    const participantCount = document.querySelector('.room-stats .stat:first-child .stat-number');
    const timeCount = document.querySelector('.room-stats .stat:last-child .stat-number');
    
    // Simulate participants joining
    let participants = 1;
    const participantInterval = setInterval(() => {
        participants += Math.floor(Math.random() * 2);
        participantCount.textContent = participants;
        
        if (participants >= 8) {
            clearInterval(participantInterval);
        }
    }, 3000);
    
    // Simulate time passing
    let seconds = 0;
    const timeInterval = setInterval(() => {
        seconds += 1;
        timeCount.textContent = formatTime(seconds);
    }, 1000);
    
    // Update viewers count in player
    const viewersCount = document.querySelector('.viewers-count');
    if (viewersCount) {
        setInterval(() => {
            viewersCount.textContent = `👥 ${participants} участник${participants > 1 ? 'ов' : ''}`;
        }, 1000);
    }
}

// =====================
// ADVANCED FEATURES INITIALIZATION
// =====================

// Initialize advanced features
function initializeAdvancedFeatures() {
    // Auto-hide reactions panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!reactionsPanel.contains(e.target) && !reactionsBtn.contains(e.target)) {
            reactionsPanel.classList.remove('show');
        }
        
        if (!voiceChatPanel.contains(e.target) && !voiceBtn.contains(e.target)) {
            voiceChatPanel.classList.remove('show');
        }
    });
    
    // Initialize voice chat simulation
    simulateVoiceActivity();
    
    // Initialize reaction animations
    initializeReactionAnimations();
    
    // Initialize advanced chat features
    initializeAdvancedChat();
}

// Simulate voice activity
function simulateVoiceActivity() {
    const voiceIndicators = document.querySelectorAll('.voice-indicator');
    
    setInterval(() => {
        voiceIndicators.forEach(indicator => {
            if (Math.random() < 0.3) {
                indicator.classList.add('speaking');
                setTimeout(() => {
                    indicator.classList.remove('speaking');
                }, 1000);
            }
        });
    }, 3000);
}

// Initialize reaction animations
function initializeReactionAnimations() {
    // Add random reactions from other users
    setInterval(() => {
        if (Math.random() < 0.1) {
            const reactions = ['👍', '👎', '❤️', '😂', '😮', '😢', '😡', '🎉'];
            const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
            
            const chatMessages = document.getElementById('chatMessages');
            const reactionMessage = document.createElement('div');
            reactionMessage.className = 'chat-message reaction-message';
            reactionMessage.innerHTML = `
                <span class="message-author">Друг:</span>
                <span class="message-text">${randomReaction}</span>
            `;
            chatMessages.appendChild(reactionMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }, 5000);
}

// Initialize advanced chat features
function initializeAdvancedChat() {
    // Add typing indicators
    let typingTimeout;
    
    chatInput.addEventListener('input', () => {
        // Show typing indicator
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'block';
        }
        
        // Clear previous timeout
        clearTimeout(typingTimeout);
        
        // Hide typing indicator after 2 seconds
        typingTimeout = setTimeout(() => {
            if (typingIndicator) {
                typingIndicator.style.display = 'none';
            }
        }, 2000);
    });
    
    // Add message reactions
    document.addEventListener('click', (e) => {
        if (e.target.closest('.chat-message') && e.target.closest('.message-text')) {
            const message = e.target.closest('.chat-message');
            if (!message.querySelector('.message-reactions')) {
                addMessageReactions(message);
            }
        }
    });
}

// Add reactions to messages
function addMessageReactions(message) {
    const reactionsContainer = document.createElement('div');
    reactionsContainer.className = 'message-reactions';
    reactionsContainer.innerHTML = `
        <button class="reaction-btn-small" data-reaction="👍">👍</button>
        <button class="reaction-btn-small" data-reaction="❤️">❤️</button>
        <button class="reaction-btn-small" data-reaction="😂">😂</button>
        <button class="reaction-btn-small" data-reaction="😮">😮</button>
    `;
    
    message.appendChild(reactionsContainer);
    
    // Add click handlers
    reactionsContainer.querySelectorAll('.reaction-btn-small').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const reaction = btn.dataset.reaction;
            btn.classList.add('reacted');
            btn.textContent = reaction + ' 1';
            showNotification(`Вы поставили реакцию ${reaction}`);
        });
    });
}

// Add CSS for new features
const advancedStyle = document.createElement('style');
advancedStyle.textContent = `
    .message-reactions {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
        padding-top: 0.5rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .reaction-btn-small {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
        color: #ffffff;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.8rem;
    }
    
    .reaction-btn-small:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .reaction-btn-small.reacted {
        background: rgba(255, 107, 107, 0.2);
        border-color: #ff6b6b;
    }
    
    .typing-indicator {
        display: none;
        color: #a0a0a0;
        font-style: italic;
        font-size: 0.9rem;
        padding: 0.5rem 1rem;
    }
    
    .typing-indicator.show {
        display: block;
    }
    
    .typing-dots {
        display: inline-block;
        animation: typing 1.5s infinite;
    }
    
    @keyframes typing {
        0%, 60%, 100% { opacity: 0.3; }
        30% { opacity: 1; }
    }
`;
document.head.appendChild(advancedStyle);

// Initialize advanced features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeAdvancedFeatures();
    
    // Check for selected movie from catalog with delay to ensure DOM is ready
    setTimeout(() => {
        checkForSelectedMovie();
    }, 100);
});

// Check for selected movie from catalog
function checkForSelectedMovie() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('movie');
    
    console.log('Checking for selected movie:', movieId);
    
    if (movieId) {
        const selectedMovie = localStorage.getItem('selectedMovie');
        console.log('Selected movie from localStorage:', selectedMovie);
        
        if (selectedMovie) {
            try {
                const movie = JSON.parse(selectedMovie);
                console.log('Parsed movie:', movie);
                loadSelectedMovie(movie);
            } catch (error) {
                console.error('Error parsing selected movie:', error);
            }
        } else {
            console.log('No selected movie found in localStorage');
        }
    } else {
        console.log('No movie ID in URL parameters');
    }
}

// Load selected movie from catalog
function loadSelectedMovie(movie) {
    try {
        console.log('Loading selected movie:', movie);
        
        // Update video title
        const videoTitle = document.getElementById('videoTitle');
        if (videoTitle) {
            videoTitle.textContent = movie.title || 'Неизвестный фильм';
            console.log('Video title updated:', videoTitle.textContent);
        } else {
            console.log('Video title element not found');
        }
        
        // Update video placeholder with movie poster
        const videoPlaceholder = document.querySelector('.video-placeholder');
        if (videoPlaceholder) {
            console.log('Video placeholder found, updating with movie poster');
            const fallbackPoster = `https://via.placeholder.com/800x450/1a1a1a/ffffff?text=${encodeURIComponent(movie.title || 'Movie')}`;
            const posterUrl = movie.poster || fallbackPoster;
            
            videoPlaceholder.innerHTML = `
                <div style="position: relative; width: 100%; height: 100%; background: linear-gradient(135deg, #1a1a1a, #2a2a2a); border-radius: 8px; overflow: hidden;">
                    <img src="${posterUrl}" alt="${movie.title || 'Movie'}" 
                         style="width: 100%; height: 100%; object-fit: cover; opacity: 0.3;"
                         onerror="this.src='${fallbackPoster}'">
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: #ffffff; padding: 1rem;">
                        <h2 style="font-size: 2rem; margin-bottom: 1rem; color: #ff6b6b; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">${movie.title || 'Неизвестный фильм'}</h2>
                        <p style="font-size: 1.2rem; margin-bottom: 0.5rem; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">${movie.year || 'Неизвестно'} • ${movie.duration || 'Неизвестно'}</p>
                        <div style="display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                            <div style="color: #fbbf24;">
                                ${generateStars(movie.rating || 0)}
                            </div>
                            <span style="color: #a0a0a0; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">${movie.rating || 'Н/Д'}</span>
                        </div>
                        <div style="display: flex; justify-content: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
                            ${(movie.genres || []).map(genre => `<span style="background: rgba(255, 107, 107, 0.2); border: 1px solid rgba(255, 107, 107, 0.3); border-radius: 4px; padding: 0.25rem 0.5rem; font-size: 0.8rem; color: #ff6b6b; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">${genre}</span>`).join('')}
                        </div>
                        <p style="margin-top: 1rem; color: #a0a0a0; max-width: 600px; line-height: 1.5; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">${movie.description || 'Описание недоступно'}</p>
                        ${movie.kinopoiskId ? `<p style="margin-top: 0.5rem; color: #8b5cf6; font-size: 0.9rem; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">Кинопоиск ID: ${movie.kinopoiskId}</p>` : ''}
                    </div>
                </div>
            `;
        } else {
            console.log('Video placeholder not found');
        }
        
        // Add movie to playlist automatically
        addMovieToPlaylist(movie);
        console.log('Movie added to playlist');
        
        // Show notification
        showNotification(`Загружен фильм: "${movie.title || 'Неизвестный фильм'}"`, 'success');
        console.log('Notification shown');
        
        // Update room stats if available
        updateRoomStatsForMovie(movie);
        console.log('Room stats updated');
        
    } catch (error) {
        console.error('Ошибка загрузки фильма:', error);
        showNotification('Ошибка загрузки фильма', 'error');
    }
}

// Update room stats for selected movie
function updateRoomStatsForMovie(movie) {
    const roomStats = document.querySelector('.room-stats');
    if (roomStats) {
        // Add movie info to room stats
        const movieInfo = document.createElement('div');
        movieInfo.className = 'stat';
        movieInfo.innerHTML = `
            <span class="stat-number">${movie.year || 'Н/Д'}</span>
            <span class="stat-label">Год</span>
        `;
        roomStats.appendChild(movieInfo);
    }
}

// Generate stars for rating
function generateStars(rating) {
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 1;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    // Полные звезды
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // Половина звезды
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Пустые звезды
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Add movie to playlist
function addMovieToPlaylist(movie) {
    const playlistItems = document.getElementById('playlistItems');
    if (!playlistItems) return;
    
    // Check if movie is already in playlist
    const existingItem = playlistItems.querySelector(`[data-movie-id="${movie.id}"]`);
    if (existingItem) return;
    
    const playlistItem = document.createElement('div');
    playlistItem.className = 'playlist-item';
    playlistItem.setAttribute('data-movie-id', movie.id);
    playlistItem.innerHTML = `
        <div class="playlist-thumbnail">
            <img src="${movie.poster}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/120x68/1a1a1a/ffffff?text=No+Image'">
            <div class="playlist-duration">${movie.duration}</div>
        </div>
        <div class="playlist-info">
            <h4>${movie.title}</h4>
            <p>${movie.year} • ${movie.rating} ⭐</p>
        </div>
        <div class="playlist-actions">
            <button class="playlist-action-btn" title="Удалить" onclick="removeFromPlaylist(this)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    playlistItems.appendChild(playlistItem);
}
