const vk = require('./vkConfig'); // Подключаем VK из конфигурации

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const { type, group_id, secret } = body;

    // Проверка безопасности
    if (secret !== process.env.VK_SECRET || group_id !== parseInt(process.env.VK_GROUP_ID, 10)) {
        return {
            statusCode: 403,
            body: 'Forbidden',
        };
    }

    // Обработка подтверждения сервера
    if (type === 'confirmation') {
        return {
            statusCode: 200,
            body: process.env.VK_CONFIRMATION,
        };
    }

    // Обработка событий VK
    await vk.updates.handleWebhookUpdate(body);

    return {
        statusCode: 200,
        body: 'OK',
    };
};