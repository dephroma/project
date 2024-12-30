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
    }
});

// Обработка нажатий на кнопки с использованием payload
vk.updates.on('message_new', async (context) => {
    // Пытаемся распарсить payload
    let payload;
    try {
        // Декодируем экранированный payload
        payload = JSON.parse(he.decode(context.payload)); // Сначала декодируем
        console.log('Payload:', payload);
    } catch (e) {
        console.log('Ошибка при парсинге payload:', e);
        return;
    }

    // Если кнопка "Каталог и бронирование"
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
    } else {
        console.log('Неизвестный payload:', payload);
    }
});

// Обработка других сообщений (например, если не была нажата кнопка)
vk.updates.on('message_new', async (context) => {
    const text = he.decode(context.text.trim()); // Убираем лишние пробелы и декодируем HTML-символы
    console.log('Нажата кнопка или сообщение:', text);

    switch (text) {
        case '🗓️ Даты и цены':
            await context.send("🗓️ Здесь вы найдёте актуальные даты и цены: <ссылка или информация>");
            break;
        case '💬 Частые вопросы':
            await context.send("💬 Вот ответы на частые вопросы: <ссылка или информация>");
            break;
        case '↩ Назад':
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
            break;
        default:
            if (!['привет', 'старт', 'начало'].includes(text.toLowerCase())) {
                await context.send("Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время. 😊");
            }
    }
});
