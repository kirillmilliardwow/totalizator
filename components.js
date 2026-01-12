/**
 * Дополнительные компоненты для МИКРОН Рандомайзер
 */

// Компонент анимированного микрочипа
class AnimatedChip {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.createChipElements();
        this.startAnimation();
    }
    
    createChipElements() {
        // Создание структуры чипа
        this.container.innerHTML = `
            <div class="chip-base">
                <div class="chip-core"></div>
                <div class="chip-pin"></div>
                <div class="chip-pin"></div>
                <div class="chip-pin"></div>
                <div class="chip-pin"></div>
                <div class="chip-wire"></div>
                <div class="chip-wire"></div>
                <div class="chip-wire"></div>
            </div>
        `;
        
        // Добавление стилей
        const style = document.createElement('style');
        style.textContent = `
            .chip-base {
                width: 100px;
                height: 100px;
                background: linear-gradient(135deg, #78909c, #546e7a);
                border-radius: 10px;
                position: relative;
                overflow: hidden;
                margin: 0 auto;
            }
            
            .chip-core {
                position: absolute;
                width: 60%;
                height: 60%;
                top: 20%;
                left: 20%;
                background: linear-gradient(45deg, #1e88e5, #0d47a1);
                border-radius: 5px;
                animation: core-pulse 2s infinite;
            }
            
            .chip-pin {
                position: absolute;
                width: 10px;
                height: 15px;
                background: #ffb300;
                border-radius: 2px;
            }
            
            .chip-pin:nth-child(2) { top: 20%; left: 0; }
            .chip-pin:nth-child(3) { top: 20%; right: 0; }
            .chip-pin:nth-child(4) { bottom: 20%; left: 0; }
            .chip-pin:nth-child(5) { bottom: 20%; right: 0; }
            
            .chip-wire {
                position: absolute;
                background: #ffb300;
                height: 2px;
                border-radius: 1px;
            }
            
            .chip-wire:nth-child(6) {
                width: 40%;
                top: 35%;
                left: 30%;
                animation: wire-glow 3s infinite;
            }
            
            .chip-wire:nth-child(7) {
                width: 30%;
                top: 50%;
                left: 35%;
                animation: wire-glow 3s infinite 0.5s;
            }
            
            .chip-wire:nth-child(8) {
                width: 35%;
                top: 65%;
                left: 32.5%;
                animation: wire-glow 3s infinite 1s;
            }
            
            @keyframes core-pulse {
                0%, 100% { opacity: 0.7; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.05); }
            }
            
            @keyframes wire-glow {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    startAnimation() {
        // Анимация уже в CSS
    }
}

// Компонент счетчика статистики
class StatisticsCounter {
    constructor(elementId, targetValue) {
        this.element = document.getElementById(elementId);
        this.targetValue = targetValue;
        this.currentValue = 0;
        this.duration = 2000; // 2 секунды
        this.interval = null;
        
        if (this.element) {
            this.start();
        }
    }
    
    start() {
        const increment = this.targetValue / (this.duration / 16); // 60fps
        let startTime = null;
        
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            
            this.currentValue = Math.min(
                Math.floor(progress / this.duration * this.targetValue),
                this.targetValue
            );
            
            this.element.textContent = this.formatNumber(this.currentValue);
            
            if (progress < this.duration) {
                requestAnimationFrame(animate);
            } else {
                this.element.textContent = this.formatNumber(this.targetValue);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

// Компонент прогресс-бара анализа
class AnalysisProgressBar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.progress = 0;
        this.interval = null;
        
        if (this.container) {
            this.init();
        }
    }
    
    init() {
        this.container.innerHTML = `
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <div class="progress-text">0%</div>
                <div class="progress-stages">
                    <div class="stage active">Инициализация</div>
                    <div class="stage">Анализ данных</div>
                    <div class="stage">Оценка рисков</div>
                    <div class="stage">Формирование отчета</div>
                </div>
            </div>
        `;
        
        this.progressFill = this.container.querySelector('.progress-fill');
        this.progressText = this.container.querySelector('.progress-text');
        this.stages = this.container.querySelectorAll('.stage');
    }
    
    start() {
        this.progress = 0;
        let currentStage = 0;
        
        this.interval = setInterval(() => {
            this.progress += 1;
            
            if (this.progress <= 25 && currentStage < 1) {
                currentStage = 1;
                this.updateStage(0);
            } else if (this.progress <= 50 && currentStage < 2) {
                currentStage = 2;
                this.updateStage(1);
            } else if (this.progress <= 75 && currentStage < 3) {
                currentStage = 3;
                this.updateStage(2);
            } else if (this.progress <= 100 && currentStage < 4) {
                currentStage = 4;
                this.updateStage(3);
            }
            
            this.progressFill.style.width = `${this.progress}%`;
            this.progressText.textContent = `${this.progress}%`;
            
            if (this.progress >= 100) {
                this.complete();
            }
        }, 30);
    }
    
    updateStage(stageIndex) {
        this.stages.forEach((stage, index) => {
            if (index <= stageIndex) {
                stage.classList.add('active');
                stage.classList.add('completed');
            } else if (index === stageIndex + 1) {
                stage.classList.add('active');
                stage.classList.remove('completed');
            } else {
                stage.classList.remove('active', 'completed');
            }
        });
    }
    
    complete() {
        clearInterval(this.interval);
        setTimeout(() => {
            this.container.style.opacity = '0';
            setTimeout(() => {
                this.container.style.display = 'none';
            }, 500);
        }, 1000);
    }
}

// Инициализация всех компонентов при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация анимированного чипа
    if (document.getElementById('chipAnimation')) {
        new AnimatedChip('chipAnimation');
    }
    
    // Инициализация счетчиков статистики
    setTimeout(() => {
        const stats = [
            { id: 'totalDecisions', value: 156 },
            { id: 'approvedDecisions', value: 102 },
            { id: 'pendingDecisions', value: 24 }
        ];
        
        stats.forEach(stat => {
            if (document.getElementById(stat.id)) {
                new StatisticsCounter(stat.id, stat.value);
            }
        });
    }, 1000);
});
