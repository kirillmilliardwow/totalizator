/**
 * МИКРОН РАНДОМАЙЗЕР - Основная логика приложения
 * В стиле ПАО "Микрон" для микроэлектроники
 */

// Конфигурация приложения
const CONFIG = {
    // Решения для микроэлектроники
    decisions: [
        {
            id: 1,
            text: "РЕКОМЕНДУЕТСЯ",
            emoji: "✅",
            category: "technology",
            confidence: 85,
            reasoning: "Анализ показывает высокую технологическую осуществимость и положительную экономическую эффективность. Проект соответствует стратегическим целям развития микроэлектроники.",
            metrics: { efficiency: 85, profitability: 72, feasibility: 91 }
        },
        {
            id: 2,
            text: "ТРЕБУЕТ ДОРАБОТКИ",
            emoji: "🔄",
            category: "technology",
            confidence: 60,
            reasoning: "Проект имеет потенциал, но требует дополнительных исследований и оптимизации технологических параметров. Рекомендуется провести пилотные испытания.",
            metrics: { efficiency: 60, profitability: 45, feasibility: 75 }
        },
        {
            id: 3,
            text: "ОТКЛОНИТЬ",
            emoji: "❌",
            category: "investment",
            confidence: 90,
            reasoning: "Технологические риски превышают допустимые пределы. Экономическая эффективность не соответствует требованиям. Рекомендуется рассмотреть альтернативные решения.",
            metrics: { efficiency: 30, profitability: 25, feasibility: 40 }
        },
        {
            id: 4,
            text: "ИССЛЕДОВАТЬ ДАЛЬШЕ",
            emoji: "🔍",
            category: "research",
            confidence: 50,
            reasoning: "Недостаточно данных для принятия окончательного решения. Требуется дополнительный анализ рынка и технологических возможностей.",
            metrics: { efficiency: 50, profitability: 50, feasibility: 50 }
        },
        {
            id: 5,
            text: "УСЛОВНО УТВЕРДИТЬ",
            emoji: "⚠️",
            category: "equipment",
            confidence: 70,
            reasoning: "Проект может быть реализован при выполнении определенных условий. Требуется дополнительное финансирование и кадровое обеспечение.",
            metrics: { efficiency: 70, profitability: 65, feasibility: 75 }
        }
    ],
    
    // Примеры вопросов для микроэлектроники
    exampleQuestions: [
        "Стоит ли инвестировать в новую линию фотолитографии?",
        "Переходить на технологический узел 65нм в следующем квартале?",
        "Разрабатывать собственный процессор для IoT устройств?",
        "Закупать новое тестовое оборудование для чипов памяти?",
        "Внедрять систему автоматического контроля качества?",
        "Расширять производство силовых полупроводников?",
        "Инвестировать в разработку чипов для автомобильной электроники?",
        "Создавать совместное предприятие с зарубежным партнером?",
        "Переходить на бессвинцовую пайку компонентов?",
        "Внедрять систему цифрового двойника производства?"
    ],
    
    // Технологические категории
    categories: [
        { id: "technology", name: "Технологии", icon: "fas fa-microchip", color: "#1e88e5" },
        { id: "equipment", name: "Оборудование", icon: "fas fa-robot", color: "#43a047" },
        { id: "materials", name: "Материалы", icon: "fas fa-atom", color: "#fb8c00" },
        { id: "investment", name: "Инвестиции", icon: "fas fa-chart-line", color: "#e53935" },
        { id: "research", name: "Исследования", icon: "fas fa-flask", color: "#8e24aa" }
    ],
    
    // Хранение данных
    storageKeys: {
        decisions: 'micron_decisions_db',
        history: 'micron_analysis_history',
        settings: 'micron_user_settings'
    }
};

// Состояние приложения
const AppState = {
    currentQuestion: '',
    selectedMethod: 'semiconductor',
    currentDecision: null,
    decisionsHistory: [],
    userSettings: {
        theme: 'light',
        sounds: true,
        animations: true,
        notifications: true
    },
    statistics: {
        totalAnalyses: 0,
        approved: 0,
        rejected: 0,
        pending: 0
    }
};

// Инициализация приложения
function initApp() {
    loadSettings();
    loadHistory();
    setupEventListeners();
    updateStatistics();
    initCharts();
    
    // Установка текущей даты
    updateDateTime();
    setInterval(updateDateTime, 60000);
    
    // Анимация загрузки
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
}

// Загрузка настроек
function loadSettings() {
    const savedSettings = localStorage.getItem(CONFIG.storageKeys.settings);
    if (savedSettings) {
        AppState.userSettings = JSON.parse(savedSettings);
        
        // Применение настроек
        document.documentElement.setAttribute('data-theme', AppState.userSettings.theme);
        document.getElementById('themeToggle').checked = AppState.userSettings.theme === 'dark';
        document.getElementById('soundToggle').checked = AppState.userSettings.sounds;
        document.getElementById('animationsToggle').checked = AppState.userSettings.animations;
    }
}

// Сохранение настроек
function saveSettings() {
    localStorage.setItem(CONFIG.storageKeys.settings, JSON.stringify(AppState.userSettings));
}

// Загрузка истории
function loadHistory() {
    const savedHistory = localStorage.getItem(CONFIG.storageKeys.history);
    if (savedHistory) {
        AppState.decisionsHistory = JSON.parse(savedHistory);
        renderDecisionsGrid();
        updateDashboardStats();
    }
}

// Сохранение истории
function saveHistory() {
    localStorage.setItem(CONFIG.storageKeys.history, JSON.stringify(AppState.decisionsHistory));
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Навигация
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            switchSection(section);
        });
    });
    
    // Очистка вопроса
    document.getElementById('clearQuestion').addEventListener('click', clearQuestion);
    
    // Генерация вопроса
    document.getElementById('generateQuestion').addEventListener('click', generateRandomQuestion);
    
    // Примеры вопросов
    document.querySelectorAll('.example-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            const question = this.dataset.question;
            document.getElementById('techQuestion').value = question;
            AppState.currentQuestion = question;
        });
    });
    
    // Методы анализа
    document.querySelectorAll('.method-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.method-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            AppState.selectedMethod = this.dataset.method;
        });
    });
    
    // Запуск анализа
    document.getElementById('executeAnalysis').addEventListener('click', executeAnalysis);
    
    // Быстрые решения
    document.querySelectorAll('.quick-decision-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const decisionText = this.dataset.decision;
            showQuickDecision(decisionText);
        });
    });
    
    // Действия с результатом
    document.getElementById('saveResult').addEventListener('click', saveCurrentDecision);
    document.getElementById('exportResult').addEventListener('click', exportDecisionToPDF);
    document.getElementById('shareResult').addEventListener('click', shareDecision);
    
    // Фильтры базы данных
    document.getElementById('filterCategory').addEventListener('change', filterDecisions);
    document.getElementById('filterResult').addEventListener('change', filterDecisions);
    document.getElementById('searchDecisions').addEventListener('input', filterDecisions);
    
    // Настройки
    document.getElementById('themeToggle').addEventListener('change', toggleTheme);
    document.getElementById('soundToggle').addEventListener('change', toggleSound);
    document.getElementById('animationsToggle').addEventListener('change', toggleAnimations);
    
    // Документация
    document.getElementById('documentationBtn').addEventListener('click', showDocumentation);
    
    // Модальное окно
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalOverlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Ввод вопроса
    const questionInput = document.getElementById('techQuestion');
    questionInput.addEventListener('input', function() {
        AppState.currentQuestion = this.value;
    });
}

// Переключение секций
function switchSection(sectionId) {
    // Обновление навигации
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.section === sectionId) {
            btn.classList.add('active');
        }
    });
    
    // Показ секции
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    // Прокрутка к началу
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Обновление контента при необходимости
    if (sectionId === 'statistics') {
        updateCharts();
    }
}

// Очистка вопроса
function clearQuestion() {
    document.getElementById('techQuestion').value = '';
    AppState.currentQuestion = '';
}

// Генерация случайного вопроса
function generateRandomQuestion() {
    const randomIndex = Math.floor(Math.random() * CONFIG.exampleQuestions.length);
    const question = CONFIG.exampleQuestions[randomIndex];
    document.getElementById('techQuestion').value = question;
    AppState.currentQuestion = question;
    
    // Анимация
    const input = document.getElementById('techQuestion');
    input.style.transform = 'scale(1.02)';
    setTimeout(() => {
        input.style.transform = '';
    }, 300);
    
    playSound('click');
}

// Выполнение анализа
function executeAnalysis() {
    const question = document.getElementById('techQuestion').value.trim();
    
    if (!question) {
        showNotification('Введите вопрос для анализа', 'warning');
        return;
    }
    
    if (AppState.currentDecision) {
        if (!confirm('Текущий результат будет потерян. Продолжить?')) {
            return;
        }
    }
    
    // Анимация запуска
    const executeBtn = document.getElementById('executeAnalysis');
    executeBtn.classList.add('disabled');
    executeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Анализ выполняется...</span>';
    
    // Звук анализа
    playSound('analysis');
    
    // Имитация процесса анализа
    simulateAnalysis(question);
}

// Имитация анализа
function simulateAnalysis(question) {
    // Анимация транзисторов
    const transistors = document.querySelectorAll('.transistor-element');
    transistors.forEach(transistor => {
        transistor.style.animation = 'transistor-glow 0.5s infinite';
    });
    
    // Прогресс
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 10;
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            
            // Завершение анализа
            completeAnalysis(question);
            
            // Сброс анимации транзисторов
            transistors.forEach(transistor => {
                transistor.style.animation = '';
            });
        }
    }, 300);
}

// Завершение анализа
function completeAnalysis(question) {
    // Случайный выбор решения
    const randomDecision = CONFIG.decisions[Math.floor(Math.random() * CONFIG.decisions.length)];
    
    // Обновление состояния
    AppState.currentDecision = {
        ...randomDecision,
        question: question,
        method: AppState.selectedMethod,
        timestamp: new Date().toISOString(),
        id: Date.now()
    };
    
    // Показ результата
    showAnalysisResult();
    
    // Обновление кнопки
    const executeBtn = document.getElementById('executeAnalysis');
    executeBtn.classList.remove('disabled');
    executeBtn.innerHTML = '<i class="fas fa-play-circle"></i><span>Запустить анализ</span>';
    
    // Звук результата
    playSound('decision');
    
    // Обновление статистики
    updateStatistics();
}

// Показать результат анализа
function showAnalysisResult() {
    const resultContainer = document.querySelector('.result-container');
    const decision = AppState.currentDecision;
    
    if (!decision) return;
    
    // Обновление данных
    document.getElementById('resultQuestionText').textContent = decision.question;
    document.getElementById('decisionText').textContent = decision.text;
    document.getElementById('confidenceLevel').textContent = `${decision.confidence}%`;
    document.getElementById('decisionReasoning').textContent = decision.reasoning;
    
    // Обновление метрик
    const metrics = document.querySelectorAll('.metric-fill');
    metrics[0].style.width = `${decision.metrics.efficiency}%`;
    metrics[1].style.width = `${decision.metrics.profitability}%`;
    metrics[2].style.width = `${decision.metrics.feasibility}%`;
    
    document.querySelectorAll('.metric-value')[0].textContent = `${decision.metrics.efficiency}%`;
    document.querySelectorAll('.metric-value')[1].textContent = `${decision.metrics.profitability}%`;
    document.querySelectorAll('.metric-value')[2].textContent = `${decision.metrics.feasibility}%`;
    
    // Обновление иконки
    const decisionIcon = document.querySelector('.decision-icon-large i');
    decisionIcon.className = decision.emoji === '✅' ? 'fas fa-check-circle success' :
                            decision.emoji === '🔄' ? 'fas fa-sync-alt warning' :
                            decision.emoji === '❌' ? 'fas fa-times-circle danger' :
                            decision.emoji === '🔍' ? 'fas fa-search info' :
                            'fas fa-exclamation-triangle warning';
    
    // Обновление даты и времени
    updateDateTime();
    
    // Показ результата
    resultContainer.classList.remove('hidden');
    
    // Прокрутка к результату
    setTimeout(() => {
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);
}

// Быстрое решение
function showQuickDecision(decisionText) {
    const question = document.getElementById('techQuestion').value.trim();
    
    if (!question) {
        showNotification('Введите вопрос для принятия решения', 'warning');
        return;
    }
    
    const decisionMap = {
        'ДА': {
            text: 'РЕКОМЕНДУЕТСЯ',
            emoji: '✅',
            confidence: 80,
            reasoning: 'Быстрое решение на основе экспертной оценки. Рекомендуется провести дополнительный анализ для подтверждения.',
            metrics: { efficiency: 75, profitability: 70, feasibility: 80 }
        },
        'НЕТ': {
            text: 'ОТКЛОНИТЬ',
            emoji: '❌',
            confidence: 85,
            reasoning: 'Быстрое решение на основе экспертной оценки. Проект имеет значительные риски и требует пересмотра.',
            metrics: { efficiency: 35, profitability: 30, feasibility: 40 }
        },
        'ИССЛЕДОВАТЬ': {
            text: 'ИССЛЕДОВАТЬ ДАЛЬШЕ',
            emoji: '🔍',
            confidence: 50,
            reasoning: 'Требуется дополнительный анализ. Недостаточно данных для принятия окончательного решения.',
            metrics: { efficiency: 50, profitability: 50, feasibility: 50 }
        }
    };
    
    AppState.currentDecision = {
        ...decisionMap[decisionText],
        question: question,
        method: 'quick',
        timestamp: new Date().toISOString(),
        id: Date.now()
    };
    
    showAnalysisResult();
    playSound('click');
}

// Сохранение решения
function saveCurrentDecision() {
    if (!AppState.currentDecision) {
        showNotification('Нет результата для сохранения', 'warning');
        return;
    }
    
    // Добавление в историю
    AppState.decisionsHistory.unshift({
        ...AppState.currentDecision,
        savedAt: new Date().toISOString()
    });
    
    // Ограничение истории
    if (AppState.decisionsHistory.length > 50) {
        AppState.decisionsHistory = AppState.decisionsHistory.slice(0, 50);
    }
    
    // Сохранение
    saveHistory();
    renderDecisionsGrid();
    updateDashboardStats();
    updateStatistics();
    
    showNotification('Решение сохранено в базу данных', 'success');
    playSound('click');
}

// Экспорт в PDF
function exportDecisionToPDF() {
    if (!AppState.currentDecision) {
        showNotification('Нет результата для экспорта', 'warning');
        return;
    }
    
    // Имитация экспорта
    showNotification('Формирование PDF документа...', 'info');
    
    setTimeout(() => {
        showNotification('PDF документ готов к скачиванию', 'success');
        
        // Создание ссылки для скачивания
        const data = `
            Результат анализа: ${AppState.currentDecision.text}
            Вопрос: ${AppState.currentDecision.question}
            Уверенность: ${AppState.currentDecision.confidence}%
            Метод анализа: ${AppState.selectedMethod}
            Дата: ${new Date().toLocaleDateString()}
            Время: ${new Date().toLocaleTimeString()}
            
            Обоснование:
            ${AppState.currentDecision.reasoning}
            
            Метрики:
            - Эффективность: ${AppState.currentDecision.metrics.efficiency}%
            - Рентабельность: ${AppState.currentDecision.metrics.profitability}%
            - Технологичность: ${AppState.currentDecision.metrics.feasibility}%
            
            Сгенерировано системой МИКРОН Рандомайзер
        `;
        
        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `micron_decision_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 1500);
}

// Поделиться решением
function shareDecision() {
    if (!AppState.currentDecision) {
        showNotification('Нет результата для публикации', 'warning');
        return;
    }
    
    const shareData = {
        title: 'Решение МИКРОН Рандомайзер',
        text: `Результат анализа: ${AppState.currentDecision.text}\nВопрос: ${AppState.currentDecision.question}`,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData).catch(console.error);
    } else {
        // Копирование в буфер обмена
        navigator.clipboard.writeText(shareData.text).then(() => {
            showNotification('Текст скопирован в буфер обмена', 'success');
        });
    }
    
    playSound('click');
}

// Рендер сетки решений
function renderDecisionsGrid() {
    const grid = document.getElementById('decisionsGrid');
    if (!grid) return;
    
    if (AppState.decisionsHistory.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-database" style="font-size: 3rem; color: #ccc; margin-bottom: 20px;"></i>
                <h4>База данных пуста</h4>
                <p>Сохраненные решения появятся здесь</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = AppState.decisionsHistory.slice(0, 12).map(decision => {
        const date = new Date(decision.timestamp);
        const statusClass = decision.text.includes('РЕКОМЕНДУЕТСЯ') ? 'approved' :
                          decision.text.includes('ОТКЛОНИТЬ') ? 'rejected' : 'pending';
        
        return `
            <div class="decision-card" data-id="${decision.id}">
                <div class="decision-header">
                    <span class="decision-category">
                        <i class="fas fa-microchip"></i>
                        ${getCategoryName(decision.category)}
                    </span>
                    <span class="decision-status status-${statusClass}">
                        ${decision.text}
                    </span>
                </div>
                <div class="decision-question">
                    ${decision.question.length > 100 ? 
                      decision.question.substring(0, 100) + '...' : 
                      decision.question}
                </div>
                <div class="decision-meta">
                    <span>
                        <i class="fas fa-calendar"></i>
                        ${date.toLocaleDateString()}
                    </span>
                    <span>
                        <i class="fas fa-chart-bar"></i>
                        ${decision.confidence}%
                    </span>
                </div>
            </div>
        `;
    }).join('');
    
    // Добавление обработчиков кликов
    document.querySelectorAll('.decision-card').forEach(card => {
        card.addEventListener('click', function() {
            const decisionId = parseInt(this.dataset.id);
            const decision = AppState.decisionsHistory.find(d => d.id === decisionId);
            if (decision) {
                showDecisionDetails(decision);
            }
        });
    });
}

// Фильтрация решений
function filterDecisions() {
    const category = document.getElementById('filterCategory').value;
    const result = document.getElementById('filterResult').value;
    const search = document.getElementById('searchDecisions').value.toLowerCase();
    
    const cards = document.querySelectorAll('.decision-card');
    cards.forEach(card => {
        const categoryMatch = category === 'all' || 
            card.querySelector('.decision-category').textContent.includes(getCategoryName(category));
        
        const resultMatch = result === 'all' ||
            card.querySelector('.decision-status').classList.contains(`status-${result}`);
        
        const searchMatch = search === '' ||
            card.querySelector('.decision-question').textContent.toLowerCase().includes(search);
        
        card.style.display = categoryMatch && resultMatch && searchMatch ? 'block' : 'none';
    });
}

// Обновление статистики дашборда
function updateDashboardStats() {
    const total = AppState.decisionsHistory.length;
    const approved = AppState.decisionsHistory.filter(d => 
        d.text.includes('РЕКОМЕНДУЕТСЯ')).length;
    const pending = AppState.decisionsHistory.filter(d => 
        d.text.includes('ИССЛЕДОВАТЬ') || d.text.includes('ТРЕБУЕТ')).length;
    
    document.getElementById('totalDecisions').textContent = total;
    document.getElementById('approvedDecisions').textContent = approved;
    document.getElementById('pendingDecisions').textContent = pending;
}

// Обновление общей статистики
function updateStatistics() {
    AppState.statistics.totalAnalyses = AppState.decisionsHistory.length;
    AppState.statistics.approved = AppState.decisionsHistory.filter(d => 
        d.text.includes('РЕКОМЕНДУЕТСЯ')).length;
    AppState.statistics.rejected = AppState.decisionsHistory.filter(d => 
        d.text.includes('ОТКЛОНИТЬ')).length;
    AppState.statistics.pending = AppState.decisionsHistory.length - 
        AppState.statistics.approved - AppState.statistics.rejected;
}

// Получение названия категории
function getCategoryName(categoryId) {
    const category = CONFIG.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Технологии';
}

// Показать детали решения
function showDecisionDetails(decision) {
    const date = new Date(decision.timestamp);
    
    const modalBody = `
        <div class="decision-details">
            <div class="detail-header">
                <h4>${decision.text} ${decision.emoji}</h4>
                <p class="detail-meta">
                    <i class="fas fa-calendar"></i> ${date.toLocaleDateString()}
                    <i class="fas fa-clock"></i> ${date.toLocaleTimeString()}
                </p>
            </div>
            
            <div class="detail-section">
                <h5>Вопрос:</h5>
                <p>${decision.question}</p>
            </div>
            
            <div class="detail-section">
                <h5>Обоснование:</h5>
                <p>${decision.reasoning}</p>
            </div>
            
            <div class="detail-section">
                <h5>Метрики:</h5>
                <div class="detail-metrics">
                    <div class="detail-metric">
                        <span class="metric-label">Эффективность</span>
                        <div class="metric-value">${decision.metrics.efficiency}%</div>
                    </div>
                    <div class="detail-metric">
                        <span class="metric-label">Рентабельность</span>
                        <div class="metric-value">${decision.metrics.profitability}%</div>
                    </div>
                    <div class="detail-metric">
                        <span class="metric-label">Технологичность</span>
                        <div class="metric-value">${decision.metrics.feasibility}%</div>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h5>Детали анализа:</h5>
                <ul>
                    <li>Метод: ${decision.method || 'Полупроводниковый анализ'}</li>
                    <li>Уверенность: ${decision.confidence}%</li>
                    <li>Категория: ${getCategoryName(decision.category)}</li>
                </ul>
            </div>
        </div>
    `;
    
    showModal('Детали решения', modalBody);
}

// Обновление даты и времени
function updateDateTime() {
    const now = new Date();
    
    document.getElementById('resultDate')?.textContent = now.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    
    document.getElementById('resultTime')?.textContent = now.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Переключение темы
function toggleTheme() {
    const isDark = document.getElementById('themeToggle').checked;
    AppState.userSettings.theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', AppState.userSettings.theme);
    saveSettings();
}

// Переключение звуков
function toggleSound() {
    AppState.userSettings.sounds = document.getElementById('soundToggle').checked;
    saveSettings();
}

// Переключение анимаций
function toggleAnimations() {
    AppState.userSettings.animations = document.getElementById('animationsToggle').checked;
    saveSettings();
}

// Воспроизведение звука
function playSound(soundName) {
    if (!AppState.userSettings.sounds) return;
    
    const audio = document.getElementById(soundName + 'Sound');
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Ошибка воспроизведения:', e));
    }
}

// Показать уведомление
function showNotification(message, type = 'info') {
    // Удаляем старые уведомления
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) oldNotification.remove();
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 
                         type === 'warning' ? 'exclamation-triangle' : 
                         type === 'error' ? 'times-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Стили
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? 'var(--success-color)' :
                     type === 'warning' ? 'var(--warning-color)' :
                     type === 'error' ? 'var(--danger-color)' : 'var(--info-color)'};
        color: white;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        box-shadow: var(--shadow-medium);
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Показать документацию
function showDocumentation() {
    const modalBody = `
        <div class="documentation">
            <h4>Документация МИКРОН Рандомайзер</h4>
            
            <div class="doc-section">
                <h5>Назначение системы</h5>
                <p>Система предназначена для поддержки принятия решений в области микроэлектроники на основе анализа данных и экспертных оценок.</p>
            </div>
            
            <div class="doc-section">
                <h5>Методы анализа</h5>
                <ul>
                    <li><strong>Полупроводниковый анализ</strong> - использует статистические данные производства</li>
                    <li><strong>Квантовый рандомизатор</strong> - применяет принципы квантовой механики</li>
                    <li><strong>Нейросетевой алгоритм</strong> - искусственный интеллект для анализа</li>
                </ul>
            </div>
            
            <div class="doc-section">
                <h5>Метрики оценки</h5>
                <ul>
                    <li><strong>Эффективность</strong> - оценка технологической эффективности</li>
                    <li><strong>Рентабельность</strong> - экономическая обоснованность</li>
                    <li><strong>Технологичность</strong> - возможность реализации с текущими ресурсами</li>
                </ul>
            </div>
            
            <div class="doc-section">
                <h5>База данных</h5>
                <p>Все принятые решения сохраняются в локальной базе данных для последующего анализа и обучения системы.</p>
            </div>
        </div>
    `;
    
    showModal('Документация', modalBody);
}

// Показать модальное окно
function showModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('modalOverlay').classList.add('active');
}

// Закрыть модальное окно
function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

// Инициализация графиков
function initCharts() {
    // Инициализация графиков будет в отдельном файле charts.js
    console.log('Charts initialized');
}

// Обновление графиков
function updateCharts() {
    console.log('Charts updated');
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', initApp);
