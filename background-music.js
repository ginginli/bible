/**
 * 背景音乐播放器
 * 用户可选择开启/关闭
 */

class BackgroundMusic {
    constructor(audioUrl) {
        this.audio = new Audio(audioUrl);
        this.audio.loop = true;
        this.audio.volume = 0.3; // 30% 音量
        this.isPlaying = false;
        
        // 从 localStorage 读取用户偏好
        this.userPreference = localStorage.getItem('bgMusicEnabled') === 'true';
        
        this.init();
    }
    
    init() {
        // 创建音乐控制按钮
        this.createMusicButton();
        
        // 如果用户之前开启了音乐，自动播放
        if (this.userPreference) {
            this.play();
        }
    }
    
    createMusicButton() {
        // 创建浮动音乐按钮
        const button = document.createElement('button');
        button.id = 'music-toggle';
        button.innerHTML = this.isPlaying ? '🔊' : '🔇';
        button.title = 'Toggle background music';
        
        // 样式
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #5B4B63, #A67C00);
            border: none;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 9999;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // 悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        });
        
        // 点击切换
        button.addEventListener('click', () => {
            this.toggle();
            button.innerHTML = this.isPlaying ? '🔊' : '🔇';
        });
        
        document.body.appendChild(button);
        this.button = button;
    }
    
    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            localStorage.setItem('bgMusicEnabled', 'true');
            if (this.button) {
                this.button.innerHTML = '🔊';
            }
        }).catch(err => {
            console.log('Audio play failed:', err);
        });
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        localStorage.setItem('bgMusicEnabled', 'false');
        if (this.button) {
            this.button.innerHTML = '🔇';
        }
    }
    
    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    setVolume(volume) {
        this.audio.volume = Math.max(0, Math.min(1, volume));
    }
}

// 使用示例：
// const bgMusic = new BackgroundMusic('path/to/your/music.mp3');
