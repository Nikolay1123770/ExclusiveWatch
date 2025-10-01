// Видеоплеер с поддержкой различных источников
class VideoPlayer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentVideo = null;
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
        this.volume = 1;
        this.isMuted = false;
        this.playbackRate = 1;
        this.listeners = [];
        
        this.init();
    }
    
    init() {
        this.createPlayerHTML();
        this.setupEventListeners();
    }
    
    createPlayerHTML() {
        this.container.innerHTML = `
            <div class="video-player-container">
                <div class="video-wrapper">
                    <div id="videoContainer" class="video-container">
                        <div class="video-placeholder">
                            <div class="placeholder-content">
                                <i class="fas fa-play-circle"></i>
                                <p>Выберите видео для воспроизведения</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="video-controls">
                    <div class="control-row">
                        <button class="control-btn play-pause-btn" onclick="videoPlayer.togglePlay()">
                            <i class="fas fa-play"></i>
                        </button>
                        
                        <div class="time-display">
                            <span class="current-time">00:00</span>
                            <span class="time-separator">/</span>
                            <span class="total-time">00:00</span>
                        </div>
                        
                        <div class="progress-container">
                            <div class="progress-bar" onclick="videoPlayer.seek(event)">
                                <div class="progress-fill"></div>
                                <div class="progress-handle"></div>
                            </div>
                        </div>
                        
                        <div class="volume-control">
                            <button class="control-btn volume-btn" onclick="videoPlayer.toggleMute()">
                                <i class="fas fa-volume-up"></i>
                            </button>
                            <input type="range" class="volume-slider" min="0" max="100" value="100" 
                                   onchange="videoPlayer.setVolume(this.value / 100)">
                        </div>
                        
                        <div class="playback-rate">
                            <select class="rate-select" onchange="videoPlayer.setPlaybackRate(this.value)">
                                <option value="0.5">0.5x</option>
                                <option value="0.75">0.75x</option>
                                <option value="1" selected>1x</option>
                                <option value="1.25">1.25x</option>
                                <option value="1.5">1.5x</option>
                                <option value="2">2x</option>
                            </select>
                        </div>
                        
                        <button class="control-btn fullscreen-btn" onclick="videoPlayer.toggleFullscreen()">
                            <i class="fas fa-expand"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.videoContainer = document.getElementById('videoContainer');
        this.progressBar = this.container.querySelector('.progress-bar');
        this.progressFill = this.container.querySelector('.progress-fill');
        this.currentTimeDisplay = this.container.querySelector('.current-time');
        this.totalTimeDisplay = this.container.querySelector('.total-time');
        this.playPauseBtn = this.container.querySelector('.play-pause-btn');
        this.volumeBtn = this.container.querySelector('.volume-btn');
    }
    
    setupEventListeners() {
        // Обновление прогресса каждую секунду
        setInterval(() => {
            this.updateProgress();
        }, 1000);
        
        // Обработка клавиш
        document.addEventListener('keydown', (e) => {
            if (this.currentVideo) {
                switch(e.code) {
                    case 'Space':
                        e.preventDefault();
                        this.togglePlay();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.seekTo(this.currentTime - 10);
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.seekTo(this.currentTime + 10);
                        break;
                    case 'KeyM':
                        e.preventDefault();
                        this.toggleMute();
                        break;
                    case 'KeyF':
                        e.preventDefault();
                        this.toggleFullscreen();
                        break;
                }
            }
        });
    }
    
    loadVideo(videoData) {
        this.currentVideo = videoData;
        
        // Очищаем контейнер
        this.videoContainer.innerHTML = '';
        
        // Определяем тип видео и создаем соответствующий плеер
        if (this.isYouTubeUrl(videoData.videoUrl)) {
            this.loadYouTubeVideo(videoData);
        } else if (this.isVimeoUrl(videoData.videoUrl)) {
            this.loadVimeoVideo(videoData);
        } else if (this.isDirectVideoUrl(videoData.videoUrl)) {
            this.loadDirectVideo(videoData);
        } else {
            this.showVideoInfo(videoData);
        }
        
        // Уведомляем слушателей
        this.notifyListeners('videoLoaded', videoData);
    }
    
    isYouTubeUrl(url) {
        return url.includes('youtube.com') || url.includes('youtu.be');
    }
    
    isVimeoUrl(url) {
        return url.includes('vimeo.com');
    }
    
    isDirectVideoUrl(url) {
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.mkv'];
        return videoExtensions.some(ext => url.toLowerCase().includes(ext));
    }
    
    loadYouTubeVideo(videoData) {
        const videoId = this.extractYouTubeId(videoData.videoUrl);
        if (!videoId) {
            this.showVideoInfo(videoData);
            return;
        }
        
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`;
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        
        this.videoContainer.appendChild(iframe);
        this.setupYouTubeAPI(iframe);
    }
    
    extractYouTubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
    
    setupYouTubeAPI(iframe) {
        // YouTube API будет загружен асинхронно
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    }
    
    loadVimeoVideo(videoData) {
        const videoId = this.extractVimeoId(videoData.videoUrl);
        if (!videoId) {
            this.showVideoInfo(videoData);
            return;
        }
        
        const iframe = document.createElement('iframe');
        iframe.src = `https://player.vimeo.com/video/${videoId}`;
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.frameBorder = '0';
        iframe.allow = 'autoplay; fullscreen; picture-in-picture';
        iframe.allowFullscreen = true;
        
        this.videoContainer.appendChild(iframe);
    }
    
    extractVimeoId(url) {
        const regExp = /vimeo\.com\/(\d+)/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }
    
    loadDirectVideo(videoData) {
        const video = document.createElement('video');
        video.src = videoData.videoUrl;
        video.controls = false;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'contain';
        
        // Обработчики событий
        video.addEventListener('loadedmetadata', () => {
            this.duration = video.duration;
            this.updateTimeDisplay();
        });
        
        video.addEventListener('timeupdate', () => {
            this.currentTime = video.currentTime;
            this.updateProgress();
        });
        
        video.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayButton();
        });
        
        video.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayButton();
        });
        
        video.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updatePlayButton();
        });
        
        this.videoContainer.appendChild(video);
        this.videoElement = video;
    }
    
    showVideoInfo(videoData) {
        this.videoContainer.innerHTML = `
            <div class="video-info-display">
                <div class="video-poster">
                    <img src="${videoData.poster}" alt="${videoData.title}" 
                         onerror="this.src='https://via.placeholder.com/800x450/1a1a1a/ffffff?text=No+Image'">
                    <div class="play-overlay" onclick="videoPlayer.playVideo()">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="video-details">
                    <h2>${videoData.title}</h2>
                    <p class="video-meta">${videoData.year} • ${videoData.duration} • ${videoData.director}</p>
                    <div class="video-rating">
                        <div class="stars">${this.generateStars(videoData.rating)}</div>
                        <span>${videoData.rating}</span>
                    </div>
                    <div class="video-genres">
                        ${videoData.genres.map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
                    </div>
                    <p class="video-description">${videoData.description}</p>
                    <div class="video-actions">
                        <button class="btn btn-primary" onclick="videoPlayer.playVideo()">
                            <i class="fas fa-play"></i>
                            Воспроизвести
                        </button>
                        <button class="btn btn-secondary" onclick="videoPlayer.openInNewTab()">
                            <i class="fas fa-external-link-alt"></i>
                            Открыть в новой вкладке
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    playVideo() {
        if (this.currentVideo && this.currentVideo.videoUrl) {
            window.open(this.currentVideo.videoUrl, '_blank');
        }
    }
    
    openInNewTab() {
        if (this.currentVideo && this.currentVideo.videoUrl) {
            window.open(this.currentVideo.videoUrl, '_blank');
        }
    }
    
    togglePlay() {
        if (this.videoElement) {
            if (this.isPlaying) {
                this.videoElement.pause();
            } else {
                this.videoElement.play();
            }
        } else {
            this.playVideo();
        }
    }
    
    seek(event) {
        if (!this.videoElement || !this.duration) return;
        
        const rect = this.progressBar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * this.duration;
        
        this.seekTo(newTime);
    }
    
    seekTo(time) {
        if (this.videoElement) {
            this.videoElement.currentTime = time;
            this.currentTime = time;
            this.updateProgress();
        }
    }
    
    setVolume(volume) {
        this.volume = volume;
        if (this.videoElement) {
            this.videoElement.volume = volume;
        }
        this.updateVolumeButton();
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.videoElement) {
            this.videoElement.muted = this.isMuted;
        }
        this.updateVolumeButton();
    }
    
    setPlaybackRate(rate) {
        this.playbackRate = parseFloat(rate);
        if (this.videoElement) {
            this.videoElement.playbackRate = this.playbackRate;
        }
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.container.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    
    updateProgress() {
        if (!this.duration) return;
        
        const percentage = (this.currentTime / this.duration) * 100;
        this.progressFill.style.width = `${percentage}%`;
        this.updateTimeDisplay();
    }
    
    updateTimeDisplay() {
        this.currentTimeDisplay.textContent = this.formatTime(this.currentTime);
        this.totalTimeDisplay.textContent = this.formatTime(this.duration);
    }
    
    updatePlayButton() {
        const icon = this.playPauseBtn.querySelector('i');
        if (this.isPlaying) {
            icon.className = 'fas fa-pause';
        } else {
            icon.className = 'fas fa-play';
        }
    }
    
    updateVolumeButton() {
        const icon = this.volumeBtn.querySelector('i');
        if (this.isMuted || this.volume === 0) {
            icon.className = 'fas fa-volume-mute';
        } else if (this.volume < 0.5) {
            icon.className = 'fas fa-volume-down';
        } else {
            icon.className = 'fas fa-volume-up';
        }
    }
    
    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '00:00';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }
    
    generateStars(rating) {
        const fullStars = Math.floor(rating / 2);
        const hasHalfStar = rating % 2 >= 1;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        return stars;
    }
    
    // Система событий для синхронизации
    addEventListener(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }
    
    notifyListeners(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }
    
    // Методы для синхронизации между участниками
    getCurrentState() {
        return {
            currentTime: this.currentTime,
            isPlaying: this.isPlaying,
            volume: this.volume,
            playbackRate: this.playbackRate
        };
    }
    
    setState(state) {
        if (state.currentTime !== undefined) {
            this.seekTo(state.currentTime);
        }
        if (state.isPlaying !== undefined && state.isPlaying !== this.isPlaying) {
            this.togglePlay();
        }
        if (state.volume !== undefined) {
            this.setVolume(state.volume);
        }
        if (state.playbackRate !== undefined) {
            this.setPlaybackRate(state.playbackRate);
        }
    }
}

// Глобальный экземпляр плеера
let videoPlayer;
