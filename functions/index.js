require('dotenv').config();
const { VK, Keyboard, Carousel, CarouselElement } = require('vk-io');

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
    const text = context.text.trim().toLowerCase();
    const payload = context.message.payload ? JSON.parse(context.message.payload) : null;

    // Приветственное сообщение и начало работы с ботом
    if (['привет', 'старт', 'начало'].includes(text)) {
        await context.send({
            message: `Привет, дорогой путешественник!👋\n\n Я — ваш виртуальный гид. Помогу вам выбрать идеальный тур, отвечу на вопросы и оформлю заявку. \n\nЧем могу помочь? \n\nВыберите опцию в меню ниже. \nИли напишите ваш вопрос прямо сюда, и я отвечу!😊`,
            keyboard: Keyboard.keyboard([
                [
                    Keyboard.textButton({
                        label: '\u{1F4D6} Каталог и бронирование',  // 📚
                        color: Keyboard.POSITIVE_COLOR
                    })
                ],
                [
                    Keyboard.textButton({
                        label: '\u{1F4C5} Даты и цены',  // 📅
                        color: Keyboard.PRIMARY_COLOR
                    })
                ],
                [
                    Keyboard.textButton({
                        label: '\u{2753} Частые вопросы',  // ❓
                        color: Keyboard.NEGATIVE_COLOR
                    })
                ]
            ]).oneTime()
        });
    }

    // Обработка кнопки "Каталог и бронирование"
    if (text === '\u{1F4D6} Каталог и бронирование') {
        await context.send({
            message: `Ознакомьтесь с нашим каталогом туров. У нас есть:\n\n\u{1F31F} Экскурсии на 1 день — отличная возможность подарить себе яркие впечатления и познакомиться с республикой за один день. \n\u{2728} Многодневные туры — для тех, кто хочет отдохнуть душой, насладиться природой и открыть для себя весь колорит региона. \n\nВыберите подходящий маршрут и нажмите «Забронировать» на карточке товара. \nПосле этого я помогу оформить заявку!`,
            keyboard: Keyboard.keyboard([
                [
                    Keyboard.textButton({
                        label: '\u{1F31F} Экскурсии на 1 день',  // 🌟
                        color: Keyboard.POSITIVE_COLOR
                    })
                ],
                [
                    Keyboard.textButton({
                        label: '\u{2728} Многодневные туры',  // ✨
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

    // Обработка кнопки "Экскурсии на 1 день"
    if (text === '\u{1F31F} Экскурсии на 1 день') {
        await context.send({
            message: `Выберите вашу экскурсию! \u{1F31F}

Мы подготовили для вас маршруты, которые позволят за один день увидеть самое лучшее, что может предложить Дагестан.

Откройте подходящую экскурсию, чтобы узнать подробности, далее нажмите кнопку бронирования (бронировать/написать/связаться).

👇 Вот наш каталог экскурсий:`,
            keyboard: Keyboard.keyboard([
                [
                    Keyboard.textButton({
                        label: 'Назад',
                        color: Keyboard.PRIMARY_COLOR
                    })
                ]
            ]).oneTime(),
            attachment: [
                new Carousel([
                    new CarouselElement({
                        title: 'Знакомство с Дагестаном',
                        description: 'Визитная карточка Дагестана. Сюда едем первым делом!',
                        photo_id: 'photo-226855768_457239020',
                        buttons: [
                            Keyboard.textButton({
                                label: '👉выбрать экскурсию✨',
                                payload: JSON.stringify({ action: 'choose_1' }),
                                color: Keyboard.POSITIVE_COLOR
                            }),
                            Keyboard.textButton({
                                label: '↩ Назад',
                                payload: JSON.stringify({ action: 'back' }),
                                color: Keyboard.PRIMARY_COLOR
                            })
                        ]
                    }),
                    new CarouselElement({
                        title: 'Древний Дербент',
                        description: 'Самый древний город России. Прикоснитесь к античной истории!',
                        photo_id: 'photo-226855768_457239021',
                        buttons: [
                            Keyboard.textButton({
                                label: '👉выбрать экскурсию✨',
                                payload: JSON.stringify({ action: 'choose_2' }),
                                color: Keyboard.POSITIVE_COLOR
                            }),
                            Keyboard.textButton({
                                label: '↩ Назад',
                                payload: JSON.stringify({ action: 'back' }),
                                color: Keyboard.PRIMARY_COLOR
                            })
                        ]
                    }),
                    new CarouselElement({
                        title: '5 жемчужин Дагестана',
                        description: 'Эти прекрасные места спрятаны в самом сердце Дагестана. Они ждут ваших глаз!',
                        photo_id: 'photo-226855768_457239022',
                        buttons: [
                            Keyboard.textButton({
                                label: '👉выбрать экскурсию✨',
                                payload: JSON.stringify({ action: 'choose_3' }),
                                color: Keyboard.POSITIVE_COLOR
                            }),
                            Keyboard.textButton({
                                label: '↩ Назад',
                                payload: JSON.stringify({ action: 'back' }),
                                color: Keyboard.PRIMARY_COLOR
                            })
                        ]
                    })
                ])
            ]
        });
    }

    // Обработка действий пользователя с кнопками (выбор экскурсии или возврат)
    if (payload && payload.action && payload.action.startsWith('choose_')) {
        const excursionNumber = payload.action.split('_')[1];
        await context.send(`Вы выбрали экскурсию ${excursionNumber}. Пожалуйста, свяжитесь с нами для бронирования.`);
    }

    if (payload && payload.action === 'back') {
        await context.send({
            message: `Привет, дорогой путешественник!👋 Я — ваш виртуальный гид. Чем могу помочь?`,
            keyboard: Keyboard.keyboard([
                [
                    Keyboard.textButton({
                        label: '\u{1F4D6} Каталог и бронирование',  // 📚
                        color: Keyboard.POSITIVE_COLOR
                    })
                ],
                [
                    Keyboard.textButton({
                        label: '\u{1F4C5} Даты и цены',  // 📅
                        color: Keyboard.PRIMARY_COLOR
                    })
                ],
                [
                    Keyboard.textButton({
                        label: '\u{2753} Частые вопросы',  // ❓
                        color: Keyboard.NEGATIVE_COLOR
                    })
                ]
            ]).oneTime()
        });
    }
});
