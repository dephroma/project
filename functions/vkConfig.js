//НИХУЯ НЕ ПОЛУЧАЕТСЯ СТРУКТУРА
require('dotenv').config(); // Подключение переменных окружения
const { VK } = require('vk-io');

// Инициализация VK API
const vk = new VK({
    token: process.env.VK_TOKEN,
    webhookSecret: process.env.VK_SECRET,
});

// Экспортируем объект VK для использования в других файлах
module.exports = vk;