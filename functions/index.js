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
    if (['привет', 'старт', 'начало', 'hi'].includes(text.toLowerCase())) {
        console.log('Отправка приветственного сообщения');
        await context.send({
            message: "Привет, дорогой путешественник!👋\n\nЯ — ваш виртуальный гид. Помогу вам выбрать идеальный тур, отвечу на вопросы и оформлю заявку.\n\nЧем могу помочь?\n\nВыберите опцию в меню ниже. Или напишите ваш вопрос прямо сюда, и я отвечу!😊",
            keyboard: Keyboard.keyboard([
                [
                    Keyboard.textButton({
                        label: '\u{1f4dc} Каталог и бронирование', // Добавлен смайлик
                        color: Keyboard.POSITIVE_COLOR,
                    }),
                ],
                [
                    Keyboard.textButton({
                        label: '\u{1f5d3} Даты и цены',
                        color: Keyboard.PRIMARY_COLOR,
                    }),
                ],
                [
                    Keyboard.textButton({
                        label: '\u{1f4ac} Частые вопросы',
                        color: Keyboard.NEGATIVE_COLOR,
                    }),
                ],
            ]).oneTime(),
        });
    }

    // Обработка кнопки "Каталог и бронирование"
    if (text === '\u{1f4dc} Каталог и бронирование') {
        console.log('Обработка кнопки "Каталог и бронирование"');
        await context.send({
            message: "Ознакомьтесь с нашим каталогом туров. У нас есть:\n\n🌟 Экскурсии на 1 день — отличная возможность подарить себе яркие впечатления и познакомиться с республикой за один день.\n✨ Многодневные туры — для тех, кто хочет отдохнуть душой, насладиться природой и открыть для себя весь колорит региона.\n\nВыберите подходящий маршрут и нажмите «Забронировать» на карточке товара. После этого я помогу оформить заявку!",
            keyboard: Keyboard.keyboard([
                [
                    Keyboard.textButton({
                        label: '\u{1f31f} Экскурсии на 1 день',
                        color: Keyboard.POSITIVE_COLOR,
                    }),
                ],
                [
                    Keyboard.textButton({
                        label: '\u{2728} Многодневные туры',
                        color: Keyboard.POSITIVE_COLOR,
                    }),
                ],
                [
                    Keyboard.textButton({
                        label: 'Назад',
                        color: Keyboard.PRIMARY_COLOR,
                    }),
                ],
            ]).oneTime(),
        });
    }
// Обработка кнопки "Экскурсии на 1 день"
if (text === '\u{1f31f} Экскурсии на 1 день') {
    console.log('Обработка кнопки "Экскурсии на 1 день"');
    await context.send({
        message: `Выберите вашу экскурсию! 🌟

Мы подготовили для вас маршруты, которые позволят за один день увидеть самое лучшее, что может предложить Дагестан.

Откройте подходящую экскурсию, чтобы узнать подробности, далее нажмите кнопку бронирования (бронировать/написать/связаться).

👇 Вот наш каталог экскурсий:`,
        keyboard: Keyboard.keyboard([
            [
                Keyboard.textButton({
                    label: ' Знакомство с Дагестаном, горы, бархан, каньон',
                    url: 'https://vk.com/market/product/znakomstvo-s-dagestanom-gory-barkhan-kanion-28295020-9825928',
                    color: Keyboard.POSITIVE_COLOR,
                }),
            ],
            [
                Keyboard.textButton({
                    label: ' Древний Дербент, весь Дербент, фонтаны Лун',
                    url: 'https://vk.com/market/product/drevniy-derbent-ves-derbent-fontany-lun-28295020-9863669',
                    color: Keyboard.POSITIVE_COLOR,
                }),
            ],
            [
                Keyboard.textButton({
                    label: ' 5 жемчужин Дагестана, аул Призрак, подземный водопад',
                    url: 'https://vk.com/market/product/5-zhemchuzhin-dagestana-aul-prizrak-podzemny-vodopad-karstovy-proval-terrasy-28295020-9863569',
                    color: Keyboard.POSITIVE_COLOR,
                }),
            ],
            [
                Keyboard.textButton({
                    label: 'Назад',
                    color: Keyboard.PRIMARY_COLOR,
                }),
            ],
        ]).oneTime(),
    });
}

    // Обработка кнопки "Назад"
    if (text === 'Назад') {
        console.log('Обработка кнопки "Назад"');
        await context.send({
            message: "Привет, дорогой путешественник!👋 Я — ваш виртуальный гид. Чем могу помочь?",
            keyboard: Keyboard.keyboard([
                [
                    Keyboard.textButton({
                        label: '\u{1f4dc} Каталог и бронирование',
                        color: Keyboard.POSITIVE_COLOR,
                    }),
                ],
                [
                    Keyboard.textButton({
                        label: '\u{1f5d3} Даты и цены',
                        color: Keyboard.PRIMARY_COLOR,
                    }),
                ],
                [
                    Keyboard.textButton({
                        label: '\u{1f4ac} Частые вопросы',
                        color: Keyboard.NEGATIVE_COLOR,
                    }),
                ],
            ]).oneTime(),
        });
    }

    // Обработка кнопки "Даты и цены"
    if (text === '\u{1f5d3} Даты и цены') {
        console.log('Обработка кнопки "Даты и цены"');
        await context.send({
            message: "Здесь вы найдете актуальные даты и цены на наши туры. Пожалуйста, выберите интересующую вас информацию.",
            keyboard: Keyboard.keyboard([
                [
                    Keyboard.textButton({
                        label: 'Назад',
                        color: Keyboard.PRIMARY_COLOR,
                    }),
                ],
            ]).oneTime(),
        });
    }

    // Обработка кнопки "Частые вопросы"
    if (text === '\u{1f4ac} Частые вопросы') {
        console.log('Обработка кнопки "Частые вопросы"');
        await context.send({
            message: "Здесь вы найдете ответы на часто задаваемые вопросы. Если у вас есть другие вопросы, не стесняйтесь обращаться!",
            keyboard: Keyboard.keyboard([
                [
                    Keyboard.textButton({
                        label: 'Назад',
                        color: Keyboard.PRIMARY_COLOR,
                    }),
                ],
            ]).oneTime(),
        });
    }
});
