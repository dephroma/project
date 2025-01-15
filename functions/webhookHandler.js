const vk = require('vk-io'); // Импортируйте ваш экземпляр VK API (если он есть)

const handler = async (event, context) => {
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

module.exports = { handler };
