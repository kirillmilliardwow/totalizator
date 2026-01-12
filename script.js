// Конфигурация приложения
const CONFIG = {
    answers: [
        { text: "ДА", emoji: "👍", message: "Вселенная говорит ДА! Действуйте смело!" },
        { text: "НЕТ", emoji: "👎", message: "Лучше подождать. Сейчас не самое подходящее время." },
        { text: "НАВЕРНОЕ", emoji: "🤔", message: "Возможно, но нужно больше информации." },
        { text: "ОБЯЗАТЕЛЬНО", emoji: "🎯", message: "Это точно! Двигайтесь вперед без сомнений!" },
        { text: "НИКАК", emoji: "🚫", message: "Лучше отказаться от этой идеи." },
        { text: "СПРОСИ ПОЗЖЕ", emoji: "⏳", message: "Время покажет. Вернитесь к вопросу позже." },
        { text: "ДАЖЕ НЕ ДУМАЙ", emoji: "🙅", message: "Категорически нет! Даже не рассматривайте этот вариант." },
        { text: "ЗНАКИ ГОВОРЯТ ДА", emoji: "🔮", message: "Все знаки указывают на положительный ответ!" }
    ],
    wishes: [
        "Пусть этот день принесет тебе столько радости, сколько звёзд на небе 🌟",
        "Желаю, чтобы каждое твоё утро начиналось с улыбки и заканчивалось счастливыми воспоминаниями 🌅",
        "Пусть удача станет твоей верной спутницей, а счастье — постоянным гостем 🍀",
        "Желаю, чтобы все твои мечты находили дорогу к реальности, а реальность радовала, как мечта ✨",
        "Пусть сердце будет легким, душа — светлой, а мысли — ясными, как горный ручей 💖",
        "Желаю, чтобы сегодня ты получил именно тот знак, который ищешь 🔮",
        "Пусть ветер перемен принесет только хорошие новости и приятные сюрпризы 🍃",
        "Желаю, чтобы твой внутренний свет сиял так ярко, что освещал путь другим 💫",
        "Пусть этот день будет наполнен музыкой смеха, гармонией спокойствия и ритмом счастья 🎶",
        "Желаю, чтобы вселенная всегда была на твоей стороне 🌌"
    ],
    historyKey: 'randomizer_history',
    maxHistoryItems: 10
};

// Состояние приложения
const state = {
    isSpinning: false,
    currentAnswer: null,
    history: [],
    theme: 'light'
};

// Инициализация приложения
function initApp() {
    loadHistory();
    initTheme();
    setupEventListeners();
    setupWishes();
    initParticles();
    
    // Анимация появления
    document.querySelectorAll('.app-header, .question-section, .randomizer-section')
        .forEach((el, i) => {
            el.style.animationDelay = `${i * 0.1}s`;
            el.classList.add('animated');
        });
}

// Загрузка истории из localStorage
function loadHistory() {
    const savedHistory = localStorage.getItem(CONFIG.historyKey);
    if (savedHistory) {
        state.history = JSON.parse(savedHistory);
        renderHistory();
    }
}

// Сохранение истории
function saveHistory() {
    localStorage.setItem(CONFIG.historyKey, JSON.stringify(state.history));
}

// Инициализация темы
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    state.theme = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('themeSwitch').checked = savedTheme === 'dark';
}

// Переключение темы
function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('theme', state.theme);
    
    // Анимация переключения
    document.body.style.transition = 'background-color 0.5s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 500);
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Ввод вопроса
    const questionInput = document.getElementById('questionInput');
    const clearBtn = document.getElementById('clearBtn');
    
    questionInput.addEventListener('input', function() {
        clearBtn.style.visibility = this.value ? 'visible' : 'hidden';
    });
    
    clearBtn.addEventListener('click', function() {
        questionInput.value = '';
        this.style.visibility = 'hidden';
        questionInput.focus();
    });
    
    // Примеры вопросов
    document.querySelectorAll('.example-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.dataset.question;
            questionInput.value = question;
            clearBtn.style.visibility = 'visible';
        });
    });
    
    // Кнопка кручения
    const spinBtn = document.getElementById('spinBtn');
    spinBtn.addEventListener('click', spinWheel);
    
    // Быстрые ответы
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (state.isSpinning) return;
            
            const answer = this.dataset.answer;
            showQuickAnswer(answer);
        });
    });
    
    // Кнопка поделиться
    const shareBtn = document.getElementById('shareBtn');
    shareBtn.addEventListener('click', shareResult);
    
    // Случайное пожелание
    const randomWishBtn = document.getElementById('randomWishBtn');
    randomWishBtn.addEventListener('click', showRandomWish);
    
    // Копирование пожеланий
    document.querySelectorAll('.copy-wish').forEach(btn => {
        btn.addEventListener('click', function() {
            const wish = this.dataset.wish;
            copyToClipboard(wish);
            showToast('Пожелание скопировано! ✨');
        });
    });
    
    // Очистка истории
    const clearHistoryBtn = document.getElementById('clearHistory');
    clearHistoryBtn.addEventListener('click', clearHistory);
    
    // Переключение темы
    const themeSwitch = document.getElementById('themeSwitch');
    themeSwitch.addEventListener('change', toggleTheme);
    
    // Модальное окно
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    
    modalClose.addEventListener('click', () => {
        modalOverlay.classList.add('hidden');
    });
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.add('hidden');
        }
    });
}

// Кручение колеса
function spinWheel() {
    if (state.isSpinning) return;
    
    state.isSpinning = true;
    const wheel = document.querySelector('.wheel-inner');
    const spinBtn = document.getElementById('spinBtn');
    const question = document.getElementById('questionInput').value.trim();
    
    if (!question) {
        showToast('Задайте вопрос сначала! 🤔');
        state.isSpinning = false;
        return;
    }
    
    // Анимация кнопки
    spinBtn.disabled = true;
    spinBtn.style.transform = 'scale(0.95)';
    
    // Звук кручения
    playSound('spin');
    
    // Случайное вращение
    const spins = 5 + Math.random() * 3; // 5-8 полных оборотов
    const segmentAngle = 360 / CONFIG.answers.length;
    const randomSegment = Math.floor(Math.random() * CONFIG.answers.length);
    const finalAngle = spins * 360 + randomSegment * segmentAngle + (Math.random() * segmentAngle - segmentAngle/2);
    
    // Анимация вращения
    wheel.style.transition = 'transform 3s cubic-bezier(0.2, 0.8, 0.3, 1)';
    wheel.style.transform = `rotate(${finalAngle}deg)`;
    
    // Эффект конфетти
    createConfetti();
    
    // Показ результата
    setTimeout(() => {
        const answer = CONFIG.answers[randomSegment];
        showResult(question, answer);
        state.isSpinning = false;
        spinBtn.disabled = false;
        spinBtn.style.transform = '';
        
        // Звук результата
        playSound('result');
    }, 3000);
}

// Быстрый ответ
function showQuickAnswer(answerText) {
    const question = document.getElementById('questionInput').value.trim();
    if (!question) {
        showToast('Задайте вопрос сначала! 🤔');
        return;
    }
    
    const answer = CONFIG.answers.find(a => a.text === answerText);
    if (answer) {
        showResult(question, answer);
        playSound('click');
    }
}

// Показать результат
function showResult(question, answer) {
    const resultSection = document.getElementById('resultSection');
    const resultCard = resultSection.querySelector('.result-card');
    
    // Обновление данных
    document.getElementById('resultQuestion').textContent = `Вопрос: ${question}`;
    document.getElementById('resultAnswer').textContent = answer.text;
    document.getElementById('resultMessage').textContent = answer.message;
    
    // Анимация появления
    resultCard.classList.remove('hidden');
    
    // Добавление в историю
    const historyItem = {
        question,
        answer: answer.text,
        emoji: answer.emoji,
        message: answer.message,
        timestamp: new Date().toISOString()
    };
    
    state.history.unshift(historyItem);
    if (state.history.length > CONFIG.maxHistoryItems) {
        state.history = state.history.slice(0, CONFIG.maxHistoryItems);
    }
    
    saveHistory();
    renderHistory();
    
    // Прокрутка к результату
    setTimeout(() => {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);
}

// Настройка пожеланий
function setupWishes() {
    const wishesContainer = document.querySelector('.wishes-container');
    
    // Добавляем дополнительные пожелания
    CONFIG.wishes.forEach((wish, index) => {
        if (index < 4) return; // Первые 4 уже в HTML
        
        const emoji = getWishEmoji(wish);
        const wishCard = document.createElement('div');
        wishCard.className = 'wish-card';
        wishCard.innerHTML = `
            <div class="wish-emoji">${emoji}</div>
            <div class="wish-content">
                <p class="wish-text">${wish}</p>
                <button class="copy-wish" data-wish="${wish}">
                    <i class="far fa-copy"></i>
                </button>
            </div>
        `;
        
        wishCard.querySelector('.copy-wish').addEventListener('click', function() {
            const wishText = this.dataset.wish;
            copyToClipboard(wishText);
            showToast('Пожелание скопировано! ✨');
        });
        
        wishesContainer.appendChild(wishCard);
    });
}

// Получить эмодзи для пожелания
function getWishEmoji(wish) {
    const emojiMap = {
        'радости': '🌟',
        'улыбки': '😊',
        'счастья': '💖',
        'удачи': '🍀',
        'мечты': '✨',
        'свет': '💫',
        'музыка': '🎶',
        'вселенная': '🌌',
        'сердце': '❤️',
        'ветер': '🍃'
    };
    
    for (const [word, emoji] of Object.entries(emojiMap)) {
        if (wish.toLowerCase().includes(word)) {
            return emoji;
        }
    }
    
    return '✨';
}

// Случайное пожелание
function showRandomWish() {
    const randomWish = CONFIG.wishes[Math.floor(Math.random() * CONFIG.wishes.length)];
    const emoji = getWishEmoji(randomWish);
    
    showModal('✨ Случайное пожелание', `
        <div style="text-align: center; padding: 20px 0;">
            <div style="font-size: 3rem; margin-bottom: 20px;">${emoji}</div>
            <p style="font-size: 1.2rem; line-height: 1.6; margin-bottom: 25px;">${randomWish}</p>
            <button onclick="copyToClipboard('${randomWish}'); showToast('Пожелание скопировано! ✨')" 
                    style="padding: 10px 20px; background: var(--primary-color); color: white; border: none; border-radius: 10px; cursor: pointer;">
                <i class="far fa-copy"></i> Копировать
            </button>
        </div>
    `);
    
    playSound('click');
}

// Рендер истории
function renderHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    if (state.history.length === 0) {
        historyList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                <i class="fas fa-history" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                <p>История пуста. Задайте вопрос, чтобы начать!</p>
            </div>
        `;
        return;
    }
    
    state.history.forEach((item, index) => {
        const date = new Date(item.timestamp);
        const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <span style="font-size: 1.5rem;">${item.emoji}</span>
                <strong style="color: var(--primary-color);">${item.answer}</strong>
                <span style="margin-left: auto; font-size: 0.9rem; color: var(--text-secondary);">${timeString}</span>
            </div>
            <p style="margin-bottom: 5px; font-weight: 500;">${item.question}</p>
            <p style="font-size: 0.9rem; color: var(--text-secondary); font-style: italic;">${item.message}</p>
        `;
        
        historyList.appendChild(historyItem);
    });
}

// Очистка истории
function clearHistory() {
    if (confirm('Очистить всю историю?')) {
        state.history = [];
        saveHistory();
        renderHistory();
        showToast('История очищена! 🗑️');
        playSound('click');
    }
}

// Копирование в буфер обмена
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Текст скопирован:', text);
    }).catch(err => {
        console.error('Ошибка копирования:', err);
        // Fallback для старых браузеров
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    });
}

// Поделиться результатом
function shareResult() {
    const question = document.getElementById('resultQuestion').textContent;
    const answer = document.getElementById('resultAnswer').textContent;
    const message = document.getElementById('resultMessage').textContent;
    
    const shareText = `✨ Магический Рандомайзер ✨\n\n${question}\n\nОтвет: ${answer}\n\n${message}\n\nПопробуйте и вы: ${window.location.href}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Магический Рандомайзер',
            text: shareText,
            url: window.location.href
        });
    } else {
        copyToClipboard(shareText);
        showToast('Результат скопирован в буфер обмена! 📋');
    }
    
    playSound('click');
}

// Создание конфетти
function createConfetti() {
    const container = document.querySelector('.confetti-container');
    const colors = ['#FF6B8B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        confetti.style.width = `${5 + Math.random() * 10}px`;
        confetti.style.height = `${10 + Math.random() * 20}px`;
        
        container.appendChild(confetti);
        
        // Удаление после анимации
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

// Показать уведомление
function showToast(message) {
    // Удаляем старый тост, если есть
    const oldToast = document.querySelector('.toast');
    if (oldToast) oldToast.remove();
    
    // Создаем новый тост
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Стили для тоста
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'var(--gradient-primary)';
    toast.style.color = 'white';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '50px';
    toast.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    toast.style.zIndex = '1001';
    toast.style.animation = 'slide-up 0.3s ease-out';
    
    document.body.appendChild(toast);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        toast.style.animation = 'slide-down 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Показать модальное окно
function showModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('modalOverlay').classList.remove('hidden');
}

// Звуковые эффекты
function playSound(type) {
    const audio = document.getElementById(`${type}Sound`);
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
}

// Функции для кнопок в подвале
function shareApp() {
    const shareText = `✨ Попробуйте Магический Рандомайзер! ✨\n\nКрасивое приложение с рандомайзером "Да/Нет/Наверное" и пожеланиями дня.\n\n${window.location.href}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Магический Рандомайзер',
            text: shareText,
            url: window.location.href
        });
    } else {
        copyToClipboard(shareText);
        showToast('Ссылка скопирована! 📋');
    }
    
    playSound('click');
}

function rateApp() {
    showModal('⭐ Нравится приложение?', `
        <div style="text-align: center; padding: 20px 0;">
            <div style="font-size: 4rem; margin-bottom: 20px;">✨</div>
            <p style="font-size: 1.2rem; line-height: 1.6; margin-bottom: 25px;">
                Если вам нравится это приложение, поделитесь им с друзьями!<br>
                Ваша поддержка очень важна для нас!
            </p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button onclick="shareApp()" style="padding: 12px 25px; background: var(--primary-color); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1rem;">
                    <i class="fas fa-share-alt"></i> Поделиться
                </button>
            </div>
        </div>
    `);
}

function showAbout() {
    showModal('✨ О приложении', `
        <div style="line-height: 1.6;">
            <p style="margin-bottom: 15px;">
                <strong>Магический Рандомайзер</strong> — это красивое приложение для тех, кто ищет ответы у вселенной или просто хочет получить позитивное пожелание на день.
            </p>
            
            <div style="background: rgba(108, 99, 255, 0.1); padding: 15px; border-radius: 10px; margin: 20px 0;">
                <h4 style="color: var(--primary-color); margin-bottom: 10px;">🌟 Возможности:</h4>
                <ul style="padding-left: 20px;">
                    <li>Рандомайзер "Да/Нет/Наверное" с красивой анимацией</li>
                    <li>8 разных вариантов ответов</li>
                    <li>Пожелания прекрасного дня</li>
                    <li>История ваших вопросов</li>
                    <li>Тёмная и светлая темы</li>
                    <li>Анимации и звуковые эффекты</li>
                </ul>
            </div>
            
            <p style="margin: 20px 0;">
                Сделано с ❤️ и магией для всех, кто верит в чудеса и позитив!
            </p>
            
            <div style="text-align: center; margin-top: 30px; color: var(--text-secondary); font-size: 0.9rem;">
                Версия 1.0.0
            </div>
        </div>
    `);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initApp);
