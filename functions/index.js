require('dotenv').config();
const { VK } = require('vk-io');

const vk = new VK({
    token: process.env.VK_TOKEN,
    webhookSecret: process.env.VK_SECRET,
});

exports.handler = async (event, context) => {
    const body = JSON.parse(event.body);
    const { type, group_id, secret } = body;

    // Проверка секретного ключа и ID группы
    if (secret !== process.env.VK_SECRET || group_id !== parseInt(process.env.VK_GROUP_ID, 10)) {
        return {
            statusCode: 403,
            body: 'Forbidden',
        };
    }

    if (type === 'confirmation') {
        return {
            statusCode: 200,
            body: process.env.VK_CONFIRMATION,
        };
    }

    // Обработка событий, например, новое сообщение
    await vk.updates.handleWebhookUpdate(body);

    return {
        statusCode: 200,
        body: 'OK',
    };
};

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

    console.log('asdasd')
});
