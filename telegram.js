// Инициализация Telegram Web App
function initTelegramApp() {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Расширяем на весь экран
        tg.expand();
        
        // Устанавливаем тему
        if (tg.colorScheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.getElementById('themeSwitch').checked = true;
        }
        
        // Используем данные пользователя
        const user = tg.initDataUnsafe?.user;
        if (user) {
            console.log('Telegram user:', user);
            // Можно использовать user.first_name, user.username и т.д.
            
            // Пример: добавить приветствие
            const welcomeMessage = `Привет, ${user.first_name || 'друг'}! ✨`;
            document.getElementById('questionInput').placeholder = welcomeMessage + ' Задай свой вопрос...';
        }
        
        // Кнопка "Назад" в Telegram
        tg.BackButton.onClick(() => {
            window.history.back();
        });
        
        tg.BackButton.show();
        
        // Обработка изменения видимости
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                tg.BackButton.hide();
            } else {
                tg.BackButton.show();
            }
        });
        
        // Основные кнопки
        tg.MainButton.setText('🎲 Крутить колесо');
        tg.MainButton.onClick(() => {
            document.getElementById('spinBtn').click();
        });
        
        // Показываем кнопку, когда есть вопрос
        const questionInput = document.getElementById('questionInput');
        questionInput.addEventListener('input', () => {
            if (questionInput.value.trim()) {
                tg.MainButton.show();
            } else {
                tg.MainButton.hide();
            }
        });
        
        // Закрытие приложения
        window.addEventListener('beforeunload', () => {
            tg.close();
        });
    }
}

// Инициализация при загрузке
if (window.Telegram && window.Telegram.WebApp) {
    initTelegramApp();
} else {
    console.log('Telegram Web App не обнаружен, работаем как веб-приложение');
}
