const { VK, Keyboard, Carousel, CarouselElement } = require('vk-io');
require('dotenv').config();

const vk = new VK({
    token: process.env.VK_TOKEN,
    webhookSecret: process.env.VK_SECRET,
});

exports.handler = async (event, context) => {
    const body = JSON.parse(event.body);
    const { type, group_id, secret } = body;

    // Проверка секретного ключа и ID группы
    if (secret !== process.env.VK_SECRET || group_id !== parseInt(process.env.VK_GROUP_ID, 10)) {
        return { statusCode: 403, body: 'Forbidden' };
    }

    if (type === 'confirmation') {
        return { statusCode: 200, body: process.env.VK_CONFIRMATION };
    }

    // Обработка событий, например, новое сообщение
    await vk.updates.handleWebhookUpdate(body);

    return { statusCode: 200, body: 'OK' };
};

// Обработка новых сообщений
vk.updates.on('message_new', async (context) => {
    try {
        const text = context.text.trim().toLowerCase();
        const payload = context.message.payload ? JSON.parse(context.message.payload) : null;

        if (['привет', 'старт', 'начало'].includes(text)) {
            await context.send({
                message: 'Привет! Выберите опцию ниже:',
                keyboard: Keyboard.keyboard([
                    [Keyboard.textButton({ label: 'Каталог', color: Keyboard.POSITIVE_COLOR })],
                    [Keyboard.textButton({ label: 'Карусель', color: Keyboard.PRIMARY_COLOR })],
                    [Keyboard.textButton({ label: 'Назад', color: Keyboard.NEGATIVE_COLOR })],
                ]).oneTime(),
            });
        }

        // Обработка кнопки "Каталог"
        if (text === 'каталог') {
            await context.send({
                message: 'Ознакомьтесь с нашим каталогом туров:',
                keyboard: Keyboard.keyboard([
                    [Keyboard.textButton({ label: 'Экскурсии на 1 день', color: Keyboard.POSITIVE_COLOR })],
                    [Keyboard.textButton({ label: 'Многодневные туры', color: Keyboard.POSITIVE_COLOR })],
                    [Keyboard.textButton({ label: 'Назад', color: Keyboard.PRIMARY_COLOR })],
                ]).oneTime(),
            });
        }

        // Обработка кнопки "Карусель"
        if (text === 'карусель') {
            await context.send({
                message: 'Выберите экскурсию:',
                attachment: [
                    new Carousel([
                        new CarouselElement({
                            title: 'Экскурсия 1',
                            description: 'Описание экскурсии 1',
                            photo_id: 'photo-12345_67890',
                            buttons: [
                                Keyboard.textButton({
                                    label: 'Выбрать',
                                    payload: JSON.stringify({ action: 'choose_1' }),
                                    color: Keyboard.POSITIVE_COLOR,
                                }),
                            ],
                        }),
                        new CarouselElement({
                            title: 'Экскурсия 2',
                            description: 'Описание экскурсии 2',
                            photo_id: 'photo-12345_67891',
                            buttons: [
                                Keyboard.textButton({
                                    label: 'Выбрать',
                                    payload: JSON.stringify({ action: 'choose_2' }),
                                    color: Keyboard.POSITIVE_COLOR,
                                }),
                            ],
                        }),
                    ]),
                ],
            });
        }

        // Обработка выбора экскурсии из карусели
        if (payload && payload.action && payload.action.startsWith('choose_')) {
            const excursionNumber = payload.action.split('_')[1];
            await context.send(`Вы выбрали экскурсию ${excursionNumber}. Пожалуйста, свяжитесь с нами для бронирования.`);
        }

        // Обработка кнопки "Назад"
        if (text === 'назад') {
            await context.send({
                message: 'Возврат в главное меню:',
                keyboard: Keyboard.keyboard([
                    [Keyboard.textButton({ label: 'Каталог', color: Keyboard.POSITIVE_COLOR })],
                    [Keyboard.textButton({ label: 'Карусель', color: Keyboard.PRIMARY_COLOR })],
                ]).oneTime(),
            });
        }
    } catch (error) {
        console.error('Ошибка обработки сообщения:', error);
    }
});
