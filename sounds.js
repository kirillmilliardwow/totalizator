// Управление звуковыми эффектами
class SoundManager {
    constructor() {
        this.sounds = {
            spin: document.getElementById('spinSound'),
            result: document.getElementById('resultSound'),
            click: document.getElementById('clickSound')
        };
        
        this.muted = localStorage.getItem('sound_muted') === 'true';
        this.init();
    }
    
    init() {
        // Создаем звуковые элементы, если их нет
        if (!this.sounds.spin) {
            this.createSounds();
        }
        
        // Настройка громкости
        Object.values(this.sounds).forEach(sound => {
            if (sound) {
                sound.volume = 0.3;
                sound.muted = this.muted;
            }
        });
    }
    
    createSounds() {
        const audioContainer = document.createElement('div');
        audioContainer.style.display = 'none';
        
        // Звук кручения
        const spinSound = document.createElement('audio');
        spinSound.id = 'spinSound';
        spinSound.innerHTML = `
            <source src="https://assets.mixkit.co/sfx/preview/mixkit-spinning-wheel-909.mp3" type="audio/mpeg">
        `;
        
        // Звук результата
        const resultSound = document.createElement('audio');
        resultSound.id = 'resultSound';
        resultSound.innerHTML = `
            <source src="https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3" type="audio/mpeg">
        `;
        
        // Звук клика
        const clickSound = document.createElement('audio');
        clickSound.id = 'clickSound';
        clickSound.innerHTML = `
            <source src="https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3" type="audio/mpeg">
        `;
        
        audioContainer.appendChild(spinSound);
        audioContainer.appendChild(resultSound);
        audioContainer.appendChild(clickSound);
        document.body.appendChild(audioContainer);
        
        // Обновляем ссылки
        this.sounds = {
            spin: spinSound,
            result: resultSound,
            click: clickSound
        };
    }
    
    play(soundName) {
        if (this.muted || !this.sounds[soundName]) return;
        
        const sound = this.sounds[soundName];
        sound.currentTime = 0;
        sound.play().catch(e => {
            console.log('Sound play failed:', e);
        });
    }
    
    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('sound_muted', this.muted);
        
        Object.values(this.sounds).forEach(sound => {
            if (sound) sound.muted = this.muted;
        });
        
        return this.muted;
    }
    
    setVolume(volume) {
        Object.values(this.sounds).forEach(sound => {
            if (sound) sound.volume = Math.max(0, Math.min(1, volume));
        });
    }
}

// Глобальный экземпляр менеджера звуков
let soundManager;

// Инициализация звуков
function initSounds() {
    soundManager = new SoundManager();
    
    // Добавляем кнопку управления звуком
    const soundBtn = document.createElement('button');
    soundBtn.className = 'social-btn';
    soundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    soundBtn.title = 'Вкл/выкл звук';
    soundBtn.style.position = 'fixed';
    soundBtn.style.bottom = '80px';
    soundBtn.style.right = '20px';
    soundBtn.style.zIndex = '1000';
    
    soundBtn.addEventListener('click', () => {
        const muted = soundManager.toggleMute();
        soundBtn.innerHTML = muted ? 
            '<i class="fas fa-volume-mute"></i>' : 
            '<i class="fas fa-volume-up"></i>';
        
        soundBtn.title = muted ? 'Включить звук' : 'Выключить звук';
        
        // Анимация
        soundBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            soundBtn.style.transform = '';
        }, 300);
    });
    
    document.body.appendChild(soundBtn);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initSounds);
