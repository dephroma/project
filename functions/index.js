// const VKBot = require('node-vk-bot-api');
require('dotenv').config();
const { VK } = require('vk-io');
// const { HearManager } = require('@vk-io/hear');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// const bot = new VKBot({
//     token: process.env.VK_TOKEN,
//     confirmation: process.env.VK_CONFIRMATION,
//     secret: process.env.VK_SECRET,
//   });

  const vk = new VK({
    token: process.env.VK_TOKEN,
    webhookSecret: process.env.VK_SECRET, // Секретный ключ, который вы установили в настройках
});

//   const hearManager = new HearManager();
//   hearManager.hear(/^start$/i, (context) => {
//     context.send('Привет! Я ваш новый бот. Чем могу помочь?');
//   });
// Обработка подтверждения сервера ВКонтакте
app.post('/', (req, res) => {
    const { type, group_id, secret } = req.body;

    // Проверка секретного ключа и ID группы
    if (secret !== process.env.VK_SECRET || group_id !== process.env.VK_GROUP_ID) {
        return res.sendStatus(403);
    }

    if (type === 'confirmation') {
        // Возвращаем строку, которую вы указали в настройках "Строка для подтверждения"
        return res.send(process.env.VK_CONFIRMATION);
    }

    // Обработка событий, например, новое сообщение
    vk.updates.handleWebhookUpdate(req.body);

    return res.sendStatus(200);
});

vk.updates.on('message_new', async (context) => {
    const message = context.text.toLowerCase();

    if (message.includes('привет')) {
        await context.send('Привет! Как я могу помочь вам сегодня?');
    } else if (message.includes('как дела')) {
        await context.send('У меня всё отлично, спасибо! А как у вас?');
    } else if (message.includes('пока')) {
        await context.send('До свидания! Хорошего дня!');
    } else {
        await context.send('Извините, я не понимаю этот вопрос. Попробуйте спросить что-то другое.');
    }
});
// bot.use(hearManager.middleware());
app.listen(3000, () => {
    console.log('Bot server is running on port 3000');
});