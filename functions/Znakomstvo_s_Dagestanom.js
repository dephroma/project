require('dotenv').config();

const { VK, Keyboard } = require('vk-io');

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

vk.updates.on('message_new', async (context) => {

    const text = context.text.trim().toLowerCase();
    console.log('Получено сообщение:', text);
    
    if (['тур', 'биба', 'хуй', 'bye'].includes(text)) {
        await context.send({
            message: "Привет, дорогой путешественник!👋\n\nЯ — ваш виртуальный гид. Помогу вам выбрать идеальный тур, отвечу на вопросы и оформлю заявку.\n\nЧем могу помочь?\n\nВыберите опцию в меню ниже. Или напишите ваш вопрос прямо сюда, и я отвечу! 😊",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{1f4da} Каталог и бронирование', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{1f5d3} Даты и цены', color: Keyboard.PRIMARY_COLOR })],
                [Keyboard.textButton({ label: '\u{1f4ac} Частые вопросы', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime(),
        });
    } 

    // Другие обработки сообщений (например, "Условия оплаты и бронирование", "Бронировать", и т.д.) добавляются здесь...

});

// Функция для получения имени пользователя по его ID



