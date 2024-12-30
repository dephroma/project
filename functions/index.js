require('dotenv').config();
const { VK, Keyboard } = require('vk-io');
const he = require('he'); // Подключение библиотеки для декодирования HTML-символов

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
    const message = he.decode(context.text.trim()).toLowerCase(); // Декодирование и приведение к нижнему регистру
    console.log('Получено сообщение:', message);

    if (['привет', 'старт', 'начало'].includes(message)) {
        console.log('Отправка приветственного сообщения');
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
    // Декодирование сообщения
    const text = he.decode(context.text.trim()).toLowerCase(); // нижний регистр + декодирование смайла
    console.log('Получено сообщение:', text);

    if (['привет', 'старт', 'начало'].includes(text)) {
        console.log('Отправка приветственного сообщения');
        await context.send({
            message: "Привет, дорогой путешественник! 👋\n\nЯ — ваш виртуальный гид. Помогу вам выбрать идеальный тур, отвечу на вопросы и оформлю заявку.\n\nЧем могу помочь?\n\nВыберите опцию в меню ниже.\nИли напишите ваш вопрос прямо сюда, и я отвечу! 😊",
            keyboard: Keyboard.keyboard([
                [
                    Keyboard.textButton({
                        label: '📜 Каталог и бронирование',
                        color: Keyboard.POSITIVE_COLOR,
                        payload: JSON.stringify({ button: 'catalog' }) // Добавляем payload для кнопки
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
    } else if (context.payload) {
        // Обработка кнопки с payload
        const payload = JSON.parse(context.payload);

        if (payload.button === 'catalog') {
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
                            color: Keyboard.PRIMARY_COLOR
                        })
                    ]
                ]).oneTime()
            });
        }
    }
});