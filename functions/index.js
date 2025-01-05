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
    const text = context.text.trim().toLowerCase(); // Безопасное получение текста и приведение к нижнему регистру
    console.log('Получено сообщение:', text);

    if (['привет', 'старт', 'начало', 'hi'].includes(text.toLowerCase())) { // Сравнение в нижнем регистре
        await context.send({
            message: "Привет, дорогой путешественник!\n\nЯ — ваш виртуальный гид. Помогу вам выбрать идеальный тур, отвечу на вопросы и оформлю заявку.\n\nЧем могу помочь?\n\nВыберите опцию в меню ниже. Или напишите ваш вопрос прямо сюда, и я отвечу!",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: 'Каталог и бронирование', color: Keyboard.POSITIVE_COLOR })], // Убрал юникод, так проще сравнивать
                [Keyboard.textButton({ label: 'Даты и цены', color: Keyboard.PRIMARY_COLOR })],
                [Keyboard.textButton({ label: 'Частые вопросы', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime(),
        });
    } 
    
    else if (text === 'каталог и бронирование') { // Сравнение в нижнем регистре
        await context.send({
            message: "Ознакомьтесь с нашим каталогом туров. У нас есть:\n\n Экскурсии на 1 день — отличная возможность подарить себе яркие впечатления и познакомиться с республикой за один день.\n✨ Многодневные туры — для тех, кто хочет отдохнуть душой, насладиться природой и открыть для себя весь колорит региона.\n\nВыберите подходящий маршрут и нажмите «Забронировать» на карточке товара. После этого я помогу оформить заявку!",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: 'Экскурсии на 1 день', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: 'Многодневные туры', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: 'Назад', color: Keyboard.PRIMARY_COLOR })],
            ]).oneTime(),
        });
    } 
    
    else if (text === 'экскурсии на 1 день') { // Сравнение в нижнем регистре
        await context.send({
            message: `Выберите вашу экскурсию! \n\nМы подготовили для вас маршруты, которые позволят за один день увидеть самое лучшее, что может предложить Дагестан.\n\nОткройте подходящую экскурсию, чтобы узнать подробности, далее нажмите кнопку бронирования (бронировать/написать/связаться).\n\n Вот наш каталог экскурсий:`,
            keyboard: Keyboard.keyboard([
                [Keyboard.urlButton({ label: 'Знакомство с Дагестаном' , color: Keyboard.POSITIVE_COLOR, url: 'https://vk.com/market/product/znakomstvo-s-dagestanom-gory-barkhan-kanion-28295020-9825928' })], // URL-кнопка
                [Keyboard.urlButton({ label: 'Древний Дербент' , color: Keyboard.PRIMARY_COLOR, url: 'https://vk.com/market/product/drevniy-derbent-ves-derbent-fontany-lun-28295020-9863669' })], // URL-кнопка
                [Keyboard.urlButton({ label: '5 жемчужин Дагестана' , color: Keyboard.POSITIVE_COLOR,  url: 'https://vk.com/market/product/5-zhemchuzhin-dagestana-aul-prizrak-podzemny-vodopad-karstovy-proval-terrasy-28295020-9863569' })], // URL-кнопка
                [Keyboard.textButton({ label: 'Назад', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime(),
        });
    } 
    
    else if (text === 'назад') {         console.log('Обработка кнопки "Назад"');
        await context.send({
            message: "Привет, дорогой путешественник!👋 Я — ваш виртуальный гид. Чем могу помочь?",
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
    
    else if (text === 'даты и цены') {        console.log('Обработка кнопки "Даты и цены"');
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
    
    else if (text === 'частые вопросы') {         console.log('Обработка кнопки "Частые вопросы"');
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
    
    else { // Обработка других сообщений
        await context.send('Я не понимаю ваш запрос. Пожалуйста, используйте кнопки меню.');
    }
});