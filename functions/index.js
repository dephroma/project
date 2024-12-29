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

    if (['привет', 'старт', 'начало'].includes(message)) {
        await context.send({
            message: "Привет, дорогой путешественник! 👋\n\nЯ — ваш виртуальный гид. Помогу вам выбрать идеальный тур, отвечу на вопросы и оформлю заявку.\n\nЧем могу помочь?\n\nВыберите опцию в меню ниже.\nИли напишите ваш вопрос прямо сюда, и я отвечу! 😊",
            keyboard: Keyboard.keyboard([
                [
                    Keyboard.textButton({
                        label: '📜 Каталог и бронирование',
                        color: Keyboard.POSITIVE_COLOR
                    })
                ],
                [
                    Keyboard.textButton({
                        label: '🗓️ Даты и цены',
                        color: Keyboard.PRIMARY_COLOR
                    })
                ],
                [
                    Keyboard.textButton({
                        label: '💬 Частые вопросы',
                        color: Keyboard.NEGATIVE_COLOR
                    })
                ]
            ]).oneTime()
        });
    }
});

// Обработка нажатий на кнопки
vk.updates.on('message_new', async (context) => {
    const text = context.text;

    switch (text) {
        case '📜 Каталог и бронирование':
            await context.send("📜 Вот наш каталог и опции бронирования: <ссылка или информация>");
            break;
        case '🗓️ Даты и цены':
            await context.send("🗓️ Здесь вы найдёте актуальные даты и цены: <ссылка или информация>");
            break;
        case '💬 Частые вопросы':
            await context.send("💬 Вот ответы на частые вопросы: <ссылка или информация>");
            break;
        default:
            if (!['привет', 'старт', 'начало'].includes(text.toLowerCase())) {
                await context.send("Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время. 😊");
            }
    }
});

