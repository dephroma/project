require('dotenv').config();
const { VK, Keyboard, Carousel, CarouselElement } = require('vk-io');

const vk = new VK({
    token: process.env.VK_TOKEN,
    webhookSecret: process.env.VK_SECRET,
});

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const { type, group_id, secret } = body;

    // Проверка секретного ключа и ID группы
    if (secret !== process.env.VK_SECRET || group_id !== parseInt(process.env.VK_GROUP_ID, 10)) {
        return { statusCode: 403, body: 'Forbidden' };
    }

    if (type === 'confirmation') {
        return { statusCode: 200, body: process.env.VK_CONFIRMATION };
    }

    // Обработка событий
    await vk.updates.handleWebhookUpdate(body);
    return { statusCode: 200, body: 'OK' };
};

// Вспомогательные функции
const createButton = (label, color, payload = null) => Keyboard.textButton({ label, color, payload });
const createKeyboard = (buttons) => Keyboard.keyboard(buttons).oneTime();

// Данные карусели
const excursions = [
    {
        title: 'Знакомство с Дагестаном',
        description: 'Визитная карточка Дагестана. Сюда едем первым делом!',
        photo_id: 'photo-226855768_457239020',
        action: 'choose_1'
    },
    {
        title: 'Древний Дербент',
        description: 'Самый древний город России. Прикоснитесь к античной истории!',
        photo_id: 'photo-226855768_457239021',
        action: 'choose_2'
    },
    {
        title: '5 жемчужин Дагестана',
        description: 'Эти прекрасные места спрятаны в самом сердце Дагестана. Они ждут ваших глаз!',
        photo_id: 'photo-226855768_457239022',
        action: 'choose_3'
    }
];

const createCarousel = () => {
    return new Carousel(excursions.map(exc => new CarouselElement({
        title: exc.title,
        description: exc.description,
        photo_id: exc.photo_id,
        buttons: [
            createButton('👉выбрать экскурсию✨', Keyboard.POSITIVE_COLOR, JSON.stringify({ action: exc.action })),
            createButton('↩ Назад', Keyboard.PRIMARY_COLOR, JSON.stringify({ action: 'back' }))
        ]
    })));
};

// Обработка событий VK
vk.updates.on('message_new', async (context) => {
    try {
        const text = context.text.trim().toLowerCase();
        const payload = context.message.payload ? JSON.parse(context.message.payload) : null;

        if (['привет', 'старт', 'начало'].includes(text)) {
            await context.send({
                message: `Привет, дорогой путешественник!👋\n\nЯ — ваш виртуальный гид. Помогу вам выбрать идеальный тур, отвечу на вопросы и оформлю заявку.\n\nЧем могу помочь? Выберите опцию в меню ниже или напишите ваш вопрос прямо сюда! 😊`,
                keyboard: createKeyboard([
                    [createButton('\u{1F4DA} Каталог и бронирование', Keyboard.POSITIVE_COLOR)],
                    [createButton('\u{1F4C5} Даты и цены', Keyboard.PRIMARY_COLOR)],
                    [createButton('\u{2753} Частые вопросы', Keyboard.NEGATIVE_COLOR)]
                ])
            });
        } else if (text === '\u{1F4D6} Каталог и бронирование') {
            await context.send({
                message: `Ознакомьтесь с нашим каталогом туров. У нас есть:\n\n\u{1F31F} Экскурсии на 1 день — яркие впечатления за один день.\n\u{2728} Многодневные туры — отдых душой и знакомство с природой.\n\nВыберите маршрут и нажмите «Забронировать»!`,
                keyboard: createKeyboard([
                    [createButton('\u{1F31F} Экскурсии на 1 день', Keyboard.POSITIVE_COLOR)],
                    [createButton('\u{2728} Многодневные туры', Keyboard.POSITIVE_COLOR)],
                    [createButton('Назад', Keyboard.PRIMARY_COLOR)]
                ])
            });
        } else if (text === '\u{1F31F} Экскурсии на 1 день') {
            await context.send({
                message: `Выберите вашу экскурсию! 🌟\n\nМы подготовили маршруты для знакомства с Дагестаном за один день. Откройте экскурсию, чтобы узнать подробности, и нажмите кнопку бронирования!`,
                keyboard: createKeyboard([[createButton('Назад', Keyboard.PRIMARY_COLOR)]]),
                attachment: createCarousel()
            });
        } else if (payload && payload.action && payload.action.startsWith('choose_')) {
            const excursionNumber = payload.action.split('_')[1];
            await context.send(`Вы выбрали экскурсию ${excursionNumber}. Пожалуйста, свяжитесь с нами для бронирования.`);
        } else if (payload && payload.action === 'back') {
            await context.send({
                message: `Привет, дорогой путешественник!👋 Я — ваш виртуальный гид. Чем могу помочь?`,
                keyboard: createKeyboard([
                    [createButton('\u{1F4D6} Каталог и бронирование', Keyboard.POSITIVE_COLOR)],
                    [createButton('\u{1F4C5} Даты и цены', Keyboard.PRIMARY_COLOR)],
                    [createButton('\u{2753} Частые вопросы', Keyboard.NEGATIVE_COLOR)]
                ])
            });
        }
    } catch (error) {
        console.error('Ошибка обработки сообщения:', error);
        await context.send('Произошла ошибка. Попробуйте снова позже.');
    }
});
