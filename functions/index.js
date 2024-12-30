require('dotenv').config();
const { VK, Keyboard } = require('vk-io');
const he = require('he');

const vk = new VK({
    token: process.env.VK_TOKEN,
    webhookSecret: process.env.VK_SECRET,
});

// Функция для отправки приветственного сообщения
async function sendWelcomeMessage(context) {
    await context.send({
        message: "Привет, дорогой путешественник! 👋\n\nЯ — ваш виртуальный гид. Помогу вам выбрать идеальный тур, отвечу на вопросы и оформлю заявку.\n\nЧем могу помочь?\n\nВыберите опцию в меню ниже.\nИли напишите ваш вопрос прямо сюда, и я отвечу! 😊",
        keyboard: Keyboard.keyboard([
            [
                Keyboard.textButton({
                    label: '&#128220; Каталог и бронирование',
                    color: Keyboard.POSITIVE_COLOR,
                    payload: JSON.stringify({ button: 'catalog' })
                })
            ],
            [
                Keyboard.textButton({
                    label: '🗓️ Даты и цены',
                    color: Keyboard.PRIMARY_COLOR,
                    payload: JSON.stringify({ button: 'dates' })
                })
            ],
            [
                Keyboard.textButton({
                    label: '💬 Частые вопросы',
                    color: Keyboard.NEGATIVE_COLOR,
                    payload: JSON.stringify({ button: 'faq' })
                })
            ]
        ]).oneTime()
    });
}

// Функция для отправки сообщения с каталогом
async function sendCatalogMessage(context) {
    await context.send({
        message: "Ознакомьтесь с нашим каталогом туров. У нас есть:\n🌟 Экскурсии на 1 день — отличная возможность подарить себе яркие впечатления и познакомиться с республикой за один день.\n🏞️ Многодневные туры — для тех, кто хочет отдохнуть душой, насладиться природой и открыть для себя весь колорит региона.\n\nВыберите подходящий маршрут и нажмите «Забронировать» на карточке товара. После этого я помогу оформить заявку!",
        keyboard: Keyboard.keyboard([
            [
                Keyboard.textButton({
                    label: '🌟 Экскурсии на 1 день',
                    color: Keyboard.POSITIVE_COLOR
                })
            ],
            [
                Keyboard.textButton({
                    label: '🛏️ Многодневные туры',
                    color: Keyboard.POSITIVE_COLOR
                })
            ],
            [
                Keyboard.textButton({
                    label: '↩ Назад',
                    color: Keyboard.PRIMARY_COLOR,
                    payload: JSON.stringify({ button: 'back' })
                })
            ]
        ]).oneTime()
    });
}

// Основной обработчик событий
vk.updates.on('message_new', async (context) => {
    const message = he.decode(context.text.trim()).toLowerCase();
    console.log('Получено сообщение:', message);

    if (['привет', 'старт', 'начало'].includes(message)) {
        console.log('Отправка приветственного сообщения');
        await sendWelcomeMessage(context);
        return;
    }

    let payload;
    try {
        if (context.payload) {
            // Убираем лишние кавычки и экранирование
            const decodedPayload = he.decode(context.payload);
            payload = JSON.parse(decodedPayload);
            console.log('Payload:', payload);
        }
    } catch (e) {
        console.log('Ошибка при парсинге payload:', e);
        return;
    }

    // Обработка кнопки "Каталог и бронирование"
    if (payload && payload.button === 'catalog') {
        await sendCatalogMessage(context);
    } else if (payload && payload.button === 'dates') {
        await context.send("🗓️ Здесь вы найдёте актуальные даты и цены: <ссылка или информация>");
    } else if (payload && payload.button === 'faq') {
        await context.send("💬 Вот ответы на частые вопросы: <ссылка или информация>");
    } else if (payload && payload.button === 'back') {
        await sendWelcomeMessage(context);
    }
});

// Обработка вебхуков
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

// Запуск бота
vk.updates.startPolling