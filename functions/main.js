//поставить его основным загрузочным в проекте и уже с него перенаправлять на нужного из ботов, в зависимости от слова-триггера, которое пришло на него.
require('dotenv').config();
const { VK } = require('vk-io');
const generalBot = require('./index');
const tourBot = require('./Znakomstvo_s_Dagestanom');

const vk = new VK({
    token: process.env.VK_TOKEN,
    webhookSecret: process.env.VK_SECRET,

});

exports.handler = async (event, context) => {
    const body = JSON.parse(event.body);
    const { type, group_id, secret } = body;

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

    await vk.updates.handleWebhookUpdate(body);

    return {
        statusCode: 200,
        body: 'OK',
    };
};

// Обработка сообщений и "разведение"
vk.updates.on('message_new', async (context) => {
    const message = context.text.trim().toLowerCase();

    if (['тур', 'биба', 'хуй', 'bye'].includes(text)) {
        // Передаём сообщение в файл логики тура
        await tourBot.handleMessage(context);
    } else if(['привет', 'старт', 'начало', 'hi'].includes(text)){
        // Передаём сообщение в файл логики общего бота
        await generalBot.handleMessage(context);
    }
});