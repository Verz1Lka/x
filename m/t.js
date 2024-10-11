// script.js

const touchArea = document.getElementById('touchArea');
const logArea = document.getElementById('log');

let touchStartTime = 0;
let touchStartX = 0;
let touchStartY = 0;

// Функция для добавления записи в лог
function addLogEntry(entry) {
    const entryDiv = document.createElement('div');
    entryDiv.className = 'log-entry';
    entryDiv.innerHTML = entry;
    logArea.appendChild(entryDiv);
    // Прокрутка к последней записи
    logArea.scrollTop = logArea.scrollHeight;
}

// Обработчик события touchstart
touchArea.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) return; // Игнорировать множественные касания

    const touch = event.touches[0];
    touchStartTime = Date.now();
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}, false);

// Обработчик события touchend
touchArea.addEventListener('touchend', function(event) {
    if (event.changedTouches.length > 1) return; // Игнорировать множественные касания

    const touch = event.changedTouches[0];
    const touchEndTime = Date.now();
    const duration = touchEndTime - touchStartTime; // в миллисекундах
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;

    // Вычисляем координаты касания (можно использовать touchStartX/Y или touchEndX/Y)
    const x = touchEndX;
    const y = touchEndY;

    // Формируем запись для лога
    const logEntry = `
        <strong>Tap событие:</strong><br>
        Длительность: ${duration} мс<br>
        Координаты: (${x}, ${y})
    `;

    addLogEntry(logEntry);
}, false);

// Дополнительно: предотвращение стандартных действий при касании
touchArea.addEventListener('touchmove', function(event) {
    event.preventDefault();
}, false);