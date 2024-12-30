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

// Обработка сообщений и кнопок
vk.updates.on('message_new', async (context) => {
    const text = context.text.trim();

    console.log('Получено сообщение:', text);

    // Приветственное сообщение
    if (['привет', 'старт', 'начало'].includes(text.toLowerCase())) {
        console.log('Отправка приветственного сообщения');
        await context.send({
            message: "Привет, дорогой путешественник! Я — ваш виртуальный гид. Чем могу помочь?",
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

    // Обработка кнопки "Каталог и бронирование"
    if (text === 'Каталог и бронирование') {
        console.log('Обработка кнопки "Каталог и бронирование"');
        await context.send({
            message: "Ознакомьтесь с нашим каталогом туров. У нас есть:\n1. Экскурсии на 1 день — отличная возможность подарить себе яркие впечатления и познакомиться с республикой за один день.\n2. Многодневные туры — для тех, кто хочет отдохнуть душой, насладиться природой и открыть для себя весь колорит региона.",
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
    }

    // Обработка кнопки "Назад"
    if (text === 'Назад') {
        console.log('Обработка кнопки "Назад"');
        await context.send({
            message: "Привет, дорогой путешественник! Я — ваш виртуальный гид. Чем могу помочь?",
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

    // Обработка кнопки "Даты и цены"
    if (text === 'Даты и цены') {
        console.log('Обработка кнопки "Даты и цены"');
        await context.send({
            message: "Здесь вы найдете актуальные даты и цены на наши туры. Пожалуйста, выберите интересующую вас информацию.",
            keyboard: Keyboard.keyboard([
                [
                    Keyboard.textButton({
                        label: 'Назад',
                        color: Keyboard.PRIMARY_COLOR
                    })
                ]
            ]).oneTime()
        });
    }

    // Обработка кнопки "Частые вопросы"
    if (text === 'Частые вопросы') {
        console.log('Обработка кнопки "Частые вопросы"');
        await context.send({
            message: "Здесь вы найдете ответы на часто задаваемые вопросы. Если у вас есть другие вопросы, не стесняйтесь обращаться!",
            keyboard: Keyboard.keyboard([
                [
                    Keyboard.textButton({
                        label: 'Назад',
                        color: Keyboard.PRIMARY_COLOR
                    })
                ]
            ]).oneTime()
        });
    }
});

