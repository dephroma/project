require('dotenv').config();
const { VK, Keyboard } = require('vk-io');

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
    const message = context.text.trim().toLowerCase(); // Декодирование и приведение к нижнему регистру
    console.log('Получено сообщение:', message);

    if (['привет', 'старт', 'начало'].includes(message)) {
        console.log('Отправка приветственного сообщения');
        await context.send({
            message: "Привет, дорогой путешественник!\n\nЯ — ваш виртуальный гид. Помогу вам выбрать идеальный тур, отвечу на вопросы и оформлю заявку.\n\nЧем могу помочь?\n\nВыберите опцию в меню ниже.\nИли напишите ваш вопрос прямо сюда, и я отвечу!",
            keyboard: Keyboard.keyboard([
                [
                    Keyboard.textButton({
                        label: 'Каталог и бронирование',
                        color: Keyboard.POSITIVE_COLOR
                    })
                ],
                [
                    Keyboard.textButton({
                        label: 'Даты и цены',
                        color: Keyboard.PRIMARY_COLOR
                    })
                ],
                [
                    Keyboard.textButton({
                        label: 'Частые вопросы',
                        color: Keyboard.NEGATIVE_COLOR
                    })
                ]
            ]).oneTime()
        });
    }
});

// Обработка нажатий на кнопки
vk.updates.on('message_new', async (context) => {
    const text = context.text.trim(); // Убираем лишние пробелы
    console.log('Нажата кнопка:', text);

    switch (text) {
        case 'Каталог и бронирование':
            await context.send({
                message: "Ознакомьтесь с нашим каталогом туров. У нас есть:\nЭкскурсии на 1 день — отличная возможность подарить себе яркие впечатления и познакомиться с республикой за один день.\nМногодневные туры — для тех, кто хочет отдохнуть душой, насладиться природой и открыть для себя весь колорит региона.\n\nВыберите подходящий маршрут и нажмите «Забронировать» на карточке товара. После этого я помогу оформить заявку!",
                keyboard: Keyboard.keyboard([
                    [
                        Keyboard.textButton({
                            label: 'Экскурсии на 1 день',
                            color: Keyboard.POSITIVE_COLOR
                        })
                    ],
                    [
                        Keyboard.textButton({
                            label: 'Многодневные туры',
                            color: Keyboard.POSITIVE_COLOR
                        })
                    ],
                    [
                        Keyboard.textButton({
                            label: 'Назад',
                            color: Keyboard.PRIMARY_COLOR
                        })
                    ]
                ]).oneTime()
            });
            break;
        case 'Даты и цены':
            await context.send("Здесь вы найдёте актуальные даты и цены: <ссылка или информация>");
            break;
        case 'Частые вопросы':
            await context.send("Вот ответы на частые вопросы: <ссылка или информация>");
            break;
        case 'Назад':
            await context.send({
                message: "Привет, дорогой путешественник!\n\nЯ — ваш виртуальный гид. Помогу вам выбрать идеальный тур, отвечу на вопросы и оформлю заявку.\n\nЧем могу помочь?\n\nВыберите опцию в меню ниже.\nИли напишите ваш вопрос прямо сюда, и я отвечу!",
                keyboard: Keyboard.keyboard([
                    [
                        Keyboard.textButton({
                            label: 'Каталог и бронирование',
                            color: Keyboard.POSITIVE_COLOR
                        })
                    ],
                    [
                        Keyboard.textButton({
                            label: 'Даты и цены',
                            color: Keyboard.PRIMARY_COLOR
                        })
                    ],
                    [
                        Keyboard.textButton({
                            label: 'Частые вопросы',
                            color: Keyboard.NEGATIVE_COLOR
                        })
                    ]
                ]).oneTime()
            });
            break;
        default:
            if (!['привет', 'старт', 'начало'].includes(text.toLowerCase())) {
                await context.send("Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.");
            }
    }
});
